# Design Spec: MedChem Matrix Safety Condensation, Antiarrhythmic Quiz Fixes, Single-Structure Focus Stage, and Module 9 (Anticoagulants) Restoration

**Date**: 2026-11-05  
**Topic**: MedChem Matrix Safety Formatter, Antiarrhythmics Q1/Q14 Workbench Calibration, Single Structure Focus Stage, Module 9 Core Hydration & PubChem Audit  
**Status**: Ready for Approval  

---

## 1. Intent & The Why

Medical students and pharmacy candidates using the MedChem Review platform need a streamlined, high-yield study experience:
1. **MedChem Matrix Usability**: The MedChem Matrix provides a comparative multi-column reference across all course modules. In the Heart Failure module and other FDA-hydrated drugs, the Adverse Effects column currently concatenates multi-paragraph FDA label warnings and unconstrained bullet lists, expanding table rows up to hundreds of pixels in height and forcing excessive vertical scrolling. Users need concise, scannable safety warnings capped at a maximum of 5 bullet points or sentences while retaining instant access to complete FDA package inserts.
2. **Review 11 (Antiarrhythmics) Interactive Quality**: Questions 1 and 14 in the newly restored Antiarrhythmics module are currently unanswerable:
   - Question 1 has no answer options because it is typed as `matching` but lacks drag-and-drop target bins (`matchingTargets`).
   - Question 14 renders interactive halo circles floating off the structure in the top-left corner because its coordinates were authored as 0–100 percentage values rather than pixel coordinates within the 880×320 SVG canvas, and `StructuralWorkbenchQuestion.tsx` currently only contains vector lines for Dabigatran.
3. **Single-Structure Focus Stage**: When a practice slide or question pertains to only 1 drug (e.g. single-drug SAR or metabolism analysis), forcing a two-column Compound A vs. Compound B comparator is cluttered and redundant. Users need the horizontal focus stage to seamlessly display a single structure card (with full width, high-contrast canvas, pharmacophore exploration, and PK/PD metrics), supported by an automatic context detector and a manual `[Single Focus | Dual Compare]` toggle.
4. **Module 9 (Anticoagulants) Core Integration**: Module 9 is currently a stub in `anticoagulantsQuizData.ts` (only 2 questions), despite having a verified 7-page lecture review covering Direct Thrombin Inhibitors (Argatroban, Dabigatran), Direct Factor Xa Inhibitors (Apixaban, Rivaroxaban), Heparin pentasaccharide structure-activity mechanics (UFH, LMWH, Fondaparinux), and Warfarin. It must be fully hydrated into the core curriculum across all 27 distinct questions, wired into MedChem Matrix, and audited with PubChem CIDs.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
- **G1 (Matrix Safety Condensation)**: Implement a clinical text formatting utility (`formatClinicalWarnings`) that condenses verbose FDA contraindications and adverse reactions into a maximum of 5 high-yield bullet points or sentences (e.g. cardiac arrhythmias, visual disturbances, confusion).
- **G2 (Matrix FDA Modal / Popover)**: Provide an accessible modal (`FullFdaLabelModal`) for any drug whose FDA label text was truncated, allowing users to view the full unedited FDA package insert without bloating matrix row heights.
- **G3 (Antiarrhythmics Q1 Fix)**: Provide full `matchingTargets` for Question 1 so the interactive `StructureDragDropMatch` component renders drag-and-drop target bins for all 5 drug classes (*Phenoxy propyloxyamine*, *Xylene amide*, *p-Amino benzamide*, *Amino butamide*, *Fluorinated benzamide piperidine*).
- **G4 (Antiarrhythmics Q14 Calibration & Lidocaine Vector Canvas)**: 
  - Add dedicated vector SVG schematics for Lidocaine (2,6-xylyl ring, amide, diethylamino group) in `StructuralWorkbenchQuestion.tsx`.
  - Calibrate all halo and drop-zone coordinates in `CLASS_I_KINETICS_WORKBENCH_DATA` to exact 880×320 SVG canvas pixels, and implement canvas-level coordinate auto-normalization in `StructuralWorkbenchQuestion.tsx` so (x, y) <= 100 percentages automatically project cleanly across the chemical structure.
