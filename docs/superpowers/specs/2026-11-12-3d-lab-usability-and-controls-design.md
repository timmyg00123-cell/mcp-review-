# Design Spec: 3D Lab Usability, Full-Screen Canvas, Ligand-First Controls & Guided Tutorial

**Date:** 2026-11-12  
**Topic:** 3D Lab Usability, Programmatic Scene Controls, Fullscreen Canvas & Educational Tutorial  
**Location:** `docs/superpowers/specs/2026-11-12-3d-lab-usability-and-controls-design.md`  

---

## 1. Intent and Why
The 3D Lab Library workspace introduced in the previous iteration provided an essential connection between 2D chemical structures, PDB co-crystal complexes, and ChEMBL quantitative SAR metrics ($K_i, IC_{50}$). However, student usability feedback highlighted three critical obstacles:
1. **Constrained Viewing Area:** The default 3-column split (`col-span-3`, `col-span-6`, `col-span-3`) left the 3D canvas cramped and difficult to inspect on standard student laptops.
2. **Macromolecular Visual Clutter:** Standard PDB files load with massive protein ribbon backbones and thousands of atoms, burying the small-molecule drug. Students primarily need to see the drug's 3D conformation first, and then selectively bring in the receptor binding pocket.
3. **Absence of Pedagogical Orientation:** Students lacked intuitive orientation on mouse navigation, what physical interactions to identify (H-bonds, salt bridges, $\pi$-stacking), and how those 3D pocket contacts explain the nanomolar affinities shown in the ChEMBL table.

This design upgrades the 3D Lab into an intuitive, ligand-first pedagogical studio with direct one-click scene toggles, an obvious full-screen viewing experience with slide-out drawers, and an integrated medicinal chemistry tutorial.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **Ligand-First Default:** When any co-crystal target complex loads, the protein ribbon, nucleic acids, and solvent (water) are hidden by default; the active small-molecule ligand is rendered in vivid ball-and-stick and centered automatically.
- **Direct One-Click Scene Toggles:** Header buttons directly manipulate the 3D scene without page or iframe reloads:
  - `Isolate Ligand`: Centers and highlights the drug molecule alone.
  - `Binding Pocket (5Å)`: Renders all amino acid residues within $5.0\text{ \AA}$ in stick representation with element coloring.
  - `Toggle Protein Ribbon`: Toggles secondary structure cartoon on/off for spatial orientation.
  - `Show Hydrogen Bonds`: Renders dashed vector lines for polar contacts between ligand atoms and binding pocket residues.
- **Obvious Full-Screen Mode with Slide-Out Drawers:**
  - High-contrast, prominent "Full Screen" button (`Maximize2`).
  - When expanded (`fixed inset-0 z-50`), the canvas occupies 100% of the viewport.
  - Targets and ChEMBL SAR remain accessible via subtle floating drawer tabs on the left and right margins that glide in and out on demand.
- **Pre-Fullscreen Layout Enhancement:** Default view expands to meet margins and uses a cleaner, less-cramped panel arrangement.
- **Pedagogical Tutorial ("How to Use & What to Look For"):** An interactive visual guide explaining camera controls, what physical pharmacophore interactions to look for, and how pocket contacts correlate with $K_i / IC_{50}$ values.

### Non-Goals
- Real-time molecular dynamics (MD) simulations or energy minimization calculations inside the client browser.
- De novo ligand docking or grid generation.
- Replacing the 2D flashcard decks or review matrix.

### Anti-Goals
- Trapping the student in full-screen mode without obvious, multi-modal exit paths (`Escape` key, floating close button).
- Reloading the canvas or making external network roundtrips when the student clicks display toggles (toggles must respond in `< 50\text{ ms}`).
- Requiring students to navigate dense, multi-tiered 3D software menus just to hide the protein backbone.

---

## 3. Constraints
- **Client-Side Only:** Must run 100% in the browser and be deployable to static hosts (Vercel) without custom backend rendering servers.
- **Browser Compatibility:** Works across modern browsers (Chrome, Edge, Firefox, Safari) using WebGL.
- **Zero Cross-Origin Blockers:** Because external iframes block direct DOM/WebGL manipulation from parent frames, the 3D viewer must be directly scriptable using an embedded WebGL engine (`3Dmol.js`).
- **Resilient Fallbacks:** If a specific PDB entry fails to load in 3Dmol, provide an instant fallback link to RCSB PDB structure viewer and direct CIF coordinate download.

