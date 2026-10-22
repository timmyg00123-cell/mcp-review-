import React, { useState, useMemo } from 'react';
import { ChemicalStructure } from '../types/reviewModule';
import {
  GlobalPharmacophore,
  GLOBAL_PHARMACOPHORES_CATALOG,
  checkStructureMatchesGlobalPharmacophore,
  PharmacophoreCategory,
} from '../utils/globalPharmacophores';
import {
  ColorPaletteItem,
  PHARMACOPHORE_COLOR_PALETTE,
} from '../utils/pharmacophoreData';
import {
  FlaskConical,
  X,
  Search,
  Filter,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Check,
  CheckCircle2,
  Layers,
  Info,
  Target,
  ShieldAlert,
  ArrowRight,
  Eye,
  Columns,
} from 'lucide-react';

interface PharmacophoreExplorerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  allModuleStructures: ChemicalStructure[];
  activeGlobalPharmacophores: Record<string, ColorPaletteItem>; // pharmacophoreId -> ColorPaletteItem
  onToggleGlobalPharmacophore: (pharmacophore: GlobalPharmacophore) => void;
  onClearAllGlobal: () => void;
  hoveredGlobalPharmacophoreId: string | null;
  onHoverGlobalPharmacophore: (id: string | null) => void;
  focusMatchingOnly: boolean;
  onToggleFocusMatchingOnly: () => void;
  onSelectDrugStructure?: (structure: ChemicalStructure) => void;
}

export const PharmacophoreExplorerSidebar: React.FC<
  PharmacophoreExplorerSidebarProps
