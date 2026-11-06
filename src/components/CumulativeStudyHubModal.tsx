import React, { useState, useEffect, useMemo } from 'react';
import type {
  StruggleDiagnosticReport,
  FlashcardItem,
} from '../types/cumulativeStudy';
import { getCumulativeQuestionBank } from '../data/cumulativeQuizData';
import { harvestCumulativeFlashcards } from '../utils/cumulativeStructureHarvester';
import { generateStruggleReport } from '../utils/struggleDiagnosticService';
import { CumulativePracticeTestView } from './CumulativePracticeTestView';
import { StructureFlashcardDeck } from './StructureFlashcardDeck';
import { StruggleDiagnosticOverview } from './StruggleDiagnosticOverview';
import {
  GraduationCap,
  X,
  Layers,
  Activity,
  Sparkles,
  BookOpenCheck,
  RotateCcw,
  Flame,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export interface CumulativeStudyHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'practice-test' | 'flashcards' | 'diagnostics';
}

export type CumulativeStudyTab = 'practice-test' | 'flashcards' | 'diagnostics';

/**
 * Cumulative MedChem Study Hub Modal
 *
 * Unifies the three high-yield cumulative learning workflows:
 * 1. Practice Test: Cross-curriculum SAR deduction with multi-select scoring
 * 2. Structure Flashcards: Anki-style rapid structure-to-class recall deck
 * 3. Struggle Diagnostics: Friction-point post-session breakdown & 1-click drill generator
 */
