// tests/cumulativeQuizData.test.ts
import assert from 'node:assert';
import { getCumulativeQuestionBank, CUMULATIVE_QUESTIONS } from '../src/data/cumulativeQuizData';
import type { CumulativeQuestion, CumulativeQuestionType, PhysiologicalEffectStatement } from '../src/types/cumulativeStudy';
import type { ChemicalStructure } from '../src/types/reviewModule';

console.log('Testing Cumulative Quiz Data Bank...');

// 1. Verify exports and question count
assert.ok(Array.isArray(CUMULATIVE_QUESTIONS), 'CUMULATIVE_QUESTIONS must be an array');
const bank: CumulativeQuestion[] = getCumulativeQuestionBank();
assert.ok(Array.isArray(bank), 'getCumulativeQuestionBank() must return an array');
assert.strictEqual(bank, CUMULATIVE_QUESTIONS, 'getCumulativeQuestionBank() should return CUMULATIVE_QUESTIONS');
assert.ok(bank.length >= 8, `Bank must have at least 8 curated questions (found ${bank.length})`);

// 2. Verify coverage across all 4 question types
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

// Forbidden phrases in question stems to prevent module leakage
const forbiddenStemTerms = [
  'antiplatelet module',
  'anticoagulant module',
  'heart failure module',
  'antiarrhythmic module',
  'antiplatelets module',
  'anticoagulants module',
];

