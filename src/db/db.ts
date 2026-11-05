import {
  medChemGraphDb,
  MedChemGraphDatabase,
  GraphEntity,
  GraphRelationship,
  ChemData,
  MergeStats,
  StoredReviewModule,
  StoredModuleProgress,
  seedDefaultKnowledgeGraph,
  getHydratedDrugs,
  ensureStoragePersistence,
  HydratedDrug,
  HydratedNode,
  HydratedPharmacophore,
  OpenFdaClinicalData,
  ClinicalData,
} from './medChemGraphDb';

/**
 * Primary database export for the high-performance fat client architecture.
 * Exposes the MedChem Dexie instance directly with entities/drugs tables.
 * Stripped of all vector embedding schemas, cosine similarity math, and GraphRAG vector stores.
 */
export const db = medChemGraphDb;

export {
  medChemGraphDb,
  MedChemGraphDatabase,
  seedDefaultKnowledgeGraph,
  getHydratedDrugs,
  ensureStoragePersistence,
};

export type {
  GraphEntity,
  GraphRelationship,
  ChemData,
  MergeStats,
  StoredReviewModule,
  StoredModuleProgress,
  HydratedDrug,
  HydratedNode,
  HydratedPharmacophore,
  OpenFdaClinicalData,
  ClinicalData,
};

export default db;
