# Design: Clean Structure Chips and Matching Target Labels

## Intent and Why
In interactive matching questions, target drop zones were rendering raw internal database IDs (e.g., `target-chem-amiloride)`) as prefix text instead of clean worksheet bullets (`a)`, `b)`). Additionally, structure chips in the right-hand tray and target drop slots displayed full strings (such as `Structure III (Hydrochlorothiazide)`) in small badges anchored at the top right, causing text to overflow horizontally outside the card, wrap across the chemical drawing, and make the tray look overcrowded.

This change cleans up the target bullet formatting, isolates pure Roman numeral labels (e.g., `I`, `II`, `III`, `IV`, `V`) on structure chip badges across both Exam 1 and Exam 2 modules, and introduces high-value usability enhancements to the matching experience.

---

## Goals, Non-Goals, and Anti-Goals
- **Goals**:
  - Format matching target drop zone prefixes as clean alphabetical bullets (`a)`, `b)`, `c)`) when internal slug IDs are used.
  - Present target letters in a polished, uniform index badge (`bg-slate-100 dark:bg-slate-800 border`) rather than unstyled monospace text.
  - Format solution table key prefixes in `DocumentQuestionItem.tsx` cleanly using the same bullet logic.
  - Replace hardcoded fallback rationale (`"Direct correlation from Review for Antiplatelets PDF."`) in `DocumentQuestionItem.tsx` with a context-appropriate generic fallback.
  - Extract only the clean Roman numeral or short code (e.g. `I`, `II`, `III`, `IV`, `V`, `A`, `B`) for chip badges in both the unassigned chips tray and placed chip slots.
  - Fix the "Touch/Click Selection Active" banner in `StructureDragDropMatch.tsx` so it displays `Structure {romanLabel} active` instead of raw internal IDs or leaking drug names in Exam Mode.
  - Increase chip dimensions (e.g. `76px`–`80px`) and vertical breathing room (`gap-3`) in the tray, with high-contrast styling so chemical drawings are crisp, legible, and uncrowded.
  - Add a quick "Retry" button to the completion banner when all structures are matched.
  - Audit all matching questions across Exam 1 (Renal, Respiratory) and Exam 2 (Antiarrhythmics, etc.) to ensure no raw IDs or overflowing badges remain.
- **Non-Goals**:
  - Rewriting question logic, accepted structure IDs, scoring, or drag-and-drop state mechanics.
  - Modifying chemical structure SMILES, PubChem URLs, or pharmacology notes.
- **Anti-Goals**:
  - Breaking matching validation or auto-solve functions.
  - Hiding the drug name entirely (drug names remain accessible via native hover tooltips or study mode details).

---

## Constraints
- Must be backward-compatible with past quiz data (e.g. Antiplatelet where targets are `'a'`, `'b'` and structures are `'I'`, `'II'`) and newer review modules (where IDs are descriptive slugs).
- Must work seamlessly in both Study Mode and Exam Mode.
- All TypeScript types and unit/E2E test suites must pass without regression.

---

## Approaches Considered
1. **Approach A: Robust UI Formatting & Roman Numeral Extraction + UX Improvements (Selected)**:
   - Provide helper utilities `formatTargetBullet` and `extractRomanOrShortLabel` (in `documentLabel.ts`) that cleanly format bullets and extract Roman numerals from any label string.
   - Adjust tray container layout and card styling in `StructureDragDropMatch.tsx`.
   - Upgrade target bullet styling to polished pill badges and add completion banner retry.
   - *Why chosen*: Completely backward-compatible, zero risk of data mutation or key mismatches, automatically protects future lecture imports, and cleanly handles any label variation.
2. **Approach B: Data-Level Normalization + UI Safeguards**:
   - Mutate all target IDs and `document_label`s directly in `renalReviewModuleData.ts` and `respiratoryReviewModuleData.ts`, plus adding UI safeguards.
   - *Why not chosen*: Adds heavy data churn across multiple large files with potential risk to question scoring or test expectations without additional benefit over Approach A.

---

## How It Gets Built
1. **Helper Functions (`src/utils/documentLabel.ts`)**:
   - `extractRomanOrShortLabel(structure?: { id?: string; document_label?: string; name?: string } | null, fallbackIndex?: number): string`:
     - Checks if `document_label` or `id` has a Roman numeral (e.g. `Structure IV (Acetazolamide)` -> `IV`, `Structure III` -> `III`, `Drug B` -> `B`, `I` -> `I`).
     - Extracts Roman numerals `I` through `XXV`, or single letters `A`-`Z`, or short numbers.
     - Falls back to `fallbackIndex` (mapped to Roman numeral) or truncated string if no Roman numeral is present.
   - `formatTargetBullet(targetId: string | undefined, index: number): string`:
     - If `targetId` is already a short bullet (1-3 alphanumeric chars, no dashes/underscores), returns `${targetId}`.
     - Otherwise returns `${String.fromCharCode(97 + (index % 26))}`.
2. **Component Updates (`src/components/StructureDragDropMatch.tsx`)**:
   - In target drop rows:
     - Render target bullet as a clean badge:
       ```tsx
       <span className="w-6 h-6 shrink-0 rounded-md font-mono font-bold text-xs flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
         {formatTargetBullet(target.id, index)})
       </span>
       ```
   - In unassigned chips tray:
     - Replace `{structure.document_label || structure.id}` with `{extractRomanOrShortLabel(structure, index)}`.
     - Update card container to `w-[76px] h-[76px] sm:w-[80px] sm:h-[80px]` with `p-1.5` and `gap-3` spacing in the tray.
     - Constrain corner badge: `min-w-[20px] h-[20px] px-1 text-[11px] font-mono font-black rounded shadow-xs`.
     - Tooltip: `title={isLocked ? `Structure ${fullLabel} (Locked)` : `Structure ${fullLabel} (Drag or click to place)`}`.
   - In touch/click active banner:
     - Format selected chip text as `Structure ${extractRomanOrShortLabel(selectedStructure)} selected` instead of displaying raw internal IDs.
   - In placed chips in drop zones:
     - Replace `{str?.document_label || sId}` with `{extractRomanOrShortLabel(str || { id: sId }, chipIndex)}`.
   - In completion banner:
     - Add a "Retry / Reset" button next to "Matched" count.
3. **Component Updates (`src/components/DocumentQuestionItem.tsx`)**:
   - In matching solution table: render `{formatTargetBullet(target.id, index)})`.
   - Update fallback rationale string to `'Key SAR and pharmacophore correlation from course lecture review.'`.
4. **Audit of Exam 1 and Exam 2 Modules**:
   - Review and verify all matching questions in Exam 1 (`renalReviewModuleData.ts`, `respiratoryReviewModuleData.ts`) and Exam 2 (`antiarrhythmicModuleData.ts`, etc.).
   - Verify that all matching questions render clean `a)`, `b)` bullets and clean Roman numeral badges without overflow.
5. **Testing**:
   - Unit tests for `extractRomanOrShortLabel` and `formatTargetBullet`.
   - Test suite verification (`npx tsc --noEmit` and existing test suites).

