/**
 * Spaced Repetition Queue Engine & Local Storage Persistence
 *
 * Implements modified Anki-style spaced repetition scheduling for cross-curriculum
 * chemical structures, in-session re-queuing offsets, card suspension toggling,
 * and safe local storage persistence with SSR/Node compatibility.
 */

import {
  type FlashcardItem,
  type SpacedRepetitionRating,
  type FlashcardState,
  SPACED_REPETITION_INTERVALS,
} from '../types/cumulativeStudy';

/**
 * LocalStorage key for persisting flashcard learning progress.
 */
export const FLASHCARD_STORAGE_KEY = 'mcp_flashcard_progress_v1';

/**
 * LocalStorage key for persisting Top 200 clinical monograph flashcard progress.
 */
export const TOP200_CLINICAL_STORAGE_KEY = 'mcp_top200_clinical_progress_v1';

/**
 * LocalStorage key for persisting the active Top 200 study mode ('structure' | 'clinical').
 */
export const TOP200_ACTIVE_MODE_STORAGE_KEY = 'mcp_top200_active_mode';

/**
 * Result of rating a flashcard via spaced repetition.
 */
export interface SpacedRepetitionRatingResult {
  nextCardState: FlashcardItem;
  reQueueOffset: number | null;
}

/**
 * In-memory fallback cache when window.localStorage is unavailable (Node, SSR, private browsing),
 * keyed by storageKey to ensure zero leakage across storage keys in SSR/Node/test environments.
 */
let inMemoryFlashcardProgressByStorageKey: Record<string, Record<string, Partial<FlashcardItem>>> = {};

/**
 * Safely accesses the storage object across browser window, globalThis, and SSR environments.
 */
function getLocalStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage;
    }
    if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
      return (globalThis as any).localStorage;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Evaluates a user rating on an active flashcard and calculates its next state,
 * interval, due timestamp, struggle count, and in-session re-queue offset.
 *
 * Intervals:
 * - 'again': 1 min (< 1 min), struggleCount increments, reQueueOffset: -1 (re-queues at end of active session)
 * - 'hard': 4 min, struggleCount increments, reQueueOffset: 3 (re-queues 3 cards back in active session)
 * - 'good': 10 min, struggleCount unchanged, reQueueOffset: null (graduates from active session)
 * - 'easy': 1440 min (1 day), state: 'mastered', reQueueOffset: null (graduates from active session)
 */
export function applySpacedRepetitionGrade(
  card: FlashcardItem,
  grade: SpacedRepetitionRating,
  now: number = Date.now()
): SpacedRepetitionRatingResult {
  const currentStruggle = card.struggleCount ?? 0;
  const currentReps = card.repetitionCount ?? 0;

  switch (grade) {
    case 'again': {
      const intervalMinutes = SPACED_REPETITION_INTERVALS.again; // 1 min
      return {
        nextCardState: {
          ...card,
          intervalMinutes,
          dueTimestamp: now + intervalMinutes * 60 * 1000,
          repetitionCount: currentReps + 1,
          struggleCount: currentStruggle + 1,
          state: 'learning',
        },
        reQueueOffset: -1, // End of active session queue
      };
    }

    case 'hard': {
      const intervalMinutes = SPACED_REPETITION_INTERVALS.hard; // 4 min
      return {
        nextCardState: {
          ...card,
          intervalMinutes,
          dueTimestamp: now + intervalMinutes * 60 * 1000,
          repetitionCount: currentReps + 1,
          struggleCount: currentStruggle + 1,
          state: 'learning',
        },
        reQueueOffset: 3, // Re-queue 3 cards back
      };
    }

    case 'good': {
      const intervalMinutes = SPACED_REPETITION_INTERVALS.good; // 10 min
      const nextState: FlashcardState = card.state === 'mastered' ? 'mastered' : 'review';
      return {
        nextCardState: {
          ...card,
          intervalMinutes,
          dueTimestamp: now + intervalMinutes * 60 * 1000,
          repetitionCount: currentReps + 1,
          struggleCount: currentStruggle,
          state: nextState,
        },
        reQueueOffset: null, // Graduates from active session
      };
    }

    case 'easy': {
      const intervalMinutes = SPACED_REPETITION_INTERVALS.easy; // 1440 min (1 day)
      return {
        nextCardState: {
          ...card,
          intervalMinutes,
          dueTimestamp: now + intervalMinutes * 60 * 1000,
          repetitionCount: currentReps + 1,
          struggleCount: currentStruggle,
          state: 'mastered',
        },
        reQueueOffset: null, // Graduates from active session
      };
    }

    default: {
      // Fallback to good if unrecognized rating
      const intervalMinutes = SPACED_REPETITION_INTERVALS.good;
      return {
        nextCardState: {
          ...card,
          intervalMinutes,
          dueTimestamp: now + intervalMinutes * 60 * 1000,
          repetitionCount: currentReps + 1,
          state: 'review',
        },
        reQueueOffset: null,
      };
    }
  }
}

