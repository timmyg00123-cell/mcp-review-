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

  assert.ok(
    source.includes('TwoDPocketFallbackView'),
    'Must import TwoDPocketFallbackView in ThreeDLabCanvas'
  );
  assert.ok(
    source.includes('is2DFallbackActive') && source.includes('setIs2DFallbackActive'),
    'Must declare is2DFallbackActive state in ThreeDLabCanvas'
  );
  assert.ok(
    source.includes('chrome://settings/system'),
    'Must include chrome://settings/system in browser diagnostic instructions'
  );
  assert.ok(
    source.includes('Use graphics acceleration when available'),
    'Must reference "Use graphics acceleration when available" toggle setting'
  );
  assert.ok(
    source.includes('Switch to 2D Pocket Schematic'),
    'Must include "Switch to 2D Pocket Schematic" action in error state'
  );
  assert.ok(
    source.includes('Retry 3D WebGL'),
    'Must include "Retry 3D WebGL" action in error state'
  );
  assert.ok(
    source.includes('Switch to 3D Mol*'),
    'Must include "Switch to 3D Mol*" button when in 2D mode'
  );
});

test('ThreeDLabCanvas omits legacy 2D Pocket View clutter button in normal 3D mode', async () => {
  const mod = await import('../src/components/ThreeDLabCanvas.js');
  const { ThreeDLabCanvas } = mod;

  const html = renderToString(
    React.createElement(ThreeDLabCanvas, {
      pdbId: '4NTJ',
      targetName: 'P2Y12 Receptor',
      geneSymbol: 'P2RY12',
      isFullscreen: false,
      onToggleFullscreen: () => {},
      onOpenTutorial: () => {},
    })
  );

  assert.ok(html.includes('Reset View'), 'Renders simplified 3D toolbar in default 3D mode');
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
    initialLoadError:
      'WebGL is not supported or graphics acceleration is disabled in your current browser environment.',
  };

  const html = renderToString(React.createElement(ThreeDLabCanvas, errorProps));

  assert.ok(
    html.includes('Unable to load 3D structure for 4NTJ'),
    'Must render error header for PDB ID'
  );
  assert.ok(
    html.includes(
      'WebGL is not supported or graphics acceleration is disabled in your current browser environment.'
    ),
    'Must explain WebGL limitation in error message'
  );
  assert.ok(
    html.includes('chrome://settings/system'),
    'Must provide chrome://settings/system navigation step'
  );
  assert.ok(
    html.includes('Use graphics acceleration when available'),
    'Must provide "Use graphics acceleration when available" toggle step'
  );
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

  assert.ok(
    html.includes('2D Pocket &amp; SAR Schematic') || html.includes('2D Pocket & SAR Schematic'),
    'Must render 2D Pocket & SAR Schematic badge when fallback mode is active'
  );
  assert.ok(html.includes('P2RY12'), 'Must pass geneSymbol to TwoDPocketFallbackView');
  assert.ok(
    html.includes('Try 3D View Again'),
    'Must render "Try 3D View Again" action inside TwoDPocketFallbackView'
  );
  assert.ok(
    html.includes('Switch to 3D Mol*'),
    'Must render "Switch to 3D Mol*" button in toolbar when 2D mode is active'
  );
});
