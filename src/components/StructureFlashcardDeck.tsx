import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { FlashcardItem, SpacedRepetitionRating } from '../types/cumulativeStudy';
import {
  applySpacedRepetitionGrade,
  recordCardProgress,
  reQueueActiveSession,
  toggleCardSuspension,
  applyProgressToCards,
} from '../utils/spacedRepetitionService';
import { StructureFlashcardCardFace } from './StructureFlashcardCardFace';
import {
  CheckCircle2,
  X,
  Filter,
  Layers,
  RotateCcw,
} from 'lucide-react';

export interface StructureFlashcardDeckProps {
  cards: FlashcardItem[];
  onSessionComplete: (struggledCards: FlashcardItem[], fullDeck: FlashcardItem[]) => void;
  onClose?: () => void;
}

export interface ModuleCategory {
  key: string;
  label: string;
  matchPattern: RegExp;
}

export type ModuleFilterState = Record<string, boolean>;

export const KNOWN_MODULE_CATEGORIES: ModuleCategory[] = [
  { key: 'renal', label: 'Renal', matchPattern: /renal/i },
  { key: 'respiratory', label: 'Respiratory', matchPattern: /respirat|broncho|antiinflam/i },
  { key: 'antiplatelets', label: 'Antiplatelet', matchPattern: /platelet/i },
  { key: 'anticoagulants', label: 'Anticoagulant', matchPattern: /coagul/i },
  { key: 'heartFailure', label: 'Heart Failure', matchPattern: /heart|failure/i },
  { key: 'antiarrhythmics', label: 'Antiarrhythmic', matchPattern: /arrhythm/i },
  { key: 'antihypertensives', label: 'Antihypertensive', matchPattern: /hypertens|diuretic|vasodilat|raas|sympatho/i },
  { key: 'antihyperlipidemics', label: 'Antihyperlipidemic', matchPattern: /lipid/i },
];

