# paw_data/generer_donnees_matching.py
import pandas as pd
import numpy as np
from pathlib import Path

# Configuration
np.random.seed(42)
DATA_DIR = Path(__file__).parent / "donnees_propres"
OUTPUT_FILE = DATA_DIR / "training_matching.csv"

# ============================================================================
# MAPPING DES LABELS (Alignes avec Django models)
# ============================================================================

def map_taille(taille_text):
    """Convertit taille textuelle → code Django (S/M/L)"""
    mapping = {
        'Small': 'S',
        'Toy': 'S',
        'Medium': 'M',
        'Large': 'L',
        'XLarge': 'L'
    }
    return mapping.get(taille_text, 'M')

# ============================================================================
# CHARGER LES DONNÉES
# ============================================================================

print("📊 Chargement des données...")

# Animaux
animaux_df = pd.read_csv(DATA_DIR / "animaux_vecteurs_clean.csv")
print(f"  ✓ Animaux: {len(animaux_df)} races")

# Communes - filtrer IDF seulement
villes_df = pd.read_csv(DATA_DIR / "villes_france_clean.csv")

def extraire_dept(code_insee_str):
    code = str(code_insee_str).strip()
    if code[:2].isdigit():
        return int(code[:2])
    return None

villes_df['dept'] = villes_df['code_commune_INSEE'].apply(extraire_dept)
idf_departements = [75, 77, 78, 91, 92, 93, 94, 95]
villes_idf_df = villes_df[villes_df['dept'].isin(idf_departements)].copy()
print(f"  ✓ Communes IDF: {len(villes_idf_df)} communes")

# Bien-être territorial
bien_etre_df = pd.read_csv(DATA_DIR / "villes_scored_final.csv")
print(f"  ✓ Bien-être: {len(bien_etre_df)} communes notées")

# ============================================================================
# GÉNÉRER 2500 PROFILS ADOPTANTS
# ============================================================================

print("\n👥 Génération de 2500 profils adoptants...")

adoptants = []
for i in range(2500):
    type_habitat = np.random.choice(['APT', 'HOUSE', 'FARM'])
    has_garden = type_habitat in ['HOUSE', 'FARM'] and np.random.random() > 0.3
    niv_activite = np.random.randint(1, 4)
    has_children = np.random.choice([True, False], p=[0.4, 0.6])
    has_pets = np.random.choice([True, False], p=[0.3, 0.7])
    temps_dispo = np.random.randint(1, 6)
    niv_experience = np.random.randint(1, 4)
    
    commune_row = villes_idf_df.sample(1).iloc[0]
    code_postal = str(commune_row['code_postal']).zfill(5)
    code_insee = str(commune_row['code_commune_INSEE']).zfill(5)
    
    bien_etre_row = bien_etre_df[bien_etre_df['code_postal'] == code_postal]
    if len(bien_etre_row) > 0:
        note_bien_etre = bien_etre_row.iloc[0]['note_bien_etre']
    else:
        note_bien_etre = 'C'
    
    has_birds = has_pets and np.random.random() > 0.7
    has_rodents = has_pets and np.random.random() > 0.7
    has_cats = has_pets and np.random.random() > 0.5
    has_dogs = has_pets and np.random.random() > 0.5
    
    adoptants.append({
        'id_adoptant': i,
        'type_habitat': type_habitat,
        'has_garden': has_garden,
        'niv_activite': niv_activite,
        'has_children': has_children,
        'has_pets': has_pets,
        'temps_dispo': temps_dispo,
        'niv_experience': niv_experience,
        'code_postal': code_postal,
        'code_commune_insee': code_insee,
        'note_bien_etre': note_bien_etre,
        'has_birds': has_birds,
        'has_rodents': has_rodents,
        'has_cats': has_cats,
        'has_dogs': has_dogs,
    })

adoptants_df = pd.DataFrame(adoptants)
print(f"  ✓ {len(adoptants_df)} profils générés")

# ============================================================================
# GÉNÉRER PROFILS ANIMAUX AVEC ÂGE SYNTHÉTIQUE
# ============================================================================

print("\n🐾 Génération de profils animaux...")

animaux_enrichis = []
for idx, row in animaux_df.iterrows():
    age = np.random.randint(1, 13)
    
    if age < 2:
        age_category = 'puppy'
    elif age < 8:
        age_category = 'adult'
    else:
        age_category = 'senior'
    
    energy_level = row.get('energy_level_value', 0.5)
    energy_need = max(1, int(energy_level * 10))
    
    demeanor = row.get('demeanor_value', 0.5)
    trainability = row.get('trainability_value', 0.5)
    social_compatibility = demeanor >= 0.5
    kid_friendly = demeanor >= 0.4
    needs_garden = energy_need >= 7 and row.get('species') == 'dog'
    
    animaux_enrichis.append({
        'id_animal': idx,
        'age': age,
        'age_category': age_category,
        'species': row['species'],
        'race': row.get('breed', 'Unknown'),
        'taille': row.get('size', 'Medium'),
        'taille_categorie': row.get('size_category', 'Medium'),
        'energy_need': energy_need,
        'energy_level_value': energy_level,
        'social_compatibility': social_compatibility,
        'kid_friendly': kid_friendly,
        'needs_garden': needs_garden,
        'demeanor_value': demeanor,
        'trainability_value': trainability,
        'grooming_frequency_value': row.get('grooming_frequency_value', 0.5),
    })

