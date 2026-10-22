import React, { useState, useRef, useEffect } from 'react';
import { ReviewModule, ChemicalStructure, ExamModeStatus } from '../types/reviewModule';
import { DocumentQuestionItem } from './DocumentQuestionItem';
import { PubChemInspectorModal } from './PubChemInspectorModal';
import { processFileAndGenerateQuestions } from '../services/lectureIngestion';
import { verifyStructuresBatchPubChem } from '../services/pubchemService';
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
  Split,
  FileCode,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Eye,
  EyeOff,
  CheckSquare,
  Search,
  Award,
  Sliders,
  HelpCircle,
  FlaskConical,
} from 'lucide-react';

interface DocumentStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onModuleImported: (newModule: ReviewModule) => void;
}

export const DocumentStudioModal: React.FC<DocumentStudioModalProps> = ({
  isOpen,
  onClose,
  onModuleImported,
}) => {
  if (!isOpen) return null;

  // Active Tab: 'review' | 'source' | 'both' (side-by-side)
  const [activeTab, setActiveTab] = useState<'review' | 'source' | 'side-by-side'>('side-by-side');

  // Input 1: Review Document State
  const [reviewFiles, setReviewFiles] = useState<Array<{ fileName: string; size: number }>>([]);
  const [reviewFileList, setReviewFileList] = useState<File[]>([]);
  const [reviewText, setReviewText] = useState<string>('');
  const [reviewInputMode, setReviewInputMode] = useState<'file' | 'text'>('file');

  // Input 2: Authoritative Source Material State
  const [sourceFiles, setSourceFiles] = useState<Array<{ fileName: string; size: number }>>([]);
  const [sourceFileList, setSourceFileList] = useState<File[]>([]);
  const [sourceText, setSourceText] = useState<string>('');
  const [sourceInputMode, setSourceInputMode] = useState<'file' | 'text'>('file');

  // Processing state
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<'idle' | 'extracting' | 'grounding' | 'auditing' | 'preview'>('idle');
  const [statusText, setStatusText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [extractedModule, setExtractedModule] = useState<ReviewModule | null>(null);

  // Interactive Simulation Preview State
  const [previewPageIdx, setPreviewPageIdx] = useState<number>(0);
  const [simulationExamMode, setSimulationExamMode] = useState<ExamModeStatus>('off');
  const [openQuestionIds, setOpenQuestionIds] = useState<Record<number, boolean>>({});
  const [userMcAnswers, setUserMcAnswers] = useState<Record<number, number | null>>({});
  const [userTfAnswers, setUserTfAnswers] = useState<Record<number, Record<string, boolean>>>({});
  const [userMatchingAnswers, setUserMatchingAnswers] = useState<Record<number, Record<string, string[]>>>({});
  const [userRankingOrders, setUserRankingOrders] = useState<Record<number, string[]>>({});
  const [userRankingChecked, setUserRankingChecked] = useState<Record<number, boolean>>({});
  const [inspectedStructure, setInspectedStructure] = useState<ChemicalStructure | null>(null);
  const [isVerifyingBatch, setIsVerifyingBatch] = useState<boolean>(false);
  const [batchVerificationProgress, setBatchVerificationProgress] = useState<{
    completed: number;
    total: number;
    currentName?: string;
  } | null>(null);

  const reviewFileInputRef = useRef<HTMLInputElement>(null);
  const sourceFileInputRef = useRef<HTMLInputElement>(null);
  const activeAbortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      activeAbortControllerRef.current?.abort();
    };
  }, []);

  const handleCloseModal = () => {
    activeAbortControllerRef.current?.abort();
    onClose();
  };

  const handleReviewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = e.target.files ? Array.from(e.target.files) : [];
    if (rawFiles.length === 0) return;

    setError(null);
    setReviewFileList((prev) => [...prev, ...rawFiles]);
    setReviewFiles((prev) => [
      ...prev,
      ...rawFiles.map((file) => ({
        fileName: file.name,
        size: file.size,
      })),
    ]);
  };

  const handleSourceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = e.target.files ? Array.from(e.target.files) : [];
    if (rawFiles.length === 0) return;

    setError(null);
    setSourceFileList((prev) => [...prev, ...rawFiles]);
    setSourceFiles((prev) => [
      ...prev,
      ...rawFiles.map((file) => ({
        fileName: file.name,
        size: file.size,
      })),
    ]);
  };

  // Multi-page, multi-question sample preset
  const handleLoadSampleReview = () => {
    setReviewInputMode('text');
    setReviewText(`REVIEW FOR ANTIPLATELETS (EXAM ARCHETYPE)
Course: Medicinal Chemistry (MCP II)

Page 1: Consider Structures I, II, III, and IV Below
Structure I: Tirofiban (Aggrastat) - Peptidomimetic GP IIb/IIIa antagonist
Structure II: Ticagrelor (Brilinta) - Triazolopyrimidine P2Y12 antagonist
Structure III: Aspirin (Acetylsalicylic acid) - COX inhibitor
Structure IV: Prasugrel (Effient) - 3rd gen Thienopyridine P2Y12 inhibitor

Question 1: What is the chemical class of each of the above antiplatelets?
Question 2: What is the pharmacological mechanistic class of each of the above antiplatelets?
Question 3: Which of the above drugs is an irreversible antiplatelet?
Question 4: Which of the above drugs has an extended effect of platelet inhibition (5-10 days)?

Page 2: Consider Structures V, VI, and VII Below
Structure V: Clopidogrel (Plavix) - 2nd gen Thienopyridine P2Y12 inhibitor
Structure VI: Cangrelor (Kengreal) - Non-thienopyridine ATP analogue
Structure VII: Dipyridamole (Persantine) - Pyrimidopyrimidine phosphodiesterase inhibitor

Question 5: What is the chemical class of each of the above antiplatelets?
Question 6: Contrast the onset of action and reversibility of Cangrelor vs Clopidogrel.
Question 7: Consider the following statements regarding the above agents:
a. Clopidogrel requires CYP2C19 bioactivation to form its active thiol metabolite.
b. Cangrelor is administered orally with high oral bioavailability.
c. Dipyridamole inhibits adenosine deaminase and phosphodiesterase (PDE3/PDE5).`);
  };

  const handleLoadSampleSource = () => {
    setSourceInputMode('text');
    setSourceText(`AUTHORITATIVE REFERENCE MONOGRAPH & SAR DOSSIER
1. GP IIb/IIIa Antagonists:
- Tirofiban mimics the Arg-Gly-Asp (RGD) tripeptide sequence of fibrinogen. The basic piperidine amine mimics Arg, while the carboxylic acid mimics Asp. The butyl sulfonamide provides high affinity docking.
2. P2Y12 Antagonists:
- Thienopyridines (Ticlopidine, Clopidogrel, Prasugrel) are prodrugs requiring hepatic CYP oxidation of the thiophene ring to release an active thiol that forms a covalent disulfide bridge with Cys17/Cys270 on P2Y12.
- Prasugrel requires only 1 hepatic step (hCE2 ester hydrolysis followed by CYP3A4/CYP2B6).
- Ticagrelor is an active direct-acting cyclopentyltriazolopyrimidine (CPTP) that binds allosterically without bioactivation.
- Cangrelor is a stable ATP analogue administered IV with immediate onset (<2 min) and rapid recovery.
3. Aspirin:
- Irreversibly acetylates Ser529 in COX-1, permanently blocking arachidonic acid entry. Platelets lack nuclei and cannot resynthesize COX-1.`);
  };

  const handleStartImport = async () => {
    const hasReview = reviewFiles.length > 0 || reviewText.trim().length > 0;
    const hasSource = sourceFiles.length > 0 || sourceText.trim().length > 0;

    if (!hasReview && !hasSource) {
      setError('Please provide at least a Review Document (PDF, PPTX, JPG, PNG, or text) or Source Material.');
      return;
    }

    setLoading(true);
    setError(null);
    setStage('extracting');
    setStatusText('Initiating multimodal MedChem Knowledge Graph ingestion...');

    try {
      // 1. Determine primary File to process
      let targetFile: File | null = reviewFileList[0] || sourceFileList[0] || null;

      // If user typed/pasted text into Input 1 or Input 2, convert it into a File
      if (!targetFile && (reviewText.trim() || sourceText.trim())) {
        const combinedText = [
          reviewText.trim() ? `[REVIEW WORKSHEET QUESTIONS]:\n${reviewText.trim()}` : '',
          sourceText.trim() ? `[AUTHORITATIVE REFERENCE DOSSIER]:\n${sourceText.trim()}` : '',
        ]
          .filter(Boolean)
          .join('\n\n---\n\n');

        targetFile = new File([combinedText], 'Review_Worksheet_Notes.txt', {
          type: 'text/plain',
        });
      }

      if (!targetFile) {
        throw new Error('No valid document or text found to process.');
      }

      if (activeAbortControllerRef.current) {
        activeAbortControllerRef.current.abort();
      }
      const controller = new AbortController();
      activeAbortControllerRef.current = controller;

      // Throttle high-frequency progress updates via requestAnimationFrame to keep UI smooth and eliminate layout thrashing
      let pendingRaf: number | null = null;
      let latestMessage = `Parsing ${targetFile.name} and extracting drug structures...`;
      setStatusText(latestMessage);

      let result;
      try {
        // 2. Invoke the unified multimodal pipeline from lectureIngestion.ts
        result = await processFileAndGenerateQuestions(
          targetFile,
          (progress) => {
            latestMessage = progress.message;
            if (pendingRaf === null) {
              pendingRaf = requestAnimationFrame(() => {
                setStatusText(latestMessage);
                pendingRaf = null;
              });
            }
          },
          controller.signal
        );
      } finally {
        if (pendingRaf !== null) {
          cancelAnimationFrame(pendingRaf);
          pendingRaf = null;
        }
      }

      if (!result.reviewModule || !result.generatedQuestions || result.generatedQuestions.length === 0) {
        throw new Error('Knowledge graph processed, but no examination questions could be synthesized.');
      }

      // 3. Immediately write extracted questions directly into active review/quiz state
      onModuleImported(result.reviewModule);
      setExtractedModule(result.reviewModule);
      setPreviewPageIdx(0);

      // Open all questions on Page 1 by default
      const initialOpen: Record<number, boolean> = {};
      result.reviewModule.pages?.[0]?.sections?.forEach((sec: any) => {
        sec.questions?.forEach((q: any) => {
          initialOpen[q.id] = true;
        });
      });
      setOpenQuestionIds(initialOpen);

      setStage('preview');
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message?.includes('aborted') || activeAbortControllerRef.current?.signal.aborted) {
        console.log('[DocumentStudioModal] Ingestion successfully aborted by user');
        setStage('idle');
        setStatusText('');
        return;
      }
      console.error('Review import error:', err);
      setError(err?.message || 'Failed to extract review module from document.');
      setStage('idle');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLaunch = () => {
    if (extractedModule) {
      onModuleImported(extractedModule);
      onClose();
    }
  };

  // Batch verification with live state updates for chemical structures and verification percentage
  const handleBatchVerifyPubChem = async (moduleToVerify?: ReviewModule) => {
    const mod = moduleToVerify || extractedModule;
    if (!mod) return;

    // Collect all structures across all pages
    const rawStructures = mod.pages.flatMap((p) => p.sections.flatMap((s) => s.structures || [])).filter(Boolean);
    if (rawStructures.length === 0) return;

    setIsVerifyingBatch(true);
    setBatchVerificationProgress({ completed: 0, total: rawStructures.length });

    try {
      const verifiedResults = await verifyStructuresBatchPubChem(rawStructures, (completed, total, currentName) => {
        setBatchVerificationProgress({ completed, total, currentName });
      });

      let structCounter = 0;
      const updatedPages = mod.pages.map((page) => ({
        ...page,
        sections: page.sections.map((section) => ({
          ...section,
          structures: (section.structures || []).map((struct) => {
            const v = verifiedResults[structCounter++];
            if (!v || !v.cid) return struct;

            const pngUrl =
              v.structureImageDataUrl ||
              `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${v.cid}/PNG?image_size=large`;

            const mw = v.molecularWeight ?? struct.mw ?? struct.pubchemAudit?.molecularWeight;
            const logP = v.xlogp !== undefined ? v.xlogp : (struct.logP ?? struct.pubchemAudit?.xlogp);
            return {
              ...struct,
              cid: v.cid,
              pngUrl,
              mw,
              logP,
              pubchemAudit: {
                ...struct.pubchemAudit,
                cid: v.cid,
                status: 'verified' as const,
                canonicalSmiles: v.canonicalSmiles || struct.pubchemAudit?.canonicalSmiles,
                iupacName: v.iupacName || struct.pubchemAudit?.iupacName,
                molecularFormula: v.molecularFormula || struct.pubchemAudit?.molecularFormula,
                molecularWeight: mw,
                xlogp: logP,
                pubChemUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${v.cid}`,
              },
            };
          }),
        })),
      }));

      const updatedModule: ReviewModule = {
        ...mod,
        pages: updatedPages,
      };

      setExtractedModule(updatedModule);
      onModuleImported(updatedModule);
    } catch (batchErr) {
      console.warn('Batch verification warning:', batchErr);
    } finally {
      setIsVerifyingBatch(false);
      setBatchVerificationProgress(null);
    }
  };

  // Helper calculation for preview metrics
  const totalPages = extractedModule?.pages?.length || 0;
  const allExtractedQuestions = extractedModule
    ? extractedModule.pages.flatMap((p) => p.sections.flatMap((s) => s.questions || []))
    : [];
  const allExtractedStructures = extractedModule
    ? extractedModule.pages.flatMap((p) => p.sections.flatMap((s) => s.structures || [])).filter(Boolean)
    : [];
  
  // Unique structures map
  const uniqueStructuresMap = new Map<string, ChemicalStructure>();
  allExtractedStructures.forEach((s) => {
    if (s && s.id) uniqueStructuresMap.set(s.id, s);
    else if (s && s.name) uniqueStructuresMap.set(s.name, s);
  });
  const uniqueStructures = Array.from(uniqueStructuresMap.values());
  const verifiedCidCount = uniqueStructures.filter((s) => s.cid && s.cid > 0).length;
  const pubchemAuditPercent = uniqueStructures.length > 0
    ? Math.round((verifiedCidCount / uniqueStructures.length) * 100)
    : 100;

  // Active page data in preview
  const currentPreviewPage = extractedModule?.pages?.[previewPageIdx];
  const currentPageStructures = currentPreviewPage
    ? currentPreviewPage.sections.flatMap((s) => s.local_structures || s.structures || []).filter(Boolean)
    : [];
  const currentPageQuestions = currentPreviewPage
    ? currentPreviewPage.sections.flatMap((s) => s.questions || []).filter(Boolean)
    : [];

  const toggleQuestion = (qId: number) => {
    setOpenQuestionIds((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleExpandAllQuestions = () => {
    const next: Record<number, boolean> = { ...openQuestionIds };
    currentPageQuestions.forEach((q) => {
      next[q.id] = true;
    });
    setOpenQuestionIds(next);
  };

  const handleCollapseAllQuestions = () => {
    const next: Record<number, boolean> = { ...openQuestionIds };
    currentPageQuestions.forEach((q) => {
      next[q.id] = false;
    });
    setOpenQuestionIds(next);
  };

  const handleResetCurrentPageAnswers = () => {
    const qIds = currentPageQuestions.map((q) => q.id);
    setUserMcAnswers((prev) => {
      const copy = { ...prev };
      qIds.forEach((id) => delete copy[id]);
      return copy;
    });
    setUserTfAnswers((prev) => {
      const copy = { ...prev };
      qIds.forEach((id) => delete copy[id]);
      return copy;
    });
    setUserMatchingAnswers((prev) => {
      const copy = { ...prev };
      qIds.forEach((id) => delete copy[id]);
      return copy;
    });
    setUserRankingOrders((prev) => {
      const copy = { ...prev };
      qIds.forEach((id) => delete copy[id]);
      return copy;
    });
    setUserRankingChecked((prev) => {
      const copy = { ...prev };
      qIds.forEach((id) => delete copy[id]);
      return copy;
    });
  };

  const renderStructureCard = (structure: ChemicalStructure, sIdx: number) => {
    const imageSrc =
      structure.pngUrl ||
      (structure.cid
        ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${structure.cid}/PNG?image_size=large`
        : '');

    return (
      <div
        key={structure.id || sIdx}
        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-2.5"
      >
        <div>
          {/* Card Top: Roman Numeral & Generic Name */}
          <div className="flex items-start justify-between gap-1 mb-2">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                <span className="inline-block px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold font-mono text-xs">
                  Structure {structure.document_label || structure.id}
                </span>
                {structure.sourcePageNumbers && structure.sourcePageNumbers.length > 1 ? (
                  <span
                    className="inline-block px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] border border-indigo-200 dark:border-indigo-800"
                    title={`Referenced across slides: ${structure.sourcePageNumbers.join(', ')}`}
                  >
                    Slides {structure.sourcePageNumbers.join(', ')}
                  </span>
                ) : structure.sourcePageNumber ? (
                  <span className="text-[10px] text-slate-400 font-mono">
                    Slide {structure.sourcePageNumber}
                  </span>
                ) : null}
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {structure.name}
              </h4>
              {structure.tradeName && (
                <p className="text-[10px] text-slate-500 italic">
                  ({structure.tradeName})
                </p>
              )}
            </div>

            {structure.cid && structure.cid > 0 ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                <ShieldCheck className="w-3 h-3" />
                <span>CID {structure.cid}</span>
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-400">
                Unresolved CID
              </span>
            )}
          </div>

          {/* 2D Chemical Diagram Container */}
          <div className="w-full h-32 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-150 dark:border-slate-800 flex items-center justify-center p-2 relative group overflow-hidden">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={structure.name}
                width="320"
                height="320"
                loading="lazy"
                className="w-full h-full aspect-square object-contain filter dark:invert dark:contrast-125"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (structure.cid && !target.src.includes('/api/structure-image')) {
                    target.src = `/api/structure-image?cid=${structure.cid}`;
                  } else {
                    target.style.display = 'none';
                  }
                }}
              />
            ) : (
              <div className="text-center p-2">
                <FlaskConical className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400">No 2D Image</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setInspectedStructure(structure)}
              className="absolute bottom-1.5 right-1.5 p-1 rounded-md bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity border border-slate-200 dark:border-slate-700 shadow-xs text-[10px] flex items-center gap-1 cursor-pointer"
              title="Inspect PubChem Properties"
            >
              <Search className="w-3 h-3" />
              <span>Inspect</span>
            </button>
          </div>

          {/* Drug Details & Classes */}
          <div className="mt-2 space-y-1 text-[11px]">
            {structure.chemicalClass && (
              <div className="text-slate-700 dark:text-slate-300 font-medium">
                <span className="text-slate-400 font-normal">Class: </span>
                {structure.chemicalClass}
              </div>
            )}
            {structure.pharmacologicalClass && (
              <div className="text-slate-700 dark:text-slate-300 font-medium">
                <span className="text-slate-400 font-normal">Pharm: </span>
                {structure.pharmacologicalClass}
              </div>
            )}
            {structure.target && (
              <div className="text-slate-600 dark:text-slate-400 text-[10px]">
                <span className="text-slate-400 font-normal">Target: </span>
                {structure.target}
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
          <span className="text-slate-500 font-mono">
            {structure.reversibility || 'Reversible'} · {structure.route || 'Oral'}
          </span>
          {structure.cid && structure.cid > 0 && (
            <a
              href={`https://pubchem.ncbi.nlm.nih.gov/compound/${structure.cid}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              <span>NIH</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full ${
          stage === 'preview' ? 'max-w-6xl max-h-[94vh]' : 'max-w-4xl max-h-[92vh]'
        } bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Lecture Review &amp; Quiz Setup</span>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                  {stage === 'preview' ? 'Lecture Review & Quiz Setup' : 'Review & Reference'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {stage === 'preview'
                  ? 'Verify slides, chemical structures, and practice questions before saving'
                  : 'Provide review worksheets for questions and authoritative source material for grounded explanations'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Bar (Only in Ingestion mode) */}
        {stage !== 'preview' && (
          <div className="px-6 py-2 border-b border-slate-150 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/40 flex items-center justify-between">
            <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab('side-by-side')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'side-by-side'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Split className="w-3.5 h-3.5" />
                <span>Side-by-Side Studio</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('review')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'review'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Review Document</span>
                {reviewFiles.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                    {reviewFiles.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('source')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'source'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Source Material</span>
                {sourceFiles.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center">
                    {sourceFiles.length}
                  </span>
                )}
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadSampleReview}
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Load Sample Multi-Page Review
              </button>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <button
                type="button"
                onClick={handleLoadSampleSource}
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Load Sample Source Reference
              </button>
            </div>
          </div>
        )}

        {/* Studio Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* FULL INTERACTIVE SIMULATION PREVIEW STAGE                      */}
          {/* ============================================================== */}
          {stage === 'preview' && extractedModule && currentPreviewPage && (
            <div className="space-y-6 animate-fadeIn">
              {/* Top Quality & Verification Metrics Bar */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950/30 dark:via-slate-850 dark:to-blue-950/30 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                        {extractedModule.title}
                      </h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                        Verification Ready
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {extractedModule.subtitle} · {extractedModule.course} ({extractedModule.semester})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStage('idle')}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Back to Documents</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmLaunch}
                      className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Start Practice Quiz</span>
                    </button>
                  </div>
                </div>

                {/* Metrics Badges Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Layers className="w-3 h-3 text-blue-500" />
                      <span>Slides Loaded</span>
                    </div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                      {totalPages} {totalPages === 1 ? 'Slide' : 'Slides'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <CheckSquare className="w-3 h-3 text-indigo-500" />
                      <span>Practice Questions</span>
                    </div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                      {allExtractedQuestions.length} Total Questions
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <FlaskConical className="w-3 h-3 text-emerald-500" />
                      <span>Drug Structures</span>
                    </div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                      {uniqueStructures.length} Compounds ({uniqueStructures.map((s) => s.document_label || s.id).slice(0, 3).join(', ')}...)
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-teal-500" />
                        <span>Structure Images Loaded</span>
                      </div>
                      {isVerifyingBatch && (
                        <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                      )}
                    </div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={pubchemAuditPercent >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                          {pubchemAuditPercent}% Loaded
                        </span>
                        <span className="text-[10px] font-normal text-slate-400">
                          ({verifiedCidCount}/{uniqueStructures.length})
                        </span>
                      </div>
                      {pubchemAuditPercent < 100 && (
                        <button
                          type="button"
                          onClick={() => handleBatchVerifyPubChem()}
                          disabled={isVerifyingBatch}
                          className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          title="Query PubChem for unresolved structures with automated fallbacks"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>{isVerifyingBatch ? 'Verifying...' : 'Re-verify'}</span>
                        </button>
                      )}
                    </div>
                    {isVerifyingBatch && batchVerificationProgress && (
                      <div className="mt-1 text-[10px] text-blue-600 dark:text-blue-400 font-mono truncate">
                        [{batchVerificationProgress.completed}/{batchVerificationProgress.total}] {batchVerificationProgress.currentName || 'Processing...'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Strict 1-to-1 Page Navigation Toolbar */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 shrink-0">
                    Document Pages:
                  </span>
                  {extractedModule.pages.map((p, pIdx) => {
                    const isSelected = pIdx === previewPageIdx;
                    const pageQCount = p.sections.reduce((acc, s) => acc + (s.questions?.length || 0), 0);
                    const pageSCount = p.sections.reduce((acc, s) => acc + (s.structures?.length || 0), 0);
                    return (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          setPreviewPageIdx(pIdx);
                          const initial: Record<number, boolean> = {};
                          p.sections.forEach((sec) => {
                            sec.questions?.forEach((q) => {
                              initial[q.id] = true;
                            });
                          });
                          setOpenQuestionIds(initial);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-250 dark:border-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>Page {p.pageNumber}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                            isSelected
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {pageQCount}Q · {pageSCount}S
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                  <button
                    type="button"
                    disabled={previewPageIdx === 0}
                    onClick={() => setPreviewPageIdx((prev) => Math.max(0, prev - 1))}
                    className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono font-semibold px-2 text-slate-600 dark:text-slate-400">
                    {previewPageIdx + 1} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={previewPageIdx === totalPages - 1}
                    onClick={() => setPreviewPageIdx((prev) => Math.min(totalPages - 1, prev + 1))}
                    className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active Page Title & Note */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {currentPreviewPage.pageTitle || `Page ${currentPreviewPage.pageNumber}`}
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    {currentPageQuestions.length} Questions · {currentPreviewPage.sections.length} Question Block{currentPreviewPage.sections.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {currentPreviewPage.subtitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {currentPreviewPage.subtitle}
                  </p>
                )}
              </div>

              {/* ========================================================== */}
              {/* INTERACTIVE QUESTIONS SIMULATION PLAYGROUND CONTROLS       */}
              {/* ========================================================== */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-indigo-600 text-white shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span>Practice Questions</span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {currentPageQuestions.length} Questions
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Work through questions, test True/False sub-statements, check matching choices, and review answer explanations
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Simulation Mode Switch */}
                  <div className="flex items-center p-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setSimulationExamMode('off')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                        simulationExamMode === 'off'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                      title="Instant feedback as you select answers"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Interactive Test</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimulationExamMode('submitted')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                        simulationExamMode === 'submitted'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                      title="Reveal all answer keys and medicinal chemistry rationales immediately"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Reveal Solutions</span>
                    </button>
                  </div>

                  {/* Expand / Collapse All */}
                  <button
                    type="button"
                    onClick={handleExpandAllQuestions}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Expand All
                  </button>
                  <button
                    type="button"
                    onClick={handleCollapseAllQuestions}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Collapse All
                  </button>
                  <button
                    type="button"
                    onClick={handleResetCurrentPageAnswers}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-pointer"
                    title="Reset my simulated answers on this page"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ========================================================== */}
              {/* SCOPED QUESTION BLOCKS (SECTIONS)                           */}
              {/* ========================================================== */}
              {currentPageQuestions.length === 0 && currentPageStructures.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700">
                  <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    No questions extracted for this page.
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Check your input document or click "Back to Documents" to re-process.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {currentPreviewPage.sections.map((section, secIdx) => {
                    const blockStructures = section.local_structures || section.structures || [];
                    const blockQuestions = section.questions || [];
                    const blockInstructions = section.block_instructions || section.headerNote;

                    return (
                      <div
                        key={secIdx}
                        className="rounded-2xl border border-slate-250 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-5 shadow-2xs space-y-5"
                      >
                        {/* Block Header & Instructions */}
                        <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold font-mono uppercase tracking-wide bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                {section.sectionTitle || `Question Block ${secIdx + 1}`}
                              </span>
                              <span className="text-xs text-slate-500">
                                {blockQuestions.length} Questions · {blockStructures.length} Structures
                              </span>
                            </div>
                          </div>

                          {blockInstructions && (
                            <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/60 text-xs sm:text-sm font-serif italic text-slate-800 dark:text-slate-200 flex items-start gap-2.5">
                              <span className="font-sans font-bold uppercase tracking-wider text-[10px] bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-100 px-1.5 py-0.5 rounded shrink-0 not-italic">
                                Instructions
                              </span>
                              <span className="leading-relaxed">{blockInstructions}</span>
                            </div>
                          )}
                        </div>

                        {/* Chemical Structures Showcase for this Block */}
                        {blockStructures.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-600" />
                                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                                  {section.sectionTitle ? `${section.sectionTitle} Chemical Structures` : `Block ${secIdx + 1} Structures`} ({blockStructures.length} Compound{blockStructures.length !== 1 ? 's' : ''})
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500">
                                Block-Isolated Chemical Structures
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                              {blockStructures.map((structure, sIdx) =>
                                renderStructureCard(structure, sIdx)
                              )}
                            </div>
                          </div>
                        )}

                        {/* Block Questions List */}
                        {blockQuestions.length > 0 ? (
                          <div className="space-y-4 pt-1">
                            {blockQuestions.map((q) => (
                              <DocumentQuestionItem
                                key={q.id}
                                question={q}
                                isOpen={openQuestionIds[q.id] ?? true}
                                onToggle={() => toggleQuestion(q.id)}
                                examModeStatus={simulationExamMode}
                                allSectionStructures={blockStructures}
                                allModuleStructures={blockStructures}
                                onInspectStructure={(str) => setInspectedStructure(str)}
                                mcSelection={userMcAnswers[q.id]}
                                onMcSelect={(optIdx) =>
                                  setUserMcAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                                }
                                tfAnswers={userTfAnswers[q.id]}
                                onTfSelect={(nextTf) =>
                                  setUserTfAnswers((prev) => ({ ...prev, [q.id]: nextTf }))
                                }
                                matchingPlacements={userMatchingAnswers[q.id]}
                                onMatchingChange={(nextMatch) =>
                                  setUserMatchingAnswers((prev) => ({ ...prev, [q.id]: nextMatch }))
                                }
                                rankingOrder={userRankingOrders[q.id]}
                                onRankingChange={(nextOrder) =>
                                  setUserRankingOrders((prev) => ({ ...prev, [q.id]: nextOrder }))
                                }
                                rankingChecked={userRankingChecked[q.id]}
                                onRankingCheck={(checked) =>
                                  setUserRankingChecked((prev) => ({ ...prev, [q.id]: checked }))
                                }
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center rounded-lg bg-slate-100 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-400">
                            No questions in this block.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* ACTIVE INGESTION INPUT STAGE                                   */}
          {/* ============================================================== */}
          {stage !== 'preview' && (
            <div
              className={
                activeTab === 'side-by-side'
                  ? 'grid grid-cols-1 lg:grid-cols-2 gap-6'
                  : 'space-y-6'
              }
            >
              {/* INPUT 1: REVIEW DOCUMENT (THE BLUEPRINT) */}
              {(activeTab === 'side-by-side' || activeTab === 'review') && (
                <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-950 dark:text-blue-100">
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>Input 1: Review Document / Exam</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Defines the questions, matching choices, and page structure
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setReviewInputMode('file')}
                        className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                          reviewInputMode === 'file'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        PDF File
                      </button>
                      <button
                        type="button"
                        onClick={() => setReviewInputMode('text')}
                        className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                          reviewInputMode === 'text'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Paste Text
                      </button>
                    </div>
                  </div>

                  {reviewInputMode === 'file' ? (
                    <div>
                      <input
                        id="review-document-file-input"
                        name="reviewDocumentFile"
                        type="file"
                        ref={reviewFileInputRef}
                        onChange={handleReviewFileChange}
                        multiple
                        accept=".pdf,.pptx,.jpg,.jpeg,.png,image/jpeg,image/png"
                        className="hidden"
                      />
                      <div
                        onClick={() => reviewFileInputRef.current?.click()}
                        className="border-2 border-dashed border-blue-300 dark:border-blue-800/80 hover:border-blue-500 rounded-xl p-5 text-center cursor-pointer transition-colors bg-white/60 dark:bg-slate-800/60"
                      >
                        <Upload className="w-6 h-6 text-blue-500 mx-auto mb-1.5" />
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Upload Review PDF, Slides, or Structure Image
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Supports PDFs, PowerPoint (.pptx), images (JPG/PNG), or text notes
                        </p>
                      </div>

                      {reviewFiles.length > 0 && (
                        <div className="mt-2.5 space-y-1.5">
                          {reviewFiles.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {file.fileName}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ({(file.size / 1024).toFixed(0)} KB)
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setReviewFiles((prev) => prev.filter((_, i) => i !== idx));
                                  setReviewFileList((prev) => prev.filter((_, i) => i !== idx));
                                }}
                                className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <textarea
                        id="review-document-text-input"
                        name="reviewDocumentText"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Paste review worksheet questions, structure numbers (I, II, III, IV), and multiple-choice options here..."
                        className="w-full h-40 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-blue-500 resize-none text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* INPUT 2: SOURCE MATERIAL (KNOWLEDGE GROUNDING) */}
              {(activeTab === 'side-by-side' || activeTab === 'source') && (
                <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 dark:text-emerald-100">
                        <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Input 2: Authoritative Source Material</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Grounds answers, mechanisms of action, and SAR takeaways
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setSourceInputMode('file')}
                        className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                          sourceInputMode === 'file'
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        File
                      </button>
                      <button
                        type="button"
                        onClick={() => setSourceInputMode('text')}
                        className={`px-2 py-0.5 rounded font-semibold cursor-pointer ${
                          sourceInputMode === 'text'
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Paste Text
                      </button>
                    </div>
                  </div>

                  {sourceInputMode === 'file' ? (
                    <div>
                      <input
                        id="source-document-file-input"
                        name="sourceDocumentFile"
                        type="file"
                        ref={sourceFileInputRef}
                        onChange={handleSourceFileChange}
                        multiple
                        accept=".pdf,.pptx,.jpg,.jpeg,.png,image/jpeg,image/png"
                        className="hidden"
                      />
                      <div
                        onClick={() => sourceFileInputRef.current?.click()}
                        className="border-2 border-dashed border-emerald-300 dark:border-emerald-800/80 hover:border-emerald-500 rounded-xl p-5 text-center cursor-pointer transition-colors bg-white/60 dark:bg-slate-800/60"
                      >
                        <Upload className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Upload Source PDF, Slides, or Diagram
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Drug monographs, clinical pharmacology slides, or guideline dossiers
                        </p>
                      </div>

                      {sourceFiles.length > 0 && (
                        <div className="mt-2.5 space-y-1.5">
                          {sourceFiles.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {file.fileName}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ({(file.size / 1024).toFixed(0)} KB)
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSourceFiles((prev) => prev.filter((_, i) => i !== idx));
                                  setSourceFileList((prev) => prev.filter((_, i) => i !== idx));
                                }}
                                className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <textarea
                        id="source-document-text-input"
                        name="sourceDocumentText"
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                        placeholder="Paste textbook pharmacology excerpts, receptor binding constants, and structure-activity relationships (SAR) for reference..."
                        className="w-full h-40 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-emerald-500 resize-none text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Processing Status Indicator */}
          {loading && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-blue-950 dark:text-blue-100">
                  Processing Multi-Page Ingestion Pipeline
                </div>
                <div className="text-[11px] text-blue-700 dark:text-blue-300">
                  {statusText}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-150 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {stage === 'preview'
              ? `${totalPages} Pages Mirrored · ${allExtractedQuestions.length} Questions Verified`
              : `${reviewFiles.length} review file(s) · ${sourceFiles.length} source file(s)`}
          </div>

          <div className="flex items-center gap-2">
            {stage === 'preview' ? (
              <>
                <button
                  type="button"
                  onClick={() => setStage('idle')}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-150 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Back to Documents</span>
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLaunch}
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Start Practice Quiz</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-150 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {loading ? 'Cancel Extraction' : 'Cancel'}
                </button>
                <button
                  type="button"
                  disabled={
                    loading ||
                    (reviewFiles.length === 0 &&
                      !reviewText.trim() &&
                      sourceFiles.length === 0 &&
                      !sourceText.trim())
                  }
                  onClick={handleStartImport}
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Start Practice Quiz</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Structure Lightbox / PubChem Inspector Modal */}
      {inspectedStructure && (
        <PubChemInspectorModal
          initialStructure={inspectedStructure}
          isOpen={Boolean(inspectedStructure)}
          onClose={() => setInspectedStructure(null)}
        />
      )}
    </div>
  );
};

export const DualSourceIngestionStudio = DocumentStudioModal;
export default DocumentStudioModal;
