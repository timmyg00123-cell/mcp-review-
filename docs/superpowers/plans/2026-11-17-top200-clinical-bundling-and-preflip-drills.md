# Top 200 Clinical Flashcards: Subclass Bundling & Pre-Flip Interactive Drills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Top 200 Outpatient Clinical Flashcards into a high-yield pattern-recognition study system by bundling drugs into shared pharmacologic subclass profiles (with bold exception highlights) and introducing interactive pre-flip MCQ/SATA micro-drills with domain filtering and clean SM-2 rating independence.

**Architecture:** Embed a pre-flip clinical drill engine (`ClinicalPreflipQuestionCard` & `clinicalQuestionGenerator.ts`) and a slide-out subclass profile drawer (`ClassProfileAnchorDrawer` & `classProfiles.ts`) directly into `TopDrugClinicalCard.tsx` and `StructureFlashcardDeck.tsx`. Active drill domains are selectable via toolbar pills and persisted in `localStorage`. Distractors are sourced from class siblings with automated fallback to adjacent categories.

**Tech Stack:** React 19, TypeScript 7, Tailwind CSS 4, Lucide React, Node.js + tsx for automated tests.

**Spec:** [docs/superpowers/specs/2026-11-17-top200-clinical-bundling-and-preflip-drills-design.md](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/docs/superpowers/specs/2026-11-17-top200-clinical-bundling-and-preflip-drills-design.md)

## Global Constraints

- **Grouping Granularity**: Canonical class grouping key is `broadPharmacologicClass` from `topDrugsTaxonomyData.ts` (59 multi-drug families covering 176 drugs).
- **Distractor Fallback**: When a subclass has fewer than 3 sibling drugs, distractors must fall back to clinically adjacent categories or the catalog to ensure 4 plausible choices.
- **SM-2 Independence**: Spaced repetition rating buttons (`Again`, `Hard`, `Good`, `Easy`) and interval calculations on the back face remain completely independent of pre-flip drill accuracy.
- **Event Safety**: All pre-flip options and buttons must call `e.stopPropagation()` on click, and suppress `Space`/`Enter` card-flip triggers when form controls are focused.
- **Drawer Trigger Neutrality**: The drawer button on the front face must have a neutral label ("📖 Class Profile") that does not leak the class name before flipping.
- **Domain Persistence**: Active domains persist in `localStorage` (`mcp_top200_drill_domains`). Unchecking all domains displays a gentle confirmation popover.
- **Re-Queued Cards**: When failed cards reappear in the same session, rotate to a different active domain for fresh practice.

## Review Focus

1. **Distractor Scarcity for Small Classes**: For isolated or 1-2 drug classes, fallback generator must supply 4 distinct plausible options without duplicate IDs or crashing.
   *(Test: `tests/clinicalQuestionGenerator.test.ts` exercises isolated classes like amiodarone, digoxin, allopurinol)*
2. **Spacebar & Click Event Isolation**: Pressing `Space` while focused on a checkbox, radio, or button must toggle the control without triggering premature card flips.
   *(Test: `tests/topDrugClinicalPreflip.test.ts` exercises keydown and click event propagation on front face)*
3. **Empty Domain Graceful Popover**: Deselecting all domain pills prompts the user with confirmation and does not cause `generateClinicalPreflipQuestion` to throw on empty array.
   *(Test: `tests/topDrugClinicalPreflip.test.ts` exercises 0-domain handling and fallback to direct flip)*
4. **Normalized Drug Exception Keying**: Lookups in `exceptionsByDrug` must resolve reliably regardless of case or brand/salt suffixes (e.g. "Metoprolol Succinate" vs "metoprolol").
   *(Test: `tests/classProfiles.test.ts` verifies case-insensitive exception lookups across all curated profiles)*
5. **Re-Queued Card Single-Domain Rotation**: Re-queued card with only 1 active domain must return a valid question without an infinite loop.
   *(Test: `tests/clinicalQuestionGenerator.test.ts` tests rotation with `activeDomains.length === 1` and higher attempt seeds)*

---

### Task 1: Subclass Profiles Data Model & Curated Repository

**Files:**
- Create: `src/data/clinical/classProfiles.ts`
- Test: `tests/classProfiles.test.ts`

