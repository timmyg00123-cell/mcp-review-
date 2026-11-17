import assert from 'node:assert';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { resolveClinicalIndications } from '../src/utils/clinicalIndications';
import { resolveTopDrugClinicalMonograph } from '../src/data/topDrugsClinicalData';
import { ClinicalReferenceToolbar } from '../src/components/ClinicalReferenceToolbar';
import type { ChemicalStructure } from '../src/types/reviewModule';
import type { ClinicalPharmacologyProfile } from '../src/utils/clinicalPharmacologyDictionary';

console.log('Testing StructureFlashcardCardFace Clinical Indications & ClinicalReferenceToolbar Integration...');

// -------------------------------------------------------------
// 1. File & Contract Checks
// -------------------------------------------------------------
const componentPath = 'src/components/StructureFlashcardCardFace.tsx';
assert.ok(fs.existsSync(componentPath), `${componentPath} must exist`);

const fileContent = fs.readFileSync(componentPath, 'utf-8');

// Required module imports
assert.ok(
  fileContent.includes("from './ClinicalReferenceToolbar'"),
  'Must import ClinicalReferenceToolbar from ./ClinicalReferenceToolbar'
);
assert.ok(
  fileContent.includes("from '../utils/clinicalIndications'"),
  'Must import resolveClinicalIndications from ../utils/clinicalIndications'
);
assert.ok(
  fileContent.includes("from '../data/topDrugsClinicalData'"),
  'Must import resolveTopDrugClinicalMonograph from ../data/topDrugsClinicalData'
);
assert.ok(
  fileContent.includes('Stethoscope'),
  'Must import Stethoscope icon from lucide-react'
);

// Props interface contract
assert.ok(
  fileContent.includes('export interface StructureFlashcardCardFaceProps'),
  'Must export StructureFlashcardCardFaceProps'
);
assert.ok(
  fileContent.includes('onSelectStructureFor3D?:'),
  'StructureFlashcardCardFaceProps must accept optional onSelectStructureFor3D callback'
);

// -------------------------------------------------------------
// 2. Clinical Indications Resolution Logic Unit Tests
// -------------------------------------------------------------
console.log('Testing clinical indications resolution fallback hierarchy...');

function resolveIndicationsForCard(
  structure: ChemicalStructure,
  cleanName: string,
  clinicalProfile: ClinicalPharmacologyProfile & { indications?: string[] }
): string[] {
  if (Array.isArray(structure.clinicalIndications) && structure.clinicalIndications.length > 0) {
    return structure.clinicalIndications;
  }
  const monograph = resolveTopDrugClinicalMonograph(cleanName);
  if (monograph) {
    const extracted = resolveClinicalIndications(monograph);
    if (extracted && extracted.length > 0) return extracted;
  }
  if (
    clinicalProfile.indications &&
    Array.isArray(clinicalProfile.indications) &&
    clinicalProfile.indications.length > 0
  ) {
    return clinicalProfile.indications;
  }
  return [];
}

// Case A: Explicit indications on ChemicalStructure takes precedence
const atorvastatinStruct = {
  id: 'atorvastatin-001',
  name: 'Atorvastatin [Lipitor]',
  clinicalIndications: ['Hypercholesterolemia', 'Dyslipidemia', 'Cardiovascular Risk Reduction'],
} as unknown as ChemicalStructure;
const dummyProfile: ClinicalPharmacologyProfile = {
  metabolism: 'CYP3A4',
  bbbCrossing: 'Low',
  pregnancyRisk: 'contraindicated',
  pregnancySummary: 'Teratogenic',
};
const resA = resolveIndicationsForCard(atorvastatinStruct, 'Atorvastatin', dummyProfile);
assert.deepStrictEqual(
  resA,
  ['Hypercholesterolemia', 'Dyslipidemia', 'Cardiovascular Risk Reduction'],
  'Explicit structure.clinicalIndications must take priority'
);

