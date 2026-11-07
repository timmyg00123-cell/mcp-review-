# Clean Structure Chips and Matching Target Labels Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up the matching question UI by removing raw database slugs like `target-chem-amiloride)` from target drop zones, isolating clean Roman numerals on structure chip badges without overflow or overcrowding, and verifying all matching questions across Exam 1 and Exam 2.

**Architecture:** Add two central formatting utilities in `src/utils/documentLabel.ts` (`extractRomanOrShortLabel` and `formatTargetBullet`) and consume them in `StructureDragDropMatch.tsx` and `DocumentQuestionItem.tsx`. Enhance the chips tray with ample breathing room, larger card sizes, styled target index badges, and a completion retry action.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Vite, Node tsx test harness.

**Spec:** `docs/superpowers/specs/2026-11-07-clean-structure-chips-and-matching-labels-design.md`

## Global Constraints
- Must be backward-compatible with past quiz data (e.g. Antiplatelet where targets are `'a'`, `'b'` and structures are `'I'`, `'II'`) and newer review modules (where IDs are descriptive slugs).
- Must work seamlessly in both Study Mode and Exam Mode.
- All TypeScript types, builds (`npm run build`), and test suites must pass cleanly.

## Review Focus
1. Target ID with complex slug (e.g., `target-chem-amiloride`, `target_anoro`, `target-acidbase-base`) must format to a clean lowercase letter bullet (`a`, `b`, etc.) without raw slug fragments.
2. Structure label with full drug name (e.g., `Structure IV (Acetazolamide)`, `Structure III (Hydrochlorothiazide)`) must isolate strictly the Roman numeral (`IV`, `III`) for the chip badge.
3. Fallback when structure has no Roman numeral (e.g., `Mannitol`, `Drug B`) must isolate a clean short label (`B`) or use fallback index.
4. Placed chips inside drop zones must render the clean Roman numeral without overflowing the drop slot.
5. In Exam Mode or Study Mode, the selected chip banner must not leak drug names or display internal slugs (e.g. displaying `Structure IV selected` instead of `Chip acetazolamide active`).

---

### Task 1: Helpers for Target Bullets and Roman Numeral Extraction

**Files:**
- Modify: `src/utils/documentLabel.ts`
- Create: `tests/documentLabelFormatting.test.ts`

**Interfaces:**
- Produces:
  - `extractRomanOrShortLabel(structure?: { id?: string; document_label?: string; name?: string } | null, fallbackIndex?: number): string`
  - `formatTargetBullet(targetId: string | undefined, index: number): string`

- [ ] **Step 1: Write the failing unit tests**

Create `tests/documentLabelFormatting.test.ts` with assertions for:
- `extractRomanOrShortLabel`:
  - `'Structure IV (Acetazolamide)'` -> `'IV'`
  - `'Structure III (Hydrochlorothiazide)'` -> `'III'`
  - `'Structure I (Amiloride)'` -> `'I'`
  - `'Structure II'` -> `'II'`
  - `'Drug B (Hydrocortisone)'` -> `'B'`
  - `'I'` -> `'I'`
  - `null` with `fallbackIndex: 2` -> `'III'`
- `formatTargetBullet`:
  - `'target-chem-amiloride'` at index `0` -> `'a'`
  - `'target-chem-furosemide'` at index `1` -> `'b'`
  - `'target_anoro'` at index `2` -> `'c'`
  - `'a'` at index `0` -> `'a'`
  - `'b'` at index `1` -> `'b'`
  - `undefined` at index `3` -> `'d'`

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/documentLabelFormatting.test.ts`
Expected: FAIL (functions not exported/defined)

- [ ] **Step 3: Implement `extractRomanOrShortLabel` and `formatTargetBullet` in `src/utils/documentLabel.ts`**

Implement:
```ts
export function extractRomanOrShortLabel(
  structure?: { id?: string; document_label?: string; name?: string } | null,
  fallbackIndex?: number
): string {
  const fallback = fallbackIndex !== undefined ? (ROMAN_NUMERALS_LIST[fallbackIndex] || String(fallbackIndex + 1)) : '';
  if (!structure) return fallback;

  const raw = (structure.document_label || structure.id || '').trim();
  if (!raw) return fallback;

  // 1. Direct Roman numeral match (I through XXV)
  const romanMatch = raw.match(/\b(X{0,2}(?:IX|IV|V?I{0,3}))\b/i);
  if (romanMatch && romanMatch[1] && romanMatch[1].toUpperCase() !== '') {
    const candidate = romanMatch[1].toUpperCase();
    if (ROMAN_MAP[candidate] !== undefined) {
      return candidate;
    }
  }

  // 2. "Drug A", "Drug B", etc.
  const drugLetterMatch = raw.match(/\b(?:Drug|Compound|Structure)\s+([A-Z0-9]{1,2})\b/i);
  if (drugLetterMatch && drugLetterMatch[1]) {
    return drugLetterMatch[1].toUpperCase();
  }

  // 3. Short raw string (1-3 chars)
  if (raw.length <= 3) {
    return raw.toUpperCase();
  }

  return fallback || raw.slice(0, 3).toUpperCase();
}

