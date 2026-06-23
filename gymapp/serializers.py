from rest_framework import serializers
from .models import Member, Attendance, Activity, Payment

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'
class AttendanceSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(
        source="member.name",
        read_only=True
    )

    class Meta:
        model = Attendance
        fields = "__all__"
class ActivitySerializer(serializers.ModelSerializer):

    def validate(self, data):

        if Activity.objects.filter(
            day=data["day"],
            exercise_name=data["exercise_name"]
        ).exists():

            raise serializers.ValidationError(
                "Exercise already exists for this day."
            )

        return data

    class Meta:
        model = Activity
        fields = "__all__"
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"