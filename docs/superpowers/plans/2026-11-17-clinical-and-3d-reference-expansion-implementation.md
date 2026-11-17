# Clinical & 3D Reference Cross-Module Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the clinical and 3D reference stack (Clinical Dossier drawer, 3D Molecular Lab routing, Institutional Launchpad with EZProxy/OpenAthens, Class Profile Anchor Drawer, and approved indications) across Top 200 clinical flashcards, 2D structure flashcards, the MedChem matrix, and the structure lightbox.

**Architecture:** Build a centralized, reusable `<ClinicalReferenceToolbar />` component supporting `full` and `compact` variants, equipped with a 3D target availability guard and cross-module custom event dispatch. Enhance `launchpadUrls.ts` with customizable EZProxy/OpenAthens authentication persisted to `localStorage`. Parse and display approved clinical indications across all flashcard faces, and wire `ClassProfileAnchorDrawer` into Top 200 taxonomy surfaces (front/back cards and the 39-class filter drawer).

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide icons, Vitest / Node.js test runner (`npx tsx tests/...`), Dexie IndexedDB, Mol*.

**Spec:** [`docs/superpowers/specs/2026-11-17-clinical-and-3d-reference-expansion-design.md`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/docs/superpowers/specs/2026-11-17-clinical-and-3d-reference-expansion-design.md)

## Global Constraints

- Never expose drug brand names, indications, or taxonomy class answers on blinded front flashcard faces during active recall.
- Zero WebGL overhead on flashcards or tables; 3D canvas is restricted to the dedicated `3d-lab` route.
- If a drug lacks a canonical 3D co-crystal model, the 3D button must be rendered in a disabled state with a helpful tooltip, never falling back erroneously to Clopidogrel.
- All URL generators and settings serializers must gracefully handle empty strings, special characters, and corrupted `localStorage`.
- All tests run via `npx tsx tests/<test-file>.test.ts` using Node.js built-in `node:assert`.

## Review Focus

1. **Corrupted or Missing `localStorage['launchpad_config']`**: Falling back seamlessly to `DEFAULT_LAUNCHPAD_CONFIG` without throwing a JSON parse error.
2. **Missing 3D Co-crystal Structure**: Correctly disabling the `[🧊 3D]` button for Top 200 drugs without a PDB model (e.g. Lisinopril, Metformin) instead of silently routing to Clopidogrel.
3. **Front-Face Active Recall Leakage**: Ensuring no indication tags, reference URLs, or class names leak on unrevealed card faces in `TopDrugClinicalCard.tsx` and `StructureFlashcardCardFace.tsx`.
4. **Proxy URL Double-Encoding or Malformed Prefixes**: Handling trailing slashes or missing `?url=` in user-entered EZProxy prefixes cleanly.
5. **Class Profile Drawer Fallback**: Safely handling drugs or classes without an explicit `TopDrugClassProfile` definition in `classProfiles.ts` without runtime crashes.

---

### Task 1: Institutional Launchpad Configuration Model & Proxy Resolution

**Files:**
- Modify: `src/utils/launchpadUrls.ts`
- Test: `tests/launchpadUrls.test.ts`

**Interfaces:**
- Consumes: None
- Produces:
  ```typescript
  export type LaunchpadAuthType = 'openathens' | 'ezproxy' | 'direct';
  export interface LaunchpadConfig {
    institutionName: string;
    authType: LaunchpadAuthType;
    openAthensAuthUrl: string;
    ezproxyPrefix: string;
    showBadges: boolean;
  }
  export const DEFAULT_LAUNCHPAD_CONFIG: LaunchpadConfig;
  export function loadLaunchpadConfig(): LaunchpadConfig;
  export function saveLaunchpadConfig(config: LaunchpadConfig): void;
  export function getLexicompSearchUrl(drugName: string, config?: LaunchpadConfig): string;
  export function getAccessPharmacySearchUrl(drugName: string, config?: LaunchpadConfig): string;
  ```

- [ ] **Step 1: Write the failing test for `launchpadUrls.ts`**

