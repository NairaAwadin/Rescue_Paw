import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from pathlib import Path

def load_training_data(filepath=None):
    """
    Charge le dataset d'entraînement depuis CSV.
    
    Args:
        filepath: Chemin vers le fichier CSV du dataset (remplacé par défaut)
    
    Retourne:
        DataFrame chargé avec les données d'entraînement
    """
    if filepath is None:
        # Chemin absolu depuis ce script
        base_dir = Path(__file__).parent.parent / "donnees_propres"
        filepath = base_dir / "training_matching.csv"
    
    df = pd.read_csv(filepath)
    print(f"Dataset chargé: {df.shape[0]} paires, {df.shape[1]} colonnes")
    return df

def prepare_features_and_target(df):
    """
    Prépare les features (X) et la cible (y) pour le ML.
    
    Processus:
    1. Supprime les colonnes d'ID et match_score (non-prédictives)
    2. Encode les variables catégorielles
    3. Extrait la cible 'est_match'
    
    Args:
        df: DataFrame avec toutes les colonnes (incluant est_match)
    
    Retourne:
        X: Features (DataFrame)
        y: Target (Series)
        feature_names: Noms des features
    """
    df_clean = df.copy()
    
    # Colonnes à supprimer (IDs + match_score pour éviter data leakage)
    colonnes_id = ['id_matching', 'id_adoptant', 'id_animal', 'code_postal', 'match_score']
    df_clean = df_clean.drop(columns=colonnes_id, errors='ignore')
    
    # Extrait la cible
    y = df_clean['est_match']
    X = df_clean.drop(columns=['est_match'])
    
    # One-hot encode les colonnes catégorielles
    categorical_cols = X.select_dtypes(include=['object']).columns.tolist()
    if categorical_cols:
        X = pd.get_dummies(X, columns=categorical_cols, drop_first=True)
    
    feature_names = X.columns.tolist()
    
    print(f"Features préparées: {X.shape[1]} features")
    print(f"  - {(y == 1).sum()} matches, {(y == 0).sum()} non-matches")
    
    return X, y, feature_names

def split_train_test(X, y, test_size=0.2, random_state=42):
    """
    Split train/test avec stratification.
    
    Args:
        X: Features
        y: Cible
        test_size: Proportion du test set
        random_state: Graine pour reproducibilité
    
    Retourne:
        X_train, X_test, y_train, y_test
    """
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    print(f"Train/Test split:")
    print(f"  - Train: {X_train.shape[0]} paires")
    print(f"  - Test: {X_test.shape[0]} paires")
    
    return X_train, X_test, y_train, y_test