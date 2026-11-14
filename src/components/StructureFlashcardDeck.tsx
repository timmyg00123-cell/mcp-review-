import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { FlashcardItem, SpacedRepetitionRating } from '../types/cumulativeStudy';
import {
  applySpacedRepetitionGrade,
  recordCardProgress,
  reQueueActiveSession,
  toggleCardSuspension,
  applyProgressToCards,
  FLASHCARD_STORAGE_KEY,
} from '../utils/spacedRepetitionService';
import {
  StructureFlashcardCardFace,
  type FlashcardDisplaySettings,
  DEFAULT_FLASHCARD_DISPLAY_SETTINGS,
} from './StructureFlashcardCardFace';
import { TopDrugClinicalCard } from './TopDrugClinicalCard';
import { resolveTopDrugClinicalMonograph } from '../data/topDrugsClinicalData';
import {
  THERAPEUTIC_CATEGORIES,
  type TherapeuticClassCategory,
} from '../data/topDrugsTaxonomyData';
import { getTherapeuticCategoriesForCards } from '../utils/topDrugsTaxonomy';
import {
  CheckCircle2,
  X,
  Filter,
  Layers,
  RotateCcw,
  ArrowUpDown,
  SlidersHorizontal,
} from 'lucide-react';

export interface StructureFlashcardDeckProps {
  cards: FlashcardItem[];
  onSessionComplete: (struggledCards: FlashcardItem[], fullDeck: FlashcardItem[]) => void;
  onClose?: () => void;
  storageKey?: string;
  renderMode?: 'structure' | 'clinical';
}

export interface ModuleCategory {
  key: string;
  label: string;
  matchPattern: RegExp;
}

export type ModuleFilterState = Record<string, boolean>;

export type DeckFilterMode = 'curriculum' | 'taxonomy';

export type FlashcardSortMode = 'class-number' | 'subclass' | 'due-date' | 'alphabetical';

export const DISPLAY_SETTINGS_STORAGE_KEY = 'medchem_flashcard_display_settings';

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
 * Checks whether a flashcard matches the selected 2-tier Top Drugs taxonomy filter.
 * - categoryNumber === null matches all categories.
 * - specificSubclass === null matches all subclasses in that category.
 */
export function cardMatchesTaxonomyFilter(
  card: FlashcardItem,
  categoryNumber: number | null,
  specificSubclass: string | null
): boolean {
  if (categoryNumber !== null && card.structure.therapeuticClassNumber !== categoryNumber) {
    return false;
  }
  if (specificSubclass !== null) {
    const cardSubclass =
      card.structure.specificPharmacologicClass ||
      card.structure.pharmacologicalClass ||
      '';
    if (cardSubclass !== specificSubclass) {
      return false;
    }
  }
  return true;
}

/**
 * Stably sorts flashcards according to the chosen sort mode.
 * - 'class-number': Stably sorts by numeric class (1-39), falling back to 999 for non-taxonomy cards,
 *   then by subclass, then alphabetically by drug name.
 * - 'subclass': Sorts by specific or pharmacological subclass.
 * - 'due-date': Sorts by spaced repetition dueTimestamp.
 * - 'alphabetical': Sorts by drug generic name.
 */
export function sortFlashcards(
  cards: FlashcardItem[],
  sortBy: FlashcardSortMode
): FlashcardItem[] {
  const shallow = [...cards];
  return shallow.sort((a, b) => {
    if (sortBy === 'class-number') {
      const numA = a.structure.therapeuticClassNumber ?? 999;
      const numB = b.structure.therapeuticClassNumber ?? 999;
      if (numA !== numB) return numA - numB;
      const nameA = a.structure.name || a.drugName || '';
      const nameB = b.structure.name || b.drugName || '';
      return nameA.localeCompare(nameB);
    }
    if (sortBy === 'subclass') {
      const subA = a.structure.specificPharmacologicClass || a.structure.pharmacologicalClass || '';
      const subB = b.structure.specificPharmacologicClass || b.structure.pharmacologicalClass || '';
      if (subA !== subB) return subA.localeCompare(subB);
      const nameA = a.structure.name || a.drugName || '';
      const nameB = b.structure.name || b.drugName || '';
      return nameA.localeCompare(nameB);
    }
    if (sortBy === 'due-date') {
      return a.dueTimestamp - b.dueTimestamp;
    }
    const nameA = a.structure.name || a.drugName || '';
    const nameB = b.structure.name || b.drugName || '';
    return nameA.localeCompare(nameB);
  });
}

