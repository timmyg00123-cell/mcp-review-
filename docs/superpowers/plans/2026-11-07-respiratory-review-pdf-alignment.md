# Respiratory Review Module Review-PDF Alignment & Drag-and-Drop Restoration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul `src/data/respiratoryReviewModuleData.ts` to achieve 1:1 fidelity with Dr. Rami A. Al-Horani's 9-page Respiratory Review PDF, restore functioning Drag & Drop matching card trays on Questions 101, 602, and 801, fix component completion and fallback logic, harden matching test audits, and bump version to `2.2.0`.

**Architecture:** Component logic updates in `StructureDragDropMatch.tsx` and `DocumentQuestionItem.tsx` ensure that draggable card trays always populate and that target alias lists do not inflate completion counts. A hardened test suite in `tests/matchingAuditExam1And2.test.ts` eliminates false-positive passes by asserting non-empty available structures on all matching questions. In `src/data/respiratoryReviewModuleData.ts`, all "Slide N" references are replaced with "Review Page N" citations, `structuresDisplayed` and explicit `questionStem` are assigned to Q101, Q602, and Q801, and the module version is bumped to `2.2.0`.

**Tech Stack:** TypeScript, React, Vite, Node.js Test Runner (`node:test`, `node:assert/strict`), Tailwind CSS, SmilesDrawer / Canvas.

**Spec:** [`docs/superpowers/specs/2026-11-07-respiratory-review-pdf-alignment-design.md`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/docs/superpowers/specs/2026-11-07-respiratory-review-pdf-alignment-design.md)

---

## Global Constraints

- Dr. Al-Horani's 9-page Review PDF (*"MCPII Fall 2026 Respiratory Med Chem (Asthma/COPD) Dr. Al-Horani"*, `media_1793986298884_6d5f5ca2.pdf`) is the authoritative source of truth.
- Completely purge all "Slide N" terminology from the Respiratory module, replacing it with "Review Page 1" through "Review Page 9" and verified source question citations (`sourceReference: 'Respiratory Med Chem (Asthma/COPD) Review, Page X, Question Y'`).
- Preserve all 41 validated landmark respiratory structures in `RESPIRATORY_REVIEW_STRUCTURES` and their PubChem CIDs and SMILES intact.
- Exam 2 modules (Diuretics, Sympatholytics, Vasodilators, RAAS, Antihyperlipidemics) and other Exam 1 modules (Renal) are outside scope and must remain untouched.
- Module version must be bumped to `'2.2.0'` in `src/data/respiratoryReviewModuleData.ts` to invalidate stale client Dexie/localStorage caches.
- Every matching question MUST have an available structure pool (>0) and matching targets (>0) with accepted structure IDs (>0). No silent conditional test skips.

## Review Focus

1. **Empty Draggable Tray**: If a matching question lacks `structuresDisplayed` and `referenced_structures`, `DocumentQuestionItem.tsx` must fall back to `allSectionStructures` or `allModuleStructures` so card trays are never empty.
2. **Target Completion Blocked by Aliases**: When `acceptedStructureIds` contains multiple valid identifiers for a single target (e.g. `['umeclidinium', 'I']`), `StructureDragDropMatch.tsx` must verify that every target has at least one valid placed structure rather than summing alias counts.
3. **Audit False Positives**: `tests/matchingAuditExam1And2.test.ts` must fail if any matching question lacks available structures or targets, removing all `if (q.structuresDisplayed)` guards.
4. **Sub-statement Count Invariance**: The module must maintain all 47 interactive sub-statements across all 9 pages so `tests/e2eExam1InteractiveReviews.test.ts` continues to pass.
5. **No Slide Residue**: A regex scan for `/\bSlide\s*\d+/i` over `src/data/respiratoryReviewModuleData.ts` must return zero matches.

---

### Task 1: Component Hardening & Defensive Fallback

**Files:**
- Modify: `src/components/StructureDragDropMatch.tsx:106-124`
- Modify: `src/components/DocumentQuestionItem.tsx:340-343, 864-876`
- Create: `tests/componentDragDropLogic.test.ts`

**Interfaces:**
- Consumes: `MatchingTarget`, `ChemicalStructure`, `placements: Record<string, string[]>`
- Produces: Correct `isCompleted` calculation in `StructureDragDropMatch.tsx` that checks every target has at least one valid placed structure; defensive fallback in `DocumentQuestionItem.tsx` providing `allSectionStructures` or `allModuleStructures` to matching questions.

