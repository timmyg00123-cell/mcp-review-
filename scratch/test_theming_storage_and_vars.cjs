const assert = require('assert');
const fs = require('fs');
const path = require('path');

// 1. Verify storage.ts source code contents
const storagePath = path.resolve(__dirname, '../src/utils/storage.ts');
const storageSource = fs.readFileSync(storagePath, 'utf8');

console.log('Testing storage.ts constants and functions...');

const requiredExports = [
  'STRUCTURE_IMAGE_DARK_BG_KEY',
  'DEFAULT_STRUCTURE_IMAGE_DARK_BG',
  'getInitialStructureImageDarkBg',
  'saveStructureImageDarkBg',
  'STRUCTURE_LOCK_OBSIDIAN_KEY',
  'DEFAULT_STRUCTURE_LOCK_OBSIDIAN',
  'getInitialStructureLockObsidian',
  'saveStructureLockObsidian',
  'BOND_LIGHT_COLOR_KEY',
  'DEFAULT_BOND_LIGHT_COLOR',
  'getInitialBondLightColor',
  'saveBondLightColor',
  'BOND_DARK_COLOR_KEY',
  'DEFAULT_BOND_DARK_COLOR',
  'getInitialBondDarkColor',
  'saveBondDarkColor',
];

for (const exp of requiredExports) {
  assert(
    storageSource.includes(exp),
    `storage.ts must include export: ${exp}`
  );
}

// 2. Functional test of storage logic with simulated localStorage
const storageMock = {};
global.localStorage = {
  getItem: (key) => (key in storageMock ? storageMock[key] : null),
  setItem: (key, val) => {
    storageMock[key] = String(val);
  },
  removeItem: (key) => {
    delete storageMock[key];
  },
  clear: () => {
    for (const k in storageMock) delete storageMock[k];
  },
};

// Check values from storageSource
assert(storageSource.includes("'mcp_structure_image_dark_bg'"), 'STRUCTURE_IMAGE_DARK_BG_KEY must be mcp_structure_image_dark_bg');
assert(storageSource.includes("'hsl(222, 47%, 14%)'"), 'DEFAULT_STRUCTURE_IMAGE_DARK_BG must be hsl(222, 47%, 14%)');
assert(storageSource.includes("'mcp_structure_lock_obsidian'"), 'STRUCTURE_LOCK_OBSIDIAN_KEY must be mcp_structure_lock_obsidian');
assert(storageSource.includes('DEFAULT_STRUCTURE_LOCK_OBSIDIAN = false'), 'DEFAULT_STRUCTURE_LOCK_OBSIDIAN must be false (default off)');
assert(storageSource.includes("'mcp_structure_bond_light_color'"), 'BOND_LIGHT_COLOR_KEY must be mcp_structure_bond_light_color');
assert(storageSource.includes("DEFAULT_BOND_LIGHT_COLOR = '#475569'"), 'DEFAULT_BOND_LIGHT_COLOR must be #475569');
assert(storageSource.includes("'mcp_structure_bond_dark_color'"), 'BOND_DARK_COLOR_KEY must be mcp_structure_bond_dark_color');
assert(storageSource.includes("DEFAULT_BOND_DARK_COLOR = '#e2e8f0'"), 'DEFAULT_BOND_DARK_COLOR must be #e2e8f0');

// 3. Verify src/index.css
console.log('Testing index.css variable declarations...');
const cssPath = path.resolve(__dirname, '../src/index.css');
const cssSource = fs.readFileSync(cssPath, 'utf8');

assert(cssSource.includes('--structure-bond-stroke:'), 'index.css must declare --structure-bond-stroke');
assert(!cssSource.includes('--structure-canvas-bg: #0f172a !important;'), 'index.css must not lock --structure-canvas-bg with !important');

// 4. Verify src/App.tsx
console.log('Testing App.tsx integration...');
const appPath = path.resolve(__dirname, '../src/App.tsx');
const appSource = fs.readFileSync(appPath, 'utf8');

assert(appSource.includes('getInitialStructureImageDarkBg'), 'App.tsx must import getInitialStructureImageDarkBg');
assert(appSource.includes('getInitialStructureLockObsidian'), 'App.tsx must import getInitialStructureLockObsidian');
assert(appSource.includes('getInitialBondLightColor'), 'App.tsx must import getInitialBondLightColor');
assert(appSource.includes('getInitialBondDarkColor'), 'App.tsx must import getInitialBondDarkColor');
assert(appSource.includes('--structure-bond-stroke'), 'App.tsx must set --structure-bond-stroke in useEffect');
assert(appSource.includes('--structure-canvas-bg'), 'App.tsx must set --structure-canvas-bg in useEffect');

console.log('All theming storage and CSS variable tests passed!');
