# 3D Molecular Lab: Mol* (MolStar) Engine Migration & Translucent Pocket Cavity Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the 3D Molecular Lab by migrating from 3Dmol to Mol* (MolStar), eliminating WebGL canvas sprite allocations and buffering loops, adding binary mmCIF (`.bcif`) streaming, rendering classic 5Å pocket sticks, and introducing a one-click toggle for a translucent receptor pocket cavity surface.

**Architecture:** Mol* WebGL viewer embedded in `ThreeDLabCanvas.tsx`, streaming binary mmCIF with Dexie/memory caching, GPU-instanced text glyph labels for zero-lag atom labeling without CPU math during camera drag/zoom, classic pocket sticks, translucent molecular cavity surface, and seamless coordination with the existing Pharmacophore PK/PD Drawer.

**Tech Stack:** React 19, TypeScript, Mol* / PDBeMolstar, Binary mmCIF (`.bcif`), Tailwind CSS, Lucide React, Node test runner (`tsx`).

**Spec:** [docs/superpowers/specs/2026-11-13-3d-lab-molstar-migration-design.md](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/docs/superpowers/specs/2026-11-13-3d-lab-molstar-migration-design.md)

## Global Constraints

- Must completely avoid CPU-bound 2D screen coordinate projection loops during camera drag/zoom events.
- Must support both classic pocket stick view (residues within 5.0 Å) and an on-demand translucent pocket cavity surface (the receptor groove).
- Must eliminate the WebGL context loss and buffering loop caused by legacy 3Dmol `addPropertyLabels` canvas sprite generation.
- Must preserve 100% feature compatibility with the Pharmacophore Chips Toolbar, exact atom highlighting, and the dual Pharmacokinetics & Clinical Effect Drawer.
- Zero network dependencies for pharmacophore PK/PD metadata (local canonical profiles).
- All tests must pass with `npx tsx`, `npm run lint` (`tsc --noEmit`), and `npm run build`.

## Review Focus

1. **GPU Label Stability:** Toggling atom labels must not allocate 2D HTML canvas textures or trigger synchronous multi-pass WebGL draw loops.
2. **Pocket Cavity Surface Toggle:** Toggling the pocket surface must smoothly show/hide the translucent receptor groove without disrupting ligand sticks or camera orientation.
3. **Coordinate Buffering Recovery:** If network fails or coordinates are cached, the viewer must display cached data or a clean retry button instead of an infinite buffering spinner.
4. **Pharmacophore Accent Highlighting:** Selecting a pharmacophore group must highlight those specific atoms in Mol* with accent coloring and zoom the camera cleanly to that moiety.
5. **Drawer & Fullscreen Coordination:** Toggling fullscreen or opening/closing the PK/PD drawer must resize the Mol* canvas cleanly without clipping or aspect ratio distortion.

---

### Task 1: Mol* Service Loader & Binary mmCIF Caching Engine

**Files:**
- Create: `src/services/molstarLoader.ts`
- Test: `tests/molstarLoader.test.ts`

**Interfaces:**
- Consumes: PDB ID strings (e.g. `'4NTJ'`, `'1O86'`), target metadata.
- Produces: `loadMolstarPluginScript(): Promise<any>`, `getBinaryCifUrl(pdbId: string): string`, `getCachedCoordinateUrl(pdbId: string): Promise<string>`.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/molstarLoader.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getBinaryCifUrl, isMolstarSupported } from '../src/services/molstarLoader.js';

test('getBinaryCifUrl formats standard RCSB binary CIF endpoint', () => {
  assert.equal(getBinaryCifUrl('4NTJ'), 'https://models.rcsb.org/4ntj.bcif');
  assert.equal(getBinaryCifUrl(' 1o86 '), 'https://models.rcsb.org/1o86.bcif');
});

