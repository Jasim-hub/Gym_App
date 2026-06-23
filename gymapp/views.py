from rest_framework import generics
from rest_framework.views import APIView
import razorpay
from django.conf import settings
from rest_framework.response import Response
from .models import Member, Attendance, Activity, Payment
from rest_framework.decorators import api_view
from dateutil.relativedelta import relativedelta
from django.core.mail import send_mail



from .serializers import MemberSerializer, AttendanceSerializer, ActivitySerializer
from datetime import date, timedelta
from datetime import datetime

class MemberListView(generics.ListAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
class MemberCreateView(generics.CreateAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
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

            member = Member.objects.get(
                user_id=user_id
            )

            attendance = Attendance.objects.filter(
                member=member
            ).order_by("-date")

            serializer = AttendanceSerializer(
                attendance,
                many=True
            )

            return Response(serializer.data)

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

        members = Member.objects.all()

        data = []

        today = date.today()
        days_passed = today.day

        for member in members:

            attendance = Attendance.objects.filter(
                member=member,
                date__month=today.month,
                date__year=today.year
            )

            present_days = attendance.count()
            absent_days = days_passed - present_days
            attendance_percentage = 0
            if days_passed > 0:
                attendance_percentage = round(
                    (present_days / days_passed) * 100,
                    2
    )
            if attendance_percentage >= 50:
                status = "Active"
            else:
             status = "Inactive"

            data.append({
                "user_id": member.user_id,
                "name": member.name,
                "present_days": present_days,
                "absent_days": absent_days,
                "attendance_percentage": attendance_percentage,
                "current_streak": 0,
                 "status": status,
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
