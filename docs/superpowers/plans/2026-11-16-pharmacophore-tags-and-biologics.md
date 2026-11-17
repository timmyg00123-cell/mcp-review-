# Pharmacophore Tag Batch Remediation & Biologics Mechanism Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all broken small-molecule pharmacophore tags across modules, replace 2D biologic placeholders with an interactive Fibrinolysis Mechanism Cascade diagram whose nodes highlight when domain tags are clicked, and resolve the comparator selection persistence glitch.

**Architecture:** 
1. Correct corrupted data SMILES and faulty SMARTS queries in `src/utils/smartsDictionary.ts` and module data files.
2. Build an SVG-based, theme-aware `FibrinolysisCascadeViewer.tsx` component that dynamically reacts to active/hovered domain tags.
3. Integrate the cascade viewer into `InteractiveStructureViewer.tsx` for macromolecular biologics.
4. Add state-reset hooks to `StructureComparator.tsx` and verify everything with an automated RDKit WASM test suite and live browser validation.

**Tech Stack:** React 19, TypeScript, RDKit WASM (`@rdkit/rdkit`), Tailwind CSS, Lucide icons, Vite.

**Spec:** `docs/superpowers/specs/2026-11-16-pharmacophore-tags-and-biologics-design.md`

## Global Constraints

- Do not alter question IDs, prompt keys, or exam scoring logic.
- Ensure light and dark mode compatibility with existing Obsidian/Slate color system.
- All RDKit substructure matching must remain asynchronous/memoized to prevent main-thread UI jank.
- Zero TypeScript compiler warnings or errors (`npm run lint`).

## Review Focus

1. **Warfarin 4-hydroxycoumarin highlighting**: Clicking `4-Hydroxycoumarin lactone ring` must highlight all 12 core ring atoms (bicyclic 4-hydroxycoumarin core) without missing the lactone or C4-OH.
2. **Dabigatran etexilate hexyl carbamate**: Clicking `Hexyl carbamate` must highlight all 10 atoms of the terminal $n$-hexyl carbamate prodrug moiety.
3. **Thrombolytic Biologics (Alteplase, Reteplase, Tenecteplase, Streptokinase, Urokinase)**: Must render the Fibrinolysis Cascade diagram instead of a small peptide SMILES. Clicking any of the 17 domain tags must light up the corresponding diagram node/arrow.
4. **Batch-fixed tags across all modules**: Apixaban, Fondaparinux, Corticosteroids (6 drugs), Theophylline, Diltiazem, Zafirlukast, Sodium nitroprusside, and Olodaterol must all match with $\ge 1$ highlighted atom.
5. **Comparator state reset**: Navigating between drugs in `StructureComparator` must immediately clear prior active tag selections.

---

### Task 1: Batch SMARTS Dictionary & Module Data Remediation

**Files:**
- Modify: `src/data/dabigatranWorkbenchData.ts`
- Modify: `src/data/respiratoryReviewModuleData.ts`
- Modify: `src/utils/smartsDictionary.ts`
- Test: `scratch/audit_all_pharmacophore_tags.ts`

- [x] **Step 1: Fix Dabigatran etexilate SMILES and Olodaterol SMILES**
  - In `src/data/dabigatranWorkbenchData.ts`, replace the corrupted alkylurea SMILES with authentic PubChem CID 135565674:
    `CCCCCCOC(=O)NC(=N)C1=CC=C(C=C1)NCC2=NC3=C(N2C)C=CC(=C3)C(=O)N(CCC(=O)OCC)C4=CC=CC=N4`.
  - In `src/data/respiratoryReviewModuleData.ts`, add the missing canonical SMILES for Olodaterol (PubChem CID 11522204):
    `CCC1(CCC2=C(C1)C=C(C=C2)OC)NCC(C3=CC4=C(C=C3)NC(=O)C(=C4)O)O`.
- [x] **Step 2: Update SMARTS patterns in `src/utils/smartsDictionary.ts`**
  - Add specific `4-hydroxycoumarin`: `O=c1oc2ccccc2c(O)c1` and update general `coumarin`: `O=c1oc2ccccc2cc1`.
  - Add `hexyl carbamate`: `CCCCCC[OX2][CX3](=[OX1])[NX3]`.
  - Fix Corticosteroid `delta-1,4-diene-3-one`: replace invalid syntax with `O=C1[#6]=[#6][#6]2[#6](=[#6]1)`.
  - Fix Fondaparinux `sulfamido groups`: match sulfamate ester `[NX3][SX4](=[OX1])(=[OX1])[OX2]`.
  - Fix Apixaban pyrazolopyridinone core: `O=C1CC2=NN(c3ccc(N4CCCCC4=O)cc3)C(=C2CN1)`.
  - Fix Rivaroxaban morpholinone: `O=C1CNCCO1`.
  - Fix Sodium Nitroprusside: allow `[Fe]` coordination hub and `[C]#[N]` cyano ligands.
  - Fix Theophylline purine dione / xanthine core: `O=c1[nX3]c(=O)[nX3]c2[nX3]c[nX3]c12`.
  - Fix Diltiazem benzothiazepine bicycle: `O=C1CCSc2ccccc2N1`.
  - Fix Zafirlukast indole core: `c1ccc2c(c1)cc[nX3]2`.
- [x] **Step 3: Run programmatic audit test**
  - Run `npx tsx scratch/audit_all_pharmacophore_tags.ts`.
  - Verify all targeted small-molecule tags match successfully.
