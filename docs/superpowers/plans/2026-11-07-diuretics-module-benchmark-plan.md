# Exam 2 Diuretics Review Module Benchmark Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the Exam 2 Diuretics Review Module (`src/data/exam2/diureticsModuleData.ts`, ID: `antihypertensives_1_mcp2`) to achieve 1:1 fidelity with Dr. Rami A. Al-Horani's 5-page Review PDF (`3) Review for Antihypertensive Drugs I.pdf`), partitioning into 5 authentic review pages (33 questions total), sanitizing all parenthetical drug name spoilers, implementing interactive Drag-and-Drop matching matrices with clean Roman numeral chips, and establishing strict sequential `questionNumberLabel: 'Question N'`.

**Architecture:** Refactor `src/data/exam2/diureticsModuleData.ts` from 3 synthetic clumped pages into 5 authentic review pages corresponding directly to the 5 pages of Dr. Al-Horani's review document. Transform Loop Diuretic property comparisons and Multiclass Diuretic comparisons into interactive `matching` questions with clean Roman numeral chips (`Structure I` to `Structure IV`). Restore authentic head-to-head comparison batteries on Page 5 (Triamterene vs Spironolactone, Aldosterone vs Spironolactone, Amiloride vs Eplerenone, Dyazide/Moduretic). Bump module version to `'2.0.0'` and implement Dexie & `localStorage` cache invalidation in `src/utils/moduleStorage.ts`.

**Tech Stack:** TypeScript, React, Tailwind CSS, Dexie (IndexedDB), Node test runner (`tsx`).

**Spec:** [`docs/superpowers/specs/2026-11-07-diuretics-module-benchmark-design.md`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/docs/superpowers/specs/2026-11-07-diuretics-module-benchmark-design.md)

---

## Global Constraints

- **Strict Source Adherence:** Build exclusively from Dr. Rami A. Al-Horani's question review PDF `scratch/exam_2_extracted/Anti-HTN review/3) Review for Antihypertensive Drugs I.pdf` (and markdown dump in `scratch/exam_2_review_text/3) Review for Antihypertensive Drugs I.md`), NEVER from lecture slide decks.
- **Zero Drug Name Spoilers:** Questions and multiple-choice options for structure-identification and comparison questions must NEVER include parenthetical drug names (e.g. `Most potent: Polythiazide (IV); Least potent: Chlorothiazide (I)` is strictly forbidden; must be `Most potent: Structure IV; Least potent: Structure I`).
- **Sequential Question Numbering:** Every question on every review page must carry an explicit, authentic `questionNumberLabel: 'Question N'` starting at `Question 1` for that page.
- **Drag & Drop Schema Compliance:** Matching questions must use `type: 'matching'`, define `options: ['Structure I', 'Structure II', 'Structure III', 'Structure IV']`, and provide `acceptedStructureIds` containing both Roman numerals (`'Structure I'`, `'I'`) and canonical structure IDs (`'furosemide'`, `'bumetanide'`, etc.).
- **5-Page Module Architecture:** The module must contain exactly 5 `ReviewPage` objects matching Dr. Al-Horani's 5 review pages:
  - Page 1: Thiazides & Foundational Concepts (Questions 1–9)
  - Page 2: Thiazide-like Diuretics & High-Ceiling Loop Intro (Questions 1–4)
  - Page 3: High-Ceiling Loop Diuretics SAR & Matching Matrix (Questions 1–9)
  - Page 4: Multiclass Comparative Matching Matrix & Efficacy (Questions 1–6)
  - Page 5: Head-to-Head Comparative Batteries & Combination Therapy (Questions 1–5)
- **Terminology:** Always refer to pages as **review pages**, never as "slides".
- **Preserve Existing Tests:** All existing regression test suites (`tests/respiratoryReviewModule.test.ts`, `tests/matchingAuditExam1And2.test.ts`) and full project build (`npm run build`) must pass without errors.

---

## Review Focus

