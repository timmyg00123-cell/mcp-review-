# Design Specification: Comprehensive Review Overhaul, Med Chem Matrix Polish & 3D Target Pocket Viewer

**Date**: 2026-11-05  
**Author**: Antigravity & User Pair Programming  
**Status**: Pending Review & Approval  
**Strategy**: Approach B + Matrix & UI Enhancement (5-Stage Comprehensive Overhaul)  

---

## 1. Intent and Scope

The MedChem Review Platform provides pharmacy and medicinal chemistry students with rigorous practice worksheets covering cardiovascular pharmacology. While Review 9 (Anticoagulants) features a dedicated multi-step interactive Structural Workbench for Dabigatran etexilate, an audit of the imported dev-server JSON files, source PDF worksheets, and user feedback on the Med Chem Matrix and general UI identified 5 critical enhancement areas:

1. **Review 10 (Heart Failure)**: Currently contains only **11 out of 21 questions** in the imported JSON. The automated parser collapsed pages 3 and 4 into generic placeholders and dropped the drawing, encircling, and classification exercises.
2. **Review 11 (Antiarrhythmic Drugs)**: Contains **28 out of 33 questions**. Pages 1–6 are faithful, but Pages 7 and 8 defaulted to generic placeholders, losing Amiodarone SAR/thyrotoxicity (Q30) and active metabolite structures (Q31–Q33).
3. **Review 8 (Antiplatelets)**: Contains all **25 questions**, but lacks an interactive structural workbench for Thienopyridine prodrug activation and covalent target disulfide formation.
4. **Med Chem Matrix & General UI Issues**:
   - **Structure Image Loading Failures**: In `MedChemMatrix.tsx`, selecting drugs in the comparator dropdown frequently fails to update the structure or shows "Structure unavailable" because selection state used drug names while lookup matched strictly against `s.id`, and `pngUrl` fallbacks were missing PubChem CID URL resolution.
   - **Missing Visuals in Matrix Table**: The table was purely textual without visual chemical structure thumbnails.
   - **UI Polish**: Sticky table column contrast in dark mode, filter reset behavior, and tab navigation smoothness need modern institutional refinement.
5. **Target Visualization Gap (Direction 3)**: Students evaluate 2D chemical structures without seeing how those functional groups physically dock into their 3D human macromolecular targets (Thrombin, Factor Xa, $\text{Na}^+/\text{K}^+$-ATPase, ACE catalytic zinc domain, and P2Y12 receptor).

This specification outlines a 5-stage overhaul to restore complete curriculum fidelity, repair and enhance the Med Chem Matrix and general UI, and embed an interactive **3D Macromolecular Target Pocket Viewer**.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
1. **Full Curriculum Fidelity (Reviews 8, 9, 10, 11)**:
   - Restore **all 21 questions** of Review 10 (Heart Failure), including Digoxin stereochemistry, ARB/neprilysin inhibitors, and ACE inhibitor zinc-binding classes.
   - Restore **all 33 questions** of Review 11 (Antiarrhythmics), including Amiodarone SAR, Dronedarone contrast, and metabolite structures.
   - Retain all 25 questions of Review 8 and all 16 questions of Review 9.
2. **Curated Interactive Workbenches**:
   - **Review 10**: *Cardiac Glycoside Inotropy & Steroid SAR Workbench* (Q4 glycone/aglycone encircling + Q6 inotropic candidate evaluation) and *ACE Inhibitor Zinc-Binding Domain Workbench* (Q18).
   - **Review 11**: *Class I Sodium Channel Pharmacophore & Dissociation Kinetics Workbench* (Q1–Q6, Q27–Q29) and *Amiodarone vs Dronedarone SAR Workbench* (Q30).
   - **Review 8**: *Thienopyridine Prodrug Bioactivation & Target Disulfide Workbench* (Q14–Q16).
3. **Med Chem Matrix & General UI Overhaul**:
   - **Bulletproof Structure Resolution**: Synchronize `drugA` and `drugB` selection state in `MedChemMatrix.tsx` and `StructureComparator.tsx` across `id`, `name`, and canonical key, preventing dropdown desynchronization.
   - **Multi-Tier Structure Image Rendering**: Guarantee structure images render via RDKit WASM, PubChem MolBlock, or auto-derived PubChem CID PNG URLs (`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=large`).
   - **Matrix Table Thumbnails**: Add high-contrast 2D chemical structure thumbnails directly in the sticky Drug & CID column with 1-click lightbox expansion.
   - **UI Modernization**: Polish theme switching, sticky table headers, badge styling, and mobile-friendly responsive overflow.
