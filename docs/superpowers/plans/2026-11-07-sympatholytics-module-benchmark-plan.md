# Sympatholytics Module Benchmark Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the Exam 2 Sympatholytics module (`antihypertensives_2_mcp2`) to achieve 1:1 review page alignment with Dr. Al-Horani's 7-page review PDF, eradicating all synthetic numbering and parenthetical spoilers, introducing interactive Drag & Drop matching matrices, and bumping the version to `2.0.0` with full cache invalidation.

**Architecture:** Partition the module into exactly 7 `ReviewPage` objects matching Dr. Al-Horani's 7 review pages. Use clean Roman numeral chips (`Structure I` to `Structure VI`) in question stems, options, and matching targets without disclosing drug names in parentheses. Add `nebivolol` to `exam2Structures.ts`, invalidate obsolete cached versions in `moduleStorage.ts`, and test via Vitest / tsx.

**Tech Stack:** TypeScript, React, Tailwind CSS, Lucide Icons, Vitest, Dexie.js.

**Spec:** `docs/superpowers/specs/2026-11-07-sympatholytics-module-benchmark-design.md`

## Global Constraints

- Module ID must remain `antihypertensives_2_mcp2`.
- Module version must be bumped to `'2.0.0'`.
- Number of review pages must equal exactly 7 (`pages.length === 7`).
- All questions must use sequential `questionNumberLabel: 'Question N'` starting at `Question 1` on each review page.
- Zero parenthetical drug name spoilers allowed in question stems or multiple-choice options where structure identification is tested.
- Review Page 2 Question 1 must be an interactive Drag & Drop matching matrix (`type: 'matching'`).
- Review Page 7 Question 1 must be an interactive head-to-head comparative battery for Nebivolol, Carvedilol, and Propranolol.
- Always refer to review pages as "review pages", never as "slides".

## Review Focus

1. **Exact Page and Question Count Match**: Review pages must align with Dr. Al-Horani's 7 pages with correct question distribution `[7, 12, 5, 3, 6, 9, 1]`.
2. **Zero Parenthetical Spoilers**: Multiple-choice options must never include `(Propranolol)`, `(Metoprolol)`, etc.
3. **Interactive Matching Matrix Schema**: Valid items, targets, correctMatches, and feedback fields conforming to `MatchingQuestion`.
4. **Cache Invalidation**: Users loading the app with cached version `1.0.0` or `pages.length < 7` must seamlessly receive `2.0.0`.
5. **TypeScript & Build Integrity**: Zero TypeScript errors during `npm run build`.

---

### Task 1: Structure Registry Update (`nebivolol` in `exam2Structures.ts`)

**Files:**
- Modify: `src/data/exam2/exam2Structures.ts`

- [ ] **Step 1.1**: Define `nebivolol` in `EXAM_2_STRUCTURES` with canonical SMILES `C1CC2=C(COC1C(CNCC(C3CCC4=C(CO3)C=CC(=C4)F)O)O)C=CC(=C2)F`, molecular formula, molecular weight, and structural description.
- [ ] **Step 1.2**: Export `nebivolol` in `SYMPATHOLYTICS_STRUCTURES`.
- [ ] **Step 1.3**: Verify TypeScript compilation with `npx tsc --noEmit`.

---

### Task 2: Automated Unit Test Harness for Sympatholytics Module

**Files:**
- Create: `tests/sympatholyticsReviewModule.test.ts`
- Modify: `tests/matchingAuditExam1And2.test.ts`

- [ ] **Step 2.1**: Write `tests/sympatholyticsReviewModule.test.ts` testing:
  - `mod.id === 'antihypertensives_2_mcp2'`
  - `mod.version === '2.0.0'`
  - `mod.pages.length === 7`
  - Questions per page: `[7, 12, 5, 3, 6, 9, 1]`
  - Sequential `Question 1` through `Question N` labeling on every page
  - Zero parenthetical drug name spoilers in stems/options
  - Drag & Drop matching matrix schema validation on Page 2 and Page 7
  - All referenced chemical structures have non-empty name and SMILES.
- [ ] **Step 2.2**: Run `npx tsx tests/sympatholyticsReviewModule.test.ts` to confirm it fails on the existing 3-page un-refactored module.
- [ ] **Step 2.3**: Update `tests/matchingAuditExam1And2.test.ts` to include Sympatholytics Drag & Drop matching checks.

---

### Task 3: Refactor Review Pages 1 & 2 in `sympatholyticsModuleData.ts`

**Files:**
- Modify: `src/data/exam2/sympatholyticsModuleData.ts`

