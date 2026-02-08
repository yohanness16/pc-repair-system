
from rest_framework import generics, permissions
from django.http import HttpResponse
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
from django.template.loader import render_to_string
from weasyprint import HTML
import os
from django.conf import settings
from django.db import IntegrityError
from rest_framework.exceptions import APIException



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
        responses={201: RepairCreateSerializer, 400: 'Bad Request'}
    )
    def perform_create(self, serializer):
        try:
            serializer.save()
        except IntegrityError as e:
            raise APIException(f"Failed to create repair request: {str(e)}")


class RepairRequestListView(generics.ListAPIView):
    serializer_class = RepairCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # ✅ Fix: Swagger runs without a logged-in user (AnonymousUser),
        # so short-circuit during schema generation
        if getattr(self, 'swagger_fake_view', False):
            return Repair.objects.none()

        user = self.request.user
        if user.is_superuser or user.is_staff:  # Admin → all
            return Repair.objects.all().order_by('-created_at')
        return Repair.objects.filter(staff=user).order_by('-created_at')

    @swagger_auto_schema(
        operation_description="Get repair requests. Admins see all, staff see only their own.",
        responses={
            200: RepairCreateSerializer(many=True),
            403: "Forbidden"
        }
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)



class RepairRequestDetailView(generics.RetrieveAPIView):
    queryset = Repair.objects.all()
    serializer_class = RepairCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Repair.objects.none()

        user = self.request.user
        if user.is_superuser or user.is_staff:
            return Repair.objects.all()
        return Repair.objects.filter(staff=user)

    @swagger_auto_schema(
        operation_description="Retrieve a single repair request. Admins can access all, staff can only access their own.",
        responses={200: RepairCreateSerializer, 403: "Forbidden", 404: "Not Found"}
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)



class RepairApprovalView(generics.UpdateAPIView):
    queryset = Repair.objects.all()
    serializer_class = RepairApprovalSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    lookup_field = 'pk'
class AssignedRepairsView(generics.ListAPIView):
    serializer_class = RepairHistorySerializer
    permission_classes = [permissions.IsAuthenticated, IsAssignedRepairStaff]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, "staff"):
            raise APIException("You are not registered as a staff member.")
        return Repair.objects.filter(repair_staff=user.staff).order_by('-created_at')

    @swagger_auto_schema(
        operation_description="Get all repairs assigned to the logged-in staff",
        responses={200: RepairHistorySerializer(many=True), 403: "Forbidden"}
    )
    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

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
    

class EquipmentRepairPDFView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Download a PDF report of all completed repairs for a specific equipment",
        manual_parameters=[
            openapi.Parameter(
                'equipment_id', openapi.IN_PATH,
                description="ID of the equipment",
                type=openapi.TYPE_INTEGER,
                required=True
            )
        ],
        responses={200: 'PDF file of equipment repair history', 404: 'Equipment not found'}
    )
    def get(self, request, equipment_id):
        equipment = get_object_or_404(Equipment, pk=equipment_id)
        repairs = equipment.repairs.filter(status='completed').order_by('-completed_at')

        html_string = render_to_string('repair_pdf.html', {
            'equipment': equipment,
            'repairs': repairs
        })

        try:
            html = HTML(string=html_string)
            pdf = html.write_pdf()
        except Exception as e:
            return Response({"error": f"PDF generation failed: {str(e)}"}, status=500)

        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="equipment_{equipment.tag_number}_repairs.pdf"'
        return response



class RepairReceiptPDFView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Download a PDF receipt for a specific completed repair",
        manual_parameters=[
            openapi.Parameter(
                'repair_id', openapi.IN_PATH,
                description="ID of the completed repair",
                type=openapi.TYPE_INTEGER,
                required=True
            )
        ],
        responses={200: 'PDF file of repair receipt', 404: 'Repair not found or not completed'}
    )
    def get(self, request, repair_id):
        repair = get_object_or_404(Repair, pk=repair_id, status="completed")

        html_string = render_to_string('repair_receipt.html', {
            'repair': repair
        })

        try:
            html = HTML(string=html_string)
            pdf = html.write_pdf()
        except Exception as e:
            return Response({"error": f"PDF generation failed: {str(e)}"}, status=500)

        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="repair_{repair.id}_receipt.pdf"'
        return response

        
class ApprovedRepairLabelView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Download a label/report for a specific approved repair",
        manual_parameters=[
            openapi.Parameter(
                'repair_id', openapi.IN_PATH,
                description="ID of the approved repair",
                type=openapi.TYPE_INTEGER,
                required=True
            )
        ],
        responses={200: 'HTML/PDF label of approved repair', 404: 'Repair not found or not approved'}
    )
    def get(self, request, repair_id):
        repair = get_object_or_404(Repair, pk=repair_id, status="approved")

        html_string = render_to_string('approved_repair_label.html', { 
            'repair': repair,
            'equipment': repair.equipment,
            'repair_staff': repair.repair_staff
        })

        try:
            html = HTML(string=html_string)
            pdf = html.write_pdf()
        except Exception as e:
            return Response({"error": f"PDF generation failed: {str(e)}"}, status=500)

        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="repair_{repair.id}_label.pdf"'
        return response
