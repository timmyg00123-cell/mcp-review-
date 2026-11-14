import assert from 'node:assert';
import { CANONICAL_MEDCHEM_TARGETS } from '../src/utils/canonicalTargets';
import {
  fetchPdbCoordinates,
  identifyLigandResidue,
  EXCLUDED_HETERO_RESIDUES,
  type DetectedLigandInfo,
} from '../src/services/structure3dService';

console.log('--- Running 3D Structure Service & Canonical Ligand Codes Test Suite ---');

async function runTests() {
  // 1. Verify all 12 canonical targets have curated ligandCode
  console.log('1. Verifying canonical targets have valid 3-character ligandCode...');
  assert.strictEqual(
    CANONICAL_MEDCHEM_TARGETS.length,
    12,
    'Expected exactly 12 canonical medchem targets'
  );

  const expectedLigands: Record<string, string> = {
    '4NTJ': 'AZD',
    '1O86': '1N4',
    '4Z9O': '4Z9',
    '1HWK': '1HW',
    '7JJO': 'NEN',
    '2RH1': 'CAU',
    '3LN1': 'CEL',
    '1CQE': 'MPO',
    '1U72': 'MTX',
    '1M17': 'AQ4',
    '1HXB': '10A',
    '1VQQ': 'AMO',
  };

  for (const target of CANONICAL_MEDCHEM_TARGETS) {
    assert.ok(target.ligandCode, `Target ${target.pdbId} (${target.targetName}) is missing ligandCode`);
    assert.strictEqual(
      target.ligandCode.length,
      3,
      `Target ${target.pdbId} ligandCode '${target.ligandCode}' must be 3 characters`
    );
    assert.strictEqual(
      target.ligandCode,
      expectedLigands[target.pdbId],
      `Target ${target.pdbId} expected ligandCode ${expectedLigands[target.pdbId]} but got ${target.ligandCode}`
    );
  }

  // 2. Test EXCLUDED_HETERO_RESIDUES contains expected common crystallographic additives and solvents
  console.log('2. Verifying EXCLUDED_HETERO_RESIDUES list...');
  assert.ok(Array.isArray(EXCLUDED_HETERO_RESIDUES), 'EXCLUDED_HETERO_RESIDUES must be an array');
  const requiredExclusions = ['HOH', 'WAT', 'CLR', 'SO4', 'PO4', 'MG', 'ZN', 'NA', 'CL', 'GOL', 'EDO', 'PEG'];
  for (const item of requiredExclusions) {
    assert.ok(
      EXCLUDED_HETERO_RESIDUES.includes(item),
      `EXCLUDED_HETERO_RESIDUES must include ${item}`
    );
  }

  // 3. Test identifyLigandResidue with mock PDB data containing drug ligand, water, sulfate, and cholesterol
  console.log('3. Testing identifyLigandResidue with drug ligand and excluded additives...');
  const mockPdbData = [
    'ATOM      1  N   MET A   1      20.154  12.432  34.120  1.00 25.00           N',
    'ATOM      2  CA  MET A   1      21.200  13.100  34.800  1.00 25.00           C',
    'HETATM 1001  O   HOH W 101      15.000  10.000  20.000  1.00 15.00           O',
    'HETATM 1002  O   HOH W 102      16.000  11.000  21.000  1.00 15.00           O',
    'HETATM 1003  S   SO4 S 201      12.000   8.000  18.000  1.00 30.00           S',
    'HETATM 1004  O1  SO4 S 201      12.500   8.500  18.500  1.00 30.00           O',
    'HETATM 1005  C1  CLR C 301      10.000   5.000  12.000  1.00 40.00           C',
    'HETATM 1006  C2  CLR C 301      10.500   5.500  12.500  1.00 40.00           C',
    'HETATM 1007  C3  CLR C 301      11.000   6.000  13.000  1.00 40.00           C',
    'HETATM 1008  C1  AZD L 401      25.000  18.000  40.000  1.00 20.00           C',
    'HETATM 1009  C2  AZD L 401      25.500  18.500  40.500  1.00 20.00           C',
    'HETATM 1010  C3  AZD L 401      26.000  19.000  41.000  1.00 20.00           C',
    'HETATM 1011  N1  AZD L 401      26.500  19.500  41.500  1.00 20.00           N',
    'HETATM 1012  O1  AZD L 401      27.000  20.000  42.000  1.00 20.00           O',
  ].join('\n');

  const detected = identifyLigandResidue(mockPdbData);
  assert.ok(detected !== null, 'Should detect a ligand residue');
  assert.strictEqual(detected.resn, 'AZD', 'Should ignore HOH, SO4, and CLR and identify AZD as primary ligand');
  assert.strictEqual(detected.atomCount, 5, 'AZD should have 5 atoms counted');

  // 4. Test identifyLigandResidue with preferredLigandCode prioritization
  console.log('4. Testing identifyLigandResidue with preferredLigandCode...');
  const multiLigandPdb = [
    'HETATM 2001  C1  LIG A   1      10.000  10.000  10.000  1.00 20.00           C',
    'HETATM 2002  C2  LIG A   1      11.000  10.000  10.000  1.00 20.00           C',
    'HETATM 2003  C3  LIG A   1      12.000  10.000  10.000  1.00 20.00           C',
    'HETATM 2004  C4  LIG A   1      13.000  10.000  10.000  1.00 20.00           C',
    'HETATM 2005  C1  1N4 B   1      20.000  20.000  20.000  1.00 20.00           C',
    'HETATM 2006  C2  1N4 B   1      21.000  20.000  20.000  1.00 20.00           C',
  ].join('\n');

  // Default without preference selects largest atom count (LIG with 4 atoms)
  const autoSelected = identifyLigandResidue(multiLigandPdb);
  assert.ok(autoSelected !== null);
  assert.strictEqual(autoSelected.resn, 'LIG');
  assert.strictEqual(autoSelected.atomCount, 4);

  // Preferred selects 1N4 even though atom count is smaller
  const prefSelected = identifyLigandResidue(multiLigandPdb, '1N4');
  assert.ok(prefSelected !== null);
  assert.strictEqual(prefSelected.resn, '1N4');
  assert.strictEqual(prefSelected.atomCount, 2);

  // 5. Test identifyLigandResidue returns null for apo structures or structures with only solvent/ions
  console.log('5. Testing identifyLigandResidue with apo structure...');
  const apoPdbData = [
    'ATOM      1  N   MET A   1      20.154  12.432  34.120  1.00 25.00           N',
    'ATOM      2  CA  MET A   1      21.200  13.100  34.800  1.00 25.00           C',
    'HETATM 1001  O   HOH W 101      15.000  10.000  20.000  1.00 15.00           O',
    'HETATM 1002  O   WAT W 102      16.000  11.000  21.000  1.00 15.00           O',
    'HETATM 1003  ZN   ZN Z 201      12.000   8.000  18.000  1.00 30.00          ZN',
  ].join('\n');

  const apoDetected = identifyLigandResidue(apoPdbData);
  assert.strictEqual(apoDetected, null, 'Should return null for apo protein without organic ligand');

  // 6. Test fetchPdbCoordinates with mock fetch
  console.log('6. Testing fetchPdbCoordinates...');
  const originalFetch = globalThis.fetch;
  try {
    // 6a. Successful fetch
    globalThis.fetch = async (url: any, options: any) => {
      assert.ok(String(url).includes('4NTJ.pdb'), 'URL should request 4NTJ.pdb');
      return {
        ok: true,
        status: 200,
        text: async () => 'HEADER    P2Y12 RECEPTOR                          24-FEB-14   4NTJ\nATOM      1  N   MET A   1',
      } as any;
    };

    const pdbContent = await fetchPdbCoordinates('4ntj');
    assert.ok(pdbContent.startsWith('HEADER'), 'Fetched PDB content should match mock response');

    // 6b. HTTP 404 / Error response
    globalThis.fetch = async () => {
      return {
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as any;
    };

    await assert.rejects(
      async () => {
        await fetchPdbCoordinates('INVALID');
      },
      /Failed to fetch PDB coordinates for INVALID: HTTP 404/,
      'Should throw informative error on 404'
    );

    // 6c. Aborted / timeout signal handling
    globalThis.fetch = async (url: any, options: any) => {
      if (options?.signal?.aborted) {
        throw new Error('The operation was aborted');
      }
      return new Promise((_, reject) => {
        options?.signal?.addEventListener('abort', () => {
          reject(new Error('The operation was aborted'));
        });
      });
    };

    const abortController = new AbortController();
    abortController.abort();

    await assert.rejects(
      async () => {
        await fetchPdbCoordinates('4NTJ', abortController.signal);
      },
      /aborted|timeout|Failed to fetch PDB coordinates/,
      'Should reject when abort signal is triggered'
    );
  } finally {
    globalThis.fetch = originalFetch;
  }

  // 7. Test multimeric PDB with multiple copies of the same ligand across chains A and B
  console.log('7. Testing single-instance ligand pinning across multimeric chains...');
  const multimerPdb = [
    'HETATM 3001  C1  117 B 501      50.000  50.000  50.000  1.00 20.00           C',
    'HETATM 3002  C2  117 B 501      51.000  50.000  50.000  1.00 20.00           C',
    'HETATM 3003  O1  117 B 501      52.000  50.000  50.000  1.00 20.00           O',
    'HETATM 3004  C1  117 A 401      10.000  10.000  10.000  1.00 20.00           C',
    'HETATM 3005  C2  117 A 401      11.000  10.000  10.000  1.00 20.00           C',
    'HETATM 3006  O1  117 A 401      12.000  10.000  10.000  1.00 20.00           O',
    'HETATM 3007  ZN   ZN A 701      12.500  10.500  10.500  1.00 20.00          ZN',
    'HETATM 3008  ZN   ZN B 702      90.000  90.000  90.000  1.00 20.00          ZN',
  ].join('\n');

  const pinned = identifyLigandResidue(multimerPdb, '1HW');
  assert.ok(pinned !== null, 'Should resolve aliased 1HW -> 117');
  assert.strictEqual(pinned.resn, '117');
  assert.strictEqual(pinned.chain, 'A', 'Should prefer Chain A instance');
  assert.strictEqual(pinned.resi, 401, 'Should extract residue sequence number 401');
  assert.strictEqual(pinned.atomCount, 3, 'Should count atoms of single instance (3), not sum of all copies (6)');
  assert.strictEqual(pinned.instanceCount, 2, 'Should report 2 total instances across chains');
  assert.ok(Array.isArray(pinned.catalyticMetals) && pinned.catalyticMetals.length === 1, 'Should detect 1 nearby catalytic ZN within 5Å');
  assert.strictEqual(pinned.catalyticMetals![0].resn, 'ZN');
  assert.strictEqual(pinned.catalyticMetals![0].chain, 'A');
  assert.strictEqual(pinned.catalyticMetals![0].resi, 701);

  // 7b. Explicit preferredChain overrides Chain A default so multimeric receptor bindingSites match monomer
  const pinnedChainB = identifyLigandResidue(multimerPdb, '1HW', 'B');
  assert.ok(pinnedChainB !== null, 'Should resolve ligand on preferredChain B');
  assert.strictEqual(pinnedChainB.chain, 'B', 'Should pin to preferredChain B instead of Chain A');
  assert.strictEqual(pinnedChainB.resi, 501, 'Should select Chain B residue 501');

  console.log('✅ All structure3dService and canonicalTargets tests passed successfully!');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
