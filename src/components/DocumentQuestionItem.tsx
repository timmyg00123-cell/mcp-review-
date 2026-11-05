import React, { useState } from 'react';
import { AntiplateletQuestion } from '../data/antiplateletQuizData';
import {
  ChemicalStructure,
  ExamModeStatus,
  RankingItem,
  StructuralWorkbenchAnswer,
} from '../types/reviewModule';
import { StructureDragDropMatch } from './StructureDragDropMatch';
import { StructureLightboxModal } from './StructureLightboxModal';
import { SmilesCanvas } from './SmilesCanvas';
import { StructuralWorkbenchQuestion } from './StructuralWorkbenchQuestion';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Check,
  X,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowUp,
  ArrowDown,
  ListOrdered,
  Lock,
  Edit3,
  Eye,
  EyeOff,
  ZoomIn,
  FlaskConical,
} from 'lucide-react';

import { ColorPaletteItem } from '../utils/pharmacophoreData';
import { maskDrugNamesForExam } from '../utils/maskDrugNames';
import {
  getChemicalClass,
  getTargetReceptor,
  getReversibility,
  getRouteOfAdmin,
} from '../utils/structureDataUtils';

interface DocumentQuestionItemProps {
  question: AntiplateletQuestion;
  questionIndex?: number;
  isOpen: boolean;
  onToggle: () => void;
  hideDrugNames?: boolean;
  examModeStatus?: ExamModeStatus;
  onInspectStructure?: (structure: ChemicalStructure) => void;
  allSectionStructures?: ChemicalStructure[];
  allModuleStructures?: ChemicalStructure[];
  globalActivePharmacophores?: Record<string, ColorPaletteItem>;
  globalHoveredPharmacophoreId?: string | null;
  focusMatchingOnly?: boolean;
  // Controlled session answer props
  mcSelection?: number | null;
  onMcSelect?: (optIdx: number | null) => void;
  tfAnswers?: Record<string, boolean>;
  onTfSelect?: (nextTf: Record<string, boolean>) => void;
  matchingPlacements?: Record<string, string[]>;
  onMatchingChange?: (nextMatch: Record<string, string[]>) => void;
  rankingOrder?: string[];
  onRankingChange?: (nextOrder: string[]) => void;
  rankingChecked?: boolean;
  onRankingCheck?: (checked: boolean) => void;
  onEditQuestion?: (question: AntiplateletQuestion) => void;
  workbenchAnswer?: StructuralWorkbenchAnswer;
  onWorkbenchAnswerChange?: (answer: StructuralWorkbenchAnswer, score: number) => void;
}

