# Flashcard Top Drugs Taxonomy, Sorting & Interactive Pharmacophore Design

**Date**: 2026-11-12  
**Status**: Revised per Builder Check (Ready for Planning)  
**Author**: Antigravity  

---

## 1. Intent and Why

Students preparing for pharmacy and medical licensing exams (NAPLEX, USMLE) must master both:
1. **Medicinal Chemistry & Molecular Pharmacology**: Visual chemical structure recognition, active pharmacophore identification, structure-activity relationships (SAR), and metabolism/clearance pathways.
2. **Clinical Drug Taxonomy & Top 200 Drug Knowledge**: Rapid recall of broad therapeutic categories (e.g., *Antibiotic*, *Cardiovascular --- Antihypertensive*), brand names (e.g., *Keflex*, *Lasix*, *Eliquis*), and specific tiered pharmacologic subclasses (e.g., *1st Generation Cephalosporin* within *Cephalosporin*, under *2. Antibiotic*).

Currently, the flashcard system (`StructureFlashcardDeck` and `StructureFlashcardCardFace`) has four major limitations:
1. **Flat/Module-Only Organization**: Cards are organized strictly by curriculum module folders (`renal`, `respiratory`, `cardiovascular`, etc.). Students cannot sort or filter cards by standardized clinical therapeutic classes or pharmacologic subclasses.
2. **Missing Reference Metadata on Card Back**: The card back displays generic names, MW, logP, and clinical pearls, but omits standardized Top 200 brand names and the hierarchical classification from curriculum standards (such as the Xavier University of Louisiana College of Pharmacy Top Drugs taxonomy).
3. **Static Pharmacophore Tags on Flipped Cards**: While other parts of the platform (`StructureComparator`, `ChemicalStructureCard`) feature interactive `PharmacophoreTagList` components that dynamically illuminate functional groups on the 2D vector canvas on hover/click, the flashcard back renders only inert, static text badges. Students cannot interact with pharmacophore moieties to verify substructure locations.
4. **Risk of Visual Clutter**: As card metadata expands with brand names, 3-level taxonomy breadcrumbs, interactive tag strips, and clinical pearls, cards risk becoming visually overwhelming on smaller viewports or during fast spaced-repetition sessions without user display customization.

This design introduces a unified hierarchical taxonomy and interactive pharmacophore architecture, enriched by the Top 200 Drugs curriculum reference, equipped with persistent clutter-prevention display controls and standalone Top 200 deck support.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
- **Standardized Top Drugs Taxonomy (39 Therapeutic Classes)**:
  - Ingest and encode the complete Xavier University Top Drugs curriculum taxonomy (39 Therapeutic Categories, broad classes, specific subclasses, generic names, and brand names).
  - Enrich existing curriculum cards (~254 structures) with Top Drugs metadata via fuzzy/normalized generic name and alias matching (stripping salt suffixes like hydrochloride, tartrate, etc.).
  - Provide a standalone "Top 200 Drugs" study deck preset in `CumulativeStudyHubModal` for focused drug memorization alongside curriculum decks.
- **Hierarchical Deck Filtering & Multi-Factor Sorting**:
  - Add a **Deck Filter Mode Toggle** in `StructureFlashcardDeck`: switch between **Curriculum Modules** and **Top Drugs Taxonomy**.
  - Provide a 2-tier cascading filter:
    1. Therapeutic Class (1–39, e.g., `2. Antibiotic`, `11. Cardiovascular --- Antihypertensive`).
    2. Specific Pharmacologic Subclass (e.g., `1st Gen Cephalosporin`, `2nd Gen Cephalosporin`, `Penicillin`).
  - Add multi-factor sorting: by Therapeutic Class Number (1–39), Pharmacologic Subclass, Spaced Repetition Due Date, or Drug Name (A–Z).
  - Include an Empty Filter State: If active filters yield 0 cards, display an informative reset panel rather than prematurely triggering the "Flashcard Session Complete" graduation screen.
- **Interactive Pharmacophore Tag Highlighting on Flipped Cards**:
  - Replace static moiety pills in `StructureFlashcardCardFace` with the interactive `PharmacophoreTagList` component.
  - Wire tag hover and click states (`activePharmacophoreIds: Record<string, ColorPaletteItem>`, `hoveredPharmacophoreId: string | null`) directly to `SmilesCanvas` so substructures illuminate on the 2D vector structure in real time.
  - Synchronize active highlights between the standard card back canvas and the click-to-zoom vector modal.
