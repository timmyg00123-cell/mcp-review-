# Design Document: Exam 1 Curriculum Modules & Cumulative Practice Suite

## 1. Context & Background
With Exam 3 (Cardiovascular) and Exam 2 (Antihypertensives & Antihyperlipidemics) fully functional and scope-isolated, the user provided the official Fall 2026 course materials from Dr. Rami A. Al-Horani for **Exam 1**.

The materials encompass:
1. **Renal Drugs (Medicinal Chemistry Aspects)**:
   - Diuretic classes: Thiazides, Loops, Potassium-Sparing, Carbonic Anhydrase Inhibitors (CAIs), Osmotic Diuretics.
   - Antidiuretic Hormone (ADH / Vasopressin) Agonists: Vasopressin, Desmopressin, Terlipressin.
   - ADH Antagonists (Vaptans): Conivaptan, Tolvaptan.
   - Hyperkalemia Ion-Exchange Resins / Binders: Sodium Polystyrene Sulfonate, Patiromer, Sodium Zirconium Cyclosilicate.
2. **Respiratory Drugs (Medicinal Chemistry Aspects - Asthma & COPD)**:
   - Bronchodilators:
     - $\beta_2$-Agonists: SABA (*Albuterol, Levalbuterol, Pirbuterol, Terbutaline*), LABA (*Salmeterol, Formoterol*), ultra-LABA (*Arformoterol, Indacaterol, Olodaterol*).
     - Antimuscarinics: SAMAs (*Ipratropium*), LAMAs (*Tiotropium, Aclidinium, Umeclidinium, Glycopyrrolate*).
     - Methylxanthines (*Theophylline, Aminophylline*).
     - Phosphodiesterase (PDE) Inhibitors (*Roflumilast* - PDE4, *Ensifentrine* - PDE3/4).
   - Glucocorticoids:
     - Steroid nucleus, 5$\alpha$-pregnane conformation, hydrocortisone prototype, biosynthesis, and nuclear glucocorticoid receptor dimerization / zinc finger binding.
     - SAR of systemic agents (*Prednisone, Prednisolone, Methylprednisolone, Dexamethasone, Triamcinolone*).
     - Prodrug strategies: emergency water-soluble C21-esters (*sodium succinate, sodium phosphate*) vs lipophilic C21-esters/diesters (*acetate, dipropionate*).
     - Locally acting "soft steroids" with rapid blood clearance: *Ciclesonide, Budesonide, Fluticasone propionate/furoate, Mometasone furoate, Beclomethasone dipropionate*.
   - Antileukotrienes:
     - Leukotriene pathway: Phospholipase A2, 5-LOX + FLAP, LTA4 $\to$ LTB4 vs LTC4/LTD4/LTE4.
     - 5-LOX Inhibitor: *Zileuton*.
     - Cysteinyl Leukotriene Receptor Antagonists (LTRAs): *Montelukast, Zafirlukast*.
   - Inhalation Combinations (*Stiolto, Duaklir, Breztri, Trelegy, Enerzair*).

The user selected **Option B (3 Focused Modular Units)**.

---

## 2. Goals & Non-Goals

### Goals
1. Implement 3 curriculum review modules for Exam 1:
   - `renal_drugs_mcp2`: **Renal Drugs: Diuretics, Vaptans & K$^+$-Binders** (30 questions, IDs 101–130)
   - `respiratory_bronchodilators_mcp2`: **Respiratory Bronchodilators & PDE Inhibitors** (32 questions, IDs 141–172)
   - `respiratory_antiinflammatories_mcp2`: **Respiratory Anti-Inflammatories: Steroids & Leukotrienes** (34 questions, IDs 181–214)
   - Total: **96 comprehensive curriculum review questions** directly grounded in Dr. Al-Horani's lecture and review slides.
