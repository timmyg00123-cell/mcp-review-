import test from 'node:test';
import assert from 'node:assert/strict';
import { getDrugIntelligenceProfile, DRUG_INTELLIGENCE_CATALOG } from '../src/data/drugIntelligenceData';

test('getDrugIntelligenceProfile resolves clopidogrel with complete PK/PD and decision rationale', () => {
  const profile = getDrugIntelligenceProfile('Clopidogrel');
  assert.ok(profile, 'Finds profile for Clopidogrel');
  assert.equal(profile.isProdrug, true, 'Identifies prodrug status');
  assert.ok(profile.prodrugActivation?.includes('CYP2C19'), 'Captures CYP2C19 activation mechanism');
  assert.ok(profile.clinicalDecisionRationale.length > 20, 'Has clinical decision guidance');
  assert.ok(profile.halfLife, 'Has half-life');
  assert.ok(profile.bioavailability, 'Has bioavailability');
  assert.ok(profile.proteinBinding, 'Has protein binding');
  assert.equal(profile.targetGeneSymbol, 'P2RY12');
  assert.equal(profile.pdbId, '4NTJ');
});

test('getDrugIntelligenceProfile handles case-insensitivity and aliases', () => {
  const ticagrelor = getDrugIntelligenceProfile('ticagrelor');
  assert.ok(ticagrelor);
  assert.equal(ticagrelor.isProdrug, false, 'Ticagrelor is an active drug');

  const aspirin = getDrugIntelligenceProfile('ASA');
  assert.ok(aspirin);
  assert.equal(aspirin.targetGeneSymbol, 'PTGS1');
});

test('getDrugIntelligenceProfile returns null safely for unknown drugs, empty inputs, and false positive substrings', () => {
  assert.equal(getDrugIntelligenceProfile('UnknownCompoundX99'), null);
  assert.equal(getDrugIntelligenceProfile('   '), null);
  assert.equal(getDrugIntelligenceProfile('---'), null);
  assert.equal(getDrugIntelligenceProfile('!@#$%'), null);
  assert.equal(getDrugIntelligenceProfile('a'), null);
  assert.equal(getDrugIntelligenceProfile('PR'), null);
  assert.equal(getDrugIntelligenceProfile('Sulfasalazine'), null);
  assert.equal(getDrugIntelligenceProfile('Casas'), null);
});

test('getDrugIntelligenceProfile handles word boundary composite lookup correctly', () => {
  const enalaprilat = getDrugIntelligenceProfile('Enalaprilat (Vasotec IV formulation)');
  assert.ok(enalaprilat);
  assert.equal(enalaprilat.drugName, 'Enalapril');

  const plavix = getDrugIntelligenceProfile('Plavix 75 mg oral tablet');
  assert.ok(plavix);
  assert.equal(plavix.drugName, 'Clopidogrel');
});

test('DRUG_INTELLIGENCE_CATALOG contains rich profiles for major cardiovascular and curricular drugs', () => {
  const catalogKeys = Object.keys(DRUG_INTELLIGENCE_CATALOG);
  assert.ok(catalogKeys.length >= 12, 'Has at least 12 curricular drug profiles');
  
  // Verify mandatory fields across all catalog entries
  for (const [key, profile] of Object.entries(DRUG_INTELLIGENCE_CATALOG)) {
    assert.ok(profile.drugName, `Missing drugName on ${key}`);
    assert.ok(typeof profile.isProdrug === 'boolean', `Missing isProdrug boolean on ${key}`);
    assert.ok(profile.halfLife, `Missing halfLife on ${key}`);
    assert.ok(profile.bioavailability, `Missing bioavailability on ${key}`);
    assert.ok(profile.proteinBinding, `Missing proteinBinding on ${key}`);
    assert.ok(profile.cypMetabolism, `Missing cypMetabolism on ${key}`);
    assert.ok(profile.clearance, `Missing clearance on ${key}`);
    assert.ok(profile.clinicalDecisionRationale, `Missing clinicalDecisionRationale on ${key}`);
    assert.ok(Array.isArray(profile.contraindications), `contraindications must be an array on ${key}`);
  }
});

test('getDrugIntelligenceProfile resolves all 12 core curricular drugs and their aliases', () => {
  const coreCurricularDrugs = [
    'clopidogrel',
    'prasugrel',
    'ticagrelor',
    'aspirin',
    'atorvastatin',
    'rosuvastatin',
    'lisinopril',
    'losartan',
    'amlodipine',
    'hydrochlorothiazide',
    'furosemide',
    'spironolactone',
  ];

  for (const drug of coreCurricularDrugs) {
    const profile = getDrugIntelligenceProfile(drug);
    assert.ok(profile, `Core curricular drug '${drug}' must resolve a profile`);
    assert.ok(profile.clinicalDecisionRationale.length > 20, `Drug '${drug}' must have substantial clinical rationale`);
    assert.ok(profile.targetGeneSymbol, `Drug '${drug}' should have a targetGeneSymbol`);
  }

  // Check aliases for new cardiovascular drugs
  const crestor = getDrugIntelligenceProfile('Crestor');
  assert.equal(crestor?.drugName, 'Rosuvastatin');
  assert.equal(crestor?.pdbId, '1HWK');

  const zestril = getDrugIntelligenceProfile('Zestril');
  assert.equal(zestril?.drugName, 'Lisinopril');
  assert.equal(zestril?.pdbId, '1O86');

  const norvasc = getDrugIntelligenceProfile('Norvasc');
  assert.equal(norvasc?.drugName, 'Amlodipine');
  assert.equal(norvasc?.pdbId, '6JP5');

  const hctz = getDrugIntelligenceProfile('HCTZ');
  assert.equal(hctz?.drugName, 'Hydrochlorothiazide');

  const lasix = getDrugIntelligenceProfile('Lasix');
  assert.equal(lasix?.drugName, 'Furosemide');
  assert.equal(lasix?.pdbId, '7S1C');

  const aldactone = getDrugIntelligenceProfile('Aldactone');
  assert.equal(aldactone?.drugName, 'Spironolactone');
  assert.equal(aldactone?.isProdrug, true);
  assert.equal(aldactone?.pdbId, '2OAX');
});
