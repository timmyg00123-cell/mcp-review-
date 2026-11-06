// tests/exam1CumulativeQuiz.test.ts
import assert from 'node:assert';
import { getCumulativeQuestionBank, CUMULATIVE_QUESTIONS_EXAM_1 } from '../src/data/cumulativeQuizData';
import { harvestCumulativeFlashcards } from '../src/utils/cumulativeStructureHarvester';
import type { CumulativeQuestion, CumulativeQuestionType, PhysiologicalEffectStatement } from '../src/types/cumulativeStudy';
import type { ChemicalStructure } from '../src/types/reviewModule';

console.log('Testing Exam 1 Cumulative Quiz Data & Harvester Integration...');

// 1. Verify export and question count
assert.ok(Array.isArray(CUMULATIVE_QUESTIONS_EXAM_1), 'CUMULATIVE_QUESTIONS_EXAM_1 must be an array');
assert.strictEqual(CUMULATIVE_QUESTIONS_EXAM_1.length, 16, `Exam 1 must have exactly 16 cumulative questions (found ${CUMULATIVE_QUESTIONS_EXAM_1.length})`);

// 2. Verify getCumulativeQuestionBank('exam_1') returns CUMULATIVE_QUESTIONS_EXAM_1
const bank = getCumulativeQuestionBank('exam_1');
assert.strictEqual(bank, CUMULATIVE_QUESTIONS_EXAM_1, "getCumulativeQuestionBank('exam_1') must return CUMULATIVE_QUESTIONS_EXAM_1");

// 3. Verify coverage across all 4 question types
const validTypes: CumulativeQuestionType[] = [
  'case-to-structures',
  'structure-to-effects',
  'comparative-sar',
  'contraindication-risk',
];

const typeCounts: Record<CumulativeQuestionType, number> = {
  'case-to-structures': 0,
  'structure-to-effects': 0,
  'comparative-sar': 0,
  'contraindication-risk': 0,
};

const validModuleIds = new Set([
  'renal_drugs_mcp2',
  'respiratory_bronchodilators_mcp2',
  'respiratory_antiinflammatories_mcp2',
]);

const forbiddenStemTerms = [
  'renal module',
  'bronchodilator module',
  'steroid module',
  'respiratory module',
  'exam 1 module',
];

