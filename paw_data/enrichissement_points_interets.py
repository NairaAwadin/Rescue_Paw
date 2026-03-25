import pandas as pd
from scipy.spatial import KDTree

def process_and_enrich_poi():
    """
    Enrichit les points d'intérêt OSM avec le mapping des communes.
    
    Charge les données OSM, mappe chaque point à sa commune la plus proche
    via un index spatial KDTree, et génère deux fichiers de sortie:
    - points_interet_final_django.csv: Points détaillés pour les modèles Django
    - stats_communes_idf.csv: Statistiques agrégées par commune
    """
    print("Chargement des fichiers sources...")
    # Charge 29 815 points d'intérêt OSM
    df_points = pd.read_csv('donnees_propres/points_interet_detaille.csv')
    # Charge la base de référence des communes
    df_villes = pd.read_csv('donnees_propres/villes_france_clean.csv')

    # Standardise les codes INSEE communes au format 5 chiffres
    df_villes['code_commune_INSEE'] = df_villes['code_commune_INSEE'].astype(str).str.zfill(5)
    
    print("Construction de l'index spatial (KDTree)...")
    coords_villes = df_villes[['latitude', 'longitude']].values
    tree = KDTree(coords_villes)

    print(f"Liaison de {len(df_points)} points avec les communes les plus proches...")
    # Trouve la commune la plus proche pour chaque point OSM
    dist, indices = tree.query(df_points[['latitude', 'longitude']].values)

    # Ajoute les informations de la commune à chaque point
    df_points['code_commune_INSEE'] = df_villes.iloc[indices]['code_commune_INSEE'].values
    df_points['commune_proche'] = df_villes.iloc[indices]['nom_commune'].values
    
    # Remplit les codes postaux manquants à partir des communes associées
    villes_cp = df_villes.iloc[indices]['code_postal'].values
    df_points['code_postal'] = df_points['code_postal'].fillna(pd.Series(villes_cp))
    
    # Sauvegarde le fichier détaillé pour les modèles Django
    df_points.to_csv('donnees_propres/points_interet_final_django.csv', index=False)
    print("Créé: points_interet_final_django.csv")

    # Génère les statistiques agrégées par commune
    print("Calcul des statistiques par commune...")
    # Compte le nombre de chaque type de POI par commune (code INSEE)
    stats = df_points.groupby(['code_commune_INSEE', 'type']).size().unstack(fill_value=0)
    
    # Mappe les noms de colonnes au schéma de la base de données
    mapping = {
        'parc': 'nb_parcs', 
        'parc_canin': 'nb_parcs_canins',
        'veterinaire': 'nb_vets', 
        'refuge': 'nb_refuges', 
        'foret': 'nb_forets'
    }
    stats = stats.rename(columns=mapping)
    
    # S'assure que toutes les colonnes requises existent (même avec des zéros)
    for col in mapping.values():
        if col not in stats.columns: 
            stats[col] = 0

    # Fusionne les statistiques avec les données de référence des communes
    df_stats_final = df_villes.merge(stats, on='code_commune_INSEE', how='left').fillna(0)
    
    # Filtre pour la région Île-de-France uniquement
    depts_idf = ['Paris', 'Seine-et-Marne', 'Yvelines', 'Essonne', 'Hauts-de-Seine', 
                 'Seine-Saint-Denis', 'Val-de-Marne', "Val-d'Oise"]
    df_stats_final = df_stats_final[df_stats_final['nom_departement'].isin(depts_idf)]

    # Sauvegarde les statistiques finales agrégées
    df_stats_final.to_csv('donnees_propres/stats_communes_idf.csv', index=False)
    print("Créé: stats_communes_idf.csv - enrichissement terminé")

if __name__ == "__main__":
    process_and_enrich_poi()