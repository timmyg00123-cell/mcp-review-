# Exam 1 Interactive Review Modules & Flashcard Retry Design

**Date:** 2026-11-06  
**Status:** In Review (Brainstorming Phase)  
**Target:** Exam 1 Interactive Reviews (`renal_review_mcp2`, `respiratory_review_mcp2`), Flashcard Mode & Retry Deck  

---

## 1. Intent & The Why

### Why This Feature?
When students prepare for medicinal chemistry exams, generic multiple-choice questions fail to reproduce the high-yield structural reasoning tested by course faculty. In Dr. Rami A. Al-Horani's curriculum, exam reviews are conducted using rich slide workbenches containing numbered chemical structures (I–V), multi-statement True/False propositions requiring per-statement verification, and structural matching matrices connecting functional groups to mechanisms, acid/base behavior, and metabolic fates.

Exam 3 currently implements this gold-standard workflow via `antiarrhythmics_mcp2` ("Review for Antiarrhythmic Drugs"), utilizing `ReviewDeck`, `DocumentQuestionItem`, and `SubStatementReview`. 

The user uploaded two dedicated review slide decks for Exam 1:
1. `1)_Review_for_Respiratory_Drugs.pdf` (9 slides covering bronchodilator combinations, beta-2 adrenergic SAR, anticholinergics, glucocorticoid numbering & metabolism, prodrugs/soft steroids, PDE inhibitors, and leukotriene pathway modulators).
2. `2)_Review_for_Renal_Drugs.pdf` (3 slides covering diuretic classes I–V, acid/base classification, nephron site of action mapping, osmotic diuretics, and peptide comparisons).

Rather than standard 4-choice questions, the user requested that these review decks be transformed into **first-class interactive reviews identical to Exam 3**, accompanied by seamless flashcard support across all Exam 1 modules and a direct **"Retry Deck"** button when the flashcard queue completes.

---

## 2. Goals, Non-Goals, & Anti-Goals

### Goals
1. **Interactive Review for Renal Drugs (`renal_review_mcp2`)**:
   - Construct a multi-page interactive review matching Dr. Al-Horani's 3-slide review deck.
   - Render chemical structures I–V (Hydrochlorothiazide, Furosemide, Amiloride/Triamterene, Acetazolamide, Mannitol/Urea/Isosorbide, Tolvaptan/Peptides) with accurate 2D coordinates, SMILES, and pharmacophore highlights.
   - Provide interactive structure-to-class and structure-to-nephron matching questions.
   - Provide sub-statement True/False questions for acid/base classification, onset/duration, glaucoma indications, and sulfa cross-reactivity.
2. **Interactive Review for Respiratory Drugs (`respiratory_review_mcp2`)**:
   - Construct a multi-page interactive review matching Dr. Al-Horani's 9-slide review deck.
   - Cover dual/triple combination therapies (TRELEGY / ANORO / STIOLTO counterparts), adrenergic agonist SAR (Structures I–VII), anticholinergics (Structures I–V), hydrocortisone numbering/biosynthesis/metabolism, glucocorticoid potency ranking, prodrugs/soft steroids, methylxanthines vs PDE4 inhibitors, and leukotriene cascade modulators.
   - Provide sub-statement True/False questions with individualized, rigorous medchem rationales.
3. **Dedicated Module Organization (Approach A)**:
   - Register `renal_review_mcp2` and `respiratory_review_mcp2` as official built-in modules under `exam_1` in `EXAM_DEFINITIONS`.
   - Distinctly group or tag lecture study modules vs. interactive review modules in navigation.
4. **Flashcard Deck Integration & Retry Button**:
   - Ensure `StructureFlashcardDeck` loads chemical structures from both lecture modules and review modules for Exam 1.
   - Add a prominent **"Retry Deck"** button to the flashcard completion screen (`StructureFlashcardDeck.tsx`) allowing students to instantly restart or re-drill the deck without leaving the session.

### Non-Goals
- Altering the existing 3 lecture curriculum modules (`renal_drugs_mcp2`, `respiratory_bronchodilators_mcp2`, `respiratory_antiinflammatories_mcp2`). They remain intact for comprehensive chapter practice.
- Building Exam 2 modules in this step (Exam 2 will follow after Exam 1 interactive review and flashcard validation).

### Anti-Goals
- Converting review slide questions into generic 4-option multiple-choice questions (the user explicitly rejected this).
- Losing sub-statement rationales or flattening multi-part slide questions into single prompts.

