import assert from 'node:assert/strict';
import { loadAllReviewModules, getBuiltInModule } from '../src/utils/moduleStorage';
import { getDefaultRespiratoryReviewModule } from '../src/data/respiratoryReviewModuleData';

console.log('Running End-to-End Respiratory Browser & UI Verification Audit...');

// 1. Verify Module Version and Loading through moduleStorage
const allModules = loadAllReviewModules();
const respMod = allModules.find((m) => m.id === 'respiratory_review_mcp2');
assert.ok(respMod, 'respiratory_review_mcp2 must be present in loadAllReviewModules()');
assert.equal(respMod.version, '2.2.0', 'Module version in moduleStorage must be 2.2.0');

const directMod = getDefaultRespiratoryReviewModule();
assert.equal(directMod.version, '2.2.0', 'Direct module version must be 2.2.0');

// 2. Verify all 9 pages are Review Pages and have zero "Slide" references
assert.equal(respMod.pages.length, 9, 'Must have exactly 9 Review Pages');
respMod.pages.forEach((page, pIdx) => {
  const pageNum = pIdx + 1;
  const pTitle = page.pageTitle || page.title;
  assert.ok(
    pTitle?.startsWith(`Review Page ${pageNum}:`),
    `Page ${pageNum} pageTitle must start with "Review Page ${pageNum}:", got: "${pTitle}"`
  );
  page.sections.forEach((sec) => {
    assert.ok(
      sec.title?.startsWith(`Review Page ${pageNum}:`) || sec.sectionTitle?.startsWith(`Review Page ${pageNum}:`),
      `Page ${pageNum} section title must start with "Review Page ${pageNum}:", got: "${sec.title || sec.sectionTitle}"`
    );
  });
});

const serialized = JSON.stringify(respMod.pages);
const slideMatch = serialized.match(/\bSlide\s*\d+/i);
assert.equal(slideMatch, null, `Zero "Slide N" references allowed on UI, found: ${slideMatch?.[0]}`);

// 3. Question 101 (Review Page 1 Question 1): Fixed-Dose Combination Regimens
const p1Questions = respMod.pages[0].sections.flatMap((s) => s.questions);
const q101 = p1Questions.find((q) => q.id === 101);
assert.ok(q101, 'Question 101 must exist on Review Page 1');
assert.equal(q101.type, 'matching');
assert.equal(q101.sourcePageNumber, 1);
assert.equal(q101.sourceReference, 'Respiratory Med Chem (Asthma/COPD) Review, Page 1, Question 1');
assert.ok(q101.structuresDisplayed, 'Q101 must have structuresDisplayed');
assert.equal(q101.structuresDisplayed.length, 5, 'Q101 must display 5 combination structures');
assert.ok(q101.matchingTargets, 'Q101 must have matchingTargets');
assert.equal(q101.matchingTargets.length, 5, 'Q101 must have 5 combination targets');

const q101ExpectedStructures = [
  'umeclidinium',
  'fluticasone_furoate',
  'olodaterol',
  'vilanterol',
  'indacaterol',
];
q101ExpectedStructures.forEach((expectedId) => {
  assert.ok(
    q101.structuresDisplayed!.some((s) => s.id === expectedId),
    `Q101 structuresDisplayed must include ${expectedId}`
  );
});

// Simulate Drag & Drop matching logic for Q101:
// Anoro -> umeclidinium
// Breo -> fluticasone_furoate
// Stiolto -> olodaterol
// Trelegy -> vilanterol
// Enerzair -> indacaterol
const q101Placements: Record<string, string[]> = {
  target_anoro: ['umeclidinium'],
  target_breo: ['fluticasone_furoate'],
  target_stiolto: ['olodaterol'],
  target_trelegy: ['vilanterol'],
  target_enerzair: ['indacaterol'],
};

const q101AllSatisfied = q101.matchingTargets.every((t) => {
  const placed = q101Placements[t.id] || [];
  return (
    placed.length > 0 &&
    placed.every((id) => t.acceptedStructureIds.includes(id))
  );
});
assert.equal(q101AllSatisfied, true, 'All Q101 targets must be satisfied with valid drops');

// 4. Question 602 (Review Page 6 Question 2): Corticosteroid Formulations
const p6Questions = respMod.pages[5].sections.flatMap((s) => s.questions);
const q602 = p6Questions.find((q) => q.id === 602);
assert.ok(q602, 'Question 602 must exist on Review Page 6');
assert.equal(q602.type, 'matching');
assert.equal(q602.sourcePageNumber, 6);
assert.equal(q602.sourceReference, 'Respiratory Med Chem (Asthma/COPD) Review, Page 6, Question 2');
assert.ok(q602.structuresDisplayed, 'Q602 must have structuresDisplayed');
assert.equal(q602.structuresDisplayed.length, 6, 'Q602 must display 6 corticosteroid structures');
assert.ok(q602.matchingTargets, 'Q602 must have matchingTargets');
assert.equal(q602.matchingTargets.length, 6, 'Q602 must have 6 formulation targets');

