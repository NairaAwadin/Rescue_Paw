import pandas as pd
import os

def main():
    print("🗺️ Lancement du nettoyage de la base de données des communes...")

    # 1. Chemin vers ton nouveau fichier
    chemin_entree = 'donnees_brutes/InseeDatagouv/communesfrance.csv'
    
    if not os.path.exists(chemin_entree):
        print(f"❌ Erreur : Fichier introuvable à {chemin_entree}")
        print("Vérifie que le fichier s'appelle bien 'villes_france.csv' !")
        return

    # 2. Chargement intelligent (teste la virgule puis le point-virgule)
    try:
        df = pd.read_csv(chemin_entree, sep=',')
        if len(df.columns) < 5:  # Si ça a mal découpé
            df = pd.read_csv(chemin_entree, sep=';')
    except Exception as e:
        print(f"Erreur de lecture : {e}")
        return
        
    print(f"✅ Fichier chargé : {df.shape[0]} communes trouvées au total.")

    # 3. On sélectionne TES colonnes exactes
    colonnes_a_garder = [
        'code_commune_INSEE', 
        'code_postal', 
        'nom_commune', 
        'latitude', 
        'longitude',
        'nom_departement',
        'nom_region'
    ]
    
    # On vérifie que les colonnes existent bien pour éviter de planter
    colonnes_presentes = [col for col in colonnes_a_garder if col in df.columns]
    df_clean = df[colonnes_presentes].copy()

    # 4. Nettoyage des coordonnées GPS
    print("✂️ Nettoyage des coordonnées GPS...")
    # On supprime les villes où il manque le GPS
    df_clean = df_clean.dropna(subset=['latitude', 'longitude'])
    
    # On s'assure que les coordonnées sont bien des nombres (on remplace les éventuelles virgules par des points)
    df_clean['latitude'] = df_clean['latitude'].astype(str).str.replace(',', '.').astype(float)
    df_clean['longitude'] = df_clean['longitude'].astype(str).str.replace(',', '.').astype(float)

    # 5. Sauvegarde du fichier propre
    os.makedirs('donnees_propres', exist_ok=True)
    chemin_sortie = 'donnees_propres/villes_france_clean.csv'
    df_clean.to_csv(chemin_sortie, index=False)
    
    print(f"🎉 SUCCÈS MAXIMAL ! {df_clean.shape[0]} villes prêtes avec leur GPS et Code INSEE.")
    print(f"Fichier sauvegardé dans : {chemin_sortie}")
    print("\n--- Aperçu des 3 premières lignes ---")
    print(df_clean.head(3))

if __name__ == "__main__":
    main()