function formatModuleLabel(id: string): string {
  const clean = id.replace(/_mcp2$|_review$|_drugs$/i, '').replace(/_/g, ' ');
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

/**
 * Derives available module filter categories dynamically from the current cards.
 * If cards contain module IDs matching known categories (e.g. Renal, Respiratory,
 * Antiplatelet, Anticoagulant, Heart Failure, Antiarrhythmic), those categories are returned.
 * Any additional unique module IDs are formatted into friendly labels.
 */
export function getAvailableModuleFilters(cards: FlashcardItem[]): ModuleCategory[] {
  if (!cards || cards.length === 0) {
    return KNOWN_MODULE_CATEGORIES.slice(0, 4); // Default fallback
  }

  const allModuleIds = new Set<string>();
  for (const card of cards) {
    if (card.moduleIds) {
      for (const mId of card.moduleIds) {
        if (mId) allModuleIds.add(mId);
      }
    }
  }

  if (allModuleIds.size === 0) {
    return KNOWN_MODULE_CATEGORIES.slice(0, 4);
  }

  const result: ModuleCategory[] = [];
  const matchedModuleIds = new Set<string>();

  for (const cat of KNOWN_MODULE_CATEGORIES) {
    let hasMatch = false;
    for (const mId of allModuleIds) {
      if (cat.matchPattern.test(mId)) {
        hasMatch = true;
        matchedModuleIds.add(mId);
      }
    }
    if (hasMatch) {
      result.push(cat);
    }
  }

  for (const mId of allModuleIds) {
    if (!matchedModuleIds.has(mId)) {
      result.push({
        key: mId,
        label: formatModuleLabel(mId),
        matchPattern: new RegExp(mId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      });
    }
  }

  return result.length > 0 ? result : KNOWN_MODULE_CATEGORIES.slice(0, 4);
}

/**
 * Checks whether a flashcard belongs to any of the currently selected module filters.
 * Any card from the active deck is included by default when all its matching filters are active.
 */
export function cardMatchesModuleFilter(
  card: FlashcardItem,
  filter: ModuleFilterState,
  availableFilters?: ModuleCategory[]
): boolean {
  if (!card.moduleIds || card.moduleIds.length === 0) {
    return true;
  }

  const categories =
    availableFilters && availableFilters.length > 0
      ? availableFilters
      : KNOWN_MODULE_CATEGORIES;

  const matchingCategories = categories.filter((cat) =>
    card.moduleIds.some((modId) => cat.matchPattern.test(modId))
  );

  // If card's modules don't match any filter categories, include it by default
  if (matchingCategories.length === 0) {
    return true;
  }

  // Include card if at least one matching category is enabled (not unchecked)
  return matchingCategories.some((cat) => filter[cat.key] !== false);
}

/**
 * Anki-Style Flashcard Component for Rapid Chemical Structure Recall
 *
 * Implements:
 * - Blinded front card: High-contrast 2D chemical structure with zoom modal and prompt.
 * - Comprehensive Option B back card: Two-column split deck with reference properties,
 *   pharmacophore tags, clinical pharmacology (metabolism, BBB, pregnancy risk), and SAR notes.
 * - 4-interval spaced repetition bar: Again (< 1 min), Hard (4 min), Good (10 min), Easy (1 day).
 * - Keyboard shortcuts: Space (flip), 1 (Again), 2 (Hard), 3 (Good), 4 (Easy) with input focus guard.
 * - Module filter toggles (Dynamic exam-aware categories including Renal, Respiratory, Antiplatelets, etc.).
 * - Active session counters (Remaining, In-session, Graduated).
 */
export const StructureFlashcardDeck: React.FC<StructureFlashcardDeckProps> = ({
  cards,
  onSessionComplete,
  onClose,
}) => {
  // Master working deck initialized with persisted local storage progress
  const [deck, setDeck] = useState<FlashcardItem[]>(() => applyProgressToCards(cards));

  // Dynamic available module categories derived from cards
  const availableFilters = useMemo(() => getAvailableModuleFilters(cards), [cards]);

  // Module filter toggles
  const [moduleFilter, setModuleFilter] = useState<ModuleFilterState>(() => {
    const initial: ModuleFilterState = {};
    const filters = getAvailableModuleFilters(cards);
    for (const f of filters) {
      initial[f.key] = true;
    }
    return initial;
  });

  // Active in-session queue and position index
  const [activeQueue, setActiveQueue] = useState<FlashcardItem[]>(() => {
    const initialized = applyProgressToCards(cards);
    const filters = getAvailableModuleFilters(cards);
    const initialFilterState: ModuleFilterState = {};
    for (const f of filters) {
      initialFilterState[f.key] = true;
    }
    return initialized.filter(
      (c) => !c.isSuspended && cardMatchesModuleFilter(c, initialFilterState, filters)
    );
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Restart deck handler (resets active queue to full filtered deck, currentIndex to 0, isFlipped to false)
  const handleRestartDeck = useCallback(() => {
    const initialized = applyProgressToCards(cards);
    const filtered = initialized.filter(
      (c) => !c.isSuspended && cardMatchesModuleFilter(c, moduleFilter, availableFilters)
    );
    setActiveQueue(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [cards, moduleFilter, availableFilters]);

  // Sync state if cards prop identity updates
  useEffect(() => {
    const withProgress = applyProgressToCards(cards);
    setDeck(withProgress);
    const filters = getAvailableModuleFilters(cards);
    const nextFilterState: ModuleFilterState = {};
    for (const f of filters) {
      nextFilterState[f.key] = true;
    }
    setModuleFilter(nextFilterState);
    setActiveQueue(
      withProgress.filter(
        (c) => !c.isSuspended && cardMatchesModuleFilter(c, nextFilterState, filters)
      )
    );
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [cards]);

  // Handle module filter change
  const handleToggleModule = (moduleKey: string, checked: boolean) => {
    const nextFilter = { ...moduleFilter, [moduleKey]: checked };
    setModuleFilter(nextFilter);
    const nextFiltered = deck.filter(
      (c) => !c.isSuspended && cardMatchesModuleFilter(c, nextFilter, availableFilters)
    );
    setActiveQueue(nextFiltered);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const currentCard = activeQueue[currentIndex] as FlashcardItem | undefined;

  // Active session queue counters
  const remainingCount = Math.max(0, activeQueue.length - currentIndex);
  const inSessionCount = activeQueue.length;
  const graduatedCount = deck.filter(
    (c) =>
      !c.isSuspended &&
      cardMatchesModuleFilter(c, moduleFilter, availableFilters) &&
      (c.state === 'review' || c.state === 'mastered')
  ).length;

  // Spaced repetition rating handler
  const handleGrade = useCallback(
    (rating: SpacedRepetitionRating) => {
      if (!currentCard) return;

      const result = applySpacedRepetitionGrade(currentCard, rating);
      const nextCard = result.nextCardState;

      // Persist progress to local storage
      recordCardProgress(nextCard);

      // Update master deck
      setDeck((prevDeck) =>
        prevDeck.map((c) => (c.structureId === nextCard.structureId ? nextCard : c))
      );

      // In-session re-queuing
      const updatedQueue = reQueueActiveSession(
        activeQueue,
        currentIndex,
        nextCard,
        result.reQueueOffset
      );
      setActiveQueue(updatedQueue);

      // Reset card face and advance
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    },
    [currentCard, activeQueue, currentIndex]
  );

  // Suspend card toggle
  const handleToggleSuspend = useCallback(() => {
    if (!currentCard) return;

    const updated = toggleCardSuspension(currentCard);
    recordCardProgress(updated);

    setDeck((prevDeck) =>
      prevDeck.map((c) => (c.structureId === updated.structureId ? updated : c))
    );

    if (updated.isSuspended) {
      // Remove subsequent occurrences from current active queue
      const nextQueue = activeQueue.filter(
        (c, idx) => idx <= currentIndex || c.structureId !== updated.structureId
      );
      setActiveQueue(nextQueue);
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setActiveQueue((prev) =>
        prev.map((c, idx) => (idx === currentIndex ? updated : c))
      );
    }
  }, [currentCard, activeQueue, currentIndex]);

  // Finish session early
  const handleFinishEarly = useCallback(() => {
    const struggled = deck.filter((c) => (c.struggleCount ?? 0) > 0);
    onSessionComplete(struggled, deck);
  }, [deck, onSessionComplete]);

  // Keyboard shortcut listener: Space (flip), 1 (Again), 2 (Hard), 3 (Good), 4 (Easy)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Guard against typing in form inputs, textareas, or contenteditable elements
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped) {
        if (e.key === '1') {
          e.preventDefault();
          handleGrade('again');
        } else if (e.key === '2') {
          e.preventDefault();
          handleGrade('hard');
        } else if (e.key === '3') {
          e.preventDefault();
          handleGrade('good');
        } else if (e.key === '4') {
          e.preventDefault();
          handleGrade('easy');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFlipped, handleGrade]);

  // Session completion view when active queue is exhausted
  if (!currentCard || activeQueue.length === 0 || currentIndex >= activeQueue.length) {
    const struggled = deck.filter((c) => (c.struggleCount ?? 0) > 0);
    return (
      <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl text-center flex flex-col items-center text-slate-900 dark:text-slate-100">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Flashcard Session Complete!</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
          All chemical structures in this active session queue have graduated or been scheduled for future review.
        </p>

        <div className="w-full max-w-sm grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 mb-6 text-sm">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total In-Session</div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {activeQueue.length}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Struggled Structures</div>
            <div className="text-lg font-bold text-rose-600 dark:text-rose-400">
              {struggled.length}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            type="button"
            onClick={handleRestartDeck}
            className="px-6 py-2.5 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Full Deck
          </button>
          <button
            type="button"
            onClick={() => onSessionComplete(struggled, deck)}
            className="px-6 py-2.5 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            View Struggle Diagnostics
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close Deck
            </button>
          )}
        </div>
      </div>
    );
  }

  const structure = currentCard.structure;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl flex flex-col gap-5 text-slate-900 dark:text-slate-100">
      {/* Top Bar Header */}
      <div className="flex flex-col gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Rapid Structure Recall Deck
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Spaced repetition chemical structure recognition & pharmacophore identification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleFinishEarly}
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 underline decoration-slate-300 dark:decoration-slate-600 cursor-pointer"
            >
              Finish Session Early
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close Deck"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Module Filter Toggles & Session Counters */}
        <div className="flex items-center justify-between flex-wrap gap-3 text-xs pt-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Modules:
            </span>
            {availableFilters.map((category) => {
              const isChecked = moduleFilter[category.key] !== false;
              return (
                <label
                  key={category.key}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleToggleModule(category.key, e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{category.label}</span>
                </label>
              );
            })}
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
              Remaining: <strong>{remainingCount}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              In-session: <strong>{inSessionCount}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              Graduated: <strong>{graduatedCount}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Upgraded Card Body with Blinded Front Face & Option B Split Back Face */}
      <StructureFlashcardCardFace
        structure={structure}
        drugName={currentCard.drugName}
        isFlipped={isFlipped}
        isSuspended={Boolean(currentCard.isSuspended)}
        onToggleSuspend={handleToggleSuspend}
        onFlip={() => setIsFlipped(true)}
      >
        {/* 4-Interval Anki Rating Bar */}
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => handleGrade('again')}
            className="group relative flex flex-col items-center justify-center p-3 rounded-xl border bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:border-rose-300 dark:hover:border-rose-700 transition-all shadow-xs cursor-pointer"
          >
            <span className="text-[11px] font-semibold text-rose-500 dark:text-rose-400">&lt; 1 min</span>
            <span className="text-base font-extrabold mt-0.5">Again</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">[1]</span>
          </button>
          <button
            type="button"
            onClick={() => handleGrade('hard')}
            className="group relative flex flex-col items-center justify-center p-3 rounded-xl border bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 hover:border-amber-300 dark:hover:border-amber-700 transition-all shadow-xs cursor-pointer"
          >
            <span className="text-[11px] font-semibold text-amber-500 dark:text-amber-400">4 min</span>
            <span className="text-base font-extrabold mt-0.5">Hard</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">[2]</span>
          </button>
          <button
            type="button"
            onClick={() => handleGrade('good')}
            className="group relative flex flex-col items-center justify-center p-3 rounded-xl border bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-xs cursor-pointer"
          >
            <span className="text-[11px] font-semibold text-blue-500 dark:text-blue-400">10 min</span>
            <span className="text-base font-extrabold mt-0.5">Good</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">[3]</span>
          </button>
          <button
            type="button"
            onClick={() => handleGrade('easy')}
            className="group relative flex flex-col items-center justify-center p-3 rounded-xl border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all shadow-xs cursor-pointer"
          >
            <span className="text-[11px] font-semibold text-emerald-500 dark:text-emerald-400">1 day</span>
            <span className="text-base font-extrabold mt-0.5">Easy</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">[4]</span>
          </button>
        </div>
      </StructureFlashcardCardFace>
    </div>
  );
};
