import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getHydratedDrugs, HydratedDrug } from '../db/db';
import { ChemicalStructure } from '../types/reviewModule';
import type { OpenFdaClinicalData } from '../services/openFdaService';
import {
  antiplateletComparisonMatrix,
  antiplateletStructures,
} from '../data/antiplateletQuizData';
import { resolveStructureSafe } from '../utils/structureDataUtils';
export { resolveStructureSafe } from '../utils/structureDataUtils';
import { StructureLightboxModal } from './StructureLightboxModal';
import { StructureComparator } from './StructureComparator';
import {
  Search,
  ExternalLink,
  FlaskConical,
  RotateCcw,
  Filter,
  ChevronDown,
  X,
  FileText,
} from 'lucide-react';
import { ColorPaletteItem } from '../utils/pharmacophoreData';
import { formatClinicalWarnings } from '../utils/clinicalWarningFormatter';
import { resolveChemicalClass } from '../utils/chemicalClassDictionary';

export interface MedChemMatrixProps {
  moduleStructures?: ChemicalStructure[];
  moduleTitle?: string;
  onInspectStructure?: (structure: ChemicalStructure) => void;
  globalActivePharmacophores?: Record<string, ColorPaletteItem>;
  globalHoveredPharmacophoreId?: string | null;
  focusMatchingOnly?: boolean;
  onOpenPharmacophoreExplorer?: () => void;
  pharmacophoreCount?: number;
}

export type AntiplateletMatrixViewProps = MedChemMatrixProps;

export interface MedChemMatrixRow {
  id: string;
  drug: string;
  chemicalClass: string;
  pharmacologicalTarget: string;
  drugState: string;
  reversibility: string;
  route: string;
  onset: string;
  duration: string;
  locationOfMetabolism: string;
  bioactivationPathway?: string;
  eliminationHalfLife?: string;
  eliminationHalfLifeObj?: { value: string; unit: string };
  keySarPearl: string;
  majorToxicityOrLimitation: string;
  cid: number;
  clinicalData?: OpenFdaClinicalData;
  structure: ChemicalStructure;
  structuralDifferences?: string;
  pkPdProfile?: string;
  clinicalUseCases?: string;
}

/**
 * Color-codes critical bioactivation keywords in the Bioactivation / Metabolism column:
 * - "Prodrug" -> Magenta (font-bold text-fuchsia-500)
 * - "Active drug" -> Emerald Green (font-bold text-emerald-400)
 */
export function renderBioactivationText(text: string): React.ReactNode {
  if (!text) return null;
  const parts = text.split(/(active\s+drug|prodrug)/gi);
  return parts.map((part, i) => {
    if (/^active\s+drug$/i.test(part)) {
      return (
        <span key={i} className="font-bold text-emerald-400">
          {part}
        </span>
      );
    }
    if (/^prodrug$/i.test(part)) {
      return (
        <span key={i} className="font-bold text-fuchsia-500">
          {part}
        </span>
      );
    }
    return part;
  });
}

/**
 * Truncation and "Read More" expansion toggle for dense clinical / FDA label matrix cells.
 * Prevents verbose FDA label paragraphs from expanding table row heights unreasonably.
 */
export interface ExpandableClinicalTextProps {
  text: string;
  maxChars?: number;
  highlightBioactivation?: boolean;
  isOpenFda?: boolean;
  className?: string;
}

export const ExpandableClinicalText: React.FC<ExpandableClinicalTextProps> = ({
  text,
  maxChars = 130,
  highlightBioactivation = false,
  isOpenFda = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!text) return <span className="text-slate-400 italic">—</span>;

  const shouldTruncate = text.length > maxChars;
  const displayText = shouldTruncate && !isExpanded ? `${text.slice(0, maxChars).trim()}...` : text;

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="leading-relaxed whitespace-normal break-words">
        {highlightBioactivation ? renderBioactivationText(displayText) : displayText}
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {shouldTruncate && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded((prev) => !prev);
            }}
            className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline cursor-pointer inline-flex items-center gap-0.5"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        )}
        {isOpenFda && (
          <span
            className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono font-medium bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
            title="Hydrated directly from official OpenFDA Drug Label API"
          >
            OpenFDA
          </span>
        )}
      </div>
    </div>
  );
};

