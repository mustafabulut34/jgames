from django.db import models

from core.models import StarterModel


class Room(StarterModel):
    title = models.CharField(max_length=100, db_index=True)
    capacity = models.IntegerField(db_index=True)

    deleted = models.BooleanField(default=False, db_index=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["deleted", "capacity"])
        ]

    def __str__(self):
        return f"{self.title} - {self.capacity}"
