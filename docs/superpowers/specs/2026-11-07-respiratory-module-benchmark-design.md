# Design Document: Exam 1 Respiratory Module Benchmark Overhaul

**Date:** 2026-11-07  
**Status:** In Review (Brainstorming - Builder Check)  
**Author:** Antigravity  
**Domain:** Medicinal Chemistry Interactive Education / TypeScript Frontend  

---

## 1. Intent and Why

The user observed that the **Exam 1 Respiratory Drugs module** (`src/data/respiratoryReviewModuleData.ts`) and the Exam 2 modules diverged significantly from the authentic source review worksheets and from the gold-standard interactive design established in Exam 3 (`antiplateletQuizData.ts`, `anticoagulantsQuizData.ts`, `heartFailureModuleData.ts`, `antiarrhythmicModuleData.ts`).

### Current Deficiencies
1. **Synthetic Numbering Nomenclature**: Questions are labeled with artificial IDs like `Q101`, `Q102`, `Q201–Q208`, `Q301–Q309`, rather than following the authentic sequential question numbers printed on the professor's review handout (`Question 1`, `Question 2`, etc.).
2. **Spoiled Structure Names in Multiple Choice**: Where the source worksheet presents unlabeled chemical structures (e.g., Structures I–VII on Slide 2 and Slide 8) and asks students to classify or match them by pharmacological/SAR properties, the previous generator created multiple-choice questions that spoon-feed the drug names directly in the options (e.g., `Structure VII (Norepinephrine)`, `Structure I (Isoproterenol)`, `Structure II (Dobutamine)`). This completely circumvents medicinal chemistry learning because students can simply read the name rather than analyzing structural motifs.
3. **Missing Drag-and-Drop Question Types**: The app already contains a rich, interactive drag-and-drop matching engine (`type: 'matching'`), but key multi-structure exercises were degraded into trivial single-choice MCQs.

### Objective
Comprehensively overhaul `respiratoryReviewModuleData.ts` to establish a gold-standard **benchmark** that achieves 1:1 fidelity with Dr. Rami A. Al-Horani's 9-page review handout (*"MCPII Fall 2026 Respiratory Med Chem (Asthma/COPD) Dr. Al-Horani"*), utilizing authentic sequential question numbering, interactive drag-and-drop matching with clean Roman numeral chips (`Structure I`, `Structure II`, etc.), and multi-statement true/false evaluations (`type: 'sub-statements'`).

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **1:1 Alignment with Source PDF Slides 1–9**:
  - **Slide 1**: Combination bronchodilators & anti-inflammatory regimens (Umeclidinium, Fluticasone furoate, Vilanterol, Olodaterol, Tiotropium; brand combinations Anoro, Breo, Stiolto, Trelegy, Enerzair).
  - **Slide 2 & 3**: Adrenergic bronchodilator SAR for Structures I–VII (Isoproterenol, Dobutamine, Olodaterol, Salmeterol, Indacaterol, Pirbuterol, Norepinephrine). Questions 1–8 covering pharmacophore, selectivity ($\alpha/\beta$, $\beta_1/\beta_2$, $\beta_1$, $\beta_2$), duration (SABA, LABA, ultra-LABA), asthma/COPD vs shock/HF, and COMT/MAO metabolism.
  - **Slide 3**: Anticholinergic bronchodilator SAR for Structures I–V (Ipratropium, Tiotropium, Aclidinium, Umeclidinium, Glycopyrrolate) and Glucocorticoid prototype (Hydrocortisone) foundations (Questions 1–5).
  - **Slide 4 & 5**: Glucocorticoid biochemistry, biosynthesis scheme (cholesterol $\to$ hydrocortisone), receptor architecture (domains XX, YY, Box A/B processes), and metabolic inactivation scheme (Pathways 1–3, Enzymes 1–4, Metabolites A–C).
  - **Slide 6 & 7**: Glucocorticoid prodrugs and soft steroids for Structures I–VI (Ciclesonide, Beclomethasone dipropionate, Fluticasone propionate, Mometasone furoate, Hydrocortisone sodium succinate, Hydrocortisone sodium phosphate), SAR True/False principles, and metabolic activation/inactivation transformations.
  - **Slide 7 & 8**: Non-steroidal controllers: Drug A (Theophylline) vs Drug B (Roflumilast) comparative True/False statements.
  - **Slide 8**: Structure-to-Mechanism matching for Structures I–VII against target mechanisms A–F ($\beta_2$-agonist, $M_3$ antagonist, PDE3/4 inhibitor, 5-LOX inhibitor, CysLT1 antagonist, glucocorticoid receptor).
  - **Slide 8 & 9**: Comparative drug analysis (Drug A vs Drug B) for inhaled vs parenteral corticosteroids and antimuscarinic vs adrenergic bronchodilators.
