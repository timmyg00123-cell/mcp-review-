import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractRomanOrShortLabel,
  formatTargetBullet,
} from '../src/utils/documentLabel';
import { getRenalReviewPages } from '../src/data/renalReviewModuleData';
import { getRespiratoryReviewPages } from '../src/data/respiratoryReviewModuleData';
import { getAntiarrhythmicModuleData, getAntiarrhythmicReviewPages } from '../src/data/antiarrhythmicModuleData';
import { getDefaultDiureticsModule } from '../src/data/exam2/diureticsModuleData';
import { antiplateletQuizData } from '../src/data/antiplateletQuizData';
import {
  AntiplateletQuestion,
  ReviewPage,
  MatchingTarget,
  ChemicalStructure,
} from '../src/types/reviewModule';

function getAllQuestionsFromPages(pages: ReviewPage[]): AntiplateletQuestion[] {
  const result: AntiplateletQuestion[] = [];
  for (const page of pages) {
    if (page.sections) {
      for (const sec of page.sections) {
        if (sec.questions) {
          result.push(...sec.questions);
        }
      }
    }
    if ((page as any).questions) {
      result.push(...(page as any).questions);
    }
  }
  return result;
}

test('audits Exam 1 Renal Review matching questions for clean target bullets and Roman labels', () => {
  const allQuestions = getAllQuestionsFromPages(getRenalReviewPages());
  const matchingQuestions = allQuestions.filter(
    (q) => q.type === 'matching' && q.matchingTargets && q.matchingTargets.length > 0
  );

  assert.ok(
    matchingQuestions.length >= 4,
    `Expected at least 4 matching questions in Renal, found ${matchingQuestions.length}`
  );

  for (const q of matchingQuestions) {
    assert.ok(q.matchingTargets && q.matchingTargets.length > 0);
    q.matchingTargets.forEach((target: MatchingTarget, index: number) => {
      const bullet = formatTargetBullet(target.id, index);
      assert.match(
        bullet,
        /^[a-z]$/,
        `Target bullet should be a single lowercase letter, got "${bullet}" for id "${target.id}" in Q${q.id}`
      );
      assert.doesNotMatch(
        bullet,
        /target[-_]|chem[-_]/i,
        `Target bullet should never contain raw prefixes, got "${bullet}" in Q${q.id}`
      );
    });

    if (q.structuresDisplayed && q.structuresDisplayed.length > 0) {
      q.structuresDisplayed.forEach((str: ChemicalStructure, sIdx: number) => {
        const roman = extractRomanOrShortLabel(str, sIdx);
        assert.match(
          roman,
          /^[IVXLCDM]+$/i,
          `Structure label should extract clean Roman numeral, got "${roman}" for label "${str.document_label || (str as any).label || str.id}" in Q${q.id}`
        );
        assert.doesNotMatch(
          roman,
          /[()]/,
          `Structure label should not contain drug name parentheses, got "${roman}" in Q${q.id}`
        );
      });
    }
  }
});

test('audits Exam 1 Respiratory Review matching questions for clean target bullets and Roman labels', () => {
  const allQuestions = getAllQuestionsFromPages(getRespiratoryReviewPages());
  const matchingQuestions = allQuestions.filter(
    (q) => q.type === 'matching' && q.matchingTargets && q.matchingTargets.length > 0
  );

  assert.ok(
    matchingQuestions.length >= 3,
    `Expected at least 3 matching questions in Respiratory, found ${matchingQuestions.length}`
  );

  for (const q of matchingQuestions) {
    assert.ok(q.matchingTargets && q.matchingTargets.length > 0);
    q.matchingTargets.forEach((target: MatchingTarget, index: number) => {
      const bullet = formatTargetBullet(target.id, index);
      assert.match(
        bullet,
        /^[a-z]$/,
        `Target bullet should be a single lowercase letter, got "${bullet}" for id "${target.id}" in Q${q.id}`
      );
      assert.doesNotMatch(
        bullet,
        /target[-_]|chem[-_]/i,
        `Target bullet should never contain raw prefixes, got "${bullet}" in Q${q.id}`
      );
    });

    if (q.structuresDisplayed && q.structuresDisplayed.length > 0) {
      q.structuresDisplayed.forEach((str: ChemicalStructure, sIdx: number) => {
        const roman = extractRomanOrShortLabel(str, sIdx);
        assert.match(
          roman,
          /^[IVXLCDM]+$/i,
          `Structure label should extract clean Roman numeral, got "${roman}" for label "${str.document_label || (str as any).label || str.id}" in Q${q.id}`
        );
        assert.doesNotMatch(
          roman,
          /[()]/,
          `Structure label should not contain drug name parentheses, got "${roman}" in Q${q.id}`
        );
      });
    }
  }
});

