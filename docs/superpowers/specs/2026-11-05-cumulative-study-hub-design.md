# Design Document: Cumulative Study Hub & Spaced Repetition Flashcards

**Date:** 2026-11-05  
**Topic:** Cumulative Cross-Curriculum Testing, SAR Structure-to-Body Effect Deduction, and Anki-Style Spaced Repetition Flashcards  
**Status:** Ready for User Approval

---

## 1. Intent & The "Why"
Students preparing for examinations in Medicinal Chemistry (e.g. MCP II) face a fundamental learning challenge: when studying questions within siloed lecture modules (such as "Antiplatelets" or "Heart Failure"), the module title, section headings, and context cues immediately give away the drug's therapeutic class. This enables students to answer questions by process of elimination or contextual bias rather than by authentic structure recognition.

In real clinical and board exam scenarios, students must look at an unlabelled chemical structure and independently deduce:
1. What biological target it binds or inhibits.
2. What pharmacologic class it belongs to.
3. What physiological consequences, hemodynamic changes, and bodily effects it produces.
4. When it is indicated or strictly contraindicated.

The **Cumulative Study Hub** addresses this by pooling molecules across the entire cardiovascular curriculum (Antiplatelets, Anticoagulants, Heart Failure, Antiarrhythmics), stripping away all contextual class hints, and providing two distinct training modes:
- **Cumulative Practice Drills**: Clinical vignettes and multi-structure questions testing SAR and organ-level effects with instant feedback and structural rationales.
- **Anki-Style Rapid Structure Recall Flashcards**: High-speed structure-to-class flashcards with 4-button spaced-repetition scheduling (`Again` <1m, `Hard` 4m, `Good` 10m, `Easy` 1d).
- **Diagnostic Struggle Overview**: A post-session breakdown identifying exactly which structures and drug classes caused hesitation or errors, paired with a 1-click drill to reinforce weak areas.

---

## 2. Goals, Non-Goals, & Anti-Goals

### Goals
- **Blinded Structure Presentation**: Chemical structures must be presented as neutral candidates (e.g. Candidate Structure I, II, III...) without generic names, trade names, or module identifiers.
- **Multi-Select Scoring (Select All That Apply)**: Core questions present a clinical scenario or physiological outcome alongside a cohort of 3 to 5 candidate structures, requiring the user to choose all that apply (any non-zero count, 1 up to all 5).
- **Diverse Cumulative Question Types**:
  - *Type A*: Patient Case / Desired Effect &rarr; Select all matching structures (3&ndash;5 candidates).
  - *Type B*: Single Blinded Structure &rarr; Select all physiological consequences / bodily effects that apply.
  - *Type C*: Comparative SAR &rarr; 3&ndash;5 structures evaluated for a specific biochemical or physiological property (e.g. CYP bioactivation to active thiol).
  - *Type D*: Organ Impairment &rarr; Select structure(s) contraindicated or requiring adjustment based on clearance pathways (e.g. renal failure, CrCl < 30 mL/min).
- **Anki Flashcard Deck Engine**:
  - Dynamically extracts and unifies all unique chemical structures across active curriculum modules.
  - Front: 2D chemical structure only.
  - Back: Pharmacologic class (prominent), generic/trade name, bodily effect summary, and key SAR functional groups.
  - Spaced repetition intervals: `Again` (<1 min), `Hard` (4 min), `Good` (10 min), `Easy` (1 day).
  - Full keyboard control (`Space` to flip, `1`, `2`, `3`, `4` to grade).
  - Ability to suspend / remove individual cards from the active deck.
  - Module filter toggles (Antiplatelets, Anticoagulants, Heart Failure, Antiarrhythmics).
- **Struggle Overview**: Automatically analyzes errors after any flashcard or practice session, highlighting weakest classes, most repeated structures, and offering a 1-click "Drill Struggled Items" mode.
- **Persistence**: Flashcard interval states, due dates, suspension lists, and struggle history persist locally in browser storage (`localStorage`).

### Non-Goals
- Replacing or modifying the existing single-module worksheet views (`ReviewPage`, `QuestionBlock`, `ModuleEditorModal`). Those remain 100% intact.
- Requiring cloud database sync or backend account management; all spaced-repetition states remain client-side and privacy-preserving.
- Heavy chemistry drawing editors; structures will be rendered using existing 2D SVG/PNG/SMILES viewers or clean pre-rendered structural SVGs.

