# Single-Ligand Isolation & Multi-Pocket Configuration 3D Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Isolate a single bound drug ligand instance in the 3D Molecular Lab (hiding all crystallographic additive clutter and duplicate symmetry copies), preserve true CPK heteroatom element colors (`type_symbol: 'C'`), mute the background protein ribbon into a translucent scaffold, and render color-matched binding sub-pockets with live 3D non-covalent interaction contacts on load.

**Architecture:** `identifyLigandResidue` in `structure3dService.ts` is upgraded to group `HETATM` records by `(resn, chain, resi)` instance, selecting a single active-site ligand instance (preferring Chain A) plus any adjacent catalytic metal ions (`ZN`, `MG` within $5.0\,\text{\AA}$). `canonicalPharmacophorePkData.ts` pairs each `KeyPocketResidueContact` with its partner pharmacophore group and sub-pocket color/name. `ThreeDLabCanvas.tsx` disables global `het`/`carbs`/`water` visibility, renders only the pinned ligand instance and its sub-pocket residues in `ball-and-stick` with `color: null` (for native CPK heteroatoms) and `type_symbol: 'C'` carbon overpaints, activates $5\,\text{\AA}$ pocket sticks and `interactivityFocus` non-covalent interaction lines by default, and focuses both the ligand moiety and paired pocket residues when a pharmacophore/sub-pocket chip is selected.

**Tech Stack:** React 19, TypeScript 7, PDBe-Mol* (`pdbe-molstar@3.12.0`), Node.js `assert` & `node:test` via `tsx`.

**Spec:** `docs/superpowers/specs/2026-11-13-single-ligand-multi-pocket-3d-lab-design.md`

## Global Constraints

- Isolate **one single ligand instance** (`auth_asym_id` + `auth_seq_id` + `label_comp_id`, preferring Chain A) and hide all crystallographic lipid/buffer/detergent clutter and duplicate symmetry copies (`het: false`, `carbs: false`, `water: false`).
- Preserve **true CPK element coloring** (`element-symbol`) on all reactive heteroatoms (O, N, S, P, F, Cl, Zn/Mg) by applying custom colors exclusively to Carbon skeletons (`type_symbol: 'C'`) with `color: null` on the base representation.
- Mute the background protein cartoon ribbon into a subtle translucent slate scaffold (`#64748b`, opacity `0.28` when pocket mode is active).
- Enable Pocket Sticks ($5\,\text{\AA}$) and 3D Non-Covalent Interactions (`interactivityFocus`) **by default on load** when a ligand is present.
- Maintain 100% backward compatibility with all existing test suites (`tests/structure3dService.test.ts`, `tests/threeDLabCanvas.test.ts`, `tests/threeDLabMolstarCanvas.test.ts`, `tests/threeDLabCanvasControls.test.ts`, `tests/canonicalPharmacophorePkData.test.ts`).

## Review Focus

1. **Multimeric PDB files with identical ligand copies across chains (`1HWK` chains A–D, `3LN1` chains A–D):** `identifyLigandResidue` must return the atom count of a *single* residue instance (not summed across all 4 chains), populate `chain: 'A'`, `resi`, and `instanceCount: 4`.
2. **Metalloenzyme active sites (`1O86` ACE with catalytic $\text{Zn}^{2+}$):** Because `ZN` is in `EXCLUDED_HETERO_RESIDUES` and global `het: false` hides default hetero groups, `identifyLigandResidue` must detect `ZN`/`MG` atoms within $5.0\,\text{\AA}$ of the selected ligand instance and return them in `catalyticMetals` so the catalytic metal cofactor is explicitly rendered in the pocket.
3. **PDB lines with short/malformed columns or missing chain IDs:** `identifyLigandResidue` must safely fallback to chain `'A'` and `resi: 1` without throwing `NaN` or out-of-bounds substring errors when parsing legacy/minimal mock `HETATM` lines in unit tests.
4. **CPK heteroatom preservation during `viewer.visual.select`:** Base `ball-and-stick` selection items must specify `color: null` (and omit `representationColor` on the all-atom entry) while supplying a separate `type_symbol: 'C'` entry with `representationColor`, ensuring PDBe-Mol* does not overpaint O, N, S, Cl, or F atoms with a flat color.
5. **Apo protein fallback (`detectedLigand === null`):** When no ligand is detected, `ThreeDLabCanvas` must keep `showRibbon = true`, `showPocket = false`, `showHBonds = false`, and `nonSelectedOpacity = 1.0` so the apo receptor fold remains clearly visible.

