import pandas as pd
import numpy as np
from pathlib import Path
import random
import requests
from PIL import Image
from io import BytesIO

def download_and_save_image(url, filename, folder='animals'):
    """Télécharge et sauvegarde une image"""
    try:
        media_path = Path(__file__).parent.parent / 'paw_backend' / 'media' / folder
        media_path.mkdir(parents=True, exist_ok=True)
        
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            img = Image.open(BytesIO(response.content))
            filepath = media_path / f'{filename}.jpg'
            img.save(filepath, 'JPEG')
            return f'{folder}/{filename}.jpg'
    except:
        return None
    return None

def generer_datasets_adoptants_animaux():
    """Génère 35 adoptants et 50 animaux avec images"""
    
    # Charge les races
    animaux_vecteurs = pd.read_csv('donnees_propres/animaux_vecteurs_clean.csv')
    races_chiens = animaux_vecteurs[animaux_vecteurs['species'] == 'dog']['breed'].unique()
    races_chats = animaux_vecteurs[animaux_vecteurs['species'] == 'cat']['breed'].unique()
    
    # Charge communes IDF
    villes = pd.read_csv('donnees_propres/villes_france_clean.csv')
    
    # === ADOPTANTS ===
    adoptants = []
    for i in range(35):
        adoptants.append({
            'id_adoptant': i,
            'type_habitat': random.choice(['APT', 'HOUSE', 'FARM']),
            'has_garden': random.choice([0, 1]),
            'niv_activite': random.randint(1, 3),
            'has_children': random.choice([0, 1]),
            'has_pets': random.choice([0, 1]),
            'has_birds': random.choice([0, 1]),
            'has_rodents': random.choice([0, 1]),
            'has_cats': random.choice([0, 1]),
            'has_dogs': random.choice([0, 1]),
            'temps_dispo': random.randint(1, 8),
            'niv_experience': random.randint(1, 3),
            'code_postal': random.choice(villes['code_postal'].values),
            'note_bien_etre': random.choice(['A', 'B', 'C', 'D', 'E']),
        })
    
    df_adoptants = pd.DataFrame(adoptants)
    df_adoptants.to_csv('donnees_propres/adoptants.csv', index=False)
    print(f"✓ {len(df_adoptants)} adoptants générés")
    
    # === ANIMAUX ===
    animaux = []
    photo_list = []
    
    # 40 chiens
    print("Téléchargement images chiens...")
    for i in range(40):
        try:
            response = requests.get('https://dog.ceo/api/breeds/image/random')
            if response.status_code == 200:
                img_url = response.json()['message']
                filename = download_and_save_image(img_url, f'dog_{i}')
                photo_list.append(filename)
        except:
            photo_list.append(None)
        
        animaux.append({
            'id_animal': i,
            'name': f'Dog_{i}',
            'species': 'dog',
            'race': random.choice(races_chiens),
            'age': random.randint(1, 12),
            'age_category': random.choice(['puppy', 'adult', 'senior']),
            'taille': random.choice(['S', 'M', 'L']),
            'energy_need': random.randint(1, 10),
            'social_compatibility': random.choice([0, 1]),
            'kid_friendly': random.choice([0, 1]),
            'needs_garden': random.choice([0, 1]),
        })
    
    # 10 chats
    print("Téléchargement images chats...")
    for i in range(10):
        try:
            response = requests.get('https://api.thecatapi.com/v1/images/search')
            if response.status_code == 200:
                img_url = response.json()[0]['url']
                filename = download_and_save_image(img_url, f'cat_{i}')
                photo_list.append(filename)
        except:
            photo_list.append(None)
        
        animaux.append({
            'id_animal': 40 + i,
            'name': f'Cat_{i}',
            'species': 'cat',
            'race': random.choice(races_chats),
            'age': random.randint(1, 12),
            'age_category': random.choice(['puppy', 'adult', 'senior']),
            'taille': random.choice(['S', 'M']),
            'energy_need': random.randint(1, 8),
            'social_compatibility': random.choice([0, 1]),
            'kid_friendly': random.choice([0, 1]),
            'needs_garden': 0,
        })
    
    df_animaux = pd.DataFrame(animaux)
    df_animaux['photo'] = photo_list
    df_animaux.to_csv('donnees_propres/animaux.csv', index=False)
    print(f"✓ {len(df_animaux)} animaux générés avec images")

if __name__ == '__main__':
    generer_datasets_adoptants_animaux()