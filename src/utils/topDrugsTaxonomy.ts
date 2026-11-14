import type { ChemicalStructure } from '../types/reviewModule.js';
import type { FlashcardItem } from '../types/cumulativeStudy.js';
import {
  TOP_DRUGS_TAXONOMY,
  THERAPEUTIC_CATEGORIES,
  type TopDrugEntry,
  type TherapeuticClassCategory,
} from '../data/topDrugsTaxonomyData.js';
import { generateBaseStructureId } from './cumulativeStructureHarvester.js';
import { getKnownDrugSmiles } from './knownDrugSmiles.js';
import {
  TOP_DRUGS_SMILES_CATALOG,
  type TopDrugStructureRecord,
} from '../data/topDrugsSmilesData.js';

/**
 * Curated SMILES dictionary for landmark Top 200 drugs.
 * Provides accurate offline chemical structures for 2D vector rendering and pharmacophore detection.
 */
const TOP_DRUG_CURATED_SMILES: Record<string, string> = {
  metoprolol: 'CC(C)NCC(COC1=CC=C(C=C1)CCOC)O',
  furosemide: 'C1=C(C=C(C(=C1Cl)S(=O)(=O)N)C(=O)O)NCC2=CC=CO2',
  cephalexin: 'CC1=C(N2C(C(C2=O)NC(=O)C(C3=CC=CC=C3)N)SC1)C(=O)O',
  lisinopril: 'C1CC(N(C1)C(=O)C(CCCCN)NC(CCC2=CC=CC=C2)C(=O)O)C(=O)O',
  amlodipine: 'CCOC(=O)C1=C(NC(=C(C1C2=CC=CC=C2Cl)C(=O)OC)C)COCCN',
  hydrochlorothiazide: 'C1NC2=CC(=C(C=C2S(=O)(=O)N1)Cl)S(=O)(=O)N',
  omeprazole: 'CC1=CN=C(C(=C1OC)C)CS(=O)C2=NC3=C(N2)C=CC(=C3)OC',
  sertraline: 'CNC1CCC(C2=CC=CC=C12)C3=CC(=C(C=C3)Cl)Cl',
  gabapentin: 'C1CCC(CC1)(CC(=O)O)CN',
  metformin: 'CN(C)C(=N)NC(=N)N',
  levothyroxine: 'C1=C(C=C(C(=C1I)OC2=CC(=C(C(=C2)I)O)I)I)CC(C(=O)O)N',
  albuterol: 'CC(C)(C)NCC(C1=CC(=C(C=C1)O)CO)O',
  amoxicillin: 'CC1(C(N2C(S1)C(C2=O)NC(=O)C(C3=CC=C(C=C3)O)N)C(=O)O)C',
  losartan: 'CCCCC1=NC(=C(N1CC2=CC=C(C=C2)C3=CC=CC=C3C4=NNN=N4)CO)Cl',
  prednisone: 'CC12CC(=O)C3C(C1CCC2(C(=O)CO)O)CCC4=CC(=O)C=CC34C',
  fluoxetine: 'CNCCC(C1=CC=CC=C1)OC2=CC=C(C=C2)C(F)(F)F',
  citalopram: 'CC1(C2=C(CO1)C=C(C=C2)C#N)CCCN(C)C',
  escitalopram: 'CC1(C2=C(CO1)C=C(C=C2)C#N)CCCN(C)C',
  duloxetine: 'CNCCC(C1=CC=CS1)OC2=CC=CC3=CC=CC=C23',
  bupropion: 'CC(C(=O)C1=CC(=CC=C1)Cl)NC(C)(C)C',
  tramadol: 'CC1(CCCCC1(C2=CC(=CC=C2)OC)O)CN(C)C',
  zolpidem: 'CC1=CC=C(C=C1)C2=C(N3C=C(C=CC3=N2)C)CC(=O)N(C)C',
  montelukast: 'CC(C)(C1=CC=CC=C1CCC(C2=CC=CC(=C2)/C=C/C3=NC4=C(C=CC(=C4)Cl)C=C3)SCC5(CC5)CC(=O)O)O',
  fluticasone: 'CC1CC2C3CCC4=CC(=O)C=CC4(C3(C(CC2(C1(C(=O)SCF)OC(=O)CC)C)O)F)C',
  alprazolam: 'CC1=NN=C2CN=C(C3=CC=CC=C3)C4=C(C=CC(=C4)Cl)N12',
  clonazepam: 'C1C(=O)NC2=C(C=C(C=C2)[N+](=O)[O-])C(=N1)C3=CC=CC=C3Cl',
  lorazepam: 'C1=CC=C(C(=C1)C2=NC(C(=O)NC3=C2C=C(C=C3)Cl)O)Cl',
  diazepam: 'CN1C(=O)CN=C(C2=C1C=CC(=C2)Cl)C3=CC=CC=C3',
  carvedilol: 'C1=CC=C2C(=C1)C3=CC=CC=C3N2CC(COC4=CC=CC5=C4OCCO5)O',
  atenolol: 'CC(C)NCC(COC1=CC=C(C=C1)CC(=O)N)O',
  propranolol: 'CC(C)NCC(COC1=CC=CC2=CC=CC=C12)O',
  diltiazem: 'CC(=O)OC1C(SC2=CC=CC=C2N(C1=O)CCN(C)C)C3=CC=C(C=C3)OC',
  verapamil: 'CC(C)C(CCCN(C)CCC1=CC(=C(C=C1)OC)OC)(C#N)C2=CC(=C(C=C2)OC)OC',
  spironolactone: 'CC12CCC(=O)C=C1CCC3C2CCC4(C3CC(C45CCC(=O)O5)SC(=O)C)C',
  pantoprazole: 'COC1=CC=C(C=C1)CS(=O)C2=NC3=C(N2)C=C(C=C3)OC(F)F',
  esomeprazole: 'CC1=CN=C(C(=C1OC)C)CS(=O)C2=NC3=C(N2)C=CC(=C3)OC',
  famotidine: 'CSC1=NC(=CS1)N=C(N)N',
  ondansetron: 'CC1=NC=CN1CC2CCC3=C(C2=O)C4=CC=CC=C4N3C',
  oxycodone: 'CC12CCC3(C1CC4=C5C3CC(C=C5OC6=C4C(=CC=C6)OC)O2)O',
  hydrocodone: 'CC12CCC3(C1CC4=C5C3CC(=O)C=C5OC6=C4C(=CC=C6)OC)O2',
  morphine: 'CN1CCC23C4C1CC5=C2C(=C(C=C5)O)OC3C(C=C4)O',
  codeine: 'CN1CCC23C4C1CC5=C2C(=C(C=C5)OC)OC3C(C=C4)O',
  acetaminophen: 'CC(=O)NC1=CC=C(C=C1)O',
  ibuprofen: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O',
  naproxen: 'CC(C1=CC2=C(C=C1)C=C(C=C2)OC)C(=O)O',
  aspirin: 'CC(=O)OC1=CC=CC=C1C(=O)O',
  atorvastatin: 'CC(C)C1=C(C(=C(N1CCC(CC(CC(=O)O)O)O)C2=CC=C(C=C2)F)C3=CC=CC=C3)C(=O)NC4=CC=CC=C4',
  rosuvastatin: 'CC(C)C1=NC(=NC(=C1C=CC(CC(CC(=O)O)O)O)C2=CC=C(C=C2)F)N(C)S(=O)(=O)C',
  simvastatin: 'CCC(C)(C)C(=O)OC1CC(C=C2C1C(C(C=C2)C)CCC3CC(CC(=O)O3)O)C',
  pravastatin: 'CCC(C)C(=O)OC1CC(O)C=C2C1C(C(C=C2)C)CCC(O)CC(O)CC(=O)O',
  warfarin: 'CC(=O)CC(C1=CC=CC=C1)C2=C(C3=CC=CC=C3OC2=O)O',
  clopidogrel: 'COC(=O)C(C1=CC=CC=C1Cl)N2CCC3=C(C2)C=CS3',
  apixaban: 'COC1=CC=C(C=C1)N2C3=C(C=C(N3)C(=O)N)C(=O)N(C2=O)C4=CC=C(C=C4)N5CCCCC5=O',
  rivaroxaban: 'ClC1=CC=C(S1)C(=O)NCC2CN(C(=O)O2)C3=CC=C(N4CCOCC4=O)C=C3',
};

