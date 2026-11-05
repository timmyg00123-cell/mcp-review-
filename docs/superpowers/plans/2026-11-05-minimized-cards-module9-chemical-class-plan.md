# Minimized Structure Cards, Core Module 9 Migration, and Authoritative Chemical Class Resolution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a minimized chemical structure card component for question views, integrate authoritative lecture-derived chemical classes (eliminating "N/A"), migrate Module 9 (Anticoagulants & Thrombolytics) into the core curriculum, and enforce automated geometric verification of halo locations across all workbench questions.

**Architecture:** Build a dedicated `chemicalClassDictionary.ts` lookup grounded in Dr. Rami A. Al-Horani's MCP II course lecture slides to guarantee 100% resolution of chemical classes across `StructureComparator`, `MedChemMatrix`, and question views. Create `MinimizedStructureCard.tsx` modeled after the `StructureComparator` compound card and embed it in `DocumentQuestionItem.tsx`. Complete Module 9 with Page 8 (Thrombolytics/Fibrinolytics) and verify core module initialization in `moduleStorage.ts`. Establish `workbenchCoordinates.ts` with automated geometric verification for halos and drop zones across all workbench questions.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, RDKit.js / SmilesCanvas, Dexie.js (IndexedDB), Node.js / tsx for testing.

**Spec:** [`docs/superpowers/specs/2026-11-05-minimized-cards-module9-chemical-class-design.md`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/docs/superpowers/specs/2026-11-05-minimized-cards-module9-chemical-class-design.md)

## Global Constraints

- **Scope constraint**: Replace referenced chemical structures across *question views only* (`DocumentQuestionItem.tsx`); do not alter `DocumentStudioModal.tsx` or `ModuleEditorModal.tsx`.
- **Zero "N/A" constraint**: Chemical Class must resolve to an authoritative classification from Dr. Rami A. Al-Horani's MCP II lecture PDFs for all course drugs; never output `"N/A"`, `"0"`, or generic `"Small molecule compound"`.
- **Default Module constraint**: Module 8 (`antiplatelets_mcp2`) must remain the default active module loaded on first app launch.
- **Workbench Halo Precision constraint**: All halo circles and drop zones in workbench questions must be geometrically verified to lie strictly within the 880×320 SVG canvas viewport (no floating top-left off-canvas halos) and accurately align with chemical structure functional groups.
- **Build Quality**: `npx tsc --noEmit` and `npm run build` must pass with zero errors.

## Review Focus

1. **Drug Name Variants / Normalization**: Drug names with Roman numerals or parenthesized qualifiers (e.g. `Drug I (Argatroban)`, `Dabigatran active form`, `Pradaxa`) must resolve cleanly to their chemical class via canonical stem stripping.
2. **Exam Mode Blinding**: When `examModeActive` is true or drug names are unpeeked, the card must display `[Blinded for exam]` in the header while keeping Roman numerals (`Structure I`) and chemical structures visible for students to analyze.
3. **Stat Badges Fallbacks**: Missing LogP or Molecular Weight must display clean dashes (`—`) without crashing canvas or layout.
4. **Interactive Callbacks**: Toggling chips (`handleToggleChip`) and zoom inspections (`setZoomedStructure`) must fire without event propagation conflicts.
5. **Fresh Session Core Seeding**: Clearing localStorage must hydrate all 4 built-in modules (Antiplatelets, Anticoagulants, Heart Failure, Antiarrhythmics) with Antiplatelets selected.
6. **Workbench Halo Alignment**: Halos must align directly over the corresponding bonds/rings (e.g. Lidocaine amide bond at (422, 134), diethylamino group at (651, 140), xylyl ring at (211, 144)).

---

### Task 1: Master Authoritative Chemical Class Dictionary

**Files:**
- Create: `src/utils/chemicalClassDictionary.ts`
- Create: `tests/chemicalClassDictionary.test.ts`

