import assert from 'node:assert';
import {
  getChemicalClassFromDictionary,
  resolveChemicalClass,
  getChemicalClassByCid,
} from '../src/utils/chemicalClassDictionary';

// Test 1: Module 8 drugs
assert.strictEqual(getChemicalClassFromDictionary('Aspirin'), 'Salicylate (acetylated salicylic acid)');
assert.strictEqual(getChemicalClassFromDictionary('Clopidogrel'), 'Thienopyridine (2nd generation prodrug)');
assert.strictEqual(getChemicalClassFromDictionary('Ticagrelor'), 'Cyclopentyltriazolopyrimidine (CPTP / nucleoside analog)');
assert.strictEqual(getChemicalClassFromDictionary('Cangrelor'), 'ATP analogue (non-thienopyridine nucleotide)');
assert.strictEqual(getChemicalClassFromDictionary('Vorapaxar'), 'Himbacine-derived tricyclic peptidomimetic');

// Test 2: Module 9 drugs
assert.strictEqual(getChemicalClassFromDictionary('Argatroban'), 'Tetrahydroquinoline sulfonamide / L-Arginine peptidomimetic');
assert.strictEqual(getChemicalClassFromDictionary('Dabigatran'), 'Benzimidazole-derived peptidomimetic');
assert.strictEqual(getChemicalClassFromDictionary('Dabigatran etexilate'), 'Benzimidazole double prodrug (carbamate & ester)');
assert.strictEqual(getChemicalClassFromDictionary('Rivaroxaban'), 'Oxazolidinone peptidomimetic');
assert.strictEqual(getChemicalClassFromDictionary('Apixaban'), 'Pyrazolo-tetrahydropyridinone peptidomimetic');
assert.strictEqual(getChemicalClassFromDictionary('Edoxaban'), 'Diamino-cyclohexane peptidomimetic');
assert.strictEqual(getChemicalClassFromDictionary('Betrixaban'), 'Amino-methoxy benzamide peptidomimetic');
assert.strictEqual(getChemicalClassFromDictionary('Fondaparinux'), 'Synthetic sulfated pentasaccharide');
assert.strictEqual(getChemicalClassFromDictionary('Warfarin'), '4-Hydroxycoumarin derivative');
assert.strictEqual(getChemicalClassFromDictionary('Alteplase'), 'Recombinant human tissue plasminogen activator (rh-tPA)');
assert.strictEqual(getChemicalClassFromDictionary('Streptokinase'), 'Bacterial non-enzymatic protein');

// Test 3: Module 10 & 11 drugs
assert.strictEqual(getChemicalClassFromDictionary('Digoxin'), 'Cardiac glycoside (steroidal cardenolide lactone)');
assert.strictEqual(getChemicalClassFromDictionary('Sacubitril'), 'Biphenyl ethyl ester prodrug (neprilysin inhibitor)');
assert.strictEqual(getChemicalClassFromDictionary('Lidocaine'), 'Aminoacyl-2,6-xylidine (xylene amide)');
assert.strictEqual(getChemicalClassFromDictionary('Propafenone'), 'Phenoxy propyloxyamine (aryloxypropanolamine / phenylpropanone)');
assert.strictEqual(getChemicalClassFromDictionary('Flecainide'), 'Fluorinated benzamide piperidine (bis-trifluoroethoxy benzamide)');

// Test 4: resolveChemicalClass with bracketed/prefixed drug names
const mockDrug = { id: 'argatroban_mock', name: 'Drug II (Argatroban)' };
assert.strictEqual(resolveChemicalClass(mockDrug), 'Tetrahydroquinoline sulfonamide / L-Arginine peptidomimetic');

// Test 5: resolveChemicalClass never returns 'N/A' or 'Small molecule compound' for known drugs
const mockRivaroxaban = { id: 'struct_rivaroxaban', name: 'Rivaroxaban' };
assert.notStrictEqual(resolveChemicalClass(mockRivaroxaban), 'N/A');
assert.notStrictEqual(resolveChemicalClass(mockRivaroxaban), 'Small molecule compound');

console.log('Task 1 chemicalClassDictionary tests passed!');
