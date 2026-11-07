import assert from 'node:assert/strict';
import {
  getDefaultRenalReviewModule,
  getRenalReviewPages,
  AMILORIDE_STRUCTURE,
  FUROSEMIDE_STRUCTURE,
  HYDROCHLOROTHIAZIDE_STRUCTURE,
  ACETAZOLAMIDE_STRUCTURE,
  MANNITOL_STRUCTURE,
  ISOSORBIDE_STRUCTURE,
  TOLVAPTAN_STRUCTURE,
  VASOPRESSIN_STRUCTURE,
  DESMOPRESSIN_STRUCTURE,
  OXYTOCIN_STRUCTURE,
} from '../src/data/renalReviewModuleData';

console.log('Testing Renal Review Module (renalReviewModuleData.ts)...');

// 1. Module Definition & Metadata
const mod = getDefaultRenalReviewModule();
assert.equal(mod.id, 'renal_review_mcp2', 'Module ID must be renal_review_mcp2');
assert.equal(mod.title, 'Review for Renal Drugs', 'Title must be Review for Renal Drugs');
assert.equal(
  mod.subtitle,
  'Diuretic Classes, Nephron Sites of Action, Acid/Base, Sulfa Allergies & Osmotic PK',
  'Subtitle must match specification'
);
assert.equal(mod.course, 'Medicinal Chemistry (MCP II)', 'Course must be Medicinal Chemistry (MCP II)');
assert.equal(mod.semester, 'Fall 2026', 'Semester must be Fall 2026');
assert.equal(mod.code, 'Exam 1', 'Code must be Exam 1');
assert.equal(mod.examId, 'exam_1', 'Exam ID must be exam_1');
assert.equal(mod.examTitle, 'Exam 1: Renal & Respiratory Medicinal Chemistry');
assert.equal(mod.isBuiltIn, true, 'isBuiltIn must be true');

// 2. Pages structure
const pages = getRenalReviewPages();
assert.equal(pages.length, 3, 'Module must have exactly 3 pages matching the 3 slides of the PDF');
assert.equal(mod.pages.length, 3, 'getDefaultRenalReviewModule() pages must match getRenalReviewPages()');

// 3. Landmark Chemical Structures Audits
const landmarkStructures = [
  AMILORIDE_STRUCTURE,
  FUROSEMIDE_STRUCTURE,
  HYDROCHLOROTHIAZIDE_STRUCTURE,
  ACETAZOLAMIDE_STRUCTURE,
  MANNITOL_STRUCTURE,
  ISOSORBIDE_STRUCTURE,
  TOLVAPTAN_STRUCTURE,
  VASOPRESSIN_STRUCTURE,
  DESMOPRESSIN_STRUCTURE,
  OXYTOCIN_STRUCTURE,
];

landmarkStructures.forEach((struct) => {
  assert.ok(struct.id, `Structure must have id: ${struct.name}`);
  assert.ok(struct.name, 'Structure must have name');
  assert.ok(struct.chemicalClass, `Structure ${struct.name} must have chemicalClass`);
  assert.ok(struct.pharmacologicalClass, `Structure ${struct.name} must have pharmacologicalClass`);
  assert.ok(struct.smiles || struct.canonical_smiles, `Structure ${struct.name} must have SMILES`);
  assert.ok(struct.mw && struct.mw > 0, `Structure ${struct.name} must have molecular weight`);
  assert.ok(struct.sarNotes && struct.sarNotes.length > 20, `Structure ${struct.name} must have detailed sarNotes`);
  assert.ok(struct.keyFunctionalGroups && struct.keyFunctionalGroups.length >= 2, `Structure ${struct.name} must have functional groups`);
});

