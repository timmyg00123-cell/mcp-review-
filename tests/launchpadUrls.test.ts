import assert from 'node:assert';
import {
  DEFAULT_LAUNCHPAD_CONFIG,
  loadLaunchpadConfig,
  saveLaunchpadConfig,
  getLexicompSearchUrl,
  getAccessPharmacySearchUrl,
  type LaunchpadConfig,
} from '../src/utils/launchpadUrls.js';

console.log('Testing launchpadUrls configuration & URL generation...');

// Test 1: Defaults
assert.strictEqual(DEFAULT_LAUNCHPAD_CONFIG.authType, 'openathens');
assert.strictEqual(DEFAULT_LAUNCHPAD_CONFIG.showBadges, true);
assert.ok(DEFAULT_LAUNCHPAD_CONFIG.institutionName.includes('Xavier'));

// Test 2: Direct URL generation
const directConfig: LaunchpadConfig = {
  institutionName: 'Custom Clinic',
  authType: 'direct',
  openAthensAuthUrl: '',
  ezproxyPrefix: '',
  showBadges: true,
};
const directLexi = getLexicompSearchUrl('Atorvastatin', directConfig);
assert.strictEqual(
  directLexi,
  'https://online.lexi.com/lco/action/search?q=Atorvastatin'
);

// Test 3: EZProxy URL generation with prefix
const ezConfig: LaunchpadConfig = {
  institutionName: 'State University',
  authType: 'ezproxy',
  openAthensAuthUrl: '',
  ezproxyPrefix: 'https://proxy.lib.state.edu/login?url=',
  showBadges: true,
};
const ezLexi = getLexicompSearchUrl('Clopidogrel Bisulfate', ezConfig);
assert.strictEqual(
  ezLexi,
  'https://proxy.lib.state.edu/login?url=https%3A%2F%2Fonline.lexi.com%2Flco%2Faction%2Fsearch%3Fq%3DClopidogrel%2520Bisulfate'
);

const ezAccess = getAccessPharmacySearchUrl('Apixaban', ezConfig);
assert.strictEqual(
  ezAccess,
  'https://proxy.lib.state.edu/login?url=https%3A%2F%2Faccesspharmacy.mhmedical.com%2FSearchResults.aspx%3Fq%3DApixaban'
);

// Test 4: OpenAthens mode does not mutate search destination URL
const oaConfig: LaunchpadConfig = {
  ...DEFAULT_LAUNCHPAD_CONFIG,
  authType: 'openathens',
};
assert.strictEqual(
  getLexicompSearchUrl('Metformin', oaConfig),
  'https://online.lexi.com/lco/action/search?q=Metformin'
);

// Test 5: EZProxy prefix formatting tolerance (missing ?url= or trailing slash)
const ezConfigNoUrl: LaunchpadConfig = {
  institutionName: 'Regional College',
  authType: 'ezproxy',
  openAthensAuthUrl: '',
  ezproxyPrefix: 'https://ezproxy.college.edu/login',
  showBadges: true,
};
assert.strictEqual(
  getLexicompSearchUrl('Warfarin', ezConfigNoUrl),
  'https://ezproxy.college.edu/login?url=https%3A%2F%2Fonline.lexi.com%2Flco%2Faction%2Fsearch%3Fq%3DWarfarin'
);

// Test 6: loadLaunchpadConfig defaults when localStorage is not present
const loaded = loadLaunchpadConfig();
assert.deepStrictEqual(loaded, DEFAULT_LAUNCHPAD_CONFIG);

// Test 7: mock localStorage & window event dispatch
const mockStore: Record<string, string> = {};
let dispatchedEvent: any = null;
(globalThis as any).localStorage = {
  getItem: (key: string) => mockStore[key] || null,
  setItem: (key: string, val: string) => {
    mockStore[key] = val;
  },
  removeItem: (key: string) => {
    delete mockStore[key];
  },
  clear: () => {
    for (const k of Object.keys(mockStore)) delete mockStore[k];
  },
};
(globalThis as any).window = {
  dispatchEvent: (event: any) => {
    dispatchedEvent = event;
    return true;
  },
};
(globalThis as any).CustomEvent = class CustomEvent {
  type: string;
  detail: any;
  constructor(type: string, options?: any) {
    this.type = type;
    this.detail = options?.detail;
  }
};

saveLaunchpadConfig(ezConfig);
assert.strictEqual(mockStore['launchpad_config'], JSON.stringify(ezConfig));
assert.ok(dispatchedEvent);
assert.strictEqual(dispatchedEvent.type, 'launchpad-config-changed');

const retrieved = loadLaunchpadConfig();
assert.deepStrictEqual(retrieved, ezConfig);

// Test 8: Graceful recovery from corrupted localStorage JSON
mockStore['launchpad_config'] = '{{CORRUPTED_JSON}';
const fallbackConfig = loadLaunchpadConfig();
assert.deepStrictEqual(fallbackConfig, DEFAULT_LAUNCHPAD_CONFIG);

// Clean up globals
delete (globalThis as any).localStorage;
delete (globalThis as any).window;
delete (globalThis as any).CustomEvent;

console.log('launchpadUrls tests passed!');