- **G5 (Single-Structure Focus Stage)**: In `StructureComparator.tsx` and `ReviewDeck.tsx`, support a Single-Structure Focus Stage that activates when only 1 structure is relevant to the question/slide, or when the user toggles to `Single Focus` mode.
- **G6 (Module 9 Core Hydration)**: Fully hydrate `anticoagulantsQuizData.ts` from the verified 7-page lecture review (`media_1793851044750_4bd2c7ad.pdf`), covering all 27 questions across direct thrombin inhibitors, Factor Xa inhibitors, heparin pentasaccharide rules, and warfarin.
- **G7 (Module 9 PubChem Audit)**: Register all Module 9 chemical structures (Argatroban, Dabigatran, Dabigatran etexilate, Apixaban, Rivaroxaban, Fondaparinux, Warfarin) with verified NIH PubChem CIDs, SMILES, and 2D thumbnails in `pubchemAudit`.

### Non-Goals
- Altering existing Review 8 (Antiplatelets) or Review 10 (Heart Failure) quiz question stems or answers.
- Modifying backend server logic or external API endpoints.

### Anti-Goals
- **AG1**: Dropping vital clinical contraindications or boxed warnings during text condensation without providing a path to view the full package insert.
- **AG2**: Converting matching questions into flat non-interactive text strings when the platform already has a dedicated drag-and-drop matching engine.
- **AG3**: Hardcoding static image screenshots instead of vector-overlaid SVG chemical structures and interactive halos.

---

## 3. Constraints

- **Strict TypeScript Typing**: No `any` type escapes that compromise `ReviewModule`, `ReviewQuestion`, or `ChemicalStructure`.
- **Zero Layout Shifts**: Matrix column widths must remain balanced; sticky drug columns and 2D structure thumbnails must remain intact.
- **Responsive Canvas**: The 880×320 SVG viewBox in `StructuralWorkbenchQuestion.tsx` must maintain responsive aspect ratio across desktop and mobile screens.
- **Build Cleanliness**: `npm run build` (`npx tsc --noEmit` and Vite production bundle) must pass with zero errors.

---

## 4. Approaches Considered & Tradeoffs

### Approach 1: High-Yield Interactive Restoration with Single-Structure Focus (Selected by User)
- **Matrix**: Add a smart clinical warning adapter (`formatClinicalWarnings`) that extracts top clinical warnings and caps them at 5 bullet points or sentences, accompanied by a clean "Full FDA Label" modal.
- **Antiarrhythmics Q1**: Populate `matchingTargets` for all 5 drug classes, enabling the native drag-and-drop matching interface.
- **Antiarrhythmics Q14**: Author dedicated vector SVG paths for Lidocaine in `StructuralWorkbenchQuestion.tsx`, calibrate coordinates to 880×320 canvas pixels, and add auto-normalization (`x <= 100 ? (x / 100) * 880 : x`).
- **Single-Structure Focus Stage**: Support Single Focus mode in `StructureComparator` with a prominent `[Single Focus | Dual Compare]` switcher and automatic single-drug detection.
- **Module 9**: Fully restore all 7 pages and 27 questions from the lecture PDF, including the Dabigatran double-prodrug workbench and PubChem audits for all structures.
- **Tradeoffs**: Highest fidelity to course lecture materials and interactive platform capabilities.

### Approach 2: Lightweight Truncation & Multiple-Choice Flattening (Rejected)
- **Matrix**: Inline character cutoff without modal fallback or bullet parsing.
- **Antiarrhythmics Q1**: Flatten Q1 into a single multiple-choice question with combined text options A–E.
- **Antiarrhythmics Q14**: Patch coordinates only in data without vector SVG structure.
- **Module 9**: Import the AI-extracted JSON without fixing duplicated structure references.
- **Tradeoffs**: Lower implementation effort, but sacrifices interactive drag-drop matching on Q1 and leaves Module 9 with duplicated structures on slides 3–7.

---

## 5. Architectural Specification & Implementation Details

### 5.1 MedChem Matrix Adverse Effects Condensation
1. **Utility `formatClinicalWarnings`**:
   - Resides in `src/utils/clinicalWarningFormatter.ts`.
   - Accepts raw clinical warning text or string array (from `clinicalData.adverse_reactions`, `clinicalData.adverseReactions`, or `majorToxicityOrLimitation`).
   - Cleans regulatory preamble (e.g., "[see Warnings and Precautions (5.1)]", "( 4 )").
   - Splits on standard delimiters (newlines, bullets, semicolons, pipe symbols, or sentence boundaries).
   - Filters out boilerplate text, extracts up to 5 distinct, high-impact clinical toxicity items.
   - Returns `{ summaryBullets: string[]; isTruncated: boolean; fullText: string }`.
