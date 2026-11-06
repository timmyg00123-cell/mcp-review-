// tests/StructureFlashcardDeck.test.ts
import assert from 'node:assert';
import fs from 'node:fs';

const deckPath = 'src/components/StructureFlashcardDeck.tsx';
assert.ok(fs.existsSync(deckPath), `Deck file ${deckPath} must exist`);

const deckContent = fs.readFileSync(deckPath, 'utf-8');

// Test 1: StructureFlashcardDeck component exports & props
assert.ok(deckContent.includes('export interface StructureFlashcardDeckProps'), 'Must export StructureFlashcardDeckProps');
assert.ok(deckContent.includes('export const StructureFlashcardDeck'), 'Must export StructureFlashcardDeck component');
assert.ok(deckContent.includes('cards: FlashcardItem[]') || deckContent.includes('initialDeck?:') || deckContent.includes('cards'), 'Must accept cards prop');
assert.ok(deckContent.includes('onSessionComplete'), 'Must accept onSessionComplete callback');

// Test 2: Integration of StructureFlashcardCardFace
assert.ok(deckContent.includes("from './StructureFlashcardCardFace'"), 'Must import StructureFlashcardCardFace');
assert.ok(deckContent.includes('<StructureFlashcardCardFace'), 'Must render StructureFlashcardCardFace in deck');
assert.ok(deckContent.includes('structure={structure}'), 'Must pass structure to StructureFlashcardCardFace');
assert.ok(deckContent.includes('isFlipped={isFlipped}'), 'Must pass isFlipped to StructureFlashcardCardFace');
assert.ok(deckContent.includes('onToggleSuspend='), 'Must pass onToggleSuspend to StructureFlashcardCardFace');
assert.ok(deckContent.includes('onFlip='), 'Must pass onFlip to StructureFlashcardCardFace');

// Test 3: Spaced Repetition Rating Buttons in children slot
assert.ok(deckContent.includes('Again'), 'Must render Again rating button');
assert.ok(deckContent.includes('Hard'), 'Must render Hard rating button');
assert.ok(deckContent.includes('Good'), 'Must render Good rating button');
assert.ok(deckContent.includes('Easy'), 'Must render Easy rating button');
assert.ok(deckContent.includes('< 1 min') || deckContent.includes('<1m') || deckContent.includes('&lt; 1 min'), 'Must show Again interval');
assert.ok(deckContent.includes('4 min') || deckContent.includes('4m'), 'Must show Hard interval');
assert.ok(deckContent.includes('10 min') || deckContent.includes('10m'), 'Must show Good interval');
assert.ok(deckContent.includes('1 day') || deckContent.includes('1d'), 'Must show Easy interval');

// Test 4: Keyboard shortcuts and guards
assert.ok(deckContent.includes('keydown'), 'Must register keydown event listener');
assert.ok(deckContent.includes('Space') || deckContent.includes("' '"), 'Must handle Space key');
assert.ok(deckContent.includes('INPUT') || deckContent.includes('TEXTAREA') || deckContent.includes('isContentEditable'), 'Must guard input/textarea');

// Test 5: Module filter toggles & session counters
assert.ok(deckContent.includes('Antiplatelet'), 'Must include Antiplatelet filter');
assert.ok(deckContent.includes('Anticoagulant'), 'Must include Anticoagulant filter');
assert.ok(deckContent.includes('Heart Failure'), 'Must include Heart Failure filter');
assert.ok(deckContent.includes('Antiarrhythmic'), 'Must include Antiarrhythmic filter');
assert.ok(deckContent.includes('Remaining'), 'Must include Remaining counter');
assert.ok(deckContent.includes('In-session') || deckContent.includes('In-Session'), 'Must include In-session counter');
assert.ok(deckContent.includes('Graduated'), 'Must include Graduated counter');

// Test 6: Spaced Repetition Service integration
assert.ok(deckContent.includes('applySpacedRepetitionGrade'), 'Must call applySpacedRepetitionGrade');
assert.ok(deckContent.includes('recordCardProgress'), 'Must call recordCardProgress');
assert.ok(deckContent.includes('reQueueActiveSession'), 'Must call reQueueActiveSession');
assert.ok(deckContent.includes('toggleCardSuspension'), 'Must call toggleCardSuspension');

console.log('StructureFlashcardDeck integration test passed.');
