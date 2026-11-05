import { TARGET_POCKET_PROFILES, findTargetPocketForStructure } from '../src/data/targetPocketData';
import { ChemicalStructure } from '../src/types/reviewModule';

console.log('--- Testing 3D Macromolecular Target Pocket Profiles ---');

console.log(`Total target pocket profiles defined: ${TARGET_POCKET_PROFILES.length}`);

// Test Review 10 molecules
const captopril: ChemicalStructure = {
  id: 'I',
  name: 'Captopril',
  chemicalClass: 'Sulfhydryl-containing ACE inhibitor',
  pharmacologicalClass: 'ACE inhibitor',
  target: 'Angiotensin-Converting Enzyme',
  target_receptor: 'ACE Catalytic Zinc Active Site (PDB: 1UZF)',
  reversibility: 'Reversible',
  route: 'Oral',
  keyFunctionalGroups: ['Thiol', 'Proline', 'Carboxylate'],
  pkPdHighlights: { onset: '15-30 min', duration: '6-12h', halfLife: '2h', elimination: 'Renal' },
  sarNotes: 'Thiol chelates catalytic Zn2+'
};

const digoxin: ChemicalStructure = {
  id: 'II',
  name: 'Digoxin',
  chemicalClass: 'Cardiac Glycoside',
  pharmacologicalClass: 'Na+/K+-ATPase inhibitor',
  target: 'Na+/K+-ATPase',
  target_receptor: 'Na+/K+-ATPase Extracellular Alpha Subunit (PDB: 4RET / 4HYT)',
  reversibility: 'Reversible',
  route: 'Oral / IV',
  keyFunctionalGroups: ['Unsaturated butenolide lactone', 'Steroid core', 'Tridigitoxose'],
  pkPdHighlights: { onset: '30-120 min', duration: '3-4 days', halfLife: '36-40h', elimination: 'Renal' },
  sarNotes: 'Steroid cis-trans-cis U-conformation'
};

// Test Review 11 molecules
const lidocaine: ChemicalStructure = {
  id: 'IV',
  name: 'Lidocaine',
  chemicalClass: 'Aminoethylamide',
  pharmacologicalClass: 'Class Ib Antiarrhythmic',
  target: 'Voltage-gated Sodium Channel Nav1.5',
  target_receptor: 'Voltage-gated Sodium Channel Nav1.5 Inner Cavity (PDB: 6LQA)',
  reversibility: 'Reversible',
  route: 'IV',
  keyFunctionalGroups: ['2,6-dimethylphenyl', 'Amide', 'Diethylamino'],
  pkPdHighlights: { onset: 'Immediate', duration: '10-20 min', halfLife: '1.5-2h', elimination: 'Hepatic' },
  sarNotes: '2,6-dimethyl shielding prevents esterase attack'
};

const amiodarone: ChemicalStructure = {
  id: 'V',
  name: 'Amiodarone',
  chemicalClass: 'Diiodobenzofuran',
  pharmacologicalClass: 'Class III Antiarrhythmic',
  target: 'hERG / Kv11.1 Potassium Channel',
  target_receptor: 'Cardiac hERG Potassium Channel Central Cavity (PDB: 5VA1 / 7CN0)',
  reversibility: 'Reversible',
  route: 'Oral / IV',
  keyFunctionalGroups: ['Benzofuran', 'Diiodo substituents', 'Diethylaminoethoxy'],
  pkPdHighlights: { onset: 'Delayed', duration: 'Months', halfLife: '25-110 days', elimination: 'Hepatic / Biliary' },
  sarNotes: 'Iodine atoms wedge into hydrophobic hERG vestibule'
};

// Test Review 8 molecules
const clopidogrel: ChemicalStructure = {
  id: 'VIII',
  name: 'Clopidogrel',
  chemicalClass: 'Thienopyridine prodrug',
  pharmacologicalClass: 'P2Y12 platelet inhibitor',
  target: 'P2Y12 Purinergic Receptor',
  target_receptor: 'P2Y12 Extracellular Cys17 & Cys270 Residues (PDB: 4PXZ)',
  reversibility: 'Irreversible',
  route: 'Oral',
  keyFunctionalGroups: ['Thiophene', 'Methyl ester', 'Tetrahydropyridine'],
  pkPdHighlights: { onset: '2h', duration: '7-10 days', halfLife: '6h', elimination: 'Hepatic' },
  sarNotes: 'Active thiol covalently adducted to Cys17/Cys270'
};

const testCases = [
  { struct: captopril, expectedTargetId: 'ace_peptidase', expectedPdb: '1UZF' },
  { struct: digoxin, expectedTargetId: 'nak_atpase', expectedPdb: '4HYT' },
  { struct: lidocaine, expectedTargetId: 'nav1_5_channel', expectedPdb: '6LQA' },
  { struct: amiodarone, expectedTargetId: 'herg_channel', expectedPdb: '5VA1' },
  { struct: clopidogrel, expectedTargetId: 'p2y12_receptor', expectedPdb: '4PXZ' }
];

let allPassed = true;

for (const tc of testCases) {
  const profile = findTargetPocketForStructure(tc.struct);
  if (!profile) {
    console.error(`FAILED: No profile found for ${tc.struct.name}`);
    allPassed = false;
    continue;
  }

  if (profile.targetId !== tc.expectedTargetId) {
    console.error(`FAILED: ${tc.struct.name} matched targetId ${profile.targetId}, expected ${tc.expectedTargetId}`);
    allPassed = false;
  } else if (profile.pdbId !== tc.expectedPdb) {
    console.error(`FAILED: ${tc.struct.name} matched PDB ${profile.pdbId}, expected ${tc.expectedPdb}`);
    allPassed = false;
  } else {
    console.log(`PASS: ${tc.struct.name} -> Target: ${profile.targetName} | PDB: ${profile.pdbId} | Residues: ${profile.keyResidues.length}`);
  }
}

if (!allPassed) {
  process.exit(1);
}

console.log('ALL TARGET POCKET PROFILE TESTS PASSED!');
