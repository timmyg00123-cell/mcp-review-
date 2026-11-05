import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db, getHydratedDrugs, HydratedDrug } from '../db/db';
import { ChemicalStructure, PharmacophoreGroup } from '../types/reviewModule';
import { SmilesCanvas } from './SmilesCanvas';
import {
  ColorPaletteItem,
  PHARMACOPHORE_COLOR_PALETTE,
  getPharmacophoresForStructure,
  parsePharmacophoreName,
} from '../utils/pharmacophoreData';
import { getCorrectedSmarts } from '../utils/smartsDictionary';
import {
  getChemicalClass,
  getTargetReceptor,
  getReversibility,
  getRouteOfAdmin,
  getOnsetOfAction,
  getEliminationHalfLife,
  getBioactivationPathway,
  getDrugState,
  getPharmacologicalClass,
  getMoaOrSar,
} from '../utils/structureDataUtils';
import {
  ArrowRightLeft,
  ExternalLink,
  ShieldCheck,
  Search,
  Copy,
  Check,
  Maximize2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { fetchPubChemXLogP } from '../services/pubchemService';
import { medChemGraphDb } from '../db/medChemGraphDb';
import { ComparatorViewMode, resolveComparatorViewMode } from '../utils/comparatorViewMode';
import { resolveChemicalClass as resolveAuthChemicalClass } from '../utils/chemicalClassDictionary';

/**
 * Predefined array of distinct colors for simultaneous multi-pharmacophore highlighting:
 * Green (decalin core), Blue (headgroup), Purple, Amber, Pink, Cyan, Red.
 */
export const PHARMACOPHORE_PALETTE = [
  {
    hex: '#10b981', // Green (e.g. decalin core)
    name: 'Green',
    borderClass: 'border-emerald-500',
    bgClass: 'bg-emerald-500',
    textClass: 'text-emerald-700 dark:text-emerald-300',
    lightBgClass: 'bg-emerald-50 dark:bg-emerald-950/60',
    ringClass: 'ring-emerald-400',
  },
  {
    hex: '#3b82f6', // Blue (e.g. headgroup)
    name: 'Blue',
    borderClass: 'border-blue-500',
    bgClass: 'bg-blue-500',
    textClass: 'text-blue-700 dark:text-blue-300',
    lightBgClass: 'bg-blue-50 dark:bg-blue-950/60',
    ringClass: 'ring-blue-400',
  },
  {
    hex: '#8b5cf6', // Purple
    name: 'Purple',
    borderClass: 'border-purple-500',
    bgClass: 'bg-purple-500',
    textClass: 'text-purple-700 dark:text-purple-300',
    lightBgClass: 'bg-purple-50 dark:bg-purple-950/60',
    ringClass: 'ring-purple-400',
  },
  {
    hex: '#f59e0b', // Amber
    name: 'Amber',
    borderClass: 'border-amber-500',
    bgClass: 'bg-amber-500',
    textClass: 'text-amber-700 dark:text-amber-300',
    lightBgClass: 'bg-amber-50 dark:bg-amber-950/60',
    ringClass: 'ring-amber-400',
  },
  {
    hex: '#ec4899', // Pink
    name: 'Pink',
    borderClass: 'border-pink-500',
    bgClass: 'bg-pink-500',
    textClass: 'text-pink-700 dark:text-pink-300',
    lightBgClass: 'bg-pink-50 dark:bg-pink-950/60',
    ringClass: 'ring-pink-400',
  },
  {
    hex: '#06b6d4', // Cyan
    name: 'Cyan',
    borderClass: 'border-cyan-500',
    bgClass: 'bg-cyan-500',
    textClass: 'text-cyan-700 dark:text-cyan-300',
    lightBgClass: 'bg-cyan-50 dark:bg-cyan-950/60',
    ringClass: 'ring-cyan-400',
  },
  {
    hex: '#ef4444', // Red
    name: 'Red',
    borderClass: 'border-red-500',
    bgClass: 'bg-red-500',
    textClass: 'text-red-700 dark:text-red-300',
    lightBgClass: 'bg-red-50 dark:bg-red-950/60',
    ringClass: 'ring-red-400',
  },
];

/**
 * Predefined palette mapping to index for simultaneous multi-pharmacophore tag selection:
 * Blue (#2563eb), Green (#16a34a), Amber (#d97706), Red (#dc2626), Purple, Cyan, Pink
 */
export const ACTIVE_TAG_PALETTE = [
  '#2563eb', // Blue
  '#16a34a', // Green
  '#d97706', // Amber
  '#dc2626', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#ec4899', // Pink
];

export interface ActivePharmacophoreTag extends PharmacophoreGroup {
  smarts: string;
  color: string;
}

export function getPharmacophoreColor(
  tag: PharmacophoreGroup,
  pharmacophoreList: PharmacophoreGroup[]
) {
  const index = pharmacophoreList.findIndex(
    (p) => p.id === tag.id || p.name.trim().toLowerCase() === tag.name.trim().toLowerCase()
  );
  const safeIndex = index >= 0 ? index : 0;
  return PHARMACOPHORE_PALETTE[safeIndex % PHARMACOPHORE_PALETTE.length];
}

export interface StructureComparatorProps {
  drugs?: HydratedDrug[];
  moduleStructures?: ChemicalStructure[];
  structureA?: ChemicalStructure;
  structureB?: ChemicalStructure;
  drugAKey?: string;
  drugBKey?: string;
  onSelectDrugA?: (key: string) => void;
  onSelectDrugB?: (key: string) => void;
  onSwapDrugs?: () => void;
  onInspectStructure?: (structure: ChemicalStructure) => void;
  onExpandStudio?: () => void;
  allStructures?: ChemicalStructure[];
  globalActivePharmacophores?: Record<string, ColorPaletteItem>;
  globalHoveredPharmacophoreId?: string | null;
  focusMatchingOnly?: boolean;
  hideDrugName?: boolean;
  examModeActive?: boolean;
  viewMode?: ComparatorViewMode;
  onViewModeChange?: (mode: 'single' | 'compare') => void;
}

/**
 * Strips all bracketed text (e.g. "[IV] ", "[rosuvastatin] ") and trims whitespace.
 */
export function stripBracketedText(name?: string): string {
  if (!name) return '';
  return name.replace(/\[.*?\]\s*/g, '').trim();
}

/**
 * Strips bracketed text and prefixes to produce the clean canonical drug name (e.g. "Rosuvastatin").
 */
export function getBaseDrugName(rawName?: string): string {
  if (!rawName) return '';
  let cleaned = rawName.replace(/\[.*?\]\s*/g, '').trim();
  cleaned = cleaned.replace(/^(?:structure|compound|drug)\s+[a-z0-9ivxlcdm]+\s*[-:–]?\s*/i, '').trim();

  if (cleaned.length > 0) return cleaned;

  // If stripping the bracket prefix emptied the string (e.g. "[Rosuvastatin]"), extract inside brackets
  const insideBracket = rawName.match(/^\[([^\]]+)\]/);
  if (insideBracket && insideBracket[1]) {
    return insideBracket[1].trim();
  }
  return rawName.trim();
}

/**
 * Returns a canonical key for matching/deduplicating drugs, stripping parenthetical trade names.
 */
export function getCanonicalDrugKey(rawName?: string): string {
  if (!rawName) return '';
  const base = getBaseDrugName(rawName);
  return base
    .replace(/\s*\([^)]*\)$/g, '') // remove trailing trade name e.g. (Crestor)
    .replace(/[^\w\s-]/g, '')      // strip any brackets or special punctuation
    .trim()
    .toLowerCase();
}

/**
 * Safely resolves Chemical Class using authoritative MedChem II lecture dictionary
 */
export function resolveChemicalClass(drug?: Partial<ChemicalStructure> | null): string {
  return resolveAuthChemicalClass(drug);
}

/**
 * Safely resolves Target checking graph database relationships, multiple naming conventions,
 * and chemoinformatics fallbacks (e.g. HMG-CoA reductase for statins), ensuring it NEVER renders a literal 0 or missing data.
 */
export function resolveTarget(
  drug?: Partial<ChemicalStructure> | null,
  graphTargetMap?: Record<string, string>
): string {
  if (!drug) return 'N/A';

  // 1. Prioritize graph database target resolved from db.relationships & db.entities
  if (graphTargetMap) {
    const rawId = drug.id || '';
    const rawName = drug.name || '';
    const cleanName = stripBracketedText(rawName);
    const fromGraph =
      (rawId && graphTargetMap[rawId]) ||
      (rawId && graphTargetMap[rawId.toLowerCase()]) ||
      (rawId && graphTargetMap[getCanonicalDrugKey(rawId)]) ||
      (rawName && graphTargetMap[rawName]) ||
      (rawName && graphTargetMap[rawName.toLowerCase()]) ||
      (rawName && graphTargetMap[getCanonicalDrugKey(rawName)]) ||
      (cleanName && graphTargetMap[cleanName.toLowerCase()]) ||
      (cleanName && graphTargetMap[getCanonicalDrugKey(cleanName)]);
    if (fromGraph && fromGraph !== '0' && fromGraph !== '—' && fromGraph.toLowerCase() !== 'n/a') {
      return fromGraph;
    }
  }

  const arrayCandidates = [
    (drug as any).target_receptor,
    drug.target,
    (drug as any).targets,
    (drug as any).targetReceptor,
    (drug as any).pharmacological_target,
    (drug as any).pharmacologicalTarget,
    (drug as any).biological_target,
    (drug as any).biologicalTarget,
  ];

  for (const candidate of arrayCandidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      const filtered = candidate
        .map((item) =>
          typeof item === 'string'
            ? item.trim()
            : typeof item === 'object' && item
            ? item.name || item.label || item.target || ''
            : String(item ?? '')
        )
        .filter((t) => t && t !== '0' && t !== '—' && t.toLowerCase() !== 'n/a');
      if (filtered.length > 0) {
        return filtered.join(', ');
      }
    }
  }

  const val =
    (drug as any).target_receptor ||
    drug.target ||
    (drug as any).targetReceptor ||
    (drug as any).targets ||
    (drug as any).pharmacological_target ||
    (drug as any).pharmacologicalTarget ||
    (drug as any).biological_target ||
    (drug as any).biologicalTarget ||
    (drug as any).receptor ||
    drug.pharmacologicalClass ||
    (drug as any).pharmacological_class;

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (
      trimmed &&
      trimmed !== '0' &&
      trimmed !== '—' &&
      trimmed.toLowerCase() !== 'data unavailable' &&
      trimmed.toLowerCase() !== 'n/a'
    ) {
      return trimmed;
    }
  }

  const fallback = getTargetReceptor(drug);
  if (fallback && fallback !== 'Data unavailable' && fallback !== '0' && fallback !== '—') {
    return fallback;
  }

  // 2. Strict Chemoinformatics & MedChem Target Fallback for statins
  const lowerName = (drug.name || '').toLowerCase();
  const lowerId = (drug.id || '').toLowerCase();
  const lowerClass = (drug.chemicalClass || (drug as any).chemical_class || '').toLowerCase();
  const lowerPharma = (drug.pharmacologicalClass || (drug as any).pharmacological_class || '').toLowerCase();
  const lowerMoa = (
    (drug as any).moa_summary ||
    (drug as any).clinical_and_sar_summary ||
    drug.sarNotes ||
    ''
  ).toLowerCase();

  if (
    lowerName.endsWith('statin') ||
    lowerName.includes('statin') ||
    lowerId.includes('statin') ||
    lowerClass.includes('statin') ||
    lowerClass.includes('hmg-coa') ||
    lowerPharma.includes('hmg-coa') ||
    lowerMoa.includes('hmg-coa')
  ) {
    return 'HMG-CoA reductase';
  }

  return 'N/A';
}

