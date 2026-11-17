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
  pravastatin: 'CCC(C)C(=O)OC1CC(C=C2C1C(C(C=C2)C)CCC(CC(CC(=O)O)O)O)O',
  lovastatin: 'CCC(C)C(=O)OC1CC(C=C2C1C(C(C=C2)C)CCC3CC(CC(=O)O3)O)C',
  fluvastatin: 'CC(C)N1C2=CC=CC=C2C(=C1C=CC(CC(CC(=O)O)O)O)C3=CC=C(C=C3)F',
  pitavastatin: 'C1CC1C2=NC3=CC=CC=C3C(=C2C=CC(CC(CC(=O)O)O)O)C4=CC=C(C=C4)F',
  cerivastatin: 'CC(C)C1=C(C(=C(C(=N1)C(C)C)COC)C2=CC=C(C=C2)F)/C=C/[C@H](C[C@H](CC(=O)O)O)O',

  // Antiplatelet Agents
  aspirin: 'CC(=O)OC1=CC=CC=C1C(=O)O',
  acetylsalicylic_acid: 'CC(=O)OC1=CC=CC=C1C(=O)O',
  clopidogrel: 'COC(=O)C(C1=CC=CC=C1Cl)N2CCC3=C(C2)C=CS3',
  prasugrel: 'CC(=O)OC1=CC2=C(S1)CCN(C2)C(C(=O)C3CC3)C4=CC=CC=C4F',
  ticagrelor: 'CCCSC1=NC(=C2C(=N1)N(N=N2)[C@@H]3C[C@@H]([C@H]([C@H]3O)O)OCCO)N[C@@H]4C[C@H]4C5=CC(=C(C=C5)F)F',
  cangrelor: 'CSCCNC1=C2C(=NC(=N1)SCCC(F)(F)F)N(C=N2)[C@H]3[C@@H]([C@@H]([C@H](O3)COP(=O)(O)OP(=O)(O)C(P(=O)(O)O)(Cl)Cl)O)O',
  tirofiban: 'CCCCCS(=O)(=O)NC(CC1=CC=C(C=C1)OCCCC2CCNCC2)C(=O)O',
  eptifibatide: 'CC1C(=O)NC(C(=O)NC(C(=O)NC(C(=O)NC(CSSCCC(=O)N1)C(=O)NC(CC2=CNC3=CC=CC=C32)C(=O)N)CCCCN=C(N)N)CC(=O)O)C',
  vorapaxar: 'CCOC(=O)NC1CC2C(C1)C(C3=C2C=CC(=C3)C4=CN=CC=C4)(C)C5=CC=C(C=C5)F',
  dipyridamole: 'C1CCN(CC1)C2=NC(=NC3=C2N=C(N=C3N4CCCCC4)N(CCO)CCO)N(CCO)CCO',
  cilostazol: 'C1CCC(CC1)N2C(=NN=N2)CCCCCOC3=CC4=C(C=C3)CCC(=O)N4',

  // Anticoagulants
  warfarin: 'CC(=O)CC(C1=CC=CC=C1)C2=C(C3=CC=CC=C3OC2=O)O',
  dabigatran: 'CN1C2=C(C=C(C=C2)C(=O)N(CCC(=O)O)C3=CC=CC=N3)N=C1CNC4=CC=C(C=C4)C(=N)N',
  dabigatran_etexilate: 'CCCCCCOC(=O)NC(=N)C1=CC=C(C=C1)NCC2=NC3=C(N2C)C=CC(=C3)C(=O)N(CCC(=O)OCC)C4=CC=CC=N4',
  rivaroxaban: 'C1COCC(=O)N1C2=CC=C(C=C2)N3CC(OC3=O)CNC(=O)C4=CC=C(S4)Cl',
  apixaban: 'COC1=CC=C(C=C1)N2C3=C(CCN(C3=O)C4=CC=C(C=C4)N5CCCCC5=O)C(=N2)C(=O)N',
  edoxaban: 'CN1CCC2=C(C1)SC(=N2)C(=O)N[C@@H]3CC[C@H](C[C@H]3NC(=O)C(=O)NC4=NC=C(C=C4)Cl)C(=O)N(C)C',
  betrixaban: 'CN(C)C(=N)C1=CC=C(C=C1)C(=O)NC2=C(C=C(C=C2)OC)C(=O)NC3=NC=C(C=C3)Cl',

  // Lipid-Lowering & Other Cardiovascular Agents
  ezetimibe: 'C1=CC(=CC=C1[C@@H]2[C@H](C(=O)N2C3=CC=C(C=C3)F)CC[C@@H](C4=CC=C(C=C4)F)O)O',
  lomitapide: 'C1CN(CCC1NC(=O)C2=CC=CC=C2C3=CC=C(C=C3)C(F)(F)F)CCCCC4(C5=CC=CC=C5C6=CC=CC=C64)C(=O)NCC(F)(F)F',
  niacin: 'C1=CC(=CN=C1)C(=O)O',
  fenofibrate: 'CC(C)OC(=O)C(C)(C)OC1=CC=C(C=C1)C(=O)C2=CC=C(C=C2)Cl',
  fenofibric_acid: 'CC(C)(C(=O)O)OC1=CC=C(C=C1)C(=O)C2=CC=C(C=C2)Cl',
  gemfibrozil: 'CC1=CC(=C(C=C1)C)OCCCC(C)(C)C(=O)O',
  icosapent_ethyl: 'CCCCC/C=C\\C/C=C\\C/C=C\\C/C=C\\C/C=C\\CCCC(=O)OCC',
  bempedoic_acid: 'CCCCC(CCCC(C)(C)C(=O)O)(CCCC(C)(C)C(=O)O)O',

  // Active Metabolites
  clopidogrel_active_metabolite: 'COC(=O)[C@H](C1=CC=CC=C1Cl)N2CCC(C(=CC(=O)O)C2)S',
  prasugrel_active_metabolite: 'C1CC1C(=O)C(C2=CC=CC=C2F)N3CCC(C(=CC(=O)O)C3)S',
  ticagrelor_active_metabolite: 'CCCSC1=NC(=C2C(=N1)N(N=N2)[C@@H]3C[C@@H]([C@H]([C@H]3O)O)O)N[C@@H]4C[C@H]4C5=CC(=C(C=C5)F)F',
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
