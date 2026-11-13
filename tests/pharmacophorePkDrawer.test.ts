// tests/pharmacophorePkDrawer.test.ts
import assert from 'node:assert';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { CANONICAL_MEDCHEM_PROFILES } from '../src/data/canonicalPharmacophorePkData.js';
import type {
  PharmacophorePkPdGroup,
  KeyPocketResidueContact,
  TargetMedChemProfile,
} from '../src/types/structure3d.js';

// ============================================================================
// Test Suite: Dual PK & Clinical Effect Drawer Component
// ============================================================================

async function runTests() {
  const componentPath = 'src/components/PharmacophorePkDrawer.tsx';
  assert.ok(fs.existsSync(componentPath), `Component file ${componentPath} must exist`);

  const fileContent = fs.readFileSync(componentPath, 'utf8');

  // --------------------------------------------------------------------------
  // Test 1: Component & Interface Export Verification
  // --------------------------------------------------------------------------
  console.log('Test 1: Component & Interface Export Verification');
  assert.ok(
    fileContent.includes('export interface PharmacophorePkDrawerProps'),
    'Must export PharmacophorePkDrawerProps interface'
  );
  assert.ok(
    fileContent.includes('export const PharmacophorePkDrawer'),
    'Must export PharmacophorePkDrawer component'
  );
  assert.ok(
    fileContent.includes('isOpen: boolean'),
    'Props must include isOpen: boolean'
  );
  assert.ok(
    fileContent.includes('onClose: () => void'),
    'Props must include onClose: () => void'
  );
  assert.ok(
    fileContent.includes('activeGroup: PharmacophorePkPdGroup | null'),
    'Props must include activeGroup'
  );
  assert.ok(
    fileContent.includes('profile: TargetMedChemProfile | null'),
    'Props must include profile'
  );
  assert.ok(
    fileContent.includes('selectedPocketResidue: KeyPocketResidueContact | null'),
    'Props must include selectedPocketResidue'
  );
  assert.ok(
    fileContent.includes('onSelectGroup: (group: PharmacophorePkPdGroup) => void'),
    'Props must include onSelectGroup callback'
  );
  assert.ok(
    fileContent.includes('onSelectPocketResidue: (residue: KeyPocketResidueContact | null) => void'),
    'Props must include onSelectPocketResidue callback'
  );

  // --------------------------------------------------------------------------
  // Test 2: Dynamic Import & Render Functionality
  // --------------------------------------------------------------------------
  console.log('Test 2: Dynamic Import & Render Functionality');
  const mod = await import('../src/components/PharmacophorePkDrawer.js');
  const { PharmacophorePkDrawer } = mod;
  assert.strictEqual(typeof PharmacophorePkDrawer, 'function', 'PharmacophorePkDrawer must be a React function component');

  const profile = CANONICAL_MEDCHEM_PROFILES[0]; // P2RY12 Clopidogrel
  const activeGroup = profile.pharmacophoreGroups[0];
  const pocketResidue = profile.keyPocketResidues[0];

  // --------------------------------------------------------------------------
  // Test 3: Closed State (isOpen: false) Styling & Attributes
  // --------------------------------------------------------------------------
  console.log('Test 3: Closed State (isOpen: false) Styling & Attributes');
  const closedHtml = renderToString(
    React.createElement(PharmacophorePkDrawer, {
      isOpen: false,
      onClose: () => {},
      activeGroup,
      profile,
      selectedPocketResidue: null,
      onSelectGroup: () => {},
      onSelectPocketResidue: () => {},
    })
  );

  assert.ok(
    closedHtml.includes('translate-x-full'),
    'Closed drawer must have translate-x-full class for slide-out transition'
  );

  // --------------------------------------------------------------------------
  // Test 4: Open State (isOpen: true) - Header & Metadata
  // --------------------------------------------------------------------------
  console.log('Test 4: Open State (isOpen: true) - Header & Metadata');
  const openHtml = renderToString(
    React.createElement(PharmacophorePkDrawer, {
      isOpen: true,
      onClose: () => {},
      activeGroup,
      profile,
      selectedPocketResidue: pocketResidue,
      onSelectGroup: () => {},
      onSelectPocketResidue: () => {},
    })
  );

  assert.ok(
    openHtml.includes('translate-x-0'),
    'Open drawer must include translate-x-0 class'
  );
  assert.ok(
    openHtml.includes('P2RY12'),
    'Open drawer must display target gene symbol'
  );
  assert.ok(
    openHtml.includes('4NTJ'),
    'Open drawer must display PDB ID'
  );
  assert.ok(
    openHtml.includes(activeGroup.name),
    'Open drawer must display active pharmacophore group name'
  );
  assert.ok(
    openHtml.includes(activeGroup.chemicalFormula!),
    'Open drawer must display active group chemical formula badge'
  );

  // Verify atom names are rendered
  for (const atom of activeGroup.atomNames.slice(0, 3)) {
    assert.ok(openHtml.includes(atom), `Open drawer must list atom ${atom}`);
  }

  // --------------------------------------------------------------------------
  // Test 5: Tab Switcher & PK Cards
  // --------------------------------------------------------------------------
  console.log('Test 5: Tab Switcher & PK Cards');
  assert.ok(
    openHtml.includes('Pharmacokinetics (PK)') || openHtml.includes('Pharmacokinetics'),
    'Must render PK tab button'
  );
  assert.ok(
    openHtml.includes('Clinical Effect (PD)') || openHtml.includes('Clinical Effect'),
    'Must render PD tab button'
  );

  // Absorption card content
  assert.ok(
    openHtml.includes('Absorption') || openHtml.includes('bioavailability'),
    'Must render absorption section'
  );
  assert.ok(
    openHtml.includes('Metabolism') || openHtml.includes('bioactivation'),
    'Must render metabolism section'
  );
  assert.ok(
    openHtml.includes('Clearance') || openHtml.includes('Half-Life'),
    'Must render clearance/half-life section'
  );
  if (activeGroup.pharmacokinetics.prodrugRole) {
    assert.ok(
      openHtml.includes('Prodrug'),
      'Must render Prodrug Bioactivation card when prodrugRole is present'
    );
  }

  // --------------------------------------------------------------------------
  // Test 6: Key Pocket Contacts Inspector
  // --------------------------------------------------------------------------
  console.log('Test 6: Key Pocket Contacts Inspector');
  assert.ok(
    openHtml.includes('Key Pocket Contacts'),
    'Must render Key Pocket Contacts heading'
  );

  // Verify all pocket residues from profile are listed as interactive chips
  for (const res of profile.keyPocketResidues) {
    assert.ok(
      openHtml.includes(res.resn) && openHtml.includes(String(res.resi)),
      `Must render residue chip for ${res.resn}${res.resi}`
    );
  }

  // Verify selected residue details
  assert.ok(
    openHtml.includes(pocketResidue.clinicalImpact),
    'Must render clinical impact for selected pocket residue'
  );
  assert.ok(
    openHtml.includes(pocketResidue.interactionType),
    `Must render interaction type badge (${pocketResidue.interactionType})`
  );

  // --------------------------------------------------------------------------
  // Test 7: Group Switcher Chips
  // --------------------------------------------------------------------------
  console.log('Test 7: Group Switcher Chips');
  for (const grp of profile.pharmacophoreGroups) {
    assert.ok(
      openHtml.includes(grp.name),
      `Must render switcher chip for group ${grp.name}`
    );
  }

  // --------------------------------------------------------------------------
  // Test 8: Accessibility & ARIA Attributes
  // --------------------------------------------------------------------------
  console.log('Test 8: Accessibility & ARIA Attributes');
  assert.ok(
    openHtml.includes('role="region"') || openHtml.includes('role="dialog"'),
    'Must have role="region" or role="dialog"'
  );
  assert.ok(
    openHtml.includes('aria-label="Pharmacokinetics &amp; Clinical Effect Drawer"') ||
      openHtml.includes('aria-label="Pharmacokinetics & Clinical Effect Drawer"'),
    'Must have aria-label="Pharmacokinetics & Clinical Effect Drawer"'
  );

  // All button tags must specify type="button"
  const buttonMatches = openHtml.match(/<button\b[^>]*>/g) || [];
  assert.ok(buttonMatches.length > 0, 'Must have interactive button elements');
  for (const btn of buttonMatches) {
    assert.ok(
      btn.includes('type="button"'),
      `Every button must have type="button". Found: ${btn}`
    );
  }

  // --------------------------------------------------------------------------
  // Test 9: Keyboard Event Handling Code Check (Escape key)
  // --------------------------------------------------------------------------
  console.log('Test 9: Keyboard Event Handling (Escape key)');
  assert.ok(
    fileContent.includes("'Escape'") || fileContent.includes('"Escape"'),
    'Component must listen for Escape key to close drawer'
  );

  console.log('All tests passed successfully!');
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
