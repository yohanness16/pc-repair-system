import json
from channels.generic.websocket import AsyncWebsocketConsumer

class RepairNotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope["user"].is_anonymous:
            await self.close()
            return

        self.group_name = "repairs_updates"

        # Join the common group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    # Receive message from room group
    async def repair_update(self, event):
        message = event['message']
        repair_id = event.get('repair_id')
        status = event.get('status')
        staff_id = event.get('staff_id')

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'repair_id': repair_id,
            'status': status,
            'staff_id': staff_id
        }))
