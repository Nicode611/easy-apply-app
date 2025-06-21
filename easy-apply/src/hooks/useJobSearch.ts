import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { addJobsForWebsite, setWebsiteLoading, setLoading, setError, clearJobs } from "@/lib/redux/features/jobsSlice";
import { getJobsFromHellowork, getJobsFromWelcometothejungle, getJobsFromIndeed } from "@/lib/api/jobs";

// Configuration des sites web
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

export const useJobSearch = () => {
  const [jobQuery, setJobQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [resultsWanted, setResultsWanted] = useState(60);
  const [hasSearched, setHasSearched] = useState(false);
  
  const dispatch = useDispatch();
  const { jobs, loadingWebsites, isLoading } = useSelector((state: RootState) => state.jobs);

  const fetchJobs = async () => {
    if (!jobQuery.trim()) {
      alert("Veuillez saisir un métier pour rechercher");
      return;
    }

    dispatch(setLoading(true));
    dispatch(clearJobs());
    setHasSearched(true);

    try {
      // Lancer les recherches en parallèle pour chaque site
      const promises = WEBSITES_CONFIG.map(async (websiteConfig) => {
        const websiteName = websiteConfig.name;
        
        // Marquer ce site comme en cours de chargement
        dispatch(setWebsiteLoading({ website: websiteName, loading: true }));
        
        try {
          const jobs = await websiteConfig.fetchFunction(jobQuery, locationQuery, resultsWanted);
          
          // Vérifier que jobs est un tableau
          if (!Array.isArray(jobs)) {
            console.error(`Réponse invalide pour ${websiteConfig.displayName}:`, jobs);
            dispatch(addJobsForWebsite({ website: websiteName, jobs: [] }));
            return;
          }
          
          // Ajouter les jobs pour ce site
          dispatch(addJobsForWebsite({ website: websiteName, jobs }));
          
          console.log(`Jobs récupérés pour ${websiteConfig.displayName}:`, jobs.length);
        } catch (error) {
          console.error(`Erreur lors de la récupération des jobs pour ${websiteConfig.displayName}:`, error);
          // Ajouter un tableau vide pour ce site en cas d'erreur
          dispatch(addJobsForWebsite({ website: websiteName, jobs: [] }));
        } finally {
          // Marquer ce site comme terminé
          dispatch(setWebsiteLoading({ website: websiteName, loading: false }));
        }
      });

      // Attendre que toutes les recherches soient terminées
      await Promise.allSettled(promises);
      
    } catch (error) {
      console.error("Erreur générale lors de la recherche:", error);
      dispatch(setError(error instanceof Error ? error.message : "Une erreur s'est produite"));
    } finally {
      // Arrêter le loading global une fois que tous les sites ont fini
      dispatch(setLoading(false));
    }
  };

  return {
    jobQuery,
    setJobQuery,
    locationQuery,
    setLocationQuery,
    resultsWanted,
    setResultsWanted,
    hasSearched,
    jobs,
    loadingWebsites,
    isLoading,
    fetchJobs
  };
}; 