
from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'admin'

class IsAssignedRepairStaff(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.repair_staff == request.user
