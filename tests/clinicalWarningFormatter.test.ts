import assert from 'node:assert';
import { formatClinicalWarnings } from '../src/utils/clinicalWarningFormatter';

// Test 1: Empty or undefined or whitespace input
const emptyRes = formatClinicalWarnings(undefined);
assert.deepStrictEqual(emptyRes.items, []);
assert.strictEqual(emptyRes.isTruncated, false);
assert.strictEqual(emptyRes.totalCount, 0);

const whitespaceRes = formatClinicalWarnings('    ');
assert.deepStrictEqual(whitespaceRes.items, []);
assert.strictEqual(whitespaceRes.isTruncated, false);

// Test 2: Array of items capping at 5
const longArray = [
  'Nausea and vomiting',
  'Severe ventricular arrhythmias',
  'Headache and dizziness',
  'Visual disturbances (yellow-green halos)',
  'Confusion and disorientation',
  'Hyperkalemia',
  'AV block'
];
const arrayRes = formatClinicalWarnings(longArray, 5);
assert.strictEqual(arrayRes.items.length, 5);
assert.strictEqual(arrayRes.isTruncated, true);
assert.strictEqual(arrayRes.totalCount, 7);
assert.strictEqual(arrayRes.items[0], 'Nausea and vomiting');

// Test 3: Short array not truncated
const shortArray = ['Cardiac glycoside toxicity', 'Renal impairment warning'];
const shortArrayRes = formatClinicalWarnings(shortArray, 5);
assert.strictEqual(shortArrayRes.items.length, 2);
assert.strictEqual(shortArrayRes.isTruncated, false);
assert.strictEqual(shortArrayRes.totalCount, 2);

// Test 4: Raw verbose FDA paragraph splitting with bullet/semicolon/period detection
const rawParagraph =
  'Contraindications: Hypersensitivity to active drug or excipients; documented ventricular fibrillation. Adverse Reactions: Most common adverse reactions (>5%) include visual disturbances, cardiac arrhythmias, nausea, and headache. Monitor serum potassium and renal clearance regularly.';
const paraRes = formatClinicalWarnings(rawParagraph, 5);
assert(paraRes.items.length <= 5, 'Items should be capped at 5');
assert(paraRes.items.length > 0, 'Items should contain extracted points');
assert(paraRes.rawText.length > 0, 'rawText should be preserved');

console.log('Task 1 clinicalWarningFormatter tests passed!');
