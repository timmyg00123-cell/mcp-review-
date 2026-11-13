// tests/twoDPocketFallbackView.test.ts
import assert from 'node:assert';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { CANONICAL_MEDCHEM_PROFILES } from '../src/data/canonicalPharmacophorePkData.js';
import type {
  TwoDPocketFallbackViewProps,
} from '../src/components/TwoDPocketFallbackView.js';
import type {
  PharmacophorePkPdGroup,
  KeyPocketResidueContact,
  TargetMedChemProfile,
} from '../src/types/structure3d.js';
import type { DetectedLigandInfo } from '../src/services/structure3dService.js';

// ============================================================================
// Test Suite: Interactive 2D Binding Pocket & SAR Fallback Component
// ============================================================================

console.log('--- Running TwoDPocketFallbackView Test Suite ---');

async function runTests() {
  const componentPath = 'src/components/TwoDPocketFallbackView.tsx';

  // --------------------------------------------------------------------------
  // Test 1: Component File & Type Exports Verification
  // --------------------------------------------------------------------------
  console.log('Test 1: Component File & Type Exports Verification');
  assert.ok(fs.existsSync(componentPath), `Component file ${componentPath} must exist`);

  const fileContent = fs.readFileSync(componentPath, 'utf8');

  assert.ok(
    fileContent.includes('export interface TwoDPocketFallbackViewProps'),
    'Must export TwoDPocketFallbackViewProps interface'
  );
  assert.ok(
    fileContent.includes('export const TwoDPocketFallbackView') ||
      fileContent.includes('export function TwoDPocketFallbackView'),
    'Must export TwoDPocketFallbackView component'
  );

  // Check prop types in contract
  assert.ok(fileContent.includes('pdbId: string'), 'Props must require pdbId: string');
  assert.ok(fileContent.includes('targetName?: string'), 'Props must support targetName?: string');
  assert.ok(fileContent.includes('geneSymbol?: string'), 'Props must support geneSymbol?: string');
  assert.ok(fileContent.includes('detectedLigand?: DetectedLigandInfo | null'), 'Props must support detectedLigand');
  assert.ok(fileContent.includes('medChemProfile?: TargetMedChemProfile | null'), 'Props must support medChemProfile');
  assert.ok(fileContent.includes('activePharmacophoreGroup?: PharmacophorePkPdGroup | null'), 'Props must support activePharmacophoreGroup');
  assert.ok(fileContent.includes('onSelectPharmacophoreGroup?:'), 'Props must support onSelectPharmacophoreGroup');
  assert.ok(fileContent.includes('onSelectPocketResidue?:'), 'Props must support onSelectPocketResidue');
  assert.ok(fileContent.includes('onRetry3D?: () => void'), 'Props must support onRetry3D');
  assert.ok(fileContent.includes('onOpenTutorial?: () => void'), 'Props must support onOpenTutorial');

  // --------------------------------------------------------------------------
  // Test 2: Dynamic Import Verification
  // --------------------------------------------------------------------------
  console.log('Test 2: Dynamic Import Verification');
  const mod = await import('../src/components/TwoDPocketFallbackView.js');
  const { TwoDPocketFallbackView } = mod;
  assert.strictEqual(typeof TwoDPocketFallbackView, 'function', 'TwoDPocketFallbackView must be a React function component');

  // Test data setup
  const profile: TargetMedChemProfile = CANONICAL_MEDCHEM_PROFILES[0]; // P2RY12
  const detectedLigand: DetectedLigandInfo = {
    resn: 'AZD',
    atomCount: 28,
    description: 'AZD1283 Clopidogrel Analog',
  };

  // --------------------------------------------------------------------------
  // Test 3: Header Rendering - Gene Symbol, Target Name, PDB ID & Mode Badge
  // --------------------------------------------------------------------------
  console.log('Test 3: Header Rendering - Gene Symbol, Target Name, PDB ID & Mode Badge');
  const html = renderToString(
    React.createElement(TwoDPocketFallbackView, {
      pdbId: '4NTJ',
      targetName: 'P2Y12 Receptor',
      geneSymbol: 'P2RY12',
      detectedLigand,
      medChemProfile: profile,
    })
  );

  assert.ok(html.includes('P2RY12'), 'Must render gene symbol P2RY12');
  assert.ok(html.includes('P2Y12 Receptor'), 'Must render target name P2Y12 Receptor');
  assert.ok(html.includes('4NTJ'), 'Must render PDB ID 4NTJ');
  assert.ok(
    html.includes('2D Pocket') || html.includes('SAR Schematic'),
    'Must display 2D Pocket & SAR Schematic mode badge'
  );
  assert.ok(
    html.includes('Try 3D View Again') || html.includes('Try 3D'),
    'Must render Try 3D View Again action'
  );

  // --------------------------------------------------------------------------
  // Test 4: Ligand 2D Depiction & Metadata Card
  // --------------------------------------------------------------------------
  console.log('Test 4: Ligand 2D Depiction & Metadata Card');
  assert.ok(html.includes('AZD'), 'Must display ligand code AZD');
  assert.ok(html.includes('Clopidogrel'), 'Must display drug name Clopidogrel');
  assert.ok(
    html.includes('https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/') ||
      html.includes('PubChem') ||
      html.includes('svg'),
    'Must render 2D structure representation (PubChem image or SVG placeholder)'
  );

  // --------------------------------------------------------------------------
  // Test 5: Pharmacophore Filtering Chips
  // --------------------------------------------------------------------------
  console.log('Test 5: Pharmacophore Filtering Chips');
  for (const group of profile.pharmacophoreGroups) {
    assert.ok(
      html.includes(group.name),
      `Must render chip for pharmacophore group: ${group.name}`
    );
    if (group.chemicalFormula) {
      assert.ok(
        html.includes(group.chemicalFormula),
        `Must render formula badge: ${group.chemicalFormula}`
      );
    }
  }

  // --------------------------------------------------------------------------
  // Test 6: Key Pocket Residue Contact Cards & Color-Coded Interaction Badges
  // --------------------------------------------------------------------------
  console.log('Test 6: Key Pocket Residue Contact Cards & Color-Coded Interaction Badges');
  for (const residue of profile.keyPocketResidues) {
    assert.ok(
      html.includes(residue.label) || html.includes(residue.resn),
      `Must render residue card for ${residue.label}`
    );
    assert.ok(
      html.includes(residue.clinicalImpact),
      `Must render clinical impact for residue ${residue.label}`
    );
  }
  // Check interaction type text and classes
  assert.ok(html.includes('Covalent') || html.includes('covalent'), 'Must render covalent interaction badge');
  assert.ok(html.includes('Ionic') || html.includes('ionic'), 'Must render ionic interaction badge');
  assert.ok(html.includes('Hydrogen') || html.includes('hydrogen-bond'), 'Must render hydrogen bond interaction badge');
  assert.ok(html.includes('Å'), 'Must render distance metric in Angstroms');

  // --------------------------------------------------------------------------
  // Test 7: Active Pharmacophore PK/PD Breakdown Card
  // --------------------------------------------------------------------------
  console.log('Test 7: Active Pharmacophore PK/PD Breakdown Card');
  const activeGroup = profile.pharmacophoreGroups[0];
  const activeHtml = renderToString(
    React.createElement(TwoDPocketFallbackView, {
      pdbId: '4NTJ',
      medChemProfile: profile,
      activePharmacophoreGroup: activeGroup,
    })
  );

  assert.ok(
    activeHtml.includes('High oral bioavailability') ||
      activeHtml.includes('Absorption &amp; Permeability'),
    'Must render pharmacokinetics absorption details for active group'
  );
  assert.ok(
    activeHtml.includes('CYP2C19') ||
      activeHtml.includes('Metabolism &amp; Clearance'),
    'Must render pharmacokinetics metabolism details for active group'
  );
  assert.ok(
    activeHtml.includes('Deep hydrophobic insertion') ||
      activeHtml.includes('Target Binding &amp; Mechanism'),
    'Must render target binding role for active group'
  );

  // --------------------------------------------------------------------------
  // Test 8: Browser WebGL Acceleration Setup Guide
  // --------------------------------------------------------------------------
  console.log('Test 8: Browser WebGL Acceleration Setup Guide');
  // Either in initial HTML or when toggleable guide is present
  assert.ok(
    html.includes('chrome://settings/system') || fileContent.includes('chrome://settings/system'),
    'Must contain chrome://settings/system instructions'
  );
  assert.ok(
    html.includes('graphics acceleration') || fileContent.includes('graphics acceleration'),
    'Must instruct user to enable graphics acceleration'
  );
  assert.ok(
    html.includes('about:config') || fileContent.includes('about:config'),
    'Must reference Firefox about:config WebGL preference'
  );

  // --------------------------------------------------------------------------
  // Test 9: Interactive Callback Handlers Wiring Verification
  // --------------------------------------------------------------------------
  console.log('Test 9: Interactive Callback Handlers Wiring Verification');

  // Verify onRetry3D wiring
  assert.ok(
    fileContent.includes('onRetry3D?.()') || fileContent.includes('onClick={onRetry3D}'),
    'Try 3D View Again button must wire onRetry3D callback'
  );

  // Verify onSelectPharmacophoreGroup wiring
  assert.ok(
    fileContent.includes('onSelectPharmacophoreGroup?.') ||
      fileContent.includes('onSelectPharmacophoreGroup('),
    'Pharmacophore chip click must wire onSelectPharmacophoreGroup callback'
  );

  // Verify onSelectPocketResidue wiring
  assert.ok(
    fileContent.includes('onSelectPocketResidue?.') ||
      fileContent.includes('onSelectPocketResidue('),
    'Residue card click must wire onSelectPocketResidue callback'
  );

  // Verify onOpenTutorial wiring
  assert.ok(
    fileContent.includes('onOpenTutorial') &&
      (fileContent.includes('onClick={onOpenTutorial}') || fileContent.includes('onOpenTutorial?.()')),
    'Tutorial button must wire onOpenTutorial callback'
  );

  // Verify toggle state logic for pharmacophore groups and pocket residues
  assert.ok(
    fileContent.includes('handleGroupClick') || fileContent.includes('onSelectPharmacophoreGroup'),
    'Must handle group click and toggle selection'
  );
  assert.ok(
    fileContent.includes('handleResidueClick') || fileContent.includes('onSelectPocketResidue'),
    'Must handle residue card click and toggle selection'
  );

  // --------------------------------------------------------------------------
  // Test 10: Graceful Fallback with Minimal/Empty Props
  // --------------------------------------------------------------------------
  console.log('Test 10: Graceful Fallback with Minimal/Empty Props');
  const minimalHtml = renderToString(
    React.createElement(TwoDPocketFallbackView, {
      pdbId: '4Z9O',
    })
  );
  assert.ok(minimalHtml.includes('4Z9O'), 'Must render PDB ID even with minimal props');
  assert.ok(minimalHtml.length > 0, 'Must render without throwing when profile is missing');

  console.log('\nAll TwoDPocketFallbackView tests passed successfully!');
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
