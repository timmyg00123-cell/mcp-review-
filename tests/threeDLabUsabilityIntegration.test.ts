import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ThreeDLabLibrary } from '../src/components/ThreeDLabLibrary';
import { ThreeDLabCanvas, type ThreeDLabCanvasProps } from '../src/components/ThreeDLabCanvas';
import { ThreeDLabTutorialModal, type ThreeDLabTutorialModalProps } from '../src/components/ThreeDLabTutorialModal';
import { resolveDrug3DEntry } from '../src/data/drug3dCatalog';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Running 3D Lab Usability & Drug Studio Layout Test Suite ---');

async function runTests() {
  const rootDir = path.resolve(__dirname, '..');
  const appPath = path.join(rootDir, 'src', 'App.tsx');
  const threeDLabLibraryPath = path.join(rootDir, 'src', 'components', 'ThreeDLabLibrary.tsx');

  const appSource = fs.readFileSync(appPath, 'utf8');
  const threeDLabLibrarySource = fs.readFileSync(threeDLabLibraryPath, 'utf8');

  // 1. Verify App.tsx unconstrained container class
  assert.ok(
    appSource.includes('max-w-[1920px]'),
    'App.tsx should contain max-w-[1920px] for the expanded 3d-lab tab container'
  );
  assert.ok(
    appSource.includes('w-full min-h-[calc(100vh-4rem)] p-2 sm:p-4 max-w-[1920px] mx-auto'),
    'App.tsx should contain the expanded edge-to-edge container styling'
  );

  // 2. Verify ThreeDLabLibrary imports and uses ThreeDLabCanvas & ThreeDLabTutorialModal
  assert.ok(
    threeDLabLibrarySource.includes('ThreeDLabCanvas'),
    'ThreeDLabLibrary must import and render ThreeDLabCanvas'
  );
  assert.ok(
    threeDLabLibrarySource.includes('ThreeDLabTutorialModal'),
    'ThreeDLabLibrary must import and render ThreeDLabTutorialModal'
  );
  assert.ok(
    !threeDLabLibrarySource.includes('<iframe'),
    'ThreeDLabLibrary must use ThreeDLabCanvas rather than a legacy iframe'
  );

  // 3. Verify ThreeDLabLibrary full-screen container & Escape key handling
  assert.ok(
    threeDLabLibrarySource.includes('fixed inset-0 z-50 bg-slate-950 w-screen h-screen overflow-hidden flex flex-col'),
    'ThreeDLabLibrary should contain fixed inset-0 z-50 full-screen container class'
  );
  assert.ok(
    threeDLabLibrarySource.includes("e.key === 'Escape'"),
    'ThreeDLabLibrary must handle the Escape key to close drawers / exit full-screen mode'
  );

  // 4. Verify slide-out drawers in full-screen mode (Drugs 1-39 & Binding & Mechanism)
  assert.ok(
    threeDLabLibrarySource.includes('Drugs (1–39)'),
    'ThreeDLabLibrary should have a Drugs (1–39) fullscreen drawer trigger'
  );
  assert.ok(
    threeDLabLibrarySource.includes('Binding &amp; Mechanism') ||
      threeDLabLibrarySource.includes('Binding & Mechanism'),
    'ThreeDLabLibrary should have a Binding & Mechanism fullscreen drawer trigger'
  );

  // 5. Verify collapsible sidebar toggling & 3-column grid spans (3 + 5 + 4 = 12)
  assert.ok(
    threeDLabLibrarySource.includes('isLeftCollapsed') &&
      threeDLabLibrarySource.includes('isRightCollapsed'),
    'ThreeDLabLibrary must support collapsing both left and right panels'
  );
  assert.ok(
    threeDLabLibrarySource.includes('lg:col-span-5') &&
      threeDLabLibrarySource.includes('lg:col-span-8') &&
      threeDLabLibrarySource.includes('lg:col-span-9') &&
      threeDLabLibrarySource.includes('lg:col-span-12'),
    'Center viewport must dynamically span 5, 8, 9, or 12 columns'
  );

  // 6. Verify component signatures and props contracts
  assert.strictEqual(typeof ThreeDLabLibrary, 'function');
  assert.strictEqual(typeof ThreeDLabCanvas, 'function');
  assert.strictEqual(typeof ThreeDLabTutorialModal, 'function');

  const atorva = resolveDrug3DEntry('Atorvastatin')!;
  const canvasProps: ThreeDLabCanvasProps = {
    pdbId: atorva.pdbId,
    preferredLigandCode: atorva.ligandCode,
    drugEntry: atorva,
    isFullscreen: false,
    onToggleFullscreen: () => {},
    onOpenTutorial: () => {},
  };
  assert.strictEqual(canvasProps.pdbId, '1HWK');

  const tutorialProps: ThreeDLabTutorialModalProps = {
    isOpen: true,
    onClose: () => {},
  };
  assert.strictEqual(tutorialProps.isOpen, true);

  console.log('✅ All 3D Lab Usability integration tests passed successfully!');
}

runTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