- [ ] **Step 1: Write the failing test for `classProfiles.ts`**
  Create `tests/classProfiles.test.ts` asserting:
  - `CLASS_PROFILES` contains landmark profiles: Statins, ACE Inhibitors, ARBs, Beta-Blockers, CCBs (DHP & Non-DHP), SSRIs, Benzodiazepines, Opioids, NSAIDs, Fluoroquinolones, Penicillins, Cephalosporins, SGLT2 Inhibitors, GLP-1 Agonists, PPIs, Corticosteroids, Thiazides, Loop Diuretics.
  - `resolveClassProfileForDrug(drugName)` returns the matching `TopDrugClassProfile` with case-insensitivity.
  - `getClassProfileByName(className)` returns the exact class profile.
  - `getDrugExceptions(drugName)` extracts specific high-yield bullet points for a member drug or empty array for baseline members.

- [ ] **Step 2: Run test to confirm it fails**
  Run: `npx tsx tests/classProfiles.test.ts`
  Verify failure: cannot resolve module `src/data/clinical/classProfiles.ts`.

- [ ] **Step 3: Implement `src/data/clinical/classProfiles.ts`**
  Implement:
  - `TopDrugClassProfile` interface:
    ```typescript
    export interface TopDrugClassProfile {
      className: string;
      therapeuticCategory: string;
      universalMoa: string;
      classWideToxicities: string[];
      baselineMonitoring: string[];
      classBlackBoxWarnings?: string[];
      memberDrugNames: string[];
      exceptionsByDrug: Record<string, string[]>;
    }
    ```
  - Curated landmark class profiles with universal MOA, class toxicities, baseline labs, and bold drug-specific exceptions (e.g., Atorvastatin/Rosuvastatin high-intensity vs Pravastatin renally cleared; Metoprolol Tartrate vs Succinate; Lisinopril vs Fosinopril; Furosemide vs Torsemide; etc.).
  - Normalized lookup functions:
    - `resolveClassProfileForDrug(drugName: string): TopDrugClassProfile | null`
    - `getClassProfileByName(className: string): TopDrugClassProfile | null`
    - `getDrugExceptions(drugName: string): string[]`

- [ ] **Step 4: Run test to confirm it passes**
  Run: `npx tsx tests/classProfiles.test.ts`
  Verify: All assertions pass.

- [ ] **Step 5: Commit**
  `git add src/data/clinical/classProfiles.ts tests/classProfiles.test.ts`
  `git commit -m "feat(clinical): add curated subclass profiles and drug exception resolvers"`

---

### Task 2: Dynamic Clinical Pre-Flip Question Generator

**Files:**
- Create: `src/utils/clinicalQuestionGenerator.ts`
- Test: `tests/clinicalQuestionGenerator.test.ts`

- [ ] **Step 1: Write the failing test for `clinicalQuestionGenerator.ts`**
  Create `tests/clinicalQuestionGenerator.test.ts` testing:
  - Generates valid `ClinicalPreflipQuestion` across all 5 domains: `'brand-names'`, `'contraindications'`, `'adverse-effects'`, `'subclass-exceptions'`, `'dosing-pearls'`.
  - Question options contain exactly 4 choices with distinct IDs.
  - Sibling distractor harvesting from `broadPharmacologicClass`.
  - Fallback distractor harvesting when class has $<3$ siblings (e.g. isolated drugs like Amiodarone, Digoxin) ensuring 4 unique options without duplicates.
  - Support for both `'mcq'` (exactly 1 `isCorrect: true`) and `'sata'` (1 to 3 `isCorrect: true`).
  - Deterministic rotation across active domains when seed/attempt changes.
  - Edge case: single active domain with high attempt count rotates cleanly without crashing.

- [ ] **Step 2: Run test to confirm it fails**
  Run: `npx tsx tests/clinicalQuestionGenerator.test.ts`
  Verify failure: cannot resolve `src/utils/clinicalQuestionGenerator.ts`.

