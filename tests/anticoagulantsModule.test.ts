import assert from 'node:assert';
import { getDefaultAnticoagulantsModule } from '../src/data/anticoagulantsQuizData';

const mod = getDefaultAnticoagulantsModule();
assert.strictEqual(mod.id, 'anticoagulants_mcp2');
assert.strictEqual(mod.version, '2.1.0', 'Expected module version 2.1.0');
assert.strictEqual(mod.pages.length, 8, 'Anticoagulants module must contain all 8 lecture pages');

let totalQuestions = 0;
mod.pages.forEach(p => {
  p.sections.forEach(s => {
    totalQuestions += s.questions.length;
  });
});
assert.strictEqual(totalQuestions, 31, `Expected 31 questions across 8 pages, got ${totalQuestions}`);

// Assert PubChem CIDs for all core drugs
const expectedCids = [92722, 216210, 10182969, 9875401, 54678486];
const foundCids = (mod.chemicalStructures || []).map(s => s.cid);
expectedCids.forEach(cid => {
  assert(foundCids.includes(cid), `Missing expected PubChem CID ${cid} in chemicalStructures`);
});
assert(
  foundCids.includes(9571074) || foundCids.includes(9578572),
  `Expected Dabigatran etexilate CID (9571074 or 9578572) in chemicalStructures`
);

// Verify all chemical structures have verified pubchemAudit
for (const s of mod.chemicalStructures || []) {
  assert(s.pubchemAudit, `Structure ${s.name} must have pubchemAudit`);
  assert.strictEqual(s.pubchemAudit.status, 'verified', `Structure ${s.name} pubchemAudit must be verified`);
}

// Test cache migration logic in moduleStorage
import { loadAllReviewModules, resetBuiltInModule } from '../src/utils/moduleStorage';

const mockStore: Record<string, string> = {};
(globalThis as any).localStorage = {
  getItem: (k: string) => mockStore[k] || null,
  setItem: (k: string, v: string) => { mockStore[k] = v; },
  removeItem: (k: string) => { delete mockStore[k]; },
  clear: () => { for (const k in mockStore) delete mockStore[k]; },
  get length() { return Object.keys(mockStore).length; },
  key: (i: number) => Object.keys(mockStore)[i] || null,
};

// Seed localStorage with a stale 1-page override with version 1.0.0
mockStore['medchem_builtin_overrides_v2'] = JSON.stringify({
  anticoagulants_mcp2: {
    id: 'anticoagulants_mcp2',
    title: 'Stale 1-Page Module',
    version: '1.0.0',
    pages: [{ pageNumber: 1, title: 'Page 1 only', sections: [] }],
  },
});

resetBuiltInModule('nonexistent'); // Reset inMemoryModules cache
const loaded = loadAllReviewModules();
const anticoag = loaded.find(m => m.id === 'anticoagulants_mcp2');
assert(anticoag, 'Anticoagulants module must be loaded');
assert.strictEqual(anticoag.version, '2.1.0', 'Stale override must be migrated to 2.1.0');
assert.strictEqual(anticoag.pages.length, 8, 'Migrated module must have all 8 pages');

console.log('Task 4 anticoagulantsModule tests passed!');
