from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .utils import is_authenticated


class TournamentConsumer(AsyncJsonWebsocketConsumer):
    instances = set()

    @is_authenticated
    async def connect(self: AsyncJsonWebsocketConsumer) -> None:
        self.tournament_name = self.scope["url_route"]["kwargs"]["tournament_name"]
        self.__class__.instances.add(self)
        await self.accept()

    async def disconnect(self: AsyncJsonWebsocketConsumer, code: object) -> object:
        self.__class__.instances.remove(self)
        return await self.close()

    @classmethod
    async def update_status(cls: AsyncJsonWebsocketConsumer, tournament_name: str) -> None:
        connected_instances = [
            instance for instance in cls.instances
            if instance.tournament_name == tournament_name
        ]

        for instance in connected_instances:
            await instance.send_json({
                'type': 'tournament_update',
                'tournament_name': tournament_name,
                'status': 'updated'
            })
