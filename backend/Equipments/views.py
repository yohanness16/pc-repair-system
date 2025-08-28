from rest_framework import generics
from .models import Equipment ,Branch
from .serializers import BranchSerializer
from .serializers import EquipmentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsStaffOrAdmin
from rest_framework.generics import ListAPIView , RetrieveAPIView
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend




class BranchCreateView(generics.CreateAPIView):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer

    def perform_create(self, serializer):
        
        serializer.save(created_by=self.request.user)


class EquipmentCreateView(generics.CreateAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer

    def perform_create(self, serializer):
        
        serializer.save(added_by=self.request.user)

class EquipmentDeleteView(generics.DestroyAPIView):
    queryset = Equipment.objects.all()
    permission_classes = [IsAuthenticated, IsStaffOrAdmin]
    lookup_field = 'pk'

    
class EquipmentListView(ListAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['item_category', 'status', 'branch']
    search_fields = ['serial_number', 'tag_number']
    ordering_fields = ['created_at', 'tag_number', 'status']


class EquipmentDetailView(RetrieveAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

