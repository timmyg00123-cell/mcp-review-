import assert from 'node:assert';
import {
  findMedChemProfile,
  CANONICAL_MEDCHEM_PROFILES,
} from '../src/data/canonicalPharmacophorePkData';
import type {
  TargetMedChemProfile,
  PharmacophorePkPdGroup,
  KeyPocketResidueContact,
} from '../src/types/structure3d';

console.log('--- Running Canonical Pharmacophore PK/PD & Pocket Residues Test Suite ---');

async function runTests() {
  const expectedGenes = ['P2RY12', 'ACE', 'AGTR1', 'HMGCR', 'ADRB1', 'PTGS2', 'DHFR', 'EGFR'];
  const expectedPdbs = ['4NTJ', '1O86', '4Z9O', '1HWK', '7JJO', '3LN1', '1U72', '1M17'];
  const validInteractions = new Set([
    'covalent',
    'ionic',
    'hydrogen-bond',
    'pi-stacking',
    'coordination',
    'hydrophobic',
  ]);

  // 1. Verify retrieval by geneSymbol
  console.log('1. Testing profile retrieval by geneSymbol...');
  for (const gene of expectedGenes) {
    const profile = findMedChemProfile(gene);
    assert.ok(profile, `Profile must be found for geneSymbol: ${gene}`);
    assert.strictEqual(
      profile.targetGeneSymbol.toUpperCase(),
      gene.toUpperCase(),
      `Profile geneSymbol must match query ${gene}`
    );
  }

  // 2. Verify retrieval by pdbId
  console.log('2. Testing profile retrieval by pdbId...');
  for (const pdb of expectedPdbs) {
    const profile = findMedChemProfile(pdb);
    assert.ok(profile, `Profile must be found for pdbId: ${pdb}`);
    assert.strictEqual(
      profile.pdbId.toUpperCase(),
      pdb.toUpperCase(),
      `Profile pdbId must match query ${pdb}`
    );
  }

  // 3. Verify case-insensitivity
  console.log('3. Testing case-insensitive lookup...');
  assert.strictEqual(findMedChemProfile('p2ry12')?.pdbId, '4NTJ');
  assert.strictEqual(findMedChemProfile('4ntj')?.targetGeneSymbol, 'P2RY12');
  assert.strictEqual(findMedChemProfile('AcE')?.pdbId, '1O86');
  assert.strictEqual(findMedChemProfile('1o86')?.targetGeneSymbol, 'ACE');
  assert.strictEqual(findMedChemProfile('  hmgcr  ')?.pdbId, '1HWK', 'Should handle whitespace trimming');

  // 4. Verify structural integrity and PK/PD completeness for all profiles
  console.log('4. Testing structural integrity and clinical PK/PD completeness...');
  assert.ok(CANONICAL_MEDCHEM_PROFILES.length >= 8, 'Should have at least 8 canonical profiles');

  for (const profile of CANONICAL_MEDCHEM_PROFILES) {
    assert.ok(profile.targetGeneSymbol, `Target gene must not be empty`);
    assert.ok(profile.pdbId, `PDB ID must not be empty`);
    assert.ok(profile.drugName, `Drug name must not be empty for ${profile.targetGeneSymbol}`);
    assert.ok(profile.ligandCode, `Ligand code must not be empty for ${profile.targetGeneSymbol}`);

    // Pharmacophore groups check
    assert.ok(
      profile.pharmacophoreGroups.length >= 2,
      `${profile.targetGeneSymbol} (${profile.pdbId}) must have >= 2 pharmacophore groups, found ${profile.pharmacophoreGroups.length}`
    );

    for (const group of profile.pharmacophoreGroups) {
      assert.ok(group.id, `Group ID missing in ${profile.targetGeneSymbol}`);
      assert.ok(group.name, `Group name missing in ${profile.targetGeneSymbol}`);
      assert.ok(
        Array.isArray(group.atomNames) && group.atomNames.length > 0,
        `Group atomNames must be a non-empty array in ${group.id} (${profile.targetGeneSymbol})`
      );

      // Pharmacokinetics checks
      const pk = group.pharmacokinetics;
      assert.ok(pk, `Pharmacokinetics object missing in ${group.id}`);
      assert.ok(
        typeof pk.absorption === 'string' && pk.absorption.trim().length > 0,
        `absorption must be non-empty string in ${group.id}`
      );
      assert.ok(
        typeof pk.metabolism === 'string' && pk.metabolism.trim().length > 0,
        `metabolism must be non-empty string in ${group.id}`
      );
      assert.ok(
        typeof pk.halfLifeAndClearance === 'string' && pk.halfLifeAndClearance.trim().length > 0,
        `halfLifeAndClearance must be non-empty string in ${group.id}`
      );

      // Clinical Pharmacodynamics checks
      const pd = group.clinicalPharmacodynamics;
      assert.ok(pd, `clinicalPharmacodynamics object missing in ${group.id}`);
      assert.ok(
        typeof pd.targetBindingRole === 'string' && pd.targetBindingRole.trim().length > 0,
        `targetBindingRole must be non-empty string in ${group.id}`
      );
      assert.ok(
        typeof pd.physiologicEffect === 'string' && pd.physiologicEffect.trim().length > 0,
        `physiologicEffect must be non-empty string in ${group.id}`
      );
      assert.ok(
        typeof pd.adverseEffectRisks === 'string' && pd.adverseEffectRisks.trim().length > 0,
        `adverseEffectRisks must be non-empty string in ${group.id}`
      );
    }

    // Key Pocket Residues check
    assert.ok(
      profile.keyPocketResidues.length >= 1,
      `${profile.targetGeneSymbol} (${profile.pdbId}) must have >= 1 key pocket residue, found ${profile.keyPocketResidues.length}`
    );

    for (const residue of profile.keyPocketResidues) {
      assert.ok(typeof residue.resi === 'number' && residue.resi > 0, `resi must be positive number in ${profile.targetGeneSymbol}`);
      assert.ok(typeof residue.resn === 'string' && residue.resn.length >= 2, `resn must be valid amino acid/cofactor code in ${profile.targetGeneSymbol}`);
      assert.ok(residue.label, `label must be defined in residue contact ${residue.resi}`);
      assert.ok(
        validInteractions.has(residue.interactionType),
        `interactionType '${residue.interactionType}' must be valid interaction type`
      );
      assert.ok(
        typeof residue.clinicalImpact === 'string' && residue.clinicalImpact.trim().length > 0,
        `clinicalImpact must be non-empty string in residue contact ${residue.resi} of ${profile.targetGeneSymbol}`
      );
    }
  }

  // 5. Verify unknown queries return undefined
  console.log('5. Testing unknown target queries...');
  assert.strictEqual(findMedChemProfile('UNKNOWN_TARGET'), undefined);
  assert.strictEqual(findMedChemProfile(''), undefined);
  assert.strictEqual(findMedChemProfile('   '), undefined);
  assert.strictEqual(findMedChemProfile('XXXX'), undefined);

  console.log('All tests passed successfully!');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
