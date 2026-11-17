import assert from 'node:assert';
import {
  CLASS_PROFILES,
  resolveClassProfileForDrug,
  getClassProfileByName,
  getDrugExceptions,
  type TopDrugClassProfile,
} from '../src/data/clinical/classProfiles.js';

console.log('Running Subclass Profiles & Exception Resolvers Tests...');

// 1. CLASS_PROFILES array validation
assert.ok(Array.isArray(CLASS_PROFILES), 'CLASS_PROFILES must be an exported array');
assert.ok(CLASS_PROFILES.length >= 18, `Expected at least 18 landmark profiles, found ${CLASS_PROFILES.length}`);

// Landmark classes expected
const expectedLandmarkClasses = [
  'Statins',
  'ACE Inhibitors',
  'ARBs',
  'Beta-Blockers',
  'CCBs', // Or DHP & Non-DHP CCBs
  'SSRIs',
  'Benzodiazepines',
  'Opioids',
  'NSAIDs',
  'Fluoroquinolones',
  'Penicillins',
  'Cephalosporins',
  'SGLT2 Inhibitors',
  'GLP-1 Agonists',
  'PPIs',
  'Corticosteroids',
  'Thiazides',
  'Loop Diuretics',
];

for (const landmark of expectedLandmarkClasses) {
  const profile = getClassProfileByName(landmark);
  assert.ok(
    profile,
    `getClassProfileByName('${landmark}') must resolve a valid TopDrugClassProfile`
  );
}

// Ensure both DHP and Non-DHP CCB profiles exist
const dhpProfile = getClassProfileByName('Dihydropyridine CCBs');
assert.ok(dhpProfile, 'Dihydropyridine CCBs profile must exist');
const nonDhpProfile = getClassProfileByName('Non-Dihydropyridine CCBs');
assert.ok(nonDhpProfile, 'Non-Dihydropyridine CCBs profile must exist');

// 2. Profile structure integrity
for (const profile of CLASS_PROFILES) {
  assert.ok(typeof profile.className === 'string' && profile.className.length > 0, 'className must be non-empty string');
  assert.ok(typeof profile.therapeuticCategory === 'string' && profile.therapeuticCategory.length > 0, 'therapeuticCategory must be non-empty string');
  assert.ok(typeof profile.universalMoa === 'string' && profile.universalMoa.length > 0, 'universalMoa must be non-empty string');
  assert.ok(Array.isArray(profile.classWideToxicities) && profile.classWideToxicities.length > 0, 'classWideToxicities must be non-empty array');
  assert.ok(Array.isArray(profile.baselineMonitoring) && profile.baselineMonitoring.length > 0, 'baselineMonitoring must be non-empty array');
  assert.ok(Array.isArray(profile.memberDrugNames) && profile.memberDrugNames.length > 0, 'memberDrugNames must be non-empty array');
  assert.ok(typeof profile.exceptionsByDrug === 'object' && profile.exceptionsByDrug !== null, 'exceptionsByDrug must be an object');
  if (profile.classBlackBoxWarnings) {
    assert.ok(Array.isArray(profile.classBlackBoxWarnings), 'classBlackBoxWarnings must be an array if defined');
  }
}