/**
 * Alias for applySpacedRepetitionGrade to support workflow integration interfaces.
 */
export const processReviewRating = applySpacedRepetitionGrade;

/**
 * Toggles a flashcard's suspended status.
 * Suspended cards are excluded from active practice sessions.
 */
export function toggleCardSuspension(card: FlashcardItem): FlashcardItem {
  return {
    ...card,
    isSuspended: !card.isSuspended,
  };
}

/**
 * Manages the in-session queue order when a card is answered.
 *
 * - If `reQueueOffset === null`: Card graduates from active session; current index is updated.
 * - If `reQueueOffset === -1`: Card is re-queued at the end of the active session.
 * - If `reQueueOffset > 0`: Card is re-inserted `reQueueOffset` cards ahead of `currentIndex + 1`.
 *
 * Returns a new queue array without mutating the input queue.
 */
export function reQueueActiveSession(
  queue: FlashcardItem[],
  currentIndex: number,
  updatedCard: FlashcardItem,
  reQueueOffset: number | null
): FlashcardItem[] {
  if (!queue || queue.length === 0) {
    return [updatedCard];
  }

  const newQueue = [...queue];

  // Update card state at current index
  if (currentIndex >= 0 && currentIndex < newQueue.length) {
    newQueue[currentIndex] = updatedCard;
  }

  // Graduated: no re-insertion
  if (reQueueOffset === null) {
    return newQueue;
  }

  // Again: re-queue at the very end
  if (reQueueOffset === -1) {
    newQueue.push(updatedCard);
    return newQueue;
  }

  // Hard: re-queue reQueueOffset positions after the next card (currentIndex + 1)
  if (reQueueOffset > 0) {
    const targetIndex = Math.min(
      newQueue.length,
      Math.max(0, currentIndex + 1 + reQueueOffset)
    );
    newQueue.splice(targetIndex, 0, updatedCard);
    return newQueue;
  }

  // Default fallback for any other negative number
  newQueue.push(updatedCard);
  return newQueue;
}

/**
 * Loads saved flashcard progress from LocalStorage or in-memory cache for a specific storageKey.
 * Returns a map of structureId -> Partial<FlashcardItem>.
 */
export function loadFlashcardProgress(
  storageKey: string = FLASHCARD_STORAGE_KEY
): Record<string, Partial<FlashcardItem>> {
  const storage = getLocalStorage();
  if (storage) {
    try {
      const raw = storage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          inMemoryFlashcardProgressByStorageKey[storageKey] = parsed;
          return { ...parsed };
        }
      }
    } catch (e) {
      console.warn('Failed to load flashcard progress from storage:', e);
    }
  }

  if (inMemoryFlashcardProgressByStorageKey[storageKey] !== undefined) {
    return { ...inMemoryFlashcardProgressByStorageKey[storageKey] };
  }

  return {};
}

/**
 * Persists flashcard progress map to LocalStorage and in-memory cache for a specific storageKey.
 */
