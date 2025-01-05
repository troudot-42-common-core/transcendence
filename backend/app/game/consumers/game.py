import asyncio
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from ..models import Game, Tournament
from ..pong import FPS_SERVER
from .utils import is_authenticated
from ..multiplayer import MultiplayerPong, GAME_STATES, GameNotFoundException, GameFullException


class TournamentNotInProgressException(Exception):
    pass


class PlayerNotInGameException(Exception):
    pass

global multiplayer_pong
multiplayer_pong= MultiplayerPong()

class GameConsumer(AsyncJsonWebsocketConsumer):
    groups = []

    async def custom_group_send(self: AsyncJsonWebsocketConsumer, group_name: str, message: str, channels:any=False) -> None:
        active_players = multiplayer_pong.get_channels(group_name) if not channels else channels
        for player in active_players.values():
            await self.channel_layer.send(player, message)


    @is_authenticated
    async def connect(self: AsyncJsonWebsocketConsumer) -> None:
        self.new_room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = "game_%s" % self.new_room_name
        try:
            await self.get_game(self.new_room_name)
            await multiplayer_pong.add_player(self.new_room_name, self.scope['user'].username, self.channel_name, self.scope['user'].display_name)
            if multiplayer_pong.game_full(self.new_room_name):
                await self.custom_group_send(self.new_room_name, {
                    'type': 'game.full',
                    'game_full': True
                })
        except GameNotFoundException or TournamentNotInProgressException or PlayerNotInGameException or GameFullException:
            return await self.close()
        return await self.accept()

    @is_authenticated
    async def receive_json(self: AsyncJsonWebsocketConsumer, content: dict) -> None:
        try:
            if 'action' in content and content['action'] == 'ask':
                await self.custom_group_send(self.new_room_name, {
                    'type': 'game.full',
                    'game_full': multiplayer_pong.game_full(self.new_room_name)
                })
            elif 'action' in content and content['action'] == 'start' and multiplayer_pong.get_game_status(
                    self.new_room_name) == GAME_STATES[0]:
                multiplayer_pong.start_game(self.new_room_name)
                asyncio.create_task(self.game_loop())
            elif 'direction' in content and (content['direction'] == 'left' or content['direction'] == 'right'):
                multiplayer_pong.move_paddle(self.new_room_name, self.scope['user'].username, content['direction'])
        except GameNotFoundException:
            return await self.close_all_connections()

    async def game_loop(self: AsyncJsonWebsocketConsumer) -> None:
        try:
            while multiplayer_pong.get_game_status(self.new_room_name) == GAME_STATES[1]:
                await self.custom_group_send(self.new_room_name, {
                    'type': 'game.state',
                    'pong': multiplayer_pong.get_game_state(self.new_room_name),
                })
                multiplayer_pong.play_game(self.new_room_name)
                if multiplayer_pong.get_game_status(self.new_room_name) == GAME_STATES[2]:
                    channels = await multiplayer_pong.save_scores(self.new_room_name, delete_after_save=True)
                    return await self.close_all_connections(channels)
                await asyncio.sleep(FPS_SERVER)
        except GameNotFoundException:
            return await self.close_all_connections()

    async def game_finished(self: AsyncJsonWebsocketConsumer, event: dict) -> None:
        await self.send_json(event)

    async def game_state(self: AsyncJsonWebsocketConsumer, event: dict) -> None:
        await self.send_json(event)

    async def game_full(self: AsyncJsonWebsocketConsumer, event: dict) -> None:
        await self.send_json(event)

    async def close_all_connections(self: AsyncJsonWebsocketConsumer, channels:any=False) -> None:
        if self.room_group_name in self.groups:
            self.groups.remove(self.room_group_name)
        return await self.custom_group_send(self.new_room_name, {'type': 'disconnect'}, channels)

    @database_sync_to_async
    def get_game(self: AsyncJsonWebsocketConsumer, game_name: str) -> Game:
        game = Game.objects.filter(name=game_name, status='waiting').first()
        if not game:
            raise GameNotFoundException()
        if game.tournament_name and not Tournament.objects.filter(name=game.tournament_name, status='in_progress').first():
            raise TournamentNotInProgressException
        if game.tournament_name and self.scope['user'] not in game.players.all():
            raise PlayerNotInGameException
        return Game.objects.filter(name=game_name, status='waiting').first()

    @is_authenticated
    async def disconnect(self: AsyncJsonWebsocketConsumer, code: None) -> None:
        try:
            self.get_game(self.new_room_name)
            if multiplayer_pong.get_game_status(self.new_room_name) == GAME_STATES[1]:
                multiplayer_pong.set_game_status(self.new_room_name, GAME_STATES[2])
                await multiplayer_pong.save_scores(self.new_room_name, delete_after_save=True, loser=self.scope['user'].username)
                await self.close_all_connections()
            multiplayer_pong.remove_player(self.new_room_name, self.scope['user'].username)
            if not multiplayer_pong.game_full(self.new_room_name):
                await self.custom_group_send(self.new_room_name, {
                    'type': 'game.full',
                    'game_full': False
                })
        except GameNotFoundException:
            return await self.close()
        finally:
            return await self.close()

    @classmethod
    async def get_games(cls: type) -> list:
        return await multiplayer_pong.get_infos()

    @classmethod
    def add_room_to_groups(cls: type, room_group_name: str) -> None:
        if not room_group_name in cls.groups:
            cls.groups.append(room_group_name)

    @classmethod
    def is_a_game_in_progress(cls: type) -> bool:
        return multiplayer_pong.is_a_game_in_progress()
