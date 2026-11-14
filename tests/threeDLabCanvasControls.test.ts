// tests/threeDLabCanvasControls.test.ts
import assert from 'node:assert';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { resolveDrug3DEntry } from '../src/data/drug3dCatalog';

// ============================================================================
// Test Suite: 3D Canvas Scroll Dampener, mmCIF Selectors & Binding Site Controls
// ============================================================================

async function runTests() {
  const componentPath = 'src/components/ThreeDLabCanvas.tsx';
  assert.ok(fs.existsSync(componentPath), `Component file ${componentPath} must exist`);

  const fileContent = fs.readFileSync(componentPath, 'utf8');

  // 1. Drug-Centered + Backward-Compatible Props Contract
  assert.ok(
    fileContent.includes('drugEntry?: Drug3DCatalogEntry;'),
    'ThreeDLabCanvasProps must include drugEntry'
  );
  assert.ok(
    fileContent.includes('activeBindingSite?: DrugBindingSite | null;'),
    'ThreeDLabCanvasProps must include activeBindingSite'
  );
  assert.ok(
    fileContent.includes('onSelectBindingSite?: (site: DrugBindingSite | null) => void;'),
    'ThreeDLabCanvasProps must include onSelectBindingSite'
  );
  assert.ok(
    fileContent.includes('onSelectPocketResidue?: (residue: KeyPocketResidueContact | null) => void;'),
    'ThreeDLabCanvasProps must retain optional onSelectPocketResidue'
  );

  // 2. Scroll Zoom Dampening & Event Cleanup Contract
  assert.ok(
    fileContent.includes('capture: true') && fileContent.includes('passive: false'),
    'Container wheel listener must attach with { passive: false, capture: true }'
  );
  assert.ok(
    fileContent.includes('Math.sign(e.deltaY) * 0.04'),
    'Wheel zoom must be dampened using 0.04 factor'
  );
  assert.ok(
    fileContent.includes('e.preventDefault()'),
    'Wheel event handler must prevent default browser zoom'
  );
  assert.ok(
    fileContent.includes('removeEventListener'),
    'Must clean up wheel event listener on unmount'
  );

  // 3. Strict Dependency Array Contract (prevents infinite Mol* re-init loops)
  assert.ok(
    fileContent.includes('[cleanPdbId, preferredLigandCode, effectiveLigandMode, reloadTrigger]'),
    'Mol* initialization useEffect must depend strictly on [cleanPdbId, preferredLigandCode, effectiveLigandMode, reloadTrigger]'
  );

  // 4. Component Rendering with Active Binding Site
  const mod = await import('../src/components/ThreeDLabCanvas.js');
  const { ThreeDLabCanvas } = mod;
  const aspirin = resolveDrug3DEntry('Aspirin')!;

  const html = renderToString(
    React.createElement(ThreeDLabCanvas, {
      pdbId: aspirin.pdbId,
      preferredLigandCode: aspirin.ligandCode,
      drugEntry: aspirin,
      activeBindingSite: aspirin.bindingSites[0],
      isFullscreen: false,
      onToggleFullscreen: () => {},
      onOpenTutorial: () => {},
    })
  );

  assert.ok(html.includes('Reset View'), 'Must render "Reset View" button');
  assert.ok(html.includes('Protein Ribbon'), 'Must render "Protein Ribbon" toggle');
  assert.ok(html.includes('Sub-Pocket Colors'), 'Must render "Sub-Pocket Colors" toggle');
  assert.ok(html.includes('aria-label="Zoom in"'), 'Must render on-canvas Zoom in button');
  assert.ok(html.includes('aria-label="Zoom out"'), 'Must render on-canvas Zoom out button');

  console.log('✅ All tests passed in tests/threeDLabCanvasControls.test.ts');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