### Anti-Goals
- **No Class Leaks**: Never display module names, drug classes, or pathway clues in the question stem or candidate labels before the student answers.
- **No Cluttered Modals**: The cumulative experience must not feel cramped inside small popup boxes; it must offer a spacious, distraction-free study environment.

---

## 3. Constraints
- **Platform & Stack**: React 18, TypeScript, Tailwind CSS, Vite.
- **Theme Support**: Seamless compatibility with both Light Mode (default) and Dark Mode.
- **Offline / Zero Latency**: All question banks, card decks, and spaced repetition logic run locally in-memory and in `localStorage`.
- **Responsive**: Cleanly usable on desktop, tablet, and mobile (with responsive cards and touch-friendly buttons).

---

## 4. Approaches Considered & Selected

### Approach 1: Unified "Cumulative Study Hub" (Selected)
- Build a dedicated, full-screen study environment accessed via a top navbar action ("Cumulative Hub" / "Practice & Flashcards").
- Contains two primary sub-views: "Practice Drills" and "Structure Flashcards", sharing a unified module filter and a diagnostic struggle overview.
- **Why chosen**: Keeps lecture modules pristine, provides optimal screen real estate for viewing multiple chemical structures side-by-side, enables rapid keyboard-driven flashcard drills, and consolidates all cross-curriculum learning in one place.

### Approach 2: Virtual Modules in the Existing Dropdown (Rejected)
- Inject synthetic "Cumulative Test" modules into the existing worksheet selector.
- **Why rejected**: Cramming fast-paced Anki flashcards into the vertical worksheet format creates awkward UX and restricts layout options.

### Approach 3: Two Separate Independent Modals (Rejected)
- Create separate standalone modals for tests and flashcards.
- **Why rejected**: Fragments the cumulative experience, clutters the navbar, and duplicates module-filtering and struggle-tracking state.

---

## 5. Detailed Specification

### 5.1 Navigation & Entry Point
- Add a dedicated button to `src/components/Navbar.tsx`:
  - Label: `"Cumulative Review"` (with an icon such as `GraduationCap` or `Layers`).
  - Position: Near the module selector / search bar in the top navigation cluster.
  - Clicking opens `CumulativeStudyHub.tsx`.

### 5.2 Cumulative Question Engine (Practice Mode 1)
- **Data Sourcing (Curated High-Yield Bank)**:
  - Questions are sourced from a curated, hand-crafted knowledge bank in `src/data/cumulativeQuizData.ts`, authoring multi-structure vignettes across all 4 cardiovascular modules (Antiplatelets, Anticoagulants, Heart Failure, Antiarrhythmics) with authentic SAR rationales.
- **Question Structure Models**:
  ```ts
  export interface PhysiologicalEffectStatement {
    id: string;
    statement: string;
    isCorrect: boolean;
    rationale: string;
  }

  export interface CumulativeQuestion {
    id: string;
    type: 'case-to-structures' | 'structure-to-effects' | 'comparative-sar' | 'contraindication-risk';
    moduleIds: string[]; // Originating modules represented in the question
    stem: string;
    // For Types A, C, D: 3 to 5 candidate structures
    candidateStructures?: ChemicalStructure[];
    correctStructureIds?: string[];
    // For Type B: Single prominent structure + multiple effect statements
    singleStructure?: ChemicalStructure;
    effectStatements?: PhysiologicalEffectStatement[];
    // Rationales & Pearls
    rationales: Record<string, string>;
    highYieldPearl?: string;
  }
  ```
- **Type B UI Interaction Model**:
  - When `type === 'structure-to-effects'`, the UI renders the single candidate structure prominently at the top, accompanied by a clean list of multi-select physiological consequence statements below.
- **Interaction & Feedback**:
  - **Partial Credit Scoring**:
    - Each question evaluates True Positives (correctly selected structures/statements), False Positives (incorrectly selected distractors), and False Negatives (omitted correct items).
    - Proportional score: `max(0, (True Positives - False Positives) / Total True Items)`.
    - This diagnostic granularity allows the system to recognize what the student already knows while isolating exactly what they missed.
  - **Instant Visual Feedback**: Upon clicking "Submit Answer", correctly chosen candidates are highlighted in emerald, false positives in crimson, and missed correct candidates in amber. Complete structural rationales for all candidate items and the high-yield pearl are immediately revealed.
  - **Struggle Attribution**: Only the specific structures that were missed (false negatives) or falsely selected (false positives) increment their individual `struggleCount` and enter the post-session remediation queue. Accurately identified structures are marked reinforced.
  - **Progression**: An untimed "Next Question" button advances through the session.

