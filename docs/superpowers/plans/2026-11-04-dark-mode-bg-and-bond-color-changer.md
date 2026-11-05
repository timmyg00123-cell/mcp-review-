# Dark Mode Structure Background & Bond Line Color Changer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement customizable Dark Mode structure canvas backgrounds with an optional deep obsidian lock (default: OFF), and an interactive Bond Line Color Changer featuring a color wheel and 0%–100% saturation adjusting slider with independent Light and Dark mode settings.

**Architecture:** Persist configuration in `localStorage` via `src/utils/storage.ts`; synchronize `--structure-canvas-bg` and `--structure-bond-stroke` via `src/App.tsx`; enhance `SmilesCanvas.tsx` SVG post-processing to dynamically style bond lines; and embed a mode-tabbed `StructureStylePanel.tsx` component into `SettingsModal.tsx`.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, RDKit MinimalLib WASM, Lucide React icons, Vite 8.

**Spec:** [docs/superpowers/specs/2026-11-04-dark-mode-bg-and-bond-color-changer-design.md](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/docs/superpowers/specs/2026-11-04-dark-mode-bg-and-bond-color-changer-design.md)

## Global Constraints

- Preserve all existing 160×160px card geometry, responsive layout, and outer card neutral borders.
- Dark mode obsidian lock toggle MUST default to `false` (OFF), allowing custom dark mode canvas backgrounds to display out of the box.
- Bond line customization MUST provide independent colors for Light Mode (default: `#475569`) and Dark Mode (default: `#e2e8f0`).
- Saturation adjusting slider MUST provide smooth 0% to 100% adjustment for bond strokes.
- Keep RDKit pharmacophore highlights and heteroatom colors (O, N, Cl, S, etc.) visually crisp and distinct.
- All code changes must pass TypeScript validation (`npm run lint`) and Vite production build (`npm run build`).

## Review Focus

1. **Obsidian Lock Toggle Switching**: Toggling "Lock Dark Mode to deep obsidian slate" from false to true immediately enforces `#0f172a`, and toggling back immediately restores the custom dark background.
2. **Saturation Slider Reactivity**: Moving the saturation slider updates bond stroke color smoothly between monochromatic gray (0%) and vibrant full saturation (100%) without jumping hue.
3. **Heteroatom Label Preservation**: Post-processing replaces default carbon bond strokes and neutral carbon labels without corrupting red oxygens, blue nitrogens, or highlight halos.
4. **Theme Change Persistence**: Switching between Light and Dark mode in Settings or the Navbar immediately applies the corresponding background tint and bond stroke color.
5. **Reset Actions**: Resetting either Light or Dark mode restores their respective factory defaults without affecting the other mode.

---

### Task 1: Storage Layer & CSS Variable Dynamic Theming

**Files:**
- Modify: `src/utils/storage.ts`
- Modify: `src/index.css`
- Modify: `src/App.tsx`
- Test: `scratch/test_theming_storage_and_vars.cjs`

**Interfaces:**
- Consumes: Existing `getInitialStructureImageBg`, `saveStructureImageBg`.
- Produces:
  - `STRUCTURE_IMAGE_DARK_BG_KEY = 'mcp_structure_image_dark_bg'`, `DEFAULT_STRUCTURE_IMAGE_DARK_BG = 'hsl(222, 47%, 14%)'`
  - `STRUCTURE_LOCK_OBSIDIAN_KEY = 'mcp_structure_lock_obsidian'`, `DEFAULT_STRUCTURE_LOCK_OBSIDIAN = false`
  - `BOND_LIGHT_COLOR_KEY = 'mcp_structure_bond_light_color'`, `DEFAULT_BOND_LIGHT_COLOR = '#475569'`
  - `BOND_DARK_COLOR_KEY = 'mcp_structure_bond_dark_color'`, `DEFAULT_BOND_DARK_COLOR = '#e2e8f0'`
  - Functions: `getInitialStructureImageDarkBg()`, `saveStructureImageDarkBg(color: string)`, `getInitialStructureLockObsidian()`, `saveStructureLockObsidian(locked: boolean)`, `getInitialBondLightColor()`, `saveBondLightColor(color: string)`, `getInitialBondDarkColor()`, `saveBondDarkColor(color: string)`.
  - CSS variables: `--structure-canvas-bg` and `--structure-bond-stroke` synchronized in `App.tsx`.

