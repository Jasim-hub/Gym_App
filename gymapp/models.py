from django.db import models
import random

def generate_user_id():
    return str(random.randint(1000, 9999))

class Member(models.Model):
    PAYMENT_MODE = (
        ("Cash", "Cash"),
        ("UPI", "UPI"),
        ("Card", "Card"),
        ("Net_Banking", "Net_Banking"),
    )
    DOCUMENT_TYPE = (
        ("AadhaarCard", "Aadhaar Card"),
        ("PanCard", "PAN Card"),
        ("VoterId", "Voter ID"),
        ("Other", "Other"),
    )

    ADMISSION_STATUS = (
        ("Paid", "Paid"),
        ("Unpaid", "Unpaid"),
    )

    PLAN_TYPE = (
        ("LifeLong", "LifeLong"),
        ("1 Year", "1 Year"),
        ("6 Months", "6 Months"),
        ("3 Months", "3 Months"),
        ("1 Month", "1 Month"),
    )
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
    otp = models.CharField(
        max_length=6,
        blank=True,
        null=True
    )

    otp_created_at = models.DateTimeField(
        blank=True,
        null=True
    )
    document_type = models.CharField(
        max_length=20,
        choices=DOCUMENT_TYPE,
        null=True,
        blank=True
    )
    document_image = models.ImageField(
        upload_to="members/documents/",
        null=True,
        blank=True
    )
    admission_status = models.CharField(
        max_length=10,
        choices=ADMISSION_STATUS,
        default="Unpaid"
    )
    admission_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )
    payment_mode = models.CharField(
        max_length=20,
        choices=PAYMENT_MODE,
        default="Cash"
    )
    plan_type = models.CharField(
        max_length=20,
        choices=PLAN_TYPE,
        null=True,
        blank=True
    )
    
    def __str__(self):
        return self.name
    
class Attendance(models.Model):
    member = models.ForeignKey(
        Member,
        on_delete=models.CASCADE
    )

    date = models.DateField(auto_now_add=True)

    check_in = models.TimeField(
        null=True,
        blank=True
    )

    check_out = models.TimeField(
        null=True,
        blank=True
    )

    total_hours = models.CharField(
        max_length=20,
        blank=True
    )

    status = models.CharField(
        max_length=10,
        default="Present"
    )
    attendance_method = models.CharField(
        max_length=30,
        default="Manual"
    )

    device_id = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.member.name} - {self.date}"
class Activity(models.Model):

    DAY_CHOICES = [
        ("Monday", "Monday"),
        ("Tuesday", "Tuesday"),
        ("Wednesday", "Wednesday"),
        ("Thursday", "Thursday"),
        ("Friday", "Friday"),
        ("Saturday", "Saturday"),
        ("Sunday", "Sunday"),
    ]

    day = models.CharField(
        max_length=20,
        choices=DAY_CHOICES
    )

    workout_day = models.CharField(
        max_length=100
    )

    exercise_name = models.CharField(
        max_length=100
    )

    sets = models.CharField(
        max_length=50
    )

    description = models.TextField()

    image = models.ImageField(
        upload_to="activities/"
    )

    def __str__(self):
        return f"{self.day} - {self.exercise_name}"
    class Meta:
        unique_together = (
        "day",
        "exercise_name"
    )
class Payment(models.Model):

    PAYMENT_STATUS = (
        ("Pending", "Pending"),
        ("Paid", "Paid"),
        ("Failed", "Failed"),
    )

    PLAN_CHOICES = (
        ("Basic", "Basic"),
        ("Premium", "Premium"),
        ("Elite", "Elite"),
    )

    member = models.ForeignKey(
        Member,
        on_delete=models.CASCADE,
        related_name="payments"
    )
    member_name = models.CharField(
    max_length=100
    )
    PAYMENT_MODE = (
        ("Cash", "Cash"),
        ("UPI", "UPI"),
        ("Card", "Card"),
        ("Net_Banking", "Net_Banking"),
    )

    plan = models.CharField(
        max_length=20,
        choices=PLAN_CHOICES
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    payment_date = models.DateTimeField(
        auto_now_add=True
    )

    expiry_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS,
        default="Pending"
    )

    razorpay_order_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    razorpay_payment_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )
    payment_mode = models.CharField(
        max_length=20,
        choices=PAYMENT_MODE,
        default="Cash"
    )

    razorpay_signature = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )
    expiry_warning_sent = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.member.name} - {self.plan}"
    

class MemberExercise(models.Model):

    DAY_CHOICES = [
        ("Monday", "Monday"),
        ("Tuesday", "Tuesday"),
        ("Wednesday", "Wednesday"),
        ("Thursday", "Thursday"),
        ("Friday", "Friday"),
        ("Saturday", "Saturday"),
        ("Sunday", "Sunday"),
    ]

    member_day = models.CharField(
        max_length=20,
        choices=DAY_CHOICES,
        default="Monday"
    )

    workout_day = models.CharField(
        max_length=50,
        default="Chest Day"
    )

    trainer = models.CharField(
        max_length=100,
        default="Trainer"
    )

    member = models.ForeignKey(
        Member,
        on_delete=models.CASCADE,
        related_name="assigned_exercises"
    )

    assigned_date = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ("member", "member_day")


