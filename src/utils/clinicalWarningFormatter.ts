/**
 * Utility for formatting and summarizing clinical safety warnings, adverse reactions,
 * and contraindications into high-yield, scannable study bullet points.
 * Caps verbose multi-paragraph FDA label data to a clean maximum (default 5 items)
 * without losing access to complete package inserts.
 */

export interface FormattedClinicalWarnings {
  items: string[];
  isTruncated: boolean;
  totalCount: number;
  rawText: string;
}

const BOILERPLATE_PREFIX_REGEX = /^(adverse reactions?|contraindications?|warnings and precautions?|boxed warning|most common adverse reactions?|highlights of prescribing information|boxed warning:)\s*:?\s*/i;

export function formatClinicalWarnings(
  warnings: string | string[] | undefined | null,
  maxItems = 5
): FormattedClinicalWarnings {
  if (!warnings) {
    return {
      items: [],
      isTruncated: false,
      totalCount: 0,
      rawText: '',
    };
  }

  let rawText = '';
  let candidates: string[] = [];

  if (Array.isArray(warnings)) {
    rawText = warnings.join('; ');
    candidates = warnings
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item) => item.length > 0);
  } else if (typeof warnings === 'string') {
    rawText = warnings.trim();
    if (!rawText) {
      return {
        items: [],
        isTruncated: false,
        totalCount: 0,
        rawText: '',
      };
    }

    // Replace pipe separators with newlines for uniform splitting
    const normalized = rawText
      .replace(/\s*\|\s*/g, '\n')
      .replace(/\r\n/g, '\n');

    // Split on bullet points, newlines, or numbered lists
    const rawChunks = normalized.split(/(?:\n+|•|\b\d+\.\s+|[-*]\s+)/g);

    for (const chunk of rawChunks) {
      const trimmed = chunk.trim();
      if (!trimmed) continue;

      // If chunk is still long and contains semicolons or period-separated sentences, split further
      if (trimmed.includes(';') || trimmed.length > 120) {
        const subChunks = trimmed.split(/(?:;\s*|\.\s+(?=[A-Z]))/g);
        for (const sub of subChunks) {
          const subTrimmed = sub.trim().replace(/\.$/, '');
          if (subTrimmed.length > 2) {
            candidates.push(subTrimmed);
          }
        }
      } else {
        candidates.push(trimmed.replace(/\.$/, ''));
      }
    }
  }

  // Clean boilerplate prefixes and deduplicate
  const cleaned: string[] = [];
  const seen = new Set<string>();

  for (const item of candidates) {
    let cleanedItem = item.replace(BOILERPLATE_PREFIX_REGEX, '').trim();
    // Capitalize first letter
    if (cleanedItem.length > 0) {
      cleanedItem = cleanedItem.charAt(0).toUpperCase() + cleanedItem.slice(1);
    }

    const lower = cleanedItem.toLowerCase();
    if (
      cleanedItem.length >= 3 &&
      !seen.has(lower) &&
      !lower.startsWith('see full prescribing') &&
      !lower.startsWith('refer to section')
    ) {
      seen.add(lower);
      cleaned.push(cleanedItem);
    }
  }

  const totalCount = cleaned.length;
  const isTruncated = totalCount > maxItems;
  const items = isTruncated ? cleaned.slice(0, maxItems) : cleaned;

  return {
    items,
    isTruncated,
    totalCount,
    rawText,
  };
}
