import Dexie, { Table } from 'dexie';
import { ReviewModule, QuizSessionProgress } from '../types/reviewModule';

export type EntityType =
  | 'DRUG'
  | 'DRUG_CLASS'
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
}

export interface GraphEntity {
  /** Canonical lowercase unique identifier, e.g. "clopidogrel", "cyp2c19" */
  id: string;
  /** Display title, e.g. "Clopidogrel", "CYP2C19" */
  name?: string;
  type: EntityType;
  clinical_and_sar_summary: string;
  cid?: number;
  chemData?: ChemData;
  sourcePageNumber?: number;
  sourcePageNumbers?: number[];
  updatedAt?: string;
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
          const newEntity: GraphEntity = {
            ...ent,
            id,
            name: ent.name || ent.id,
            type: ent.type || 'DRUG',
            clinical_and_sar_summary: (ent.clinical_and_sar_summary || '').trim(),
            cid: ent.cid || ent.chemData?.cid,
            chemData: ent.chemData ? { ...ent.chemData } : undefined,
            sourcePageNumber: pageNum,
            sourcePageNumbers: ent.sourcePageNumbers && ent.sourcePageNumbers.length > 0 ? ent.sourcePageNumbers : [pageNum],
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
              };
            }
          }

          const updated: GraphEntity = {
            ...existing,
            name: existing.name || ent.name || existing.id,
            type: existing.type || ent.type,
            clinical_and_sar_summary: mergedSummary,
            cid: existing.cid || ent.cid || mergedChemData?.cid,
            chemData: mergedChemData,
            sourcePageNumber: earliestPage,
            sourcePageNumbers: mergedPages.length ? mergedPages : [earliestPage],
            updatedAt: now,
          };

          await this.entities.put(updated);
          updatedEntities++;
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
 * Pre-seeds standard medicinal chemistry entities and relationships if database is empty or needs GDMT update.
 */
