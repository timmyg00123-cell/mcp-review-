import assert from 'node:assert';
import { TOP_DRUGS_TAXONOMY, type TopDrugEntry } from '../src/data/topDrugsTaxonomyData.js';
import {
  TOP_DRUGS_CLINICAL_CATALOG,
  resolveTopDrugClinicalMonograph,
  getTopDrugClinicalMonograph,
  type TopDrugClinicalMonograph,
} from '../src/data/topDrugsClinicalData.js';

console.log('Running Top Drugs Clinical Monograph Tests...');

// 1. Catalog count verification
assert.strictEqual(
  TOP_DRUGS_TAXONOMY.length,
  250,
  'TOP_DRUGS_TAXONOMY must contain exactly 250 drugs'
);

assert.ok(
  TOP_DRUGS_CLINICAL_CATALOG && typeof TOP_DRUGS_CLINICAL_CATALOG === 'object',
  'TOP_DRUGS_CLINICAL_CATALOG must be an exported object dictionary'
);

// 2. Completeness across all 250 drugs
let totalDrugs = 0;
let blackBoxWarningCount = 0;

for (const entry of TOP_DRUGS_TAXONOMY) {
  totalDrugs++;
  const monograph: TopDrugClinicalMonograph = resolveTopDrugClinicalMonograph(entry);

  assert.ok(
    monograph,
    `Drug "${entry.genericName}" must resolve to a valid TopDrugClinicalMonograph`
  );

  // Helper also accessible via getTopDrugClinicalMonograph
  const lookupMonograph = getTopDrugClinicalMonograph(entry.genericName);
  assert.ok(
    lookupMonograph,
    `getTopDrugClinicalMonograph("${entry.genericName}") must return a valid monograph`
  );

  // Domain 1: Generic Name and Brand Names
  assert.strictEqual(
    monograph.genericName,
    entry.genericName,
    `Monograph genericName "${monograph.genericName}" must match entry genericName "${entry.genericName}"`
  );
  assert.ok(
    Array.isArray(monograph.brandNames) && monograph.brandNames.length > 0,
    `Drug "${entry.genericName}" must have at least one brand name`
  );

  // Domain 2: Pharmacologic Class
  assert.ok(
    typeof monograph.pharmacologicClass === 'string' && monograph.pharmacologicClass.trim().length > 2,
    `Drug "${entry.genericName}" must have a valid pharmacologicClass`
  );

  // Domain 3: Therapeutic Class
  assert.ok(
    typeof monograph.therapeuticClass === 'string' && monograph.therapeuticClass.trim().length > 2,
    `Drug "${entry.genericName}" must have a valid therapeuticClass`
  );

  // Domain 4: Detailed Mechanism of Action
  assert.ok(
    typeof monograph.mechanismOfAction === 'string' && monograph.mechanismOfAction.trim().length >= 15,
    `Drug "${entry.genericName}" must have a detailed mechanismOfAction (>= 15 characters, got "${monograph.mechanismOfAction}")`
  );

  // Domain 5: Dosing Regimens
  assert.ok(
    Array.isArray(monograph.dosingRegimens) && monograph.dosingRegimens.length > 0,
    `Drug "${entry.genericName}" must have non-empty dosingRegimens array`
  );
  for (const regimen of monograph.dosingRegimens) {
    assert.ok(
      typeof regimen === 'string' && regimen.trim().length > 0,
      `Drug "${entry.genericName}" dosingRegimen entry must be non-empty string`
    );
  }

  // Domain 6: Side Effects (common and optional severe)
  assert.ok(
    monograph.sideEffects && typeof monograph.sideEffects === 'object',
    `Drug "${entry.genericName}" must have sideEffects object`
  );
  assert.ok(
    Array.isArray(monograph.sideEffects.common) && monograph.sideEffects.common.length > 0,
    `Drug "${entry.genericName}" must have at least one common side effect`
  );
  if (monograph.sideEffects.severe) {
    assert.ok(
      Array.isArray(monograph.sideEffects.severe) && monograph.sideEffects.severe.length > 0,
      `Drug "${entry.genericName}" severe side effects must be non-empty if present`
    );
  }

  // Domain 7: Contraindications
  assert.ok(
    Array.isArray(monograph.contraindications) && monograph.contraindications.length > 0,
    `Drug "${entry.genericName}" must have non-empty contraindications array`
  );
  for (const ci of monograph.contraindications) {
    assert.ok(
      typeof ci === 'string' && ci.trim().length > 0,
      `Drug "${entry.genericName}" contraindication item must be non-empty string`
    );
  }

  // Domain 8: Drug Interactions (major and common)
  assert.ok(
    monograph.drugInteractions && typeof monograph.drugInteractions === 'object',
    `Drug "${entry.genericName}" must have drugInteractions object`
  );
  assert.ok(
    Array.isArray(monograph.drugInteractions.major) && monograph.drugInteractions.major.length > 0,
    `Drug "${entry.genericName}" must have at least one major drug interaction`
  );
  assert.ok(
    Array.isArray(monograph.drugInteractions.common) && monograph.drugInteractions.common.length > 0,
    `Drug "${entry.genericName}" must have at least one common drug interaction`
  );

  // Domain 9: Monitoring Parameters
  assert.ok(
    Array.isArray(monograph.monitoringParameters) && monograph.monitoringParameters.length > 0,
    `Drug "${entry.genericName}" must have non-empty monitoringParameters array`
  );
  for (const mp of monograph.monitoringParameters) {
    assert.ok(
      typeof mp === 'string' && mp.trim().length > 0,
      `Drug "${entry.genericName}" monitoring parameter must be non-empty string`
    );
  }

  // Domain 10: Dosage Forms
  assert.ok(
    Array.isArray(monograph.dosageForms) && monograph.dosageForms.length > 0,
    `Drug "${entry.genericName}" must have non-empty dosageForms array`
  );
  for (const df of monograph.dosageForms) {
    assert.ok(
      typeof df === 'string' && df.trim().length > 0,
      `Drug "${entry.genericName}" dosage form must be non-empty string`
    );
  }

  // Domain 11: Black Box Warning (optional string)
  if (monograph.blackBoxWarning !== undefined) {
    assert.ok(
      typeof monograph.blackBoxWarning === 'string' && monograph.blackBoxWarning.trim().length > 10,
      `Drug "${entry.genericName}" blackBoxWarning if present must be non-empty string (> 10 chars)`
    );
    blackBoxWarningCount++;
  }

  // Domain 12: Administration and Counseling
  assert.ok(
    Array.isArray(monograph.administrationAndCounseling) && monograph.administrationAndCounseling.length > 0,
    `Drug "${entry.genericName}" must have non-empty administrationAndCounseling array`
  );
  for (const counsel of monograph.administrationAndCounseling) {
    assert.ok(
      typeof counsel === 'string' && counsel.trim().length > 0,
      `Drug "${entry.genericName}" administrationAndCounseling item must be non-empty string`
    );
  }
}

