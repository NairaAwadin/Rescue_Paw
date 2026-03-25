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
    """Convertit taille textuelle → code Django"""
    mapping = {
        'Small': 'S',
        'Medium': 'M',
        'Large': 'L',
        'XLarge': 'L'
    }
    return mapping.get(taille_text, 'M')

HABITAT_LABELS = {'APT': 'Appartement', 'HOUSE': 'Maison', 'FARM': 'Ferme'}
SPECIES_LABELS = {'DOG': 'Chien', 'CAT': 'Chat'}
TAILLE_LABELS = {'S': 'Petit', 'M': 'Moyen', 'L': 'Grand'}

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
# GÉNÉRER 500 PROFILS ADOPTANTS
# ============================================================================

print("\n👥 Génération de 500 profils adoptants...")

adoptants = []
for i in range(500):
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
    
    a_oiseaux = has_pets and np.random.random() > 0.7
    a_rongeurs = has_pets and np.random.random() > 0.7
    a_chats = has_pets and np.random.random() > 0.5
    a_chiens = has_pets and np.random.random() > 0.5
    
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
        'a_oiseaux': a_oiseaux,
        'a_rongeurs': a_rongeurs,
        'a_chats': a_chats,
        'a_chiens': a_chiens,
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
        'trainability_value': row.get('trainability_value', 0.5),
        'grooming_frequency_value': row.get('grooming_frequency_value', 0.5),
    })

animaux_enrichis_df = pd.DataFrame(animaux_enrichis)
print(f"  ✓ {len(animaux_enrichis_df)} animaux générés")

# ============================================================================
# FONCTION DE MATCHING AVEC 8 CONTRAINTES (RESSERRÉES)
# ============================================================================

def evaluer_match(adoptant, animal):
    """Évalue match - CONTRAINTES ÉQUILIBRÉES"""
    
    if animal['species'] == 'cat':
        if adoptant.get('a_oiseaux') or adoptant.get('a_rongeurs'):
            return 0
        return 1
    
    if animal['species'] == 'dog':
        # CONTRAINTE 1: Petit apt SANS jardin + grand chien énergique
        if adoptant['type_habitat'] == 'APT' and not adoptant['has_garden']:
            if animal['taille_categorie'] in ['Large', 'XLarge'] and animal['energy_level_value'] >= 0.7:
                return 0
        
        # CONTRAINTE 2: Peu de temps + chien très énergique
        if adoptant['temps_dispo'] <= 2 and animal['energy_level_value'] >= 0.75:  # ← relâché à 0.75
            return 0
        
        # CONTRAINTE 3: Débutant + chien difficile
        if adoptant['niv_experience'] == 1:
            if animal['trainability_value'] < 0.45:  # ← 0.45 au lieu de 0.5
                return 0
        
        # CONTRAINTE 4: Commune D/E + chien très actif
        note_bien_etre = adoptant.get('note_bien_etre', 'C')
        if note_bien_etre in ['D', 'E']:  # ← enlever C, garder D/E seulement
            if animal['energy_level_value'] >= 0.75:  # ← relâché à 0.75
                return 0
        
        # CONTRAINTE 5: Enfants + chien agressif
        if adoptant['has_children']:
            if animal['demeanor_value'] < 0.45:  # ← 0.45
                return 0
        
        # CONTRAINTE 6: Autres animaux + chien réservé
        if adoptant['has_pets']:
            if animal['demeanor_value'] < 0.4:  # ← revenir à 0.4
                return 0
        
        # CONTRAINTE 7: Chiot + débutant + peu de temps
        if animal['age_category'] == 'puppy':
            if adoptant['niv_experience'] == 1 and adoptant['temps_dispo'] < 3:
                return 0
        
        # CONTRAINTE 8: Niv activité faible + chien très énergique
        if adoptant['niv_activite'] == 1:
            if animal['energy_level_value'] >= 0.8:  # ← très élevé pour être rare
                return 0
    
    return 1
    
    # CONTRAINTE 1: Chat + oiseaux/rongeurs
    if animal['species'] == 'cat':
        if adoptant.get('a_oiseaux') or adoptant.get('a_rongeurs'):
            return 0
        return 1
    
    if animal['species'] == 'dog':
        # CONTRAINTE 2: Petit apt SANS jardin + chien énergique (PLUS STRICT)
        if adoptant['type_habitat'] == 'APT' and not adoptant['has_garden']:
            if animal['energy_level_value'] >= 0.5:  # ← était 0.6, maintenant 0.5
                return 0
        
        # CONTRAINTE 3: Peu de temps + chien énergique (PLUS STRICT)
        if adoptant['temps_dispo'] <= 2 and animal['energy_level_value'] >= 0.6:  # ← était 0.7
            return 0
        
        # CONTRAINTE 4: Débutant + chien difficile (PLUS STRICT)
        if adoptant['niv_experience'] == 1:
            if animal['trainability_value'] < 0.5:  # ← était 0.4
                return 0
        
        # CONTRAINTE 5: Commune C/D/E + chien actif (PLUS STRICT - ajout C!)
        note_bien_etre = adoptant.get('note_bien_etre', 'C')
        if note_bien_etre in ['C', 'D', 'E']:  # ← était D/E, maintenant + C
            if animal['energy_level_value'] >= 0.6:  # ← était 0.7
                return 0
        
        # CONTRAINTE 6: Enfants + chien agressif
        if adoptant['has_children']:
            if animal['demeanor_value'] < 0.5:  # ← était 0.4
                return 0
        
        # CONTRAINTE 7: Autres animaux + chien réservé
        if adoptant['has_pets']:
            if animal['demeanor_value'] < 0.5:  # ← était 0.3
                return 0
        
        # CONTRAINTE 8: Petit apt SANS jardin + chien Large/XLarge (NOUVELLE)
        if adoptant['type_habitat'] == 'APT' and not adoptant['has_garden']:
            if animal['taille_categorie'] in ['Large', 'XLarge']:
                return 0
        
        # CONTRAINTE 9: Niv activité faible + chien très énergique (NOUVELLE)
        if adoptant['niv_activite'] == 1:  # Sédentaire
            if animal['energy_level_value'] >= 0.6:
                return 0
    
    return 1
