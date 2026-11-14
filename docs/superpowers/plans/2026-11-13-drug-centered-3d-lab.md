# Drug-Centered 3D Molecular Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the 3D Molecular Lab around a `1.–39.` therapeutic-class drug picker, fix Mol\* WebGL teardown and mmCIF selector bugs so switching drugs always renders cleanly (including Aspirin in `1PTH`), and replace cluttered technical panels with an always-visible **Drug Binding & Mechanism** walkthrough.

**Architecture:** `src/data/receptorPocketTemplates.ts` and `src/data/drug3dCatalog.ts` unify `TOP_DRUGS_TAXONOMY` (`1.–39.` classes), clinical review-module drugs, `TOP_DRUGS_CLINICAL_CATALOG`, and RCSB-verified 3D receptor pocket templates into a deterministic single-drug catalog supporting `'het'`, `'chain'`, and `'carbs'` ligand modes. `ThreeDLabCanvas.tsx` mounts each `PDBeMolstarPlugin` instance into a fresh inner child `div` with `viewer.plugin.dispose()` cleanup, emits strict `auth_asym_id`/`auth_seq_id`/`label_comp_id` mmCIF queries with static ligand fallback, and streamlines its toolbar. `ThreeDLabLibrary.tsx` renders the 3-column Drug Studio (Left: default-collapsed `1.–39.` class rows expanding to a `<select>` drug dropdown that collapses on selection; Center: clean 3D pocket canvas; Right: plain-language mechanism + clickable Binding Site cards), while `App.tsx` and `PubChemInspectorModal.tsx` unlock `"Open in 3D Lab"` across all cataloged drugs.

**Tech Stack:** React 19, TypeScript 7, Tailwind CSS 4, PDBe-Mol\* (`pdbe-molstar@3.12.0`), Node.js `assert` & `node:test` via `tsx`.

**Spec:** `docs/superpowers/specs/2026-11-13-drug-centered-3d-lab-design.md`

## Global Constraints

- Every Mol\* load in `src/components/ThreeDLabCanvas.tsx` must create and append a fresh child `HTMLDivElement` inside `containerRef.current`, and cleanup must invoke `viewer.plugin?.dispose()` (falling back to `viewer.clear?.()` / `viewer.destroy?.()`) before removing that child element.
- The Mol\* initialization `useEffect` dependency array must only contain `[cleanPdbId, preferredLigandCode, ligandMode, reloadTrigger]`—never `renderScene` or `medChemProfile`.
- Never pass `chem_comp_id`, `struct_asym_id`, or `residue_number` in Mol\* `QueryParam` objects: `'het'` ligands/metals use `{ label_comp_id, auth_asym_id?, auth_seq_id? }`, `'chain'` peptide ligands use `{ auth_asym_id }`, `'carbs'` oligosaccharides omit `'carbs'` from `hideStructure`, and polymer pocket residues use `{ auth_asym_id, auth_seq_id }`.
- Leave `molstarOptions.visualStyle` as `undefined` (never `'cartoon'`, which overrides hetero ligands to cartoon).
- All `1.–39.` therapeutic classes in `THERAPEUTIC_CATEGORIES` must start collapsed by default (`expandedClassNumber = null`), expand on click to show a `<select>` dropdown of drugs, and collapse when re-clicked or when a drug is selected from the dropdown.
- Preserve existing exports in `src/utils/canonicalTargets.ts`, `src/data/canonicalPharmacophorePkData.ts`, and `src/services/structure3dService.ts` so `tests/structure3dService.test.ts` and `tests/canonicalPharmacophorePkData.test.ts` pass unchanged.

## Review Focus

- Secondary `.ent` text coordinate timeout/failure (`fetchPdbCoordinates` rejects): switching to Aspirin (`1PTH` / `SAL`) or any other drug when text coordinate pre-fetch fails must still construct a fallback `DetectedLigandInfo` from `preferredLigandCode` / `ligandChain` so the `.bcif` ligand and pocket contacts render instead of an empty pocket.
- Salt-suffixed, brand-name, combination, and active-metabolite lookups in `resolveDrug3DEntry` (e.g., `"Metoprolol Succinate"`, `"Plavix"`, `"Trimethoprim / Sulfamethoxazole"`, `"Dabigatran etexilate"`, `"EXP3174"`): must resolve deterministically to their corresponding `Drug3DCatalogEntry` instead of returning `undefined`.
- Rapid sequential drug switching (`Clopidogrel` $\rightarrow$ `Aspirin` $\rightarrow$ `Lisinopril`) before an earlier load settles: stale `fetchPdbCoordinates` completions and `viewer.events.loadComplete` callbacks must be ignored via a mount/generation token, and `viewer.plugin?.dispose()` must clean up the superseded child `div`.
- Filtering the `1.–39.` class list by drug or class query and then selecting a drug: must filter matching classes/drugs cleanly while resetting `expandedClassNumber = null` and `activeBindingSiteId = null` upon drug selection without stranding the active drug.
- Signal-peptide-offset PDB chains (`ACE 1O86`) and mmCIF hetero ligands (`COX-1 1PTH` `SAL`, `AT1R 4ZUD` `OLM`): query helper builders must never emit `residue_number` (`label_seq_id`) or `struct_asym_id` (`label_asym_id`), which cause `QueryHelper.getQueryObject` to evaluate `0` matching atoms.

---

## File Structure