test('audits Exam 2 Antiarrhythmic Review matching questions for clean target bullets and Roman labels', () => {
  const allQuestions = getAllQuestionsFromPages(getAntiarrhythmicReviewPages());
  const matchingQuestions = allQuestions.filter(
    (q) => q.type === 'matching' && q.matchingTargets && q.matchingTargets.length > 0
  );

  assert.ok(
    matchingQuestions.length >= 1,
    `Expected at least 1 matching question in Antiarrhythmics, found ${matchingQuestions.length}`
  );

  for (const q of matchingQuestions) {
    assert.ok(q.matchingTargets && q.matchingTargets.length > 0);
    q.matchingTargets.forEach((target: MatchingTarget, index: number) => {
      const bullet = formatTargetBullet(target.id, index);
      assert.match(
        bullet,
        /^[a-z]$/,
        `Target bullet should be a single lowercase letter, got "${bullet}" for id "${target.id}" in Q${q.id}`
      );
      assert.doesNotMatch(
        bullet,
        /target[-_]/i,
        `Target bullet should never contain raw prefixes, got "${bullet}" in Q${q.id}`
      );
    });

    if (q.structuresDisplayed && q.structuresDisplayed.length > 0) {
      q.structuresDisplayed.forEach((str: ChemicalStructure, sIdx: number) => {
        const roman = extractRomanOrShortLabel(str, sIdx);
        assert.match(
          roman,
          /^[IVXLCDM]+$/i,
          `Structure label should extract clean Roman numeral, got "${roman}" for label "${str.document_label || (str as any).label || str.id}" in Q${q.id}`
        );
        assert.doesNotMatch(
          roman,
          /[()]/,
          `Structure label should not contain drug name parentheses, got "${roman}" in Q${q.id}`
        );
      });
    }
  }
});

test('audits Exam 2 Diuretics Review matching questions for clean target bullets and Roman labels', () => {
  const allQuestions = getAllQuestionsFromPages(getDefaultDiureticsModule().pages);
  const matchingQuestions = allQuestions.filter(
    (q) => q.type === 'matching' && q.matchingTargets && q.matchingTargets.length > 0
  );

  assert.ok(
    matchingQuestions.length >= 2,
    `Expected at least 2 matching questions in Diuretics, found ${matchingQuestions.length}`
  );

  for (const q of matchingQuestions) {
    assert.ok(q.matchingTargets && q.matchingTargets.length > 0);
    q.matchingTargets.forEach((target: MatchingTarget, index: number) => {
      const bullet = formatTargetBullet(target.id, index);
      assert.match(
        bullet,
        /^[a-z]$/,
        `Target bullet should be a single lowercase letter, got "${bullet}" for id "${target.id}" in Q${q.id}`
      );
      assert.doesNotMatch(
        bullet,
        /target[-_]/i,
        `Target bullet should never contain raw prefixes, got "${bullet}" in Q${q.id}`
      );
    });

    if (q.structuresDisplayed && q.structuresDisplayed.length > 0) {
      q.structuresDisplayed.forEach((str: ChemicalStructure, sIdx: number) => {
        const roman = extractRomanOrShortLabel(str, sIdx);
        assert.match(
          roman,
          /^[IVXLCDM]+$/i,
          `Structure label should extract clean Roman numeral, got "${roman}" for label "${str.document_label || (str as any).label || str.id}" in Q${q.id}`
        );
        assert.doesNotMatch(
          roman,
          /[()]/,
          `Structure label should not contain drug name parentheses, got "${roman}" in Q${q.id}`
        );
      });
    }
  }
});

test('audits Exam 2 Antiplatelet Review matching questions for clean target bullets and Roman labels', () => {
  const matchingQuestions = antiplateletQuizData.filter(
    (q) => q.type === 'matching' && q.matchingTargets && q.matchingTargets.length > 0
  );

  assert.ok(
    matchingQuestions.length >= 5,
    `Expected at least 5 matching questions in Antiplatelets, found ${matchingQuestions.length}`
  );

  for (const q of matchingQuestions) {
    assert.ok(q.matchingTargets && q.matchingTargets.length > 0);
    q.matchingTargets.forEach((target: MatchingTarget, index: number) => {
      const bullet = formatTargetBullet(target.id, index);
      assert.match(
        bullet,
        /^[a-z]$/,
        `Target bullet should be a single lowercase letter, got "${bullet}" for id "${target.id}" in Q${q.id}`
      );
      assert.doesNotMatch(
        bullet,
        /target[-_]/i,
        `Target bullet should never contain raw prefixes, got "${bullet}" in Q${q.id}`
      );
    });

    if (q.structuresDisplayed && q.structuresDisplayed.length > 0) {
      q.structuresDisplayed.forEach((str: ChemicalStructure, sIdx: number) => {
        const roman = extractRomanOrShortLabel(str, sIdx);
        assert.match(
          roman,
          /^[IVXLCDM]+|[A-Z]|\d+$/i,
          `Structure label should be clean short symbol, got "${roman}" for label "${str.document_label || (str as any).label || str.id}" in Q${q.id}`
        );
        assert.doesNotMatch(
          roman,
          /[()]/,
          `Structure label should not contain drug name parentheses, got "${roman}" in Q${q.id}`
        );
      });
    }
  }
});

test('handles bloated structure labels and raw IDs cleanly in edge cases', () => {
  assert.equal(
    extractRomanOrShortLabel({ id: 'chem-furosemide', label: 'Structure II (Furosemide)' }, 1),
    'II'
  );
  assert.equal(
    extractRomanOrShortLabel({ id: 'chem-hctz', label: 'Structure III (Hydrochlorothiazide)' }, 2),
    'III'
  );
  assert.equal(
    extractRomanOrShortLabel({ id: 'target-chem-amiloride' }, 0),
    'I'
  );
  assert.equal(
    formatTargetBullet('target-chem-amiloride', 0),
    'a'
  );
  assert.equal(
    formatTargetBullet('target-chem-furosemide', 1),
    'b'
  );
  assert.equal(
    formatTargetBullet('target_anoro', 2),
    'c'
  );
  assert.equal(
    formatTargetBullet('d', 3),
    'd'
  );
  assert.equal(
    formatTargetBullet('E', 4),
    'e'
  );
});
