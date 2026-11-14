# Single-Ligand Isolation & Multi-Pocket Configuration 3D Lab Design

**Date:** 2026-11-13  
**Scope:** Small change (focused enhancement across `structure3dService.ts`, `structure3d.ts`, `canonicalPharmacophorePkData.ts`, and `ThreeDLabCanvas.tsx`)

---

## 1. Intent & Why
Students using the 3D Molecular Lab need to immediately see **one drug ligand molecule** and understand **how its functional groups configure and react inside one or more receptor binding sub-pockets**. Currently:
1. Setting `het: true` in Mol* renders all crystallographic `HETATM` additives (lipids, detergents, glycans, buffer ions) and duplicate ligand copies across multimeric protein chains.
2. Selecting by `chem_comp_id` alone zooms the camera out across all chains of multimers (e.g., 4 statin copies in `1HWK` or 4 celecoxib copies in `3LN1`) instead of focusing on a single active site.
3. Passing a solid RGB `color` to `viewer.visual.select` overpaints every atom in the ligand and pocket one flat color, wiping out CPK element colors (red Oxygen, blue Nitrogen, yellow Sulfur, green Chlorine/Fluorine) and blending into the protein ribbon.

---

## 2. Goals, Non-Goals & Anti-Goals
- **Goals:**
  - Isolate **one single ligand instance** (`auth_asym_id` + `auth_seq_id` + `label_comp_id`, preferring Chain A) and hide all crystallographic lipid/buffer/detergent clutter and duplicate symmetry copies (`het: false`, `carbs: false`, `water: false`).
  - Preserve **true CPK element coloring** (`element-symbol`) on all reactive heteroatoms (O, N, S, P, F, Cl, Zn/Mg) by applying custom colors exclusively to Carbon skeletons (`type_symbol: 'C'`).
  - Mute the background protein cartoon ribbon into a subtle translucent slate scaffold (`#64748b`, opacity `0.28`) so the colorful ligand and binding sub-pockets stand out in high contrast.
  - Combine **Approach 1 (Active-Site CPK + Pocket Roles on Load)** and **Approach 2 (Color-Matched Sub-Pocket "Puzzle-Piece" Zones)**:
    - Enable Pocket Sticks ($5\,\text{\AA}$) and 3D Non-Covalent Interactions (`interactivityFocus` dashed H-bonds, salt bridges, $\pi$-stacking, coordination) **by default on load** when a ligand is present.
    - Color-match each pharmacophore group's carbons on the ligand with its partner sub-pocket residue carbons (while keeping N/O/S/Cl in CPK colors), with a toolbar toggle to switch between **Sub-Pocket Zone Colors** (default) and **Unified Cyan Carbon CPK**.
    - When clicking a Pharmacophore / Sub-Pocket chip, focus the camera on **both** the ligand moiety atoms and its paired binding sub-pocket residues simultaneously.
- **Non-Goals:**
  - Replacing the Mol* WebGL engine or removing the 2D Pocket Schematic fallback view.
- **Anti-Goals:**
  - Never overpaint heteroatoms (O, N, S, Halogens) with a flat uniform color.
  - Never display multiple copies of the drug across different chains or non-catalytic crystallization additives.

---

## 3. Approaches Considered
1. **Approach 1: Single-Instance Active Site + True CPK Element Coloring + Sub-Pocket Role Colors:** Isolates one ligand instance (`het: false`), preserves CPK heteroatom colors (`type_symbol: 'C'`), mutes the protein ribbon, and turns on pocket sticks + 3D interaction lines by default.
2. **Approach 2: Color-Matched Sub-Pocket Zones ("Puzzle-Piece" View):** Pairs each pharmacophore moiety's carbon color on the single ligand with the matching sub-pocket residues it docks into, and zooms into the combined ligand-moiety + sub-pocket residue pair when selected.
3. **Approach 3: PDBe `ligandView` Cropped Micro-Environment:** Discards the protein outside $5\,\text{\AA}$. Rejected because it strips out the receptor fold and cavity surface completely.

**Decision:** Combine **Approach 1 + Approach 2** as chosen by the user.

---

## 4. Technical Design

### A. Single-Ligand Instance Resolution (`src/services/structure3dService.ts`)
- Extend `DetectedLigandInfo`:
  ```ts
  export interface DetectedLigandInfo {
    resn: string;
    atomCount: number;
    chain?: string;
    resi?: number;
    instanceCount?: number;
    catalyticMetals?: { resn: string; chain: string; resi: number }[];
    description?: string;
  }
  ```
