"""
    Paw Rescue - Views (Semaine 1)
    Logique de traitement des requêtes API.
    - TerritoireViewSet : CRUD pour les données territoriales (Scores, INSEE, OSM).
    - ProfilAdoptantViewSet : Gestion des profils adoptants (Habitat + Quiz).
    - RefugeViewSet : CRUD pour les refuges (Localisation, Capacité).
    - AnimalViewSet : Gestion des profils animaux (Comportement, Santé).
"""

from django.shortcuts import render
from rest_framework import viewsets
from .models import Territoire, Animal, Refuge, ProfilAdoptant
from .serializers import TerritoireSerializer, AnimalSerializer, RefugeSerializer, ProfilAdoptantSerializer

class TerritoireViewSet(viewsets.ModelViewSet):
    queryset = Territoire.objects.all()
    serializer_class = TerritoireSerializer

class AnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer

class RefugeViewSet(viewsets.ModelViewSet):
    queryset = Refuge.objects.all()
    serializer_class = RefugeSerializer

class ProfilAdoptantViewSet(viewsets.ModelViewSet):
    queryset = ProfilAdoptant.objects.all()
    serializer_class = ProfilAdoptantSerializer