- **Modify:** `src/types/structure3d.ts` — Add `LigandRenderMode`, `DrugBindingSite`, `Drug3DCatalogEntry`, and `TherapeuticClass3DGroup` alongside existing types.
- **Create:** `src/data/receptorPocketTemplates.ts` — Verified RCSB PDB receptor pocket templates (`ReceptorPocketTemplate`) covering all `1.–39.` therapeutic classes with `pdbId`, `ligandCode`, `ligandChain`, `ligandMode`, `crystallizedLigandName`, `targetName`, `geneSymbol`, and 2–4 `DrugBindingSite` records.
- **Create:** `src/data/drug3dCatalog.ts` — Builds `DRUG_3D_CATALOG`, `THERAPEUTIC_CLASS_3D_GROUPS` (`1.`–`39.`), `getDrug3DById`, and `resolveDrug3DEntry` by merging `TOP_DRUGS_TAXONOMY`, supplemental review-module drugs, `TOP_DRUGS_CLINICAL_CATALOG`, and `RECEPTOR_POCKET_TEMPLATES` (with combination splitting, route/salt deduplication, and exclusion of non-receptor/biologic/distractor entries).
- **Modify:** `src/components/ThreeDLabCanvas.tsx` — Fresh child `div` Mol\* mount + `viewer.plugin?.dispose()`, pure mmCIF query builders (`buildMolstarLigandQuery`, `buildMolstarResidueQuery`), `'het' | 'chain' | 'carbs'` support, static ligand fallback on `.ent` fetch failure, simplified toolbar (`Reset View`, `Protein Ribbon`, `Sub-Pocket Colors`, `Guide`, `Fullscreen`), Exact vs. Class-Pocket crystal badge, and `DrugBindingSite` focus/highlight support.
- **Modify:** `src/components/ThreeDLabLibrary.tsx` — 3-column Drug-Centered Studio (`1.–39.` default-collapsed class rows with `<select>` drug dropdowns on left, `ThreeDLabCanvas` in center, **Drug Binding & Mechanism** walkthrough with clickable Binding Site cards on right, plus Fullscreen drawers).
- **Modify:** `src/components/ThreeDLabTutorialModal.tsx` — Update step copy to reflect `1.–39.` therapeutic class selection and Binding Site cards while keeping accessible dialog & step structure intact.
- **Modify:** `src/App.tsx` & `src/components/PubChemInspectorModal.tsx` — Resolve 3D availability and PDB target handoff via `resolveDrug3DEntry` first (with `findCanonicalTargetForDrug` fallback).
- **Test:** `tests/drug3dCatalog.test.ts` (Create), `tests/threeDLabDrugStudio.test.ts` (Create), and update `tests/threeDLabCanvas.test.ts`, `tests/threeDLabMolstarCanvas.test.ts`, `tests/threeDLabCanvasControls.test.ts`, `tests/threeDLabSingleLigandPocket.test.ts`, `tests/threeDLabFallback.test.ts`, `tests/threeDLabLibraryIntegration.test.ts`, `tests/threeDLabUsabilityIntegration.test.ts`, `tests/threeDLabPharmacophoreIntegration.test.ts`, and `tests/threeDLabTutorialModal.test.ts`.

---

### Task 1: Unified `1.–39.` 3D Drug & Receptor Pocket Catalog

**Files:**
- Modify: `src/types/structure3d.ts`
- Create: `src/data/receptorPocketTemplates.ts`
- Create: `src/data/drug3dCatalog.ts`
- Test: `tests/drug3dCatalog.test.ts`

**Interfaces:**
- Consumes: `TOP_DRUGS_TAXONOMY`, `THERAPEUTIC_CATEGORIES` from `src/data/topDrugsTaxonomyData.ts`; `resolveTopDrugClinicalMonograph` from `src/data/topDrugsClinicalData.ts`; `normalizeForTaxonomyMatch` from `src/utils/topDrugsTaxonomy.ts`.
- Produces:
  - In `src/types/structure3d.ts`:
    ```ts
    export type LigandRenderMode = 'het' | 'chain' | 'carbs';

    export interface DrugBindingSite {
      id: string;
      siteName: string;
      drugMoiety: string;
      interactionType: InteractionType;
      colorAccent: string;
      residues: {
        resn: string;
        resi: number;
        chain: string;
        label: string;
      }[];
      reactionSummary: string;
      clinicalRelevance: string;
    }

    export interface Drug3DCatalogEntry {
      id: string;
      genericName: string;
      brandNames: string[];
      therapeuticClassNumber: number;
      therapeuticCategory: string;
      pharmacologicClass: string;
      source: 'top-200' | 'review-module' | 'both';
      pdbId: string;
      ligandCode: string;
      ligandChain?: string;
      ligandMode?: LigandRenderMode;
      isExactDrugCrystal: boolean;
      crystallizedLigandName: string;
      targetName: string;
      geneSymbol: string;
      overallMechanism: string;
      prodrugNote?: string;
      bindingSites: DrugBindingSite[];
    }

    export interface TherapeuticClass3DGroup {
      classNumber: number;
      categoryName: string;
      drugs: Drug3DCatalogEntry[];
    }
    ```
  - In `src/data/drug3dCatalog.ts`:
    - `export const DRUG_3D_CATALOG: Drug3DCatalogEntry[]`
    - `export const THERAPEUTIC_CLASS_3D_GROUPS: TherapeuticClass3DGroup[]`
    - `export function getDrug3DById(id: string): Drug3DCatalogEntry | undefined`
    - `export function resolveDrug3DEntry(drugNameOrQuery?: string, pdbIdHint?: string): Drug3DCatalogEntry | undefined`

- [ ] **Step 1: Write the failing test in `tests/drug3dCatalog.test.ts`**

