# Comprehensive Review Overhaul, Med Chem Matrix Polish & 3D Target Pocket Viewer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore complete curriculum fidelity for Reviews 8–11 (restoring Review 10 to 21 questions and Review 11 to 33 questions with interactive workbenches), repair Med Chem Matrix structure loading and selection desynchronization, add table thumbnails, and integrate an interactive 3D Macromolecular Target Pocket Viewer across all 4 modules.

**Architecture:** 
- Restructured modular curriculum data layers in `src/data/heartFailureModuleData.ts`, `src/data/antiarrhythmicModuleData.ts`, and corresponding workbench data modules.
- Pre-seeded zero-latency storage integration in `src/utils/moduleStorage.ts` ensuring Reviews 8, 9, 10, and 11 load instantly as built-in modules in in-memory cache, localStorage, and Dexie IndexedDB.
- Dual-key safe structure resolution (`resolveStructureSafe`) and multi-tier rendering fallback (RDKit WASM -> MolBlock -> PubChem CID PNG -> Lightbox fallback) in `MedChemMatrix.tsx`, `StructureComparator.tsx`, and `SmilesCanvas.tsx`.
- Standalone interactive 3D Macromolecular Target Pocket Viewer engine (`MacromolecularPocketViewer.tsx`) supporting PDB presets (`1KTS`, `4RET`, `1UZF`, `4PXZ`, `2J4I`), residue highlight interactions, and `sidecar://` pill links per science visualization rules.

**Tech Stack:** React 19, TypeScript 5.8+, Vite 8, Tailwind CSS 4, RDKit MinimalLib WASM, Lucide React, Dexie IndexedDB, TanStack Query.

**Spec:** `docs/superpowers/specs/2026-11-05-comprehensive-reviews-overhaul-and-3d-pocket-viewer-design.md`

## Global Constraints
- Full Curriculum Fidelity: Review 10 must contain exactly 21 questions matching source PDF `10)_Review_for_Heart_Failure_Drugs.pdf`; Review 11 must contain exactly 33 questions matching source PDF `11)_Review_for_Antiarrhythmic_Drugs.pdf`; Review 8 must contain all 25 questions; Review 9 must contain all 16 questions.
- Valid Chemistry: All chemical structures must include valid Daylight SMILES, accurate chemical classes, PubChem CIDs, and PK/PD profiles.
- Discrete Scoring: Every interactive structural workbench step must award discrete points (1 pt per step).
- Science Visualization Rule: Every 3D structure viewer view must surface a clickable `[Biomolecular Structure Viewer](sidecar://science/biomolecular_structure_viewer/ui.html)` pill link.
- Build Integrity: `npm run lint` (`tsc --noEmit`) and `npm run build` (`vite build`) must pass with 0 errors and 0 warnings.

## Review Focus
1. **Dropdown-to-ID Desynchronization**: Selecting a drug by name or Roman numeral in `StructureComparator` or `MedChemMatrix` fails to update `structureA`/`structureB` because keys differ (`name` vs `id` vs `cid`). Expected: `resolveStructureSafe` resolves across all identifier formats without resetting to `structures[0]`.
2. **Missing PubChem PNG URL Fallback**: Chemical structures lacking an explicit `pngUrl` fail to display when RDKit WASM initialization is delayed or encounters complex macrocycles. Expected: Auto-derive `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=large` whenever `cid` is present.
3. **Session Progress Key Collision**: Storing quiz progress across 4 modules must not overwrite question answers when question IDs restart at 1 in different pages or modules. Expected: Modular prefixing and page-based question ID isolation in `QuizSessionProgress`.
4. **Steroid Stereochemistry Scoring**: In Review 10 Q6, students must identify candidate steroids retaining positive inotropy based on the *cis/trans/cis* U-shaped steroid core and unsaturated lactone / nitrile pharmacophore. Expected: Evaluator awards 1 pt for correct steroid selection and provides structural rationales for all distractors.
5. **3D Pocket Viewer Context Cleanup**: Switching between different PDB targets (e.g. from Thrombin `1KTS` to Digoxin `4RET`) must cleanly reset camera, residue highlights, and distance measurements without memory leaks or WebGL context crashes.

---

### Task 1: Review 10 (Heart Failure) Restoration & Workbenches

**Files:**
- Create: `src/data/heartFailureWorkbenchData.ts`
- Create: `src/data/heartFailureModuleData.ts`
- Modify: `src/utils/moduleStorage.ts:1-135`
- Test: `scratch/test_heart_failure_module.ts`

