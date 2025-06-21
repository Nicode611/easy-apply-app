import { useJobSearch } from "@/hooks/useJobSearch";
import { useJobFilter } from "@/hooks/useJobFilter";
import SearchForm from "../search/SearchForm";
import WebsiteFilter from "../search/WebsiteFilter";
import JobResults from "../search/JobResults";

export default function FindJob() {
  const {
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
  } = useJobSearch();

  const {
    selectedWebsites,
    allGroupedJobs,
    groupedJobs,
    availableWebsites,
    getWebsiteDisplayName,
    handleWebsiteToggle,
    handleSelectAll,
    handleDeselectAll,
    isWebsiteSelected
  } = useJobFilter(jobs);

  return (
    <div className="w-full h-full flex flex-col items-center overflow-y-auto px-3 pb-5 md:px-10">
      <SearchForm
        jobQuery={jobQuery}
        setJobQuery={setJobQuery}
        locationQuery={locationQuery}
        setLocationQuery={setLocationQuery}
        resultsWanted={resultsWanted}
        setResultsWanted={setResultsWanted}
        onSearch={fetchJobs}
      />
      
      <section className="mt-5 flex flex-col w-full h-full px-6 pb-6 overflow-y-auto bg-[#e6e4fe61] backdrop-blur-lg rounded-lg shadow-lg border-[1px] border-primary/10">
        {/* Interface de tri par site web */}
        {jobs.length > 0 && (
          <WebsiteFilter
            availableWebsites={availableWebsites}
            selectedWebsites={selectedWebsites}
            allGroupedJobs={allGroupedJobs}
            loadingWebsites={loadingWebsites}
            resultsWanted={resultsWanted}
            getWebsiteDisplayName={getWebsiteDisplayName}
            handleWebsiteToggle={handleWebsiteToggle}
            handleSelectAll={handleSelectAll}
            handleDeselectAll={handleDeselectAll}
            isWebsiteSelected={isWebsiteSelected}
          />
        )}
        
        <JobResults
          jobs={jobs}
          groupedJobs={groupedJobs}
          hasSearched={hasSearched}
          isLoading={isLoading}
          loadingWebsites={loadingWebsites}
          getWebsiteDisplayName={getWebsiteDisplayName}
          handleSelectAll={handleSelectAll}
        />
      </section>
    </div>
  );
}
