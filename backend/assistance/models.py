from django.db import models
from django.utils import timezone

class AssistanceRequest(models.Model):
    SITUATION_CHOICES = [
        ('urgence', 'Situation d\'urgence'),
        ('harcelement', 'Harcèlement'),
        ('violence', 'Violence'),
        ('autre', 'Autre situation'),
    ]

    CONTACT_CHOICES = [
        ('chat', 'Chat en ligne'),
        ('email', 'Email'),
        ('phone', 'Téléphone'),
    ]

    STATUS_CHOICES = [
        ('nouveau', 'Nouveau'),
        ('en_cours', 'En cours de traitement'),
        ('traite', 'Traité'),
        ('ferme', 'Fermé'),
    ]

    situation_type = models.CharField(max_length=20, choices=SITUATION_CHOICES)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    message = models.TextField()
    contact_preference = models.CharField(max_length=10, choices=CONTACT_CHOICES)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='nouveau')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    assigned_to = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_requests')

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Demande d\'assistance'
        verbose_name_plural = 'Demandes d\'assistance'

    def __str__(self):
        return f"Demande #{self.id} - {self.get_situation_type_display()} - {self.created_at.strftime('%d/%m/%Y')}" 