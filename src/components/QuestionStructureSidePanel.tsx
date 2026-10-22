import React, { useState, useMemo } from 'react';
import { ChemicalStructure, PharmacophoreGroup } from '../types/reviewModule';
import { InteractiveStructureViewer } from './InteractiveStructureViewer';
import { PharmacophoreTagList } from './PharmacophoreTagList';

const StructureLightboxModal = React.lazy(() =>
  import('./StructureLightboxModal').then((m) => ({ default: m.StructureLightboxModal }))
);
import {
  PHARMACOPHORE_COLOR_PALETTE,
  ColorPaletteItem,
  getPharmacophoresForStructure,
} from '../utils/pharmacophoreData';
import { resolveActivePharmacophoresForStructure } from '../utils/globalPharmacophores';
import {
  ZoomIn,
  Columns,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Layers,
  FlaskConical,
  Check,
  Lock,
  Sparkles,
} from 'lucide-react';

interface QuestionStructureSidePanelProps {
  structures: ChemicalStructure[];
  allModuleStructures?: ChemicalStructure[];
  hideDrugName?: boolean;
  examModeActive?: boolean;
  onInspectStructure?: (structure: ChemicalStructure) => void;
  questionNumberLabel?: string;
  globalActivePharmacophores?: Record<string, ColorPaletteItem>;
  globalHoveredPharmacophoreId?: string | null;
  focusMatchingOnly?: boolean;
}

