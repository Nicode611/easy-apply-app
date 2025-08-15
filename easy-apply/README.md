# Next.js SaaS Template

A complete SaaS template built with:

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- [Prisma](https://www.prisma.io/) - Database ORM
- [Auth.js (NextAuth.js)](https://next-auth.js.org/) - Authentication

## Features

- 🔐 User authentication with email/password and Google OAuth
- 👤 User management with roles (user/admin)
- 📱 Responsive design for all devices
- 🚀 Modern UI with TailwindCSS
- 📊 Dashboard with user information
- 🔄 Global state management with Redux Toolkit
- 🛡️ Route protection with middleware
- 🔍 **Job search across multiple platforms** (HelloWork, Welcome to the Jungle, Indeed)
- 💾 **Job saving and application tracking**
- 🎯 **Real-time job scraping with Puppeteer**

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/saas-template.git
cd saas-template
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env` file in the root of the project with the following variables:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/saas_template"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. Set up the database:

```bash
npx prisma migrate dev --name init
```

5. Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
/
├── prisma/              # Prisma schema and migrations
├── public/              # Static assets
├── src/
│   ├── app/             # App router pages and route handlers
│   │   ├── api/         # API routes
│   │   ├── dashboard/   # Dashboard pages
│   │   ├── login/       # Login page
│   │   └── register/    # Register page
│   ├── components/      # React components
│   │   ├── auth/        # Authentication components
│   │   └── ui/          # UI components
│   ├── lib/             # Utility functions
│   │   ├── prisma.ts    # Prisma client
│   │   ├── auth.ts      # Auth.js configuration
│   │   └── redux/       # Redux setup
│   └── types/           # TypeScript type definitions
└── middleware.ts        # Next.js middleware for route protection
```

## 🔍 Job Search Flow - Architecture Détaillée

### Vue d'ensemble

L'application utilise une architecture en couches pour la recherche de jobs :

```
Frontend (Next.js) ↔ API Routes (Next.js) ↔ Scraping Server (Express) ↔ Job Websites
```

### 1. Interface Utilisateur (Frontend)

#### Composants principaux :
- **`FindJob.tsx`** : Page principale de recherche
- **`SearchForm.tsx`** : Formulaire de recherche (métier, localisation, nombre d'offres)
- **`JobResults.tsx`** : Affichage des résultats
- **`WebsiteFilter.tsx`** : Filtrage par site web

#### Hook personnalisé `useJobSearch` :
```typescript
// src/hooks/useJobSearch.ts
export const useJobSearch = () => {
  // États locaux
  const [jobQuery, setJobQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [resultsWanted, setResultsWanted] = useState(60);
  const [hasSearched, setHasSearched] = useState(false);
  
  // États Redux
  const dispatch = useDispatch();
  const { jobs, loadingWebsites, isLoading } = useSelector((state: RootState) => state.jobs);

  // Fonction principale de recherche
  const fetchJobs = async () => {
    // Validation
    if (!jobQuery.trim()) {
      alert("Veuillez saisir un métier pour rechercher");
      return;
    }

    dispatch(setLoading(true));
    dispatch(clearJobs());
    setHasSearched(true);

    // Recherche parallèle sur tous les sites
    const promises = WEBSITES_CONFIG.map(async (websiteConfig) => {
      // ... logique de recherche par site
    });

    await Promise.allSettled(promises);
    dispatch(setLoading(false));
  };

  return {
    jobQuery, setJobQuery,
    locationQuery, setLocationQuery,
    resultsWanted, setResultsWanted,
    hasSearched, jobs, loadingWebsites, isLoading, fetchJobs
  };
};
```

### 2. Configuration des Sites Web

```typescript
// Configuration centralisée des sites web
const WEBSITES_CONFIG = [
  {
    name: 'hellowork.com',
    displayName: 'HelloWork',
    fetchFunction: getJobsFromHellowork
  },
  {
    name: 'welcometothejungle.com',
    displayName: 'Welcome to the Jungle',
    fetchFunction: getJobsFromWelcometothejungle
  },
  {
    name: 'indeed.com',
    displayName: 'Indeed',
    fetchFunction: getJobsFromIndeed
  }
];
```

### 3. Appels API Côté Client

#### Fonctions API (`src/lib/api/jobs.ts`) :
```typescript
// Exemple pour HelloWork
export const getJobsFromHellowork = async (
  jobQuery: string, 
  locationQuery: string, 
  resultsWanted: number = 30
): Promise<Job[]> => {
  try {
    // 1. Appel vers l'API Next.js
    const response = await fetch(`/api/jobs/hellowork?job=${jobQuery}&location=${locationQuery}&resultsWanted=${resultsWanted}`);
    const data: ExternalApiResponse = await response.json();
    
    // 2. Récupération des jobs sauvegardés
    const savedJobsResponse = await fetch('/api/jobs');
    const savedJobs: Job[] = await savedJobsResponse.json();

    // 3. Fusion des états (sauvegardé/appliqué)
    const jobsWithStates = data.all.map((job: Job) => {
      const savedJob = savedJobs.find((saved: Job) => saved.url === job.url);
      return {
        ...job,
        savedState: savedJob?.savedState || null,
        appliedState: savedJob?.appliedState || null,
        // ... autres états
      };
    });

    return jobsWithStates;
  } catch (error) {
    console.error('Error fetching HelloWork jobs:', error);
    return [];
  }
};
```

### 4. Routes API Next.js

#### Route HelloWork (`src/app/api/jobs/hellowork/route.ts`) :
```typescript
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobQuery = searchParams.get('job');
    const locationQuery = searchParams.get('location');
    const resultsWanted = searchParams.get('resultsWanted') || '60';

    // Validation des paramètres
    if (!jobQuery || !locationQuery) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Appel vers le serveur de scraping
    const response = await axios.get('http://localhost:3001/api/hellowork', {
      params: { jobQuery, locationQuery, resultsWanted }
    });

    // Transformation du format de réponse
    return NextResponse.json({ all: response.data.jobs || [] });
  } catch (error) {
    console.error("Error fetching external jobs:", error);
    return NextResponse.json({ error: "Failed to fetch external jobs" }, { status: 500 });
  }
}
```

### 5. Serveur de Scraping Externe

#### Serveur Express (`easy-apply-API/server.js`) :
```javascript
// Endpoint HelloWork
app.get('/api/hellowork', async (req, res) => {
  try {
    const { jobQuery, locationQuery, resultsWanted } = req.query;
    const resultsCount = parseInt(resultsWanted);
    
    // Appel du scraper
    const jobs = await scrapeHelloWork(jobQuery, locationQuery, resultsCount);
    
    res.json({ count: jobs.length, jobs });
  } catch (err) {
    console.error("Error in HelloWork endpoint:", err.message);
    // Retour d'un tableau vide en cas d'erreur
    res.json({ count: 0, jobs: [], error: "HelloWork temporarily unavailable" });
  }
});
```

### 6. Scrapers (Puppeteer)

#### Exemple : Scraper Welcome to the Jungle (`easy-apply-API/scrapers/welcometothejungle.js`) :
```javascript
const scrapeWTTJ = async (jobQuery, locationQuery, customUrl = null, resultsWanted = 30) => {
  let browser;
  try {
    // 1. Lancement du navigateur headless
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // 2. Configuration du navigateur
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    
    // 3. Construction de l'URL de recherche
    const url = `https://www.welcometothejungle.com/fr/jobs?query=${encodeURIComponent(jobQuery)}&page=1`;
    
    // 4. Navigation et attente du chargement
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => document.readyState === 'complete');
    
    // 5. Extraction des données
    const jobs = await page.$$eval('li[data-testid="search-results-list-item-wrapper"]', (items) => {
      return items.map(job => ({
        title: job.querySelector('h4')?.innerText.trim() || '',
        companyName: job.querySelector('span.wui-text')?.innerText.trim() || '',
        location: job.querySelector('p.wui-text')?.innerText.trim() || '',
        url: job.querySelector('a')?.href.trim() || '',
        // ... autres champs
      }));
    });
    
    return jobs;
  } catch (err) {
    console.error("Error in scrapeWTTJ:", err);
    // Fallback vers JobSpy API
    return await scrapeWTTJWithJobSpy(jobQuery, locationQuery, resultsWanted);
  } finally {
    if (browser) await browser.close();
  }
};
```

### 7. Gestion d'État (Redux)

#### Slice Jobs (`src/lib/redux/features/jobsSlice.ts`) :
```typescript
const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    loadingWebsites: {},
    isLoading: false,
    error: null
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setWebsiteLoading: (state, action) => {
      const { website, loading } = action.payload;
      state.loadingWebsites[website] = loading;
    },
    addJobsForWebsite: (state, action) => {
      const { website, jobs } = action.payload;
      // Ajout des jobs pour un site spécifique
      state.jobs.push(...jobs.map(job => ({ ...job, website })));
    },
    clearJobs: (state) => {
      state.jobs = [];
    }
  }
});
```

### 8. Flow Complet de Recherche

#### Séquence d'exécution :

1. **Utilisateur clique "Rechercher"**
   ```typescript
   // Dans SearchForm.tsx
   <button onClick={onSearch}>Rechercher</button>
   ```

2. **Hook `useJobSearch` lance la recherche**
   ```typescript
   // fetchJobs() est appelé
   const fetchJobs = async () => {
     // Validation + dispatch(setLoading(true))
     // Lancement parallèle des recherches
   };
   ```

3. **Appels API parallèles**
   ```typescript
   // Pour chaque site web
   const promises = WEBSITES_CONFIG.map(async (websiteConfig) => {
     const jobs = await websiteConfig.fetchFunction(jobQuery, locationQuery, resultsWanted);
     dispatch(addJobsForWebsite({ website: websiteConfig.name, jobs }));
   });
   ```

4. **Routes API Next.js**
   ```typescript
   // /api/jobs/hellowork → /api/jobs/welcometothejungle → /api/jobs/indeed
   ```

5. **Serveur de scraping**
   ```javascript
   // localhost:3001/api/hellowork → localhost:3001/api/wttj → localhost:3001/api/indeed
   ```

6. **Scrapers Puppeteer**
   ```javascript
   // scrapeHelloWork() → scrapeWTTJ() → scrapeIndeed()
   ```

7. **Retour des données**
   ```typescript
   // Scrapers → Serveur → API Routes → Hook → Redux → UI
   ```

### 9. Gestion des Erreurs et Fallbacks

#### Stratégies de fallback :
- **Scraper échoue** → Retour d'un tableau vide
- **Site web indisponible** → Fallback vers JobSpy API
- **Erreur réseau** → Affichage d'un message d'erreur
- **Timeout** → Retour des résultats partiels

### 10. Optimisations

#### Performance :
- **Recherche parallèle** : Tous les sites sont scrapés simultanément
- **Loading granulaire** : Chaque site a son propre état de loading
- **Gestion d'erreurs** : Un site qui échoue n'empêche pas les autres
- **Fallback API** : JobSpy comme backup si le scraping échoue

#### UX :
- **Feedback visuel** : Loading par site web
- **Résultats progressifs** : Affichage au fur et à mesure
- **Filtrage** : Possibilité de filtrer par site web
- **États persistants** : Jobs sauvegardés/appliqués conservés

## Customization

- **Styling**: You can customize the design by modifying the Tailwind classes in the components.
- **Database**: Update the Prisma schema in `prisma/schema.prisma` to match your data model.
- **Authentication**: Modify `src/lib/auth.ts` to add more authentication providers.

## Deployment

The application can be deployed to any platform that supports Next.js, such as Vercel, Netlify, or your own server.

```bash
npm run build
# or
yarn build
```

## License

MIT
