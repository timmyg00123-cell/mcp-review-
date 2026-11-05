# Design Document: Structure Rendering Polish & Pastel Canvas Tinting

**Date**: 2026-11-04  
**Status**: Ready for Approval  
**Topic**: Chemical structure stroke weight, double-bond separation, edge-to-edge scaling, soft Slate-600 palette, and customizable pastel background tint for structure image viewports.

---

## 1. Intent & Why
Chemical structures across review decks, vignettes, and question items were difficult to see clearly: bond lines were washed out, or when thickened, double bonds merged into solid bars and line corners appeared harsh, spiky, and overly dark. Furthermore, the harsh stark white image background behind molecules created clinical glare.

The intent is twofold:
1. **Publication-Quality Molecular Line Rendering**: Deliver clean ChemDraw-style legibility with clear daylight between double bonds (`multipleBondOffset: 0.24`), smooth rounded joints that eliminate miter spikes (`stroke-linejoin="round"`), soft Slate-600 lines (`#475569`), and edge-to-edge fill (`padding: 0.05`) within existing 160×160px card geometry.
2. **Soothing Structure Canvas Tinting with Pastel Color Wheel**: Replace the glaring white image canvas behind molecule lines with a soft pastel tint (defaulting to soft lavender `hsl(286, 55%, 94%)`), while keeping outer review cards, drug titles, action buttons, and layout frames clean and neutral. Provide an interactive pastel color wheel and quick chips in Settings for personalized aesthetics.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
- **Clear Double Bond Separation**: Set RDKit MinimalLib `multipleBondOffset: 0.24` so double bonds (carbonyls, esters, aromatic rings) always show clean daylight between parallel lines.
- **Balanced Line Weight**: Use `bondLineWidth: 1.30` for crisp structure clarity without crowding small rings.
- **Smooth Joins & Caps**: Ensure SVG stroke paths use `stroke-linecap="round"` and `stroke-linejoin="round"` to eliminate spiky miter vertices.
- **Gentle Color Tone**: Replace stark jet-black in light mode with a soft, refined Slate-600 (`#475569`) for all bond strokes and atom text fills.
- **Edge-to-Edge Fill**: Set RDKit canvas `padding: 0.05` to maximize molecule presence within the existing 160×160px card geometry.
- **Targeted Image Canvas Tinting**: Tint *only the white image area directly behind the molecule* (the inner viewport), leaving outer card containers, titles, badges, and action buttons neutral.
- **Default Pastel Tone**: Out-of-the-box default set to user-selected soft lavender `hsl(286, 55%, 94%)`.
- **Interactive Pastel Wheel in Settings**: Add a canvas-based pastel color wheel (clamped to high lightness ~94–96% and gentle saturation ~40–75%) plus quick preset chips (Lavender, Baby Blue, Light Yellow, Soft Mint, Classic White) in `SettingsModal.tsx` under Theme & Appearance.
- **Persistence & Theme Resilience**: Persist the selected color in `localStorage` under `mcp_structure_image_bg`. In dark mode, structure viewports automatically preserve dark slate (`#0f172a` / `dark:bg-slate-900`) to avoid bright glare.

### Non-Goals
- Resizing outer card containers from 160×160px or altering review deck / studio grid layouts.
- Tinting the entire review card, modal, or page background (the pastel color applies strictly to the structure image canvas).
- Modifying pharmacophore highlight colors (SMARTS matches remain vibrant red, green, blue, etc.).

### Anti-Goals
- Thick bond strokes (>1.6px) that cause double bonds to bleed into solid black bars.
- Harsh, inky jet-black (`#000000` / `#020617`) lines that overpower card whitespace.
- Sharp, needle-like miter vertices on aromatic rings.
- Saturated or garish background colors that reduce chemical structure contrast.

---

## 3. Architecture & Data Flow

### 3.1 CSS Custom Property & Theme Integration
1. Define `--structure-canvas-bg` on `:root` initialized from `localStorage` (default: `hsl(286, 55%, 94%)`).
2. In dark mode (`.dark`), `--structure-canvas-bg` resolves to `#0f172a` (Slate-900), or components apply `dark:bg-slate-900` over the light pastel background.
3. Structure image viewport wrappers across the app use:
   ```tsx
   style={{ backgroundColor: 'var(--structure-canvas-bg, hsl(286, 55%, 94%))' }}
   className="... dark:bg-slate-900"
   ```

