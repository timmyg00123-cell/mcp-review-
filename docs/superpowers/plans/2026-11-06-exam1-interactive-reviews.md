# Exam 1 Interactive Review Modules & Flashcard Retry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the uploaded Exam 1 review slide decks (`2)_Review_for_Renal_Drugs.pdf` and `1)_Review_for_Respiratory_Drugs.pdf`) into two first-class interactive review modules (`renal_review_mcp2` and `respiratory_review_mcp2`) matching Exam 3's slide workbench architecture with 2D chemical structures, Roman numeral matching, and interactive True/False sub-statement cards, while upgrading the flashcard deck with dynamic exam-aware filtering and a prominent "Retry Full Deck" completion button.

**Architecture:** Model the two review modules as paginated `ReviewModule` data structures (`src/data/renalReviewModuleData.ts` and `src/data/respiratoryReviewModuleData.ts`), rendered by `App.tsx` and `DocumentQuestionItem`. Upgrade `StructureFlashcardDeck.tsx` to dynamically derive module filters from the active deck and add an in-memory session restart handler ("Retry Full Deck") that preserves persisted SRS statistics in `localStorage`. Configure Exam 1 in `examTypes.ts` to feature strictly these two 1:1 review modules.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, SmilesDrawer, Vitest, Lucide React.

**Spec:** `docs/superpowers/specs/2026-11-06-exam1-interactive-reviews-design.md`

## Global Constraints
- Must pass `npx tsc --noEmit` under strict TypeScript checks with 0 errors.
- Must compile cleanly with `npm run build`.
- Must preserve all existing `localStorage` keys and spaced-repetition progress without regressions.
- No generic 4-choice questions for review slides: all questions must use `type: 'matching'` or `type: 'sub-statements'` with individualized medchem explanations.
- Exam 1 must contain strictly and only the 2 review modules (`renal_review_mcp2` and `respiratory_review_mcp2`).

## Review Focus
1. **Dynamic Filter Fallback:** When flashcards contain module IDs other than Exam 3 (e.g. `renal_review_mcp2`), ensure cards are never hidden or omitted when filters are active.
2. **Retry Deck State Preservation:** Ensure clicking "Retry Full Deck" resets the in-memory session queue and position index to 0 without wiping persisted `localStorage` SRS intervals or struggle diagnostics.
3. **Sub-statement Grading:** Ensure True/False sub-statements evaluate boolean values correctly (`isCorrect: true/false`) and display rationales immediately upon interaction.
4. **Matching Target Validation:** Ensure matching questions accept both Roman numerals (e.g. `'I'`, `'II'`) and canonical entity keys (e.g. `'amiloride'`) in `acceptedStructureIds`.
5. **Flashcard Deck Aggregation:** Ensure `loadExamFlashcards('exam_1')` accurately extracts unique chemical structures with SMILES, 2D coordinates, pharmacophores, and clinical SAR notes from both review modules.

---

### Task 1: Dynamic Flashcard Module Filtering & "Retry Full Deck" Button

**Files:**
- Modify: `src/components/StructureFlashcardDeck.tsx:20-160` & `src/components/StructureFlashcardDeck.tsx:550-610`
- Test: `tests/structureFlashcardDeck.test.tsx`

**Steps:**
- [ ] Write failing test in `tests/structureFlashcardDeck.test.tsx`:
  - Test 1: Given a completed deck session, the "Retry Full Deck" button is visible and clicking it resets `currentIndex` to 0, resets `isFlipped` to false, and reloads the active queue without mutating persisted cards.
  - Test 2: Given flashcards from Exam 1 (e.g. `moduleIds: ['renal_review_mcp2']`), module filtering derives active filter pills dynamically and displays Exam 1 cards without filtering them out.
- [ ] Run test with `npx vitest run tests/structureFlashcardDeck.test.tsx` to verify failure.
- [ ] In `src/components/StructureFlashcardDeck.tsx`:
  - Replace the hardcoded `ModuleFilterState` with a dynamic `Record<string, boolean>` derived from unique `card.moduleIds` or category tags across `cards`. Provide readable labels (e.g. "Renal", "Respiratory", "Antiarrhythmics", "Heart Failure").
  - Add `handleRestartDeck`:
    ```tsx
    const handleRestartDeck = useCallback(() => {
      const initialized = applyProgressToCards(cards);
      const filtered = initialized.filter((c) => !c.isSuspended && cardMatchesModuleFilter(c, moduleFilter));
      setActiveQueue(filtered);
      setCurrentIndex(0);
      setIsFlipped(false);
    }, [cards, moduleFilter]);
    ```
  - In the session complete screen (`activeQueue.length === 0`), add the "Retry Full Deck" button with `<RotateCcw className="w-4 h-4" />` alongside "View Struggle Diagnostics".
- [ ] Re-run test with `npx vitest run tests/structureFlashcardDeck.test.tsx` to verify all pass.
- [ ] Commit changes: `git commit -m "feat: add retry deck button and dynamic exam-aware module filtering to flashcards"`.

---