- **User Customization & Clutter Prevention**:
  - Add a "⚙️ Display" controls popover in `StructureFlashcardDeck` persisted to `localStorage`.
  - Provide toggles for individual card sections:
    - Brand Names badge
    - Taxonomy Breadcrumb (Category 1–39 & Subclass)
    - Interactive Pharmacophore Tag Strip
    - Clinical Pharmacology & SAR Callouts
  - Provide 3 Layout Density modes:
    - **Split View (Default)**: 2-column layout (Structure + Tags on left; Clinical Pearls & MOA on right).
    - **Structure Focus**: Full-width structure canvas and pharmacophore tags; clinical details collapsed into an expandable accordion.
    - **Minimalist / Quick Recall**: High-density view with structure, generic name, and brand names only.
  - Guard keyboard shortcuts (`Space`, `1-4`) so `<select>` dropdown interactions do not trigger unexpected card flips or grading actions.

### Non-Goals
- Modifying underlying spaced repetition scheduling algorithm or interval formulas (`spacedRepetitionService.ts`).
- Altering the RDKit.js WASM drawing engine or chemical MolBlock rendering.
- Overwriting original curriculum structure data; taxonomy enrichment is a non-destructive overlay.

### Anti-Goals
- Never leak drug names, brand names, or taxonomy classifications on the blinded front face of the flashcard.
- Never cause layout shifts or canvas re-initialization when hovering or toggling pharmacophore tags.
- Never overwrite active session queues during in-session re-queuing (`reQueueActiveSession`).

---

## 3. Data Architecture & Taxonomy Modeling

### 3.1 First-Class Taxonomy Fields on `ChemicalStructure`

In `src/types/reviewModule.ts`, declare first-class optional taxonomy fields on `ChemicalStructure`:

```typescript
export interface ChemicalStructure {
  // Existing properties...
  id: string;
  name: string;
  genericName?: string;
  brandNames?: string[];
  tradeName?: string;
  chemicalClass: string;
  pharmacologicalClass: string;
  cid?: number;
  canonical_smiles?: string;
  canonicalSmiles?: string;
  smiles?: string;

  // Top Drugs Taxonomy Additions:
  therapeuticClassNumber?: number;      // 1 to 39
  therapeuticCategory?: string;         // e.g. "2. Antibiotic", "11. Cardiovascular --- Antihypertensive"
  broadPharmacologicClass?: string;     // e.g. "Cephalosporin", "Opioid"
  specificPharmacologicClass?: string;  // e.g. "1st Generation Cephalosporin", "Opioid partial agonist"
}
```

### 3.2 Taxonomy Catalog Data Structures

A new strongly-typed data module `src/data/topDrugsTaxonomyData.ts` defines the curriculum hierarchy:

```typescript
export interface TopDrugEntry {
  genericName: string;
  brandNames: string[];
  therapeuticClassNumber: number; // 1 to 39
  therapeuticCategory: string;    // e.g. "2. Antibiotic"
  broadPharmacologicClass: string; // e.g. "Cephalosporin"
  specificPharmacologicClass: string; // e.g. "1st Generation Cephalosporin"
  curriculumModuleId?: string;    // Optional link to review module
  notes?: string;
}

export interface TherapeuticClassCategory {
  classNumber: number;
  categoryName: string;           // e.g. "2. Antibiotic"
  broadClasses: string[];
  specificSubclasses: string[];
  totalDrugs: number;
}
```

### 3.3 Structure Enrichment & Normalization Pipeline

In `src/utils/topDrugsTaxonomy.ts`:
1. **Fuzzy Drug Name Normalization**: Strip salt suffixes and common qualifiers before matching:
   ```typescript
   export function normalizeForTaxonomyMatch(raw: string): string {
     return raw
       .toLowerCase()
       .replace(/\[.*?\]/g, '')
       .replace(/\b(hydrochloride|hcl|tartrate|succinate|sodium|potassium|calcium|monohydrate|maleate|mesylate|fumarate|besylate|dipivoxil|acetate|phosphate|nitrate|sulfate)\b/gi, '')
       .replace(/[^a-z0-9]/g, '')
       .trim();
   }
   ```
2. **Deterministic Matcher**:
   Matches candidate structures against the 39 categories by normalized generic name, brand name, trade name, or PubChem CID.
3. **Structure Enrichment Function**:
   ```typescript
   export function enrichStructureWithTaxonomy(structure: ChemicalStructure): ChemicalStructure {
     const match = findTopDrugMatch(structure.name, structure.genericName, structure.brandNames, structure.cid);
     if (!match) return structure;

     return {
       ...structure,
       brandNames: Array.from(new Set([...(structure.brandNames || []), ...match.brandNames])),
       tradeName: structure.tradeName || match.brandNames[0],
       therapeuticClassNumber: match.therapeuticClassNumber,
       therapeuticCategory: match.therapeuticCategory,
       broadPharmacologicClass: match.broadPharmacologicClass,
       specificPharmacologicClass: match.specificPharmacologicClass,
     };
   }
   ```