- **Authentic Question Numbering**: Replace all `Q101`, `Q201` labels with sequential `questionNumberLabel: 'Question 1'`, `questionNumberLabel: 'Question 2'`, etc. matching each slide/section of the review sheet.
- **Interactive Drag & Drop Matching**: Convert all structure classification and mechanism matching exercises into `type: 'matching'`, using clean Roman numeral chips without spoiled drug names in chips or targets.
- **Multi-Statement Sub-Questions**: Use `type: 'sub-statements'` for comprehensive multi-part True/False exercises.
- **Clean Structure Chips**: Ensure structure chips render with clean labels (`Structure I`, `Structure II`, etc.) as verified in our previous clean-chips update.

### Non-Goals
- Modifying the underlying React presentation components (`DocumentQuestionItem.tsx`, `ReviewModuleView.tsx`), which already natively support `type: 'matching'`, `type: 'sub-statements'`, and clean Roman numeral chips.
- Overhauling the Exam 2 modules in this phase (Exam 2 will follow this established benchmark in the next phase).

### Anti-Goals
- **No Name Spoilers**: Never reveal the drug name (e.g. "Isoproterenol", "Norepinephrine") in the question stem, chip labels, or matching target labels for exercises where the student is tasked with structural identification from unlabeled structures.
- **No Orphan Question IDs**: Avoid unstable or random ID generation; use clean, deterministic numeric IDs that persist properly in Dexie storage without breaking active module progress.

---

## 3. Approaches Considered

### Approach A: Comprehensive Authentic Alignment (Selected)
- Directly mirrors all 9 slides of Dr. Al-Horani's review handout.
- Replaces all artificial numbering with authentic sequential `Question 1`, `Question 2` labels.
- Implements interactive drag-and-drop matching matrices with clean Roman numeral chips for Slides 2, 3, 6, and 8.
- Implements multi-statement true/false evaluations (`sub-statements`) for Slides 6, 7, 8, and 9.
- **Trade-off**: Requires comprehensive restructuring of `respiratoryReviewModuleData.ts`, but establishes the true gold standard matching Exam 3.

### Approach B: Targeted Structure & Nomenclature Conversion
- Only converts Slide 2 (Adrenergics) and Slide 8 (Mechanisms) to drag-and-drop matching.
- Keeps Slides 3, 5, 6, and 7 as multiple-choice questions with stripped drug names.
- **Trade-off**: Quicker, but leaves several multi-structure categorization exercises as flat MCQs, failing to fully achieve Exam 3 parity.

### Approach C: Split into Two Focused Modules
- Splits the 9 slides into two modules: Bronchodilators (Slides 1–3) and Anti-inflammatories/Modulators (Slides 4–9).
- **Trade-off**: Fragments the professor's single 9-page handout into two dashboard items, diverging from course organization.

**Decision**: The user explicitly selected **Approach A**.

---

## 4. Detailed Slide-by-Slide Specification

### Slide 1: Fixed-Dose Inhaled Combinations & Mechanistic Synergy
- **Header**: Fixed-Dose Combination Inhalers (Anoro, Breo, Stiolto, Trelegy, Enerzair).
- **Structures**: Umeclidinium, Vilanterol, Fluticasone furoate, Tiotropium, Olodaterol, Indacaterol, Glycopyrrolate, Mometasone furoate.
- **Questions**:
  - `Question 1` (`type: 'matching'`): Match landmark combination inhalers to active molecular components and classes (Anoro $\to$ LAMA + LABA; Breo $\to$ ICS + LABA; Stiolto $\to$ LAMA + LABA; Trelegy $\to$ LAMA + ICS + LABA; Enerzair $\to$ LABA + LAMA + ICS).
  - `Question 2` (`type: 'sub-statements'`): True/False statements regarding mechanistic synergy (e.g., muscarinic $M_3$ blockade + $\beta_2$ Gs activation; ICS restoring $\beta_2$ receptor density via GR upregulation).
  - `Question 3` (`type: 'multiple-choice'`): Clinical rationale for single-inhaler triple therapy (SITT) over dual bronchodilation in frequent COPD exacerbators with eosinophilic inflammation.