function structureToMatrixRow(s: ChemicalStructure, hydratedMap?: Map<string, HydratedDrug>): MedChemMatrixRow {
  const drugName = `${s.document_label ? `[${s.document_label}] ` : ''}${s.name}${s.tradeName ? ` (${s.tradeName})` : ''}`;
  const cid = s.cid || s.pubchemAudit?.cid || 0;

  // Resolve from Graph Hydration Layer if available
  const cleanName = (s.name || '').replace(/\[.*?\]\s*/g, '').trim().toLowerCase();
  const hydrated = hydratedMap?.get(s.id.toLowerCase().trim()) ||
                   (cleanName ? hydratedMap?.get(cleanName) : undefined) ||
                   (cid ? hydratedMap?.get(`cid_${cid}`) : undefined);

  // Federated Data Architecture: prioritize OpenFDA clinical data hydrated on node
  const clinicalData = hydrated?.clinicalData || s.clinicalData;

  // Derive target receptor from hydrated graph node (guaranteed no orphaned nodes)
  let pharmacologicalTarget = hydrated?.target?.name;
  if (!pharmacologicalTarget || pharmacologicalTarget === 'N/A' || pharmacologicalTarget === '0' || pharmacologicalTarget === '—') {
    pharmacologicalTarget = s.target || s.pharmacologicalClass || 'Target receptor';
  }

  // Derive chemical class from hydrated graph node or authoritative lecture dictionary
  let chemicalClass = hydrated?.clinicalClass?.name;
  if (!chemicalClass || chemicalClass === 'N/A' || chemicalClass === '0' || chemicalClass === '—' || chemicalClass === 'Small molecule compound') {
    chemicalClass = resolveChemicalClass(s);
  }

  // Derive drugState ('Active Drug' | 'Prodrug' | etc.)
  let drugState = s.drug_state?.trim() || hydrated?.drug_state?.trim();
  if (!drugState) {
    const bioText = (s.pkPdHighlights?.bioactivation || (hydrated as any)?.bioactivation || '').toLowerCase();
    if (bioText.includes('prodrug')) {
      drugState = 'Prodrug';
    } else {
      drugState = 'Active Drug';
    }
  }

  // Format location of metabolism / bioactivation pathway with OpenFDA metabolism enrichment
  let locationOfMetabolism = '';
  const pathway =
    clinicalData?.metabolism_pathway ||
    hydrated?.metabolism_pathway ||
    (s as any).metabolism_pathway;

  if (Array.isArray(pathway) && pathway.length > 0) {
    locationOfMetabolism = pathway.join(' ➔ ');
  } else {
    locationOfMetabolism =
      clinicalData?.location_of_metabolism ||
      hydrated?.location_of_metabolism ||
      (s as any).location_of_metabolism ||
      '';
  }

  if (!locationOfMetabolism) {
    if (clinicalData?.metabolism) {
      locationOfMetabolism = `${drugState.toLowerCase().includes('prodrug') ? 'Prodrug.' : 'Active drug.'} ${clinicalData.metabolism}`;
    } else if (s.pkPdHighlights?.bioactivation || (hydrated as any)?.bioactivation) {
      locationOfMetabolism = s.pkPdHighlights?.bioactivation || (hydrated as any)?.bioactivation;
    } else if (drugState.toLowerCase().includes('prodrug')) {
      locationOfMetabolism = `Prodrug. Requires bioactivation.${s.pkPdHighlights?.elimination ? ` Elimination: ${s.pkPdHighlights.elimination}` : ''}`;
    } else {
      locationOfMetabolism = `Active drug.${s.pkPdHighlights?.elimination ? ` Elimination: ${s.pkPdHighlights.elimination}` : ''}`;
    }
  }

  // Format PK parameters: eliminate missing half-life using OpenFDA PK extraction
  const route =
    clinicalData?.route_of_administration ||
    s.route ||
    hydrated?.route ||
    hydrated?.route_of_admin ||
    'Oral';
  const reversibility =
    clinicalData?.reversibility ||
    s.reversibility ||
    hydrated?.reversibility ||
    'Reversible';
  const onset = s.pkPdHighlights?.onset || (hydrated as any)?.onset || 'Rapid';

  let eliminationHalfLifeObj: { value: string; unit: string } | undefined;
  let eliminationHalfLife = '—';
  const halfLifeObj =
    clinicalData?.elimination_half_life ||
    hydrated?.elimination_half_life ||
    (s as any).elimination_half_life;

  if (halfLifeObj) {
    if (typeof halfLifeObj === 'object' && (halfLifeObj as any).value) {
      eliminationHalfLifeObj = {
        value: String((halfLifeObj as any).value),
        unit: String((halfLifeObj as any).unit || 'hours'),
      };
      eliminationHalfLife = `${eliminationHalfLifeObj.value} ${eliminationHalfLifeObj.unit}`.trim();
    } else if (typeof halfLifeObj === 'string') {
      eliminationHalfLife = halfLifeObj;
    }
  } else if (clinicalData?.halfLife) {
    eliminationHalfLife = clinicalData.halfLife;
  } else if (s.pkPdHighlights?.halfLife) {
    eliminationHalfLife = s.pkPdHighlights.halfLife;
  } else if ((hydrated as any)?.half_life) {
    eliminationHalfLife = (hydrated as any).half_life;
  }

  let duration = s.pkPdHighlights?.duration || (hydrated as any)?.duration;
  if (!duration || duration === 'Standard' || duration === 'Variable') {
    if (eliminationHalfLife && eliminationHalfLife !== '—' && eliminationHalfLife !== 'Standard') {
      duration = `t½: ${eliminationHalfLife}`;
    } else {
      duration = 'Variable';
    }
  }

  // Key SAR Pearl / Unique Differentiator
  const uniqueDiff =
    clinicalData?.unique_differentiator ||
    hydrated?.unique_differentiator ||
    (s as any).unique_differentiator;

  const keySarPearl =
    uniqueDiff ||
    clinicalData?.mechanism ||
    s.moa_summary ||
    s.sar_rationale ||
    s.sarNotes ||
    hydrated?.clinical_and_sar_summary ||
    'High-affinity pharmacophoric interaction with target site.';

  // Distinct Differential Matrix Contrast Keys
  const structuralDifferences =
    clinicalData?.structural_differences ||
    s.structural_differences ||
    (s as any).structural_differences ||
    hydrated?.structural_differences;

  const pkPdProfile =
    clinicalData?.pk_pd_profile ||
    s.pk_pd_profile ||
    (s as any).pk_pd_profile ||
    hydrated?.pk_pd_profile;

  const clinicalUseCases =
    clinicalData?.clinical_use_cases ||
    s.clinical_use_cases ||
    (s as any).clinical_use_cases ||
    hydrated?.clinical_use_cases;

  // Toxicity / Limitation: prioritize OpenFDA Adverse Reactions & Contraindications
  let toxicity = '';
  if (clinicalData?.adverseReactions || clinicalData?.contraindicationsText) {
    const parts = [];
    if (clinicalData.adverseReactions) parts.push(`Adverse Reactions: ${clinicalData.adverseReactions}`);
    if (clinicalData.contraindicationsText) parts.push(`Contraindications: ${clinicalData.contraindicationsText}`);
    toxicity = parts.join(' | ');
  } else if (s.majorToxicityOrLimitation || (hydrated as any)?.majorToxicityOrLimitation) {
    toxicity = s.majorToxicityOrLimitation || (hydrated as any)?.majorToxicityOrLimitation;
  } else if (s.pkPdHighlights?.elimination) {
    toxicity = `Elimination: ${s.pkPdHighlights.elimination}`;
  } else {
    toxicity = 'Monitor therapeutic index and hepatic/renal clearance.';
  }

  return {
    id: s.id,
    drug: drugName,
    chemicalClass,
    pharmacologicalTarget,
    drugState,
    reversibility,
    route,
    onset,
    duration,
    locationOfMetabolism,
    bioactivationPathway: locationOfMetabolism,
    eliminationHalfLife,
    eliminationHalfLifeObj,
    keySarPearl,
    majorToxicityOrLimitation: toxicity,
    cid,
    clinicalData,
    structuralDifferences,
    pkPdProfile,
    clinicalUseCases,
    structure: {
      ...s,
      target: pharmacologicalTarget,
      chemicalClass,
      clinicalData,
      elimination_half_life: eliminationHalfLifeObj || s.elimination_half_life,
      structural_differences: structuralDifferences,
      pk_pd_profile: pkPdProfile,
      clinical_use_cases: clinicalUseCases,
    },
  };
}

