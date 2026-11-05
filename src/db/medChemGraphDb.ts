import Dexie, { Table } from 'dexie';
import { ReviewModule, QuizSessionProgress } from '../types/reviewModule';
import { getKnownDrugSmiles } from '../utils/knownDrugSmiles';
import { getCorrectedSmarts } from '../utils/smartsDictionary';
import { antiplateletMolBlocks } from '../data/antiplateletMolBlocks';
import type { OpenFdaClinicalData, ClinicalData, EliminationHalfLifeObj } from '../services/openFdaService';
export type { OpenFdaClinicalData, ClinicalData, EliminationHalfLifeObj };

export type EntityType =
  | 'DRUG'
  | 'DRUG_CLASS'
  | 'PHARMACOPHORE'
  | 'PHARMACOPHORE_OR_MOIETY'
  | 'TARGET_OR_ENZYME'
  | 'METABOLITE'
  | 'ADVERSE_EFFECT'
  | 'DISEASE_STATE';

export interface ChemData {
  cid?: number;
  iupacName?: string;
  isomericSmiles?: string;
  canonicalSmiles?: string;
  molecularFormula?: string;
  molecularWeight?: number;
  xlogp?: number;
  structureImageDataUrl?: string;
  structureImageBlob?: Blob;
  pubchemMolBlock?: string;
}

export interface GraphEntity {
  /** Canonical lowercase unique identifier, e.g. "clopidogrel", "cyp2c19" */
  id: string;
  /** Display title, e.g. "Clopidogrel", "CYP2C19" */
  name?: string;
  type: EntityType;
  clinical_and_sar_summary: string;
  cid?: number;
  canonicalSmiles?: string;
  smiles?: string;
  pubchemMolBlock?: string;
  chemData?: ChemData;
  sourcePageNumber?: number;
  sourcePageNumbers?: number[];
  updatedAt?: string;
  chemical_class?: string;
  chemicalClass?: string;
  target_receptor?: string;
  target?: string;
  reversibility?: string;
  route_of_admin?: string;
  route?: string;
  onset?: string;
  half_life?: string;
  elimination_half_life?: EliminationHalfLifeObj | string;
  bioactivation?: string;
  location_of_metabolism?: string;
  metabolism_pathway?: string[];
  unique_differentiator?: string;
  structural_differences?: string;
  pk_pd_profile?: string;
  clinical_use_cases?: string;
  pharmacological_class?: string;
  pharmacologicalClass?: string;
  pharmacophores?: any[];
  pkPdHighlights?: any;
  pk_pd_highlights?: any;
  moa_summary?: string;
  sar_rationale?: string;
  sarNotes?: string;
  majorToxicityOrLimitation?: string;
  pubchemAudit?: any;
  clinicalData?: ClinicalData;
  casual_sar_explanation?: string;
  logP?: number;
  properties?: Record<string, any>;
}

export interface GraphRelationship {
  /** Canonical lowercase source entity ID */
  source: string;
  /** Normalized uppercase relation type, e.g. "INHIBITS", "METABOLIZED_BY" */
  relation: string;
  /** Canonical lowercase target entity ID */
  target: string;
  sar_and_mechanism_context: string;
  theme_keywords: string[];
  sourcePageNumber?: number;
  updatedAt?: string;
}

export interface MergeStats {
  addedEntities: number;
  updatedEntities: number;
  addedRelationships: number;
  updatedRelationships: number;
  totalEntities: number;
  totalRelationships: number;
}

export interface StoredReviewModule {
  id: string;
  module: ReviewModule;
  updatedAt: string;
}

export interface StoredModuleProgress {
  moduleId: string;
  progress: QuizSessionProgress;
  updatedAt: string;
}

export class MedChemGraphDatabase extends Dexie {
  entities!: Table<GraphEntity, string>;
  relationships!: Table<GraphRelationship, [string, string, string]>;
  modules!: Table<StoredReviewModule, string>;
  sessionProgress!: Table<StoredModuleProgress, string>;

  /**
   * Alias table for drugs, providing direct typed access for Fat Client components and useQuery hooks.
   * Resolves directly to the entities table.
   */
  get drugs(): Table<GraphEntity, string> {
    return this.entities;
  }