- [ ] **Step 1: Write the failing test**

Create `scratch/test_theming_storage_and_vars.cjs` to assert all storage constants, getters, setters, and defaults in `src/utils/storage.ts`, and check `src/index.css` / `src/App.tsx` variable declarations.

- [ ] **Step 2: Run test to verify it fails**

Run: `node scratch/test_theming_storage_and_vars.cjs`
Expected: FAIL with missing constants/functions.

- [ ] **Step 3: Implement storage keys, helpers, and CSS variables**

1. In `src/utils/storage.ts`: add dark bg, obsidian lock, bond light color, and bond dark color keys and accessor functions.
2. In `src/index.css`: declare `--structure-bond-stroke: #475569;` on `:root`.
3. In `src/App.tsx`: initialize states `structureImageDarkBg`, `lockObsidian`, `bondLightColor`, `bondDarkColor`; add `useEffect` setting `--structure-canvas-bg` and `--structure-bond-stroke`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scratch/test_theming_storage_and_vars.cjs`
Expected: PASS

- [ ] **Step 5: Run linter**

Run: `npm run lint`
Expected: PASS with 0 errors.

---

### Task 2: Dynamic Bond Line Stroke Injection in `SmilesCanvas.tsx`

**Files:**
- Modify: `src/components/SmilesCanvas.tsx`
- Test: `scratch/test_bond_stroke_postprocess.cjs`

**Interfaces:**
- Consumes: `theme`, optional `bondStrokeColor` prop, or CSS variable `--structure-bond-stroke`.
- Produces: `SmilesCanvasProps.bondStrokeColor?: string`, dynamic stroke replacement in `postProcessSvg`.

- [ ] **Step 1: Write the failing test**

Create `scratch/test_bond_stroke_postprocess.cjs` asserting that `SmilesCanvas.tsx`:
1. Defines `bondStrokeColor` in `SmilesCanvasProps`.
2. Resolves bond stroke color from prop or `--structure-bond-stroke` fallback.
3. Injects the custom stroke into bond lines and neutral text elements while preserving colored heteroatoms.

- [ ] **Step 2: Run test to verify it fails**

Run: `node scratch/test_bond_stroke_postprocess.cjs`
Expected: FAIL.

- [ ] **Step 3: Implement dynamic bond stroke in `SmilesCanvas.tsx`**

1. In `SmilesCanvasProps`, add `bondStrokeColor?: string`.
2. In `postProcessSvg`, add `customStroke?: string` parameter. If not provided, read `getComputedStyle(document.documentElement).getPropertyValue('--structure-bond-stroke')`.
3. Replace stroke and neutral fill colors (`#000000`, `#000`, `black`, `#475569`, `#e2e8f0`) with the resolved stroke.
4. Pass `bondStrokeColor` to `postProcessSvg`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scratch/test_bond_stroke_postprocess.cjs`
Expected: PASS.

- [ ] **Step 5: Run linter**

Run: `npm run lint`
Expected: PASS with 0 errors.

---

### Task 3: Mode-Tabbed `StructureStylePanel.tsx` Component

**Files:**
- Create: `src/components/StructureStylePanel.tsx`
- Test: `scratch/test_structure_style_panel.cjs`

**Interfaces:**
- Consumes: Storage default constants, `SmilesCanvas`.
- Produces: `StructureStylePanel` component with props:
  ```typescript
  export interface StructureStylePanelProps {
    theme: 'light' | 'dark';
    structureImageBg: string;
    onUpdateStructureImageBg: (color: string) => void;
    structureImageDarkBg: string;
    onUpdateStructureImageDarkBg: (color: string) => void;
    lockObsidian: boolean;
    onToggleLockObsidian: (locked: boolean) => void;
    bondLightColor: string;
    onUpdateBondLightColor: (color: string) => void;
    bondDarkColor: string;
    onUpdateBondDarkColor: (color: string) => void;
  }
  ```

- [ ] **Step 1: Write the failing test**

Create `scratch/test_structure_style_panel.cjs` asserting:
1. `StructureStylePanel.tsx` exists and exports `StructureStylePanel`.
2. Includes `[Light Mode]` and `[Dark Mode]` tabs.
3. Light tab has Canvas Background color wheel + presets, and Bond Line color wheel + saturation slider (0–100%) + presets.
4. Dark tab has Obsidian lock toggle, Dark Canvas Background color wheel + presets, and Dark Bond Line color wheel + saturation slider + presets.
5. Live `SmilesCanvas` preview card rendering Aspirin with live background and bond strokes.

- [ ] **Step 2: Run test to verify it fails**

Run: `node scratch/test_structure_style_panel.cjs`
Expected: FAIL (file does not exist).

- [ ] **Step 3: Implement `StructureStylePanel.tsx`**

Build `src/components/StructureStylePanel.tsx` with:
- Active mode tab state (`'light' | 'dark'`), initialized to current active `theme`.
- Canvas circular hue wheels for both background tint and bond strokes.
- Dedicated horizontal saturation slider (`<input type="range" min="0" max="100" />`) with real-time hue gradient track and numerical percentage display.
- Quick preset chips for Light and Dark backgrounds and bonds.
- Obsidian slate toggle with informative subtext (`"Lock canvas to #0f172a"`).
- Live sample preview card rendering `<SmilesCanvas smiles="CC(=O)Oc1ccccc1C(=O)O" width={100} height={100} bondStrokeColor={...} />`.
- Independent Reset buttons for Light and Dark configurations.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scratch/test_structure_style_panel.cjs`
Expected: PASS.

