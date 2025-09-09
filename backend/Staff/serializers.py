from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import Staff , PasswordResetCode
import random
from django.core.mail import send_mail
from rest_framework import serializers
from rest_framework.exceptions import APIException
from .models import Staff
from django.db import IntegrityError

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user = Staff.objects.get(
                email=data['email'],
                first_name=data['first_name'],
                last_name=data['last_name']
            )
        except Staff.DoesNotExist:
            raise serializers.ValidationError("User not found with the provided information.")

        data['user'] = user
        return data

    def save(self):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        try:
            user.save()
        except IntegrityError as e:
            raise APIException(f"Failed to reset password: {str(e)}")
        return user


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = [
            'id',
            'username',
            'email',
            'password',
            'first_name',
            'last_name',
            'role',
        ]
        extra_kwargs = {
            'password': {'write_only': True}       
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Staff(**validated_data)
        user.set_password(password) 
        user.save()
        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.role
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
       
        data.update({
            'id': self.user.id,
            'username': self.user.username,
            'role': self.user.role,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'profile_photo': self.user.profile_photo.url if self.user.profile_photo else None,
        })
        return data


class UpdateProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Staff
        fields = ['username', 'profile_photo', 'password']

    def validate_username(self, value):
        user = self.context['request'].user
        if Staff.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

    def update(self, instance, validated_data):
       
        instance.username = validated_data.get('username', instance.username)

        
        if 'profile_photo' in validated_data:
            instance.profile_photo = validated_data['profile_photo']

        
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)

        instance.save()
        return instance


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user = Staff.objects.get(
                email=data['email'],
                first_name=data['first_name'],
                last_name=data['last_name']
            )
        except Staff.DoesNotExist:
            raise serializers.ValidationError("User not found with the provided information.")

        data['user'] = user
        return data

    def save(self):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        try:
            user.save()
        except IntegrityError as e:
            raise APIException(f"Failed to reset password: {str(e)}")
        return user


class RequestPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            self.user = Staff.objects.get(email=value)
        except Staff.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        return value

    def save(self):
        code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        try:
            PasswordResetCode.objects.create(user=self.user, code=code)
            send_mail(
                subject='Your Password Reset Code',
                message=f'Your password reset code is: {code}',
                from_email='your_email@gmail.com',
                recipient_list=[self.user.email],
                fail_silently=False
            )
        except Exception as e:
            raise APIException(f"Failed to send reset code: {str(e)}")

class VerifyResetCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        try:
            user = Staff.objects.get(email=data['email'])
        except Staff.DoesNotExist:
            raise serializers.ValidationError("Invalid email.")

        try:
            reset_code = PasswordResetCode.objects.filter(user=user, code=data['code']).latest('created_at')
        except PasswordResetCode.DoesNotExist:
            raise serializers.ValidationError("Invalid reset code.")

        if reset_code.is_expired():
            raise serializers.ValidationError("Reset code has expired.")

        self.user = user
        return data

    def save(self):
        self.user.set_password(self.validated_data['new_password'])
        try:
            self.user.save()
            PasswordResetCode.objects.filter(user=self.user).delete()
        except Exception as e:
            raise APIException(f"Failed to reset password: {str(e)}")