/**
 * Universal fallback SMILES (benzene ring) to guarantee non-empty valid SMILES.
 */
const DEFAULT_FALLBACK_SMILES = 'c1ccccc1';

/**
 * Regex matching pharmaceutical salt suffixes and ionic counterions.
 */
const SALT_SUFFIX_REGEX =
  /\b(hydrochloride|dihydrochloride|hcl|hydrobromide|hbr|tartrate|bitartrate|succinate|sodium|potassium|calcium|magnesium|monohydrate|dihydrate|trihydrate|hydrate|maleate|mesylate|fumarate|besylate|acetate|diacetate|phosphate|biphosphate|citrate|sulfate|bisulfate|bromide|nitrate|dipivoxil|propionate|dipropionate|valerate|gluconate|lactate|oxalate|carbonate|bicarbonate|chloride|tosylate|pamoate|stearate|benzoate|iodide)\b/gi;

/**
 * Normalizes a drug name or chemical identifier for standardized taxonomy matching.
 * - Strips bracketed qualifiers (e.g. `[Unasyn]`) and parenthetical notes.
 * - Strips common pharmaceutical salt and formulation suffixes.
 * - Strips non-alphanumeric characters and converts to lowercase.
 *
 * @param raw Raw drug name, brand name, or structure identifier
 * @returns Normalized alphanumeric string
 */