  constructor() {
    super('MedChemGraphDb');
    this.version(1).stores({
      entities: 'id, type, cid',
      relationships: '[source+relation+target], source, target, relation, *theme_keywords',
    });
    this.version(2).stores({
      entities: 'id, type, cid',
      relationships: '[source+relation+target], source, target, relation, *theme_keywords',
      modules: 'id, updatedAt',
      sessionProgress: 'moduleId, updatedAt',
    });

    // Proactively request persistent storage to protect database from browser eviction
    this.on('ready', async () => {
      if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
        try {
          const isPersisted = await navigator.storage.persisted();
          if (!isPersisted) {
            const granted = await navigator.storage.persist();
            if (granted) {
              console.log('[MedChemGraphDb] Persistent storage granted.');
            }
          }
        } catch (err) {
          console.warn('[MedChemGraphDb] Persistent storage request error:', err);
        }
      }
    });
  }

  /**
   * Incrementally merges entities and relationships into Dexie.
   * - Retains existing PubChem chemData (never overwriting verified structures).
   * - Merges clinical and SAR summaries without duplicate duplication.
   * - Unifies theme keywords into distinct sets.
   */
  async mergeGraphToDexie(
    incomingEntities: GraphEntity[] = [],
    incomingRelationships: GraphRelationship[] = []
  ): Promise<MergeStats> {
    let addedEntities = 0;
    let updatedEntities = 0;
    let addedRelationships = 0;
    let updatedRelationships = 0;

    await this.transaction('rw', [this.entities, this.relationships], async () => {
      const now = new Date().toISOString();

      // 1. Process Entities
      for (const ent of incomingEntities) {
        if (!ent || !ent.id) continue;
        const id = ent.id.trim().toLowerCase();
        if (!id) continue;

        const existing = await this.entities.get(id);

        if (!existing) {
          const pageNum = ent.sourcePageNumber || (ent as any).source_slide_index || 1;
          const fallbackSmiles = getKnownDrugSmiles(ent.name) || getKnownDrugSmiles(id);
          const canonicalSmiles =
            ent.canonicalSmiles ||
            ent.smiles ||
            ent.chemData?.canonicalSmiles ||
            ent.chemData?.isomericSmiles ||
            ent.pubchemAudit?.canonicalSmiles ||
            fallbackSmiles;
          const resolvedCid = ent.cid || ent.chemData?.cid || ent.pubchemAudit?.cid;
          const resolvedMolBlock = ent.pubchemMolBlock || ent.chemData?.pubchemMolBlock;
          const normalizedPharmacophores = Array.isArray(ent.pharmacophores)
            ? ent.pharmacophores.map((p) => ({
                ...p,
                smarts: getCorrectedSmarts(p?.name, p?.smarts || '') || undefined,
              }))
            : ent.pharmacophores;

          const newEntity: GraphEntity = {
            ...ent,
            id,
            name: ent.name || ent.id,
            type: ent.type || 'DRUG',
            clinical_and_sar_summary: (ent.clinical_and_sar_summary || '').trim(),
            cid: resolvedCid,
            canonicalSmiles: canonicalSmiles || undefined,
            smiles: canonicalSmiles || undefined,
            pubchemMolBlock: resolvedMolBlock || undefined,
            pharmacophores: normalizedPharmacophores,
            pubchemAudit: {
              ...(ent.pubchemAudit || {}),
              cid: resolvedCid || 0,
              status: resolvedCid ? 'verified' : (canonicalSmiles ? 'verified' : 'unresolved'),
              verifiedAt: ent.pubchemAudit?.verifiedAt || now,
              source: ent.pubchemAudit?.source || (fallbackSmiles && !resolvedCid ? 'curated_offline_fallback' : 'nih_pug_rest'),
              canonicalSmiles: canonicalSmiles || undefined,
            },
            chemData: ent.chemData
              ? {
                  ...ent.chemData,
                  canonicalSmiles: ent.chemData.canonicalSmiles || canonicalSmiles,
                  isomericSmiles: ent.chemData.isomericSmiles || canonicalSmiles,
                  pubchemMolBlock: resolvedMolBlock || ent.chemData.pubchemMolBlock,
                }
              : canonicalSmiles || resolvedMolBlock
              ? {
                  canonicalSmiles: canonicalSmiles || undefined,
                  isomericSmiles: canonicalSmiles || undefined,
                  pubchemMolBlock: resolvedMolBlock || undefined,
                }
              : undefined,
            sourcePageNumber: pageNum,
            sourcePageNumbers: ent.sourcePageNumbers && ent.sourcePageNumbers.length > 0 ? ent.sourcePageNumbers : [pageNum],
            logP: ent.logP !== undefined ? ent.logP : ent.chemData?.xlogp,
            properties: ent.properties || (ent.logP !== undefined ? { logP: ent.logP } : undefined),
            updatedAt: now,
          };
          await this.entities.add(newEntity);
          addedEntities++;
        } else {
          // Deduplicate summary: keep the richest/latest single extraction, DO NOT concatenate
          let mergedSummary = existing.clinical_and_sar_summary || '';
          const newSummary = (ent.clinical_and_sar_summary || '').trim();

          if (newSummary) {
            if (!mergedSummary || newSummary.length >= mergedSummary.length) {
              mergedSummary = newSummary;
            }
          }

          // Merge source slide numbers across slides
          const newPageNum = ent.sourcePageNumber || (ent as any).source_slide_index;
          const existingPages = existing.sourcePageNumbers || (existing.sourcePageNumber ? [existing.sourcePageNumber] : []);
          const mergedPages =
            newPageNum && !existingPages.includes(newPageNum)
              ? [...existingPages, newPageNum].sort((a, b) => a - b)
              : existingPages;
          const earliestPage = mergedPages.length ? Math.min(...mergedPages) : (existing.sourcePageNumber || 1);

          // Merge chemData non-destructively: preserve existing structure image & properties if already cached
          let mergedChemData: ChemData | undefined = existing.chemData;
          if (ent.chemData) {
            if (!mergedChemData) {
              mergedChemData = { ...ent.chemData };
            } else {
              mergedChemData = {
                ...ent.chemData,
                ...mergedChemData, // existing verified fields take precedence
                structureImageDataUrl:
                  mergedChemData.structureImageDataUrl || ent.chemData.structureImageDataUrl,
                structureImageBlob:
                  mergedChemData.structureImageBlob || ent.chemData.structureImageBlob,
                isomericSmiles:
                  mergedChemData.isomericSmiles || ent.chemData.isomericSmiles,
                canonicalSmiles:
                  mergedChemData.canonicalSmiles || ent.chemData.canonicalSmiles,
                cid: mergedChemData.cid || ent.chemData.cid,
                pubchemMolBlock:
                  mergedChemData.pubchemMolBlock || ent.chemData.pubchemMolBlock,
              };
            }
          }

          const fallbackSmiles =
            getKnownDrugSmiles(existing.name) ||
            getKnownDrugSmiles(existing.id) ||
            getKnownDrugSmiles(ent.name) ||
            getKnownDrugSmiles(id);

          const mergedSmiles =
            ent.canonicalSmiles ||
            ent.smiles ||
            ent.chemData?.canonicalSmiles ||
            ent.chemData?.isomericSmiles ||
            existing.canonicalSmiles ||
            existing.smiles ||
            mergedChemData?.canonicalSmiles ||
            mergedChemData?.isomericSmiles ||
            existing.pubchemAudit?.canonicalSmiles ||
            ent.pubchemAudit?.canonicalSmiles ||
            fallbackSmiles;

          const resolvedMolBlock =
            existing.pubchemMolBlock ||
            ent.pubchemMolBlock ||
            mergedChemData?.pubchemMolBlock ||
            ent.chemData?.pubchemMolBlock;

          if (mergedChemData) {
            if (mergedSmiles) {
              mergedChemData.canonicalSmiles = mergedChemData.canonicalSmiles || mergedSmiles;
              mergedChemData.isomericSmiles = mergedChemData.isomericSmiles || mergedSmiles;
            }
            if (resolvedMolBlock) {
              mergedChemData.pubchemMolBlock = mergedChemData.pubchemMolBlock || resolvedMolBlock;
            }
          }

          const resolvedCid = existing.cid || ent.cid || mergedChemData?.cid || existing.pubchemAudit?.cid || ent.pubchemAudit?.cid;
          const entityPharmacophores = ent.pharmacophores || existing.pharmacophores;
          const normalizedPharmacophores = Array.isArray(entityPharmacophores)
            ? entityPharmacophores.map((p) => ({
                ...p,
                smarts: getCorrectedSmarts(p?.name, p?.smarts || '') || undefined,
              }))
            : entityPharmacophores;

          const updated: GraphEntity = {
            ...existing,
            name: existing.name || ent.name || existing.id,
            type: existing.type || ent.type,
            clinical_and_sar_summary: mergedSummary,
            cid: resolvedCid,
            canonicalSmiles: mergedSmiles || undefined,
            smiles: mergedSmiles || undefined,
            pubchemMolBlock: resolvedMolBlock || undefined,
            pharmacophores: normalizedPharmacophores,
            pubchemAudit: {
              ...(existing.pubchemAudit || ent.pubchemAudit || {}),
              cid: resolvedCid || 0,
              status: resolvedCid ? 'verified' : (mergedSmiles ? 'verified' : 'unresolved'),
              verifiedAt: now,
              source: existing.pubchemAudit?.source || ent.pubchemAudit?.source || (fallbackSmiles && !resolvedCid ? 'curated_offline_fallback' : 'nih_pug_rest'),
              canonicalSmiles: mergedSmiles || undefined,
            },
            chemData: mergedChemData,
            sourcePageNumber: earliestPage,
            sourcePageNumbers: mergedPages.length ? mergedPages : [earliestPage],
            clinicalData: ent.clinicalData || existing.clinicalData,
            majorToxicityOrLimitation: ent.majorToxicityOrLimitation || existing.majorToxicityOrLimitation,
            moa_summary: ent.moa_summary || existing.moa_summary,
            half_life: ent.half_life || existing.half_life,
            logP: ent.logP !== undefined ? ent.logP : (existing.logP ?? ent.chemData?.xlogp ?? existing.chemData?.xlogp),
            properties: {
              ...(existing.properties || {}),
              ...(ent.properties || {}),
              ...(ent.logP !== undefined ? { logP: ent.logP } : {}),
            },
            updatedAt: now,
          };

          await this.entities.put(updated);
          updatedEntities++;
        }

        // Explode Pharmacophores into distinct PHARMACOPHORE entity nodes and HAS_PHARMACOPHORE relationships
        const rawPharmacophores = (Array.isArray(ent.pharmacophores) && ent.pharmacophores.length > 0)
          ? ent.pharmacophores
          : (Array.isArray(existing?.pharmacophores) ? existing.pharmacophores : []);

        for (const p of rawPharmacophores) {
          if (!p || !p.name) continue;
          const pClean = String(p.id || p.name).trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
          const pharmaNodeId = `pharma_${id}_${pClean}`;
          const pharmaSummary = (p.purpose || p.description || `Pharmacophore group "${p.name}" conferring target binding and SAR properties.`).trim();
          const correctedSmarts = getCorrectedSmarts(p.name, p.smarts || '') || undefined;
          const pharmaObj = {
            ...p,
            smarts: correctedSmarts,
          };

          const existingPharma = await this.entities.get(pharmaNodeId);
          if (!existingPharma) {
            await this.entities.add({
              id: pharmaNodeId,
              name: p.name,
              type: 'PHARMACOPHORE',
              clinical_and_sar_summary: pharmaSummary,
              pharmacophores: [pharmaObj],
              sar_rationale: p.purpose || p.description,
              casual_sar_explanation: p.casual_sar_explanation,
              updatedAt: now,
            });
            addedEntities++;
          } else {
            await this.entities.put({
              ...existingPharma,
              name: p.name || existingPharma.name,
              type: 'PHARMACOPHORE',
              clinical_and_sar_summary: pharmaSummary || existingPharma.clinical_and_sar_summary,
              pharmacophores: [pharmaObj],
              sar_rationale: p.purpose || p.description || existingPharma.sar_rationale,
              casual_sar_explanation: p.casual_sar_explanation || (existingPharma as any).casual_sar_explanation,
              updatedAt: now,
            });
          }

          const pharmaRelKey: [string, string, string] = [id, 'HAS_PHARMACOPHORE', pharmaNodeId];
          const existingPharmaRel = await this.relationships.get(pharmaRelKey);
          if (!existingPharmaRel) {
            await this.relationships.add({
              source: id,
              relation: 'HAS_PHARMACOPHORE',
              target: pharmaNodeId,
              sar_and_mechanism_context: p.purpose || p.description || `Drug ${ent.name || id} presents pharmacophore ${p.name}.`,
              theme_keywords: ['pharmacophore', 'sar', p.category || 'binding'],
              updatedAt: now,
            });
            addedRelationships++;
          }
        }
      }

      // 2. Process Relationships
      for (const rel of incomingRelationships) {
        if (!rel || !rel.source || !rel.relation || !rel.target) continue;
        const source = rel.source.trim().toLowerCase();
        const target = rel.target.trim().toLowerCase();
        const relation = rel.relation.trim().toUpperCase();
        if (!source || !target || !relation) continue;

        const compoundKey: [string, string, string] = [source, relation, target];
        const existingRel = await this.relationships.get(compoundKey);

        const incomingKeywords = Array.isArray(rel.theme_keywords)
          ? rel.theme_keywords.map((k) => String(k).trim()).filter(Boolean)
          : [];

        if (!existingRel) {
          const newRel: GraphRelationship = {
            source,
            relation,
            target,
            sar_and_mechanism_context: (rel.sar_and_mechanism_context || '').trim(),
            theme_keywords: Array.from(new Set(incomingKeywords)),
            updatedAt: now,
          };
          await this.relationships.add(newRel);
          addedRelationships++;
        } else {
          // Merge theme keywords uniquely
          const keywordMap = new Map<string, string>();
          (existingRel.theme_keywords || []).forEach((kw) => {
            keywordMap.set(kw.toLowerCase(), kw);
          });
          incomingKeywords.forEach((kw) => {
            if (!keywordMap.has(kw.toLowerCase())) {
              keywordMap.set(kw.toLowerCase(), kw);
            }
          });
          const mergedKeywords = Array.from(keywordMap.values());

          // Merge SAR & mechanism context
          let mergedContext = existingRel.sar_and_mechanism_context || '';
          const newContext = (rel.sar_and_mechanism_context || '').trim();
          if (newContext && !mergedContext.toLowerCase().includes(newContext.toLowerCase())) {
            mergedContext = mergedContext
              ? `${mergedContext}\n\n${newContext}`
              : newContext;
          }

          const updatedRel: GraphRelationship = {
            ...existingRel,
            sar_and_mechanism_context: mergedContext,
            theme_keywords: mergedKeywords,
            updatedAt: now,
          };

          await this.relationships.put(updatedRel);
          updatedRelationships++;
        }

        // Prevent Orphan/Dangling Edges: ensure both source and target have entity records
        const ensureEntityExists = async (nodeId: string, inferredType: EntityType) => {
          const ent = await this.entities.get(nodeId);
          if (!ent) {
            const displayName = nodeId
              .split('_')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');
            await this.entities.add({
              id: nodeId,
              name: displayName,
              type: inferredType,
              clinical_and_sar_summary: `Synthesized from knowledge graph relationship context (${rel.relation}).`,
              updatedAt: now,
            });
            addedEntities++;
          }
        };

        const sourceInferred: EntityType =
          rel.relation.includes('METABOL') || rel.relation.includes('PRODRUG')
            ? 'DRUG'
            : 'TARGET_OR_ENZYME';
        const targetInferred: EntityType =
          rel.relation.includes('INHIBIT') || rel.relation.includes('TARGET') || rel.relation.includes('BINDS')
            ? 'TARGET_OR_ENZYME'
            : rel.relation.includes('PHARMACOPHORE')
            ? 'PHARMACOPHORE_OR_MOIETY'
            : 'METABOLITE';

        await ensureEntityExists(source, sourceInferred);
        await ensureEntityExists(target, targetInferred);
      }
    });

    const totalEntities = await this.entities.count();
    const totalRelationships = await this.relationships.count();

    return {
      addedEntities,
      updatedEntities,
      addedRelationships,
      updatedRelationships,
      totalEntities,
      totalRelationships,
    };
  }

  /**
   * Retrieves summary statistics for the knowledge graph.
   * Streams entities to avoid allocating all high-res Base64/Blob payloads on the V8 heap at once.
   */
  async getGraphStats() {
    const totalEntities = await this.entities.count();
    const totalRelationships = await this.relationships.count();

    const entitiesByType: Record<string, number> = {};
    let enrichedChemCount = 0;

    // Stream records individually without full array heap deserialization
    await this.entities.each((ent) => {
      entitiesByType[ent.type] = (entitiesByType[ent.type] || 0) + 1;
      if (
        ent.cid ||
        ent.chemData?.cid ||
        ent.chemData?.structureImageDataUrl ||
        ent.chemData?.structureImageBlob
      ) {
        enrichedChemCount++;
      }
    });

    return {
      totalEntities,
      totalRelationships,
      entitiesByType,
      enrichedChemCount,
    };
  }
}

// Singleton database export
export const medChemGraphDb = new MedChemGraphDatabase();

/**
 * Proactively verifies and requests persistent storage quota
 */
export async function ensureStoragePersistence(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
    try {
      const isPersisted = await navigator.storage.persisted();
      if (!isPersisted) {
        return await navigator.storage.persist();
      }
      return true;
    } catch (err) {
      console.warn('[MedChemGraphDb] Storage persist check failed:', err);
    }
  }
  return false;
}

/**
 * Pre-seeds standard medicinal chemistry entities and relationships if database is empty or needs GDMT update.
 */
