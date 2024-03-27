from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticated, OR

from bookings.models import Booking
from bookings.resources.permissions import IsOwnerBooking
from bookings.resources.serializers import BookingSerializer
from bookings.service import BookingService


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    ordering_fields = ["start_date", "end_date"]
    service = BookingService()

    def get_queryset(self):
        if self.request.user.is_staff:
            return Booking.objects.all()
        return Booking.objects.filter(user=self.request.user)

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            return [OR(IsAdminUser(), IsOwnerBooking())]

        return [IsAuthenticated()]

    def perform_destroy(self, instance):
        self.service.delete_booking(instance)

    def perform_create(self, serializer):
        user = self.request.user
        self.service.add_booking(serializer, user)

    def perform_update(self, serializer):
        user = self.request.user
        self.service.update_booking(serializer, user)
