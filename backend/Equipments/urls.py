from django.urls import path
from .views import EquipmentCreateView , BranchCreateView , EquipmentDeleteView , EquipmentListView , EquipmentDetailView 

urlpatterns = [
    path('equipment/create/', EquipmentCreateView.as_view(), name='equipment-create'),
    path('branch/create/', BranchCreateView.as_view(), name='branch-create'),
    path('equipment/delete/<int:pk>/', EquipmentDeleteView.as_view(), name='delete-equipment'),
    path('equipment/show/', EquipmentListView.as_view(), name='equipment-list'),
    path('equipment/show/<int:pk>/', EquipmentDetailView.as_view(), name='equipment-detail'),
    
]
