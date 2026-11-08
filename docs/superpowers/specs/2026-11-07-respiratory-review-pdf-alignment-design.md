# Design Document: Exam 1 Respiratory Module Full Review-PDF Alignment & Drag-and-Drop Restoration

**Date:** 2026-11-07  
**Status:** In Review (Brainstorming - Post Builder Check)  
**Author:** Antigravity  
**Domain:** Medicinal Chemistry Interactive Education / TypeScript Frontend (React, Dexie)  

---

## 1. Intent and Why

The user requested a **full review-PDF alignment** for the Respiratory Drugs module (`src/data/respiratoryReviewModuleData.ts`), noting that:
1. **Broken Drag & Drop**: Drag & Drop matching questions (such as Question 101, Question 602, and Question 801) render with zero draggable cards in their trays because the question data objects omit `structuresDisplayed` and `questionStem`, causing the UI component (`DocumentQuestionItem.tsx` $\to$ `StructureDragDropMatch.tsx`) to resolve an empty structure array (`[]`).
2. **Incomplete Audit**: The previous test audit (`tests/matchingAuditExam1And2.test.ts`) wrapped structure validation inside `if (q.structuresDisplayed && q.structuresDisplayed.length > 0)`. When `structuresDisplayed` was `undefined`, the assertion silently skipped rather than failing, masking the defective user interface.
3. **Slide vs Review PDF Nomenclature**: The module still references "Slide 1" through "Slide 9" rather than Dr. Rami A. Al-Horani's authentic 9-page Review PDF (*"MCPII Fall 2026 Respiratory Med Chem (Asthma/COPD) Dr. Al-Horani"*, `media_1793986298884_6d5f5ca2.pdf`). In Exam 2 (Diuretics, Sympatholytics, Vasodilators, RAAS, Antihyperlipidemics), all slide references were eliminated in favor of "Review Page N" with exact source question citations.

### Objective
Perform an end-to-end overhaul of `src/data/respiratoryReviewModuleData.ts` to achieve 1:1 fidelity with Dr. Al-Horani's 9-page Respiratory Review PDF, restore fully operational Drag & Drop matching questions with verified draggable card trays and accepted structure targets, add a defensive fallback in `DocumentQuestionItem.tsx`, fix alias-aware completion counting in `StructureDragDropMatch.tsx`, harden the matching test audits against false positives, and bump the module version to `2.2.0` for automatic client cache invalidation.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **1:1 Alignment with Dr. Al-Horani's 9-Page Review PDF**:
  - Replace all `"Slide N"` references across page titles, subtitles, section headers, and question metadata with `"Review Page 1"` through `"Review Page 9"`.
  - Add explicit `sourceReference: 'Respiratory Med Chem (Asthma/COPD) Review, Page X, Question Y'` and `sourcePageNumber: X` to every question.
  - Preserve the authentic chemical structure rosters already validated in `respiratoryReviewModule.test.ts` (Page 2 Adrenergics I–VII, Page 3 Anticholinergics I–V + Hydrocortisone, Page 6 Corticosteroids I–VI, Page 8 Mechanisms I–VII).
- **Restore Working Drag & Drop Matching Questions**:
  - **Question 101 (Review Page 1 - Combination Regimens)**: 5 landmark combination inhaler targets (Anoro Ellipta, Breo Ellipta, Stiolto Respimat, Trelegy Ellipta, Enerzair Breezhaler) matched 1-to-1 with 5 distinct landmark chemical structures (Umeclidinium, Fluticasone furoate, Olodaterol, Vilanterol, Indacaterol). Explicitly attach `structuresDisplayed` and `questionStem`.
  - **Question 602 (Review Page 6 - Corticosteroid Classes & Formulations)**: 6 landmark glucocorticoids (Triamcinolone acetonide, Beclomethasone dipropionate, Fluticasone propionate, Hydrocortisone sodium phosphate, Ciclesonide, Clobetasol propionate) matched 1-to-1 to 6 formulation targets. Explicitly attach `structuresDisplayed` and `questionStem`.
  - **Question 801 (Review Page 8 - Molecular Mechanisms)**: 7 authentic structures (Aclidinium, Methylprednisolone, Ensifentrine, Montelukast, Zileuton, Olodaterol, Theophylline) matched 1-to-1 to 7 pharmacological targets (M3 antagonist, PLA2/Annexin A1 inducer, Dual PDE3/4 inhibitor, CysLT1 antagonist, 5-LOX inhibitor, $\beta_2$-agonist, non-selective PDE inhibitor). Explicitly attach `structuresDisplayed` and `questionStem`.
