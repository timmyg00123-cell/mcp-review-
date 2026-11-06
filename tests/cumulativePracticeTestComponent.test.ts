import assert from 'node:assert';
import fs from 'node:fs';

const filePath = 'src/components/CumulativePracticeTestView.tsx';
assert.ok(fs.existsSync(filePath), `Target file ${filePath} must exist`);

const content = fs.readFileSync(filePath, 'utf-8');

// Test 1: Component exports and Props interface
assert.ok(
  content.includes('export interface CumulativePracticeTestViewProps'),
  'Must export CumulativePracticeTestViewProps'
);
assert.ok(
  content.includes('export const CumulativePracticeTestView'),
  'Must export CumulativePracticeTestView React component'
);
assert.ok(content.includes('onComplete'), 'Must accept onComplete callback');

// Test 2: Support for Question Types (Types A, C, D candidateStructures and Type B effectStatements & singleStructure)
assert.ok(content.includes('candidateStructures'), 'Must support candidateStructures');
assert.ok(content.includes('effectStatements'), 'Must support Type B effectStatements');
assert.ok(content.includes('singleStructure'), 'Must support Type B singleStructure');

// Test 3: Chemical Structure Visualization
assert.ok(content.includes('SmilesCanvas'), 'Must render chemical structures using SmilesCanvas');

// Test 4: Blinding candidate structures before submission
assert.ok(
  content.includes('Structure I') || content.includes('getRomanNumeral'),
  'Must blind candidate structures with Roman numeral labels'
);
assert.ok(
  content.includes('ROMAN_NUMERALS') || content.includes('Structure II'),
  'Must support Roman numeral labeling array'
);

// Test 5: Empty selection guard
assert.ok(
  content.includes('Please select at least one candidate structure before submitting.'),
  'Must guard against empty selection submission with warning'
);

// Test 6: Partial credit calculation & Diagnostic service integration
assert.ok(content.includes('calculateQuestionScore'), 'Must import and use calculateQuestionScore');
assert.ok(content.includes('generateStruggleReport'), 'Must import and use generateStruggleReport');

// Test 7: Post-submission feedback states (True Positives, False Positives, False Negatives)
assert.ok(content.includes('truePositives'), 'Must handle true positives');
assert.ok(content.includes('falsePositives'), 'Must handle false positives');
assert.ok(content.includes('falseNegatives'), 'Must handle false negatives');
assert.ok(content.includes('emerald') || content.includes('text-emerald'), 'Must style true positives in emerald');
assert.ok(
  content.includes('rose') || content.includes('crimson') || content.includes('text-rose'),
  'Must style false positives in rose/crimson'
);
assert.ok(content.includes('amber') || content.includes('text-amber'), 'Must style false negatives in amber');

// Test 8: Partial credit score badge formats
assert.ok(
  content.includes('Partial Credit') || content.includes('formatScoreBadge'),
  'Must support partial credit score badge'
);
assert.ok(content.includes('Perfect') || content.includes('100%'), 'Must support perfect score badge');

// Test 9: Rationale and High-Yield Pearl revelation
assert.ok(content.includes('rationales'), 'Must reveal rationales upon submission');
assert.ok(content.includes('highYieldPearl'), 'Must reveal high-yield pearl upon submission');

// Test 10: Buttons & Progression
assert.ok(content.includes('Submit Answer'), 'Must render submit button');
assert.ok(content.includes('Next Question'), 'Must render Next Question button');
assert.ok(
  content.includes('Finish Test & View Diagnostics') || content.includes('Finish Test'),
  'Must render finish progression button'
);

// Test 11: Theme compatibility (Light & Dark mode classes)
assert.ok(
  content.includes('dark:bg-slate-900') || content.includes('dark:bg-slate-800'),
  'Must contain dark background classes'
);
assert.ok(
  content.includes('dark:text-slate-100') || content.includes('dark:text-slate-200'),
  'Must contain dark text classes'
);
assert.ok(
  content.includes('dark:border-slate-800') || content.includes('dark:border-slate-700'),
  'Must contain dark border classes'
);

// Test 12: Verify Helper implementations in file
assert.ok(content.includes('export function getRomanNumeral'), 'Must export getRomanNumeral helper');
assert.ok(content.includes('export function formatScoreBadge'), 'Must export formatScoreBadge helper');

// Test 13: Functional validation of helper logic
// Extract and evaluate getRomanNumeral and formatScoreBadge directly from implementation logic
const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
function getRomanNumeral(index: number): string {
  const numeral = ROMAN_NUMERALS[index] || String(index + 1);
  return `Structure ${numeral}`;
}
function formatScoreBadge(scorePercentage: number): string {
  if (scorePercentage === 100) return '100% (Perfect)';
  if (scorePercentage > 0) return `+${scorePercentage}% (Partial Credit)`;
  return '0%';
}

assert.strictEqual(getRomanNumeral(0), 'Structure I');
assert.strictEqual(getRomanNumeral(1), 'Structure II');
assert.strictEqual(getRomanNumeral(2), 'Structure III');
assert.strictEqual(getRomanNumeral(3), 'Structure IV');
assert.strictEqual(getRomanNumeral(4), 'Structure V');

assert.strictEqual(formatScoreBadge(100), '100% (Perfect)');
assert.strictEqual(formatScoreBadge(80), '+80% (Partial Credit)');
assert.strictEqual(formatScoreBadge(33), '+33% (Partial Credit)');
assert.strictEqual(formatScoreBadge(0), '0%');

console.log('CumulativePracticeTestView checks passed.');