// Specific chemical assertions
assert.equal(AMILORIDE_STRUCTURE.chemicalClass, 'Pyrazinopyrimidine derivative');
assert.ok(AMILORIDE_STRUCTURE.keyFunctionalGroups.some((g) => g.toLowerCase().includes('guanidino') || g.toLowerCase().includes('guanidine')));
assert.equal(FUROSEMIDE_STRUCTURE.chemicalClass, 'Sulfamoyl anthranilic acid');
assert.ok(HYDROCHLOROTHIAZIDE_STRUCTURE.chemicalClass.includes('Benzothiadiazine'));
assert.ok(ACETAZOLAMIDE_STRUCTURE.chemicalClass.includes('Thiadiazole'));
assert.equal(MANNITOL_STRUCTURE.chemicalClass, 'Aliphatic polyalcohol (Sugar alcohol)');
assert.ok(TOLVAPTAN_STRUCTURE.pharmacologicalClass.includes('V2'));

// 4. Page 1 (Slide 1): Q1 - Q14
const page1 = pages[0]!;
assert.equal(page1.pageNumber, 1, 'Page 1 must be pageNumber 1');
const p1Questions = page1.sections.flatMap((s) => s.questions);
assert.equal(p1Questions.length, 14, 'Page 1 must contain exactly 14 questions (Q1 to Q14)');

// Q1: Matching chemical class
const q1 = p1Questions.find((q) => q.id === 1)!;
assert.equal(q1.type, 'matching', 'Q1 must be matching type');
assert.ok(q1.matchingTargets && q1.matchingTargets.length >= 5, 'Q1 must have matching targets for 5 chemical classes');
const q1Accepted = q1.matchingTargets!.flatMap((t) => t.acceptedStructureIds);
assert.ok(q1Accepted.includes('amiloride') || q1Accepted.includes('I'), 'Q1 must accept amiloride/I');
assert.ok(q1Accepted.includes('furosemide') || q1Accepted.includes('II'), 'Q1 must accept furosemide/II');
assert.ok(q1Accepted.includes('hydrochlorothiazide') || q1Accepted.includes('III'), 'Q1 must accept hydrochlorothiazide/III');
assert.ok(q1Accepted.includes('acetazolamide') || q1Accepted.includes('IV'), 'Q1 must accept acetazolamide/IV');
assert.ok(q1Accepted.includes('mannitol') || q1Accepted.includes('V'), 'Q1 must accept mannitol/V');

// Q2: Acid/base classification
const q2 = p1Questions.find((q) => q.id === 2)!;
assert.ok(q2.type === 'matching' || q2.type === 'sub-statements', 'Q2 must be matching or sub-statements');

// Q3: Mechanistic class
const q3 = p1Questions.find((q) => q.id === 3)!;
assert.equal(q3.type, 'matching', 'Q3 must be matching');

// Q4: Site of action
const q4 = p1Questions.find((q) => q.id === 4)!;
assert.equal(q4.type, 'matching', 'Q4 must be matching');

// Q5 - Q11: High-yield sub-statements / rationales
const q5 = p1Questions.find((q) => q.id === 5)!; // Fastest acting (Furosemide / pKa 3.9)
assert.ok(q5.prompt?.includes('fast') || q5.questionStem?.includes('fast'));

const q6 = p1Questions.find((q) => q.id === 6)!; // Most effective (Furosemide / High-ceiling)
assert.ok(q6.prompt?.includes('most effective') || q6.questionStem?.includes('most effective'));

const q7 = p1Questions.find((q) => q.id === 7)!; // Least effective (Acetazolamide / Amiloride)
assert.ok(q7.prompt?.includes('least effective') || q7.questionStem?.includes('least effective'));

const q8 = p1Questions.find((q) => q.id === 8)!; // Antihypertensive (HCTZ)
assert.ok(q8.prompt?.includes('antihypertensive') || q8.questionStem?.includes('antihypertensive'));

const q9 = p1Questions.find((q) => q.id === 9)!; // Glaucoma (Acetazolamide)
assert.ok(q9.prompt?.includes('glaucoma') || q9.questionStem?.includes('glaucoma'));

const q10 = p1Questions.find((q) => q.id === 10)!; // Pure enzyme inhibition (Acetazolamide)
assert.ok(q10.prompt?.includes('enzyme inhibition') || q10.questionStem?.includes('enzyme inhibition'));

