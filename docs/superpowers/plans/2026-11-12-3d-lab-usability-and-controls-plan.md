# 3D Lab Usability, Ligand-First Controls, Fullscreen Canvas & Tutorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the 3D Lab Library into a ligand-first, pedagogical 3D studio featuring direct one-click scene toggles (binding pocket, protein ribbon, hydrogen bonds), an expanded full-screen canvas with slide-out drawer tabs, and an interactive medicinal chemistry tutorial.

**Architecture:** Embed a programmatic WebGL molecular viewer (`3Dmol.js`) within a dedicated React canvas component, backed by a structure coordinate service with curated ligand codes and smart crystallization additive filtering. Wrap the viewer in an edge-to-edge container supporting single-click full-screen mode (`fixed inset-0 z-50`) with collapsible side drawers for Targets and ChEMBL SAR, and a 4-step pedagogical tutorial modal.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Lucide React, 3Dmol.js, Dexie.js (offline caching), RCSB PDB REST API, ChEMBL API.

**Spec:** `docs/superpowers/specs/2026-11-12-3d-lab-usability-and-controls-design.md`

## Global Constraints
- Client-side static Vercel deployment: No custom server-side 3D rendering processes.
- Zero cross-origin blockers: Direct WebGL scene manipulation via scriptable 3Dmol instance.
- Offline and timeout resilience: Fast fallback if coordinates or APIs fail; timeout protection on all fetches.
- Safe link security: All external linkouts must specify `rel="noopener noreferrer"` and `target="_blank"`.
- Accessibility: Dialogs must include `role="dialog"`, `aria-modal="true"`, and `Escape` key capture.

## Review Focus
1. **Apo protein / custom PDB without ligand:** The viewer must not show a blank black screen; it must fall back to showing the protein ribbon automatically.
2. **Membrane GPCRs with crystallographic lipids (e.g. cholesterol `CLR` in 4NTJ/2RH1):** The ligand filter must exclude crystallization additives and correctly target the small-molecule drug ligand.
3. **Full-screen mode trap:** Full-screen mode must be easily dismissible via both an obvious top-right close button and the `Escape` key.
4. **Rapid toggle switching:** Clicking between "Isolate Ligand", "Binding Pocket", and "Protein Ribbon" must apply synchronously without scene lag or memory leaks.
5. **Slow or failed PDB coordinate fetch:** If RCSB PDB download fails or times out, the UI must display a clear retry/fallback state with direct RCSB and CIF linkouts rather than freezing.

---

### Task 1: Curated Ligand Codes & Structure Coordinate Service

**Files:**
- Modify: `src/utils/canonicalTargets.ts`
- Create: `src/services/structure3dService.ts`
- Test: `tests/structure3dService.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface TargetPdbMapping {
    targetName: string;
    geneSymbol: string;
    pdbId: string;
    description: string;
    exampleDrugs: string[];
    chemblTargetId?: string;
    ligandCode?: string; // Curated 3-letter PDB HETATM code
  }
  export interface DetectedLigandInfo {
    resn: string;
    atomCount: number;
    description?: string;
  }
  export function fetchPdbCoordinates(pdbId: string, signal?: AbortSignal): Promise<string>;
  export function identifyLigandResidue(pdbData: string, preferredLigandCode?: string): DetectedLigandInfo | null;
  ```

- [ ] **Step 1: Write the failing test**

Create `tests/structure3dService.test.ts` testing coordinate fetching, ligand residue detection, exclusion of buffer ions/lipids (`CLR`, `SO4`, `PO4`, `HOH`), and apo protein fallback detection.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/structure3dService.test.ts`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement `src/utils/canonicalTargets.ts` and `src/services/structure3dService.ts`**

Add `ligandCode` to all 12 canonical targets in `CANONICAL_MEDCHEM_TARGETS`. Implement coordinate fetching with 8-second timeout and heuristic heteroatom filtering.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/structure3dService.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/canonicalTargets.ts src/services/structure3dService.ts tests/structure3dService.test.ts
git commit -m "feat(3d-lab): add curated ligand codes and 3D structure coordinate service"
```

---

### Task 2: Pedagogical Tutorial Modal Component

