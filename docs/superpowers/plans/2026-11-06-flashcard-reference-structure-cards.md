# Flashcard Reference Structure Cards & Clinical Pharmacology Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Cumulative Study Hub's flashcard deck to display comparator-style high-contrast chemical structures with PubChem MolBlock coordinates and click-to-zoom on both faces, and replace the back face with an Option B two-column layout featuring full reference drug properties alongside curated clinical pharmacology (metabolism, BBB penetration, pregnancy safety).

**Architecture:** Create a standalone cardiovascular clinical pharmacology dictionary service with typed fallback resolvers, author a modular presentation component (`StructureFlashcardCardFace.tsx`) rendering the strictly blinded front and Option B two-column split back with zoom modal, and integrate cleanly into `StructureFlashcardDeck.tsx` while preserving all existing spaced repetition queue transitions and keyboard shortcuts.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Lucide React, RDKit MinimalLib WASM (`SmilesCanvas`), Vitest, Testing Library.

**Spec:** [`docs/superpowers/specs/2026-11-06-flashcard-reference-structure-cards-design.md`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/docs/superpowers/specs/2026-11-06-flashcard-reference-structure-cards-design.md)

## Global Constraints

- Never leak generic drug name, trade name, or pharmacologic class on the front face of the flashcard before flip.
- Use `bg-[var(--structure-canvas-bg)]` for the structure canvas container to ensure high-contrast vector clarity in both light and dark modes.
- Preserve PubChem MolBlock 2D coordinates and PubChem CID image fallbacks for all structures passed to `SmilesCanvas`.
- Retain exact Anki interval timings: Again (1m), Hard (4m), Good (10m), Easy (1d).
- Keep all existing 24 test suites passing (`npm run test:run`) and maintain clean production build (`npm run build`).

## Review Focus

- Uncataloged or custom chemical structures must resolve safe, informative fallback clinical profiles without throwing runtime exceptions or displaying literal `'undefined'`/`'N/A'`.
- Benchmark teratogenic cardiovascular agents (Warfarin, Lisinopril, Enalapril, Losartan, Valsartan, Sacubitril) must be flagged with `contraindicated` pregnancy risk and prominent teratogenicity warnings.
- Benchmark pregnancy-safe anticoagulants (Heparin, Enoxaparin/LMWH) must be flagged with `safe` pregnancy risk and placenta-sparing rationale.
- Keyboard shortcuts (`Space` to flip, `1`, `2`, `3`, `4` to grade) must remain active and functional after card face component integration.
- The click-to-zoom modal must render high-resolution vector structures on both front and back faces without triggering accidental card flips or grade selections.

---

### Task 1: Clinical Pharmacology Dictionary & Resolvers

**Files:**
- Create: `src/utils/clinicalPharmacologyDictionary.ts`
- Test: `tests/clinicalPharmacologyDictionary.test.ts`

**Interfaces:**
- Consumes: `ChemicalStructure` from `src/types/reviewModule.ts`
- Produces:
  ```typescript
  export interface ClinicalPharmacologyProfile {
    metabolism: string;
    metabolismLocation?: string;
    bbbCrossing: string;
    bbbCnsEffects?: string;
    pregnancyRisk: 'safe' | 'caution' | 'contraindicated';
    pregnancyCategory?: string;
    pregnancySummary: string;
    clinicalPearls?: string;
  }

  export function resolveClinicalPharmacology(
    structure: Partial<ChemicalStructure> | null | undefined
  ): ClinicalPharmacologyProfile;
  ```

- [x] **Step 1: Write failing unit test for `clinicalPharmacologyDictionary`**

