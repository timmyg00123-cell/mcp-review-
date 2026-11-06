# Cumulative Study Hub & Spaced Repetition Flashcards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive Cumulative Study Hub containing cross-curriculum practice tests with 3–5 blinded structures (partial credit, instant rationales), an Anki-style rapid structure-to-class flashcard deck with 4 spaced-repetition intervals (<1m, 4m, 10m, 1d), and a post-session diagnostic struggle overview with 1-click remediation.

**Architecture:** A standalone study hub modal (`CumulativeStudyHubModal.tsx`) launched from the main navbar, backed by a curated multi-module question bank (`cumulativeQuizData.ts`), a cross-curriculum chemical structure harvester (`cumulativeStructureHarvester.ts`), an in-session spaced-repetition queue manager (`spacedRepetitionService.ts`), and a diagnostic struggle analyzer (`struggleDiagnosticService.ts`).

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React, Vite, Browser LocalStorage.

**Spec:** `docs/superpowers/specs/2026-11-05-cumulative-study-hub-design.md`

## Global Constraints
- Must maintain strict compatibility with Light Mode (default) and Dark Mode.
- Must not leak generic drug names, trade names, or module names before answers are submitted.
- Must preserve all existing single-module worksheet views and test suites without regressions.
- All candidate structure cohorts must present 3 to 5 structures (Types A, C, D).
- Spaced repetition intervals must be exactly: `Again` (< 1 min), `Hard` (4 min), `Good` (10 min), `Easy` (1 day).

## Review Focus
1. **Empty Selection Submission**: Submitting a question with zero selections should prompt the user to select at least one structure without penalty.
2. **All-Distractor or All-Correct Cohorts**: Calculation of partial credit must not divide by zero if `Total True Items === 0` (guarded by minimum 1).
3. **Multi-Module Structure Deduplication**: Molecules shared across modules (e.g. Aspirin) must not appear twice in the flashcard deck, but must respect filtering when either module is toggled.
4. **Active Queue Exhaustion**: When the last card in an Anki session is graded `Good` or `Easy`, the session must seamlessly transition to the Struggle Overview without unhandled out-of-bounds index errors.
5. **Keyboard Event Leakage**: Pressing Space or 1–4 inside an input or when modal is closed must not trigger flashcard grading or card flipping.

---

### Task 1: Core Type Definitions and Data Models

**Files:**
- Create: `src/types/cumulativeStudy.ts`
- Test: `tests/cumulativeStudyTypes.test.ts`

**Interfaces:**
- Produces: `CumulativeQuestion`, `PhysiologicalEffectStatement`, `FlashcardItem`, `SpacedRepetitionIntervals`, `StruggleDiagnosticReport`, `CandidateSelectionState`.

- [ ] **Step 1: Write the failing type validation test**

```typescript
// tests/cumulativeStudyTypes.test.ts
import assert from 'node:assert';
import type {
  CumulativeQuestion,
  PhysiologicalEffectStatement,
  FlashcardItem,
  StruggleDiagnosticReport
} from '../src/types/cumulativeStudy';

const sampleStmt: PhysiologicalEffectStatement = {
  id: 'stmt_1',
  statement: 'Prolongs the PR interval by slowing AV nodal conduction',
  isCorrect: true,
  rationale: 'Class II beta-blockers and Class IV calcium channel blockers depress AV nodal Phase 0'
};

const sampleQuestion: CumulativeQuestion = {
  id: 'cumul_1',
  type: 'case-to-structures',
  moduleIds: ['antiplatelets', 'anticoagulants'],
  stem: 'A 64-year-old patient requires Factor Xa inhibition...',
  correctStructureIds: ['struct_apixaban', 'struct_rivaroxaban'],
  rationales: { struct_apixaban: 'Direct Factor Xa inhibitor' },
  highYieldPearl: 'Neutral S1 subpocket binding'
};

assert.strictEqual(sampleQuestion.type, 'case-to-structures');
assert.strictEqual(sampleStmt.isCorrect, true);
console.log('Cumulative study types validated.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/cumulativeStudyTypes.test.ts`  
Expected: FAIL with "Cannot find module '../src/types/cumulativeStudy'"

