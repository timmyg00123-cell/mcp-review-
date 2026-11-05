# High-Fidelity Page-by-Page MedChem Review Importer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance the MedChem Review Importer with dual-dropzone uploads (Worksheet Blueprint + Optional Lecture Reference), client-side per-page orchestration, and a dedicated per-page extraction endpoint in `server.ts` guaranteeing 100% question fidelity (True/False sub-statements, drag-and-drop matching, and multiple-choice) with PubChem PUG REST auditing.

**Architecture:** The client-side parser (`fileParser.ts`) renders the uploaded review worksheet into individual high-resolution canvas page images and text. The importer modal (`MedChemReviewImporterModal.tsx`) streams each page sequentially to a new backend endpoint (`/api/gemini/medchem-review-page`) with optional lecture reference materials and prior page structure context. The server uses Gemini 3.8 Flash with a strict schema to extract complete, unaltered questions and structures for that page, enriches them via PubChem PUG REST, and returns a verified `ReviewPage`. The client stitches these into a complete `ReviewModule` ready for study and export.

**Tech Stack:** React 19, TypeScript, Express, @google/genai, pdfjs-dist, Dexie (IndexedDB), Tailwind CSS, PubChem PUG REST API.

**Spec:** `docs/superpowers/specs/2026-11-04-medchem-review-importer-high-fidelity-design.md`

## Global Constraints
- Preserve exact worksheet question stems and sub-statements (*a* through *k*) without summarization, redaction, or alteration.
- Strictly adhere to `ReviewModule`, `ReviewPage`, `ReviewSection`, `AntiplateletQuestion`, and `ChemicalStructure` interfaces in `src/types/reviewModule.ts`.
- Zero truncation: extract every page and every question regardless of document length.
- Maintain full backwards compatibility with existing built-in modules and `/api/gemini/medchem-review`.

## Review Focus
1. **Multi-proposition Sub-statements**: Questions like Q1 in `9) Review for Anticoagulants.pdf` with statements *a* through *k* must capture all 11 propositions with accurate `isCorrect` flags and rationales.
2. **Matching Questions**: Matching blocks with targets (e.g. "What is the chemical class of each...") must correctly map to `acceptedStructureIds` (Roman numerals I–IV).
3. **Cross-Page Structure Continuity**: Structures introduced on Page 1 (e.g. Argatroban as Structure I) must maintain consistent identity when referenced on subsequent pages.
4. **Scanned & Multimodal Inputs**: Pages without selectable text must be processed accurately via canvas JPEG base64 vision.
5. **Payload Size & Rate Limits**: Multi-page uploads with slide reference decks must not exceed Express JSON body limits or hit PubChem API throttling.

---

## Tasks

### Task 1: Backend Per-Page Extraction Endpoint & Schema

**Files:**
- Modify: `server.ts:1330-1650`
- Modify: `src/services/geminiPrompts.ts:160-250`
- Test: `test-review-page-endpoint.ts`

- [ ] **Step 1: Define Per-Page Gemini System Prompt & Response Schema**
  - In `src/services/geminiPrompts.ts`, export `MEDCHEM_PAGE_EXTRACTION_SYSTEM_PROMPT` and `MEDCHEM_PAGE_RESPONSE_SCHEMA` (or schema object compatible with `@google/genai`).
  - Ensure schema explicitly defines:
    - `pageNumber`, `pageTitle`, `subtitle`
    - `sections` array with `sectionTitle`, `headerNote`, `structures` array (Roman numeral `id`, `name`, `chemicalClass`, `pharmacologicalClass`, `cid`, `pharmacophores`, `target`, `reversibility`, `route`, `keyFunctionalGroups`, `pkPdHighlights`, `sarNotes`)
    - `questions` array with `questionNumberLabel`, `category`, `questionStem`, `type` (`"multiple-choice" | "sub-statements" | "matching" | "ranking"`), `matchingTargets`, `subStatements`, `options`, `correctIndex`, `optionExplanations`, `overallExplanation`, `highYieldPearl`, `sourceReference`.

- [ ] **Step 2: Implement `/api/gemini/medchem-review-page` in `server.ts`**
  - Create `app.post('/api/gemini/medchem-review-page', ...)`:
    - Accept `pageNumber`, `totalPages`, `pageText`, `pageImageBase64`, `sourceFiles` (lecture reference), `previouslyExtractedStructures`, `documentTitle`.
    - Construct Gemini multimodal prompt combining page image (`inlineData`), page text, lecture notes (Input 2), and known structures list.
    - Call `generateWithFallback` with temperature 0.1 for high fidelity.
    - Parse JSON output and run PubChem verification on any newly identified chemical structures.
    - Return `{ page: ReviewPage, newlyDiscoveredStructures: ChemicalStructure[] }`.

