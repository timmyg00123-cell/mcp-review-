# MedChem Structural Workbench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cohesive first-class `structural-workbench` question type in the MedChem Review Platform that allows multi-step chemical analysis (encircling amides, encircling prodrug moieties, dragging and dropping functional group nature, and selecting the active chemical structure at the bottom) with a 4-point scoring model.

**Architecture:** Extend the `AntiplateletQuestion` type system with `'structural-workbench'` and a strongly typed `StructuralWorkbenchData` payload. Build a dedicated `<StructuralWorkbenchQuestion>` component with an interactive theme-adaptive SVG chemical canvas for steps 2a–2c and RDKit `SmilesCanvas` candidate cards for step 2d, integrated directly into `DocumentQuestionItem.tsx` and the Gemini multi-page review extractor schema.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Lucide React, RDKit MinimalLib WASM, Vite.

**Spec:** [`docs/superpowers/specs/2026-11-04-medchem-structural-workbench-design.md`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/docs/superpowers/specs/2026-11-04-medchem-structural-workbench-design.md)

## Global Constraints

- **Theme Variable Synchronization**: Stem canvas must use `var(--structure-canvas-bg)` and `var(--structure-bond-stroke)` for light/dark mode consistency.
- **RDKit SmilesCanvas for Candidates**: Step 2d candidate structures must be rendered dynamically via `SmilesCanvas` with Daylight SMILES strings.
- **4-Point Scoring Model**: Award exactly 1 point per sub-step (4 points total for Question 2) with partial credit support.
- **Dual Drag-and-Drop & Tap Interaction**: Step 2c badges must support both HTML5 drag-and-drop and tap-to-select for touch/mobile devices.
- **Zero Breakage of Existing Types**: Multiple-choice, matching, and sub-statements must continue functioning without modification.

## Review Focus

1. **Distractor Halo Discrimination**: Verify clicking non-amide distractors in 2a or non-prodrug distractors in 2b denies the point for that sub-step.
2. **Badge Drop & Reassignment**: Verify dragging or tapping badges in 2c allows replacing or clearing an assigned badge without orphaned state.
3. **Candidate Structure Rendering**: Verify all 4 candidate structures in 2d render cleanly without black rectangles or SVG clipping.
4. **Scoring Tally Integration**: Verify partial points (0 to 4) update session stats (`totalPointsEarned`, `totalPointsPossible`) accurately.
5. **Theme Switching**: Verify switching between light and dark mode updates SVG bond strokes and halo highlights dynamically.

---

### Task 1: Type Definitions and Data Model Extension

**Files:**
- Modify: `src/types/reviewModule.ts:110-145`
- Create: `src/data/dabigatranWorkbenchData.ts`

**Interfaces:**
- Consumes: Existing `ChemicalStructure`, `AntiplateletQuestion` from `src/types/reviewModule.ts`
- Produces: `WorkbenchHaloTarget`, `WorkbenchDropZone`, `WorkbenchStructureCandidate`, `StructuralWorkbenchData`, `StructuralWorkbenchAnswer`, `DABIGATRAN_WORKBENCH_QUESTION`

- [ ] **Step 1: Extend `AntiplateletQuestion` type and export workbench interfaces**

Update `src/types/reviewModule.ts` to include:
```typescript
export interface WorkbenchHaloTarget {
  id: string;
  label: string;
  smarts?: string;
  isCorrect: boolean;
  rationale: string;
  x: number;
  y: number;
  radius?: number;
}

export interface WorkbenchDropZone {
  id: string;
  targetMoietyId: string;
  label: string;
  correctBadge: string;
  rationale: string;
  x: number;
  y: number;
}

export interface WorkbenchStructureCandidate {
  id: string;
  name: string;
  smiles: string;
  cid?: number;
  isCorrect: boolean;
  classification: 'active' | 'intermediate' | 'degradant';
  rationale: string;
}

export interface StructuralWorkbenchData {
  stemStructure: ChemicalStructure;
  instructions?: string;
  step2a_amides: {
    title: string;
    prompt: string;
    targets: WorkbenchHaloTarget[];
  };
  step2b_moieties: {
    title: string;
    prompt: string;
    targets: WorkbenchHaloTarget[];
  };
  step2c_nature: {
    title: string;
    prompt: string;
    badgeBank: string[];
    dropZones: WorkbenchDropZone[];
  };
  step2d_activeForm: {
    title: string;
    prompt: string;
    candidates: WorkbenchStructureCandidate[];
  };
}

export interface StructuralWorkbenchAnswer {
  selectedAmideIds: string[];
  selectedMoietyIds: string[];
  dropZoneAssignments: Record<string, string>;
  selectedCandidateId: string | null;
  submittedAt?: string;
}
```
And add `'structural-workbench'` to `AntiplateletQuestion.type` with optional `structuralWorkbench?: StructuralWorkbenchData`.

