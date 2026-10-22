import React, { useState, useEffect } from 'react';
import {
  ReviewModule,
  AntiplateletQuestion,
  ChemicalStructure,
} from '../types/reviewModule';
import {
  X,
  Save,
  Plus,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  ShieldCheck,
  Check,
  Edit3,
  BookOpen,
  FlaskConical,
  RotateCcw,
  Sparkles,
  Sliders,
  Wand2,
  Undo2,
  ListOrdered,
  HelpCircle,
  AlertCircle,
  Loader2,
  Split,
  Layers,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';
import {
  RationaleDepth,
  RATIONALE_DEPTH_PRESETS,
  applyDepthPresetToQuestions,
  recalibrateRationalesWithAI,
  generateAlternativeQuestionsAPI,
} from '../utils/rationaleDepthUtils';

interface ModuleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: ReviewModule;
  initialQuestionId?: number | null;
  onSaveModule: (updated: ReviewModule) => void;
  onDeleteModule?: (moduleId: string) => void;
  onResetBuiltIn?: (moduleId: string) => void;
}

type EditorTab = 'metadata' | 'questions' | 'structures';

export const ModuleEditorModal: React.FC<ModuleEditorModalProps> = ({
  isOpen,
  onClose,
  module: initialModule,
  initialQuestionId = null,
  onSaveModule,
  onDeleteModule,
  onResetBuiltIn,
}) => {
  const [draft, setDraft] = useState<ReviewModule>(() =>
    JSON.parse(JSON.stringify(initialModule))
  );
  const [activeTab, setActiveTab] = useState<EditorTab>('questions');
  const [selectedPageIdx, setSelectedPageIdx] = useState<number>(0);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [auditingStructureId, setAuditingStructureId] = useState<string | null>(null);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);

  // Rationale Depth Presets: 'short' | 'medium' | 'long'
  const [rationaleDepth, setRationaleDepth] = useState<RationaleDepth>('medium');
  const [isAdjustingDepth, setIsAdjustingDepth] = useState<boolean>(false);

  // Generative Quiz Mode State
  const [isGenerativeQuizOpen, setIsGenerativeQuizOpen] = useState<boolean>(false);
  const [generativeScope, setGenerativeScope] = useState<'page' | 'all'>('page');
  const [generativeCompetencies, setGenerativeCompetencies] = useState<{
    ranking: boolean;
    classifying: boolean;
    matching: boolean;
    subStatements: boolean;
  }>({
    ranking: true,
    classifying: true,
    matching: true,
    subStatements: true,
  });
  const [generativeCount, setGenerativeCount] = useState<number>(4);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [generativeStatus, setGenerativeStatus] = useState<string>('');
  const [undoSnapshot, setUndoSnapshot] = useState<ReviewModule | null>(null);
  const [generativeError, setGenerativeError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const cloned: ReviewModule = JSON.parse(JSON.stringify(initialModule));
      setDraft(cloned);

      if (initialQuestionId) {
        setActiveTab('questions');
        setSelectedQuestionId(initialQuestionId);
        // Find page containing initialQuestionId
        cloned.pages.forEach((p, pIdx) => {
          p.sections.forEach((sec) => {
            if (sec.questions.some((q) => q.id === initialQuestionId)) {
              setSelectedPageIdx(pIdx);
            }
          });
        });
      } else {
        setSelectedPageIdx(0);
        const firstQ = cloned.pages?.[0]?.sections?.[0]?.questions?.[0];
        setSelectedQuestionId(firstQ ? firstQ.id : null);
      }
    }
  }, [isOpen, initialModule, initialQuestionId]);

  if (!isOpen) return null;

  const currentPage = draft.pages[selectedPageIdx] || draft.pages[0];

  // Collect all questions on current page
  const pageQuestions: { sectionIdx: number; qIdx: number; question: AntiplateletQuestion }[] = [];
  if (currentPage) {
    currentPage.sections.forEach((sec, sIdx) => {
      sec.questions.forEach((q, qIdx) => {
        pageQuestions.push({ sectionIdx: sIdx, qIdx, question: q });
      });
    });
  }

  const activeQuestionEntry =
    pageQuestions.find((entry) => entry.question.id === selectedQuestionId) ||
    pageQuestions[0];

  // Update active question helper
  const updateActiveQuestion = (updater: (q: AntiplateletQuestion) => AntiplateletQuestion) => {
    if (!activeQuestionEntry) return;
    setDraft((prev) => {
      const next: ReviewModule = JSON.parse(JSON.stringify(prev));
      const sec = next.pages[selectedPageIdx]?.sections[activeQuestionEntry.sectionIdx];
      if (sec && sec.questions[activeQuestionEntry.qIdx]) {
        sec.questions[activeQuestionEntry.qIdx] = updater(
          sec.questions[activeQuestionEntry.qIdx]
        );
      }
      return next;
    });
  };

  // Add a new question to the current page
  const handleAddQuestion = () => {
    const maxId = draft.pages.reduce((max, p) => {
      p.sections.forEach((s) =>
        s.questions.forEach((q) => {
          if (q.id > max) max = q.id;
        })
      );
      return max;
    }, 0);
    const newId = maxId + 1;
    const newQuestion: AntiplateletQuestion = {
      id: newId,
      questionNumberLabel: `Question ${newId}`,
      category: 'SAR & Mechanism',
      questionStem: 'New medicinal chemistry review question stem:',
      type: 'multiple-choice',
      options: [
        'A. Option A description',
        'B. Option B description',
        'C. Option C description',
        'D. Option D description',
      ],
      correctIndex: 0,
      optionExplanations: [
        'Correct rationale for Option A.',
        'Distractor rationale for Option B.',
        'Distractor rationale for Option C.',
        'Distractor rationale for Option D.',
      ],
      overallExplanation: 'Detailed SAR and mechanistic explanation for this question.',
      highYieldPearl: 'Key high-yield exam takeaway.',
      sourceReference: `${draft.title} (Custom Added)`,
    };

    setDraft((prev) => {
      const next: ReviewModule = JSON.parse(JSON.stringify(prev));
      if (!next.pages[selectedPageIdx].sections.length) {
        next.pages[selectedPageIdx].sections.push({ questions: [] });
      }
      next.pages[selectedPageIdx].sections[0].questions.push(newQuestion);
      return next;
    });
    setSelectedQuestionId(newId);
  };

  // Delete currently selected question
  const handleDeleteQuestion = (qId: number) => {
    setDraft((prev) => {
      const next: ReviewModule = JSON.parse(JSON.stringify(prev));
      next.pages[selectedPageIdx].sections.forEach((sec) => {
        sec.questions = sec.questions.filter((q) => q.id !== qId);
      });
      return next;
    });
    setSelectedQuestionId(null);
  };

  // Apply rationale depth preset (Short, Medium, Long)
  const handleApplyDepthPreset = (targetDepth: RationaleDepth, scope: 'page' | 'all' = 'page') => {
    setRationaleDepth(targetDepth);
    setDraft((prev) => {
      const next: ReviewModule = JSON.parse(JSON.stringify(prev));
      if (scope === 'all') {
        next.pages.forEach((p) => {
          p.sections.forEach((sec) => {
            sec.questions = applyDepthPresetToQuestions(sec.questions, targetDepth);
          });
        });
      } else {
        const p = next.pages[selectedPageIdx];
        if (p) {
          p.sections.forEach((sec) => {
            sec.questions = applyDepthPresetToQuestions(sec.questions, targetDepth);
          });
        }
      }
      return next;
    });

    const info = RATIONALE_DEPTH_PRESETS[targetDepth];
    setSaveBanner(
      `Applied ${info.label} rationale depth preset (${info.targetLength}) to ${
        scope === 'all' ? 'all pages' : `Page ${currentPage?.pageNumber}`
      }.`
    );
    setTimeout(() => setSaveBanner(null), 3500);
  };

  // AI-powered deep rationale adjustment using Gemini
  const handleAIAdjustDepth = async (targetDepth: RationaleDepth) => {
    setIsAdjustingDepth(true);
    setSaveBanner(null);
    try {
      const questionsToAdjust = pageQuestions.map((entry) => entry.question);
      if (questionsToAdjust.length === 0) {
        throw new Error('No questions found on this page to adjust.');
      }

      const adjusted = await recalibrateRationalesWithAI(questionsToAdjust, targetDepth);
      setDraft((prev) => {
        const next: ReviewModule = JSON.parse(JSON.stringify(prev));
        const p = next.pages[selectedPageIdx];
        if (p) {
          if (p.sections.length > 0) {
            p.sections[0].questions = adjusted;
          }
        }
        return next;
      });

      setRationaleDepth(targetDepth);
      setSaveBanner(
        `Gemini AI calibrated all rationales on Page ${currentPage?.pageNumber} to ${RATIONALE_DEPTH_PRESETS[targetDepth].label} depth.`
      );
      setTimeout(() => setSaveBanner(null), 4000);
    } catch (err: any) {
      console.error('Failed to adjust depth with AI:', err);
      setSaveBanner(`AI Calibration Notice: ${err?.message || 'Applying client-side depth transformation.'}`);
      handleApplyDepthPreset(targetDepth);
    } finally {
      setIsAdjustingDepth(false);
    }
  };

  // Generative Quiz Mode Trigger
  const handleTriggerGenerativeQuiz = async () => {
    setIsGeneratingQuiz(true);
    setGenerativeError(null);
    setGenerativeStatus('Synthesizing novel questions from chemical structures & source references...');

    // Take snapshot for undo
    setUndoSnapshot(JSON.parse(JSON.stringify(draft)));

    try {
      const activeCompetencies = Object.entries(generativeCompetencies)
        .filter(([_, enabled]) => enabled)
        .map(([k]) => k);

      if (activeCompetencies.length === 0) {
        throw new Error('Please select at least one competency focus for question generation.');
      }

      // Collect structures on target scope
      let structures: ChemicalStructure[] = [];
      let existingQuestions: AntiplateletQuestion[] = [];
      let pageTitle = currentPage?.pageTitle || 'Medicinal Chemistry Review';

      if (generativeScope === 'all') {
        const strMap = new Map<string, ChemicalStructure>();
        draft.pages.forEach((p) => {
          p.sections.forEach((s) => {
            (s.structures || []).forEach((str) => strMap.set(str.id, str));
            existingQuestions.push(...s.questions);
          });
        });
        structures = Array.from(strMap.values());
      } else {
        const strMap = new Map<string, ChemicalStructure>();
        (currentPage?.sections || []).forEach((sec) => {
          (sec.structures || []).forEach((str) => strMap.set(str.id, str));
        });
        structures = Array.from(strMap.values());
        // If this page section doesn't have structures directly attached, search the entire module
        if (structures.length === 0) {
          draft.pages.forEach((p) => {
            p.sections.forEach((s) => {
              (s.structures || []).forEach((str) => strMap.set(str.id, str));
            });
          });
          structures = Array.from(strMap.values());
        }
        existingQuestions = pageQuestions.map((e) => e.question);
      }

      setGenerativeStatus('Calling Gemini with zero-duplicate mandate and rationale depth specifications...');

      const newQuestions = await generateAlternativeQuestionsAPI({
        structures,
        existingQuestions,
        pageTitle,
        competencies: activeCompetencies,
        rationaleDepth,
        sourceMaterial: `${draft.title} · ${draft.subtitle} · Course: ${draft.course}`,
        count: generativeCount,
      });

      // Update draft with new questions, replacing old questions
      setDraft((prev) => {
        const next: ReviewModule = JSON.parse(JSON.stringify(prev));
        if (generativeScope === 'all') {
          if (next.pages[0]?.sections[0]) {
            next.pages[0].sections[0].questions = newQuestions;
          }
        } else {
          const p = next.pages[selectedPageIdx];
          if (p && p.sections.length > 0) {
            // Replace questions in the first section and clear other sections so old questions are fully replaced
            p.sections[0].questions = newQuestions;
            for (let i = 1; i < p.sections.length; i++) {
              p.sections[i].questions = [];
            }
          }
        }
        return next;
      });

      setSelectedQuestionId(newQuestions[0]?.id || null);
      setIsGenerativeQuizOpen(false);
      setSaveBanner(
        `✨ Generative Quiz Mode complete! Replaced old questions with ${newQuestions.length} newly synthesized challenges (Ranking, Classification, and SAR Matching). Click Save to commit.`
      );
      setTimeout(() => setSaveBanner(null), 6000);
    } catch (err: any) {
      console.error('Generative Quiz Mode error:', err);
      setGenerativeError(err?.message || 'Failed to generate alternative questions.');
    } finally {
      setIsGeneratingQuiz(false);
      setGenerativeStatus('');
    }
  };

  // Undo Generative Quiz Generation
  const handleUndoGenerativeQuiz = () => {
    if (undoSnapshot) {
      setDraft(JSON.parse(JSON.stringify(undoSnapshot)));
      setUndoSnapshot(null);
      setSaveBanner('Restored previous questions before generative quiz mode.');
      setTimeout(() => setSaveBanner(null), 3000);
    }
  };

  // Update structure on current page
  const updateStructure = (
    sectionIdx: number,
    strIdx: number,
    updater: (s: ChemicalStructure) => ChemicalStructure
  ) => {
    setDraft((prev) => {
      const next: ReviewModule = JSON.parse(JSON.stringify(prev));
      const sec = next.pages[selectedPageIdx]?.sections[sectionIdx];
      if (sec && sec.structures && sec.structures[strIdx]) {
        const updatedStr = updater(sec.structures[strIdx]);
        sec.structures[strIdx] = updatedStr;
        // Also sync matching ID in questions on this section
        sec.questions.forEach((q) => {
          if (q.structuresDisplayed) {
            q.structuresDisplayed = q.structuresDisplayed.map((qs) =>
              qs.id === updatedStr.id ? updatedStr : qs
            );
          }
        });
      }
      return next;
    });
  };

  // Live NIH PubChem PUG REST lookup for a structure
  const handlePubChemLookup = async (
    sectionIdx: number,
    strIdx: number,
    structure: ChemicalStructure
  ) => {
    setAuditingStructureId(`${sectionIdx}_${strIdx}`);
    try {
      let cid = structure.cid;
      if (!cid && structure.name) {
        const cleanName = encodeURIComponent(structure.name.split('(')[0].trim());
        const nameRes = await fetch(
          `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${cleanName}/cids/JSON`
        );
        if (nameRes.ok) {
          const nameData = await nameRes.json();
          cid = nameData?.IdentifierList?.CID?.[0];
        }
      }

      if (cid) {
        const propRes = await fetch(
          `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/Title,IUPACName,MolecularFormula,MolecularWeight,CanonicalSMILES,XLogP/JSON`
        );
        if (propRes.ok) {
          const propData = await propRes.json();
          const prop = propData?.PropertyTable?.Properties?.[0];
          updateStructure(sectionIdx, strIdx, (prev) => {
            const updatedMw = prop?.MolecularWeight
              ? Number(prop.MolecularWeight)
              : prev.pubchemAudit?.molecularWeight;
            const updatedLogP = prop?.XLogP !== undefined ? Number(prop.XLogP) : prev.pubchemAudit?.xlogp;
            return {
              ...prev,
              cid,
              pubchemUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`,
              pngUrl: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=large`,
              mw: updatedMw ?? prev.mw,
              logP: updatedLogP ?? prev.logP,
              pubchemAudit: {
                cid: cid!,
                status: 'verified',
                verifiedAt: new Date().toISOString().split('T')[0],
                source: 'nih_pug_rest',
                canonicalSmiles: prop?.CanonicalSMILES || prev.pubchemAudit?.canonicalSmiles,
                iupacName: prop?.IUPACName || prev.pubchemAudit?.iupacName,
                molecularFormula:
                  prop?.MolecularFormula || prev.pubchemAudit?.molecularFormula,
                molecularWeight: updatedMw,
                xlogp: updatedLogP,
                pubChemUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`,
                matchScore: 100,
              },
            };
          });
        }
      }
    } catch (err) {
      console.warn('PubChem lookup error:', err);
    } finally {
      setAuditingStructureId(null);
    }
  };

  // Export Module JSON
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${draft.id || 'medchem_module'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Module JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed && parsed.title && Array.isArray(parsed.pages)) {
          setDraft(parsed);
          setSaveBanner('Loaded module JSON into editor! Click Save Changes to persist.');
          setTimeout(() => setSaveBanner(null), 4000);
        }
      } catch (err) {
        console.error('Invalid JSON module file:', err);
      }
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    onSaveModule(draft);
    setSaveBanner('Module & questions saved!');
    setTimeout(() => {
      setSaveBanner(null);
      onClose();
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---------------------------------------------------------------- */}
        {/* 1. HEADER                                                        */}
        {/* ---------------------------------------------------------------- */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-blue-600 text-white">
              <Edit3 className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                Module &amp; Question Studio Editor
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Curate questions, answer keys, SAR rationales, and NIH PubChem structure audits
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Export JSON */}
            <button
              type="button"
              onClick={handleExportJson}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer"
              title="Export Module as JSON backup"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>

            {/* Import JSON */}
            <label className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Load JSON</span>
              <input
                id="module-editor-import-json-input"
                name="moduleImportJson"
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* 2. NAVIGATION TABS & PAGE SELECTOR                               */}
        {/* ---------------------------------------------------------------- */}
        <div className="px-5 py-2.5 bg-slate-100/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('questions')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'questions'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Questions &amp; Answer Keys</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('structures')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'structures'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Chemical Structures &amp; PubChem</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('metadata')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'metadata'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Module Info</span>
            </button>
          </div>

          {activeTab !== 'metadata' && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Document Page:</span>
              <select
                id="module-editor-page-select"
                name="moduleSelectedPage"
                value={selectedPageIdx}
                onChange={(e) => {
                  const nextIdx = Number(e.target.value);
                  setSelectedPageIdx(nextIdx);
                  const firstQ = draft.pages[nextIdx]?.sections?.[0]?.questions?.[0];
                  setSelectedQuestionId(firstQ ? firstQ.id : null);
                }}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-200"
              >
                {draft.pages.map((p, idx) => (
                  <option key={idx} value={idx}>
                    Page {p.pageNumber}: {p.pageTitle}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* 3. EDITOR CONTENT AREA                                           */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex-1 overflow-y-auto p-5">
          {saveBanner && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{saveBanner}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB A: QUESTIONS & ANSWER KEYS EDITOR                          */}
          {/* ============================================================== */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              {/* ---------------------------------------------------------- */}
              {/* MEDICINAL CHEMISTRY RATIONALE DEPTH PRESETS TOOLBAR        */}
              {/* ---------------------------------------------------------- */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50/80 dark:from-slate-850 dark:via-blue-950/20 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/50 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-600 text-white shadow-xs">
                      <Sliders className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                          Medicinal Chemistry Rationale Depth Presets
                        </h3>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                          Active: {RATIONALE_DEPTH_PRESETS[rationaleDepth].label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Adjust explanation depth across answer keys, sub-statement rationales, matching targets, and high-yield pearls
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleApplyDepthPreset(rationaleDepth, 'page')}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors cursor-pointer"
                      title="Apply selected depth preset to all questions on current page"
                    >
                      Apply to Page {currentPage?.pageNumber}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyDepthPreset(rationaleDepth, 'all')}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors cursor-pointer"
                      title="Apply selected depth preset across all pages in this module"
                    >
                      Apply to All Pages
                    </button>
                    <button
                      type="button"
                      disabled={isAdjustingDepth}
                      onClick={() => handleAIAdjustDepth(rationaleDepth)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      title="Use Gemini AI to dynamically re-calibrate and deepen explanations"
                    >
                      {isAdjustingDepth ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>AI Calibrating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                          <span>AI Recalibrate (Gemini)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Preset Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {(Object.keys(RATIONALE_DEPTH_PRESETS) as RationaleDepth[]).map((presetKey) => {
                    const preset = RATIONALE_DEPTH_PRESETS[presetKey];
                    const isSelected = rationaleDepth === presetKey;
                    return (
                      <button
                        key={presetKey}
                        type="button"
                        onClick={() => handleApplyDepthPreset(presetKey, 'page')}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-500 bg-white dark:bg-slate-900 shadow-sm ring-1 ring-blue-500'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600 text-slate-900 dark:text-slate-100 shadow-2xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  isSelected ? 'bg-blue-600 dark:bg-blue-400' : 'bg-slate-300 dark:bg-slate-600'
                                }`}
                              />
                              {preset.label}
                            </span>
                            <span
                              className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                                isSelected
                                  ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
                                  : 'bg-slate-150 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {preset.targetLength}
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-snug">
                            {preset.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ---------------------------------------------------------- */}
              {/* GENERATIVE QUIZ MODE: NOVEL QUESTIONS PANEL                */}
              {/* ---------------------------------------------------------- */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50/70 via-indigo-50/50 to-blue-50/60 dark:from-purple-950/20 dark:via-indigo-950/30 dark:to-slate-900 border border-purple-200/80 dark:border-purple-900/50 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-purple-600 text-white shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                          Generative Quiz Mode
                        </h3>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                          Fresh Questions · Same Structures &amp; Types
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Replace old questions with newly generated challenges using the same chemical structures, ranking, classification, and SAR types
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {undoSnapshot && (
                      <button
                        type="button"
                        onClick={handleUndoGenerativeQuiz}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 hover:bg-amber-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Revert back to the questions prior to generation"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                        <span>Undo Generative Quiz</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setIsGenerativeQuizOpen(!isGenerativeQuizOpen)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                      <span>{isGenerativeQuizOpen ? 'Close Generator' : 'Configure & Generate Replacement Quiz'}</span>
                      {isGenerativeQuizOpen ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Generative Quiz Config Drawer */}
                {isGenerativeQuizOpen && (
                  <div className="pt-3 border-t border-purple-200/60 dark:border-purple-900/40 space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Target Scope */}
                      <div className="space-y-2 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
                        <label className="text-xs font-bold text-slate-900 dark:text-white block">
                          Target Replacement Scope:
                        </label>
                        <div className="space-y-1.5 text-xs">
                          <label className="flex items-center gap-2.5 cursor-pointer text-slate-900 dark:text-slate-100 font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                            <input
                              id="gen-scope-page-radio"
                              type="radio"
                              name="generativeScope"
                              checked={generativeScope === 'page'}
                              onChange={() => setGenerativeScope('page')}
                              className="accent-purple-600 cursor-pointer"
                            />
                            <span>Current Page ({currentPage?.pageTitle || `Page ${currentPage?.pageNumber}`})</span>
                          </label>
                          <label className="flex items-center gap-2.5 cursor-pointer text-slate-900 dark:text-slate-100 font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                            <input
                              id="gen-scope-all-radio"
                              type="radio"
                              name="generativeScope"
                              checked={generativeScope === 'all'}
                              onChange={() => setGenerativeScope('all')}
                              className="accent-purple-600 cursor-pointer"
                            />
                            <span>Entire Review Module</span>
                          </label>
                        </div>
                      </div>

                      {/* Question Count */}
                      <div className="space-y-2 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
                        <label className="text-xs font-bold text-slate-900 dark:text-white block">
                          New Questions Count:
                        </label>
                        <select
                          id="gen-count-select"
                          name="generativeCount"
                          value={generativeCount}
                          onChange={(e) => setGenerativeCount(Number(e.target.value))}
                          className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-900 dark:text-slate-100 shadow-2xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden cursor-pointer"
                        >
                          <option value={1}>1 Question (Quick Check)</option>
                          <option value={2}>2 Questions (Focused Pair)</option>
                          <option value={3}>3 Questions</option>
                          <option value={4}>4 Questions (Recommended / Standard)</option>
                          <option value={5}>5 Questions</option>
                          <option value={6}>6 Questions</option>
                          <option value={7}>7 Questions</option>
                          <option value={8}>8 Questions</option>
                          <option value={9}>9 Questions</option>
                          <option value={10}>10 Questions (Comprehensive)</option>
                          <option value={12}>12 Questions (Extensive)</option>
                          <option value={15}>15 Questions (Full Drill)</option>
                        </select>
                        <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                          Generates balanced mix of ranking, classification &amp; SAR
                        </p>
                      </div>

                      {/* Rationale Depth For Generation */}
                      <div className="space-y-2 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
                        <label className="text-xs font-bold text-slate-900 dark:text-white block">
                          Target Rationale Depth:
                        </label>
                        <select
                          id="gen-rationale-depth-select"
                          name="generativeRationaleDepth"
                          value={rationaleDepth}
                          onChange={(e) => setRationaleDepth(e.target.value as RationaleDepth)}
                          className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-900 dark:text-slate-100 shadow-2xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden cursor-pointer"
                        >
                          <option value="short">Short (1-Sentence High-Yield)</option>
                          <option value="medium">Medium (Standard Review Depth)</option>
                          <option value="long">Long (Deep-Dive / Board-Exam)</option>
                        </select>
                        <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                          Calibrates generated answer rationales
                        </p>
                      </div>
                    </div>

                    {/* Question Types & Competencies */}
                    <div className="space-y-2.5 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Include Question Types &amp; Medicinal Chemistry Competencies:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        <label className="flex items-start gap-2.5 cursor-pointer p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:bg-purple-50/50 dark:hover:bg-purple-950/40 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                          <input
                            id="comp-ranking-checkbox"
                            name="compRanking"
                            type="checkbox"
                            checked={generativeCompetencies.ranking}
                            onChange={(e) =>
                              setGenerativeCompetencies((prev) => ({
                                ...prev,
                                ranking: e.target.checked,
                              }))
                            }
                            className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
                          />
                          <div>
                            <span className="font-bold text-xs text-slate-950 dark:text-white block">
                              Ranking Questions
                            </span>
                            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-snug">
                              Rank structures by onset of action, potency, duration of platelet inhibition, or bioactivation dependency
                            </p>
                          </div>
                        </label>

                        <label className="flex items-start gap-2.5 cursor-pointer p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:bg-purple-50/50 dark:hover:bg-purple-950/40 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                          <input
                            id="comp-classifying-checkbox"
                            name="compClassifying"
                            type="checkbox"
                            checked={generativeCompetencies.classifying}
                            onChange={(e) =>
                              setGenerativeCompetencies((prev) => ({
                                ...prev,
                                classifying: e.target.checked,
                              }))
                            }
                            className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
                          />
                          <div>
                            <span className="font-bold text-xs text-slate-950 dark:text-white block">
                              Classification &amp; Grouping
                            </span>
                            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-snug">
                              Classify structures as prodrug vs active drug, chemical class (thienopyridine, nucleotide, salicylate), or receptor target
                            </p>
                          </div>
                        </label>

                        <label className="flex items-start gap-2.5 cursor-pointer p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:bg-purple-50/50 dark:hover:bg-purple-950/40 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                          <input
                            id="comp-matching-checkbox"
                            name="compMatching"
                            type="checkbox"
                            checked={generativeCompetencies.matching}
                            onChange={(e) =>
                              setGenerativeCompetencies((prev) => ({
                                ...prev,
                                matching: e.target.checked,
                              }))
                            }
                            className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
                          />
                          <div>
                            <span className="font-bold text-xs text-slate-950 dark:text-white block">
                              SAR &amp; Pharmacophore Matching
                            </span>
                            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-snug">
                              Match key functional groups (electrophilic warhead, basic amine, non-hydrolyzable bridge) to Roman numeral structures
                            </p>
                          </div>
                        </label>

                        <label className="flex items-start gap-2.5 cursor-pointer p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:bg-purple-50/50 dark:hover:bg-purple-950/40 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                          <input
                            id="comp-substatements-checkbox"
                            name="compSubStatements"
                            type="checkbox"
                            checked={generativeCompetencies.subStatements}
                            onChange={(e) =>
                              setGenerativeCompetencies((prev) => ({
                                ...prev,
                                subStatements: e.target.checked,
                              }))
                            }
                            className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
                          />
                          <div>
                            <span className="font-bold text-xs text-slate-950 dark:text-white block">
                              Sub-Statements (True / False SAR)
                            </span>
                            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-snug">
                              Generate 4-6 challenging SAR true/false statements with comprehensive biochemical rationales
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Status & Error display */}
                    {isGeneratingQuiz && (
                      <div className="p-3 rounded-xl bg-purple-100/70 dark:bg-purple-950/50 border border-purple-300 dark:border-purple-800 flex items-center gap-2.5 text-purple-900 dark:text-purple-200 text-xs">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-600 shrink-0" />
                        <span className="font-semibold">{generativeStatus || 'Synthesizing novel questions...'}</span>
                      </div>
                    )}

                    {generativeError && (
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 flex items-center gap-2.5 text-rose-800 dark:text-rose-200 text-xs">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{generativeError}</span>
                      </div>
                    )}

                    {/* Action trigger button */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsGenerativeQuizOpen(false)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={isGeneratingQuiz}
                        onClick={handleTriggerGenerativeQuiz}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60 text-white flex items-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        {isGeneratingQuiz ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Generating &amp; Replacing...</span>
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4" />
                            <span>Generate &amp; Replace Old Questions</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Grid of Questions & Active Editor */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-1">
              {/* Left Sidebar: Question List on Selected Page */}
              <div className="md:col-span-4 space-y-2 border-r border-slate-200 dark:border-slate-800 pr-0 md:pr-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Page {currentPage?.pageNumber} Questions ({pageQuestions.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
                  {pageQuestions.map(({ question }) => {
                    const isSelected = activeQuestionEntry?.question.id === question.id;
                    return (
                      <button
                        key={question.id}
                        type="button"
                        onClick={() => setSelectedQuestionId(question.id)}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-400 dark:border-blue-700 text-blue-950 dark:text-blue-200 font-semibold'
                            : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-mono font-bold text-[11px] px-1.5 py-0.5 rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                            Q{question.id}
                          </span>
                          <span className="font-mono text-[10px] uppercase text-slate-400">
                            {question.type}
                          </span>
                        </div>
                        <div className="line-clamp-2 text-[11px] leading-snug">
                          {question.questionStem}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Active Question Form */}
              <div className="md:col-span-8 space-y-4">
                {activeQuestionEntry ? (
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        Editing Question Q{activeQuestionEntry.question.id}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(activeQuestionEntry.question.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Question</span>
                      </button>
                    </div>

                    {/* Question Stem & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="font-semibold text-slate-600 dark:text-slate-300 block">
                          Question Stem
                        </label>
                        <textarea
                          id="edit-question-stem"
                          name="questionStem"
                          rows={2}
                          value={activeQuestionEntry.question.questionStem}
                          onChange={(e) =>
                            updateActiveQuestion((q) => ({
                              ...q,
                              questionStem: e.target.value,
                            }))
                          }
                          className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-600 dark:text-slate-300 block">
                          Topic Category
                        </label>
                        <input
                          id="edit-question-category"
                          name="questionCategory"
                          type="text"
                          value={activeQuestionEntry.question.category}
                          onChange={(e) =>
                            updateActiveQuestion((q) => ({
                              ...q,
                              category: e.target.value,
                            }))
                          }
                          className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    {/* Multiple-Choice Options & Correct Key Editor */}
                    {activeQuestionEntry.question.type === 'multiple-choice' &&
                      activeQuestionEntry.question.options && (
                        <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                          <div className="font-bold text-slate-700 dark:text-slate-300">
                            Multiple-Choice Options &amp; Correct Key (Click radio to set correct option):
                          </div>
                          {activeQuestionEntry.question.options.map((opt, optIdx) => (
                            <div key={optIdx} className="space-y-1.5 pt-1">
                              <div className="flex items-center gap-2">
                                <input
                                  id={`edit-opt-radio-${activeQuestionEntry.question.id}-${optIdx}`}
                                  type="radio"
                                  name={`correct_opt_${activeQuestionEntry.question.id}`}
                                  checked={activeQuestionEntry.question.correctIndex === optIdx}
                                  onChange={() =>
                                    updateActiveQuestion((q) => ({
                                      ...q,
                                      correctIndex: optIdx,
                                    }))
                                  }
                                  className="cursor-pointer"
                                />
                                <span className="font-mono font-bold w-5">
                                  {String.fromCharCode(65 + optIdx)})
                                </span>
                                <input
                                  id={`edit-opt-text-${activeQuestionEntry.question.id}-${optIdx}`}
                                  name={`optionText_${optIdx}`}
                                  type="text"
                                  value={opt}
                                  onChange={(e) =>
                                    updateActiveQuestion((q) => {
                                      const nextOpts = [...(q.options || [])];
                                      nextOpts[optIdx] = e.target.value;
                                      return { ...q, options: nextOpts };
                                    })
                                  }
                                  className="flex-1 p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                                />
                              </div>
                              {activeQuestionEntry.question.optionExplanations && (
                                <div className="pl-8">
                                  <input
                                    id={`edit-opt-exp-${activeQuestionEntry.question.id}-${optIdx}`}
                                    name={`optionExp_${optIdx}`}
                                    type="text"
                                    placeholder="Option-specific SAR rationale..."
                                    value={
                                      activeQuestionEntry.question.optionExplanations[optIdx] || ''
                                    }
                                    onChange={(e) =>
                                      updateActiveQuestion((q) => {
                                        const nextExps = [
                                          ...(q.optionExplanations || []),
                                        ];
                                        nextExps[optIdx] = e.target.value;
                                        return { ...q, optionExplanations: nextExps };
                                      })
                                    }
                                    className="w-full p-1.5 rounded bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                    {/* True/False Sub-Statements Editor */}
                    {activeQuestionEntry.question.type === 'sub-statements' &&
                      activeQuestionEntry.question.subStatements && (
                        <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                          <div className="font-bold text-slate-700 dark:text-slate-300">
                            True / False Statements &amp; Answer Keys:
                          </div>
                          {activeQuestionEntry.question.subStatements.map((stmt, sIdx) => (
                            <div
                              key={stmt.id}
                              className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold">{stmt.id})</span>
                                <input
                                  id={`edit-stmt-text-${stmt.id}`}
                                  name={`stmtText_${stmt.id}`}
                                  type="text"
                                  value={stmt.statement}
                                  onChange={(e) =>
                                    updateActiveQuestion((q) => {
                                      const nextStmts = [...(q.subStatements || [])];
                                      nextStmts[sIdx] = {
                                        ...nextStmts[sIdx],
                                        statement: e.target.value,
                                      };
                                      return { ...q, subStatements: nextStmts };
                                    })
                                  }
                                  className="flex-1 p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateActiveQuestion((q) => {
                                      const nextStmts = [...(q.subStatements || [])];
                                      nextStmts[sIdx] = {
                                        ...nextStmts[sIdx],
                                        isCorrect: !nextStmts[sIdx].isCorrect,
                                      };
                                      return { ...q, subStatements: nextStmts };
                                    })
                                  }
                                  className={`px-2.5 py-1 rounded font-mono font-bold text-xs cursor-pointer ${
                                    stmt.isCorrect
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-rose-600 text-white'
                                  }`}
                                >
                                  {stmt.isCorrect ? 'Key: TRUE' : 'Key: FALSE'}
                                </button>
                              </div>
                              <input
                                id={`edit-stmt-rationale-${stmt.id}`}
                                name={`stmtRationale_${stmt.id}`}
                                type="text"
                                value={stmt.rationale}
                                placeholder="Statement SAR rationale..."
                                onChange={(e) =>
                                  updateActiveQuestion((q) => {
                                    const nextStmts = [...(q.subStatements || [])];
                                    nextStmts[sIdx] = {
                                      ...nextStmts[sIdx],
                                      rationale: e.target.value,
                                    };
                                    return { ...q, subStatements: nextStmts };
                                  })
                                }
                                className="w-full p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Overall SAR Explanation & High-Yield Pearl */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-600 dark:text-slate-300 block">
                          Overall Medicinal Chemistry / SAR Rationale
                        </label>
                        <textarea
                          id="edit-overall-explanation"
                          name="overallExplanation"
                          rows={3}
                          value={activeQuestionEntry.question.overallExplanation}
                          onChange={(e) =>
                            updateActiveQuestion((q) => ({
                              ...q,
                              overallExplanation: e.target.value,
                            }))
                          }
                          className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-600 dark:text-slate-300 block">
                          High-Yield Exam Takeaway Pearl
                        </label>
                        <input
                          id="edit-high-yield-pearl"
                          name="highYieldPearl"
                          type="text"
                          value={activeQuestionEntry.question.highYieldPearl}
                          onChange={(e) =>
                            updateActiveQuestion((q) => ({
                              ...q,
                              highYieldPearl: e.target.value,
                            }))
                          }
                          className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Select a question on the left or click &ldquo;Add Question&rdquo; to begin editing.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

          {/* ============================================================== */}
          {/* TAB B: CHEMICAL STRUCTURES & PUBCHEM AUDITOR                   */}
          {/* ============================================================== */}
          {activeTab === 'structures' && (
            <div className="space-y-4">
              {currentPage?.sections.map((sec, sIdx) =>
                (sec.structures || []).map((str, strIdx) => {
                  const isAuditing = auditingStructureId === `${sIdx}_${strIdx}`;
                  return (
                    <div
                      key={`${str.id}_${strIdx}`}
                      className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start gap-4 text-xs"
                    >
                      {/* Structure Preview */}
                      <div className="w-full md:w-44 bg-white rounded-xl border border-slate-200 p-3 flex flex-col items-center justify-center shrink-0">
                        <img
                          src={str.pngUrl}
                          alt={str.name}
                          width="320"
                          height="320"
                          loading="lazy"
                          className="w-full h-28 aspect-square object-contain"
                        />
                        <span className="mt-2 font-mono font-bold text-[11px] text-slate-600">
                          Structure [{str.id}] · CID {str.cid || 'Unset'}
                        </span>
                      </div>

                      {/* Structure Fields */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                        <div>
                          <label className="font-semibold text-slate-500 block mb-1">
                            Drug Name
                          </label>
                          <input
                            id={`edit-str-name-${sIdx}-${strIdx}`}
                            name={`structureName_${sIdx}_${strIdx}`}
                            type="text"
                            value={str.name}
                            onChange={(e) =>
                              updateStructure(sIdx, strIdx, (prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-500 block mb-1">
                            NIH PubChem CID
                          </label>
                          <div className="flex items-center gap-1.5">
                            <input
                              id={`edit-str-cid-${sIdx}-${strIdx}`}
                              name={`structureCid_${sIdx}_${strIdx}`}
                              type="number"
                              value={str.cid || ''}
                              onChange={(e) =>
                                updateStructure(sIdx, strIdx, (prev) => ({
                                  ...prev,
                                  cid: Number(e.target.value) || undefined,
                                }))
                              }
                              className="flex-1 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => handlePubChemLookup(sIdx, strIdx, str)}
                              disabled={isAuditing}
                              className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                            >
                              <RefreshCw
                                className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`}
                              />
                              <span>Verify PubChem</span>
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="font-semibold text-slate-500 block mb-1">
                            Chemical Class
                          </label>
                          <input
                            id={`edit-str-class-${sIdx}-${strIdx}`}
                            name={`structureClass_${sIdx}_${strIdx}`}
                            type="text"
                            value={str.chemicalClass}
                            onChange={(e) =>
                              updateStructure(sIdx, strIdx, (prev) => ({
                                ...prev,
                                chemicalClass: e.target.value,
                              }))
                            }
                            className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-500 block mb-1">
                            Pharmacological Class
                          </label>
                          <input
                            id={`edit-str-pharma-${sIdx}-${strIdx}`}
                            name={`structurePharma_${sIdx}_${strIdx}`}
                            type="text"
                            value={str.pharmacologicalClass}
                            onChange={(e) =>
                              updateStructure(sIdx, strIdx, (prev) => ({
                                ...prev,
                                pharmacologicalClass: e.target.value,
                              }))
                            }
                            className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="font-semibold text-slate-500 block mb-1">
                            SAR Notes
                          </label>
                          <textarea
                            id={`edit-str-sar-${sIdx}-${strIdx}`}
                            name={`structureSar_${sIdx}_${strIdx}`}
                            rows={2}
                            value={str.sarNotes}
                            onChange={(e) =>
                              updateStructure(sIdx, strIdx, (prev) => ({
                                ...prev,
                                sarNotes: e.target.value,
                              }))
                            }
                            className="w-full p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB C: MODULE METADATA & MANAGEMENT                            */}
          {/* ============================================================== */}
          {activeTab === 'metadata' && (
            <div className="max-w-xl space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 dark:text-slate-300 block">
                  Module Title
                </label>
                <input
                  id="edit-draft-title"
                  name="draftTitle"
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 dark:text-slate-300 block">
                  Subtitle / Scope
                </label>
                <input
                  id="edit-draft-subtitle"
                  name="draftSubtitle"
                  type="text"
                  value={draft.subtitle}
                  onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 dark:text-slate-300 block">
                    Course Name
                  </label>
                  <input
                    id="edit-draft-course"
                    name="draftCourse"
                    type="text"
                    value={draft.course}
                    onChange={(e) => setDraft({ ...draft, course: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 dark:text-slate-300 block">
                    Semester
                  </label>
                  <input
                    id="edit-draft-semester"
                    name="draftSemester"
                    type="text"
                    value={draft.semester}
                    onChange={(e) => setDraft({ ...draft, semester: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600 dark:text-slate-300 block">
                    Exam Code
                  </label>
                  <input
                    id="edit-draft-code"
                    name="draftCode"
                    type="text"
                    value={draft.code || ''}
                    onChange={(e) => setDraft({ ...draft, code: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              {/* Factory Reset or Delete Module Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                {draft.isBuiltIn && onResetBuiltIn && (
                  <button
                    type="button"
                    onClick={() => {
                      onResetBuiltIn(draft.id);
                      onClose();
                    }}
                    className="px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Built-In Module Defaults</span>
                  </button>
                )}

                {!draft.isBuiltIn && onDeleteModule && (
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteModule(draft.id);
                      onClose();
                    }}
                    className="px-3 py-2 rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Custom Module</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* 4. FOOTER                                                        */}
        {/* ---------------------------------------------------------------- */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Changes persist automatically in your browser workspace</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Module Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
