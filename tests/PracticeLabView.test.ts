import assert from 'node:assert';
import fs from 'node:fs';

console.log('Running PracticeLabView Component Verification Test...\n');

// 1. Verify file exists
const viewPath = 'src/components/PracticeLabView.tsx';
assert.ok(fs.existsSync(viewPath), 'src/components/PracticeLabView.tsx must exist');

const content = fs.readFileSync(viewPath, 'utf-8');

// 2. Verify interface and component exports
assert.ok(content.includes('export interface PracticeLabViewProps'), 'Must export PracticeLabViewProps');
assert.ok(content.includes('export const PracticeLabView') || content.includes('export function PracticeLabView'), 'Must export PracticeLabView component');
assert.ok(content.includes('export type PracticeLabTab'), 'Must export PracticeLabTab type');

// 3. Verify lack of modal dialog / backdrop wrappers
assert.ok(!content.includes('role="dialog"'), 'PracticeLabView must not have role="dialog"');
assert.ok(!content.includes('aria-modal="true"'), 'PracticeLabView must not be aria-modal');
assert.ok(!content.includes('bg-black/60'), 'PracticeLabView must not have modal backdrop dimmer');
assert.ok(!content.includes('Escape'), 'PracticeLabView must not register modal Escape key dismiss listener');

// 4. Verify sub-tabs navigation
assert.ok(content.includes('practice-test'), 'Must support practice-test sub-tab');
assert.ok(content.includes('flashcards'), 'Must support flashcards sub-tab');
assert.ok(content.includes('diagnostics'), 'Must support diagnostics sub-tab');

// 5. Verify child study views integration
assert.ok(content.includes('CumulativePracticeTestView'), 'Must integrate CumulativePracticeTestView');
assert.ok(content.includes('StructureFlashcardDeck'), 'Must integrate StructureFlashcardDeck');
assert.ok(content.includes('StruggleDiagnosticOverview'), 'Must integrate StruggleDiagnosticOverview');

// 6. Verify Top 200 catalog deck integration
assert.ok(content.includes('getTop200Flashcards'), 'Must integrate getTop200Flashcards');

console.log('✓ PracticeLabView component contracts verified.\n');