// 3. resolveClassProfileForDrug tests with case-insensitivity & salt handling
const testCases: Array<{ drug: string; expectedClass: string }> = [
  { drug: 'Atorvastatin', expectedClass: 'Statins' },
  { drug: 'atorvastatin calcium', expectedClass: 'Statins' },
  { drug: 'ROSUVASTATIN', expectedClass: 'Statins' },
  { drug: 'Lisinopril', expectedClass: 'ACE Inhibitors' },
  { drug: 'lisinopril dihydrate', expectedClass: 'ACE Inhibitors' },
  { drug: 'Losartan', expectedClass: 'ARBs' },
  { drug: 'losartan potassium', expectedClass: 'ARBs' },
  { drug: 'Metoprolol Tartrate', expectedClass: 'Beta-Blockers' },
  { drug: 'metoprolol succinate', expectedClass: 'Beta-Blockers' },
  { drug: 'Amlodipine', expectedClass: 'CCB' }, // Either CCB or Dihydropyridine CCB
  { drug: 'amlodipine besylate', expectedClass: 'CCB' },
  { drug: 'Diltiazem', expectedClass: 'CCB' },
  { drug: 'Verapamil', expectedClass: 'CCB' },
  { drug: 'Sertraline', expectedClass: 'SSRIs' },
  { drug: 'Lorazepam', expectedClass: 'Benzodiazepines' },
  { drug: 'Oxycodone', expectedClass: 'Opioids' },
  { drug: 'Ibuprofen', expectedClass: 'NSAIDs' },
  { drug: 'Ciprofloxacin', expectedClass: 'Fluoroquinolones' },
  { drug: 'Amoxicillin', expectedClass: 'Penicillins' },
  { drug: 'Cephalexin', expectedClass: 'Cephalosporins' },
  { drug: 'Canagliflozin', expectedClass: 'SGLT2 Inhibitors' },
  { drug: 'Semaglutide', expectedClass: 'GLP-1 Agonists' },
  { drug: 'Omeprazole', expectedClass: 'PPIs' },
  { drug: 'Prednisone', expectedClass: 'Corticosteroids' },
  { drug: 'Hydrochlorothiazide', expectedClass: 'Thiazides' },
  { drug: 'Furosemide', expectedClass: 'Loop Diuretics' },
];

for (const { drug, expectedClass } of testCases) {
  const profile = resolveClassProfileForDrug(drug);
  assert.ok(profile, `resolveClassProfileForDrug('${drug}') should find a profile`);
  if (!profile) continue;
  const profileMatches =
    profile.className.toLowerCase().includes(expectedClass.toLowerCase()) ||
    (expectedClass === 'CCB' && profile.className.toLowerCase().includes('calcium channel'));
  assert.ok(
    profileMatches,
    `Drug '${drug}' should resolve to a class matching '${expectedClass}', got '${profile.className}'`
  );
}

// Non-existent drug
assert.strictEqual(resolveClassProfileForDrug('NonExistentDrug123'), null, 'Unknown drug should resolve to null');

// 4. getDrugExceptions tests
const atorvExceptions = getDrugExceptions('Atorvastatin');
assert.ok(Array.isArray(atorvExceptions) && atorvExceptions.length > 0, 'Atorvastatin must have drug exceptions');

const rosuvExceptions = getDrugExceptions('rosuvastatin calcium');
assert.ok(Array.isArray(rosuvExceptions) && rosuvExceptions.length > 0, 'Rosuvastatin must have drug exceptions');

const metTartrateExceptions = getDrugExceptions('Metoprolol Tartrate');
assert.ok(Array.isArray(metTartrateExceptions) && metTartrateExceptions.length > 0, 'Metoprolol Tartrate must have drug exceptions');

const metSuccinateExceptions = getDrugExceptions('metoprolol succinate');
assert.ok(Array.isArray(metSuccinateExceptions) && metSuccinateExceptions.length > 0, 'Metoprolol Succinate must have drug exceptions');

const celecoxibExceptions = getDrugExceptions('celecoxib');
assert.ok(Array.isArray(celecoxibExceptions) && celecoxibExceptions.length > 0, 'Celecoxib must have drug exceptions');

const furosemideExceptions = getDrugExceptions('furosemide');
assert.ok(Array.isArray(furosemideExceptions) && furosemideExceptions.length > 0, 'Furosemide must have drug exceptions');

// Unknown drug or drug without exceptions returns empty array
const unknownExceptions = getDrugExceptions('TotallyUnknownDrug');
assert.ok(Array.isArray(unknownExceptions) && unknownExceptions.length === 0, 'Unknown drug should return empty array');

console.log('All Subclass Profiles & Exception Resolvers tests passed successfully!');