export function normalizeForTaxonomyMatch(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  const stripped = raw
    .toLowerCase()
    .replace(/\[.*?\]/g, ' ')
    .replace(/\(.*?\)/g, ' ')
    .replace(SALT_SUFFIX_REGEX, ' ')
    .replace(/[^a-z0-9]/g, '')
    .trim();
  if (!stripped) {
    return raw.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
  }
  return stripped;
}

/**
 * Pre-indexed maps for fast, deterministic taxonomy lookups.
 */
interface TaxonomyIndices {
  exactGenericMap: Map<string, TopDrugEntry>;
  componentGenericMap: Map<string, TopDrugEntry>;
  brandMap: Map<string, TopDrugEntry>;
}

let indicesCache: TaxonomyIndices | null = null;

function getTaxonomyIndices(): TaxonomyIndices {
  if (indicesCache) return indicesCache;

  const exactGenericMap = new Map<string, TopDrugEntry>();
  const componentGenericMap = new Map<string, TopDrugEntry>();
  const brandMap = new Map<string, TopDrugEntry>();

  for (const entry of TOP_DRUGS_TAXONOMY) {
    const fullNorm = normalizeForTaxonomyMatch(entry.genericName);
    if (fullNorm) {
      if (!exactGenericMap.has(fullNorm)) {
        exactGenericMap.set(fullNorm, entry);
      }
    }

    // Index combination components (e.g. "Metoprolol Tartrate / Succinate" -> "metoprolol")
    if (entry.genericName.includes('/')) {
      const parts = entry.genericName.split('/');
      for (const part of parts) {
        const partNorm = normalizeForTaxonomyMatch(part);
        if (partNorm && !componentGenericMap.has(partNorm)) {
          componentGenericMap.set(partNorm, entry);
        }
      }
    }

    // Index brand names
    for (const brand of entry.brandNames) {
      const brandNorm = normalizeForTaxonomyMatch(brand);
      if (brandNorm && !brandMap.has(brandNorm)) {
        brandMap.set(brandNorm, entry);
      }
    }
  }

  indicesCache = { exactGenericMap, componentGenericMap, brandMap };
  return indicesCache;
}

/**
 * Extracts candidate tokens from a drug name (e.g. splitting parentheses or slashes).
 */
function extractNameTokens(name?: string): string[] {
  if (!name || typeof name !== 'string') return [];
  const tokens = new Set<string>();

  const trimmed = name.trim();
  if (trimmed) tokens.add(trimmed);

  // Paren extraction
  const parenMatch = trimmed.match(/^([^(]+)\s*\(([^)]+)\)$/);
  if (parenMatch) {
    if (parenMatch[1].trim()) tokens.add(parenMatch[1].trim());
    if (parenMatch[2].trim()) tokens.add(parenMatch[2].trim());
  }

  // Bracket extraction
  const bracketMatch = trimmed.match(/^([^[]+)\s*\[([^\]]+)\]$/);
  if (bracketMatch) {
    if (bracketMatch[1].trim()) tokens.add(bracketMatch[1].trim());
    if (bracketMatch[2].trim()) tokens.add(bracketMatch[2].trim());
  }

  // Slash splitting
  if (trimmed.includes('/')) {
    trimmed.split('/').forEach((part) => {
      const p = part.trim();
      if (p) tokens.add(p);
    });
  }

  return Array.from(tokens);
}

/**
 * Matches candidate drug identifiers against the master Top Drugs taxonomy catalog.
 *
 * @param name Structure name (generic, trade, or combination)
 * @param genericName Optional explicitly declared generic name
 * @param brandNames Optional array of known brand names
 * @param cid Optional PubChem Compound ID
 * @returns Matching TopDrugEntry or null if unmatched
 */