assert.strictEqual(totalDrugs, 250, 'Must have evaluated all 250 drugs');
assert.ok(blackBoxWarningCount > 30, `Expected at least 30 Black Box Warnings across top 250 drugs (got ${blackBoxWarningCount})`);

// 3. Specific Black Box Warning Tests for Key Medications
const bbwChecks: Record<string, string | RegExp> = {
  Metformin: /lactic acidosis/i,
  Lisinopril: /fetal/i,
  Warfarin: /bleeding|hemorrhage/i,
  'Hydrocodone / Acetaminophen': /hepatotoxicity|respiratory depression|addiction|abuse/i,
  Citalopram: /suicid/i,
  Fluoxetine: /suicid/i,
  Spironolactone: /tumorigen|tumor|carcinogen|animal/i,
  Montelukast: /neuropsychiatric|behavior|suicid/i,
  Ciprofloxacin: /tendon|tendinitis|neuropathy/i,
  Methotrexate: /bone marrow|hepatotox|death|fetal/i,
  Levofloxacin: /tendon|tendinitis|neuropathy/i,
  Enalapril: /fetal/i,
  Losartan: /fetal/i,
  Celecoxib: /cardiovascular|thrombotic|gastrointestinal/i,
  'Amphetamine / Dextroamphetamine': /abuse|dependen/i,
  Pioglitazone: /heart failure/i,
  Liraglutide: /thyroid|c-cell/i,
  Semaglutide: /thyroid|c-cell/i,
  Clozapine: /agranulocytosis|neutropenia|myocarditis/i,
  Oxycodone: /addiction|abuse|respiratory/i,
  Fentanyl: /addiction|respiratory|abuse/i,
  Levothyroxine: /obesity|weight/i,
};

