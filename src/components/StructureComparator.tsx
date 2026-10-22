import React, { useState } from 'react';
import { ChemicalStructure } from '../types/reviewModule';
import { InteractiveStructureViewer } from './InteractiveStructureViewer';
import { ColorPaletteItem } from '../utils/pharmacophoreData';
import {
  ArrowRightLeft,
  ExternalLink,
  ShieldCheck,
  Search,
  Copy,
  Check,
  Columns,
  Rows,
  Maximize2,
  Sparkles,
} from 'lucide-react';

export interface StructureComparatorProps {
  structureA: ChemicalStructure;
  structureB: ChemicalStructure;
  drugAKey?: string;
  drugBKey?: string;
  onSelectDrugA?: (key: string) => void;
  onSelectDrugB?: (key: string) => void;
  onSwapDrugs?: () => void;
  onInspectStructure?: (structure: ChemicalStructure) => void;
  onExpandStudio?: () => void;
  allStructures?: ChemicalStructure[];
  globalActivePharmacophores?: Record<string, ColorPaletteItem>;
  globalHoveredPharmacophoreId?: string | null;
  focusMatchingOnly?: boolean;
}

export const StructureComparator: React.FC<StructureComparatorProps> = ({
  structureA,
  structureB,
  drugAKey = 'prasugrel',
  drugBKey = 'clopidogrel',
  onSelectDrugA,
  onSelectDrugB,
  onSwapDrugs,
  onInspectStructure,
  onExpandStudio,
  globalActivePharmacophores = {},
  globalHoveredPharmacophoreId = null,
  focusMatchingOnly = false,
}) => {
  const [layout, setLayout] = useState<'side-by-side' | 'stacked'>('side-by-side');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopySmiles = (smiles: string, key: string) => {
    navigator.clipboard.writeText(smiles);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const renderSingleComparatorCard = (
    structure: ChemicalStructure,
    label: string,
    drugKey: string,
    onSelectKey?: (k: string) => void,
    copyKeySuffix: string = 'a'
  ) => {
    return (
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3.5">
        <div className="space-y-3">
          {/* Card Header: Label & Name & Selector */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold font-mono text-xs shrink-0">
                {label}
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                {structure.name}
              </h3>
            </div>

            {onSelectKey && (
              <select
                id={`comparator-select-${copyKeySuffix}`}
                name={`comparatorSelect${copyKeySuffix.toUpperCase()}`}
                value={drugKey}
                onChange={(e) => onSelectKey(e.target.value)}
                className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 shrink-0"
              >
                <option value="prasugrel">Prasugrel (Effient)</option>
                <option value="clopidogrel">Clopidogrel (Plavix)</option>
                <option value="ticlopidine">Ticlopidine (Ticlid)</option>
                <option value="ticagrelor">Ticagrelor (Brilinta)</option>
                <option value="cangrelor">Cangrelor (Kengreal)</option>
                <option value="aspirin">Aspirin (Acetylsalicylic Acid)</option>
                <option value="tirofiban">Tirofiban (Aggrastat)</option>
                <option value="eptifibatide">Eptifibatide (Integrilin)</option>
                <option value="vorapaxar">Vorapaxar (Zontivity)</option>
                <option value="cilostazol">Cilostazol (Pletal)</option>
                <option value="dipyridamole">Dipyridamole (Aggrenox)</option>
              </select>
            )}
          </div>

          {/* 1. HIGH-CONTRAST CANVAS: w-full aspect-square bg-white rounded-xl shadow-inner p-2 object-contain */}
          <div className="w-full aspect-square bg-white rounded-xl shadow-inner p-2 object-contain flex items-center justify-center overflow-hidden relative group border border-slate-200/80">
            <InteractiveStructureViewer
              structure={structure}
              activePharmacophoreIds={globalActivePharmacophores}
              hoveredPharmacophoreId={globalHoveredPharmacophoreId}
              onTogglePharmacophore={() => {}}
              onHoverPharmacophore={() => {}}
              maxHeightClass="max-h-full"
              altText={`${structure.name} 2D chemical structure`}
              isExpanded={true}
            />

            {onInspectStructure && (
              <button
                type="button"
                onClick={() => onInspectStructure(structure)}
                className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-900/90 text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center gap-1 shadow-md cursor-pointer"
                title="Inspect in PubChem Inspector"
              >
                <Search className="w-3 h-3" />
                <span>Inspect</span>
              </button>
            )}
          </div>

          {/* 2. STAT GRID: Compact badges/pills for Formula, Molecular Wt, LogP, Drug State, CID, Target */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Formula Pill */}
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Formula</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 truncate">
                {structure.pubchemAudit?.molecularFormula || '—'}
              </span>
            </div>

            {/* Molecular Weight Pill */}
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Molecular Wt</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 truncate">
                {(structure.mw ?? structure.pubchemAudit?.molecularWeight)
                  ? `${structure.mw ?? structure.pubchemAudit?.molecularWeight} g/mol`
                  : '—'}
              </span>
            </div>

            {/* LogP Pill */}
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">LogP</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 truncate">
                {(structure.logP !== undefined && structure.logP !== null)
                  ? structure.logP
                  : (structure.pubchemAudit?.xlogp !== undefined && structure.pubchemAudit?.xlogp !== null)
                  ? structure.pubchemAudit.xlogp
                  : '—'}
              </span>
            </div>

            {/* Drug State Pill */}
            <div className="px-2.5 py-1.5 rounded-lg bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">Drug State</span>
              <span className="font-bold text-purple-900 dark:text-purple-200 truncate">
                {structure.drug_state || 'Active Drug'}
              </span>
            </div>

            {/* CID Pill */}
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>PubChem CID</span>
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {structure.cid ? `CID ${structure.cid}` : 'Unresolved'}
                </span>
                {structure.cid && (
                  <a
                    href={`https://pubchem.ncbi.nlm.nih.gov/compound/${structure.cid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-blue-600"
                    title="Open on PubChem"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Target & Reversibility Pill */}
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Target</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 truncate" title={`${structure.target} (${structure.reversibility})`}>
                {structure.target} ({structure.reversibility})
              </span>
            </div>
          </div>

          {/* 3. COLLAPSE SMILES: Collapsible <details className="text-sm"> and <summary> element */}
          {structure.pubchemAudit?.canonicalSmiles && (
            <details className="text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-2 group/smiles">
              <summary className="text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none hover:text-slate-900 dark:hover:text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>View Canonical SMILES</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400 group-open/smiles:hidden">
                  (Click to expand)
                </span>
              </summary>
              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2">
                <code className="text-[10px] font-mono block break-all text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-800 select-all flex-1">
                  {structure.pubchemAudit.canonicalSmiles}
                </code>
                <button
                  type="button"
                  onClick={() =>
                    handleCopySmiles(
                      structure.pubchemAudit!.canonicalSmiles!,
                      copyKeySuffix
                    )
                  }
                  className="px-2 py-1 text-[10px] font-bold rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 shrink-0 cursor-pointer transition-colors"
                  title="Copy Canonical SMILES"
                >
                  {copiedKey === copyKeySuffix ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Copied</span>
                    </span>
                  ) : (
                    <span>Copy</span>
                  )}
                </button>
              </div>
            </details>
          )}

          {/* Chemical Class & MOA Rationale */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1">
            <div className="text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Class: </span>
              <span>{structure.chemicalClass}</span>
            </div>
            {(structure.moa_summary || structure.sar_rationale || structure.sarNotes) && (
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed italic">
                "{structure.moa_summary || structure.sar_rationale || structure.sarNotes}"
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Comparator Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              <ArrowRightLeft className="w-4 h-4" />
            </span>
            <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Side-by-Side Chemical Structure &amp; Attribute Comparator
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Contrast 2D structures, molecular properties, bioactivation pathways, and PK parameters
          </p>
        </div>

        {/* Action Controls & Layout Switches */}
        <div className="flex items-center gap-2 flex-wrap">
          {onSwapDrugs && (
            <button
              type="button"
              onClick={onSwapDrugs}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Swap Compound A and Compound B"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Swap</span>
            </button>
          )}

          {/* Layout Toggle */}
          <div className="flex items-center rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-0.5">
            <button
              type="button"
              onClick={() => setLayout('side-by-side')}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                layout === 'side-by-side'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Side-by-Side Columns"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Columns</span>
            </button>
            <button
              type="button"
              onClick={() => setLayout('stacked')}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                layout === 'stacked'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Stacked Rows"
            >
              <Rows className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Stacked</span>
            </button>
          </div>

          {onExpandStudio && (
            <button
              type="button"
              onClick={onExpandStudio}
              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              title="Expand Comparator to Fullscreen Studio with Zoom &amp; Pharmacophore Mapping"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fullscreen Studio</span>
            </button>
          )}
        </div>
      </div>

      {/* Side-by-Side vs Stacked Comparator Cards */}
      <div
        className={`grid gap-4 ${
          layout === 'side-by-side' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {renderSingleComparatorCard(structureA, 'Compound A', drugAKey, onSelectDrugA, 'a')}
        {renderSingleComparatorCard(structureB, 'Compound B', drugBKey, onSelectDrugB, 'b')}
      </div>

      {/* Contrast Summary Footer */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
        <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Key Pharmacophore &amp; PK/PD Contrast:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
            <span className="font-bold text-slate-900 dark:text-slate-100 block mb-0.5">
              {structureA.name}:
            </span>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              {structureA.moa_summary || structureA.sar_rationale || structureA.sarNotes}
            </p>
          </div>
          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
            <span className="font-bold text-slate-900 dark:text-slate-100 block mb-0.5">
              {structureB.name}:
            </span>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              {structureB.moa_summary || structureB.sar_rationale || structureB.sarNotes}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StructureComparator;
