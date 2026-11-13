/**
 * 3D Molecular Structure Service
 *
 * Provides coordinate fetching from RCSB PDB, heuristic ligand detection,
 * exclusion of crystallographic additives/solvents, and apo protein fallback logic.
 */

export interface DetectedLigandInfo {
  resn: string;
  atomCount: number;
  description?: string;
}

/**
 * Common crystallographic buffer salts, solvents, lipids, cryoprotectants,
 * and detergents to exclude when automatically detecting small-molecule drug ligands.
 */
export const EXCLUDED_HETERO_RESIDUES: readonly string[] = [
  'HOH',
  'WAT',
  'CLR', // Cholesterol / membrane lipid additive
  'SO4', // Sulfate ion
  'PO4', // Phosphate ion
  'MG',  // Magnesium
  'ZN',  // Zinc
  'NA',  // Sodium
  'CL',  // Chloride
  'CA',  // Calcium
  'K',   // Potassium
  'GOL', // Glycerol
  'EDO', // 1,2-ethanediol
  'PEG', // Polyethylene glycol
  'DMS', // Dimethyl sulfoxide
  'ACT', // Acetate
  'BMA', // Beta-D-mannose
  'NAG', // N-acetylglucosamine
  'FMT', // Formate
  'TRS', // Tris buffer
  'BME', // Beta-mercaptoethanol
  'MES', // MES buffer
  'MPD', // 2-methyl-2,4-pentanediol
];

/**
 * Identifies the primary small-molecule ligand in a PDB coordinate text string.
 *
 * 1. Filters out solvent and crystallization additives in EXCLUDED_HETERO_RESIDUES.
 * 2. If preferredLigandCode is provided and found, returns that ligand.
 * 3. Otherwise, groups HETATM records by residue name and selects the residue with
 *    the largest atom count (representing the primary drug ligand).
 * 4. Returns null if no non-excluded hetero residue exists (e.g. apo protein).
 */
export function identifyLigandResidue(
  pdbData: string,
  preferredLigandCode?: string
): DetectedLigandInfo | null {
  if (!pdbData || typeof pdbData !== 'string') return null;

  const excludedSet = new Set(EXCLUDED_HETERO_RESIDUES.map((r) => r.toUpperCase()));
  const normalizedPreferred = preferredLigandCode ? preferredLigandCode.trim().toUpperCase() : undefined;

  const lines = pdbData.split(/\r?\n/);
  const residueAtomCounts = new Map<string, number>();

  for (const line of lines) {
    if (line.startsWith('HETATM') && line.length >= 20) {
      const resn = line.substring(17, 20).trim().toUpperCase();
      if (!resn || excludedSet.has(resn)) {
        continue;
      }
      residueAtomCounts.set(resn, (residueAtomCounts.get(resn) || 0) + 1);
    }
  }

  if (residueAtomCounts.size === 0) {
    return null;
  }

  // If preferred ligand code is supplied and present, select it
  if (normalizedPreferred && residueAtomCounts.has(normalizedPreferred)) {
    return {
      resn: normalizedPreferred,
      atomCount: residueAtomCounts.get(normalizedPreferred)!,
    };
  }

  // Otherwise, select the residue with the largest atom count
  let bestResn = '';
  let maxCount = -1;

  for (const [resn, count] of residueAtomCounts.entries()) {
    if (count > maxCount) {
      maxCount = count;
      bestResn = resn;
    }
  }

  if (!bestResn) {
    return null;
  }

  return {
    resn: bestResn,
    atomCount: maxCount,
  };
}

/**
 * Fetches raw PDB coordinates from RCSB PDB with an 8-second timeout.
 *
 * @param pdbId 4-letter PDB identifier (case-insensitive)
 * @param signal Optional external AbortSignal for caller-managed cancellations
 * @returns Raw PDB file text
 */
export async function fetchPdbCoordinates(pdbId: string, signal?: AbortSignal): Promise<string> {
  if (!pdbId || typeof pdbId !== 'string') {
    throw new Error('Invalid PDB ID provided');
  }

  const cleanId = pdbId.trim().toUpperCase();
  const url = `https://files.rcsb.org/download/${cleanId}.pdb`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(new Error(`Timeout fetching PDB coordinates for ${cleanId} (8s limit exceeded)`));
  }, 8000);

  const onAbort = () => {
    controller.abort(signal?.reason ?? new Error('Operation aborted'));
  };

  if (signal) {
    if (signal.aborted) {
      clearTimeout(timeoutId);
      throw signal.reason ?? new Error('Operation aborted');
    }
    signal.addEventListener('abort', onAbort, { once: true });
  }

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      const statusText = response.statusText ? ` ${response.statusText}` : '';
      throw new Error(`Failed to fetch PDB coordinates for ${cleanId}: HTTP ${response.status}${statusText}`);
    }
    return await response.text();
  } catch (err: any) {
    if (controller.signal.aborted && !signal?.aborted) {
      throw new Error(`Failed to fetch PDB coordinates for ${cleanId}: Timeout after 8 seconds`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
    if (signal) {
      signal.removeEventListener('abort', onAbort);
    }
  }
}
