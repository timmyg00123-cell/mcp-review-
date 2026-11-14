# Drug-Centered 3D Molecular Lab Redesign Specification

**Date:** 2026-11-13
**Status:** Ready for User Review & Approval

---

## 1. Intent and Why

The 3D Molecular Lab currently suffers from two major problems:
1. **Broken 3D rendering when switching drugs:** Loading the initial default drug (Clopidogrel) works, but switching to Aspirin or other drugs renders a blank canvas or a bare protein with no visible ligand. Root causes include reusing a live React 18 / Mol\* DOM container via `innerHTML = ''` without calling `viewer.plugin.dispose()`, re-running WebGL initialization whenever `renderScene` changes identity, passing conflicting `struct_asym_id`/`residue_number` (`label_asym_id`/`label_seq_id`) alongside `auth_asym_id`/`auth_seq_id` on mmCIF hetero ligands and signal-cleaved chains, setting `visualStyle: 'cartoon'` across hetero components, auto-selecting idealized pharmacophore atom names on load, and lacking curated 3D complexes/profiles for Aspirin and most dropdown drugs.
2. **Target-heavy, cluttered UX:** Choosing a drug currently mixes an unsorted molecule dropdown, a raw 4-letter PDB code input, and a receptor-centric target list, while binding-site exploration splits attention across nine technical toolbar toggles, bottom pharmacophore chips, a ChEMBL IC50 bioactivity sidebar, and a hidden slide-over drawer.

This redesign reorganizes the entire 3D Molecular Lab around the **drug**: students browse the familiar **`1.–39.` therapeutic classes** (covering both Top 200 medications and curriculum review-module drugs), pick a drug from a clean collapsible class dropdown, reliably see its 3D receptor complex render every time they switch, step through **only that drug's relevant 2–4 binding sites**, and read a built-in plain-language **explanation** of how the drug fits, reacts, and behaves clinically.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **Bulletproof 3D switching:** Switching between any sequence of drugs (e.g., Clopidogrel $\rightarrow$ Aspirin $\rightarrow$ Lisinopril $\rightarrow$ Atorvastatin $\rightarrow$ Metoprolol $\rightarrow$ Amoxicillin) cleanly disposes the previous Mol\* WebGL/React instance, mounts into a fresh inner DOM node, and renders the single bound ligand and its active-site contacts without blank screens or missing ligands.
- **True Aspirin & full `1.–39.` class 3D coverage:** Map Aspirin to its real inactivated COX-1 / salicylate structure (`1PTH`, ligand `SAL` adjacent to modified `Ser530` and `Arg120`) and provide verified RCSB PDB receptor complexes across all `1.–39.` therapeutic classes.
- **`1.–39.` Therapeutic Class Drug Picker:** Replace the unsorted dropdown, custom PDB input, and receptor target cards with the `1.–39.` therapeutic class list from `src/data/topDrugsTaxonomyData.ts`. All classes start **collapsed by default**, expand when clicked to reveal a `<select>` dropdown of their 3D-supported drugs (including extra curriculum review-module drugs mapped into their `1.–39.` class), and collapse when clicked again or once a drug is selected from the dropdown.
- **Honest Exact vs. Class-Sibling Pocket Badging:** Include all Top 200 and clinical review-module drugs that act on a 3D protein target. Load the drug's exact co-crystal when available in PDB, or load its shared receptor pocket co-crystallized with a close class sibling accompanied by a clear reference note explaining which crystallized ligand represents the pocket.
- **Simplified Binding-Site Walkthrough & Built-In Explanation:** Replace the ChEMBL IC50 sidebar, hidden `PharmacophorePkDrawer`, bottom pharmacophore chip bar, and extra toolbar toggles with a single always-visible **Drug Binding & Mechanism** panel showing:
  1. Overall plain-language explanation of how the selected drug binds and reacts (covalent vs. reversible, prodrug bioactivation if applicable, physiologic outcome).
  2. Clickable **Binding Site cards** (`All Binding Sites (Overview)` default + the 2–4 relevant binding sites/sub-pockets for that drug) that zoom/highlight those exact residues in 3D and explain which part of the drug interacts with which amino acid or metal ion and why it matters clinically/SAR-wise.

