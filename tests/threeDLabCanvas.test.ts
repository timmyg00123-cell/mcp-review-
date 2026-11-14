// tests/threeDLabCanvas.test.ts
import assert from 'node:assert';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { resolveDrug3DEntry } from '../src/data/drug3dCatalog';

// ============================================================================
// Test Suite: 3D Lab Canvas Engine & Simplified Drug Studio Controls
// ============================================================================

async function runTests() {
  const componentPath = 'src/components/ThreeDLabCanvas.tsx';
  assert.ok(fs.existsSync(componentPath), `Component file ${componentPath} must exist`);

  const fileContent = fs.readFileSync(componentPath, 'utf8');

  // 1. Component & Interface Export Verification
  assert.ok(
    fileContent.includes('export interface ThreeDLabCanvasProps'),
    'Must export ThreeDLabCanvasProps interface'
  );
  assert.ok(
    fileContent.includes('export const ThreeDLabCanvas'),
    'Must export ThreeDLabCanvas component'
  );
  assert.ok(fileContent.includes('pdbId: string;'), 'ThreeDLabCanvasProps must require pdbId: string');
  assert.ok(fileContent.includes('preferredLigandCode?: string;'), 'ThreeDLabCanvasProps must support optional preferredLigandCode');
  assert.ok(fileContent.includes('drugEntry?: Drug3DCatalogEntry;'), 'ThreeDLabCanvasProps must support optional drugEntry');
  assert.ok(fileContent.includes('activeBindingSite?: DrugBindingSite | null;'), 'ThreeDLabCanvasProps must support activeBindingSite');
  assert.ok(fileContent.includes('onSelectBindingSite?: (site: DrugBindingSite | null) => void;'), 'ThreeDLabCanvasProps must support onSelectBindingSite');
  assert.ok(fileContent.includes('isFullscreen: boolean;'), 'ThreeDLabCanvasProps must require isFullscreen: boolean');
  assert.ok(fileContent.includes('onToggleFullscreen: () => void;'), 'ThreeDLabCanvasProps must require onToggleFullscreen callback');
  assert.ok(fileContent.includes('onOpenTutorial: () => void;'), 'ThreeDLabCanvasProps must require onOpenTutorial callback');

  // 2. Dynamic Import & Component Rendering
  const mod = await import('../src/components/ThreeDLabCanvas.js');
  const { ThreeDLabCanvas } = mod;
  assert.strictEqual(typeof ThreeDLabCanvas, 'function', 'ThreeDLabCanvas must be a React function component');

  const clopidogrel = resolveDrug3DEntry('Clopidogrel')!;
  const defaultProps = {
    pdbId: clopidogrel.pdbId,
    preferredLigandCode: clopidogrel.ligandCode,
    drugEntry: clopidogrel,
    targetName: clopidogrel.targetName,
    geneSymbol: clopidogrel.geneSymbol,
    isFullscreen: false,
    onToggleFullscreen: () => {},
    onOpenTutorial: () => {},
  };

  const html = renderToString(React.createElement(ThreeDLabCanvas, defaultProps));
  assert.ok(html.length > 0, 'ThreeDLabCanvas must render HTML content');

  // 3. Simplified 5-Action Drug Studio Controls
  assert.ok(html.includes('Reset View'), 'Must render "Reset View" button');
  assert.ok(html.includes('Protein Ribbon'), 'Must render "Protein Ribbon" toggle button');
  assert.ok(html.includes('Sub-Pocket Colors'), 'Must render "Sub-Pocket Colors" toggle button');
  assert.ok(html.includes('Guide'), 'Must render "Guide" trigger button');
  assert.ok(html.includes('Full Screen'), 'Must display "Full Screen" label when isFullscreen is false');

  const fullscreenHtml = renderToString(
    React.createElement(ThreeDLabCanvas, { ...defaultProps, isFullscreen: true })
  );
  assert.ok(
    fullscreenHtml.includes('Exit Full Screen'),
    'Must display "Exit Full Screen" label when isFullscreen is true'
  );

  // 4. Drug Identity & Safe External Links
  assert.ok(html.includes('Clopidogrel'), 'Must display active drug name');
  assert.ok(html.includes('4NTJ'), 'Must display the PDB ID in crystal badge');
  assert.ok(html.includes('P2RY12'), 'Must display gene symbol');
  assert.ok(
    html.includes('https://www.rcsb.org/structure/4NTJ'),
    'Must include RCSB structure link'
  );
  assert.ok(
    html.includes('target="_blank"') && html.includes('rel="noopener noreferrer"'),
    'External links must have target="_blank" and rel="noopener noreferrer"'
  );

  // 5. Mouse Navigation Tips Bar
  assert.ok(html.includes('Rotate: Left-drag'), 'Tips bar must describe rotation');
  assert.ok(html.includes('Pan: Right-drag'), 'Tips bar must describe panning');
  assert.ok(html.includes('Zoom: Scroll'), 'Tips bar must describe zooming');
  assert.ok(html.includes('Recenter: Click atom'), 'Tips bar must describe recentering');

  // 6. Mol* WebGL Engine Script Loading, Structure Service & Ligand Config
  assert.ok(
    fileContent.includes('loadMolstarPluginScript'),
    'Must dynamically load Mol* plugin via loader'
  );
  assert.ok(
    fileContent.includes('PDBeMolstarPlugin'),
    'Must reference window.PDBeMolstarPlugin'
  );
  assert.ok(
    fileContent.includes('fetchPdbCoordinates') && fileContent.includes('identifyLigandResidue'),
    'Must import and call fetchPdbCoordinates and identifyLigandResidue from structure3dService'
  );
  assert.ok(
    fileContent.includes('cyanCarbon'),
    'Must configure ligand sticks with high-contrast cyanCarbon colorscheme'
  );
  assert.ok(
    fileContent.includes('Apo Protein (No bound ligand)'),
    'Must retain Apo Protein badge fallback when rendered without a catalog drug entry and no ligand'
  );

  console.log('✅ All tests passed in tests/threeDLabCanvas.test.ts');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