- [ ] **Step 3: Implement `src/utils/clinicalQuestionGenerator.ts`**
  Implement:
  - `ClinicalQuestionDomain` type: `'brand-names' | 'contraindications' | 'adverse-effects' | 'subclass-exceptions' | 'dosing-pearls'`
  - `ClinicalPreflipOption` and `ClinicalPreflipQuestion` interfaces.
  - Domain generators:
    - `generateBrandQuestion(drug, siblings, fallbackPool)`: MCQ/SATA on brand names.
    - `generateContraindicationQuestion(drug, siblings, fallbackPool)`: SATA on true vs distractor contraindications.
    - `generateAdverseEffectsQuestion(drug, siblings, fallbackPool)`: MCQ/SATA on black box warnings / key adverse events.
    - `generateSubclassExceptionQuestion(drug, profile, siblings, fallbackPool)`: MCQ on unique differentiator or shared class feature.
    - `generateDosingPearlsQuestion(drug, siblings, fallbackPool)`: MCQ on high-yield counseling points.
  - Round-robin domain selector based on `attemptIndex % activeDomains.length`.
  - Export `generateClinicalPreflipQuestion(drugName: string, activeDomains: ClinicalQuestionDomain[], attemptIndex?: number): ClinicalPreflipQuestion | null`.

- [ ] **Step 4: Run test to confirm it passes**
  Run: `npx tsx tests/clinicalQuestionGenerator.test.ts`
  Verify: All question generator tests pass.

- [ ] **Step 5: Commit**
  `git add src/utils/clinicalQuestionGenerator.ts tests/clinicalQuestionGenerator.test.ts`
  `git commit -m "feat(clinical): implement dynamic clinical pre-flip question generator with distractor fallback"`

---

### Task 3: Slide-Out Subclass Anchor Profile Drawer

**Files:**
- Create: `src/components/ClassProfileAnchorDrawer.tsx`
- Test: `tests/classProfileAnchorDrawer.test.ts`

- [ ] **Step 1: Write the failing test for `ClassProfileAnchorDrawer.tsx`**
  Create `tests/classProfileAnchorDrawer.test.ts` verifying:
  - Drawer renders with `role="dialog"` and `aria-label="Class Profile Anchor"`.
  - Displays Universal MOA, Class-Wide Toxicities, Baseline Monitoring.
  - Displays High-Yield Subclass Exceptions with active drug visually highlighted.
  - Closes when close button is clicked or Escape key is pressed.
  - Suppresses rendering or displays empty state safely if `profile === null`.

- [ ] **Step 2: Run test to confirm it fails**
  Run: `npx tsx tests/classProfileAnchorDrawer.test.ts`
  Verify failure: cannot resolve `src/components/ClassProfileAnchorDrawer.tsx`.

- [ ] **Step 3: Implement `src/components/ClassProfileAnchorDrawer.tsx`**
  Implement:
  - Props:
    ```typescript
    export interface ClassProfileAnchorDrawerProps {
      isOpen: boolean;
      onClose: () => void;
      profile: TopDrugClassProfile | null;
      currentDrugName?: string;
    }
    ```
  - Backdrop overlay with fade transition and click-to-close.
  - Right-aligned slide-out panel matching `TherapeuticClassFilterDrawer` design tokens (`bg-slate-900 border-l border-slate-800 text-slate-100`).
  - Header: Class Name, Category badge, Close (X) button.
  - Section 1: 🏛️ **Universal Class Baseline** (MOA, class toxicities pills, monitoring labs, class black box warnings).
  - Section 2: 🔥 **Subclass Exceptions Roster** (Cards for each member drug; current drug emphasized with emerald border and badge).
  - Escape key event listener.

- [ ] **Step 4: Run test to confirm it passes**
  Run: `npx tsx tests/classProfileAnchorDrawer.test.ts`
  Verify: Drawer component tests pass.

- [ ] **Step 5: Commit**
  `git add src/components/ClassProfileAnchorDrawer.tsx tests/classProfileAnchorDrawer.test.ts`
  `git commit -m "feat(clinical): create ClassProfileAnchorDrawer component"`

---

### Task 4: Interactive Pre-Flip Question Card Component

**Files:**
- Create: `src/components/ClinicalPreflipQuestionCard.tsx`
- Test: `tests/clinicalPreflipQuestionCard.test.ts`

