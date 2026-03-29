import pandas as pd
from joblib import load
from pathlib import Path
from .models import ProfilAdoptant, Animal, Territoire

def load_matching_model():
    model_path = Path(__file__).parent.parent.parent / "paw_data" / "models" / "matching_model.joblib"
    return load(model_path)

def get_features_for_prediction(adoptant_id, animal_id):
    adoptant = ProfilAdoptant.objects.get(id=adoptant_id)
    animal = Animal.objects.get(id=animal_id)
    
    try:
        territoire = Territoire.objects.get(zip_code=adoptant.zip_code)
        note_bien_etre = territoire.well_being_score
    except Territoire.DoesNotExist:
        note_bien_etre = 'C'
    
    return {
        'type_habitat': adoptant.type_habitat,
        'has_garden': int(adoptant.has_garden),
        'niv_activite': adoptant.niv_activite,
        'has_children': int(adoptant.has_children),
        'has_pets': int(adoptant.has_pets),
        'has_birds': int(adoptant.has_birds),
        'has_rodents': int(adoptant.has_rodents),
        'has_cats': int(adoptant.has_cats),
        'has_dogs': int(adoptant.has_dogs),
        'temps_dispo': adoptant.temps_dispo,
        'niv_experience': adoptant.niv_experience,
        'code_postal': adoptant.zip_code,
        'note_bien_etre': note_bien_etre,
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

def prepare_features_for_model(features_dict):
    df = pd.DataFrame([features_dict])
    colonnes_id = ['id_matching', 'id_adoptant', 'id_animal', 'match_score', 'est_match']
    df = df.drop(columns=colonnes_id, errors='ignore')
    
    categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
    if categorical_cols:
        df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)
    
    return df

def predict_match(adoptant_id, animal_id):
    model = load_matching_model()
    features = get_features_for_prediction(adoptant_id, animal_id)
    X = prepare_features_for_model(features)
    
    prediction = model.predict(X)[0]
    probabilities = model.predict_proba(X)[0]
    confidence = max(probabilities)
    
    return {
        'is_match': bool(prediction),
        'prediction': int(prediction),
        'confidence': float(confidence),
        'probabilities': {
            'no_match': float(probabilities[0]),
            'match': float(probabilities[1])
        }
    }