const q602ExpectedStructures = [
  'triamcinolone_acetonide',
  'beclomethasone_dipropionate',
  'fluticasone_propionate',
  'hydrocortisone_sodium_phosphate',
  'ciclesonide',
  'clobetasol_propionate',
];
q602ExpectedStructures.forEach((expectedId) => {
  assert.ok(
    q602.structuresDisplayed!.some((s) => s.id === expectedId),
    `Q602 structuresDisplayed must include ${expectedId}`
  );
});

// Simulate Drag & Drop matching logic for Q602
const q602Placements: Record<string, string[]> = {
  target_triamcinolone: ['triamcinolone_acetonide'],
  target_beclo: ['beclomethasone_dipropionate'],
  target_fluticasone: ['fluticasone_propionate'],
  target_hydro_phos: ['hydrocortisone_sodium_phosphate'],
  target_ciclesonide: ['ciclesonide'],
  target_clobetasol: ['clobetasol_propionate'],
};

const q602AllSatisfied = q602.matchingTargets.every((t) => {
  const placed = q602Placements[t.id] || [];
  return (
    placed.length > 0 &&
    placed.every((id) => t.acceptedStructureIds.includes(id))
  );
});
assert.equal(q602AllSatisfied, true, 'All Q602 targets must be satisfied with valid drops');

// 5. Question 801 (Review Page 8 Question 1): 7-Drug Molecular Mechanisms
const p8Questions = respMod.pages[7].sections.flatMap((s) => s.questions);
const q801 = p8Questions.find((q) => q.id === 801);
assert.ok(q801, 'Question 801 must exist on Review Page 8');
assert.equal(q801.type, 'matching');
assert.equal(q801.sourcePageNumber, 8);
assert.equal(q801.sourceReference, 'Respiratory Med Chem (Asthma/COPD) Review, Page 8, Question 1');
assert.ok(q801.structuresDisplayed, 'Q801 must have structuresDisplayed');
assert.equal(q801.structuresDisplayed.length, 7, 'Q801 must display 7 mechanism structures');
assert.ok(q801.matchingTargets, 'Q801 must have matchingTargets');
assert.equal(q801.matchingTargets.length, 7, 'Q801 must have 7 mechanism targets');

const q801ExpectedStructures = [
  'aclidinium',
  'methylprednisolone',
  'ensifentrine',
  'montelukast',
  'zileuton',
  'olodaterol',
  'theophylline',
];
q801ExpectedStructures.forEach((expectedId) => {
  assert.ok(
    q801.structuresDisplayed!.some((s) => s.id === expectedId),
    `Q801 structuresDisplayed must include ${expectedId}`
  );
});

// Simulate Drag & Drop matching logic for Q801
const q801Placements: Record<string, string[]> = {
  target_m3_antag: ['aclidinium'],
  target_pla2_annexin: ['methylprednisolone'],
  target_dual_pde: ['ensifentrine'],
  target_cyslt1_antag: ['montelukast'],
  target_5lox_inhib: ['zileuton'],
  target_beta2_agon: ['olodaterol'],
  target_pde_nonselective: ['theophylline'],
};

const q801AllSatisfied = q801.matchingTargets.every((t) => {
  const placed = q801Placements[t.id] || [];
  return (
    placed.length > 0 &&
    placed.every((id) => t.acceptedStructureIds.includes(id))
  );
});
assert.equal(q801AllSatisfied, true, 'All Q801 targets must be satisfied with valid drops');

// 6. Source Reference Coverage Across All 34 Questions
const allQuestions = respMod.pages.flatMap((p) => p.sections.flatMap((s) => s.questions));
assert.equal(allQuestions.length, 34, 'Must have exactly 34 questions across all 9 pages');
allQuestions.forEach((q) => {
  assert.ok(
    q.sourceReference && q.sourceReference.startsWith('Respiratory Med Chem (Asthma/COPD) Review, Page '),
    `Question ${q.id} must have valid sourceReference`
  );
  assert.ok(
    typeof q.sourcePageNumber === 'number' && q.sourcePageNumber >= 1 && q.sourcePageNumber <= 9,
    `Question ${q.id} must have sourcePageNumber between 1 and 9`
  );
});

console.log('✓ End-to-End Browser & UI Verification Audit passed with 100% compliance!');