---

## 3. Constraints
- **Platform Integrity**: Must compile cleanly with `npm run build` and `npx tsc --noEmit` under strict TypeScript checks.
- **Persistence**: All user answers (True/False states, matching matrix choices, flashcard spaced repetition intervals) must persist in `localStorage` without regressions.
- **Visual Parity**: Must utilize existing UI components (`ReviewDeck`, `DocumentQuestionItem`, `SubStatementReview`, `StructureFlashcardDeck`, `StructureFlashcardCardFace`) without breaking existing styling or theme support.

---

## 4. Approaches Considered & Selected

During brainstorming, three navigation and structural approaches were evaluated:

| Approach | Description | Trade-offs | Decision |
|---|---|---|---|
| **Approach A: Dedicated First-Class Review Modules** | Register `renal_review_mcp2` and `respiratory_review_mcp2` as standalone built-in modules alongside the 3 lecture modules. | Module dropdown has 5 modules for Exam 1, but keeps identical architecture to Exam 3, tracks progress independently, and isolates review slides cleanly. | **SELECTED (User Chosen)** |
| **Approach B: Tabbed Mode Inside Topic Modules** | Consolidate into 2 modules (Renal and Respiratory) with top toggle: "Lecture Questions" vs "Slide Review". | Requires major refactoring of module data structures and dual progress states in a single module. | Rejected |
| **Approach C: Global Slide Review Hub** | Move slide reviews outside the module list into a top-level study hub modal. | Disconnects reviews from module grading, progress bars, and completion badges. | Rejected |

**Why Approach A?**  
It maintains complete architectural symmetry with Exam 3 (where `antiarrhythmics_mcp2` is a first-class module), preserves existing state storage keys, and allows the flashcard engine to naturally aggregate structures across all built-in module IDs registered under the active exam.

---

## 5. Architectural & Data Specification

### 5.0 Runtime Architecture & Presentation Engine (Builder Clarifications)
- **Runtime Presentation**: The new modules (`renal_review_mcp2` and `respiratory_review_mcp2`) will follow the exact runtime architecture of `antiarrhythmics_mcp2`. They are authored as standard `ReviewModule` data structures, containing paginated `ReviewPage[]` and `ReviewSection[]`. `App.tsx` renders them using the high-performance `DocumentQuestionItem` component (which natively supports Roman numeral structure headers I–V, drag/target matching matrices, and expandable True/False sub-statement cards with instant rationales).
- **Interaction Format for Complex Slide Diagrams**: Complex pedagogical diagrams from the slides (e.g. hydrocortisone biosynthesis steps/enzymes, receptor translocation domains, hydrocortisone metabolic pathways, and leukotriene cascades) are modeled using structured `type: 'matching'` matrices and comprehensive `type: 'sub-statements'` True/False proposition batteries. This achieves 100% pedagogical fidelity to Dr. Al-Horani's testing without requiring fragile 2D canvas coordinate datasets.
- **Flashcard Filtering Architecture**: `StructureFlashcardDeck.tsx` will be upgraded from hardcoded Exam 3 filter checkboxes to **dynamic, exam-aware module filters**. The component will extract unique module tags or accept active exam module definitions, rendering filter pills that match the active exam (e.g. for Exam 1: *Renal Drugs*, *Bronchodilators*, *Anti-inflammatories*, *Slide Reviews*). Any card from the active exam is included by default.
- **Retry Deck Semantics**: "Retry Full Deck" resets the in-memory active queue to the full filtered set of cards, sets `currentIndex = 0`, and resets `isFlipped = false`. It preserves all persisted spaced-repetition intervals and long-term struggle diagnostics in `localStorage`, allowing students to drill the deck repeatedly without losing their learning analytics.