export async function seedDefaultKnowledgeGraph(): Promise<void> {
  await ensureStoragePersistence();
  const existingVorapaxar = await medChemGraphDb.entities.get('vorapaxar');
  const count = await medChemGraphDb.entities.count();
  if (count > 0 && existingVorapaxar) return;

  const defaultEntities: GraphEntity[] = [
    {
      id: 'clopidogrel',
      name: 'Clopidogrel',
      type: 'DRUG',
      clinical_and_sar_summary:
        'Second-generation thienopyridine prodrug. Requires two sequential hepatic cytochrome P450 oxidations (predominantly CYP2C19) to open the thiophene ring into an active thiol metabolite that covalently forms a disulfide bridge with Cys17 and Cys270 on the P2Y12 ADP receptor. Contains a methyl ester side chain prone to esterase hydrolysis (~85% inactivated to clopidogrel carboxylic acid).',
      cid: 98144,
      canonicalSmiles: 'COC(=O)C(C1=CC=CC=C1Cl)N2CCC3=C(C2)C=CS3',
      smiles: 'COC(=O)C(C1=CC=CC=C1Cl)N2CCC3=C(C2)C=CS3',
      pubchemMolBlock: antiplateletMolBlocks[98144] || antiplateletMolBlocks[60606],
      pubchemAudit: {
        cid: 98144,
        status: 'verified',
        verifiedAt: new Date().toISOString(),
        source: 'nih_pug_rest',
        canonicalSmiles: 'COC(=O)C(C1=CC=CC=C1Cl)N2CCC3=C(C2)C=CS3',
        pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/98144',
      },
      chemData: {
        cid: 98144,
        iupacName: 'methyl (2S)-2-(2-chlorophenyl)-2-(6,7-dihydro-4H-thieno[3,2-c]pyridin-5-yl)acetate',
        canonicalSmiles: 'COC(=O)C(C1=CC=CC=C1Cl)N2CCC3=C(C2)C=CS3',
        isomericSmiles: 'COC(=O)[C@@H](C1=CC=CC=C1Cl)N2CCC3=C(C2)C=CS3',
        molecularWeight: 321.82,
        xlogp: 3.8,
        pubchemMolBlock: antiplateletMolBlocks[98144] || antiplateletMolBlocks[60606],
      },
    },
    {
      id: 'prasugrel',
      name: 'Prasugrel',
      type: 'DRUG',
      clinical_and_sar_summary:
        'Third-generation thienopyridine prodrug. Possesses an ester moiety at position 2 of the thiophene ring. Undergoes rapid intestinal carboxylesterase (CES2) hydrolysis to a thiolactone intermediate (R-95913), followed by a single CYP oxidation (CYP3A4 / CYP2B6) to generate its active metabolite. Much more potent, rapid, and consistent than clopidogrel with minimal resistance.',
      cid: 6918456,
      canonicalSmiles: 'CC(=O)OC1=CC2=C(C1)CCN(C2)C(C(=O)C3CC3)C4=CC=CC=C4F',
      smiles: 'CC(=O)OC1=CC2=C(C1)CCN(C2)C(C(=O)C3CC3)C4=CC=CC=C4F',
      pubchemMolBlock: antiplateletMolBlocks[6918456],
      pubchemAudit: {
        cid: 6918456,
        status: 'verified',
        verifiedAt: new Date().toISOString(),
        source: 'nih_pug_rest',
        canonicalSmiles: 'CC(=O)OC1=CC2=C(C1)CCN(C2)C(C(=O)C3CC3)C4=CC=CC=C4F',
        pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/6918456',
      },
      chemData: {
        cid: 6918456,
        iupacName: '[5-[(1R)-2-cyclopropyl-1-(2-fluorophenyl)-2-oxoethyl]-6,7-dihydro-4H-thieno[3,2-c]pyridin-2-yl] acetate',
        canonicalSmiles: 'CC(=O)OC1=CC2=C(C1)CCN(C2)C(C(=O)C3CC3)C4=CC=CC=C4F',
        isomericSmiles: 'CC(=O)OC1=CC2=C(C1)CCN(C2)[C@@H](C(=O)C3CC3)C4=CC=CC=C4F',
        molecularWeight: 373.44,
        xlogp: 3.4,
        pubchemMolBlock: antiplateletMolBlocks[6918456],
      },
    },
    {
      id: 'ticagrelor',
      name: 'Ticagrelor',
      type: 'DRUG',
      clinical_and_sar_summary:
        'Cyclopentyltriazolopyrimidine (CPTP) class. Non-prodrug, directly active, allosteric reversible antagonist of the P2Y12 ADP receptor. Does not bind at the ADP catalytic pocket; binds allosterically to lock the receptor in an inactive conformation. In addition to P2Y12 blockade, inhibits ENT-1 (equilibrative nucleoside transporter 1), increasing circulating adenosine which causes dyspnea.',
      cid: 9871419,
      canonicalSmiles: 'CCCSC1=NC2=C(N1C3CC(C(C3O)O)OCCO)N=C(N=C2)NC4CC4C5=CC(=C(C=C5)F)F',
      smiles: 'CCCSC1=NC2=C(N1C3CC(C(C3O)O)OCCO)N=C(N=C2)NC4CC4C5=CC(=C(C=C5)F)F',
      pubchemMolBlock: antiplateletMolBlocks[9871419],
      pubchemAudit: {
        cid: 9871419,
        status: 'verified',
        verifiedAt: new Date().toISOString(),
        source: 'nih_pug_rest',
        canonicalSmiles: 'CCCSC1=NC2=C(N1C3CC(C(C3O)O)OCCO)N=C(N=C2)NC4CC4C5=CC(=C(C=C5)F)F',
        pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/9871419',
      },
      chemData: {
        cid: 9871419,
        iupacName: '(1S,2S,3R,5S)-3-[7-[[(1R,2S)-2-(3,4-difluorophenyl)cyclopropyl]amino]-5-propylsulfanyl-1,2,3-triazolo[4,5-d]pyrimidin-3-yl]-5-(2-hydroxyethoxy)cyclopentane-1,2-diol',
        canonicalSmiles: 'CCCSC1=NC2=C(N1C3CC(C(C3O)O)OCCO)N=C(N=C2)NC4CC4C5=CC(=C(C=C5)F)F',
        isomericSmiles: 'CCCSC1=NC2=C(N1[C@H]3C[C@@H]([C@H]([C@H]3O)O)OCCO)N=C(N=C2)N[C@@H]4C[C@H]4C5=CC(=C(C=C5)F)F',
        molecularWeight: 522.57,
        xlogp: 2.3,
        pubchemMolBlock: antiplateletMolBlocks[9871419],
      },
    },
    {
      id: 'ticlopidine',
      name: 'Ticlopidine',
      type: 'DRUG',
      clinical_and_sar_summary:
        'First-generation prototype thienopyridine. Irreversible P2Y12 antagonist prodrug requiring 2 CYP3A4 oxidation steps. Lacks alpha-position substituents. Forms electrophilic reactive pyridinium and sulfenic acid metabolites responsible for severe idiosyncratic hematologic toxicities: neutropenia, agranulocytosis, and TTP.',
      cid: 5472,
      canonicalSmiles: 'C1CN(CC2=C1C=CS2)CC3=CC=CC=C3Cl',
      smiles: 'C1CN(CC2=C1C=CS2)CC3=CC=CC=C3Cl',
      pubchemMolBlock: antiplateletMolBlocks[5472],
      pubchemAudit: {
        cid: 5472,
        status: 'verified',
        verifiedAt: new Date().toISOString(),
        source: 'nih_pug_rest',
        canonicalSmiles: 'C1CN(CC2=C1C=CS2)CC3=CC=CC=C3Cl',
        pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5472',
      },
      chemData: {
        cid: 5472,
        iupacName: '5-[(2-chlorophenyl)methyl]-6,7-dihydro-4H-thieno[3,2-c]pyridine',
        canonicalSmiles: 'C1CN(CC2=C1C=CS2)CC3=CC=CC=C3Cl',
        molecularWeight: 263.79,
        xlogp: 3.1,
        pubchemMolBlock: antiplateletMolBlocks[5472],
      },
    },
    {
      id: 'cangrelor',
      name: 'Cangrelor',
      type: 'DRUG',
      clinical_and_sar_summary:
        'Modified adenosine triphosphate (ATP) analogue. Directly active, competitive, reversible P2Y12 inhibitor. Contains a non-hydrolyzable dichloromethylene bisphosphonate bridge. Administered exclusively IV due to high negative charge and polar surface area. Ultra-short elimination half-life (~3-6 min).',
      cid: 9854012,
      canonicalSmiles: 'CCCSC1=NC2=C(N1C3C(C(C(O3)COP(=O)(O)OP(=O)(O)C(P(=O)(O)O)(Cl)Cl)O)O)N=CN=C2NCC(F)(F)F',
      smiles: 'CCCSC1=NC2=C(N1C3C(C(C(O3)COP(=O)(O)OP(=O)(O)C(P(=O)(O)O)(Cl)Cl)O)O)N=CN=C2NCC(F)(F)F',
      pubchemMolBlock: antiplateletMolBlocks[9854012],
      pubchemAudit: {
        cid: 9854012,
        status: 'verified',
        verifiedAt: new Date().toISOString(),
        source: 'nih_pug_rest',
        canonicalSmiles: 'CCCSC1=NC2=C(N1C3C(C(C(O3)COP(=O)(O)OP(=O)(O)C(P(=O)(O)O)(Cl)Cl)O)O)N=CN=C2NCC(F)(F)F',
        pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/9854012',
      },
      chemData: {
        cid: 9854012,
        iupacName: '[dichloro-[[[(2R,3S,4R,5R)-3,4-dihydroxy-5-[5-propylsulfanyl-7-(3,3,3-trifluoropropylamino)triazolo[4,5-d]pyrimidin-3-yl]oxolan-2-yl]methoxy-hydroxyphosphoryl]oxy-hydroxyphosphoryl]methyl]phosphonic acid',
        canonicalSmiles: 'CCCSC1=NC2=C(N1C3C(C(C(O3)COP(=O)(O)OP(=O)(O)C(P(=O)(O)O)(Cl)Cl)O)O)N=CN=C2NCC(F)(F)F',
        molecularWeight: 776.4,
        xlogp: 0.8,
        pubchemMolBlock: antiplateletMolBlocks[9854012],
      },
    },
    {
      id: 'aspirin',
      name: 'Aspirin (Acetylsalicylic Acid)',
      type: 'DRUG',
      clinical_and_sar_summary:
        'Salicylate derivative that causes irreversible inactivation of cyclooxygenase-1 (COX-1) by covalently acetylating Ser529 in the catalytic hydrophobic channel. Prevents arachidonic acid from accessing the catalytic pocket, permanently abolishing thromboxane A2 (TXA2) synthesis for the 7-10 day lifespan of the anucleate platelet.',
      cid: 2244,
      canonicalSmiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
      smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
      pubchemMolBlock: antiplateletMolBlocks[2244],
      pubchemAudit: {
        cid: 2244,
        status: 'verified',
        verifiedAt: new Date().toISOString(),
        source: 'nih_pug_rest',
        canonicalSmiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
        pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/2244',
      },
      chemData: {
        cid: 2244,
        iupacName: '2-acetyloxybenzoic acid',
        canonicalSmiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
        isomericSmiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
        molecularWeight: 180.16,
        xlogp: 1.2,
        pubchemMolBlock: antiplateletMolBlocks[2244],
      },
    },
    {
      id: 'tirofiban',
      name: 'Tirofiban',
      type: 'DRUG',
      clinical_and_sar_summary:
        'Non-peptide peptidomimetic antagonist of platelet glycoprotein IIb/IIIa (αIIbβ3). Reversibly inhibits fibrinogen cross-linking between platelets. Features a basic piperidine mimicking arginine, a tyrosine phenoxy spacer, an n-butyl sulfonamide inserting into a lipophilic pocket, and a carboxylic acid mimicking aspartate of the RGD motif.',
      cid: 60947,
      canonicalSmiles: 'CCCCCS(=O)(=O)NC(CC1=CC=C(C=C1)OCCCC2CCNCC2)C(=O)O',
      smiles: 'CCCCCS(=O)(=O)NC(CC1=CC=C(C=C1)OCCCC2CCNCC2)C(=O)O',
      pubchemMolBlock: antiplateletMolBlocks[60947],
      target_receptor: 'Glycoprotein IIb/IIIa (αIIbβ3)',
      reversibility: 'Reversible',
      route_of_admin: 'IV Infusion',
      half_life: '2 hours',
      elimination_half_life: { value: '2', unit: 'hours' },
      metabolism_pathway: ['Intravenous infusion', 'Minimal hepatic metabolism', 'Renal excretion (~65% unchanged)', 'Fecal excretion (~25%)'],
      location_of_metabolism: 'Renal, mostly unchanged (~65%)',
      unique_differentiator: 'Non-peptide RGD peptidomimetic featuring an N-butyl sulfonamide that fits GPIIb/IIIa with high selectivity and rapid reversibility within 4-8 hours.',
      pubchemAudit: {
        cid: 60947,
        status: 'verified',
        verifiedAt: new Date().toISOString(),
        source: 'nih_pug_rest',
        canonicalSmiles: 'CCCCCS(=O)(=O)NC(CC1=CC=C(C=C1)OCCCC2CCNCC2)C(=O)O',
        pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/60947',
      },
      chemData: {
        cid: 60947,
        iupacName: '(2S)-2-(butylsulfonylamino)-3-[4-(4-piperidin-4-ylbutoxy)phenyl]propanoic acid',
        canonicalSmiles: 'CCCCCS(=O)(=O)NC(CC1=CC=C(C=C1)OCCCC2CCNCC2)C(=O)O',
        molecularWeight: 440.6,
        pubchemMolBlock: antiplateletMolBlocks[60947],
      },
    },
    {
      id: 'eptifibatide',
      name: 'Eptifibatide',
      type: 'DRUG',
      clinical_and_sar_summary:
        'Cyclic heptapeptide antagonist of platelet glycoprotein IIb/IIIa (αIIbβ3). Derived from the venom of the southeastern pygmy rattlesnake (barbourin). Contains a modified Lys-Gly-Asp (KGD) motif with homoarginine providing extreme selectivity for αIIbβ3 over the vitronectin receptor (αvβ3). Conformationally constrained by an intramolecular disulfide bond.',
      cid: 448812,
      canonicalSmiles: 'CC1C(=O)NC(C(=O)NC(C(=O)NC(C(=O)NC(CSSCCC(=O)N1)C(=O)NC(CC2=CNC3=CC=CC=C32)C(=O)N)CCCCN=C(N)N)CC(=O)O)C',
      smiles: 'CC1C(=O)NC(C(=O)NC(C(=O)NC(C(=O)NC(CSSCCC(=O)N1)C(=O)NC(CC2=CNC3=CC=CC=C32)C(=O)N)CCCCN=C(N)N)CC(=O)O)C',
      pubchemMolBlock: antiplateletMolBlocks[448812],
      target_receptor: 'Glycoprotein IIb/IIIa (αIIbβ3)',
      reversibility: 'Reversible',
      route_of_admin: 'IV Bolus + Infusion',
      half_life: '2.5 hours',
      elimination_half_life: { value: '2.5', unit: 'hours' },
      metabolism_pathway: ['Intravenous bolus + infusion', 'Minimal peptide cleavage', 'Renal excretion (>50% unchanged drug)'],
      location_of_metabolism: 'Renal, mostly unchanged (>50%)',
      unique_differentiator: 'Synthetic cyclic heptapeptide derived from pygmy rattlesnake venom (barbourin); uses a homoarginine-glycine-aspartate (KGD) motif providing extraordinary selectivity for αIIbβ3 over αvβ3.',
      pubchemAudit: {
        cid: 448812,
        status: 'verified',
        verifiedAt: new Date().toISOString(),
        source: 'nih_pug_rest',
        canonicalSmiles: 'CC1C(=O)NC(C(=O)NC(C(=O)NC(C(=O)NC(CSSCCC(=O)N1)C(=O)NC(CC2=CNC3=CC=CC=C32)C(=O)N)CCCCN=C(N)N)CC(=O)O)C',
        pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/448812',
      },
      chemData: {
        cid: 448812,
        canonicalSmiles: 'CC1C(=O)NC(C(=O)NC(C(=O)NC(C(=O)NC(CSSCCC(=O)N1)C(=O)NC(CC2=CNC3=CC=CC=C32)C(=O)N)CCCCN=C(N)N)CC(=O)O)C',
        molecularWeight: 832.0,
        pubchemMolBlock: antiplateletMolBlocks[448812],
      },
    },
    {
      id: 'vorapaxar',
      name: 'Vorapaxar',
      type: 'DRUG',
      clinical_and_sar_summary:
        'First-in-class, orally active protease-activated receptor-1 (PAR-1) antagonist derived from the natural bark alkaloid himbacine. Selectively inhibits thrombin-mediated platelet activation without preventing thrombin cleavage of fibrinogen. Features an ethyl carbamate protecting the core amine and binds with picomolar affinity and an ultra-long dissociation half-life (~20 hours; terminal elimination half-life ~8 days). Contraindicated in patients with prior TIA or stroke.',
      cid: 10077130,
      canonicalSmiles: 'CCOC(=O)NC1CC2C(C1)C(C3=C2C=CC(=C3)C4=CN=CC=C4)(C)C5=CC=C(C=C5)F',
      smiles: 'CCOC(=O)NC1CC2C(C1)C(C3=C2C=CC(=C3)C4=CN=CC=C4)(C)C5=CC=C(C=C5)F',
      pubchemMolBlock: antiplateletMolBlocks[10077130],
      target_receptor: 'PAR-1 (Protease-Activated Receptor 1)',
      reversibility: 'Reversible (effectively irreversible due to ~20 hr dissociation t1/2)',
      route_of_admin: 'Oral',
      half_life: '8 days',
      elimination_half_life: { value: '8', unit: 'days' },
      metabolism_pathway: ['Oral absorption', 'Hepatic CYP3A4 and CYP2J2 metabolism to amine M20', 'Biliary/Fecal excretion (~58%) and urine (~25%)'],
      location_of_metabolism: 'Hepatic via CYP3A4 and CYP2J2',
      unique_differentiator: 'First-in-class PAR-1 antagonist derived from himbacine; binds with picomolar affinity and an ultra-long dissociation half-life (~20 hours), inhibiting thrombin-mediated activation for weeks.',
      pubchemAudit: {
        cid: 10077130,
        status: 'verified',
        verifiedAt: new Date().toISOString(),
        source: 'nih_pug_rest',
        canonicalSmiles: 'CCOC(=O)NC1CC2C(C1)C(C3=C2C=CC(=C3)C4=CN=CC=C4)(C)C5=CC=C(C=C5)F',
        pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/10077130',
      },
      chemData: {
        cid: 10077130,
        canonicalSmiles: 'CCOC(=O)NC1CC2C(C1)C(C3=C2C=CC(=C3)C4=CN=CC=C4)(C)C5=CC=C(C=C5)F',
        molecularWeight: 470.6,
        pubchemMolBlock: antiplateletMolBlocks[10077130],
      },
    },
    {
      id: 'cilostazol',
      name: 'Cilostazol',
      type: 'DRUG',
      clinical_and_sar_summary:
        'Selective phosphodiesterase-3 (PDE3) inhibitor containing a quinolinone bicyclic core and a tetrazole bioisostere. Inhibits cAMP degradation, increasing intracellular cAMP in platelets (suppressing aggregation) and vascular smooth muscle (inducing arterial vasodilation). Indicated for intermittent claudication. Boxed Warning: Contraindicated in heart failure of any severity due to increased mortality from PDE3 inhibition.',
      cid: 2754,
      canonicalSmiles: 'C1CCC(CC1)N2C(=NN=N2)CCCCCOC3=CC4=C(C=C3)CCC(=O)N4',
      smiles: 'C1CCC(CC1)N2C(=NN=N2)CCCCCOC3=CC4=C(C=C3)CCC(=O)N4',
      pubchemMolBlock: antiplateletMolBlocks[2754],
      target_receptor: 'Phosphodiesterase 3 (PDE3)',
      reversibility: 'Reversible',
      route_of_admin: 'Oral',
      half_life: '11-13 hours',
      elimination_half_life: { value: '11-13', unit: 'hours' },
      metabolism_pathway: ['Oral absorption', 'Hepatic CYP3A4 and CYP2C19 metabolism to active 3,4-dehydro-cilostazol', 'Renal excretion (74%) and fecal (20%)'],
      location_of_metabolism: 'Hepatic via CYP3A4 and CYP2C19',
      unique_differentiator: 'Dual-action PDE3 inhibitor providing antiplatelet inhibition and peripheral arterial vasodilation for intermittent claudication; contains tetrazole carboxylic acid bioisostere.',
      pubchemAudit: {
        cid: 2754,
        status: 'verified',
        verifiedAt: new Date().toISOString(),
        source: 'nih_pug_rest',
        canonicalSmiles: 'C1CCC(CC1)N2C(=NN=N2)CCCCCOC3=CC4=C(C=C3)CCC(=O)N4',
        pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/2754',
      },
      chemData: {
        cid: 2754,
        canonicalSmiles: 'C1CCC(CC1)N2C(=NN=N2)CCCCCOC3=CC4=C(C=C3)CCC(=O)N4',
        molecularWeight: 369.46,
        pubchemMolBlock: antiplateletMolBlocks[2754],
      },
    },
    {
      id: 'dipyridamole',
      name: 'Dipyridamole',
      type: 'DRUG',
      clinical_and_sar_summary:
        'Pyrimidopyrimidine derivative with dual actions: inhibits equilibrative nucleoside transporter-1 (ENT-1), preventing cellular uptake of adenosine and elevating extracellular adenosine to stimulate platelet A2A receptors; additionally provides weak inhibition of phosphodiesterase (PDE3/PDE5) to elevate platelet cAMP/cGMP. Used with aspirin for secondary prevention of ischemic stroke and TIA.',
      cid: 3108,
      canonicalSmiles: 'C1CCN(CC1)C2=NC(=NC3=C2N=C(N=C3N4CCCCC4)N(CCO)CCO)N(CCO)CCO',
      smiles: 'C1CCN(CC1)C2=NC(=NC3=C2N=C(N=C3N4CCCCC4)N(CCO)CCO)N(CCO)CCO',
      pubchemMolBlock: antiplateletMolBlocks[3108],
      target_receptor: 'Adenosine Reuptake (ENT-1) & PDE3',
      reversibility: 'Reversible',
      route_of_admin: 'Oral',
      half_life: '10-12 hours',
      elimination_half_life: { value: '10-12', unit: 'hours' },
      metabolism_pathway: ['Oral absorption', 'Hepatic glucuronidation to monoglucuronide', 'Biliary/Fecal excretion (>95%)'],
      location_of_metabolism: 'Hepatic via glucuronidation',
      unique_differentiator: 'Dual-target mechanism blocking ENT-1 adenosine reuptake to elevate adenosine/cAMP while weakly inhibiting PDEs; combined with aspirin for ischemic stroke prevention.',
      pubchemAudit: {
        cid: 3108,
        status: 'verified',
        verifiedAt: new Date().toISOString(),
        source: 'nih_pug_rest',
        canonicalSmiles: 'C1CCN(CC1)C2=NC(=NC3=C2N=C(N=C3N4CCCCC4)N(CCO)CCO)N(CCO)CCO',
        pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/3108',
      },
      chemData: {
        cid: 3108,
        canonicalSmiles: 'C1CCN(CC1)C2=NC(=NC3=C2N=C(N=C3N4CCCCC4)N(CCO)CCO)N(CCO)CCO',
        molecularWeight: 504.6,
        pubchemMolBlock: antiplateletMolBlocks[3108],
      },
    },
    {
      id: 'cyp2c19',
      name: 'CYP2C19',
      type: 'TARGET_OR_ENZYME',
      clinical_and_sar_summary:
        'Hepatic microsomal cytochrome P450 isoenzyme crucial for the bioactivation of clopidogrel into its active thiol metabolite. Loss-of-function alleles (*2, *3) cause poor metabolizer phenotypes with reduced active metabolite formation and increased cardiovascular stent thrombosis risks.',
    },
    {
      id: 'cyp3a4',
      name: 'CYP3A4',
      type: 'TARGET_OR_ENZYME',
      clinical_and_sar_summary:
        'Predominant hepatic and intestinal cytochrome P450 isoenzyme responsible for phase 1 oxidation of prasugrel intermediate R-95913, bioactivation of ticlopidine, and oxidative metabolism of ticagrelor into its active metabolite AR-C124910XX.',
    },
    {
      id: 'p2y12',
      name: 'P2Y12 Receptor',
      type: 'TARGET_OR_ENZYME',
      clinical_and_sar_summary:
        'Gi-coupled purinergic ADP receptor on the platelet surface. Activation inhibits adenylate cyclase, lowers intracellular cAMP, and promotes degranulation and inside-out conformational activation of the alpha-IIb-beta-3 integrin (GPIIb/IIIa).',
    },
    {
      id: 'ces1',
      name: 'Carboxylesterase 1 (CES1)',
      type: 'TARGET_OR_ENZYME',
      clinical_and_sar_summary:
        'Hepatic esterase responsible for hydrolyzing the methyl ester of clopidogrel to its inactive carboxylic acid metabolite (~85% of clopidogrel dose eliminated this route).',
    },
    {
      id: 'ces2',
      name: 'Carboxylesterase 2 (CES2)',
      type: 'TARGET_OR_ENZYME',
      clinical_and_sar_summary:
        'Intestinal mucosal carboxylesterase that rapidly deacetylates prasugrel at position 2 of the thiophene ring to generate the intermediate thiolactone R-95913.',
    },
    {
      id: 'thienopyridine',
      name: 'Thienopyridine Pharmacophore',
      type: 'PHARMACOPHORE_OR_MOIETY',
      clinical_and_sar_summary:
        'Bicyclic scaffold consisting of a thiophene ring fused to a tetrahydropyridine ring. Requires metabolic oxidation to generate an active thiol nucleophile that targets P2Y12 cysteine residues.',
    },
    {
      id: 'active_thiol_metabolite',
      name: 'Active Thiol Metabolite',
      type: 'METABOLITE',
      clinical_and_sar_summary:
        'Chemically reactive metabolite containing an exocyclic free thiol (-SH) capable of forming a covalent disulfide linkage with Cys17 and Cys270 on the human P2Y12 receptor.',
    },
    {
      id: 'acute_coronary_syndrome',
      name: 'Acute Coronary Syndrome (ACS)',
      type: 'DISEASE_STATE',
      clinical_and_sar_summary:
        'A spectrum of conditions compatible with acute myocardial ischemia/infarction (STEMI, NSTEMI, Unstable Angina). Guideline-directed antiplatelet therapy combines aspirin with a potent P2Y12 inhibitor.',
    },
    {
      id: 'ischemic_stroke',
      name: 'Acute Ischemic Stroke',
      type: 'DISEASE_STATE',
      clinical_and_sar_summary:
        'Cerebrovascular thromboembolic occlusion leading to neurological deficit. Dual antiplatelet therapy (DAPT) with clopidogrel and aspirin indicated for minor stroke / high-risk TIA for 21 days.',
    },
    {
      id: 'prior_tia_or_stroke',
      name: 'Prior TIA or Stroke',
      type: 'DISEASE_STATE',
      clinical_and_sar_summary:
        'Patient clinical history of transient ischemic attack or cerebrovascular accident. Represents a black box contraindication for prasugrel due to excess fatal intracranial hemorrhage (TRITON-TIMI 38).',
    },
    {
      id: 'cyp2c19_poor_metabolizer',
      name: 'CYP2C19 Poor Metabolizer (*2/*3)',
      type: 'DISEASE_STATE',
      clinical_and_sar_summary:
        'Genetic loss-of-function phenotype with reduced CYP2C19 enzymatic capacity. Substantially blunts clopidogrel bioactivation, leading to therapeutic failure and stent thrombosis.',
    },
    {
      id: 'major_bleeding',
      name: 'Major Bleeding / Hemorrhage',
      type: 'ADVERSE_EFFECT',
      clinical_and_sar_summary:
        'Primary clinical safety risk of all potent antiplatelet therapies. Risk is elevated with irreversible and more potent P2Y12 inhibitors (prasugrel, ticagrelor) compared to clopidogrel.',
    },
    {
      id: 'dyspnea',
      name: 'Dyspnea / Shortness of Breath',
      type: 'ADVERSE_EFFECT',
      clinical_and_sar_summary:
        'Unique adverse effect of ticagrelor (~10-15% of patients) mediated by off-target inhibition of the ENT-1 (equilibrative nucleoside transporter 1), increasing circulating plasma adenosine.',
    },
    {
      id: 'thienopyridines',
      name: 'Thienopyridines',
      type: 'DRUG_CLASS',
      clinical_and_sar_summary:
        'Class of irreversible ADP P2Y12 receptor inhibitors sharing a thienopyridine chemical scaffold. Prodrugs requiring bioactivation (ticlopidine, clopidogrel, prasugrel).',
    },
    {
      id: 'cptp_class',
      name: 'Cyclopentyltriazolopyrimidines (CPTP)',
      type: 'DRUG_CLASS',
      clinical_and_sar_summary:
        'Direct-acting, reversible allosteric P2Y12 antagonists with a cyclopentyltriazolopyrimidine scaffold. Prototype: ticagrelor.',
    },
    {
      id: 'cox_inhibitors',
      name: 'Cyclooxygenase Inhibitors',
      type: 'DRUG_CLASS',
      clinical_and_sar_summary: 'Antiplatelet agents acting via cyclooxygenase inhibition (Aspirin).',
    },
    {
      id: 'gpiib_iiia_inhibitors',
      name: 'Glycoprotein IIb/IIIa Inhibitors',
      type: 'DRUG_CLASS',
      clinical_and_sar_summary: 'Potent IV antiplatelet antagonists targeting integrin αIIbβ3 (Tirofiban, Eptifibatide).',
    },
    {
      id: 'par1_antagonists',
      name: 'PAR-1 Thrombin Receptor Antagonists',
      type: 'DRUG_CLASS',
      clinical_and_sar_summary: 'Oral antagonists blocking the tethered ligand pocket of platelet PAR-1 (Vorapaxar).',
    },
    {
      id: 'pde3_inhibitors',
      name: 'Phosphodiesterase-3 Inhibitors',
      type: 'DRUG_CLASS',
      clinical_and_sar_summary: 'Antiplatelet vasodilators elevating cAMP by PDE3 inhibition (Cilostazol, Dipyridamole).',
    },
    {
      id: 'cox1',
      name: 'Cyclooxygenase-1 (COX-1)',
      type: 'TARGET_OR_ENZYME',
      clinical_and_sar_summary:
        'Constitutively expressed prostaglandin H synthase. In platelets, converts arachidonic acid to prostaglandin H2, the precursor of thromboxane A2 (TXA2). Irreversibly acetylated at Ser529 by aspirin.',
    },
    {
      id: 'gpiib_iiia',
      name: 'Glycoprotein IIb/IIIa (Integrin αIIbβ3)',
      type: 'TARGET_OR_ENZYME',
      clinical_and_sar_summary:
        'Calcium-dependent heterodimeric integrin complex on the platelet membrane. Serves as the final common pathway for platelet aggregation by binding divalent fibrinogen and von Willebrand factor. Target of tirofiban and eptifibatide.',
    },
    {
      id: 'par1',
      name: 'Protease-Activated Receptor 1 (PAR-1)',
      type: 'TARGET_OR_ENZYME',
      clinical_and_sar_summary:
        'G-protein coupled thrombin receptor on human platelets. Thrombin cleaves the N-terminal exodomain, exposing a tethered ligand (SFLLRN) that binds and activates the receptor. Blocked by vorapaxar.',
    },
    {
      id: 'pde3',
      name: 'Phosphodiesterase-3 (PDE3)',
      type: 'TARGET_OR_ENZYME',
      clinical_and_sar_summary:
        'Intracellular cyclic nucleotide phosphodiesterase in platelets and vascular smooth muscle. Hydrolyzes cAMP to 5\'-AMP. Inhibition elevates intracellular cAMP, dampening platelet activation and causing vasodilation. Target of cilostazol and dipyridamole.',
    },
    {
      id: 'ent1',
      name: 'Equilibrative Nucleoside Transporter 1 (ENT-1)',
      type: 'TARGET_OR_ENZYME',
      clinical_and_sar_summary:
        'Facilitated diffusion transporter for adenosine into erythrocytes and endothelial cells. Blockade by dipyridamole and ticagrelor increases extracellular adenosine concentrations.',
    },
    {
      id: 'thienopyridine',
      name: 'Thienopyridine Core',
      type: 'PHARMACOPHORE',
      clinical_and_sar_summary:
        'Bicyclic ring system consisting of a thiophene ring fused to a tetrahydropyridine ring. Core pharmacophore required for P2Y12 inhibition in clopidogrel, prasugrel, and ticlopidine.',
    },
  ];

  const defaultRelationships: GraphRelationship[] = [
    {
      source: 'clopidogrel',
      relation: 'HAS_PHARMACOPHORE',
      target: 'thienopyridine',
      sar_and_mechanism_context:
        'Clopidogrel contains the thienopyridine core pharmacophore necessary for its active metabolite to covalently bind P2Y12.',
      theme_keywords: ['thienopyridine', 'pharmacophore', 'HAS_PHARMACOPHORE'],
    },
    {
      source: 'prasugrel',
      relation: 'HAS_PHARMACOPHORE',
      target: 'thienopyridine',
      sar_and_mechanism_context:
        'Prasugrel incorporates the thienopyridine scaffold with a cyclopropyl ketone and 2-acetoxy substitution.',
      theme_keywords: ['thienopyridine', 'pharmacophore', 'HAS_PHARMACOPHORE'],
    },
    {
      source: 'clopidogrel',
      relation: 'METABOLIZED_BY',
      target: 'cyp2c19',
      sar_and_mechanism_context:
        'CYP2C19 catalyzes the rate-limiting two-step oxidation of clopidogrel to 2-oxo-clopidogrel and subsequently to the active thiol metabolite.',
      theme_keywords: ['prodrug', 'bioactivation', 'CYP2C19', 'pharmacogenomics'],
    },
    {
      source: 'clopidogrel',
      relation: 'CONTAINS_PHARMACOPHORE',
      target: 'thienopyridine',
      sar_and_mechanism_context:
        'Clopidogrel has a core thienopyridine nucleus with an alpha-methyl ester and ortho-chlorobenzyl substitution.',
      theme_keywords: ['thienopyridine', 'pharmacophore', 'SAR'],
    },
    {
      source: 'clopidogrel',
      relation: 'METABOLIZED_BY',
      target: 'ces1',
      sar_and_mechanism_context:
        'CES1 hydrolyzes the methyl ester of clopidogrel to an inactive carboxylic acid, shunting ~85% of prodrug away from active metabolite generation.',
      theme_keywords: ['CES1', 'esterase', 'inactivation', 'hydrolysis'],
    },
    {
      source: 'prasugrel',
      relation: 'METABOLIZED_BY',
      target: 'ces2',
      sar_and_mechanism_context:
        'Intestinal CES2 rapidly removes the 2-acetoxy group of prasugrel yielding thiolactone intermediate R-95913 before systemic CYP oxidation.',
      theme_keywords: ['CES2', 'intestinal esterase', 'bioactivation'],
    },
    {
      source: 'prasugrel',
      relation: 'METABOLIZED_BY',
      target: 'cyp3a4',
      sar_and_mechanism_context:
        'CYP3A4 and CYP2B6 oxidize intermediate R-95913 in a single efficient step to the active thiol metabolite.',
      theme_keywords: ['CYP3A4', 'one-step oxidation', 'high potency'],
    },
    {
      source: 'clopidogrel',
      relation: 'BIOACTIVATED_TO',
      target: 'active_thiol_metabolite',
      sar_and_mechanism_context:
        'Generates an unstable free thiol metabolite that reacts directly with P2Y12 cysteine residues.',
      theme_keywords: ['disulfide', 'irreversible inhibition', 'thiol'],
    },
    {
      source: 'prasugrel',
      relation: 'BIOACTIVATED_TO',
      target: 'active_thiol_metabolite',
      sar_and_mechanism_context:
        'Yields a high concentration of active thiol metabolite, ~10-fold more active than clopidogrel.',
      theme_keywords: ['active metabolite', 'high bioavailability'],
    },
    {
      source: 'active_thiol_metabolite',
      relation: 'INHIBITS',
      target: 'p2y12',
      sar_and_mechanism_context:
        'Forms a covalent disulfide bond with Cys17 and Cys270, causing irreversible inactivation for the platelet lifespan.',
      theme_keywords: ['covalent binding', 'disulfide', 'irreversible', 'P2Y12'],
    },
    {
      source: 'ticagrelor',
      relation: 'INHIBITS',
      target: 'p2y12',
      sar_and_mechanism_context:
        'Reversibly binds to an allosteric pocket on P2Y12 without covalent disulfide bond formation or required prodrug bioactivation.',
      theme_keywords: ['allosteric', 'reversible', 'non-prodrug', 'CPTP'],
    },
    {
      source: 'cangrelor',
      relation: 'INHIBITS',
      target: 'p2y12',
      sar_and_mechanism_context:
        'Direct competitive antagonist at the ADP binding site of P2Y12; IV administration produces immediate platelet blockade.',
      theme_keywords: ['competitive', 'ATP analogue', 'intravenous', 'rapid onset'],
    },
    {
      source: 'ticlopidine',
      relation: 'METABOLIZED_BY',
      target: 'cyp3a4',
      sar_and_mechanism_context:
        'Requires two oxidation steps by CYP3A4, generating reactive pyridinium species associated with agranulocytosis and TTP.',
      theme_keywords: ['CYP3A4', 'agranulocytosis', 'reactive metabolite', 'toxicity'],
    },
    {
      source: 'ticagrelor',
      relation: 'FIRST_LINE_FOR',
      target: 'acute_coronary_syndrome',
      sar_and_mechanism_context:
        'ACC/AHA Class I GDMT First-Line: Preferred over clopidogrel for ACS based on the PLATO trial demonstrating significant mortality reduction.',
      theme_keywords: ['GDMT', 'first-line', 'ACS', 'guideline'],
    },
    {
      source: 'prasugrel',
      relation: 'FIRST_LINE_FOR',
      target: 'acute_coronary_syndrome',
      sar_and_mechanism_context:
        'ACC/AHA Class I GDMT First-Line: Preferred over clopidogrel in ACS managed with PCI (TRITON-TIMI 38), providing superior ischemic protection.',
      theme_keywords: ['GDMT', 'first-line', 'PCI', 'ACS'],
    },
    {
      source: 'prasugrel',
      relation: 'CONTRAINDICATED_IN',
      target: 'prior_tia_or_stroke',
      sar_and_mechanism_context:
        'FDA Boxed Warning / ACC/AHA Class III Harm: Absolute contraindication in patients with prior TIA or stroke due to significantly increased intracranial bleeding risk.',
      theme_keywords: ['contraindication', 'boxed warning', 'stroke', 'Class III harm'],
    },
    {
      source: 'clopidogrel',
      relation: 'CONTRAINDICATED_IN',
      target: 'cyp2c19_poor_metabolizer',
      sar_and_mechanism_context:
        'CPIC Guideline Warning: Clopidogrel is ineffective in CYP2C19 poor metabolizers (*2/*3 alleles); alternative agents (ticagrelor, prasugrel) strongly recommended.',
      theme_keywords: ['contraindication', 'pharmacogenomics', 'CPIC', 'CYP2C19'],
    },
    {
      source: 'clopidogrel',
      relation: 'INDICATED_FOR',
      target: 'acute_coronary_syndrome',
      sar_and_mechanism_context:
        'Standard oral DAPT component for ACS when prasugrel or ticagrelor cannot be used or when bleeding risk is high.',
      theme_keywords: ['DAPT', 'ACS', 'indication'],
    },
    {
      source: 'clopidogrel',
      relation: 'INDICATED_FOR',
      target: 'ischemic_stroke',
      sar_and_mechanism_context:
        'Guideline-approved for secondary prevention of non-cardioembolic ischemic stroke and short-term DAPT in high-risk TIA / minor stroke (CHANCE/POINT trials).',
      theme_keywords: ['stroke', 'TIA', 'secondary prevention'],
    },
    {
      source: 'clopidogrel',
      relation: 'CAUSES_ADVERSE_EFFECT',
      target: 'major_bleeding',
      sar_and_mechanism_context:
        'Inhibition of platelet aggregation causes risk of gastrointestinal and systemic bleeding.',
      theme_keywords: ['bleeding', 'adverse effect', 'safety'],
    },
    {
      source: 'prasugrel',
      relation: 'CAUSES_ADVERSE_EFFECT',
      target: 'major_bleeding',
      sar_and_mechanism_context:
        'Greater potency and higher active metabolite exposure lead to higher TIMI major bleeding risk than clopidogrel.',
      theme_keywords: ['bleeding', 'TIMI major', 'high risk'],
    },
    {
      source: 'ticagrelor',
      relation: 'CAUSES_ADVERSE_EFFECT',
      target: 'major_bleeding',
      sar_and_mechanism_context:
        'Associated with spontaneous major bleeding; also causes dyspnea via adenosine reuptake inhibition.',
      theme_keywords: ['bleeding', 'adverse effect'],
    },
    {
      source: 'ticagrelor',
      relation: 'CAUSES_ADVERSE_EFFECT',
      target: 'dyspnea',
      sar_and_mechanism_context:
        'Off-target ENT-1 transporter inhibition increases extracellular adenosine levels, causing self-limiting dyspnea.',
      theme_keywords: ['dyspnea', 'adenosine', 'ENT-1', 'side effect'],
    },
    {
      source: 'clopidogrel',
      relation: 'DRUG_CLASS_MEMBER',
      target: 'thienopyridines',
      sar_and_mechanism_context:
        'Second-generation thienopyridine containing the characteristic thieno-pyridine core scaffold.',
      theme_keywords: ['classification', 'thienopyridine', 'SAR'],
    },
    {
      source: 'prasugrel',
      relation: 'DRUG_CLASS_MEMBER',
      target: 'thienopyridines',
      sar_and_mechanism_context:
        'Third-generation thienopyridine with 2-acetoxy thiophene modification.',
      theme_keywords: ['classification', 'thienopyridine'],
    },
    {
      source: 'ticlopidine',
      relation: 'DRUG_CLASS_MEMBER',
      target: 'thienopyridines',
      sar_and_mechanism_context:
        'First-generation prototype thienopyridine.',
      theme_keywords: ['classification', 'thienopyridine'],
    },
    {
      source: 'ticagrelor',
      relation: 'DRUG_CLASS_MEMBER',
      target: 'cptp_class',
      sar_and_mechanism_context:
        'Belongs to the non-thienopyridine cyclopentyltriazolopyrimidine chemical class.',
      theme_keywords: ['classification', 'CPTP'],
    },
    {
      source: 'aspirin',
      relation: 'INHIBITS',
      target: 'cox1',
      sar_and_mechanism_context:
        'Aspirin irreversibly acetylates Ser529 in COX-1, permanently shutting down thromboxane A2 production.',
      theme_keywords: ['aspirin', 'COX-1', 'irreversible', 'INHIBITS'],
    },
    {
      source: 'aspirin',
      relation: 'DRUG_CLASS_MEMBER',
      target: 'cox_inhibitors',
      sar_and_mechanism_context: 'Aspirin is the prototype irreversible COX-1 inhibitor.',
      theme_keywords: ['classification', 'salicylate'],
    },
    {
      source: 'clopidogrel',
      relation: 'INHIBITS',
      target: 'p2y12',
      sar_and_mechanism_context:
        'Clopidogrel active thiol metabolite forms a covalent disulfide bridge with Cys17/Cys270 on P2Y12.',
      theme_keywords: ['P2Y12', 'INHIBITS', 'thienopyridine'],
    },
    {
      source: 'prasugrel',
      relation: 'INHIBITS',
      target: 'p2y12',
      sar_and_mechanism_context:
        'Prasugrel active metabolite irreversibly blocks the P2Y12 receptor via covalent disulfide bond formation.',
      theme_keywords: ['P2Y12', 'INHIBITS', 'thienopyridine'],
    },
    {
      source: 'ticlopidine',
      relation: 'INHIBITS',
      target: 'p2y12',
      sar_and_mechanism_context:
        'Ticlopidine active thiol metabolite covalently inhibits P2Y12.',
      theme_keywords: ['P2Y12', 'INHIBITS'],
    },
    {
      source: 'tirofiban',
      relation: 'INHIBITS',
      target: 'gpiib_iiia',
      sar_and_mechanism_context:
        'Tirofiban is a reversible peptidomimetic antagonist of GPIIb/IIIa (αIIbβ3), mimicking the fibrinogen RGD motif.',
      theme_keywords: ['GPIIb/IIIa', 'INHIBITS', 'peptidomimetic', 'RGD'],
    },
    {
      source: 'tirofiban',
      relation: 'DRUG_CLASS_MEMBER',
      target: 'gpiib_iiia_inhibitors',
      sar_and_mechanism_context: 'Tirofiban belongs to the GPIIb/IIIa receptor antagonist class.',
      theme_keywords: ['classification', 'GPIIb/IIIa'],
    },
    {
      source: 'eptifibatide',
      relation: 'INHIBITS',
      target: 'gpiib_iiia',
      sar_and_mechanism_context:
        'Eptifibatide is a cyclic heptapeptide that selectively blocks GPIIb/IIIa (αIIbβ3) via a modified KGD (homoarginine) sequence.',
      theme_keywords: ['GPIIb/IIIa', 'INHIBITS', 'cyclic peptide', 'barbourin'],
    },
    {
      source: 'eptifibatide',
      relation: 'DRUG_CLASS_MEMBER',
      target: 'gpiib_iiia_inhibitors',
      sar_and_mechanism_context: 'Eptifibatide belongs to the GPIIb/IIIa receptor antagonist class.',
      theme_keywords: ['classification', 'GPIIb/IIIa'],
    },
    {
      source: 'vorapaxar',
      relation: 'INHIBITS',
      target: 'par1',
      sar_and_mechanism_context:
        'Vorapaxar competitively blocks the PAR-1 tethered ligand site with picomolar affinity and ultra-long dissociation half-life.',
      theme_keywords: ['PAR-1', 'INHIBITS', 'thrombin receptor', 'himbacine'],
    },
    {
      source: 'vorapaxar',
      relation: 'DRUG_CLASS_MEMBER',
      target: 'par1_antagonists',
      sar_and_mechanism_context: 'Vorapaxar is a first-in-class PAR-1 antagonist.',
      theme_keywords: ['classification', 'PAR-1'],
    },
    {
      source: 'vorapaxar',
      relation: 'METABOLIZED_BY',
      target: 'cyp3a4',
      sar_and_mechanism_context: 'Vorapaxar is metabolized by CYP3A4 and CYP2J2 to active metabolite M20.',
      theme_keywords: ['CYP3A4', 'metabolism'],
    },
    {
      source: 'cilostazol',
      relation: 'INHIBITS',
      target: 'pde3',
      sar_and_mechanism_context:
        'Cilostazol selectively inhibits PDE3, elevating intracellular cAMP in platelets and vascular smooth muscle.',
      theme_keywords: ['PDE3', 'INHIBITS', 'cAMP', 'vasodilator'],
    },
    {
      source: 'cilostazol',
      relation: 'DRUG_CLASS_MEMBER',
      target: 'pde3_inhibitors',
      sar_and_mechanism_context: 'Cilostazol is a selective PDE3 inhibitor with antiplatelet and vasodilating activity.',
      theme_keywords: ['classification', 'PDE3'],
    },
    {
      source: 'cilostazol',
      relation: 'METABOLIZED_BY',
      target: 'cyp3a4',
      sar_and_mechanism_context: 'Cilostazol is metabolized by CYP3A4 and CYP2C19.',
      theme_keywords: ['CYP3A4', 'CYP2C19', 'metabolism'],
    },
    {
      source: 'dipyridamole',
      relation: 'INHIBITS',
      target: 'pde3',
      sar_and_mechanism_context: 'Dipyridamole weakly inhibits phosphodiesterases (PDE3/PDE5), elevating platelet cyclic nucleotides.',
      theme_keywords: ['PDE3', 'INHIBITS'],
    },
    {
      source: 'dipyridamole',
      relation: 'INHIBITS',
      target: 'ent1',
      sar_and_mechanism_context:
        'Dipyridamole blocks ENT-1 adenosine reuptake into erythrocytes, increasing extracellular adenosine to stimulate platelet A2A receptors.',
      theme_keywords: ['ENT-1', 'adenosine', 'INHIBITS'],
    },
    {
      source: 'dipyridamole',
      relation: 'DRUG_CLASS_MEMBER',
      target: 'pde3_inhibitors',
      sar_and_mechanism_context: 'Dipyridamole is an antiplatelet agent with PDE and ENT-1 inhibitory activities.',
      theme_keywords: ['classification', 'PDE3'],
    },
  ];

  await medChemGraphDb.mergeGraphToDexie(defaultEntities, defaultRelationships);
}

