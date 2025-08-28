from django.urls import path
from .views import RegisterView ,LogoutView , UpdateProfileView , MyTokenObtainPairView , PingView, ForgotPasswordView , RequestPasswordResetView, VerifyResetCodeView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('update/', UpdateProfileView.as_view(), name='update-profile'),
    path('forgot/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('ping/', PingView.as_view(), name='ping'),
    path('request-reset/', RequestPasswordResetView.as_view(), name='request-reset'),
    path('verify-reset/', VerifyResetCodeView.as_view(), name='verify-reset'),

]
   