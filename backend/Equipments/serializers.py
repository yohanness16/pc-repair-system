from rest_framework import serializers
from .models import Equipment
from .models import Branch

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'


class EquipmentSerializer(serializers.ModelSerializer):
    branch_name = serializers.CharField(source='branch.name', read_only=True)

    added_by_name = serializers.CharField(source='added_by.first_name', read_only=True)
    
    class Meta:
        model = Equipment
        fields = '__all__'

    status_display = serializers.SerializerMethodField()

    def get_status_display(self, obj):
     return obj.get_status_display()
    
