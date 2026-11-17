# Top 200 Clinical Flashcards: Subclass Bundling & Pre-Flip Interactive Practice

**Date:** 2026-11-17  
**Status:** Approved  
**Author:** AI Assistant & User Collaboration  

---

## 1. Intent and Why

Studying 250 Top Outpatient medications as isolated flashcards creates high cognitive friction and passive memorization. Students are presented with massive 12-domain clinical monographs on the back of each card without being tested on granular knowledge points first, making it difficult to pinpoint specific gaps (e.g., brand names vs. contraindications vs. class exceptions).

This feature transforms Top 200 Clinical Flashcards into a high-yield, pattern-recognition learning system:
1. **Subclass Clinical Bundling**: Groups drugs by their pharmacologic class (`broadPharmacologicClass`), establishing a shared baseline (MOA, class toxicities, baseline labs) and boldly highlighting drug-specific exceptions.
2. **Pre-Flip Active Recall Drills**: Presents targeted Multiple Choice (MCQ) and Select-All-That-Apply (SATA) micro-drills directly on the card front before flipping, allowing students to test specific clinical facts with instant feedback.
3. **Domain Rotation & Filtration**: Lets students select which clinical domains to practice (Brand Names, Contraindications, Side Effects / Boxed Warnings, Subclass Differences, Dosing Pearls) with dynamic round-robin rotation.
4. **Clean SM-2 Independence**: Keeps self-testing diagnostics distinct from spaced repetition interval scheduling.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- Bundle Top 200 outpatient drugs into their 59 shared multi-drug pharmacologic families with unified Class Anchor profiles.
- Display bold, high-yield subclass exceptions at the top of the flipped clinical monograph for every drug in a multi-drug subclass.
- Provide interactive pre-flip micro-questions (MCQ single-choice and SATA multi-select) with instant visual verification (correct vs. missed items).
- Provide toolbar domain filter pills allowing students to enable/disable specific question domains with automatic round-robin rotation across active domains.
- Allow students to flip directly or skip questions at any time.
- Preserve standard Anki/SM-2 rating buttons (Again / Hard / Good / Easy) on the back face.

### Non-Goals
- Modifying Curriculum Chemical Structure flashcards or Practice Test SAR deduction scoring.
- Automatically overriding SM-2 intervals based on pre-flip question accuracy (grading remains student-controlled).
- Modifying external chemical database services (ChEMBL, PubChem, Mol*).

### Anti-Goals
- Never trap or lock the card on the front face; students must always be able to flip directly or advance without answering.
- Never show distractors from unrelated therapeutic classes (e.g., distractors for an antibiotic brand must come from antibiotics or close siblings, not cardiovascular drugs).
- Never regress existing Chemical Structure Mode or multi-filter taxonomy filtering.

---

## 3. Approaches Considered

### Approach A: Integrated Engine inside `StructureFlashcardDeck` & `TopDrugClinicalCard` *(Chosen)*
- Embed the pre-flip micro-drill component directly inside `TopDrugClinicalCard`.
- Add class profiles and exception callouts into the clinical monograph back face.
- Add question domain selector pills to the flashcard deck toolbar.
- **Why chosen**: Seamless user experience within the existing deck, zero UI fragmentation, shared spaced-repetition persistence.

### Approach B: Standalone "Clinical Differential Drill" View
- Build a separate view next to Practice Test and Flashcards in `PracticeLabView`.
- **Why rejected**: Splits studying into separate tools; students lose the ability to toggle smoothly between Chemical Structure Mode and Clinical Monograph Mode within one cohesive session.

---

## 4. Architecture & Technical Specification

### 4.1 Data Modeling (`src/data/clinical/classProfiles.ts` & `types.ts`)
- **Class Profile Definition**:
  ```typescript
  export interface TopDrugClassProfile {
    className: string; // e.g. "HMG-CoA Reductase Inhibitor"
    therapeuticCategory: string; // e.g. "10. Cardiovascular --- Anti-Lipemic Agent"
    universalMoa: string;
    classWideToxicities: string[];
    baselineMonitoring: string[];
    classBlackBoxWarnings?: string[];
    memberDrugNames: string[];
    exceptionsByDrug: Record<string, string[]>; // Generic Name -> High-yield exception points
  }
  ```
