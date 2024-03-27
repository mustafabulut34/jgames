from datetime import datetime

from django.db.models import Count, F
from django.utils import timezone
from typing import List, Optional

from bookings.models import Booking
from rooms.models import Room
from rooms.resources.serializers import RoomSerializer


class RoomService:
    def delete_room(self, room: Room) -> None:
        room.deleted = True
        room.deleted_at = timezone.now()
        room.save()

    def add_room(self, serializer: RoomSerializer) -> None:
        serializer.save()

    def update_room(self, serializer) -> None:
        self.add_room(serializer)

    def get_available_rooms_between_dates(self, capacity: int, start_date: str, end_date: str) -> List[Room]:
        booked_rooms = Booking.objects.filter(
            start_date__lte=end_date,
            end_date__gte=start_date
        ).values_list('room', flat=True)

        available_rooms = Room.objects.filter(
            deleted=False,
            capacity__gte=capacity
        ).exclude(id__in=booked_rooms)

        return available_rooms

    def is_room_available_between_dates(self, room: Room, start_date: datetime, end_date: datetime,
                                        booking: Optional[Booking] = None) -> bool:
        q = Booking.objects.filter(
            room=room,
            start_date__lte=end_date,
            end_date__gte=start_date
        )
        if booking:
            q = q.exclude(id=booking.id)

        return not q.exists()