**Interfaces:**
- Consumes: `ReviewModule`, `ReviewPage`, `AntiplateletQuestion`, `ChemicalStructure`, `StructuralWorkbenchData` from `src/types/reviewModule.ts`
- Produces: `getDefaultHeartFailureModule(): ReviewModule`, `HEART_FAILURE_WORKBENCHES: Record<string, StructuralWorkbenchData>`

- [ ] **Step 1: Write the failing test**

Create `scratch/test_heart_failure_module.ts`:
```typescript
import { getDefaultHeartFailureModule } from '../src/data/heartFailureModuleData';
import { loadAllReviewModules } from '../src/utils/moduleStorage';

const mod = getDefaultHeartFailureModule();
if (mod.id !== 'heart_failure_mcp2') throw new Error('Incorrect module ID');

let totalQuestions = 0;
mod.pages.forEach((p) => {
  p.sections.forEach((s) => {
    totalQuestions += s.questions.length;
  });
});

if (totalQuestions !== 21) {
  throw new Error(`Expected 21 questions in Review 10, found ${totalQuestions}`);
}

const allModules = loadAllReviewModules();
const hfInStorage = allModules.find((m) => m.id === 'heart_failure_mcp2');
if (!hfInStorage) {
  throw new Error('Heart Failure module not registered in moduleStorage loadAllReviewModules');
}

console.log('Heart Failure module verification PASSED with 21 questions');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx scratch/test_heart_failure_module.ts`
Expected: FAIL with "Cannot find module '../src/data/heartFailureModuleData'"

- [ ] **Step 3: Implement `src/data/heartFailureWorkbenchData.ts` and `src/data/heartFailureModuleData.ts`**

1. In `src/data/heartFailureWorkbenchData.ts`, define:
   - `DIGOXIN_WORKBENCH_DATA`:
     - `step2a_amides` (adapted for Glycone vs Aglycone encircling: D-digitoxose sugar chain vs cyclopentanoperhydrophenanthrene aglycone nucleus).
     - `step2b_moieties` (Steroid SAR: 14-beta OH, C17 unsaturated lactone, C3-beta glycosidic bond).
     - `step2c_nature` (Pharmacodynamic target binding vs Pharmacokinetic distribution/elimination badges).
     - `step2d_activeForm` (Candidates A–F for positive inotropic activity: U-shaped cis-trans-cis ring junction with unsaturated lactone or nitrile bioisostere).
   - `ACE_INHIBITOR_WORKBENCH_DATA`:
     - Classifying Captopril (Sulfhydryl), Lisinopril/Enalaprilat (Dicarboxylate), and Fosinopril (Phosphinate) by their catalytic $\text{Zn}^{2+}$-binding domain.
2. In `src/data/heartFailureModuleData.ts`, assemble all 21 questions across 5 pages with complete Daylight SMILES for Digoxin, Dobutamine, Metoprolol, Carvedilol, Losartan, Valsartan, Sacubitril, Sacubitrilat, Captopril, Lisinopril, Fosinopril, Ivabradine, and Milrinone.
3. In `src/utils/moduleStorage.ts`, import `getDefaultHeartFailureModule` and register `'heart_failure_mcp2'` in `loadAllReviewModules` and `initModuleStorageFromDexie`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx scratch/test_heart_failure_module.ts`
Expected: PASS with "Heart Failure module verification PASSED with 21 questions"

- [ ] **Step 5: Commit**

```bash
git add src/data/heartFailureWorkbenchData.ts src/data/heartFailureModuleData.ts src/utils/moduleStorage.ts scratch/test_heart_failure_module.ts
git commit -m "feat(hf): restore Review 10 with all 21 questions, Digoxin and ACE workbenches"
```

---

### Task 2: Review 11 (Antiarrhythmics) Restoration & Workbenches

**Files:**
- Create: `src/data/antiarrhythmicWorkbenchData.ts`
- Create: `src/data/antiarrhythmicModuleData.ts`
- Modify: `src/utils/moduleStorage.ts`
- Test: `scratch/test_antiarrhythmic_module.ts`

**Interfaces:**
- Consumes: `ReviewModule`, `ReviewPage`, `AntiplateletQuestion`, `ChemicalStructure`, `StructuralWorkbenchData` from `src/types/reviewModule.ts`
- Produces: `getDefaultAntiarrhythmicModule(): ReviewModule`, `ANTIARRHYTHMIC_WORKBENCHES: Record<string, StructuralWorkbenchData>`

- [ ] **Step 1: Write the failing test**

Create `scratch/test_antiarrhythmic_module.ts`:
```typescript
import { getDefaultAntiarrhythmicModule } from '../src/data/antiarrhythmicModuleData';
import { loadAllReviewModules } from '../src/utils/moduleStorage';

