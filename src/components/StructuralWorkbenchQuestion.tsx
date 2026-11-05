import React, { useState, useId } from 'react';
import {
  AntiplateletQuestion,
  StructuralWorkbenchAnswer,
  StructuralWorkbenchData,
  WorkbenchHaloTarget,
} from '../types/reviewModule';
import { SmilesCanvas } from './SmilesCanvas';
import { evaluateWorkbenchAnswer } from '../utils/workbenchEvaluator';
import {
  normWorkbenchX,
  normWorkbenchY,
  normWorkbenchRadius,
} from '../utils/workbenchCoordinates';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Layers,
  FlaskConical,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  MousePointerClick,
} from 'lucide-react';

export interface StructuralWorkbenchQuestionProps {
  question: AntiplateletQuestion;
  workbenchData: StructuralWorkbenchData;
  onAnswer?: (score: number, answerData: StructuralWorkbenchAnswer) => void;
  savedAnswer?: StructuralWorkbenchAnswer;
  examMode?: boolean;
  isSubmitted?: boolean;
  isOpenAnswerKey?: boolean;
}

export const StructuralWorkbenchQuestion: React.FC<StructuralWorkbenchQuestionProps> = ({
  question,
  workbenchData,
  onAnswer,
  savedAnswer,
  examMode = false,
  isSubmitted = false,
  isOpenAnswerKey = false,
}) => {
  const [activeStepTab, setActiveStepTab] = useState<'2a' | '2b' | '2c'>('2a');
  const [selectedAmides, setSelectedAmides] = useState<string[]>(
    savedAnswer?.selectedAmideIds || []
  );
  const [selectedMoieties, setSelectedMoieties] = useState<string[]>(
    savedAnswer?.selectedMoietyIds || []
  );
  const [dropAssignments, setDropAssignments] = useState<Record<string, string>>(
    savedAnswer?.dropZoneAssignments || {}
  );
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    savedAnswer?.selectedCandidateId || null
  );

  // Tap-to-assign fallback state for touch / mobile
  const [activeSelectedBadge, setActiveSelectedBadge] = useState<string | null>(null);
  const [draggedBadge, setDraggedBadge] = useState<string | null>(null);
  const [hoveredHaloId, setHoveredHaloId] = useState<string | null>(null);
  const [isRationaleExpanded, setIsRationaleExpanded] = useState<boolean>(isOpenAnswerKey);

  const glowFilterId = useId();

  // Answer state object
  const currentAnswer: StructuralWorkbenchAnswer = {
    selectedAmideIds: selectedAmides,
    selectedMoietyIds: selectedMoieties,
    dropZoneAssignments: dropAssignments,
    selectedCandidateId: selectedCandidate,
    submittedAt: new Date().toISOString(),
  };

  const evaluation = evaluateWorkbenchAnswer(workbenchData, currentAnswer);
  const showFeedback = !examMode || isSubmitted;

  // Broadcast score when answer state changes
  const notifyAnswer = (
    nextAmides: string[],
    nextMoieties: string[],
    nextDrops: Record<string, string>,
    nextCandidate: string | null
  ) => {
    const nextAnswer: StructuralWorkbenchAnswer = {
      selectedAmideIds: nextAmides,
      selectedMoietyIds: nextMoieties,
      dropZoneAssignments: nextDrops,
      selectedCandidateId: nextCandidate,
      submittedAt: new Date().toISOString(),
    };
    const nextEval = evaluateWorkbenchAnswer(workbenchData, nextAnswer);
    if (onAnswer) {
      onAnswer(nextEval.totalScore, nextAnswer);
    }
  };

  // Step 2a: Toggle Amide Halo
  const toggleAmideTarget = (targetId: string) => {
    if (isSubmitted && examMode) return;
    const next = selectedAmides.includes(targetId)
      ? selectedAmides.filter((id) => id !== targetId)
      : [...selectedAmides, targetId];
    setSelectedAmides(next);
    notifyAnswer(next, selectedMoieties, dropAssignments, selectedCandidate);
  };

  // Step 2b: Toggle Moiety Halo
  const toggleMoietyTarget = (targetId: string) => {
    if (isSubmitted && examMode) return;
    const next = selectedMoieties.includes(targetId)
      ? selectedMoieties.filter((id) => id !== targetId)
      : [...selectedMoieties, targetId];
    setSelectedMoieties(next);
    notifyAnswer(selectedAmides, next, dropAssignments, selectedCandidate);
  };

  // Step 2c: Badge Assignment
  const handleAssignBadge = (zoneId: string, badge: string) => {
    if (isSubmitted && examMode) return;
    const next = { ...dropAssignments, [zoneId]: badge };
    setDropAssignments(next);
    setActiveSelectedBadge(null);
    notifyAnswer(selectedAmides, selectedMoieties, next, selectedCandidate);
  };

  const handleClearDropzone = (zoneId: string) => {
    if (isSubmitted && examMode) return;
    const next = { ...dropAssignments };
    delete next[zoneId];
    setDropAssignments(next);
    notifyAnswer(selectedAmides, selectedMoieties, next, selectedCandidate);
  };

  // Step 2d: Select Active Form Candidate
  const handleSelectCandidate = (candidateId: string) => {
    if (isSubmitted && examMode) return;
    const next = selectedCandidate === candidateId ? null : candidateId;
    setSelectedCandidate(next);
    notifyAnswer(selectedAmides, selectedMoieties, dropAssignments, next);
  };

  // Reset all workbench interactions
  const handleReset = () => {
    if (isSubmitted && examMode) return;
    setSelectedAmides([]);
    setSelectedMoieties([]);
    setDropAssignments({});
    setSelectedCandidate(null);
    setActiveSelectedBadge(null);
    notifyAnswer([], [], {}, null);
  };

  // Drag and drop handlers for 2c
  const handleDragStart = (e: React.DragEvent, badge: string) => {
    setDraggedBadge(badge);
    e.dataTransfer.setData('text/plain', badge);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    const badge = e.dataTransfer.getData('text/plain') || draggedBadge;
    if (badge) {
      handleAssignBadge(zoneId, badge);
    }
    setDraggedBadge(null);
  };

  // Count metrics for header
  const correctAmidesCount = workbenchData.step2a_amides.targets.filter((t) => t.isCorrect).length;
  const correctMoietiesCount = workbenchData.step2b_moieties.targets.filter((t) => t.isCorrect).length;

  // Auto-normalize coordinates using centralized workbenchCoordinates utility
  // Projects percentage or absolute inputs properly into 880x320 SVG canvas within safe margins
  const normX = normWorkbenchX;
  const normY = normWorkbenchY;
  const normRadius = normWorkbenchRadius;

  const isLidocaine =
    workbenchData.stemStructure.id === 'lidocaine_stem' ||
    workbenchData.stemStructure.name?.toLowerCase().includes('lidocaine') ||
    Boolean(workbenchData.instructions && workbenchData.instructions.toLowerCase().includes('lidocaine'));

  return (
    <div className="w-full space-y-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 sm:p-6 shadow-sm transition-all">
      {/* ------------------------------------------------------------------ */}
      {/* 1. WORKBENCH HEADER & SUB-STEP TAB CONTROLS                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/70 px-2.5 py-0.5 rounded-full">
              <FlaskConical className="w-3 h-3" />
              Medicinal Chemistry Structural Workbench
            </span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              4 Points Total
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-2">
            <span>{workbenchData.stemStructure.name}</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              (CID: {workbenchData.stemStructure.cid})
            </span>
          </h2>
        </div>

        {/* Live Score Tally (Study Mode or Post-Submission) & Reset */}
        <div className="flex items-center gap-2 shrink-0">
          {showFeedback && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Score:</span>
              <span
                className={`text-sm font-mono font-bold ${
                  evaluation.totalScore === 4
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : evaluation.totalScore > 0
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {evaluation.totalScore}/4 pts
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitted && examMode}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. SUB-STEP TOOL TABS (2a, 2b, 2c)                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 text-xs">
            <button
              type="button"
              onClick={() => setActiveStepTab('2a')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeStepTab === '2a'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>2a. Amide Bonds</span>
              {showFeedback && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    evaluation.score2a === 1
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-400/30 text-current'
                  }`}
                >
                  {evaluation.score2a}/1 pt
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveStepTab('2b')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeStepTab === '2b'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>2b. Prodrug Moieties</span>
              {showFeedback && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    evaluation.score2b === 1
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-400/30 text-current'
                  }`}
                >
                  {evaluation.score2b}/1 pt
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveStepTab('2c')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeStepTab === '2c'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>2c. Drag &amp; Drop Nature</span>
              {showFeedback && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    evaluation.score2c === 1
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-400/30 text-current'
                  }`}
                >
                  {evaluation.score2c}/1 pt
                </span>
              )}
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>Interactive: Click halos or drag badges onto the molecule below</span>
          </div>
        </div>

        {/* Step Instructions Banner */}
        <div
          className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 transition-colors ${
            activeStepTab === '2a'
              ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60 text-blue-950 dark:text-blue-100'
              : activeStepTab === '2b'
              ? 'bg-purple-50/70 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/60 text-purple-950 dark:text-purple-100'
              : 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/60 text-indigo-950 dark:text-indigo-100'
          }`}
        >
          <div className="p-1 rounded-md bg-white/80 dark:bg-slate-800/80 shrink-0 mt-0.5">
            <Layers className="w-4 h-4 text-current" />
          </div>
          <div className="flex-1">
            <div className="font-bold">
              {activeStepTab === '2a' && workbenchData.step2a_amides.title}
              {activeStepTab === '2b' && workbenchData.step2b_moieties.title}
              {activeStepTab === '2c' && workbenchData.step2c_nature.title}
            </div>
            <div className="mt-0.5 opacity-90">
              {activeStepTab === '2a' && workbenchData.step2a_amides.prompt}
              {activeStepTab === '2b' && workbenchData.step2b_moieties.prompt}
              {activeStepTab === '2c' && workbenchData.step2c_nature.prompt}
            </div>
          </div>
          <div className="font-mono text-[11px] font-bold shrink-0 self-center px-2 py-0.5 rounded bg-white/80 dark:bg-slate-800/80">
            {activeStepTab === '2a' &&
              `${selectedAmides.length}/${correctAmidesCount} Selected`}
            {activeStepTab === '2b' &&
              `${selectedMoieties.length}/${correctMoietiesCount} Selected`}
            {activeStepTab === '2c' &&
              `${Object.keys(dropAssignments).length}/${workbenchData.step2c_nature.dropZones.length} Assigned`}
          </div>
        </div>

        {/* DRAGGABLE BADGE BANK (Shown during Step 2c) */}
        {activeStepTab === '2c' && (
          <div className="p-3 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-900 dark:text-indigo-200">
              <span>Functional Group Badges:</span>
              <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                Drag onto a dropzone or tap a badge, then tap a dropzone
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {workbenchData.step2c_nature.badgeBank.map((badge) => {
                const isSelectedForTap = activeSelectedBadge === badge;
                return (
                  <button
                    key={badge}
                    type="button"
                    draggable
                    onDragStart={(e) => handleDragStart(e, badge)}
                    onClick={() =>
                      setActiveSelectedBadge(isSelectedForTap ? null : badge)
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-grab active:cursor-grabbing transition-all border ${
                      isSelectedForTap
                        ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-400/50 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="text-sm">🏷️</span>
                    <span>{badge}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 3. MAIN CHEMICAL CANVAS: VECTOR SCHEMATIC & CLICKABLE HALOS       */}
        {/* ------------------------------------------------------------------ */}
        <div className="relative w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-[var(--structure-canvas-bg,#ffffff)] p-2 sm:p-4 overflow-hidden shadow-inner">
          <svg
            viewBox="0 0 880 320"
            className="w-full h-auto max-h-[340px] select-none"
            style={{ touchAction: 'manipulation' }}
          >
            <defs>
              <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* ========================================================== */}
            {/* 3A. STEP 2a AMIDE HALOS (Shown during 2a)                  */}
            {/* ========================================================== */}
            {activeStepTab === '2a' &&
              workbenchData.step2a_amides.targets.map((target) => {
                const isSelected = selectedAmides.includes(target.id);
                const isHovered = hoveredHaloId === target.id;
                let stroke = '#94a3b8';
                let fill = 'transparent';

                if (isSelected) {
                  if (showFeedback) {
                    stroke = target.isCorrect ? '#10b981' : '#f43f5e';
                    fill = target.isCorrect
                      ? 'rgba(16, 185, 129, 0.22)'
                      : 'rgba(244, 63, 94, 0.22)';
                  } else {
                    stroke = '#2563eb';
                    fill = 'rgba(37, 99, 235, 0.22)';
                  }
                } else if (isHovered) {
                  stroke = '#3b82f6';
                  fill = 'rgba(59, 130, 246, 0.1)';
                }

                const cx = normX(target.x);
                const cy = normY(target.y);
                const r = normRadius(target.radius, 32);

                return (
                  <g
                    key={target.id}
                    onClick={() => toggleAmideTarget(target.id)}
                    onMouseEnter={() => setHoveredHaloId(target.id)}
                    onMouseLeave={() => setHoveredHaloId(null)}
                    className="cursor-pointer transition-all"
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={isSelected ? 3 : 2}
                      strokeDasharray={isSelected ? 'none' : '5,4'}
                      filter={isSelected ? `url(#${glowFilterId})` : undefined}
                    />
                    <text
                      x={cx}
                      y={cy + r + 16}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="700"
                      fill={
                        isSelected
                          ? showFeedback && target.isCorrect
                            ? '#059669'
                            : showFeedback
                            ? '#e11d48'
                            : '#2563eb'
                          : '#64748b'
                      }
                    >
                      {target.label}
                    </text>
                  </g>
                );
              })}

            {/* ========================================================== */}
            {/* 3B. STEP 2b PRODRUG MOIETY HALOS (Shown during 2b)          */}
            {/* ========================================================== */}
            {activeStepTab === '2b' &&
              workbenchData.step2b_moieties.targets.map((target) => {
                const isSelected = selectedMoieties.includes(target.id);
                const isHovered = hoveredHaloId === target.id;
                let stroke = '#94a3b8';
                let fill = 'transparent';

                if (isSelected) {
                  if (showFeedback) {
                    stroke = target.isCorrect ? '#10b981' : '#f43f5e';
                    fill = target.isCorrect
                      ? 'rgba(16, 185, 129, 0.22)'
                      : 'rgba(244, 63, 94, 0.22)';
                  } else {
                    stroke = '#8b5cf6';
                    fill = 'rgba(139, 92, 246, 0.22)';
                  }
                } else if (isHovered) {
                  stroke = '#8b5cf6';
                  fill = 'rgba(139, 92, 246, 0.1)';
                }

                const cx = normX(target.x);
                const cy = normY(target.y);
                const rx = normRadius(target.radius ? target.radius * 1.3 : 70);
                const ry = normRadius(target.radius || 50);

                return (
                  <g
                    key={target.id}
                    onClick={() => toggleMoietyTarget(target.id)}
                    onMouseEnter={() => setHoveredHaloId(target.id)}
                    onMouseLeave={() => setHoveredHaloId(null)}
                    className="cursor-pointer transition-all"
                  >
                    <ellipse
                      cx={cx}
                      cy={cy}
                      rx={rx}
                      ry={ry}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={isSelected ? 3 : 2}
                      strokeDasharray={isSelected ? 'none' : '6,4'}
                      filter={isSelected ? `url(#${glowFilterId})` : undefined}
                    />
                    <text
                      x={cx}
                      y={cy + ry + 16}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="700"
                      fill={
                        isSelected
                          ? showFeedback && target.isCorrect
                            ? '#059669'
                            : showFeedback
                            ? '#e11d48'
                            : '#7c3aed'
                          : '#64748b'
                      }
                    >
                      {target.label}
                    </text>
                  </g>
                );
              })}

            {/* ========================================================== */}
            {/* 3C. STEP 2c DROPZONES (Shown during 2c)                    */}
            {/* ========================================================== */}
            {activeStepTab === '2c' &&
              workbenchData.step2c_nature.dropZones.map((zone) => {
                const assignedBadge = dropAssignments[zone.id];
                const isCorrect = assignedBadge === zone.correctBadge;
                const canAcceptTap = !!activeSelectedBadge;
                const zx = normX(zone.x);
                const zy = normY(zone.y);

                return (
                  <g
                    key={zone.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, zone.id)}
                    onClick={() => {
                      if (activeSelectedBadge) {
                        handleAssignBadge(zone.id, activeSelectedBadge);
                      } else if (assignedBadge) {
                        handleClearDropzone(zone.id);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {/* Zone Boundary Box */}
                    <rect
                      x={zx - 70}
                      y={zy - 24}
                      width="140"
                      height="46"
                      rx="10"
                      fill={
                        assignedBadge
                          ? showFeedback && isCorrect
                            ? '#ecfdf5'
                            : showFeedback
                            ? '#fff1f2'
                            : '#eff6ff'
                          : canAcceptTap
                          ? '#fdf4ff'
                          : '#ffffff'
                      }
                      stroke={
                        assignedBadge
                          ? showFeedback && isCorrect
                            ? '#10b981'
                            : showFeedback
                            ? '#f43f5e'
                            : '#3b82f6'
                          : canAcceptTap
                          ? '#c084fc'
                          : '#94a3b8'
                      }
                      strokeWidth={assignedBadge || canAcceptTap ? 2.5 : 2}
                      strokeDasharray={assignedBadge ? 'none' : '5,4'}
                    />

                    {/* Zone Content Text */}
                    {assignedBadge ? (
                      <g>
                        <text
                          x={zx}
                          y={zy + 4}
                          textAnchor="middle"
                          fontSize="12"
                          fontWeight="700"
                          fill={
                            showFeedback && isCorrect
                              ? '#065f46'
                              : showFeedback
                              ? '#9f1239'
                              : '#1e40af'
                          }
                        >
                          🏷️ {assignedBadge}
                        </text>
                        <text
                          x={zx}
                          y={zy + 35}
                          textAnchor="middle"
                          fontSize="9"
                          fill="#94a3b8"
                        >
                          (click to remove)
                        </text>
                      </g>
                    ) : (
                      <g>
                        <text
                          x={zx}
                          y={zy - 2}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="700"
                          fill="#475569"
                        >
                          {zone.label}
                        </text>
                        <text
                          x={zx}
                          y={zy + 12}
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="600"
                          fill={canAcceptTap ? '#9333ea' : '#94a3b8'}
                        >
                          {canAcceptTap ? 'Tap to place badge' : 'Drop badge here'}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

            {/* ========================================================== */}
            {/* 3D. CHEMICAL BONDS & ATOMS SCHEMATIC                       */}
            {/* ========================================================== */}
            {isLidocaine ? (
              <g className="transition-opacity duration-300">
                {/* 2,6-Dimethylphenyl (Xylyl) Ring centered at ~211, 144 */}
                <polygon
                  points="175,144 193,113 229,113 247,144 229,175 193,175"
                  fill="none"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                {/* Inner aromatic circle */}
                <circle
                  cx="211"
                  cy="144"
                  r="20"
                  fill="none"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="1.5"
                  strokeDasharray="4,3"
                />
                {/* C2-Methyl (top-right ortho) */}
                <line
                  x1="229"
                  y1="113"
                  x2="245"
                  y2="85"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <text
                  x="250"
                  y="80"
                  fontFamily="monospace"
                  fontSize="12"
                  fontWeight="bold"
                  fill="var(--structure-bond-stroke, #334155)"
                >
                  CH₃
                </text>
                {/* C6-Methyl (bottom-right ortho) */}
                <line
                  x1="229"
                  y1="175"
                  x2="245"
                  y2="203"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <text
                  x="250"
                  y="215"
                  fontFamily="monospace"
                  fontSize="12"
                  fontWeight="bold"
                  fill="var(--structure-bond-stroke, #334155)"
                >
                  CH₃
                </text>
                {/* Para-H indication at left (175, 144) */}
                <line
                  x1="175"
                  y1="144"
                  x2="155"
                  y2="144"
                  stroke="var(--structure-bond-stroke, #94a3b8)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <text
                  x="142"
                  y="148"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="11"
                  fill="#94a3b8"
                >
                  H
                </text>

                {/* C1 to Amide NH Link */}
                <line
                  x1="247"
                  y1="144"
                  x2="280"
                  y2="144"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <text
                  x="295"
                  y="149"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#2563eb"
                >
                  NH
                </text>

                {/* NH to Carbonyl Carbon */}
                <line
                  x1="312"
                  y1="144"
                  x2="355"
                  y2="144"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Carbonyl Double Bond C=O */}
                <line
                  x1="352"
                  y1="142"
                  x2="352"
                  y2="108"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2"
                />
                <line
                  x1="358"
                  y1="142"
                  x2="358"
                  y2="108"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2"
                />
                <text
                  x="355"
                  y="100"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#dc2626"
                >
                  O
                </text>

                {/* Carbonyl to Alpha Methylene (-CH2-) */}
                <line
                  x1="355"
                  y1="144"
                  x2="480"
                  y2="144"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <text
                  x="485"
                  y="149"
                  fontFamily="monospace"
                  fontSize="13"
                  fontWeight="bold"
                  fill="var(--structure-bond-stroke, #334155)"
                >
                  -CH₂-
                </text>

                {/* Methylene to Tertiary Amine N at ~640 */}
                <line
                  x1="525"
                  y1="144"
                  x2="635"
                  y2="144"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="651"
                  cy="144"
                  r="14"
                  fill="rgba(37, 99, 235, 0.08)"
                  stroke="#2563eb"
                  strokeWidth="1.5"
                />
                <text
                  x="651"
                  y="149"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="15"
                  fontWeight="bold"
                  fill="#2563eb"
                >
                  N
                </text>

                {/* Ethyl Branch 1 (Up-Right) */}
                <line
                  x1="665"
                  y1="138"
                  x2="705"
                  y2="115"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="705"
                  y1="115"
                  x2="745"
                  y2="115"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <text
                  x="755"
                  y="120"
                  fontFamily="monospace"
                  fontSize="13"
                  fontWeight="bold"
                  fill="var(--structure-bond-stroke, #334155)"
                >
                  CH₂CH₃
                </text>

                {/* Ethyl Branch 2 (Down-Right) */}
                <line
                  x1="665"
                  y1="150"
                  x2="705"
                  y2="173"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="705"
                  y1="173"
                  x2="745"
                  y2="173"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <text
                  x="755"
                  y="178"
                  fontFamily="monospace"
                  fontSize="13"
                  fontWeight="bold"
                  fill="var(--structure-bond-stroke, #334155)"
                >
                  CH₂CH₃
                </text>
              </g>
            ) : (
              <g className="transition-opacity duration-300">
                {/* Left Prodrug Moiety: Ethyl Ester */}
                <text
                  x="60"
                  y="165"
                  fontFamily="monospace"
                  fontSize="14"
                  fontWeight="bold"
                  fill="var(--structure-bond-stroke, #334155)"
                >
                  H₃C-CH₂-O
                </text>
                <line
                  x1="140"
                  y1="160"
                  x2="175"
                  y2="160"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Ester Carbonyl */}
                <line
                  x1="172"
                  y1="158"
                  x2="172"
                  y2="135"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2"
                />
                <line
                  x1="178"
                  y1="158"
                  x2="178"
                  y2="135"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2"
                />
                <text
                  x="175"
                  y="130"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#dc2626"
                >
                  O
                </text>

                {/* Linker to Central Pyridine */}
                <line
                  x1="175"
                  y1="160"
                  x2="225"
                  y2="160"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="225"
                  y1="160"
                  x2="255"
                  y2="140"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Pyridine Ring */}
                <polygon
                  points="255,140 285,120 315,140 315,175 285,195 255,175"
                  fill="none"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <text
                  x="285"
                  y="132"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="13"
                  fontWeight="bold"
                  fill="#2563eb"
                >
                  N
                </text>

                {/* Central Tertiary Amide Bond (2a Target 1) */}
                <line
                  x1="315"
                  y1="155"
                  x2="340"
                  y2="155"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <line
                  x1="337"
                  y1="153"
                  x2="337"
                  y2="130"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2"
                />
                <line
                  x1="343"
                  y1="153"
                  x2="343"
                  y2="130"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2"
                />
                <text
                  x="340"
                  y="125"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#dc2626"
                >
                  O
                </text>
                <line
                  x1="340"
                  y1="155"
                  x2="368"
                  y2="155"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <text
                  x="375"
                  y="160"
                  fontFamily="monospace"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#2563eb"
                >
                  N(CH₃)
                </text>

                {/* Benzimidazole Fused Core */}
                <line
                  x1="420"
                  y1="155"
                  x2="450"
                  y2="155"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                />
                {/* 6-ring */}
                <polygon
                  points="450,155 475,135 505,135 520,155 505,175 475,175"
                  fill="none"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                {/* 5-ring fused */}
                <polygon
                  points="520,155 540,140 560,155 540,170"
                  fill="none"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <text
                  x="540"
                  y="142"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#2563eb"
                >
                  N
                </text>

                {/* Benzamidine & Hexyl Carbamate (Right Side) */}
                <line
                  x1="560"
                  y1="155"
                  x2="600"
                  y2="155"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                />
                {/* Phenyl Linker */}
                <polygon
                  points="600,155 615,135 640,135 655,155 640,175 615,175"
                  fill="none"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />

                {/* Amidine & Carbamate Linkage (2a Target 2) */}
                <line
                  x1="655"
                  y1="155"
                  x2="675"
                  y2="155"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                />
                <text
                  x="685"
                  y="145"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#2563eb"
                >
                  =NH
                </text>
                <text
                  x="685"
                  y="165"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="13"
                  fontWeight="bold"
                  fill="#2563eb"
                >
                  NH
                </text>

                {/* Carbamate Carbonyl */}
                <line
                  x1="695"
                  y1="160"
                  x2="720"
                  y2="160"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                />
                <line
                  x1="717"
                  y1="158"
                  x2="717"
                  y2="135"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2"
                />
                <line
                  x1="723"
                  y1="158"
                  x2="723"
                  y2="135"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2"
                />
                <text
                  x="720"
                  y="125"
                  textAnchor="middle"
                  fontFamily="monospace"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#dc2626"
                >
                  O
                </text>

                {/* Hexyloxy Chain */}
                <line
                  x1="720"
                  y1="160"
                  x2="745"
                  y2="160"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                />
                <text
                  x="755"
                  y="165"
                  fontFamily="monospace"
                  fontSize="13"
                  fontWeight="bold"
                  fill="#dc2626"
                >
                  O
                </text>
                <line
                  x1="765"
                  y1="160"
                  x2="785"
                  y2="160"
                  stroke="var(--structure-bond-stroke, #475569)"
                  strokeWidth="2.5"
                />
                <text
                  x="815"
                  y="165"
                  fontFamily="monospace"
                  fontSize="13"
                  fontWeight="bold"
                  fill="var(--structure-bond-stroke, #334155)"
                >
                  -(CH₂)₅CH₃
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. BOTTOM SECTION: STEP 2d ACTIVE FORM STRUCTURE SELECTION        */}
      {/* ------------------------------------------------------------------ */}
      <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>{workbenchData.step2d_activeForm.title}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {workbenchData.step2d_activeForm.prompt}
            </p>
          </div>

          {showFeedback && (
            <span
              className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                evaluation.score2d === 1
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              Step 2d: {evaluation.score2d}/1 pt
            </span>
          )}
        </div>

        {/* 4 Structure Candidate Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {workbenchData.step2d_activeForm.candidates.map((candidate, idx) => {
            const isSelected = selectedCandidate === candidate.id;
            const letter = String.fromCharCode(65 + idx);

            let cardBorder =
              'border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-400 dark:hover:border-slate-600';

            if (isSelected) {
              if (showFeedback) {
                cardBorder = candidate.isCorrect
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/25'
                  : 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 ring-2 ring-rose-500/25';
              } else {
                cardBorder =
                  'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/25';
              }
            } else if (isSubmitted && showFeedback && candidate.isCorrect) {
              cardBorder =
                'border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20';
            }

            return (
              <div
                key={candidate.id}
                onClick={() => handleSelectCandidate(candidate.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${cardBorder}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                      Option {letter}
                    </span>
                    {isSelected && (
                      <span className="text-[11px] font-mono font-bold flex items-center gap-1 text-blue-600 dark:text-blue-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selected
                      </span>
                    )}
                  </div>

                  {/* Candidate Structure Canvas */}
                  <div className="relative w-full aspect-[4/3] rounded-lg border border-slate-200 dark:border-slate-700 bg-[var(--structure-canvas-bg,#ffffff)] p-1 flex items-center justify-center overflow-hidden">
                    <SmilesCanvas
                      smiles={candidate.smiles}
                      width={240}
                      height={150}
                      altText={`Candidate ${letter}: ${candidate.name}`}
                      className="w-full h-full bg-transparent border-0 shadow-none pointer-events-none"
                    />
                  </div>

                  <div className="mt-2 text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                    {candidate.name}
                  </div>
                </div>

                {/* Candidate Classification Tag */}
                <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-mono">
                  <span
                    className={`px-1.5 py-0.5 rounded font-semibold ${
                      candidate.classification === 'active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : candidate.classification === 'intermediate'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {candidate.classification === 'active'
                      ? 'Active Drug'
                      : candidate.classification === 'intermediate'
                      ? 'Prodrug Intermediate'
                      : 'Degradation Fragment'}
                  </span>
                  {candidate.cid && (
                    <span className="text-slate-500 dark:text-slate-400">
                      CID: {candidate.cid}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 5. SOLUTION & BIOACTIVATION RATIONALE ACCORDION                     */}
      {/* ------------------------------------------------------------------ */}
      {showFeedback && (
        <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setIsRationaleExpanded(!isRationaleExpanded)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Comprehensive Medicinal Chemistry &amp; Bioactivation Rationale</span>
            </div>
            {isRationaleExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {isRationaleExpanded && (
            <div className="mt-3 space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs">
              {/* Overall Explanation */}
              <div className="leading-relaxed text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-slate-100 block mb-1">
                  Bioreversible Double Prodrug Strategy:
                </strong>
                {question.overallExplanation}
              </div>

              {/* High Yield Pearl */}
              {question.highYieldPearl && (
                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                  <span className="font-bold mr-1">High-Yield Pearl:</span>
                  {question.highYieldPearl}
                </div>
              )}

              {/* Step-by-Step Rationale Table */}
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 mt-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                      <th className="py-2 px-3">Step</th>
                      <th className="py-2 px-3">Key Feature</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Pharmacophore &amp; Bioactivation Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                    <tr>
                      <td className="py-2 px-3 font-mono font-bold">2a</td>
                      <td className="py-2 px-3">Tertiary Amide &amp; Carbamate</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Genuine
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                        Tertiary methylamide connects core to pyridine; carbamate linkage is an
                        amide-like bioisostere masking the amidine.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono font-bold">2b</td>
                      <td className="py-2 px-3">Ethyl Ester &amp; Hexyl Carbamate</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                          Prodrug
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                        Both masking groups neutralize charge to permit passive intestinal
                        absorption, converting a zwitterion into a lipophilic prodrug.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono font-bold">2c</td>
                      <td className="py-2 px-3">Ester vs. Carbamate Cleavage</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                          Enzymatic
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                        Ester is cleaved by hepatic CES1; carbamate is cleaved by gut CES2 to release
                        carbon dioxide and hexanol.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono font-bold">2d</td>
                      <td className="py-2 px-3">Dabigatran Active Zwitterion</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          Active Form
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                        Fully unmasked amidine forms a salt bridge with Asp189 in thrombin S1 pocket;
                        unmasked carboxylic acid forms essential polar interactions.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
