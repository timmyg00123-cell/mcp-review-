import { ChemicalStructure, PharmacophoreGroup } from '../types/reviewModule';
import { resolvePharmacophoreRegion } from './pharmacophoreData';

export const ROMAN_NUMERALS_LIST = [
  'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
  'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV'
];

const ROMAN_MAP: Record<string, number> = {
  'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
  'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
  'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14, 'XV': 15,
  'XVI': 16, 'XVII': 17, 'XVIII': 18, 'XIX': 19, 'XX': 20,
  'XXI': 21, 'XXII': 22, 'XXIII': 23, 'XXIV': 24, 'XXV': 25,
};

/**
 * Parses numeric sorting rank for Roman numerals, numbers, or letters.
 * Preserves document numbering order without sorting alphabetically by name.
 */
export function parseDocumentLabelRank(label?: string | null): number {
  if (!label) return 9999;
  const cleaned = String(label)
    .trim()
    .toUpperCase()
    .replace(/^(STRUCTURE|COMPOUND|DRUG|MOLECULE)\s*/i, '')
    .trim();

  if (ROMAN_MAP[cleaned] !== undefined) {
    return ROMAN_MAP[cleaned];
  }

  const num = parseInt(cleaned, 10);
  if (!isNaN(num) && num > 0) {
    return num;
  }

  // Letters A, B, C...
  if (/^[A-Z]$/.test(cleaned)) {
    return cleaned.charCodeAt(0) - 64; // A=1, B=2
  }

  return 9999;
}

/**
 * Returns the exact document label, falling back to structure.id or fallbackIndex.
 */
export function getStructureDocumentLabel(
  structure?: { id?: string; document_label?: string } | null,
  fallbackIndex?: number
): string {
  if (!structure) {
    return fallbackIndex !== undefined ? (ROMAN_NUMERALS_LIST[fallbackIndex] || String(fallbackIndex + 1)) : '';
  }
  if (structure.document_label && structure.document_label.trim()) {
    return structure.document_label.trim();
  }
  if (structure.id && structure.id.trim()) {
    return structure.id.trim();
  }
  return fallbackIndex !== undefined ? (ROMAN_NUMERALS_LIST[fallbackIndex] || String(fallbackIndex + 1)) : '';
}

/**
 * Sorts structures strictly by their document_label (or id), preserving original extraction order on ties.
 * Strictly avoids alphabetical sorting by drug name.
 */
export function sortStructuresByDocumentLabel<T extends { id?: string; document_label?: string }>(
  structures: T[]
): T[] {
  return [...structures].sort((a, b) => {
    const rankA = parseDocumentLabelRank(a.document_label || a.id);
    const rankB = parseDocumentLabelRank(b.document_label || b.id);
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    return 0; // Preserve exact extraction order
  });
}

/**
 * Ensures SAR rationale is strictly a concise single-paragraph text (max 2-3 sentences).
 * Strips any multi-paragraph redundant concatenations (e.g. from repeated chunk merges).
 */
export function cleanSingleParagraphSar(text?: string | null): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (!trimmed) return '';

  // If text contains multiple paragraphs separated by double newlines or blank lines
  if (trimmed.includes('\n\n') || trimmed.includes('\r\n\r\n')) {
    const paragraphs = trimmed
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (paragraphs.length > 0) {
      // Find the richest, most detailed single paragraph
      const richest = paragraphs.reduce(
        (best, curr) => (curr.length > best.length ? curr : best),
        paragraphs[0]
      );
      return richest.replace(/\r?\n+/g, ' ').trim();
    }
  }

  // Flatten single line breaks into clean prose
  return trimmed.replace(/\r?\n+/g, ' ').trim();
}

export const cleanSingleParagraphMoa = cleanSingleParagraphSar;

/**
 * Filters out generic placeholder names for pharmacophores.
 * Banned: "DRUG Core", "Main Scaffold", "Active Moiety", etc.
 */
export function filterValidPharmacophores(pharmacophores?: PharmacophoreGroup[] | null): PharmacophoreGroup[] {
  if (!Array.isArray(pharmacophores)) return [];
  const bannedKeywords = ['drug core', 'main scaffold', 'active moiety', 'generic core', 'core scaffold'];
  const valid = pharmacophores.filter((p) => {
    if (!p) return false;
    const nameLower = (p.name || '').trim().toLowerCase();
    const idLower = (p.id || '').trim().toLowerCase();
    return !bannedKeywords.some((banned) => nameLower.includes(banned) || idLower.includes(banned));
  });

  return valid.map((p, idx) => {
    const name = p.name || `Pharmacophore ${idx + 1}`;
    const id = p.id || `pg_${idx}_${name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
    const purpose = p.purpose || p.description || `Functional group in structure contributing to pharmacological activity and receptor interaction.`;
    const description = p.description || p.purpose || purpose;
    return {
      ...p,
      id,
      name,
      purpose,
      description,
      smarts: p.smarts || undefined,
      region: p.region || resolvePharmacophoreRegion(p, idx, valid.length),
    };
  });
}