/**
 * Safely resolves Reversibility checking multiple naming conventions
 */
export function resolveReversibility(drug?: Partial<ChemicalStructure> | null): string {
  if (!drug) return 'N/A';

  if ((drug as any).clinicalData?.reversibility) {
    const val = (drug as any).clinicalData.reversibility.trim();
    if (val && val !== '0' && val !== '—' && val.toLowerCase() !== 'n/a') {
      return val;
    }
  }

  const arrayCandidates = [
    drug.reversibility,
    (drug as any).binding_reversibility,
    (drug as any).bindingReversibility,
  ];

  for (const candidate of arrayCandidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      const filtered = candidate
        .map((r) => (typeof r === 'string' ? r.trim() : String(r ?? '')))
        .filter((r) => r && r !== '0' && r !== '—' && r.toLowerCase() !== 'n/a');
      if (filtered.length > 0) {
        return filtered.join(', ');
      }
    }
  }

  const val =
    drug.reversibility ||
    (drug as any).binding_reversibility ||
    (drug as any).bindingReversibility ||
    (drug as any).reversibility_type;

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (
      trimmed &&
      trimmed !== '0' &&
      trimmed !== '—' &&
      trimmed.toLowerCase() !== 'data unavailable' &&
      trimmed.toLowerCase() !== 'n/a'
    ) {
      return trimmed;
    }
  }

  const fallback = getReversibility(drug);
  if (fallback && fallback !== 'Data unavailable' && fallback !== '0' && fallback !== '—') {
    return fallback;
  }

  return 'N/A';
}

/**
 * Safely resolves Route of Administration checking multiple naming conventions
 */
export function resolveRoute(drug?: Partial<ChemicalStructure> | null): string {
  if (!drug) return 'N/A';

  if ((drug as any).clinicalData?.route_of_administration) {
    const val = (drug as any).clinicalData.route_of_administration.trim();
    if (val && val !== '0' && val !== '—' && val.toLowerCase() !== 'n/a') {
      return val;
    }
  }

  const arrayCandidates = [
    drug.route,
    (drug as any).route_of_admin,
    (drug as any).routeOfAdmin,
    (drug as any).administration_route,
    (drug as any).administrationRoute,
  ];

  for (const candidate of arrayCandidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      const filtered = candidate
        .map((r) => (typeof r === 'string' ? r.trim() : String(r ?? '')))
        .filter((r) => r && r !== '0' && r !== '—' && r.toLowerCase() !== 'n/a');
      if (filtered.length > 0) {
        return filtered.join(', ');
      }
    }
  }

  const val =
    drug.route ||
    (drug as any).route_of_admin ||
    (drug as any).routeOfAdmin ||
    (drug as any).administration_route ||
    (drug as any).administrationRoute ||
    (drug as any).route_of_administration ||
    (drug as any).routeOfAdministration;

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (
      trimmed &&
      trimmed !== '0' &&
      trimmed !== '—' &&
      trimmed.toLowerCase() !== 'data unavailable' &&
      trimmed.toLowerCase() !== 'n/a'
    ) {
      return trimmed;
    }
  }

  const fallback = getRouteOfAdmin(drug);
  if (fallback && fallback !== 'Data unavailable' && fallback !== '0' && fallback !== '—') {
    return fallback;
  }

  return 'N/A';
}

/**
 * Safely resolves Onset of Action checking multiple naming conventions
 */
export function resolveOnset(drug?: Partial<ChemicalStructure> | null): string {
  if (!drug) return 'N/A';
  const val =
    drug.pkPdHighlights?.onset ||
    (drug as any).pk_pd_highlights?.onset ||
    (drug as any).onset ||
    (drug as any).onset_of_action ||
    (drug as any).onsetOfAction;

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (
      trimmed &&
      trimmed !== '0' &&
      trimmed !== '—' &&
      trimmed.toLowerCase() !== 'data unavailable' &&
      trimmed.toLowerCase() !== 'n/a'
    ) {
      return trimmed;
    }
  }

  const fallback = getOnsetOfAction(drug);
  if (fallback && fallback !== 'Data unavailable' && fallback !== '0' && fallback !== '—') {
    return fallback;
  }

  return 'N/A';
}

/**
 * Safely resolves Elimination Half-Life checking multiple naming conventions
 */
export function resolveHalfLife(drug?: Partial<ChemicalStructure> | null): string {
  if (!drug) return 'N/A';

  const clinicalHalfLife =
    (drug as any).clinicalData?.elimination_half_life ||
    (drug as any).elimination_half_life ||
    (drug as any).clinicalData?.halfLife;

  if (clinicalHalfLife) {
    if (typeof clinicalHalfLife === 'object' && clinicalHalfLife.value) {
      return `${clinicalHalfLife.value} ${clinicalHalfLife.unit || ''}`.trim();
    }
    if (typeof clinicalHalfLife === 'string') {
      const trimmed = clinicalHalfLife.trim();
      if (trimmed && trimmed !== '0' && trimmed !== '—' && trimmed.toLowerCase() !== 'n/a') {
        return trimmed;
      }
    }
  }

  const val =
    drug.pkPdHighlights?.halfLife ||
    (drug as any).pkPdHighlights?.half_life ||
    (drug as any).pk_pd_highlights?.halfLife ||
    (drug as any).pk_pd_highlights?.half_life ||
    (drug as any).halfLife ||
    (drug as any).half_life ||
    (drug as any).eliminationHalfLife ||
    (drug as any).elimination_half_life;

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (
      trimmed &&
      trimmed !== '0' &&
      trimmed !== '—' &&
      trimmed.toLowerCase() !== 'data unavailable' &&
      trimmed.toLowerCase() !== 'n/a'
    ) {
      return trimmed;
    }
  }

  const fallback = getEliminationHalfLife(drug);
  if (fallback && fallback !== 'Data unavailable' && fallback !== '0' && fallback !== '—') {
    return fallback;
  }

  return 'N/A';
}

/**
 * Safely resolves Location of Metabolism checking clinicalData, multiple naming conventions, and fallbacks
 */
export function resolveLocationOfMetabolism(drug?: Partial<ChemicalStructure> | null): string {
  if (!drug) return 'N/A';

  const pathway = (drug as any).clinicalData?.metabolism_pathway || (drug as any).metabolism_pathway;
  if (Array.isArray(pathway) && pathway.length > 0) {
    return pathway.join(' ➔ ');
  }

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

  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (
      trimmed &&
      trimmed !== '0' &&
      trimmed !== '—' &&
      trimmed.toLowerCase() !== 'data unavailable' &&
      trimmed.toLowerCase() !== 'n/a'
    ) {
      return trimmed;
    }
  }

  const fallback = getBioactivationPathway(drug);
  if (fallback && fallback !== 'Data unavailable' && fallback !== '0' && fallback !== '—') {
    return fallback;
  }

  return 'N/A';
}

/**
 * Backward compatibility alias for resolveLocationOfMetabolism
 */
export const resolveBioactivation = resolveLocationOfMetabolism;

/**
 * Combines Target Receptor and Reversibility into a formatted string,
 * e.g. "P2Y12 ADP receptor (Reversible)" or "N/A", never rendering literal 0.
 */
export function resolveTargetAndReversibilitySafe(
  structure?: Partial<ChemicalStructure> | null,
  graphTargetMap?: Record<string, string>
): string {
  if (!structure) return 'N/A';
  const target = resolveTarget(structure, graphTargetMap);
  const rev = resolveReversibility(structure);
  const hasTarget = target !== 'N/A' && target !== '0' && target !== '—';
  const hasRev = rev !== 'N/A' && rev !== '0' && rev !== '—';

  if (hasTarget && hasRev) {
    return `${target} (${rev})`;
  }
  if (hasTarget) {
    return target;
  }
  if (hasRev) {
    return rev;
  }
  return 'N/A';
}

/**
 * Resolves dynamic contrast sentence injecting opposing drug name:
 * "Unlike ${drugB.name}, ${drugA.name} ${drugA.clinicalData.unique_differentiator}."
 */
