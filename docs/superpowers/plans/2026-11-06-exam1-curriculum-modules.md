# Exam 1 Curriculum Modules & Cumulative Practice Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement all 3 Exam 1 curriculum review modules (Renal Drugs, Respiratory Bronchodilators, Respiratory Anti-Inflammatories), chemical structures, clinical pharmacology profiles, and the 16-question cumulative practice test, wired into the multi-exam switcher.

**Architecture:** Create `src/data/exam1/` containing module data, landmark chemical structures, and cumulative questions mirroring the Exam 2 pattern. Wire into `src/utils/moduleStorage.ts`, `src/types/examTypes.ts`, `src/utils/clinicalPharmacologyDictionary.ts`, and `src/data/cumulativeQuizData.ts`. Scope-isolate flashcards, question bank, and diagnostics to `exam_1`.

**Tech Stack:** TypeScript, React 19, Tailwind CSS v4, Dexie DB, Node test runner (`node:assert/strict`), Vite.

**Spec:** `docs/superpowers/specs/2026-11-06-exam1-curriculum-modules.md`

## Global Constraints
- Target exam ID: `exam_1`.
- Module IDs: `renal_drugs_mcp2`, `respiratory_bronchodilators_mcp2`, `respiratory_antiinflammatories_mcp2`.
- Total curriculum questions: exactly 96 questions with non-overlapping ID ranges (101–130, 141–172, 181–214).
- Cumulative practice test: exactly 16 cross-curriculum clinical deduction questions (Types A, B, C, D).
- Preserves existing Exam 2 and Exam 3 modules without any modifications to question content or numbering.
- Zero TypeScript compilation errors (`npx tsc --noEmit`).

## Review Focus
- Question ID collisions: IDs 101–214 must never collide across modules or with Exam 2/3.
- Chemical structure completeness: All structures must feature valid PubChem CIDs, non-empty SMILES, MW, logP, target, and SAR notes.
- Clinical pharmacology lookup: `resolveClinicalPharmacology` must return valid non-fallback profiles for key Exam 1 drugs (*theophylline, montelukast, albuterol, tiotropium, hydrocortisone, prednisone, acetazolamide, furosemide, vasopressin*).
- Scope isolation: When `activeExamId === 'exam_1'`, flashcards deck only contains Exam 1 structures, question bank only contains Exam 1 questions, and module list only displays Exam 1 modules.

---

### Task 1: Chemical Structures & Clinical Pharmacology Dictionary for Exam 1

**Files:**
- Create: `src/data/exam1/exam1Structures.ts`
- Modify: `src/utils/clinicalPharmacologyDictionary.ts`
- Test: `tests/exam1StructuresAndClinPharm.test.ts`

- [ ] Write the failing test `tests/exam1StructuresAndClinPharm.test.ts` testing existence and fields of landmark structures and clinical pharmacology profiles.
- [ ] Run test to verify failure (`npx tsx tests/exam1StructuresAndClinPharm.test.ts`).
- [ ] Implement `src/data/exam1/exam1Structures.ts` with ~50 landmark structures (Renal, Bronchodilator, Glucocorticoid, and Antileukotriene agents).
- [ ] Expand `src/utils/clinicalPharmacologyDictionary.ts` with metabolism, BBB penetrance, and pregnancy categories for all Exam 1 landmark drugs.
- [ ] Run test to verify it passes (`npx tsx tests/exam1StructuresAndClinPharm.test.ts`).
- [ ] Commit Task 1.

---

### Task 2: Module 1 Data (`renal_drugs_mcp2`)

**Files:**
- Create: `src/data/exam1/renalDrugsModuleData.ts`
- Test: `tests/renalDrugsModule.test.ts`

- [ ] Write failing test `tests/renalDrugsModule.test.ts` checking module ID `renal_drugs_mcp2`, `examId: 'exam_1'`, exactly 3 pages, exactly 30 questions (IDs 101–130), valid stems, pearls, and SAR notes.
- [ ] Run test to verify failure (`npx tsx tests/renalDrugsModule.test.ts`).
- [ ] Implement `src/data/exam1/renalDrugsModuleData.ts` covering Diuretics mechanisms & nephron segments, CAIs & Osmotics, ADH modifiers, and hyperkalemia resins.
- [ ] Run test to verify it passes (`npx tsx tests/renalDrugsModule.test.ts`).
- [ ] Commit Task 2.

---

### Task 3: Module 2 Data (`respiratory_bronchodilators_mcp2`)

**Files:**
- Create: `src/data/exam1/respiratoryBronchodilatorsModuleData.ts`
- Test: `tests/respiratoryBronchodilatorsModule.test.ts`

