from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
from .models import AssistanceRequest
from .serializers import AssistanceRequestSerializer

class AssistanceRequestViewSet(viewsets.ModelViewSet):
    queryset = AssistanceRequest.objects.all()
    serializer_class = AssistanceRequestSerializer
    permission_classes = []  # Pas de restrictions de permissions

    def perform_create(self, serializer):
        serializer.save(status='nouveau')

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        assistance_request = self.get_object()
        assistance_request.assigned_to = request.user if request.user.is_authenticated else None
        assistance_request.status = 'en_cours'
        assistance_request.save()
        return Response({'status': 'assigned'})

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        assistance_request = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(AssistanceRequest.STATUS_CHOICES):
            return Response(
                {'error': 'Status invalide'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        assistance_request.status = new_status
        assistance_request.save()
        return Response({'status': 'updated'})

    def get_queryset(self):
        queryset = AssistanceRequest.objects.all()
        
        # Filtrage par statut
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        
        # Filtrage par type de situation
        situation_type = self.request.query_params.get('situation_type', None)
        if situation_type:
            queryset = queryset.filter(situation_type=situation_type)
        
        # Filtrage par date
        date_from = self.request.query_params.get('date_from', None)
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
            
        date_to = self.request.query_params.get('date_to', None)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        
        return queryset 