import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  ThreeDLabLibrary,
  filterTherapeuticClassGroups,
  toggleExpandedClass,
  selectDrugAndCollapse,
} from '../src/components/ThreeDLabLibrary';
import { THERAPEUTIC_CLASS_3D_GROUPS } from '../src/data/drug3dCatalog';

async function runTests() {
  // 1. Default mount: Clopidogrel active, ALL 1..39 classes rendered and collapsed (no <select> visible until expanded)
  const defaultHtml = renderToString(React.createElement(ThreeDLabLibrary, {}));
  assert.ok(defaultHtml.includes('Clopidogrel'), 'Defaults to Clopidogrel');
  assert.ok(defaultHtml.includes('1. Analgesic'), 'Renders Class 1 header');
  assert.ok(defaultHtml.includes('39. Thyroid Product'), 'Renders Class 39 header');
  assert.ok(!defaultHtml.includes('<select'), 'All 1..39 class dropdowns are collapsed by default on mount');
  assert.ok(defaultHtml.includes('All Binding Sites'), 'Right panel defaults to All Binding Sites overview');
  assert.ok(!defaultHtml.includes('ChEMBL') && !defaultHtml.includes('Custom PDB'), 'Removed ChEMBL sidebar and Custom PDB form');

  // 2. Expand/collapse & select-from-dropdown state transitions
  assert.equal(toggleExpandedClass(null, 1), 1, 'Clicking collapsed Class 1 expands it');
  assert.equal(toggleExpandedClass(1, 1), null, 'Clicking expanded Class 1 collapses it');
  assert.equal(toggleExpandedClass(1, 13), 13, 'Clicking Class 13 switches expansion to Class 13');

  const afterSelect = selectDrugAndCollapse('aspirin');
  assert.equal(afterSelect.selectedDrugId, 'aspirin');
  assert.equal(afterSelect.expandedClassNumber, null, 'Selecting a drug collapses the class row');
  assert.equal(afterSelect.activeBindingSiteId, null, 'Selecting a drug resets activeBindingSiteId to All Sites');

  // 3. Review Focus: Search filtering narrows classes/drugs without breaking selection
  const aspirinFiltered = filterTherapeuticClassGroups(THERAPEUTIC_CLASS_3D_GROUPS, 'aspirin');
  assert.equal(aspirinFiltered.length, 1);
  assert.equal(aspirinFiltered[0].classNumber, 1);
  assert.ok(aspirinFiltered[0].drugs.some((d) => d.genericName === 'Aspirin'));

  // Also test filtering by class name / number
  const thyroidFiltered = filterTherapeuticClassGroups(THERAPEUTIC_CLASS_3D_GROUPS, '39');
  assert.ok(thyroidFiltered.some((g) => g.classNumber === 39), 'Filters by class number');

  // 4. Handoff via initialDrugName="Aspirin" renders Aspirin (1PTH), reaction explanation, and Ser530 binding site card
  const aspirinHtml = renderToString(
    React.createElement(ThreeDLabLibrary, { initialDrugName: 'Aspirin' })
  );
  assert.ok(aspirinHtml.includes('Aspirin') && aspirinHtml.includes('1PTH'), 'Renders Aspirin 1PTH complex');
  assert.ok(aspirinHtml.includes('Ser530'), 'Renders Ser530 binding site card for Aspirin');

  // 5. Handoff for class-sibling drug (Losartan -> 4ZUD Olmesartan) explains shared pocket clearly
  const losartanHtml = renderToString(
    React.createElement(ThreeDLabLibrary, { initialDrugName: 'Losartan' })
  );
  assert.ok(losartanHtml.includes('Olmesartan') && losartanHtml.includes('4ZUD'), 'Explains reference crystal ligand for Losartan');

  // 6. PubChemInspectorModal & App.tsx wire resolveDrug3DEntry so newly cataloged drugs enable Open in 3D Lab
  const modalSource = fs.readFileSync('src/components/PubChemInspectorModal.tsx', 'utf8');
  const appSource = fs.readFileSync('src/App.tsx', 'utf8');
  assert.ok(modalSource.includes('resolveDrug3DEntry'), 'PubChemInspectorModal checks resolveDrug3DEntry');
  assert.ok(appSource.includes('resolveDrug3DEntry'), 'App.tsx handleOpenIn3DLab resolves via resolveDrug3DEntry');

  console.log('PASS: tests/threeDLabDrugStudio.test.ts');
}

runTests().catch((err) => {
  console.error('FAIL: tests/threeDLabDrugStudio.test.ts', err);
  process.exit(1);
});