- [ ] **Step 2: Create curated Dabigatran etexilate question definition in `src/data/dabigatranWorkbenchData.ts`**

Define `DABIGATRAN_WORKBENCH_QUESTION` with:
- Stem: Dabigatran etexilate (CID 9571074, SMILES `CCCCCCNC(=O)NC1=CC=C(C=C1)C2=NC3=C(N2C)C=C(C=C3)C(=O)N(CCC(=O)OCC)C4=CC=CC=N4`).
- Step 2a: Targets for central methylamide (correct), carbamate (correct), ester carbonyl (distractor), benzimidazole nitrogen (distractor), pyridine nitrogen (distractor).
- Step 2b: Targets for ethyl ester (correct), hexyl carbamate (correct), central pyridine (distractor), benzimidazole fused core (distractor), phenyl linker (distractor).
- Step 2c: Badges `['Ester', 'Carbamate', 'Phosphonate', 'Sulfonate']`, dropzones for Left (`Ester`) and Right (`Carbamate`).
- Step 2d: 4 candidates:
  - Option A: Dabigatran free zwitterion (`O=C(O)CCN(C(=O)c1ccc2nc(c3ccc(C(=N)N)cc3)n(C)c2c1)c4ccccn4`, CID 216210, `isCorrect: true`).
  - Option B: Mono-prodrug BDPN (ester cleaved to acid, hexyl carbamate intact, `isCorrect: false`).
  - Option C: Mono-prodrug BIBR 1087 (ester intact, carbamate cleaved to amidine, `isCorrect: false`).
  - Option D: Cleaved scaffold degradant (`isCorrect: false`).

- [ ] **Step 3: Run TypeScript compiler check**

Run: `npm run lint`
Expected: 0 errors.

- [ ] **Step 4: Commit type definitions and curated workbench data**

```bash
git add src/types/reviewModule.ts src/data/dabigatranWorkbenchData.ts
git commit -m "feat(types): add structural-workbench question type and curated dabigatran data"
```

---

### Task 2: Build `StructuralWorkbenchQuestion` Component

**Files:**
- Create: `src/components/StructuralWorkbenchQuestion.tsx`

**Interfaces:**
- Consumes: `StructuralWorkbenchData`, `StructuralWorkbenchAnswer` from `src/types/reviewModule.ts`, `SmilesCanvas` from `src/components/SmilesCanvas.tsx`
- Produces: `StructuralWorkbenchQuestion: React.FC<StructuralWorkbenchQuestionProps>`

- [ ] **Step 1: Implement `<StructuralWorkbenchQuestion>` component**

Create `src/components/StructuralWorkbenchQuestion.tsx` supporting:
1. **Header & Sub-Step Navigation Tabs**:
   - `2a. Amide Bonds` (shows selected count / target count).
   - `2b. Prodrug Moieties` (shows selected count / target count).
   - `2c. Drag & Drop Nature` (shows assigned badge count).
   - `2d. Active Form Structure` (anchored at the bottom).
2. **Interactive Chemical Structure Canvas**:
   - High-contrast responsive SVG of Dabigatran etexilate styled with `var(--structure-bond-stroke)` and `var(--structure-canvas-bg)`.
   - Render clickable dashed halos for Step 2a (red/green on selection).
   - Render clickable dashed halos for Step 2b (blue/purple on selection).
   - Render dropzones and draggable badge bank for Step 2c with dragover/drop and tap-to-assign fallback.
3. **Bottom Step 2d Candidate Structure Grid**:
   - 4 candidate cards rendered using `<SmilesCanvas width={260} height={140} smiles={candidate.smiles} />`.
   - Highlight border on selection, displaying classification badges (`Active Form`, `Intermediate`, `Degradant`).
4. **Scoring & Submission Handler**:
   - Calculate score (0 to 4 points):
     - Step 2a: 1 pt if all correct amides selected and 0 distractors selected.
     - Step 2b: 1 pt if all correct prodrugs selected and 0 distractors selected.
     - Step 2c: 1 pt if both dropzones correctly matched.
     - Step 2d: 1 pt if Option A (active form) selected.
   - Immediate feedback in Study Mode, exam submission state in Exam Mode.
5. **Solution & Bioactivation Explanation**:
   - Displays comprehensive rationale table breaking down esterase cleavage, carbamate hydrolysis, and thrombin active site binding.

- [ ] **Step 2: Run TypeScript compiler check**

Run: `npm run lint`
Expected: 0 errors.

- [ ] **Step 3: Commit `StructuralWorkbenchQuestion.tsx`**

```bash
git add src/components/StructuralWorkbenchQuestion.tsx
git commit -m "feat(ui): implement StructuralWorkbenchQuestion component"
```

