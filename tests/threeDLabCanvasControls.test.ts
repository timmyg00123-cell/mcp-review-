// tests/threeDLabCanvasControls.test.ts
import assert from 'node:assert';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';

// ============================================================================
// Test Suite: 3D Canvas Scene Fixes & Controls Engine (Task 2)
// ============================================================================

async function runTests() {
  const componentPath = 'src/components/ThreeDLabCanvas.tsx';
  assert.ok(fs.existsSync(componentPath), `Component file ${componentPath} must exist`);

  const fileContent = fs.readFileSync(componentPath, 'utf8');

  // --------------------------------------------------------------------------
  // Test 1: Enhanced ThreeDLabCanvasProps Interface Contract
  // --------------------------------------------------------------------------
  assert.ok(
    fileContent.includes('activePharmacophoreGroup?: PharmacophorePkPdGroup | null;'),
    'ThreeDLabCanvasProps must include activePharmacophoreGroup'
  );
  assert.ok(
    fileContent.includes('onSelectPharmacophoreGroup?: (group: PharmacophorePkPdGroup | null) => void;'),
    'ThreeDLabCanvasProps must include onSelectPharmacophoreGroup'
  );
  assert.ok(
    fileContent.includes('onSelectPocketResidue?: (residue: KeyPocketResidueContact | null) => void;'),
    'ThreeDLabCanvasProps must include onSelectPocketResidue'
  );
  assert.ok(
    fileContent.includes('isPkDrawerOpen?: boolean;'),
    'ThreeDLabCanvasProps must include isPkDrawerOpen'
  );
  assert.ok(
    fileContent.includes('onTogglePkDrawer?: () => void;'),
    'ThreeDLabCanvasProps must include onTogglePkDrawer'
  );

  // --------------------------------------------------------------------------
  // Test 2: Protein Ribbon Selector Fix ({ hetflag: false })
  // --------------------------------------------------------------------------
  assert.ok(
    !fileContent.includes('{ protein: true }'),
    'Must NOT use { protein: true } as ribbon selector (causes blank ribbons in 3Dmol)'
  );
  assert.ok(
    fileContent.includes('hetflag: false'),
    'Must use { hetflag: false } to select protein backbone for ribbon rendering'
  );

  // --------------------------------------------------------------------------
  // Test 3: Scroll Zoom Dampening & Event Cleanup Contract
  // --------------------------------------------------------------------------
  assert.ok(
    fileContent.includes('capture: true') && fileContent.includes('passive: false'),
    'Container wheel listener must attach with { passive: false, capture: true }'
  );
  assert.ok(
    fileContent.includes('Math.sign(e.deltaY) * 0.04') || fileContent.includes('Math.sign(e.deltaY) * 0.05'),
    'Wheel zoom must be dampened using ~0.04 factor'
  );
  assert.ok(
    fileContent.includes('e.preventDefault()'),
    'Wheel event handler must prevent default browser / 3Dmol native zoom'
  );
  assert.ok(
    fileContent.includes('removeEventListener'),
    'Must clean up wheel event listener on unmount'
  );

  // --------------------------------------------------------------------------
  // Test 4: Atom Labels Toggle Contract (Mol* GPU-Instanced Labels)
  // --------------------------------------------------------------------------
  assert.ok(
    !fileContent.includes('viewer.addPropertyLabels("atom"'),
    'Must eliminate legacy 3Dmol addPropertyLabels canvas texture freeze'
  );
  assert.ok(
    fileContent.includes('showAtomLabels'),
    'Must track showAtomLabels state for GPU-instanced labels'
  );

  // --------------------------------------------------------------------------
  // Test 5: Pharmacophore Accent Highlighting Contract
  // --------------------------------------------------------------------------
  assert.ok(
    fileContent.includes('magentaCarbon'),
    'Must highlight active pharmacophore group atoms with magentaCarbon colorscheme'
  );
  assert.ok(
    fileContent.includes('findMedChemProfile'),
    'Must query findMedChemProfile for target profile'
  );

  // --------------------------------------------------------------------------
  // Test 6: Component Rendering with Controls & Pharmacophore Toolbar
  // --------------------------------------------------------------------------
  const mod = await import('../src/components/ThreeDLabCanvas.js');
  const { ThreeDLabCanvas } = mod;
  assert.strictEqual(typeof ThreeDLabCanvas, 'function', 'ThreeDLabCanvas must be a function component');

  const p2y12Props = {
    pdbId: '4NTJ',
    targetName: 'P2Y12 Receptor',
    geneSymbol: 'P2RY12',
    isFullscreen: false,
    onToggleFullscreen: () => {},
    onOpenTutorial: () => {},
    isPkDrawerOpen: false,
    onTogglePkDrawer: () => {},
  };

  const html = renderToString(React.createElement(ThreeDLabCanvas, p2y12Props));

  // Toolbar toggles must include Atom Labels
  assert.ok(html.includes('Atom Labels'), 'Must render "Atom Labels" button in controls toolbar');

  // Floating Zoom Buttons
  assert.ok(html.includes('aria-label="Zoom in"'), 'Must render on-canvas Zoom in button');
  assert.ok(html.includes('aria-label="Zoom out"'), 'Must render on-canvas Zoom out button');

  // Pharmacophore chips must be rendered for P2RY12 (PDB 4NTJ)
  assert.ok(
    html.includes('o-Chlorophenyl Lipophilic Anchor'),
    'Must render o-Chlorophenyl pharmacophore chip for P2RY12'
  );
  assert.ok(
    html.includes('Reactive Thiol / Sulfonyl Pharmacophore'),
    'Must render Reactive Thiol pharmacophore chip for P2RY12'
  );

  // Test with active pharmacophore group
  const activeGroup = {
    id: 'p2ry12_chlorophenyl',
    name: 'o-Chlorophenyl Lipophilic Anchor',
    chemicalFormula: 'C6H4Cl',
    atomNames: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'CL1', 'Cl'],
    colorAccent: '#3b82f6',
    pharmacokinetics: {
      absorption: 'High oral bioavailability',
      metabolism: 'Prodrug',
      halfLifeAndClearance: 't1/2 6h',
    },
    clinicalPharmacodynamics: {
      targetBindingRole: 'Hydrophobic anchor',
      physiologicEffect: 'Inhibits aggregation',
      adverseEffectRisks: 'Bleeding',
    },
  };

  const activeHtml = renderToString(
    React.createElement(ThreeDLabCanvas, {
      ...p2y12Props,
      activePharmacophoreGroup: activeGroup,
    })
  );

  assert.ok(
    activeHtml.includes('aria-pressed="true"'),
    'Active pharmacophore chip must have aria-pressed="true"'
  );

  console.log(' All tests passed in tests/threeDLabCanvasControls.test.ts');
}

runTests().catch((err) => {
  console.error(' Test failed as expected:', err.message);
  process.exit(1);
});
