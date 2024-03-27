from django.contrib.auth import get_user_model
from django.db import models

from core.models import StarterModel
from rooms.models import Room


class Booking(StarterModel):
    user = models.ForeignKey(get_user_model(), on_delete=models.PROTECT, db_index=True)
    room = models.ForeignKey(Room, on_delete=models.PROTECT, db_index=True)
    booking_number = models.CharField(max_length=32, unique=True, null=False)

    start_date = models.DateField(db_index=True)
    end_date = models.DateField(db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=["start_date", "end_date"]),
            models.Index(fields=["room", "start_date", "end_date"]),
        ]

    def __str__(self):
        return f"{self.room} | {self.start_date} & {self.end_date}"
