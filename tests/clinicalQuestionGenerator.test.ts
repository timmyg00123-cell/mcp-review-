import assert from 'node:assert';
import {
  generateClinicalPreflipQuestion,
  type ClinicalQuestionDomain,
  type ClinicalPreflipQuestion,
  type ClinicalPreflipOption,
} from '../src/utils/clinicalQuestionGenerator.js';

console.log('Running Dynamic Clinical Pre-Flip Question Generator Tests...');

const ALL_DOMAINS: ClinicalQuestionDomain[] = [
  'brand-names',
  'contraindications',
  'adverse-effects',
  'subclass-exceptions',
  'dosing-pearls',
];

// 1. Generation across all 5 domains for multi-drug class (Atorvastatin)
console.log('Test 1: Valid generation across all 5 domains for standard multi-drug class...');
for (let i = 0; i < ALL_DOMAINS.length; i++) {
  const domain = ALL_DOMAINS[i];
  const q = generateClinicalPreflipQuestion('Atorvastatin', [domain], 0);

  assert.ok(q, `Question must not be null for domain ${domain}`);
  assert.strictEqual(q.domain, domain, `Question domain must match requested domain: ${domain}`);
  assert.ok(typeof q.id === 'string' && q.id.length > 0, 'Question ID must be non-empty string');
  assert.ok(typeof q.prompt === 'string' && q.prompt.length > 0, 'Question prompt must be non-empty string');
  assert.ok(q.type === 'mcq' || q.type === 'sata', `Question type must be 'mcq' or 'sata', got ${q.type}`);

  // Options validation: exactly 4 choices
  assert.strictEqual(q.options.length, 4, `Question for domain ${domain} must have exactly 4 options`);

  // Distinct IDs and distinct texts
  const optionIds = new Set(q.options.map((opt) => opt.id));
  assert.strictEqual(optionIds.size, 4, `All 4 option IDs must be unique for domain ${domain}`);

  const optionTexts = new Set(q.options.map((opt) => opt.text.trim().toLowerCase()));
  assert.strictEqual(optionTexts.size, 4, `All 4 option texts must be unique for domain ${domain}`);

  // Correct answer count rules
  const correctCount = q.options.filter((opt) => opt.isCorrect).length;
  if (q.type === 'mcq') {
    assert.strictEqual(correctCount, 1, `MCQ question in domain ${domain} must have exactly 1 correct option`);
  } else {
    assert.ok(
      correctCount >= 1 && correctCount <= 3,
      `SATA question in domain ${domain} must have between 1 and 3 correct options, found ${correctCount}`
    );
  }
}

// 2. Sibling distractor harvesting for multi-drug class
console.log('Test 2: Sibling distractor harvesting from broadPharmacologicClass...');
const brandQ = generateClinicalPreflipQuestion('Atorvastatin', ['brand-names'], 0);
assert.ok(brandQ, 'Brand question for Atorvastatin must be generated');
// Atorvastatin brand name is Lipitor. Statin siblings include Rosuvastatin (Crestor), Simvastatin (Zocor), Pravastatin (Pravachol)
const lipitorPresent = brandQ.options.some((opt) => opt.text.toLowerCase().includes('lipitor') && opt.isCorrect);
assert.ok(lipitorPresent, 'Atorvastatin brand question must include Lipitor as a correct option');

// 3. Fallback distractor harvesting when class has < 3 siblings (isolated classes)
console.log('Test 3: Fallback distractor harvesting for isolated / small classes...');
const isolatedDrugs = ['Amiodarone', 'Digoxin', 'Allopurinol'];