### 5.3 Anki-Style Spaced Repetition Engine
- **Session Lifecycle & In-Session Learning Loop**:
  - The deck operates on Anki's standard in-session learning queue:
    - Pressing `Again` (<1 min) re-queues the card at the end of the current session so you see it again before finishing.
    - Pressing `Hard` (4 min) re-inserts the card a few steps back in the current session.
    - Pressing `Good` (10 min) or `Easy` (1 day) graduates the card out of the active session.
  - The session finishes when all cards in the active queue have graduated (or when the user chooses "Finish Session Early"), immediately triggering the **Diagnostic Struggle Overview**.
- **Card Harvesting & Deduplication**:
  - Handled by `src/utils/cumulativeStructureHarvester.ts`.
  - Iterates through all loaded modules (`antiplatelets`, `anticoagulants`, `heart_failure`, `antiarrhythmic`).
  - Deduplicates by normalized drug identifier. If a molecule appears across multiple modules (e.g. Aspirin), it tracks all associated module tags (`moduleIds: ['antiplatelets', 'anticoagulants']`) so filtering either module properly controls its inclusion.
  - Fallback logic: Populates the back of the card seamlessly using `pharmacologicalClass`, `target`, `reversibility`, `moa_summary` or `sarNotes`, and `keyFunctionalGroups`.
- **Card State Model (`FlashcardItem`)**:
  ```ts
  export interface FlashcardItem {
    structureId: string;
    drugName: string;
    moduleIds: string[];
    structure: ChemicalStructure;
    intervalMinutes: number;
    dueTimestamp: number;
    repetitionCount: number;
    state: 'new' | 'learning' | 'review' | 'mastered';
    isSuspended: boolean;
    struggleCount: number;
  }
  ```
- **Interval Transition Logic**:
  - **`Again` (1)**: Interval = 1 min. Re-queued in the active session. `struggleCount` increments. State = `'learning'`.
  - **`Hard` (2)**: Interval = 4 min. Re-queued later in the active session. `struggleCount` increments.
  - **`Good` (3)**: Interval = 10 min. Due next review block.
  - **`Easy` (4)**: Interval = 1440 min (1 day). State = `'mastered'`.
- **Deck Filtering**:
  - Checkboxes for each module (`Antiplatelets`, `Anticoagulants`, `Heart Failure`, `Antiarrhythmics`).
  - Toggling a module dynamically recalculates the active queue.
- **Card Suspension**:
  - Student can click "Suspend Card" to hide it from future sessions until explicitly un-suspended in deck settings.

### 5.4 Diagnostic Struggle Overview
- Triggered upon completing a flashcard queue or a cumulative test round.
- **Components**:
  1. **Score & Accuracy**: % first-pass recall or % correct questions.
  2. **Top Struggled Structures**: Renders cards for molecules with `struggleCount >= 2` or incorrect answers, displaying their blinded structure, true name, and the specific SAR rule missed.
  3. **Weakest Drug Classes**: Bar chart / progress bars grouping performance by pharmacological class (e.g. Class III Antiarrhythmics 40%, Factor Xa Inhibitors 62%).
  4. **1-Click Remediation**: `"Drill Struggled Items Now"` button creates an instant sub-queue containing only the failed/struggled items.

---

## 6. What's Left to the Builder
- Selection of icon assets from `lucide-react` (`GraduationCap`, `Flame`, `RotateCcw`, etc.).
- Internal shuffle logic for randomizing structure candidate order in Type A/C/D questions to prevent positional bias.
- Specific Tailwind micro-animations (e.g. smooth card flip 3D transform on the flashcard).
- Storage key naming (e.g. `medchem_flashcards_v1` and `medchem_cumulative_v1`).

---

## 7. Approval & Next Steps
- Builder check completed and all architectural details integrated.
- Present this design document to the user for formal approval.
- Upon approval, proceed directly to `superpowers:writing-plans`.
