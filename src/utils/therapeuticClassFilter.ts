import type { FlashcardItem } from '../types/cumulativeStudy.js';

/**
 * Storage key for active Top 200 therapeutic class filter selection.
 */
export const TOP200_CLASS_FILTER_STORAGE_KEY = 'mcp_top200_class_filter_v1';

/**
 * Ascending sequence of all 39 standardized therapeutic class numbers (1 to 39).
 */
export const ALL_THERAPEUTIC_CLASS_NUMBERS: number[] = Array.from(
  { length: 39 },
  (_, i) => i + 1
);

/**
 * Organ system cluster preset definition.
 */
export interface OrganSystemCluster {
  key: string;
  label: string;
  classNumbers: number[];
}

/**
 * Curated high-yield organ-system cluster presets for rapid isolation.
 */
export const ORGAN_SYSTEM_CLUSTERS: OrganSystemCluster[] = [
  {
    key: 'cardio',
    label: 'Cardiovascular',
    classNumbers: [10, 11, 12, 13, 14, 15],
  },
  {
    key: 'cns',
    label: 'CNS & Psych',
    classNumbers: [3, 4, 16, 17, 20, 32, 38],
  },
  {
    key: 'anti-infective',
    label: 'Anti-Infective',
    classNumbers: [2, 9, 18, 19, 28],
  },
  {
    key: 'endocrine',
    label: 'Metabolic / Endocrine',
    classNumbers: [5, 6, 24, 30, 39],
  },
];

/**
 * Evaluates whether a flashcard matches the multi-class taxonomy selection.
 *
 * @param card FlashcardItem to test
 * @param selectedClassNumbers Set of active therapeutic class numbers (1 to 39)
 * @param selectedSubclass Optional specific pharmacologic subclass filter
 * @returns boolean true if the card matches all active criteria
 */
export function cardMatchesTaxonomyMultiFilter(
  card: FlashcardItem,
  selectedClassNumbers: Set<number>,
  selectedSubclass?: string | null
): boolean {
  if (!selectedClassNumbers || selectedClassNumbers.size === 0) {
    return false;
  }

  const classNum = card.structure?.therapeuticClassNumber;
  if (classNum !== undefined && classNum !== null) {
    if (!selectedClassNumbers.has(classNum)) {
      return false;
    }
  } else {
    return false;
  }

  if (
    selectedSubclass !== null &&
    selectedSubclass !== undefined &&
    selectedSubclass !== ''
  ) {
    const sub =
      card.structure?.specificPharmacologicClass ||
      card.structure?.pharmacologicalClass ||
      '';
    if (sub !== selectedSubclass) {
      return false;
    }
  }

  return true;
}

/**
 * Safely loads the active therapeutic class filter selection from storage.
 * Gracefully falls back to all 39 classes when storage is empty, corrupted,
 * or contains non-array / out-of-range data.
 *
 * @param storage Optional Storage interface (defaults to window.localStorage)
 * @returns Set of active therapeutic class numbers (1 to 39)
 */
export function loadSelectedClassNumbers(storage?: Storage): Set<number> {
  const targetStorage =
    storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined);

  if (!targetStorage) {
    return new Set(ALL_THERAPEUTIC_CLASS_NUMBERS);
  }

  try {
    const raw = targetStorage.getItem(TOP200_CLASS_FILTER_STORAGE_KEY);
    if (!raw) {
      return new Set(ALL_THERAPEUTIC_CLASS_NUMBERS);
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return new Set(ALL_THERAPEUTIC_CLASS_NUMBERS);
    }

    const validNumbers = parsed.filter(
      (item): item is number =>
        typeof item === 'number' &&
        Number.isInteger(item) &&
        item >= 1 &&
        item <= 39
    );

    // If array contained no valid class numbers, fall back to all 39
    if (validNumbers.length === 0) {
      return new Set(ALL_THERAPEUTIC_CLASS_NUMBERS);
    }

    return new Set(validNumbers);
  } catch {
    return new Set(ALL_THERAPEUTIC_CLASS_NUMBERS);
  }
}

/**
 * Persists the active therapeutic class selection to storage as a sorted array.
 *
 * @param selected Set of active therapeutic class numbers
 * @param storage Optional Storage interface (defaults to window.localStorage)
 */
export function saveSelectedClassNumbers(
  selected: Set<number>,
  storage?: Storage
): void {
  const targetStorage =
    storage ?? (typeof window !== 'undefined' ? window.localStorage : undefined);

  if (!targetStorage) {
    return;
  }

  try {
    const sorted = Array.from(selected)
      .filter(
        (n) => typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= 39
      )
      .sort((a, b) => a - b);

    targetStorage.setItem(
      TOP200_CLASS_FILTER_STORAGE_KEY,
      JSON.stringify(sorted)
    );
  } catch {
    // Gracefully handle storage errors (e.g. QuotaExceededError, private browsing)
  }
}

/**
 * Computes the updated selection set following a contiguous press-and-hold sweep gesture.
 * Traverses from min(startIndex, currentIndex) to max(startIndex, currentIndex)
 * and sets or deletes class numbers according to targetState without mutating the input set.
 *
 * @param startIndex Initial starting index or class number when gesture began
 * @param currentIndex Current hovered index or class number under pointer
 * @param currentSelection Existing selection set
 * @param targetState Desired boolean state (true = select, false = deselect)
 * @param orderedClassNumbers Optional ordering array (defaults to ALL_THERAPEUTIC_CLASS_NUMBERS)
 * @returns New Set<number> reflecting the swept selection
 */
export function computeContiguousSweep(
  startIndex: number,
  currentIndex: number,
  currentSelection: Set<number>,
  targetState: boolean,
  orderedClassNumbers: number[] = ALL_THERAPEUTIC_CLASS_NUMBERS
): Set<number> {
  const nextSelection = new Set(currentSelection);

  let affectedNumbers: number[] = [];

  const startByVal = orderedClassNumbers.indexOf(startIndex);
  const currentByVal = orderedClassNumbers.indexOf(currentIndex);

  if (startByVal !== -1 && currentByVal !== -1) {
    const minIdx = Math.min(startByVal, currentByVal);
    const maxIdx = Math.max(startByVal, currentByVal);
    affectedNumbers = orderedClassNumbers.slice(minIdx, maxIdx + 1);
  } else if (
    startIndex >= 0 &&
    startIndex < orderedClassNumbers.length &&
    currentIndex >= 0 &&
    currentIndex < orderedClassNumbers.length
  ) {
    const minIdx = Math.min(startIndex, currentIndex);
    const maxIdx = Math.max(startIndex, currentIndex);
    affectedNumbers = orderedClassNumbers.slice(minIdx, maxIdx + 1);
  } else {
    const min = Math.min(startIndex, currentIndex);
    const max = Math.max(startIndex, currentIndex);
    for (let i = min; i <= max; i++) {
      affectedNumbers.push(i);
    }
  }

  for (const num of affectedNumbers) {
    if (targetState) {
      nextSelection.add(num);
    } else {
      nextSelection.delete(num);
    }
  }

  return nextSelection;
}
