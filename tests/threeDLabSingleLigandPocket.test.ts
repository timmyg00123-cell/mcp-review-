import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  ThreeDLabCanvas,
  MOLSTAR_THEME_COLORS,
  buildMolstarLigandQuery,
  buildMolstarResidueQuery,
  resolveFallbackLigandFromCatalog,
} from '../src/components/ThreeDLabCanvas';
import { resolveDrug3DEntry } from '../src/data/drug3dCatalog';

async function runTests() {
  console.log('--- Running Single-Ligand & Drug-Centered Mol* Canvas Test Suite ---');

  // 1. Strict mmCIF query builders never emit chem_comp_id, struct_asym_id, or residue_number
  const hetQ = buildMolstarLigandQuery({ resn: 'SAL', chain: 'A', resi: 601 }, 'het');
  assert.deepEqual(hetQ, { label_comp_id: 'SAL', auth_asym_id: 'A', auth_seq_id: 601 });
  assert.ok(!('chem_comp_id' in hetQ!) && !('struct_asym_id' in hetQ!) && !('residue_number' in hetQ!));

  const hetNoResi = buildMolstarLigandQuery({ resn: 'SAL', chain: 'A', resi: 0 }, 'het');
  assert.deepEqual(hetNoResi, { label_comp_id: 'SAL', auth_asym_id: 'A' });

  const chainQ = buildMolstarLigandQuery({ resn: 'P', chain: 'P' }, 'chain');
  assert.deepEqual(chainQ, { auth_asym_id: 'P' });

  const carbsQ = buildMolstarLigandQuery({ resn: 'E', chain: 'E' }, 'carbs');
  assert.deepEqual(carbsQ, { auth_asym_id: 'E' });

  assert.equal(buildMolstarLigandQuery(null, 'het'), null);

  const resQ = buildMolstarResidueQuery('A', 530);
  assert.deepEqual(resQ, { auth_asym_id: 'A', auth_seq_id: 530 });
  assert.ok(!('residue_number' in resQ) && !('struct_asym_id' in resQ));

  // 2. Review Focus: Static fallback ligand when fetchPdbCoordinates fails/times out
  const fbSal = resolveFallbackLigandFromCatalog('SAL', 'A', 'het');
  assert.ok(fbSal && fbSal.resn === 'SAL' && fbSal.chain === 'A');
  const fbAlias = resolveFallbackLigandFromCatalog('AZD', 'A', 'het');
  assert.equal(fbAlias?.resn, 'AZJ');
  const fbChain = resolveFallbackLigandFromCatalog('P', 'P', 'chain');
  assert.ok(fbChain && fbChain.chain === 'P');
  assert.equal(resolveFallbackLigandFromCatalog(undefined, undefined, 'het'), null);

  // 3. Lifecycle, CPK heteroatoms & disposal invariants in ThreeDLabCanvas source
  const source = fs.readFileSync('src/components/ThreeDLabCanvas.tsx', 'utf8');
  assert.ok(source.includes("document.createElement('div')"), 'Mounts Mol* into a fresh child div');
  assert.ok(source.includes('plugin?.dispose') || source.includes('plugin.dispose'), 'Disposes Mol* plugin on cleanup');
  assert.ok(!source.includes("visualStyle: 'cartoon'"), 'Does not force het components into cartoon visualStyle');
  assert.ok(source.includes('het: false'), 'Suppresses global het clutter');
  assert.ok(source.includes('color: null'), 'Preserves CPK heteroatom colors');
  assert.ok(source.includes("type_symbol: 'C'"), 'Overpaints carbon atoms only');
  assert.ok(Boolean(MOLSTAR_THEME_COLORS.slateRibbon), 'Defines slateRibbon backdrop color');

  // 4. Simplified drug-centered header & toolbar badges (Exact vs Class Pocket Crystal)
  const aspirin = resolveDrug3DEntry('Aspirin')!;
  const exactHtml = renderToString(
    React.createElement(ThreeDLabCanvas, {
      pdbId: aspirin.pdbId,
      preferredLigandCode: aspirin.ligandCode,
      drugEntry: aspirin,
      isFullscreen: false,
      onToggleFullscreen: () => {},
      onOpenTutorial: () => {},
    })
  );
  assert.ok(exactHtml.includes('Aspirin'), 'Header displays selected drug name');
  assert.ok(exactHtml.includes('Exact Drug Crystal'), 'Displays Exact Drug Crystal badge for 1PTH');
  assert.ok(exactHtml.includes('Reset View'), 'Renders Reset View control');
  assert.ok(exactHtml.includes('Protein Ribbon'), 'Renders Protein Ribbon toggle');
  assert.ok(exactHtml.includes('Sub-Pocket Colors'), 'Renders Sub-Pocket Colors toggle');
  assert.ok(!exactHtml.includes('Isolate Ligand') && !exactHtml.includes('Atom Labels'), 'Removes legacy clutter toggles');

  const losartan = resolveDrug3DEntry('Losartan')!;
  const refHtml = renderToString(
    React.createElement(ThreeDLabCanvas, {
      pdbId: losartan.pdbId,
      preferredLigandCode: losartan.ligandCode,
      drugEntry: losartan,
      isFullscreen: false,
      onToggleFullscreen: () => {},
      onOpenTutorial: () => {},
    })
  );
  assert.ok(refHtml.includes('Class Pocket Crystal'), 'Displays Class Pocket Crystal badge when isExactDrugCrystal is false');

  console.log('✅ All tests passed in tests/threeDLabSingleLigandPocket.test.ts');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