- **Component Defensive Fallback & Completion Fix**:
  - In `src/components/DocumentQuestionItem.tsx`: Fall back to `section.structures` (or `allSectionStructures`) whenever a matching question has empty `uniqueStructureOptions` and lacks `structuresDisplayed`.
  - In `src/components/StructureDragDropMatch.tsx`: Fix `isCompleted` calculation. Instead of summing `acceptedStructureIds.length` across all targets (which multiplies alias counts and makes completion impossible), evaluate completion as: every target has at least one accepted structure placed in it (`targets.every(t => (placements[t.id] || []).some(id => t.acceptedStructureIds.includes(id)))`).
- **Audit Hardening**:
  - Update `tests/matchingAuditExam1And2.test.ts` to strictly assert:
    1. Every matching question has `matchingTargets.length > 0`.
    2. Every matching question has a non-empty available structure pool (`(q.structuresDisplayed && q.structuresDisplayed.length > 0) || (section.structures && section.structures.length > 0)`).
    3. Every target has `acceptedStructureIds && acceptedStructureIds.length > 0` pointing to valid structures in the pool.
    4. Zero conditional skips.
  - Update `tests/respiratoryReviewModule.test.ts` to assert all 9 Review Pages, verify non-empty `structuresDisplayed` on Q101, Q602, and Q801, and verify module `version === '2.2.0'`.
- **Client Cache Invalidation**:
  - Bump `version: '2.2.0'` in `respiratoryReviewModuleData.ts` to automatically clear stale client Dexie/localStorage caches.

### Non-Goals
- Modifying Exam 2 modules (Diuretics, Sympatholytics, Vasodilators, RAAS, Antihyperlipidemics), which are already verified at `v2.1.0`.
- Altering the chemical structures or PubChem CIDs of the 41 validated landmark respiratory structures (`RESPIRATORY_REVIEW_STRUCTURES`).

### Anti-Goals
- **No Empty Draggable Trays**: No matching question may ever render with zero draggable cards.
- **No Impossible Completion States**: Target aliases must never inflate required placement counts beyond achievable card placements.
- **No Silent Test Skips**: Test audits must never use `if (q.structuresDisplayed)` guards that pass vacuously when fields are missing.
- **No Slide Terminology**: No visible user-facing text or code comments should reference lecture slides.

---

## 3. Approaches Considered

### Approach A: Unified 9-Page In-Place Overhaul & Component Hardening (Selected)
- Overhauls `src/data/respiratoryReviewModuleData.ts` in-place to map directly to Review Pages 1–9 of Dr. Al-Horani's Review PDF.
- Purges all "Slide N" terminology, replacing it with "Review Page 1" through "Review Page 9" and verified PDF question citations.
- Fixes Drag & Drop on Questions 101, 602, and 801 by explicitly attaching `structuresDisplayed`, clear `questionStem` instructions with Roman numeral cues (`Structure I - Structure VII`), and verified target ID mappings.
- Adds defensive fallback in `DocumentQuestionItem.tsx` and fixes completion logic in `StructureDragDropMatch.tsx`.
- Hardens `tests/matchingAuditExam1And2.test.ts` and `tests/respiratoryReviewModule.test.ts`.
- Bumps module version to `2.2.0` for automatic cache eviction.

### Approach B: Split into Two Separate Review Modules
- Splits the 9-page PDF across two separate modules (Bronchodilators and Anti-inflammatories).
- **Trade-offs**: Breaks the 1:1 alignment with Dr. Al-Horani's single 9-page review PDF document and alters Exam 1 module routes.

### Approach C: Minimal Data Patch
- Only adds `structuresDisplayed` to Questions 101, 602, and 801.
- **Trade-offs**: Leaves deeper question wording, sub-statement verifications, and explanations unaligned with the actual PDF questions.

**Decision**: The user explicitly selected **Approach A**.

---

## 4. Detailed Specification

### 4.1. Authentic Review Page Structure & Content