export async function seedDefaultKnowledgeGraph(): Promise<void> {
  const existingAcs = await medChemGraphDb.entities.get('acute_coronary_syndrome');
  const count = await medChemGraphDb.entities.count();
  if (count > 0 && existingAcs) return;

  const defaultEntities: GraphEntity[] = [
    {
      id: 'clopidogrel',
      name: 'Clopidogrel',
      type: 'DRUG',
      clinical_and_sar_summary:
        'Second-generation thienopyridine prodrug. Requires two sequential hepatic cytochrome P450 oxidations (predominantly CYP2C19) to open the thiophene ring into an active thiol metabolite that covalently forms a disulfide bridge with Cys17 and Cys270 on the P2Y12 ADP receptor. Contains a methyl ester side chain prone to esterase hydrolysis (~85% inactivated to clopidogrel carboxylic acid).',
      cid: 98144,
      chemData: {
        cid: 98144,
        iupacName: 'methyl (2S)-2-(2-chlorophenyl)-2-(6,7-dihydro-4H-thieno[3,2-c]pyridin-5-yl)acetate',
        canonicalSmiles: 'COC(=O)C(C1=CC=CC=C1Cl)N2CCC3=C(C2)C=CS3',
        isomericSmiles: 'COC(=O)[C@@H](C1=CC=CC=C1Cl)N2CCC3=C(C2)C=CS3',
        molecularWeight: 321.82,
        xlogp: 3.8,
      },
    },
    {
      id: 'prasugrel',
      name: 'Prasugrel',
      type: 'DRUG',
      clinical_and_sar_summary:
        'Third-generation thienopyridine prodrug. Possesses an ester moiety at position 2 of the thiophene ring. Undergoes rapid intestinal carboxylesterase (CES2) hydrolysis to a thiolactone intermediate (R-95913), followed by a single CYP oxidation (CYP3A4 / CYP2B6) to generate its active metabolite. Much more potent, rapid, and consistent than clopidogrel with minimal resistance.',
      cid: 6918456,
      chemData: {
        cid: 6918456,
        iupacName: '[5-[(1R)-2-cyclopropyl-1-(2-fluorophenyl)-2-oxoethyl]-6,7-dihydro-4H-thieno[3,2-c]pyridin-2-yl] acetate',
        canonicalSmiles: 'CC(=O)OC1=CC2=C(C1)CCN(C2)C(C(=O)C3CC3)C4=CC=CC=C4F',
        isomericSmiles: 'CC(=O)OC1=CC2=C(C1)CCN(C2)[C@@H](C(=O)C3CC3)C4=CC=CC=C4F',
        molecularWeight: 373.44,
        xlogp: 3.4,
      },
    },
    {
      id: 'ticagrelor',
      name: 'Ticagrelor',
      type: 'DRUG',
      clinical_and_sar_summary:
        'Cyclopentyltriazolopyrimidine (CPTP) class. Non-prodrug, directly active, allosteric reversible antagonist of the P2Y12 ADP receptor. Does not bind at the ADP catalytic pocket; binds allosterically to lock the receptor in an inactive conformation. In addition to P2Y12 blockade, inhibits ENT-1 (equilibrative nucleoside transporter 1), increasing circulating adenosine which causes dyspnea.',
      cid: 9871419,
      chemData: {
        cid: 9871419,
        iupacName: '(1S,2S,3R,5S)-3-[7-[[(1R,2S)-2-(3,4-difluorophenyl)cyclopropyl]amino]-5-propylsulfanyl-1,2,3-triazolo[4,5-d]pyrimidin-3-yl]-5-(2-hydroxyethoxy)cyclopentane-1,2-diol',
        canonicalSmiles: 'CCCSC1=NC2=C(N1C3CC(C(C3O)O)OCCO)N=C(N=C2)NC4CC4C5=CC(=C(C=C5)F)F',
        isomericSmiles: 'CCCSC1=NC2=C(N1[C@H]3C[C@@H]([C@H]([C@H]3O)O)OCCO)N=C(N=C2)N[C@@H]4C[C@H]4C5=CC(=C(C=C5)F)F',
        molecularWeight: 522.57,
        xlogp: 2.3,
      },
    },
    {
      id: 'ticlopidine',
      name: 'Ticlopidine',
      type: 'DRUG',
      clinical_and_sar_summary:
        'First-generation prototype thienopyridine. Irreversible P2Y12 antagonist prodrug requiring 2 CYP3A4 oxidation steps. Lacks alpha-position substituents. Forms electrophilic reactive pyridinium and sulfenic acid metabolites responsible for severe idiosyncratic hematologic toxicities: neutropenia, agranulocytosis, and TTP.',
      cid: 5472,
      chemData: {
        cid: 5472,
        iupacName: '5-[(2-chlorophenyl)methyl]-6,7-dihydro-4H-thieno[3,2-c]pyridine',
        canonicalSmiles: 'C1CN(CC2=C1C=CS2)CC3=CC=CC=C3Cl',
        molecularWeight: 263.79,
        xlogp: 3.1,
      },
    },
    {
      id: 'cangrelor',
      name: 'Cangrelor',
      type: 'DRUG',
      clinical_and_sar_summary:
        'Modified adenosine triphosphate (ATP) analogue. Directly active, competitive, reversible P2Y12 inhibitor. Contains a non-hydrolyzable dichloromethylene bisphosphonate bridge. Administered exclusively IV due to high negative charge and polar surface area. Ultra-short elimination half-life (~3-6 min).',
      cid: 9854012,
      chemData: {
        cid: 9854012,
        iupacName: '[dichloro-[[[(2R,3S,4R,5R)-3,4-dihydroxy-5-[5-propylsulfanyl-7-(3,3,3-trifluoropropylamino)triazolo[4,5-d]pyrimidin-3-yl]oxolan-2-yl]methoxy-hydroxyphosphoryl]oxy-hydroxyphosphoryl]methyl]phosphonic acid',
        canonicalSmiles: 'CCCSC1=NC2=C(N1C3C(C(C(O3)COP(=O)(O)OP(=O)(O)C(P(=O)(O)O)(Cl)Cl)O)O)N=CN=C2NCC(F)(F)F',
        molecularWeight: 776.4,
        xlogp: 0.8,
      },
    },
    {
      id: 'aspirin',
      name: 'Aspirin (Acetylsalicylic Acid)',
      type: 'DRUG',
      clinical_and_sar_summary:
        'Salicylate derivative that causes irreversible inactivation of cyclooxygenase-1 (COX-1) by covalently acetylating Ser529 in the catalytic hydrophobic channel. Prevents arachidonic acid from accessing the catalytic pocket, permanently abolishing thromboxane A2 (TXA2) synthesis for the 7-10 day lifespan of the anucleate platelet.',
      cid: 2244,
      chemData: {
        cid: 2244,
        iupacName: '2-acetyloxybenzoic acid',
        canonicalSmiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
        isomericSmiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
        molecularWeight: 180.16,
        xlogp: 1.2,
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
  ];

  const defaultRelationships: GraphRelationship[] = [
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
  ];

  await medChemGraphDb.mergeGraphToDexie(defaultEntities, defaultRelationships);
}
