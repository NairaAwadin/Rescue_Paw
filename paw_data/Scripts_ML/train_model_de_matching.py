import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (accuracy_score, precision_score, recall_score, 
                             f1_score, roc_auc_score, confusion_matrix)
from joblib import dump
from preparation_donnees_ML import (load_training_data, prepare_features_and_target, 
                      split_train_test)

def train_random_forest(X_train, y_train, X_test, y_test, feature_names):
    """
    Entraîne un modèle Random Forest.
    
    Args:
        X_train, y_train: Données d'entraînement
        X_test, y_test: Données de test
        feature_names: Noms des features (pour feature importance)
    
    Retourne:
        model: Random Forest entraîné
        metrics: Dict avec les métriques de performance
    """
    print("\n" + "="*60)
    print("ENTRAÎNEMENT: RANDOM FOREST")
    print("="*60)
    
    # Crée et entraîne le modèle
    model = RandomForestClassifier(
    n_estimators=150,        # Plus d'arbres (pas 200, trop)
    max_depth=15,            # Intermédiaire (10→15 graduellement)
    min_samples_split=5,     # Pareil qu'avant
    min_samples_leaf=2,      # Pareil qu'avant
    max_features='sqrt',     # Réduit overfitting
    random_state=42,
    n_jobs=-1
)
    
    model.fit(X_train, y_train)
    print("✓ Modèle Random Forest entraîné")
    
    # Prédictions
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    # Métriques
    metrics = {
        'accuracy': accuracy_score(y_test, y_pred),
        'precision': precision_score(y_test, y_pred),
        'recall': recall_score(y_test, y_pred),
        'f1': f1_score(y_test, y_pred),
        'roc_auc': roc_auc_score(y_test, y_pred_proba)
    }
    
    print("\nMétriques Random Forest:")
    for name, value in metrics.items():
        print(f"  {name:12s}: {value:.4f}")
    
    # Confusion matrix
    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = cm.ravel()
    
    print(f"\nMatrice de confusion:")
    print(f"  Vrais Négatifs (TN):  {tn}")
    print(f"  Faux Positifs (FP):   {fp}")
    print(f"  Faux Négatifs (FN):   {fn}")
    print(f"  Vrais Positifs (TP):  {tp}")
    
    # Feature importance
    importances = model.feature_importances_
    feature_importance = dict(zip(feature_names, importances))
    top_features = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)[:5]
    print(f"\nTop 5 features les plus importantes:")
    for feat, imp in top_features:
        print(f"  {feat:30s}: {imp:.4f}")
    
    return model, metrics

def save_model(model):
    """
    Sauvegarde le modèle entraîné en .joblib.
    """
    from pathlib import Path
    
    print("\n" + "="*60)
    print("SAUVEGARDE DU MODÈLE")
    print("="*60)
    
    filepath = Path(__file__).parent.parent / "models" / "matching_model.joblib"
    dump(model, filepath)
    print(f"✓ Modèle sauvegardé: {filepath}")
      
def main():
    """
    Pipeline complet d'entraînement ML.
    
    Étapes:
    1. Charge les données
    2. Prépare features et target
    3. Split train/test
    4. Entraîne Random Forest
    5. Sauvegarde le modèle
    """
    print("="*60)
    print("PIPELINE D'ENTRAÎNEMENT ML - RESCUE PAW")
    print("="*60)
    
    # Charge les données
    df = load_training_data()
    
    # Prépare features et target
    X, y, feature_names = prepare_features_and_target(df)
    
    # Split train/test
    X_train, X_test, y_train, y_test = split_train_test(X, y)
    
    # Entraîne Random Forest
    model, metrics = train_random_forest(X_train, y_train, X_test, y_test, feature_names)
    
    # Sauvegarde le modèle
    save_model(model)
    
    print("\n" + "="*60)
    print("ENTRAÎNEMENT TERMINÉ ✓")
    print("="*60)

if __name__ == "__main__":
    main()