### 5.1 Renal Review Module (`renal_review_mcp2`)
- **Module ID**: `renal_review_mcp2`
- **Title**: `Review for Renal Drugs`
- **Subtitle**: `Diuretic Classes, Nephron Sites of Action, Sulfa Allergy & Vaptans`
- **File**: `src/data/renalReviewModuleData.ts`
- **Pages**:
  - **Page 1: Core Diuretics Classification & Pharmacology (Slide 1)**
    - Structures:
      - Structure I: Amiloride (Pyrazinopyrimidine derivative / ENaC blocker)
      - Structure II: Furosemide (Sulfamoyl anthranilic acid / Loop diuretic)
      - Structure III: Hydrochlorothiazide (Benzothiadiazine 1,1-dioxide / Thiazide)
      - Structure IV: Acetazolamide (Thiadiazole sulfonamide / CA inhibitor)
      - Structure V: Mannitol (Aliphatic polyalcohol / Osmotic diuretic)
    - Questions:
      - Q1: Matching structure to chemical class (Pyrazinopyrimidine, Sulfamoyl anthranilic acid, Benzothiadiazine dioxide, Thiadiazole sulfonamide, Aliphatic polyalcohol).
      - Q2: Acid/base classification matching (Weak acid vs Weak base vs Neutral polyol).
      - Q3: Pharmacological mechanistic class matching (NKCC2 inhibitor, NCC inhibitor, ENaC blocker, Carbonic anhydrase inhibitor, Osmotic agent).
      - Q4: Nephron site of action matching (Thick ascending limb, Distal convoluted tubule, Late distal tubule/collecting duct, Proximal tubule).
      - Q5–Q11: Multi-statement True/False and selection questions covering fastest/most acidic (Furosemide), diuretic efficacy ranking, glaucoma use (Acetazolamide), pure enzyme inhibition, and sulfa hypersensitivity cross-reactivity.
  - **Page 2: Osmotic Diuretics, Non-Diuretics & Peptide Hormone Vaptans (Slide 2)**
    - Structures:
      - Structure I: Mannitol
      - Structure II: Isosorbide / Urea
      - Structure III: Tolvaptan / Conivaptan
      - Structure IV: Peptide Hormones (Vasopressin vs Desmopressin vs Oxytocin)
    - Questions:
      - Osmotic diuretic identification & PK requirements (lack of tubular reabsorption).
      - Non-diuretic molecule identification.
      - Vasopressin vs Desmopressin comparative pharmacology (V2 selectivity, 1-deamino-8-D-arginine modifications).
  - **Page 3: Nephron Site of Action Comprehensive Matching (Slide 3)**
    - Interactive matching of Diuretics 1–4 to Nephron Regions a–e (Proximal tubule, Descending thin limb, Thick ascending limb, Distal convoluted tubule, Cortical collecting duct) with efficacy ranking.

### 5.2 Respiratory Review Module (`respiratory_review_mcp2`)
- **Module ID**: `respiratory_review_mcp2`
- **Title**: `Review for Respiratory Drugs`
- **Subtitle**: `Adrenergic Agonists, Anticholinergics, Steroids, PDE Inhibitors & Leukotrienes`
- **File**: `src/data/respiratoryReviewModuleData.ts`
- **Pages**:
  - **Page 1: Combination Bronchodilator Regimens (Slide 1)**
    - Structures & entities: Umeclidinium, Fluticasone furoate, Vilanterol, Olodaterol, Tiotropium.
    - Questions: Pharmacophoric requirements and dual/triple combination rationale (LAMA + LABA + ICS).
  - **Page 2: Adrenergic Agonists SAR & Duration (Slide 2)**
    - Structures: Epinephrine, Isoproterenol, Albuterol, Levalbuterol, Salmeterol, Formoterol, Indacaterol/Vilanterol (Structures I–VII).
    - Questions: Catecholamine pharmacophore, alpha vs beta selectivity, beta-2 selectivity via bulky N-substituents, SABA vs LABA vs Ultra-LABA duration determinants, COMT/MAO susceptibility.
  - **Page 3: Anticholinergics & Hydrocortisone Prototype (Slide 3)**
    - Structures: Ipratropium, Tiotropium, Aclidinium, Umeclidinium, Glycopyrrolate (quaternary ammonium centers preventing BBB penetration) + Hydrocortisone prototype.
    - Questions: Amino ester vs amino ether vs amino propane classification, quaternary ammonium lung localization, steroid carbon numbering, glucocorticoid receptor binding.
  - **Page 4: Hydrocortisone Biosynthesis & Glucocorticoid Receptor Activation (Slide 4)**
    - Pathways: Cholesterol -> Pregnenolone -> 17a-OH -> 11-Deoxycortisol -> Hydrocortisone.
    - Questions: Cytochrome P450 hydroxylases (CYP11B1, CYP17A1, CYP21A2), intracellular receptor dimerization, nuclear translocation, GRE binding.
  - **Page 5: Glucocorticoid Metabolism & Potency Ranking (Slide 5)**
    - Metabolic pathways: 11-beta-HSD1 (activation) vs 11-beta-HSD2 (inactivation), 5a/5b reduction, 3a reduction, Phase II glucuronidation.
    - Questions: Structural modifications prolonging half-life (1,2-dehydro double bond, 6a-methyl, 16a-methyl/hydroxyl). Glucocorticoid potency ranking.
  - **Page 6: Glucocorticoid Prodrugs, Soft Steroids & High-Yield True/False (Slide 6)**
    - Structures: Fluticasone propionate, Beclomethasone dipropionate, Budesonide, Ciclesonide, Mometasone furoate.
    - Questions: Soft steroid definition, di-ester prodrug activation, ketal/acetal C16–C17 masks reducing mineralocorticoid affinity. Comprehensive 7 True/False statements.
  - **Page 7: Metabolic Activations & Methylxanthines vs PDE4 Inhibitors (Slide 7)**
    - Transformations: Prednisone -> Prednisolone; Fluticasone propionate lung activation; Beclomethasone dipropionate blood inactivation.
    - Paired comparisons: Drug A (Theophylline / methylxanthine) vs Drug B (Roflumilast / dichloropyridine benzamide).
  - **Page 8: Leukotriene Biosynthetic Cascade & Dual Drug Comparisons (Slide 8)**
    - Cascade: 5-LOX + FLAP -> LTA4 -> LTB4 / LTC4 -> LTD4 -> LTE4.
    - Questions: Zileuton (5-LOX inhibitor) vs Montelukast/Zafirlukast (CysLT1 antagonist). True/False comparison matrix.
  - **Page 9: Paired High-Yield MedChem Vignettes (Slide 9)**
    - Final comparative True/False evaluations: Drug A vs Drug B across glucocorticoids, anticholinergics, and beta-2 agonists.