- Update `identifyLigandResidue(pdbData, preferredLigandCode)`:
  - Parse `HETATM` records grouped by `(resn, chain, resi)` instance.
  - Filter out `EXCLUDED_HETERO_RESIDUES` (expanded to include common crystallization detergents, PEGs, sugars, and lipids).
  - Select the primary ligand code (`preferredLigandCode` / alias or largest atom count per single residue instance).
  - Among instances of that ligand, pick the primary active-site instance (preferring Chain `'A'`, or the first chain in file order) so `atomCount` reflects **one molecule**, and populate `chain` (`auth_asym_id`), `resi` (`auth_seq_id`), and `instanceCount`.
  - Detect any nearby catalytic metal cofactor (e.g., `ZN` or `MG` within $5.0\,\text{\AA}$ of the selected ligand instance's coordinates) and attach it to `catalyticMetals` so metalloenzyme active sites (like ACE `1O86`) render their catalytic metal ion alongside the single ligand.

### B. Sub-Pocket Pairing (`src/types/structure3d.ts` & `src/data/canonicalPharmacophorePkData.ts`)
- Add optional `subPocketName?: string`, `pharmacophoreGroupId?: string`, and `colorAccent?: string` to `KeyPocketResidueContact`.
- Map each target's `keyPocketResidues` to its corresponding pharmacophore group and sub-pocket label/color (or fallback by `interactionType`:
  - `covalent` / `coordination`: Coral Red `#ef4444`
  - `ionic`: Violet `#8b5cf6`
  - `hydrogen-bond`: Amber `#f59e0b`
  - `pi-stacking` / `hydrophobic`: Blue `#3b82f6` / Emerald `#10b981`).

### C. Mol* Scene Rendering (`src/components/ThreeDLabCanvas.tsx`)
1. **Hide Global Hetero Clutter:**
   - Pass `hideStructure: ['het', 'water', 'carbs', 'nonStandard']` in `molstarOptions` (when a ligand is detected) and call `viewer.visual.visibility({ polymer: ribbonActive, het: false, water: false, carbs: false, nonStandard: false })`.
2. **Default Active-Site View on Load:**
   - Default `showPocket = true`, `showHBonds = true`, `showRibbon = true`, and `subPocketColorMode = true` when a ligand is detected.
3. **True CPK + Sub-Pocket Carbon Overpainting in `viewer.visual.select`:**
   - Set `nonSelectedColor: { r: 100, g: 116, b: 139 }` (slate) and `nonSelectedOpacity: pocketActive ? 0.28 : 0.75` so the background protein ribbon is a soft, translucent scaffold.
   - Add the **single ligand instance** (`auth_asym_id: ligand.chain, auth_seq_id: ligand.resi, label_comp_id: ligand.resn`) with `representation: 'ball-and-stick'`, `color: null` (preserving native Mol* CPK element colors for N, O, S, P, F, Cl).
   - Color ligand Carbons (`type_symbol: 'C'`):
     - In **Sub-Pocket Zone Mode** (default when `medChemProfile` exists): color each pharmacophore group's carbon atoms (`atoms: group.atomNames, type_symbol: 'C'`) with `group.colorAccent`, and remaining ligand carbons with cyan (`#06b6d4`).
     - In **Unified CPK Mode** (or when no profile exists): color all ligand carbons (`type_symbol: 'C'`) with cyan (`#06b6d4`).
   - Add **Pocket Residues** (`keyPocketResidues`) with `auth_asym_id: residue.chain || ligand.chain || 'A'`, `auth_seq_id: residue.resi`, `representation: 'ball-and-stick'`, `color: null` (preserving blue N, red O, yellow S on amino acid side-chains), plus a carbon-only overpaint (`type_symbol: 'C'`) in the residue's matched sub-pocket `colorAccent`!
   - When `showPocketSurface` is active, add a translucent `'gaussian-surface'` (`representationOpacity: 0.28`) around the key pocket residues.
4. **Live 3D Non-Covalent Interactions & Paired Sub-Pocket Focus:**
   - When `showHBonds` or `showPocket` is active, invoke `viewer.visual.interactivityFocus({ data: [{ auth_asym_id: ligand.chain, auth_seq_id: ligand.resi, label_comp_id: ligand.resn }] })` so Mol* renders the $5\,\text{\AA}$ pocket surroundings and dashed 3D non-covalent interaction contacts.
   - Attach `viewer.visual.tooltips` for the ligand and each key pocket residue (`label`, `interactionType`, `subPocketName`).
   - When a user clicks a **Pharmacophore / Sub-Pocket chip**, focus the camera on **both** the ligand's pharmacophore atoms AND the paired pocket residue(s) that interact with that moiety, highlighting their sub-pocket configuration.
