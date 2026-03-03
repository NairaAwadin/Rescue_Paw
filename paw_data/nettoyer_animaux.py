import pandas as pd
import os

# ==========================================
# 🛠️ 1. FONCTIONS OUTILS
# ==========================================
def get_size_category(weight):
    """Catégorise le chien selon son poids moyen."""
    if pd.isna(weight): # Si le poids est inconnu (NaN)
        return 'Unknown'
    elif weight < 10:   # Moins de 10 (kg ou lbs, à toi de voir tes données)
        return 'Small'
    elif weight <= 25:
        return 'Medium'
    else:
        return 'Large'

# ==========================================
# 🚀 2. SCRIPT PRINCIPAL
# ==========================================
def main():
    print("🐶 Lancement du nettoyage des données Rescue Paw...")

    # --- ÉTAPE A : CHARGEMENT ---
    # ⚠️ ATTENTION : Remplace 'ton_fichier.csv' par le vrai nom de ton fichier brut !
    chemin_entree = 'donnees_brutes/akc-data-latest.csv'
    
    if not os.path.exists(chemin_entree):
        print(f"❌ Erreur : Je ne trouve pas le fichier {chemin_entree}.")
        print("Vérifie le nom du fichier dans le dossier donnees_brutes !")
        return

    df = pd.read_csv(chemin_entree)
    print(f"✅ Fichier chargé : {df.shape[0]} chiens trouvés !")

    # --- ÉTAPE B : NETTOYAGE & CRÉATION DE COLONNES ---
    print("🧹 Nettoyage du texte (Tempérament)...")
    df['temperament'] = df['temperament'].fillna('').str.lower()

    print("⚖️ Calcul des poids moyens et catégories de taille...")
    # On crée le poids moyen à partir du min et max
    df['mean_weight'] = (df['min_weight'] + df['max_weight']) / 2
    # On applique notre fonction usine pour créer la catégorie
    df['taille_categorie'] = df['mean_weight'].apply(get_size_category)

    print("⚡ Préparation des scores d'énergie et d'éducation...")
    # On comble les trous avec une note moyenne (ex: 0.5) pour éviter les crashs de l'IA
    df['energy_level_value'] = df['energy_level_value'].fillna(0.5)
    df['trainability_value'] = df['trainability_value'].fillna(0.5)

    # --- ÉTAPE C : SAUVEGARDE ---
    chemin_sortie = 'donnees_propres/animaux_vecteurs_clean.csv'
    
    # Sécurité : on s'assure que le dossier de sortie existe bien
    os.makedirs('donnees_propres', exist_ok=True)
    
    df.to_csv(chemin_sortie, index=False)
    print(f"🎉 SUCCÈS ! Le fichier propre a été sauvegardé dans : {chemin_sortie}")

# Permet d'exécuter la fonction main() uniquement si on lance ce script directement
if __name__ == "__main__":
    main()