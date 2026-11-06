import assert from 'node:assert/strict';
import { getDefaultRespiratoryBronchodilatorsModule, respiratoryBronchodilatorsPages } from '../src/data/exam1/respiratoryBronchodilatorsModuleData';
import { BRONCHODILATOR_STRUCTURES } from '../src/data/exam1/exam1Structures';

console.log('Testing Exam 1 Module 2: Respiratory Bronchodilators & PDE Inhibitors...');

const moduleData = getDefaultRespiratoryBronchodilatorsModule();

// 1. Module metadata
assert.equal(moduleData.id, 'respiratory_bronchodilators_mcp2', 'Module ID must be respiratory_bronchodilators_mcp2');
assert.equal(moduleData.examId, 'exam_1', 'Exam ID must be exam_1');
assert.equal(moduleData.examTitle, 'Exam 1: Renal & Respiratory Medicinal Chemistry');
assert.equal(moduleData.title, 'Respiratory Bronchodilators & PDE Inhibitors');
assert.equal(moduleData.pages.length, 3, 'Must have exactly 3 pages');

// 2. Questions validation
const allQuestions = moduleData.pages.flatMap((p) => p.sections.flatMap((s) => s.questions));
assert.equal(allQuestions.length, 32, 'Module must contain exactly 32 questions');

// Verify Question IDs are 141 to 172 sequentially
for (let i = 0; i < 32; i++) {
  const q = allQuestions[i]!;
  const expectedId = 141 + i;
  assert.equal(q.id, expectedId, `Question ${i} must have ID ${expectedId}`);
  assert.ok((q.questionStem ?? '').length > 20, `Question ${expectedId} stem must be substantial`);
  assert.ok(q.options && q.options.length >= 4, `Question ${expectedId} must have at least 4 options`);
  assert.ok(typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < q.options.length);
  assert.ok(q.highYieldPearl && q.highYieldPearl.length > 10, `Question ${expectedId} must have a high-yield pearl`);
  assert.ok(
    ((q.overallExplanation ?? '').length > 20) ||
    (((q as any).sarExplanation ?? '').length > 20),
    `Question ${expectedId} must have explanation`
  );
}

// 3. Page question distributions
assert.equal(respiratoryBronchodilatorsPages[0]!.sections.flatMap(s => s.questions).length, 11, 'Page 1 must have 11 questions (141-151)');
assert.equal(respiratoryBronchodilatorsPages[1]!.sections.flatMap(s => s.questions).length, 11, 'Page 2 must have 11 questions (152-162)');
assert.equal(respiratoryBronchodilatorsPages[2]!.sections.flatMap(s => s.questions).length, 10, 'Page 3 must have 10 questions (163-172)');

// 4. Content assertions on landmark questions
// Q143: N-alkyl steric hindrance (epinephrine -> isoproterenol -> albuterol)
const q143 = allQuestions.find(q => q.id === 143)!;
assert.ok(q143.questionStem?.includes('alkyl') || q143.overallExplanation?.includes('tert-butyl') || q143.overallExplanation?.includes('isoproterenol'), 'Q143 must cover N-alkyl selectivity');

// Q146: Levalbuterol R-eutomer vs S-distomer
const q146 = allQuestions.find(q => q.id === 146)!;
assert.ok(q146.questionStem?.includes('Levalbuterol') || q146.overallExplanation?.includes('eutomer'), 'Q146 must cover levalbuterol stereochemistry');

// Q148: Salmeterol 11-atom lipophilic exosite tail
const q148 = allQuestions.find(q => q.id === 148)!;
assert.ok(q148.questionStem?.includes('Salmeterol') || q148.overallExplanation?.includes('exosite'), 'Q148 must cover salmeterol exosite binding');

// Q153: Quaternary ammonium permanent charge & zero BBB penetration
const q153 = allQuestions.find(q => q.id === 153)!;
assert.ok(q153.questionStem?.includes('Quaternary') || q153.overallExplanation?.includes('blood-brain'), 'Q153 must cover quaternary ammonium charge');

// Q155: Tiotropium kinetic selectivity
const q155 = allQuestions.find(q => q.id === 155)!;
assert.ok(q155.questionStem?.includes('Tiotropium') || q155.overallExplanation?.includes('thiophene') || q155.overallExplanation?.includes('M3'), 'Q155 must cover tiotropium SAR');

// Q156: Aclidinium soft ester design
const q156 = allQuestions.find(q => q.id === 156)!;
assert.ok(q156.questionStem?.includes('Aclidinium') || q156.overallExplanation?.includes('ester') || q156.overallExplanation?.includes('hydrolysis'), 'Q156 must cover aclidinium soft ester');

// Q163: Theophylline PDE + adenosine antagonism
const q163 = allQuestions.find(q => q.id === 163)!;
assert.ok(q163.questionStem?.includes('Theophylline') || q163.overallExplanation?.includes('adenosine'), 'Q163 must cover theophylline dual mechanism');

// Q165: Theophylline CYP1A2 & smoking/zileuton interactions
const q165 = allQuestions.find(q => q.id === 165)!;
assert.ok(q165.questionStem?.includes('CYP1A2') || q165.overallExplanation?.includes('CYP1A2'), 'Q165 must cover CYP1A2 interactions');

// Q170: Roflumilast N-oxide active metabolite
const q170 = allQuestions.find(q => q.id === 170)!;
assert.ok(q170.questionStem?.includes('Roflumilast') || q170.overallExplanation?.includes('N-oxide'), 'Q170 must cover roflumilast N-oxide');

// Q172: Ensifentrine dual PDE3/4
const q172 = allQuestions.find(q => q.id === 172)!;
assert.ok(q172.questionStem?.includes('Ensifentrine') || q172.overallExplanation?.includes('PDE3'), 'Q172 must cover ensifentrine dual PDE3/4');

// 5. Chemical structures attached
assert.ok(moduleData.chemicalStructures && moduleData.chemicalStructures.length >= 15, 'Must have at least 15 chemical structures attached');

console.log('All Respiratory Bronchodilators Module tests passed successfully!');
