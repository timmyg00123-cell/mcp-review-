// tests/struggleDiagnosticService.test.ts
import assert from 'node:assert';
import {
  calculateQuestionScore,
  generateStruggleReport,
} from '../src/utils/struggleDiagnosticService';
import type {
  CumulativeQuestion,
  FlashcardItem,
} from '../src/types/cumulativeStudy';
import type { ChemicalStructure } from '../src/types/reviewModule';

console.log('Testing Partial Credit Scoring & Diagnostic Struggle Analyzer...');

function createMockStructure(
  id: string,
  name: string,
  chemicalClass: string,
  pharmacologicalClass: string,
  target: string = 'Receptor'
): ChemicalStructure {
  return {
    id,
    name,
    chemicalClass,
    pharmacologicalClass,
    target,
    reversibility: 'Reversible',
    route: 'Oral',
    keyFunctionalGroups: ['MockGroup'],
    pkPdHighlights: {
      onset: '1h',
      duration: '12h',
      halfLife: '6h',
      elimination: 'Hepatic',
    },
    sarNotes: 'Mock SAR notes',
  };
}

// ============================================================================
// 1. Partial Credit Scoring: Multi-Select Candidate Structures (Types A, C, D)
// ============================================================================
const clopidogrel = createMockStructure(
  'c1',
  'Clopidogrel',
  'Thienopyridine',
  'P2Y12 antagonist',
  'P2Y12'
);

const prasugrel = createMockStructure(
  'c2',
  'Prasugrel',
  'Thienopyridine',
  'P2Y12 antagonist',
  'P2Y12'
);

const aspirin = createMockStructure(
  'c3',
  'Aspirin',
  'Salicylate',
  'COX-1 inhibitor',
  'COX-1'
);

const q1: CumulativeQuestion = {
  id: 'q1',
  type: 'case-to-structures',
  moduleIds: ['antiplatelets'],
  stem: 'Select all P2Y12 antagonists',
  candidateStructures: [clopidogrel, prasugrel, aspirin],
  correctStructureIds: ['c1', 'c2'],
  rationales: {
    c1: 'Thienopyridine prodrug blocking P2Y12',
    c2: 'Potent thienopyridine prodrug blocking P2Y12',
    c3: 'Irreversible COX-1 inhibitor, not P2Y12 antagonist',
  },
};

// Case 1: Student selects 'c1' and distractor 'c3'
// TP = 1 ('c1'), FP = 1 ('c3'), FN = 1 ('c2'). Total True = 2.
// Score = max(0, Math.round(((1 - 1) / 2) * 100)) = 0%.
const res1 = calculateQuestionScore(q1, ['c1', 'c3']);
assert.strictEqual(res1.scorePercentage, 0, 'Score must be 0% when TP equals FP');
assert.deepStrictEqual(res1.truePositives, ['c1'], 'True positives should be [c1]');
assert.deepStrictEqual(res1.falsePositives, ['c3'], 'False positives should be [c3]');
assert.deepStrictEqual(res1.falseNegatives, ['c2'], 'False negatives should be [c2]');

// Case 2: Student selects only 'c1'
// TP = 1 ('c1'), FP = 0, FN = 1 ('c2'). Total True = 2.
// Score = Math.round(((1 - 0) / 2) * 100) = 50%.
const res2 = calculateQuestionScore(q1, ['c1']);
assert.strictEqual(res2.scorePercentage, 50, 'Score must be 50% for 1 out of 2 targets');
assert.deepStrictEqual(res2.truePositives, ['c1']);
assert.deepStrictEqual(res2.falsePositives, []);
assert.deepStrictEqual(res2.falseNegatives, ['c2']);

// Case 3: Perfect selection: Student selects 'c1' and 'c2'
// TP = 2, FP = 0, FN = 0. Total True = 2.
// Score = 100%.
const res3 = calculateQuestionScore(q1, ['c1', 'c2']);
assert.strictEqual(res3.scorePercentage, 100, 'Score must be 100% for perfect selection');
assert.deepStrictEqual(res3.truePositives, ['c1', 'c2']);
assert.deepStrictEqual(res3.falsePositives, []);
assert.deepStrictEqual(res3.falseNegatives, []);

