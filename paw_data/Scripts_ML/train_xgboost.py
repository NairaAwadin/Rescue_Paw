import numpy as np
from xgboost import XGBClassifier
from sklearn.metrics import (accuracy_score, precision_score, recall_score, 
                             f1_score, roc_auc_score, confusion_matrix)
from joblib import dump
from preparation_donnees_ML import (load_training_data, prepare_features_and_target, 
                      split_train_test)

def train_xgboost(X_train, y_train, X_test, y_test, feature_names):
    """
    Entraîne un modèle XGBoost.
    
    Args:
        X_train, y_train: Données d'entraînement
        X_test, y_test: Données de test
        feature_names: Noms des features
    
    Retourne:
        model: XGBoost entraîné
        metrics: Dict avec les métriques de performance
    """
    print("\n" + "="*60)
    print("ENTRAÎNEMENT: XGBOOST")
    print("="*60)
    
    # Crée et entraîne le modèle
    model = XGBClassifier(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    print("✓ Modèle XGBoost entraîné")
    
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
    
    print("\nMétriques XGBoost:")
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
    
    Fichier généré:
    - ../models/matching_model_xgb.joblib
    
    Args:
        model: Modèle XGBoost entraîné
    """
    print("\n" + "="*60)
    print("SAUVEGARDE DU MODÈLE")
    print("="*60)
    
    dump(model, '../models/matching_model_xgb.joblib')
    print("✓ Modèle XGBoost sauvegardé: ../models/matching_model_xgb.joblib")

def main():
    """
    Pipeline complet d'entraînement XGBoost.
    
    Étapes:
    1. Charge les données
    2. Prépare features et target
    3. Split train/test
    4. Entraîne XGBoost
    5. Sauvegarde le modèle
    """
    print("="*60)
    print("PIPELINE D'ENTRAÎNEMENT XGBOOST - RESCUE PAW")
    print("="*60)
    
    # Charge les données
    df = load_training_data()
    
    # Prépare features et target
    X, y, feature_names, encoders = prepare_features_and_target(df)
    
    # Split train/test
    X_train, X_test, y_train, y_test = split_train_test(X, y)
    
    # Entraîne XGBoost
    model, metrics = train_xgboost(X_train, y_train, X_test, y_test, feature_names)
    
    # Sauvegarde le modèle
    save_model(model)
    
    print("\n" + "="*60)
    print("ENTRAÎNEMENT XGBOOST TERMINÉ ✓")
    print("="*60)

if __name__ == "__main__":
    main()