- [ ] **Step 3: Write Backend Unit/Integration Test**
  - Create `test-review-page-endpoint.ts` to test `/api/gemini/medchem-review-page` using Page 1 text of `9) Review for Anticoagulants.pdf`.
  - Verify that Question 1 is extracted as `sub-statements` with statements *a* through *k*, and Structures I and II are recognized with PubChem CIDs.
  - Run via `npx tsx test-review-page-endpoint.ts` and confirm passing results.
  - Remove test script upon verification.

---

### Task 2: Client-Side Page Renderer & Extractor Helper

**Files:**
- Modify: `src/services/fileParser.ts:35-150`
- Test: `test-client-page-splitter.ts`

- [ ] **Step 1: Enhance `parsePdfFile` to Produce High-Resolution Page Canvas & Text**
  - Ensure `parsePdfFile` (or a dedicated `splitPdfIntoPageItems`) returns an array of `PageExtractionItem`:
    ```ts
    export interface PageExtractionItem {
      pageNumber: number;
      text: string;
      imageBase64: string; // JPEG data URL or pure base64
      hasImages: boolean;
    }
    ```
  - Optimize canvas rendering scale (1.5x or 2.0x) so small chemical structure labels and question text remain crystal clear for multimodal vision.

- [ ] **Step 2: Add Word & Image Multi-page Fallbacks**
  - For image files (e.g. Page1.png, Page2.png) or DOCX documents, structure them into sequential `PageExtractionItem` entries.

- [ ] **Step 3: Verification**
  - Verify that loading `9) Review for Anticoagulants.pdf` yields 7 distinct `PageExtractionItem` objects with valid text and base64 images.

---

### Task 3: Dual-Dropzone Importer UI & Progressive Page Extraction

**Files:**
- Modify: `src/components/MedChemReviewImporterModal.tsx:1-408`

- [ ] **Step 1: Add Dual Dropzones in `MedChemReviewImporterModal.tsx`**
  - Zone 1: **Course Review / Exam Worksheet (Required)**: Accepts PDF, Word, or images representing the questions blueprint.
  - Zone 2: **Lecture Deck / Authoritative Source Material (Optional Reference)**: Accepts lecture slides or monographs used to enrich explanations and verify answer keys.
  - Provide clear visual indicators, file chips, and size badges for each dropzone.

- [ ] **Step 2: Implement Progressive Page-by-Page Extraction Loop**
  - When user clicks "Start Extraction":
    - Set state `stage: 'extracting'`, `totalSteps: numPages + 1`.
    - Iterate through `pageItems` sequentially:
      - Update status: `"Extracting Page ${i} of ${numPages}: transcribing questions & structures..."`.
      - Post to `/api/gemini/medchem-review-page`.
      - Collect returned `ReviewPage` and append newly discovered structures to `previouslyExtractedStructures`.
    - Once all pages are complete, set status: `"Finalizing PubChem audit and assembling review module..."`.
    - Build `ReviewModule` object and transition to `stage: 'preview'`.

- [ ] **Step 3: Build Interactive Review Preview Screen**
  - Display module title, course, total pages, total questions, and question type breakdown (`N` sub-statements, `N` matching, `N` multiple-choice).
  - Page-by-page accordion allowing the user to inspect each page's sections, questions, and 2D chemical structure cards.
  - "Save & Open Review" button: saves module to Dexie database and triggers `onModuleImported(module)`.

---

### Task 4: End-to-End Verification with Anticoagulants Review Worksheet

**Files:**
- Test with: `C:\Users\Iaren\Downloads\p2 mcp ex 3\9) Review for Anticoagulants.pdf`
- Reference with: `C:\Users\Iaren\Downloads\p2 mcp ex 3\9) Antithrombotics (Anticoagulants).pdf`

- [ ] **Step 1: Execute End-to-End Test Extraction**
  - Run the extraction on `9) Review for Anticoagulants.pdf` paired with `9) Antithrombotics (Anticoagulants).pdf`.
  - Verify all 7 pages are extracted.
  - Verify Question 1 has all True/False propositions *a* through *k*.
  - Verify heparin pentasaccharide and warfarin questions are captured verbatim.
  - Verify all chemical structures (Argatroban, Dabigatran, Rivaroxaban, Apixaban, Heparin pentasaccharide, Warfarin) have valid PubChem CIDs, SMILES, and pharmacophore highlights.

- [ ] **Step 2: Verify Interactive Study Modes**
  - Test the generated Anticoagulant module in `ReviewExamMode.tsx` and `QuizModal.tsx`.
  - Confirm interactive answering, True/False toggles, drag-and-drop matching, and rationale popups work identically to the Antiplatelet gold standard.

- [ ] **Step 3: TypeScript Typecheck & Clean Build**
  - Run `npm run lint` (`tsc --noEmit`).
  - Verify zero TypeScript or lint errors.
