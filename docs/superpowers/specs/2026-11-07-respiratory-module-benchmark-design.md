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
  - `Structure I`: Isoproterenol
  - `Structure II`: Dobutamine
  - `Structure III`: Olodaterol
  - `Structure IV`: Salmeterol
  - `Structure V`: Indacaterol
  - `Structure VI`: Pirbuterol
  - `Structure VII`: Norepinephrine
- **Questions**:
  - `Question 1` (`type: 'multiple-choice'`): Core active pharmacophore of adrenergic agonists ($\beta$-phenylethanolamine / aryl-$\beta$-ethanolamine with chiral $(R)$-$\beta$-OH, 2-carbon ethyl spacer, and amine).
  - `Question 2` (`type: 'matching'`): **Adrenergic Receptor Selectivity Classification**:
    - Target: *Nonselective $\alpha/\beta$-agonist* $\to$ Accepted: `['VII']` (Norepinephrine)
    - Target: *Selective $\beta_1/\beta_2$-agonist* $\to$ Accepted: `['I']` (Isoproterenol)
    - Target: *Selective $\beta_1$-agonist (inotropic/shock)* $\to$ Accepted: `['II']` (Dobutamine)
    - Target: *Selective $\beta_2$-agonists (bronchodilators)* $\to$ Accepted: `['III', 'IV', 'V', 'VI']` (Olodaterol, Salmeterol, Indacaterol, Pirbuterol)
  - `Question 3` (`type: 'matching'`): **$\beta_2$-Agonist Duration of Action Classification**:
    - Target: *Short-Acting $\beta_2$-Agonist (SABA, 4–6 hr)* $\to$ Accepted: `['VI']` (Pirbuterol)
    - Target: *Long-Acting $\beta_2$-Agonist (LABA, 12 hr)* $\to$ Accepted: `['IV']` (Salmeterol)
    - Target: *Ultra-Long-Acting $\beta_2$-Agonist (Ultra-LABA, 24 hr)* $\to$ Accepted: `['III', 'V']` (Olodaterol, Indacaterol)
  - `Question 4` (`type: 'matching'`): **Clinical Indication Differentiation**:
    - Target: *Asthma and COPD Maintenance/Relief* $\to$ Accepted: `['III', 'IV', 'V', 'VI']`
    - Target: *Acute Decompensated Heart Failure / Cardiogenic Shock* $\to$ Accepted: `['II']`
    - Target: *Vasodilatory / Septic Shock* $\to$ Accepted: `['VII']`
  - `Question 5` (`type: 'matching'`): **Metabolic Vulnerability (COMT vs MAO)**:
    - Target: *Substrate for COMT (Intact 3,4-dihydroxy catechol ring)* $\to$ Accepted: `['I', 'II', 'VII']`
    - Target: *Resistant to COMT (Saligenin / Carbostyril / Indane bioisosteres)* $\to$ Accepted: `['III', 'IV', 'V', 'VI']`
    - Target: *Substrate for MAO deamination (Unsubstituted primary amine)* $\to$ Accepted: `['VII']`

### Slide 3: Anticholinergic Bronchodilators & Glucocorticoid Prototype Foundations
- **Section A**: Anticholinergics (Structures I–V: Ipratropium, Tiotropium, Aclidinium, Umeclidinium, Glycopyrrolate):
  - `Question 1` (`type: 'multiple-choice'`): Pharmacological class (competitive $M_3$ muscarinic antagonist) and chemical classes (amino ester, quinuclidine alcohol, pyrrolidinium ester).
  - `Question 2` (`type: 'multiple-choice'`): Anticholinergic pharmacophore requirements (bulky lipophilic aryl/cycloalkyl groups, ester or ether linker, basic or quaternary nitrogen spaced by 2–3 carbons).
  - `Question 3` (`type: 'matching'`): **Pharmacokinetic Localization & Metabolism**:
    - Target: *Quaternary ammonium center (permanently charged, limits oral/systemic absorption)* $\to$ Accepted: `['I', 'II', 'III', 'IV', 'V']`
    - Target: *Soft drug engineered for rapid plasma butyrylcholinesterase cleavage* $\to$ Accepted: `['III']` (Aclidinium)
    - Target: *Non-ester quinuclidine alcohol resistant to esterase hydrolysis* $\to$ Accepted: `['IV']` (Umeclidinium)
