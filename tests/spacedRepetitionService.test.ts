// tests/spacedRepetitionService.test.ts
import assert from 'node:assert';
import {
  applySpacedRepetitionGrade,
  toggleCardSuspension,
  loadFlashcardProgress,
  saveFlashcardProgress,
  clearFlashcardProgress,
  reQueueActiveSession,
  applyProgressToCards,
  recordCardProgress,
  getActiveFlashcards,
  getDueFlashcards,
  FLASHCARD_STORAGE_KEY,
} from '../src/utils/spacedRepetitionService';
import type { FlashcardItem } from '../src/types/cumulativeStudy';

console.log('Testing Spaced Repetition Queue Engine & Local Storage Persistence...');

const baseCard: FlashcardItem = {
  structureId: 'struct_test',
  drugName: 'Amiodarone',
  moduleIds: ['antiarrhythmic'],
  structure: {
    id: 'I',
    name: 'Amiodarone',
    chemicalClass: 'Benzofuran',
    pharmacologicalClass: 'Class III',
    target: 'K+',
    reversibility: 'Reversible',
    route: 'Oral',
    keyFunctionalGroups: ['Iodine', 'Benzofuran'],
    pkPdHighlights: {
      onset: 'Slow',
      duration: 'Long',
      halfLife: '50d',
      elimination: 'Hepatic',
    },
    sarNotes: 'Iodine causes thyroid toxicity',
  },
  intervalMinutes: 0,
  dueTimestamp: 0,
  repetitionCount: 0,
  state: 'new',
  isSuspended: false,
  struggleCount: 0,
};

// ============================================================================
// 1. Core Interval Transitions & In-Session Ratings (from Plan & Task Brief)
// ============================================================================
const fixedNow = 1_700_000_000_000;

// 1. Again: 1 min (< 1 min), struggleCount increments, reQueueOffset: -1
const againResult = applySpacedRepetitionGrade(baseCard, 'again', fixedNow);
assert.strictEqual(againResult.nextCardState.intervalMinutes, 1, 'Again interval must be 1 min');
assert.strictEqual(againResult.nextCardState.struggleCount, 1, 'Again must increment struggleCount to 1');
assert.strictEqual(againResult.nextCardState.repetitionCount, 1, 'Again must increment repetitionCount');
assert.strictEqual(againResult.nextCardState.state, 'learning', 'Again transitions card to learning state');
assert.strictEqual(
  againResult.nextCardState.dueTimestamp,
  fixedNow + 1 * 60 * 1000,
  'Again dueTimestamp must be now + 1 min'
);
assert.strictEqual(againResult.reQueueOffset, -1, 'Again must re-queue at end of active session (-1)');

// 2. Hard: 4 min, struggleCount increments, reQueueOffset: 3
const hardResult = applySpacedRepetitionGrade(baseCard, 'hard', fixedNow);
assert.strictEqual(hardResult.nextCardState.intervalMinutes, 4, 'Hard interval must be 4 min');
assert.strictEqual(hardResult.nextCardState.struggleCount, 1, 'Hard must increment struggleCount to 1');
assert.strictEqual(hardResult.nextCardState.repetitionCount, 1, 'Hard must increment repetitionCount');
assert.strictEqual(hardResult.nextCardState.state, 'learning', 'Hard keeps/transitions card to learning state');
assert.strictEqual(
  hardResult.nextCardState.dueTimestamp,
  fixedNow + 4 * 60 * 1000,
  'Hard dueTimestamp must be now + 4 min'
);
assert.strictEqual(hardResult.reQueueOffset, 3, 'Hard must re-queue 3 steps back in session');

