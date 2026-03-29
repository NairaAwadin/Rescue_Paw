from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import ProfilAdoptant, Animal, Refuge
import pandas as pd
import os

class Command(BaseCommand):
    help = 'Charge les données de test (adoptants et animaux) dans la BDD'

    def handle(self, *args, **options):
        self.stdout.write("Chargement des données de test...")
        
        # Chemins vers les CSVs
        base_dir = os.path.join(os.path.dirname(__file__), '../../../../paw_data/donnees_propres')
        
        # Load adoptants
        df_adoptants = pd.read_csv(os.path.join(base_dir, 'adoptants.csv'))
        for _, row in df_adoptants.iterrows():
            user, created = User.objects.get_or_create(
                username=f"adoptant_{int(row['id_adoptant'])}",
                defaults={'email': f"adoptant_{int(row['id_adoptant'])}@rescue-paw.local"}
            )
            ProfilAdoptant.objects.get_or_create(
                user=user,
                defaults={
                    'zip_code': str(row['code_postal']),
                    'type_habitat': row['type_habitat'],
                    'has_garden': bool(row['has_garden']),
                    'niv_activite': int(row['niv_activite']),
                    'has_children': bool(row['has_children']),
                    'has_pets': bool(row['has_pets']),
                    'has_birds': bool(row['has_birds']),
                    'has_rodents': bool(row['has_rodents']),
                    'has_cats': bool(row['has_cats']),
                    'has_dogs': bool(row['has_dogs']),
                    'temps_dispo': int(row['temps_dispo']),
                    'niv_experience': int(row['niv_experience']),
                }
            )
        self.stdout.write(f"✓ {len(df_adoptants)} adoptants chargés")
        
        # Load animaux
        refuge, _ = Refuge.objects.get_or_create(
            name='Refuge Test',
            defaults={
                'email': 'test@refuge.local',
                'address': '123 Rue Test',
                'city': 'Paris',
                'latitude': 48.856,
                'longitude': 2.292
            }
        )
        
        df_animaux = pd.read_csv(os.path.join(base_dir, 'animaux.csv'))
        for _, row in df_animaux.iterrows():
            Animal.objects.get_or_create(
                name=f"{row['race'][:20]}_{int(row['id_animal'])}",
                refuge=refuge,
                defaults={
                    'species': row['species'],
                    'race': str(row['race'])[:100],
                    'age': int(row['age']),
                    'age_category': row['age_category'],
                    'taille': row['taille'],
                    'energy_need': int(row['energy_need']),
                    'social_compatibility': bool(row['social_compatibility']),
                    'kid_friendly': bool(row['kid_friendly']),
                    'needs_garden': bool(row['needs_garden']),
                    'photo': str(row['photo']) if pd.notna(row['photo']) else '',
                    'description': f"Animal de test - {row['race']}",
                    'is_adoptable': True,
                }
            )
        self.stdout.write(f"✓ {len(df_animaux)} animaux chargés")
        self.stdout.write(self.style.SUCCESS("✅ Données de test chargées avec succès!"))