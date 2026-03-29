"""
    Paw Rescue - Serializers
    Description :
    - Transforme les modèles Django en format JSON pour le Frontend React.
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Territoire, ProfilAdoptant, Refuge, Animal, AnimalSignaled, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user_type']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    user_type = serializers.ChoiceField(choices=['ADOPTANT', 'OBSERVATEUR'], default='ADOPTANT')
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'user_type']
    
    def create(self, validated_data):
        user_type = validated_data.pop('user_type', 'ADOPTANT')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        # Créer le profil utilisateur
        UserProfile.objects.create(user=user, user_type=user_type)
        return user

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
