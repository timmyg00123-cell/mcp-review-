// tests/multiSmilesCanvas.test.ts
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {
  getBlindedComponentLabel,
  resolveStructureRenderMode,
  formatComponentDescription,
} from '../src/utils/multiStructureHelpers.js';
import {
  TOP_DRUGS_SMILES_CATALOG,
  type TopDrugStructureRecord,
} from '../src/data/topDrugsSmilesData.js';

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

console.log('All MultiSmilesCanvas component and rendering contract checks passed successfully!');
