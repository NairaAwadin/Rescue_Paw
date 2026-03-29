"""
    Paw Rescue - Views
    Logique de traitement des requêtes API.
    - RegisterView : Créer un account
    - TerritoireViewSet : CRUD pour les données territoriales (Scores, INSEE, OSM).
    - ProfilAdoptantViewSet : Gestion des profils adoptants (Habitat + Quiz).
    - RefugeViewSet : CRUD pour les refuges (Localisation, Capacité).
    - AnimalViewSet : Gestion des profils animaux (Comportement, Santé).
    - AnimalSignaledViewSet : Gestion des signalements d'animaux trouvés/abandonnés.
    - PredictView : Endpoint ML pour prédire la compatibilité adoptant-animal.
"""

import os
import joblib
import pandas as pd
import numpy as np
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Territoire, Animal, Refuge, ProfilAdoptant, AnimalSignaled, UserProfile
from .serializers import (
    TerritoireSerializer, AnimalSerializer, RefugeSerializer, ProfilAdoptantSerializer, 
    AnimalSignaledSerializer, RegisterSerializer, UserSerializer
)
from .permissions import IsAdoptant, IsObservateur

def prepare_prediction_data(profil, animal):
    """
    Prépare les données de prédiction selon le format de paw_data/Scripts_ML.
    
    Approche idéntique à:
    - paw_data/Scripts_ML/preparation_donnees_ML.py
    - paw_data/donnees_propres/training_matching.csv
    
    Args:
        profil: ProfilAdoptant instance
        animal: Animal instance
    
    Returns:
        dict avec toutes les features pour la prédiction
    """
    # Récupère le territoire pour le score bien-être
    territoire = None
    try:
        territoire = Territoire.objects.get(zip_code=profil.zip_code)
    except Territoire.DoesNotExist:
        pass
    
    data = {
        # Features adoptant
        'type_habitat': profil.type_habitat,
        'has_garden': int(profil.has_garden),
        'niv_activite': profil.niv_activite,
        'has_children': int(profil.has_children),
        'has_pets': int(profil.has_pets),
        'has_birds': int(profil.has_birds),
        'has_rodents': int(profil.has_rodents),
        'has_cats': int(profil.has_cats),
        'has_dogs': int(profil.has_dogs),
        'temps_dispo': profil.temps_dispo,
        'niv_experience': profil.niv_experience,
        'note_bien_etre': territoire.well_being_score if territoire else 'C',
        
        # Features animal
        'age': animal.age,
        'age_category': animal.age_category,
        'species': animal.species,
        'race': animal.race,
        'taille': animal.taille,
        'energy_need': animal.energy_need,
        'social_compatibility': int(animal.social_compatibility),
        'kid_friendly': int(animal.kid_friendly),
        'needs_garden': int(animal.needs_garden),
    }
    
    return data


def predict_compatibility_ml(profil, animal):
    """
    Prédit la compatibilité avec le modèle ML.
    
    Args:
        profil: ProfilAdoptant instance
        animal: Animal instance
    
    Returns:
        dict avec score, confidence, is_compatible
    """
    try:
        # Chemin du modèle entraîné
        model_path = os.path.join(
            os.path.dirname(__file__), 
            '..', '..', 'paw_data', 'models', 'matching_model.joblib'
        )
        
        if not os.path.exists(model_path):
            return None
        
        # Prépare les données
        data_dict = prepare_prediction_data(profil, animal)
        df = pd.DataFrame([data_dict])
        
        # One-hot encode (même approche que paw_data/Scripts_ML/preparation_donnees_ML.py)
        categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
        if categorical_cols:
            df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)
        
        # Charge et exécute le modèle
        model = joblib.load(model_path)
        prediction = model.predict(df)[0]
        confidence = model.predict_proba(df)[0][1] if hasattr(model, 'predict_proba') else None
        
        return {
            'score': int(prediction),
            'confidence': float(confidence) if confidence is not None else None,
            'is_compatible': bool(prediction == 1),
            'model_type': 'random_forest'
        }
    
    except Exception as e:
        return None