- [ ] **Step 3.1**: Refactor Review Page 1 (Q1–Q7):
  - Instructions: "Consider Structures I through VI to answer questions 1–7."
  - Structures: Propranolol (I), Metoprolol (II), Esmolol (III), Carvedilol (IV), Pindolol (V), Nadolol (VI).
  - Q1: Chemical class (Aryloxypropanolamine)
  - Q2: Mechanistic class ($\beta$-Blockers)
  - Q3: Indication (Hypertension)
  - Q4: Direct peripherally-acting sympatholytics
  - Q5: Cardioselective $\beta_1$-blockers (Structure II and Structure III) — NO parenthetical spoilers
  - Q6: Hypertensive patient with history of bronchospasm (Structure II) — NO parenthetical spoilers
  - Q7: Mixed $\alpha_1/\beta$-antagonist (Structure IV) — NO parenthetical spoilers
  - Sequential labels: `Question 1` through `Question 7`.
- [ ] **Step 3.2**: Refactor Review Page 2 (Q8–Q19):
  - Q1 (id: 408): Interactive Drag & Drop matching matrix for landmark properties across Structures I through VI (MSA, ISA, ultrashort esterase duration, carbazole antioxidant, longest half-life/renal elimination, cardioselective reactive airway).
  - Q2 (id: 410): Emergency room preference rationale (Structure III, RBC esterase hydrolysis).
  - Q3 (id: 411): Heart failure antioxidant rationale (Structure IV, carbazole ring).
  - Q4 (id: 412): Dual ISA and membrane-stabilizing activity (Structure V).
  - Q5 (id: 413): Lipophilicity / CNS penetration (Structure I).
  - Q6 (id: 414): Evasion of first-pass hepatic metabolism (Structure VI).
  - Q7 (id: 415): Extended elimination half-life (Structure VI).
  - Q8 (id: 416): Vasodilatory $\beta$-blocker (Structure IV).
  - Q9 (id: 417): Active $\beta$-blocker SAR rationale (Structure I, S-configuration aryloxypropanolamine).
  - Q10 (id: 418): Clonidine 5-statement True/False battery.
  - Q11 (id: 419): Clonidine ortho-chloro substituents electronic, steric, and lipophilicity SAR.
  - Q12 (id: 420): Central $\alpha_2$-agonist antihypertensive hemodynamic consequences.
  - Sequential labels: `Question 1` through `Question 12`.
- [ ] **Step 3.3**: Run `npx tsx tests/sympatholyticsReviewModule.test.ts` to verify Pages 1 & 2.

---

### Task 4: Refactor Review Pages 3 & 4 in `sympatholyticsModuleData.ts`

**Files:**
- Modify: `src/data/exam2/sympatholyticsModuleData.ts`

- [ ] **Step 4.1**: Refactor Review Page 3 (Q20–Q24):
  - Structures: Methyldopa, $(1R,2S)$-$\alpha$-methylnorepinephrine, Clonidine (I), Reserpine (II), Prazosin (III), Methyldopa (IV).
  - Q1 (id: 420): Methyldopa kinetics & prodrug characteristics (all true except fast onset / high bioavailability).
  - Q2 (id: 421): Central activation active structure identification ($(1R,2S)$-$\alpha$-methylnorepinephrine).
  - Q3 (id: 422): Methyldopa bioactivation enzymes multi-select (L-Aromatic amino acid decarboxylase & Dopamine $\beta$-hydroxylase).
  - Q4 (id: 423): Mechanism True/False battery for Structures I–IV.
  - Q5 (id: 424): Site of action (Central vs Peripheral) True/False battery for Structures I–IV.
  - Sequential labels: `Question 1` through `Question 5`.
- [ ] **Step 4.2**: Refactor Review Page 4 (Q25–Q27):
  - Structures: Propranolol (Molecule I), Isoproterenol (Molecule II), Pindolol (Sympatholytic I), Guanfacine (Drug I), Guanethidine (Drug II).
  - Q1 (id: 425): Aryloxypropanolamine vs Arylethanolamine 8-statement True/False battery.
  - Q2 (id: 426): Sympatholytic I (Pindolol) ISA and bronchospasm contraindication.
  - Q3 (id: 427): Guanfacine vs Guanethidine 7-statement True/False battery (basicity, lipophilicity, central vs peripheral mechanism).
  - Sequential labels: `Question 1` through `Question 3`.
- [ ] **Step 4.3**: Run `npx tsx tests/sympatholyticsReviewModule.test.ts` to verify Pages 1–4.

---

### Task 5: Refactor Review Pages 5, 6 & 7 in `sympatholyticsModuleData.ts`