#### Review Page 1: Fixed-Dose Inhaled Combinations & Mechanistic Synergy
- **PDF Source**: Page 1 of Review PDF (Combinations: Umeclidinium, Fluticasone furoate, Vilanterol, Olodaterol, Tiotropium, Glycopyrrolate, Indacaterol, Mometasone furoate).
- **Page Metadata**: `pageNumber: 1`, `title: 'Combination Bronchodilators & Anti-inflammatory Regimens'`, `subtitle: 'LAMA + LABA, ICS + LABA, and Triple Therapy (LAMA + LABA + ICS) in Asthma and COPD Management'`.
- **Questions**:
  - `Question 101` (`type: 'matching'`): Fixed-Dose Combination Regimens Matching.
    - `structuresDisplayed`: `[UMECLIDINIUM_STRUCTURE, FLUTICASONE_FUROATE_STRUCTURE, OLODATEROL_STRUCTURE, VILANTEROL_STRUCTURE, INDACATEROL_STRUCTURE]` (5 distinct signature structures matching 5 combination inhalers 1-to-1).
    - `questionStem`: `'Drag each signature chemical structure (Structure I - Structure V) into its corresponding fixed-dose combination inhaler regimen (Anoro Ellipta, Breo Ellipta, Stiolto Respimat, Trelegy Ellipta, Enerzair Breezhaler):'`.
    - `matchingTargets`:
      - Anoro Ellipta (Umeclidinium + Vilanterol) $\to$ accepted: `['umeclidinium', 'I']`
      - Breo Ellipta (Fluticasone furoate + Vilanterol) $\to$ accepted: `['fluticasone_furoate', 'II']`
      - Stiolto Respimat (Tiotropium + Olodaterol) $\to$ accepted: `['olodaterol', 'III']`
      - Trelegy Ellipta (Umeclidinium + Fluticasone furoate + Vilanterol) $\to$ accepted: `['vilanterol', 'IV']`
      - Enerzair Breezhaler (Indacaterol + Glycopyrrolate + Mometasone furoate) $\to$ accepted: `['indacaterol', 'V']`
  - `Question 102` (`type: 'sub-statements'`): Mechanistic Synergy & Pharmacophoric Requirements.
  - `Question 103` (`type: 'multiple-choice'`): Clinical Differentiation of Inhaled Regimens.

#### Review Page 2: Adrenergic Agonists SAR (Structures I–VII)
- **PDF Source**: Page 2 of Review PDF (Questions 1–8).
- **Structures I–VII**:
  - Structure I: Isoproterenol (non-selective $\beta_1/\beta_2$)
  - Structure II: Dobutamine (selective $\beta_1$)
  - Structure III: Olodaterol (selective $\beta_2$, ultra-LABA)
  - Structure IV: Salmeterol (selective $\beta_2$, LABA)
  - Structure V: Indacaterol (selective $\beta_2$, ultra-LABA)
  - Structure VI: Pirbuterol (selective $\beta_2$, SABA)
  - Structure VII: Norepinephrine (non-selective $\alpha/\beta$)
- **Questions**:
  - `Question 201` (`type: 'multiple-choice'`): Core Adrenergic Pharmacophore ($\beta$-phenylethanolamine).
  - `Question 202` (`type: 'multiple-choice'`): Nonselective $\alpha/\beta$-Agonist Identification (Structure VII Norepinephrine).
  - `Question 203` (`type: 'multiple-choice'`): Nonselective $\beta_1/\beta_2$-Agonist Identification (Structure I Isoproterenol).
  - `Question 204` (`type: 'multiple-choice'`): Selective $\beta_1$-Agonist Identification (Structure II Dobutamine).
  - `Question 205` (`type: 'multiple-choice'`): Selective $\beta_2$-Agonists Identification (Structures III, IV, V, and VI).
  - `Question 206` (`type: 'multiple-choice'`): SABA vs LABA vs Ultra-LABA Categorization (VI Pirbuterol = SABA; IV Salmeterol = LABA; III Olodaterol & V Indacaterol = Ultra-LABA).
  - `Question 207` (`type: 'multiple-choice'`): Clinical Indications: Asthma/COPD vs Shock and Heart Failure.
  - `Question 208` (`type: 'multiple-choice'`): Metabolic Susceptibility to COMT and MAO.

#### Review Page 3: Muscarinic Antagonists (Anticholinergics) & Glucocorticoid Foundation
- **PDF Source**: Page 3 of Review PDF (Questions 1–5 Anticholinergics; Questions 1–5 Hydrocortisone).
- **Structures I–V (Anticholinergics)**:
  - Structure I: Darifenacin
  - Structure II: Trihexyphenidyl
  - Structure III: Tiotropium
  - Structure IV: Umeclidinium
  - Structure V: Ipratropium
