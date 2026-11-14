# Top 200 Flashcards Structure Remedy & Clinical Monograph Flashcards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate all broken/missing chemical structures in the Top 200 Flashcards deck by providing 100% curated Daylight SMILES with side-by-side combination rendering, and introduce a dedicated Clinical Monograph flashcard deck mode featuring comprehensive 12-domain drug monographs organized in an Option A tabbed layout with independent spaced-repetition progress.

**Architecture:** A layered offline-first architecture with two pre-compiled data modules (`topDrugsSmilesData.ts` and `topDrugsClinicalData.ts`). A new `MultiSmilesCanvas.tsx` component wraps `<SmilesCanvas>` to render single molecules, side-by-side combination structures (blinded on the front face, revealed on the back), and macromolecule representations for biologics. `TopDrugClinicalCard.tsx` renders the Option A monograph layout with top Black Box / Contraindication callout banners and 3 structured tabs (Pharmacology, Regimens & Safety, Patient Care & Monitoring). `PracticeLabView.tsx` integrates a segmented deck mode switcher (`🧪 Chemical Structure Mode` vs `📋 Clinical Monograph Mode`) and maintains isolated SM-2 spaced repetition storage namespaces.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React icons, RDKit MinimalLib WASM, Vitest, React Testing Library.

**Spec:** [docs/superpowers/specs/2026-11-13-top-drugs-structure-remedy-and-clinical-monographs-design.md](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20%282%29/docs/superpowers/specs/2026-11-13-top-drugs-structure-remedy-and-clinical-monographs-design.md)

## Global Constraints

- 100% of all 250 drugs in `TOP_DRUGS_TAXONOMY` must resolve an authentic structure record with zero fallbacks to `c1ccccc1` (benzene ring).
- Card fronts in Chemical Structure Mode must strictly blind all generic names, brand names, and component names (rendering non-identifying labels like "Component A" and "Component B" for combination drugs).
- Clinical Monograph Mode must be scoped specifically to the Top 200 Drugs Catalog preset, presenting all 12 requested clinical domains across the Option A tabbed layout.
- Spaced repetition progress for Clinical Monograph Mode must be stored in an independent namespace (`mcp_top200_clinical_progress_v1`) isolated from Chemical Structure Mode (`mcp_flashcard_progress_v1`).
- All data and rendering must be 100% offline-ready with 0ms card flips and zero network requests.
- All code must pass `npm run typecheck`, `npm run lint`, and `npm run test:run` with zero errors.

## Review Focus

1. **Multi-Component Combination Rendering with Variable Component Counts**: Inputs with 2 or 3 components (e.g. `Acetaminophen / Butalbital / Caffeine` vs `Amoxicillin / Potassium Clavulanate`) must render cleanly in a responsive flex row with proper `+` dividers and blinded labels without horizontal canvas overflow or clipping. (Pinned to Task 2)
2. **Biologic and Peptide Drugs Handling**: Drugs without standard small-molecule SMILES (the 9 catalog biologics like `Insulin Glargine` and `Adalimumab`) must render a dedicated macromolecule schematic badge instead of breaking or crashing RDKit WASM. (Pinned to Task 1 & Task 2)
3. **Empty or Missing Optional Fields in Clinical Monograph**: Medications without FDA Black Box Warnings or relative contraindications must cleanly suppress the warning banner or empty sections without rendering blank boxes or broken UI. (Pinned to Task 4)
4. **Independent Progress Isolation**: Rating a card in Chemical Structure Mode must not modify the interval, ease factor, repetition count, or due date in Clinical Monograph Mode for that same drug, and vice-versa. (Pinned to Task 5)
5. **Keyboard Accessibility and Tab Switching Across Card Flips**: Flipping between card front and back and pressing `1`, `2`, `3` to cycle clinical tabs must not cause focus loss, state desynchronization, or RDKit canvas memory leaks. (Pinned to Task 4 & Task 5)

---

### Task 1: Chemoinformatics Data Layer & Multi-Component Taxonomy Expansion

**Files:**
- Create: `src/data/topDrugsSmilesData.ts`
- Modify: `src/utils/topDrugsTaxonomy.ts:1-350`
- Test: `tests/utils/topDrugsTaxonomyData.test.ts`

