import assert from 'node:assert/strict';
import {
  getDefaultDiureticsModule,
  getDefaultSympatholyticsModule,
  getDefaultVasodilatorsModule,
  getDefaultRaasModule,
  getDefaultAntihyperlipidemicsModule,
  EXAM_2_STRUCTURES,
  DIURETICS_STRUCTURES,
  SYMPATHOLYTICS_STRUCTURES,
  VASODILATORS_STRUCTURES,
  RAAS_STRUCTURES,
  LIPIDS_STRUCTURES,
} from '../src/data/exam2';
import { CUMULATIVE_QUESTIONS_EXAM_2 } from '../src/data/exam2/exam2CumulativeQuizData';
import { getCumulativeQuestionBank } from '../src/data/cumulativeQuizData';
import { resolveClinicalPharmacology } from '../src/utils/clinicalPharmacologyDictionary';
import { loadAllReviewModules, getModulesForExam } from '../src/utils/moduleStorage';

console.log('Testing Exam 2 Curriculum Modules & Cumulative Practice Suite...');

// 1. Module 1: Diuretics
const diuretics = getDefaultDiureticsModule();
assert.equal(diuretics.id, 'antihypertensives_1_mcp2');
assert.equal(diuretics.examId, 'exam_2');
assert.equal(diuretics.pages.length, 3);
const dQuestions = diuretics.pages.flatMap((p) => p.sections.flatMap((s) => s.questions));
assert.equal(dQuestions.length, 33, 'Diuretics module must have 33 questions (IDs 301–333)');
assert.equal(dQuestions[0].id, 301);
assert.equal(dQuestions[32].id, 333);
assert.ok(diuretics.chemicalStructures && diuretics.chemicalStructures.length >= 18);

// 2. Module 2: Sympatholytics
const sympatholytics = getDefaultSympatholyticsModule();
assert.equal(sympatholytics.id, 'antihypertensives_2_mcp2');
assert.equal(sympatholytics.examId, 'exam_2');
assert.equal(sympatholytics.pages.length, 3);
const sQuestions = sympatholytics.pages.flatMap((p) => p.sections.flatMap((s) => s.questions));
assert.equal(sQuestions.length, 43, 'Sympatholytics module must have 43 questions (IDs 401–443)');
assert.equal(sQuestions[0].id, 401);
assert.equal(sQuestions[42].id, 443);
assert.ok(sympatholytics.chemicalStructures && sympatholytics.chemicalStructures.length >= 18);

// 3. Module 3: Vasodilators & CCBs
const vasodilators = getDefaultVasodilatorsModule();
assert.equal(vasodilators.id, 'antihypertensives_3_mcp2');
assert.equal(vasodilators.examId, 'exam_2');
assert.equal(vasodilators.pages.length, 3);
const vQuestions = vasodilators.pages.flatMap((p) => p.sections.flatMap((s) => s.questions));
assert.equal(vQuestions.length, 25, 'Vasodilators module must have 25 questions (IDs 501–525)');
assert.equal(vQuestions[0].id, 501);
assert.equal(vQuestions[24].id, 525);
assert.ok(vasodilators.chemicalStructures && vasodilators.chemicalStructures.length >= 14);

// 4. Module 4: RAAS Modifiers
const raas = getDefaultRaasModule();
assert.equal(raas.id, 'antihypertensives_4_mcp2');
assert.equal(raas.examId, 'exam_2');
assert.equal(raas.pages.length, 3);
const rQuestions = raas.pages.flatMap((p) => p.sections.flatMap((s) => s.questions));
assert.equal(rQuestions.length, 26, 'RAAS module must have 26 questions (IDs 601–626)');
assert.equal(rQuestions[0].id, 601);
assert.equal(rQuestions[25].id, 626);
assert.ok(raas.chemicalStructures && raas.chemicalStructures.length >= 18);

// 5. Module 5: Antihyperlipidemics
const lipids = getDefaultAntihyperlipidemicsModule();
assert.equal(lipids.id, 'antihyperlipidemics_mcp2');
assert.equal(lipids.examId, 'exam_2');
assert.equal(lipids.pages.length, 3);
const lQuestions = lipids.pages.flatMap((p) => p.sections.flatMap((s) => s.questions));
assert.equal(lQuestions.length, 35, 'Antihyperlipidemics module must have 35 questions (IDs 701–735)');
assert.equal(lQuestions[0].id, 701);
assert.equal(lQuestions[34].id, 735);
assert.ok(lipids.chemicalStructures && lipids.chemicalStructures.length >= 16);

// Total Question Count Verification
const totalExam2Questions =
  dQuestions.length + sQuestions.length + vQuestions.length + rQuestions.length + lQuestions.length;
