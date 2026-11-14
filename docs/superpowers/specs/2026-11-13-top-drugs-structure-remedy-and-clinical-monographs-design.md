# Top 200 Flashcards Structure Remedy & Clinical Monograph Flashcards Design

**Date**: 2026-11-13  
**Status**: Final Design (Awaiting User Sign-Off)  
**Target Area**: Practice Lab (`PracticeLabView.tsx`), Top Drugs Taxonomy (`topDrugsTaxonomy.ts`, `topDrugsTaxonomyData.ts`), Chemoinformatics & Clinical Data Layers (`topDrugsSmilesData.ts`, `topDrugsClinicalData.ts`), and Multi-Structure Canvas (`MultiSmilesCanvas.tsx`).

---

## 1. Intent and The Why

The Top 200 Structure Flashcards deck in the Practice Lab is intended to provide Xavier University College of Pharmacy students with rigorous active visual recall training from chemical structure to drug identity, mechanism, and therapeutic classification.

An empirical audit of the current implementation revealed a critical defect: out of 250 drugs cataloged in `TOP_DRUGS_TAXONOMY`, only 57 entries have authentic Daylight SMILES mapped in `TOP_DRUG_CURATED_SMILES`. The remaining 193 medications (77.2%) silently fall back to `DEFAULT_FALLBACK_SMILES = 'c1ccccc1'` (a plain benzene ring). Because the front face of each flashcard blinds the drug name to force active recall, students currently see the exact same benzene ring for over three-quarters of the deck—rendering flashcards for major drugs like Ciprofloxacin, Fentanyl, Cefdinir, Clarithromycin, and Doxycycline completely broken.

Furthermore, pharmacy students preparing for board exams (NAPLEX) and clinical rotations require two complementary study modes:
1. **Chemical Structure Mode**: Active visual deduction from 2D molecular structures to drug identity and pharmacophore rationale. For multi-ingredient combination regimens (such as Augmentin / Amoxicillin + Clavulanate), both active chemical structures must be rendered side-by-side to test dual-component recognition.
2. **Clinical Monograph Mode**: Front-facing Generic Name active recall flipping to a comprehensive, high-yield clinical monograph covering all 12 key board domains (brand names, side effects, pharmacologic class, therapeutic class, detailed mechanism of action, dosing regimens, contraindications, major/common drug interactions, monitoring parameters, dosage forms, black box warnings, and patient administration/counseling).

This project remedies all broken chemical structures with 100% curated coverage, adds side-by-side combination rendering, and introduces the dedicated Clinical Monograph flashcard deck mode.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **100% Curated Chemoinformatics**: Map authentic, validated Daylight SMILES for all 250 drugs in `TOP_DRUGS_TAXONOMY`. Eliminate the silent `c1ccccc1` fallback completely.
- **Side-by-Side Multi-Structure Rendering**: Accurately display all active chemical entities side-by-side for the 16 multi-ingredient combination drugs on the card front without leaking drug names or component identities.
- **Biologic Macromolecule Representations**: Provide structured, authentic visual representations for the 9 peptide/biologic drugs (Insulins, Monoclonal Antibodies, Fusion Proteins) rather than inaccurate small-molecule benzene rings.
- **Two Top-Level Deck Modes**: Introduce a clean mode switcher in Practice Lab (`🧪 Chemical Structure Mode` vs `📋 Clinical Monograph Mode`).
- **Comprehensive 12-Domain Clinical Monographs**: Pre-compile an authoritative, offline-first clinical dataset covering all 250 drugs across all 12 requested pharmacy domains.
- **Option A Card Layout**: Implement Option A on the clinical monograph card back: prominent Black Box Warning & Contraindication banners at the top, followed by 3 structured tabs:
  - Tab 1: **Core Pharmacology** (MOA, Therapeutic & Pharmacologic Classes, Brands, Dosage Forms).
  - Tab 2: **Regimens & Safety** (Dosing by Indication, Common & Severe Adverse Effects, Absolute/Relative Contraindications).
  - Tab 3: **Patient Care & Monitoring** (Drug Interactions, Efficacy & Toxicity Monitoring Labs, Administration & Patient Counseling).
- **0ms Offline Performance**: All data and SVGs bundled locally for instant card flipping and full offline PWA usability.

### Non-Goals
- Modifying other top-level tabs (Medchem Matrix, Drug Inspector, Question Studio in Settings).
- Fetching raw unstructured FDA package inserts at runtime (rejected due to rate limits, offline study requirements, and messy legal boilerplate).
- Altering the spaced-repetition SM-2 scheduling algorithm (both study modes reuse the established flashcard review tracking and quality ratings).

### Anti-Goals
- **No Name Leaks on Blinded Front**: Never display component names (e.g. "Amoxicillin") on the front canvas of combination structure cards.
- **No Dense Wall of Text**: Avoid unformatted text dumps on monograph card backs; content must be cleanly bulleted, badge-tagged, and organized across tabs.
- **No Regression in Existing Module Review Cards**: Ensure existing curriculum structure harvesters continue to resolve valid structures and IDs.

---

## 3. Constraints

