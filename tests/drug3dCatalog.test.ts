import assert from 'node:assert/strict';
import { THERAPEUTIC_CATEGORIES } from '../src/data/topDrugsTaxonomyData';
import {
  DRUG_3D_CATALOG,
  THERAPEUTIC_CLASS_3D_GROUPS,
  getDrug3DById,
  resolveDrug3DEntry,
} from '../src/data/drug3dCatalog';

async function runTests() {
  // 1. All 39 therapeutic classes (1..39) exist in exact curriculum order and each has >= 1 3D drug
  assert.equal(THERAPEUTIC_CLASS_3D_GROUPS.length, 39, 'All 39 therapeutic classes must be populated');
  THERAPEUTIC_CLASS_3D_GROUPS.forEach((group, idx) => {
    assert.equal(group.classNumber, idx + 1);
    assert.equal(group.categoryName, THERAPEUTIC_CATEGORIES[idx].categoryName);
    assert.ok(group.drugs.length >= 1, `Class ${group.categoryName} must contain at least 1 3D drug`);
  });

  // 2. Aspirin maps to inactivated COX-1 (1PTH, SAL, exact crystal) in Class 1 with Ser530 & Arg120 sites
  const aspirin = resolveDrug3DEntry('Aspirin');
  assert.ok(aspirin, 'Aspirin must resolve in catalog');
  assert.equal(aspirin.pdbId, '1PTH');
  assert.equal(aspirin.ligandCode, 'SAL');
  assert.equal(aspirin.therapeuticClassNumber, 1);
  assert.equal(aspirin.isExactDrugCrystal, true);
  assert.ok(aspirin.bindingSites.length >= 2 && aspirin.bindingSites.length <= 4);
  assert.ok(aspirin.bindingSites.some((s) => s.residues.some((r) => r.resi === 530)));

  // 3. Clopidogrel, Lisinopril, Captopril, Atorvastatin, Losartan, Semaglutide, Fondaparinux resolve with verified PDBs & modes
  const clopidogrel = getDrug3DById('clopidogrel');
  assert.ok(clopidogrel && clopidogrel.pdbId === '4NTJ' && clopidogrel.prodrugNote);
  assert.equal(resolveDrug3DEntry('Lisinopril')?.pdbId, '1O86');
  assert.equal(resolveDrug3DEntry('Captopril')?.pdbId, '1UZF');
  assert.equal(resolveDrug3DEntry('Atorvastatin')?.pdbId, '1HWK');
  const losartan = resolveDrug3DEntry('Losartan');
  assert.ok(losartan && losartan.pdbId === '4ZUD' && losartan.isExactDrugCrystal === false);
  assert.equal(resolveDrug3DEntry('Semaglutide')?.ligandMode, 'chain');
  assert.equal(resolveDrug3DEntry('Fondaparinux')?.ligandMode, 'carbs');

  // 4. Supplemental clinical review-module drugs appear in their assigned 1..39 class
  for (const [name, expectedClass] of [
    ['Prasugrel', 13],
    ['Ticagrelor', 13],
    ['Tirofiban', 13],
    ['Vorapaxar', 13],
    ['Argatroban', 12],
    ['Sacubitril', 11],
    ['Milrinone', 11],
    ['Dobutamine', 11],
    ['Aliskiren', 11],
    ['Acetazolamide', 11],
    ['Tolvaptan', 11],
    ['Quinidine', 14],
    ['Flecainide', 14],
    ['Sotalol', 14],
    ['Vilanterol', 36],
    ['Roflumilast', 36],
  ] as const) {
    const entry = resolveDrug3DEntry(name);
    assert.ok(entry, `Review-module drug ${name} must exist in catalog`);
    assert.equal(entry.therapeuticClassNumber, expectedClass, `${name} must belong to class ${expectedClass}`);
  }

  // 5. Combination splitting & route/salt deduplication
  assert.ok(resolveDrug3DEntry('Trimethoprim'), 'Trimethoprim split into standalone entry');
  assert.ok(resolveDrug3DEntry('Sulfamethoxazole'), 'Sulfamethoxazole split into standalone entry');
  assert.ok(resolveDrug3DEntry('Clavulanate'), 'Clavulanate split into standalone entry');
  const class36Names = THERAPEUTIC_CLASS_3D_GROUPS[35].drugs.map((d) => d.genericName);
  assert.equal(class36Names.filter((n) => n === 'Fluticasone').length, 1, 'Fluticasone route duplicates merged');
  assert.ok(!DRUG_3D_CATALOG.some((d) => d.genericName.includes(' / ')), 'No slash-combined multi-drug entries in dropdowns');

  // 6. Exclusions: non-receptor osmotics/electrolytes, biologics/insulins, quiz distractors, standalone metabolites
  for (const excluded of [
    'Mannitol',
    'Potassium Chloride',
    'Polyethylene Glycol (PEG)',
    'Docusate',
    'Cholestyramine',
    'Insulin Glargine',
    'Adalimumab',
    'Alteplase',
    'Structure X',
    'Structure Y',
    'Structure Z',
  ]) {
    assert.ok(
      !DRUG_3D_CATALOG.some((d) => d.genericName.toLowerCase() === excluded.toLowerCase()),
      `${excluded} must be excluded from browse dropdowns`
    );
  }

  // 7. Review Focus: Salt suffixes, brands, combinations, and active-metabolite aliases resolve via resolveDrug3DEntry
  assert.equal(resolveDrug3DEntry('Metoprolol Succinate')?.genericName, 'Metoprolol');
  assert.equal(resolveDrug3DEntry('Plavix')?.genericName, 'Clopidogrel');
  assert.equal(resolveDrug3DEntry('Trimethoprim / Sulfamethoxazole')?.genericName, 'Trimethoprim');
  assert.equal(resolveDrug3DEntry('Dabigatran etexilate')?.genericName, 'Dabigatran');
  assert.equal(resolveDrug3DEntry('EXP3174')?.genericName, 'Losartan');
  assert.equal(resolveDrug3DEntry('Enalaprilat')?.genericName, 'Enalapril');

  // 8. Every catalog entry has 4-char PDB ID, non-empty ligandCode, and 2..4 valid binding sites
  for (const entry of DRUG_3D_CATALOG) {
    assert.match(entry.pdbId, /^[A-Z0-9]{4}$/, `Invalid PDB ID on ${entry.genericName}`);
    assert.ok(entry.ligandCode.length >= 1 && entry.ligandCode.length <= 5, `Invalid ligandCode on ${entry.genericName}`);
    assert.ok(
      entry.bindingSites.length >= 2 && entry.bindingSites.length <= 4,
      `${entry.genericName} must have 2..4 binding sites`
    );
    assert.ok(entry.overallMechanism.length > 20, `${entry.genericName} must have plain-language overallMechanism`);
  }

  console.log('PASS: tests/drug3dCatalog.test.ts');
}

runTests();