export const CumulativeStudyHubModal: React.FC<CumulativeStudyHubModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'practice-test',
}) => {
  const [activeTab, setActiveTab] = useState<CumulativeStudyTab>(initialTab);
  const [activeReport, setActiveReport] = useState<StruggleDiagnosticReport | null>(null);
  const [drillCandidateIds, setDrillCandidateIds] = useState<string[]>([]);

  // Update active tab if initialTab changes while open
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Keyboard Escape listener to close modal
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

  // Harvest curriculum chemical structures for flashcard deck
  const harvestedCards = useMemo(() => {
    return harvestCumulativeFlashcards();
  }, []);

  // Base question bank across all cardiovascular modules
  const baseQuestions = useMemo(() => {
    return getCumulativeQuestionBank();
  }, []);

  // Filter or prioritize questions when drilling struggled items from diagnostics
  const activeQuestions = useMemo(() => {
    if (drillCandidateIds.length === 0) {
      return baseQuestions;
    }

    const drillSet = new Set(drillCandidateIds.map((id) => id.toLowerCase().trim()));

    const matchingQuestions = baseQuestions.filter((q) => {
      // Check candidate structures (Types A, C, D)
      if (
        Array.isArray(q.candidateStructures) &&
        q.candidateStructures.some(
          (s) =>
            drillSet.has(s.id.toLowerCase().trim()) ||
            (s.name && drillSet.has(s.name.toLowerCase().trim())) ||
            (s.document_label && drillSet.has(s.document_label.toLowerCase().trim()))
        )
      ) {
        return true;
      }

      // Check single structure (Type B)
      if (
        q.singleStructure &&
        (drillSet.has(q.singleStructure.id.toLowerCase().trim()) ||
          (q.singleStructure.name && drillSet.has(q.singleStructure.name.toLowerCase().trim())) ||
          (q.singleStructure.document_label &&
            drillSet.has(q.singleStructure.document_label.toLowerCase().trim())))
      ) {
        return true;
      }

      // Check correct structure IDs
      if (
        Array.isArray(q.correctStructureIds) &&
        q.correctStructureIds.some((id) => drillSet.has(id.toLowerCase().trim()))
      ) {
        return true;
      }

      return false;
    });

    return matchingQuestions.length > 0 ? matchingQuestions : baseQuestions;
  }, [baseQuestions, drillCandidateIds]);

  if (!isOpen) {
    return null;
  }

  // Handle Practice Test completion
  const handlePracticeTestComplete = (report: StruggleDiagnosticReport) => {
    setActiveReport(report);
    setActiveTab('diagnostics');
  };

  // Handle Flashcard Deck completion
  const handleFlashcardSessionComplete = (
    struggledCards: FlashcardItem[],
    fullDeck: FlashcardItem[]
  ) => {
    const reportDeck = fullDeck.length > 0 ? fullDeck : struggledCards;
    const report = generateStruggleReport({
      sessionType: 'flashcards',
      flashcardHistory: reportDeck,
    });
    setActiveReport(report);
    setActiveTab('diagnostics');
  };

  // Handle drilling struggled structures from diagnostics overview
  const handleDrillStruggled = (remediationIds: string[]) => {
    setDrillCandidateIds(remediationIds);
    setActiveTab('practice-test');
  };

  // Handle resetting diagnostics to start clean
  const handleResetDiagnostics = () => {
    setDrillCandidateIds([]);
    setActiveReport(null);
    setActiveTab('practice-test');
  };

  const tabs: Array<{
    id: CumulativeStudyTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }> = [
    {
      id: 'practice-test',
      label: 'Practice Test',
      icon: BookOpenCheck,
      badge: drillCandidateIds.length > 0 ? `Drill (${drillCandidateIds.length})` : undefined,
    },
    {
      id: 'flashcards',
      label: 'Structure Flashcards',
      icon: Layers,
      badge: `${harvestedCards.length} Cards`,
    },
    {
      id: 'diagnostics',
      label: 'Struggle Diagnostics',
      icon: Activity,
      badge: activeReport ? `${activeReport.scorePercentage}%` : undefined,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cumulative-hub-title"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ==================================================== */}
        {/* MODAL HEADER                                         */}
        {/* ==================================================== */}
        <header className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2
                id="cumulative-hub-title"
                className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 truncate"
              >
                <span>Cumulative MedChem Study Hub</span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Cross-Curriculum
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Cross-Curriculum SAR Deduction &amp; Rapid Structure-to-Class Recall
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Close Study Hub (Esc)"
            aria-label="Close Study Hub"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* ==================================================== */}
        {/* TAB NAVIGATION BAR                                   */}
        {/* ==================================================== */}
        <nav
          className="px-5 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 overflow-x-auto"
          aria-label="Cumulative Hub Tabs"
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {drillCandidateIds.length > 0 && activeTab === 'practice-test' && (
            <button
              type="button"
              onClick={() => setDrillCandidateIds([])}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
              title="Clear remediation drill filter and restore full question bank"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filter</span>
            </button>
          )}
        </nav>

        {/* ==================================================== */}
        {/* ACTIVE TAB CONTENT                                   */}
        {/* ==================================================== */}
        <main className="flex-1 overflow-y-auto min-h-0 bg-slate-50/50 dark:bg-slate-950/50">
          {/* TAB 1: PRACTICE TEST VIEW */}
          {activeTab === 'practice-test' && (
            <div className="p-3 sm:p-6 space-y-4">
              {drillCandidateIds.length > 0 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>
                      <strong className="font-bold">Targeted Remediation Active:</strong> Showing{' '}
                      {activeQuestions.length} practice question
                      {activeQuestions.length === 1 ? '' : 's'} addressing your {drillCandidateIds.length} struggled molecule
                      {drillCandidateIds.length === 1 ? '' : 's'}.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrillCandidateIds([])}
                    className="font-bold underline hover:no-underline text-amber-700 dark:text-amber-300 cursor-pointer shrink-0"
                  >
                    Show Full Bank
                  </button>
                </div>
              )}

              <CumulativePracticeTestView
                questions={activeQuestions}
                onComplete={handlePracticeTestComplete}
                onClose={onClose}
              />
            </div>
          )}

          {/* TAB 2: RAPID STRUCTURE FLASHCARDS */}
          {activeTab === 'flashcards' && (
            <div className="p-3 sm:p-6">
              <StructureFlashcardDeck
                cards={harvestedCards}
                onSessionComplete={handleFlashcardSessionComplete}
                onClose={onClose}
              />
            </div>
          )}

          {/* TAB 3: STRUGGLE DIAGNOSTICS OVERVIEW */}
          {activeTab === 'diagnostics' && (
            <div className="p-3 sm:p-6">
              {activeReport ? (
                <StruggleDiagnosticOverview
                  report={activeReport}
                  onDrillStruggled={handleDrillStruggled}
                  onReset={handleResetDiagnostics}
                  onClose={onClose}
                />
              ) : (
                /* Inviting empty state when no diagnostic session has been generated yet */
                <div className="p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm my-6">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center shadow-2xs">
                    <Activity className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      No Diagnostic Session Completed Yet
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      Complete a cross-curriculum practice test or run a structure recall flashcard
                      session to analyze your friction points, class recall breakdown, and unlock
                      1-click targeted remediation drills.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('practice-test')}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                    >
                      <BookOpenCheck className="w-4 h-4" />
                      <span>Start Practice Test</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('flashcards')}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      <Layers className="w-4 h-4 text-indigo-500" />
                      <span>Launch Flashcards</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
