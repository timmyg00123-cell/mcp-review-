const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('Testing review fixes: Critical 1, Critical 2, Important 1, Important 2, Important 3...');

// 1. Critical 1: No dark:bg-slate-900 overriding bg-[var(--structure-canvas-bg)]
const filesToCheck = [
  'src/App.tsx',
  'src/components/ChemicalStructureCard.tsx',
  'src/components/DocumentQuestionItem.tsx',
  'src/components/QuestionStructureSidePanel.tsx',
  'src/components/StructureComparator.tsx',
  'src/components/StructureLightboxModal.tsx',
];

for (const relPath of filesToCheck) {
  const filePath = path.resolve(__dirname, '..', relPath);
  const content = fs.readFileSync(filePath, 'utf8');
  assert(
    !content.includes('bg-[var(--structure-canvas-bg)] dark:bg-slate-900'),
    `${relPath} must NOT contain 'bg-[var(--structure-canvas-bg)] dark:bg-slate-900'`
  );
}
console.log('✓ Critical 1 test passed: no dark:bg-slate-900 overrides canvas background');

// 2. Critical 2 & Important 1: SmilesCanvas.tsx postProcessSvg
const smilesCanvasPath = path.resolve(__dirname, '../src/components/SmilesCanvas.tsx');
const smilesCanvasContent = fs.readFileSync(smilesCanvasPath, 'utf8');

assert(
  smilesCanvasContent.includes('var(--structure-bond-stroke'),
  'SmilesCanvas.tsx postProcessSvg must inject var(--structure-bond-stroke)'
);
assert(
  smilesCanvasContent.includes('stroke-linecap:round') && smilesCanvasContent.includes('stroke-linejoin:round'),
  'SmilesCanvas.tsx postProcessSvg must sanitize inline stroke-linecap and stroke-linejoin'
);

// Test SVG transformation directly
const fnMatch = smilesCanvasContent.match(/function postProcessSvg\([\s\S]*?\n\}/);
assert(fnMatch, 'postProcessSvg function must be found in SmilesCanvas.tsx');
let cleanedFn = fnMatch[0]
  .replace(/bondStrokeColor\?\s*:\s*string/g, 'bondStrokeColor')
  .replace(/:\s*'light'\s*\|\s*'dark'/g, '')
  .replace(/:\s*string/g, '');
const postProcessSvg = new Function(`${cleanedFn}; return postProcessSvg;`)();

const testSvg = `<svg><path class="bond-0" d="M10,10 L20,20" style="fill:none;stroke:#000000;stroke-linecap:butt;stroke-linejoin:miter" /></svg>`;
const outputNoProp = postProcessSvg(testSvg, 'light');
assert(
  outputNoProp.includes('var(--structure-bond-stroke'),
  `postProcessSvg without prop must use var(--structure-bond-stroke), got: ${outputNoProp}`
);
assert(
  outputNoProp.includes('stroke-linecap:round') && !outputNoProp.includes('stroke-linecap:butt'),
  `postProcessSvg must replace stroke-linecap:butt with round, got: ${outputNoProp}`
);
assert(
  outputNoProp.includes('stroke-linejoin:round') && !outputNoProp.includes('stroke-linejoin:miter'),
  `postProcessSvg must replace stroke-linejoin:miter with round, got: ${outputNoProp}`
);

const outputWithProp = postProcessSvg(testSvg, 'light', '#10b981');
assert(
  outputWithProp.includes('#10b981'),
  `postProcessSvg with prop must use custom stroke #10b981, got: ${outputWithProp}`
);
console.log('✓ Critical 2 & Important 1 tests passed');

// 3. Important 2 & Important 3: StructureStylePanel.tsx
const panelPath = path.resolve(__dirname, '../src/components/StructureStylePanel.tsx');
const panelContent = fs.readFileSync(panelPath, 'utf8');

assert(
  panelContent.includes('linear-gradient(to right, hsl(') && panelContent.includes('activeBondHsl.h'),
  'StructureStylePanel.tsx must apply dynamic linear-gradient on saturation slider using activeBondHsl.h'
);

assert(
  panelContent.includes('bondSaturation === 0') && panelContent.includes('setBondSaturation('),
  'StructureStylePanel.tsx must bump bondSaturation if it is currently 0 when clicking hue wheel'
);
console.log('✓ Important 2 & Important 3 tests passed');

console.log('\nAll review fixes verified successfully!');
