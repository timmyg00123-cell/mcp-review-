# Structure Rendering Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish 2D chemical structure rendering in `SmilesCanvas` to provide clear daylight between double bonds (`multipleBondOffset: 0.24`), smooth rounded joins and caps, soft Slate-600 palette (`#475569`), and edge-to-edge scaling (`padding: 0.05`) within existing card slots.

**Architecture:** Update RDKit MinimalLib drawing parameters in `SmilesCanvas.tsx` to set `bondLineWidth: 1.30`, `multipleBondOffset: 0.24`, and `padding: 0.05`. Enhance `postProcessSvg()` to replace light-mode strokes/fills with `#475569` and inject `stroke-linecap="round"` and `stroke-linejoin="round"` into SVG path elements, preserving dark mode and pharmacophore highlight overlays.

**Tech Stack:** React 19, TypeScript, RDKit MinimalLib (WASM), Vite 8, Tailwind CSS v4.

**Spec:** [docs/superpowers/specs/2026-11-03-structure-rendering-polish-design.md](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/docs/superpowers/specs/2026-11-03-structure-rendering-polish-design.md)

## Global Constraints
- `bondLineWidth` must be set to `1.30` in the RDKit drawing details object.
- `multipleBondOffset` must be set to `0.24` in the RDKit drawing details object.
- `padding` must be set to `0.05` in the RDKit drawing details object.
- Light-mode stroke and fill replacement must map `#000000` to `#475569` (Slate-600).
- All stroke paths in generated SVGs must receive `stroke-linecap="round"` and `stroke-linejoin="round"`.
- Must not alter existing card container dimensions (160×160px slots in `ReviewDeck`, `App`, and question cards remain unchanged).
- TypeScript check (`npm run lint`) and production build (`npm run build`) must pass with zero errors.

## Review Focus
1. **Double bonds merging into bars**: Verify that carbonyl (`C=O`), ester, and aromatic double bonds have distinct white space between the two parallel lines.
2. **Spiky miter vertices**: Verify that ring corners (e.g. benzene, pyridine, piperazine) are smooth with rounded joins rather than needle-sharp points.
3. **Overly dark / harsh contrast**: Verify that lines render in soft Slate-600 (`#475569`) in light mode rather than jet-black (`#020617` / `#000000`).
4. **Dark mode legibility**: Verify that dark mode rendering remains clear with appropriate light stroke contrast without being overwritten by the light-mode Slate-600 replacement.
5. **Pharmacophore highlight compatibility**: Verify that SMARTS-based pharmacophore highlight colors (red, green, blue, amber) are preserved and not accidentally replaced by Slate-600.

---

### Task 1: Update RDKit Drawing Options & SVG Post-Processing in `SmilesCanvas.tsx`

**Files:**
- Modify: `src/components/SmilesCanvas.tsx:100-125, 340-365`
- Test: `scratch/verify_smiles_canvas.cjs`

**Interfaces:**
- Consumes: RDKit WASM MinimalLib `mol.get_svg_with_highlights(detailsJson)`
- Produces: Sanitized and styled SVG string with rounded line joins, `multipleBondOffset: 0.24`, `bondLineWidth: 1.30`, `padding: 0.05`, and `#475569` strokes in light mode.

- [ ] **Step 1: Write verification script to test SVG post-processing and drawing options**

Create `scratch/verify_smiles_canvas.cjs` that calls RDKit with the new details and post-processing logic to assert:
1. `details.bondLineWidth === 1.30`
2. `details.multipleBondOffset === 0.24`
3. `details.padding === 0.05`
4. Post-processed light-mode SVG contains `stroke: #475569` and `fill: #475569`
5. Post-processed SVG paths contain `stroke-linecap="round"` and `stroke-linejoin="round"`
6. Highlight colors (e.g. `#ef4444`) are preserved intact.

- [ ] **Step 2: Run verification script to confirm current code does not meet spec**

Run: `node scratch/verify_smiles_canvas.cjs`  
Expected: Script reports differences in bondLineWidth (1.15 vs 1.30), missing multipleBondOffset, missing round joins, and `#334155` instead of `#475569`.

- [ ] **Step 3: Update `SmilesCanvas.tsx`**

In [src/components/SmilesCanvas.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/SmilesCanvas.tsx):
1. In `postProcessSvg(svgString, currentTheme)`:
   - For light mode: replace `stroke: #000000` and `fill: #000000` with `#475569` (Slate-600).
   - Inject `stroke-linecap="round"` and `stroke-linejoin="round"` into `<path>` elements that have a `stroke:` attribute.
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

- [ ] **Step 5: Run TypeScript lint**

Run: `npm run lint`  
Expected: 0 errors.

---

### Task 2: Automated Verification & Production Build Check

**Files:**
- Modify: `src/components/SmilesCanvas.tsx` (if needed for any type refinements)

**Interfaces:**
- Consumes: Vite production build pipeline and TypeScript compiler.
- Produces: Clean production build artifacts in `dist/`.

- [ ] **Step 1: Run type checking**

Run: `npm run lint`  
Expected: Exit code 0, no diagnostic errors.

- [ ] **Step 2: Run production build**

Run: `npm run build`  
Expected: Exit code 0, successful Vite bundle generation.

---

### Task 3: Visual Smoke Test Across Platform Views

**Files:**
- Test inspection: [src/components/ReviewDeck.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/ReviewDeck.tsx), [src/App.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/App.tsx), [src/components/StructureComparator.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/StructureComparator.tsx), [src/components/DocumentQuestionItem.tsx](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/src/components/DocumentQuestionItem.tsx).

- [ ] **Step 1: Push a sidecar visual preview of the actual updated `SmilesCanvas` output**

Generate and serve a fresh visual companion screen rendering Aspirin, Ibuprofen, and Imatinib using the exact updated `SmilesCanvas` logic.

- [ ] **Step 2: Verify double bond daylight and soft slate color**

Inspect the rendered structures:
1. Carbonyl double bonds (`C=O`) have clean, visible white space between parallel lines.
2. Ring corners have smooth rounded vertices.
3. Slate-600 tone looks soft and professional against white cards.
4. Molecules scale edge-to-edge inside the 160×160px slots without overflow.
