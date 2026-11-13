# 3D Lab Atom Labels, Scroll Sensitivity, Ribbon Fix & Pharmacophore PK/PD Drawer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance the 3D Molecular Lab with reliable protein ribbon rendering, dampened mouse-wheel zooming with on-canvas zoom buttons, toggleable atom name labels, and an interactive Pharmacophore Chips Toolbar with a slide-out Dual Pharmacokinetics (PK) & Clinical Effect (PD) Drawer and pocket residue inspector.

**Architecture:** 
1. **Data Layer (`canonicalPharmacophorePkData.ts` & `structure3d.ts`):** Curates structured ADME/PK profiles, clinical PD effects, and key amino acid pocket contacts for canonical targets indexed by gene symbol and PDB ID.
2. **3D Canvas Engine (`ThreeDLabCanvas.tsx`):** Fixes 3Dmol protein ribbon rendering via `{ hetflag: false }`, intercepts the container's `wheel` event to dampen scroll zoom sensitivity by ~60%, provides explicit `+` / `−` zoom buttons, implements `addPropertyLabels("atom")` for ligand atom names, and renders a floating pharmacophore chips bar with accent atom highlighting.
3. **Dual PK & Clinical Effect Drawer (`PharmacophorePkDrawer.tsx`):** A slide-out drawer providing tabbed PK pathways (absorption, CYP enzymes, esterase shunting, prodrug bioactivation) and Clinical PD effects (target pocket affinity, physiological outcomes, safety warnings), plus pocket contact residue annotations.
4. **App & Library Integration (`ThreeDLabLibrary.tsx`):** Coordinates right-edge drawers (mutually exclusive Pharmacophore PK Drawer and ChEMBL SAR panel) in both edge-to-edge desktop mode and fullscreen mode.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, 3Dmol.js (WebGL), Lucide React, Vite, TSX test runner.

**Spec:** [`docs/superpowers/specs/2026-11-13-3d-lab-pharmacophore-pk-and-controls-design.md`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/docs/superpowers/specs/2026-11-13-3d-lab-pharmacophore-pk-and-controls-design.md)

## Global Constraints
- React 19 and Tailwind CSS v4 compatibility.
- Client-side static Vercel compatibility; zero backend/proxy dependencies.
- Zero external network calls for pharmacophore PK/PD data (all data is instant, offline, and curated).
- 3Dmol.js canvas selector for standard protein secondary structure must use `{ hetflag: false }`.
- External links must specify `target="_blank"` and `rel="noopener noreferrer"`.
- Modals/drawers must include proper ARIA landmarks and `Escape` key capture.

## Review Focus
1. **Uncurated or Custom PDB Fallback:** When a user enters a custom PDB or loads an apo structure without curated pharmacophore data, the UI must gracefully hide the chips toolbar and drawer without runtime errors.
2. **3Dmol Atom Selection Misses:** If atom names in a curated profile don't match specific PDB HETATM names, 3Dmol must gracefully fall back to full ligand accent glow rather than failing or unrendering the scene.
3. **Right Drawer Layout Collision:** In fullscreen and desktop modes, opening the Pharmacophore PK Drawer must smoothly slide back or close the ChEMBL SAR drawer to prevent layout squash or overlapping drawer backdrops.
4. **Container Wheel Event Leaks:** Wheel event listener on the canvas container must have `{ passive: false, capture: true }` and `e.stopPropagation()` so page scroll is prevented and unmount cleans up the listener cleanly.
5. **Apo Structure Ribbon Toggle:** Apo structures must default protein ribbon to visible and allow toggling it on/off cleanly with `{ hetflag: false }`.

---

### Task 1: Pharmacophore PK/PD & Key Pocket Residue Data Models

**Files:**
- Create: `src/types/structure3d.ts`
- Create: `src/data/canonicalPharmacophorePkData.ts`
- Test: `tests/canonicalPharmacophorePkData.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface PharmacophorePkPdGroup {
    id: string;
    name: string;
    chemicalFormula?: string;
    atomNames: string[];
    colorAccent?: string;
    pharmacokinetics: {
      absorption: string;
      metabolism: string;
      prodrugRole?: string;
      halfLifeAndClearance: string;
    };
    clinicalPharmacodynamics: {
      targetBindingRole: string;
      physiologicEffect: string;
      adverseEffectRisks: string;
    };
  }

  export interface KeyPocketResidueContact {
    resi: number;
    resn: string;
    chain?: string;
    label: string;
    interactionType: 'covalent' | 'ionic' | 'hydrogen-bond' | 'pi-stacking' | 'coordination' | 'hydrophobic';
    clinicalImpact: string;
  }

  export interface TargetMedChemProfile {
    targetGeneSymbol: string;
    pdbId: string;
    drugName: string;
    ligandCode: string;
    pharmacophoreGroups: PharmacophorePkPdGroup[];
    keyPocketResidues: KeyPocketResidueContact[];
  }

  export function findMedChemProfile(geneSymbolOrPdbId: string): TargetMedChemProfile | undefined;
  ```

