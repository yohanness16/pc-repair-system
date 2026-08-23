from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Repair

@receiver(post_save, sender=Repair)
def repair_updated(sender, instance, created, **kwargs):
    channel_layer = get_channel_layer()
    if created:
        message = f"New repair request #{instance.id} created."
    else:
        message = f"Repair #{instance.id} status updated to {instance.status}."

    async_to_sync(channel_layer.group_send)(
        "repairs_updates",
        {
            "type": "repair_update",
            "message": message,
            "repair_id": instance.id,
            "status": instance.status,
            "staff_id": instance.repair_staff.id if instance.repair_staff else None
        }
    )