**Interfaces:**
- Consumes: `TOP_DRUGS_TAXONOMY` from `src/data/topDrugsTaxonomyData.ts`
- Produces: 
  - `TopDrugStructureType = 'single-molecule' | 'multi-component' | 'biologic'`
  - `MultiComponentPart = { componentName: string; smiles: string; role?: string }`
  - `TopDrugStructureRecord = { genericName: string; structureType: TopDrugStructureType; smiles: string; components?: MultiComponentPart[]; biologicDescription?: string; cid?: number; molecularWeight?: number }`
  - `TOP_DRUGS_SMILES_CATALOG: Record<string, TopDrugStructureRecord>`
  - `resolveTopDrugStructureRecord(entry: TopDrugEntry): TopDrugStructureRecord`
  - `resolveSmilesForEntry(entry: TopDrugEntry): string`

- [ ] **Step 1: Write the failing tests in `tests/utils/topDrugsTaxonomyData.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { TOP_DRUGS_TAXONOMY } from '../../src/data/topDrugsTaxonomyData.js';
import { resolveSmilesForEntry, resolveTopDrugStructureRecord } from '../../src/utils/topDrugsTaxonomy.js';
import { TOP_DRUGS_SMILES_CATALOG } from '../../src/data/topDrugsSmilesData.js';

describe('Top Drugs Chemoinformatics Taxonomy Expansion', () => {
  it('contains 100% curated structure records for all 250 taxonomy drugs with zero fallback benzene rings', () => {
    expect(TOP_DRUGS_TAXONOMY.length).toBe(250);
    const benzeneCount = TOP_DRUGS_TAXONOMY.filter(entry => {
      const smiles = resolveSmilesForEntry(entry);
      return smiles === 'c1ccccc1';
    }).length;
    expect(benzeneCount).toBe(0);
  });

  it('correctly maps multi-component combination drugs with structured parts', () => {
    const augmentin = TOP_DRUGS_TAXONOMY.find(e => e.genericName === 'Amoxicillin / Potassium Clavulanate')!;
    expect(augmentin).toBeDefined();
    const record = resolveTopDrugStructureRecord(augmentin);
    expect(record.structureType).toBe('multi-component');
    expect(record.components).toBeDefined();
    expect(record.components!.length).toBe(2);
    expect(record.components![0].componentName).toMatch(/amoxicillin/i);
    expect(record.components![1].componentName).toMatch(/clavulanate/i);
  });

  it('correctly tags biologics and provides macromolecule descriptions without plain benzene rings', () => {
    const insulin = TOP_DRUGS_TAXONOMY.find(e => e.genericName === 'Insulin Glargine')!;
    expect(insulin).toBeDefined();
    const record = resolveTopDrugStructureRecord(insulin);
    expect(record.structureType).toBe('biologic');
    expect(record.biologicDescription).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/utils/topDrugsTaxonomyData.test.ts`
Expected: FAIL with "TOP_DRUGS_SMILES_CATALOG not defined" or benzeneCount > 0.

- [ ] **Step 3: Implement `src/data/topDrugsSmilesData.ts` and update `src/utils/topDrugsTaxonomy.ts`**

1. Create `src/data/topDrugsSmilesData.ts` defining `TopDrugStructureRecord`, `MultiComponentPart`, and `TOP_DRUGS_SMILES_CATALOG` with all 250 catalog drugs mapped with canonical Daylight SMILES, structured multi-part arrays for the 16 combination drugs, and macromolecule tags for the 9 biologics.
2. In `src/utils/topDrugsTaxonomy.ts`, export `resolveTopDrugStructureRecord(entry: TopDrugEntry): TopDrugStructureRecord`.
3. Update `resolveSmilesForEntry(entry: TopDrugEntry): string` to look up `TOP_DRUGS_SMILES_CATALOG` first, returning the primary component SMILES (or dot-separated SMILES) and ensuring zero fallbacks to `c1ccccc1`.
4. Update `getTop200Flashcards()` to enrich `FlashcardItem.structure` with `structureRecord`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/utils/topDrugsTaxonomyData.test.ts`
Expected: PASS (all tests pass).

- [ ] **Step 5: Commit**

```bash
git add src/data/topDrugsSmilesData.ts src/utils/topDrugsTaxonomy.ts tests/utils/topDrugsTaxonomyData.test.ts
git commit -m "feat(chemoinformatics): add 100% curated smiles catalog and multi-component support for top drugs"
```

---

### Task 2: Multi-Structure Vector Canvas Component (`MultiSmilesCanvas.tsx`)

**Files:**
- Create: `src/components/MultiSmilesCanvas.tsx`
- Test: `tests/components/MultiSmilesCanvas.test.tsx`

**Interfaces:**
- Consumes: `TopDrugStructureRecord` from `src/data/topDrugsSmilesData.ts`, `<SmilesCanvas>` from `src/components/SmilesCanvas.tsx`
- Produces:
  - `<MultiSmilesCanvas structureRecord={TopDrugStructureRecord} isFront={boolean} className?: string />`

- [ ] **Step 1: Write the failing tests in `tests/components/MultiSmilesCanvas.test.tsx`**

```typescript
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MultiSmilesCanvas } from '../../src/components/MultiSmilesCanvas.js';
import type { TopDrugStructureRecord } from '../../src/data/topDrugsSmilesData.js';

