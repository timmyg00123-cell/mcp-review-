# 3D Lab WebGL Recovery & Interactive 2D Pocket Fallback Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate WebGL context leaks, soften pre-checks with in-app browser diagnostics, and provide an interactive 2D Pocket & SAR Fallback View in the 3D Macromolecular Lab so students without WebGL hardware acceleration can seamlessly study target binding pockets and ligand interactions.

**Architecture:** Update `molstarLoader.ts` to immediately dispose of probing WebGL contexts via `WEBGL_lose_context` and use permissive context attributes. Create a dedicated `TwoDPocketFallbackView.tsx` component rendering 2D chemical structure, interactive residue contact cards, and pharmacophore filters. Integrate the fallback and browser diagnostics directly into `ThreeDLabCanvas.tsx` with a dual-mode 2D/3D toggle.

**Tech Stack:** React 19, TypeScript, Lucide React, Tailwind CSS 4, Mol*, Vite, Node.js Test Runner (`node:test`).

**Spec:** `docs/superpowers/specs/2026-11-13-3d-lab-webgl-recovery-and-2d-fallback-design.md`

## Global Constraints

- Never leak WebGL contexts: always call `gl.getExtension('WEBGL_lose_context')?.loseContext()` on test canvases.
- Zero breaking changes to `ThreeDLabCanvasProps` callers (`cleanPdbId`, `targetName`, `geneSymbol`, etc.).
- The 2D Fallback View must be fully functional offline/locally using existing `KeyPocketResidueContact` and `medChemProfile` data.
- All code must pass `npm run lint` (`tsc --noEmit`) with 0 errors and `npm run build` without bundling issues.

## Review Focus

- Probing `canvas.getContext` multiple times in succession must not accumulate active WebGL contexts.
- When WebGL is unavailable, `ThreeDLabCanvas` must present actionable browser settings instructions and allow one-click transition to the 2D Pocket view.
- In 2D Pocket mode, clicking pharmacophore chips or pocket residue cards must correctly highlight corresponding interactions and show medicinal chemistry rationales.
- The user must be able to switch between 2D Pocket view and 3D Mol* view at any time.
- Standard curricular targets like Losartan/AT1R (`4Z9O`), Clopidogrel/P2Y12 (`4NTJ`), and Lisinopril/ACE (`1O86`) must render rich pocket residue interaction tags.

---

### Task 1: Resilient WebGL Probing & Context Disposal (`src/services/molstarLoader.ts`)

**Files:**
- Modify: `src/services/molstarLoader.ts:40-60`
- Test: `tests/molstarLoader.test.ts`

- [ ] **Step 1.1: Write failing test for context disposal**
  Update `tests/molstarLoader.test.ts` to assert that `isMolstarSupported()` calls `loseContext()` on the context mock to prevent context pool exhaustion.
- [ ] **Step 1.2: Run test to confirm failure**
  Run `node --import tsx tests/molstarLoader.test.ts` and verify it fails or asserts context loss.
- [ ] **Step 1.3: Implement context disposal in `molstarLoader.ts`**
  Update `isMolstarSupported()` and add `probeWebGLSupport()` in `src/services/molstarLoader.ts`:
  - Request context with `{ failIfMajorPerformanceCaveat: false, powerPreference: 'default' }`.
  - Immediately call `gl.getExtension('WEBGL_lose_context')?.loseContext()` on temporary test context.
- [ ] **Step 1.4: Run tests and verify clean pass**
  Run `node --import tsx tests/molstarLoader.test.ts` and verify it passes.
- [ ] **Step 1.5: Commit Task 1**
  `git commit -m "fix(3d-lab): dispose temporary probing WebGL contexts and add permissive detection"`

---

### Task 2: Interactive 2D Binding Pocket & SAR Fallback Component (`TwoDPocketFallbackView.tsx`)

**Files:**
- Create: `src/components/TwoDPocketFallbackView.tsx`
- Test: `tests/twoDPocketFallbackView.test.ts`

- [ ] **Step 2.1: Write unit test for 2D Pocket Fallback View**
  Create `tests/twoDPocketFallbackView.test.ts` asserting component exports, renders ligand 2D depiction, pocket residue contact list, interaction type badges (H-Bond, Ionic, Hydrophobic, Pi-Stacking), and pharmacophore filter buttons.