### Task 2: Author Renal Review Module Data (`renalReviewModuleData.ts`)

**Files:**
- Create: `src/data/renalReviewModuleData.ts`
- Test: `tests/renalReviewModule.test.ts`

**Steps:**
- [ ] Write failing test in `tests/renalReviewModule.test.ts`:
  - Verifies `getDefaultRenalReviewModule()` returns a valid `ReviewModule` with `id: 'renal_review_mcp2'`.
  - Verifies module has 3 pages matching the 3 slides of `2)_Review_for_Renal_Drugs.pdf`.
  - Verifies Page 1 contains structures I–V (Amiloride, Furosemide, Hydrochlorothiazide, Acetazolamide, Mannitol) and questions Q1–Q14 (chemical class matching, acid/base, site of action, sulfa allergy, osmotic PK).
  - Verifies Page 2 contains structures (Mannitol, Isosorbide/Urea, Tolvaptan, Peptides) and Q15–Q18 (diuretic vs non-diuretic, vasopressin vs desmopressin).
  - Verifies Page 3 contains nephron region matching (Diuretics 1–4 to Regions a–e).
  - Verifies all sub-statements have non-empty text, boolean `isCorrect`, and detailed explanations.
- [ ] Run test with `npx vitest run tests/renalReviewModule.test.ts` to confirm failure.
- [ ] Implement `src/data/renalReviewModuleData.ts`:
  - Define chemical structures with canonical SMILES, 2D coordinates, molecular formulas, MW, logP, and pharmacophores:
    - `AMILORIDE_STRUCTURE` (Structure I: Pyrazinopyrimidine derivative / ENaC inhibitor, basic guanidine moiety)
    - `FUROSEMIDE_STRUCTURE` (Structure II: Sulfamoyl anthranilic acid / Loop diuretic, carboxylic acid + sulfamoyl group)
    - `HYDROCHLOROTHIAZIDE_STRUCTURE` (Structure III: Benzothiadiazine 1,1-dioxide / Thiazide diuretic)
    - `ACETAZOLAMIDE_STRUCTURE` (Structure IV: Thiadiazole sulfonamide / Carbonic anhydrase inhibitor)
    - `MANNITOL_STRUCTURE` (Structure V: Aliphatic polyalcohol / Osmotic diuretic)
    - `ISOSORBIDE_STRUCTURE` & `TOLVAPTAN_STRUCTURE` (V2 antagonist)
    - `VASOPRESSIN_STRUCTURE` & `DESMOPRESSIN_STRUCTURE` (1-deamino-8-D-arginine)
  - Define `ReviewPage[]` with `ReviewSection[]` and `ReviewQuestion[]`:
    - Slide 1: Q1 (matching chemical class), Q2 (acid/base classification), Q3 (mechanistic class), Q4 (nephron site), Q5–Q11 (sub-statements for fastest onset, diuretic efficacy, glaucoma, sulfa cross-reactivity), Q12–Q14 (osmotic diuretics & PK lack of tubular reabsorption).
    - Slide 2: Q15–Q17 (non-diuretic molecule, osmotic diuretic, CA inhibitor), Q18 (Vasopressin vs Desmopressin vs Oxytocin sub-statement comparisons).
    - Slide 3: Q19 (Nephron site matching: Region a = Proximal tubule, Region b = Thick ascending limb, Region c = Distal convoluted tubule, Region d = Collecting duct, Region e = Glomerulus).
- [ ] Re-run test with `npx vitest run tests/renalReviewModule.test.ts` to confirm all pass.
- [ ] Commit changes: `git commit -m "feat: implement renal review interactive module data from slide deck"`.

---

### Task 3: Author Respiratory Review Module Data (`respiratoryReviewModuleData.ts`)

**Files:**
- Create: `src/data/respiratoryReviewModuleData.ts`
- Test: `tests/respiratoryReviewModule.test.ts`

**Steps:**
- [ ] Write failing test in `tests/respiratoryReviewModule.test.ts`:
  - Verifies `getDefaultRespiratoryReviewModule()` returns a valid `ReviewModule` with `id: 'respiratory_review_mcp2'`.
  - Verifies module has 9 pages matching the 9 slides of `1)_Review_for_Respiratory_Drugs.pdf`.
  - Verifies Slide 1 contains combination bronchodilators (Umeclidinium, Fluticasone furoate, Vilanterol, Olodaterol, Tiotropium).
  - Verifies Slide 2 contains Adrenergic Agonists SAR (Structures I–VII: Epinephrine, Isoproterenol, Albuterol, Levalbuterol, Salmeterol, Formoterol, Indacaterol/Vilanterol).
  - Verifies Slide 3 contains Anticholinergics (Structures I–V: Ipratropium, Tiotropium, Aclidinium, Umeclidinium, Glycopyrrolate) and Hydrocortisone prototype.
  - Verifies Slide 4 contains Hydrocortisone biosynthesis enzymes/stereospecificity & glucocorticoid receptor domains/processes.
  - Verifies Slide 5 contains Hydrocortisone metabolism pathways (11b-HSD1/2, reduction) and glucocorticoid potency ranking.
  - Verifies Slide 6 contains Prodrugs/soft steroids and 7 core True/False sub-statements.
  - Verifies Slide 7 contains Metabolic activations and paired Theophylline (Drug A) vs Roflumilast (Drug B) comparisons.
  - Verifies Slide 8 contains Leukotriene cascade (5-LOX, FLAP, CysLT1) matching and comparisons.
  - Verifies Slide 9 contains paired True/False comparative vignettes.
