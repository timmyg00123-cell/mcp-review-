import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Box,
  Atom,
  RotateCcw,
  ExternalLink,
  Download,
  Search,
  ArrowLeft,
  Loader2,
  Info,
  Layers,
  ChevronRight,
  Database,
  Sliders,
} from 'lucide-react';
import type { ChemicalStructure } from '../types/reviewModule';
import {
  CANONICAL_MEDCHEM_TARGETS,
  findCanonicalTargetForDrug,
  type TargetPdbMapping,
} from '../utils/canonicalTargets';
import {
  fetchChemblBioactivity,
  type ChemblBioactivityRecord,
} from '../services/chemblService';

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
  const [iframeKey, setIframeKey] = useState<number>(0);

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
    // From module structures
    structures.forEach((s) => {
      if (s.name && s.name.trim()) set.add(s.name.trim());
    });
    // From canonical targets
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
    setIframeKey((prev) => prev + 1);

    // If matches a canonical target, sync drug
    const match = CANONICAL_MEDCHEM_TARGETS.find((t) => t.pdbId.toUpperCase() === cleaned);
    if (match && match.exampleDrugs.length > 0) {
      setActiveDrugName(match.exampleDrugs[0]);
    }
  };

  // Handle Target selection
  const handleSelectTarget = (target: TargetPdbMapping) => {
    setActivePdbId(target.pdbId.toUpperCase());
    if (target.exampleDrugs.length > 0) {
      // Pick first drug or keep current if it belongs to this target
      const currentInTarget = target.exampleDrugs.some(
        (d) => d.toLowerCase() === activeDrugName.toLowerCase()
      );
      if (!currentInTarget) {
        setActiveDrugName(target.exampleDrugs[0]);
      }
    }
    setIframeKey((prev) => prev + 1);
  };

  // Handle drug selection
  const handleSelectDrug = (drugName: string) => {
    setActiveDrugName(drugName);
    const canonical = findCanonicalTargetForDrug(drugName);
    if (canonical) {
      setActivePdbId(canonical.pdbId.toUpperCase());
      setIframeKey((prev) => prev + 1);
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

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
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
      {/* 2. THREE-PANEL WORKSPACE                             */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden min-h-0">
        {/* ==================================================== */}
        {/* LEFT PANEL: Target & Molecule Selector (3 cols)     */}
        {/* ==================================================== */}
        <div className="lg:col-span-3 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col min-h-0 overflow-hidden">
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

        {/* ==================================================== */}
        {/* CENTER PANEL: Mol* 3D Viewer & Controls (6 cols)     */}
        {/* ==================================================== */}
        <div className="lg:col-span-6 flex flex-col min-h-0 bg-slate-900 text-white relative">
          {/* PDB Info & Quick-Actions Bar */}
          <div className="px-3 py-2 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 z-10">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 font-mono font-bold rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/60">
                {activePdbId}
              </span>
              <span className="font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-[280px]">
                {currentTarget?.targetName || 'Co-crystal Complex'}
              </span>
              {currentTarget?.geneSymbol && (
                <span className="text-[10px] font-mono text-slate-400">
                  [{currentTarget.geneSymbol}]
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIframeKey((prev) => prev + 1)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Reload 3D Structure Viewer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <a
                href={`https://www.rcsb.org/structure/${activePdbId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium text-[11px]"
                title="View on RCSB PDB Portal"
              >
                <span>RCSB</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <a
                href={`https://files.rcsb.org/download/${activePdbId}.cif`}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors font-medium text-[11px]"
                title="Download mmCIF Coordinate File"
              >
                <Download className="w-3 h-3" />
                <span>CIF</span>
              </a>
            </div>
          </div>

          {/* Interactive Mol* 3D Web Viewer Iframe */}
          <div className="flex-1 w-full relative bg-slate-950 overflow-hidden">
            <iframe
              key={iframeKey}
              src={`https://www.rcsb.org/3d-view/${encodeURIComponent(activePdbId)}`}
              title={`3D Mol* Structure Viewer for PDB ${activePdbId}`}
              className="w-full h-full border-0 absolute inset-0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>

          {/* Navigation Controls Tip Banner */}
          <div className="px-3 py-1.5 bg-slate-950/95 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
              <Info className="w-3.5 h-3.5" />
              <span>Navigation:</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-300">
              <span>Rotate: Left-drag</span>
              <span>•</span>
              <span>Pan: Right-drag</span>
              <span>•</span>
              <span>Zoom: Scroll</span>
              <span>•</span>
              <span>Focus Ligand: Right-click atom</span>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT PANEL: ChEMBL Quantitative SAR Panel (3 cols)  */}
        {/* ==================================================== */}
        <div className="lg:col-span-3 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col min-h-0 overflow-hidden">
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
      </div>
    </div>
  );
};
