from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from annoying.functions import get_object_or_None
from .models import Users
from .serlializers import UserSerializer

class RegisterView(APIView):
    def post(self: APIView, request: any) -> Response:
        user = UserSerializer(data=request.data)
        if not user.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if Users.objects.filter(username=request.data["username"]).exists():
            return Response(
                {"Username already exists"}, status=status.HTTP_409_CONFLICT
            )
        user.validated_data["password"] = make_password("password")
        user.save()
        return Response(user.data, status=status.HTTP_200_OK)


class LoginView(APIView):

    def get(self: APIView, request: any) -> Response:
        return Response({"message": "Hello, Authenticated User!"})


class AuthAPIView(APIView):

    def get(self: APIView, requests: any, id: int) -> Response:
        obj = get_object_or_None(Users, id=id)
        if obj is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user = UserSerializer(obj)
        return Response(user.data, status=status.HTTP_200_OK)

    def post(self: APIView, request: any) -> Response:
        user = UserSerializer(data=request.data)
        if not user.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if Users.objects.filter(username=request.data["username"]).exists():
            return Response(
                {"Username already exists"}, status=status.HTTP_409_CONFLICT
            )
        user.validated_data["password"] = make_password("password")
        user.save()
        return Response(user.data, status=status.HTTP_201_CREATED)

    def put(self: APIView, request: any, id: int) -> Response:
        obj = get_object_or_None(Users, id=id)
        if obj is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user = UserSerializer(obj, request.data, partial=True)
        if not user.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user.validated_data["password"] = make_password("password")
        user.save()

        return Response(status=status.HTTP_200_OK)

    def delete(self: APIView, requests: any, id: int) -> Response:
        obj = get_object_or_None(Users, id=id)
        if obj is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
