import pandas as pd
import numpy as np

def calculate_wellbeing_scores():
    """
    Calcule les scores de bien-être (notes A-E) pour chaque commune d'Île-de-France.
    
    Algorithme:
    1. Charge les statistiques d'infrastructure (vétérinaires, parcs, forêts, etc.)
    2. Applique une formule de scoring pondéré basée sur les priorités d'adoption
    3. Assigne des notes de lettre (A=excellent, E=faible) via distribution quantile
    4. Génère un classement des communes pour le système de matching d'adoption
    """
    print("Calcul des scores de bien-être pour les communes Rescue Paw...")

    # Charge les statistiques d'infrastructure précalculées
    chemin_stats = 'donnees_propres/stats_communes_idf.csv'
    df = pd.read_csv(chemin_stats)
    
    print(f"   - {len(df)} communes chargées")

    # Définit les coefficients de pondération basés sur les priorités d'adoption
    # Santé et activités quotidiennes sont fortement pondérées
    COEFF_VET = 40       # Santé (Priorité 1) - accès aux vétérinaires
    COEFF_PARC = 25      # Loisirs - promenades quotidiennes
    COEFF_FORET = 20     # Loisirs - promenades de week-end
    COEFF_DOG_PARK = 10  # Socialisation - parcs canins
    COEFF_REFUGE = 5     # Communauté - soutien à l'adoption
    
    print(f"\nCoefficients appliqués:")
    print(f"   - Vétérinaires: {COEFF_VET} (santé)")
    print(f"   - Parcs: {COEFF_PARC} (loisirs quotidiens)")
    print(f"   - Forêts: {COEFF_FORET} (loisirs week-end)")
    print(f"   - Parcs canins: {COEFF_DOG_PARK} (socialisation)")
    print(f"   - Refuges: {COEFF_REFUGE} (communauté)")

    # Calcule les scores bruts: somme pondérée des infrastructures
    df['score_brut'] = (
        (df['nb_vets'] * COEFF_VET) +
        (df['nb_parcs'] * COEFF_PARC) +
        (df['nb_forets'] * COEFF_FORET) +
        (df['nb_parcs_canins'] * COEFF_DOG_PARK) +
        (df['nb_refuges'] * COEFF_REFUGE)
    )
    
    print(f"\nScores bruts calculés:")
    print(f"   - Minimum: {df['score_brut'].min():.2f}")
    print(f"   - Maximum: {df['score_brut'].max():.2f}")
    print(f"   - Moyenne: {df['score_brut'].mean():.2f}")

    # Assigne les notes de lettre (A, B, C, D, E) basées sur la distribution quantile
    # Seules les communes avec infrastructure sont incluses dans le calcul quantile
    # pour éviter que les communes vides faussent la distribution.
    
    villes_actives = df[df['score_brut'] > 0].copy()
    
    print(f"\nCommunes avec infrastructure: {len(villes_actives)} / {len(df)}")
    
    if not villes_actives.empty:
        # Définit les seuils de notes aux percentiles 20, 40, 60, 80
        quantiles = villes_actives['score_brut'].quantile([0, 0.2, 0.4, 0.6, 0.8, 1.0])
        bins = quantiles.unique()
        labels = ['E', 'D', 'C', 'B', 'A']
        
        print(f"\nSeuils de notes (quantiles):")
        for i, quant in enumerate(quantiles):
            print(f"   - {quant:.2f}")
        
        # Assigne les notes via binning quantile
        df.loc[df['score_brut'] > 0, 'note_bien_etre'] = pd.cut(
            df.loc[df['score_brut'] > 0, 'score_brut'], 
            bins=bins, 
            labels=labels[:len(bins)-1], 
            include_lowest=True
        )
        
        # Les communes sans infrastructure reçoivent la note E
        df.loc[df['score_brut'] == 0, 'note_bien_etre'] = 'E'
        df['note_bien_etre'] = df['note_bien_etre'].astype(str).replace('nan', 'E')
    else:
        print("   Avertissement: Aucune commune avec infrastructure trouvée.")
        df['note_bien_etre'] = 'E'

    # Nettoie et prépare la sortie pour l'intégration Django
    colonnes_a_garder = [
        'code_commune_INSEE', 'nom_commune', 'code_postal', 'nom_departement',
        'nb_vets', 'nb_parcs', 'nb_parcs_canins', 'nb_forets', 'nb_refuges',
        'score_brut', 'note_bien_etre', 'latitude', 'longitude'
    ]
    
    # Filtre pour garder uniquement les colonnes existantes
    colonnes_existantes = [col for col in colonnes_a_garder if col in df.columns]
    
    df_final = df[colonnes_existantes].copy()
    df_final.to_csv('donnees_propres/villes_scored_final.csv', index=False)

    # Affiche les statistiques finales
    print("\n" + "="*50)
    print("CLASSEMENT DE BIEN-ÊTRE TERMINÉ")
    print("="*50)
    
    distribution = df_final['note_bien_etre'].value_counts().sort_index(ascending=False)
    print("\nDistribution des notes:")
    for note, count in distribution.items():
        pourcentage = (count / len(df_final)) * 100
        print(f"   {note}: {count:4d} communes ({pourcentage:5.1f}%)")
    
    print("\nTop 5 meilleures communes:")
    top_5 = df_final.nlargest(5, 'score_brut')[['nom_commune', 'nom_departement', 'score_brut', 'note_bien_etre']]
    for idx, row in top_5.iterrows():
        print(f"   - {row['nom_commune']:30s} ({row['nom_departement']:20s}): {row['score_brut']:7.2f} [{row['note_bien_etre']}]")
    
    print("="*50)
    print("Sortie: villes_scored_final.csv")
    print("="*50)

if __name__ == "__main__":
    calculate_wellbeing_scores()