> = ({
  isOpen,
  onClose,
  allModuleStructures,
  activeGlobalPharmacophores,
  onToggleGlobalPharmacophore,
  onClearAllGlobal,
  hoveredGlobalPharmacophoreId,
  onHoverGlobalPharmacophore,
  focusMatchingOnly,
  onToggleFocusMatchingOnly,
  onSelectDrugStructure,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PharmacophoreCategory>('all');
  const [scopeFilter, setScopeFilter] = useState<'module' | 'all'>('module');
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  const toggleDetails = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Pre-calculate matching drugs in the current module for each global pharmacophore
  const moduleMatchData = useMemo(() => {
    const map = new Map<
      string,
      { matchingStructures: ChemicalStructure[]; matchingIds: string[] }
    >();

    for (const gp of GLOBAL_PHARMACOPHORES_CATALOG) {
      const matching: ChemicalStructure[] = [];
      const ids: string[] = [];
      for (const s of allModuleStructures) {
        const { matches } = checkStructureMatchesGlobalPharmacophore(s, gp);
        if (matches) {
          matching.push(s);
          ids.push(s.id);
        }
      }
      map.set(gp.id, { matchingStructures: matching, matchingIds: ids });
    }
    return map;
  }, [allModuleStructures]);

  // Filtered catalog based on search, category, and scope
  const filteredPharmacophores = useMemo(() => {
    return GLOBAL_PHARMACOPHORES_CATALOG.filter((gp) => {
      const match = moduleMatchData.get(gp.id);
      const inCurrentModule = (match?.matchingStructures.length || 0) > 0;

      // Scope filter
      if (scopeFilter === 'module' && !inCurrentModule) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && gp.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = gp.name.toLowerCase().includes(q);
        const matchesFormula = gp.chemicalFormulaOrSymbol.toLowerCase().includes(q);
        const matchesDesc = gp.description.toLowerCase().includes(q);
        const matchesSar = gp.sarRationale.toLowerCase().includes(q);
        const matchesTarget = gp.commonTargets.some((t) => t.toLowerCase().includes(q));
        const matchesDrug = (match?.matchingStructures || []).some(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            (s.tradeName && s.tradeName.toLowerCase().includes(q))
        );
        const matchesKeywords = gp.matchKeywords.some((k) => k.toLowerCase().includes(q));

        if (
          !matchesName &&
          !matchesFormula &&
          !matchesDesc &&
          !matchesSar &&
          !matchesTarget &&
          !matchesDrug &&
          !matchesKeywords
        ) {
          return false;
        }
      }

      return true;
    });
  }, [scopeFilter, selectedCategory, searchQuery, moduleMatchData]);

  const activeCount = Object.keys(activeGlobalPharmacophores).length;

  const handleSelectTopModuleFeatures = () => {
    // Select top 3 pharmacophores present in this module with distinct colors
    const present = GLOBAL_PHARMACOPHORES_CATALOG.filter((gp) => {
      const data = moduleMatchData.get(gp.id);
      return (data?.matchingStructures.length || 0) > 0;
    }).slice(0, 4);

    onClearAllGlobal();
    present.forEach((gp) => onToggleGlobalPharmacophore(gp));
  };

  if (!isOpen) return null;

  return (
    <aside
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] lg:w-[450px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col font-sans animate-slideLeft select-none"
      aria-label="Pharmacophore Explorer Sidebar"
    >
      {/* ---------------------------------------------------- */}
      {/* 1. SIDEBAR HEADER                                    */}
      {/* ---------------------------------------------------- */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-start justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Pharmacophore Explorer
              </h2>
              {activeCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 animate-pulse">
                  {activeCount} Active
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Select pharmacophores to highlight across all module structures
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Close Pharmacophore Explorer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. SEARCH & SCOPE FILTER TOOLBAR                     */}
      {/* ---------------------------------------------------- */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2.5 bg-white dark:bg-slate-900 shrink-0">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
          <input
            id="pharmacophore-search-input"
            name="pharmacophoreSearch"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pharmacophore, formula, target..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-hidden transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ×
            </button>
          )}
        </div>

        {/* Scope Tabs: In Current Module vs All Global */}
        <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setScopeFilter('module')}
            className={`py-1 px-2 rounded-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              scopeFilter === 'module'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>In Current Module</span>
          </button>
          <button
            type="button"
            onClick={() => setScopeFilter('all')}
            className={`py-1 px-2 rounded-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              scopeFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Global Catalog</span>
          </button>
        </div>

        {/* Category Filter Badges */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] no-scrollbar">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'binding', label: 'Binding' },
              { id: 'prodrug', label: 'Prodrug' },
              { id: 'pk', label: 'PK & SAR' },
              { id: 'solubility', label: 'Solubility' },
              { id: 'stability', label: 'Stability' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2 py-0.5 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Quick Actions & Focus Matching Structures Toggle */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleSelectTopModuleFeatures}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              Select Top Features
            </button>
            {activeCount > 0 && (
              <>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <button
                  type="button"
                  onClick={onClearAllGlobal}
                  className="text-rose-600 dark:text-rose-400 hover:underline font-semibold cursor-pointer"
                >
                  Clear All ({activeCount})
                </button>
              </>
            )}
          </div>

          {/* Focus Matching Toggle */}
          <button
            type="button"
            onClick={onToggleFocusMatchingOnly}
            title="When active, dims drugs that do not possess the currently selected pharmacophores"
            className={`px-2 py-0.5 rounded border transition-colors flex items-center gap-1 cursor-pointer font-medium ${
              focusMatchingOnly
                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800'
                : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <Target className="w-3 h-3 text-amber-600" />
            <span>Focus Matching</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. ACTIVE HIGHLIGHTS STRIP (IF ANY ACTIVE)           */}
      {/* ---------------------------------------------------- */}
      {activeCount > 0 && (
        <div className="px-3 py-2 bg-blue-50/60 dark:bg-blue-950/30 border-b border-blue-200/60 dark:border-blue-900/40 text-xs shrink-0 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-blue-950 dark:text-blue-200">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Active Multi-Color Highlights across Module:</span>
            </span>
            <button
              onClick={onClearAllGlobal}
              className="text-slate-400 hover:text-slate-600 text-[10px] uppercase font-mono font-normal"
            >
              Reset
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(activeGlobalPharmacophores).map(([gpId, color]) => {
              const gp = GLOBAL_PHARMACOPHORES_CATALOG.find((g) => g.id === gpId);
              if (!gp) return null;
              return (
                <div
                  key={gpId}
                  className="px-2 py-0.5 rounded-full text-[11px] font-semibold text-white flex items-center gap-1.5 shadow-xs"
                  style={{ backgroundColor: color.pinBg }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>{gp.chemicalFormulaOrSymbol}</span>
                  <span className="font-normal opacity-90 truncate max-w-[120px]">
                    {gp.name.split('/')[0]}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleGlobalPharmacophore(gp);
                    }}
                    className="hover:opacity-75 cursor-pointer ml-0.5 text-xs font-bold"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. PHARMACOPHORE ITEM LIST                           */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800">
        {filteredPharmacophores.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 space-y-2">
            <p className="font-semibold text-slate-600 dark:text-slate-300">
              No pharmacophores found
            </p>
            <p>Try switching to &quot;All Global Catalog&quot; or clearing your search.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setScopeFilter('all');
              }}
              className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredPharmacophores.map((gp) => {
            const matchData = moduleMatchData.get(gp.id);
            const matchingCount = matchData?.matchingStructures.length || 0;
            const isPresentInModule = matchingCount > 0;
            const activeColor = activeGlobalPharmacophores[gp.id];
            const isSelected = Boolean(activeColor);
            const isHovered = hoveredGlobalPharmacophoreId === gp.id;
            const isExpanded = Boolean(expandedDetails[gp.id]);

            // Border styling
            let borderClass = 'border-slate-200 dark:border-slate-800';
            let bgClass = 'bg-white dark:bg-slate-900/90';

            if (isSelected && activeColor) {
              borderClass = activeColor.borderClass;
              bgClass = 'bg-blue-50/40 dark:bg-blue-950/20';
            } else if (isHovered) {
              borderClass = 'border-blue-400 dark:border-blue-600';
              bgClass = 'bg-slate-50 dark:bg-slate-800/60';
            }

            return (
              <div
                key={gp.id}
                onMouseEnter={() => onHoverGlobalPharmacophore(gp.id)}
                onMouseLeave={() => onHoverGlobalPharmacophore(null)}
                className={`pt-2.5 first:pt-0 transition-all rounded-xl p-3 border ${borderClass} ${bgClass} shadow-2xs hover:shadow-xs space-y-2 cursor-pointer`}
                onClick={() => onToggleGlobalPharmacophore(gp)}
              >
                {/* Header row: Formula badge, Name, Category, Checkbox */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    {/* Visual Checkbox with Active Color */}
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        isSelected && activeColor
                          ? 'border-transparent text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-transparent hover:border-blue-400'
                      }`}
                      style={{
                        backgroundColor: isSelected && activeColor ? activeColor.pinBg : undefined,
                      }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {gp.chemicalFormulaOrSymbol}
                        </span>
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100 leading-tight">
                          {gp.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                        {gp.description}
                      </p>
                    </div>
                  </div>

                  {/* Category Pill */}
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider ${
                      gp.category === 'binding'
                        ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300'
                        : gp.category === 'prodrug'
                        ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                        : gp.category === 'solubility'
                        ? 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300'
                        : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    {gp.category}
                  </span>
                </div>

                {/* Match indicator & Matching Drugs in Current Module */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {isPresentInModule ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Present in {matchingCount} drug{matchingCount > 1 ? 's' : ''}:</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        Not in current module
                      </span>
                    )}

                    {/* Quick Drug Pills that can be clicked to scroll to or inspect */}
                    {isPresentInModule &&
                      matchData?.matchingStructures.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectDrugStructure) onSelectDrugStructure(s);
                          }}
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                          title={`Click to view ${s.name}`}
                        >
                          {s.id}: {s.name}
                        </button>
                      ))}
                  </div>

                  {/* Expand / Collapse Rationale Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleDetails(gp.id, e)}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center gap-0.5 text-[11px] font-medium cursor-pointer"
                  >
                    <span>{isExpanded ? 'Less' : 'SAR'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                </div>

                {/* Expanded In-Depth Medicinal Chemistry / SAR Info */}
                {isExpanded && (
                  <div
                    className="pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs space-y-2 text-slate-700 dark:text-slate-300 animate-slideDown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div>
                      <strong className="block text-[10px] uppercase font-bold text-slate-400">
                        Biochemical &amp; SAR Rationale:
                      </strong>
                      <p className="leading-relaxed text-[11px] mt-0.5">
                        {gp.sarRationale}
                      </p>
                    </div>

                    <div>
                      <strong className="block text-[10px] uppercase font-bold text-slate-400">
                        Clinical &amp; PK Significance:
                      </strong>
                      <p className="leading-relaxed text-[11px] mt-0.5">
                        {gp.clinicalSignificance}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      <span className="text-[10px] font-bold text-slate-400">Targets:</span>
                      {gp.commonTargets.map((tgt, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        >
                          {tgt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 5. SIDEBAR FOOTER                                    */}
      {/* ---------------------------------------------------- */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between text-xs shrink-0">
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Tip: Hover over any tag to preview structure overlay
        </span>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </aside>
  );
};