- **Glucocorticoid Prototype**: Hydrocortisone structure.
- **Questions**:
  - `Question 301`–`305`: Anticholinergic chemical/pharmacological classes, pharmacophore, quaternary ammonium lung localization, asthma/COPD indications, soft anticholinergics / esterase inactivation.
  - `Question 306`–`309`: Glucocorticoid vs mineralocorticoid definitions, carbon numbering, 11-beta-OH vs 11-keto activation, GR binding interactions, and clinical utility.

#### Review Page 4: Adrenal Steroidogenesis & Glucocorticoid Receptor Activation Scheme
- **PDF Source**: Page 4 of Review PDF (Hydrocortisone biosynthesis scheme; GR diagram).
- **Questions**:
  - `Question 401` (`type: 'sub-statements'`): Adrenal Steroidogenesis & Cytochrome P450 Enzymes (CYP11A1, CYP17A1, 3$\beta$-HSD2, CYP21A2, CYP11B1; zona fasciculata; ACTH/CRH regulation).
  - `Question 402` (`type: 'sub-statements'`): Glucocorticoid Receptor (GR) Architecture & Activation Cycle (Domain XX = DNA-binding domain, Domain YY = ligand-binding domain; AA = Hsp90 complex, CC = GRE; Processes 1–6).

#### Review Page 5: Hydrocortisone Inactivation Pathways & Anti-inflammatory Potency Ranking
- **PDF Source**: Page 5 of Review PDF (Metabolic scheme Pathways 1–3; Potency ranking).
- **Questions**:
  - `Question 501` (`type: 'sub-statements'`): Hydrocortisone Inactivation Pathways (Pathway 1: Ring A 5-reductase + 3$\alpha$-HSD; Pathway 2: 11$\beta$-HSD2 oxidation; Pathway 3: 20-ketone reduction and side-chain cleavage; Phase II conjugation; modifications to prolong duration).
  - `Question 502` (`type: 'ranking'`): Systemic Corticosteroid Anti-inflammatory Potency Ranking (Dexamethasone [25–80x] > Methylprednisolone [5x] $\approx$ Triamcinolone [5x] > Prednisolone [4x] $\approx$ Prednisone [4x] > Hydrocortisone [1x] > Cortisone [0.8x]).

#### Review Page 6: Corticosteroid Formulation Chemistry & Structural Class Matching
- **PDF Source**: Page 6 of Review PDF (Structures I–VI; Questions 1–7; True/False battery).
- **Structures I–VI**:
  - Structure I: Triamcinolone acetonide (cyclic 16,17-acetonide ketal)
  - Structure II: Beclomethasone dipropionate (C17,C21 lipophilic diester prodrug)
  - Structure III: Fluticasone propionate (17$\beta$-carbothioate fluoromethyl soft steroid)
  - Structure IV: Hydrocortisone sodium phosphate (water-soluble parenteral ester salt)
  - Structure V: Ciclesonide (inhaled cyclic acetal prodrug)
  - Structure VI: Clobetasol propionate (super-potent 21-chloro corticosteroid)