- [ ] **Step 1: Write the failing test**

Create `tests/canonicalPharmacophorePkData.test.ts` testing:
1. Retrieval of profiles by `geneSymbol` (`P2RY12`, `ACE`, `AGTR1`, `HMGCR`, `ADRB1`, `PTGS2`, `DHFR`, `EGFR`).
2. Retrieval of profiles by `pdbId` (`4NTJ`, `1O86`, `4Z9O`, `1HWK`, `7JJO`, `3LN1`, `1U72`, `1M17`).
3. Verification that every profile has $\ge 2$ pharmacophore groups with non-empty `pharmacokinetics` and `clinicalPharmacodynamics` fields.
4. Verification that every profile has $\ge 1$ key pocket residue contact with a valid interaction type and clinical impact statement.
5. Graceful `undefined` return for unknown PDB or target query.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/canonicalPharmacophorePkData.test.ts`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement data models and dictionary**

1. Define interfaces in `src/types/structure3d.ts`.
2. Implement curated profiles and `findMedChemProfile` helper in `src/data/canonicalPharmacophorePkData.ts` covering curricular targets:
   - `P2RY12` / `4NTJ` (AZD / Clopidogrel comparison: Chlorophenyl, pyrimidine ester, thiol covalent bioactivation).
   - `ACE` / `1O86` (1N4 / Enalaprilat: Zinc carboxylate, phenethyl, proline ring, Glu384/Zn²⁺ contacts).
   - `AGTR1` / `4Z9O` (4Z9 / Losartan active EXP3174: Biphenyl tetrazole, imidazole core, Arg167 contact).
   - `HMGCR` / `1HWK` (1HW / Atorvastatin: Dihydroxyheptanoate transition state mimic, fluorophenyl, Lys735/Arg590 contacts).
   - `ADRB1` / `7JJO` (NEN / Metoprolol: Ethanolamine basic amine, methoxyethyl ether, Asp121 salt bridge).
   - `PTGS2` / `3LN1` (CEL / Celecoxib: Sulfonamide COX-2 specific pocket warhead, pyrazole core, Arg513/Val523 contacts).
   - `DHFR` / `1U72` (MTX / Methotrexate: Pteridine ring, glutamate tail, Asp27/Arg70 contacts).
   - `EGFR` / `1M17` (AQ4 / Erlotinib & Osimertinib: Quinazoline core, acrylamide warhead, Cys797 covalent contact).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/canonicalPharmacophorePkData.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/types/structure3d.ts src/data/canonicalPharmacophorePkData.ts tests/canonicalPharmacophorePkData.test.ts
git commit -m "feat(3d-lab): add structured pharmacophore PK/PD and pocket residue profiles"
```

---

### Task 2: 3D Canvas Scene Fixes & Controls Engine

**Files:**
- Modify: `src/components/ThreeDLabCanvas.tsx`
- Test: `tests/threeDLabCanvasControls.test.ts`

**Interfaces:**
- Consumes:
  - `findMedChemProfile`, `PharmacophorePkPdGroup`, `KeyPocketResidueContact` from Task 1.
- Produces:
  - Enhanced `ThreeDLabCanvasProps`:
    ```ts
    export interface ThreeDLabCanvasProps {
      pdbId: string;
      preferredLigandCode?: string;
      isFullscreen: boolean;
      onToggleFullscreen: () => void;
      onOpenTutorial: () => void;
      targetName?: string;
      geneSymbol?: string;
      activePharmacophoreGroup?: PharmacophorePkPdGroup | null;
      onSelectPharmacophoreGroup?: (group: PharmacophorePkPdGroup | null) => void;
      onSelectPocketResidue?: (residue: KeyPocketResidueContact | null) => void;
      isPkDrawerOpen?: boolean;
      onTogglePkDrawer?: () => void;
    }
    ```