- [ ] **Step 1: Write the failing test for `ClinicalPreflipQuestionCard.tsx`**
  Create `tests/clinicalPreflipQuestionCard.test.ts` verifying:
  - Renders question prompt, domain badge, and question type badge (`MCQ` or `SATA`).
  - Renders radio buttons for MCQ and checkboxes for SATA.
  - Option click events call `e.stopPropagation()` and do not trigger parent container clicks.
  - Spacebar and Enter keydown events on inputs/buttons call `e.stopPropagation()`.
  - "Check Answer" button is disabled until at least one option is selected.
  - After submission:
    - Renders 3-state evaluation styling (selected-correct in emerald, selected-incorrect in rose, unselected-missed in amber dashed).
    - Renders success or review banner with explanation.
    - Shows "Reveal Clinical Monograph →" primary action.
  - "Skip / Flip to Monograph" invokes `onFlipToMonograph`.
  - Neutral "📖 Class Profile" button invokes `onOpenClassProfile`.

- [ ] **Step 2: Run test to confirm it fails**
  Run: `npx tsx tests/clinicalPreflipQuestionCard.test.ts`
  Verify failure: cannot resolve `src/components/ClinicalPreflipQuestionCard.tsx`.

- [ ] **Step 3: Implement `src/components/ClinicalPreflipQuestionCard.tsx`**
  Implement:
  - Props:
    ```typescript
    export interface ClinicalPreflipQuestionCardProps {
      question: ClinicalPreflipQuestion;
      onFlipToMonograph: () => void;
      onAnswerSubmitted?: (isFullyCorrect: boolean) => void;
      onOpenClassProfile?: () => void;
      className?: string;
    }
    ```
  - Selection state: `Set<string>` of selected option IDs.
  - Evaluated state: `isSubmitted: boolean`, `isFullyCorrect: boolean`.
  - Option row styling for unsubmitted, correct, incorrect, and missed items.
  - Form event handlers calling `e.stopPropagation()`.
  - Keydown guards for `Space` and `Enter`.
  - Action buttons: "Check Answer", "Skip to Monograph", "📖 Class Profile".

- [ ] **Step 4: Run test to confirm it passes**
  Run: `npx tsx tests/clinicalPreflipQuestionCard.test.ts`
  Verify: Pre-flip question card tests pass.

- [ ] **Step 5: Commit**
  `git add src/components/ClinicalPreflipQuestionCard.tsx tests/clinicalPreflipQuestionCard.test.ts`
  `git commit -m "feat(clinical): implement ClinicalPreflipQuestionCard component with MCQ/SATA verification"`

---

### Task 5: Integrate Pre-Flip Drills, Exceptions Banner & Drawer into `TopDrugClinicalCard.tsx`

**Files:**
- Modify: `src/components/TopDrugClinicalCard.tsx`
- Test: `tests/topDrugClinicalCard.test.ts`

- [ ] **Step 1: Update `tests/topDrugClinicalCard.test.ts` to assert new props and elements**
  Add test assertions:
  - Front face renders `ClinicalPreflipQuestionCard` when `preflipQuestion` is provided.
  - Back face renders **🔥 High-Yield Subclass Exceptions** callout when `classProfile` has exceptions for the drug.
  - "📖 Class Profile" button opens the drawer from both front and back faces.
  - Neutral trigger label on front face does not expose class name prior to opening.
  - Card flip click handler is not triggered when clicking inside the pre-flip question area.

- [ ] **Step 2: Run test to confirm it fails**
  Run: `npx tsx tests/topDrugClinicalCard.test.ts`
  Verify test failures for new features.

- [ ] **Step 3: Update `src/components/TopDrugClinicalCard.tsx`**
  - Add props:
    ```typescript
    preflipQuestion?: ClinicalPreflipQuestion | null;
    onAnswerSubmitted?: (isFullyCorrect: boolean) => void;
    classProfile?: TopDrugClassProfile | null;
    ```
  - State: `isClassDrawerOpen: boolean`.
  - Front face:
    - If `preflipQuestion` is present, render `ClinicalPreflipQuestionCard`.
    - If no question is present (or drills disabled), render existing blinded prompt face.
  - Back face:
    - Above the tab bar, if `classProfile` contains exceptions for `monograph.genericName`, render an amber/emerald **🔥 High-Yield Subclass Exceptions** banner.
    - In header zone, add "📖 Class Profile: [ClassName]" button.
  - Render `ClassProfileAnchorDrawer` controlled by `isClassDrawerOpen`.

- [ ] **Step 4: Run test to confirm it passes**
  Run: `npx tsx tests/topDrugClinicalCard.test.ts`
  Verify: All existing and new tests pass.

