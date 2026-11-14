import assert from 'node:assert';
import { TOP_DRUGS_TAXONOMY } from '../src/data/topDrugsTaxonomyData.js';
import {
  resolveTopDrugStructureRecord,
  resolveSmilesForEntry,
  getTop200Flashcards,
} from '../src/utils/topDrugsTaxonomy.js';
import {
  TOP_DRUGS_SMILES_CATALOG,
  type TopDrugStructureRecord,
} from '../src/data/topDrugsSmilesData.js';

console.log('Running Top Drugs SMILES & Multi-Component Structure Tests...');

// 1. Catalog completeness and coverage
assert.strictEqual(
  TOP_DRUGS_TAXONOMY.length,
  250,
  'TOP_DRUGS_TAXONOMY must contain exactly 250 drugs'
);

// 2. Test all 250 drugs for zero fallback benzene rings and valid records
let benzeneFallbackCount = 0;
let missingRecordCount = 0;

for (const entry of TOP_DRUGS_TAXONOMY) {
  const smiles = resolveSmilesForEntry(entry);
  assert.ok(
    typeof smiles === 'string' && smiles.trim().length > 0,
    `Drug "${entry.genericName}" must have a non-empty SMILES string`
  );

  if (smiles === 'c1ccccc1') {
    benzeneFallbackCount++;
  }

  const record: TopDrugStructureRecord = resolveTopDrugStructureRecord(entry);
  if (!record) {
    missingRecordCount++;
    continue;
  }

  assert.ok(
    record.genericName,
    `Drug "${entry.genericName}" record must have a genericName`
  );
  assert.ok(
    ['single-molecule', 'multi-component', 'biologic'].includes(record.structureType),
    `Drug "${entry.genericName}" must have valid structureType (got "${record.structureType}")`
  );
  assert.ok(
    typeof record.smiles === 'string' && record.smiles.length > 0,
    `Drug "${entry.genericName}" record must have non-empty smiles`
  );
}

assert.strictEqual(
  missingRecordCount,
  0,
  `Every drug in TOP_DRUGS_TAXONOMY must resolve a TopDrugStructureRecord (missing: ${missingRecordCount})`
);

assert.strictEqual(
  benzeneFallbackCount,
  0,
  `Zero drugs out of 250 may resolve to fallback benzene ring "c1ccccc1" (found: ${benzeneFallbackCount})`
);

// 3. Multi-component combination drug assertions (16 combinations)
const EXPECTED_COMBINATIONS = [
  'Acetaminophen / Butalbital / Caffeine',
  'Hydrocodone / Acetaminophen',
  'Buprenorphine / Naloxone',
  'Amoxicillin / Potassium Clavulanate',
  'Trimethoprim / Sulfamethoxazole',
  'Divalproex / Valproic Acid',
  'Clotrimazole / Betamethasone',
  'Triamterene / Hydrochlorothiazide',
  'Metoprolol Tartrate / Succinate',
  'Carbidopa / Levodopa',
  'Emtricitabine / Tenofovir',
  'Diphenoxylate / Atropine',
  'Fluticasone / Salmeterol',
  'Budesonide / Formoterol',
  'Ipratropium / Albuterol',
  'Amphetamine / Dextroamphetamine',
];

for (const comboName of EXPECTED_COMBINATIONS) {
  const entry = TOP_DRUGS_TAXONOMY.find((e) => e.genericName === comboName);
  assert.ok(entry, `Combination drug "${comboName}" must exist in TOP_DRUGS_TAXONOMY`);

  const record = resolveTopDrugStructureRecord(entry);
  assert.strictEqual(
    record.structureType,
    'multi-component',
    `"${comboName}" must have structureType === 'multi-component'`
  );
  assert.ok(
    Array.isArray(record.components),
    `"${comboName}" must have components array`
  );
  assert.ok(
    record.components.length >= 2,
    `"${comboName}" must have at least 2 components (found: ${record.components.length})`
  );

  for (const part of record.components) {
    assert.ok(
      part.componentName && part.componentName.trim().length > 0,
      `"${comboName}" component must have non-empty componentName`
    );
    assert.ok(
      part.smiles && part.smiles.trim().length > 0,
      `"${comboName}" component "${part.componentName}" must have non-empty smiles`
    );
    assert.notStrictEqual(
      part.smiles,
      'c1ccccc1',
      `"${comboName}" component "${part.componentName}" must not be fallback benzene`
    );
  }
}

// 4. Biologics & macromolecules assertions (9 catalog biologics)
const EXPECTED_BIOLOGICS = [
  'Insulin Lispro',
  'Insulin Aspart',
  'Regular Human Insulin',
  'Insulin Glargine',
  'Insulin Degludec',
  'Epoetin Alfa',
  'Etanercept',
  'Adalimumab',
  'Denosumab',
];

for (const biologicName of EXPECTED_BIOLOGICS) {
  const entry = TOP_DRUGS_TAXONOMY.find((e) => e.genericName === biologicName);
  assert.ok(entry, `Biologic "${biologicName}" must exist in TOP_DRUGS_TAXONOMY`);

  const record = resolveTopDrugStructureRecord(entry);
  assert.strictEqual(
    record.structureType,
    'biologic',
    `"${biologicName}" must have structureType === 'biologic'`
  );
  assert.ok(
    typeof record.biologicDescription === 'string' &&
      record.biologicDescription.trim().length > 0,
    `"${biologicName}" must have non-empty biologicDescription`
  );
}

// 5. Flashcard item enrichment check
const flashcards = getTop200Flashcards();
assert.strictEqual(
  flashcards.length,
  250,
  `Flashcard generator must produce 250 cards (got: ${flashcards.length})`
);

for (const card of flashcards) {
  assert.ok(
    card.structure.structureRecord,
    `Flashcard "${card.drugName}" must have structureRecord enriched on structure`
  );
  assert.strictEqual(
    card.structure.structureRecord.genericName,
    card.drugName,
    `Flashcard "${card.drugName}" structureRecord.genericName must match drugName`
  );
  assert.strictEqual(
    card.structure.canonicalSmiles,
    card.structure.structureRecord.smiles,
    `Flashcard "${card.drugName}" canonicalSmiles must match structureRecord.smiles`
  );
}

// 6. Direct lookup from TOP_DRUGS_SMILES_CATALOG
assert.ok(
  Object.keys(TOP_DRUGS_SMILES_CATALOG).length >= 250,
  `TOP_DRUGS_SMILES_CATALOG must have at least 250 records (got: ${Object.keys(TOP_DRUGS_SMILES_CATALOG).length})`
);

console.log('✓ All Top Drugs SMILES & Multi-Component Structure Tests Passed!');
