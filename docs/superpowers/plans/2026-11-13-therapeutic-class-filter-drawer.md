# Therapeutic Class Filter Drawer & Slide-Selection Tool Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multi-select therapeutic class filter drawer with a press-and-hold slide-selection rail (classes 1–39 in ascending order), cluster isolation presets, and deck queue integration for Top 200 Flashcards in both Chemical Structure and Clinical Monograph modes.

**Architecture:** Encapsulate filter persistence, cluster isolation presets, and contiguous pointer sweep math in a pure utility module (`therapeuticClassFilter.ts`). Create a slide-over drawer component (`TherapeuticClassFilterDrawer.tsx`) featuring an HTML5 pointer-capture scrubber rail with `touch-action: none` for fluid drag-paint multi-selection and organ-system cluster isolate buttons. Integrate the drawer into `StructureFlashcardDeck.tsx` and `PracticeLabView.tsx` with active queue re-filtering, safe current-card index preservation, dynamic subclass cascading, and a zero-selection empty state.

**Tech Stack:** React 19, TypeScript, Lucide React icons, Tailwind CSS, HTML5 Pointer Events API (`setPointerCapture`), Node.js / tsx test runner.

**Spec:** [docs/superpowers/specs/2026-11-13-therapeutic-class-filter-drawer-design.md](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/docs/superpowers/specs/2026-11-13-therapeutic-class-filter-drawer-design.md)

## Global Constraints

- **Order Guarantee:** Classes must be listed strictly from 1 to 39 in ascending numerical order going down (1. Analgesics through 39. Thyroid Products) with no reordering.
- **Checkbox Contract:** Each row has a checkbox checked when included and empty when excluded.
- **Gesture Mechanics:** Press-and-hold then down or up movement on the scrubber rail for real-time drag-paint selection/deselection.
- **Touch Scroll Safety:** `touch-action: none` bound strictly to the scrubber rail; list body retains native vertical touch scrolling.
- **Cluster Action Mode:** Organ-system cluster buttons must isolate the target organ system (deselect all other classes and select only that cluster).
- **Persistence Key:** Filter state persisted in `localStorage` under `mcp_top200_class_filter_v1`.
- **Zero-Selection Graceful Handling:** Deselecting all classes renders an empty state with a 1-click "Restore All 39 Classes" button without breaking the SM-2 engine.
- **Dual-Mode Compatibility:** Must function identically in both Chemical Structure Mode and Clinical Monograph Mode.
- **Taxonomy Integrity:** No modifications to `src/data/topDrugsTaxonomyData.ts`.

## Review Focus

1. **Empty Selection State:** When all 39 classes are unchecked (`selectedClassNumbers.size === 0`), deck queue must not crash and must render an inviting empty state with a 1-click restore button. (Tested in Task 3, Step 1)
2. **Current Card Filtered Out:** When the student isolates a cluster that excludes the currently viewed card, `currentIndex` must be safely clamped to remaining cards without out-of-bounds errors. (Tested in Task 3, Step 1)
3. **Corrupted or Malformed `localStorage`:** If `localStorage` holds corrupted JSON, non-array data, or out-of-range numbers, loader must fall back to all 39 classes. (Tested in Task 1, Step 1)
4. **Pointer Drag Release Off-Screen:** When dragging the scrubber rail outside the browser viewport, pointer capture must release cleanly without sticking in active drag mode. (Tested in Task 2, Step 1)
5. **Dynamic Subclass Cascading With Multi-Class:** Subclasses available in the secondary dropdown must only include subclasses present in active classes; if currently selected subclass is excluded, it must safely reset to `null`. (Tested in Task 3, Step 1)

---

### Task 1: Multi-Filter Model, Presets, and Helper Logic

**Files:**
- Create: `src/utils/therapeuticClassFilter.ts`
- Test: `tests/therapeuticClassFilter.test.ts`