```ts
import assert from 'node:assert/strict';
import { THERAPEUTIC_CATEGORIES } from '../src/data/topDrugsTaxonomyData';
import {
  DRUG_3D_CATALOG,
  THERAPEUTIC_CLASS_3D_GROUPS,
  getDrug3DById,
  resolveDrug3DEntry,
} from '../src/data/drug3dCatalog';

async function runTests() {
  // 1. All 39 therapeutic classes (1..39) exist in exact curriculum order and each has >= 1 3D drug
  assert.equal(THERAPEUTIC_CLASS_3D_GROUPS.length, 39, 'All 39 therapeutic classes must be populated');
  THERAPEUTIC_CLASS_3D_GROUPS.forEach((group, idx) => {
    assert.equal(group.classNumber, idx + 1);
    assert.equal(group.categoryName, THERAPEUTIC_CATEGORIES[idx].categoryName);
    assert.ok(group.drugs.length >= 1, `Class ${group.categoryName} must contain at least 1 3D drug`);
  });

  // 2. Aspirin maps to inactivated COX-1 (1PTH, SAL, exact crystal) in Class 1 with Ser530 & Arg120 sites
  const aspirin = resolveDrug3DEntry('Aspirin');
  assert.ok(aspirin, 'Aspirin must resolve in catalog');
  assert.equal(aspirin.pdbId, '1PTH');
  assert.equal(aspirin.ligandCode, 'SAL');
  assert.equal(aspirin.therapeuticClassNumber, 1);
  assert.equal(aspirin.isExactDrugCrystal, true);
  assert.ok(aspirin.bindingSites.length >= 2 && aspirin.bindingSites.length <= 4);
  assert.ok(aspirin.bindingSites.some((s) => s.residues.some((r) => r.resi === 530)));

  // 3. Clopidogrel, Lisinopril, Captopril, Atorvastatin, Losartan, Semaglutide, Fondaparinux resolve with verified PDBs & modes
  const clopidogrel = getDrug3DById('clopidogrel');
  assert.ok(clopidogrel && clopidogrel.pdbId === '4NTJ' && clopidogrel.prodrugNote);
  assert.equal(resolveDrug3DEntry('Lisinopril')?.pdbId, '1O86');
  assert.equal(resolveDrug3DEntry('Captopril')?.pdbId, '1UZF');
  assert.equal(resolveDrug3DEntry('Atorvastatin')?.pdbId, '1HWK');
  const losartan = resolveDrug3DEntry('Losartan');
  assert.ok(losartan && losartan.pdbId === '4ZUD' && losartan.isExactDrugCrystal === false);
  assert.equal(resolveDrug3DEntry('Semaglutide')?.ligandMode, 'chain');
  assert.equal(resolveDrug3DEntry('Fondaparinux')?.ligandMode, 'carbs');

  // 4. Supplemental clinical review-module drugs appear in their assigned 1..39 class
  for (const [name, expectedClass] of [
    ['Prasugrel', 13],
    ['Ticagrelor', 13],
    ['Tirofiban', 13],
    ['Vorapaxar', 13],
    ['Argatroban', 12],
    ['Sacubitril', 11],
    ['Milrinone', 11],
    ['Dobutamine', 11],
    ['Aliskiren', 11],
    ['Acetazolamide', 11],
    ['Tolvaptan', 11],
    ['Quinidine', 14],
    ['Flecainide', 14],
    ['Sotalol', 14],
    ['Vilanterol', 36],
    ['Roflumilast', 36],
  ] as const) {
    const entry = resolveDrug3DEntry(name);
    assert.ok(entry, `Review-module drug ${name} must exist in catalog`);
    assert.equal(entry.therapeuticClassNumber, expectedClass, `${name} must belong to class ${expectedClass}`);
  }

  // 5. Combination splitting & route/salt deduplication
  assert.ok(resolveDrug3DEntry('Trimethoprim'), 'Trimethoprim split into standalone entry');
  assert.ok(resolveDrug3DEntry('Sulfamethoxazole'), 'Sulfamethoxazole split into standalone entry');
  assert.ok(resolveDrug3DEntry('Clavulanate'), 'Clavulanate split into standalone entry');
  const class36Names = THERAPEUTIC_CLASS_3D_GROUPS[35].drugs.map((d) => d.genericName);
  assert.equal(class36Names.filter((n) => n === 'Fluticasone').length, 1, 'Fluticasone route duplicates merged');
  assert.ok(!DRUG_3D_CATALOG.some((d) => d.genericName.includes(' / ')), 'No slash-combined multi-drug entries in dropdowns');

  // 6. Exclusions: non-receptor osmotics/electrolytes, biologics/insulins, quiz distractors, standalone metabolites
  for (const excluded of [
    'Mannitol',
    'Potassium Chloride',
    'Polyethylene Glycol (PEG)',
    'Docusate',
    'Cholestyramine',
    'Insulin Glargine',
    'Adalimumab',
    'Alteplase',
    'Structure X',
    'Structure Y',
    'Structure Z',
  ]) {
    assert.ok(
      !DRUG_3D_CATALOG.some((d) => d.genericName.toLowerCase() === excluded.toLowerCase()),
      `${excluded} must be excluded from browse dropdowns`
    );
  }

  // 7. Review Focus: Salt suffixes, brands, combinations, and active-metabolite aliases resolve via resolveDrug3DEntry
  assert.equal(resolveDrug3DEntry('Metoprolol Succinate')?.genericName, 'Metoprolol');
  assert.equal(resolveDrug3DEntry('Plavix')?.genericName, 'Clopidogrel');
  assert.equal(resolveDrug3DEntry('Trimethoprim / Sulfamethoxazole')?.genericName, 'Trimethoprim');
  assert.equal(resolveDrug3DEntry('Dabigatran etexilate')?.genericName, 'Dabigatran');
  assert.equal(resolveDrug3DEntry('EXP3174')?.genericName, 'Losartan');
  assert.equal(resolveDrug3DEntry('Enalaprilat')?.genericName, 'Enalapril');

  // 8. Every catalog entry has 4-char PDB ID, non-empty ligandCode, and 2..4 valid binding sites
  for (const entry of DRUG_3D_CATALOG) {
    assert.match(entry.pdbId, /^[A-Z0-9]{4}$/, `Invalid PDB ID on ${entry.genericName}`);
    assert.ok(entry.ligandCode.length >= 1 && entry.ligandCode.length <= 5, `Invalid ligandCode on ${entry.genericName}`);
    assert.ok(
      entry.bindingSites.length >= 2 && entry.bindingSites.length <= 4,
      `${entry.genericName} must have 2..4 binding sites`
    );
    assert.ok(entry.overallMechanism.length > 20, `${entry.genericName} must have plain-language overallMechanism`);
  }

  console.log('PASS: tests/drug3dCatalog.test.ts');
}

runTests();
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/drug3dCatalog.test.ts`
Expected: FAIL with `Cannot find module '../src/data/drug3dCatalog'`

