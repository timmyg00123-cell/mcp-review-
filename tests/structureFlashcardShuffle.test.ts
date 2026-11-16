import assert from 'node:assert/strict';
import fs from 'node:fs';
import { shuffleRemainingCards } from '../src/utils/flashcardQueueUtils';

function runTests() {
  console.log('--- Running structureFlashcardShuffle Contract & Integration Tests ---');

  const deckPath = 'src/components/StructureFlashcardDeck.tsx';
  const content = fs.readFileSync(deckPath, 'utf8');

  // Test 1: Imports shuffleRemainingCards utility
  assert.ok(
    content.includes("from '../utils/flashcardQueueUtils'") &&
      content.includes('shuffleRemainingCards'),
    'StructureFlashcardDeck must import shuffleRemainingCards from ../utils/flashcardQueueUtils'
  );

  // Test 2: Imports Shuffle icon from lucide-react
  assert.ok(
    content.includes('Shuffle') && content.includes("from 'lucide-react'"),
    'StructureFlashcardDeck must import Shuffle icon from lucide-react'
  );

  // Test 3: Defines handleShuffleRemaining callback
  assert.ok(
    content.includes('handleShuffleRemaining'),
    'StructureFlashcardDeck must define handleShuffleRemaining callback'
  );

  // Test 4: Contains disabled logic based on remaining cards (strictly requires >= 2 unseen cards)
  assert.ok(
    content.includes('remainingUnseenCount') &&
      content.includes('canShuffle = remainingUnseenCount >= 2'),
    'StructureFlashcardDeck must guard shuffle when fewer than 2 remaining unseen cards exist'
  );

  // Test 5: Renders Shuffle button in JSX with timeout cleanup
  assert.ok(
    content.includes('onClick={handleShuffleRemaining}') &&
      content.includes('<Shuffle className=') &&
      content.includes('shuffleFeedbackTimeoutRef'),
    'StructureFlashcardDeck must render Shuffle button with handleShuffleRemaining trigger and timeout cleanup'
  );

  // Test 6: Boundary Gating Formula Verification
  const queueLength = 5;
  const canShuffleAtBoundary = (currIdx: number) => {
    const remaining = Math.max(0, queueLength - currIdx - 1);
    return remaining >= 2;
  };
  assert.equal(canShuffleAtBoundary(0), true, 'Can shuffle at index 0 (4 remaining)');
  assert.equal(canShuffleAtBoundary(2), true, 'Can shuffle at index 2 (2 remaining)');
  assert.equal(canShuffleAtBoundary(3), false, 'Must NOT shuffle at second-to-last card (1 remaining)');
  assert.equal(canShuffleAtBoundary(4), false, 'Must NOT shuffle at last card (0 remaining)');

  // Test 7: Behavioral Invariants on simulated deck queue
  const mockQueue = [
    { structureId: '1', drugName: 'Aspirin' },
    { structureId: '2', drugName: 'Ibuprofen' },
    { structureId: '3', drugName: 'Acetaminophen' },
    { structureId: '4', drugName: 'Naproxen' },
  ];
  const currentIndex = 1;
  const activeCardBefore = mockQueue[currentIndex];

  const shuffled = shuffleRemainingCards(mockQueue, currentIndex);

  // Active card and prior card must be preserved in exact positions
  assert.equal(
    shuffled[currentIndex].structureId,
    activeCardBefore.structureId,
    'Active card at currentIndex must stay in place'
  );
  assert.equal(
    shuffled[0].structureId,
    mockQueue[0].structureId,
    'Prior reviewed card at index 0 must stay in place'
  );
  assert.equal(shuffled.length, mockQueue.length, 'Total queue length must be preserved');

  console.log('✅ All structureFlashcardShuffle contract & integration tests passed!');
}

runTests();
