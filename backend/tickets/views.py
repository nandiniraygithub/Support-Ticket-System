from rest_framework import viewsets, views, status, filters
from rest_framework.response import Response
from django.db.models import Count, Avg, Q
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Ticket
from .serializers import TicketSerializer, StatsSerializer, TicketClassifySerializer
from .llm_service import classify_description
import os
import json

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'priority', 'status']
    search_fields = ['title', 'description']

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

class StatsView(views.APIView):
    def get(self, request):
        total_tickets = Ticket.objects.count()
        open_tickets = Ticket.objects.filter(status='open').count()
        
        # Priority breakdown
        priority_data = Ticket.objects.values('priority').annotate(count=Count('priority'))
        priority_breakdown = {item['priority']: item['count'] for item in priority_data}
        
        # Category breakdown
        category_data = Ticket.objects.values('category').annotate(count=Count('category'))
        category_breakdown = {item['category']: item['count'] for item in category_data}
        
        # Avg tickets per day
        first_ticket = Ticket.objects.order_by('created_at').first()
        if first_ticket:
            days_diff = (timezone.now() - first_ticket.created_at).days + 1
            avg_per_day = total_tickets / days_diff
        else:
            avg_per_day = 0

        data = {
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "avg_tickets_per_day": round(avg_per_day, 1),
            "priority_breakdown": priority_breakdown,
            "category_breakdown": category_breakdown,
        }
        return Response(data)

class ClassifyView(views.APIView):
    def post(self, request):
        serializer = TicketClassifySerializer(data=request.data)
        if serializer.is_valid():
            description = serializer.validated_data['description']
            result = classify_description(description)
            return Response(result)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