// 3. Good: 10 min, struggleCount unchanged, graduates from active session
const goodResult = applySpacedRepetitionGrade(baseCard, 'good', fixedNow);
assert.strictEqual(goodResult.nextCardState.intervalMinutes, 10, 'Good interval must be 10 min');
assert.strictEqual(goodResult.nextCardState.struggleCount, 0, 'Good must not increment struggleCount');
assert.strictEqual(goodResult.nextCardState.repetitionCount, 1, 'Good must increment repetitionCount');
assert.strictEqual(goodResult.nextCardState.state, 'review', 'Good transitions new card to review');
assert.strictEqual(
  goodResult.nextCardState.dueTimestamp,
  fixedNow + 10 * 60 * 1000,
  'Good dueTimestamp must be now + 10 min'
);
assert.strictEqual(goodResult.reQueueOffset, null, 'Good must graduate from active session (offset null)');

// 4. Easy: 1440 min (1 day), mastered, graduates from active session
const easyResult = applySpacedRepetitionGrade(baseCard, 'easy', fixedNow);
assert.strictEqual(easyResult.nextCardState.intervalMinutes, 1440, 'Easy interval must be 1440 min (1 day)');
assert.strictEqual(easyResult.nextCardState.struggleCount, 0, 'Easy must not increment struggleCount');
assert.strictEqual(easyResult.nextCardState.repetitionCount, 1, 'Easy must increment repetitionCount');
assert.strictEqual(easyResult.nextCardState.state, 'mastered', 'Easy sets state to mastered');
assert.strictEqual(
  easyResult.nextCardState.dueTimestamp,
  fixedNow + 1440 * 60 * 1000,
  'Easy dueTimestamp must be now + 1440 min'
);
assert.strictEqual(easyResult.reQueueOffset, null, 'Easy must graduate from active session (offset null)');

// Cumulative struggle count check across multiple reviews
const strugglingCard: FlashcardItem = {
  ...baseCard,
  struggleCount: 3,
  repetitionCount: 4,
};
const secondAgain = applySpacedRepetitionGrade(strugglingCard, 'again', fixedNow);
assert.strictEqual(secondAgain.nextCardState.struggleCount, 4, 'Repeated struggle accumulates count to 4');
assert.strictEqual(secondAgain.nextCardState.repetitionCount, 5, 'Repetition count accumulates to 5');

// Good on an already mastered card stays mastered
const masteredCard: FlashcardItem = {
  ...baseCard,
  state: 'mastered',
  repetitionCount: 10,
};
const goodMastered = applySpacedRepetitionGrade(masteredCard, 'good', fixedNow);
assert.strictEqual(goodMastered.nextCardState.state, 'mastered', 'Good preserves mastered state');

console.log('✓ Spaced repetition grade transitions validated.');

// ============================================================================
// 2. Card Suspension Toggle
// ============================================================================
const suspendedCard = toggleCardSuspension(baseCard);
assert.strictEqual(suspendedCard.isSuspended, true, 'Toggling unsuspended card must set isSuspended to true');
assert.strictEqual(baseCard.isSuspended, false, 'Original card must remain unmutated');

const unsuspendedCard = toggleCardSuspension(suspendedCard);
assert.strictEqual(unsuspendedCard.isSuspended, false, 'Toggling suspended card must set isSuspended to false');

console.log('✓ Card suspension toggle validated.');

// ============================================================================
// 3. Active Session Queue Manipulation (reQueueActiveSession)
// ============================================================================
const cardA: FlashcardItem = { ...baseCard, structureId: 'A', drugName: 'Drug A' };
const cardB: FlashcardItem = { ...baseCard, structureId: 'B', drugName: 'Drug B' };
const cardC: FlashcardItem = { ...baseCard, structureId: 'C', drugName: 'Drug C' };
const cardD: FlashcardItem = { ...baseCard, structureId: 'D', drugName: 'Drug D' };
const cardE: FlashcardItem = { ...baseCard, structureId: 'E', drugName: 'Drug E' };
const cardF: FlashcardItem = { ...baseCard, structureId: 'F', drugName: 'Drug F' };

const initialQueue = [cardA, cardB, cardC, cardD, cardE, cardF];

