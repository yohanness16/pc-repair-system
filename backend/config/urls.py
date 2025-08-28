
from django.contrib import admin
from django.urls import path , include
from django.conf import settings
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions


schema_view = get_schema_view(
   openapi.Info(
      title="swagger ",
      default_version='v1',
      description="Interactive API documentation ",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="admin@example.com"),
      license=openapi.License(name="MIT License"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/Staff/', include('Staff.urls')),
    path('api/', include('Equipments.urls')),
    path('api/Repairs/', include('Repairs.urls')),

    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

