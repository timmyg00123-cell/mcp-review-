import assert from 'node:assert';
import {
  TOP200_CLASS_FILTER_STORAGE_KEY,
  ALL_THERAPEUTIC_CLASS_NUMBERS,
  ORGAN_SYSTEM_CLUSTERS,
  cardMatchesTaxonomyMultiFilter,
  loadSelectedClassNumbers,
  saveSelectedClassNumbers,
  computeContiguousSweep,
} from '../src/utils/therapeuticClassFilter';
import type { FlashcardItem } from '../src/types/cumulativeStudy';

// Test 1: Constant bounds & 1-39 ascending sequence
assert.strictEqual(ALL_THERAPEUTIC_CLASS_NUMBERS.length, 39);
assert.strictEqual(ALL_THERAPEUTIC_CLASS_NUMBERS[0], 1);
assert.strictEqual(ALL_THERAPEUTIC_CLASS_NUMBERS[38], 39);
for (let i = 0; i < 39; i++) {
  assert.strictEqual(ALL_THERAPEUTIC_CLASS_NUMBERS[i], i + 1);
}

// Test 2: Organ system clusters exist and match spec
const cardio = ORGAN_SYSTEM_CLUSTERS.find((c) => c.key === 'cardio');
assert.ok(cardio, 'Cardio cluster must exist');
assert.deepStrictEqual(cardio.classNumbers, [10, 11, 12, 13, 14, 15]);

const cns = ORGAN_SYSTEM_CLUSTERS.find((c) => c.key === 'cns');
assert.ok(cns, 'CNS cluster must exist');
assert.deepStrictEqual(cns.classNumbers, [3, 4, 16, 17, 20, 32, 38]);

const antiInfective = ORGAN_SYSTEM_CLUSTERS.find((c) => c.key === 'anti-infective');
assert.ok(antiInfective, 'Anti-infective cluster must exist');
assert.deepStrictEqual(antiInfective.classNumbers, [2, 9, 18, 19, 28]);

const endocrine = ORGAN_SYSTEM_CLUSTERS.find((c) => c.key === 'endocrine');
assert.ok(endocrine, 'Endocrine cluster must exist');
assert.deepStrictEqual(endocrine.classNumbers, [5, 6, 24, 30, 39]);

// Test 3: cardMatchesTaxonomyMultiFilter behavior
const sampleCard: FlashcardItem = {
  id: 'card-1',
  drugName: 'Metoprolol',
  structure: {
    id: 'metoprolol',
    name: 'Metoprolol',
    therapeuticClassNumber: 10,
    therapeuticCategory: 'Cardiovascular Agent',
    specificPharmacologicClass: 'Beta-1 Selective Blocker',
  },
  moduleIds: ['cardio'],
  status: 'new',
  easeFactor: 2.5,
  intervalDays: 0,
  repetitions: 0,
  dueTimestamp: Date.now(),
} as unknown as FlashcardItem;

// Match when class is in selected set
assert.strictEqual(
  cardMatchesTaxonomyMultiFilter(sampleCard, new Set([10, 11])),
  true
);

// Do not match when class is excluded
assert.strictEqual(
  cardMatchesTaxonomyMultiFilter(sampleCard, new Set([1, 2, 3])),
  false
);

// Empty set matches nothing (Review Focus 1)
assert.strictEqual(
  cardMatchesTaxonomyMultiFilter(sampleCard, new Set()),
  false
);

// Subclass filter matching
assert.strictEqual(
  cardMatchesTaxonomyMultiFilter(sampleCard, new Set([10]), 'Beta-1 Selective Blocker'),
  true
);
assert.strictEqual(
  cardMatchesTaxonomyMultiFilter(sampleCard, new Set([10]), 'ACE Inhibitor'),
  false
);

// Test 4: Storage loading with corrupted/empty values (Review Focus 3)
const mockStorage: Record<string, string> = {};
const fakeStorage = {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, val: string) => {
    mockStorage[key] = val;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {},
  key: () => null,
  length: 0,
};

// Defaults to all 39 when storage empty
assert.strictEqual(loadSelectedClassNumbers(fakeStorage as unknown as Storage).size, 39);

// Corrupted JSON falls back to all 39
mockStorage[TOP200_CLASS_FILTER_STORAGE_KEY] = 'invalid-json{';
assert.strictEqual(loadSelectedClassNumbers(fakeStorage as unknown as Storage).size, 39);

// Non-array falls back to all 39
mockStorage[TOP200_CLASS_FILTER_STORAGE_KEY] = '{"test": 123}';
assert.strictEqual(loadSelectedClassNumbers(fakeStorage as unknown as Storage).size, 39);

// Valid array loads correctly
saveSelectedClassNumbers(new Set([10, 11, 12]), fakeStorage as unknown as Storage);
const loaded = loadSelectedClassNumbers(fakeStorage as unknown as Storage);
assert.deepStrictEqual(Array.from(loaded).sort((a, b) => a - b), [10, 11, 12]);

// Test 5: computeContiguousSweep handles downward and upward scrubbing
const initialSet = new Set([1, 2, 3, 4, 5]);

// Sweep down to select 6..8
const sweptDown = computeContiguousSweep(6, 8, initialSet, true, ALL_THERAPEUTIC_CLASS_NUMBERS);
assert.ok(sweptDown.has(6) && sweptDown.has(7) && sweptDown.has(8));
assert.ok(sweptDown.has(1) && sweptDown.has(5));

// Sweep up to deselect 3..1
const sweptUp = computeContiguousSweep(3, 1, initialSet, false, ALL_THERAPEUTIC_CLASS_NUMBERS);
assert.strictEqual(sweptUp.has(1), false);
assert.strictEqual(sweptUp.has(2), false);
assert.strictEqual(sweptUp.has(3), false);
assert.strictEqual(sweptUp.has(4), true);
assert.strictEqual(sweptUp.has(5), true);

// Test 6: Additional edge case tests

// 6a. card without therapeuticClassNumber matches nothing
const cardWithoutClass: FlashcardItem = {
  ...sampleCard,
  structure: {
    ...sampleCard.structure,
    therapeuticClassNumber: undefined,
  },
} as unknown as FlashcardItem;
assert.strictEqual(
  cardMatchesTaxonomyMultiFilter(cardWithoutClass, new Set([10, 11])),
  false
);

// 6b. Storage with all out-of-range numbers falls back to 39
mockStorage[TOP200_CLASS_FILTER_STORAGE_KEY] = JSON.stringify([0, 40, 999]);
assert.strictEqual(loadSelectedClassNumbers(fakeStorage as unknown as Storage).size, 39);

// 6c. Storage with empty array falls back to 39
mockStorage[TOP200_CLASS_FILTER_STORAGE_KEY] = JSON.stringify([]);
assert.strictEqual(loadSelectedClassNumbers(fakeStorage as unknown as Storage).size, 39);

// 6d. Single-element sweep
const singleSweep = computeContiguousSweep(5, 5, new Set([1, 2]), true, ALL_THERAPEUTIC_CLASS_NUMBERS);
assert.ok(singleSweep.has(5) && singleSweep.has(1) && singleSweep.has(2));
assert.strictEqual(singleSweep.size, 3);

// 6e. Immutability of currentSelection
const originalSet = new Set([1, 2]);
computeContiguousSweep(3, 4, originalSet, true, ALL_THERAPEUTIC_CLASS_NUMBERS);
assert.strictEqual(originalSet.has(3), false);
assert.strictEqual(originalSet.size, 2);

console.log('therapeuticClassFilter tests passed.');
