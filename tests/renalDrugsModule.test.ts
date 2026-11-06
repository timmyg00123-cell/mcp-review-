import assert from 'node:assert/strict';
import { getDefaultRenalDrugsModule, renalDrugsPages } from '../src/data/exam1/renalDrugsModuleData';
import { RENAL_STRUCTURES } from '../src/data/exam1/exam1Structures';

console.log('Testing Exam 1 Module 1: Renal Drugs (Diuretics, Vaptans & Potassium Binders)...');

const moduleData = getDefaultRenalDrugsModule();

// 1. Module metadata
assert.equal(moduleData.id, 'renal_drugs_mcp2', 'Module ID must be renal_drugs_mcp2');
assert.equal(moduleData.examId, 'exam_1', 'Exam ID must be exam_1');
assert.equal(moduleData.examTitle, 'Exam 1: Renal & Respiratory Medicinal Chemistry');
assert.equal(moduleData.title, 'Renal Drugs: Diuretics, Vaptans & Potassium Binders');
assert.equal(moduleData.pages.length, 3, 'Must have exactly 3 pages');

// 2. Questions validation
const allQuestions = moduleData.pages.flatMap((p) => p.sections.flatMap((s) => s.questions));
assert.equal(allQuestions.length, 30, 'Module must contain exactly 30 questions');

// Verify Question IDs are 101 to 130 sequentially
for (let i = 0; i < 30; i++) {
  const expectedId = 101 + i;
  assert.equal(allQuestions[i].id, expectedId, `Question ${i} must have ID ${expectedId}`);
  assert.ok(allQuestions[i].questionStem.length > 20, `Question ${expectedId} stem must be substantial`);
  assert.ok(allQuestions[i].options.length >= 4, `Question ${expectedId} must have at least 4 options`);
  assert.ok(allQuestions[i].correctIndex >= 0 && allQuestions[i].correctIndex < allQuestions[i].options.length);
  assert.ok(allQuestions[i].highYieldPearl && allQuestions[i].highYieldPearl.length > 10, `Question ${expectedId} must have a high-yield pearl`);
  assert.ok(
    (allQuestions[i].overallExplanation && allQuestions[i].overallExplanation.length > 20) ||
    ((allQuestions[i] as any).sarExplanation && (allQuestions[i] as any).sarExplanation.length > 20),
    `Question ${expectedId} must have explanation`
  );
}

// 3. Page question distributions
assert.equal(renalDrugsPages[0].sections.flatMap(s => s.questions).length, 10, 'Page 1 must have 10 questions (101-110)');
assert.equal(renalDrugsPages[1].sections.flatMap(s => s.questions).length, 10, 'Page 2 must have 10 questions (111-120)');
assert.equal(renalDrugsPages[2].sections.flatMap(s => s.questions).length, 10, 'Page 3 must have 10 questions (121-130)');

// 4. Content assertions on landmark questions
// Q101: Thiazides DCT NCC
const q101 = allQuestions.find(q => q.id === 101)!;
assert.ok(q101.questionStem.includes('NCC') || q101.overallExplanation.includes('NCC'), 'Q101 must discuss NCC');

// Q107: Furosemide furfuryl & pKa
const q107 = allQuestions.find(q => q.id === 107)!;
assert.ok(q107.questionStem.includes('Furosemide') || q107.overallExplanation.includes('furfuryl'), 'Q107 must cover furosemide SAR');

// Q110: Ethacrynic acid non-sulfa & Michael acceptor
const q110 = allQuestions.find(q => q.id === 110)!;
assert.ok(q110.questionStem.includes('Ethacrynic') || q110.overallExplanation.includes('sulfa'), 'Q110 must cover ethacrynic acid');

// Q114: Eplerenone 9,11-epoxide
const q114 = allQuestions.find(q => q.id === 114)!;
assert.ok(q114.questionStem.includes('Eplerenone') || q114.overallExplanation.includes('epoxide'), 'Q114 must cover eplerenone SAR');

// Q116: Acetazolamide Zn2+ coordination
const q116 = allQuestions.find(q => q.id === 116)!;
assert.ok(q116.questionStem.includes('Acetazolamide') || q116.overallExplanation.includes('Zn'), 'Q116 must cover Zn2+ coordination');

// Q122: Desmopressin V2 selectivity
const q122 = allQuestions.find(q => q.id === 122)!;
assert.ok(q122.questionStem.includes('Desmopressin') || q122.overallExplanation.includes('V2'), 'Q122 must cover desmopressin V2 selectivity');

// Q126: Tolvaptan V2 selectivity and liver/demyelination warnings
const q126 = allQuestions.find(q => q.id === 126)!;
assert.ok(q126.questionStem.includes('Tolvaptan') || q126.overallExplanation.includes('Tolvaptan'), 'Q126 must cover tolvaptan');

// Q130: Sodium zirconium cyclosilicate (Lokelma)
const q130 = allQuestions.find(q => q.id === 130)!;
assert.ok(q130.questionStem.includes('Lokelma') || q130.questionStem.includes('zirconium') || q130.overallExplanation.includes('zirconium'), 'Q130 must cover Lokelma');

// 5. Chemical structures attached
assert.ok(moduleData.chemicalStructures && moduleData.chemicalStructures.length >= 15, 'Must have at least 15 chemical structures attached');

console.log('All Renal Drugs Module tests passed successfully!');
