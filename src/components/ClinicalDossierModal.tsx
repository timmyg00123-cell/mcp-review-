import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Tag,
  BookOpen,
  X,
  ExternalLink,
  AlertTriangle,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Info,
} from 'lucide-react';
import {
  ClinicalDossierRecord,
  fetchClinicalDossier,
} from '../services/clinicalDossierService';

export interface ClinicalDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  drugName: string;
  preloadedDossier?: ClinicalDossierRecord | null;
}

type TabType = 'fda' | 'rxnorm' | 'statpearls';

export const ClinicalDossierModal: React.FC<ClinicalDossierModalProps> = ({
  isOpen,
  onClose,
  drugName,
  preloadedDossier,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('fda');
  const [dossier, setDossier] = useState<ClinicalDossierRecord | null>(preloadedDossier || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadDossier = useCallback(
    async () => {
      if (!drugName) return;
      setLoading(true);
      setError(null);
      try {
        const result = await fetchClinicalDossier(drugName);
        setDossier(result);
      } catch (err: any) {
        console.error('Failed to fetch clinical dossier:', err);
        setError(err.message || 'Unable to retrieve clinical dossier. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [drugName]
  );

  useEffect(() => {
    if (!isOpen) return;

    if (preloadedDossier && preloadedDossier.genericName.toLowerCase() === drugName.toLowerCase()) {
      setDossier(preloadedDossier);
      setLoading(false);
      setError(null);
    } else {
      loadDossier();
    }
  }, [isOpen, drugName, preloadedDossier, loadDossier]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayName = dossier?.genericName || drugName || 'Unknown Compound';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clinical-dossier-title"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 my-auto overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                <FileText className="w-5 h-5" />
              </span>
              <h2
                id="clinical-dossier-title"
                className="font-bold text-xl text-slate-900 dark:text-slate-100 capitalize"
              >
                {displayName}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified Clinical Data from DailyMed / OpenFDA, RxNorm & StatPearls
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => loadDossier()}
              disabled={loading}
              title="Refresh dossier from live NIH / OpenFDA APIs"
              aria-label="Refresh dossier"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950/40 px-5 pt-2 gap-2 text-sm font-medium">
          <button
            onClick={() => setActiveTab('fda')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'fda'
                ? 'border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-300 bg-white dark:bg-slate-900 rounded-t-lg'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>DailyMed / FDA Label</span>
            {dossier?.dailyMed?.boxedWarning && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Boxed Warning Present" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('rxnorm')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'rxnorm'
                ? 'border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-300 bg-white dark:bg-slate-900 rounded-t-lg'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>RxNorm Nomenclature</span>
            {dossier?.rxNorm?.rxcui && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {dossier.rxNorm.rxcui}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('statpearls')}
            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'statpearls'
                ? 'border-teal-600 dark:border-teal-400 text-teal-700 dark:text-teal-300 bg-white dark:bg-slate-900 rounded-t-lg'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>StatPearls Clinical Review</span>
          </button>
        </div>

        {/* Modal Body / Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-4 py-8 animate-pulse">
              <div className="flex items-center justify-center gap-2 text-teal-600 dark:text-teal-400 font-medium text-sm">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Fetching verified dossier from OpenFDA, DailyMed & NLM APIs...</span>
              </div>
              <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl" />
              <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl" />
              <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            </div>
          )}

          {/* Error Banner */}
          {!loading && error && (
            <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span>Error Loading Dossier</span>
              </div>
              <p className="text-sm">{error}</p>
              <button
                onClick={() => loadDossier()}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Fetch</span>
              </button>
            </div>
          )}

          {/* Tab 1: DailyMed / OpenFDA Content */}
          {!loading && !error && activeTab === 'fda' && (
            <div className="space-y-6">
              {/* Boxed Warning Banner */}
              {dossier?.dailyMed?.boxedWarning ? (
                <div className="p-4 rounded-xl border-2 border-red-500/70 bg-red-50 dark:bg-red-950/40 text-red-950 dark:text-red-100 space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold uppercase tracking-wider text-xs">
                    <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                    <span>FDA Boxed Warning (Black Box Warning)</span>
                  </div>
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium bg-white/60 dark:bg-slate-900/60 p-3 rounded-lg border border-red-200 dark:border-red-900/40">
                    {dossier.dailyMed.boxedWarning}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 flex items-center gap-2.5 text-xs sm:text-sm">
                  <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>No boxed warning reported on current DailyMed / FDA SPL label.</span>
                </div>
              )}

              {/* Indications & Usage */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-teal-500 rounded-full" />
                  Indications & Clinical Usage
                </h3>
                {dossier?.dailyMed?.indications && dossier.dailyMed.indications.length > 0 ? (
                  <div className="space-y-2">
                    {dossier.dailyMed.indications.map((ind, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line"
                      >
                        {ind}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    No indications statement parsed from DailyMed for this record.
                  </p>
                )}
              </div>

              {/* Dosage Forms & Strengths */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-teal-500 rounded-full" />
                  Dosage Forms & Commercial Strengths
                </h3>
                {dossier?.dailyMed?.dosageForms && dossier.dailyMed.dosageForms.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {dossier.dailyMed.dosageForms.map((form, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-medium"
                      >
                        {form}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    No dosage forms reported on current label.
                  </p>
                )}
              </div>

              {/* External DailyMed SPL Search Link */}
              <div className="pt-2">
                <a
                  href={
                    dossier?.dailyMed?.splWebUrl ||
                    `https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=${encodeURIComponent(
                      drugName
                    )}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-semibold shadow-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Full SPL on DailyMed / NLM</span>
                </a>
              </div>
            </div>
          )}

          {/* Tab 2: RxNorm Content */}
          {!loading && !error && activeTab === 'rxnorm' && (
            <div className="space-y-6">
              {/* RxCUI Banner */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Official NLM Concept Unique Identifier (RxCUI)
                  </div>
                  <div className="text-xl font-mono font-bold text-teal-600 dark:text-teal-400 mt-1">
                    {dossier?.rxNorm?.rxcui || 'Not Assigned'}
                  </div>
                </div>
                {dossier?.rxNorm?.rxcui && (
                  <a
                    href={`https://mor.nlm.nih.gov/RxNav/search?searchBy=RXCUI&searchTerm=${dossier.rxNorm.rxcui}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>RxNav Portal</span>
                  </a>
                )}
              </div>

              {/* Trade / Brand Names */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-teal-500 rounded-full" />
                  Brand Names (Proprietary Nomenclature)
                </h3>
                {dossier?.rxNorm?.brandNames && dossier.rxNorm.brandNames.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {dossier.rxNorm.brandNames.map((brand, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs font-medium"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    No brand names cataloged in RxNorm for this concept.
                  </p>
                )}
              </div>

              {/* Synonyms */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-teal-500 rounded-full" />
                  Synonyms & Clinical Aliases
                </h3>
                {dossier?.rxNorm?.synonyms && dossier.rxNorm.synonyms.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {dossier.rxNorm.synonyms.map((syn, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    No synonyms recorded in RxNorm.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: StatPearls Content */}
          {!loading && !error && activeTab === 'statpearls' && (
            <div className="space-y-6">
              {dossier?.statPearls?.title ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
                    <div className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1">
                      NCBI Bookshelf · StatPearls Peer-Reviewed Chapter
                    </div>
                    <div className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {dossier.statPearls.title}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-amber-500 rounded-full" />
                      Clinical Summary & Pharmacology Overview
                    </h3>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {dossier.statPearls.summary || 'Summary text not extracted for this chapter.'}
                    </div>
                  </div>

                  {/* NCBI Bookshelf Prominent Link Button */}
                  <div className="pt-2">
                    <a
                      href={
                        dossier.statPearls.bookshelfUrl ||
                        `https://www.ncbi.nlm.nih.gov/books/?term=${encodeURIComponent(drugName)}+statpearls`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold shadow-md transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Open NCBI Bookshelf Peer-Reviewed Chapter</span>
                      <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                  <div className="p-3 w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mx-auto flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    No Direct StatPearls Chapter Matched
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    A specific StatPearls review monograph was not found in NCBI Bookshelf for{' '}
                    <span className="font-medium text-slate-700 dark:text-slate-300">{displayName}</span>. You can
                    search the entire NCBI Bookshelf library directly.
                  </p>
                  <a
                    href={`https://www.ncbi.nlm.nih.gov/books/?term=${encodeURIComponent(drugName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-sm transition-colors mt-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Search NCBI Bookshelf for &ldquo;{drugName}&rdquo;</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
          <div>
            {dossier?.lastUpdated ? (
              <span>
                Synced via IndexedDB Cache (Updated {new Date(dossier.lastUpdated).toLocaleDateString()})
              </span>
            ) : (
              <span>Live query mode</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