1. **Drug name spoilers in multiple-choice stems or options:** Options must never disclose structure identities in parentheses (e.g. `Structure I (Chlorothiazide)`). Must strictly use clean Roman numerals (`Structure I`).
2. **Matching target and chip purity:** Drag-and-drop matching matrices on Page 3 and Page 4 must display clean Roman numeral chips (`Structure I` to `Structure IV`) and drop targets must not spoil answers in target labels.
3. **Sequential numbering per review page:** Questions must start at `Question 1` on each of the 5 review pages (e.g., Page 2 has Q1–Q4, Page 3 has Q1–Q9, Page 4 has Q1–Q6, Page 5 has Q1–Q5), eliminating continuous 1–33 numbering.
4. **Dual identifier acceptance in matching targets:** `acceptedStructureIds` in matching pairs must accept both Roman numeral variations (`'Structure I'`, `'I'`) and canonical structure IDs (`'furosemide'`, `'hydrochlorothiazide'`, etc.) to ensure seamless interactive behavior.
5. **Cache invalidation on client browsers:** Updating `getDefaultDiureticsModule()` to `version: '2.0.0'` must trigger automatic purging of stale 3-page cached versions in Dexie and `localStorage`.

---

## Task Structure

### Task 1: Automated Unit Test Harness for Diuretics Benchmark

**Files:**
- Create: `tests/diureticsReviewModule.test.ts`
- Test: `tests/diureticsReviewModule.test.ts`

**Interfaces:**
- Consumes: `getDefaultDiureticsModule` from `src/data/exam2/diureticsModuleData.ts`
- Produces: Automated assertions validating 5 pages, 33 total questions, sequential numbering, zero drug spoilers, matching matrix schemas, and valid chemical structures.

- [ ] **Step 1: Write test harness file `tests/diureticsReviewModule.test.ts`**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { getDefaultDiureticsModule } from '../src/data/exam2/diureticsModuleData';
import { AntiplateletQuestion } from '../src/types/reviewModule';

