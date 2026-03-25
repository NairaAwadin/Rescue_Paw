import pandas as pd
import os


def get_size_category(weight):
    """
    Catégorise la taille du chien selon son poids moyen.
    
    Args:
        weight: Poids moyen en kg (ou lbs selon la source des données)
    
    Retourne:
        str: 'Small' (<10), 'Medium' (10-25), 'Large' (>25), ou 'Unknown' si manquant
    """
    if pd.isna(weight):
        return 'Unknown'
    elif weight < 10:
        return 'Small'
    elif weight <= 25:
        return 'Medium'
    else:
        return 'Large'


def clean_breed_data():
    """
    Nettoie la base de données des races AKC pour le matching d'adoption Rescue Paw.
    
    Pipeline:
    1. Charge les données brutes des races AKC (akc-data-latest.csv)
    2. Calcule le poids moyen à partir de la plage min/max
    3. Dérive la catégorie de taille (Small/Medium/Large)
    4. Normalise les scores d'énergie et d'éducabilité
    5. Génère un dataset propre pour l'entraînement du modèle ML
    """
    print("Démarrage du pipeline de nettoyage des données de races...")

    # Étape 1: Charge les données sources
    chemin_entree = 'donnees_brutes/akc-data-latest.csv'
    
    if not os.path.exists(chemin_entree):
        print(f"Erreur: Fichier source non trouvé à {chemin_entree}")
        print("Vérifiez le nom du fichier dans le répertoire donnees_brutes.")
        return

    df = pd.read_csv(chemin_entree)
    print(f"Chargé: {df.shape[0]} enregistrements de races")

    # Étape 2: Nettoie et normalise les données de tempérament
    print("Normalisation des descriptions de tempérament...")
    df['temperament'] = df['temperament'].fillna('').str.lower()

    # Étape 3: Calcule les poids moyens et les catégories de taille
    print("Calcul des poids moyens et des catégories de taille...")
    df['mean_weight'] = (df['min_weight'] + df['max_weight']) / 2
    df['taille_categorie'] = df['mean_weight'].apply(get_size_category)

    # Étape 4: Remplit les scores manquants avec des valeurs neutres par défaut
    print("Normalisation des scores d'énergie et d'éducabilité...")
    # Utilise 0.5 comme valeur neutre par défaut pour éviter les erreurs du modèle
    df['energy_level_value'] = df['energy_level_value'].fillna(0.5)
    df['trainability_value'] = df['trainability_value'].fillna(0.5)

    # Étape 5: Sauvegarde la sortie nettoyée
    chemin_sortie = 'donnees_propres/animaux_vecteurs_clean.csv'
    os.makedirs('donnees_propres', exist_ok=True)
    
    df.to_csv(chemin_sortie, index=False)
    print(f"Sauvegardé avec succès: {chemin_sortie}")
    print(f"Total d'enregistrements: {len(df)} races prêtes pour le pipeline ML")

if __name__ == "__main__":
    clean_breed_data()