# ============================================================================
# GÉNÉRER 1000 PAIRES EN BOUCLE JUSQU'À 45%+ NON-MATCHES
# ============================================================================

print("\n🔗 Génération de paires matching (cible: >45% non-matches)...")

non_match_ratio = 0
attempt = 1

while non_match_ratio < 0.45:
    print(f"\n  Tentative {attempt}...")
    
    matchings = []
    for adoptant_idx, adoptant in adoptants_df.iterrows():
        for _ in range(2):
            animal_idx = np.random.randint(0, len(animaux_enrichis_df))
            animal = animaux_enrichis_df.iloc[animal_idx]
            
            est_match = evaluer_match(adoptant.to_dict(), animal.to_dict())
            
            # Conversion aux labels Django
            species_code = animal['species'].upper()  # 'dog' → 'DOG'
            taille_code = map_taille(animal['taille_categorie'])  # 'Medium' → 'M'
            
            matching = {
                'id_matching': len(matchings),
                'id_adoptant': adoptant['id_adoptant'],
                'id_animal': animal['id_animal'],
                'est_match': est_match,
                # Adoptant fields (avec labels)
                'type_habitat': adoptant['type_habitat'],
                'type_habitat_label': HABITAT_LABELS[adoptant['type_habitat']],
                'has_garden': adoptant['has_garden'],
                'niv_activite': adoptant['niv_activite'],
                'has_children': adoptant['has_children'],
                'has_pets': adoptant['has_pets'],
                'temps_dispo': adoptant['temps_dispo'],
                'niv_experience': adoptant['niv_experience'],
                'code_postal': adoptant['code_postal'],
                'note_bien_etre': adoptant['note_bien_etre'],
                # Animal fields (avec labels + codes Django)
                'age': animal['age'],
                'age_category': animal['age_category'],
                'species': species_code,
                'species_label': SPECIES_LABELS[species_code],
                'race': animal['race'],
                'taille': taille_code,
                'taille_label': TAILLE_LABELS[taille_code],
                'energy_need': animal['energy_need'],
                'social_compatibility': animal['social_compatibility'],
                'kid_friendly': animal['kid_friendly'],
                'needs_garden': animal['needs_garden'],
            }
            matchings.append(matching)
    
    matchings_df = pd.DataFrame(matchings)
    non_match_ratio = (1 - matchings_df['est_match'].mean())
    
    print(f"    ✓ {len(matchings_df)} paires | {100*non_match_ratio:.1f}% non-matches")
    
    if non_match_ratio < 0.45:
        print(f"    ✗ Ratio trop bas ({100*non_match_ratio:.1f}% < 45%) - Nouvelle tentative...")
        attempt += 1
    else:
        print(f"    ✅ Ratio OK! ({100*non_match_ratio:.1f}% >= 45%)")

# ============================================================================
# STATISTIQUES
# ============================================================================

print(f"\n📈 Statistiques finales (après {attempt} tentative(s)):")
print(f"  - Total paires: {len(matchings_df)}")
print(f"  - Matches: {matchings_df['est_match'].sum()} ({100*matchings_df['est_match'].mean():.1f}%)")
print(f"  - Non-matches: {(1-matchings_df['est_match']).sum()} ({100*(1-matchings_df['est_match']).mean():.1f}%)")

print(f"\n🐕 Distribution espèce:")
print(matchings_df.groupby('species')['est_match'].agg(['count', 'sum']))

print(f"\n🏠 Distribution habitat:")
print(matchings_df.groupby('type_habitat')['est_match'].agg(['count', 'sum']))

# ============================================================================
# SAUVEGARDE (SANS les colonnes _label pour le modèle)
# ============================================================================

# Supprimer les colonnes de labels avant sauvegarde
output_df = matchings_df.drop(columns=['type_habitat_label', 'species_label', 'taille_label'])

output_df.to_csv(OUTPUT_FILE, index=False)
print(f"\n✅ Dataset sauvegardé: {OUTPUT_FILE}")
print(f"   Shape: {output_df.shape}")
print(f"   Colonnes: {', '.join(output_df.columns.tolist())}")