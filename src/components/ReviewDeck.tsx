import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getHydratedDrugs, HydratedDrug } from '../db/medChemGraphDb';
import { StructureComparator } from './StructureComparator';
import { SmilesCanvas } from './SmilesCanvas';
import { DocumentQuestionItem } from './DocumentQuestionItem';
import { AntiplateletQuestion } from '../types/reviewModule';
import {
  Layers,
  FlaskConical,
  Search,
  ChevronDown,
} from 'lucide-react';

/**
 * Predefined palette mapping to index for simultaneous multi-pharmacophore tag selection:
 * Blue (#2563eb), Green (#16a34a), Amber (#d97706), Red (#dc2626), Purple, Cyan, Pink
 */
export interface ReviewDeckProps {
  initialDrugId?: string;
  onInspectStructure?: (drug: HydratedDrug) => void;
  className?: string;
  questions?: AntiplateletQuestion[];
}

/**
 * ReviewDeck Component:
 * - Enterprise Graph Hydration via getHydratedDrugs() (eliminating Cartesian Explosions and Orphaned Nodes)
 * - Directly maps UI matrix fields to hydrated data (drug.target.name, drug.clinicalClass.name)
 * - Renders StructureComparator as the primary horizontal workspace
 * - Horizontal Structure Vignette directly below contrast section and above questions
 */
