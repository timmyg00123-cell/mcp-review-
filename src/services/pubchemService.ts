import { ChemData, medChemGraphDb } from '../db/medChemGraphDb';

/**
 * Common pharmaceutical salt, counter-ion, and solvate suffixes to strip
 * when a direct name lookup in PubChem returns 404.
 */
export const COMMON_SALT_SUFFIXES = [
  'succinate',
  'bisulfate',
  'bisulphate',
  'sulfate',
  'sulphate',
  'hydrochloride',
  'dihydrochloride',
  'monohydrochloride',
  'hcl',
  'mesylate',
  'methanesulfonate',
  'maleate',
  'fumarate',
  'tartrate',
  'bitartrate',
  'citrate',
  'acetate',
  'phosphate',
  'diphosphate',
  'tosylate',
  'besylate',
  'propionate',
  'benzoate',
  'gluconate',
  'lactate',
  'valerate',
  'monohydrate',
  'dihydrate',
  'trihydrate',
  'hydrate',
  'sodium',
  'disodium',
  'potassium',
  'calcium',
  'magnesium',
  'tromethamine',
];

/**
 * Descriptors commonly present in lecture slides and pharmacology literature
 * that should be stripped to resolve metabolite and scaffold lookups.
 */
export const METABOLITE_DESCRIPTORS = [
  'phenolic',
  'active',
  'inactive',
  'thiol',
  'moiety',
  'metabolite',
  'metabolites',
  'intermediate',
  'intermediates',
  'derivative',
  'derivatives',
  'prodrug',
  'species',
  'form',
  'fraction',
  'conjugate',
  'conjugates',
];

/**
 * Common conjugation/metabolite suffixes stripped when extracting
 * the parent molecule root scaffold.
 */
export const CONJUGATION_SUFFIXES = [
  'glucuronide',
  'glucuronides',
  'sulfate',
  'sulphate',
  'carboxylate',
  'carboxylic acid',
  'lactone',
  'hydroxy acid',
  'hydroxylate',
  'hydroxide',
  'n-oxide',
  's-oxide',
  'oxide',
  'glutathione',
  'mercapturate',
  'mercapturic acid',
  'conjugate',
];

/**
 * Common non-compound terms (beverages, foods, body fluids, disease states, generic slide headings)
 * that must never trigger PubChem network queries or be displayed as 2D chemical structure cards.
 */
export const NON_COMPOUND_KEYWORDS = [
  'juice',
  'grapefruit',
  'beverage',
  'drink',
  'tea',
  'coffee',
  'food',
  'meal',
  'dietary',
  'fiber',
  'urine',
  'plasma',
  'serum',
  'blood',
  'bile',
  'feces',
  'saliva',
  'syndrome',
  'disease',
  'disorder',
  'condition',
  'symptom',
  'toxicity',
  'extract',
  'active metabolite',
  'inactive metabolite',
  'major metabolite',
  'minor metabolite',
  'primary metabolite',
];

/**
 * Checks whether an entity name or ID matches non-compound clinical or food terms.
 */
export function isNonCompoundEntity(nameOrId: string): boolean {
  if (!nameOrId || typeof nameOrId !== 'string') return true;
  const lower = nameOrId.trim().toLowerCase();
  if (!lower) return true;

  for (const kw of NON_COMPOUND_KEYWORDS) {
    const rx = new RegExp(`(?:^|[\\s_-])${kw}(?:$|[\\s_-])`, 'i');
    if (rx.test(lower)) {
      return true;
    }
  }

  // Catch generic phrases like "active metabolite", "inactive metabolite", etc.
  if (/^(active|inactive|major|minor|primary|toxic)\s+metabolite$/i.test(lower)) {
    return true;
  }

  return false;
}

/**
 * Detects placeholder labels in lecture slides or worksheets that should not be queried
 * against NIH PubChem (e.g., "Antihyperlipidemic Drug A", "Compound B", "Structure I", etc.).
 */
