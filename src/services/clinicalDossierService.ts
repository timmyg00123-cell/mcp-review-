import { db } from '../db/db';

export interface ClinicalDossierRecord {
  id?: number;
  genericName: string;
  dailyMed?: {
    boxedWarning?: string;
    indications?: string[];
    dosageForms?: string[];
    splWebUrl?: string;
  };
  rxNorm?: {
    rxcui: string;
    brandNames: string[];
    synonyms: string[];
  };
  statPearls?: {
    title?: string;
    bookshelfUid?: string;
    bookshelfUrl?: string;
    summary?: string;
  };
  lastUpdated: number;
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const COMMON_SALT_TOKENS = new Set([
  'bisulfate', 'sulfate', 'potassium', 'hydrochloride', 'hcl', 'sodium',
  'maleate', 'mesylate', 'tartrate', 'succinate', 'fumarate', 'acetate',
  'calcium', 'nitrate', 'phosphate', 'citrate', 'bromide', 'iodide',
  'besylate', 'tosylate', 'gluconate', 'propionate', 'dipropionate',
  'valerate', 'palmitate', 'pamoate', 'decanoate', 'dihydrate',
  'monohydrate', 'trihydrate', 'pentahydrate', 'hemihydrate',
  'sesquihydrate', 'hydrate', 'disodium', 'dipotassium', 'tromethamine',
  'meglumine', 'lactobionate', 'aspartate', 'chloride', 'carbonate'
]);

/**
 * Normalizes a drug name to its base generic drug name by stripping common pharmaceutical
 * salt, counter-ion, hydrate suffixes, parenthetical qualifiers, and normalizing casing.
 */
export function normalizeDrugBaseName(rawName: string): string {
  if (!rawName) return '';
  let cleaned = rawName.toLowerCase().trim();
  // Strip parenthetical notes like (oral), (hcl), (as monohydrate)
  cleaned = cleaned.replace(/\s*\([^)]*\)/g, ' ').trim();
  // Strip commas, semicolons, and slashes
  cleaned = cleaned.replace(/[,;/]/g, ' ').trim();

  const words = cleaned.split(/\s+/).filter(Boolean);
  while (words.length > 1 && COMMON_SALT_TOKENS.has(words[words.length - 1])) {
    words.pop();
  }
  return words.join(' ');
}

/**
 * Fetches OpenFDA drug label data to extract DailyMed information including
 * boxed warnings, indications, and dosage forms.
 */
async function fetchDailyMedData(baseName: string): Promise<ClinicalDossierRecord['dailyMed'] | undefined> {
  try {
    const url = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(baseName)}"&limit=1`;
    const res = await fetch(url);
    if (!res.ok) return undefined;
    const data = await res.json();
    const label = data.results?.[0];
    if (!label) return undefined;

    let boxedWarning: string | undefined;
    if (Array.isArray(label.boxed_warning) && label.boxed_warning.length > 0) {
      boxedWarning = label.boxed_warning.join('\n\n').trim();
    } else if (typeof label.boxed_warning === 'string') {
      boxedWarning = label.boxed_warning.trim();
    } else if (Array.isArray(label.warnings) && label.warnings.length > 0) {
      boxedWarning = label.warnings.join('\n\n').trim();
    } else if (typeof label.warnings === 'string') {
      boxedWarning = label.warnings.trim();
    }

    let indications: string[] | undefined;
    if (Array.isArray(label.indications_and_usage) && label.indications_and_usage.length > 0) {
      indications = label.indications_and_usage.map((s: string) => s.trim()).filter(Boolean);
    } else if (typeof label.indications_and_usage === 'string') {
      indications = [label.indications_and_usage.trim()];
    }

    let dosageForms: string[] | undefined;
    if (Array.isArray(label.openfda?.dosage_form) && label.openfda.dosage_form.length > 0) {
      dosageForms = label.openfda.dosage_form.map((s: string) => s.trim()).filter(Boolean);
    } else if (Array.isArray(label.dosage_forms_and_strengths) && label.dosage_forms_and_strengths.length > 0) {
      dosageForms = label.dosage_forms_and_strengths.map((s: string) => s.trim()).filter(Boolean);
    } else if (typeof label.dosage_forms_and_strengths === 'string') {
      dosageForms = [label.dosage_forms_and_strengths.trim()];
    }

    const splWebUrl = `https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=${encodeURIComponent(baseName)}`;

    if (!boxedWarning && !indications?.length && !dosageForms?.length) {
      return undefined;
    }

    return {
      boxedWarning,
      indications,
      dosageForms,
      splWebUrl,
    };
  } catch (err) {
    console.warn(`[clinicalDossierService] OpenFDA label fetch failed for "${baseName}":`, err);
    return undefined;
  }
}

