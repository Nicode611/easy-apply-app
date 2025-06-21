# Correction du problème de limitation à 30 offres

## Problème identifié

Les scrapers HelloWork et Welcome to the Jungle ne retournaient que maximum 30 offres car ils n'acceptaient pas de paramètre pour contrôler le nombre de résultats, contrairement à Indeed.

## Solutions implémentées

### 1. Modification des scrapers

#### HelloWork (`scrapers/hellowork.js`)
- ✅ Ajout du paramètre `resultsWanted` (défaut: 30)
- ✅ Implémentation de la pagination pour récupérer plus d'offres
- ✅ Navigation automatique entre les pages
- ✅ Limitation du nombre de résultats au montant demandé

#### Welcome to the Jungle (`scrapers/welcometothejungle.js`)
- ✅ Ajout du paramètre `resultsWanted` (défaut: 30)
- ✅ Implémentation de la pagination via modification d'URL
- ✅ Auto-scroll pour charger le contenu lazy-loaded
- ✅ Limitation du nombre de résultats au montant demandé

### 2. Modification du serveur Express (`server.js`)

#### Endpoints mis à jour
- ✅ `/api/hellowork` : Accepte maintenant `resultsWanted`
- ✅ `/api/wttj` : Accepte maintenant `resultsWanted`
- ✅ `/api/all` : Passe `resultsWanted` à tous les scrapers

#### Valeurs par défaut
- Ancien défaut : 10 (pour Indeed uniquement)
- Nouveau défaut : 30 (pour tous les scrapers)

### 3. Modification des routes API Next.js

#### Routes mises à jour
- ✅ `/api/jobs/external` : Passe `resultsWanted` au serveur Express
- ✅ `/api/jobs/hellowork` : Passe `resultsWanted` au serveur Express
- ✅ `/api/jobs/welcometothejungle` : Passe `resultsWanted` au serveur Express
- ✅ `/api/jobs/indeed` : Passe `resultsWanted` au serveur Express

### 4. Modification des fonctions API client (`src/lib/api/jobs.ts`)

#### Fonctions mises à jour
- ✅ `getAllJobs()` : Accepte `resultsWanted` (défaut: 30)
- ✅ `getJobsFromHellowork()` : Accepte `resultsWanted` (défaut: 30)
- ✅ `getJobsFromWelcometothejungle()` : Accepte `resultsWanted` (défaut: 30)
- ✅ `getJobsFromIndeed()` : Accepte `resultsWanted` (défaut: 30)

## Utilisation

### Via l'API Express
```bash
# Récupérer 50 offres de HelloWork
GET /api/hellowork?jobQuery=développeur&locationQuery=Paris&resultsWanted=50

# Récupérer 100 offres de Welcome to the Jungle
GET /api/wttj?jobQuery=développeur&locationQuery=Paris&resultsWanted=100

# Récupérer 75 offres de tous les sites
GET /api/all?jobQuery=développeur&locationQuery=Paris&resultsWanted=75
```

### Via l'API Next.js
```javascript
// Récupérer 50 offres de HelloWork
const jobs = await getJobsFromHellowork('développeur', 'Paris', 50);

// Récupérer 100 offres de Welcome to the Jungle
const jobs = await getJobsFromWelcometothejungle('développeur', 'Paris', 100);

// Récupérer 75 offres de tous les sites
const jobs = await getAllJobs('développeur', 'Paris', 75);
```

## Test

Un script de test a été créé (`test-scrapers.js`) pour vérifier que les scrapers retournent maintenant plus de 30 offres :

```bash
cd easy-apply
node test-scrapers.js
```

## Résultat attendu

Maintenant, tous les scrapers peuvent retourner plus de 30 offres selon le paramètre `resultsWanted` fourni. La valeur par défaut est de 30 offres, mais vous pouvez demander jusqu'à plusieurs centaines d'offres selon les sites.

## Notes importantes

1. **Performance** : Plus vous demandez d'offres, plus le temps de scraping sera long
2. **Pagination** : Les scrapers naviguent automatiquement entre les pages pour récupérer plus d'offres
3. **Limitations des sites** : Certains sites peuvent avoir des limitations internes sur le nombre d'offres disponibles
4. **Rate limiting** : Les sites peuvent limiter les requêtes trop fréquentes 