- **Curated Profiles**: Pre-computed profiles for major outpatient drug families (Statins, ACE inhibitors, ARBs, Beta-blockers, CCBs, SSRIs, Benzodiazepines, Opioids, NSAIDs, Fluoroquinolones, Penicillins, Cephalosporins, SGLT2 inhibitors, GLP-1 agonists, PPIs, Corticosteroids, etc.).

### 4.2 Dynamic Question Generator (`src/utils/clinicalQuestionGenerator.ts`)
- Pure utility generating valid clinical questions on demand for any `TopDrugEntry`:
  ```typescript
  export type ClinicalQuestionDomain =
    | 'brand-names'
    | 'contraindications'
    | 'adverse-effects'
    | 'subclass-exceptions'
    | 'dosing-pearls';

  export interface ClinicalPreflipQuestion {
    id: string;
    domain: ClinicalQuestionDomain;
    type: 'mcq' | 'sata';
    prompt: string;
    options: {
      id: string;
      text: string;
      isCorrect: boolean;
      explanation?: string;
    }[];
  }
  ```
- **Distractor Sourcing**: Distractors are harvested dynamically from sibling drugs within the same therapeutic class or catalog to ensure authentic, realistic pharmacology challenges.

### 4.3 Component Integration & User Rulings
- **`TopDrugClinicalCard.tsx`**:
  - Front Face: Renders `ClinicalPreflipQuestionCard` when `renderMode === 'clinical'` and pre-flip drill mode is enabled (enabled by default).
  - Front Face: Includes "Check Answer" and "Skip / Flip to Monograph" actions.
  - Front Face Click & Keyboard Safety: Stops click event bubbling on all interactive choices so clicking options does not inadvertently trigger card flips. Guards spacebar so `Space` toggles checkboxes and button focus without triggering premature card flips.
  - Back Face: Renders the **🔥 High-Yield Subclass Exceptions** alert callout above the 12-domain tabbed monograph.
  - Subclass Anchor Drawer: Slide-out drawer (`ClassProfileAnchorDrawer`, matching `TherapeuticClassFilterDrawer`) accessible from both front and back faces via a neutral button (e.g. "📖 Class Profile") that does not reveal the class name in the button label on the front face until slid open.
- **`StructureFlashcardDeck.tsx`**:
  - Adds toolbar pills for active question domains when studying in Top 200 Clinical mode.
  - Pre-flip drill domain selections are persisted in `localStorage` (`mcp_top200_drill_domains`).
  - If a student unchecks all domains, displays a gentle confirmation popover asking if they wish to disable pre-flip drills and switch to direct flip mode.
  - Distractor Sourcing: Uses sibling drugs within the same class; if a class has fewer than 3 siblings, falls back to clinically adjacent categories/catalog to guarantee 4 plausible options.
  - Re-Queued ("Again" / "Hard") Cards: Rotates to a different active domain for fresh practice rather than repeating the exact same question.

---

## 5. Verification Plan

1. **Unit Tests**:
   - `tests/clinicalQuestionGenerator.test.ts`: Verify question generation across all 5 domains, distractor plausibility, correct answer flags, distractor fallback for isolated classes, and domain rotation on re-queued cards.
   - `tests/classProfiles.test.ts`: Verify profile integrity for landmark drug classes, accurate member resolution, and lowercase normalized key resolution.
2. **Contract & Integration Tests**:
   - `tests/topDrugClinicalPreflip.test.ts`: Verify front-face question rendering, SATA multi-select behavior, submit verification, exceptions banner rendering, drawer trigger neutrality, and keyboard/click event guards.
3. **Full Suite**:
   - `npm run lint` (`tsc --noEmit`)
   - `npm run build` (`vite build`)
