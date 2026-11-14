import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Atom,
  Search,
  ArrowLeft,
  Layers,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Sliders,
  Sparkles,
  Target,
  Info,
  X,
  Pill,
} from 'lucide-react';
import type { ChemicalStructure } from '../types/reviewModule';
import type {
  Drug3DCatalogEntry,
  DrugBindingSite,
  TherapeuticClass3DGroup,
} from '../types/structure3d';
import {
  DRUG_3D_CATALOG,
  THERAPEUTIC_CLASS_3D_GROUPS,
  getDrug3DById,
  resolveDrug3DEntry,
} from '../data/drug3dCatalog';
import { ThreeDLabCanvas } from './ThreeDLabCanvas';
import { ThreeDLabTutorialModal } from './ThreeDLabTutorialModal';

export interface ThreeDLabLibraryProps {
  initialDrugName?: string;
  initialPdbId?: string;
  initialFullscreen?: boolean;
  structures?: ChemicalStructure[];
  onBackToReview?: () => void;
}

/**
 * Pure helper: toggles a 1..39 therapeutic class row open or closed.
 * Clicking an already-expanded class collapses it; clicking another switches expansion.
 */
export function toggleExpandedClass(
  current: number | null,
  clicked: number
): number | null {
  return current === clicked ? null : clicked;
}

/**
 * Pure helper: selects a drug from a class dropdown, immediately collapses the
 * expanded class row, and resets binding-site focus to All Binding Sites.
 */
export function selectDrugAndCollapse(drugId: string): {
  selectedDrugId: string;
  expandedClassNumber: null;
  activeBindingSiteId: null;
} {
  return {
    selectedDrugId: drugId,
    expandedClassNumber: null,
    activeBindingSiteId: null,
  };
}

/**
 * Pure helper: filters the 1..39 therapeutic class groups by class number/name,
 * drug generic/brand name, pharmacologic class, or receptor target.
 */
export function filterTherapeuticClassGroups(
  groups: TherapeuticClass3DGroup[],
  query: string
): TherapeuticClass3DGroup[] {
  const q = query.trim().toLowerCase();
  if (!q) return groups;

  const filtered: TherapeuticClass3DGroup[] = [];
  for (const group of groups) {
    const classHeader = `${group.classNumber}. ${group.categoryName}`.toLowerCase();
    const classMatches =
      classHeader.includes(q) ||
      String(group.classNumber) === q ||
      group.categoryName.toLowerCase().includes(q);

    const matchingDrugs = group.drugs.filter(
      (d) =>
        d.genericName.toLowerCase().includes(q) ||
        d.brandNames.some((b) => b.toLowerCase().includes(q)) ||
        d.pharmacologicClass.toLowerCase().includes(q) ||
        d.targetName.toLowerCase().includes(q) ||
        d.geneSymbol.toLowerCase().includes(q)
    );

    if (matchingDrugs.length > 0) {
      filtered.push({
        ...group,
        drugs: matchingDrugs,
      });
    } else if (classMatches) {
      filtered.push(group);
    }
  }

  return filtered;
}

