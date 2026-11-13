// tests/threeDLabTutorialModal.test.ts
import assert from 'node:assert';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';

// ============================================================================
// Test Suite: 3D Lab Pedagogical Tutorial Modal
// ============================================================================

async function runTests() {
  const componentPath = 'src/components/ThreeDLabTutorialModal.tsx';
  assert.ok(fs.existsSync(componentPath), `Component file ${componentPath} must exist`);

  const fileContent = fs.readFileSync(componentPath, 'utf8');

  // --------------------------------------------------------------------------
  // Test 1: Component & Interface Export Verification
  // --------------------------------------------------------------------------
  assert.ok(
    fileContent.includes('export interface ThreeDLabTutorialModalProps'),
    'Must export ThreeDLabTutorialModalProps interface'
  );
  assert.ok(
    fileContent.includes('export const ThreeDLabTutorialModal'),
    'Must export ThreeDLabTutorialModal component'
  );
  assert.ok(
    fileContent.includes('isOpen: boolean'),
    'ThreeDLabTutorialModalProps must require isOpen: boolean'
  );
  assert.ok(
    fileContent.includes('onClose: () => void'),
    'ThreeDLabTutorialModalProps must require onClose: () => void'
  );

  // --------------------------------------------------------------------------
  // Test 2: Dynamic Import & Closed State (isOpen = false -> null)
  // --------------------------------------------------------------------------
  const mod = await import('../src/components/ThreeDLabTutorialModal.js');
  const { ThreeDLabTutorialModal } = mod;
  assert.strictEqual(typeof ThreeDLabTutorialModal, 'function', 'ThreeDLabTutorialModal must be a React function component');

  const closedHtml = renderToString(
    React.createElement(ThreeDLabTutorialModal, { isOpen: false, onClose: () => {} })
  );
  assert.strictEqual(closedHtml, '', 'Modal must render null when isOpen is false');

  // --------------------------------------------------------------------------
  // Test 3: Open State & Accessibility Attributes
  // --------------------------------------------------------------------------
  const openHtml = renderToString(
    React.createElement(ThreeDLabTutorialModal, { isOpen: true, onClose: () => {} })
  );
  assert.ok(openHtml.length > 0, 'Modal must render content when isOpen is true');
  assert.ok(openHtml.includes('role="dialog"'), 'Modal must have role="dialog"');
  assert.ok(openHtml.includes('aria-modal="true"'), 'Modal must have aria-modal="true"');
  assert.ok(openHtml.includes('aria-labelledby="tutorial-modal-title"'), 'Modal must have aria-labelledby="tutorial-modal-title"');
  assert.ok(openHtml.includes('id="tutorial-modal-title"'), 'Modal title element must have id="tutorial-modal-title"');

  // --------------------------------------------------------------------------
  // Test 4: Keyboard Event Listener & Dismissal Contract
  // --------------------------------------------------------------------------
  assert.ok(
    fileContent.includes("'Escape'") || fileContent.includes('"Escape"'),
    'Component must listen for Escape keydown event'
  );
  assert.ok(
    fileContent.includes('addEventListener') && fileContent.includes('removeEventListener'),
    'Component must register and cleanly remove keydown event listener in useEffect'
  );
  assert.ok(
    fileContent.includes('stopPropagation'),
    'Inner dialog container must stop click propagation from backdrop dismiss'
  );

  // --------------------------------------------------------------------------
  // Test 5: Step 1 Content - 3D Navigation Controls
  // --------------------------------------------------------------------------
  assert.ok(
    fileContent.includes('Navigating in 3D Space') || openHtml.includes('Navigating in 3D Space'),
    'Step 1 must feature title "Navigating in 3D Space"'
  );
  assert.ok(
    fileContent.includes('Rotate') || fileContent.includes('rotate'),
    'Step 1 must explain rotation controls (Left-Click Drag)'
  );
  assert.ok(
    fileContent.includes('Pan') || fileContent.includes('pan'),
    'Step 1 must explain pan controls (Right-Click Drag or Shift+Left Drag)'
  );
  assert.ok(
    fileContent.includes('Zoom') || fileContent.includes('zoom'),
    'Step 1 must explain zoom controls (Scroll Wheel / Pinch)'
  );
  assert.ok(
    fileContent.includes('Center') || fileContent.includes('pivot') || fileContent.includes('Atom'),
    'Step 1 must explain clicking an atom centers rotation pivot'
  );

  // --------------------------------------------------------------------------
  // Test 6: Step 2 Content - Small-Molecule Ligand Inspection
  // --------------------------------------------------------------------------
  assert.ok(
    fileContent.includes('Isolating the Small-Molecule Ligand') || openHtml.includes('Isolating the Small-Molecule Ligand'),
    'Step 2 must feature title "Isolating the Small-Molecule Ligand"'
  );
  assert.ok(
    fileContent.includes('scaffold') || fileContent.includes('Scaffold'),
    'Step 2 must discuss identifying core chemical scaffold'
  );
  assert.ok(
    fileContent.includes('conformation') || fileContent.includes('Conformation') || fileContent.includes('ring'),
    'Step 2 must guide student to notice drug 3D conformation/rings'
  );

  // --------------------------------------------------------------------------
  // Test 7: Step 3 Content - Active-Site Interactions & Pharmacophores
  // --------------------------------------------------------------------------
  assert.ok(
    fileContent.includes('Active-Site Interactions') || openHtml.includes('Active-Site Interactions'),
    'Step 3 must feature title on Active-Site Interactions & Pharmacophores'
  );
  assert.ok(
    fileContent.includes('Hydrogen Bond') || fileContent.includes('H-bond') || fileContent.includes('polar'),
    'Step 3 must explain hydrogen bonding interactions'
  );
  assert.ok(
    fileContent.includes('Salt Bridge') || fileContent.includes('Ionic') || fileContent.includes('Asp') || fileContent.includes('Glu'),
    'Step 3 must explain ionic salt bridges (Asp/Glu residues with basic amines)'
  );
  assert.ok(
    fileContent.includes('pi') || fileContent.includes('π') || fileContent.includes('Stacking') || fileContent.includes('Phe') || fileContent.includes('Tyr') || fileContent.includes('Trp'),
    'Step 3 must explain aromatic pi-pi stacking with Phe/Tyr/Trp'
  );
  assert.ok(
    fileContent.includes('Hydrophobic') || fileContent.includes('Leu') || fileContent.includes('Ile') || fileContent.includes('Val'),
    'Step 3 must explain hydrophobic pockets (Leu/Ile/Val clefts)'
  );

  // --------------------------------------------------------------------------
  // Test 8: Step 4 Content - Connecting Structure to ChEMBL SAR Potency
  // --------------------------------------------------------------------------
  assert.ok(
    fileContent.includes('Translating 3D Contacts into Potency') || fileContent.includes('Potency'),
    'Step 4 must feature title translating 3D contacts into potency'
  );
  assert.ok(
    fileContent.includes('Ki') || fileContent.includes('K_i') || fileContent.includes('IC50') || fileContent.includes('IC_{50}') || fileContent.includes('K<sub>i</sub>'),
    'Step 4 must explain Ki / IC50 affinity metrics'
  );
  assert.ok(
    fileContent.includes('pChEMBL') || fileContent.includes('nanomolar') || fileContent.includes('picomolar'),
    'Step 4 must explain pChEMBL and nanomolar/picomolar potency scales'
  );
  assert.ok(
    fileContent.includes('clash') || fileContent.includes('steric') || fileContent.includes('loss of potency'),
    'Step 4 must explain steric clashes and loss of potency'
  );

  // --------------------------------------------------------------------------
  // Test 9: Navigation Controls, Step Counter & LocalStorage Preference
  // --------------------------------------------------------------------------
  assert.ok(
    fileContent.includes('3d_lab_tutorial_dismissed'),
    'Must persist automatic launch dismissal preference in localStorage key "3d_lab_tutorial_dismissed"'
  );
  const cleanedHtml = openHtml.replace(/<!--.*?-->/g, '');
  assert.ok(
    cleanedHtml.includes('Step 1 of 4') || fileContent.includes('of 4'),
    'Must display a step counter (e.g. Step 1 of 4)'
  );
  assert.ok(
    fileContent.includes('Previous') || fileContent.includes('Prev'),
    'Must have a Previous step navigation button'
  );
  assert.ok(
    fileContent.includes('Next'),
    'Must have a Next step navigation button'
  );
  assert.ok(
    fileContent.includes('Got it') || fileContent.includes('Start Exploring'),
    'Must have a Got it / Start Exploring action button on final step'
  );

  console.log('All tests passed in tests/threeDLabTutorialModal.test.ts!');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
