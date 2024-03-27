from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from rooms.models import Room
from rooms.resources.serializers import RoomSerializer, AvailableRoomsSerializer
from rooms.service import RoomService


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    ordering_fields = ["title", "capacity"]
    service = RoomService()

    def get_queryset(self):
        return Room.objects.filter(deleted=False).order_by("-capacity")

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def perform_destroy(self, instance):
        self.service.delete_room(instance)

    def perform_create(self, serializer):
        self.service.add_room(serializer)

    def perform_update(self, serializer):
        self.service.update_room(serializer)

    @action(methods=['get'], detail=False)
    def available_rooms(self, request, *args, **kwargs):
        serializer = AvailableRoomsSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)

        capacity = serializer.validated_data["capacity"]
        start_date = serializer.validated_data["start_date"]
        end_date = serializer.validated_data["end_date"]

        rooms = self.service.get_available_rooms_between_dates(capacity, start_date, end_date)
        serializer = self.get_serializer(rooms, many=True)
        return Response(serializer.data)