// Case 4: Selection with only distractor 'c3'
// TP = 0, FP = 1, FN = 2. Total True = 2.
// Score = max(0, -50%) = 0%.
const res4 = calculateQuestionScore(q1, ['c3']);
assert.strictEqual(res4.scorePercentage, 0, 'Score cannot be negative; must clamp to 0');
assert.deepStrictEqual(res4.truePositives, []);
assert.deepStrictEqual(res4.falsePositives, ['c3']);
assert.deepStrictEqual(res4.falseNegatives, ['c1', 'c2']);

// Case 5: Empty selection
const res5 = calculateQuestionScore(q1, []);
assert.strictEqual(res5.scorePercentage, 0, 'Empty selection must score 0%');
assert.deepStrictEqual(res5.falseNegatives, ['c1', 'c2']);

// Case 6: Rounding verification (2 out of 3 correct with 0 FP -> 67%)
const qThreeTargets: CumulativeQuestion = {
  id: 'q_three',
  type: 'comparative-sar',
  moduleIds: ['anticoagulants'],
  stem: 'Select all direct oral anticoagulants',
  candidateStructures: [
    { id: 't1', name: 'Apixaban' } as any,
    { id: 't2', name: 'Rivaroxaban' } as any,
    { id: 't3', name: 'Dabigatran' } as any,
    { id: 'd1', name: 'Warfarin' } as any,
  ],
  correctStructureIds: ['t1', 't2', 't3'],
  rationales: {},
};
const res6 = calculateQuestionScore(qThreeTargets, ['t1', 't2']);
assert.strictEqual(res6.scorePercentage, 67, '2 of 3 targets must round to 67%');

// ============================================================================
// 2. Partial Credit Scoring: Type B (Structure to Physiological Effects)
// ============================================================================
const amiodarone = createMockStructure(
  'amiodarone',
  'Amiodarone',
  'Benzofuran derivative',
  'Class III Antiarrhythmic',
  'IKr potassium channel'
);

const qTypeB: CumulativeQuestion = {
  id: 'q_type_b',
  type: 'structure-to-effects',
  moduleIds: ['antiarrhythmics'],
  stem: 'Select all physiological effects of the blinded structure',
  singleStructure: amiodarone,
  effectStatements: [
    {
      id: 'stmt_1',
      statement: 'Prolongs APD and ERP via delayed rectifier K+ blockade',
      isCorrect: true,
      rationale: 'Hallmark Class III effect',
    },
    {
      id: 'stmt_2',
      statement: 'Inhibits thyroid deiodinases due to diiodophenyl moiety',
      isCorrect: true,
      rationale: 'Contains elemental iodine causing thyroid toxicity',
    },
    {
      id: 'stmt_3',
      statement: 'Rapidly cleared via renal filtration with 2 hour half-life',
      isCorrect: false,
      rationale: 'False: Amiodarone has 50-day half-life and hepatic elimination',
    },
  ],
  rationales: {},
};

// Type B: Student selects stmt_1 and distractor stmt_3
// TP = 1 (stmt_1), FP = 1 (stmt_3), FN = 1 (stmt_2). Total True = 2.
// Score = 0%.
const resTypeB1 = calculateQuestionScore(qTypeB, ['stmt_1', 'stmt_3']);
assert.strictEqual(resTypeB1.scorePercentage, 0);
assert.deepStrictEqual(resTypeB1.truePositives, ['stmt_1']);
assert.deepStrictEqual(resTypeB1.falsePositives, ['stmt_3']);
assert.deepStrictEqual(resTypeB1.falseNegatives, ['stmt_2']);

// Type B: Student selects only stmt_1
// TP = 1, FP = 0, FN = 1. Total True = 2 -> 50%.
const resTypeB2 = calculateQuestionScore(qTypeB, ['stmt_1']);
assert.strictEqual(resTypeB2.scorePercentage, 50);

// Type B: Perfect selection
const resTypeB3 = calculateQuestionScore(qTypeB, ['stmt_1', 'stmt_2']);
assert.strictEqual(resTypeB3.scorePercentage, 100);

console.log('Partial credit scoring tests passed.');