export function isPlaceholderLabel(name: string): boolean {
  if (!name || typeof name !== 'string') return true;
  if (isNonCompoundEntity(name)) return true;
  const trimmed = name.trim().replace(/^[\(\[\{]+|[\)\]\}]+$/g, '').trim();
  if (!trimmed) return true;

  // e.g. "Antihyperlipidemic Drug A", "Antiplatelet Drug B", "Compound C", "Structure IV", "Drug 2"
  const placeholderRegex =
    /^(?:(?:Antihyperlipidemic|Antiplatelet|Antihypertensive|Anticoagulant|Cardiovascular|Pharmacological|Investigational|Candidate|Test)\s+)?(?:Drug|Compound|Structure|Agent|Molecule|Entity|Sample)\s+(?:[A-Z0-9]+|[IVXLCDM]+)$/i;
  if (placeholderRegex.test(trimmed)) return true;

  // Pure single letters or Roman numerals e.g. "Structure I", "Structure A", "I", "IV", "Drug A"
  const romanOrLetter = /^(?:Structure|Compound|Drug|Agent)?\s*[IVXLCDM\d]$/i;
  if (romanOrLetter.test(trimmed)) return true;

  // Generic placeholder text
  if (/^(placeholder|unknown|unnamed|n\/a|none|null|undefined)$/i.test(trimmed)) return true;

  return false;
}

/**
 * Sanitizes chemical labels by stripping outer quotes and leading worksheet prefixes
 * like "Structure I: Tirofiban (Aggrastat)" -> "Tirofiban (Aggrastat)".
 */
export function sanitizeStructureLabel(rawName: string): string {
  let s = (rawName || '').trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  // Strip prefix like "Structure I:", "Structure II -", "Compound A:", "Drug 1:"
  s = s.replace(/^(?:Structure|Compound|Drug|Agent)\s+(?:[IVXLCDM\d]+|[A-Z])\s*[:\-\—]\s*/i, '').trim();
  return s;
}

/**
 * Pre-processing helper that strips common pharmaceutical salt suffixes
 * (e.g., hydrochloride, sodium, succinate, tartrate, maleate) if an initial name lookup returns 404.
 *
 * @param name - The original compound or salt name (e.g. "Metoprolol succinate", "Clopidogrel bisulfate")
 * @returns The stripped base compound name, or null if no salt suffix was found.
 */
export function stripSaltSuffixes(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return null;

  // 1. Remove content inside brackets / parentheses e.g. "Aspirin (acetylsalicylic acid)" -> "Aspirin"
  let base = trimmed
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s*\[[^\]]*\]/g, '')
    .trim();

  // 2. Check suffix match
  for (const salt of COMMON_SALT_SUFFIXES) {
    const regexEnd = new RegExp(`\\s+${salt}$`, 'i');
    if (regexEnd.test(base)) {
      const stripped = base.replace(regexEnd, '').trim();
      if (stripped && stripped.toLowerCase() !== trimmed.toLowerCase()) {
        return stripped;
      }
    }

    const regexStart = new RegExp(`^${salt}\\s+`, 'i');
    if (regexStart.test(base)) {
      const stripped = base.replace(regexStart, '').trim();
      if (stripped && stripped.toLowerCase() !== trimmed.toLowerCase()) {
        return stripped;
      }
    }
  }

  // If parentheses were stripped and resulted in a different name, return that
  if (base && base.toLowerCase() !== trimmed.toLowerCase()) {
    return base;
  }

  return null;
}

/**
 * Strips descriptors like "phenolic", "active", "inactive", "thiol", "moiety", "metabolite"
 * e.g., turns "Ezetimibe Phenolic Glucuronide" into "Ezetimibe Glucuronide",
 * or "Clopidogrel active thiol metabolite" into "Clopidogrel".
 */
export function stripMetaboliteDescriptors(rawName: string): string | null {
  const trimmed = rawName.trim();
  if (!trimmed) return null;

  let s = trimmed;
  for (const d of METABOLITE_DESCRIPTORS) {
    s = s.replace(new RegExp(`(?:^|[\\s_-]+)${d}(?:[\\s_-]+|$)`, 'gi'), ' ');
  }
  s = s.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();

  if (s && s.toLowerCase() !== trimmed.toLowerCase()) {
    return s;
  }
  return null;
}

/**
 * Extracts the parent molecule root by stripping common conjugation suffixes
 * or isolating the primary drug name token (e.g., "Ezetimibe Glucuronide" -> "Ezetimibe",
 * "Morphine-6-glucuronide" -> "Morphine").
 */