bank.forEach((q: CumulativeQuestion, idx: number) => {
  const qLabel = `Question #${idx + 1} (${q.id})`;

  // Basic identification
  assert.ok(q.id && typeof q.id === 'string', `${qLabel} must have a non-empty string id`);
  assert.ok(validTypes.includes(q.type), `${qLabel} has invalid type: ${q.type}`);
  typeCounts[q.type]++;

  // Originating modules
  assert.ok(Array.isArray(q.moduleIds) && q.moduleIds.length >= 1, `${qLabel} must represent at least 1 module`);
  q.moduleIds.forEach((mId: string) => {
    assert.ok(typeof mId === 'string' && mId.length > 0, `${qLabel} has invalid moduleId`);
  });

  // Question stem
  assert.ok(q.stem && typeof q.stem === 'string' && q.stem.trim().length > 20, `${qLabel} must have a descriptive stem`);
  const lowerStem = q.stem.toLowerCase();
  forbiddenStemTerms.forEach((term: string) => {
    assert.ok(!lowerStem.includes(term), `${qLabel} stem leaks module reference: "${term}"`);
  });

  // High yield pearl
  assert.ok(
    q.highYieldPearl && typeof q.highYieldPearl === 'string' && q.highYieldPearl.trim().length > 15,
    `${qLabel} must have a rich highYieldPearl`
  );

  // Rationales dictionary
  assert.ok(q.rationales && typeof q.rationales === 'object', `${qLabel} must have a rationales object`);

  if (q.type !== 'structure-to-effects') {
    // Types A, C, D: 3 to 5 candidate structures
    assert.ok(
      Array.isArray(q.candidateStructures) &&
        q.candidateStructures.length >= 3 &&
        q.candidateStructures.length <= 5,
      `${qLabel} candidateStructures must contain 3 to 5 structures (found ${q.candidateStructures?.length})`
    );

    assert.ok(
      Array.isArray(q.correctStructureIds) && q.correctStructureIds.length >= 1,
      `${qLabel} must have at least 1 correctStructureId (found ${q.correctStructureIds?.length})`
    );

    const candidateIdSet = new Set(q.candidateStructures.map((s: ChemicalStructure) => s.id));

    // Ensure all correctStructureIds exist in candidate cohort
    q.correctStructureIds.forEach((cId: string) => {
      assert.ok(candidateIdSet.has(cId), `${qLabel} correctStructureId "${cId}" not in candidate structures`);
    });

    // Validate each candidate structure and blinding
    q.candidateStructures.forEach((struct: ChemicalStructure) => {
      assert.ok(struct.id && typeof struct.id === 'string', `${qLabel} candidate missing id`);
      assert.ok(struct.name && typeof struct.name === 'string', `${qLabel} candidate ${struct.id} missing name`);
      assert.ok(
        struct.chemicalClass && typeof struct.chemicalClass === 'string',
        `${qLabel} candidate ${struct.id} missing chemicalClass`
      );
      const smiles = struct.smiles || struct.canonicalSmiles || struct.canonical_smiles;
      assert.ok(smiles && typeof smiles === 'string', `${qLabel} candidate ${struct.id} missing SMILES string`);

      // Rationales must explain every candidate
      assert.ok(
        q.rationales[struct.id] && q.rationales[struct.id].trim().length > 10,
        `${qLabel} rationales missing explanation for candidate structure "${struct.id}"`
      );

      const commonPharmaWords = new Set([
        'active',
        'metabolite',
        'derivative',
        'acid',
        'salt',
        'sodium',
        'oral',
        'form',
        'analogue',
      ]);

      // Blinding check: Stem must not leak the candidate generic drug name or trade name
      const nameWords = struct.name
        .split(/[\s(/)]+/)
        .map((w: string) => w.toLowerCase())
        .filter((w: string) => w.length >= 4 && !commonPharmaWords.has(w));

      nameWords.forEach((word: string) => {
        const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
        assert.ok(
          !wordRegex.test(q.stem),
          `${qLabel} stem leaks candidate drug name "${word}" from candidate "${struct.name}"`
        );
      });

      if (struct.tradeName) {
        const tradeWords = struct.tradeName
          .split(/[\s(/)]+/)
          .map((w: string) => w.toLowerCase())
          .filter((w: string) => w.length >= 4 && !commonPharmaWords.has(w));

        tradeWords.forEach((word: string) => {
          const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
          assert.ok(
            !wordRegex.test(q.stem),
            `${qLabel} stem leaks candidate trade name "${word}" from candidate "${struct.tradeName}"`
          );
        });
      }
    });
  } else {
    // Type B: Single prominent structure + physiological effect statements
    assert.ok(q.singleStructure, `${qLabel} (Type B) must have singleStructure defined`);
    const struct: ChemicalStructure = q.singleStructure;
    assert.ok(struct.id && typeof struct.id === 'string', `${qLabel} singleStructure missing id`);
    assert.ok(struct.name && typeof struct.name === 'string', `${qLabel} singleStructure missing name`);
    const smiles = struct.smiles || struct.canonicalSmiles || struct.canonical_smiles;
    assert.ok(smiles && typeof smiles === 'string', `${qLabel} singleStructure missing SMILES string`);

    const commonPharmaWords = new Set([
      'active',
      'metabolite',
      'derivative',
      'acid',
      'salt',
      'sodium',
      'oral',
      'form',
      'analogue',
    ]);

    // Blinding check: Stem must not leak the single structure's name or trade name
    const nameWords = struct.name
      .split(/[\s(/)]+/)
      .map((w: string) => w.toLowerCase())
      .filter((w: string) => w.length >= 4 && !commonPharmaWords.has(w));

    nameWords.forEach((word: string) => {
      const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
      assert.ok(
        !wordRegex.test(q.stem),
        `${qLabel} stem leaks singleStructure drug name "${word}" ("${struct.name}")`
      );
    });

    if (struct.tradeName) {
      const tradeWords = struct.tradeName
        .split(/[\s(/)]+/)
        .map((w: string) => w.toLowerCase())
        .filter((w: string) => w.length >= 4 && !commonPharmaWords.has(w));

      tradeWords.forEach((word: string) => {
        const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
        assert.ok(
          !wordRegex.test(q.stem),
          `${qLabel} stem leaks singleStructure trade name "${word}" ("${struct.tradeName}")`
        );
      });
    }

    // Effect statements
    assert.ok(
      Array.isArray(q.effectStatements) && q.effectStatements.length >= 3,
      `${qLabel} (Type B) must have at least 3 effectStatements (found ${q.effectStatements?.length})`
    );

    let hasCorrectStatement = false;
    let hasIncorrectStatement = false;

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

      if (stmt.isCorrect) hasCorrectStatement = true;
      if (!stmt.isCorrect) hasIncorrectStatement = true;

      // Blinding: Statements must not leak the target drug name or trade name
      nameWords.forEach((word: string) => {
        const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
        assert.ok(
          !wordRegex.test(stmt.statement),
          `${qLabel} statement ${stmt.id} leaks drug name "${word}" ("${struct.name}")`
        );
      });

      if (struct.tradeName) {
        const tradeWords = struct.tradeName
          .split(/[\s(/)]+/)
          .map((w: string) => w.toLowerCase())
          .filter((w: string) => w.length >= 4 && !commonPharmaWords.has(w));

        tradeWords.forEach((word: string) => {
          const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
          assert.ok(
            !wordRegex.test(stmt.statement),
            `${qLabel} statement ${stmt.id} leaks trade name "${word}" ("${struct.tradeName}")`
          );
        });
      }
    });

    assert.ok(hasCorrectStatement, `${qLabel} (Type B) must have at least 1 correct statement`);
    assert.ok(hasIncorrectStatement, `${qLabel} (Type B) must have at least 1 incorrect statement`);
  }
});

// Ensure all 4 question types have at least 1 question (ideally 2 each for 8 total)
validTypes.forEach((t: CumulativeQuestionType) => {
  assert.ok(typeCounts[t] >= 1, `Bank must have at least 1 question of type "${t}" (found ${typeCounts[t]})`);
});

console.log('Question type distribution:');
console.log(typeCounts);
console.log(`Cumulative quiz data verified successfully! Total questions: ${bank.length}`);
