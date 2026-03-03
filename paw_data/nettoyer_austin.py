import pandas as pd
import os

def main():
    print("🤠 Lancement du nettoyage des données d'Austin...")

    # 1. Charger le fichier
    # ⚠️ Modifie le nom du fichier si le tien s'appelle autrement !
    chemin_entree = 'donnees_brutes/Austin Refuge/aac_intakes_outcomes.csv'
    
    if not os.path.exists(chemin_entree):
        print(f"❌ Erreur : Fichier introuvable à {chemin_entree}")
        return

    # On charge le fichier (low_memory=False évite un petit avertissement de Pandas)
    df = pd.read_csv(chemin_entree, low_memory=False)
    print(f"✅ Fichier chargé : {df.shape[0]} animaux trouvés au total.")

    # 2. Filtrer uniquement les CHIENS 🐶
    df_dogs = df[df['animal_type'] == 'Dog'].copy()
    print(f"🐕 Filtrage terminé : il reste {df_dogs.shape[0]} chiens.")

    # 3. Créer notre variable cible "est_adopte" (1 = Oui, 0 = Non)
    df_dogs['est_adopte'] = df_dogs['outcome_type'].apply(lambda x: 1 if x == 'Adoption' else 0)

    # 4. Sélectionner uniquement les colonnes utiles (Feature Selection)
    colonnes_a_garder = [
        'animal_id_intake', 
        'breed', 
        'color', 
        'sex_upon_intake',
        'intake_condition', 
        'intake_type', 
        'age_upon_intake_(years)', 
        'time_in_shelter_days',
        'est_adopte'
    ]
    
    # On filtre le tableau pour ne garder que ces colonnes
    df_clean = df_dogs[colonnes_a_garder]

    # 5. Sauvegarder le fichier propre
    chemin_sortie = 'donnees_propres/austin_chiens_clean.csv'
    
    # Sécurité pour créer le dossier s'il n'existe pas
    os.makedirs('donnees_propres', exist_ok=True)
    
    df_clean.to_csv(chemin_sortie, index=False)
    print(f"🎉 SUCCÈS ! {df_clean.shape[0]} chiens d'Austin sont prêts et rangés dans : {chemin_sortie}")

if __name__ == "__main__":
    main()