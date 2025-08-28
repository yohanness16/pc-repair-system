from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta



def email_validator(value):
    if not value.endswith('@gmail.com'):
        raise ValidationError("Invalid email. It must end with '@gmail.et'")

class Staff(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('staff', 'Staff'),
    ]


    
    email = models.EmailField(unique=True, validators=[email_validator])
    role = models.CharField(max_length=25, choices=ROLE_CHOICES)
    profile_photo = models.ImageField(
        upload_to='staff_photos/',
        default='staff_photos/default.jpg',
        blank=True,
        null=True
    )

    REQUIRED_FIELDS = ['email', 'first_name', 'last_name', 'role']

def __str__(self):
        return self.username
   

class Meta:
        verbose_name = "Staff"
        verbose_name_plural = "Staff"

class PasswordResetCode(models.Model):
    user = models.ForeignKey('Staff', on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=10)

    def __str__(self):
        return f'{self.user.email} - {self.code}'


