# Design Spec: Drug Inspector Expansion & 3D Lab Loading Fix

**Date:** 2026-11-13  
**Status:** In Review (Brainstorming Phase)  
**Selected Approach:** Approach 1 (Unified Tabbed Drug Intelligence Inspector)

---

## 1. Intent & Purpose

The platform currently provides an "Inspect" feature across drug cards and matrix views via `PubChemInspectorModal`, but it is currently restricted to basic physicochemical attributes queried from NIH PubChem (formula, molecular weight, XLogP, SMILES, and 2D depiction).

Over recent milestones, the platform has acquired deep, multi-dimensional drug intelligence across canonical medchem targets, clinical PK/PD profiles, prodrug activation pathways, CYP metabolism, FDA boxed warnings, DailyMed contraindications, ChEMBL affinities, and 3D macromolecular structures.

This project delivers two closely coordinated improvements:
1. **Drug Inspector Expansion:** Overhauls the drug inspection modal into a unified, high-yield Drug Intelligence Inspector featuring:
   - Plain-language Clinical PK/PD decision guidance (prodrug vs. active status, onset, half-life, metabolic routes, and "When to choose this drug" rationale).
   - Interactive Pharmacophore functional group badges with medicinal chemistry roles and target pocket residue interactions.
   - Clinical safety, FDA boxed warnings, and organ toxicity risks.
   - Core PubChem physicochemical specs with one-click SMILES copying.
   - A prominent direct link/button to launch the drug straight into the 3D Molecular Lab in fullscreen mode.
2. **3D Molecular Lab Loading Fix:** Resolves the browser CORS failure in `structure3dService.ts` where querying `https://files.rcsb.org/download/{id}.pdb` failed with `access-control-allow-origin: null`, ensuring resilient EBI PDBe coordinate fetching and non-blocking Mol* `.bcif` binary streaming.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- Provide a clean, tabbed modal experience allowing students and clinicians to inspect any drug and access:
  - Clinical PK/PD & Decision Guidance tab.
  - Pharmacophore Tags & SAR tab.
  - Clinical Safety & Boxed Warnings tab.
  - Physicochemical & PubChem Properties tab.
- Add a prominent, one-click **"Launch 3D Lab (Fullscreen)"** button in the modal header that switches the application tab to `3d-lab`, loads the target and ligand, and immediately engages fullscreen mode.
- Audit and resolve the 3D Lab coordinate loading issue by updating `structure3dService.ts` to use open-CORS endpoints (`https://www.ebi.ac.uk/pdbe/entry-files/download/pdb{id}.ent`), making coordinate pre-parsing non-blocking for Mol*.
- Wire `ThreeDLabLibrary` to support an `initialFullscreen?: boolean` prop that triggers fullscreen mode upon mounting.
- Ensure 100% test coverage with zero regressions across existing test suites and a clean TypeScript build.

### Non-Goals
- Replacing or deprecating the standalone `ClinicalDossierModal` for full DailyMed PDF-like monographs; the inspector summarizes high-yield clinical decision points rather than full regulatory package inserts.
- Modifying Mol*'s internal GPU shader pipelines or pocket stick rendering logic (already completed and verified in the previous milestone).

### Anti-Goals
- No monolithic, endless-scrolling modal that forces users to scroll through hundreds of lines of FDA text just to find a pharmacophore tag or molecular weight.
- No network blockers that prevent Mol* from rendering 3D macromolecular scenes when optional PDB text parsing is delayed or times out.
- No breaking changes to existing `onInspectStructure` or `onInspectPubChem` prop signatures in caller components.

---

## 3. Constraints
- **CORS Compliance:** All external API requests in the browser must target endpoints with `Access-Control-Allow-Origin: *`.
- **Responsive Layout:** The inspector modal must fit within standard viewport constraints (`max-w-4xl`, responsive padding, mobile/tablet/desktop support).
- **TypeScript Strictness:** Strict typing on all drug intelligence interfaces, props, and callbacks.
- **Offline / Mock Fallbacks:** If external APIs (PubChem, DailyMed) are unreachable, the inspector must gracefully render cached canonical data without crashing.

---

## 4. Approaches Considered

### Approach 1: Unified Tabbed Drug Intelligence Inspector (Selected)
- **Description:** A multi-tabbed modal with four dedicated views:
  1. *Clinical PK/PD & Decision Guidance* (prodrug vs active, onset, half-life, metabolic routes, selection hints).
  2. *Pharmacophores & SAR* (functional group badges, medchem roles, binding pocket contacts).
  3. *Safety & Toxicities* (boxed warnings, contraindications, clinical risks).
  4. *Chemical & PubChem* (2D depiction, formula, MW, XLogP, SMILES).
  Header hosts drug name, chemical class pill, and the "Launch 3D Lab (Fullscreen)" button.
- **Tradeoffs:** Highly structured and clean; prevents cognitive overload; fast tab switching. Selected by the user.

