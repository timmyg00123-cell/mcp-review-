import assert from 'node:assert';
import fs from 'node:fs';
import {
  loadLaunchpadConfig,
  saveLaunchpadConfig,
  DEFAULT_LAUNCHPAD_CONFIG,
  type LaunchpadConfig,
} from '../src/utils/launchpadUrls';

console.log('Testing Institutional Launchpad Settings Modal UI & Contract (tests/institutionalSettings.test.ts)...');

// 1. Static File Contract Checks on SettingsModal.tsx
const modalPath = 'src/components/SettingsModal.tsx';
assert.ok(fs.existsSync(modalPath), 'SettingsModal.tsx must exist');

const content = fs.readFileSync(modalPath, 'utf-8');

assert.ok(
  content.includes('loadLaunchpadConfig'),
  'SettingsModal must import and call loadLaunchpadConfig'
);

assert.ok(
  content.includes('useState<LaunchpadConfig>(() => loadLaunchpadConfig())') ||
    content.includes('loadLaunchpadConfig()'),
  'SettingsModal must initialize launchpadConfig with loadLaunchpadConfig'
);

assert.ok(
  content.includes('saveLaunchpadConfig'),
  'SettingsModal must import and call saveLaunchpadConfig'
);

assert.ok(
  content.includes('DEFAULT_LAUNCHPAD_CONFIG'),
  'SettingsModal must import DEFAULT_LAUNCHPAD_CONFIG'
);

assert.ok(
  content.includes('Institutional Launchpad & Library Portal') ||
    content.includes('Institutional Launchpad'),
  'SettingsModal must contain Institutional Launchpad section title'
);

assert.ok(
  content.includes('BookOpen'),
  'SettingsModal must use BookOpen icon for Institutional Launchpad section'
);

assert.ok(
  content.includes('institutionName'),
  'SettingsModal must manage institutionName'
);

assert.ok(
  content.includes('openathens') && content.includes('ezproxy') && content.includes('direct'),
  'SettingsModal must support openathens, ezproxy, and direct auth types'
);

assert.ok(
  content.includes('OpenAthens / Portal SSO'),
  'SettingsModal must label OpenAthens option as "OpenAthens / Portal SSO"'
);

assert.ok(
  content.includes('EZProxy Prefix'),
  'SettingsModal must label EZProxy option as "EZProxy Prefix"'
);

assert.ok(
  content.includes('Direct Access (No Proxy)'),
  'SettingsModal must label Direct Access option as "Direct Access (No Proxy)"'
);

assert.ok(
  content.includes('openAthensAuthUrl'),
  'SettingsModal must contain input/field for openAthensAuthUrl'
);

assert.ok(
  content.includes('ezproxyPrefix'),
  'SettingsModal must contain input/field for ezproxyPrefix'
);

assert.ok(
  content.includes('proxy.lib.state.edu/login?url='),
  'SettingsModal must provide ezproxy helper/placeholder text'
);

assert.ok(
  content.includes('role="radiogroup"') && content.includes('role="radio"'),
  'SettingsModal must provide accessible radiogroup controls for authentication mode selection'
);

assert.ok(
  content.includes('showBadges'),
  'SettingsModal must manage showBadges'
);

assert.ok(
  content.includes('Show launchpad badges on cards'),
  'SettingsModal must provide "Show launchpad badges on cards" label'
);

assert.ok(
  content.includes('Restore Institutional Defaults'),
  'SettingsModal must provide "Restore Institutional Defaults" button'
);

// 2. Functional persistence and state synchronization check
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

let eventDispatched = false;
let eventDetail: LaunchpadConfig | null = null;
globalThis.window = {
  dispatchEvent: (event: any) => {
    eventDispatched = true;
    eventDetail = event.detail ?? null;
    return true;
  },
} as any;

// Test default load
const initialConfig = loadLaunchpadConfig();
assert.strictEqual(
  initialConfig.institutionName,
  DEFAULT_LAUNCHPAD_CONFIG.institutionName,
  'Initial config must match DEFAULT_LAUNCHPAD_CONFIG'
);

// Test updating config (as SettingsModal will do)
const customConfig: LaunchpadConfig = {
  institutionName: 'State University Health Sciences Library',
  authType: 'ezproxy',
  openAthensAuthUrl: 'https://login.openathens.net/auth/custom',
  ezproxyPrefix: 'https://proxy.lib.state.edu/login?url=',
  showBadges: false,
};

saveLaunchpadConfig(customConfig);
assert.strictEqual(eventDispatched, true, 'saveLaunchpadConfig must dispatch change event');
assert.strictEqual((eventDetail as any)?.institutionName, 'State University Health Sciences Library');

const loadedCustom = loadLaunchpadConfig();
assert.strictEqual(loadedCustom.institutionName, 'State University Health Sciences Library');
assert.strictEqual(loadedCustom.authType, 'ezproxy');
assert.strictEqual(loadedCustom.ezproxyPrefix, 'https://proxy.lib.state.edu/login?url=');
assert.strictEqual(loadedCustom.showBadges, false);

// Test restore default
saveLaunchpadConfig(DEFAULT_LAUNCHPAD_CONFIG);
const restored = loadLaunchpadConfig();
assert.strictEqual(restored.institutionName, DEFAULT_LAUNCHPAD_CONFIG.institutionName);
assert.strictEqual(restored.authType, 'openathens');
assert.strictEqual(restored.showBadges, true);

console.log('Institutional Launchpad settings test passed!');