2. **Matrix Cell UI (`AdverseReactionsCell`)**:
   - Renders a compact unordered list of up to 5 bullet points in rose tones (`text-rose-700 dark:text-rose-300`, `text-[11px]`).
   - If `isTruncated` is true (or if full FDA text exists), renders an unobtrusive badge/button:
     ```tsx
     <button onClick={() => openFullFdaModal(fullText, row.drug)} className="text-[10px] text-sky-600 hover:underline">
       View Full FDA Label ({totalCount} items)
     </button>
     ```
   - Opens a lightweight modal (`FullFdaLabelModal`) displaying the complete FDA package insert sections with search/scroll.

### 5.2 Antiarrhythmics Question 1 Fix
In `src/data/antiarrhythmicModuleData.ts`:
- Update Question 1 to include `matchingTargets`:
  ```ts
  matchingTargets: [
    {
      id: 'target_phenoxy',
      label: 'Phenoxy propyloxyamine',
      acceptedStructureIds: ['I', 'propafenone'],
      rationale: 'Structure I (Propafenone) is an aryloxypropanolamine / phenoxy propyloxyamine with intrinsic beta-blocking activity.',
    },
    {
      id: 'target_xylene',
      label: 'Xylene amide',
      acceptedStructureIds: ['II', 'lidocaine'],
      rationale: 'Structure II (Lidocaine) features a 2,6-dimethylanilide core conferring steric protection against amidases.',
    },
    {
      id: 'target_p_amino',
      label: 'p-Amino benzamide',
      acceptedStructureIds: ['III', 'procainamide'],
      rationale: 'Structure III (Procainamide) is a p-amino benzamide derivative of procaine with an amide replacing the ester.',
    },
    {
      id: 'target_amino_butamide',
      label: 'Amino butamide',
      acceptedStructureIds: ['IV', 'disopyramide'],
      rationale: 'Structure IV (Disopyramide) is an alpha-phenyl-alpha-(2-pyridyl) aliphatic carboxamide (amino butamide).',
    },
    {
      id: 'target_fluorinated',
      label: 'Fluorinated benzamide piperidine',
      acceptedStructureIds: ['V', 'flecainide'],
      rationale: 'Structure V (Flecainide) features bis(2,2,2-trifluoroethoxy) substituents and a piperidine ring on benzamide.',
    },
  ]
  ```
- Keep `options` array as fallback for multiple-choice view or export compatibility.

### 5.3 Antiarrhythmics Question 14 Coordinate Calibration & Vector Blueprint
1. **Lidocaine Vector Schematic in `StructuralWorkbenchQuestion.tsx`**:
   - Conditionally render chemical structure based on `workbenchData.stemStructure.id`:
     - If `id === 'lidocaine'`: Render Lidocaine's 2,6-xylyl ring (hexagon at x: 211, y: 144 with twin ortho-methyl sticks at C2 and C6), amide carbonyl and NH bond (centered at x: 422, y: 134), methylene spacer, and tertiary nitrogen with twin ethyl chains (centered at x: 651, y: 140).
     - If `id === 'dabigatran_etexilate'`: Render existing Dabigatran vector paths.
2. **Coordinate Calibration in `src/data/antiarrhythmicWorkbenchData.ts`**:
   - Step 1 Amide/Amine targets:
     - `amide_bond`: `x: 422, y: 134, radius: 28`
     - `tertiary_amine`: `x: 651, y: 140, radius: 30`
     - `para_hydrogen`: `x: 176, y: 153, radius: 24`
   - Step 2 Moiety targets:
     - `xylyl_ring`: `x: 211, y: 144, radius: 48`
     - `diethyl_terminal`: `x: 774, y: 112, radius: 32`
   - Step 3 Kinetic Drop Zones:
     - `zone_class_1a`: `x: 220, y: 256`
     - `zone_class_1b`: `x: 484, y: 256`
     - `zone_class_1c`: `x: 721, y: 256`
3. **Defensive Coordinate Normalization**:
   - Add coordinate auto-normalization in `StructuralWorkbenchQuestion.tsx`:
     ```ts
     const normalizeCoordX = (val: number | undefined) => (val !== undefined && val <= 100 ? (val / 100) * 880 : val ?? 440);
     const normalizeCoordY = (val: number | undefined) => (val !== undefined && val <= 100 ? (val / 100) * 320 : val ?? 160);
     ```

### 5.4 Single-Structure Focus Stage
1. **In `StructureComparator.tsx`**:
   - Add state: `viewMode: 'auto' | 'single' | 'compare'`.
   - Add a segmented toggle control in the comparator header:
     ```tsx
     <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
       <button onClick={() => setViewMode('single')} className={viewMode === 'single' ? 'bg-white dark:bg-slate-700 shadow-xs font-bold' : ''}>
         Single Focus
       </button>
       <button onClick={() => setViewMode('compare')} className={viewMode === 'compare' ? 'bg-white dark:bg-slate-700 shadow-xs font-bold' : ''}>
         Dual Compare
       </button>
     </div>
     ```
   - In Single Focus mode (or when `isSingleDrug` is true):
     - Renders a single centered, full-width focus card.
     - Expands the `SmilesCanvas` to optimal viewing dimensions (e.g. 240px height with interactive pharmacophore tooltips).
     - Hides the second drop-zone and head-to-head difference table, focusing entirely on Compound A's pharmacophore groups, SMILES, MW, LogP, and PK/PD highlights.
