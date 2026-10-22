import { GraphEntity, GraphRelationship, medChemGraphDb, seedDefaultKnowledgeGraph } from '../db/medChemGraphDb';
import { AntiplateletQuestion } from '../types/reviewModule';

export interface MedChemSubgraph {
  seedIds: string[];
  entities: GraphEntity[];
  relationships: GraphRelationship[];
}

/**
 * Traverses 2 hops out in Dexie from a seed query and returns
 * all connected entities (with chemData SMILES/properties/images) and edges.
 */
export async function getTwoHopMedChemSubgraph(
  query: string | string[],
  maxEntities = 40
): Promise<MedChemSubgraph> {
  // Ensure baseline data is seeded if database is fresh
  await seedDefaultKnowledgeGraph();

  const queries = (Array.isArray(query) ? query : [query])
    .map((q) => q.trim().toLowerCase())
    .filter(Boolean);

  if (queries.length === 0) {
    // Return sample of top entities if query is empty
    const entities = await medChemGraphDb.entities.limit(maxEntities).toArray();
    const entityIds = new Set(entities.map((e) => e.id));
    const allRels = await medChemGraphDb.relationships.toArray();
    const relationships = allRels.filter(
      (r) => entityIds.has(r.source) && entityIds.has(r.target)
    );
    return { seedIds: entities.map((e) => e.id), entities, relationships };
  }

  // 1. Hop 0: Identify Seed Nodes
  const seedIds = new Set<string>();

  for (const q of queries) {
    // Check direct ID match
    const direct = await medChemGraphDb.entities.get(q);
    if (direct) {
      seedIds.add(direct.id);
      continue;
    }

    // Check partial ID or Name match
    const matches = await medChemGraphDb.entities
      .filter(
        (ent) =>
          ent.id.includes(q) ||
          (ent.name && ent.name.toLowerCase().includes(q)) ||
          ent.clinical_and_sar_summary.toLowerCase().includes(q)
      )
      .limit(5)
      .toArray();

    matches.forEach((m) => seedIds.add(m.id));

    // Check keyword / theme match in relationships
    const relMatches = await medChemGraphDb.relationships
      .where('theme_keywords')
      .equalsIgnoreCase(q)
      .toArray();

    relMatches.forEach((r) => {
      seedIds.add(r.source);
      seedIds.add(r.target);
    });
  }

  if (seedIds.size === 0) {
    // Fallback: take first matching entity or first drug
    const first = await medChemGraphDb.entities.toCollection().first();
    if (first) seedIds.add(first.id);
  }

  const collectedNodeIds = new Set<string>(seedIds);
  const collectedRelKeys = new Set<string>();
  const collectedRels: GraphRelationship[] = [];

  // Helper to add relationship safely
  const addRel = (r: GraphRelationship) => {
    const key = `${r.source}|${r.relation}|${r.target}`;
    if (!collectedRelKeys.has(key)) {
      collectedRelKeys.add(key);
      collectedRels.push(r);
    }
  };

  // 2. Hop 1: Direct edges connected to seed nodes (bounded)
  const seedArray = Array.from(seedIds);
  const hop1SourceRels = await medChemGraphDb.relationships
    .where('source')
    .anyOf(seedArray)
    .limit(maxEntities * 2)
    .toArray();
  const hop1TargetRels = await medChemGraphDb.relationships
    .where('target')
    .anyOf(seedArray)
    .limit(maxEntities * 2)
    .toArray();

  const hop1Nodes = new Set<string>();
  for (const r of [...hop1SourceRels, ...hop1TargetRels]) {
    addRel(r);
    // Track discovered neighbor nodes while preventing cycle re-traversal
    if (!seedIds.has(r.source)) hop1Nodes.add(r.source);
    if (!seedIds.has(r.target)) hop1Nodes.add(r.target);
    collectedNodeIds.add(r.source);
    collectedNodeIds.add(r.target);
    if (collectedNodeIds.size >= maxEntities) break;
  }

  // 3. Hop 2: Secondary edges connected to Hop 1 nodes (excluding seeds to prevent cycles)
  const hop1Array = Array.from(hop1Nodes);
  // Cap branching factor to prevent combinatorial explosion on dense hub nodes (e.g. CYP3A4, P2Y12)
  const prioritizedHop1 = hop1Array.slice(0, 15);

  if (prioritizedHop1.length > 0 && collectedNodeIds.size < maxEntities) {
    const remainingSlots = maxEntities - collectedNodeIds.size;
    const hop2SourceRels = await medChemGraphDb.relationships
      .where('source')
      .anyOf(prioritizedHop1)
      .limit(remainingSlots * 2)
      .toArray();
    const hop2TargetRels = await medChemGraphDb.relationships
      .where('target')
      .anyOf(prioritizedHop1)
      .limit(remainingSlots * 2)
      .toArray();

    for (const r of [...hop2SourceRels, ...hop2TargetRels]) {
      addRel(r);
      if (collectedNodeIds.size < maxEntities) {
        collectedNodeIds.add(r.source);
        collectedNodeIds.add(r.target);
      }
    }
  }

  // 4. Fetch full Entity records with cached chemData
  const allEntities = await medChemGraphDb.entities
    .where('id')
    .anyOf(Array.from(collectedNodeIds))
    .toArray();

  return {
    seedIds: Array.from(seedIds),
    entities: allEntities,
    relationships: collectedRels,
  };
}