export function extractParentMoleculeRoot(rawName: string): string | null {
  const trimmed = rawName.trim();
  if (!trimmed) return null;

  // 1. Remove parenthetical or bracketed notes
  let base = trimmed
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s*\[[^\]]*\]/g, '')
    .trim();

  // 2. Also strip metabolite descriptors first if present
  const descStripped = stripMetaboliteDescriptors(base);
  if (descStripped) base = descStripped;

  // 3. Strip common conjugation / metabolite suffixes (handling optional locant numbers like -6-)
  for (const suffix of CONJUGATION_SUFFIXES) {
    const rx = new RegExp(`[\\s_-]+(?:\\d+['\\w]*-?[\\s_-]*)?${suffix}$`, 'i');
    if (rx.test(base)) {
      const stripped = base.replace(rx, '').trim();
      if (stripped && stripped.toLowerCase() !== trimmed.toLowerCase()) {
        return stripped;
      }
    }
  }

  // 4. If name has multiple words, take the first word as the root candidate
  const words = base.replace(/[_-]+/g, ' ').trim().split(/\s+/);
  if (words.length > 1 && words[0].length >= 3) {
    const candidateRoot = words[0];
    if (candidateRoot.toLowerCase() !== trimmed.toLowerCase()) {
      return candidateRoot;
    }
  }

  return null;
}

/**
 * Generates an ordered list of candidate search names:
 * 1. Sanitized clean name
 * 2. Salt-stripped form (e.g., "Metoprolol succinate" -> "Metoprolol")
 * 3. Descriptors stripped (e.g., "Ezetimibe Phenolic Glucuronide" -> "Ezetimibe Glucuronide")
 * 4. Parent molecule root (e.g., "Ezetimibe Glucuronide" -> "Ezetimibe")
 * 5. Parenthetical and space variations
 */
export function cleanCompoundNameForLookup(rawName: string): string[] {
  const clean = sanitizeStructureLabel(rawName);
  if (!clean || isPlaceholderLabel(clean)) return [];

  const candidates: string[] = [clean];

  // 1. Check stripped salt form
  const strippedSalt = stripSaltSuffixes(clean);
  if (strippedSalt && !candidates.includes(strippedSalt)) {
    candidates.push(strippedSalt);
  }

  // 2. Check descriptor-stripped form
  const strippedDesc = stripMetaboliteDescriptors(clean);
  if (strippedDesc && !candidates.includes(strippedDesc)) {
    candidates.push(strippedDesc);
  }

  // Also descriptor-stripped on salt-stripped form if applicable
  if (strippedSalt) {
    const saltAndDesc = stripMetaboliteDescriptors(strippedSalt);
    if (saltAndDesc && !candidates.includes(saltAndDesc)) {
      candidates.push(saltAndDesc);
    }
  }

  // 3. Fall back to parent molecule root
  const parentRoot = extractParentMoleculeRoot(clean);
  if (parentRoot && !candidates.includes(parentRoot)) {
    candidates.push(parentRoot);
  }

  if (strippedDesc) {
    const descParent = extractParentMoleculeRoot(strippedDesc);
    if (descParent && !candidates.includes(descParent)) {
      candidates.push(descParent);
    }
  }

  // 4. Extract content inside parentheses as an alternative lookup
  const parenMatch = clean.match(/\(([^)]+)\)/);
  if (parenMatch && parenMatch[1].trim()) {
    const insideParen = parenMatch[1].trim();
    if (!candidates.includes(insideParen) && !isPlaceholderLabel(insideParen)) {
      candidates.push(insideParen);
      const parenSalt = stripSaltSuffixes(insideParen);
      if (parenSalt && !candidates.includes(parenSalt)) candidates.push(parenSalt);
      const parenDesc = stripMetaboliteDescriptors(insideParen);
      if (parenDesc && !candidates.includes(parenDesc)) candidates.push(parenDesc);
      const parenRoot = extractParentMoleculeRoot(insideParen);
      if (parenRoot && !candidates.includes(parenRoot)) candidates.push(parenRoot);
    }
  }

  // 5. Replace underscores with spaces if raw id was passed (e.g. "clopidogrel_active_thiol_metabolite")
  if (clean.includes('_')) {
    const spaceVersion = clean.replace(/_+/g, ' ').trim();
    if (!candidates.includes(spaceVersion)) {
      candidates.push(spaceVersion);
      const spaceDesc = stripMetaboliteDescriptors(spaceVersion);
      if (spaceDesc && !candidates.includes(spaceDesc)) candidates.push(spaceDesc);
      const spaceRoot = extractParentMoleculeRoot(spaceVersion);
      if (spaceRoot && !candidates.includes(spaceRoot)) candidates.push(spaceRoot);
    }
  }

  return Array.from(new Set(candidates.filter(Boolean)));
}

