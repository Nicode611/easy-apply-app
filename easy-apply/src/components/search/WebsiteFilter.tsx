import { Job } from "@/types/job";

interface WebsiteFilterProps {
  availableWebsites: string[];
  selectedWebsites: string[];
  allGroupedJobs: { [key: string]: Job[] };
  loadingWebsites: { [key: string]: boolean };
  resultsWanted: number;
  getWebsiteDisplayName: (website: string) => string;
  handleWebsiteToggle: (website: string) => void;
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
  isWebsiteSelected: (website: string) => boolean;
}

export default function WebsiteFilter({
  availableWebsites,
  selectedWebsites,
  allGroupedJobs,
  loadingWebsites,
  resultsWanted,
  getWebsiteDisplayName,
  handleWebsiteToggle,
  handleSelectAll,
  handleDeselectAll,
  isWebsiteSelected
}: WebsiteFilterProps) {
  return (
    <div className="w-full mt-6">
      <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h4 className="text-lg font-semibold text-gray-800">Filtrer par site web</h4>
            <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {resultsWanted} offres demandées par site
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Tout sélectionner
            </button>
            <button
              onClick={handleDeselectAll}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Tout désélectionner
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {availableWebsites.map(website => {
            const isSelected = isWebsiteSelected(website);
            const jobCount = allGroupedJobs[website]?.length || 0;
            const isWebsiteLoading = loadingWebsites[website] || false;
            const checkboxId = `website-${website.replace(/[^a-zA-Z0-9]/g, '-')}`;
            
            return (
              <label
                key={website}
                htmlFor={checkboxId}
                className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <input
                  id={checkboxId}
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleWebsiteToggle(website)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  disabled={isWebsiteLoading}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
                    {getWebsiteDisplayName(website)}
                    {isWebsiteLoading && (
                      <div className="relative">
                        <div className="h-3 w-3 border-2 border-primary/20 rounded-full"></div>
                        <div className="absolute top-0 left-0 h-3 w-3 border-2 border-transparent border-t-primary rounded-full animate-spin"></div>
                      </div>
                    )}
                  </span>
                  <span className="text-xs text-gray-500">
                    {isWebsiteLoading ? 'Chargement...' : `${jobCount} offre${jobCount > 1 ? 's' : ''}`}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
        
        {selectedWebsites.length === 0 ? (
          <div className="mt-3 text-sm text-gray-600">
            Aucun site sélectionné - aucun emploi affiché
          </div>
        ) : (
          <div className="mt-3 text-sm text-gray-600">
            Affichage de {selectedWebsites.length} site{selectedWebsites.length > 1 ? 's' : ''} sur {availableWebsites.length}
          </div>
        )}
      </div>
    </div>
  );
} 