2. **In `ReviewDeck.tsx`**:
   - When the active question or slide references only 1 structure (`relevantDrugs.length === 1`), automatically default `viewMode` to `'single'` while still allowing the user to click any drug in the vignette to inspect it or switch to dual compare.

### 5.5 Module 9 (Anticoagulants) Full Dataset Restoration
1. **Module Metadata**:
   - ID: `anticoagulants_mcp2`
   - Title: `Review for Anticoagulants`
   - Subtitle: `Direct Thrombin Inhibitors, Factor Xa Inhibitors, Heparin Pentasaccharide SAR, and Warfarin`
   - Course: `Medicinal Chemistry (MCP II)`, Semester: `Fall 2026`, Code: `RAAH`, `isBuiltIn: true`.
2. **All 27 Questions Across 7 Pages from Lecture PDF**:
   - **Page 1**: Direct Thrombin Inhibitors (Argatroban vs. Dabigatran)
     - Q1: Sub-statements a–l (benzimidazole vs. tetrahydroquinoline, S1 Asp189 interaction, oral prodrug requirement, amphoteric character, renal vs. hepatic clearance).
     - Q2: Dabigatran Etexilate Double Prodrug Structural Workbench (`DABIGATRAN_WORKBENCH_QUESTION`).
   - **Page 2**: Factor Xa Inhibitors (Apixaban vs. Rivaroxaban)
     - Q3: Sub-statements a–g (stereochemistry-dependent activity, oral bioavailability, L-shaped active site conformation, severe hepatic dysfunction).
     - Section Structure Block: 4-Drug comparative reference (Dabigatran etexilate, Apixaban, Argatroban, Rivaroxaban).
   - **Page 3**: DOAC Comparative Pharmacology
     - Q4 (PDF 4.1): Chemical class of all 4 agents (Peptidomimetics).
     - Q5 (PDF 4.2): Direct factor Xa inhibitor with stereochemistry-dependent activity (Rivaroxaban).
     - Q6 (PDF 4.3): Oral direct thrombin inhibitor (Dabigatran etexilate).
     - Q7 (PDF 4.4): All correct except (All adopt L-shape).
     - Q8 (PDF 5): Rivaroxaban vs. Dabigatran comparison (Factor IIa vs Factor Xa targets).
   - **Page 4**: Heparin Pentasaccharide Architecture (D–E–F–G–H)
     - Q9 (PDF 1): Monosaccharide D (Glucosamine).
     - Q10 (PDF 2): Monosaccharide E (Glucuronic acid).
     - Q11 (PDF 3): First glycosidic linkage D–E (alpha 1-4).
     - Q12 (PDF 4): Second glycosidic linkage E–F (beta 1-4).
     - Q13 (PDF 5): Type of interaction between heparins and antithrombin (Electrostatic/ionic).
     - Q14 (PDF 6): 30-mer chain lacking pentasaccharide (Lacks anticoagulant activity).
     - Q15 (PDF 7): 8-mer chain with pentasaccharide (Inhibits only Factor Xa).
   - **Page 5**: Heparin Chain Length Rules & UFH Properties
     - Q16 (PDF 8): 50-mer chain lacking pentasaccharide (Lacks anticoagulant activity).
     - Q17 (PDF 9): 50-mer chain with pentasaccharide (Inhibits both Factor Xa and Thrombin).
     - Q18 (PDF 10): 10-mer chain with pentasaccharide (Inhibits only Factor Xa).
     - Q19 (PDF 11): 25-mer chain lacking pentasaccharide (Lacks anticoagulant activity).
     - Q20 (PDF 12): UFH statements a–e (polydisperse mixture, 15 kDa, indirect, 6-O-sulfate on unit F).
     - Q21 (PDF 13): UFH negative charge & administration a–e (parenteral only, rapid onset, protamine reversal).
   - **Page 6**: LMWH, Fondaparinux & Warfarin Introduction
     - Q22 (PDF 14): LMWH fractionation results in all except (High oral bioavailability & BBB crossing).
     - Q23 (PDF 15): Fondaparinux statements a–e (homogeneous polysaccharide, Factor Xa only, no HIT/osteoporosis, protamine non-reversal).
     - Q24 (PDF 16): LMWH clinical traits a–e (shorter chain length, Factor Xa specificity, predictable response).
     - Q25 (PDF 17): Chemical class of Warfarin (Coumarin).
     - Q26 (PDF 18): Warfarin statements a–c (100% oral bioavailability, stereoselective metabolism, plasma protein binding).
   - **Page 7**: Warfarin Pharmacodynamics & Clinical Pearls
     - Q27 (PDF 19): Warfarin reversal and genetics a–e (delayed onset, CYP2C9/VKORC1 genetic polymorphisms, reversal with Vitamin K, not protamine).
