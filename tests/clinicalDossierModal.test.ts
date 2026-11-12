// tests/clinicalDossierModal.test.ts
import assert from 'node:assert';
import fs from 'node:fs';

const filePath = 'src/components/ClinicalDossierModal.tsx';
assert.ok(fs.existsSync(filePath), `Target file ${filePath} must exist`);

const content = fs.readFileSync(filePath, 'utf-8');

// Test 1: Component exports and Props interface
assert.ok(
  content.includes('export interface ClinicalDossierModalProps'),
  'Must export ClinicalDossierModalProps interface'
);
assert.ok(
  content.includes('export const ClinicalDossierModal'),
  'Must export ClinicalDossierModal React component'
);
assert.ok(content.includes('isOpen'), 'ClinicalDossierModalProps must include isOpen');
assert.ok(content.includes('onClose'), 'ClinicalDossierModalProps must include onClose');
assert.ok(content.includes('drugName'), 'ClinicalDossierModalProps must include drugName');
assert.ok(content.includes('preloadedDossier'), 'ClinicalDossierModalProps must include preloadedDossier');

// Test 2: Tab navigation with 'fda' | 'rxnorm' | 'statpearls'
assert.ok(
  content.includes("'fda'") && content.includes("'rxnorm'") && content.includes("'statpearls'"),
  "Must support tabs for 'fda', 'rxnorm', and 'statpearls'"
);

// Test 3: Lucide React icons
assert.ok(
  content.includes('FileText') && content.includes('Tag') && content.includes('BookOpen'),
  'Must import and use FileText, Tag, and BookOpen icons from lucide-react'
);

// Test 4: Header title & verified clinical subtitle
assert.ok(
  content.includes('Verified Clinical Data from DailyMed / OpenFDA, RxNorm & StatPearls'),
  'Must render exact subtitle: Verified Clinical Data from DailyMed / OpenFDA, RxNorm & StatPearls'
);
assert.ok(
  content.includes('Escape') || content.includes('keydown'),
  'Must handle Esc key or keydown listener to dismiss modal'
);

// Test 5: DailyMed / FDA Tab details (Boxed Warning alert, indications, dosage forms, SPL link)
assert.ok(
  content.includes('boxedWarning') || content.includes('Boxed Warning') || content.includes('Black Box Warning'),
  'Must render Boxed Warning banner or alert when present'
);
assert.ok(
  content.includes('indications') || content.includes('Indications'),
  'Must render indications list'
);
assert.ok(
  content.includes('dosageForms') || content.includes('Dosage Forms'),
  'Must render dosage forms'
);
assert.ok(
  content.includes('splWebUrl') || content.includes('dailymed.nlm.nih.gov'),
  'Must provide link to official DailyMed SPL search'
);

// Test 6: RxNorm Tab details (RxCUI badge, brand names, synonyms)
assert.ok(
  content.includes('rxcui') || content.includes('RxCUI'),
  'Must display official RxCUI identifier badge'
);
assert.ok(
  content.includes('brandNames') || content.includes('Brand Names'),
  'Must render brand names list'
);
assert.ok(
  content.includes('synonyms') || content.includes('Synonyms'),
  'Must render synonyms list'
);

// Test 7: StatPearls Tab details (chapter title, clinical summary overview, Bookshelf button)
assert.ok(
  content.includes('statPearls') || content.includes('StatPearls'),
  'Must display StatPearls section'
);
assert.ok(
  content.includes('bookshelfUrl') || content.includes('NCBI Bookshelf') || content.includes('Bookshelf'),
  'Must provide prominent link button to open NCBI Bookshelf in new tab'
);

// Test 8: Loading and Error state handling
assert.ok(
  content.includes('fetchClinicalDossier'),
  'Must import and use fetchClinicalDossier from clinicalDossierService'
);
assert.ok(
  content.includes('loading') || content.includes('Loading') || content.includes('skeleton'),
  'Must handle loading state with spinner or skeleton'
);
assert.ok(
  content.includes('error') || content.includes('Error'),
  'Must handle error state gracefully'
);

// Test 9: Graceful fallback when fields are empty
assert.ok(
  content.includes('No boxed warning') ||
  content.includes('No indications') ||
  content.includes('No brand names') ||
  content.includes('No clinical dossier') ||
  content.includes('No data available') ||
  content.includes('Not available'),
  'Must provide graceful fallback text when fields are empty'
);

console.log('PASS: All ClinicalDossierModal structural & interface tests passed!');