---

## 4. Approaches Considered

### Approach 1: Integrated 3Dmol.js WebGL Engine *(Selected)*
Embed a dedicated, lightweight WebGL molecular graphics engine (`3Dmol.js`) within the React canvas container. Load coordinate files directly via `https://files.rcsb.org/download/{pdbId}.pdb` (or mmCIF), and control the scene programmatically with zero latency.
- *Pros:* Complete programmatic control over atom selections, colors, pocket radii, H-bonds, and camera zooms; zero cross-origin friction; light footprint (~400KB); instant response on toggle buttons.
- *Cons:* Requires managing the 3Dmol instance lifecycle in React (`useEffect`, cleanup on unmount/PDB switch).

### Approach 2: Programmatic Mol* Plugin (`pdbe-molstar`)
Embed the full PDBe-Mol* web component and control its state tree.
- *Trade-off:* Rich features (surfaces, electron density), but >3MB bundle size and heavier CPU/GPU overhead on student laptops.

### Approach 3: Enhanced RCSB Iframe with Assisted Guide Overlays
Keep the current RCSB iframe and attempt to guide students via tooltips to click RCSB's internal menus.
- *Trade-off:* Rejected because cross-origin iframes prevent automated ligand-first initialization and direct one-click header buttons.

---

## 5. Detailed Specification of the Chosen Approach

### A. 3D WebGL Engine Integration & Smart Ligand Detection (`ThreeDLabLibrary.tsx`)
1. **Engine Initialization:**
   - Embed `3Dmol.js` within a responsive canvas `div` container.
   - On PDB ID load, fetch structure coordinates from `https://files.rcsb.org/download/${activePdbId}.pdb` (with mmCIF fallback).
2. **Robust Ligand Identification Strategy (Builder Decision):**
   - Curated curricular targets (`CANONICAL_MEDCHEM_TARGETS`) specify their explicit primary ligand 3-letter code (`ligandCode`, e.g. `AZD` for 4NTJ P2Y12, `1N4` for 1O86 ACE, `4Z9` for 4Z9O AT1, `1HW` for 1HWK HMGCR).
   - For custom or unknown PDBs, an automated exclusion filter ignores common solvent and crystallization additives:
     `const EXCLUDED_HETERO = ['HOH', 'WAT', 'CLR', 'SO4', 'PO4', 'MG', 'ZN', 'NA', 'CL', 'GOL', 'EDO', 'PEG', 'DMS', 'ACT', 'BMA', 'NAG'];`
     The engine selects the largest connected organic hetero residue.
   - **Apo Protein Graceful Fallback:** If no small-molecule ligand is found in the structure, the engine automatically leaves the protein ribbon visible so the canvas is never blank.
3. **Default Ligand-First Scene State:**
   ```js
   // Hide protein backbone and solvent
   viewer.setStyle({ protein: true }, {});
   viewer.setStyle({ resn: 'HOH' }, {});
   
   // Isolate small-molecule drug ligand
   viewer.setStyle(ligandSelector, {
     stick: { colorscheme: 'cyanCarbon', radius: 0.25 }
   });
   
   // Center and zoom camera directly on ligand
   viewer.zoomTo(ligandSelector);
   viewer.render();
   ```

### B. One-Click Canvas Header Controls
A persistent control bar above the 3D canvas featuring clear, distinct controls:
- **`Isolate Ligand` (Action / Reset Button):**
  - Resets all additive layer toggles to `false` (`showPocket = false`, `showRibbon = false`, `showHBonds = false`).
  - Clears all pocket and ribbon representations, re-styles the ligand, and re-centers the camera on the drug.
- **`Binding Pocket (5Å)` (Additive Toggle):**
  - When enabled: Renders all receptor amino acid residues within $5.0\text{ \AA}$ of the ligand as sticks with standard element coloring (carbon grey, nitrogen blue, oxygen red, sulfur yellow) plus residue labels (e.g. `Asp184`, `Lys53`).
  - When disabled: Removes pocket residue sticks.
- **`Toggle Protein Ribbon` (Additive Toggle):**
  - When enabled: Applies secondary structure cartoon `{ cartoon: { color: 'spectrum', opacity: 0.6 } }` to `{ protein: true }`.
  - When disabled: Sets protein representation to empty `{}`.