```typescript
// tests/launchpadUrls.test.ts
import assert from 'node:assert';
import {
  DEFAULT_LAUNCHPAD_CONFIG,
  loadLaunchpadConfig,
  saveLaunchpadConfig,
  getLexicompSearchUrl,
  getAccessPharmacySearchUrl,
  type LaunchpadConfig,
} from '../src/utils/launchpadUrls.js';

console.log('Testing launchpadUrls configuration & URL generation...');

// Test 1: Defaults
assert.strictEqual(DEFAULT_LAUNCHPAD_CONFIG.authType, 'openathens');
assert.strictEqual(DEFAULT_LAUNCHPAD_CONFIG.showBadges, true);
assert.ok(DEFAULT_LAUNCHPAD_CONFIG.institutionName.includes('Xavier'));

// Test 2: Direct URL generation
const directConfig: LaunchpadConfig = {
  institutionName: 'Custom Clinic',
  authType: 'direct',
  openAthensAuthUrl: '',
  ezproxyPrefix: '',
  showBadges: true,
};
const directLexi = getLexicompSearchUrl('Atorvastatin', directConfig);
assert.strictEqual(
  directLexi,
  'https://online.lexi.com/lco/action/search?q=Atorvastatin'
);

// Test 3: EZProxy URL generation with prefix
const ezConfig: LaunchpadConfig = {
  institutionName: 'State University',
  authType: 'ezproxy',
  openAthensAuthUrl: '',
  ezproxyPrefix: 'https://proxy.lib.state.edu/login?url=',
  showBadges: true,
};
const ezLexi = getLexicompSearchUrl('Clopidogrel Bisulfate', ezConfig);
assert.strictEqual(
  ezLexi,
  'https://proxy.lib.state.edu/login?url=https%3A%2F%2Fonline.lexi.com%2Flco%2Faction%2Fsearch%3Fq%3DClopidogrel%2520Bisulfate'
);

const ezAccess = getAccessPharmacySearchUrl('Apixaban', ezConfig);
assert.strictEqual(
  ezAccess,
  'https://proxy.lib.state.edu/login?url=https%3A%2F%2Faccesspharmacy.mhmedical.com%2FSearchResults.aspx%3Fq%3DApixaban'
);

// Test 4: OpenAthens mode does not mutate search destination URL
const oaConfig: LaunchpadConfig = {
  ...DEFAULT_LAUNCHPAD_CONFIG,
  authType: 'openathens',
};
assert.strictEqual(
  getLexicompSearchUrl('Metformin', oaConfig),
  'https://online.lexi.com/lco/action/search?q=Metformin'
);

console.log('launchpadUrls tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/launchpadUrls.test.ts`
Expected: FAIL with missing exports or signature mismatch (`ezConfig`).

- [ ] **Step 3: Implement `LaunchpadConfig` and proxy resolvers in `src/utils/launchpadUrls.ts`**

Update `src/utils/launchpadUrls.ts` with:
- `LaunchpadAuthType` union `'openathens' | 'ezproxy' | 'direct'`
- `LaunchpadConfig` interface and `DEFAULT_LAUNCHPAD_CONFIG`
- `loadLaunchpadConfig()` with `localStorage` safe parsing and error recovery
- `saveLaunchpadConfig()` dispatching `'launchpad-config-changed'`
- `getLexicompSearchUrl` and `getAccessPharmacySearchUrl` accepting `config?: LaunchpadConfig` and wrapping with `ezproxyPrefix` when `authType === 'ezproxy'`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/launchpadUrls.test.ts`
Expected: PASS with "launchpadUrls tests passed!"

- [ ] **Step 5: Commit**

```bash
git add src/utils/launchpadUrls.ts tests/launchpadUrls.test.ts
git commit -m "feat(launchpad): add EZProxy prefix support and LaunchpadConfig persistence"
```

---

### Task 2: Clinical Reference Toolbar Component (`ClinicalReferenceToolbar.tsx`)

**Files:**
- Create: `src/components/ClinicalReferenceToolbar.tsx`
- Create: `tests/clinicalReferenceToolbar.test.ts`

**Interfaces:**
- Consumes:
  - `LaunchpadConfig`, `getLexicompSearchUrl`, `getAccessPharmacySearchUrl` from `src/utils/launchpadUrls.ts`
  - `findCanonicalTargetForDrug`, `resolveDrug3DEntry` from `src/data/drug3dCatalog.ts`
  - `ClinicalDossierModal` from `src/components/ClinicalDossierModal.tsx`
- Produces:
  ```typescript
  export interface ClinicalReferenceToolbarProps {
    drugName: string;
    structure?: ChemicalStructure | null;
    onSelectStructureFor3D?: (structure: ChemicalStructure) => void;
    variant?: 'full' | 'compact';
    show3DButton?: boolean;
    className?: string;
  }
  export const ClinicalReferenceToolbar: React.FC<ClinicalReferenceToolbarProps>;
  ```

- [ ] **Step 1: Write the failing test for `ClinicalReferenceToolbar.tsx`**

```typescript
// tests/clinicalReferenceToolbar.test.ts
import assert from 'node:assert';
import fs from 'node:fs';