- [ ] **Step 5: Commit**
  `git add src/components/TopDrugClinicalCard.tsx tests/topDrugClinicalCard.test.ts`
  `git commit -m "feat(clinical): integrate pre-flip questions, exception banner, and class drawer into TopDrugClinicalCard"`

---

### Task 6: Toolbar Domain Selector, Persistence & Re-Queue Rotation in `StructureFlashcardDeck.tsx`

**Files:**
- Modify: `src/components/StructureFlashcardDeck.tsx`
- Test: `tests/topDrugClinicalPreflip.test.ts`

- [ ] **Step 1: Write integration test in `tests/topDrugClinicalPreflip.test.ts`**
  Test end-to-end integration:
  - `activeDrillDomains` default to all 5 domains and load/save to `localStorage['mcp_top200_drill_domains']`.
  - Deselecting all domains presents confirmation popover to switch to direct flip mode.
  - Toolbar domain filter pills toggle active domains.
  - Question generated for current card matches an active domain.
  - Re-queued ("Again" / "Hard") cards increment card attempt seed and rotate to a different active domain.
  - SM-2 rating buttons on card back work seamlessly without interference from pre-flip drill.

- [ ] **Step 2: Run test to confirm it fails**
  Run: `npx tsx tests/topDrugClinicalPreflip.test.ts`
  Verify test failure.

- [ ] **Step 3: Update `src/components/StructureFlashcardDeck.tsx`**
  - Manage state for `activeDrillDomains: ClinicalQuestionDomain[]` loaded from and saved to `localStorage` (`mcp_top200_drill_domains`).
  - Manage state for `showDisableDrillsPopover: boolean`.
  - Manage dictionary of `cardAttemptCounts: Record<string, number>` tracking how many times a card has been seen in this session.
  - In deck toolbar: when `renderMode === 'clinical'` and studying in Top 200 mode, render the domain selector pills:
    - 🏷️ Brands
    - 🚫 Contraindications
    - ⚠️ Adverse Effects
    - ⚡ Subclass Exceptions
    - 💡 Pearls
  - If user unchecks the last domain, show the gentle popover asking: *"Disable pre-flip drills and switch to direct flip mode?"*
  - Pass `preflipQuestion={currentPreflipQuestion}` and `classProfile={currentClassProfile}` to `TopDrugClinicalCard`.
  - On rating button click ("Again", "Hard", etc.), increment `cardAttemptCounts[cardKey]` so if the card returns, it rotates to another domain.

- [ ] **Step 4: Run test to confirm it passes**
  Run: `npx tsx tests/topDrugClinicalPreflip.test.ts`
  Verify: Integration test passes.

- [ ] **Step 5: Commit**
  `git add src/components/StructureFlashcardDeck.tsx tests/topDrugClinicalPreflip.test.ts`
  `git commit -m "feat(clinical): add toolbar domain pills, persistence, and re-queue rotation to StructureFlashcardDeck"`

---

### Task 7: Full Test Suite, Lint, Build & Code Review

**Files:**
- All touched files

- [ ] **Step 1: Run complete test suite for Top 200 clinical features**
  Run:
  - `npx tsx tests/classProfiles.test.ts`
  - `npx tsx tests/clinicalQuestionGenerator.test.ts`
  - `npx tsx tests/classProfileAnchorDrawer.test.ts`
  - `npx tsx tests/clinicalPreflipQuestionCard.test.ts`
  - `npx tsx tests/topDrugClinicalCard.test.ts`
  - `npx tsx tests/topDrugClinicalPreflip.test.ts`
  - `npx tsx tests/StructureFlashcardDeck.test.ts`
  Verify: All tests pass with zero errors.

- [ ] **Step 2: Run TypeScript typecheck**
  Run: `npm run lint` (`tsc --noEmit`)
  Verify: Zero type errors.

- [ ] **Step 3: Run production build**
  Run: `npm run build` (`vite build`)
  Verify: Clean build without errors or bundle warnings.

- [ ] **Step 4: Dispatch Code Reviewer subagent**
  Launch `code-reviewer` subagent on the committed changes across tasks 1-6. Address any actionable findings.

- [ ] **Step 5: Final commit if any polish was needed**
  `git commit -m "chore(clinical): polish top 200 clinical bundling and pre-flip drills based on review"`
