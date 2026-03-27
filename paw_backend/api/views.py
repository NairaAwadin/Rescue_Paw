"""
    Paw Rescue - Views (Semaine 1)
    Logique de traitement des requêtes API.
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
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Territoire, Animal, Refuge, ProfilAdoptant, AnimalSignaled
from .serializers import TerritoireSerializer, AnimalSerializer, RefugeSerializer, ProfilAdoptantSerializer, AnimalSignaledSerializer

class TerritoireViewSet(viewsets.ModelViewSet):
    """CRUD pour les territoires avec leurs scores de bien-être"""
    queryset = Territoire.objects.all()
    serializer_class = TerritoireSerializer

class AnimalViewSet(viewsets.ModelViewSet):
    """CRUD pour les animaux adoptables en refuge"""
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer

class RefugeViewSet(viewsets.ModelViewSet):
    """CRUD pour les refuges et associations"""
    queryset = Refuge.objects.all()
    serializer_class = RefugeSerializer

class ProfilAdoptantViewSet(viewsets.ModelViewSet):
    """Gestion des profils adoptants avec données habitat + quiz"""
    queryset = ProfilAdoptant.objects.all()
    serializer_class = ProfilAdoptantSerializer

class AnimalSignaledViewSet(viewsets.ModelViewSet):
    """Gestion des signalements d'animaux trouvés/abandonnés"""
    queryset = AnimalSignaled.objects.all()
    serializer_class = AnimalSignaledSerializer


class PredictView(APIView):
    """
    Endpoint pour prédire la compatibilité entre un profil adoptant et un animal.
    Utilise le modèle ML entraîné dans paw_data/models/
    
    POST /api/predict/
    {
        "profil_adoptant_id": 1,
        "animal_id": 1
    }
    
    Retourne:
        - score: Prédiction du modèle (0 ou 1)
        - confidence: Probabilité (0-1)
        - compatibility_percentage: Score en %
        - profil: Détails du profil adoptant
        - animal: Détails de l'animal
    """
    
    # colonnes attendues par le modèle (ref : training_matching.csv)
    FEATURE_COLUMNS = [
        'type_habitat', 'has_garden', 'niv_activite', 'has_children', 'has_pets',
        'has_birds', 'has_rodents', 'has_cats', 'has_dogs', 'temps_dispo',
        'niv_experience', 'note_bien_etre', 'age', 'age_category', 'species',
        'race', 'taille', 'energy_need', 'social_compatibility', 'kid_friendly',
        'needs_garden'
    ]
    
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
            
            # Charger le modèle ML depuis paw_data/models/
            model_path = os.path.join(
                os.path.dirname(__file__), 
                '..', '..', 'paw_data', 'models', 'matching_model.joblib'
            )
            
            if not os.path.exists(model_path):
                return self._rule_based_prediction(profil, animal)
            
            # Préparer les données en DataFrame
            data_dict = self._prepare_dataframe(profil, animal)
            df = pd.DataFrame([data_dict])
            
            # Supprimer les colonnes ID et match_score qui ne sont pas utilisées par le modèle
            colonnes_a_supprimer = ['code_postal', 'id_adoptant', 'id_animal', 'match_score']
            df = df.drop(columns=colonnes_a_supprimer, errors='ignore')
            
            # One-hot encode les colonnes catégorielles
            categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
            if categorical_cols:
                df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)
            
            # Charger et faire la prédiction
            model = joblib.load(model_path)
            
            # Prédiction
            prediction = model.predict(df)[0]
            confidence = model.predict_proba(df)[0][1] if hasattr(model, 'predict_proba') else None
            
            return Response({
                'success': True,
                'score': int(prediction),
                'is_compatible': bool(prediction == 1),
                'confidence': float(confidence) if confidence is not None else None,
                'compatibility_percentage': float(confidence * 100) if confidence is not None else None,
                'profil': ProfilAdoptantSerializer(profil).data,
                'animal': AnimalSerializer(animal).data,
                'message': 'Prédiction effectuée avec le modèle ML',
                'model_type': 'random_forest'
            })
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Erreur lors de la prédiction : {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _prepare_dataframe(self, profil, animal):
        """
        Prépare un dictionnaire avec les données du profil et animal dans le format attendu par le modèle ML.
        """
        # Récupérer le territoire du profil pour note_bien_etre
        territoire = None
        try:
            territoire = Territoire.objects.get(zip_code=profil.zip_code)
        except Territoire.DoesNotExist:
            pass
        
        data = {
            # Données adoptant
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
            'code_postal': profil.zip_code,
            
            # Données animal
            'age': animal.age,
            'age_category': animal.age_category,
            'species': animal.species,
            'race': animal.race,
            'taille': animal.taille,
            'energy_need': animal.energy_need,
            'social_compatibility': int(animal.social_compatibility),
            'kid_friendly': int(animal.kid_friendly),
            'needs_garden': int(animal.needs_garden),
            
            # IDs (supprimées après)
            'id_adoptant': profil.id,
            'id_animal': animal.id,
        }
        
        return data
    
    def _rule_based_prediction(self, profil, animal):
        score = 50  # Score de base
        
        # Hard constraints
        if profil.has_children and not animal.kid_friendly:
            score -= 30
        
        if profil.has_pets and not animal.social_compatibility:
            score -= 20
        
        if animal.needs_garden and not profil.has_garden:
            score -= 15
        
        # Soft constraints (affinité)
        if profil.niv_activite == animal.energy_need:
            score += 15
        elif abs(profil.niv_activite - animal.energy_need) <= 1:
            score += 10
        
        # Type d'habitat
        if profil.type_habitat == 'HOUSE':
            score += 5
        elif profil.type_habitat == 'FARM' and animal.species == 'DOG':
            score += 10
        
        # Expérience
        if profil.niv_experience >= 2:
            score += 5
        
        # Temps disponible
        if profil.temps_dispo >= 4 and animal.energy_need >= 3:
            score += 10
        
        # Clamp score entre 0 et 100
        score = max(0, min(100, score))
        compatibility = 1 if score >= 50 else 0
        
        return Response({
            'success': True,
            'score': compatibility,
            'is_compatible': bool(compatibility == 1),
            'confidence': None,
            'compatibility_percentage': score,
            'profil': ProfilAdoptantSerializer(profil).data,
            'animal': AnimalSerializer(animal).data,
            'message': 'Prédiction effectuée avec des règles (modèle ML non disponible)',
            'model_type': 'rule_based'
        })
