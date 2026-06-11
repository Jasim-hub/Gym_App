from django.db import models
import random

def generate_user_id():
    return str(random.randint(1000, 9999))

class Member(models.Model):
    user_id = models.CharField(
        max_length=4,
        unique=True,
        default=generate_user_id
    )

    name = models.CharField(max_length=50)

    email = models.EmailField(unique=True)

    phone = models.CharField(max_length=20, unique=True)

    date_of_birth = models.DateField()

    gender = models.CharField(
        max_length=10,
        choices=[
            ("Male", "Male"),
            ("Female", "Female"),
            ("Other", "Other"),
        ]
    )

    password = models.CharField(max_length=255)

    joined_date = models.DateField(auto_now_add=True)

    profile_image = models.ImageField(
        upload_to="members/",
        null=True,
        blank=True
    )

    def __str__(self):
        return self.name