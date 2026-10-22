import React, { useState, useMemo } from 'react';
import { ChemicalStructure, PharmacophoreGroup } from '../types/reviewModule';
import { InteractiveStructureViewer } from './InteractiveStructureViewer';
import { PharmacophoreTagList } from './PharmacophoreTagList';

const StructureLightboxModal = React.lazy(() =>
  import('./StructureLightboxModal').then((m) => ({ default: m.StructureLightboxModal }))
);
import {
  ColorPaletteItem,
  PHARMACOPHORE_COLOR_PALETTE,
  getPharmacophoresForStructure,
} from '../utils/pharmacophoreData';
import { resolveActivePharmacophoresForStructure } from '../utils/globalPharmacophores';
import {
  sortStructuresByDocumentLabel,
  getStructureDocumentLabel,
} from '../utils/documentLabel';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Columns,
  Maximize2,
  ChevronDown,
  ChevronUp,
  X,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Info,
  Check,
  Eye,
  EyeOff,
  ArrowRightLeft,
  Layers,
} from 'lucide-react';

interface StructureFocusStageProps {
  structures: ChemicalStructure[];
  comparisonPool?: ChemicalStructure[];
  hideDrugName?: boolean;
  examModeActive?: boolean;
  onInspectStructure?: (structure: ChemicalStructure) => void;
  globalActivePharmacophores?: Record<string, ColorPaletteItem>;
  globalHoveredPharmacophoreId?: string | null;
  focusMatchingOnly?: boolean;
}