- [ ] **Step 1: Write failing unit test `tests/componentDragDropLogic.test.ts`**

```typescript
import test from 'node:test';
import assert from 'node:assert/strict';

// Helper matching completion evaluation logic
export function isMatchingComplete(
  targets: { id: string; acceptedStructureIds: string[] }[],
  placements: Record<string, string[]>,
  unassignedCount: number,
  examModeActive = false
): boolean {
  if (examModeActive || targets.length === 0 || unassignedCount > 0) return false;
  return targets.every((t) => {
    const placed = placements[t.id] || [];
    return placed.length > 0 && placed.every((id) => t.acceptedStructureIds.includes(id));
  });
}

// Helper matching structure resolution logic
export function resolveMatchingStructures(
  question: { type?: string; structuresDisplayed?: any[]; referenced_structures?: string[] },
  allSectionStructures: any[] = [],
  allModuleStructures: any[] = []
): any[] {
  if (question.structuresDisplayed && question.structuresDisplayed.length > 0) {
    return question.structuresDisplayed;
  }
  if (question.type === 'matching') {
    if (allSectionStructures && allSectionStructures.length > 0) {
      return allSectionStructures;
    }
    if (allModuleStructures && allModuleStructures.length > 0) {
      return allModuleStructures;
    }
  }
  return [];
}

test('isMatchingComplete handles targets with multiple alias acceptedStructureIds without inflating required placements', () => {
  const targets = [
    { id: 'target_anoro', acceptedStructureIds: ['umeclidinium', 'I'] },
    { id: 'target_breo', acceptedStructureIds: ['fluticasone_furoate', 'II'] },
    { id: 'target_stiolto', acceptedStructureIds: ['olodaterol', 'III'] },
  ];

  // Placements with 1 valid structure per target
  const placements = {
    target_anoro: ['I'],
    target_breo: ['fluticasone_furoate'],
    target_stiolto: ['III'],
  };

  assert.equal(isMatchingComplete(targets, placements, 0), true);
  // Unassigned structures remain -> not completed
  assert.equal(isMatchingComplete(targets, placements, 1), false);
  // Incorrect placement in target -> not completed
  assert.equal(isMatchingComplete(targets, { ...placements, target_anoro: ['wrong_id'] }, 0), false);
});

test('resolveMatchingStructures falls back to allSectionStructures or allModuleStructures for matching questions with no explicit structures', () => {
  const dummySectionStructures = [{ id: 'str1', name: 'Drug A' }, { id: 'str2', name: 'Drug B' }];
  const dummyModuleStructures = [{ id: 'strM', name: 'Drug M' }];

  const emptyMatchingQ = { type: 'matching' };
  const resolved = resolveMatchingStructures(emptyMatchingQ, dummySectionStructures, dummyModuleStructures);
  assert.equal(resolved.length, 2);
  assert.equal(resolved[0].id, 'str1');

  const qWithExplicit = { type: 'matching', structuresDisplayed: [{ id: 'explicit1', name: 'Explicit Drug' }] };
  const resolvedExplicit = resolveMatchingStructures(qWithExplicit, dummySectionStructures, dummyModuleStructures);
  assert.equal(resolvedExplicit.length, 1);
  assert.equal(resolvedExplicit[0].id, 'explicit1');
});
```

- [ ] **Step 2: Run test to verify it passes for helper functions**

Run: `npx tsx tests/componentDragDropLogic.test.ts`  
Expected: PASS

- [ ] **Step 3: Update `src/components/StructureDragDropMatch.tsx`**

