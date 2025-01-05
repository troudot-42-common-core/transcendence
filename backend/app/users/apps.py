from django.apps import AppConfig


def ready() -> None:
    try:
        from .models.users import Users
        from .serializers import UserSerializer
        if not Users.objects.all().filter(username='12345678').exists():
            user = UserSerializer(data={'username': '12345678', 'display_name': '12345678', 'password': '12345678a-'})
            if user.is_valid():
                user.save()
        online_users = Users.objects.all().filter(is_online=True)
        for user in online_users:
            user.is_online = False
            user.save()

    except Exception as e:
        print(e)


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'
