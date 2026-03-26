import numpy as np
from sklearn.metrics import (accuracy_score, precision_score, recall_score, 
                             f1_score, roc_auc_score, confusion_matrix)
from joblib import load
from pathlib import Path
from preparation_donnees_ML import load_training_data, prepare_features_and_target, split_train_test

def load_models():
    """
    Charge les modèles Random Forest et XGBoost entraînés.
    
    Retourne:
        model_rf: Random Forest entraîné
        model_xgb: XGBoost entraîné
    """
    base_dir = Path(__file__).parent.parent / "models"
    model_rf_path = base_dir / "matching_model.joblib"
    
    model_rf = load(model_rf_path)
    print(f"✓ Modèle Random Forest chargé: {model_rf_path}")
    
    # model_xgb = load(model_xgb_path)
    # print(f"✓ Modèle XGBoost chargé: {model_xgb_path}")
    
    return model_rf

def evaluate_model(model, X_test, y_test, model_name):
    """
    Évalue un modèle sur les données de test.
    """
    print("\n" + "="*60)
    print(f"ÉVALUATION: {model_name}")
    print("="*60)
    
    # Prédictions
    predictions = model.predict(X_test)
    probabilities = model.predict_proba(X_test)[:, 1]
    
    # Métriques
    metrics = {
        'accuracy': accuracy_score(y_test, predictions),
        'precision': precision_score(y_test, predictions),
        'recall': recall_score(y_test, predictions),
        'f1': f1_score(y_test, predictions),
        'roc_auc': roc_auc_score(y_test, probabilities)
    }
    
    print(f"\nMétriques {model_name}:")
    for metric_name, value in metrics.items():
        print(f"  {metric_name:12s}: {value:.4f}")
    
    # Confusion matrix
    cm = confusion_matrix(y_test, predictions)
    tn, fp, fn, tp = cm.ravel()
    
    print(f"\nMatrice de confusion:")
    print(f"  Vrais Négatifs (TN):  {tn}")
    print(f"  Faux Positifs (FP):   {fp}")
    print(f"  Faux Négatifs (FN):   {fn}")
    print(f"  Vrais Positifs (TP):  {tp}")
    
    # Analyse détaillée
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0
    sensitivity = tp / (tp + fn) if (tp + fn) > 0 else 0
    
    print(f"\nAnalyse détaillée:")
    print(f"  Spécificité (vrais négatifs): {specificity:.4f}")
    print(f"  Sensibilité (vrais positifs): {sensitivity:.4f}")
    
    return predictions, probabilities, metrics

def analyze_predictions(predictions, probabilities, y_test, model_name):
    """
    Analyse les prédictions du modèle.
    """
    print(f"\n{'='*60}")
    print(f"ANALYSE DES PRÉDICTIONS - {model_name}")
    print(f"{'='*60}")
    
    # Distribution des prédictions
    n_matches = (predictions == 1).sum()
    n_non_matches = (predictions == 0).sum()
    
    print(f"\nDistribution prédictions:")
    print(f"  Matches prédits:     {n_matches} ({100*n_matches/len(predictions):.1f}%)")
    print(f"  Non-matches prédits: {n_non_matches} ({100*n_non_matches/len(predictions):.1f}%)")
    
    # Confiance moyenne
    high_confidence = (probabilities > 0.8).sum()
    low_confidence = (probabilities < 0.6).sum()
    
    print(f"\nNiveaux de confiance:")
    print(f"  Haute confiance (>0.8):  {high_confidence} prédictions ({100*high_confidence/len(probabilities):.1f}%)")
    print(f"  Basse confiance (<0.6):  {low_confidence} prédictions ({100*low_confidence/len(probabilities):.1f}%)")
    print(f"  Confiance moyenne:       {probabilities.mean():.4f}")

def main():
    """
    Pipeline complet de test et évaluation du modèle Random Forest.
    """
    print("="*60)
    print("PIPELINE DE TEST ML - RESCUE PAW")
    print("="*60)
    
    # Charge les modèles
    model_rf = load_models()
    
    # Charge et prépare les données
    df = load_training_data()
    X, y, feature_names = prepare_features_and_target(df)
    X_train, X_test, y_train, y_test = split_train_test(X, y)
    
    # Évalue Random Forest
    pred_rf, proba_rf, metrics_rf = evaluate_model(model_rf, X_test, y_test, "RANDOM FOREST")
    
    # Analyse des prédictions
    analyze_predictions(pred_rf, proba_rf, y_test, "RANDOM FOREST")
    
    print("\n" + "="*60)
    print("TEST TERMINÉ ✓")
    print("="*60)

if __name__ == "__main__":
    main()