import test from 'node:test';
import assert from 'node:assert/strict';
import { getDefaultAntihyperlipidemicsModule } from '../src/data/exam2/antihyperlipidemicsModuleData';
import { extractRomanOrShortLabel, formatTargetBullet } from '../src/utils/documentLabel';
import { ChemicalStructure, MatchingTarget } from '../src/types/reviewModule';

test('Antihyperlipidemics review module benchmark audit', async (t) => {
  const moduleData = getDefaultAntihyperlipidemicsModule();

  await t.test('has correct module metadata and version', () => {
    assert.equal(moduleData.id, 'antihyperlipidemics_mcp2');
    assert.equal(moduleData.version, '2.0.0');
    assert.equal(moduleData.pages.length, 5, 'Must have exactly 5 review pages matching the 5-page PDF');
  });

  await t.test('enforces sequential Question N labeling on every page', () => {
    moduleData.pages.forEach((page, pIdx) => {
      let expectedNum = 1;
      const questions = page.sections?.flatMap(s => s.questions || []) || (page as any).questions || [];
      assert.ok(questions.length > 0, `Page ${pIdx + 1} must contain questions`);

      questions.forEach((q: any) => {
        assert.equal(
          q.questionNumberLabel,
          `Question ${expectedNum}`,
          `Page ${page.pageNumber} (${pIdx + 1}) question ${q.id} must be labeled "Question ${expectedNum}", got "${q.questionNumberLabel}"`
        );
        expectedNum++;
      });
    });
  });

  await t.test('verifies total question count is exactly 35 matching the source PDF', () => {
    const allQuestions = moduleData.pages.flatMap(p => p.sections?.flatMap(s => s.questions || []) || []);
    assert.equal(allQuestions.length, 35, 'Total question count must be exactly 35');
    
    // Check page breakdown: Page 1: 4, Page 2: 14, Page 3: 9, Page 4: 6, Page 5: 2
    assert.equal(moduleData.pages[0].sections?.[0].questions?.length, 4, 'Page 1 must have 4 questions');
    assert.equal(moduleData.pages[1].sections?.[0].questions?.length, 14, 'Page 2 must have 14 questions');
    assert.equal(moduleData.pages[2].sections?.[0].questions?.length, 9, 'Page 3 must have 9 questions');
    assert.equal(moduleData.pages[3].sections?.[0].questions?.length, 6, 'Page 4 must have 6 questions');
    assert.equal(moduleData.pages[4].sections?.[0].questions?.length, 2, 'Page 5 must have 2 questions');
  });

  await t.test('verifies zero parenthetical drug name spoilers in multiple-choice options', () => {
    const allQuestions = moduleData.pages.flatMap(p => p.sections?.flatMap(s => s.questions || []) || []);
    const parentheticalSpoilerRegex = /Structure\s+[IVXLCDM]+\s*\([A-Za-z\- ]+\)/i;

    allQuestions.forEach((q: any) => {
      if (q.options && Array.isArray(q.options)) {
        q.options.forEach((opt: string, optIdx: number) => {
          assert.doesNotMatch(
            opt,
            parentheticalSpoilerRegex,
            `Question ${q.id} (${q.questionNumberLabel}) option ${optIdx} contains parenthetical drug leak: "${opt}"`
          );
        });
      }
    });
  });

  await t.test('verifies Drag & Drop matching matrix schemas on Page 3', () => {
    const page3Questions = moduleData.pages[2].sections?.[0].questions || [];
    const matchingQuestions = page3Questions.filter((q: any) => q.type === 'matching');
    
    assert.ok(matchingQuestions.length >= 2, `Page 3 must have at least 2 matching questions, got ${matchingQuestions.length}`);

    // Verify Question 8 (Chemical Classes matching)
    const chemClassQ = matchingQuestions[0];
    assert.equal(chemClassQ.questionNumberLabel, 'Question 8');
    assert.ok(chemClassQ.matchingTargets && chemClassQ.matchingTargets.length === 6, 'Should have 6 chemical class targets');
    assert.ok(chemClassQ.structuresDisplayed && chemClassQ.structuresDisplayed.length === 6, 'Should have 6 structures displayed (I-VI)');

    // Verify Question 9 (MOA matching)
    const moaQ = matchingQuestions[1];
    assert.equal(moaQ.questionNumberLabel, 'Question 9');
    assert.ok(moaQ.matchingTargets && moaQ.matchingTargets.length === 5, 'Should have 5 MOA targets');
    assert.ok(moaQ.structuresDisplayed && moaQ.structuresDisplayed.length === 6, 'Should have 6 structures displayed (I-VI)');

    // Check targets formatting
    matchingQuestions.forEach((q: any) => {
      q.matchingTargets.forEach((target: MatchingTarget, index: number) => {
        const bullet = formatTargetBullet(target.id, index);
        assert.match(bullet, /^[a-z]$/, `Target bullet must be a single lowercase letter, got "${bullet}" in Q${q.id}`);
      });
      q.structuresDisplayed.forEach((str: ChemicalStructure, sIdx: number) => {
        const roman = extractRomanOrShortLabel(str, sIdx);
        assert.match(roman, /^[IVXLCDM]+$/i, `Structure label must be clean Roman numeral, got "${roman}" in Q${q.id}`);
        assert.doesNotMatch(roman, /[()]/, `Structure label must not contain parentheses in Q${q.id}`);
      });
    });
  });

  await t.test('verifies all structures displayed have valid SMILES and labels', () => {
    moduleData.pages.forEach((page, pIdx) => {
      page.sections?.forEach(sec => {
        sec.structures?.forEach(str => {
          assert.ok(str.id, `Structure in Page ${pIdx + 1} must have id`);
          assert.ok(str.name, `Structure ${str.id} must have name`);
          assert.ok(str.smiles || str.canonicalSmiles, `Structure ${str.id} must have SMILES`);
        });
      });
    });
  });
});
