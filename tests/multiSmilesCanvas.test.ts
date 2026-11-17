// tests/multiSmilesCanvas.test.ts
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  getBlindedComponentLabel,
  resolveStructureRenderMode,
  formatComponentDescription,
} from '../src/utils/multiStructureHelpers.js';
import {
  TOP_DRUGS_SMILES_CATALOG,
  type TopDrugStructureRecord,
} from '../src/data/topDrugsSmilesData.js';
import { FibrinolysisCascadeViewer } from '../src/components/FibrinolysisCascadeViewer.js';
import {
  BiologicMechanismModel,
  hasDedicatedBiologicModel,
} from '../src/components/BiologicMechanismModel.js';

console.log('Running MultiSmilesCanvas component & multi-structure rendering tests...');

// =========================================================
// Test 1: Helper Logic - Blinded Labels & Structure Render Mode
// =========================================================
assert.strictEqual(getBlindedComponentLabel(0), 'Component A', 'Index 0 must be Component A');
assert.strictEqual(getBlindedComponentLabel(1), 'Component B', 'Index 1 must be Component B');
assert.strictEqual(getBlindedComponentLabel(2), 'Component C', 'Index 2 must be Component C');
assert.strictEqual(getBlindedComponentLabel(3), 'Component D', 'Index 3 must be Component D');

// Single molecule catalog entry
const acetaminophen = TOP_DRUGS_SMILES_CATALOG['acetaminophen'];
assert.ok(acetaminophen, 'Acetaminophen record must exist in catalog');
assert.strictEqual(
  resolveStructureRenderMode(acetaminophen),
  'single-molecule',
  'Acetaminophen must resolve to single-molecule render mode'
);

// 2-component combination entry (Hydrocodone / Acetaminophen)
const vicodin = TOP_DRUGS_SMILES_CATALOG['hydrocodoneacetaminophen'];
assert.ok(vicodin, 'Hydrocodone / Acetaminophen record must exist');
assert.strictEqual(
  resolveStructureRenderMode(vicodin),
  'multi-component',
  'Hydrocodone / Acetaminophen must resolve to multi-component render mode'
);
assert.strictEqual(vicodin.components?.length, 2, 'Hydrocodone / Acetaminophen must have 2 components');
assert.strictEqual(getBlindedComponentLabel(0), 'Component A');
assert.strictEqual(getBlindedComponentLabel(1), 'Component B');
assert.strictEqual(
  formatComponentDescription(vicodin.components![0]),
  'Hydrocodone (Opioid Analgesic (Mu-Opioid Agonist))'
);

// 3-component combination entry (Fioricet: Acetaminophen / Butalbital / Caffeine)
const fioricet = TOP_DRUGS_SMILES_CATALOG['acetaminophenbutalbitalcaffeine'];
assert.ok(fioricet, 'Fioricet record must exist');
assert.strictEqual(
  resolveStructureRenderMode(fioricet),
  'multi-component',
  'Fioricet must resolve to multi-component render mode'
);
assert.strictEqual(fioricet.components?.length, 3, 'Fioricet must have 3 components');
assert.strictEqual(getBlindedComponentLabel(0), 'Component A');
assert.strictEqual(getBlindedComponentLabel(1), 'Component B');
assert.strictEqual(getBlindedComponentLabel(2), 'Component C');
assert.strictEqual(fioricet.components![0].componentName, 'Acetaminophen');
assert.strictEqual(fioricet.components![1].componentName, 'Butalbital');
assert.strictEqual(fioricet.components![2].componentName, 'Caffeine');

// Biologic entry (Insulin Aspart / Novolog)
const insulinaspart = TOP_DRUGS_SMILES_CATALOG['insulinaspart'];
assert.ok(insulinaspart, 'Insulin aspart record must exist');
assert.strictEqual(
  resolveStructureRenderMode(insulinaspart),
  'biologic',
  'Insulin aspart must resolve to biologic render mode'
);
assert.ok(
  typeof insulinaspart.biologicDescription === 'string' && insulinaspart.biologicDescription.length > 20,
  'Insulin aspart must have detailed biologicDescription'
);

// Edge cases: undefined record, empty components
assert.strictEqual(
  resolveStructureRenderMode(undefined),
  'single-molecule',
  'Undefined record must default to single-molecule mode'
);
const emptyMulti: TopDrugStructureRecord = {
  genericName: 'Empty Test',
  structureType: 'multi-component',
  smiles: 'CC',
  components: [],
};
assert.strictEqual(
  resolveStructureRenderMode(emptyMulti),
  'single-molecule',
  'Multi-component with empty components must fall back to single-molecule mode'
);

