from django.urls import path, include
from .views import create, read


# Routers provide an easy way of automatically determining the URL conf.
# router = routers.DefaultRouter()
# router.register(r'users', UserViewSet)
urlpatterns = [
    # path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
    path('create/', create, name="create"),
    path('read/<int:pk>', read, name="read"),
]