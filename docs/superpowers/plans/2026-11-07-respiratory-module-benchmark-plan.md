# Exam 1 Respiratory Module Benchmark Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the Exam 1 Respiratory Review Module (`src/data/respiratoryReviewModuleData.ts`) to establish a gold-standard benchmark with 1:1 fidelity to Dr. Rami A. Al-Horani's 9-page review handout, eliminating artificial question nomenclature (Q101, Q201) and removing all parenthetical drug name spoilers from multiple-choice choices and drag-and-drop matching targets.

**Architecture:** Update `src/data/respiratoryReviewModuleData.ts` across Slides 1–9 with explicit `questionNumberLabel` fields (`Question 1`, `Question 2`, etc.), sanitized Roman numeral options for Slide 2 and Slide 3 multiple-choice items, and sanitized target labels for Slide 6 and Slide 8 matching exercises. Verify compatibility with `StructureDragDropMatch.tsx`, update Dexie module cache versioning in `src/utils/moduleStorage.ts`, and validate with comprehensive automated regression suites.

**Tech Stack:** TypeScript, React, Tailwind CSS, Dexie (IndexedDB), Node test runner (`tsx`).

**Spec:** [`docs/superpowers/specs/2026-11-07-respiratory-module-benchmark-design.md`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/docs/superpowers/specs/2026-11-07-respiratory-module-benchmark-design.md)

---

## Global Constraints

- Never reveal drug names in chips, options, or matching targets when the source review worksheet presents unlabeled structures (e.g. Structures I–VII on Slide 2 and Slide 8).
- Every question on every slide must carry an authentic `questionNumberLabel: 'Question N'` matching its sequential order on that slide.
- Preserve 100% passing status on existing automated test suite `tests/respiratoryReviewModule.test.ts`.
- Ensure matching drop targets accept both Roman numerals (`'I'`, `'II'`, etc.) and canonical structure IDs (`'aclidinium'`, `'olodaterol'`, etc.) in `acceptedStructureIds`.
- All TypeScript types must satisfy `AntiplateletQuestion` and `ReviewPage` without any type errors or warnings.

---

## Review Focus

1. **Spoiler leakage in multiple-choice options (Slide 2 & 3):** Students must not see drug names in parentheses (e.g. `'Structure VII (Norepinephrine)'`); options must strictly read `'Structure VII'`.
2. **Spoiler leakage in matching target labels (Slide 6 & 8):** Drop target labels must not announce the answer in parentheses (e.g. `'(Structure VI: Olodaterol)'`); labels must strictly describe the target mechanism/pharmacophore.
3. **Question numbering consistency across all slides (Slides 1–9):** Every question item must render with clean sequential numbering (`Question 1`, `Question 2`...) rather than synthetic database IDs (`Q101`, `Q201`, etc.).
4. **Dual identifier acceptance in matching targets:** `acceptedStructureIds` must accept both Roman numeral aliases (`'I'`, `'II'`, `'III'`, `'IV'`, `'V'`, `'VI'`, `'VII'`) and canonical structure IDs (`'aclidinium'`, `'olodaterol'`, etc.) to prevent false-negative drops.
5. **Browser IndexedDB cache refresh:** Updating module data must increment the cache revision so existing student browser sessions immediately see the sanitized questions without requiring manual cache clearing.

---

## Task Structure

### Task 1: Sanitize Slide 2 Adrenergic SAR Multiple-Choice Questions (Strip Spoilers & Add Sequential Numbering)

**Files:**
- Modify: `src/data/respiratoryReviewModuleData.ts:1835-1980`
- Test: `tests/respiratoryReviewModule.test.ts`
- Test: `tests/matchingAuditExam1And2.test.ts`

**Interfaces:**
- Consumes: `AntiplateletQuestion`, `RESPIRATORY_REVIEW_STRUCTURES`
- Produces: Sanitized Slide 2 questions with `questionNumberLabel: 'Question 1'` through `'Question 8'` and clean Roman numeral options without parenthetical drug names.

- [ ] **Step 1: Write test assertion verifying Slide 2 has clean Roman numeral options without spoilers**

