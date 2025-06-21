'use client';

import { useState, useEffect } from "react";
import { formatDistanceToNow, isValid } from "date-fns";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BookmarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon, CheckCircleIcon as CheckCircleSolidIcon } from "@heroicons/react/24/solid";
import { StickyNoteIcon } from "lucide-react";
import Image from "next/image";
import NotesModal from "@/components/ui/NotesModal";
import { useJobs } from "@/hooks/useJobs";

interface JobCardFlatProps {
  id?: string;
  url?: string;
  jobImage?: string;
  jobTitle?: string;
  jobLocation?: string;
  companyLogo?: string;
  companyName?: string;
  jobWebsite?: string;
  jobPostDate?: string;
  appliedState?: string | null;
  appliedDate?: string | null;
  savedState?: string | null;
  savedDate?: string | null;
  onSaveToggle?: () => void;
  onApplyToggle?: () => void;
}

export default function JobCardFlat({
  id,
  url = "#",
  jobTitle = "Untitled Position",
  jobLocation = "Location not specified",
  companyLogo,
  companyName = "Company",
  jobPostDate,
  appliedState,
  savedState,
  onSaveToggle,
  onApplyToggle,
}: JobCardFlatProps) {
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  
  const { getJobNotes, updateJobNotes, deleteJobNotes } = useJobs();

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : null;
  };

  const formattedDate = formatDate(jobPostDate);

  // Charger les notes au montage du composant
  useEffect(() => {
    if (id) {
      loadNotes();
    }
  }, [id]);

  const loadNotes = async () => {
    if (!id) return;
    
    try {
      setIsLoadingNotes(true);
      const notesData = await getJobNotes(id);
      setNotes(notesData);
    } catch (error) {
      console.error('Erreur lors du chargement des notes:', error);
    } finally {
      setIsLoadingNotes(false);
    }
  };

  const handleSaveNotes = async (newNotes: string) => {
    if (!id) return;
    
    try {
      await updateJobNotes(id, newNotes);
      setNotes(newNotes || null);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteNotes = async () => {
    if (!id) return;
    
    try {
      await deleteJobNotes(id);
      setNotes(null);
    } catch (error) {
      throw error;
    }
  };

  const truncateNotes = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      <div className="w-full bg-white rounded-lg border border-gray-200 hover:border-primary transition-all duration-200 p-4">
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          <div className="flex items-center justify-center w-16 h-16 flex-shrink-0 self-center">
            {companyLogo ? (
              <Image
                src={companyLogo}
                alt={`${companyName} logo`}
                width={64}
                height={64}
                className="object-contain rounded"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-400 text-xs">{companyName[0]}</span>
              </div>
            )}
          </div>

          {/* Job Details */}
          <div className="flex-grow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 hover:text-primary">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {jobTitle}
                  </a>
                </h3>
                <p className="text-gray-600 text-sm mt-1">{companyName}</p>
                <p className="text-gray-500 text-sm mt-1">{jobLocation}</p>
                
                {/* Notes Preview */}
                {notes && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <StickyNoteIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-blue-800 font-medium mb-1">Vos notes :</p>
                        <p className="text-xs text-blue-700">{truncateNotes(notes)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <Badge 
                    variant={savedState === "Saved" ? "outline" : "secondary"}
                    className={`flex items-center gap-1 cursor-pointer hover:bg-gray-100 ${savedState === "Saved" ? "border-primary text-primary" : ""}`}
                    onClick={onSaveToggle}
                  >
                    {savedState === "Saved" ? (
                      <BookmarkSolidIcon className="w-4 h-4" />
                    ) : (
                      <BookmarkIcon className="w-4 h-4" />
                    )}
                    {savedState === "Saved" ? "Enregistré" : "Enregistrer"}
                  </Badge>
                  <Badge 
                    variant={appliedState === "Applied" ? "success" : "secondary"}
                    className="flex items-center gap-1 cursor-pointer hover:bg-gray-100"
                    onClick={onApplyToggle}
                  >
                    {appliedState === "Applied" ? (
                      <CheckCircleSolidIcon className="w-4 h-4" />
                    ) : (
                      <CheckCircleIcon className="w-4 h-4" />
                    )}
                    {appliedState === "Applied" ? "Postulé" : "Postulé ?"}
                  </Badge>
                </div>
                {formattedDate && (
                  <span className="text-xs text-gray-500">
                    {formattedDate}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Voir l&apos;offre
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsNotesModalOpen(true)}
                className="flex items-center gap-2"
                disabled={isLoadingNotes}
              >
                <StickyNoteIcon className="w-4 h-4" />
                {notes ? "Modifier les notes" : "Ajouter des notes"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      <NotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        jobId={id || ""}
        jobTitle={jobTitle}
        companyName={companyName}
        initialNotes={notes}
        onSave={handleSaveNotes}
        onDelete={handleDeleteNotes}
      />
    </>
  );
} 