4. **Interactive 3D Macromolecular Target Pocket Viewer (Direction 3)**:
   - Provide an in-app 3D co-crystal viewer (`MacromolecularPocketViewer.tsx`) alongside 2D structures and SAR rationales.
   - Grounded in verified PDB co-crystal structures:
     - Thrombin + Dabigatran (`1KTS`)
     - Factor Xa + Rivaroxaban (`2J4I`)
     - $\text{Na}^+/\text{K}^+$-ATPase + Digoxin (`4RET`)
     - ACE catalytic domain + Captopril/Lisinopril (`1UZF`)
     - P2Y12 receptor (`4PXZ`)
   - Surface an interactive `sidecar://` pill link per Science Visualization Priority Rules.
5. **Robust Storage & Zero-Latency Pre-seeding**:
   - Pre-seed modules 8, 9, 10, and 11 into `src/utils/moduleStorage.ts` so users immediately have the complete, verified curriculum out-of-the-box.
6. **Strict Backward Compatibility**:
   - Existing session states, progress trackers, and standard question types remain untouched and error-free.

---

## 3. Detailed Architecture & Design

### Stage 1: Review 10 (Heart Failure) Restoration & Workbenches

#### 1.1 Complete 21-Question Data Model
- **Page 1 (Cardiac Glycosides: Digoxin)**:
  - Q1: Drug classes not used in heart failure (non-DHP CCBs, antiarrhythmics).
  - Q2: Chemical & mechanistic class of Digoxin (cardiac glycoside, $\text{Na}^+/\text{K}^+$-ATPase inhibitor).
  - Q3: Digoxin SAR true/false statements.
  - **Q4 [Workbench Part 1]**: Encircle Glycone (3x D-digitoxose sugars; PK role) vs Aglycone (Digoxigenin steroid nucleus; PD target binding).
  - Q5: Cardiac glycosides clinical and toxicological characteristics (hypokalemia increases toxicity).
- **Page 2 (Inotropic Steroids & Adrenergic Agents)**:
  - **Q6 [Workbench Part 2]**: Evaluation of Steroids A–F to deduce which molecule retains positive inotropic activity (requires *cis/trans/cis* U-shaped ring junctions and unsaturated lactone / nitrile bioisostere).
  - Q7: Classes of adrenergic molecules (Dobutamine $\beta_1$ agonist, Metoprolol $\beta_1$ selective blocker, Carvedilol $\alpha_1/\beta_1/\beta_2$ blocker).
  - Q8: Positive inotropic activity (Dobutamine).
  - Q9: Antioxidant properties (Carvedilol carbazole moiety).
  - Q10: Vasodilatory effect (Carvedilol $\alpha_1$ blockade).
  - Q11: Negative chronotropic effect and survival benefit (Carvedilol, Metoprolol).
- **Page 3 (Renin-Angiotensin System & ARBs)**:
  - Q12: Comparison of Dobutamine vs Digoxin.
  - Q13: ARBs (Losartan, Valsartan) pharmacological mechanism.
  - Q14: Prodrug status (Sacubitril ester).
  - Q15: Bioactivation into Sacubitrilat (active neprilysin inhibitor).
  - Q16: Rational basis of Entresto (Valsartan + Sacubitril).
- **Page 4 (ACE Inhibitors & Zinc-Binding Pharmacophores)**:
  - Q17: Chemical & mechanistic classes of Captopril, Lisinopril, Fosinopril.
  - **Q18 [Workbench]**: Classify molecules by catalytic $\text{Zn}^{2+}$-binding domain:
    - Sulfhydryl ($\text{-SH}$): Captopril.
    - Dicarboxylate ($\text{-COO}^-$): Lisinopril, Enalaprilat.
    - Phosphinate ($\text{-PO}_2^-$): Fosinopril.
  - Q19: Prodrug status of Fosinopril (ester prodrug).
  - Q20: Shortest duration of action (Captopril).
  - Q21: Head-to-head SAR comparison of Captopril vs Lisinopril.
- **Page 5 (Vasodilators & Funny-Current Inhibitors)**:
  - Ivabradine (hyperpolarization-activated cyclic nucleotide-gated $I_f$ channel blocker) vs Milrinone (PDE3 inhibitor).

#### 1.2 Heart Failure Structural Workbench Implementation
- Pre-seeded in `src/data/heartFailureWorkbenchData.ts`.
- Sub-steps:
  - `step1_encircling`: Digoxin glycone vs aglycone halos.
  - `step2_candidateSelection`: 6 steroid structures (A–F) rendered with Daylight SMILES via RDKit `SmilesCanvas`.
  - `step3_znBindingDomain`: Drag-and-drop badge assignment for ACE inhibitors (Sulfhydryl, Dicarboxylate, Phosphinate).

