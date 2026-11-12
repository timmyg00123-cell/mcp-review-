# Clinical Knowledge Dossier, Institutional Launchpad & 3D Lab Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate on-demand clinical knowledge dossiers (DailyMed/FDA, RxNorm, StatPearls), an OpenAthens-enabled institutional launchpad for Lexicomp and AccessPharmacy, and a dedicated 3D Lab Library tab with Mol* 3D visualization and ChEMBL quantitative SAR metrics.

**Architecture:** Client-side federated architecture caching clinical dossiers in IndexedDB via Dexie.js; lightweight URL resolvers for university SSO launchpad links; and an isolated top-level route/tab (`3d-lab`) that mounts 3D WebGL (Mol*) and ChEMBL bioactivity queries only on demand to protect card review performance.

**Tech Stack:** React 19, TypeScript, Dexie.js (IndexedDB), Tailwind CSS v4, Lucide React, NLM DailyMed & OpenFDA APIs, NLM RxNav REST API, NCBI Bookshelf E-Utilities, EMBL-EBI ChEMBL REST API, RCSB PDB Web API.

**Spec:** [`docs/superpowers/specs/2026-11-12-clinical-and-3d-lab-design.md`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/docs/superpowers/specs/2026-11-12-clinical-and-3d-lab-design.md)

## Global Constraints
- Purely client-side execution compatible with static Vercel deployment (`vercel.json`) without requiring new backend serverless routes.
- Offline-first resilience: all network fetches must be cached in Dexie and gracefully handle API downtime or missing compound records.
- Zero WebGL overhead on flashcards or SAR matrices: 3D canvas is restricted to the dedicated `3d-lab` view.
- Test runner: `npx tsx tests/<test-file>.test.ts` using `node:assert`.

## Review Focus
- **Network timeout / offline mode:** When an external API fails or is unreachable, the clinical info box and 3D tab must show graceful fallback UI rather than throwing uncaught promise rejections.
- **Experimental compounds:** Drugs without FDA labels (e.g. research probes or prodrug intermediates) must display informative empty states with search links.
- **Case-insensitive drug matching:** Drug names with salt suffixes (e.g., "Clopidogrel bisulfate" vs "Clopidogrel") must normalize to base names for RxNorm and ChEMBL lookups.
- **OpenAthens URL encoding:** Deep-link query parameters must be properly percent-encoded to prevent broken search strings in Lexicomp and AccessPharmacy.
- **3D Tab State Handoff:** Clicking "Open in 3D Lab →" from any card in review decks or matrices must correctly populate the target selector and activate the tab without stale state.

---

### Task 1: Dexie Schema & Clinical Dossier Service

**Files:**
- Modify: `src/db/db.ts`
- Create: `src/services/clinicalDossierService.ts`
- Test: `tests/clinicalDossierService.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface ClinicalDossierRecord {
    genericName: string;
    dailyMed?: {
      boxedWarning?: string;
      indications?: string[];
      dosageForms?: string[];
      splWebUrl?: string;
    };
    rxNorm?: {
      rxcui: string;
      brandNames: string[];
      synonyms: string[];
    };
    statPearls?: {
      title?: string;
      bookshelfUid?: string;
      bookshelfUrl?: string;
      summary?: string;
    };
    lastUpdated: number;
  }
  export function fetchClinicalDossier(drugName: string): Promise<ClinicalDossierRecord>;
  export function normalizeDrugBaseName(rawName: string): string;
  ```

- [ ] **Step 1: Write the failing test**

Create `tests/clinicalDossierService.test.ts` verifying drug base name normalization, schema structure, and mock API response handling for DailyMed, RxNorm, and StatPearls.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/clinicalDossierService.test.ts`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Update `src/db/db.ts` and implement `src/services/clinicalDossierService.ts`**

Add `clinicalDossiers` store to Dexie database in `src/db/db.ts`. Implement `normalizeDrugBaseName` (stripping common salt forms like hydrochloride, bisulfate, sodium) and `fetchClinicalDossier` with OpenFDA, RxNav, and NCBI Bookshelf fetching + Dexie caching.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/clinicalDossierService.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/db/db.ts src/services/clinicalDossierService.ts tests/clinicalDossierService.test.ts
git commit -m "feat(clinical): add clinicalDossierService with OpenFDA, RxNav, StatPearls and Dexie caching"
```

---

### Task 2: Clinical Dossier Modal Drawer Component

**Files:**
- Create: `src/components/ClinicalDossierModal.tsx`
- Test: `tests/clinicalDossierModal.test.ts`

**Interfaces:**
- Consumes: `ClinicalDossierRecord`, `fetchClinicalDossier` from `src/services/clinicalDossierService.ts`
- Produces:
  ```ts
  export interface ClinicalDossierModalProps {
    isOpen: boolean;
    onClose: () => void;
    drugName: string;
    preloadedDossier?: ClinicalDossierRecord | null;
  }
  export const ClinicalDossierModal: React.FC<ClinicalDossierModalProps>;
  ```

- [ ] **Step 1: Write the failing test**

Create `tests/clinicalDossierModal.test.ts` verifying modal state management, tab switching logic ('fda' | 'rxnorm' | 'statpearls'), and error/loading fallback structures.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/clinicalDossierModal.test.ts`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement `src/components/ClinicalDossierModal.tsx`**

Build the drawer/modal with tabbed navigation: DailyMed / FDA Boxed Warning & Indications, RxNorm Brand Names & RxCUI, and StatPearls Clinical Review with direct link-out to NCBI Bookshelf.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/clinicalDossierModal.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ClinicalDossierModal.tsx tests/clinicalDossierModal.test.ts
git commit -m "feat(ui): add ClinicalDossierModal drawer component"
```

