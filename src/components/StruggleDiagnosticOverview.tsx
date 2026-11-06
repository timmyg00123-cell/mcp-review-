import React, { useMemo } from 'react';
import type { StruggleDiagnosticReport, StruggleItem, ClassRecallBreakdown } from '../types/cumulativeStudy';
import { SmilesCanvas } from './SmilesCanvas';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Lightbulb,
  Layers,
  X,
  ArrowLeft,
  ShieldAlert,
  Flame,
} from 'lucide-react';

export interface StruggleDiagnosticOverviewProps {
  report: StruggleDiagnosticReport;
  onDrillStruggled?: (remediationCandidateIds: string[]) => void;
  onReset?: () => void;
  onClose?: () => void;
}

/**
 * Maps class recall percentage to standardized theme color classes and status labels.
 * - 100%: Emerald (Full Recall / Mastered)
 * - 50% - 99%: Amber (Moderate Recall / Emerging)
 * - < 50%: Rose (Critical Friction / Priority Review)
 */
export function getRecallColorClass(recallRate: number): {
  bg: string;
  text: string;
  border: string;
  bar: string;
  label: string;
} {
  if (recallRate >= 100) {
    return {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800/40',
      bar: 'bg-emerald-500',
      label: 'Full Recall',
    };
  }
  if (recallRate >= 50) {
    return {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800/40',
      bar: 'bg-amber-500',
      label: 'Moderate Recall',
    };
  }
  return {
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800/40',
    bar: 'bg-rose-500',
    label: 'Critical Friction',
  };
}

/**
 * Diagnostic Struggle Overview & Remediation Drill Component
 *
 * Implements:
 * - Score KPI header with session type badge, overall accuracy percentage, and count of mastered items.
 * - High-yield struggle patterns & clinical pitfalls insight callout box.
 * - Two-column diagnostic grid:
 *   - Left: Struggled structures with 2D chemical structure view (via SmilesCanvas), drug name,
 *     pharmacologic & chemical class, and struggle attribution reason.
 *   - Right: Pharmacologic & chemical class recall breakdown with colored progress bars (emerald for 100%,
 *     amber for 50-99%, rose for <50%).
 * - 1-click remediation action bar:
 *   - "Drill Struggled Items Now" button passing report.remediationCandidateIds to onDrillStruggled.
 *   - Secondary "Retake Session" button calling onReset.
 *   - Secondary "Close / Back to Hub" button calling onClose.
 * - Strict Light and Dark mode styling compatibility.
 */
