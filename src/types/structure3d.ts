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
}

export interface TargetMedChemProfile {
  targetGeneSymbol: string;
  pdbId: string;
  drugName: string;
  ligandCode: string;
  pharmacophoreGroups: PharmacophorePkPdGroup[];
  keyPocketResidues: KeyPocketResidueContact[];
}