const mod = getDefaultAntiarrhythmicModule();
if (mod.id !== 'antiarrhythmics_mcp2') throw new Error('Incorrect module ID');

let totalQuestions = 0;
mod.pages.forEach((p) => {
  p.sections.forEach((s) => {
    totalQuestions += s.questions.length;
  });
});

if (totalQuestions !== 33) {
  throw new Error(`Expected 33 questions in Review 11, found ${totalQuestions}`);
}

const allModules = loadAllReviewModules();
const aaInStorage = allModules.find((m) => m.id === 'antiarrhythmics_mcp2');
if (!aaInStorage) {
  throw new Error('Antiarrhythmics module not registered in moduleStorage loadAllReviewModules');
}

console.log('Antiarrhythmics module verification PASSED with 33 questions');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx scratch/test_antiarrhythmic_module.ts`
Expected: FAIL with "Cannot find module '../src/data/antiarrhythmicModuleData'"

- [ ] **Step 3: Implement `src/data/antiarrhythmicWorkbenchData.ts` and `src/data/antiarrhythmicModuleData.ts`**

1. In `src/data/antiarrhythmicWorkbenchData.ts`, define:
   - `CLASS_I_KINETICS_WORKBENCH_DATA`:
     - Class IA (intermediate-off, $1-10\text{ s}$, APD prolongation, e.g. Procainamide, Disopyramide, Quinidine).
     - Class IB (fast-off, $<1\text{ s}$, APD shortening, e.g. Lidocaine, Mexiletine).
     - Class IC (slow-off, $>10\text{ s}$, unchanged APD, e.g. Flecainide, Propafenone).
   - `AMIODARONE_SAR_WORKBENCH_DATA`:
     - Amiodarone diiodo-benzofuran scaffold vs Dronedarone non-iodinated methylsulfonamide derivative.
     - Encircle iodine atoms responsible for thyroid hormone mimicry / thyrotoxicosis.
     - Drop-zone assignment for $\log P$, half-life ($t_{1/2} \approx 58\text{ days}$ vs $t_{1/2} \approx 24\text{ hours}$), and multi-channel blocking profile.
2. In `src/data/antiarrhythmicModuleData.ts`, assemble all 33 questions across 8 pages with structures for Procainamide, Lidocaine, Disopyramide, Mexiletine, Flecainide, Propafenone, Quinidine, Sotalol, Esmolol, Amiodarone, Dronedarone, Verapamil, and Diltiazem.
3. In `src/utils/moduleStorage.ts`, import `getDefaultAntiarrhythmicModule` and register `'antiarrhythmics_mcp2'` in `loadAllReviewModules` and `initModuleStorageFromDexie`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx scratch/test_antiarrhythmic_module.ts`
Expected: PASS with "Antiarrhythmics module verification PASSED with 33 questions"

- [ ] **Step 5: Commit**

```bash
git add src/data/antiarrhythmicWorkbenchData.ts src/data/antiarrhythmicModuleData.ts src/utils/moduleStorage.ts scratch/test_antiarrhythmic_module.ts
git commit -m "feat(antiarrhythmics): restore Review 11 with all 33 questions and kinetics/SAR workbenches"
```

---

### Task 3: Review 8 (Antiplatelets) Enrichment & Thienopyridine Workbench

**Files:**
- Create: `src/data/antiplateletWorkbenchData.ts`
- Modify: `src/data/antiplateletQuizData.ts:1-50`
- Modify: `src/components/ReviewQuiz.tsx`
- Test: `scratch/test_antiplatelet_workbench.ts`

**Interfaces:**
- Consumes: `THIENOPYRIDINE_WORKBENCH_DATA` from `src/data/antiplateletWorkbenchData.ts`
- Produces: Integrated structural workbench in Review 8 (questions 14–16) evaluating Clopidogrel and Prasugrel metabolic bioactivation and covalent P2Y12 disulfide trapping.

- [ ] **Step 1: Write the failing test**