export const QuestionStructureSidePanel: React.FC<QuestionStructureSidePanelProps> = ({
  structures,
  allModuleStructures = [],
  hideDrugName = false,
  examModeActive = false,
  onInspectStructure,
  globalActivePharmacophores = {},
  globalHoveredPharmacophoreId = null,
  focusMatchingOnly = false,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState<boolean>(false);
  const [openInCompareMode, setOpenInCompareMode] = useState<boolean>(false);
  const [peekedNames, setPeekedNames] = useState<Record<string, boolean>>({});
  const [showFullDetails, setShowFullDetails] = useState<boolean>(false); // Only enable image hover-highlighting when expanded
  const [showCompareAll, setShowCompareAll] = useState<boolean>(false);

  // Pharmacophore multi-color highlighting state
  const [activePharmacophoreIds, setActivePharmacophoreIds] = useState<
    Record<string, ColorPaletteItem>
  >({});
  const [hoveredPharmacophoreId, setHoveredPharmacophoreId] = useState<string | null>(null);

  if (!structures || structures.length === 0) {
    return null;
  }

  const activeStructure = structures[Math.min(selectedIndex, structures.length - 1)];
  const isMulti = structures.length > 1;
  const fullPool = allModuleStructures.length > structures.length ? allModuleStructures : structures;

  // Resolve merged local + global pharmacophore highlights
  const {
    mergedActive,
    mergedHovered,
    matchedGlobalPharmacophores,
  } = resolveActivePharmacophoresForStructure(
    activeStructure,
    activePharmacophoreIds,
    hoveredPharmacophoreId,
    globalActivePharmacophores,
    globalHoveredPharmacophoreId
  );

  const currentPharmacophores = useMemo(
    () => getPharmacophoresForStructure(activeStructure),
    [activeStructure]
  );

  const activeHoveredGroup = useMemo(() => {
    // 1. Prioritize currently hovered group
    if (mergedHovered) {
      const h = currentPharmacophores.find((p) => p.id === mergedHovered);
      if (h) return h;
    }
    // 2. Prioritize most recently selected/pinned group (tablet touch friendly)
    const activeIds = Object.keys(mergedActive);
    if (activeIds.length > 0) {
      const lastId = activeIds[activeIds.length - 1];
      const p = currentPharmacophores.find((item) => item.id === lastId);
      if (p) return p;
    }
    return null;
  }, [mergedHovered, currentPharmacophores, mergedActive]);

  const togglePeekName = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (examModeActive) return;
    setPeekedNames((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isNameHidden = (str: ChemicalStructure) => {
    return (hideDrugName || examModeActive) && !peekedNames[str.id];
  };

  const getDisplayName = (str: ChemicalStructure) => {
    if (isNameHidden(str)) {
      return `Structure ${str.id}`;
    }
    return str.name;
  };

  // Multi-color pharmacophore pin toggle
  const handleTogglePharmacophore = (group: PharmacophoreGroup) => {
    setActivePharmacophoreIds((prev) => {
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

  const handleClearAllHighlights = () => {
    setActivePharmacophoreIds({});
    setHoveredPharmacophoreId(null);
  };

  return (
    <>
      <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/90 dark:border-slate-800 rounded-xl p-3 sm:p-3.5 space-y-3 shadow-xs">
        {/* Top Header: Badge, Title & Compact PubChem Audit + Zoom/Compare Actions */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="p-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shrink-0">
              <FlaskConical className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              Structure Reference
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Compact PubChem Audit Verification Badge */}
            {activeStructure.pubchemAudit && !examModeActive && (
              <button
                type="button"
                onClick={() => onInspectStructure && onInspectStructure(activeStructure)}
                title={`PubChem Audit Verified (CID ${activeStructure.cid || activeStructure.pubchemAudit.cid}): ${activeStructure.pubchemAudit.status.toUpperCase()}`}
                className="inline-flex items-center justify-center p-1 rounded-md bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 transition-colors shadow-2xs group cursor-pointer"
                aria-label={`PubChem Audit Verified (CID ${activeStructure.cid || activeStructure.pubchemAudit.cid})`}
              >
                <div className="relative flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 transition-transform group-hover:scale-110" />
                  <Check className="w-2 h-2 text-white dark:text-emerald-950 absolute stroke-[3]" />
                </div>
              </button>
            )}

            {/* Side-by-Side Comparison Lightbox Button */}
            {fullPool.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setOpenInCompareMode(true);
                  setIsZoomModalOpen(true);
                }}
                title="Open Side-by-Side Structure Comparator"
                className="p-1 rounded-md bg-white hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Zoom In Lightbox Button */}
            <button
              type="button"
              onClick={() => {
                setOpenInCompareMode(false);
                setIsZoomModalOpen(true);
              }}
              title="Click to Zoom Structure (100%-250%)"
              className="p-1 rounded-md bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Multi-Structure Tabs (e.g. Q18, Q19, Q22, Q23) */}
        {isMulti && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span>Select Molecule:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpenInCompareMode(true);
                    setIsZoomModalOpen(true);
                  }}
                  className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Columns className="w-3 h-3" />
                  <span>Side-by-Side</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCompareAll(!showCompareAll)}
                  className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Layers className="w-3 h-3" />
                  <span>{showCompareAll ? 'Single' : 'Stack All'}</span>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {structures.map((str, idx) => {
                const isActive = idx === selectedIndex && !showCompareAll;
                return (
                  <button
                    key={str.id + idx}
                    type="button"
                    onClick={() => {
                      setSelectedIndex(idx);
                      setShowCompareAll(false);
                      setActivePharmacophoreIds({});
                      setHoveredPharmacophoreId(null);
                    }}
                    className={`px-2 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-80">{str.id}</span>
                    <span className="truncate max-w-[100px]">{getDisplayName(str)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Structure View */}
        {showCompareAll ? (
          /* Multi-Structure Stacked Grid */
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {structures.map((str, idx) => (
              <div
                key={str.id + idx}
                onClick={() => {
                  setSelectedIndex(idx);
                  setOpenInCompareMode(true);
                  setIsZoomModalOpen(true);
                }}
                className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer hover:border-blue-400 transition-colors group relative"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{str.id}</span>
                  <span>{getDisplayName(str)}</span>
                  <ZoomIn className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="h-28 w-full flex items-center justify-center p-1 bg-white dark:bg-slate-900 rounded">
                  <img
                    src={str.pngUrl || str.croppedImageUrl}
                    alt={str.name}
                    width="320"
                    height="320"
                    loading="lazy"
                    className="w-full h-full aspect-square object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Single Focused Structure with Interactive Highlighting & Tooltip Tag List */
          <div className="space-y-2.5">
            {/* Active Structure Identification Header */}
            <div className="flex items-center justify-between gap-1 text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-[11px] shrink-0">
                  {activeStructure.id}
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100 truncate text-xs sm:text-sm">
                  {getDisplayName(activeStructure)}
                </span>
                {activeStructure.tradeName && !isNameHidden(activeStructure) && (
                  <span className="text-[11px] text-slate-500 italic truncate hidden sm:inline">
                    ({activeStructure.tradeName})
                  </span>
                )}
              </div>

              {/* Reveal Name Toggle Button */}
              {hideDrugName && !examModeActive && (
                <button
                  type="button"
                  onClick={(e) => togglePeekName(activeStructure.id, e)}
                  title={isNameHidden(activeStructure) ? 'Reveal Drug Name' : 'Hide Drug Name'}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors shrink-0 cursor-pointer"
                >
                  {isNameHidden(activeStructure) ? (
                    <Eye className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </button>
              )}
            </div>

            {/* Global Pharmacophore Explorer Match Badge Strip */}
            {matchedGlobalPharmacophores.length > 0 && (
              <div className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/80 flex items-center justify-between gap-1 text-[10px] animate-fadeIn">
                <div className="flex items-center gap-1 flex-wrap">
                  <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-blue-950 dark:text-blue-200 uppercase">Explorer:</span>
                  {matchedGlobalPharmacophores.map(({ gp, color }) => (
                    <span
                      key={gp.id}
                      className="px-1 py-0.2 rounded font-mono font-bold text-white text-[9px]"
                      style={{ backgroundColor: color.pinBg }}
                    >
                      {gp.chemicalFormulaOrSymbol}
                    </span>
                  ))}
                </div>
                <span className="text-[9px] font-semibold text-blue-600 dark:text-blue-400">Highlighted</span>
              </div>
            )}

            {/* Chemical Structure Image with Glowing Translucent Zones */}
            <div className="relative group bg-white dark:bg-slate-900 rounded-lg p-2.5 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-center min-h-[160px] max-h-[220px]">
              <InteractiveStructureViewer
                structure={activeStructure}
                activePharmacophoreIds={mergedActive}
                hoveredPharmacophoreId={mergedHovered}
                onTogglePharmacophore={handleTogglePharmacophore}
                onHoverPharmacophore={setHoveredPharmacophoreId}
                maxHeightClass="max-h-36"
                altText={getDisplayName(activeStructure)}
                isExpanded={showFullDetails}
              />

              {/* Zoom Hover Pill */}
              <button
                type="button"
                onClick={() => {
                  setOpenInCompareMode(false);
                  setIsZoomModalOpen(true);
                }}
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer"
              >
                <ZoomIn className="w-2.5 h-2.5" />
                <span>Zoom</span>
              </button>
            </div>

            {/* ALWAYS INCLUDE KEY PHARMACOPHORES IN DETAILS (Hidden only in active exam simulation) */}
            {!examModeActive ? (
              <div className="space-y-2 pt-1">
                {/* Pharmacophore Tag Strip with Tooltips & Multi-Color Click Pinning */}
                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                  <PharmacophoreTagList
                    structure={activeStructure}
                    activePharmacophoreIds={mergedActive}
                    hoveredPharmacophoreId={mergedHovered}
                    onTogglePharmacophore={handleTogglePharmacophore}
                    onHoverPharmacophore={setHoveredPharmacophoreId}
                    onClearAllHighlights={handleClearAllHighlights}
                    compact={true}
                  />

                  {/* Fixed-height descriptor note: zero pop-up over tag or structure, zero layout flicker */}
                  <div
                    className={`mt-2 p-2 rounded-lg border text-[11px] h-[68px] overflow-hidden flex flex-col justify-center transition-colors duration-100 ${
                      activeHoveredGroup
                        ? 'bg-blue-50/90 dark:bg-blue-950/80 border-blue-300 dark:border-blue-700/80 shadow-2xs'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60'
                    }`}
                  >
                    {activeHoveredGroup ? (
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-blue-950 dark:text-blue-100 text-[11px] truncate">
                            {activeHoveredGroup.name}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[9px] font-mono uppercase font-bold text-blue-700 dark:text-blue-300">
                              {activeHoveredGroup.category || 'PHARMACOPHORE'}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-700 dark:text-slate-300 leading-snug line-clamp-2">
                          {activeHoveredGroup.description || activeHoveredGroup.purpose}
                        </p>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">
                        Tap or hover any tag or structure line to inspect its medicinal chemistry role.
                      </span>
                    )}
                  </div>
                </div>

                {/* Target & Property Pills */}
                <div className="flex flex-wrap gap-1">
                  {/* Prominent Drug State Badge */}
                  <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950/90 dark:text-purple-300 border border-purple-300 dark:border-purple-700/80 text-[10px] font-bold shadow-2xs">
                    {activeStructure.drug_state || 'Active Drug'}
                  </span>
                  {activeStructure.target && !isNameHidden(activeStructure) && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-[10px] font-medium truncate max-w-full">
                      Target: {activeStructure.target}
                    </span>
                  )}
                  {activeStructure.reversibility && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-medium">
                      {activeStructure.reversibility}
                    </span>
                  )}
                  {activeStructure.route && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-medium">
                      {activeStructure.route}
                    </span>
                  )}
                  {(activeStructure.mw !== undefined || activeStructure.pubchemAudit?.molecularWeight !== undefined) && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-medium font-mono">
                      MW: {activeStructure.mw ?? activeStructure.pubchemAudit?.molecularWeight} g/mol
                    </span>
                  )}
                  {((activeStructure.logP !== undefined && activeStructure.logP !== null) || (activeStructure.pubchemAudit?.xlogp !== undefined && activeStructure.pubchemAudit?.xlogp !== null)) && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-medium font-mono">
                      LogP: {activeStructure.logP ?? activeStructure.pubchemAudit?.xlogp}
                    </span>
                  )}
                </div>

                {/* Chemical Details Accordion */}
                <div className="border-t border-slate-200/80 dark:border-slate-800 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowFullDetails(!showFullDetails)}
                    className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    <span>Chemical &amp; MOA Details</span>
                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      <span>{showFullDetails ? 'Hide' : 'Show'}</span>
                      {showFullDetails ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </div>
                  </button>

                  {showFullDetails && (
                    <div className="mt-2 p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5 text-slate-700 dark:text-slate-300 animate-fadeIn">
                      <div>
                        <span className="font-semibold text-slate-400 text-[10px] uppercase block">
                          Chemical Class:
                        </span>
                        <span className="font-medium">{activeStructure.chemicalClass}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-400 text-[10px] uppercase block">
                          Pharmacological Class:
                        </span>
                        <span className="font-medium">
                          {activeStructure.pharmacologicalClass}
                        </span>
                      </div>
                      <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-slate-400 text-[10px] uppercase block">
                          MOA Summary:
                        </span>
                        <p className="leading-relaxed text-[10px] text-slate-600 dark:text-slate-300">
                          {activeStructure.moa_summary || activeStructure.sar_rationale || activeStructure.sarNotes}
                        </p>
                      </div>

                      {activeStructure.pkPdHighlights && (
                        <div className="pt-1 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-1 text-[10px]">
                          <div>
                            <span className="text-slate-400">Onset: </span>
                            <span className="font-medium">{activeStructure.pkPdHighlights.onset}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Duration: </span>
                            <span className="font-medium">{activeStructure.pkPdHighlights.duration}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-2 text-center text-[10px] text-slate-400 italic">
                <span className="flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-amber-500" />
                  <span>Chemical details locked during Exam Mode</span>
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Structure Lightbox & Dual-Drug Comparator Modal */}
      {isZoomModalOpen && (
        <React.Suspense fallback={null}>
          <StructureLightboxModal
            isOpen={isZoomModalOpen}
            onClose={() => setIsZoomModalOpen(false)}
            initialStructure={activeStructure}
            comparisonPool={fullPool}
            initialCompareMode={openInCompareMode}
            hideDrugName={hideDrugName}
            examModeActive={examModeActive}
            onInspectPubChem={onInspectStructure}
          />
        </React.Suspense>
      )}
    </>
  );
};
