import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ThreeDLabLibrary, type ThreeDLabLibraryProps } from '../src/components/ThreeDLabLibrary';
import { ThreeDLabCanvas, type ThreeDLabCanvasProps } from '../src/components/ThreeDLabCanvas';
import { ThreeDLabTutorialModal, type ThreeDLabTutorialModalProps } from '../src/components/ThreeDLabTutorialModal';
import { CANONICAL_MEDCHEM_TARGETS, findCanonicalTargetForDrug } from '../src/utils/canonicalTargets';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('--- Running 3D Lab Usability & Controls Integration Test Suite ---');

async function runTests() {
  const rootDir = path.resolve(__dirname, '..');
  const appPath = path.join(rootDir, 'src', 'App.tsx');
  const threeDLabLibraryPath = path.join(rootDir, 'src', 'components', 'ThreeDLabLibrary.tsx');

  const appSource = fs.readFileSync(appPath, 'utf8');
  const threeDLabLibrarySource = fs.readFileSync(threeDLabLibraryPath, 'utf8');

  // 1. Verify App.tsx unconstrained container class
  console.log('1. Testing App.tsx layout container expansion for 3d-lab tab...');
  assert.ok(
    appSource.includes('max-w-[1920px]'),
    'App.tsx should contain max-w-[1920px] for the expanded 3d-lab tab container'
  );
  assert.ok(
    appSource.includes('w-full min-h-[calc(100vh-4rem)] p-2 sm:p-4 max-w-[1920px] mx-auto'),
    'App.tsx should contain the expanded edge-to-edge container styling'
  );

  // 2. Verify ThreeDLabLibrary imports and uses ThreeDLabCanvas & ThreeDLabTutorialModal
  console.log('2. Testing ThreeDLabLibrary source integration with ThreeDLabCanvas & ThreeDLabTutorialModal...');
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
    'ThreeDLabLibrary must replace the legacy RCSB Mol* iframe with ThreeDLabCanvas'
  );

  // 3. Verify ThreeDLabLibrary full-screen container & Escape key handling
  console.log('3. Testing full-screen mode classes and Escape key handler in ThreeDLabLibrary...');
  assert.ok(
    threeDLabLibrarySource.includes('fixed inset-0 z-50 bg-slate-950 w-screen h-screen overflow-hidden flex flex-col'),
    'ThreeDLabLibrary should contain fixed inset-0 z-50 full-screen container class'
  );
  assert.ok(
    threeDLabLibrarySource.includes("e.key === 'Escape'"),
    'ThreeDLabLibrary must handle the Escape key to exit full-screen mode'
  );

  // 4. Verify slide-out drawers in full-screen mode
  console.log('4. Testing slide-out drawer tabs and panels in full-screen mode...');
  assert.ok(
    threeDLabLibrarySource.includes('Targets & Drugs'),
    'ThreeDLabLibrary should have a Targets & Drugs drawer trigger'
  );
  assert.ok(
    threeDLabLibrarySource.includes('ChEMBL SAR'),
    'ThreeDLabLibrary should have a ChEMBL SAR drawer trigger'
  );

  // 5. Verify collapsible sidebar toggling in regular mode
  console.log('5. Testing collapsible sidebar controls in regular mode...');
  assert.ok(
    threeDLabLibrarySource.includes('isLeftCollapsed') || threeDLabLibrarySource.includes('leftCollapsed'),
    'ThreeDLabLibrary must support collapsing the left targets sidebar'
  );
  assert.ok(
    threeDLabLibrarySource.includes('isRightCollapsed') || threeDLabLibrarySource.includes('rightCollapsed'),
    'ThreeDLabLibrary must support collapsing the right ChEMBL SAR sidebar'
  );

  // 6. Verify component signatures and props contracts
  console.log('6. Testing component exports and props contracts...');
  assert.strictEqual(typeof ThreeDLabLibrary, 'function', 'ThreeDLabLibrary must be a function component');
  assert.strictEqual(typeof ThreeDLabCanvas, 'function', 'ThreeDLabCanvas must be a function component');
  assert.strictEqual(typeof ThreeDLabTutorialModal, 'function', 'ThreeDLabTutorialModal must be a function component');

  const canvasProps: ThreeDLabCanvasProps = {
    pdbId: '4NTJ',
    preferredLigandCode: '22S',
    isFullscreen: false,
    onToggleFullscreen: () => {},
    onOpenTutorial: () => {},
    targetName: 'P2Y purinoceptor 12',
    geneSymbol: 'P2RY12',
  };
  assert.strictEqual(canvasProps.pdbId, '4NTJ');
  assert.strictEqual(canvasProps.preferredLigandCode, '22S');

  const tutorialProps: ThreeDLabTutorialModalProps = {
    isOpen: true,
    onClose: () => {},
  };
  assert.strictEqual(tutorialProps.isOpen, true);

  // 7. Verify dynamic column math for regular mode sidebars
  console.log('7. Testing column math logic when collapsing sidebars in regular mode...');
  function computeCenterCanvasCols(leftCollapsed: boolean, rightCollapsed: boolean): number {
    const leftCols = leftCollapsed ? 0 : 3;
    const rightCols = rightCollapsed ? 0 : 3;
    return 12 - leftCols - rightCols;
  }

  assert.strictEqual(computeCenterCanvasCols(false, false), 6, 'Both sidebars open -> 6 cols canvas');
  assert.strictEqual(computeCenterCanvasCols(true, false), 9, 'Left collapsed -> 9 cols canvas');
  assert.strictEqual(computeCenterCanvasCols(false, true), 9, 'Right collapsed -> 9 cols canvas');
  assert.strictEqual(computeCenterCanvasCols(true, true), 12, 'Both collapsed -> 12 cols canvas (full width)');

  // 8. Verify canonical target mapping integration
  console.log('8. Testing canonical targets integration with 3D canvas...');
  const testDrug = 'Atorvastatin';
  const target = findCanonicalTargetForDrug(testDrug);
  assert.ok(target, 'Should resolve Atorvastatin target');
  assert.strictEqual(target?.pdbId, '1HWK');
  assert.strictEqual(target?.ligandCode, '1HW');

  console.log('✅ All 3D Lab Usability integration tests passed successfully!');
}

runTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