Create `scratch/test_antiplatelet_workbench.ts`:
```typescript
import { THIENOPYRIDINE_WORKBENCH_DATA } from '../src/data/antiplateletWorkbenchData';
import { evaluateWorkbenchAnswer } from '../src/utils/workbenchEvaluator';
import { pdfPages } from '../src/data/antiplateletQuizData';

if (!THIENOPYRIDINE_WORKBENCH_DATA) throw new Error('THIENOPYRIDINE_WORKBENCH_DATA missing');

// Verify question 14 on page 4 contains the structural workbench
const page4 = pdfPages.find((p: any) => p.pageNumber === 4);
const q14 = page4?.sections?.[0]?.questions?.find((q: any) => q.id === 14);
if (!q14?.structuralWorkbench) {
  throw new Error('Question 14 does not attach structuralWorkbench');
}

// Test evaluation awarding points
const evalResult = evaluateWorkbenchAnswer(THIENOPYRIDINE_WORKBENCH_DATA, {
  selectedAmideIds: ['thiol_group'],
  selectedMoietyIds: ['thiolactone_ring'],
  dropZoneAssignments: {
    clopidogrel_bioactivation: 'cyp_two_step',
    prasugrel_bioactivation: 'ces2_single_step',
  },
  selectedCandidateId: 'active_cis_thiol_metabolite',
});

if (evalResult.totalScore < 1) {
  throw new Error('Workbench evaluator did not award points for correct answers');
}

console.log('Thienopyridine workbench verification PASSED');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx scratch/test_antiplatelet_workbench.ts`
Expected: FAIL with "Cannot find module '../src/data/antiplateletWorkbenchData'"

- [ ] **Step 3: Implement `src/data/antiplateletWorkbenchData.ts` and wire into `src/data/antiplateletQuizData.ts`**

1. In `src/data/antiplateletWorkbenchData.ts`:
   - Step 2a: Encircle nucleophilic thiol ($\text{-SH}$) on the opened thiolactone active metabolite.
   - Step 2b: Delineate the tetrahydrothienopyridine ring and ester prodrug moiety.
   - Step 2c: Drop-zone classification: Clopidogrel (CYP2C19 2-step oxidation; 85% ester hydrolysis to inactive acid by CES1) vs Prasugrel (CES2 rapid intestinal ester hydrolysis to thiolactone intermediate followed by single CYP step).
   - Step 2d: Select the covalent P2Y12 mixed disulfide candidate structure forming adduct with Cys17/Cys270.
2. In `src/data/antiplateletQuizData.ts`:
   - Attach `structuralWorkbench: THIENOPYRIDINE_WORKBENCH_DATA` to Question 14/15.
3. In `src/components/ReviewQuiz.tsx`:
   - Ensure `question.structuralWorkbench` triggers rendering of `StructuralWorkbenchQuestion`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx scratch/test_antiplatelet_workbench.ts`
Expected: PASS with "Thienopyridine workbench verification PASSED"

- [ ] **Step 5: Commit**

```bash
git add src/data/antiplateletWorkbenchData.ts src/data/antiplateletQuizData.ts src/components/ReviewQuiz.tsx scratch/test_antiplatelet_workbench.ts
git commit -m "feat(antiplatelets): enrich Review 8 with Thienopyridine bioactivation and disulfide workbench"
```

---

### Task 4: Med Chem Matrix Structure Image Loading Fix & General UI Polish

**Files:**
- Modify: `src/components/SmilesCanvas.tsx:1-494`
- Modify: `src/components/StructureComparator.tsx:870-1500`
- Modify: `src/components/MedChemMatrix.tsx:340-948`
- Test: `scratch/test_matrix_resolution.ts`

**Interfaces:**
- Consumes: `ChemicalStructure` from `src/types/reviewModule.ts`
- Produces:
  - `resolveStructureSafe(key: string, pool: ChemicalStructure[]): ChemicalStructure | undefined`
  - Auto-derived PubChem CID fallback URL in `SmilesCanvas.tsx`
  - Visual chemical structure thumbnails in `MedChemMatrix.tsx` table sticky first column

- [ ] **Step 1: Write the failing test**

Create `scratch/test_matrix_resolution.ts`:
```typescript
import { resolveStructureSafe } from '../src/components/MedChemMatrix';
import { ChemicalStructure } from '../src/types/reviewModule';