// ============================================================================
// 3. Struggle Diagnostic Report: Practice Test Sessions
// ============================================================================
const apixaban = createMockStructure(
  'c4',
  'Apixaban',
  'Pyrazolopyridine derivative',
  'Factor Xa inhibitor',
  'Factor Xa'
);

const dabigatran = createMockStructure(
  'c5',
  'Dabigatran',
  'Benzamidine derivative',
  'Direct thrombin inhibitor',
  'Factor IIa'
);

const q2: CumulativeQuestion = {
  id: 'q2',
  type: 'case-to-structures',
  moduleIds: ['anticoagulants'],
  stem: 'Select the direct Factor Xa inhibitor',
  candidateStructures: [apixaban, dabigatran],
  correctStructureIds: ['c4'],
  rationales: {},
};

// Session with 2 questions:
// q1: Selected ['c1', 'c3'] -> Score: 0% (Missed c2, erroneously selected c3)
// q2: Selected ['c4'] -> Score: 100% (Correctly selected c4, rejected c5)
const reportPractice = generateStruggleReport({
  sessionType: 'practice-test',
  questionResults: [
    { question: q1, selectedIds: ['c1', 'c3'] },
    { question: q2, selectedIds: ['c4'] },
  ],
});

assert.strictEqual(reportPractice.totalItemsReviewed, 2, 'Total items reviewed must be 2');
assert.strictEqual(reportPractice.scorePercentage, 50, 'Overall score must be average (0 + 100) / 2 = 50%');

// Struggled structures should identify false negative 'c2' (Prasugrel) and false positive 'c3' (Aspirin)
assert.strictEqual(reportPractice.struggledStructures.length, 2, 'Must have 2 struggled structures');
const struggledIds = reportPractice.struggledStructures.map((s) => s.structureId);
assert.ok(struggledIds.includes('c2'), 'Must flag omitted Prasugrel (c2)');
assert.ok(struggledIds.includes('c3'), 'Must flag distractor Aspirin (c3)');

// Remediation candidate IDs should gather unique structure IDs for 1-click drill
assert.ok(reportPractice.remediationCandidateIds?.includes('c2'), 'Must include c2 in remediation candidates');
assert.ok(reportPractice.remediationCandidateIds?.includes('c3'), 'Must include c3 in remediation candidates');
assert.strictEqual(
  new Set(reportPractice.remediationCandidateIds).size,
  reportPractice.remediationCandidateIds?.length,
  'Remediation candidates must not have duplicates'
);

// Class breakdown recall rate
// P2Y12 antagonist: 2 candidates presented (c1 correct, c2 missed) -> 50%
// COX-1 inhibitor: 1 candidate presented (c3 false positive) -> 0%
// Factor Xa inhibitor: 1 candidate presented (c4 true positive) -> 100%
// Direct thrombin inhibitor: 1 candidate presented (c5 true negative) -> 100%
const classMap = new Map(reportPractice.classBreakdown.map((b) => [b.className, b]));
assert.strictEqual(classMap.get('P2Y12 antagonist')?.recallRate, 50);
assert.strictEqual(classMap.get('COX-1 inhibitor')?.recallRate, 0);
assert.strictEqual(classMap.get('Factor Xa inhibitor')?.recallRate, 100);

// Weakest classes should highlight classes with recall < 100%
assert.ok(Array.isArray(reportPractice.weakestClasses), 'weakestClasses must be an array');
assert.ok(reportPractice.weakestClasses.includes('COX-1 inhibitor'), 'Must include COX-1 inhibitor in weakest classes');
assert.ok(reportPractice.weakestClasses.includes('P2Y12 antagonist'), 'Must include P2Y12 antagonist in weakest classes');

// Primary struggle patterns summary box
assert.ok(Array.isArray(reportPractice.primaryStrugglePatterns));
assert.ok(reportPractice.primaryStrugglePatterns.length > 0, 'Must provide struggle pattern summaries');

// ============================================================================
// 4. Struggle Diagnostic Report: Type B Struggle Attribution
// ============================================================================
const reportTypeB = generateStruggleReport({
  sessionType: 'practice-test',
  questionResults: [{ question: qTypeB, selectedIds: ['stmt_1', 'stmt_3'] }],
});