### 3.2 SmilesCanvas SVG Transparency
In [src/components/SmilesCanvas.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/SmilesCanvas.tsx):
- Ensure RDKit's solid white background `<rect>` is stripped so the SVG is transparent:
  ```ts
  cleanSvg = rawSvg
    .replace(/<rect[^>]*style=['"][^'"]*fill:\s*#ffffff[^'"]*['"][^>]*>[\s\S]*?<\/rect>/gi, '')
    .replace(/<rect[^>]*fill=['"]#ffffff['"][^>]*\/?>/gi, '');
  ```
- In `postProcessSvg`:
  - Replace `#000000` strokes and fills with `#475569` (Slate-600) in light mode.
  - Inject `stroke-linecap="round"` and `stroke-linejoin="round"` into all `<path>` elements with strokes.
- In `drawMolecule()`:
  - Pass `bondLineWidth: 1.30`, `multipleBondOffset: 0.24`, `padding: 0.05`, and `clearBackground: true` to RDKit's drawing details.

### 3.3 Storage Utilities
In [src/utils/storage.ts](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/utils/storage.ts):
- Add `STRUCTURE_IMAGE_BG_KEY = 'mcp_structure_image_bg'`
- Add `DEFAULT_STRUCTURE_IMAGE_BG = 'hsl(286, 55%, 94%)'`
- Add `getInitialStructureImageBg(): string`
- Add `saveStructureImageBg(color: string): void`

### 3.4 Settings Modal UI
In [src/components/SettingsModal.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/SettingsModal.tsx):
- Add a new "Structure Image Background" control in Section 1 (Theme & Appearance):
  - Canvas-based circular pastel wheel with crosshair cursor and click/drag support.
  - Active color display and reset-to-default button.
  - Preset chips:
    - **Lavender** (`hsl(286, 55%, 94%)` — Default)
    - **Baby Blue** (`hsl(204, 88%, 94%)` / `#e0f2fe`)
    - **Light Yellow** (`hsl(54, 92%, 88%)` / `#fef9c3`)
    - **Soft Mint** (`hsl(142, 72%, 93%)` / `#dcfce7`)
    - **Classic White** (`#ffffff`)
  - Mini live structure preview showing a sample molecule on the chosen tint.

### 3.5 Target Image Viewports
Apply `var(--structure-canvas-bg)` to:
- [src/components/ReviewDeck.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/ReviewDeck.tsx#L286): Review deck structure slots (`w-[160px] h-[160px]`).
- [src/App.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/App.tsx#L287): Horizontal structure vignette slots.
- [src/components/DocumentQuestionItem.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/DocumentQuestionItem.tsx#L848): Question item structure slots.
- [src/components/StructureComparator.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/StructureComparator.tsx#L1598): Dual structure comparator slots.
- [src/components/InteractiveStructureViewer.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/InteractiveStructureViewer.tsx): Zoom/pan structure canvas.

---

## 4. Parts Decided by User
- **Palette**: Soft Slate-600 (`#475569`) in light mode.
- **Double Bond Spacing**: Wide offset (`0.24`) to guarantee white space between parallel lines.
- **Stroke Weight**: Moderated 1.30px stroke with rounded caps and joins.
- **Layout**: Strictly in-place within current 160×160px card slots.
- **Background Target**: Only the white area of the image directly behind the molecule.
- **Default Tint Color**: Soft Lavender (`hsl(286, 55%, 94%)`).
- **Settings Picker**: Pastel color wheel + quick preset chips.

---

## 5. Verification Plan
1. **Automated Verification**:
   - `scratch/verify_smiles_canvas.cjs`: Asserts drawing details, SVG stroke replacements, round linecaps, and `<rect>` background stripping.
   - `npm run lint`: Verifies zero TypeScript / ESLint errors across modified files.
   - `npm run build`: Verifies clean Vite production compilation.
2. **Visual Verification**:
   - Verify that clicking/dragging the pastel color wheel in Settings updates `--structure-canvas-bg` and changes the background of all structure slots.
   - Verify that toggling between Light and Dark mode switches smoothly between the pastel background and dark slate `#0f172a`.
   - Verify that double bonds on Aspirin, Imatinib, and Atorvastatin show clean white daylight between lines.