- **Client-Side Offline First**: The app runs as a client-side Vite/React SPA/PWA. All SMILES and clinical monographs must be available without requiring a live internet connection.
- **TypeScript Strictness**: Zero TypeScript compilation or lint errors (`npm run typecheck && npm run lint`).
- **RDKit WASM Vector Reliability**: Any SMILES passed to `<SmilesCanvas>` must be valid Daylight SMILES that cleanly parse in RDKit MinimalLib WASM.
- **Spaced Repetition ID Stability**: Deterministic card IDs must be preserved using `generateBaseStructureId` so existing student study progress is not wiped.

---

## 4. Approaches Considered & Selected Approach

### Approach 1: Fully Pre-Compiled Offline Catalogs *(Selected)*
We pre-compile two dedicated, strongly-typed data modules:
1. `src/data/topDrugsSmilesData.ts`: 100% curated Daylight SMILES for all 250 catalog drugs, with explicit multi-component structure arrays for combination drugs and macromolecule tags for biologics.
2. `src/data/topDrugsClinicalData.ts`: Complete 12-domain clinical monograph records for all 250 catalog drugs.
- **Why Selected**: Provides instant 0ms card flips, 100% offline study reliability, zero network failure modes during exams, and curated high-yield clinical facts tailored specifically for pharmacy student active recall.

### Approach 2: Core Curated Structures + Dynamic API Hydration *(Rejected)*
Fetch clinical monograph sections on-demand from OpenFDA and DailyMed APIs and cache them into IndexedDB.
- **Why Rejected**: Fails when students study offline; introduces asynchronous loading spinners on cards; OpenFDA returns raw legal label text (thousands of words of SPL XML) rather than concise board exam study points.

---

## 5. Detailed Architecture and Technical Specifications

### 5.1 Chemoinformatics Data Layer (`src/data/topDrugsSmilesData.ts`)

Define data structures to support single small molecules, multi-component combinations, and biologics:

```typescript
export interface MultiComponentPart {
  componentName: string; // e.g. "Amoxicillin"
  smiles: string;
  role?: string;         // e.g. "Primary Beta-Lactam Antibiotic" or "Beta-Lactamase Inhibitor"
}

export type TopDrugStructureType = 'single-molecule' | 'multi-component' | 'biologic';

export interface TopDrugStructureRecord {
  genericName: string;
  structureType: TopDrugStructureType;
  smiles: string;                      // Primary or dot-separated SMILES
  components?: MultiComponentPart[];   // Populated for multi-component combinations
  biologicDescription?: string;        // Populated for biologics (e.g. peptide sequence / mAb target)
  cid?: number;
  molecularWeight?: number;
}
```

- **Single Molecules (~225 drugs)**: Mapped with canonical Daylight SMILES and PubChem CID.
- **Multi-Component Combinations (16 drugs)**:
  1. `Acetaminophen / Butalbital / Caffeine`
  2. `Hydrocodone / Acetaminophen`
  3. `Buprenorphine / Naloxone`
  4. `Amoxicillin / Potassium Clavulanate`
  5. `Trimethoprim / Sulfamethoxazole`
  6. `Divalproex / Valproic Acid`
  7. `Clotrimazole / Betamethasone`
  8. `Triamterene / Hydrochlorothiazide`
  9. `Metoprolol Tartrate / Succinate`
  10. `Carbidopa / Levodopa`
  11. `Emtricitabine / Tenofovir`
  12. `Diphenoxylate / Atropine`
  13. `Fluticasone / Salmeterol`
  14. `Budesonide / Formoterol`
  15. `Ipratropium / Albuterol`
  16. `Amphetamine / Dextroamphetamine`
- **Biologics (9 drugs)**:
  - `Insulin Lispro`, `Insulin Aspart`, `Regular Human Insulin`, `Insulin Glargine`, `Insulin Degludec`, `Epoetin Alfa`, `Etanercept`, `Adalimumab`, `Denosumab`.
  - Represented with `structureType: 'biologic'` and clean SVG schematic icons (e.g. insulin hexamer / IgG antibody cartoon) instead of a broken benzene ring.

---

### 5.2 Clinical Monograph Data Layer (`src/data/topDrugsClinicalData.ts`)

Define the strongly-typed schema for all 12 requested clinical domains:

