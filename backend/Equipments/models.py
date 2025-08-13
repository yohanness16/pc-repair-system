from django.db import models
from django.core.exceptions import ValidationError




class Branch(models.Model):
    name = models.CharField(max_length=256, unique=True)
    created_by = models.ForeignKey('Staff.Staff', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_branches')


    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Branches'
        ordering = ['name']

class Equipment(models.Model):

    ITEM_CATEGORY_CHOICES = [
    ('Computer', 'Computer'),
    ('Scanner', 'Scanner'),
    ('Printer', 'Printer'),
    ('monitor','Monitor'),
]
    STATUS_CHOICES = [
    ('working', 'Working'),
    ('need_repair', 'Need Repair'),
    ('under_repair', 'Under Repair'),
    ('repaired', 'Repaired'),
    ('disposed', 'Disposed'),
]

    
    tag_number = models.IntegerField(unique=True)
    serial_number = models.CharField(max_length=100, unique=True)
    item_category = models.CharField(max_length=100 , choices=ITEM_CATEGORY_CHOICES)
    
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='equipment_items')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Working')  
    remark = models.TextField(blank=True) 
    created_at = models.DateTimeField(auto_now_add=True) 
    added_by = models.ForeignKey('Staff.Staff', on_delete=models.SET_NULL, null=True, blank=True, related_name='added_equipment')
 

    def clean(self):
        if self.status == 'Disposed' and self.item_type.exists():
            raise ValidationError("Disposed equipment should not have any repaired parts.") 
        if self.status == 'Repaired' and not self.item_type.exists():
            raise ValidationError("Repaired equipment must have at least one repaired part.")
        if self.status == 'Under Repair' and not self.item_type.exists():
            raise ValidationError("Under Repair equipment must have parts being worked on.")

    def __str__(self):
        return f"{self.tag_number} - {self.item_type}"

class Meta:
    verbose_name_plural = 'Equipments'
    verbose_name = 'Equipment'
    ordering = ['-created_at']

