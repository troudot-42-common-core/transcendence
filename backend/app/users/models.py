from django.db import models
from django.contrib.auth.models import AbstractUser

class Users(AbstractUser):
    username = models.CharField(max_length=16, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=256)