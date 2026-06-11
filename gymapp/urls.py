from django.urls import path
from .views import MemberCreateView,MemberDetailView, LoginView, MemberListView

urlpatterns = [
     path("members/", MemberListView.as_view(), name="member-list"),
    path('members/create/', MemberCreateView.as_view(), name="member-create"),
    path('members/<int:id>/', MemberDetailView.as_view()),
    path("login/", LoginView.as_view()),
]