### Non-Goals
- Running live *in silico* computational docking for uncrystallized drugs (experimental RCSB PDB crystal structures are used exclusively).
- Listing non-receptor physical/osmotic/electrolyte/polymeric-resin agents (e.g., Mannitol, Isosorbide, Potassium Chloride, Ferrous Sulfate, Polyethylene Glycol 3350, Lactulose, Docusate, Sevelamer, Cholestyramine, Chlorhexidine, Phenazopyridine, Lithium Carbonate, Sodium Nitroprusside) or large multi-chain protein biologics/antibodies/insulins/thrombolytic enzymes (e.g., Insulin Glargine/Lispro/Aspart/Degludec, Evolocumab, Epoetin Alfa, Adalimumab, Etanercept, Denosumab, Omalizumab, Alteplase/Reteplase/Tenecteplase/Streptokinase/Urokinase) in the 3D Lab browse dropdowns.
- Redesigning non-3D-Lab tabs (Document Review, Flashcards, Practice Lab, Knowledge Graph), beyond wiring `resolveDrug3DEntry` into `App.tsx` (`handleOpenIn3DLab`) and `PubChemInspectorModal.tsx` (`hasPdbCoCrystal`) so "Open in 3D Lab" works for all newly cataloged drugs.

### Anti-Goals
- Never render a blank dark canvas or hide all hetero ligands when `.ent` text pre-fetching times out.
- Never require students to know 4-character PDB IDs, crystallographic chain letters, or ChEMBL pChEMBL tables to explore how a drug binds.
- Never display a sibling reference ligand in 3D as if its chemical structure were identical to the selected drug without an explicit visible reference badge.
- Never leak anonymous exam quiz distractors (`Structure X`, `Structure Y`, `Structure Z`) into the `1.–39.` browse dropdowns.

---

## 3. Technical & Codebase Constraints

1. **Mol\* (`pdbe-molstar@3.12.0`) DOM & WebGL Lifecycle (`src/components/ThreeDLabCanvas.tsx`):**
   - `PDBeMolstarPlugin.render(target, options)` mounts a React 18 root onto `target` via `createPluginUI(..., renderReact18)` and triggers `this.load(...)` asynchronously without awaiting network completion.
   - Reusing `containerRef.current` via `innerHTML = ''` corrupts React 18's cached root and leaks WebGL contexts. Every structure load **must** create a fresh child `HTMLDivElement` (`document.createElement('div')` styled `w-full h-full`) appended to `containerRef.current`, and cleanup **must** call `viewer.plugin?.dispose()` (falling back to `viewer.clear?.()` / `viewer.destroy?.()`) before removing that child element.
   - In `ThreeDLabLibrary.tsx`, `<ThreeDLabCanvas key={`${activeEntry.pdbId}-${activeEntry.ligandCode}`} ... />` is keyed by structure + ligand to guarantee clean React state reset across structure switches.
   - The Mol\* initialization `useEffect` dependency array must only contain `[cleanPdbId, preferredLigandCode, ligandMode, reloadTrigger]`—never `renderScene` or `medChemProfile`. Scene styling updates triggered by selecting a binding site or toggling ribbon/colors call `renderScene` on the existing `viewerRef.current` without re-initializing Mol\*, and initial `renderScene` re-runs inside `viewer.events.loadComplete.subscribe(...)` guarded by a mount/generation check.
