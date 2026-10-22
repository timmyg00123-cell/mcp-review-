import React, { useState, useEffect } from 'react';
import { ChemicalStructure, PharmacophoreGroup } from '../types/reviewModule';
import { InteractiveStructureViewer } from './InteractiveStructureViewer';
import { PharmacophoreTagList } from './PharmacophoreTagList';
import {
  PHARMACOPHORE_COLOR_PALETTE,
  ColorPaletteItem,
  getPharmacophoresForStructure,
} from '../utils/pharmacophoreData';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Columns,
  Rows,
  Maximize2,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FlaskConical,
  Sparkles,
  ArrowRightLeft,
  Lock,
} from 'lucide-react';

interface StructureLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStructure: ChemicalStructure;
  comparisonPool?: ChemicalStructure[];
  initialCompareMode?: boolean;
  initialSecondaryStructure?: ChemicalStructure;
  hideDrugName?: boolean;
  examModeActive?: boolean;
  onInspectPubChem?: (structure: ChemicalStructure) => void;
}

export const StructureLightboxModal: React.FC<StructureLightboxModalProps> = ({
  isOpen,
  onClose,
  initialStructure,
  comparisonPool = [],
  initialCompareMode = false,
  initialSecondaryStructure,
  hideDrugName = false,
  examModeActive = false,
  onInspectPubChem,
}) => {
  // Deduplicate pool while ensuring initialStructure is present
  const pool = React.useMemo(() => {
    const map = new Map<string, ChemicalStructure>();
    const keyOf = (s: ChemicalStructure) => `${s.id}_${s.name}`;
    map.set(keyOf(initialStructure), initialStructure);
    comparisonPool.forEach((s) => {
      if (!map.has(keyOf(s))) {
        map.set(keyOf(s), s);
      }
    });
    return Array.from(map.values());
  }, [initialStructure, comparisonPool]);

  const [primaryIdx, setPrimaryIdx] = useState<number>(0);
  const [secondaryIdx, setSecondaryIdx] = useState<number>(1);
  const [isCompareMode, setIsCompareMode] = useState<boolean>(initialCompareMode);
  // Layout toggle: 'side-by-side' (columns) vs 'stacked' (rows)
  const [layoutMode, setLayoutMode] = useState<'side-by-side' | 'stacked'>('side-by-side');

  // Zoom and pan
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [panA, setPanA] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [panB, setPanB] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [peekNames, setPeekNames] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Multi-color pharmacophore state for primary structure
  const [primaryActivePharma, setPrimaryActivePharma] = useState<
    Record<string, ColorPaletteItem>
  >({});
  const [primaryHoveredPharma, setPrimaryHoveredPharma] = useState<string | null>(null);

  // Multi-color pharmacophore state for secondary structure
  const [secondaryActivePharma, setSecondaryActivePharma] = useState<
    Record<string, ColorPaletteItem>
  >({});
  const [secondaryHoveredPharma, setSecondaryHoveredPharma] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const foundIdx = pool.findIndex(
        (s) => s.id === initialStructure.id && s.name === initialStructure.name
      );
      const pIdx = foundIdx >= 0 ? foundIdx : 0;
      setPrimaryIdx(pIdx);

      if (initialSecondaryStructure) {
        const secIdx = pool.findIndex(
          (s) =>
            s.id === initialSecondaryStructure.id &&
            s.name === initialSecondaryStructure.name
        );
        setSecondaryIdx(secIdx >= 0 ? secIdx : (pIdx + 1) % Math.max(1, pool.length));
      } else {
        setSecondaryIdx((pIdx + 1) % Math.max(1, pool.length));
      }

      setIsCompareMode(initialCompareMode);
      setZoomLevel(100);
      setPanA({ x: 0, y: 0 });
      setPanB({ x: 0, y: 0 });
      setPeekNames(false);
      setPrimaryActivePharma({});
      setPrimaryHoveredPharma(null);
      setSecondaryActivePharma({});
      setSecondaryHoveredPharma(null);
    }
  }, [isOpen, initialStructure, initialSecondaryStructure, initialCompareMode, pool]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') {
        setZoomLevel((prev) => Math.min(250, prev + 25));
      }
      if (e.key === '-' || e.key === '_') {
        setZoomLevel((prev) => Math.max(75, prev - 25));
      }
      if (e.key === '0') {
        setZoomLevel(100);
        setPanA({ x: 0, y: 0 });
        setPanB({ x: 0, y: 0 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const primaryStructure = pool[primaryIdx] || initialStructure;
  const secondaryStructure = pool[secondaryIdx] || pool[(primaryIdx + 1) % pool.length];

  const shouldMask = (hideDrugName || examModeActive) && !peekNames;
  const getDisplayTitle = (s: ChemicalStructure) =>
    shouldMask ? `Structure ${s.id}` : s.name;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const resetZoom = () => {
    setZoomLevel(100);
    setPanA({ x: 0, y: 0 });
    setPanB({ x: 0, y: 0 });
  };

  // Primary pharmacophore toggle
  const handleTogglePrimaryPharma = (group: PharmacophoreGroup) => {
    setPrimaryActivePharma((prev) => {
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

  // Secondary pharmacophore toggle
  const handleToggleSecondaryPharma = (group: PharmacophoreGroup) => {
    setSecondaryActivePharma((prev) => {
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

  const handleSwapDrugs = () => {
    const temp = primaryIdx;
    setPrimaryIdx(secondaryIdx);
    setSecondaryIdx(temp);
    // Swap active highlights
    const tempPharma = primaryActivePharma;
    setPrimaryActivePharma(secondaryActivePharma);
    setSecondaryActivePharma(tempPharma);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[96vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================================================================ */}
        {/* TOP TOOLBAR: DRUG TITLES + COMPARATOR + LAYOUT TOGGLE + ZOOM     */}
        {/* ================================================================ */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Identification */}
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shrink-0">
              <FlaskConical className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-serif font-black text-sm px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
                  {primaryStructure.id}
                </span>
                <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate">
                  {getDisplayTitle(primaryStructure)}
                </h2>
                {isCompareMode && (
                  <>
                    <span className="text-xs font-bold text-slate-400">VS</span>
                    <span className="font-serif font-black text-sm px-2 py-0.5 rounded bg-indigo-900 text-white dark:bg-indigo-100 dark:text-indigo-900">
                      {secondaryStructure.id}
                    </span>
                    <span className="font-bold text-sm sm:text-base text-indigo-900 dark:text-indigo-100 truncate">
                      {getDisplayTitle(secondaryStructure)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isCompareMode
                  ? 'Dual-Drug Chemical Structure & Pharmacophore Comparator'
                  : 'High-Resolution Chemical Structure & Pharmacophore Studio'}
              </p>
            </div>
          </div>

          {/* Right: Controls Strip */}
          <div className="flex items-center gap-2 flex-wrap ml-auto">
            {/* Compare with 2nd Drug Toggle */}
            {pool.length > 1 && (
              <button
                type="button"
                onClick={() => setIsCompareMode(!isCompareMode)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isCompareMode
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
                title="Toggle Dual-Drug Comparison in Expanded Mode"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>{isCompareMode ? 'Compare Active' : 'Compare 2nd Drug'}</span>
              </button>
            )}

            {/* Adjustable Layout Toggle (Side-by-Side vs Stacked) */}
            {isCompareMode && (
              <div className="flex items-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5">
                <button
                  type="button"
                  onClick={() => setLayoutMode('side-by-side')}
                  className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    layoutMode === 'side-by-side'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Side-by-Side Columns View"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Side-by-Side</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutMode('stacked')}
                  className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    layoutMode === 'stacked'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Stacked Rows View (Expanded Width)"
                >
                  <Rows className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Stacked</span>
                </button>
              </div>
            )}

            {/* Swap Drugs Button (if compare mode) */}
            {isCompareMode && (
              <button
                type="button"
                onClick={handleSwapDrugs}
                className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                title="Swap Compound A and Compound B"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.max(75, prev - 25))}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 cursor-pointer"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono tabular-nums text-[11px] px-1 font-semibold min-w-[3rem] text-center">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.min(250, prev + 25))}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-700 dark:text-slate-300 cursor-pointer"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              {zoomLevel !== 100 && (
                <button
                  type="button"
                  onClick={resetZoom}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-500 cursor-pointer"
                  title="Reset Zoom (100%)"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Peek Names Toggle (Study Mode only) */}
            {hideDrugName && !examModeActive && (
              <button
                type="button"
                onClick={() => setPeekNames(!peekNames)}
                className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  peekNames
                    ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
                title={peekNames ? 'Hide Names' : 'Reveal Names'}
              >
                {peekNames ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Close Lightbox */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Close Lightbox (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* MODAL BODY: DRUG COMPARISON / SINGLE EXPANDED VIEW               */}
        {/* ================================================================ */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Preset Zoom Pills */}
          <div className="flex items-center justify-between text-xs flex-wrap gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 font-medium">Zoom Presets:</span>
              {[100, 125, 150, 200, 250].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setZoomLevel(preset)}
                  className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                    zoomLevel === preset
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Hover tag: preview glow</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                <span>Click tag: pin multi-color</span>
              </span>
            </div>
          </div>

          {/* DUAL OR SINGLE INSPECTION CONTAINER */}
          {isCompareMode ? (
            /* ============================================================ */
            /* DUAL-DRUG COMPARATOR VIEW (Side-by-Side vs Stacked)          */
            /* ============================================================ */
            <div
              className={`grid gap-6 ${
                layoutMode === 'side-by-side'
                  ? 'grid-cols-1 lg:grid-cols-2'
                  : 'grid-cols-1'
              }`}
            >
              {/* DRUG A (PRIMARY) */}
              <div className="space-y-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Selector Bar */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-black text-xs px-2 py-0.5 rounded bg-blue-600 text-white">
                        Compound A
                      </span>
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {getDisplayTitle(primaryStructure)}
                      </span>
                    </div>

                    <select
                      id="lightbox-primary-select"
                      name="lightboxPrimaryCompound"
                      value={primaryIdx}
                      onChange={(e) => setPrimaryIdx(Number(e.target.value))}
                      className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    >
                      {pool.map((item, i) => (
                        <option key={`a_${item.id}_${i}`} value={i}>
                          [{item.id}] {shouldMask ? `Structure ${item.id}` : item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Chemical Structure Image with Glowing Translucent Zones */}
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center min-h-[220px]">
                    <InteractiveStructureViewer
                      structure={primaryStructure}
                      activePharmacophoreIds={primaryActivePharma}
                      hoveredPharmacophoreId={primaryHoveredPharma}
                      onTogglePharmacophore={handleTogglePrimaryPharma}
                      onHoverPharmacophore={setPrimaryHoveredPharma}
                      zoomLevel={zoomLevel}
                      pan={panA}
                      maxHeightClass={layoutMode === 'stacked' ? 'max-h-72' : 'max-h-52'}
                      altText={getDisplayTitle(primaryStructure)}
                      isExpanded={true}
                    />
                  </div>

                  {/* ALWAYS INCLUDE KEY PHARMACOPHORES IN DETAILS */}
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <PharmacophoreTagList
                      structure={primaryStructure}
                      activePharmacophoreIds={primaryActivePharma}
                      hoveredPharmacophoreId={primaryHoveredPharma}
                      onTogglePharmacophore={handleTogglePrimaryPharma}
                      onHoverPharmacophore={setPrimaryHoveredPharma}
                      onClearAllHighlights={() => setPrimaryActivePharma({})}
                    />
                  </div>

                  {/* Key Molecular & SAR Attributes */}
                  {!examModeActive && (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                              Chemical Class:
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {primaryStructure.chemicalClass}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                              Target &amp; Reversibility:
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {primaryStructure.target} ({primaryStructure.reversibility})
                            </span>
                          </div>
                        </div>

                        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                            MOA Summary:
                          </span>
                          <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                            {primaryStructure.moa_summary || primaryStructure.sar_rationale || primaryStructure.sarNotes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* PubChem CID Footer */}
                {primaryStructure.pubchemAudit && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>PubChem CID {primaryStructure.pubchemAudit.cid}</span>
                    </span>
                    <a
                      href={primaryStructure.pubchemAudit.pubChemUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>NIH Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* DRUG B (SECONDARY) */}
              <div className="space-y-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Selector Bar */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif font-black text-xs px-2 py-0.5 rounded bg-indigo-600 text-white">
                        Compound B
                      </span>
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {getDisplayTitle(secondaryStructure)}
                      </span>
                    </div>

                    <select
                      id="lightbox-secondary-select"
                      name="lightboxSecondaryCompound"
                      value={secondaryIdx}
                      onChange={(e) => setSecondaryIdx(Number(e.target.value))}
                      className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                    >
                      {pool.map((item, i) => (
                        <option key={`b_${item.id}_${i}`} value={i}>
                          [{item.id}] {shouldMask ? `Structure ${item.id}` : item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Chemical Structure Image with Glowing Translucent Zones */}
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner flex items-center justify-center min-h-[220px]">
                    <InteractiveStructureViewer
                      structure={secondaryStructure}
                      activePharmacophoreIds={secondaryActivePharma}
                      hoveredPharmacophoreId={secondaryHoveredPharma}
                      onTogglePharmacophore={handleToggleSecondaryPharma}
                      onHoverPharmacophore={setSecondaryHoveredPharma}
                      zoomLevel={zoomLevel}
                      pan={panB}
                      maxHeightClass={layoutMode === 'stacked' ? 'max-h-72' : 'max-h-52'}
                      altText={getDisplayTitle(secondaryStructure)}
                      isExpanded={true}
                    />
                  </div>

                  {/* ALWAYS INCLUDE KEY PHARMACOPHORES IN DETAILS */}
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                    <PharmacophoreTagList
                      structure={secondaryStructure}
                      activePharmacophoreIds={secondaryActivePharma}
                      hoveredPharmacophoreId={secondaryHoveredPharma}
                      onTogglePharmacophore={handleToggleSecondaryPharma}
                      onHoverPharmacophore={setSecondaryHoveredPharma}
                      onClearAllHighlights={() => setSecondaryActivePharma({})}
                    />
                  </div>

                  {/* Key Molecular & SAR Attributes */}
                  {!examModeActive && (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                              Chemical Class:
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {secondaryStructure.chemicalClass}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                              Target &amp; Reversibility:
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {secondaryStructure.target} ({secondaryStructure.reversibility})
                            </span>
                          </div>
                        </div>

                        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-slate-400 font-semibold uppercase text-[10px] block">
                            MOA Summary:
                          </span>
                          <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                            {secondaryStructure.moa_summary || secondaryStructure.sar_rationale || secondaryStructure.sarNotes}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* PubChem CID Footer */}
                {secondaryStructure.pubchemAudit && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>PubChem CID {secondaryStructure.pubchemAudit.cid}</span>
                    </span>
                    <a
                      href={secondaryStructure.pubchemAudit.pubChemUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>NIH Record</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ============================================================ */
            /* SINGLE HIGH-RESOLUTION STRUCTURE INSPECTION VIEW             */
            /* ============================================================ */
            <div className="space-y-4">
              {/* Structure Switcher Bar */}
              {pool.length > 1 && (
                <div className="flex items-center justify-between gap-2 pb-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setPrimaryIdx((prev) => (prev - 1 + pool.length) % pool.length)
                      }
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous Molecule</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrimaryIdx((prev) => (prev + 1) % pool.length)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Next Molecule</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCompareMode(true)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span>Compare with Another Drug</span>
                  </button>
                </div>
              )}

              {/* Large Image Surface */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 min-h-[340px] sm:min-h-[400px] flex items-center justify-center p-6 shadow-inner">
                <InteractiveStructureViewer
                  structure={primaryStructure}
                  activePharmacophoreIds={primaryActivePharma}
                  hoveredPharmacophoreId={primaryHoveredPharma}
                  onTogglePharmacophore={handleTogglePrimaryPharma}
                  onHoverPharmacophore={setPrimaryHoveredPharma}
                  zoomLevel={zoomLevel}
                  pan={panA}
                  maxHeightClass="max-h-96"
                  altText={getDisplayTitle(primaryStructure)}
                  isExpanded={true}
                />
              </div>

              {/* ALWAYS INCLUDE KEY PHARMACOPHORES IN DETAILS */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <PharmacophoreTagList
                  structure={primaryStructure}
                  activePharmacophoreIds={primaryActivePharma}
                  hoveredPharmacophoreId={primaryHoveredPharma}
                  onTogglePharmacophore={handleTogglePrimaryPharma}
                  onHoverPharmacophore={setPrimaryHoveredPharma}
                  onClearAllHighlights={() => setPrimaryActivePharma({})}
                />
              </div>

              {/* Full Details Grid */}
              {!examModeActive ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Left: Chemical Classification & SAR */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400 block">
                      Chemical &amp; Pharmacological Classification
                    </span>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Chemical Class:
                        </span>
                        <span className="font-semibold">{primaryStructure.chemicalClass}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Pharmacological Class:
                        </span>
                        <span className="font-semibold">{primaryStructure.pharmacologicalClass}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Target Receptor:
                        </span>
                        <span className="font-semibold">{primaryStructure.target}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                          Reversibility &amp; Route:
                        </span>
                        <span className="font-semibold">
                          {primaryStructure.reversibility} · {primaryStructure.route}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        MECHANISM OF ACTION (MOA):
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-0.5">
                        {primaryStructure.moa_summary || primaryStructure.sar_rationale || primaryStructure.sarNotes}
                      </p>
                    </div>
                  </div>

                  {/* Right: PK/PD & PubChem Audit Profile */}
                  <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase tracking-wider text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>NIH PubChem Audit &amp; PK/PD Profile</span>
                      </span>
                      {primaryStructure.pubchemAudit?.pubChemUrl && (
                        <a
                          href={primaryStructure.pubchemAudit.pubChemUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <span>CID {primaryStructure.pubchemAudit.cid}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px] bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-emerald-200/70 dark:border-emerald-900/60">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Formula</span>
                        <span className="font-bold">
                          {primaryStructure.pubchemAudit?.molecularFormula || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Molecular Weight</span>
                        <span className="font-bold">
                          {primaryStructure.pubchemAudit?.molecularWeight
                            ? `${primaryStructure.pubchemAudit.molecularWeight} g/mol`
                            : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Onset</span>
                        <span className="font-sans font-semibold">
                          {primaryStructure.pkPdHighlights?.onset || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Half-Life</span>
                        <span className="font-sans font-semibold">
                          {primaryStructure.pkPdHighlights?.halfLife || '—'}
                        </span>
                      </div>
                    </div>

                    {primaryStructure.pubchemAudit?.canonicalSmiles && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span>Canonical SMILES:</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                primaryStructure.pubchemAudit.canonicalSmiles || '',
                                'single_smiles'
                              )
                            }
                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-sans font-semibold cursor-pointer"
                          >
                            {copiedKey === 'single_smiles' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[10px] text-slate-600 dark:text-slate-400 break-all select-all">
                          {primaryStructure.pubchemAudit.canonicalSmiles}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Chemical details locked during Exam Mode</span>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* COMPARATIVE ATTRIBUTE MATRIX (WHEN 2 DRUGS ARE COMPARED)      */}
          {/* ============================================================ */}
          {isCompareMode && !examModeActive && (
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-slate-100">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Head-to-Head Differential Matrix:</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                      <th className="py-2 px-3 font-semibold text-slate-500 text-[10px] uppercase">
                        Attribute
                      </th>
                      <th className="py-2 px-3 font-bold text-blue-600 dark:text-blue-400">
                        {primaryStructure.name}
                      </th>
                      <th className="py-2 px-3 font-bold text-indigo-600 dark:text-indigo-400">
                        {secondaryStructure.name}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60">
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-500">Chemical Class</td>
                      <td className="py-2 px-3">{primaryStructure.chemicalClass}</td>
                      <td className="py-2 px-3">{secondaryStructure.chemicalClass}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-500">Target Receptor</td>
                      <td className="py-2 px-3">{primaryStructure.target}</td>
                      <td className="py-2 px-3">{secondaryStructure.target}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-500">Reversibility</td>
                      <td className="py-2 px-3 font-semibold">{primaryStructure.reversibility}</td>
                      <td className="py-2 px-3 font-semibold">{secondaryStructure.reversibility}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-500">Route of Admin</td>
                      <td className="py-2 px-3">{primaryStructure.route}</td>
                      <td className="py-2 px-3">{secondaryStructure.route}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-500">Onset of Action</td>
                      <td className="py-2 px-3 font-mono">{primaryStructure.pkPdHighlights?.onset || '—'}</td>
                      <td className="py-2 px-3 font-mono">{secondaryStructure.pkPdHighlights?.onset || '—'}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium text-slate-500">Elimination Half-Life</td>
                      <td className="py-2 px-3 font-mono">{primaryStructure.pkPdHighlights?.halfLife || '—'}</td>
                      <td className="py-2 px-3 font-mono">{secondaryStructure.pkPdHighlights?.halfLife || '—'}</td>
                    </tr>
                    {primaryStructure.pkPdHighlights?.bioactivation && (
                      <tr>
                        <td className="py-2 px-3 font-medium text-slate-500">Bioactivation Pathway</td>
                        <td className="py-2 px-3">{primaryStructure.pkPdHighlights.bioactivation}</td>
                        <td className="py-2 px-3">{secondaryStructure.pkPdHighlights?.bioactivation || 'Directly active / N/A'}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
