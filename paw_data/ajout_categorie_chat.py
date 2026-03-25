import pandas as pd

def add_cat_profiles():
    """
    Ajoute des profils de races de chats synthétiques au dataset des races animales.
    
    Génère 5 profils de chats génériques avec des niveaux d'énergie variés:
    - Chat Énergique (Énergie haute: 0.7)
    - Chat Calme (Énergie basse: 0.3)
    - Chat Très Actif (Énergie très haute: 0.9)
    - Chat Tranquille (Énergie très basse: 0.2)
    - Chat Actif (Énergie moyenne: 0.6)
    
    Tous les profils liés aux tailles Small/Medium typiques des chats domestiques.
    Concatène avec les profils de chiens existants et génère un dataset combiné.
    """
    print("Ajout des profils de races de chats au dataset...")
    
    # Définit 5 profils synthétiques de chats avec des caractéristiques variées
    cat_profiles = pd.DataFrame({
        'breed': [
            'Chat Énergique', 
            'Chat Calme', 
            'Chat Très Actif',
            'Chat Tranquille', 
            'Chat Actif'
        ],
        'energy_level_value': [0.7, 0.3, 0.9, 0.2, 0.6],
        'trainability_value': [0.6, 0.4, 0.7, 0.3, 0.5],
        'demeanor_value': [0.7, 0.5, 0.8, 0.4, 0.6],
        'mean_weight': [4.0, 3.0, 4.5, 2.5, 3.8],
        'taille_categorie': ['Small', 'Small', 'Medium', 'Small', 'Small'],
        'species': ['cat'] * 5
    })
    
    # Charge les profils existants de races de chiens
    df_dogs = pd.read_csv('donnees_propres/animaux_vecteurs_clean.csv')
    df_dogs['species'] = 'dog'
    
    # Combine les profils de chiens et de chats
    df_all = pd.concat([df_dogs, cat_profiles], ignore_index=True)
    df_all.to_csv('donnees_propres/animaux_vecteurs_clean.csv', index=False)
    
    total_dogs = len(df_dogs)
    total_cats = len(cat_profiles)
    total_breeds = len(df_all)
    
    print(f"Dataset mis à jour avec succès avec les profils combinés:")
    print(f"   - Chiens: {total_dogs}")
    print(f"   - Chats: {total_cats}")
    print(f"   - Total: {total_breeds} races prêtes pour l'entraînement ML")

if __name__ == '__main__':
    add_cat_profiles()