2. Build an Exam 1 Chemical Structures database (`src/data/exam1/exam1Structures.ts`) with PubChem CIDs, SMILES, MW, LogP, targets, reversibility, and detailed SAR notes (~50 landmark structures).
3. Expand `src/utils/clinicalPharmacologyDictionary.ts` with curated profiles for Exam 1 drugs (metabolism pathways, BBB penetrance, pregnancy risk).
4. Build the Exam 1 Cumulative Practice Exam (`src/data/exam1/exam1CumulativeQuizData.ts`) with 16 clinical deduction questions covering all 4 question types (Type A: Case $\to$ Structure, Type B: Structure $\to$ Effect, Type C: Comparative SAR, Type D: Contraindication/Risk).
5. Wire Exam 1 into `src/types/examTypes.ts` with `isAvailable: true`, update `moduleStorage.ts`, and wire the cumulative question bank & flashcards.
6. Verify 0 TypeScript errors and 100% test pass rate with zero regression to Exam 2 or Exam 3.

### Non-Goals
- Altering existing Exam 2 or Exam 3 content, IDs, or tests.
- Re-architecting the Navbar dropdown or study hub modal (already verified and working).

---

## 3. Architecture & Module Design

### 3.1 Module 1: `renal_drugs_mcp2`
- **Title**: Renal Drugs: Diuretics, Vaptans & Potassium Binders
- **Pages**:
  1. *Diuretic Mechanisms & Nephron Segments*: NCC, NKCC2, ENaC, CA, osmotic mechanics. Acid/base/neutral classification, relative efficacy ranking.
  2. *CAIs, Osmotics & Landmark SAR*: Thiadiazole sulfonamides, polyalcohols (Mannitol vs Glucose), sulfa-allergy risks.
  3. *ADH Modifiers & Potassium Binders*: Vasopressin vs Desmopressin vs Terlipressin (VR1 vs VR2, bleeding disorders, hepatorenal syndrome); Conivaptan & Tolvaptan; Sodium polystyrene sulfonate, Patiromer, Lokelma.

### 3.2 Module 2: `respiratory_bronchodilators_mcp2`
- **Title**: Respiratory Bronchodilators & PDE Inhibitors
- **Pages**:
  1. *$\beta_2$-Agonist SAR & Duration Evolution*: Phenylethanolamine pharmacophore, bulky N-substituents, SABA (*Albuterol, Levalbuterol R vs S enantiomer*), LABA (*Salmeterol, Formoterol*), ultra-LABA (*Indacaterol, Olodaterol*).
  2. *Antimuscarinic Bronchodilators (SAMAs & LAMAs)*: 4° ammonium moiety (lung localization, no BBB crossing), thiophene bioisosterism, ester vs ether linkers (*Ipratropium, Tiotropium, Aclidinium, Umeclidinium, Glycopyrrolate*).
  3. *Methylxanthines, PDE3/4 Inhibitors & Regimens*: Theophylline CYP1A2 metabolism and adenosine antagonism, Roflumilast (PDE4, dichloropyridine-benzamide), Ensifentrine (inhaled PDE3/4), inhaler combinations (*Stiolto, Duaklir, Trelegy*).

### 3.3 Module 3: `respiratory_antiinflammatories_mcp2`
- **Title**: Respiratory Anti-Inflammatories: Steroids & Leukotriene Modifiers
- **Pages**:
  1. *Glucocorticoid Nucleus, Biosynthesis & Receptor Activation*: Steroid numbering, 5$\alpha$-pregnane all-trans conformation, nuclear receptor homodimerization and zinc finger DNA binding.
  2. *Glucocorticoid SAR, Prodrugs & Soft Steroids*: 11$\beta$-OH vs 11-keto, 1-dehydro (ring A flattening), 9$\alpha$-F / 16$\alpha$-methyl distinctions; emergency water-soluble C21-esters (*sodium succinate, sodium phosphate*) vs lipophilic C21-esters; locally acting soft steroids (*Ciclesonide, Budesonide, Fluticasone, Mometasone*).
  3. *Leukotriene Pathway & Antileukotriene Pharmacology*: Phospholipase A2 $\to$ 5-LOX $\to$ CysLTs; Zileuton (5-LOX) vs Montelukast/Zafirlukast (CysLT1 receptor antagonists); Montelukast neuropsychiatric black box warning and CYP metabolism.

---

## 4. Chemical Structures & Clinical Pharmacology

