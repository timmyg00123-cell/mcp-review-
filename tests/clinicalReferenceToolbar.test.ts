import assert from 'node:assert';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ClinicalReferenceToolbar } from '../src/components/ClinicalReferenceToolbar';

console.log('Testing ClinicalReferenceToolbar contract & functionality...');

// 1. File & Contract Checks
const toolbarPath = 'src/components/ClinicalReferenceToolbar.tsx';
assert.ok(fs.existsSync(toolbarPath), 'ClinicalReferenceToolbar.tsx must exist');

const content = fs.readFileSync(toolbarPath, 'utf-8');
assert.ok(
  content.includes('export interface ClinicalReferenceToolbarProps'),
  'Must export ClinicalReferenceToolbarProps'
);
assert.ok(
  content.includes('export const ClinicalReferenceToolbar'),
  'Must export ClinicalReferenceToolbar'
);
assert.ok(
  content.includes('app-open-3d-lab'),
  'Must support app-open-3d-lab custom event dispatch for 3D handoff'
);
assert.ok(
  content.includes('findCanonicalTargetForDrug') || content.includes('resolveDrug3DEntry'),
  'Must check 3D target presence to guard against false Clopidogrel routing'
);
assert.ok(
  content.includes("variant === 'compact'") || content.includes('compact'),
  'Must support both full and compact variants'
);
assert.ok(
  content.includes('launchpad-config-changed'),
  'Must listen for launchpad-config-changed event'
);
assert.ok(
  content.includes('ClinicalDossierModal'),
  'Must render ClinicalDossierModal'
);
assert.ok(
  content.includes('getLexicompSearchUrl'),
  'Must support Lexicomp search URL'
);
assert.ok(
  content.includes('getAccessPharmacySearchUrl'),
  'Must support AccessPharmacy search URL'
);

// 2. Full Variant Rendering
const fullHtml = renderToStaticMarkup(
  React.createElement(ClinicalReferenceToolbar, {
    drugName: 'Warfarin',
    variant: 'full',
  })
);
assert.ok(
  fullHtml.includes('Clinical Pharmacology &amp; References:') ||
    fullHtml.includes('Clinical Pharmacology & References:'),
  'Full variant must render header title'
);
assert.ok(
  fullHtml.includes('Open in 3D Lab →'),
  'Full variant must render 3D Lab button'
);
assert.ok(
  fullHtml.includes('Clinical Info Box'),
  'Full variant must render Clinical Info Box button'
);
assert.ok(
  fullHtml.includes('Institutional Launchpad:'),
  'Full variant must render Institutional Launchpad section'
);
assert.ok(
  fullHtml.includes('Lexicomp ↗'),
  'Full variant must render Lexicomp badge'
);
assert.ok(
  fullHtml.includes('AccessPharmacy ↗'),
  'Full variant must render AccessPharmacy badge'
);
assert.ok(
  fullHtml.includes('https://online.lexi.com/lco/action/search?q=Warfarin'),
  'Full variant must link to correct Lexicomp search URL'
);

// 3. Compact Variant Rendering
const compactHtml = renderToStaticMarkup(
  React.createElement(ClinicalReferenceToolbar, {
    drugName: 'Warfarin',
    variant: 'compact',
  })
);
assert.ok(
  compactHtml.includes('Dossier'),
  'Compact variant must render Dossier button'
);
assert.ok(
  compactHtml.includes('3D'),
  'Compact variant must render 3D button'
);
assert.ok(
  compactHtml.includes('Lexi ↗'),
  'Compact variant must render compact Lexi badge'
);
assert.ok(
  compactHtml.includes('Access ↗'),
  'Compact variant must render compact Access badge'
);
assert.ok(
  !compactHtml.includes('Institutional Launchpad:'),
  'Compact variant must be dense without full header labels'
);

// 4. 3D Guard for Missing/Unknown Targets
const disabledHtml = renderToStaticMarkup(
  React.createElement(ClinicalReferenceToolbar, {
    drugName: 'UnknownFakeCompound999',
    variant: 'full',
  })
);
assert.ok(
  disabledHtml.includes('disabled=""') || disabledHtml.includes('disabled'),
  '3D button must be disabled for compounds without 3D target'
);
assert.ok(
  disabledHtml.includes('3D crystal complex not yet available for this compound'),
  'Disabled 3D button must have appropriate tooltip'
);

// 5. show3DButton = false flag
const no3dHtml = renderToStaticMarkup(
  React.createElement(ClinicalReferenceToolbar, {
    drugName: 'Warfarin',
    show3DButton: false,
    variant: 'full',
  })
);
assert.ok(
  !no3dHtml.includes('Open in 3D Lab →'),
  '3D button must not be rendered when show3DButton is false'
);

console.log('ClinicalReferenceToolbar contract tests passed!');
