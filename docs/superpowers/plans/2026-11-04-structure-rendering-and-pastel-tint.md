# Chemical Structure Rendering Polish & Pastel Canvas Tint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver publication-quality ChemDraw-style chemical structure rendering with wide double-bond separation (`multipleBondOffset: 0.24`), smooth rounded joins, soft Slate-600 lines (`#475569`), edge-to-edge fill (`padding: 0.05`), and a customizable pastel background tint for the structure image canvas defaulting to user-selected soft lavender (`hsl(286, 55%, 94%)`) with an interactive pastel color wheel in Settings.

**Architecture:** Update RDKit drawing options and SVG post-processing in `SmilesCanvas.tsx` to ensure transparency and clean Slate-600 line work. Introduce `structureImageBg` preference in `storage.ts` synced to CSS variable `--structure-canvas-bg`. Build a dedicated, reusable `PastelColorWheel.tsx` component integrated into `SettingsModal.tsx` with preset chips (Lavender, Baby Blue, Light Yellow, Soft Mint, White). Wire `--structure-canvas-bg` to structure image containers across `ReviewDeck`, `App`, `DocumentQuestionItem`, `StructureComparator`, and `InteractiveStructureViewer`, while preserving dark mode dark slate (`#0f172a` / `dark:bg-slate-900`).

**Tech Stack:** React 19, TypeScript, RDKit MinimalLib (WASM), Vite 8, Tailwind CSS v4, Lucide React.

**Spec:** [docs/superpowers/specs/2026-11-03-structure-rendering-polish-design.md](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/docs/superpowers/specs/2026-11-03-structure-rendering-polish-design.md)

## Global Constraints
- `bondLineWidth` must be set to `1.30` in the RDKit drawing details object.
- `multipleBondOffset` must be set to `0.24` in the RDKit drawing details object.
- `padding` must be set to `0.05` in the RDKit drawing details object.
- `clearBackground: true` must be passed to RDKit, and any remaining white background `<rect>` in generated SVGs must be stripped to guarantee transparency.
- Light-mode strokes and text fills must map `#000000` to `#475569` (Slate-600) while preserving pharmacophore highlight overlays (e.g., `#ef4444`, `#2563eb`).
- All stroked paths in generated SVGs must receive `stroke-linecap="round"` and `stroke-linejoin="round"`.
- Default structure image background tint is `hsl(286, 55%, 94%)`.
- The background tint must only apply to the structure image canvas slot (the inner viewport behind molecule lines); outer review cards, titles, badges, and action buttons remain clean and neutral.
- In dark mode, structure image viewports must preserve dark slate (`#0f172a` / `dark:bg-slate-900`) to avoid bright glare.
- Storage key in `localStorage` must be `mcp_structure_image_bg`.
- `npm run lint` and `npm run build` must pass with zero errors.

## Review Focus
1. **Double bond merging into solid bars**: Verify that carbonyl (`C=O`), ester, and aromatic double bonds have distinct daylight between parallel lines.
2. **Spiky ring vertices**: Verify that ring corners (e.g., benzene, pyridine) have rounded joins rather than needle-sharp points.
3. **SVG transparency on tinted background**: Verify that no residual white rect from RDKit blocks the pastel background behind molecule bonds.
4. **Dark mode protection**: Verify that switching to dark mode renders the dark slate background (`#0f172a`) rather than the pastel tint.
5. **Color wheel pastel clamping**: Verify that dragging the wheel locks lightness (~94–96%) and saturation (~40–80%) to prevent harsh, overly dark, or garish tones that ruin structure contrast.

---

### Task 1: RDKit Drawing Options & SVG Post-Processing in `SmilesCanvas.tsx`

**Files:**
- Modify: `src/components/SmilesCanvas.tsx:90-120, 335-365`
- Test: `scratch/verify_smiles_canvas.cjs`

**Interfaces:**
- Consumes: RDKit WASM MinimalLib `mol.get_svg_with_highlights(detailsJson)`
- Produces: Sanitized and styled transparent SVG string with rounded line joins, `multipleBondOffset: 0.24`, `bondLineWidth: 1.30`, `padding: 0.05`, and `#475569` strokes in light mode.

- [ ] **Step 1: Write verification test script**

Create `scratch/verify_smiles_canvas.cjs` asserting:
1. `details.bondLineWidth === 1.30`
2. `details.multipleBondOffset === 0.24`
3. `details.padding === 0.05`
4. Post-processed light-mode SVG contains `stroke: #475569` and `fill: #475569`
5. Post-processed SVG paths contain `stroke-linecap="round"` and `stroke-linejoin="round"`
6. Any white `<rect>` is stripped so the SVG is transparent
7. Highlight colors (e.g. `#ef4444`) are preserved intact.

- [ ] **Step 2: Run verification script to confirm it fails against current code**

Run: `node scratch/verify_smiles_canvas.cjs`  
Expected: Script reports differences in bondLineWidth (1.15 vs 1.30), missing multipleBondOffset, missing round joins, and `#334155` instead of `#475569`.