- [ ] **Step 3: Implement `src/types/cumulativeStudy.ts`**

Define `CumulativeQuestionType`, `PhysiologicalEffectStatement`, `CumulativeQuestion`, `FlashcardItem`, `SpacedRepetitionIntervals`, `StruggleDiagnosticReport`, and `FlashcardState`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/cumulativeStudyTypes.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/types/cumulativeStudy.ts tests/cumulativeStudyTypes.test.ts
git commit -m "feat(types): define models for cumulative questions, flashcards, and struggle diagnostics"
```

---

### Task 2: Curated Cross-Curriculum Cumulative Question Bank

**Files:**
- Create: `src/data/cumulativeQuizData.ts`
- Test: `tests/cumulativeQuizData.test.ts`

**Interfaces:**
- Consumes: `CumulativeQuestion` from `src/types/cumulativeStudy.ts`, `ChemicalStructure` from `src/types/reviewModule.ts`.
- Produces: `getCumulativeQuestionBank(): CumulativeQuestion[]`.

- [ ] **Step 1: Write the failing test verifying question bank completeness and blinding rules**

```typescript
// tests/cumulativeQuizData.test.ts
import assert from 'node:assert';
import { getCumulativeQuestionBank } from '../src/data/cumulativeQuizData';

const bank = getCumulativeQuestionBank();
assert.ok(bank.length >= 8, 'Bank should have at least 8 curated multi-module questions');