/**
 * Rate-limited request queue enforcing a minimum 250ms gap between requests
 * to NIH PUG REST to guarantee <= 4 requests/sec and prevent HTTP 503 errors.
 *
 * Exclusively retries transient codes (429, 503, 504) and network dropouts.
 * Fails fast immediately on HTTP 404 Not Found without retrying or delaying.
 */
export class PubChemRateLimiter {
  private lastRequestTime = 0;
  // Enforce minimum 250ms gap between requests (using 260ms for a conservative safety margin)
  private readonly minIntervalMs = 260;
  private queue: Array<() => Promise<void>> = [];
  private isProcessing = false;

  async schedule<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const res = await this.executeWithRetry(task);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      const elapsed = now - this.lastRequestTime;
      if (elapsed < this.minIntervalMs) {
        await new Promise((r) => setTimeout(r, this.minIntervalMs - elapsed));
      }
      this.lastRequestTime = Date.now();

      const nextTask = this.queue.shift();
      if (nextTask) {
        await nextTask();
      }
    }

    this.isProcessing = false;
  }

  private async executeWithRetry<T>(task: () => Promise<T>, maxRetries = 3): Promise<T> {
    let attempt = 0;
    while (attempt <= maxRetries) {
      try {
        return await task();
      } catch (err: any) {
        const status = err?.status || (err?.response && err.response.status);

        // 1. Do NOT Retry 404 Not Found Errors: Fail-fast immediately without retrying or delaying
        if (status === 404 || String(err?.message || '').includes('404')) {
          throw err;
        }

        // Restrict retries exclusively to transient HTTP codes (429, 503, 504) and network dropouts
        const isTransient =
          status === 429 ||
          status === 503 ||
          status === 504 ||
          String(err?.message || '').includes('429') ||
          String(err?.message || '').includes('503') ||
          String(err?.message || '').includes('504') ||
          err?.name === 'TypeError' ||
          err?.name === 'FetchError' ||
          err?.code === 'ECONNRESET' ||
          err?.code === 'ETIMEDOUT';

        if (isTransient && attempt < maxRetries) {
          attempt++;
          const retryAfterSec = err?.retryAfterSeconds;
          const delay = retryAfterSec ? retryAfterSec * 1000 : Math.pow(2, attempt) * 1000;
          console.warn(
            `[PubChemRateLimiter] Transient error HTTP ${status || err?.name || 'network'}. Backoff delay: ${delay}ms (Attempt ${attempt}/${maxRetries})...`
          );
          await new Promise((r) => setTimeout(r, delay));
        } else {
          throw err;
        }
      }
    }
    throw new Error('PubChemRateLimiter: Maximum retries exceeded');
  }
}

export const pubchemRateLimiter = new PubChemRateLimiter();

// In-flight lookup cache preventing duplicate simultaneous requests across parallel slide batches (Thundering Herd)
const inFlightLookups = new Map<string, Promise<ChemData | null>>();

/**
 * Converts a Response Blob into a Base64 Data URL in both browser and node environments.
 */
export async function responseToBase64DataUrl(res: Response): Promise<string> {
  if (typeof window !== 'undefined' && typeof window.FileReader !== 'undefined') {
    const blob = await res.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } else {
    // Node / Server environment
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get('content-type') || 'image/png';
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  }
}

/**
 * Downloads the 2D compound PNG from PUG REST, converts it to a Base64 DataURL and raw Blob,
 * and returns it so it can be cached offline in IndexedDB without memory bloat.
 *
 * @param cid - PubChem Compound ID
 * @returns Object with structureImageDataUrl and optional structureImageBlob, or empty object on failure.
 */
