import assert from 'node:assert/strict';
import { loadAllReviewModules, getModulesForExam } from '../src/utils/moduleStorage';
import { getModuleExamId, getExamDefinition } from '../src/types/examTypes';
import type { ReviewModule } from '../src/types/reviewModule';

console.log('Testing Exam 1 Review Modules Scaffolding & Integration...');

// 1. Verify Exam 1 Definition
const exam1Def = getExamDefinition('exam_1');
assert.ok(exam1Def, 'Exam 1 definition must exist');
assert.equal(exam1Def.code, 'Exam 1');
assert.equal(exam1Def.isAvailable, true, 'Exam 1 must be available');
assert.equal(exam1Def.builtInModuleIds.length, 2, 'Exam 1 must have 2 built-in modules');
assert.deepEqual(
  exam1Def.builtInModuleIds,
  ['renal_review_mcp2', 'respiratory_review_mcp2']
);

// 2. Load all modules and filter for Exam 1
const allModules = loadAllReviewModules();
assert.ok(allModules.length >= 11, 'Must load at least 11 built-in modules (2 for Exam 1, 5 for Exam 2, 4 for Exam 3)');

const exam1Modules = getModulesForExam('exam_1', allModules);
assert.equal(exam1Modules.length, 2, 'Must return exactly 2 Exam 1 modules');

const moduleMap = new Map<string, ReviewModule>();
exam1Modules.forEach((m) => moduleMap.set(m.id, m));

// 3. Verify Module 1: Renal Review
const renalMod = moduleMap.get('renal_review_mcp2');
assert.ok(renalMod, 'Module renal_review_mcp2 must exist');
assert.equal(renalMod.examId, 'exam_1');
assert.equal(getModuleExamId(renalMod), 'exam_1');
assert.equal(renalMod.pages.length, 3, 'Renal review module must have 3 pages');

const renalQuestions = renalMod.pages.flatMap((p) => p.sections.flatMap((s) => s.questions));
assert.equal(renalQuestions.length, 19, 'Renal review module must contain 19 questions');

// 4. Verify Module 2: Respiratory Review
const respMod = moduleMap.get('respiratory_review_mcp2');
assert.ok(respMod, 'Module respiratory_review_mcp2 must exist');
assert.equal(respMod.examId, 'exam_1');
assert.equal(getModuleExamId(respMod), 'exam_1');
assert.equal(respMod.pages.length, 9, 'Respiratory review module must have 9 pages');

const respQuestions = respMod.pages.flatMap((p) => p.sections.flatMap((s) => s.questions));
assert.equal(respQuestions.length, 34, 'Respiratory review module must contain 34 questions');

// 5. Total Curriculum Question Count
const allExam1Questions = [...renalQuestions, ...respQuestions];
assert.equal(allExam1Questions.length, 53, 'Total Exam 1 curriculum questions must be exactly 53 (19 + 34)');

// 6. Verify High-Yield Question Quality & Explanations
for (const q of allExam1Questions) {
  const stem = q.questionStem || q.prompt || (q as any).rankingPrompt || (q as any).matchingPrompt || q.title;
  assert.ok(stem && stem.length > 5, `Question ${q.id} must have substantive prompt, stem, or title`);
}

// 7. Verify Chemical Structures across Modules
let totalStructures = 0;
exam1Modules.forEach((m) => {
  if (m.chemicalStructures && Array.isArray(m.chemicalStructures)) {
    totalStructures += m.chemicalStructures.length;
  }
});
assert.ok(totalStructures >= 50, `Exam 1 modules must have at least 50 chemical structure instances attached (found ${totalStructures})`);

console.log('All Exam 1 Modules tests passed successfully!');