// =========================================================
// Test 2: Target File Existence & Module Exports
// =========================================================
const componentPath = path.resolve('src/components/MultiSmilesCanvas.tsx');
assert.ok(fs.existsSync(componentPath), `Component file ${componentPath} must exist`);

const fileContent = fs.readFileSync(componentPath, 'utf8');

assert.ok(
  fileContent.includes('export interface MultiSmilesCanvasProps'),
  'Must export MultiSmilesCanvasProps interface'
);
assert.ok(
  fileContent.includes('export const MultiSmilesCanvas'),
  'Must export MultiSmilesCanvas named React component'
);
assert.ok(
  fileContent.includes('export default MultiSmilesCanvas'),
  'Must export MultiSmilesCanvas as default export'
);

// =========================================================
// Test 3: Props Interface Contract
// =========================================================
assert.ok(fileContent.includes('structureRecord?: TopDrugStructureRecord'), 'Props must declare optional structureRecord');
assert.ok(fileContent.includes('smiles?: string'), 'Props must declare optional fallback smiles');
assert.ok(fileContent.includes('compoundName?: string'), 'Props must declare optional compoundName');
assert.ok(fileContent.includes('isFlipped?: boolean'), 'Props must declare optional isFlipped');
assert.ok(fileContent.includes('canvasHeight?: number'), 'Props must declare optional canvasHeight');
assert.ok(fileContent.includes('className?: string'), 'Props must declare optional className');

// =========================================================
// Test 4: Multi-Component Combination Rendering Contract
// =========================================================
assert.ok(
  fileContent.includes("'multi-component'") || fileContent.includes('"multi-component"'),
  'Must check structureType for multi-component'
);
assert.ok(
  fileContent.includes('components') && fileContent.includes('.map('),
  'Must iterate through structureRecord.components'
);
assert.ok(
  fileContent.includes('flex flex-row items-center justify-center gap-2 md:gap-4 flex-wrap w-full'),
  'Must render responsive flex container with flex-wrap for multi-component drugs'
);
assert.ok(
  fileContent.includes('+') && (fileContent.includes('idx <') || fileContent.includes('index <')),
  'Must render "+" badge divider between adjacent components'
);

// Blinding constraints on multi-component front face
assert.ok(
  fileContent.includes('Component') &&
    (fileContent.includes('String.fromCharCode(65 + idx)') ||
      fileContent.includes('String.fromCharCode(65 + index)') ||
      fileContent.includes('getBlindedComponentLabel')),
  'Front of multi-component card must compute blinded label (Component A, Component B, ...)'
);

// Ensure component names & roles are conditionally guarded behind isFlipped
assert.ok(
  fileContent.includes('!isFlipped') || fileContent.includes('isFlipped ?'),
  'Must conditionally branch display based on isFlipped state'
);
assert.ok(
  fileContent.includes('comp.componentName') || fileContent.includes('component.componentName'),
  'Must render componentName on back face'
);
assert.ok(
  fileContent.includes('comp.role') || fileContent.includes('component.role'),
  'Must render component role on back face when present'
);

// =========================================================
// Test 5: Biologic Macromolecule Rendering Contract
// =========================================================
assert.ok(
  fileContent.includes("'biologic'") || fileContent.includes('"biologic"'),
  'Must check structureType for biologic'
);
assert.ok(
  fileContent.includes('Dna'),
  'Must render Lucide Dna icon for biologic macromolecule schematic'
);
assert.ok(
  fileContent.includes('bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-xl'),
  'Must render high-yield gradient card for biologics'
);
assert.ok(
  fileContent.includes('Therapeutic Biologic / Macromolecule'),
  'Must display "Therapeutic Biologic / Macromolecule" badge on front'
);
assert.ok(
  fileContent.includes('Complex Multi-Subunit Protein / Peptide'),
  'Must display "Complex Multi-Subunit Protein / Peptide" description on front'
);
assert.ok(
  fileContent.includes('Structure Revealed on Flip'),
  'Must display "Structure Revealed on Flip" prompt on front'
);
assert.ok(
  fileContent.includes('Macromolecule Architecture'),
  'Must display "Macromolecule Architecture" header on back'
);
assert.ok(
  fileContent.includes('biologicDescription'),
  'Must render biologicDescription on back of card'
);

