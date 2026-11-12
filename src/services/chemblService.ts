/**
 * ChEMBL Bioactivity & Quantitative SAR Client Service.
 * Fetches molecule identifiers, mechanisms of action, and quantitative binding
 * affinities (Ki, IC50, Kd, EC50) from the EMBL-EBI ChEMBL REST API.
 */

export interface ChemblBioactivityRecord {
  moleculeChemblId: string;
  prefName: string;
  mechanismOfAction?: string;
  targetName?: string;
  targetChemblId?: string;
  assayType?: string;
  standardValue?: number;
  standardUnits?: string;
  standardType?: string; // Ki, IC50, Kd, EC50
  relation?: string; // '=', '<', '>', etc.
  pchemblValue?: number;
}

const DEFAULT_TIMEOUT_MS = 8000;
const inMemoryChemblCache = new Map<string, ChemblBioactivityRecord[]>();

/**
 * Clears the in-memory ChEMBL bioactivity cache.
 */
export function clearChemblCache(): void {
  inMemoryChemblCache.clear();
}

/**
 * Maps raw ChEMBL activity records and mechanism data into normalized ChemblBioactivityRecord items.
 */
export function mapChemblActivitiesToRecords(
  moleculeChemblId: string,
  prefName: string,
  mechanismOfAction: string | undefined,
  activities: any[]
): ChemblBioactivityRecord[] {
  if (Array.isArray(activities) && activities.length > 0) {
    return activities.map((act) => ({
      moleculeChemblId,
      prefName,
      mechanismOfAction,
      targetName: act.target_pref_name || act.assay_description || undefined,
      targetChemblId: act.target_chembl_id || undefined,
      assayType: act.assay_type || undefined,
      standardValue:
        act.standard_value != null && !isNaN(Number(act.standard_value))
          ? Number(act.standard_value)
          : undefined,
      standardUnits: act.standard_units || undefined,
      standardType: act.standard_type || undefined,
      relation: act.standard_relation || act.relation || undefined,
      pchemblValue:
        act.pchembl_value != null && !isNaN(Number(act.pchembl_value))
          ? Number(act.pchembl_value)
          : undefined,
    }));
  }

  // Fallback: If no activity records were found but a mechanism was resolved
  if (mechanismOfAction) {
    return [
      {
        moleculeChemblId,
        prefName,
        mechanismOfAction,
      },
    ];
  }

  return [];
}

/**
 * Fetches ChEMBL bioactivity and mechanism records for a given drug name.
 * Queries pref_name first, falls back to molecule synonyms, then retrieves mechanisms and
 * top binding activities (Ki, IC50, Kd, EC50).
 */
export async function fetchChemblBioactivity(
  drugName: string,
  signal?: AbortSignal
): Promise<ChemblBioactivityRecord[]> {
  if (!drugName || typeof drugName !== 'string') return [];
  const normalized = drugName.trim().toLowerCase();
  if (!normalized) return [];

  // Check in-memory cache
  if (inMemoryChemblCache.has(normalized)) {
    return inMemoryChemblCache.get(normalized)!;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  const onAbort = () => controller.abort();

  if (signal) {
    if (signal.aborted) {
      clearTimeout(timeoutId);
      return [];
    }
    signal.addEventListener('abort', onAbort, { once: true });
  }

  try {
    const fetchOptions: RequestInit = { signal: controller.signal };

    // Step 1: Search molecule by preferred name
    let moleculeData: any = null;
    const prefUrl = `https://www.ebi.ac.uk/chembl/api/data/molecule.json?pref_name__iexact=${encodeURIComponent(normalized)}`;
    try {
      const prefRes = await fetch(prefUrl, fetchOptions);
      if (prefRes.ok) {
        moleculeData = await prefRes.json();
      }
    } catch (err) {
      // Allow fallback on pref_name error
    }

    let molecules = moleculeData?.molecules;

    // Step 1 Fallback: Search by molecule synonym
    if (!Array.isArray(molecules) || molecules.length === 0) {
      const synUrl = `https://www.ebi.ac.uk/chembl/api/data/molecule.json?molecule_synonyms__molecule_synonym__iexact=${encodeURIComponent(normalized)}`;
      try {
        const synRes = await fetch(synUrl, fetchOptions);
        if (synRes.ok) {
          const synData = await synRes.json();
          molecules = synData?.molecules;
        }
      } catch (err) {
        // Fallback error handled below
      }
    }

    if (!Array.isArray(molecules) || molecules.length === 0) {
      inMemoryChemblCache.set(normalized, []);
      return [];
    }

    // Step 2: Extract molecule ID and preferred name
    const mol = molecules[0];
    const chemblId: string = mol.molecule_chembl_id;
    if (!chemblId) {
      inMemoryChemblCache.set(normalized, []);
      return [];
    }
    const prefName: string = mol.pref_name || drugName.trim();

    // Step 3: Fetch mechanisms of action
    let mechanismOfAction: string | undefined;
    try {
      const mechUrl = `https://www.ebi.ac.uk/chembl/api/data/mechanism.json?molecule_chembl_id=${encodeURIComponent(chemblId)}`;
      const mechRes = await fetch(mechUrl, fetchOptions);
      if (mechRes.ok) {
        const mechData = await mechRes.json();
        if (Array.isArray(mechData?.mechanisms) && mechData.mechanisms.length > 0) {
          const moas = mechData.mechanisms
            .map((m: any) => m.mechanism_of_action || m.action_type)
            .filter(Boolean);
          if (moas.length > 0) {
            mechanismOfAction = Array.from(new Set(moas)).join('; ');
          }
        }
      }
    } catch (err) {
      console.warn(`[chemblService] Mechanism fetch failed for ${chemblId}:`, err);
    }

    // Step 4: Fetch activities (Ki, IC50, Kd, EC50)
    let activities: any[] = [];
    try {
      const actUrl = `https://www.ebi.ac.uk/chembl/api/data/activity.json?molecule_chembl_id=${encodeURIComponent(chemblId)}&standard_type__in=Ki,IC50,Kd,EC50&limit=20`;
      const actRes = await fetch(actUrl, fetchOptions);
      if (actRes.ok) {
        const actData = await actRes.json();
        if (Array.isArray(actData?.activities)) {
          activities = actData.activities;
        }
      }
    } catch (err) {
      console.warn(`[chemblService] Activity fetch failed for ${chemblId}:`, err);
    }

    // Step 5: Map and return records
    const records = mapChemblActivitiesToRecords(
      chemblId,
      prefName,
      mechanismOfAction,
      activities
    );

    inMemoryChemblCache.set(normalized, records);
    return records;
  } catch (err) {
    console.warn(`[chemblService] Failed to fetch ChEMBL bioactivity for "${drugName}":`, err);
    return [];
  } finally {
    clearTimeout(timeoutId);
    if (signal) {
      signal.removeEventListener('abort', onAbort);
    }
  }
}
