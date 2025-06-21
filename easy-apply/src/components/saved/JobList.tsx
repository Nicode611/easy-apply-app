import JobCardFlat from "../card/JobCardFlat";
import { Job } from "@/types/job";

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSaveToggle: (job: Job) => void;
  onApplyToggle: (job: Job) => void;
}

export default function JobList({
  jobs,
  isLoading,
  searchQuery,
  setSearchQuery,
  onSaveToggle,
  onApplyToggle
}: JobListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin mx-auto"></div>
          <span className="text-primary">Chargement des emplois...</span>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center text-gray-500">
        {searchQuery.trim() ? (
          <div className="flex flex-col items-center gap-2">
            <p>Aucun emploi ne correspond à votre recherche.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-primary hover:text-primary/80 underline"
            >
              Effacer la recherche
            </button>
          </div>
        ) : (
          <p>Aucun emploi trouvé.</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {jobs.map((job) => (
        <JobCardFlat
          key={job.id}
          id={job.id}
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
          onSaveToggle={() => onSaveToggle(job)}
          onApplyToggle={() => onApplyToggle(job)}
        />
      ))}
    </div>
  );
} 