for (const [drugName, pattern] of Object.entries(bbwChecks)) {
  const drug = TOP_DRUGS_TAXONOMY.find((d) => d.genericName.toLowerCase() === drugName.toLowerCase());
  assert.ok(drug, `Known BBW check drug "${drugName}" must be in TOP_DRUGS_TAXONOMY`);
  const monograph = resolveTopDrugClinicalMonograph(drug!);
  assert.ok(
    monograph.blackBoxWarning,
    `Drug "${drugName}" MUST have a blackBoxWarning defined`
  );
  assert.match(
    monograph.blackBoxWarning!,
    typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern,
    `Drug "${drugName}" blackBoxWarning must match expected warning clinical concept`
  );
}

// 4. Specific Non-Black Box Warning Tests (suppressed / undefined)
const nonBbwDrugs = [
  'Amoxicillin',
  'Cephalexin',
  'Omeprazole',
  'Atorvastatin',
  'Gabapentin',
  'Hydrochlorothiazide',
  'Loratadine',
  'Cetirizine',
  'Latanoprost',
  'Docusate',
  'Polyethylene Glycol (PEG)',
  'Albuterol',
  'Amlodipine',
];

for (const drugName of nonBbwDrugs) {
  const drug = TOP_DRUGS_TAXONOMY.find((d) => d.genericName.toLowerCase() === drugName.toLowerCase());
  assert.ok(drug, `Known non-BBW check drug "${drugName}" must be in TOP_DRUGS_TAXONOMY`);
  const monograph = resolveTopDrugClinicalMonograph(drug!);
  assert.strictEqual(
    monograph.blackBoxWarning,
    undefined,
    `Drug "${drugName}" must NOT have a blackBoxWarning (must be undefined)`
  );
}

// 5. Robust normalization and fallback test
const dummyEntry: TopDrugEntry = {
  genericName: 'Novel Synthetic Molecule X',
  brandNames: ['NovelX'],
  therapeuticClassNumber: 99,
  therapeuticCategory: '99. Experimental Agent',
  broadPharmacologicClass: 'Novel Scaffold',
  specificPharmacologicClass: 'First-in-Class Allosteric Modulator',
};

const synthesized = resolveTopDrugClinicalMonograph(dummyEntry);
assert.ok(synthesized, 'Fallback synthesizer must handle uncatalogued entries gracefully');
assert.strictEqual(synthesized.genericName, 'Novel Synthetic Molecule X');
assert.deepStrictEqual(synthesized.brandNames, ['NovelX']);
assert.ok(synthesized.dosingRegimens.length > 0);
assert.ok(synthesized.sideEffects.common.length > 0);
assert.ok(synthesized.contraindications.length > 0);
assert.ok(synthesized.drugInteractions.major.length > 0);
assert.ok(synthesized.monitoringParameters.length > 0);
assert.ok(synthesized.dosageForms.length > 0);
assert.ok(synthesized.administrationAndCounseling.length > 0);
assert.strictEqual(synthesized.blackBoxWarning, undefined);

console.log('✓ All Top Drugs Clinical Monograph Tests Passed!');