export async function downloadCompoundStructureImage(
  cid: number
): Promise<{ structureImageDataUrl?: string; structureImageBlob?: Blob }> {
  return pubchemRateLimiter.schedule(async () => {
    const imgUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG?image_size=large`;
    let imgRes = await fetch(imgUrl, { signal: AbortSignal.timeout(8000) });

    // Proxy fallback if direct fetch fails (e.g. browser CORS restrictions)
    if (!imgRes.ok && typeof window !== 'undefined') {
      imgRes = await fetch(`/api/structure-image?cid=${cid}`, { signal: AbortSignal.timeout(8000) });
    }

    if (!imgRes.ok) return {};

    if (typeof window !== 'undefined' && typeof window.FileReader !== 'undefined') {
      const blob = await imgRes.blob();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      return { structureImageDataUrl: dataUrl, structureImageBlob: blob };
    } else {
      const arrayBuffer = await imgRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = imgRes.headers.get('content-type') || 'image/png';
      return { structureImageDataUrl: `data:${contentType};base64,${buffer.toString('base64')}` };
    }
  });
}

/**
 * Fetches chemical properties and 2D structure image for a compound from NIH PubChem PUG REST.
 *
 * Ensured properties:
 * - CanonicalSMILES
 * - IsomericSMILES
 * - IUPACName
 * - MolecularWeight
 * - XLogP
 *
 * Includes in-flight deduplication to prevent duplicate lookups across parallel slide batches.
 */
export async function fetchPubChemCompoundData(
  nameOrCid: string | number
): Promise<ChemData | null> {
  const queryStr = String(nameOrCid).trim();
  if (!queryStr) return null;

  // Detect and skip placeholder labels immediately without network calls
  if (typeof nameOrCid === 'string' && isPlaceholderLabel(queryStr)) {
    console.log(`[PubChemService] Skipping placeholder chemical label: "${queryStr}"`);
    return null;
  }

  const cacheKey = queryStr.toLowerCase();

  // Deduplicate in-flight requests (solves cache stampede when multiple slide batches discover the same drug)
  if (inFlightLookups.has(cacheKey)) {
    return inFlightLookups.get(cacheKey)!;
  }

  const lookupPromise = (async () => {
    try {
      return await executeCompoundLookup(queryStr);
    } finally {
      inFlightLookups.delete(cacheKey);
    }
  })();

  inFlightLookups.set(cacheKey, lookupPromise);
  return lookupPromise;
}

/**
 * Internal compound lookup logic with secondary sanitized queries, metabolite stripping,
 * parent molecule root fallbacks, and 2D image retrieval.
 */
async function executeCompoundLookup(queryStr: string): Promise<ChemData | null> {
  const isNumericCid = /^\d+$/.test(queryStr);

  // If numeric CID, query directly by CID
  if (isNumericCid) {
    const cidNum = parseInt(queryStr, 10);
    return queryPropertiesAndImageByCid(cidNum);
  }

  // Generate candidate list in order of specificity:
  // 1. Raw name (e.g. "Ezetimibe Phenolic Glucuronide")
  // 2. Salt-stripped (e.g. "Metoprolol succinate" -> "Metoprolol")
  // 3. Descriptors stripped (e.g. "Ezetimibe Phenolic Glucuronide" -> "Ezetimibe Glucuronide")
  // 4. Parent molecule root (e.g. "Ezetimibe Glucuronide" -> "Ezetimibe")
  // 5. Parenthetical / space variations
  const candidateNames = cleanCompoundNameForLookup(queryStr);

  let result: ChemData | null = null;

  for (const cand of candidateNames) {
    result = await queryPropertiesByName(cand);
    if (result) {
      if (cand.toLowerCase() !== queryStr.toLowerCase()) {
        console.log(`[PubChemService] Resolved "${queryStr}" via fallback candidate "${cand}" (CID ${result.cid})`);
      }
      break;
    }
  }

  if (result && result.cid) {
    // Download 2D structure image and raw Blob for offline caching
    try {
      const imgData = await downloadCompoundStructureImage(result.cid);
      return {
        ...result,
        structureImageDataUrl: imgData.structureImageDataUrl,
        structureImageBlob: imgData.structureImageBlob,
      };
    } catch (imgErr) {
      console.warn(`[PubChemService] Could not fetch 2D image for CID ${result.cid}:`, imgErr);
    }

    return result;
  }

  // Graceful null resolution: compound could not be found after all fallbacks
  console.warn(`[PubChem] Compound not found, continuing: ${queryStr}`);
  return null;
}

/**
 * Internal helper to query properties by compound name from NIH PUG REST.
 * Fails fast immediately on 404 without retrying or delaying.
 */
async function queryPropertiesByName(name: string): Promise<ChemData | null> {
  try {
    return await pubchemRateLimiter.schedule(async () => {
      const endpoint = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
        name
      )}/property/CanonicalSMILES,IsomericSMILES,IUPACName,MolecularFormula,MolecularWeight,XLogP/JSON`;

      let res: Response;
      try {
        res = await fetch(endpoint, { signal: AbortSignal.timeout(6000) });
      } catch (fetchErr: any) {
        if (typeof window !== 'undefined') {
          const proxyUrl = `/api/pubchem/compound/${encodeURIComponent(name)}`;
          res = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) });
        } else {
          throw fetchErr;
        }
      }

      // Fail fast immediately on HTTP 404 - do not retry or delay
      if (res.status === 404) {
        return null;
      }

      // Check transient status codes that SHOULD retry
      if (res.status === 503 || res.status === 429 || res.status === 504) {
        const err: any = new Error(`PubChem transient error: ${res.status}`);
        err.status = res.status;
        throw err;
      }

      // Local proxy fallback if direct browser fetch returned non-404 error
      if (!res.ok && typeof window !== 'undefined') {
        const proxyUrl = `/api/pubchem/compound/${encodeURIComponent(name)}`;
        const proxyRes = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) });
        if (proxyRes.ok) {
          const proxyData = await proxyRes.json();
          return parsePubChemProperties(proxyData);
        }
        if (proxyRes.status === 404) {
          return null;
        }
      }

      if (!res.ok) {
        return null;
      }

      const json = await res.json();
      const props = json?.PropertyTable?.Properties?.[0];
      if (!props) return null;

      return parsePubChemProperties(props);
    });
  } catch (err: any) {
    if (err?.status === 404 || String(err?.message || '').includes('404')) {
      return null;
    }
    console.warn(`[PubChemService] Lookup error for "${name}":`, err?.message || err);
    return null;
  }
}

