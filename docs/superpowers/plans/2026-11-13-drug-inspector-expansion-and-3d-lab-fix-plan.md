# Drug Inspector Expansion & 3D Lab Loading Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the drug inspection feature into a unified, high-yield Drug Intelligence Inspector with clinical PK/PD decision guidance, interactive pharmacophore tags, safety/boxed warnings, PubChem properties, and a direct fullscreen 3D Lab launcher, while resolving the browser CORS coordinate loading failure in the 3D Lab.

**Architecture:** Transform `PubChemInspectorModal` into a 4-tab clinical & medchem dossier backed by a curated `drugIntelligenceData.ts` catalog that synthesizes `canonicalPharmacophorePkData.ts` and `clinicalPharmacologyDictionary.ts`. Fix `structure3dService.ts` to query open-CORS EBI PDBe endpoints (`https://www.ebi.ac.uk/pdbe/...`) and make coordinate pre-parsing non-blocking in `ThreeDLabCanvas.tsx`. Wire `initialFullscreen` through `ThreeDLabLibrary` and `App.tsx` for seamless one-click 3D Lab launching.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide icons, Mol* (PDBeMolstar) WebGL, TanStack Query, Vitest/Node test runner.

**Spec:** [docs/superpowers/specs/2026-11-13-drug-inspector-expansion-and-3d-lab-fix-design.md](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/docs/superpowers/specs/2026-11-13-drug-inspector-expansion-and-3d-lab-fix-design.md)

## Global Constraints
- All external coordinate fetches in browser runtimes must use endpoints with `Access-Control-Allow-Origin: *`.
- No blocking network requests may prevent Mol* from streaming `.bcif` binary coordinates.
- Modal must remain responsive across viewports (`max-w-4xl`, responsive padding).
- Zero breaking changes to existing `onInspectStructure` or `onInspectPubChem` prop contracts.
- 100% test pass rate and 0 TypeScript errors (`tsc --noEmit`).

## Review Focus
1. Inspecting a non-canonical drug without a 3D co-crystal disables the 3D Lab launcher with an informative badge and provides graceful empty states in Tab 2.
2. Coordinate fetch failures on EBI PDBe fall back gracefully to RCSB without unhandled promise rejections or canvas freezes.
3. Launching 3D Lab in fullscreen from the inspector switches tabs to `3d-lab`, auto-engages `isFullscreen`, and mounts with correct target and ligand without aspect ratio distortion.
4. Copying SMILES in Tab 4 displays clipboard toast confirmation and does not cause layout jitter.
5. Tab switching preserves inspected drug state and does not re-fetch network data unnecessarily.

---

### Task 1: 3D Lab CORS Fix & Fullscreen Target Handoff

**Files:**
- Modify: `src/services/structure3dService.ts:115-158`
- Modify: `src/components/ThreeDLabCanvas.tsx:430-475`
- Modify: `src/components/ThreeDLabLibrary.tsx:37-110`
- Modify: `src/App.tsx:385-410, 1820-1840`
- Test: `tests/threeDLabCorsAndFullscreen.test.ts`

**Interfaces:**
- Consumes: `fetchPdbCoordinates`, `ThreeDLabLibraryProps`, `AppTab`.
- Produces:
  - `fetchPdbCoordinates(pdbId: string, signal?: AbortSignal): Promise<string>` using EBI PDBe CORS-enabled endpoint (`https://www.ebi.ac.uk/pdbe/entry-files/download/pdb{id}.ent`) with fallback.
  - `ThreeDLabLibraryProps.initialFullscreen?: boolean` to auto-engage fullscreen mode upon mounting.
  - `handleOpenIn3DLab(structure: ChemicalStructure, launchFullscreen?: boolean): void` in `App.tsx`.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/threeDLabCorsAndFullscreen.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('structure3dService routes PDB coordinates through CORS-enabled EBI PDBe endpoint', () => {
  const source = fs.readFileSync('src/services/structure3dService.ts', 'utf-8');
  assert.ok(source.includes('www.ebi.ac.uk/pdbe/entry-files/download'), 'Uses EBI PDBe endpoint for open CORS');
  assert.ok(!source.includes('const url = `https://files.rcsb.org/download/${cleanId}.pdb`'), 'Eliminates blocked files.rcsb.org primary download');
});