test('Diuretics review module benchmark audit', async (t) => {
  const mod = getDefaultDiureticsModule();

  await t.test('has correct module metadata and version', () => {
    assert.equal(mod.id, 'antihypertensives_1_mcp2');
    assert.equal(mod.version, '2.0.0');
    assert.equal(mod.pages.length, 5, 'Module must contain exactly 5 review pages matching the 5-page PDF');
  });

  await t.test('enforces sequential Question N labeling on every page', () => {
    const expectedPerPages = [9, 4, 9, 6, 5];
    assert.equal(mod.pages.length, expectedPerPages.length);

    mod.pages.forEach((page, pIdx) => {
      const questions: AntiplateletQuestion[] = [];
      if (page.sections) {
        page.sections.forEach((sec) => {
          if (sec.questions) questions.push(...sec.questions);
        });
      }
      assert.equal(
        questions.length,
        expectedPerPages[pIdx],
        `Page ${pIdx + 1} must have exactly ${expectedPerPages[pIdx]} questions, found ${questions.length}`
      );

      questions.forEach((q, qIdx) => {
        assert.equal(
          q.questionNumberLabel,
          `Question ${qIdx + 1}`,
          `Page ${pIdx + 1} question ${q.id} must have questionNumberLabel "Question ${qIdx + 1}"`
        );
      });
    });
  });

  await t.test('verifies zero parenthetical drug name spoilers in multiple-choice options', () => {
    mod.pages.forEach((page, pIdx) => {
      const questions: AntiplateletQuestion[] = [];
      page.sections?.forEach((sec) => sec.questions && questions.push(...sec.questions));

      questions.forEach((q) => {
        if (q.options) {
          q.options.forEach((opt) => {
            assert.doesNotMatch(
              opt,
              /Structure\s+[IVXLCDM]+\s*\([A-Za-z\- ]+\)/i,
              `Page ${pIdx + 1} Q${q.id} option must not leak drug name in parentheses: "${opt}"`
            );
            assert.doesNotMatch(
              opt,
              /[IVXLCDM]+\s*\([A-Za-z\- ]+\)/,
              `Page ${pIdx + 1} Q${q.id} option must not leak drug name in parentheses: "${opt}"`
            );
          });
        }
      });
    });
  });

  await t.test('verifies Drag & Drop matching matrix schemas on Pages 3 and 4', () => {
    const page3Questions: AntiplateletQuestion[] = [];
    mod.pages[2].sections?.forEach((sec) => sec.questions && page3Questions.push(...sec.questions));
    const p3Match = page3Questions.find((q) => q.type === 'matching');
    assert.ok(p3Match, 'Page 3 must contain a drag-and-drop matching question for Loop Diuretics properties');
    assert.equal(p3Match.questionNumberLabel, 'Question 1');
    assert.deepEqual(p3Match.options, ['Structure I', 'Structure II', 'Structure III', 'Structure IV']);
    assert.ok(p3Match.matchingPairs && p3Match.matchingPairs.length === 5);
    p3Match.matchingPairs.forEach((pair) => {
      assert.ok(pair.acceptedStructureIds && pair.acceptedStructureIds.length >= 2);
    });

    const page4Questions: AntiplateletQuestion[] = [];
    mod.pages[3].sections?.forEach((sec) => sec.questions && page4Questions.push(...sec.questions));
    const p4Match = page4Questions.find((q) => q.type === 'matching');
    assert.ok(p4Match, 'Page 4 must contain a drag-and-drop matching question for Multiclass Diuretics classification');
    assert.equal(p4Match.questionNumberLabel, 'Question 1');
    assert.deepEqual(p4Match.options, ['Structure I', 'Structure II', 'Structure III', 'Structure IV']);
    assert.ok(p4Match.matchingPairs && p4Match.matchingPairs.length === 4);
    p4Match.matchingPairs.forEach((pair) => {
      assert.ok(pair.acceptedStructureIds && pair.acceptedStructureIds.length >= 2);
    });
  });

  await t.test('verifies all structures displayed have valid SMILES and labels', () => {
    mod.pages.forEach((page, pIdx) => {
      page.sections?.forEach((sec) => {
        if (sec.structures) {
          sec.structures.forEach((st) => {
            assert.ok(st.id, `Structure on Page ${pIdx + 1} must have an id`);
            assert.ok(st.smiles || st.canonicalSmiles, `Structure ${st.id} on Page ${pIdx + 1} must have SMILES`);
          });
        }
      });
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails against current un-refactored module**

Run: `npx tsx tests/diureticsReviewModule.test.ts`
Expected: FAIL (assertion fails on `mod.version`, `mod.pages.length === 3` vs 5, and spoilers in options).

- [ ] **Step 3: Commit initial test harness**

```bash
git add tests/diureticsReviewModule.test.ts
git commit -m "test(diuretics): add automated benchmark audit test harness"
```

---

### Task 2: Refactor Review Page 1 — Thiazides & Foundational Concepts (Questions 1–9)

**Files:**
- Modify: `src/data/exam2/diureticsModuleData.ts:1-295`
- Test: `tests/diureticsReviewModule.test.ts`

**Interfaces:**
- Consumes: `DIURETICS_STRUCTURES.chlorothiazide`, `hydrochlorothiazide`, `trichlormethiazide`, `polythiazide`
- Produces: Sanitized Review Page 1 with sequential `Question 1` through `Question 9` and zero drug name spoilers.

- [ ] **Step 1: Sanitize Page 1 question stems, block instructions, and options in `src/data/exam2/diureticsModuleData.ts`**

Update Page 1 items:
1. `block_instructions`: replace `'Consider structures I (Chlorothiazide), II (Hydrochlorothiazide), III (Trichlormethiazide), and IV (Polythiazide)...'` with `'Consider chemical Structures I - IV to answer questions 3-9. Focus on modifications at the 3,4-double bond, position-3 substituent, and position-2 nitrogen.'`
2. `Question 3 (id: 303)`:
   - Stem: `'Which of the following best describes the chemical class of Structures I - IV?'` (remove parenthetical names).
3. `Question 4 (id: 304)`:
   - Stem: `'What is the mechanistic class of Structures I - IV?'` (remove parenthetical names).
4. `Question 5 (id: 305)`:
   - Options sanitized to clean Roman numerals:
     - `'Most potent: Structure IV; Least potent: Structure I'`
     - `'Most potent: Structure I; Least potent: Structure IV'`
     - `'Most potent: Structure II; Least potent: Structure III'`
     - `'Most potent: Structure III; Least potent: Structure I'`
5. `Question 6 (id: 306)`:
   - Options sanitized:
     - `'Longest: Structure IV; Shortest: Structure I & Structure II'`
     - `'Longest: Structure I; Shortest: Structure IV'`
     - `'Longest: Structure II; Shortest: Structure III'`
     - `'Longest: Structure III; Shortest: Structure II'`
6. `Question 7 (id: 307)`:
   - Options sanitized:
     - `'Structure IV > Structure III > Structure II > Structure I'`
     - `'Structure I > Structure II > Structure III > Structure IV'`
     - `'Structure II > Structure IV > Structure III > Structure I'`
     - `'Structure III > Structure IV > Structure II > Structure I'`
7. `Question 8 (id: 308)`:
   - Options sanitized:
     - `'Structure I <= Structure II < Structure III < Structure IV'`
     - `'Structure IV < Structure III < Structure II < Structure I'`
     - `'Structure II < Structure I < Structure IV < Structure III'`
     - `'Structure I < Structure IV < Structure II < Structure III'`
8. `Question 9 (id: 309)`:
   - Stem: `'Consider chemical Structures I - IV to determine whether each statement is true or false:'`
   - Statements a–f preserved with detailed medicinal chemistry explanations.

- [ ] **Step 2: Run test harness to verify Page 1 passes checks**

Run: `npx tsx tests/diureticsReviewModule.test.ts`
Expected: Page 1 spoiler assertions pass; remaining pages still fail.

- [ ] **Step 3: Commit Page 1 changes**

```bash
git add src/data/exam2/diureticsModuleData.ts
git commit -m "fix(diuretics): sanitize Review Page 1 thiazide SAR questions and remove spoilers"
```

---

### Task 3: Refactor Review Page 2 — Thiazide-like Diuretics & High-Ceiling Loop Intro (Questions 1–4)

**Files:**
- Modify: `src/data/exam2/diureticsModuleData.ts:296-420`
- Test: `tests/diureticsReviewModule.test.ts`

**Interfaces:**
- Consumes: `DIURETICS_STRUCTURES.metolazone`, `chlorthalidone`, `diazoxide`, `furosemide`, `bumetanide`
- Produces: Authentic Review Page 2 containing exactly Questions 10–13 from the PDF, re-numbered sequentially as `Question 1` through `Question 4`.

- [ ] **Step 1: Restructure Page 2 to match Slide 2 of Dr. Al-Horani's Review PDF**

1. Page 2 title & metadata:
   - `pageNumber: 2`
   - `title: 'Thiazide-like Diuretics & Loop Diuretics Introduction'`
   - `subtitle: 'Metolazone, Chlorthalidone, Diazoxide, and Aminobenzoic Acid Loop Diuretic Pharmacophores'`
2. Section 1: Thiazide-like Diuretics & Diazoxide
   - `sectionTitle: 'Thiazide-like Diuretics: Metolazone vs Chlorthalidone & Diazoxide'`
   - `block_instructions: 'Consider chemical structures I (Metolazone), II (Chlorthalidone), and Diazoxide to answer questions 1-2.'`
   - `structures`: `[DIURETICS_STRUCTURES.metolazone, DIURETICS_STRUCTURES.chlorthalidone, EXAM_2_STRUCTURES.diazoxide]`
   - `Question 1 (id: 310)`:
     - `questionNumberLabel: 'Question 1'`
     - `type: 'sub-statements'`
     - Metolazone (Drug I) vs Chlorthalidone (Drug II) True/False battery (items a–e).
   - `Question 2 (id: 311)`:
     - `questionNumberLabel: 'Question 2'`
     - `type: 'multiple-choice'`
     - Molecule lacking substantial diuretic activity (Diazoxide).
3. Section 2: Loop Diuretics Introduction
   - `sectionTitle: 'High-Ceiling Loop Diuretics: Prototype Chemical & Mechanistic Classification'`
   - `block_instructions: 'Consider chemical structures I (Furosemide) and II (Bumetanide) to answer questions 3-4.'`
   - `structures`: `[DIURETICS_STRUCTURES.furosemide, DIURETICS_STRUCTURES.bumetanide]`
   - `Question 3 (id: 312)`:
     - `questionNumberLabel: 'Question 3'`
     - `type: 'multiple-choice'`
     - Chemical class of Loop Diuretics I & II (Sulfamoyl anthranilic acid / aminobenzoic acid).
   - `Question 4 (id: 313)`:
     - `questionNumberLabel: 'Question 4'`
     - `type: 'multiple-choice'`
     - Mechanistic class of Loop Diuretics (Inhibition of Na+/K+/2Cl- symporter NKCC2 in thick ascending limb of Henle).

- [ ] **Step 2: Run test harness to verify Page 2 assertions**

Run: `npx tsx tests/diureticsReviewModule.test.ts`

- [ ] **Step 3: Commit Page 2 changes**

```bash
git add src/data/exam2/diureticsModuleData.ts
git commit -m "feat(diuretics): restructure Review Page 2 with thiazide-like and loop intro questions"
```

---

### Task 4: Refactor Review Page 3 — High-Ceiling Loop Diuretics SAR & Landmark Matching (Questions 1–9)

**Files:**
- Modify: `src/data/exam2/diureticsModuleData.ts`
- Test: `tests/diureticsReviewModule.test.ts`

**Interfaces:**
- Consumes: `DIURETICS_STRUCTURES.furosemide`, `bumetanide`, `torsemide`, `ethacrynic_acid`
- Produces: Authentic Review Page 3 with interactive Drag-and-Drop matching matrix for landmark properties and sequential `Question 1` through `Question 9`.

- [ ] **Step 1: Construct Review Page 3 with Drag & Drop Matching Matrix**

1. Page 3 title & metadata:
   - `pageNumber: 3`
   - `title: 'High-Ceiling Loop Diuretics SAR & Landmark Properties'`
   - `subtitle: 'Furosemide, Bumetanide, Torsemide, and Ethacrynic Acid: Potency, Duration, Ototoxicity & Sulfa Allergy'`
2. Structures displayed:
   - `Structure I`: Furosemide
   - `Structure II`: Bumetanide
   - `Structure III`: Torsemide
   - `Structure IV`: Ethacrynic Acid
3. Questions:
   - `Question 1 (id: 314)`:
     - `questionNumberLabel: 'Question 1'`
     - `type: 'matching'`
     - `title: 'High-Ceiling Loop Diuretics Landmark Properties Matching'`
     - `prompt: 'Drag each chemical structure (Structure I - Structure IV) to its matching medicinal chemistry or clinical pharmacology property:'`
     - `options: ['Structure I', 'Structure II', 'Structure III', 'Structure IV']`
     - `matchingPairs`:
       1. *Most potent loop diuretic congener (~40x furosemide)* $\rightarrow$ `Structure II` (`acceptedStructureIds: ['Structure II', 'II', 'bumetanide']`)
       2. *Sulfonylurea congener with longest duration of action and negligible ototoxicity* $\rightarrow$ `Structure III` (`acceptedStructureIds: ['Structure III', 'III', 'torsemide']`)
       3. *Phenoxyacetic acid derivative / Michael acceptor lacking a sulfonamide group (safe in severe sulfa allergy)* $\rightarrow$ `Structure IV` (`acceptedStructureIds: ['Structure IV', 'IV', 'ethacrynic_acid']`)
       4. *Amphoteric anthranilic acid prototype bearing both a carboxylic acid and secondary amine* $\rightarrow$ `Structure I` (`acceptedStructureIds: ['Structure I', 'I', 'furosemide']`)
       5. *Irreversible alkylating diuretic associated with highest risk of permanent ototoxicity* $\rightarrow$ `Structure IV` (`acceptedStructureIds: ['Structure IV', 'IV', 'ethacrynic_acid']`)
   - `Question 2 (id: 315)`: Potency comparison of Structures I–III (`questionNumberLabel: 'Question 2'`, clean Roman numerals).
   - `Question 3 (id: 316)`: Diuretic potency ranking (`questionNumberLabel: 'Question 3'`: `Structure II > Structure III > Structure I`).
   - `Question 4 (id: 317)`: Longest duration of action (`questionNumberLabel: 'Question 4'`: `Structure III`).
   - `Question 5 (id: 318)`: Irreversible diuretic mechanism (`questionNumberLabel: 'Question 5'`: `Structure IV` via Michael addition).
   - `Question 6 (id: 319)`: Diuretic for patients with severe sulfa allergy (`questionNumberLabel: 'Question 6'`: `Structure IV`).
   - `Question 7 (id: 320)`: Highest ototoxicity risk (`questionNumberLabel: 'Question 7'`: `Structure IV`).
   - `Question 8 (id: 321)`: Loop Diuretics True/False Battery (5 items a–e, `questionNumberLabel: 'Question 8'`).
   - `Question 9 (id: 322)`: Simplest form of loop diuretics (`questionNumberLabel: 'Question 9'`, 5-sulfamoylamino benzoic acid / anthranilic acid core).

- [ ] **Step 2: Run test harness to verify Page 3 assertions**

Run: `npx tsx tests/diureticsReviewModule.test.ts`

- [ ] **Step 3: Commit Page 3 changes**

```bash
git add src/data/exam2/diureticsModuleData.ts
git commit -m "feat(diuretics): construct Review Page 3 with loop diuretic SAR and Drag & Drop matching matrix"
```

---

### Task 5: Refactor Review Page 4 — Multiclass Comparative Matching Matrix & Efficacy (Questions 1–6)

**Files:**
- Modify: `src/data/exam2/diureticsModuleData.ts`
- Test: `tests/diureticsReviewModule.test.ts`

**Interfaces:**
- Consumes: `DIURETICS_STRUCTURES.furosemide`, `hydrochlorothiazide`, `spironolactone`, `triamterene`
- Produces: Authentic Review Page 4 with interactive Drag-and-Drop matching matrix for multiclass comparison and sequential `Question 1` through `Question 6`.

- [ ] **Step 1: Construct Review Page 4 with Multiclass Matching Matrix**

1. Page 4 title & metadata:
   - `pageNumber: 4`
   - `title: 'Multiclass Diuretic Comparative Pharmacology & Efficacy'`
   - `subtitle: 'Loop, Thiazide, Aldosterone Antagonist, and ENaC Blocker: Mechanism, Acid/Base, and Fractional Sodium Excretion'`
2. Structures displayed:
   - `Structure I`: Furosemide (Loop Diuretic)
   - `Structure II`: Hydrochlorothiazide (Thiazide Diuretic)
   - `Structure III`: Spironolactone (Mineralocorticoid Receptor Antagonist)
   - `Structure IV`: Triamterene (ENaC Blocker)
3. Questions:
   - `Question 1 (id: 323)`:
     - `questionNumberLabel: 'Question 1'`
     - `type: 'matching'`
     - `title: 'Multiclass Diuretic Pharmacological Classification Matching'`
     - `prompt: 'Drag each chemical structure (Structure I - Structure IV) to its matching pharmacological and tubular classification:'`
     - `options: ['Structure I', 'Structure II', 'Structure III', 'Structure IV']`
     - `matchingPairs`:
       1. *High-ceiling loop diuretic inhibiting the Na+/K+/2Cl- (NKCC2) symporter in the thick ascending limb* $\rightarrow$ `Structure I` (`acceptedStructureIds: ['Structure I', 'I', 'furosemide']`)
       2. *Thiazide diuretic inhibiting the electroneutral Na+/Cl- (NCC) cotransporter in the distal convoluted tubule* $\rightarrow$ `Structure II` (`acceptedStructureIds: ['Structure II', 'II', 'hydrochlorothiazide']`)
       3. *Steroidal mineralocorticoid receptor antagonist converted to active canrenone metabolite* $\rightarrow$ `Structure III` (`acceptedStructureIds: ['Structure III', 'III', 'spironolactone']`)
       4. *Pteridine-based basic ENaC channel blocker combined with thiazides to prevent hypokalemia* $\rightarrow$ `Structure IV` (`acceptedStructureIds: ['Structure IV', 'IV', 'triamterene']`)
   - `Question 2 (id: 324)`: Potassium-Sparing Diuretic with Active Metabolite (`questionNumberLabel: 'Question 2'`: `Structure III`).
   - `Question 3 (id: 325)`: Ascending Limb of Henle Target (`questionNumberLabel: 'Question 3'`: `Structure I`).
   - `Question 4 (id: 326)`: Acidic vs Basic Diuretics (`questionNumberLabel: 'Question 4'`: Acidic: `Structure I` & `Structure II`; Basic: `Structure IV`; Neutral: `Structure III`).
   - `Question 5 (id: 327)`: Combination Partners to Counter Potassium Loss (`questionNumberLabel: 'Question 5'`: `Structure III` and `Structure IV` combined with `Structure II`).
   - `Question 6 (id: 328)`: Diuretic Efficacy (% Fractional Sodium Excretion) Ranking (`questionNumberLabel: 'Question 6'`: `Structure I` [20–25%] > `Structure II` [5–8%] > `Structure III` / `Structure IV` [2–3%]).

- [ ] **Step 2: Run test harness to verify Page 4 assertions**

Run: `npx tsx tests/diureticsReviewModule.test.ts`

- [ ] **Step 3: Commit Page 4 changes**

```bash
git add src/data/exam2/diureticsModuleData.ts
git commit -m "feat(diuretics): construct Review Page 4 with multiclass comparative Drag & Drop matching matrix"
```

---

### Task 6: Refactor Review Page 5 — Head-to-Head Comparative Batteries & Combination Therapy (Questions 1–5)

**Files:**
- Modify: `src/data/exam2/diureticsModuleData.ts`
- Modify: `src/data/exam2/exam2Structures.ts` (export aldosterone or ensure availability)
- Test: `tests/diureticsReviewModule.test.ts`

**Interfaces:**
- Consumes: `DIURETICS_STRUCTURES.triamterene`, `spironolactone`, `amiloride`, `eplerenone`, `hydrochlorothiazide`, and `ALDOSTERONE_STRUCTURE`
- Produces: Authentic Review Page 5 containing the 4 head-to-head comparative True/False batteries and duration justification (Questions 29–33 from PDF, re-numbered `Question 1` through `Question 5`).

- [ ] **Step 1: Ensure `aldosterone` is exported in `DIURETICS_STRUCTURES` or `exam2Structures.ts`**

Import `ALDOSTERONE_STRUCTURE` from `../respiratoryReviewModuleData` into `src/data/exam2/exam2Structures.ts` and add `aldosterone: ALDOSTERONE_STRUCTURE` to `EXAM_2_STRUCTURES` and `DIURETICS_STRUCTURES`.

- [ ] **Step 2: Construct Review Page 5 in `src/data/exam2/diureticsModuleData.ts`**

1. Page 5 title & metadata:
   - `pageNumber: 5`
   - `title: 'Head-to-Head Comparative Batteries & Combination Therapy'`
   - `subtitle: 'Triamterene vs Spironolactone, Aldosterone vs Spironolactone, Amiloride vs Eplerenone, and Dyazide Synergy'`
2. Questions:
   - `Question 1 (id: 329)`:
     - `questionNumberLabel: 'Question 1'`
     - `type: 'sub-statements'`
     - Structures: `[DIURETICS_STRUCTURES.triamterene, DIURETICS_STRUCTURES.spironolactone]`
     - Triamterene (Drug I) vs Spironolactone (Drug II) True/False battery (items a–e from PDF Q29).
   - `Question 2 (id: 330)`:
     - `questionNumberLabel: 'Question 2'`
     - `type: 'sub-statements'`
     - Structures: `[DIURETICS_STRUCTURES.aldosterone, DIURETICS_STRUCTURES.spironolactone]`
     - Aldosterone (Molecule I) vs Spironolactone (Molecule II) True/False battery (items a–e from PDF Q30).
   - `Question 3 (id: 331)`:
     - `questionNumberLabel: 'Question 3'`
     - `type: 'sub-statements'`
     - Structures: `[DIURETICS_STRUCTURES.amiloride, DIURETICS_STRUCTURES.eplerenone]`
     - Amiloride (Drug I) vs Eplerenone (Drug II) True/False battery (items a–f from PDF Q31 & Slide 5).
   - `Question 4 (id: 332)`:
     - `questionNumberLabel: 'Question 4'`
     - `type: 'multiple-choice'`
     - Molecular justification for long duration of action despite short elimination half-lives (genomic latency of mineralocorticoid receptor transcription regulation + active metabolites + high tissue/protein binding).
   - `Question 5 (id: 333)`:
     - `questionNumberLabel: 'Question 5'`
     - `type: 'sub-statements'`
     - Structures: `[DIURETICS_STRUCTURES.triamterene, DIURETICS_STRUCTURES.hydrochlorothiazide]`
     - Dyazide (Triamterene + HCTZ) and Moduretic (Amiloride + HCTZ) True/False battery (items a–g from PDF Q33).

- [ ] **Step 3: Run test harness to verify Page 5 assertions**

Run: `npx tsx tests/diureticsReviewModule.test.ts`

- [ ] **Step 4: Commit Page 5 changes**

```bash
git add src/data/exam2/exam2Structures.ts src/data/exam2/diureticsModuleData.ts
git commit -m "feat(diuretics): construct Review Page 5 with authentic head-to-head comparative batteries"
```

---

### Task 7: Module Version Bump & Browser Cache Invalidation

**Files:**
- Modify: `src/data/exam2/diureticsModuleData.ts`
- Modify: `src/utils/moduleStorage.ts`
- Test: `tests/diureticsReviewModule.test.ts`

**Interfaces:**
- Consumes: `getDefaultDiureticsModule`
- Produces: Version `'2.0.0'` in module definition and automated cache invalidation in `loadAllReviewModules()` and `initModuleStorageFromDexie()`.

- [ ] **Step 1: Set `version: '2.0.0'` in `getDefaultDiureticsModule()`**

In `src/data/exam2/diureticsModuleData.ts`:
```ts
export function getDefaultDiureticsModule(): ReviewModule {
  return {
    id: 'antihypertensives_1_mcp2',
    version: '2.0.0',
    examId: 'exam_2',
    examTitle: 'Exam 2: Antihypertensives & Lipids',
    title: 'Review for Antihypertensive Drugs I (Diuretics)',
    subtitle: 'Thiazides, Loop Diuretics, Potassium-Sparing Diuretics & Combinations',
    course: 'Medicinal Chemistry (MCP II)',
    semester: 'Fall 2026',
    code: 'Exam 2',
    isBuiltIn: true,
    createdAt: '2026-10-14',
    chemicalStructures: Object.values(DIURETICS_STRUCTURES),
    pages: diureticsPages,
  };
}
```

- [ ] **Step 2: Add migration check in `src/utils/moduleStorage.ts`**

In `loadAllReviewModules()` and `initModuleStorageFromDexie()`:
Ensure that any cached override for `'antihypertensives_1_mcp2'` whose `version !== '2.0.0'` or `(pages || []).length < 5` is purged from `localStorage` and Dexie and replaced with the fresh 5-page module.

- [ ] **Step 3: Run test harness to verify version and pages**

Run: `npx tsx tests/diureticsReviewModule.test.ts`
Expected: ALL PASS.

- [ ] **Step 4: Commit version bump and cache invalidation**

```bash
git add src/data/exam2/diureticsModuleData.ts src/utils/moduleStorage.ts
git commit -m "chore(diuretics): bump module version to 2.0.0 with automatic cache migration"
```

---

### Task 8: End-to-End Regression Suite & TypeScript Build Verification

**Files:**
- Modify: `tests/matchingAuditExam1And2.test.ts`
- Test: `tests/diureticsReviewModule.test.ts`
- Test: `tests/matchingAuditExam1And2.test.ts`
- Test: `tests/respiratoryReviewModule.test.ts`

- [ ] **Step 1: Add Diuretics audit test case to `tests/matchingAuditExam1And2.test.ts`**

Add a test case verifying Diuretics matching questions meet all target bullet and Roman label conventions:
```ts
test('audits Exam 2 Diuretics Review matching questions for clean target bullets and Roman labels', () => {
  const mod = getDefaultDiureticsModule();
  const allQuestions = getAllQuestionsFromPages(mod.pages);
  const matchingQuestions = allQuestions.filter(
    (q) => q.type === 'matching' && q.matchingTargets && q.matchingTargets.length > 0
  );

  assert.ok(
    matchingQuestions.length >= 2,
    `Expected at least 2 matching questions in Diuretics, found ${matchingQuestions.length}`
  );
  // Verify target bullets and structure labels
});
```

- [ ] **Step 2: Run all test suites**

Run: `npx tsx tests/diureticsReviewModule.test.ts`
Run: `npx tsx tests/matchingAuditExam1And2.test.ts`
Run: `npx tsx tests/respiratoryReviewModule.test.ts`
Expected: ALL PASS.

- [ ] **Step 3: Run full TypeScript project build**

Run: `npm run build`
Expected: Build passes with exit code 0 and zero TypeScript errors.

- [ ] **Step 4: Commit verification updates**

```bash
git add tests/matchingAuditExam1And2.test.ts
git commit -m "test(diuretics): add Diuretics matching questions to comprehensive audit suite"
```