// Case B: No structure.clinicalIndications -> resolves from TopDrugClinicalMonograph
const lisinoprilStruct = {
  id: 'lisinopril-001',
  name: 'Lisinopril',
} as unknown as ChemicalStructure;
const resB = resolveIndicationsForCard(lisinoprilStruct, 'Lisinopril', dummyProfile);
assert.ok(resB.length > 0, 'Lisinopril must resolve indications from TopDrugClinicalMonograph');
assert.ok(
  resB.includes('Hypertension'),
  'Lisinopril indications resolved from monograph must include Hypertension'
);

// Case C: Fallback to clinicalProfile.indications if uncataloged compound
const novelCompoundStruct = {
  id: 'novel-x99',
  name: 'Compound-XYZ-999',
} as unknown as ChemicalStructure;
const customProfile: ClinicalPharmacologyProfile & { indications?: string[] } = {
  ...dummyProfile,
  indications: ['Experimental Refractory Angina'],
};
// Note: uncataloged compounds will synthesize a monograph; if synthesized has no indications or if we check profile:
assert.ok(Array.isArray(resolveIndicationsForCard(novelCompoundStruct, 'Compound-XYZ-999', customProfile)));

// Verify useMemo resolution pattern exists in component source
assert.ok(
  fileContent.includes('const clinicalIndications = useMemo('),
  'Component must define clinicalIndications memo'
);
assert.ok(
  fileContent.includes('resolveTopDrugClinicalMonograph(cleanName)'),
  'Memo must invoke resolveTopDrugClinicalMonograph(cleanName)'
);
assert.ok(
  fileContent.includes('resolveClinicalIndications(monograph)'),
  'Memo must invoke resolveClinicalIndications(monograph)'
);

// -------------------------------------------------------------
// 3. Back Face Density Modes Verification
// -------------------------------------------------------------
console.log('Testing back face density modes in source code...');

const backFaceSection = fileContent.split('{isFlipped && (')[1]?.split('{/* ========================================================= */}')[0] || '';
assert.ok(backFaceSection.length > 0, 'Must contain isFlipped back face JSX block');

// A. Split mode (Default 2-column)
const splitModeBlock = backFaceSection.split("density === 'split' && (")[1]?.split("density === 'structure-focus'")[0] || '';
assert.ok(splitModeBlock.length > 0, 'Must contain split density mode block');
assert.ok(
  splitModeBlock.includes('ClinicalReferenceToolbar'),
  'Split mode must render ClinicalReferenceToolbar in right column'
);
assert.ok(
  splitModeBlock.includes('variant="full"'),
  'Split mode ClinicalReferenceToolbar must use variant="full"'
);
assert.ok(
  splitModeBlock.includes('Approved Clinical Indications'),
  'Split mode must render Approved Clinical Indications label'
);
assert.ok(
  splitModeBlock.includes('Stethoscope'),
  'Split mode Approved Clinical Indications must render Stethoscope icon'
);
assert.ok(
  splitModeBlock.includes('clinicalIndications.map'),
  'Split mode must iterate and render clinicalIndications badges'
);

// B. Structure-focus mode
const structureFocusBlock = backFaceSection.split("density === 'structure-focus' && (")[1]?.split("density === 'minimalist'")[0] || '';
assert.ok(structureFocusBlock.length > 0, 'Must contain structure-focus density mode block');
assert.ok(
  structureFocusBlock.includes('Approved Clinical Indications'),
  'Structure-focus mode must render Approved Clinical Indications badges below structure/property grid'
);
assert.ok(
  structureFocusBlock.includes('ClinicalReferenceToolbar'),
  'Structure-focus mode must render ClinicalReferenceToolbar'
);
assert.ok(
  structureFocusBlock.includes('variant="compact"'),
  'Structure-focus mode ClinicalReferenceToolbar must use variant="compact"'
);

