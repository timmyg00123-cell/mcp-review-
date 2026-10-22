import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';
import {
  GraphEntity,
  GraphRelationship,
  medChemGraphDb,
  seedDefaultKnowledgeGraph,
  EntityType,
} from '../db/medChemGraphDb';
import { enrichEntitiesWithPubChem } from '../services/pubchemService';
import { ingestLectureDocument, IngestionProgress } from '../services/lectureIngestion';
import {
  getTwoHopMedChemSubgraph,
  getEntireMedChemGraph,
  generateGraphRagQuestion,
} from '../services/graphRetrieval';
import { SmilesCanvas } from './SmilesCanvas';
import { DocumentQuestionItem } from './DocumentQuestionItem';
import { AntiplateletQuestion, ChemicalStructure } from '../types/reviewModule';
import {
  Network,
  Upload,
  Search,
  Sparkles,
  Database,
  FlaskConical,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Zap,
  ArrowRight,
  Info,
  Filter,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Target,
  Award,
  Check,
  X,
  Compass,
} from 'lucide-react';

// Phase 1: Visually accessible node type color mapping
const NODE_COLORS: Record<string, string> = {
  DRUG: '#3b82f6', // Blue
  TARGET_OR_ENZYME: '#f97316', // Orange
  METABOLITE: '#a855f7', // Purple
  ADVERSE_EFFECT: '#ef4444', // Red
  DRUG_CLASS: '#14b8a6', // Teal
  DISEASE_STATE: '#10b981', // Emerald
  PHARMACOPHORE_OR_MOIETY: '#eab308', // Amber
  CLINICAL_PARAMETER: '#8b5cf6', // Violet
};

interface PathfinderChallenge {
  id: string;
  title: string;
  subtitle: string;
  startNode: string;
  endNode: string;
  expectedIntermediateOptions: string[][];
  explanation: string;
}

const PRESET_CHALLENGES: PathfinderChallenge[] = [
  {
    id: 'clopidogrel-activation',
    title: 'Clopidogrel 2-Step Bioactivation Bridge',
    subtitle: 'Trace hepatic CYP2C19 activation to irreversible P2Y12 covalent blockade',
    startNode: 'clopidogrel',
    endNode: 'p2y12',
    expectedIntermediateOptions: [
      ['clopidogrel', 'cyp2c19', 'active_thiol_metabolite', 'p2y12'],
      ['clopidogrel', 'active_thiol_metabolite', 'p2y12'],
    ],
    explanation:
      'Clopidogrel is an inactive prodrug that requires sequential CYP2C19 oxidations to open its thiophene ring into an active thiol metabolite. This unstable free thiol forms an irreversible disulfide linkage with Cys17/Cys270 on the P2Y12 receptor.',
  },
  {
    id: 'prasugrel-activation',
    title: 'Prasugrel Rapid Activation Highway',
    subtitle: 'Trace intestinal esterase (CES2) and CYP3A4 to covalent P2Y12 binding',
    startNode: 'prasugrel',
    endNode: 'p2y12',
    expectedIntermediateOptions: [
      ['prasugrel', 'ces2', 'cyp3a4', 'active_thiol_metabolite', 'p2y12'],
      ['prasugrel', 'ces2', 'active_thiol_metabolite', 'p2y12'],
      ['prasugrel', 'cyp3a4', 'active_thiol_metabolite', 'p2y12'],
      ['prasugrel', 'active_thiol_metabolite', 'p2y12'],
    ],
    explanation:
      'Prasugrel is rapidly deacetylated in the gut by CES2 yielding thiolactone intermediate R-95913, followed by a single efficient CYP3A4/CYP2B6 oxidation to generate active thiol metabolite with high bioactivation efficiency.',
  },
  {
    id: 'prasugrel-harm',
    title: 'Prasugrel Black Box Contraindication',
    subtitle: 'Identify the clinical guideline Class III harm pathway in stroke history',
    startNode: 'prasugrel',
    endNode: 'prior_tia_or_stroke',
    expectedIntermediateOptions: [
      ['prasugrel', 'prior_tia_or_stroke'],
      ['prasugrel', 'major_bleeding', 'prior_tia_or_stroke'],
    ],
    explanation:
      'TRITON-TIMI 38 established that prasugrel causes significant excess fatal intracranial hemorrhage in patients with a history of TIA or stroke, leading to an absolute Class III contraindication (Black Box Warning).',
  },
  {
    id: 'ticagrelor-acs',
    title: 'Ticagrelor First-Line GDMT Bridge',
    subtitle: 'Connect the direct-acting CPTP antagonist to its primary guideline indication',
    startNode: 'ticagrelor',
    endNode: 'acute_coronary_syndrome',
    expectedIntermediateOptions: [
      ['ticagrelor', 'acute_coronary_syndrome'],
      ['ticagrelor', 'p2y12', 'acute_coronary_syndrome'],
    ],
    explanation:
      'The PLATO trial demonstrated that ticagrelor significantly reduces cardiovascular mortality compared to clopidogrel in ACS without requiring metabolic activation, making it preferred Class I First-Line GDMT.',
  },
];

