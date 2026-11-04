const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('Testing SmilesCanvas.tsx bond stroke post-processing...');

const canvasPath = path.resolve(__dirname, '../src/components/SmilesCanvas.tsx');
const canvasSource = fs.readFileSync(canvasPath, 'utf8');

// 1. Verify SmilesCanvasProps has bondStrokeColor
assert(
  /bondStrokeColor\?:\s*string/.test(canvasSource),
  'SmilesCanvasProps must declare bondStrokeColor?: string'
);

// 2. Verify postProcessSvg uses bondStrokeColor / --structure-bond-stroke
assert(
  canvasSource.includes('--structure-bond-stroke'),
  'SmilesCanvas.tsx must reference --structure-bond-stroke CSS variable'
);

// 3. Extract and test postProcessSvg implementation against realistic RDKit SVG snippets
// Create a sandbox execution environment for postProcessSvg
const postProcessMatch = canvasSource.match(/function postProcessSvg\([\s\S]*?\n\}/);
assert(postProcessMatch, 'postProcessSvg function must be defined');

// Strip TypeScript types so Node can evaluate the pure JS logic
const jsFuncCode = postProcessMatch[0]
  .replace(/rawSvg:\s*string/g, 'rawSvg')
  .replace(/theme:\s*'light'\s*\|\s*'dark'\s*=\s*'light'/g, "theme = 'light'")
  .replace(/bondStrokeColor\?:\s*string/g, 'bondStrokeColor')
  .replace(/\):\s*string\s*\{/g, ') {');

const funcCode = `
  ${jsFuncCode}
  return postProcessSvg;
`;

const extractedFunc = new Function(funcCode)();

const mockSvgWithBondsAndAtoms = `
<svg version='1.1' baseProfile='full' xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
  <rect style='fill: #ffffff;' width='200' height='200' />
  <!-- Bond lines -->
  <path class='bond-0' d='M 10 10 L 50 50' style='fill:none;stroke:#000000;stroke-width:2.0px;' />
  <line x1='50' y1='50' x2='100' y2='50' stroke="#000000" stroke-width="2.0" />
  <!-- Oxygen heteroatom label -->
  <text x='110' y='55' style='font-size:14px;fill:#FF0101;stroke:#FF0101;'>O</text>
  <!-- Nitrogen heteroatom label -->
  <text x='10' y='55' style='font-size:14px;fill:#0000FF;'>N</text>
  <!-- Neutral carbon/hydrogen label -->
  <text x='50' y='30' style='font-size:14px;fill:#000000;'>CH3</text>
  <!-- Highlight circle -->
  <circle cx='50' cy='50' r='10' fill='rgba(37, 99, 235, 0.35)' />
</svg>
`;

// Test with explicit bondStrokeColor = '#a855f7' (purple)
const processedCustom = extractedFunc(mockSvgWithBondsAndAtoms, 'light', '#a855f7');

assert(
  processedCustom.includes('stroke: #a855f7') || processedCustom.includes('stroke="#a855f7"'),
  'Bond strokes must be replaced with the custom bond stroke color'
);
assert(
  processedCustom.includes('fill: #a855f7'),
  'Neutral carbon/hydrogen text fill must be replaced with custom bond stroke color'
);
assert(
  processedCustom.includes('#FF0101'),
  'Oxygen red heteroatom fill/stroke (#FF0101) must remain intact'
);
assert(
  processedCustom.includes('#0000FF'),
  'Nitrogen blue heteroatom fill (#0000FF) must remain intact'
);
assert(
  processedCustom.includes('rgba(37, 99, 235, 0.35)'),
  'Pharmacophore highlight overlay must remain intact'
);

// Test dark mode default fallback
const processedDarkDefault = extractedFunc(mockSvgWithBondsAndAtoms, 'dark');
assert(
  processedDarkDefault.includes('#e2e8f0'),
  'Dark mode without custom stroke must use default bond stroke #e2e8f0'
);

console.log('All SmilesCanvas bond stroke post-processing tests passed!');
