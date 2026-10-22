import React, { useState } from 'react';
import { ChemicalStructure, PharmacophoreGroup } from '../types/reviewModule';
import { InteractiveStructureViewer } from './InteractiveStructureViewer';
import { PharmacophoreTagList } from './PharmacophoreTagList';

const StructureLightboxModal = React.lazy(() =>
  import('./StructureLightboxModal').then((m) => ({ default: m.StructureLightboxModal }))
);
const PubChemAuditEditModal = React.lazy(() =>
  import('./PubChemAuditEditModal').then((m) => ({ default: m.PubChemAuditEditModal }))
);
import {
  PHARMACOPHORE_COLOR_PALETTE,
  ColorPaletteItem,
  getPharmacophoresForStructure,
} from '../utils/pharmacophoreData';
import { resolveActivePharmacophoresForStructure } from '../utils/globalPharmacophores';
import {
  ExternalLink,
  ZoomIn,
  Columns,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
  Copy,
  RefreshCw,
  Edit3,
  Eye,
  EyeOff,
  Lock,
  Sparkles,
} from 'lucide-react';

interface ChemicalStructureCardProps {
  structure: ChemicalStructure;
  indexLabel?: string; // e.g., 'I', 'II', 'III'
  onInspect?: (structure: ChemicalStructure) => void;
  onUpdateStructure?: (updated: ChemicalStructure) => void;
  showDetailsByDefault?: boolean;
  highlight?: boolean;
  hideDrugName?: boolean;
  examModeActive?: boolean;
  comparisonPool?: ChemicalStructure[];
  globalActivePharmacophores?: Record<string, ColorPaletteItem>;
  globalHoveredPharmacophoreId?: string | null;
  focusMatchingOnly?: boolean;
}