**Files:**
- Modify: `src/data/exam2/sympatholyticsModuleData.ts`

- [ ] **Step 5.1**: Refactor Review Page 5 (Q28–Q33):
  - Structures: Carvedilol (Drug C with domains a, b, c), Prazosin (I), Terazosin (II), Doxazosin (III), Tamsulosin (IV).
  - Q1 (id: 428): Pharmacological mechanistic class of Drug C.
  - Q2 (id: 429): Structural domain responsible for receptor binding (domain b).
  - Q3 (id: 430): Structural domain responsible for subtype/tissue selectivity (domain c).
  - Q4 (id: 431): Structural domain influencing pharmacokinetic properties / metabolism (domain a).
  - Q5 (id: 432): Chemical class of Drugs I & II (Quinazoline-piperazines).
  - Q6 (id: 433): Adrenergic category of Drugs I–IV (Direct sympatholytics).
  - Sequential labels: `Question 1` through `Question 6`.
- [ ] **Step 5.2**: Refactor Review Page 6 (Q34–Q42):
  - Structures: Prazosin (I), Terazosin (II), Doxazosin (III), Tamsulosin (IV), Nebivolol (Drug N).
  - Q1 (id: 434): Mechanistic class of Drugs I–IV (Selective $\alpha_1$-antagonists).
  - Q2 (id: 435): Rank selectivity towards $\alpha_{1A}$-receptor (Drug IV > Drug III > Drugs II and I).
  - Q3 (id: 436): Essential functional groups for Drug I binding except furan-containing acyl group.
  - Q4 (id: 437): Drugs used for both hypertension and BPH (Drugs I, II, III).
  - Q5 (id: 438): Once-daily BPH management with minimal cardiovascular effects (Drug IV / Tamsulosin).
  - Q6 (id: 439): Drugs equally affecting all $\alpha_1$-receptor subtypes (Drugs I, II, III).
  - Q7 (id: 440): Reflex tachycardia potential due to vasodilation.
  - Q8 (id: 441): CYP2D6 EM vs PM phenotypes in Nebivolol metabolism (kinetics, half-life, cardioselectivity).
  - Q9 (id: 442): Nebivolol 8-statement True/False battery.
  - Sequential labels: `Question 1` through `Question 9`.
- [ ] **Step 5.3**: Refactor Review Page 7 (Q43):
  - Structures: Nebivolol (Drug N), Carvedilol (Drug C), Propranolol (Drug P).
  - Q1 (id: 443): Head-to-head comparative battery across 4 core dimensions:
    - Cardioselectivity (Nebivolol $\gg$ Propranolol = Carvedilol)
    - Vasodilatory mechanism (Nebivolol = eNOS / NO release; Carvedilol = $\alpha_1$ blockade; Propranolol = none)
    - CNS side effects (Propranolol $\gg$ Carvedilol > Nebivolol)
    - Membrane-stabilizing activity (Propranolol $\gg$ Carvedilol > Nebivolol = none).
  - Sequential label: `Question 1`.
- [ ] **Step 5.4**: Run `npx tsx tests/sympatholyticsReviewModule.test.ts` to verify all 7 pages.

---

### Task 6: Module Version Bump, Cache Invalidation, and Regression Testing

**Files:**
- Modify: `src/data/exam2/sympatholyticsModuleData.ts`
- Modify: `src/utils/moduleStorage.ts`
- Test: `tests/sympatholyticsReviewModule.test.ts`
- Test: `tests/matchingAuditExam1And2.test.ts`
- Test: `tests/diureticsReviewModule.test.ts`
- Test: `tests/respiratoryReviewModule.test.ts`

- [ ] **Step 6.1**: Ensure `version: '2.0.0'` in `getDefaultSympatholyticsModule()`.
- [ ] **Step 6.2**: Add cache invalidation logic in `src/utils/moduleStorage.ts` for `antihypertensives_2_mcp2` to replace any cached module where `version !== '2.0.0'` or `pages.length < 7`.
- [ ] **Step 6.3**: Run `npx tsx tests/sympatholyticsReviewModule.test.ts`.
- [ ] **Step 6.4**: Run `npx tsx tests/matchingAuditExam1And2.test.ts`.
- [ ] **Step 6.5**: Run `npx tsx tests/diureticsReviewModule.test.ts` and `npx tsx tests/respiratoryReviewModule.test.ts` to prevent regressions.
- [ ] **Step 6.6**: Run `npm run build` to verify 0 TypeScript and bundling errors.
- [ ] **Step 6.7**: Commit all changes cleanly with git.
