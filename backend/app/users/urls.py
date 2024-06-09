from django.urls import path, include
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets


# Routers provide an easy way of automatically determining the URL conf.
# router = routers.DefaultRouter()
# router.register(r'users', UserViewSet)
urlpatterns = [
    # path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]