assert.equal(totalExam2Questions, 162, 'Exam 2 curriculum must contain exactly 162 questions');

// Verify question quality (non-empty stem, explanations, high-yield pearls)
for (const q of [...dQuestions, ...sQuestions, ...vQuestions, ...rQuestions, ...lQuestions]) {
  assert.ok(q.id > 0, `Question ID must be positive: ${q.id}`);
  assert.ok(q.questionStem && q.questionStem.length > 10, `Question ${q.id} stem must be substantial`);
  assert.ok(q.overallExplanation && q.overallExplanation.length > 10, `Question ${q.id} must have overall explanation`);
  assert.ok(q.highYieldPearl && q.highYieldPearl.length > 10, `Question ${q.id} must have high-yield pearl`);
}

// 6. Chemical Structures Verification
assert.ok(Object.keys(EXAM_2_STRUCTURES).length >= 84, 'Must have at least 84 chemical structures');
assert.ok(Object.keys(DIURETICS_STRUCTURES).length >= 18);
assert.ok(Object.keys(SYMPATHOLYTICS_STRUCTURES).length >= 18);
assert.ok(Object.keys(VASODILATORS_STRUCTURES).length >= 14);
assert.ok(Object.keys(RAAS_STRUCTURES).length >= 18);
assert.ok(Object.keys(LIPIDS_STRUCTURES).length >= 16);

// Check landmark structures properties
const sampleStructures = ['hydrochlorothiazide', 'furosemide', 'propranolol', 'amlodipine', 'lisinopril', 'atorvastatin'];
for (const key of sampleStructures) {
  const struct = EXAM_2_STRUCTURES[key];
  assert.ok(struct, `Structure ${key} must exist`);
  assert.ok(struct.cid && struct.cid > 0, `Structure ${key} must have valid PubChem CID`);
  assert.ok(struct.smiles && struct.smiles.length > 5, `Structure ${key} must have SMILES`);
  assert.ok(struct.target && struct.target.length > 0, `Structure ${key} must have target`);
  assert.ok(struct.sarNotes && struct.sarNotes.length > 10, `Structure ${key} must have SAR notes`);
}

// 7. Clinical Pharmacology Dictionary Verification for Exam 2
const lisinoprilProfile = resolveClinicalPharmacology({ name: 'lisinopril' });
assert.ok(lisinoprilProfile, 'Lisinopril clinical profile must exist');
assert.equal(lisinoprilProfile.pregnancyRisk, 'contraindicated');
assert.ok(lisinoprilProfile.pregnancyCategory?.includes('Black Box Warning') || lisinoprilProfile.pregnancySummary.includes('Contraindicated'));

const atorvastatinProfile = resolveClinicalPharmacology({ name: 'atorvastatin' });
assert.ok(atorvastatinProfile, 'Atorvastatin clinical profile must exist');
assert.equal(atorvastatinProfile.pregnancyRisk, 'contraindicated');
assert.ok(atorvastatinProfile.pregnancyCategory?.includes('X'));

const methyldopaProfile = resolveClinicalPharmacology({ name: 'methyldopa' });
assert.ok(methyldopaProfile, 'Methyldopa clinical profile must exist');
assert.equal(methyldopaProfile.pregnancyRisk, 'safe');
assert.ok(methyldopaProfile.bbbCrossing.includes('LAT1') || methyldopaProfile.bbbCrossing.includes('BBB'));

// 8. Cumulative Question Bank Scoping
const exam2Bank = getCumulativeQuestionBank('exam_2');
assert.equal(exam2Bank.length, 16, 'Exam 2 cumulative question bank must have 16 curated questions');
assert.deepEqual(exam2Bank, CUMULATIVE_QUESTIONS_EXAM_2);

// Check question types
const types = new Set(exam2Bank.map((q) => q.type));
assert.ok(types.has('case-to-structures'), 'Must include case-to-structures');
assert.ok(types.has('structure-to-effects'), 'Must include structure-to-effects');
assert.ok(types.has('comparative-sar'), 'Must include comparative-sar');
assert.ok(types.has('contraindication-risk'), 'Must include contraindication-risk');

// 9. Module Storage Integration
const allModules = loadAllReviewModules();
const exam2InStorage = getModulesForExam('exam_2', allModules);
assert.equal(exam2InStorage.length, 5, 'Storage must return 5 Exam 2 modules');

const exam3InStorage = getModulesForExam('exam_3', allModules);
assert.equal(exam3InStorage.length, 4, 'Storage must preserve all 4 Exam 3 modules without regression');

console.log('All Exam 2 Curriculum & Cumulative Practice tests passed successfully!');
