import assert from 'node:assert';
import { TOP_DRUGS_TAXONOMY, THERAPEUTIC_CATEGORIES } from '../src/data/topDrugsTaxonomyData.js';

// Verify all 39 therapeutic classes are represented
assert.strictEqual(THERAPEUTIC_CATEGORIES.length, 39, 'Must define exactly 39 therapeutic categories');

// Verify Category 1 (Analgesic)
const cat1 = THERAPEUTIC_CATEGORIES.find((c) => c.classNumber === 1);
assert.ok(cat1, 'Category 1 must exist');
assert.ok(cat1.categoryName.includes('Analgesic'));

// Verify Category 2 (Antibiotic) and specific subclasses
const cat2 = THERAPEUTIC_CATEGORIES.find((c) => c.classNumber === 2);
assert.ok(cat2, 'Category 2 must exist');
assert.ok(cat2.specificSubclasses.includes('1st Generation Cephalosporin'));

// Verify drug entries
const cephalexin = TOP_DRUGS_TAXONOMY.find((d) => d.genericName.toLowerCase() === 'cephalexin');
assert.ok(cephalexin, 'Cephalexin must be in catalog');
assert.strictEqual(cephalexin.therapeuticClassNumber, 2);
assert.ok(cephalexin.brandNames.includes('Keflex'));
assert.strictEqual(cephalexin.broadPharmacologicClass, 'Cephalosporin');
assert.strictEqual(cephalexin.specificPharmacologicClass, '1st Generation Cephalosporin');

// Verify Category 11 (Cardiovascular --- Antihypertensive)
const furosemide = TOP_DRUGS_TAXONOMY.find((d) => d.genericName.toLowerCase() === 'furosemide');
assert.ok(furosemide, 'Furosemide must be in catalog');
assert.strictEqual(furosemide.therapeuticClassNumber, 11);
assert.ok(furosemide.brandNames.includes('Lasix'));
assert.strictEqual(furosemide.specificPharmacologicClass, 'Loop Diuretic');

// Verify all 39 class numbers exist in sequence 1..39
for (let i = 1; i <= 39; i++) {
  const cat = THERAPEUTIC_CATEGORIES.find((c) => c.classNumber === i);
  assert.ok(cat, `Category ${i} must exist in THERAPEUTIC_CATEGORIES`);
  assert.ok(cat.categoryName.length > 0, `Category ${i} must have a name`);
  assert.ok(cat.broadClasses.length > 0, `Category ${i} must have broadClasses`);
  assert.ok(cat.specificSubclasses.length > 0, `Category ${i} must have specificSubclasses`);
  assert.ok(cat.totalDrugs > 0, `Category ${i} must have totalDrugs > 0`);
}

// Verify catalog completeness (> 200 drugs)
assert.ok(TOP_DRUGS_TAXONOMY.length >= 200, 'Must have at least 200 top drug entries');

// Verify all entries have valid fields
for (const drug of TOP_DRUGS_TAXONOMY) {
  assert.ok(drug.genericName, 'Drug must have a genericName');
  assert.ok(Array.isArray(drug.brandNames) && drug.brandNames.length > 0, `${drug.genericName} must have brandNames`);
  assert.ok(drug.therapeuticClassNumber >= 1 && drug.therapeuticClassNumber <= 39, `${drug.genericName} class number out of bounds`);
  assert.ok(drug.therapeuticCategory, `${drug.genericName} must have therapeuticCategory`);
  assert.ok(drug.broadPharmacologicClass, `${drug.genericName} must have broadPharmacologicClass`);
  assert.ok(drug.specificPharmacologicClass, `${drug.genericName} must have specificPharmacologicClass`);
}

console.log('✓ Top Drugs taxonomy catalog tests passed');
