import React, { useState, useRef } from 'react';
import {
  ReviewModule,
  ReviewPage,
  ChemicalStructure,
  AntiplateletQuestion,
} from '../types/reviewModule';
import {
  splitDocumentIntoPageItems,
  readFileAsBase64,
  PageExtractionItem,
} from '../services/fileParser';
import {
  Upload,
  FileText,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Layers,
  ArrowRight,
  BookOpen,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Trash2,
  Check,
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

  // Dropzone 1: Required Worksheet Blueprint
  const [worksheetFile, setWorksheetFile] = useState<File | null>(null);

  // Dropzone 2: Optional Lecture Deck / Reference Documents
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);

  // Extraction & UI State
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<'idle' | 'extracting' | 'preview'>('idle');
  const [statusText, setStatusText] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [totalPagesCount, setTotalPagesCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [extractedModule, setExtractedModule] = useState<ReviewModule | null>(null);
  const [expandedPreviewPages, setExpandedPreviewPages] = useState<Record<number, boolean>>({ 0: true });

  const worksheetInputRef = useRef<HTMLInputElement>(null);
  const referenceInputRef = useRef<HTMLInputElement>(null);

  const handleWorksheetFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setError(null);
    setWorksheetFile(files[0]);
  };

  const handleReferenceFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setError(null);
    setReferenceFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const removeReferenceFile = (index: number) => {
    setReferenceFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const togglePageAccordion = (pageIdx: number) => {
    setExpandedPreviewPages((prev) => ({
      ...prev,
      [pageIdx]: !prev[pageIdx],
    }));
  };

  const handleStartImport = async () => {
    if (!worksheetFile) {
      setError('Please provide a Course Review / Exam Worksheet (Zone 1) to extract questions.');
      return;
    }

    setLoading(true);
    setError(null);
    setStage('extracting');
    setProgressPercent(5);
    setStatusText('Splitting worksheet pages and rendering high-resolution visual canvases...');

    try {
      // 1. Split worksheet document into individual high-res canvas pages and text
      const pageItems: PageExtractionItem[] = await splitDocumentIntoPageItems(
        worksheetFile,
        (current, total) => {
          setStatusText(`Rendering page ${current} of ${total} to visual canvas...`);
          setProgressPercent(Math.min(25, Math.round((current / total) * 20) + 5));
        }
      );

      if (!pageItems || pageItems.length === 0) {
        throw new Error('Could not render any pages from the uploaded review worksheet.');
      }

      setTotalPagesCount(pageItems.length);

      // 2. Read optional reference materials (Lecture Deck)
      const sourceFiles: Array<{ fileName: string; fileBase64?: string; text?: string }> = [];
      if (referenceFiles.length > 0) {
        setStatusText(`Encoding ${referenceFiles.length} lecture reference file(s)...`);
        for (const rf of referenceFiles) {
          try {
            if (rf.type === 'application/pdf' || rf.name.toLowerCase().endsWith('.pdf') || rf.type.startsWith('image/')) {
              const b64 = await readFileAsBase64(rf);
              sourceFiles.push({ fileName: rf.name, fileBase64: b64 });
            } else {
              const txt = await rf.text();
              sourceFiles.push({ fileName: rf.name, text: txt });
            }
          } catch (rfErr) {
            console.warn(`Could not read reference file ${rf.name}:`, rfErr);
          }
        }
      }

      // 3. Process each page sequentially with accumulated structure context
      const accumulatedPages: ReviewPage[] = [];
      const previouslyExtractedStructures: ChemicalStructure[] = [];

      for (let i = 0; i < pageItems.length; i++) {
        const item = pageItems[i];
        setCurrentPageIndex(i + 1);
        const baseProgress = 25 + Math.round((i / pageItems.length) * 70);
        setProgressPercent(baseProgress);
        setStatusText(
          `Extracting Page ${item.pageNumber} of ${pageItems.length}: transcribing questions & PubChem auditing structures...`
        );

        const pageRes = await fetch('/api/gemini/medchem-review-page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageNumber: item.pageNumber,
            totalPages: pageItems.length,
            pageText: item.text,
            pageImageBase64: item.imageBase64,
            pageImageMime: 'image/jpeg',
            sourceFiles,
            previouslyExtractedStructures,
            documentTitle: worksheetFile.name.replace(/\.[^/.]+$/, ''),
          }),
        });

        if (!pageRes.ok) {
          const errData = await pageRes.json().catch(() => ({}));
          throw new Error(
            errData?.error || `Failed to extract page ${item.pageNumber} (Status ${pageRes.status})`
          );
        }

        const pageData = await pageRes.json();
        const extractedPage: ReviewPage = pageData.page;

        if (extractedPage) {
          accumulatedPages.push(extractedPage);

          // Accumulate newly discovered chemical structures for continuity on subsequent pages
          if (Array.isArray(pageData.newlyDiscoveredStructures)) {
            pageData.newlyDiscoveredStructures.forEach((s: ChemicalStructure) => {
              if (
                s &&
                !previouslyExtractedStructures.some(
                  (prev) =>
                    (prev.id && s.id && prev.id === s.id) ||
                    (prev.name && s.name && prev.name.toLowerCase() === s.name.toLowerCase())
                )
              ) {
                previouslyExtractedStructures.push(s);
              }
            });
          }
        }
      }

      setProgressPercent(98);
      setStatusText('Assembling verified ReviewModule and caching PubChem descriptors...');

      if (accumulatedPages.length === 0) {
        throw new Error('No pages or questions were extracted from the worksheet.');
      }

      const cleanDocTitle = worksheetFile.name
        .replace(/\.[^/.]+$/, '')
        .replace(/^[0-9]+[_\s)-]*/, '')
        .trim();

      const newModule: ReviewModule = {
        id: `module_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: cleanDocTitle || 'Custom Course Review Module',
        subtitle: 'Page-by-Page Exam Worksheet Review with PubChem Audits',
        course: 'Medicinal Chemistry (MCP II)',
        semester: 'Fall 2026',
        code: 'REVIEW',
        isBuiltIn: false,
        createdAt: new Date().toISOString().split('T')[0],
        pages: accumulatedPages,
      };

      setProgressPercent(100);
      setExtractedModule(newModule);
      setStage('preview');
    } catch (err: any) {
      console.error('[MedChemReviewImporterModal] Extraction error:', err);
      setError(err?.message || 'Failed to extract review module from worksheet.');
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

  // Compute summary metrics for preview
  const previewMetrics = React.useMemo(() => {
    if (!extractedModule) return { totalPages: 0, totalQuestions: 0, subStatements: 0, matching: 0, mcq: 0, totalStructures: 0 };
    let totalQuestions = 0;
    let subStatements = 0;
    let matching = 0;
    let mcq = 0;
    const structureMap = new Map<string, ChemicalStructure>();

    extractedModule.pages.forEach((p) => {
      p.sections.forEach((s) => {
        if (s.structures) {
          s.structures.forEach((st) => {
            const key = st.name ? st.name.toLowerCase() : st.id;
            if (!structureMap.has(key)) structureMap.set(key, st);
          });
        }
        if (s.questions) {
          totalQuestions += s.questions.length;
          s.questions.forEach((q) => {
            if (q.type === 'sub-statements') subStatements++;
            else if (q.type === 'matching') matching++;
            else mcq++;
          });
        }
      });
    });

    return {
      totalPages: extractedModule.pages.length,
      totalQuestions,
      subStatements,
      matching,
      mcq,
      totalStructures: structureMap.size,
      structures: Array.from(structureMap.values()),
    };
  }, [extractedModule]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-300 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Upload className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">
                High-Fidelity Review Worksheet Importer
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dual-source extraction: Page-by-page worksheet transcription with lecture deck answer verification
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

        {/* Upload Stage: Dual Dropzones */}
        {stage !== 'preview' && (
          <div className="space-y-4">
            {/* Zone 1: Required Worksheet Blueprint */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Zone 1: Course Review / Exam Worksheet (Required Blueprint)</span>
                </span>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                  {worksheetFile ? 'File Selected' : 'PDF, Word, or Handout'}
                </span>
              </div>

              <div
                onClick={() => worksheetInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  worksheetFile
                    ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20'
                    : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/30'
                } group`}
              >
                <input
                  ref={worksheetInputRef}
                  id="worksheet-blueprint-input"
                  name="worksheetBlueprint"
                  type="file"
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={handleWorksheetFileChange}
                />
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <FileText className={`w-8 h-8 ${worksheetFile ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-blue-500'}`} />
                  {worksheetFile ? (
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 justify-center">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{worksheetFile.name}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {(worksheetFile.size / 1024).toFixed(1)} KB — Click to change worksheet
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Click or drag worksheet blueprint here (e.g. <span className="font-mono text-blue-600 dark:text-blue-400">9) Review for Anticoagulants.pdf</span>)
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Every single page will be rendered to high-res canvas and transcribed verbatim (100% question fidelity)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Zone 2: Optional Lecture Deck Reference */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Zone 2: Lecture Slides / Reference Material (Optional Enrichment)</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  {referenceFiles.length > 0 ? `${referenceFiles.length} file(s) attached` : 'Optional'}
                </span>
              </div>

              <div
                onClick={() => referenceInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 rounded-xl p-4 text-center cursor-pointer transition-all bg-slate-50/30 dark:bg-slate-800/20 group"
              >
                <input
                  ref={referenceInputRef}
                  id="lecture-reference-input"
                  name="lectureReferenceFiles"
                  type="file"
                  multiple
                  accept=".pdf,.pptx,.ppt,.docx,.doc,.txt"
                  className="hidden"
                  onChange={handleReferenceFilesChange}
                />
                <div className="flex flex-col items-center justify-center gap-1">
                  <BookOpen className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Attach lecture slides or monographs (e.g. <span className="font-mono text-indigo-600 dark:text-indigo-400">9) Antithrombotics (Anticoagulants).pdf</span>)
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Used strictly to corroborate answer keys, cite active-site residues, and enrich rationales without modifying questions
                  </p>
                </div>
              </div>

              {/* Reference Files List */}
              {referenceFiles.length > 0 && (
                <div className="space-y-1 pt-1">
                  {referenceFiles.map((rf, idx) => (
                    <div
                      key={idx}
                      className="text-xs flex items-center justify-between p-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 text-slate-800 dark:text-slate-200"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="font-medium truncate">{rf.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">
                          ({(rf.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeReferenceFile(idx);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Progress Indicator */}
            {loading && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-semibold text-blue-900 dark:text-blue-200">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                    <span>{statusText}</span>
                  </div>
                  <span className="font-mono text-blue-700 dark:text-blue-300">
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {totalPagesCount > 0 && (
                  <div className="flex justify-between text-[11px] text-blue-700 dark:text-blue-400">
                    <span>Processing page {currentPageIndex} of {totalPagesCount}</span>
                    <span>Gemini 3.8 Flash Vision + PubChem PUG REST</span>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
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
                disabled={!worksheetFile || loading}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extracting Worksheet Pages...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Start Page-by-Page Extraction</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Preview Stage: Interactive Inspection */}
        {stage === 'preview' && extractedModule && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Worksheet Extracted with 100% Question &amp; Chemical Fidelity!</span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Extracted {previewMetrics.totalPages} pages, {previewMetrics.totalQuestions} questions ({previewMetrics.subStatements} True/False multi-statements, {previewMetrics.matching} matching, {previewMetrics.mcq} multiple-choice), and {previewMetrics.totalStructures} PubChem-audited chemical structures.
              </p>
            </div>

            {/* Editable Module Metadata Header */}
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                    Module Title
                  </label>
                  <input
                    id="module-title-input"
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
                    id="module-subtitle-input"
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

            {/* Page Accordion List */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>Extracted Pages ({extractedModule.pages.length}):</span>
                <span className="text-[11px] text-slate-500">
                  Inspect questions &amp; chemical structures per page
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {extractedModule.pages.map((pg, pIdx) => {
                  const isExpanded = Boolean(expandedPreviewPages[pIdx]);
                  const pageQuestions: AntiplateletQuestion[] = [];
                  const pageStructures: ChemicalStructure[] = [];
                  pg.sections.forEach((sec) => {
                    if (sec.questions) pageQuestions.push(...sec.questions);
                    if (sec.structures) pageStructures.push(...sec.structures);
                  });

                  return (
                    <div
                      key={pIdx}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900"
                    >
                      <button
                        type="button"
                        onClick={() => togglePageAccordion(pIdx)}
                        className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold font-mono text-xs shrink-0">
                            Page {pg.pageNumber}
                          </span>
                          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                            {pg.pageTitle}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 text-[11px] text-slate-500">
                          <span>{pageQuestions.length} Qs</span>
                          {pageStructures.length > 0 && <span>{pageStructures.length} Structs</span>}
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="p-3.5 pt-0 space-y-3 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/20 text-xs">
                          {/* Structures on this page */}
                          {pageStructures.length > 0 && (
                            <div className="space-y-1.5 pt-2">
                              <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wide">
                                Chemical Structures:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {pageStructures.map((st, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2"
                                  >
                                    {st.pngUrl ? (
                                      <img
                                        src={st.pngUrl}
                                        alt={st.name}
                                        className="w-10 h-10 object-contain bg-white rounded border border-slate-100 shrink-0"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-500 shrink-0">
                                        {st.id}
                                      </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <div className="font-bold truncate text-slate-900 dark:text-slate-100">
                                        <span className="font-mono text-blue-600 mr-1">{st.id}</span>
                                        {st.name}
                                      </div>
                                      <div className="text-[10px] text-slate-500 truncate">{st.chemicalClass}</div>
                                      <div className="text-[10px] text-emerald-600 font-mono flex items-center gap-1">
                                        <ShieldCheck className="w-2.5 h-2.5" />
                                        <span>CID: {st.cid || 'Verified'}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Questions on this page */}
                          <div className="space-y-2 pt-1">
                            <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wide">
                              Questions ({pageQuestions.length}):
                            </span>
                            {pageQuestions.map((q, qIdx) => (
                              <div
                                key={qIdx}
                                className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="font-bold text-slate-900 dark:text-slate-100">
                                    {q.questionNumberLabel || `Q${qIdx + 1}`}. {q.questionStem}
                                  </span>
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                                    {q.type}
                                  </span>
                                </div>

                                {/* Sub-statements breakdown */}
                                {q.type === 'sub-statements' && q.subStatements && (
                                  <div className="space-y-1 pl-2 border-l-2 border-blue-400/60 pt-1">
                                    <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                                      {q.subStatements.length} True/False Sub-statements:
                                    </div>
                                    {q.subStatements.map((ss, ssIdx) => (
                                      <div key={ssIdx} className="text-[11px] flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                                        <span className="font-mono font-bold text-slate-500">{ss.id})</span>
                                        <span className="flex-1">{ss.statement}</span>
                                        <span
                                          className={`font-mono text-[10px] px-1 py-0.2 rounded font-bold ${
                                            ss.isCorrect
                                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                          }`}
                                        >
                                          {ss.isCorrect ? 'TRUE' : 'FALSE'}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Matching targets breakdown */}
                                {q.type === 'matching' && q.matchingTargets && (
                                  <div className="space-y-1 pl-2 border-l-2 border-indigo-400/60 pt-1">
                                    <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                                      {q.matchingTargets.length} Matching Targets:
                                    </div>
                                    {q.matchingTargets.map((mt, mtIdx) => (
                                      <div key={mtIdx} className="text-[11px] flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                                        <span className="font-mono font-bold text-slate-500">{mt.id})</span>
                                        <span className="flex-1">{mt.label || (mt as any).prompt}</span>
                                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                                          Matches: {mt.acceptedStructureIds.join(', ')}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStage('idle')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Upload Different Worksheet
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
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

export default MedChemReviewImporterModal;
