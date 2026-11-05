# Design Specification: Interactive Medicinal Chemistry Structural Workbench

**Date**: 2026-11-04  
**Author**: Antigravity & User Pair Programming  
**Status**: Ready for Final Approval  
**Topic**: First-Class Structural Workbench Question Type for Multi-Step Prodrug & SAR Analysis

---

## 1. Intent and the Why

The MedChem Review Platform currently supports multiple-choice, true/false sub-statements, and structure matching. However, fundamental medicinal chemistry worksheets—exemplified by **Page 1, Question 2 of the Anticoagulants Review (`9) Review for Anticoagulants.pdf`)**—test multi-layered understanding of a single chemical structure:
- Identifying hydrolyzable amide vs. amide-like bonds (2a)
- Delineating bioreversible prodrug masking moieties (2b)
- Classifying the chemical nature of those moieties via drag-and-drop matching (2c)
- Selecting the active metabolite structure among intermediate prodrug metabolites and inactive degradation products (2d)

Currently, the platform cannot represent these integrated, multi-step structural workflows without either omitting the interactive chemistry or fragmenting the problem into disconnected, confusing questions. 

The goal of this project is to implement a **unified, cohesive Medicinal Chemistry Structural Workbench** that keeps the entire question contained within a single interactive view, with candidate structure choices positioned cleanly at the bottom.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
1. **Single Cohesive Workbench View**: Present sub-parts (2a encircle amides, 2b encircle prodrug moieties, 2c classify moiety nature, 2d select active form) in a single unified component without requiring page scrolling or disjointed cards.
2. **Interactive Moiety & Bond Encirclement with Distractor Halos**:
   - Step 2a: Encircle genuine amide and amide-like bonds while discriminating against non-amide distractors (e.g. ester carbonyl, benzimidazole nitrogen, pyridine ring).
   - Step 2b: Encircle genuine bioreversible prodrug masking groups while discriminating against core pharmacophore scaffolds (e.g. pyridine, benzimidazole, phenyl ring).
3. **Moiety Drag-and-Drop Matching**: Provide a functional group badge bank (**Ester**, **Carbamate**, and distractors **Phosphonate**, **Sulfonate**) draggable directly onto pre-anchored prodrug dropzones.
4. **Bottom Structure Selection with Pharmaceutical Rigor**: Render 4 candidate 2D chemical structures at the bottom of the workbench using RDKit WASM and pure Daylight SMILES:
   - **Correct Active Form (Dabigatran)**: Fully hydrolyzed free carboxylic acid and strongly basic benzamidine (CID 216210).
   - **Distractor Intermediate 1**: Carbamate intact, ethyl ester hydrolyzed to acid.
   - **Distractor Intermediate 2**: Ethyl ester intact, carbamate cleaved to free amidine.
   - **Distractor Degradant**: Central amide hydrolyzed into inactive fragments.
5. **Discrete 4-Point Scoring Model**: Award **1 point per sub-step** (4 points total for Question 2) integrated into `QuizSessionProgress` and exam mode statistics.
6. **Curated Pre-seeding & AI Schema Support**: Direct zero-latency seeding of Dabigatran etexilate workbench for the Anticoagulants review, plus schema support in `MEDCHEM_PAGE_RESPONSE_SCHEMA` for future PDF imports.

### Non-Goals
- Freehand stylus or pen drawing tool on canvas (standardized clickable substructure halos and drag-and-drop are far more objective, accessible, and reliably auto-graded).
- Arbitrary molecular modeling or 3D coordinate editing (focus is on 2D medicinal chemistry SAR and bioactivation).

### Anti-Goals
- **Splitting into 4 separate questions**: Anti-goal. The user explicitly requested a single cohesive workbench.
- **Relying solely on PubChem images**: Anti-goal. Prodrug intermediates and theoretical cleavage products often lack PubChem entries; candidate structures must render natively via RDKit MinimalLib using SMILES.

---

## 3. Constraints

- **Single Source of Truth for Structures**: RDKit MinimalLib (`SmilesCanvas`) must render candidate structures to avoid black-box canvas issues and maintain dark/light theme consistency.
- **Touch & Desktop Compatibility**: Substructure selection and badge assignment must work via both drag-and-drop and tap/click for mobile and tablet users.
- **Strict Backward Compatibility**: Existing multiple-choice, matching, and sub-statement questions must remain completely unaffected.

---

## 4. Approaches Considered

### Approach 1: Dedicated First-Class `'structural-workbench'` Question Type (Selected)
- Add `'structural-workbench'` to `AntiplateletQuestion.type` in `src/types/reviewModule.ts`.
- Store full workbench config (`stemStructure`, `step2a_amides`, `step2b_moieties`, `step2c_nature`, `step2d_activeForm`).
- Render via a dedicated `<StructuralWorkbenchQuestion>` component inside `DocumentQuestionItem.tsx`.
- **Pros**: Perfectly matches the user's requirement for a cohesive single-page workbench; clean visual separation with structure selection anchored at the bottom; full TypeScript safety and grading telemetry.
- **Cons**: Requires adding new types and updating the Gemini extractor schema.
- **Decision**: **Selected by the user.**

### Approach 2: Decomposed Sequential Questions under Shared QuestionBlock
- Split into 4 separate items (2a multiple choice, 2b substructure list, 2c matching question, 2d multiple choice).
- **Pros**: Reuses existing question UI without new component types.
- **Cons**: Fragments the user experience, contradicts user instruction for a single cohesive workbench, and leads to excessive scrolling.
- **Decision**: Rejected.

---

## 5. Detailed Architecture & Design

### 5.1 Type Definitions (`src/types/reviewModule.ts`)

