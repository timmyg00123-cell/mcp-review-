# Design Document: Pharmacophore Tag Batch Remediation & Biologics Mechanism Model

**Date:** 2026-11-16  
**Status:** In Review  
**Target:** Med Chem & Pharmacology Review Platform  
**Authors:** DeepMind Antigravity Agent & User  

---

## 1. Problem Statement & Motivation

During functional testing on `http://localhost:3000/`, several pharmacophore tags across review modules were found to be completely dysfunctional (clicking the tag pill produced **0 highlighted atoms or visual effects**):

1. **Biologics / Thrombolytic Agents (17 tags across 5 drugs)**:
   Alteplase, Reteplase, Tenecteplase, Streptokinase, and Urokinase are macromolecular therapeutic enzymes (30,000–59,000 Da). Currently, they display an arbitrary, unhelpful 2D peptide fragment. In `src/utils/smartsDictionary.ts`, their tertiary structure domain tags (*Kringle-2*, *catalytic triad*, *EGF domain*, *finger domain*, *PAI-1 resistance motif*) are intercepted by `isBiologicOrMacromolecule()`, returning an empty SMARTS query (`""`). In `SmilesCanvas.tsx`, empty SMARTS immediately aborts matching, rendering zero highlights.
2. **Broken Small-Molecule Tags (~43 tags across 6 modules)**:
   - **Warfarin (`4-Hydroxycoumarin lactone ring`)**: The dictionary coumarin query specifies unsubstituted alkene carbons (`=CC=`), failing against 3,4-disubstituted coumarin derivatives.
   - **Dabigatran etexilate (`Hexyl carbamate`)**: Corrupted SMILES in `dabigatranWorkbenchData.ts` has an alkylurea (`CCCCCCNC(=O)N`) missing the ester oxygen, causing RDKit carbamate substructure queries to fail.
   - **Corticosteroids (6 drugs)**: `Delta-1,4-diene-3-one` has invalid SMARTS syntax (`O=C1C=CC2C(=C1)`).
   - **Fondaparinux**: `Sulfamido groups` defines sulfamide (`NS(=O)(=O)N`) instead of sulfamate ester (`NS(=O)(=O)O`).
   - **Apixaban & Rivaroxaban**: Overly rigid aromaticity queries for pyrazolopyridinone and morpholinone rings.
   - **Sodium Nitroprusside**: Inorganic coordination cage tags (`Octahedral Fe`, `Cyanide ligands`) were blocked by biologic patterns.
   - **Theophylline & Zafirlukast**: Purine dione and indole queries fail against N-methylated heterocyclic nitrogens.
   - **Olodaterol**: Lacked canonical SMILES in module data.
3. **StructureComparator Selection Glitch**:
   Navigating between drugs retains previously clicked tags in `activeTagsA` and `activeTagsB`, displaying phantom active tags for the new drug.

---

## 2. Architecture & Design

### Component 1: Interactive Fibrinolysis Mechanism Cascade (`FibrinolysisCascadeViewer.tsx`)

For macromolecular biologics (specifically thrombolytics and fibrinolytic enzymes), we replace the small-molecule 2D SMILES canvas with a responsive, accessible vector diagram illustrating the **Fibrinolytic Cascade**, modeled on authoritative pharmacology textbooks (Goodman & Gilman 14th Ed. Ch. 32; DiPiro 12th Ed.; Katzung 15th Ed.):

```
       [Circulating / Clot-Bound Plasminogen (Inactive Zymogen)]
                                  │
                                  ▼  <─── [Fibrinolytic Enzyme (+)]
                                          (Alteplase, Reteplase, Tenecteplase, etc.)
                                          (Inhibited by PAI-1)
       [Plasmin (Active Serine Protease)]
                                  │
                                  ▼  <─── [Clot Digestion (Fibrinolysis)]
       [Cross-Linked Fibrin Clot] ───────► [Fibrin Degradation Products (D-Dimer)]
```

#### Key Capabilities & Tag Interactivity
- **Responsive SVG Canvas**: Auto-scales to card dimensions (height ~220px–260px), honoring Dark/Light theme colors (Obsidian, Slate, Emerald, Blue).
- **Interactive Domain-to-Mechanism Mapping**:
  When a user clicks or hovers a domain tag in `PharmacophoreTagList`, the diagram dynamically highlights the functional node or regulatory arrow:
  - `Kringle-2 domain (fibrin specificity)`: Highlights the **Fibrin-Binding / Lysine Anchor** zone connecting the enzyme to clot-bound plasminogen.
  - `Protease catalytic domain / triad`: Highlights the **Arg561–Val562 peptide bond cleavage activation arrow**.
  - `Finger domain`: Highlights the **High-affinity fibrin binding** interaction.
  - `EGF domain`: Highlights the **Hepatic clearance receptor** binding node.
  - `KHRR296-299AAAA PAI-1 resistance motif`: Highlights the **PAI-1 Inhibition checkpoint** with a shielded "PAI-1 Resistant" indicator.
  - `T103N / N117Q glycosylation modifications`: Highlights the **Plasma Half-Life Extension** status badge (3.5 min vs. 20 min).
  - `Bacterial protein / 1:1 plasminogen binding` (Streptokinase): Highlights the **Non-enzymatic allosteric complexation** pathway.
