# Flashcard Top Drugs Taxonomy, Sorting & Interactive Pharmacophore Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the 39-class Xavier University Top Drugs curriculum hierarchy into the flashcard system with hierarchical sorting/filtering, standalone Top 200 deck support, persistent clutter-prevention display customization, and live multi-color interactive pharmacophore substructure highlighting on flipped cards.

**Architecture:**
1. Extend `ChemicalStructure` with first-class taxonomy fields (`therapeuticClassNumber`, `therapeuticCategory`, `broadPharmacologicClass`, `specificPharmacologicClass`).
2. Build a comprehensive Top Drugs taxonomy catalog (`src/data/topDrugsTaxonomyData.ts`) and fuzzy salt-normalizing enrichment engine (`src/utils/topDrugsTaxonomy.ts`).
3. Wire `PharmacophoreTagList` and `SmilesCanvas` with `Record<string, ColorPaletteItem>` multi-color cycling state inside `StructureFlashcardCardFace.tsx`, backed by responsive density modes (`split`, `structure-focus`, `minimalist`) and section toggles.
4. Upgrade `StructureFlashcardDeck.tsx` with taxonomy filter mode, cascading 2-tier class/subclass selectors, stable numeric-fallback sorting, empty-filter fallbacks, and select-guarded keyboard shortcuts while preserving Anki `reQueueActiveSession` queue state.
5. Expose the standalone Top 200 deck preset in `CumulativeStudyHubModal.tsx`.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, RDKit.js WASM (`@rdkit/rdkit`), Lucide React, Node.js test runner (`tsx`).

**Spec:** [`docs/superpowers/specs/2026-11-12-flashcard-top-drugs-taxonomy-design.md`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/docs/superpowers/specs/2026-11-12-flashcard-top-drugs-taxonomy-design.md)

## Global Constraints

- **Strict Blinded Front Face**: Front face of flashcards must NEVER expose drug names, brand names, or taxonomy classifications.
- **Color Palette Contract**: `PharmacophoreTagList` uses `Record<string, ColorPaletteItem>` (from `PHARMACOPHORE_COLOR_PALETTE`), NOT an array of strings.
- **Queue State Preservation**: `StructureFlashcardDeck` must manage `activeQueue` in `useState` so `reQueueActiveSession` dynamic re-insertion is never wiped by prop recalculations.
- **Sorting Stability**: Non-Top 200 curriculum structures sort stably using fallback `therapeuticClassNumber ?? 999` to prevent `NaN` sort corruption.
- **Select Focus Guard**: Keyboard navigation (`Space`, `1-4`) must ignore events when focus is inside a `<select>` element.

## Review Focus

1. **Salt Form Matching**: Structures with salt suffixes (e.g., "Metoprolol Tartrate", "Cephalexin Monohydrate", "Ampicillin Sodium") must match their canonical Top Drug entry and inherit brand names and class hierarchy.
2. **Pharmacophore Tag Color Cycling**: Toggling multiple pharmacophore tags must assign distinct colors from `PHARMACOPHORE_COLOR_PALETTE` and simultaneously highlight all active substructures on `SmilesCanvas`.
3. **Zoom Modal Sync**: Clicking to zoom vector structure on the card back must forward all active pharmacophore highlights into the modal canvas.
4. **Empty Filter State**: Filtering by a category/subclass with 0 matching cards must display a "Reset Filters" view, NOT the "Session Complete" graduation screen.
5. **Display Settings Persistence**: Changing layout density or toggling section visibility must persist to `localStorage` under `medchem_flashcard_display_settings` across card flips and deck reloads.

---

### Task 1: Type Definitions & Master Top Drugs Taxonomy Catalog

**Files:**
- Modify: `src/types/reviewModule.ts:40-60`
- Create: `src/data/topDrugsTaxonomyData.ts`
- Test: `tests/topDrugsTaxonomyData.test.ts`