/**
 * Fetches RxNorm RxNav information to resolve rxcui, brand names, and synonyms.
 */
async function fetchRxNormData(baseName: string): Promise<ClinicalDossierRecord['rxNorm'] | undefined> {
  try {
    const idUrl = `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(baseName)}`;
    const idRes = await fetch(idUrl);
    if (!idRes.ok) return undefined;
    const idData = await idRes.json();
    const rxcui = idData?.idGroup?.rxnormId?.[0];
    if (!rxcui) return undefined;

    const propUrl = `https://rxnav.nlm.nih.gov/REST/rxcui/${encodeURIComponent(rxcui)}/allProperties.json?prop=all`;
    const propRes = await fetch(propUrl);
    if (!propRes.ok) {
      return {
        rxcui,
        brandNames: [],
        synonyms: [],
      };
    }

    const propData = await propRes.json();
    const concepts: Array<{ propCategory?: string; propName?: string; propValue?: string }> =
      propData?.propConceptGroup?.propConcept || [];

    const brandNamesSet = new Set<string>();
    const synonymsSet = new Set<string>();

    for (const c of concepts) {
      const name = c.propName?.toUpperCase();
      const val = c.propValue?.trim();
      if (!val) continue;

      if (name === 'BN' || name === 'BRAND_NAME') {
        brandNamesSet.add(val);
      } else if (name === 'SY' || name === 'SYNONYM') {
        synonymsSet.add(val);
      }
    }

    return {
      rxcui,
      brandNames: Array.from(brandNamesSet),
      synonyms: Array.from(synonymsSet),
    };
  } catch (err) {
    console.warn(`[clinicalDossierService] RxNav fetch failed for "${baseName}":`, err);
    return undefined;
  }
}

/**
 * Fetches NCBI Bookshelf StatPearls reference link and metadata.
 */
async function fetchStatPearlsData(baseName: string): Promise<ClinicalDossierRecord['statPearls'] | undefined> {
  try {
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=books&term=${encodeURIComponent(baseName)}+AND+statpearls[book]&retmode=json`;
    const res = await fetch(url);
    if (!res.ok) return undefined;
    const data = await res.json();
    const idlist: string[] = data?.esearchresult?.idlist || [];
    if (!idlist.length || !idlist[0]) return undefined;

    const bookshelfUid = idlist[0];
    const bookshelfUrl = `https://www.ncbi.nlm.nih.gov/books/${bookshelfUid}/`;
    const title = `${baseName.charAt(0).toUpperCase() + baseName.slice(1)} (StatPearls)`;

    return {
      title,
      bookshelfUid,
      bookshelfUrl,
    };
  } catch (err) {
    console.warn(`[clinicalDossierService] StatPearls fetch failed for "${baseName}":`, err);
    return undefined;
  }
}

/**
 * Retrieves or builds a clinical dossier record for a drug name.
 * Uses Dexie db.clinicalDossiers as a 7-day cache, otherwise fetches in parallel from
 * OpenFDA, RxNorm RxNav, and NCBI Bookshelf StatPearls.
 */
export async function fetchClinicalDossier(drugName: string): Promise<ClinicalDossierRecord> {
  const baseName = normalizeDrugBaseName(drugName);
  if (!baseName) {
    return {
      genericName: '',
      lastUpdated: Date.now(),
    };
  }

  // 1. Check Dexie cache first
  let cached: ClinicalDossierRecord | undefined;
  try {
    cached = await db.clinicalDossiers.where('genericName').equals(baseName).first();
    if (cached && (Date.now() - cached.lastUpdated < SEVEN_DAYS_MS)) {
      return cached;
    }
  } catch (err) {
    console.warn('[clinicalDossierService] Cache lookup error:', err);
  }

  // 2. Fetch external APIs in parallel with isolated error handling
  const [dailyMed, rxNorm, statPearls] = await Promise.all([
    fetchDailyMedData(baseName),
    fetchRxNormData(baseName),
    fetchStatPearlsData(baseName),
  ]);

  const dossier: ClinicalDossierRecord = {
    genericName: baseName,
    dailyMed,
    rxNorm,
    statPearls,
    lastUpdated: Date.now(),
  };

  // 3. Cache into Dexie
  try {
    if (cached?.id) {
      dossier.id = cached.id;
    }
    await db.clinicalDossiers.put(dossier);
  } catch (err) {
    console.warn('[clinicalDossierService] Failed to cache clinical dossier in Dexie:', err);
  }

  return dossier;
}
