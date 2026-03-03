import pandas as pd
import os

def main():
    print("🧬 Lancement de la Grande Fusion des données...")

    chemin_austin = 'donnees_propres/austin_chiens_clean.csv'
    chemin_races = 'donnees_propres/animaux_vecteurs_clean.csv'

    if not os.path.exists(chemin_austin) or not os.path.exists(chemin_races):
        print("❌ Erreur : Il manque un des fichiers propres !")
        return

    chiens_austin = pd.read_csv(chemin_austin)
    races_info = pd.read_csv(chemin_races)

    
    # On renomme la colonne cassée pour lui redonner son vrai nom : 'breed'
    if 'Unnamed: 0' in races_info.columns:
        races_info = races_info.rename(columns={'Unnamed: 0': 'breed'})

    # Nettoyage des noms pour faciliter la rencontre
    chiens_austin['breed_match'] = chiens_austin['breed'].astype(str).str.lower().str.replace(' mix', '', regex=False)
    races_info['breed_match'] = races_info['breed'].astype(str).str.lower()

    # LE MERGE
    print("🔗 Fusion des tableaux en cours...")
    super_tableau = pd.merge(chiens_austin, races_info, on='breed_match', how='left')

    # On nettoie les colonnes inutiles
    super_tableau = super_tableau.drop(columns=['breed_match'])

    # SAUVEGARDE
    chemin_sortie = 'donnees_propres/super_tableau_chiens.csv'
    super_tableau.to_csv(chemin_sortie, index=False)
    
    print(f"🎉 FUSION RÉUSSIE ! Le Super-Tableau est sauvegardé dans : {chemin_sortie}")

if __name__ == "__main__":
    main()