- [ ] **Step 3: Add types in `src/types/structure3d.ts` and implement `src/data/receptorPocketTemplates.ts` + `src/data/drug3dCatalog.ts`**

- In `src/types/structure3d.ts`, append `LigandRenderMode`, `DrugBindingSite`, `Drug3DCatalogEntry`, and `TherapeuticClass3DGroup` without altering existing interfaces.
- In `src/data/receptorPocketTemplates.ts`, define `ReceptorPocketTemplate` and `RECEPTOR_POCKET_TEMPLATES` using live-verified RCSB PDB IDs and bound component/chain IDs across all 39 classes:
  - COX-1 Aspirin (`1PTH`, `SAL`, exact for Aspirin; `Ser530`, `Arg120`, `Tyr385`), COX-2 Ibuprofen (`4PH9`, `IBP`), COX-2 Celecoxib (`3LN1`, `CEL`), $\mu$-Opioid (`5C1M`, `VF1`), $\text{Na}_\text{v}1.5$ (`6LQA`, `QDN`, chain `'B'`), PBP3 $\beta$-lactam (`3PBQ`, `IM2`), DNA Gyrase (`2XCT`, `CPF`), Ribosome 30S/50S (`4V56`, `SCM`), DHFR (`1U72`, `MTX`), Tubulin (`4O2B`, `LOC`), $\text{GABA}_\text{A}$ (`6HUP`, `DZP`), SERT (`5I6X`, `8PR`), $\text{D}_2\text{R}$ (`6CM4`, `8NU`), $5\text{-HT}_{2\text{C}}$ (`6BQH`, `E2J`), $\alpha_{2\text{A}}$-AR (`6KUX`, `E3F`), $\text{PPAR}\gamma$ (`2PRG`, `BRL`), DPP-4 (`1X70`, `715`), SGLT2 (`7VSI`, `7R3`), GLP-1R (`7KI0`, `ligandCode: 'P'`, `ligandChain: 'P'`, `ligandMode: 'chain'`), $5\text{-HT}_3\text{R}$ (`6NP0`, `CWB`), $\text{H}_1\text{R}$ (`3RZE`, `5EH`), CYP51 (`5TZ1`, `VT1`), HMGCR (`1HWK`, `117`), ACE Lisinopril (`1O86`, `LPR`), ACE Captopril (`1UZF`, `MCO`), $\text{AT}_1\text{R}$ (`4ZUD`, `OLM`), Renin (`2V0Z`, `C41`), $\beta_1$-AR (`7JJO`, `5FW`), $\beta_2$-AR (`2RH1`, `CAU`), $\text{Ca}_\text{v}1.1$ (`6JPA`, `9Z9`), CA-II (`3HS4`, `AZM`), NKCC (`7SMP`, `82U`), MR (`2AA2`, `AS4`), Neprilysin (`5JMY`, `6LD`), PDE3 (`1SO2`, `666`), $\text{Na}^+/\text{K}^+$-ATPase (`4HYT`, `OBN`), Factor Xa (`2P16`, `GG2`), Thrombin (`1KTS`, `C24`), Antithrombin III (`1E03`, `ligandCode: 'NAG'`, `ligandMode: 'carbs'`), $\text{P2Y}_{12}$ antagonist (`4NTJ`, `AZJ`), $\text{P2Y}_{12}$ nucleotide (`4PXZ`, `6AD`), GPIIb/IIIa Tirofiban (`2VDM`, `AGG`), GPIIb/IIIa Eptifibatide (`2VDN`, `ligandCode: 'C'`, `ligandChain: 'C'`, `ligandMode: 'chain'`), PAR-1 (`3VW7`, `VPX`), hERG (`8ZYO`, `XB7`), HIV Protease (`1HXB`, `ROC`), HIV RT (`1RTD`, `TTP`), HIV Integrase (`3OYA`, `RLT`), Neuraminidase (`2HU4`, `G39`), Gastric $\text{H}^+/\text{K}^+$-ATPase (`5YLU`, `HKT`), PDE5 (`1UDT`, `VIA`), Muscarinic M-receptor (`5CXV`, `0HK`), GR (`1M2Z`, `DEX`), ER (`1ERE`, `EST`), PR (`1A28`, `STR`), AR (`1E3G`, `R18`), OTR (`7RYC`, `ligandCode: 'L'`, `ligandChain: 'L'`, `ligandMode: 'chain'`), $\text{V}_2\text{R}$ (`7BB7`, `ligandCode: 'H'`, `ligandChain: 'H'`, `ligandMode: 'chain'`), Cyclophilin-Cyclosporine (`1CWA`, `ligandCode: 'C'`, `ligandChain: 'C'`, `ligandMode: 'chain'`), AChE (`4EY7`, `E20`), VDR/CaSR (`1DB1`, `VDX`), FPPS (`2F8Z`, `ZOL`), $\alpha_4\beta_2$ nAChR (`5KXI`, `NCT`), $5\text{-HT}_{1\text{B}}$ (`4IAR`, `ERM`), RAR (`3R8A`, `HIG`), Xanthine Oxidase (`1N5X`, `TEI`), and TR$\beta$ (`1XZX`, `T3`, `ligandChain: 'X'`).
- In `src/data/drug3dCatalog.ts`, map all eligible Top 200 drugs (deduplicating route/salt variants and decomposing multi-ingredient combinations into standalone single-drug entries within their class) + supplemental clinical review-module drugs from Spec Section 5.1(2), attach drug-specific `overallMechanism` (combining `resolveTopDrugClinicalMonograph(genericName).mechanismOfAction` with how the drug binds/reacts in that pocket) and `prodrugNote` where applicable, sort drugs alphabetically inside each `1.–39.` `TherapeuticClass3DGroup`, and implement `resolveDrug3DEntry` handling exact names, normalized salt-stripped names, brand names, combination strings, metabolite aliases (`exp3174` $\rightarrow$ `losartan`, `enalaprilat` $\rightarrow$ `enalapril`, `dabigatranetexilate` $\rightarrow$ `dabigatran`, `sacubitrilat` $\rightarrow$ `sacubitril`), and `pdbIdHint` fallback.