// Case A: Card graduates (offset = null)
const updatedA_Graduated = { ...cardA, state: 'review' as const };
const queueAfterGraduation = reQueueActiveSession(initialQueue, 0, updatedA_Graduated, null);
assert.strictEqual(queueAfterGraduation.length, 6, 'Queue length should not change on graduation');
assert.strictEqual(queueAfterGraduation[0].state, 'review', 'Current index updated with new card state');
assert.deepStrictEqual(
  queueAfterGraduation.slice(1).map((c) => c.structureId),
  ['B', 'C', 'D', 'E', 'F'],
  'Remaining cards unaffected'
);

// Case B: Card fails again (offset = -1: re-queued at the end of active session)
const updatedA_Again = { ...cardA, struggleCount: 1, intervalMinutes: 1 };
const queueAfterAgain = reQueueActiveSession(initialQueue, 0, updatedA_Again, -1);
assert.strictEqual(queueAfterAgain.length, 7, 'Queue length increases by 1 when re-queued at end');
assert.strictEqual(queueAfterAgain[0], updatedA_Again, 'Card at currentIndex is updated');
assert.strictEqual(queueAfterAgain[6].structureId, 'A', 'Failed card appended to the very end of queue');
assert.strictEqual(queueAfterAgain[6].struggleCount, 1, 'Appended card retains struggle state');

// Case C: Card is hard (offset = 3: re-queued 3 cards behind current position)
// Current position is index 0. Next 3 cards are index 1 (B), index 2 (C), index 3 (D).
// Insert position should be after index 3, which is index 4.
const updatedA_Hard = { ...cardA, struggleCount: 1, intervalMinutes: 4 };
const queueAfterHard = reQueueActiveSession(initialQueue, 0, updatedA_Hard, 3);
assert.strictEqual(queueAfterHard.length, 7, 'Queue length increases by 1');
assert.strictEqual(queueAfterHard[0], updatedA_Hard, 'Current index updated');
assert.strictEqual(queueAfterHard[1].structureId, 'B', 'Next card is B');
assert.strictEqual(queueAfterHard[2].structureId, 'C', 'Card 2 is C');
assert.strictEqual(queueAfterHard[3].structureId, 'D', 'Card 3 is D');
assert.strictEqual(queueAfterHard[4].structureId, 'A', 'Card A re-inserted 3 positions ahead of next card');
assert.strictEqual(queueAfterHard[5].structureId, 'E', 'Card E shifted to position 5');
assert.strictEqual(queueAfterHard[6].structureId, 'F', 'Card F shifted to position 6');

// Case D: Offset exceeds remaining cards (inserts at end without out-of-bounds error)
const shortQueue = [cardA, cardB];
const queueShortHard = reQueueActiveSession(shortQueue, 0, updatedA_Hard, 5);
assert.strictEqual(queueShortHard.length, 3, 'Queue grows to 3');
assert.strictEqual(queueShortHard[2].structureId, 'A', 'Clamped to append at end when remaining < offset');

// Case E: Empty queue edge case
const emptyQueueResult = reQueueActiveSession([], 0, updatedA_Hard, -1);
assert.strictEqual(emptyQueueResult.length, 1);
assert.strictEqual(emptyQueueResult[0].structureId, 'A');

console.log('✓ Active session queue manipulation validated.');

// ============================================================================
// 4. Persistence: load, save, record, and merge (SSR / Node safe)
// ============================================================================
clearFlashcardProgress();
assert.deepStrictEqual(loadFlashcardProgress(), {}, 'Initial progress is empty');

const savedPayload = {
  struct_test: {
    intervalMinutes: 10,
    dueTimestamp: fixedNow + 10 * 60 * 1000,
    repetitionCount: 2,
    state: 'review' as const,
    isSuspended: false,
    struggleCount: 1,
  },
  struct_suspended: {
    intervalMinutes: 1440,
    dueTimestamp: fixedNow + 1440 * 60 * 1000,
    repetitionCount: 5,
    state: 'mastered' as const,
    isSuspended: true,
    struggleCount: 0,
  },
};