- **Section B**: Prototype Glucocorticoid (Hydrocortisone):
  - `Question 4` (`type: 'sub-statements'`): Terminology and classification (Adrenocorticoids vs Glucocorticoids vs Mineralocorticoids).
  - `Question 5` (`type: 'multiple-choice'`): Steroid carbon numbering system (C1 through C21) and key pharmacophoric substituents ($\Delta^4$-3-one, $11\beta$-OH, $17\alpha$-OH, C20 ketone, C21 primary alcohol).
  - `Question 6` (`type: 'multiple-choice'`): Cortisone vs Hydrocortisone structural and activity relationship ($11$-keto requires $11\beta$-HSD1 reduction to active $11\beta$-OH).

### Slide 4 & 5: Glucocorticoid Biosynthesis, Receptor Mechanism & Metabolism
- **Biosynthesis & Receptor Mechanism**:
  - `Question 1` (`type: 'multiple-choice'`): Adrenal cortex steroidogenesis sequence (Cholesterol $\to$ Pregnenolone $\to$ $17\alpha$-OH Pregnenolone $\to$ $17\alpha$-OH Progesterone $\to$ 11-Deoxycortisol $\to$ Hydrocortisone via CYP11A1, CYP17A1, CYP21A2, and CYP11B1).
  - `Question 2` (`type: 'matching'`): Glucocorticoid receptor architecture (DBD, LBD, AF-1, AF-2) and molecular activation steps (chaperone dissociation, ligand binding, homodimerization, nuclear translocation, GRE binding/transrepression of NF-$\kappa$B).
- **Metabolism & Duration Optimization**:
  - `Question 3` (`type: 'matching'`): Match metabolic pathways to enzymes and metabolites (Pathway 1: $11\beta$-HSD2 oxidation to cortisone; Pathway 2: $5\alpha/\beta$-reductase and $3\alpha$-hydroxysteroid dehydrogenase reduction of Ring A; Pathway 3: C20 reduction).
  - `Question 4` (`type: 'multiple-choice'`): Structural modifications that retard metabolism and enhance anti-inflammatory potency ($\Delta^1$-dehydrogenation, $6\alpha$/$9\alpha$-halogenation, $16\alpha$-methylation/acetalation).

### Slide 5 & 6: Inhaled Corticosteroid (ICS) Prodrugs & Formulations (Structures I–VI)
- **Header**: Structures I–VI:
  - `Structure I`: Hydrocortisone sodium succinate
  - `Structure II`: Hydrocortisone sodium phosphate
  - `Structure III`: Beclomethasone dipropionate
  - `Structure IV`: Fluticasone propionate
  - `Structure V`: Ciclesonide
  - `Structure VI`: Mometasone furoate
- **Questions**:
  - `Question 1` (`type: 'matching'`): **Prodrug & Physicochemical Classification**:
    - Target: *Hydrophilic water-soluble ester prodrug for emergency IV parenteral administration* $\to$ Accepted: `['I', 'II']`
    - Target: *Lipophilic di-ester prodrug activated by pulmonary esterases* $\to$ Accepted: `['III']` (Beclomethasone dipropionate)
    - Target: *Lipophilic soft steroid prodrug containing a cyclic acetal (converted to active des-ciclesonide in lung)* $\to$ Accepted: `['V']` (Ciclesonide)
    - Target: *Active, ultra-lipophilic inhaled corticosteroid with extensive first-pass hepatic clearance* $\to$ Accepted: `['IV', 'VI']`
  - `Question 2` (`type: 'sub-statements'`): **Glucocorticoid SAR Truth Matrix**:
    - All-trans cyclopentanoperhydrophenanthrene backbone and $\Delta^4$-3-one are essential for anti-inflammatory activity.
    - $11\beta$-hydroxyl group is strictly required for glucocorticoid receptor agonist activity.
    - $\Delta^1$-double bond (prednisolone/dexamethasone) flattens ring A, increasing anti-inflammatory potency ~4-fold and reducing mineralocorticoid activity.
    - $9\alpha$-fluoro substitution substantially increases glucocorticoid potency via electron withdrawal enhancing $11\beta$-OH hydrogen bonding.
    - $16\alpha,17\alpha$-acetal/ketal or $16\alpha$-methyl groups eliminate mineralocorticoid salt-retaining activity.
  - `Question 3` (`type: 'matching'`): **Metabolic Activation & Inactivation Transformations**:
    - Target: *Activation in lung via esterase cleavage of C21 isobutyrate* $\to$ Accepted: `['V']` (Ciclesonide)
    - Target: *Activation in lung via sequential ester cleavage (dipropionate $\to$ 17-monopropionate)* $\to$ Accepted: `['III']` (Beclomethasone dipropionate)
    - Target: *Rapid metabolic inactivation in blood/liver via CYP3A4 17$\beta$-carbothioate hydrolysis* $\to$ Accepted: `['IV']` (Fluticasone propionate)

