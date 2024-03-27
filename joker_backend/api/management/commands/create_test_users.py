from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from pprint import pprint


class Command(BaseCommand):
    help = 'Displays stats related to Article and Comment models'

    def handle(self, *args, **kwargs):
        user_model = get_user_model()

        admin_username = "admin"
        admin_password = "password123"
        admin_email = "admin@admin.com"
        admin, _ = user_model.objects.get_or_create(username=admin_username,
                                                    defaults={
                                                        "is_staff": True,
                                                        "is_superuser": True,
                                                        "email": admin_email})
        admin.set_password(admin_password)
        admin.save()
        pprint({
            "admin": True,
            "username": admin_username,
            "password": admin_password,
            "email": admin.email
        })

        username = "standart_user"
        password = "password123"
        email = "standart_user@gmail.com"
        user, _ = user_model.objects.get_or_create(username=username, defaults={"email": email})
        user.set_password(password)
        user.save()
        pprint({
            "admin": False,
            "username": username,
            "password": password,
            "email": user.email
        })