- [ ] **Step 4: Run tests to verify Task 1 passes with zero regressions**

Run: `npx tsx tests/drug3dCatalog.test.ts; npx tsx tests/structure3dService.test.ts; npx tsx tests/canonicalPharmacophorePkData.test.ts`
Expected: PASS on all three suites

- [ ] **Step 5: Commit**

```powershell
git add src/types/structure3d.ts src/data/receptorPocketTemplates.ts src/data/drug3dCatalog.ts tests/drug3dCatalog.test.ts; git commit -m "feat(3d-lab): add unified 1-39 therapeutic class 3D drug and pocket catalog"
```

---

### Task 2: Mol\* Lifecycle Disposal, mmCIF Selector Engine & Simplified Drug-Centered Canvas

**Files:**
- Modify: `src/components/ThreeDLabCanvas.tsx`
- Modify: `tests/threeDLabSingleLigandPocket.test.ts`
- Modify: `tests/threeDLabCanvas.test.ts`
- Modify: `tests/threeDLabMolstarCanvas.test.ts`
- Modify: `tests/threeDLabCanvasControls.test.ts`
- Modify: `tests/threeDLabFallback.test.ts`

**Interfaces:**
- Consumes: `Drug3DCatalogEntry`, `DrugBindingSite`, `LigandRenderMode`, `TargetMedChemProfile`, `PharmacophorePkPdGroup`, `KeyPocketResidueContact` from `src/types/structure3d.ts`; `DetectedLigandInfo`, `LIGAND_CODE_ALIASES`, `fetchPdbCoordinates`, `identifyLigandResidue` from `src/services/structure3dService.ts`.
- Produces in `src/components/ThreeDLabCanvas.tsx`:
  - Pure exported query/fallback helpers (testable directly in Node without WebGL):
    ```ts
    export function buildMolstarLigandQuery(
      ligand: Pick<DetectedLigandInfo, 'resn' | 'chain' | 'resi'> | null,
      ligandMode?: LigandRenderMode
    ): Record<string, unknown> | null;

    export function buildMolstarResidueQuery(
      chain: string,
      resi: number
    ): { auth_asym_id: string; auth_seq_id: number };

    export function resolveFallbackLigandFromCatalog(
      preferredLigandCode?: string,
      ligandChain?: string,
      ligandMode?: LigandRenderMode
    ): DetectedLigandInfo | null;
    ```
  - Updated `ThreeDLabCanvasProps` adding:
    ```ts
    drugEntry?: Drug3DCatalogEntry;
    ligandMode?: LigandRenderMode;
    ligandChain?: string;
    activeBindingSite?: DrugBindingSite | null;
    onSelectBindingSite?: (site: DrugBindingSite | null) => void;
    ```
    (retaining existing props `pdbId`, `preferredLigandCode`, `isFullscreen`, `onToggleFullscreen`, `onOpenTutorial`, `targetName`, `geneSymbol`, `medChemProfile`, `activePharmacophoreGroup`, `onSelectPharmacophoreGroup`, `onSelectPocketResidue`, `isPkDrawerOpen`, `onTogglePkDrawer`, `initialLoadError`, `initial2DFallback` for compatibility).

- [ ] **Step 1: Write failing tests in `tests/threeDLabSingleLigandPocket.test.ts` for Mol\* lifecycle, mmCIF queries, static fallback, and simplified toolbar**

Update `tests/threeDLabSingleLigandPocket.test.ts` to assert:
```ts
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  ThreeDLabCanvas,
  MOLSTAR_THEME_COLORS,
  buildMolstarLigandQuery,
  buildMolstarResidueQuery,
  resolveFallbackLigandFromCatalog,
} from '../src/components/ThreeDLabCanvas';
import { resolveDrug3DEntry } from '../src/data/drug3dCatalog';

// 1. Strict mmCIF query builders never emit chem_comp_id, struct_asym_id, or residue_number
const hetQ = buildMolstarLigandQuery({ resn: 'SAL', chain: 'A', resi: 601 }, 'het');
assert.deepEqual(hetQ, { label_comp_id: 'SAL', auth_asym_id: 'A', auth_seq_id: 601 });
assert.ok(!('chem_comp_id' in hetQ!) && !('struct_asym_id' in hetQ!) && !('residue_number' in hetQ!));

const chainQ = buildMolstarLigandQuery({ resn: 'P', chain: 'P' }, 'chain');
assert.deepEqual(chainQ, { auth_asym_id: 'P' });

const resQ = buildMolstarResidueQuery('A', 530);
assert.deepEqual(resQ, { auth_asym_id: 'A', auth_seq_id: 530 });
assert.ok(!('residue_number' in resQ) && !('struct_asym_id' in resQ));

// 2. Review Focus: Static fallback ligand when fetchPdbCoordinates fails/times out
const fbSal = resolveFallbackLigandFromCatalog('SAL', 'A', 'het');
assert.ok(fbSal && fbSal.resn === 'SAL' && fbSal.chain === 'A');
const fbAlias = resolveFallbackLigandFromCatalog('AZD', 'A', 'het');
assert.equal(fbAlias?.resn, 'AZJ');

// 3. Lifecycle & disposal invariants in ThreeDLabCanvas source
const source = fs.readFileSync('src/components/ThreeDLabCanvas.tsx', 'utf8');
assert.ok(source.includes("document.createElement('div')"), 'Mounts Mol* into a fresh child div');
assert.ok(source.includes('plugin?.dispose') || source.includes('plugin.dispose'), 'Disposes Mol* plugin on cleanup');
assert.ok(!source.includes("visualStyle: 'cartoon'"), 'Does not force het components into cartoon visualStyle');

// 4. Simplified drug-centered header & toolbar badges (Exact vs Class Pocket Crystal)
const aspirin = resolveDrug3DEntry('Aspirin')!;
const exactHtml = renderToString(
  React.createElement(ThreeDLabCanvas, {
    pdbId: aspirin.pdbId,
    preferredLigandCode: aspirin.ligandCode,
    drugEntry: aspirin,
    isFullscreen: false,
    onToggleFullscreen: () => {},
    onOpenTutorial: () => {},
  })
);
assert.ok(exactHtml.includes('Aspirin'), 'Header displays selected drug name');
assert.ok(exactHtml.includes('Exact Drug Crystal'), 'Displays Exact Drug Crystal badge for 1PTH');
assert.ok(exactHtml.includes('Reset View'), 'Renders Reset View control');
assert.ok(exactHtml.includes('Protein Ribbon'), 'Renders Protein Ribbon toggle');
assert.ok(exactHtml.includes('Sub-Pocket Colors'), 'Renders Sub-Pocket Colors toggle');
assert.ok(!exactHtml.includes('Isolate Ligand') && !exactHtml.includes('Atom Labels'), 'Removes legacy clutter toggles');

const losartan = resolveDrug3DEntry('Losartan')!;
const refHtml = renderToString(
  React.createElement(ThreeDLabCanvas, {
    pdbId: losartan.pdbId,
    preferredLigandCode: losartan.ligandCode,
    drugEntry: losartan,
    isFullscreen: false,
    onToggleFullscreen: () => {},
    onOpenTutorial: () => {},
  })
);
assert.ok(refHtml.includes('Class Pocket Crystal'), 'Displays Class Pocket Crystal badge when isExactDrugCrystal is false');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/threeDLabSingleLigandPocket.test.ts`
Expected: FAIL with `buildMolstarLigandQuery is not a function`

