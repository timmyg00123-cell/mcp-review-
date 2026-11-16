import assert from 'node:assert/strict';
import { shuffleRemainingCards } from '../src/utils/flashcardQueueUtils';

async function runTests() {
  console.log('--- Running flashcardQueueUtils Unit Tests ---');

  // Test 1: Preserves 0..currentIndex and randomizes currentIndex + 1 .. end
  const items = ['CardA', 'CardB', 'CardC', 'CardD', 'CardE'];
  const itemsCopy = [...items];

  // Predictable pseudo-RNG for deterministic test verification
  let seed = 0.8;
  const mockRng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const result = shuffleRemainingCards(items, 1, mockRng);

  assert.equal(result[0], 'CardA', 'Item at index 0 must not change');
  assert.equal(result[1], 'CardB', 'Current item at index 1 must not change');
  assert.equal(result.length, 5, 'Length must be preserved');
  assert.deepEqual(new Set(result), new Set(items), 'All items must be retained');
  // Check that input array was not mutated in-place
  assert.deepEqual(items, itemsCopy, 'Input array must not be mutated in-place');
  // With this mockRng, verify that the remaining items were actually permuted
  assert.notDeepEqual(result.slice(2), items.slice(2), 'Remaining items should be permuted');

  // Test 2: Final card remaining is no-op (remainingCount = 1)
  const atEnd = shuffleRemainingCards(['A', 'B'], 1);
  assert.deepEqual(atEnd, ['A', 'B'], 'Should return identical items when at last card');

  // Test 3: Past end is no-op
  const pastEnd = shuffleRemainingCards(['A', 'B'], 5);
  assert.deepEqual(pastEnd, ['A', 'B'], 'Should handle index past end safely');

  // Test 4: Negative currentIndex is treated safely (shuffles entire array if negative)
  // If currentIndex is -1, 0..-1 is empty prefix, remaining is 0..end
  const negIndex = shuffleRemainingCards(['A', 'B', 'C'], -1, mockRng);
  assert.equal(negIndex.length, 3);
  assert.deepEqual(new Set(negIndex), new Set(['A', 'B', 'C']));

  // Test 5: Empty queue or single item
  assert.deepEqual(shuffleRemainingCards([], 0), []);
  assert.deepEqual(shuffleRemainingCards(['A'], 0), ['A']);

  // Test 6: At index 0, first item stays, rest shuffled
  const fromStart = shuffleRemainingCards(['A', 'B', 'C', 'D'], 0, mockRng);
  assert.equal(fromStart[0], 'A', 'Card 0 must stay in place');
  assert.equal(fromStart.length, 4);
  assert.deepEqual(new Set(fromStart), new Set(['A', 'B', 'C', 'D']));

  // Test 7: Default Math.random works without throwing
  const randomRun = shuffleRemainingCards(['A', 'B', 'C', 'D', 'E'], 2);
  assert.equal(randomRun[0], 'A');
  assert.equal(randomRun[1], 'B');
  assert.equal(randomRun[2], 'C');
  assert.equal(randomRun.length, 5);
  assert.deepEqual(new Set(randomRun), new Set(['A', 'B', 'C', 'D', 'E']));

  console.log('✅ All flashcardQueueUtils tests passed!');
}

runTests();
