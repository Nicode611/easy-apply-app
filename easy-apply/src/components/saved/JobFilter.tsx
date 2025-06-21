import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LucideSearch } from "lucide-react";

interface JobFilterProps {
  showApplied: boolean;
  setShowApplied: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredJobsCount: number;
}

export default function JobFilter({
  showApplied,
  setShowApplied,
  searchQuery,
  setSearchQuery,
  filteredJobsCount
}: JobFilterProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-3xl font-bold">Mes Emplois</h3>
        <div className="flex items-center space-x-2">
          <Label htmlFor="show-applied">Sauvegardés</Label>
          <Switch
            id="show-applied"
            checked={showApplied}
            onCheckedChange={setShowApplied}
          />
          <Label htmlFor="show-applied">Postulés</Label>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <Input
            type="search"
            placeholder="Rechercher par titre, entreprise ou localisation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="flex ml-3 mb-3">
        <h3 className="text-lg font-bold">{showApplied ? "Emplois Postulés" : "Emplois Sauvegardés"}</h3>
        <div className="flex justify-center items-center w-7 h-7 bg-primary rounded-full ml-2">
          <span className="text-white">{filteredJobsCount}</span>
        </div>
      </div>
    </>
  );
} 