- **Questions**:
  - `Question 601` (`type: 'sub-statements'`): Glucocorticoid Prodrugs, Soft Steroids & Formulation Principles.
  - `Question 602` (`type: 'matching'`): Corticosteroid Formulation & Structural Class Matching.
    - `structuresDisplayed`: `[TRIAMCINOLONE_ACETONIDE_STRUCTURE, BECLOMETHASONE_DIPROPIONATE_STRUCTURE, FLUTICASONE_PROPIONATE_STRUCTURE, HYDROCORTISONE_SODIUM_PHOSPHATE_STRUCTURE, CICLESONIDE_STRUCTURE, CLOBETASOL_PROPIONATE_STRUCTURE]`.
    - `questionStem`: `'Drag each chemical structure (Structure I - Structure VI) to its correct formulation class, prodrug status, and clinical role:'`.
    - `matchingTargets`:
      - Structure I (Triamcinolone acetonide) $\to$ Cyclic 16,17-acetonide ketal for topical anti-inflammatory potency with zero salt retention (`acceptedStructureIds: ['triamcinolone_acetonide', 'I']`)
      - Structure II (Beclomethasone dipropionate) $\to$ Lipophilic diester prodrug providing airway tissue deposition and low oral bioavailability (`acceptedStructureIds: ['beclomethasone_dipropionate', 'II']`)
      - Structure III (Fluticasone propionate) $\to$ 17beta-Carbothioate fluoromethyl soft steroid designed for rapid metabolic inactivation (`acceptedStructureIds: ['fluticasone_propionate', 'III']`)
      - Structure IV (Hydrocortisone sodium phosphate) $\to$ Water-soluble parenteral ester salt for emergency intravenous bolus administration (`acceptedStructureIds: ['hydrocortisone_sodium_phosphate', 'IV']`)
      - Structure V (Ciclesonide) $\to$ Inhaled cyclic acetal prodrug activated by airway esterases (`acceptedStructureIds: ['ciclesonide', 'V']`)
      - Structure VI (Clobetasol propionate) $\to$ Super-potent 21-chloro topical corticosteroid for severe inflammatory dermatoses (`acceptedStructureIds: ['clobetasol_propionate', 'VI']`)
  - `Question 603` (`type: 'sub-statements'`): Glucocorticoid SAR Core Principles.

#### Review Page 7: Glucocorticoid SAR Principles, Bioactivations & Methylxanthines vs PDE4 Inhibitors
- **PDF Source**: Page 7 of Review PDF (SAR True/False; Transformation products; Theophylline vs Roflumilast).
- **Questions**:
  - `Question 701` (`type: 'sub-statements'`): Glucocorticoid SAR True/False Battery (9$\alpha$-F, 16$\alpha$,17$\alpha$-acetal, 1-dehydro, all-trans backbone).
  - `Question 702` (`type: 'multiple-choice'`): Corticosteroid Metabolic Biotransformations & Bioactivations (Prednisone $\to$ Prednisolone via 11$\beta$-HSD1; Beclomethasone dipropionate $\to$ BMP via lung esterases; Fluticasone propionate $\to$ 17$\beta$-carboxylic acid via CYP3A4).
  - `Question 703` (`type: 'sub-statements'`): Comparative Chemistry & Pharmacology: Theophylline (Drug A) vs Roflumilast (Drug B).

#### Review Page 8: Leukotriene Pathway & Respiratory Molecular Mechanisms
- **PDF Source**: Page 8 of Review PDF (7-Drug Mechanism Matching I–VII; Leukotriene pathway; Montelukast vs Zileuton).
- **Structures I–VII (Mechanisms Matching)**:
  - Structure I: Aclidinium ($M_3$ muscarinic antagonist)
  - Structure II: Methylprednisolone (PLA2/cPLA2 indirect inhibitor via Annexin A1 induction)
  - Structure III: Ensifentrine (Dual PDE3 and PDE4 inhibitor)
  - Structure IV: Montelukast (CysLT1 receptor antagonist)
  - Structure V: Zileuton (5-Lipoxygenase inhibitor)
  - Structure VI: Olodaterol ($\beta_2$-adrenoceptor agonist)
  - Structure VII: Theophylline (Non-selective phosphodiesterase inhibitor)
- **Questions**:
  - `Question 801` (`type: 'matching'`): 7-Drug Respiratory Molecular Mechanism Matching.
    - `structuresDisplayed`: `[ACLIDINIUM_STRUCTURE, METHYLPREDNISOLONE_STRUCTURE, ENSIFENTRINE_STRUCTURE, MONTELUKAST_STRUCTURE, ZILEUTON_STRUCTURE, OLODATEROL_STRUCTURE, THEOPHYLLINE_STRUCTURE]`.
    - `questionStem`: `'Drag each chemical structure (Structure I - Structure VII) to its precise pharmacological target and biochemical mechanism of action:'`.
    - `matchingTargets`:
      - Structure I (Aclidinium) $\to$ Muscarinic M3 receptor antagonist (`acceptedStructureIds: ['I', 'aclidinium']`)
      - Structure II (Methylprednisolone) $\to$ Phospholipase A2 (cPLA2) indirect inhibitor via Annexin A1 induction (`acceptedStructureIds: ['II', 'methylprednisolone']`)
      - Structure III (Ensifentrine) $\to$ Dual PDE3 and PDE4 inhibitor (`acceptedStructureIds: ['III', 'ensifentrine']`)
      - Structure IV (Montelukast) $\to$ Cysteinyl leukotriene receptor 1 (CysLT1) antagonist (`acceptedStructureIds: ['IV', 'montelukast']`)
      - Structure V (Zileuton) $\to$ 5-Lipoxygenase (5-LOX) inhibitor (`acceptedStructureIds: ['V', 'zileuton']`)
      - Structure VI (Olodaterol) $\to$ Beta-2 adrenergic receptor agonist (`acceptedStructureIds: ['VI', 'olodaterol']`)
      - Structure VII (Theophylline) $\to$ Non-selective phosphodiesterase (PDE) inhibitor (`acceptedStructureIds: ['VII', 'theophylline']`)
  - `Question 802` (`type: 'multiple-choice'`): Formulation Chemistry: Beclomethasone Dipropionate vs Hydrocortisone Sodium Succinate.
  - `Question 803` (`type: 'sub-statements'`): Leukotriene Pathway Modulators: Montelukast (Drug A) vs Zileuton (Drug B).

