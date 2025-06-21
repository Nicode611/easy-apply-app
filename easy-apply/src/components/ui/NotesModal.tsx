'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { X, Save, Trash2 } from 'lucide-react';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  companyName: string;
  initialNotes?: string | null;
  onSave: (notes: string) => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function NotesModal({
  isOpen,
  onClose,
  jobTitle,
  companyName,
  initialNotes,
  onSave,
  onDelete
}: NotesModalProps) {
  const [notes, setNotes] = useState(initialNotes || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mettre à jour les notes quand initialNotes change
  useEffect(() => {
    setNotes(initialNotes || '');
  }, [initialNotes]);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await onSave(notes);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!notes.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      await onDelete();
      setNotes('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-[9999] p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col" style={{ maxHeight: '80vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
            <p className="text-sm text-gray-600">{companyName}</p>
            <p className="text-xs text-gray-500 truncate">{jobTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Vos notes sur cette offre
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez vos notes, impressions, questions, etc..."
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Sauvegarder
            </Button>
            {notes.trim() && (
              <Button
                onClick={handleDelete}
                disabled={isLoading}
                variant="outline"
                className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </Button>
            )}
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            disabled={isLoading}
            className="cursor-pointer"
          >
            Annuler
          </Button>
        </div>
      </div>
    </div>
  );
} 