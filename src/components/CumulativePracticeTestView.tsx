import React, { useState, useMemo, useEffect } from 'react';
import type {
  CumulativeQuestion,
  CumulativeQuestionType,
  StruggleDiagnosticReport,
  QuestionScoreResult,
  PhysiologicalEffectStatement,
} from '../types/cumulativeStudy';
import type { ChemicalStructure } from '../types/reviewModule';
import {
  calculateQuestionScore,
  generateStruggleReport,
} from '../utils/struggleDiagnosticService';
import { CUMULATIVE_QUESTIONS as defaultQuestionBank } from '../data/cumulativeQuizData';
import { SmilesCanvas } from './SmilesCanvas';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  X,
  Award,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';

export interface CumulativePracticeTestViewProps {
  questions?: CumulativeQuestion[];
  onComplete?: (report: StruggleDiagnosticReport) => void;
  onClose?: () => void;
}

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

/**
 * Generates neutral Roman numeral labels for blinded candidate structures.
 * Example: index 0 -> "Structure I", index 1 -> "Structure II", etc.
 */
export function getRomanNumeral(index: number): string {
  const numeral = ROMAN_NUMERALS[index] || String(index + 1);
  return `Structure ${numeral}`;
}

/**
 * Formats the partial credit score badge according to test guidelines:
 * - 100%: "100% (Perfect)"
 * - 1% to 99%: "+X% (Partial Credit)"
 * - 0%: "0%"
 */
export function formatScoreBadge(scorePercentage: number): string {
  if (scorePercentage === 100) {
    return '100% (Perfect)';
  }
  if (scorePercentage > 0) {
    return `+${scorePercentage}% (Partial Credit)`;
  }
  return '0%';
}

/**
 * Maps question type to human-readable clinical badge text.
 */
function getQuestionTypeBadge(type: CumulativeQuestionType): string {
  switch (type) {
    case 'case-to-structures':
      return 'Type A: Patient Case → Candidate Structures';
    case 'structure-to-effects':
      return 'Type B: Structure → Physiological Effects';
    case 'comparative-sar':
      return 'Type C: Comparative SAR Analysis';
    case 'contraindication-risk':
      return 'Type D: Contraindication & Clearance Risk';
    default:
      return 'Cumulative Multi-Select Drill';
  }
}

/**
 * Cumulative Practice Test Component with Multi-Select SAR Deduction
 *
 * Implements:
 * - Rigorous exam blinding: generic drug names, trade names, and module names are
 *   strictly blinded before submission. Candidate structures use neutral Roman numerals.
 * - Multi-select partial credit scoring via calculateQuestionScore().
 * - Empty selection guard with validation warning.
 * - Post-submission instant feedback:
 *   - True Positives (emerald border + checkmark badge)
 *   - False Positives (crimson/rose border + X badge)
 *   - False Negatives (amber border + warning badge)
 *   - Unselected Distractors (neutral border)
 * - Revealed candidate chemical rationales with generic and trade names.
 * - High-Yield MedChem Pearl callout accordion box.
 * - Progression to next question or completion with generateStruggleReport().
 */