- [ ] **Step 3: Implement Mol\* lifecycle fix, mmCIF query builders, `'het' | 'chain' | 'carbs'` rendering, and simplified toolbar in `src/components/ThreeDLabCanvas.tsx`, and align canvas test suites**

- Implement `buildMolstarLigandQuery`, `buildMolstarResidueQuery`, and `resolveFallbackLigandFromCatalog` (mapping `preferredLigandCode` through `LIGAND_CODE_ALIASES` when `ligandMode !== 'chain'`).
- In `loadMolstarAndInit`:
  - Increment a `loadGenerationRef.current` counter so stale `fetchPdbCoordinates` completions or `viewer.events.loadComplete` callbacks exit immediately if `generation !== loadGenerationRef.current || !isMounted`.
  - If `fetchPdbCoordinates` fails or `identifyLigandResidue` returns `null`, set `ligand = resolveFallbackLigandFromCatalog(preferredLigandCode || drugEntry?.ligandCode, ligandChain || drugEntry?.ligandChain, effectiveLigandMode)`.
  - Create `const mountNode = document.createElement('div'); mountNode.className = 'w-full h-full relative'; containerRef.current.replaceChildren(mountNode);` and pass `mountNode` to `viewer.render(mountNode, molstarOptions)`.
  - Set `hideStructure: effectiveLigandMode === 'carbs' ? ['het', 'water', 'nonStandard'] : ['het', 'water', 'carbs', 'nonStandard']`, and leave `visualStyle: undefined`.
  - In the `useEffect` cleanup, call `viewer.plugin?.dispose?.()` (fallback `viewer.clear?.()` / `viewer.destroy?.()`), remove `mountNode`, and restrict the `useEffect` dependency array strictly to `[cleanPdbId, preferredLigandCode, effectiveLigandMode, reloadTrigger]`.
- In `renderScene`:
  - Derive binding sites from `drugEntry?.bindingSites` (falling back to `medChemProfile` if `drugEntry` is omitted).
  - Use `buildMolstarLigandQuery` for the ligand (`color: null` base `ball-and-stick` + `type_symbol: 'C'` cyan carbon overpaint) and `buildMolstarResidueQuery` for pocket residues (`color: null` base `ball-and-stick` + `type_symbol: 'C'` site `colorAccent` or emerald overpaint).
  - When `activeBindingSite` is non-null, focus `[singleLigandQuery, ...activeSiteResidueQueries]` and highlight `activeSiteResidueQueries`; when `null` (`All Binding Sites`), focus `[singleLigandQuery, ...allResidueQueries]`.
- Replace the 9-button toolbar and bottom pharmacophore chip strip with the simplified Drug Studio header & controls (`Exact Drug Crystal` / `Class Pocket Crystal` badge, `Reset View`, `Protein Ribbon`, `Sub-Pocket Colors`, `Guide`, `Fullscreen`, plus on-canvas zoom buttons and error-state WebGL diagnostic / 2D schematic recovery).
- Update `tests/threeDLabCanvas.test.ts`, `tests/threeDLabMolstarCanvas.test.ts`, `tests/threeDLabCanvasControls.test.ts`, and `tests/threeDLabFallback.test.ts` so assertions match the simplified 5-action toolbar while still verifying WebGL error recovery (`Switch to 2D Pocket Schematic`, `Retry 3D WebGL`).

- [ ] **Step 4: Run all canvas tests to verify they pass**

Run: `npx tsx tests/threeDLabSingleLigandPocket.test.ts; npx tsx tests/threeDLabCanvas.test.ts; npx --yes tsx --test tests/threeDLabMolstarCanvas.test.ts; npx tsx tests/threeDLabCanvasControls.test.ts; npx --yes tsx --test tests/threeDLabFallback.test.ts; npx --yes tsx --test tests/threeDLabCorsAndFullscreen.test.ts`
Expected: PASS on all six suites

- [ ] **Step 5: Commit**

```powershell
git add src/components/ThreeDLabCanvas.tsx tests/threeDLabSingleLigandPocket.test.ts tests/threeDLabCanvas.test.ts tests/threeDLabMolstarCanvas.test.ts tests/threeDLabCanvasControls.test.ts tests/threeDLabFallback.test.ts; git commit -m "fix(3d-lab): dispose Mol* instances cleanly, fix mmCIF queries, and simplify canvas toolbar"
```

---