**Interfaces:**
- Produces:
  - `ChemicalStructure.therapeuticClassNumber?: number`
  - `ChemicalStructure.therapeuticCategory?: string`
  - `ChemicalStructure.broadPharmacologicClass?: string`
  - `ChemicalStructure.specificPharmacologicClass?: string`
  - `TopDrugEntry` interface
  - `TherapeuticClassCategory` interface
  - `TOP_DRUGS_TAXONOMY: TopDrugEntry[]` (39 classes, ~200 drugs)
  - `THERAPEUTIC_CATEGORIES: TherapeuticClassCategory[]`

- [ ] **Step 1: Write the failing test for taxonomy types and catalog completeness**

Create `tests/topDrugsTaxonomyData.test.ts`:
```typescript
import assert from 'node:assert';
import { TOP_DRUGS_TAXONOMY, THERAPEUTIC_CATEGORIES } from '../src/data/topDrugsTaxonomyData.js';

// Verify all 39 therapeutic classes are represented
assert.strictEqual(THERAPEUTIC_CATEGORIES.length, 39, 'Must define exactly 39 therapeutic categories');

// Verify Category 1 (Analgesic)
const cat1 = THERAPEUTIC_CATEGORIES.find((c) => c.classNumber === 1);
assert.ok(cat1, 'Category 1 must exist');
assert.ok(cat1.categoryName.includes('Analgesic'));

// Verify Category 2 (Antibiotic) and specific subclasses
const cat2 = THERAPEUTIC_CATEGORIES.find((c) => c.classNumber === 2);
assert.ok(cat2, 'Category 2 must exist');
assert.ok(cat2.specificSubclasses.includes('1st Generation Cephalosporin'));

// Verify drug entries
const cephalexin = TOP_DRUGS_TAXONOMY.find((d) => d.genericName.toLowerCase() === 'cephalexin');
assert.ok(cephalexin, 'Cephalexin must be in catalog');
assert.strictEqual(cephalexin.therapeuticClassNumber, 2);
assert.ok(cephalexin.brandNames.includes('Keflex'));
assert.strictEqual(cephalexin.broadPharmacologicClass, 'Cephalosporin');
assert.strictEqual(cephalexin.specificPharmacologicClass, '1st Generation Cephalosporin');

// Verify Category 11 (Cardiovascular --- Antihypertensive)
const furosemide = TOP_DRUGS_TAXONOMY.find((d) => d.genericName.toLowerCase() === 'furosemide');
assert.ok(furosemide, 'Furosemide must be in catalog');
assert.strictEqual(furosemide.therapeuticClassNumber, 11);
assert.ok(furosemide.brandNames.includes('Lasix'));
assert.strictEqual(furosemide.specificPharmacologicClass, 'Loop Diuretic');

console.log('✓ Top Drugs taxonomy catalog tests passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/topDrugsTaxonomyData.test.ts`
Expected: FAIL with "Cannot find module '../src/data/topDrugsTaxonomyData.js'"

- [ ] **Step 3: Update `ChemicalStructure` in `src/types/reviewModule.ts` and create `src/data/topDrugsTaxonomyData.ts`**

1. In `src/types/reviewModule.ts`, add the optional fields:
   - `therapeuticClassNumber?: number;`
   - `therapeuticCategory?: string;`
   - `broadPharmacologicClass?: string;`
   - `specificPharmacologicClass?: string;`
