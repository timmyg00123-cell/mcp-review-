import assert from 'node:assert/strict';
import {
  EXAM_1_STRUCTURES,
  RENAL_STRUCTURES,
  BRONCHODILATOR_STRUCTURES,
  STEROID_AND_LEUKOTRIENE_STRUCTURES,
} from '../src/data/exam1/exam1Structures';
import { resolveClinicalPharmacology } from '../src/utils/clinicalPharmacologyDictionary';

console.log('Testing Exam 1 Chemical Structures & Clinical Pharmacology Profiles...');

// 1. Structure Counts and Dictionaries
assert.ok(Object.keys(EXAM_1_STRUCTURES).length >= 45, 'Must have at least 45 curated Exam 1 structures');
assert.ok(Object.keys(RENAL_STRUCTURES).length >= 12, 'Must have at least 12 renal structures');
assert.ok(Object.keys(BRONCHODILATOR_STRUCTURES).length >= 16, 'Must have at least 16 bronchodilator structures');
assert.ok(Object.keys(STEROID_AND_LEUKOTRIENE_STRUCTURES).length >= 15, 'Must have at least 15 steroid/leukotriene structures');

// 2. Validate landmark chemical structures
const keyStructures = [
  'chlorothiazide',
  'furosemide',
  'acetazolamide',
  'mannitol',
  'conivaptan',
  'tolvaptan',
  'albuterol',
  'levalbuterol',
  'salmeterol',
  'tiotropium',
  'ipratropium',
  'theophylline',
  'roflumilast',
  'ensifentrine',
  'hydrocortisone',
  'prednisone',
  'budesonide',
  'fluticasone_propionate',
  'ciclesonide',
  'montelukast',
  'zileuton',
];

for (const key of keyStructures) {
  const struct = EXAM_1_STRUCTURES[key];
  assert.ok(struct, `Structure "${key}" must exist in EXAM_1_STRUCTURES`);
  assert.ok(struct.cid && struct.cid > 0, `Structure "${key}" must have valid PubChem CID`);
  assert.ok(struct.smiles && struct.smiles.length > 3, `Structure "${key}" must have valid SMILES`);
  assert.ok(struct.target && struct.target.length > 0, `Structure "${key}" must have molecular target`);
  assert.ok(struct.sarNotes && struct.sarNotes.length > 10, `Structure "${key}" must have detailed SAR notes`);
}

// 3. Clinical Pharmacology Dictionary lookups
// 3a. Montelukast (CYP metabolism, crosses BBB, BBW warning, Category B)
const montelukastProfile = resolveClinicalPharmacology({ name: 'Montelukast', tradeName: 'Singulair' });
assert.ok(montelukastProfile.metabolism.includes('CYP'), 'Montelukast must specify CYP metabolism');
assert.ok(montelukastProfile.bbbCnsEffects?.toLowerCase().includes('neuropsychiatric') || montelukastProfile.clinicalPearls?.toLowerCase().includes('neuropsychiatric'), 'Must note neuropsychiatric risk');
assert.equal(montelukastProfile.pregnancyRisk, 'safe');

// 3b. Theophylline (CYP1A2, narrow therapeutic index, crosses BBB)
const theophyllineProfile = resolveClinicalPharmacology({ name: 'Theophylline' });
assert.ok(theophyllineProfile.metabolism.includes('CYP1A2'), 'Theophylline must specify CYP1A2 clearance');
assert.ok(theophyllineProfile.bbbCrossing.toLowerCase().includes('crosses') || theophyllineProfile.bbbCrossing.toLowerCase().includes('cns'), 'Theophylline must cross BBB');

// 3c. Tiotropium (quaternary ammonium, minimal BBB penetration, Category C)
const tiotropiumProfile = resolveClinicalPharmacology({ name: 'Tiotropium', tradeName: 'Spiriva' });
assert.ok(tiotropiumProfile.bbbCrossing.toLowerCase().includes('quaternary') || tiotropiumProfile.bbbCrossing.toLowerCase().includes('does not cross') || tiotropiumProfile.bbbCrossing.toLowerCase().includes('low'), 'Tiotropium must note minimal BBB crossing');

// 3d. Mannitol (not reabsorbed, osmotic gradient, draws water from brain)
const mannitolProfile = resolveClinicalPharmacology({ name: 'Mannitol', tradeName: 'Osmitrol' });
assert.ok(mannitolProfile.bbbCrossing.toLowerCase().includes('intact') || mannitolProfile.bbbCrossing.toLowerCase().includes('icp') || mannitolProfile.bbbCrossing.toLowerCase().includes('osmotic'), 'Mannitol must describe BBB / ICP osmotic effect');

// 3e. Budesonide (preferred ICS in pregnancy, soft steroid acetal hydrolysis in blood)
const budesonideProfile = resolveClinicalPharmacology({ name: 'Budesonide', tradeName: 'Pulmicort' });
assert.equal(budesonideProfile.pregnancyRisk, 'safe');
assert.ok(budesonideProfile.metabolism.toLowerCase().includes('acetal') || budesonideProfile.metabolism.toLowerCase().includes('hydrolysis') || budesonideProfile.metabolism.toLowerCase().includes('cyp3a4'), 'Budesonide must note metabolic inactivation');

console.log('All Exam 1 Chemical Structures & Clinical Pharmacology tests passed successfully!');