- [x] **Step 4: Commit changes**
  - Git commit: `fix(medchem): batch remediate small-molecule SMARTS queries and SMILES strings`.

---

### Task 2: Build Interactive Fibrinolysis Cascade Mechanism Component

**Files:**
- Create: `src/components/FibrinolysisCascadeViewer.tsx`
- Test: `scratch/test_cascade_viewer.ts` (or interactive test script)

- [x] **Step 1: Create `src/components/FibrinolysisCascadeViewer.tsx`**
  - Implement full SVG diagram featuring:
    1. **Inactive Zymogen Node**: Plasminogen (circulating & clot-bound).
    2. **Activation Arrow**: Catalytic cleavage at Arg561–Val562 with Fibrinolytic enzyme callout.
    3. **Active Enzyme Node**: Plasmin (active serine protease).
    4. **Substrate & Clot Digestion**: Cross-linked Fibrin clot & Fibrinogen $\rightarrow$ Soluble Fibrin Degradation Products (D-Dimer).
    5. **Regulatory Checkpoints**: PAI-1 inhibition arrow and $\alpha_2$-antiplasmin neutralization.
- [x] **Step 2: Implement domain tag highlighting and tooltips**
  - Map active and hovered pharmacophore IDs to visual highlight halos, glowing borders, and explanatory badges:
    - `kringle`: Highlights Fibrin-Binding specificity anchor.
    - `catalytic` / `protease`: Highlights Arg561-Val562 enzymatic cleavage arrow.
    - `finger`: Highlights high-affinity clot anchor.
    - `egf`: Highlights hepatic clearance receptor binding.
    - `pai-1` / `tetra-alanine`: Highlights PAI-1 resistance shield.
    - `glycosyl`: Highlights plasma half-life extension callout.
    - `bacterial` / `plasminogen binding` (Streptokinase): Highlights 1:1 allosteric activator complex.
- [x] **Step 3: Support theme and responsiveness**
  - Ensure dark mode (Obsidian / Dark Slate) and light mode styles adapt cleanly with SVG filters and high contrast labels.
- [x] **Step 4: Commit changes**
  - Git commit: `feat(biologics): create interactive FibrinolysisCascadeViewer component`.

---

### Task 3: Integrate Cascade Viewer into Structure Viewer & Structure Card

**Files:**
- Modify: `src/components/InteractiveStructureViewer.tsx`
- Modify: `src/components/ChemicalStructureCard.tsx`
- Modify: `src/components/StructureLightboxModal.tsx`

- [x] **Step 1: Integrate into `InteractiveStructureViewer.tsx`**
  - Import `FibrinolysisCascadeViewer`.
  - In `InteractiveStructureViewer`, check `isBiologicOrMacromolecule(structure)` or `structure.isBiologic`.
  - When true, render `FibrinolysisCascadeViewer` passing `structure`, `activePharmacophoreIds`, and `hoveredPharmacophoreId`.
- [x] **Step 2: Handle ChemicalStructureCard Lightbox & Zoom**
  - In `ChemicalStructureCard.tsx` and `StructureLightboxModal.tsx`, ensure zooming or opening in lightbox displays the cascade viewer rather than failing on 2D RDKit canvas.
- [x] **Step 3: Verify build**
  - Run `npm run lint` (`tsc --noEmit`).
- [x] **Step 4: Commit changes**
  - Git commit: `feat(biologics): wire FibrinolysisCascadeViewer into InteractiveStructureViewer and Lightbox`.

---

### Task 4: Fix Comparator Selection Persistence Glitch

**Files:**
- Modify: `src/components/StructureComparator.tsx`

- [x] **Step 1: Add state reset effect on structure ID change**
  - In `StructureComparator.tsx`, add an effect watching `selectedStructureA?.id` and `selectedStructureB?.id`:
    ```typescript
    useEffect(() => {
      setActiveTagsA({});
      setActiveTagsB({});
    }, [selectedStructureA?.id, selectedStructureB?.id]);
    ```
- [x] **Step 2: Verify in browser**
  - Navigate between drugs in the comparator and confirm prior active tags are cleared.
- [x] **Step 3: Commit changes**
  - Git commit: `fix(comparator): reset active pharmacophore tags when switching structures`.

---

### Task 5: End-to-End Verification & Post-Implementation Audit

**Files:**
- Test: `scratch/audit_all_pharmacophore_tags.ts`
- Browser: `http://localhost:3000/`

- [x] **Step 1: Run comprehensive programmatic audit**
  - Run `npx tsx scratch/audit_all_pharmacophore_tags.ts`.
  - Confirm small-molecule match failure count drops to 0 (or strictly documented non-chemical items).
- [x] **Step 2: Run browser check on `http://localhost:3000/`**
  - Test Warfarin on Page 1: verify `4-Hydroxycoumarin lactone ring` highlights 12 atoms.
  - Test Dabigatran etexilate: verify `Hexyl carbamate` highlights 10 atoms.
  - Test Page 8 Thrombolytics: verify Alteplase, Reteplase, Tenecteplase, Streptokinase, and Urokinase render the cascade diagram and domain tags light up corresponding nodes.
- [x] **Step 3: Run production build**
  - Run `npm run build`.
- [x] **Step 4: Commit final verification**
  - Git commit: `chore(verification): verify all pharmacophore tags and cascade viewer`.
