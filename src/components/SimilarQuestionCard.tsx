import React, { useState } from 'react';
import { SimilarQuestion } from '../data/quizData';
import { Microscope, CheckCircle2, XCircle, Eye, Sparkles, Loader2 } from 'lucide-react';

interface SimilarQuestionCardProps {
  similarQ: SimilarQuestion;
  topicTitle?: string;
  onClose: () => void;
}

export const SimilarQuestionCard: React.FC<SimilarQuestionCardProps> = ({
  similarQ: initialSimilarQ,
  topicTitle,
  onClose,
}) => {
  const [activeQ, setActiveQ] = useState<SimilarQuestion>(initialSimilarQ);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [expandedRationale, setExpandedRationale] = useState<number | null>(null);
  const [generatingVariant, setGeneratingVariant] = useState(false);

  // Sync if prop changes
  React.useEffect(() => {
    setActiveQ(initialSimilarQ);
    setSelectedIdx(null);
    setIsRevealed(false);
    setExpandedRationale(null);
  }, [initialSimilarQ]);

  const handleSelect = (idx: number) => {
    if (isRevealed) {
      setExpandedRationale(expandedRationale === idx ? null : idx);
      return;
    }
    setSelectedIdx(idx);
  };

  const handleReveal = () => {
    if (selectedIdx === null) return;
    setIsRevealed(true);
  };

  const handleGenerateExtra = async () => {
    setGeneratingVariant(true);
    try {
      const res = await fetch('/api/gemini/generate-similar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicTitle || 'Anemia Hematology',
          baseQuestion: activeQ.question,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.question && data.question.options) {
          setActiveQ({
            question: data.question.question,
            options: data.question.options,
            correctIndex: data.question.correctIndex ?? 0,
            explanation: data.question.explanation || '',
            optionExplanations: data.question.optionExplanations || [],
          });
          setSelectedIdx(null);
          setIsRevealed(false);
          setExpandedRationale(null);
        }
      }
    } catch (err) {
      console.error('Failed to generate variant:', err);
    } finally {
      setGeneratingVariant(false);
    }
  };

  return (
    <div className="mt-6 bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-emerald-700/60 rounded-2xl shadow-md overflow-hidden transition-all">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 dark:from-emerald-700 dark:to-teal-800 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/50 flex items-center justify-center">
            <Microscope className="w-4 h-4 text-emerald-100" />
          </div>
          <div>
            <h3 className="font-bold text-sm md:text-base">Paired Clinical Concept Check</h3>
            <p className="text-xs text-emerald-100">Reinforce your understanding of the underlying physiology</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateExtra}
            disabled={generatingVariant}
            className="text-xs bg-white/20 hover:bg-white/30 text-white font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
            title="Generate another board question with Gemini AI"
          >
            {generatingVariant ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            )}
            <span>AI Variant</span>
          </button>
          <button
            onClick={onClose}
            className="text-emerald-100 hover:text-white p-1 rounded-md text-lg leading-none"
            title="Close concept check"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-5 leading-snug">
          {activeQ.question}
        </h4>

        {/* Options */}
        <div className="space-y-2.5 mb-6">
          {activeQ.options.map((opt, idx) => {
            const isCorrect = idx === activeQ.correctIndex;
            const isSelected = idx === selectedIdx;

            let optionStyle =
              'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 hover:border-emerald-200 dark:hover:border-emerald-600 text-slate-800 dark:text-slate-200';

            if (isRevealed) {
              if (isCorrect) {
                optionStyle =
                  'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500 ring-1 ring-emerald-500 text-emerald-950 dark:text-emerald-200 font-semibold';
              } else if (isSelected) {
                optionStyle =
                  'bg-red-50 dark:bg-rose-950/40 border-red-400 dark:border-rose-500 text-red-950 dark:text-rose-200';
              } else {
                optionStyle =
                  'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60';
              }
            } else if (isSelected) {
              optionStyle =
                'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-500 ring-1 ring-emerald-400 text-emerald-900 dark:text-emerald-200 font-semibold';
            }

            return (
              <div key={idx} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition-all flex items-start justify-between gap-3 ${optionStyle}`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-4 h-4 mt-0.5 rounded-full border flex-shrink-0 flex items-center justify-center text-[10px] ${
                        isSelected || (isRevealed && isCorrect)
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {isSelected || (isRevealed && isCorrect) ? '✓' : ''}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </div>

                  {isRevealed && (
                    <div className="flex-shrink-0 ml-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-red-500 dark:text-rose-400" />
                      ) : null}
                    </div>
                  )}
                </button>

                {/* Option rationale if revealed */}
                {isRevealed && activeQ.optionExplanations && activeQ.optionExplanations[idx] && (
                  <div className="mt-1.5 ml-6 p-2.5 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-lg text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                    <span className="font-semibold text-emerald-950 dark:text-emerald-300">Option Rationale: </span>
                    {activeQ.optionExplanations[idx]}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action button */}
        {!isRevealed ? (
          <button
            type="button"
            disabled={selectedIdx === null}
            onClick={handleReveal}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-xs md:text-sm shadow-sm transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Check Answer
          </button>
        ) : (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-4 text-xs md:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed">
            <div className="font-bold mb-1 flex items-center gap-1.5 text-emerald-900 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Core Concept Takeaway:
            </div>
            <p>{activeQ.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};
