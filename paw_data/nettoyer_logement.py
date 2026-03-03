import pandas as pd
import os

def main():
    print("🏡 [INSEE] Nettoyage du fichier Logements...")

    chemin_entree = 'donnees_brutes/InseeDatagouv/base-cc-logement-2022.csv'
    
    if not os.path.exists(chemin_entree):
        print(f"❌ Erreur : Je ne trouve pas '{chemin_entree}'.")
        return

    print("⏳ Lecture en cours...")
    try:
        df = pd.read_csv(chemin_entree, sep=';', low_memory=False)
    except:
        df = pd.read_csv(chemin_entree, sep=',', low_memory=False)

    # 1. On garde les noms de colonnes BRUTS de l'INSEE pour l'instant
    colonnes_insee = ['CODGEO', 'LIBGEO', 'P22_MAISON', 'P22_APPART']
    
    # On ne garde que ce qui existe vraiment dans le fichier
    df_clean = df[[c for c in colonnes_insee if c in df.columns]].copy()

    print("🧮 Calcul du pourcentage de maisons...")
    
    # 2. Nettoyage numérique direct sur les noms INSEE
    for col in ['P22_MAISON', 'P22_APPART']:
        if col in df_clean.columns:
            if df_clean[col].dtype == object:
                df_clean[col] = df_clean[col].astype(str).str.replace(',', '.')
            df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce').fillna(0)

    # 3. Calcul du pourcentage
    df_clean['total_m_a'] = df_clean['P22_MAISON'] + df_clean['P22_APPART']
    df_clean['pct_maisons'] = 0.0
    masque = df_clean['total_m_a'] > 0
    df_clean.loc[masque, 'pct_maisons'] = round((df_clean['P22_MAISON'] / df_clean['total_m_a']) * 100, 1)

    # 4. LE RENOMMAGE FINAL (juste avant l'export)
    # On crée un nouveau tableau avec seulement ce qu'on veut
    df_final = pd.DataFrame()
    df_final['code_insee'] = df_clean['CODGEO'].astype(str).str.zfill(5)
    
    # Sécurité pour le nom de la ville
    if 'LIBGEO' in df_clean.columns:
        df_final['ville'] = df_clean['LIBGEO']
    else:
        df_final['ville'] = "Inconnue"
        
    df_final['pct_maisons'] = df_clean['pct_maisons']

    # 5. Sauvegarde
    os.makedirs('donnees_propres', exist_ok=True)
    chemin_sortie = 'donnees_propres/insee_logements_clean.csv'
    df_final.to_csv(chemin_sortie, index=False)
    
    print(f"🎉 SUCCÈS ! Fichier logement prêt : {chemin_sortie}")
    print(df_final.head())

if __name__ == "__main__":
    main()