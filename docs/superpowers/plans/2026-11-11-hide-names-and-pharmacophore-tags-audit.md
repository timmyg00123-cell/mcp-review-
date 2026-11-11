# Hide Names & Pharmacophore Tags Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure the "Hide Names" feature completely conceals drug identities across the comparator and study widgets without leaking names, and expand the pharmacophore SMARTS dictionary to achieve >80% coverage platform-wide (specifically repairing Furosemide's furfurylamino tag) with WCAG-compliant dark mode contrast.

**Architecture:** 
1. Build a comprehensive ~110+ entry IUPAC functional group SMARTS dictionary with intelligent multi-word token extraction in `smartsDictionary.ts`.
2. Implement centralized name-masking and narrative-text sanitization helpers in `documentLabel.ts`.
3. Apply full-spectrum masking, optgroup category flattening, and on-demand peek toggles to `StructureComparator.tsx` and `HorizontalStructureVignette` in `App.tsx`.
4. Modernize pharmacophore tag badge styling in `PharmacophoreTagList.tsx` and `StructureComparator.tsx` with theme-aware luminous borders and legible dark-mode contrast.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, RDKit.js WASM (`@rdkit/rdkit`), Node.js / tsx.

**Spec:** [`docs/superpowers/specs/2026-11-11-hide-names-and-pharmacophore-tags-audit-design.md`](file:///c:/Users/Iaren/Downloads/mcp-review-app%20-%20Copy%20(2)/docs/superpowers/specs/2026-11-11-hide-names-and-pharmacophore-tags-audit-design.md)

## Global Constraints
- `SMARTS_OVERRIDE_DICT` must preserve all existing overrides (statins, antiplatelets, antihypertensives).
- Dictionary lookups must remain synchronous and execute in `< 1ms` during RDKit canvas render cycles.
- Blinding must be strictly a presentation-layer transform; underlying `ChemicalStructure` records must never be mutated.
- Zero layout shift when toggling peek or hovering tags.
- All code must pass `npm run lint` (`tsc --noEmit`) and `npm run build`.

## Review Focus
1. **Multi-word / descriptive pharmacophore tag matching**: Tags like `"Furfurylamino substituent at C2"` must resolve to `'NCc1ccco1'` and ignore noise tokens like `"substituent"` or `"at C2"`.
2. **Brand / trade name leakage in narrative text**: Comparative sentences mentioning brand names (e.g. `"Lasix"`, `"Plavix"`) must be redacted along with generic names.
3. **Dropdown optgroup category leakage**: Group headers like `Loop Diuretics` must be suppressed when names are hidden to avoid revealing drug classification.
4. **State isolation for card peeking**: Peeking Compound A in `StructureComparator` must not peek Compound B.
5. **Dark mode contrast**: Active and inactive pharmacophore tags must maintain high text and border contrast against `dark:bg-slate-900` and `dark:bg-slate-800`.

---

### Task 1: IUPAC SMARTS Dictionary Expansion & Token Extractor

**Files:**
- Modify: `src/utils/smartsDictionary.ts`
- Test: `tests/smartsDictionary.test.ts`

**Interfaces:**
- Consumes: Existing `SMARTS_OVERRIDE_DICT` in `src/utils/smartsDictionary.ts`
- Produces: Expanded `SMARTS_OVERRIDE_DICT` and enhanced `getCorrectedSmarts(name: string, aiSmarts?: string): string`

- [ ] **Step 1: Write the failing unit tests for dictionary and token extractor**

Create `tests/smartsDictionary.test.ts`:
```ts
import assert from 'node:assert';
import { getCorrectedSmarts, SMARTS_OVERRIDE_DICT } from '../src/utils/smartsDictionary.js';

// 1. Furfurylamino on Furosemide
const furosemideTag = 'Furfurylamino substituent at C2';
const furosemideSmarts = getCorrectedSmarts(furosemideTag, '');
assert.strictEqual(furosemideSmarts, 'NCc1ccco1', 'Furfurylamino substituent at C2 must resolve to NCc1ccco1');

// 2. Furan & Benzofuran
assert.strictEqual(getCorrectedSmarts('Furan ring', ''), 'c1ccco1');
assert.strictEqual(getCorrectedSmarts('2-Butylbenzofuran Core', ''), 'c1ccc2occc2c1');

// 3. Amines & Heterocycles
assert.strictEqual(getCorrectedSmarts('Secondary Propylamino Group', ''), 'NCCC');
assert.strictEqual(getCorrectedSmarts('Tertiary Diethylamino Group', ''), 'N(CC)CC');
assert.strictEqual(getCorrectedSmarts('Pyridine ring', ''), 'c1ccncc1');
assert.strictEqual(getCorrectedSmarts('Piperazine ring', ''), 'C1CNCCN1');

// 4. Existing overrides must remain intact
assert.strictEqual(getCorrectedSmarts('hexahydronaphthalene', ''), '[#6]1~[#6]~[#6]~[#6]2~[#6]~[#6]~[#6]~[#6]~[#6]2~[#6]1');
assert.strictEqual(getCorrectedSmarts('sulfonamide', ''), 'S(=O)(=O)N');

console.log('✓ All SMARTS dictionary tests passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/smartsDictionary.test.ts`  
Expected: FAIL with assertion error for `Furfurylamino substituent at C2`.

- [ ] **Step 3: Implement expanded dictionary and tokenized extractor in `src/utils/smartsDictionary.ts`**

Add the ~50 curated IUPAC groups from Section 5.4 of the design doc to `SMARTS_OVERRIDE_DICT`.
Implement two-tier matching in `getCorrectedSmarts`:
1. Substring/exact key match over cleaned name.
2. Tokenized word-level matching filtering out noise words (`'substituent'`, `'group'`, `'ring'`, `'core'`, `'moiety'`, `'position'`, `'at'`, `'c1'`, `'c2'`, `'c3'`, `'c4'`, `'c5'`, `'c6'`, `'c7'`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/smartsDictionary.test.ts`  
Expected: PASS with `✓ All SMARTS dictionary tests passed`.

- [ ] **Step 5: Run audit script to verify platform-wide coverage >= 80%**

Run: `npx tsx scratch/audit_pharmacophores.ts`  
Expected: Matched >= 600 / 728 (>= 82%).

- [ ] **Step 6: Commit**

```bash
git add src/utils/smartsDictionary.ts tests/smartsDictionary.test.ts
git commit -m "feat: expand IUPAC SMARTS dictionary and add tokenized extractor"
```

---

### Task 2: Centralized Name Masking & Narrative Text Sanitization Utilities

**Files:**
- Modify: `src/utils/documentLabel.ts`
- Test: `tests/nameMasking.test.ts`

**Interfaces:**
- Consumes: `ChemicalStructure`
- Produces:
  - `getMaskedDrugName(realName: string, genericLabel: string, isMasked: boolean, isPeeked?: boolean): string`
  - `sanitizeNarrativeText(text: string, replacements: Array<{ realName: string; tradeName?: string; maskedLabel: string }>): string`

- [ ] **Step 1: Write the failing unit tests for name masking and text sanitization**

Create `tests/nameMasking.test.ts`:
```ts
import assert from 'node:assert';
import { getMaskedDrugName, sanitizeNarrativeText } from '../src/utils/documentLabel.js';

// 1. Name masking tests
assert.strictEqual(getMaskedDrugName('Furosemide', 'Structure II', false, false), 'Furosemide');
assert.strictEqual(getMaskedDrugName('Furosemide', 'Structure II', true, false), 'Structure II');
assert.strictEqual(getMaskedDrugName('Furosemide', 'Structure II', true, true), 'Furosemide');

// 2. Narrative text sanitization tests
const rawSentence = 'Unlike Hydrochlorothiazide (Microzide), Furosemide (Lasix) exhibits high ceiling diuresis at NKCC2.';
const sanitized = sanitizeNarrativeText(rawSentence, [
  { realName: 'Furosemide', tradeName: 'Lasix', maskedLabel: 'Structure I' },
  { realName: 'Hydrochlorothiazide', tradeName: 'Microzide', maskedLabel: 'Structure II' },
]);

assert.ok(!sanitized.includes('Furosemide'), 'Furosemide must be redacted');
assert.ok(!sanitized.includes('Lasix'), 'Lasix must be redacted');
assert.ok(!sanitized.includes('Hydrochlorothiazide'), 'Hydrochlorothiazide must be redacted');
assert.ok(!sanitized.includes('Microzide'), 'Microzide must be redacted');
assert.strictEqual(sanitized, 'Unlike Structure II ([Brand]), Structure I ([Brand]) exhibits high ceiling diuresis at NKCC2.');

console.log('✓ All name masking and narrative sanitization tests passed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx tests/nameMasking.test.ts`  
Expected: FAIL with `getMaskedDrugName is not a function`.

- [ ] **Step 3: Implement `getMaskedDrugName` and `sanitizeNarrativeText` in `src/utils/documentLabel.ts`**

Implement both functions as specified in Section 5.1 of the design doc with robust regex escaping and word boundaries.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx tests/nameMasking.test.ts`  
Expected: PASS with `✓ All name masking and narrative sanitization tests passed`.

- [ ] **Step 5: Commit**

```bash
git add src/utils/documentLabel.ts tests/nameMasking.test.ts
git commit -m "feat: add getMaskedDrugName and sanitizeNarrativeText helpers"
```

---

### Task 3: Full-Spectrum Hide Names & Peeking in `StructureComparator`

**Files:**
- Modify: `src/components/StructureComparator.tsx`
- Test: `tests/structureComparator.test.ts`

**Interfaces:**
- Consumes: `getMaskedDrugName`, `sanitizeNarrativeText` from `src/utils/documentLabel.ts`
- Produces: Updated `StructureComparator` component that respects `hideDrugName` and `examModeActive`

- [ ] **Step 1: Write verification test for `StructureComparator` masking logic**

Create `tests/structureComparator.test.ts`:
```ts
import assert from 'node:assert';
import { sanitizeNarrativeText, getMaskedDrugName } from '../src/utils/documentLabel.js';

// Verify contrast sentence redaction with comparator structure data
const mockDrugA = { name: 'Furosemide', tradeName: 'Lasix', document_label: 'Structure II' };
const mockDrugB = { name: 'Hydrochlorothiazide', tradeName: 'Microzide', document_label: 'Structure III' };

const labelA = mockDrugA.document_label || 'Compound A';
const labelB = mockDrugB.document_label || 'Compound B';

const rawContrast = `Unlike Hydrochlorothiazide, Furosemide acts on NKCC2 in the loop of Henle.`;
const maskedContrast = sanitizeNarrativeText(rawContrast, [
  { realName: mockDrugA.name, tradeName: mockDrugA.tradeName, maskedLabel: labelA },
  { realName: mockDrugB.name, tradeName: mockDrugB.tradeName, maskedLabel: labelB },
]);

assert.strictEqual(maskedContrast, `Unlike Structure III, Structure II acts on NKCC2 in the loop of Henle.`);
console.log('✓ Comparator masking integration logic verified');
```

- [ ] **Step 2: Run verification test**

Run: `npx tsx tests/structureComparator.test.ts`  
Expected: PASS.

- [ ] **Step 3: Update `StructureComparator.tsx`**

1. Add state: `const [peekedCards, setPeekedCards] = useState<Record<'A' | 'B', boolean>>({ A: false, B: false });`.
   Reset `peekedCards` when selected drugs change.
2. In `renderStructureCard`:
   - Compute `const shouldMask = (hideDrugName || examModeActive);`.
   - Compute `const isPeeked = Boolean(peekedCards[cardKey]);`.
   - Display `displayName = getMaskedDrugName(structure.name, label, shouldMask, isPeeked)`.
   - Render peek button (Eye/EyeOff icon) next to title when `shouldMask && !examModeActive`:
     ```tsx
     {shouldMask && !examModeActive && (
       <button
         type="button"
         onClick={(e) => {
           e.stopPropagation();
           setPeekedCards((prev) => ({ ...prev, [cardKey]: !prev[cardKey] }));
         }}
         className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
         title={isPeeked ? "Hide name" : "Peek name"}
       >
         {isPeeked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
       </button>
     )}
     ```
3. In card header `<select>` dropdown:
   - When `shouldMask`:
     - Flatten `<optgroup>`s into a single direct list of `<option>`s.
     - Render `s.document_label || ('Structure ' + romanize(idx + 1))` as option text.
4. In comparison table headers:
   - Replace `{compoundA.name}` and `{compoundB.name}` with `displayNameA` and `displayNameB`.
5. In `resolveContrast()`, contrast cards, and differentiator summaries:
   - Run `sanitizeNarrativeText` over narrative descriptions using `compoundA` and `compoundB`.

- [ ] **Step 4: Verify TypeScript compilation**

Run: `npx tsc --noEmit`  
Expected: PASS with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/StructureComparator.tsx tests/structureComparator.test.ts
git commit -m "feat: implement full-spectrum hide names and per-card peeking in StructureComparator"
```

---

### Task 4: Hide Names & Button Blinding in `HorizontalStructureVignette`

**Files:**
- Modify: `src/App.tsx` (lines 160-335 and 1536-1554)

**Interfaces:**
- Consumes: `hideDrugNames`, `examStatus` from `App.tsx`
- Produces: Masked `HorizontalStructureVignette` cards and selector buttons

- [ ] **Step 1: Update `HorizontalStructureVignetteProps` in `src/App.tsx`**

Add optional props:
```ts
interface HorizontalStructureVignetteProps {
  // ... existing props
  hideDrugNames?: boolean;
  examModeActive?: boolean;
}
```

- [ ] **Step 2: Update `HorizontalStructureVignette` rendering logic**

1. Calculate `const shouldMask = Boolean(hideDrugNames || examModeActive);`.
2. For each drug:
   - Compute `displayName = shouldMask ? (drug.structure?.document_label || ('Structure ' + (idx + 1))) : drug.name;`.
   - Update card header label: display `displayName` and masked title.
   - Update `[A]` and `[B]` selector buttons: title set to `Select ${displayName} as Compound A` (or `B`).

- [ ] **Step 3: Forward props to `<HorizontalStructureVignette />` in `src/App.tsx`**

At line 1536:
```tsx
<HorizontalStructureVignette
  questions={visibleQuestions}
  blockStructures={blockStructures}
  hydratedDrugs={hydratedDrugs}
  hideDrugNames={hideDrugNames}
  examModeActive={examStatus === 'active'}
  selectedDrugAKey={currentComp.drugAKey}
  selectedDrugBKey={currentComp.drugBKey}
  // ... callbacks
/>
```

- [ ] **Step 4: Verify TypeScript compilation**

Run: `npx tsc --noEmit`  
Expected: PASS with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add hide drug names masking to HorizontalStructureVignette"
```

---

### Task 5: High-Contrast Theme-Aware Pharmacophore Tags

**Files:**
- Modify: `src/components/PharmacophoreTagList.tsx`
- Modify: `src/components/StructureComparator.tsx`

**Interfaces:**
- Consumes: `PHARMACOPHORE_COLOR_PALETTE`, `PharmacophoreGroup`
- Produces: Accessible WCAG-compliant tag badges in light and dark mode

- [ ] **Step 1: Update `PharmacophoreTagList.tsx` tag button styling**

1. Inactive badge:
   - `bg-slate-100 dark:bg-slate-800/90`
   - `border-slate-300 dark:border-slate-600`
   - `text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white`
2. Active/Pinned badge:
   - Background: `bg-white dark:bg-slate-900`
   - Border: `borderColor: activeColor.hex`
   - Box-shadow: `0 0 0 1px ${activeColor.hex}, 0 0 8px ${activeColor.hex}40`
   - Text: `text-slate-900 dark:text-slate-100 font-bold`
   - Indicator pip: glowing shadow `box-shadow: 0 0 6px ${activeColor.hex}80`

- [ ] **Step 2: Update `StructureComparator.tsx` tag button styling**

Apply identical high-contrast theme-aware styling to lines 1640-1700 of `src/components/StructureComparator.tsx`.

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`  
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/PharmacophoreTagList.tsx src/components/StructureComparator.tsx
git commit -m "feat: enhance dark mode contrast and luminous styling for pharmacophore tags"
```

---

### Task 6: Platform-Wide Regression & End-to-End Build Verification

**Files:**
- Run: All test suites and build scripts

- [ ] **Step 1: Run all unit test suites**

Run:
```bash
npx tsx tests/smartsDictionary.test.ts
npx tsx tests/nameMasking.test.ts
npx tsx tests/structureComparator.test.ts
```
Expected: All tests PASS.

- [ ] **Step 2: Run full project lint & build**

Run: `npm run lint`  
Expected: 0 errors.

Run: `npm run build`  
Expected: Vite build succeeds with complete bundle generation in `dist/`.

- [ ] **Step 3: Clean up scratch files and commit final verification**

```bash
rm -f scratch/audit_pharmacophores.ts
git add -A
git commit -m "chore: complete hide names and pharmacophore tag audit"
```
