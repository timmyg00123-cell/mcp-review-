import test from 'node:test';
import assert from 'node:assert/strict';
import { getDefaultRaasModule } from '../src/data/exam2/raasModuleData';
import { AntiplateletQuestion } from '../src/types/reviewModule';

test('RAAS review module benchmark audit', async (t) => {
  const mod = getDefaultRaasModule();

  await t.test('has correct module metadata and version', () => {
    assert.equal(mod.id, 'antihypertensives_4_mcp2');
    assert.equal(mod.version, '2.1.0', 'Module version must be 2.1.0');
    assert.equal(mod.pages.length, 4, 'Module must contain exactly 4 review pages matching the 4-page PDF');
  });

  await t.test('enforces sequential Question N labeling on every page', () => {
    const expectedPerPages = [5, 7, 12, 2];
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

  await t.test('verifies total question count is exactly 26 matching the source PDF', () => {
    let totalQuestions = 0;
    mod.pages.forEach((page) => {
      page.sections?.forEach((sec) => {
        if (sec.questions) totalQuestions += sec.questions.length;
      });
    });
    assert.equal(totalQuestions, 26, 'Total question count must be exactly 26');
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
              /\((?:Captopril|Enalapril|Enalaprilat|Lisinopril|Fosinopril|Ramipril|Losartan|EXP3174|Valsartan|Candesartan|Telmisartan)\)/i,
              `Page ${pIdx + 1} Q${q.id} option must not leak drug name in parentheses: "${opt}"`
            );
          });
        }
      });
    });
  });

  await t.test('verifies Drag & Drop matching matrix schema on Page 2 (Question 5 / Q10)', () => {
    const page2Questions: AntiplateletQuestion[] = [];
    mod.pages[1]?.sections?.forEach((sec) => sec.questions && page2Questions.push(...sec.questions));
    const p2Match = page2Questions.find((q) => q.type === 'matching');
    assert.ok(p2Match, 'Page 2 must contain a drag-and-drop matching question for Zinc-binding domains');
    assert.equal(p2Match.questionNumberLabel, 'Question 5');
    assert.deepEqual(p2Match.options, [
      'Structure I',
      'Structure II',
      'Structure III',
      'Structure IV',
      'Structure V',
      'Structure VI',
    ]);
    assert.ok(p2Match.matchingTargets && p2Match.matchingTargets.length === 3);

    const shTarget = p2Match.matchingTargets.find((t) => t.id === 'target-sh');
    assert.ok(shTarget, 'Must have sulfhydryl target');
    assert.ok(shTarget.acceptedStructureIds.includes('Structure I'));

    const cooTarget = p2Match.matchingTargets.find((t) => t.id === 'target-coo');
    assert.ok(cooTarget, 'Must have carboxylate target');
    assert.ok(cooTarget.acceptedStructureIds.includes('Structure II'));
    assert.ok(cooTarget.acceptedStructureIds.includes('Structure III'));
    assert.ok(cooTarget.acceptedStructureIds.includes('Structure V'));
    assert.ok(cooTarget.acceptedStructureIds.includes('Structure VI'));

    const po2Target = p2Match.matchingTargets.find((t) => t.id === 'target-po2');
    assert.ok(po2Target, 'Must have phosphinate target');
    assert.ok(po2Target.acceptedStructureIds.includes('Structure IV'));
  });
});