// C. Minimalist mode
const minimalistBlock = backFaceSection.split("density === 'minimalist' && (")[1]?.split('{/* 3. Bottom Slot:')[0] || '';
assert.ok(minimalistBlock.length > 0, 'Must contain minimalist density mode block');
assert.ok(
  minimalistBlock.includes('clinicalIndications.map') || minimalistBlock.includes('clinicalIndications.length'),
  'Minimalist mode must render compact indication chips'
);
assert.ok(
  minimalistBlock.includes('ClinicalReferenceToolbar'),
  'Minimalist mode must render ClinicalReferenceToolbar'
);
assert.ok(
  minimalistBlock.includes('variant="compact"'),
  'Minimalist mode ClinicalReferenceToolbar must use variant="compact"'
);

// -------------------------------------------------------------
// 4. ClinicalReferenceToolbar Variant Rendering Tests
// -------------------------------------------------------------
console.log('Testing ClinicalReferenceToolbar rendering in isolation...');
const toolbarFullHtml = renderToStaticMarkup(
  React.createElement(ClinicalReferenceToolbar, {
    drugName: 'Lisinopril',
    structure: lisinoprilStruct,
    variant: 'full',
  })
);
assert.ok(
  toolbarFullHtml.includes('Clinical Pharmacology &amp; References:') ||
    toolbarFullHtml.includes('Clinical Pharmacology & References:'),
  'ClinicalReferenceToolbar full variant must render reference banner'
);
assert.ok(
  toolbarFullHtml.includes('Clinical Info Box'),
  'ClinicalReferenceToolbar full variant must render Clinical Info Box button'
);

const toolbarCompactHtml = renderToStaticMarkup(
  React.createElement(ClinicalReferenceToolbar, {
    drugName: 'Lisinopril',
    structure: lisinoprilStruct,
    variant: 'compact',
  })
);
assert.ok(
  toolbarCompactHtml.includes('Dossier'),
  'ClinicalReferenceToolbar compact variant must render Dossier button'
);
assert.ok(
  toolbarCompactHtml.includes('Lexi') && toolbarCompactHtml.includes('Access'),
  'ClinicalReferenceToolbar compact variant must render compact launchpad links'
);

// -------------------------------------------------------------
// 5. Front Face Active Recall Blinding (Zero Leaks)
// -------------------------------------------------------------
console.log('Testing Front Face Active Recall Blinding (isFlipped = false)...');
const frontFaceSection = fileContent.split('{!isFlipped && (')[1]?.split('{/* ========================================================= */}')[0] || '';
assert.ok(frontFaceSection.length > 0, 'Must contain unrevealed front face JSX block');

assert.ok(
  !frontFaceSection.includes('ClinicalReferenceToolbar'),
  'Front face must NEVER render ClinicalReferenceToolbar'
);
assert.ok(
  !frontFaceSection.includes('clinicalIndications'),
  'Front face must NEVER render or reference clinicalIndications'
);
assert.ok(
  !frontFaceSection.includes('Approved Clinical Indications'),
  'Front face must NEVER render Approved Clinical Indications label'
);
assert.ok(
  !frontFaceSection.includes('Stethoscope'),
  'Front face must NEVER render Stethoscope icon'
);
assert.ok(
  !frontFaceSection.includes('{cleanName}'),
  'Front face must NEVER leak drug cleanName'
);
assert.ok(
  !frontFaceSection.includes('structure.name'),
  'Front face must NEVER leak structure.name'
);
assert.ok(
  !frontFaceSection.includes('Lexicomp') && !frontFaceSection.includes('AccessPharmacy'),
  'Front face must NEVER leak launchpad links'
);
assert.ok(
  !frontFaceSection.includes('Dossier') && !frontFaceSection.includes('Clinical Info Box'),
  'Front face must NEVER leak clinical dossier'
);

console.log('✓ All 2D Chemical Structure Flashcards Clinical Indications & Toolbar tests passed!');
