// tests/clinicalPharmacologyDictionary.test.ts
import assert from 'node:assert';
import { resolveClinicalPharmacology } from '../src/utils/clinicalPharmacologyDictionary';
import type { ChemicalStructure } from '../src/types/reviewModule';

console.log('Testing clinicalPharmacologyDictionary...');

// Test 1: Clopidogrel with CYP2C19 bioactivation
const clopidogrel: Partial<ChemicalStructure> = { name: 'Clopidogrel', tradeName: 'Plavix' };
const clopProfile = resolveClinicalPharmacology(clopidogrel);
assert.ok(clopProfile.metabolism.includes('CYP2C19'), 'Clopidogrel must mention CYP2C19 bioactivation');
assert.ok(clopProfile.bbbCrossing, 'Clopidogrel must have bbbCrossing defined');
assert.strictEqual(clopProfile.pregnancyRisk, 'caution', 'Clopidogrel pregnancy risk must be caution');

// Test 2: Warfarin is contraindicated in pregnancy (Category X teratogen)
const warfarin: Partial<ChemicalStructure> = { name: 'Warfarin', tradeName: 'Coumadin' };
const warfProfile = resolveClinicalPharmacology(warfarin);
assert.strictEqual(warfProfile.pregnancyRisk, 'contraindicated', 'Warfarin must be contraindicated in pregnancy');
assert.match(warfProfile.pregnancySummary, /fetal warfarin syndrome|teratogen/i, 'Warfarin summary must warn of teratogenicity');

// Test 3: Heparin / LMWH safe in pregnancy
const enoxaparin: Partial<ChemicalStructure> = { name: 'Enoxaparin', tradeName: 'Lovenox' };
const enoxProfile = resolveClinicalPharmacology(enoxaparin);
assert.strictEqual(enoxProfile.pregnancyRisk, 'safe', 'Enoxaparin must be safe in pregnancy');
assert.match(enoxProfile.pregnancySummary, /does not cross placenta|anticoagulant of choice/i, 'Enoxaparin summary must note placenta-sparing');

// Test 4: Gracefully falls back for unknown custom structures
const custom: Partial<ChemicalStructure> = { name: 'Custom Drug X' };
const customProfile = resolveClinicalPharmacology(custom);
assert.ok(customProfile.metabolism, 'Fallback profile must provide metabolism');
assert.ok(customProfile.pregnancyRisk, 'Fallback profile must provide pregnancyRisk');
assert.ok(customProfile.bbbCrossing, 'Fallback profile must provide bbbCrossing');

console.log('All clinicalPharmacologyDictionary tests passed.');
