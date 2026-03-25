import requests
import pandas as pd
import time

def extract_osm_poi_data():
    """
    Extrait les points d'intérêt (POI) détaillés d'OpenStreetMap pour l'Île-de-France.
    
    Interroge l'API Overpass OSM pour:
    - Vétérinaires (amenity=veterinary)
    - Refuges pour animaux (amenity=animal_shelter)
    - Parcs et parcs canins (leisure)
    - Forêts et zones boisées (landuse, natural)
    
    Traite ~30 000 enregistrements POI et les formate pour l'ingestion des modèles Django.
    Sortie: points_interet_detaille.csv avec adresses normalisées et coordonnées
    """
    print("Démarrage de l'extraction des points d'intérêt d'OpenStreetMap (Île-de-France)...")
    
    # Définit la requête Overpass pour la région Île-de-France
    # Cible 5 catégories de POI pertinentes pour le bien-être animal
    query = """
    [out:json][timeout:600];
    area["name"="Île-de-France"]->.searchArea;
    (
      node["amenity"="veterinary"](area.searchArea);
      node["amenity"="animal_shelter"](area.searchArea);
      node["leisure"="park"](area.searchArea);
      way["leisure"="park"](area.searchArea);
      node["leisure"="dog_park"](area.searchArea);
      way["leisure"="dog_park"](area.searchArea);
      node["landuse"="forest"](area.searchArea);
      way["landuse"="forest"](area.searchArea);
      node["natural"="wood"](area.searchArea);
      way["natural"="wood"](area.searchArea);
    );
    out center;
    """
    
    url = "https://overpass-api.de/api/interpreter"
    
    # Exécute la requête avec gestion des erreurs
    try:
        response = requests.post(url, data={'data': query}, timeout=610)
        response.raise_for_status()
        elements = response.json().get('elements', [])
    except Exception as e:
        print(f"Erreur lors de la récupération des données: {e}")
        return

    points_details = []

    # Traite chaque élément OSM
    for el in elements:
        tags = el.get('tags', {})
        
        # Classifie le type de POI selon les tags OSM
        osm_type = "autre"
        if tags.get('amenity') == 'veterinary': 
            osm_type = 'veterinaire'
        elif tags.get('amenity') == 'animal_shelter': 
            osm_type = 'refuge'
        elif tags.get('leisure') == 'dog_park': 
            osm_type = 'parc_canin'
        elif tags.get('leisure') == 'park': 
            osm_type = 'parc'
        elif tags.get('landuse') == 'forest' or tags.get('natural') == 'wood': 
            osm_type = 'foret'

        # Construit une adresse normalisée à partir des champs disponibles
        rue = tags.get('addr:street', '')
        numero = tags.get('addr:housenumber', '')
        cp = tags.get('addr:postcode', '')
        ville = tags.get('addr:city', '')
        
        adresse_complete = f"{numero} {rue}, {cp} {ville}".strip(", ")
        if adresse_complete == ",": 
            adresse_complete = "Adresse non renseignée"

        # Extrait les coordonnées (priorité Point, fallback au centre Way)
        lat = el.get('lat') or el.get('center', {}).get('lat')
        lon = el.get('lon') or el.get('center', {}).get('lon')

        points_details.append({
            'nom': tags.get('name', f"{osm_type.capitalize()} public"),
            'type': osm_type,
            'latitude': lat,
            'longitude': lon,
            'adresse': adresse_complete,
            'code_postal': cp,
            'ville': ville,
            'osm_id': el.get('id')
        })

    df = pd.DataFrame(points_details)
    df.to_csv('donnees_propres/points_interet_detaille.csv', index=False)
    print(f"Extraction terminée: {len(df)} enregistrements POI sauvegardés dans points_interet_detaille.csv")

if __name__ == "__main__":
    extract_osm_poi_data()