const ChemicalStructureCardComponent: React.FC<ChemicalStructureCardProps> = ({
  structure: initialStructure,
  indexLabel,
  onInspect,
  onUpdateStructure,
  showDetailsByDefault = false,
  highlight = false,
  hideDrugName = false,
  examModeActive = false,
  comparisonPool = [],
  globalActivePharmacophores = {},
  globalHoveredPharmacophoreId = null,
  focusMatchingOnly = false,
}) => {
  const [structure, setStructure] = useState<ChemicalStructure>(initialStructure);
  const [showDetails, setShowDetails] = useState(showDetailsByDefault);
  const [isZoomed, setIsZoomed] = useState(false);
  const [openInCompareMode, setOpenInCompareMode] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isNamePeeked, setIsNamePeeked] = useState(false);
  const [copiedSmiles, setCopiedSmiles] = useState(false);
  const [isReauditing, setIsReauditing] = useState(false);
  const [auditSuccessMsg, setAuditSuccessMsg] = useState<string | null>(null);

  // Pharmacophore multi-color highlighting state
  const [activePharmacophoreIds, setActivePharmacophoreIds] = useState<
    Record<string, ColorPaletteItem>
  >({});
  const [hoveredPharmacophoreId, setHoveredPharmacophoreId] = useState<string | null>(null);

  // Resolve merged local + global pharmacophore highlights
  const {
    mergedActive,
    mergedHovered,
    matchedGlobalPharmacophores,
    hasAnyMatch,
    isDimmed,
  } = resolveActivePharmacophoresForStructure(
    structure,
    activePharmacophoreIds,
    hoveredPharmacophoreId,
    globalActivePharmacophores,
    globalHoveredPharmacophoreId
  );

  const cardPharmacophores = React.useMemo(
    () => getPharmacophoresForStructure(structure),
    [structure]
  );

  const activeHoveredGroup = React.useMemo(() => {
    // 1. Prioritize currently hovered group
    if (mergedHovered) {
      const h = cardPharmacophores.find((p) => p.id === mergedHovered);
      if (h) return h;
    }
    // 2. Prioritize most recently selected/pinned group (tablet touch friendly)
    const activeIds = Object.keys(mergedActive);
    if (activeIds.length > 0) {
      const lastId = activeIds[activeIds.length - 1];
      const p = cardPharmacophores.find((item) => item.id === lastId);
      if (p) return p;
    }
    return null;
  }, [mergedHovered, cardPharmacophores, mergedActive]);

  React.useEffect(() => {
    setStructure(initialStructure);
    setActivePharmacophoreIds({});
    setHoveredPharmacophoreId(null);
  }, [initialStructure]);

  // Collapse details automatically if exam mode starts
  React.useEffect(() => {
    if (examModeActive) {
      setShowDetails(false);
      setIsNamePeeked(false);
      setActivePharmacophoreIds({});
    }
  }, [examModeActive]);

  const romanId = structure.document_label || indexLabel || structure.id;

  // Mask name if hideDrugName or examModeActive is active
  const shouldMaskName = (hideDrugName || examModeActive) && !isNamePeeked;
  const displayName = shouldMaskName ? `Structure ${romanId}` : structure.name;

  const handleCopySmiles = (smiles: string) => {
    navigator.clipboard.writeText(smiles);
    setCopiedSmiles(true);
    setTimeout(() => setCopiedSmiles(false), 2000);
  };

  // Toggle pharmacophore highlight (persistent multi-color cycle)
  const handleTogglePharmacophore = (group: PharmacophoreGroup) => {
    setActivePharmacophoreIds((prev) => {
      const copy = { ...prev };
      if (copy[group.id]) {
        delete copy[group.id];
        return copy;
      }
      // Pick next unused color from palette or cycle
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

  const handleReaudit = async () => {
    if (!structure.cid) return;
    setIsReauditing(true);
    setAuditSuccessMsg(null);

    try {
      const res = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${structure.cid}/property/Title,IUPACName,MolecularFormula,MolecularWeight,CanonicalSMILES,XLogP/JSON`
      );
      if (res.ok) {
        const data = await res.json();
        const prop = data?.PropertyTable?.Properties?.[0];
        const updatedMw = prop?.MolecularWeight
          ? Number(prop.MolecularWeight)
          : (structure.mw ?? structure.pubchemAudit?.molecularWeight);
        const updatedLogP = prop?.XLogP !== undefined
          ? Number(prop.XLogP)
          : (structure.logP ?? structure.pubchemAudit?.xlogp);
        const updated: ChemicalStructure = {
          ...structure,
          mw: updatedMw,
          logP: updatedLogP,
          pngUrl: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${structure.cid}/PNG?image_size=large`,
          pubchemAudit: {
            cid: structure.cid,
            status: 'verified',
            verifiedAt: new Date().toISOString().split('T')[0],
            source: 'nih_pug_rest',
            canonicalSmiles:
              prop?.CanonicalSMILES || structure.pubchemAudit?.canonicalSmiles,
            iupacName: prop?.IUPACName || structure.pubchemAudit?.iupacName,
            molecularFormula:
              prop?.MolecularFormula || structure.pubchemAudit?.molecularFormula,
            molecularWeight: updatedMw,
            xlogp: updatedLogP,
            pubChemUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${structure.cid}`,
            matchScore: 100,
          },
        };
        setStructure(updated);
        if (onUpdateStructure) onUpdateStructure(updated);
        setAuditSuccessMsg('PubChem Audit Verified!');
        setTimeout(() => setAuditSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.warn('Re-audit failed:', err);
    } finally {
      setIsReauditing(false);
    }
  };

  const isCardHighlighted = highlight || matchedGlobalPharmacophores.length > 0;

  return (
    <>
      <div
        className={`bg-white dark:bg-slate-900 border rounded-xl overflow-hidden transition-all duration-200 shadow-xs flex flex-col justify-between ${
          focusMatchingOnly && isDimmed
            ? 'opacity-35 grayscale-[70%] hover:opacity-100 hover:grayscale-0'
            : ''
        } ${
          isCardHighlighted
            ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-900/60 shadow-md'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        {/* Card Header: Roman ID + Name + Controls */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-serif font-black text-sm text-slate-800 dark:text-slate-100 px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0">
              {romanId}
            </span>
            <div className="min-w-0">
              <span
                className={`font-bold text-xs truncate block ${
                  shouldMaskName
                    ? 'text-slate-400 italic'
                    : 'text-slate-900 dark:text-slate-100'
                }`}
                title={shouldMaskName ? 'Name hidden during review' : structure.name}
              >
                {displayName}
              </span>
              {structure.tradeName && !shouldMaskName && (
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate block">
                  ({structure.tradeName})
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Peek Drug Name Toggle during Study Mode */}
            {(hideDrugName || examModeActive) && (
              <button
                type="button"
                onClick={() => !examModeActive && setIsNamePeeked(!isNamePeeked)}
                disabled={examModeActive}
                className={`p-1 rounded-md text-[10px] transition-colors ${
                  examModeActive
                    ? 'opacity-30 cursor-not-allowed text-slate-400'
                    : isNamePeeked
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title={
                  examModeActive
                    ? 'Peeking disabled during Exam Simulation'
                    : isNamePeeked
                    ? 'Hide Drug Name'
                    : 'Peek Drug Name'
                }
              >
                {isNamePeeked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Side-by-Side Comparison Lightbox Button */}
            {comparisonPool && comparisonPool.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setOpenInCompareMode(true);
                  setIsZoomed(true);
                }}
                className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Compare Side-by-Side with Another Drug"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Click-to-Zoom Lightbox Button */}
            <button
              type="button"
              onClick={() => {
                setOpenInCompareMode(false);
                setIsZoomed(true);
              }}
              className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Click to Zoom Chemical Structure (100% - 250%)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Global Pharmacophore Explorer Active Match Strip */}
        {matchedGlobalPharmacophores.length > 0 && (
          <div className="px-3 py-1.5 bg-blue-50/90 dark:bg-blue-950/70 border-b border-blue-200 dark:border-blue-800/80 flex flex-wrap items-center justify-between gap-1 text-[11px] animate-fadeIn">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="font-bold text-blue-950 dark:text-blue-200 text-[10px] uppercase tracking-wider">
                Explorer Feature:
              </span>
              {matchedGlobalPharmacophores.map(({ gp, color }) => (
                <span
                  key={gp.id}
                  className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-white flex items-center gap-1 shadow-2xs"
                  style={{ backgroundColor: color.pinBg }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>{gp.chemicalFormulaOrSymbol}</span>
                  <span className="font-sans font-normal hidden sm:inline">
                    ({gp.name.split('/')[0]})
                  </span>
                </span>
              ))}
            </div>
            <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300">
              Highlighted
            </span>
          </div>
        )}

        {/* Chemical Structure Image with Interactive Pharmacophore Overlays */}
        <div className="relative p-3 bg-white dark:bg-slate-900 flex items-center justify-center min-h-[170px] group">
          <InteractiveStructureViewer
            structure={structure}
            activePharmacophoreIds={mergedActive}
            hoveredPharmacophoreId={mergedHovered}
            onTogglePharmacophore={handleTogglePharmacophore}
            onHoverPharmacophore={setHoveredPharmacophoreId}
            maxHeightClass="max-h-40"
            altText={`${displayName} 2D chemical structure`}
            isExpanded={showDetails}
          />

          {/* Zoom / Compare Floating Prompt */}
          <button
            type="button"
            onClick={() => {
              setOpenInCompareMode(false);
              setIsZoomed(true);
            }}
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer"
          >
            <ZoomIn className="w-2.5 h-2.5" />
            <span>Zoom</span>
          </button>
        </div>

        {/* Footer: Masked Chemical Details Toggle */}
        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
          {examModeActive ? (
            <div className="w-full flex items-center justify-between text-slate-400 dark:text-slate-500 font-medium text-[11px]">
              <span>Chemical Details Locked</span>
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-mono text-[10px]">
                <Lock className="w-3 h-3" />
                <span>Exam Mode</span>
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold text-[11px] cursor-pointer"
            >
              <span>{showDetails ? 'Hide Chemical Details' : 'Click for Chemical Details'}</span>
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <span>{showDetails ? 'Collapse' : 'Expand'}</span>
                {showDetails ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </div>
            </button>
          )}
        </div>

        {/* ALWAYS INCLUDE KEY PHARMACOPHORES IN EXPANDED DETAILS */}
        {showDetails && !examModeActive && (
          <div className="p-3 bg-slate-100/60 dark:bg-slate-800/70 border-t border-slate-200 dark:border-slate-800 space-y-3 text-xs text-slate-700 dark:text-slate-300 animate-slideDown">
            {/* KEY PHARMACOPHORES & FUNCTIONAL GROUP ANALYSIS (ALWAYS PROMINENT WITH ZERO POPUPS & MULTI-HIGHLIGHT) */}
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80">
              <PharmacophoreTagList
                structure={structure}
                activePharmacophoreIds={mergedActive}
                hoveredPharmacophoreId={mergedHovered}
                onTogglePharmacophore={handleTogglePharmacophore}
                onHoverPharmacophore={setHoveredPharmacophoreId}
                onClearAllHighlights={handleClearAllHighlights}
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
                        <span className="text-[9px] font-mono uppercase font-bold text-blue-700 dark:text-blue-300 px-1.5 py-0.2 rounded bg-blue-100/70 dark:bg-blue-900/50">
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

            {/* Revealed Chemical & Pharmacological Classes */}
            <div className="space-y-1 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80">
              <div>
                <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider block">
                  Chemical Class:
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                  {structure.chemicalClass}
                </span>
              </div>
              <div className="pt-1">
                <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider block">
                  Pharmacological Class:
                </span>
                <span className="text-xs text-slate-800 dark:text-slate-200">
                  {structure.pharmacologicalClass}
                </span>
              </div>
            </div>

            {/* Quick-Glance Tags: Drug State, Target, Reversibility, Route, MW, LogP */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Prominent Drug State Badge */}
              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950/90 dark:text-purple-300 border border-purple-300 dark:border-purple-700/80 text-[10px] font-bold shadow-2xs">
                {structure.drug_state || 'Active Drug'}
              </span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-medium">
                Target: {structure.target}
              </span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-medium">
                {structure.reversibility}
              </span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-medium">
                Route: {structure.route}
              </span>
              {/* MW and LogP directly in tag row */}
              {(structure.mw !== undefined || structure.pubchemAudit?.molecularWeight !== undefined) && (
                <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-medium font-mono text-slate-700 dark:text-slate-300">
                  MW: {structure.mw ?? structure.pubchemAudit?.molecularWeight} g/mol
                </span>
              )}
              {((structure.logP !== undefined && structure.logP !== null) || (structure.pubchemAudit?.xlogp !== undefined && structure.pubchemAudit?.xlogp !== null)) && (
                <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-medium font-mono text-slate-700 dark:text-slate-300">
                  LogP: {structure.logP ?? structure.pubchemAudit?.xlogp}
                </span>
              )}
            </div>

            {/* MOA Summary */}
            <p className="text-[11px] leading-relaxed">
              <strong>MOA Summary: </strong>
              {structure.moa_summary || structure.sar_rationale || structure.sarNotes}
            </p>

            {/* PK/PD Highlights */}
            {structure.pkPdHighlights && (
              <div className="grid grid-cols-2 gap-1 text-[10px] pt-1">
                <div>
                  <span className="text-slate-400">Onset: </span>
                  <span className="font-medium">{structure.pkPdHighlights.onset}</span>
                </div>
                <div>
                  <span className="text-slate-400">Duration: </span>
                  <span className="font-medium">{structure.pkPdHighlights.duration}</span>
                </div>
              </div>
            )}

            {/* NIH PUBCHEM REFERENCE BOX */}
            {structure.pubchemAudit && (
              <div className="bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-lg p-2.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>NIH PubChem Reference:</span>
                  </div>
                  <a
                    href={structure.pubchemAudit.pubChemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>NIH CID {structure.pubchemAudit.cid}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-mono text-emerald-900 dark:text-emerald-200/90 pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60">
                  <div>
                    <span className="text-emerald-700 dark:text-emerald-400 block font-sans font-medium">
                      Formula:
                    </span>
                    <span>{structure.pubchemAudit.molecularFormula || '—'}</span>
                  </div>
                  <div>
                    <span className="text-emerald-700 dark:text-emerald-400 block font-sans font-medium">
                      Molecular Wt:
                    </span>
                    <span>
                      {(structure.mw ?? structure.pubchemAudit.molecularWeight)
                        ? `${structure.mw ?? structure.pubchemAudit.molecularWeight} g/mol`
                        : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-700 dark:text-emerald-400 block font-sans font-medium">
                      XLogP:
                    </span>
                    <span>
                      {(structure.logP !== undefined && structure.logP !== null)
                        ? structure.logP
                        : (structure.pubchemAudit.xlogp !== undefined && structure.pubchemAudit.xlogp !== null)
                        ? structure.pubchemAudit.xlogp
                        : '—'}
                    </span>
                  </div>
                </div>

                {structure.pubchemAudit.canonicalSmiles && (
                  <div className="pt-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-emerald-700 dark:text-emerald-400 font-sans font-medium">
                        Canonical SMILES:
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopySmiles(structure.pubchemAudit.canonicalSmiles!)
                        }
                        className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 flex items-center gap-0.5"
                      >
                        {copiedSmiles ? (
                          <>
                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-2.5 h-2.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <code className="text-[9px] font-mono block truncate bg-emerald-100/60 dark:bg-emerald-900/40 p-1 rounded mt-0.5 text-emerald-950 dark:text-emerald-100 select-all">
                      {structure.pubchemAudit.canonicalSmiles}
                    </code>
                  </div>
                )}

                {/* Audit Action Row */}
                <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleReaudit}
                      disabled={isReauditing}
                      className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-2.5 h-2.5 ${isReauditing ? 'animate-spin' : ''}`} />
                      <span>{isReauditing ? 'Verifying...' : 'Re-verify NIH CID'}</span>
                    </button>
                    {auditSuccessMsg && (
                      <span className="text-[10px] text-emerald-600 font-bold animate-fadeIn">
                        ✓ {auditSuccessMsg}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAuditModalOpen(true)}
                    className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                    <span>Edit Audit / Override CID</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox / Dual-Drug Comparator Modal with Zoom, Pan, Pharmacophores & Side-by-Side vs Stacked Layouts */}
      {isZoomed && (
        <React.Suspense fallback={null}>
          <StructureLightboxModal
            isOpen={isZoomed}
            onClose={() => setIsZoomed(false)}
            initialStructure={structure}
            comparisonPool={comparisonPool}
            initialCompareMode={openInCompareMode}
            hideDrugName={hideDrugName}
            examModeActive={examModeActive}
            onInspectPubChem={onInspect}
          />
        </React.Suspense>
      )}

      {/* Audit Edit Modal */}
      {isAuditModalOpen && (
        <React.Suspense fallback={null}>
          <PubChemAuditEditModal
            isOpen={isAuditModalOpen}
            onClose={() => setIsAuditModalOpen(false)}
            structure={structure}
            onSaveAudit={(updated: ChemicalStructure) => {
              setStructure(updated);
              if (onUpdateStructure) onUpdateStructure(updated);
            }}
          />
        </React.Suspense>
      )}
    </>
  );
};

export const ChemicalStructureCard = React.memo<ChemicalStructureCardProps>(
  ChemicalStructureCardComponent,
  (prev, next) => {
    return (
      prev.structure === next.structure &&
      prev.indexLabel === next.indexLabel &&
      prev.showDetailsByDefault === next.showDetailsByDefault &&
      prev.highlight === next.highlight &&
      prev.hideDrugName === next.hideDrugName &&
      prev.examModeActive === next.examModeActive &&
      prev.comparisonPool === next.comparisonPool &&
      prev.globalActivePharmacophores === next.globalActivePharmacophores &&
      prev.globalHoveredPharmacophoreId === next.globalHoveredPharmacophoreId &&
      prev.focusMatchingOnly === next.focusMatchingOnly
    );
  }
);