animaux_enrichis_df = pd.DataFrame(animaux_enrichis)
print(f"  ✓ {len(animaux_enrichis_df)} animaux générés")

# ============================================================================
# FONCTIONS DE SCORING
# ============================================================================

def calculate_energy_score(adoptant_niv_activite, animal_energy_level_value):
    """Score affinité énergie (0-10)"""
    adoptant_energy = (adoptant_niv_activite - 1) / 2.0
    difference = abs(adoptant_energy - animal_energy_level_value)
    score = 10 * (1 - difference)
    return max(0, min(10, score))

def calculate_trainability_score(adoptant_niv_experience, animal_trainability_value):
    """Score affinité entraînabilité (0-10)"""
    adoptant_experience = (adoptant_niv_experience - 1) / 2.0
    difference = abs(adoptant_experience - animal_trainability_value)
    score = 10 * (1 - difference)
    return max(0, min(10, score))

def calculate_age_size_habitat_score(adoptant, animal):
    """Score composite âge+taille+habitat (0-10)"""
    score = 5.0
    
    if animal['age_category'] == 'puppy':
        if adoptant['niv_experience'] == 1 and adoptant['temps_dispo'] < 3:
            score -= 3.0
        elif adoptant['niv_experience'] >= 2 and adoptant['temps_dispo'] >= 3:
            score += 2.0
    
    if animal['taille_categorie'] in ['Large', 'XLarge']:
        if adoptant['type_habitat'] == 'APT' and not adoptant['has_garden']:
            score -= 3.0
        elif adoptant['type_habitat'] == 'FARM' or (adoptant['type_habitat'] == 'HOUSE' and adoptant['has_garden']):
            score += 1.5
    
    if animal['taille_categorie'] in ['Small', 'Toy']:
        if adoptant['type_habitat'] == 'APT':
            score += 1.0
    
    if adoptant['temps_dispo'] >= 4:
        if animal['energy_need'] >= 8:
            score += 1.5
    elif adoptant['temps_dispo'] <= 2:
        if animal['energy_need'] >= 8:
            score -= 2.0
    
    return max(0, min(10, score))

def calculate_wellbeing_territory_score(adoptant_note_bien_etre, animal_energy_need):
    """Score bien-être territorial (0-10)"""
    wellbeing_map = {'A': 5, 'B': 4, 'C': 3, 'D': 2, 'E': 1}
    wellbeing_val = wellbeing_map.get(adoptant_note_bien_etre, 3)
    
    if animal_energy_need >= 8:
        if wellbeing_val >= 4:
            score = 8.0
        elif wellbeing_val == 3:
            score = 6.0
        else:
            score = 3.0
    else:
        score = 5.0 + wellbeing_val * 0.5
    
    return max(0, min(10, score))

def calculate_kids_demeanor_score(adoptant_has_children, animal_demeanor_value):
    """Score enfants/tempérament (0-10)"""
    if not adoptant_has_children:
        return 5.0
    
    if animal_demeanor_value >= 0.6:
        score = 8.0 + (animal_demeanor_value - 0.6) * 5
    elif animal_demeanor_value >= 0.4:
        score = 5.0
    else:
        score = 2.0
    
    return max(0, min(10, score))

def calculate_sociability_other_pets_score(adoptant_has_pets, animal_social_compatibility):
    """Score sociabilité autres animaux (0-10)"""
    if not adoptant_has_pets:
        return 5.0
    
    if animal_social_compatibility:
        return 8.0
    else:
        return 3.0

def evaluer_match(adoptant, animal):
    """
    Évalue le match avec HARD CONSTRAINTS + SOFT SCORES
    
    Retourne: (est_match, match_score)
    """
    
    # === HARD CONSTRAINTS ===
    if animal['species'] == 'cat':
        if adoptant.get('has_birds') or adoptant.get('has_rodents'):
            return 0, 0
        return 1, 8.0
    
    if animal['species'] == 'dog':
        # Apt + large + sans jardin + très énergique
        if adoptant['type_habitat'] == 'APT' and not adoptant['has_garden']:
            if animal['taille_categorie'] in ['Large', 'XLarge'] and animal['energy_level_value'] >= 0.7:
                return 0, 2
        
        # Peu de temps + très énergique
        if adoptant['temps_dispo'] <= 2 and animal['energy_level_value'] >= 0.75:
            return 0, 1
        
        # Commune D/E + très énergique
        note_bien_etre = adoptant.get('note_bien_etre', 'C')
        if note_bien_etre in ['D', 'E']:
            if animal['energy_level_value'] >= 0.75:
                return 0, 2
    
    # === SOFT SCORES ===
    if animal['species'] == 'dog':
        score_energy = calculate_energy_score(adoptant['niv_activite'], animal['energy_level_value'])
        score_trainability = calculate_trainability_score(adoptant['niv_experience'], animal['trainability_value'])
        score_age_size_habitat = calculate_age_size_habitat_score(adoptant, animal)
        score_wellbeing = calculate_wellbeing_territory_score(adoptant['note_bien_etre'], animal['energy_need'])
        score_kids = calculate_kids_demeanor_score(adoptant['has_children'], animal['demeanor_value'])
        score_sociability = calculate_sociability_other_pets_score(adoptant['has_pets'], animal['social_compatibility'])
        
        match_score = (
            score_energy * 0.25 +
            score_trainability * 0.20 +
            score_age_size_habitat * 0.20 +
            score_wellbeing * 0.10 +
            score_kids * 0.15 +
            score_sociability * 0.10
        )
        
        if match_score < 3.5:
            return 0, match_score
        
        return 1, match_score
    
    return 1, 5.0