test('isMolstarSupported detects WebGL availability environment', () => {
  assert.equal(typeof isMolstarSupported(), 'boolean');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/molstarLoader.test.ts`
Expected: FAIL with "Cannot find module '../src/services/molstarLoader.js'"

- [ ] **Step 3: Implement `src/services/molstarLoader.ts`**

Implement helper functions:
- `getBinaryCifUrl(pdbId: string): string` returning lowercase `.bcif` URL.
- `loadMolstarBundle(): Promise<any>` dynamically loading Mol* / PDBeMolstar script and stylesheet with memoized promise and deduplication.
- `isMolstarSupported(): boolean` checking WebGL context support.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/molstarLoader.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/molstarLoader.ts tests/molstarLoader.test.ts
git commit -m "feat(3d-lab): add molstar loader and binary mmcif coordinate resolver"
```

---

### Task 2: Mol* Canvas Engine with Classic Pocket Sticks & Translucent Cavity Surface

**Files:**
- Modify: `src/components/ThreeDLabCanvas.tsx`
- Test: `tests/threeDLabMolstarCanvas.test.ts`

**Interfaces:**
- Consumes: `ThreeDLabCanvasProps` from `src/types/structure3d.ts`, `loadMolstarBundle` from `src/services/molstarLoader.ts`.
- Produces: Refactored `ThreeDLabCanvas` with Mol* WebGL viewport, classic pocket sticks toggle, translucent pocket cavity surface toggle, GPU-instanced atom labels toggle, and smooth zoom controls.

- [ ] **Step 1: Write the failing test**

```typescript
// tests/threeDLabMolstarCanvas.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('ThreeDLabCanvas includes Pocket Surface toggle and Mol* integration', () => {
  const source = fs.readFileSync('src/components/ThreeDLabCanvas.tsx', 'utf-8');
  assert.ok(source.includes('Pocket Surface'), 'Includes Pocket Surface toggle');
  assert.ok(source.includes('showPocketSurface'), 'Tracks showPocketSurface state');
  assert.ok(source.includes('showAtomLabels'), 'Tracks showAtomLabels state');
  assert.ok(source.includes('bcif') || source.includes('molstar'), 'Uses Mol* or binary CIF');
  assert.ok(!source.includes('viewer.addPropertyLabels("atom"'), 'Eliminates 3Dmol addPropertyLabels canvas texture freeze');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/threeDLabMolstarCanvas.test.ts`
Expected: FAIL ("Includes Pocket Surface toggle")

- [ ] **Step 3: Implement Mol* Canvas Engine in `src/components/ThreeDLabCanvas.tsx`**

- Initialize Mol* WebGL viewer in target container.
- Stream `.bcif` binary coordinates with fallback to `.cif` or `.pdb`.
- Add `showPocketSurface` state and on-canvas toggle button with `Layers` icon.
- Configure ligand in high-contrast sticks (`cyanCarbon`) with pharmacophore group accent highlighting.
- Configure pocket residues within 5Å as sticks with element/amino coloring.
- Configure translucent molecular surface over pocket cavity with opacity ~0.35 when `showPocketSurface` is enabled.
- Configure GPU-instanced atom labels using Mol* label representations when `showAtomLabels` is enabled.
- Preserve on-canvas floating zoom in/out (`+`, `−`), recenter camera, and pharmacophore chips carousel.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/threeDLabMolstarCanvas.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ThreeDLabCanvas.tsx tests/threeDLabMolstarCanvas.test.ts
git commit -m "feat(3d-lab): migrate canvas to Mol* with classic pocket sticks and cavity surface"
```

---

### Task 3: Fullscreen & Pharmacophore Drawer Coordination Integration

**Files:**
- Modify: `src/components/ThreeDLabLibrary.tsx`
- Test: `tests/threeDLabPharmacophoreIntegration.test.ts`

**Interfaces:**
- Consumes: Refactored `ThreeDLabCanvas`, `PharmacophorePkDrawer`.
- Produces: Integrated 3D Molecular Lab coordinating Mol* canvas, fullscreen triggers, mutually exclusive right drawers (`activeRightDrawer: 'none' | 'chembl' | 'pharmacophore'`), and Escape key dismissal hierarchy.

- [ ] **Step 1: Write the failing test**

```typescript
// Add to tests/threeDLabPharmacophoreIntegration.test.ts
test('ThreeDLabLibrary coordinates Mol* canvas with pocket surface and PK drawer', () => {
  const libSource = fs.readFileSync('src/components/ThreeDLabLibrary.tsx', 'utf-8');
  assert.ok(libSource.includes('ThreeDLabCanvas'), 'Mounts ThreeDLabCanvas');
  assert.ok(libSource.includes('PharmacophorePkDrawer'), 'Mounts PharmacophorePkDrawer');
  assert.ok(libSource.includes('activeRightDrawer'), 'Coordinates right-side drawer state');
});
```

- [ ] **Step 2: Run test to verify it passes/fails**

Run: `npx tsx tests/threeDLabPharmacophoreIntegration.test.ts`

- [ ] **Step 3: Update `ThreeDLabLibrary.tsx`**

Ensure canvas resize handler (`viewer.canvas3d?.requestResize()`) triggers cleanly on fullscreen toggle and sidebar collapse/expand.

- [ ] **Step 4: Run all test suites**

Run:
```bash
npx tsx tests/molstarLoader.test.ts
npx tsx tests/threeDLabMolstarCanvas.test.ts
npx tsx tests/threeDLabPharmacophoreIntegration.test.ts
npx tsx tests/pharmacophorePkDrawer.test.ts
npx tsx tests/canonicalPharmacophorePkData.test.ts
npm run lint
npm run build
```
Expected: All PASS with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/ThreeDLabLibrary.tsx tests/threeDLabPharmacophoreIntegration.test.ts
git commit -m "feat(3d-lab): wire Mol* canvas resize and drawer coordination in library"
```

---

### Task 4: Whole-Branch Verification & End-to-End Regression Audit

**Files:**
- Test: All test files in `tests/*.test.ts`

- [ ] **Step 1: Run comprehensive regression test sweep**
Run: `Get-ChildItem tests/*.test.ts | ForEach-Object { npx tsx $_.FullName }`
Expected: 100% PASS across all suites.

- [ ] **Step 2: Run type check and production build**
Run: `npm run lint` and `npm run build`
Expected: 0 TypeScript errors, successful Vite production build.

- [ ] **Step 3: Commit and branch finalize**
```bash
git commit --allow-empty -m "chore(3d-lab): verify Mol* engine migration and pocket surface controls"
```
