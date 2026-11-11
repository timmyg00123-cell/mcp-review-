import assert from 'node:assert';
import fs from 'node:fs';
import { sanitizeNarrativeText, getMaskedDrugName, sortStructuresByDocumentLabel } from '../src/utils/documentLabel.js';

// 1. Verify contrast sentence redaction with comparator structure data
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

// 2. Per-card peeking isolation tests
const shouldMask = true;
let peekedCards: Record<'A' | 'B', boolean> = { A: false, B: false };

// Both masked
let isPeekedA = Boolean(peekedCards.A);
let isPeekedB = Boolean(peekedCards.B);
let displayA = getMaskedDrugName(mockDrugA.name, labelA, shouldMask, isPeekedA);
let displayB = getMaskedDrugName(mockDrugB.name, labelB, shouldMask, isPeekedB);
assert.strictEqual(displayA, 'Structure II');
assert.strictEqual(displayB, 'Structure III');

// Peek Card A only
peekedCards = { A: true, B: false };
isPeekedA = Boolean(peekedCards.A);
isPeekedB = Boolean(peekedCards.B);
displayA = getMaskedDrugName(mockDrugA.name, labelA, shouldMask, isPeekedA);
displayB = getMaskedDrugName(mockDrugB.name, labelB, shouldMask, isPeekedB);
assert.strictEqual(displayA, 'Furosemide', 'Card A should reveal real name when peeked');
assert.strictEqual(displayB, 'Structure III', 'Card B must remain masked when Card A is peeked');

const peekAContrast = sanitizeNarrativeText(rawContrast, [
  { realName: mockDrugA.name, tradeName: mockDrugA.tradeName, maskedLabel: displayA },
  { realName: mockDrugB.name, tradeName: mockDrugB.tradeName, maskedLabel: displayB },
]);
assert.strictEqual(peekAContrast, 'Unlike Structure III, Furosemide acts on NKCC2 in the loop of Henle.');
console.log('✓ Per-card peek isolation verified');

// Peek Card B only
peekedCards = { A: false, B: true };
isPeekedA = Boolean(peekedCards.A);
isPeekedB = Boolean(peekedCards.B);
displayA = getMaskedDrugName(mockDrugA.name, labelA, shouldMask, isPeekedA);
displayB = getMaskedDrugName(mockDrugB.name, labelB, shouldMask, isPeekedB);
assert.strictEqual(displayA, 'Structure II', 'Card A must remain masked when Card B is peeked');
assert.strictEqual(displayB, 'Hydrochlorothiazide', 'Card B should reveal real name when peeked');

const peekBContrast = sanitizeNarrativeText(rawContrast, [
  { realName: mockDrugA.name, tradeName: mockDrugA.tradeName, maskedLabel: displayA },
  { realName: mockDrugB.name, tradeName: mockDrugB.tradeName, maskedLabel: displayB },
]);
assert.strictEqual(peekBContrast, 'Unlike Hydrochlorothiazide, Structure II acts on NKCC2 in the loop of Henle.');
console.log('✓ Opposite card peek isolation verified');

// 3. Exam Mode Gating: Peeking is strictly disabled when examModeActive is true
const examModeActive = true;
peekedCards = { A: true, B: true }; // User or state had peeked
isPeekedA = !examModeActive && Boolean(peekedCards.A);
isPeekedB = !examModeActive && Boolean(peekedCards.B);
displayA = getMaskedDrugName(mockDrugA.name, labelA, shouldMask || examModeActive, isPeekedA);
displayB = getMaskedDrugName(mockDrugB.name, labelB, shouldMask || examModeActive, isPeekedB);
assert.strictEqual(displayA, 'Structure II', 'Exam mode must prevent peeking on Card A');
assert.strictEqual(displayB, 'Structure III', 'Exam mode must prevent peeking on Card B');
console.log('✓ Exam mode peek gating verified');

// 4. Dropdown option masking and label fallback
const mockStructures = [
  { name: 'Furosemide', document_label: 'Structure II' },
  { name: 'Bumetanide', document_label: undefined },
  { name: 'Torsemide', document_label: 'Structure IV' },
];

const sorted = sortStructuresByDocumentLabel(mockStructures);
const maskedOptions = sorted.map((s, idx) => ({
  value: s.name,
  label: s.document_label || `Structure ${idx + 1}`,
}));

