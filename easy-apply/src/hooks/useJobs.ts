import { useState } from 'react'
import { Job } from '@/types/job'

export const useJobs = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveJob = async (jobData: Job) => {
    try {
      setIsLoading(true)
      setError(null)
      let response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: jobData.id,
          image: jobData.image,
          title: jobData.title,
          location: jobData.location,
          companyLogo: jobData.companyLogo,
          companyName: jobData.companyName,
          jobWebsite: jobData.jobWebsite,
          jobPostDate: jobData.jobPostDate,
          appliedState: jobData.appliedState,
          appliedDate: jobData.appliedDate,
          savedState: jobData.savedState,
          savedDate: jobData.savedDate,
          notes: jobData.notes
        })
      })

      if (response.status === 400) {
        response = await fetch(`/api/jobs/${encodeURIComponent(jobData.id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'save' })
        })
      }

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Échec de la sauvegarde de l\'emploi')
      }

      return await response.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const unsaveJob = async (jobId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/jobs/${encodeURIComponent(jobId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'unsave' }) // 👈 ici l'action est passée
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(JSON.stringify(data))
      }

      return await response.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const applyJob = async (jobData: Job) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const requestBody = {
        url: jobData.id,
        image: jobData.image || "",
        title: jobData.title,
        location: jobData.location,
        companyLogo: jobData.companyLogo || "",
        companyName: jobData.companyName,
        jobWebsite: jobData.jobWebsite,
        jobPostDate: jobData.jobPostDate,
        appliedState: "Applied",
        appliedDate: new Date().toISOString(),
        savedState: jobData.savedState || "Not Saved",
        notes: jobData.notes
      }
      
      let response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      if (response.status === 400) {
        response = await fetch(`/api/jobs/${encodeURIComponent(jobData.id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'apply' })
        })
      }

      if (!response.ok) {
        const data = await response.json()
        throw new Error(JSON.stringify(data))
      }

      return await response.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const unapplyJob = async (jobId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/jobs/${encodeURIComponent(jobId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unapply' })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(JSON.stringify(data))
      }

      return await response.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Fonctions pour gérer les notes
  const getJobNotes = async (jobId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/jobs/${encodeURIComponent(jobId)}/notes`)
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de la récupération des notes')
      }

      const data = await response.json()
      return data.notes
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateJobNotes = async (jobId: string, notes: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/jobs/${encodeURIComponent(jobId)}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de la mise à jour des notes')
      }

      return await response.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteJobNotes = async (jobId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/jobs/${encodeURIComponent(jobId)}/notes`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de la suppression des notes')
      }

      return await response.json()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur s\'est produite')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    saveJob,
    unsaveJob,
    applyJob,
    unapplyJob,
    getJobNotes,
    updateJobNotes,
    deleteJobNotes,
    isLoading,
    error
  }
} 