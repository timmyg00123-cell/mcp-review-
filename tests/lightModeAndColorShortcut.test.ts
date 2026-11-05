import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { getInitialTheme, saveTheme } from '../src/utils/storage';

// 1. Verify storage.ts source defaults to 'light'
const storageSource = fs.readFileSync(path.resolve('src/utils/storage.ts'), 'utf-8');
assert.ok(
  storageSource.includes("inMemoryTheme = 'light';"),
  "storage.ts must set inMemoryTheme = 'light' as the default theme"
);

// 2. Mock localStorage and verify getInitialTheme behavior
const mockStorage: Record<string, string> = {};
globalThis.localStorage = {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, val: string) => {
    mockStorage[key] = val;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  },
  key: (idx: number) => Object.keys(mockStorage)[idx] ?? null,
  length: 0,
};

// Initial theme without stored preference should return 'light'
assert.strictEqual(getInitialTheme(), 'light', "getInitialTheme() must default to 'light'");

// If user explicitly saves 'dark', saveTheme & getInitialTheme must respect it
saveTheme('dark');
assert.strictEqual(mockStorage['anemia_quiz_theme'], 'dark', "saveTheme must persist 'dark'");
assert.strictEqual(getInitialTheme(), 'dark', "getInitialTheme must return stored 'dark'");

// 3. Verify Navbar.tsx has the top right Color Settings shortcut with light icon (Sun)
const navbarSource = fs.readFileSync(path.resolve('src/components/Navbar.tsx'), 'utf-8');
assert.ok(
  navbarSource.includes('<Sun'),
  'Navbar.tsx must render a Sun (light icon) for the color settings shortcut'
);
assert.ok(
  navbarSource.includes('title="Color Settings & Preferences"'),
  'Navbar.tsx must have title="Color Settings & Preferences" on the shortcut button'
);
assert.ok(
  navbarSource.includes('onClick={onOpenSettings}'),
  'Navbar.tsx shortcut button must invoke onOpenSettings to direct to settings'
);

// 4. Verify SettingsModal.tsx reflects Light Mode as default
const settingsModalSource = fs.readFileSync(path.resolve('src/components/SettingsModal.tsx'), 'utf-8');
assert.ok(
  settingsModalSource.includes('(default: Light Mode)'),
  'SettingsModal.tsx must indicate Light Mode is the default'
);

console.log('Light mode default and color settings shortcut tests passed!');
