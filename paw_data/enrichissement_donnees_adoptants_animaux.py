import pandas as pd
import numpy as np

def generer_datasets_adoptants_animaux():
    """
    Génère deux datasets pour tests de matching:
    - adoptants.csv (35 adoptants)
    - animaux.csv (50 animaux)
    """
    
    print("="*60)
    print("GÉNÉRATION DES DATASETS ADOPTANTS & ANIMAUX")
    print("="*60)
    
    print("\n📂 Chargement des données sources...")
    
    # Charge les races et villes
    df_races = pd.read_csv('donnees_propres/animaux_vecteurs_clean.csv')
    df_villes = pd.read_csv('donnees_propres/villes_france_clean.csv')
    
    depts_idf = ['Paris', 'Seine-et-Marne', 'Yvelines', 'Essonne', 'Hauts-de-Seine', 
                 'Seine-Saint-Denis', 'Val-de-Marne', "Val-d'Oise"]
    df_villes_idf = df_villes[df_villes['nom_departement'].isin(depts_idf)].reset_index(drop=True)
    
    print(f"   - {len(df_races)} races | {len(df_villes_idf)} communes IDF")
    
    # ============================================
    # GÉNÈRE 35 ADOPTANTS
    # ============================================
    print("\n👥 Génération de 35 adoptants...")
    
    np.random.seed(42)
    
    adoptants = []
    for i in range(35):
        type_habitat = np.random.choice(['APT', 'HOUSE', 'FARM'], p=[0.4, 0.45, 0.15])
        has_garden = 1 if type_habitat in ['HOUSE', 'FARM'] and np.random.random() > 0.3 else 0
        has_pets = np.random.choice([0, 1], p=[0.7, 0.3])
        
        adoptants.append({
            'id_adoptant': i,
            'type_habitat': type_habitat,
            'has_garden': has_garden,
            'niv_activite': np.random.randint(1, 4),
            'has_children': np.random.choice([0, 1], p=[0.6, 0.4]),
            'has_pets': has_pets,
            'has_birds': np.random.choice([0, 1], p=[0.85, 0.15]) if has_pets else 0,
            'has_rodents': np.random.choice([0, 1], p=[0.85, 0.15]) if has_pets else 0,
            'has_cats': np.random.choice([0, 1], p=[0.75, 0.25]) if has_pets else 0,
            'has_dogs': np.random.choice([0, 1], p=[0.65, 0.35]) if has_pets else 0,
            'temps_dispo': np.random.choice([1, 2, 3, 4, 5]),
            'niv_experience': np.random.randint(1, 4),
            'code_postal': df_villes_idf.sample(1).iloc[0]['code_postal'],
            'note_bien_etre': np.random.choice(['A', 'B', 'C', 'D', 'E'])
        })
    
    df_adoptants = pd.DataFrame(adoptants)
    df_adoptants.to_csv('donnees_propres/adoptants.csv', index=False)
    print(f"   ✓ {len(df_adoptants)} adoptants (IDs 0-{len(df_adoptants)-1})")
    
    # ============================================
    # GÉNÈRE 50 ANIMAUX
    # ============================================
    print("\n🐾 Génération de 50 animaux...")
    
    df_dogs = df_races[df_races['species'] == 'dog'].reset_index(drop=True)
    df_cats = df_races[df_races['species'] == 'cat'].reset_index(drop=True)
    
    animaux = []
    for i in range(50):
        if i < 40:
            race_row = df_dogs.sample(1).iloc[0]
            species = 'DOG'
        else:
            race_row = df_cats.sample(1).iloc[0]
            species = 'CAT'
        
        age = np.random.randint(1, 13)
        taille_val = str(race_row.get('taille_categorie', 'Small')).lower()
        taille = 'L' if 'large' in taille_val else 'M' if 'medium' in taille_val else 'S'
        energy_need = np.random.randint(2, 11)
        
        animaux.append({
            'id_animal': i,
            'age': age,
            'age_category': 'puppy' if age < 2 else 'senior' if age > 8 else 'adult',
            'species': species,
            'race': race_row['breed'],
            'taille': taille,
            'energy_need': energy_need,
            'social_compatibility': int(np.random.choice([0, 1], p=[0.3, 0.7])),
            'kid_friendly': int(np.random.choice([0, 1], p=[0.2, 0.8])),
            'needs_garden': 1 if species == 'DOG' and energy_need > 6 else int(np.random.choice([0, 1], p=[0.7, 0.3]))
        })
    
    df_animaux = pd.DataFrame(animaux)
    df_animaux.to_csv('donnees_propres/animaux.csv', index=False)
    print(f"   ✓ {len(df_animaux)} animaux (IDs 0-{len(df_animaux)-1})")
    
    # ============================================
    # RÉSUMÉ
    # ============================================
    print("\n" + "="*60)
    print(f"✅ adoptants.csv : {len(df_adoptants)} adoptants")
    print(f"✅ animaux.csv : {len(df_animaux)} animaux ({(df_animaux['species'] == 'DOG').sum()} chiens, {(df_animaux['species'] == 'CAT').sum()} chats)")
    print("="*60)

if __name__ == "__main__":
    generer_datasets_adoptants_animaux()