import initRDKitModule from '@rdkit/rdkit';
import { getPharmacophoresForStructure } from '../src/utils/pharmacophoreData.js';
import { getCorrectedSmarts } from '../src/utils/smartsDictionary.js';

async function main() {
  const initRDKit = (initRDKitModule as any).default || initRDKitModule;
  const RDKit = await initRDKit();

  const rawStructure = {
    id: 'compound_99999',
    name: 'Compound 99999',
    smiles: 'C1(=C(N=C(C(=N1)Cl)N)N)C(=O)N=C(N)N',
    keyFunctionalGroups: [
      'Pyrazine ring',
      'Guanidinocarbonyl moiety',
      'Primary amino substituents (C3, C5)',
      '6-Chloro electron-withdrawing group'
    ]
  };

  const mol = RDKit.get_mol(rawStructure.smiles);
  const pgroups = getPharmacophoresForStructure(rawStructure as any);

  console.log(`\nEvaluating Uncurated Amiloride Clone with ${pgroups.length} dynamic groups:`);
  for (const p of pgroups) {
    let matched = false;
    let matchJson = '';
    const sm = p.smarts || getCorrectedSmarts(p.name, '');
    if (sm) {
      try {
        const qmol = RDKit.get_qmol(sm);
        if (qmol) {
          matchJson = mol.get_substruct_match(qmol);
          matched = Boolean(matchJson && matchJson !== '{}' && matchJson !== '[]');
          qmol.delete();
        }
      } catch (e: any) {
        console.error('Error with SMARTS:', sm, e);
      }
    }
    console.log(` - Tag: "${p.name}"`);
    console.log(`   SMARTS: "${sm}"`);
    console.log(`   Matched: ${matched} | Atoms: ${matchJson}`);
  }
}

main().catch(console.error);
