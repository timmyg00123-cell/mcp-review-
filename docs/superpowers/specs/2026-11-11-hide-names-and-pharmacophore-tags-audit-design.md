# Hide Names & Pharmacophore Tags Audit Design Document

**Date**: 2026-11-11  
**Status**: Approved for Planning  
**Author**: Antigravity  

---

## 1. Intent and Why

Medical and pharmacy students use this review platform to develop visual pattern recognition and clinical correlation skills for medicinal chemistry structures. The platform provides a "Hide Names" study mode to support active recall and blind self-testing.

However, two critical bugs compromise this experience:
1. **Hide Names Defect**: In `StructureComparator` and `HorizontalStructureVignette`, drug names remain completely exposed. While `ChemicalStructureCard` and `DocumentQuestionItem` implement name masking, `StructureComparator` accepts `hideDrugName` as a prop but never references it in its JSX—leaking drug names across card titles, dropdown options, and comparative narrative text. `HorizontalStructureVignette` similarly renders raw drug names.
2. **Missing Pharmacophore Highlights**: Pharmacophore tags are intended to illuminate corresponding chemical substructures on 2D RDKit canvases upon hover or click. An audit revealed that **547 out of 728** functional group tags across the platform (such as Furosemide's `"Furfurylamino substituent at C2"`) lack SMARTS patterns. Because `src/utils/smartsDictionary.ts` had only 58 hardcoded entries, unrecognized tags return an empty string and RDKit skips substructure matching entirely.
3. **Dark Mode Tag Contrast**: In dark mode, pharmacophore tags use faint borders and low-opacity fills (`${hex}18`) that wash out against dark surfaces (`dark:bg-slate-800`/`dark:bg-slate-900`), making tags difficult to read and interact with.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
- **Full-Spectrum Name Blinding**:
  - When "Hide Names" is active (or in exam mode), conceal all drug identities in `StructureComparator` (card titles, dropdown selector, comparison table column headers, and comparative narrative text) and `HorizontalStructureVignette`.
  - Replace drug names with canonical document labels (e.g., `structure.document_label || "Structure Roman"`) to maintain 1:1 alignment with question stems.
  - Blind selector buttons in `HorizontalStructureVignette` (e.g. `[A]` and `[B]` with blinded titles `Select Structure I as Compound A`) so users cannot see drug names before viewing structures.
  - Suppress/flatten `<optgroup>` class headers in the dropdown when names are hidden to avoid leaking pharmacological classes.
  - Provide an on-demand "Peek" toggle button (eye icon) on comparator cards in study mode so users can reveal individual drug names when desired.
- **Extensive IUPAC & Pharmacophore SMARTS Library**:
  - Expand `SMARTS_OVERRIDE_DICT` in `src/utils/smartsDictionary.ts` with ~50+ canonical IUPAC functional groups, linkers, heterocycles, and substituents.
  - Implement tokenized/subphrase matching in `getCorrectedSmarts` so descriptive tags (e.g., `"Furfurylamino substituent at C2"`, `"Terminal Primary Amide"`, `"2-Butylbenzofuran Core"`) automatically extract their core functional group token and resolve to valid SMARTS.
  - Achieve >80% coverage across all 728 functional group tags platform-wide (covering virtually 100% of small-molecule functional groups, with remaining unmapped entries consisting of large biologics/enzymatic domains like Alteplase Kringle-2 domains).
  - Specifically ensure Furosemide's `"Furfurylamino substituent at C2"` resolves to `NCc1ccco1` and highlights the furan-2-ylmethylamino moiety.
- **Dark Mode Contrast & Theme-Aware Badges**:
  - Update `PharmacophoreTagList.tsx` and `StructureComparator.tsx` to provide crisp, WCAG-compliant contrast in dark mode:
    - Inactive tags: Higher contrast border (`dark:border-slate-600`), solid dark badge fill (`dark:bg-slate-800/90`), legible light text (`dark:text-slate-200 hover:dark:text-white`).
    - Active tags: Luminous border (`borderColor: activeColor.hex`), distinct background tint, bright readable text, and glowing indicator dot.

### Non-Goals
- Modifying underlying RDKit WASM canvas rendering or SMILES generation.
- Changing question scoring, quiz evaluation, or question stem text.
- Altering Dexie DB schema.

### Anti-Goals
- Never mutate or overwrite underlying `ChemicalStructure.name` data; blinding is strictly a presentation-layer transform.
- Never cause layout shift when peeking or hovering tags.
- Never break existing SMARTS overrides (e.g., statin lactone rings, thienopyridines).

---

## 3. Constraints
- **Framework**: React 19, TypeScript, Tailwind CSS v4, Vite.
- **Chemistry Engine**: RDKit.js WASM (`@rdkit/rdkit`).
- **Performance**: SMARTS dictionary lookups must execute synchronously in `< 1ms` during canvas render cycles.
- **Backward Compatibility**: Existing card components (`ChemicalStructureCard`, `DocumentQuestionItem`, `StructureLightboxModal`) must remain unaffected or enhanced.

---

## 4. Approaches Considered

### Approach A: Comprehensive Architecture (Curated IUPAC SMARTS Library + Full-Spectrum Blinding with Peek + Theme-Aware Contrast) — *Selected*
- Implements centralized name masking for `StructureComparator` and `HorizontalStructureVignette`.
- Masks selector pills, headers, dropdowns, and comparison differentiator text with on-demand per-card peek toggles.
- Expands `smartsDictionary.ts` with 50+ verified IUPAC SMARTS and intelligent multi-word token extraction (boosting coverage from 25% to 83%+ across the codebase).
- Re-themes pharmacophore tags for high dark-mode contrast.
- **Trade-offs**: Touches comparator, vignette, dictionary, and tag components, but completely eliminates spoilers, cures 500+ unmapped tags across all modules, and guarantees accessibility.

### Approach B: Targeted Furosemide Patch (Comparator Header Only + Single SMARTS Addition) — *Rejected*
- Only masks the card header in `StructureComparator.tsx`.
- Only adds `furfurylamino` to `SMARTS_OVERRIDE_DICT`.
- **Trade-offs**: Leaves 546 other pharmacophore tags broken across cardiovascular and respiratory modules, leaks drug names in selector buttons and comparison text, and leaves dark mode tags low-contrast.

### Approach C: Dynamic Substructure Parser — *Rejected*
- Generates SMARTS dynamically via heuristic regex string conversion.
- **Trade-offs**: Fragile; dynamic regex heuristics frequently produce invalid SMARTS strings that cause RDKit WASM query errors and crashes.

---

## 5. Detailed Component & System Architecture

### 5.1 Centralized Name Masking Utility
In `src/utils/documentLabel.ts`:
```ts
export function getMaskedDrugName(
  realName: string,
  genericLabel: string, // e.g. structure.document_label || "Structure I"
  isMasked: boolean,
  isPeeked: boolean = false
): string {
  if (!isMasked || isPeeked) return realName;
  return genericLabel;
}

export function sanitizeNarrativeText(
  text: string,
  replacements: Array<{ realName: string; tradeName?: string; maskedLabel: string }>
): string {
  if (!text) return text;
  let result = text;
  for (const { realName, tradeName, maskedLabel } of replacements) {
    if (realName) {
      result = result.replace(new RegExp(`\\b${realName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'), maskedLabel);
    }
    if (tradeName && tradeName.toLowerCase() !== realName.toLowerCase()) {
      result = result.replace(new RegExp(`\\b${tradeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi'), '[Brand]');
    }
  }
  return result;
}
```

### 5.2 StructureComparator Updates (`src/components/StructureComparator.tsx`)
1. **Prop Utilization**: Wire `hideDrugName` (and `examModeActive`) through the component.
2. **Local Peek State**: Add `peekedCards: Record<'A' | 'B', boolean>` state to allow on-demand peeking when `hideDrugName` is true and `!examModeActive`.
3. **Card Header Masking**:
   - In `renderStructureCard`, display `getMaskedDrugName(structure.name, label, shouldMask, isPeeked)`.
   - Add peek toggle button (eye / eye-off icon) next to the card title when `shouldMask && !examModeActive`.
4. **Dropdown Masking & Optgroup Flattening**:
   - In dropdown selector `<option>` elements:
     - When `shouldMask`, display `structure.document_label || `Structure ${idx + 1}`` instead of raw drug names.
     - When `shouldMask`, flatten `<optgroup>` categories into a single un-grouped list to avoid leaking the drug's pharmacological/chemical class.
5. **Comparison Table & Narrative Text Sanitization**:
   - In comparison table headers: replace `{compoundA.name}` and `{compoundB.name}` with `displayNameA` and `displayNameB`.
   - In `resolveContrast()`, contrast cards, and differentiator summaries: run `sanitizeNarrativeText(text, [...])` so comparative text reads e.g. `"Unlike Structure II, Structure I exhibits..."` without leaking drug names.

### 5.3 HorizontalStructureVignette Updates (`src/App.tsx`)
1. **Pass Props**: Forward `hideDrugNames={hideDrugNames}` and `examModeActive={examStatus === 'active'}` to `HorizontalStructureVignette`.
2. **Mask Display**:
   - Card title: `shouldMask ? (drug.structure?.document_label || `Structure ${idx + 1}`) : drug.name`.
   - Selection buttons: `[A]` and `[B]` tooltip titles masked as `Select ${displayName} as Compound A`.

### 5.4 Comprehensive IUPAC SMARTS Dictionary (`src/utils/smartsDictionary.ts`)
1. **Expanded Dictionary (`SMARTS_OVERRIDE_DICT`)**:
   Add canonical SMARTS patterns across major med-chem classes:
   - **Furans & Furfuryls**:
     - `'furfurylamino'`: `'NCc1ccco1'`
     - `'furfuryl'`: `'Cc1ccco1'`
     - `'furan'`: `'c1ccco1'`
     - `'tetrahydrofuran'`: `'C1CCOC1'`
     - `'benzofuran'`: `'c1ccc2occc2c1'`
   - **Amines & Alkylamines**:
     - `'primaryamine'`: `'[NX3H2]'`
     - `'secondaryamine'`: `'[NX3H1]'`
     - `'tertiaryamine'`: `'[NX3H0]'`
     - `'diethylamino'`: `'N(CC)CC'`
     - `'propylamino'`: `'NCCC'`
     - `'isopropylamino'`: `'NC(C)C'`
     - `'ethanolamine'`: `'NCCO'`
     - `'quinuclidine'`: `'C1CN2CCC1CC2'`
     - `'amine'`: `'N'`
     - `'amino'`: `'N'`
   - **Carbonyls, Acids & Derivatives**:
     - `'amide'`: `'C(=O)N'`
     - `'ester'`: `'C(=O)O[#6]'`
     - `'carboxylic'`: `'C(=O)[OH]'`
     - `'lactone'`: `'C1(=O)OCCC1'`
     - `'lactam'`: `'C1(=O)NCCC1'`
     - `'carbamate'`: `'OC(=O)N'`
     - `'urea'`: `'NC(=O)N'`
     - `'ketone'`: `'[#6]C(=O)[#6]'`
   - **Sulfur & Phosphorus**:
     - `'sulfonamide'`: `'S(=O)(=O)N'`
     - `'sulfamoyl'`: `'S(=O)(=O)N'`
     - `'methanesulfonamido'`: `'NS(=O)(=O)C'`
     - `'sulfone'`: `'[#6]S(=O)(=O)[#6]'`
     - `'sulfoxide'`: `'[#6]S(=O)[#6]'`
     - `'thiourea'`: `'NC(=S)N'`
     - `'thiophene'`: `'c1sccc1'`
     - `'thiazole'`: `'c1scnc1'`
     - `'benzothiazepine'`: `'c1ccc2c(c1)SCNC=C2'`
   - **Heterocycles & Aromatics**:
     - `'pyridine'`: `'c1ccncc1'`
     - `'quinoline'`: `'c1ccc2ncccc2c1'`
     - `'isoquinoline'`: `'c1ccc2cnccc2c1'`
     - `'quinazoline'`: `'c1ccc2c(c1)ncnc2'`
     - `'piperazine'`: `'C1CNCCN1'`
     - `'morpholine'`: `'C1COCCN1'`
     - `'piperidine'`: `'C1CCNCC1'`
     - `'aryloxypropanolamine'`: `'c1ccccc1OCC(O)CN'`
     - `'naphthalene'`: `'c1ccc2ccccc2c1'`
     - `'benzene'`: `'c1ccccc1'`
     - `'phenyl'`: `'c1ccccc1'`
     - `'catechol'`: `'c1ccc(O)c(O)c1'`
     - `'phenol'`: `'c1ccccc1O'`
     - `'xylyl'`: `'c1c(C)cccc1C'`
     - `'methoxy'`: `'OC'`
     - `'hydroxy'`: `'O'`
     - `'alcohol'`: `'[OX2H]'`
   - **Halogens & Halogenated Substituents**:
     - `'chloro'`: `'Cl'`
     - `'fluoro'`: `'F'`
     - `'bromo'`: `'Br'`
     - `'iodo'` / `'diiodo'`: `'I'`
     - `'trifluoromethyl'`: `'C(F)(F)F'`
     - `'trifluoroethoxy'`: `'OCC(F)(F)F'`
   - **Nitriles, Nitro, Guanidines, Alkenes**:
     - `'nitrile'`: `'C#N'`
     - `'nitro'`: `'[N+](=O)[O-]'`
     - `'guanidino'` / `'guanidine'`: `'NC(=N)N'`
     - `'vinyl'`: `'C=C'`
     - `'oxazolidinone'`: `'O1CCNC1=O'`
     - `'morpholinone'`: `'O1CCNCC1=O'`

2. **Intelligent Multi-Word Token Extractor**:
   Update `getCorrectedSmarts(name: string, aiSmarts: string = ''): string`:
   ```ts
   export function getCorrectedSmarts(name: string = '', aiSmarts: string = ''): string {
     const clean = (name || '').toLowerCase().replace(/[\s\-_,()]/g, '');
     
     // 1. Exact or substring key match against dictionary
     for (const [key, smarts] of Object.entries(SMARTS_OVERRIDE_DICT)) {
       const cleanKey = key.replace(/[\s\-_]/g, '');
       if (clean.includes(cleanKey)) {
         return smarts;
       }
     }

     // 2. Tokenized word-level matching (split on punctuation, spaces, positions like 'C2', 'at C4')
     const tokens = (name || '')
       .toLowerCase()
       .replace(/[^a-z0-9]/g, ' ')
       .split(/\s+/)
       .filter((t) => t.length > 2 && !['substituent', 'group', 'ring', 'core', 'moiety', 'position'].includes(t));

     for (const token of tokens) {
       for (const [key, smarts] of Object.entries(SMARTS_OVERRIDE_DICT)) {
         const cleanKey = key.replace(/[\s\-_]/g, '');
         if (token.includes(cleanKey) || cleanKey.includes(token)) {
           return smarts;
         }
       }
     }

     return aiSmarts || '';
   }
   ```

### 5.5 Dark Mode Pharmacophore Tag Contrast
In `src/components/PharmacophoreTagList.tsx` and `src/components/StructureComparator.tsx`:
1. **Inactive State**:
   - Background: `bg-slate-100 dark:bg-slate-800/90`
   - Border: `border-slate-300 dark:border-slate-600`
   - Text: `text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white`
2. **Active / Pinned State**:
   - Background: Semi-opaque tinted background with dark mode boost (`bg-white dark:bg-slate-900`)
   - Border: Crisp solid border using `activeColor.hex`
   - Ring: `ring-2 ring-${activeColor.hex}/30`
   - Text: High contrast `text-slate-900 dark:text-slate-100 font-bold`
   - Indicator Pip: Vibrant pip with subtle glowing box-shadow (`box-shadow: 0 0 6px ${activeColor.hex}80`)

---

## 6. Verification Plan
1. **Automated Unit Tests**:
   - Run audit test verifying that `getCorrectedSmarts('Furfurylamino substituent at C2')` returns `'NCc1ccco1'`.
   - Verify overall functional group coverage improves from 25% (181/728) to >83% (602+/728).
   - Test `sanitizeNarrativeText` with sample differentiator and MOA strings.
2. **Build & Type Checking**:
   - Run `npm run lint` (`tsc --noEmit`) and `npm run build` to guarantee zero TypeScript or bundle regressions.
3. **Manual Browser & UI Verification**:
   - Toggle "Hide Names":
     - Verify Structure Comparator header, dropdown, and table headers show generic labels.
     - Verify peeking via eye icon reveals the drug name for that card only.
     - Verify HorizontalStructureVignette cards and `[A]`/`[B]` buttons show generic labels.
   - Test Furosemide in Renal Review module:
     - Verify clicking or hovering `"Furfurylamino substituent at C2"` highlights the furan-2-ylmethylamino substructure on the canvas.
   - Dark Mode Inspection:
     - Switch theme to dark mode and confirm pharmacophore tags have crisp borders and readable text in both inactive and active states.
