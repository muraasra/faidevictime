from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AssistanceRequestViewSet

router = DefaultRouter()
router.register(r'requests', AssistanceRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 