---

### Stage 2: Review 11 (Antiarrhythmics) Restoration & Workbenches

#### 2.1 Complete 33-Question Data Model
- **Pages 1–2 (Class I Sodium Channel Blockers)**:
  - Q1–Q6: Class IA (Procainamide, Disopyramide, Quinidine), Class IB (Lidocaine, Mexiletine), Class IC (Flecainide, Propafenone).
  - Q7–Q14: Action potential duration, Procainamide $N$-acetylation polymorphism, acute IV indications (Lidocaine), CYP2D6 metabolism (Propafenone), TdP risk, active metabolites.
- **Page 3 (Class II Beta-Blockers & Class III Hybrids)**:
  - Q15–Q22: Esmolol ultrashort esterase cleavage, Sotalol chiral methanesulfonanilide class II/III hybrid.
- **Pages 4–5 (Quinidine Stereochemistry & SAR)**:
  - Q23–Q26: Quinidine 4 chiral centers ($3R, 4S, 8R, 9S$), quinuclidine nitrogen ($pK_a \approx 11$) vs quinoline nitrogen ($pK_a \approx 4.2$), active 3-hydroxyquinidine metabolite.
- **Pages 6–8 (Kinetics & Amiodarone SAR Restoration)**:
  - Q27–Q29: Sodium channel surface area contact & dissociation kinetics:
    - Pharmacophore: Lipophilic aromatic ring + 3–4 atom linker + basic amine.
    - Class IA: intermediate-off ($1-10\text{ s}$).
    - Class IB: fast-off ($<1\text{ s}$).
    - Class IC: slow-off ($>10\text{ s}$).
  - Q30: **Amiodarone multi-class profile & thyrotoxicity**:
    - Iodine atoms (thyroid antagonism / pulmonary fibrosis).
    - Dronedarone contrast (removal of iodines, addition of methylsulfonamide to lower $\log P$ from 7.8 to 5.2 and eliminate thyroid toxicity).
  - Q31–Q33: Prodrug rationales and active metabolite chemical structures.

---

### Stage 3: Review 8 (Antiplatelets) Enrichment & Workbench