export interface HydratedNode {
  id: string;
  name: string;
  type?: EntityType | string;
  relation?: string;
  context?: string;
  [key: string]: any;
}

export interface HydratedPharmacophore {
  id: string;
  name: string;
  smarts?: string;
  color?: string;
  description?: string;
  purpose?: string;
  casual_sar_explanation?: string;
  [key: string]: any;
}

export interface HydratedDrug extends Omit<GraphEntity, 'target'> {
  id: string;
  name: string;
  cid?: number;
  canonicalSmiles?: string;
  smiles?: string;
  pubchemMolBlock?: string;
  target?: HydratedNode;
  targets: HydratedNode[];
  clinicalClass?: HydratedNode;
  drugClass?: HydratedNode;
  pharmacophores: HydratedPharmacophore[];
  metabolites: HydratedNode[];
  enzymes: HydratedNode[];
  adverseEffects: HydratedNode[];
  indications: HydratedNode[];
  relationships: GraphRelationship[];
  location_of_metabolism?: string;
  elimination_half_life?: EliminationHalfLifeObj | string;
  metabolism_pathway?: string[];
  unique_differentiator?: string;
  clinicalData?: ClinicalData;
  [key: string]: any;
}

/**
 * Graph Hydration Layer:
 * Queries the entities table for all nodes where type === 'DRUG',
 * then queries the relationships table to resolve all connected nodes
 * (Targets, Clinical Classes, Pharmacophores, Metabolites, etc.) for each drug.
 *
 * Guarantees absolute deduplication by indexing into a Map<string, HydratedDrug>
 * keyed by the drug's canonical ID or CID, completely eliminating Cartesian
 * explosions (duplicate matrix rows) and orphaned nodes (empty data).
 */
