import assert from 'node:assert';
import type {
  CumulativeQuestionType,
  PhysiologicalEffectStatement,
  CumulativeQuestion,
  FlashcardState,
  FlashcardItem,
  SpacedRepetitionRating,
  SpacedRepetitionIntervals,
  CandidateSelectionState,
  StruggleItem,
  StruggleDiagnosticReport,
} from '../src/types/cumulativeStudy';
import { SPACED_REPETITION_INTERVALS } from '../src/types/cumulativeStudy';

// 1. PhysiologicalEffectStatement
const sampleStmt: PhysiologicalEffectStatement = {
  id: 'stmt_1',
  statement: 'Prolongs the PR interval by slowing AV nodal conduction',
  isCorrect: true,
  rationale: 'Class II beta-blockers and Class IV calcium channel blockers depress AV nodal Phase 0'
};

// 2. CumulativeQuestion
const sampleQuestion: CumulativeQuestion = {
  id: 'cumul_1',
  type: 'case-to-structures',
  moduleIds: ['antiplatelets', 'anticoagulants'],
  stem: 'A 64-year-old patient requires Factor Xa inhibition...',
  correctStructureIds: ['struct_apixaban', 'struct_rivaroxaban'],
  rationales: { struct_apixaban: 'Direct Factor Xa inhibitor' },
  highYieldPearl: 'Neutral S1 subpocket binding'
};

// 3. FlashcardItem & FlashcardState
const sampleFlashcard: FlashcardItem = {
  structureId: 'struct_1',
  drugName: 'Apixaban',
  moduleIds: ['anticoagulants'],
  structure: {
    id: 'struct_1',
    name: 'Apixaban',
    chemicalClass: 'Pyrazolopyridine derivative',
    pharmacologicalClass: 'Factor Xa inhibitor',
    target: 'Factor Xa',
    reversibility: 'Reversible',
    route: 'Oral',
    keyFunctionalGroups: ['Pyridine', 'Lactam'],
    pkPdHighlights: {
      onset: '3-4 hours',
      duration: '24 hours',
      halfLife: '12 hours',
      elimination: 'Biliary / Fecal (primary), Renal (27%)'
    },
    sarNotes: 'Neutral S1 pocket binding'
  },
  intervalMinutes: 1,
  dueTimestamp: Date.now() + 60000,
  repetitionCount: 1,
  state: 'learning',
  isSuspended: false,
  struggleCount: 0
};

// 4. SpacedRepetitionIntervals and constants
assert.strictEqual(SPACED_REPETITION_INTERVALS.again, 1);
assert.strictEqual(SPACED_REPETITION_INTERVALS.hard, 4);
assert.strictEqual(SPACED_REPETITION_INTERVALS.good, 10);
assert.strictEqual(SPACED_REPETITION_INTERVALS.easy, 1440);

// 5. CandidateSelectionState
const sampleSelection: CandidateSelectionState = {
  id: 'struct_apixaban',
  isSelected: true,
  status: 'correct'
};

// 6. StruggleItem
const sampleStruggleItem: StruggleItem = {
  structureId: 'struct_amiodarone',
  drugName: 'Amiodarone',
  moduleIds: ['antiarrhythmic'],
  pharmacologicalClass: 'Class III Antiarrhythmic',
  struggleCount: 3,
  reason: 'Missed thyroid toxicity and iodine moiety'
};

// 7. StruggleDiagnosticReport
const sampleReport: StruggleDiagnosticReport = {
  scorePercentage: 75,
  totalItemsReviewed: 8,
  struggledStructures: [sampleStruggleItem],
  classBreakdown: [
    {
      className: 'Class III Antiarrhythmic',
      recallRate: 50,
      total: 2,
      correct: 1
    }
  ],
  primaryStrugglePatterns: ['Confusion between Class IA and Class III APD prolongation']
};

assert.strictEqual(sampleQuestion.type, 'case-to-structures');
assert.strictEqual(sampleStmt.isCorrect, true);
assert.strictEqual(sampleFlashcard.state, 'learning');
assert.strictEqual(sampleSelection.isSelected, true);
assert.strictEqual(sampleReport.scorePercentage, 75);
assert.strictEqual(sampleReport.struggledStructures.length, 1);

console.log('Cumulative study types validated.');
