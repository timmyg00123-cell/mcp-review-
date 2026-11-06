import assert from 'node:assert/strict';
import { getDefaultRespiratoryAntiinflammatoriesModule, respiratoryAntiinflammatoriesPages } from '../src/data/exam1/respiratoryAntiinflammatoriesModuleData';
import { STEROID_AND_LEUKOTRIENE_STRUCTURES } from '../src/data/exam1/exam1Structures';

console.log('Testing Exam 1 Module 3: Respiratory Anti-Inflammatories (Steroids & Leukotrienes)...');

const moduleData = getDefaultRespiratoryAntiinflammatoriesModule();

// 1. Module metadata
assert.equal(moduleData.id, 'respiratory_antiinflammatories_mcp2', 'Module ID must be respiratory_antiinflammatories_mcp2');
assert.equal(moduleData.examId, 'exam_1', 'Exam ID must be exam_1');
assert.equal(moduleData.examTitle, 'Exam 1: Renal & Respiratory Medicinal Chemistry');
assert.equal(moduleData.title, 'Respiratory Anti-Inflammatories: Steroids & Leukotrienes');
assert.equal(moduleData.pages.length, 3, 'Must have exactly 3 pages');

// 2. Questions validation
const allQuestions = moduleData.pages.flatMap((p) => p.sections.flatMap((s) => s.questions));
assert.equal(allQuestions.length, 34, 'Module must contain exactly 34 questions');

// Verify Question IDs are 181 to 214 sequentially
for (let i = 0; i < 34; i++) {
  const expectedId = 181 + i;
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
assert.equal(respiratoryAntiinflammatoriesPages[0].sections.flatMap(s => s.questions).length, 11, 'Page 1 must have 11 questions (181-191)');
assert.equal(respiratoryAntiinflammatoriesPages[1].sections.flatMap(s => s.questions).length, 11, 'Page 2 must have 11 questions (192-202)');
assert.equal(respiratoryAntiinflammatoriesPages[2].sections.flatMap(s => s.questions).length, 12, 'Page 3 must have 12 questions (203-214)');

// 4. Content assertions on landmark questions
// Q183: 11beta-OH strict requirement & cortisone/prednisone 11beta-HSD1 prodrugs
const q183 = allQuestions.find(q => q.id === 183)!;
assert.ok(q183.questionStem.includes('11') || q183.overallExplanation.includes('11beta-HSD1'), 'Q183 must cover 11beta-OH and 11beta-HSD1');

// Q186: Eliminating mineralocorticoid activity at C16
const q186 = allQuestions.find(q => q.id === 186)!;
assert.ok(q186.questionStem.includes('16') || q186.overallExplanation.includes('mineralocorticoid'), 'Q186 must cover C16 modifications');

// Q189: C21-esters for water solubility (Solu-Medrol, Solu-Cortef)
const q189 = allQuestions.find(q => q.id === 189)!;
assert.ok(q189.questionStem.includes('succinate') || q189.questionStem.includes('solubil') || q189.overallExplanation.includes('succinate'), 'Q189 must cover water-soluble C21 hemiesters');

// Q193: Ciclesonide pro-soft-drug
const q193 = allQuestions.find(q => q.id === 193)!;
assert.ok(q193.questionStem.includes('Ciclesonide') || q193.overallExplanation.includes('des-ciclesonide'), 'Q193 must cover ciclesonide soft drug');

// Q194: Budesonide lipid conjugation depot & pregnancy safety
const q194 = allQuestions.find(q => q.id === 194)!;
assert.ok(q194.questionStem.includes('Budesonide') || q194.overallExplanation.includes('fatty acid') || q194.overallExplanation.includes('lipid'), 'Q194 must cover budesonide lipid depot');

// Q195: Fluticasone propionate S-fluoromethyl carbothioate
const q195 = allQuestions.find(q => q.id === 195)!;
assert.ok(q195.questionStem.includes('Fluticasone') || q195.overallExplanation.includes('carbothioate'), 'Q195 must cover fluticasone carbothioate');

// Q200: CYP3A4 inhibitors & steroid accumulation (ritonavir)
const q200 = allQuestions.find(q => q.id === 200)!;
assert.ok(q200.questionStem.includes('CYP3A4') || q200.overallExplanation.includes('ritonavir'), 'Q200 must cover CYP3A4 steroid interaction');

// Q206: Zileuton 5-LOX iron chelation
const q206 = allQuestions.find(q => q.id === 206)!;
assert.ok(q206.questionStem.includes('Zileuton') || q206.overallExplanation.includes('iron') || q206.overallExplanation.includes('hydroxyurea'), 'Q206 must cover zileuton iron chelation');

// Q210: Montelukast Boxed Warning
const q210 = allQuestions.find(q => q.id === 210)!;
assert.ok(q210.questionStem.includes('Montelukast') || q210.overallExplanation.includes('neuropsychiatric'), 'Q210 must cover montelukast boxed warning');

// Q212: Samter's triad (AERD)
const q212 = allQuestions.find(q => q.id === 212)!;
assert.ok(q212.questionStem.includes('Aspirin') || q212.questionStem.includes('AERD') || q212.overallExplanation.includes('PGE2'), 'Q212 must cover AERD / Samter\'s triad');

// 5. Chemical structures attached
assert.ok(moduleData.chemicalStructures && moduleData.chemicalStructures.length >= 15, 'Must have at least 15 chemical structures attached');

console.log('All Respiratory Anti-Inflammatories Module tests passed successfully!');
