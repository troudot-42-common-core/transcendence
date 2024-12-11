import pyotp
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, AuthUser
from ..models.users import Users

def get_tokens_for_user(user: AuthUser) -> dict:
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def check_otp(otp: str, user: AuthUser) -> bool:
    totp = pyotp.TOTP(user.otp_secret)
    return totp.verify(otp)

class RegisterOTPView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self:APIView, request: any) -> Response:
        try:
            user = Users.objects.get(username=request.user.username)
        except Users.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if not user.oauth_connected:
            try:
                if not user.check_password(request.data["password"]):
                    return Response({"message": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)
            except:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        if user.otp_secret is not None:
            return Response(status=status.HTTP_409_CONFLICT)
        user.otp_secret = pyotp.random_base32()
        user.otp_enabled = True
        user.save()
        qr_code_uri = pyotp.totp.TOTP(user.otp_secret).provisioning_uri(name=user.username, issuer_name='ft_transcendence')
        message = {'qr_code_uri': qr_code_uri, 'otp_secret': user.otp_secret}
        return Response(message, status=status.HTTP_201_CREATED)

class LogoutOTPView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self: APIView, request: any) -> Response:
        try:
            user = Users.objects.get(username=request.user.username)
        except Users.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if not user.otp_enabled:
            return Response(status=status.HTTP_409_CONFLICT)
        if not check_otp(request.data["otp"], user):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user.otp_enabled = False
        user.otp_secret = None
        user.save()
        return Response(status=status.HTTP_200_OK)