export function saveFlashcardProgress(
  cardStates: Record<string, Partial<FlashcardItem>>,
  storageKey: string = FLASHCARD_STORAGE_KEY
): void {
  inMemoryFlashcardProgressByStorageKey[storageKey] = { ...cardStates };
  const storage = getLocalStorage();
  if (storage) {
    try {
      storage.setItem(storageKey, JSON.stringify(cardStates));
    } catch (e) {
      console.warn('Failed to save flashcard progress to storage:', e);
    }
  }
}

/**
 * Clears saved flashcard progress from both LocalStorage and in-memory cache for a specific storageKey.
 */
export function clearFlashcardProgress(
  storageKey: string = FLASHCARD_STORAGE_KEY
): void {
  inMemoryFlashcardProgressByStorageKey[storageKey] = {};
  const storage = getLocalStorage();
  if (storage) {
    try {
      storage.removeItem(storageKey);
    } catch {}
  }
}

/**
 * Merges persisted learning progress onto an array of harvested flashcards.
 * Preserves harvested chemical structure, drug name, and module IDs while restoring
 * intervalMinutes, dueTimestamp, repetitionCount, state, isSuspended, and struggleCount.
 */
export function applyProgressToCards(
  cards: FlashcardItem[],
  savedProgressOrStorageKey?: Record<string, Partial<FlashcardItem>> | string,
  storageKey?: string
): FlashcardItem[] {
  let progress: Record<string, Partial<FlashcardItem>>;
  if (typeof savedProgressOrStorageKey === 'string') {
    progress = loadFlashcardProgress(savedProgressOrStorageKey);
  } else if (savedProgressOrStorageKey) {
    progress = savedProgressOrStorageKey;
  } else {
    progress = loadFlashcardProgress(storageKey ?? FLASHCARD_STORAGE_KEY);
  }

  return cards.map((card) => {
    const saved = progress[card.structureId];
    if (!saved) return card;
    return {
      ...card,
      intervalMinutes: saved.intervalMinutes ?? card.intervalMinutes,
      dueTimestamp: saved.dueTimestamp ?? card.dueTimestamp,
      repetitionCount: saved.repetitionCount ?? card.repetitionCount,
      state: saved.state ?? card.state,
      isSuspended: saved.isSuspended ?? card.isSuspended,
      struggleCount: saved.struggleCount ?? card.struggleCount,
    };
  });
}

/**
 * Saves or updates progress for a single flashcard and persists it.
 */
export function recordCardProgress(
  card: FlashcardItem,
  existingProgressOrStorageKey?: Record<string, Partial<FlashcardItem>> | string,
  storageKey?: string
): Record<string, Partial<FlashcardItem>> {
  let effectiveKey = FLASHCARD_STORAGE_KEY;
  let progress: Record<string, Partial<FlashcardItem>>;

  if (typeof existingProgressOrStorageKey === 'string') {
    effectiveKey = existingProgressOrStorageKey;
    progress = loadFlashcardProgress(effectiveKey);
  } else {
    if (storageKey) {
      effectiveKey = storageKey;
    }
    progress = existingProgressOrStorageKey
      ? { ...existingProgressOrStorageKey }
      : loadFlashcardProgress(effectiveKey);
  }

  progress[card.structureId] = {
    intervalMinutes: card.intervalMinutes,
    dueTimestamp: card.dueTimestamp,
    repetitionCount: card.repetitionCount,
    state: card.state,
    isSuspended: card.isSuspended,
    struggleCount: card.struggleCount,
  };
  saveFlashcardProgress(progress, effectiveKey);
  return progress;
}

/**
 * Filters out suspended flashcards from a card list.
 */
export function getActiveFlashcards(cards: FlashcardItem[]): FlashcardItem[] {
  return cards.filter((card) => !card.isSuspended);
}

/**
 * Returns flashcards that are currently due for review (or new cards),
 * excluding any suspended cards.
 */
export function getDueFlashcards(
  cards: FlashcardItem[],
  now: number = Date.now()
): FlashcardItem[] {
  return cards.filter(
    (card) => !card.isSuspended && (card.state === 'new' || card.dueTimestamp <= now)
  );
}
