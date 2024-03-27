from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.views import AuthView
from bookings.resources.views import BookingViewSet
from rooms.resources.views import RoomViewSet

router = DefaultRouter()
router.register("rooms", RoomViewSet)
router.register("bookings", BookingViewSet)

urlpatterns = [
    path("auth/", AuthView.as_view()),
    path("", include(router.urls)),
]
