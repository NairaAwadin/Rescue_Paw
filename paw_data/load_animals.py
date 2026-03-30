#!/usr/bin/env python
"""
Script pour charger les animaux depuis animaux.csv dans la base de données Django
"""

import os
import sys
import django
import csv
from pathlib import Path

# Ajouter le chemin du projet au sys.path
project_root = Path(__file__).parent.parent / 'paw_backend'
sys.path.insert(0, str(project_root))

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Animal, Refuge

def load_animals():
    """Charge les animaux depuis le CSV"""
    
    # Créer un refuge par défaut si n'existe pas
    refuge, created = Refuge.objects.get_or_create(
        name='Refuge Principal',
        defaults={
            'email': 'contact@refuge-paw.fr',
            'address': '123 rue du Refuge',
            'city': 'Paris',
            'latitude': 48.8566,
            'longitude': 2.3522,
        }
    )
    
    if created:
        print(f"✓ Refuge créé: {refuge.name}")
    else:
        print(f"✓ Refuge existant: {refuge.name}")
    
    # Chemin du CSV
    csv_path = Path(__file__).parent / 'donnees_propres' / 'animaux.csv'
    
    if not csv_path.exists():
        print(f"⚠ Fichier non trouvé: {csv_path}")
        return
    
    # Lire le CSV
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        count = 0
        
        for row in reader:
            try:
                # Mapper les données du CSV aux champs du modèle
                species = 'DOG' if row['species'].lower() == 'dog' else 'CAT'
                
                # Créer ou mettre à jour l'animal
                animal, created = Animal.objects.update_or_create(
                    name=row['name'],
                    defaults={
                        'refuge': refuge,
                        'species': species,
                        'race': row['race'],
                        'age': int(row['age']),
                        'age_category': row['age_category'],
                        'taille': row['taille'],
                        'energy_need': int(row['energy_need']),
                        'social_compatibility': row['social_compatibility'].lower() == '1',
                        'kid_friendly': row['kid_friendly'].lower() == '1',
                        'needs_garden': row['needs_garden'].lower() == '1',
                        'description': f"{row['race']} de {row['age']} ans",
                        'is_adoptable': True,
                        'photo': row['photo'],  # Chemin relatif
                    }
                )
                
                if created:
                    count += 1
                
            except Exception as e:
                print(f"✗ Erreur ligne {row.get('name', 'inconnu')}: {e}")
                continue
        
        print(f"\n✓ {count} animaux chargés avec succès!")

if __name__ == '__main__':
    print("🐾 Chargement des animaux depuis animaux.csv...\n")
    load_animals()
    print("\n✓ Terminé!")
