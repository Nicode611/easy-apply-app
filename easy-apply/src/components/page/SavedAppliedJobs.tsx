import { useSavedJobs } from "@/hooks/useSavedJobs";
import JobFilter from "../saved/JobFilter";
import JobList from "../saved/JobList";

export default function SavedAppliedJobs() {
  const {
    isLoading,
    showApplied,
    setShowApplied,
    searchQuery,
    setSearchQuery,
    filteredJobs,
    handleSaveToggle,
    handleApplyToggle
  } = useSavedJobs();

  return (
    <div className="h-full w-full flex flex-col items-center">
      <section className="w-full min-w-[200px] flex flex-col px-10 mt-5 max-w-[1200px]">
        <JobFilter
          showApplied={showApplied}
          setShowApplied={setShowApplied}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredJobsCount={filteredJobs.length}
        />

        <JobList
          jobs={filteredJobs}
          isLoading={isLoading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSaveToggle={handleSaveToggle}
          onApplyToggle={handleApplyToggle}
        />
      </section>
    </div>
  );
} 