2. **Mol\* mmCIF / `.bcif` Selector Compatibility & Ligand Modes:**
   - `QueryHelper.getQueryObject` in `pdbe-molstar@3.12.0` ANDs all provided fields on a `QueryParam`. In binary CIF (`.bcif`), non-polymer `HETATM` ligands/ions have a distinct `label_asym_id` (`struct_asym_id`) from the protein chain and `label_seq_id` (`residue_number`) of `.`/`0`. Passing `struct_asym_id` or `residue_number` alongside `auth_asym_id` / `auth_seq_id` produces an empty selection (`0` atoms).
   - **Builder Call — Three Ligand Selector Modes (`ligandMode: 'het' | 'chain' | 'carbs'`):**
     1. **`'het'` (default, small-molecule `HETATM` ligands & catalytic metals):** Query strictly with `{ label_comp_id: resn, ...(chain ? { auth_asym_id: chain } : {}), ...(typeof resi === 'number' ? { auth_seq_id: resi } : {}) }`. Never include `chem_comp_id`, `struct_asym_id`, or `residue_number`. Set `hideStructure: ['het', 'water', 'carbs', 'nonStandard']`.
     2. **`'chain'` (short cyclic/peptide ligands represented as a separate polymer chain in PDB, e.g., GLP-1 agonists `Semaglutide`/`Liraglutide`/`Dulaglutide`/`Tirzepatide` in Class 6 via GLP-1R `7KI0`, `Cyclosporine` in Class 25 via `1CWA`, `Oxytocin`/`Desmopressin`/`Terlipressin` in Class 24, `Eptifibatide` in Class 13):** Query ligand as `{ auth_asym_id: ligandChain }` rendered in `ball-and-stick` via `viewer.visual.select` (so it remains visible even when the receptor `polymer` ribbon is dimmed or toggled).
     3. **`'carbs'` (pentasaccharide/glycosaminoglycan ligands in Class 12: `Fondaparinux`, `Enoxaparin`, `Heparin` bound to Antithrombin III `1E03`/`1AZX`):** Exclude `'carbs'` from `hideStructure` (`hideStructure: ['het', 'water', 'nonStandard']`) and select the oligosaccharide entity/chain in `ball-and-stick`.
   - **Rule for polymer pocket residues:** Query strictly with `{ auth_asym_id: chain, auth_seq_id: resi }` (never pairing `residue_number` with `auth_seq_id`, since signal-peptide-cleaved proteins like ACE `1O86` offset `label_seq_id` from `auth_seq_id`).
   - **Rule for default `visualStyle`:** Leave `molstarOptions.visualStyle` as `undefined` (do **not** pass `'cartoon'`, which `resolveVisualStyleSpec` applies to `'het'` as well as `'polymer'`).
   - **Static Ligand Fallback:** When `fetchPdbCoordinates(cleanPdbId)` fails or times out, construct a fallback `DetectedLigandInfo` directly from the catalog entry (`{ resn: resolvedLigandCode, chain: entry.ligandChain, atomCount: 0, instanceCount: 1 }`) so `viewer.visual.select` still renders the bound ligand in `.bcif` without depending on secondary `.ent` text downloads.
   - **No Idealized Atom-Name Filter on Load:** Selecting a drug always defaults to `All Binding Sites (Overview)` (`activeBindingSiteId = null`). Focusing a specific binding site highlights and frames the **single ligand + that binding site's specific `auth_asym_id`/`auth_seq_id` pocket residues** rather than filtering by idealized ligand atom names.
3. **Backward Compatibility with Existing Modules & Core Unit Tests:**
   - Keep `ThreeDLabLibraryProps` (`initialDrugName`, `initialPdbId`, `initialFullscreen`, `structures`, `onBackToReview`) intact for `src/App.tsx`.
   - **Builder Call — Entry-Point Enablement:** Update `App.tsx` (`handleOpenIn3DLab`) and `PubChemInspectorModal.tsx` (`hasPdbCoCrystal` / `targetPdbId`) to check `resolveDrug3DEntry(drugName)` so the `"Open in 3D Lab (Fullscreen)"` button enables for all newly cataloged drugs rather than only the legacy 12 targets.
   - Keep existing exports in `src/utils/canonicalTargets.ts`, `src/data/canonicalPharmacophorePkData.ts`, and `src/services/structure3dService.ts` intact so `tests/structure3dService.test.ts` and `tests/canonicalPharmacophorePkData.test.ts` continue passing without regressions.
   - Update legacy `tests/threeDLab*.test.ts` suites where they previously asserted removed UI source strings (`ChEMBL SAR`, `PharmacophorePkDrawer`, `activeRightDrawer`, or removed toolbar buttons) to verify the new Drug-Centered 3D Lab contracts instead.

---

## 4. Approaches Considered

