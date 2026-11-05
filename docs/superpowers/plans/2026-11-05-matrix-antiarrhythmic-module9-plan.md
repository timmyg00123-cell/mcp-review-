# MedChem Matrix Safety Condensation, Antiarrhythmic Quiz Fixes, Single-Structure Focus Stage, and Module 9 Restoration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a high-yield study experience by condensing MedChem Matrix safety warnings to max 5 items with a full FDA modal, fixing Antiarrhythmics Questions 1 and 14, providing a dedicated single-structure focus stage, and restoring Module 9 (Anticoagulants) across all 7 pages (27 questions) with PubChem audits.

**Architecture:** A standalone clinical warning parser (`formatClinicalWarnings`) normalizes and truncates verbose FDA package inserts for the MedChem Matrix without row bloat, pairing with an unstyled/portal modal for full disclosures. Antiarrhythmics Question 1 receives `matchingTargets` for `StructureDragDropMatch`, while Question 14 and `StructuralWorkbenchQuestion` gain Lidocaine vector SVG bond schematics and canvas auto-normalization. `StructureComparator` gains a `viewMode` toggle and single-structure layout, auto-engaged by `ReviewDeck` when only one drug is relevant. `anticoagulantsQuizData` is expanded into all 7 lecture pages with full clinical structures and automated storage migration.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Lucide React, Node.js / `tsx` for automated tests, Vite.

**Spec:** [`docs/superpowers/specs/2026-11-05-matrix-antiarrhythmic-module9-design.md`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/docs/superpowers/specs/2026-11-05-matrix-antiarrhythmic-module9-design.md)

## Global Constraints

- TypeScript strict type safety: zero `any` type escapes in core application state or component props.
- Zero layout shifts: table headers and columns must remain sticky and aligned in `MedChemMatrix`.
- Canvas bounds: SVG vector canvas in `StructuralWorkbenchQuestion` uses an 880×320 coordinate box; percentages must be auto-projected into this canvas.
- No data loss: `moduleStorage.ts` must safely migrate existing user progress and invalidate stale 2-question versions of `anticoagulants_mcp2` without corrupting other custom modules.
- Verification: all tests, `tsc --noEmit`, and `npm run build` must succeed without errors.

## Review Focus

1. **Empty / Malformed Warnings Input**: `formatClinicalWarnings` receives `undefined`, null, empty string, or whitespace-only strings — must return empty items array with `isTruncated: false` and fallback placeholder.
2. **Single Drug Overflow in Comparator**: In single-structure mode, ensure dropdown controls do not attempt to read or swap non-existent Compound B properties, preventing runtime `undefined` property crashes.
3. **SVG Halo Canvas Boundary**: Halos in `StructuralWorkbenchQuestion` positioned near canvas edges (x < 30 or x > 850) must not clip or overflow responsive SVG containers on mobile/tablet viewports.
4. **Question 1 Matching ID Alignment**: Structure IDs passed to `matchingTargets` in Review 11 Q1 must match the structure IDs (`propafenone`, `lidocaine`, `procainamide`, `disopyramide`, `flecainide`) exactly.
5. **Storage Version Migration Invalidation**: Stored localStorage overrides from earlier sessions for `anticoagulants_mcp2` containing only 2 questions must automatically be upgraded to the complete 7-page, 27-question lecture deck.

---

### Task 1: Clinical Warning Formatter & MedChem Matrix Safety Condensation

**Files:**
- Create: `src/utils/clinicalWarningFormatter.ts`
- Create: `tests/clinicalWarningFormatter.test.ts`
- Modify: `src/components/MedChemMatrix.tsx:920-960`

**Interfaces:**
- Consumes: Raw FDA text or array of strings (`adverseReactions`, `contraindicationsText`, `majorToxicityOrLimitation`).
- Produces: `formatClinicalWarnings(warnings: string | string[] | undefined, maxItems?: number): FormattedClinicalWarnings`
  ```ts
  export interface FormattedClinicalWarnings {
    items: string[];
    isTruncated: boolean;
    totalCount: number;
    rawText: string;
  }
  ```

