import assert from 'node:assert/strict';
import {
  EXAM_DEFINITIONS,
  loadActiveExamId,
  saveActiveExamId,
  getModuleExamId,
  getExamDefinition,
} from '../src/types/examTypes';
import { loadAllReviewModules, getModulesForExam } from '../src/utils/moduleStorage';
import { harvestCumulativeFlashcards } from '../src/utils/cumulativeStructureHarvester';
import { getCumulativeQuestionBank } from '../src/data/cumulativeQuizData';

console.log('Testing Multi-Exam Scaffolding & Scope Isolation...');

// 1. Verify Exam Definitions
assert.equal(EXAM_DEFINITIONS.length, 3, 'Must define 3 semester exams (Exam 1, Exam 2, Exam 3)');
const exam1 = EXAM_DEFINITIONS.find((e) => e.id === 'exam_1');
const exam2 = EXAM_DEFINITIONS.find((e) => e.id === 'exam_2');
const exam3 = EXAM_DEFINITIONS.find((e) => e.id === 'exam_3');

assert.ok(exam1, 'Exam 1 must exist');
assert.ok(exam2, 'Exam 2 must exist');
assert.ok(exam3, 'Exam 3 must exist');

assert.equal(exam1.code, 'Exam 1');
assert.equal(exam2.code, 'Exam 2');
assert.equal(exam3.code, 'Exam 3');

assert.equal(exam3.isAvailable, true, 'Exam 3 must be available');
assert.equal(exam2.isAvailable, true, 'Exam 2 must be marked available');
assert.equal(exam1.isAvailable, true, 'Exam 1 must be marked available');

// 2. Verify Exam Defaulting & Persistence
const activeExamId = loadActiveExamId();
assert.equal(activeExamId, 'exam_3', 'Active exam must default to exam_3');

const activeDef = getExamDefinition(activeExamId);
assert.equal(activeDef.id, 'exam_3');
assert.equal(activeDef.code, 'Exam 3');

// 3. Verify Module Exam ID mapping
const builtIns = loadAllReviewModules();
assert.equal(builtIns.length, 12, 'Must load all 12 built-in modules (3 for Exam 1, 5 for Exam 2, 4 for Exam 3)');

const exam1Modules = getModulesForExam('exam_1', builtIns);
assert.equal(exam1Modules.length, 3, 'Exam 1 must filter to the 3 built-in Exam 1 modules');
for (const mod of exam1Modules) {
  const modExamId = getModuleExamId(mod);
  assert.equal(modExamId, 'exam_1', `Built-in Exam 1 module ${mod.id} must map to exam_1`);
}

const exam3Modules = getModulesForExam('exam_3', builtIns);
assert.equal(exam3Modules.length, 4, 'Exam 3 must have 4 core cardiovascular modules');
for (const mod of exam3Modules) {
  const modExamId = getModuleExamId(mod);
  assert.equal(modExamId, 'exam_3', `Built-in cardiovascular module ${mod.id} must map to exam_3`);
  assert.equal(mod.code, 'Exam 3', `Built-in module ${mod.id} code must be Exam 3 instead of RAAH`);
}

const exam2Modules = getModulesForExam('exam_2', builtIns);
assert.equal(exam2Modules.length, 5, 'Exam 2 must filter to the 5 built-in Exam 2 modules');
for (const mod of exam2Modules) {
  const modExamId = getModuleExamId(mod);
  assert.equal(modExamId, 'exam_2', `Built-in Exam 2 module ${mod.id} must map to exam_2`);
}

// 5. Verify Scoped Cumulative Flashcards Harvester
const exam1Cards = harvestCumulativeFlashcards('exam_1');
assert.equal(exam1Cards.length, 50, 'Exam 1 must harvest 50 unique landmark flashcards');
assert.ok(
  exam1Cards.every((c) =>
    c.moduleIds.every((mId) =>
      [
        'renal_drugs_mcp2',
        'respiratory_bronchodilators_mcp2',
        'respiratory_antiinflammatories_mcp2',
      ].includes(mId)
    )
  ),
  'Exam 1 cards must only originate from Exam 1 modules'
);

const exam3Cards = harvestCumulativeFlashcards('exam_3');
assert.ok(exam3Cards.length > 0, 'Exam 3 must harvest cards from cardiovascular modules');
assert.ok(
  exam3Cards.every((c) =>
    c.moduleIds.every((mId) =>
      ['antiplatelets_mcp2', 'anticoagulants_mcp2', 'heart_failure_mcp2', 'antiarrhythmics_mcp2'].includes(
        mId
      )
    )
  ),
  'Exam 3 cards must only originate from Exam 3 modules'
);

const exam2Cards = harvestCumulativeFlashcards('exam_2');
assert.ok(exam2Cards.length >= 50, 'Exam 2 must harvest 50+ landmark flashcards');
assert.ok(
  exam2Cards.every((c) =>
    c.moduleIds.every((mId) =>
      [
        'antihypertensives_1_mcp2',
        'antihypertensives_2_mcp2',
        'antihypertensives_3_mcp2',
        'antihypertensives_4_mcp2',
        'antihyperlipidemics_mcp2',
      ].includes(mId)
    )
  ),
  'Exam 2 cards must only originate from Exam 2 modules'
);

// 6. Verify Scoped Cumulative Question Bank
const exam3Questions = getCumulativeQuestionBank('exam_3');
assert.equal(exam3Questions.length, 8, 'Exam 3 must return the 8 high-yield cardiovascular questions');

const exam2Questions = getCumulativeQuestionBank('exam_2');
assert.equal(exam2Questions.length, 16, 'Exam 2 must return the 16 high-yield Exam 2 cumulative questions');

const exam1Questions = getCumulativeQuestionBank('exam_1');
assert.equal(exam1Questions.length, 16, 'Exam 1 question bank must return 16 high-yield clinical deduction questions');

console.log('All Multi-Exam Scaffolding & Isolation tests passed!');