- [ ] Run test with `npx vitest run tests/respiratoryReviewModule.test.ts` to confirm failure.
- [ ] Implement `src/data/respiratoryReviewModuleData.ts`:
  - Define chemical structures with accurate SMILES, 2D coordinates, pharmacophores, and SAR tags:
    - Adrenergic agonists: Epinephrine, Isoproterenol, Albuterol, Levalbuterol, Salmeterol, Formoterol, Indacaterol, Olodaterol, Vilanterol.
    - Anticholinergics: Ipratropium bromide, Tiotropium bromide, Aclidinium bromide, Umeclidinium, Glycopyrrolate.
    - Corticosteroids: Hydrocortisone, Cortisone, Prednisone, Prednisolone, Methylprednisolone, Dexamethasone, Triamcinolone acetonide, Fluticasone propionate/furoate, Budesonide, Ciclesonide, Beclomethasone dipropionate, Mometasone furoate.
    - Methylxanthines & PDE4: Theophylline, Roflumilast.
    - Leukotriene modulators: Zileuton, Montelukast, Zafirlukast.
  - Structure all 9 review pages with `ReviewSection[]`, `matchingTargets`, and `subStatements`.
- [ ] Re-run test with `npx vitest run tests/respiratoryReviewModule.test.ts` to confirm all pass.
- [ ] Commit changes: `git commit -m "feat: implement respiratory review interactive module data from slide deck"`.

---

### Task 4: Exam 1 Definition & Module Storage Registration

**Files:**
- Modify: `src/types/examTypes.ts:15-35`
- Modify: `src/utils/moduleStorage.ts:1-250`
- Test: `tests/exam1ReviewRegistration.test.ts`

**Steps:**
- [ ] Write failing test in `tests/exam1ReviewRegistration.test.ts`:
  - Verifies `EXAM_DEFINITIONS` for `exam_1` has `builtInModuleIds` equal to `['renal_review_mcp2', 'respiratory_review_mcp2']`.
  - Verifies `defaultModuleId` is `'renal_review_mcp2'`.
  - Verifies `getModuleExamId` correctly maps both review module IDs to `'exam_1'`.
  - Verifies `getBuiltInModule('renal_review_mcp2')` and `getBuiltInModule('respiratory_review_mcp2')` return complete modules.
  - Verifies `loadExamFlashcards('exam_1')` loads flashcards from both review modules with non-empty structures.
- [ ] Run test with `npx vitest run tests/exam1ReviewRegistration.test.ts` to verify failure.
- [ ] In `src/types/examTypes.ts`:
  - Update `exam_1` definition to strictly include `['renal_review_mcp2', 'respiratory_review_mcp2']`.
  - Update description to "Interactive slide-by-slide reviews for Renal and Respiratory medicinal chemistry."
  - Ensure `getModuleExamId` includes `renal_review_mcp2` and `respiratory_review_mcp2`.
- [ ] In `src/utils/moduleStorage.ts`:
  - Import `getDefaultRenalReviewModule` and `getDefaultRespiratoryReviewModule`.
  - Register both modules in `BUILT_IN_MODULES` and `getBuiltInModule`.
  - Ensure `loadExamFlashcards` extracts chemical structures from these review modules.
- [ ] Re-run test with `npx vitest run tests/exam1ReviewRegistration.test.ts` to verify all pass.
- [ ] Commit changes: `git commit -m "feat: register renal and respiratory review modules under exam 1"`.

---

### Task 5: End-to-End Build, Typecheck & Verification

**Files:**
- Test: All test suites (`vitest`)
- Build: `npm run build`
- Typecheck: `npx tsc --noEmit`

**Steps:**
- [ ] Run `npx tsc --noEmit` and resolve any strict typing issues.
- [ ] Run all test suites with `npx vitest run` to ensure zero regressions across all exams.
- [ ] Run production build with `npm run build` and ensure exit code 0.
- [ ] Test the running application on `http://localhost:3000`:
  - Switch to Exam 1 via the exam selector.
  - Verify only the 2 review modules appear in the module list: "Review for Renal Drugs" and "Review for Respiratory Drugs".
  - Open "Review for Renal Drugs": verify 3 slides, structure panels I–V, matching matrix, and sub-statements.
  - Open "Review for Respiratory Drugs": verify 9 slides with all structures, diagrams, and True/False questions.
  - Open Flashcard mode for Exam 1: verify cards load, toggle module filter pills, complete a deck, and click "Retry Full Deck" to confirm instant restart.
- [ ] Commit any final polishes: `git commit -m "chore: verify exam 1 interactive reviews and flashcard retry end-to-end"`.