// Mock SmilesCanvas to avoid RDKit WASM canvas dependencies in unit tests
vi.mock('../../src/components/SmilesCanvas.js', () => ({
  SmilesCanvas: ({ smiles }: { smiles: string }) => (
    <div data-testid="mock-smiles-canvas" data-smiles={smiles} />
  ),
}));

describe('MultiSmilesCanvas', () => {
  it('renders a single SmilesCanvas for standard single-molecule drugs', () => {
    const singleRecord: TopDrugStructureRecord = {
      genericName: 'Atorvastatin',
      structureType: 'single-molecule',
      smiles: 'CC(C)C1=C(C(=C(N1CCC(CC(CC(=O)O)O)O)C2=CC=C(C=C2)F)C3=CC=CC=C3)C(=O)NC4=CC=CC=C4',
      cid: 60823,
    };

    render(<MultiSmilesCanvas structureRecord={singleRecord} isFront={true} />);
    const canvases = screen.getAllByTestId('mock-smiles-canvas');
    expect(canvases.length).toBe(1);
    expect(canvases[0].getAttribute('data-smiles')).toBe(singleRecord.smiles);
  });

  it('renders side-by-side canvases with blinded component labels on front face for combination drugs', () => {
    const comboRecord: TopDrugStructureRecord = {
      genericName: 'Amoxicillin / Potassium Clavulanate',
      structureType: 'multi-component',
      smiles: 'CC1(C(N2C(S1)C(C2=O)NC(=O)C(C3=CC=C(C=C3)O)N)C(=O)O)C.C1C2C(C(=O)N2C1=CCO)C(=O)O',
      components: [
        { componentName: 'Amoxicillin', smiles: 'CC1(C(N2C(S1)C(C2=O)NC(=O)C(C3=CC=C(C=C3)O)N)C(=O)O)C', role: 'Aminopenicillin' },
        { componentName: 'Clavulanate', smiles: 'C1C2C(C(=O)N2C1=CCO)C(=O)O', role: 'Beta-Lactamase Inhibitor' },
      ],
    };

    render(<MultiSmilesCanvas structureRecord={comboRecord} isFront={true} />);
    const canvases = screen.getAllByTestId('mock-smiles-canvas');
    expect(canvases.length).toBe(2);
    // Verifies front face blinding: NO leak of generic names
    expect(screen.queryByText(/Amoxicillin/i)).toBeNull();
    expect(screen.queryByText(/Clavulanate/i)).toBeNull();
    expect(screen.getByText(/Component A/i)).toBeDefined();
    expect(screen.getByText(/Component B/i)).toBeDefined();
  });

  it('reveals component names and pharmacologic roles on back face for combination drugs', () => {
    const comboRecord: TopDrugStructureRecord = {
      genericName: 'Amoxicillin / Potassium Clavulanate',
      structureType: 'multi-component',
      smiles: '...',
      components: [
        { componentName: 'Amoxicillin', smiles: 'SMILES_A', role: 'Aminopenicillin' },
        { componentName: 'Clavulanate', smiles: 'SMILES_B', role: 'Beta-Lactamase Inhibitor' },
      ],
    };

    render(<MultiSmilesCanvas structureRecord={comboRecord} isFront={false} />);
    expect(screen.getByText(/Amoxicillin/i)).toBeDefined();
    expect(screen.getByText(/Clavulanate/i)).toBeDefined();
    expect(screen.getByText(/Beta-Lactamase Inhibitor/i)).toBeDefined();
  });

  it('renders a biologic macromolecule schematic badge for biologic drugs', () => {
    const biologicRecord: TopDrugStructureRecord = {
      genericName: 'Adalimumab',
      structureType: 'biologic',
      smiles: '',
      biologicDescription: 'Recombinant human IgG1 monoclonal antibody targeting TNF-alpha',
    };

    render(<MultiSmilesCanvas structureRecord={biologicRecord} isFront={true} />);
    expect(screen.getByText(/Biologic Macromolecule/i)).toBeDefined();
    expect(screen.getByText(/TNF-alpha/i)).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/MultiSmilesCanvas.test.tsx`
Expected: FAIL with "MultiSmilesCanvas not found".

- [ ] **Step 3: Implement `src/components/MultiSmilesCanvas.tsx`**

1. Create `MultiSmilesCanvas` supporting single molecules via `<SmilesCanvas>`.
2. For `structureType === 'multi-component'`: Render a flex-row layout with cards for each component separated by a styled `+` badge. When `isFront === true`, render non-identifying header tags `"Component A (Primary Entity)"`, `"Component B (Secondary Entity)"`, `"Component C (Adjuvant)"`. When `isFront === false`, display `part.componentName` and `part.role`.
3. For `structureType === 'biologic'`: Render a clean, styled macromolecule schematic badge with peptide/mAb iconography and the molecular target description.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/components/MultiSmilesCanvas.test.tsx`
Expected: PASS (all 4 tests pass).

- [ ] **Step 5: Commit**

```bash
git add src/components/MultiSmilesCanvas.tsx tests/components/MultiSmilesCanvas.test.tsx
git commit -m "feat(ui): add MultiSmilesCanvas component for side-by-side combination and biologic rendering"
```

---

### Task 3: Comprehensive 12-Domain Clinical Monograph Catalog (`topDrugsClinicalData.ts`)

**Files:**
- Create: `src/data/topDrugsClinicalData.ts`
- Test: `tests/data/topDrugsClinicalData.test.ts`

**Interfaces:**
- Consumes: `TOP_DRUGS_TAXONOMY` from `src/data/topDrugsTaxonomyData.ts`
- Produces:
  - `TopDrugClinicalMonograph = { genericName: string; brandNames: string[]; therapeuticClass: string; pharmacologicSubclass: string; mechanismOfAction: string; dosageForms: string[]; dosingRegimens: { indication: string; regimen: string; notes?: string }[]; sideEffects: { common: string[]; severe: string[] }; blackBoxWarnings?: string[]; contraindications: { absolute: string[]; relative?: string[] }; drugInteractions: { major: string[]; common: string[] }; monitoringParameters: { baseline: string[]; efficacy: string[]; toxicity: string[] }; administrationCounseling: string[] }`
  - `TOP_DRUGS_CLINICAL_CATALOG: Record<string, TopDrugClinicalMonograph>`
  - `getTopDrugClinicalMonograph(genericName: string): TopDrugClinicalMonograph | null`

- [ ] **Step 1: Write the failing tests in `tests/data/topDrugsClinicalData.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { TOP_DRUGS_TAXONOMY } from '../../src/data/topDrugsTaxonomyData.js';
import {
  TOP_DRUGS_CLINICAL_CATALOG,
  getTopDrugClinicalMonograph,
} from '../../src/data/topDrugsClinicalData.js';

describe('Top Drugs Clinical Monograph Catalog', () => {
  it('contains an authoritative clinical monograph for all 250 drugs in TOP_DRUGS_TAXONOMY', () => {
    expect(TOP_DRUGS_TAXONOMY.length).toBe(250);
    for (const drug of TOP_DRUGS_TAXONOMY) {
      const monograph = getTopDrugClinicalMonograph(drug.genericName);
      expect(monograph, `Missing clinical monograph for ${drug.genericName}`).toBeDefined();
      expect(monograph!.genericName).toBe(drug.genericName);
      expect(monograph!.mechanismOfAction.length).toBeGreaterThan(15);
      expect(monograph!.dosageForms.length).toBeGreaterThan(0);
      expect(monograph!.dosingRegimens.length).toBeGreaterThan(0);
      expect(monograph!.sideEffects.common.length).toBeGreaterThan(0);
      expect(monograph!.contraindications.absolute.length).toBeGreaterThan(0);
      expect(monograph!.drugInteractions.major.length).toBeGreaterThan(0);
      expect(monograph!.monitoringParameters.efficacy.length).toBeGreaterThan(0);
      expect(monograph!.administrationCounseling.length).toBeGreaterThan(0);
    }
  });

  it('correctly provides Black Box Warnings for high-risk medications', () => {
    const warfarin = getTopDrugClinicalMonograph('Warfarin')!;
    expect(warfarin).toBeDefined();
    expect(warfarin.blackBoxWarnings).toBeDefined();
    expect(warfarin.blackBoxWarnings!.length).toBeGreaterThan(0);
    expect(warfarin.blackBoxWarnings![0]).toMatch(/bleed|hemorrhage/i);

    const cipro = getTopDrugClinicalMonograph('Ciprofloxacin')!;
    expect(cipro.blackBoxWarnings).toBeDefined();
    expect(cipro.blackBoxWarnings![0]).toMatch(/tendonitis|tendon rupture|myasthenia gravis|aortic/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/data/topDrugsClinicalData.test.ts`
Expected: FAIL with "TOP_DRUGS_CLINICAL_CATALOG not defined".

- [ ] **Step 3: Implement `src/data/topDrugsClinicalData.ts`**

1. Create `src/data/topDrugsClinicalData.ts` exporting `TopDrugClinicalMonograph`, `TOP_DRUGS_CLINICAL_CATALOG`, and `getTopDrugClinicalMonograph(genericName: string): TopDrugClinicalMonograph | null`.
2. Populate the catalog across all 250 taxonomy drugs using standardized pharmacy reference data (NAPLEX / Xavier Curriculum standards) covering all 12 domains:
   - Brand names
   - Therapeutic Category & Specific Subclass
   - Detailed Molecular & Physiological MOA
   - Available Dosage Forms (Tablet, Capsule, Inhalation, IV, Topicals, etc.)
   - Indication-specific dosing regimens
   - Adverse reactions (common & severe)
   - Black Box Warnings (when applicable, empty/undefined when none)
   - Absolute & relative contraindications
   - Major & common drug interactions (CYP enzymes, QT prolongers, NSAIDs/anticoagulants, etc.)
   - Monitoring parameters (baseline labs, efficacy markers, toxicity vitals)
   - Patient administration & counseling points
3. Implement resilient name normalization in `getTopDrugClinicalMonograph` using `normalizeForTaxonomyMatch`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/data/topDrugsClinicalData.test.ts`
Expected: PASS (all tests pass for all 250 drugs).

- [ ] **Step 5: Commit**

```bash
git add src/data/topDrugsClinicalData.ts tests/data/topDrugsClinicalData.test.ts
git commit -m "feat(clinical): add 250-drug clinical monograph catalog with 12 high-yield pharmacy domains"
```

---

### Task 4: Clinical Monograph Flashcard Component (Option A Layout: `TopDrugClinicalCard.tsx`)

**Files:**
- Create: `src/components/TopDrugClinicalCard.tsx`
- Test: `tests/components/TopDrugClinicalCard.test.tsx`

**Interfaces:**
- Consumes: `TopDrugClinicalMonograph` from `src/data/topDrugsClinicalData.ts`, `FlashcardItem` from `src/types/cumulativeStudy.ts`
- Produces:
  - `<TopDrugClinicalCard monograph={TopDrugClinicalMonograph} isFlipped={boolean} onFlip={() => void} />`

- [ ] **Step 1: Write the failing tests in `tests/components/TopDrugClinicalCard.test.tsx`**

```typescript
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TopDrugClinicalCard } from '../../src/components/TopDrugClinicalCard.js';
import type { TopDrugClinicalMonograph } from '../../src/data/topDrugsClinicalData.js';

const mockMonograph: TopDrugClinicalMonograph = {
  genericName: 'Atorvastatin',
  brandNames: ['Lipitor'],
  therapeuticClass: '11. Antihyperlipidemic',
  pharmacologicSubclass: 'HMG-CoA Reductase Inhibitor',
  mechanismOfAction: 'Competitive inhibitor of HMG-CoA reductase, the rate-limiting enzyme in cholesterol biosynthesis.',
  dosageForms: ['Oral Tablet: 10mg, 20mg, 40mg, 80mg'],
  dosingRegimens: [
    { indication: 'Hypercholesterolemia / ASCVD Primary Prevention', regimen: '10-20 mg PO once daily' },
    { indication: 'Secondary ASCVD Prevention (High-Intensity)', regimen: '40-80 mg PO once daily' },
  ],
  sideEffects: {
    common: ['Myalgia', 'Diarrhea', 'Arthralgia', 'Nasopharyngitis'],
    severe: ['Rhabdomyolysis', 'Immune-mediated necrotizing myopathy', 'Hepatotoxicity'],
  },
  blackBoxWarnings: undefined,
  contraindications: {
    absolute: ['Active liver disease or unexplained persistent LFT elevations', 'Pregnancy and lactation'],
    relative: ['Concomitant strong CYP3A4 inhibitors (dose caps apply)'],
  },
  drugInteractions: {
    major: ['Strong CYP3A4 inhibitors (Clarithromycin, Itraconazole)', 'Gemfibrozil (avoid)'],
    common: ['Grapefruit juice (>1 quart/day)', 'Cyclosporine', 'Warfarin'],
  },
  monitoringParameters: {
    baseline: ['Baseline lipid panel', 'Baseline hepatic enzymes (ALT/AST)'],
    efficacy: ['Lipid panel (LDL-C reduction) at 4-12 weeks after initiation/dose titration'],
    toxicity: ['CPK if muscle pain/weakness occurs', 'Annual LFTs as clinically indicated'],
  },
  administrationCounseling: [
    'May be taken with or without food at any time of day (long half-life).',
    'Immediately report unexplained muscle pain, tenderness, or brown/dark urine.',
  ],
};

describe('TopDrugClinicalCard', () => {
  it('renders generic name and prompt on un-flipped front face', () => {
    const onFlip = vi.fn();
    render(<TopDrugClinicalCard monograph={mockMonograph} isFlipped={false} onFlip={onFlip} />);
    expect(screen.getByText('Atorvastatin')).toBeDefined();
    expect(screen.getByText(/HMG-CoA Reductase Inhibitor/i)).toBeDefined();
    expect(screen.getByText(/Click or Space to flip for Monograph/i)).toBeDefined();
  });

  it('renders Option A layout with 3 tabs on flipped back face', () => {
    const onFlip = vi.fn();
    render(<TopDrugClinicalCard monograph={mockMonograph} isFlipped={true} onFlip={onFlip} />);
    expect(screen.getByRole('tab', { name: /Pharmacology/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /Regimens & Safety/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /Patient Care/i })).toBeDefined();
  });

  it('switches between clinical tabs and renders corresponding domains', () => {
    const onFlip = vi.fn();
    render(<TopDrugClinicalCard monograph={mockMonograph} isFlipped={true} onFlip={onFlip} />);
    
    // Tab 1 (Default): Pharmacology
    expect(screen.getByText(/Competitive inhibitor of HMG-CoA reductase/i)).toBeDefined();
    expect(screen.getByText(/Lipitor/i)).toBeDefined();

    // Switch to Tab 2: Regimens & Safety
    const safetyTab = screen.getByRole('tab', { name: /Regimens & Safety/i });
    fireEvent.click(safetyTab);
    expect(screen.getByText(/Secondary ASCVD Prevention/i)).toBeDefined();
    expect(screen.getByText(/Rhabdomyolysis/i)).toBeDefined();
    expect(screen.getByText(/Active liver disease/i)).toBeDefined();

    // Switch to Tab 3: Patient Care & Monitoring
    const patientTab = screen.getByRole('tab', { name: /Patient Care/i });
    fireEvent.click(patientTab);
    expect(screen.getByText(/Strong CYP3A4 inhibitors/i)).toBeDefined();
    expect(screen.getByText(/Baseline lipid panel/i)).toBeDefined();
    expect(screen.getByText(/Immediately report unexplained muscle pain/i)).toBeDefined();
  });

  it('renders a prominent Black Box Warning banner when blackBoxWarnings exist', () => {
    const warningMonograph: TopDrugClinicalMonograph = {
      ...mockMonograph,
      blackBoxWarnings: ['Fatal hemorrhage risk: Can cause major or fatal bleeding.'],
    };
    render(<TopDrugClinicalCard monograph={warningMonograph} isFlipped={true} onFlip={vi.fn()} />);
    expect(screen.getByText(/BOXED WARNING/i)).toBeDefined();
    expect(screen.getByText(/Fatal hemorrhage risk/i)).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/TopDrugClinicalCard.test.tsx`
Expected: FAIL with "TopDrugClinicalCard not found".

- [ ] **Step 3: Implement `src/components/TopDrugClinicalCard.tsx`**

1. Front Face: Render Generic Name in clean card header, phonetic/subclass pill, brand hint chip, and flip prompt.
2. Back Face (Option A Layout):
   - Top Header: Generic Name + Brand Names, with Red/Amber Boxed Warning Callout Banner when `monograph.blackBoxWarnings` exists and Absolute Contraindications chip.
   - 3 Tab Buttons with Lucide icons (`FlaskConical`, `ShieldAlert`, `HeartPulse`) and shortcut tooltips (`1`, `2`, `3`):
     - **Tab 1: Pharmacology**: Detailed MOA box, Therapeutic Category & Specific Subclass badges, Available Dosage Forms list.
     - **Tab 2: Regimens & Safety**: Dosing Regimens by Indication table/grid, Common Adverse Effects badges, Severe Toxicities callout, Absolute & Relative Contraindications list.
     - **Tab 3: Patient Care & Monitoring**: Major Interactions (red badge) & Common Interactions, Monitoring Labs grid (Baseline, Efficacy, Toxicity), and Patient Administration & Counseling bullet points.
3. Add keyboard listener for `1`, `2`, `3` keys to switch tabs when card is flipped.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/components/TopDrugClinicalCard.test.tsx`
Expected: PASS (all 4 tests pass).

- [ ] **Step 5: Commit**

```bash
git add src/components/TopDrugClinicalCard.tsx tests/components/TopDrugClinicalCard.test.tsx
git commit -m "feat(ui): add TopDrugClinicalCard component implementing Option A tabbed monograph layout"
```

---

### Task 5: Practice Lab View Deck Mode Switcher & Independent SM-2 Integration

**Files:**
- Modify: `src/views/PracticeLabView.tsx:1-550`
- Test: `tests/views/PracticeLabDeckModes.test.tsx`

**Interfaces:**
- Consumes: `<MultiSmilesCanvas>` from `src/components/MultiSmilesCanvas.tsx`, `<TopDrugClinicalCard>` from `src/components/TopDrugClinicalCard.tsx`, `getTopDrugClinicalMonograph` from `src/data/topDrugsClinicalData.ts`, `resolveTopDrugStructureRecord` from `src/utils/topDrugsTaxonomy.ts`
- Produces:
  - Top 200 deck mode switcher in Practice Lab (`'structure'` vs `'clinical'`)
  - Isolated SM-2 progress namespaces: `mcp_flashcard_progress_v1` (structures) vs `mcp_top200_clinical_progress_v1` (monographs)
  - In-deck clinical re-drill loop for struggled cards

- [ ] **Step 1: Write the failing tests in `tests/views/PracticeLabDeckModes.test.tsx`**

```typescript
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PracticeLabView } from '../../src/views/PracticeLabView.js';

// Mock dependencies to isolate PracticeLabView mode switching
vi.mock('../../src/components/SmilesCanvas.js', () => ({
  SmilesCanvas: () => <div data-testid="mock-canvas" />,
}));

describe('PracticeLabView Top 200 Deck Modes', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the deck mode switcher when Top 200 preset is active', () => {
    render(<PracticeLabView />);
    // Select Top 200 preset
    const presetSelect = screen.getByRole('combobox', { name: /Deck Preset|Preset/i });
    fireEvent.change(presetSelect, { target: { value: 'top-drugs-catalog' } });

    // Mode buttons should be visible
    expect(screen.getByRole('button', { name: /Chemical Structure Mode|Structure/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Clinical Monograph Mode|Clinical/i })).toBeDefined();
  });

  it('switches between Chemical Structure Mode and Clinical Monograph Mode and persists choice', () => {
    render(<PracticeLabView />);
    const presetSelect = screen.getByRole('combobox', { name: /Deck Preset|Preset/i });
    fireEvent.change(presetSelect, { target: { value: 'top-drugs-catalog' } });

    const clinicalModeBtn = screen.getByRole('button', { name: /Clinical Monograph Mode|Clinical/i });
    fireEvent.click(clinicalModeBtn);

    expect(localStorage.getItem('mcp_top200_active_mode')).toBe('clinical');
    expect(screen.getByText(/Flip for Monograph/i)).toBeDefined();
  });

  it('uses isolated SM-2 progress storage key for clinical monographs', () => {
    render(<PracticeLabView />);
    const presetSelect = screen.getByRole('combobox', { name: /Deck Preset|Preset/i });
    fireEvent.change(presetSelect, { target: { value: 'top-drugs-catalog' } });

    const clinicalModeBtn = screen.getByRole('button', { name: /Clinical Monograph Mode|Clinical/i });
    fireEvent.click(clinicalModeBtn);

    // Rate a card in clinical mode
    const flipBtn = screen.getByText(/Click or Space to flip/i);
    fireEvent.click(flipBtn);
    const goodBtn = screen.getByRole('button', { name: /Good/i });
    fireEvent.click(goodBtn);

    // Verify clinical storage key exists and structure key is untouched
    expect(localStorage.getItem('mcp_top200_clinical_progress_v1')).not.toBeNull();
    expect(localStorage.getItem('mcp_flashcard_progress_v1')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/views/PracticeLabDeckModes.test.tsx`
Expected: FAIL with missing mode switcher buttons or progress keys.

- [ ] **Step 3: Update `src/views/PracticeLabView.tsx`**

1. Add state `deckMode: 'structure' | 'clinical'` initialized from `localStorage.getItem('mcp_top200_active_mode') || 'structure'`.
2. When `deckPreset === 'top-drugs-catalog'`, render the segmented toggle in the header:
   - `🧪 Structure Mode`
   - `📋 Clinical Monograph Mode`
3. Dynamically switch the storage key used by `useSpacedRepetition`:
   - `mcp_flashcard_progress_v1` when in structure mode or curriculum preset.
   - `mcp_top200_clinical_progress_v1` when in Top 200 clinical mode.
4. When rendering flashcard in Top 200:
   - In structure mode: Render `<MultiSmilesCanvas structureRecord={structureRecord} isFront={!isFlipped} />`.
   - In clinical mode: Look up `getTopDrugClinicalMonograph(card.structure.genericName || card.structure.name)` and render `<TopDrugClinicalCard monograph={monograph} isFlipped={isFlipped} onFlip={handleFlip} />`.
5. On clinical session completion with struggled cards, offer *"Re-drill Struggled Clinical Cards"* within the deck instead of redirecting to the chemistry SAR test bank.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/views/PracticeLabDeckModes.test.tsx`
Expected: PASS (all 3 tests pass).

- [ ] **Step 5: Commit**

```bash
git add src/views/PracticeLabView.tsx tests/views/PracticeLabDeckModes.test.tsx
git commit -m "feat(practice-lab): integrate deck mode switcher and independent clinical monograph spaced repetition"
```

---

### Task 6: Full Workspace Verification, Typecheck, and Test Suite Gate

**Files:**
- Modify: None (Workspace verification across all modified files)
- Test: All tests

- [ ] **Step 1: Run TypeScript strict typecheck**

Run: `npm run typecheck`
Expected: Zero TypeScript compilation errors (`tsc --noEmit` exits with 0).

- [ ] **Step 2: Run ESLint**

Run: `npm run lint`
Expected: Zero ESLint errors.

- [ ] **Step 3: Run full Vitest test suite**

Run: `npm run test:run`
Expected: All tests pass across the entire workspace (including existing curriculum, medchem matrix, and new deck mode tests).

- [ ] **Step 4: Run production build**

Run: `npm run build`
Expected: Clean Vite production build without bundle or chunk errors.

- [ ] **Step 5: Commit any formatting or minor polish**

```bash
git add .
git commit -m "chore: verify clean typecheck, lint, and full test suite passes for top 200 structure remedy and clinical monographs"
```
