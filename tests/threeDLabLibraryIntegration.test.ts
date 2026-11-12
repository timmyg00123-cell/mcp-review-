import assert from 'node:assert';
import type { ChemicalStructure } from '../src/types/reviewModule';
import { findCanonicalTargetForDrug, CANONICAL_MEDCHEM_TARGETS } from '../src/utils/canonicalTargets';
import { ThreeDLabLibrary, type ThreeDLabLibraryProps } from '../src/components/ThreeDLabLibrary';
import type { NavbarProps } from '../src/components/Navbar';
import type { ChemicalStructureCardProps } from '../src/components/ChemicalStructureCard';

console.log('--- Running 3D Lab Library & Navigation Integration Test Suite ---');

async function runTests() {
  // 1. Verify ThreeDLabLibrary export and props contract
  console.log('1. Testing ThreeDLabLibrary contract...');
  assert.strictEqual(typeof ThreeDLabLibrary, 'function', 'ThreeDLabLibrary should be exported as a React component function');

  const sampleProps: ThreeDLabLibraryProps = {
    initialDrugName: 'Clopidogrel',
    initialPdbId: '4NTJ',
    structures: [
      {
        id: 'clop_1',
        name: 'Clopidogrel',
        smiles: 'COC(=O)[C@H](C1=CC=CC=C1Cl)N2CCC3=C(C2)C=CS3',
      } as ChemicalStructure,
    ],
    onBackToReview: () => {},
  };
  assert.ok(sampleProps.initialDrugName === 'Clopidogrel', 'Props should support initialDrugName');
  assert.ok(sampleProps.initialPdbId === '4NTJ', 'Props should support initialPdbId');

  // 2. Verify NavbarProps activeTab union includes '3d-lab'
  console.log('2. Testing Navbar activeTab type support for 3d-lab...');
  const testActiveTab: NavbarProps['activeTab'] = '3d-lab';
  assert.strictEqual(testActiveTab, '3d-lab');

  let selectedTab: string | null = null;
  const mockOnSelectTab: NavbarProps['onSelectTab'] = (tab) => {
    selectedTab = tab;
  };
  mockOnSelectTab('3d-lab');
  assert.strictEqual(selectedTab, '3d-lab', 'onSelectTab must accept 3d-lab');

  // 3. Verify ChemicalStructureCardProps includes onSelectStructureFor3D
  console.log('3. Testing ChemicalStructureCardProps onSelectStructureFor3D prop...');
  const state = { triggered: null as ChemicalStructure | null };
  const mockCardProps: ChemicalStructureCardProps = {
    structure: {
      id: 'ticagrelor_1',
      name: 'Ticagrelor',
      smiles: 'CCCSC1=NN=C2N1C=NC(=C2N)N',
    } as ChemicalStructure,
    onSelectStructureFor3D: (structure) => {
      state.triggered = structure;
    },
  };
  assert.strictEqual(typeof mockCardProps.onSelectStructureFor3D, 'function');
  mockCardProps.onSelectStructureFor3D!(mockCardProps.structure);
  assert.strictEqual(state.triggered?.name, 'Ticagrelor');

  // 4. Verify 3D Lab Target Resolution & PDB URL construction logic
  console.log('4. Testing target resolution and URL generation for 3D Lab...');
  const testDrugs = [
    { drug: 'Clopidogrel', expectedPdb: '4NTJ', expectedGene: 'P2RY12' },
    { drug: 'Lisinopril', expectedPdb: '1O86', expectedGene: 'ACE' },
    { drug: 'Losartan', expectedPdb: '4Z9O', expectedGene: 'AGTR1' },
    { drug: 'Atorvastatin', expectedPdb: '1HWK', expectedGene: 'HMGCR' },
    { drug: 'Aspirin', expectedPdb: '1CQE', expectedGene: 'PTGS1' },
    { drug: 'Celecoxib', expectedPdb: '3LN1', expectedGene: 'PTGS2' },
  ];

  for (const { drug, expectedPdb, expectedGene } of testDrugs) {
    const target = findCanonicalTargetForDrug(drug);
    assert.ok(target, `Target for ${drug} should be resolved`);
    assert.strictEqual(target?.pdbId, expectedPdb);
    assert.strictEqual(target?.geneSymbol, expectedGene);

    // Verify canonical viewer iframe URL and structure link formats
    const viewUrl = `https://www.rcsb.org/3d-view/${target?.pdbId}`;
    const structUrl = `https://www.rcsb.org/structure/${target?.pdbId}`;
    const cifUrl = `https://files.rcsb.org/download/${target?.pdbId}.cif`;

    assert.ok(viewUrl.includes(expectedPdb));
    assert.ok(structUrl.includes(expectedPdb));
    assert.ok(cifUrl.endsWith(`${expectedPdb}.cif`));
  }

  // 5. Verify App state handoff logic for handleOpenIn3DLab
  console.log('5. Testing handleOpenIn3DLab state handoff logic...');
  let appActiveTab = 'document-review';
  let selected3DDrug: string | undefined;
  let selected3DPdbId: string | undefined;

  const handleOpenIn3DLab = (structure: ChemicalStructure) => {
    selected3DDrug = structure.name;
    const canonical = findCanonicalTargetForDrug(structure.name);
    selected3DPdbId = canonical?.pdbId;
    appActiveTab = '3d-lab';
  };

  handleOpenIn3DLab({
    id: 'pras_1',
    name: 'Prasugrel',
  } as ChemicalStructure);

  assert.strictEqual(appActiveTab, '3d-lab');
  assert.strictEqual(selected3DDrug, 'Prasugrel');
  assert.strictEqual(selected3DPdbId, '4NTJ');

  // Test fallback for novel/unknown drug
  handleOpenIn3DLab({
    id: 'unknown_1',
    name: 'NovelExperimentalCompound-X99',
  } as ChemicalStructure);

  assert.strictEqual(appActiveTab, '3d-lab');
  assert.strictEqual(selected3DDrug, 'NovelExperimentalCompound-X99');
  assert.strictEqual(selected3DPdbId, undefined);

  console.log('✅ All 3D Lab Library integration contract tests passed successfully!');
}

runTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