- **`Hydrogen Bonds` (Additive Toggle):**
  - When enabled: Computes polar donor/acceptor contact pairs between ligand and pocket residues ($\le 3.2\text{ \AA}$) and renders dashed interaction cylinders (`{ dashed: true, color: '#FACC15', radius: 0.08 }`).
  - When disabled: Removes H-bond cylinders.
- **`Recenter Camera` (Action Button):** Re-centers the view on the current active selection.

### C. Responsive Layout, Pre-Fullscreen Polish & Obvious Full-Screen Mode
1. **Pre-Fullscreen Layout Enhancement:**
   - In `App.tsx`, the `'3d-lab'` tab view is unconstrained by `max-w-7xl`, allowing the 3D lab to expand to the full browser window width (`w-full px-4`).
   - The left Target Selector panel and right ChEMBL SAR panel feature **collapsible toggle arrows** (`Collapse / Expand Sidebars`) in regular mode. Students can collapse either sidebar to give the 3D canvas up to 100% of the normal screen width.
   - The canvas header features a high-contrast, prominent **"Full Screen"** button styled with a glowing cyan accent border and `Maximize2` icon so it is immediately noticeable as the primary way to explore.
2. **Full-Screen Mode Experience:**
   - Container smoothly switches to `fixed inset-0 z-50 bg-slate-950 w-screen h-screen flex flex-col`.
   - Viewer canvas expands to 100% of the viewport.
   - Multi-modal exit: `Escape` key, or clicking the prominent top-right `"Exit Full Screen"` button (`Minimize2`).
3. **Subtle Slide-Out Drawers in Full-Screen:**
   - **Left Edge Drawer Tab:** Floating vertical tab labeled `"Targets & Drugs"` with `ChevronRight`. Clicking slides out the Curricular Targets selector and custom PDB search over the left edge of the canvas.
   - **Right Edge Drawer Tab:** Floating vertical tab labeled `"ChEMBL SAR"` with `ChevronLeft`. Clicking slides out the ChEMBL binding affinity panel ($K_i, IC_{50}, pChEMBL$) over the right edge of the canvas.
   - Clicking outside or clicking the close button smoothly retracts the drawer, preserving uninterrupted 3D viewing.

### D. Educational Tutorial Modal ("How to Use & What to Look For")
Accessible via a prominent `"Tutorial & Guide"` button (`HelpCircle` icon) in the canvas header. A clean, 4-step modal:
1. **Step 1: Mouse & Touch Navigation**
   - Left-click drag: Rotate structure in 3D.
   - Right-click drag (or Shift + Left-drag): Pan camera.
   - Scroll wheel / pinch: Zoom in and out.
   - Click any atom: Re-center rotation pivot.
2. **Step 2: Inspecting the Drug Ligand**
   - Notice the conformation of the drug.
   - Identify core scaffolds, functional groups, and chiral centers.
3. **Step 3: What to Look For in the Binding Pocket**
   - Click *"Binding Pocket (5Å)"* and *"Hydrogen Bonds"*.
   - Key interactions:
     - *Hydrogen Bonds:* Directional polar interactions (dashed yellow lines).
     - *Ionic Salt Bridges:* Positively charged basic groups (amines) paired with Asp/Glu carboxylates.
     - *Aromatic $\pi-\pi$ Stacking:* Rings lining up with Phe, Tyr, Trp side chains.
     - *Hydrophobic Pockets:* Lipophilic groups nestled into Leu, Ile, Val clefts.
4. **Step 4: Connecting 3D Contacts to ChEMBL SAR Potency**
   - How tighter steric fit and more optimal non-covalent bonds produce higher affinity:
     - Lower $K_i$ and $IC_{50}$ values (nanomolar or picomolar).
     - Higher $pChEMBL$ ($-\log_{10}[\text{Molar}]$; e.g. $8.0 = 10\text{ nM}$, $9.0 = 1\text{ nM}$).
   - How modifications that clash or lose polar bonds cause loss of potency.

---

## 6. What's Left to the Builder
- Precise Tailwind transition timing for drawer slide-ins (e.g. `transition-transform duration-300 ease-in-out`).
- Fine-tuning residue label formatting and H-bond detection distance tolerance ($3.0 - 3.4\text{ \AA}$).
- Fallback link behavior when offline or when a non-standard custom PDB code is loaded.
