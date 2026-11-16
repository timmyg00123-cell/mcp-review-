/**
 * Utilities for flashcard session queue manipulation.
 */

/**
 * Randomizes only the remaining unseen cards in an active session queue,
 * leaving elements from index 0 through currentIndex untouched in place.
 *
 * @param queue - The active session queue of cards.
 * @param currentIndex - The index of the currently active card being viewed.
 * @param rng - Optional custom random number generator (defaults to Math.random).
 * @returns A new array with cards up to currentIndex preserved and subsequent cards shuffled.
 */
export function shuffleRemainingCards<T>(
  queue: T[],
  currentIndex: number,
  rng: () => number = Math.random
): T[] {
  if (!queue || queue.length <= 1) {
    return queue ? [...queue] : [];
  }

  // If currentIndex is at or past the second-to-last card, no remaining cards can be permuted
  if (currentIndex >= queue.length - 2) {
    return [...queue];
  }

  // If currentIndex < 0, all cards are remaining; otherwise slice prefix 0..currentIndex
  const prefix = currentIndex >= 0 ? queue.slice(0, currentIndex + 1) : [];
  const remaining = currentIndex >= 0 ? queue.slice(currentIndex + 1) : [...queue];

  // Fisher-Yates in-place shuffle on the remaining slice
  for (let i = remaining.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = remaining[i];
    remaining[i] = remaining[j];
    remaining[j] = temp;
  }

  return [...prefix, ...remaining];
}
