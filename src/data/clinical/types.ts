export interface DrugSideEffects {
  common: string[];
  severe?: string[];
}

export interface DrugInteractions {
  major: string[];
  common: string[];
}

export interface TopDrugClinicalMonograph {
  genericName: string;
  brandNames: string[];
  pharmacologicClass: string;
  therapeuticClass: string;
  mechanismOfAction: string;
  dosingRegimens: string[];
  sideEffects: DrugSideEffects;
  contraindications: string[];
  blackBoxWarning?: string;
  drugInteractions: DrugInteractions;
  monitoringParameters: string[];
  dosageForms: string[];
  administrationAndCounseling: string[];
}