2. Create `src/data/topDrugsTaxonomyData.ts` encoding the complete 39 therapeutic classes, representative drugs, brand names, and broad/specific classes transcribed from the Xavier University curriculum reference.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/topDrugsTaxonomyData.test.ts`
Expected: PASS with "✓ Top Drugs taxonomy catalog tests passed"

- [ ] **Step 5: Run typecheck**

Run: `npm run lint`
Expected: PASS with 0 errors

- [ ] **Step 6: Commit**

```bash
git add src/types/reviewModule.ts src/data/topDrugsTaxonomyData.ts tests/topDrugsTaxonomyData.test.ts
git commit -m "feat: define master Top Drugs taxonomy catalog and ChemicalStructure fields"
```

---

### Task 2: Taxonomy Normalization, Matching & Structure Enrichment Service

**Files:**
- Create: `src/utils/topDrugsTaxonomy.ts`
- Modify: `src/utils/cumulativeStructureHarvester.ts:50-100`
- Test: `tests/topDrugsTaxonomy.test.ts`

**Interfaces:**
- Consumes:
  - `TOP_DRUGS_TAXONOMY` and `THERAPEUTIC_CATEGORIES` from `src/data/topDrugsTaxonomyData.ts`
  - `ChemicalStructure` from `src/types/reviewModule.ts`
  - `FlashcardItem` from `src/types/cumulativeStudy.ts`
- Produces:
  - `normalizeForTaxonomyMatch(raw: string): string`
  - `findTopDrugMatch(name: string, genericName?: string, brandNames?: string[], cid?: number): TopDrugEntry | null`
  - `enrichStructureWithTaxonomy(structure: ChemicalStructure): ChemicalStructure`
  - `getTop200Flashcards(): FlashcardItem[]`
  - `getTherapeuticCategoriesForCards(cards: FlashcardItem[]): TherapeuticClassCategory[]`

- [ ] **Step 1: Write the failing test for taxonomy matching and structure enrichment**

Create `tests/topDrugsTaxonomy.test.ts`:
```typescript
import assert from 'node:assert';
import {
  normalizeForTaxonomyMatch,
  findTopDrugMatch,
  enrichStructureWithTaxonomy,
  getTop200Flashcards,
} from '../src/utils/topDrugsTaxonomy.js';
import type { ChemicalStructure } from '../src/types/reviewModule.js';

// 1. Normalization with salt suffix removal
assert.strictEqual(normalizeForTaxonomyMatch('Metoprolol Tartrate'), 'metoprolol');
assert.strictEqual(normalizeForTaxonomyMatch('Cephalexin Monohydrate'), 'cephalexin');
assert.strictEqual(normalizeForTaxonomyMatch('Ampicillin Sodium / Sulbactam Sodium [Unasyn]'), 'ampicillinsulbactam');
assert.strictEqual(normalizeForTaxonomyMatch('Furosemide'), 'furosemide');

// 2. Direct match lookup
const matchFurosemide = findTopDrugMatch('Furosemide');
assert.ok(matchFurosemide);
assert.strictEqual(matchFurosemide.therapeuticClassNumber, 11);
assert.ok(matchFurosemide.brandNames.includes('Lasix'));

// 3. Structure enrichment
const baseCephalexin: ChemicalStructure = {
  id: 'struct_cef',
  name: 'Cephalexin Monohydrate',
  chemicalClass: 'Cephalosporin',
  pharmacologicalClass: 'Cell wall inhibitor',
  target: 'PBP',
  reversibility: 'Irreversible',
  route: 'Oral',
  keyFunctionalGroups: ['Beta-lactam'],
  pkPdHighlights: { onset: '1h', duration: '6h', halfLife: '1h', elimination: 'Renal' },
};

const enriched = enrichStructureWithTaxonomy(baseCephalexin);
assert.strictEqual(enriched.therapeuticClassNumber, 2);
assert.strictEqual(enriched.therapeuticCategory, '2. Antibiotic');
assert.strictEqual(enriched.broadPharmacologicClass, 'Cephalosporin');
assert.strictEqual(enriched.specificPharmacologicClass, '1st Generation Cephalosporin');
assert.ok(enriched.brandNames?.includes('Keflex'));

// 4. Standalone Top 200 deck generation
const topCards = getTop200Flashcards();
assert.ok(topCards.length >= 100, 'Must generate >= 100 flashcards for Top Drugs');
assert.ok(topCards.every((c) => c.structure.therapeuticClassNumber !== undefined));