- [ ] Write failing test `tests/respiratoryBronchodilatorsModule.test.ts` checking module ID `respiratory_bronchodilators_mcp2`, `examId: 'exam_1'`, exactly 3 pages, exactly 32 questions (IDs 141–172), stems, pearls, and SAR notes.
- [ ] Run test to verify failure (`npx tsx tests/respiratoryBronchodilatorsModule.test.ts`).
- [ ] Implement `src/data/exam1/respiratoryBronchodilatorsModuleData.ts` covering $\beta_2$-agonists (SABA, LABA, ultra-LABA), Antimuscarinics (SAMA, LAMA), Methylxanthines (theophylline), and PDE inhibitors (roflumilast, ensifentrine).
- [ ] Run test to verify it passes (`npx tsx tests/respiratoryBronchodilatorsModule.test.ts`).
- [ ] Commit Task 3.

---

### Task 4: Module 3 Data (`respiratory_antiinflammatories_mcp2`)

**Files:**
- Create: `src/data/exam1/respiratoryAntiinflammatoriesModuleData.ts`
- Test: `tests/respiratoryAntiinflammatoriesModule.test.ts`

- [ ] Write failing test `tests/respiratoryAntiinflammatoriesModule.test.ts` checking module ID `respiratory_antiinflammatories_mcp2`, `examId: 'exam_1'`, exactly 3 pages, exactly 34 questions (IDs 181–214), stems, pearls, and SAR notes.
- [ ] Run test to verify failure (`npx tsx tests/respiratoryAntiinflammatoriesModule.test.ts`).
- [ ] Implement `src/data/exam1/respiratoryAntiinflammatoriesModuleData.ts` covering steroid nucleus/biosynthesis/receptors, systemic glucocorticoid SAR, emergency water-soluble prodrugs vs lipophilic diesters, soft steroids, and antileukotrienes.
- [ ] Run test to verify it passes (`npx tsx tests/respiratoryAntiinflammatoriesModule.test.ts`).
- [ ] Commit Task 4.

---

### Task 5: Exam 1 Barrel, Cumulative Practice Test, & Study Hub Integration

**Files:**
- Create: `src/data/exam1/index.ts`
- Create: `src/data/exam1/exam1CumulativeQuizData.ts`
- Modify: `src/data/cumulativeQuizData.ts`
- Modify: `src/utils/cumulativeStructureHarvester.ts`
- Test: `tests/exam1CumulativeQuiz.test.ts`

- [ ] Write failing test `tests/exam1CumulativeQuiz.test.ts` checking `CUMULATIVE_QUESTIONS_EXAM_1` has 16 questions, covers all 4 types (case-to-structures, structure-to-effects, comparative-sar, contraindication-risk), and harvesting returns Exam 1 structures when scoped to `exam_1`.
- [ ] Run test to verify failure (`npx tsx tests/exam1CumulativeQuiz.test.ts`).
- [ ] Implement `src/data/exam1/index.ts` (barrel export).
- [ ] Implement `src/data/exam1/exam1CumulativeQuizData.ts` with 16 clinical deduction questions.
- [ ] Modify `src/data/cumulativeQuizData.ts` to import and expose `CUMULATIVE_QUESTIONS_EXAM_1`.
- [ ] Modify `src/utils/cumulativeStructureHarvester.ts` to include Exam 1 modules and fallback structures for `exam_1`.
- [ ] Run test to verify it passes (`npx tsx tests/exam1CumulativeQuiz.test.ts`).
- [ ] Commit Task 5.

---

### Task 6: Multi-Exam Scaffolding, Module Storage, and End-to-End Verification

**Files:**
- Modify: `src/types/examTypes.ts`
- Modify: `src/utils/moduleStorage.ts`
- Create: `tests/exam1Modules.test.ts`
- Modify: `tests/multiExamScaffolding.test.ts`

- [ ] Write `tests/exam1Modules.test.ts` covering all 3 Exam 1 modules, 96 questions, landmark structures, clinical pharmacology profiles, and storage retrieval.
- [ ] Update `src/types/examTypes.ts` with `isAvailable: true`, titles, and `builtInModuleIds: ['renal_drugs_mcp2', 'respiratory_bronchodilators_mcp2', 'respiratory_antiinflammatories_mcp2']`.
- [ ] Update `src/utils/moduleStorage.ts` to register all 3 Exam 1 modules in `ALL_BUILTIN_MODULE_IDS`, `BUILTIN_IDS_SET`, `loadAllReviewModules`, and `initModuleStorageFromDexie`.
- [ ] Update `tests/multiExamScaffolding.test.ts` to verify 12 total modules across Exam 1, Exam 2, and Exam 3, and verify seamless exam switching.
- [ ] Run `npx tsx tests/exam1Modules.test.ts` and `npx tsx tests/multiExamScaffolding.test.ts`.
- [ ] Run `npx tsc --noEmit` and confirm 0 TypeScript compilation errors.
- [ ] Run `npm run build` and confirm production build succeeds.
- [ ] Commit and push to `main`.