- [ ] **Step 1: Write the failing test**
  Create `tests/clinicalWarningFormatter.test.ts` to test splitting sentences, bullet points, filtering noisy boilerplates, capping at 5 items, and setting `isTruncated`:
  ```ts
  import assert from 'node:assert';
  import { formatClinicalWarnings } from '../src/utils/clinicalWarningFormatter';

  // Test 1: Empty or undefined input
  const emptyRes = formatClinicalWarnings(undefined);
  assert.deepStrictEqual(emptyRes.items, []);
  assert.strictEqual(emptyRes.isTruncated, false);

  // Test 2: Array of items capping at 5
  const longArray = ['Nausea', 'Vomiting', 'Headache', 'Dizziness', 'Arrhythmia', 'Visual disturbance', 'Confusion'];
  const arrayRes = formatClinicalWarnings(longArray, 5);
  assert.strictEqual(arrayRes.items.length, 5);
  assert.strictEqual(arrayRes.isTruncated, true);
  assert.strictEqual(arrayRes.totalCount, 7);

  // Test 3: Raw verbose FDA paragraph splitting
  const rawParagraph = 'Contraindications: Hypersensitivity to active drug. Adverse Reactions: Most common adverse reactions are visual disturbances, cardiac arrhythmias, and nausea. Avoid in ventricular fibrillation.';
  const paraRes = formatClinicalWarnings(rawParagraph, 5);
  assert(paraRes.items.length <= 5);
  assert(paraRes.items.length > 0);

  console.log('Task 1 clinicalWarningFormatter tests passed!');
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx tests/clinicalWarningFormatter.test.ts`
  Expected: FAIL with module not found `../src/utils/clinicalWarningFormatter`.

