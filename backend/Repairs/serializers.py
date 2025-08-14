
from rest_framework import serializers
from .models import Repair ,    Part , RepairPart
from Staff.models import Staff
from django.utils import timezone

class PartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Part
        fields = '__all__'

class RepairPartSerializer(serializers.ModelSerializer):
    part_name = serializers.CharField(source='part.name')

    class Meta:
        model = RepairPart
        fields = ['part_name', 'quantity']


class RepairCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repair
        fields = ['id','equipment', 'remark']  

    def create(self, validated_data):
        request = self.context['request']  
        staff = request.user  
        return Repair.objects.create(
            equipment=validated_data['equipment'],
            remark=validated_data.get('remark', ''),
            staff=staff,  
            status='pending' 
        )
class RepairApprovalSerializer(serializers.ModelSerializer):
    repair_staff_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Repair
        fields = ['status', 'repair_staff_id']

    def validate_status(self, value):
        if value not in ['approved', 'rejected']:
            raise serializers.ValidationError("Status must be either 'approved' or 'rejected'")
        return value

    def update(self, instance, validated_data):
        instance.status = validated_data['status']

        if instance.status == 'approved':
            instance.approved_at = timezone.now()

            repair_staff_id = validated_data.get('repair_staff_id')
            if repair_staff_id:
                try:
                    staff = Staff.objects.get(id=repair_staff_id)
                    instance.repair_staff = staff
                except Staff.DoesNotExist:
                    raise serializers.ValidationError({'repair_staff_id': 'Staff not found'})

        instance.save()
        return instance
    
class RepairPartInputSerializer(serializers.Serializer):
    part_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class CompleteRepairSerializer(serializers.ModelSerializer):
    parts = RepairPartInputSerializer(many=True, write_only=True)
    remark = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Repair
        fields = ['status', 'report', 'parts' ,'remark']

    def validate_status(self, value):
        if value != 'completed':
            raise serializers.ValidationError("Status must be 'completed'")
        return value

    def update(self, instance, validated_data):


        instance.status = validated_data['status']
        instance.report = validated_data.get('report', '')
        instance.completed_at = timezone.now()

        RepairPart.objects.filter(repair=instance).delete()
        instance.save()

        parts_data = validated_data.get('parts', [])
        for part_info in parts_data:
            try:
                part = Part.objects.get(id=part_info['part_id'])
                RepairPart.objects.create(
                    repair=instance,
                    part=part,
                    quantity=part_info['quantity']
                )
                
            except Part.DoesNotExist:
                raise serializers.ValidationError(f"Part with ID {part_info['part_id']} not found")

        return instance
    
class RepairHistorySerializer(serializers.ModelSerializer):
    parts = RepairPartSerializer(source='repair_parts', many=True, read_only=True)
    equipment_branch = serializers.CharField(source='equipment.branch.name', read_only=True)
    repair_staff_name = serializers.SerializerMethodField()

    class Meta:
        model = Repair
        fields = ['id', 'status', 'completed_at','created_at','report','remark','status', 'repair_staff_name', 'parts', 'equipment_branch']

    def get_repair_staff_name(self, obj):
        if obj.repair_staff:
            return f"{obj.repair_staff.first_name} {obj.repair_staff.last_name}"
        return None
