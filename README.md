# 🐾 Rescue Paw

Une plateforme intelligente qui analyse les données territoriales pour prédire les risques d'abandon, noter le bien-être animal par ville et connecter les futurs adoptants aux refuges les plus adaptés. .

## 🛠️ Installation Initiale (Backend)
Situé dans le dossier '/paw_backend'. Suivez ces étapes pour configurer votre environnement :

1. **Entrer dans le dossier :**
   'cd paw_backend'

2. **Créer et activer l'environnement virtuel :**
   - **Linux/Mac :** 'python3 -m venv venv && source venv/bin/activate'
   - **Windows :** 'python -m venv venv && venv\Scripts\activate'

3. **Installer les dépendances :**
   'pip install -r requirements.txt'

4. **Configurer les variables d'environnement :**
   - créez le fichier '.env'
   - Remplissez vos accès PostgreSQL locaux dans le '.env'.

## Configuration de PostgreSQL

Le projet nécessite un serveur PostgreSQL actif.

### 1. Installation
- **Windows :** Téléchargez l'installateur sur [postgresql.org](https://www.postgresql.org/download/windows/).
- **Mac (Simple) :** Téléchargez [Postgres.app](https://postgresapp.com/).
- **Mac (Expert) :** 'brew install postgresql'
- **Linux (Fedora) :** 'sudo dnf install postgresql-server'

### 2. Création de la base de données
Ouvrez votre terminal SQL ou pgAdmin et exécutez :
'CREATE DATABASE rescue_paw_db;'

### 3. Migrations Django
Une fois la base créée et le '.env' rempli, créez les tables :
'python manage.py migrate'

## Lancement Quotidien

**Pour lancer le serveur:**
1. 'cd paw_backend'
2. 'source venv/bin/activate'
3. 'python manage.py runserver'

## Frontend (React/Vue)
Situé dans le dossier '/paw_frontend'
(Instructions à remplir par Yane)

## Connexion API
L'API est accessible sur : 'http://127.0.0.1:8000/api/'