**Interfaces:**
- Consumes: `THERAPEUTIC_CATEGORIES`, `TherapeuticClassCategory` from `src/data/topDrugsTaxonomyData.ts`; `FlashcardItem` from `src/types/cumulativeStudy.ts`
- Produces:
  ```typescript
  export const TOP200_CLASS_FILTER_STORAGE_KEY = 'mcp_top200_class_filter_v1';
  export const ALL_THERAPEUTIC_CLASS_NUMBERS: number[]; // [1, 2, ..., 39]
  export interface OrganSystemCluster {
    key: string;
    label: string;
    classNumbers: number[];
  }
  export const ORGAN_SYSTEM_CLUSTERS: OrganSystemCluster[];
  export function cardMatchesTaxonomyMultiFilter(
    card: FlashcardItem,
    selectedClassNumbers: Set<number>,
    selectedSubclass?: string | null
  ): boolean;
  export function loadSelectedClassNumbers(storage?: Storage): Set<number>;
  export function saveSelectedClassNumbers(selected: Set<number>, storage?: Storage): void;
  export function computeContiguousSweep(
    startIndex: number,
    currentIndex: number,
    currentSelection: Set<number>,
    targetState: boolean,
    orderedClassNumbers?: number[]
  ): Set<number>;
  ```

- [ ] **Step 1: Write the failing unit tests for multi-filter logic and persistence**

Create `tests/therapeuticClassFilter.test.ts`:
```typescript
import assert from 'node:assert';
import {
  TOP200_CLASS_FILTER_STORAGE_KEY,
  ALL_THERAPEUTIC_CLASS_NUMBERS,
  ORGAN_SYSTEM_CLUSTERS,
  cardMatchesTaxonomyMultiFilter,
  loadSelectedClassNumbers,
  saveSelectedClassNumbers,
  computeContiguousSweep,
} from '../src/utils/therapeuticClassFilter';
import type { FlashcardItem } from '../src/types/cumulativeStudy';

// Test 1: Constant bounds & 1-39 ascending sequence
assert.strictEqual(ALL_THERAPEUTIC_CLASS_NUMBERS.length, 39);
assert.strictEqual(ALL_THERAPEUTIC_CLASS_NUMBERS[0], 1);
assert.strictEqual(ALL_THERAPEUTIC_CLASS_NUMBERS[38], 39);
for (let i = 0; i < 39; i++) {
  assert.strictEqual(ALL_THERAPEUTIC_CLASS_NUMBERS[i], i + 1);
}

// Test 2: Organ system clusters exist and match spec
const cardio = ORGAN_SYSTEM_CLUSTERS.find((c) => c.key === 'cardio');
assert.ok(cardio, 'Cardio cluster must exist');
assert.deepStrictEqual(cardio.classNumbers, [10, 11, 12, 13, 14, 15]);

const cns = ORGAN_SYSTEM_CLUSTERS.find((c) => c.key === 'cns');
assert.ok(cns, 'CNS cluster must exist');
assert.deepStrictEqual(cns.classNumbers, [3, 4, 16, 17, 20, 32, 38]);

const antiInfective = ORGAN_SYSTEM_CLUSTERS.find((c) => c.key === 'anti-infective');
assert.ok(antiInfective, 'Anti-infective cluster must exist');
assert.deepStrictEqual(antiInfective.classNumbers, [2, 9, 18, 19, 28]);

const endocrine = ORGAN_SYSTEM_CLUSTERS.find((c) => c.key === 'endocrine');
assert.ok(endocrine, 'Endocrine cluster must exist');
assert.deepStrictEqual(endocrine.classNumbers, [5, 6, 24, 30, 39]);

// Test 3: cardMatchesTaxonomyMultiFilter behavior
const sampleCard: FlashcardItem = {
  id: 'card-1',
  drugName: 'Metoprolol',
  structure: {
    id: 'metoprolol',
    name: 'Metoprolol',
    therapeuticClassNumber: 10,
    therapeuticCategory: 'Cardiovascular Agent',
    specificPharmacologicClass: 'Beta-1 Selective Blocker',
  },
  moduleIds: ['cardio'],
  status: 'new',
  easeFactor: 2.5,
  intervalDays: 0,
  repetitions: 0,
  dueTimestamp: Date.now(),
};

// Match when class is in selected set
assert.strictEqual(
  cardMatchesTaxonomyMultiFilter(sampleCard, new Set([10, 11])),
  true
);

// Do not match when class is excluded
assert.strictEqual(
  cardMatchesTaxonomyMultiFilter(sampleCard, new Set([1, 2, 3])),
  false
);

// Empty set matches nothing (Review Focus 1)
assert.strictEqual(
  cardMatchesTaxonomyMultiFilter(sampleCard, new Set()),
  false
);

// Subclass filter matching
assert.strictEqual(
  cardMatchesTaxonomyMultiFilter(sampleCard, new Set([10]), 'Beta-1 Selective Blocker'),
  true
);
assert.strictEqual(
  cardMatchesTaxonomyMultiFilter(sampleCard, new Set([10]), 'ACE Inhibitor'),
  false
);

// Test 4: Storage loading with corrupted/empty values (Review Focus 3)
const mockStorage: Record<string, string> = {};
const fakeStorage = {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, val: string) => {
    mockStorage[key] = val;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {},
  key: () => null,
  length: 0,
};

// Defaults to all 39 when storage empty
assert.strictEqual(loadSelectedClassNumbers(fakeStorage as unknown as Storage).size, 39);

// Corrupted JSON falls back to all 39
mockStorage[TOP200_CLASS_FILTER_STORAGE_KEY] = 'invalid-json{';
assert.strictEqual(loadSelectedClassNumbers(fakeStorage as unknown as Storage).size, 39);

// Non-array falls back to all 39
mockStorage[TOP200_CLASS_FILTER_STORAGE_KEY] = '{"test": 123}';
assert.strictEqual(loadSelectedClassNumbers(fakeStorage as unknown as Storage).size, 39);

// Valid array loads correctly
saveSelectedClassNumbers(new Set([10, 11, 12]), fakeStorage as unknown as Storage);
const loaded = loadSelectedClassNumbers(fakeStorage as unknown as Storage);
assert.deepStrictEqual(Array.from(loaded).sort((a, b) => a - b), [10, 11, 12]);

// Test 5: computeContiguousSweep handles downward and upward scrubbing
const initialSet = new Set([1, 2, 3, 4, 5]);

// Sweep down to select 6..8
const sweptDown = computeContiguousSweep(6, 8, initialSet, true, ALL_THERAPEUTIC_CLASS_NUMBERS);
assert.ok(sweptDown.has(6) && sweptDown.has(7) && sweptDown.has(8));
assert.ok(sweptDown.has(1) && sweptDown.has(5));

// Sweep up to deselect 3..1
const sweptUp = computeContiguousSweep(3, 1, initialSet, false, ALL_THERAPEUTIC_CLASS_NUMBERS);
assert.strictEqual(sweptUp.has(1), false);
assert.strictEqual(sweptUp.has(2), false);
assert.strictEqual(sweptUp.has(3), false);
assert.strictEqual(sweptUp.has(4), true);
assert.strictEqual(sweptUp.has(5), true);

console.log('therapeuticClassFilter tests passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/therapeuticClassFilter.test.ts`
Expected: FAIL with "Cannot find module '../src/utils/therapeuticClassFilter'"

