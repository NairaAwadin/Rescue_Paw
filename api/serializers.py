"""
    Paw Rescue - Serializers
    Description :
    - Transforme les modèles Django en format JSON pour le Frontend React.
"""
from rest_framework import serializers
from .models import Territoire, ProfilAdoptant, Refuge, Animal

class TerritoireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Territoire
        fields = '__all__'

class AnimalSerializer(serializers.ModelSerializer):
    # On ajoute le nom du refuge pour que le front l'affiche
    refuge_name = serializers.ReadOnlyField(source='refuge.name')

    class Meta:
        model = Animal
        fields = '__all__'

class RefugeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refuge
        fields = '__all__'

class ProfilAdoptantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilAdoptant
        fields = '__all__'
