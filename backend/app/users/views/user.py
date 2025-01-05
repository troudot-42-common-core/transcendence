from PIL import Image
from django.contrib.auth import login, logout
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.settings import api_settings
from .auth import get_tokens_for_user
from users.models.users import Users
from ..serializers import UserSerializer, GetUserInfoSerializer

def save_avatar(instance: Users, avatar_file: any) -> None:
    try:
        avatar = Image.open(avatar_file)
    except:
        return
    if avatar.format != 'JPEG':
        return
    avatar.thumbnail((200, 200), Image.Resampling.LANCZOS)
    avatar_path = f'../../app/media/avatars/{instance.username}.jpg'
    avatar.save(avatar_path)
    instance.avatar = avatar_path.replace('../../app/media', '')
    instance.save()

class UsernameView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self: APIView, request: any) -> Response:
        message = {'username': request.user.username}
        return Response(message, status=status.HTTP_200_OK)

    def put(self: APIView, request: any) -> Response:
        try:
            instance = Users.objects.get(username=request.user.username)
        except Users.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user = UserSerializer(instance, data={'display_name': request.data['username']}, partial=True)
        if not user.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user.save()
        logout(request)
        login(request, instance)
        message = {'username': user.validated_data['display_name']}
        response = Response(message, status=status.HTTP_200_OK)
        token = get_tokens_for_user(instance)
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        response.set_cookie('access',
                            token['access'],
                            max_age=api_settings.ACCESS_TOKEN_LIFETIME.total_seconds() if api_settings.ACCESS_TOKEN_LIFETIME else None,
                            samesite='Lax',
                            secure=True,
                            httponly=True)
        response.set_cookie('refresh',
                            token['refresh'],
                            max_age=api_settings.REFRESH_TOKEN_LIFETIME.total_seconds() if api_settings.REFRESH_TOKEN_LIFETIME else None,
                            samesite='Lax',
                            secure=True,
                            httponly=True)
        return response

class AvatarView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self:APIView, request: any) -> Response:
        try:
            instance = Users.objects.get(username=request.user.username)
        except Users.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        message = {'avatar_url': instance.avatar}
        return Response(message, status=status.HTTP_200_OK)

    def put(self: APIView, request: any) -> Response:
        try:
            instance = Users.objects.filter(username=request.user.username).first()
        except Users.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if 'avatar' not in request.FILES:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        avatar_file = request.FILES['avatar']

        save_avatar(instance, avatar_file)
        message = {'avatar_url': instance.avatar}
        return Response(message, status=status.HTTP_200_OK)

class GetUserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self:APIView, request: any, username: str) -> Response:
        try:
            instance = Users.objects.get(username=username)
        except Users.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if self.request.user.username != username:
            user = GetUserInfoSerializer(instance, context={'request': request})
        else:
            user = UserSerializer(instance)
        return Response(user.data, status=status.HTTP_200_OK)

class StatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self:APIView, request: any, username: str) -> Response:
        try:
            instance = Users.objects.get(username=username)
        except Users.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        games_played = instance.scores.count()
        games_won = instance.scores.filter(games__winner=instance).count()
        games_lost = games_played - games_won
        win_rate = (games_won / games_played) * 100 if games_played > 0 else 0
        total_points = sum(instance.scores.values_list('score', flat=True))
        data = {
            'games_played': games_played,
            'games_won': games_won,
            'games_lost': games_lost,
            'win_rate': win_rate,
            'total_points': total_points
        }
        return Response(data, status=status.HTTP_200_OK)

class PasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self:APIView, request: any) -> Response:
        try:
            instance = Users.objects.get(username=request.user.username)
        except Users.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if not instance.check_password(request.data['old_password']):
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if request.data['old_password'] == request.data['new_password']:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user = UserSerializer(instance, data={'password': request.data['new_password']}, partial=True)
        if not user.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user.save()
        logout(request)
        login(request, instance)
        return Response(status=status.HTTP_200_OK)
