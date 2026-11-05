/**
 * Utility to dynamically mask chemical drug names and trade names with their assigned
 * Roman numerals or document labels during Exam Mode.
 *
 * Keeps the underlying database and LLM outputs strictly grounded in clinical truth,
 * while deterministically redacting identities on the client UI at render time.
 */

export interface MaskableStructure {
  name: string;
  tradeName?: string;
  document_label?: string;
  id?: string;
}

/**
 * Escapes special regex characters in a string.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Dynamically masks drug names and trade names in text using assigned Roman numerals.
 *
 * @param text - The raw text containing clinical drug names (stem, options, sub-statements).
 * @param structures - The candidate chemical structures with assigned Roman numerals / labels.
 * @param isExamMode - Whether exam mode is currently active. If false, returns original text unchanged.
 * @returns The masked text in exam mode, or the verbatim original text otherwise.
 */
export function maskDrugNamesForExam(
  text: string,
  structures: MaskableStructure[] | undefined | null,
  isExamMode: boolean
): string {
  if (!text || typeof text !== 'string') {
    return text || '';
  }

  if (!isExamMode || !structures || !Array.isArray(structures) || structures.length === 0) {
    return text;
  }

  let result = text;

  // Sort by drug name length descending so longer drug names match before shorter substrings
  const sorted = [...structures].sort(
    (a, b) => (b.name?.length || 0) - (a.name?.length || 0)
  );

  for (const str of sorted) {
    if (!str.name || str.name.trim().length === 0) continue;

    const rawLabel = (str.document_label || str.id || '').trim();
    // Normalize Roman numeral / label: remove existing brackets and "Structure" prefix if present
    const cleanLabel = rawLabel.replace(/^\[?|\s*\]?$/g, '').replace(/^(Structure|Drug|Compound)\s*/i, '').trim();
    const replacement = cleanLabel ? `[Structure ${cleanLabel}]` : '[Structure]';

    // 1. Mask generic drug name using case-insensitive word-boundary replaceAll
    const escapedName = escapeRegex(str.name.trim());
    try {
      const rx = new RegExp(`\\b${escapedName}\\b`, 'gi');
      result = result.replaceAll(rx, replacement);
    } catch {
      result = result.replaceAll(str.name, replacement);
    }

    // 2. Mask trade/brand name if available
    if (str.tradeName && str.tradeName.trim().length > 0) {
      const escapedTrade = escapeRegex(str.tradeName.trim());
      try {
        const rxTrade = new RegExp(`\\b${escapedTrade}\\b`, 'gi');
        result = result.replaceAll(rxTrade, replacement);
      } catch {
        result = result.replaceAll(str.tradeName, replacement);
      }
    }
  }

  return result;
}