/**
 * Centralized queue candidate builder applying filters and stable sorting.
 */
function buildCandidateQueue(
  cards: FlashcardItem[],
  mode: DeckFilterMode,
  moduleF: ModuleFilterState,
  categoryNum: number | null,
  subclass: string | null,
  sort: FlashcardSortMode,
  availFilters: ModuleCategory[]
): FlashcardItem[] {
  const unSuspended = cards.filter((c) => !c.isSuspended);
  let filtered: FlashcardItem[] = [];
  if (mode === 'curriculum') {
    filtered = unSuspended.filter((c) =>
      cardMatchesModuleFilter(c, moduleF, availFilters)
    );
  } else {
    filtered = unSuspended.filter((c) =>
      cardMatchesTaxonomyFilter(c, categoryNum, subclass)
    );
  }
  return sortFlashcards(filtered, sort);
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
 * - Hierarchical taxonomy filtering (Curriculum Modules vs Top Drugs Taxonomy cascading filter).
 * - Stable sorting engine (Class Number with 999 fallback, Subclass, Due Date, Alphabetical).
 * - Display settings popover ("⚙️ Display") with density mode and clutter reduction controls.
 * - Active session counters (Remaining, In-session, Graduated).
 */
export const StructureFlashcardDeck: React.FC<StructureFlashcardDeckProps> = ({
  cards,
  onSessionComplete,
  onClose,
  storageKey = FLASHCARD_STORAGE_KEY,
  renderMode = 'structure',
}) => {
  // Master working deck initialized with persisted local storage progress
  const [deck, setDeck] = useState<FlashcardItem[]>(() =>
    applyProgressToCards(cards, undefined, storageKey)
  );

  // Dynamic available module categories derived from cards
  const availableFilters = useMemo(() => getAvailableModuleFilters(cards), [cards]);

  // Filter mode toggle: 'curriculum' (default) or 'taxonomy' (Top Drugs 39 classes)
  const [filterMode, setFilterMode] = useState<DeckFilterMode>('curriculum');

  // Module filter toggles
  const [moduleFilter, setModuleFilter] = useState<ModuleFilterState>(() => {
    const initial: ModuleFilterState = {};
    const filters = getAvailableModuleFilters(cards);
    for (const f of filters) {
      initial[f.key] = true;
    }
    return initial;
  });

  // 2-tier cascading taxonomy filters
  const [selectedCategoryNumber, setSelectedCategoryNumber] = useState<number | null>(null);
  const [selectedSubclass, setSelectedSubclass] = useState<string | null>(null);

  // Sorting state: 'class-number' (default), 'subclass', 'due-date', 'alphabetical'
  const [sortBy, setSortBy] = useState<FlashcardSortMode>('class-number');

  // Display Settings Popover state & persistence
  const [isDisplayPopoverOpen, setIsDisplayPopoverOpen] = useState<boolean>(false);
  const [displaySettings, setDisplaySettings] = useState<FlashcardDisplaySettings>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const saved = window.localStorage.getItem(DISPLAY_SETTINGS_STORAGE_KEY);
        if (saved) {
          return { ...DEFAULT_FLASHCARD_DISPLAY_SETTINGS, ...JSON.parse(saved) };
        }
      } catch {
        // Fallback to defaults
      }
    }
    return DEFAULT_FLASHCARD_DISPLAY_SETTINGS;
  });

  // Sync display settings to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(
          DISPLAY_SETTINGS_STORAGE_KEY,
          JSON.stringify(displaySettings)
        );
      } catch {
        // Ignore storage errors
      }
    }
  }, [displaySettings]);

  // Available therapeutic categories present in current deck
  const availableCategories = useMemo(() => {
    const filtered = getTherapeuticCategoriesForCards(cards);
    return filtered.length > 0 ? filtered : THERAPEUTIC_CATEGORIES;
  }, [cards]);

  // Available subclasses based on selected category
  const availableSubclasses = useMemo(() => {
    if (selectedCategoryNumber !== null) {
      const matchedCategory = availableCategories.find(
        (c) => c.classNumber === selectedCategoryNumber
      );
      if (matchedCategory && matchedCategory.specificSubclasses.length > 0) {
        return matchedCategory.specificSubclasses;
      }
      const cardSubs = new Set<string>();
      for (const card of deck) {
        if (card.structure.therapeuticClassNumber === selectedCategoryNumber) {
          const sub =
            card.structure.specificPharmacologicClass ||
            card.structure.pharmacologicalClass;
          if (sub) cardSubs.add(sub);
        }
      }
      return Array.from(cardSubs).sort();
    }

    const allSubs = new Set<string>();
    for (const cat of availableCategories) {
      for (const sub of cat.specificSubclasses) {
        allSubs.add(sub);
      }
    }
    for (const card of deck) {
      const sub =
        card.structure.specificPharmacologicClass ||
        card.structure.pharmacologicalClass;
      if (sub) allSubs.add(sub);
    }
    return Array.from(allSubs).sort();
  }, [selectedCategoryNumber, availableCategories, deck]);

  // Active in-session queue and position index
  const [activeQueue, setActiveQueue] = useState<FlashcardItem[]>(() => {
    const initialized = applyProgressToCards(cards, undefined, storageKey);
    const filters = getAvailableModuleFilters(cards);
    const initialFilterState: ModuleFilterState = {};
    for (const f of filters) {
      initialFilterState[f.key] = true;
    }
    return buildCandidateQueue(
      initialized,
      'curriculum',
      initialFilterState,
      null,
      null,
      'class-number',
      filters
    );
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Restart deck handler (resets active queue to full filtered deck, currentIndex to 0, isFlipped to false)
  const handleRestartDeck = useCallback(() => {
    const initialized = applyProgressToCards(cards, undefined, storageKey);
    setDeck(initialized);
    const filtered = buildCandidateQueue(
      initialized,
      filterMode,
      moduleFilter,
      selectedCategoryNumber,
      selectedSubclass,
      sortBy,
      availableFilters
    );
    setActiveQueue(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [
    cards,
    storageKey,
    filterMode,
    moduleFilter,
    selectedCategoryNumber,
    selectedSubclass,
    sortBy,
    availableFilters,
  ]);

  // Sync state if cards prop identity or storageKey updates
  useEffect(() => {
    const withProgress = applyProgressToCards(cards, undefined, storageKey);
    setDeck(withProgress);
    const filters = getAvailableModuleFilters(cards);
    const nextFilterState: ModuleFilterState = {};
    for (const f of filters) {
      nextFilterState[f.key] = true;
    }
    setModuleFilter(nextFilterState);
    const nextQueue = buildCandidateQueue(
      withProgress,
      filterMode,
      nextFilterState,
      selectedCategoryNumber,
      selectedSubclass,
      sortBy,
      filters
    );
    setActiveQueue(nextQueue);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [cards, storageKey]);

  // Handle filter mode toggle
  const handleFilterModeChange = (newMode: DeckFilterMode) => {
    setFilterMode(newMode);
    const nextQueue = buildCandidateQueue(
      deck,
      newMode,
      moduleFilter,
      selectedCategoryNumber,
      selectedSubclass,
      sortBy,
      availableFilters
    );
    setActiveQueue(nextQueue);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Handle category dropdown change
  const handleCategoryChange = (catNum: number | null) => {
    setSelectedCategoryNumber(catNum);
    setSelectedSubclass(null);
    const nextQueue = buildCandidateQueue(
      deck,
      filterMode,
      moduleFilter,
      catNum,
      null,
      sortBy,
      availableFilters
    );
    setActiveQueue(nextQueue);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Handle subclass dropdown change
  const handleSubclassChange = (subclass: string | null) => {
    setSelectedSubclass(subclass);
    const nextQueue = buildCandidateQueue(
      deck,
      filterMode,
      moduleFilter,
      selectedCategoryNumber,
      subclass,
      sortBy,
      availableFilters
    );
    setActiveQueue(nextQueue);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Handle sorting dropdown change
  const handleSortChange = (newSort: FlashcardSortMode) => {
    setSortBy(newSort);
    const nextQueue = buildCandidateQueue(
      deck,
      filterMode,
      moduleFilter,
      selectedCategoryNumber,
      selectedSubclass,
      newSort,
      availableFilters
    );
    setActiveQueue(nextQueue);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Handle module filter toggle
  const handleToggleModule = (moduleKey: string, checked: boolean) => {
    const nextFilter = { ...moduleFilter, [moduleKey]: checked };
    setModuleFilter(nextFilter);
    const nextQueue = buildCandidateQueue(
      deck,
      filterMode,
      nextFilter,
      selectedCategoryNumber,
      selectedSubclass,
      sortBy,
      availableFilters
    );
    setActiveQueue(nextQueue);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Handle Reset Filters action
  const handleResetFilters = () => {
    setSelectedCategoryNumber(null);
    setSelectedSubclass(null);
    const nextModuleFilter: ModuleFilterState = {};
    for (const f of availableFilters) {
      nextModuleFilter[f.key] = true;
    }
    setModuleFilter(nextModuleFilter);
    const nextQueue = buildCandidateQueue(
      deck,
      filterMode,
      nextModuleFilter,
      null,
      null,
      sortBy,
      availableFilters
    );
    setActiveQueue(nextQueue);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const currentCard = activeQueue[currentIndex] as FlashcardItem | undefined;

  // Active session queue counters
  const remainingCount = Math.max(0, activeQueue.length - currentIndex);
  const inSessionCount = activeQueue.length;
  const graduatedCount = deck.filter((c) => {
    if (c.isSuspended) return false;
    const matches =
      filterMode === 'curriculum'
        ? cardMatchesModuleFilter(c, moduleFilter, availableFilters)
        : cardMatchesTaxonomyFilter(c, selectedCategoryNumber, selectedSubclass);
    return matches && (c.state === 'review' || c.state === 'mastered');
  }).length;

  // Spaced repetition rating handler
  const handleGrade = useCallback(
    (rating: SpacedRepetitionRating) => {
      if (!currentCard) return;

      const result = applySpacedRepetitionGrade(currentCard, rating);
      const nextCard = result.nextCardState;

      // Persist progress to local storage
      recordCardProgress(nextCard, undefined, storageKey);

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
    [currentCard, activeQueue, currentIndex, storageKey]
  );

  // Suspend card toggle
  const handleToggleSuspend = useCallback(() => {
    if (!currentCard) return;

    const updated = toggleCardSuspension(currentCard);
    recordCardProgress(updated, undefined, storageKey);

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
  }, [currentCard, activeQueue, currentIndex, storageKey]);

  // Finish session early
  const handleFinishEarly = useCallback(() => {
    const struggled = deck.filter((c) => (c.struggleCount ?? 0) > 0);
    onSessionComplete(struggled, deck);
  }, [deck, onSessionComplete]);

  // Keyboard shortcut listener: Space (flip), 1 (Again), 2 (Hard), 3 (Good), 4 (Easy)
  // In clinical mode, keys 1, 2, 3 switch tabs on the card face, so grading uses Alt+1..4 or 4 (Easy)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Guard against typing in form inputs, textareas, selects, or contenteditable elements
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable ||
          target.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped) {
        if (renderMode === 'clinical') {
          if (e.altKey) {
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
          } else if (e.key === '4') {
            e.preventDefault();
            handleGrade('easy');
          }
        } else {
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFlipped, handleGrade, renderMode]);

  // Dedicated Empty Filter view when active filters yield 0 matching cards
  if (activeQueue.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl text-center flex flex-col items-center text-slate-900 dark:text-slate-100">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
          <Filter className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold mb-2">No Cards Match Current Filter</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
          {renderMode === 'clinical'
            ? 'No clinical monographs in your deck match the active filter criteria. Try adjusting your category or subclass selection, or reset your filters.'
            : 'No chemical structures in your deck match the active filter criteria. Try adjusting your category or subclass selection, or reset your filters.'}
        </p>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Filters
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

  // Session completion view when active queue is exhausted
  if (!currentCard || currentIndex >= activeQueue.length) {
    const struggled = deck.filter((c) => (c.struggleCount ?? 0) > 0);
    return (
      <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl text-center flex flex-col items-center text-slate-900 dark:text-slate-100">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold mb-2">
          {renderMode === 'clinical' ? 'Clinical Monograph Session Complete!' : 'Flashcard Session Complete!'}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
          {renderMode === 'clinical'
            ? 'All clinical monographs in this active session queue have graduated or been scheduled for future review.'
            : 'All chemical structures in this active session queue have graduated or been scheduled for future review.'}
        </p>

        <div className="w-full max-w-sm grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 mb-6 text-sm">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Total In-Session</div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {activeQueue.length}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {renderMode === 'clinical' ? 'Struggled Monographs' : 'Struggled Structures'}
            </div>
            <div className="text-lg font-bold text-rose-600 dark:text-rose-400">
              {struggled.length}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          {struggled.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setActiveQueue(struggled);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className="px-6 py-2.5 rounded-xl font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Re-drill Struggled Cards ({struggled.length})
            </button>
          )}
          <button
            type="button"
            onClick={handleRestartDeck}
            className="px-6 py-2.5 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Full Deck
          </button>
          {renderMode !== 'clinical' && (
            <button
              type="button"
              onClick={() => onSessionComplete(struggled, deck)}
              className="px-6 py-2.5 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              View Struggle Diagnostics
            </button>
          )}
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
                {renderMode === 'clinical'
                  ? 'Top 200 Clinical Monograph Deck'
                  : 'Rapid Structure Recall Deck'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {renderMode === 'clinical'
                  ? 'Clinical pharmacology, dosing regimens, clinical pearls, and boxed safety warnings'
                  : 'Spaced repetition chemical structure recognition & pharmacophore identification'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleSuspend}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                currentCard.isSuspended
                  ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={currentCard.isSuspended ? 'Unsuspend Card' : 'Suspend Card from Deck'}
            >
              {currentCard.isSuspended ? 'Suspended' : 'Suspend Card'}
            </button>
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

        {/* Filter Mode Toggle, Sort Controls & Display Settings Popover */}
        <div className="flex items-center justify-between flex-wrap gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Filter Mode:</span>
            <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => handleFilterModeChange('curriculum')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filterMode === 'curriculum'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Curriculum Modules
              </button>
              <button
                type="button"
                onClick={() => handleFilterModeChange('taxonomy')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  filterMode === 'taxonomy'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Top Drugs Taxonomy
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <label className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as FlashcardSortMode)}
                className="py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="class-number">Class Number (1-39)</option>
                <option value="subclass">Subclass</option>
                <option value="due-date">Due Date</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </label>

            {/* Display Settings Popover Button (Structure Mode Only) */}
            {renderMode === 'structure' && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDisplayPopoverOpen((prev) => !prev)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Card Display Settings"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>⚙️ Display</span>
                </button>

                {isDisplayPopoverOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 text-slate-900 dark:text-slate-100 flex flex-col gap-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Display Settings
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsDisplayPopoverOpen(false)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Density Mode */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        Layout Density
                      </span>
                      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
                        <button
                          type="button"
                          onClick={() =>
                            setDisplaySettings((prev) => ({ ...prev, density: 'split' }))
                          }
                          className={`py-1 rounded font-medium transition-colors cursor-pointer ${
                            displaySettings.density === 'split'
                              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          Split
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDisplaySettings((prev) => ({
                              ...prev,
                              density: 'structure-focus',
                            }))
                          }
                          className={`py-1 rounded font-medium transition-colors cursor-pointer ${
                            displaySettings.density === 'structure-focus'
                              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          Focus
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDisplaySettings((prev) => ({
                              ...prev,
                              density: 'minimalist',
                            }))
                          }
                          className={`py-1 rounded font-medium transition-colors cursor-pointer ${
                            displaySettings.density === 'minimalist'
                              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          Minimal
                        </button>
                      </div>
                    </div>

                    {/* Section Visibility Toggles */}
                    <div className="flex flex-col gap-2 pt-1">
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                        Visible Sections
                      </span>

                      <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={displaySettings.showBrandNames}
                          onChange={(e) =>
                            setDisplaySettings((prev) => ({
                              ...prev,
                              showBrandNames: e.target.checked,
                            }))
                          }
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Brand Names</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(
                            displaySettings.showHierarchyBreadcrumb ??
                              displaySettings.showTaxonomyBreadcrumbs
                          )}
                          onChange={(e) =>
                            setDisplaySettings((prev) => ({
                              ...prev,
                              showHierarchyBreadcrumb: e.target.checked,
                              showTaxonomyBreadcrumbs: e.target.checked,
                            }))
                          }
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Hierarchy Breadcrumbs</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(
                            displaySettings.showPharmacophoreTagStrip ??
                              displaySettings.showPharmacophoreTags
                          )}
                          onChange={(e) =>
                            setDisplaySettings((prev) => ({
                              ...prev,
                              showPharmacophoreTagStrip: e.target.checked,
                              showPharmacophoreTags: e.target.checked,
                            }))
                          }
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Pharmacophore Tags</span>
                      </label>

                      <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={displaySettings.showClinicalPearls}
                          onChange={(e) =>
                            setDisplaySettings((prev) => ({
                              ...prev,
                              showClinicalPearls: e.target.checked,
                            }))
                          }
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Clinical Pearls &amp; MOA</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Filter Controls Bar & Session Counters */}
        <div className="flex items-center justify-between flex-wrap gap-3 text-xs pt-1">
          {filterMode === 'curriculum' ? (
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
          ) : (
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-500 dark:text-slate-400">
                  Category:
                </span>
                <select
                  value={selectedCategoryNumber !== null ? String(selectedCategoryNumber) : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleCategoryChange(val ? parseInt(val, 10) : null);
                  }}
                  className="py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:ring-1 focus:ring-blue-500 cursor-pointer max-w-[210px] truncate"
                >
                  <option value="">All Categories (1-39)</option>
                  {availableCategories.map((cat) => (
                    <option key={cat.classNumber} value={cat.classNumber}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-500 dark:text-slate-400">
                  Subclass:
                </span>
                <select
                  value={selectedSubclass ?? ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleSubclassChange(val || null);
                  }}
                  className="py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:ring-1 focus:ring-blue-500 cursor-pointer max-w-[230px] truncate"
                >
                  <option value="">All Subclasses</option>
                  {availableSubclasses.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {(selectedCategoryNumber !== null || selectedSubclass !== null) && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}

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

      {/* Card Body: Clinical Monograph or Chemical Structure Card Face */}
      {renderMode === 'clinical' ? (
        <TopDrugClinicalCard
          monograph={resolveTopDrugClinicalMonograph(currentCard.drugName || currentCard.structure.name)}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(true)}
        >
          {/* 4-Interval Rating Bar for Clinical Mode */}
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleGrade('again')}
              className="group relative flex flex-col items-center justify-center p-3 rounded-xl border bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 hover:border-rose-300 dark:hover:border-rose-700 transition-all shadow-xs cursor-pointer"
            >
              <span className="text-[11px] font-semibold text-rose-500 dark:text-rose-400">&lt; 1 min</span>
              <span className="text-base font-extrabold mt-0.5">Again</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">[Alt+1]</span>
            </button>
            <button
              type="button"
              onClick={() => handleGrade('hard')}
              className="group relative flex flex-col items-center justify-center p-3 rounded-xl border bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 hover:border-amber-300 dark:hover:border-amber-700 transition-all shadow-xs cursor-pointer"
            >
              <span className="text-[11px] font-semibold text-amber-500 dark:text-amber-400">4 min</span>
              <span className="text-base font-extrabold mt-0.5">Hard</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">[Alt+2]</span>
            </button>
            <button
              type="button"
              onClick={() => handleGrade('good')}
              className="group relative flex flex-col items-center justify-center p-3 rounded-xl border bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-xs cursor-pointer"
            >
              <span className="text-[11px] font-semibold text-blue-500 dark:text-blue-400">10 min</span>
              <span className="text-base font-extrabold mt-0.5">Good</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">[Alt+3]</span>
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
        </TopDrugClinicalCard>
      ) : (
        <StructureFlashcardCardFace
          structure={structure}
          drugName={currentCard.drugName}
          isFlipped={isFlipped}
          isSuspended={Boolean(currentCard.isSuspended)}
          onToggleSuspend={handleToggleSuspend}
          onFlip={() => setIsFlipped(true)}
          displaySettings={displaySettings}
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
      )}
    </div>
  );
};