---

### Task 1: Single-Instance Ligand Pinning & Catalytic Metal Detection in `structure3dService.ts`

**Files:**
- Modify: `src/services/structure3dService.ts:8-148`
- Test: `tests/structure3dService.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface CatalyticMetalInfo {
    resn: string;
    chain: string;
    resi: number;
  }

  export interface DetectedLigandInfo {
    resn: string;
    atomCount: number;
    chain?: string;
    resi?: number;
    instanceCount?: number;
    catalyticMetals?: CatalyticMetalInfo[];
    description?: string;
  }

  export function identifyLigandResidue(
    pdbData: string,
    preferredLigandCode?: string
  ): DetectedLigandInfo | null;
  ```

- [ ] **Step 1: Add failing tests for single-instance ligand pinning, multimeric chain deduplication, and catalytic metal proximity in `tests/structure3dService.test.ts`**

Append assertions to `tests/structure3dService.test.ts` inside `runTests()`:
```ts
  // 7. Test multimeric PDB with multiple copies of the same ligand across chains A and B
  console.log('7. Testing single-instance ligand pinning across multimeric chains...');
  const multimerPdb = [
    'HETATM 3001  C1  117 B 501      50.000  50.000  50.000  1.00 20.00           C',
    'HETATM 3002  C2  117 B 501      51.000  50.000  50.000  1.00 20.00           C',
    'HETATM 3003  O1  117 B 501      52.000  50.000  50.000  1.00 20.00           O',
    'HETATM 3004  C1  117 A 401      10.000  10.000  10.000  1.00 20.00           C',
    'HETATM 3005  C2  117 A 401      11.000  10.000  10.000  1.00 20.00           C',
    'HETATM 3006  O1  117 A 401      12.000  10.000  10.000  1.00 20.00           O',
    'HETATM 3007  ZN   ZN A 701      12.500  10.500  10.500  1.00 20.00          ZN',
    'HETATM 3008  ZN   ZN B 702      90.000  90.000  90.000  1.00 20.00          ZN',
  ].join('\n');

  const pinned = identifyLigandResidue(multimerPdb, '1HW');
  assert.ok(pinned !== null, 'Should resolve aliased 1HW -> 117');
  assert.strictEqual(pinned.resn, '117');
  assert.strictEqual(pinned.chain, 'A', 'Should prefer Chain A instance');
  assert.strictEqual(pinned.resi, 401, 'Should extract residue sequence number 401');
  assert.strictEqual(pinned.atomCount, 3, 'Should count atoms of single instance (3), not sum of all copies (6)');
  assert.strictEqual(pinned.instanceCount, 2, 'Should report 2 total instances across chains');
  assert.ok(Array.isArray(pinned.catalyticMetals) && pinned.catalyticMetals.length === 1, 'Should detect 1 nearby catalytic ZN within 5Å');
  assert.strictEqual(pinned.catalyticMetals![0].resn, 'ZN');
  assert.strictEqual(pinned.catalyticMetals![0].chain, 'A');
  assert.strictEqual(pinned.catalyticMetals![0].resi, 701);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/structure3dService.test.ts`
Expected: FAIL (`pinned.chain` is `undefined` and `pinned.atomCount` is `6` instead of `3`).

- [ ] **Step 3: Implement single-instance grouping and catalytic metal detection in `src/services/structure3dService.ts`**