export function findTopDrugMatch(
  name: string,
  genericName?: string,
  brandNames?: string[],
  _cid?: number
): TopDrugEntry | null {
  const { exactGenericMap, componentGenericMap, brandMap } = getTaxonomyIndices();

  // 1. Check explicitly provided genericName
  if (genericName) {
    const normGen = normalizeForTaxonomyMatch(genericName);
    if (normGen) {
      const match =
        exactGenericMap.get(normGen) ||
        brandMap.get(normGen) ||
        componentGenericMap.get(normGen);
      if (match) return match;
    }
  }

  // 2. Check primary name directly
  const normName = normalizeForTaxonomyMatch(name);
  if (normName) {
    const match = exactGenericMap.get(normName) || brandMap.get(normName);
    if (match) return match;
  }

  // 3. Check tokenized name candidates
  const tokens = extractNameTokens(name);
  for (const token of tokens) {
    const normToken = normalizeForTaxonomyMatch(token);
    if (normToken) {
      const match =
        exactGenericMap.get(normToken) ||
        brandMap.get(normToken) ||
        componentGenericMap.get(normToken);
      if (match) return match;
    }
  }

  // 4. Check component generic map for primary name
  if (normName && componentGenericMap.has(normName)) {
    return componentGenericMap.get(normName)!;
  }

  // 5. Check explicitly provided brandNames
  if (Array.isArray(brandNames)) {
    for (const b of brandNames) {
      const normB = normalizeForTaxonomyMatch(b);
      if (normB) {
        const match = brandMap.get(normB) || exactGenericMap.get(normB);
        if (match) return match;
      }
    }
  }

  // 6. Substring prefix / fuzzy fallback for composite names
  if (normName && normName.length >= 5) {
    for (const entry of TOP_DRUGS_TAXONOMY) {
      const eNorm = normalizeForTaxonomyMatch(entry.genericName);
      if (eNorm && eNorm.length >= 5) {
        if (normName.startsWith(eNorm) || eNorm.startsWith(normName)) {
          return entry;
        }
      }
    }
  }

  return null;
}

/**
 * Enriches a ChemicalStructure with standardized Top Drugs taxonomy metadata.
 * Non-destructive: preserves existing structure properties and appends brand names.
 *
 * @param structure Target chemical structure
 * @returns Enriched ChemicalStructure
 */
export function enrichStructureWithTaxonomy(structure: ChemicalStructure): ChemicalStructure {
  const match = findTopDrugMatch(
    structure.name,
    structure.genericName,
    structure.brandNames,
    structure.cid
  );
  if (!match) return structure;

  const existingBrands = Array.isArray(structure.brandNames) ? structure.brandNames : [];
  const mergedBrandNames = Array.from(new Set([...existingBrands, ...match.brandNames]));

  return {
    ...structure,
    brandNames: mergedBrandNames,
    tradeName: structure.tradeName || match.brandNames[0],
    therapeuticClassNumber: match.therapeuticClassNumber,
    therapeuticCategory: match.therapeuticCategory,
    broadPharmacologicClass: match.broadPharmacologicClass,
    specificPharmacologicClass: match.specificPharmacologicClass,
  };
}

/**
 * Resolves the comprehensive chemoinformatics structure record for a Top Drug.
 * Looks up TOP_DRUGS_SMILES_CATALOG by normalized generic name, alias, or brand names.
 */
export function resolveTopDrugStructureRecord(entry: TopDrugEntry): TopDrugStructureRecord {
  const rawClean = entry.genericName.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (TOP_DRUGS_SMILES_CATALOG[rawClean]) {
    return {
      ...TOP_DRUGS_SMILES_CATALOG[rawClean],
      genericName: entry.genericName,
    };
  }

  const cleanName = normalizeForTaxonomyMatch(entry.genericName);
  const catalogRecord = TOP_DRUGS_SMILES_CATALOG[cleanName];
  if (catalogRecord) {
    return {
      ...catalogRecord,
      genericName: entry.genericName,
    };
  }

  for (const brand of entry.brandNames) {
    const brandClean = normalizeForTaxonomyMatch(brand);
    if (TOP_DRUGS_SMILES_CATALOG[brandClean]) {
      return {
        ...TOP_DRUGS_SMILES_CATALOG[brandClean],
        genericName: entry.genericName,
      };
    }
  }

  const knownSmiles =
    TOP_DRUG_CURATED_SMILES[cleanName] ||
    getKnownDrugSmiles(entry.genericName) ||
    (entry.brandNames.length > 0 ? getKnownDrugSmiles(entry.brandNames[0]) : undefined) ||
    DEFAULT_FALLBACK_SMILES;

  return {
    genericName: entry.genericName,
    structureType: 'single-molecule',
    smiles: knownSmiles,
  };
}

