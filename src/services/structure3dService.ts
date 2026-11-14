/**
 * 3D Molecular Structure Service
 *
 * Provides coordinate fetching from RCSB PDB, heuristic ligand detection,
 * exclusion of crystallographic additives/solvents, and apo protein fallback logic.
 */

export interface CatalyticMetalInfo {
  resn: string;
  chain: string;
  resi: number;
}

export interface DetectedLigandInfo {
  resn: string;
  atomCount: number;
  chain?: string;
  resi?: number;
  instanceCount?: number;
  catalyticMetals?: CatalyticMetalInfo[];
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
  'LFA', // Eicosane / lipid fragment
  'BOG', // Octyl beta-D-glucopyranoside detergent
  'OG',  // Octyl glucoside
  'PLM', // Palmitic acid
  '12P', // Polyethylene glycol derivative
  'PGE', // Triethylene glycol
  'PG4', // Tetraethylene glycol
  'P6G', // Hexaethylene glycol
  'PE4', // Polyethylene glycol
  'BU1', // 1,4-butanediol
  'ACM', // Acetamide
  'HEM', // Heme cofactor
  'ADP', // Adenosine-5'-diphosphate cofactor
  'ATP', // Adenosine-5'-triphosphate cofactor
  'NDP', // NADPH cofactor
  'CD',  // Cadmium ion
  'SO4', // Sulfate ion
  'PO4', // Phosphate ion
  'CIT', // Citrate buffer
  'TAR', // Tartrate buffer
  'MG',  // Magnesium
  'ZN',  // Zinc
  'NA',  // Sodium
  'CL',  // Chloride
  'IOD', // Iodide
  'BR',  // Bromide
  'CA',  // Calcium
  'K',   // Potassium
  'GOL', // Glycerol
  'EDO', // 1,2-ethanediol
  'PEG', // Polyethylene glycol
  'DMS', // Dimethyl sulfoxide
  'ACT', // Acetate
  'BMA', // Beta-D-mannose
  'NAG', // N-acetylglucosamine
  'MAN', // Alpha-D-mannose
  'FUC', // Alpha-L-fucose
  'GAL', // Beta-D-galactose
  'SUC', // Sucrose
  'MAL', // Maltose
  'FMT', // Formate
  'TRS', // Tris buffer
  'BME', // Beta-mercaptoethanol
  'MES', // MES buffer
  'MPD', // 2-methyl-2,4-pentanediol
];

const CATALYTIC_METAL_CODES = new Set(['ZN', 'MG', 'FE', 'MN']);

interface LigandInstanceRecord {
  resn: string;
  chain: string;
  resi: number;
  atomCount: number;
  coords: { x: number; y: number; z: number }[];
}

/**
 * Identifies the primary small-molecule ligand in a PDB coordinate text string,
 * pinning to a single active-site instance (preferring Chain A) and detecting
 * any nearby catalytic metal cofactors within 5.0 Å.
 */
