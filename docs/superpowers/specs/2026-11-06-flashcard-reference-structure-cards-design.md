# Design Document: Structure Flashcard Reference Card & Clinical Pharmacology Redesign

**Date:** 2026-11-06  
**Status:** Approved by User (Approach 1, Option B Layout)  
**Scope:** Small Change (Cumulative Study Hub Flashcard Deck)

---

## 1. Intent & Purpose

In the Cumulative Study Hub, the Anki-style Rapid Structure Recall Deck currently renders chemical structures in a basic `bg-slate-50` box using raw SMILES strings without MolBlock 2D coordinates, PubChem CID image fallbacks, or click-to-zoom inspection. Furthermore, the flipped answer face only displays basic target, functional group, and SAR text.

This redesign elevates the flashcard deck to use the high-contrast rendering container (`bg-[var(--structure-canvas-bg)]`) and click-to-zoom modal previously adapted for `StructureComparator` and `MinimizedStructureCard`. When flipped, the card displays a responsive two-column split layout (Option B) featuring the full reference card data (scaffolds, MW, xLogP, drug state, target, pharmacophores) alongside high-yield clinical pharmacology:
1. **Metabolism & Bioactivation** (primary CYP450 pathways, prodrug conversion, active vs. inactive metabolites)
2. **Blood-Brain Barrier (BBB) Penetration** (CNS penetration depth and associated adverse effects)
3. **Pregnancy Safety Profile** (safety classification, teratogenicity warnings, Category X / Black Box contraindications vs. pregnancy-safe alternatives)

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
- **Blinded Front Face**: High-contrast structure canvas (`bg-[var(--structure-canvas-bg)]`), PubChem MolBlock 2D coordinates with CID fallbacks, and click-to-zoom modal for stereocenter inspection, with strict answer blinding (no drug name, trade name, or pharmacologic class displayed).
- **Two-Column Back Face (Option B)**:
  - **Left Column (Structural Chemistry)**: Generic name, trade name, pharmacologic class, chemical class badge, 2D vector canvas with click-to-zoom button, interactive color-coded pharmacophore tags, and 2x2/2x3 physicochemical property grid (MW, xLogP, drug state, target receptor with reversibility, route).
  - **Right Column (Clinical Pharmacology & Risk Profile)**: High-visibility clinical callout cards for Metabolism & Bioactivation, Blood-Brain Barrier (BBB) Crossing, Pregnancy Safety & Teratogenicity, and Structure-Activity Relationship (SAR) notes.
- **Curated Clinical Pharmacology Data**: Author `src/utils/clinicalPharmacologyDictionary.ts` providing verified clinical pharmacology profiles across all 48 harvested lecture drugs across the four cardiovascular modules (Antiplatelets, Anticoagulants, Heart Failure, Antiarrhythmics), with fallback resolvers for any custom or uncataloged structures.
- **Anki Spaced Repetition Integration**: Retain 4-interval rating buttons (`Again [1m]`, `Hard [4m]`, `Good [10m]`, `Easy [1d]`), card suspend toggle, keyboard shortcuts (`Space`, `1`, `2`, `3`, `4`), and struggle diagnostics.

### Non-Goals
- Modifying candidate structure cards in the Cumulative Practice Test (`CumulativePracticeTestView.tsx`) in this phase (user explicitly confirmed "Flash card deck only for now").
- Altering the spaced repetition queue scheduling algorithm (`spacedRepetitionService.ts`).

### Anti-Goals
- Leaking drug names, trade names, or pharmacologic classes on the front of the flashcard before flip.
- Bloating `StructureFlashcardDeck.tsx` by cramming all layout JSX, zoom modal state, and clinical dictionaries into a single monolithic file.

---

## 3. Approaches Considered & Selected Architecture

### Approaches Evaluated
1. **Approach 1 (Selected & Approved)**: Dedicated Clinical Pharmacology Service + De-coupled Card Face Component.
   - Author `src/utils/clinicalPharmacologyDictionary.ts` for typed clinical data lookups.
   - Author `src/components/StructureFlashcardCardFace.tsx` for front (blinded) and back (Option B two-column split) presentation with integrated zoom modal.
   - Integrate into `src/components/StructureFlashcardDeck.tsx`.
   - *Tradeoff*: Cleanest separation of concerns; keeps deck queue engine lightweight; isolates clinical data for unit testing.
2. **Approach 2 (Rejected)**: Monolithic In-Line Extension of `StructureFlashcardDeck.tsx`.
   - Embed clinical maps and two-column JSX directly in `StructureFlashcardDeck.tsx`.
   - *Tradeoff*: Bloats component from ~580 lines to 950+ lines; couples queue logic with presentation.
