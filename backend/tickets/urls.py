from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, StatsView, ClassifyView

router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')

urlpatterns = [
    path('tickets/stats/', StatsView.as_view(), name='ticket-stats'),
    path('tickets/classify/', ClassifyView.as_view(), name='ticket-classify'),
    path('', include(router.urls)),
]