/**
 * Internal helper to query properties by numeric CID.
 */
async function queryPropertiesAndImageByCid(cid: number): Promise<ChemData | null> {
  try {
    const data = await pubchemRateLimiter.schedule(async () => {
      const endpoint = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/MolecularWeight,XLogP/JSON`;

      let res: Response;
      try {
        res = await fetch(endpoint, { signal: AbortSignal.timeout(6000) });
      } catch (fetchErr: any) {
        if (typeof window !== 'undefined') {
          const proxyUrl = `/api/pubchem/compound/${cid}`;
          res = await fetch(proxyUrl, { signal: AbortSignal.timeout(6000) });
        } else {
          throw fetchErr;
        }
      }

      if (res.status === 404) {
        return null;
      }

      if (!res.ok && typeof window !== 'undefined') {
        const proxyRes = await fetch(`/api/pubchem/compound/${cid}`, { signal: AbortSignal.timeout(6000) });
        if (proxyRes.ok) {
          const proxyData = await proxyRes.json();
          return parsePubChemProperties(proxyData);
        }
        if (proxyRes.status === 404) {
          return null;
        }
      }

      if (res.status === 503 || res.status === 429 || res.status === 504) {
        const err: any = new Error(`PubChem transient error: ${res.status}`);
        err.status = res.status;
        throw err;
      }

      if (!res.ok) return null;
      const json = await res.json();
      const props = json?.PropertyTable?.Properties?.[0];
      return props ? parsePubChemProperties(props) : null;
    });

    if (data && data.cid) {
      const imgData = await downloadCompoundStructureImage(data.cid);
      return {
        ...data,
        structureImageDataUrl: imgData.structureImageDataUrl,
        structureImageBlob: imgData.structureImageBlob,
      };
    }

    return data;
  } catch (err: any) {
    if (err?.status === 404 || String(err?.message || '').includes('404')) {
      return null;
    }
    console.warn(`[PubChemService] CID query error for ${cid}:`, err);
    return null;
  }
}

/**
 * Parses NIH PubChem property JSON into our ChemData interface.
 */
function parsePubChemProperties(props: any): ChemData {
  return {
    cid: props.CID ? Number(props.CID) : undefined,
    iupacName: props.IUPACName,
    canonicalSmiles: props.CanonicalSMILES,
    isomericSmiles: props.IsomericSMILES || props.CanonicalSMILES,
    molecularFormula: props.MolecularFormula,
    molecularWeight: props.MolecularWeight ? Number(props.MolecularWeight) : undefined,
    xlogp: props.XLogP !== undefined ? Number(props.XLogP) : undefined,
  };
}

/**
 * Enriches a single entity in Dexie with PubChem data if not already cached.
 * Gracefully resolves to false if compound 404s after all sanitization fallbacks.
 */
export async function enrichEntityInDexie(entityId: string): Promise<boolean> {
  const canonicalId = entityId.trim().toLowerCase();
  const entity = await medChemGraphDb.entities.get(canonicalId);
  if (!entity) return false;

  // If already enriched with structure image and properties, skip re-fetching
  if (entity.chemData?.structureImageDataUrl && entity.chemData?.cid) {
    return true;
  }

  // Only enrich DRUG or METABOLITE types
  if (entity.type !== 'DRUG' && entity.type !== 'METABOLITE') {
    return false;
  }

  const lookupTerm = entity.chemData?.cid || entity.name || entity.id;
  try {
    const chemData = await fetchPubChemCompoundData(lookupTerm);

    if (chemData) {
      await medChemGraphDb.entities.update(canonicalId, {
        cid: chemData.cid,
        chemData: {
          ...entity.chemData,
          ...chemData,
        },
        updatedAt: new Date().toISOString(),
      });
      return true;
    } else {
      console.warn(`[PubChem] Compound not found, continuing: ${lookupTerm}`);
      return false;
    }
  } catch (lookupErr: any) {
    console.warn(`[PubChem] Compound not found, continuing: ${lookupTerm}`);
    return false;
  }
}

/**
 * Scans db.entities for DRUG and METABOLITE nodes lacking chemData (or missing 2D structure),
 * fetches their PubChem data sequentially using the rate-limited queue, and updates the IndexedDB records.
 * Advances immediately on 404 without stalling or delaying.
 *
 * @param onProgress - Optional callback notifying (completedCount, totalCandidates, currentName)
 * @returns Statistics on enriched and total scanned records.
 */
export async function enrichGraphEntitiesWithPubChem(
  onProgress?: (completed: number, total: number, currentName: string) => void,
  signal?: AbortSignal
): Promise<{ enrichedCount: number; totalScanned: number }> {
  const allEntities = await medChemGraphDb.entities.toArray();

  // Find DRUG and METABOLITE nodes lacking complete chemData or missing 2D image
  const candidates = allEntities.filter((e) => {
    if (e.type !== 'DRUG' && e.type !== 'METABOLITE') return false;
    return !e.chemData || !e.chemData.cid || !e.chemData.structureImageDataUrl;
  });

  const total = candidates.length;
  let enrichedCount = 0;

  for (let i = 0; i < total; i++) {
    if (signal?.aborted) {
      console.log('[PubChemService] Graph entity enrichment aborted by signal');
      break;
    }

    const ent = candidates[i];
    const lookupTerm = ent.chemData?.cid || ent.name || ent.id;

    if (onProgress) {
      onProgress(i + 1, total, ent.name || ent.id);
    }

    try {
      const chemData = await fetchPubChemCompoundData(lookupTerm);
      if (chemData) {
        await medChemGraphDb.entities.update(ent.id, {
          cid: chemData.cid,
          chemData: {
            ...ent.chemData,
            ...chemData,
          },
          updatedAt: new Date().toISOString(),
        });
        enrichedCount++;
      } else {
        console.warn(`[PubChem] Compound not found, continuing: ${lookupTerm}`);
      }
    } catch (err) {
      console.warn(`[PubChem] Compound not found, continuing: ${ent.id}`);
    }

    // Enforce 250ms delay between calls to prevent 503 rate limits
    if (i < total - 1 && !signal?.aborted) {
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  if (onProgress) {
    onProgress(total, total, 'Complete');
  }

  return { enrichedCount, totalScanned: total };
}

/**
 * Result returned for each verified structure in a batch operation.
 */
export interface VerifiedStructureResult {
  id?: string;
  name: string;
  cid: number | null;
  structureImageDataUrl: string | null;
  canonicalSmiles?: string;
  iupacName?: string;
  molecularFormula?: string;
  molecularWeight?: number;
  xlogp?: number;
  isPlaceholder?: boolean;
}

/**
 * Resilient sequential batch verification for chemical structures with 250ms spacing.
 * Guarantees that a 404 or failed lookup on one structure (e.g. placeholder, conjugate,
 * or unlisted experimental compound) never halts or interrupts resolution for others.
 * Throttles network traffic to eliminate 503 rate-limit errors and supports AbortSignal.
 *
 * @param structures - Array of structures with names/labels to verify
 * @param onProgress - Optional progress callback notifying UI of live progress
 * @param signal - Optional AbortSignal to cancel in-flight batch requests
 * @returns Array of verified structure results with CIDs and DataURLs
 */
export async function verifyStructuresBatchPubChem(
  structures: Array<{ id?: string; name: string; cid?: number; pngUrl?: string }>,
  onProgress?: (completed: number, total: number, currentName: string) => void,
  signal?: AbortSignal
): Promise<VerifiedStructureResult[]> {
  const total = structures.length;
  if (total === 0) return [];

  const results: VerifiedStructureResult[] = [];
  let completedCount = 0;

  for (let i = 0; i < total; i++) {
    if (signal?.aborted) {
      console.log('[PubChemBatch] Batch verification aborted by signal');
      break;
    }

    const structure = structures[i];
    const rawName = structure.name || structure.id || '';

    // Detect and skip placeholder labels matching patterns like "Antihyperlipidemic Drug A", "Compound B"
    if (isPlaceholderLabel(rawName)) {
      completedCount++;
      onProgress?.(completedCount, total, rawName);
      results.push({
        id: structure.id,
        name: structure.name,
        cid: null,
        structureImageDataUrl: null,
        isPlaceholder: true,
      });
      continue;
    }

    try {
      const lookupTerm = structure.cid && structure.cid > 0 ? structure.cid : rawName;
      const chemData = await fetchPubChemCompoundData(lookupTerm);

      completedCount++;
      onProgress?.(completedCount, total, structure.name);

      if (chemData && chemData.cid) {
        results.push({
          id: structure.id,
          name: structure.name,
          cid: chemData.cid,
          structureImageDataUrl: chemData.structureImageDataUrl || null,
          canonicalSmiles: chemData.canonicalSmiles,
          iupacName: chemData.iupacName,
          molecularFormula: chemData.molecularFormula,
          molecularWeight: chemData.molecularWeight,
          xlogp: chemData.xlogp,
          isPlaceholder: false,
        });
      } else {
        // Handle 404 cleanly: return null cid and null data url without throwing
        results.push({
          id: structure.id,
          name: structure.name,
          cid: null,
          structureImageDataUrl: null,
          isPlaceholder: false,
        });
      }
    } catch (err) {
      console.warn(`[PubChemBatch] Resilient catch for "${rawName}":`, err);
      completedCount++;
      onProgress?.(completedCount, total, rawName);
      results.push({
        id: structure.id,
        name: structure.name,
        cid: null,
        structureImageDataUrl: null,
        isPlaceholder: false,
      });
    }

    // Enforce 250ms spacing between sequential calls to prevent HTTP 503 rate limits
    if (i < total - 1 && !signal?.aborted) {
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  return results;
}

/**
 * Enriches specific entity IDs or performs a scan across all DRUG and METABOLITE entities.
 * Immediately advances to the next candidate on 404 with sequential 250ms spacing
 * so queue progress [1/7]...[7/7] is uninterrupted and never halts on failures.
 */
export async function enrichEntitiesWithPubChem(
  entityIds?: string[],
  onProgress?: (completed: number, total: number, currentName: string) => void,
  signal?: AbortSignal
): Promise<{ enrichedCount: number; totalCandidates: number }> {
  if (!entityIds || entityIds.length === 0) {
    const res = await enrichGraphEntitiesWithPubChem(onProgress, signal);
    return { enrichedCount: res.enrichedCount, totalCandidates: res.totalScanned };
  }

  const uniqueIds = Array.from(new Set(entityIds.map((id) => id.trim().toLowerCase())));
  const total = uniqueIds.length;
  if (total === 0) {
    return { enrichedCount: 0, totalCandidates: 0 };
  }

  let completed = 0;
  let enrichedCount = 0;

  for (let i = 0; i < total; i++) {
    if (signal?.aborted) {
      console.log('[PubChemService] Entity enrichment aborted by signal');
      break;
    }

    const id = uniqueIds[i];
    try {
      const success = await enrichEntityInDexie(id);
      completed++;
      if (success) enrichedCount++;
      onProgress?.(completed, total, id);
    } catch (err) {
      console.warn(`[PubChem] Compound not found, continuing: ${id}`);
      completed++;
      onProgress?.(completed, total, id);
    }

    // 250ms spacing between sequential calls to prevent HTTP 503 errors
    if (i < total - 1 && !signal?.aborted) {
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  if (onProgress) {
    onProgress(total, total, 'Complete');
  }

  return { enrichedCount, totalCandidates: total };
}
