from rest_framework import generics
from rest_framework.views import APIView
import razorpay
from django.conf import settings
from rest_framework.response import Response
from .models import Member, Attendance, Activity, Payment, MemberExercise
from rest_framework.decorators import api_view
from dateutil.relativedelta import relativedelta
from django.core.mail import send_mail
import calendar
from io import BytesIO
from django.core.mail import EmailMessage
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from rest_framework import status
from .serializers import MemberSerializer, AttendanceSerializer, ActivitySerializer, PaymentSerializer
from datetime import date, timedelta
from datetime import datetime
import traceback
import logging
logger = logging.getLogger(__name__)

class MemberListView(generics.ListAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
class MemberCreateView(generics.CreateAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer

    def perform_create(self, serializer):
        member = serializer.save()

        try:
            send_user_id_email(member)
        except BaseException as error:
            print(
                "Registration email failed:",
                type(error).__name__,
                str(error),
            )
class MemberDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    lookup_field = "id"

class LoginView(APIView):

    def post(self, request):

        user_id = request.data.get("user_id")
        password = request.data.get("password")

        try:
            member = Member.objects.get(user_id=user_id)

            if member.password == password:

                return Response({
                    "user_id": member.user_id,
                    "name": member.name,
                    "email": member.email,
                    "phone": member.phone,
                    "date_of_birth": member.date_of_birth,
                    "gender": member.gender,
                    "joined_date": member.joined_date,
                    "profile_image": member.profile_image.url
                })

            return Response(
                {"message": "Invalid Password"},
                status=400
            )

        except Member.DoesNotExist:
            return Response(
                {"message": "User Not Found"},
                status=404
            )
class CheckInView(APIView):

    def post(self, request):

        user_id = request.data.get("user_id")

        try:
            member = Member.objects.get(
                user_id=user_id
            )

            attendance, created = Attendance.objects.get_or_create(
                member=member,
                date=date.today()
            )

            attendance.check_in = datetime.now().time()
            attendance.save()

            return Response({
                "message": "Check In Successful"
            })

        except Member.DoesNotExist:
            return Response(
                {"message": "Member Not Found"},
                status=404
            )
class CheckOutView(APIView):

    def post(self, request):

        user_id = request.data.get("user_id")

        try:

            member = Member.objects.get(
                user_id=user_id
            )

            attendance = Attendance.objects.get(
                member=member,
                date=date.today()
            )

            attendance.check_out = datetime.now().time()

            checkin = datetime.combine(
                date.today(),
                attendance.check_in
            )

            checkout = datetime.combine(
                date.today(),
                attendance.check_out
            )

            total = checkout - checkin

            attendance.total_hours = str(total)

            attendance.save()

            return Response({
                "message": "Check Out Successful",
                "hours": attendance.total_hours
            })

        except Attendance.DoesNotExist:
            return Response(
                {"message": "Check In First"},
                status=400
            )
class AttendanceHistoryView(APIView):

    def get(self, request, user_id):
        try:
            member = Member.objects.get(user_id=user_id)

            month = request.GET.get("month")
            year = request.GET.get("year")
            day = request.GET.get("day")

            attendance = Attendance.objects.filter(
                member=member
            )

            if month:
                attendance = attendance.filter(
                    date__month=int(month)
                )
            if day:
                attendance =attendance.filter(
                    date=day
                )    

            if year:
                attendance = attendance.filter(
                    date__year=int(year)
                )

            attendance = attendance.order_by("-date")

            serializer = AttendanceSerializer(
                attendance,
                many=True
            )

            return Response(serializer.data,)

        except Member.DoesNotExist:
            return Response(
                {"message": "Member Not Found"},
                status=404
            )
class AttendanceListView(generics.ListAPIView):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

class MonthlyReportView(APIView):

    def get(self, request):
        month = request.GET.get("month")
        year = request.GET.get("year")

        today = date.today()

        month = int(month) if month else today.month
        year = int(year) if year else today.year

        if month == today.month and year == today.year:
            days_passed = today.day
        else:
            days_passed = calendar.monthrange(year, month)[1]

        members = Member.objects.all()
        data = []

        for member in members:
            attendance = Attendance.objects.filter(
                member=member,
                date__month=month,
                date__year=year
            )

            present_days = attendance.count()
            absent_days = days_passed - present_days

            attendance_percentage = round(
                (present_days / days_passed) * 100,
                2
            ) if days_passed > 0 else 0

            status = "Active" if attendance_percentage >= 50 else "Inactive"

            data.append({
                "user_id": member.user_id,
                "name": member.name,
                "present_days": present_days,
                "absent_days": absent_days,
                "attendance_percentage": attendance_percentage,
                "current_streak": 0,
                "status": status,
                "month": month,
                "year": year,
            })

        return Response(data)    
class ActivityListCreateView(
    generics.ListCreateAPIView
):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class ActivityDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    

class ActivityListView(generics.ListAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

@api_view(["POST"])
def create_order(request):

    amount = request.data.get("amount")

    client = razorpay.Client(
        auth=(
            settings.RAZORPAY_KEY_ID,
            settings.RAZORPAY_KEY_SECRET
        )
    )

    order = client.order.create({
        "amount": int(amount) * 100,
        "currency": "INR"
    })

    return Response({
        "order_id": order["id"],
        "amount": order["amount"],
        "key": settings.RAZORPAY_KEY_ID
    })



@api_view(["POST"])
def save_payment(request):
    user_id = request.data.get("user_id")
    plan = request.data.get("plan")
    amount = request.data.get("amount")
    validity = int(request.data.get("validity"))

    razorpay_payment_id = request.data.get("razorpay_payment_id")
    razorpay_order_id = request.data.get("razorpay_order_id")
    razorpay_signature = request.data.get("razorpay_signature")

    member = Member.objects.get(user_id=user_id)

    payment_mode = "Cash"

    if razorpay_payment_id and razorpay_payment_id != "dummy_payment":
        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

        payment_details = client.payment.fetch(razorpay_payment_id)
        payment_mode = payment_details.get("method", "Razorpay")
    else:
        payment_mode = request.data.get("payment_mode", "Cash")

    old_payment = Payment.objects.filter(
        member=member,
        status="Paid"
    ).order_by("-payment_date").first()

    new_expiry_date = date.today() + relativedelta(months=validity)

    if old_payment:
        remaining_days = (old_payment.expiry_date - date.today()).days

        if remaining_days > 5:
            return Response({
                "error": "You already have an active plan. Renewal allowed only before 5 days of expiry."
            }, status=400)

        old_payment.member_name = member.name
        old_payment.plan = plan
        old_payment.amount = amount
        old_payment.payment_mode = payment_mode
        old_payment.expiry_date = new_expiry_date
        old_payment.status = "Paid"
        old_payment.razorpay_order_id = razorpay_order_id
        old_payment.razorpay_payment_id = razorpay_payment_id
        old_payment.razorpay_signature = razorpay_signature
        old_payment.save()

        payment = old_payment

    else:
        payment = Payment.objects.create(
            member=member,
            member_name=member.name,
            plan=plan,
            amount=amount,
            payment_mode=payment_mode,
            expiry_date=new_expiry_date,
            status="Paid",
            razorpay_order_id=razorpay_order_id,
            razorpay_payment_id=razorpay_payment_id,
            razorpay_signature=razorpay_signature
        )
    send_payment_receipt_email(payment)
    return Response({
        "message": "Payment Saved Successfully",
        "plan": payment.plan,
        "amount": payment.amount,
        "payment_mode": payment.payment_mode,
        "expiry_date": payment.expiry_date,
        "status": payment.status
    })
@api_view(["GET"])
def my_membership(request, user_id):

    member = Member.objects.get(user_id=user_id)

    payment = Payment.objects.filter(
        member=member,
        status="Paid"
    ).order_by("-payment_date").first()

    if not payment:
        return Response({
            "status": "Inactive"
        })

    remaining_days = (
        payment.expiry_date - date.today()
    ).days
    can_renew = remaining_days <= 5
    return Response({
        "plan": payment.plan,
        "amount":payment.amount,
        "name":member.name,
        "status": payment.status if remaining_days >= 0 else "Expired",
        "start_date": payment.payment_date.date(),
        "expiry_date": payment.expiry_date,
        "remaining_days": remaining_days,
        "can_renew": can_renew,
        "payment_mode":payment.payment_mode


    })
@api_view(["GET"])
def membership_view(request):
    payments = Payment.objects.all().order_by("-payment_date")

    data = []

    for payment in payments:
        remaining_days = (payment.expiry_date - date.today()).days

        data.append({
            "id": payment.id,
            "member_name": payment.member.name,
            "plan": payment.plan,
            "amount": float(payment.amount),
            "status": payment.status if remaining_days >= 0 else "Expired",
            "payment_date": payment.payment_date.date(),
            "expiry_date": payment.expiry_date,
            "remaining_days": remaining_days,
            "payment_mode":payment.payment_mode,
            "payment_id":payment.razorpay_payment_id
        })

    return Response(data)
def send_expiry_warnings():
    target_date = date.today() + timedelta(days=5)

    payments = Payment.objects.filter(
        expiry_date=target_date,
        status="Paid",
        expiry_warning_sent=False
    )

    for payment in payments:
        member = payment.member

        subject = "Gym Membership Expiry Reminder"

        message = f"""
Hi {member.name},

Your {payment.plan} Plan at Infinity Wellness Hub will expire on {payment.expiry_date}.

Please renew your membership to continue your fitness journey.

Thank you,
Infinity Wellness Hub
"""

        send_mail(
            subject,
            message,
            "jasimr796@gmail.com",
            [member.email],
            fail_silently=False,
        )

        payment.expiry_warning_sent = True
        payment.save()


def send_payment_receipt_email(payment):
    buffer = BytesIO()

    pdf = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawCentredString(width / 2, height - 60, "Infinity Wellness Hub")

    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawCentredString(width / 2, height - 90, "Membership Payment Receipt")

    pdf.setFont("Helvetica", 11)

    y = height - 140

    details = [
        ("Member Name", payment.member.name),
        ("User ID", payment.member.user_id),
        ("Plan", payment.plan),
        ("Amount", f"Rs. {payment.amount}"),
        ("Payment Method", payment.payment_mode),
        ("Payment Date", str(payment.payment_date.date())),
        ("Expiry Date", str(payment.expiry_date)),
        ("Status", payment.status),
    ]

    for label, value in details:
        pdf.drawString(80, y, f"{label}:")
        pdf.drawString(230, y, str(value))
        y -= 25

    pdf.setFont("Helvetica", 10)
    pdf.drawCentredString(
        width / 2,
        60,
        "Thank you for choosing Infinity Wellness Hub."
    )

    pdf.save()

    buffer.seek(0)

    email = EmailMessage(
        subject="Infinity Wellness Hub - Payment Receipt",
        body=f"""
Dear {payment.member.name},

Your membership payment has been recorded successfully.

Please find your payment receipt attached.

Thank you,
Infinity Wellness Hub
""",
        from_email=settings.EMAIL_HOST_USER,
        to=[payment.member.email],
    )

    email.attach(
        f"{payment.member.name}-payment-receipt.pdf",
        buffer.getvalue(),
        "application/pdf"
    )

    email.send()
    print("Sending email to:", payment.member.email)





class AssignWorkoutView(APIView):

    def post(self, request):

       
        member_id = request.data.get("member_id")
        member_day = request.data.get("member_day")
        workout_day = request.data.get("workout_day")

        try:
            
            member = Member.objects.get(user_id=member_id)
            if workout_day and workout_day.strip() != "":
                duplicate_workout = MemberExercise.objects.filter(
                    member=member,
                    workout_day=workout_day
                ).exclude(
                    member_day=member_day
                ).exists()

                if duplicate_workout:
                    return Response({
                        "error": f"{workout_day} is already assigned for this member in this week."
                    }, status=400)

            MemberExercise.objects.update_or_create(
                member=member,
                member_day=member_day,
                defaults={
                    "trainer": "Trainer",
                    "workout_day": workout_day
                }
            )

            return Response({
                "message": "Workout assigned successfully."
            })

        except Member.DoesNotExist:
            return Response(
                {"error": "Member or Trainer not found"},
                status=status.HTTP_404_NOT_FOUND
            )



class MemberWorkoutView(APIView):

    def get(self, request, user_id):
        today = date.today().strftime("%A")

        try:
            plan = MemberExercise.objects.get(
                member__user_id=user_id,
                member_day=today
            )

            activities = Activity.objects.filter(
                workout_day=plan.workout_day
            )

            data = []

            for item in activities:
                data.append({
                    "exercise_name": item.exercise_name,
                    "sets": item.sets,
                    "description": item.description,
                    "image": request.build_absolute_uri(item.image.url) if item.image else None,
                })

            return Response({
                "member_day": today,
                "workout_day": plan.workout_day,
                "activities": data
            })

        except MemberExercise.DoesNotExist:
            return Response({
                "member_day": today,
                "workout_day": "",
                "activities": []
            })
class AllMemberWorkoutTableView(APIView):

    def get(self, request):
        members = Member.objects.all()

        data = []

        for member in members:
            plans = MemberExercise.objects.filter(member=member)

            member_data = {
                "user_id": member.user_id,
                "name": member.name,
                "Monday": "",
                "Tuesday": "",
                "Wednesday": "",
                "Thursday": "",
                "Friday": "",
                "Saturday": "",
            }

            for plan in plans:
                member_data[plan.member_day] = plan.workout_day

            data.append(member_data)

        return Response(data)



@api_view(["GET"])
def dashboard(request):
    user_id = request.GET.get("user_id")

    if not user_id:
        return Response(
            {"detail": "user_id is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        member = Member.objects.get(user_id=user_id)
    except Member.DoesNotExist:
        return Response(
            {"detail": "Member not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    latest_payment = (
        Payment.objects
        .filter(member=member, status="Paid")
        .order_by("-payment_date")
        .first()
    )

    membership = None

    if latest_payment:
        remaining_days = (
            latest_payment.expiry_date - date.today()
        ).days

        membership = {
            "plan": latest_payment.plan,
            "amount": latest_payment.amount,
            "status": "Active" if remaining_days >= 0 else "Expired",
            "start_date": latest_payment.payment_date.date(),
            "expiry_date": latest_payment.expiry_date,
            "remaining_days": max(remaining_days, 0),
        }

    attendance_records = Attendance.objects.filter(member=member)

    attendance = {
        "present_days": attendance_records.filter(
            status="Present"
        ).count(),
        "absent_days": attendance_records.filter(
            status="Absent"
        ).count(),
    }

    today_name = date.today().strftime("%A")

    today_workouts = Activity.objects.filter(day=today_name)

    return Response({
        "member": MemberSerializer(member).data,
        "membership": membership,
        "attendance": attendance,
        "today_workout": ActivitySerializer(
            today_workouts,
            many=True
        ).data,
    })


def send_user_id_email(member):
    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json",
    }

    data = {
        "sender": {
            "name": "Infinity Wellness Hub",
            "email": settings.DEFAULT_FROM_EMAIL,
        },
        "to": [
            {
                "email": member.email,
                "name": member.name,
            }
        ],
        "subject": "Registration Successful",
        "textContent": f"""
Welcome {member.name}

Your registration was successful.

Member ID: {member.user_id}

Thank you for choosing Infinity Wellness Hub.
""",
    }

    response = requests.post(url, headers=headers, json=data)
    print(response.status_code)
    print(response.text)