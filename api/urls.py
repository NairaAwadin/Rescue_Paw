"""
    Projet PFE - Paw Rescue
    Module : API - URLs
    Description :
        Définition des routes API pour les modèles de données
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TerritoireViewSet, AnimalViewSet, RefugeViewSet, ProfilAdoptantViewSet

router = DefaultRouter()
router.register(r'territoires', TerritoireViewSet)
router.register(r'animals', AnimalViewSet)
router.register(r'refuges', RefugeViewSet)
router.register(r'profils', ProfilAdoptantViewSet)

urlpatterns = [
    path('', include(router.urls)),
]