assert.strictEqual(reportTypeB.struggledStructures.length, 1);
assert.strictEqual(reportTypeB.struggledStructures[0].structureId, 'amiodarone');
assert.strictEqual(reportTypeB.struggledStructures[0].drugName, 'Amiodarone');
assert.ok(reportTypeB.remediationCandidateIds?.includes('amiodarone'));

// ============================================================================
// 5. Struggle Diagnostic Report: Flashcard Spaced Repetition Sessions
// ============================================================================
const furosemide = createMockStructure(
  'furosemide',
  'Furosemide',
  'Anthranilic acid sulfonamide',
  'Loop Diuretic',
  'NKCC2'
);

const digoxin = createMockStructure(
  'digoxin',
  'Digoxin',
  'Cardiac glycoside',
  'Na+/K+ ATPase inhibitor',
  'Na+/K+ ATPase'
);

const flashcard1: FlashcardItem = {
  structureId: 'struct_furosemide',
  drugName: 'Furosemide',
  moduleIds: ['heart_failure'],
  structure: furosemide,
  intervalMinutes: 1440,
  dueTimestamp: Date.now() + 86400000,
  repetitionCount: 2,
  state: 'mastered',
  isSuspended: false,
  struggleCount: 0,
};

const flashcard2: FlashcardItem = {
  structureId: 'struct_amiodarone',
  drugName: 'Amiodarone',
  moduleIds: ['antiarrhythmics'],
  structure: amiodarone,
  intervalMinutes: 1,
  dueTimestamp: Date.now() + 60000,
  repetitionCount: 3,
  state: 'learning',
  isSuspended: false,
  struggleCount: 2,
};

const flashcard3: FlashcardItem = {
  structureId: 'struct_digoxin',
  drugName: 'Digoxin',
  moduleIds: ['heart_failure'],
  structure: digoxin,
  intervalMinutes: 4,
  dueTimestamp: Date.now() + 240000,
  repetitionCount: 2,
  state: 'learning',
  isSuspended: false,
  struggleCount: 1,
};

const reportFlashcards = generateStruggleReport({
  sessionType: 'flashcards',
  flashcardHistory: [flashcard1, flashcard2, flashcard3],
});

assert.strictEqual(reportFlashcards.totalItemsReviewed, 3, '3 flashcards reviewed');
// 1 card struggle-free (furosemide), 2 cards struggled (amiodarone, digoxin)
// Score = 1 / 3 = 33%
assert.strictEqual(reportFlashcards.scorePercentage, 33, 'Flashcard score must be 33%');

assert.strictEqual(reportFlashcards.struggledStructures.length, 2, '2 cards had struggleCount > 0');
const flashcardStruggleIds = reportFlashcards.struggledStructures.map((s) => s.structureId);
assert.ok(flashcardStruggleIds.includes('struct_amiodarone'));
assert.ok(flashcardStruggleIds.includes('struct_digoxin'));

assert.ok(reportFlashcards.remediationCandidateIds?.includes('struct_amiodarone'));
assert.ok(reportFlashcards.remediationCandidateIds?.includes('struct_digoxin'));
assert.ok(!reportFlashcards.remediationCandidateIds?.includes('struct_furosemide'));

// Weakest classes
assert.ok(reportFlashcards.weakestClasses?.includes('Class III Antiarrhythmic'));
assert.ok(reportFlashcards.weakestClasses?.includes('Na+/K+ ATPase inhibitor'));

// ============================================================================
// 6. Signature Overload Support & Empty Session Guards
// ============================================================================
// Positional arguments call style from task brief
const reportPositional = generateStruggleReport(
  [{ question: q1, selectedIds: ['c1', 'c2'] }],
  []
);
assert.strictEqual(reportPositional.scorePercentage, 100);
assert.strictEqual(reportPositional.struggledStructures.length, 0);

// Empty call guard
const reportEmpty = generateStruggleReport();
assert.strictEqual(reportEmpty.totalItemsReviewed, 0);
assert.strictEqual(reportEmpty.scorePercentage, 0);
assert.deepStrictEqual(reportEmpty.struggledStructures, []);
assert.deepStrictEqual(reportEmpty.classBreakdown, []);

console.log('All struggle diagnostic service tests passed successfully.');
