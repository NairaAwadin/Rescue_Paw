import pandas as pd
import os

def main():
    print("🏢 [INSEE] Nettoyage du fichier Comparateur (Revenus & Densité)...")

    # Nom du fichier tel qu'il apparaît sur ton image
    chemin_entree = 'donnees_brutes/InseeDatagouv/base_cc_comparateur.csv'
    
    if not os.path.exists(chemin_entree):
        print(f"❌ Erreur : Je ne trouve pas '{chemin_entree}'.")
        return

    print("⏳ Lecture en cours...")
    try:
        df = pd.read_csv(chemin_entree, sep=';', low_memory=False)
    except:
        df = pd.read_csv(chemin_entree, sep=',', low_memory=False)

    # 1. Sélection des colonnes stratégiques
    # CODGEO (Code INSEE), P22_POP (Population), SUPERF (Superficie), MED21 (Revenu)
    colonnes_a_garder = ['CODGEO', 'P22_POP', 'SUPERF', 'MED21']
    
    colonnes_presentes = [col for col in colonnes_a_garder if col in df.columns]
    df_comp = df[colonnes_presentes].copy()

    # 2. Renommage
    df_comp = df_comp.rename(columns={
        'CODGEO': 'code_insee',
        'P22_POP': 'population',
        'SUPERF': 'superficie',
        'MED21': 'revenu_median'
    })

    print("🧮 Calcul de la densité...")
    
    # 3. Nettoyage numérique
    for col in ['population', 'superficie', 'revenu_median']:
        if df_comp[col].dtype == object:
            df_comp[col] = df_comp[col].astype(str).str.replace(',', '.')
        df_comp[col] = pd.to_numeric(df_comp[col], errors='coerce').fillna(0)

    # 4. Calcul de la densité (Habitants / km2)
    df_comp['densite_hab_km2'] = 0.0
    # Masque pour éviter division par zéro si superficie = 0
    masque_surf = df_comp['superficie'] > 0
    df_comp.loc[masque_surf, 'densite_hab_km2'] = round(df_comp['population'] / df_comp['superficie'], 2)

    # 5. Formatage Code INSEE
    df_comp['code_insee'] = df_comp['code_insee'].astype(str).str.zfill(5)

    # On ne garde que l'essentiel pour la fusion
    df_comp = df_comp[['code_insee', 'revenu_median', 'densite_hab_km2']]

    # 6. Sauvegarde
    os.makedirs('donnees_propres', exist_ok=True)
    chemin_sortie = 'donnees_propres/insee_compa_clean.csv'
    df_comp.to_csv(chemin_sortie, index=False)
    
    print(f"🎉 SUCCÈS ! Fichier comparateur prêt : {chemin_sortie}")
    print(df_comp.head())

if __name__ == "__main__":
    main()