#### Review Page 9: Comparative Formulations & Paired Clinical Evaluations
- **PDF Source**: Page 9 of Review PDF (Beclomethasone vs Hydrocortisone Succinate; Tiotropium vs Pirbuterol).
- **Questions**:
  - `Question 901` (`type: 'sub-statements'`): Beclomethasone Dipropionate (Drug A) vs Hydrocortisone Sodium Succinate (Drug B) (10 True/False sub-statements).
  - `Question 902` (`type: 'sub-statements'`): Tiotropium Bromide (Drug A) vs Pirbuterol (Drug B) (5 True/False sub-statements).

---

### 4.2. Component Defensive Fallback & Completion Fix

1. **`DocumentQuestionItem.tsx` Fallback**:
   If `question.type === 'matching'` and `uniqueStructureOptions.length === 0` and `(!question.structuresDisplayed || question.structuresDisplayed.length === 0)`, set:
   `uniqueStructureOptions = allSectionStructures`.
2. **`StructureDragDropMatch.tsx` Completion Fix**:
   Replace:
   ```typescript
   const totalRequiredPlacements = targets.reduce((acc, t) => acc + t.acceptedStructureIds.length, 0);
   const correctPlacementsCount = targets.reduce(...);
   const isCompleted = ... && correctPlacementsCount === totalRequiredPlacements;
   ```
   With:
   ```typescript
   const isCompleted =
     !examModeActive &&
     targets.length > 0 &&
     targets.every((t) => {
       const placed = placements[t.id] || [];
       return placed.some((id) => t.acceptedStructureIds.includes(id));
     });
   ```

---

### 4.3. Test Audit Hardening

1. **`tests/matchingAuditExam1And2.test.ts`**:
   Remove `if (q.structuresDisplayed)`. Validate:
   ```typescript
   const availableStructures = (q.structuresDisplayed && q.structuresDisplayed.length > 0)
     ? q.structuresDisplayed
     : (section?.structures || []);
   assert.ok(availableStructures.length > 0, `Question ${q.id} must have non-empty available structures`);
   assert.ok(q.matchingTargets.length > 0, `Question ${q.id} must have matching targets`);
   q.matchingTargets.forEach(t => {
     assert.ok(t.acceptedStructureIds.length > 0, `Target ${t.id} must define accepted structure IDs`);
   });
   ```
2. **`tests/respiratoryReviewModule.test.ts`**:
   Verify Review Pages 1–9, `q.structuresDisplayed` on Q101, Q602, Q801, and version `'2.2.0'`.

---

## 5. Verification Plan

1. `npx tsx tests/respiratoryReviewModule.test.ts` passes 100%.
2. `npx tsx tests/matchingAuditExam1And2.test.ts` passes 100%.
3. `npx tsx tests/e2eExam1InteractiveReviews.test.ts` passes 100%.
4. `npm run lint` passes 0 errors.
5. Browser verification on `http://localhost:3000`:
   - Navigate to **Review for Respiratory Drugs**.
   - Review Page 1 (Q101): 5 draggable cards, 5 targets, drag & drop functions and completes.
   - Review Page 6 (Q602): 6 draggable cards, 6 targets, drag & drop functions and completes.
   - Review Page 8 (Q801): 7 draggable cards, 7 targets, drag & drop functions and completes.
   - Zero occurrences of "Slide" on screen.
