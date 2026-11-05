import { ChemicalStructure } from '../types/reviewModule';
import { resolveChemicalClass } from './chemicalClassDictionary';

export { resolveChemicalClass } from './chemicalClassDictionary';

/**
 * Safely extracts the Chemical Class from a structure object,
 * resolving authoritative lecture classifications and accommodating
 * various Dexie schema formats (camelCase, snake_case, scaffold, etc.).
 */
export const getChemicalClass = (drug?: Partial<ChemicalStructure> | null): string => {
  return resolveChemicalClass(drug);
};

/**
 * Safely extracts the Target Receptor from a structure object,
 * resolving target_receptor, target, pharmacologicalClass, and related fields.
 */
export const getTargetReceptor = (drug?: Partial<ChemicalStructure> | null): string => {
  if (!drug) return 'Data unavailable';
  const val =
    drug.target_receptor ||
    (drug as any).target_receptor ||
    (drug as any).targetReceptor ||
    drug.target ||
    (drug as any).target ||
    (drug as any).pharmacological_target ||
    (drug as any).pharmacologicalTarget ||
    (drug as any).biological_target ||
    (drug as any).biologicalTarget ||
    (drug as any).targets ||
    drug.pharmacologicalClass ||
    (drug as any).pharmacological_class;

  if (Array.isArray(val)) {
    const valid = val
      .map((t) =>
        typeof t === 'string'
          ? t.trim()
          : typeof t === 'object' && t
          ? (t.name || t.label || t.target || '')
          : String(t ?? '')
      )
      .filter((t) => t && t !== '0' && t !== '—' && t.toLowerCase() !== 'n/a');
    return valid.length > 0 ? valid.join(', ') : 'Data unavailable';
  }

  if (val && typeof val === 'object' && (val as any).value) {
    return `${(val as any).value} ${(val as any).unit || ''}`.trim();
  }

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.length > 0 && trimmed !== '0' && trimmed !== '—' && trimmed.toLowerCase() !== 'n/a') {
      return trimmed;
    }
  }

  return 'Data unavailable';
};

/**
 * Safely extracts Reversibility from a structure object.
 */
export const getReversibility = (drug?: Partial<ChemicalStructure> | null): string => {
  if (!drug) return 'Data unavailable';
  const val =
    (drug as any).clinicalData?.reversibility ||
    drug.reversibility ||
    (drug as any).binding_reversibility ||
    (drug as any).bindingReversibility;

  if (Array.isArray(val)) {
    const valid = val
      .map((r) => (typeof r === 'string' ? r.trim() : String(r ?? '')))
      .filter((r) => r && r !== '0' && r !== '—' && r.toLowerCase() !== 'n/a');
    return valid.length > 0 ? valid.join(', ') : 'Data unavailable';
  }

  if (val && typeof val === 'object' && (val as any).value) {
    return `${(val as any).value} ${(val as any).unit || ''}`.trim();
  }

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.length > 0 && trimmed !== '0' && trimmed !== '—' && trimmed.toLowerCase() !== 'n/a') {
      return trimmed;
    }
  }

  return 'Data unavailable';
};

/**
 * Safely extracts Route of Administration from a structure object.
 */
export const getRouteOfAdmin = (drug?: Partial<ChemicalStructure> | null): string => {
  if (!drug) return 'Data unavailable';
  const val =
    (drug as any).clinicalData?.route_of_administration ||
    drug.route ||
    (drug as any).route_of_admin ||
    (drug as any).routeOfAdmin ||
    (drug as any).administration_route ||
    (drug as any).administrationRoute;

  if (val && typeof val === 'object' && (val as any).value) {
    return `${(val as any).value} ${(val as any).unit || ''}`.trim();
  }

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.length > 0 && trimmed !== '0' && trimmed !== '—' && trimmed.toLowerCase() !== 'n/a') {
      return trimmed;
    }
  }

  return 'Data unavailable';
};

/**
 * Safely extracts Onset of Action from PK/PD highlights or root fields.
 */
export const getOnsetOfAction = (drug?: Partial<ChemicalStructure> | null): string => {
  if (!drug) return 'Data unavailable';
  const val =
    drug.pkPdHighlights?.onset ||
    (drug as any).pk_pd_highlights?.onset ||
    (drug as any).pkPdHighlights?.onset_of_action ||
    (drug as any).pk_pd_highlights?.onset_of_action ||
    (drug as any).onset ||
    (drug as any).onset_of_action ||
    (drug as any).onsetOfAction;

  if (val && typeof val === 'object' && (val as any).value) {
    return `${(val as any).value} ${(val as any).unit || ''}`.trim();
  }

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.length > 0 && trimmed !== '0' && trimmed !== '—' && trimmed.toLowerCase() !== 'n/a') {
      return trimmed;
    }
  }

  return 'Data unavailable';
};

/**
 * Safely extracts Elimination Half-Life from clinicalData, PK/PD highlights, or root fields.
 */
export const getEliminationHalfLife = (drug?: Partial<ChemicalStructure> | null): string => {
  if (!drug) return 'Data unavailable';
  const val =
    (drug as any).clinicalData?.elimination_half_life ||
    (drug as any).clinicalData?.halfLife ||
    drug.pkPdHighlights?.halfLife ||
    (drug as any).pkPdHighlights?.half_life ||
    (drug as any).pk_pd_highlights?.halfLife ||
    (drug as any).pk_pd_highlights?.half_life ||
    (drug as any).eliminationHalfLife ||
    (drug as any).elimination_half_life ||
    (drug as any).halfLife ||
    (drug as any).half_life;

  if (val && typeof val === 'object' && (val as any).value) {
    return `${(val as any).value} ${(val as any).unit || ''}`.trim();
  }

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.length > 0 && trimmed !== '0' && trimmed !== '—' && trimmed.toLowerCase() !== 'n/a') {
      return trimmed;
    }
  }

  return 'Data unavailable';
};

