import { resolveStructureSafe } from '../src/utils/structureDataUtils';
import { ChemicalStructure } from '../src/types/reviewModule';

const testPool: ChemicalStructure[] = [
  {
    id: 'struct_I',
    name: 'Digoxin',
    cid: 2724385,
    smiles: 'CC1C(C(C(C(O1)OC2C(OC(CC2O)OC3C(OC(CC3O)OC4CCC5(C(C4)CCC6C5CCC7(C6(CCC7C8=CC(=O)OC8)O)C)C)C)C)O)O)O',
    chemicalClass: 'Cardiac Glycoside',
    target: 'Na+/K+-ATPase',
    reversibility: 'Reversible',
  } as unknown as ChemicalStructure,
  {
    id: 'II',
    name: 'Dobutamine',
    cid: 36811,
    smiles: 'CC(CCC1=CC=C(C=C1)O)NCC2=CC=C(C=C2)O',
    chemicalClass: 'Catecholamine derivative',
    target: 'Beta-1 adrenergic receptor',
    reversibility: 'Reversible',
  } as unknown as ChemicalStructure,
];

// Test 1: Resolve by ID
const byId = resolveStructureSafe('struct_I', testPool);
if (byId?.name !== 'Digoxin') throw new Error('Failed to resolve by id');

// Test 2: Resolve by Name (case-insensitive)
const byName = resolveStructureSafe('digoxin', testPool);
if (byName?.id !== 'struct_I') throw new Error('Failed to resolve by name');

// Test 3: Resolve by CID
const byCid = resolveStructureSafe('2724385', testPool);
if (byCid?.name !== 'Digoxin') throw new Error('Failed to resolve by CID');

// Test 4: Resolve Roman numeral ID
const byRoman = resolveStructureSafe('II', testPool);
if (byRoman?.name !== 'Dobutamine') throw new Error('Failed to resolve Roman numeral ID');

console.log('Matrix resolution test PASSED');
