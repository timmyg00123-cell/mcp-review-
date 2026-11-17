import test from 'node:test';
import assert from 'node:assert/strict';
import { getDefaultSympatholyticsModule } from '../src/data/exam2/sympatholyticsModuleData';
import { AntiplateletQuestion } from '../src/types/reviewModule';

test('Sympatholytics review module benchmark audit', async (t) => {
  const mod = getDefaultSympatholyticsModule();

  await t.test('has correct module metadata and version', () => {
    assert.equal(mod.id, 'antihypertensives_2_mcp2');
    assert.equal(mod.version, '2.3.0', 'Module version must be 2.3.0');
    assert.equal(mod.pages.length, 7, 'Module must contain exactly 7 review pages matching the 7-page PDF');
  });

  await t.test('enforces sequential Question N labeling on every page', () => {
    const expectedPerPages = [7, 12, 5, 3, 6, 9, 1];
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
              /Drug\s+[IVXLCDM]+\s*\([A-Za-z\- ]+\)/i,
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

  await t.test('verifies Drag & Drop matching matrix schema on Page 2', () => {
    const page2Questions: AntiplateletQuestion[] = [];
    mod.pages[1]?.sections?.forEach((sec) => sec.questions && page2Questions.push(...sec.questions));
    const p2Match = page2Questions.find((q) => q.type === 'matching');
    assert.ok(p2Match, 'Page 2 must contain a drag-and-drop matching question for Beta-Blocker landmark properties');
    assert.equal(p2Match.questionNumberLabel, 'Question 1');
    assert.deepEqual(p2Match.options, [
      'Structure I',
      'Structure II',
      'Structure III',
      'Structure IV',
      'Structure V',
      'Structure VI'
    ]);
    assert.ok(p2Match.matchingPairs && p2Match.matchingPairs.length === 6);
    p2Match.matchingPairs.forEach((pair) => {
      assert.ok(pair.acceptedStructureIds && pair.acceptedStructureIds.length >= 2);
    });
  });

  await t.test('verifies Review Page 7 head-to-head comparative battery', () => {
    const page7Questions: AntiplateletQuestion[] = [];
    mod.pages[6]?.sections?.forEach((sec) => sec.questions && page7Questions.push(...sec.questions));
    assert.equal(page7Questions.length, 1, 'Page 7 must have exactly 1 comprehensive comparative battery question');
    const q43 = page7Questions[0];
    assert.equal(q43.questionNumberLabel, 'Question 1');
    assert.ok(q43.subStatements && q43.subStatements.length >= 4);
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
