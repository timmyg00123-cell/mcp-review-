import test from 'node:test';
import assert from 'node:assert/strict';
import { getDefaultVasodilatorsModule } from '../src/data/exam2/vasodilatorsModuleData';
import { AntiplateletQuestion } from '../src/types/reviewModule';

test('Vasodilators review module benchmark audit', async (t) => {
  const mod = getDefaultVasodilatorsModule();

  await t.test('has correct module metadata and version', () => {
    assert.equal(mod.id, 'antihypertensives_3_mcp2');
    assert.equal(mod.version, '2.3.0', 'Module version must be 2.3.0');
    assert.equal(mod.pages.length, 4, 'Module must contain exactly 4 review pages matching the 4-page PDF');
  });

  await t.test('enforces sequential Question N labeling on every page', () => {
    const expectedPerPages = [9, 5, 2, 9];
    assert.equal(mod.pages.length, expectedPerPages.length);

    mod.pages.forEach((page, pIdx) => {
      const questions: AntiplateletQuestion[] = [];
      if (page.sections) {
        page.sections.forEach((sec) => {
          if (sec.questions) questions.push(...sec.questions);
        });
      }
      assert.equal(
        questions.length,
        expectedPerPages[pIdx],
        `Page ${pIdx + 1} must have exactly ${expectedPerPages[pIdx]} questions, found ${questions.length}`
      );

      questions.forEach((q, qIdx) => {
        assert.equal(
          q.questionNumberLabel,
          `Question ${qIdx + 1}`,
          `Page ${pIdx + 1} question ${q.id} must have questionNumberLabel "Question ${qIdx + 1}"`
        );
      });
    });
  });

  await t.test('verifies total question count is exactly 25 matching the source PDF', () => {
    let totalQuestions = 0;
    mod.pages.forEach((page) => {
      page.sections?.forEach((sec) => {
        if (sec.questions) totalQuestions += sec.questions.length;
      });
    });
    assert.equal(totalQuestions, 25, 'Total question count must be exactly 25');
  });

  await t.test('verifies zero parenthetical drug name spoilers in multiple-choice options', () => {
    mod.pages.forEach((page, pIdx) => {
      const questions: AntiplateletQuestion[] = [];
      page.sections?.forEach((sec) => sec.questions && questions.push(...sec.questions));

      questions.forEach((q) => {
        if (q.options) {
          q.options.forEach((opt) => {
            assert.doesNotMatch(
              opt,
              /Structure\s+[IVXLCDM]+\s*\([A-Za-z\- ]+\)/i,
              `Page ${pIdx + 1} Q${q.id} option must not leak drug name in parentheses: "${opt}"`
            );
            assert.doesNotMatch(
              opt,
              /Drug\s+[IVXLCDM]+\s*\([A-Za-z\- ]+\)/i,
              `Page ${pIdx + 1} Q${q.id} option must not leak drug name in parentheses: "${opt}"`
            );
            assert.doesNotMatch(
              opt,
              /[IVXLCDM]+\s*\([A-Za-z\- ]+\)/,
              `Page ${pIdx + 1} Q${q.id} option must not leak drug name in parentheses: "${opt}"`
            );
            assert.doesNotMatch(
              opt,
              /\((?:Clevidipine|Nifedipine|Amlodipine|Nicardipine|Felodipine|Isradipine|Hydralazine|Minoxidil|Diazoxide|Ranolazine|Milrinone|Nitroglycerin)\)/i,
              `Page ${pIdx + 1} Q${q.id} option must not leak drug name in parentheses: "${opt}"`
            );
          });
        }
      });
    });
  });

  await t.test('verifies Drag & Drop matching matrix schema on Page 4 (Question 1 / Q17)', () => {
    const page4Questions: AntiplateletQuestion[] = [];
    mod.pages[3]?.sections?.forEach((sec) => sec.questions && page4Questions.push(...sec.questions));
    const p4Match = page4Questions.find((q) => q.type === 'matching');
    assert.ok(p4Match, 'Page 4 must contain a drag-and-drop matching question for Vasodilator chemical classes');
    assert.equal(p4Match.questionNumberLabel, 'Question 1');
    assert.deepEqual(p4Match.options, [
      'Structure I',
      'Structure II',
      'Structure III',
      'Structure IV',
      'Structure V',
      'Structure VI',
      'Structure VII',
      'Structure VIII',
      'Structure IX',
      'Structure X'
    ]);
    assert.ok(p4Match.matchingTargets && p4Match.matchingTargets.length === 8);
    p4Match.matchingTargets.forEach((target) => {
      assert.ok(target.acceptedStructureIds && target.acceptedStructureIds.length >= 1);
    });
  });

  await t.test('verifies all structures displayed have valid SMILES and labels', () => {
    mod.pages.forEach((page, pIdx) => {
      page.sections?.forEach((sec) => {
        if (sec.structures) {
          sec.structures.forEach((st) => {
            assert.ok(st.id, `Structure on Page ${pIdx + 1} must have an id`);
            assert.ok(st.smiles || st.canonicalSmiles, `Structure ${st.id} on Page ${pIdx + 1} must have SMILES`);
          });
        }
      });
    });
  });
});
