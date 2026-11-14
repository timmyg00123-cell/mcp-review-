// tests/threeDLabPharmacophoreIntegration.test.ts
import assert from 'node:assert';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { resolveDrug3DEntry } from '../src/data/drug3dCatalog';
import { ThreeDLabLibrary } from '../src/components/ThreeDLabLibrary';

console.log('--- Running 3D Lab Binding-Site Walkthrough & Canvas Coordination Test Suite ---');

async function runTests() {
  const componentPath = 'src/components/ThreeDLabLibrary.tsx';
  assert.ok(fs.existsSync(componentPath), `Component file ${componentPath} must exist`);

  const fileContent = fs.readFileSync(componentPath, 'utf8');

  // 1. Verify Drug Catalog & Binding-Site Walkthrough Wiring
  assert.ok(
    fileContent.includes('THERAPEUTIC_CLASS_3D_GROUPS') &&
      fileContent.includes('resolveDrug3DEntry'),
    'ThreeDLabLibrary must consume THERAPEUTIC_CLASS_3D_GROUPS and resolveDrug3DEntry'
  );
  assert.ok(
    fileContent.includes('activeBindingSite={activeBindingSite}') &&
      fileContent.includes('onSelectBindingSite='),
    'ThreeDLabLibrary must wire activeBindingSite and onSelectBindingSite into ThreeDLabCanvas'
  );
  assert.ok(
    fileContent.includes('key={canvasKey}'),
    'ThreeDLabLibrary must key ThreeDLabCanvas by structure + ligand + mode for clean remounting'
  );

  // 2. Verify Escape Key Hierarchy in Fullscreen Mode
  assert.ok(
    fileContent.includes('isLeftDrawerOpen') &&
      fileContent.includes('isRightDrawerOpen') &&
      fileContent.includes('setIsFullscreen(false)'),
    'Escape key handler must close open left or right drawers before exiting fullscreen'
  );

  // 3. Verify Canvas Resize Synchronization
  assert.ok(
    fileContent.includes("window.dispatchEvent(new Event('resize'))") ||
      fileContent.includes('window.dispatchEvent(new Event("resize"))'),
    'ThreeDLabLibrary must dispatch window resize event upon sidebar/fullscreen layout changes'
  );

  const canvasContent = fs.readFileSync('src/components/ThreeDLabCanvas.tsx', 'utf8');
  assert.ok(
    canvasContent.includes('requestResize') && canvasContent.includes("addEventListener('resize'"),
    'ThreeDLabCanvas must listen for resize events and invoke requestResize'
  );

  // 4. Verify Drug Binding Sites & Mechanism SSR Rendering
  const clopidogrel = resolveDrug3DEntry('Clopidogrel')!;
  assert.ok(clopidogrel.bindingSites.length >= 2, 'Clopidogrel must define >= 2 binding sites');

  const html = renderToString(
    React.createElement(ThreeDLabLibrary, {
      initialDrugName: 'Clopidogrel',
      initialPdbId: '4NTJ',
    })
  );

  assert.ok(html.includes('3D Drug Binding Studio'), 'Renders studio title');
  assert.ok(html.includes('Clopidogrel'), 'Renders initial drug name');
  assert.ok(html.includes('4NTJ'), 'Renders initial PDB ID');
  assert.ok(html.includes('All Binding Sites (Full Pocket)'), 'Renders full-pocket overview card');
  for (const site of clopidogrel.bindingSites) {
    const escapedName = site.siteName.replace(/&/g, '&amp;');
    assert.ok(
      html.includes(site.siteName) || html.includes(escapedName),
      `Renders binding site card: ${site.siteName}`
    );
  }

  // 5. Verify Fullscreen Mode SSR Rendering
  const fsHtml = renderToString(
    React.createElement(ThreeDLabLibrary, {
      initialDrugName: 'Aspirin',
      initialFullscreen: true,
    })
  );
  assert.ok(fsHtml.includes('Drugs (1–39)'), 'Fullscreen renders Drugs (1–39) drawer button');
  assert.ok(
    fsHtml.includes('Binding &amp; Mechanism') || fsHtml.includes('Binding & Mechanism'),
    'Fullscreen renders Binding & Mechanism drawer button'
  );

  console.log('✅ All 3D Lab Binding-Site Walkthrough & Canvas Coordination tests passed!');
}

runTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