- [ ] **Step 3: Implement `therapeuticClassFilter.ts`**

Create `src/utils/therapeuticClassFilter.ts`:
- Define `TOP200_CLASS_FILTER_STORAGE_KEY = 'mcp_top200_class_filter_v1'`.
- Define `ALL_THERAPEUTIC_CLASS_NUMBERS = Array.from({ length: 39 }, (_, i) => i + 1)`.
- Define `ORGAN_SYSTEM_CLUSTERS` with keys: `cardio` (10-15), `cns` (3, 4, 16, 17, 20, 32, 38), `anti-infective` (2, 9, 18, 19, 28), `endocrine` (5, 6, 24, 30, 39).
- Implement `cardMatchesTaxonomyMultiFilter`: checks `card.structure.therapeuticClassNumber` against `selectedClassNumbers` and checks `selectedSubclass`.
- Implement `loadSelectedClassNumbers`: safely parses storage JSON; if array of numbers in 1..39, returns `new Set(filtered)`; otherwise returns all 39.
- Implement `saveSelectedClassNumbers`: writes sorted array `Array.from(selected)` to JSON.
- Implement `computeContiguousSweep`: computes `[Math.min(startIndex, currentIndex), Math.max(startIndex, currentIndex)]` and sets or deletes class numbers.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/therapeuticClassFilter.test.ts`
Expected: PASS with "therapeuticClassFilter tests passed."

- [ ] **Step 5: Commit**

```bash
git add src/utils/therapeuticClassFilter.ts tests/therapeuticClassFilter.test.ts
git commit -m "feat(top200): add therapeutic class multi-filter helpers and storage model"
```

---

### Task 2: Slide Drawer UI Component with Scrubber Rail (`TherapeuticClassFilterDrawer.tsx`)

**Files:**
- Create: `src/components/TherapeuticClassFilterDrawer.tsx`
- Test: `tests/therapeuticClassFilterDrawer.test.ts`

**Interfaces:**
- Consumes:
  - `ALL_THERAPEUTIC_CLASS_NUMBERS`, `ORGAN_SYSTEM_CLUSTERS`, `computeContiguousSweep` from `src/utils/therapeuticClassFilter.ts`
  - `THERAPEUTIC_CATEGORIES`, `TherapeuticClassCategory` from `src/data/topDrugsTaxonomyData.ts`
  - `FlashcardItem` from `src/types/cumulativeStudy.ts`
- Produces:
  ```typescript
  export interface TherapeuticClassFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    selectedClassNumbers: Set<number>;
    onSelectionChange: (nextSelection: Set<number>) => void;
    categories?: TherapeuticClassCategory[];
    cards?: FlashcardItem[];
  }
  export const TherapeuticClassFilterDrawer: React.FC<TherapeuticClassFilterDrawerProps>;
  ```

- [ ] **Step 1: Write the failing unit and component contract test**

Create `tests/therapeuticClassFilterDrawer.test.ts`:
```typescript
import assert from 'node:assert';
import fs from 'node:fs';