1. **Approach 1: Unified `1.–39.` Drug-Pocket Catalog + 3-Column Drug Studio (Selected)**
   - Build a unified `src/data/drug3dCatalog.ts` combining `topDrugsTaxonomyData.ts`, extra review-module drugs from `moduleStorage.ts`, verified PDB receptor pocket profiles across all `1.–39.` classes, and drug-specific mechanism notes from `topDrugsClinicalData.ts`. Render three focused columns in `ThreeDLabLibrary.tsx`: Left = collapsible `1.–39.` therapeutic class list with per-class drug `<select>` dropdowns; Center = clean 3D pocket canvas with minimal toolbar; Right = always-visible **Drug Binding & Mechanism** walkthrough with clickable Binding Site cards.
   - *Tradeoffs:* Keeps class browsing, 3D visualization, and binding-site explanations simultaneously accessible with a single unified data model; slightly narrower default center canvas than a 2-column layout, solved via left/right collapse toggles and Fullscreen mode.
2. **Approach 2: Unified `1.–39.` Drug-Pocket Catalog + Top Collapsible Drug Bar (2-Column Split)**
   - Same unified catalog and right-hand explanation panel, but places the `1.–39.` class accordion inside a top collapsible chooser bar above a 2-column 3D + Explanation split.
   - *Tradeoffs:* Wider default 3D viewport after drug selection, but requires reopening a top bar every time the student switches drugs across classes.
3. **Approach 3: Minimal Patch Over Existing Cardiovascular/Canonical Targets Only**
   - Keep `canonicalTargets.ts`, `targetPocketData.ts`, and `canonicalPharmacophorePkData.ts` separate without expanding receptor coverage beyond existing ~15 targets.
   - *Tradeoffs:* Smallest diff, but leaves over two-thirds of the `1.–39.` therapeutic classes empty and preserves fragmented schemas.

**User Decision:** **Approach 1** was selected.

---

## 5. Architecture & Detailed Design

### 5.1 Unified 1–39 Drug-Pocket Catalog (`src/data/drug3dCatalog.ts`)

Create a deterministic catalog module merging `TOP_DRUGS_TAXONOMY`, `THERAPEUTIC_CATEGORIES` (`1. Analgesic` – `39. Thyroid Product`), and clinical review-module drugs:

1. **Builder Call — Combination Products & Route/Salt Deduplication (`TOP_DRUGS_TAXONOMY`):**
   - **Route & Salt Deduplication:** Merge route-only or salt-pair duplicates of the same active molecule within the same class into a single clean drug entry (e.g., `Fluticasone Oral Inhaler` + `Fluticasone Nasal Inhaler` $\rightarrow$ `Fluticasone`; `Clindamycin Oral` + `Clindamycin Topical` $\rightarrow$ `Clindamycin`; `Estradiol Oral` + `Estradiol Transdermal Patch` $\rightarrow$ `Estradiol`; `Metoprolol Tartrate / Succinate` $\rightarrow$ `Metoprolol`; `Divalproex / Valproic Acid` $\rightarrow$ `Valproic Acid`; `Morphine ER` $\rightarrow$ `Morphine`; `Lidocaine Topical Patch` $\rightarrow$ `Lidocaine`).
   - **Multi-Ingredient Combinations $\rightarrow$ Standalone Single-Molecule Entries:** Because the 3D Lab centers on **one single ligand in one receptor pocket**, decompose fixed-dose combination rows into individual active drug entries inside that therapeutic class whenever an ingredient is not already present standalone (e.g., Class 1 adds `Hydrocodone`, `Butalbital`, `Caffeine`, `Buprenorphine`, `Naloxone`; Class 2 adds `Clavulanate`, `Trimethoprim`, `Sulfamethoxazole`; Class 9 adds `Clotrimazole`, `Betamethasone`; Class 11 adds `Triamterene`; Class 13 adds `Dipyridamole`; Class 16 adds `Levodopa`, `Carbidopa`; Class 18 adds `Emtricitabine`, `Tenofovir`; Class 21 adds `Diphenoxylate`, `Atropine`; Class 24 maps Oral Contraceptives to `Ethinyl Estradiol` & `Levonorgestrel`/`Norethindrone`; Class 36 adds `Salmeterol`, `Formoterol`, `Ipratropium`). `resolveDrug3DEntry()` still resolves combination strings (e.g., `"Trimethoprim / Sulfamethoxazole"`) to their primary component if passed from another tab.
   - **Top 200 Class Fidelity:** Every standalone Top 200 drug retains its exact `therapeuticClassNumber` from `TOP_DRUGS_TAXONOMY` (e.g., `Aspirin` stays in `1. Analgesic` per `TOP_DRUGS_TAXONOMY`, while search/filter matches it seamlessly).