### 4.1 Chemical Structures (`src/data/exam1/exam1Structures.ts`)
~50 curated landmark chemical structures with PubChem CIDs, SMILES, and detailed SAR notes:
- **Renal**: Chlorothiazide, Hydrochlorothiazide, Furosemide, Triamterene, Spironolactone, Acetazolamide, Dichlorphenamide, Brinzolamide, Dorzolamide, Methazolamide, Mannitol, Sorbitol, Conivaptan, Tolvaptan.
- **Bronchodilators**: Isoproterenol, Albuterol, Levalbuterol, Pirbuterol, Terbutaline, Salmeterol, Formoterol, Arformoterol, Indacaterol, Olodaterol, Ipratropium, Tiotropium, Aclidinium, Umeclidinium, Glycopyrrolate, Theophylline, Aminophylline, Roflumilast, Ensifentrine.
- **Anti-Inflammatories & Leukotriene Modifiers**: Hydrocortisone, Cortisone, Prednisone, Prednisolone, Methylprednisolone, Dexamethasone, Triamcinolone, Flunisolide, Beclomethasone dipropionate, Budesonide, Ciclesonide, Fluticasone propionate, Fluticasone furoate, Mometasone furoate, Zileuton, Montelukast, Zafirlukast.

### 4.2 Clinical Pharmacology Profiles
- **Metabolism**: e.g., Theophylline CYP1A2 interindividual variation, Montelukast CYP3A4/2C8/2C9, Cortisone $\to$ Hydrocortisone via 11$\beta$-HSD1 in liver, Roflumilast $N$-oxidation.
- **Blood-Brain Barrier**: e.g., 4° ammonium antimuscarinics (Ipratropium, Tiotropium) cannot cross BBB (lung-selective); Montelukast crosses BBB (neuropsychiatric black box warning); Mannitol does not cross intact BBB (draws fluid from brain into vascular space to lower ICP).
- **Pregnancy Safety**: e.g., Inhaled Budesonide (historic Category B, preferred ICS in pregnancy), Montelukast (Category B), Albuterol (Category C, preferred SABA), Triamcinolone/Dexamethasone (Category C), Tolvaptan (Category C).

---

## 5. Exam 1 Cumulative Practice Test (`exam1CumulativeQuizData.ts`)
16 curated multi-choice clinical cross-curriculum deduction questions:
- 4 **Type A (Case $\to$ Structure)**
- 4 **Type B (Structure $\to$ Effect)**
- 4 **Type C (Comparative SAR)**
- 4 **Type D (Contraindication & Risk Deductions)**

---

## 6. Integration & Compatibility Plan
1. `src/types/examTypes.ts`:
   - Update `exam_1` with:
     ```typescript
     title: 'Exam 1: Renal & Respiratory Medicinal Chemistry',
     shortTitle: 'Renal & Respiratory',
     description: 'Diuretics, ADH modifiers, bronchodilators, glucocorticoid SAR, and antileukotrienes.',
     chapters: 'Renal & Respiratory',
     builtInModuleIds: [
       'renal_drugs_mcp2',
       'respiratory_bronchodilators_mcp2',
       'respiratory_antiinflammatories_mcp2'
     ],
     defaultModuleId: 'renal_drugs_mcp2',
     isAvailable: true,
     ```
2. `src/utils/moduleStorage.ts`:
   - Register the 3 module IDs in `ALL_BUILTIN_MODULE_IDS`.
   - Add loaders in `loadAllReviewModules()` and `initModuleStorageFromDexie()`.
3. `src/data/cumulativeQuizData.ts`:
   - Connect `CUMULATIVE_QUESTIONS_EXAM_1` to `exam1CumulativeQuizData.ts`.
4. `src/utils/cumulativeStructureHarvester.ts`:
   - Include Exam 1 structures in flashcard deck harvesting.

---

## 7. Testing Strategy
- Create `tests/exam1Modules.test.ts`:
  - Verify all 3 module getters, 96 questions (distinct IDs 101–130, 141–172, 181–214), non-empty explanations, and high-yield pearls.
  - Verify all landmark structures exist with valid CIDs, SMILES, and SAR notes.
  - Verify clinical pharmacology dictionary lookups for Exam 1 drugs.
  - Verify module storage registration and isolation.
- Update `tests/multiExamScaffolding.test.ts`:
  - Assert `exam_1`, `exam_2`, and `exam_3` are all available (`isAvailable: true`).
  - Total built-in modules = 12 (3 for Exam 1, 5 for Exam 2, 4 for Exam 3).
- Run `npx tsc --noEmit` and `npm run build` to confirm 0 compile/build issues.
