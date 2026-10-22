/**
 * Asynchronous Task Scheduler & Main Thread Yielding Utility
 *
 * Implements modern web performance standards for breaking up long tasks (>50ms)
 * to reduce Interaction to Next Paint (INP) presentation delay and prevent frame drops.
 */

/**
 * Yields control back to the browser's main thread to allow pending paints,
 * high-priority user input events, and style recalcs to flush before resuming.
 * Uses native `scheduler.yield()` when available, with a Promise setTimeout fallback.
 */
export async function yieldToMainThread(): Promise<void> {
  if (
    typeof window !== 'undefined' &&
    'scheduler' in window &&
    typeof (window as any).scheduler?.yield === 'function'
  ) {
    try {
      await (window as any).scheduler.yield();
      return;
    } catch {
      // Fallback if scheduler.yield fails
    }
  }

  // Fallback for browsers without Scheduler API (or Safari)
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

/**
 * Schedules non-critical work to run during browser idle periods.
 * Uses `requestIdleCallback` when supported, with a fallback to `setTimeout`.
 */
export function runWhenIdle(callback: () => void, timeoutMs = 1000): () => void {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    const handle = (window as any).requestIdleCallback(callback, { timeout: timeoutMs });
    return () => (window as any).cancelIdleCallback(handle);
  }
  const timer = setTimeout(callback, 0);
  return () => clearTimeout(timer);
}

/**
 * Iterates through a collection while enforcing a 50ms time budget.
 * Yields control to the main thread whenever execution exceeds 50ms,
 * preventing long-task warnings in DevTools.
 */
export async function processWithYieldBudget<T>(
  items: T[],
  processor: (item: T, index: number) => void | Promise<void>,
  budgetMs = 50
): Promise<void> {
  let deadline = performance.now() + budgetMs;

  for (let i = 0; i < items.length; i++) {
    await processor(items[i], i);

    if (performance.now() >= deadline) {
      await yieldToMainThread();
      deadline = performance.now() + budgetMs;
    }
  }
}
