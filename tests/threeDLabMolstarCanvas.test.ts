// tests/threeDLabMolstarCanvas.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { resolveDrug3DEntry } from '../src/data/drug3dCatalog';

test('ThreeDLabCanvas source code eliminates 3Dmol addPropertyLabels freeze, disposes Mol* cleanly, and streams binary CIF', () => {
  const componentPath = 'src/components/ThreeDLabCanvas.tsx';
  assert.ok(fs.existsSync(componentPath), `Component file ${componentPath} must exist`);

  const source = fs.readFileSync(componentPath, 'utf-8');

  assert.ok(
    source.includes('loadMolstarPluginScript'),
    'Must import loadMolstarPluginScript from molstarLoader'
  );
  assert.ok(
    source.includes('getBinaryCifUrl'),
    'Must use getBinaryCifUrl for binary mmCIF streaming'
  );
  assert.ok(source.includes('bcif'), 'Must reference binary CIF (.bcif) coordinate format');
  assert.ok(source.includes('showRibbon'), 'Must track showRibbon state');
  assert.ok(source.includes('subPocketColorMode'), 'Must track subPocketColorMode state');
  assert.ok(
    !source.includes('addPropertyLabels'),
    'Must completely eliminate legacy 3Dmol addPropertyLabels to prevent WebGL context loss'
  );
});

test('ThreeDLabCanvas renders simplified Drug Studio action buttons and zoom controls without legacy clutter', async () => {
  const mod = await import('../src/components/ThreeDLabCanvas.js');
  const { ThreeDLabCanvas } = mod;
  assert.strictEqual(typeof ThreeDLabCanvas, 'function', 'ThreeDLabCanvas must be a React component');

  const clopidogrel = resolveDrug3DEntry('Clopidogrel')!;
  const html = renderToString(
    React.createElement(ThreeDLabCanvas, {
      pdbId: clopidogrel.pdbId,
      preferredLigandCode: clopidogrel.ligandCode,
      drugEntry: clopidogrel,
      isFullscreen: false,
      onToggleFullscreen: () => {},
      onOpenTutorial: () => {},
    })
  );

  assert.ok(html.includes('Reset View'), 'Must render "Reset View" action button');
  assert.ok(html.includes('Protein Ribbon'), 'Must render "Protein Ribbon" toggle button');
  assert.ok(html.includes('Sub-Pocket Colors'), 'Must render "Sub-Pocket Colors" toggle button');
  assert.ok(html.includes('aria-pressed="true"'), 'Default active toggles must expose aria-pressed="true"');
  assert.ok(html.includes('aria-label="Zoom in"'), 'Must render on-canvas Zoom in button');
  assert.ok(html.includes('aria-label="Zoom out"'), 'Must render on-canvas Zoom out button');

  assert.ok(!html.includes('Pocket Surface'), 'Must remove legacy Pocket Surface toggle clutter');
  assert.ok(!html.includes('Atom Labels'), 'Must remove legacy Atom Labels toggle clutter');
  assert.ok(!html.includes('data-testid="pharmacophore-chips-toolbar"'), 'Must remove bottom floating pharmacophore chip strip');
});
