import React, { useState } from 'react';
import {
  X,
  Moon,
  Sun,
  RotateCcw,
  Eye,
  EyeOff,
  Edit3,
  Sliders,
  Sparkles,
  AlertTriangle,
  Check,
  BookOpen,
  Network,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  hideDrugNames: boolean;
  onToggleHideDrugNames: () => void;
  showKnowledgeGraph: boolean;
  onToggleShowKnowledgeGraph: () => void;
  onResetQuiz: () => void;
  onOpenEditor: () => void;
  activeModuleTitle: string;
  totalQuestions: number;
  answeredQuestions: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  hideDrugNames,
  onToggleHideDrugNames,
  showKnowledgeGraph,
  onToggleShowKnowledgeGraph,
  onResetQuiz,
  onOpenEditor,
  activeModuleTitle,
  totalQuestions,
  answeredQuestions,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleConfirmReset = () => {
    onResetQuiz();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Settings &amp; Preferences
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeModuleTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-150 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Section 1: Appearance & Theme */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Theme &amp; Appearance
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Choose your interface display mode (default: Dark Mode)
                </p>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-150 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (theme !== 'dark') onToggleTheme();
                }}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span>Dark Mode</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-normal">
                      (Default)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    High contrast obsidian canvas
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (theme !== 'light') onToggleTheme();
                }}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-blue-500 bg-blue-50 text-blue-600 font-semibold ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Light Mode
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Crisp clinical daytime theme
                  </div>
                </div>
              </button>
            </div>
          </div>

          <hr className="border-slate-150 dark:border-slate-800" />

          {/* Section 2: Study Controls & Blind Identification */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Study &amp; Self-Testing Controls
            </h3>

            {/* Blind structure name toggle */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  {hideDrugNames ? (
                    <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  <span>Blind Structure Recognition Mode</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Hides drug names from molecular cards so you must identify structures by SAR alone
                </p>
              </div>

              <button
                type="button"
                id="toggle-hide-names-setting"
                name="toggleHideNames"
                onClick={onToggleHideDrugNames}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  hideDrugNames ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    hideDrugNames ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Enable Knowledge Graph (Beta) toggle */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Enable Knowledge Graph (Beta)</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Show the interactive pharmacology graph. Recommended only when a large number of lectures have been ingested.
                </p>
              </div>

              <button
                type="button"
                id="toggle-knowledge-graph-setting"
                name="toggleKnowledgeGraph"
                onClick={onToggleShowKnowledgeGraph}
                role="switch"
                aria-checked={showKnowledgeGraph}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  showKnowledgeGraph ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    showKnowledgeGraph ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Reset Quiz & Session Progress */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                    <span>Reset Review Progress</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Clear answers, placements, and start the review fresh ({answeredQuestions} of {totalQuestions} answered)
                  </p>
                </div>

                {!showResetConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(true)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
                  >
                    Reset Answers
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleConfirmReset}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm Reset</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="px-2 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {showResetConfirm && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>This will clear all matching selections and question responses.</span>
                </div>
              )}
            </div>
          </div>

          <hr className="border-slate-150 dark:border-slate-800" />

          {/* Section 3: Advanced Module & Question Authoring */}
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Question &amp; Module Authoring (Advanced)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tailored for educators and authors to edit questions, rationales, and structures
              </p>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 space-y-3">
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Need to customize question stems, add new sub-statements, adjust correct answer keys, or re-order chemical structures? Use the dedicated Question Studio.
              </p>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEditor();
                }}
                className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Open Question &amp; Structure Editor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-150 dark:border-slate-800 flex items-center justify-end bg-slate-50 dark:bg-slate-850">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
