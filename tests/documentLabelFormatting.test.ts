import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  extractRomanOrShortLabel,
  formatTargetBullet,
} from '../src/utils/documentLabel';

describe('documentLabelFormatting utilities', () => {
  it('extracts pure Roman numerals from complex structure labels', () => {
    assert.strictEqual(
      extractRomanOrShortLabel({ document_label: 'Structure IV (Acetazolamide)' }),
      'IV'
    );
    assert.strictEqual(
      extractRomanOrShortLabel({ document_label: 'Structure III (Hydrochlorothiazide)' }),
      'III'
    );
    assert.strictEqual(
      extractRomanOrShortLabel({ document_label: 'Structure I (Amiloride)' }),
      'I'
    );
    assert.strictEqual(
      extractRomanOrShortLabel({ document_label: 'Structure II' }),
      'II'
    );
    assert.strictEqual(
      extractRomanOrShortLabel({ document_label: 'Structure V (Mannitol)' }),
      'V'
    );
    assert.strictEqual(
      extractRomanOrShortLabel({ id: 'Structure VII (Norepinephrine)' }),
      'VII'
    );
    assert.strictEqual(
      extractRomanOrShortLabel({ id: 'I', name: 'Tirofiban' }),
      'I'
    );
  });

  it('extracts drug letters when letter-based labeling is used', () => {
    assert.strictEqual(
      extractRomanOrShortLabel({ document_label: 'Drug B (Hydrocortisone)' }),
      'B'
    );
    assert.strictEqual(
      extractRomanOrShortLabel({ document_label: 'Drug A (Theophylline)' }),
      'A'
    );
  });

  it('uses fallbackIndex properly when structure is null or lacks a label', () => {
    assert.strictEqual(extractRomanOrShortLabel(null, 2), 'III');
    assert.strictEqual(extractRomanOrShortLabel(undefined, 0), 'I');
    assert.strictEqual(extractRomanOrShortLabel({ id: '' }, 3), 'IV');
  });

  it('formats target bullets cleanly into single letters without internal slugs', () => {
    assert.strictEqual(formatTargetBullet('target-chem-amiloride', 0), 'a');
    assert.strictEqual(formatTargetBullet('target-chem-furosemide', 1), 'b');
    assert.strictEqual(formatTargetBullet('target_anoro', 2), 'c');
    assert.strictEqual(formatTargetBullet('target-acidbase-base', 3), 'd');
    assert.strictEqual(formatTargetBullet('a', 0), 'a');
    assert.strictEqual(formatTargetBullet('b', 1), 'b');
    assert.strictEqual(formatTargetBullet(undefined, 3), 'd');
  });
});
