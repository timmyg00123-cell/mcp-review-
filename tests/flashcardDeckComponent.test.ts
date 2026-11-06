import assert from 'node:assert';
import fs from 'node:fs';

const filePath = 'src/components/StructureFlashcardDeck.tsx';
assert.ok(fs.existsSync(filePath), `Target file ${filePath} must exist`);

const content = fs.readFileSync(filePath, 'utf-8');

// Test 1: Component exports and Props interface
assert.ok(content.includes('export interface StructureFlashcardDeckProps'), 'Must export StructureFlashcardDeckProps');
assert.ok(content.includes('export const StructureFlashcardDeck'), 'Must export StructureFlashcardDeck React component');
assert.ok(content.includes('onSessionComplete'), 'Must accept onSessionComplete callback');

// Test 2: Spaced Repetition Rating Buttons and exact intervals
assert.ok(content.includes('Again'), 'Must render Again button');
assert.ok(content.includes('Hard'), 'Must render Hard button');
assert.ok(content.includes('Good'), 'Must render Good button');
assert.ok(content.includes('Easy'), 'Must render Easy button');
assert.ok(content.includes('< 1 min') || content.includes('<1m') || content.includes('&lt; 1 min'), 'Must display < 1 min interval for Again');
assert.ok(content.includes('4 min') || content.includes('4m'), 'Must display 4 min interval for Hard');
assert.ok(content.includes('10 min') || content.includes('10m'), 'Must display 10 min interval for Good');
assert.ok(content.includes('1 day') || content.includes('1d'), 'Must display 1 day interval for Easy');

// Test 3: Keyboard handling and input/textarea guards
assert.ok(content.includes('keydown'), 'Must register keyboard listener for Space and 1-4');
assert.ok(content.includes('Space') || content.includes("' '"), 'Must handle Space key for flipping');
assert.ok(content.includes('INPUT') || content.includes('TEXTAREA') || content.includes('isContentEditable'), 'Must guard against keydown inside input or textarea');

// Test 4: Front of card blinding and prompt
assert.ok(content.includes('Identify the Pharmacologic Class & Key Moieties'), 'Must render prompt on card front');
assert.ok(content.includes('Flip Card') || content.includes('Show Answer'), 'Must render flip / show answer button');
assert.ok(content.includes('SmilesCanvas'), 'Must render 2D chemical structure using SmilesCanvas');

// Test 5: Back of card elements (class banner, trade name, target, moieties, SAR, suspend)
assert.ok(content.includes('pharmacologicalClass') || content.includes('chemicalClass'), 'Must display pharmacologic or chemical class banner on back');
assert.ok(content.includes('tradeName'), 'Must render trade name on back when present');
assert.ok(content.includes('keyFunctionalGroups'), 'Must display key functional groups on back');
assert.ok(content.includes('sarNotes') || content.includes('sar_rationale'), 'Must display SAR notes on back');
assert.ok(content.includes('Suspend Card') || content.includes('toggleCardSuspension'), 'Must provide card suspension toggle');

// Test 6: Spaced Repetition Service integration
assert.ok(content.includes('applySpacedRepetitionGrade'), 'Must import and use applySpacedRepetitionGrade');
assert.ok(content.includes('recordCardProgress'), 'Must import and use recordCardProgress');
assert.ok(content.includes('reQueueActiveSession'), 'Must import and use reQueueActiveSession');
assert.ok(content.includes('toggleCardSuspension'), 'Must import and use toggleCardSuspension');

// Test 7: Top bar module filter toggles and queue counters
assert.ok(content.includes('Antiplatelet'), 'Must include Antiplatelets module filter');
assert.ok(content.includes('Anticoagulant'), 'Must include Anticoagulants module filter');
assert.ok(content.includes('Heart Failure'), 'Must include Heart Failure module filter');
assert.ok(content.includes('Antiarrhythmic'), 'Must include Antiarrhythmics module filter');
assert.ok(content.includes('Remaining'), 'Must display Remaining counter');
assert.ok(content.includes('In-session') || content.includes('In-Session'), 'Must display In-session counter');
assert.ok(content.includes('Graduated'), 'Must display Graduated counter');
assert.ok(content.includes('Finish Session Early'), 'Must offer Finish Session Early option');

// Test 8: Theme compatibility (Light & Dark mode classes)
assert.ok(content.includes('dark:bg-slate-900') || content.includes('dark:bg-slate-800'), 'Must contain dark background classes');
assert.ok(content.includes('dark:text-slate-100') || content.includes('dark:text-slate-200'), 'Must contain dark text classes');
assert.ok(content.includes('dark:border-slate-800') || content.includes('dark:border-slate-700'), 'Must contain dark border classes');

console.log('FlashcardDeck component checks passed.');
