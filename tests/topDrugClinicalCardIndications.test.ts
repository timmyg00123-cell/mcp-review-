import assert from 'node:assert';
import fs from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { resolveClinicalIndications } from '../src/utils/clinicalIndications';
import { TopDrugClinicalCard } from '../src/components/TopDrugClinicalCard';
import type { TopDrugClinicalMonograph } from '../src/data/clinical/types';

console.log('Testing Indications Extraction & Top 200 Flashcards Integration...');

// -------------------------------------------------------------
// 1. File & Contract Checks
// -------------------------------------------------------------
const indicationsUtilPath = 'src/utils/clinicalIndications.ts';
assert.ok(fs.existsSync(indicationsUtilPath), 'src/utils/clinicalIndications.ts must exist');

const utilContent = fs.readFileSync(indicationsUtilPath, 'utf-8');
assert.ok(
  utilContent.includes('export function resolveClinicalIndications'),
  'Must export resolveClinicalIndications function'
);

const cardPath = 'src/components/TopDrugClinicalCard.tsx';
const cardContent = fs.readFileSync(cardPath, 'utf-8');
assert.ok(
  cardContent.includes('ClinicalReferenceToolbar'),
  'TopDrugClinicalCard must import and render ClinicalReferenceToolbar'
);
assert.ok(
  cardContent.includes('resolveClinicalIndications'),
  'TopDrugClinicalCard must use resolveClinicalIndications'
);
assert.ok(
  cardContent.includes('structure?:') && cardContent.includes('onSelectStructureFor3D?:'),
  'TopDrugClinicalCardProps must accept optional structure and onSelectStructureFor3D props'
);

// -------------------------------------------------------------
// 2. Unit Tests for resolveClinicalIndications
// -------------------------------------------------------------

// A. Explicit indications array property
const monographWithExplicit = {
  genericName: 'Amlodipine',
  brandNames: ['Norvasc'],
  indications: ['Hypertension', 'Coronary Artery Disease', 'Angina'],
} as unknown as TopDrugClinicalMonograph;

const explicitResult = resolveClinicalIndications(monographWithExplicit);
assert.deepStrictEqual(
  explicitResult,
  ['Hypertension', 'Coronary Artery Disease', 'Angina'],
  'Should return sanitized explicit indications if present'
);

// B. Array dosingRegimens format with non-indication headers & qualifiers
const monographArrayDosing = {
  genericName: 'Lisinopril',
  brandNames: ['Prinivil', 'Zestril'],
  pharmacologicClass: 'ACE Inhibitor',
  therapeuticClass: '11. Cardiovascular --- Antihypertensive',
  mechanismOfAction: 'Inhibits ACE enzyme...',
  dosingRegimens: [
    'Hypertension monotherapy: Start 10 mg PO once daily (5 mg daily if on diuretics)...',
    'Heart failure with reduced ejection fraction (HFrEF): Start 2.5-5 mg PO once daily...',
    'Acute myocardial infarction (within 24 hours): 5 mg PO initially...',
    'Renal impairment: Reduce dose if CrCl < 30 mL/min...',
    'Hepatic impairment: Monitor closely...',
    'Geriatric: Start at lower dose...',
    'Pediatric: Not approved for infants...',
    'Initial: 5 mg daily...',
    'Maintenance: 20-40 mg daily...',
    'CrCl < 30 mL/min: Dose adjustment required...',
    'Dialysis: Supplemental dose may be needed...',
    'Dose adjustment: Titrate every 2 weeks...',
    'Administration: Take with or without food...',
    'Overdose: Provide supportive care...',
  ],
  sideEffects: { common: ['Cough'] },
  contraindications: ['Angioedema'],
  drugInteractions: { major: [], common: [] },
  monitoringParameters: ['Blood pressure'],
  dosageForms: ['Oral Tablet'],
  administrationAndCounseling: [],
} as TopDrugClinicalMonograph;

