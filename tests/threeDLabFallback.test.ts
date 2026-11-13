// tests/threeDLabFallback.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';

const componentPath = 'src/components/ThreeDLabCanvas.tsx';

test('ThreeDLabCanvas source code integrates TwoDPocketFallbackView and browser diagnostic instructions', () => {
  assert.ok(fs.existsSync(componentPath), `Component file ${componentPath} must exist`);
  const source = fs.readFileSync(componentPath, 'utf-8');

  // Verify TwoDPocketFallbackView import
  assert.ok(
    source.includes('TwoDPocketFallbackView'),
    'Must import TwoDPocketFallbackView in ThreeDLabCanvas'
  );

  // Verify is2DFallbackActive state
  assert.ok(
    source.includes('is2DFallbackActive') && source.includes('setIs2DFallbackActive'),
    'Must declare is2DFallbackActive state in ThreeDLabCanvas'
  );

  // Verify browser recovery diagnostic steps
  assert.ok(
    source.includes('chrome://settings/system'),
    'Must include chrome://settings/system in browser diagnostic instructions'
  );
  assert.ok(
    source.includes('Use graphics acceleration when available'),
    'Must reference "Use graphics acceleration when available" toggle setting'
  );

  // Verify error overlay actions
  assert.ok(
    source.includes('Switch to 2D Pocket Schematic'),
    'Must include "Switch to 2D Pocket Schematic" action in error state'
  );
  assert.ok(
    source.includes('Retry 3D WebGL'),
    'Must include "Retry 3D WebGL" action in error state'
  );

  // Verify toolbar mode toggle button text
  assert.ok(
    source.includes('2D Pocket View'),
    'Must include "2D Pocket View" button in 3D toolbar'
  );
  assert.ok(
    source.includes('Switch to 3D Mol*'),
    'Must include "Switch to 3D Mol*" button when in 2D mode'
  );
});

test('ThreeDLabCanvas exports cleanly and satisfies component contract', async () => {
  const mod = await import('../src/components/ThreeDLabCanvas.js');
  const { ThreeDLabCanvas } = mod;
  assert.strictEqual(typeof ThreeDLabCanvas, 'function', 'ThreeDLabCanvas must be a React component');
});

test('ThreeDLabCanvas renders toolbar toggle button "2D Pocket View" in default 3D mode', async () => {
  const mod = await import('../src/components/ThreeDLabCanvas.js');
  const { ThreeDLabCanvas } = mod;

  const defaultProps = {
    pdbId: '4NTJ',
    targetName: 'P2Y12 Receptor',
    geneSymbol: 'P2RY12',
    isFullscreen: false,
    onToggleFullscreen: () => {},
    onOpenTutorial: () => {},
  };

  const html = renderToString(React.createElement(ThreeDLabCanvas, defaultProps));

  // Must render 2D Pocket View button with descriptive tooltip
  assert.ok(
    html.includes('2D Pocket View'),
    'Must render "2D Pocket View" button in 3D toolbar'
  );
  assert.ok(
    html.includes('Switch to 2D Binding Pocket Schematic'),
    'Must provide "Switch to 2D Binding Pocket Schematic" tooltip'
  );

  // Should NOT render 2D pocket mode badge when in 3D mode
  assert.ok(
    !html.includes('2D Pocket &amp; SAR Schematic') && !html.includes('2D Pocket & SAR Schematic'),
    'Must not render 2D fallback view when is2DFallbackActive is false'
  );
});

test('ThreeDLabCanvas renders upgraded WebGL diagnostic card & recovery actions in error state', async () => {
  const mod = await import('../src/components/ThreeDLabCanvas.js');
  const { ThreeDLabCanvas } = mod;

  const errorProps = {
    pdbId: '4NTJ',
    targetName: 'P2Y12 Receptor',
    geneSymbol: 'P2RY12',
    isFullscreen: false,
    onToggleFullscreen: () => {},
    onOpenTutorial: () => {},
    initialLoadError: 'WebGL is not supported or graphics acceleration is disabled in your current browser environment.',
  };

  const html = renderToString(React.createElement(ThreeDLabCanvas, errorProps));

  // Diagnostic header and message
  assert.ok(
    html.includes('Unable to load 3D structure for 4NTJ'),
    'Must render error header for PDB ID'
  );
  assert.ok(
    html.includes('WebGL is not supported or graphics acceleration is disabled in your current browser environment.'),
    'Must explain WebGL limitation in error message'
  );

  // Browser diagnostic steps
  assert.ok(
    html.includes('chrome://settings/system'),
    'Must provide chrome://settings/system navigation step'
  );
  assert.ok(
    html.includes('Use graphics acceleration when available'),
    'Must provide "Use graphics acceleration when available" toggle step'
  );

  // Action buttons
  assert.ok(
    html.includes('Switch to 2D Pocket Schematic'),
    'Must provide "Switch to 2D Pocket Schematic" button in error state'
  );
  assert.ok(
    html.includes('Retry 3D WebGL'),
    'Must provide "Retry 3D WebGL" button'
  );
  assert.ok(
    html.includes('https://www.rcsb.org/structure/4NTJ'),
    'Must provide RCSB portal link'
  );
});

test('ThreeDLabCanvas renders TwoDPocketFallbackView when 2D fallback mode is active', async () => {
  const mod = await import('../src/components/ThreeDLabCanvas.js');
  const { ThreeDLabCanvas } = mod;

  const fallbackProps = {
    pdbId: '4NTJ',
    targetName: 'P2Y12 Receptor',
    geneSymbol: 'P2RY12',
    isFullscreen: false,
    onToggleFullscreen: () => {},
    onOpenTutorial: () => {},
    initial2DFallback: true,
  };

  const html = renderToString(React.createElement(ThreeDLabCanvas, fallbackProps));

  // Must render TwoDPocketFallbackView contents
  assert.ok(
    html.includes('2D Pocket &amp; SAR Schematic') || html.includes('2D Pocket & SAR Schematic'),
    'Must render 2D Pocket & SAR Schematic badge when fallback mode is active'
  );
  assert.ok(
    html.includes('P2RY12'),
    'Must pass geneSymbol to TwoDPocketFallbackView'
  );
  assert.ok(
    html.includes('Try 3D View Again'),
    'Must render "Try 3D View Again" action inside TwoDPocketFallbackView'
  );

  // Toolbar button should now allow switching back to 3D
  assert.ok(
    html.includes('Switch to 3D Mol*'),
    'Must render "Switch to 3D Mol*" button in toolbar when 2D mode is active'
  );
});
