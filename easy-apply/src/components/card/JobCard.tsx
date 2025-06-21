import Image from "next/image"
import { Calendar } from "lucide-react"
import { Circle } from "lucide-react"
import { Bookmark } from "lucide-react"
import { useJobs } from "@/hooks/useJobs"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface JobCardProps {
  url: string
  jobImage?: string
  jobTitle?: string
  jobLocation?: string
  companyLogo?: string
  companyName?: string
  jobWebsite?: string
  jobPostDate?: string
  appliedState?: string | null
  appliedDate?: string | null
  savedState?: string | null
  savedDate?: string | null
  onStatusChange?: () => void
}

export default function JobCard({
  url,
  jobImage,
  jobTitle,
  jobLocation,
  companyLogo,
  companyName,
  jobWebsite,
  jobPostDate,
  appliedState,
  appliedDate,
  savedState,
  savedDate,
  onStatusChange
}: JobCardProps) {
  const { saveJob, unsaveJob, applyJob, unapplyJob } = useJobs()
  const [isSaved, setIsSaved] = useState(savedState)
  const [isApplied, setIsApplied] = useState(appliedState)
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false)

  useEffect(() => {
    setIsSaved(savedState)
  }, [savedState])

  useEffect(() => {
    setIsApplied(appliedState)
  }, [appliedState])

  const handleSave = async () => {
    try {
      console.log('handleSave called, isSaved:', isSaved)
      if (isSaved === "Saved") {
        console.log('Attempting to unsave job:', url)
        await unsaveJob(url)
        console.log('Job unsaved successfully')
        setIsSaved("Not Saved")
        onStatusChange?.()
        toast.success("Emploi sauvegardé avec succès")
      } else {
        console.log('Attempting to save job:', url)
        await saveJob({
          id: url,
          url: url,
          image: jobImage || "",
          title: jobTitle || "",
          location: jobLocation || "",
          companyLogo: companyLogo || "",
          companyName: companyName || "",
          jobWebsite: jobWebsite || "",
          jobPostDate: jobPostDate || "",
          savedState: "Saved",
          savedDate: new Date().toISOString(),
          appliedState: appliedState || "",
          appliedDate: appliedDate || ""
        })
        console.log('Job saved successfully')
        setIsSaved("Saved")
        onStatusChange?.()
        savedState = "Saved"
        toast.success("Emploi sauvegardé avec succès")
      }
    } catch (error) {
      console.error('Error in handleSave:', error)
      if (error instanceof Error) {
        const errorData = JSON.parse(error.message)
        if (errorData.error === "Job already saved") {
          setIsSaved("Saved")
          toast.error("Cet emploi est déjà sauvegardé")
        } else {
          toast.error("Échec de la sauvegarde de l'emploi")
        }
      } else {
        toast.error("Échec de la sauvegarde de l'emploi")
      }
    }
  }

  const handleApply = async () => {
    try {
      if (isApplied === "Applied") {
        await unapplyJob(url)
        setIsApplied("Not Applied")
        onStatusChange?.()
        toast.success("Candidature retirée avec succès")
      } else {
        const jobData = {
          id: url,
          url: url,
          image: jobImage || "",
          title: jobTitle || "",
          location: jobLocation || "",
          companyLogo: companyLogo || "",
          companyName: companyName || "",
          jobWebsite: jobWebsite || "",
          jobPostDate: jobPostDate || "",
          savedState: savedState || "",
          savedDate: savedDate || "",
          appliedState: "Applied",
          appliedDate: new Date().toISOString(),
          notes: null
        }
        await applyJob(jobData)
        setIsApplied("Applied")
        onStatusChange?.()
        toast.success("Candidature envoyée avec succès")
      }
    } catch (error) {
      console.error('Error in handleApply:', error)
      if (error instanceof Error) {
        const errorData = JSON.parse(error.message)
        if (errorData.error === "Job already applied") {
          setIsApplied("Applied")
          toast.error("Vous avez déjà postulé à cet emploi")
        } else {
          toast.error("Échec de l'envoi de la candidature")
        }
      } else {
        toast.error("Échec de l'envoi de la candidature")
      }
    }
  }

  return (
    <div className="relative w-full h-full min-w-[280px] sm:min-w-[0px] md:min-h-[360px] lg:min-h-[0px] bg-white shadow-md rounded-lg overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-black to-transparent flex items-start justify-between p-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-full p-1 shadow-md">
              <Circle 
                className={`hover:cursor-pointer w-9 md:w-6 h-9 md:h-6 text-gray-200 ${
                  isApplied === "Applied" ? "fill-primary" : "fill-none hover:bg-primary "
                } transition-colors rounded-full`}
                onClick={handleApply}
              />
            </div>
            <div className="flex flex-col text-white md:text-xs">
              <span>{isApplied === "Applied" ? "Postulé" : "Postulé ?"}</span>
              {(isApplied === "Applied") && appliedDate && (
                <span>{new Date(appliedDate).toLocaleDateString()}</span>
              )}
            </div>
          </div>
          <Bookmark 
            className={`w-9 md:w-7 h-9 md:h-7  ${
              isSaved === "Saved" ? "fill-primary text-primary" : "text-white hover:text-primary hover:fill-primary"
            } transition-colors cursor-pointer`}
            onClick={handleSave}
          />
        </div>
      </div>
      {jobImage ? (
        <Image
          src={jobImage}
          alt={jobTitle || "Job Image"}
          width={300}
          height={200}
          className="w-full h-[45%] md-h-[40%] object-cover rounded-t-lg"
        />
      ) : (
        <div className="w-full h-[45%] md-h-[40%] rounded-t-lg bg-primary flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-white text-center font-medium">{jobTitle}</p>
          </div>
        </div>
      )}
      <div className="h-[55%] md-h-[60%] flex flex-col justify-between px-3 py-3 lg:px-2 lg:py-2">
        <div className="flex flex-col w-full gap-3 sm:gap-0">
          <div className="w-full flex items-center justify-between px-2 lg:px-0">
            <div className="flex items-center gap-1">
              <Image
                src={companyLogo || "/placeholder.png"}
                alt={companyName || "Company Logo"}
                width={50}
                height={50}
                className="w-10 h-10 object-cover"
                onError={(e) => {
                  // Fallback to a data URL if the image fails to load
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Crect width='50' height='50' fill='%23f3f4f6'/%3E%3Ctext x='25' y='25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='12' fill='%236b7280'%3E%3F%3C/text%3E%3C/svg%3E";
                }}
                onClick={() => {console.log(url,
                  jobImage,
                  jobTitle,
                  jobLocation,
                  companyLogo,
                  companyName,
                  jobWebsite,
                  jobPostDate,
                  appliedState,
                  appliedDate,
                  savedState,
                  savedDate,)}}
              />
              <span className="text-xs lg:text-[0.5rem] text-gray-700">{companyName}</span>
            </div>
            <span className="text-xs lg:text-[0.5rem] text-gray-400">{jobWebsite}</span>
          </div>
          <span className="w-full font-medium text-lg lg:text-sm p-2 lg:p-1 text-gray-700 line-clamp-2">{jobTitle}</span>
        </div>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-1">
            <Calendar className="w-6 h-6 lg:w-4 lg:h-4 text-black mr-2 md:mr-0" />
            <div className="flex flex-col items-start">
              <span className="text-xs md:text-[0.5rem] text-gray-400">{jobPostDate}</span>
              <span className="text-xs md:text-[0.5rem] text-gray-400 whitespace-nowrap truncate">{jobLocation}</span>
            </div>
          </div>
          <div className="flex items-center">
            <AlertDialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
              <AlertDialogTrigger asChild>
                <a href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => {
                  e.preventDefault();
                  window.open(url, '_blank');
                  setIsApplyDialogOpen(true);
                }}>
                  <button className="px-3 py-1 bg-primary text-white text-lg md:text-sm lg:text-xs rounded hover:bg-primary/80 hover:cursor-pointer transition-colors">
                    Postuler
                  </button>
                </a>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmer votre candidature</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir postuler à ce poste chez {companyName} ? 
                    Cette action sera enregistrée dans vos candidatures.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => {
                      handleApply();
                      setIsApplyDialogOpen(false);
                    }}
                    className="bg-primary hover:bg-primary/80"
                  >
                    Confirmer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  )
}
