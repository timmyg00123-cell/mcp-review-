import React, { useEffect, useMemo, useRef } from 'react';
import {
  ALL_THERAPEUTIC_CLASS_NUMBERS,
  ORGAN_SYSTEM_CLUSTERS,
  computeContiguousSweep,
} from '../utils/therapeuticClassFilter';
import {
  THERAPEUTIC_CATEGORIES,
  type TherapeuticClassCategory,
} from '../data/topDrugsTaxonomyData';
import type { FlashcardItem } from '../types/cumulativeStudy';
import { X, GripVertical, CheckSquare, RotateCcw } from 'lucide-react';

export interface TherapeuticClassFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClassNumbers: Set<number>;
  onSelectionChange: (nextSelection: Set<number>) => void;
  categories?: TherapeuticClassCategory[];
  cards?: FlashcardItem[];
}

/**
 * Slide-over drawer for filtering Top 200 flashcards by the 39 standardized therapeutic classes.
 * Features a left-hand scrubber rail with pointer capture for contiguous drag-select / deselect,
 * single-class toggle checkboxes, drug count badges, and rapid organ-system cluster isolation.
 */
export const TherapeuticClassFilterDrawer: React.FC<TherapeuticClassFilterDrawerProps> = ({
  isOpen,
  onClose,
  selectedClassNumbers,
  onSelectionChange,
  categories,
  cards,
}) => {
  const listContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartIndexRef = useRef<number | null>(null);
  const lastHoveredNumRef = useRef<number | null>(null);
  const baseSelectionRef = useRef<Set<number>>(new Set());
  const targetStateRef = useRef<boolean>(true);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Ensure strict ascending 1-39 order
  const sortedCategories = useMemo(() => {
    const source =
      categories && categories.length > 0 ? categories : THERAPEUTIC_CATEGORIES;
    return [...source].sort((a, b) => a.classNumber - b.classNumber);
  }, [categories]);

  // Count cards per therapeutic class number if card deck is provided
  const drugCountsByClass = useMemo(() => {
    const counts = new Map<number, number>();
    if (cards && cards.length > 0) {
      for (const card of cards) {
        const num = card.structure?.therapeuticClassNumber;
        if (num !== undefined && num !== null && num >= 1 && num <= 39) {
          counts.set(num, (counts.get(num) ?? 0) + 1);
        }
      }
    }
    return counts;
  }, [cards]);

  const handleToggleClass = (classNumber: number) => {
    const next = new Set(selectedClassNumbers);
    if (next.has(classNumber)) {
      next.delete(classNumber);
    } else {
      next.add(classNumber);
    }
    onSelectionChange(next);
  };

  const handleRailPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    classNumber: number
  ) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    e.preventDefault();
    e.stopPropagation();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture fails in unsupported test environments
    }

    isDraggingRef.current = true;
    dragStartIndexRef.current = classNumber;
    lastHoveredNumRef.current = classNumber;
    baseSelectionRef.current = new Set(selectedClassNumbers);
    targetStateRef.current = !selectedClassNumbers.has(classNumber);

    const initial = computeContiguousSweep(
      classNumber,
      classNumber,
      baseSelectionRef.current,
      targetStateRef.current
    );
    onSelectionChange(initial);
  };

  const handleRailPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || dragStartIndexRef.current === null) return;

    e.preventDefault();

    // Auto-scroll container if pointer is within 40px of top or bottom
    if (listContainerRef.current) {
      const rect = listContainerRef.current.getBoundingClientRect();
      const topThreshold = rect.top + 40;
      const bottomThreshold = rect.bottom - 40;
      if (e.clientY < topThreshold) {
        const step = Math.max(2, Math.min(15, Math.round((topThreshold - e.clientY) / 2)));
        listContainerRef.current.scrollTop -= step;
      } else if (e.clientY > bottomThreshold) {
        const step = Math.max(2, Math.min(15, Math.round((e.clientY - bottomThreshold) / 2)));
        listContainerRef.current.scrollTop += step;
      }
    }

    // Determine target class number under pointer
    if (typeof document !== 'undefined' && typeof document.elementFromPoint === 'function') {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const rowEl = el?.closest?.('[data-class-number]');
      if (rowEl) {
        const rawVal = rowEl.getAttribute('data-class-number');
        const hoveredNum = rawVal ? Number(rawVal) : NaN;
        if (
          !isNaN(hoveredNum) &&
          hoveredNum >= 1 &&
          hoveredNum <= 39 &&
          hoveredNum !== lastHoveredNumRef.current
        ) {
          lastHoveredNumRef.current = hoveredNum;
          const next = computeContiguousSweep(
            dragStartIndexRef.current,
            hoveredNum,
            baseSelectionRef.current,
            targetStateRef.current
          );
          onSelectionChange(next);
        }
      }
    }
  };

  const handleRailPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignore if pointer capture already released
      }
      isDraggingRef.current = false;
      dragStartIndexRef.current = null;
      lastHoveredNumRef.current = null;
    }
  };

  const handleLostPointerCapture = () => {
    isDraggingRef.current = false;
    dragStartIndexRef.current = null;
    lastHoveredNumRef.current = null;
  };

  if (!isOpen) {
    return null;
  }

  const activeCount = selectedClassNumbers.size;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="therapeutic-filter-title"
    >
      <div
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col h-full shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900 shrink-0">
          <div className="flex items-center gap-2.5">
            <h2
              id="therapeutic-filter-title"
              className="text-base font-semibold text-white tracking-tight"
            >
              🎯 Filter Therapeutic Classes (1–39)
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {`${activeCount}/39 Active`}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar: Presets & Quick Actions */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/90 space-y-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectionChange(new Set(ALL_THERAPEUTIC_CLASS_NUMBERS))}
              className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Select All (1–39)</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectionChange(new Set())}
              className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Deselect All</span>
            </button>
          </div>

          <div>
            <div className="text-[11px] font-medium text-slate-400 mb-1.5 uppercase tracking-wider flex items-center justify-between">
              <span>Organ System Clusters (Isolate Mode)</span>
              <span className="text-[10px] text-slate-500">Tap to isolate</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {ORGAN_SYSTEM_CLUSTERS.map((cluster) => {
                const isClusterActive =
                  cluster.classNumbers.length === selectedClassNumbers.size &&
                  cluster.classNumbers.every((num) => selectedClassNumbers.has(num));

                let clusterTitle = cluster.label;
                if (cluster.key === 'cardio') clusterTitle = 'Cardio (10–15)';
                else if (cluster.key === 'cns') clusterTitle = 'CNS & Psych';
                else if (cluster.key === 'anti-infective') clusterTitle = 'Anti-Infective';
                else if (cluster.key === 'endocrine') clusterTitle = 'Endocrine / Metabolic';

                return (
                  <button
                    key={cluster.key}
                    type="button"
                    onClick={() => onSelectionChange(new Set(cluster.classNumbers))}
                    title={`Isolate ${cluster.label} (Classes ${cluster.classNumbers.join(', ')})`}
                    className={`py-1.5 px-2.5 rounded-lg text-xs font-medium border text-left transition-all truncate flex items-center justify-between ${
                      isClusterActive
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-xs'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:border-slate-600'
                    }`}
                  >
                    <span className="truncate">{clusterTitle}</span>
                    <span className="text-[10px] opacity-75 font-mono ml-1">
                      ({cluster.classNumbers.length})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scrollable list with Scrubber Rail */}
        <div
          ref={listContainerRef}
          className="flex-1 overflow-y-auto divide-y divide-slate-800/60"
        >
          {sortedCategories.map((cat) => {
            const isSelected = selectedClassNumbers.has(cat.classNumber);
            const drugCount =
              cards && cards.length > 0
                ? drugCountsByClass.get(cat.classNumber) ?? 0
                : cat.totalDrugs;

            return (
              <div
                key={cat.classNumber}
                data-class-number={cat.classNumber}
                className={`flex items-center select-none transition-colors ${
                  isSelected
                    ? 'bg-indigo-950/20 hover:bg-indigo-900/30'
                    : 'bg-slate-900/50 hover:bg-slate-800/40'
                }`}
              >
                {/* Left-hand Scrubber Drag Rail with pointer capture and touch-action: none */}
                <div
                  className="w-10 h-11 flex items-center justify-center cursor-ns-resize active:cursor-grabbing text-slate-500 hover:text-indigo-400 active:text-indigo-300 touch-none select-none bg-slate-800/30 hover:bg-indigo-900/30 transition-colors border-r border-slate-800/50 shrink-0"
                  style={{ touchAction: 'none' }}
                  title="Drag up or down to sweep select/deselect"
                  aria-label={`Scrub select range starting at class ${cat.classNumber}`}
                  onPointerDown={(e) => handleRailPointerDown(e, cat.classNumber)}
                  onPointerMove={handleRailPointerMove}
                  onPointerUp={handleRailPointerUp}
                  onPointerCancel={handleRailPointerUp}
                  onLostPointerCapture={handleLostPointerCapture}
                >
                  <GripVertical className="w-4 h-4 pointer-events-none opacity-60 hover:opacity-100" />
                </div>

                {/* Row Content: Checkbox, Name, Drug Count Badge */}
                <div
                  className="flex-1 flex items-center gap-3 px-3 py-2.5 cursor-pointer min-w-0"
                  onClick={() => handleToggleClass(cat.classNumber)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleToggleClass(cat.classNumber);
                    }}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer shrink-0"
                    aria-label={`Toggle ${cat.categoryName}`}
                  />
                  <span
                    className={`text-sm font-medium truncate flex-1 ${
                      isSelected ? 'text-indigo-200' : 'text-slate-300'
                    }`}
                  >
                    {cat.categoryName}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono shrink-0 ${
                      isSelected
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                    }`}
                  >
                    {`${drugCount} ${drugCount === 1 ? 'drug' : 'drugs'}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info banner */}
        <div className="p-2.5 border-t border-slate-800 bg-slate-900/90 text-[11px] text-slate-400 text-center shrink-0">
          Tip: Drag the left grip rail (⋮⋮) vertically to sweep-select or deselect a range.
        </div>
      </div>
    </div>
  );
};
