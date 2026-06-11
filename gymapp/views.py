from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Member
from .serializers import MemberSerializer

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