### 5.3 Exam 1 Registration (`src/types/examTypes.ts`)
Update `EXAM_DEFINITIONS` for `exam_1`:
```typescript
{
  id: 'exam_1',
  code: 'Exam 1',
  title: 'Exam 1: Renal & Respiratory Medicinal Chemistry',
  shortTitle: 'Renal & Respiratory',
  description: 'Diuretics, Vaptans, Bronchodilators, Glucocorticoids, Antileukotrienes & Slide Reviews.',
  chapters: 'Modules 1–5',
  builtInModuleIds: [
    'renal_drugs_mcp2',
    'respiratory_bronchodilators_mcp2',
    'respiratory_antiinflammatories_mcp2',
    'renal_review_mcp2',
    'respiratory_review_mcp2',
  ],
  defaultModuleId: 'renal_drugs_mcp2',
  isAvailable: true,
}
```

### 5.4 Flashcard Deck Engine & "Retry Deck" Button
- In `StructureFlashcardDeck.tsx`:
  - When all cards in the active session queue are reviewed, the screen currently displays "Flashcard Session Complete!" with "View Struggle Diagnostics" and "Finish Session Early".
  - Add a primary **"Retry Deck"** button:
    ```tsx
    <button
      type="button"
      onClick={handleRestartDeck}
      className="px-6 py-2.5 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
    >
      <RotateCcw className="w-4 h-4" />
      Retry Full Deck
    </button>
    ```
  - `handleRestartDeck`: Resets `activeQueue` to the initial cards array (or resets struggle flags in working deck), resets `currentIndex` to 0, and clears flipped state.
  - Ensure `loadExamFlashcards` in `moduleStorage.ts` collects structures from all modules registered in `builtInModuleIds`, including the new review modules.

---

## 6. What's Left to the Builder
- Detailed chemical SMILES strings and exact 2D structure definitions for all molecules across both review modules.
- Formulating precise explanation strings for each sub-statement based on medicinal chemistry textbooks and Dr. Al-Horani's lecture notes.
- Icon selection and color accent tagging for the review modules in navigation.

---

## 7. Verification & Testing Plan
1. **TypeScript Typecheck**: `npx tsc --noEmit` must pass with 0 errors.
2. **Vite Production Build**: `npm run build` must compile cleanly.
3. **Interactive Review Validation**:
   - Verify `renal_review_mcp2` renders 3 pages with structures I–V, matching targets, and sub-statement True/False accordions.
   - Verify `respiratory_review_mcp2` renders 9 pages with all questions, structures, and metabolic diagrams.
4. **Flashcard Validation**:
   - Open Flashcard mode in Exam 1.
   - Verify cards include renal and respiratory structures.
   - Complete a deck session and click **"Retry Full Deck"** to verify the deck immediately resets to Card 1 without reloading.