export function resolveContrast(
  drugA?: Partial<ChemicalStructure> | null,
  drugB?: Partial<ChemicalStructure> | null
): string {
  if (!drugA) return 'N/A';
  const rawDiff =
    (drugA as any)?.clinicalData?.unique_differentiator ||
    (drugA as any)?.unique_differentiator ||
    drugA.sarNotes ||
    (drugA as any)?.sar_rationale;

  if (!rawDiff || typeof rawDiff !== 'string') return 'N/A';
  const trimmed = rawDiff.trim();
  if (!trimmed || trimmed === 'N/A' || trimmed === '—') return 'N/A';

  const opposingName = drugB?.name ? stripBracketedText(drugB.name) || drugB.name : 'comparator';
  const currentName = drugA.name ? stripBracketedText(drugA.name) || drugA.name : 'This compound';

  if (trimmed.toLowerCase().startsWith('unlike')) {
    return trimmed;
  }
  const cleanSentence = trimmed.endsWith('.') ? trimmed.slice(0, -1) : trimmed;
  return `Unlike ${opposingName}, ${currentName} ${cleanSentence}.`;
}

/**
 * Safely resolves Structural Differences between compounds
 */
export function resolveStructuralDifferences(
  drugA?: Partial<ChemicalStructure> | null,
  drugB?: Partial<ChemicalStructure> | null
): string {
  if (!drugA) return 'N/A';
  const val =
    drugA.structural_differences ||
    (drugA as any)?.clinicalData?.structural_differences ||
    (drugA as any)?.structuralDifferences;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed && trimmed !== '0' && trimmed !== '—' && trimmed.toLowerCase() !== 'n/a') {
      return trimmed;
    }
  }
  return 'N/A';
}

/**
 * Safely resolves PK/PD Profile contrast between compounds
 */
export function resolvePkPdProfile(
  drugA?: Partial<ChemicalStructure> | null,
  drugB?: Partial<ChemicalStructure> | null
): string {
  if (!drugA) return 'N/A';
  const val =
    drugA.pk_pd_profile ||
    (drugA as any)?.clinicalData?.pk_pd_profile ||
    (drugA as any)?.pkPdProfile;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed && trimmed !== '0' && trimmed !== '—' && trimmed.toLowerCase() !== 'n/a') {
      return trimmed;
    }
  }
  return 'N/A';
}

/**
 * Safely resolves Clinical Use Cases contrast between compounds
 */
export function resolveClinicalUseCases(
  drugA?: Partial<ChemicalStructure> | null,
  drugB?: Partial<ChemicalStructure> | null
): string {
  if (!drugA) return 'N/A';
  const val =
    drugA.clinical_use_cases ||
    (drugA as any)?.clinicalData?.clinical_use_cases ||
    (drugA as any)?.clinicalUseCases;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed && trimmed !== '0' && trimmed !== '—' && trimmed.toLowerCase() !== 'n/a') {
      return trimmed;
    }
  }
  return 'N/A';
}

/**
 * Merges two ChemicalStructure objects for the same drug, preserving rich fields
 * (chemicalClass, target, reversibility, pubchemAudit, PK/PD parameters) from whichever object has them.
 */
function mergeDrugStructures(
  existing: ChemicalStructure,
  incoming: ChemicalStructure,
  canonicalName: string
): ChemicalStructure {
  const pickRich = (a: any, b: any) => {
    const isBad = (v: any) =>
      !v ||
      v === 'Data unavailable' ||
      v === 'N/A' ||
      v === 'Small molecule compound' ||
      v === '—' ||
      v === '0' ||
      v === 0;
    if (!isBad(a)) return a;
    if (!isBad(b)) return b;
    return a || b;
  };

  const isRomanOrShort = (lbl?: string) =>
    Boolean(lbl && lbl.length <= 6 && !lbl.toLowerCase().includes(canonicalName.toLowerCase()));

  const docLabel = isRomanOrShort(existing.document_label)
    ? existing.document_label
    : isRomanOrShort(incoming.document_label)
    ? incoming.document_label
    : undefined;

  const resolvedSmiles =
    existing.canonicalSmiles ||
    incoming.canonicalSmiles ||
    existing.smiles ||
    incoming.smiles ||
    existing.pubchemAudit?.canonicalSmiles ||
    incoming.pubchemAudit?.canonicalSmiles ||
    (existing as any).chemData?.canonicalSmiles ||
    (incoming as any).chemData?.canonicalSmiles;

  const resolvedMolBlock =
    existing.pubchemMolBlock ||
    incoming.pubchemMolBlock ||
    (existing as any).chemData?.pubchemMolBlock ||
    (incoming as any).chemData?.pubchemMolBlock;

  return {
    ...incoming,
    ...existing,
    id: existing.id || incoming.id,
    name: canonicalName,
    document_label: docLabel,
    tradeName: existing.tradeName || incoming.tradeName,
    canonicalSmiles: resolvedSmiles,
    smiles: resolvedSmiles,
    pubchemMolBlock: resolvedMolBlock,
    chemicalClass:
      pickRich(
        (existing as any).chemical_class || existing.chemicalClass,
        (incoming as any).chemical_class || incoming.chemicalClass
      ) ||
      existing.chemicalClass ||
      incoming.chemicalClass ||
      'N/A',
    target:
      pickRich(
        (existing as any).target_receptor || existing.target,
        (incoming as any).target_receptor || incoming.target
      ) ||
      existing.target ||
      incoming.target ||
      'N/A',
    target_receptor:
      pickRich(
        (existing as any).target_receptor || (existing as any).targetReceptor || existing.target,
        (incoming as any).target_receptor || (incoming as any).targetReceptor || incoming.target
      ) ||
      (existing as any).target_receptor ||
      (incoming as any).target_receptor ||
      'N/A',
    reversibility:
      pickRich(
        (existing as any).binding_reversibility || existing.reversibility,
        (incoming as any).binding_reversibility || incoming.reversibility
      ) ||
      existing.reversibility ||
      incoming.reversibility ||
      'N/A',
    route:
      pickRich(
        (existing as any).route_of_admin || (existing as any).routeOfAdmin || existing.route,
        (incoming as any).route_of_admin || (incoming as any).routeOfAdmin || incoming.route
      ) ||
      existing.route ||
      incoming.route ||
      'N/A',
    drug_state: pickRich(existing.drug_state, incoming.drug_state) || existing.drug_state || incoming.drug_state,
    cid: existing.cid || incoming.cid,
    pngUrl: existing.pngUrl || incoming.pngUrl,
    pubchemAudit: {
      ...(existing.pubchemAudit?.status === 'verified'
        ? existing.pubchemAudit
        : incoming.pubchemAudit?.status === 'verified'
        ? incoming.pubchemAudit
        : existing.pubchemAudit || incoming.pubchemAudit || {}),
      canonicalSmiles:
        resolvedSmiles ||
        existing.pubchemAudit?.canonicalSmiles ||
        incoming.pubchemAudit?.canonicalSmiles,
    },
    pkPdHighlights: {
      onset: pickRich(existing.pkPdHighlights?.onset || (existing as any).pk_pd_highlights?.onset, incoming.pkPdHighlights?.onset || (incoming as any).pk_pd_highlights?.onset) || '',
      duration: pickRich(existing.pkPdHighlights?.duration || (existing as any).pk_pd_highlights?.duration, incoming.pkPdHighlights?.duration || (incoming as any).pk_pd_highlights?.duration) || '',
      halfLife: pickRich(existing.pkPdHighlights?.halfLife || (existing as any).pk_pd_highlights?.halfLife || (existing as any).half_life, incoming.pkPdHighlights?.halfLife || (incoming as any).pk_pd_highlights?.halfLife || (incoming as any).half_life) || '',
      elimination: pickRich(existing.pkPdHighlights?.elimination || (existing as any).pk_pd_highlights?.elimination, incoming.pkPdHighlights?.elimination || (incoming as any).pk_pd_highlights?.elimination) || '',
      bioactivation: pickRich(existing.pkPdHighlights?.bioactivation || (existing as any).pk_pd_highlights?.bioactivation, incoming.pkPdHighlights?.bioactivation || (incoming as any).pk_pd_highlights?.bioactivation) || '',
    },
    pharmacophores:
      (existing.pharmacophores && existing.pharmacophores.length > 0)
        ? existing.pharmacophores
        : incoming.pharmacophores || [],
    moa_summary: pickRich(existing.moa_summary, incoming.moa_summary) || existing.moa_summary || incoming.moa_summary,
    sar_rationale: pickRich(existing.sar_rationale, incoming.sar_rationale) || existing.sar_rationale || incoming.sar_rationale,
    sarNotes: pickRich(existing.sarNotes, incoming.sarNotes) || existing.sarNotes || incoming.sarNotes,
    clinicalData: incoming.clinicalData || existing.clinicalData,
    location_of_metabolism: (incoming as any).location_of_metabolism || (existing as any).location_of_metabolism,
    elimination_half_life: (incoming as any).elimination_half_life || (existing as any).elimination_half_life,
    metabolism_pathway: (incoming as any).metabolism_pathway || (existing as any).metabolism_pathway,
    unique_differentiator: (incoming as any).unique_differentiator || (existing as any).unique_differentiator,
    structural_differences: (incoming as any).structural_differences || (existing as any).structural_differences,
    pk_pd_profile: (incoming as any).pk_pd_profile || (existing as any).pk_pd_profile,
    clinical_use_cases: (incoming as any).clinical_use_cases || (existing as any).clinical_use_cases,
  };
}