Update `EXCLUDED_HETERO_RESIDUES` to also include `'LFA'`, `'PGE'`, `'PG4'`, `'P6G'`, `'PE4'`, `'CIT'`, `'TAR'`, `'IOD'`, `'BR'`, `'MAN'`, `'FUC'`, `'GAL'`, `'SUC'`, `'MAL'`.
Update `identifyLigandResidue(pdbData, preferredLigandCode)` to:
1. Parse each `HETATM` line into `resn` (cols 17–20), `chain` (col 21, default `'A'`), `resi` (`parseInt(line.substring(22, 26).trim(), 10) || 1`), and `(x, y, z)` coordinates (`parseFloat` of cols 30–38, 38–46, 46–54).
2. Collect catalytic metal candidates (`resn === 'ZN' || resn === 'MG' || resn === 'FE' || resn === 'MN'`) with their coordinates before skipping `excludedSet`.
3. Group non-excluded `HETATM` records by instance key `${resn}:${chain}:${resi}`.
4. Choose `bestResn` via `preferredLigandCode` (and `LIGAND_CODE_ALIASES`) or the residue code whose largest single instance has the most atoms.
5. Among instances of `bestResn`, select the primary instance preferring `chain === 'A'` (and largest `atomCount`), then first seen.
6. Find any catalytic metal candidates within $5.0\,\text{\AA}$ Euclidean distance of any atom in the chosen ligand instance, and return `{ resn, atomCount, chain, resi, instanceCount, catalyticMetals }`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/structure3dService.test.ts`
Expected: PASS (`✅ All structure3dService and canonicalTargets tests passed successfully!`)

- [ ] **Step 5: Commit**

```powershell
git add src/services/structure3dService.ts tests/structure3dService.test.ts
git commit -m "feat(3d-service): pin single ligand instance and detect nearby catalytic metals"
```

---

### Task 2: Sub-Pocket Residue Pairing & Color Metadata in `canonicalPharmacophorePkData.ts`

**Files:**
- Modify: `src/types/structure3d.ts:36-44`
- Modify: `src/data/canonicalPharmacophorePkData.ts`
- Test: `tests/canonicalPharmacophorePkData.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // In src/types/structure3d.ts
  export interface KeyPocketResidueContact {
    resi: number;
    resn: string;
    chain?: string;
    label: string;
    interactionType: InteractionType;
    clinicalImpact: string;
    subPocketName?: string;
    pharmacophoreGroupId?: string;
    colorAccent?: string;
  }

  // In src/data/canonicalPharmacophorePkData.ts
  export function resolvePocketResidueColor(
    residue: KeyPocketResidueContact,
    profile?: TargetMedChemProfile
  ): string;
  ```

- [ ] **Step 1: Add failing test for sub-pocket residue pairing and color resolution in `tests/canonicalPharmacophorePkData.test.ts`**

Update `tests/canonicalPharmacophorePkData.test.ts` to import `resolvePocketResidueColor` and verify inside `runTests()`:
```ts
  // 6. Verify sub-pocket pairing and colorAccent resolution on all keyPocketResidues
  console.log('6. Testing sub-pocket pairing and resolvePocketResidueColor...');
  for (const profile of CANONICAL_MEDCHEM_PROFILES) {
    const groupIds = new Set(profile.pharmacophoreGroups.map((g) => g.id));
    for (const residue of profile.keyPocketResidues) {
      assert.ok(
        typeof residue.subPocketName === 'string' && residue.subPocketName.length > 0,
        `Residue ${residue.label} in ${profile.targetGeneSymbol} must define subPocketName`
      );
      assert.ok(
        residue.pharmacophoreGroupId && groupIds.has(residue.pharmacophoreGroupId),
        `Residue ${residue.label} in ${profile.targetGeneSymbol} must link to a valid pharmacophoreGroupId`
      );
      const color = resolvePocketResidueColor(residue, profile);
      assert.ok(
        /^#[0-9a-fA-F]{6}$/.test(color),
        `Resolved color '${color}' for ${residue.label} must be a 6-digit hex color`
      );
    }
  }
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/canonicalPharmacophorePkData.test.ts`
Expected: FAIL (`resolvePocketResidueColor` not exported and `subPocketName`/`pharmacophoreGroupId` missing).

- [ ] **Step 3: Add `subPocketName`, `pharmacophoreGroupId`, `colorAccent`, and `resolvePocketResidueColor` in `src/types/structure3d.ts` and `src/data/canonicalPharmacophorePkData.ts`**

1. Extend `KeyPocketResidueContact` in `src/types/structure3d.ts` with `subPocketName?: string`, `pharmacophoreGroupId?: string`, and `colorAccent?: string`.
2. In `src/data/canonicalPharmacophorePkData.ts`, annotate each `keyPocketResidues` entry across all canonical profiles with its paired `pharmacophoreGroupId`, descriptive `subPocketName` (e.g., `"TM3 Covalent Disulfide Sub-pocket"`, `"TM6 Cationic Anchor Pocket"`, `"Catalytic Zn²⁺ Pocket"`, `"S1 Hydrophobic Pocket"`, `"S2' Cationic Sub-pocket"`, `"Arg167 Diacid Anchor Pocket"`, etc.), and `colorAccent` matching the paired pharmacophore group's `colorAccent`.
3. Export `resolvePocketResidueColor(residue: KeyPocketResidueContact, profile?: TargetMedChemProfile): string` which returns `residue.colorAccent`, or the linked `pharmacophoreGroups` entry's `colorAccent`, or an interaction-type default (`covalent`/`coordination`: `'#ef4444'`, `ionic`: `'#8b5cf6'`, `hydrogen-bond`: `'#f59e0b'`, `pi-stacking`: `'#3b82f6'`, `hydrophobic`: `'#10b981'`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/canonicalPharmacophorePkData.test.ts`
Expected: PASS (`All tests passed successfully!`)