export const StruggleDiagnosticOverview: React.FC<StruggleDiagnosticOverviewProps> = ({
  report,
  onDrillStruggled,
  onReset,
  onClose,
}) => {
  // Resolve unique remediation structure IDs
  const remediationCandidateIds = useMemo<string[]>(() => {
    if (Array.isArray(report.remediationCandidateIds) && report.remediationCandidateIds.length > 0) {
      return report.remediationCandidateIds;
    }
    return Array.from(
      new Set(report.struggledStructures.map((s) => s.structureId).filter(Boolean))
    );
  }, [report]);

  // Mastered item count calculation
  const masteredCount = Math.max(
    0,
    report.totalItemsReviewed - report.struggledStructures.length
  );

  const hasStruggledItems = report.struggledStructures.length > 0;
  const hasPatterns =
    Array.isArray(report.primaryStrugglePatterns) && report.primaryStrugglePatterns.length > 0;

  // Determine overall score color scheme
  const scoreColors = useMemo(() => {
    if (report.scorePercentage >= 80) {
      return {
        badgeBg: 'bg-emerald-100 dark:bg-emerald-950/50',
        badgeText: 'text-emerald-800 dark:text-emerald-300',
        badgeBorder: 'border-emerald-300 dark:border-emerald-800',
        label: 'High Mastery',
      };
    }
    if (report.scorePercentage >= 60) {
      return {
        badgeBg: 'bg-amber-100 dark:bg-amber-950/50',
        badgeText: 'text-amber-800 dark:text-amber-300',
        badgeBorder: 'border-amber-300 dark:border-amber-800',
        label: 'Emerging Recall',
      };
    }
    return {
      badgeBg: 'bg-rose-100 dark:bg-rose-950/50',
      badgeText: 'text-rose-800 dark:text-rose-300',
      badgeBorder: 'border-rose-300 dark:border-rose-800',
      label: 'Remediation Priority',
    };
  }, [report.scorePercentage]);

  return (
    <div className="w-full max-w-7xl mx-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-4">
      {/* ==================================================================== */}
      {/* 1. Header & KPI Section                                              */}
      {/* ==================================================================== */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Diagnostic Performance Report
              </span>
              {report.generatedAt && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(report.generatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Diagnostic Struggle Overview
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Curriculum-wide SAR structure recognition, distractor confusion, and class recall analysis.
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="self-start sm:self-auto p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close Diagnostic Overview"
              title="Back to Hub"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 4-Stat KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Accuracy Percentage */}
          <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Overall Accuracy
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {report.scorePercentage}%
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${scoreColors.badgeBg} ${scoreColors.badgeText} ${scoreColors.badgeBorder}`}
                >
                  {scoreColors.label}
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
          </div>

          {/* KPI 2: Total Items Reviewed */}
          <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Items Reviewed
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                  {report.totalItemsReviewed}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Tested
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          {/* KPI 3: Clean Mastered Items */}
          <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Mastered Structures
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {masteredCount}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  100% Clean
                </span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* KPI 4: Struggled Structures */}
          <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Struggled Structures
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`text-3xl font-extrabold ${
                    hasStruggledItems
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {report.struggledStructures.length}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {hasStruggledItems ? 'Need Drill' : 'None'}
                </span>
              </div>
            </div>
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                hasStruggledItems
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              <Flame className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. High-Yield Struggle Patterns / Insight Callout Box               */}
      {/* ==================================================================== */}
      {hasPatterns && (
        <div className="px-6 pt-6">
          <div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/70 dark:bg-amber-950/20 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2.5 mb-2.5">
              <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                High-Yield Struggle Insights & Clinical Pitfalls
              </h3>
              <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                {report.primaryStrugglePatterns!.length} Pattern
                {report.primaryStrugglePatterns!.length > 1 ? 's' : ''}
              </span>
            </div>
            <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300 pl-7 list-disc">
              {report.primaryStrugglePatterns!.map((pattern, idx) => (
                <li key={idx} className="leading-relaxed">
                  {pattern}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. Two-Column Diagnostic Grid                                        */}
      {/* ==================================================================== */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* ------------------------------------------------------------------ */}
        {/* Left Column: Struggled Structures List                             */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex flex-col border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Struggled Structures & SAR Hurdles
              </h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40">
              {report.struggledStructures.length} Structure
              {report.struggledStructures.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Empty State */}
          {!hasStruggledItems ? (
            <div className="my-auto py-12 px-4 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                No struggled structures detected! Excellent work.
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mt-1">
                You demonstrated flawless structural recall and SAR deduction across all tested
                molecules in this study block.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {report.struggledStructures.map((item: StruggleItem) => {
                const smiles =
                  item.structure?.canonical_smiles ||
                  item.structure?.smiles ||
                  item.structure?.canonicalSmiles;
                const pngUrl = item.structure?.pngUrl;

                return (
                  <div
                    key={item.structureId}
                    className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 rounded-xl p-4 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col gap-2.5"
                  >
                    {/* Top Row: Name and Struggle Count */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                          {item.drugName}
                        </h4>
                        {item.structure?.tradeName && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Trade: {item.structure.tradeName}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-xs px-2.5 py-0.5 rounded-full font-semibold bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
                        {item.struggleCount} struggle{item.struggleCount > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Classes and Module Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.pharmacologicalClass && (
                        <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40">
                          {item.pharmacologicalClass}
                        </span>
                      )}
                      {item.chemicalClass && (
                        <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {item.chemicalClass}
                        </span>
                      )}
                      {item.moduleIds &&
                        item.moduleIds.map((mod) => (
                          <span
                            key={mod}
                            className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                          >
                            {mod}
                          </span>
                        ))}
                    </div>

                    {/* 2D Structure Canvas */}
                    <div className="my-1 flex justify-center bg-slate-50 dark:bg-slate-950/60 rounded-lg p-2 border border-slate-100 dark:border-slate-800/60">
                      {smiles || pngUrl ? (
                        <SmilesCanvas
                          smiles={smiles}
                          fallbackImageUrl={pngUrl}
                          width={180}
                          height={110}
                          className="max-h-[110px]"
                          altText={item.drugName}
                        />
                      ) : (
                        <div className="h-[100px] flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 italic">
                          Chemical structure 2D view unavailable
                        </div>
                      )}
                    </div>

                    {/* Struggle Attribution Reason */}
                    {item.reason && (
                      <div className="bg-amber-50/70 dark:bg-amber-950/30 border-l-4 border-amber-500 p-2.5 rounded-r text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                        <span className="font-semibold">Attribution: </span>
                        {item.reason}
                      </div>
                    )}

                    {/* Key Functional Groups & Target snippet */}
                    {item.structure?.target && (
                      <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Target:
                        </span>
                        <span>{item.structure.target}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Right Column: Class Breakdown & Recall Rates                       */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex flex-col border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Class Breakdown & Recall Rates
              </h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/40">
              {report.classBreakdown.length} Classes Evaluated
            </span>
          </div>

          {report.classBreakdown.length === 0 ? (
            <div className="my-auto py-12 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
              No class breakdown data available for this session.
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
              {report.classBreakdown.map((breakdown: ClassRecallBreakdown) => {
                const colorConfig = getRecallColorClass(breakdown.recallRate);

                return (
                  <div
                    key={breakdown.className}
                    className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 rounded-xl p-3.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span
                        className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate max-w-[70%]"
                        title={breakdown.className}
                      >
                        {breakdown.className}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-bold border ${colorConfig.bg} ${colorConfig.text} ${colorConfig.border}`}
                        >
                          {breakdown.recallRate}%
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          ({breakdown.correct}/{breakdown.total})
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`${colorConfig.bar} h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(0, Math.min(100, breakdown.recallRate))}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Status: {colorConfig.label}</span>
                      <span>
                        {breakdown.recallRate === 100
                          ? 'Fully Retained'
                          : `${breakdown.total - breakdown.correct} missed`}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Weakest Classes Callout */}
              {Array.isArray(report.weakestClasses) && report.weakestClasses.length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 flex items-start gap-2 text-xs text-rose-800 dark:text-rose-300">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <div>
                    <span className="font-bold">Priority Remediation Areas: </span>
                    {report.weakestClasses.join(', ')}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. Remediation Action Footer Bar                                    */}
      {/* ==================================================================== */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
          {hasStruggledItems ? (
            <span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {remediationCandidateIds.length}
              </span>{' '}
              struggled structure{remediationCandidateIds.length !== 1 ? 's' : ''} queued for
              targeted remediation.
            </span>
          ) : (
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              All structures mastered! Ready for standard flashcard cycles or new tests.
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 ml-auto">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Hub
            </button>
          )}

          {onReset && (
            <button
              onClick={onReset}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Session
            </button>
          )}

          {onDrillStruggled && (
            <button
              onClick={() => onDrillStruggled(remediationCandidateIds)}
              disabled={!hasStruggledItems || remediationCandidateIds.length === 0}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Drill Struggled Items Now
              {hasStruggledItems && (
                <span className="ml-1 px-1.5 py-0.2 bg-emerald-700 rounded-full text-xs font-semibold">
                  {remediationCandidateIds.length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