2. **Builder Call — Complete Supplemental Clinical Review-Module Drug Assignments:**
   - Assign all clinical receptor-targeted review-module drugs not in `TOP_DRUGS_TAXONOMY` into their matching `1.–39.` therapeutic class:
     - **Class 6 (`Injectable Antidiabetic`):** GLP-1/GIP peptide receptor agonists (`Liraglutide`, `Semaglutide`, `Dulaglutide`, `Tirzepatide` via GLP-1R `7KI0`, `ligandMode: 'chain'`) are included so all **39 classes (`1.`–`39.`)** have $\ge 1$ valid 3D entry; multi-chain insulins are excluded.
     - **Class 10 (`Anti-Lipemic`):** `Lomitapide`.
     - **Class 11 (`Antihypertensive`):** `Captopril`, `Fosinopril`, `Candesartan cilexetil`, `Telmisartan`, `Aliskiren`, `Sacubitril`, `Dobutamine`, `Milrinone`, `Ivabradine`, `Bumetanide`, `Torsemide`, `Ethacrynic acid`, `Chlorothiazide`, `Trichlormethiazide`, `Polythiazide`, `Metolazone`, `Amiloride`, `Eplerenone`, `Pindolol`, `Nadolol`, `Esmolol`, `Methyldopa`, `Reserpine`, `Prazosin`, `Diazoxide`, `Minoxidil`, `Clevidipine`, `Isradipine`, `Acetazolamide`, `Tolvaptan`.
     - **Class 12 (`Anticoagulant`):** `Argatroban`, `Fondaparinux` (plus Top 200 `Warfarin`, `Apixaban`, `Rivaroxaban`, `Dabigatran`, `Enoxaparin`, `Heparin`; `Dabigatran etexilate` resolves to `Dabigatran`).
     - **Class 13 (`Antiplatelet`):** `Prasugrel`, `Ticagrelor`, `Cangrelor`, `Ticlopidine`, `Vorapaxar`, `Tirofiban`, `Eptifibatide`, `Cilostazol`.
     - **Class 14 (`Antiarrhythmic`):** `Quinidine`, `Procainamide`, `Disopyramide`, `Mexiletine`, `Flecainide`, `Propafenone`, `Sotalol`, `Dronedarone`.
     - **Class 15 (`Antianginal`):** `Ranolazine`, `Isosorbide Dinitrate` (alongside `Isosorbide Mononitrate`, `Nitroglycerin`, `Diltiazem`).
     - **Class 16 (`Anti-Parkinson's`):** `Trihexyphenidyl`.
     - **Class 22 (`Genitourinary`):** `Darifenacin`.
     - **Class 24 (`Hormonal`):** `Cortisone`, `Dexamethasone`, `Desmopressin (DDAVP)`, `Oxytocin`, `Terlipressin`.
     - **Class 34 (`Dermatological`):** `Clobetasol propionate` (alongside `Triamcinolone`, `Hydrocortisone`, `Isotretinoin`, `Adapalene`).
     - **Class 36 (`Respiratory`):** `Vilanterol`, `Olodaterol`, `Indacaterol`, `Pirbuterol`, `Isoproterenol`, `Umeclidinium bromide`, `Aclidinium bromide`, `Glycopyrrolate`, `Fluticasone furoate`, `Mometasone furoate`, `Beclomethasone dipropionate`, `Ciclesonide`, `Theophylline`, `Roflumilast`, `Ensifentrine`, `Zileuton`.
   - **Exclusion of Quiz Distractors & Standalone Endogenous Ligands:** Anonymous exam quiz congeners (`Structure X`, `Structure Y`, `Structure Z`) and standalone endogenous ligands/isolated metabolites (`Adenosine Diphosphate (ADP)`, `Norepinephrine`, `Aldosterone`, `Arginine Vasopressin (AVP)`, `alpha-Methylnorepinephrine`, `Dehydronifedipine`, `EXP3174`, `Enalaprilat`) are excluded from the `1.–39.` browse dropdowns so students only browse clinical drugs (while `resolveDrug3DEntry()` aliases metabolites/endogenous ligands to their parent drug/receptor pocket if opened externally).