// =========================================================
// Test 6: Single-Molecule Rendering & Fallback Contract
// =========================================================
assert.ok(
  fileContent.includes('<SmilesCanvas'),
  'Must render SmilesCanvas for small molecule structures'
);
assert.ok(
  fileContent.includes('structureRecord?.smiles || smiles'),
  'Must resolve smiles from structureRecord or fallback smiles prop'
);

// =========================================================
// Test 7: Authoritative BiologicMechanismModel Pathway Coverage
// =========================================================
assert.ok(
  fileContent.includes('<BiologicMechanismModel'),
  'MultiSmilesCanvas must delegate supported biologics to BiologicMechanismModel'
);
const bioModelSource = fs.readFileSync(path.resolve('src/components/BiologicMechanismModel.tsx'), 'utf8');
for (const family of ['fibrinolytic', 'insulin', 'incretin', 'pcsk9', 'tnf', 'rankl', 'ige', 'epo']) {
  assert.ok(
    bioModelSource.includes(`'${family}'`),
    `BiologicMechanismModel must implement pathway family '${family}'`
  );
}

// =========================================================
// Test 8: Strict Zero-Leak Blinded Rendering & Unique SVG <defs> IDs
// =========================================================
const FIBRINOLYTIC_SPOILER_RE =
  /\b(Alteplase|Reteplase|Tenecteplase|TNK-tPA|TNKase|Activase|Retavase|Streptokinase|Streptase|Urokinase|Kinlytic)\b/i;

const FIBRINOLYTIC_TEST_AGENTS = [
  {
    name: 'Alteplase (t-PA)',
    tags: ['Finger (F) & EGF domains', 'Kringle-2 (K2) lysine-binding pocket', 'Serine protease catalytic triad'],
  },
  {
    name: 'Reteplase',
    tags: ['Deletion of Finger, EGF, and Kringle-1 domains', 'Kringle-2 + Serine Protease (K2-P)'],
  },
  {
    name: 'Tenecteplase (TNK-tPA)',
    tags: [
      'T103N & N117Q glycosylation mutations',
      'Tetra-alanine substitution (KHRR296-299AAAA) PAI-1 resistance',
      'Serine protease catalytic domain',
    ],
  },
  {
    name: 'Streptokinase',
    tags: ['1:1 Non-enzymatic plasminogen activator complex', 'Bacterial polypeptide (antigenic)'],
  },
  {
    name: 'Urokinase',
    tags: ['Direct Arg561-Val562 serine protease cleavage'],
  },
];

