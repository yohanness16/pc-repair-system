from django.db import models
from django.core.validators import MinValueValidator

from Staff.models import Staff
class Part(models.Model):

    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
class Repair(models.Model):
    STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected'),
    ('completed', 'Completed'),
]

    equipment = models.ForeignKey('Equipments.Equipment', on_delete=models.CASCADE, related_name='repairs')
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='repairs')
    remark = models.TextField(blank=True, null=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    repair_staff = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, blank=True, related_name='completed_repairs')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    report = models.TextField(blank=True, null=True)
    


    def __str__(self):
        return f"Repair #{self.id} for {self.equipment}"

    class Meta:
        verbose_name = "Repair"
        verbose_name_plural = "Repairs"
        ordering = ['-created_at']

class RepairPart(models.Model):
    repair = models.ForeignKey(Repair, on_delete=models.CASCADE, related_name='repair_parts')
    part = models.ForeignKey(Part, on_delete=models.CASCADE, related_name='repair_parts')
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    created_at = models.DateTimeField(auto_now_add=True)
  

    class Meta:
        unique_together = ('repair', 'part')
        verbose_name = 'Repair Part'
        verbose_name_plural = 'Repair Parts'
        ordering = ['repair']

    def __str__(self):
        return f"Repair #{self.repair.id} - {self.part.name} (x{self.quantity})"