```typescript
// tests/clinicalPharmacologyDictionary.test.ts
import { describe, it, expect } from 'vitest';
import { resolveClinicalPharmacology } from '../src/utils/clinicalPharmacologyDictionary';
import type { ChemicalStructure } from '../src/types/reviewModule';

describe('clinicalPharmacologyDictionary', () => {
  it('resolves curated profile for Clopidogrel with CYP2C19 bioactivation', () => {
    const struct: Partial<ChemicalStructure> = { name: 'Clopidogrel', tradeName: 'Plavix' };
    const profile = resolveClinicalPharmacology(struct);
    expect(profile.metabolism).toContain('CYP2C19');
    expect(profile.bbbCrossing).toBeDefined();
    expect(profile.pregnancyRisk).toBe('caution');
  });

  it('correctly classifies Warfarin as contraindicated in pregnancy (Category X teratogen)', () => {
    const struct: Partial<ChemicalStructure> = { name: 'Warfarin', tradeName: 'Coumadin' };
    const profile = resolveClinicalPharmacology(struct);
    expect(profile.pregnancyRisk).toBe('contraindicated');
    expect(profile.pregnancySummary).toMatch(/fetal warfarin syndrome|teratogen/i);
  });

  it('correctly classifies Heparin / LMWH as safe in pregnancy', () => {
    const struct: Partial<ChemicalStructure> = { name: 'Enoxaparin', tradeName: 'Lovenox' };
    const profile = resolveClinicalPharmacology(struct);
    expect(profile.pregnancyRisk).toBe('safe');
    expect(profile.pregnancySummary).toMatch(/does not cross placenta|anticoagulant of choice/i);
  });

  it('gracefully falls back for unknown custom structures', () => {
    const struct: Partial<ChemicalStructure> = { name: 'Custom Drug X' };
    const profile = resolveClinicalPharmacology(struct);
    expect(profile.metabolism).toBeDefined();
    expect(profile.pregnancyRisk).toBeDefined();
    expect(profile.bbbCrossing).toBeDefined();
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/clinicalPharmacologyDictionary.test.ts`  
Expected: FAIL with "Cannot find module '../src/utils/clinicalPharmacologyDictionary'"

- [x] **Step 3: Implement `clinicalPharmacologyDictionary.ts`**

Implement `src/utils/clinicalPharmacologyDictionary.ts` with comprehensive entries for all 48 harvested lecture cardiovascular drugs across the four modules:
1. **Antiplatelets**: Aspirin, Clopidogrel, Prasugrel, Ticagrelor, Cangrelor, Tirofiban, Eptifibatide, Vorapaxar, Cilostazol, Dipyridamole.
2. **Anticoagulants**: Warfarin, Dabigatran, Rivaroxaban, Apixaban, Edoxaban, Betrixaban, Unfractionated Heparin, Enoxaparin, Fondaparinux, Bivalirudin, Argatroban.
3. **Heart Failure**: Lisinopril, Enalapril/Enalaprilat, Captopril, Ramipril, Losartan, Valsartan, Sacubitril/Valsartan (Entresto), Spironolactone, Eplerenone, Metoprolol (Succinate/Tartrate), Carvedilol, Bisoprolol, Digoxin, Ivabradine, Furosemide, Torsemide, Bumetanide, Hydralazine, Isosorbide Dinitrate, Dapagliflozin, Empagliflozin, Vericiguat.
4. **Antiarrhythmics**: Quinidine, Procainamide, Disopyramide, Lidocaine, Mexiletine, Flecainide, Propafenone, Propranolol, Esmolol, Amiodarone, Dronedarone, Sotalol, Dofetilide, Ibutilide, Verapamil, Diltiazem, Adenosine.

Provide `resolveClinicalPharmacology(structure)` with normalized name lookup (stripping brackets, normalizing whitespace, checking aliases and trade names) and safe fallback synthesis.

- [x] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/clinicalPharmacologyDictionary.test.ts`  
Expected: PASS

- [x] **Step 5: Commit**

```bash
git add src/utils/clinicalPharmacologyDictionary.ts tests/clinicalPharmacologyDictionary.test.ts
git commit -m "feat(dict): author cardiovascular clinical pharmacology dictionary and resolvers"
```

---

### Task 2: Structure Flashcard Card Face Presentation Component

**Files:**
- Create: `src/components/StructureFlashcardCardFace.tsx`
- Test: `tests/StructureFlashcardCardFace.test.tsx`

**Interfaces:**
- Consumes:
  - `ChemicalStructure` from `src/types/reviewModule.ts`
  - `resolveClinicalPharmacology` from `src/utils/clinicalPharmacologyDictionary.ts`
  - `SmilesCanvas` from `src/components/SmilesCanvas.tsx`
- Produces:
  ```typescript
  export interface StructureFlashcardCardFaceProps {
    structure: ChemicalStructure;
    drugName?: string;
    isFlipped: boolean;
    isSuspended?: boolean;
    onToggleSuspend?: () => void;
    onFlip: () => void;
    children?: React.ReactNode; // Rating buttons slot on back face
  }

  export const StructureFlashcardCardFace: React.FC<StructureFlashcardCardFaceProps>;
  ```

- [x] **Step 1: Write failing component tests for `StructureFlashcardCardFace`**

```typescript
// tests/StructureFlashcardCardFace.test.tsx
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StructureFlashcardCardFace } from '../src/components/StructureFlashcardCardFace';
import type { ChemicalStructure } from '../src/types/reviewModule';