#### Core Data Interfaces (`src/types/structure3d.ts` / `src/data/drug3dCatalog.ts`)
```ts
export type LigandRenderMode = 'het' | 'chain' | 'carbs';

export interface DrugBindingSite {
  id: string;
  siteName: string;              // e.g., "Ser530 Covalent Acetylation Site"
  drugMoiety: string;            // e.g., "Labile O-Acetyl Ester Group"
  interactionType:
    | 'covalent'
    | 'ionic'
    | 'hydrogen-bond'
    | 'pi-stacking'
    | 'coordination'
    | 'hydrophobic';
  colorAccent: string;           // Hex accent applied to pocket residue carbons
  residues: {
    resn: string;                // e.g., "SER"
    resi: number;                // PDB auth_seq_id, e.g., 530
    chain: string;               // PDB auth_asym_id, e.g., "A"
    label: string;               // e.g., "Ser530 (Catalytic Channel)"
  }[];
  reactionSummary: string;       // Plain-language explanation of the bond/reaction
  clinicalRelevance: string;     // Why this interaction drives efficacy, selectivity, or toxicity
}

export interface Drug3DCatalogEntry {
  id: string;                    // Normalized slug, e.g., "aspirin"
  genericName: string;           // Display generic name, e.g., "Aspirin"
  brandNames: string[];          // e.g., ["Bayer", "Ecotrin"]
  therapeuticClassNumber: number;// 1..39
  therapeuticCategory: string;   // e.g., "1. Analgesic"
  pharmacologicClass: string;    // e.g., "Irreversible COX-1/COX-2 Inhibitor (Salicylate)"
  source: 'top-200' | 'review-module' | 'both';
  pdbId: string;                 // Verified 4-char RCSB PDB ID, e.g., "1PTH"
  ligandCode: string;            // Verified 3-char RCSB comp_id (or chain ID when ligandMode === 'chain')
  ligandChain?: string;          // Preferred auth_asym_id (default "A")
  ligandMode?: LigandRenderMode; // Default 'het'
  isExactDrugCrystal: boolean;   // true if PDB contains this exact drug/active metabolite; false if class-sibling crystal
  crystallizedLigandName: string;// e.g., "Salicylate + Modified Ser530" or "Olmesartan (AT1R Class Reference)"
  targetName: string;            // e.g., "Cyclooxygenase-1 (COX-1 / PTGS1)"
  geneSymbol: string;            // e.g., "PTGS1"
  overallMechanism: string;      // Plain-language overview of how THIS drug enters, reacts, and works clinically
  prodrugNote?: string;          // Present when bioactivation is required (e.g., Clopidogrel, Enalapril, Sacubitril, Omeprazole)
  bindingSites: DrugBindingSite[]; // 2 to 4 relevant binding sites for this pocket
}
```

---

### 5.2 Three-Column Drug-Centered Studio (`src/components/ThreeDLabLibrary.tsx`)

#### Default Selection & Prop Handoff
- If `initialDrugName` is passed (e.g., from `PubChemInspectorModal` or `App.tsx`), resolve via `resolveDrug3DEntry(initialDrugName, initialPdbId)`; otherwise default to **Clopidogrel** (`clopidogrel`).
- On initial mount (and whenever a drug is selected from a dropdown), **all `1.–39.` class rows are collapsed** (`expandedClassNumber = null`), and `activeBindingSiteId = null` (`All Binding Sites`).

#### Column 1 (Left, `lg:col-span-3`, collapsible): `1.–39.` Therapeutic Class Picker
- **Active Drug Summary Card** at the top of the column showing the currently selected drug (`Generic Name`, primary brand, and class badge) so the user always sees what is loaded even while all 39 classes are collapsed.
- **Quick Search Input** (`Filter classes or drugs...`): typing filters the `1.–39.` class list to matching classes/drugs; clearing restores the full collapsed list.
- **`1.–39.` Collapsible Class Rows:**
  - Each row header displays the curriculum category title (`1. Analgesic` through `39. Thyroid Product`) and drug count badge, plus an active dot if the currently loaded drug belongs to that class.
  - **Collapsed by default.**
  - Clicking a collapsed row expands it (`expandedClassNumber = category.classNumber`), revealing a clean `<select>` dropdown (`aria-label="Select drug in <categoryName>"`) listing the drugs in that class alphabetically (`Generic Name (Brand)`).
  - Clicking an already-expanded row collapses it (`expandedClassNumber = null`).
  - Choosing a drug from the `<select>` dropdown loads that drug (`setSelectedDrugId(drug.id)`), resets `activeBindingSiteId = null`, and **immediately collapses the class row** (`expandedClassNumber = null`).

