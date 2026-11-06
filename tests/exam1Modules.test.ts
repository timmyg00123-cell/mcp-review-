import assert from 'node:assert/strict';
import { loadAllReviewModules, getModulesForExam } from '../src/utils/moduleStorage';
import { getModuleExamId, getExamDefinition } from '../src/types/examTypes';
import type { ReviewModule, AntiplateletQuestion } from '../src/types/reviewModule';

console.log('Testing Exam 1 Review Modules Scaffolding & Integration...');

// 1. Verify Exam 1 Definition
const exam1Def = getExamDefinition('exam_1');
assert.ok(exam1Def, 'Exam 1 definition must exist');
assert.equal(exam1Def.code, 'Exam 1');
assert.equal(exam1Def.isAvailable, true, 'Exam 1 must be available');
assert.equal(exam1Def.builtInModuleIds.length, 3, 'Exam 1 must have 3 built-in modules');
assert.deepEqual(
  exam1Def.builtInModuleIds,
  ['renal_drugs_mcp2', 'respiratory_bronchodilators_mcp2', 'respiratory_antiinflammatories_mcp2']
);

// 2. Load all modules and filter for Exam 1
const allModules = loadAllReviewModules();
assert.ok(allModules.length >= 12, 'Must load at least 12 built-in modules (3 for Exam 1, 5 for Exam 2, 4 for Exam 3)');

const exam1Modules = getModulesForExam('exam_1', allModules);
assert.equal(exam1Modules.length, 3, 'Must return exactly 3 Exam 1 modules');

const moduleMap = new Map<string, ReviewModule>();
exam1Modules.forEach((m) => moduleMap.set(m.id, m));

// 3. Verify Module 1: Renal Drugs
const renalMod = moduleMap.get('renal_drugs_mcp2');
assert.ok(renalMod, 'Module renal_drugs_mcp2 must exist');
assert.equal(renalMod.examId, 'exam_1');
assert.equal(getModuleExamId(renalMod), 'exam_1');

const renalQuestions: AntiplateletQuestion[] = [];
renalMod.pages.forEach((p) => p.sections.forEach((s) => renalQuestions.push(...s.questions)));
assert.equal(renalQuestions.length, 30, 'Renal module must contain exactly 30 questions');
const renalIds = renalQuestions.map((q) => q.id);
assert.equal(Math.min(...renalIds), 101, 'Renal question IDs must start at 101');
assert.equal(Math.max(...renalIds), 130, 'Renal question IDs must end at 130');
assert.equal(new Set(renalIds).size, 30, 'All 30 Renal question IDs must be unique');

// 4. Verify Module 2: Respiratory Bronchodilators
const bronchoMod = moduleMap.get('respiratory_bronchodilators_mcp2');
assert.ok(bronchoMod, 'Module respiratory_bronchodilators_mcp2 must exist');
assert.equal(bronchoMod.examId, 'exam_1');
assert.equal(getModuleExamId(bronchoMod), 'exam_1');

const bronchoQuestions: AntiplateletQuestion[] = [];
bronchoMod.pages.forEach((p) => p.sections.forEach((s) => bronchoQuestions.push(...s.questions)));
assert.equal(bronchoQuestions.length, 32, 'Bronchodilators module must contain exactly 32 questions');
const bronchoIds = bronchoQuestions.map((q) => q.id);
assert.equal(Math.min(...bronchoIds), 141, 'Bronchodilator question IDs must start at 141');
assert.equal(Math.max(...bronchoIds), 172, 'Bronchodilator question IDs must end at 172');
assert.equal(new Set(bronchoIds).size, 32, 'All 32 Bronchodilator question IDs must be unique');

// 5. Verify Module 3: Respiratory Anti-Inflammatories
const antiinflamMod = moduleMap.get('respiratory_antiinflammatories_mcp2');
assert.ok(antiinflamMod, 'Module respiratory_antiinflammatories_mcp2 must exist');
assert.equal(antiinflamMod.examId, 'exam_1');
assert.equal(getModuleExamId(antiinflamMod), 'exam_1');

const antiinflamQuestions: AntiplateletQuestion[] = [];
antiinflamMod.pages.forEach((p) => p.sections.forEach((s) => antiinflamQuestions.push(...s.questions)));
assert.equal(antiinflamQuestions.length, 34, 'Anti-inflammatories module must contain exactly 34 questions');
const antiinflamIds = antiinflamQuestions.map((q) => q.id);
assert.equal(Math.min(...antiinflamIds), 181, 'Anti-inflammatory question IDs must start at 181');
assert.equal(Math.max(...antiinflamIds), 214, 'Anti-inflammatory question IDs must end at 214');
assert.equal(new Set(antiinflamIds).size, 34, 'All 34 Anti-inflammatory question IDs must be unique');

// 6. Total Curriculum Question Count
const allExam1Questions = [...renalQuestions, ...bronchoQuestions, ...antiinflamQuestions];
assert.equal(allExam1Questions.length, 96, 'Total Exam 1 curriculum questions must be exactly 96 (30 + 32 + 34)');

// 7. Verify High-Yield Question Quality & Explanations
for (const q of allExam1Questions) {
  assert.ok(q.questionStem && q.questionStem.length > 10, `Question ${q.id} must have substantive questionStem`);
  assert.ok(Array.isArray(q.options) && q.options.length >= 4, `Question ${q.id} must have at least 4 options`);
  assert.ok(
    typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < q.options.length,
    `Question ${q.id} must have valid correctIndex`
  );
  assert.ok(q.highYieldPearl && q.highYieldPearl.length > 10, `Question ${q.id} must have highYieldPearl`);
  const hasExplanation = (q.overallExplanation && q.overallExplanation.length > 10) || ((q as any).sarExplanation && (q as any).sarExplanation.length > 10);
  assert.ok(hasExplanation, `Question ${q.id} must have overallExplanation or sarExplanation`);
}

// 8. Verify Chemical Structures across Modules
let totalStructures = 0;
exam1Modules.forEach((m) => {
  if (m.chemicalStructures && Array.isArray(m.chemicalStructures)) {
    totalStructures += m.chemicalStructures.length;
  }
});
assert.ok(totalStructures >= 50, `Exam 1 modules must have at least 50 chemical structure instances attached (found ${totalStructures})`);

console.log('All Exam 1 Modules tests passed successfully!');