/**
 * Structure 3D Lab Types: Pharmacophore PK/PD and Key Pocket Residue Annotations.
 */

export type InteractionType =
  | 'covalent'
  | 'ionic'
  | 'hydrogen-bond'
  | 'pi-stacking'
  | 'coordination'
  | 'hydrophobic';

export interface PharmacophorePharmacokinetics {
  absorption: string;
  metabolism: string;
  prodrugRole?: string;
  halfLifeAndClearance: string;
}

export interface PharmacophorePharmacodynamics {
  targetBindingRole: string;
  physiologicEffect: string;
  adverseEffectRisks: string;
}

export interface PharmacophorePkPdGroup {
  id: string;
  name: string;
  chemicalFormula?: string;
  atomNames: string[];
  colorAccent?: string;
  pharmacokinetics: PharmacophorePharmacokinetics;
  clinicalPharmacodynamics: PharmacophorePharmacodynamics;
}

export interface KeyPocketResidueContact {
  resi: number;
  resn: string;
  chain?: string;
  label: string;
  interactionType: InteractionType;
  clinicalImpact: string;
  subPocketName?: string;
  pharmacophoreGroupId?: string;
  colorAccent?: string;
}

export interface TargetMedChemProfile {
  targetGeneSymbol: string;
  pdbId: string;
  drugName: string;
  ligandCode: string;
  pharmacophoreGroups: PharmacophorePkPdGroup[];
  keyPocketResidues: KeyPocketResidueContact[];
}

export type LigandRenderMode = 'het' | 'chain' | 'carbs';

export interface DrugBindingSite {
  id: string;
  siteName: string;
  drugMoiety: string;
  interactionType: InteractionType;
  colorAccent: string;
  residues: {
    resn: string;
    resi: number;
    chain: string;
    label: string;
  }[];
  reactionSummary: string;
  clinicalRelevance: string;
}

export interface Drug3DCatalogEntry {
  id: string;
  genericName: string;
  brandNames: string[];
  therapeuticClassNumber: number;
  therapeuticCategory: string;
  pharmacologicClass: string;
  source: 'top-200' | 'review-module' | 'both';
  pdbId: string;
  ligandCode: string;
  ligandChain?: string;
  ligandMode?: LigandRenderMode;
  isExactDrugCrystal: boolean;
  crystallizedLigandName: string;
  targetName: string;
  geneSymbol: string;
  overallMechanism: string;
  prodrugNote?: string;
  bindingSites: DrugBindingSite[];
}

export interface TherapeuticClass3DGroup {
  classNumber: number;
  categoryName: string;
  drugs: Drug3DCatalogEntry[];
}

