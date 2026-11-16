# Flashcard Shuffle Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated shuffle button to the flashcards deck that randomizes only the remaining unseen cards in an active session while keeping the current card and reviewed cards in place.

**Architecture:** Pure Fisher-Yates array permutation helper (`shuffleRemainingCards`) preserves items from index `0` through `currentIndex` and randomizes indices `currentIndex + 1` through `length - 1`. `StructureFlashcardDeck.tsx` integrates this helper via a toolbar action button `[🔀 Shuffle]` positioned alongside the sort selector, with immediate visual feedback and boundary safety guards.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React (`Shuffle`, `Check`).

**Spec:** [2026-11-16-flashcard-shuffle-button-design.md](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20%282%29/docs/superpowers/specs/2026-11-16-flashcard-shuffle-button-design.md)

## Global Constraints

- Never mutate the original queue in place; always return a newly created array.
- Cards from index `0` up to `currentIndex` (inclusive) must remain in exact index order and retain reference equality.
- Current card flip state (`isFlipped`) and card index (`currentIndex`) must never be modified by shuffling.
- Spaced repetition data and persistence (`localStorage`) must not be touched or altered by shuffle operations.
- The button must be disabled whenever `activeQueue.length - currentIndex <= 1`.
- Compatible with both Chemical Structure Mode (`renderMode === 'structure'`) and Clinical Monograph Mode (`renderMode === 'clinical'`).

## Review Focus

1. **At final card (`currentIndex >= activeQueue.length - 1`):** Shuffle button is disabled; calling `shuffleRemainingCards` returns a shallow copy of the queue without errors.
2. **At first card (`currentIndex === 0`):** Card 0 remains in place; cards `1..length - 1` are shuffled.
3. **Card flipped state (`isFlipped === true`):** Clicking shuffle preserves `isFlipped === true` and does not flip the card face.
4. **Multiple rapid clicks:** Multiple shuffles permute the remaining slice without duplicating, dropping cards, or causing state desynchronization.
5. **Re-sorting after shuffle:** Changing the `Sort:` selector re-sorts the queue deterministically according to the selected mode.

---

### Task 1: Pure Shuffle Queue Utility & Unit Tests

**Files:**
- Create: `src/utils/flashcardQueueUtils.ts`
- Test: `tests/flashcardQueueUtils.test.ts`

**Interfaces:**
- Produces: `export function shuffleRemainingCards<T>(queue: T[], currentIndex: number, rng?: () => number): T[]`

- [ ] **Step 1: Write the failing unit tests in `tests/flashcardQueueUtils.test.ts`**

```typescript
import assert from 'node:assert/strict';
import { shuffleRemainingCards } from '../src/utils/flashcardQueueUtils';

// Test 1: Preserves 0..currentIndex and randomizes currentIndex + 1 .. end
const items = ['A', 'B', 'C', 'D', 'E'];
// Predictable pseudo-RNG for deterministic test verification
let seed = 0.8;
const mockRng = () => {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};
const result = shuffleRemainingCards(items, 1, mockRng);
assert.equal(result[0], 'A', 'Item at index 0 must not change');
assert.equal(result[1], 'B', 'Current item at index 1 must not change');
assert.equal(result.length, 5, 'Length must be preserved');
assert.deepEqual(new Set(result), new Set(items), 'All items must be retained');

// Test 2: Final card remaining is no-op
const atEnd = shuffleRemainingCards(['A', 'B'], 1);
assert.deepEqual(atEnd, ['A', 'B'], 'Should return identical items when at last card');

// Test 3: Past end is no-op
const pastEnd = shuffleRemainingCards(['A', 'B'], 5);
assert.deepEqual(pastEnd, ['A', 'B'], 'Should handle index past end safely');

// Test 4: Empty queue or single item
assert.deepEqual(shuffleRemainingCards([], 0), []);
assert.deepEqual(shuffleRemainingCards(['A'], 0), ['A']);

// Test 5: At index 0, first item stays, rest shuffled
const fromStart = shuffleRemainingCards(['A', 'B', 'C', 'D'], 0, mockRng);
assert.equal(fromStart[0], 'A', 'Card 0 must stay in place');
assert.equal(fromStart.length, 4);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/flashcardQueueUtils.test.ts`
Expected: FAIL with module not found or export missing.

- [ ] **Step 3: Implement `shuffleRemainingCards` in `src/utils/flashcardQueueUtils.ts`**

Implement Fisher-Yates permutation on a slice of the array from `currentIndex + 1` to `queue.length - 1`, assembling `[...queue.slice(0, currentIndex + 1), ...shuffledRemaining]`.

