import React, { useState } from 'react';
import {
  AntiplateletQuestion,
  ChemicalStructure,
  MatchingTarget,
} from '../types/reviewModule';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Check,
  X,
} from 'lucide-react';

interface StructureDragDropMatchProps {
  question: AntiplateletQuestion;
  placements?: Record<string, string[]>;
  onPlacementsChange?: (next: Record<string, string[]>) => void;
  examModeActive?: boolean;
  onAllMatched?: () => void;
  isSolved?: boolean;
}

export const StructureDragDropMatch: React.FC<StructureDragDropMatchProps> = ({
  question,
  placements: controlledPlacements,
  onPlacementsChange,
  examModeActive = false,
  isSolved = false,
}) => {
  const masterStructures = question.structuresDisplayed || [];
  const structures = React.useMemo(() => {
    if (Array.isArray(question.referenced_structures) && question.referenced_structures.length > 0) {
      const refs = question.referenced_structures.map((r) => r.trim().toLowerCase());
      const filtered = masterStructures.filter((s) => {
        const idLower = (s.id || '').trim().toLowerCase();
        const docLabelLower = (s.document_label || '').trim().toLowerCase();
        const nameLower = (s.name || '').trim().toLowerCase();
        return refs.includes(idLower) || refs.includes(docLabelLower) || refs.includes(nameLower);
      });
      if (filtered.length > 0) return filtered;
    }
    return masterStructures;
  }, [question.referenced_structures, masterStructures]);
  const targets: MatchingTarget[] = (question.matchingTargets || (question as any).drop_zones || []) as MatchingTarget[];

  // Fallback internal state if uncontrolled
  const [internalPlacements, setInternalPlacements] = useState<Record<string, string[]>>({});
  const placements = controlledPlacements ?? internalPlacements;

  const updatePlacements = (
    updater: (prev: Record<string, string[]>) => Record<string, string[]>
  ) => {
    const next = updater(placements);
    if (onPlacementsChange) {
      onPlacementsChange(next);
    } else {
      setInternalPlacements(next);
    }
  };

  // Mobile / touch tap-to-select: ID of currently selected structure in tray
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>(null);

  // Active drag-over state for targets
  const [dragOverTargetId, setDragOverTargetId] = useState<string | null>(null);

  // Find structure by Roman numeral ID
  const getStructureById = (id: string): ChemicalStructure | undefined => {
    return structures.find((s) => s.id === id);
  };

  // List of all structure IDs currently placed in any target
  const placedStructureIds = Object.values(placements).flat();

  // Structures remaining in the unassigned tray
  const unassignedStructures = structures.filter(
    (s) => !placedStructureIds.includes(s.id)
  );

  // Check how many correct placements exist
  const totalRequiredPlacements = targets.reduce(
    (acc, t) => acc + t.acceptedStructureIds.length,
    0
  );

  const correctPlacementsCount = targets.reduce((acc, t) => {
    const placed = placements[t.id] || [];
    const correctHere = placed.filter((id) => t.acceptedStructureIds.includes(id)).length;
    return acc + correctHere;
  }, 0);

  const isCompleted =
    !examModeActive &&
    totalRequiredPlacements > 0 &&
    correctPlacementsCount === totalRequiredPlacements &&
    unassignedStructures.length === 0;

  const isLocked = Boolean(isSolved || isCompleted);

  // Handle Drag Start
  const handleDragStart = (e: React.DragEvent, structureId: string) => {
    if (isLocked) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', structureId);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle Drag Over
  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    if (isLocked) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverTargetId !== targetId) {
      setDragOverTargetId(targetId);
    }
  };

  // Handle Drag Leave
  const handleDragLeave = (targetId: string) => {
    if (dragOverTargetId === targetId) {
      setDragOverTargetId(null);
    }
  };

  // Core assignment logic
  const assignStructureToTarget = (structureId: string, targetId: string) => {
    if (isLocked) return;
    updatePlacements((prev) => {
      const next: Record<string, string[]> = {};
      Object.keys(prev).forEach((tKey) => {
        next[tKey] = prev[tKey].filter((id) => id !== structureId);
      });
      const currentList = next[targetId] || [];
      if (!currentList.includes(structureId)) {
        next[targetId] = [...currentList, structureId];
      }
      return next;
    });
    setSelectedStructureId(null);
    setDragOverTargetId(null);
  };

  // Handle Drop on Target
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    if (isLocked) return;
    e.preventDefault();
    const structureId = e.dataTransfer.getData('text/plain');
    if (structureId) {
      assignStructureToTarget(structureId, targetId);
    }
  };

  // Handle Click / Tap on Target (for tap-to-select mode)
  const handleTargetClick = (targetId: string) => {
    if (isLocked) return;
    if (selectedStructureId) {
      assignStructureToTarget(selectedStructureId, targetId);
    }
  };

  // Remove a placed structure back to the available tray
  const handleRemovePlaced = (structureId: string, e?: React.MouseEvent) => {
    if (isLocked) return;
    if (e) e.stopPropagation();
    updatePlacements((prev) => {
      const next: Record<string, string[]> = {};
      Object.keys(prev).forEach((tKey) => {
        next[tKey] = prev[tKey].filter((id) => id !== structureId);
      });
      return next;
    });
  };

  // Reset all placements
  const handleReset = () => {
    if (isLocked) return;
    updatePlacements(() => ({}));
    setSelectedStructureId(null);
    setDragOverTargetId(null);
  };

  // Solve / auto-fill correct matches
  const handleAutoSolve = () => {
    if (examModeActive || isLocked) return;
    const solved: Record<string, string[]> = {};
    targets.forEach((t) => {
      solved[t.id] = [...t.acceptedStructureIds];
    });
    updatePlacements(() => solved);
    setSelectedStructureId(null);
  };

  return (
    <div className="space-y-4 pt-1">
      {/* ------------------------------------------------------------------ */}
      {/* SIDE-BY-SIDE WORKSPACE: LIST ON LEFT, LINEAR CHIPS ON RIGHT        */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col md:flex-row items-stretch gap-3.5 lg:gap-5 flex-wrap lg:flex-nowrap">
        {/* ================================================================ */}
        {/* LEFT COLUMN: AUTHENTIC PDF LIST OF CLASSES WITH DROP SLOTS        */}
        {/* ================================================================ */}
        <div className="flex-1 w-full flex flex-col justify-between space-y-2">
          {targets.map((target) => {
            const placedHere = placements[target.id] || [];
            const isDragOver = dragOverTargetId === target.id;

            const hasPlacements = placedHere.length > 0;
            const allCorrectHere =
              hasPlacements &&
              placedHere.every((id) => target.acceptedStructureIds.includes(id));
            const hasIncorrectHere =
              hasPlacements &&
              placedHere.some((id) => !target.acceptedStructureIds.includes(id));
            const isCompleteMatchForTarget =
              allCorrectHere &&
              placedHere.length === target.acceptedStructureIds.length;

            let rowStyle =
              'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700';

            if (isDragOver) {
              rowStyle =
                'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-400/30';
            } else if (examModeActive) {
              if (hasPlacements) {
                rowStyle =
                  'border-blue-400 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-950/20';
              }
            } else if (isCompleteMatchForTarget) {
              rowStyle =
                'border-emerald-400 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20';
            } else if (hasIncorrectHere) {
              rowStyle =
                'border-rose-400 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20';
            } else if (hasPlacements) {
              rowStyle =
                'border-blue-300 dark:border-blue-800 bg-blue-50/20 dark:bg-blue-950/10';
            }

            return (
              <div
                key={target.id}
                id={`q${question.id || 'q'}-target-${target.id}`}
                onClick={() => handleTargetClick(target.id)}
                onDragOver={(e) => handleDragOver(e, target.id)}
                onDragLeave={() => handleDragLeave(target.id)}
                onDrop={(e) => handleDrop(e, target.id)}
                className={`py-2 px-3 sm:py-2.5 sm:px-3.5 rounded-xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${rowStyle}`}
              >
                {/* PDF Line Text: a) Class Name */}
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 shrink-0 min-w-[20px] pt-0.5">
                    {target.id})
                  </span>
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                      {target.label}
                    </div>
                    {/* Subtle distractor hint if placed (Study Mode only) */}
                    {!examModeActive &&
                      target.acceptedStructureIds.length === 0 &&
                      hasPlacements && (
                        <div className="text-[10px] text-rose-600 dark:text-rose-400 font-medium mt-0.5">
                          Distractor: None of the above structures belong to this class!
                        </div>
                      )}
                  </div>
                </div>

                {/* Drop Slot & Placed Chips */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {/* Status Badge */}
                  {!examModeActive && isCompleteMatchForTarget && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Matched</span>
                    </span>
                  )}

                  {!examModeActive && hasIncorrectHere && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/80 px-2 py-0.5 rounded-md">
                      <XCircle className="w-3 h-3 text-rose-600" />
                      <span>Incorrect</span>
                    </span>
                  )}

                  {examModeActive && hasPlacements && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 rounded-md">
                      <span>● Placed</span>
                    </span>
                  )}

                  {/* Placed Chips Container */}
                  <div
                    className={`min-h-[58px] min-w-[68px] p-1 rounded-lg flex items-center gap-1.5 border transition-colors flex-wrap ${
                      placedHere.length > 0
                        ? 'border-transparent bg-slate-100/70 dark:bg-slate-800/60'
                        : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                    }`}
                  >
                    {placedHere.length === 0 ? (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono italic px-2 text-center select-none">
                        Drop chip
                      </span>
                    ) : (
                      placedHere.map((sId) => {
                        const str = getStructureById(sId);
                        const isCorrect = target.acceptedStructureIds.includes(sId);
                        return (
                          <div
                            key={sId}
                            id={`q${question.id || 'q'}-target-${target.id}-chip-${sId}`}
                            onClick={(e) => handleRemovePlaced(sId, e)}
                            title={isLocked ? `Structure ${str?.document_label || sId} (Matched)` : `Structure ${str?.document_label || sId} (Click to remove)`}
                            className={`relative group ${isLocked ? 'cursor-default' : 'cursor-pointer'} w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] bg-white rounded-lg p-1 border shadow-xs transition-all duration-150 flex items-center justify-center ${
                              examModeActive
                                ? 'border-blue-500 ring-2 ring-blue-400/30'
                                : isCorrect
                                ? 'border-emerald-400 ring-2 ring-emerald-400/40'
                                : 'border-rose-400 ring-2 ring-rose-400/40 animate-pulse'
                            }`}
                          >
                            {/* Prominent Roman Numeral on Top-Right Corner */}
                            <span
                              className={`absolute -top-1 -right-1 z-10 font-mono font-black text-[10px] min-w-[18px] h-[18px] rounded flex items-center justify-center px-0.5 shadow-sm border ${
                                examModeActive
                                  ? 'bg-blue-600 text-white border-white dark:border-slate-900'
                                  : isCorrect
                                  ? 'bg-emerald-600 text-white border-white dark:border-slate-900'
                                  : 'bg-rose-600 text-white border-white dark:border-slate-900'
                              }`}
                            >
                              {str?.document_label || sId}
                            </span>

                            {/* Hover X remove overlay */}
                            {!isLocked && (
                              <div className="absolute inset-0 bg-slate-900/60 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                <X className="w-3.5 h-3.5" />
                              </div>
                            )}

                            {str?.pngUrl && (
                              <img
                                src={str.pngUrl}
                                alt={`Structure ${sId}`}
                                width="320"
                                height="320"
                                loading="lazy"
                                className="w-full h-full aspect-square object-contain pointer-events-none"
                              />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================================================================ */}
        {/* RIGHT COLUMN: 1x4 LINEAR CHIPS PROPORTIONALLY FLUSH WITH LIST     */}
        {/* ================================================================ */}
        <div className="w-full md:w-36 lg:w-40 shrink-0 flex flex-col justify-between bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          {/* Header of Tray */}
          <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-slate-200 dark:border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1">
              <span>Chips</span>
              <span className="font-mono font-normal text-slate-500 dark:text-slate-400 text-[10px]">
                ({unassignedStructures.length})
              </span>
            </span>

            {/* Quick Actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                disabled={placedStructureIds.length === 0}
                title="Reset all placed chips"
                className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 flex items-center gap-0.5 transition-colors px-1 py-0.5 rounded hover:bg-slate-200/60 dark:hover:bg-slate-700/60 cursor-pointer"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
              {!examModeActive && (
                <button
                  type="button"
                  onClick={handleAutoSolve}
                  title="Auto-fill correct placements"
                  className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 transition-colors px-1 py-0.5 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Solve</span>
                </button>
              )}
            </div>
          </div>

          {/* Touch Selection Active Banner (Compact) */}
          {selectedStructureId && (
            <div className="my-1 text-[10px] font-semibold text-blue-700 dark:text-blue-300 flex items-center justify-between bg-blue-100/70 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900/60 animate-fadeIn">
              <span className="truncate">
                Chip <strong>{selectedStructureId}</strong> active
              </span>
              <button
                type="button"
                onClick={() => setSelectedStructureId(null)}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 ml-1"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          )}

          {/* 1x4 Linear Structure Chips: Evenly Distributed & Proportional */}
          <div className="flex-1 flex flex-col justify-around gap-2 py-1 items-center">
            {unassignedStructures.length === 0 ? (
              <div className="text-center py-6 text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex flex-col items-center justify-center gap-1.5">
                <Check className="w-5 h-5" />
                <span>All chips assigned!</span>
              </div>
            ) : (
              unassignedStructures.map((structure) => {
                const isSelected = selectedStructureId === structure.id;
                return (
                  <div
                    key={structure.id}
                    id={`q${question.id || 'q'}-tray-chip-${structure.id}`}
                    draggable={!isLocked}
                    onDragStart={(e) => handleDragStart(e, structure.id)}
                    onClick={() => {
                      if (!isLocked) {
                        setSelectedStructureId(isSelected ? null : structure.id);
                      }
                    }}
                    title={isLocked ? `Structure ${structure.document_label || structure.id} (Locked)` : `Structure ${structure.document_label || structure.id} (Drag or click to place)`}
                    className={`relative group ${isLocked ? 'cursor-default opacity-60' : 'cursor-grab active:cursor-grabbing'} w-[64px] h-[64px] sm:w-[68px] sm:h-[68px] lg:w-[72px] lg:h-[72px] bg-white rounded-xl p-1.5 border shadow-xs transition-all duration-150 select-none flex items-center justify-center ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/50 ring-offset-2 scale-[1.04] shadow-md'
                        : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 hover:shadow-sm hover:scale-[1.02]'
                    }`}
                  >
                    {/* Roman Numeral Tag on Top-Right Corner Only */}
                    <span className="absolute -top-1.5 -right-1.5 z-10 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-mono font-black text-[10px] min-w-[20px] h-[20px] rounded flex items-center justify-center px-1 shadow-sm border border-white dark:border-slate-800">
                      {structure.document_label || structure.id}
                    </span>

                    {/* Pure 2D Chemical Structure Line Drawing (No text clutter) */}
                    <img
                      src={structure.pngUrl}
                      alt={`Structure ${structure.id}`}
                      width="320"
                      height="320"
                      className="w-full h-full aspect-square object-contain pointer-events-none filter drop-shadow-xs"
                      loading="lazy"
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* COMPLETION BANNER (Study Mode Only)                                */}
      {/* ------------------------------------------------------------------ */}
      {isCompleted && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">
              All structures successfully matched to their chemical &amp; pharmacological classes!
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            {correctPlacementsCount}/{totalRequiredPlacements} Matched
          </span>
        </div>
      )}
    </div>
  );
};
