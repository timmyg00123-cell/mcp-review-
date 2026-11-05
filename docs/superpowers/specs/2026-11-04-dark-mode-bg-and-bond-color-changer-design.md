# Dark Mode Structure Background & Bond Line Color Changer Design Spec

**Date**: 2026-11-04  
**Status**: Proposed  
**Author**: Antigravity & User  
**Scope**: 2D chemical structure viewport theming across light and dark modes, with dedicated bond stroke hue and saturation controls.

---

## 1. Intent & The Why

Users want full visual personalization of 2D chemical structure drawings across both Light and Dark themes. Currently:
1. In Light Mode, structure backgrounds can be customized with pastel tints, but Dark Mode is locked to obsidian slate (`#0f172a`).
2. Molecular bond lines are hardcoded to Slate-600 (`#475569`) in Light Mode and Off-white (`#e2e8f0`) in Dark Mode, giving users no control over bond stroke color or intensity.

This design introduces:
- **Independent Dark Mode Background Canvas Picker**: Users can choose any dark tint, pastel tint, or rich tone for Dark Mode structure image viewports.
- **Deep Obsidian Lock Toggle (Default: OFF)**: An optional setting to enforce standard obsidian `#0f172a` in Dark Mode. When disabled (default), the user's custom dark-mode background color is rendered directly.
- **Bond Line Color Changer with Saturation Slider**: An interactive color wheel paired with a dedicated 0%–100% saturation adjustment bar for molecular bond strokes, with independent settings for Light Mode and Dark Mode.
- **Mode-Tabbed Settings UI**: A streamlined "Structure & Bond Stylist" in Settings with `[☀️ Light Mode]` and `[🌙 Dark Mode]` tabs, live structure previews, and one-click resets.

---

## 2. Goals & Non-Goals

### Goals
- **Independent Canvas Backgrounds**: Store and apply distinct background colors for Light Mode (`mcp_structure_image_bg`) and Dark Mode (`mcp_structure_image_dark_bg`).
- **Obsidian Lock Toggle**: Persist `mcp_structure_lock_obsidian` (boolean, default `false`). When `true`, dark mode forces `#0f172a`. When `false` (default), the custom dark background color is applied.
- **Bond Line Color Customization**:
  - Full-spectrum interactive color wheel for bond hue.
  - Smooth horizontal Saturation Slider (0% to 100%) to dial between muted clinical grays/slates and vibrant accent colors.
  - Independent bond line colors for Light Mode and Dark Mode to guarantee crisp legibility against their respective backgrounds.
- **RDKit SVG Integration**: Update [`SmilesCanvas.tsx`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/SmilesCanvas.tsx) `postProcessSvg` to render the user's configured bond stroke colors dynamically while keeping pharmacophore highlight overlays crisp and untouched.
- **Tabbed Settings UX**: Consolidate Light and Dark structure styling inside a clean tabbed panel in [`SettingsModal.tsx`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/SettingsModal.tsx) Section 1, featuring interactive previews and quick preset chips.

### Non-Goals
- Changing the background or border colors of the outer question cards, review decks, or modal frames (only the inner molecular canvas image slot is styled).
- Modifying pharmacophore highlight colors (pharmacophore badges and SMARTS halos retain their distinct diagnostic palettes).
- 3D molecular viewer modifications (PyMOL / Mol* sidecar viewers remain separate).

---

## 3. Approaches Considered

### Approach 1: Mode-Tabbed "Structure & Bond Stylist" (Selected)
- **Structure**: Settings panel with `[☀️ Light Mode]` and `[🌙 Dark Mode]` tabs.
- **Controls per tab**:
  - Background Tint: Color wheel + quick preset chips.
  - Bond Lines: Color wheel + 0%–100% Saturation slider + preset chips.
  - Live Sample: Aspirin molecule preview showing current background and bond strokes in that mode.
  - Dark mode tab includes the "Lock to deep obsidian slate" toggle (default: OFF).
- **Why Chosen**: Maximizes workspace clarity by preventing four simultaneous canvas wheels from crowding the settings modal, while maintaining 100% independent control and instant visual feedback.

### Approach 2: Stacked Multi-Section Controls (Rejected)
- Four separate color wheels stacked vertically on the settings page.
- **Why Rejected**: Causes excessive vertical scrolling and visual clutter inside the modal.

---

## 4. Detailed Component & System Architecture

### 4.1 Storage & State Architecture ([`storage.ts`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/utils/storage.ts))
New and existing persisted keys in `localStorage`:

| Key | Type | Default Value | Description |
|---|---|---|---|
| `mcp_structure_image_bg` | `string` | `hsl(286, 55%, 94%)` | Light mode canvas background tint |
| `mcp_structure_image_dark_bg` | `string` | `hsl(222, 47%, 14%)` | Dark mode canvas background tint (Deep Slate-Navy) |
| `mcp_structure_lock_obsidian` | `boolean` | `false` | When true, forces `#0f172a` in dark mode regardless of custom dark bg |
| `mcp_structure_bond_light_color` | `string` | `#475569` | Light mode bond stroke color (Slate-600) |
| `mcp_structure_bond_dark_color` | `string` | `#e2e8f0` | Dark mode bond stroke color (Slate-200) |
| `mcp_structure_bond_light_sat` | `number` | `20` | Light mode bond saturation percentage (0–100) |
| `mcp_structure_bond_dark_sat` | `number` | `15` | Dark mode bond saturation percentage (0–100) |

