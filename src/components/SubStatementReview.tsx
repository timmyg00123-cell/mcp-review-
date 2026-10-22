import React, { useState } from 'react';
import { SubStatement } from '../data/antiplateletQuizData';
import { CheckCircle2, XCircle, HelpCircle, RotateCcw, Eye, Sparkles } from 'lucide-react';

interface SubStatementReviewProps {
  statements: SubStatement[];
  questionId: number;
  onAllCompleted?: (score: { correct: number; total: number }) => void;
}

export const SubStatementReview: React.FC<SubStatementReviewProps> = ({
  statements,
  questionId,
  onAllCompleted,
}) => {
  // State maps statement id ('a', 'b', etc.) to user's selected boolean (true or false)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, boolean | null>>({});
  const [revealedRationales, setRevealedRationales] = useState<Record<string, boolean>>({});

  const handleSelect = (stmtId: string, answer: boolean) => {
    const updated = { ...selectedAnswers, [stmtId]: answer };
    setSelectedAnswers(updated);
    // Auto-reveal rationale when answered
    setRevealedRationales((prev) => ({ ...prev, [stmtId]: true }));

    // Check if all are answered
    const total = statements.length;
    const answeredCount = Object.keys(updated).filter((k) => updated[k] !== null).length;
    if (answeredCount === total && onAllCompleted) {
      let correct = 0;
      statements.forEach((s) => {
        if (updated[s.id] === s.isCorrect) correct++;
      });
      onAllCompleted({ correct, total });
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setRevealedRationales({});
  };

  const handleRevealAll = () => {
    const allAnswers: Record<string, boolean> = {};
    const allRevealed: Record<string, boolean> = {};
    statements.forEach((s) => {
      allAnswers[s.id] = s.isCorrect;
      allRevealed[s.id] = true;
    });
    setSelectedAnswers(allAnswers);
    setRevealedRationales(allRevealed);
  };

  const answeredCount = Object.keys(selectedAnswers).filter((k) => selectedAnswers[k] !== null).length;
  const correctCount = statements.filter((s) => selectedAnswers[s.id] === s.isCorrect).length;

  return (
    <div className="space-y-4">
      {/* Sub-Score & Control Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-xs border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            Statement Check:
          </span>
          <span className="font-mono tabular-nums text-slate-900 dark:text-slate-100">
            {answeredCount}/{statements.length} answered
          </span>
          {answeredCount > 0 && (
            <span
              className={`font-mono font-bold px-1.5 py-0.5 rounded ${
                correctCount === statements.length
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
              }`}
            >
              {correctCount} correct
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRevealAll}
            className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Reveal All</span>
          </button>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* List of Statements */}
      <div className="space-y-3">
        {statements.map((stmt) => {
          const userChoice = selectedAnswers[stmt.id];
          const isAnswered = userChoice !== undefined && userChoice !== null;
          const isUserCorrect = isAnswered && userChoice === stmt.isCorrect;
          const isRationaleOpen = revealedRationales[stmt.id];

          return (
            <div
              key={stmt.id}
              className={`p-3.5 rounded-xl border transition-all duration-200 ${
                isAnswered
                  ? isUserCorrect
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                    : 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                {/* Statement Text with Letter Prefix */}
                <div className="flex items-start gap-2.5 flex-1">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 shrink-0 mt-0.5">
                    {stmt.id})
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug">
                      {stmt.statement}
                    </p>
                    {stmt.keyPharmacophore && (
                      <span className="inline-block text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        Focus: {stmt.keyPharmacophore}
                      </span>
                    )}
                  </div>
                </div>

                {/* Interactive True / False Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                  <button
                    onClick={() => handleSelect(stmt.id, true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      userChoice === true
                        ? stmt.isCorrect === true
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-rose-600 text-white shadow-xs'
                        : isAnswered && stmt.isCorrect === true
                        ? 'border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>True</span>
                    {userChoice === true && (
                      stmt.isCorrect === true ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )
                    )}
                  </button>

                  <button
                    onClick={() => handleSelect(stmt.id, false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      userChoice === false
                        ? stmt.isCorrect === false
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-rose-600 text-white shadow-xs'
                        : isAnswered && stmt.isCorrect === false
                        ? 'border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>False</span>
                    {userChoice === false && (
                      stmt.isCorrect === false ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )
                    )}
                  </button>
                </div>
              </div>

              {/* Instant SAR Rationale Feedback */}
              {isRationaleOpen && (
                <div
                  className={`mt-3 pt-2.5 border-t text-xs leading-relaxed ${
                    isUserCorrect
                      ? 'border-emerald-200 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-200'
                      : 'border-rose-200 dark:border-rose-800/40 text-rose-950 dark:text-rose-200'
                  }`}
                >
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold shrink-0">
                      [{stmt.isCorrect ? 'TRUE' : 'FALSE'}]:
                    </span>
                    <span>{stmt.rationale}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
