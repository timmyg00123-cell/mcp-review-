import assert from 'node:assert';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  ClassProfileAnchorDrawer,
  type ClassProfileAnchorDrawerProps,
} from '../src/components/ClassProfileAnchorDrawer';
import { CLASS_PROFILES, type TopDrugClassProfile } from '../src/data/clinical/classProfiles';

console.log('Running ClassProfileAnchorDrawer contract & functional tests...\n');

const drawerPath = 'src/components/ClassProfileAnchorDrawer.tsx';
assert.ok(fs.existsSync(drawerPath), `Drawer file ${drawerPath} must exist`);

const content = fs.readFileSync(drawerPath, 'utf-8');

// --- Contract Tests ---

// Test 1: Interface and Component exports
assert.ok(
  content.includes('export interface ClassProfileAnchorDrawerProps'),
  'Must export ClassProfileAnchorDrawerProps'
);
assert.ok(
  content.includes('export const ClassProfileAnchorDrawer'),
  'Must export ClassProfileAnchorDrawer'
);

// Test 2: Required props in interface
assert.ok(content.includes('isOpen: boolean'), 'Must accept isOpen');
assert.ok(content.includes('onClose: () => void'), 'Must accept onClose');
assert.ok(
  content.includes('profile: TopDrugClassProfile | null'),
  'Must accept profile: TopDrugClassProfile | null'
);
assert.ok(
  content.includes('currentDrugName?: string'),
  'Must accept currentDrugName?: string'
);

// Test 3: Accessibility attributes
assert.ok(content.includes('role="dialog"'), 'Must specify role="dialog"');
assert.ok(content.includes('aria-modal="true"'), 'Must specify aria-modal="true"');
assert.ok(
  content.includes('aria-label="Class Profile Anchor"'),
  'Must specify aria-label="Class Profile Anchor"'
);

// Test 4: Escape key handling contract
assert.ok(
  content.includes('Escape') &&
    content.includes('keydown') &&
    content.includes('addEventListener'),
  'Must bind Escape keydown event listener'
);
assert.ok(
  content.includes('removeEventListener'),
  'Must clean up keydown event listener'
);

// --- Functional Component Rendering Tests ---

const statinProfile = CLASS_PROFILES.find((p) => p.className === 'Statins')!;
assert.ok(statinProfile, 'Statins profile must exist in test dataset');

const aceProfile = CLASS_PROFILES.find((p) => p.className === 'ACE Inhibitors')!;
assert.ok(aceProfile, 'ACE Inhibitors profile must exist in test dataset');

// Test 5: Closed state returns nothing
const closedHtml = renderToString(
  React.createElement(ClassProfileAnchorDrawer, {
    isOpen: false,
    onClose: () => {},
    profile: statinProfile,
    currentDrugName: 'Atorvastatin',
  })
);
assert.strictEqual(closedHtml, '', 'Drawer should render nothing when isOpen is false');

// Test 6: Null profile returns nothing safely without throwing
const nullProfileHtml = renderToString(
  React.createElement(ClassProfileAnchorDrawer, {
    isOpen: true,
    onClose: () => {},
    profile: null,
    currentDrugName: 'Atorvastatin',
  })
);
assert.strictEqual(
  nullProfileHtml,
  '',
  'Drawer should safely render nothing when profile is null'
);

// Test 7: Open state with valid profile renders dialog and header
const openHtml = renderToString(
  React.createElement(ClassProfileAnchorDrawer, {
    isOpen: true,
    onClose: () => {},
    profile: statinProfile,
    currentDrugName: 'Atorvastatin',
  })
);

assert.ok(openHtml.includes('role="dialog"'), 'Must render dialog role');
assert.ok(
  openHtml.includes('aria-label="Class Profile Anchor"'),
  'Must render aria-label="Class Profile Anchor"'
);
assert.ok(openHtml.includes('Statins'), 'Must render class name in header');
assert.ok(
  openHtml.includes('10. Cardiovascular --- Anti-Lipemic Agent'),
  'Must render therapeutic category badge'
);
assert.ok(
  openHtml.includes('aria-label="Close drawer"'),
  'Must render close button with accessible label'
);

// Test 8: Section 1 - Universal Class Baseline
assert.ok(
  openHtml.includes('Universal Class Baseline'),
  'Must display Universal Class Baseline section title'
);
assert.ok(
  openHtml.includes(statinProfile.universalMoa),
  'Must display universal MOA'
);
for (const toxicity of statinProfile.classWideToxicities) {
  assert.ok(
    openHtml.includes(toxicity),
    `Must display class toxicity: "${toxicity}"`
  );
}
for (const monitor of statinProfile.baselineMonitoring) {
  assert.ok(
    openHtml.includes(monitor),
    `Must display baseline monitoring parameter: "${monitor}"`
  );
}

// Test 9: Section 2 - Subclass Exceptions Roster and Active Drug Emphasis
assert.ok(
  openHtml.includes('Subclass Exceptions Roster'),
  'Must display Subclass Exceptions Roster section title'
);

// Decode HTML entities for assertions against raw text strings from profiles
const decodedOpenHtml = openHtml
  .replace(/&gt;/g, '>')
  .replace(/&lt;/g, '<')
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#x27;/g, "'");

// Check that member drugs are present
for (const drug of statinProfile.memberDrugNames) {
  assert.ok(
    decodedOpenHtml.includes(drug),
    `Must render member drug name: "${drug}"`
  );
  const exceptions = statinProfile.exceptionsByDrug[drug] || [];
  for (const ex of exceptions) {
    assert.ok(
      decodedOpenHtml.includes(ex),
      `Must render drug exception for ${drug}`
    );
  }
}

// Active drug emphasis check (Atorvastatin was provided as currentDrugName)
assert.ok(
  openHtml.includes('Current Study Drug') || openHtml.includes('Current Drug'),
  'Must display active drug badge for currentDrugName'
);
assert.ok(
  openHtml.includes('border-emerald'),
  'Active drug card must have emerald border styling'
);

// Test 10: Black Box Warnings (when present in profile)
const aceHtml = renderToString(
  React.createElement(ClassProfileAnchorDrawer, {
    isOpen: true,
    onClose: () => {},
    profile: aceProfile,
    currentDrugName: 'Lisinopril',
  })
);

assert.ok(
  aceHtml.includes('Black Box Warning') || aceHtml.includes('Boxed Warning'),
  'Must render Black Box Warning section when present'
);
assert.ok(
  aceHtml.includes('Fetal Toxicity'),
  'Must render black box warning content for ACE inhibitors'
);

// Statin profile has no black box warnings, should not render black box section
assert.ok(
  !openHtml.includes('Fetal Toxicity'),
  'Statins should not render unrelated black box warnings'
);

console.log('All ClassProfileAnchorDrawer tests passed successfully!');