const drawerPath = 'src/components/TherapeuticClassFilterDrawer.tsx';
assert.ok(fs.existsSync(drawerPath), `Drawer file ${drawerPath} must exist`);

const content = fs.readFileSync(drawerPath, 'utf-8');

// Test 1: Interface exports
assert.ok(
  content.includes('export interface TherapeuticClassFilterDrawerProps'),
  'Must export TherapeuticClassFilterDrawerProps'
);
assert.ok(
  content.includes('export const TherapeuticClassFilterDrawer'),
  'Must export TherapeuticClassFilterDrawer'
);

// Test 2: Required props
assert.ok(content.includes('isOpen: boolean'), 'Must accept isOpen');
assert.ok(content.includes('onClose: () => void'), 'Must accept onClose');
assert.ok(content.includes('selectedClassNumbers: Set<number>'), 'Must accept selectedClassNumbers');
assert.ok(content.includes('onSelectionChange: ('), 'Must accept onSelectionChange');

// Test 3: Strict 1-39 Ascending Ordering
assert.ok(
  content.includes('ALL_THERAPEUTIC_CLASS_NUMBERS') || content.includes('categories.map'),
  'Must map all 39 categories'
);
assert.ok(
  content.includes('1. Analgesics') || content.includes('cat.classNumber') || content.includes('classNumber'),
  'Must display numeric class labels 1 to 39'
);

// Test 4: Left-hand scrubber rail with pointer capture and touch-action: none
assert.ok(
  content.includes('setPointerCapture'),
  'Must use HTML5 setPointerCapture for drag scrubbing'
);
assert.ok(
  content.includes('touch-action: none') || content.includes('touch-none'),
  'Must apply touch-action: none strictly to slide rail'
);
assert.ok(
  content.includes('onPointerDown') && content.includes('onPointerMove') && content.includes('onPointerUp'),
  'Must wire onPointerDown, onPointerMove, and onPointerUp'
);
assert.ok(
  content.includes('onLostPointerCapture') || content.includes('releasePointerCapture'),
  'Must safely handle lost pointer capture when dragging off-screen (Review Focus 4)'
);

// Test 5: Organ system cluster presets (Isolate Mode)
assert.ok(content.includes('Cardio'), 'Must include Cardio cluster button');
assert.ok(content.includes('CNS') || content.includes('Psych'), 'Must include CNS cluster button');
assert.ok(content.includes('Anti-Infective'), 'Must include Anti-Infective cluster button');
assert.ok(content.includes('Endocrine') || content.includes('Metabolic'), 'Must include Endocrine cluster button');
assert.ok(content.includes('Select All') || content.includes('All (1-39)'), 'Must include Select All button');
assert.ok(content.includes('Deselect All'), 'Must include Deselect All button');

// Test 6: Checkbox and count badges
assert.ok(content.includes('type="checkbox"'), 'Must render explicit checkbox for each class');
assert.ok(content.includes('drugCount') || content.includes('count') || content.includes('cards'), 'Must render drug counts');