- [ ] **Step 3: Update `SmilesCanvas.tsx`**

In [src/components/SmilesCanvas.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/SmilesCanvas.tsx):
1. In `postProcessSvg(svgString, currentTheme)`:
   - Strip solid white background `<rect>` elements matching both `fill="#ffffff"` and `fill: #ffffff`.
   - In light mode: replace `stroke: #000000` and `fill: #000000` (and `#000\b`) with `#475569` (Slate-600).
   - Inject `stroke-linecap="round"` and `stroke-linejoin="round"` into all stroked `<path>` elements.
2. In `drawMolecule()`:
   - Update `details` object passed to `mol.get_svg_with_highlights`:
     ```ts
     const details = {
       width: width || 160,
       height: height || 160,
       bondLineWidth: 1.30,
       multipleBondOffset: 0.24,
       padding: 0.05,
       clearBackground: true,
       // ... highlights
     };
     ```

- [ ] **Step 4: Run verification script to verify it passes**

Run: `node scratch/verify_smiles_canvas.cjs`  
Expected: PASS — all assertions succeed.

- [ ] **Step 5: Run TypeScript lint check**

Run: `npm run lint`  
Expected: 0 errors in `src/components/SmilesCanvas.tsx`.

---

### Task 2: Storage Utilities & CSS Custom Property for Structure Canvas Background

**Files:**
- Modify: `src/utils/storage.ts`
- Modify: `src/index.css`
- Modify: `src/App.tsx:400-430`
- Test: `scratch/test_storage_structure_bg.cjs`

**Interfaces:**
- Consumes: `localStorage` browser API
- Produces: `getInitialStructureImageBg(): string`, `saveStructureImageBg(color: string): void`, and `--structure-canvas-bg` custom property on `:root`.

- [ ] **Step 1: Write test script for storage utilities**

Create `scratch/test_storage_structure_bg.cjs` testing:
1. `getInitialStructureImageBg()` returns `'hsl(286, 55%, 94%)'` when localStorage is empty.
2. `saveStructureImageBg('hsl(204, 88%, 94%)')` stores the color.
3. `getInitialStructureImageBg()` reads the stored value.

- [ ] **Step 2: Run storage test script to verify it fails**

Run: `node scratch/test_storage_structure_bg.cjs`  
Expected: FAIL — `getInitialStructureImageBg` is not a function.

- [ ] **Step 3: Implement storage functions in `src/utils/storage.ts`**

In [src/utils/storage.ts](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/utils/storage.ts):
```ts
export const STRUCTURE_IMAGE_BG_KEY = 'mcp_structure_image_bg';
export const DEFAULT_STRUCTURE_IMAGE_BG = 'hsl(286, 55%, 94%)';

let inMemoryStructureImageBg: string | null = null;

export function getInitialStructureImageBg(): string {
  if (inMemoryStructureImageBg !== null) return inMemoryStructureImageBg;
  try {
    const saved = localStorage.getItem(STRUCTURE_IMAGE_BG_KEY);
    if (saved && saved.trim().length > 0) {
      inMemoryStructureImageBg = saved.trim();
      return inMemoryStructureImageBg;
    }
  } catch {}
  inMemoryStructureImageBg = DEFAULT_STRUCTURE_IMAGE_BG;
  return DEFAULT_STRUCTURE_IMAGE_BG;
}

export function saveStructureImageBg(color: string): void {
  inMemoryStructureImageBg = color;
  try {
    localStorage.setItem(STRUCTURE_IMAGE_BG_KEY, color);
  } catch {}
}
```

- [ ] **Step 4: Declare `--structure-canvas-bg` in `src/index.css` and sync in `src/App.tsx`**

In [src/index.css](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/index.css):
```css
:root {
  --structure-canvas-bg: hsl(286, 55%, 94%);
}

.dark {
  --structure-canvas-bg: #0f172a;
}
```

In [src/App.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/App.tsx):
- Add state: `const [structureImageBg, setStructureImageBg] = useState<string>(getInitialStructureImageBg);`
- Sync to DOM root via `useEffect`:
  ```ts
  useEffect(() => {
    document.documentElement.style.setProperty('--structure-canvas-bg', structureImageBg);
  }, [structureImageBg]);
  ```
- Define updater:
  ```ts
  const handleUpdateStructureImageBg = (color: string) => {
    setStructureImageBg(color);
    saveStructureImageBg(color);
  };
  ```

- [ ] **Step 5: Run storage test script to verify it passes**

Run: `node scratch/test_storage_structure_bg.cjs`  
Expected: PASS — all assertions succeed.

---

### Task 3: Interactive Pastel Color Wheel Component & Settings Modal Integration

**Files:**
- Create: `src/components/PastelColorWheel.tsx`
- Modify: `src/components/SettingsModal.tsx`
- Modify: `src/App.tsx:1725-1740`
- Test: Visual inspection and `npm run lint`

