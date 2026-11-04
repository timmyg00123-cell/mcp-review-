import React, { useState, useEffect, useMemo, useRef } from 'react';
import { flushSync } from 'react-dom';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  ReviewModule,
  ReviewPage,
  ChemicalStructure,
  AntiplateletQuestion,
  QuizSessionProgress,
  ExamModeStatus,
} from './types/reviewModule';
import {
  loadAllReviewModules,
  initModuleStorageFromDexie,
  saveReviewModule,
  deleteReviewModule,
  resetBuiltInModule,
  restoreBuiltInModule,
  getHiddenBuiltins,
  loadActiveModuleId,
  saveActiveModuleId,
  loadModuleProgress,
  saveModuleProgress,
  clearModuleProgress,
  getEmptySessionProgress,
} from './utils/moduleStorage';
import { ChemicalStructureCard } from './components/ChemicalStructureCard';
import { StructureComparator } from './components/StructureComparator';
import { DocumentQuestionItem } from './components/DocumentQuestionItem';
import { SmilesCanvas } from './components/SmilesCanvas';
import { getHydratedDrugs, HydratedDrug } from './db/medChemGraphDb';
import { Navbar } from './components/Navbar';
import { yieldToMainThread, runWhenIdle } from './utils/scheduler';
import { processFileAndGenerateQuestions } from './services/lectureIngestion';

// Code-split heavy modals and secondary views to shrink critical-path JS and accelerate LCP render
const Dashboard = React.lazy(() =>
  import('./components/Dashboard').then((m) => ({ default: m.Dashboard }))
);
const AntiplateletMatrixView = React.lazy(() =>
  import('./components/AntiplateletMatrixView').then((m) => ({ default: m.AntiplateletMatrixView }))
);
const PubChemInspectorModal = React.lazy(() =>
  import('./components/PubChemInspectorModal').then((m) => ({ default: m.PubChemInspectorModal }))
);
const DocumentStudioModal = React.lazy(() =>
  import('./components/DocumentStudioModal').then((m) => ({ default: m.DocumentStudioModal }))
);
const SettingsModal = React.lazy(() =>
  import('./components/SettingsModal').then((m) => ({ default: m.SettingsModal }))
);
const ModuleEditorModal = React.lazy(() =>
  import('./components/ModuleEditorModal').then((m) => ({ default: m.ModuleEditorModal }))
);
const AITutorPanel = React.lazy(() =>
  import('./components/AITutorPanel').then((m) => ({ default: m.AITutorPanel }))
);
const KnowledgeGraphExplorer = React.lazy(() =>
  import('./components/KnowledgeGraphExplorer').then((m) => ({ default: m.KnowledgeGraphExplorer }))
);
const PharmacophoreExplorerSidebar = React.lazy(() =>
  import('./components/PharmacophoreExplorerSidebar').then((m) => ({ default: m.PharmacophoreExplorerSidebar }))
);
import { GlobalPharmacophore } from './utils/globalPharmacophores';
import {
  ColorPaletteItem,
  PHARMACOPHORE_COLOR_PALETTE,
} from './utils/pharmacophoreData';
import {
  getInitialTheme,
  saveTheme,
  getInitialShowKnowledgeGraph,
  saveShowKnowledgeGraph,
  loadTopicProfiles,
  getInitialStructureImageBg,
  saveStructureImageBg,
  getInitialStructureImageDarkBg,
  saveStructureImageDarkBg,
  getInitialStructureLockObsidian,
  saveStructureLockObsidian,
  getInitialBondLightColor,
  saveBondLightColor,
  getInitialBondDarkColor,
  saveBondDarkColor,
} from './utils/storage';
import { ImportCollisionModal } from './components/ImportCollisionModal';
import {
  parseAndValidateJsonPayload,
  detectCollisions,
  applyImport,
  type ParsedImportResult,
  type ImportCollision,
} from './utils/jsonPortability';
import { sortStructuresByDocumentLabel } from './utils/documentLabel';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Eye,
  EyeOff,
  Upload,
  BookOpen,
  Check,
  Timer,
  Award,
  Filter,
  Edit3,
  Trash2,
  Play,
  CheckCircle2,
  XCircle,
  FlaskConical,
  Sliders,
  Network,
} from 'lucide-react';

type AppTab = 'document-review' | 'matrix' | 'pubchem-inspector' | 'knowledge-graph' | 'dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

interface BackgroundIngestionState {
  status: 'ingesting' | 'completed' | 'error';
  progressPercent: number;
  message: string;
  fileName: string;
  error?: string;
}

interface HorizontalStructureVignetteProps {
  questions: AntiplateletQuestion[];
  blockStructures: ChemicalStructure[];
  hydratedDrugs: HydratedDrug[];
  selectedDrugAKey?: string | null;
  selectedDrugBKey?: string | null;
  onSelectDrugA?: (key: string) => void;
  onSelectDrugB?: (key: string) => void;
}

