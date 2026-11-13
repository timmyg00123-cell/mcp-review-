import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Atom,
  Search,
  ArrowLeft,
  Loader2,
  Layers,
  ChevronRight,
  ChevronLeft,
  Database,
  Sliders,
  Activity,
  X,
  ExternalLink,
  Pill,
} from 'lucide-react';
import type { ChemicalStructure } from '../types/reviewModule';
import type {
  PharmacophorePkPdGroup,
  KeyPocketResidueContact,
} from '../types/structure3d';
import {
  CANONICAL_MEDCHEM_TARGETS,
  findCanonicalTargetForDrug,
  type TargetPdbMapping,
} from '../utils/canonicalTargets';
import { findMedChemProfile } from '../data/canonicalPharmacophorePkData';
import {
  fetchChemblBioactivity,
  type ChemblBioactivityRecord,
} from '../services/chemblService';
import { ThreeDLabCanvas } from './ThreeDLabCanvas';
import { ThreeDLabTutorialModal } from './ThreeDLabTutorialModal';
import { PharmacophorePkDrawer } from './PharmacophorePkDrawer';

export interface ThreeDLabLibraryProps {
  initialDrugName?: string;
  initialPdbId?: string;
  structures?: ChemicalStructure[];
  onBackToReview?: () => void;
}

/**
 * Categorizes canonical targets into clinical pharmacology therapeutic areas.
 */
function getTargetCategory(target: TargetPdbMapping): string {
  const symbol = target.geneSymbol.toUpperCase();
  if (['P2RY12', 'ACE', 'AGTR1', 'HMGCR', 'ADRB1'].includes(symbol)) {
    return 'Cardiovascular';
  }
  if (['ADRB2'].includes(symbol)) {
    return 'Respiratory & Autonomic';
  }
  if (['PTGS2', 'PTGS1'].includes(symbol)) {
    return 'Anti-inflammatory';
  }
  if (['DHFR', 'EGFR'].includes(symbol)) {
    return 'Oncology';
  }
  if (['POL', 'PBP'].includes(symbol)) {
    return 'Antimicrobial';
  }
  return 'Other Targets';
}