const testPool: ChemicalStructure[] = [
  {
    id: 'struct_I',
    name: 'Digoxin',
    cid: 2724385,
    smiles: 'CC1C(C(C(C(O1)OC2C(OC(CC2O)OC3C(OC(CC3O)OC4CCC5(C(C4)CCC6C5CCC7(C6(CCC7C8=CC(=O)OC8)O)C)C)C)C)O)O)O',
    chemicalClass: 'Cardiac Glycoside',
    target: 'Na+/K+-ATPase',
    reversibility: 'Reversible',
  },
  {
    id: 'II',
    name: 'Dobutamine',
    cid: 36811,
    smiles: 'CC(CCC1=CC=C(C=C1)O)NCC2=CC=C(C=C2)O',
    chemicalClass: 'Catecholamine derivative',
    target: 'Beta-1 adrenergic receptor',
    reversibility: 'Reversible',
  },
];

// Test 1: Resolve by ID
const byId = resolveStructureSafe('struct_I', testPool);
if (byId?.name !== 'Digoxin') throw new Error('Failed to resolve by id');

// Test 2: Resolve by Name (case-insensitive)
const byName = resolveStructureSafe('digoxin', testPool);
if (byName?.id !== 'struct_I') throw new Error('Failed to resolve by name');

// Test 3: Resolve by CID
const byCid = resolveStructureSafe('2724385', testPool);
if (byCid?.name !== 'Digoxin') throw new Error('Failed to resolve by CID');

// Test 4: Resolve Roman numeral ID
const byRoman = resolveStructureSafe('II', testPool);
if (byRoman?.name !== 'Dobutamine') throw new Error('Failed to resolve Roman numeral ID');

console.log('Matrix resolution test PASSED');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx scratch/test_matrix_resolution.ts`
Expected: FAIL with "resolveStructureSafe is not exported from '../src/components/MedChemMatrix'"

- [ ] **Step 3: Implement `resolveStructureSafe`, PubChem fallback, and UI enhancements**

1. In `src/components/MedChemMatrix.tsx`:
   - Export `resolveStructureSafe(key: string, pool: ChemicalStructure[]): ChemicalStructure | undefined`.
   - Update `structureA` and `structureB` to resolve safely using `resolveStructureSafe`.
   - Add a 44x44px 2D structure thumbnail in the sticky first column of the Head-to-Head Differential Matrix table.
   - Refine dark mode table borders (`border-slate-800`), sticky column backdrop blur and shadow, and filter badge pills.
2. In `src/components/StructureComparator.tsx`:
   - Update `handleSelectDrugA` and `handleSelectDrugB` to pass `selected?.id || selected?.name || selectedIdentifier`.
   - Pass `structure.cid` to `SmilesCanvas` and ensure `pngUrl` falls back to PubChem CID PNG URL: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${structure.cid}/PNG?image_size=large`.
3. In `src/components/SmilesCanvas.tsx`:
   - Add `cid?: number | string` to `SmilesCanvasProps`.
   - Compute `resolvedFallbackUrl = fallbackImageUrl || (cid ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=large` : undefined)`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx scratch/test_matrix_resolution.ts`
Expected: PASS with "Matrix resolution test PASSED"

- [ ] **Step 5: Commit**

```bash
git add src/components/MedChemMatrix.tsx src/components/StructureComparator.tsx src/components/SmilesCanvas.tsx scratch/test_matrix_resolution.ts
git commit -m "fix(matrix): resolve structure dropdown desync, add table thumbnails and auto PubChem PNG fallback"
```

---

### Task 5: 3D Macromolecular Target Pocket Viewer Engine

**Files:**
- Create: `src/components/MacromolecularPocketViewer.tsx`
- Modify: `src/components/MedChemMatrix.tsx`
- Modify: `src/components/StructureComparator.tsx`
- Modify: `src/components/ReviewQuiz.tsx`
- Test: `scratch/test_pocket_viewer.ts`

**Interfaces:**
- Consumes: Target receptor metadata, PDB co-crystal presets (`1KTS`, `4RET`, `1UZF`, `4PXZ`, `2J4I`)
- Produces: `MacromolecularPocketViewer: React.FC<MacromolecularPocketViewerProps>`, rendering interactive 3D binding pocket visualization with residue distance measurements and science rule compliant `sidecar://` link.

- [ ] **Step 1: Write the failing test**

