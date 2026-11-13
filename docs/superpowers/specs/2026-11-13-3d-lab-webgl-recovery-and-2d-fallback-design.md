# Design Specification: 3D Lab WebGL Recovery & Interactive 2D Pocket Fallback

**Date:** 2026-11-13  
**Status:** Draft / Pending Review  
**Author:** Antigravity Team  
**Scope:** `src/services/molstarLoader.ts`, `src/components/ThreeDLabCanvas.tsx`, `src/components/TwoDPocketFallbackView.tsx`, `tests/threeDLabFallback.test.ts`

---

## 1. Problem Statement

When users navigate to the 3D Macromolecular Lab in browsers where WebGL is disabled (e.g. Chrome/Edge "Graphics Acceleration" toggled off) or when the browser's WebGL context limit (8–16 simultaneous contexts) is exhausted:
1. `isMolstarSupported()` in `molstarLoader.ts` attempts `canvas.getContext(...)` without calling `gl.getExtension('WEBGL_lose_context')?.loseContext()`, leaking test contexts and accelerating context pool exhaustion.
2. `ThreeDLabCanvas.tsx` preemptively halts on `!isMolstarSupported()` and shows a fatal error overlay (`"WebGL is not supported or is disabled in your current browser environment."`).
3. The user hits a dead end: they cannot see the drug, cannot view the target receptor, cannot inspect key binding pocket residues, and cannot examine SAR pharmacophore interactions.
4. No actionable troubleshooting steps are provided to help the user re-enable hardware acceleration in their browser.

---

## 2. Goals & Non-Goals

### Goals
- **Context Management & Leak Prevention:** Ensure all WebGL capability probes in `molstarLoader.ts` immediately destroy temporary probing contexts using `WEBGL_lose_context`.
- **Softened Pre-check & Mol\* Attempt:** Don't preemptively abort before Mol\* has a chance to negotiate its own context or software canvas fallback unless strictly impossible.
- **Actionable In-App Diagnostics:** When WebGL fails, present clear step-by-step instructions for Chrome/Edge/Firefox (`chrome://settings/system` -> "Use graphics acceleration when available" -> Relaunch).
- **Interactive 2D Pocket & SAR Fallback Mode:** When WebGL is unavailable (or if the user clicks "Switch to 2D View"), provide an embedded 2D pedagogical view:
  - 2D chemical structure of the drug with high-contrast depiction.
  - Interactive Target Binding Pocket Residue Map (derived from `KeyPocketResidueContact` in `structure3d.ts` and `medChemProfile`), showing residue codes, numbers, interaction types (H-bond, Ionic, Hydrophobic, Pi-stacking), and distances.
  - Pharmacophore chip filtering: clicking a pharmacophore or pocket residue highlights the corresponding interaction and explains the medicinal chemistry rationale.
  - Option to "Try 3D Mode Again" whenever the user re-enables WebGL.

### Non-Goals
- Replacing Mol\* for 3D rendering (Mol\* remains the primary 3D visualizer whenever WebGL is present).
- Software-rasterizing a full 3D protein mesh on a 2D canvas (the 2D fallback is a clean schematic and residue contact map, which is pedagogically superior and lightweight).

---

## 3. Architecture & Technical Design

### A. Resilient WebGL Probing (`src/services/molstarLoader.ts`)
```ts
export function isMolstarSupported(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  try {
    const canvas = document.createElement('canvas');
    const gl = (
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: false })
    ) as WebGLRenderingContext | WebGL2RenderingContext | null;

    if (!gl) return false;

    // Immediately dispose of the test context to avoid exhausting the browser's context limit
    const loseContextExt = gl.getExtension('WEBGL_lose_context');
    if (loseContextExt) {
      loseContextExt.loseContext();
    }
    return true;
  } catch {
    return false;
  }
}
```

### B. Two-Tiered Rendering in `ThreeDLabCanvas.tsx`
1. **Primary Tier (3D Mol\* Mode):**
   - Attempts Mol\* initialization.
   - If WebGL is completely unavailable or Mol\* throws a WebGL context error, transitions state to `isFallback2D = true` (or shows the diagnostic error card with an immediate "Switch to 2D Pocket View" button).
2. **Fallback Tier (`TwoDPocketFallbackView.tsx` / 2D Pocket Schematic):**
   - Header: Structure ID, Target Name, Gene Symbol, and "2D Schematic Fallback" badge.
   - Main View:
     - **Left Pane:** 2D Chemical Structure of the ligand (with PubChem image / SmilesDrawer) and active pharmacophore highlighting.
     - **Right Pane:** Interactive Binding Pocket Residues:
       - Displays key pocket residues (e.g. Arg167, Tyr35, Trp84 for Losartan/AT1R, or Ser195/Asp102/His57 for proteases).
       - Interaction tags: Hydrogen Bond (cyan), Salt Bridge / Ionic (purple), Hydrophobic (amber), Pi-Pi Stacking (emerald).
       - Clicking a residue opens detailed binding rationale and distance metrics ($3.2$ Å, etc.).
   - Action Bar: "Try 3D View Again" and "Browser WebGL Settings Guide".

### C. In-App Browser Diagnostics Card
If 3D initialization fails:
- Banner: **"WebGL Hardware Acceleration Disabled or Unavailable"**
- Quick Guide:
  1. Open `chrome://settings/system` (or browser Settings > System).
  2. Turn on **"Use graphics acceleration when available"**.
  3. Click **Relaunch**.
- Dual Action Buttons:
  - **[Switch to 2D Pocket View]** (Instant access to learning material)
  - **[Retry 3D WebGL]** (Attempts re-initialization after browser toggle)

---

## 4. Test Strategy

1. **`tests/molstarLoader.test.ts`:**
   - Verify `isMolstarSupported()` calls `loseContext()` on mock context so no memory or context leaks occur.
   - Verify detection across WebGL2, WebGL, and no-WebGL environments.
2. **`tests/threeDLabFallback.test.ts`:**
   - Verify `ThreeDLabCanvas` renders the 2D fallback view when WebGL context fails.
   - Verify 2D pocket residue map renders key contacts from `canonicalPharmacophorePkData.ts`.
   - Verify toggling between 2D view and 3D retry.
3. **Typecheck & Build:**
   - `npm run lint` (`tsc --noEmit`) passes with 0 errors.
   - `npm run build` completes with 0 errors.