- [ ] **Step 5: Commit**

```powershell
git add src/types/structure3d.ts src/data/canonicalPharmacophorePkData.ts tests/canonicalPharmacophorePkData.test.ts
git commit -m "feat(medchem-data): pair key pocket residues with pharmacophore sub-pocket zones and colors"
```

---

### Task 3: Single-Ligand Isolation, True CPK (`type_symbol: 'C'`), Sub-Pocket Zones, and Default 3D Interactions in `ThreeDLabCanvas.tsx`

**Files:**
- Modify: `src/components/ThreeDLabCanvas.tsx`
- Create: `tests/threeDLabSingleLigandPocket.test.ts`

**Interfaces:**
- Consumes: `DetectedLigandInfo` from `src/services/structure3dService.ts`; `resolvePocketResidueColor` from `src/data/canonicalPharmacophorePkData.ts`.
- Produces: Updated `ThreeDLabCanvas` and `MOLSTAR_THEME_COLORS` (adding `slateRibbon: { r: 100, g: 116, b: 139 }`).

- [ ] **Step 1: Write the failing test in `tests/threeDLabSingleLigandPocket.test.ts`**

Create `tests/threeDLabSingleLigandPocket.test.ts`:
```ts
import assert from 'node:assert';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ThreeDLabCanvas, MOLSTAR_THEME_COLORS } from '../src/components/ThreeDLabCanvas';

async function runTests() {
  console.log('--- Running Single-Ligand & Multi-Pocket 3D Lab Test Suite ---');
  const source = fs.readFileSync('src/components/ThreeDLabCanvas.tsx', 'utf8');

  // 1. Verify global hetero/clutter suppression
  assert.ok(
    source.includes('het: false'),
    'Must set het: false in viewer.visual.visibility to hide crystal lipids/buffers and duplicate chain ligands'
  );
  assert.ok(
    source.includes("hideStructure: ['het', 'water', 'carbs', 'nonStandard']"),
    'Must configure hideStructure in molstarOptions to suppress default HETATM clutter'
  );

  // 2. Verify true CPK heteroatom preservation via color: null and type_symbol: 'C'
  assert.ok(
    source.includes('color: null'),
    'Must pass color: null on base ball-and-stick representations so N, O, S, Halogens keep native CPK element colors'
  );
  assert.ok(
    source.includes("type_symbol: 'C'"),
    "Must use type_symbol: 'C' for carbon-only overpainting"
  );

  // 3. Verify muted translucent protein ribbon backdrop
  assert.ok(
    MOLSTAR_THEME_COLORS.slateRibbon,
    'MOLSTAR_THEME_COLORS must define slateRibbon for muted receptor cartoon backdrop'
  );
  assert.ok(
    source.includes('nonSelectedColor') && source.includes('nonSelectedOpacity'),
    'Must configure nonSelectedColor and nonSelectedOpacity in viewer.visual.select'
  );

  // 4. Verify live 3D non-covalent interactions via interactivityFocus and 3D tooltips
  assert.ok(
    source.includes('interactivityFocus'),
    'Must invoke viewer.visual.interactivityFocus on the single ligand instance to display 5Å pocket contacts and 3D interaction lines'
  );
  assert.ok(
    source.includes('viewer.visual.tooltips') || source.includes('viewer.visual?.tooltips'),
    'Must attach custom 3D tooltips for sub-pocket residues and ligand'
  );

  // 5. Verify Sub-Pocket Zones toggle button in rendered toolbar
  const html = renderToString(
    React.createElement(ThreeDLabCanvas, {
      pdbId: '1O86',
      targetName: 'Angiotensin-Converting Enzyme',
      geneSymbol: 'ACE',
      isFullscreen: false,
      onToggleFullscreen: () => {},
      onOpenTutorial: () => {},
    })
  );

  assert.ok(
    html.includes('Sub-Pocket Zones'),
    'Toolbar must render "Sub-Pocket Zones" color-matching toggle button'
  );

  console.log('✅ All tests passed in tests/threeDLabSingleLigandPocket.test.ts');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/threeDLabSingleLigandPocket.test.ts`
