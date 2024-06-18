from rest_framework import status
from rest_framework.views import APIView
# from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from annoying.functions import get_object_or_None
from .models import Users
# from django.contrib.auth.models import User
from .serlializers import UserSerializer

class AuthAPIView(APIView):
    def get(self, request, id, *args, **kwargs):
        obj = get_object_or_None(Users, id=id)
        if obj is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user = UserSerializer(obj)
        return Response(user.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        user = UserSerializer(data=request.data)
        if not user.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if Users.objects.filter(username=request.data['username']).exists():
            return Response({"Username already exists"}, status=status.HTTP_409_CONFLICT)
        user.validated_data['password'] = make_password('password')
        user.save()
        return Response(user.data, status=status.HTTP_201_CREATED)

    def put(self, request, id, *args, **kwargs):
        obj = get_object_or_None(Users, id=id)
        if obj is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user = UserSerializer(obj, request.data, partial=True)
        if not user.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user.validated_data['password'] = make_password('password')
        user.save()

        return Response(status=status.HTTP_200_OK)
    # fix UPDATE

    def delete(self, request, id, *args, **kwargs):
        obj = get_object_or_None(Users, id=id)
        if obj is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



# @api_view(['PUT'])
# def update(request):
#     pass
#
# @api_view(['DELETE'])
# def delete(request):
#     pass