4. **Standalone Top 200 Deck Provisioning**:
   `getTop200Flashcards()` returns pre-scaffolded `FlashcardItem[]` entries. Each card uses `generateBaseStructureId()` from `cumulativeStructureHarvester.ts` (keyed on CID or normalized generic name) so spaced repetition progress stored in `localStorage` under `medchem_flashcard_progress` is shared across curriculum decks and the standalone Top 200 deck.

---

## 4. UI Component Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        StructureFlashcardDeck                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Controls Header:                                                 │  │
│  │ [Filter Mode: Top Drugs Taxonomy | Curriculum Modules]           │  │
│  │ [Sort by: Class (1-39) ▼]  [⚙️ Display Settings Popover ▼]       │  │
│  │                                                                  │  │
│  │ Tiered Filter Bar:                                               │  │
│  │ Tier 1: Therapeutic Class (1-39) Chips / Dropdown                │  │
│  │ Tier 2: Specific Pharmacologic Subclass Chips                    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                   StructureFlashcardCardFace                     │  │
│  │                                                                  │  │
│  │  FRONT: Strictly Blinded Structure Canvas + Zoom Modal           │  │
│  │                                                                  │  │
│  │  BACK:                                                           │  │
│  │  Header:                                                         │  │
│  │  [Breadcrumb: Class 2: Antibiotic › Cephalosporin › 1st Gen]     │  │
│  │  [Drug Name: CEPHALEXIN] [Brand: Keflex]                         │  │
│  │                                                                  │  │
│  │  Customizable Body (Split / Structure Focus / Minimalist):       │  │
│  │  ┌─────────────────────────────┬──────────────────────────────┐  │  │
│  │  │ Left: Structure & Tags      │ Right: Clinical & MOA        │  │  │
│  │  │  • SmilesCanvas (2D Vector) │  • Subclass Classification   │  │  │
│  │  │  • PharmacophoreTagList     │  • Mechanism of Action (MOA) │  │  │
│  │  │    (Multi-Color Highlights) │  • Pharmacokinetics & Safety │  │  │
│  │  └─────────────────────────────┴──────────────────────────────┘  │  │
│  │                                                                  │  │
│  │  Footer: Spaced Repetition Rating Buttons (<1m, 4m, 10m, 1d)    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Card Display Customization & Clutter Prevention

To prevent information overload, `StructureFlashcardDeck` passes display preferences to `StructureFlashcardCardFace`:

```typescript
export interface FlashcardDisplaySettings {
  density: 'split' | 'structure-focus' | 'minimalist';
  showBrandNames: boolean;
  showTaxonomyBreadcrumbs: boolean;
  showPharmacophoreTags: boolean;
  showClinicalPearls: boolean;
}

export const DEFAULT_FLASHCARD_DISPLAY_SETTINGS: FlashcardDisplaySettings = {
  density: 'split',
  showBrandNames: true,
  showTaxonomyBreadcrumbs: true,
  showPharmacophoreTags: true,
  showClinicalPearls: true,
};
```

Updated `StructureFlashcardCardFaceProps`:
```typescript
export interface StructureFlashcardCardFaceProps {
  structure: ChemicalStructure;
  drugName?: string;
  isFlipped: boolean;
  isSuspended?: boolean;
  displaySettings?: FlashcardDisplaySettings;
  onToggleSuspend?: () => void;
  onFlip: () => void;
  children?: React.ReactNode;
}
```

- **Persistence**: Saved in `localStorage` under `medchem_flashcard_display_settings`.
- **Dynamic Density Response**:
  - `showBrandNames = false`: Hides brand name badge from header.
  - `showTaxonomyBreadcrumbs = false`: Hides 3-tier hierarchy breadcrumbs.
  - `showPharmacophoreTags = false`: Hides `PharmacophoreTagList`.
  - `showClinicalPearls = false`: Hides MOA and clinical pearls section.
  - `density = 'structure-focus'`: 1-column layout; structure canvas and tags prominent; clinical pearls collapsed into an expandable `<details>` accordion.
  - `density = 'minimalist'`: Rapid-recall mode displaying structure canvas, generic name, brand name, and grading buttons only.

### 4.2 Interactive Pharmacophore Highlighting on Flipped Cards

