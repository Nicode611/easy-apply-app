import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { MapPin, LucideSearch } from "lucide-react";

interface SearchFormProps {
  jobQuery: string;
  setJobQuery: (query: string) => void;
  locationQuery: string;
  setLocationQuery: (query: string) => void;
  resultsWanted: number;
  setResultsWanted: (count: number) => void;
  onSearch: () => void;
}

export default function SearchForm({
  jobQuery,
  setJobQuery,
  locationQuery,
  setLocationQuery,
  resultsWanted,
  setResultsWanted,
  onSearch
}: SearchFormProps) {
  return (
    <section className="w-full min-w-[200px] flex flex-col px-10 mt-5 max-w-[700px]">
      <h3 className="text-lg ml-3 font-bold">Rechercher</h3>
      <div className="w-full flex flex-col items-center bg-primary backdrop-blur-lg min-w-[200px] px-5 md:px-0 pt-2 pb-5 rounded-lg shadow-lg relative overflow-hidden">
        <div className="w-[90%] flex flex-col items-center justify-center relative text-white z-10">
          <div className="relative w-full ">
            <label htmlFor="searchInput" className="text-xs">Métier</label>
            <Input
              type="search"
              id="searchInput"
              placeholder="Métier / Domaine"
              value={jobQuery}
              onChange={e => setJobQuery(e.currentTarget.value)}
              className="pl-10 bg-white/90 text-black w-full focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-1 top-1/2 -translate-y-[20%]"
            >
              <LucideSearch className="w-5 h-5 text-gray-800" />
            </Button>
          </div>
          <div className="flex flex-col md:flex-row items-end w-full justify-around gap-3 md:gap-5">
            <div className="relative w-full">
              <label htmlFor="locationInput" className="text-xs">Localisation</label>
              <Input
                type="search"
                id="locationInput"
                placeholder="Ville / Pays"
                value={locationQuery}
                onChange={e => setLocationQuery(e.currentTarget.value)}
                className="pl-10 bg-white/90 text-black"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-1 top-1/2 -translate-y-[20%]"
              >
                <MapPin className="w-5 h-5 text-gray-800" />
              </Button>
            </div>
            
            <div className="hidden md:flex flex-col relative w-32 md:w-40">
              <label htmlFor="resultsInput" className="text-xs w-full text-nowrap">Nombre d&apos;offres</label>
              <select
                id="resultsInput"
                value={resultsWanted}
                onChange={e => setResultsWanted(Number(e.target.value))}
                className="w-full h-[36px] pl-2 pr-3 bg-white/90 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-0"
              >
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={60}>60</option>
                <option value={100}>100</option>
              </select>
            </div>
            
            <button 
              onClick={onSearch} 
              className="hidden md:flex h-[36px] bg-secondary rounded-md items-center justify-center shadow-md hover:bg-secondary/80 hover:cursor-pointer transition-colors px-2 py-1"
            >
              <div className="flex gap-2 text-white">
                <LucideSearch className="w-5 h-5" />
                <span className="text-sm">Rechercher</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="w-full md:hidden flex flex-col gap-3">
        <div className="relative w-full">
          <label htmlFor="resultsInputMobile" className="text-xs">Nombre d&apos;offres</label>
          <select
            id="resultsInputMobile"
            value={resultsWanted}
            onChange={e => setResultsWanted(Number(e.target.value))}
            className="w-full h-[36px] pl-2 pr-3 bg-white/90 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-0"
          >
            <option value={30}>30 offres</option>
            <option value={50}>50 offres</option>
            <option value={60}>60 offres</option>
            <option value={100}>100 offres</option>
          </select>
        </div>
        <button 
          onClick={onSearch} 
          className="w-full h-[36px] text-sm flex items-center justify-center bg-secondary text-white py-2 rounded-md hover:bg-secondary/80 hover:cursor-pointer transition-colors shadow-lg"
        >
          <div className="flex gap-2 text-white">
            <LucideSearch className="w-5 h-5" />
            <span>Rechercher</span>
          </div>
        </button>
      </div>
    </section>
  );
} 