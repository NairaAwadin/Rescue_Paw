# Paw Rescue - Backend (Django)

API Django REST pour Rescue Paw.

## Prerequis

- Python 3.12+
- PostgreSQL 14+
- (Optionnel) pgAdmin

## Arborescence utile

- `manage.py`
- `config/settings.py`
- `api/`
- `.env` (dans `paw_backend`)

## 1) Creation et activation de l'environnement virtuel

Depuis la racine du repo:

```bash
cd <project-root>
python3 -m venv venv
source venv/bin/activate
```

## 2) Installation des dependances

Si le venv est a la racine du repo:

```bash
python3 -m pip install -r paw_backend/requirements.txt
```

## 3) Configuration `.env`

Le backend charge le fichier `paw_backend/.env`.

Exemple:

```env
# Django Settings
SECRET_KEY=change-me-with-a-generated-key
DEBUG=True

# Database Configuration (PostgreSQL)
DB_NAME=rescue_paw_db
DB_USER=rescue_paw_user
DB_PASSWORD=user
DB_HOST=localhost
DB_PORT=5432
```

### Generer une SECRET_KEY Django

```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## 4) Configuration PostgreSQL (local)

### Installation Ubuntu

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib libpq-dev
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### Creation user + base

```bash
sudo -u postgres psql <<'SQL'
CREATE USER rescue_paw_user WITH PASSWORD 'user';
CREATE DATABASE rescue_paw_db OWNER rescue_paw_user;
GRANT ALL PRIVILEGES ON DATABASE rescue_paw_db TO rescue_paw_user;
SQL
```

Si les objets existent deja, ignorer l'erreur et continuer

## 5) Migrations

Depuis `paw_backend`:

```bash
python3 manage.py migrate
```

## 6) Charger des donnees de test

```bash
python3 manage.py load_data
```

## 7) Lancer le serveur

```bash
python3 manage.py runserver
```

API base URL:

- `http://127.0.0.1:8000/api/`

## Endpoints utiles (test rapide)

- `GET /api/animals/`
- `GET /api/refuges/`
- `GET /api/territoires/`
- `GET /api/wellbeing/?zip_code=75011`

## Modele ML (`.joblib`)

Le backend attend le modele ici:

- `paw_data/models/matching_model.joblib`

Chemin cree si besoin:

```bash
cd <project-root>
mkdir -p paw_data/models
```

## Problemes frequents

### `python: command not found`

Utiliser `python3` au lieu de `python`.

### `ModuleNotFoundError: No module named 'django'`

Le venv actif ne contient pas les deps. Reinstaller:

```bash
cd <project-root>
source venv/bin/activate
python3 -m pip install -r paw_backend/requirements.txt
```