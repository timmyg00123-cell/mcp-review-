const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('Testing SettingsModal and App.tsx structure styling wiring (E2E)...');

// 1. Check SettingsModal.tsx
const settingsModalPath = path.resolve(__dirname, '../src/components/SettingsModal.tsx');
const settingsModalSource = fs.readFileSync(settingsModalPath, 'utf8');

assert(
  settingsModalSource.includes("from './StructureStylePanel'") ||
    settingsModalSource.includes('from "./StructureStylePanel"'),
  'SettingsModal.tsx must import StructureStylePanel'
);

const expectedModalProps = [
  'structureImageDarkBg',
  'onUpdateStructureImageDarkBg',
  'lockObsidian',
  'onToggleLockObsidian',
  'bondLightColor',
  'onUpdateBondLightColor',
  'bondDarkColor',
  'onUpdateBondDarkColor',
];

for (const prop of expectedModalProps) {
  assert(
    settingsModalSource.includes(prop),
    `SettingsModalProps must declare prop: ${prop}`
  );
}

assert(
  settingsModalSource.includes('<StructureStylePanel'),
  'SettingsModal.tsx must render <StructureStylePanel'
);

// 2. Check App.tsx
const appPath = path.resolve(__dirname, '../src/App.tsx');
const appSource = fs.readFileSync(appPath, 'utf8');

const expectedAppBindings = [
  'structureImageDarkBg={structureImageDarkBg}',
  'onUpdateStructureImageDarkBg={handleUpdateStructureImageDarkBg}',
  'lockObsidian={lockObsidian}',
  'onToggleLockObsidian={handleToggleLockObsidian}',
  'bondLightColor={bondLightColor}',
  'onUpdateBondLightColor={handleUpdateBondLightColor}',
  'bondDarkColor={bondDarkColor}',
  'onUpdateBondDarkColor={handleUpdateBondDarkColor}',
];

for (const binding of expectedAppBindings) {
  assert(
    appSource.includes(binding),
    `App.tsx must pass binding to SettingsModal: ${binding}`
  );
}

console.log('All SettingsModal and App.tsx structure styling wiring tests passed!');