export function identifyLigandResidue(
  pdbData: string,
  preferredLigandCode?: string,
  preferredChain?: string
): DetectedLigandInfo | null {
  if (!pdbData || typeof pdbData !== 'string') return null;

  const excludedSet = new Set(EXCLUDED_HETERO_RESIDUES.map((r) => r.toUpperCase()));
  const normalizedPreferred = preferredLigandCode ? preferredLigandCode.trim().toUpperCase() : undefined;
  const normalizedPreferredChain = preferredChain ? preferredChain.trim().toUpperCase() : undefined;

  const lines = pdbData.split(/\r?\n/);
  const instancesByKey = new Map<string, LigandInstanceRecord>();
  const metalCandidates: { resn: string; chain: string; resi: number; x: number; y: number; z: number }[] = [];

  for (const line of lines) {
    if (line.startsWith('HETATM') && line.length >= 20) {
      const resn = line.substring(17, 20).trim().toUpperCase();
      if (!resn) continue;

      const rawChain = line.length >= 22 ? line.substring(21, 22).trim() : '';
      const chain = rawChain || 'A';
      const rawResi = line.length >= 26 ? parseInt(line.substring(22, 26).trim(), 10) : 1;
      const resi = Number.isFinite(rawResi) ? rawResi : 1;

      const x = line.length >= 38 ? parseFloat(line.substring(30, 38).trim()) : NaN;
      const y = line.length >= 46 ? parseFloat(line.substring(38, 46).trim()) : NaN;
      const z = line.length >= 54 ? parseFloat(line.substring(46, 54).trim()) : NaN;
      const hasCoords = Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z);

      if (CATALYTIC_METAL_CODES.has(resn) && hasCoords) {
        metalCandidates.push({ resn, chain, resi, x, y, z });
      }

      if (excludedSet.has(resn)) {
        continue;
      }

      const key = `${resn}:${chain}:${resi}`;
      let rec = instancesByKey.get(key);
      if (!rec) {
        rec = { resn, chain, resi, atomCount: 0, coords: [] };
        instancesByKey.set(key, rec);
      }
      rec.atomCount += 1;
      if (hasCoords) {
        rec.coords.push({ x, y, z });
      }
    }
  }

  if (instancesByKey.size === 0) {
    return null;
  }

  // Group instances by resn
  const instancesByResn = new Map<string, LigandInstanceRecord[]>();
  for (const rec of instancesByKey.values()) {
    const list = instancesByResn.get(rec.resn) || [];
    list.push(rec);
    instancesByResn.set(rec.resn, list);
  }

  let targetResn = '';

  // 1. Check preferredLigandCode (and its PDB component alias)
  if (normalizedPreferred) {
    const candidateCodes = [normalizedPreferred];
    if (LIGAND_CODE_ALIASES[normalizedPreferred]) {
      candidateCodes.push(LIGAND_CODE_ALIASES[normalizedPreferred]);
    }
    for (const code of candidateCodes) {
      if (instancesByResn.has(code)) {
        targetResn = code;
        break;
      }
    }
  }

  // 2. Otherwise select the residue type whose largest single instance has the most atoms
  if (!targetResn) {
    let maxSingleAtomCount = -1;
    for (const [resn, list] of instancesByResn.entries()) {
      const largestInResn = Math.max(...list.map((inst) => inst.atomCount));
      if (largestInResn > maxSingleAtomCount) {
        maxSingleAtomCount = largestInResn;
        targetResn = resn;
      }
    }
  }

  if (!targetResn) {
    return null;
  }

  const candidateInstances = instancesByResn.get(targetResn)!;

  // Prefer caller's preferredChain first, then Chain A (with largest atomCount), otherwise highest atomCount
  const selectedInstance = [...candidateInstances].sort((a, b) => {
    if (normalizedPreferredChain) {
      const aMatchesPref = a.chain.toUpperCase() === normalizedPreferredChain ? 1 : 0;
      const bMatchesPref = b.chain.toUpperCase() === normalizedPreferredChain ? 1 : 0;
      if (aMatchesPref !== bMatchesPref) return bMatchesPref - aMatchesPref;
    }
    const aIsChainA = a.chain.toUpperCase() === 'A' ? 1 : 0;
    const bIsChainA = b.chain.toUpperCase() === 'A' ? 1 : 0;
    if (aIsChainA !== bIsChainA) return bIsChainA - aIsChainA;
    return b.atomCount - a.atomCount;
  })[0];

  // Detect any catalytic metal within 5.0 Å of the selected ligand instance
  const nearbyMetals: CatalyticMetalInfo[] = [];
  const seenMetals = new Set<string>();
  const cutoffSq = 5.0 * 5.0;

  if (selectedInstance.coords.length > 0 && metalCandidates.length > 0) {
    for (const metal of metalCandidates) {
      const metalKey = `${metal.resn}:${metal.chain}:${metal.resi}`;
      if (seenMetals.has(metalKey)) continue;
      const isClose = selectedInstance.coords.some((c) => {
        const dx = c.x - metal.x;
        const dy = c.y - metal.y;
        const dz = c.z - metal.z;
        return dx * dx + dy * dy + dz * dz <= cutoffSq;
      });
      if (isClose) {
        seenMetals.add(metalKey);
        nearbyMetals.push({ resn: metal.resn, chain: metal.chain, resi: metal.resi });
      }
    }
  }

  return {
    resn: selectedInstance.resn,
    atomCount: selectedInstance.atomCount,
    chain: selectedInstance.chain,
    resi: selectedInstance.resi,
    instanceCount: candidateInstances.length,
    ...(nearbyMetals.length > 0 ? { catalyticMetals: nearbyMetals } : {}),
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