```typescript
/**
 * Randomizes only the remaining unseen cards in an active session queue,
 * leaving elements from index 0 through currentIndex untouched in place.
 */
export function shuffleRemainingCards<T>(
  queue: T[],
  currentIndex: number,
  rng: () => number = Math.random
): T[] {
  if (!queue || queue.length <= 1 || currentIndex >= queue.length - 2) {
    return [...queue];
  }

  const prefix = queue.slice(0, currentIndex + 1);
  const remaining = queue.slice(currentIndex + 1);

  // Fisher-Yates in-place shuffle on the remaining slice
  for (let i = remaining.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = remaining[i];
    remaining[i] = remaining[j];
    remaining[j] = temp;
  }

  return [...prefix, ...remaining];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/flashcardQueueUtils.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/flashcardQueueUtils.ts tests/flashcardQueueUtils.test.ts
git commit -m "feat(flashcards): implement shuffleRemainingCards utility with Fisher-Yates algorithm"
```

---

### Task 2: Deck Toolbar Integration & Verification

**Files:**
- Modify: `src/components/StructureFlashcardDeck.tsx`
- Test: `tests/structureFlashcardShuffle.test.ts`

**Interfaces:**
- Consumes: `shuffleRemainingCards` from `src/utils/flashcardQueueUtils`
- Produces: Updated `StructureFlashcardDeck` component rendering `[🔀 Shuffle]` button with feedback and boundary protection.

- [ ] **Step 1: Write integration and contract tests in `tests/structureFlashcardShuffle.test.ts`**

Verify:
1. `StructureFlashcardDeck.tsx` imports and references `shuffleRemainingCards` and `Shuffle` from `lucide-react`.
2. Button renders in toolbar with title and icon.
3. Renders disabled state when `activeQueue.length - currentIndex <= 1`.
4. Renders enabled state when `activeQueue.length - currentIndex > 1`.
5. Simulating shuffle preserves `currentCard`, `currentIndex`, and `isFlipped`.
6. Changing Sort dropdown re-sorts candidate queue properly after shuffle.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/structureFlashcardShuffle.test.ts`
Expected: FAIL due to missing shuffle button/import in `StructureFlashcardDeck.tsx`.

- [ ] **Step 3: Integrate Shuffle button into `src/components/StructureFlashcardDeck.tsx`**

1. Import `shuffleRemainingCards` from `../utils/flashcardQueueUtils`.
2. Import `Shuffle`, `Check` from `lucide-react`.
3. Add feedback state:
   ```typescript
   const [isRecentlyShuffled, setIsRecentlyShuffled] = useState<boolean>(false);
   ```
4. Add handler:
   ```typescript
   const canShuffle = activeQueue.length - currentIndex > 1;

   const handleShuffleRemaining = useCallback(() => {
     if (!canShuffle) return;
     const shuffled = shuffleRemainingCards(activeQueue, currentIndex);
     setActiveQueue(shuffled);
     setIsRecentlyShuffled(true);
     setTimeout(() => setIsRecentlyShuffled(false), 1200);
   }, [activeQueue, currentIndex, canShuffle]);
   ```
5. Place button right beside the `Sort:` selector in the toolbar:
   ```tsx
   <button
     type="button"
     onClick={handleShuffleRemaining}
     disabled={!canShuffle}
     className={`py-1 px-2.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
       !canShuffle
         ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-slate-900'
         : isRecentlyShuffled
         ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
         : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200'
     }`}
     title={
       canShuffle
         ? `Shuffle ${activeQueue.length - currentIndex - 1} remaining cards in this session`
         : 'No remaining cards to shuffle'
     }
   >
     {isRecentlyShuffled ? (
       <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
     ) : (
       <Shuffle className="w-3.5 h-3.5" />
     )}
     <span>{isRecentlyShuffled ? 'Shuffled' : 'Shuffle'}</span>
   </button>
   ```

- [ ] **Step 4: Run integration tests and full suite to verify everything passes**

Run:
```bash
npx tsx tests/flashcardQueueUtils.test.ts
npx tsx tests/structureFlashcardShuffle.test.ts
npx tsx tests/StructureFlashcardDeck.test.ts
npx tsx tests/structureFlashcardDeckMultiFilter.test.ts
npx tsx tests/e2eTherapeuticClassFilter.test.ts
npm run lint
npm run build
```
Expected: All tests PASS, lint passes with 0 errors, build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/StructureFlashcardDeck.tsx tests/structureFlashcardShuffle.test.ts
git commit -m "feat(flashcards): add Shuffle remaining button to flashcard deck toolbar"
```