### Task 3: Three-Column `1.–39.` Drug Studio, Binding-Site Walkthrough & App Entry-Point Wiring

**Files:**
- Modify: `src/components/ThreeDLabLibrary.tsx`
- Modify: `src/components/ThreeDLabTutorialModal.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/PubChemInspectorModal.tsx`
- Create: `tests/threeDLabDrugStudio.test.ts`
- Modify: `tests/threeDLabLibraryIntegration.test.ts`
- Modify: `tests/threeDLabUsabilityIntegration.test.ts`
- Modify: `tests/threeDLabPharmacophoreIntegration.test.ts`
- Modify: `tests/threeDLabTutorialModal.test.ts`

**Interfaces:**
- Consumes: `THERAPEUTIC_CLASS_3D_GROUPS`, `DRUG_3D_CATALOG`, `getDrug3DById`, `resolveDrug3DEntry` from `src/data/drug3dCatalog.ts` (Task 1); `ThreeDLabCanvas` with `drugEntry`, `activeBindingSite`, `onSelectBindingSite` from `src/components/ThreeDLabCanvas.tsx` (Task 2).
- Produces:
  - `ThreeDLabLibrary` (`ThreeDLabLibraryProps`: `{ initialDrugName?: string; initialPdbId?: string; initialFullscreen?: boolean; structures?: ChemicalStructure[]; onBackToReview?: () => void }`) + exported pure helpers `toggleExpandedClass`, `selectDrugAndCollapse`, and `filterTherapeuticClassGroups` for deterministic unit testing of collapse-on-select and search filtering.
  - Updated `handleOpenIn3DLab` in `src/App.tsx` and `hasPdbCoCrystal` / `targetPdbId` in `src/components/PubChemInspectorModal.tsx` backed by `resolveDrug3DEntry`.

- [ ] **Step 1: Write the failing test in `tests/threeDLabDrugStudio.test.ts`**

```ts
import assert from 'node:assert/strict';
import fs from 'node:fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  ThreeDLabLibrary,
  filterTherapeuticClassGroups,
  toggleExpandedClass,
  selectDrugAndCollapse,
} from '../src/components/ThreeDLabLibrary';
import { THERAPEUTIC_CLASS_3D_GROUPS } from '../src/data/drug3dCatalog';

async function runTests() {
  // 1. Default mount: Clopidogrel active, ALL 1..39 classes rendered and collapsed (no <select> visible until expanded)
  const defaultHtml = renderToString(React.createElement(ThreeDLabLibrary, {}));
  assert.ok(defaultHtml.includes('Clopidogrel'), 'Defaults to Clopidogrel');
  assert.ok(defaultHtml.includes('1. Analgesic'), 'Renders Class 1 header');
  assert.ok(defaultHtml.includes('39. Thyroid Product'), 'Renders Class 39 header');
  assert.ok(!defaultHtml.includes('<select'), 'All 1..39 class dropdowns are collapsed by default on mount');
  assert.ok(defaultHtml.includes('All Binding Sites'), 'Right panel defaults to All Binding Sites overview');
  assert.ok(!defaultHtml.includes('ChEMBL') && !defaultHtml.includes('Custom PDB'), 'Removed ChEMBL sidebar and Custom PDB form');

  // 2. Expand/collapse & select-from-dropdown state transitions
  assert.equal(toggleExpandedClass(null, 1), 1, 'Clicking collapsed Class 1 expands it');
  assert.equal(toggleExpandedClass(1, 1), null, 'Clicking expanded Class 1 collapses it');
  assert.equal(toggleExpandedClass(1, 13), 13, 'Clicking Class 13 switches expansion to Class 13');

  const afterSelect = selectDrugAndCollapse('aspirin');
  assert.equal(afterSelect.selectedDrugId, 'aspirin');
  assert.equal(afterSelect.expandedClassNumber, null, 'Selecting a drug collapses the class row');
  assert.equal(afterSelect.activeBindingSiteId, null, 'Selecting a drug resets activeBindingSiteId to All Sites');

  // 3. Review Focus: Search filtering narrows classes/drugs without breaking selection
  const aspirinFiltered = filterTherapeuticClassGroups(THERAPEUTIC_CLASS_3D_GROUPS, 'aspirin');
  assert.equal(aspirinFiltered.length, 1);
  assert.equal(aspirinFiltered[0].classNumber, 1);
  assert.ok(aspirinFiltered[0].drugs.some((d) => d.genericName === 'Aspirin'));

  // 4. Handoff via initialDrugName="Aspirin" renders Aspirin (1PTH), reaction explanation, and Ser530 binding site card
  const aspirinHtml = renderToString(
    React.createElement(ThreeDLabLibrary, { initialDrugName: 'Aspirin' })
  );
  assert.ok(aspirinHtml.includes('Aspirin') && aspirinHtml.includes('1PTH'), 'Renders Aspirin 1PTH complex');
  assert.ok(aspirinHtml.includes('Ser530'), 'Renders Ser530 binding site card for Aspirin');

  // 5. Handoff for class-sibling drug (Losartan -> 4ZUD Olmesartan) explains shared pocket clearly
  const losartanHtml = renderToString(
    React.createElement(ThreeDLabLibrary, { initialDrugName: 'Losartan' })
  );
  assert.ok(losartanHtml.includes('Olmesartan') && losartanHtml.includes('4ZUD'), 'Explains reference crystal ligand for Losartan');

  // 6. PubChemInspectorModal & App.tsx wire resolveDrug3DEntry so newly cataloged drugs enable Open in 3D Lab
  const modalSource = fs.readFileSync('src/components/PubChemInspectorModal.tsx', 'utf8');
  const appSource = fs.readFileSync('src/App.tsx', 'utf8');
  assert.ok(modalSource.includes('resolveDrug3DEntry'), 'PubChemInspectorModal checks resolveDrug3DEntry');
  assert.ok(appSource.includes('resolveDrug3DEntry'), 'App.tsx handleOpenIn3DLab resolves via resolveDrug3DEntry');

  console.log('PASS: tests/threeDLabDrugStudio.test.ts');
}

runTests();
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/threeDLabDrugStudio.test.ts`
Expected: FAIL with `filterTherapeuticClassGroups is not a function`