- [ ] **Step 1: Write the failing test**

Create `tests/threeDLabCanvasControls.test.ts` testing:
1. Source verification that 3Dmol ribbon selector uses `{ hetflag: false }` instead of `{ protein: true }`.
2. Container wheel listener attaches with `{ passive: false, capture: true }` and dampens zoom.
3. Zoom `+` / `−` button presence and callback triggers.
4. "Atom Labels" toggle button presence and `addPropertyLabels` execution contract.
5. Pharmacophore Chips Toolbar renders active chips when a profile is found, and highlights corresponding atoms upon click.
6. Clean cleanup of event listeners and timeouts on unmount.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/threeDLabCanvasControls.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement 3D Canvas enhancements in `src/components/ThreeDLabCanvas.tsx`**

1. **Protein Ribbon Selector:** Replace all occurrences of `{ protein: true }` with `{ hetflag: false }` for cartoon rendering and clearing.
2. **Scroll Sensitivity Dampening:** Attach capture wheel listener on `containerRef.current` scaling zoom by `1.0 - Math.sign(e.deltaY) * 0.04`, calling `preventDefault()` and `stopPropagation()`.
3. **On-Canvas Zoom Buttons:** Add floating `+` and `−` buttons in bottom-right corner invoking `viewer.zoom(1.15)` and `viewer.zoom(0.85)`.
4. **Atom Labels Toggle:** Add `"Atom Labels"` button with `Tag` icon in header; when active, calls `viewer.addPropertyLabels("atom", { resn: ligand.resn }, ...)`. Also update `viewer.setClickable` to display atom name pill on click.
5. **Pharmacophore Highlighting & Chips Toolbar:** Render floating chips bar above navigation tips bar. When a chip is active, highlight matching `atomNames` in vibrant magenta sticks/spheres `{ stick: { colorscheme: 'magentaCarbon', radius: 0.35 } }` (or fallback to full ligand pulse if atom names not found) and zoom to those atoms.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/threeDLabCanvasControls.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ThreeDLabCanvas.tsx tests/threeDLabCanvasControls.test.ts
git commit -m "feat(3d-lab): fix protein ribbon selector, dampen scroll zoom and add atom labels"
```

---

### Task 3: Dual PK & Clinical Effect Drawer Component

**Files:**
- Create: `src/components/PharmacophorePkDrawer.tsx`
- Test: `tests/pharmacophorePkDrawer.test.ts`

**Interfaces:**
- Consumes:
  - `PharmacophorePkPdGroup`, `KeyPocketResidueContact`, `TargetMedChemProfile` from `src/types/structure3d.ts`.
- Produces:
  ```ts
  export interface PharmacophorePkDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    activeGroup: PharmacophorePkPdGroup | null;
    profile: TargetMedChemProfile | null;
    selectedPocketResidue: KeyPocketResidueContact | null;
    onSelectGroup: (group: PharmacophorePkPdGroup) => void;
    onSelectPocketResidue: (residue: KeyPocketResidueContact | null) => void;
  }
  export const PharmacophorePkDrawer: React.FC<PharmacophorePkDrawerProps>;
  ```

- [ ] **Step 1: Write the failing test**

Create `tests/pharmacophorePkDrawer.test.ts` testing:
1. Component exports and prop contracts.
2. Renders group title, chemical formula badge, and active target context.
3. Tab switching between "Pharmacokinetics (PK)" and "Clinical Effect (PD)".
4. PK tab displays Absorption, CYP metabolism, prodrug bioactivation, and half-life fields.
5. PD tab displays target binding role, physiological effects, and adverse effect warnings.
6. Pocket Contact section displays residue details, interaction type badge, and clinical consequence.
7. Keyboard `Escape` and close button trigger `onClose`.
8. Accessible landmarks (`role="region"`, `aria-label`).

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/pharmacophorePkDrawer.test.ts`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement `src/components/PharmacophorePkDrawer.tsx`**

1. Create slide-out drawer container with smooth Tailwind CSS slide transitions (`translate-x-0` vs `translate-x-full`).
2. Header with group title, formula pill, close button (`X`), and target name.
3. Tab selector:
   - **Tab 1: Pharmacokinetics (PK)**: Cards for Oral Absorption (LogP), Metabolic Fate (CYP isoforms / esterases), Prodrug Bioactivation pathway, Elimination & Half-life.
   - **Tab 2: Clinical Effect (PD)**: Cards for Receptor Pocket Binding Role, Downstream Physiologic Effect on the Body, Clinical Safety & Adverse Effect Warnings.
