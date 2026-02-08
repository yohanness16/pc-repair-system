
from django.urls import path
from .views import RepairRequestCreateView, RepairApprovalView ,CompleteRepairView , PartDetailView, PartListCreateView ,EquipmentRepairHistoryView , AdminRepairStatsView , EquipmentRepairPDFView , RepairReceiptPDFView , ApprovedRepairLabelView , RepairRequestListView , RepairRequestDetailView , AssignedRepairsView

urlpatterns = [
    path('request/', RepairRequestCreateView.as_view(), name='repair-request'),
    path("repairs/", RepairRequestListView.as_view(), name="repair-list"),
    path("repairs/<int:pk>/", RepairRequestDetailView.as_view(), name="repair-detail"),
    path('approve/<int:pk>/', RepairApprovalView.as_view(), name='repair-approve'),
    path('complete/<int:pk>/', CompleteRepairView.as_view(), name='repair-complete'),
    path('parts/<int:pk>/', PartDetailView.as_view(), name='part-detail'),
    path('parts/', PartListCreateView.as_view(), name='part-list-create'),
    path('repair-history/', EquipmentRepairHistoryView.as_view(), name='equipment-repair-history'),
    path('admin/stats/', AdminRepairStatsView.as_view(), name='admin-stats'),
    path('equipment/<int:equipment_id>/repairs/pdf/', EquipmentRepairPDFView.as_view(), name='equipment-repair-pdf'),
    path('repair/<int:repair_id>/receipt/pdf/', RepairReceiptPDFView.as_view(), name='repair-receipt-pdf'),
    path('repairs/<int:repair_id>/approved-label/', ApprovedRepairLabelView.as_view(), name='approved-repair-label'),
    path("repairs/assigned/", AssignedRepairsView.as_view(), name="repair-assigned"),




]