export const ThreeDLabLibrary: React.FC<ThreeDLabLibraryProps> = ({
  initialDrugName,
  initialPdbId,
  structures = [],
  onBackToReview,
}) => {
  // Resolve initial target and PDB ID
  const initialResolvedTarget = useMemo(() => {
    if (initialPdbId) {
      const match = CANONICAL_MEDCHEM_TARGETS.find(
        (t) => t.pdbId.toUpperCase() === initialPdbId.toUpperCase()
      );
      if (match) return match;
    }
    if (initialDrugName) {
      const match = findCanonicalTargetForDrug(initialDrugName);
      if (match) return match;
    }
    return CANONICAL_MEDCHEM_TARGETS[0];
  }, [initialPdbId, initialDrugName]);

  const [activePdbId, setActivePdbId] = useState<string>(
    (initialPdbId || initialResolvedTarget?.pdbId || '4NTJ').toUpperCase()
  );
  const [activeDrugName, setActiveDrugName] = useState<string>(
    initialDrugName || initialResolvedTarget?.exampleDrugs[0] || 'Clopidogrel'
  );

  // Search and custom PDB state
  const [searchQuery, setSearchQuery] = useState('');
  const [customPdbInput, setCustomPdbInput] = useState('');
  const [customPdbError, setCustomPdbError] = useState<string | null>(null);

  // Fullscreen, Tutorial & Sidebar/Drawer states
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState<boolean>(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState<boolean>(false);
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState<boolean>(false);
  const [activeRightDrawer, setActiveRightDrawer] = useState<'none' | 'chembl' | 'pharmacophore'>('none');

  // Pharmacophore PK & PD State
  const [activePharmacophoreGroup, setActivePharmacophoreGroup] = useState<PharmacophorePkPdGroup | null>(null);
  const [selectedPocketResidue, setSelectedPocketResidue] = useState<KeyPocketResidueContact | null>(null);

  // ChEMBL SAR State
  const [chemblRecords, setChemblRecords] = useState<ChemblBioactivityRecord[]>([]);
  const [isChemblLoading, setIsChemblLoading] = useState(false);
  const [activeActivityFilter, setActiveActivityFilter] = useState<string>('ALL');

  // Find target metadata for currently active PDB ID
  const currentTarget = useMemo(() => {
    return CANONICAL_MEDCHEM_TARGETS.find(
      (t) => t.pdbId.toUpperCase() === activePdbId.toUpperCase()
    );
  }, [activePdbId]);

  // Look up canonical medchem profile
  const medChemProfile = useMemo(
    () => findMedChemProfile(currentTarget?.geneSymbol || activePdbId) || null,
    [currentTarget, activePdbId]
  );

  // When target / drug / PDB changes, update activePharmacophoreGroup & clear selectedPocketResidue
  useEffect(() => {
    setActivePharmacophoreGroup(medChemProfile?.pharmacophoreGroups?.[0] || null);
    setSelectedPocketResidue(null);
  }, [medChemProfile, activePdbId, activeDrugName]);

  // Handle external prop changes
  useEffect(() => {
    if (initialPdbId) {
      setActivePdbId(initialPdbId.toUpperCase());
    }
    if (initialDrugName) {
      setActiveDrugName(initialDrugName);
      if (!initialPdbId) {
        const canonical = findCanonicalTargetForDrug(initialDrugName);
        if (canonical) {
          setActivePdbId(canonical.pdbId.toUpperCase());
        }
      }
    }
  }, [initialDrugName, initialPdbId]);

  // Handle Escape key to exit full-screen mode or close open drawers
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLeftDrawerOpen) {
          setIsLeftDrawerOpen(false);
        } else if (activeRightDrawer !== 'none') {
          setActiveRightDrawer('none');
        } else {
          setIsFullscreen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, isLeftDrawerOpen, activeRightDrawer]);

  // Fetch ChEMBL SAR whenever active drug changes
  useEffect(() => {
    if (!activeDrugName) {
      setChemblRecords([]);
      return;
    }

    const controller = new AbortController();
    setIsChemblLoading(true);

    fetchChemblBioactivity(activeDrugName, controller.signal)
      .then((records) => {
        if (!controller.signal.aborted) {
          setChemblRecords(records);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          console.warn('[ThreeDLabLibrary] Failed to fetch ChEMBL SAR:', err);
          setChemblRecords([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsChemblLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [activeDrugName]);

  // Combine structures from current module with canonical target example drugs
  const availableDrugsList = useMemo(() => {
    const set = new Set<string>();
    structures.forEach((s) => {
      if (s.name && s.name.trim()) set.add(s.name.trim());
    });
    CANONICAL_MEDCHEM_TARGETS.forEach((t) => {
      t.exampleDrugs.forEach((d) => set.add(d.trim()));
    });
    return Array.from(set).sort();
  }, [structures]);

  // Grouped canonical targets matching search filter
  const groupedTargets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = CANONICAL_MEDCHEM_TARGETS.filter((t) => {
      if (!q) return true;
      return (
        t.targetName.toLowerCase().includes(q) ||
        t.geneSymbol.toLowerCase().includes(q) ||
        t.pdbId.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.exampleDrugs.some((d) => d.toLowerCase().includes(q))
      );
    });

    const groups: Record<string, TargetPdbMapping[]> = {};
    filtered.forEach((t) => {
      const cat = getTargetCategory(t);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(t);
    });
    return groups;
  }, [searchQuery]);

  // Handle custom PDB submit
  const handleLoadCustomPdb = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = customPdbInput.trim().toUpperCase();
    if (!cleaned || cleaned.length !== 4 || !/^[A-Z0-9]{4}$/.test(cleaned)) {
      setCustomPdbError('Please enter a valid 4-character PDB ID (e.g. 4NTJ)');
      return;
    }
    setCustomPdbError(null);
    setActivePdbId(cleaned);

    const match = CANONICAL_MEDCHEM_TARGETS.find((t) => t.pdbId.toUpperCase() === cleaned);
    if (match && match.exampleDrugs.length > 0) {
      setActiveDrugName(match.exampleDrugs[0]);
    }
  };

  // Handle Target selection
  const handleSelectTarget = (target: TargetPdbMapping) => {
    setActivePdbId(target.pdbId.toUpperCase());
    if (target.exampleDrugs.length > 0) {
      const currentInTarget = target.exampleDrugs.some(
        (d) => d.toLowerCase() === activeDrugName.toLowerCase()
      );
      if (!currentInTarget) {
        setActiveDrugName(target.exampleDrugs[0]);
      }
    }
  };

  // Handle drug selection
  const handleSelectDrug = (drugName: string) => {
    setActiveDrugName(drugName);
    const canonical = findCanonicalTargetForDrug(drugName);
    if (canonical) {
      setActivePdbId(canonical.pdbId.toUpperCase());
    }
  };

  // Filtered ChEMBL activities
  const filteredActivities = useMemo(() => {
    if (activeActivityFilter === 'ALL') return chemblRecords;
    return chemblRecords.filter(
      (r) => r.standardType?.toUpperCase() === activeActivityFilter
    );
  }, [chemblRecords, activeActivityFilter]);

  const primaryMechanism = useMemo(() => {
    const record = chemblRecords.find((r) => Boolean(r.mechanismOfAction));
    return record?.mechanismOfAction;
  }, [chemblRecords]);

  // Compute center canvas grid span in regular mode
  const centerColSpanClass = useMemo(() => {
    if (isLeftCollapsed && isRightCollapsed) return 'lg:col-span-12';
    if (isLeftCollapsed || isRightCollapsed) return 'lg:col-span-9';
    return 'lg:col-span-6';
  }, [isLeftCollapsed, isRightCollapsed]);

  // --------------------------------------------------------------------------
  // Sub-renderers for Reusable Panels (Sidebars & Drawers)
  // --------------------------------------------------------------------------

  const renderTargetSelectorContent = () => (
    <div className="flex flex-col h-full min-h-0">
      {/* Drug Selector Autocomplete / Dropdown */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2 shrink-0">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Atom className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Select Molecule / Drug:</span>
        </label>
        <select
          value={activeDrugName}
          onChange={(e) => handleSelectDrug(e.target.value)}
          className="w-full text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-cyan-500 cursor-pointer"
        >
          {availableDrugsList.map((drug) => (
            <option key={drug} value={drug}>
              {drug}
            </option>
          ))}
        </select>
      </div>

      {/* Search Targets & Custom PDB Input */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2 shrink-0 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search target, gene, or drug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Custom PDB ID loader */}
        <form onSubmit={handleLoadCustomPdb} className="space-y-1">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              maxLength={4}
              placeholder="Custom PDB (e.g. 4NTJ)"
              value={customPdbInput}
              onChange={(e) => {
                setCustomPdbInput(e.target.value);
                if (customPdbError) setCustomPdbError(null);
              }}
              className="flex-1 px-2.5 py-1 text-xs font-mono uppercase rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
            />
            <button
              type="submit"
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white transition-colors cursor-pointer shrink-0"
            >
              Load
            </button>
          </div>
          {customPdbError && (
            <p className="text-[11px] text-rose-500 font-medium">{customPdbError}</p>
          )}
        </form>
      </div>

      {/* Canonical Targets Grouped Accordion / List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <span>Curricular Targets</span>
          <span className="font-mono text-[10px]">
            {Object.values(groupedTargets).reduce((acc, g) => acc + g.length, 0)} PDBs
          </span>
        </div>

        {Object.keys(groupedTargets).length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400">
            No matching targets found for &quot;{searchQuery}&quot;
          </div>
        ) : (
          Object.entries(groupedTargets).map(([category, targets]) => (
            <div key={category} className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Layers className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                <span>{category}</span>
              </div>

              <div className="space-y-1">
                {targets.map((t) => {
                  const isSelected = t.pdbId.toUpperCase() === activePdbId.toUpperCase();
                  return (
                    <button
                      key={t.pdbId}
                      type="button"
                      onClick={() => handleSelectTarget(t)}
                      className={`w-full text-left p-2 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-700 shadow-2xs'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {t.targetName}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                          {t.pdbId}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        <span className="font-mono">{t.geneSymbol}</span>
                        <span className="truncate max-w-[120px] italic">
                          {t.exampleDrugs.join(', ')}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderChemblSarContent = () => (
    <div className="flex flex-col h-full min-h-0">
      {/* ChEMBL Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100">
            <Database className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>ChEMBL Bioactivity & SAR</span>
          </div>
          <a
            href={`https://www.ebi.ac.uk/chembl/g/#search_results/${encodeURIComponent(activeDrugName)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            title="Search ChEMBL directly"
          >
            <span>EMBL-EBI</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        {/* Mechanism of Action */}
        {primaryMechanism && (
          <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs">
            <span className="font-semibold text-purple-900 dark:text-purple-300 block text-[11px] mb-0.5">
              Mechanism of Action:
            </span>
            <span className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
              {primaryMechanism}
            </span>
          </div>
        )}

        {/* Standard Type Filter Tabs */}
        <div className="flex items-center gap-1 pt-1 overflow-x-auto text-[10px] font-mono">
          {['ALL', 'KI', 'IC50', 'KD', 'EC50'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveActivityFilter(type)}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeActivityFilter === type
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Activities List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0">
        {isChemblLoading ? (
          <div className="p-8 text-center space-y-2">
            <Loader2 className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Fetching ChEMBL binding data for {activeDrugName}...
            </p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-6 text-center space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No quantitative binding data ({activeActivityFilter}) found in ChEMBL for &quot;
              {activeDrugName}&quot;.
            </p>
            <a
              href={`https://www.ebi.ac.uk/chembl/g/#search_results/${encodeURIComponent(activeDrugName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
            >
              <span>Search ChEMBL Database</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ) : (
          filteredActivities.map((act, idx) => (
            <div
              key={`${act.moleculeChemblId}_${idx}`}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-purple-300 dark:hover:border-purple-700 transition-colors space-y-1.5 shadow-2xs"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[140px]">
                  {act.targetName || act.prefName}
                </span>
                {act.standardType && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {act.standardType}
                  </span>
                )}
              </div>

              {/* Quantitative Value & Units */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">Affinity:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {act.relation ? `${act.relation} ` : ''}
                  {act.standardValue != null ? `${act.standardValue} ${act.standardUnits || 'nM'}` : 'N/A'}
                </span>
              </div>

              {/* pChEMBL value */}
              {act.pchemblValue != null && (
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400">pChEMBL (-log M):</span>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                    {act.pchemblValue.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  // --------------------------------------------------------------------------
  // FULLSCREEN MODE RENDER
  // --------------------------------------------------------------------------
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 w-screen h-screen overflow-hidden flex flex-col">
        {/* Floating Slide-Out Drawer Tab (Left Edge): Targets & Drugs */}
        <button
          type="button"
          onClick={() => setIsLeftDrawerOpen(true)}
          className="fixed left-0 top-20 z-[52] flex items-center gap-1.5 px-3 py-2 rounded-r-xl bg-slate-900/95 hover:bg-slate-850 text-cyan-300 border-y border-r border-cyan-500/50 shadow-2xl backdrop-blur-md transition-all cursor-pointer group hover:translate-x-0.5 text-xs font-semibold"
          title="Open Targets & Drugs Drawer"
          aria-label="Open Targets & Drugs Drawer"
        >
          <Sliders className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform" />
          <span>Targets & Drugs</span>
          <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
        </button>

        {/* Floating Slide-Out Drawer Tab (Right Edge): Pharmacophore PK */}
        <button
          type="button"
          onClick={() =>
            setActiveRightDrawer((prev) => (prev === 'pharmacophore' ? 'none' : 'pharmacophore'))
          }
          className="fixed right-0 top-20 z-[52] flex items-center gap-1.5 px-3 py-2 rounded-l-xl bg-slate-900/95 hover:bg-slate-850 text-indigo-300 border-y border-l border-indigo-500/50 shadow-2xl backdrop-blur-md transition-all cursor-pointer group hover:-translate-x-0.5 text-xs font-semibold"
          title="Open Pharmacophore PK Drawer"
          aria-label="Open Pharmacophore PK Drawer"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-indigo-400" />
          <span>Pharmacophore PK</span>
          <Pill className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
        </button>

        {/* Floating Slide-Out Drawer Tab (Right Edge): ChEMBL SAR */}
        <button
          type="button"
          onClick={() =>
            setActiveRightDrawer((prev) => (prev === 'chembl' ? 'none' : 'chembl'))
          }
          className="fixed right-0 top-32 z-[52] flex items-center gap-1.5 px-3 py-2 rounded-l-xl bg-slate-900/95 hover:bg-slate-850 text-purple-300 border-y border-l border-purple-500/50 shadow-2xl backdrop-blur-md transition-all cursor-pointer group hover:-translate-x-0.5 text-xs font-semibold"
          title="Open ChEMBL SAR Drawer"
          aria-label="Open ChEMBL SAR Drawer"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-purple-400" />
          <span>ChEMBL SAR</span>
          <Activity className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
        </button>

        {/* Backdrop for open drawers */}
        {(isLeftDrawerOpen || activeRightDrawer === 'chembl') && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[55] transition-opacity animate-fadeIn"
            onClick={() => {
              setIsLeftDrawerOpen(false);
              setActiveRightDrawer('none');
            }}
          />
        )}

        {/* Left Drawer Panel: Targets & Drugs */}
        <aside
          className={`fixed inset-y-0 left-0 w-80 sm:w-96 max-w-[85vw] bg-white dark:bg-slate-900 z-[60] shadow-2xl flex flex-col border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out ${
            isLeftDrawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-3 bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-500" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Targets & Drugs
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsLeftDrawerOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              title="Close Drawer"
              aria-label="Close Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {renderTargetSelectorContent()}
          </div>
        </aside>

        {/* Right Drawer Panel: ChEMBL SAR */}
        <aside
          className={`fixed inset-y-0 right-0 w-80 sm:w-96 max-w-[85vw] bg-white dark:bg-slate-900 z-[60] shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out ${
            activeRightDrawer === 'chembl' ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-3 bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                ChEMBL SAR Profile
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveRightDrawer('none')}
              className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              title="Close Drawer"
              aria-label="Close Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            {renderChemblSarContent()}
          </div>
        </aside>

        {/* 100% Center 3D Mol Canvas */}
        <div className="flex-1 w-full h-full relative overflow-hidden">
          <ThreeDLabCanvas
            pdbId={activePdbId}
            preferredLigandCode={currentTarget?.preferredLigandCode || currentTarget?.ligandCode}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(false)}
            onOpenTutorial={() => setIsTutorialOpen(true)}
            targetName={currentTarget?.targetName}
            geneSymbol={currentTarget?.geneSymbol}
            activePharmacophoreGroup={activePharmacophoreGroup}
            onSelectPharmacophoreGroup={setActivePharmacophoreGroup}
            onSelectPocketResidue={setSelectedPocketResidue}
            isPkDrawerOpen={activeRightDrawer === 'pharmacophore'}
            onTogglePkDrawer={() =>
              setActiveRightDrawer((prev) => (prev === 'pharmacophore' ? 'none' : 'pharmacophore'))
            }
          />
        </div>

        {/* Pharmacophore PK & PD Drawer */}
        <PharmacophorePkDrawer
          isOpen={activeRightDrawer === 'pharmacophore'}
          onClose={() => setActiveRightDrawer('none')}
          activeGroup={activePharmacophoreGroup}
          profile={medChemProfile}
          selectedPocketResidue={selectedPocketResidue}
          onSelectGroup={setActivePharmacophoreGroup}
          onSelectPocketResidue={setSelectedPocketResidue}
        />

        {/* Educational Tutorial Modal */}
        <ThreeDLabTutorialModal
          isOpen={isTutorialOpen}
          onClose={() => setIsTutorialOpen(false)}
        />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // REGULAR MODE RENDER
  // --------------------------------------------------------------------------
  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] min-h-[580px] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* ==================================================== */}
      {/* 1. TOP HEADER & NAVIGATION BAR                       */}
      {/* ==================================================== */}
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
                  3D Molecular Lab & SAR Studio
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                  Mol* / RCSB & ChEMBL
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Interactive Mol* target-ligand complexes & ChEMBL quantitative bioactivity profiles
              </p>
            </div>
          </div>
        </div>

        {/* Active badges */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
            <Atom className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Drug:</span>
            <span className="font-bold">{activeDrugName}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Target:</span>
            <span className="font-bold">
              {currentTarget ? `${currentTarget.geneSymbol} (${activePdbId})` : activePdbId}
            </span>
          </div>
        </div>
      </header>

      {/* ==================================================== */}
      {/* 2. THREE-PANEL WORKSPACE WITH COLLAPSIBLE SIDEBARS   */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden min-h-0 relative">
        {/* ==================================================== */}
        {/* LEFT PANEL: Target & Molecule Selector (3 cols)     */}
        {/* ==================================================== */}
        {!isLeftCollapsed ? (
          <div className="lg:col-span-3 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col min-h-0 overflow-hidden">
            {/* Header with collapse button */}
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Targets & Drugs</span>
              </span>
              <button
                type="button"
                onClick={() => setIsLeftCollapsed(true)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                title="Collapse Targets Panel"
                aria-label="Collapse Targets Panel"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            {renderTargetSelectorContent()}
          </div>
        ) : null}

        {/* Center Panel (3Dmol Canvas): 6, 9, or 12 cols */}
        <div className={`${centerColSpanClass} flex flex-col min-h-[580px] h-[calc(100vh-14rem)] bg-slate-900 text-white relative overflow-hidden`}>
          {/* Floating Expand Left Sidebar Button when collapsed */}
          {isLeftCollapsed && (
            <button
              type="button"
              onClick={() => setIsLeftCollapsed(false)}
              className="absolute left-2 top-2 z-30 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-700/60 shadow-lg text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer"
              title="Expand Targets & Drugs panel"
              aria-label="Expand Targets & Drugs panel"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              <span>Targets & Drugs</span>
            </button>
          )}

          {/* Floating Expand Right Sidebar Button when collapsed */}
          {isRightCollapsed && (
            <button
              type="button"
              onClick={() => {
                setIsRightCollapsed(false);
                setActiveRightDrawer('chembl');
              }}
              className="absolute right-2 top-2 z-30 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-850 text-purple-300 border border-purple-700/60 shadow-lg text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer"
              title="Expand ChEMBL SAR panel"
              aria-label="Expand ChEMBL SAR panel"
            >
              <span>ChEMBL SAR</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          <ThreeDLabCanvas
            pdbId={activePdbId}
            preferredLigandCode={currentTarget?.preferredLigandCode || currentTarget?.ligandCode}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(true)}
            onOpenTutorial={() => setIsTutorialOpen(true)}
            targetName={currentTarget?.targetName}
            geneSymbol={currentTarget?.geneSymbol}
            activePharmacophoreGroup={activePharmacophoreGroup}
            onSelectPharmacophoreGroup={setActivePharmacophoreGroup}
            onSelectPocketResidue={setSelectedPocketResidue}
            isPkDrawerOpen={activeRightDrawer === 'pharmacophore'}
            onTogglePkDrawer={() => {
              setActiveRightDrawer((prev) => {
                const next = prev === 'pharmacophore' ? 'none' : 'pharmacophore';
                if (next === 'pharmacophore') {
                  setIsRightCollapsed(true);
                }
                return next;
              });
            }}
          />
        </div>

        {/* ==================================================== */}
        {/* RIGHT PANEL: ChEMBL Quantitative SAR Panel (3 cols)  */}
        {/* ==================================================== */}
        {!isRightCollapsed ? (
          <div className="lg:col-span-3 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col min-h-0 overflow-hidden">
            {/* Header with collapse button */}
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>ChEMBL SAR</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsRightCollapsed(true);
                  if (activeRightDrawer === 'chembl') {
                    setActiveRightDrawer('none');
                  }
                }}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                title="Collapse ChEMBL SAR Panel"
                aria-label="Collapse ChEMBL SAR Panel"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            {renderChemblSarContent()}
          </div>
        ) : null}
      </div>

      {/* Pharmacophore PK & PD Drawer */}
      <PharmacophorePkDrawer
        isOpen={activeRightDrawer === 'pharmacophore'}
        onClose={() => setActiveRightDrawer('none')}
        activeGroup={activePharmacophoreGroup}
        profile={medChemProfile}
        selectedPocketResidue={selectedPocketResidue}
        onSelectGroup={setActivePharmacophoreGroup}
        onSelectPocketResidue={setSelectedPocketResidue}
      />

      {/* Educational Tutorial Modal */}
      <ThreeDLabTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  );
};
