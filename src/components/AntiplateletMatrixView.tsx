import React, { useState } from 'react';
import {
  antiplateletComparisonMatrix,
  antiplateletStructures,
  ChemicalStructure,
} from '../data/antiplateletQuizData';
import { StructureLightboxModal } from './StructureLightboxModal';
import { StructureComparator } from './StructureComparator';
import {
  Search,
  ExternalLink,
  FlaskConical,
} from 'lucide-react';
import { ColorPaletteItem } from '../utils/pharmacophoreData';

export interface AntiplateletMatrixViewProps {
  onInspectStructure?: (structure: ChemicalStructure) => void;
  globalActivePharmacophores?: Record<string, ColorPaletteItem>;
  globalHoveredPharmacophoreId?: string | null;
  focusMatchingOnly?: boolean;
  onOpenPharmacophoreExplorer?: () => void;
  pharmacophoreCount?: number;
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

export const AntiplateletMatrixView: React.FC<AntiplateletMatrixViewProps> = ({
  onInspectStructure,
  globalActivePharmacophores = {},
  globalHoveredPharmacophoreId = null,
  focusMatchingOnly = false,
  onOpenPharmacophoreExplorer,
  pharmacophoreCount,
}) => {
  const [filterClass, setFilterClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Side-by-side comparative tool state
  const [drugA, setDrugA] = useState<string>('prasugrel');
  const [drugB, setDrugB] = useState<string>('clopidogrel');
  const [isExpandedStudioOpen, setIsExpandedStudioOpen] = useState<boolean>(false);

  const allStructuresList = React.useMemo(() => Object.values(antiplateletStructures), []);

  const filteredRows = antiplateletComparisonMatrix.filter((row) => {
    const matchesSearch =
      row.drug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.chemicalClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.pharmacologicalTarget.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.keySarPearl.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterClass === 'all') return true;
    if (filterClass === 'thienopyridines') return row.chemicalClass.toLowerCase().includes('thienopyridine');
    if (filterClass === 'adp-analogues') return row.chemicalClass.toLowerCase().includes('nucleos') || row.chemicalClass.toLowerCase().includes('nucleot') || row.chemicalClass.toLowerCase().includes('triazolo');
    if (filterClass === 'gpiib-iiia') return row.pharmacologicalTarget.toLowerCase().includes('iib/iiia');
    if (filterClass === 'cox') return row.chemicalClass.toLowerCase().includes('salicylic');
    return true;
  });

  const structureA = antiplateletStructures[drugA] || antiplateletStructures.prasugrel;
  const structureB = antiplateletStructures[drugB] || antiplateletStructures.clopidogrel;

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
      {/* 2. Full Antiplatelet Comparison Matrix Table         */}
      {/* ---------------------------------------------------- */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Comprehensive Antiplatelet Medicinal Chemistry Matrix
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Correlated across targets, reversibility, bioactivation pathways, half-lives, and SAR pearls
            </p>
          </div>

          {/* Search, Filter Controls & Relocated Pharmacophore Explorer Button */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Relocated Pharmacophore Explorer Button */}
            {onOpenPharmacophoreExplorer && (
              <button
                type="button"
                onClick={onOpenPharmacophoreExplorer}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer hover:scale-102"
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

            {/* Search Box */}
            <div className="relative">
              <input
                id="matrix-search-input"
                name="matrixSearch"
                type="text"
                placeholder="Search drug, target, SAR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 pl-8 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
              <button
                onClick={() => setFilterClass('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filterClass === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterClass('thienopyridines')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filterClass === 'thienopyridines'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Thienopyridines
              </button>
              <button
                onClick={() => setFilterClass('adp-analogues')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filterClass === 'adp-analogues'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                ADP Analogues
              </button>
              <button
                onClick={() => setFilterClass('gpiib-iiia')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filterClass === 'gpiib-iiia'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Gp IIb/IIIa
              </button>
              <button
                onClick={() => setFilterClass('cox')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filterClass === 'cox'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                COX-1
              </button>
            </div>
          </div>
        </div>

        {/* Matrix Table with Sticky Column and Merged PK Parameters */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                {/* Sticky Left Column Header */}
                <th className="sticky left-0 z-20 bg-slate-50 dark:bg-slate-950 shadow-[2px_0_5px_rgba(0,0,0,0.5)] py-2.5 px-3 whitespace-nowrap">
                  Drug &amp; CID
                </th>
                <th className="py-2.5 px-3 whitespace-nowrap">Chemical Class</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Target &amp; Bond</th>
                {/* Merged Route / Onset and Duration into PK Parameters */}
                <th className="py-2.5 px-3 whitespace-nowrap">PK Parameters</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Bioactivation / Metabolism</th>
                <th className="py-2.5 px-3 whitespace-nowrap min-w-[220px]">Key MedChem / SAR Pearl</th>
                <th className="py-2.5 px-3 whitespace-nowrap min-w-[180px]">Black Box / Toxicity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredRows.map((row) => (
                <tr
                  key={row.drug}
                  className="hover:bg-indigo-950/20 transition-colors group"
                >
                  {/* Sticky First Column: Drug & CID */}
                  <td className="sticky left-0 z-10 bg-slate-950 shadow-[2px_0_5px_rgba(0,0,0,0.5)] py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap transition-colors">
                    <div className="flex items-center gap-1.5">
                      <span>{row.drug}</span>
                      <a
                        href={`https://pubchem.ncbi.nlm.nih.gov/compound/${row.cid}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
                        title="View on PubChem"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 block font-normal">
                      CID: {row.cid}
                    </span>
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
                        row.reversibility.includes('Irreversible')
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {row.reversibility}
                    </span>
                  </td>

                  {/* Merged PK Parameters Column (Route / Onset on top, Duration below) */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {row.route} · <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">Onset: {row.onset}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                      Duration: {row.duration}
                    </div>
                  </td>

                  {/* Color-Coded Bioactivation / Metabolism */}
                  <td className="py-2.5 px-3 text-[11px] max-w-xs leading-relaxed">
                    {renderBioactivationText(row.bioactivationPathway)}
                  </td>

                  {/* Key SAR Pearl */}
                  <td className="py-2.5 px-3 text-[11px] leading-relaxed">
                    {row.keySarPearl}
                  </td>

                  {/* Major Toxicity */}
                  <td className="py-2.5 px-3 text-[11px] text-rose-700 dark:text-rose-300 leading-snug">
                    {row.majorToxicityOrLimitation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Expanded Dual-Drug Comparator Studio Modal */}
      {isExpandedStudioOpen && (
        <StructureLightboxModal
          isOpen={isExpandedStudioOpen}
          onClose={() => setIsExpandedStudioOpen(false)}
          initialStructure={structureA}
          initialSecondaryStructure={structureB}
          initialCompareMode={true}
          comparisonPool={allStructuresList}
          onInspectPubChem={onInspectStructure}
        />
      )}
    </div>
  );
};

export const MedChemMatrix = AntiplateletMatrixView;
export default AntiplateletMatrixView;