---

### Task 3: Institutional Launchpad & OpenAthens Resolver

**Files:**
- Create: `src/utils/launchpadUrls.ts`
- Modify: `src/components/ChemicalStructureCard.tsx`
- Test: `tests/institutionalLaunchpad.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface LaunchpadConfig {
    institutionName: string;
    openAthensAuthUrl: string;
  }
  export const XULA_OPENATHENS_CONFIG: LaunchpadConfig;
  export function getLexicompSearchUrl(drugName: string): string;
  export function getAccessPharmacySearchUrl(drugName: string): string;
  export function getOpenAthensAuthUrl(config?: LaunchpadConfig): string;
  ```

- [ ] **Step 1: Write the failing test**

Create `tests/institutionalLaunchpad.test.ts` testing URL generation for Lexicomp, AccessPharmacy, and OpenAthens authentication redirect.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/institutionalLaunchpad.test.ts`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement `src/utils/launchpadUrls.ts` and integrate into `ChemicalStructureCard.tsx`**

Implement URL generators in `launchpadUrls.ts`. In `ChemicalStructureCard.tsx`, add the "Clinical Info Box" trigger button, Lexicomp/AccessPharmacy launch badges, and XULA OpenAthens authentication link.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/institutionalLaunchpad.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/launchpadUrls.ts src/components/ChemicalStructureCard.tsx tests/institutionalLaunchpad.test.ts
git commit -m "feat(launchpad): add institutional launchpad with OpenAthens XULA resolver"
```

---

### Task 4: ChEMBL Service & Canonical Target Mapping

**Files:**
- Create: `src/utils/canonicalTargets.ts`
- Create: `src/services/chemblService.ts`
- Test: `tests/chemblService.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface TargetPdbMapping {
    targetName: string;
    geneSymbol: string;
    pdbId: string;
    description: string;
    exampleDrugs: string[];
  }
  export interface ChemblBioactivityRecord {
    moleculeChemblId: string;
    prefName: string;
    mechanismOfAction?: string;
    targetName?: string;
    assayType?: string;
    standardValue?: number;
    standardUnits?: string;
    standardType?: string; // Ki, IC50, Kd
  }
  export const CANONICAL_MEDCHEM_TARGETS: TargetPdbMapping[];
  export function findCanonicalTargetForDrug(drugName: string): TargetPdbMapping | undefined;
  export function fetchChemblBioactivity(drugName: string): Promise<ChemblBioactivityRecord[]>;
  ```

- [ ] **Step 1: Write the failing test**

Create `tests/chemblService.test.ts` testing canonical target resolution (e.g. Clopidogrel -> P2Y12 / 4NTJ, Captopril -> ACE / 1O86, Losartan -> AT1 / 4Z9O) and ChEMBL query normalization.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/chemblService.test.ts`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement `src/utils/canonicalTargets.ts` and `src/services/chemblService.ts`**

Curate canonical drug targets with high-resolution co-crystal PDB IDs. Implement drug-centric ChEMBL API waterfall resolving molecule ID and querying `/mechanism` and `/activity`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/chemblService.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/canonicalTargets.ts src/services/chemblService.ts tests/chemblService.test.ts
git commit -m "feat(chembl): add canonical PDB target mapping and ChEMBL bioactivity service"
```

---

### Task 5: 3D Lab Library Workspace & Navigation Wiring

**Files:**
- Create: `src/components/ThreeDLabLibrary.tsx`
- Modify: `src/components/Navbar.tsx`
- Modify: `src/App.tsx`
- Test: `tests/threeDLabLibraryIntegration.test.ts`

**Interfaces:**
- Consumes: `CANONICAL_MEDCHEM_TARGETS`, `fetchChemblBioactivity`, `ChemicalStructure`
- Produces:
  ```ts
  export interface ThreeDLabLibraryProps {
    initialDrugName?: string;
    initialPdbId?: string;
  }
  export const ThreeDLabLibrary: React.FC<ThreeDLabLibraryProps>;
  ```

- [ ] **Step 1: Write the failing test**

Create `tests/threeDLabLibraryIntegration.test.ts` verifying tab type definitions in `Navbar.tsx`, target selection state, and structure handoff to 3D Lab.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/threeDLabLibraryIntegration.test.ts`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement `ThreeDLabLibrary.tsx` and wire in `Navbar.tsx` and `App.tsx`**

Build `ThreeDLabLibrary.tsx` with side-by-side Mol* / PDB 3D viewer canvas and ChEMBL bioactivity panel. Add `'3d-lab'` tab to `Navbar.tsx`. Wire `onSelectStructureFor3D` in `ChemicalStructureCard.tsx` and `App.tsx` so clicking "Open in 3D Lab →" switches tab and preselects the drug.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/threeDLabLibraryIntegration.test.ts`
Expected: PASS

- [ ] **Step 5: Run full TypeScript check and all test suites**

Run: `npm run lint` and verify clean build.

- [ ] **Step 6: Commit**

```bash
git add src/components/ThreeDLabLibrary.tsx src/components/Navbar.tsx src/App.tsx tests/threeDLabLibraryIntegration.test.ts
git commit -m "feat(3d-lab): add 3D Lab Library workspace and navigation integration"
```
