import assert from 'node:assert/strict';
import {
  EXAM_DEFINITIONS,
  getModuleExamId,
} from '../src/types/examTypes';
import {
  loadAllReviewModules,
  getModulesForExam,
  getBuiltInModule,
} from '../src/utils/moduleStorage';
import { harvestCumulativeFlashcards } from '../src/utils/cumulativeStructureHarvester';
import type { ReviewModule } from '../src/types/reviewModule';

console.log('Testing Exam 1 Review Registration (renal_review_mcp2 & respiratory_review_mcp2)...');

// 1. Check EXAM_DEFINITIONS for exam_1
const exam1Def = EXAM_DEFINITIONS.find((e) => e.id === 'exam_1');
assert.ok(exam1Def, 'exam_1 definition must exist in EXAM_DEFINITIONS');
assert.deepStrictEqual(
  exam1Def.builtInModuleIds,
  ['renal_review_mcp2', 'respiratory_review_mcp2'],
  'exam_1 builtInModuleIds must strictly equal renal_review_mcp2 and respiratory_review_mcp2'
);
assert.strictEqual(
  exam1Def.defaultModuleId,
  'renal_review_mcp2',
  'exam_1 defaultModuleId must equal renal_review_mcp2'
);
assert.strictEqual(
  exam1Def.description,
  'Interactive slide-by-slide reviews for Renal and Respiratory medicinal chemistry.',
  'exam_1 description must match specification'
);

// 2. Check getModuleExamId mapping
const dummyRenalModule: Partial<ReviewModule> = {
  id: 'renal_review_mcp2',
  title: 'Review for Renal Drugs',
};
const dummyRespModule: Partial<ReviewModule> = {
  id: 'respiratory_review_mcp2',
  title: 'Review for Respiratory Drugs',
};

assert.strictEqual(
  getModuleExamId(dummyRenalModule as ReviewModule),
  'exam_1',
  'renal_review_mcp2 must map to exam_1'
);
assert.strictEqual(
  getModuleExamId(dummyRespModule as ReviewModule),
  'exam_1',
  'respiratory_review_mcp2 must map to exam_1'
);

// 3. Check getBuiltInModule
const renalMod = getBuiltInModule('renal_review_mcp2');
assert.ok(renalMod, 'getBuiltInModule("renal_review_mcp2") must return a module');
assert.strictEqual(renalMod.id, 'renal_review_mcp2');
assert.strictEqual(renalMod.pages.length, 3, 'renal_review_mcp2 must have 3 pages');
assert.ok(
  renalMod.chemicalStructures && (renalMod.chemicalStructures.length === 11 || renalMod.chemicalStructures.length === 21),
  `renal_review_mcp2 must have landmark chemical structures (found ${renalMod.chemicalStructures?.length})`
);

const respMod = getBuiltInModule('respiratory_review_mcp2');
assert.ok(respMod, 'getBuiltInModule("respiratory_review_mcp2") must return a module');
assert.strictEqual(respMod.id, 'respiratory_review_mcp2');
assert.strictEqual(respMod.pages.length, 9, 'respiratory_review_mcp2 must have 9 pages');
assert.strictEqual(respMod.chemicalStructures?.length, 41, 'respiratory_review_mcp2 must have 41 structures');

// 4. Check loadAllReviewModules() returns 11 built-in modules
const allBuiltIns = loadAllReviewModules();
assert.strictEqual(
  allBuiltIns.length,
  11,
  `loadAllReviewModules() must return 11 built-in modules (2 Exam 1, 5 Exam 2, 4 Exam 3). Found ${allBuiltIns.length}`
);

// 5. Check getModulesForExam('exam_1') returns exactly 2 modules
const exam1Modules = getModulesForExam('exam_1');
assert.strictEqual(
  exam1Modules.length,
  2,
  `getModulesForExam("exam_1") must return exactly 2 modules. Found ${exam1Modules.length}`
);
assert.deepStrictEqual(
  exam1Modules.map((m) => m.id),
  ['renal_review_mcp2', 'respiratory_review_mcp2'],
  'Exam 1 module IDs must be renal_review_mcp2 and respiratory_review_mcp2'
);

// 6. Check harvestCumulativeFlashcards('exam_1')
const flashcards = harvestCumulativeFlashcards('exam_1');
assert.ok(flashcards.length > 0, 'Exam 1 flashcards deck must not be empty');

const cardDrugNames = flashcards.map((c) => c.drugName.toLowerCase());
const expectedDrugs = ['furosemide', 'tolvaptan', 'epinephrine', 'theophylline', 'montelukast'];
for (const drug of expectedDrugs) {
  assert.ok(
    cardDrugNames.some((name) => name.includes(drug)),
    `Exam 1 flashcard deck must contain ${drug}`
  );
}

console.log('All Exam 1 Review Registration tests passed successfully!');