for (const agent of FIBRINOLYTIC_TEST_AGENTS) {
  const mockStructure: any = {
    id: agent.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
    name: agent.name,
    isBiologic: true,
    document_label: `${agent.name} (Activase / TNKase)`,
    smiles: 'CC(=O)NCC(=O)NCC(=O)NCC(=O)O',
    chemicalClass: 'Recombinant Thrombolytic Biologic',
    pharmacologicalClass: 'Fibrinolytic Agent',
    target: 'Plasminogen (Arg561-Val562)',
    reversibility: 'Enzymatic cleavage',
    route: 'IV',
    keyFunctionalGroups: agent.tags,
    pharmacophores: agent.tags.map((t, idx) => ({
      id: `tag_${idx}`,
      name: t,
      purpose: `${agent.name} mechanism domain`,
    })),
    pkPdHighlights: { onset: 'Immediate', duration: 'Short', halfLife: 'Minutes', elimination: 'Hepatic' },
  };

  // 8a. Blinded idle FibrinolysisCascadeViewer
  const idleBlindedHtml = renderToStaticMarkup(
    React.createElement(FibrinolysisCascadeViewer, {
      structure: mockStructure,
      isBlinded: true,
    })
  );
  assert.strictEqual(
    FIBRINOLYTIC_SPOILER_RE.test(idleBlindedHtml),
    false,
    `Blinded idle FibrinolysisCascadeViewer leaked spoiler name for ${agent.name}: ${idleBlindedHtml.match(FIBRINOLYTIC_SPOILER_RE)?.[0]}`
  );

  // 8b. Blinded FibrinolysisCascadeViewer with EVERY domain tag active (including Tenecteplase PAI-1 rule)
  for (let idx = 0; idx < agent.tags.length; idx++) {
    const tagName = agent.tags[idx];
    const tagId = `tag_${idx}`;
    const activeBlindedHtml = renderToStaticMarkup(
      React.createElement(FibrinolysisCascadeViewer, {
        structure: mockStructure,
        isBlinded: true,
        activePharmacophoreIds: { [tagId]: { hex: '#10B981' } },
        hoveredPharmacophoreId: tagId,
        activePharmacophores: [{ id: tagId, name: tagName, color: '#10B981' }],
        hoveredPharmacophore: { id: tagId, name: tagName, color: '#10B981' },
      })
    );
    assert.strictEqual(
      FIBRINOLYTIC_SPOILER_RE.test(activeBlindedHtml),
      false,
      `Blinded active-tag FibrinolysisCascadeViewer (${tagName}) leaked spoiler for ${agent.name}: ${activeBlindedHtml.match(FIBRINOLYTIC_SPOILER_RE)?.[0]}`
    );
    if (/KHRR296-299AAAA/i.test(tagName)) {
      assert.ok(
        activeBlindedHtml.includes('80-fold more resistant to PAI-1 inhibition'),
        'PAI-1 domain banner must render its mechanistic explanation while scrubbing Tenecteplase'
      );
    }
  }

  // 8c. Blinded BiologicMechanismModel (isFlipped = false)
  const bioModelBlindedHtml = renderToStaticMarkup(
    React.createElement(BiologicMechanismModel, {
      compoundName: agent.name,
      isFlipped: false,
    })
  );
  assert.strictEqual(
    FIBRINOLYTIC_SPOILER_RE.test(bioModelBlindedHtml),
    false,
    `Blinded BiologicMechanismModel leaked spoiler for ${agent.name}`
  );

  // 8d. Review-module flashcard path (!structureRecord && hasDedicatedBiologicModel(compoundName))
  assert.strictEqual(
    hasDedicatedBiologicModel(agent.name),
    true,
    `hasDedicatedBiologicModel("${agent.name}") must return true for review-module flashcards without structureRecord`
  );
}

assert.ok(
  fileContent.includes('!structureRecord && hasDedicatedBiologicModel(compoundName)'),
  'MultiSmilesCanvas must delegate review-module biologics without structureRecord to BiologicMechanismModel'
);

// 8e. Side-by-side Comparator instances must emit strictly unique SVG <defs> IDs
const sideBySideCascadeHtml = renderToStaticMarkup(
  React.createElement(
    'div',
    null,
    React.createElement(FibrinolysisCascadeViewer, {
      structure: { id: 'a', name: 'Alteplase', isBiologic: true } as any,
      isBlinded: false,
    }),
    React.createElement(FibrinolysisCascadeViewer, {
      structure: { id: 'b', name: 'Tenecteplase', isBiologic: true } as any,
      isBlinded: false,
    })
  )
);
const cascadeDefIds = Array.from(sideBySideCascadeHtml.matchAll(/\bid="([^"]+)"/g)).map((m) => m[1]);
assert.ok(cascadeDefIds.length >= 10, 'Expected multiple SVG <defs> IDs across two FibrinolysisCascadeViewer instances');
assert.strictEqual(
  new Set(cascadeDefIds).size,
  cascadeDefIds.length,
  `Duplicate SVG <defs> IDs found across side-by-side FibrinolysisCascadeViewer instances: ${cascadeDefIds.join(', ')}`
);

const sideBySideBioHtml = renderToStaticMarkup(
  React.createElement(
    'div',
    null,
    React.createElement(BiologicMechanismModel, { compoundName: 'Insulin Glargine', isFlipped: true }),
    React.createElement(BiologicMechanismModel, { compoundName: 'Evolocumab', isFlipped: true })
  )
);
const bioDefIds = Array.from(sideBySideBioHtml.matchAll(/\bid="([^"]+)"/g)).map((m) => m[1]);
assert.ok(bioDefIds.length >= 8, 'Expected multiple SVG <defs> IDs across two BiologicMechanismModel instances');
assert.strictEqual(
  new Set(bioDefIds).size,
  bioDefIds.length,
  `Duplicate SVG <defs> IDs found across side-by-side BiologicMechanismModel instances: ${bioDefIds.join(', ')}`
);

console.log('All MultiSmilesCanvas component, zero-leak blinding, and unique SVG <defs> ID checks passed successfully!');