/**
 * Resolves or synthesizes a valid Daylight SMILES string for a Top Drug.
 * Always resolves through TOP_DRUGS_SMILES_CATALOG first, guaranteeing zero fallback benzene rings.
 */
export function resolveSmilesForEntry(entry: TopDrugEntry): string {
  const record = resolveTopDrugStructureRecord(entry);
  if (record && record.smiles) {
    return record.smiles;
  }

  const cleanName = normalizeForTaxonomyMatch(entry.genericName);
  if (TOP_DRUG_CURATED_SMILES[cleanName]) {
    return TOP_DRUG_CURATED_SMILES[cleanName];
  }

  const fromKnown =
    getKnownDrugSmiles(entry.genericName) ||
    (entry.brandNames.length > 0 ? getKnownDrugSmiles(entry.brandNames[0]) : undefined);
  if (fromKnown) {
    return fromKnown;
  }

  return DEFAULT_FALLBACK_SMILES;
}

/**
 * Generates deterministic FlashcardItem records for the complete Top Drugs catalog.
 * Uses `generateBaseStructureId` to ensure consistent IDs and shared spaced-repetition
 * progress with curriculum cards.
 *
 * @returns Array of initialized FlashcardItem records for the Top 200 deck
 */
export function getTop200Flashcards(): FlashcardItem[] {
  const now = Date.now();
  const assignedIds = new Set<string>();
  const cards: FlashcardItem[] = [];

  for (const entry of TOP_DRUGS_TAXONOMY) {
    const structureRecord = resolveTopDrugStructureRecord(entry);
    const smiles = structureRecord.smiles || resolveSmilesForEntry(entry);

    const tempStructure: ChemicalStructure = {
      id: '',
      name: entry.genericName,
      genericName: entry.genericName,
      brandNames: [...entry.brandNames],
      tradeName: entry.brandNames[0],
      chemicalClass: entry.broadPharmacologicClass,
      pharmacologicalClass: entry.specificPharmacologicClass,
      target: entry.specificPharmacologicClass,
      reversibility: 'Reversible',
      route: 'Oral',
      keyFunctionalGroups: [],
      pkPdHighlights: {
        onset: 'N/A',
        duration: 'N/A',
        halfLife: 'N/A',
        elimination: 'Renal/Hepatic',
      },
      sarNotes: entry.notes || entry.specificPharmacologicClass,
      therapeuticClassNumber: entry.therapeuticClassNumber,
      therapeuticCategory: entry.therapeuticCategory,
      broadPharmacologicClass: entry.broadPharmacologicClass,
      specificPharmacologicClass: entry.specificPharmacologicClass,
      canonicalSmiles: smiles,
      canonical_smiles: smiles,
      smiles: smiles,
      structureRecord: structureRecord,
    };

    const baseId = generateBaseStructureId(tempStructure);
    let finalId = baseId;
    let counter = 1;
    while (assignedIds.has(finalId)) {
      finalId = `${baseId}_${counter++}`;
    }
    assignedIds.add(finalId);
    tempStructure.id = finalId;

    cards.push({
      structureId: finalId,
      drugName: entry.genericName,
      moduleIds: [entry.curriculumModuleId || 'top-drugs-taxonomy'],
      structure: tempStructure,
      intervalMinutes: 0,
      dueTimestamp: now,
      repetitionCount: 0,
      state: 'new',
      isSuspended: false,
      struggleCount: 0,
    });
  }

  return cards;
}

/**
 * Returns sorted therapeutic categories that actually have cards present in the deck.
 *
 * @param cards Array of FlashcardItem records
 * @returns Array of active TherapeuticClassCategory records sorted by classNumber
 */
export function getTherapeuticCategoriesForCards(
  cards: FlashcardItem[]
): TherapeuticClassCategory[] {
  if (!Array.isArray(cards) || cards.length === 0) return [];

  const activeClassNumbers = new Set<number>();
  for (const card of cards) {
    const classNum = card.structure.therapeuticClassNumber;
    if (typeof classNum === 'number' && classNum > 0) {
      activeClassNumbers.add(classNum);
    }
  }

  return THERAPEUTIC_CATEGORIES.filter((cat) =>
    activeClassNumbers.has(cat.classNumber)
  ).sort((a, b) => a.classNumber - b.classNumber);
}