bank.forEach((q) => {
  assert.ok(['case-to-structures', 'structure-to-effects', 'comparative-sar', 'contraindication-risk'].includes(q.type));
  if (q.type !== 'structure-to-effects') {
    assert.ok(q.candidateStructures && q.candidateStructures.length >= 3 && q.candidateStructures.length <= 5,
      `Question ${q.id} must have 3-5 candidate structures`);
    assert.ok(q.correctStructureIds && q.correctStructureIds.length >= 1,
      `Question ${q.id} must have at least 1 correct candidate`);
  } else {
    assert.ok(q.singleStructure, `Type B question ${q.id} must have a singleStructure`);
    assert.ok(q.effectStatements && q.effectStatements.length >= 3,
      `Type B question ${q.id} must have at least 3 effect statements`);
  }
});
console.log('Cumulative quiz data verified.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/cumulativeQuizData.test.ts`  
Expected: FAIL with "Cannot find module '../src/data/cumulativeQuizData'"

- [ ] **Step 3: Implement `src/data/cumulativeQuizData.ts`**

Author high-yield questions covering:
1. *Type A*: Factor Xa vs IIa Direct Inhibitors vs Thienopyridines (Apixaban, Rivaroxaban, Dabigatran, Clopidogrel, Warfarin).
2. *Type A*: Positive Inotropes for Decompensated Heart Failure (Digoxin, Milrinone, Dobutamine, Metoprolol, Furosemide).
3. *Type B*: Amiodarone structural recognition &rarr; multi-effect statements (APD/ERP prolongation, iodine thyroid toxicity, pulmonary fibrosis, multi-channel blockade).
4. *Type B*: Dabigatran structural recognition &rarr; multi-effect statements (direct active-site thrombin blockade, basic amidine group, P-gp substrate, renal elimination).
5. *Type C*: Prodrugs requiring CYP bioactivation to active thiols (Clopidogrel, Prasugrel, Ticagrelor, Cangrelor).
6. *Type C*: Vaughan-Williams Class IA vs Class IC sodium channel blockers kinetics and QRS/QT effects (Quinidine, Flecainide, Procainamide, Lidocaine).
7. *Type D*: Contraindications in Severe Renal Impairment CrCl < 30 mL/min (Dabigatran, Fondaparinux, Sotalol, Apixaban).
8. *Type D*: Vasodilators contraindicated or requiring caution in severe aortic stenosis (Nitroprusside, Hydralazine, Nitroglycerin, Verapamil).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/cumulativeQuizData.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/data/cumulativeQuizData.ts tests/cumulativeQuizData.test.ts
git commit -m "feat(data): author curated multi-module cumulative question bank across cardiovascular curriculum"
```

---

### Task 3: Cross-Curriculum Structure Harvester & Flashcard Deck Builder

**Files:**
- Create: `src/utils/cumulativeStructureHarvester.ts`
- Test: `tests/cumulativeStructureHarvester.test.ts`

**Interfaces:**
- Consumes: `ReviewModule` from `src/types/reviewModule.ts`, `FlashcardItem` from `src/types/cumulativeStudy.ts`.
- Produces: `harvestCurriculumStructures(modules: ReviewModule[]): FlashcardItem[]`.

- [ ] **Step 1: Write the failing test for structure harvesting and deduplication**

```typescript
// tests/cumulativeStructureHarvester.test.ts
import assert from 'node:assert';
import { harvestCurriculumStructures } from '../src/utils/cumulativeStructureHarvester';
import { getDefaultAntiplateletModule } from '../src/utils/moduleStorage';
import { getDefaultAnticoagulantsModule } from '../src/data/anticoagulantsQuizData';
import { getDefaultHeartFailureModule } from '../src/data/heartFailureModuleData';
import { getDefaultAntiarrhythmicModule } from '../src/data/antiarrhythmicModuleData';

const modules = [
  getDefaultAntiplateletModule(),
  getDefaultAnticoagulantsModule(),
  getDefaultHeartFailureModule(),
  getDefaultAntiarrhythmicModule()
];

const cards = harvestCurriculumStructures(modules);
assert.ok(cards.length >= 25, 'Harvested card deck should contain at least 25 unique structures');

// Check deduplication
const idSet = new Set(cards.map(c => c.structureId));
assert.strictEqual(idSet.size, cards.length, 'All structure IDs must be strictly deduplicated');

// Check back-of-card fields
cards.forEach(c => {
  assert.ok(c.structure.name, 'Every card must have a drug name');
  assert.ok(c.structure.pharmacologicalClass || c.structure.chemicalClass, 'Card must have pharmacologic or chemical class');
});
console.log('Structure harvester passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/cumulativeStructureHarvester.test.ts`  
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement `src/utils/cumulativeStructureHarvester.ts`**

Iterate through `modules`, search `pages[].sections[].structures`, `questions[].structuresDisplayed`, and `module.chemicalStructures`. Extract, deduplicate by normalized name/smiles/id, merge module tags, and construct initialized `FlashcardItem` records.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/cumulativeStructureHarvester.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/cumulativeStructureHarvester.ts tests/cumulativeStructureHarvester.test.ts
git commit -m "feat(utils): harvest and deduplicate cross-curriculum chemical structures into flashcard items"
```

---

### Task 4: Spaced Repetition Queue Engine & Local Storage Persistence

**Files:**
- Create: `src/utils/spacedRepetitionService.ts`
- Test: `tests/spacedRepetitionService.test.ts`

**Interfaces:**
- Consumes: `FlashcardItem` from `src/types/cumulativeStudy.ts`.
- Produces: 
  - `loadFlashcardProgress(): Record<string, Partial<FlashcardItem>>`
  - `saveFlashcardProgress(cardStates: Record<string, Partial<FlashcardItem>>): void`
  - `applySpacedRepetitionGrade(card: FlashcardItem, grade: 'again' | 'hard' | 'good' | 'easy'): { nextCardState: FlashcardItem; reQueueOffset: number | null }`
  - `toggleCardSuspension(card: FlashcardItem): FlashcardItem`

- [ ] **Step 1: Write the failing test for interval transitions and in-session re-queuing**

```typescript
// tests/spacedRepetitionService.test.ts
import assert from 'node:assert';
import { applySpacedRepetitionGrade } from '../src/utils/spacedRepetitionService';
import type { FlashcardItem } from '../src/types/cumulativeStudy';

const baseCard: FlashcardItem = {
  structureId: 'struct_test',
  drugName: 'Amiodarone',
  moduleIds: ['antiarrhythmic'],
  structure: { id: 'I', name: 'Amiodarone', chemicalClass: 'Benzofuran', pharmacologicalClass: 'Class III', target: 'K+', reversibility: 'Reversible', route: 'Oral', keyFunctionalGroups: ['Iodine', 'Benzofuran'], pkPdHighlights: { onset: 'Slow', duration: 'Long', halfLife: '50d', elimination: 'Hepatic' }, sarNotes: 'Iodine causes thyroid toxicity' },
  intervalMinutes: 0,
  dueTimestamp: 0,
  repetitionCount: 0,
  state: 'new',
  isSuspended: false,
  struggleCount: 0
};

// 1. Again: < 1 min, re-queue at end
const againResult = applySpacedRepetitionGrade(baseCard, 'again');
assert.strictEqual(againResult.nextCardState.intervalMinutes, 1);
assert.strictEqual(againResult.nextCardState.struggleCount, 1);
assert.strictEqual(againResult.reQueueOffset, -1); // End of queue

// 2. Hard: 4 min, re-queue a few steps back
const hardResult = applySpacedRepetitionGrade(baseCard, 'hard');
assert.strictEqual(hardResult.nextCardState.intervalMinutes, 4);
assert.strictEqual(hardResult.nextCardState.struggleCount, 1);
assert.strictEqual(hardResult.reQueueOffset, 3); // Insert 3 steps back

// 3. Good: 10 min, graduates from active session
const goodResult = applySpacedRepetitionGrade(baseCard, 'good');
assert.strictEqual(goodResult.nextCardState.intervalMinutes, 10);
assert.strictEqual(goodResult.reQueueOffset, null);

// 4. Easy: 1440 min (1 day), mastered
const easyResult = applySpacedRepetitionGrade(baseCard, 'easy');
assert.strictEqual(easyResult.nextCardState.intervalMinutes, 1440);
assert.strictEqual(easyResult.nextCardState.state, 'mastered');
assert.strictEqual(easyResult.reQueueOffset, null);

console.log('Spaced repetition engine passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/spacedRepetitionService.test.ts`  
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement `src/utils/spacedRepetitionService.ts`**

Implement `applySpacedRepetitionGrade` with exact intervals (`again`: 1 min, `hard`: 4 min, `good`: 10 min, `easy`: 1440 min), localStorage load/save functions, and card suspension logic.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/spacedRepetitionService.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/spacedRepetitionService.ts tests/spacedRepetitionService.test.ts
git commit -m "feat(services): implement spaced repetition queue transitions and persistence"
```

---

### Task 5: Partial Credit Scoring & Diagnostic Struggle Analyzer

**Files:**
- Create: `src/utils/struggleDiagnosticService.ts`
- Test: `tests/struggleDiagnosticService.test.ts`

**Interfaces:**
- Consumes: `CumulativeQuestion`, `FlashcardItem`, `StruggleDiagnosticReport` from `src/types/cumulativeStudy.ts`.
- Produces:
  - `calculateQuestionScore(question: CumulativeQuestion, selectedIds: string[]): { scorePercentage: number; truePositives: string[]; falsePositives: string[]; falseNegatives: string[] }`
  - `generateStruggleReport(questionResults: Array<{ question: CumulativeQuestion; selectedIds: string[] }>, flashcardHistory: FlashcardItem[]): StruggleDiagnosticReport`

- [ ] **Step 1: Write the failing test for partial credit scoring and struggle analysis**

```typescript
// tests/struggleDiagnosticService.test.ts
import assert from 'node:assert';
import { calculateQuestionScore, generateStruggleReport } from '../src/utils/struggleDiagnosticService';
import type { CumulativeQuestion } from '../src/types/cumulativeStudy';

const q: CumulativeQuestion = {
  id: 'q1',
  type: 'case-to-structures',
  moduleIds: ['antiplatelets'],
  stem: 'Select all P2Y12 antagonists',
  candidateStructures: [
    { id: 'c1', name: 'Clopidogrel' } as any,
    { id: 'c2', name: 'Prasugrel' } as any,
    { id: 'c3', name: 'Aspirin' } as any
  ],
  correctStructureIds: ['c1', 'c2'],
  rationales: {}
};

// 1. Partial credit: Student selects 'c1' and distractor 'c3'
// TP = 1 ('c1'), FP = 1 ('c3'), FN = 1 ('c2'). Total True = 2.
// Score = max(0, (1 - 1) / 2) = 0%.
const res1 = calculateQuestionScore(q, ['c1', 'c3']);
assert.strictEqual(res1.scorePercentage, 0);
assert.deepStrictEqual(res1.truePositives, ['c1']);
assert.deepStrictEqual(res1.falsePositives, ['c3']);
assert.deepStrictEqual(res1.falseNegatives, ['c2']);

// 2. Partial credit: Student selects only 'c1'
// TP = 1 ('c1'), FP = 0, FN = 1 ('c2').
// Score = 1 / 2 = 50%.
const res2 = calculateQuestionScore(q, ['c1']);
assert.strictEqual(res2.scorePercentage, 50);

// 3. Perfect: Student selects 'c1' and 'c2'
const res3 = calculateQuestionScore(q, ['c1', 'c2']);
assert.strictEqual(res3.scorePercentage, 100);

console.log('Partial credit scoring tests passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/struggleDiagnosticService.test.ts`  
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement `src/utils/struggleDiagnosticService.ts`**

Implement formula `max(0, Math.round(((tp.length - fp.length) / totalTrue) * 100))` and struggle aggregator grouping by drug class and flagging items with `struggleCount >= 2` or missed answers.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/struggleDiagnosticService.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/struggleDiagnosticService.ts tests/struggleDiagnosticService.test.ts
git commit -m "feat(diagnostics): calculate partial credit and generate post-session struggle reports"
```

---

### Task 6: Anki-Style Flashcard Component (`StructureFlashcardDeck.tsx`)

**Files:**
- Create: `src/components/StructureFlashcardDeck.tsx`
- Test: `tests/flashcardDeckComponent.test.ts`

**Interfaces:**
- Consumes: `FlashcardItem` from `src/types/cumulativeStudy.ts`, `spacedRepetitionService.ts`.
- Produces: `<StructureFlashcardDeck cards={cards} onSessionComplete={(struggledCards) => ...} />`.

- [ ] **Step 1: Write the test verifying component structure and keyboard handling**

```typescript
// tests/flashcardDeckComponent.test.ts
import assert from 'node:assert';
import fs from 'node:fs';

const content = fs.readFileSync('src/components/StructureFlashcardDeck.tsx', 'utf-8');
assert.ok(content.includes('Again'), 'Must render Again button');
assert.ok(content.includes('Hard'), 'Must render Hard button');
assert.ok(content.includes('Good'), 'Must render Good button');
assert.ok(content.includes('Easy'), 'Must render Easy button');
assert.ok(content.includes('4 min') || content.includes('4m'), 'Must display 4 min interval');
assert.ok(content.includes('10 min') || content.includes('10m'), 'Must display 10 min interval');
assert.ok(content.includes('1 day') || content.includes('1d'), 'Must display 1 day interval');
assert.ok(content.includes('keydown'), 'Must register keyboard listener for Space and 1-4');
console.log('FlashcardDeck component checks passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/flashcardDeckComponent.test.ts`  
Expected: FAIL with "no such file or directory"

- [ ] **Step 3: Implement `src/components/StructureFlashcardDeck.tsx`**

Build the card container:
- Front: Blinded chemical structure (using SVG/canvas), "Flip Card" button.
- Back: Pharmacologic class banner, drug name, bodily effect, key functional groups, "Suspend Card" link.
- 4-interval buttons: Again (<1m), Hard (4m), Good (10m), Easy (1d).
- Top bar: Module filter checkboxes and active queue counter.
- Keyboard bindings: `Space` (flip), `1` (Again), `2` (Hard), `3` (Good), `4` (Easy).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/flashcardDeckComponent.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/StructureFlashcardDeck.tsx tests/flashcardDeckComponent.test.ts
git commit -m "feat(ui): implement Anki-style rapid structure recall flashcard deck component"
```

---

### Task 7: Cumulative Practice Test Component (`CumulativePracticeTestView.tsx`)

**Files:**
- Create: `src/components/CumulativePracticeTestView.tsx`
- Test: `tests/cumulativePracticeTestComponent.test.ts`

**Interfaces:**
- Consumes: `CumulativeQuestion` from `src/types/cumulativeStudy.ts`, `calculateQuestionScore`.
- Produces: `<CumulativePracticeTestView questions={questions} onComplete={(report) => ...} />`.

- [ ] **Step 1: Write the test verifying question rendering for Types A, B, C, D**

```typescript
// tests/cumulativePracticeTestComponent.test.ts
import assert from 'node:assert';
import fs from 'node:fs';

const content = fs.readFileSync('src/components/CumulativePracticeTestView.tsx', 'utf-8');
assert.ok(content.includes('candidateStructures'), 'Must support candidateStructures');
assert.ok(content.includes('effectStatements'), 'Must support Type B effectStatements');
assert.ok(content.includes('Submit Answer'), 'Must render submit button');
assert.ok(content.includes('Next Question') || content.includes('Finish Drill'), 'Must render progression button');
console.log('CumulativePracticeTestView checks passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/cumulativePracticeTestComponent.test.ts`  
Expected: FAIL with "no such file or directory"

- [ ] **Step 3: Implement `src/components/CumulativePracticeTestView.tsx`**

Build:
- Clinical vignette header with blinded candidate structure cards (Types A, C, D) or single prominent structure + statement checkboxes (Type B).
- Multi-select toggle logic with check badges.
- Post-submission instant feedback: Emerald border for true positives, crimson for false positives, amber for false negatives. Detailed chemical rationales and high-yield pearl accordion.
- Partial credit score display (`Score: 75%`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/cumulativePracticeTestComponent.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/CumulativePracticeTestView.tsx tests/cumulativePracticeTestComponent.test.ts
git commit -m "feat(ui): implement cumulative practice test view with multi-select SAR deduction"
```

---

### Task 8: Diagnostic Struggle Overview Component (`StruggleDiagnosticOverview.tsx`)

**Files:**
- Create: `src/components/StruggleDiagnosticOverview.tsx`
- Test: `tests/struggleDiagnosticOverviewComponent.test.ts`

**Interfaces:**
- Consumes: `StruggleDiagnosticReport` from `src/types/cumulativeStudy.ts`.
- Produces: `<StruggleDiagnosticOverview report={report} onDrillStruggled={() => ...} onReset={() => ...} />`.

- [ ] **Step 1: Write test verifying diagnostic struggle overview**

```typescript
// tests/struggleDiagnosticOverviewComponent.test.ts
import assert from 'node:assert';
import fs from 'node:fs';

const content = fs.readFileSync('src/components/StruggleDiagnosticOverview.tsx', 'utf-8');
assert.ok(content.includes('Drill'), 'Must render remediation drill action');
assert.ok(content.includes('struggledStructures') || content.includes('Struggled'), 'Must render struggled structures');
assert.ok(content.includes('classBreakdown') || content.includes('Recall Rate'), 'Must render class recall breakdown');
console.log('StruggleDiagnosticOverview checks passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/struggleDiagnosticOverviewComponent.test.ts`  
Expected: FAIL with "no such file or directory"

- [ ] **Step 3: Implement `src/components/StruggleDiagnosticOverview.tsx`**

Build the diagnostic screen matching the approved mockup:
- Score header and total items reviewed.
- Primary struggle patterns summary box.
- Grid: Left box showing individual molecules struggled with (`struggleCount >= 2` or missed), right box showing recall percentage bars by pharmacologic class.
- "Drill Struggled Items Now" button triggering targeted re-test session.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/struggleDiagnosticOverviewComponent.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/StruggleDiagnosticOverview.tsx tests/struggleDiagnosticOverviewComponent.test.ts
git commit -m "feat(ui): implement diagnostic struggle overview and remediation drill component"
```

---

### Task 9: Cumulative Study Hub Modal & Navbar Integration

**Files:**
- Create: `src/components/CumulativeStudyHubModal.tsx`
- Modify: `src/components/Navbar.tsx:50-100,520-550`
- Modify: `src/App.tsx:50-70,1130-1160`
- Test: `tests/cumulativeStudyHubIntegration.test.ts`

**Interfaces:**
- Combines `StructureFlashcardDeck`, `CumulativePracticeTestView`, and `StruggleDiagnosticOverview`.
- Connects to navbar with `"Cumulative Hub"` button.

- [ ] **Step 1: Write integration test**

```typescript
// tests/cumulativeStudyHubIntegration.test.ts
import assert from 'node:assert';
import fs from 'node:fs';

const navbar = fs.readFileSync('src/components/Navbar.tsx', 'utf-8');
assert.ok(navbar.includes('onOpenCumulativeHub') || navbar.includes('Cumulative'), 'Navbar must include cumulative hub trigger');

const app = fs.readFileSync('src/App.tsx', 'utf-8');
assert.ok(app.includes('CumulativeStudyHubModal'), 'App.tsx must include CumulativeStudyHubModal');
console.log('Cumulative study hub integration tests passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/cumulativeStudyHubIntegration.test.ts`  
Expected: FAIL

- [ ] **Step 3: Implement `CumulativeStudyHubModal.tsx`, update `Navbar.tsx` and `App.tsx`**

- Create `CumulativeStudyHubModal.tsx` with top tab bar ("Practice Tests", "Structure Flashcards", "Diagnostic Summary").
- Add button in `Navbar.tsx` with `GraduationCap` icon and `"Cumulative"` label.
- Pass `isCumulativeHubOpen` and `onClose` in `App.tsx`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/cumulativeStudyHubIntegration.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/CumulativeStudyHubModal.tsx src/components/Navbar.tsx src/App.tsx tests/cumulativeStudyHubIntegration.test.ts
git commit -m "feat(hub): integrate cumulative study hub modal and navbar entry point"
```

---

### Task 10: End-to-End Build, Verification, & GitHub Deployment

**Files:**
- Run all test suites: `tests/*.test.ts`
- TypeScript check: `npx tsc --noEmit`
- Production bundling: `npm run build`
- Git commit & push: `origin/main`

- [ ] **Step 1: Run all test suites concurrently**

Run: `npx tsx tests/cumulativeStudyTypes.test.ts && npx tsx tests/cumulativeQuizData.test.ts && npx tsx tests/cumulativeStructureHarvester.test.ts && npx tsx tests/spacedRepetitionService.test.ts && npx tsx tests/struggleDiagnosticService.test.ts && npx tsx tests/flashcardDeckComponent.test.ts && npx tsx tests/cumulativePracticeTestComponent.test.ts && npx tsx tests/struggleDiagnosticOverviewComponent.test.ts && npx tsx tests/cumulativeStudyHubIntegration.test.ts`  
Expected: ALL PASS

- [ ] **Step 2: Run full TypeScript check**

Run: `npx tsc --noEmit`  
Expected: 0 errors

- [ ] **Step 3: Run production build**

Run: `npm run build`  
Expected: `✓ built in ...` with zero errors

- [ ] **Step 4: Push to GitHub origin/main**

```bash
git push origin main
```
Expected: Successfully pushed commit to `main` for Vercel deployment.