const DocumentQuestionItemComponent: React.FC<DocumentQuestionItemProps> = ({
  question,
  questionIndex,
  isOpen,
  onToggle,
  hideDrugNames = false,
  examModeStatus = 'off',
  onInspectStructure,
  allSectionStructures,
  allModuleStructures,
  globalActivePharmacophores = {},
  globalHoveredPharmacophoreId = null,
  focusMatchingOnly = false,
  mcSelection: controlledMc,
  onMcSelect,
  tfAnswers: controlledTf,
  onTfSelect,
  matchingPlacements,
  onMatchingChange,
  rankingOrder: controlledRanking,
  onRankingChange,
  rankingChecked: controlledRankingChecked,
  onRankingCheck,
  onEditQuestion,
  workbenchAnswer,
  onWorkbenchAnswerChange,
}) => {
  const examModeActive = examModeStatus === 'active';
  const showFeedback = examModeStatus !== 'active';

  // Fallback internal states if uncontrolled
  const [internalTf, setInternalTf] = useState<Record<string, boolean>>({});
  const [internalMc, setInternalMc] = useState<number | null>(null);
  const [internalRanking, setInternalRanking] = useState<string[]>(() =>
    (question.rankingItems || []).map((item) => item.id)
  );
  const [internalRankingChecked, setInternalRankingChecked] = useState<boolean>(false);

  // Question chip selection and completion states
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(examModeStatus === 'submitted');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [peekedStructureNames, setPeekedStructureNames] = useState<Record<string, boolean>>({});
  const [zoomedStructure, setZoomedStructure] = useState<ChemicalStructure | null>(null);
  const [showMatchingVignette, setShowMatchingVignette] = useState<boolean>(false);

  React.useEffect(() => {
    if (examModeStatus === 'submitted') {
      setIsSolved(true);
    }
  }, [examModeStatus]);

  const tfAnswers = controlledTf ?? internalTf;
  const mcSelection = controlledMc !== undefined ? controlledMc : internalMc;
  const rankingOrder =
    controlledRanking && controlledRanking.length > 0
      ? controlledRanking
      : internalRanking.length > 0
      ? internalRanking
      : (question.rankingItems || []).map((item) => item.id);
  const isRankingChecked =
    examModeStatus === 'submitted'
      ? true
      : controlledRankingChecked ?? internalRankingChecked;

  const updateTfAnswers = (next: Record<string, boolean>) => {
    if (onTfSelect) onTfSelect(next);
    else setInternalTf(next);
  };

  const updateMcSelection = (next: number | null) => {
    if (onMcSelect) onMcSelect(next);
    else setInternalMc(next);
  };

  const updateRankingOrder = (next: string[], resetCheck = true) => {
    if (onRankingChange) onRankingChange(next);
    else setInternalRanking(next);
    if (resetCheck) {
      if (onRankingCheck) onRankingCheck(false);
      else setInternalRankingChecked(false);
    }
  };

  const updateRankingChecked = (checked: boolean) => {
    if (onRankingCheck) onRankingCheck(checked);
    else setInternalRankingChecked(checked);
  };

  // Reset chips, completion state, feedback message, and inputs
  const resetChips = () => {
    setSelectedChips([]);
    setIsSolved(false);
    setFeedbackMessage('');
    updateTfAnswers({});
    updateMcSelection(null);
    const defaultIds = (question.rankingItems || []).map((item) => item.id);
    updateRankingOrder(defaultIds, true);
  };

  const handleReset = resetChips;

  const handleResetTfChoices = () => {
    resetChips();
  };

  const handleResetMcChoice = () => {
    resetChips();
  };

  const handleResetRanking = () => {
    resetChips();
  };

  const handleSelectMc = (optIdx: number) => {
    updateMcSelection(optIdx);
    if (!examModeActive) {
      if (optIdx === question.correctIndex) {
        setIsSolved(true);
        setFeedbackMessage('Correct answer!');
      } else {
        setIsSolved(false);
        setFeedbackMessage('Incorrect choice. Review rationale below.');
      }
    }
  };

  const handleTfChoice = (stmtId: string, choice: boolean) => {
    const next = {
      ...tfAnswers,
      [stmtId]: choice,
    };
    updateTfAnswers(next);

    if (!examModeActive && question.subStatements) {
      const answered = Object.keys(next).length;
      if (answered === question.subStatements.length) {
        const allCorrect = question.subStatements.every((s) => next[s.id] === s.isCorrect);
        setIsSolved(allCorrect);
        if (allCorrect) {
          setFeedbackMessage('All statements evaluated correctly!');
        } else {
          setFeedbackMessage('Some statements are incorrect. Review rationales below.');
        }
      }
    }
  };

  const handleToggleChip = (structureId: string) => {
    setSelectedChips((prev) =>
      prev.includes(structureId) ? prev.filter((id) => id !== structureId) : [...prev, structureId]
    );
  };

  // Move ranking item up or down
  const handleMoveRankingItem = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= rankingOrder.length) return;
    const copy = [...rankingOrder];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    updateRankingOrder(copy, true);
  };

  // Score calculations for T/F questions
  const totalStatements = question.subStatements ? question.subStatements.length : 0;
  const answeredStatementsCount = Object.keys(tfAnswers).length;
  const correctStatementsCount = question.subStatements
    ? question.subStatements.filter((stmt) => tfAnswers[stmt.id] === stmt.isCorrect).length
    : 0;

  // Ordered RankingItem objects
  const orderedRankingItems: RankingItem[] = React.useMemo(() => {
    if (!question.rankingItems || question.rankingItems.length === 0) return [];
    const map = new Map(question.rankingItems.map((item) => [item.id, item]));
    const list: RankingItem[] = [];
    rankingOrder.forEach((id) => {
      const found = map.get(id);
      if (found) list.push(found);
    });
    question.rankingItems.forEach((item) => {
      if (!list.some((x) => x.id === item.id)) list.push(item);
    });
    return list;
  }, [question.rankingItems, rankingOrder]);

  const correctRanksCount = orderedRankingItems.filter(
    (item, idx) => item.correctRank === idx + 1
  ).length;

  // Resolve the specific structure(s) to analyze for this question (memoized to eliminate regex recalculations)
  const structuresToAnalyze = React.useMemo((): ChemicalStructure[] => {
    const candidatePool = [
      ...(question.structuresDisplayed || []),
      ...(allSectionStructures || []),
      ...(allModuleStructures || []),
    ];

    // Deduplicate candidate pool
    const pool: ChemicalStructure[] = [];
    const seen = new Set<string>();
    for (const str of candidatePool) {
      const key = (str.document_label || str.id || str.name).toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        pool.push(str);
      }
    }

    // 1. If question explicitly specifies referenced_structures, filter from pool
    if (Array.isArray(question.referenced_structures) && question.referenced_structures.length > 0) {
      const refs = question.referenced_structures.map((r) => r.trim().toLowerCase());
      const filtered = pool.filter((s) => {
        const idLower = (s.id || '').trim().toLowerCase();
        const docLabelLower = (s.document_label || '').trim().toLowerCase();
        const nameLower = (s.name || '').trim().toLowerCase();
        return refs.includes(idLower) || refs.includes(docLabelLower) || refs.includes(nameLower);
      });
      if (filtered.length > 0) {
        return filtered;
      }
    }

    // 2. If question already has specific structuresDisplayed
    if (question.structuresDisplayed && question.structuresDisplayed.length > 0) {
      return question.structuresDisplayed;
    }

    if (pool.length === 0) {
      return [];
    }

    const textToSearch = `${question.title || ''} ${question.questionStem || ''}`;
    const matched: ChemicalStructure[] = [];

    for (const str of pool) {
      const nameRegex = new RegExp(`\\b${str.name}\\b`, 'i');
      const tradeRegex = str.tradeName ? new RegExp(`\\b${str.tradeName}\\b`, 'i') : null;
      const label = str.document_label || str.id;
      const escapedLabel = label ? label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';
      const docLabelRegex = escapedLabel
        ? new RegExp(`\\b(Antiplatelet|Drug|Structure|Molecule|Compound)?\\s*${escapedLabel}\\b`, 'i')
        : null;
      const idRegex = str.id
        ? new RegExp(`\\b(Antiplatelet|Drug|Structure|Molecule|Compound)?\\s*${str.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
        : null;

      if (
        nameRegex.test(textToSearch) ||
        (tradeRegex && tradeRegex.test(textToSearch)) ||
        (docLabelRegex && docLabelRegex.test(textToSearch)) ||
        (idRegex && idRegex.test(textToSearch))
      ) {
        if (
          !matched.some(
            (m) => m.id === str.id || m.name.toLowerCase() === str.name.toLowerCase()
          )
        ) {
          matched.push(str);
        }
      }
    }

    return matched;
  }, [question, allSectionStructures, allModuleStructures]);

  // Pass options array through deduplication filter based on name/ID to prevent Cartesian explosions
  const uniqueStructureOptions = React.useMemo(() => {
    const options = structuresToAnalyze;
    const uniqueOptions = options.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
    return uniqueOptions;
  }, [structuresToAnalyze]);

  const isExamMode = Boolean(examModeActive || hideDrugNames);

  // Memoized pool of candidate structures for dynamic client-side exam masking
  const maskCandidateStructures = React.useMemo(() => {
    const list: ChemicalStructure[] = [
      ...(structuresToAnalyze || []),
      ...(allSectionStructures || []),
      ...(allModuleStructures || []),
      ...(question.structuresDisplayed || []),
    ];
    return list.filter(
      (v, i, a) =>
        Boolean(v && v.name && v.name.trim()) &&
        a.findIndex((t) => t?.name?.toLowerCase() === v?.name?.toLowerCase()) === i
    );
  }, [structuresToAnalyze, allSectionStructures, allModuleStructures, question.structuresDisplayed]);

  // Helper to render the comprehensive statement-by-statement table
  const renderSubStatementsTable = () => {
    if (!question.subStatements) return null;
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400 block">
            Statement-by-Statement Answer Key &amp; Pharmacophore Rationale:
          </span>
          {answeredStatementsCount > 0 && (
            <span className="text-xs font-mono tabular-nums font-medium text-slate-500 dark:text-slate-400">
              Your score: {correctStatementsCount}/{answeredStatementsCount} correct
            </span>
          )}
        </div>
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                <th className="py-2.5 px-3 w-10 font-mono">#</th>
                <th className="py-2.5 px-3">Statement</th>
                <th className="py-2.5 px-3 w-20 text-center">Key</th>
                <th className="py-2.5 px-3 w-28 text-center">Your Answer</th>
                <th className="py-2.5 px-3">SAR Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {question.subStatements.map((stmt, sIdx) => {
                const userChoice = tfAnswers[stmt.id];
                const hasAnswered = userChoice !== undefined;
                const isUserCorrect = hasAnswered && userChoice === stmt.isCorrect;

                return (
                  <tr key={`q${question.id || 'q'}-stmt-${stmt.id || sIdx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {stmt.id})
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-medium">
                      {maskDrugNamesForExam(stmt.statement || stmt.text || '', maskCandidateStructures, isExamMode)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                          stmt.isCorrect
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {stmt.isCorrect ? 'True' : 'False'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {!hasAnswered ? (
                        <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] italic">
                          Not answered
                        </span>
                      ) : isUserCorrect ? (
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>{userChoice ? 'True' : 'False'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          <X className="w-3 h-3 stroke-[2.5]" />
                          <span>{userChoice ? 'True' : 'False'}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                      {stmt.rationale}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Helper to render Interactive Ranking / Ordering Strip
  const renderRankingSection = () => {
    if (!question.rankingItems || question.rankingItems.length === 0) return null;

    return (
      <div className="space-y-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
            <ListOrdered className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              {question.rankingPrompt ||
                'Interactive Ranking: Arrange the items in the correct sequence (1 = First):'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {showFeedback && isRankingChecked && (
              <span
                className={`text-[11px] font-mono tabular-nums px-2 py-0.5 rounded-full font-bold ${
                  correctRanksCount === orderedRankingItems.length
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {correctRanksCount}/{orderedRankingItems.length} ranks correct
              </span>
            )}

            {!examModeActive && (
              <button
                type="button"
                onClick={() => {
                  updateRankingChecked(true);
                  const allCorrect = correctRanksCount === orderedRankingItems.length;
                  setIsSolved(allCorrect);
                  if (allCorrect) {
                    setFeedbackMessage('All items placed in correct sequence!');
                  }
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-2xs cursor-pointer"
              >
                Check Order
              </button>
            )}

            <button
              type="button"
              onClick={handleResetRanking}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Order</span>
            </button>
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="space-y-2">
          {orderedRankingItems.map((item, idx) => {
            const currentRank = idx + 1;
            const isCorrectPosition = item.correctRank === currentRank;

            let cardBorder =
              'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800';
            if (showFeedback && isRankingChecked) {
              cardBorder = isCorrectPosition
                ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-700'
                : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-400 dark:border-rose-700';
            } else if (examModeActive) {
              cardBorder =
                'bg-blue-50/20 dark:bg-blue-950/15 border-blue-200 dark:border-blue-800/70';
            }

            return (
              <div
                key={`q${question.id || 'q'}-rank-${item.id || idx}`}
                className={`p-2.5 sm:p-3 rounded-xl border transition-all flex flex-col gap-1.5 ${cardBorder}`}
              >
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span
                      className={`font-mono tabular-nums font-bold text-xs px-2 py-0.5 rounded shrink-0 ${
                        showFeedback && isRankingChecked
                          ? isCorrectPosition
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                          : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      }`}
                    >
                      Rank {currentRank}
                    </span>
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">
                      {item.label}
                    </span>
                  </div>

                  {/* Move Up / Down Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    {showFeedback && isRankingChecked && (
                      <span
                        className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded mr-1 flex items-center gap-1 ${
                          isCorrectPosition
                            ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70'
                            : 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/70'
                        }`}
                      >
                        {isCorrectPosition ? (
                          <>
                            <Check className="w-3 h-3 stroke-[2.5]" />
                            <span>Correct</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3 stroke-[2.5]" />
                            <span>Key: #{item.correctRank}</span>
                          </>
                        )}
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleMoveRankingItem(idx, -1)}
                      disabled={idx === 0}
                      title="Move Up (Higher Rank)"
                      className="p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-35 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveRankingItem(idx, 1)}
                      disabled={idx === orderedRankingItems.length - 1}
                      title="Move Down (Lower Rank)"
                      className="p-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-35 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Item Rationale once checked in Study Mode or Submitted Exam */}
                {showFeedback && isRankingChecked && item.rationale && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 pl-16 leading-relaxed">
                    {item.rationale}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-all duration-200">
      {/* ------------------------------------------------------------------ */}
      {/* 1. QUESTION HEADER & CONTROLS                                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Question Number Badge */}
          <span className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 min-w-[34px] h-[30px] rounded-md flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-xs px-2">
            {(() => {
              const raw = (question.questionNumberLabel || '').trim();
              const isTimestampHash = /^Q?\d{6,}$/i.test(raw) || /^Question \d{6,}$/i.test(raw);
              if (raw && !isTimestampHash) {
                if (raw.startsWith('Question ')) {
                  return `Q${raw.replace('Question ', '')}`;
                }
                return raw.startsWith('Q') ? raw : `Q${raw}`;
              }
              const qId = question.id;
              if (typeof qId === 'number' && qId > 0 && qId < 1000000) {
                return `Q${qId}`;
              }
              if (questionIndex !== undefined) {
                return `Q${questionIndex + 1}`;
              }
              return 'Q';
            })()}
          </span>

          {/* Question Stem Text */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {question.category || 'Pharmacology Review'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug text-pretty">
              {maskDrugNamesForExam(question.questionStem || question.prompt || '', maskCandidateStructures, isExamMode)}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {question.type === 'matching' && (
                <span className="inline-block text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400">
                  Interactive Structure Drag &amp; Drop Matching
                </span>
              )}
              {question.type === 'sub-statements' && (
                <span className="inline-block text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {examModeActive
                    ? 'True / False Statement Evaluation (Exam Mode)'
                    : 'Interactive True / False Analysis (Click T or F for instant feedback)'}
                </span>
              )}
              {question.type === 'multiple-choice' && (
                <span className="inline-block text-[11px] font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                  {examModeActive
                    ? 'Single-Best-Answer Multiple Choice (Exam Mode)'
                    : 'Interactive Multiple-Choice with Option Rationales'}
                </span>
              )}
              {question.type === 'structural-workbench' && (
                <span className="inline-block text-[11px] font-mono font-semibold text-purple-600 dark:text-purple-400">
                  Interactive Structural Workbench (4 pts)
                </span>
              )}
              {question.rankingItems && question.rankingItems.length > 0 && (
                <span className="inline-block text-[11px] font-mono font-semibold text-amber-600 dark:text-amber-400">
                  + Interactive PK/SAR Ranking
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Controls: Edit Question (Optional) & View / Hide Answer Key Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onEditQuestion && !examModeActive && (
            <button
              type="button"
              onClick={() => onEditQuestion(question)}
              title="Edit question stem, options, or answer key"
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          {examModeActive ? (
            <span className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-semibold flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 select-none">
              <Lock className="w-3 h-3" />
              <span>Key Locked</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={isOpen}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 select-none shadow-xs cursor-pointer"
            >
              <span>{isOpen ? 'Hide Answer' : 'View Answer'}</span>
              {isOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. QUESTION BODY                                                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-4 sm:p-5 space-y-4">
          {/* ============================================================== */}
          {/* INTERSTITIAL STRUCTURE VIGNETTES (For Non-Matching Questions)  */}
          {/* ============================================================== */}
          {uniqueStructureOptions.length > 0 &&
            question.type !== 'matching' &&
            question.type !== 'structural-workbench' && (
            <div className="space-y-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300">
                    <FlaskConical className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {uniqueStructureOptions.length === 1 ? 'Referenced Chemical Structure' : 'Referenced Chemical Structures'}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium">
                    {uniqueStructureOptions.length}
                  </span>
                </div>

                {/* Peek toggle for study mode */}
                {!examModeActive && (hideDrugNames || examModeStatus !== 'off') && (
                  <button
                    type="button"
                    onClick={() => {
                      const allPeeked = uniqueStructureOptions.every((s) => peekedStructureNames[s.id]);
                      const next: Record<string, boolean> = {};
                      uniqueStructureOptions.forEach((s) => {
                        next[s.id] = !allPeeked;
                      });
                      setPeekedStructureNames(next);
                    }}
                    className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {uniqueStructureOptions.every((s) => peekedStructureNames[s.id]) ? (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Hide All Names</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Peek Drug Names</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Responsive Cards Grid */}
              <div
                className={`grid gap-3 ${
                  uniqueStructureOptions.length === 1
                    ? 'grid-cols-1 max-w-lg'
                    : uniqueStructureOptions.length === 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {(() => {
                  const options = uniqueStructureOptions;
                  const uniqueOptions = options.filter((v, i, a) => a.findIndex((t) => t.name === v.name || t.id === v.id) === i);
                  return uniqueOptions.map((structure, index) => {
                    const isNameBlinded =
                      (examModeActive || hideDrugNames) && !peekedStructureNames[structure.id];
                    const chemicalClass = getChemicalClass(structure);
                    const targetReceptor = getTargetReceptor(structure);
                    const reversibility = getReversibility(structure);
                    const route = getRouteOfAdmin(structure);
                    const isChipActive = selectedChips.includes(structure.id);

                    return (
                      <div
                        key={`q${question.id || 'q'}-chip-${structure.id || index}`}
                        className={`group relative rounded-xl border bg-white dark:bg-slate-900/80 p-3 shadow-xs transition-all flex flex-col justify-between ${
                          isChipActive
                            ? 'border-blue-500 ring-2 ring-blue-500/30 dark:border-blue-400'
                            : 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600'
                        }`}
                      >
                        {/* Top row: Roman Numeral badge + Drug Name / Blinded status */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <button
                              type="button"
                              onClick={() => handleToggleChip(structure.id)}
                              title={isChipActive ? 'Deselect structure chip' : 'Select structure chip'}
                              className={`shrink-0 px-2 py-0.5 rounded-md font-mono font-black text-xs cursor-pointer transition-colors shadow-xs ${
                                isChipActive
                                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                                  : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800'
                              }`}
                            >
                              Structure {structure.document_label || structure.id}
                            </button>
                            <div className="truncate">
                              {isNameBlinded ? (
                                <span className="text-xs font-mono font-medium text-slate-400 dark:text-slate-500 italic">
                                  [Blinded for exam]
                                </span>
                              ) : (
                                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                                  {structure.name}
                                  {structure.tradeName && (
                                    <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 ml-1">
                                      ({structure.tradeName})
                                    </span>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quick Controls: Blind / Peek toggle & Zoom */}
                          <div className="shrink-0 flex items-center gap-1">
                            {examModeActive ? (
                              <span title="Blinded in exam mode" className="text-amber-500 p-0.5">
                                <Lock className="w-3.5 h-3.5" />
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPeekedStructureNames((prev) => ({
                                    ...prev,
                                    [structure.id]: !prev[structure.id],
                                  }));
                                }}
                                title={peekedStructureNames[structure.id] ? 'Hide drug name' : 'Peek drug name'}
                                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                              >
                                {peekedStructureNames[structure.id] ? (
                                  <EyeOff className="w-3.5 h-3.5" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setZoomedStructure(structure)}
                              title="Zoom / Inspect 2D structure"
                              className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                            >
                              <ZoomIn className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Pure 2D Chemical Structure Line Drawing in high-contrast light canvas */}
                        <div
                          onClick={() => setZoomedStructure(structure)}
                          className="relative w-full aspect-[4/3] bg-[var(--structure-canvas-bg)] rounded-lg border border-slate-100 dark:border-slate-800 p-2 flex items-center justify-center cursor-pointer overflow-hidden group-hover:shadow-inner transition-shadow"
                        >
                          <SmilesCanvas
                            smiles={
                              structure.canonicalSmiles ||
                              structure.smiles ||
                              (structure as any).structure?.canonicalSmiles ||
                              (structure as any).structure?.smiles
                            }
                            molBlock={structure.pubchemMolBlock || (structure as any).structure?.pubchemMolBlock}
                            fallbackImageUrl={structure.pngUrl || (structure as any).structure?.pngUrl}
                            width={220}
                            height={165}
                            altText={`Structure ${structure.document_label || structure.id}`}
                            className="w-full h-full bg-white border-0 shadow-none pointer-events-none"
                          />
                          <div className="absolute inset-0 bg-blue-500/0 hover:bg-blue-500/5 transition-colors flex items-end justify-end p-1.5 opacity-0 group-hover:opacity-100 pointer-events-none">
                            <span className="text-[10px] font-semibold text-blue-700 bg-white/95 dark:bg-slate-900/95 px-1.5 py-0.5 rounded shadow-xs border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                              <ZoomIn className="w-2.5 h-2.5" /> Click to zoom
                            </span>
                          </div>
                        </div>

                        {/* Metadata / SAR Tags */}
                        <div className="mt-2 space-y-1 text-[11px]">
                          {targetReceptor && targetReceptor !== 'Data unavailable' && (
                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                              <span className="font-semibold text-slate-500 dark:text-slate-400">Target:</span>
                              <span className="truncate">{targetReceptor}</span>
                            </div>
                          )}
                          {chemicalClass && chemicalClass !== 'Data unavailable' && (
                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                              <span className="font-semibold text-slate-500 dark:text-slate-400">Class:</span>
                              <span className="truncate">{chemicalClass}</span>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1 pt-1">
                            {reversibility && reversibility !== 'Data unavailable' && (
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-medium ${
                                  reversibility.toLowerCase().includes('irrev')
                                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                }`}
                              >
                                {reversibility}
                              </span>
                            )}
                            {route && route !== 'Data unavailable' && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium">
                                {route}
                              </span>
                            )}
                            {structure.pharmacophores && structure.pharmacophores.length > 0 && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 font-medium">
                                {structure.pharmacophores.length} pharmacophore{structure.pharmacophores.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* COLLAPSIBLE STRUCTURE VIGNETTES TOGGLE FOR MATCHING QUESTIONS */}
          {/* ============================================================== */}
          {question.type === 'matching' && uniqueStructureOptions.length > 0 && (
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 bg-slate-50/50 dark:bg-slate-900/40">
              <button
                type="button"
                onClick={() => setShowMatchingVignette((prev) => !prev)}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between w-full cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-blue-500" />
                  <span>
                    {showMatchingVignette ? 'Hide' : 'Inspect'} 2D Structure Vignettes for Matching Pool ({uniqueStructureOptions.length})
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {showMatchingVignette ? 'Collapse ▲' : 'Expand ▼'}
                </span>
              </button>
              {showMatchingVignette && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(() => {
                    const options = uniqueStructureOptions;
                    const uniqueOptions = options.filter((v, i, a) => a.findIndex((t) => t.name === v.name || t.id === v.id) === i);
                    return uniqueOptions.map((structure, index) => (
                      <div
                        key={`q${question.id || 'q'}-vignette-${structure.id || index}`}
                        onClick={() => setZoomedStructure(structure)}
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-1 cursor-pointer hover:border-blue-400 transition-colors"
                      >
                        <div className="w-full flex items-center justify-between text-[10px] font-mono">
                          <span className="font-bold">Structure {structure.document_label || structure.id}</span>
                          <ZoomIn className="w-3 h-3 text-slate-400" />
                        </div>
                        <div className="w-16 h-16 bg-[var(--structure-canvas-bg)] rounded p-1 flex items-center justify-center overflow-hidden">
                          <SmilesCanvas
                            smiles={
                              structure.canonicalSmiles ||
                              structure.smiles ||
                              (structure as any).structure?.canonicalSmiles ||
                              (structure as any).structure?.smiles
                            }
                            molBlock={structure.pubchemMolBlock || (structure as any).structure?.pubchemMolBlock}
                            fallbackImageUrl={structure.pngUrl || (structure as any).structure?.pngUrl}
                            width={64}
                            height={64}
                            altText={`Structure ${structure.id}`}
                            className="w-full h-full bg-transparent border-0 shadow-none pointer-events-none"
                          />
                        </div>
                        <span className="text-[10px] font-medium truncate max-w-full text-slate-600 dark:text-slate-400">
                          {examModeActive ? 'Structure ' + structure.id : structure.name}
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          )}

          {/* MATCHING TYPE */}
          {question.type === 'matching' && question.matchingTargets && (
            <StructureDragDropMatch
              question={{
                ...question,
                structuresDisplayed:
                  uniqueStructureOptions.length > 0 ? uniqueStructureOptions : question.structuresDisplayed,
              }}
              placements={matchingPlacements}
              onPlacementsChange={onMatchingChange}
              examModeActive={examModeActive}
              isSolved={examModeStatus === 'submitted' || isSolved}
            />
          )}

          {/* MULTIPLE CHOICE TYPE */}
          {question.type === 'multiple-choice' && question.options && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-200/80 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Select the best answer:
                </span>
                {(mcSelection !== null || selectedChips.length > 0 || isSolved) && (
                  <button
                    type="button"
                    onClick={handleResetMcChoice}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Choice</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {question.options.map((opt, optIdx) => {
                  const isSelected = mcSelection === optIdx;
                  const isCorrect = question.correctIndex === optIdx;

                  let style =
                    'bg-slate-50 dark:bg-slate-800/50 border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600';

                  if (isSelected) {
                    if (examModeActive) {
                      style =
                        'bg-blue-50 dark:bg-blue-950/50 border-blue-500 dark:border-blue-500 text-blue-950 dark:text-blue-100 ring-2 ring-blue-500/25 font-medium';
                    } else if (isCorrect) {
                      style =
                        'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-400/30 font-medium';
                    } else {
                      style =
                        'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 text-rose-950 dark:text-rose-200 ring-2 ring-rose-400/30';
                    }
                  } else if (examModeStatus === 'submitted' && isCorrect) {
                    style =
                      'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300';
                  }

                  return (
                    <button
                      key={`q${question.id || 'q'}-opt-${optIdx}`}
                      type="button"
                      onClick={() => handleSelectMc(optIdx)}
                      className={`text-xs flex items-start gap-2.5 p-3 rounded-xl border transition-all text-left cursor-pointer ${style}`}
                    >
                      <span className="font-mono font-bold shrink-0 min-w-[20px]">
                        {String.fromCharCode(97 + optIdx)})
                      </span>
                      <span className="leading-relaxed flex-1">
                        {maskDrugNamesForExam(opt.replace(/^[A-F]\.\s*/, ''), maskCandidateStructures, isExamMode)}
                      </span>
                      {isSelected && (
                        examModeActive ? (
                          <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                            ● Chosen
                          </span>
                        ) : isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                        )
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Immediate Option-Level Rationale Card (Study Mode or Submitted Exam) */}
              {showFeedback && mcSelection !== null && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-fadeIn ${
                    mcSelection === question.correctIndex
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                      : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                  }`}
                >
                  {mcSelection === question.correctIndex ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 flex-1 leading-relaxed">
                    <div className="font-bold">
                      {mcSelection === question.correctIndex
                        ? `✓ Correct Choice (${String.fromCharCode(65 + mcSelection)})`
                        : `✕ Incorrect Choice (${String.fromCharCode(65 + mcSelection)}) — Try another option or inspect the rationale:`}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-pretty">
                      {question.optionExplanations?.[mcSelection] ||
                        question.overallExplanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INTERACTIVE RANKING / ORDERING SECTION (If present on this question) */}
          {renderRankingSection()}

          {/* SUB-STATEMENTS TYPE: Interactive True / False Selection List */}
          {question.type === 'sub-statements' && question.subStatements && (
            <div className="space-y-3 pt-1">
              {/* Status Header with Progress and Reset */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800 text-xs">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Evaluate statements:
                  </span>
                  <span className="text-[11px] font-mono tabular-nums px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {answeredStatementsCount} of {totalStatements} answered
                  </span>
                  {showFeedback && answeredStatementsCount > 0 && (
                    <span
                      className={`text-[11px] font-mono tabular-nums px-2 py-0.5 rounded-full font-semibold ${
                        correctStatementsCount === answeredStatementsCount
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                      }`}
                    >
                      {correctStatementsCount}/{answeredStatementsCount} correct (
                      {Math.round(
                        (correctStatementsCount / answeredStatementsCount) * 100
                      )}
                      %)
                    </span>
                  )}
                </div>

                {(answeredStatementsCount > 0 || selectedChips.length > 0 || isSolved) && (
                  <button
                    type="button"
                    onClick={handleResetTfChoices}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    title="Reset your choices for this question"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Choices</span>
                  </button>
                )}
              </div>

              {/* Statements with Interactive T and F Toggle Pill Buttons */}
              <div className="space-y-2.5">
                {question.subStatements.map((stmt, sIdx) => {
                  const userChoice = tfAnswers[stmt.id];
                  const hasAnswered = userChoice !== undefined;
                  const isUserCorrect = hasAnswered && userChoice === stmt.isCorrect;

                  let rowClass =
                    'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800';
                  if (hasAnswered) {
                    if (examModeActive) {
                      rowClass =
                        'bg-blue-50/40 dark:bg-blue-950/20 border-blue-300 dark:border-blue-800/70';
                    } else if (isUserCorrect) {
                      rowClass =
                        'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/70';
                    } else {
                      rowClass =
                        'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/70';
                    }
                  }

                  return (
                    <div
                      key={`q${question.id || 'q'}-substmt-${stmt.id || sIdx}`}
                      className={`p-3 rounded-xl border transition-all ${rowClass}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                        {/* Statement Text */}
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <span className="font-mono font-bold text-slate-900 dark:text-slate-100 shrink-0 min-w-[20px] text-xs pt-0.5">
                            {stmt.id})
                          </span>
                          <span className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                            {maskDrugNamesForExam(stmt.statement || stmt.text || '', maskCandidateStructures, isExamMode)}
                          </span>
                        </div>

                        {/* Interactive T and F Toggle Pill Buttons */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start pt-0.5">
                          {/* [ T ] Button */}
                          <button
                            type="button"
                            onClick={() => handleTfChoice(stmt.id, true)}
                            className={`h-7 px-3 rounded-full text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                              userChoice === true
                                ? examModeActive
                                  ? 'bg-blue-600 text-white ring-2 ring-blue-400/40'
                                  : stmt.isCorrect === true
                                  ? 'bg-emerald-600 text-white shadow-emerald-500/20 ring-2 ring-emerald-400/40'
                                  : 'bg-rose-600 text-white shadow-rose-500/20 ring-2 ring-rose-400/40'
                                : userChoice === false
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400'
                            }`}
                          >
                            {userChoice === true ? (
                              examModeActive ? (
                                <span>● True</span>
                              ) : stmt.isCorrect === true ? (
                                <>
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>True</span>
                                </>
                              ) : (
                                <>
                                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>True</span>
                                </>
                              )
                            ) : (
                              <span>T</span>
                            )}
                          </button>

                          {/* [ F ] Button */}
                          <button
                            type="button"
                            onClick={() => handleTfChoice(stmt.id, false)}
                            className={`h-7 px-3 rounded-full text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                              userChoice === false
                                ? examModeActive
                                  ? 'bg-blue-600 text-white ring-2 ring-blue-400/40'
                                  : stmt.isCorrect === false
                                  ? 'bg-emerald-600 text-white shadow-emerald-500/20 ring-2 ring-emerald-400/40'
                                  : 'bg-rose-600 text-white shadow-rose-500/20 ring-2 ring-rose-400/40'
                                : userChoice === true
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-rose-500 hover:text-rose-600 dark:hover:text-rose-400'
                            }`}
                          >
                            {userChoice === false ? (
                              examModeActive ? (
                                <span>● False</span>
                              ) : stmt.isCorrect === false ? (
                                <>
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>False</span>
                                </>
                              ) : (
                                <>
                                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>False</span>
                                </>
                              )
                            ) : (
                              <span>F</span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Immediate Inline Feedback when chosen (Study Mode or Submitted Exam) */}
                      {showFeedback && hasAnswered && (
                        <div
                          className={`mt-2.5 pt-2 border-t text-xs flex items-start gap-2 ${
                            isUserCorrect
                              ? 'border-emerald-200/80 dark:border-emerald-800/50 text-emerald-950 dark:text-emerald-200'
                              : 'border-rose-200/80 dark:border-rose-800/50 text-rose-950 dark:text-rose-200'
                          }`}
                        >
                          {isUserCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <div className="leading-relaxed flex-1">
                            <div className="font-semibold flex flex-wrap items-center gap-1.5">
                              <span>
                                {isUserCorrect
                                  ? `Correct! Statement is ${stmt.isCorrect ? 'True' : 'False'}.`
                                  : `Incorrect. Statement is actually ${stmt.isCorrect ? 'True' : 'False'}.`}
                              </span>
                              {stmt.keyPharmacophore && (
                                <span className="font-mono text-[10px] font-normal px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                  {stmt.keyPharmacophore}
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-slate-600 dark:text-slate-300 text-xs">
                              {maskDrugNamesForExam(stmt.rationale || stmt.explanation || '', maskCandidateStructures, isExamMode)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STRUCTURAL-WORKBENCH TYPE: Interactive Multi-Step Chemical Workbench */}
          {(question.type === 'structural-workbench' || question.structuralWorkbench) && question.structuralWorkbench && (
            <div className="pt-1">
              <StructuralWorkbenchQuestion
                question={question}
                workbenchData={question.structuralWorkbench}
                savedAnswer={workbenchAnswer}
                onAnswer={(score, answerData) => {
                  if (onWorkbenchAnswerChange) {
                    onWorkbenchAnswerChange(answerData, score);
                  }
                  if (!examModeActive) {
                    setIsSolved(score === 4);
                    if (score === 4) {
                      setFeedbackMessage('All 4 structural workbench steps completed correctly!');
                    } else if (score > 0) {
                      setFeedbackMessage(`Workbench in progress: ${score}/4 points earned.`);
                    } else {
                      setFeedbackMessage('');
                    }
                  }
                }}
                examMode={examModeActive}
                isSubmitted={examModeStatus === 'submitted'}
                isOpenAnswerKey={isOpen}
              />
            </div>
          )}

          {/* Completion / Feedback banner */}
          {showFeedback && feedbackMessage && (
            <div
              className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 animate-fadeIn ${
                isSolved
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {isSolved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                )}
                <span className="font-medium">{feedbackMessage}</span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Question</span>
              </button>
            </div>
          )}

      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. ACCORDION EXPANDED CONTENT (ANSWER KEY & EXPLANATIONS)          */}
      {/* ------------------------------------------------------------------ */}
      {isOpen && !examModeActive && (
        <div className="p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-slideDown">
          {/* For Matching Questions: Full Solution Key Table */}
          {question.type === 'matching' && question.matchingTargets && (
            <div className="space-y-2">
              <span className="font-bold uppercase tracking-wider text-[11px] text-slate-500 dark:text-slate-400 block">
                Matching Solution Key &amp; Pharmacophore Breakdown:
              </span>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                      <th className="py-2 px-3 w-10 font-mono">#</th>
                      <th className="py-2 px-3">Class / Target Category</th>
                      <th className="py-2 px-3 w-44">Matching Structure(s)</th>
                      <th className="py-2 px-3">Pharmacophore &amp; MOA Key</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {question.matchingTargets.map((target, index) => {
                      const matchedStrs = target.acceptedStructureIds
                        .map((id) => {
                          const str = question.structuresDisplayed?.find(
                            (s) => s.id === id
                          );
                          return str
                            ? `Structure ${id} (${str.name})`
                            : `Structure ${id}`;
                        })
                        .join(', ');
                      return (
                        <tr
                          key={`q${question.id || 'q'}-target-${target.id || index}`}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        >
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                            {target.id})
                          </td>
                          <td className="py-2.5 px-3 text-slate-800 dark:text-slate-200 font-semibold">
                            {target.label}
                          </td>
                          <td className="py-2.5 px-3 font-medium">
                            {target.acceptedStructureIds.length > 0 ? (
                              <span className="inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{matchedStrs}</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500 italic font-mono text-[11px]">
                                None (Distractor class)
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                            {target.rationale ||
                              'Direct correlation from Review for Antiplatelets PDF.'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* For Multiple Choice: Correct Choice Banner + Option Explanations */}
          {question.type === 'multiple-choice' &&
            question.correctIndex !== undefined && (
              <div className="space-y-2.5">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs text-emerald-950 dark:text-emerald-200">
                  <span className="font-bold uppercase tracking-wider block text-[11px] text-emerald-700 dark:text-emerald-400 mb-1">
                    Correct Answer:
                  </span>
                  <div className="font-semibold text-sm">
                    {question.options
                      ? maskDrugNamesForExam(question.options[question.correctIndex], maskCandidateStructures, isExamMode)
                      : ''}
                  </div>
                </div>

                {question.optionExplanations &&
                  question.optionExplanations.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                      <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block">
                        Option-by-Option Breakdown:
                      </span>
                      {question.optionExplanations.map((exp, idx) => (
                        <div
                          key={`q${question.id || 'q'}-exp-${idx}`}
                          className="flex items-start gap-2 text-slate-700 dark:text-slate-300"
                        >
                          <span className="font-mono font-bold text-slate-900 dark:text-slate-100 shrink-0">
                            {String.fromCharCode(65 + idx)}:
                          </span>
                          <span>{exp}</span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}

          {/* For Sub-Statements: True/False Table with Rationale & User Choices */}
          {question.type === 'sub-statements' &&
            question.subStatements &&
            renderSubStatementsTable()}

          {/* Medicinal Chemistry / MOA In-Depth Explanation Box */}
          <div className="p-4 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-blue-950 dark:text-blue-200">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Medicinal Chemistry / MOA Rationale:</span>
            </div>
            <p className="leading-relaxed text-pretty">{question.overallExplanation}</p>
          </div>

          {/* High-Yield Exam Pearl */}
          {question.highYieldPearl && (
            <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">High-Yield Takeaway:</strong>
                <span>{question.highYieldPearl}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Zoom Modal for Interstitial Structure Vignettes */}
      {zoomedStructure && (
        <StructureLightboxModal
          isOpen={Boolean(zoomedStructure)}
          onClose={() => setZoomedStructure(null)}
          initialStructure={zoomedStructure}
          comparisonPool={uniqueStructureOptions}
          hideDrugName={Boolean(examModeActive || hideDrugNames) && !peekedStructureNames[zoomedStructure.id]}
          examModeActive={examModeActive}
          onInspectPubChem={onInspectStructure}
        />
      )}
    </div>
  );
};

export const DocumentQuestionItem = React.memo<DocumentQuestionItemProps>(
  DocumentQuestionItemComponent,
  (prev, next) => {
    // Only re-render if visual or data props for THIS question have actually changed
    return (
      prev.question === next.question &&
      prev.isOpen === next.isOpen &&
      prev.hideDrugNames === next.hideDrugNames &&
      prev.examModeStatus === next.examModeStatus &&
      prev.focusMatchingOnly === next.focusMatchingOnly &&
      prev.mcSelection === next.mcSelection &&
      prev.tfAnswers === next.tfAnswers &&
      prev.matchingPlacements === next.matchingPlacements &&
      prev.rankingOrder === next.rankingOrder &&
      prev.rankingChecked === next.rankingChecked &&
      prev.globalActivePharmacophores === next.globalActivePharmacophores &&
      prev.globalHoveredPharmacophoreId === next.globalHoveredPharmacophoreId &&
      prev.allSectionStructures === next.allSectionStructures &&
      prev.allModuleStructures === next.allModuleStructures
    );
  }
);