export function formatTargetBullet(targetId: string | undefined, index: number): string {
  if (targetId && /^[a-z0-9]{1,2}$/i.test(targetId.trim())) {
    return targetId.trim().toLowerCase();
  }
  return String.fromCharCode(97 + (index % 26));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/documentLabelFormatting.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/utils/documentLabel.ts tests/documentLabelFormatting.test.ts
git commit -m "feat: add extractRomanOrShortLabel and formatTargetBullet utilities"
```

---

### Task 2: Polish `StructureDragDropMatch.tsx` Chips, Badges, and Targets

**Files:**
- Modify: `src/components/StructureDragDropMatch.tsx`
- Consumes: `extractRomanOrShortLabel`, `formatTargetBullet` from `src/utils/documentLabel.ts`

- [ ] **Step 1: Update drop zone target bullets**

In `src/components/StructureDragDropMatch.tsx`:
Replace the raw monospace `{target.id})` span with a styled index badge:
```tsx
<span className="w-6 h-6 shrink-0 rounded-md font-mono font-bold text-xs flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
  {formatTargetBullet(target.id, index)})
</span>
```

- [ ] **Step 2: Update unassigned structure chips in right tray**

In the right tray map function:
- Compute Roman numeral: `const romanLabel = extractRomanOrShortLabel(structure, index);`
- Compute full hover label: `const fullLabel = structure.name ? `Structure ${romanLabel} (${structure.name})` : `Structure ${romanLabel}`;`
- Update card size and styling:
  - Width and height: `w-[76px] h-[76px] sm:w-[80px] sm:h-[80px]`
  - Corner badge: `min-w-[20px] h-[20px] px-1 text-[11px] font-mono font-black` rendering `{romanLabel}`
  - Image scaling: `className="w-full h-full aspect-square object-contain pointer-events-none filter drop-shadow-xs"`
  - Tooltip: `title={isLocked ? `${fullLabel} (Locked)` : `${fullLabel} (Drag or click to place)`}`

- [ ] **Step 3: Update placed chips in target drop slots**

In `placedHere.map((sId, chipIndex))`:
- Compute: `const romanLabel = extractRomanOrShortLabel(str || { id: sId }, chipIndex);`
- Render `{romanLabel}` inside the top-right badge.

- [ ] **Step 4: Update touch selection banner and completion banner**

- Active selection banner:
  - If a chip is selected, find its structure and display:
    `<span>Structure <strong>{extractRomanOrShortLabel(selectedStructure)}</strong> selected</span>`
- Completion banner:
  - Add a "Retry" button:
    ```tsx
    <button
      type="button"
      onClick={handleReset}
      className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:underline px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900/60 transition-colors"
    >
      Retry
    </button>
    ```

- [ ] **Step 5: Verify with type check and visual verification**

Run: `npx tsc --noEmit`
Expected: PASS (0 errors)

- [ ] **Step 6: Commit**

```bash
git add src/components/StructureDragDropMatch.tsx
git commit -m "fix(ui): polish structure chips tray, badges, and target bullets in StructureDragDropMatch"
```

---

### Task 3: Update Solution Key Table in `DocumentQuestionItem.tsx`

**Files:**
- Modify: `src/components/DocumentQuestionItem.tsx`
- Consumes: `formatTargetBullet` from `src/utils/documentLabel.ts`

- [ ] **Step 1: Update target prefix in solution key table**

In `src/components/DocumentQuestionItem.tsx` around line 1270:
Replace:
```tsx
<td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
  {target.id})
</td>
```
With:
```tsx
<td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
  {formatTargetBullet(target.id, index)})
</td>
```

- [ ] **Step 2: Update generic fallback rationale**

Replace hardcoded `"Direct correlation from Review for Antiplatelets PDF."` with:
`"Key SAR and pharmacophore correlation from course lecture review."`

- [ ] **Step 3: Run type check**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/DocumentQuestionItem.tsx
git commit -m "fix(ui): format target bullets and update fallback rationale in DocumentQuestionItem"
```

---

### Task 4: Audit & Integration Tests for Exam 1 & Exam 2 Matching Questions

**Files:**
- Create: `tests/matchingAuditExam1And2.test.ts`
- Consumes: `renalReviewModuleData.ts`, `respiratoryReviewModuleData.ts`, `antiarrhythmicModuleData.ts`, `antiplateletQuizData.ts`

- [ ] **Step 1: Write matching questions audit test**

In `tests/matchingAuditExam1And2.test.ts`:
- Check all matching questions across Exam 1 and Exam 2.
- Assert every matching target produces a valid single-letter bullet `^[a-z]\)$` when formatted.
- Assert no formatted bullet contains `target-` or `target_`.
- Assert every structure in `structuresDisplayed` produces a clean Roman numeral or 1-2 character label (`I`, `II`, `III`, `IV`, `V`, `VI`, `VII`, `A`, `B`, etc.) via `extractRomanOrShortLabel`.

- [ ] **Step 2: Run audit test**

Run: `npx tsx tests/matchingAuditExam1And2.test.ts`
Expected: PASS (auditing all matching questions across modules)

- [ ] **Step 3: Commit**

```bash
git add tests/matchingAuditExam1And2.test.ts
git commit -m "test: add matching questions audit suite for Exam 1 and Exam 2"
```

---

### Task 5: End-to-End Verification & Build Verification

**Files:** None (verification only)

- [ ] **Step 1: Run TypeScript compiler**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: build succeeds without warnings or errors

- [ ] **Step 3: Run all test suites**

Run: `npx tsx tests/documentLabelFormatting.test.ts`
Run: `npx tsx tests/matchingAuditExam1And2.test.ts`
Run: `npx tsx tests/e2eExam1InteractiveReviews.test.ts`
Expected: All pass

- [ ] **Step 4: Final commit (if needed) & completion summary**
