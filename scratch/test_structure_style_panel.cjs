const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('Testing StructureStylePanel.tsx component...');

const panelPath = path.resolve(__dirname, '../src/components/StructureStylePanel.tsx');

// Check that the file exists
assert(fs.existsSync(panelPath), 'StructureStylePanel.tsx must exist');

const source = fs.readFileSync(panelPath, 'utf8');

// 1. Verify export
assert(
  source.includes('export const StructureStylePanel') || source.includes('export function StructureStylePanel'),
  'Must export StructureStylePanel component'
);

// 2. Verify StructureStylePanelProps
const expectedProps = [
  'theme',
  'structureImageBg',
  'onUpdateStructureImageBg',
  'structureImageDarkBg',
  'onUpdateStructureImageDarkBg',
  'lockObsidian',
  'onToggleLockObsidian',
  'bondLightColor',
  'onUpdateBondLightColor',
  'bondDarkColor',
  'onUpdateBondDarkColor',
];

for (const prop of expectedProps) {
  assert(
    source.includes(prop),
    `StructureStylePanelProps must declare prop: ${prop}`
  );
}

// 3. Verify mode tabs
assert(source.includes('Light Mode') && source.includes('Dark Mode'), 'Must render Light Mode and Dark Mode tabs');

// 4. Verify Saturation slider
assert(
  /type=["']range["']/.test(source) && source.includes('min="0"') && source.includes('max="100"'),
  'Must include 0% to 100% saturation range slider'
);

// 5. Verify Obsidian lock toggle
assert(
  source.includes('lockObsidian') && (source.includes('obsidian') || source.includes('Obsidian')),
  'Must include Obsidian lock toggle'
);

// 6. Verify Live SmilesCanvas preview
assert(
  source.includes('SmilesCanvas') && source.includes('CC(=O)Oc1ccccc1C(=O)O'),
  'Must render live preview using SmilesCanvas with Aspirin SMILES'
);

// 7. Verify presets for both modes
assert(source.includes('hsl(286, 55%, 94%)'), 'Must include light background default preset');
assert(source.includes('hsl(222, 47%, 14%)'), 'Must include dark background default preset');
assert(source.includes('#475569'), 'Must include light bond stroke default preset');
assert(source.includes('#e2e8f0'), 'Must include dark bond stroke default preset');

console.log('All StructureStylePanel tests passed!');