In `StructureFlashcardCardFace.tsx`:
1. **Multi-color active pharmacophores state**:
   ```typescript
   import {
     ColorPaletteItem,
     PHARMACOPHORE_COLOR_PALETTE,
   } from './PharmacophoreTagList';
   import { getPharmacophoresForStructure } from '../utils/pharmacophoreData';

   const [activePharmacophoreIds, setActivePharmacophoreIds] = useState<Record<string, ColorPaletteItem>>({});
   const [hoveredPharmacophoreId, setHoveredPharmacophoreId] = useState<string | null>(null);
   ```
2. **Reset state on card flip or structure change**:
   ```typescript
   useEffect(() => {
     setActivePharmacophoreIds({});
     setHoveredPharmacophoreId(null);
   }, [structure.id, isFlipped]);
   ```
3. **Derive active highlights list for `SmilesCanvas`**:
   ```typescript
   const pharmacophores = useMemo(() => getPharmacophoresForStructure(structure), [structure]);

   const activePharmacophoresList = useMemo(() => {
     const list: Array<{ smarts?: string; color: string; name?: string; id?: string }> = [];
     Object.entries(activePharmacophoreIds).forEach(([id, color]) => {
       if (id === hoveredPharmacophoreId) return;
       const g = pharmacophores.find((p) => p.id === id);
       if (g) list.push({ id: g.id, name: g.name, smarts: g.smarts, color: color.hex || color.pinBg });
     });
     if (hoveredPharmacophoreId) {
       const g = pharmacophores.find((p) => p.id === hoveredPharmacophoreId);
       if (g) {
         const activeColor = activePharmacophoreIds[hoveredPharmacophoreId];
         list.push({ id: g.id, name: g.name, smarts: g.smarts, color: activeColor ? activeColor.hex : '#3b82f6' });
       }
     }
     return list;
   }, [activePharmacophoreIds, hoveredPharmacophoreId, pharmacophores]);
   ```
4. **Color-cycling toggle handler**:
   ```typescript
   const handleTogglePharmacophore = (group: PharmacophoreGroup) => {
     setActivePharmacophoreIds((prev) => {
       const copy = { ...prev };
       if (copy[group.id]) {
         delete copy[group.id];
         return copy;
       }
       const usedHexes = new Set(Object.values(copy).map((c) => c.hex));
       const nextColor =
         PHARMACOPHORE_COLOR_PALETTE.find((c) => !usedHexes.has(c.hex)) ||
         PHARMACOPHORE_COLOR_PALETTE[Object.keys(copy).length % PHARMACOPHORE_COLOR_PALETTE.length];
       copy[group.id] = nextColor;
       return copy;
     });
   };
   ```
5. **Component Mounting (Standard Canvas & Zoom Modal)**:
   ```tsx
   {/* Standard 2D Canvas */}
   <SmilesCanvas
     smiles={canonicalSmiles}
     molBlock={structure.pubchemMolBlock}
     fallbackImageUrl={structure.pngUrl}
     cid={structure.cid}
     activePharmacophores={activePharmacophoresList}
     width={340}
     height={220}
   />

   {/* Interactive Tag Strip */}
   {displaySettings.showPharmacophoreTags && (
     <PharmacophoreTagList
       structure={structure}
       activePharmacophoreIds={activePharmacophoreIds}
       hoveredPharmacophoreId={hoveredPharmacophoreId}
       onTogglePharmacophore={handleTogglePharmacophore}
       onHoverPharmacophore={setHoveredPharmacophoreId}
       onClearAllHighlights={() => setActivePharmacophoreIds({})}
     />
   )}

   {/* Click-to-Zoom Vector Modal Canvas */}
   <SmilesCanvas
     smiles={canonicalSmiles}
     molBlock={structure.pubchemMolBlock}
     fallbackImageUrl={structure.pngUrl}
     cid={structure.cid}
     activePharmacophores={activePharmacophoresList}
     width={700}
     height={480}
   />
   ```

---

## 5. Sorting, Filtering & Spaced Repetition Queue Management

### 5.1 Queue State Architecture
In `StructureFlashcardDeck.tsx`:
- **Initial Candidates Calculation**: When filters or sort options change, compute `candidatePool` from `cards` and initialize `activeQueue` in `useState<FlashcardItem[]>(candidatePool)`, resetting `currentIndex` to 0.
- **In-Session Mutation Preservation**: When grading ratings occur, `reQueueActiveSession()` inserts failed cards into `activeQueue` state. Using `useState` rather than a direct `useMemo` over `props.cards` guarantees that Anki-style in-session re-queuing is preserved throughout the session.