export const CumulativePracticeTestView: React.FC<CumulativePracticeTestViewProps> = ({
  questions,
  onComplete,
  onClose,
}) => {
  const activeQuestions: CumulativeQuestion[] = useMemo(() => {
    if (questions && questions.length > 0) {
      return questions;
    }
    return defaultQuestionBank;
  }, [questions]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [scoreResult, setScoreResult] = useState<QuestionScoreResult | null>(null);
  const [isPearlExpanded, setIsPearlExpanded] = useState<boolean>(true);

  // Accumulated results across completed questions
  const [questionResults, setQuestionResults] = useState<
    Array<{ question: CumulativeQuestion; selectedIds: string[] }>
  >([]);

  // Test completion state
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [finalReport, setFinalReport] = useState<StruggleDiagnosticReport | null>(null);

  // Reset state when active questions change
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedIds([]);
    setIsSubmitted(false);
    setValidationError(null);
    setScoreResult(null);
    setQuestionResults([]);
    setIsCompleted(false);
    setFinalReport(null);
  }, [questions]);

  const currentQuestion = activeQuestions[currentIndex] as CumulativeQuestion | undefined;

  // Toggle selection for candidate structure or statement
  const handleToggleSelect = (id: string) => {
    if (isSubmitted) return; // Prevent edits after submission
    setValidationError(null);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Submit answer with empty selection guard
  const handleSubmit = () => {
    if (!currentQuestion) return;

    if (selectedIds.length === 0) {
      const msg =
        currentQuestion.type === 'structure-to-effects'
          ? 'Please select at least one physiological effect statement before submitting.'
          : 'Please select at least one candidate structure before submitting.';
      setValidationError(msg);
      return;
    }

    setValidationError(null);
    const result = calculateQuestionScore(currentQuestion, selectedIds);
    setScoreResult(result);
    setIsSubmitted(true);
    setIsPearlExpanded(true);

    const updatedResults = [...questionResults, { question: currentQuestion, selectedIds }];
    setQuestionResults(updatedResults);
  };

  // Move to next question or finish test
  const handleNext = () => {
    if (!currentQuestion) return;

    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIds([]);
      setIsSubmitted(false);
      setValidationError(null);
      setScoreResult(null);
    } else {
      // Final question completed -> compute struggle report
      const report = generateStruggleReport({
        sessionType: 'practice-test',
        questionResults,
      });
      setFinalReport(report);
      setIsCompleted(true);
      if (onComplete) {
        onComplete(report);
      }
    }
  };

  // Restart test
  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedIds([]);
    setIsSubmitted(false);
    setValidationError(null);
    setScoreResult(null);
    setQuestionResults([]);
    setIsCompleted(false);
    setFinalReport(null);
  };

  // Fallback for empty question set
  if (!currentQuestion || activeQuestions.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl text-center">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          No Practice Questions Available
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          There are no cumulative practice questions configured for this drill.
        </p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Close Drill
          </button>
        )}
      </div>
    );
  }

  // Completion screen when all questions are answered
  if (isCompleted && finalReport) {
    const totalQuestions = activeQuestions.length;
    const scorePct = finalReport.scorePercentage;
    const struggledCount = finalReport.struggledStructures.length;

    return (
      <div className="w-full max-w-3xl mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl text-slate-900 dark:text-slate-100 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
          <Award className="w-10 h-10" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Practice Test Completed!</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
          You have completed all cumulative practice questions. Diagnostic performance analytics have
          been compiled.
        </p>

        {/* Diagnostic KPI summary */}
        <div className="w-full max-w-lg grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 mb-6 text-sm">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Overall Score</div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-0.5">
              {scorePct}%
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Questions</div>
            <div className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-0.5">
              {totalQuestions}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Struggled Items</div>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
              {struggledCount}
            </div>
          </div>
        </div>

        {/* Weakest classes callout if present */}
        {finalReport.weakestClasses && finalReport.weakestClasses.length > 0 && (
          <div className="w-full max-w-lg mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-300 dark:border-amber-800 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1.5">
              <AlertTriangle className="w-4 h-4" /> Focus Areas for Remediation
            </div>
            <div className="flex flex-wrap gap-1.5">
              {finalReport.weakestClasses.map((cls) => (
                <span
                  key={cls}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200"
                >
                  {cls}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 flex-wrap">
          {onComplete && (
            <button
              type="button"
              onClick={() => onComplete(finalReport)}
              className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>View Detailed Struggle Diagnostics</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleRestart}
            className="px-5 py-2.5 rounded-xl font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Practice Test</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  // Active question render
  const isTypeB = currentQuestion.type === 'structure-to-effects';
  const progressPct = ((currentIndex + 1) / activeQuestions.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 text-slate-900 dark:text-slate-100">
      {/* Top Navigation & Progress Bar */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {getQuestionTypeBadge(currentQuestion.type)}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Question {currentIndex + 1} of {activeQuestions.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isSubmitted && scoreResult && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  scoreResult.scorePercentage === 100
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : scoreResult.scorePercentage > 0
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                }`}
              >
                Score: {formatScoreBadge(scoreResult.scorePercentage)}
              </span>
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Close Drill"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Clinical Vignette Stem Card */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col gap-3">
        <div className="text-[11px] font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4" />
          <span>Clinical Vignette & SAR Deduction Task</span>
        </div>
        <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
          {currentQuestion.stem}
        </p>
        <div className="text-xs text-slate-500 dark:text-slate-400 italic">
          * Multi-select question: Partial credit awarded for correct selections; penalties applied for incorrect selections.
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-4 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center gap-3 text-sm font-medium">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* QUESTION BODY: Type B (Single Prominent Structure + Effect Statements) */}
      {isTypeB && currentQuestion.singleStructure && (
        <div className="flex flex-col gap-6">
          {/* Prominent Single Structure Stage */}
          <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isSubmitted
                  ? `${currentQuestion.singleStructure.name} ${
                      currentQuestion.singleStructure.tradeName
                        ? `(${currentQuestion.singleStructure.tradeName})`
                        : ''
                    }`
                  : 'Blinded Chemical Structure Under Evaluation'}
              </span>
              {isSubmitted && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {currentQuestion.singleStructure.pharmacologicalClass ||
                    currentQuestion.singleStructure.chemicalClass}
                </span>
              )}
            </div>

            <div className="w-full p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center">
              <SmilesCanvas
                smiles={
                  currentQuestion.singleStructure.canonical_smiles ||
                  currentQuestion.singleStructure.smiles
                }
                fallbackImageUrl={currentQuestion.singleStructure.pngUrl}
                altText="Blinded chemical structure under evaluation"
                width={440}
                height={260}
                className="max-h-64 w-auto object-contain mx-auto"
              />
            </div>

            {isSubmitted && currentQuestion.rationales[currentQuestion.singleStructure.id] && (
              <div className="w-full mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-slate-900 dark:text-slate-100">Structure Summary: </span>
                {currentQuestion.rationales[currentQuestion.singleStructure.id]}
              </div>
            )}
          </div>

          {/* Effect Statements List */}
          <div className="flex flex-col gap-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
              Select all correct physiological statements:
            </div>
            {currentQuestion.effectStatements?.map((stmt: PhysiologicalEffectStatement) => {
              const isSelected = selectedIds.includes(stmt.id);
              const isTP = isSubmitted && isSelected && stmt.isCorrect;
              const isFP = isSubmitted && isSelected && !stmt.isCorrect;
              const isFN = isSubmitted && !isSelected && stmt.isCorrect;
              const isTN = isSubmitted && !isSelected && !stmt.isCorrect;

              let cardStyles = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900';
              if (isSelected && !isSubmitted) {
                cardStyles = 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20';
              } else if (isTP) {
                cardStyles = 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20';
              } else if (isFP) {
                cardStyles = 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20';
              } else if (isFN) {
                cardStyles = 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20';
              } else if (isTN) {
                cardStyles = 'border-slate-200 dark:border-slate-800 opacity-70 bg-white dark:bg-slate-900';
              }

              return (
                <div
                  key={stmt.id}
                  onClick={() => handleToggleSelect(stmt.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2.5 ${cardStyles}`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isSubmitted}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => handleToggleSelect(stmt.id)}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="flex-1 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                      {stmt.statement}
                    </div>

                    {/* Post-submission badges */}
                    {isSubmitted && (
                      <div className="shrink-0">
                        {isTP && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5" /> True Positive
                          </span>
                        )}
                        {isFP && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300">
                            <XCircle className="w-3.5 h-3.5" /> False Positive
                          </span>
                        )}
                        {isFN && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                            <AlertTriangle className="w-3.5 h-3.5" /> Missed
                          </span>
                        )}
                        {isTN && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            Correctly Excluded
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Statement Rationale Revealed After Submit */}
                  {isSubmitted && stmt.rationale && (
                    <div className="mt-1 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Rationale: </span>
                      {stmt.rationale}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* QUESTION BODY: Types A, C, D (Candidate Structures Grid) */}
      {!isTypeB && currentQuestion.candidateStructures && (
        <div className="flex flex-col gap-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            Candidate Chemical Structures (Multi-Select):
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentQuestion.candidateStructures.map((candidate: ChemicalStructure, idx: number) => {
              const isSelected = selectedIds.includes(candidate.id);
              const isTP = isSubmitted && scoreResult?.truePositives.includes(candidate.id);
              const isFP = isSubmitted && scoreResult?.falsePositives.includes(candidate.id);
              const isFN = isSubmitted && scoreResult?.falseNegatives.includes(candidate.id);
              const isTN = isSubmitted && !isSelected && !isTP && !isFP && !isFN;

              let cardStyles = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900';
              if (isSelected && !isSubmitted) {
                cardStyles = 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 shadow-md';
              } else if (isTP) {
                cardStyles = 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md';
              } else if (isFP) {
                cardStyles = 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 shadow-md';
              } else if (isFN) {
                cardStyles = 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md';
              } else if (isTN) {
                cardStyles = 'border-slate-200 dark:border-slate-800 opacity-70 bg-white dark:bg-slate-900';
              }

              const romanLabel = getRomanNumeral(idx);
              const chemicalRationale =
                currentQuestion.rationales[candidate.id] ||
                candidate.sarNotes ||
                candidate.moa_summary;

              return (
                <div
                  key={candidate.id}
                  onClick={() => handleToggleSelect(candidate.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${cardStyles}`}
                >
                  <div className="flex flex-col gap-3">
                    {/* Card Header: Blinded Roman Numeral or Revealed Drug Details */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={isSubmitted}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleToggleSelect(candidate.id)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {isSubmitted ? `${candidate.name}` : romanLabel}
                        </span>
                      </div>

                      {/* Post-submission evaluation badges */}
                      {isSubmitted && (
                        <div className="shrink-0">
                          {isTP && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                            </span>
                          )}
                          {isFP && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300">
                              <XCircle className="w-3.5 h-3.5" /> Incorrect
                            </span>
                          )}
                          {isFN && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                              <AlertTriangle className="w-3.5 h-3.5" /> Missed
                            </span>
                          )}
                          {isTN && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                              Excluded
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Revealed trade name & pharmacologic class after submission */}
                    {isSubmitted && (
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {candidate.tradeName && (
                          <div className="font-semibold text-slate-700 dark:text-slate-300">
                            Trade: {candidate.tradeName}
                          </div>
                        )}
                        <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                          {candidate.pharmacologicalClass || candidate.chemicalClass}
                        </div>
                      </div>
                    )}

                    {/* 2D Chemical Structure Canvas */}
                    <div className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                      <SmilesCanvas
                        smiles={candidate.canonical_smiles || candidate.smiles}
                        fallbackImageUrl={candidate.pngUrl}
                        altText={isSubmitted ? candidate.name : romanLabel}
                        width={280}
                        height={170}
                        className="max-h-40 w-auto object-contain mx-auto"
                      />
                    </div>
                  </div>

                  {/* Revealed Chemical Rationale */}
                  {isSubmitted && chemicalRationale && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      <span className="font-bold text-slate-800 dark:text-slate-200">SAR Rationale: </span>
                      {chemicalRationale}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* POST-SUBMISSION: High-Yield MedChem Pearl Accordion Box */}
      {isSubmitted && currentQuestion.highYieldPearl && (
        <div className="rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/20 overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setIsPearlExpanded((prev) => !prev)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  High-Yield MedChem Pearl
                </span>
                <div className="text-xs text-amber-700 dark:text-amber-400">
                  Key cross-curriculum SAR takeaway for board examination
                </div>
              </div>
            </div>
            {isPearlExpanded ? (
              <ChevronUp className="w-5 h-5 text-amber-700 dark:text-amber-300" />
            ) : (
              <ChevronDown className="w-5 h-5 text-amber-700 dark:text-amber-300" />
            )}
          </button>

          {isPearlExpanded && (
            <div className="p-4 pt-1 border-t border-amber-200 dark:border-amber-800/60 text-sm text-amber-900 dark:text-amber-100 leading-relaxed font-normal">
              {currentQuestion.highYieldPearl}
            </div>
          )}
        </div>
      )}

      {/* ACTION BAR: Submit vs Next Question / Finish Drill */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {!isSubmitted ? (
            <span>
              {selectedIds.length} candidate{selectedIds.length === 1 ? '' : 's'} selected
            </span>
          ) : (
            scoreResult && (
              <span>
                {scoreResult.truePositives.length} True Positive{scoreResult.truePositives.length === 1 ? '' : 's'},{' '}
                {scoreResult.falsePositives.length} False Positive{scoreResult.falsePositives.length === 1 ? '' : 's'},{' '}
                {scoreResult.falseNegatives.length} Missed
              </span>
            )
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              <span>Submit Answer</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              {currentIndex < activeQuestions.length - 1 ? (
                <>
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Finish Test & View Diagnostics</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