Replace lines 106–122 in [`src/components/StructureDragDropMatch.tsx`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/StructureDragDropMatch.tsx#L106-L122):
```typescript
  // A target is satisfied if at least one of its acceptedStructureIds has been placed in it,
  // and no invalid structures are placed in it.
  const allTargetsSatisfied =
    targets.length > 0 &&
    targets.every((t) => {
      const placed = placements[t.id] || [];
      return placed.length > 0 && placed.every((id) => t.acceptedStructureIds.includes(id));
    });

  const isCompleted =
    !examModeActive &&
    allTargetsSatisfied &&
    unassignedStructures.length === 0;
```

- [ ] **Step 4: Update `src/components/DocumentQuestionItem.tsx`**

1. In `structuresToAnalyze` around line 340 of [`src/components/DocumentQuestionItem.tsx`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/DocumentQuestionItem.tsx#L340):
```typescript
    // 3. For matching questions, if no specific structures matched via regex and no structuresDisplayed/referenced_structures were provided, fall back to allSectionStructures or allModuleStructures
    if (question.type === 'matching' && matched.length === 0) {
      if (allSectionStructures && allSectionStructures.length > 0) {
        return allSectionStructures;
      }
      if (allModuleStructures && allModuleStructures.length > 0) {
        return allModuleStructures;
      }
    }
```
2. In JSX when rendering `StructureDragDropMatch` around line 865:
```typescript
          {/* MATCHING TYPE */}
          {question.type === 'matching' && question.matchingTargets && (
            <StructureDragDropMatch
              question={{
                ...question,
                structuresDisplayed:
                  uniqueStructureOptions.length > 0
                    ? uniqueStructureOptions
                    : (question.structuresDisplayed && question.structuresDisplayed.length > 0)
                    ? question.structuresDisplayed
                    : (allSectionStructures && allSectionStructures.length > 0)
                    ? allSectionStructures
                    : (allModuleStructures || []),
              }}
              placements={matchingPlacements}
              onPlacementsChange={onMatchingChange}
              examModeActive={examModeActive}
              isSolved={examModeStatus === 'submitted' || isSolved}
            />
          )}
```

- [ ] **Step 5: Run lint check**

Run: `npm run lint`  
Expected: PASS (0 errors)

- [ ] **Step 6: Commit component updates**

```bash
git add src/components/StructureDragDropMatch.tsx src/components/DocumentQuestionItem.tsx tests/componentDragDropLogic.test.ts
git commit -m "fix(components): harden matching completion logic and add defensive structure fallback"
```

---

### Task 2: Harden Matching Audit Test Suite

**Files:**
- Modify: `tests/matchingAuditExam1And2.test.ts:85-128`

**Interfaces:**
- Consumes: `getRespiratoryReviewPages()`, `formatTargetBullet()`, `extractRomanOrShortLabel()`
- Produces: Strict assertion that every matching question in the Respiratory Review Module explicitly defines `structuresDisplayed.length > 0`, matching targets `length > 0`, and valid accepted structure IDs with zero silent skips.

- [ ] **Step 1: Update Respiratory Matching Audit in `tests/matchingAuditExam1And2.test.ts`**

Replace lines 85–128 of [`tests/matchingAuditExam1And2.test.ts`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/tests/matchingAuditExam1And2.test.ts#L85-L128) with:
```typescript
test('audits Exam 1 Respiratory Review matching questions for clean target bullets and Roman labels', () => {
  const allQuestions = getAllQuestionsFromPages(getRespiratoryReviewPages());
  const matchingQuestions = allQuestions.filter((q) => q.type === 'matching');

  assert.equal(
    matchingQuestions.length,
    3,
    `Expected exactly 3 matching questions in Respiratory (Q101, Q602, Q801), found ${matchingQuestions.length}`
  );

  for (const q of matchingQuestions) {
    // 1. Must define matching targets
    assert.ok(
      q.matchingTargets && q.matchingTargets.length > 0,
      `Matching question ${q.id} must define matchingTargets`
    );

    // 2. Targets must have clean single-letter bullets
    q.matchingTargets.forEach((target: MatchingTarget, index: number) => {
      const bullet = formatTargetBullet(target.id, index);
      assert.match(
        bullet,
        /^[a-z]$/,
        `Target bullet should be a single lowercase letter, got "${bullet}" for id "${target.id}" in Q${q.id}`
      );
      assert.doesNotMatch(
        bullet,
        /target[-_]|chem[-_]/i,
        `Target bullet should never contain raw prefixes, got "${bullet}" in Q${q.id}`
      );
      assert.ok(
        target.acceptedStructureIds && target.acceptedStructureIds.length > 0,
        `Target ${target.id} in Q${q.id} must have non-empty acceptedStructureIds`
      );
    });

    // 3. MUST explicitly define non-empty structuresDisplayed
    assert.ok(
      q.structuresDisplayed && q.structuresDisplayed.length > 0,
      `Matching question ${q.id} MUST explicitly define non-empty structuresDisplayed for its draggable tray`
    );

    // 4. Must have questionStem describing matching task
    assert.ok(
      q.questionStem && q.questionStem.trim().length > 10,
      `Matching question ${q.id} MUST define an informative questionStem`
    );

    q.structuresDisplayed.forEach((str: ChemicalStructure, sIdx: number) => {
      const roman = extractRomanOrShortLabel(str, sIdx);
      assert.match(
        roman,
        /^[IVXLCDM]+|[A-Z]|\d+$/i,
        `Structure label should extract clean Roman numeral or short symbol, got "${roman}" for label "${str.document_label || (str as any).label || str.id}" in Q${q.id}`
      );
      assert.doesNotMatch(
        roman,
        /[()]/,
        `Structure label should not contain drug name parentheses, got "${roman}" in Q${q.id}`
      );
    });
  }
});
```

- [ ] **Step 2: Run test to verify it fails on existing data (TDD proof)**

Run: `npx tsx tests/matchingAuditExam1And2.test.ts`  
Expected: FAIL with `AssertionError: Matching question 101 MUST explicitly define non-empty structuresDisplayed for its draggable tray`

- [ ] **Step 3: Commit the failing test specification**

```bash
git add tests/matchingAuditExam1And2.test.ts
git commit -m "test(matching): harden respiratory matching audit to assert non-empty structuresDisplayed and questionStem"
```

---

### Task 3: Overhaul `src/data/respiratoryReviewModuleData.ts` to 1:1 Review-PDF Alignment

**Files:**
- Modify: `src/data/respiratoryReviewModuleData.ts`

**Interfaces:**
- Consumes: All 41 structures in `RESPIRATORY_REVIEW_STRUCTURES`, Review PDF Page 1–9 specifications.
- Produces: `getDefaultRespiratoryReviewModule()` with version `'2.2.0'`, all 9 Review Pages with titles `'Review Page N: ...'`, every question with `sourceReference` and `sourcePageNumber`, Q101 with 5 combination targets & 5 `structuresDisplayed`, Q602 with 6 formulation targets & 6 `structuresDisplayed`, Q801 with 7 mechanism targets & 7 `structuresDisplayed`, and zero occurrences of "Slide N".

- [ ] **Step 1: Overhaul Review Page 1 (Q101, Q102, Q103)**

1. Update page header:
   - `pageTitle: 'Review Page 1: Combination Bronchodilators & Anti-inflammatory Regimens'`
   - `sectionTitle: 'Review Page 1: Fixed-Dose Inhaled Combinations & Mechanistic Synergy'`
2. Update Q101:
   - `questionNumberLabel: 'Question 1'`
   - `title: 'Fixed-Dose Combination Regimens Matching'`
   - `questionStem: 'Drag each signature chemical structure (Structure I - Structure V) into its corresponding fixed-dose combination inhaler regimen (Anoro Ellipta, Breo Ellipta, Stiolto Respimat, Trelegy Ellipta, Enerzair Breezhaler):'`
   - `prompt: 'Drag each signature chemical structure (Structure I - Structure V) into its corresponding fixed-dose combination inhaler regimen (Anoro Ellipta, Breo Ellipta, Stiolto Respimat, Trelegy Ellipta, Enerzair Breezhaler):'`
   - `sourceReference: 'Respiratory Med Chem (Asthma/COPD) Review, Page 1, Question 1'`
   - `sourcePageNumber: 1`
   - `structuresDisplayed: [UMECLIDINIUM_STRUCTURE, FLUTICASONE_FUROATE_STRUCTURE, OLODATEROL_STRUCTURE, VILANTEROL_STRUCTURE, INDACATEROL_STRUCTURE]`
   - Targets (1-to-1 matching):
     - `target_anoro`: Anoro Ellipta (Umeclidinium + Vilanterol) $\to$ accepted: `['umeclidinium', 'I']`
     - `target_breo`: Breo Ellipta (Fluticasone furoate + Vilanterol) $\to$ accepted: `['fluticasone_furoate', 'II']`
     - `target_stiolto`: Stiolto Respimat (Tiotropium + Olodaterol) $\to$ accepted: `['olodaterol', 'III']`
     - `target_trelegy`: Trelegy Ellipta (Umeclidinium + Fluticasone furoate + Vilanterol) $\to$ accepted: `['vilanterol', 'IV']`
     - `target_enerzair`: Enerzair Breezhaler (Indacaterol + Glycopyrrolate + Mometasone furoate) $\to$ accepted: `['indacaterol', 'V']`
3. Update Q102 & Q103:
   - Add `sourceReference: 'Respiratory Med Chem (Asthma/COPD) Review, Page 1, Question 2'` and `sourcePageNumber: 1` to Q102.
   - Add `sourceReference: 'Respiratory Med Chem (Asthma/COPD) Review, Page 1, Question 3'` and `sourcePageNumber: 1` to Q103.

- [ ] **Step 2: Overhaul Review Pages 2–5**

1. **Review Page 2 (Adrenergics SAR)**:
   - `pageTitle: 'Review Page 2: Adrenergic Agonists SAR'`
   - `sectionTitle: 'Review Page 2: Adrenergic Agonists SAR (Structures I-VII)'`
   - Add `sourceReference: 'Respiratory Med Chem (Asthma/COPD) Review, Page 2, Question N'` and `sourcePageNumber: 2` to Q201–Q208.
2. **Review Page 3 (Anticholinergics & Glucocorticoid Foundation)**:
   - `pageTitle: 'Review Page 3: Anticholinergics & Hydrocortisone Prototype'`
   - `sectionTitle: 'Review Page 3: Anticholinergic Muscarinic Antagonists (Structures I-V)'`
   - Add `sourceReference: 'Respiratory Med Chem (Asthma/COPD) Review, Page 3, Question N'` and `sourcePageNumber: 3` to Q301–Q309.
3. **Review Page 4 (Steroidogenesis & GR Architecture)**:
   - `pageTitle: 'Review Page 4: Hydrocortisone Biosynthesis & Glucocorticoid Receptor (GR)'`
   - `sectionTitle: 'Review Page 4: Biosynthesis Cascade & GR Receptor Activation'`
   - Add `sourceReference: 'Respiratory Med Chem (Asthma/COPD) Review, Page 4, Question N'` and `sourcePageNumber: 4` to Q401–Q402.
4. **Review Page 5 (Metabolic Inactivation & Potency Ranking)**:
   - `pageTitle: 'Review Page 5: Hydrocortisone Metabolism & Potency Ranking'`
   - `sectionTitle: 'Review Page 5: Metabolism Pathways & Relative Anti-inflammatory Potency'`
   - Add `sourceReference: 'Respiratory Med Chem (Asthma/COPD) Review, Page 5, Question N'` and `sourcePageNumber: 5` to Q501–Q502.

- [ ] **Step 3: Overhaul Review Page 6 (Formulations & Q602 Drag & Drop)**

1. Update page header:
   - `pageTitle: 'Review Page 6: Glucocorticoid Prodrugs, Soft Steroids & SAR'`
   - `sectionTitle: 'Review Page 6: Formulation Chemistry & Structural Modifications (Structures I-VI)'`
2. Update Q601:
   - Update prompt to remove "Slide 6": `'Evaluate the following True/False statements regarding the medicinal chemistry and SAR of corticosteroids from Review Page 6:'`
   - Add `sourceReference: 'Respiratory Med Chem (Asthma/COPD) Review, Page 6, Question 1'` and `sourcePageNumber: 6`.
3. Update Q602:
   - `questionNumberLabel: 'Question 2'`
   - `title: 'Corticosteroid Formulation & Structural Class Matching'`
   - `questionStem: 'Drag each chemical structure (Structure I - Structure VI) to its correct formulation class, prodrug status, and clinical role:'`
   - `prompt: 'Drag each chemical structure (Structure I - Structure VI) to its correct formulation class, prodrug status, and clinical role:'`
   - `sourceReference: 'Respiratory Med Chem (Asthma/COPD) Review, Page 6, Question 2'`
   - `sourcePageNumber: 6`
   - `structuresDisplayed: [TRIAMCINOLONE_ACETONIDE_STRUCTURE, BECLOMETHASONE_DIPROPIONATE_STRUCTURE, FLUTICASONE_PROPIONATE_STRUCTURE, HYDROCORTISONE_SODIUM_PHOSPHATE_STRUCTURE, CICLESONIDE_STRUCTURE, CLOBETASOL_PROPIONATE_STRUCTURE]`
   - Targets (1-to-1 matching):
     - Structure I (Triamcinolone acetonide) $\to$ accepted: `['triamcinolone_acetonide', 'I']`
     - Structure II (Beclomethasone dipropionate) $\to$ accepted: `['beclomethasone_dipropionate', 'II']`
     - Structure III (Fluticasone propionate) $\to$ accepted: `['fluticasone_propionate', 'III']`
     - Structure IV (Hydrocortisone sodium phosphate) $\to$ accepted: `['hydrocortisone_sodium_phosphate', 'IV']`
     - Structure V (Ciclesonide) $\to$ accepted: `['ciclesonide', 'V']`
     - Structure VI (Clobetasol propionate) $\to$ accepted: `['clobetasol_propionate', 'VI']`
4. Update Q603:
   - Add `sourceReference: 'Respiratory Med Chem (Asthma/COPD) Review, Page 6, Question 3'` and `sourcePageNumber: 6`.

- [ ] **Step 4: Overhaul Review Pages 7–9 (Q801 Drag & Drop & True/False Batteries)**

1. **Review Page 7**:
   - `pageTitle: 'Review Page 7: Glucocorticoid SAR Items, Biotransformations & PDE Inhibitors'`
   - `sectionTitle: 'Review Page 7: SAR Principles, Bioactivations & Methylxanthines vs PDE4 Inhibitors'`
   - In Q703 prompt: replace `'Slide 7/8'` with `'Review Page 7'`.
   - Add `sourceReference: 'Respiratory Med Chem (Asthma/COPD) Review, Page 7, Question N'` and `sourcePageNumber: 7` to Q701–Q703.
2. **Review Page 8**:
   - `pageTitle: 'Review Page 8: Mechanism Matching & Parenteral vs Inhaled Steroids'`
   - `sectionTitle: 'Review Page 8: 7-Drug Molecular Target Matrix & Formulations'`
   - Update Q801:
     - `questionNumberLabel: 'Question 1'`
     - `title: '7-Drug Respiratory Molecular Mechanism Matching'`
     - `questionStem: 'Drag each chemical structure (Structure I - Structure VII) to its precise pharmacological target and biochemical mechanism of action:'`
     - `prompt: 'Drag each chemical structure (Structure I - Structure VII) to its precise pharmacological target and biochemical mechanism of action:'`
     - `sourceReference: 'Respiratory Med Chem (Asthma/COPD) Review, Page 8, Question 1'`
     - `sourcePageNumber: 8`
     - `structuresDisplayed: [ACLIDINIUM_STRUCTURE, METHYLPREDNISOLONE_STRUCTURE, ENSIFENTRINE_STRUCTURE, MONTELUKAST_STRUCTURE, ZILEUTON_STRUCTURE, OLODATEROL_STRUCTURE, THEOPHYLLINE_STRUCTURE]`
     - Targets (1-to-1 matching):
       - Structure I (Aclidinium) $\to$ accepted: `['I', 'aclidinium']`
       - Structure II (Methylprednisolone) $\to$ accepted: `['II', 'methylprednisolone']`
       - Structure III (Ensifentrine) $\to$ accepted: `['III', 'ensifentrine']`
       - Structure IV (Montelukast) $\to$ accepted: `['IV', 'montelukast']`
       - Structure V (Zileuton) $\to$ accepted: `['V', 'zileuton']`
       - Structure VI (Olodaterol) $\to$ accepted: `['VI', 'olodaterol']`
       - Structure VII (Theophylline) $\to$ accepted: `['VII', 'theophylline']`
   - Add `sourceReference: 'Respiratory Med Chem (Asthma/COPD) Review, Page 8, Question N'` and `sourcePageNumber: 8` to Q802–Q803.
3. **Review Page 9**:
   - `pageTitle: 'Review Page 9: Comprehensive True/False Comparative Batteries'`
   - `sectionTitle: 'Review Page 9: Comprehensive 10-Item & 5-Item True/False Batteries'`
   - In section description: replace `"Dr. Al-Horani's Slide 9 review items"` with `"Dr. Al-Horani's Review Page 9 review items"`.
   - In Q901 explanation: replace `'Slide 9 Head-to-Head Comparison'` with `'Review Page 9 Head-to-Head Comparison'`.
   - In Q902 explanation: replace `'Slide 9 Head-to-Head Comparison'` with `'Review Page 9 Head-to-Head Comparison'`.
   - Add `sourceReference: 'Respiratory Med Chem (Asthma/COPD) Review, Page 9, Question 1'` and `sourcePageNumber: 9` to Q901.
   - Add `sourceReference: 'Respiratory Med Chem (Asthma/COPD) Review, Page 9, Question 2'` and `sourcePageNumber: 9` to Q902.

- [ ] **Step 5: Invalidate Client Cache: Bump Module Version to `'2.2.0'`**

In `getDefaultRespiratoryReviewModule()`:
```typescript
version: '2.2.0',
```

- [ ] **Step 6: Run Hardened Matching Audit Test to verify it passes**

Run: `npx tsx tests/matchingAuditExam1And2.test.ts`  
Expected: PASS (all 10 test suites pass, including Exam 1 Respiratory matching audit)

- [ ] **Step 7: Verify zero "Slide" references remain**

Run:
```powershell
Select-String -Path "src/data/respiratoryReviewModuleData.ts" -Pattern "\bSlide\s*\d+"
```
Expected: Empty output (0 matches).

- [ ] **Step 8: Commit data overhaul**

```bash
git add src/data/respiratoryReviewModuleData.ts
git commit -m "feat(respiratory): align 1:1 with 9-page review PDF, fix drag-drop card trays, and bump version to 2.2.0"
```

---

### Task 4: Contract Test Suite Updates & Multi-Suite Verification

**Files:**
- Modify: `tests/respiratoryReviewModule.test.ts`
- Verify: `tests/matchingAuditExam1And2.test.ts`
- Verify: `tests/e2eExam1InteractiveReviews.test.ts`

**Interfaces:**
- Consumes: `getDefaultRespiratoryReviewModule()`, `getRespiratoryReviewPages()`
- Produces: Strict contract verification testing version `'2.2.0'`, all 9 Review Pages, Q101/Q602/Q801 `structuresDisplayed`, non-empty `sourceReference` on all 34 questions, and total sub-statement count = 47.

- [ ] **Step 1: Update `tests/respiratoryReviewModule.test.ts`**

1. Update version check to `'2.2.0'`:
```typescript
assert.equal(mod.version, '2.2.0', 'Module version must be 2.2.0');
```
2. Assert all 9 pages have titles matching `'Review Page '`:
```typescript
pages.forEach((page, idx) => {
  assert.equal(page.pageNumber, idx + 1, `Page index ${idx} must have pageNumber ${idx + 1}`);
  assert.ok(
    page.title?.startsWith(`Review Page ${idx + 1}`),
    `Page ${idx + 1} title must start with "Review Page ${idx + 1}", got "${page.title}"`
  );
});
```
3. Assert Q101, Q602, and Q801 explicitly have `structuresDisplayed`:
```typescript
const q101 = pages[0].sections[0].questions.find((q) => q.id === 101)!;
assert.equal(q101.structuresDisplayed?.length, 5, 'Q101 must have 5 structuresDisplayed');
assert.equal(q101.matchingTargets?.length, 5, 'Q101 must have 5 matching targets');

const q602 = pages[5].sections[0].questions.find((q) => q.id === 602)!;
assert.equal(q602.structuresDisplayed?.length, 6, 'Q602 must have 6 structuresDisplayed');
assert.equal(q602.matchingTargets?.length, 6, 'Q602 must have 6 matching targets');

const q801 = pages[7].sections[0].questions.find((q) => q.id === 801)!;
assert.equal(q801.structuresDisplayed?.length, 7, 'Q801 must have 7 structuresDisplayed');
assert.equal(q801.matchingTargets?.length, 7, 'Q801 must have 7 matching targets');
```
4. Assert all 34 questions have `sourceReference` and `sourcePageNumber`:
```typescript
const allQuestions = pages.flatMap((p) => p.sections.flatMap((s) => s.questions));
assert.equal(allQuestions.length, 34, 'Must have exactly 34 questions across the 9 Review Pages');
allQuestions.forEach((q) => {
  assert.ok(
    q.sourceReference && q.sourceReference.startsWith('Respiratory Med Chem (Asthma/COPD) Review, Page '),
    `Question ${q.id} must have valid sourceReference, got "${q.sourceReference}"`
  );
  assert.ok(
    typeof q.sourcePageNumber === 'number' && q.sourcePageNumber >= 1 && q.sourcePageNumber <= 9,
    `Question ${q.id} must have sourcePageNumber between 1 and 9, got ${q.sourcePageNumber}`
  );
});
```
5. Assert zero "Slide" mentions in titles, subtitles, or section descriptions:
```typescript
const fullDataText = JSON.stringify(pages);
const slideMatch = fullDataText.match(/\bSlide\s*\d+/i);
assert.equal(slideMatch, null, `Module must have zero occurrences of "Slide N", found: ${slideMatch?.[0]}`);
```

- [ ] **Step 2: Run `tests/respiratoryReviewModule.test.ts`**

Run: `npx tsx tests/respiratoryReviewModule.test.ts`  
Expected: PASS (`All Respiratory Review Module tests passed successfully!`)

- [ ] **Step 3: Run `tests/matchingAuditExam1And2.test.ts`**

Run: `npx tsx tests/matchingAuditExam1And2.test.ts`  
Expected: PASS (`tests 10, pass 10, fail 0`)

- [ ] **Step 4: Run `tests/e2eExam1InteractiveReviews.test.ts`**

Run: `npx tsx tests/e2eExam1InteractiveReviews.test.ts`  
Expected: PASS (`ALL END-TO-END VERIFICATION CHECKS PASSED FOR EXAM 1 INTERACTIVE REVIEWS`)

- [ ] **Step 5: Run lint check**

Run: `npm run lint`  
Expected: PASS (0 errors)

- [ ] **Step 6: Commit test suite updates**

```bash
git add tests/respiratoryReviewModule.test.ts
git commit -m "test(respiratory): update contract suite to validate Review Pages 1-9, version 2.2.0, and source citations"
```

---

### Task 5: End-to-End Browser & UI Verification

**Files:** None modified (live UI verification)

- [ ] **Step 1: Verify dev server is running on `http://localhost:3000`**

Check active dev server task or run:
```powershell
Get-Process node -ErrorAction SilentlyContinue
```
Ensure HTTP 200 response from `http://localhost:3000`.

- [ ] **Step 2: Verify Review Page 1 (Q101 Combination Regimens Drag & Drop)**

1. Navigate to **Exam 1: Renal & Respiratory Medicinal Chemistry** $\to$ **Review for Respiratory Drugs**.
2. Select **Review Page 1: Combination Bronchodilators & Anti-inflammatory Regimens**.
3. Inspect Question 1 (Q101):
   - Verify 5 draggable structure cards populate in the tray (Umeclidinium, Fluticasone furoate, Olodaterol, Vilanterol, Indacaterol).
   - Drag or click each card into its matching combination inhaler target (Anoro Ellipta, Breo Ellipta, Stiolto Respimat, Trelegy Ellipta, Enerzair Breezhaler).
   - Verify green check feedback displays: `"All structures correctly matched!"`

- [ ] **Step 3: Verify Review Page 6 (Q602 Corticosteroid Formulation Drag & Drop)**

1. Select **Review Page 6: Glucocorticoid Prodrugs, Soft Steroids & SAR**.
2. Inspect Question 2 (Q602):
   - Verify 6 draggable structure cards populate in the tray (Triamcinolone acetonide, Beclomethasone dipropionate, Fluticasone propionate, Hydrocortisone sodium phosphate, Ciclesonide, Clobetasol propionate).
   - Drag or click each card to its corresponding formulation target.
   - Verify green check feedback displays: `"All structures correctly matched!"`

- [ ] **Step 4: Verify Review Page 8 (Q801 Molecular Mechanisms Drag & Drop)**

1. Select **Review Page 8: Mechanism Matching & Parenteral vs Inhaled Steroids**.
2. Inspect Question 1 (Q801):
   - Verify 7 draggable structure cards populate in the tray (Aclidinium, Methylprednisolone, Ensifentrine, Montelukast, Zileuton, Olodaterol, Theophylline).
   - Drag or click each card to its corresponding mechanism target.
   - Verify green check feedback displays: `"All structures correctly matched!"`

- [ ] **Step 5: Verify zero visible "Slide" occurrences in UI**

Inspect page navigation buttons, breadcrumbs, question badges, and rationales. Ensure all headers read "Review Page 1" through "Review Page 9" with zero "Slide" text.
