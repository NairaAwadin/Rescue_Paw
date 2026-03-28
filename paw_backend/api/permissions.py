"""
** Permissions personnalisées pour Paw Rescue
** Descriptiion : 
** Gère les rôles : ADOPTANT, OBSERVATEUR
"""

from rest_framework.permissions import BasePermission
from .models import UserProfile

class IsAdoptant(BasePermission):
    message = "Accès réservé aux adoptants"
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            return user_profile.user_type == 'ADOPTANT'
        except UserProfile.DoesNotExist:
            return False

class IsObservateur(BasePermission):
    message = "Accès réservé aux observateurs"
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            user_profile = UserProfile.objects.get(user=request.user)
            return user_profile.user_type == 'OBSERVATEUR'
        except UserProfile.DoesNotExist:
            return False