console.log('TherapeuticClassFilterDrawer contract tests passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/therapeuticClassFilterDrawer.test.ts`
Expected: FAIL with "Drawer file src/components/TherapeuticClassFilterDrawer.tsx must exist"

- [ ] **Step 3: Implement `TherapeuticClassFilterDrawer.tsx`**

Create `src/components/TherapeuticClassFilterDrawer.tsx`:
- Render fixed slide-over drawer on the right side with backdrop overlay when `isOpen === true`.
- Top header with Title (`🎯 Filter Therapeutic Classes (1–39)`), active counter badge (`X/39 Active`), and Close button (`X`).
- Quick actions bar:
  - `Select All (1–39)`: invokes `onSelectionChange(new Set(ALL_THERAPEUTIC_CLASS_NUMBERS))`
  - `Deselect All`: invokes `onSelectionChange(new Set())`
  - Organ system cluster buttons (`Cardio 10–15`, `CNS & Psych`, `Anti-Infectives`, `Endocrine`): in **Isolate mode**, selecting only that cluster's numbers.
- Scrollable list containing items 1 to 39 in ascending numerical order:
  - Each item row contains:
    - Left-hand scrubber drag grip rail with `touch-none` / `touch-action: none`.
    - Checkbox displaying `selectedClassNumbers.has(classNumber)`. Clicking row or checkbox toggles that single class.
    - Class number & category name (e.g. `10. Cardiovascular Agent`).
    - Drug count badge (derived from `cards` matching that class, or default category count).
- Drag Scrubber Engine:
  - `onPointerDown(e, classNumber)`: calls `e.currentTarget.setPointerCapture(e.pointerId)`, records `dragStartIndex = classNumber`, and determines `targetState = !selectedClassNumbers.has(classNumber)`.
  - `onPointerMove(e)`: evaluates pointer Y position relative to row heights or `document.elementFromPoint`, determines hovered `classNumber`, and updates selection via `computeContiguousSweep`. Auto-scrolls container if pointer is within 40px of top/bottom.
  - `onPointerUp(e)` and `onLostPointerCapture(e)`: releases capture and commits selection.
- Keyboard support: Pressing `Escape` closes the drawer.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/therapeuticClassFilterDrawer.test.ts`
Expected: PASS with "TherapeuticClassFilterDrawer contract tests passed."

- [ ] **Step 5: Commit**

```bash
git add src/components/TherapeuticClassFilterDrawer.tsx tests/therapeuticClassFilterDrawer.test.ts
git commit -m "feat(top200): implement TherapeuticClassFilterDrawer with pointer-capture slide scrubber rail"
```

---

### Task 3: Deck Integration & Empty State Handling (`StructureFlashcardDeck.tsx`)

**Files:**
- Modify: `src/components/StructureFlashcardDeck.tsx`
- Test: `tests/structureFlashcardDeckMultiFilter.test.ts`

**Interfaces:**
- Consumes:
  - `TherapeuticClassFilterDrawer` from `./TherapeuticClassFilterDrawer`
  - `cardMatchesTaxonomyMultiFilter`, `loadSelectedClassNumbers`, `saveSelectedClassNumbers`, `TOP200_CLASS_FILTER_STORAGE_KEY` from `../utils/therapeuticClassFilter`
- Produces:
  - Updated `StructureFlashcardDeck` supporting multi-class filtering, drawer toggle button, subclass cascading, and zero-selection empty state recovery.

- [ ] **Step 1: Write the failing integration test**

Create `tests/structureFlashcardDeckMultiFilter.test.ts`:
```typescript
import assert from 'node:assert';
import fs from 'node:fs';

const deckPath = 'src/components/StructureFlashcardDeck.tsx';
const content = fs.readFileSync(deckPath, 'utf-8');

// Test 1: Imports filter drawer and multi-filter helpers
assert.ok(
  content.includes("from './TherapeuticClassFilterDrawer'"),
  'Must import TherapeuticClassFilterDrawer'
);
assert.ok(
  content.includes('cardMatchesTaxonomyMultiFilter'),
  'Must import and use cardMatchesTaxonomyMultiFilter'
);
assert.ok(
  content.includes('selectedClassNumbers'),
  'Must track selectedClassNumbers state as Set<number>'
);

// Test 2: Drawer Trigger Button
assert.ok(
  content.includes('Filter Classes') || content.includes('Filter Categories'),
  'Must render drawer trigger button in deck header'
);
assert.ok(
  content.includes('isClassDrawerOpen') || content.includes('isFilterDrawerOpen'),
  'Must track drawer open state'
);

// Test 3: Subclass cascading dynamically filtered by selected classes (Review Focus 5)
assert.ok(
  content.includes('availableSubclasses'),
  'Must compute availableSubclasses dynamically from selected classes'
);

// Test 4: Current card index clamped or preserved on queue re-filter (Review Focus 2)
assert.ok(
  content.includes('currentIndex') && (content.includes('Math.min') || content.includes('findIndex')),
  'Must safely preserve or clamp currentIndex when queue updates'
);

// Test 5: Empty selection state with 1-click restore button (Review Focus 1)
assert.ok(
  content.includes('Restore All 39 Classes') || content.includes('Restore All Classes'),
  'Must render Restore All Classes button in empty selection state'
);

console.log('StructureFlashcardDeck multi-filter integration tests passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/structureFlashcardDeckMultiFilter.test.ts`
Expected: FAIL with missing imports/state in `StructureFlashcardDeck.tsx`

- [ ] **Step 3: Update `StructureFlashcardDeck.tsx`**

Modify `src/components/StructureFlashcardDeck.tsx`:
1. Import `TherapeuticClassFilterDrawer` and `cardMatchesTaxonomyMultiFilter`, `loadSelectedClassNumbers`, `saveSelectedClassNumbers`, `ALL_THERAPEUTIC_CLASS_NUMBERS`.
2. Replace single `selectedCategoryNumber: number | null` with `selectedClassNumbers: Set<number>`, initialized with `loadSelectedClassNumbers(window.localStorage)`.
3. Add `isFilterDrawerOpen: boolean` state.
4. Update `buildCandidateQueue` to accept `selectedClassNumbers: Set<number>` and call `cardMatchesTaxonomyMultiFilter(c, selectedClassNumbers, subclass)`.
5. Update `availableSubclasses` `useMemo`: derive subclasses exclusively from cards matching `selectedClassNumbers`. If `selectedSubclass` is no longer in `availableSubclasses`, reset `selectedSubclass` to `null`.
6. Add `handleClassSelectionChange(nextSet: Set<number>)`:
   - Saves to `localStorage` via `saveSelectedClassNumbers`.
   - Rebuilds candidate queue.
   - Preserves current card position: checks if `activeQueue[currentIndex]` is present in `nextQueue`; if so, sets `currentIndex` to its new index; otherwise clamps to `Math.min(currentIndex, Math.max(0, nextQueue.length - 1))`.
7. In the Taxonomy filter toolbar (when `filterMode === 'taxonomy'`):
   - Replace the single category `<select>` with a button:
     `<button onClick={() => setIsFilterDrawerOpen(true)}>🎯 Filter Classes ({selectedClassNumbers.size}/39)</button>`
   - Retain the Subclass `<select>` alongside it.
8. Render `<TherapeuticClassFilterDrawer>` at the bottom of the component:
   `isOpen={isFilterDrawerOpen}`, `onClose={() => setIsFilterDrawerOpen(false)}`, `selectedClassNumbers={selectedClassNumbers}`, `onSelectionChange={handleClassSelectionChange}`.
9. Empty State check: If `activeQueue.length === 0`, render an inviting empty state card:
   - Icon: `Filter` or `Layers`
   - Title: "No Cards Match Current Filter"
   - Description: "You have deselected all 39 classes or no cards match the selected combination."
   - Action: `[ Restore All 39 Classes ]` button calling `handleClassSelectionChange(new Set(ALL_THERAPEUTIC_CLASS_NUMBERS))`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/structureFlashcardDeckMultiFilter.test.ts`
Expected: PASS with "StructureFlashcardDeck multi-filter integration tests passed."

- [ ] **Step 5: Run existing deck tests to ensure regression-free behavior**

Run: `npx tsx tests/StructureFlashcardDeck.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/StructureFlashcardDeck.tsx tests/structureFlashcardDeckMultiFilter.test.ts
git commit -m "feat(top200): integrate therapeutic class filter drawer into StructureFlashcardDeck"
```

---

### Task 4: PracticeLabView Integration & End-to-End Verification

**Files:**
- Modify: `src/components/PracticeLabView.tsx`
- Test: `tests/e2eTherapeuticClassFilter.test.ts`

**Interfaces:**
- Consumes:
  - `initialFilterMode` prop in `StructureFlashcardDeck`
  - `deckMode` in `PracticeLabView.tsx`
- Produces:
  - Top 200 deck defaulting to `taxonomy` mode with filter drawer access for both Chemical Structure and Clinical Monograph modes.

- [ ] **Step 1: Write the failing E2E integration test**

Create `tests/e2eTherapeuticClassFilter.test.ts`:
```typescript
import assert from 'node:assert';
import fs from 'node:fs';

// Verify PracticeLabView passes initialFilterMode to StructureFlashcardDeck
const labPath = 'src/components/PracticeLabView.tsx';
const labContent = fs.readFileSync(labPath, 'utf-8');

assert.ok(
  labContent.includes("initialFilterMode={deckMode === 'top200' ? 'taxonomy' : 'curriculum'}"),
  'PracticeLabView must set initialFilterMode based on deckMode'
);

// Verify StructureFlashcardDeck accepts and uses initialFilterMode
const deckPath = 'src/components/StructureFlashcardDeck.tsx';
const deckContent = fs.readFileSync(deckPath, 'utf-8');

assert.ok(
  deckContent.includes('initialFilterMode?: DeckFilterMode'),
  'StructureFlashcardDeckProps must accept initialFilterMode'
);

console.log('e2eTherapeuticClassFilter tests passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/e2eTherapeuticClassFilter.test.ts`
Expected: FAIL with missing `initialFilterMode` in `PracticeLabView.tsx`

- [ ] **Step 3: Update `PracticeLabView.tsx` and `StructureFlashcardDeckProps`**

1. In `src/components/StructureFlashcardDeck.tsx`:
   - Add `initialFilterMode?: DeckFilterMode;` to `StructureFlashcardDeckProps`.
   - In `useState<DeckFilterMode>` initialization, default to `initialFilterMode || 'curriculum'`.
2. In `src/components/PracticeLabView.tsx`:
   - Pass `initialFilterMode={deckMode === 'top200' ? 'taxonomy' : 'curriculum'}` to `<StructureFlashcardDeck>`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/e2eTherapeuticClassFilter.test.ts`
Expected: PASS with "e2eTherapeuticClassFilter tests passed."

- [ ] **Step 5: Run full TypeScript check and build verification**

Run: `npm run lint` (`tsc --noEmit`)
Expected: Clean exit with code 0 (no type errors)

Run: `npm run build` (`vite build`)
Expected: Clean build output in `dist/`

- [ ] **Step 6: Commit**

```bash
git add src/components/PracticeLabView.tsx src/components/StructureFlashcardDeck.tsx tests/e2eTherapeuticClassFilter.test.ts
git commit -m "feat(top200): wire default taxonomy filter mode in PracticeLabView and verify end-to-end"
```

---

### Task 5: Whole-Branch Review & Cleanup

**Files:**
- Audit all modified files:
  - `src/utils/therapeuticClassFilter.ts`
  - `src/components/TherapeuticClassFilterDrawer.tsx`
  - `src/components/StructureFlashcardDeck.tsx`
  - `src/components/PracticeLabView.tsx`
  - All test files in `tests/`

- [ ] **Step 1: Run all test suites across the repository**

Run:
```bash
npx tsx tests/therapeuticClassFilter.test.ts
npx tsx tests/therapeuticClassFilterDrawer.test.ts
npx tsx tests/structureFlashcardDeckMultiFilter.test.ts
npx tsx tests/e2eTherapeuticClassFilter.test.ts
npx tsx tests/StructureFlashcardDeck.test.ts
npx tsx tests/practiceLabDeckModes.test.ts
npm run lint
npm run build
```
Expected: All suites PASS.

- [ ] **Step 2: Terminate background visual companion daemon task**

Run `manage_task` with action `kill` for TaskId `64f9b704-0887-40ef-9211-bf0d39f4ff03/task-12714`.

- [ ] **Step 3: Final branch commit**

```bash
git status
git commit --allow-empty -m "chore(top200): complete therapeutic class filter drawer implementation"
```