### Slide 7 & 8: Non-Steroidal Controllers: Xanthines, PDE4 Inhibitors & Leukotriene Modulators
- **Header**: Drug A (Theophylline) vs Drug B (Roflumilast):
  - `Question 1` (`type: 'sub-statements'`): True/False propositions distinguishing Drug A (methylxanthine, nonselective PDE inhibitor, adenosine receptor antagonist, narrow therapeutic window) from Drug B (dichloropyridine-benzamide, selective PDE4 inhibitor, once-daily oral tablet for severe COPD with chronic bronchitis).
  - `Question 2` (`type: 'multiple-choice'`): Second messenger signaling consequences of PDE inhibition (elevation of intracellular cAMP $\to$ PKA activation $\to$ relaxation of airway smooth muscle and suppression of inflammatory mediator release).
  - `Question 3` (`type: 'sub-statements'`): Leukotriene pathway pharmacology: Zileuton (5-lipoxygenase inhibitor, requires LFT monitoring) vs Montelukast / Zafirlukast (CysLT1 receptor antagonists blocking $LTC_4, LTD_4, LTE_4$).

### Slide 8: Comprehensive Structure-to-Mechanism Matching (Structures I–VII to Mechanisms A–F)
- **Header**: Structures I–VII (unlabeled):
  - `Structure I`: Salmeterol ($\beta_2$-agonist)
  - `Structure II`: Tiotropium ($M_3$ muscarinic antagonist)
  - `Structure III`: Theophylline (Nonselective PDE inhibitor) / Roflumilast (PDE4 inhibitor)
  - `Structure IV`: Zileuton (5-Lipoxygenase inhibitor)
  - `Structure V`: Montelukast (CysLT1 leukotriene receptor antagonist)
  - `Structure VI`: Fluticasone propionate (Glucocorticoid receptor agonist)
  - `Structure VII`: Ipratropium ($M_3$ muscarinic antagonist)
- **Questions**:
  - `Question 1` (`type: 'matching'`): **Structure-to-Mechanism Matching**:
    - Target: *Mechanism A: $\beta_2$-Adrenergic Receptor Agonist* $\to$ Accepted: `['I']`
    - Target: *Mechanism B: $M_3$ Muscarinic Receptor Antagonist* $\to$ Accepted: `['II', 'VII']`
    - Target: *Mechanism C: Phosphodiesterase (PDE) Inhibitor* $\to$ Accepted: `['III']`
    - Target: *Mechanism D: 5-Lipoxygenase (5-LOX) Inhibitor* $\to$ Accepted: `['IV']`
    - Target: *Mechanism E: Cysteinyl Leukotriene 1 (CysLT1) Receptor Antagonist* $\to$ Accepted: `['V']`
    - Target: *Mechanism F: Glucocorticoid Receptor (GR) Nuclear Agonist* $\to$ Accepted: `['VI']`

### Slide 9: Comparative Drug Analysis & Clinical Practice Scenarios
- **Section A**: Drug A (Inhaled Fluticasone) vs Drug B (IV Hydrocortisone sodium succinate):
  - `Question 1` (`type: 'sub-statements'`): True/False statements evaluating route, onset, prodrug nature, mineralocorticoid activity, and emergency vs maintenance roles.
- **Section B**: Drug A (Antimuscarinic Glycopyrrolate) vs Drug B (Adrenergic Indacaterol):
  - `Question 2` (`type: 'sub-statements'`): True/False statements contrasting amino-ester antimuscarinic bronchodilators with $\beta$-phenylethanolamine adrenergic agonists.

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