### Slide 2: Adrenergic Bronchodilator SAR (Structures I–VII)
- **Header**: Structures I–VII:
  - `Structure I`: Isoproterenol (unlabeled chip: `Structure I`)
  - `Structure II`: Dobutamine (unlabeled chip: `Structure II`)
  - `Structure III`: Olodaterol (unlabeled chip: `Structure III`)
  - `Structure IV`: Salmeterol (unlabeled chip: `Structure IV`)
  - `Structure V`: Indacaterol (unlabeled chip: `Structure V`)
  - `Structure VI`: Pirbuterol (unlabeled chip: `Structure VI`)
  - `Structure VII`: Norepinephrine (unlabeled chip: `Structure VII`)
- **8 Distinct Worksheet Questions (Questions 1–8)**:
  - `Question 1` (`type: 'multiple-choice'`): Core active pharmacophore of adrenergic agonists ($\beta$-phenylethanolamine / aryl-$\beta$-ethanolamine with chiral $(R)$-$\beta$-OH, 2-carbon ethyl spacer, and amine).
  - `Question 2` (`type: 'multiple-choice'`): Nonselective $\alpha/\beta$-agonist identification. Options use clean Roman numerals (`Structure VII`, `Structure I`, `Structure II`, `Structure IV`) **without spoiled drug names**.
  - `Question 3` (`type: 'multiple-choice'`): Nonselective $\beta_1/\beta_2$-agonist identification. Options use clean Roman numerals (`Structure I`, `Structure II`, `Structure VI`, `Structure VII`) **without spoiled drug names**.
  - `Question 4` (`type: 'multiple-choice'`): Selective $\beta_1$-agonist identification. Options use clean Roman numerals (`Structure II`, `Structure I`, `Structure III`, `Structure V`) **without spoiled drug names**.
  - `Question 5` (`type: 'multiple-choice'`): Selective $\beta_2$-agonists identification. Options use clean Roman numerals (`Structures III, IV, V, and VI`, `Structures I, II, and VII`, etc.) **without spoiled drug names**.
  - `Question 6` (`type: 'multiple-choice'`): SABA vs LABA vs Ultra-LABA duration categorization referencing clean Roman numerals (`Structure VI = SABA; Structure IV = LABA; Structures III & V = Ultra-LABA`) **without spoiled drug names**.
  - `Question 7` (`type: 'multiple-choice'`): Clinical indication differentiation (Asthma/COPD maintenance vs cardiogenic shock vs septic shock) referencing clean Roman numerals **without spoiled drug names**.
  - `Question 8` (`type: 'multiple-choice'`): Metabolic vulnerability (COMT vs MAO) referencing clean Roman numerals (`Structures I, II, and VII metabolized by COMT; Structure VII deaminated by MAO; Structures III, IV, V, VI resistant to COMT`) **without spoiled drug names**.

### Slide 3: Anticholinergic Bronchodilators & Glucocorticoid Prototype Foundations
- **Section A**: Anticholinergic SAR (Structures I–V: Darifenacin, Trihexyphenidyl, Tiotropium, Aclidinium, Ipratropium):
  - `Question 1` (`type: 'multiple-choice'`): Chemical and pharmacological classes (distinguishing aminoamide Darifenacin and amino alcohol Trihexyphenidyl from quaternary amino ester/ether bronchodilators).
  - `Question 2` (`type: 'multiple-choice'`): Anticholinergic pharmacophore requirements.
  - `Question 3` (`type: 'multiple-choice'`): Pharmacokinetic localization: Quaternary ammonium center preventing blood-brain barrier penetration and confining action to the pulmonary tract.
  - `Question 4` (`type: 'multiple-choice'`): Soft drug esterase metabolism (Aclidinium plasma butyrylcholinesterase cleavage).
