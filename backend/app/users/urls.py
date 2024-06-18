from django.urls import path, include
from .views import AuthAPIView
# from .views import create, read


# Routers provide an easy way of automatically determining the URL conf.

urlpatterns = [
    # path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
    path('', AuthAPIView.as_view()),
    path('<int:id>', AuthAPIView.as_view()),
    # path('create/', create, name="create"),
    # path('read/<int:pk>', read, name="read"),
]