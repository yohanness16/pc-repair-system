from django.contrib import admin
from .models import Staff 

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ('username', 'first_name', 'last_name', 'email', 'role')
    search_fields = ('username', 'email')
    list_filter = ('role',)