#### 3.1 Thienopyridine Prodrug Activation Workbench (Q14–Q16)
- Pre-seeded in `src/data/antiplateletWorkbenchData.ts`.
- Sub-steps:
  - **Step 1 (Bioactivation Pathway Comparison)**:
    - Clopidogrel: 2-step CYP oxidation (85% shunted to inactive carboxylic acid by carboxylesterase-1).
    - Prasugrel: 1-step intestinal carboxylesterase-2 to thiolactone, followed by single CYP step (rapid onset ~30 min).
  - **Step 2 (Active Thiol Halo Identification)**:
    - Encircle the nucleophilic free thiol ($\text{-SH}$) on the opened thiolactone active metabolite.
  - **Step 3 (Covalent Target Trapping)**:
    - Select the covalent mixed disulfide bond ($\text{R-S-S-R'}$) with Cys17/Cys270 on the human P2Y12 receptor.

---

### Stage 4: Med Chem Matrix & Structure Image Loading Overhaul & General UI Polish

#### 4.1 Structure Loading & Selection Desynchronization Fix
- **Root Cause Identified**:
  - `StructureComparator.tsx` dropdown emitted `s.name` (`targetName`), while `MedChemMatrix.tsx` tracked `drugA` and `drugB` by `s.id` and performed strict `s.id === drugA` searches. When a user selected a drug, the lookup returned `undefined` and fell back to `structures[0]`, locking the viewer or causing visual flicker.
  - In `moduleStructures`, `pngUrl` was often `undefined`. When RDKit took time or failed, no fallback image was available even though `s.cid` was known.
- **Architectural Solution**:
  1. **Dual-Key Structure Resolution**:
     ```typescript
     const resolveStructureSafe = (key: string, pool: ChemicalStructure[]): ChemicalStructure | undefined => {
       const norm = key.trim().toLowerCase();
       return pool.find((s) => 
         s.id.toLowerCase() === norm ||
         s.name.toLowerCase() === norm ||
         getCanonicalDrugKey(s.name) === getCanonicalDrugKey(key) ||
         (s.cid && `${s.cid}` === key)
       );
     };
     ```
  2. **Multi-Tier Robust Structure Rendering Pipeline**:
     - Tier 1: RDKit WASM MinimalLib with dynamic theme stroke styling.
     - Tier 2: 2D MolBlock from PubChem audit cache.
     - Tier 3: Auto-derived PubChem CID PNG URL:
       ```typescript
       const resolvedFallbackUrl = structure.pngUrl || 
         (structure.cid ? `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${structure.cid}/PNG?image_size=large` : undefined);
       ```
     - Tier 4: Clear chemical structure placeholder with a 1-click "Retry / Inspect PubChem" button.

#### 4.2 Matrix Table Enhancements & General UI Polish
- **Visual Structure Thumbnails in Table**:
  - Insert a high-contrast 44x44px 2D structure thumbnail in the sticky first column alongside the Drug Name and CID.
  - Clicking the thumbnail opens the full Lightbox Studio modal with zoom/pan and pharmacophore overlays.
- **General UI Polish**:
  - **Table Contrast & Sticky Shadow**: Fix dark mode background opacity and borders on sticky table headers and columns to eliminate visual bleeding during horizontal scrolling.
  - **Navigation Bar**: Modernize active tab indicators with soft indigo pills and smooth transitions.
  - **Responsive Design**: Ensure mobile and tablet viewports provide clear horizontal scroll hint badges ("Scroll for PK/PD →").

---

### Stage 5: 3D Macromolecular Target Pocket Viewer Engine

#### 5.1 Component Architecture (`src/components/MacromolecularPocketViewer.tsx`)
- Embeds an interactive 3D WebGL protein-ligand viewer with light/dark theme adaptation.
- Built on top of a lightweight, robust 3D molecular renderer with fallback to high-resolution structural co-crystal renderings if WebGL is unavailable.
- Co-crystal Target Presets:
  1. **Thrombin + Dabigatran** (PDB `1KTS`):
     - Key residues highlighted: Asp189 (salt bridge to benzamidine), Ser195 (catalytic triad), Gly216.
  2. **$\text{Na}^+/\text{K}^+$-ATPase + Digoxin** (PDB `4RET`):
     - Key residues highlighted: Gln111, Glu117, Thr797 (intercalated steroid binding site).
  3. **ACE + Captopril / Lisinopril** (PDB `1UZF` / `2C6N`):
     - Key residues highlighted: Catalytic $\text{Zn}^{2+}$ ion, His383, Glu384, Tyr520.
  4. **P2Y12 Receptor + Antagonist** (PDB `4PXZ`):
     - Key residues highlighted: Cys17, Cys270 (covalent disulfide site), Lys280.
  5. **Factor Xa + Rivaroxaban** (PDB `2J4I`):
     - Key residues highlighted: Tyr228, Asp189, Gln192.
- UI Controls:
  - Representation toggles: **Cartoon + Ligand Sticks**, **Surface (Electrostatic)**, **Pocket Residues Only**.
  - Camera reset, auto-rotate toggle, distance measurement tool.
  - Sidecar Link Pill: A prominent `sidecar://` link compliant with user rules allowing one-click expansion into the Antigravity Biomolecular Structure Viewer sidecar.
  - Direct 1-click launch from Matrix table rows and Structure Comparator.

---

## 4. Verification & Testing Plan

1. **Curriculum Verification**:
   - Review 8: Verify all 25 questions load with 100% structures and answers.
   - Review 9: Verify all 16 questions + Dabigatran Structural Workbench load.
   - Review 10: Verify all 21 questions load with Digoxin and ACE workbenches.
   - Review 11: Verify all 33 questions load with Class I kinetics and Amiodarone questions.
2. **Matrix & Image Loading Verification**:
   - Test changing Drug A and Drug B in the Med Chem Matrix comparator across all 4 modules; verify zero blank canvases or desynchronization.
   - Verify table thumbnails render with lightbox click.
   - Verify auto-derived PubChem CID fallback images load seamlessly.
3. **Scoring & Telemetry Verification**:
   - Ensure all workbenches award discrete points (1 pt per step) and integrate seamlessly with `QuizSessionProgress`.
4. **3D Viewer Verification**:
   - Verify 3D canvas renders in both light and dark mode without WebGL context leaks.
   - Verify camera controls (zoom, pan, rotate) and residue highlight tooltips.
   - Verify `sidecar://` pill link functions correctly.
5. **Build & Lint Verification**:
   - `npm run lint` must pass with 0 errors.
   - `npm run build` must compile cleanly with 0 type errors.

---

## 5. Rollout Sequence

- **Step 1**: Review 10 complete restoration (all 21 questions) + Heart Failure Structural Workbench.
- **Step 2**: Review 11 complete restoration (all 33 questions) + Antiarrhythmics Kinetics Workbench.
- **Step 3**: Review 8 enrichment + Thienopyridine Bioactivation Workbench.
- **Step 4**: Med Chem Matrix structure loading repair, thumbnail integration, and general UI polish.
- **Step 5**: 3D Macromolecular Target Pocket Viewer integration across all 4 modules.
- **Step 6**: Full regression testing, linting, production build verification, and git commit.
