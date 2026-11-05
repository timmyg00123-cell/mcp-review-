import assert from 'node:assert';
import { resolveComparatorViewMode } from '../src/utils/comparatorViewMode';

// Test 1: Auto mode with single structure resolves to 'single'
assert.strictEqual(
  resolveComparatorViewMode({ viewMode: 'auto', structureCount: 1 }),
  'single',
  'auto mode with 1 structure must resolve to single'
);

// Test 2: Auto mode with multiple structures resolves to 'compare'
assert.strictEqual(
  resolveComparatorViewMode({ viewMode: 'auto', structureCount: 2 }),
  'compare',
  'auto mode with 2 structures must resolve to compare'
);

// Test 3: Explicit 'single' mode with multiple structures preserves 'single'
assert.strictEqual(
  resolveComparatorViewMode({ viewMode: 'single', structureCount: 5 }),
  'single',
  'explicit single mode with multiple structures must resolve to single'
);

// Test 4: Explicit 'compare' mode with multiple structures resolves to 'compare'
assert.strictEqual(
  resolveComparatorViewMode({ viewMode: 'compare', structureCount: 3 }),
  'compare',
  'explicit compare mode with multiple structures must resolve to compare'
);

// Test 5: Explicit 'compare' mode with only 1 structure safely falls back to 'single'
assert.strictEqual(
  resolveComparatorViewMode({ viewMode: 'compare', structureCount: 1 }),
  'single',
  'compare mode with only 1 structure must safely fallback to single'
);

// Test 6: Undefined viewMode defaults to 'auto' behavior
assert.strictEqual(
  resolveComparatorViewMode({ viewMode: undefined, structureCount: 1 }),
  'single',
  'undefined viewMode with 1 structure must resolve to single'
);
assert.strictEqual(
  resolveComparatorViewMode({ viewMode: undefined, structureCount: 4 }),
  'compare',
  'undefined viewMode with 4 structures must resolve to compare'
);

console.log('Single structure stage unit tests passed!');