4. Bottom section: **Key Pocket Contacts Inspector**:
   - Chips for available key residues (`Asp113`, `Cys175`, etc.).
   - Card showing selected residue name, interaction type badge (ionic salt bridge, covalent disulfide, H-bond), and clinical impact statement.
5. Window keydown listener for `Escape` key with proper unmount cleanup.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/pharmacophorePkDrawer.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/PharmacophorePkDrawer.tsx tests/pharmacophorePkDrawer.test.ts
git commit -m "feat(3d-lab): add dual pharmacokinetics and clinical effect drawer component"
```

---

### Task 4: Library Integration & Fullscreen / Drawer Coordination

**Files:**
- Modify: `src/components/ThreeDLabLibrary.tsx`
- Test: `tests/threeDLabPharmacophoreIntegration.test.ts`

**Interfaces:**
- Consumes:
  - `findMedChemProfile` from `src/data/canonicalPharmacophorePkData.ts`
  - `ThreeDLabCanvas` from `src/components/ThreeDLabCanvas.tsx`
  - `PharmacophorePkDrawer` from `src/components/PharmacophorePkDrawer.tsx`

- [ ] **Step 1: Write the failing test**

Create `tests/threeDLabPharmacophoreIntegration.test.ts` testing:
1. `ThreeDLabLibrary` coordinates mutually exclusive right-side panels: opening Pharmacophore PK Drawer closes ChEMBL SAR (and vice versa).
2. Fullscreen mode renders right-edge floating trigger tabs for both "Pharmacophore PK" and "ChEMBL SAR".
3. Target selection updates the active medchem profile and resets active pharmacophore selection.
4. Clicking a pharmacophore chip or atom opens the PK drawer and highlights 3D atoms.
5. Fullscreen Escape key handling closes open drawer first before exiting fullscreen.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/threeDLabPharmacophoreIntegration.test.ts`
Expected: FAIL

- [ ] **Step 3: Integrate PK Drawer and Right Panel Coordination in `ThreeDLabLibrary.tsx`**

1. Add state:
   - `activeRightPanel: 'none' | 'chembl' | 'pharmacophore'` (replaces isolated `isRightDrawerOpen`).
   - `activePharmacophoreGroup: PharmacophorePkPdGroup | null`.
   - `selectedPocketResidue: KeyPocketResidueContact | null`.
2. Look up medchem profile via `findMedChemProfile(currentTarget?.geneSymbol || activePdbId)`.
3. Wire callbacks into `ThreeDLabCanvas`:
   - `activePharmacophoreGroup`, `onSelectPharmacophoreGroup`.
   - `onSelectPocketResidue`.
   - `isPkDrawerOpen: activeRightPanel === 'pharmacophore'`.
   - `onTogglePkDrawer`: toggles between `'pharmacophore'` and `'none'`.
4. Render `PharmacophorePkDrawer`:
   - In fullscreen: Slides out over right edge with backdrop.
   - In regular mode: Slides out over right side or occupies right panel without squishing 3D canvas.
5. In fullscreen mode, add right-edge tab trigger for "Pharmacophore PK" alongside "ChEMBL SAR".

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/threeDLabPharmacophoreIntegration.test.ts`
Expected: PASS

- [ ] **Step 5: Run full lint and regression tests**

Run:
```bash
npx tsc --noEmit
npm run build
Get-ChildItem -Path tests -Filter "*.test.ts" | ForEach-Object { npx tsx $_.FullName }
```
Expected: All tests pass, build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/components/ThreeDLabLibrary.tsx tests/threeDLabPharmacophoreIntegration.test.ts
git commit -m "feat(3d-lab): integrate pharmacophore PK drawer and coordinate right drawers"
```

---

## Plan Review & Handoff Checklist
- [x] All 4 tasks have clear file paths and explicit step-by-step instructions.
- [x] Spec coverage verified (protein ribbon `{ hetflag: false }`, scroll dampening, zoom buttons, atom labels, pharmacophore tags, dual PK/PD drawer, pocket residues).
- [x] All interfaces, types, and method signatures match across tasks.
- [x] Review Focus section covers all 5 subtle failure modes with explicit test cases.
