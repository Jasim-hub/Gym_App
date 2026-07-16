from django.urls import path
from .views import MemberCreateView,MemberDetailView, LoginView, MemberListView, CheckInView, CheckOutView, AttendanceHistoryView, AttendanceListView
from .views import MonthlyReportView, ActivityListCreateView, ActivityListView, ActivityDetailView, create_order, save_payment, my_membership
from .views import membership_view, AssignWorkoutView, MemberWorkoutView, AllMemberWorkoutTableView, dashboard, member_payment_pdf


urlpatterns = [
     path("members/", MemberListView.as_view(), name="member-list"),
    path('members/create/', MemberCreateView.as_view(), name="member-create"),
    path('members/<str:user_id>/', MemberDetailView.as_view()),
    path("login/", LoginView.as_view()),
      path(
        "attendance/checkin/",
        CheckInView.as_view()
    ),

    path(
        "attendance/checkout/",
        CheckOutView.as_view()
    ),

    path(
        "attendance/<str:user_id>/",
        AttendanceHistoryView.as_view()
    ),
    path(
        "attendance/",
        AttendanceListView.as_view()
    ),
    path(
        "monthly/",
        MonthlyReportView.as_view()
    ),
     path(
        "activity/",
        ActivityListCreateView.as_view()
    ),

    path(
        "activity/<int:pk>/",
        ActivityDetailView.as_view()
    ),
    path(
        "activity/view/",
        ActivityListView.as_view()
    ),
     path(
        "payment/create-order/",
        create_order
    ),
    path("payment/save/", save_payment),
    path("membership/view/",membership_view),

    path("membership/<str:user_id>/", my_membership),
    path(
        "assign-workout/",
        AssignWorkoutView.as_view()
    ),

    path(
        "member-workout/<str:user_id>/",
        MemberWorkoutView.as_view()
    ),
    path("member-workout/",AllMemberWorkoutTableView.as_view()),
    path("memberdashboard/<str:user_id>/",dashboard),
    path(
    "payment-report/<str:user_id>/",
    member_payment_pdf,
    name="member-payment-pdf",
),
]