---

### Task 3: Integrate Workbench into `DocumentQuestionItem` and Review Deck

**Files:**
- Modify: `src/components/DocumentQuestionItem.tsx`

**Interfaces:**
- Consumes: `<StructuralWorkbenchQuestion>` from `src/components/StructuralWorkbenchQuestion.tsx`
- Produces: Render branch for `question.type === 'structural-workbench'` in question flow and solution review

- [ ] **Step 1: Add question type tag and render branch in `DocumentQuestionItem.tsx`**

In `src/components/DocumentQuestionItem.tsx`:
1. Add badge tag for `question.type === 'structural-workbench'`:
   ```tsx
   {question.type === 'structural-workbench' && (
     <span className="inline-block text-[11px] font-mono font-semibold text-purple-600 dark:text-purple-400">
       Interactive Structural Workbench (4 pts)
     </span>
   )}
   ```
2. Render `<StructuralWorkbenchQuestion>` in the main question body:
   ```tsx
   {question.type === 'structural-workbench' && question.structuralWorkbench && (
     <StructuralWorkbenchQuestion
       question={question}
       workbenchData={question.structuralWorkbench}
       onAnswer={(score, answerData) => handleWorkbenchAnswer(score, answerData)}
       examMode={examModeActive}
       isSubmitted={isSubmitted}
     />
   )}
   ```
3. Update answer state tracking and scoring reducer to award up to 4 points for workbench questions.

- [ ] **Step 2: Run TypeScript compiler check**

Run: `npm run lint`
Expected: 0 errors.

- [ ] **Step 3: Commit integration in `DocumentQuestionItem.tsx`**

```bash
git add src/components/DocumentQuestionItem.tsx
git commit -m "feat(ui): integrate StructuralWorkbenchQuestion into DocumentQuestionItem"
```

---

### Task 4: Pre-Seed Anticoagulants Review Module and Update Gemini Prompts

**Files:**
- Modify: `src/data/modules/anticoagulantsReview.ts` (or relevant module initialization file)
- Modify: `src/services/geminiPrompts.ts`

**Interfaces:**
- Consumes: `DABIGATRAN_WORKBENCH_QUESTION` from `src/data/dabigatranWorkbenchData.ts`
- Produces: Updated Anticoagulants Page 1 Question 2 as `'structural-workbench'`, extended `MEDCHEM_PAGE_RESPONSE_SCHEMA`

- [ ] **Step 1: Seed Dabigatran etexilate Question 2 into module storage / initial data**

Ensure that Question 2 in the Anticoagulants Review module is configured with `type: 'structural-workbench'` and populated with `structuralWorkbench: DABIGATRAN_WORKBENCH_QUESTION.structuralWorkbench`.

- [ ] **Step 2: Update `MEDCHEM_PAGE_RESPONSE_SCHEMA` in `src/services/geminiPrompts.ts`**

Extend the `questions` array schema:
- Add `'structural-workbench'` to the `type` enum.
- Define the optional `structuralWorkbench` object schema including `step2a_amides`, `step2b_moieties`, `step2c_nature`, and `step2d_activeForm`.
- Add prompt instructions guiding Gemini to emit `structural-workbench` whenever worksheet questions ask students to encircle amides, encircle prodrug groups, drag/drop moiety types, or select active forms.

- [ ] **Step 3: Run TypeScript compiler check and Vite production build**

Run: `npm run lint`
Expected: 0 errors.

Run: `npm run build`
Expected: Successful build in under 3s.

- [ ] **Step 4: Commit module seeding and Gemini prompt updates**

```bash
git add src/services/geminiPrompts.ts src/data/
git commit -m "feat(ai): update Gemini prompt schema and seed anticoagulants workbench question"
```

---

### Task 5: End-to-End Verification

**Files:**
- Test: Manual browser check & automated verification script

- [ ] **Step 1: Test interactive workbench in development server**

1. Open `http://localhost:3000` in the browser.
2. Navigate to the Anticoagulants review module, Page 1, Question 2.
3. Verify Step 2a: Clicking genuine amides selects them; clicking distractors flags them or impacts the step score.
4. Verify Step 2b: Clicking genuine prodrug moieties selects them.
5. Verify Step 2c: Dragging/tapping `Ester` and `Carbamate` onto dropzones assigns them.
6. Verify Step 2d: Four candidate structure cards render cleanly with RDKit `SmilesCanvas`; clicking Option A marks it as the active form.
7. Verify theme toggle: Switch between light mode and dark mode; verify bond strokes and backgrounds update seamlessly.

- [ ] **Step 2: Final lint and build pass**

Run: `npm run lint && npm run build`
Expected: 0 lint errors, build succeeds cleanly.
