from rest_framework import serializers
from .models import Member, Attendance, Activity, Payment, UpdatedMember

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
class MemberSerializer(serializers.ModelSerializer):

    class Meta:

        model = UpdatedMember

        fields = "__all__"

        extra_kwargs = {
            "password":{
                "write_only":True,
                "required":False
            }
        }

    def update(self, instance, validated_data):

        password = validated_data.pop("password",None)

        for key,value in validated_data.items():
            setattr(instance,key,value)

        if password:
            instance.password = make_password(password)

        instance.save()

        return instance