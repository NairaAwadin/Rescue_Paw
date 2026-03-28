"""
    Projet PFE - Paw Rescue
    Module : API - URLs
    Description :
        Définition des routes API pour les modèles de données + authentification JWT
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    TerritoireViewSet, AnimalViewSet, RefugeViewSet, ProfilAdoptantViewSet, 
    AnimalSignaledViewSet, PredictView, RegisterView, MatchingView
)

router = DefaultRouter()
router.register(r'territoires', TerritoireViewSet)
router.register(r'animals', AnimalViewSet)
router.register(r'refuges', RefugeViewSet)
router.register(r'profils', ProfilAdoptantViewSet)
router.register(r'signalements', AnimalSignaledViewSet)

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API Routes
    path('matching/', MatchingView.as_view(), name='matching'),
    path('', include(router.urls)),
    path('predict/', PredictView.as_view(), name='predict'),
]