const sampleDrug: ChemicalStructure = {
  id: 'struct_clopidogrel',
  name: 'Clopidogrel',
  tradeName: 'Plavix',
  chemicalClass: 'Thienopyridine',
  pharmacologicalClass: 'P2Y12 platelet inhibitor',
  canonical_smiles: 'CCOC(=O)[C@H](C1=CC=CC=C1Cl)N2CCC3=C(C2)C=CS3',
  pubchemMolBlock: 'Mock MolBlock Content',
  target: 'P2Y12 ADP Receptor',
  reversibility: 'Irreversible',
  drug_state: 'Prodrug',
  mw: 321.8,
  logP: 3.1,
  route: 'Oral',
  keyFunctionalGroups: ['Thienopyridine core', 'Methyl ester'],
  sarNotes: 'Bioactivated via CYP2C19 oxidation of thienopyridine ring to active thiol.',
};

describe('StructureFlashcardCardFace', () => {
  it('strictly blinds drug name and class on front face', () => {
    const onFlip = vi.fn();
    render(
      <StructureFlashcardCardFace
        structure={sampleDrug}
        isFlipped={false}
        onFlip={onFlip}
      />
    );

    expect(screen.queryByText('Clopidogrel')).toBeNull();
    expect(screen.queryByText('Plavix')).toBeNull();
    expect(screen.queryByText('P2Y12 platelet inhibitor')).toBeNull();
    expect(screen.getByText(/Identify the Pharmacologic Class/i)).toBeDefined();

    const flipBtn = screen.getByRole('button', { name: /Show Answer/i });
    fireEvent.click(flipBtn);
    expect(onFlip).toHaveBeenCalled();
  });

  it('renders Option B two-column layout with metabolism, BBB, and pregnancy data on back face', () => {
    render(
      <StructureFlashcardCardFace
        structure={sampleDrug}
        isFlipped={true}
        onFlip={vi.fn()}
      >
        <div data-testid="anki-rating-bar">Rating Buttons</div>
      </StructureFlashcardCardFace>
    );

    expect(screen.getByText('Clopidogrel')).toBeDefined();
    expect(screen.getByText('P2Y12 platelet inhibitor')).toBeDefined();
    expect(screen.getByText(/Metabolism & Bioactivation/i)).toBeDefined();
    expect(screen.getByText(/BBB Penetration/i)).toBeDefined();
    expect(screen.getByText(/Pregnancy Profile/i)).toBeDefined();
    expect(screen.getByTestId('anki-rating-bar')).toBeDefined();
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/StructureFlashcardCardFace.test.tsx`  
Expected: FAIL with "Cannot find module '../src/components/StructureFlashcardCardFace'"

- [x] **Step 3: Implement `StructureFlashcardCardFace.tsx`**

Implement `src/components/StructureFlashcardCardFace.tsx`:
1. Use `bg-[var(--structure-canvas-bg)]` for the structure canvas container with border and hover zoom cue.
2. Render `SmilesCanvas` with `canonicalSmiles`, `pubchemMolBlock`, fallback `pngUrl`, and `cid`.
3. Provide built-in `isZoomModalOpen` state with click-to-zoom modal rendering the high-resolution molecule in an accessible portal/dialog with close button.
4. On Front Face: Render prompt banner ("Identify the Pharmacologic Class & Key Moieties"), canvas with zoom button, and primary "Show Answer / Flip Card (Space)" action button. Strictly blind drug name, trade name, and pharmacologic class.
5. On Back Face: Render Option B responsive two-column grid (`grid grid-cols-1 lg:grid-cols-2 gap-5`):
   - Left Column: Drug name, trade name, pharmacologic class banner, scaffold pill, suspend toggle, canvas with zoom button, pharmacophore badges with `PHARMACOPHORE_COLOR_PALETTE`, and 2x2/2x3 property grid (MW, xLogP, drug state, target receptor with reversibility, route).
   - Right Column: Clinical pharmacology callouts using `resolveClinicalPharmacology(structure)`:
     - Metabolism & Bioactivation card
     - Blood-Brain Barrier (BBB) Penetration card
     - Pregnancy Safety & Teratogenicity card with color-coded risk badge (safe: emerald, caution: amber, contraindicated: rose)
     - Structure-Activity Relationship (SAR) notes card
   - Bottom Slot: Render `children` (Anki rating buttons).

- [x] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/StructureFlashcardCardFace.test.tsx`  
Expected: PASS

- [x] **Step 5: Commit**

```bash
git add src/components/StructureFlashcardCardFace.tsx tests/StructureFlashcardCardFace.test.tsx
git commit -m "feat(ui): implement two-column structure flashcard card face component with zoom modal"
```

---

### Task 3: Flashcard Deck Integration & End-to-End Verification

**Files:**
- Modify: `src/components/StructureFlashcardDeck.tsx`
- Test: `tests/StructureFlashcardDeck.test.tsx`

**Interfaces:**
- Consumes: `StructureFlashcardCardFace` from `src/components/StructureFlashcardCardFace.tsx`
- Produces: Updated `StructureFlashcardDeck` component rendering upgraded front and Option B back faces.

- [x] **Step 1: Write integration regression test in `tests/StructureFlashcardDeck.test.tsx`**

```typescript
// tests/StructureFlashcardDeck.test.tsx
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StructureFlashcardDeck } from '../src/components/StructureFlashcardDeck';
import type { FlashcardItem } from '../src/types/cumulativeStudy';

const mockDeck: FlashcardItem[] = [
  {
    structureId: 'struct_warfarin',
    drugName: 'Warfarin',
    moduleIds: ['anticoagulants_mcp2'],
    repetitionIntervalMinutes: 10,
    easeFactor: 2.5,
    struggleCount: 0,
    totalReviews: 1,
    isSuspended: false,
    structure: {
      id: 'struct_warfarin',
      name: 'Warfarin',
      tradeName: 'Coumadin',
      chemicalClass: '4-Hydroxycoumarin',
      pharmacologicalClass: 'Vitamin K Antagonist',
      canonical_smiles: 'CC(=O)CC(C1=CC=CC=C1)C2=C(O)C3=CC=CC=C3OC2=O',
      target: 'VKORC1',
      reversibility: 'Reversible',
      drug_state: 'Active Drug',
      mw: 308.3,
      logP: 2.7,
      route: 'Oral',
      keyFunctionalGroups: ['4-Hydroxycoumarin lactone', 'Chiral center'],
      sarNotes: '4-OH coumarin lactone mimics reduced vitamin K hydroquinone.',
    },
  },
];

describe('StructureFlashcardDeck Integration', () => {
  it('renders upgraded card face and toggles flip on Show Answer', () => {
    render(<StructureFlashcardDeck initialDeck={mockDeck} onSessionComplete={vi.fn()} />);

    // Initially front face is blinded
    expect(screen.queryByText('Warfarin')).toBeNull();
    expect(screen.getByText(/Identify the Pharmacologic Class/i)).toBeDefined();

    // Click Show Answer
    const flipButton = screen.getByRole('button', { name: /Show Answer/i });
    fireEvent.click(flipButton);

    // Answer face is visible with Option B clinical cards
    expect(screen.getByText('Warfarin')).toBeDefined();
    expect(screen.getByText(/Pregnancy Profile/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Again/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Good/i })).toBeDefined();
  });
});
```

- [x] **Step 2: Run test to verify it fails or needs updates**

Run: `npx vitest run tests/StructureFlashcardDeck.test.tsx`  
Expected: May fail or pass depending on existing imports; verify regression boundary.

- [x] **Step 3: Update `StructureFlashcardDeck.tsx` to use `StructureFlashcardCardFace`**

Replace the inline canvas blocks in `StructureFlashcardDeck.tsx` with `<StructureFlashcardCardFace>`:
1. Pass `structure={structure}`, `drugName={currentCard.drugName}`, `isFlipped={isFlipped}`, `isSuspended={Boolean(currentCard.isSuspended)}`, `onToggleSuspend={handleToggleSuspend}`, `onFlip={() => setIsFlipped(true)}`.
2. Nest the 4-interval rating buttons (`Again [1]`, `Hard [2]`, `Good [3]`, `Easy [4]`) inside as children to slot cleanly into the bottom action bar when flipped.
3. Preserve all existing state, module filter toggles, keyboard shortcut event listeners, and early finish handlers.

- [x] **Step 4: Run full test suite and verify all tests pass**

Run: `npm run test:run`  
Expected: All 25+ test suites PASS cleanly.

- [x] **Step 5: Verify production build succeeds**

Run: `npm run build`  
Expected: Vite build succeeds with clean output in `dist/`.

- [x] **Step 6: Commit**

```bash
git add src/components/StructureFlashcardDeck.tsx tests/StructureFlashcardDeck.test.tsx
git commit -m "feat(hub): integrate reference card face and clinical pharmacology into flashcard deck"
```