**Files:**
- Create: `src/components/ThreeDLabTutorialModal.tsx`
- Test: `tests/threeDLabTutorialModal.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface ThreeDLabTutorialModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  export const ThreeDLabTutorialModal: React.FC<ThreeDLabTutorialModalProps>;
  ```

- [ ] **Step 1: Write the failing test**

Create `tests/threeDLabTutorialModal.test.ts` verifying component export, 4 tutorial step navigation, keyboard accessibility (`Escape` key), and step content (camera navigation, ligand inspection, pocket interactions, ChEMBL SAR correlation).

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/threeDLabTutorialModal.test.ts`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement `src/components/ThreeDLabTutorialModal.tsx`**

Build the 4-step pedagogical guide with interactive step tabs, clear visual icons, pharmacophore interaction callouts (H-bonds, salt bridges, $\pi$-stacking), and $K_i/IC_{50}$ potency correlation explanations.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/threeDLabTutorialModal.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ThreeDLabTutorialModal.tsx tests/threeDLabTutorialModal.test.ts
git commit -m "feat(3d-lab): add pedagogical 3D lab tutorial modal"
```

---

### Task 3: 3D Canvas Engine & One-Click Scene Controls

**Files:**
- Create: `src/components/ThreeDLabCanvas.tsx`
- Test: `tests/threeDLabCanvas.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface ThreeDLabCanvasProps {
    pdbId: string;
    preferredLigandCode?: string;
    isFullscreen: boolean;
    onToggleFullscreen: () => void;
    onOpenTutorial: () => void;
  }
  export const ThreeDLabCanvas: React.FC<ThreeDLabCanvasProps>;
  ```

- [ ] **Step 1: Write the failing test**

Create `tests/threeDLabCanvas.test.ts` testing canvas initialization contracts, button state actions (`Isolate Ligand`, `Binding Pocket (5Å)`, `Toggle Protein Ribbon`, `Hydrogen Bonds`, `Recenter Camera`), and fullscreen callback triggers.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/threeDLabCanvas.test.ts`
Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement `src/components/ThreeDLabCanvas.tsx`**

Integrate `3Dmol.js` canvas container with ligand-first default view. Implement single-click header buttons that update scene representations synchronously without iframe reloads. Include high-contrast Full Screen button and tutorial button.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/threeDLabCanvas.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ThreeDLabCanvas.tsx tests/threeDLabCanvas.test.ts
git commit -m "feat(3d-lab): add 3Dmol canvas engine with one-click scene controls"
```

---

### Task 4: Fullscreen Workspace, Slide-Out Drawers & App Integration

**Files:**
- Modify: `src/components/ThreeDLabLibrary.tsx`
- Modify: `src/App.tsx`
- Test: `tests/threeDLabUsabilityIntegration.test.ts`

**Interfaces:**
- Integrates: `ThreeDLabCanvas`, `ThreeDLabTutorialModal`, `CANONICAL_MEDCHEM_TARGETS`, `fetchChemblBioactivity`

- [ ] **Step 1: Write the failing test**

Create `tests/threeDLabUsabilityIntegration.test.ts` verifying fullscreen state transitions, drawer slide-out toggling (Targets & ChEMBL SAR), and edge-to-edge layout styling.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/threeDLabUsabilityIntegration.test.ts`
Expected: FAIL with "Cannot find module" or missing properties

- [ ] **Step 3: Update `ThreeDLabLibrary.tsx` and `App.tsx`**

Unconstrain `'3d-lab'` tab in `App.tsx` to allow full browser width. In `ThreeDLabLibrary.tsx`, embed `ThreeDLabCanvas`, add collapsible sidebars in regular mode, and slide-out drawer tabs in full-screen mode (`fixed inset-0 z-50`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/threeDLabUsabilityIntegration.test.ts`
Expected: PASS

- [ ] **Step 5: Run full lint and regression tests**

Run: `npm run lint` and all test suites in `tests/`.

- [ ] **Step 6: Commit**

```bash
git add src/components/ThreeDLabLibrary.tsx src/App.tsx tests/threeDLabUsabilityIntegration.test.ts
git commit -m "feat(3d-lab): add edge-to-edge fullscreen layout with slide-out drawers"
```
