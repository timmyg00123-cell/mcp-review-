import assert from 'node:assert';
import fs from 'node:fs';

// Verify PracticeLabView passes initialFilterMode to StructureFlashcardDeck
const labPath = 'src/components/PracticeLabView.tsx';
const labContent = fs.readFileSync(labPath, 'utf-8');

assert.ok(
  labContent.includes("initialFilterMode={deckMode === 'top200' ? 'taxonomy' : 'curriculum'}"),
  'PracticeLabView must set initialFilterMode based on deckMode'
);

// Verify StructureFlashcardDeck accepts and uses initialFilterMode
const deckPath = 'src/components/StructureFlashcardDeck.tsx';
const deckContent = fs.readFileSync(deckPath, 'utf-8');

assert.ok(
  deckContent.includes('initialFilterMode?: DeckFilterMode'),
  'StructureFlashcardDeckProps must accept initialFilterMode'
);

console.log('e2eTherapeuticClassFilter tests passed.');
