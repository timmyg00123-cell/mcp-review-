# Design Spec: High-Fidelity Page-by-Page MedChem Review Importer

**Date:** 2026-11-04  
**Status:** Approved  
**Author:** Pair Programming Assistant & User

## 1. Context & Motivation
When generating an Anticoagulant review from `9) Review for Anticoagulants.pdf`, the existing lecture ingestion pipeline (`/api/gemini/extract-graph`) chunked the document into 2-slide batches with a schema that only supported 4-option multiple-choice questions. This caused:
1. Complete omission of authentic multi-part exam questions (only 13 generic practice questions were generated across 7 pages instead of ~19 multi-part question blocks with dozens of sub-statements).
2. Question alterations (True/False propositions *a* through *k* and drag-and-drop matching items were forced into altered multiple-choice stems).
3. Loss of cross-page chemical structure context.

The gold standard in `src/data/antiplateletQuizData.ts` demonstrates the desired quality: verbatim question stems, distinct True/False `subStatements` with medicinal chemistry rationales, drag-and-drop `matchingTargets`, and PubChem-audited 2D chemical structures with pharmacophore highlights.

## 2. Architecture & Design

### A. Dual-Dropzone Importer UI (`src/components/MedChemReviewImporterModal.tsx`)
- **Primary Dropzone (Review Worksheet / Blueprint)**:
  - Accepts PDF, DOCX, or images of the review worksheet (e.g. `9) Review for Anticoagulants.pdf`).
  - Authoritative for page structure, question order, Roman numeral structures (I, II, III), matching items, and True/False statements.
- **Secondary Dropzone (Authoritative Source Material / Lecture Slides - Optional)**:
  - Accepts course lecture deck or monographs (e.g. `9) Antithrombotics (Anticoagulants).pdf`).
  - Used strictly as the reference library for SAR rationales, receptor docking details, and answer verification without rewriting exam questions.
- **Per-Page Sequential Progress**:
  - Live progress tracker: "Page X of N: Extracting questions...", "Auditing structures with NIH PubChem...".
- **Review Module Preview**:
  - Accordion showing extracted pages, question breakdown (`sub-statements`, `matching`, `multiple-choice`, `ranking`), and 2D chemical structure cards before saving to IndexedDB (Dexie).

### B. Client-Side Page Orchestrator (`src/services/fileParser.ts`)
- Leverages `pdfjs-dist` to render each page to:
  - High-resolution JPEG canvas (`inlineData`) for multimodal vision.
  - Page text string.
- Sequentially calls the backend per-page endpoint `/api/gemini/medchem-review-page`, passing accumulated structures across pages to preserve Roman numeral identity.

### C. Dedicated Per-Page Backend Endpoint (`server.ts` -> `/api/gemini/medchem-review-page`)
- **Payload**:
  - `pageNumber`: number (1-indexed)
  - `totalPages`: number
  - `pageText`: string
  - `pageImage`: base64 JPEG
  - `sourceFiles`: array of lecture reference items (text/base64)
  - `previouslyExtractedStructures`: array of structures already resolved on earlier pages
- **Extraction Schema & Logic**:
  - Strictly preserves question formats:
    - `sub-statements`: `subStatements: [{ id, statement, isCorrect, rationale }]`
    - `matching`: `matchingTargets: [{ id, label, acceptedStructureIds, rationale }]`
    - `multiple-choice`: `options`, `correctIndex`, `optionExplanations`
    - `ranking`: `rankingItems: [{ id, label, correctRank, rationale }]`
  - Extracts local chemical structures (I, II, III, IV) with 3-5 pharmacophores and `casual_sar_explanation`.
  - PubChem PUG REST verification for CIDs, Daylight Canonical SMILES, and 2D SDF/MOL blocks.

## 3. Data Model
Direct mapping to `ReviewModule`, `ReviewPage`, `ReviewSection`, `AntiplateletQuestion`, `ChemicalStructure` defined in `src/types/reviewModule.ts`.
