import assert from 'node:assert';
import fs from 'node:fs';
import { getChemicalClass, resolveChemicalClass } from '../src/utils/structureDataUtils';

// Test 1: structureDataUtils getChemicalClass uses dictionary when property is missing
const bareDabigatran = { name: 'Dabigatran' };
assert.strictEqual(getChemicalClass(bareDabigatran), 'Benzimidazole-derived peptidomimetic');

// Test 2: structureDataUtils getChemicalClass uses dictionary for Apixaban
const bareApixaban = { name: 'Apixaban' };
assert.strictEqual(getChemicalClass(bareApixaban), 'Pyrazolo-tetrahydropyridinone peptidomimetic');

// Test 3: Generic 'Small molecule compound' or 'N/A' is overridden by dictionary
const contaminatedDrug = { name: 'Warfarin', chemicalClass: 'Small molecule compound' };
assert.strictEqual(getChemicalClass(contaminatedDrug), '4-Hydroxycoumarin derivative');

// Test 4: StructureComparator imports and delegates to resolveChemicalClass from chemicalClassDictionary
const comparatorCode = fs.readFileSync('src/components/StructureComparator.tsx', 'utf8');
assert(
  comparatorCode.includes("from '../utils/chemicalClassDictionary'") ||
  comparatorCode.includes('from "../utils/chemicalClassDictionary"'),
  'StructureComparator must import from chemicalClassDictionary'
);

// Test 5: ChemicalStructureCard uses resolveChemicalClass
const cardCode = fs.readFileSync('src/components/ChemicalStructureCard.tsx', 'utf8');
assert(
  cardCode.includes('resolveChemicalClass'),
  'ChemicalStructureCard must use resolveChemicalClass'
);

// Test 6: MedChemMatrix uses resolveChemicalClass
const matrixCode = fs.readFileSync('src/components/MedChemMatrix.tsx', 'utf8');
assert(
  matrixCode.includes('resolveChemicalClass'),
  'MedChemMatrix must use resolveChemicalClass'
);

console.log('Task 2 chemicalClassIntegration tests passed!');
