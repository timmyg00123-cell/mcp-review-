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
  assert.ok(catalogKeys.length >= 8, 'Has at least 8 curricular drug profiles');
  
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
