"""
    Projet PFE - Paw Rescue
    Module : API - Modèles de données
    Description :
        Définition de la structure de données
        - Territoire : Data INSEE/OSM & Scoring IA (Risque/Bien-être).
        - ProfilAdoptant : Données habitat & quiz matching (Vecteurs IA).
        - Refuge : Gestion des établissements et localisation.
        - Animal : Profils comportementaux pour recommandation hybride.
    version : 1.0 - semaine 1
"""

from django.db import models
from django.contrib.auth.models import User

class Territoire(models.Model):
    # Identifiant unique géographique
    zip_code = models.CharField("Code Postal", max_length=5, unique=True)
    department_code = models.CharField("Département", max_length=3, db_index=True) # Utile pour la Heatmap
    ville = models.CharField("Nom de la Ville", max_length=100)

    # Données "Froides" INSEE (Features pour l'IA pour le model de risque - rempli par alex via script)
    income_level = models.FloatField("Revenu Médian", default=0.0)
    unemployment_rate = models.FloatField("Taux de Chômage", default=0.0)
    sec_home_ratio = models.FloatField("Ratio Résidences Secondaires", default=0.0) # Pour la saisonnalité

    # Données OSM (Détails pour le Score Bien-être)
    # On stocke les comptes pour que le Front puisse les afficher
    osm_details = models.JSONField("Détails Services (Vétos, Parcs)", default=dict)
    # Exemple stocké : {"vets": 5, "parks": 3, "groomers": 2}

    #Résultats de l'IA (Prédits ou Calculés)
    # 1. Indice de Risque d'Abandon (0 à 100) - Prédit par XGBoost/RandomForest
    risk_index = models.FloatField("Indice de Risque", default=0.0)

    # 2. Score de Bien-être (A, B, C, D ou E) - Calculé par un algo simple
    well_being_score = models.CharField("Note Bien-être", max_length=1, default='C')

    # 3. Interpréteur (Les causes du score) - Pour le Dashboard Admin
    score_factors = models.JSONField("Facteurs explicatifs", default=list)
    # Exemple : ["Forte saisonnalité", "Forte densité de parcs", "Peu de vétérinaires"]

    def __str__(self):
        return f"{self.ville} ({self.zip_code}) - Score: {self.well_being_score}"

class ProfilAdoptant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profil')

    # Données "Froides" (Habitat)
    zip_code = models.CharField(max_length=5)
    type_habitat = models.CharField(max_length=20, choices=[('APT', 'Appartement'), ('HOUSE', 'Maison')])
    has_garden = models.BooleanField(default=False)

    # Données "Chaudes" (Le Quiz - pour la Similarité Cosinus)
    # On stocke ces valeurs pour le calcul de distance avec le profil de l'animal
    niv_activite = models.IntegerField("Niveau d'activité (1-10)", default=5)
    has_children = models.BooleanField("Présence d'enfants", default=False)
    has_pets = models.BooleanField("Autres animaux", default=False)
    temps_dispo = models.IntegerField("Temps disponible (heures/jour)", default=2)
    niv_experience = models.IntegerField("Expérience (1-3)", default=1) # Débutant à Expert

    def __str__(self):
        return f"Profil de {self.user.username}"

class Refuge(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    # Localisation précise (masquée au public ?)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.name

class Animal(models.Model):
    refuge = models.ForeignKey(Refuge, on_delete=models.CASCADE, related_name='animaux')
    name = models.CharField(max_length=100)
    species = models.CharField(max_length=50, choices=[('DOG', 'Chien'), ('CAT', 'Chat')])
    race = models.CharField(max_length=100, blank=True)

    # Caractéristiques pour le matching IA (Hard Constraints & Affinity)
    age = models.IntegerField()
    taille = models.CharField(max_length=10, choices=[('S', 'Petit'), ('M', 'Moyen'), ('L', 'Grand')])
    energy_need = models.IntegerField(default=5) # Match avec activity_level de l'adoptant
    social_compatibility = models.BooleanField(default=True) # Match avec has_other_pets
    kid_friendly = models.BooleanField(default=True) # Match avec has_children
    needs_garden = models.BooleanField(default=False)

    description = models.TextField()
    is_adoptable = models.BooleanField(default=True)
    photo = models.ImageField(upload_to='animals/', null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.species})"