3. **Chemical Structures & PubChem Audits**:
   - `ARGATROBAN_STRUCTURE`: CID 92722, MW 508.6 g/mol, SMILES `CC1CCN(C(C1)C(=O)O)C(=O)C(CCCN=C(N)N)NS(=O)(=O)C2=CC=CC3=C2NCC(C3)C`
   - `DABIGATRAN_STRUCTURE`: CID 216210, MW 471.5 g/mol, SMILES `CN1C2=C(C=C(C=C2)C(=O)N(CCC(=O)O)C3=NC=CC=C3)N=C1CN(C4=CC=C(C=C4)C(=N)N)C`
   - `DABIGATRAN_ETEXILATE_STRUCTURE`: CID 9578572, MW 627.7 g/mol, SMILES `CCCCCC(=O)NC(=N)C1=CC=C(C=C1)NCC2=NC3=C(N2C)C=C(C=C3)C(=O)N(CCC(=O)OCC)C4=NC=CC=C4`
   - `APIXABAN_STRUCTURE`: CID 10182969, MW 459.5 g/mol, SMILES `COC1=CC=C(C=C1)N2C3=C(C=C(N3)C(=O)N)C(=O)N(CC2)C4=CC=C(C=C4)N5CCCCC5=O`
   - `RIVAROXABAN_STRUCTURE`: CID 9875401, MW 435.88 g/mol, SMILES `ClC1=CC=C(S1)C(=O)NCC2CN(C(=O)O2)C3=CC=C(C=C3)N4CCOCC4=O`
   - `FONDAPARINUX_STRUCTURE`: CID 636380 / 5282448, MW 1728 g/mol (synthetic pentasaccharide)
   - `WARFARIN_STRUCTURE`: CID 54678486, MW 308.33 g/mol, SMILES `CC(=O)CC(C1=CC=CC=C1)C2=C(C3=CC=CC=C3OC2=O)O`
4. **Integration into Module Storage & Matrix**:
   - Invalidate any outdated `anticoagulants_mcp2` cached entry in localStorage to ensure the complete 27-question deck mounts instantly.
   - Include Module 9 structures in `MedChemMatrix.tsx` dropdown module filter and global matrix list.

---

## 6. What Is Left to the Builder

- Exact SVG styling tweaks for Lidocaine's bond lines (matching the high-contrast aesthetic of existing workbenches).
- Specific responsive breakpoints for the Single Focus stage card width.
- Unit and build verification test execution.

---

## 7. Verification Plan

1. **Compilation**: `npx tsc --noEmit` must pass with 0 errors.
2. **MedChem Matrix Verification**:
   - Verify Heart Failure and Anticoagulants rows in MedChem Matrix: Adverse effects column displays clean, maximum 5-item bulleted lists without bloated table row height.
   - Verify clicking "View Full FDA Label" opens the detailed modal with complete package insert information.
3. **Antiarrhythmics Review 11 Verification**:
   - Open Review 11 Question 1: verify drag-and-drop matching bins appear and accept Structures I–V.
   - Open Review 11 Question 14: verify Lidocaine workbench renders Lidocaine's chemical structure squarely under all halos, rings, and kinetic drop zones, with zero top-left floating elements.
4. **Single-Structure Focus Stage Verification**:
   - In questions referencing only 1 structure, verify `StructureComparator` displays a clean, single-structure focus card.
   - Click `[Dual Compare]` and `[Single Focus]` toggles: verify seamless switching.
5. **Module 9 Verification**:
   - Open Review 9 (Anticoagulants): verify all 7 pages and 27 questions load with full sub-statements, multiple-choice options, and Dabigatran workbench.
   - Open PubChem Audit modal or inspect cards: verify Argatroban, Dabigatran, Apixaban, Rivaroxaban, Fondaparinux, and Warfarin display verified NIH PubChem CIDs and chemical metrics.
6. **Production Build**: `npm run build` must succeed cleanly.