export const ReviewDeck: React.FC<ReviewDeckProps> = ({
  initialDrugId,
  onInspectStructure,
  className = '',
  questions = [],
}) => {
  // TanStack Query: Fetch hydrated, deduplicated drugs from Graph Hydration Layer
  const {
    data: drugs = [],
    isLoading,
    error,
    refetch,
  } = useQuery<HydratedDrug[]>({
    queryKey: ['hydratedDrugs'],
    queryFn: getHydratedDrugs,
  });

  // Ref to smoothly scroll back to the StructureComparator from sticky portals
  const comparatorRef = useRef<HTMLDivElement>(null);

  // Selected drugs for Compound A and Compound B visual structure inspection
  const [selectedDrugAId, setSelectedDrugAId] = useState<string>(initialDrugId || '');
  const [selectedDrugBId, setSelectedDrugBId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterTarget, setFilterTarget] = useState<string>('all');
  const [isMatrixOpen, setIsMatrixOpen] = useState<boolean>(false);

  // Selected Compound A drug object resolution
  const selectedDrugA = useMemo(() => {
    if (!drugs.length) return null;
    if (selectedDrugAId) {
      const match = drugs.find(
        (d) =>
          d.id.toLowerCase() === selectedDrugAId.toLowerCase() ||
          String(d.cid) === selectedDrugAId ||
          d.name.toLowerCase() === selectedDrugAId.toLowerCase()
      );
      if (match) return match;
    }
    return drugs[0];
  }, [drugs, selectedDrugAId]);

  // Selected Compound B drug object resolution
  const selectedDrugB = useMemo(() => {
    if (drugs.length < 2) return null;
    if (selectedDrugBId) {
      const match = drugs.find(
        (d) =>
          d.id.toLowerCase() === selectedDrugBId.toLowerCase() ||
          String(d.cid) === selectedDrugBId ||
          d.name.toLowerCase() === selectedDrugBId.toLowerCase()
      );
      if (match) return match;
    }
    return drugs[1];
  }, [drugs, selectedDrugBId]);

  // Backwards compatibility alias for single-drug contexts
  const selectedDrug = selectedDrugA;

  // Synchronize initial selections if not set
  useEffect(() => {
    if (!selectedDrugAId && drugs.length > 0) {
      setSelectedDrugAId(drugs[0].id || drugs[0].name);
    }
    if (!selectedDrugBId && drugs.length > 1) {
      setSelectedDrugBId(drugs[1].id || drugs[1].name);
    }
  }, [drugs, selectedDrugAId, selectedDrugBId]);

  // Dynamic filter options
  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    drugs.forEach((d) => {
      const className = d.clinicalClass?.name || d.chemical_class || d.chemicalClass;
      if (className) set.add(className);
    });
    return Array.from(set).sort();
  }, [drugs]);

  const availableTargets = useMemo(() => {
    const set = new Set<string>();
    drugs.forEach((d) => {
      const targetName = d.target?.name || d.target_receptor;
      if (targetName) set.add(targetName);
    });
    return Array.from(set).sort();
  }, [drugs]);

  // Filtered matrix rows
  const filteredDrugs = useMemo(() => {
    return drugs.filter((drug) => {
      const targetName = drug.target?.name || '';
      const className = drug.clinicalClass?.name || '';

      if (filterClass !== 'all' && className !== filterClass) return false;
      if (filterTarget !== 'all' && targetName !== filterTarget) return false;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = drug.name.toLowerCase().includes(query);
        const matchesTarget = targetName.toLowerCase().includes(query);
        const matchesClass = className.toLowerCase().includes(query);
        const matchesCid = String(drug.cid || '').includes(query);
        if (!matchesName && !matchesTarget && !matchesClass && !matchesCid) return false;
      }

      return true;
    });
  }, [drugs, filterClass, filterTarget, searchTerm]);

  // Identify drugs relevant to the currently displayed questions
  const relevantDrugs = useMemo(() => {
    if (!questions || questions.length === 0) {
      return drugs;
    }
    const referencedNames = new Set<string>();
    const referencedIds = new Set<string>();
    const referencedCids = new Set<number>();

    questions.forEach((q) => {
      if (q.structuresDisplayed) {
        q.structuresDisplayed.forEach((s) => {
          if (s.name) referencedNames.add(s.name.toLowerCase().trim());
          if (s.id) referencedIds.add(s.id.toLowerCase().trim());
          if (s.document_label) referencedIds.add(s.document_label.toLowerCase().trim());
          if (s.cid) referencedCids.add(s.cid);
        });
      }
      if (q.referenced_structures) {
        q.referenced_structures.forEach((ref) => {
          if (ref) referencedIds.add(ref.toLowerCase().trim());
        });
      }
      if (q.displayed_structure_entity_ids) {
        q.displayed_structure_entity_ids.forEach((id) => {
          if (id) referencedIds.add(id.toLowerCase().trim());
        });
      }
      if (q.hide_drug_name_show_structure_for) {
        const hides = Array.isArray(q.hide_drug_name_show_structure_for)
          ? q.hide_drug_name_show_structure_for
          : [q.hide_drug_name_show_structure_for];
        hides.forEach((h) => {
          if (h) referencedNames.add(h.toLowerCase().trim());
        });
      }
    });

    const matched = drugs.filter((drug) => {
      const dName = drug.name.toLowerCase().trim();
      const dId = drug.id.toLowerCase().trim();
      const dCid = drug.cid;
      return (
        referencedNames.has(dName) ||
        referencedIds.has(dId) ||
        (dCid && referencedCids.has(dCid)) ||
        Array.from(referencedNames).some((n) => dName.includes(n) || n.includes(dName))
      );
    });

    return matched.length > 0 ? matched : drugs;
  }, [drugs, questions]);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-sm font-semibold text-slate-500 animate-pulse">
        Hydrating drug graph entities and relationships...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-rose-600 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800">
        <p className="font-bold">Error loading hydrated drug deck.</p>
        <p className="text-xs mt-1 text-slate-600 dark:text-slate-400">
          {(error as Error)?.message || 'Unknown database error'}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-rose-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. Header & Quick Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 text-balance">
              <span>Hydrated Medicinal Chemistry Review Deck</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-mono font-normal">
                {drugs.length} unique drugs
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive 2D Structure Comparison with Multi-Pharmacophore Highlighting &amp; Differential Matrix.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Primary Horizontal Workspace: StructureComparator */}
      <div ref={comparatorRef} id="structure-comparator-section">
        <StructureComparator
          drugs={drugs}
          drugAKey={selectedDrugA?.name || selectedDrugA?.id}
          drugBKey={selectedDrugB?.name || selectedDrugB?.id}
          onSelectDrugA={(key) => setSelectedDrugAId(key)}
          onSelectDrugB={(key) => setSelectedDrugBId(key)}
          viewMode={relevantDrugs.length === 1 ? 'single' : 'auto'}
        />
      </div>

      {/* 2.5 Responsive Structure Vignette (Directly below Contrast section & above Questions) */}
      {relevantDrugs.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          {relevantDrugs.map((drug, index) => {
            const isA =
              selectedDrugA?.id === drug.id ||
              selectedDrugA?.name === drug.name ||
              (selectedDrugA?.cid && selectedDrugA.cid === drug.cid);
            const isB =
              selectedDrugB?.id === drug.id ||
              selectedDrugB?.name === drug.name ||
              (selectedDrugB?.cid && selectedDrugB.cid === drug.cid);

            return (
              <div
                key={`deck-vignette-${drug.id || drug.name || index}`}
                className={`flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-800/60 border rounded-xl shadow-xs transition-all select-none ${
                  isA
                    ? 'border-blue-500/80 ring-2 ring-blue-500/30 bg-blue-50/20 dark:bg-blue-950/20'
                    : isB
                    ? 'border-indigo-500/80 ring-2 ring-indigo-500/30 bg-indigo-50/20 dark:bg-indigo-950/20'
                    : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <span
                  className="font-bold text-xs sm:text-sm text-center text-slate-900 dark:text-slate-100 mb-2 truncate max-w-[160px] text-balance"
                  title={drug.name}
                >
                  {drug.name}
                </span>
                <div className="w-[160px] h-[160px] bg-[var(--structure-canvas-bg)] dark:bg-slate-900 rounded-md flex items-center justify-center overflow-hidden border border-slate-200/60 dark:border-slate-700/50">
                  <SmilesCanvas
                    smiles={drug.smiles || drug.canonicalSmiles || drug.structure?.canonicalSmiles || drug.structure?.smiles}
                    molBlock={drug.structure?.pubchemMolBlock}
                    fallbackImageUrl={drug.structure?.pngUrl}
                    width={160}
                    height={160}
                    altText={drug.name}
                  />
                </div>

                {/* [A] and [B] Selector Squares */}
                <div className="flex items-center justify-center gap-2 mt-2.5 w-full pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDrugAId(drug.name || drug.id);
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                      isA
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-xs font-extrabold'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40'
                    }`}
                    title={`Set ${drug.name} as Compound A`}
                    aria-label={`Set ${drug.name} as Compound A`}
                  >
                    A
                  </button>
                  {drugs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDrugBId(drug.name || drug.id);
                      }}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                        isB
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-xs font-extrabold'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
                      }`}
                      title={`Set ${drug.name} as Compound B`}
                      aria-label={`Set ${drug.name} as Compound B`}
                    >
                      B
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Questions mapping block */}
      {questions && questions.length > 0 && (
        <div className="space-y-4 pt-1">
          {questions.map((q, qIndex) => (
            <DocumentQuestionItem
              key={`q-${q.id || qIndex}`}
              question={q}
              isOpen={false}
              onToggle={() => {}}
            />
          ))}
        </div>
      )}

      {/* 3. Hydrated Matrix Table (100% Deduplicated, Zero Cartesian Explosions) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsMatrixOpen((prev) => !prev)}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            aria-expanded={isMatrixOpen}
            aria-label="Toggle Head-to-Head Differential Matrix Table"
          >
            <FlaskConical className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>Medicinal Chemistry Hydrated Matrix Table</span>
              <span className="text-xs text-slate-400 font-mono font-normal">
                ({filteredDrugs.length} of {drugs.length} drugs)
              </span>
            </h3>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-transform duration-200 ${
                isMatrixOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Collapsible Content */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isMatrixOpen
              ? 'block opacity-100'
              : 'hidden h-0 overflow-hidden opacity-0 pointer-events-none'
          }`}
        >
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs pb-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search drug, target, or CID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 sm:w-56"
              />
            </div>

            {/* Clinical Class Filter */}
            {availableClasses.length > 0 && (
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all">All Classes ({availableClasses.length})</option>
                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            )}

            {/* Target Filter */}
            {availableTargets.length > 0 && (
              <select
                value={filterTarget}
                onChange={(e) => setFilterTarget(e.target.value)}
                className="py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all">All Targets ({availableTargets.length})</option>
                {availableTargets.map((tgt) => (
                  <option key={tgt} value={tgt}>
                    {tgt}
                  </option>
                ))}
              </select>
            )}
          </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                <th className="py-2.5 px-3 whitespace-nowrap">Drug Name</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Target Receptor (Hydrated)</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Clinical Class (Hydrated)</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Reversibility</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Route</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Onset</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Half-Life</th>
                <th className="py-2.5 px-3 whitespace-nowrap min-w-[200px]">Bioactivation / SAR</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredDrugs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-xs text-slate-500 italic">
                    No drugs match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDrugs.map((drug) => {
                  const isA =
                    selectedDrugA?.id === drug.id ||
                    selectedDrugA?.name === drug.name ||
                    (selectedDrugA?.cid && drug.cid && selectedDrugA.cid === drug.cid);
                  const isB =
                    selectedDrugB?.id === drug.id ||
                    selectedDrugB?.name === drug.name ||
                    (selectedDrugB?.cid && drug.cid && selectedDrugB.cid === drug.cid);
                  const isCurrent = isA || isB;
                  return (
                    <tr
                      key={drug.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                        isA
                          ? 'bg-blue-50/50 dark:bg-blue-950/30 font-medium'
                          : isB
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/30 font-medium'
                          : ''
                      }`}
                    >
                      {/* Drug Name & CID */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{drug.name}</span>
                          {drug.cid ? (
                            <span className="text-[10px] font-mono text-slate-400 font-normal">
                              (CID: {drug.cid})
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Target Receptor (drug.target.name) */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {drug.target?.name || 'N/A'}
                        </span>
                      </td>

                      {/* Clinical Class (drug.clinicalClass.name) */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="text-slate-800 dark:text-slate-200">
                          {drug.clinicalClass?.name || 'N/A'}
                        </span>
                      </td>

                      {/* Reversibility */}
                      <td className="py-2.5 px-3 whitespace-nowrap font-medium">
                        {drug.reversibility || (drug as any).binding_reversibility || 'Reversible'}
                      </td>

                      {/* Route */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        {drug.route || drug.route_of_admin || 'Oral'}
                      </td>

                      {/* Onset */}
                      <td className="py-2.5 px-3 whitespace-nowrap font-mono">
                        {drug.onset || drug.pkPdHighlights?.onset || 'Rapid'}
                      </td>

                      {/* Half Life */}
                      <td className="py-2.5 px-3 whitespace-nowrap font-mono">
                        {drug.half_life || drug.pkPdHighlights?.halfLife || 'Variable'}
                      </td>

                      {/* Bioactivation / SAR */}
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {drug.bioactivation ||
                          drug.pkPdHighlights?.bioactivation ||
                          drug.clinical_and_sar_summary ||
                          'Active drug'}
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDrugAId(drug.name || drug.id);
                              if (onInspectStructure) onInspectStructure(drug);
                              comparatorRef.current?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            title={`Select ${drug.name} as Compound A`}
                            className={`w-6 h-6 rounded flex items-center justify-center text-xs font-black transition-colors ${
                              isA
                                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700'
                            }`}
                          >
                            A
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDrugBId(drug.name || drug.id);
                              if (onInspectStructure) onInspectStructure(drug);
                              comparatorRef.current?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            title={`Select ${drug.name} as Compound B`}
                            className={`w-6 h-6 rounded flex items-center justify-center text-xs font-black transition-colors ${
                              isB
                                ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700'
                            }`}
                          >
                            B
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDeck;
