import test from 'node:test';
import assert from 'node:assert/strict';
import { getDefaultDiureticsModule } from '../src/data/exam2/diureticsModuleData';
import { AntiplateletQuestion } from '../src/types/reviewModule';

test('Diuretics review module benchmark audit', async (t) => {
  const mod = getDefaultDiureticsModule();

  await t.test('has correct module metadata and version', () => {
    assert.equal(mod.id, 'antihypertensives_1_mcp2');
    assert.equal(mod.version, '2.1.0', 'Module version must be 2.1.0');
    assert.equal(mod.pages.length, 5, 'Module must contain exactly 5 review pages matching the 5-page PDF');
  });

  await t.test('enforces sequential Question N labeling on every page', () => {
    const expectedPerPages = [9, 4, 9, 6, 5];
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
              /[IVXLCDM]+\s*\([A-Za-z\- ]+\)/,
              `Page ${pIdx + 1} Q${q.id} option must not leak drug name in parentheses: "${opt}"`
            );
          });
        }
      });
    });
  });

  await t.test('verifies Drag & Drop matching matrix schemas on Pages 3 and 4', () => {
    const page3Questions: AntiplateletQuestion[] = [];
    mod.pages[2]?.sections?.forEach((sec) => sec.questions && page3Questions.push(...sec.questions));
    const p3Match = page3Questions.find((q) => q.type === 'matching');
    assert.ok(p3Match, 'Page 3 must contain a drag-and-drop matching question for Loop Diuretics properties');
    assert.equal(p3Match.questionNumberLabel, 'Question 1');
    assert.deepEqual(p3Match.options, ['Structure I', 'Structure II', 'Structure III', 'Structure IV']);
    assert.ok(p3Match.matchingPairs && p3Match.matchingPairs.length === 5);
    p3Match.matchingPairs.forEach((pair) => {
      assert.ok(pair.acceptedStructureIds && pair.acceptedStructureIds.length >= 2);
    });

    const page4Questions: AntiplateletQuestion[] = [];
    mod.pages[3]?.sections?.forEach((sec) => sec.questions && page4Questions.push(...sec.questions));
    const p4Match = page4Questions.find((q) => q.type === 'matching');
    assert.ok(p4Match, 'Page 4 must contain a drag-and-drop matching question for Multiclass Diuretics classification');
    assert.equal(p4Match.questionNumberLabel, 'Question 1');
    assert.deepEqual(p4Match.options, ['Structure I', 'Structure II', 'Structure III', 'Structure IV']);
    assert.ok(p4Match.matchingPairs && p4Match.matchingPairs.length === 4);
    p4Match.matchingPairs.forEach((pair) => {
      assert.ok(pair.acceptedStructureIds && pair.acceptedStructureIds.length >= 2);
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