**Interfaces:**
- Produces:
  ```typescript
  export function getChemicalClassFromDictionary(drugNameOrKey: string): string | null;
  export function getChemicalClassByCid(cid: number): string | null;
  export function resolveChemicalClass(drug?: Partial<ChemicalStructure> | null): string;
  ```

- [ ] **Step 1: Write the failing test**

In `tests/chemicalClassDictionary.test.ts`:
```typescript
import assert from 'node:assert';
import {
  getChemicalClassFromDictionary,
  resolveChemicalClass,
  getChemicalClassByCid,
} from '../src/utils/chemicalClassDictionary';

// Test 1: Module 8 drugs
assert.strictEqual(getChemicalClassFromDictionary('Aspirin'), 'Salicylate (acetylated salicylic acid)');
assert.strictEqual(getChemicalClassFromDictionary('Clopidogrel'), 'Thienopyridine (2nd generation prodrug)');
assert.strictEqual(getChemicalClassFromDictionary('Ticagrelor'), 'Cyclopentyltriazolopyrimidine (CPTP / nucleoside analog)');
assert.strictEqual(getChemicalClassFromDictionary('Cangrelor'), 'ATP analogue (non-thienopyridine nucleotide)');
assert.strictEqual(getChemicalClassFromDictionary('Vorapaxar'), 'Himbacine-derived tricyclic peptidomimetic');

// Test 2: Module 9 drugs
assert.strictEqual(getChemicalClassFromDictionary('Argatroban'), 'Tetrahydroquinoline sulfonamide / L-Arginine peptidomimetic');
assert.strictEqual(getChemicalClassFromDictionary('Dabigatran'), 'Benzimidazole-derived peptidomimetic');
assert.strictEqual(getChemicalClassFromDictionary('Dabigatran etexilate'), 'Benzimidazole double prodrug (carbamate & ester)');
assert.strictEqual(getChemicalClassFromDictionary('Rivaroxaban'), 'Oxazolidinone peptidomimetic');
assert.strictEqual(getChemicalClassFromDictionary('Apixaban'), 'Pyrazolo-tetrahydropyridinone peptidomimetic');
assert.strictEqual(getChemicalClassFromDictionary('Edoxaban'), 'Diamino-cyclohexane peptidomimetic');
assert.strictEqual(getChemicalClassFromDictionary('Betrixaban'), 'Amino-methoxy benzamide peptidomimetic');
assert.strictEqual(getChemicalClassFromDictionary('Fondaparinux'), 'Synthetic sulfated pentasaccharide');
assert.strictEqual(getChemicalClassFromDictionary('Warfarin'), '4-Hydroxycoumarin derivative');
assert.strictEqual(getChemicalClassFromDictionary('Alteplase'), 'Recombinant human tissue plasminogen activator (rh-tPA)');
assert.strictEqual(getChemicalClassFromDictionary('Streptokinase'), 'Bacterial non-enzymatic protein');

// Test 3: Module 10 & 11 drugs
assert.strictEqual(getChemicalClassFromDictionary('Digoxin'), 'Cardiac glycoside (steroidal cardenolide lactone)');
assert.strictEqual(getChemicalClassFromDictionary('Sacubitril'), 'Biphenyl ethyl ester prodrug (neprilysin inhibitor)');
assert.strictEqual(getChemicalClassFromDictionary('Lidocaine'), 'Aminoacyl-2,6-xylidine (xylene amide)');
assert.strictEqual(getChemicalClassFromDictionary('Propafenone'), 'Phenoxy propyloxyamine (aryloxypropanolamine / phenylpropanone)');
assert.strictEqual(getChemicalClassFromDictionary('Flecainide'), 'Fluorinated benzamide piperidine (bis-trifluoroethoxy benzamide)');

// Test 4: resolveChemicalClass with bracketed/prefixed drug names
const mockDrug = { id: 'argatroban_mock', name: 'Drug II (Argatroban)' };
assert.strictEqual(resolveChemicalClass(mockDrug), 'Tetrahydroquinoline sulfonamide / L-Arginine peptidomimetic');

// Test 5: resolveChemicalClass never returns 'N/A' or 'Small molecule compound' for known drugs
const mockRivaroxaban = { id: 'struct_rivaroxaban', name: 'Rivaroxaban' };
assert.notStrictEqual(resolveChemicalClass(mockRivaroxaban), 'N/A');
assert.notStrictEqual(resolveChemicalClass(mockRivaroxaban), 'Small molecule compound');

console.log('Task 1 chemicalClassDictionary tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/chemicalClassDictionary.test.ts`  
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement `chemicalClassDictionary.ts`**