saveFlashcardProgress(savedPayload);
const loaded = loadFlashcardProgress();
assert.strictEqual(loaded.struct_test?.intervalMinutes, 10, 'Saved progress loads intervalMinutes');
assert.strictEqual(loaded.struct_test?.struggleCount, 1, 'Saved progress loads struggleCount');
assert.strictEqual(loaded.struct_suspended?.isSuspended, true, 'Saved progress loads isSuspended');

// recordCardProgress updates single card progress and persists
const updatedCardForRecord: FlashcardItem = {
  ...baseCard,
  structureId: 'struct_new_record',
  intervalMinutes: 4,
  state: 'learning',
  struggleCount: 2,
};
recordCardProgress(updatedCardForRecord);
const reloaded = loadFlashcardProgress();
assert.strictEqual(
  reloaded.struct_new_record?.intervalMinutes,
  4,
  'recordCardProgress persists newly added card'
);
assert.strictEqual(
  reloaded.struct_new_record?.struggleCount,
  2,
  'recordCardProgress persists struggle count'
);
assert.strictEqual(
  reloaded.struct_test?.intervalMinutes,
  10,
  'recordCardProgress preserves previously saved cards'
);

// applyProgressToCards merges stored progress onto fresh harvested deck
const freshHarvestedDeck: FlashcardItem[] = [
  { ...baseCard, structureId: 'struct_test', state: 'new' },
  { ...baseCard, structureId: 'struct_suspended', state: 'new' },
  { ...baseCard, structureId: 'struct_untouched', state: 'new' },
];

const mergedDeck = applyProgressToCards(freshHarvestedDeck);
assert.strictEqual(mergedDeck[0].state, 'review', 'Overlaid struct_test state becomes review');
assert.strictEqual(mergedDeck[0].intervalMinutes, 10, 'Overlaid struct_test interval is 10');
assert.strictEqual(mergedDeck[1].isSuspended, true, 'Overlaid struct_suspended becomes suspended');
assert.strictEqual(mergedDeck[1].state, 'mastered', 'Overlaid struct_suspended state is mastered');
assert.strictEqual(mergedDeck[2].state, 'new', 'Untouched card preserves original new state');
assert.strictEqual(mergedDeck[2].struggleCount, 0, 'Untouched card preserves struggle count 0');

console.log('✓ Persistence and deck hydration validated.');

// ============================================================================
// 5. Active & Due Flashcard Filtering
// ============================================================================
const cardsForFiltering: FlashcardItem[] = [
  // 1. New card (not suspended) -> due
  { ...baseCard, structureId: 'c1', state: 'new', isSuspended: false, dueTimestamp: 0 },
  // 2. Suspended new card -> not active, not due
  { ...baseCard, structureId: 'c2', state: 'new', isSuspended: true, dueTimestamp: 0 },
  // 3. Learning card past due -> due
  {
    ...baseCard,
    structureId: 'c3',
    state: 'learning',
    isSuspended: false,
    dueTimestamp: fixedNow - 1000,
  },
  // 4. Learning card future due -> active, but not due yet
  {
    ...baseCard,
    structureId: 'c4',
    state: 'learning',
    isSuspended: false,
    dueTimestamp: fixedNow + 60000,
  },
  // 5. Mastered card due in far future -> active, not due yet
  {
    ...baseCard,
    structureId: 'c5',
    state: 'mastered',
    isSuspended: false,
    dueTimestamp: fixedNow + 86400000,
  },
];

const activeOnly = getActiveFlashcards(cardsForFiltering);
assert.strictEqual(activeOnly.length, 4, 'Active filter removes 1 suspended card');
assert.ok(activeOnly.every((c) => !c.isSuspended), 'All active cards must not be suspended');

const dueCards = getDueFlashcards(cardsForFiltering, fixedNow);
assert.strictEqual(dueCards.length, 2, 'Exactly 2 cards are currently due (c1 and c3)');
assert.deepStrictEqual(
  dueCards.map((c) => c.structureId),
  ['c1', 'c3'],
  'Due cards match c1 (new) and c3 (past due timestamp)'
);

console.log('✓ Flashcard filtering validated.');

console.log('\nAll Spaced Repetition Queue Engine tests passed successfully!');