#### Column 2 (Center, `lg:col-span-5` default / expands up to `lg:col-span-12`): Clean 3D Pocket Canvas
- **Simplified Header & Controls (`ThreeDLabCanvas.tsx`):**
  - Displays the selected **Drug Name**, **Target Receptor**, and a crystal status pill:
    - Emerald badge when `isExactDrugCrystal === true`: `Exact Drug Crystal (PDB 1PTH • SAL)`
    - Amber badge when `isExactDrugCrystal === false`: `Class Pocket Crystal: Olmesartan in AT1R (PDB 4ZUD)`
  - Replaces the 9 technical toolbar buttons with 3 clean scene toggles + 2 utility actions:
    1. `Reset View` (recenters camera and resets to `All Binding Sites`)
    2. `Protein Ribbon` (toggle translucent receptor backbone on/off)
    3. `Sub-Pocket Colors` (toggle matched binding-site residue carbon colors vs. uniform emerald)
    4. `Guide` (opens updated drug-centered `ThreeDLabTutorialModal`) & `Fullscreen` (`Enter/Exit Full Screen`).
  - Removes the bottom pharmacophore chip strip, 2D pocket fallback button, raw CIF link clutter, and raw PDB search bar.

#### Column 3 (Right, `lg:col-span-4`, collapsible): Drug Binding & Mechanism Walkthrough
- Always visible alongside the 3D model in regular mode (and available as a slide-over `"Binding & Mechanism"` drawer in Fullscreen mode alongside `"Drugs (1–39)"`).
- **Card A — How `[Drug Name]` Binds & Reacts:**
  - Shows pharmacologic class, target receptor, plain-language `overallMechanism`, optional `prodrugNote` callout (e.g., hepatic CYP bioactivation or esterase cleavage), and—when `isExactDrugCrystal === false`—a clear one-line note explaining how the selected drug shares the binding pocket shown by `crystallizedLigandName`.
- **Card B — Relevant Binding Sites (Click to Focus in 3D):**
  - **`All Binding Sites (Full Pocket)`** button (selected by default on drug load): frames the single ligand + all key pocket residues together.
  - **2–4 Numbered Binding Site Cards** (`drug.bindingSites`):
    - Shows color swatch matching the 3D residue carbon color, **Site Name**, **Residue Labels** (e.g., `Ser530`), **Drug Functional Group** (`drugMoiety`), and **Interaction Type** pill (`Covalent`, `Salt Bridge`, `Metal Coordination`, `H-Bond`, `Hydrophobic / Pi-Stacking`).
    - Displays the plain-language `reactionSummary` and `clinicalRelevance`.
    - Clicking a Binding Site card sets `activeBindingSiteId = site.id`, zooming the 3D camera onto the single ligand + that site's `residues` and highlighting those residues; clicking the active card again returns to `All Binding Sites`.
    - Clicking an annotated pocket residue directly inside the 3D canvas highlights its matching Binding Site card.

---

## 6. Builder Discretion ("Left to the Builder")

- Organizing shared receptor pocket templates cleanly across `src/data/receptorPocketTemplates.ts` and `src/data/drug3dCatalog.ts` so files stay modular and readable.
- Selecting specific verified RCSB PDB IDs and `auth_asym_id`/`auth_seq_id` residue numbers for each receptor pocket template, provided **every** `pdbId` and `ligandCode`/chain in the catalog is verified against RCSB PDB metadata so binary `.bcif` streaming succeeds.
- Updating `ThreeDLabTutorialModal.tsx` copy so its guide matches the new 3-step workflow (*1. Expand a 1–39 Class & Pick a Drug $\rightarrow$ 2. Inspect the 3D Pocket $\rightarrow$ 3. Click Binding Sites to Read How It Reacts*).
