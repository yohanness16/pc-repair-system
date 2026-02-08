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
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi




class BranchCreateView(generics.CreateAPIView):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer

    @swagger_auto_schema(
        operation_description="Create a new branch",
        responses={201: BranchSerializer, 400: "Bad request"}
    )
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class BranchListView(generics.ListAPIView):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="List all branches",
        responses={200: BranchSerializer(many=True)}
    )
    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class BranchDetailView(generics.RetrieveAPIView):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    @swagger_auto_schema(
        operation_description="Retrieve a branch by ID",
        responses={200: BranchSerializer, 404: "Not found"}
    )
    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


class BranchUpdateView(generics.UpdateAPIView):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [IsAuthenticated, IsStaffOrAdmin]
    lookup_field = 'pk'

    @swagger_auto_schema(
        operation_description="Update a branch by ID",
        responses={200: BranchSerializer, 400: "Bad request", 404: "Not found"}
    )
    def put(self, request, *args, **kwargs):
        try:
            return super().put(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class BranchDeleteView(generics.DestroyAPIView):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer
    permission_classes = [IsAuthenticated, IsStaffOrAdmin]
    lookup_field = 'pk'

    @swagger_auto_schema(
        operation_description="Delete a branch by ID",
        responses={204: "Deleted", 404: "Not found"}
    )
    def delete(self, request, *args, **kwargs):
        try:
            return super().delete(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)




class EquipmentCreateView(generics.CreateAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer

    @swagger_auto_schema(
        operation_description="Create a new equipment",
        responses={201: EquipmentSerializer, 400: "Bad request"}
    )
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)


class EquipmentDeleteView(generics.DestroyAPIView):
    queryset = Equipment.objects.all()
    permission_classes = [IsAuthenticated, IsStaffOrAdmin]
    lookup_field = 'pk'

    @swagger_auto_schema(
        operation_description="Delete equipment by ID",
        responses={204: "Deleted", 404: "Not found"}
    )
    def delete(self, request, *args, **kwargs):
        try:
            return super().delete(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class EquipmentListView(generics.ListAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['item_category', 'status', 'branch']
    search_fields = ['serial_number', 'tag_number']
    ordering_fields = ['created_at', 'tag_number', 'status']

    @swagger_auto_schema(
        operation_description="List all equipment with filtering, search, and ordering",
        responses={200: EquipmentSerializer(many=True)}
    )
    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class EquipmentDetailView(generics.RetrieveAPIView):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    @swagger_auto_schema(
        operation_description="Retrieve an equipment by ID",
        responses={200: EquipmentSerializer, 404: "Not found"}
    )
    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


class DisposedEquipmentListView(generics.ListAPIView):
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="List all disposed equipment",
        responses={200: EquipmentSerializer(many=True)}
    )
    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        return Equipment.objects.filter(status='disposed')