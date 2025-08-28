
from rest_framework import generics, permissions
from .models import Repair , Part , RepairPart
from Equipments.models import Equipment
from .serializers import RepairCreateSerializer , PartSerializer , CompleteRepairSerializer , RepairHistorySerializer , RepairApprovalSerializer
from Equipments.permissions import IsStaffOrAdmin
from Repairs.permissions import IsAdmin , IsAssignedRepairStaff
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from django.db.models.functions import TruncMonth
from django.db.models import Count , Sum , Value 
from django.db.models.functions import Concat
from collections import defaultdict
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
class PartListCreateView(generics.ListCreateAPIView):
    queryset = Part.objects.all()
    serializer_class = PartSerializer
    permission_classes = [permissions.IsAuthenticated]
@swagger_auto_schema(
        request_body=PartSerializer,
        responses={201: PartSerializer, 400: 'Bad Request'}
    )


class PartDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Part.objects.all()
    serializer_class = PartSerializer
    permission_classes = [permissions.IsAuthenticated]
    

class PartViewSet(viewsets.ModelViewSet):
    queryset = Part.objects.all()
    serializer_class = PartSerializer
    permission_classes = [permissions.IsAuthenticated]

class RepairRequestCreateView(generics.CreateAPIView):
    queryset = Repair.objects.all()
    serializer_class = RepairCreateSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffOrAdmin]
    @swagger_auto_schema(
        request_body=RepairCreateSerializer,
        responses={201: RepairCreateSerializer , 400: 'Bad Request'}
    )


    def perform_create(self, serializer):
        serializer.save()
    
class RepairApprovalView(generics.UpdateAPIView):
    queryset = Repair.objects.all()
    serializer_class = RepairApprovalSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    lookup_field = 'pk'

class CompleteRepairView(generics.UpdateAPIView):
    queryset = Repair.objects.all()
    serializer_class = CompleteRepairSerializer
    lookup_field = 'pk'

    permission_classes = [permissions.IsAuthenticated, IsAssignedRepairStaff]
@swagger_auto_schema(
        request_body=CompleteRepairSerializer,
        responses={200: CompleteRepairSerializer, 400: 'Bad Request'}
    )
    
class EquipmentRepairHistoryView(generics.ListAPIView):
    serializer_class = RepairHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    @swagger_auto_schema(
        request_body=RepairHistorySerializer,
        responses={200: RepairHistorySerializer, 400: 'Bad Request'}
    )

    def get_queryset(self):
        
        tag_number = self.request.query_params.get('tag_number', None)
        serial_number = self.request.query_params.get('serial_number', None)

        
        if tag_number:
            equipment = get_object_or_404(Equipment, tag_number=tag_number)
        elif serial_number:
            equipment = get_object_or_404(Equipment, serial_number=serial_number)
        else:
            
            return Repair.objects.none()

        
        return Repair.objects.filter(equipment=equipment).order_by('-created_at')
    
class AdminRepairStatsView(APIView):
    permission_classes = [IsAuthenticated]  
    @swagger_auto_schema(
        operation_description="Get detailed repair statistics for admins",
        responses={
            200: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "monthly_repairs": openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            "labels": openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_STRING)),
                            "values": openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER)),
                        }
                    ),
                    "top_repair_staff": openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            "labels": openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_STRING)),
                            "values": openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER)),
                        }
                    ),
                    "repairs_by_branch": openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            "labels": openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_STRING)),
                            "values": openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER)),
                        }
                    ),
                    "top_used_parts": openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            "labels": openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_STRING)),
                            "values": openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER)),
                        }
                    ),
                    "branch_wise_part_usage": openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Items(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                "part": openapi.Schema(type=openapi.TYPE_STRING),
                                "branches": openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_STRING)),
                                "quantities": openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER)),
                            }
                        )
                    ),
                    "staff_workload": openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            "labels": openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_STRING)),
                            "values": openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_INTEGER)),
                        }
                    ),
                }
            )
        }
    )


    def get(self, request):
        repairs = Repair.objects.annotate(month=TruncMonth('created_at')) \
            .values('month') \
            .annotate(count=Count('id')) \
            .order_by('month')

        data = {
            "labels": [r['month'].strftime('%b %Y') for r in repairs],
            "values": [r['count'] for r in repairs]
        }
        top_staff = Repair.objects.filter(status='completed', repair_staff__isnull=False) \
           .annotate(full_name=Concat('repair_staff__first_name', Value(' '), 'repair_staff__last_name')) \
           .values('full_name') \
           .annotate(count=Count('id')) \
           .order_by('-count')[:5]

        staff_stats = {
           "labels": [s['full_name'] for s in top_staff],
           "values": [s['count'] for s in top_staff]
       }
        repairs_by_branch = Repair.objects.filter(equipment__branch__isnull=False) \
          .values('equipment__branch__name') \
          .annotate(count=Count('id')) \
          .order_by('-count')

        branch_stats = {
           "labels": [b['equipment__branch__name'] for b in repairs_by_branch],
           "values": [b['count'] for b in repairs_by_branch]
          }
        top_parts = RepairPart.objects.values('part__name') \
            .annotate(total_used=Sum('quantity')) \
            .order_by('-total_used')[:5]

        part_stats = {
          "labels": [p['part__name'] for p in top_parts],
          "values": [p['total_used'] for p in top_parts]
      }
        part_branch_data = RepairPart.objects.values(
            'part__name',
            'repair__equipment__branch__name'
        ).annotate(total=Sum('quantity'))

        branch_part_map = defaultdict(lambda: defaultdict(int))

        for row in part_branch_data:
            part = row['part__name']
            branch = row['repair__equipment__branch__name']
            qty = row['total']
            branch_part_map[part][branch] += qty

        
        branch_wise_part_stats = []
        for part_name, branches in list(branch_part_map.items())[:5]:
            branch_wise_part_stats.append({
                "part": part_name,
                "branches": list(branches.keys()),
                "quantities": list(branches.values())
            })
        workload = Repair.objects.filter(
            status__in=['approved', 'completed', 'pending', 'under_repair'],
            repair_staff__isnull=False
        ).annotate(
            full_name=Concat('repair_staff__first_name', Value(' '), 'repair_staff__last_name')
        ).values('full_name').annotate(
            count=Count('id')
        ).order_by('-count')

        staff_workload = {
            "labels": [w['full_name'] for w in workload],
            "values": [w['count'] for w in workload]
        }
        
        return Response({
               "monthly_repairs": data,
               "top_repair_staff": staff_stats,
               "repairs_by_branch": branch_stats,
               "top_used_parts": part_stats,
               "branch_wise_part_usage": branch_wise_part_stats,
               "staff_workload": staff_workload,
        })