- [ ] **Step 5: Run linter**

Run: `npm run lint`
Expected: PASS with 0 errors.

---

### Task 4: SettingsModal Wiring & End-to-End Application Verification

**Files:**
- Modify: `src/components/SettingsModal.tsx`
- Modify: `src/App.tsx`
- Test: `scratch/test_full_structure_styling_e2e.cjs`

**Interfaces:**
- Consumes: `StructureStylePanel`, all state variables and change handlers from `App.tsx`.
- Produces: Complete end-to-end user-facing theming experience in Settings and all structure viewports.

- [ ] **Step 1: Write the failing test**

Create `scratch/test_full_structure_styling_e2e.cjs` verifying:
1. `SettingsModal.tsx` imports and renders `StructureStylePanel`.
2. `SettingsModalProps` declares all 10 styling props.
3. `App.tsx` passes all styling states and handlers to `<SettingsModal />`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node scratch/test_full_structure_styling_e2e.cjs`
Expected: FAIL.

- [ ] **Step 3: Wire `StructureStylePanel` into `SettingsModal` and `App.tsx`**

1. In `src/components/SettingsModal.tsx`:
   - Replace `<PastelColorWheel />` in Section 1 with `<StructureStylePanel />`.
   - Forward all styling props.
2. In `src/App.tsx`:
   - Create change handlers `handleUpdateStructureImageDarkBg`, `handleToggleLockObsidian`, `handleUpdateBondLightColor`, `handleUpdateBondDarkColor`.
   - Pass all states and handlers to `<SettingsModal />`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node scratch/test_full_structure_styling_e2e.cjs`
Expected: PASS.

- [ ] **Step 5: Run full verification suite**

Run all automated test scripts:
`node scratch/test_theming_storage_and_vars.cjs; node scratch/test_bond_stroke_postprocess.cjs; node scratch/test_structure_style_panel.cjs; node scratch/test_full_structure_styling_e2e.cjs`
Run `npm run lint` (`tsc --noEmit`).
Run `npm run build` (`vite build`).
Expected: All tests PASS and build succeeds cleanly.
