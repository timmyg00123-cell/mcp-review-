import assert from 'node:assert';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ClinicalReferenceToolbar } from '../src/components/ClinicalReferenceToolbar';
import type { ChemicalStructure } from '../src/types/reviewModule';

console.log('Testing MedChem Matrix Sticky Column Integration with ClinicalReferenceToolbar...');

// -------------------------------------------------------------
// 1. File & Contract Checks
// -------------------------------------------------------------
const matrixPath = 'src/components/MedChemMatrix.tsx';
assert.ok(fs.existsSync(matrixPath), `${matrixPath} must exist`);

const fileContent = fs.readFileSync(matrixPath, 'utf-8');

// Required module import
assert.ok(
  fileContent.includes("import { ClinicalReferenceToolbar } from './ClinicalReferenceToolbar';") ||
    fileContent.includes('from \'./ClinicalReferenceToolbar\''),
  'Must import ClinicalReferenceToolbar from ./ClinicalReferenceToolbar'
);

// Props interface contract
assert.ok(
  fileContent.includes('export interface MedChemMatrixProps'),
  'Must export MedChemMatrixProps'
);
assert.ok(
  fileContent.includes('onSelectStructureFor3D?: (structure: ChemicalStructure) => void;') ||
    fileContent.includes('onSelectStructureFor3D?:'),
  'MedChemMatrixProps must optionally accept onSelectStructureFor3D callback'
);

// Component parameter destructuring
assert.ok(
  /export const MedChemMatrix: React\.FC<MedChemMatrixProps> = \(\{[\s\S]*?onSelectStructureFor3D,[\s\S]*?\}\) =>/.test(
    fileContent
  ) || fileContent.includes('onSelectStructureFor3D,'),
  'MedChemMatrix component must destructure onSelectStructureFor3D prop'
);

// -------------------------------------------------------------
// 2. Sticky Column Integration Verification
// -------------------------------------------------------------
// Verify ClinicalReferenceToolbar is rendered inside the sticky first <td> column
assert.ok(
  fileContent.includes('<ClinicalReferenceToolbar'),
  'MedChemMatrix must render <ClinicalReferenceToolbar inside the component'
);

// Verify required props are passed to ClinicalReferenceToolbar
assert.ok(
  fileContent.includes('drugName={row.drug}'),
  'ClinicalReferenceToolbar must receive drugName={row.drug}'
);

assert.ok(
  fileContent.includes('structure={row.structure}'),
  'ClinicalReferenceToolbar must receive structure={row.structure}'
);

assert.ok(
  fileContent.includes('onSelectStructureFor3D={onSelectStructureFor3D}'),
  'ClinicalReferenceToolbar must receive onSelectStructureFor3D={onSelectStructureFor3D}'
);

assert.ok(
  fileContent.includes('variant="compact"'),
  'ClinicalReferenceToolbar must use variant="compact"'
);

assert.ok(
  fileContent.includes('className="mt-1"'),
  'ClinicalReferenceToolbar must pass className="mt-1" for clean vertical spacing in sticky column'
);

// Verify placement inside the sticky column:
// Must be within the sticky td containing Structure Thumbnail, Drug Name, and CID
const stickyTdMatch = fileContent.match(/<td className="sticky left-0[\s\S]*?<\/td>/);
assert.ok(stickyTdMatch, 'Must find sticky left-0 <td> in MedChemMatrix.tsx');
const stickyTdContent = stickyTdMatch[0];

assert.ok(
  stickyTdContent.includes('<ClinicalReferenceToolbar'),
  'ClinicalReferenceToolbar must be embedded directly inside the sticky first <td> column'
);
assert.ok(
  stickyTdContent.includes('row.drug'),
  'Sticky column must contain row.drug'
);
assert.ok(
  stickyTdContent.includes('variant="compact"'),
  'Compact ClinicalReferenceToolbar must be inside the sticky column'
);

// Verify that the toolbar is placed after the drug name / CID / drug state badge row
const drugStateIndex = stickyTdContent.indexOf('row.drugState');
const toolbarIndex = stickyTdContent.indexOf('<ClinicalReferenceToolbar');
assert.ok(
  drugStateIndex !== -1 && toolbarIndex > drugStateIndex,
  'ClinicalReferenceToolbar must be rendered underneath the drug name, CID link, and drugState badge'
);

// -------------------------------------------------------------
// 3. Compact Toolbar Rendering in Matrix Row Context
// -------------------------------------------------------------
console.log('Testing ClinicalReferenceToolbar rendering in simulated matrix row context...');

const mockRowStructure = {
  id: 'clopidogrel-001',
  name: 'Clopidogrel',
  tradeName: 'Plavix',
  cid: 2724,
  pharmacologicalClass: 'P2Y12 Inhibitor',
  smiles: 'CCOC(=O)C(C1=CC=CC=C1Cl)N2CCC3=C(C2)C=CS3',
} as unknown as ChemicalStructure;

const renderedCompact = renderToStaticMarkup(
  React.createElement(ClinicalReferenceToolbar, {
    drugName: 'Clopidogrel [Plavix]',
    structure: mockRowStructure,
    variant: 'compact',
    className: 'mt-1',
  })
);

// Verify compact buttons render properly
assert.ok(renderedCompact.includes('Dossier'), 'Compact toolbar must render Dossier button');
assert.ok(renderedCompact.includes('3D'), 'Compact toolbar must render 3D button');
assert.ok(renderedCompact.includes('Lexi ↗'), 'Compact toolbar must render Lexi badge');
assert.ok(renderedCompact.includes('Access ↗'), 'Compact toolbar must render Access badge');
assert.ok(
  renderedCompact.includes('https://online.lexi.com/lco/action/search?q=Clopidogrel%20%5BPlavix%5D') ||
    renderedCompact.includes('search?q=Clopidogrel'),
  'Compact toolbar must link to Lexicomp with drug name'
);
assert.ok(renderedCompact.includes('mt-1'), 'Compact toolbar must include mt-1 className');

console.log('MedChem Matrix Sticky Column Integration tests passed successfully!');