const StructureFocusStageComponent: React.FC<StructureFocusStageProps> = ({
  structures,
  comparisonPool = [],
  hideDrugName = false,
  examModeActive = false,
  onInspectStructure,
  globalActivePharmacophores = {},
  globalHoveredPharmacophoreId = null,
  focusMatchingOnly = false,
}) => {
  if (!structures || structures.length === 0) return null;

  const sortedStructures = useMemo(() => sortStructuresByDocumentLabel(structures), [structures]);
  const pool = useMemo(() => {
    const raw = comparisonPool.length > 0 ? comparisonPool : structures;
    return sortStructuresByDocumentLabel(raw);
  }, [comparisonPool, structures]);

  // Active focused drug index
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [isStageActive, setIsStageActive] = useState<boolean>(true);

  // Side-by-Side Comparison Split state
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [secondaryIndex, setSecondaryIndex] = useState<number>(() => {
    return pool.length > 1 ? (focusedIndex === 0 ? 1 : 0) : 0;
  });

  // Fullscreen Lightbox Modal state
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxInitialCompare, setLightboxInitialCompare] = useState<boolean>(false);

  // Zoom levels
  const [zoomLevelA, setZoomLevelA] = useState<number>(100);
  const [zoomLevelB, setZoomLevelB] = useState<number>(100);

  // Pharmacophore multi-color pinning state for Drug A
  const [activePharmaA, setActivePharmaA] = useState<Record<string, ColorPaletteItem>>({});
  const [hoveredPharmaA, setHoveredPharmaA] = useState<string | null>(null);

  // Pharmacophore multi-color pinning state for Drug B
  const [activePharmaB, setActivePharmaB] = useState<Record<string, ColorPaletteItem>>({});
  const [hoveredPharmaB, setHoveredPharmaB] = useState<string | null>(null);

  // Name peek state for exam / blind mode
  const [peekedNames, setPeekedNames] = useState<Record<string, boolean>>({});

  const primaryStructure = pool[Math.min(focusedIndex, pool.length - 1)] || structures[0];
  const secondaryStructure = pool[Math.min(secondaryIndex, pool.length - 1)] || pool[0];

  const primaryPharmacophores = useMemo(
    () => getPharmacophoresForStructure(primaryStructure),
    [primaryStructure]
  );
  const secondaryPharmacophores = useMemo(
    () => getPharmacophoresForStructure(secondaryStructure),
    [secondaryStructure]
  );

  // Resolve global + local pharmacophores for primary
  const {
    mergedActive: mergedActiveA,
    mergedHovered: mergedHoveredA,
    matchedGlobalPharmacophores: matchedGlobalA,
  } = resolveActivePharmacophoresForStructure(
    primaryStructure,
    activePharmaA,
    hoveredPharmaA,
    globalActivePharmacophores,
    globalHoveredPharmacophoreId
  );

  // Resolve global + local pharmacophores for secondary
  const {
    mergedActive: mergedActiveB,
    mergedHovered: mergedHoveredB,
    matchedGlobalPharmacophores: matchedGlobalB,
  } = resolveActivePharmacophoresForStructure(
    secondaryStructure,
    activePharmaB,
    hoveredPharmaB,
    globalActivePharmacophores,
    globalHoveredPharmacophoreId
  );

  // Track the last tapped pharmacophore group for tablet/touch devices without hover
  const [lastTappedGroup, setLastTappedGroup] = useState<PharmacophoreGroup | null>(() => primaryPharmacophores[0] || null);

  // Identify currently active/pinned or hovered pharmacophore for dedicated Live HUD (supports tablets/touch screens without hover)
  const activeHoveredGroup = useMemo(() => {
    // 1. Prioritize hovered pharmacophore if currently hovering
    if (mergedHoveredA) {
      const h = primaryPharmacophores.find((p) => p.id === mergedHoveredA);
      if (h) return h;
    }
    // 2. Prioritize most recently selected/pinned group on Drug A (tablet touch-friendly)
    const activeIds = Object.keys(mergedActiveA);
    if (activeIds.length > 0) {
      const lastId = activeIds[activeIds.length - 1];
      const p = primaryPharmacophores.find((item) => item.id === lastId);
      if (p) return p;
    }
    // 3. Fall back to last tapped group on tablet/touch screens
    if (lastTappedGroup) {
      const p = primaryPharmacophores.find((item) => item.id === lastTappedGroup.id);
      if (p) return p;
    }
    return primaryPharmacophores[0] || null;
  }, [mergedHoveredA, primaryPharmacophores, mergedActiveA, lastTappedGroup]);

  const togglePeekName = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (examModeActive) return;
    setPeekedNames((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isNameHidden = (str: ChemicalStructure) => {
    return (hideDrugName || examModeActive) && !peekedNames[str.id];
  };

  const getDisplayName = (str: ChemicalStructure) => {
    const docLabel = getStructureDocumentLabel(str);
    if (isNameHidden(str)) {
      return `Structure ${docLabel}`;
    }
    return str.name;
  };

  // Toggle pharmacophore pin on Drug A
  const handleTogglePharmaA = (group: PharmacophoreGroup) => {
    setLastTappedGroup(group);
    setActivePharmaA((prev) => {
      const copy = { ...prev };
      if (copy[group.id]) {
        delete copy[group.id];
        return copy;
      }
      const usedHexes = new Set(Object.values(copy).map((c) => c.hex));
      const nextColor =
        PHARMACOPHORE_COLOR_PALETTE.find((c) => !usedHexes.has(c.hex)) ||
        PHARMACOPHORE_COLOR_PALETTE[Object.keys(copy).length % PHARMACOPHORE_COLOR_PALETTE.length];
      copy[group.id] = nextColor;
      return copy;
    });
  };

  // Toggle pharmacophore pin on Drug B
  const handleTogglePharmaB = (group: PharmacophoreGroup) => {
    setLastTappedGroup(group);
    setActivePharmaB((prev) => {
      const copy = { ...prev };
      if (copy[group.id]) {
        delete copy[group.id];
        return copy;
      }
      const usedHexes = new Set(Object.values(copy).map((c) => c.hex));
      const nextColor =
        PHARMACOPHORE_COLOR_PALETTE.find((c) => !usedHexes.has(c.hex)) ||
        PHARMACOPHORE_COLOR_PALETTE[Object.keys(copy).length % PHARMACOPHORE_COLOR_PALETTE.length];
      copy[group.id] = nextColor;
      return copy;
    });
  };

  // Switch focused drug
  const handleSelectFocusedDrug = (idx: number) => {
    setFocusedIndex(idx);
    setIsStageActive(true);
    setActivePharmaA({});
    setHoveredPharmaA(null);
    setLastTappedGroup(null);
    setZoomLevelA(100);
  };

  // Open comparison with specific drug
  const handleCompareWithDrug = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSecondaryIndex(idx);
    setIsCompareMode(true);
    setIsStageActive(true);
  };

  return (
    <div className="space-y-4">
      {/* ------------------------------------------------------------------ */}
      {/* 1. MASTER HORIZONTAL FOCUS STAGE                                   */}
      {/* ------------------------------------------------------------------ */}
      {isStageActive && (
        <div className="bg-white dark:bg-slate-900 border-2 border-blue-500/30 dark:border-blue-400/30 rounded-2xl shadow-md overflow-hidden transition-all duration-200">
          {/* Top Stage Bar: Roman ID, Drug Title, Actions & Close */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-serif font-black text-xs tracking-wider shadow-xs">
                {getStructureDocumentLabel(primaryStructure)}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                    {getDisplayName(primaryStructure)}
                  </h2>
                  {primaryStructure.tradeName && !isNameHidden(primaryStructure) && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 italic hidden sm:inline">
                      ({primaryStructure.tradeName})
                    </span>
                  )}
                  {hideDrugName && !examModeActive && (
                    <button
                      type="button"
                      onClick={(e) => togglePeekName(primaryStructure.id, e)}
                      title={isNameHidden(primaryStructure) ? 'Reveal Name' : 'Hide Name'}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                    >
                      {isNameHidden(primaryStructure) ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </button>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span>{primaryStructure.chemicalClass}</span>
                  <span>·</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {primaryStructure.target}
                  </span>
                </div>
              </div>
            </div>

            {/* Stage Action Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Compare Split Button */}
              {pool.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIsCompareMode(!isCompareMode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
                    isCompareMode
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                  title={isCompareMode ? 'Return to single structure focus' : 'Split stage to compare with another drug'}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>{isCompareMode ? 'Single View' : 'Compare Side-by-Side'}</span>
                </button>
              )}

              {/* Fullscreen Lightbox Button */}
              <button
                type="button"
                onClick={() => {
                  setLightboxInitialCompare(isCompareMode);
                  setIsLightboxOpen(true);
                }}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer"
                title="Open in expanded fullscreen studio"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              {/* Collapse Stage */}
              <button
                type="button"
                onClick={() => setIsStageActive(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Collapse focused stage to compact grid"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* STAGE BODY (SINGLE FOCUS vs SIDE-BY-SIDE COMPARE)               */}
          {/* ---------------------------------------------------------------- */}
          {!isCompareMode ? (
            /* ============================================================== */
            /* A. SINGLE DRUG FOCUS STAGE (Spacious Horizontal Layout)        */
            /* ============================================================== */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
              {/* LEFT HALF (Col 1-5 or 6): Clean, Unobstructed Structure Canvas */}
              <div className="lg:col-span-5 p-6 flex flex-col items-center justify-between bg-white dark:bg-slate-900 min-h-[360px] relative">
                {/* Active Global Explorer Indicator Banner */}
                {matchedGlobalA.length > 0 && (
                  <div className="w-full mb-3 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between text-xs animate-fadeIn">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span className="font-bold text-blue-900 dark:text-blue-200 text-[11px] uppercase tracking-wide">
                        Explorer Feature:
                      </span>
                      {matchedGlobalA.map(({ gp, color }) => (
                        <span
                          key={gp.id}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow-2xs"
                          style={{ backgroundColor: color.pinBg }}
                        >
                          {gp.chemicalFormulaOrSymbol}
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                      Bonds Colored
                    </span>
                  </div>
                )}

                {/* Structure Drawing Canvas (Zero Popups Over Image) */}
                <div className="w-full flex-1 flex items-center justify-center p-2 relative">
                  <InteractiveStructureViewer
                    structure={primaryStructure}
                    activePharmacophoreIds={mergedActiveA}
                    hoveredPharmacophoreId={mergedHoveredA}
                    onTogglePharmacophore={handleTogglePharmaA}
                    onHoverPharmacophore={setHoveredPharmaA}
                    zoomLevel={zoomLevelA}
                    maxHeightClass="max-h-72 sm:max-h-80"
                    altText={getDisplayName(primaryStructure)}
                    isExpanded={true}
                  />
                </div>

                {/* Bottom Canvas Controls: Zoom & PubChem Audit */}
                <div className="w-full pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => setZoomLevelA((z) => Math.max(100, z - 25))}
                      disabled={zoomLevelA <= 100}
                      className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-1.5 font-mono text-[11px] font-semibold">
                      {zoomLevelA}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoomLevelA((z) => Math.min(200, z + 25))}
                      disabled={zoomLevelA >= 200}
                      className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    {zoomLevelA > 100 && (
                      <button
                        type="button"
                        onClick={() => setZoomLevelA(100)}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 ml-0.5 cursor-pointer"
                        title="Reset Zoom"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* NIH PubChem Audit */}
                  {primaryStructure.pubchemAudit && (
                    <a
                      href={primaryStructure.pubchemAudit.pubChemUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>CID {primaryStructure.pubchemAudit.cid}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* RIGHT HALF (Col 6-12): Details, Pharmacophores & Live Hover HUD */}
              <div className="lg:col-span-7 p-6 space-y-3.5 bg-slate-50/50 dark:bg-slate-900/60">
                {/* 1. Key Pharmacophore Tags (Placed at top so hovering never shifts tag positions) */}
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      Key Pharmacophores &amp; Functional Groups
                    </span>
                    {Object.keys(activePharmaA).length > 0 && (
                      <button
                        type="button"
                        onClick={() => setActivePharmaA({})}
                        className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        Clear Highlights ({Object.keys(activePharmaA).length})
                      </button>
                    )}
                  </div>

                  <PharmacophoreTagList
                    structure={primaryStructure}
                    activePharmacophoreIds={mergedActiveA}
                    hoveredPharmacophoreId={mergedHoveredA}
                    onTogglePharmacophore={handleTogglePharmaA}
                    onHoverPharmacophore={setHoveredPharmaA}
                    onClearAllHighlights={() => setActivePharmaA({})}
                  />
                </div>

                {/* 2. Live Hover Descriptor HUD (Zero Popups on Structure; Fixed 96px height eliminates all layout shift & hover loops) */}
                <div
                  className={`p-3 rounded-xl border h-[96px] overflow-hidden flex flex-col justify-center transition-colors duration-100 ${
                    activeHoveredGroup
                      ? 'bg-blue-50/90 dark:bg-blue-950/80 border-blue-300 dark:border-blue-700/80 shadow-2xs'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80'
                  }`}
                >
                  {activeHoveredGroup ? (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                          <span className="text-xs font-bold text-blue-950 dark:text-blue-100 truncate">
                            {activeHoveredGroup.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[9px] font-mono uppercase font-bold text-blue-700 dark:text-blue-300 shrink-0 px-1.5 py-0.2 rounded bg-blue-100/70 dark:bg-blue-900/50">
                            {activeHoveredGroup.category ? activeHoveredGroup.category.toUpperCase() : 'PHARMACOPHORE'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-800 dark:text-slate-200 leading-snug font-sans line-clamp-2">
                        {activeHoveredGroup.description || activeHoveredGroup.purpose}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 py-1">
                      <Info className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-[11px] leading-tight">
                        Tap or hover any functional group tag or bond line to inspect its specific medicinal chemistry purpose.
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. SAR Notes & Mechanism Attributes */}
                {!examModeActive && (
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-700">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Target Receptor
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {primaryStructure.target || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Reversibility
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {primaryStructure.reversibility || 'Reversible'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Administration
                        </span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {primaryStructure.route || 'Oral'}
                        </span>
                      </div>
                    </div>

                    {/* MOA Prose */}
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        MECHANISM OF ACTION (MOA)
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
                        {primaryStructure.moa_summary || primaryStructure.sar_rationale || primaryStructure.sarNotes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* B. SIDE-BY-SIDE IN-STAGE COMPARISON SPLIT                      */
            /* ============================================================== */
            <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/60 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* COMPOUND A */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  {/* Selector Bar A */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-xs font-serif font-black bg-blue-600 text-white">
                        {getStructureDocumentLabel(primaryStructure)}
                      </span>
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                        {getDisplayName(primaryStructure)}
                      </span>
                    </div>

                    <select
                      id="primary-structure-select"
                      name="primaryStructure"
                      value={focusedIndex}
                      onChange={(e) => handleSelectFocusedDrug(Number(e.target.value))}
                      className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    >
                      {pool.map((str, i) => (
                        <option key={`a_${str.id}_${i}`} value={i}>
                          [{getStructureDocumentLabel(str)}] {str.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Structure Canvas A */}
                  <div className="min-h-[220px] flex items-center justify-center p-2 bg-white dark:bg-slate-900 rounded-lg">
                    <InteractiveStructureViewer
                      structure={primaryStructure}
                      activePharmacophoreIds={mergedActiveA}
                      hoveredPharmacophoreId={mergedHoveredA}
                      onTogglePharmacophore={handleTogglePharmaA}
                      onHoverPharmacophore={setHoveredPharmaA}
                      zoomLevel={zoomLevelA}
                      maxHeightClass="max-h-52"
                      altText={getDisplayName(primaryStructure)}
                      isExpanded={true}
                    />
                  </div>

                  {/* Tags A */}
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                    <PharmacophoreTagList
                      structure={primaryStructure}
                      activePharmacophoreIds={mergedActiveA}
                      hoveredPharmacophoreId={mergedHoveredA}
                      onTogglePharmacophore={handleTogglePharmaA}
                      onHoverPharmacophore={setHoveredPharmaA}
                      onClearAllHighlights={() => setActivePharmaA({})}
                      compact={true}
                    />
                  </div>

                  {/* Key Stats A */}
                  {!examModeActive && (
                    <div className="text-[11px] space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <strong className="text-slate-500">Target:</strong> {primaryStructure.target} ({primaryStructure.reversibility})
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {primaryStructure.moa_summary || primaryStructure.sar_rationale || primaryStructure.sarNotes}
                      </p>
                    </div>
                  )}
                </div>

                {/* COMPOUND B */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  {/* Selector Bar B */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-xs font-serif font-black bg-indigo-600 text-white">
                        {getStructureDocumentLabel(secondaryStructure)}
                      </span>
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                        {getDisplayName(secondaryStructure)}
                      </span>
                    </div>

                    <select
                      id="secondary-structure-select"
                      name="secondaryStructure"
                      value={secondaryIndex}
                      onChange={(e) => setSecondaryIndex(Number(e.target.value))}
                      className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    >
                      {pool.map((str, i) => (
                        <option key={`b_${str.id}_${i}`} value={i}>
                          [{getStructureDocumentLabel(str)}] {str.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Structure Canvas B */}
                  <div className="min-h-[220px] flex items-center justify-center p-2 bg-white dark:bg-slate-900 rounded-lg">
                    <InteractiveStructureViewer
                      structure={secondaryStructure}
                      activePharmacophoreIds={mergedActiveB}
                      hoveredPharmacophoreId={mergedHoveredB}
                      onTogglePharmacophore={handleTogglePharmaB}
                      onHoverPharmacophore={setHoveredPharmaB}
                      zoomLevel={zoomLevelB}
                      maxHeightClass="max-h-52"
                      altText={getDisplayName(secondaryStructure)}
                      isExpanded={true}
                    />
                  </div>

                  {/* Tags B */}
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                    <PharmacophoreTagList
                      structure={secondaryStructure}
                      activePharmacophoreIds={mergedActiveB}
                      hoveredPharmacophoreId={mergedHoveredB}
                      onTogglePharmacophore={handleTogglePharmaB}
                      onHoverPharmacophore={setHoveredPharmaB}
                      onClearAllHighlights={() => setActivePharmaB({})}
                      compact={true}
                    />
                  </div>

                  {/* Key Stats B */}
                  {!examModeActive && (
                    <div className="text-[11px] space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <strong className="text-slate-500">Target:</strong> {secondaryStructure.target} ({secondaryStructure.reversibility})
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {secondaryStructure.moa_summary || secondaryStructure.sar_rationale || secondaryStructure.sarNotes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 2. COMPACT SELECTABLE DRUG GRID (Underneath the Stage)             */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Select Compound to Focus ({sortedStructures.length} in this section)</span>
          </span>
          {!isStageActive && (
            <button
              type="button"
              onClick={() => setIsStageActive(true)}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              Open Focused Stage
            </button>
          )}
        </div>

        <div
          className={`grid gap-3 ${
            sortedStructures.length === 1
              ? 'grid-cols-1 max-w-sm'
              : sortedStructures.length === 2
              ? 'grid-cols-2'
              : sortedStructures.length === 3
              ? 'grid-cols-2 sm:grid-cols-3'
              : 'grid-cols-2 sm:grid-cols-4'
          }`}
        >
          {sortedStructures.map((str, idx) => {
            const isCurrentlyFocused = isStageActive && primaryStructure.id === str.id;
            const isCurrentlySecondary = isStageActive && isCompareMode && secondaryStructure.id === str.id;
            const docLabel = getStructureDocumentLabel(str);

            return (
              <div
                key={str.id + idx}
                onClick={() => handleSelectFocusedDrug(idx)}
                className={`p-3 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between group ${
                  isCurrentlyFocused
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                    : isCurrentlySecondary
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xs'
                }`}
              >
                {/* Header: Exact Document Label, Drug Name, Compare action */}
                <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-serif font-black ${
                        isCurrentlyFocused
                          ? 'bg-blue-600 text-white'
                          : isCurrentlySecondary
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {docLabel}
                    </span>
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                      {getDisplayName(str)}
                    </span>
                  </div>

                  {pool.length > 1 && !isCurrentlyFocused && (
                    <button
                      type="button"
                      onClick={(e) => handleCompareWithDrug(idx, e)}
                      title={`Compare ${str.name} with focused drug`}
                      className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Columns className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Compact Thumbnail Image */}
                <div className="py-2 flex items-center justify-center min-h-[110px]">
                  <img
                    src={str.pngUrl}
                    alt={getDisplayName(str)}
                    width="320"
                    height="320"
                    loading="lazy"
                    className="w-full h-full aspect-square object-contain pointer-events-none"
                  />
                </div>

                {/* Footer Status / Prompt */}
                <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 truncate max-w-[120px]">
                    {str.chemicalClass.split(' ')[0]}
                  </span>
                  {isCurrentlyFocused ? (
                    <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                      <Check className="w-3 h-3" />
                      <span>Focused</span>
                    </span>
                  ) : isCurrentlySecondary ? (
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      Comparing
                    </span>
                  ) : (
                    <span className="text-slate-400 group-hover:text-blue-600 font-medium">
                      Click to focus
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. LIGHTBOX MODAL (For Fullscreen Zoom & Side-by-Side)              */}
      {/* ------------------------------------------------------------------ */}
      {isLightboxOpen && (
        <React.Suspense fallback={null}>
          <StructureLightboxModal
            isOpen={isLightboxOpen}
            onClose={() => setIsLightboxOpen(false)}
            initialStructure={primaryStructure}
            comparisonPool={pool}
            hideDrugName={hideDrugName}
            examModeActive={examModeActive}
            initialCompareMode={lightboxInitialCompare}
          />
        </React.Suspense>
      )}
    </div>
  );
};

export const StructureFocusStage = React.memo<StructureFocusStageProps>(
  StructureFocusStageComponent,
  (prev, next) => {
    return (
      prev.structures === next.structures &&
      prev.comparisonPool === next.comparisonPool &&
      prev.hideDrugName === next.hideDrugName &&
      prev.examModeActive === next.examModeActive &&
      prev.focusMatchingOnly === next.focusMatchingOnly &&
      prev.globalActivePharmacophores === next.globalActivePharmacophores &&
      prev.globalHoveredPharmacophoreId === next.globalHoveredPharmacophoreId
    );
  }
);