const arrayResult = resolveClinicalIndications(monographArrayDosing);
assert.ok(arrayResult.includes('Hypertension'), 'Should extract Hypertension and strip qualifier "monotherapy"');
assert.ok(!arrayResult.some((ind) => ind.toLowerCase().includes('monotherapy')), 'Must strip "monotherapy" qualifier');
assert.ok(
  arrayResult.includes('Heart failure with reduced ejection fraction (HFrEF)'),
  'Should extract Heart failure with reduced ejection fraction (HFrEF)'
);
assert.ok(
  arrayResult.includes('Acute myocardial infarction (within 24 hours)'),
  'Should extract Acute myocardial infarction (within 24 hours)'
);

// Non-indication headers must be filtered out
const forbiddenTerms = [
  'renal impairment',
  'hepatic impairment',
  'geriatric',
  'pediatric',
  'initial',
  'maintenance',
  'crcl',
  'dialysis',
  'dose adjustment',
  'administration',
  'overdose',
];
for (const term of forbiddenTerms) {
  assert.ok(
    !arrayResult.some((ind) => ind.toLowerCase() === term || ind.toLowerCase().includes(term)),
    `Extracted indications must not contain non-indication header: "${term}"`
  );
}

// C. Object/Record dosingRegimens format
const monographRecordDosing = {
  genericName: 'Atorvastatin',
  brandNames: ['Lipitor'],
  pharmacologicClass: 'HMG-CoA Reductase Inhibitor',
  therapeuticClass: '10. Cardiovascular --- Anti-Lipemic Agent',
  dosingRegimens: {
    'Hyperlipidemia': '10-20 mg PO once daily',
    'Primary Prevention of Cardiovascular Disease': '10-80 mg PO once daily',
    'Secondary Prevention in CAD': '80 mg PO once daily',
    'Renal Impairment': 'No dosage adjustment required',
    'Hepatic Impairment': 'Contraindicated in active liver disease',
    'Pediatric Dosing': '10 mg once daily in HeFH (>= 10 years)',
  } as unknown as string[],
} as TopDrugClinicalMonograph;

const recordResult = resolveClinicalIndications(monographRecordDosing);
assert.ok(recordResult.includes('Hyperlipidemia'), 'Should extract Hyperlipidemia from Record keys');
assert.ok(
  recordResult.includes('Primary Prevention of Cardiovascular Disease'),
  'Should extract Primary Prevention from Record keys'
);
assert.ok(
  recordResult.includes('Secondary Prevention in CAD'),
  'Should extract Secondary Prevention from Record keys'
);
assert.ok(
  !recordResult.some((ind) => ind.toLowerCase().includes('renal impairment')),
  'Should filter out Renal Impairment from Record keys'
);
assert.ok(
  !recordResult.some((ind) => ind.toLowerCase().includes('hepatic impairment')),
  'Should filter out Hepatic Impairment from Record keys'
);
assert.ok(
  !recordResult.some((ind) => ind.toLowerCase().includes('pediatric')),
  'Should filter out Pediatric from Record keys'
);

// D. Fallback to therapeuticClass when dosingRegimens is empty or yields no valid indications
const monographFallback = {
  genericName: 'Metoprolol',
  brandNames: ['Lopressor', 'Toprol XL'],
  therapeuticClass: '11. Cardiovascular --- Antihypertensive',
  dosingRegimens: ['Renal Impairment: No adjustment', 'Overdose: Give glucagon'],
} as Partial<TopDrugClinicalMonograph>;

const fallbackResult = resolveClinicalIndications(fallbackMonoFallback(monographFallback));
assert.deepStrictEqual(
  fallbackResult,
  ['Antihypertensive'],
  'Should fall back to therapeuticClass stripped label ["Antihypertensive"]'
);

function fallbackMonoFallback(p: Partial<TopDrugClinicalMonograph>): TopDrugClinicalMonograph {
  return p as TopDrugClinicalMonograph;
}

const monographSimpleFallback = {
  genericName: 'Acetaminophen',
  therapeuticClass: '1. Analgesic',
  dosingRegimens: [],
} as unknown as TopDrugClinicalMonograph;