- [ ] **Step 2.2: Run test to confirm failure**
  Run `node --import tsx tests/twoDPocketFallbackView.test.ts` to verify failure.
- [ ] **Step 2.3: Implement `TwoDPocketFallbackView.tsx`**
  Build `src/components/TwoDPocketFallbackView.tsx`:
  - Accept `pdbId`, `targetName`, `geneSymbol`, `detectedLigand`, `medChemProfile`, `activePharmacophoreGroup`, `onSelectPharmacophoreGroup`, `onRetry3D`, and `onOpenTutorial`.
  - Display 2D structure card with PubChem 2D render and formula/MW badges.
  - Display Interactive Pocket Residue Grid:
    - Lists key pocket contact residues (e.g. Tyr35, Arg167, Trp84 for 4Z9O).
    - Color-coded interaction pills: Hydrogen bond (cyan), Ionic salt bridge (fuchsia), Hydrophobic (amber), $\pi$-$\pi$ stacking (emerald).
    - Displays contact atom details and distance metrics ($\le 3.2\text{ \AA}$).
  - Display SAR / Pharmacophore explanation drawer when a residue or chip is selected.
  - Header actions: "Try 3D View Again" and "Browser WebGL Setup Guide".
- [ ] **Step 2.4: Run tests and verify clean pass**
  Run `node --import tsx tests/twoDPocketFallbackView.test.ts` and verify all assertions pass.
- [ ] **Step 2.5: Commit Task 2**
  `git commit -m "feat(3d-lab): create interactive 2D pocket and SAR fallback view"`

---

### Task 3: Diagnostics & 2D Fallback Integration in `ThreeDLabCanvas.tsx`

**Files:**
- Modify: `src/components/ThreeDLabCanvas.tsx`
- Test: `tests/threeDLabFallback.test.ts`

- [ ] **Step 3.1: Write failing test for canvas fallback and diagnostics**
  Create `tests/threeDLabFallback.test.ts` verifying that `ThreeDLabCanvas`:
  - Contains recovery diagnostic instructions for `chrome://settings/system`.
  - Provides a button to toggle or switch to 2D Pocket Schematic mode.
  - Integrates `TwoDPocketFallbackView`.
- [ ] **Step 3.2: Run test to confirm failure**
  Run `node --import tsx tests/threeDLabFallback.test.ts` to verify failure.
- [ ] **Step 3.3: Implement diagnostics & fallback view integration**
  Update `src/components/ThreeDLabCanvas.tsx`:
  - Add state `is2DFallbackActive: boolean`.
  - When `loadError` occurs or WebGL is unsupported, display the enhanced diagnostic card:
    - Step 1: Open `chrome://settings/system` (or browser System settings).
    - Step 2: Toggle ON **"Use graphics acceleration when available"**.
    - Step 3: Relaunch browser.
    - Action buttons: **"Switch to 2D Pocket Schematic"** (activates 2D view immediately) and **"Retry 3D WebGL"**.
  - Add toolbar button to toggle between 3D Mol* and 2D Pocket views when desired.
  - Render `<TwoDPocketFallbackView />` when `is2DFallbackActive` is true.
- [ ] **Step 3.4: Run tests and verify pass**
  Run `node --import tsx tests/threeDLabFallback.test.ts` and `node --import tsx tests/threeDLabCorsAndFullscreen.test.ts`.
- [ ] **Step 3.5: Commit Task 3**
  `git commit -m "feat(3d-lab): integrate WebGL recovery diagnostics and 2D pocket switcher into ThreeDLabCanvas"`

---

### Task 4: Whole-Branch Integration, Build & Regression Sweep

**Files:**
- Test: All test suites (`tests/*.test.ts`)

- [ ] **Step 4.1: Run all test suites across the application**
  Run all unit tests to ensure no regressions.
- [ ] **Step 4.2: Run linter and typecheck**
  Run `npm run lint` (`tsc --noEmit`) and verify 0 errors.
- [ ] **Step 4.3: Run production build**
  Run `npm run build` (`vite build`) and verify clean output in `dist/`.
- [ ] **Step 4.4: Commit Task 4**
  `git commit -m "chore(3d-lab): verify WebGL recovery and 2D pocket fallback suite"`
