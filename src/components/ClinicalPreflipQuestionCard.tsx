import React, { useState, useEffect } from 'react';
import type {
  ClinicalPreflipQuestion,
  ClinicalQuestionDomain,
} from '../utils/clinicalQuestionGenerator';
import {
  Check,
  X,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export interface ClinicalPreflipQuestionCardProps {
  question: ClinicalPreflipQuestion;
  onFlipToMonograph: () => void;
  onAnswerSubmitted?: (isFullyCorrect: boolean) => void;
  onOpenClassProfile?: () => void;
  className?: string;
  /**
   * Optional test/controlled initial selections for deterministic evaluation testing
   */
  initialSelectedOptionIds?: string[];
  /**
   * Optional test/controlled initial submission flag
   */
  initialSubmitted?: boolean;
}

const DOMAIN_LABELS: Record<ClinicalQuestionDomain, string> = {
  'brand-names': 'Brand Names',
  'contraindications': 'Contraindications',
  'adverse-effects': 'Adverse Effects & Boxed Warnings',
  'subclass-exceptions': 'Subclass Exceptions',
  'dosing-pearls': 'Dosing Pearls',
};

const DOMAIN_BADGE_STYLES: Record<ClinicalQuestionDomain, string> = {
  'brand-names': 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  'contraindications': 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  'adverse-effects': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  'subclass-exceptions': 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  'dosing-pearls': 'bg-teal-500/15 text-teal-300 border-teal-500/30',
};

/**
 * Interactive Pre-Flip Question Card Component
 *
 * Renders targeted clinical micro-drills (MCQ & SATA) directly on the flashcard
 * front face prior to flipping. Features 3-state post-submission visual evaluation
 * (selected-correct, selected-incorrect, unselected-missed), spacebar/click event
 * insulation, and neutral class profile access.
 */
export const ClinicalPreflipQuestionCard: React.FC<ClinicalPreflipQuestionCardProps> = ({
  question,
  onFlipToMonograph,
  onAnswerSubmitted,
  onOpenClassProfile,
  className = '',
  initialSelectedOptionIds,
  initialSubmitted,
}) => {
  const [selectedOptionIds, setSelectedOptionIds] = useState<Set<string>>(() => {
    return new Set(initialSelectedOptionIds || []);
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(initialSubmitted ?? false);

  // Reset state when question changes unless in test mode
  useEffect(() => {
    if (initialSelectedOptionIds === undefined && initialSubmitted === undefined) {
      setSelectedOptionIds(new Set());
      setIsSubmitted(false);
    }
  }, [question.id, initialSelectedOptionIds, initialSubmitted]);

  // Evaluates whether the submission is 100% correct
  const isFullyCorrect = question.options.every((opt) =>
    opt.isCorrect ? selectedOptionIds.has(opt.id) : !selectedOptionIds.has(opt.id)
  );

  // Keyboard guard: prevent spacebar and enter from bubbling up to card-flip triggers
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Spacebar' || e.code === 'Space' || e.key === 'Enter') {
      e.stopPropagation();
    }
  };

  const handleToggleOption = (optionId: string) => {
    if (isSubmitted) return;

    if (question.type === 'mcq') {
      setSelectedOptionIds(new Set([optionId]));
    } else {
      setSelectedOptionIds((prev) => {
        const next = new Set(prev);
        if (next.has(optionId)) {
          next.delete(optionId);
        } else {
          next.add(optionId);
        }
        return next;
      });
    }
  };

  const handleCheckAnswer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedOptionIds.size === 0 || isSubmitted) return;

    setIsSubmitted(true);
    onAnswerSubmitted?.(isFullyCorrect);
  };

  const domainLabel = DOMAIN_LABELS[question.domain] || question.domain;
  const domainBadgeStyle =
    DOMAIN_BADGE_STYLES[question.domain] || 'bg-slate-500/15 text-slate-300 border-slate-500/30';

  return (
    <div
      className={`flex flex-col gap-3.5 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 shadow-xl ${className}`}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={handleKeyDown}
    >
      {/* Header: Domain Badge, Question Type, Prompt */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${domainBadgeStyle}`}
            >
              {domainLabel}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800 text-slate-300">
              {question.type === 'mcq' ? 'MCQ' : 'SATA'}
            </span>
          </div>

          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-slate-400" />
            {question.type === 'mcq'
              ? 'Select the single best answer'
              : 'Select All That Apply'}
          </span>
        </div>

        <h3 className="text-sm md:text-base font-medium text-slate-100 leading-snug">
          {question.prompt}
        </h3>
      </div>

      {/* Options List */}
      <div className="flex flex-col gap-2 my-1">
        {question.options.map((opt) => {
          const isSelected = selectedOptionIds.has(opt.id);

          // 3-State visual evaluation styling
          let optionRowStyle =
            'flex items-start gap-3 p-3 rounded-xl border text-left transition-all ';
          let statusBadge = null;
          let indicatorIcon = null;

          if (!isSubmitted) {
            optionRowStyle += isSelected
              ? 'border-indigo-500 bg-indigo-950/30 text-indigo-100 shadow-xs cursor-pointer'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-200 cursor-pointer';
          } else {
            // Post-submission 3-State evaluation
            if (isSelected && opt.isCorrect) {
              // 1. Correctly selected: Emerald highlight + Check
              optionRowStyle +=
                'border-emerald-500 bg-emerald-950/40 text-emerald-100 ring-1 ring-emerald-500/50';
              indicatorIcon = <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
              statusBadge = (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                  Correct
                </span>
              );
            } else if (isSelected && !opt.isCorrect) {
              // 2. Incorrectly selected: Rose highlight + X
              optionRowStyle +=
                'border-rose-500 bg-rose-950/40 text-rose-100 ring-1 ring-rose-500/50';
              indicatorIcon = <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />;
              statusBadge = (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                  Incorrect
                </span>
              );
            } else if (!isSelected && opt.isCorrect) {
              // 3. Unselected & missed: Amber dashed border + alert icon
              optionRowStyle +=
                'border-dashed border-amber-500 bg-amber-950/20 text-amber-200';
              indicatorIcon = (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              );
              statusBadge = (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Missed
                </span>
              );
            } else {
              // Unselected distractor: neutral muted
              optionRowStyle += 'border-slate-800 bg-slate-900/30 text-slate-400 opacity-60';
            }
          }

          return (
            <label
              key={opt.id}
              className={optionRowStyle}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleOption(opt.id);
              }}
              onKeyDown={handleKeyDown}
            >
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type={question.type === 'mcq' ? 'radio' : 'checkbox'}
                  name={`question-${question.id}`}
                  value={opt.id}
                  checked={isSelected}
                  disabled={isSubmitted}
                  onChange={() => {}} // Controlled by label click handler
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={handleKeyDown}
                  className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 bg-slate-800 cursor-pointer disabled:cursor-default"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs md:text-sm leading-relaxed">{opt.text}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {statusBadge}
                    {indicatorIcon}
                  </div>
                </div>

                {/* Option Explanation on Evaluation */}
                {isSubmitted && opt.explanation && (
                  <p className="mt-1 text-[11px] text-slate-300 italic border-t border-slate-800/60 pt-1">
                    {opt.explanation}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Result Feedback Banner */}
      {isSubmitted && (
        <div
          className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${
            isFullyCorrect
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-100'
              : 'bg-rose-950/50 border-rose-500/40 text-rose-100'
          }`}
        >
          {isFullyCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-xs leading-relaxed">
            <p className="font-bold text-sm">
              {isFullyCorrect ? '🎉 Correct!' : '⚠️ Review Needed'}
            </p>
            {question.explanation && (
              <p className="mt-1 text-slate-300">
                {question.explanation}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {onOpenClassProfile && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenClassProfile();
              }}
              onKeyDown={handleKeyDown}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>📖 Class Profile</span>
            </button>
          )}

          {!isSubmitted && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFlipToMonograph();
              }}
              onKeyDown={handleKeyDown}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Skip / Flip to Monograph
            </button>
          )}
        </div>

        <div>
          {!isSubmitted ? (
            <button
              type="button"
              disabled={selectedOptionIds.size === 0}
              onClick={handleCheckAnswer}
              onKeyDown={handleKeyDown}
              className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
                selectedOptionIds.size === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-900/30 cursor-pointer'
              }`}
            >
              Check Answer
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFlipToMonograph();
              }}
              onKeyDown={handleKeyDown}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-900/30 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>Reveal Clinical Monograph →</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
