import type { ReviewModule, ChemicalStructure } from '../types/reviewModule';
import type { FlashcardItem } from '../types/cumulativeStudy';

/**
 * Normalizes SMILES strings for reliable deduplication comparison.
 */
function normalizeSmiles(smiles?: string): string | undefined {
  if (!smiles || typeof smiles !== 'string') return undefined;
  const trimmed = smiles.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Normalizes drug names by trimming, lowercasing, and standardizing whitespace.
 */
function normalizeName(name?: string): string {
  if (!name || typeof name !== 'string') return '';
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Extracts candidate alias/base names from a drug name string (e.g. "Aspirin (Acetylsalicylic Acid)" -> ["aspirin (acetylsalicylic acid)", "aspirin", "acetylsalicylic acid"]).
 */
function extractNameTokens(name?: string): string[] {
  const norm = normalizeName(name);
  if (!norm) return [];
  const tokens = new Set<string>([norm]);

  // If name contains parentheses e.g. "Aspirin (Acetylsalicylic Acid)" or "Lopressor / Toprol-XL"
  const parenMatch = norm.match(/^([^(]+)\s*\(([^)]+)\)$/);
  if (parenMatch) {
    const base = parenMatch[1].trim();
    const inside = parenMatch[2].trim();
    if (base) tokens.add(base);
    if (inside) tokens.add(inside);
  }

  // If name contains slash e.g. "Lopressor / Toprol-XL"
  if (norm.includes('/')) {
    norm.split('/').forEach((part) => {
      const p = part.trim();
      if (p) tokens.add(p);
    });
  }

  return Array.from(tokens);
}

/**
 * Generates a clean, deterministic, URL-friendly structure identifier.
 */
function generateBaseStructureId(st: ChemicalStructure): string {
  if (st.id && typeof st.id === 'string' && !/^[IVXLCDM0-9]+$/i.test(st.id.trim())) {
    return st.id.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '_');
  }
  if (st.cid && typeof st.cid === 'number' && st.cid > 0) {
    return `struct_${st.cid}`;
  }
  const cleanName = normalizeName(st.name).replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  return cleanName ? `struct_${cleanName}` : `struct_${Math.random().toString(36).slice(2, 9)}`;
}

interface AccumulatedCard {
  structureId: string;
  drugName: string;
  moduleIds: Set<string>;
  structure: ChemicalStructure;
  cids: Set<number>;
  smiles: Set<string>;
  names: Set<string>;
}

/**
 * Traverses a ReviewModule and extracts all ChemicalStructure instances
 * from top-level definitions, page sections, and individual questions.
 */
function extractModuleStructures(module: ReviewModule): ChemicalStructure[] {
  const extracted: ChemicalStructure[] = [];

  // 1. Direct module chemicalStructures array
  if (Array.isArray(module.chemicalStructures)) {
    for (const struct of module.chemicalStructures) {
      if (struct && typeof struct === 'object' && struct.name) {
        extracted.push(struct);
      }
    }
  }

  // 2. Traversal through pages -> sections -> structures & questions
  if (Array.isArray(module.pages)) {
    for (const page of module.pages) {
      if (!page || !Array.isArray(page.sections)) continue;

      for (const section of page.sections) {
        if (!section || typeof section !== 'object') continue;

        // Section-level structures
        if (Array.isArray(section.structures)) {
          for (const s of section.structures) {
            if (s && typeof s === 'object' && s.name) extracted.push(s);
          }
        }
        if (Array.isArray(section.local_structures)) {
          for (const s of section.local_structures) {
            if (s && typeof s === 'object' && s.name) extracted.push(s);
          }
        }

        // Question-level structures
        if (Array.isArray(section.questions)) {
          for (const q of section.questions) {
            if (!q || typeof q !== 'object') continue;

            if (Array.isArray(q.structuresDisplayed)) {
              for (const s of q.structuresDisplayed) {
                if (s && typeof s === 'object' && s.name) extracted.push(s);
              }
            }

            if (q.structuralWorkbench?.stemStructure && q.structuralWorkbench.stemStructure.name) {
              extracted.push(q.structuralWorkbench.stemStructure);
            }
          }
        }
      }
    }
  }

  return extracted;
}

/**
 * Harvests all chemical structures across multiple ReviewModule instances,
 * deduplicates molecules appearing across multiple modules (by CID, SMILES,
 * or normalized names), merges origin module IDs, and returns fully initialized
 * FlashcardItem records for spaced repetition.
 *
 * @param modules Array of loaded ReviewModule instances
 * @returns Deduplicated array of initialized FlashcardItem records
 */
export function harvestCurriculumStructures(modules: ReviewModule[]): FlashcardItem[] {
  if (!Array.isArray(modules) || modules.length === 0) {
    return [];
  }

  const accumulatedCards: AccumulatedCard[] = [];
  const assignedStructureIds = new Set<string>();

  for (const mod of modules) {
    if (!mod || !mod.id) continue;
    const moduleId = mod.id;
    const structures = extractModuleStructures(mod);

    for (const struct of structures) {
      if (!struct || typeof struct.name !== 'string' || !struct.name.trim()) {
        continue;
      }

      const structCid = typeof struct.cid === 'number' && struct.cid > 0 ? struct.cid : undefined;
      const structSmiles = normalizeSmiles(
        struct.canonicalSmiles || struct.canonical_smiles || struct.smiles
      );
      const nameTokens = extractNameTokens(struct.name);

      // Check if this structure matches an already accumulated card
      let matchedCard: AccumulatedCard | undefined;

      for (const card of accumulatedCards) {
        // Match 1: Matching PubChem CID
        if (structCid && card.cids.has(structCid)) {
          matchedCard = card;
          break;
        }

        // Match 2: Matching Canonical/Daylight SMILES
        if (structSmiles && card.smiles.has(structSmiles)) {
          matchedCard = card;
          break;
        }

        // Match 3: Matching normalized name or name token
        for (const token of nameTokens) {
          if (card.names.has(token)) {
            matchedCard = card;
            break;
          }
        }
        if (matchedCard) break;
      }

      if (matchedCard) {
        // Merge module ID
        matchedCard.moduleIds.add(moduleId);

        // Merge identifiers
        if (structCid) matchedCard.cids.add(structCid);
        if (structSmiles) matchedCard.smiles.add(structSmiles);
        for (const t of nameTokens) matchedCard.names.add(t);

        // Enrich structure details if incoming structure has richer metadata
        matchedCard.structure = {
          ...struct,
          ...matchedCard.structure,
          chemicalClass: matchedCard.structure.chemicalClass || struct.chemicalClass,
          pharmacologicalClass:
            matchedCard.structure.pharmacologicalClass || struct.pharmacologicalClass,
          target: matchedCard.structure.target || struct.target,
          sarNotes: matchedCard.structure.sarNotes || struct.sarNotes,
          pngUrl: matchedCard.structure.pngUrl || struct.pngUrl,
          pubchemUrl: matchedCard.structure.pubchemUrl || struct.pubchemUrl,
          cid: matchedCard.structure.cid || struct.cid,
          canonicalSmiles:
            matchedCard.structure.canonicalSmiles ||
            matchedCard.structure.canonical_smiles ||
            struct.canonicalSmiles ||
            struct.canonical_smiles,
        };
      } else {
        // Generate a collision-free unique structureId
        let baseId = generateBaseStructureId(struct);
        let finalId = baseId;
        let suffix = 1;
        while (assignedStructureIds.has(finalId)) {
          finalId = `${baseId}_${suffix++}`;
        }
        assignedStructureIds.add(finalId);

        const newCard: AccumulatedCard = {
          structureId: finalId,
          drugName: struct.name.trim(),
          moduleIds: new Set<string>([moduleId]),
          structure: { ...struct },
          cids: new Set<number>(structCid ? [structCid] : []),
          smiles: new Set<string>(structSmiles ? [structSmiles] : []),
          names: new Set<string>(nameTokens),
        };

        accumulatedCards.push(newCard);
      }
    }
  }

  const creationTimestamp = Date.now();

  return accumulatedCards.map((acc) => ({
    structureId: acc.structureId,
    drugName: acc.drugName,
    moduleIds: Array.from(acc.moduleIds),
    structure: acc.structure,
    intervalMinutes: 0,
    dueTimestamp: creationTimestamp,
    repetitionCount: 0,
    state: 'new',
    isSuspended: false,
    struggleCount: 0,
  }));
}

/**
 * Filters a flashcard deck by active module IDs.
 * A card is included if it belongs to at least one of the active modules.
 *
 * @param cards Array of FlashcardItem records
 * @param activeModuleIds Array of module IDs currently enabled
 * @returns Filtered array of FlashcardItem records
 */
export function filterFlashcardsByModules(
  cards: FlashcardItem[],
  activeModuleIds: string[]
): FlashcardItem[] {
  if (!Array.isArray(cards) || cards.length === 0) return [];
  if (!Array.isArray(activeModuleIds) || activeModuleIds.length === 0) return [];

  const activeSet = new Set(activeModuleIds);
  return cards.filter((card) => card.moduleIds.some((mId) => activeSet.has(mId)));
}