export const KnowledgeGraphExplorer: React.FC = () => {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [stats, setStats] = useState<{
    totalEntities: number;
    totalRelationships: number;
    entitiesByType: Record<string, number>;
    enrichedChemCount: number;
  }>({
    totalEntities: 0,
    totalRelationships: 0,
    entitiesByType: {},
    enrichedChemCount: 0,
  });

  const [searchQuery, setSearchQuery] = useState<string>('clopidogrel');
  const [activeSubgraph, setActiveSubgraph] = useState<{
    seedIds: string[];
    entities: GraphEntity[];
    relationships: GraphRelationship[];
  } | null>(null);

  const [selectedEntity, setSelectedEntity] = useState<GraphEntity | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [graphScope, setGraphScope] = useState<'focused' | 'full'>('focused');

  // Canvas dimensions
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 560,
  });

  // Phase 2: Hover Tooltip State
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);
  const [hoveredLink, setHoveredLink] = useState<any | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Phase 3: Advanced Filtering State
  const [selectedDiseaseFilter, setSelectedDiseaseFilter] = useState<string>('all');
  const [selectedDrugClassFilter, setSelectedDrugClassFilter] = useState<string>('all');
  const [hideAdverseEffects, setHideAdverseEffects] = useState<boolean>(false);
  const [showOnlyCypMetabolism, setShowOnlyCypMetabolism] = useState<boolean>(false);

  // Phase 5: Pathfinder Mode State
  const [mode, setMode] = useState<'explore' | 'pathfinder'>('explore');
  const [activeChallengeId, setActiveChallengeId] = useState<string>('clopidogrel-activation');
  const [pathfinderStartNode, setPathfinderStartNode] = useState<string>('clopidogrel');
  const [pathfinderEndNode, setPathfinderEndNode] = useState<string>('p2y12');
  const [pathfinderUserPath, setPathfinderUserPath] = useState<string[]>(['clopidogrel']);
  const [pathfinderSuccess, setPathfinderSuccess] = useState<boolean>(false);
  const [pathfinderMessage, setPathfinderMessage] = useState<string | null>(null);

  // Ingestion state
  const [ingestionProgress, setIngestionProgress] = useState<IngestionProgress | null>(null);
  const [isIngesting, setIsIngesting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // GraphRAG question generator state
  const [generatedQuestion, setGeneratedQuestion] = useState<AntiplateletQuestion | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<AntiplateletQuestion[]>([]);
  const [masterStructures, setMasterStructures] = useState<ChemicalStructure[]>([]);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState<boolean>(false);
  const [questionError, setQuestionError] = useState<string | null>(null);

  // Background enrichment status
  const [isEnrichingAll, setIsEnrichingAll] = useState<boolean>(false);
  const [enrichmentStatus, setEnrichmentStatus] = useState<string>('');

  // Resize observer for responsive force graph canvas
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth || 800,
          height: 560,
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const refreshStats = async () => {
    await seedDefaultKnowledgeGraph();
    const data = await medChemGraphDb.getGraphStats();
    setStats(data);
  };

  const loadGraph = useCallback(
    async (term: string, scope: 'focused' | 'full' = graphScope) => {
      setIsSearching(true);
      try {
        let subgraph;
        if (scope === 'full') {
          subgraph = await getEntireMedChemGraph(150);
        } else {
          subgraph = await getTwoHopMedChemSubgraph(term);
        }
        setActiveSubgraph(subgraph);

        if (subgraph.entities.length > 0) {
          const exact = subgraph.entities.find((e) => e.id === term.toLowerCase());
          setSelectedEntity(exact || subgraph.entities[0]);
        } else {
          setSelectedEntity(null);
        }

        setTimeout(() => {
          fgRef.current?.zoomToFit(400, 30);
        }, 350);
      } catch (err) {
        console.warn('Error fetching graph:', err);
      } finally {
        setIsSearching(false);
      }
    },
    [graphScope]
  );

  useEffect(() => {
    refreshStats().then(() => {
      loadGraph('clopidogrel', 'focused');
    });
  }, [loadGraph]);

  // Handle challenge selection
  const handleSelectChallenge = (cId: string) => {
    const challenge = PRESET_CHALLENGES.find((c) => c.id === cId);
    if (!challenge) return;
    setActiveChallengeId(cId);
    setPathfinderStartNode(challenge.startNode);
    setPathfinderEndNode(challenge.endNode);
    setPathfinderUserPath([challenge.startNode]);
    setPathfinderSuccess(false);
    setPathfinderMessage(null);
  };

  // Reset Pathfinder state
  const handleResetPathfinder = () => {
    setPathfinderUserPath([pathfinderStartNode]);
    setPathfinderSuccess(false);
    setPathfinderMessage(null);
  };

  // Reveal Pathfinder solution
  const handleRevealSolution = () => {
    const challenge = PRESET_CHALLENGES.find((c) => c.id === activeChallengeId);
    if (challenge && challenge.expectedIntermediateOptions.length > 0) {
      setPathfinderUserPath(challenge.expectedIntermediateOptions[0]);
      setPathfinderSuccess(true);
      setPathfinderMessage(challenge.explanation);
    }
  };

  // Phase 3: Available options for filter dropdowns
  const diseaseOptions = useMemo(() => {
    if (!activeSubgraph) return [];
    return activeSubgraph.entities.filter((e) => e.type === 'DISEASE_STATE');
  }, [activeSubgraph]);

  const drugClassOptions = useMemo(() => {
    if (!activeSubgraph) return [];
    return activeSubgraph.entities.filter((e) => e.type === 'DRUG_CLASS');
  }, [activeSubgraph]);

  // Phase 3: Compute matching nodes & edges based on active filters
  const { matchingNodeIds, matchingLinkKeys, isFilterActive } = useMemo(() => {
    const active =
      selectedDiseaseFilter !== 'all' ||
      selectedDrugClassFilter !== 'all' ||
      hideAdverseEffects ||
      showOnlyCypMetabolism;

    if (!active || !activeSubgraph) {
      return {
        matchingNodeIds: new Set(activeSubgraph?.entities.map((e) => e.id) || []),
        matchingLinkKeys: new Set(
          activeSubgraph?.relationships.map((r) => `${r.source}|${r.relation}|${r.target}`) || []
        ),
        isFilterActive: false,
      };
    }

    const matchedNodes = new Set<string>();
    const matchedLinks = new Set<string>();

    // 1. Disease State Filter
    if (selectedDiseaseFilter !== 'all') {
      matchedNodes.add(selectedDiseaseFilter);
      activeSubgraph.relationships.forEach((r) => {
        if (r.target === selectedDiseaseFilter || r.source === selectedDiseaseFilter) {
          matchedNodes.add(r.source);
          matchedNodes.add(r.target);
          matchedLinks.add(`${r.source}|${r.relation}|${r.target}`);
        }
      });
      // 2nd hop context
      activeSubgraph.relationships.forEach((r) => {
        if (matchedNodes.has(r.source) && matchedNodes.has(r.target)) {
          matchedLinks.add(`${r.source}|${r.relation}|${r.target}`);
        }
      });
    }

    // 2. Drug Class Filter
    if (selectedDrugClassFilter !== 'all') {
      matchedNodes.add(selectedDrugClassFilter);
      activeSubgraph.relationships.forEach((r) => {
        if (r.target === selectedDrugClassFilter || r.source === selectedDrugClassFilter) {
          matchedNodes.add(r.source);
          matchedNodes.add(r.target);
          matchedLinks.add(`${r.source}|${r.relation}|${r.target}`);
        }
      });
    }

    // 3. CYP Metabolism Filter
    if (showOnlyCypMetabolism) {
      activeSubgraph.entities.forEach((e) => {
        if (e.id.includes('cyp') || e.name?.toLowerCase().includes('cyp')) {
          matchedNodes.add(e.id);
        }
      });
      activeSubgraph.relationships.forEach((r) => {
        const isCyp =
          r.relation.includes('METABOL') ||
          r.relation.includes('BIOACTIVAT') ||
          r.source.includes('cyp') ||
          r.target.includes('cyp');
        if (isCyp) {
          matchedNodes.add(r.source);
          matchedNodes.add(r.target);
          matchedLinks.add(`${r.source}|${r.relation}|${r.target}`);
        }
      });
    }

    // 4. Hide Adverse Effects
    if (hideAdverseEffects) {
      // Exclude adverse effects unless explicitly focused
      activeSubgraph.entities.forEach((e) => {
        if (e.type === 'ADVERSE_EFFECT') {
          matchedNodes.delete(e.id);
        }
      });
    }

    return {
      matchingNodeIds: matchedNodes,
      matchingLinkKeys: matchedLinks,
      isFilterActive: true,
    };
  }, [
    selectedDiseaseFilter,
    selectedDrugClassFilter,
    hideAdverseEffects,
    showOnlyCypMetabolism,
    activeSubgraph,
  ]);

  // Transform data for react-force-graph-2d
  const graphData = useMemo(() => {
    if (!activeSubgraph) return { nodes: [], links: [] };

    // Shallow copy entities and relationships so force graph doesn't mutate immutable state
    const nodes = activeSubgraph.entities.map((e) => ({
      ...e,
      id: e.id,
      name: e.name || e.id,
      val:
        e.id === selectedEntity?.id
          ? 14
          : activeSubgraph.seedIds.includes(e.id)
          ? 12
          : e.type === 'DRUG'
          ? 10
          : 8,
    }));

    const links = activeSubgraph.relationships.map((r) => ({
      ...r,
      source: r.source,
      target: r.target,
    }));

    return { nodes, links };
  }, [activeSubgraph, selectedEntity]);

  // Filter master structures using question.referenced_structures to display only relevant chemical structures
  const activeQuestionWithFilteredStructures = useMemo(() => {
    if (!generatedQuestion) return null;

    const pool =
      masterStructures.length > 0
        ? masterStructures
        : generatedQuestion.structuresDisplayed || [];

    if (
      Array.isArray(generatedQuestion.referenced_structures) &&
      generatedQuestion.referenced_structures.length > 0
    ) {
      const refs = generatedQuestion.referenced_structures.map((r) => r.trim().toLowerCase());
      const filtered = pool.filter((s) => {
        const idLower = (s.id || '').trim().toLowerCase();
        const docLabelLower = (s.document_label || '').trim().toLowerCase();
        const nameLower = (s.name || '').trim().toLowerCase();
        return (
          refs.includes(idLower) ||
          refs.includes(docLabelLower) ||
          refs.includes(nameLower)
        );
      });
      if (filtered.length > 0) {
        return {
          ...generatedQuestion,
          structuresDisplayed: filtered,
        };
      }
    }

    return {
      ...generatedQuestion,
      structuresDisplayed: pool,
    };
  }, [generatedQuestion, masterStructures]);

  // Click node handler
  const handleNodeClick = (node: any) => {
    if (mode === 'pathfinder') {
      // Pathfinder node progression logic
      if (pathfinderSuccess) return;

      const currentTail = pathfinderUserPath[pathfinderUserPath.length - 1];

      // Check if clicking the current start or already in path
      if (node.id === currentTail) return;

      // Check if node is connected to currentTail in activeSubgraph
      const isConnected = activeSubgraph?.relationships.some(
        (r) =>
          (r.source === currentTail && r.target === node.id) ||
          (r.target === currentTail && r.source === node.id)
      );

      if (isConnected) {
        const nextPath = [...pathfinderUserPath, node.id];
        setPathfinderUserPath(nextPath);
        setPathfinderMessage(null);

        // Check if reached destination
        if (node.id === pathfinderEndNode) {
          const challenge = PRESET_CHALLENGES.find((c) => c.id === activeChallengeId);
          setPathfinderSuccess(true);
          setPathfinderMessage(
            challenge?.explanation ||
              'Correct mechanistic pathway completed! You have successfully reconstructed the clinical pharmacology bridge.'
          );
        }
      } else {
        setPathfinderMessage(
          `"${node.name || node.id}" does not directly link to "${currentTail}". Check metabolizing enzymes or intermediate metabolites.`
        );
      }
    } else {
      // Normal exploration mode
      const ent = activeSubgraph?.entities.find((e) => e.id === node.id);
      if (ent) setSelectedEntity(ent);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsIngesting(true);
    setQuestionError(null);
    setIngestionProgress({
      stage: 'parsing',
      currentBatch: 0,
      totalBatches: 0,
      currentSlide: 0,
      totalSlides: 0,
      message: `Starting ingestion for ${file.name}...`,
    });

    try {
      const result = await ingestLectureDocument(file, (progress) => {
        setIngestionProgress(progress);
      });
      await refreshStats();

      if (result.entities && result.entities.length > 0) {
        const firstDrug =
          result.entities.find((e) => e.type === 'DRUG' || e.type === 'METABOLITE') ||
          result.entities[0];
        setSearchQuery(firstDrug.id);
        await loadGraph(firstDrug.id, 'focused');
      } else {
        await loadGraph(searchQuery, 'focused');
      }

      if (result.structures && result.structures.length > 0) {
        setMasterStructures(result.structures);
      }

      if (result.generatedQuestions && result.generatedQuestions.length > 0) {
        setGeneratedQuestions(result.generatedQuestions);
        setGeneratedQuestion(result.generatedQuestions[0]);
      }
    } catch (err: any) {
      setIngestionProgress({
        stage: 'error',
        currentBatch: 0,
        totalBatches: 0,
        currentSlide: 0,
        totalSlides: 0,
        message: 'Ingestion failed',
        error: err?.message || String(err),
      });
    } finally {
      setIsIngesting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleGenerateQuestion = async (targetId: string) => {
    setIsGeneratingQuestion(true);
    setQuestionError(null);
    try {
      const q = await generateGraphRagQuestion(targetId);
      setGeneratedQuestion(q);
      setGeneratedQuestions((prev) => [q, ...prev.filter((item) => item.id !== q.id)]);
      if (q.structuresDisplayed && q.structuresDisplayed.length > 0) {
        setMasterStructures((prev) => {
          const combined = [...prev, ...(q.structuresDisplayed || [])];
          const unique: ChemicalStructure[] = [];
          const seen = new Set<string>();
          for (const s of combined) {
            const key = (s.document_label || s.id || s.name).toLowerCase();
            if (!seen.has(key)) {
              seen.add(key);
              unique.push(s);
            }
          }
          return unique;
        });
      }
    } catch (err: any) {
      setQuestionError(err?.message || 'Failed to generate practice question');
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const handleEnrichAllPubChem = async () => {
    setIsEnrichingAll(true);
    setEnrichmentStatus('Triggering NIH PubChem rate-limited queue...');
    try {
      const res = await enrichEntitiesWithPubChem(undefined, (cur, total, name) => {
        setEnrichmentStatus(`[${cur}/${total}] Enriched 2D structure & properties for ${name}...`);
      });
      setEnrichmentStatus(
        `PubChem enrichment completed: ${res.enrichedCount}/${res.totalCandidates} updated.`
      );
      await refreshStats();
      if (selectedEntity) {
        const refreshed = await medChemGraphDb.entities.get(selectedEntity.id);
        if (refreshed) setSelectedEntity(refreshed);
      }
    } catch (err: any) {
      setEnrichmentStatus(`Enrichment error: ${err?.message || err}`);
    } finally {
      setIsEnrichingAll(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-white/20 text-white backdrop-blur-xs">
              <Network className="w-3.5 h-3.5" />
              <span>Interactive Clinical Reasoning &amp; Chemical Knowledge Canvas</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Medicinal Chemistry &amp; Pharmacology Knowledge Graph
            </h1>
            <p className="text-sm text-blue-100 max-w-2xl">
              Physics-directed pharmacology graph with structure-on-hover tooltips, GDMT guideline
              overlays, and interactive Pathfinder study challenges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isIngesting}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-white text-blue-900 hover:bg-blue-50 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>
                {isIngesting
                  ? 'Ingesting Document...'
                  : 'Ingest Document / Image (PDF, PPTX, JPG, PNG)'}
              </span>
            </button>
            <input
              ref={fileInputRef}
              id="kg-file-upload-input"
              name="kgDocumentFile"
              type="file"
              accept=".pdf,.pptx,.jpg,.jpeg,.png,image/jpeg,image/png"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              type="button"
              onClick={handleEnrichAllPubChem}
              disabled={isEnrichingAll}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-blue-800/80 hover:bg-blue-800 text-white border border-white/20 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isEnrichingAll ? 'animate-spin' : ''}`} />
              <span>PubChem Batch Enrich</span>
            </button>
          </div>
        </div>

        {/* Live Graph Database Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/20 text-xs">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <div className="text-blue-200 uppercase font-mono text-[10px]">Total Graph Nodes</div>
            <div className="text-xl font-bold font-mono">{stats.totalEntities} Entities</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <div className="text-blue-200 uppercase font-mono text-[10px]">Knowledge Edges</div>
            <div className="text-xl font-bold font-mono">
              {stats.totalRelationships} Relationships
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <div className="text-blue-200 uppercase font-mono text-[10px]">
              PubChem 2D Structures
            </div>
            <div className="text-xl font-bold font-mono">{stats.enrichedChemCount} Structures</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <div className="text-blue-200 uppercase font-mono text-[10px]">Active Categories</div>
            <div className="text-xl font-bold font-mono">
              {Object.keys(stats.entitiesByType).length} Types
            </div>
          </div>
        </div>

        {enrichmentStatus && (
          <div className="mt-3 text-xs bg-white/15 px-3 py-1.5 rounded-lg font-mono text-blue-100 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-blue-200 shrink-0" />
            <span>{enrichmentStatus}</span>
          </div>
        )}
      </div>

      {/* Ingestion Progress Notification */}
      {ingestionProgress && (
        <div className="rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/60 dark:bg-indigo-950/40 p-4 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>Multimodal Lecture Ingestion Pipeline</span>
            </span>
            <span className="font-mono text-indigo-700 dark:text-indigo-300">
              {ingestionProgress.stage.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 font-mono">
            {ingestionProgress.message}
          </p>

          {ingestionProgress.totalBatches > 0 && (
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.round(
                    (ingestionProgress.currentBatch / ingestionProgress.totalBatches) * 100
                  )}%`,
                }}
              />
            </div>
          )}

          {(ingestionProgress.error || ingestionProgress.stage === 'error') && (
            <div className="text-xs text-rose-700 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-950/80 p-3 rounded-lg border border-rose-300 dark:border-rose-800 flex items-center gap-2 mt-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span className="font-semibold">
                {ingestionProgress.error || ingestionProgress.message}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Practice Question Card (if generated) */}
      {generatedQuestions.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-indigo-500/80 p-5 shadow-lg space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-100 dark:border-indigo-900/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Generated Practice Question{generatedQuestions.length > 1 ? 's' : ''}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
                    Structure Challenge Ready
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Chemical structure grounded from course evidence. Drug name blinded to test
                  deduction skills.
                </p>
              </div>
            </div>

            {generatedQuestions.length > 1 && (
              <div className="flex items-center gap-1.5 self-start sm:self-auto flex-wrap">
                {generatedQuestions.map((q, idx) => (
                  <button
                    key={q.id || idx}
                    type="button"
                    onClick={() => setGeneratedQuestion(q)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                      generatedQuestion?.id === q.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Question {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {activeQuestionWithFilteredStructures && (
            <DocumentQuestionItem
              question={activeQuestionWithFilteredStructures}
              allSectionStructures={masterStructures}
              allModuleStructures={masterStructures}
              isOpen={true}
              onToggle={() => {}}
            />
          )}
        </div>
      )}

      {/* Control Header & Mode Switcher */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Phase 5: UI Toggle Mode: Explore | Pathfinder Challenge */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('explore');
                setPathfinderMessage(null);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'explore'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore Mode</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('pathfinder');
                handleSelectChallenge(activeChallengeId);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'pathfinder'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Target className="w-4 h-4 text-emerald-500" />
              <span>Pathfinder Challenge</span>
            </button>
          </div>

          {/* Graph Scope: 2-Hop Subgraph vs Entire Graph */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">Scope:</span>
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setGraphScope('focused');
                  loadGraph(searchQuery, 'focused');
                }}
                className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                  graphScope === 'focused'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                2-Hop Neighborhood
              </button>
              <button
                type="button"
                onClick={() => {
                  setGraphScope('full');
                  loadGraph(searchQuery, 'full');
                }}
                className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                  graphScope === 'full'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Full Graph Canvas
              </button>
            </div>
          </div>
        </div>

        {/* Pathfinder Challenge Selection Toolbar */}
        {mode === 'pathfinder' && (
          <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  Select Mechanistic Bridge Challenge:
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleResetPathfinder}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Path</span>
                </button>
                <button
                  type="button"
                  onClick={handleRevealSolution}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Award className="w-3 h-3" />
                  <span>Reveal Solution</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {PRESET_CHALLENGES.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => handleSelectChallenge(ch.id)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                    activeChallengeId === ch.id
                      ? 'bg-white dark:bg-slate-900 border-emerald-500 shadow-xs'
                      : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:bg-white'
                  }`}
                >
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                    <span className="truncate">{ch.title}</span>
                    {activeChallengeId === ch.id && (
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {ch.startNode} ➔ {ch.endNode}
                  </div>
                </button>
              ))}
            </div>

            {/* Pathfinder Progress Indicator */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="font-mono text-emerald-800 dark:text-emerald-300 font-semibold">
                Path:
              </span>
              {pathfinderUserPath.map((nodeId, idx) => (
                <span key={nodeId} className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-md font-mono text-[11px] bg-emerald-600 text-white font-bold">
                    {nodeId}
                  </span>
                  {idx < pathfinderUserPath.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-emerald-600" />
                  )}
                </span>
              ))}

              {!pathfinderSuccess && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono italic">
                  (Click next node to reach target: {pathfinderEndNode})
                </span>
              )}
            </div>

            {pathfinderMessage && (
              <div
                className={`p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2 ${
                  pathfinderSuccess
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                }`}
              >
                {pathfinderSuccess ? (
                  <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <span>{pathfinderMessage}</span>
              </div>
            )}
          </div>
        )}

        {/* Phase 3: Filter Toolbar (Therapeutic & Pharmacologic) */}
        {mode === 'explore' && (
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-3">
              {/* Therapeutic Class (Disease State) Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-blue-500" />
                  <span>Therapeutic Indication:</span>
                </span>
                <select
                  value={selectedDiseaseFilter}
                  onChange={(e) => setSelectedDiseaseFilter(e.target.value)}
                  className="py-1 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="all">All Indications</option>
                  {diseaseOptions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name || d.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pharmacologic Class Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400">
                  Mechanism Class:
                </span>
                <select
                  value={selectedDrugClassFilter}
                  onChange={(e) => setSelectedDrugClassFilter(e.target.value)}
                  className="py-1 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="all">All Drug Classes</option>
                  {drugClassOptions.map((dc) => (
                    <option key={dc.id} value={dc.id}>
                      {dc.name || dc.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pathway Toggles */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHideAdverseEffects(!hideAdverseEffects)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    hideAdverseEffects
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {hideAdverseEffects ? '✕ Adverse Effects Hidden' : 'Hide Adverse Effects'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowOnlyCypMetabolism(!showOnlyCypMetabolism)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    showOnlyCypMetabolism
                      ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {showOnlyCypMetabolism
                    ? '✓ Showing CYP Pathways Only'
                    : 'Show Only CYP450 Metabolism'}
                </button>

                {isFilterActive && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDiseaseFilter('all');
                      setSelectedDrugClassFilter('all');
                      setHideAdverseEffects(false);
                      setShowOnlyCypMetabolism(false);
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>
            </div>

            {/* Search Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                loadGraph(searchQuery, graphScope);
              }}
              className="flex flex-col sm:flex-row gap-2 pt-1"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="subgraph-search-input"
                  name="subgraphSearch"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search drug, enzyme, disease, or target (e.g. clopidogrel, cyp2c19, ticagrelor, p2y12)..."
                  className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Network className="w-3.5 h-3.5" />
                <span>{isSearching ? 'Traversing...' : 'Search Seed'}</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Main Interactive Graph & Clinical Reasoning Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): ForceGraph2D Canvas */}
        <div className="lg:col-span-8 space-y-3">
          <div
            ref={containerRef}
            onMouseMove={(e) => {
              const rect = containerRef.current?.getBoundingClientRect();
              if (rect) {
                setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
              }
            }}
            className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl"
            style={{ height: 580 }}
          >
            {/* Canvas Toolbar Controls */}
            <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/70 shadow-lg text-white">
              <button
                type="button"
                onClick={() => fgRef.current?.zoom((fgRef.current.zoom() || 1) * 1.3, 300)}
                title="Zoom In"
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => fgRef.current?.zoom((fgRef.current.zoom() || 1) / 1.3, 300)}
                title="Zoom Out"
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => fgRef.current?.zoomToFit(400, 30)}
                title="Fit to Canvas"
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Canvas Legend Overlay */}
            <div className="absolute bottom-3 left-3 z-30 flex flex-wrap items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/70 shadow-lg text-[10px] font-mono text-white">
              <span className="text-slate-400 font-bold uppercase mr-1">Legend:</span>
              {Object.entries(NODE_COLORS).map(([type, color]) => (
                <span key={type} className="flex items-center gap-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-slate-300">{type.replace(/_/g, ' ')}</span>
                </span>
              ))}
              <span className="border-l border-slate-700 pl-2 ml-1 flex items-center gap-2">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <span className="inline-block w-3 h-0.5 bg-emerald-400" />
                  <span>1st-Line</span>
                </span>
                <span className="flex items-center gap-1 text-rose-400 font-bold">
                  <span className="inline-block w-3 h-0.5 border-b border-dashed border-rose-400" />
                  <span>Contraindicated</span>
                </span>
              </span>
            </div>

            {/* Phase 1 & 4: Interactive ForceGraph2D Canvas */}
            <ForceGraph2D
              ref={fgRef as any}
              width={dimensions.width}
              height={580}
              graphData={graphData}
              backgroundColor="#090d16"
              nodeRelSize={6}
              linkDirectionalArrowLength={6}
              linkDirectionalArrowRelPos={0.88}
              linkCurvature={0.12}
              onNodeHover={(node) => setHoveredNode(node || null)}
              onLinkHover={(link) => setHoveredLink(link || null)}
              onNodeClick={handleNodeClick}
              nodeCanvasObjectMode={() => 'after'}
              nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                const isSelected = selectedEntity?.id === node.id;
                const isHovered = hoveredNode?.id === node.id;
                const inPath = mode === 'pathfinder' && pathfinderUserPath.includes(node.id);
                const isPathStart = mode === 'pathfinder' && pathfinderStartNode === node.id;
                const isPathEnd = mode === 'pathfinder' && pathfinderEndNode === node.id;

                const isDimmed =
                  (mode === 'pathfinder' &&
                    !pathfinderUserPath.includes(node.id) &&
                    !isPathStart &&
                    !isPathEnd) ||
                  (mode === 'explore' && isFilterActive && !matchingNodeIds.has(node.id));

                const baseColor = NODE_COLORS[node.type] || '#64748b';
                const radius = isSelected || isHovered || isPathStart || isPathEnd ? 8 : 6;

                ctx.save();
                ctx.beginPath();
                ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);

                if (isDimmed) {
                  ctx.fillStyle = '#334155';
                  ctx.globalAlpha = 0.22;
                  ctx.fill();
                  ctx.restore();
                  return;
                }

                ctx.fillStyle = baseColor;
                ctx.globalAlpha = 1.0;
                ctx.fill();

                // Highlight border
                if (isSelected || inPath || isPathStart || isPathEnd || isHovered) {
                  ctx.lineWidth = 2.5 / globalScale;
                  ctx.strokeStyle =
                    inPath || isPathStart
                      ? '#10b981'
                      : isPathEnd
                      ? '#f59e0b'
                      : isSelected
                      ? '#38bdf8'
                      : '#ffffff';
                  ctx.stroke();
                }

                // Label badge underneath
                const label = node.name || node.id;
                const fontSize = Math.max(11 / globalScale, 3);
                ctx.font = `${
                  isSelected || inPath ? 'bold ' : ''
                }${fontSize}px Inter, system-ui, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';

                const textWidth = ctx.measureText(label).width;
                ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
                ctx.fillRect(
                  node.x - textWidth / 2 - 2,
                  node.y + radius + 2,
                  textWidth + 4,
                  fontSize + 2
                );

                ctx.fillStyle = inPath ? '#34d399' : '#f8fafc';
                ctx.fillText(label, node.x, node.y + radius + 3);
                ctx.restore();
              }}
              nodePointerAreaPaint={(
                node: any,
                color: string,
                ctx: CanvasRenderingContext2D
              ) => {
                ctx.beginPath();
                ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI, false);
                ctx.fillStyle = color;
                ctx.fill();
              }}
              linkCanvasObjectMode={() => 'after'}
              linkCanvasObject={(
                link: any,
                ctx: CanvasRenderingContext2D,
                globalScale: number
              ) => {
                const isContraindicated = link.relation === 'CONTRAINDICATED_IN';
                const isFirstLine = link.relation === 'FIRST_LINE_FOR';
                const inPath =
                  mode === 'pathfinder' &&
                  pathfinderUserPath.includes(link.source?.id || link.source) &&
                  pathfinderUserPath.includes(link.target?.id || link.target);

                const linkKey = `${link.source?.id || link.source}|${link.relation}|${
                  link.target?.id || link.target
                }`;
                const isDimmed =
                  (mode === 'pathfinder' && !inPath) ||
                  (mode === 'explore' && isFilterActive && !matchingLinkKeys.has(linkKey));

                if (isDimmed) return;

                const start = link.source;
                const end = link.target;
                if (!start || !end || typeof start.x !== 'number' || typeof end.x !== 'number')
                  return;

                const midX = (start.x + end.x) / 2;
                const midY = (start.y + end.y) / 2;

                ctx.save();

                // Phase 4: Guidelines Overlays
                if (isContraindicated) {
                  // Red dashed line
                  ctx.beginPath();
                  ctx.setLineDash([5 / globalScale, 4 / globalScale]);
                  ctx.lineWidth = 3 / globalScale;
                  ctx.strokeStyle = '#ef4444';
                  ctx.moveTo(start.x, start.y);
                  ctx.lineTo(end.x, end.y);
                  ctx.stroke();

                  // Mid-edge X icon badge
                  const badgeSize = Math.max(12 / globalScale, 3.5);
                  ctx.setLineDash([]);
                  ctx.fillStyle = '#ef4444';
                  ctx.beginPath();
                  ctx.arc(midX, midY, badgeSize / 2, 0, 2 * Math.PI);
                  ctx.fill();

                  ctx.fillStyle = '#ffffff';
                  ctx.font = `bold ${Math.max(8 / globalScale, 2.5)}px sans-serif`;
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillText('✕', midX, midY);
                } else if (isFirstLine) {
                  // Emerald thick solid line
                  ctx.beginPath();
                  ctx.setLineDash([]);
                  ctx.lineWidth = 3.5 / globalScale;
                  ctx.strokeStyle = '#10b981';
                  ctx.moveTo(start.x, start.y);
                  ctx.lineTo(end.x, end.y);
                  ctx.stroke();

                  // Mid-edge checkmark badge
                  const badgeSize = Math.max(12 / globalScale, 3.5);
                  ctx.fillStyle = '#10b981';
                  ctx.beginPath();
                  ctx.arc(midX, midY, badgeSize / 2, 0, 2 * Math.PI);
                  ctx.fill();

                  ctx.fillStyle = '#ffffff';
                  ctx.font = `bold ${Math.max(8 / globalScale, 2.5)}px sans-serif`;
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillText('✓', midX, midY);
                } else if (inPath) {
                  // Pathfinder winning link
                  ctx.beginPath();
                  ctx.setLineDash([]);
                  ctx.lineWidth = 3.5 / globalScale;
                  ctx.strokeStyle = '#10b981';
                  ctx.moveTo(start.x, start.y);
                  ctx.lineTo(end.x, end.y);
                  ctx.stroke();
                }

                // Edge label text on zoom or hover
                const isHovered =
                  hoveredLink === link ||
                  hoveredNode?.id === start.id ||
                  hoveredNode?.id === end.id;

                if (globalScale >= 1.25 || isHovered) {
                  const fontSize = Math.max(8.5 / globalScale, 2.6);
                  ctx.font = `600 ${fontSize}px Inter, sans-serif`;
                  const relText = link.relation.replace(/_/g, ' ');
                  const textWidth = ctx.measureText(relText).width;

                  ctx.fillStyle = isContraindicated
                    ? 'rgba(239, 68, 68, 0.95)'
                    : isFirstLine
                    ? 'rgba(16, 185, 129, 0.95)'
                    : inPath
                    ? 'rgba(16, 185, 129, 0.95)'
                    : 'rgba(30, 41, 59, 0.9)';

                  ctx.fillRect(
                    midX - textWidth / 2 - 2,
                    midY - fontSize / 2 - 2,
                    textWidth + 4,
                    fontSize + 4
                  );

                  ctx.fillStyle = '#ffffff';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillText(relText, midX, midY);
                }

                ctx.restore();
              }}
            />

            {/* Phase 2: Structure-on-Hover Floating Tooltip */}
            {hoveredNode && mousePos && (
              <div
                style={{
                  left: Math.min(mousePos.x + 16, dimensions.width - 270),
                  top: Math.max(10, Math.min(mousePos.y + 16, 360)),
                }}
                className="absolute z-50 pointer-events-none w-64 bg-slate-900/95 text-white p-3 rounded-xl shadow-2xl border border-slate-700/80 backdrop-blur-md space-y-2 animate-fadeIn"
              >
                <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-slate-800">
                  <span className="font-bold text-xs truncate text-slate-100">
                    {hoveredNode.name || hoveredNode.id}
                  </span>
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase"
                    style={{
                      backgroundColor: `${NODE_COLORS[hoveredNode.type] || '#64748b'}33`,
                      color: NODE_COLORS[hoveredNode.type] || '#94a3b8',
                    }}
                  >
                    {hoveredNode.type.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* 2D chemical structure preview if drug or metabolite */}
                {(hoveredNode.type === 'DRUG' || hoveredNode.type === 'METABOLITE') && (
                  <div className="space-y-1.5">
                    {hoveredNode.chemData?.structureImageDataUrl ? (
                      <div className="bg-white rounded-lg p-1 aspect-[4/3] flex items-center justify-center overflow-hidden shadow-inner">
                        <img
                          src={hoveredNode.chemData.structureImageDataUrl}
                          alt={hoveredNode.name || hoveredNode.id}
                          className="w-full h-full aspect-square object-contain"
                        />
                      </div>
                    ) : hoveredNode.chemData?.cid ? (
                      <div className="bg-white rounded-lg p-1 aspect-[4/3] flex items-center justify-center overflow-hidden shadow-inner">
                        <img
                          src={`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${hoveredNode.chemData.cid}/PNG?image_size=large`}
                          alt={hoveredNode.name || hoveredNode.id}
                          className="w-full h-full aspect-square object-contain"
                        />
                      </div>
                    ) : null}

                    <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
                      <div className="bg-slate-800/80 px-2 py-1 rounded">
                        <span className="text-slate-400 block text-[9px]">MW</span>
                        <span className="font-bold text-slate-200">
                          {hoveredNode.chemData?.molecularWeight
                            ? `${hoveredNode.chemData.molecularWeight}`
                            : '—'}
                        </span>
                      </div>
                      <div className="bg-slate-800/80 px-2 py-1 rounded">
                        <span className="text-slate-400 block text-[9px]">LogP</span>
                        <span className="font-bold text-slate-200">
                          {hoveredNode.chemData?.xlogp !== undefined
                            ? `${hoveredNode.chemData.xlogp}`
                            : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary excerpt */}
                {hoveredNode.clinical_and_sar_summary && (
                  <p className="text-[11px] text-slate-300 line-clamp-3 leading-snug">
                    {hoveredNode.clinical_and_sar_summary}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Selected Node Details & Structure Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {selectedEntity ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span
                    className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase font-bold"
                    style={{
                      backgroundColor: `${NODE_COLORS[selectedEntity.type] || '#64748b'}20`,
                      color: NODE_COLORS[selectedEntity.type] || '#475569',
                    }}
                  >
                    {selectedEntity.type.replace(/_/g, ' ')}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
                    {selectedEntity.name || selectedEntity.id}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {(selectedEntity.type === 'DRUG' || selectedEntity.type === 'METABOLITE') && (
                    <button
                      type="button"
                      onClick={() => handleGenerateQuestion(selectedEntity.id)}
                      disabled={isGeneratingQuestion}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isGeneratingQuestion ? 'Generating...' : 'Practice Quiz'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 2D Chemical Structure Representation */}
              {(selectedEntity.type === 'DRUG' || selectedEntity.type === 'METABOLITE') && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3.5 space-y-3">
                  <div className="text-xs font-mono uppercase font-bold text-slate-500 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FlaskConical className="w-4 h-4 text-blue-600" />
                      <span>2D Chemical Depiction</span>
                    </span>
                    {selectedEntity.chemData?.cid && (
                      <a
                        href={`https://pubchem.ncbi.nlm.nih.gov/compound/${selectedEntity.chemData.cid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <span>PubChem CID {selectedEntity.chemData.cid}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex flex-col items-center">
                    <SmilesCanvas
                      smiles={
                        selectedEntity.chemData?.isomericSmiles ||
                        selectedEntity.chemData?.canonicalSmiles
                      }
                      fallbackImageUrl={
                        selectedEntity.chemData?.structureImageDataUrl ||
                        (selectedEntity.chemData?.cid
                          ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${selectedEntity.chemData.cid}/PNG?image_size=large`
                          : undefined)
                      }
                      width={260}
                      height={160}
                      altText={selectedEntity.name || selectedEntity.id}
                    />

                    {/* Properties 2x2 Grid */}
                    <div className="grid grid-cols-2 gap-1.5 w-full mt-3 text-xs">
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block font-mono">
                          MOL. WEIGHT
                        </span>
                        <span className="font-bold font-mono">
                          {selectedEntity.chemData?.molecularWeight
                            ? `${selectedEntity.chemData.molecularWeight} g/mol`
                            : '—'}
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60">
                        <span className="text-[10px] text-slate-400 block font-mono">XLOGP</span>
                        <span className="font-bold font-mono">
                          {selectedEntity.chemData?.xlogp !== undefined
                            ? selectedEntity.chemData.xlogp
                            : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Clinical & SAR Summary */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-mono uppercase font-bold text-slate-600 dark:text-slate-300">
                  Clinical &amp; Mechanism of Action (MOA) Summary
                </h4>
                <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {selectedEntity.clinical_and_sar_summary}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 text-xs p-6 text-center">
              Click any node on the force graph to inspect its chemical properties, 2D structure,
              and clinical pharmacology notes.
            </div>
          )}

          {/* Generated Question Status/Error */}
          {questionError && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{questionError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};