Add a test case in `tests/respiratoryReviewModule.test.ts` verifying that none of the Slide 2 options contain parentheses with drug names:
```ts
p2Questions.forEach((q, idx) => {
  assert.equal(q.questionNumberLabel, `Question ${idx + 1}`, `Slide 2 question ${q.id} must have questionNumberLabel "Question ${idx + 1}"`);
  if (q.options) {
    q.options.forEach((opt) => {
      assert.doesNotMatch(opt, /Structure\s+[IVXLCDM]+\s*\([A-Za-z]+\)/, `Slide 2 option must not contain drug name spoilers in parentheses: "${opt}"`);
    });
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/respiratoryReviewModule.test.ts`
Expected: FAIL showing missing `questionNumberLabel` or spoiler match in options.

- [ ] **Step 3: Update Slide 2 questions in `src/data/respiratoryReviewModuleData.ts`**

Update `id: 201` through `id: 208`:
1. Add `questionNumberLabel: 'Question 1'` through `'Question 8'`.
2. Sanitize options for Q202: replace `'Structure VII (Norepinephrine)'`, `'Structure I (Isoproterenol)'`, `'Structure II (Dobutamine)'`, `'Structure IV (Salmeterol)'` with `'Structure VII'`, `'Structure I'`, `'Structure II'`, `'Structure IV'`.
3. Sanitize options for Q203: `'Structure I'`, `'Structure II'`, `'Structure VI'`, `'Structure VII'`.
4. Sanitize options for Q204: `'Structure II'`, `'Structure I'`, `'Structure III'`, `'Structure V'`.
5. Sanitize options for Q205: `'Structures III, IV, V, and VI'`, `'Structures I, II, and VII'`, `'Structures I, III, and V only'`, `'Structures II, IV, and VII only'`.
6. Sanitize options for Q206: `'Structure VI = SABA; Structure IV = LABA; Structures III & V = Ultra-LABA'`, etc.
7. Sanitize options for Q207: `'Structures III, IV, V, and VI are indicated for asthma/COPD; Structure II is for acute cardiogenic shock; Structure VII is for septic shock'`, etc.
8. Sanitize options for Q208: `'Structures I, II, and VII are inactivated by COMT; Structure VII is deaminated by MAO; Structures III, IV, V, and VI are resistant to COMT'`, etc.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/respiratoryReviewModule.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/data/respiratoryReviewModuleData.ts tests/respiratoryReviewModule.test.ts
git commit -m "fix(respiratory): sanitize Slide 2 adrenergic questions and standardize numbering"
```

---

### Task 2: Sanitize Slide 8 Mechanism Matching Targets and Questions (Strip Spoilers & Add Sequential Numbering)

**Files:**
- Modify: `src/data/respiratoryReviewModuleData.ts:2650-2790`
- Test: `tests/respiratoryReviewModule.test.ts`
- Test: `tests/matchingAuditExam1And2.test.ts`

**Interfaces:**
- Consumes: `AntiplateletQuestion`, `RESPIRATORY_REVIEW_STRUCTURES`
- Produces: Sanitized Slide 8 matching targets without parenthetical structure spoilers `(Structure VI: Olodaterol)`, clean `questionNumberLabel: 'Question 1'`, `'Question 2'`, `'Question 3'`.

- [ ] **Step 1: Write test assertion verifying Slide 8 target labels are free of spoilers**

Add a test assertion in `tests/respiratoryReviewModule.test.ts`:
```ts
const s8Matching = p8Questions.find((q) => q.type === 'matching')!;
assert.ok(s8Matching, 'Slide 8 must have matching question');
assert.equal(s8Matching.questionNumberLabel, 'Question 1');
s8Matching.matchingTargets!.forEach((t) => {
  assert.doesNotMatch(t.label, /\(Structure\s+[IVXLCDM]+:\s*[A-Za-z]+\)/i, `Target label must not contain spoiler: "${t.label}"`);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/respiratoryReviewModule.test.ts`
Expected: FAIL showing matching target label has spoiler `(Structure I: Aclidinium)` or missing `questionNumberLabel`.

- [ ] **Step 3: Update Slide 8 matching targets and questions in `src/data/respiratoryReviewModuleData.ts`**

1. Set `questionNumberLabel: 'Question 1'` on Q801 (Mechanism Matching), `'Question 2'` on Q802 (Formulation Chemistry), and `'Question 3'` on Q803 (Leukotriene Modulators).
2. Replace target labels in Q801:
   - `target_m3_antag`: `'Muscarinic M3 receptor antagonist'`
   - `target_pla2_annexin`: `'Phospholipase A2 (cPLA2) indirect inhibitor via Annexin A1 induction'`
   - `target_dual_pde`: `'Dual PDE3 and PDE4 inhibitor with combined bronchodilator & anti-inflammatory actions'`
   - `target_cyslt1_antag`: `'Cysteinyl leukotriene receptor 1 (CysLT1) antagonist'`
   - `target_5lox_inhib`: `'5-Lipoxygenase (5-LOX) inhibitor via iron chelation'`
   - `target_beta2_agon`: `'Selective beta-2 adrenergic receptor agonist (ultra-LABA)'`
   - `target_pde_nonselective`: `'Nonselective Phosphodiesterase (PDE) inhibitor & adenosine receptor antagonist'`
3. Verify `acceptedStructureIds` includes both Roman numerals and drug keys (`['I', 'aclidinium']`, `['II', 'methylprednisolone']`, `['III', 'ensifentrine']`, `['IV', 'montelukast']`, `['V', 'zileuton']`, `['VI', 'olodaterol']`, `['VII', 'theophylline']`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/respiratoryReviewModule.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/data/respiratoryReviewModuleData.ts tests/respiratoryReviewModule.test.ts
git commit -m "fix(respiratory): sanitize Slide 8 mechanism matching targets and standardize numbering"
```

---

### Task 3: Sanitize Slide 6 Formulation Matching and Slide 3 Anticholinergics Options

**Files:**
- Modify: `src/data/respiratoryReviewModuleData.ts:2000-2150` (Slide 3)
- Modify: `src/data/respiratoryReviewModuleData.ts:2440-2505` (Slide 6)
- Test: `tests/respiratoryReviewModule.test.ts`

**Interfaces:**
- Consumes: `AntiplateletQuestion`, `ReviewPage`
- Produces: Sanitized Slide 6 matching target labels without structure spoilers, sanitized Slide 3 options without drug names in parentheses.

- [ ] **Step 1: Write test assertion verifying Slide 6 target labels have no spoilers**

Add a test in `tests/respiratoryReviewModule.test.ts`:
```ts
const s6Matching = p6Questions.find((q) => q.type === 'matching')!;
assert.ok(s6Matching, 'Slide 6 must have matching question');
s6Matching.matchingTargets!.forEach((t) => {
  assert.doesNotMatch(t.label, /^Structure\s+[IVXLCDM]+\s*\([A-Za-z\s]+\):/i, `Slide 6 target label must not spoil structure: "${t.label}"`);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/respiratoryReviewModule.test.ts`
Expected: FAIL showing Slide 6 target labels start with `Structure I (Triamcinolone acetonide):`.

- [ ] **Step 3: Update Slide 6 matching targets and Slide 3 options in `src/data/respiratoryReviewModuleData.ts`**

1. In Slide 6 Q602 (`matchingTargets`), replace labels:
   - `target_triamcinolone`: `'Cyclic 16,17-acetonide ketal for topical anti-inflammatory potency with zero salt retention'`
   - `target_beclo`: `'Lipophilic diester prodrug providing airway tissue deposition and low oral bioavailability'`
   - `target_fluticasone`: `'17beta-Carbothioate fluoromethyl soft steroid designed for rapid metabolic inactivation'`
   - `target_hydro_phos`: `'Water-soluble parenteral ester salt for emergency intravenous bolus administration'`
   - `target_ciclesonide`: `'Inhaled cyclic acetal prodrug bioactivated by pulmonary airway esterases'`
   - `target_clobetasol`: `'Super-potent 21-chloro substituted topical corticosteroid for severe inflammatory dermatoses'`
2. In Slide 3 Q304 (`id: 304`), sanitize options:
   - Option 0: `'Structures III, IV, and V are indicated for respiratory diseases; Structure I is for overactive bladder; Structure II is for Parkinson’s disease'`
   - Remove parenthetical drug names from remaining options.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/respiratoryReviewModule.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/data/respiratoryReviewModuleData.ts tests/respiratoryReviewModule.test.ts
git commit -m "fix(respiratory): sanitize Slide 6 formulation matching and Slide 3 anticholinergic options"
```

---

### Task 4: Standardize Sequential Question Numbering Across Slides 1, 3, 4, 5, 6, 7, 9

**Files:**
- Modify: `src/data/respiratoryReviewModuleData.ts`
- Test: `tests/respiratoryReviewModule.test.ts`

**Interfaces:**
- Consumes: All 9 `ReviewPage` objects
- Produces: Consistent `questionNumberLabel: 'Question N'` across all questions in all 9 pages.

- [ ] **Step 1: Write test assertion verifying every question across all 9 pages has sequential questionNumberLabel**

Add a test in `tests/respiratoryReviewModule.test.ts`:
```ts
pages.forEach((page, pIdx) => {
  const pQuestions = page.sections.flatMap((s) => s.questions);
  pQuestions.forEach((q, qIdx) => {
    assert.equal(
      q.questionNumberLabel,
      `Question ${qIdx + 1}`,
      `Page ${pIdx + 1} question ${q.id} must have questionNumberLabel "Question ${qIdx + 1}", got "${q.questionNumberLabel}"`
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/respiratoryReviewModule.test.ts`
Expected: FAIL on Slide 1 / Slide 3 / Slide 4 / Slide 5 / Slide 7 / Slide 9 due to missing or mismatched `questionNumberLabel`.

- [ ] **Step 3: Add `questionNumberLabel: 'Question N'` to all remaining questions in `src/data/respiratoryReviewModuleData.ts`**

1. Slide 1 (Page 1): Q101 $\to$ `'Question 1'`, Q102 $\to$ `'Question 2'`, Q103 $\to$ `'Question 3'`.
2. Slide 3 (Page 3): Q301 through Q309 $\to$ `'Question 1'` through `'Question 9'`.
3. Slide 4 (Page 4): Q401 $\to$ `'Question 1'`, Q402 $\to$ `'Question 2'`.
4. Slide 5 (Page 5): Q501 $\to$ `'Question 1'`, Q502 $\to$ `'Question 2'`.
5. Slide 6 (Page 6): Q601 $\to$ `'Question 1'`, Q602 $\to$ `'Question 2'`.
6. Slide 7 (Page 7): Q701 $\to$ `'Question 1'`, Q702 $\to$ `'Question 2'`, Q703 $\to$ `'Question 3'`.
7. Slide 9 (Page 9): Q901 $\to$ `'Question 1'`, Q902 $\to$ `'Question 2'`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/respiratoryReviewModule.test.ts`
Expected: PASS with all questions sequentially numbered.

- [ ] **Step 5: Commit**

```bash
git add src/data/respiratoryReviewModuleData.ts tests/respiratoryReviewModule.test.ts
git commit -m "feat(respiratory): standardize authentic sequential question numbering across all 9 slides"
```

---

### Task 5: Dexie Cache-Busting, Full Test Suite Verification, and Build Verification

**Files:**
- Modify: `src/utils/moduleStorage.ts`
- Test: `tests/respiratoryReviewModule.test.ts`
- Test: `tests/matchingAuditExam1And2.test.ts`

**Interfaces:**
- Consumes: `getDefaultRespiratoryReviewModule()`
- Produces: Updated cache key/revision in `src/utils/moduleStorage.ts` ensuring fresh module data loads in student browsers, passing test suite, clean build.

- [ ] **Step 1: Check `moduleStorage.ts` cache versioning**

Inspect `src/utils/moduleStorage.ts` for module data version / revision tracking (e.g. `respiratory_review_mcp2` storage schema or seed version).
Ensure the seed check or cache revision forces reload of updated questions while preserving student completion history where applicable.

- [ ] **Step 2: Run full regression test suites**

Run:
```powershell
npx tsx tests/respiratoryReviewModule.test.ts
npx tsx tests/matchingAuditExam1And2.test.ts
```
Expected: All tests PASS with 0 errors.

- [ ] **Step 3: Run full TypeScript and Vite build**

Run: `npm run build`
Expected: Clean build with 0 TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add src/utils/moduleStorage.ts tests/
git commit -m "chore(respiratory): update cache revision and verify full build and test suites"
```