export const ThreeDLabLibrary: React.FC<ThreeDLabLibraryProps> = ({
  initialDrugName,
  initialPdbId,
  initialFullscreen = false,
  onBackToReview,
}) => {
  const initialResolvedEntry: Drug3DCatalogEntry = useMemo(() => {
    return (
      resolveDrug3DEntry(initialDrugName, initialPdbId) ||
      getDrug3DById('clopidogrel') ||
      DRUG_3D_CATALOG[0]
    );
  }, [initialDrugName, initialPdbId]);

  const [selectedDrugId, setSelectedDrugId] = useState<string>(initialResolvedEntry.id);
  const [expandedClassNumber, setExpandedClassNumber] = useState<number | null>(null);
  const [activeBindingSiteId, setActiveBindingSiteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isFullscreen, setIsFullscreen] = useState<boolean>(initialFullscreen ?? false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState<boolean>(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState<boolean>(false);
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState<boolean>(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState<boolean>(false);

  // Sync when external handoff props change
  useEffect(() => {
    if (initialDrugName || initialPdbId) {
      const resolved = resolveDrug3DEntry(initialDrugName, initialPdbId);
      if (resolved) {
        setSelectedDrugId(resolved.id);
        setExpandedClassNumber(null);
        setActiveBindingSiteId(null);
      }
    }
    if (initialFullscreen !== undefined) {
      setIsFullscreen(initialFullscreen);
    }
  }, [initialDrugName, initialPdbId, initialFullscreen]);

  const activeEntry: Drug3DCatalogEntry = useMemo(() => {
    return (
      getDrug3DById(selectedDrugId) ||
      getDrug3DById('clopidogrel') ||
      DRUG_3D_CATALOG[0]
    );
  }, [selectedDrugId]);

  const activeBindingSite: DrugBindingSite | null = useMemo(() => {
    if (!activeBindingSiteId) return null;
    return activeEntry.bindingSites.find((s) => s.id === activeBindingSiteId) || null;
  }, [activeEntry, activeBindingSiteId]);

  const filteredClassGroups = useMemo(
    () => filterTherapeuticClassGroups(THERAPEUTIC_CLASS_3D_GROUPS, searchQuery),
    [searchQuery]
  );

  // Escape key hierarchy in fullscreen mode: close open drawer first, then exit fullscreen
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLeftDrawerOpen) {
          setIsLeftDrawerOpen(false);
        } else if (isRightDrawerOpen) {
          setIsRightDrawerOpen(false);
        } else {
          setIsFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, isLeftDrawerOpen, isRightDrawerOpen]);

  // Trigger Mol* WebGL resize recalculation whenever layout changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('resize'));
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [isFullscreen, isLeftCollapsed, isRightCollapsed, isLeftDrawerOpen, isRightDrawerOpen]);

  const handleChooseDrugFromDropdown = (drugId: string) => {
    if (!drugId) return;
    const next = selectDrugAndCollapse(drugId);
    setSelectedDrugId(next.selectedDrugId);
    setExpandedClassNumber(next.expandedClassNumber);
    setActiveBindingSiteId(next.activeBindingSiteId);
    setIsLeftDrawerOpen(false);
  };

  // Compute responsive 12-col span for center 3D viewport (Left=3, Center=5, Right=4)
  const centerColSpanClass = useMemo(() => {
    if (isLeftCollapsed && isRightCollapsed) return 'lg:col-span-12';
    if (isLeftCollapsed) return 'lg:col-span-8';
    if (isRightCollapsed) return 'lg:col-span-9';
    return 'lg:col-span-5';
  }, [isLeftCollapsed, isRightCollapsed]);

  // --------------------------------------------------------------------------
  // Reusable Panel Renderers (Regular Sidebars & Fullscreen Drawers)
  // --------------------------------------------------------------------------

  const renderTherapeuticClassPicker = () => (
    <div className="flex flex-col h-full min-h-0">
      {/* Active Drug Summary Card */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-cyan-50/40 dark:bg-cyan-950/20 space-y-1 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
            Active Drug
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Class {activeEntry.therapeuticClassNumber}
          </span>
        </div>
        <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
          {activeEntry.genericName}
          {activeEntry.brandNames[0] ? (
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">
              ({activeEntry.brandNames[0]})
            </span>
          ) : null}
        </div>
        <div className="text-[11px] text-slate-600 dark:text-slate-300">
          {activeEntry.therapeuticClassNumber}. {activeEntry.therapeuticCategory}
        </div>
        <div className="text-[11px] font-medium text-cyan-800 dark:text-cyan-300 flex items-center gap-1">
          <Target className="w-3 h-3 shrink-0" />
          <span className="truncate">
            {activeEntry.targetName} ({activeEntry.geneSymbol})
          </span>
        </div>
      </div>

      {/* Search Filter */}
      <div className="p-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 shrink-0">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Filter classes or drugs..."
            aria-label="Filter classes or drugs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              aria-label="Clear filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 1..39 Collapsible Therapeutic Class List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 min-h-0">
        {filteredClassGroups.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400">
            No classes or drugs match &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredClassGroups.map((group) => {
            const isExpanded = expandedClassNumber === group.classNumber;
            const containsActiveDrug =
              activeEntry.therapeuticClassNumber === group.classNumber;

            return (
              <div
                key={group.classNumber}
                className={`rounded-lg border transition-colors ${
                  containsActiveDrug
                    ? 'border-cyan-400/70 dark:border-cyan-700 bg-cyan-50/40 dark:bg-cyan-950/25'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50'
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedClassNumber((curr) =>
                      toggleExpandedClass(curr, group.classNumber)
                    )
                  }
                  aria-expanded={isExpanded}
                  className="w-full px-2.5 py-2 flex items-center justify-between gap-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/70 rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    {containsActiveDrug && (
                      <span
                        className="w-2 h-2 rounded-full bg-cyan-500 shrink-0"
                        title={`Active drug: ${activeEntry.genericName}`}
                      />
                    )}
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {group.classNumber}. {group.categoryName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {group.drugs.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-cyan-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-2.5 pb-2.5 pt-1 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40 rounded-b-lg">
                    <select
                      aria-label={`Select drug in ${group.categoryName}`}
                      value={containsActiveDrug ? activeEntry.id : ''}
                      onChange={(e) => handleChooseDrugFromDropdown(e.target.value)}
                      className="w-full text-xs font-medium rounded-lg border border-cyan-400 dark:border-cyan-600 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                    >
                      <option value="" disabled>
                        Choose a drug ({group.drugs.length})...
                      </option>
                      {group.drugs.map((drug) => (
                        <option key={drug.id} value={drug.id}>
                          {drug.genericName}
                          {drug.brandNames[0] ? ` (${drug.brandNames[0]})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const renderBindingAndMechanismPanel = () => (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto p-3.5 space-y-4">
      {/* Section 1: Plain-Language Drug Mechanism & Crystal Context */}
      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-2.5 shadow-2xs">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block">
              {activeEntry.pharmacologicClass}
            </span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              How {activeEntry.genericName} Binds &amp; Reacts
            </h2>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
            {activeEntry.geneSymbol} • {activeEntry.pdbId}
          </span>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {activeEntry.overallMechanism}
        </p>

        {activeEntry.prodrugNote && (
          <div className="p-2.5 rounded-lg bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/70 text-[11px] text-indigo-900 dark:text-indigo-200 leading-relaxed">
            <span className="font-bold text-indigo-700 dark:text-indigo-300">
              Active Metabolite / Prodrug Note:{' '}
            </span>
            {activeEntry.prodrugNote}
          </div>
        )}

        {!activeEntry.isExactDrugCrystal && (
          <div className="p-2.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Class Pocket Crystal ({activeEntry.pdbId}):</strong> Shown in the
              experimental <strong>{activeEntry.targetName}</strong> pocket co-crystallized with
              class reference ligand <strong>{activeEntry.crystallizedLigandName}</strong>,
              highlighting the conserved binding residues engaged by {activeEntry.genericName}.
            </span>
          </div>
        )}
      </div>

      {/* Section 2: Relevant Binding Sites Interactive Walkthrough */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Relevant Binding Sites ({activeEntry.bindingSites.length})</span>
          </span>
          <span className="text-[10px] text-slate-400">Click to zoom in 3D</span>
        </div>

        {/* Default All Binding Sites Overview Button */}
        <button
          type="button"
          onClick={() => setActiveBindingSiteId(null)}
          aria-pressed={activeBindingSiteId === null}
          className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
            activeBindingSiteId === null
              ? 'bg-cyan-50 dark:bg-cyan-950/50 border-cyan-400 dark:border-cyan-500 shadow-xs'
              : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                All Binding Sites (Full Pocket)
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Displays the complete drug ligand and all key receptor contact residues together
              </div>
            </div>
          </div>
        </button>

        {/* Numbered Drug Binding Site Cards */}
        {activeEntry.bindingSites.map((site, index) => {
          const isSelected = activeBindingSiteId === site.id;
          return (
            <button
              key={site.id}
              type="button"
              onClick={() =>
                setActiveBindingSiteId((prev) => (prev === site.id ? null : site.id))
              }
              aria-pressed={isSelected}
              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer space-y-2 ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-slate-800 border-2 shadow-md'
                  : 'bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-cyan-400/60 dark:hover:border-cyan-700'
              }`}
              style={isSelected ? { borderColor: site.colorAccent } : undefined}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 border border-white/30"
                    style={{ backgroundColor: site.colorAccent }}
                  />
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? 'text-white' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {index + 1}. {site.siteName}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                  {site.interactionType}
                </span>
              </div>

              {/* Residue Pills */}
              <div className="flex flex-wrap items-center gap-1">
                {site.residues.map((res) => (
                  <span
                    key={`${res.chain}_${res.resi}_${res.resn}`}
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-100/80 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-300/50 dark:border-cyan-800"
                  >
                    {res.label} (Chain {res.chain})
                  </span>
                ))}
              </div>

              <div
                className={`text-[11px] font-medium ${
                  isSelected ? 'text-cyan-200' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <strong>Drug Group:</strong> {site.drugMoiety}
              </div>

              <p
                className={`text-xs leading-relaxed ${
                  isSelected ? 'text-slate-100' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {site.reactionSummary}
              </p>

              <div
                className={`text-[11px] pt-1.5 border-t leading-relaxed ${
                  isSelected
                    ? 'border-slate-700 text-emerald-300'
                    : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                <strong>Clinical / SAR Relevance:</strong> {site.clinicalRelevance}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const canvasKey = `${activeEntry.pdbId}-${activeEntry.ligandCode}-${activeEntry.ligandMode || 'het'}`;

  // --------------------------------------------------------------------------
  // FULLSCREEN MODE RENDER
  // --------------------------------------------------------------------------
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 w-screen h-screen overflow-hidden flex flex-col">
        <button
          type="button"
          onClick={() => setIsLeftDrawerOpen(true)}
          className="fixed left-0 top-20 z-[52] flex items-center gap-1.5 px-3 py-2 rounded-r-xl bg-slate-900/95 hover:bg-slate-800 text-cyan-300 border-y border-r border-cyan-500/50 shadow-2xl backdrop-blur-md transition-all cursor-pointer text-xs font-semibold"
          title="Open Drugs (1–39) Drawer"
          aria-label="Open Drugs (1–39) Drawer"
        >
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Drugs (1–39)</span>
          <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
        </button>

        <button
          type="button"
          onClick={() => setIsRightDrawerOpen((prev) => !prev)}
          className="fixed right-0 top-20 z-[52] flex items-center gap-1.5 px-3 py-2 rounded-l-xl bg-slate-900/95 hover:bg-slate-800 text-emerald-300 border-y border-l border-emerald-500/50 shadow-2xl backdrop-blur-md transition-all cursor-pointer text-xs font-semibold"
          title="Open Binding & Mechanism Drawer"
          aria-label="Open Binding & Mechanism Drawer"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-emerald-400" />
          <span>Binding &amp; Mechanism</span>
          <Pill className="w-4 h-4 text-emerald-400" />
        </button>

        {(isLeftDrawerOpen || isRightDrawerOpen) && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[55]"
            onClick={() => {
              setIsLeftDrawerOpen(false);
              setIsRightDrawerOpen(false);
            }}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 w-80 sm:w-96 max-w-[85vw] bg-white dark:bg-slate-900 z-[60] shadow-2xl flex flex-col border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out ${
            isLeftDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-500" />
              <span>Browse Drugs by Class (1–39)</span>
            </span>
            <button
              type="button"
              onClick={() => setIsLeftDrawerOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer"
              aria-label="Close Drugs Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            {renderTherapeuticClassPicker()}
          </div>
        </aside>

        <aside
          className={`fixed inset-y-0 right-0 w-80 sm:w-[420px] max-w-[90vw] bg-slate-50 dark:bg-slate-950 z-[60] shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out ${
            isRightDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-500" />
              <span>Drug Binding &amp; Mechanism</span>
            </span>
            <button
              type="button"
              onClick={() => setIsRightDrawerOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer"
              aria-label="Close Binding Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            {renderBindingAndMechanismPanel()}
          </div>
        </aside>

        <div className="flex-1 w-full h-full relative overflow-hidden">
          <ThreeDLabCanvas
            key={canvasKey}
            pdbId={activeEntry.pdbId}
            preferredLigandCode={activeEntry.ligandCode}
            ligandChain={activeEntry.ligandChain}
            ligandMode={activeEntry.ligandMode}
            drugEntry={activeEntry}
            targetName={activeEntry.targetName}
            geneSymbol={activeEntry.geneSymbol}
            activeBindingSite={activeBindingSite}
            onSelectBindingSite={(site) => setActiveBindingSiteId(site?.id ?? null)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(false)}
            onOpenTutorial={() => setIsTutorialOpen(true)}
          />
        </div>

        <ThreeDLabTutorialModal
          isOpen={isTutorialOpen}
          onClose={() => setIsTutorialOpen(false)}
        />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // REGULAR 3-COLUMN DRUG STUDIO RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] min-h-[600px] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Top Studio Header */}
      <header className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          {onBackToReview && (
            <button
              type="button"
              onClick={onBackToReview}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Review Deck</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  3D Drug Binding Studio
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                  Mol* / RCSB PDB
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose a drug by therapeutic class (1–39) to inspect its 3D receptor pocket and key binding reactions
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
            <Atom className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Drug:</span>
            <span className="font-bold">{activeEntry.genericName}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Receptor:</span>
            <span className="font-bold">
              {activeEntry.geneSymbol} ({activeEntry.pdbId})
            </span>
          </div>
        </div>
      </header>

      {/* 3-Column Drug Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden min-h-0 relative">
        {/* LEFT COLUMN: 1..39 Therapeutic Class Picker (3 cols) */}
        {!isLeftCollapsed ? (
          <div className="lg:col-span-3 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col min-h-0 overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Browse by Class (1–39)</span>
              </span>
              <button
                type="button"
                onClick={() => setIsLeftCollapsed(true)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                title="Collapse Classes Panel"
                aria-label="Collapse Classes Panel"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            {renderTherapeuticClassPicker()}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsLeftCollapsed(false)}
            className="hidden lg:flex absolute left-0 top-3 z-30 items-center gap-1 px-2.5 py-1.5 rounded-r-lg bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border-y border-r border-cyan-500/40 shadow-md text-xs font-semibold cursor-pointer"
            title="Expand Classes (1–39) Panel"
            aria-label="Expand Classes (1–39) Panel"
          >
            <span>Classes (1–39)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* CENTER COLUMN: 3D Mol* Viewport (5 / 8 / 9 / 12 cols) */}
        <div className={`${centerColSpanClass} flex flex-col min-h-[380px] h-full overflow-hidden relative`}>
          <ThreeDLabCanvas
            key={canvasKey}
            pdbId={activeEntry.pdbId}
            preferredLigandCode={activeEntry.ligandCode}
            ligandChain={activeEntry.ligandChain}
            ligandMode={activeEntry.ligandMode}
            drugEntry={activeEntry}
            targetName={activeEntry.targetName}
            geneSymbol={activeEntry.geneSymbol}
            activeBindingSite={activeBindingSite}
            onSelectBindingSite={(site) => setActiveBindingSiteId(site?.id ?? null)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen((f) => !f)}
            onOpenTutorial={() => setIsTutorialOpen(true)}
          />
        </div>

        {/* RIGHT COLUMN: Drug Binding & Mechanism Walkthrough (4 cols) */}
        {!isRightCollapsed ? (
          <div className="lg:col-span-4 border-l border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 flex flex-col min-h-0 overflow-hidden">
            <div className="px-3 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Binding &amp; Mechanism</span>
              </span>
              <button
                type="button"
                onClick={() => setIsRightCollapsed(true)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                title="Collapse Binding & Mechanism Panel"
                aria-label="Collapse Binding & Mechanism Panel"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            {renderBindingAndMechanismPanel()}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsRightCollapsed(false)}
            className="hidden lg:flex absolute right-0 top-3 z-30 items-center gap-1 px-2.5 py-1.5 rounded-l-lg bg-slate-900/90 hover:bg-slate-800 text-emerald-300 border-y border-l border-emerald-500/40 shadow-md text-xs font-semibold cursor-pointer"
            title="Expand Binding & Mechanism Panel"
            aria-label="Expand Binding & Mechanism Panel"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Binding Sites</span>
          </button>
        )}
      </div>

      <ThreeDLabTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  );
};