export const HorizontalStructureVignette: React.FC<HorizontalStructureVignetteProps> = ({
  questions,
  blockStructures,
  hydratedDrugs,
  selectedDrugAKey,
  selectedDrugBKey,
  onSelectDrugA,
  onSelectDrugB,
}) => {
  const relevantDrugs = useMemo(() => {
    const referencedNames = new Set<string>();
    const referencedIds = new Set<string>();
    const referencedCids = new Set<number>();

    // 1. Collect from questions metadata
    questions.forEach((q) => {
      if (q.structuresDisplayed) {
        q.structuresDisplayed.forEach((s) => {
          if (s.name) referencedNames.add(s.name.toLowerCase().trim());
          if (s.id) referencedIds.add(s.id.toLowerCase().trim());
          if (s.document_label) referencedIds.add(s.document_label.toLowerCase().trim());
          if (s.cid) referencedCids.add(s.cid);
        });
      }
      if (q.referenced_structures) {
        q.referenced_structures.forEach((ref) => {
          if (ref) referencedIds.add(ref.toLowerCase().trim());
        });
      }
      if (q.displayed_structure_entity_ids) {
        q.displayed_structure_entity_ids.forEach((id) => {
          if (id) referencedIds.add(id.toLowerCase().trim());
        });
      }
      if (q.hide_drug_name_show_structure_for) {
        const hides = Array.isArray(q.hide_drug_name_show_structure_for)
          ? q.hide_drug_name_show_structure_for
          : [q.hide_drug_name_show_structure_for];
        hides.forEach((h) => {
          if (h) referencedNames.add(h.toLowerCase().trim());
        });
      }
    });

    // 2. Collect from section block structures
    blockStructures.forEach((s) => {
      if (s.name) referencedNames.add(s.name.toLowerCase().trim());
      if (s.id) referencedIds.add(s.id.toLowerCase().trim());
      if (s.document_label) referencedIds.add(s.document_label.toLowerCase().trim());
      if (s.cid) referencedCids.add(s.cid);
    });

    const matched: HydratedDrug[] = [];
    const matchedNames = new Set<string>();

    // Match against hydratedDrugs
    hydratedDrugs.forEach((drug) => {
      const dName = drug.name.toLowerCase().trim();
      const dId = drug.id.toLowerCase().trim();
      const dCid = drug.cid;

      const isMatch =
        referencedNames.has(dName) ||
        referencedIds.has(dId) ||
        (dCid && referencedCids.has(dCid)) ||
        Array.from(referencedNames).some((n) => dName.includes(n) || n.includes(dName));

      if (isMatch && !matchedNames.has(dName)) {
        matchedNames.add(dName);
        matched.push(drug);
      }
    });

    // Fallback: If blockStructures contains items not yet in Dexie graph DB, include them
    blockStructures.forEach((s) => {
      const sName = s.name.toLowerCase().trim();
      if (!matchedNames.has(sName)) {
        matchedNames.add(sName);
        matched.push({
          id: s.id,
          name: s.name,
          cid: s.cid,
          smiles: s.canonicalSmiles || s.smiles,
          canonicalSmiles: s.canonicalSmiles || s.smiles,
          structure: s,
        } as unknown as HydratedDrug);
      }
    });

    // Deduplicate strictly by name
    return matched.filter(
      (v, i, a) => a.findIndex((t) => t.name.toLowerCase() === v.name.toLowerCase()) === i
    );
  }, [questions, blockStructures, hydratedDrugs]);

  if (relevantDrugs.length === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80 pb-2">
        <span className="font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[11px]">
          Relevant Structures
        </span>
        <span className="text-[11px]">Select [A] or [B] to compare structures</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {relevantDrugs.map((drug) => {
          const isA =
            Boolean(selectedDrugAKey) &&
            (selectedDrugAKey === drug.name ||
              selectedDrugAKey === drug.id ||
              (drug.cid && selectedDrugAKey === String(drug.cid)));
          const isB =
            Boolean(selectedDrugBKey) &&
            (selectedDrugBKey === drug.name ||
              selectedDrugBKey === drug.id ||
              (drug.cid && selectedDrugBKey === String(drug.cid)));

          return (
            <div
              key={drug.id || drug.name}
              className={`flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-800/60 border rounded-lg shadow-xs transition-all select-none ${
                isA
                  ? 'border-blue-500 ring-2 ring-blue-500/30 dark:border-blue-400'
                  : isB
                  ? 'border-indigo-500 ring-2 ring-indigo-500/30 dark:border-indigo-400'
                  : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <span
                className="font-bold text-xs sm:text-sm text-center text-slate-900 dark:text-slate-100 mb-2 truncate max-w-[160px]"
                title={drug.name}
              >
                {drug.name}
              </span>
              <div className="w-[160px] h-[160px] bg-[var(--structure-canvas-bg)] dark:bg-slate-900 rounded-md flex items-center justify-center overflow-hidden border border-slate-200/60 dark:border-slate-700/50">
                <SmilesCanvas
                  smiles={
                    drug.smiles ||
                    drug.canonicalSmiles ||
                    drug.structure?.canonicalSmiles ||
                    drug.structure?.smiles
                  }
                  molBlock={drug.structure?.pubchemMolBlock}
                  fallbackImageUrl={drug.structure?.pngUrl}
                  width={160}
                  height={160}
                  altText={drug.name}
                />
              </div>

              {/* Selector Squares: [A] and [B] */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectDrugA) onSelectDrugA(drug.name || drug.id);
                  }}
                  title={`Select ${drug.name} as Compound A`}
                  className={`w-7 h-7 rounded flex items-center justify-center text-xs font-black transition-all cursor-pointer ${
                    isA
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400'
                      : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600'
                  }`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectDrugB) onSelectDrugB(drug.name || drug.id);
                  }}
                  title={`Select ${drug.name} as Compound B`}
                  className={`w-7 h-7 rounded flex items-center justify-center text-xs font-black transition-all cursor-pointer ${
                    isB
                      ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400'
                      : 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600'
                  }`}
                >
                  B
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function AppContent() {
  const queryClient = useQueryClient();
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [structureImageBg, setStructureImageBg] = useState<string>(getInitialStructureImageBg);
  const [structureImageDarkBg, setStructureImageDarkBg] = useState<string>(getInitialStructureImageDarkBg);
  const [lockObsidian, setLockObsidian] = useState<boolean>(getInitialStructureLockObsidian);
  const [bondLightColor, setBondLightColor] = useState<string>(getInitialBondLightColor);
  const [bondDarkColor, setBondDarkColor] = useState<string>(getInitialBondDarkColor);
  const [activeTab, setActiveTab] = useState<AppTab>('document-review');

  /**
   * Native View Transitions API for smooth multi-tab transitions
   */
  const switchTab = (tab: AppTab) => {
    if (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      typeof (document as any).startViewTransition === 'function'
    ) {
      (document as any).startViewTransition(() => {
        flushSync(() => {
          setActiveTab(tab);
        });
      });
    } else {
      setActiveTab(tab);
    }
  };

  // Hydrated drug graph dataset from Dexie
  const { data: hydratedDrugs = [] } = useQuery<HydratedDrug[]>({
    queryKey: ['hydratedDrugs'],
    queryFn: getHydratedDrugs,
  });

  // TanStack Query: Review Modules Library with automatic Dexie hydration & cache invalidation
  const { data: modules = [] } = useQuery<ReviewModule[]>({
    queryKey: ['modules'],
    queryFn: async () => {
      const dexieModules = await initModuleStorageFromDexie();
      if (dexieModules && dexieModules.length > 0) {
        return dexieModules;
      }
      return loadAllReviewModules();
    },
    initialData: loadAllReviewModules(),
    staleTime: 0,
  });

  const [activeModuleId, setActiveModuleId] = useState<string>(loadActiveModuleId);
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false);
  const [confirmDeleteModuleId, setConfirmDeleteModuleId] = useState<string | null>(null);
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [isDocumentStudioOpen, setIsDocumentStudioOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sectionComparatorKeys, setSectionComparatorKeys] = useState<
    Record<string, { drugAKey?: string; drugBKey?: string }>
  >({});

  // Module & Question Studio Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);

  // Active module object
  const activeModule = useMemo(() => {
    return modules.find((m) => m.id === activeModuleId) || modules[0];
  }, [modules, activeModuleId]);

  // Unified Session Progress persisted per module
  const [sessionProgress, setSessionProgress] = useState<QuizSessionProgress>(() =>
    loadModuleProgress(activeModuleId)
  );

  // Drug Name Self-Testing Toggle (Blind Structure Identification Mode)
  const [hideDrugNames, setHideDrugNames] = useState<boolean>(false);

  // Knowledge Graph opt-in setting (defaults to false, persisted in localStorage)
  const [showKnowledgeGraph, setShowKnowledgeGraph] = useState<boolean>(getInitialShowKnowledgeGraph);

  const handleToggleShowKnowledgeGraph = () => {
    setShowKnowledgeGraph((prev) => {
      const next = !prev;
      saveShowKnowledgeGraph(next);
      if (!next && activeTab === 'knowledge-graph') {
        setActiveTab('document-review');
      }
      return next;
    });
  };

  // Hydrate session progress & review modules from Dexie IndexedDB post-mount
  useEffect(() => {
    const cancelIdle = runWhenIdle(() => {
      initModuleStorageFromDexie()
        .then((hydrated) => {
          React.startTransition(() => {
            if (hydrated && hydrated.length > 0) {
              queryClient.setQueryData(['modules'], hydrated);
            }
            setSessionProgress(loadModuleProgress(activeModuleId));
          });
        })
        .catch((err) => {
          console.warn('Dexie hydration warning:', err);
        });
    }, 200);

    return () => cancelIdle();
  }, [activeModuleId]);

  // View state fallback: if showKnowledgeGraph is false and activeTab is 'knowledge-graph', switch back
  useEffect(() => {
    if (!showKnowledgeGraph && activeTab === 'knowledge-graph') {
      setActiveTab('document-review');
    }
  }, [showKnowledgeGraph, activeTab]);

  // Timed Exam Simulation State
  const [examStatus, setExamStatus] = useState<ExamModeStatus>('off');
  const [examDurationMinutes, setExamDurationMinutes] = useState<number>(30);
  const [examRemainingSeconds, setExamRemainingSeconds] = useState<number>(1800);
  const [examElapsedSeconds, setExamElapsedSeconds] = useState<number>(0);
  const [isExamSetupOpen, setIsExamSetupOpen] = useState<boolean>(false);
  const [filterMissedOnly, setFilterMissedOnly] = useState<boolean>(false);

  // Key to trigger remounting and fresh state of all questions upon quiz reset
  const [quizKey, setQuizKey] = useState<number>(0);
  const [resetToast, setResetToast] = useState<string | null>(null);

  // Import JSON & Collision Resolution State
  const [pendingImport, setPendingImport] = useState<{
    parsed: ParsedImportResult;
    collisions: ImportCollision[];
  } | null>(null);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  const handleImportComplete = (message: string, importedModuleId?: string) => {
    queryClient.invalidateQueries({ queryKey: ['modules'] });
    if (importedModuleId) {
      React.startTransition(() => {
        handleSwitchModule(importedModuleId);
      });
    }
    setResetToast(message);
    setTimeout(() => setResetToast(null), 4000);
  };

  const handleResolveCollision = (strategy: 'overwrite' | 'clone') => {
    if (!pendingImport) return;
    try {
      const result = applyImport(pendingImport.parsed, strategy);
      setPendingImport(null);
      handleImportComplete(result.message, result.importedModuleId);
    } catch (err) {
      console.error('Failed to resolve import collision:', err);
      setResetToast(err instanceof Error ? err.message : 'Import resolution failed');
      setTimeout(() => setResetToast(null), 4000);
    }
  };

  const handleNavbarImportFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = parseAndValidateJsonPayload(text);
      const existingProfiles = loadTopicProfiles();
      const collisions = detectCollisions(parsed, modules, existingProfiles);

      if (collisions.length > 0) {
        setPendingImport({ parsed, collisions });
        return;
      }

      const result = applyImport(parsed, 'overwrite');
      handleImportComplete(result.message, result.importedModuleId);
    } catch (err) {
      console.error('Navbar JSON import error:', err);
      setResetToast(err instanceof Error ? err.message : 'Failed to import JSON file');
      setTimeout(() => setResetToast(null), 4000);
    } finally {
      if (jsonFileInputRef.current) {
        jsonFileInputRef.current.value = '';
      }
    }
  };

  // Page index within the active module
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  // Accordion state: map of question ID to boolean open/closed
  const [openQuestionIds, setOpenQuestionIds] = useState<Record<number, boolean>>({});

  // Sync session progress when switching modules
  useEffect(() => {
    setCurrentPageIndex(0);
    setOpenQuestionIds({});
    setSessionProgress(loadModuleProgress(activeModule.id));
    setExamStatus('off');
    setFilterMissedOnly(false);
  }, [activeModule.id]);

  // Persist session progress whenever it changes
  useEffect(() => {
    if (activeModule?.id) {
      saveModuleProgress(activeModule.id, sessionProgress);
    }
  }, [activeModule?.id, sessionProgress]);

  // Exam countdown timer
  useEffect(() => {
    if (examStatus !== 'active') return;
    const interval = setInterval(() => {
      setExamElapsedSeconds((prev) => prev + 1);
      if (examDurationMinutes > 0) {
        setExamRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setExamStatus('submitted');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [examStatus, examDurationMinutes]);

  // PubChem inspector modal state
  const [inspectedStructure, setInspectedStructure] = useState<ChemicalStructure | null>(null);
  const [isPubChemModalOpen, setIsPubChemModalOpen] = useState(false);

  // AI Tutor slide-over state
  const [showTutor, setShowTutor] = useState<boolean>(false);

  // Pharmacophore Explorer Sidebar Tool State
  const [isPharmacophoreExplorerOpen, setIsPharmacophoreExplorerOpen] = useState<boolean>(false);
  const [globalActivePharmacophores, setGlobalActivePharmacophores] = useState<
    Record<string, ColorPaletteItem>
  >({});
  const [hoveredGlobalPharmacophoreId, setHoveredGlobalPharmacophoreId] = useState<string | null>(
    null
  );
  const [focusMatchingOnly, setFocusMatchingOnly] = useState<boolean>(false);

  const handleToggleGlobalPharmacophore = (gp: GlobalPharmacophore) => {
    setGlobalActivePharmacophores((prev) => {
      const copy = { ...prev };
      if (copy[gp.id]) {
        delete copy[gp.id];
        return copy;
      }
      const usedHexes = new Set(Object.values(copy).map((c) => c.hex));
      const nextColor =
        PHARMACOPHORE_COLOR_PALETTE.find((c) => !usedHexes.has(c.hex)) ||
        PHARMACOPHORE_COLOR_PALETTE[
          Object.keys(copy).length % PHARMACOPHORE_COLOR_PALETTE.length
        ];
      copy[gp.id] = nextColor;
      return copy;
    });
  };

  const handleClearAllGlobal = () => {
    setGlobalActivePharmacophores({});
    setHoveredGlobalPharmacophoreId(null);
  };

  // Theme synchronization
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.style.colorScheme = theme;
    saveTheme(theme);
  }, [theme]);

  // Structure image canvas background and bond stroke synchronization
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const isDark = theme === 'dark';
    const effectiveBg = isDark
      ? (lockObsidian ? '#0f172a' : structureImageDarkBg)
      : structureImageBg;
    const effectiveBond = isDark ? bondDarkColor : bondLightColor;

    document.documentElement.style.setProperty('--structure-canvas-bg', effectiveBg);
    document.documentElement.style.setProperty('--structure-bond-stroke', effectiveBond);
  }, [theme, structureImageBg, structureImageDarkBg, lockObsidian, bondLightColor, bondDarkColor]);

  const handleUpdateStructureImageBg = (color: string) => {
    setStructureImageBg(color);
    saveStructureImageBg(color);
  };

  const handleUpdateStructureImageDarkBg = (color: string) => {
    setStructureImageDarkBg(color);
    saveStructureImageDarkBg(color);
  };

  const handleToggleLockObsidian = (locked: boolean) => {
    setLockObsidian(locked);
    saveStructureLockObsidian(locked);
  };

  const handleUpdateBondLightColor = (color: string) => {
    setBondLightColor(color);
    saveBondLightColor(color);
  };

  const handleUpdateBondDarkColor = (color: string) => {
    setBondDarkColor(color);
    saveBondDarkColor(color);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Collect all unique structures across the entire module for side-by-side comparison
  const allModuleStructures = useMemo(() => {
    const map = new Map<string, ChemicalStructure>();
    (activeModule?.pages || []).forEach((p) => {
      p.sections.forEach((sec) => {
        (sec.local_structures || sec.structures || []).forEach((s) => {
          map.set(`${s.id}_${s.name}`, s);
        });
        sec.questions.forEach((q) => {
          (q.structuresDisplayed || []).forEach((s) => {
            map.set(`${s.id}_${s.name}`, s);
          });
        });
      });
    });
    return sortStructuresByDocumentLabel(Array.from(map.values()));
  }, [activeModule]);

  // Collect all questions across the entire module for global progress & exam grading
  const allModuleQuestions = useMemo(() => {
    const list: { pageIndex: number; question: AntiplateletQuestion }[] = [];
    (activeModule?.pages || []).forEach((p, pIdx) => {
      p.sections.forEach((sec) => {
        sec.questions.forEach((q) => {
          list.push({ pageIndex: pIdx, question: q });
        });
      });
    });
    return list;
  }, [activeModule]);

  // Evaluate per-question completion & score
  const questionStats = useMemo(() => {
    let answeredQuestions = 0;
    let fullyCorrectQuestions = 0;
    let totalPointsEarned = 0;
    let totalPointsPossible = 0;
    const byId: Record<
      number,
      { isAnswered: boolean; isFullyCorrect: boolean; earned: number; possible: number }
    > = {};

    allModuleQuestions.forEach(({ question: q }) => {
      let earned = 0;
      let possible = 0;
      let isAnswered = false;

      // 1. Multiple Choice
      if (q.type === 'multiple-choice' && q.options) {
        possible += 1;
        const sel = sessionProgress.mcAnswers[q.id];
        if (sel !== undefined && sel !== null) {
          isAnswered = true;
          if (sel === q.correctIndex) earned += 1;
        }
      }

      // 2. True/False Sub-Statements
      if (q.type === 'sub-statements' && q.subStatements) {
        possible += q.subStatements.length;
        const tfMap = sessionProgress.tfAnswers[q.id] || {};
        const answeredCount = Object.keys(tfMap).length;
        if (answeredCount > 0) isAnswered = true;
        q.subStatements.forEach((stmt) => {
          if (tfMap[stmt.id] === stmt.isCorrect) earned += 1;
        });
      }

      // 3. Structure Matching
      if (q.type === 'matching' && q.matchingTargets) {
        const reqCount = q.matchingTargets.reduce(
          (acc, t) => acc + t.acceptedStructureIds.length,
          0
        );
        possible += Math.max(1, reqCount);
        const matchMap = sessionProgress.matchingAnswers[q.id] || {};
        const placedList = Object.values(matchMap).flat();
        if (placedList.length > 0) isAnswered = true;
        q.matchingTargets.forEach((t) => {
          const placedHere = matchMap[t.id] || [];
          placedHere.forEach((sId) => {
            if (t.acceptedStructureIds.includes(sId)) earned += 1;
          });
        });
      }

      // 4. Interactive Ranking (if present)
      if (q.rankingItems && q.rankingItems.length > 0) {
        possible += q.rankingItems.length;
        const order = sessionProgress.rankingAnswers[q.id];
        if (order && order.length > 0) {
          isAnswered = true;
          const itemMap = new Map(q.rankingItems.map((it) => [it.id, it]));
          order.forEach((id, idx) => {
            const it = itemMap.get(id);
            if (it && it.correctRank === idx + 1) earned += 1;
          });
        }
      }

      const isFullyCorrect = isAnswered && possible > 0 && earned === possible;
      if (isAnswered) answeredQuestions += 1;
      if (isFullyCorrect) fullyCorrectQuestions += 1;
      totalPointsEarned += earned;
      totalPointsPossible += possible;

      byId[q.id] = { isAnswered, isFullyCorrect, earned, possible };
    });

    return {
      answeredQuestions,
      totalQuestions: allModuleQuestions.length,
      fullyCorrectQuestions,
      totalPointsEarned,
      totalPointsPossible,
      percentage:
        totalPointsPossible > 0
          ? Math.round((totalPointsEarned / totalPointsPossible) * 100)
          : 0,
      byId,
    };
  }, [allModuleQuestions, sessionProgress]);

  // Reset Quiz Handler
  const handleResetQuiz = () => {
    React.startTransition(() => {
      setOpenQuestionIds({});
      setQuizKey((k) => k + 1);
      clearModuleProgress(activeModule.id);
      setSessionProgress(getEmptySessionProgress());
      setExamStatus('off');
      setFilterMissedOnly(false);
      setResetToast('Quiz reset! All answers cleared & accordions collapsed.');
    });
    setTimeout(() => setResetToast(null), 3000);
  };

  // Start Timed Exam Simulation Mode
  const handleStartExam = (minutes: number) => {
    React.startTransition(() => {
      setOpenQuestionIds({});
      clearModuleProgress(activeModule.id);
      setSessionProgress(getEmptySessionProgress());
      setExamDurationMinutes(minutes);
      setExamRemainingSeconds(minutes * 60);
      setExamElapsedSeconds(0);
      setHideDrugNames(true);
      setShowTutor(false);
      setFilterMissedOnly(false);
      setExamStatus('active');
      setIsExamSetupOpen(false);
      setCurrentPageIndex(0);
    });
  };

  // Submit & Grade Exam
  const handleSubmitExam = () => {
    React.startTransition(() => {
      setExamStatus('submitted');
      setHideDrugNames(false);
    });
  };

  // Exit Exam Mode back to Study Mode
  const handleExitExam = () => {
    React.startTransition(() => {
      setExamStatus('off');
      setHideDrugNames(false);
      setFilterMissedOnly(false);
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const pages = activeModule?.pages || [];
  const safePageIndex = Math.min(Math.max(0, currentPageIndex), Math.max(0, pages.length - 1));
  const currentPage: ReviewPage | undefined = pages[safePageIndex];

  // Toggle individual question accordion
  const toggleQuestion = (qId: number) => {
    if (examStatus === 'active') return;
    React.startTransition(() => {
      setOpenQuestionIds((prev) => ({
        ...prev,
        [qId]: !prev[qId],
      }));
    });
  };

  // Expand all questions on current page
  const handleExpandAllOnPage = () => {
    if (!currentPage || examStatus === 'active') return;
    React.startTransition(() => {
      const updated = { ...openQuestionIds };
      currentPage.sections.forEach((sec) => {
        sec.questions.forEach((q) => {
          updated[q.id] = true;
        });
      });
      setOpenQuestionIds(updated);
    });
  };

  // Collapse all questions on current page
  const handleCollapseAllOnPage = () => {
    if (!currentPage) return;
    React.startTransition(() => {
      const updated = { ...openQuestionIds };
      currentPage.sections.forEach((sec) => {
        sec.questions.forEach((q) => {
          updated[q.id] = false;
        });
      });
      setOpenQuestionIds(updated);
    });
  };

  const handleOpenPubChem = (structure?: ChemicalStructure) => {
    if (examStatus === 'active') return;
    setInspectedStructure(structure || null);
    setIsPubChemModalOpen(true);
  };

  const handleSwitchModule = (modId: string) => {
    setActiveModuleId(modId);
    saveActiveModuleId(modId);
    setIsModuleDropdownOpen(false);
  };

  const handleModuleImported = (newMod: ReviewModule) => {
    saveReviewModule(newMod);
    queryClient.invalidateQueries({ queryKey: ['modules'] });
    setActiveModuleId(newMod.id);
    saveActiveModuleId(newMod.id);
  };

  const handleSaveEditedModule = (updatedMod: ReviewModule) => {
    saveReviewModule(updatedMod);
    queryClient.invalidateQueries({ queryKey: ['modules'] });
    setResetToast('Module changes saved!');
    setTimeout(() => setResetToast(null), 3000);
  };

  // TanStack Query Mutation for safe module deletion and cache invalidation
  const deleteModuleMutation = useMutation({
    mutationFn: async (modId: string) => {
      deleteReviewModule(modId);
      return modId;
    },
    onSuccess: (deletedId) => {
      // Strictly invalidate the 'modules' query to trigger a clean background refetch
      // instead of mutating state locally, preventing reconciliation bugs
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      const remaining = loadAllReviewModules();
      if (activeModuleId === deletedId) {
        const nextId = remaining[0]?.id || 'antiplatelets_mcp2';
        setActiveModuleId(nextId);
        saveActiveModuleId(nextId);
      }
      setConfirmDeleteModuleId(null);
      setResetToast('Module removed from library.');
      setTimeout(() => setResetToast(null), 3000);
    },
    onError: (err: any) => {
      console.error('Failed to delete module:', err);
    },
  });

  const handleDeleteModule = (modId: string) => {
    deleteModuleMutation.mutate(modId);
  };

  const handleDeleteCustomModule = (modId: string) => {
    deleteModuleMutation.mutate(modId);
  };

  const handleResetBuiltIn = (modId: string) => {
    resetBuiltInModule(modId);
    queryClient.invalidateQueries({ queryKey: ['modules'] });
    setResetToast('Restored factory module defaults.');
    setTimeout(() => setResetToast(null), 3000);
  };

  const handleUpdateStructure = (updatedStr: ChemicalStructure) => {
    if (!activeModule) return;
    const nextMod: ReviewModule = {
      ...activeModule,
      pages: activeModule.pages.map((p) => ({
        ...p,
        sections: p.sections.map((sec) => ({
          ...sec,
          structures: (sec.structures || []).map((s) =>
            s.id === updatedStr.id ? updatedStr : s
          ),
          questions: sec.questions.map((q) => ({
            ...q,
            structuresDisplayed: (q.structuresDisplayed || []).map((s) =>
              s.id === updatedStr.id ? updatedStr : s
            ),
          })),
        })),
      })),
    };
    saveReviewModule(nextMod);
    queryClient.invalidateQueries({ queryKey: ['modules'] });
  };

  // Non-blocking background ingestion runner
  const [backgroundIngestion, setBackgroundIngestion] = useState<BackgroundIngestionState | null>(null);
  const backgroundAbortControllerRef = useRef<AbortController | null>(null);

  const handleStartBackgroundIngest = async (file: File) => {
    if (backgroundAbortControllerRef.current) {
      backgroundAbortControllerRef.current.abort();
    }
    const controller = new AbortController();
    backgroundAbortControllerRef.current = controller;

    setBackgroundIngestion({
      status: 'ingesting',
      progressPercent: 10,
      message: `Parsing ${file.name} in background...`,
      fileName: file.name,
    });

    try {
      const result = await processFileAndGenerateQuestions(
        file,
        (progress) => {
          const percent =
            progress.totalSlides > 0
              ? Math.min(98, Math.round((progress.currentSlide / progress.totalSlides) * 100))
              : progress.stage === 'parsing'
              ? 15
              : progress.stage === 'extracting'
              ? 35
              : progress.stage === 'merging'
              ? 50
              : progress.stage === 'enriching'
              ? 70
              : progress.stage === 'generating-quiz'
              ? 85
              : progress.stage === 'complete'
              ? 100
              : 25;

          setBackgroundIngestion((prev) =>
            prev
              ? {
                  ...prev,
                  status: 'ingesting',
                  progressPercent: percent,
                  message: progress.message,
                }
              : null
          );
        },
        controller.signal
      );

      if (result.reviewModule) {
        saveReviewModule(result.reviewModule);
        queryClient.invalidateQueries({ queryKey: ['modules'] });
        setActiveModuleId(result.reviewModule.id);
        saveActiveModuleId(result.reviewModule.id);
        setBackgroundIngestion({
          status: 'completed',
          progressPercent: 100,
          message: `Successfully imported "${result.reviewModule.title}"!`,
          fileName: file.name,
        });

        setTimeout(() => {
          setBackgroundIngestion((curr) =>
            curr?.status === 'completed' ? null : curr
          );
        }, 6000);
      }
    } catch (err: any) {
      if (controller.signal.aborted) {
        setBackgroundIngestion(null);
        return;
      }
      console.error('Background ingestion error:', err);
      setBackgroundIngestion({
        status: 'error',
        progressPercent: 0,
        message: err?.message || 'Ingestion encountered an error.',
        fileName: file.name,
        error: err?.message || 'Unknown error',
      });
    }
  };

  // All questions on current page
  const allCurrentQuestions = useMemo(() => {
    if (!currentPage) return [];
    const qList: AntiplateletQuestion[] = [];
    currentPage.sections.forEach((sec) => {
      sec.questions.forEach((q) => qList.push(q));
    });
    return qList;
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-150">
      {/* ---------------------------------------------------- */}
      {/* 1. TOP APP BAR & MODULE SWITCHER (NAVBAR)           */}
      {/* ---------------------------------------------------- */}
      <Navbar
        courseCode="MCP II"
        activeModule={activeModule}
        modules={modules}
        onSwitchModule={(id) => React.startTransition(() => handleSwitchModule(id))}
        onDeleteModule={handleDeleteModule}
        onRestoreDefaultModule={() => {
          restoreBuiltInModule('antiplatelets_mcp2');
          queryClient.invalidateQueries({ queryKey: ['modules'] });
          setResetToast('Restored default Antiplatelets module.');
          setTimeout(() => setResetToast(null), 3000);
        }}
        canRestoreDefault={getHiddenBuiltins().includes('antiplatelets_mcp2')}
        onOpenImporter={() => setIsImporterOpen(true)}
        onOpenEditor={() => {
          setEditingQuestionId(null);
          setIsEditorOpen(true);
        }}
        onOpenQuizSetup={() => setIsDocumentStudioOpen(true)}
        activeTab={activeTab === 'pubchem-inspector' ? 'document-review' : activeTab}
        onSelectTab={(tab) => switchTab(tab)}
        pagesCount={pages.length}
        showKnowledgeGraph={showKnowledgeGraph}
        hideDrugNames={hideDrugNames}
        onToggleHideDrugNames={() => setHideDrugNames(!hideDrugNames)}
        examStatus={examStatus}
        examDurationMinutes={examDurationMinutes}
        examRemainingSeconds={examRemainingSeconds}
        examElapsedSeconds={examElapsedSeconds}
        isExamSetupOpen={isExamSetupOpen}
        onToggleExamSetup={() => setIsExamSetupOpen(!isExamSetupOpen)}
        onStartExam={handleStartExam}
        onSubmitExam={handleSubmitExam}
        formatTime={formatTime}
        allQuestionsCount={allModuleQuestions.length}
        showTutor={showTutor}
        onToggleTutor={() => setShowTutor(!showTutor)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPubChem={() => handleOpenPubChem()}
        onOpenImportJson={() => jsonFileInputRef.current?.click()}
      />

      {/* Hidden Global JSON Import File Input (triggered from Navbar or shortcuts) */}
      <input
        type="file"
        ref={jsonFileInputRef}
        onChange={handleNavbarImportFileSelected}
        accept=".json,application/json"
        className="hidden"
        id="global-json-import-input"
      />

      {/* Reset Toast Feedback */}
      {resetToast && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xl border border-slate-700 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{resetToast}</span>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. MAIN DOCUMENT WORKSPACE                           */}
      {/* ---------------------------------------------------- */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* ==================================================== */}
        {/* ACTIVE EXAM SIMULATION STICKY STATUS BAR             */}
        {/* ==================================================== */}
        {examStatus === 'active' && (
          <div className="sticky top-16 z-30 bg-amber-950 text-amber-50 border border-amber-700 rounded-xl p-3.5 shadow-lg flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 font-mono font-bold text-xs text-amber-300 flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>EXAM SIMULATION ACTIVE</span>
              </span>
              <div className="text-xs">
                <span className="text-amber-200/80">Time: </span>
                <span
                  className={`font-mono tabular-nums font-bold text-sm ${
                    examDurationMinutes > 0 && examRemainingSeconds < 120
                      ? 'text-rose-400'
                      : 'text-white'
                  }`}
                >
                  {examDurationMinutes > 0
                    ? `${formatTime(examRemainingSeconds)} remaining`
                    : `${formatTime(examElapsedSeconds)} elapsed`}
                </span>
                <span className="mx-2 text-amber-700">|</span>
                <span className="font-mono tabular-nums font-semibold text-amber-200">
                  {questionStats.answeredQuestions} / {questionStats.totalQuestions} Questions Answered
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExitExam}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-900/70 hover:bg-amber-900 text-amber-200 border border-amber-700 transition-colors cursor-pointer"
              >
                Cancel Exam
              </button>
              <button
                type="button"
                onClick={handleSubmitExam}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-colors shadow-sm cursor-pointer"
              >
                Submit Exam &amp; Grade Now
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* GRADED EXAM SUMMARY REPORT BANNER                    */}
        {/* ==================================================== */}
        {examStatus === 'submitted' && (
          <div className="bg-white dark:bg-slate-900 border-2 border-blue-600 dark:border-blue-500 rounded-2xl p-5 shadow-md space-y-4 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-600 text-white">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                    Official Exam Simulation Results
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {activeModule.title} — Graded Breakdown
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-4 font-mono tabular-nums">
                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 block">
                    Overall Score
                  </span>
                  <span
                    className={`text-2xl font-black ${
                      questionStats.percentage >= 80
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : questionStats.percentage >= 65
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {questionStats.percentage}%
                  </span>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
                <div className="text-right text-xs">
                  <div>
                    <strong>{questionStats.totalPointsEarned}</strong> /{' '}
                    {questionStats.totalPointsPossible} pts
                  </div>
                  <div className="text-slate-500">
                    Time: {formatTime(examElapsedSeconds)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {questionStats.fullyCorrectQuestions} Questions 100% Correct
                  </span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-mono font-semibold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>
                    {questionStats.totalQuestions - questionStats.fullyCorrectQuestions}{' '}
                    Questions with Missed/Unanswered Items
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilterMissedOnly(!filterMissedOnly)}
                  className={`px-3 py-1.5 rounded-lg font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    filterMissedOnly
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>
                    {filterMissedOnly
                      ? 'Showing Missed Questions Only'
                      : 'Filter Missed Questions'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleExpandAllOnPage}
                  className="px-3 py-1.5 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                  Expand Page Rationales
                </button>
                <button
                  type="button"
                  onClick={handleExitExam}
                  className="px-3 py-1.5 rounded-lg font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Return to Study Mode
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 1: DOCUMENT REVIEW VIEW                          */}
        {/* ==================================================== */}
        {activeTab === 'document-review' && currentPage && (
          <div className="space-y-6">
            {/* Page Navigation & Live Session Score Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-3 shadow-xs space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 px-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>Select Document Page:</span>
                </span>

                {/* Live Study Progress & Missed Filter */}
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-mono tabular-nums text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                    Answered: {questionStats.answeredQuestions}/{questionStats.totalQuestions}
                  </span>
                  {examStatus !== 'active' && questionStats.answeredQuestions > 0 && (
                    <>
                      <span className="font-mono tabular-nums text-[11px] px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
                        Score: {questionStats.totalPointsEarned}/{questionStats.totalPointsPossible} pts ({questionStats.percentage}%)
                      </span>
                      <button
                        type="button"
                        onClick={() => setFilterMissedOnly(!filterMissedOnly)}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded border flex items-center gap-1 transition-colors cursor-pointer ${
                          filterMissedOnly
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Filter className="w-3 h-3" />
                        <span>{filterMissedOnly ? 'Missed Only' : 'Review Missed'}</span>
                      </button>
                    </>
                  )}
                  <span className="font-mono tabular-nums">
                    Page {currentPage.pageNumber} of {pages.length}
                  </span>
                </div>
              </div>

              {/* Dynamic Page Buttons for 1..N pages */}
              <div
                className={`grid gap-1.5 ${
                  pages.length <= 4
                    ? 'grid-cols-2 sm:grid-cols-4'
                    : pages.length <= 7
                    ? 'grid-cols-4 sm:grid-cols-7'
                    : 'grid-cols-4 sm:grid-cols-8'
                }`}
              >
                {pages.map((page, idx) => {
                  const pageQs = page.sections.flatMap((s) => s.questions);
                  const answeredOnPage = pageQs.filter(
                    (q) => questionStats.byId[q.id]?.isAnswered
                  ).length;
                  return (
                    <button
                      key={page.pageNumber || idx}
                      onClick={() => setCurrentPageIndex(idx)}
                      className={`py-2 px-1 rounded-lg text-xs font-bold transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                        currentPageIndex === idx
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60'
                      }`}
                    >
                      <span>Page {page.pageNumber}</span>
                      {pageQs.length > 0 && (
                        <span className="font-mono tabular-nums text-[10px] opacity-75 font-normal">
                          {answeredOnPage}/{pageQs.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Authentic Academic Exam Document Sheet */}
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-10 space-y-8">
              {/* Document Header (Exact Academic Exam Style) */}
              <div className="text-center pb-4 border-b-2 border-slate-900 dark:border-slate-100 space-y-1">
                <h1 className="text-xl sm:text-2xl font-serif font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                  {activeModule.title}
                </h1>
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-800 mt-2">
                  <span>{activeModule.course}</span>
                  <span>{activeModule.semester}</span>
                  <span className="font-mono">{activeModule.code || 'MCP'}</span>
                </div>
              </div>

              {/* Page Subtitle Note */}
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono text-center">
                {currentPage.pageTitle} · {currentPage.subtitle}
              </div>

              {/* Page Sections (Structures & Questions) */}
              <div className="space-y-8">
                {currentPage.sections.map((section, sIdx) => {
                  const blockStructures = section.local_structures || section.structures || [];
                  const blockInstructions = section.block_instructions || section.headerNote;
                  const visibleQuestions = filterMissedOnly
                    ? section.questions.filter(
                        (q) => !questionStats.byId[q.id]?.isFullyCorrect
                      )
                    : section.questions;
                  const sectionKey = `sec_${sIdx}_${section.sectionTitle || ''}`;
                  const currentComp = sectionComparatorKeys[sectionKey] || {};

                  return (
                    <div key={sIdx} className="space-y-5">
                      {/* Section Marker / Header Note */}
                      {section.sectionTitle && (
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-1 flex items-center justify-between">
                          <span>{section.sectionTitle}</span>
                          {blockStructures.length > 0 && (
                            <span className="text-[11px] font-mono text-slate-400 font-normal">
                              {blockStructures.length} local structure{blockStructures.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      )}

                      {blockInstructions && (
                        <div className="p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-150 dark:border-indigo-900/40 text-xs sm:text-sm font-serif italic text-slate-800 dark:text-slate-200 flex items-start gap-2">
                          <span className="font-sans font-bold uppercase tracking-wider text-[10px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded shrink-0 not-italic">
                            Instructions
                          </span>
                          <span className="leading-relaxed">{blockInstructions}</span>
                        </div>
                      )}

                      {/* Chemical Structures (Horizontal Focus Stage with Clean Canvas & Selectable Drug Grid) */}
                      {blockStructures.length > 0 && (
                        <StructureComparator
                          moduleStructures={blockStructures}
                          allStructures={allModuleStructures}
                          hideDrugName={hideDrugNames}
                          examModeActive={examStatus === 'active'}
                          onInspectStructure={handleOpenPubChem}
                          globalActivePharmacophores={globalActivePharmacophores}
                          globalHoveredPharmacophoreId={hoveredGlobalPharmacophoreId}
                          focusMatchingOnly={focusMatchingOnly}
                          drugAKey={currentComp.drugAKey}
                          drugBKey={currentComp.drugBKey}
                          onSelectDrugA={(key) =>
                            setSectionComparatorKeys((prev) => ({
                              ...prev,
                              [sectionKey]: { ...prev[sectionKey], drugAKey: key },
                            }))
                          }
                          onSelectDrugB={(key) =>
                            setSectionComparatorKeys((prev) => ({
                              ...prev,
                              [sectionKey]: { ...prev[sectionKey], drugBKey: key },
                            }))
                          }
                        />
                      )}

                      {/* Horizontal Structure Vignette (Directly below Contrast section & above Questions) */}
                      <HorizontalStructureVignette
                        questions={visibleQuestions}
                        blockStructures={blockStructures}
                        hydratedDrugs={hydratedDrugs}
                        selectedDrugAKey={currentComp.drugAKey}
                        selectedDrugBKey={currentComp.drugBKey}
                        onSelectDrugA={(key) =>
                          setSectionComparatorKeys((prev) => ({
                            ...prev,
                            [sectionKey]: { ...prev[sectionKey], drugAKey: key },
                          }))
                        }
                        onSelectDrugB={(key) =>
                          setSectionComparatorKeys((prev) => ({
                            ...prev,
                            [sectionKey]: { ...prev[sectionKey], drugBKey: key },
                          }))
                        }
                      />

                      {/* Questions on this section */}
                      <div className="space-y-4 pt-1">
                        {visibleQuestions.length === 0 && filterMissedOnly ? (
                          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 text-center font-semibold">
                            ✓ All questions in this section were answered 100% correctly!
                          </div>
                        ) : (
                          visibleQuestions.map((q) => (
                            <DocumentQuestionItem
                              key={`${q.id}_${quizKey}`}
                              question={q}
                              isOpen={Boolean(openQuestionIds[q.id])}
                              onToggle={() => toggleQuestion(q.id)}
                              hideDrugNames={hideDrugNames}
                              examModeStatus={examStatus}
                              onInspectStructure={handleOpenPubChem}
                              allSectionStructures={blockStructures}
                              allModuleStructures={blockStructures}
                              globalActivePharmacophores={globalActivePharmacophores}
                              globalHoveredPharmacophoreId={hoveredGlobalPharmacophoreId}
                              focusMatchingOnly={focusMatchingOnly}
                              mcSelection={
                                sessionProgress.mcAnswers[q.id] !== undefined
                                  ? sessionProgress.mcAnswers[q.id]
                                  : null
                              }
                              onMcSelect={(optIdx) =>
                                setSessionProgress((prev) => {
                                  const nextMc = { ...prev.mcAnswers };
                                  if (optIdx === null) delete nextMc[q.id];
                                  else nextMc[q.id] = optIdx;
                                  return { ...prev, mcAnswers: nextMc };
                                })
                              }
                              tfAnswers={sessionProgress.tfAnswers[q.id] || {}}
                              onTfSelect={(nextTf) =>
                                setSessionProgress((prev) => ({
                                  ...prev,
                                  tfAnswers: { ...prev.tfAnswers, [q.id]: nextTf },
                                }))
                              }
                              matchingPlacements={
                                sessionProgress.matchingAnswers[q.id] || {}
                              }
                              onMatchingChange={(nextMatch) =>
                                setSessionProgress((prev) => ({
                                  ...prev,
                                  matchingAnswers: {
                                    ...prev.matchingAnswers,
                                    [q.id]: nextMatch,
                                  },
                                }))
                              }
                              rankingOrder={sessionProgress.rankingAnswers[q.id]}
                              onRankingChange={(nextOrder) =>
                                setSessionProgress((prev) => ({
                                  ...prev,
                                  rankingAnswers: {
                                    ...prev.rankingAnswers,
                                    [q.id]: nextOrder,
                                  },
                                }))
                              }
                              rankingChecked={Boolean(
                                sessionProgress.rankingChecked?.[q.id]
                              )}
                              onRankingCheck={(checked) =>
                                setSessionProgress((prev) => ({
                                  ...prev,
                                  rankingChecked: {
                                    ...(prev.rankingChecked || {}),
                                    [q.id]: checked,
                                  },
                                }))
                              }
                              onEditQuestion={(targetQ) => {
                                setEditingQuestionId(targetQ.id);
                                setIsEditorOpen(true);
                              }}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ---------------------------------------------------- */}
              {/* BOTTOM CONTROLS & MASTER ACCORDION TOOLBAR           */}
              {/* ---------------------------------------------------- */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Previous Page Button */}
                <button
                  onClick={() => React.startTransition(() => setCurrentPageIndex((prev) => Math.max(0, prev - 1)))}
                  disabled={currentPageIndex === 0}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous Page</span>
                </button>

                {/* Master Accordion Buttons (Hidden during active blind exam) */}
                {examStatus !== 'active' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExpandAllOnPage}
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                      <span>Expand All Answers</span>
                    </button>
                    <button
                      onClick={handleCollapseAllOnPage}
                      className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>Collapse All</span>
                    </button>
                  </div>
                )}

                {/* Next Page Button */}
                <button
                  onClick={() =>
                    React.startTransition(() =>
                      setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))
                    )
                  }
                  disabled={currentPageIndex === pages.length - 1}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <span>Next Page</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: STRUCTURE & PK/PD COMPARISON MATRIX           */}
        {/* ==================================================== */}
        {activeTab === 'matrix' && examStatus !== 'active' && (
          <React.Suspense
            fallback={
              <div className="p-12 text-center text-sm font-semibold text-slate-500 animate-pulse">
                Loading Structure & PK/PD Matrix...
              </div>
            }
          >
            <AntiplateletMatrixView
              moduleStructures={allModuleStructures}
              moduleTitle={activeModule?.title}
              onInspectStructure={handleOpenPubChem}
              globalActivePharmacophores={globalActivePharmacophores}
              globalHoveredPharmacophoreId={hoveredGlobalPharmacophoreId}
              focusMatchingOnly={focusMatchingOnly}
              onOpenPharmacophoreExplorer={() => setIsPharmacophoreExplorerOpen(true)}
              pharmacophoreCount={Object.keys(globalActivePharmacophores).length}
            />
          </React.Suspense>
        )}

        {/* ==================================================== */}
        {/* TAB 3: PHARMACOLOGY KNOWLEDGE GRAPH                 */}
        {/* ==================================================== */}
        {activeTab === 'knowledge-graph' && showKnowledgeGraph && examStatus !== 'active' && (
          <React.Suspense
            fallback={
              <div className="p-12 text-center text-sm font-semibold text-slate-500 animate-pulse">
                Loading Knowledge Graph Explorer...
              </div>
            }
          >
            <KnowledgeGraphExplorer />
          </React.Suspense>
        )}

        {/* ==================================================== */}
        {/* TAB 4: DASHBOARD & DECK MANAGER                      */}
        {/* ==================================================== */}
        {activeTab === 'dashboard' && examStatus !== 'active' && (
          <React.Suspense
            fallback={
              <div className="p-12 text-center text-sm font-semibold text-slate-500 animate-pulse">
                Loading Dashboard...
              </div>
            }
          >
            <Dashboard
              activeModuleId={activeModule?.id}
              onSelectModule={(id) => {
                setActiveModuleId(id);
                saveActiveModuleId(id);
              }}
              onEditModule={(id) => {
                setActiveModuleId(id);
                setEditingQuestionId(null);
                setIsEditorOpen(true);
              }}
              onStartBackgroundIngest={handleStartBackgroundIngest}
              onNavigateToTab={(tab) => switchTab(tab)}
              onDeleteModuleSuccess={(deletedId) => {
                if (activeModuleId === deletedId) {
                  const remaining = modules.filter((m) => m.id !== deletedId);
                  const nextId = remaining[0]?.id || 'antiplatelets_mcp2';
                  setActiveModuleId(nextId);
                  saveActiveModuleId(nextId);
                }
              }}
              isIngesting={backgroundIngestion?.status === 'ingesting'}
              ingestionProgressPercent={backgroundIngestion?.progressPercent || 0}
              ingestionMessage={backgroundIngestion?.message || ''}
            />
          </React.Suspense>
        )}

        {/* ==================================================== */}
        {/* DOCKED / SLIDE-OVER AI MEDCHEM TUTOR PANEL          */}
        {/* ==================================================== */}
        {showTutor && examStatus !== 'active' && (
          <React.Suspense fallback={null}>
            <div className="pt-2 animate-fadeIn">
              <AITutorPanel
                currentQuestion={allCurrentQuestions[0]}
                topicTitle={`Medicinal Chemistry: ${activeModule.title}`}
                isOpen={showTutor}
                onToggle={() => setShowTutor(!showTutor)}
              />
            </div>
          </React.Suspense>
        )}
      </main>

      {/* ---------------------------------------------------- */}
      {/* PHARMACOPHORE EXPLORER SIDEBAR TOOL                  */}
      {/* ---------------------------------------------------- */}
      {isPharmacophoreExplorerOpen && (
        <React.Suspense fallback={null}>
          <PharmacophoreExplorerSidebar
            isOpen={isPharmacophoreExplorerOpen}
            onClose={() => setIsPharmacophoreExplorerOpen(false)}
            allModuleStructures={allModuleStructures}
            activeGlobalPharmacophores={globalActivePharmacophores}
            onToggleGlobalPharmacophore={handleToggleGlobalPharmacophore}
            onClearAllGlobal={handleClearAllGlobal}
            hoveredGlobalPharmacophoreId={hoveredGlobalPharmacophoreId}
            onHoverGlobalPharmacophore={setHoveredGlobalPharmacophoreId}
            focusMatchingOnly={focusMatchingOnly}
            onToggleFocusMatchingOnly={() => setFocusMatchingOnly(!focusMatchingOnly)}
            onSelectDrugStructure={(structure) => {
              handleOpenPubChem(structure);
            }}
          />
        </React.Suspense>
      )}

      {/* ---------------------------------------------------- */}
      {/* NIH PUBCHEM CHEMICAL INSPECTOR MODAL                 */}
      {/* ---------------------------------------------------- */}
      {isPubChemModalOpen && (
        <React.Suspense fallback={null}>
          <PubChemInspectorModal
            initialStructure={inspectedStructure}
            isOpen={isPubChemModalOpen}
            onClose={() => setIsPubChemModalOpen(false)}
          />
        </React.Suspense>
      )}

      {/* ---------------------------------------------------- */}
      {/* LECTURE REVIEW & QUIZ SETUP MODAL                    */}
      {/* ---------------------------------------------------- */}
      {(isDocumentStudioOpen || isImporterOpen) && (
        <React.Suspense fallback={null}>
          <DocumentStudioModal
            isOpen={isDocumentStudioOpen || isImporterOpen}
            onClose={() => {
              setIsDocumentStudioOpen(false);
              setIsImporterOpen(false);
            }}
            onModuleImported={handleModuleImported}
            onStartBackgroundIngest={handleStartBackgroundIngest}
          />
        </React.Suspense>
      )}

      {/* ---------------------------------------------------- */}
      {/* SETTINGS & PREFERENCES MODAL                         */}
      {/* ---------------------------------------------------- */}
      {isSettingsOpen && (
        <React.Suspense fallback={null}>
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            theme={theme}
            onToggleTheme={toggleTheme}
            hideDrugNames={hideDrugNames}
            onToggleHideDrugNames={() => setHideDrugNames(!hideDrugNames)}
            showKnowledgeGraph={showKnowledgeGraph}
            onToggleShowKnowledgeGraph={handleToggleShowKnowledgeGraph}
            onResetQuiz={handleResetQuiz}
            onOpenEditor={() => {
              setEditingQuestionId(null);
              setIsEditorOpen(true);
            }}
            activeModuleTitle={activeModule.title}
            totalQuestions={questionStats.totalQuestions}
            answeredQuestions={questionStats.answeredQuestions}
            activeModule={activeModule}
            allModules={modules}
            structureImageBg={structureImageBg}
            onUpdateStructureImageBg={handleUpdateStructureImageBg}
            onImportComplete={handleImportComplete}
            onImportCollision={(parsed, collisions) => setPendingImport({ parsed, collisions })}
          />
        </React.Suspense>
      )}

      {/* ---------------------------------------------------- */}
      {/* IMPORT COLLISION RESOLUTION MODAL                    */}
      {/* ---------------------------------------------------- */}
      {pendingImport && (
        <ImportCollisionModal
          isOpen={Boolean(pendingImport)}
          collisions={pendingImport.collisions}
          onResolve={handleResolveCollision}
          onCancel={() => setPendingImport(null)}
        />
      )}

      {/* ---------------------------------------------------- */}
      {/* LIVE MODULE & QUESTION STUDIO EDITOR MODAL           */}
      {/* ---------------------------------------------------- */}
      {isEditorOpen && (
        <React.Suspense fallback={null}>
          <ModuleEditorModal
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            module={activeModule}
            initialQuestionId={editingQuestionId}
            onSaveModule={handleSaveEditedModule}
            onDeleteModule={handleDeleteCustomModule}
            onResetBuiltIn={handleResetBuiltIn}
          />
        </React.Suspense>
      )}

      {/* ---------------------------------------------------- */}
      {/* NON-BLOCKING FLOATING INGESTION PANEL (BOTTOM-RIGHT) */}
      {/* ---------------------------------------------------- */}
      {backgroundIngestion && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 transition-all duration-200 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95 animate-fadeIn"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  backgroundIngestion.status === 'completed'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                    : backgroundIngestion.status === 'error'
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                    : 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                }`}
              >
                {backgroundIngestion.status === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : backgroundIngestion.status === 'error' ? (
                  <XCircle className="w-5 h-5 text-rose-500" />
                ) : (
                  <Sparkles className="w-5 h-5 animate-pulse" />
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {backgroundIngestion.status === 'completed'
                      ? 'Deck Imported'
                      : backgroundIngestion.status === 'error'
                      ? 'Import Error'
                      : 'Importing Drug Deck...'}
                  </h4>
                  {backgroundIngestion.status === 'ingesting' && (
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      {backgroundIngestion.progressPercent}%
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {backgroundIngestion.fileName}
                </p>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2">
                  {backgroundIngestion.message}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (backgroundIngestion.status === 'ingesting' && backgroundAbortControllerRef.current) {
                  backgroundAbortControllerRef.current.abort();
                }
                setBackgroundIngestion(null);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              title="Dismiss"
            >
              <span className="text-sm font-bold leading-none">✕</span>
            </button>
          </div>

          {backgroundIngestion.status === 'ingesting' && (
            <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 dark:bg-blue-400 h-full transition-all duration-300"
                style={{ width: `${Math.max(5, backgroundIngestion.progressPercent)}%` }}
              />
            </div>
          )}

          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-[10px] text-slate-400">
              Non-blocking background worker
            </span>
            {backgroundIngestion.status === 'completed' ? (
              <button
                type="button"
                onClick={() => {
                  switchTab('document-review');
                  setBackgroundIngestion(null);
                }}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                View Deck &rarr;
              </button>
            ) : (
              <button
                type="button"
                onClick={() => switchTab('matrix')}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Open Comparator &rarr;
              </button>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