export const StructureComparator: React.FC<StructureComparatorProps> = ({
  drugs: propsDrugs,
  moduleStructures,
  structureA,
  structureB,
  drugAKey,
  drugBKey,
  onSelectDrugA,
  onSelectDrugB,
  onSwapDrugs,
  onInspectStructure,
  onExpandStudio,
  allStructures,
  globalActivePharmacophores = {},
  globalHoveredPharmacophoreId = null,
  focusMatchingOnly = false,
  hideDrugName = false,
  examModeActive = false,
  viewMode = 'auto',
  onViewModeChange,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Pharmacophore tag tracking state: arrays of active tags with assigned colors for Compound A and Compound B independently
  const [activeTagsA, setActiveTagsA] = useState<ActivePharmacophoreTag[]>([]);
  const [hoveredTagA, setHoveredTagA] = useState<PharmacophoreGroup | null>(null);

  const [activeTagsB, setActiveTagsB] = useState<ActivePharmacophoreTag[]>([]);
  const [hoveredTagB, setHoveredTagB] = useState<PharmacophoreGroup | null>(null);

  // Exclusive Tooltip state for Pharmacophore tags (click-away dismissal)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const activeTooltipRef = useRef<HTMLDivElement | null>(null);
  const activeTagRef = useRef<HTMLElement | null>(null);

  // Click-away listener: dismisses the active tooltip when clicking outside its ref
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        activeTooltipRef.current &&
        !activeTooltipRef.current.contains(target) &&
        (!activeTagRef.current || !activeTagRef.current.contains(target))
      ) {
        setActiveTooltip(null);
      }
    };

    if (activeTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [activeTooltip]);

  // Section ref to scroll smoothly back to comparator matrix from sticky portals
  const comparatorSectionRef = useRef<HTMLElement | null>(null);

  // Drag and drop state for Compound A and Compound B drop zones
  const [isDragOverA, setIsDragOverA] = useState(false);
  const [isDragOverB, setIsDragOverB] = useState(false);

  // Differential Matrix collapsible state (default collapsed) and dynamic LogP cache
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [dynamicallyFetchedLogP, setDynamicallyFetchedLogP] = useState<Record<number, number>>({});

  // TanStack Query: Fetch deduplicated, fully hydrated drugs from graph database
  const { data: queriedDrugs = [] } = useQuery<HydratedDrug[]>({
    queryKey: ['hydratedDrugs'],
    queryFn: getHydratedDrugs,
  });
  const drugs = propsDrugs && propsDrugs.length > 0 ? propsDrugs : queriedDrugs;
  const hydratedDrugs = drugs;

  // Map drug IDs, aliases, and names to target receptor from the hydrated graph layer
  const graphTargetMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const d of hydratedDrugs) {
      const targetName = d.target?.name;
      if (!targetName || targetName === 'N/A' || targetName === '0' || targetName === '—') continue;
      const rawId = d.id || '';
      const rawName = d.name || '';
      const cleanName = stripBracketedText(rawName);
      const srcKey = getCanonicalDrugKey(rawName);
      if (rawId) {
        map[rawId] = targetName;
        map[rawId.toLowerCase()] = targetName;
      }
      if (rawName) {
        map[rawName] = targetName;
        map[rawName.toLowerCase()] = targetName;
      }
      if (cleanName) {
        map[cleanName.toLowerCase()] = targetName;
      }
      if (srcKey) {
        map[srcKey] = targetName;
      }
    }
    return map;
  }, [hydratedDrugs]);

  // Convert hydrated graph drugs to ChemicalStructure format for comparator hydration
  const dexieStructures = useMemo(() => {
    if (!hydratedDrugs || hydratedDrugs.length === 0) return [];
    return hydratedDrugs.map((d) => {
      const chem = d.chemData || {};
      const smiles =
        d.canonicalSmiles ||
        d.smiles ||
        chem.canonicalSmiles ||
        chem.isomericSmiles ||
        d.pubchemAudit?.canonicalSmiles;
      const molBlock = d.pubchemMolBlock || chem.pubchemMolBlock;
      const targetName = d.target?.name || d.target_receptor || (d as any).target || 'N/A';
      const className = d.clinicalClass?.name || d.chemical_class || d.chemicalClass || 'N/A';

      return {
        id: d.id,
        name: d.name || d.id,
        document_label: d.document_label,
        canonicalSmiles: smiles,
        smiles: smiles,
        pubchemMolBlock: molBlock,
        chemicalClass: className,
        chemical_class: className,
        pharmacologicalClass: d.pharmacological_class || d.pharmacologicalClass || className,
        pharmacological_class: d.pharmacological_class || d.pharmacologicalClass || className,
        cid: d.cid || chem.cid,
        pngUrl: (d as any).pngUrl || chem.structureImageDataUrl || '',
        target: targetName,
        target_receptor: targetName,
        reversibility: d.reversibility || (d as any).binding_reversibility || 'N/A',
        route: d.route || (d as any).route_of_admin || 'N/A',
        route_of_admin: (d as any).route_of_admin || d.route,
        clinicalData: d.clinicalData,
        location_of_metabolism: d.location_of_metabolism || d.clinicalData?.location_of_metabolism,
        elimination_half_life: d.elimination_half_life || d.clinicalData?.elimination_half_life,
        metabolism_pathway: d.metabolism_pathway || d.clinicalData?.metabolism_pathway,
        unique_differentiator: d.unique_differentiator || d.clinicalData?.unique_differentiator,
        keyFunctionalGroups: (d as any).keyFunctionalGroups || [],
        pharmacophores: (d.pharmacophores && d.pharmacophores.length > 0)
          ? d.pharmacophores.map((p) => ({
              id: p.id,
              name: p.name,
              smarts: p.smarts,
              color: p.color,
              category: (p as any).category || 'binding',
              purpose: p.description,
              description: p.description,
            }))
          : (d as any).pharmacophores || [],
        pkPdHighlights: d.pkPdHighlights || (d as any).pk_pd_highlights || {
          onset: (d as any).onset || '',
          duration: '',
          halfLife: (d as any).half_life || d.elimination_half_life || d.clinicalData?.elimination_half_life || '',
          elimination: '',
          bioactivation: (d as any).bioactivation || d.location_of_metabolism || d.clinicalData?.location_of_metabolism || '',
        },
        sarNotes: d.clinical_and_sar_summary || (d as any).sarNotes || '',
        moa_summary: d.moa_summary || d.clinical_and_sar_summary || '',
        pubchemAudit: d.pubchemAudit
          ? {
              ...d.pubchemAudit,
              canonicalSmiles: smiles || d.pubchemAudit.canonicalSmiles,
            }
          : {
              cid: d.cid || chem.cid || 0,
              status: 'verified',
              verifiedAt: d.updatedAt || new Date().toISOString(),
              source: 'nih_pug_rest',
              canonicalSmiles: smiles,
              pubChemUrl: d.cid ? `https://pubchem.ncbi.nlm.nih.gov/compound/${d.cid}` : '',
            },
      } as ChemicalStructure;
    });
  }, [hydratedDrugs]);

  // 1. Resolve effective available structures strictly scoped to moduleStructures and deduplicated by drug name
  const effectiveStructures = useMemo(() => {
    let list: ChemicalStructure[] = [];
    if (moduleStructures && moduleStructures.length > 0) {
      list = [...moduleStructures];
    } else if (allStructures && allStructures.length > 0) {
      list = [...allStructures];
    } else if (dexieStructures.length > 0) {
      list = [...dexieStructures];
    } else {
      if (structureA) list.push(structureA);
      if (structureB && structureB.id !== structureA?.id) list.push(structureB);
    }

    if (dexieStructures.length > 0 && list.length > 0) {
      list = list.map((item) => {
        const itemKey = getCanonicalDrugKey(item.name);
        const match = dexieStructures.find(
          (ds) => getCanonicalDrugKey(ds.name) === itemKey || ds.id === item.id
        );
        if (match) {
          return mergeDrugStructures(item, match, getBaseDrugName(item.name));
        }
        return item;
      });
    }

    // Filter to ensure only strictly unique drug names are rendered in the options
    const drugMap = new Map<string, ChemicalStructure>();

    for (const struct of list) {
      const rawName = struct.name || '';
      // Aggressive bracket stripping: strip [IV], [rosuvastatin], etc.
      const baseName = stripBracketedText(rawName) || rawName.trim();
      const canonicalKey = baseName.toLowerCase();
      if (!canonicalKey) continue;

      const existing = drugMap.get(canonicalKey);

      if (!existing) {
        // Extract roman numeral label from [IV] if document_label is missing or matches drug name
        let docLabel = struct.document_label;
        if (docLabel && (docLabel.toLowerCase() === canonicalKey || docLabel.toLowerCase().includes(canonicalKey))) {
          docLabel = undefined;
        }
        const bracketMatch = rawName.match(/^\[([^\]]+)\]/);
        if (!docLabel && bracketMatch && bracketMatch[1].toLowerCase() !== canonicalKey) {
          docLabel = bracketMatch[1];
        }

        drugMap.set(canonicalKey, {
          ...struct,
          name: baseName,
          document_label: docLabel,
        });
      } else {
        drugMap.set(canonicalKey, mergeDrugStructures(existing, struct, baseName));
      }
    }

    return Array.from(drugMap.values());
  }, [moduleStructures, allStructures, structureA, structureB, dexieStructures]);

  // 1.5 Determine effective structure count and single focus vs dual compare mode
  const totalStructureCount =
    (moduleStructures && moduleStructures.length > 0)
      ? moduleStructures.length
      : effectiveStructures.length > 0
      ? effectiveStructures.length
      : (propsDrugs?.length || drugs.length);

  const [internalMode, setInternalMode] = useState<'single' | 'compare'>(() =>
    resolveComparatorViewMode({ viewMode, structureCount: totalStructureCount })
  );

  useEffect(() => {
    setInternalMode(resolveComparatorViewMode({ viewMode, structureCount: totalStructureCount }));
  }, [viewMode, totalStructureCount]);

  const isSingleDrug = internalMode === 'single' || totalStructureCount <= 1;

  // 2. Default Selections: Compound A -> drugs[0], Compound B -> drugs[1]
  // Strictly locked down to prevent dropdown re-render loops from overwriting user selections
  const [selectedDrugA, setSelectedDrugA] = useState<HydratedDrug | ChemicalStructure | null>(() => {
    if (structureA) return structureA;
    if (propsDrugs && propsDrugs.length > 0) return propsDrugs[0];
    return null;
  });

  const [selectedDrugB, setSelectedDrugB] = useState<HydratedDrug | ChemicalStructure | null>(() => {
    if (structureB) return structureB;
    if (propsDrugs && propsDrugs.length > 1) return propsDrugs[1];
    return null;
  });

  useEffect(() => {
    if (drugs.length >= 2 && !selectedDrugA && !selectedDrugB) {
      setSelectedDrugA(drugs[0]);
      setSelectedDrugB(drugs[1]);
    } else if (drugs.length === 1) {
      if (!selectedDrugA) setSelectedDrugA(drugs[0]);
      if (selectedDrugB) setSelectedDrugB(null);
    }
  }, [drugs, selectedDrugA, selectedDrugB]);

  // Synchronize when controlled key props update
  useEffect(() => {
    if (drugAKey) {
      const match =
        drugs.find((d) => d.name === drugAKey || d.name.toLowerCase() === drugAKey.toLowerCase()) ||
        effectiveStructures.find((s) => s.name === drugAKey || s.name.toLowerCase() === drugAKey.toLowerCase()) ||
        drugs.find((d) => d.id === drugAKey) ||
        effectiveStructures.find((s) => s.id === drugAKey);
      if (match) setSelectedDrugA(match);
    }
  }, [drugAKey, effectiveStructures, drugs]);

  useEffect(() => {
    if (drugBKey) {
      const match =
        drugs.find((d) => d.name === drugBKey || d.name.toLowerCase() === drugBKey.toLowerCase()) ||
        effectiveStructures.find((s) => s.name === drugBKey || s.name.toLowerCase() === drugBKey.toLowerCase()) ||
        drugs.find((d) => d.id === drugBKey) ||
        effectiveStructures.find((s) => s.id === drugBKey);
      if (match) setSelectedDrugB(match);
    }
  }, [drugBKey, effectiveStructures, drugs]);

  // 3. Group unique structures using reduce by pharmacologicalClass (or chemicalClass fallback)
  const groupedStructures = useMemo(() => {
    return effectiveStructures.reduce<Record<string, ChemicalStructure[]>>((groups, struct) => {
      const pharma = getPharmacologicalClass(struct);
      const chem = resolveChemicalClass(struct);
      const groupName =
        pharma !== 'Data unavailable' && pharma !== 'N/A'
          ? pharma
          : chem !== 'Data unavailable' && chem !== 'N/A'
          ? chem
          : 'Other Compounds';

      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(struct);
      return groups;
    }, {});
  }, [effectiveStructures]);

  // Effective keys factoring in controlled props if valid
  const activeKeyA = useMemo(() => {
    if (selectedDrugA) {
      return selectedDrugA.name || selectedDrugA.id || (selectedDrugA as any).name || '';
    }
    if (drugAKey) {
      const match = effectiveStructures.find(
        (s) =>
          s.name.trim().toLowerCase() === drugAKey.trim().toLowerCase() ||
          getCanonicalDrugKey(s.name) === getCanonicalDrugKey(drugAKey) ||
          s.id === drugAKey
      );
      if (match) return match.name || match.id;
    }
    return effectiveStructures[0]?.name || effectiveStructures[0]?.id || '';
  }, [drugAKey, effectiveStructures, selectedDrugA]);

  const activeKeyB = useMemo(() => {
    if (selectedDrugB) {
      return selectedDrugB.name || selectedDrugB.id || (selectedDrugB as any).name || '';
    }
    if (drugBKey) {
      const match = effectiveStructures.find(
        (s) =>
          s.name.trim().toLowerCase() === drugBKey.trim().toLowerCase() ||
          getCanonicalDrugKey(s.name) === getCanonicalDrugKey(drugBKey) ||
          s.id === drugBKey
      );
      if (match) return match.name || match.id;
    }
    return (effectiveStructures[1] || effectiveStructures[0])?.name || (effectiveStructures[1] || effectiveStructures[0])?.id || '';
  }, [drugBKey, effectiveStructures, selectedDrugB]);

  // Resolve active ChemicalStructure objects
  const currentStructureA: ChemicalStructure | undefined = useMemo(() => {
    if (selectedDrugA) {
      const drugName = selectedDrugA.name || '';
      const key = selectedDrugA.id || drugName || '';
      const matched = effectiveStructures.find(
        (s) =>
          (drugName && s.name.toLowerCase() === drugName.toLowerCase()) ||
          (drugName && getCanonicalDrugKey(s.name) === getCanonicalDrugKey(drugName)) ||
          s.id === key ||
          s.name.toLowerCase() === key.toLowerCase() ||
          getCanonicalDrugKey(s.name) === getCanonicalDrugKey(key)
      );
      if (matched) return matched;

      // Adapt selectedDrugA directly if it's not already in effectiveStructures
      const rawStruct = (selectedDrugA as any).structure || selectedDrugA;
      return {
        id: selectedDrugA.id || 'dropped-a',
        name: selectedDrugA.name || 'Unknown',
        canonicalSmiles: (selectedDrugA as any).smiles || (selectedDrugA as any).canonicalSmiles || rawStruct.canonicalSmiles || rawStruct.smiles,
        smiles: (selectedDrugA as any).smiles || (selectedDrugA as any).canonicalSmiles || rawStruct.canonicalSmiles || rawStruct.smiles,
        chemicalClass: (selectedDrugA as any).clinicalClass?.name || (selectedDrugA as any).chemicalClass,
        targetReceptor: (selectedDrugA as any).target?.name || (selectedDrugA as any).targetReceptor,
        reversibility: (selectedDrugA as any).reversibility,
        route: (selectedDrugA as any).route || (selectedDrugA as any).route_of_admin,
        clinicalData: (selectedDrugA as any).clinicalData,
        pkPdHighlights: (selectedDrugA as any).pkPdHighlights,
        ...rawStruct,
      } as ChemicalStructure;
    }

    if (effectiveStructures.length > 0) {
      return (
        effectiveStructures.find(
          (s) =>
            s.name.toLowerCase() === activeKeyA.toLowerCase() ||
            getCanonicalDrugKey(s.name) === getCanonicalDrugKey(activeKeyA) ||
            s.id === activeKeyA
        ) || effectiveStructures[0]
      );
    }
    return structureA;
  }, [effectiveStructures, activeKeyA, selectedDrugA, structureA]);

  const currentStructureB: ChemicalStructure | undefined = useMemo(() => {
    if (selectedDrugB) {
      const drugName = selectedDrugB.name || '';
      const key = selectedDrugB.id || drugName || '';
      const matched = effectiveStructures.find(
        (s) =>
          (drugName && s.name.toLowerCase() === drugName.toLowerCase()) ||
          (drugName && getCanonicalDrugKey(s.name) === getCanonicalDrugKey(drugName)) ||
          s.id === key ||
          s.name.toLowerCase() === key.toLowerCase() ||
          getCanonicalDrugKey(s.name) === getCanonicalDrugKey(key)
      );
      if (matched) return matched;

      const rawStruct = (selectedDrugB as any).structure || selectedDrugB;
      return {
        id: selectedDrugB.id || 'dropped-b',
        name: selectedDrugB.name || 'Unknown',
        canonicalSmiles: (selectedDrugB as any).smiles || (selectedDrugB as any).canonicalSmiles || rawStruct.canonicalSmiles || rawStruct.smiles,
        smiles: (selectedDrugB as any).smiles || (selectedDrugB as any).canonicalSmiles || rawStruct.canonicalSmiles || rawStruct.smiles,
        chemicalClass: (selectedDrugB as any).clinicalClass?.name || (selectedDrugB as any).chemicalClass,
        targetReceptor: (selectedDrugB as any).target?.name || (selectedDrugB as any).targetReceptor,
        reversibility: (selectedDrugB as any).reversibility,
        route: (selectedDrugB as any).route || (selectedDrugB as any).route_of_admin,
        clinicalData: (selectedDrugB as any).clinicalData,
        pkPdHighlights: (selectedDrugB as any).pkPdHighlights,
        ...rawStruct,
      } as ChemicalStructure;
    }

    if (effectiveStructures.length > 0) {
      return (
        effectiveStructures.find(
          (s) =>
            s.name.toLowerCase() === activeKeyB.toLowerCase() ||
            getCanonicalDrugKey(s.name) === getCanonicalDrugKey(activeKeyB) ||
            s.id === activeKeyB
        ) || effectiveStructures[1] || effectiveStructures[0]
      );
    }
    return structureB;
  }, [effectiveStructures, activeKeyB, selectedDrugB, structureB]);

  // Define active compounds & inject exact requested Dexie schema debugger log
  const compoundA = currentStructureA;
  const compoundB = currentStructureB;
  console.log('--- DEXIE DRUG SCHEMA ---', compoundA);

  // Programmatic LogP Hydration: Asynchronously fetch LogP via PubChem API if missing from Dexie/structures
  useEffect(() => {
    const fetchMissingLogP = async (targetStructure?: ChemicalStructure) => {
      if (!targetStructure) return;
      const cid = targetStructure.cid || targetStructure.pubchemAudit?.cid;
      if (!cid || cid <= 0) return;

      const existingLogP =
        targetStructure.logP ??
        (targetStructure as any).properties?.logP ??
        targetStructure.pubchemAudit?.xlogp ??
        dynamicallyFetchedLogP[cid];

      if (existingLogP === undefined || existingLogP === null) {
        try {
          const val = await fetchPubChemXLogP(cid);
          if (val !== undefined && val !== null) {
            setDynamicallyFetchedLogP((prev) => ({ ...prev, [cid]: val }));
            targetStructure.logP = val;
            if (targetStructure.properties) {
              targetStructure.properties.logP = val;
            } else {
              targetStructure.properties = { logP: val };
            }
            if (targetStructure.pubchemAudit) {
              targetStructure.pubchemAudit.xlogp = val;
            }
            const entityId = (targetStructure.name || targetStructure.id || '').trim().toLowerCase();
            if (entityId) {
              medChemGraphDb.entities
                .update(entityId, {
                  logP: val,
                  properties: { logP: val },
                  pubchemAudit: { xlogp: val },
                })
                .catch(() => {});
            }
          }
        } catch (e) {
          // ignore
        }
      }
    };

    fetchMissingLogP(compoundA);
    fetchMissingLogP(compoundB);
  }, [compoundA, compoundB, dynamicallyFetchedLogP]);

  const handleSelectDrugA = (selectedIdentifier: string) => {
    const selected =
      drugs.find((d) => d.name === selectedIdentifier) ||
      effectiveStructures.find((s) => s.name === selectedIdentifier) ||
      drugs.find((d) => d.name.toLowerCase() === selectedIdentifier.toLowerCase()) ||
      effectiveStructures.find((s) => s.name.toLowerCase() === selectedIdentifier.toLowerCase()) ||
      drugs.find((d) => d.id === selectedIdentifier) ||
      effectiveStructures.find((s) => s.id === selectedIdentifier);
    if (selected) {
      setSelectedDrugA(selected);
    }
    setActiveTagsA([]);
    setHoveredTagA(null);
    onSelectDrugA?.(selected?.id || selected?.name || selectedIdentifier);
  };

  const handleSelectDrugB = (selectedIdentifier: string) => {
    const selected =
      drugs.find((d) => d.name === selectedIdentifier) ||
      effectiveStructures.find((s) => s.name === selectedIdentifier) ||
      drugs.find((d) => d.name.toLowerCase() === selectedIdentifier.toLowerCase()) ||
      effectiveStructures.find((s) => s.name.toLowerCase() === selectedIdentifier.toLowerCase()) ||
      drugs.find((d) => d.id === selectedIdentifier) ||
      effectiveStructures.find((s) => s.id === selectedIdentifier);
    if (selected) {
      setSelectedDrugB(selected);
    }
    setActiveTagsB([]);
    setHoveredTagB(null);
    onSelectDrugB?.(selected?.id || selected?.name || selectedIdentifier);
  };

  const handleToggleTagA = (tag: PharmacophoreGroup) => {
    setActiveTagsA((prev) => {
      const existingIdx = prev.findIndex(
        (t) => t.id === tag.id || t.name.toLowerCase() === tag.name.toLowerCase()
      );
      if (existingIdx >= 0) {
        // Toggle OFF: remove and re-index colors across active tags
        const remaining = prev.filter((_, idx) => idx !== existingIdx);
        return remaining.map((t, idx) => ({
          ...t,
          color: ACTIVE_TAG_PALETTE[idx % ACTIVE_TAG_PALETTE.length],
        }));
      } else {
        // Toggle ON: add and assign distinct color from palette mapping to index
        const rawSmarts = tag.smarts || '';
        const smarts = getCorrectedSmarts(tag.name, rawSmarts) || rawSmarts;
        const color = ACTIVE_TAG_PALETTE[prev.length % ACTIVE_TAG_PALETTE.length];
        const newActiveTag: ActivePharmacophoreTag = {
          ...tag,
          smarts,
          color,
        };
        return [...prev, newActiveTag];
      }
    });
  };

  const handleClearTagsA = () => {
    setActiveTagsA([]);
  };

  const handleToggleTagB = (tag: PharmacophoreGroup) => {
    setActiveTagsB((prev) => {
      const existingIdx = prev.findIndex(
        (t) => t.id === tag.id || t.name.toLowerCase() === tag.name.toLowerCase()
      );
      if (existingIdx >= 0) {
        // Toggle OFF: remove and re-index colors across active tags
        const remaining = prev.filter((_, idx) => idx !== existingIdx);
        return remaining.map((t, idx) => ({
          ...t,
          color: ACTIVE_TAG_PALETTE[idx % ACTIVE_TAG_PALETTE.length],
        }));
      } else {
        // Toggle ON: add and assign distinct color from palette mapping to index
        const rawSmarts = tag.smarts || '';
        const smarts = getCorrectedSmarts(tag.name, rawSmarts) || rawSmarts;
        const color = ACTIVE_TAG_PALETTE[prev.length % ACTIVE_TAG_PALETTE.length];
        const newActiveTag: ActivePharmacophoreTag = {
          ...tag,
          smarts,
          color,
        };
        return [...prev, newActiveTag];
      }
    });
  };

  const handleClearTagsB = () => {
    setActiveTagsB([]);
  };

  const handleSwap = () => {
    const prevA = compoundA || selectedDrugA;
    const prevB = compoundB || selectedDrugB;
    setSelectedDrugA(prevB);
    setSelectedDrugB(prevA);
    const nextKeyA = prevB?.id || (prevB as any)?.name;
    const nextKeyB = prevA?.id || (prevA as any)?.name;
    if (nextKeyA) onSelectDrugA?.(nextKeyA);
    if (nextKeyB) onSelectDrugB?.(nextKeyB);
    onSwapDrugs?.();

    // Swap active selected and hovered tags between Compound A and Compound B
    const prevActiveA = activeTagsA;
    setActiveTagsA(activeTagsB);
    setActiveTagsB(prevActiveA);

    const prevHoveredA = hoveredTagA;
    setHoveredTagA(hoveredTagB);
    setHoveredTagB(prevHoveredA);
  };

  const handleCopySmiles = (smiles: string, key: string) => {
    navigator.clipboard.writeText(smiles);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!compoundA || !compoundB) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        No chemical structures available for comparison.
      </div>
    );
  }

  const renderSingleComparatorCard = (
    structure: ChemicalStructure,
    label: string,
    drugKey: string,
    onSelectKey: ((k: string) => void) | undefined,
    activeTags: ActivePharmacophoreTag[],
    hoveredTag: PharmacophoreGroup | null,
    onToggleTag: (tag: PharmacophoreGroup) => void,
    onClearTags: () => void,
    onHoverTag: (tag: PharmacophoreGroup | null) => void,
    copyKeySuffix: string = 'a'
  ) => {
    const pharmacophores = getPharmacophoresForStructure(structure);
    const targetAndReversibility = resolveTargetAndReversibilitySafe(structure, graphTargetMap);
    const canonicalSmiles =
      structure.canonicalSmiles ||
      structure.pubchemAudit?.canonicalSmiles ||
      (structure as any).smiles ||
      (structure as any).chemData?.canonicalSmiles ||
      (structure as any).chemData?.isomericSmiles;

    // Build active highlights array: activeTags directly passed, plus preview highlight for hovered tag if not already active
    const activeHighlights: ActivePharmacophoreTag[] = [...activeTags];

    if (hoveredTag) {
      const isAlreadyActive = activeTags.some(
        (t) => t.id === hoveredTag.id || t.name.toLowerCase() === hoveredTag.name.toLowerCase()
      );
      if (!isAlreadyActive) {
        const hoverSmarts = getCorrectedSmarts(hoveredTag.name, hoveredTag.smarts || '') || hoveredTag.smarts || '';
        if (hoverSmarts && hoverSmarts.trim()) {
          activeHighlights.push({
            ...hoveredTag,
            smarts: hoverSmarts.trim(),
            color: '#60a5fa',
          });
        }
      }
    }

    return (
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3.5">
        <div className="space-y-3">
          {/* Card Header: Label & Name & Grouped Deduplicated Dropdown Selector */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold font-mono text-xs shrink-0">
                {label}
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate text-balance">
                {structure.name}
              </h3>
            </div>

            {onSelectKey ? (
              <select
                id={`comparator-select-${copyKeySuffix}`}
                name={`comparatorSelect${copyKeySuffix.toUpperCase()}`}
                value={structure.name || drugKey}
                onChange={(e) => {
                  const targetName = e.target.value;
                  const selected =
                    drugs.find((d) => d.name === targetName) ||
                    effectiveStructures.find((s) => s.name === targetName);
                  if (selected) {
                    if (copyKeySuffix === 'a') {
                      setSelectedDrugA(selected);
                    } else {
                      setSelectedDrugB(selected);
                    }
                  }
                  onSelectKey(targetName);
                }}
                className="text-xs font-semibold px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 shrink-0 max-w-[190px] truncate cursor-pointer"
              >
                {(() => {
                  // Strict filtering utility before <select> renders
                  // Strip all bracketed text using regex .replace(/\[.*?\]\s*/g, '').trim()
                  // and use a Set to ensure ONLY unique base names are added to the <option> list
                  const seenBaseNames = new Set<string>();

                  return Object.entries(groupedStructures).map(([groupName, items]) => {
                    const uniqueItems = items.filter((s) => {
                      const cleanBaseName = stripBracketedText(s.name) || s.name.trim();
                      const normKey = cleanBaseName.toLowerCase();
                      if (!normKey || seenBaseNames.has(normKey)) {
                        return false;
                      }
                      seenBaseNames.add(normKey);
                      return true;
                    });

                    if (uniqueItems.length === 0) return null;

                    return (
                      <optgroup key={groupName} label={groupName}>
                        {uniqueItems.map((s) => {
                          const cleanBaseName = stripBracketedText(s.name) || s.name.trim();
                          const tradeSuffix =
                            s.tradeName && s.tradeName.toLowerCase() !== cleanBaseName.toLowerCase()
                              ? ` (${s.tradeName})`
                              : '';
                          return (
                            <option key={s.name} value={s.name}>
                              {cleanBaseName}{tradeSuffix}
                            </option>
                          );
                        })}
                      </optgroup>
                    );
                  });
                })()}
              </select>
            ) : null}
          </div>

          {/* 1. HIGH-CONTRAST STRUCTURE CANVAS (Exclusively RDKit SmilesCanvas as Single Source of Truth) */}
          <div className="w-full h-56 bg-[var(--structure-canvas-bg)] rounded-xl shadow-inner p-2 flex items-center justify-center overflow-hidden relative group border border-slate-200/80 dark:border-slate-800">
            <SmilesCanvas
              smiles={canonicalSmiles}
              molBlock={structure.pubchemMolBlock}
              fallbackImageUrl={structure.pngUrl}
              width={280}
              height={210}
              altText={`${structure.name} 2D chemical structure`}
              activePharmacophores={activeHighlights}
              className="w-full h-full flex items-center justify-center"
            />

            {onInspectStructure ? (
              <button
                type="button"
                onClick={() => onInspectStructure(structure)}
                className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-900/90 text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center gap-1 shadow-md cursor-pointer z-10"
                title="Inspect in PubChem Inspector"
              >
                <Search className="w-3 h-3" />
                <span>Inspect</span>
              </button>
            ) : null}
          </div>

          {/* Pharmacophore Pill / Badge Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span>Pharmacophore Tags ({pharmacophores.length})</span>
              </span>
              {activeTags.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                    {activeTags.length} active
                  </span>
                  <button
                    type="button"
                    onClick={onClearTags}
                    className="text-[10px] text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {pharmacophores.length === 0 ? (
              <p className="text-[10px] text-slate-400 italic">No pharmacophore tags available</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {pharmacophores.map((tag) => {
                  const activeItem = activeTags.find(
                    (t) => t.id === tag.id || t.name.toLowerCase() === tag.name.toLowerCase()
                  );
                  const isSelected = Boolean(activeItem);
                  const isHovered = hoveredTag?.id === tag.id;
                  const itemColor = activeItem?.color || ACTIVE_TAG_PALETTE[0];
                  const { iupac, casual } = parsePharmacophoreName(tag.name);

                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={(e) => {
                        onToggleTag(tag);
                        const tagKey = `${copyKeySuffix.toLowerCase()}-${tag.id || tag.name}`;
                        if (activeTooltip === tagKey) {
                          setActiveTooltip(null);
                        } else {
                          activeTagRef.current = e.currentTarget;
                          setActiveTooltip(tagKey);
                        }
                      }}
                      onMouseEnter={() => onHoverTag(tag)}
                      onMouseLeave={() => onHoverTag(null)}
                      style={
                        isSelected
                          ? {
                              backgroundColor: `${itemColor}18`,
                              borderColor: itemColor,
                              boxShadow: `0 0 0 1px ${itemColor}40`,
                            }
                          : isHovered
                          ? {
                              borderColor: `${itemColor}80`,
                              backgroundColor: `${itemColor}0d`,
                            }
                          : undefined
                      }
                      className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'text-slate-900 dark:text-slate-100 font-semibold shadow-2xs'
                          : isHovered
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                      title={tag.description || tag.purpose || tag.name}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0 transition-transform"
                        style={{
                          backgroundColor: isSelected ? itemColor : '#94a3b8',
                          transform: isSelected || isHovered ? 'scale(1.25)' : 'scale(1)',
                        }}
                      />
                      <span className="truncate max-w-[140px]">{iupac}</span>
                      {casual && (
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded font-normal shrink-0 ${
                            isSelected
                              ? 'bg-black/10 dark:bg-white/15'
                              : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {casual}
                        </span>
                      )}
                      {isSelected && (
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: itemColor }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Exclusive Pharmacophore Tooltip Callout with Click-Away (Zero SMILES/SMARTS) */}
            {(() => {
              const prefix = `${copyKeySuffix.toLowerCase()}-`;
              const activeTagId = activeTooltip && activeTooltip.startsWith(prefix)
                ? activeTooltip.slice(prefix.length)
                : null;

              const targetTag = activeTagId
                ? pharmacophores.find((t) => t.id === activeTagId || t.name.toLowerCase() === activeTagId.toLowerCase())
                : hoveredTag;

              if (!targetTag) return null;

              const activeItem = activeTags.find(
                (t) => t.id === targetTag.id || t.name.toLowerCase() === targetTag.name.toLowerCase()
              );
              const tagColor = activeItem?.color || '#2563eb';
              const parsedTarget = parsePharmacophoreName(targetTag.name);

              return (
                <div
                  ref={activeTagId ? activeTooltipRef : undefined}
                  className="text-[10px] p-2.5 rounded-xl border leading-relaxed transition-all shadow-xs animate-in fade-in duration-150"
                  style={{
                    backgroundColor: `${tagColor}0f`,
                    borderColor: `${tagColor}40`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: tagColor }}
                      />
                      <div className="truncate">
                        <span className="font-bold text-slate-900 dark:text-slate-100 truncate text-[11px] mr-1.5">
                          {parsedTarget.iupac}
                        </span>
                        {parsedTarget.casual && (
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                            ({parsedTarget.casual})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {targetTag.category || 'PHARMACOPHORE'}
                      </span>
                      {activeTagId && (
                        <button
                          type="button"
                          onClick={() => setActiveTooltip(null)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 rounded hover:bg-slate-200/50 dark:hover:bg-slate-750 cursor-pointer"
                          title="Dismiss tooltip"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                    {targetTag.description || targetTag.purpose}
                  </p>
                  {targetTag.casual_sar_explanation && (
                    <div className="mt-1.5 text-[10px] text-amber-900 dark:text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded-lg p-1.5 italic leading-snug">
                      💡 {targetTag.casual_sar_explanation}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* 2. STAT GRID: Compact badges/pills for Molecular Wt, LogP, Drug State, CID, Target & Reversibility */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Molecular Weight Pill */}
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Molecular Wt</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 truncate">
                {(structure.mw ?? structure.pubchemAudit?.molecularWeight)
                  ? `${structure.mw ?? structure.pubchemAudit?.molecularWeight} g/mol`
                  : '—'}
              </span>
            </div>

            {/* LogP Pill */}
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">LogP</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 truncate">
                {(() => {
                  if (structure.logP !== undefined && structure.logP !== null) return structure.logP;
                  if ((structure as any).properties?.logP !== undefined && (structure as any).properties?.logP !== null) {
                    return (structure as any).properties.logP;
                  }
                  if (structure.pubchemAudit?.xlogp !== undefined && structure.pubchemAudit?.xlogp !== null) {
                    return structure.pubchemAudit.xlogp;
                  }
                  const structCid = structure.cid || structure.pubchemAudit?.cid;
                  if (structCid && dynamicallyFetchedLogP[structCid] !== undefined) {
                    return dynamicallyFetchedLogP[structCid];
                  }
                  return '—';
                })()}
              </span>
            </div>

            {/* Drug State Pill */}
            <div className="px-2.5 py-1.5 rounded-lg bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">Drug State</span>
              <span className="font-bold text-purple-900 dark:text-purple-200 truncate">
                {getDrugState(structure)}
              </span>
            </div>

            {/* CID Pill */}
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>PubChem CID</span>
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {structure.cid ? `CID ${structure.cid}` : 'Unresolved'}
                </span>
                {structure.cid ? (
                  <a
                    href={`https://pubchem.ncbi.nlm.nih.gov/compound/${structure.cid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-blue-600"
                    title="Open on PubChem"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ) : null}
              </div>
            </div>

            {/* Target & Reversibility Pill */}
            <div className="col-span-2 col-span-full w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Target &amp; Reversibility
              </span>
              <span
                className="font-bold text-slate-900 dark:text-slate-100 truncate"
                title={targetAndReversibility}
              >
                {targetAndReversibility}
              </span>
            </div>
          </div>

          {/* 3. COLLAPSE SMILES */}
          {canonicalSmiles ? (
            <details className="text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-2 group/smiles">
              <summary className="text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none hover:text-slate-900 dark:hover:text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>View Canonical SMILES</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400 group-open/smiles:hidden">
                  (Click to expand)
                </span>
              </summary>
              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2">
                <code className="text-[10px] font-mono block break-all text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-800 select-all flex-1">
                  {canonicalSmiles}
                </code>
                <button
                  type="button"
                  onClick={() =>
                    handleCopySmiles(
                      canonicalSmiles,
                      copyKeySuffix
                    )
                  }
                  className="px-2 py-1 text-[10px] font-bold rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 shrink-0 cursor-pointer transition-colors"
                  title="Copy Canonical SMILES"
                >
                  {copiedKey === copyKeySuffix ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Copied</span>
                    </span>
                  ) : (
                    <span>Copy</span>
                  )}
                </button>
              </div>
            </details>
          ) : null}

          {/* Chemical Class & MOA Rationale */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1">
            <div className="text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Chemical Class: </span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {resolveChemicalClass(structure)}
              </span>
            </div>
            {((structure as any)?.moa_summary ||
              (structure as any)?.moa ||
              (structure as any)?.sar_rationale ||
              getMoaOrSar(structure)) !== 'Data unavailable' &&
            ((structure as any)?.moa_summary ||
              (structure as any)?.moa ||
              (structure as any)?.sar_rationale ||
              getMoaOrSar(structure)) !== 'N/A' ? (
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed italic">
                "{
                  (structure as any)?.moa_summary ||
                  (structure as any)?.moa ||
                  (structure as any)?.sar_rationale ||
                  getMoaOrSar(structure)
                }"
              </p>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section ref={comparatorSectionRef as any} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Comparator Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              <ArrowRightLeft className="w-4 h-4" />
            </span>
            <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">
              {isSingleDrug
                ? 'Chemical Structure & Attribute Focus Stage'
                : 'Side-by-Side Chemical Structure & Attribute Comparator'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isSingleDrug
              ? 'Interactive 2D structure, pharmacophore mapping, molecular properties, and bioactivation'
              : 'Contrast 2D structures, pharmacophores, molecular properties, and bioactivation pathways'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {totalStructureCount > 1 && (
            <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => {
                  setInternalMode('single');
                  onViewModeChange?.('single');
                }}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  isSingleDrug
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Single Focus
              </button>
              <button
                type="button"
                onClick={() => {
                  setInternalMode('compare');
                  onViewModeChange?.('compare');
                }}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                  !isSingleDrug
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Dual Compare
              </button>
            </div>
          )}

          {!isSingleDrug && (
            <button
              type="button"
              onClick={handleSwap}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Swap Compound A and Compound B"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Swap</span>
            </button>
          )}

          {onExpandStudio ? (
            <button
              type="button"
              onClick={onExpandStudio}
              className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
              title="Expand Comparator to Fullscreen Studio with Zoom &amp; Pharmacophore Mapping"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fullscreen Studio</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Side-by-Side Comparator Cards (Strict Two-Column Layout or Centered Single Card if only 1 drug) */}
      <div className={isSingleDrug ? 'flex justify-center w-full' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
        {/* Compound A (Left) Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            if (!isDragOverA) setIsDragOverA(true);
          }}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setIsDragOverA(false);
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOverA(false);
            try {
              const drug = JSON.parse(e.dataTransfer.getData('application/json'));
              setSelectedDrugA(drug);
              setActiveTagsA([]);
              setHoveredTagA(null);
              if (onSelectDrugA) onSelectDrugA(drug.name || drug.id);
            } catch (err) {
              console.error('Failed to parse dropped drug on Compound A:', err);
            }
          }}
          className={`${
            isSingleDrug ? 'w-full max-w-3xl mx-auto' : 'relative flex flex-col h-full'
          } rounded-2xl transition-all duration-150 ${
            isDragOverA
              ? 'ring-2 ring-blue-500 ring-offset-2 border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 scale-[1.01]'
              : ''
          }`}
        >
          {isDragOverA && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-blue-500/10 backdrop-blur-[1px] rounded-2xl border-2 border-dashed border-blue-500 pointer-events-none">
              <span className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg shadow-md animate-pulse">
                Drop to load Compound A
              </span>
            </div>
          )}
          {renderSingleComparatorCard(
            compoundA,
            isSingleDrug ? 'Single Compound Focus' : 'Compound A',
            compoundA.name,
            handleSelectDrugA,
            activeTagsA,
            hoveredTagA,
            handleToggleTagA,
            handleClearTagsA,
            setHoveredTagA,
            'a'
          )}
        </div>

        {/* Compound B (Right) Drop Zone - Hidden if singleton drug */}
        {!isSingleDrug && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
              if (!isDragOverB) setIsDragOverB(true);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setIsDragOverB(false);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOverB(false);
              try {
                const drug = JSON.parse(e.dataTransfer.getData('application/json'));
                setSelectedDrugB(drug);
                setActiveTagsB([]);
                setHoveredTagB(null);
                if (onSelectDrugB) onSelectDrugB(drug.name || drug.id);
              } catch (err) {
                console.error('Failed to parse dropped drug on Compound B:', err);
              }
            }}
            className={`relative flex flex-col h-full rounded-2xl transition-all duration-150 ${
              isDragOverB
                ? 'ring-2 ring-blue-500 ring-offset-2 border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 scale-[1.01]'
                : ''
            }`}
          >
            {isDragOverB && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-blue-500/10 backdrop-blur-[1px] rounded-2xl border-2 border-dashed border-blue-500 pointer-events-none">
                <span className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg shadow-md animate-pulse">
                  Drop to load Compound B
                </span>
              </div>
            )}
            {renderSingleComparatorCard(
              compoundB,
              'Compound B',
              compoundB.name,
              handleSelectDrugB,
              activeTagsB,
              hoveredTagB,
              handleToggleTagB,
              handleClearTagsB,
              setHoveredTagB,
              'b'
            )}
          </div>
        )}
      </div>

      {/* Head-to-Head Differential Matrix Table & Contrast Summary - Unmounted if singleton drug */}
      {!isSingleDrug && (
        <>
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
        <button
          type="button"
          onClick={() => setIsMatrixOpen(!isMatrixOpen)}
          className="flex items-center gap-2 cursor-pointer w-full text-left font-bold text-xs text-slate-900 dark:text-slate-100"
          aria-expanded={isMatrixOpen}
          aria-label="Toggle Head-to-Head Differential Matrix"
        >
          <ChevronDown
            className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
              isMatrixOpen ? 'rotate-180' : ''
            }`}
          />
          <span>Head-to-Head Differential Matrix:</span>
        </button>

        {isMatrixOpen && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <th className="py-2 px-3 font-semibold text-slate-500 text-[10px] uppercase">
                    Attribute
                  </th>
                  <th className="py-2 px-3 font-bold text-blue-600 dark:text-blue-400">
                    {compoundA.name}
                  </th>
                  <th className="py-2 px-3 font-bold text-indigo-600 dark:text-indigo-400">
                    {compoundB.name}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60">
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-500">Chemical Class</td>
                  <td className="py-2 px-3">{resolveChemicalClass(compoundA)}</td>
                  <td className="py-2 px-3">{resolveChemicalClass(compoundB)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-500">Target Receptor</td>
                  <td className="py-2 px-3">{resolveTarget(compoundA, graphTargetMap)}</td>
                  <td className="py-2 px-3">{resolveTarget(compoundB, graphTargetMap)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-500">Reversibility</td>
                  <td className="py-2 px-3 font-semibold">{resolveReversibility(compoundA)}</td>
                  <td className="py-2 px-3 font-semibold">{resolveReversibility(compoundB)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-500">Route of Admin</td>
                  <td className="py-2 px-3">{resolveRoute(compoundA)}</td>
                  <td className="py-2 px-3">{resolveRoute(compoundB)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-500">Onset of Action</td>
                  <td className="py-2 px-3 font-mono">{resolveOnset(compoundA)}</td>
                  <td className="py-2 px-3 font-mono">{resolveOnset(compoundB)}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-500">Elimination Half-Life</td>
                  <td className="py-2 px-3 font-mono">
                    {typeof compoundA.elimination_half_life === 'object' && (compoundA.elimination_half_life as any)?.value
                      ? `${(compoundA.elimination_half_life as any).value} ${(compoundA.elimination_half_life as any).unit || 'hours'}`
                      : resolveHalfLife(compoundA)}
                  </td>
                  <td className="py-2 px-3 font-mono">
                    {typeof compoundB.elimination_half_life === 'object' && (compoundB.elimination_half_life as any)?.value
                      ? `${(compoundB.elimination_half_life as any).value} ${(compoundB.elimination_half_life as any).unit || 'hours'}`
                      : resolveHalfLife(compoundB)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-500">Location of Metabolism</td>
                  <td className="py-2 px-3">{resolveLocationOfMetabolism(compoundA)}</td>
                  <td className="py-2 px-3">{resolveLocationOfMetabolism(compoundB)}</td>
                </tr>
                {(resolveStructuralDifferences(compoundA, compoundB) !== 'N/A' || resolveStructuralDifferences(compoundB, compoundA) !== 'N/A') && (
                  <tr>
                    <td className="py-2 px-3 font-medium text-slate-500">Structural Differences</td>
                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{resolveStructuralDifferences(compoundA, compoundB)}</td>
                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{resolveStructuralDifferences(compoundB, compoundA)}</td>
                  </tr>
                )}
                {(resolvePkPdProfile(compoundA, compoundB) !== 'N/A' || resolvePkPdProfile(compoundB, compoundA) !== 'N/A') && (
                  <tr>
                    <td className="py-2 px-3 font-medium text-slate-500">PK/PD Profile</td>
                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{resolvePkPdProfile(compoundA, compoundB)}</td>
                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{resolvePkPdProfile(compoundB, compoundA)}</td>
                  </tr>
                )}
                {(resolveClinicalUseCases(compoundA, compoundB) !== 'N/A' || resolveClinicalUseCases(compoundB, compoundA) !== 'N/A') && (
                  <tr>
                    <td className="py-2 px-3 font-medium text-slate-500">Clinical Use Cases</td>
                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{resolveClinicalUseCases(compoundA, compoundB)}</td>
                    <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{resolveClinicalUseCases(compoundB, compoundA)}</td>
                  </tr>
                )}
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-500">Unique Differentiator</td>
                  <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{resolveContrast(compoundA, compoundB)}</td>
                  <td className="py-2 px-3 text-slate-700 dark:text-slate-300">{resolveContrast(compoundB, compoundA)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Contrast Summary Footer */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
        <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Key Pharmacophore &amp; PK/PD Contrast:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-slate-100 block mb-0.5">
              {compoundA.name}:
            </span>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              {resolveContrast(compoundA, compoundB) !== 'N/A'
                ? resolveContrast(compoundA, compoundB)
                : (compoundA as any)?.moa_summary ||
                  (compoundA as any)?.moa ||
                  (compoundA as any)?.sar_rationale ||
                  (compoundA as any)?.sarNotes ||
                  getMoaOrSar(compoundA)}
            </p>
            {resolveStructuralDifferences(compoundA, compoundB) !== 'N/A' && (
              <div className="p-1.5 rounded bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200">
                <span className="font-semibold text-amber-800 dark:text-amber-300">Structure: </span>
                {resolveStructuralDifferences(compoundA, compoundB)}
              </div>
            )}
            {resolvePkPdProfile(compoundA, compoundB) !== 'N/A' && (
              <div className="p-1.5 rounded bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/40 text-[11px] text-blue-900 dark:text-blue-200">
                <span className="font-semibold text-blue-800 dark:text-blue-300">PK/PD: </span>
                {resolvePkPdProfile(compoundA, compoundB)}
              </div>
            )}
            {resolveClinicalUseCases(compoundA, compoundB) !== 'N/A' && (
              <div className="p-1.5 rounded bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 text-[11px] text-emerald-900 dark:text-emerald-200">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">Clinical: </span>
                {resolveClinicalUseCases(compoundA, compoundB)}
              </div>
            )}
          </div>
          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-slate-100 block mb-0.5">
              {compoundB.name}:
            </span>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              {resolveContrast(compoundB, compoundA) !== 'N/A'
                ? resolveContrast(compoundB, compoundA)
                : (compoundB as any)?.moa_summary ||
                  (compoundB as any)?.moa ||
                  (compoundB as any)?.sar_rationale ||
                  (compoundB as any)?.sarNotes ||
                  getMoaOrSar(compoundB)}
            </p>
            {resolveStructuralDifferences(compoundB, compoundA) !== 'N/A' && (
              <div className="p-1.5 rounded bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200">
                <span className="font-semibold text-amber-800 dark:text-amber-300">Structure: </span>
                {resolveStructuralDifferences(compoundB, compoundA)}
              </div>
            )}
            {resolvePkPdProfile(compoundB, compoundA) !== 'N/A' && (
              <div className="p-1.5 rounded bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/40 text-[11px] text-blue-900 dark:text-blue-200">
                <span className="font-semibold text-blue-800 dark:text-blue-300">PK/PD: </span>
                {resolvePkPdProfile(compoundB, compoundA)}
              </div>
            )}
            {resolveClinicalUseCases(compoundB, compoundA) !== 'N/A' && (
              <div className="p-1.5 rounded bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 text-[11px] text-emerald-900 dark:text-emerald-200">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300">Clinical: </span>
                {resolveClinicalUseCases(compoundB, compoundA)}
              </div>
            )}
          </div>
        </div>
      </div>
        </>
      )}

    </section>
  );
};

export default StructureComparator;
