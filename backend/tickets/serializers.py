from rest_framework import serializers
from .models import Ticket

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'

class TicketClassifySerializer(serializers.Serializer):
    description = serializers.CharField()

class StatsSerializer(serializers.Serializer):
    total_tickets = serializers.IntegerField()
    open_tickets = serializers.IntegerField()
    avg_tickets_per_day = serializers.FloatField()
    priority_breakdown = serializers.DictField()
    category_breakdown = serializers.DictField()
