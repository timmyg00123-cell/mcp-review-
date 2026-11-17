import type { TopDrugClinicalMonograph } from '../data/clinical/types.js';

const NON_INDICATION_TERMS: readonly string[] = [
  'renal impairment',
  'hepatic impairment',
  'geriatric',
  'pediatric',
  'initial',
  'maintenance',
  'crcl',
  'dialysis',
  'dose adjustment',
  'administration',
  'overdose',
];

/**
 * Sanitizes and cleans up indication label strings, removing trailing qualifiers
 * such as "monotherapy" and standardizing capitalization.
 */
function cleanIndicationLabel(raw: string): string {
  let cleaned = raw.trim();

  // Strip trailing or isolated qualifiers like "(monotherapy)" or "monotherapy"
  cleaned = cleaned.replace(/\(\s*monotherapy\s*\)/gi, '');
  cleaned = cleaned.replace(/\bmonotherapy\b/gi, '');

  // Strip trailing punctuation artifacts left over
  cleaned = cleaned.replace(/[-–—,:;]+$/g, '').trim();
  cleaned = cleaned.replace(/\s+/g, ' ');

  // Standardize capitalization (first character uppercase)
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}

/**
 * Derives a clean disease or therapy label from a therapeuticClass string
 * e.g. "11. Cardiovascular --- Antihypertensive" -> ["Antihypertensive"]
 * e.g. "1. Analgesic" -> ["Analgesic"]
 */
function deriveIndicationsFromTherapeuticClass(therapeuticClass?: string): string[] {
  if (!therapeuticClass || typeof therapeuticClass !== 'string') {
    return [];
  }

  // Strip leading numbering, e.g. "11. " or "1. "
  let cleaned = therapeuticClass.replace(/^\s*\d+\.\s*/, '').trim();
  if (!cleaned) {
    return [];
  }

  // Split category hierarchy if separator exists (e.g. "---", "—", "--", " - ")
  if (
    cleaned.includes('---') ||
    cleaned.includes('—') ||
    cleaned.includes('--') ||
    cleaned.includes(' - ')
  ) {
    const parts = cleaned
      .split(/\s*(?:---|--|—|\s-\s)\s*/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1];
      // If the last part is a route/form like "Oral" or "Injectable/Insulin Product", prefer the primary class in parts[0]
      if (/^(oral|injectable.*|topical.*)$/i.test(lastPart)) {
        cleaned = parts[0];
      } else {
        cleaned = lastPart;
      }
    } else if (parts.length === 1) {
      cleaned = parts[0];
    }
  }

  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    return [cleaned];
  }

  return [];
}

/**
 * Resolves high-yield clinical indications for a given monograph.
 *
 * Evaluation order:
 * 1. Explicit `indications` array on monograph (if present and non-empty).
 * 2. Extracted indication headers from `dosingRegimens` (Array of "Indication: dosage" strings or Record<Indication, dosage>),
 *    filtering out non-indication headings (renal/hepatic impairment, geriatric, pediatric, etc.)
 *    and stripping trailing qualifiers like "monotherapy".
 * 3. Fallback to clean disease/therapy labels derived from `monograph.therapeuticClass`.
 */
export function resolveClinicalIndications(
  monograph: TopDrugClinicalMonograph | Partial<TopDrugClinicalMonograph>
): string[] {
  if (!monograph || typeof monograph !== 'object') {
    return [];
  }

  // 1. Explicit indications property
  const explicit = (monograph as { indications?: unknown }).indications;
  if (Array.isArray(explicit) && explicit.length > 0) {
    const sanitized = explicit
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .map((item) => cleanIndicationLabel(item))
      .filter((item) => item.length > 0);

    const deduped: string[] = [];
    const seen = new Set<string>();
    for (const item of sanitized) {
      const lower = item.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        deduped.push(item);
      }
    }

    if (deduped.length > 0) {
      return deduped;
    }
  }

  // 2. Extract from dosingRegimens
  const dosing = monograph.dosingRegimens;
  const rawCandidates: string[] = [];

  if (Array.isArray(dosing)) {
    for (const entry of dosing) {
      if (typeof entry === 'string') {
        const trimmed = entry.trim();
        if (trimmed.includes(':')) {
          rawCandidates.push(trimmed.split(':')[0].trim());
        } else if (
          trimmed.length > 0 &&
          trimmed.length <= 60 &&
          !/^(initiate|start|limit|administer|take|give|avoid|monitor)\b/i.test(trimmed)
        ) {
          rawCandidates.push(trimmed);
        }
      }
    }
  } else if (dosing && typeof dosing === 'object') {
    for (const key of Object.keys(dosing)) {
      if (typeof key === 'string') {
        const trimmed = key.trim();
        if (trimmed.includes(':')) {
          rawCandidates.push(trimmed.split(':')[0].trim());
        } else {
          rawCandidates.push(trimmed);
        }
      }
    }
  }

  // 3. Filter non-indication headings and clean qualifiers
  const extractedIndications: string[] = [];
  const seenIndications = new Set<string>();

  for (const raw of rawCandidates) {
    const lower = raw.toLowerCase();
    const isNonIndication = NON_INDICATION_TERMS.some((term) => lower.includes(term));
    if (isNonIndication) {
      continue;
    }

    const cleaned = cleanIndicationLabel(raw);
    if (!cleaned) {
      continue;
    }

    const cleanedLower = cleaned.toLowerCase();
    if (!seenIndications.has(cleanedLower)) {
      seenIndications.add(cleanedLower);
      extractedIndications.push(cleaned);
    }
  }

  if (extractedIndications.length > 0) {
    return extractedIndications;
  }

  // 4. Fallback to therapeuticClass
  return deriveIndicationsFromTherapeuticClass(monograph.therapeuticClass);
}
