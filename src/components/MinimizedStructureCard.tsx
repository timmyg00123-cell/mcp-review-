import React from 'react';
import { ChemicalStructure, PharmacophoreGroup } from '../types/reviewModule';
import { SmilesCanvas } from './SmilesCanvas';
import { resolveChemicalClass } from '../utils/chemicalClassDictionary';
import {
  getTargetReceptor,
  getReversibility,
  getRouteOfAdmin,
  getDrugState,
} from '../utils/structureDataUtils';
import {
  getPharmacophoresForStructure,
  parsePharmacophoreName,
  PHARMACOPHORE_COLOR_PALETTE,
} from '../utils/pharmacophoreData';
import {
  ZoomIn,
  Eye,
  EyeOff,
  Lock,
  ExternalLink,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';

export interface MinimizedStructureCardProps {
  structure: ChemicalStructure;
  isSelected?: boolean;
  onToggleSelect?: (structureId: string) => void;
  onZoom?: (structure: ChemicalStructure) => void;
  examModeActive?: boolean;
  isNamePeeked?: boolean;
  onTogglePeek?: (structureId: string) => void;
  showPharmacophores?: boolean;
  className?: string;
}

/**
 * Sleek, minimized chemical structure card derived from StructureComparator.
 * Optimized for question views, matching challenges, and responsive cards grids.
 */
export const MinimizedStructureCard: React.FC<MinimizedStructureCardProps> = ({
  structure,
  isSelected = false,
  onToggleSelect,
  onZoom,
  examModeActive = false,
  isNamePeeked = false,
  onTogglePeek,
  showPharmacophores = true,
  className = '',
}) => {
  const canonicalSmiles =
    structure.canonical_smiles || structure.canonicalSmiles || structure.smiles || '';

  const label =
    structure.document_label ||
    (structure.id && !structure.id.startsWith('struct_') && structure.id.length <= 6
      ? structure.id
      : null);

  const cleanName = (structure.name || '').replace(/\[.*?\]\s*/g, '').trim();
  const tradeSuffix =
    structure.tradeName && structure.tradeName.toLowerCase() !== cleanName.toLowerCase()
      ? ` (${structure.tradeName})`
      : '';

  const isBlinded = examModeActive && !isNamePeeked;

  const mw =
    structure.mw ?? structure.pubchemAudit?.molecularWeight
      ? `${structure.mw ?? structure.pubchemAudit?.molecularWeight} g/mol`
      : '—';

  const logP =
    structure.logP !== undefined && structure.logP !== null
      ? structure.logP
      : structure.pubchemAudit?.xlogp !== undefined && structure.pubchemAudit?.xlogp !== null
      ? structure.pubchemAudit.xlogp
      : '—';

  const target = getTargetReceptor(structure);
  const reversibility = getReversibility(structure);
  const drugState = getDrugState(structure);
  const route = getRouteOfAdmin(structure);
  const chemicalClass = resolveChemicalClass(structure);

  const pharmacophores: PharmacophoreGroup[] = showPharmacophores
    ? getPharmacophoresForStructure(structure)
    : [];

  const handleCardClick = (e: React.MouseEvent) => {
    // If click originated from interactive buttons or links, don't trigger select
    if ((e.target as HTMLElement).closest('button, a, input, select')) {
      return;
    }
    if (onToggleSelect) {
      onToggleSelect(structure.id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative group rounded-xl border transition-all duration-150 overflow-hidden flex flex-col justify-between ${
        isSelected
          ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-md'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
      } ${onToggleSelect ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* 1. Header: Pill Label, Blinding, Actions */}
      <div className="p-2.5 pb-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {label && (
            <span className="shrink-0 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold font-mono">
              {label}
            </span>
          )}
          <div className="min-w-0 truncate">
            {isBlinded ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/50">
                <Lock className="w-3 h-3 shrink-0" />
                <span className="truncate">[Blinded for exam]</span>
              </span>
            ) : (
              <span
                className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate block"
                title={`${cleanName}${tradeSuffix}`}
              >
                {cleanName}
                {tradeSuffix && (
                  <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 ml-1">
                    {tradeSuffix}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls: Peek, Zoom, Select Indicator, PubChem */}
        <div className="flex items-center gap-1 shrink-0">
          {examModeActive && onTogglePeek && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePeek(structure.id);
              }}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isNamePeeked ? 'Hide drug name' : 'Peek drug name'}
            >
              {isNamePeeked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          )}

          {onZoom && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onZoom(structure);
              }}
              className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Zoom chemical structure"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          )}

          {structure.cid && (
            <a
              href={`https://pubchem.ncbi.nlm.nih.gov/compound/${structure.cid}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={`Open CID ${structure.cid} on PubChem`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {onToggleSelect && (
            <div
              className={`w-4 h-4 rounded flex items-center justify-center transition-colors ml-0.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white'
                  : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
              }`}
            >
              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          )}
        </div>
      </div>

      {/* 2. High-Contrast Structure Canvas (4:3 Aspect Ratio) */}
      <div
        onClick={() => onZoom && onZoom(structure)}
        className="w-full h-44 bg-[var(--structure-canvas-bg)] relative flex items-center justify-center overflow-hidden border-b border-slate-100 dark:border-slate-800/80 cursor-zoom-in group/canvas"
        title="Click to zoom structure"
      >
        <SmilesCanvas
          smiles={canonicalSmiles}
          molBlock={structure.pubchemMolBlock}
          fallbackImageUrl={structure.pngUrl}
          cid={structure.cid}
          width={260}
          height={175}
          altText={`${cleanName || 'Chemical'} structure`}
          className="w-full h-full flex items-center justify-center pointer-events-none"
        />

        {/* Hover zoom indicator overlay */}
        <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/30 opacity-0 group-hover/canvas:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-2 py-1 rounded bg-slate-900/80 text-white text-[10px] font-medium flex items-center gap-1 shadow-md">
            <ZoomIn className="w-3 h-3" />
            <span>Click to zoom</span>
          </span>
        </div>
      </div>

      {/* 3. Card Body: Chemical Class Banner + 2x2 Stat Grid */}
      <div className="p-2.5 space-y-2 flex-1 flex flex-col justify-between">
        {/* Prominent Chemical Class Banner */}
        <div className="px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
          <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
            Chemical Class
          </div>
          <div
            className="text-[11px] font-bold text-slate-900 dark:text-slate-100 truncate"
            title={chemicalClass}
          >
            {chemicalClass}
          </div>
        </div>

        {/* 2x2 Stat Badges Grid */}
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          {/* Molecular Weight */}
          <div className="px-2 py-1 rounded bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 flex flex-col justify-center">
            <span className="text-[9px] font-semibold uppercase text-slate-400">Molecular Wt</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
              {mw}
            </span>
          </div>

          {/* LogP */}
          <div className="px-2 py-1 rounded bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 flex flex-col justify-center">
            <span className="text-[9px] font-semibold uppercase text-slate-400">LogP</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
              {logP}
            </span>
          </div>

          {/* Drug State */}
          <div className="px-2 py-1 rounded bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/40 flex flex-col justify-center">
            <span className="text-[9px] font-semibold uppercase text-purple-600 dark:text-purple-400">
              Drug State
            </span>
            <span className="font-bold text-purple-900 dark:text-purple-200 truncate">
              {drugState}
            </span>
          </div>

          {/* Reversibility */}
          <div className="px-2 py-1 rounded bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 flex flex-col justify-center">
            <span className="text-[9px] font-semibold uppercase text-slate-400">Reversibility</span>
            <span
              className={`font-bold truncate ${
                reversibility.toLowerCase().includes('irreversible')
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {reversibility}
            </span>
          </div>
        </div>

        {/* Target Receptor Pill */}
        <div className="px-2 py-1 rounded bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 flex items-center justify-between gap-1 text-[11px]">
          <span className="text-[9px] font-semibold uppercase text-slate-400 shrink-0">Target</span>
          <span
            className="font-semibold text-slate-800 dark:text-slate-200 truncate text-right"
            title={target}
          >
            {target}
          </span>
        </div>

        {/* 4. Pharmacophore Tag Strip (Optional) */}
        {showPharmacophores && pharmacophores.length > 0 && (
          <div className="pt-1 border-t border-slate-100 dark:border-slate-800/60 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-semibold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                <span>Pharmacophores ({pharmacophores.length})</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {pharmacophores.slice(0, 3).map((tag, idx) => {
                const { iupac, casual } = parsePharmacophoreName(tag.name);
                const color =
                  PHARMACOPHORE_COLOR_PALETTE[idx % PHARMACOPHORE_COLOR_PALETTE.length]?.hex ||
                  '#10b981';
                return (
                  <span
                    key={tag.id || idx}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 truncate max-w-[120px]"
                    title={`${iupac}${casual ? ` (${casual})` : ''}: ${tag.purpose || tag.description || ''}`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="truncate">{casual || iupac}</span>
                  </span>
                );
              })}
              {pharmacophores.length > 3 && (
                <span className="text-[9px] text-slate-400 self-center">
                  +{pharmacophores.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