# ============================================================================
# GÉNÉRER 5000 PAIRES AVEC SCORES - BOUCLE JUSQU'À > 40% NON-MATCHES
# ============================================================================

print("\n🔗 Génération de 5000 paires matching (cible: >40% non-matches)...")

non_match_ratio = 0
attempt = 1

while non_match_ratio < 0.20:
    print(f"\n  Tentative {attempt}...")
    
    matchings = []
    id_matching = 0
    
    for adoptant_idx, adoptant in adoptants_df.iterrows():
        for _ in range(2):
            animal_idx = np.random.randint(0, len(animaux_enrichis_df))
            animal = animaux_enrichis_df.iloc[animal_idx]
            
            est_match, match_score = evaluer_match(adoptant.to_dict(), animal.to_dict())
            
            # Conversion aux labels Django
            species_code = animal['species'].upper()
            taille_code = map_taille(animal['taille_categorie'])
            
            matching = {
                'id_matching': id_matching,
                'id_adoptant': int(adoptant['id_adoptant']),
                'id_animal': int(animal['id_animal']),
                'est_match': est_match,
                'match_score': round(match_score, 2),
                'type_habitat': adoptant['type_habitat'],
                'has_garden': int(adoptant['has_garden']),
                'niv_activite': int(adoptant['niv_activite']),
                'has_children': int(adoptant['has_children']),
                'has_pets': int(adoptant['has_pets']),
                'has_birds': int(adoptant['has_birds']),
                'has_rodents': int(adoptant['has_rodents']),
                'has_cats': int(adoptant['has_cats']),
                'has_dogs': int(adoptant['has_dogs']),
                'temps_dispo': int(adoptant['temps_dispo']),
                'niv_experience': int(adoptant['niv_experience']),
                'code_postal': adoptant['code_postal'],
                'note_bien_etre': adoptant['note_bien_etre'],
                'age': int(animal['age']),
                'age_category': animal['age_category'],
                'species': species_code,
                'race': animal['race'],
                'taille': taille_code,
                'energy_need': int(animal['energy_need']),
                'social_compatibility': int(animal['social_compatibility']),
                'kid_friendly': int(animal['kid_friendly']),
                'needs_garden': int(animal['needs_garden']),
            }
            matchings.append(matching)
            id_matching += 1
    
    matchings_df = pd.DataFrame(matchings)
    non_match_ratio = (1 - matchings_df['est_match'].mean())
    
    print(f"    ✓ {len(matchings_df)} paires | {100*non_match_ratio:.1f}% non-matches")
    
    if non_match_ratio < 0.40:
        print(f"    ✗ Ratio trop bas ({100*non_match_ratio:.1f}% < 40%) - Nouvelle tentative...")
        attempt += 1
    else:
        print(f"    ✅ Ratio OK! ({100*non_match_ratio:.1f}% >= 40%)")
# ============================================================================
# STATISTIQUES
# ============================================================================

print(f"\n📈 Statistiques finales:")
print(f"  - Total paires: {len(matchings_df)}")
print(f"  - Matches: {matchings_df['est_match'].sum()} ({100*matchings_df['est_match'].mean():.1f}%)")
print(f"  - Non-matches: {(1-matchings_df['est_match']).sum()} ({100*(1-matchings_df['est_match']).mean():.1f}%)")

print(f"\n📊 Distribution des scores (match_score):")
print(matchings_df['match_score'].describe())

print(f"\n🐕 Distribution espèce:")
print(matchings_df.groupby('species')['est_match'].agg(['count', 'sum']))

print(f"\n🏠 Distribution habitat:")
print(matchings_df.groupby('type_habitat')['est_match'].agg(['count', 'sum']))

# ============================================================================
# SAUVEGARDE
# ============================================================================

matchings_df.to_csv(OUTPUT_FILE, index=False)
print(f"\n✅ Dataset sauvegardé: {OUTPUT_FILE}")
print(f"   Shape: {matchings_df.shape}")
print(f"   Colonnes: {', '.join(matchings_df.columns.tolist())}")