for (const drug of isolatedDrugs) {
  for (const domain of ALL_DOMAINS) {
    const q = generateClinicalPreflipQuestion(drug, [domain], 0);
    assert.ok(q, `Isolated drug ${drug} must successfully generate question for domain ${domain}`);
    assert.strictEqual(q.options.length, 4, `Isolated drug ${drug} in ${domain} must have exactly 4 options`);

    const ids = new Set(q.options.map((o) => o.id));
    assert.strictEqual(ids.size, 4, `Isolated drug ${drug} options must have 4 distinct IDs`);

    const texts = new Set(q.options.map((o) => o.text.trim().toLowerCase()));
    assert.strictEqual(texts.size, 4, `Isolated drug ${drug} options must have 4 distinct text values (no duplicates)`);

    const correctCount = q.options.filter((o) => o.isCorrect).length;
    if (q.type === 'mcq') {
      assert.strictEqual(correctCount, 1, `MCQ for ${drug} (${domain}) must have 1 correct option`);
    } else {
      assert.ok(correctCount >= 1 && correctCount <= 3, `SATA for ${drug} (${domain}) must have 1-3 correct options`);
    }
  }
}

// 4. Verify support for both MCQ and SATA questions
console.log('Test 4: Verify presence of both MCQ and SATA question types...');
const generatedTypes = new Set<string>();
for (const domain of ALL_DOMAINS) {
  const q = generateClinicalPreflipQuestion('Lisinopril', [domain], 0);
  if (q) {
    generatedTypes.add(q.type);
  }
}
assert.ok(generatedTypes.has('mcq'), 'At least one domain must generate an MCQ question');
assert.ok(generatedTypes.has('sata'), 'At least one domain must generate a SATA question');

// 5. Deterministic rotation across active domains when attemptIndex changes
console.log('Test 5: Deterministic domain rotation with attemptIndex...');
const testActiveDomains: ClinicalQuestionDomain[] = [
  'brand-names',
  'contraindications',
  'adverse-effects',
  'subclass-exceptions',
];

for (let attempt = 0; attempt < 8; attempt++) {
  const expectedDomain = testActiveDomains[attempt % testActiveDomains.length];
  const q = generateClinicalPreflipQuestion('Metformin', testActiveDomains, attempt);
  assert.ok(q, `Question must be generated for attempt ${attempt}`);
  assert.strictEqual(
    q.domain,
    expectedDomain,
    `Attempt ${attempt} must rotate to domain ${expectedDomain}, got ${q.domain}`
  );
}

// Determinism: same parameters produce identical question ID and options
const qA = generateClinicalPreflipQuestion('Metformin', testActiveDomains, 2);
const qB = generateClinicalPreflipQuestion('Metformin', testActiveDomains, 2);
assert.ok(qA && qB, 'Both deterministic runs must return valid questions');
assert.strictEqual(qA.id, qB.id, 'Same seed/attemptIndex must produce identical question ID');
assert.strictEqual(qA.prompt, qB.prompt, 'Same seed/attemptIndex must produce identical prompt');
assert.deepStrictEqual(
  qA.options.map((o) => o.text),
  qB.options.map((o) => o.text),
  'Same seed/attemptIndex must produce identical options ordering'
);

// 6. Edge cases: Single active domain with high attempt count rotates cleanly
console.log('Test 6: Single active domain with high attempt index...');
const singleDomainQ = generateClinicalPreflipQuestion('Sertraline', ['dosing-pearls'], 999);
assert.ok(singleDomainQ, 'Single active domain must resolve successfully on attempt 999');
assert.strictEqual(singleDomainQ.domain, 'dosing-pearls', 'Domain must be dosing-pearls');
assert.strictEqual(singleDomainQ.options.length, 4, 'Must have 4 options');

// 7. Edge cases: Empty active domains returns null safely
console.log('Test 7: Empty active domains returns null safely...');
const emptyQ = generateClinicalPreflipQuestion('Sertraline', []);
assert.strictEqual(emptyQ, null, 'Empty active domains must return null safely');

// 8. Edge cases: Unknown drug returns null safely
console.log('Test 8: Unknown drug returns null safely...');
const unknownQ = generateClinicalPreflipQuestion('UnknownMedicationX123', ['brand-names']);
assert.strictEqual(unknownQ, null, 'Unknown drug must return null safely');

console.log('All Dynamic Clinical Pre-Flip Question Generator tests passed!');