- **Section B**: Prototype Glucocorticoid (Hydrocortisone):
  - `Question 5` (`type: 'sub-statements'`): Terminology and classification (Adrenocorticoids vs Glucocorticoids vs Mineralocorticoids).
  - `Question 6` (`type: 'multiple-choice'`): Steroid carbon numbering system (C1 through C21) and key pharmacophoric substituents ($\Delta^4$-3-one, $11\beta$-OH, $17\alpha$-OH, C20 ketone, C21 primary alcohol).
  - `Question 7` (`type: 'multiple-choice'`): Cortisone vs Hydrocortisone structural and activity relationship ($11$-keto requires $11\beta$-HSD1 reduction to active $11\beta$-OH).

### Slide 4 & 5: Glucocorticoid Biosynthesis, Receptor Mechanism, Metabolism & Potency Ranking
- **Biosynthesis & Receptor Mechanism**:
  - `Question 1` (`type: 'multiple-choice'`): Adrenal cortex steroidogenesis sequence (CYP11A1, CYP17A1, CYP21A2, CYP11B1).
  - `Question 2` (`type: 'multiple-choice'`): Glucocorticoid receptor architecture (DBD, LBD, HSP90 chaperone dissociation, GRE binding, transrepression of NF-$\kappa$B/AP-1).
- **Metabolism & Potency Ranking**:
  - `Question 3` (`type: 'multiple-choice'`): Metabolic pathways (11$\beta$-HSD2 renal inactivation, ring-A 5-reduction to tetrahydrocortisol).
  - `Question 4` (`type: 'ranking'`): **Glucocorticoid Anti-inflammatory Potency Ranking**: Interactive ranking of 6 steroids (Dexamethasone > Methylprednisolone > Prednisolone > Hydrocortisone > Cortisone > Aldosterone).

### Slide 6 & 7: Inhaled Corticosteroid (ICS) Prodrugs, Formulations & SAR (Structures I–VI)
- **Header**: Structures I–VI (Triamcinolone acetonide, Beclomethasone dipropionate, Fluticasone propionate, Mometasone furoate, Ciclesonide, Hydrocortisone sodium succinate/phosphate):
  - `Question 1` (`type: 'sub-statements'`): 4-statement True/False battery regarding glucocorticoid backbone requirements, $11\beta$-OH, $\Delta^1$-dehydrogenation, and C21 lipophilic esters.
  - `Question 2` (`type: 'sub-statements'`): 3-statement True/False battery regarding $16\alpha,17\alpha$-acetal/ketal eliminating mineralocorticoid activity, $9\alpha$-fluoro enhancing potency, and non-mineralocorticoid synthetic derivatives.
  - `Question 3` (`type: 'multiple-choice'`): Formulation chemistry & metabolic activation of Beclomethasone dipropionate (pulmonary esterase cleavage to 17-BMP).

### Slide 7 & 8: Non-Steroidal Controllers: Xanthines, PDE4 Inhibitors & Leukotriene Modulators
- **Header**: Drug A (Theophylline) vs Drug B (Roflumilast):
  - `Question 1` (`type: 'sub-statements'`): 5 True/False statements distinguishing Drug A (methylxanthine, nonselective PDE inhibitor, adenosine antagonist) from Drug B (dichloropyridine-benzamide, selective PDE4 inhibitor).
  - `Question 2` (`type: 'multiple-choice'`): Second messenger signaling consequences of PDE inhibition (cAMP elevation $\to$ PKA activation).
  - `Question 3` (`type: 'sub-statements'`): Leukotriene pathway pharmacology: Zileuton (5-LOX inhibitor, LFT monitoring) vs Montelukast (CysLT1 receptor antagonist, boxed warning for neuropsychiatric events).

### Slide 8: Comprehensive Structure-to-Mechanism Matching (Structures I–VII to Mechanisms A–G)
- **Header**: Structures I–VII (unlabeled chips: `Structure I` through `Structure VII`):
  - `Structure I`: Aclidinium
  - `Structure II`: Methylprednisolone
  - `Structure III`: Ensifentrine
  - `Structure IV`: Montelukast
  - `Structure V`: Zileuton
  - `Structure VI`: Olodaterol
  - `Structure VII`: Theophylline
