import { ChemData, medChemGraphDb, GraphEntity } from '../db/medChemGraphDb';
import { getKnownDrugSmiles } from '../utils/knownDrugSmiles';
import { fetchOpenFdaClinicalData, OpenFdaClinicalData } from './openFdaService';

/**
 * Common pharmaceutical salt, counter-ion, and solvate suffixes to strip
 * when a direct name lookup in PubChem returns 404.
 */
const COMMON_SALT_SUFFIXES = [
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

const METABOLITE_DESCRIPTORS = [
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

const CONJUGATION_SUFFIXES = [
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
 * Strips bracketed prefix (e.g. "[IV] Rosuvastatin" -> "Rosuvastatin")
 */
function cleanQueryString(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/\[.*?\]\s*/g, '')
    .replace(/^(?:structure|compound|drug)\s+[a-z0-9ivxlcdm]+\s*[-:–]?\s*/i, '')
    .trim();
}

/**
 * Resilient Exponential Backoff Retry Wrapper for PubChem fetch requests.
 * Gracefully handles HTTP 429 Too Many Requests, 503 Service Unavailable, and 504 Gateway Timeout.
 * Parses Retry-After header and adds random jitter.
 */
async function fetchWithExponentialBackoff(
  url: string,
  options?: RequestInit,
  maxRetries = 5,
  initialDelayMs = 1000
): Promise<Response> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const response = await fetch(url, options);

      // Transient rate limits / server errors that require backoff
      if (response.status === 429 || response.status === 503 || response.status === 504) {
        attempt++;
        if (attempt >= maxRetries) {
          return response;
        }

        const retryAfterHeader = response.headers.get('Retry-After');
        let delayMs = initialDelayMs * Math.pow(2, attempt - 1);
        if (retryAfterHeader) {
          const seconds = parseInt(retryAfterHeader, 10);
          if (!isNaN(seconds) && seconds > 0) {
            delayMs = Math.max(delayMs, seconds * 1000);
          }
        }
        // Random jitter (+/- 20%) to avoid synchronized retries
        const jitter = delayMs * 0.2 * (Math.random() * 2 - 1);
        const finalDelay = Math.max(500, Math.round(delayMs + jitter));

        console.warn(
          `[PubChem Worker] HTTP ${response.status} on "${url}". Retrying in ${finalDelay}ms (attempt ${attempt}/${maxRetries})...`
        );
        await new Promise((resolve) => setTimeout(resolve, finalDelay));
        continue;
      }

      return response;
    } catch (err: any) {
      attempt++;
      if (attempt >= maxRetries) {
        throw err;
      }
      const delayMs = initialDelayMs * Math.pow(2, attempt - 1);
      console.warn(`[PubChem Worker] Network error. Retrying in ${delayMs}ms:`, err?.message || err);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw new Error(`Max retries reached for ${url}`);
}

/**
 * Converts a Blob to a Base64 data URL in Web Worker scope without DOM access.
 */
async function blobToDataUrl(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return `data:image/png;base64,${base64}`;
}

/**
 * Downloads 2D structure image PNG for a verified CID with exponential backoff.
 */
async function fetchStructureImage(cid: number): Promise<{ dataUrl: string; blob: Blob } | null> {
  try {
    const imgUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/PNG`;
    const res = await fetchWithExponentialBackoff(imgUrl);
    if (!res.ok) return null;

    const blob = await res.blob();
    const dataUrl = await blobToDataUrl(blob);
    return { dataUrl, blob };
  } catch (err) {
    console.warn(`[PubChem Worker] Image download failed for CID ${cid}:`, err);
    return null;
  }
}

/**
 * Downloads 2D SDF / MOL block for a verified CID with exponential backoff.
 * Preserves PubChem's native 2D layout and coordinates when rendering with RDKit.
 */
async function fetchMolBlock(cid: number): Promise<string | null> {
  try {
    const sdfUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/SDF/?record_type=2d&response_type=display`;
    const res = await fetchWithExponentialBackoff(sdfUrl);
    if (!res.ok) return null;
    const text = await res.text();
    return text?.trim() ? text : null;
  } catch (err) {
    console.warn(`[PubChem Worker] MOL block download failed for CID ${cid}:`, err);
    return null;
  }
}

/**
 * Queries NIH PUG REST for compound properties by name with fallback strategies.
 */
async function queryPubChemByName(name: string): Promise<ChemData | null> {
  const cleanName = cleanQueryString(name);
  if (!cleanName) return null;

  const candidateQueries = [cleanName];

  // 1. Salt-stripped candidate
  const words = cleanName.toLowerCase().split(/\s+/);
  const saltStripped = words.filter((w) => !COMMON_SALT_SUFFIXES.includes(w)).join(' ');
  if (saltStripped && saltStripped !== cleanName.toLowerCase()) {
    candidateQueries.push(saltStripped);
  }

  // 2. Metabolite descriptor stripped
  const descStripped = words.filter((w) => !METABOLITE_DESCRIPTORS.includes(w)).join(' ');
  if (descStripped && !candidateQueries.includes(descStripped)) {
    candidateQueries.push(descStripped);
  }

  // 3. Conjugation suffix stripped
  for (const conj of CONJUGATION_SUFFIXES) {
    if (cleanName.toLowerCase().endsWith(` ${conj}`)) {
      const parent = cleanName.slice(0, -(conj.length + 1)).trim();
      if (parent && !candidateQueries.includes(parent)) {
        candidateQueries.push(parent);
      }
    }
  }

  for (const q of candidateQueries) {
    try {
      const endpoint = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(
        q
      )}/property/CanonicalSMILES,IsomericSMILES,IUPACName,MolecularFormula,MolecularWeight,XLogP/JSON`;

      const res = await fetchWithExponentialBackoff(endpoint);

      // 404 is an expected non-match for experimental or altered names, do not retry
      if (res.status === 404) {
        continue;
      }

      if (!res.ok) {
        continue;
      }

      const json = await res.json();
      const props = json?.PropertyTable?.Properties?.[0];
      if (!props) continue;

      const cid = props.CID;
      let imgData: { dataUrl: string; blob: Blob } | null = null;
      let molBlock: string | null = null;
      if (cid) {
        [imgData, molBlock] = await Promise.all([
          fetchStructureImage(cid),
          fetchMolBlock(cid),
        ]);
      }

      return {
        cid,
        iupacName: props.IUPACName,
        canonicalSmiles: props.CanonicalSMILES,
        isomericSmiles: props.IsomericSMILES || props.CanonicalSMILES,
        molecularFormula: props.MolecularFormula,
        molecularWeight: props.MolecularWeight ? Number(props.MolecularWeight) : undefined,
        xlogp: props.XLogP !== undefined ? Number(props.XLogP) : undefined,
        structureImageDataUrl: imgData?.dataUrl,
        structureImageBlob: imgData?.blob,
        pubchemMolBlock: molBlock || undefined,
      };
    } catch {
      // Continue to next fallback query candidate
    }
  }

  return null;
}

/**
 * Queries NIH PUG REST for compound properties by CID.
 */
async function queryPubChemByCid(cid: number): Promise<ChemData | null> {
  if (!cid || cid <= 0) return null;

  try {
    const endpoint = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/property/CanonicalSMILES,IsomericSMILES,IUPACName,MolecularFormula,MolecularWeight,XLogP/JSON`;
    const res = await fetchWithExponentialBackoff(endpoint);

    if (!res.ok) return null;

    const json = await res.json();
    const props = json?.PropertyTable?.Properties?.[0];
    if (!props) return null;

    const [imgData, molBlock] = await Promise.all([
      fetchStructureImage(cid),
      fetchMolBlock(cid),
    ]);

    return {
      cid,
      iupacName: props.IUPACName,
      canonicalSmiles: props.CanonicalSMILES,
      isomericSmiles: props.IsomericSMILES || props.CanonicalSMILES,
      molecularFormula: props.MolecularFormula,
      molecularWeight: props.MolecularWeight ? Number(props.MolecularWeight) : undefined,
      xlogp: props.XLogP !== undefined ? Number(props.XLogP) : undefined,
      structureImageDataUrl: imgData?.dataUrl,
      structureImageBlob: imgData?.blob,
      pubchemMolBlock: molBlock || undefined,
    };
  } catch (err) {
    console.warn(`[PubChem Worker] Query by CID ${cid} failed:`, err);
    return null;
  }
}

/**
 * Ingests a single entity into Dexie IndexedDB from inside the Web Worker.
 */
async function enrichAndPersistEntity(
  item: string | { id: string; name?: string; cid?: number; [key: string]: any }
): Promise<{ success: boolean; id: string; chemData?: ChemData; clinicalData?: OpenFdaClinicalData }> {
  const entityId = typeof item === 'string' ? item : item.id;
  const rawName = typeof item === 'object' && item.name ? item.name : entityId;
  const existingCid = typeof item === 'object' && item.cid ? item.cid : undefined;

  const normalizedId = entityId.trim().toLowerCase();

  // 1. Fetch PubChem data (by CID first if known, else by name)
  let chemData: ChemData | null = null;
  const existing = await medChemGraphDb.entities.get(normalizedId);
  const targetCid = existingCid || existing?.cid;

  if (targetCid && targetCid > 0) {
    chemData = await queryPubChemByCid(targetCid);
  }
  if (!chemData) {
    chemData = await queryPubChemByName(rawName);
  }

  // Extract candidate fallback SMILES provided by Gemini, curated offline database, or already stored in Dexie
  const itemSmiles =
    typeof item === 'object'
      ? (item.canonicalSmiles || item.smiles || item.pubchemAudit?.canonicalSmiles || item.chemData?.canonicalSmiles)
      : undefined;

  const fallbackSmiles = getKnownDrugSmiles(rawName) || getKnownDrugSmiles(normalizedId);

  const resolvedSmiles =
    chemData?.canonicalSmiles ||
    chemData?.isomericSmiles ||
    itemSmiles ||
    existing?.canonicalSmiles ||
    existing?.smiles ||
    existing?.chemData?.canonicalSmiles ||
    existing?.chemData?.isomericSmiles ||
    existing?.pubchemAudit?.canonicalSmiles ||
    fallbackSmiles;

  if (!chemData && !resolvedSmiles) {
    return { success: false, id: normalizedId };
  }

  // 2. Fetch OpenFDA clinical data (Mechanism of Action, Half-Life, Metabolism, Adverse Reactions, Contraindications)
  let clinicalData: OpenFdaClinicalData | undefined =
    existing?.clinicalData || (typeof item === 'object' ? item.clinicalData : undefined);

  if (!clinicalData || !clinicalData.mechanism_of_action?.length) {
    try {
      const fdaData = await fetchOpenFdaClinicalData(rawName);
      if (fdaData) {
        clinicalData = fdaData;
      }
    } catch (fdaErr) {
      console.warn(`[OpenFDA Worker] Clinical data fetch warning for "${rawName}":`, fdaErr);
    }
  }

  // 3. Persist to Dexie directly in Web Worker with strictly defined canonicalSmiles and clinicalData
  try {
    const finalCid = chemData?.cid || targetCid;
    const now = new Date().toISOString();

    const resolvedMolBlock =
      chemData?.pubchemMolBlock ||
      existing?.pubchemMolBlock ||
      existing?.chemData?.pubchemMolBlock;

    const mergedChemData: ChemData = {
      ...(existing?.chemData || {}),
      ...(chemData || {}),
      canonicalSmiles: resolvedSmiles || chemData?.canonicalSmiles || existing?.chemData?.canonicalSmiles,
      isomericSmiles: resolvedSmiles || chemData?.isomericSmiles || existing?.chemData?.isomericSmiles,
      pubchemMolBlock: resolvedMolBlock || undefined,
    };

    const pubchemAudit = {
      ...(existing?.pubchemAudit || {}),
      cid: finalCid || 0,
      status: finalCid ? ('verified' as const) : (resolvedSmiles ? ('verified' as const) : ('unresolved' as const)),
      verifiedAt: now,
      source: finalCid ? ('nih_pug_rest' as const) : (fallbackSmiles && !chemData ? ('curated_offline_fallback' as const) : ('gemini_fallback' as const)),
      canonicalSmiles: resolvedSmiles,
      iupacName: chemData?.iupacName || existing?.pubchemAudit?.iupacName,
      molecularFormula: chemData?.molecularFormula || existing?.pubchemAudit?.molecularFormula,
      molecularWeight: chemData?.molecularWeight || existing?.pubchemAudit?.molecularWeight,
      xlogp: chemData?.xlogp || existing?.pubchemAudit?.xlogp,
      pubChemUrl: finalCid ? `https://pubchem.ncbi.nlm.nih.gov/compound/${finalCid}` : '',
    };

    const moa_summary =
      clinicalData?.mechanism ||
      existing?.moa_summary ||
      (typeof item === 'object' ? item.moa_summary : undefined);
    const half_life =
      clinicalData?.halfLife ||
      existing?.half_life ||
      (typeof item === 'object' ? item.half_life : undefined);
    const bioactivation =
      clinicalData?.metabolism ||
      existing?.bioactivation ||
      (typeof item === 'object' ? item.bioactivation : undefined);
    const majorToxicityOrLimitation =
      clinicalData?.adverseReactions ||
      clinicalData?.contraindicationsText ||
      existing?.majorToxicityOrLimitation ||
      (typeof item === 'object' ? item.majorToxicityOrLimitation : undefined);

    const mergedPkPdHighlights = {
      ...(existing?.pkPdHighlights || (typeof item === 'object' ? item.pkPdHighlights : {})),
      halfLife: clinicalData?.halfLife || existing?.pkPdHighlights?.halfLife || (typeof item === 'object' ? item.pkPdHighlights?.halfLife : undefined) || 'Standard',
      elimination: clinicalData?.metabolism || existing?.pkPdHighlights?.elimination || (typeof item === 'object' ? item.pkPdHighlights?.elimination : undefined) || 'Hepatic / Renal',
    };

    if (existing) {
      await medChemGraphDb.entities.update(normalizedId, {
        cid: finalCid || existing.cid,
        canonicalSmiles: resolvedSmiles,
        smiles: resolvedSmiles,
        pubchemMolBlock: resolvedMolBlock,
        pubchemAudit,
        chemData: mergedChemData,
        clinicalData: clinicalData || existing.clinicalData,
        moa_summary: moa_summary || existing.moa_summary,
        half_life: half_life || existing.half_life,
        bioactivation: bioactivation || existing.bioactivation,
        majorToxicityOrLimitation: majorToxicityOrLimitation || existing.majorToxicityOrLimitation,
        pkPdHighlights: mergedPkPdHighlights,
        updatedAt: now,
      });
    } else {
      // Create a new entity record if it does not yet exist
      const newEntity: GraphEntity = {
        id: normalizedId,
        name: rawName,
        type: 'DRUG',
        clinical_and_sar_summary: '',
        cid: finalCid,
        canonicalSmiles: resolvedSmiles,
        smiles: resolvedSmiles,
        pubchemMolBlock: resolvedMolBlock,
        pubchemAudit,
        chemData: mergedChemData,
        clinicalData,
        moa_summary,
        half_life,
        bioactivation,
        majorToxicityOrLimitation,
        pkPdHighlights: mergedPkPdHighlights,
        updatedAt: now,
      };
      await medChemGraphDb.entities.put(newEntity);
    }

    return { success: true, id: normalizedId, chemData: mergedChemData, clinicalData };
  } catch (err) {
    console.warn(`[PubChem Worker] Dexie write failed for ${normalizedId}:`, err);
    return { success: false, id: normalizedId, chemData: chemData || undefined };
  }
}

/**
 * Worker message router.
 * Processes batch ETL ingestion and sends back progress updates:
 * { type: 'PROGRESS', current: 5, total: 25 }
 */
self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data || {};

  if (type === 'START_INGEST' || type === 'ENRICH_ENTITIES') {
    try {
      const items: Array<string | { id: string; name?: string; cid?: number; [key: string]: any }> =
        payload?.entities || payload?.entityIds || payload?.structures || [];

      const total = items.length;
      if (total === 0) {
        self.postMessage({
          type: 'COMPLETE',
          payload: { enrichedCount: 0, totalScanned: 0, results: [] },
        });
        return;
      }

      let enrichedCount = 0;
      const results: Array<{ id: string; success: boolean; chemData?: ChemData }> = [];

      for (let i = 0; i < total; i++) {
        const item = items[i];
        const itemName = typeof item === 'string' ? item : item.name || item.id;

        try {
          const res = await enrichAndPersistEntity(item);
          if (res.success) {
            enrichedCount++;
          }
          results.push(res);
        } catch (itemErr) {
          console.warn(`[PubChem Worker] Error enriching item "${itemName}":`, itemErr);
          results.push({
            id: typeof item === 'string' ? item : item.id,
            success: false,
          });
        }

        // Send progress update to main thread
        self.postMessage({
          type: 'PROGRESS',
          current: i + 1,
          total,
          name: itemName,
          message: `PubChem Rate-Limited Queue: [${i + 1}/${total}] Processing ${itemName}...`,
        });

        // 250ms spacing between PubChem API requests to respect NIH rate policy
        if (i < total - 1) {
          await new Promise((r) => setTimeout(r, 250));
        }
      }

      self.postMessage({
        type: 'COMPLETE',
        payload: {
          enrichedCount,
          totalScanned: total,
          results,
        },
      });
    } catch (fatalErr: any) {
      console.error('[PubChem Worker Fatal Error]:', fatalErr);
      self.postMessage({
        type: 'ERROR',
        error: fatalErr?.message || String(fatalErr),
      });
    }
  }
};