Getter and setter functions with in-memory caching will be added for all keys in `storage.ts`.

### 4.2 CSS Custom Properties & Real-Time Sync ([`index.css`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/index.css) & [`App.tsx`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/App.tsx))
- CSS Variables declared on `:root`:
  ```css
  :root {
    --structure-canvas-bg: hsl(286, 55%, 94%);
    --structure-bond-stroke: #475569;
  }
  ```
- In `App.tsx`:
  - `structureImageBg`: light mode background
  - `structureImageDarkBg`: dark mode background
  - `lockObsidian`: boolean (default `false`)
  - `bondLightColor`: light mode bond stroke
  - `bondDarkColor`: dark mode bond stroke
  - Sync effect:
    ```typescript
    useEffect(() => {
      if (typeof document === 'undefined') return;
      const isDark = theme === 'dark';
      
      // Compute effective background
      const effectiveBg = isDark
        ? (lockObsidian ? '#0f172a' : structureImageDarkBg)
        : structureImageBg;
        
      // Compute effective bond stroke
      const effectiveBond = isDark ? bondDarkColor : bondLightColor;

      document.documentElement.style.setProperty('--structure-canvas-bg', effectiveBg);
      document.documentElement.style.setProperty('--structure-bond-stroke', effectiveBond);
    }, [theme, structureImageBg, structureImageDarkBg, lockObsidian, bondLightColor, bondDarkColor]);
    ```

### 4.3 RDKit SVG Bond Stroke Integration ([`SmilesCanvas.tsx`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/SmilesCanvas.tsx))
- `SmilesCanvasProps` accepts optional `bondStrokeColor?: string`.
- If `bondStrokeColor` prop is not passed, `postProcessSvg` dynamically resolves the bond stroke:
  1. Checks `getComputedStyle(document.documentElement).getPropertyValue('--structure-bond-stroke')`.
  2. Falls back to `#e2e8f0` (dark) or `#475569` (light).
- In `postProcessSvg`:
  - Replaces all RDKit base strokes (`#000000`, `#000`, `black`, `#475569`, `#e2e8f0`) with the resolved bond stroke color.
  - Updates text fills for heteroatoms (C, H, N, O, etc.) if they were using the default stroke color, preserving heteroatom-specific colored text (red O, blue N, green Cl, etc.).

### 4.4 Structure & Bond Stylist Component ([`src/components/StructureStylePanel.tsx`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/StructureStylePanel.tsx))
A dedicated component embedded into [`SettingsModal.tsx`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/SettingsModal.tsx):
- **Tab Header**:
  - `[☀️ Light Mode]`
  - `[🌙 Dark Mode]`
- **In Light Mode Tab**:
  - Canvas Background:
    - Pastel Color Wheel + Presets: Lavender, Baby Blue, Light Yellow, Soft Mint, Classic White.
  - Bond Line Color:
    - Full-spectrum Color Wheel for hue.
    - Saturation Slider (0% to 100%) with dynamic gradient track displaying the current hue across saturations.
    - Presets: Slate-600 (`#475569`), Charcoal (`#334155`), Deep Navy (`#1e3a5f`), Forest (`#14532d`), Indigo (`#3730a3`), Black (`#0f172a`).
  - Live Preview Card: Aspirin with Light background & Light bond color.
- **In Dark Mode Tab**:
  - Canvas Background:
    - Obsidian Toggle: *"Lock Dark Mode canvas to deep obsidian slate (#0f172a)"* (default: **OFF**).
    - When unlocked: Dark Color Wheel + Presets: Deep Slate-Navy (`hsl(222, 47%, 14%)`), Obsidian (`#0f172a`), Dark Amethyst (`hsl(275, 45%, 12%)`), Midnight Teal (`hsl(180, 45%, 11%)`), Pitch Black (`#000000`), or any custom hue.
  - Bond Line Color:
    - Color Wheel for hue.
    - Saturation Slider (0% to 100%).
    - Presets: Slate-200 (`#e2e8f0` - default), Crisp White (`#ffffff`), Soft Cyan (`#a5f3fc`), Mint Glow (`#a7f3d0`), Pastel Lavender (`#e9d5ff`), Gold (`#fef08a`).
  - Live Preview Card: Aspirin with Dark background & Dark bond color.

---

## 5. Verification Plan

1. **Storage Unit Tests (`scratch/test_structure_theming_storage.cjs`)**:
   - Verify all keys, defaults, getters, setters, and in-memory caches work as specified.
   - Verify `lockObsidian` defaults to `false`.
2. **Component & Integration Tests (`scratch/test_structure_style_panel.cjs`)**:
   - Verify `StructureStylePanel` renders tabs, wheels, saturation slider, obsidian toggle, and live previews.
   - Verify `SettingsModal` wires all new props.
3. **SVG Bond Rendering Tests (`scratch/test_bond_stroke_rendering.cjs`)**:
   - Verify `SmilesCanvas.tsx` injects custom bond stroke colors dynamically into SVG output.
4. **App Build & Typecheck**:
   - `npm run lint` (`tsc --noEmit`) passes with 0 errors.
   - `npm run build` (`vite build`) completes cleanly.