**Interfaces:**
- Consumes: `structureImageBg: string`, `onChangeColor: (color: string) => void`, `theme: 'light' | 'dark'`
- Produces: `<PastelColorWheel />` component rendered inside `SettingsModal` under Theme & Appearance.

- [ ] **Step 1: Create `src/components/PastelColorWheel.tsx`**

Create `src/components/PastelColorWheel.tsx` with:
- Canvas circular color wheel (140×140px or responsive) rendering HSL hues with clamped lightness (94%) and saturation (50–75%).
- Center radial white blend for delicate tinting.
- Drag and click listeners mapping angle to hue ($0^\circ–360^\circ$) and radius to saturation.
- Preset chips with swatch dots:
  - **Lavender**: `hsl(286, 55%, 94%)` (Default)
  - **Baby Blue**: `hsl(204, 88%, 94%)`
  - **Light Yellow**: `hsl(54, 92%, 88%)`
  - **Soft Mint**: `hsl(142, 72%, 93%)`
  - **Classic White**: `#ffffff`
- Reset to Default button.
- Mini structure preview box showing sample molecule (Aspirin) with current theme bonds on the selected tint.

- [ ] **Step 2: Integrate `PastelColorWheel` into `SettingsModal.tsx`**

In [src/components/SettingsModal.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/SettingsModal.tsx):
- Add `structureImageBg?: string` and `onUpdateStructureImageBg?: (color: string) => void` to `SettingsModalProps`.
- Render a new section "Structure Image Background" under Theme & Appearance.
- Show an informative caption: *"Customizes the background tint of chemical structure canvases in light mode. Dark mode automatically uses dark slate."*

- [ ] **Step 3: Pass props from `App.tsx` into `SettingsModal`**

In [src/App.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/App.tsx#L1725):
- Pass `structureImageBg={structureImageBg}` and `onUpdateStructureImageBg={handleUpdateStructureImageBg}` to `<SettingsModal />`.

- [ ] **Step 4: Run TypeScript lint check**

Run: `npm run lint`  
Expected: 0 errors across `PastelColorWheel.tsx`, `SettingsModal.tsx`, and `App.tsx`.

---

### Task 4: Connect `--structure-canvas-bg` to Structure Card Slots Across Application

**Files:**
- Modify: `src/components/ReviewDeck.tsx:286`
- Modify: `src/App.tsx:287`
- Modify: `src/components/DocumentQuestionItem.tsx:848, 952`
- Modify: `src/components/StructureComparator.tsx:1598`
- Modify: `src/components/InteractiveStructureViewer.tsx:90-100`

**Interfaces:**
- Consumes: CSS custom property `--structure-canvas-bg`
- Produces: Targeted background tint for structure viewports in light mode and `#0f172a` in dark mode.

- [ ] **Step 1: Update `ReviewDeck.tsx` structure slot**

In [src/components/ReviewDeck.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/ReviewDeck.tsx#L286):
Replace:
```tsx
<div className="w-[160px] h-[160px] bg-white rounded-md flex items-center justify-center overflow-hidden border border-slate-200/60 dark:border-slate-700/50">
```
With:
```tsx
<div 
  className="w-[160px] h-[160px] rounded-md flex items-center justify-center overflow-hidden border border-slate-200/60 dark:border-slate-700/50 dark:bg-slate-900"
  style={{ backgroundColor: 'var(--structure-canvas-bg, hsl(286, 55%, 94%))' }}
>
```

- [ ] **Step 2: Update `App.tsx` horizontal structure vignette slot**

In [src/App.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/App.tsx#L287):
Replace:
```tsx
<div className="flex-shrink-0 w-24 h-24 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden">
```
With:
```tsx
<div 
  className="flex-shrink-0 w-24 h-24 rounded border border-slate-200 dark:border-slate-800 dark:bg-slate-900 flex items-center justify-center overflow-hidden"
  style={{ backgroundColor: 'var(--structure-canvas-bg, hsl(286, 55%, 94%))' }}
>
```

- [ ] **Step 3: Update `DocumentQuestionItem.tsx` structure slots**

In [src/components/DocumentQuestionItem.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/DocumentQuestionItem.tsx#L848):
Replace `bg-white` on the question structure cards with `dark:bg-slate-900` and `style={{ backgroundColor: 'var(--structure-canvas-bg, hsl(286, 55%, 94%))' }}`.

- [ ] **Step 4: Update `StructureComparator.tsx` and `InteractiveStructureViewer.tsx`**

In [src/components/StructureComparator.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/StructureComparator.tsx#L1598):
Replace `bg-white` with `dark:bg-slate-900` and `style={{ backgroundColor: 'var(--structure-canvas-bg, hsl(286, 55%, 94%))' }}`.

In [src/components/InteractiveStructureViewer.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/InteractiveStructureViewer.tsx):
Wire the background of the viewer viewport to use `--structure-canvas-bg` in light mode and dark slate in dark mode.

- [ ] **Step 5: Run full project lint and production build**

Run: `npm run lint`  
Expected: 0 errors.

Run: `npm run build`  
Expected: Production build succeeds with 0 errors.