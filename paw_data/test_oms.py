import pandas as pd
import requests
import time
import os

def interroger_osm(lat, lon, rayon=2000):
    url = "http://overpass-api.de/api/interpreter"
    
    requete = f"""
    [out:json];
    (
      node["leisure"="park"](around:{rayon},{lat},{lon});
      way["leisure"="park"](around:{rayon},{lat},{lon});
      node["leisure"="dog_park"](around:{rayon},{lat},{lon});
      way["leisure"="dog_park"](around:{rayon},{lat},{lon});
      way["natural"="wood"](around:{rayon},{lat},{lon});
      node["amenity"="veterinary"](around:{rayon},{lat},{lon});
    );
    out center;
    """
    
    try:
        reponse = requests.get(url, params={'data': requete})
        if reponse.status_code == 200:
            elements = reponse.json().get('elements', [])
            comptes = {'parcs': 0, 'parcs_canins': 0, 'forets': 0, 'vetos': 0}
            
            for el in elements:
                tags = el.get('tags', {})
                if tags.get('leisure') == 'park': comptes['parcs'] += 1
                elif tags.get('leisure') == 'dog_park': comptes['parcs_canins'] += 1
                elif tags.get('natural') == 'wood': comptes['forets'] += 1
                elif tags.get('amenity') == 'veterinary': comptes['vetos'] += 1
                
            return comptes
    except Exception as e:
        print(f"Erreur de connexion : {e}")
        
    return {'parcs': 0, 'parcs_canins': 0, 'forets': 0, 'vetos': 0}

def main():
    print("🚀 Début de l'enrichissement OSM (Ciblage : Île-de-France)...")
    
    chemin_villes = 'donnees_propres/villes_france_clean.csv'
    if not os.path.exists(chemin_villes):
        print("❌ Fichier des villes introuvable !")
        return

    # 1. On charge la carte de France
    df_villes = pd.read_csv(chemin_villes)
    
    # 2. Filtrage pour l'Île-de-France (On utilise le code INSEE qui est infaillible)
    # Les départements d'IDF sont : 75, 77, 78, 91, 92, 93, 94, 95
    depts_idf = ('75', '77', '78', '91', '92', '93', '94', '95')
    
    # On filtre les lignes dont le code INSEE commence par un de ces départements
    df_idf = df_villes[df_villes['code_commune_INSEE'].astype(str).str.startswith(depts_idf)].copy()
    
    total_villes = len(df_idf)
    print(f"📍 {total_villes} communes trouvées en Île-de-France ! Prépare-toi, ça va prendre un peu de temps (env. {int(total_villes*2/60)} minutes).")

    # 3. Préparation des colonnes
    df_idf['nb_parcs'] = 0
    df_idf['nb_parcs_canins'] = 0
    df_idf['nb_forets'] = 0
    df_idf['nb_vetos'] = 0

    chemin_sortie = 'donnees_propres/villes_idf_osm.csv'

    # 4. La Boucle avec Sauvegarde Automatique
    compteur = 0
    for index, ligne in df_idf.iterrows():
        compteur += 1
        ville = ligne['nom_commune']
        lat = ligne['latitude']
        lon = ligne['longitude']
        
        print(f"[{compteur}/{total_villes}] 🔍 Analyse de {ville}...")
        resultats = interroger_osm(lat, lon)
        
        # Remplissage
        df_idf.at[index, 'nb_parcs'] = resultats['parcs']
        df_idf.at[index, 'nb_parcs_canins'] = resultats['parcs_canins']
        df_idf.at[index, 'nb_forets'] = resultats['forets']
        df_idf.at[index, 'nb_vetos'] = resultats['vetos']
        
        # 💾 SAUVEGARDE AUTO TOUTES LES 50 VILLES
        if compteur % 50 == 0:
            df_idf.to_csv(chemin_sortie, index=False)
            print(f"💾 Sauvegarde de sécurité effectuée ({compteur} villes traitées).")
            
        time.sleep(2) # La pause obligatoire

    # Sauvegarde finale
    df_idf.to_csv(chemin_sortie, index=False)
    print(f"\n🎉 EXCELLENT ! L'Île-de-France entière a été cartographiée et sauvegardée dans {chemin_sortie}")

if __name__ == "__main__":
    main()