In `src/utils/chemicalClassDictionary.ts`:
- Define `AUTHORITATIVE_CHEMICAL_CLASSES` map containing 100+ course drugs across Chapters 8, 9, 10, and 11 based on Dr. Rami A. Al-Horani's lecture slides.
- Implement `normalizeDrugKey(input: string): string` to strip Roman numerals, document labels (`Drug I`, `Structure II`), trade names in parentheses, and punctuation.
- Implement `getChemicalClassFromDictionary(drugNameOrKey: string): string | null`.
- Implement `getChemicalClassByCid(cid: number): string | null`.
- Implement `resolveChemicalClass(drug?: Partial<ChemicalStructure> | null): string`:
  1. Checks explicit `drug.chemicalClass` or `(drug as any).chemical_class` if valid and not `'N/A'`, `'0'`, `'—'`, or `'Small molecule compound'`.
  2. Resolves via `getChemicalClassFromDictionary` on name, id, tradeName, or document label.
  3. Resolves via PubChem CID if present.
  4. Resolves via common cardiovascular chemoinformatics stems (`-grel`, `-xaban`, `-tran`, `-pril`, `-sartan`, `-olol`, `-caine`, `-darone`, `-parin`).
  5. Fallback for completely unrecognized compounds: `'Cardiovascular agent'`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/chemicalClassDictionary.test.ts`  
Expected: PASS with "Task 1 chemicalClassDictionary tests passed!"

- [ ] **Step 5: Commit**

```bash
git add src/utils/chemicalClassDictionary.ts tests/chemicalClassDictionary.test.ts
git commit -m "feat: add authoritative lecture chemical class dictionary"
```

---

### Task 2: Integration of Chemical Class Resolver Across Existing Codebase

**Files:**
- Modify: `src/components/StructureComparator.tsx`
- Modify: `src/utils/structureDataUtils.ts`
- Modify: `src/components/ChemicalStructureCard.tsx`
- Modify: `src/components/MedChemMatrix.tsx`
- Create: `tests/chemicalClassIntegration.test.ts`

**Interfaces:**
- Consumes: `resolveChemicalClass` from `src/utils/chemicalClassDictionary.ts`
- Produces: Updated `resolveChemicalClass` and `getChemicalClass` that delegate to the master dictionary.

- [ ] **Step 1: Write the failing test**

In `tests/chemicalClassIntegration.test.ts`:
```typescript
import assert from 'node:assert';
import { resolveChemicalClass as resolveComparatorClass } from '../src/components/StructureComparator';
import { getChemicalClass as getUtilClass } from '../src/utils/structureDataUtils';

// Test 1: StructureComparator resolveChemicalClass uses dictionary when property is missing
const bareDabigatran = { name: 'Dabigatran' };
assert.strictEqual(resolveComparatorClass(bareDabigatran), 'Benzimidazole-derived peptidomimetic');

// Test 2: structureDataUtils getChemicalClass uses dictionary when property is missing
const bareApixaban = { name: 'Apixaban' };
assert.strictEqual(getUtilClass(bareApixaban), 'Pyrazolo-tetrahydropyridinone peptidomimetic');

// Test 3: Generic 'Small molecule compound' or 'N/A' is overridden by dictionary
const contaminatedDrug = { name: 'Warfarin', chemicalClass: 'Small molecule compound' };
assert.strictEqual(resolveComparatorClass(contaminatedDrug), '4-Hydroxycoumarin derivative');

