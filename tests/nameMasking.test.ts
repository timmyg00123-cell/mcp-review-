import assert from 'node:assert';
import { getMaskedDrugName, sanitizeNarrativeText } from '../src/utils/documentLabel.js';

// 1. Name masking tests
assert.strictEqual(getMaskedDrugName('Furosemide', 'Structure II', false, false), 'Furosemide');
assert.strictEqual(getMaskedDrugName('Furosemide', 'Structure II', true, false), 'Structure II');
assert.strictEqual(getMaskedDrugName('Furosemide', 'Structure II', true, true), 'Furosemide');
assert.strictEqual(getMaskedDrugName('Furosemide', 'Structure II', true), 'Structure II', 'Default isPeeked should be false');
assert.strictEqual(getMaskedDrugName('Furosemide', 'Structure II', false), 'Furosemide', 'Unmasked with default isPeeked should return realName');

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

// 3. Edge cases for narrative sanitization
// Case insensitive replacement
const lowerSentence = 'furosemide and lasix action.';
const sanitizedLower = sanitizeNarrativeText(lowerSentence, [
  { realName: 'Furosemide', tradeName: 'Lasix', maskedLabel: 'Structure I' },
]);
assert.strictEqual(sanitizedLower, 'Structure I and [Brand] action.');

// Word boundary check: partial words should NOT be replaced
const partialSentence = 'Furosemidelike compound.';
const sanitizedPartial = sanitizeNarrativeText(partialSentence, [
  { realName: 'Furosemide', tradeName: 'Lasix', maskedLabel: 'Structure I' },
]);
assert.strictEqual(sanitizedPartial, 'Furosemidelike compound.');

// Empty or falsy input
assert.strictEqual(sanitizeNarrativeText('', []), '');

// Missing tradeName
const noTradeSentence = 'Furosemide is potent.';
const sanitizedNoTrade = sanitizeNarrativeText(noTradeSentence, [
  { realName: 'Furosemide', maskedLabel: 'Structure I' },
]);
assert.strictEqual(sanitizedNoTrade, 'Structure I is potent.');

// Special replacement pattern handling in replacement label ($1, $&, $$, etc.)
const dollarSentence = 'Compare Furosemide to benchmark.';
const sanitizedDollar = sanitizeNarrativeText(dollarSentence, [
  { realName: 'Furosemide', maskedLabel: 'Structure $1 ($&, $$)' },
]);
assert.strictEqual(
  sanitizedDollar,
  'Compare Structure $1 ($&, $$) to benchmark.',
  'Special replacement patterns in maskedLabel must not be parsed by replace'
);

console.log('✓ All name masking and narrative sanitization tests passed');