/**
 * Safely extracts Location of Metabolism / Bioactivation Pathway from clinicalData, PK/PD highlights, or root fields.
 */
export const getLocationOfMetabolism = (drug?: Partial<ChemicalStructure> | null): string => {
  if (!drug) return 'Data unavailable';
  const val =
    (drug as any).clinicalData?.location_of_metabolism ||
    (drug as any).location_of_metabolism ||
    (drug as any).clinicalData?.metabolism ||
    drug.pkPdHighlights?.bioactivation ||
    (drug as any).pkPdHighlights?.bioactivation_pathway ||
    (drug as any).pk_pd_highlights?.bioactivation ||
    (drug as any).pk_pd_highlights?.bioactivation_pathway ||
    (drug as any).bioactivation ||
    (drug as any).bioactivation_pathway ||
    (drug as any).bioactivationPathway;

  if (val && typeof val === 'object' && (val as any).value) {
    return `${(val as any).value} ${(val as any).unit || ''}`.trim();
  }

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.length > 0 && trimmed !== '0' && trimmed !== '—' && trimmed.toLowerCase() !== 'n/a') {
      return trimmed;
    }
  }

  return 'Data unavailable';
};

/**
 * Alias for backward compatibility
 */
export const getBioactivationPathway = getLocationOfMetabolism;

/**
 * Safely extracts Drug State ('Active Drug', 'Prodrug', etc.).
 */
export const getDrugState = (drug?: Partial<ChemicalStructure> | null): string => {
  if (!drug) return 'Active Drug';
  const val =
    drug.drug_state ||
    (drug as any).drugState ||
    (drug as any).state;

  if (val && typeof val === 'object' && (val as any).value) {
    return `${(val as any).value} ${(val as any).unit || ''}`.trim();
  }

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.length > 0 && trimmed !== '0' && trimmed !== '—' && trimmed.toLowerCase() !== 'n/a') {
      return trimmed;
    }
  }

  return 'Active Drug';
};

/**
 * Safely extracts Pharmacological Class.
 */
export const getPharmacologicalClass = (drug?: Partial<ChemicalStructure> | null): string => {
  if (!drug) return 'Data unavailable';
  const val =
    drug.pharmacologicalClass ||
    (drug as any).pharmacological_class ||
    (drug as any).pharma_class;

  if (val && typeof val === 'object' && (val as any).value) {
    return `${(val as any).value} ${(val as any).unit || ''}`.trim();
  }

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.length > 0 && trimmed !== '0' && trimmed !== '—' && trimmed.toLowerCase() !== 'n/a') {
      return trimmed;
    }
  }

  return 'Data unavailable';
};

/**
 * Safely extracts MOA Summary or SAR Rationale.
 */
export const getMoaOrSar = (drug?: Partial<ChemicalStructure> | null): string => {
  if (!drug) return 'Data unavailable';
  const val =
    drug.moa_summary ||
    drug.sar_rationale ||
    drug.sarNotes ||
    (drug as any).moa ||
    (drug as any).mechanism_of_action ||
    (drug as any).sar_summary;

  if (val && typeof val === 'object' && (val as any).value) {
    return `${(val as any).value} ${(val as any).unit || ''}`.trim();
  }

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.length > 0 && trimmed !== '0' && trimmed !== '—' && trimmed.toLowerCase() !== 'n/a') {
      return trimmed;
    }
  }

  return 'Data unavailable';
};

/**
 * Combines Target Receptor and Reversibility into a formatted string,
 * e.g. "P2Y12 ADP receptor (Reversible)" or "N/A" / "Data unavailable".
 */
export const resolveTargetAndReversibility = (structure: Partial<ChemicalStructure>): string => {
  const target = getTargetReceptor(structure);
  const rev = getReversibility(structure);
  const validTarget = target !== 'Data unavailable' ? target : null;
  const validRev = rev !== 'Data unavailable' ? rev : null;

  if (validTarget && validRev) {
    return `${validTarget} (${validRev})`;
  }
  if (validTarget) {
    return validTarget;
  }
  if (validRev) {
    return validRev;
  }
  return 'Data unavailable';
};

/**
 * Safely resolves a chemical structure from a pool given a query key
 * (id, normalized id, name, tradeName, cid, or document_label).
 * Prevents dropdown desynchronization across modules and comparators.
 */
export function resolveStructureSafe(
  key: string | undefined | null,
  pool: ChemicalStructure[]
): ChemicalStructure | undefined {
  if (!key || !Array.isArray(pool) || pool.length === 0) return undefined;
  const normalizedKey = key.trim().toLowerCase();
  return (
    pool.find((s) => s.id === key) ||
    pool.find((s) => s.id?.toLowerCase() === normalizedKey) ||
    pool.find((s) => s.name?.toLowerCase() === normalizedKey) ||
    pool.find((s) => s.tradeName?.toLowerCase() === normalizedKey) ||
    pool.find((s) => String(s.cid) === normalizedKey) ||
    pool.find((s) => s.document_label?.toLowerCase() === normalizedKey) ||
    pool.find((s) => s.document_label?.toLowerCase().includes(normalizedKey)) ||
    pool.find((s) => s.name?.toLowerCase().includes(normalizedKey))
  );
}