export const MedChemMatrix: React.FC<MedChemMatrixProps> = ({
  moduleStructures,
  moduleTitle,
  onInspectStructure,
  globalActivePharmacophores = {},
  globalHoveredPharmacophoreId = null,
  focusMatchingOnly = false,
  onOpenPharmacophoreExplorer,
  pharmacophoreCount,
}) => {
  // TanStack Query: Fetch deduplicated, fully hydrated drugs from graph database
  const { data: hydratedDrugs = [] } = useQuery<HydratedDrug[]>({
    queryKey: ['hydratedDrugs'],
    queryFn: getHydratedDrugs,
  });

  const hydratedMap = useMemo(() => {
    const map = new Map<string, HydratedDrug>();
    for (const d of hydratedDrugs) {
      if (d.id) map.set(d.id.toLowerCase().trim(), d);
      if (d.name) {
        map.set(d.name.toLowerCase().trim(), d);
        const clean = d.name.replace(/\[.*?\]\s*/g, '').trim().toLowerCase();
        if (clean) map.set(clean, d);
      }
      if (d.cid) {
        map.set(`cid_${d.cid}`, d);
        map.set(String(d.cid), d);
      }
    }
    return map;
  }, [hydratedDrugs]);

  // Rely strictly on structures passed down from active Review Module
  const structures = useMemo(() => {
    if (moduleStructures !== undefined) {
      return moduleStructures;
    }
    // Fallback only if prop is completely omitted (e.g. standalone test)
    return Object.values(antiplateletStructures);
  }, [moduleStructures]);

  // 3 Distinct Categorical Filters + Text Search
  const [filterTarget, setFilterTarget] = useState<string>('all');
  const [filterChemicalClass, setFilterChemicalClass] = useState<string>('all');
  const [filterDrugState, setFilterDrugState] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Side-by-side comparative tool state
  const [drugA, setDrugA] = useState<string>(() => structures[0]?.id || '');
  const [drugB, setDrugB] = useState<string>(() => (structures[1] || structures[0])?.id || '');
  const [isExpandedStudioOpen, setIsExpandedStudioOpen] = useState<boolean>(false);
  const [isMatrixOpen, setIsMatrixOpen] = useState<boolean>(false);
  const [selectedLightboxStructure, setSelectedLightboxStructure] = useState<ChemicalStructure | null>(null);
  const [selectedFdaModalDrug, setSelectedFdaModalDrug] = useState<{
    drugName: string;
    rawText: string;
    adverseReactions?: string;
    contraindications?: string;
    boxedWarning?: string;
  } | null>(null);

  // Synchronize when active dataset changes
  useEffect(() => {
    if (structures.length > 1) {
      setDrugA(structures[0]?.id || '');
      setDrugB(structures[1]?.id || structures[0]?.id || '');
      setFilterTarget('all');
      setFilterChemicalClass('all');
      setFilterDrugState('all');
      setSearchTerm('');
    } else if (structures.length === 1) {
      setDrugA(structures[0]?.id || '');
      setDrugB(structures[0]?.id || '');
      setFilterTarget('all');
      setFilterChemicalClass('all');
      setFilterDrugState('all');
      setSearchTerm('');
    }
  }, [structures]);

  // Ensure head-to-head defaults from hydrated graph database when structures are populated
  useEffect(() => {
    if (hydratedDrugs.length > 1 && (!drugA || !drugB || drugA === drugB)) {
      setDrugA(hydratedDrugs[0].id);
      setDrugB(hydratedDrugs[1].id);
    }
  }, [hydratedDrugs, drugA, drugB]);

  // Build matrix rows strictly from current module structures deduplicated to prevent Cartesian explosion
  const matrixRows = useMemo(() => {
    const seenDrugKeys = new Set<string>();
    const rows: MedChemMatrixRow[] = [];

    for (let idx = 0; idx < structures.length; idx++) {
      const s = structures[idx];
      const normKey = (s.name || s.id || '').replace(/\[.*?\]\s*/g, '').trim().toLowerCase();
      if (!normKey || seenDrugKeys.has(normKey)) {
        continue;
      }
      seenDrugKeys.add(normKey);

      const row = structureToMatrixRow(s, hydratedMap);

      // Enrich with curated notes if available for known exact compounds
      const curatedMatch = antiplateletComparisonMatrix.find(
        (c) =>
          (c.cid && (c.cid === s.cid || c.cid === s.pubchemAudit?.cid)) ||
          c.drug.toLowerCase() === s.name.toLowerCase()
      );
      if (curatedMatch) {
        if (!row.clinicalData?.adverseReactions && !row.clinicalData?.contraindicationsText && curatedMatch.majorToxicityOrLimitation) {
          row.majorToxicityOrLimitation = curatedMatch.majorToxicityOrLimitation;
        }
        if (!row.clinicalData?.location_of_metabolism && !row.clinicalData?.metabolism && !s.pkPdHighlights?.bioactivation && curatedMatch.bioactivationPathway) {
          row.locationOfMetabolism = curatedMatch.bioactivationPathway;
          row.bioactivationPathway = curatedMatch.bioactivationPathway;
        }
      }
      rows.push(row);
    }
    return rows;
  }, [structures, hydratedMap]);

  // Dynamically extract unique Targets from the current dataset
  const availableTargets = useMemo(() => {
    const set = new Set<string>();
    matrixRows.forEach((row) => {
      const target = row.pharmacologicalTarget?.trim();
      if (target) set.add(target);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [matrixRows]);

  // Dynamically extract unique Chemical Classes from the current dataset
  const availableChemicalClasses = useMemo(() => {
    const set = new Set<string>();
    matrixRows.forEach((row) => {
      const chemClass = row.chemicalClass?.trim();
      if (chemClass) set.add(chemClass);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [matrixRows]);

  // Dynamically extract unique Drug States from the current dataset
  const availableDrugStates = useMemo(() => {
    const set = new Set<string>();
    matrixRows.forEach((row) => {
      const state = row.drugState?.trim();
      if (state) set.add(state);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [matrixRows]);

  // Multi-criteria filter combining text search and all 3 categorical dropdowns
  const filteredRows = useMemo(() => {
    return matrixRows.filter((row) => {
      // 1. Text Search Filter
      const term = searchTerm.trim().toLowerCase();
      if (term) {
        const matchesSearch =
          row.drug.toLowerCase().includes(term) ||
          row.chemicalClass.toLowerCase().includes(term) ||
          row.pharmacologicalTarget.toLowerCase().includes(term) ||
          row.drugState.toLowerCase().includes(term) ||
          row.keySarPearl.toLowerCase().includes(term) ||
          row.locationOfMetabolism.toLowerCase().includes(term) ||
          (row.bioactivationPathway && row.bioactivationPathway.toLowerCase().includes(term)) ||
          row.majorToxicityOrLimitation.toLowerCase().includes(term) ||
          (row.cid > 0 && row.cid.toString().includes(term));

        if (!matchesSearch) return false;
      }

      // 2. Filter by Target
      if (filterTarget !== 'all') {
        if (row.pharmacologicalTarget.toLowerCase() !== filterTarget.toLowerCase()) {
          return false;
        }
      }

      // 3. Filter by Chemical Class
      if (filterChemicalClass !== 'all') {
        if (row.chemicalClass.toLowerCase() !== filterChemicalClass.toLowerCase()) {
          return false;
        }
      }

      // 4. Filter by Drug State
      if (filterDrugState !== 'all') {
        if (row.drugState.toLowerCase() !== filterDrugState.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [matrixRows, searchTerm, filterTarget, filterChemicalClass, filterDrugState]);

  const isFiltered =
    searchTerm.trim() !== '' ||
    filterTarget !== 'all' ||
    filterChemicalClass !== 'all' ||
    filterDrugState !== 'all';

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterTarget('all');
    setFilterChemicalClass('all');
    setFilterDrugState('all');
  };

  const structureA = useMemo(() => {
    return resolveStructureSafe(drugA, structures) || structures[0];
  }, [structures, drugA]);

  const structureB = useMemo(() => {
    return resolveStructureSafe(drugB, structures) || structures[1] || structures[0];
  }, [structures, drugB]);

  const handleSwapDrugs = () => {
    const temp = drugA;
    setDrugA(drugB);
    setDrugB(temp);
  };

  return (
    <div className="space-y-8">
      {/* ---------------------------------------------------- */}
      {/* 1. Interactive Head-to-Head Structure Comparator     */}
      {/* ---------------------------------------------------- */}
      <StructureComparator
        moduleStructures={structures}
        structureA={structureA}
        structureB={structureB}
        drugAKey={drugA}
        drugBKey={drugB}
        onSelectDrugA={setDrugA}
        onSelectDrugB={setDrugB}
        onSwapDrugs={handleSwapDrugs}
        onInspectStructure={onInspectStructure}
        onExpandStudio={() => setIsExpandedStudioOpen(true)}
        globalActivePharmacophores={globalActivePharmacophores}
        globalHoveredPharmacophoreId={globalHoveredPharmacophoreId}
        focusMatchingOnly={focusMatchingOnly}
      />

      {/* ---------------------------------------------------- */}
      {/* 2. Full Comparison Matrix Table                      */}
      {/* ---------------------------------------------------- */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col gap-3">
          {/* Header Row: Clickable Header/Button & Pharmacophore Explorer Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsMatrixOpen((prev) => !prev)}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
              aria-expanded={isMatrixOpen}
              aria-label="Toggle Head-to-Head Differential Matrix"
            >
              <h2 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Head-to-Head Differential Matrix</span>
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                  {filteredRows.length} / {matrixRows.length} drugs
                </span>
              </h2>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-transform duration-200 ${
                  isMatrixOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Pharmacophore Explorer Button */}
            {onOpenPharmacophoreExplorer && (
              <button
                type="button"
                onClick={onOpenPharmacophoreExplorer}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer hover:scale-102 shrink-0 self-start sm:self-auto"
                title="Open Pharmacophore Explorer Sidebar"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Pharmacophore Explorer</span>
                {pharmacophoreCount !== undefined && pharmacophoreCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-white text-blue-700 text-[10px] font-mono font-bold">
                    {pharmacophoreCount}
                  </span>
                )}
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Correlated across targets, reversibility, location of metabolism, half-lives, and SAR pearls
          </p>
        </div>

        {/* Collapsible Matrix Content Container */}
        {isMatrixOpen && (
          <div className="overflow-hidden space-y-4">
            {/* Controls Bar: Search Box & 3 Tailwind Select Filters */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {/* Search Box */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <input
                id="matrix-search-input"
                name="matrixSearch"
                type="text"
                placeholder="Search drug, target, SAR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-1.5 pl-8 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            {/* Filter 1: Target Dropdown */}
            <div className="relative">
              <select
                id="matrix-filter-target"
                aria-label="Filter by Target"
                value={filterTarget}
                onChange={(e) => setFilterTarget(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs cursor-pointer max-w-[200px] truncate"
              >
                <option value="all">Filter by Target (All)</option>
                {availableTargets.map((target) => (
                  <option key={target} value={target}>
                    {target}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 2: Chemical Class Dropdown */}
            <div className="relative">
              <select
                id="matrix-filter-chemical-class"
                aria-label="Filter by Chemical Class"
                value={filterChemicalClass}
                onChange={(e) => setFilterChemicalClass(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs cursor-pointer max-w-[220px] truncate"
              >
                <option value="all">Filter by Chemical Class (All)</option>
                {availableChemicalClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter 3: Drug State Dropdown */}
            <div className="relative">
              <select
                id="matrix-filter-drug-state"
                aria-label="Filter by Drug State"
                value={filterDrugState}
                onChange={(e) => setFilterDrugState(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs cursor-pointer max-w-[180px] truncate"
              >
                <option value="all">Filter by Drug State (All)</option>
                {availableDrugStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters Action Button */}
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                title="Reset all search and dropdown filters"
              >
                <RotateCcw className="w-3 h-3 text-slate-500" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

        {/* Matrix Table with Sticky Column and Merged PK Parameters */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                {/* Sticky Left Column Header */}
                <th className="sticky left-0 z-20 bg-slate-50 dark:bg-slate-950 shadow-[2px_0_5px_rgba(0,0,0,0.06)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.5)] py-2.5 px-3 whitespace-nowrap">
                  Structure &amp; Drug
                </th>
                <th className="py-2.5 px-3 whitespace-nowrap">Chemical Class</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Target &amp; Bond</th>
                <th className="py-2.5 px-3 whitespace-nowrap">PK Parameters</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Location of Metabolism</th>
                <th className="py-2.5 px-3 whitespace-nowrap min-w-[220px]">Key MedChem / SAR Pearl</th>
                <th className="py-2.5 px-3 whitespace-nowrap min-w-[180px]">Black Box / Toxicity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-xs text-slate-500 italic">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span>
                        {structures.length === 0
                          ? 'No chemical structures available in this module.'
                          : 'No structures match the active search and dropdown filter criteria.'}
                      </span>
                      {isFiltered && (
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="text-blue-600 dark:text-blue-400 underline hover:no-underline cursor-pointer font-medium"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr
                    key={row.id + row.drug}
                    className="hover:bg-indigo-950/20 transition-colors group"
                  >
                    {/* Sticky First Column: Structure Thumbnail, Drug, CID & Drug State Badge */}
                    <td className="sticky left-0 z-10 bg-white dark:bg-slate-950 shadow-[2px_0_5px_rgba(0,0,0,0.06)] dark:shadow-[2px_0_5px_rgba(0,0,0,0.5)] py-2 px-3 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap transition-colors">
                      <div className="flex items-center gap-2.5">
                        {/* 2D Structure Thumbnail */}
                        {(() => {
                          const thumbUrl =
                            row.structure?.pngUrl ||
                            (row.cid > 0
                              ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${row.cid}/PNG?image_size=large`
                              : undefined);
                          return thumbUrl ? (
                            <button
                              type="button"
                              onClick={() => setSelectedLightboxStructure(row.structure)}
                              className="group/thumb relative rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-0.5 hover:border-blue-500 hover:ring-2 hover:ring-blue-400/30 transition-all shrink-0 cursor-pointer shadow-2xs"
                              title={`Enlarge 2D structure of ${row.drug}`}
                            >
                              <img
                                src={thumbUrl}
                                alt={row.drug}
                                className="w-10 h-10 object-contain rounded"
                                loading="lazy"
                              />
                            </button>
                          ) : (
                            <div className="w-10 h-10 rounded-md border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0 text-slate-400 text-[10px]">
                              N/A
                            </div>
                          );
                        })()}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span>{row.drug}</span>
                            {row.cid > 0 && (
                              <a
                                href={`https://pubchem.ncbi.nlm.nih.gov/compound/${row.cid}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
                                title="View on PubChem"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] text-slate-400 block font-normal">
                              {row.cid > 0 ? `CID: ${row.cid}` : 'PubChem Unresolved'}
                            </span>
                            {row.drugState && (
                              <span
                                className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                                  row.drugState.toLowerCase().includes('prodrug')
                                    ? 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/80 dark:text-fuchsia-300'
                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                                }`}
                              >
                                {row.drugState}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Chemical Class */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {row.chemicalClass}
                    </td>

                    {/* Target & Reversibility */}
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {row.pharmacologicalTarget}
                      </div>
                      <span
                        className={`inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded mt-0.5 ${
                          row.reversibility.toLowerCase().includes('irrev')
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {row.reversibility}
                      </span>
                    </td>

                    {/* Merged PK Parameters Column (Route / Onset on top, Duration below) */}
                    <td className="py-2.5 px-3 min-w-[160px] max-w-[200px] align-top">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {row.route} ·{' '}
                        <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                          Onset: {row.onset}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        Duration: {row.duration}
                      </div>
                      {/* Elimination Half-Life cleanly rendered */}
                      {((row.eliminationHalfLifeObj?.value && row.eliminationHalfLifeObj?.unit) || (row.eliminationHalfLife && row.eliminationHalfLife !== '—')) && (
                        <div className="mt-1">
                          <div className="font-mono text-[10px] text-slate-600 dark:text-slate-400">
                            t½:{' '}
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {row.eliminationHalfLifeObj
                                ? `${row.eliminationHalfLifeObj.value} ${row.eliminationHalfLifeObj.unit}`
                                : row.eliminationHalfLife}
                            </span>
                            {Boolean(row.clinicalData?.halfLife || row.clinicalData?.elimination_half_life) && (
                              <span
                                className="ml-1.5 inline-flex items-center px-1 py-0.2 rounded text-[8px] font-mono font-medium bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                                title="Distilled via Gemini FDA transformation layer"
                              >
                                FDA
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Color-Coded Location of Metabolism */}
                    <td className="py-2.5 px-3 text-[11px] max-w-xs align-top">
                      <ExpandableClinicalText
                        text={row.locationOfMetabolism}
                        maxChars={120}
                        highlightBioactivation={true}
                        isOpenFda={Boolean(row.clinicalData?.location_of_metabolism || row.clinicalData?.metabolism)}
                      />
                    </td>

                    {/* Key SAR Pearl & Head-to-Head Differential Matrix Contrast Cards */}
                    <td className="py-2.5 px-3 text-[11px] min-w-[240px] max-w-md align-top space-y-1.5">
                      <ExpandableClinicalText
                        text={row.keySarPearl}
                        maxChars={150}
                        isOpenFda={Boolean(row.clinicalData?.mechanism)}
                      />

                      {/* Native Tailwind UI mapping for structured JSON contrast keys */}
                      {(row.structuralDifferences || row.pkPdProfile || row.clinicalUseCases) && (
                        <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800/60 space-y-1">
                          {row.structuralDifferences && (
                            <div className="p-1.5 rounded-md bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-[10px] text-amber-900 dark:text-amber-200 leading-tight">
                              <span className="font-bold text-amber-800 dark:text-amber-300">Structure: </span>
                              <span>{row.structuralDifferences}</span>
                            </div>
                          )}
                          {row.pkPdProfile && (
                            <div className="p-1.5 rounded-md bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 text-[10px] text-blue-900 dark:text-blue-200 leading-tight">
                              <span className="font-bold text-blue-800 dark:text-blue-300">PK/PD: </span>
                              <span>{row.pkPdProfile}</span>
                            </div>
                          )}
                          {row.clinicalUseCases && (
                            <div className="p-1.5 rounded-md bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-[10px] text-emerald-900 dark:text-emerald-200 leading-tight">
                              <span className="font-bold text-emerald-800 dark:text-emerald-300">Clinical: </span>
                              <span>{row.clinicalUseCases}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Major Toxicity / Adverse Reactions */}
                    <td className="py-2.5 px-3 text-[11px] min-w-[200px] max-w-sm text-rose-700 dark:text-rose-300 align-top">
                      {(() => {
                        const warningsSource =
                          Array.isArray(row.clinicalData?.adverse_reactions) && row.clinicalData.adverse_reactions.length > 0
                            ? row.clinicalData.adverse_reactions
                            : (row.clinicalData?.adverseReactions || row.clinicalData?.contraindicationsText)
                            ? [
                                ...(row.clinicalData?.contraindicationsText ? [`Contraindications: ${row.clinicalData.contraindicationsText}`] : []),
                                ...(row.clinicalData?.adverseReactions ? [`Adverse Reactions: ${row.clinicalData.adverseReactions}`] : []),
                              ]
                            : row.majorToxicityOrLimitation;

                        const formatted = formatClinicalWarnings(warningsSource, 5);
                        const isOpenFda = Boolean(
                          row.clinicalData?.adverseReactions ||
                          row.clinicalData?.contraindicationsText ||
                          (Array.isArray(row.clinicalData?.adverse_reactions) && row.clinicalData.adverse_reactions.length > 0)
                        );

                        return (
                          <div className="space-y-1.5">
                            {formatted.items.length > 0 ? (
                              <ul className="list-disc list-inside space-y-0.5 marker:text-rose-500 leading-snug">
                                {formatted.items.map((item, idx) => (
                                  <li key={idx} className="break-words">
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="leading-snug break-words">
                                {row.majorToxicityOrLimitation || 'Monitor therapeutic index and organ clearance.'}
                              </div>
                            )}

                            <div className="pt-0.5 flex items-center gap-1.5 flex-wrap">
                              {isOpenFda && (
                                <span
                                  className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono font-medium bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                                  title="Hydrated directly from official OpenFDA Drug Label API"
                                >
                                  OpenFDA
                                </span>
                              )}
                              {(formatted.isTruncated || isOpenFda) && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFdaModalDrug({
                                      drugName: row.drug,
                                      rawText: formatted.rawText || row.majorToxicityOrLimitation,
                                      adverseReactions:
                                        row.clinicalData?.adverseReactions ||
                                        (Array.isArray(row.clinicalData?.adverse_reactions)
                                          ? row.clinicalData.adverse_reactions.join('\n• ')
                                          : undefined),
                                      contraindications: row.clinicalData?.contraindicationsText,
                                      boxedWarning: row.clinicalData?.boxedWarning,
                                    });
                                  }}
                                  className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:underline cursor-pointer inline-flex items-center gap-1"
                                >
                                  <FileText className="w-2.5 h-2.5" />
                                  <span>View Full FDA Label {formatted.isTruncated ? `(${formatted.totalCount} points)` : ''}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
          </div>
        )}
      </section>

      {/* Expanded Dual-Drug Comparator Studio Modal */}
      {isExpandedStudioOpen && structureA && structureB && (
        <StructureLightboxModal
          isOpen={isExpandedStudioOpen}
          onClose={() => setIsExpandedStudioOpen(false)}
          initialStructure={structureA}
          initialSecondaryStructure={structureB}
          initialCompareMode={true}
          comparisonPool={structures}
          onInspectPubChem={onInspectStructure}
        />
      )}

      {/* Structure Lightbox Modal for matrix thumbnails */}
      {selectedLightboxStructure && (
        <StructureLightboxModal
          isOpen={Boolean(selectedLightboxStructure)}
          onClose={() => setSelectedLightboxStructure(null)}
          initialStructure={selectedLightboxStructure}
          comparisonPool={structures}
          onInspectPubChem={onInspectStructure}
        />
      )}

      {/* Full FDA Prescribing Information Modal */}
      {selectedFdaModalDrug && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setSelectedFdaModalDrug(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>FDA Prescribing Information</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-mono">
                    {selectedFdaModalDrug.drugName}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Complete unedited regulatory adverse reactions and boxed warnings from OpenFDA.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFdaModalDrug(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {selectedFdaModalDrug.boxedWarning && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200">
                  <h4 className="font-bold uppercase tracking-wider text-[10px] text-amber-800 dark:text-amber-300 mb-1">
                    FDA Boxed Warning
                  </h4>
                  <p className="whitespace-pre-wrap">{selectedFdaModalDrug.boxedWarning}</p>
                </div>
              )}
              {selectedFdaModalDrug.contraindications && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200">
                  <h4 className="font-bold uppercase tracking-wider text-[10px] text-rose-800 dark:text-rose-300 mb-1">
                    Contraindications
                  </h4>
                  <p className="whitespace-pre-wrap">{selectedFdaModalDrug.contraindications}</p>
                </div>
              )}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold uppercase tracking-wider text-[10px] text-slate-600 dark:text-slate-400 mb-1">
                  Adverse Reactions &amp; Warnings
                </h4>
                <p className="whitespace-pre-wrap">
                  {selectedFdaModalDrug.adverseReactions || selectedFdaModalDrug.rawText}
                </p>
              </div>
            </div>
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedFdaModalDrug(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AntiplateletMatrixView = MedChemMatrix;
export default MedChemMatrix;