console.log('✓ Top Drugs taxonomy matching & enrichment tests passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/topDrugsTaxonomy.test.ts`
Expected: FAIL with "Cannot find module '../src/utils/topDrugsTaxonomy.js'"

- [ ] **Step 3: Implement `src/utils/topDrugsTaxonomy.ts` and integrate into `cumulativeStructureHarvester.ts`**

1. Implement `normalizeForTaxonomyMatch` stripping salt suffixes (`hydrochloride`, `hcl`, `tartrate`, `succinate`, `sodium`, `potassium`, `calcium`, `monohydrate`, `maleate`, `mesylate`, etc.) and bracketed tags.
2. Implement `findTopDrugMatch` with indexed lookup map and alias fallbacks.
3. Implement `enrichStructureWithTaxonomy` setting `therapeuticClassNumber`, `therapeuticCategory`, `broadPharmacologicClass`, `specificPharmacologicClass`, and brand names.
4. Implement `getTop200Flashcards` generating deterministic `FlashcardItem[]` with fallback SMILES and pharmacophore mappings.
5. In `src/utils/cumulativeStructureHarvester.ts`, apply `enrichStructureWithTaxonomy` during card harvesting.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/topDrugsTaxonomy.test.ts`
Expected: PASS with "✓ Top Drugs taxonomy matching & enrichment tests passed"

- [ ] **Step 5: Run existing harvester tests to ensure no regressions**

Run: `npx tsx tests/cumulativeStructureHarvester.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/utils/topDrugsTaxonomy.ts src/utils/cumulativeStructureHarvester.ts tests/topDrugsTaxonomy.test.ts
git commit -m "feat: implement taxonomy matching, salt normalization, and card enrichment"
```

---

### Task 3: Interactive Pharmacophores & Customizable Card Face

**Files:**
- Modify: `src/components/StructureFlashcardCardFace.tsx`
- Test: `tests/StructureFlashcardCardFace.test.ts`

**Interfaces:**
- Consumes:
  - `PharmacophoreTagList`, `ColorPaletteItem`, `PHARMACOPHORE_COLOR_PALETTE` from `src/components/PharmacophoreTagList.tsx`
  - `SmilesCanvas` from `src/components/SmilesCanvas.tsx`
  - `getPharmacophoresForStructure` from `src/utils/pharmacophoreData.ts`
  - `enrichStructureWithTaxonomy` from `src/utils/topDrugsTaxonomy.ts`
- Produces:
  - `FlashcardDisplaySettings` interface
  - `DEFAULT_FLASHCARD_DISPLAY_SETTINGS` constant
  - Updated `StructureFlashcardCardFaceProps.displaySettings?: FlashcardDisplaySettings`
  - Synchronized `activePharmacophoresList` on standard canvas and zoom modal

- [ ] **Step 1: Write the failing test for card face taxonomy breadcrumbs, brand badge, and interactive pharmacophores**

Update `tests/StructureFlashcardCardFace.test.ts` to test:
1. Blinded front face exposes 0 drug names, brand names, or taxonomy breadcrumbs.
2. Flipped card displays breadcrumbs (`Therapeutic Class 2: Antibiotic › Cephalosporin › 1st Gen`) and brand badge (`Brand: Keflex`) when enabled.
3. Flipped card hides breadcrumbs or brand badge when `displaySettings` disables them.
4. Density modes (`split`, `structure-focus`, `minimalist`) render expected markup structures.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/StructureFlashcardCardFace.test.ts`
Expected: FAIL due to missing display settings or taxonomy breadcrumb elements.

- [ ] **Step 3: Implement interactive pharmacophores and display customization in `StructureFlashcardCardFace.tsx`**

1. Define `FlashcardDisplaySettings` and `DEFAULT_FLASHCARD_DISPLAY_SETTINGS`.
2. Add `displaySettings` to `StructureFlashcardCardFaceProps` with default fallback.
3. Manage pharmacophore states:
   ```typescript
   const [activePharmacophoreIds, setActivePharmacophoreIds] = useState<Record<string, ColorPaletteItem>>({});
   const [hoveredPharmacophoreId, setHoveredPharmacophoreId] = useState<string | null>(null);
   ```
4. Reset state on flip or structure change:
   ```typescript
   useEffect(() => {
     setActivePharmacophoreIds({});
     setHoveredPharmacophoreId(null);
   }, [structure.id, isFlipped]);
   ```
5. Derive `activePharmacophoresList` in `useMemo` mapping active and hovered tags to `{ id, name, smarts, color }`.
6. Mount `PharmacophoreTagList` below the canvas with `onTogglePharmacophore`, `onHoverPharmacophore`, and `onClearAllHighlights`.
7. Pass `activePharmacophores={activePharmacophoresList}` to both the standard `SmilesCanvas` and the click-to-zoom vector modal `SmilesCanvas`.
8. Render header breadcrumb trail (`therapeuticCategory › broadPharmacologicClass › specificPharmacologicClass`) and brand names pill (`Brand: ...`) conditionally based on `displaySettings`.
9. Implement layout density rendering:
   - `split`: Default 2-column layout (Structure + Tags on left; MOA & Clinical on right).
   - `structure-focus`: 1-column layout with structure canvas and tag list prominent; clinical pearls in an expandable `<details>` section.
   - `minimalist`: Compact view with structure, clean name, brand badge, and rating buttons.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/StructureFlashcardCardFace.test.ts`
Expected: PASS

- [ ] **Step 5: Run typecheck**

Run: `npm run lint`
Expected: PASS with 0 errors

- [ ] **Step 6: Commit**

```bash
git add src/components/StructureFlashcardCardFace.tsx tests/StructureFlashcardCardFace.test.ts
git commit -m "feat: add interactive pharmacophore highlighting, taxonomy breadcrumbs, and density modes to card face"
```

---

### Task 4: Hierarchical Filtering, Stable Sorting & Display Controls in Deck

**Files:**
- Modify: `src/components/StructureFlashcardDeck.tsx`
- Test: `tests/StructureFlashcardDeck.test.ts`

**Interfaces:**
- Consumes:
  - `THERAPEUTIC_CATEGORIES` and `TherapeuticClassCategory` from `src/data/topDrugsTaxonomyData.ts`
  - `enrichStructureWithTaxonomy` from `src/utils/topDrugsTaxonomy.ts`
  - `FlashcardDisplaySettings` from `src/components/StructureFlashcardCardFace.tsx`
- Produces:
  - Deck Filter Mode toggle (`'curriculum' | 'taxonomy'`)
  - 2-tier cascading filter state (`selectedCategoryNumber`, `selectedSubclass`)
  - Stable sort engine (`'class-number'`, `'subclass'`, `'due-date'`, `'alphabetical'`)
  - "⚙️ Display" settings popover with `localStorage` persistence
  - Empty filter fallback view with "Reset Filters" action
  - Focus guard ignoring `<select>` tags in keyboard shortcuts

- [ ] **Step 1: Write the failing test for deck taxonomy filtering, sorting, and display popover**

Update `tests/StructureFlashcardDeck.test.ts` to test:
1. Deck filter mode switching between Curriculum Modules and Top Drugs Taxonomy.
2. Filtering by Therapeutic Category (e.g. Category 2) restricts active cards to Antibiotics.
3. Filtering by specific subclass (e.g. 1st Gen Cephalosporin) filters cards further.
4. Sorting by Class Number stably sorts cards using numeric fallback (`therapeuticClassNumber ?? 999`).
5. Empty filter state renders reset button when 0 cards match.
6. Keyboard shortcut handler ignores Space and number keys when focus is on a `<select>`.
7. Anki in-session re-queuing (`reQueueActiveSession`) remains intact when grading cards "Again".

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/StructureFlashcardDeck.test.ts`
Expected: FAIL due to missing taxonomy filter controls and sort options.

- [ ] **Step 3: Implement taxonomy filter mode, sorting, and display popover in `StructureFlashcardDeck.tsx`**

1. Add state for `filterMode: 'curriculum' | 'taxonomy'`.
2. Add state for `selectedCategoryNumber: number | null` and `selectedSubclass: string | null`.
3. Add state for `sortBy: 'class-number' | 'subclass' | 'due-date' | 'alphabetical'`.
4. Add state for `displaySettings: FlashcardDisplaySettings` initialized from `localStorage` (`medchem_flashcard_display_settings`).
5. Compute `candidatePool` from `props.cards` based on filters and sort mode, initializing `activeQueue` in `useState` when filters/sort change.
6. Guard `handleKeyDown` by adding `target.tagName === 'SELECT'`.
7. Add "⚙️ Display" popover button rendering density mode buttons (`split`, `structure-focus`, `minimalist`) and section toggles.
8. Render Empty Filter State when `activeQueue.length === 0` with a "Reset Filters" button.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/StructureFlashcardDeck.test.ts`
Expected: PASS

- [ ] **Step 5: Run typecheck**

Run: `npm run lint`
Expected: PASS with 0 errors

- [ ] **Step 6: Commit**

```bash
git add src/components/StructureFlashcardDeck.tsx tests/StructureFlashcardDeck.test.ts
git commit -m "feat: implement taxonomy cascading filters, stable sorting, and display settings popover in deck"
```

---

### Task 5: Cumulative Study Hub Standalone Deck Integration & Full Regression

**Files:**
- Modify: `src/components/CumulativeStudyHubModal.tsx`
- Test: `tests/e2eCumulativeStudyHub.test.ts`

**Interfaces:**
- Consumes:
  - `getTop200Flashcards` from `src/utils/topDrugsTaxonomy.ts`
  - `StructureFlashcardDeck` from `src/components/StructureFlashcardDeck.tsx`
- Produces:
  - Top 200 Drugs deck preset option in `CumulativeStudyHubModal.tsx`
  - End-to-end integration test validating curriculum flashcards, Top 200 flashcards, interactive tag highlighting, and clutter controls

- [ ] **Step 1: Write the failing integration test**

Update `tests/e2eCumulativeStudyHub.test.ts` to test launching the Top 200 standalone deck, verifying card count, flipping to back, and verifying interactive pharmacophore tag highlight state.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/e2eCumulativeStudyHub.test.ts`
Expected: FAIL due to missing Top 200 deck preset.

- [ ] **Step 3: Implement Top 200 preset in `CumulativeStudyHubModal.tsx`**

1. Add a "Top 200 Drugs Deck" option/card in the deck selection interface alongside Curriculum Decks.
2. When selected, load cards via `getTop200Flashcards()` and pass to `StructureFlashcardDeck`.
3. Preserve spaced repetition progress reporting and struggle diagnostics.

- [ ] **Step 4: Run all test suites to verify full pass**

Run:
```bash
npx tsx tests/topDrugsTaxonomyData.test.ts
npx tsx tests/topDrugsTaxonomy.test.ts
npx tsx tests/StructureFlashcardCardFace.test.ts
npx tsx tests/StructureFlashcardDeck.test.ts
npx tsx tests/e2eCumulativeStudyHub.test.ts
npx tsx tests/smartsDictionary.test.ts
```
Expected: ALL PASS

- [ ] **Step 5: Run typecheck**

Run: `npm run lint`
Expected: PASS with 0 errors

- [ ] **Step 6: Commit**

```bash
git add src/components/CumulativeStudyHubModal.tsx tests/e2eCumulativeStudyHub.test.ts
git commit -m "feat: integrate standalone Top 200 deck preset into Cumulative Study Hub"
```
