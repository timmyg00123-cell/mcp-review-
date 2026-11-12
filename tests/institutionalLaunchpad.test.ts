// tests/institutionalLaunchpad.test.ts
import assert from 'node:assert';
import fs from 'node:fs';
import {
  LaunchpadConfig,
  XULA_OPENATHENS_CONFIG,
  getLexicompSearchUrl,
  getAccessPharmacySearchUrl,
  getOpenAthensAuthUrl,
} from '../src/utils/launchpadUrls';

console.log('Testing Institutional Launchpad & OpenAthens Resolver...');

// Test 1: Lexicomp URL generation
{
  const url1 = getLexicompSearchUrl('Clopidogrel');
  assert.strictEqual(
    url1,
    'https://online.lexi.com/lco/action/search?q=Clopidogrel',
    'Lexicomp URL should match standard search query'
  );

  const url2 = getLexicompSearchUrl('Aspirin / Dipyridamole');
  assert.strictEqual(
    url2,
    'https://online.lexi.com/lco/action/search?q=Aspirin%20%2F%20Dipyridamole',
    'Lexicomp URL should encode special characters and spaces'
  );

  const url3 = getLexicompSearchUrl('  Atorvastatin  ');
  assert.strictEqual(
    url3,
    'https://online.lexi.com/lco/action/search?q=Atorvastatin',
    'Lexicomp URL should trim whitespace'
  );
}

// Test 2: AccessPharmacy URL generation
{
  const url1 = getAccessPharmacySearchUrl('Clopidogrel');
  assert.strictEqual(
    url1,
    'https://accesspharmacy.mhmedical.com/SearchResults.aspx?q=Clopidogrel',
    'AccessPharmacy URL should match standard search query'
  );

  const url2 = getAccessPharmacySearchUrl('Aspirin / Dipyridamole');
  assert.strictEqual(
    url2,
    'https://accesspharmacy.mhmedical.com/SearchResults.aspx?q=Aspirin%20%2F%20Dipyridamole',
    'AccessPharmacy URL should encode special characters and spaces'
  );

  const url3 = getAccessPharmacySearchUrl('  Metformin  ');
  assert.strictEqual(
    url3,
    'https://accesspharmacy.mhmedical.com/SearchResults.aspx?q=Metformin',
    'AccessPharmacy URL should trim whitespace'
  );
}

// Test 3: XULA OpenAthens config & getOpenAthensAuthUrl resolver
{
  assert.ok(XULA_OPENATHENS_CONFIG, 'XULA_OPENATHENS_CONFIG must be defined');
  assert.strictEqual(
    XULA_OPENATHENS_CONFIG.openAthensAuthUrl,
    'https://login.openathens.net/auth/xula.edu/o/71625811',
    'XULA OpenAthens URL should match default institution ID'
  );
  assert.ok(
    XULA_OPENATHENS_CONFIG.institutionName.includes('Xavier University of Louisiana'),
    'XULA institution name must specify Xavier University of Louisiana'
  );

  // Default resolver invocation
  assert.strictEqual(
    getOpenAthensAuthUrl(),
    'https://login.openathens.net/auth/xula.edu/o/71625811',
    'getOpenAthensAuthUrl() should default to XULA URL'
  );

  // Custom config
  const customConfig: LaunchpadConfig = {
    institutionName: 'Custom Pharmacy School',
    openAthensAuthUrl: 'https://login.openathens.net/auth/custom.edu/o/999999',
  };
  assert.strictEqual(
    getOpenAthensAuthUrl(customConfig),
    'https://login.openathens.net/auth/custom.edu/o/999999',
    'getOpenAthensAuthUrl(config) should resolve custom OpenAthens URL'
  );
}

// Test 4: Verify integration in ChemicalStructureCard.tsx
{
  const cardPath = 'src/components/ChemicalStructureCard.tsx';
  assert.ok(fs.existsSync(cardPath), `${cardPath} must exist`);
  const cardContent = fs.readFileSync(cardPath, 'utf-8');

  // Verify launchpad functions imported
  assert.ok(
    cardContent.includes('getLexicompSearchUrl') &&
    cardContent.includes('getAccessPharmacySearchUrl') &&
    cardContent.includes('getOpenAthensAuthUrl'),
    'ChemicalStructureCard must import launchpad URL helpers'
  );

  // Verify ClinicalDossierModal integration
  assert.ok(
    cardContent.includes('ClinicalDossierModal'),
    'ChemicalStructureCard must reference ClinicalDossierModal'
  );
  assert.ok(
    cardContent.includes('isClinicalDossierOpen'),
    'ChemicalStructureCard must track isClinicalDossierOpen state'
  );

  // Verify Clinical Info Box button
  assert.ok(
    cardContent.includes('Clinical Info Box'),
    'ChemicalStructureCard must render Clinical Info Box button'
  );

  // Verify Launchpad badges
  assert.ok(
    cardContent.includes('Lexicomp ↗'),
    'ChemicalStructureCard must render Lexicomp ↗ badge'
  );
  assert.ok(
    cardContent.includes('AccessPharmacy ↗'),
    'ChemicalStructureCard must render AccessPharmacy ↗ badge'
  );
  assert.ok(
    cardContent.includes('XULA Auth 🔑'),
    'ChemicalStructureCard must render XULA Auth 🔑 badge'
  );
  assert.ok(
    cardContent.includes('Authenticate XULA OpenAthens Session'),
    'ChemicalStructureCard must include Authenticate XULA OpenAthens Session tooltip'
  );
  assert.ok(
    cardContent.includes('target="_blank"') && cardContent.includes('rel="noopener noreferrer"'),
    'Launchpad links must open safely with target=_blank and rel=noopener noreferrer'
  );
}

// Test 5: Verify tab reset on drug change in ClinicalDossierModal.tsx
{
  const modalPath = 'src/components/ClinicalDossierModal.tsx';
  assert.ok(fs.existsSync(modalPath), `${modalPath} must exist`);
  const modalContent = fs.readFileSync(modalPath, 'utf-8');

  assert.ok(
    modalContent.includes("setActiveTab('fda')"),
    'ClinicalDossierModal must reset active tab to fda when opening or changing drug'
  );
}

console.log('PASS: All institutional launchpad and resolver tests passed successfully!');
