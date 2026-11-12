import 'fake-indexeddb/auto';
import assert from 'node:assert';
import {
  normalizeDrugBaseName,
  fetchClinicalDossier,
  type ClinicalDossierRecord,
} from '../src/services/clinicalDossierService';
import { db } from '../src/db/db';

console.log('Testing Clinical Dossier Service & Dexie Storage...');

async function runTests() {
  // --------------------------------------------------------------------------
  // Test 1: normalizeDrugBaseName
  // --------------------------------------------------------------------------
  console.log('1. Testing normalizeDrugBaseName...');
  assert.strictEqual(normalizeDrugBaseName('Clopidogrel bisulfate'), 'clopidogrel');
  assert.strictEqual(normalizeDrugBaseName('Losartan potassium'), 'losartan');
  assert.strictEqual(normalizeDrugBaseName('Tirofiban hydrochloride'), 'tirofiban');
  assert.strictEqual(normalizeDrugBaseName('Atorvastatin Calcium'), 'atorvastatin');
  assert.strictEqual(normalizeDrugBaseName('Metoprolol succinate'), 'metoprolol');
  assert.strictEqual(normalizeDrugBaseName('Aspirin'), 'aspirin');
  assert.strictEqual(normalizeDrugBaseName('  WARFARIN SODIUM  '), 'warfarin');
  assert.strictEqual(normalizeDrugBaseName(''), '');

  // --------------------------------------------------------------------------
  // Test 2: fetchClinicalDossier with mocked APIs
  // --------------------------------------------------------------------------
  console.log('2. Testing fetchClinicalDossier with mocked external APIs...');
  
  // Clear any existing dossiers from indexedDB
  await db.clinicalDossiers.clear();

  const originalFetch = globalThis.fetch;
  let fetchCallCount = 0;

  // Mock fetch router for OpenFDA, RxNav, and StatPearls
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    fetchCallCount++;
    const urlStr = String(input);

    if (urlStr.includes('api.fda.gov/drug/label.json')) {
      return new Response(JSON.stringify({
        results: [{
          boxed_warning: ['WARNING: DIMINISHED ANTIPLATELET EFFECT IN PATIENTS WITH TWO LOSS-OF-FUNCTION ALLELES OF CYP2C19'],
          indications_and_usage: ['Acute Coronary Syndrome (ACS)', 'Recent MI, Recent Stroke, or Established Peripheral Arterial Disease'],
          openfda: {
            dosage_form: ['TABLET', 'FILM COATED'],
          },
        }]
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (urlStr.includes('rxnav.nlm.nih.gov/REST/rxcui.json')) {
      return new Response(JSON.stringify({
        idGroup: {
          rxnormId: ['32968']
        }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (urlStr.includes('rxnav.nlm.nih.gov/REST/rxcui/32968/allProperties.json')) {
      return new Response(JSON.stringify({
        propConceptGroup: {
          propConcept: [
            { propCategory: 'NAMES', propName: 'RxNorm Name', propValue: 'clopidogrel' },
            { propCategory: 'NAMES', propName: 'BN', propValue: 'Plavix' },
            { propCategory: 'NAMES', propName: 'SY', propValue: 'Iscover' }
          ]
        }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    if (urlStr.includes('eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi')) {
      return new Response(JSON.stringify({
        esearchresult: {
          idlist: ['NBK559012']
        }
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  };

  try {
    const dossier = await fetchClinicalDossier('Clopidogrel bisulfate');

    assert.strictEqual(dossier.genericName, 'clopidogrel');
    assert.ok(dossier.dailyMed, 'DailyMed section should be defined');
    assert.ok(dossier.dailyMed.boxedWarning?.includes('CYP2C19'));
    assert.ok(dossier.dailyMed.indications?.length === 2);
    assert.deepStrictEqual(dossier.dailyMed.dosageForms, ['TABLET', 'FILM COATED']);
    assert.ok(dossier.dailyMed.splWebUrl?.includes('dailymed.nlm.nih.gov'));

    assert.ok(dossier.rxNorm, 'RxNorm section should be defined');
    assert.strictEqual(dossier.rxNorm.rxcui, '32968');
    assert.ok(dossier.rxNorm.brandNames.includes('Plavix'));
    assert.ok(dossier.rxNorm.synonyms.includes('Iscover'));

    assert.ok(dossier.statPearls, 'StatPearls section should be defined');
    assert.strictEqual(dossier.statPearls.bookshelfUid, 'NBK559012');
    assert.strictEqual(dossier.statPearls.bookshelfUrl, 'https://www.ncbi.nlm.nih.gov/books/NBK559012/');

    // Check Dexie persistence
    const saved = await db.clinicalDossiers.where('genericName').equals('clopidogrel').first();
    assert.ok(saved, 'Dossier must be saved in Dexie');
    assert.strictEqual(saved.genericName, 'clopidogrel');

    // --------------------------------------------------------------------------
    // Test 3: Dexie Cache Hit (< 7 days)
    // --------------------------------------------------------------------------
    console.log('3. Testing Dexie caching (< 7 days)...');
    const initialCallCount = fetchCallCount;
    const cachedDossier = await fetchClinicalDossier('clopidogrel');
    assert.strictEqual(fetchCallCount, initialCallCount, 'Cache hit should not trigger external fetch calls');
    assert.strictEqual(cachedDossier.genericName, 'clopidogrel');

    // --------------------------------------------------------------------------
    // Test 4: Expired Cache (> 7 days) Triggers Re-fetch
    // --------------------------------------------------------------------------
    console.log('4. Testing expired cache re-fetch...');
    await db.clinicalDossiers.where('genericName').equals('clopidogrel').modify({
      lastUpdated: Date.now() - (8 * 24 * 60 * 60 * 1000) // 8 days ago
    });

    const refreshedDossier = await fetchClinicalDossier('Clopidogrel');
    assert.ok(fetchCallCount > initialCallCount, 'Expired cache should trigger fresh fetch');
    assert.strictEqual(refreshedDossier.genericName, 'clopidogrel');

    // --------------------------------------------------------------------------
    // Test 5: Partial API failure handling
    // --------------------------------------------------------------------------
    console.log('5. Testing resilience when external APIs fail...');
    globalThis.fetch = async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('api.fda.gov')) {
        throw new Error('OpenFDA network timeout');
      }
      if (url.includes('rxnav.nlm.nih.gov')) {
        return new Response(JSON.stringify({ idGroup: {} }), { status: 200 });
      }
      if (url.includes('eutils.ncbi.nlm.nih.gov')) {
        return new Response(JSON.stringify({ esearchresult: { idlist: ['NBK123456'] } }), { status: 200 });
      }
      return new Response(JSON.stringify({}), { status: 404 });
    };

    const partialDossier = await fetchClinicalDossier('Tirofiban hydrochloride');
    assert.strictEqual(partialDossier.genericName, 'tirofiban');
    assert.strictEqual(partialDossier.dailyMed, undefined, 'DailyMed should gracefully be undefined on failure');
    assert.strictEqual(partialDossier.rxNorm, undefined, 'RxNorm should gracefully be undefined if no rxcui');
    assert.ok(partialDossier.statPearls, 'StatPearls should still be populated');
    assert.strictEqual(partialDossier.statPearls?.bookshelfUid, 'NBK123456');

  } finally {
    globalThis.fetch = originalFetch;
  }

  console.log('All clinicalDossierService tests passed successfully!');
}

runTests().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