CUMULATIVE_QUESTIONS_EXAM_1.forEach((q: CumulativeQuestion, idx: number) => {
  const qLabel = `Exam 1 Cumulative Question #${idx + 1} (${q.id})`;

  // Basic identification
  assert.ok(q.id && typeof q.id === 'string', `${qLabel} must have a non-empty string id`);
  assert.ok(validTypes.includes(q.type), `${qLabel} has invalid type: ${q.type}`);
  typeCounts[q.type]++;

  // Originating modules
  assert.ok(Array.isArray(q.moduleIds) && q.moduleIds.length >= 1, `${qLabel} must represent at least 1 module`);
  q.moduleIds.forEach((mId: string) => {
    assert.ok(validModuleIds.has(mId), `${qLabel} has unknown or non-Exam 1 moduleId: ${mId}`);
  });

  // Question stem
  assert.ok(q.stem && typeof q.stem === 'string' && q.stem.trim().length > 20, `${qLabel} must have a descriptive stem`);
  const lowerStem = q.stem.toLowerCase();
  forbiddenStemTerms.forEach((term: string) => {
    assert.ok(!lowerStem.includes(term), `${qLabel} stem leaks module reference: "${term}"`);
  });

  // High yield pearl
  assert.ok(
    q.highYieldPearl && typeof q.highYieldPearl === 'string' && q.highYieldPearl.trim().length > 20,
    `${qLabel} must have a detailed highYieldPearl`
  );

  // Type A, C, D: Candidate structures and rationales
  if (q.type === 'case-to-structures' || q.type === 'comparative-sar' || q.type === 'contraindication-risk') {
    assert.ok(
      Array.isArray(q.candidateStructures) && q.candidateStructures.length >= 3,
      `${qLabel} (${q.type}) must have at least 3 candidate structures (found ${q.candidateStructures?.length})`
    );

    q.candidateStructures.forEach((s, sIdx) => {
      assert.ok(s && typeof s === 'object', `${qLabel} candidate structure at index ${sIdx} is undefined!`);
    });

    assert.ok(
      Array.isArray(q.correctStructureIds) && q.correctStructureIds.length >= 1,
      `${qLabel} (${q.type}) must have at least 1 correctStructureId`
    );

    const candidateIdSet = new Set(q.candidateStructures.map((s) => s.id));
    q.correctStructureIds.forEach((cId: string) => {
      assert.ok(candidateIdSet.has(cId), `${qLabel} correctStructureId "${cId}" is not among candidate structures`);
    });

    assert.ok(q.rationales && typeof q.rationales === 'object', `${qLabel} missing rationales map`);
    q.candidateStructures.forEach((struct: ChemicalStructure) => {
      assert.ok(
        q.rationales[struct.id] && q.rationales[struct.id].trim().length > 10,
        `${qLabel} missing rationale for candidate structure: ${struct.id}`
      );
    });
  }

  // Type B: Structure-to-effects
  if (q.type === 'structure-to-effects') {
    assert.ok(q.singleStructure, `${qLabel} (Type B) must have a singleStructure`);
    const struct = q.singleStructure;
    assert.ok(struct.id && typeof struct.id === 'string', `${qLabel} singleStructure missing id`);
    assert.ok(struct.name && typeof struct.name === 'string', `${qLabel} singleStructure missing name`);
    assert.ok(struct.smiles && typeof struct.smiles === 'string', `${qLabel} singleStructure missing smiles`);

    assert.ok(
      Array.isArray(q.effectStatements) && q.effectStatements.length >= 3,
      `${qLabel} (Type B) must have at least 3 effectStatements (found ${q.effectStatements?.length})`
    );

    let hasCorrect = false;
    let hasIncorrect = false;

    q.effectStatements.forEach((stmt: PhysiologicalEffectStatement) => {
      assert.ok(stmt.id && typeof stmt.id === 'string', `${qLabel} effectStatement missing id`);
      assert.ok(
        stmt.statement && typeof stmt.statement === 'string' && stmt.statement.trim().length > 10,
        `${qLabel} effectStatement ${stmt.id} missing text`
      );
      assert.strictEqual(
        typeof stmt.isCorrect,
        'boolean',
        `${qLabel} effectStatement ${stmt.id} isCorrect must be boolean`
      );
      assert.ok(
        stmt.rationale && typeof stmt.rationale === 'string' && stmt.rationale.trim().length > 10,
        `${qLabel} effectStatement ${stmt.id} missing rationale`
      );

      if (stmt.isCorrect) hasCorrect = true;
      if (!stmt.isCorrect) hasIncorrect = true;
    });

    assert.ok(hasCorrect, `${qLabel} (Type B) must have at least 1 correct statement`);
    assert.ok(hasIncorrect, `${qLabel} (Type B) must have at least 1 incorrect statement`);
  }
});

// Verify distribution
assert.strictEqual(typeCounts['case-to-structures'], 4, 'Must have exactly 4 case-to-structures questions');
assert.strictEqual(typeCounts['structure-to-effects'], 4, 'Must have exactly 4 structure-to-effects questions');
assert.strictEqual(typeCounts['comparative-sar'], 4, 'Must have exactly 4 comparative-sar questions');
assert.strictEqual(typeCounts['contraindication-risk'], 4, 'Must have exactly 4 contraindication-risk questions');

console.log('Exam 1 Cumulative Quiz type distribution:', typeCounts);

// 4. Verify harvestCumulativeFlashcards('exam_1')
const harvested = harvestCumulativeFlashcards('exam_1');
assert.ok(Array.isArray(harvested), 'harvestCumulativeFlashcards must return array');
assert.ok(harvested.length >= 25, `Must harvest at least 25 structures for Exam 1 (found ${harvested.length})`);
harvested.forEach((card) => {
  assert.ok(card.structureId, 'card must have structureId');
  assert.ok(card.drugName, 'card must have drugName');
  assert.ok(card.structure, 'card must have structure object');
  assert.ok(card.moduleIds.length > 0, 'card must have moduleIds');
  card.moduleIds.forEach((mId) => {
    assert.ok(validModuleIds.has(mId), `card module ID ${mId} must belong to Exam 1`);
  });
});
console.log(`Successfully harvested ${harvested.length} unique chemical structures for Exam 1 flashcards.`);

console.log('All Exam 1 Cumulative Quiz tests passed successfully!');
