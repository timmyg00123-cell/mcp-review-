import assert from 'node:assert';
import {
  CANONICAL_MEDCHEM_TARGETS,
  findCanonicalTargetForDrug,
  type TargetPdbMapping,
} from '../src/utils/canonicalTargets';
import {
  fetchChemblBioactivity,
  mapChemblActivitiesToRecords,
  clearChemblCache,
  type ChemblBioactivityRecord,
} from '../src/services/chemblService';

console.log('--- Running ChEMBL & Canonical Targets Test Suite ---');

async function runTests() {
  // --------------------------------------------------------------------------
  // 1. CANONICAL_MEDCHEM_TARGETS Structure & Coverage
  // --------------------------------------------------------------------------
  console.log('1. Testing CANONICAL_MEDCHEM_TARGETS integrity...');
  assert.ok(Array.isArray(CANONICAL_MEDCHEM_TARGETS), 'CANONICAL_MEDCHEM_TARGETS should be an array');
  assert.ok(CANONICAL_MEDCHEM_TARGETS.length >= 12, 'Must include at least the 12 primary curricular targets');

  for (const target of CANONICAL_MEDCHEM_TARGETS) {
    assert.ok(target.targetName, `Target must have targetName: ${JSON.stringify(target)}`);
    assert.ok(target.geneSymbol, `Target must have geneSymbol: ${target.targetName}`);
    assert.ok(target.pdbId && target.pdbId.length === 4, `Target must have valid 4-character pdbId: ${target.pdbId}`);
    assert.ok(target.description, `Target must have description: ${target.targetName}`);
    assert.ok(Array.isArray(target.exampleDrugs) && target.exampleDrugs.length > 0, `Target must have exampleDrugs: ${target.targetName}`);
  }

  // --------------------------------------------------------------------------
  // 2. findCanonicalTargetForDrug Matching
  // --------------------------------------------------------------------------
  console.log('2. Testing findCanonicalTargetForDrug lookup...');
  // Case insensitivity and exact drug matches
  const p2y12 = findCanonicalTargetForDrug('Clopidogrel');
  assert.ok(p2y12, 'Clopidogrel should resolve to a canonical target');
  assert.strictEqual(p2y12?.pdbId.toUpperCase(), '4NTJ');
  assert.strictEqual(p2y12?.geneSymbol, 'P2RY12');

  const ace = findCanonicalTargetForDrug('captopril');
  assert.ok(ace, 'captopril should resolve to ACE');
  assert.strictEqual(ace?.pdbId.toUpperCase(), '1O86');
  assert.strictEqual(ace?.geneSymbol, 'ACE');

  const hmgcr = findCanonicalTargetForDrug('atorvastatin');
  assert.ok(hmgcr, 'atorvastatin should resolve to HMGCR');
  assert.strictEqual(hmgcr?.pdbId.toUpperCase(), '1HWK');
  assert.strictEqual(hmgcr?.geneSymbol, 'HMGCR');

  // Substring/salt matching (e.g. Clopidogrel bisulfate, Losartan potassium)
  const losartan = findCanonicalTargetForDrug('Losartan potassium');
  assert.ok(losartan, 'Losartan potassium should resolve to AGTR1');
  assert.strictEqual(losartan?.pdbId.toUpperCase(), '4Z9O');

  const metoprolol = findCanonicalTargetForDrug('Metoprolol succinate');
  assert.ok(metoprolol, 'Metoprolol succinate should resolve to ADRB1');
  assert.strictEqual(metoprolol?.pdbId.toUpperCase(), '7JJO');

  const albuterol = findCanonicalTargetForDrug('Albuterol');
  assert.ok(albuterol, 'Albuterol should resolve to ADRB2');
  assert.strictEqual(albuterol?.pdbId.toUpperCase(), '2RH1');

  const celecoxib = findCanonicalTargetForDrug('Celecoxib');
  assert.ok(celecoxib, 'Celecoxib should resolve to PTGS2');
  assert.strictEqual(celecoxib?.pdbId.toUpperCase(), '3LN1');

  const aspirin = findCanonicalTargetForDrug('Aspirin');
  assert.ok(aspirin, 'Aspirin should resolve to PTGS1');
  assert.strictEqual(aspirin?.pdbId.toUpperCase(), '1CQE');

  const methotrexate = findCanonicalTargetForDrug('methotrexate');
  assert.ok(methotrexate, 'methotrexate should resolve to DHFR');
  assert.strictEqual(methotrexate?.pdbId.toUpperCase(), '1U72');

  const erlotinib = findCanonicalTargetForDrug('erlotinib');
  assert.ok(erlotinib, 'erlotinib should resolve to EGFR');
  assert.strictEqual(erlotinib?.pdbId.toUpperCase(), '1M17');

  const ritonavir = findCanonicalTargetForDrug('ritonavir');
  assert.ok(ritonavir, 'ritonavir should resolve to HIV-1 protease');
  assert.strictEqual(ritonavir?.pdbId.toUpperCase(), '1HXB');

  const amoxicillin = findCanonicalTargetForDrug('amoxicillin');
  assert.ok(amoxicillin, 'amoxicillin should resolve to PBP');
  assert.strictEqual(amoxicillin?.pdbId.toUpperCase(), '1VQQ');

  // Target name or description lookup
  const byName = findCanonicalTargetForDrug('platelet receptor');
  assert.ok(byName, 'Should resolve by description keyword');
  assert.strictEqual(byName?.pdbId.toUpperCase(), '4NTJ');

  // Unknown drug handling
  const unknown = findCanonicalTargetForDrug('unknown-drug-xyz');
  assert.strictEqual(unknown, undefined, 'Unknown drug should return undefined');

  const empty = findCanonicalTargetForDrug('');
  assert.strictEqual(empty, undefined, 'Empty string should return undefined');

  // --------------------------------------------------------------------------
  // 3. mapChemblActivitiesToRecords Unit Tests
  // --------------------------------------------------------------------------
  console.log('3. Testing mapChemblActivitiesToRecords pure mapping...');
  const mockActivities = [
    {
      activity_id: 101,
      assay_description: 'Radioligand binding assay for human P2Y12',
      assay_type: 'B',
      standard_type: 'Ki',
      standard_value: '2.5',
      standard_units: 'nM',
      standard_relation: '=',
      pchembl_value: '8.60',
      target_chembl_id: 'CHEMBL4821',
      target_pref_name: 'P2Y purinoceptor 12',
    },
    {
      activity_id: 102,
      assay_description: 'Cellular inhibition of platelet aggregation',
      assay_type: 'F',
      standard_type: 'IC50',
      standard_value: 120,
      standard_units: 'nM',
      relation: '<=',
      pchembl_value: '6.92',
      target_chembl_id: 'CHEMBL4821',
    },
  ];

  const mapped = mapChemblActivitiesToRecords(
    'CHEMBL1771',
    'Clopidogrel',
    'P2Y12 purinoceptor antagonist',
    mockActivities
  );

  assert.strictEqual(mapped.length, 2);
  assert.strictEqual(mapped[0].moleculeChemblId, 'CHEMBL1771');
  assert.strictEqual(mapped[0].prefName, 'Clopidogrel');
  assert.strictEqual(mapped[0].mechanismOfAction, 'P2Y12 purinoceptor antagonist');
  assert.strictEqual(mapped[0].targetName, 'P2Y purinoceptor 12');
  assert.strictEqual(mapped[0].targetChemblId, 'CHEMBL4821');
  assert.strictEqual(mapped[0].standardType, 'Ki');
  assert.strictEqual(mapped[0].standardValue, 2.5);
  assert.strictEqual(mapped[0].standardUnits, 'nM');
  assert.strictEqual(mapped[0].relation, '=');
  assert.strictEqual(mapped[0].pchemblValue, 8.6);

  assert.strictEqual(mapped[1].standardType, 'IC50');
  assert.strictEqual(mapped[1].standardValue, 120);
  assert.strictEqual(mapped[1].relation, '<=');
  assert.strictEqual(mapped[1].targetName, 'Cellular inhibition of platelet aggregation');

  // Fallback when activities list is empty but mechanism exists
  const emptyActsMapped = mapChemblActivitiesToRecords(
    'CHEMBL1771',
    'Clopidogrel',
    'P2Y12 purinoceptor antagonist',
    []
  );
  assert.strictEqual(emptyActsMapped.length, 1);
  assert.strictEqual(emptyActsMapped[0].mechanismOfAction, 'P2Y12 purinoceptor antagonist');
  assert.strictEqual(emptyActsMapped[0].standardValue, undefined);

  // --------------------------------------------------------------------------
  // 4. fetchChemblBioactivity with Mocked Fetch
  // --------------------------------------------------------------------------
  console.log('4. Testing fetchChemblBioactivity network mock flows...');
  const originalFetch = globalThis.fetch;

  try {
    clearChemblCache();
    let fetchCalls: string[] = [];

    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = String(input);
      fetchCalls.push(url);

      if (url.includes('data/molecule.json?pref_name__iexact=clopidogrel')) {
        return new Response(
          JSON.stringify({
            molecules: [
              {
                molecule_chembl_id: 'CHEMBL1771',
                pref_name: 'CLOPIDOGREL',
              },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (url.includes('data/mechanism.json?molecule_chembl_id=CHEMBL1771')) {
        return new Response(
          JSON.stringify({
            mechanisms: [
              {
                mechanism_of_action: 'P2Y12 platelet adenosine diphosphate (ADP) receptor antagonist',
                target_chembl_id: 'CHEMBL4821',
              },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (url.includes('data/activity.json?molecule_chembl_id=CHEMBL1771')) {
        return new Response(
          JSON.stringify({
            activities: [
              {
                activity_id: 999,
                standard_type: 'IC50',
                standard_value: '300',
                standard_units: 'nM',
                target_pref_name: 'P2Y purinoceptor 12',
                target_chembl_id: 'CHEMBL4821',
                pchembl_value: '6.52',
              },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Default 404
      return new Response(JSON.stringify({ error: 'not found' }), { status: 404 });
    };

    const results = await fetchChemblBioactivity('clopidogrel');
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].moleculeChemblId, 'CHEMBL1771');
    assert.strictEqual(results[0].prefName, 'CLOPIDOGREL');
    assert.strictEqual(results[0].mechanismOfAction, 'P2Y12 platelet adenosine diphosphate (ADP) receptor antagonist');
    assert.strictEqual(results[0].standardValue, 300);
    assert.strictEqual(results[0].standardType, 'IC50');

    // Test in-memory cache on subsequent call
    const callCountBeforeCache = fetchCalls.length;
    const cachedResults = await fetchChemblBioactivity('clopidogrel');
    assert.strictEqual(fetchCalls.length, callCountBeforeCache, 'Cached query must not trigger new HTTP requests');
    assert.deepStrictEqual(cachedResults, results);

    // --------------------------------------------------------------------------
    // 5. Fallback to molecule synonyms
    // --------------------------------------------------------------------------
    console.log('5. Testing fallback to synonyms...');
    clearChemblCache();
    fetchCalls = [];

    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = String(input);
      fetchCalls.push(url);

      if (url.includes('data/molecule.json?pref_name__iexact=plavix')) {
        // Not found by pref_name
        return new Response(JSON.stringify({ molecules: [] }), { status: 200 });
      }

      if (url.includes('data/molecule.json?molecule_synonyms__molecule_synonym__iexact=plavix')) {
        return new Response(
          JSON.stringify({
            molecules: [
              {
                molecule_chembl_id: 'CHEMBL1771',
                pref_name: 'CLOPIDOGREL',
              },
            ],
          }),
          { status: 200 }
        );
      }

      if (url.includes('data/mechanism.json?molecule_chembl_id=CHEMBL1771')) {
        return new Response(JSON.stringify({ mechanisms: [] }), { status: 200 });
      }

      if (url.includes('data/activity.json?molecule_chembl_id=CHEMBL1771')) {
        return new Response(JSON.stringify({ activities: [] }), { status: 200 });
      }

      return new Response(JSON.stringify({ error: 'not found' }), { status: 404 });
    };

    const synonymResults = await fetchChemblBioactivity('plavix');
    assert.ok(fetchCalls.some(u => u.includes('molecule_synonyms__molecule_synonym__iexact=plavix')));
    assert.ok(Array.isArray(synonymResults));

    // --------------------------------------------------------------------------
    // 6. Graceful failure on network errors
    // --------------------------------------------------------------------------
    console.log('6. Testing graceful error handling...');
    clearChemblCache();
    globalThis.fetch = async () => {
      throw new Error('Network / CORS error');
    };

    const errorResults = await fetchChemblBioactivity('error-drug');
    assert.ok(Array.isArray(errorResults));
    assert.strictEqual(errorResults.length, 0, 'Network errors must return an empty array gracefully');

  } finally {
    globalThis.fetch = originalFetch;
  }

  console.log('All tests passed successfully!');
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