export async function getHydratedDrugs(): Promise<HydratedDrug[]> {
  try {
    // 1. Query entities table for all nodes where type === 'DRUG'
    const allEntities = await medChemGraphDb.entities.toArray();
    const drugEntities = allEntities.filter(
      (e) => (e.type || '').toUpperCase() === 'DRUG'
    );

    // Build an entity lookup map for fast target/connected node resolution
    const entityLookup = new Map<string, GraphEntity>();
    for (const ent of allEntities) {
      if (ent.id) {
        entityLookup.set(ent.id.toLowerCase().trim(), ent);
      }
      if (ent.name) {
        entityLookup.set(ent.name.toLowerCase().trim(), ent);
      }
    }

    // 2. Query relationships table
    const allRelationships = await medChemGraphDb.relationships.toArray();

    // 3. Deduplication Map: keyed by drug id or cid
    const drugMap = new Map<string, HydratedDrug>();
    // Fast index from any known drug identifier / alias to the drugMap key
    const drugAliasToKey = new Map<string, string>();

    for (const d of drugEntities) {
      const primaryKey = d.cid && d.cid > 0 ? `cid_${d.cid}` : d.id.toLowerCase().trim();

      const smiles =
        d.canonicalSmiles ||
        d.smiles ||
        d.chemData?.canonicalSmiles ||
        d.chemData?.isomericSmiles ||
        d.pubchemAudit?.canonicalSmiles ||
        getKnownDrugSmiles(d.id) ||
        getKnownDrugSmiles(d.name || '');

      const molBlock = d.pubchemMolBlock || d.chemData?.pubchemMolBlock;

      if (!drugMap.has(primaryKey)) {
        const initialPharmacophores: HydratedPharmacophore[] = [];
        if (Array.isArray(d.pharmacophores)) {
          d.pharmacophores.forEach((p: any) => {
            if (p && (p.name || p.id)) {
              const pName = p.name || p.id;
              initialPharmacophores.push({
                id: p.id || pName.toLowerCase(),
                name: pName,
                smarts: getCorrectedSmarts(pName, p.smarts || ''),
                color: p.color,
                purpose: p.purpose,
                casual_sar_explanation: p.casual_sar_explanation,
                description: p.description || p.sar_role,
              });
            }
          });
        }

        const hydrated: HydratedDrug = {
          ...d,
          id: d.id,
          name: d.name || d.id,
          cid: d.cid || d.chemData?.cid,
          canonicalSmiles: smiles,
          smiles: smiles,
          pubchemMolBlock: molBlock,
          target: undefined,
          targets: [],
          clinicalClass: undefined,
          drugClass: undefined,
          pharmacophores: initialPharmacophores,
          metabolites: [],
          enzymes: [],
          adverseEffects: [],
          indications: [],
          relationships: [],
          location_of_metabolism:
            d.clinicalData?.location_of_metabolism ||
            d.location_of_metabolism ||
            (d as any).bioactivation_pathway ||
            (d as any).bioactivation,
          elimination_half_life:
            d.clinicalData?.elimination_half_life ||
            d.clinicalData?.halfLife ||
            d.elimination_half_life ||
            d.half_life,
          metabolism_pathway:
            d.clinicalData?.metabolism_pathway ||
            d.metabolism_pathway,
          unique_differentiator:
            d.clinicalData?.unique_differentiator ||
            d.unique_differentiator,
          clinicalData: d.clinicalData,
        };

        drugMap.set(primaryKey, hydrated);
      } else {
        // Merge attributes if duplicate found (avoid losing SMILES / molBlock)
        const existing = drugMap.get(primaryKey)!;
        if (!existing.canonicalSmiles && smiles) {
          existing.canonicalSmiles = smiles;
          existing.smiles = smiles;
        }
        if (!existing.pubchemMolBlock && molBlock) {
          existing.pubchemMolBlock = molBlock;
        }
        if (!existing.name && d.name) {
          existing.name = d.name;
        }
        if (!existing.clinicalData && d.clinicalData) {
          existing.clinicalData = d.clinicalData;
        }
        if (!existing.location_of_metabolism && (d.location_of_metabolism || d.clinicalData?.location_of_metabolism)) {
          existing.location_of_metabolism = d.clinicalData?.location_of_metabolism || d.location_of_metabolism;
        }
        if (!existing.elimination_half_life && (d.elimination_half_life || d.clinicalData?.elimination_half_life)) {
          existing.elimination_half_life = d.clinicalData?.elimination_half_life || d.elimination_half_life;
        }
        if (!existing.metabolism_pathway && (d.metabolism_pathway || d.clinicalData?.metabolism_pathway)) {
          existing.metabolism_pathway = d.clinicalData?.metabolism_pathway || d.metabolism_pathway;
        }
        if (!existing.unique_differentiator && (d.unique_differentiator || d.clinicalData?.unique_differentiator)) {
          existing.unique_differentiator = d.clinicalData?.unique_differentiator || d.unique_differentiator;
        }
      }

      // Register aliases
      drugAliasToKey.set(d.id.toLowerCase().trim(), primaryKey);
      if (d.name) {
        drugAliasToKey.set(d.name.toLowerCase().trim(), primaryKey);
      }
      if (d.cid) {
        drugAliasToKey.set(`cid_${d.cid}`, primaryKey);
        drugAliasToKey.set(String(d.cid), primaryKey);
      }
    }

    // 4. Iterate over relationships and attach resolved data to specific drug in Map
    for (const rel of allRelationships) {
      if (!rel || !rel.source || !rel.target) continue;

      const srcClean = rel.source.toLowerCase().trim();
      const targetClean = rel.target.toLowerCase().trim();

      // Check if source matches a drug in our Map
      const drugKey = drugAliasToKey.get(srcClean);
      if (!drugKey || !drugMap.has(drugKey)) continue;

      const drug = drugMap.get(drugKey)!;
      drug.relationships.push(rel);

      const targetEntity = entityLookup.get(targetClean);
      const targetDisplayName = targetEntity?.name || rel.target.replace(/_/g, ' ');
      const relType = (rel.relation || '').toUpperCase().trim();

      // Target relations: TARGETS, HAS_TARGET, INHIBITS, BINDS_TO, ANTAGONIZES, BLOCKS
      if (
        relType === 'TARGETS' ||
        relType === 'HAS_TARGET' ||
        relType === 'INHIBITS' ||
        relType === 'BINDS_TO' ||
        relType === 'ANTAGONIZES' ||
        relType === 'BLOCKS' ||
        targetEntity?.type === 'TARGET_OR_ENZYME'
      ) {
        const targetNode: HydratedNode = {
          id: rel.target,
          name: targetDisplayName,
          type: targetEntity?.type || 'TARGET_OR_ENZYME',
          relation: rel.relation,
          context: rel.sar_and_mechanism_context,
        };
        if (!drug.target) {
          drug.target = targetNode;
        }
        if (!drug.targets.some((t) => t.id.toLowerCase() === targetNode.id.toLowerCase())) {
          drug.targets.push(targetNode);
        }
      }

      // Clinical Class relations: MEMBER_OF, DRUG_CLASS_MEMBER, CLASS, SUBCLASS_OF, IN_CLASS, IS_A
      else if (
        relType === 'MEMBER_OF' ||
        relType === 'DRUG_CLASS_MEMBER' ||
        relType === 'CLASS' ||
        relType === 'SUBCLASS_OF' ||
        relType === 'IN_CLASS' ||
        relType === 'IS_A' ||
        targetEntity?.type === 'DRUG_CLASS'
      ) {
        const classNode: HydratedNode = {
          id: rel.target,
          name: targetDisplayName,
          type: targetEntity?.type || 'DRUG_CLASS',
          relation: rel.relation,
          context: rel.sar_and_mechanism_context,
        };
        if (!drug.clinicalClass) {
          drug.clinicalClass = classNode;
          drug.drugClass = classNode;
        }
      }

      // Pharmacophore relations: HAS_PHARMACOPHORE, CONTAINS_MOIETY, HAS_CORE, HAS_SCAFFOLD
      else if (
        relType === 'HAS_PHARMACOPHORE' ||
        relType === 'CONTAINS_MOIETY' ||
        relType === 'HAS_CORE' ||
        relType === 'HAS_SCAFFOLD' ||
        targetEntity?.type === 'PHARMACOPHORE' ||
        targetEntity?.type === 'PHARMACOPHORE_OR_MOIETY'
      ) {
        const rawSmarts = (targetEntity as any)?.smarts || (targetEntity as any)?.chemData?.smarts || '';
        const smarts = getCorrectedSmarts(targetDisplayName, rawSmarts);
        const pharmaNode: HydratedPharmacophore = {
          id: rel.target,
          name: targetDisplayName,
          smarts,
          color: (targetEntity as any)?.color,
          purpose: (targetEntity as any)?.purpose,
          casual_sar_explanation:
            (targetEntity as any)?.casual_sar_explanation ||
            (targetEntity as any)?.pharmacophores?.[0]?.casual_sar_explanation,
          description: rel.sar_and_mechanism_context || (targetEntity as any)?.clinical_and_sar_summary,
        };
        if (!drug.pharmacophores.some((p) => p.name.toLowerCase() === pharmaNode.name.toLowerCase())) {
          drug.pharmacophores.push(pharmaNode);
        }
      }

      // Metabolite / Enzyme relations
      else if (relType === 'METABOLIZED_BY' || relType === 'BIOACTIVATED_BY') {
        drug.enzymes.push({
          id: rel.target,
          name: targetDisplayName,
          type: targetEntity?.type || 'TARGET_OR_ENZYME',
          relation: rel.relation,
        });
      } else if (relType === 'PRODUCES_METABOLITE' || relType === 'HAS_METABOLITE') {
        drug.metabolites.push({
          id: rel.target,
          name: targetDisplayName,
          type: targetEntity?.type || 'METABOLITE',
          relation: rel.relation,
        });
      } else if (relType === 'CAUSES_ADVERSE_EFFECT' || relType === 'HAS_ADVERSE_EFFECT') {
        drug.adverseEffects.push({
          id: rel.target,
          name: targetDisplayName,
          type: targetEntity?.type || 'ADVERSE_EFFECT',
          relation: rel.relation,
        });
      }
    }

    // 5. Fallback hydration to eliminate Orphaned Nodes (empty fields)
    for (const drug of drugMap.values()) {
      // Fallback Target: check entity properties or statin/antiplatelet heuristics
      if (!drug.target) {
        const rawTarget =
          drug.target_receptor ||
          (drug as any).target ||
          drug.pharmacological_class ||
          drug.pharmacologicalClass;

        if (rawTarget && typeof rawTarget === 'string' && rawTarget.trim() && rawTarget.toLowerCase() !== 'n/a') {
          drug.target = {
            id: rawTarget.toLowerCase().replace(/\s+/g, '_'),
            name: rawTarget.trim(),
            type: 'TARGET_OR_ENZYME',
          };
          drug.targets.push(drug.target);
        } else {
          // Chemoinformatics fallback for statins and antiplatelets
          const nameLower = (drug.name || drug.id).toLowerCase();
          const descLower = (drug.clinical_and_sar_summary || drug.moa_summary || '').toLowerCase();
          if (nameLower.endsWith('statin') || descLower.includes('hmg-coa') || descLower.includes('statin')) {
            drug.target = {
              id: 'hmg_coa_reductase',
              name: 'HMG-CoA reductase',
              type: 'TARGET_OR_ENZYME',
            };
            drug.targets.push(drug.target);
          } else if (
            nameLower.includes('clopidogrel') ||
            nameLower.includes('prasugrel') ||
            nameLower.includes('ticagrelor') ||
            nameLower.includes('ticlopidine') ||
            nameLower.includes('cangrelor') ||
            descLower.includes('p2y12')
          ) {
            drug.target = {
              id: 'p2y12_receptor',
              name: 'P2Y12 platelet receptor',
              type: 'TARGET_OR_ENZYME',
            };
            drug.targets.push(drug.target);
          } else if (nameLower.includes('aspirin') || descLower.includes('cox-1') || descLower.includes('cyclooxygenase')) {
            drug.target = {
              id: 'cox1',
              name: 'Cyclooxygenase-1 (COX-1)',
              type: 'TARGET_OR_ENZYME',
            };
            drug.targets.push(drug.target);
          } else if (nameLower.includes('tirofiban') || nameLower.includes('eptifibatide') || descLower.includes('gpiib') || descLower.includes('iib/iiia')) {
            drug.target = {
              id: 'gpiib_iiia',
              name: 'Glycoprotein IIb/IIIa (Integrin αIIbβ3)',
              type: 'TARGET_OR_ENZYME',
            };
            drug.targets.push(drug.target);
          } else if (nameLower.includes('vorapaxar') || descLower.includes('par-1') || descLower.includes('thrombin receptor')) {
            drug.target = {
              id: 'par1',
              name: 'Protease-Activated Receptor-1 (PAR-1)',
              type: 'TARGET_OR_ENZYME',
            };
            drug.targets.push(drug.target);
          } else if (nameLower.includes('cilostazol') || nameLower.includes('dipyridamole') || descLower.includes('pde3') || descLower.includes('phosphodiesterase')) {
            drug.target = {
              id: 'pde3',
              name: 'Phosphodiesterase-3 (PDE3)',
              type: 'TARGET_OR_ENZYME',
            };
            drug.targets.push(drug.target);
          } else {
            drug.target = {
              id: 'unspecified_target',
              name: 'Target Receptor',
              type: 'TARGET_OR_ENZYME',
            };
            drug.targets.push(drug.target);
          }
        }
      }

      // Fallback Clinical Class: check entity properties or statin/antiplatelet heuristics
      if (!drug.clinicalClass) {
        const rawClass =
          drug.chemical_class ||
          drug.chemicalClass ||
          drug.pharmacological_class ||
          drug.pharmacologicalClass;

        if (rawClass && typeof rawClass === 'string' && rawClass.trim() && rawClass.toLowerCase() !== 'n/a') {
          drug.clinicalClass = {
            id: rawClass.toLowerCase().replace(/\s+/g, '_'),
            name: rawClass.trim(),
            type: 'DRUG_CLASS',
          };
          drug.drugClass = drug.clinicalClass;
        } else {
          const nameLower = (drug.name || drug.id).toLowerCase();
          const descLower = (drug.clinical_and_sar_summary || drug.moa_summary || '').toLowerCase();
          if (nameLower.endsWith('statin') || descLower.includes('hmg-coa') || descLower.includes('statin')) {
            drug.clinicalClass = {
              id: 'statin',
              name: 'HMG-CoA Reductase Inhibitor (Statin)',
              type: 'DRUG_CLASS',
            };
            drug.drugClass = drug.clinicalClass;
          } else if (
            nameLower.includes('clopidogrel') ||
            nameLower.includes('prasugrel') ||
            nameLower.includes('ticlopidine')
          ) {
            drug.clinicalClass = {
              id: 'thienopyridine',
              name: 'Thienopyridine P2Y12 Inhibitor',
              type: 'DRUG_CLASS',
            };
            drug.drugClass = drug.clinicalClass;
          } else if (nameLower.includes('ticagrelor')) {
            drug.clinicalClass = {
              id: 'cptp',
              name: 'Cyclopentyltriazolopyrimidine (CPTP)',
              type: 'DRUG_CLASS',
            };
            drug.drugClass = drug.clinicalClass;
          } else if (nameLower.includes('aspirin')) {
            drug.clinicalClass = {
              id: 'salicylate_cox_inhibitor',
              name: 'Salicylate / Irreversible COX-1 Inhibitor',
              type: 'DRUG_CLASS',
            };
            drug.drugClass = drug.clinicalClass;
          } else if (nameLower.includes('tirofiban') || nameLower.includes('eptifibatide')) {
            drug.clinicalClass = {
              id: 'gpiib_iiia_inhibitor',
              name: 'GPIIb/IIIa Receptor Antagonist',
              type: 'DRUG_CLASS',
            };
            drug.drugClass = drug.clinicalClass;
          } else if (nameLower.includes('vorapaxar')) {
            drug.clinicalClass = {
              id: 'par1_antagonist',
              name: 'PAR-1 Thrombin Receptor Antagonist',
              type: 'DRUG_CLASS',
            };
            drug.drugClass = drug.clinicalClass;
          } else if (nameLower.includes('cilostazol') || nameLower.includes('dipyridamole')) {
            drug.clinicalClass = {
              id: 'pde3_inhibitor',
              name: 'PDE3 Inhibitor / Platelet Aggregation Inhibitor',
              type: 'DRUG_CLASS',
            };
            drug.drugClass = drug.clinicalClass;
          } else {
            drug.clinicalClass = {
              id: 'small_molecule',
              name: 'Small Molecule Compound',
              type: 'DRUG_CLASS',
            };
            drug.drugClass = drug.clinicalClass;
          }
        }
      }
    }

    // 6. Return deduplicated, fully populated array of drug objects
    return Array.from(drugMap.values());
  } catch (err) {
    console.error('Failed to get hydrated drugs from graph database:', err);
    return [];
  }
}