### Approach 2: Single Continuous Scrollable Monograph
- **Description:** A single vertical stack of cards containing all data points.
- **Tradeoffs:** Eliminates tabs, but creates an unwieldy, long scroll on laptops and mobile devices.

### Approach 3: Dual-Pane MedChem & Clinical Studio
- **Description:** Split desktop view with 2D chemical specs on the left and clinical intelligence on the right.
- **Tradeoffs:** Excellent on wide monitors, but requires complex responsive reflows for tablets and mobile.

---

## 5. Architecture & Detailed Design

### 5.1 3D Lab CORS Fix & Fullscreen Handoff

#### `src/services/structure3dService.ts`
- Update `fetchPdbCoordinates`:
  - Primary URL: `https://www.ebi.ac.uk/pdbe/entry-files/download/pdb${cleanId.toLowerCase()}.ent` (CORS `*`).
  - Fallback URL: `https://models.rcsb.org/${cleanId.toLowerCase()}.cif` or `https://files.rcsb.org/download/${cleanId}.pdb`.
  - Maintain timeout protection (8s) and abort signal propagation.

#### `src/components/ThreeDLabCanvas.tsx`
- Wrap PDB text pre-parsing in a non-fatal `try...catch` block:
  - If text fetching succeeds, run `identifyLigandResidue`.
  - If text fetching fails or times out, proceed to initialize Mol* without failing the entire component, streaming `.bcif` coordinates directly.

#### `src/components/ThreeDLabLibrary.tsx`
- Add `initialFullscreen?: boolean` to `ThreeDLabLibraryProps`.
- Initialize `isFullscreen` with `initialFullscreen ?? false`.

#### `src/App.tsx`
- Update `handleOpenIn3DLab(structure: ChemicalStructure, launchFullscreen: boolean = false)`.
- Pass `initialFullscreen={is3DFullscreenRequested}` to `<ThreeDLabLibrary>`.

---

### 5.2 Drug Intelligence Inspector (`PubChemInspectorModal.tsx`)

#### Data Integration
The inspector aggregates data from multiple existing internal services and dictionaries:
1. **Canonical Targets & PK/PD:** `findCanonicalTargetForDrug(drugName)` and `findMedChemProfile(geneSymbol | pdbId)` from `canonicalPharmacophorePkData.ts`.
2. **Clinical Safety & Warnings:** `fetchClinicalDossier(drugName)` from `clinicalDossierService.ts` for boxed warnings and contraindications.
3. **Chemical Class & Taxonomy:** `findChemicalClassForDrug(drugName)` from `chemicalClassDictionary.ts` and `topDrugsTaxonomyData.ts`.
4. **PubChem Physicochemical Specs:** PUG REST API query for formula, MW, XLogP, SMILES, and 2D PNG.

#### Navigation Tabs
1. **Tab 1: Clinical PK/PD & Decision Guidance**
   - Active Drug vs. Prodrug badge with mechanism of activation (e.g. CYP2C19 bioactivation).
   - Core metrics grid: Half-life ($T_{1/2}$), Time to peak ($T_{\max}$), Oral bioavailability ($F$), Plasma Protein Binding (PPB), Volume of Distribution ($V_d$), Elimination/Excretion.
   - Clinical selection card: "Why choose this agent?" (onset speed, reversibility, resistance profiles, renal/hepatic considerations).
2. **Tab 2: Pharmacophores & SAR**
   - Pharmacophore tags carousel/chips using `PharmacophorePkPdGroup`.
   - Structural role annotation per group (e.g., covalent bonding handle, lipophilic anchor, metabolic soft spot).
   - Associated target binding pocket residues (e.g. Cys97, Arg256).
3. **Tab 3: Safety, Toxicities & Warnings**
   - FDA Boxed Warnings banner (highlighted in rose/amber alerts).
   - Major contraindications and high-risk patient populations.
   - Organ toxicities and key laboratory monitoring parameters.
4. **Tab 4: Chemical Properties & PubChem**
   - 2D molecular structure depiction.
   - IUPAC systematic name.
   - Molecular formula, molecular weight, and XLogP lipophilicity.
   - Isomeric/Canonical SMILES with one-click copy and toast confirmation.
   - External NIH PubChem record link.

#### Header Action: "Launch 3D Lab (Fullscreen)"
- Displays target gene symbol and resolved PDB ID (e.g. "Target: P2Y12 Receptor (PDB: 4NTJ)").
- One-click button with `Box` / `Maximize2` icon that invokes `onOpenIn3DLab(structure, true)` and closes the modal.

---

## 6. What's Left to the Builder
- Precise Tailwind styling and color tokens for active vs. inactive tab buttons matching platform slate/dark styling.
- Mocking and unit test fixtures for the new inspector tabs and 3D fullscreen navigation triggers.
- Safe fallbacks when a newly imported or non-canonical drug lacks clinical dossier records.
