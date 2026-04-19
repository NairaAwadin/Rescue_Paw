# Rescue Paw

Rescue Paw est une plateforme web qui aide a mettre en relation les futurs adoptants, les refuges et les animaux, tout en affichant des indicateurs territoriaux comme le score de bien-etre animal par ville

## Organisation du projet

- `paw_backend/` : API Django REST, base de donnees, logique metier et machine learning
- `paw_frontend/` : interface React/Vite
- `paw_data/` : donnees, scripts de preparation et modeles ML

## Lancement du frontend

Depuis la racine du projet:

```bash
cd paw_frontend
npm install
npm run dev
```

Le front est ensuite disponible sur l'URL affichee par Vite, souvent `http://127.0.0.1:5173`.

## Lancement du backend

Le guide detaille du backend se trouve ici:

- [paw_backend/README.md](paw_backend/README.md)

Il contient la creation du virtualenv, la configuration PostgreSQL, le fichier `.env`, les migrations, le chargement des donnees et le lancement du serveur Django.

## API

Quand le backend tourne, l'API est accessible sur:

- `http://127.0.0.1:8000/api/`

