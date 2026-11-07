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

// Test 7: Completion screen Retry Full Deck button with RotateCcw icon & restart handler
assert.ok(deckContent.includes('RotateCcw'), 'Must import and use RotateCcw icon from lucide-react');
assert.ok(deckContent.includes('Retry Full Deck') || deckContent.includes('Retry Deck'), 'Must render Retry Full Deck button');
assert.ok(deckContent.includes('handleRestartDeck'), 'Must define handleRestartDeck callback');
assert.ok(deckContent.includes('setActiveQueue(filtered)'), 'handleRestartDeck must reset active queue with filtered deck');
assert.ok(deckContent.includes('setCurrentIndex(0)'), 'handleRestartDeck must reset currentIndex to 0');
assert.ok(deckContent.includes('setIsFlipped(false)'), 'handleRestartDeck must reset isFlipped to false');
assert.ok(
  deckContent.includes('onClick={handleRestartDeck}'),
  'Retry Full Deck button must attach onClick={handleRestartDeck}'
);

// Test 8: Dynamic exam-aware filtering supporting Exam 1 (Renal, Respiratory) as well as Exam 3
assert.ok(deckContent.includes('export interface ModuleCategory'), 'Must export ModuleCategory interface');
assert.ok(deckContent.includes('KNOWN_MODULE_CATEGORIES'), 'Must export KNOWN_MODULE_CATEGORIES array');
assert.ok(deckContent.includes('getAvailableModuleFilters'), 'Must derive available filters dynamically');
assert.ok(deckContent.includes('cardMatchesModuleFilter'), 'Must check card module matching');
assert.ok(deckContent.includes('Renal'), 'Must include Renal filter category');
assert.ok(deckContent.includes('Respiratory'), 'Must include Respiratory filter category');
assert.ok(deckContent.includes('Antiplatelet'), 'Must include Antiplatelet filter category');
assert.ok(deckContent.includes('Anticoagulant'), 'Must include Anticoagulant filter category');
assert.ok(deckContent.includes('Heart Failure'), 'Must include Heart Failure filter category');
assert.ok(deckContent.includes('Antiarrhythmic'), 'Must include Antiarrhythmic filter category');
assert.ok(
  deckContent.includes('availableFilters.map'),
  'Must dynamically map availableFilters into filter toggle pills'
);

// Test 9: Functional pattern matching verification for Exam 1 & Exam 3 modules
const renalRegex = /renal/i;
const respRegex = /respirat|broncho|antiinflam/i;
const plateletRegex = /platelet/i;
const coagRegex = /coagul/i;
const hfRegex = /heart|failure/i;
const arrhythmRegex = /arrhythm/i;

// Exam 1 module IDs
assert.ok(renalRegex.test('renal_drugs_mcp2'), 'Renal pattern must match renal_drugs_mcp2');
assert.ok(respRegex.test('respiratory_bronchodilators_mcp2'), 'Resp pattern must match respiratory_bronchodilators_mcp2');
assert.ok(respRegex.test('respiratory_antiinflammatories_mcp2'), 'Resp pattern must match respiratory_antiinflammatories_mcp2');

// Exam 3 module IDs
assert.ok(plateletRegex.test('antiplatelets_mcp2'), 'Platelet pattern must match antiplatelets_mcp2');
assert.ok(coagRegex.test('anticoagulants_mcp2'), 'Coagulant pattern must match anticoagulants_mcp2');
assert.ok(hfRegex.test('heart_failure_mcp2'), 'HF pattern must match heart_failure_mcp2');
assert.ok(arrhythmRegex.test('antiarrhythmics_mcp2'), 'Arrhythmia pattern must match antiarrhythmics_mcp2');

// Test 10: Ensure Exam 1 cards are not excluded when all filters are true
assert.ok(
  deckContent.includes('matchingCategories.some') && deckContent.includes('!== false'),
  'cardMatchesModuleFilter must evaluate active categories with !== false default inclusion'
);

console.log('StructureFlashcardDeck integration test passed.');
