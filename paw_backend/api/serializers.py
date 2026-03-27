"""
    Paw Rescue - Serializers
    Description :
    - Transforme les modèles Django en format JSON pour le Frontend React.
"""
from rest_framework import serializers
from .models import Territoire, ProfilAdoptant, Refuge, Animal, AnimalSignaled

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
        
class AnimalSignaledSerializer(serializers.ModelSerializer):
    # Pour afficher le nom de la ville et le code postal du territoire associé
    territoire_name = serializers.ReadOnlyField(source='territoire.ville')
    territoire_zip = serializers.ReadOnlyField(source='territoire.zip_code')
    
    # Pour afficher les détails de l'animal associé (si adopté)
    animal_adoption_name = serializers.ReadOnlyField(source='animal_adoption.name')
    animal_adoption_species = serializers.ReadOnlyField(source='animal_adoption.species')

    class Meta:
        model = AnimalSignaled
        fields = [
            'id', 'species', 'race', 'photo', 'description', 
            'territoire', 'territoire_name', 'territoire_zip',
            'adresse_approximative', 'type_signalement', 
            'status', 'animal_adoption', 'animal_adoption_name', 'animal_adoption_species',
            'created_at'
        ]
        
        # SÉCURITÉ : Ces champs ne peuvent PAS être modifiés par le signalant
        read_only_fields = ['status', 'animal_adoption', 'animal_adoption_name', 'animal_adoption_species', 'created_at']

    def validate_territoire(self, value):
        if not value:
            raise serializers.ValidationError("Le territoire est obligatoire pour le signalement.")
        return value