```typescript
export interface WorkbenchHaloTarget {
  id: string; // e.g., 'amide_central', 'carbamate_right', 'distractor_ester'
  label: string; // e.g., 'Tertiary Methylamide', 'Carbamate linkage'
  smarts?: string; // e.g., 'C(=O)N(C)'
  isCorrect: boolean; // TRUE for genuine targets, FALSE for distractors
  rationale: string;
  x: number; // relative SVG coordinates for anchor halo
  y: number;
  radius?: number;
}

export interface WorkbenchDropZone {
  id: string; // e.g., 'left_prodrug_zone', 'right_prodrug_zone'
  targetMoietyId: string;
  label: string; // e.g., 'Left Moiety', 'Right Moiety'
  correctBadge: string; // 'Ester' or 'Carbamate'
  rationale: string;
  x: number;
  y: number;
}

export interface WorkbenchStructureCandidate {
  id: string;
  name: string; // 'Dabigatran (Active Form)', 'Intermediate BDPN'
  smiles: string; // Canonical Daylight SMILES
  cid?: number;
  isCorrect: boolean;
  classification: 'active' | 'intermediate' | 'degradant';
  rationale: string;
}

export interface StructuralWorkbenchData {
  stemStructure: ChemicalStructure;
  instructions?: string;
  step2a_amides: {
    title: string;
    prompt: string;
    targets: WorkbenchHaloTarget[]; // Contains 2 correct amides + 3 distractors
  };
  step2b_moieties: {
    title: string;
    prompt: string;
    targets: WorkbenchHaloTarget[]; // Contains 2 correct prodrug moieties + 3 scaffold distractors
  };
  step2c_nature: {
    title: string;
    prompt: string;
    badgeBank: string[]; // ['Ester', 'Carbamate', 'Phosphonate', 'Sulfonate']
    dropZones: WorkbenchDropZone[]; // Pre-anchored drop targets
  };
  step2d_activeForm: {
    title: string;
    prompt: string;
    candidates: WorkbenchStructureCandidate[]; // 4 candidates rendered via SmilesCanvas
  };
}

// User submission state for the entire workbench
export interface StructuralWorkbenchAnswer {
  selectedAmideIds: string[];
  selectedMoietyIds: string[];
  dropZoneAssignments: Record<string, string>; // dropZoneId -> badgeName
  selectedCandidateId: string | null;
  submittedAt?: string;
}

// Extended AntiplateletQuestion
export interface AntiplateletQuestion {
  // ... existing fields
  type: 'multiple-choice' | 'sub-statements' | 'matching' | 'ranking' | 'structural-workbench';
  structuralWorkbench?: StructuralWorkbenchData;
}
```

### 5.2 Scoring Model & Integration (4 Points Total)

Each sub-step is evaluated independently for 1 point:
1. **Step 2a (1 pt)**: Earned if all correct amide halos are selected and zero distractor halos are selected.
2. **Step 2b (1 pt)**: Earned if all correct prodrug moiety halos are selected and zero scaffold distractors are selected.
3. **Step 2c (1 pt)**: Earned if all dropzones have the correct functional group badge assigned (e.g. Left = Ester, Right = Carbamate).
4. **Step 2d (1 pt)**: Earned if the active form structure candidate (Option A) is selected.

**Progress & Gradebook Metrics**:
- Question value: 4 points.
- Question counts as `isAnswered` once the student submits or interacts across all steps.
- Partial credit is transparently tallied in `QuizSessionProgress` and rendered in the session summary.

### 5.3 Component Architecture (`StructuralWorkbenchQuestion.tsx`)

Located in `src/components/StructuralWorkbenchQuestion.tsx`:
1. **Workbench Navigation & Status Strip**:
   - Tabs for `2a. Amide Bonds`, `2b. Prodrug Moieties`, `2c. Moiety Nature (Drag & Drop)`.
   - Score badges indicating progress (e.g. `2/2 Selected`, `Drop 2 Badges`).
2. **Chemical Structure Canvas**:
   - Clean vector schematic of Dabigatran etexilate rendered with dynamic stroke styling (`var(--structure-bond-stroke)`) on transparent/adaptive canvas (`var(--structure-canvas-bg)`).
   - In Step 2a: Dashed target halos for amides + distractors (ester, pyridine, benzimidazole). Tapping/clicking toggles selection state.
   - In Step 2b: Dashed halos for prodrug groups + distractors (fused core, pyridine, linker).
   - In Step 2c: Pre-anchored dropzones over the ethyl ester and hexyloxycarbonyl regions. Badges can be dragged from the bank or tapped to assign.
3. **Bottom Candidate Structure Grid (Step 2d)**:
   - Anchored neatly at the bottom with 4 candidate cards.
   - Each card embeds `<SmilesCanvas width={260} height={140} smiles={candidate.smiles} />` with active metabolite chemistry explanations.
4. **Explanation & Solution Key**:
   - Comprehensive bioactivation pathway breakdown showing carboxylesterase hydrolysis, carbamate decarboxylation, and therapeutic target binding to thrombin.

---

## 7. Deliverables & Rollout Plan

1. **Phase 1**: Add TypeScript interfaces to `src/types/reviewModule.ts` and update storage/progress reducers.
2. **Phase 2**: Build `StructuralWorkbenchQuestion.tsx` with interactive halos, drag & drop badge bank, and 2D candidate structure cards.
3. **Phase 3**: Integrate `<StructuralWorkbenchQuestion>` into `DocumentQuestionItem.tsx`.
4. **Phase 4**: Seed curated Page 1 Question 2 Dabigatran etexilate data into the Anticoagulants module and update Gemini prompt schemas.
5. **Phase 5**: Verification build (`npm run lint`, `npm run build`), full end-to-end testing in light and dark mode.
