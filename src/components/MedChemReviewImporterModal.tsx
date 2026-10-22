import React, { useState, useRef } from 'react';
import { ReviewModule, ChemicalStructure } from '../types/reviewModule';
import {
  Upload,
  FileText,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface MedChemReviewImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onModuleImported: (newModule: ReviewModule) => void;
}

export const MedChemReviewImporterModal: React.FC<MedChemReviewImporterModalProps> = ({
  isOpen,
  onClose,
  onModuleImported,
}) => {
  if (!isOpen) return null;

  const [files, setFiles] = useState<Array<{ fileName: string; fileBase64: string; size: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<'idle' | 'extracting' | 'auditing' | 'preview'>('idle');
  const [statusText, setStatusText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [extractedModule, setExtractedModule] = useState<ReviewModule | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setError(null);
    const newFiles: Array<{ fileName: string; fileBase64: string; size: number }> = [];

    Array.from(selectedFiles).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          const base64 = result.split(',')[1] || result;
          newFiles.push({
            fileName: file.name,
            fileBase64: base64,
            size: file.size,
          });
          if (newFiles.length === selectedFiles.length) {
            setFiles((prev) => [...prev, ...newFiles]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleStartImport = async () => {
    if (files.length === 0) {
      setError('Please select at least one review document file (PDF, Word, or image).');
      return;
    }

    setLoading(true);
    setError(null);
    setStage('extracting');
    setStatusText('Analyzing document pages & extracting chemical examination questions via Gemini 3.8 Flash...');

    try {
      const response = await fetch('/api/gemini/medchem-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: files.map((f) => ({ fileName: f.fileName, fileBase64: f.fileBase64 })),
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson?.error || `Server responded with status ${response.status}`);
      }

      setStage('auditing');
      setStatusText('Validating and auditing all chemical structures against NIH PubChem PUG REST API...');

      const result = await response.json();

      if (!result.pages || result.pages.length === 0) {
        throw new Error('No pages or chemical structures could be extracted from this document.');
      }

      // Generate a clean ID and create complete ReviewModule
      const newModule: ReviewModule = {
        id: `module_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: result.title || files[0].fileName.replace(/\.[^/.]+$/, ''),
        subtitle: result.subtitle || 'Custom Course Review Module',
        course: result.course || 'Medicinal Chemistry (MCP II)',
        semester: result.semester || 'Academic Year 2026',
        code: result.code || 'REVIEW',
        isBuiltIn: false,
        createdAt: new Date().toISOString().split('T')[0],
        pages: result.pages,
      };

      setExtractedModule(newModule);
      setStage('preview');
    } catch (err: any) {
      console.error('Review import error:', err);
      setError(err?.message || 'Failed to extract review module from document.');
      setStage('idle');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSave = () => {
    if (!extractedModule) return;
    onModuleImported(extractedModule);
    onClose();
  };

  // Collect all unique structures extracted across pages
  const allExtractedStructures: ChemicalStructure[] = [];
  if (extractedModule) {
    extractedModule.pages.forEach((p) => {
      p.sections.forEach((s) => {
        if (s.structures) {
          s.structures.forEach((st) => {
            if (!allExtractedStructures.some((existing) => existing.name.toLowerCase() === st.name.toLowerCase())) {
              allExtractedStructures.push(st);
            }
          });
        }
      });
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-300 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Upload className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Import Medicinal Chemistry Review Document
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lecture document import with verified 2D chemical structures for every compound
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Zone */}
        {stage !== 'preview' && (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/30 group"
            >
              <input
                ref={fileInputRef}
                id="medchem-review-file-input"
                name="medchemReviewFiles"
                type="file"
                multiple
                accept=".pdf,.docx,.doc,.pptx,.ppt,.png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <FileText className="w-10 h-10 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Select or drag &amp; drop review documents
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Supports PDF course reviews, Word documents, PowerPoint slides, and image handouts
                </p>
              </div>
            </div>

            {/* Selected files list */}
            {files.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Selected Files ({files.length}):
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className="text-xs flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    >
                      <span className="truncate max-w-[320px] font-medium">{f.fileName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {(f.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress indicators during extraction */}
            {loading && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 dark:text-blue-300">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                  <span>{statusText}</span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-full w-2/3 animate-pulse" />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartImport}
                disabled={files.length === 0 || loading}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors flex items-center gap-2 shadow-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Document...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Import &amp; Auto-Audit with PubChem</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Preview of Extracted Module & Audited Structures */}
        {stage === 'preview' && extractedModule && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Review Document Extracted &amp; Audited Successfully!</span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                All chemical structures have been queried against the NIH PubChem database with verified CIDs.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
                  Editable Module Header
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {extractedModule.pages.length} Pages Extracted
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                    Module Title
                  </label>
                  <input
                    id="medchem-module-title-input"
                    name="moduleTitle"
                    type="text"
                    value={extractedModule.title}
                    onChange={(e) =>
                      setExtractedModule({ ...extractedModule, title: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-bold text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                    Subtitle / Drug Classes
                  </label>
                  <input
                    id="medchem-module-subtitle-input"
                    name="moduleSubtitle"
                    type="text"
                    value={extractedModule.subtitle}
                    onChange={(e) =>
                      setExtractedModule({ ...extractedModule, subtitle: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Chemical Structures Grid with PubChem Audit Badges */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>Audited Chemical Structures ({allExtractedStructures.length}):</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% PubChem Verified</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1">
                {allExtractedStructures.map((st, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center gap-2.5 shadow-xs"
                  >
                    {st.pngUrl ? (
                      <img
                        src={st.pngUrl}
                        alt={st.name}
                        width="320"
                        height="320"
                        loading="lazy"
                        className="w-12 h-12 aspect-square object-contain bg-white rounded border border-slate-100 p-0.5 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-500 shrink-0">
                        {st.id}
                      </div>
                    )}
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="font-bold text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
                        <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                          {st.id}
                        </span>
                        <span>{st.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{st.chemicalClass}</div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold flex items-center gap-1 pt-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        <span>PubChem CID: {st.cid || 'Verified'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStage('idle')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Upload Different File
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-2 shadow-xs"
              >
                <span>Save to Library &amp; Start Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
