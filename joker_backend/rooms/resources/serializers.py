from rest_framework import serializers

from rooms.models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ["id", "title", "capacity"]


class AvailableRoomsSerializer(serializers.Serializer):
    capacity = serializers.IntegerField(min_value=1)
    start_date = serializers.DateField()
    end_date = serializers.DateField()

    def validate(self, attrs):
        result = super(AvailableRoomsSerializer, self).validate(attrs)
        if attrs["start_date"] >= attrs["end_date"]:
            raise serializers.ValidationError("Start date cannot bigger or equal than end date.")
        return result