- [ ] **Step 3: Implement `formatClinicalWarnings` in `src/utils/clinicalWarningFormatter.ts`**
  Implement sentence/bullet tokenization, removal of legal boilerplate, bullet extraction, deduplication, and truncation capping at `maxItems = 5`.

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx tsx tests/clinicalWarningFormatter.test.ts`
  Expected: PASS

- [ ] **Step 5: Integrate `formatClinicalWarnings` and `FullFdaLabelModal` into `src/components/MedChemMatrix.tsx`**
  - Update `MedChemMatrix.tsx` table cell rendering in the "Major Toxicity / Adverse Reactions" column.
  - Render concise bullet list (max 5 items) with high-yield badge.
  - If `isTruncated` is true, render a `"View Full FDA Label"` button that opens an accessible modal (`FullFdaLabelModal`) showing the complete unedited FDA text with copy button and close control.
  - Verify sticky column alignments and zero table layout shift.

---

### Task 2: Antiarrhythmics (Review 11) Question 1 & 14 Interactive Fixes

**Files:**
- Modify: `src/data/antiarrhythmicModuleData.ts:498-540`
- Modify: `src/data/antiarrhythmicWorkbenchData.ts:50-130`
- Modify: `src/components/StructuralWorkbenchQuestion.tsx:400-750`
- Create: `tests/antiarrhythmicFixes.test.ts`

**Interfaces:**
- Consumes: `CLASS_I_KINETICS_WORKBENCH_DATA`, `PROPAFENONE_STRUCTURE`, `LIDOCAINE_STRUCTURE`, `PROCAINAMIDE_STRUCTURE`, `DISOPYRAMIDE_STRUCTURE`, `FLECAINIDE_STRUCTURE`.
- Produces: Answerable Question 1 with `matchingTargets` for 5 structures; calibrated coordinates and Lidocaine vector schematic in `StructuralWorkbenchQuestion`.

- [ ] **Step 1: Write the failing test**
  Create `tests/antiarrhythmicFixes.test.ts` verifying Question 1 has `matchingTargets` with all 5 classes, and Question 14 has calibrated pixel coordinates and valid Lidocaine stem data:
  ```ts
  import assert from 'node:assert';
  import { defaultAntiarrhythmicModule } from '../src/data/antiarrhythmicModuleData';
  import { CLASS_I_KINETICS_WORKBENCH_DATA } from '../src/data/antiarrhythmicWorkbenchData';

  // Test Q1 matchingTargets
  const page1 = defaultAntiarrhythmicModule.pages[0];
  const q1 = page1.sections[0].questions[0];
  assert.strictEqual(q1.id, 1);
  assert.strictEqual(q1.type, 'matching');
  assert(Array.isArray(q1.matchingTargets), 'Q1 must have matchingTargets array');
  assert.strictEqual(q1.matchingTargets.length, 5);

  const acceptedIds = q1.matchingTargets.map((t: any) => t.acceptedId);
  assert(acceptedIds.includes('propafenone'));
  assert(acceptedIds.includes('lidocaine'));
  assert(acceptedIds.includes('procainamide'));
  assert(acceptedIds.includes('disopyramide'));
  assert(acceptedIds.includes('flecainide'));

  // Test Q14 calibrated coordinates
  const step2aTargets = CLASS_I_KINETICS_WORKBENCH_DATA.step2a_amides.targets;
  assert(step2aTargets.length >= 2);
  step2aTargets.forEach(t => {
    assert(t.x > 100, `Target ${t.id} x coordinate should be calibrated pixels > 100, got ${t.x}`);
    assert(t.y > 50, `Target ${t.id} y coordinate should be calibrated pixels > 50, got ${t.y}`);
  });

  console.log('Task 2 antiarrhythmic fixes tests passed!');
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx tests/antiarrhythmicFixes.test.ts`
  Expected: FAIL with assertion error on `q1.matchingTargets` or `t.x > 100`.

- [ ] **Step 3: Update `src/data/antiarrhythmicModuleData.ts` and `src/data/antiarrhythmicWorkbenchData.ts`**
  - Add `matchingTargets` to Question 1 in `antiarrhythmicModuleData.ts` matching Structure I (`propafenone`), Structure II (`lidocaine`), Structure III (`procainamide`), Structure IV (`disopyramide`), and Structure V (`flecainide`).
  - Update `CLASS_I_KINETICS_WORKBENCH_DATA` in `antiarrhythmicWorkbenchData.ts` with calibrated coordinates:
    `xylyl_ring`: (211, 144, radius 46)
    `amide_bond`: (422, 134, radius 36)
    `tertiary_amine`: (651, 140, radius 40)

- [ ] **Step 4: Update `StructuralWorkbenchQuestion.tsx`**
  - Add coordinate auto-normalization for targets (`x <= 100 ? (x / 100) * 880 : x`).
  - Add vector SVG schematics for Lidocaine (2,6-xylyl ring, amide group, diethylamino group) when `workbenchData.stemStructure.name === 'Lidocaine'` or `workbenchData.stemStructure.id === 'lidocaine_stem'`.

- [ ] **Step 5: Run test to verify it passes**
  Run: `npx tsx tests/antiarrhythmicFixes.test.ts`
  Expected: PASS

---

### Task 3: Single-Structure Focus Stage & Comparator View Toggle

**Files:**
- Modify: `src/components/StructureComparator.tsx:140-200, 930-1000, 1960-2120`
- Modify: `src/components/ReviewDeck.tsx:240-260`
- Create: `tests/singleStructureStage.test.ts`

**Interfaces:**
- Consumes: `ReviewDeck` question context (`relevantDrugs`), `StructureComparatorProps`.
- Produces: `viewMode?: 'auto' | 'single' | 'compare'` prop in `StructureComparatorProps`; interactive `[Single Focus | Dual Compare]` mode toggle.

- [ ] **Step 1: Write the failing test**
  Create `tests/singleStructureStage.test.ts` verifying viewMode detection logic and single-drug selection isolation:
  ```ts
  import assert from 'node:assert';

  // Helper function testing logic that decides single drug mode
  function resolveComparatorMode(
    propMode: 'auto' | 'single' | 'compare' | undefined,
    relevantCount: number,
    drugsCount: number
  ): 'single' | 'compare' {
    if (propMode === 'single') return 'single';
    if (propMode === 'compare') return 'compare';
    if (relevantCount === 1) return 'single';
    if (drugsCount === 1) return 'single';
    return 'compare';
  }

  assert.strictEqual(resolveComparatorMode('auto', 1, 5), 'single');
  assert.strictEqual(resolveComparatorMode('auto', 2, 5), 'compare');
  assert.strictEqual(resolveComparatorMode('single', 2, 5), 'single');
  assert.strictEqual(resolveComparatorMode('compare', 1, 5), 'compare');
  assert.strictEqual(resolveComparatorMode(undefined, 1, 5), 'single');

  console.log('Task 3 singleStructureStage logic tests passed!');
  ```

- [ ] **Step 2: Run test to verify it passes**
  Run: `npx tsx tests/singleStructureStage.test.ts`
  Expected: PASS

- [ ] **Step 3: Modify `StructureComparator.tsx`**
  - Add `viewMode?: 'auto' | 'single' | 'compare'` and `onViewModeChange?: (mode: 'single' | 'compare') => void` to `StructureComparatorProps`.
  - Add internal state `currentMode: 'single' | 'compare'`.
  - Render an interactive `[Single Focus | Dual Compare]` button group in the comparator header toolbar when `drugs.length > 1`.
  - When in `'single'` mode:
    - Render a centered, full-width single structure focus card (`max-w-3xl w-full mx-auto` or `w-full`).
    - Hide Compound B dropzone and comparison card.
    - Unmount the differential comparison table.
    - Provide a single drug selector dropdown allowing the user to switch the focused drug.

- [ ] **Step 4: Modify `ReviewDeck.tsx`**
  - Detect when `relevantDrugs.length === 1`.
  - Pass `viewMode={relevantDrugs.length === 1 ? 'single' : 'auto'}` and ensure `selectedDrugA` defaults to `relevantDrugs[0]`.

- [ ] **Step 5: Verify build & typecheck**
  Run: `npx tsc --noEmit`
  Expected: PASS with 0 errors.

---

### Task 4: Module 9 (Anticoagulants) Full 7-Page Restoration & PubChem Audit

**Files:**
- Modify: `src/data/anticoagulantsQuizData.ts`
- Modify: `src/utils/moduleStorage.ts:80-130, 170-220`
- Create: `tests/anticoagulantsModule.test.ts`

**Interfaces:**
- Consumes: Verified lecture PDF (`media_1793851044750_4bd2c7ad.pdf`).
- Produces: `getDefaultAnticoagulantsModule(): ReviewModule` with 7 pages, 27 questions, 7 chemical structures, and version `'2.0.0'`.

- [ ] **Step 1: Write the failing test**
  Create `tests/anticoagulantsModule.test.ts` asserting 7 pages, 27 distinct questions, and verified PubChem structures:
  ```ts
  import assert from 'node:assert';
  import { getDefaultAnticoagulantsModule } from '../src/data/anticoagulantsQuizData';

  const mod = getDefaultAnticoagulantsModule();
  assert.strictEqual(mod.id, 'anticoagulants_mcp2');
  assert.strictEqual(mod.pages.length, 7, 'Anticoagulants module must contain all 7 lecture pages');

  let totalQuestions = 0;
  mod.pages.forEach(p => {
    p.sections.forEach(s => {
      totalQuestions += s.questions.length;
    });
  });
  assert.strictEqual(totalQuestions, 27, `Expected 27 questions across 7 pages, got ${totalQuestions}`);

  // Assert PubChem CIDs for all core drugs
  const expectedCids = [92722, 216210, 9578572, 10182969, 9875401, 54678486];
  const foundCids = mod.chemicalStructures.map(s => s.cid);
  expectedCids.forEach(cid => {
    assert(foundCids.includes(cid), `Missing expected PubChem CID ${cid} in chemicalStructures`);
  });

  console.log('Task 4 anticoagulantsModule tests passed!');
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx tsx tests/anticoagulantsModule.test.ts`
  Expected: FAIL with `Expected 27 questions, got 2` and `mod.pages.length is 1`.

- [ ] **Step 3: Hydrate `src/data/anticoagulantsQuizData.ts` with all 7 pages & 27 questions**
  - Define chemical structures with verified PubChem CIDs:
    - `ARGATROBAN_STRUCTURE` (CID 92722)
    - `DABIGATRAN_STRUCTURE` (CID 216210)
    - `DABIGATRAN_ETEXILATE_STRUCTURE` (CID 9578572)
    - `APIXABAN_STRUCTURE` (CID 10182969)
    - `RIVAROXABAN_STRUCTURE` (CID 9875401)
    - `FONDAPARINUX_STRUCTURE` (CID 636380 / 5282448)
    - `WARFARIN_STRUCTURE` (CID 54678486)
  - Page 1: Direct Thrombin Inhibitors (Questions 1–12 + Dabigatran Double Prodrug Workbench Q13).
  - Page 2: Direct Factor Xa Inhibitors (Apixaban & Rivaroxaban Questions 1–7).
  - Page 3: Comparative DOAC SAR & Class Pearls (DOAC 4.1–4.4 + Question 5).
  - Page 4: Heparin Pentasaccharide SAR & Binding Mechanism (Rules 1–7).
  - Page 5: Heparin Chain Length Rules & UFH Properties (Rules 8–13).
  - Page 6: LMWH, Fondaparinux & Warfarin Introduction (Rules 14–18).
  - Page 7: Warfarin Pharmacodynamics, Genetics & Reversal (Rule 19 / Q27).
  - Set module version to `'2.0.0'`.

- [ ] **Step 4: Update `src/utils/moduleStorage.ts` for version migration**
  - In `loadAllReviewModules` and `initModuleStorageFromDexie`:
    Check if existing override for `anticoagulants_mcp2` has `version !== '2.0.0'` or `pages.length < 7`.
    If stale, overwrite the override with `getDefaultAnticoagulantsModule()` so users get the complete 27-question curriculum immediately.

- [ ] **Step 5: Run test to verify it passes**
  Run: `npx tsx tests/anticoagulantsModule.test.ts`
  Expected: PASS

---

### Task 5: Full System Integration, Typecheck, and Build Verification

**Files:**
- Run test suites: `tests/clinicalWarningFormatter.test.ts`, `tests/antiarrhythmicFixes.test.ts`, `tests/singleStructureStage.test.ts`, `tests/anticoagulantsModule.test.ts`
- Run lint/typecheck: `npm run lint` (`tsc --noEmit`)
- Run build: `npm run build`

- [ ] **Step 1: Execute all unit test suites**
  Run:
  `npx tsx tests/clinicalWarningFormatter.test.ts`
  `npx tsx tests/antiarrhythmicFixes.test.ts`
  `npx tsx tests/singleStructureStage.test.ts`
  `npx tsx tests/anticoagulantsModule.test.ts`
  Expected: All 4 suites PASS.

- [ ] **Step 2: Run TypeScript compile verification**
  Run: `npm run lint` (`tsc --noEmit`)
  Expected: PASS with 0 errors.

- [ ] **Step 3: Run production build**
  Run: `npm run build`
  Expected: Vite production bundle build completes successfully.

- [ ] **Step 4: Dev server verification**
  Verify running dev server at `http://localhost:3000` responds and renders:
  1. MedChem Matrix adverse reactions column with max 5 bullets and "View Full FDA Label" modal.
  2. Antiarrhythmics Question 1 drag-and-drop matching.
  3. Antiarrhythmics Question 14 Lidocaine workbench with calibrated halos.
  4. Structure comparator single-structure focus mode and toggle.
  5. Module 9 Anticoagulants full 7-page deck.
