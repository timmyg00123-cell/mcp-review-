# Design Document: Therapeutic Class Filter Drawer & Slide-Selection Tool for Flashcards

**Date:** 2026-11-13  
**Status:** Approved by User / Ready for Implementation Plan  
**Author:** Antigravity Team  
**Scope:** Top 200 Drugs Flashcard Deck (`StructureFlashcardDeck.tsx` and `PracticeLabView.tsx`)

---

## 1. Intent & The Why

Students and pharmacy professionals studying the Top 200 Drugs catalog (250 drugs spanning 39 standardized therapeutic classes) need to isolate specific organ systems or curriculum blocks (e.g., focusing on all Cardiovascular classes 10–15 or Antibiotics #2) rather than being forced to review either all 250 drugs at once or only a single class in isolation.

Currently, `StructureFlashcardDeck.tsx` only offers a single dropdown selector in taxonomy mode (`All Categories` or one specific category). To provide genuine pedagogical flexibility, students need:
1. Multi-select inclusion/exclusion across all 39 therapeutic classes.
2. Classes listed in strict ascending numerical order (1 to 39, from *1. Analgesic* down to *39. Thyroid Product*) with an individual checkbox for each class.
3. An effortless **"press and hold then down or up movement" slide selection tool** directly adjacent to the list for rapid, fluid grouping and degrouping without clicking up to 39 separate checkboxes one-by-one.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
- **Strict 1–39 Ascending Order**: List all 39 therapeutic categories from `THERAPEUTIC_CATEGORIES` in numerical order going down.
- **Explicit Checkbox States**: Each class displays a checkbox that is checked when included and empty when excluded.
- **Press-and-Hold Slide Tool**: A vertical scrubber track and drag-paint surface where a student can press/click down, hold, and drag up or down to dynamically sweep-select (or sweep-deselect) consecutive classes in real time.
- **Layout Option A (Collapsible Slide Drawer)**: The 39-item list lives inside a clean slide-over drawer toggled from the deck header ("🎯 Filter Classes (X/39)"), showing live deck counters without displacing or squishing the centered flashcard or Anki rating buttons.
- **Bulk Action Quick-Buttons (Isolate Mode)**:
  - *Select All (1–39)*: Checks all 39 classes.
  - *Deselect All*: Unchecks all classes.
  - *Organ System Clusters (Isolate)*: Clicking an organ system deselects all other classes and selects only that organ system:
    - *Cardiovascular*: Classes 10, 11, 12, 13, 14, 15
    - *CNS & Psych*: Classes 3, 4, 16, 17, 20, 32, 38
    - *Anti-Infective*: Classes 2, 9, 18, 19, 28
    - *Metabolic / Endocrine*: Classes 5, 6, 24, 30, 39
- **Subclass Fine-Tuning**: Preserves the secondary Subclass dropdown alongside the drawer, dynamically filtered to only show subclasses present in currently checked classes.
- **Dual-Mode Compatibility**: Filters active cards consistently in both **Chemical Structure Mode** and **Clinical Monograph Mode**.
- **State Persistence**: Active class selection persists in `localStorage` under `mcp_top200_class_filter_v1`.
- **Zero-Selection Graceful Handling**: If a student deselects all 39 classes, render an encouraging empty state with a 1-click "Restore All Classes" button rather than a broken queue.

### Non-Goals
- Modifying the underlying taxonomy database in `src/data/topDrugsTaxonomyData.ts`.
- Altering SM-2 spaced repetition algorithms or clearing user spaced repetition history.
- Changing curriculum module harvesting or the practice test question bank.

### Anti-Goals
- **No Card Squishing**: The 39-item vertical stack must never be forced permanently onto small desktop or mobile viewports in a way that pushes the flashcard face below the fold.
- **No Gesture Stutter / Missed Rows**: Pointer tracking must not drop rows during fast mouse sweeps or touch drags.
- **No Mid-Drag Session Resets**: Scrubbing up and down across classes must not thrash active study progress on every traversed row.

---

## 3. Constraints

- **Cross-Input Compatibility**: Must support standard desktop mouse clicks/drags, laptop trackpads, and mobile/tablet touch screens using the HTML5 Pointer Events API (`onPointerDown`, `onPointerMove`, `onPointerUp`) with `setPointerCapture`.
- **Native Touch Scroll Safety**: `touch-action: none` is bound specifically to the dedicated left-hand slide rail / drag grip. The list body and row text retain native touch scrolling and tap interactions.
- **Edge Auto-Scrolling**: When dragging the pointer near the top (< 40px) or bottom (< 40px) boundaries of the 39-item scroll container, the container automatically scrolls so students can drag across all 39 items without releasing the pointer.
- **Performance**: Dynamic queue re-computation and re-rendering must complete in < 16ms (60 FPS) when toggling classes.

---

## 4. Approaches Considered

### Approach 1: Integrated Drawer with Pointer-Capture "Drag-Paint" Scrub Rail (Selected)
- **Architecture**: A dedicated `<TherapeuticClassFilterDrawer>` component controlled from `StructureFlashcardDeck.tsx`.
- **Gesture Mechanics**: Uses HTML5 Pointer Events anchored to the left-hand slide rail. Pressing down captures the pointer and determines the target state (if initial row checked -> deselect; if unchecked -> select). Moving the pointer up or down evaluates traversed rows and applies the target state in real time.
- **Why Selected**: Directly fulfills the user's exact specification of "press and hold then down or up movement" with total flexibility for contiguous sweeps and arbitrary group combinations.

### Approach 2: Collapsible Drawer with Dual-Handle Numerical Range Slider (Rejected)
- **Architecture**: Dual-handle slider setting minimum class and maximum class (e.g. 10 to 15).
- **Why Rejected**: Restricts sliding strictly to continuous numerical intervals. Users cannot slide-group non-contiguous categories (e.g., Antibiotics #2 + Antivirals #19) without falling back to manual checkbox clicking.

---

## 5. System Architecture & Detailed Design

### 5.1. Component Structure

```
src/components/
├── TherapeuticClassFilterDrawer.tsx   <-- NEW: Slide drawer with 1-39 list, drag track, bulk actions
├── StructureFlashcardDeck.tsx          <-- UPDATED: Multi-class filter state & queue integration
└── PracticeLabView.tsx                 <-- Passes deckMode preset to StructureFlashcardDeck
```

### 5.2. Data Flow & State Management

1. **Filter State**:
   - `selectedClassNumbers: Set<number>`
   - Initialized from `localStorage.getItem('mcp_top200_class_filter_v1')`. If empty or invalid, defaults to all classes (1 through 39).
   - Saved to `localStorage` as JSON array `Array.from(selectedClassNumbers)`.

2. **Filtering Contract**:
   ```typescript
   export function cardMatchesTaxonomyMultiFilter(
     card: FlashcardItem,
     selectedClassNumbers: Set<number>,
     selectedSubclass: string | null = null
   ): boolean {
     if (!selectedClassNumbers || selectedClassNumbers.size === 0) {
       return false;
     }
     const classNum = card.structure.therapeuticClassNumber;
     if (classNum !== undefined && classNum !== null) {
       if (!selectedClassNumbers.has(classNum)) {
         return false;
       }
     }
     if (selectedSubclass !== null) {
       const sub = card.structure.specificPharmacologicClass || card.structure.pharmacologicalClass || '';
       if (sub !== selectedSubclass) {
         return false;
       }
     }
     return true;
   }
   ```

3. **Queue Lifecycle Protection**:
   - While dragging along the slide rail, the visual checkmarks and counter badges update immediately.
   - On pointer up (`onPointerUp`) or when the drawer is closed, the updated set is committed to the deck queue.
   - If the current card remains valid under the updated filter, `currentIndex` is preserved at that card. If the current card was filtered out, the deck smoothly advances to the next remaining card.

4. **Pointer-Capture Drag Engine**:
   - The slide rail features a visual drag grip. Pointer capture (`e.currentTarget.setPointerCapture(e.pointerId)`) binds to the track.
   - `onPointerMove` hit-tests rows using `document.elementFromPoint` or container-relative bounding rectangles to sweep across indices `[min(start, current), max(start, current)]`.
   - `onPointerUp` releases capture and commits the filter set.

5. **Organ System Cluster Presets (Isolate Mode)**:
   - `Select All (1–39)`: Sets all 39 classes active.
   - `Deselect All`: Clears all classes (activates empty state helper).
   - `Cardio (10–15)`: Clears all, sets `{10, 11, 12, 13, 14, 15}`.
   - `CNS & Psych`: Clears all, sets `{3, 4, 16, 17, 20, 32, 38}`.
   - `Anti-Infectives`: Clears all, sets `{2, 9, 18, 19, 28}`.
   - `Endocrine / Metabolic`: Clears all, sets `{5, 6, 24, 30, 39}`.

6. **Empty State**:
   - If 0 classes are checked, flashcard deck displays: *"No therapeutic classes selected. Open the filter drawer or click below to restore all 39 classes."*
   - Includes a 1-click button: `[ Restore All 39 Classes ]`.

---

## 6. What's Left to the Builder

- Visual polish of the slide drawer overlay matching the Tailwind dark/light theme.
- Responsive layout adjustments on small mobile screens.
- Automated unit and integration tests in `tests/therapeuticClassFilterDrawer.test.ts`.
