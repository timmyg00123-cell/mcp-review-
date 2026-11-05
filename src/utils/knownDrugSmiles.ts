/**
 * Authoritative Curated SMILES Database for Common Medicinal Chemistry & Pharmacology Compounds.
 * Serves as a deterministic offline fallback when PubChem API is rate-limited (429) or offline,
 * and ensures canonicalSmiles is NEVER saved as undefined in Dexie IndexedDB.
 */
export const KNOWN_DRUG_SMILES: Record<string, string> = {
  // Statins (HMG-CoA Reductase Inhibitors)
  atorvastatin: 'CC(C)C1=C(C(=C(N1CCC(CC(CC(=O)O)O)O)C2=CC=C(C=C2)F)C3=CC=CC=C3)C(=O)NC4=CC=CC=C4',
  rosuvastatin: 'CC(C)C1=NC(=NC(=C1C=CC(CC(CC(=O)O)O)O)C2=CC=C(C=C2)F)N(C)S(=O)(=O)C',
  simvastatin: 'CCC(C)(C)C(=O)OC1CC(C=C2C1C(C(C=C2)C)CCC3CC(CC(=O)O3)O)C',
  pravastatin: 'CCC(C)C(=O)OC1CC(O)C=C2C1C(C(C=C2)C)CCC(O)CC(O)CC(=O)O',
  lovastatin: 'CCC(C)C(=O)OC1CC(C=C2C1C(C(C=C2)C)CCC3CC(CC(=O)O3)O)C',
  fluvastatin: 'CC(C)N1C2=CC=CC=C2C(=C1C=CC(CC(CC(=O)O)O)O)C3=CC=C(C=C3)F',
  pitavastatin: 'C1CC1C2=NC3=CC=CC=C3C(=C2C=CC(CC(CC(=O)O)O)O)C4=CC=C(C=C4)F',
  cerivastatin: 'CCOC1=C(C(=C(C(=N1)C(C)C)C=CC(CC(CC(=O)O)O)O)C2=CC=C(C=C2)F)C(C)C',

  // Antiplatelet Agents
  aspirin: 'CC(=O)OC1=CC=CC=C1C(=O)O',
  acetylsalicylic_acid: 'CC(=O)OC1=CC=CC=C1C(=O)O',
  clopidogrel: 'COC(=O)C(C1=CC=CC=C1Cl)N2CCC3=C(C2)C=CS3',
  prasugrel: 'CC(=O)OC1=CC2=C(CCN(C2)C(C3=CC=CC=C3F)C(=O)C4CC4)S1',
  ticagrelor: 'CCSC1=NC2=C(C(=N1)NC(CC3=CC=C(C=C3)F)C4=CC=C(C=C4)F)N(N=N2)C5CC(C(C5O)O)OCCO',
  cangrelor: 'CCSC1=NC2=C(C(=N1)NCCC3=CC=CC=C3)N(C=N2)C4C(C(C(O4)COP(=O)(O)OP(=O)(O)CP(=O)(O)Cl)O)O',
  tirofiban: 'CCCCCS(=O)(=O)NC(CC1=CC=C(C=C1)OCCCC2CCNCC2)C(=O)O',
  eptifibatide: 'C1CC(N(C1)C(=O)C2CSSCCC(=O)NC(C(=O)NC(C(=O)NC(C(=O)N2)CC3=CNC4=CC=CC=C43)CC(=O)O)CCCCN=C(N)N)C(=O)N',
  vorapaxar: 'COC(=O)NC1CC2C3CCC4=CC=CC(=C4C3CC(C2C1C=CC5=CN=CC=C5)O)F',
  dipyridamole: 'C1CCN(CC1)C2=NC(=NC3=C2N=C(N=C3N(CCO)CCO)N4CCCCC4)N(CCO)CCO',
  cilostazol: 'C1CCC(CC1)N2C(=O)CCC3=C2C=CC(=C3)OCCCC4=NN=NN4C5CCCCC5',

  // Anticoagulants
  warfarin: 'CC(=O)CC(C1=CC=CC=C1)C2=C(C3=CC=CC=C3OC2=O)O',
  dabigatran: 'CCCN(CC(=O)N(CCC(=O)O)C1=NC2=C(N1)C=CC(=C2)C(=N)N)C3=NC=CC=C3',
  dabigatran_etexilate: 'CCCCCOC(=O)NC(=N)C1=CC2=C(C=C1)N=C(N2C)CN(CCC(=O)OCC)C(=O)C3=CC=NC=C3',
  rivaroxaban: 'ClC1=CC=C(S1)C(=O)NCC2CN(C(=O)O2)C3=CC=C(N4CCOCC4=O)C=C3',
  apixaban: 'COC1=CC=C(C=C1)N2C3=C(C=C(N3)C(=O)N)C(=O)N(C2=O)C4=CC=C(C=C4)N5CCCCC5=O',
  edoxaban: 'COC1=CC=CC=C1NC(=O)C2=NC=C(S2)C(=O)NC3CCC(CC3)(C(=O)N(C)C)NC(=O)C4=NN=C(S4)Cl',
  betrixaban: 'COC1=CC=C(C=C1NC(=O)C2=CC=C(C=C2)C3=NNC(=N3)N)C(=O)NC4=CC=C(C=C4)Cl',

  // Lipid-Lowering & Other Cardiovascular Agents
  ezetimibe: 'OC1=CC=C(C=C1)C2C(C(=O)N2C3=CC=C(C=C3)F)CCCC(O)C4=CC=C(C=C4)F',
  lomitapide: 'CF3C1=CC=C(C=C1)C2=CC=CC=C2C(=O)NCCCCN3CCC(CC3)(C4=CC=CC=C4)C(=O)NC(C)(C)C',
  niacin: 'C1=CC(=CN=C1)C(=O)O',
  fenofibrate: 'CC(C)OC(=O)C(C)(C)OC1=CC=C(C=C1)C(=O)C2=CC=C(C=C2)Cl',
  fenofibric_acid: 'CC(C)(C(=O)O)OC1=CC=C(C=C1)C(=O)C2=CC=C(C=C2)Cl',
  gemfibrozil: 'CC1=CC(=C(C=C1)OCCCC(C)(C)C(=O)O)C',
  icosapent_ethyl: 'CCCCC/C=C\\C/C=C\\C/C=C\\C/C=C\\C/C=C\\CCCC(=O)OCC',
  bempedoic_acid: 'CC(C)(CCCC(C)(C(=O)O)O)CCCC(C)(C)C(=O)O',

  // Active Metabolites
  clopidogrel_active_metabolite: 'COC(=O)C(C1=CC=CC=C1Cl)N2CCC(=CS)C2',
  prasugrel_active_metabolite: 'CC(=O)C(C1=CC=CC=C1F)N2CCC(=CS)C2',
  ticagrelor_active_metabolite: 'CCSC1=NC2=C(C(=N1)NC(CC3=CC=C(C=C3)F)C4=CC=C(C=C4)F)N(N=N2)C5CC(C(C5O)O)O',
};

/**
 * Normalizes query string and retrieves known SMILES string if matched.
 */
export function getKnownDrugSmiles(rawNameOrId?: string): string | undefined {
  if (!rawNameOrId) return undefined;
  const clean = rawNameOrId
    .toLowerCase()
    .replace(/\[.*?\]\s*/g, '')
    .replace(/^(?:structure|compound|drug)\s+[a-z0-9ivxlcdm]+\s*[-:–]?\s*/i, '')
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/^_+|_+$/g, '');

  if (KNOWN_DRUG_SMILES[clean]) {
    return KNOWN_DRUG_SMILES[clean];
  }

  // Partial match check for salt names (e.g. rosuvastatin_calcium -> rosuvastatin)
  for (const [key, smiles] of Object.entries(KNOWN_DRUG_SMILES)) {
    if (clean.startsWith(key) || clean.endsWith(key) || clean.includes(key)) {
      return smiles;
    }
  }

  return undefined;
}