console.log('Testing ClinicalReferenceToolbar contract...');

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
  content.includes('findCanonicalTargetForDrug'),
  'Must check 3D target presence to guard against false Clopidogrel routing'
);

console.log('ClinicalReferenceToolbar contract tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/clinicalReferenceToolbar.test.ts`
Expected: FAIL with file not found.

- [ ] **Step 3: Implement `src/components/ClinicalReferenceToolbar.tsx`**

Build `ClinicalReferenceToolbar.tsx`:
- Accepts `drugName`, `structure`, `onSelectStructureFor3D`, `variant` (`full` | `compact`), `show3DButton` (default `true`), `className`.
- Checks 3D availability: `const has3DTarget = Boolean(resolveDrug3DEntry(drugName) || findCanonicalTargetForDrug(drugName) || (structure && resolveDrug3DEntry(structure.name)));`.
- Dispatches custom event `'app-open-3d-lab'` if no `onSelectStructureFor3D` callback prop is supplied.
- Manages `isDossierOpen` state; lazy-loads `ClinicalDossierModal` on click.
- Subscribes to `'launchpad-config-changed'` to update links dynamically when settings change.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/clinicalReferenceToolbar.test.ts`
Expected: PASS with "ClinicalReferenceToolbar contract tests passed!"

- [ ] **Step 5: Commit**

```bash
git add src/components/ClinicalReferenceToolbar.tsx tests/clinicalReferenceToolbar.test.ts
git commit -m "feat(clinical): implement centralized ClinicalReferenceToolbar with 3D guard and compact mode"
```

---

### Task 3: Institutional Launchpad Settings Modal UI (`SettingsModal.tsx`)

**Files:**
- Modify: `src/components/SettingsModal.tsx`
- Create: `tests/institutionalSettings.test.ts`

**Interfaces:**
- Consumes:
  - `loadLaunchpadConfig`, `saveLaunchpadConfig`, `DEFAULT_LAUNCHPAD_CONFIG`, `LaunchpadAuthType` from `src/utils/launchpadUrls.ts`
- Produces:
  - UI inputs in `SettingsModal.tsx` for Institution Name, Auth Type radio selector, OpenAthens URL input, EZProxy Prefix input, Show Badges toggle, and Reset Defaults action.

- [ ] **Step 1: Write the failing test for `SettingsModal.tsx` institutional launchpad section**

```typescript
// tests/institutionalSettings.test.ts
import assert from 'node:assert';
import fs from 'node:fs';

console.log('Testing SettingsModal institutional configuration UI...');

const settingsPath = 'src/components/SettingsModal.tsx';
const content = fs.readFileSync(settingsPath, 'utf-8');

assert.ok(
  content.includes('Institutional Launchpad') || content.includes('Library Portal'),
  'SettingsModal must include Institutional Launchpad & Library Portal section'
);
assert.ok(
  content.includes('ezproxyPrefix') || content.includes('EZProxy'),
  'SettingsModal must provide EZProxy prefix controls'
);
assert.ok(
  content.includes('loadLaunchpadConfig'),
  'SettingsModal must load configuration using loadLaunchpadConfig'
);

console.log('Institutional SettingsModal tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/institutionalSettings.test.ts`
Expected: FAIL with "SettingsModal must include Institutional Launchpad & Library Portal section".

- [ ] **Step 3: Integrate Institutional Launchpad into `src/components/SettingsModal.tsx`**

In `SettingsModal.tsx`:
- Load config on mount with `loadLaunchpadConfig()`.
- Add section "Institutional Launchpad & Library Portal" with:
  - Institution Name text input.
  - Auth Type selector: OpenAthens (`openathens`), EZProxy (`ezproxy`), Direct / Off-Campus (`direct`).
  - Conditional inputs: OpenAthens URL (when `openathens`), EZProxy URL prefix (when `ezproxy`).
  - "Show launchpad badges on cards" checkbox toggle.
  - "Restore XULA Defaults" button calling `saveLaunchpadConfig(DEFAULT_LAUNCHPAD_CONFIG)`.
- Persist state on change via `saveLaunchpadConfig()`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/institutionalSettings.test.ts`
Expected: PASS with "Institutional SettingsModal tests passed!"

- [ ] **Step 5: Commit**

```bash
git add src/components/SettingsModal.tsx tests/institutionalSettings.test.ts
git commit -m "feat(settings): add institutional launchpad and EZProxy configuration controls"
```

---

### Task 4: Indications Extraction Utility & Top 200 Flashcards Integration

**Files:**
- Create: `src/utils/clinicalIndications.ts`
- Modify: `src/components/TopDrugClinicalCard.tsx`
- Create: `tests/topDrugClinicalCardIndications.test.ts`

**Interfaces:**
- Consumes:
  - `TopDrugClinicalMonograph` from `src/data/clinical/types.ts`
  - `ClinicalReferenceToolbar` from `src/components/ClinicalReferenceToolbar.tsx`
- Produces:
  ```typescript
  export function resolveClinicalIndications(monograph: TopDrugClinicalMonograph): string[];
  ```

- [ ] **Step 1: Write the failing test for `resolveClinicalIndications` and `TopDrugClinicalCard.tsx`**

```typescript
// tests/topDrugClinicalCardIndications.test.ts
import assert from 'node:assert';
import fs from 'node:fs';
import { resolveClinicalIndications } from '../src/utils/clinicalIndications.js';
import type { TopDrugClinicalMonograph } from '../src/data/clinical/types.js';

console.log('Testing indications extraction & Top 200 card integration...');

const mockMonograph: TopDrugClinicalMonograph = {
  genericName: 'Lisinopril',
  brandNames: ['Prinivil', 'Zestril'],
  pharmacologicClass: 'ACE Inhibitor',
  therapeuticClass: 'Antihypertensive',
  dosageForms: ['Oral Tablet: 2.5mg, 5mg, 10mg, 20mg'],
  dosingRegimens: {
    'Hypertension': 'Initial: 10mg once daily. Maintenance: 20-40mg once daily.',
    'Heart Failure': 'Initial: 5mg once daily with diuretics and digitalis.',
    'Acute Myocardial Infarction': '5mg within 24h, followed by 5mg at 24h, then 10mg daily.',
    'Renal Impairment': 'CrCl 10-30 mL/min: reduce initial dose by 50%.',
  },
  mechanismOfAction: 'Competitive inhibitor of angiotensin-converting enzyme.',
  contraindications: ['History of ACE inhibitor-induced angioedema'],
  blackBoxWarning: 'Fetal Toxicity: Discontinue as soon as pregnancy is detected.',
  monitoringParameters: ['Serum potassium', 'Serum creatinine'],
  commonAdverseEffects: ['Dry cough', 'Dizziness'],
  seriousAdverseEffects: ['Angioedema', 'Hyperkalemia'],
  clinicalPearls: ['Dry cough is caused by bradykinin accumulation.'],
};

const indications = resolveClinicalIndications(mockMonograph);
assert.ok(indications.includes('Hypertension'), 'Must extract Hypertension');
assert.ok(indications.includes('Heart Failure'), 'Must extract Heart Failure');
assert.ok(indications.includes('Acute Myocardial Infarction'), 'Must extract Acute Myocardial Infarction');
assert.ok(!indications.includes('Renal Impairment'), 'Must filter out renal impairment non-indication label');

const cardCode = fs.readFileSync('src/components/TopDrugClinicalCard.tsx', 'utf-8');
assert.ok(
  cardCode.includes('ClinicalReferenceToolbar'),
  'TopDrugClinicalCard must render ClinicalReferenceToolbar'
);
assert.ok(
  cardCode.includes('resolveClinicalIndications') || cardCode.includes('Approved Indications'),
  'TopDrugClinicalCard must display Approved Clinical Indications'
);

console.log('TopDrugClinicalCard indications tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/topDrugClinicalCardIndications.test.ts`
Expected: FAIL with module not found `clinicalIndications.js`.

- [ ] **Step 3: Implement `src/utils/clinicalIndications.ts` and update `TopDrugClinicalCard.tsx`**

1. Create `src/utils/clinicalIndications.ts`:
   - Extracts disease labels from `monograph.dosingRegimens` keys.
   - Filters out non-indications (`renal impairment`, `hepatic impairment`, `geriatric`, `initial`, `maintenance`, `pediatric`).
   - If `monograph.indications` exists, returns it; otherwise combines extracted keys and `monograph.therapeuticClass`.
2. In `src/components/TopDrugClinicalCard.tsx`:
   - Import `ClinicalReferenceToolbar` and `resolveClinicalIndications`.
   - On the card back face, directly below header chips and above the Black Box banner, render `<ClinicalReferenceToolbar drugName={monograph.genericName} variant="full" />`.
   - Render an "Approved Indications" emerald badge strip on the card back above mechanism of action.
   - Keep front face strictly blinded.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/topDrugClinicalCardIndications.test.ts`
Expected: PASS with "TopDrugClinicalCard indications tests passed!"

- [ ] **Step 5: Commit**

```bash
git add src/utils/clinicalIndications.ts src/components/TopDrugClinicalCard.tsx tests/topDrugClinicalCardIndications.test.ts
git commit -m "feat(clinical): integrate resolveClinicalIndications and ClinicalReferenceToolbar into TopDrugClinicalCard"
```

---

### Task 5: 2D Chemical Structure Flashcards Integration & Density Modes

**Files:**
- Modify: `src/components/StructureFlashcardCardFace.tsx`
- Create: `tests/structureFlashcardIndications.test.ts`

**Interfaces:**
- Consumes:
  - `ClinicalReferenceToolbar` from `src/components/ClinicalReferenceToolbar.tsx`
  - `resolveClinicalIndications` from `src/utils/clinicalIndications.ts`
  - `resolveTopDrugClinicalMonograph` from `src/data/clinical/index.ts`
- Produces:
  - Approved indications display and reference toolbar inside `StructureFlashcardCardFace.tsx` across `split`, `structure-focus`, and `minimalist` density modes.

- [ ] **Step 1: Write the failing test for `StructureFlashcardCardFace.tsx`**

```typescript
// tests/structureFlashcardIndications.test.ts
import assert from 'node:assert';
import fs from 'node:fs';

console.log('Testing StructureFlashcardCardFace reference toolbar & indications...');

const facePath = 'src/components/StructureFlashcardCardFace.tsx';
const content = fs.readFileSync(facePath, 'utf-8');

assert.ok(
  content.includes('ClinicalReferenceToolbar'),
  'StructureFlashcardCardFace must import and render ClinicalReferenceToolbar'
);
assert.ok(
  content.includes('clinicalIndications') || content.includes('Approved Indications'),
  'StructureFlashcardCardFace must surface approved clinical indications'
);

console.log('StructureFlashcardCardFace indications tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/structureFlashcardIndications.test.ts`
Expected: FAIL with "StructureFlashcardCardFace must import and render ClinicalReferenceToolbar".

- [ ] **Step 3: Implement indications and toolbar integration in `src/components/StructureFlashcardCardFace.tsx`**

In `StructureFlashcardCardFace.tsx`:
- Resolve indications: `structure.clinicalIndications || resolveClinicalIndications(resolveTopDrugClinicalMonograph(structure.name)) || []`.
- Render indications and `<ClinicalReferenceToolbar />` based on density mode:
  - `split`: Indications badge strip and `variant="full"` toolbar in the clinical pharmacology details column.
  - `structure-focus`: Indications badges pinned below the structure; `variant="compact"` toolbar inside the collapsible details drawer.
  - `minimalist`: Compact reference pills and indication chips rendered below the recall rating buttons.
- Ensure front face remains blinded during active recall.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/structureFlashcardIndications.test.ts`
Expected: PASS with "StructureFlashcardCardFace indications tests passed!"

- [ ] **Step 5: Commit**

```bash
git add src/components/StructureFlashcardCardFace.tsx tests/structureFlashcardIndications.test.ts
git commit -m "feat(flashcards): surface clinical indications and ClinicalReferenceToolbar in StructureFlashcardCardFace"
```

---

### Task 6: MedChem Matrix Sticky Column Integration

**Files:**
- Modify: `src/components/MedChemMatrix.tsx`
- Create: `tests/medChemMatrixLaunchpad.test.ts`

**Interfaces:**
- Consumes:
  - `ClinicalReferenceToolbar` from `src/components/ClinicalReferenceToolbar.tsx`
- Produces:
  - Compact reference strip embedded directly inside the sticky drug column of `MedChemMatrix.tsx`.

- [ ] **Step 1: Write the failing test for `MedChemMatrix.tsx`**

```typescript
// tests/medChemMatrixLaunchpad.test.ts
import assert from 'node:assert';
import fs from 'node:fs';

console.log('Testing MedChemMatrix reference toolbar integration...');

const matrixPath = 'src/components/MedChemMatrix.tsx';
const content = fs.readFileSync(matrixPath, 'utf-8');

assert.ok(
  content.includes('ClinicalReferenceToolbar'),
  'MedChemMatrix must render ClinicalReferenceToolbar'
);
assert.ok(
  content.includes('variant="compact"'),
  'MedChemMatrix must use the compact variant of ClinicalReferenceToolbar'
);

console.log('MedChemMatrix launchpad tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/medChemMatrixLaunchpad.test.ts`
Expected: FAIL with "MedChemMatrix must render ClinicalReferenceToolbar".

- [ ] **Step 3: Integrate compact toolbar into `src/components/MedChemMatrix.tsx`**

In `src/components/MedChemMatrix.tsx`:
- Import `ClinicalReferenceToolbar`.
- In the sticky first `<td>` column (under the 2D thumbnail, CID, and prodrug badges), render:
  ```tsx
  <ClinicalReferenceToolbar
    drugName={row.drug}
    structure={row.structure}
    variant="compact"
    className="mt-1"
  />
  ```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/medChemMatrixLaunchpad.test.ts`
Expected: PASS with "MedChemMatrix launchpad tests passed!"

- [ ] **Step 5: Commit**

```bash
git add src/components/MedChemMatrix.tsx tests/medChemMatrixLaunchpad.test.ts
git commit -m "feat(matrix): embed compact ClinicalReferenceToolbar into sticky drug column"
```

---

### Task 7: Structure Lightbox Modal & Dual-Drug Comparator Integration

**Files:**
- Modify: `src/components/StructureLightboxModal.tsx`
- Create: `tests/structureLightboxLaunchpad.test.ts`

**Interfaces:**
- Consumes:
  - `ClinicalReferenceToolbar` from `src/components/ClinicalReferenceToolbar.tsx`
- Produces:
  - Integrated clinical reference toolbars for single view and independent dual-drug comparison cards.

- [ ] **Step 1: Write the failing test for `StructureLightboxModal.tsx`**

```typescript
// tests/structureLightboxLaunchpad.test.ts
import assert from 'node:assert';
import fs from 'node:fs';

console.log('Testing StructureLightboxModal reference toolbar integration...');

const lightboxPath = 'src/components/StructureLightboxModal.tsx';
const content = fs.readFileSync(lightboxPath, 'utf-8');

assert.ok(
  content.includes('ClinicalReferenceToolbar'),
  'StructureLightboxModal must render ClinicalReferenceToolbar'
);

console.log('StructureLightboxModal reference tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/structureLightboxLaunchpad.test.ts`
Expected: FAIL with "StructureLightboxModal must render ClinicalReferenceToolbar".

- [ ] **Step 3: Integrate reference toolbars into `src/components/StructureLightboxModal.tsx`**

In `StructureLightboxModal.tsx`:
- In single-compound view: embed `<ClinicalReferenceToolbar variant="compact" drugName={structure.name} structure={structure} />` in the top controls header.
- In dual-comparator view: render an independent compact reference toolbar for both Compound A and Compound B in their respective inspection headers.
- Ensure 3D button click closes the lightbox and triggers 3D Lab routing.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/structureLightboxLaunchpad.test.ts`
Expected: PASS with "StructureLightboxModal reference tests passed!"

- [ ] **Step 5: Commit**

```bash
git add src/components/StructureLightboxModal.tsx tests/structureLightboxLaunchpad.test.ts
git commit -m "feat(lightbox): integrate ClinicalReferenceToolbar into single and dual-drug lightbox views"
```

---

### Task 8: Class Profile Anchor Drawer Integration across Clinical Top 200 Taxonomy Surfaces

**Files:**
- Modify: `src/components/TopDrugClinicalCard.tsx`
- Modify: `src/components/StructureFlashcardCardFace.tsx`
- Modify: `src/components/TherapeuticClassFilterDrawer.tsx`
- Create: `tests/classProfileTaxonomyIntegration.test.ts`

**Interfaces:**
- Consumes:
  - `ClassProfileAnchorDrawer` from `src/components/ClassProfileAnchorDrawer.tsx`
  - `resolveClassProfileForDrug` from `src/data/clinical/classProfiles.ts`
- Produces:
  - Seamless slide-out access to class anchor profiles from Top 200 taxonomy chips, 2D structure card taxonomy breadcrumbs, and the 39-class filter drawer.

- [ ] **Step 1: Write the failing test for taxonomy class profile drawer integrations**

```typescript
// tests/classProfileTaxonomyIntegration.test.ts
import assert from 'node:assert';
import fs from 'node:fs';

console.log('Testing ClassProfileAnchorDrawer taxonomy integrations...');

// Test 1: TopDrugClinicalCard connects taxonomy chips to drawer
const topCardContent = fs.readFileSync('src/components/TopDrugClinicalCard.tsx', 'utf-8');
assert.ok(
  topCardContent.includes('setIsClassDrawerOpen'),
  'TopDrugClinicalCard must provide state to open class drawer'
);
assert.ok(
  topCardContent.includes('ClassProfileAnchorDrawer'),
  'TopDrugClinicalCard must render ClassProfileAnchorDrawer'
);

// Test 2: StructureFlashcardCardFace provides class profile drawer touchpoint
const flashcardContent = fs.readFileSync('src/components/StructureFlashcardCardFace.tsx', 'utf-8');
assert.ok(
  flashcardContent.includes('ClassProfileAnchorDrawer') || flashcardContent.includes('onOpenClassProfile'),
  'StructureFlashcardCardFace must support opening ClassProfileAnchorDrawer'
);

// Test 3: TherapeuticClassFilterDrawer provides class profile inspection
const drawerContent = fs.readFileSync('src/components/TherapeuticClassFilterDrawer.tsx', 'utf-8');
assert.ok(
  drawerContent.includes('ClassProfileAnchorDrawer') || drawerContent.includes('Class Profile') || drawerContent.includes('resolveClassProfile'),
  'TherapeuticClassFilterDrawer must provide Class Profile Anchor Drawer access'
);

console.log('ClassProfileAnchorDrawer taxonomy tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/classProfileTaxonomyIntegration.test.ts`
Expected: FAIL on `StructureFlashcardCardFace` or `TherapeuticClassFilterDrawer`.

- [ ] **Step 3: Implement taxonomy touchpoints in `TopDrugClinicalCard.tsx`, `StructureFlashcardCardFace.tsx`, and `TherapeuticClassFilterDrawer.tsx`**

1. In `TopDrugClinicalCard.tsx`:
   - Connect both front (blinded trigger) and back taxonomy class chips to open `ClassProfileAnchorDrawer`.
2. In `StructureFlashcardCardFace.tsx`:
   - Add state / trigger to open `ClassProfileAnchorDrawer` when clicking the taxonomy breadcrumbs or class tags for a Top 200 drug.
3. In `TherapeuticClassFilterDrawer.tsx`:
   - Add a subtle `[📖 Profile]` button to each category row in the 1-39 list that opens `ClassProfileAnchorDrawer` for that therapeutic class.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/classProfileTaxonomyIntegration.test.ts`
Expected: PASS with "ClassProfileAnchorDrawer taxonomy tests passed!"

- [ ] **Step 5: Commit**

```bash
git add src/components/TopDrugClinicalCard.tsx src/components/StructureFlashcardCardFace.tsx src/components/TherapeuticClassFilterDrawer.tsx tests/classProfileTaxonomyIntegration.test.ts
git commit -m "feat(taxonomy): wire ClassProfileAnchorDrawer into flashcard breadcrumbs and class filter drawer"
```

---

### Task 9: App.tsx Event Handling & Whole-Branch Verification

**Files:**
- Modify: `src/App.tsx`
- Test: All unit test suites, `npm run lint`, `npm run build`

**Interfaces:**
- Consumes:
  - Custom DOM event `'app-open-3d-lab'`
- Produces:
  - Seamless navigation to the 3D Molecular Lab from any module without prop drilling.

- [ ] **Step 1: Wire `'app-open-3d-lab'` event listener in `src/App.tsx`**

In `src/App.tsx`:
- Add `useEffect` listening for `app-open-3d-lab`:
  ```typescript
  useEffect(() => {
    const handleOpen3DEvent = (e: Event) => {
      const { detail } = e as CustomEvent<{ structure?: ChemicalStructure; drugName?: string; launchFullscreen?: boolean }>;
      if (detail?.structure) {
        handleOpenIn3DLab(detail.structure, detail.launchFullscreen);
      } else if (detail?.drugName) {
        const catalogEntry = resolveDrug3DEntry(detail.drugName);
        const canonical = catalogEntry ? undefined : findCanonicalTargetForDrug(detail.drugName);
        setSelected3DDrug(catalogEntry?.genericName || detail.drugName);
        setSelected3DPdbId(catalogEntry?.pdbId || canonical?.pdbId);
        setIs3DFullscreenRequested(detail.launchFullscreen ?? false);
        switchTab('3d-lab');
      }
    };
    window.addEventListener('app-open-3d-lab', handleOpen3DEvent);
    return () => window.removeEventListener('app-open-3d-lab', handleOpen3DEvent);
  }, []);
  ```

- [ ] **Step 2: Run all test suites**

```bash
npx tsx tests/launchpadUrls.test.ts
npx tsx tests/clinicalReferenceToolbar.test.ts
npx tsx tests/institutionalSettings.test.ts
npx tsx tests/topDrugClinicalCardIndications.test.ts
npx tsx tests/structureFlashcardIndications.test.ts
npx tsx tests/medChemMatrixLaunchpad.test.ts
npx tsx tests/structureLightboxLaunchpad.test.ts
npx tsx tests/classProfileTaxonomyIntegration.test.ts
```
Expected: All tests PASS with exit code 0.

- [ ] **Step 3: Run TypeScript typecheck and production build**

```bash
npm run lint
npm run build
```
Expected: 0 errors; clean production build.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat(app): add app-open-3d-lab event listener and complete reference expansion"
```
