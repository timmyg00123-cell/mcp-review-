// tests/threeDLabMolstarCanvas.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';

test('ThreeDLabCanvas source code eliminates 3Dmol addPropertyLabels freeze and integrates Mol*', () => {
  const componentPath = 'src/components/ThreeDLabCanvas.tsx';
  assert.ok(fs.existsSync(componentPath), `Component file ${componentPath} must exist`);

  const source = fs.readFileSync(componentPath, 'utf-8');

  // Verify Mol* & binary CIF integration
  assert.ok(
    source.includes('loadMolstarPluginScript') || source.includes('loadMolstarBundle'),
    'Must import loadMolstarPluginScript or loadMolstarBundle from molstarLoader'
  );
  assert.ok(
    source.includes('getBinaryCifUrl'),
    'Must use getBinaryCifUrl for binary mmCIF streaming'
  );
  assert.ok(source.includes('bcif'), 'Must reference binary CIF (.bcif) coordinate format');

  // Verify Pocket Surface & Pocket Sticks state & controls
  assert.ok(source.includes('showPocketSurface'), 'Must track showPocketSurface state');
  assert.ok(source.includes('Pocket Surface'), 'Must include "Pocket Surface" toggle button text');
  assert.ok(source.includes('showPocket'), 'Must track showPocket state for 5Å pocket sticks');
  assert.ok(source.includes('showRibbon'), 'Must track showRibbon state');
  assert.ok(
    source.includes('showHBonds') || source.includes('showInteractions'),
    'Must track showHBonds or showInteractions state'
  );
  assert.ok(source.includes('showAtomLabels'), 'Must track showAtomLabels state');

  // Verify elimination of 3Dmol addPropertyLabels canvas texture freeze
  assert.ok(
    !source.includes('viewer.addPropertyLabels("atom"'),
    'Must eliminate legacy 3Dmol viewer.addPropertyLabels("atom") canvas texture freeze'
  );
  assert.ok(
    !source.includes('addPropertyLabels'),
    'Must completely eliminate addPropertyLabels to prevent WebGL context loss'
  );
});

test('ThreeDLabCanvas renders all action buttons, zoom controls, and pharmacophore chips', async () => {
  const mod = await import('../src/components/ThreeDLabCanvas.js');
  const { ThreeDLabCanvas } = mod;
  assert.strictEqual(typeof ThreeDLabCanvas, 'function', 'ThreeDLabCanvas must be a React component');

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

  // Toolbar toggles
  assert.ok(html.includes('Pocket Surface'), 'Must render "Pocket Surface" toggle button');
  assert.ok(
    html.includes('Pocket Sticks (5Å)') || html.includes('Binding Pocket (5Å)'),
    'Must render Pocket Sticks / Binding Pocket toggle button'
  );
  assert.ok(html.includes('Toggle Protein Ribbon'), 'Must render "Toggle Protein Ribbon" button');
  assert.ok(html.includes('Hydrogen Bonds'), 'Must render "Hydrogen Bonds" button');
  assert.ok(html.includes('Atom Labels'), 'Must render "Atom Labels" button');
  assert.ok(html.includes('Recenter Camera'), 'Must render "Recenter Camera" button');

  // Zoom controls
  assert.ok(html.includes('aria-label="Zoom in"'), 'Must render on-canvas Zoom in button');
  assert.ok(html.includes('aria-label="Zoom out"'), 'Must render on-canvas Zoom out button');

  // Pharmacophore chips toolbar
  assert.ok(
    html.includes('data-testid="pharmacophore-chips-toolbar"'),
    'Must render pharmacophore chips toolbar'
  );
  assert.ok(
    html.includes('o-Chlorophenyl Lipophilic Anchor'),
    'Must render o-Chlorophenyl pharmacophore chip for P2RY12'
  );
  assert.ok(
    html.includes('Reactive Thiol / Sulfonyl Pharmacophore'),
    'Must render Reactive Thiol pharmacophore chip for P2RY12'
  );

  // Active pharmacophore state
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
});