console.log('Task 2 chemicalClassIntegration tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/chemicalClassIntegration.test.ts`  
Expected: FAIL (returns 'N/A' or 'Small molecule compound')

- [ ] **Step 3: Update `StructureComparator.tsx`, `structureDataUtils.ts`, `ChemicalStructureCard.tsx`, and `MedChemMatrix.tsx`**

- In `src/components/StructureComparator.tsx`:
  - Import `resolveChemicalClass as resolveAuthClass` from `../utils/chemicalClassDictionary`.
  - Re-export or forward `resolveChemicalClass(drug)` to `resolveAuthClass(drug)`.
- In `src/utils/structureDataUtils.ts`:
  - Update `getChemicalClass` to call `resolveChemicalClass(drug)`.
- In `src/components/ChemicalStructureCard.tsx`:
  - Replace direct `{structure.chemicalClass}` with `{resolveChemicalClass(structure)}`.
- In `src/components/MedChemMatrix.tsx`:
  - In `deriveDrugRowData`: replace fallback `'Small molecule compound'` with `resolveChemicalClass(s)`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/chemicalClassIntegration.test.ts`  
Expected: PASS with "Task 2 chemicalClassIntegration tests passed!"

- [ ] **Step 5: Commit**

```bash
git add src/components/StructureComparator.tsx src/utils/structureDataUtils.ts src/components/ChemicalStructureCard.tsx src/components/MedChemMatrix.tsx tests/chemicalClassIntegration.test.ts
git commit -m "feat: integrate authoritative chemical class resolution across comparator, matrix, and cards"
```

---

### Task 3: Minimized Structure Card Component

**Files:**
- Create: `src/components/MinimizedStructureCard.tsx`
- Create: `tests/minimizedStructureCard.test.ts`

**Interfaces:**
- Produces:
  ```typescript
  export interface MinimizedStructureCardProps {
    structure: ChemicalStructure;
    isSelected?: boolean;
    onToggleSelect?: (structureId: string) => void;
    onZoom?: (structure: ChemicalStructure) => void;
    examModeActive?: boolean;
    isNamePeeked?: boolean;
    onTogglePeek?: (structureId: string) => void;
    showPharmacophores?: boolean;
    className?: string;
  }
  export const MinimizedStructureCard: React.FC<MinimizedStructureCardProps>;
  ```

- [ ] **Step 1: Write the failing test**

In `tests/minimizedStructureCard.test.ts`:
```typescript
import assert from 'node:assert';
import React from 'react';
import { MinimizedStructureCard } from '../src/components/MinimizedStructureCard';
import { ARGATROBAN_STRUCTURE } from '../src/data/anticoagulantsQuizData';

// Test 1: Verify component exports and props structure
assert.strictEqual(typeof MinimizedStructureCard, 'function');

// Test 2: Test element generation with mocked React
const element = React.createElement(MinimizedStructureCard, {
  structure: ARGATROBAN_STRUCTURE,
  isSelected: true,
  examModeActive: false,
  isNamePeeked: true,
});
assert.strictEqual(element.type, MinimizedStructureCard);
assert.strictEqual(element.props.structure.name, 'Argatroban');
assert.strictEqual(element.props.isSelected, true);

console.log('Task 3 MinimizedStructureCard tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/minimizedStructureCard.test.ts`  
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement `src/components/MinimizedStructureCard.tsx`**

- Create `MinimizedStructureCard.tsx`:
  - Import `SmilesCanvas`, Lucide icons (`ZoomIn`, `Eye`, `EyeOff`, `Lock`, `ExternalLink`, `ShieldCheck`), and `resolveChemicalClass`, `getTargetReceptor`, `getReversibility`, `getRouteOfAdmin`.
  - Header: Render Roman numeral pill (`Structure I`), drug name with trade name, peek/hide button, zoom button, and PubChem link.
  - Canvas: 4:3 container with `bg-[var(--structure-canvas-bg)]`, `SmilesCanvas`, hover overlay `"Click to zoom"`.
  - Stat Badges: 2×2 grid:
    - **MW**: Formatted molecular weight (`structure.mw || structure.pubchemAudit?.molecularWeight` or `—`).
    - **LogP**: Computed/audited LogP.
    - **Target**: Resolved target receptor.
    - **Reversibility**: Emerald pill for Reversible, Rose pill for Irreversible.
    - **Route/State**: e.g., `Oral`, `IV Infusion`, `Prodrug`.
  - Chemical Class: Prominent pill displaying `resolveChemicalClass(structure)`.
  - Pharmacophore strip: If pharmacophores exist, render pill tags with palette dots.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/minimizedStructureCard.test.ts`  
Expected: PASS with "Task 3 MinimizedStructureCard tests passed!"

- [ ] **Step 5: Commit**

```bash
git add src/components/MinimizedStructureCard.tsx tests/minimizedStructureCard.test.ts
git commit -m "feat: implement MinimizedStructureCard component for question views"
```

---

### Task 4: Integration into Question Views (`DocumentQuestionItem.tsx`)

**Files:**
- Modify: `src/components/DocumentQuestionItem.tsx:760-932`
- Create: `tests/questionViewIntegration.test.ts`

**Interfaces:**
- Consumes: `MinimizedStructureCard` from `src/components/MinimizedStructureCard.tsx`
- Produces: Streamlined referenced structures grid in question views without ad-hoc duplicate markup.

- [ ] **Step 1: Write the failing test**

In `tests/questionViewIntegration.test.ts`:
```typescript
import assert from 'node:assert';
import fs from 'node:fs';

const fileContent = fs.readFileSync('src/components/DocumentQuestionItem.tsx', 'utf8');

// Test 1: Must import MinimizedStructureCard
assert(fileContent.includes("import { MinimizedStructureCard } from './MinimizedStructureCard';"), 'Must import MinimizedStructureCard');

// Test 2: Must use MinimizedStructureCard in the referenced structures grid
assert(fileContent.includes('<MinimizedStructureCard'), 'Must render MinimizedStructureCard');

// Test 3: Must NOT contain old raw chemical class fallback 'Class:'
assert(!fileContent.includes('<span className="font-semibold text-slate-500 dark:text-slate-400">Class:</span>'), 'Old ad-hoc Class: text should be replaced by MinimizedStructureCard');

console.log('Task 4 questionViewIntegration tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/questionViewIntegration.test.ts`  
Expected: FAIL

- [ ] **Step 3: Update `DocumentQuestionItem.tsx`**

- In `src/components/DocumentQuestionItem.tsx`:
  - Add import: `import { MinimizedStructureCard } from './MinimizedStructureCard';`
  - In the "Responsive Cards Grid" (lines 761–930), replace the entire custom div rendering loop with:
    ```tsx
    {uniqueOptions.map((structure) => (
      <MinimizedStructureCard
        key={`q${question.id || 'q'}-chip-${structure.id}`}
        structure={structure}
        isSelected={selectedChips.includes(structure.id)}
        onToggleSelect={handleToggleChip}
        onZoom={setZoomedStructure}
        examModeActive={examModeActive}
        isNamePeeked={!!peekedStructureNames[structure.id]}
        onTogglePeek={(id) =>
          setPeekedStructureNames((prev) => ({ ...prev, [id]: !prev[id] }))
        }
        showPharmacophores={true}
      />
    ))}
    ```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/questionViewIntegration.test.ts`  
Expected: PASS with "Task 4 questionViewIntegration tests passed!"

- [ ] **Step 5: Commit**

```bash
git add src/components/DocumentQuestionItem.tsx tests/questionViewIntegration.test.ts
git commit -m "feat: embed MinimizedStructureCard in DocumentQuestionItem referenced structures grid"
```

---

### Task 5: Module 9 Core Seeding & Thrombolytic Lecture Integration

**Files:**
- Modify: `src/data/anticoagulantsQuizData.ts`
- Modify: `src/utils/moduleStorage.ts`
- Create: `tests/anticoagulantsThrombolytics.test.ts`

**Interfaces:**
- Produces: Page 8 (Thrombolytics) in `anticoagulantsQuizData.ts`, guaranteed 4-core module registration in `moduleStorage.ts`.

- [ ] **Step 1: Write the failing test**

In `tests/anticoagulantsThrombolytics.test.ts`:
```typescript
import assert from 'node:assert';
import { getDefaultAnticoagulantsModule } from '../src/data/anticoagulantsQuizData';
import { loadAllReviewModules, loadActiveModuleId } from '../src/utils/moduleStorage';

const mod = getDefaultAnticoagulantsModule();

// Test 1: Page count is 8 (7 review worksheet pages + 1 thrombolytics page from lecture slides 30-31)
assert.strictEqual(mod.pages.length, 8, 'Module 9 should have 8 pages');

// Test 2: Page 8 title covers Fibrinolytic / Thrombolytic Agents
const page8 = mod.pages[7];
assert(page8.title.toLowerCase().includes('fibrinolytic') || page8.title.toLowerCase().includes('thrombolytic'), 'Page 8 must cover thrombolytics');

// Test 3: Questions cover Alteplase, Streptokinase, and Urokinase
const page8Questions = page8.questions;
assert(page8Questions.length >= 4, 'Page 8 must have at least 4 questions');
const allText = page8Questions.map(q => q.questionStem + ' ' + (q.explanation || '')).join(' ');
assert(allText.includes('Alteplase') || allText.includes('t-PA'), 'Must cover Alteplase/t-PA');
assert(allText.includes('Streptokinase'), 'Must cover Streptokinase');
assert(allText.includes('Urokinase'), 'Must cover Urokinase');

// Test 4: Verify built-in core modules in moduleStorage
const allModules = loadAllReviewModules();
const ids = allModules.map(m => m.id);
assert(ids.includes('antiplatelets_mcp2'), 'Must include Module 8');
assert(ids.includes('anticoagulants_mcp2'), 'Must include Module 9');
assert(ids.includes('heart_failure_mcp2'), 'Must include Module 10');
assert(ids.includes('antiarrhythmics_mcp2'), 'Must include Module 11');

// Test 5: Default module is antiplatelets
assert.strictEqual(loadActiveModuleId(), 'antiplatelets_mcp2');

console.log('Task 5 anticoagulantsThrombolytics tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/anticoagulantsThrombolytics.test.ts`  
Expected: FAIL (page count is 7, not 8)

- [ ] **Step 3: Update `anticoagulantsQuizData.ts` and verify `moduleStorage.ts`**

- In `src/data/anticoagulantsQuizData.ts`:
  - Add Page 8: `Page 8: Fibrinolytic / Thrombolytic Agents (Lecture Slides 30–31)`
  - Add Question 28 (Matching / Classification): Compare t-PA variants (Alteplase rh-tPA, Reteplase deletion mutant, Tenecteplase triple mutant).
  - Add Question 29 (Multiple Choice): Bacterial enzyme Streptokinase mechanism (non-enzymatic plasminogen activator, antigenicity, single-use within 6 months).
  - Add Question 30 (Multiple Choice): Renal enzyme Urokinase (direct two-chain serine protease activator).
  - Add Question 31 (True/False / Sub-statements): Clinical indications (AMI, PE, ischemic stroke within 6 hrs) and absolute contraindications (recent intracranial hemorrhage, active bleeding, stroke within 3 months).
  - Update `version` to `'2.1.0'`.
- In `src/utils/moduleStorage.ts`:
  - Ensure version migration check in `loadAllReviewModules()` accepts `version: '2.1.0'` or `pages.length >= 7`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/anticoagulantsThrombolytics.test.ts`  
Expected: PASS with "Task 5 anticoagulantsThrombolytics tests passed!"

- [ ] **Step 5: Commit**

```bash
git add src/data/anticoagulantsQuizData.ts src/utils/moduleStorage.ts tests/anticoagulantsThrombolytics.test.ts
git commit -m "feat: add Page 8 Thrombolytics to Module 9 and verify core module storage"
```

---

### Task 6: Enforce and Verify Workbench Halo & Dropzone Geometry

**Files:**
- Create: `src/utils/workbenchCoordinates.ts`
- Modify: `src/components/StructuralWorkbenchQuestion.tsx:177-192`
- Create: `tests/workbenchHaloVerification.test.ts`

**Interfaces:**
- Produces:
  ```typescript
  export function normWorkbenchX(x?: number): number;
  export function normWorkbenchY(y?: number): number;
  export function normWorkbenchRadius(r?: number, defaultR?: number): number;
  export function verifyWorkbenchGeometry(data: StructuralWorkbenchData): {
    isValid: boolean;
    errors: string[];
  };
  ```

- [ ] **Step 1: Write the failing test**

In `tests/workbenchHaloVerification.test.ts`:
```typescript
import assert from 'node:assert';
import {
  normWorkbenchX,
  normWorkbenchY,
  normWorkbenchRadius,
  verifyWorkbenchGeometry,
} from '../src/utils/workbenchCoordinates';
import { CLASS_I_KINETICS_WORKBENCH_DATA, AMIODARONE_SAR_WORKBENCH_DATA } from '../src/data/antiarrhythmicWorkbenchData';
import { DABIGATRAN_WORKBENCH_DATA } from '../src/data/dabigatranWorkbenchData';
import { DIGOXIN_WORKBENCH_DATA, ACE_INHIBITOR_WORKBENCH_DATA } from '../src/data/heartFailureWorkbenchData';
import { THIENOPYRIDINE_WORKBENCH_DATA } from '../src/data/antiplateletWorkbenchData';

// Test 1: Coordinate normalization functions
assert.strictEqual(normWorkbenchX(50), 440); // 50% maps to 440 (center of 880)
assert.strictEqual(normWorkbenchX(422), 422); // absolute pixel passes through
assert.strictEqual(normWorkbenchY(50), 160); // 50% maps to 160 (center of 320)
assert.strictEqual(normWorkbenchY(134), 134); // absolute pixel passes through
assert.strictEqual(normWorkbenchRadius(10), 32); // percentage radius maps
assert.strictEqual(normWorkbenchRadius(36), 36); // absolute pixel radius passes through

// Test 2: Antiarrhythmics Question 14 (Lidocaine Kinetics)
const lidocaineVerif = verifyWorkbenchGeometry(CLASS_I_KINETICS_WORKBENCH_DATA);
assert.strictEqual(lidocaineVerif.isValid, true, `Lidocaine halo errors: ${lidocaineVerif.errors.join(', ')}`);

// Test 3: Specific Lidocaine halo locations must align with structure, not floating top-left
const amideTarget = CLASS_I_KINETICS_WORKBENCH_DATA.step2a_amides.targets.find((t) => t.id === 'amide_bond')!;
assert(normWorkbenchX(amideTarget.x) >= 380 && normWorkbenchX(amideTarget.x) <= 460, 'Amide bond halo must center around x=422');
assert(normWorkbenchY(amideTarget.y) >= 110 && normWorkbenchY(amideTarget.y) <= 160, 'Amide bond halo must center around y=134');

const amineTarget = CLASS_I_KINETICS_WORKBENCH_DATA.step2a_amides.targets.find((t) => t.id === 'tertiary_amine')!;
assert(normWorkbenchX(amineTarget.x) >= 610 && normWorkbenchX(amineTarget.x) <= 690, 'Amine halo must center around x=651');

const xylylTarget = CLASS_I_KINETICS_WORKBENCH_DATA.step2b_moieties.targets.find((t) => t.id === 'xylyl_ring')!;
assert(normWorkbenchX(xylylTarget.x) >= 180 && normWorkbenchX(xylylTarget.x) <= 240, 'Xylyl ring halo must center around x=211');

// Test 4: Verify all other active workbench datasets have valid geometry within 880x320 viewport
[
  DABIGATRAN_WORKBENCH_DATA,
  AMIODARONE_SAR_WORKBENCH_DATA,
  DIGOXIN_WORKBENCH_DATA,
  ACE_INHIBITOR_WORKBENCH_DATA,
  THIENOPYRIDINE_WORKBENCH_DATA,
].forEach((dataset) => {
  const verif = verifyWorkbenchGeometry(dataset);
  assert.strictEqual(verif.isValid, true, `${dataset.stemStructure.name} errors: ${verif.errors.join(', ')}`);
});

console.log('Task 6 workbenchHaloVerification tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/workbenchHaloVerification.test.ts`  
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement `src/utils/workbenchCoordinates.ts` and refactor `StructuralWorkbenchQuestion.tsx`**

- Create `src/utils/workbenchCoordinates.ts`:
  - `normWorkbenchX(x?: number): number`: `x === undefined ? 440 : (x <= 100 ? (x / 100) * 880 : x)`
  - `normWorkbenchY(y?: number): number`: `y === undefined ? 160 : (y <= 100 ? (y / 100) * 320 : y)`
  - `normWorkbenchRadius(r?: number, defaultR = 32): number`: `!r ? defaultR : (r <= 20 ? (r / 100) * 320 : r)`
  - `verifyWorkbenchGeometry(data: StructuralWorkbenchData)`:
    - Inspects all targets in `step2a_amides`, `step2b_moieties`, and `step2c_nature.dropZones`.
    - Enforces normalized coordinates fall inside `[40, 840]` horizontally and `[30, 290]` vertically.
    - Enforces radius between `10` and `90`.
    - Enforces minimum distance of 15px between targets in the same sub-step to avoid overlapping halos.
    - Returns `{ isValid, errors }`.
- In `src/components/StructuralWorkbenchQuestion.tsx`:
  - Import `normWorkbenchX`, `normWorkbenchY`, `normWorkbenchRadius` from `../utils/workbenchCoordinates`.
  - Replace local duplicate normalization functions with the shared utility.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/workbenchHaloVerification.test.ts`  
Expected: PASS with "Task 6 workbenchHaloVerification tests passed!"

- [ ] **Step 5: Commit**

```bash
git add src/utils/workbenchCoordinates.ts src/components/StructuralWorkbenchQuestion.tsx tests/workbenchHaloVerification.test.ts
git commit -m "feat: enforce geometric verification for workbench halos and dropzones"
```

---

### Task 7: Full Verification and Build Audit

**Files:**
- Test all test suites
- Run TypeScript compiler audit
- Run Vite production bundle build

- [ ] **Step 1: Run all test suites**

Run:
```bash
npx tsx tests/clinicalWarningFormatter.test.ts
npx tsx tests/singleStructureStage.test.ts
npx tsx tests/antiarrhythmicFixes.test.ts
npx tsx tests/chemicalClassDictionary.test.ts
npx tsx tests/chemicalClassIntegration.test.ts
npx tsx tests/minimizedStructureCard.test.ts
npx tsx tests/questionViewIntegration.test.ts
npx tsx tests/anticoagulantsThrombolytics.test.ts
npx tsx tests/workbenchHaloVerification.test.ts
```
Expected: All 9 test suites PASS.

- [ ] **Step 2: Run TypeScript compiler audit**

Run: `npx tsc --noEmit`  
Expected: 0 errors.

- [ ] **Step 3: Run Vite production build**

Run: `npm run build`  
Expected: Build succeeds with output in `dist/`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: complete verification for minimized structure cards, chemical classes, module 9, and workbench halos"
```