/**
 * Retrieves the entire knowledge graph from Dexie (up to maxEntities)
 * for interactive full-canvas exploration and filtering.
 */
export async function getEntireMedChemGraph(maxEntities = 150): Promise<MedChemSubgraph> {
  await seedDefaultKnowledgeGraph();
  const entities = await medChemGraphDb.entities.limit(maxEntities).toArray();
  const entityIds = new Set(entities.map((e) => e.id));
  const allRels = await medChemGraphDb.relationships.toArray();
  const relationships = allRels.filter(
    (r) => entityIds.has(r.source) && entityIds.has(r.target)
  );
  return {
    seedIds: entities.map((e) => e.id),
    entities,
    relationships,
  };
}

/**
 * Formats a 2-hop MedChem subgraph into structured prompt context for Gemini GraphRAG.
 */
export function formatSubgraphForRag(subgraph: MedChemSubgraph): string {
  const { entities, relationships } = subgraph;

  const entityLines = entities.map((e) => {
    const parts = [
      `* Entity: [${e.type}] "${e.name || e.id}" (id: ${e.id})`,
      `  - Clinical & SAR Summary: ${e.clinical_and_sar_summary}`,
    ];
    if (e.chemData) {
      const chem = e.chemData;
      const chemProps: string[] = [];
      if (chem.cid) chemProps.push(`CID: ${chem.cid}`);
      if (chem.molecularWeight) chemProps.push(`MW: ${chem.molecularWeight} g/mol`);
      if (chem.xlogp !== undefined) chemProps.push(`LogP: ${chem.xlogp}`);
      if (chem.isomericSmiles) chemProps.push(`Isomeric SMILES: ${chem.isomericSmiles}`);
      if (chemProps.length > 0) {
        parts.push(`  - Chemical Properties: ${chemProps.join(', ')}`);
      }
    }
    return parts.join('\n');
  });

  const relationLines = relationships.map((r) => {
    const tags = r.theme_keywords?.length ? ` [Keywords: ${r.theme_keywords.join(', ')}]` : '';
    return `* (${r.source}) --[${r.relation}]--> (${r.target}): ${r.sar_and_mechanism_context}${tags}`;
  });

  return `=== KNOWLEDGE GRAPH 2-HOP GROUNDED EVIDENCE ===
[ENTITIES & CHEMICAL STRUCTURES (${entities.length})]:
${entityLines.join('\n\n')}

[DIRECTED MEDICINAL CHEMISTRY RELATIONSHIPS (${relationships.length})]:
${relationLines.join('\n')}
===================================================`;
}

/**
 * GraphRAG Question Generator:
 * Generates an exam-style structure identification question grounded in 2-hop Graph context.
 */
export async function generateGraphRagQuestion(
  targetDrugOrSeed: string
): Promise<AntiplateletQuestion> {
  const { generateMedChemQuizQuestion } = await import('./quizService');
  return generateMedChemQuizQuestion({ seedEntityOrQuery: targetDrugOrSeed });
}
