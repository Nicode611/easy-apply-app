import { useState, useEffect } from "react";
import { Job } from "@/types/job";
import { useJobs } from "@/hooks/useJobs";

export const useSavedJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showApplied, setShowApplied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { saveJob, unsaveJob, applyJob, unapplyJob } = useJobs();

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSaveToggle = async (job: Job) => {
    try {
      if (job.savedState === "Saved") {
        await unsaveJob(job.id);
        setJobs(jobs.map(j => 
          j.id === job.id 
            ? { ...j, savedState: null, savedDate: null }
            : j
        ));
      } else {
        await saveJob(job);
        setJobs(jobs.map(j => 
          j.id === job.id 
            ? { ...j, savedState: "Saved", savedDate: new Date().toISOString() }
            : j
        ));
      }
    } catch (error) {
      console.error("Error toggling save state:", error);
    }
  };

  const handleApplyToggle = async (job: Job) => {
    try {
      if (job.appliedState === "Applied") {
        await unapplyJob(job.id);
        setJobs(jobs.map(j => 
          j.id === job.id 
            ? { ...j, appliedState: null, appliedDate: null }
            : j
        ));
      } else {
        await applyJob(job);
        setJobs(jobs.map(j => 
          j.id === job.id 
            ? { ...j, appliedState: "Applied", appliedDate: new Date().toISOString() }
            : j
        ));
      }
    } catch (error) {
      console.error("Error toggling apply state:", error);
    }
  };

  // Fonction pour normaliser les accents
  const normalizeText = (text: string) => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .toLowerCase();
  };

  // Filtrer les jobs par statut (sauvegardés/postulés) et par recherche
  const filteredJobs = jobs.filter(job => {
    // Filtre par statut
    const statusMatch = showApplied 
      ? job.appliedState === "Applied"
      : job.savedState === "Saved";
    
    if (!statusMatch) return false;
    
    // Filtre par recherche
    if (!searchQuery.trim()) return true;
    
    const normalizedQuery = normalizeText(searchQuery);
    return (
      normalizeText(job.title || '').includes(normalizedQuery) ||
      normalizeText(job.companyName || '').includes(normalizedQuery) ||
      normalizeText(job.location || '').includes(normalizedQuery)
    );
  });

  return {
    jobs,
    isLoading,
    showApplied,
    setShowApplied,
    searchQuery,
    setSearchQuery,
    filteredJobs,
    handleSaveToggle,
    handleApplyToggle
  };
}; 