import { useState, useEffect } from 'react';
import { Job } from '@/types/job';

export const useJobFilter = (jobs: Job[]) => {
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Organiser les jobs par site web
  const organizeJobsByWebsite = (jobs: Job[]) => {
    const groupedJobs: { [key: string]: Job[] } = {};
    
    jobs.forEach(job => {
      const website = job.jobWebsite || 'Autre';
      if (!groupedJobs[website]) {
        groupedJobs[website] = [];
      }
      groupedJobs[website].push(job);
    });

    return groupedJobs;
  };

  const allGroupedJobs = organizeJobsByWebsite(jobs);

  // Filtrer les jobs selon les sites sélectionnés
  const getFilteredGroupedJobs = () => {
    // Si aucun site n'est sélectionné, afficher aucun job
    if (selectedWebsites.length === 0) {
      return {};
    }
    
    // Sinon, afficher seulement les jobs des sites sélectionnés
    const filtered: { [key: string]: Job[] } = {};
    selectedWebsites.forEach(website => {
      if (allGroupedJobs[website]) {
        filtered[website] = allGroupedJobs[website];
      }
    });
    return filtered;
  };

  const groupedJobs = getFilteredGroupedJobs();

  // Fonction pour obtenir le nom d'affichage du site web
  const getWebsiteDisplayName = (website: string) => {
    const websiteNames: { [key: string]: string } = {
      'hellowork.com': 'HelloWork',
      'welcometothejungle.com': 'Welcome to the Jungle',
      'apec.fr': 'APEC',
      'pole-emploi.fr': 'Pôle Emploi',
      'linkedin.com': 'LinkedIn',
      'indeed.com': 'Indeed',
      'autrecandidat.com': 'Autre Candidat',
      'Autre': 'Autres sites'
    };
    
    return websiteNames[website] || website;
  };

  // Gérer la sélection/désélection des sites
  const handleWebsiteToggle = (website: string) => {
    setSelectedWebsites(prev => {
      if (prev.includes(website)) {
        // Retirer le site de la sélection
        return prev.filter(w => w !== website);
      } else {
        // Ajouter le site à la sélection
        return [...prev, website];
      }
    });
  };

  // Sélectionner tous les sites (afficher tous)
  const handleSelectAll = () => {
    setSelectedWebsites(Object.keys(allGroupedJobs));
  };

  // Désélectionner tous les sites (afficher aucun)
  const handleDeselectAll = () => {
    setSelectedWebsites([]);
  };

  // Obtenir tous les sites web disponibles
  const availableWebsites = Object.keys(allGroupedJobs);

  // Déterminer si un site est sélectionné (affiché)
  const isWebsiteSelected = (website: string) => {
    return selectedWebsites.includes(website);
  };

  // Initialiser selectedWebsites seulement la première fois que les jobs sont chargés
  useEffect(() => {
    if (jobs.length > 0 && !isInitialized) {
      setSelectedWebsites(Object.keys(allGroupedJobs));
      setIsInitialized(true);
    }
  }, [jobs, allGroupedJobs, isInitialized]);

  return {
    selectedWebsites,
    allGroupedJobs,
    groupedJobs,
    availableWebsites,
    getWebsiteDisplayName,
    handleWebsiteToggle,
    handleSelectAll,
    handleDeselectAll,
    isWebsiteSelected
  };
}; 