```typescript
export interface TopDrugClinicalMonograph {
  genericName: string;
  brandNames: string[];
  therapeuticClass: string;          // e.g. "1. Analgesic"
  pharmacologicSubclass: string;     // e.g. "Anilidopiperidine Opioid Agonist"
  mechanismOfAction: string;         // Detailed molecular & physiological MOA
  dosageForms: string[];             // e.g. ["Oral Tablet", "Transdermal Patch", "IV Solution"]
  dosingRegimens: {
    indication: string;
    regimen: string;
    notes?: string;
  }[];
  sideEffects: {
    common: string[];                // e.g. ["Constipation", "Nausea", "Sedation"]
    severe: string[];                // e.g. ["Respiratory depression", "QT prolongation", "Serotonin syndrome"]
  };
  blackBoxWarnings?: string[];       // Prominent boxed warnings
  contraindications: {
    absolute: string[];              // e.g. ["Significant respiratory depression", "Paralytic ileus"]
    relative?: string[];             // e.g. ["Severe hepatic impairment", "Severe asthma"]
  };
  drugInteractions: {
    major: string[];                 // e.g. ["CYP3A4 inhibitors (e.g. Clarithromycin)", "MAOIs within 14 days"]
    common: string[];                // e.g. ["CNS depressants (Alcohol, Benzodiazepines)"]
  };
  monitoringParameters: {
    baseline: string[];              // e.g. ["Baseline liver function tests (LFTs)", "Renal panel"]
    efficacy: string[];              // e.g. ["Pain score reduction", "Functional mobility"]
    toxicity: string[];              // e.g. ["Respiratory rate", "Level of consciousness", "Bowel movements"]
  };
  administrationCounseling: string[]; // High-yield patient counseling bullets
}

export const TOP_DRUGS_CLINICAL_CATALOG: Record<string, TopDrugClinicalMonograph> = { ... };
```

---

### 5.3 Multi-Structure Vector Canvas Component (`MultiSmilesCanvas.tsx`)

A resilient component wrapping `<SmilesCanvas>`:
- When given a single SMILES, delegates directly to `<SmilesCanvas>`.
- When given a `TopDrugStructureRecord` with `structureType === 'multi-component'`:
  - Front Face (Blinded): Renders a horizontal flex container showing Component A and Component B in separate cards with a prominent `+` divider. Overlays non-identifying labels like `"Component A (Primary Active Entity)"` and `"Component B (Secondary Entity / Adjuvant)"`. Zero name leakage.
  - Back Face (Revealed): Renders each component with its authentic generic name, pharmacologic class, and role.
- When given `structureType === 'biologic'`:
  - Renders an informative macromolecule visual badge / schematic with molecular target information.

---

### 5.4 Practice Lab View Integration (`PracticeLabView.tsx`)

1. **Preset Scope & Deck Study Mode Segmented Switcher**:
   - Monograph mode is strictly scoped to the **Top 200 Drugs Catalog** preset.
   - When the Top 200 preset is active, the deck header presents a segmented toggle: `🧪 Chemical Structure Mode` vs `📋 Clinical Monograph Mode`.
   - When `Curriculum Structures` preset is active, it stays in structure study mode as curriculum cards are exam-specific chemical structures.
   - Persists user mode selection in localStorage (`mcp_top200_active_mode`).

2. **Chemical Structure Flashcard Mode**:
   - Front: `<MultiSmilesCanvas structureRecord={resolvedRecord} isFront={true} />`.
   - Back: Revealed generic name, brand names, therapeutic class number and category, specific pharmacologic subclass, and key chemical pharmacophore bullets.

3. **Clinical Monograph Flashcard Mode (Option A Layout)**:
   - Front: Generic name prominently displayed in clean typography, phonetic/brand hint chip, and "Click or Space to flip for Monograph".
   - Back: **Option A Structured Layout** (Text & Badge focused; no canvas overhead):
     - **Header Warning Strip**: Red/Amber callout banner highlighting Black Box Warnings and top Absolute Contraindications.
     - **Tab Switcher** (Keyboard accessible via `1`, `2`, `3` or click):
       - **Tab 1: Pharmacology**: Detailed MOA, Therapeutic Category & Specific Subclass, Brand Names, Available Dosage Forms.
       - **Tab 2: Regimens & Safety**: Dosing Regimens by Indication, Common Adverse Effects, Severe / Critical Toxicities, Full Contraindications list.
       - **Tab 3: Patient Care & Monitoring**: Major & Common Drug Interactions (CYP interactions, contraindicated co-prescriptions), Baseline/Efficacy/Toxicity Monitoring Labs, Key Patient Administration & Counseling Points.

4. **Struggle Diagnostics & Remediation Loop**:
   - If a student marks cards as "Hard" or "Again" during a Clinical Monograph session, completing the session prompts an in-deck clinical re-drill loop: *"Re-drill Struggled Clinical Cards"* (re-testing those specific monograph cards).
   - It bypasses automatic redirection to the 2D Chemical SAR test bank to ensure clinical struggles are remediated clinically.

5. **Spaced Repetition (SM-2) Queue Namespace**:
   - Chemical Structure Mode and Clinical Monograph Mode maintain independent SM-2 review progress (e.g. `mcp_flashcard_progress_v1` for structures and `mcp_top200_clinical_progress_v1` for monographs).
   - This prevents rating a chemical structure as "Easy" from prematurely advancing the due date of a drug's complex clinical dosing and contraindications, allowing true independent mastery of both domains.

---

## 6. What's Left to the Builder

- Choice of Lucide icons for the 3 clinical tabs (e.g. `FlaskConical`, `ShieldAlert`, `HeartPulse`).
- Exact Tailwind CSS utility classes for responsive tablet/mobile wrapping of side-by-side structures.
- Fine-tuning card flip keyboard shortcuts (`Space` to flip, `1`/`2`/`3` to cycle tabs).
