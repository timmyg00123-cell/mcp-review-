# Flashcard Shuffle Button Design

## Intent & Why
Students studying flashcards in either Structure Mode or Clinical Monograph Mode want to break deterministic sequence bias (e.g., memorizing cards by alphabetical or numerical order) without losing their current position or resetting their spaced repetition review progress.

## Goals, Non-Goals, and Anti-Goals
- **Goals**:
  - Add a dedicated 1-click `[🔀 Shuffle]` button to the flashcard deck toolbar next to the **Sort** selector and **⚙️ Display** button.
  - Randomize strictly the remaining unseen cards in the active session queue (`currentIndex + 1` through `activeQueue.length - 1`).
  - Keep the currently displayed card in place and preserve its flip state (`isFlipped`).
  - Keep all previously graded/passed cards prior to `currentIndex` unchanged in their historical positions.
  - Disable the button gracefully when fewer than 2 unseen cards remain in the active queue (`remainingCount <= 1`).
  - Provide brief visual feedback upon clicking (e.g. icon motion or momentary badge/tooltip confirmation).
  - Allow subsequent explicit selections in the **Sort** dropdown (e.g., *Class Number*, *Alphabetical*) to re-sort deterministically if the student chooses.
- **Non-Goals**:
  - Shuffling previously reviewed cards or resetting session counters.
  - Shuffling cards across filters or un-filtering suspended cards.
- **Anti-Goals**:
  - Shuffling must never mutate master SM-2 spaced repetition progress or storage keys.
  - Shuffling must never cause the card currently on screen to flip or be swapped out for a different card.

## Constraints
- Compatible with both deck modes: **Rapid Structure Recall Deck** (`renderMode === 'structure'`) and **Top 200 Clinical Monograph Deck** (`renderMode === 'clinical'`).
- Compatible with both filter modes: **Curriculum Modules** and **Top Drugs Taxonomy** (including single or multi-class filter subsets).
- Implemented with a testable pure helper function (e.g., `shuffleRemainingCards<T>(queue: T[], currentIndex: number, rng?: () => number): T[]`) utilizing the Fisher-Yates algorithm.

## Approaches Considered
1. **Approach 1: Dedicated Toolbar Shuffle Button (Selected)**:
   - Positioned directly in the deck controls toolbar alongside the Sort selector.
   - Clicking it runs an in-place Fisher-Yates shuffle on `activeQueue.slice(currentIndex + 1)`.
   - Keeps previously viewed cards and the active card untouched.
   - *Why chosen*: Clean, single-click access that does not clutter or complicate sort mode semantics.
2. **Approach 2: Integrated "Random / Shuffled" Sort Mode with Reshuffle Icon (Rejected)**:
   - Adds a sort mode to the dropdown plus an icon button.
   - *Why rejected*: Non-deterministic sort modes can lead to confusing behavior when users toggle filters or reset views.

## Architecture & Implementation Details
- **Utility Function**: `shuffleRemainingCards<T>(queue: T[], currentIndex: number, rng = Math.random): T[]`
  - Returns a new array.
  - Elements from index `0` to `currentIndex` are identical in order and reference.
  - Elements from index `currentIndex + 1` to `queue.length - 1` are shuffled using the Fisher-Yates algorithm.
  - If `currentIndex + 1 >= queue.length - 1`, returns a shallow copy of the queue without modification.
- **Component State & Handler**:
  - `handleShuffleRemaining` in `StructureFlashcardDeck.tsx` calculates the new queue using `shuffleRemainingCards` and updates `activeQueue`.
  - Sets temporary feedback state (e.g., `isRecentlyShuffled` for 1.2s) to show visual confirmation.
- **UI Element**:
  - Located in the toolbar next to the Sort select element.
  - Uses `Shuffle` icon from `lucide-react`.
  - Disabled when `activeQueue.length - currentIndex <= 1`.

## Verification Plan
- Unit tests for `shuffleRemainingCards` verifying:
  - Cards `0..currentIndex` remain in identical order.
  - Cards `(currentIndex + 1)..length - 1` are randomized when given a seeded or mock RNG.
  - Empty queues, 1-card remaining queues, and edge cases do not throw or mutate.
- Integration tests in `StructureFlashcardDeck`:
  - Renders the `[Shuffle]` button in both structure and clinical modes.
  - Clicking shuffle preserves `currentCard.structureId` and `isFlipped` state.
  - Clicking shuffle does not affect `currentIndex`.
  - Button is disabled when at the final card in the queue.
