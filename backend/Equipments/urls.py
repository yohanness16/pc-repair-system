from django.urls import path
from .views import EquipmentCreateView , BranchCreateView , EquipmentDeleteView , EquipmentListView , EquipmentDetailView , DisposedEquipmentListView , BranchListView , BranchDetailView , BranchUpdateView , BranchDeleteView

urlpatterns = [
    path('equipment/create/', EquipmentCreateView.as_view(), name='equipment-create'),
    path('equipment/delete/<int:pk>/', EquipmentDeleteView.as_view(), name='delete-equipment'),
    path('equipment/show/', EquipmentListView.as_view(), name='equipment-list'),
    path('equipment/show/<int:pk>/', EquipmentDetailView.as_view(), name='equipment-detail'),
    path('equipment/disposed/', DisposedEquipmentListView.as_view(), name='disposed-equipments'),

    path('branch/create/', BranchCreateView.as_view(), name='branch-create'),
    path('branch/', BranchListView.as_view(), name='branch-list'),
    path('branch/<int:pk>/', BranchDetailView.as_view(), name='branch-detail'),
    path('branch/update/<int:pk>/', BranchUpdateView.as_view(), name='branch-update'),
    path('branch/delete/<int:pk>/', BranchDeleteView.as_view(), name='branch-delete'),
]
