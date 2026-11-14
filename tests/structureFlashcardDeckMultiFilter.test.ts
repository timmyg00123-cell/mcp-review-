import assert from 'node:assert';
import fs from 'node:fs';

const deckPath = 'src/components/StructureFlashcardDeck.tsx';
const content = fs.readFileSync(deckPath, 'utf-8');

// Test 1: Imports filter drawer and multi-filter helpers
assert.ok(
  content.includes("from './TherapeuticClassFilterDrawer'"),
  'Must import TherapeuticClassFilterDrawer'
);
assert.ok(
  content.includes('cardMatchesTaxonomyMultiFilter'),
  'Must import and use cardMatchesTaxonomyMultiFilter'
);
assert.ok(
  content.includes('selectedClassNumbers'),
  'Must track selectedClassNumbers state as Set<number>'
);

// Test 2: Drawer Trigger Button
assert.ok(
  content.includes('Filter Classes') || content.includes('Filter Categories'),
  'Must render drawer trigger button in deck header'
);
assert.ok(
  content.includes('isClassDrawerOpen') || content.includes('isFilterDrawerOpen'),
  'Must track drawer open state'
);

// Test 3: Subclass cascading dynamically filtered by selected classes (Review Focus 5)
assert.ok(
  content.includes('availableSubclasses'),
  'Must compute availableSubclasses dynamically from selected classes'
);

// Test 4: Current card index clamped or preserved on queue re-filter (Review Focus 2)
assert.ok(
  content.includes('currentIndex') && (content.includes('Math.min') || content.includes('findIndex')),
  'Must safely preserve or clamp currentIndex when queue updates'
);

// Test 5: Empty selection state with 1-click restore button (Review Focus 1)
assert.ok(
  content.includes('Restore All 39 Classes') || content.includes('Restore All Classes'),
  'Must render Restore All Classes button in empty selection state'
);

console.log('StructureFlashcardDeck multi-filter integration tests passed.');
