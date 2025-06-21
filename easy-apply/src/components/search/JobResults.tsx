import Image from "next/image";
import JobCard from "../card/JobCard";
import { Job } from "@/types/job";
import noJobs from "public/no_jobs_found.png";

interface JobResultsProps {
  jobs: Job[];
  groupedJobs: { [key: string]: Job[] };
  hasSearched: boolean;
  isLoading: boolean;
  loadingWebsites: { [key: string]: boolean };
  getWebsiteDisplayName: (website: string) => string;
  handleSelectAll: () => void;
}

export default function JobResults({
  jobs,
  groupedJobs,
  hasSearched,
  isLoading,
  loadingWebsites,
  getWebsiteDisplayName,
  handleSelectAll
}: JobResultsProps) {
  if (jobs.length === 0 && !hasSearched) {
    return (
      <div className="h-full flex items-center justify-center col-span-full text-center text-gray-500">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center border border-primary/20">
            <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700 mb-2">Prêt à chercher ?</p>
            <p className="text-gray-500">Veuillez saisir un type d&apos;emploi pour commencer votre recherche</p>
          </div>
        </div>
      </div>
    );
  }

  if (jobs.length === 0 && !isLoading) {
    return (
      <div className="h-full flex items-center justify-center col-span-full text-center text-gray-500">
        <Image 
          src={noJobs} 
          alt="Aucun emploi trouvé" 
          width={400} 
          height={400} 
        />
      </div>
    );
  }

  if (Object.keys(groupedJobs).length === 0 && !isLoading) {
    return (
      <div className="h-full flex items-center justify-center col-span-full text-center text-gray-500">
        <div className="flex flex-col items-center gap-2">
          <p>Aucun emploi ne correspond aux filtres sélectionnés.</p>
          <button
            onClick={handleSelectAll}
            className="cursor-pointer text-blue-600 hover:text-blue-800 underline"
          >
            Afficher tous les emplois
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-8">
      {/* Indicateur de chargement global si nécessaire */}
      {isLoading && (
        <div className="flex items-center justify-center py-6 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-lg border border-primary/10">
          <div className="flex items-center gap-3 text-primary">
            <div className="relative">
              <div className="h-6 w-6 border-2 border-primary/20 rounded-full"></div>
              <div className="absolute top-0 left-0 h-6 w-6 border-2 border-transparent border-t-primary rounded-full animate-spin"></div>
            </div>
            <span className="text-sm font-medium">Recherche en cours...</span>
          </div>
        </div>
      )}
      
      {Object.entries(groupedJobs).map(([website, websiteJobs]) => {
        const isWebsiteLoading = loadingWebsites[website] || false;
        
        return (
          <div key={website} className="space-y-4">
            {/* En-tête du site web */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span>{getWebsiteDisplayName(website)}</span>
                {isWebsiteLoading && (
                  <div className="relative">
                    <div className="h-4 w-4 border-2 border-primary/20 rounded-full"></div>
                    <div className="absolute top-0 left-0 h-4 w-4 border-2 border-transparent border-t-primary rounded-full animate-spin"></div>
                  </div>
                )}
                <span className="text-sm text-gray-500 bg-gradient-to-r from-primary/10 to-secondary/10 px-3 py-1 rounded-full border border-primary/20">
                  {isWebsiteLoading ? 'Chargement...' : `${websiteJobs.length} offre${websiteJobs.length > 1 ? 's' : ''}`}
                </span>
              </h4>
            </div>
            
            {/* Grille des jobs pour ce site */}
            {isWebsiteLoading ? (
              <div className="flex items-center justify-center py-12 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="h-12 w-12 border-3 border-primary/20 rounded-full"></div>
                    <div className="absolute top-0 left-0 h-12 w-12 border-3 border-transparent border-t-primary rounded-full animate-spin"></div>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-primary">Chargement des offres...</span>
                    <p className="text-xs text-gray-500 mt-1">Récupération des emplois depuis {getWebsiteDisplayName(website)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {websiteJobs.map((job, index) => (
                  <div key={index} className="animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <JobCard
                      url={job.url ?? ""}
                      jobImage={job.image}
                      jobTitle={job.title}
                      jobLocation={job.location}
                      companyLogo={job.companyLogo}
                      companyName={job.companyName}
                      jobWebsite={job.jobWebsite}
                      jobPostDate={job.jobPostDate}
                      appliedState={job.appliedState}
                      appliedDate={job.appliedDate}
                      savedState={job.savedState}
                      savedDate={job.savedDate}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
} 