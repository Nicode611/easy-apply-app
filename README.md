# 🚀 Easy Apply - Monorepo

Une plateforme complète de recherche et gestion d'emplois avec scraping automatique de multiples sites d'emploi.

**Screenshot of the project**
![Landing page](/easy-apply/public/easy-apply-landing.webp)
![Find Job](/easy-apply/public/easy-apply-find-job.webp)
![Saved jobs](/easy-apply/public/easy-apply-saved.webp)


## 📋 Table des matières

- [Architecture](#architecture)
- [Technologies](#technologies)
- [Installation](#installation)
- [Démarrage](#démarrage)
- [Structure du projet](#structure-du-projet)
- [API Endpoints](#api-endpoints)
- [Développement](#développement)
- [Déploiement](#déploiement)
- [Dépannage](#dépannage)

## 🏗️ Architecture

Ce monorepo contient trois services principaux :

- **Frontend Next.js** (Port 3000) - Interface utilisateur moderne
- **API Express** (Port 3001) - Service de scraping avec Puppeteer
- **API Python JobSpy** (Port 8000) - Service de scraping avancé

### Communication entre services :
```
Frontend (3000) → API Express (3001) → API Python JobSpy (8000)
```

## 🛠️ Technologies

### Frontend
- **Next.js 15** avec Turbopack
- **React 19** avec TypeScript
- **Tailwind CSS** pour le styling
- **NextAuth.js** pour l'authentification
- **Prisma** pour la base de données
- **Redux Toolkit** pour la gestion d'état

### API Express
- **Node.js** avec Express
- **Puppeteer** pour le scraping
- **CORS** pour la communication cross-origin

### API Python
- **FastAPI** avec Uvicorn
- **JobSpy** pour le scraping avancé
- **Poetry** pour la gestion des dépendances

## 📦 Installation

### Prérequis
- Node.js 18+ 
- Python 3.10+
- npm ou yarn
- Poetry (pour Python)

### Installation complète

```bash
# Cloner le repository
git clone <your-repo-url>
cd easy-apply-app

# Installer toutes les dépendances
npm run install:all

# Installer les dépendances Python
cd JobSpy
poetry install
cd ..

# Installer uvicorn et fastapi (si pas déjà fait)
cd JobSpy && python3 -m pip install uvicorn fastapi && cd ..
```

## 🚀 Démarrage

### Option 1 : Commande globale (Recommandée)
```bash
# Démarrer tous les services en une fois
npm run dev
```

### Option 2 : Script shell
```bash
# Rendre le script exécutable (première fois)
chmod +x start-dev.sh

# Démarrer tous les services
./start-dev.sh
```

### Option 3 : Services individuels
```bash
# Frontend Next.js
cd easy-apply && npm run dev

# API Express
cd easy-apply-API && npm start

# API Python
cd JobSpy && python3 -m uvicorn api_jobspy:app --host 0.0.0.0 --port 8000 --reload
```

## 📁 Structure du projet

```
easy-apply-app/
├── easy-apply/                 # Frontend Next.js
│   ├── src/
│   │   ├── app/               # Pages et API routes
│   │   ├── components/        # Composants React
│   │   ├── lib/              # Utilitaires et configuration
│   │   └── types/            # Types TypeScript
│   ├── prisma/               # Schéma et migrations DB
│   └── package.json
├── easy-apply-API/            # API Express
│   ├── scrapers/             # Scrapers Puppeteer
│   ├── server.js             # Serveur principal
│   └── package.json
├── JobSpy/                   # API Python
│   ├── api_jobspy.py         # API FastAPI
│   ├── jobspy/               # Bibliothèque JobSpy
│   └── pyproject.toml
├── package.json              # Configuration monorepo
├── start-dev.sh              # Script de démarrage
└── README.md
```

## 🔌 API Endpoints

### API Express (Port 3001)

#### Scraping d'emplois
- `GET /api/hellowork` - Scraper HelloWork
- `GET /api/wttj` - Scraper Welcome to the Jungle
- `GET /api/indeed` - Scraper Indeed
- `GET /api/all` - Scraper tous les sites

#### Pagination
- `GET /api/hellowork/page/:page` - Pagination HelloWork
- `GET /api/wttj/page/:page` - Pagination WTTJ
- `GET /api/indeed/page/:page` - Pagination Indeed

#### Informations
- `GET /api/hellowork/info` - Infos pagination HelloWork
- `GET /api/wttj/info` - Infos pagination WTTJ
- `GET /api/indeed/info` - Infos pagination Indeed

#### Health Check
- `GET /api/health` - Statut du service

### API Python JobSpy (Port 8000)

- `GET /jobs` - Recherche d'emplois multi-sites

### Frontend Next.js (Port 3000)

#### API Routes
- `GET /api/jobs` - Récupérer les emplois sauvegardés
- `POST /api/jobs` - Sauvegarder un emploi
- `GET /api/jobs/external` - Récupérer emplois externes
- `GET /api/auth/[...nextauth]` - Authentification

## 💻 Développement

### Commandes utiles

```bash
# Installer toutes les dépendances
npm run install:all

# Démarrer en mode développement
npm run dev

# Construire le frontend
npm run build

# Démarrer en mode production
npm run start

# Arrêter tous les services
npm run stop
```

### Variables d'environnement

Créer un fichier `.env` dans `easy-apply/` :

```env
# Base de données
DATABASE_URL="mysql://user:password@localhost:5432/easy_apply"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Fournisseurs d'authentification
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Base de données

```bash
# Générer le client Prisma
cd easy-apply && npx prisma generate

# Appliquer les migrations
npx prisma migrate dev

# Ouvrir Prisma Studio
npx prisma studio
```

## 📝 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarrer tous les services en développement |
| `npm run install:all` | Installer toutes les dépendances |
| `npm run build` | Construire le frontend |
| `npm run start` | Démarrer en mode production |
| `npm run stop` | Arrêter tous les services |
| `./start-dev.sh` | Script shell alternatif |

## 🙏 Remerciements

- [JobSpy](https://github.com/cullenwatson/JobSpy) pour le scraping avancé