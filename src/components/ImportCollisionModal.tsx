import React, { useRef, useEffect } from 'react';
import { AlertTriangle, Copy, Replace, X } from 'lucide-react';
import { ImportCollision } from '../utils/jsonPortability';

interface ImportCollisionModalProps {
  isOpen: boolean;
  collisions: ImportCollision[];
  onResolve: (strategy: 'overwrite' | 'clone') => void;
  onCancel: () => void;
}

export const ImportCollisionModal: React.FC<ImportCollisionModalProps> = ({
  isOpen,
  collisions,
  onResolve,
  onCancel,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onCancel();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      if (dialog.open) {
        dialog.close();
      }
    };
  }, [isOpen, onCancel]);

  if (!isOpen || collisions.length === 0) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onCancel();
    }
  };

  const primaryCollision = collisions[0];

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      onClick={handleBackdropClick}
      className="m-auto p-4 bg-transparent outline-none max-w-full max-h-screen text-slate-800 dark:text-slate-100"
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-50/70 dark:bg-amber-950/30">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Duplicate Item Detected</span>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <p>
            An existing {primaryCollision.itemType === 'module' ? 'Review Module' : 'Study Profile'} named{' '}
            <strong className="text-slate-900 dark:text-slate-100">"{primaryCollision.existingTitle}"</strong>{' '}
            already exists in your library.
          </p>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Would you like to overwrite your existing version, or import this as an independent duplicate copy?
          </p>

          {/* Action options */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => onResolve('overwrite')}
              className="w-full p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/60 dark:hover:bg-rose-900/40 text-left transition-colors cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <Replace className="w-3.5 h-3.5" />
                  <span>Overwrite Existing</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Replace "{primaryCollision.existingTitle}" with the imported file.
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onResolve('clone')}
              className="w-full p-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/60 dark:hover:bg-blue-900/40 text-left transition-colors cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                  <Copy className="w-3.5 h-3.5" />
                  <span>Import as New Copy (Duplicate)</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Keep both items. The new version will be saved as "{primaryCollision.title} (Copy)".
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end bg-slate-50/50 dark:bg-slate-850/50">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
};
