import asyncio
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from users.models.users import Users # noqa: F401
from .utils import is_authenticated

from .game import multiplayer_pong

class GameHandlerConsumer(AsyncJsonWebsocketConsumer):
    channels = []

    async def custom_group_send(self: AsyncJsonWebsocketConsumer, message: str) -> None:
        for player in self.channels:
            await self.channel_layer.send(player, message)

    @is_authenticated
    async def connect(self: AsyncJsonWebsocketConsumer) -> None:
        self.channels.append(self.channel_name)
        await self.accept()
        self.task = asyncio.create_task(self.stream_games_infos())

    async def stream_games_infos(self: AsyncJsonWebsocketConsumer) -> None:
        while True:
            games = await multiplayer_pong.get_infos()
            await self.custom_group_send({'games': games or [], 'type': 'game.state'})
            await asyncio.sleep(1)

    async def disconnect(self: AsyncJsonWebsocketConsumer, code: object) -> object:
        self.task.cancel()
        self.channels.remove(self.channel_name)
        return await self.close()

    async def game_state(self: AsyncJsonWebsocketConsumer, event: dict) -> None:
        await self.send_json(event)
