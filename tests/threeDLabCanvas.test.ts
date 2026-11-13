// tests/threeDLabCanvas.test.ts
import assert from 'node:assert';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';

// ============================================================================
// Test Suite: 3D Lab Canvas Engine & One-Click Scene Controls
// ============================================================================

async function runTests() {
  const componentPath = 'src/components/ThreeDLabCanvas.tsx';
  assert.ok(fs.existsSync(componentPath), `Component file ${componentPath} must exist`);

  const fileContent = fs.readFileSync(componentPath, 'utf8');

  // --------------------------------------------------------------------------
  // Test 1: Component & Interface Export Verification
  // --------------------------------------------------------------------------
  assert.ok(
    fileContent.includes('export interface ThreeDLabCanvasProps'),
    'Must export ThreeDLabCanvasProps interface'
  );
  assert.ok(
    fileContent.includes('export const ThreeDLabCanvas'),
    'Must export ThreeDLabCanvas component'
  );

  // Props contract verification
  assert.ok(fileContent.includes('pdbId: string;'), 'ThreeDLabCanvasProps must require pdbId: string');
  assert.ok(fileContent.includes('preferredLigandCode?: string;'), 'ThreeDLabCanvasProps must support optional preferredLigandCode');
  assert.ok(fileContent.includes('isFullscreen: boolean;'), 'ThreeDLabCanvasProps must require isFullscreen: boolean');
  assert.ok(fileContent.includes('onToggleFullscreen: () => void;'), 'ThreeDLabCanvasProps must require onToggleFullscreen callback');
  assert.ok(fileContent.includes('onOpenTutorial: () => void;'), 'ThreeDLabCanvasProps must require onOpenTutorial callback');
  assert.ok(fileContent.includes('targetName?: string;'), 'ThreeDLabCanvasProps must support optional targetName');
  assert.ok(fileContent.includes('geneSymbol?: string;'), 'ThreeDLabCanvasProps must support optional geneSymbol');

  // --------------------------------------------------------------------------
  // Test 2: Dynamic Import & Component Rendering
  // --------------------------------------------------------------------------
  const mod = await import('../src/components/ThreeDLabCanvas.js');
  const { ThreeDLabCanvas } = mod;
  assert.strictEqual(typeof ThreeDLabCanvas, 'function', 'ThreeDLabCanvas must be a React function component');

  const defaultProps = {
    pdbId: '4DEW',
    targetName: 'P2Y12 Receptor',
    geneSymbol: 'P2RY12',
    isFullscreen: false,
    onToggleFullscreen: () => {},
    onOpenTutorial: () => {},
  };

  const html = renderToString(React.createElement(ThreeDLabCanvas, defaultProps));
  assert.ok(html.length > 0, 'ThreeDLabCanvas must render HTML content');

  // --------------------------------------------------------------------------
  // Test 3: Header Scene Control Buttons
  // --------------------------------------------------------------------------
  assert.ok(html.includes('Isolate Ligand'), 'Must render "Isolate Ligand" button');
  assert.ok(html.includes('Binding Pocket (5Å)'), 'Must render "Binding Pocket (5Å)" button');
  assert.ok(html.includes('Toggle Protein Ribbon'), 'Must render "Toggle Protein Ribbon" button');
  assert.ok(html.includes('Hydrogen Bonds'), 'Must render "Hydrogen Bonds" button');
  assert.ok(html.includes('Recenter Camera'), 'Must render "Recenter Camera" button');

  // --------------------------------------------------------------------------
  // Test 4: Fullscreen Button and State Transitions
  // --------------------------------------------------------------------------
  assert.ok(
    html.includes('Full Screen'),
    'Must display "Full Screen" label/title when isFullscreen is false'
  );

  const fullscreenHtml = renderToString(
    React.createElement(ThreeDLabCanvas, { ...defaultProps, isFullscreen: true })
  );
  assert.ok(
    fullscreenHtml.includes('Exit Full Screen'),
    'Must display "Exit Full Screen" label/title when isFullscreen is true'
  );

  // --------------------------------------------------------------------------
  // Test 5: Tutorial & Guide Trigger Button
  // --------------------------------------------------------------------------
  assert.ok(
    html.includes('Tutorial &amp; Guide') || html.includes('Tutorial & Guide'),
    'Must render Tutorial & Guide button'
  );

  // --------------------------------------------------------------------------
  // Test 6: Structure Info & Safe External Links
  // --------------------------------------------------------------------------
  assert.ok(html.includes('4DEW'), 'Must display the PDB ID badge');
  assert.ok(html.includes('P2Y12 Receptor'), 'Must display target name');
  assert.ok(html.includes('P2RY12'), 'Must display gene symbol');

  // RCSB Link
  assert.ok(
    html.includes('https://www.rcsb.org/structure/4DEW'),
    'Must include RCSB structure link'
  );
  // CIF Download Link
  assert.ok(
    html.includes('https://files.rcsb.org/download/4DEW.cif'),
    'Must include CIF coordinate download link'
  );
  // Safe links verification
  assert.ok(
    html.includes('target="_blank"') && html.includes('rel="noopener noreferrer"'),
    'External links must have target="_blank" and rel="noopener noreferrer"'
  );

  // --------------------------------------------------------------------------
  // Test 7: Mouse Navigation Tips Bar
  // --------------------------------------------------------------------------
  assert.ok(html.includes('Rotate: Left-drag'), 'Tips bar must describe rotation');
  assert.ok(html.includes('Pan: Right-drag'), 'Tips bar must describe panning');
  assert.ok(html.includes('Zoom: Scroll'), 'Tips bar must describe zooming');
  assert.ok(html.includes('Recenter: Click atom'), 'Tips bar must describe recentering');

  // --------------------------------------------------------------------------
  // Test 8: Mol* WebGL Engine Script Loading & Binary mmCIF Streaming
  // --------------------------------------------------------------------------
  assert.ok(
    fileContent.includes('loadMolstarPluginScript') || fileContent.includes('loadMolstarBundle'),
    'Must dynamically load Mol* plugin via loader'
  );
  assert.ok(
    fileContent.includes('PDBeMolstarPlugin') || fileContent.includes('molstar'),
    'Must reference window.PDBeMolstarPlugin or molstar'
  );

  // --------------------------------------------------------------------------
  // Test 9: Structure Service Consumption
  // --------------------------------------------------------------------------
  assert.ok(
    fileContent.includes('fetchPdbCoordinates'),
    'Must import and call fetchPdbCoordinates from structure3dService'
  );
  assert.ok(
    fileContent.includes('identifyLigandResidue'),
    'Must import and call identifyLigandResidue from structure3dService'
  );

  // --------------------------------------------------------------------------
  // Test 10: Ligand-First Scene Configuration & Apo Fallback Logic
  // --------------------------------------------------------------------------
  assert.ok(
    fileContent.includes('cyanCarbon'),
    'Must configure ligand sticks with high-contrast cyanCarbon colorscheme'
  );
  assert.ok(
    fileContent.includes('Apo Protein (No bound ligand)'),
    'Must display "Apo Protein (No bound ligand)" badge when no ligand detected'
  );
  assert.ok(
    fileContent.includes('zoomTo'),
    'Must call zoomTo on ligand or structure'
  );

  console.log(' All tests passed in tests/threeDLabCanvas.test.ts');
}

runTests().catch((err) => {
  console.error(' Test failed:', err);
  process.exit(1);
});
