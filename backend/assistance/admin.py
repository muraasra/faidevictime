from django.contrib import admin
from .models import AssistanceRequest

@admin.register(AssistanceRequest)
class AssistanceRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'situation_type', 'first_name', 'contact_preference', 'status', 'created_at', 'assigned_to')
    list_filter = ('status', 'situation_type', 'contact_preference', 'created_at')
    search_fields = ('first_name', 'message', 'email', 'phone')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Informations de base', {
            'fields': ('situation_type', 'first_name', 'age', 'message')
        }),
        ('Contact', {
            'fields': ('contact_preference', 'email', 'phone')
        }),
        ('Suivi', {
            'fields': ('status', 'assigned_to', 'created_at', 'updated_at')
        }),
    ) 