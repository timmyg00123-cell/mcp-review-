import assert from 'node:assert';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ThreeDLabCanvas, MOLSTAR_THEME_COLORS } from '../src/components/ThreeDLabCanvas';

async function runTests() {
  console.log('--- Running Single-Ligand & Multi-Pocket 3D Lab Test Suite ---');
  const source = fs.readFileSync('src/components/ThreeDLabCanvas.tsx', 'utf8');

  // 1. Verify global hetero/clutter suppression
  assert.ok(
    source.includes('het: false'),
    'Must set het: false in viewer.visual.visibility to hide crystal lipids/buffers and duplicate chain ligands'
  );
  assert.ok(
    source.includes("hideStructure: ['het', 'water', 'carbs', 'nonStandard']"),
    'Must configure hideStructure in molstarOptions to suppress default HETATM clutter'
  );

  // 2. Verify true CPK heteroatom preservation via color: null and type_symbol: 'C'
  assert.ok(
    source.includes('color: null'),
    'Must pass color: null on base ball-and-stick representations so N, O, S, Halogens keep native CPK element colors'
  );
  assert.ok(
    source.includes("type_symbol: 'C'"),
    "Must use type_symbol: 'C' for carbon-only overpainting"
  );

  // 3. Verify muted translucent protein ribbon backdrop
  assert.ok(
    (MOLSTAR_THEME_COLORS as any).slateRibbon,
    'MOLSTAR_THEME_COLORS must define slateRibbon for muted receptor cartoon backdrop'
  );
  assert.ok(
    source.includes('nonSelectedColor') && source.includes('nonSelectedOpacity'),
    'Must configure nonSelectedColor and nonSelectedOpacity in viewer.visual.select'
  );

  // 4. Verify live 3D non-covalent interactions via interactivityFocus and 3D tooltips
  assert.ok(
    source.includes('interactivityFocus'),
    'Must invoke viewer.visual.interactivityFocus on the single ligand instance to display 5Å pocket contacts and 3D interaction lines'
  );
  assert.ok(
    source.includes('viewer.visual.tooltips') || source.includes('viewer.visual?.tooltips'),
    'Must attach custom 3D tooltips for sub-pocket residues and ligand'
  );

  // 5. Verify Sub-Pocket Zones toggle button in rendered toolbar
  const html = renderToString(
    React.createElement(ThreeDLabCanvas, {
      pdbId: '1O86',
      targetName: 'Angiotensin-Converting Enzyme',
      geneSymbol: 'ACE',
      isFullscreen: false,
      onToggleFullscreen: () => {},
      onOpenTutorial: () => {},
    })
  );

  assert.ok(
    html.includes('Sub-Pocket Zones'),
    'Toolbar must render "Sub-Pocket Zones" color-matching toggle button'
  );

  console.log('✅ All tests passed in tests/threeDLabSingleLigandPocket.test.ts');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
