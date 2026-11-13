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
 * Canonical PDB coordinate aliases for curricular drug targets where a specific
 * co-crystal structure with the target drug is required (e.g. 4Z9O GGT1 -> 4ZUD AT1R with Olmesartan).
 */
export const PDB_COORDINATE_ALIASES: Record<string, { actualPdbId: string; ligandCode: string }> = {
  '4Z9O': { actualPdbId: '4ZUD', ligandCode: 'OLM' },
};

/**
 * Curricular ligand code aliases mapping legacy/curriculum codes to actual 3-letter PDB HETATM chemical component IDs.
 */
export const LIGAND_CODE_ALIASES: Record<string, string> = {
  '4Z9': 'OLM',
  'AZD': 'AZJ',
  '1N4': 'LPR',
  '1HW': '117',
  'NEN': '5FW',
  'MPO': 'FLP',
  '10A': 'ROC',
};

/**
 * Common crystallographic buffer salts, solvents, lipids, cryoprotectants,
 * and detergents to exclude when automatically detecting small-molecule drug ligands.
 */
export const EXCLUDED_HETERO_RESIDUES: readonly string[] = [
  'HOH',
  'WAT',
  'CLR', // Cholesterol / membrane lipid additive
  'OLC', // (2R)-2,3-dihydroxypropyl (9Z)-octadec-9-enoate (monoolein lipid)
  'OLA', // Oleic acid lipid
  'BOG', // Octyl beta-D-glucopyranoside detergent
  'OG',  // Octyl glucoside
  'PLM', // Palmitic acid
  '12P', // Polyethylene glycol derivative
  'BU1', // 1,4-butanediol
  'ACM', // Acetamide
  'HEM', // Heme cofactor
  'ADP', // Adenosine-5'-diphosphate cofactor
  'ATP', // Adenosine-5'-triphosphate cofactor
  'NDP', // NADPH cofactor
  'CD',  // Cadmium ion
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

  // If preferred ligand code is supplied and present, select it (or its PDB component alias)
  if (normalizedPreferred) {
    const candidateCodes = [normalizedPreferred];
    if (LIGAND_CODE_ALIASES[normalizedPreferred]) {
      candidateCodes.push(LIGAND_CODE_ALIASES[normalizedPreferred]);
    }
    for (const code of candidateCodes) {
      if (residueAtomCounts.has(code)) {
        return {
          resn: code,
          atomCount: residueAtomCounts.get(code)!,
        };
      }
    }
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
  const actualId = PDB_COORDINATE_ALIASES[cleanId]?.actualPdbId || cleanId;
  const lowerId = actualId.toLowerCase();
  const primaryUrl = `https://www.ebi.ac.uk/pdbe/entry-files/download/pdb${lowerId}.ent`;
  const fallbackUrl = `https://files.rcsb.org/download/${actualId}.pdb`;

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
    let response: Response;
    try {
      response = await fetch(primaryUrl, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`EBI PDBe returned HTTP ${response.status}`);
      }
    } catch (primaryErr) {
      if (controller.signal.aborted) {
        throw primaryErr;
      }
      try {
        response = await fetch(fallbackUrl, { signal: controller.signal });
        if (!response.ok) {
          const statusText = response.statusText ? ` ${response.statusText}` : '';
          throw new Error(`Failed to fetch PDB coordinates for ${cleanId}: HTTP ${response.status}${statusText}`);
        }
      } catch (fallbackErr) {
        if (fallbackErr instanceof Error && fallbackErr.message.startsWith(`Failed to fetch PDB coordinates for ${cleanId}: HTTP`)) {
          throw fallbackErr;
        }
        throw new Error(`Failed to fetch PDB coordinates for ${cleanId}: ${(primaryErr as Error).message}; ${(fallbackErr as Error).message}`);
      }
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
