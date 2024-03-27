from datetime import datetime

from rest_framework import exceptions

from bookings.generators import generate_booking_number
from bookings.models import Booking
from bookings.resources.serializers import BookingSerializer
from rooms.models import Room
from rooms.service import RoomService


class BookingService:
    room_service = RoomService()

    def delete_booking(self, instance: Booking) -> None:
        instance.delete()

    def add_booking(self, serializer: BookingSerializer, user) -> None:
        room = serializer.validated_data["room"]
        start_date = serializer.validated_data["start_date"]
        end_date = serializer.validated_data["end_date"]

        if not self.room_service.is_room_available_between_dates(room, start_date, end_date):
            raise exceptions.ValidationError(
                detail="Room is not available within the specified date range.",
                code="error_101"
            )

        data = {
            "user": user,
            "booking_number": generate_booking_number()
        }

        serializer.save(**data)

    def update_booking(self, serializer: BookingSerializer, user) -> None:
        room: Room = serializer.validated_data["room"]
        start_date: datetime = serializer.validated_data["start_date"]
        end_date: datetime = serializer.validated_data["end_date"]
        booking: Booking = serializer.instance

        if room == booking.room and start_date == booking.start_date and end_date == booking.end_date:
            return

        if not self.room_service.is_room_available_between_dates(room, start_date, end_date, booking):
            raise exceptions.ValidationError(
                detail="Room is not available within the specified date range.",
                code="error_101"
            )

        serializer.save()