- **Integration Points**:
  - `InteractiveStructureViewer.tsx`: Checks `isBiologicOrMacromolecule(structure)` or `structure.isBiologic`. If true, renders `FibrinolysisCascadeViewer` with current `activePharmacophoreIds` and `hoveredPharmacophoreId`.
  - `ChemicalStructureCard.tsx`: Passes active tag state to the viewer seamlessly.

---

### Component 2: Batch SMARTS Dictionary & Data Remediation

#### A. Data String Fixes
1. **Dabigatran etexilate** in `src/data/dabigatranWorkbenchData.ts`:
   - Replace corrupted urea SMILES with authentic PubChem CID 135565674:
     `CCCCCCOC(=O)NC(=N)C1=CC=C(C=C1)NCC2=NC3=C(N2C)C=CC(=C3)C(=O)N(CCC(=O)OCC)C4=CC=CC=N4`
2. **Olodaterol** in `src/data/respiratoryReviewModuleData.ts`:
   - Supply canonical SMILES for Olodaterol (PubChem CID 11522204):
     `CCC1(CCC2=C(C1)C=C(C=C2)OC)NCC(C3=CC4=C(C=C3)NC(=O)C(=C4)O)O`

#### B. SMARTS Dictionary Overhaul (`src/utils/smartsDictionary.ts`)
1. **Warfarin Coumarin Core**:
   - Add specific entry for `4-hydroxycoumarin` and update `coumarin`:
     `O=c1oc2ccccc2c(O)c1` (matches 4-hydroxycoumarin 12-atom core).
     `O=c1oc2ccccc2cc1` (matches generic coumarin/chromen-2-one).
2. **Hexyl Carbamate**:
   - `CCCCCC[OX2][CX3](=[OX1])[NX3]` (matches all 10 atoms of the hexyl carbamate lipophilic tail).
3. **Corticosteroids (`Delta-1,4-diene-3-one`)**:
   - Replace invalid ring SMARTS with valid conjugated 3-keto-1,4-diene:
     `O=C1C=CC2=C1CCC3C2CCC4...` or localized query: `O=C1[#6]=[#6][#6]~[#6](=[#6]1)`.
4. **Fondaparinux (`Sulfamido groups`)**:
   - Add sulfamate ester query `[NX3][SX4](=[OX1])(=[OX1])[OX2]` alongside sulfate ester `[OX2][SX4](=[OX1])(=[OX1])[OX2]`.
5. **Apixaban (`Pyrazolopyridine / Pyrazolopyridinone core`)**:
   - Provide exact pyrazolo[3,4-c]pyridinone SMARTS: `O=C1CC2=NN(c3ccc(N4CCCCC4=O)cc3)C(=C2CN1)`.
6. **Rivaroxaban (`Morpholinone`)**:
   - Match substituted morpholin-3-one: `O=C1CNCCO1`.
7. **Sodium Nitroprusside**:
   - Support `[Fe]` coordination center and `[C]#[N]` cyano ligands; remove from blanket biologic exclusion.
8. **Theophylline & Xanthines (`Purine dione core`)**:
   - Support methylated xanthine nitrogens: `O=c1[nX3]c(=O)[nX3]c2[nX3]c[nX3]c12`.
9. **Diltiazem (`Benzothiazepine bicycle`)**:
   - Add 1,5-benzothiazepin-4-one: `O=C1CCSc2ccccc2N1`.
10. **Zafirlukast (`Indole core`)**:
    - Support N-substituted indole: `c1ccc2c(c1)cc[nX3]2`.

---

### Component 3: Comparator Selection Reset (`StructureComparator.tsx`)

Add a hook watching `selectedStructureA?.id` and `selectedStructureB?.id`:
```typescript
useEffect(() => {
  setActiveTagsA({});
  setActiveTagsB({});
}, [selectedStructureA?.id, selectedStructureB?.id]);
```
Ensures selecting a new drug completely resets active tag highlights, preventing mismatched tag badges.

---

## 3. Verification & Testing Plan

1. **Automated RDKit WASM Tag Audit (`scratch/audit_all_pharmacophore_tags.ts`)**:
   - Re-run the comprehensive test script across all 300 tags in all 6 review modules.
   - Target: 100% of small-molecule tags match with $\ge 1$ atom highlighted; 0 errors or crashes.
2. **Biologic Mechanism Interaction Testing**:
   - Verify Alteplase, Reteplase, Tenecteplase, Streptokinase, and Urokinase render `FibrinolysisCascadeViewer`.
   - Verify clicking each of the 17 domain tags activates the corresponding pathway node with color-coded highlight halos and explanatory tooltips.
3. **Browser Verification on `http://localhost:3000/`**:
   - Test Warfarin (Page 1 Anticoagulants): verify `4-Hydroxycoumarin lactone ring` highlights 12 atoms.
   - Test Dabigatran etexilate: verify `Hexyl carbamate` highlights 10 atoms.
   - Test Thrombolytics (Page 8 Anticoagulants): verify all 17 tags interactively highlight cascade nodes.
   - Test `StructureComparator`: verify tags clear when switching drugs.
4. **Build & Typecheck**:
   - Run `npm run lint` (`tsc --noEmit`) and `npm run build` (Vite) to ensure zero regressions.
