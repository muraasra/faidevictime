from rest_framework import serializers
from .models import AssistanceRequest

class AssistanceRequestSerializer(serializers.ModelSerializer):
    situation_type_display = serializers.CharField(source='get_situation_type_display', read_only=True)
    contact_preference_display = serializers.CharField(source='get_contact_preference_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = AssistanceRequest
        fields = [
            'id', 'situation_type', 'situation_type_display',
            'first_name', 'age', 'message', 'contact_preference',
            'contact_preference_display', 'email', 'phone',
            'status', 'status_display', 'created_at', 'updated_at',
            'assigned_to'
        ]
        read_only_fields = ['status', 'assigned_to', 'created_at', 'updated_at'] 