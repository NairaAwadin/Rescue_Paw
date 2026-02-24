"""
    Projet PFE - Paw Rescue
    Description :
        Configuration de l'interface d'administration Django pour les modèles de données.
"""

from django.contrib import admin
from .models import Territoire, ProfilAdoptant, Refuge, Animal

# score
@admin.register(Territoire)
class TerritoireAdmin(admin.ModelAdmin):
    list_display = ('ville', 'zip_code', 'well_being_score', 'risk_index')

# Gestion des animaux
@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = ('name', 'species', 'race', 'is_adoptable')
    list_filter = ('species', 'is_adoptable') # pratique pour filtrer Chien/Chat

admin.site.register(Refuge)
admin.site.register(ProfilAdoptant)