### 5.2 Filter State & Empty Filter View
```typescript
interface TaxonomyFilterState {
  therapeuticClassNumber: number | null; // null = all classes
  specificSubclass: string | null;       // null = all subclasses
}
```
If a student selects a filter with 0 matching cards in their deck:
- Render a dedicated **Empty Filter State** with a "Reset Filters" action button.
- Do NOT trigger the "Flashcard Session Complete" graduation screen.

### 5.3 Sort Stability
When sorting by `'class-number'`, handle cards without a taxonomy match using a numeric fallback:
```typescript
const sortCards = (a: FlashcardItem, b: FlashcardItem, sortBy: SortMode): number => {
  if (sortBy === 'class-number') {
    const classA = a.structure.therapeuticClassNumber ?? 999;
    const classB = b.structure.therapeuticClassNumber ?? 999;
    if (classA !== classB) return classA - classB;
    const subA = a.structure.specificPharmacologicClass || '';
    const subB = b.structure.specificPharmacologicClass || '';
    if (subA !== subB) return subA.localeCompare(subB);
    return a.drugName.localeCompare(b.drugName);
  }
  if (sortBy === 'subclass') {
    const subA = a.structure.specificPharmacologicClass || a.structure.pharmacologicalClass || '';
    const subB = b.structure.specificPharmacologicClass || b.structure.pharmacologicalClass || '';
    return subA.localeCompare(subB);
  }
  if (sortBy === 'due-date') {
    return a.dueTimestamp - b.dueTimestamp;
  }
  return a.drugName.localeCompare(b.drugName);
};
```

### 5.4 Keyboard Focus Guard
In `StructureFlashcardDeck.tsx` `handleKeyDown`:
```typescript
if (
  target &&
  (target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable ||
    target.getAttribute('contenteditable') === 'true')
) {
  return;
}
```

---

## 6. Testing Strategy

1. **Unit Tests (`tests/topDrugsTaxonomy.test.ts`)**:
   - Verify all 39 therapeutic classes, subcategories, brand name associations, and generic name normalization (including salt suffix removal).
   - Verify that curriculum structures (e.g., Furosemide, Cephalexin, Metoprolol, Lisinopril, Atorvastatin) correctly inherit their Top Drugs class number, broad class, and specific subclass.
2. **Component Integration Tests (`tests/StructureFlashcardDeck.test.ts`)**:
   - Verify deck filter mode toggling (Curriculum Modules vs. Top Drugs Taxonomy).
   - Verify cascading filter selection (Category -> Subclass).
   - Verify sorting by class number with stable numeric fallback (`?? 999`).
   - Verify empty filter state renders when 0 cards match.
   - Verify keyboard guard ignores `<select>` elements.
3. **Face Presentation Tests (`tests/StructureFlashcardCardFace.test.ts`)**:
   - Verify blinded front face leaks zero drug names or brand names.
   - Verify card back displays breadcrumbs and brand names badge when toggled ON.
   - Verify `PharmacophoreTagList` click toggles multi-color active state and updates `activePharmacophoresList` passed to `SmilesCanvas`.
   - Verify zoom modal receives active pharmacophores.
   - Verify layout density switches (`split`, `structure-focus`, `minimalist`).
4. **Regression Tests**:
   - Run full test suite (`tests/StructureFlashcardDeck.test.ts`, `tests/StructureFlashcardCardFace.test.ts`, `tests/smartsDictionary.test.ts`).
   - Run typecheck (`npm run lint`).

---

## 7. Open Questions and Resolutions

- **Q1: What happens if a curriculum drug is not in the Top 200 reference list?**  
  *Resolution*: The drug retains its curriculum module classification, and its breadcrumb displays its curriculum `pharmacologicalClass` and `chemicalClass`. It sorts stably to the end under class number `999` ("Other / Specialized Curriculum").
- **Q2: How do combination drugs (e.g., Suboxone [Buprenorphine/Naloxone], Augmentin [Amoxicillin/Clavulanate]) display brand and subclass?**  
  *Resolution*: They are indexed by their primary active generic name and list all official brand names in the badge (e.g. `Brand: Augmentin`), mapped to their primary antimicrobial or analgesic class.
- **Q3: How is the standalone Top 200 deck selected vs. taxonomy filter mode?**  
  *Resolution*: `CumulativeStudyHubModal` provides the top-level deck selector/preset (`Curriculum Decks` vs. `Top 200 Drugs Deck`). Inside `StructureFlashcardDeck`, the Filter Mode toggles between Module filters (for curriculum cards) and the 39 Therapeutic Categories.