Expected: FAIL (`het: false`, `type_symbol: 'C'`, `slateRibbon`, `interactivityFocus`, and `Sub-Pocket Zones` not yet present).

- [ ] **Step 3: Implement single-ligand isolation, true CPK carbon-only coloring, sub-pocket zones, and default pocket interactions in `src/components/ThreeDLabCanvas.tsx`**

1. Add `slateRibbon: { r: 100, g: 116, b: 139 }` to `MOLSTAR_THEME_COLORS` and import `resolvePocketResidueColor` from `../data/canonicalPharmacophorePkData`.
2. Add `const [subPocketColorMode, setSubPocketColorMode] = useState<boolean>(true);` and change default `showPocket` and `showHBonds` initial states to `true` (`useState<boolean>(true)`), and in `loadMolstarAndInit` set `initialPocket = Boolean(ligand)` and `initialHBonds = Boolean(ligand)`.
3. In `molstarOptions`, add `hideStructure: ['het', 'water', 'carbs', 'nonStandard']`.
4. In `renderScene`:
   - Call `viewer.visual.visibility({ polymer: ribbonActive, het: false, water: false, carbs: false, nonStandard: false })`.
   - Build single-ligand selector `{ label_comp_id: ligand.resn, chem_comp_id: ligand.resn, ...(ligand.chain ? { auth_asym_id: ligand.chain } : {}), ...(ligand.resi ? { auth_seq_id: ligand.resi } : {}) }`.
   - In `selectData`:
     - Push base ligand `ball-and-stick` representation with `color: null` (no `representationColor`) so N, O, S, P, Cl, F keep native CPK element colors, and `focus: !pharmacophoreGroup`.
     - Push carbon-only overpaint (`type_symbol: 'C'`, `color: null`, `representationColor: MOLSTAR_THEME_COLORS.cyanCarbon`) for the ligand, and if `subPocketZonesActive && medChemProfile?.pharmacophoreGroups?.length`, push per-pharmacophore carbon overpaints (`atoms: group.atomNames, label_atom_id: group.atomNames, type_symbol: 'C', color: null, representationColor: hexToRgb(group.colorAccent)`).
     - If `ligand.catalyticMetals?.length`, push each catalytic metal (`auth_asym_id: metal.chain, auth_seq_id: metal.resi, label_comp_id: metal.resn, representation: 'ball-and-stick', color: null`).
     - If `pocketActive && medChemProfile?.keyPocketResidues?.length`, for each `residue`:
       - Determine `resColor = subPocketZonesActive ? hexToRgb(resolvePocketResidueColor(residue, medChemProfile)) : MOLSTAR_THEME_COLORS.emeraldPocket`.
       - Push base residue `ball-and-stick` (`auth_asym_id: residue.chain || ligand?.chain || 'A', struct_asym_id: residue.chain || ligand?.chain || 'A', auth_seq_id: residue.resi, residue_number: residue.resi, representation: 'ball-and-stick', color: null, focus: Boolean(pharmacophoreGroup && residue.pharmacophoreGroupId === pharmacophoreGroup.id)`).
       - Push carbon-only overpaint for the residue (`type_symbol: 'C', representation: 'ball-and-stick', color: null, representationColor: resColor`).
       - If `pocketSurfaceActive`, push translucent cavity surface (`representation: 'gaussian-surface', color: null, representationColor: resColor, representationOpacity: 0.28`).
     - If `pharmacophoreGroup && ligand`, push the active pharmacophore group entry (`chem_comp_id: ligand.resn, label_comp_id: ligand.resn, atoms: pharmacophoreGroup.atomNames, label_atom_id: pharmacophoreGroup.atomNames, type_symbol: 'C', representation: 'ball-and-stick', representationColor: accentRgb, color: accentRgb, focus: true`).
     - Call `viewer.visual.select({ data: selectData, nonSelectedColor: MOLSTAR_THEME_COLORS.slateRibbon, nonSelectedOpacity: ligand && pocketActive ? 0.28 : 0.85 })`.
   - If `ligand && (hbondsActive || pocketActive) && typeof viewer.visual?.interactivityFocus === 'function'`, call `viewer.visual.interactivityFocus({ data: [ligandSelector] })`.
   - If `typeof viewer.visual?.tooltips === 'function'`, attach tooltips for the single ligand and each `keyPocketResidues` item (`${residue.label} • ${residue.subPocketName || residue.interactionType}`).
   - In camera focus (`viewer.visual.focus`), when `pharmacophoreGroup` is active, focus the union of the pharmacophore group atoms AND any paired `keyPocketResidues` where `residue.pharmacophoreGroupId === pharmacophoreGroup.id`.
5. Add the `"Sub-Pocket Zones"` toggle button to the toolbar in `ThreeDLabCanvas.tsx`, and display the sub-pocket count / single-instance badge in the header (`1 Bound Ligand Isolated`).

- [ ] **Step 4: Run test suite and full regression tests to verify all pass**

Run:
```powershell
npx tsx tests/threeDLabSingleLigandPocket.test.ts
npx tsx tests/threeDLabCanvas.test.ts
npx tsx tests/threeDLabCanvasControls.test.ts
node --import tsx --test tests/threeDLabMolstarCanvas.test.ts
npx tsx tests/threeDLabPharmacophoreIntegration.test.ts
npm run lint
npm run build
```
Expected: All tests PASS, `tsc --noEmit` exits 0, `vite build` succeeds.

- [ ] **Step 5: Commit**

```powershell
git add src/components/ThreeDLabCanvas.tsx tests/threeDLabSingleLigandPocket.test.ts
git commit -m "feat(3d-lab): isolate single ligand with CPK heteroatoms, sub-pocket zones, and live 3D interactions"
```