test('ThreeDLabCanvas wraps ligand pre-parsing in non-fatal handler', () => {
  const source = fs.readFileSync('src/components/ThreeDLabCanvas.tsx', 'utf-8');
  assert.ok(source.includes('try {') && source.includes('fetchPdbCoordinates'), 'Non-fatal try-catch around fetchPdbCoordinates');
});

test('ThreeDLabLibrary accepts initialFullscreen prop and App coordinates fullscreen handoff', () => {
  const libSource = fs.readFileSync('src/components/ThreeDLabLibrary.tsx', 'utf-8');
  assert.ok(libSource.includes('initialFullscreen?: boolean'), 'Accepts initialFullscreen prop');
  
  const appSource = fs.readFileSync('src/App.tsx', 'utf-8');
  assert.ok(appSource.includes('initialFullscreen={'), 'App passes initialFullscreen to ThreeDLabLibrary');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/threeDLabCorsAndFullscreen.test.ts`
Expected: FAIL (EBI PDBe endpoint not present in `structure3dService.ts`).

- [ ] **Step 3: Implement CORS fix and fullscreen wiring**

1. In `src/services/structure3dService.ts`:
   - Change primary download URL to `https://www.ebi.ac.uk/pdbe/entry-files/download/pdb${cleanId.toLowerCase()}.ent`.
   - Add secondary fallback to `https://models.rcsb.org/${cleanId.toLowerCase()}.cif` if primary fetch fails.
2. In `src/components/ThreeDLabCanvas.tsx`:
   - Wrap `fetchPdbCoordinates(cleanPdbId)` in `try...catch` so that failure to fetch text PDB coordinates does not abort Mol* `.bcif` binary streaming.
3. In `src/components/ThreeDLabLibrary.tsx`:
   - Add `initialFullscreen?: boolean` to `ThreeDLabLibraryProps`.
   - Initialize `isFullscreen` state as `useState<boolean>(initialFullscreen ?? false)`.
4. In `src/App.tsx`:
   - Add `is3DFullscreenRequested` state (`boolean`).
   - Update `handleOpenIn3DLab` to accept `launchFullscreen: boolean = false`, setting `is3DFullscreenRequested`.
   - Pass `initialFullscreen={is3DFullscreenRequested}` to `<ThreeDLabLibrary>`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/threeDLabCorsAndFullscreen.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/services/structure3dService.ts src/components/ThreeDLabCanvas.tsx src/components/ThreeDLabLibrary.tsx src/App.tsx tests/threeDLabCorsAndFullscreen.test.ts
git commit -m "fix(3d-lab): resolve coordinate CORS blocking with EBI PDBe and add fullscreen launcher handoff"
```

---

### Task 2: Curated Drug Intelligence PK/PD Catalog & Decision Profiles

**Files:**
- Create: `src/data/drugIntelligenceData.ts`
- Test: `tests/drugIntelligenceData.test.ts`

**Interfaces:**
- Consumes: `CLINICAL_PHARMACOLOGY_DICTIONARY` from `src/utils/clinicalPharmacologyDictionary.ts`, `CANONICAL_MEDCHEM_PROFILES` from `src/data/canonicalPharmacophorePkData.ts`.
- Produces:
  - `interface DrugIntelligenceProfile`:
    - `drugName: string`
    - `isProdrug: boolean`
    - `prodrugActivation?: string`
    - `halfLife: string`
    - `tMax: string`
    - `bioavailability: string`
    - `proteinBinding: string`
    - `volumeOfDistribution?: string`
    - `cypMetabolism: string`
    - `clearance: string`
    - `clinicalDecisionRationale: string` ("Why choose this drug")
    - `contraindications: string[]`
    - `boxedWarnings?: string`
    - `targetGeneSymbol?: string`
    - `pdbId?: string`
  - `getDrugIntelligenceProfile(drugName: string): DrugIntelligenceProfile | null`

- [ ] **Step 1: Write the failing test**

```typescript
// tests/drugIntelligenceData.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { getDrugIntelligenceProfile, DRUG_INTELLIGENCE_CATALOG } from '../src/data/drugIntelligenceData';

test('getDrugIntelligenceProfile resolves clopidogrel with complete PK/PD and decision rationale', () => {
  const profile = getDrugIntelligenceProfile('Clopidogrel');
  assert.ok(profile, 'Finds profile for Clopidogrel');
  assert.equal(profile.isProdrug, true, 'Identifies prodrug status');
  assert.ok(profile.prodrugActivation?.includes('CYP2C19'), 'Captures CYP2C19 activation mechanism');
  assert.ok(profile.clinicalDecisionRationale.length > 20, 'Has clinical decision guidance');
  assert.ok(profile.halfLife, 'Has half-life');
  assert.ok(profile.bioavailability, 'Has bioavailability');
  assert.ok(profile.proteinBinding, 'Has protein binding');
  assert.equal(profile.targetGeneSymbol, 'P2RY12');
  assert.equal(profile.pdbId, '4NTJ');
});

test('getDrugIntelligenceProfile handles case-insensitivity and aliases', () => {
  const ticagrelor = getDrugIntelligenceProfile('ticagrelor');
  assert.ok(ticagrelor);
  assert.equal(ticagrelor.isProdrug, false, 'Ticagrelor is an active drug');

  const aspirin = getDrugIntelligenceProfile('ASA');
  assert.ok(aspirin);
  assert.equal(aspirin.targetGeneSymbol, 'PTGS1');
});

test('getDrugIntelligenceProfile returns null safely for unknown drugs', () => {
  assert.equal(getDrugIntelligenceProfile('UnknownCompoundX99'), null);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/drugIntelligenceData.test.ts`
Expected: FAIL (module `drugIntelligenceData` does not exist).

- [ ] **Step 3: Implement `src/data/drugIntelligenceData.ts`**

- Define `DrugIntelligenceProfile` interface.
- Populate `DRUG_INTELLIGENCE_CATALOG` for cardiovascular and curricular medchem drugs (clopidogrel, prasugrel, ticagrelor, cangrelor, aspirin, eptifibatide, tirofiban, vorapaxar, enalaprilat, atorvastatin, etc.) mapping their PK/PD parameters, clinical decision rationale ("When to choose"), boxed warnings, and target connections.
- Implement normalized name lookup function `getDrugIntelligenceProfile(drugName: string): DrugIntelligenceProfile | null`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/drugIntelligenceData.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/drugIntelligenceData.ts tests/drugIntelligenceData.test.ts
git commit -m "feat(inspector): create curated drug intelligence PK/PD and clinical decision catalog"
```

---

### Task 3: Unified Drug Intelligence Inspector (`PubChemInspectorModal.tsx`)

**Files:**
- Modify: `src/components/PubChemInspectorModal.tsx`
- Modify: `src/App.tsx:1890-1897`
- Test: `tests/drugInspectorModal.test.ts`

**Interfaces:**
- Consumes:
  - `getDrugIntelligenceProfile` from `src/data/drugIntelligenceData.ts`.
  - `findCanonicalTargetForDrug`, `findMedChemProfile` from `src/data/canonicalPharmacophorePkData.ts`.
  - `fetchClinicalDossier` from `src/services/clinicalDossierService.ts`.
  - `handleOpenIn3DLab` from `src/App.tsx`.
- Produces:
  - Upgraded `<PubChemInspectorModal>` with 4 tabs:
    1. Clinical PK/PD & Decision Guidance
    2. Pharmacophores & SAR
    3. Safety, Toxicities & Warnings
    4. Chemical Properties & PubChem
  - Header with prominent "Open in 3D Lab (Fullscreen)" button that calls `onOpenIn3DLab(structure, true)`.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/drugInspectorModal.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('PubChemInspectorModal source code implements 4-tab clinical & medchem architecture', () => {
  const source = fs.readFileSync('src/components/PubChemInspectorModal.tsx', 'utf-8');
  assert.ok(source.includes('activeTab') || source.includes('selectedTab'), 'Implements tab state');
  assert.ok(source.includes('Clinical PK/PD') || source.includes('Decision'), 'Has PK/PD Decision tab');
  assert.ok(source.includes('Pharmacophore') || source.includes('SAR'), 'Has Pharmacophores tab');
  assert.ok(source.includes('Safety') || source.includes('Warning'), 'Has Safety & Warnings tab');
  assert.ok(source.includes('Chemical') || source.includes('PubChem'), 'Has Chemical PubChem tab');
});

test('PubChemInspectorModal provides Open in 3D Lab (Fullscreen) header action', () => {
  const source = fs.readFileSync('src/components/PubChemInspectorModal.tsx', 'utf-8');
  assert.ok(source.includes('onOpenIn3DLab'), 'Accepts onOpenIn3DLab callback prop');
  assert.ok(source.includes('3D Lab'), 'Renders 3D Lab action button in header');
});

test('App.tsx passes onOpenIn3DLab to PubChemInspectorModal', () => {
  const appSource = fs.readFileSync('src/App.tsx', 'utf-8');
  assert.ok(appSource.includes('onOpenIn3DLab='), 'Wired onOpenIn3DLab prop on PubChemInspectorModal');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/drugInspectorModal.test.ts`
Expected: FAIL (missing tab architecture and `onOpenIn3DLab` wiring).

- [ ] **Step 3: Implement Unified Drug Intelligence Inspector in `PubChemInspectorModal.tsx`**

1. Update `PubChemInspectorModalProps`:
   - Add `onOpenIn3DLab?: (structure: ChemicalStructure, fullscreen?: boolean) => void`.
2. Add tab navigation state:
   - `const [activeTab, setActiveTab] = useState<'decision' | 'pharmacophores' | 'safety' | 'chemical'>('decision');`
3. Resolve drug intelligence profile and canonical target:
   - `const intelProfile = getDrugIntelligenceProfile(searchTerm);`
   - `const canonical = findCanonicalTargetForDrug(searchTerm);`
   - `const medChemProfile = canonical ? findMedChemProfile(canonical.geneSymbol) : undefined;`
4. Render Header:
   - Drug title, chemical class pill, and action button: **"Open in 3D Lab (Fullscreen)"**. If canonical target is present, clicking calls `onOpenIn3DLab(currentStructure, true)` and `onClose()`. If no PDB co-crystal, renders disabled button with badge: *"3D Co-crystal Not Available"*.
5. Render Tabs:
   - **Tab 1 (Clinical PK/PD & Decision):** Prodrug vs. Active badge with mechanism, metrics grid ($T_{1/2}$, $T_{\max}$, $F$, PPB, CYP, Excretion), and "Clinical Decision Guidance" card.
   - **Tab 2 (Pharmacophores & SAR):** Pharmacophore chips list (`PharmacophorePkPdGroup`), structural role descriptions, and key pocket residues.
   - **Tab 3 (Safety & Warnings):** FDA boxed warnings alert card, contraindications list, and monitoring parameters.
   - **Tab 4 (Chemical & PubChem):** 2D structure image, formula, MW, XLogP, SMILES with copy button, and NIH PubChem external link.
6. In `src/App.tsx`:
   - Pass `onOpenIn3DLab={handleOpenIn3DLab}` to `<PubChemInspectorModal>`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/drugInspectorModal.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/PubChemInspectorModal.tsx src/App.tsx tests/drugInspectorModal.test.ts
git commit -m "feat(inspector): expand Drug Inspector into 4-tab clinical & medchem dossier with fullscreen 3D Lab link"
```

---

### Task 4: Whole-Branch Integration, Regression Sweep & Verification

**Files:**
- Test: All test files in `tests/*.test.ts`

- [ ] **Step 1: Run comprehensive regression test sweep**

Run: `Get-ChildItem tests/*.test.ts | ForEach-Object { npx tsx $_.FullName }`
Expected: 100% PASS across all suites (40+ test suites).

- [ ] **Step 2: Run type check and production build**

Run: `npm run lint` and `npm run build`
Expected: 0 TypeScript errors, successful Vite production build.

- [ ] **Step 3: Verification commit**

```bash
git commit --allow-empty -m "chore(inspector): verify drug inspector expansion and 3d lab CORS fix"
```
