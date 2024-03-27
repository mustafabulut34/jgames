from rest_framework import serializers

from bookings.models import Booking
from rooms.models import Room


class BookingSerializer(serializers.ModelSerializer):
    room = serializers.PrimaryKeyRelatedField(queryset=Room.objects.filter(deleted=False))
    booking_date = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = Booking
        fields = ["id", "booking_number", "user", "room", "start_date", "end_date", "booking_date"]
        read_only_fields = ["id", "booking_number", "user"]

    def validate(self, attrs):
        result = super(BookingSerializer, self).validate(attrs)
        if attrs["start_date"] >= attrs["end_date"]:
            raise serializers.ValidationError("Start date cannot bigger or equal than end date.")
        return result

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['room_title'] = str(instance.room.title)
        data['user_username'] = str(instance.user.username)
        return data