def predict_compatibility_rules(profil, animal):
    """
    Prédiction par règles (fallback quand le modèle ML n'est pas disponible).
    
    Args:
        profil: ProfilAdoptant instance
        animal: Animal instance
    
    Returns:
        dict avec score, confidence, is_compatible
    """
    score = 50  # Score de base
    
    # Hard constraints
    if profil.has_children and not animal.kid_friendly:
        score -= 30
    if profil.has_pets and not animal.social_compatibility:
        score -= 20
    if animal.needs_garden and not profil.has_garden:
        score -= 15
    
    # Soft constraints
    if profil.niv_activite == animal.energy_need:
        score += 15
    elif abs(profil.niv_activite - animal.energy_need) <= 1:
        score += 10
    
    if profil.type_habitat == 'HOUSE':
        score += 5
    elif profil.type_habitat == 'FARM' and animal.species == 'DOG':
        score += 10
    
    if profil.niv_experience >= 2:
        score += 5
    
    if profil.temps_dispo >= 4 and animal.energy_need >= 3:
        score += 10
    
    # Clamp score entre 0 et 100
    score = max(0, min(100, score))
    compatibility = 1 if score >= 50 else 0
    
    return {
        'score': compatibility,
        'confidence': score / 100,
        'is_compatible': bool(compatibility == 1),
        'model_type': 'rule_based'
    }

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'success': True,
                'message': 'Compte créé avec succès',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MatchingView(APIView):
    """
    Endpoint pour trouver les meilleurs matchs adoptant-animal
    Retourne les 5 meilleurs matchs.
    """
    permission_classes = [IsAdoptant]
    
    def post(self, request):
        try:
            user = request.user
            
            # Récupère le profil adoptant
            try:
                profil = ProfilAdoptant.objects.get(user=user)
            except ProfilAdoptant.DoesNotExist:
                return Response(
                    {'error': 'Profil adoptant non trouvé. Veuillez créer un profil.'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Récupère tous les animaux adoptables
            animaux = Animal.objects.filter(is_adoptable=True)
            
            if not animaux.exists():
                return Response({
                    'success': True,
                    'profil': ProfilAdoptantSerializer(profil).data,
                    'matchs': [],
                    'message': 'Aucun animal disponible pour le moment'
                })
            
            # Score tous les animaux
            matchs = []
            for animal in animaux:
                # Essaie le modèle ML d'abord
                result = predict_compatibility_ml(profil, animal)
                if result is None:
                    # Fallback sur les règles
                    result = predict_compatibility_rules(profil, animal)
                
                matchs.append({
                    'animal': AnimalSerializer(animal).data,
                    'score': result['score'],
                    'confidence': result['confidence'],
                    'is_compatible': result['is_compatible']
                })
            
            # Trie par score et prend top 5
            matchs_sorted = sorted(matchs, key=lambda x: x['score'], reverse=True)[:5]
            
            for idx, match in enumerate(matchs_sorted, 1):
                match['rank'] = idx
            
            return Response({
                'success': True,
                'profil': ProfilAdoptantSerializer(profil).data,
                'matchs': matchs_sorted,
                'total_animaux': len(animaux),
                'message': f'{len(matchs_sorted)} matchs trouvés'
            })
        
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Erreur : {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PredictView(APIView):
    """
    Endpoint pour prédire la compatibilité adoptant-animal unique.
    
    POST /api/predict/
    Authentification : REQUIS (ADOPTANT)
    {
        "profil_adoptant_id": 1,
        "animal_id": 1
    }
    """
    permission_classes = [IsAdoptant]
    
    def post(self, request):
        try:
            profil_id = request.data.get('profil_adoptant_id')
            animal_id = request.data.get('animal_id')
            
            # Validation
            if not profil_id or not animal_id:
                return Response(
                    {'error': 'profil_adoptant_id et animal_id sont requis'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                profil = ProfilAdoptant.objects.get(id=profil_id)
                animal = Animal.objects.get(id=animal_id)
            except (ProfilAdoptant.DoesNotExist, Animal.DoesNotExist):
                return Response(
                    {'error': 'Profil ou animal introuvable'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Essaie modèle ML
            result = predict_compatibility_ml(profil, animal)
            if result is None:
                # Fallback sur règles
                result = predict_compatibility_rules(profil, animal)
            
            return Response({
                'success': True,
                'score': result['score'],
                'is_compatible': result['is_compatible'],
                'confidence': result['confidence'],
                'compatibility_percentage': result['confidence'] * 100 if result['confidence'] else None,
                'profil': ProfilAdoptantSerializer(profil).data,
                'animal': AnimalSerializer(animal).data,
                'model_type': result['model_type']
            })
        
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Erreur : {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TerritoireViewSet(viewsets.ModelViewSet):
    """CRUD pour les territoires avec leurs scores de bien-être (public)"""
    queryset = Territoire.objects.all()
    serializer_class = TerritoireSerializer
    permission_classes = [AllowAny]

class AnimalViewSet(viewsets.ModelViewSet):
    """CRUD pour les animaux adoptables en refuge (public)"""
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [AllowAny]

class RefugeViewSet(viewsets.ModelViewSet):
    """CRUD pour les refuges et associations (public)"""
    queryset = Refuge.objects.all()
    serializer_class = RefugeSerializer
    permission_classes = [AllowAny]

class ProfilAdoptantViewSet(viewsets.ModelViewSet):
    """Gestion des profils adoptants (private)"""
    queryset = ProfilAdoptant.objects.all()
    serializer_class = ProfilAdoptantSerializer
    permission_classes = [IsAdoptant]

class AnimalSignaledViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Gestion des signalements d'animaux trouvés/abandonnés
    Les observateurs peuvent uniquement consulter les signalements.
    """
    queryset = AnimalSignaled.objects.all()
    serializer_class = AnimalSignaledSerializer
    permission_classes = [IsObservateur]


class WellbeingView(APIView):
    """
    endpoint pour récupérer le score bien-être d'un territoire.
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        zip_code = request.query_params.get('zip_code')
        ville = request.query_params.get('ville')
        
        if not zip_code and not ville:
            return Response({
                'error': 'Fournir zip_code ou ville'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            if zip_code:
                territoire = Territoire.objects.get(zip_code=zip_code)
            else:
                territoire = Territoire.objects.get(ville__iexact=ville)
            
            return Response({
                'success': True,
                'zip_code': territoire.zip_code,
                'ville': territoire.ville,
                'latitude': territoire.latitude,
                'longitude': territoire.longitude,
                'well_being_score': territoire.well_being_score,
                'risk_index': territoire.risk_index,
                'score_factors': territoire.score_factors,
                'osm_details': territoire.osm_details
            }, status=status.HTTP_200_OK)
        
        except Territoire.DoesNotExist:
            return Response({
                'error': 'Territoire non trouvé'
            }, status=status.HTTP_404_NOT_FOUND)


class SignalementView(APIView):
    """
    endpoint pour gérer les signalements anonymes d'animaux
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        queryset = AnimalSignaled.objects.all().order_by('-created_at')
        
        # Filtres
        status_filter = request.query_params.get('status', 'SIGNALED')
        species_filter = request.query_params.get('species')
        ville_filter = request.query_params.get('ville')
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if species_filter:
            queryset = queryset.filter(species=species_filter)
        if ville_filter:
            queryset = queryset.filter(territoire__ville__iexact=ville_filter)
        
        serializer = AnimalSignaledSerializer(queryset, many=True)
        return Response({
            'success': True,
            'total': queryset.count(),
            'filters': {
                'status': status_filter,
                'species': species_filter,
                'ville': ville_filter
            },
            'signalements': serializer.data
        }, status=status.HTTP_200_OK)
    
    def post(self, request):
        try:
            ville = request.data.get('ville')
            territoire = None
            
            if ville:
                territoire, _ = Territoire.objects.get_or_create(
                    ville__iexact=ville,
                    defaults={
                        'zip_code': '00000',
                        'department_code': '00',
                        'ville': ville
                    }
                )
            
            signalement = AnimalSignaled.objects.create(
                species=request.data.get('species'),
                race=request.data.get('race', ''),
                description=request.data.get('description'),
                type_signalement=request.data.get('type_signalement'),
                adresse_approximative=request.data.get('adresse_approximative', ''),
                territoire=territoire,
                status='SIGNALED'
            )
            
            return Response({
                'success': True,
                'message': 'Signalement créé avec succès',
                'id': signalement.id,
                'signalement': AnimalSignaledSerializer(signalement).data
            }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class ObservatoireView(APIView):
    permission_classes = [IsObservateur]
    
    def get(self, request):
        """Récupère les stats du dashboard observatoire"""
        user_profile = UserProfile.objects.get(user=request.user)
        
        # Récupère tous les signalements
        signalements = AnimalSignaled.objects.all()
        
        # Stats par status
        stats_by_status = {
            'SIGNALED': signalements.filter(status='SIGNALED').count(),
            'RESCUED': signalements.filter(status='RESCUED').count(),
            'ADOPTABLE': signalements.filter(status='ADOPTABLE').count(),
        }
        
        # Stats par espèce
        stats_by_species = {
            'DOG': signalements.filter(species='DOG').count(),
            'CAT': signalements.filter(species='CAT').count(),
            'OTHER': signalements.filter(species='OTHER').count(),
        }
        
        # Stats par type de signalement
        stats_by_type = {
            'FOUND': signalements.filter(type_signalement='FOUND').count(),
            'ABANDON': signalements.filter(type_signalement='ABANDON').count(),
        }
        
        # Heatmap data : signalements par territoire
        heatmap_data = []
        for territoire in Territoire.objects.filter(signalements__isnull=False).distinct():
            count = signalements.filter(territoire=territoire).count()
            heatmap_data.append({
                'zip_code': territoire.zip_code,
                'ville': territoire.ville,
                'count': count,
                'well_being_score': territoire.well_being_score,
                'risk_index': territoire.risk_index,
                'services': territoire.osm_details
            })
        
        # Trie par nombre de signalements (desc)
        heatmap_data.sort(key=lambda x: x['count'], reverse=True)
        
        # Derniers signalements (pour timeline)
        derniers = AnimalSignaledSerializer(
            signalements.order_by('-created_at')[:10],
            many=True
        ).data
        
        return Response({
            'success': True,
            'user': {
                'username': request.user.username,
                'type': user_profile.user_type
            },
            'stats': {
                'total_signalements': signalements.count(),
                'par_status': stats_by_status,
                'par_espece': stats_by_species,
                'par_type': stats_by_type,
            },
            'heatmap_data': heatmap_data,
            'derniers_signalements': derniers
        }, status=status.HTTP_200_OK)