const simpleFallbackResult = resolveClinicalIndications(monographSimpleFallback);
assert.deepStrictEqual(
  simpleFallbackResult,
  ['Analgesic'],
  'Should fall back to simple therapeuticClass stripped label ["Analgesic"]'
);

// -------------------------------------------------------------
// 3. Component Rendering Tests for TopDrugClinicalCard
// -------------------------------------------------------------
const sampleMonograph: TopDrugClinicalMonograph = {
  genericName: 'Lisinopril',
  brandNames: ['Prinivil', 'Zestril'],
  pharmacologicClass: 'ACE Inhibitor',
  therapeuticClass: '11. Cardiovascular --- Antihypertensive',
  mechanismOfAction: 'Competitive inhibitor of angiotensin-converting enzyme (ACE)...',
  dosingRegimens: [
    'Hypertension monotherapy: 10 mg PO once daily',
    'Heart failure: 2.5-5 mg PO once daily',
  ],
  sideEffects: {
    common: ['Dry cough', 'Dizziness', 'Headache'],
    severe: ['Angioedema', 'Hyperkalemia'],
  },
  contraindications: ['Pregnancy', 'History of angioedema'],
  blackBoxWarning: 'FETAL TOXICITY: Can cause injury and death to developing fetus.',
  drugInteractions: {
    major: ['Sacubitril/Valsartan'],
    common: ['Potassium supplements'],
  },
  monitoringParameters: ['Serum potassium', 'Blood pressure', 'BUN/Scr'],
  dosageForms: ['Oral Tablet: 2.5 mg, 5 mg, 10 mg, 20 mg, 30 mg, 40 mg'],
  administrationAndCounseling: ['Take once daily with or without food.'],
};

// Back face rendered with isFlipped = true
const backHtml = renderToStaticMarkup(
  React.createElement(TopDrugClinicalCard, {
    monograph: sampleMonograph,
    isFlipped: true,
  })
);

// A. ClinicalReferenceToolbar is rendered on back face
assert.ok(
  backHtml.includes('Clinical Pharmacology &amp; References:') ||
    backHtml.includes('Clinical Pharmacology & References:'),
  'Back face must render ClinicalReferenceToolbar header'
);
assert.ok(
  backHtml.includes('Lexicomp') && backHtml.includes('AccessPharmacy'),
  'Back face must render launchpad links in ClinicalReferenceToolbar'
);
assert.ok(
  backHtml.includes('Clinical Info Box'),
  'Back face must render Clinical Info Box button in ClinicalReferenceToolbar'
);

// B. Approved Indications strip is rendered in Tab 1 (Pharmacology)
assert.ok(
  backHtml.includes('Approved Clinical Indications') || backHtml.includes('Approved Indications'),
  'Back face Tab 1 must render Approved Clinical Indications section'
);
assert.ok(
  backHtml.includes('Hypertension'),
  'Approved Clinical Indications section must contain "Hypertension" badge'
);
assert.ok(
  backHtml.includes('Heart failure'),
  'Approved Clinical Indications section must contain "Heart failure" badge'
);

// C. Front face rendered with isFlipped = false
const frontHtml = renderToStaticMarkup(
  React.createElement(TopDrugClinicalCard, {
    monograph: sampleMonograph,
    isFlipped: false,
  })
);

// Verify Active Recall Blinding: no launchpad, no indications, no brand names on front face
assert.ok(
  !frontHtml.includes('Clinical Pharmacology & References:'),
  'Front face must NOT render ClinicalReferenceToolbar'
);
assert.ok(
  !frontHtml.includes('Approved Clinical Indications'),
  'Front face must NOT render Approved Clinical Indications'
);
assert.ok(
  !frontHtml.includes('Prinivil') && !frontHtml.includes('Zestril'),
  'Front face must NOT leak brand names (active recall blinding)'
);
assert.ok(
  frontHtml.includes('Lisinopril'),
  'Front face must render generic name prompt'
);

console.log('All Indications Extraction & Top 200 Flashcards Integration tests passed!');