Create `scratch/test_pocket_viewer.ts`:
```typescript
import { TARGET_PDB_PRESETS, getPdbPresetForTarget } from '../src/components/MacromolecularPocketViewer';

const thrombinPreset = getPdbPresetForTarget('Thrombin (Factor IIa)');
if (!thrombinPreset || thrombinPreset.pdbId !== '1KTS') {
  throw new Error('Expected PDB 1KTS for Thrombin');
}

const nkaPreset = getPdbPresetForTarget('Na+/K+-ATPase');
if (!nkaPreset || nkaPreset.pdbId !== '4RET') {
  throw new Error('Expected PDB 4RET for Na+/K+-ATPase');
}

const acePreset = getPdbPresetForTarget('ACE');
if (!acePreset || acePreset.pdbId !== '1UZF') {
  throw new Error('Expected PDB 1UZF for ACE');
}

const p2y12Preset = getPdbPresetForTarget('P2Y12');
if (!p2y12Preset || p2y12Preset.pdbId !== '4PXZ') {
  throw new Error('Expected PDB 4PXZ for P2Y12');
}

if (!thrombinPreset.keyResidues.some((r) => r.name.includes('Asp189'))) {
  throw new Error('Asp189 missing from Thrombin key residues');
}

console.log('Target Pocket Viewer preset verification PASSED');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx scratch/test_pocket_viewer.ts`
Expected: FAIL with "Cannot find module '../src/components/MacromolecularPocketViewer'"

- [ ] **Step 3: Implement `src/components/MacromolecularPocketViewer.tsx` and integrate across views**

1. Create `src/components/MacromolecularPocketViewer.tsx`:
   - Define `TARGET_PDB_PRESETS`:
     - `1KTS`: Thrombin + Dabigatran (Asp189 salt bridge, Ser195, Gly216).
     - `4RET`: $\text{Na}^+/\text{K}^+$-ATPase + Digoxin (Gln111, Glu117, Thr797).
     - `1UZF`: ACE catalytic domain + Captopril ($\text{Zn}^{2+}$, His383, Glu384, Tyr520).
     - `4PXZ`: P2Y12 receptor (Cys17, Cys270 disulfide, Lys280).
     - `2J4I`: Factor Xa + Rivaroxaban (Tyr228, Asp189, Gln192).
   - Implement interactive 3D WebGL / Canvas representation with camera orbit/zoom, representation toggles (**Cartoon + Sticks**, **Electrostatic Surface**, **Pocket Residues Only**), and distance metrics.
   - Display a prominent button surfacing the required user rule link: `[Biomolecular Structure Viewer](sidecar://science/biomolecular_structure_viewer/ui.html)`.
2. In `MedChemMatrix.tsx`:
   - Add a "3D Pocket" column button in the differential matrix table opening `MacromolecularPocketViewer` modal for the drug's target.
3. In `StructureComparator.tsx`:
   - Add a "View 3D Target Pocket" button under the target receptor label for Compound A and Compound B.
4. In `ReviewQuiz.tsx`:
   - Add an optional "View 3D Co-Crystal" button next to question structures where a target co-crystal is available.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx scratch/test_pocket_viewer.ts`
Expected: PASS with "Target Pocket Viewer preset verification PASSED"

- [ ] **Step 5: Commit**

```bash
git add src/components/MacromolecularPocketViewer.tsx src/components/MedChemMatrix.tsx src/components/StructureComparator.tsx src/components/ReviewQuiz.tsx scratch/test_pocket_viewer.ts
git commit -m "feat(3d-viewer): implement 3D Macromolecular Target Pocket Viewer with PDB presets and sidecar links"
```

---

### Task 6: End-to-End Regression Verification, Type Check, and Production Build

**Files:**
- Modify: Any files with lingering TypeScript warnings or unused imports
- Test: All automated verification scripts (`scratch/test_*.ts`)

- [ ] **Step 1: Run comprehensive regression test suite**

Run: `npx tsx scratch/test_heart_failure_module.ts`
Expected: PASS

Run: `npx tsx scratch/test_antiarrhythmic_module.ts`
Expected: PASS

Run: `npx tsx scratch/test_antiplatelet_workbench.ts`
Expected: PASS

Run: `npx tsx scratch/test_matrix_resolution.ts`
Expected: PASS

Run: `npx tsx scratch/test_pocket_viewer.ts`
Expected: PASS

- [ ] **Step 2: Run TypeScript lint / type check**

Run: `npm run lint` (`tsc --noEmit`)
Expected: Exit code 0 with 0 errors.

- [ ] **Step 3: Run production Vite build**

Run: `npm run build`
Expected: Exit code 0, building `dist/` cleanly without bundle errors.

- [ ] **Step 4: Commit and tag complete overhaul**

```bash
git add .
git commit -m "chore(release): verify all 4 reviews, matrix repair, and 3D pocket viewer with clean build"
```