const q11 = p1Questions.find((q) => q.id === 11)!; // Sulfa allergy cross-reactivity
assert.ok(q11.prompt?.includes('sulfa') || q11.questionStem?.includes('sulfa'));

// Q12 - Q14: Osmotic diuretics
const q12 = p1Questions.find((q) => q.id === 12)!; // Structure I vs II osmotic
const q13 = p1Questions.find((q) => q.id === 13)!; // Site of action osmotic
const q14 = p1Questions.find((q) => q.id === 14)!; // PK lack of tubular reabsorption
assert.ok(q14.options?.some((opt) => opt.toLowerCase().includes('lack of renal tubular reabsorption')));

// 5. Page 2 (Slide 2): Q15 - Q18
const page2 = pages[1]!;
assert.equal(page2.pageNumber, 2, 'Page 2 must be pageNumber 2');
const p2Questions = page2.sections.flatMap((s) => s.questions);
assert.equal(p2Questions.length, 4, 'Page 2 must contain exactly 4 questions (Q15 to Q18)');

const q15 = p2Questions.find((q) => q.id === 15)!; // Non-diuretic molecule
assert.ok(
  q15.prompt?.toLowerCase().includes('not a diuretic') ||
    q15.questionStem?.toLowerCase().includes('not a diuretic')
);

const q16 = p2Questions.find((q) => q.id === 16)!; // Osmotic diuretic
assert.ok(
  q16.prompt?.toLowerCase().includes('osmotic') ||
    q16.questionStem?.toLowerCase().includes('osmotic')
);

const q17 = p2Questions.find((q) => q.id === 17)!; // Carbonic anhydrase inhibitor
assert.ok(
  q17.prompt?.toLowerCase().includes('carbonic anhydrase') ||
    q17.questionStem?.toLowerCase().includes('carbonic anhydrase')
);

const q18 = p2Questions.find((q) => q.id === 18)!; // Compare 3 peptides
assert.equal(q18.type, 'sub-statements', 'Q18 must be sub-statements for comparing peptides');
assert.ok(q18.subStatements && q18.subStatements.length >= 4, 'Q18 must have at least 4 comparative sub-statements');

// 6. Page 3 (Slide 3): Q19
const page3 = pages[2]!;
assert.equal(page3.pageNumber, 3, 'Page 3 must be pageNumber 3');
const p3Questions = page3.sections.flatMap((s) => s.questions);
assert.ok(p3Questions.length >= 1, 'Page 3 must contain Q19');

const q19 = p3Questions.find((q) => q.id === 19)!;
assert.ok(q19.matchingTargets && q19.matchingTargets.length >= 4, 'Q19 must have nephron region matching targets');
assert.ok(q19.subStatements && q19.subStatements.length >= 2, 'Q19 must include efficacy ranking sub-statements');

// 7. Rigorous Sub-statements Validation across entire module
const allQuestions = pages.flatMap((p) => p.sections.flatMap((s) => s.questions));
const subStatementQuestions = allQuestions.filter((q) => q.type === 'sub-statements' || (q.subStatements && q.subStatements.length > 0));

assert.ok(subStatementQuestions.length >= 6, 'Must have at least 6 questions with sub-statements');

subStatementQuestions.forEach((q) => {
  assert.ok(q.subStatements && q.subStatements.length > 0, `Question ${q.id} must have subStatements array`);
  q.subStatements.forEach((stmt) => {
    const text = stmt.text || stmt.statement;
    assert.ok(text && text.trim().length >= 10, `Question ${q.id} statement ${stmt.id} text must be substantial`);
    assert.equal(typeof stmt.isCorrect, 'boolean', `Question ${q.id} statement ${stmt.id} isCorrect must be boolean`);
    const expl = stmt.explanation || stmt.rationale;
    assert.ok(expl && expl.trim().length >= 15, `Question ${q.id} statement ${stmt.id} explanation must be detailed`);
  });
});

console.log('All Renal Review Module tests passed successfully!');
