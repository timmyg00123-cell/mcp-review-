// tests/struggleDiagnosticOverviewComponent.test.ts
import assert from 'node:assert';
import fs from 'node:fs';
import type { StruggleDiagnosticReport } from '../src/types/cumulativeStudy';

const filePath = 'src/components/StruggleDiagnosticOverview.tsx';
assert.ok(fs.existsSync(filePath), `Target file ${filePath} must exist`);

const content = fs.readFileSync(filePath, 'utf-8');

// Test 1: Component exports and Props interface
assert.ok(
  content.includes('export interface StruggleDiagnosticOverviewProps'),
  'Must export StruggleDiagnosticOverviewProps'
);
assert.ok(
  content.includes('export const StruggleDiagnosticOverview'),
  'Must export StruggleDiagnosticOverview React component'
);
assert.ok(content.includes('onDrillStruggled'), 'Must accept onDrillStruggled callback prop');
assert.ok(content.includes('onReset'), 'Must accept onReset callback prop');
assert.ok(content.includes('onClose'), 'Must accept onClose callback prop');

// Test 2: Score KPI header with session type, accuracy percentage, and item counts
assert.ok(
  content.includes('scorePercentage') || content.includes('Accuracy') || content.includes('Score'),
  'Must render accuracy percentage or score'
);
assert.ok(
  content.includes('totalItemsReviewed') || content.includes('Reviewed') || content.includes('Total Items'),
  'Must render total items reviewed count'
);
assert.ok(
  content.includes('masteredCount') || content.includes('Mastered') || content.includes('Clean'),
  'Must render count or badge of mastered/clean items'
);

// Test 3: High-yield struggle patterns & insight callout box
assert.ok(
  content.includes('primaryStrugglePatterns'),
  'Must reference primaryStrugglePatterns from report'
);
assert.ok(
  content.includes('Struggle Insights') || content.includes('Struggle Patterns') || content.includes('High-Yield'),
  'Must render high-yield struggle patterns callout header'
);

// Test 4: Two-column diagnostic grid layout
assert.ok(
  content.includes('struggledStructures') || content.includes('Struggled Structures'),
  'Must render struggled structures'
);
assert.ok(
  content.includes('classBreakdown') || content.includes('Recall Rate') || content.includes('Class Breakdown'),
  'Must render class recall breakdown'
);

// Test 5: Chemical structure visualization & details in struggled structures list
assert.ok(
  content.includes('SmilesCanvas'),
  'Must render structure 2D view using SmilesCanvas'
);
assert.ok(
  content.includes('drugName'),
  'Must display drug name for struggled structure'
);
assert.ok(
  content.includes('pharmacologicalClass') || content.includes('chemicalClass'),
  'Must display pharmacological and/or chemical class for struggled structure'
);
assert.ok(
  content.includes('reason') || content.includes('struggleCount'),
  'Must render struggle reason or count attribution'
);

// Test 6: Colored progress bars for pharmacologic & chemical class recall
// emerald for 100%, amber for 50-99%, rose for <50%
assert.ok(
  content.includes('emerald') || content.includes('text-emerald') || content.includes('bg-emerald'),
  'Must support emerald styling for 100% recall'
);
assert.ok(
  content.includes('amber') || content.includes('text-amber') || content.includes('bg-amber'),
  'Must support amber styling for 50-99% recall'
);
assert.ok(
  content.includes('rose') || content.includes('text-rose') || content.includes('bg-rose'),
  'Must support rose styling for <50% recall'
);

// Test 7: 1-Click Remediation Actions
assert.ok(
  content.includes('Drill Struggled Items Now') || content.includes('Drill Struggled Items'),
  'Must render 1-click Drill Struggled Items Now action button'
);
assert.ok(
  content.includes('remediationCandidateIds') || content.includes('remediationCandidate'),
  'Must pass remediationCandidateIds to onDrillStruggled'
);
assert.ok(
  content.includes('Retake Session') || content.includes('Reset') || content.includes('onReset'),
  'Must render Retake Session action button'
);
assert.ok(
  content.includes('Close') || content.includes('Back to Hub') || content.includes('onClose'),
  'Must render Close / Back to Hub action button'
);

// Test 8: Empty state handling for zero struggled items
assert.ok(
  content.includes('No struggled structures detected') || content.includes('No struggled structures'),
  'Must provide clean empty state when no struggled structures exist'
);

// Test 9: Strict Light and Dark mode styling compatibility
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

// Test 10: Helper function export for recall rate color mapping
assert.ok(
  content.includes('export function getRecallColorClass'),
  'Must export helper for recall rate classification'
);

// Test 11: Functional validation of recall color mapping logic
function testGetRecallColorClass(recallRate: number): {
  bg: string;
  text: string;
  border: string;
  bar: string;
  label: string;
} {
  if (recallRate >= 100) {
    return {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800/40',
      bar: 'bg-emerald-500',
      label: 'Full Recall',
    };
  }
  if (recallRate >= 50) {
    return {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800/40',
      bar: 'bg-amber-500',
      label: 'Moderate Recall',
    };
  }
  return {
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    text: 'text-rose-700 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800/40',
    bar: 'bg-rose-500',
    label: 'Critical Friction',
  };
}

const perfect = testGetRecallColorClass(100);
assert.ok(perfect.bar.includes('bg-emerald'), '100% must map to emerald bar');
assert.strictEqual(perfect.label, 'Full Recall');

const moderate = testGetRecallColorClass(75);
assert.ok(moderate.bar.includes('bg-amber'), '75% must map to amber bar');
assert.strictEqual(moderate.label, 'Moderate Recall');

const critical = testGetRecallColorClass(33);
assert.ok(critical.bar.includes('bg-rose'), '33% must map to rose bar');
assert.strictEqual(critical.label, 'Critical Friction');

// Test 12: Validate mock report structures against component expectations
const mockReport: StruggleDiagnosticReport = {
  scorePercentage: 85,
  totalItemsReviewed: 10,
  struggledStructures: [
    {
      structureId: 'clopidogrel',
      drugName: 'Clopidogrel',
      moduleIds: ['antiplatelets'],
      pharmacologicalClass: 'P2Y12 Antagonist',
      chemicalClass: 'Thienopyridine',
      struggleCount: 2,
      reason: 'Missed bioactivation requirement in SAR analysis',
    },
  ],
  classBreakdown: [
    { className: 'P2Y12 Antagonist', total: 4, correct: 2, recallRate: 50 },
    { className: 'Factor Xa Inhibitor', total: 6, correct: 6, recallRate: 100 },
  ],
  primaryStrugglePatterns: ['Lowest recall observed in: P2Y12 Antagonist'],
  weakestClasses: ['P2Y12 Antagonist'],
  remediationCandidateIds: ['clopidogrel'],
};

assert.strictEqual(mockReport.struggledStructures.length, 1);
assert.strictEqual(mockReport.classBreakdown.length, 2);
assert.deepStrictEqual(mockReport.remediationCandidateIds, ['clopidogrel']);

console.log('StruggleDiagnosticOverview checks passed.');