assert.strictEqual(maskedOptions.find((o) => o.value === 'Furosemide')?.label, 'Structure II');
assert.strictEqual(maskedOptions.find((o) => o.value === 'Bumetanide')?.label, 'Structure 3');
assert.strictEqual(maskedOptions.find((o) => o.value === 'Torsemide')?.label, 'Structure IV');
assert.ok(maskedOptions.every((o) => !o.label.includes('Furosemide') && !o.label.includes('Bumetanide')));
console.log('✓ Dropdown option masking logic verified');

// 5. Brand name redaction in contrast descriptions
const rawWithBrand = `Unlike Microzide, Lasix has a much shorter half-life.`;
const maskedWithBrand = sanitizeNarrativeText(rawWithBrand, [
  { realName: mockDrugA.name, tradeName: mockDrugA.tradeName, maskedLabel: labelA },
  { realName: mockDrugB.name, tradeName: mockDrugB.tradeName, maskedLabel: labelB },
]);
assert.strictEqual(maskedWithBrand, `Unlike [Brand], [Brand] has a much shorter half-life.`);
console.log('✓ Brand name sanitization verified');

// 6. Source-level AST and structure verification for StructureComparator.tsx
const comparatorSource = fs.readFileSync('src/components/StructureComparator.tsx', 'utf8');

// Verify imports
assert(comparatorSource.includes("getMaskedDrugName"), 'Must import getMaskedDrugName');
assert(comparatorSource.includes("sanitizeNarrativeText"), 'Must import sanitizeNarrativeText');
assert(comparatorSource.includes("Eye") && comparatorSource.includes("EyeOff"), 'Must import Eye and EyeOff from lucide-react');

// Verify state initialization
assert(
  comparatorSource.includes("const [peekedCards, setPeekedCards] = useState<Record<'A' | 'B', boolean>>({ A: false, B: false })"),
  'Must initialize peekedCards state to { A: false, B: false }'
);

// Verify shouldMask logic
assert(
  comparatorSource.includes("const shouldMask = hideDrugName || examModeActive;"),
  'Must compute shouldMask from hideDrugName and examModeActive'
);

// Verify peek button rendering condition and click handler
assert(
  comparatorSource.includes("shouldMask && !examModeActive"),
  'Must gate peek button to when shouldMask && !examModeActive'
);
assert(
  comparatorSource.includes("setPeekedCards((prev) => ({ ...prev, [cardKey]: !prev[cardKey] }))"),
  'Peek button must toggle cardKey in peekedCards'
);

// Verify dropdown masking
assert(
  comparatorSource.includes("if (shouldMask)"),
  'Must check shouldMask in dropdown options render'
);
assert(
  comparatorSource.includes("sortStructuresByDocumentLabel"),
  'Must sort masked dropdown items using sortStructuresByDocumentLabel'
);

// Verify comparison table header masking
assert(
  comparatorSource.includes("{displayNameA}"),
  'Comparison table header for compound A must render displayNameA'
);
assert(
  comparatorSource.includes("{displayNameB}"),
  'Comparison table header for compound B must render displayNameB'
);

// Verify narrative and differentiator sanitization
assert(
  comparatorSource.includes("sanitizeText(resolveContrast(compoundA, compoundB, narrativeReplacements))"),
  'Unique differentiator A must be sanitized with sanitizeText and narrativeReplacements'
);
assert(
  comparatorSource.includes("sanitizeText(resolveContrast(compoundB, compoundA, narrativeReplacements))"),
  'Unique differentiator B must be sanitized with sanitizeText and narrativeReplacements'
);
assert(
  comparatorSource.includes("sanitizeText(resolveStructuralDifferences(compoundA, compoundB))"),
  'Structural differences must be sanitized'
);
assert(
  comparatorSource.includes("sanitizeText(resolvePkPdProfile(compoundA, compoundB))"),
  'PK/PD profile must be sanitized'
);
assert(
  comparatorSource.includes("{displayNameA}:"),
  'Contrast card A title must render displayNameA'
);
assert(
  comparatorSource.includes("{displayNameB}:"),
  'Contrast card B title must render displayNameB'
);

// Verify card header MOA/rationale sanitization
assert(
  /sanitizeText\(\s*\(\s*structure as any\)\?\.moa_summary/.test(comparatorSource),
  'Card header MOA/rationale quote must have sanitizeText applied'
);

console.log('✓ StructureComparator component source verification passed');