- [ ] **Step 3: Implement the 3-column Drug Studio in `src/components/ThreeDLabLibrary.tsx`, update `ThreeDLabTutorialModal.tsx`, wire `App.tsx` + `PubChemInspectorModal.tsx`, and update integration test suites**

- In `src/components/ThreeDLabLibrary.tsx`:
  - Export pure helpers `toggleExpandedClass(current: number | null, clicked: number): number | null`, `selectDrugAndCollapse(drugId: string): { selectedDrugId: string; expandedClassNumber: null; activeBindingSiteId: null }`, and `filterTherapeuticClassGroups(groups: TherapeuticClass3DGroup[], query: string): TherapeuticClass3DGroup[]`.
  - Resolve initial drug via `resolveDrug3DEntry(initialDrugName, initialPdbId) || getDrug3DById('clopidogrel')!`, syncing when `initialDrugName` / `initialPdbId` props change.
  - Initialize `expandedClassNumber = null`, `activeBindingSiteId = null`, `isLeftCollapsed = false`, `isRightCollapsed = false`.
  - **Left Column (`lg:col-span-3`, collapsible):** Active Drug summary card, search input (`Filter classes or drugs...`), and the `1.–39.` collapsible class rows. When `expandedClassNumber === group.classNumber`, render `<select aria-label={`Select drug in ${group.categoryName}`} value={activeEntry.therapeuticClassNumber === group.classNumber ? activeEntry.id : ''} onChange={...}>` with placeholder `"Choose a drug..."` and alphabetical options `${drug.genericName}${drug.brandNames[0] ? ` (${drug.brandNames[0]})` : ''}`, collapsing immediately (`setExpandedClassNumber(null)`) when an option is chosen.
  - **Center Column (`lg:col-span-5` when both sidebars open, `lg:col-span-8`/`9` when one collapsed, `lg:col-span-12` when both collapsed):** Render `<ThreeDLabCanvas key={`${activeEntry.pdbId}-${activeEntry.ligandCode}-${activeEntry.ligandMode || 'het'}`} pdbId={activeEntry.pdbId} preferredLigandCode={activeEntry.ligandCode} ligandChain={activeEntry.ligandChain} ligandMode={activeEntry.ligandMode} drugEntry={activeEntry} targetName={activeEntry.targetName} geneSymbol={activeEntry.geneSymbol} activeBindingSite={activeBindingSite} onSelectBindingSite={(site) => setActiveBindingSiteId(site?.id ?? null)} isFullscreen={isFullscreen} onToggleFullscreen={() => setIsFullscreen((f) => !f)} onOpenTutorial={() => setIsTutorialOpen(true)} />`.
  - **Right Column (`lg:col-span-4`, collapsible):** Render **How `{activeEntry.genericName}` Binds & Reacts** (`pharmacologicClass`, `targetName`, `overallMechanism`, optional `prodrugNote`, and reference-ligand explanation note when `!activeEntry.isExactDrugCrystal`) + **Relevant Binding Sites** (`All Binding Sites (Full Pocket)` button + numbered `activeEntry.bindingSites` cards showing color swatch, `siteName`, `residues` labels, `drugMoiety`, `interactionType`, `reactionSummary`, and `clinicalRelevance`).
  - **Fullscreen Mode (`fixed inset-0 z-50 bg-slate-950 w-screen h-screen overflow-hidden flex flex-col`):** Floating triggers for `"Drugs (1–39)"` and `"Binding & Mechanism"` slide-over drawers, with `Escape` closing any open drawer first before exiting Fullscreen.
- In `src/components/ThreeDLabTutorialModal.tsx`, update Step 2–4 descriptions to reference choosing from `1.–39.` therapeutic classes and clicking **Relevant Binding Sites** while retaining step titles/keywords checked by `tests/threeDLabTutorialModal.test.ts`.
- In `src/App.tsx` (`handleOpenIn3DLab`) and `src/components/PubChemInspectorModal.tsx` (`hasPdbCoCrystal` / `targetPdbId`), check `resolveDrug3DEntry(drugName)` before `findCanonicalTargetForDrug(drugName)`.
- Update `tests/threeDLabLibraryIntegration.test.ts`, `tests/threeDLabUsabilityIntegration.test.ts`, and `tests/threeDLabPharmacophoreIntegration.test.ts` to assert the new `1.–39.` Drug Studio & Binding-Site Walkthrough contracts in place of the removed ChEMBL/drawer assertions.

- [ ] **Step 4: Run all test suites and TypeScript build check**

Run: `npx tsx tests/drug3dCatalog.test.ts; npx tsx tests/threeDLabDrugStudio.test.ts; npx tsx tests/threeDLabLibraryIntegration.test.ts; npx tsx tests/threeDLabUsabilityIntegration.test.ts; npx tsx tests/threeDLabPharmacophoreIntegration.test.ts; npx tsx tests/threeDLabTutorialModal.test.ts; npx tsx tests/threeDLabSingleLigandPocket.test.ts; npx tsx tests/structure3dService.test.ts; npx tsx tests/canonicalPharmacophorePkData.test.ts; npm run lint; npm run build`
Expected: All test suites PASS, `tsc --noEmit` exits 0, `vite build` succeeds cleanly

- [ ] **Step 5: Commit**

```powershell
git add src/components/ThreeDLabLibrary.tsx src/components/ThreeDLabTutorialModal.tsx src/App.tsx src/components/PubChemInspectorModal.tsx tests/threeDLabDrugStudio.test.ts tests/threeDLabLibraryIntegration.test.ts tests/threeDLabUsabilityIntegration.test.ts tests/threeDLabPharmacophoreIntegration.test.ts tests/threeDLabTutorialModal.test.ts; git commit -m "feat(3d-lab): build 3-column 1-39 therapeutic class studio and binding-site walkthrough"
```
