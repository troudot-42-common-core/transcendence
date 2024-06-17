from rest_framework import serializers
from .models import Users
# from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['username', 'email', 'password']