- **Interactive Drag & Drop Matching (Question 1)**:
  - Clean target labels **without spoiled structure names**:
    - Target A: *Muscarinic M3 receptor antagonist* $\to$ Accepted: `['I', 'aclidinium']`
    - Target B: *Phospholipase A2 (cPLA2) indirect inhibitor via Annexin A1 induction* $\to$ Accepted: `['II', 'methylprednisolone']`
    - Target C: *Dual Phosphodiesterase-3 and Phosphodiesterase-4 (PDE3/PDE4) inhibitor* $\to$ Accepted: `['III', 'ensifentrine']`
    - Target D: *Cysteinyl Leukotriene 1 (CysLT1) receptor antagonist* $\to$ Accepted: `['IV', 'montelukast']`
    - Target E: *5-Lipoxygenase (5-LOX) inhibitor* $\to$ Accepted: `['V', 'zileuton']`
    - Target F: *Selective beta-2 adrenergic receptor agonist* $\to$ Accepted: `['VI', 'olodaterol']`
    - Target G: *Nonselective Phosphodiesterase (PDE) inhibitor & adenosine receptor antagonist* $\to$ Accepted: `['VII', 'theophylline']`
  - `Question 2` (`type: 'multiple-choice'`): Formulation chemistry: Hydrocortisone sodium succinate (water-soluble IV prodrug for status asthmaticus) vs Beclomethasone dipropionate (lipophilic aerosol).
  - `Question 3` (`type: 'sub-statements'`): Leukotriene modulators: Montelukast vs Zileuton.

### Slide 9: Comparative Drug Analysis & Clinical Practice Scenarios
- **Section A**: Drug A (Beclomethasone dipropionate) vs Drug B (Hydrocortisone sodium succinate):
  - `Question 1` (`type: 'sub-statements'`): 10-statement True/False battery matching authentic Slide 9 handout items.
- **Section B**: Drug A (Tiotropium) vs Drug B (Pirbuterol):
  - `Question 2` (`type: 'sub-statements'`): 5-statement True/False battery matching authentic Slide 9 handout items.

---

## 5. Technical Constraints and State Management

1. **Storage Compatibility and Cache-Busting Strategy**:
   - `respiratoryReviewModuleData.ts` exports `getDefaultRespiratoryReviewModule(): ReviewModule`.
   - All questions conform strictly to the `AntiplateletQuestion` interface in `src/types/reviewModule.ts`.
   - **Dexie Cache-Busting**: To ensure returning users immediately receive the overhauled 9-slide layout and avoid corrupted question answer maps from legacy question IDs (`Q101..Q902`), the builder will increment the module version or reset the stored progress for `respiratory_review_mcp2` via `resetBuiltInModule('respiratory_review_mcp2')` upon initialization.
2. **Structure ID and Matching Target Conventions**:
   - Following the gold-standard pattern established in `antiplateletQuizData.ts`, each structure in an exercise set sets `id` corresponding to its Roman numeral (e.g. `id: 'I'`, `document_label: 'Structure I'`).
   - For maximum robustness, matching targets accept both the Roman numeral and the semantic identifier (e.g., `acceptedStructureIds: ['I', 'isoproterenol']`), ensuring smooth drop registration across all drag-and-drop mechanics.
   - Clean Roman numeral chip rendering (`Structure I`, `Structure II`, etc.) is strictly enforced without spoiled drug names in the chip text.
3. **Build & Type Safety**:
   - Zero TypeScript compilation errors (`npm run build`).

---

## 6. What's Left to the Builder

1. Ensuring complete test coverage and verification via automated script and build check.
2. Confirming that Dexie and local storage properly load and reset the overhauled module (`resetBuiltInModule('respiratory_review_mcp2')`).
3. Verification that all drag-and-drop matching targets have non-empty rationale strings for student feedback.

---

## 7. Builder Check Review Summary

- **Progress & Cache-Busting**: Settled as our call (automated module reset on version bump so legacy answer maps do not collide with new sequential questions).
- **Structure Matching ID Mapping**: Settled as our call (structures assigned clean Roman numeral IDs with dual-registration in `acceptedStructureIds: ['I', 'drug_id']` matching Exam 3 convention).

