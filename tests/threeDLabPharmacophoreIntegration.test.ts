// tests/threeDLabPharmacophoreIntegration.test.ts
import assert from 'node:assert';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { findMedChemProfile } from '../src/data/canonicalPharmacophorePkData.js';
import { CANONICAL_MEDCHEM_TARGETS } from '../src/utils/canonicalTargets.js';
import { ThreeDLabLibrary } from '../src/components/ThreeDLabLibrary.js';

console.log('--- Running 3D Lab Pharmacophore & Drawer Coordination Integration Test Suite ---');

async function runTests() {
  const componentPath = 'src/components/ThreeDLabLibrary.tsx';
  assert.ok(fs.existsSync(componentPath), `Component file ${componentPath} must exist`);

  const fileContent = fs.readFileSync(componentPath, 'utf8');

  // --------------------------------------------------------------------------
  // Test 1: Imports & Component Architecture Contract
  // --------------------------------------------------------------------------
  console.log('1. Testing imports and component architecture contract...');
  assert.ok(
    fileContent.includes("import { PharmacophorePkDrawer } from './PharmacophorePkDrawer'") ||
      fileContent.includes('import { PharmacophorePkDrawer } from "./PharmacophorePkDrawer"'),
    'Must import PharmacophorePkDrawer component'
  );
  assert.ok(
    fileContent.includes('findMedChemProfile'),
    'Must import and use findMedChemProfile to look up canonical target profile'
  );

  // --------------------------------------------------------------------------
  // Test 2: State Coordination for Mutually Exclusive Right Drawers
  // --------------------------------------------------------------------------
  console.log('2. Testing right-side drawer state coordination...');
  assert.ok(
    fileContent.includes("activeRightDrawer") &&
      (fileContent.includes("'none'") || fileContent.includes('"none"')) &&
      (fileContent.includes("'chembl'") || fileContent.includes('"chembl"')) &&
      (fileContent.includes("'pharmacophore'") || fileContent.includes('"pharmacophore"')),
    "Must maintain activeRightDrawer state typed as 'none' | 'chembl' | 'pharmacophore'"
  );
  assert.ok(
    fileContent.includes('activePharmacophoreGroup'),
    'Must maintain activePharmacophoreGroup state'
  );
  assert.ok(
    fileContent.includes('selectedPocketResidue'),
    'Must maintain selectedPocketResidue state'
  );

  // --------------------------------------------------------------------------
  // Test 3: Fullscreen Floating Trigger Tabs & Accessibility
  // --------------------------------------------------------------------------
  console.log('3. Testing fullscreen floating trigger tabs and aria-labels...');
  assert.ok(
    fileContent.includes('aria-label="Open Pharmacophore PK Drawer"') ||
      fileContent.includes("aria-label='Open Pharmacophore PK Drawer'"),
    'Must provide floating trigger tab for Pharmacophore PK with accessible aria-label'
  );
  assert.ok(
    fileContent.includes('aria-label="Open ChEMBL SAR Drawer"') ||
      fileContent.includes("aria-label='Open ChEMBL SAR Drawer'"),
    'Must provide floating trigger tab for ChEMBL SAR with accessible aria-label'
  );
  assert.ok(
    fileContent.includes('top-20') && fileContent.includes('top-32'),
    'Fullscreen floating right tabs must have distinct vertical offsets (e.g. top-20 and top-32)'
  );

  // --------------------------------------------------------------------------
  // Test 4: Escape Key Handling Hierarchy
  // --------------------------------------------------------------------------
  console.log('4. Testing Escape key handling hierarchy in fullscreen mode...');
  // Escape must close open drawers before exiting fullscreen
  assert.ok(
    fileContent.includes('isLeftDrawerOpen') &&
      fileContent.includes('activeRightDrawer') &&
      fileContent.includes('setIsFullscreen(false)'),
    'Escape key handler must check and close open left or right drawers before exiting fullscreen'
  );

  // --------------------------------------------------------------------------
  // Test 5: Target Resolution & MedChem Profile Synchronization
  // --------------------------------------------------------------------------
  console.log('5. Testing target selection and medchem profile resolution logic...');
  const testTargets = [
    { gene: 'P2RY12', pdb: '4NTJ', expectedGroupCount: 3 },
    { gene: 'ACE', pdb: '1O86', expectedGroupCount: 3 },
    { gene: 'AGTR1', pdb: '4Z9O', expectedGroupCount: 3 },
    { gene: 'HMGCR', pdb: '1HWK', expectedGroupCount: 3 },
    { gene: 'ADRB1', pdb: '7JJO', expectedGroupCount: 3 },
    { gene: 'PTGS2', pdb: '3LN1', expectedGroupCount: 3 },
    { gene: 'DHFR', pdb: '1U72', expectedGroupCount: 3 },
    { gene: 'EGFR', pdb: '1M17', expectedGroupCount: 3 },
  ];

  for (const { gene, pdb, expectedGroupCount } of testTargets) {
    const profileByGene = findMedChemProfile(gene);
    assert.ok(profileByGene, `Profile for gene ${gene} must be resolved`);
    assert.strictEqual(profileByGene?.pharmacophoreGroups.length, expectedGroupCount);

    const profileByPdb = findMedChemProfile(pdb);
    assert.ok(profileByPdb, `Profile for PDB ${pdb} must be resolved`);
    assert.strictEqual(profileByPdb?.pdbId, pdb);
  }

  // --------------------------------------------------------------------------
  // Test 6: ThreeDLabCanvas Props Wiring
  // --------------------------------------------------------------------------
  console.log('6. Testing ThreeDLabCanvas props wiring...');
  assert.ok(
    fileContent.includes('activePharmacophoreGroup={activePharmacophoreGroup}'),
    'Must pass activePharmacophoreGroup to ThreeDLabCanvas'
  );
  assert.ok(
    fileContent.includes('onSelectPharmacophoreGroup={setActivePharmacophoreGroup}'),
    'Must pass onSelectPharmacophoreGroup to ThreeDLabCanvas'
  );
  assert.ok(
    fileContent.includes('onSelectPocketResidue={setSelectedPocketResidue}'),
    'Must pass onSelectPocketResidue to ThreeDLabCanvas'
  );
  assert.ok(
    fileContent.includes("isPkDrawerOpen={activeRightDrawer === 'pharmacophore'}") ||
      fileContent.includes('isPkDrawerOpen={activeRightDrawer === "pharmacophore"}'),
    'Must pass isPkDrawerOpen based on activeRightDrawer to ThreeDLabCanvas'
  );
  assert.ok(
    fileContent.includes('onTogglePkDrawer'),
    'Must pass onTogglePkDrawer callback to ThreeDLabCanvas'
  );

  // --------------------------------------------------------------------------
  // Test 7: PharmacophorePkDrawer Rendering & Callbacks Wiring
  // --------------------------------------------------------------------------
  console.log('7. Testing PharmacophorePkDrawer rendering and props wiring...');
  assert.ok(
    fileContent.includes('<PharmacophorePkDrawer'),
    'Must render PharmacophorePkDrawer component'
  );
  assert.ok(
    fileContent.includes("isOpen={activeRightDrawer === 'pharmacophore'}") ||
      fileContent.includes('isOpen={activeRightDrawer === "pharmacophore"}'),
    'PharmacophorePkDrawer must receive isOpen bound to activeRightDrawer === pharmacophore'
  );
  assert.ok(
    fileContent.includes("setActiveRightDrawer('none')") ||
      fileContent.includes('setActiveRightDrawer("none")'),
    'PharmacophorePkDrawer onClose must set activeRightDrawer to none'
  );
  assert.ok(
    fileContent.includes('activeGroup={activePharmacophoreGroup}'),
    'PharmacophorePkDrawer must receive activeGroup'
  );
  assert.ok(
    fileContent.includes('profile={medChemProfile}'),
    'PharmacophorePkDrawer must receive medChemProfile'
  );
  assert.ok(
    fileContent.includes('selectedPocketResidue={selectedPocketResidue}'),
    'PharmacophorePkDrawer must receive selectedPocketResidue'
  );

  // --------------------------------------------------------------------------
  // Test 8: Component SSR Rendering
  // --------------------------------------------------------------------------
  console.log('8. Testing SSR rendering of ThreeDLabLibrary...');
  const html = renderToString(
    React.createElement(ThreeDLabLibrary, {
      initialDrugName: 'Clopidogrel',
      initialPdbId: '4NTJ',
    })
  );

  assert.ok(html.length > 0, 'ThreeDLabLibrary should render HTML string via SSR');
  assert.ok(
    html.includes('3D Molecular Lab &amp; SAR Studio') || html.includes('3D Molecular Lab & SAR Studio'),
    'Rendered HTML must contain header title'
  );
  assert.ok(
    html.includes('Clopidogrel'),
    'Rendered HTML must reflect initial drug name'
  );
  assert.ok(
    html.includes('4NTJ'),
    'Rendered HTML must reflect initial PDB ID'
  );
  assert.ok(
    html.includes('Mol* / RCSB &amp; ChEMBL') || html.includes('Mol* / RCSB & ChEMBL'),
    'Rendered HTML must reflect Mol* engine badge in header'
  );

  // --------------------------------------------------------------------------
  // Test 9: Mol* Canvas Integration & Layout Coordination
  // --------------------------------------------------------------------------
  console.log('9. Testing Mol* Canvas integration and layout coordination...');
  assert.ok(
    fileContent.includes('<ThreeDLabCanvas'),
    'ThreeDLabLibrary must mount ThreeDLabCanvas'
  );
  assert.ok(
    fileContent.includes('centerColSpanClass'),
    'ThreeDLabLibrary must dynamically compute center canvas column span'
  );
  assert.ok(
    fileContent.includes('lg:col-span-12') &&
      fileContent.includes('lg:col-span-9') &&
      fileContent.includes('lg:col-span-6'),
    'Center canvas must expand dynamically across 6, 9, or 12 grid columns depending on sidebar collapse states'
  );

  // --------------------------------------------------------------------------
  // Test 10: Canvas Resize Synchronization & Window Events
  // --------------------------------------------------------------------------
  console.log('10. Testing canvas resize event dispatching and coordination...');
  assert.ok(
    fileContent.includes("window.dispatchEvent(new Event('resize'))") ||
      fileContent.includes('window.dispatchEvent(new Event("resize"))'),
    'ThreeDLabLibrary must dispatch window resize event to trigger Mol* canvas3d.requestResize upon layout changes'
  );

  const canvasPath = 'src/components/ThreeDLabCanvas.tsx';
  assert.ok(fs.existsSync(canvasPath), `Canvas component file ${canvasPath} must exist`);
  const canvasContent = fs.readFileSync(canvasPath, 'utf8');
  assert.ok(
    canvasContent.includes('requestResize'),
    'ThreeDLabCanvas must support requestResize on Mol* canvas3d'
  );
  assert.ok(
    canvasContent.includes("window.addEventListener('resize'") ||
      canvasContent.includes('window.addEventListener("resize"'),
    'ThreeDLabCanvas must listen for window resize events to recalculate WebGL aspect ratio'
  );

  // --------------------------------------------------------------------------
  // Test 11: Drawer Mutual Exclusivity and Escape Hierarchy
  // --------------------------------------------------------------------------
  console.log('11. Testing right-side drawer mutual exclusivity and hierarchy...');
  assert.ok(
    fileContent.includes("activeRightDrawer === 'pharmacophore'"),
    'Correctly evaluates activeRightDrawer for pharmacophore'
  );
  assert.ok(
    fileContent.includes("activeRightDrawer === 'chembl'"),
    'Correctly evaluates activeRightDrawer for chembl'
  );
  assert.ok(
    fileContent.includes('setIsRightCollapsed(true)'),
    'Opening pharmacophore drawer must collapse right sidebar in regular mode to avoid collision'
  );

  console.log('✅ All 3D Lab Pharmacophore & Drawer Coordination Integration tests passed successfully!');
}

runTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