3. **Approach 3 (Rejected)**: Extending `MinimizedStructureCard.tsx` with Split Variants.
   - Add a `variant="flashcard-split"` prop to `MinimizedStructureCard.tsx`.
   - *Tradeoff*: Overcomplicates an existing component specifically designed and sized for compact 3-column question grids.

---

## 4. Detailed Component Design & Data Schema

### 4.1. Clinical Pharmacology Dictionary Schema (`clinicalPharmacologyDictionary.ts`)
```typescript
export interface ClinicalPharmacologyProfile {
  metabolism: string;             // Primary CYP / esterase pathways, prodrug conversion, active metabolites
  metabolismLocation?: string;     // Organ / enzyme summary e.g. "Hepatic CYP2C19 (predominant) & CES1"
  bbbCrossing: string;            // BBB penetration e.g. "Minimal / Low CNS entry" or "Crosses BBB readily"
  bbbCnsEffects?: string;         // Associated CNS effects e.g. "Fatigue, vivid dreams, dizziness"
  pregnancyRisk: 'safe' | 'caution' | 'contraindicated';
  pregnancyCategory?: string;     // e.g. "Category X (Teratogenic)", "Category B", "Category D"
  pregnancySummary: string;       // Clinical rationale e.g. "Fetal Warfarin Syndrome / chondrodysplasia punctata"
  clinicalPearls?: string;        // Black Box warnings or high-yield NAPLEX pearls
}
```

### 4.2. Presentation Component (`StructureFlashcardCardFace.tsx`)
- **Props**:
  - `structure`: `ChemicalStructure`
  - `drugName`: string
  - `isFlipped`: boolean
  - `isSuspended`: boolean
  - `onToggleSuspend`: `() => void`
  - `onFlip`: `() => void`
  - `children`: `React.ReactNode` (Anki rating buttons when flipped)
- **Front Face**:
  - Blinded Prompt Banner (`Identify the Pharmacologic Class & Key Moieties`)
  - High-Contrast Container (`bg-[var(--structure-canvas-bg)]`, border, rounded-xl)
  - `SmilesCanvas` with `canonicalSmiles`, `pubchemMolBlock`, fallback `pngUrl`, `cid`
  - Click-to-Zoom button + Hover indicator
  - Zoom Modal Portal (`StructureZoomModal` or inline modal overlay)
  - Primary "Show Answer / Flip Card" button (`Space`)
- **Back Face (Option B Two-Column Split)**:
  - Responsive Grid (`grid grid-cols-1 lg:grid-cols-2 gap-5`)
  - **Left Column**:
    - Header: Drug Name, Trade Name, Pharmacologic Class banner, Chemical Scaffold pill, Suspend toggle button
    - High-contrast canvas with click-to-zoom
    - Pharmacophore pill badges with multi-color palette (`PHARMACOPHORE_COLOR_PALETTE`)
    - 2x2/2x3 Physicochemical property grid (MW, xLogP, Drug State, Target with Reversibility, Route)
  - **Right Column**:
    - Metabolism & Bioactivation callout (`bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200`)
    - BBB Penetration callout (`bg-sky-50/60 dark:bg-sky-950/30 border-sky-200`)
    - Pregnancy Safety callout with color-coded risk badge:
      - Contraindicated / Teratogenic: `bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-700`
      - Caution / Monitor: `bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-700`
      - Safe / Anticoagulant of Choice: `bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700`
    - SAR & MoA summary
  - **Bottom Action Bar**: Slot for Anki 4-interval rating buttons

---

## 5. Verification & Testing Plan

1. **Unit Testing**:
   - `tests/clinicalPharmacologyDictionary.test.ts`:
     - Test all 48 harvested drugs resolve valid `ClinicalPharmacologyProfile` entries.
     - Test fallback resolution for unknown or custom structures.
     - Verify correct pregnancy risk flags for benchmark teratogens (Warfarin, Lisinopril, Losartan, Sacubitril) vs. safe agents (Heparin, Enoxaparin).
2. **Component & Regression Verification**:
   - Verify Anki interval shortcuts (`Space`, `1`, `2`, `3`, `4`) continue to function without disruption.
   - Verify Card Suspend toggle correctly removes subsequent queue occurrences.
   - Verify Zoom modal opens and displays high-res molecule on both front and back faces.
3. **Production Build**:
   - Run `npm run test:run` (all test suites passing).
   - Run `npm run build` (clean Vite bundle output).
