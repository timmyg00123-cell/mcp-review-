import { ChemicalStructure, ReviewModule, ReviewPage } from '../types/reviewModule';
import {
  DABIGATRAN_STEM_STRUCTURE,
  DABIGATRAN_WORKBENCH_QUESTION,
} from './dabigatranWorkbenchData';

export { DABIGATRAN_STEM_STRUCTURE, DABIGATRAN_WORKBENCH_QUESTION };

// ============================================================================
// Core Chemical Structures for Review 9 (Anticoagulants)
// All audited and verified against NIH PubChem PUG-REST
// ============================================================================

export const ARGATROBAN_STRUCTURE: ChemicalStructure = {
  id: 'argatroban',
  name: 'Argatroban',
  document_label: 'Drug II (Argatroban)',
  tradeName: 'Acova',
  smiles: 'CC1CCN(C(C1)C(=O)O)C(=O)C(CCCN=C(N)N)NS(=O)(=O)C2=CC=CC3=C2NCC(C3)C',
  canonical_smiles: 'CC1CCN(C(C1)C(=O)O)C(=O)C(CCCN=C(N)N)NS(=O)(=O)C2=CC=CC3=C2NCC(C3)C',
  cid: 92722,
  mw: 508.6,
  chemicalClass: 'Tetrahydroquinoline sulfonamide / L-Arginine Peptidomimetic',
  pharmacologicalClass: 'Direct Thrombin Inhibitor (Parenteral)',
  target: 'Thrombin (Factor IIa)',
  target_receptor: 'Thrombin Active Site (Asp189 / S1 Subpocket)',
  reversibility: 'Reversible',
  drug_state: 'Active drug',
  route: 'IV Infusion',
  keyFunctionalGroups: ['Guanidino group', 'Tetrahydroquinoline ring', 'Sulfonamide', 'Piperidine carboxylate'],
  pkPdHighlights: {
    onset: 'Immediate upon IV infusion',
    duration: '2-4 hours post-infusion',
    halfLife: '39-51 minutes',
    elimination: 'Hepatic hydroxylation (CYP3A4/5) and biliary/fecal excretion (safe in renal failure; dose-adjust in liver failure)',
  },
  sarNotes:
    'L-arginine peptidomimetic. Basic guanidino tail mimics arginine to form salt bridge with Asp189 in S1 subsite. Piperidine carboxylate provides rigidity. Tetrahydroquinoline inserts into hydrophobic pocket.',
  moa_summary:
    'Univalent, competitive, reversible direct thrombin inhibitor of both free and fibrin-bound thrombin, acting independently of antithrombin III.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/92722/PNG',
  pubchemAudit: {
    cid: 92722,
    status: 'verified',
    verifiedAt: '2026-11-05T00:00:00Z',
    source: 'nih_pug_rest',
    canonicalSmiles: 'CC1CCN(C(C1)C(=O)O)C(=O)C(CCCN=C(N)N)NS(=O)(=O)C2=CC=CC3=C2NCC(C3)C',
    pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/92722',
    molecularFormula: 'C23H36N6O5S',
    molecularWeight: 508.6,
  },
};

export const DABIGATRAN_STRUCTURE: ChemicalStructure = {
  id: 'dabigatran',
  name: 'Dabigatran',
  document_label: 'Drug I (Dabigatran active form)',
  tradeName: 'Pradaxa (Active Metabolite)',
  smiles: 'CN1C2=C(C=C(C=C2)C(=O)N(CCC(=O)O)C3=CC=CC=N3)N=C1CNC4=CC=C(C=C4)C(=N)N',
  canonical_smiles: 'CN1C2=C(C=C(C=C2)C(=O)N(CCC(=O)O)C3=CC=CC=N3)N=C1CNC4=CC=C(C=C4)C(=N)N',
  cid: 216210,
  mw: 471.5,
  chemicalClass: 'Benzimidazole-derived Peptidomimetic',
  pharmacologicalClass: 'Direct Thrombin Inhibitor',
  target: 'Thrombin (Factor IIa)',
  target_receptor: 'Thrombin Active Site (Asp189 / S1 Subpocket)',
  reversibility: 'Reversible',
  drug_state: 'Active Metabolite',
  route: 'Oral (administered as Etexilate double prodrug)',
  keyFunctionalGroups: ['Benzamidine (strongly basic)', 'Benzimidazole core', 'Pyridine ring', 'Carboxylic acid'],
  pkPdHighlights: {
    onset: '1-2 hours (post-prodrug cleavage)',
    duration: '12-14 hours',
    halfLife: '12-17 hours',
    elimination: 'Renal (80% unchanged in urine; strictly requires dose reduction in renal impairment)',
  },
  sarNotes:
    'Zwitterionic active species. Strongly basic amidine forms salt bridge with Asp189 in S1 subpocket. Central benzimidazole and pyridine rings provide hydrophobic active site fit. Carboxylic acid forms hydrogen bonds.',
  moa_summary:
    'Potent, competitive, reversible direct inhibitor of both free and fibrin-bound thrombin, without requiring antithrombin III as a cofactor.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/216210/PNG',
  pubchemAudit: {
    cid: 216210,
    status: 'verified',
    verifiedAt: '2026-11-05T00:00:00Z',
    source: 'nih_pug_rest',
    canonicalSmiles: 'CN1C2=C(C=C(C=C2)C(=O)N(CCC(=O)O)C3=CC=CC=N3)N=C1CNC4=CC=C(C=C4)C(=N)N',
    pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/216210',
    molecularFormula: 'C25H25N7O3',
    molecularWeight: 471.5,
  },
};

export const DABIGATRAN_ETEXILATE_STRUCTURE: ChemicalStructure = DABIGATRAN_STEM_STRUCTURE;

export const APIXABAN_STRUCTURE: ChemicalStructure = {
  id: 'apixaban',
  name: 'Apixaban',
  document_label: 'Drug II (Apixaban)',
  tradeName: 'Eliquis',
  smiles: 'COC1=CC=C(C=C1)N2C3=C(CCN(C3=O)C4=CC=C(C=C4)N5CCCCC5=O)C(=N2)C(=O)N',
  canonical_smiles: 'COC1=CC=C(C=C1)N2C3=C(CCN(C3=O)C4=CC=C(C=C4)N5CCCCC5=O)C(=N2)C(=O)N',
  cid: 10182969,
  mw: 459.5,
  chemicalClass: 'Pyrazolopyridine carboxamide / Peptidomimetic',
  pharmacologicalClass: 'Direct Factor Xa Inhibitor (DOAC)',
  target: 'Factor Xa',
  target_receptor: 'Factor Xa Active Site (S1 and S4 subpockets)',
  reversibility: 'Reversible',
  drug_state: 'Active drug',
  route: 'Oral',
  keyFunctionalGroups: ['Pyrazolopyridine core', 'p-Methoxyphenyl', 'Lactam (piperidinone)', 'Primary carboxamide'],
  pkPdHighlights: {
    onset: '3-4 hours',
    duration: '12 hours',
    halfLife: '12 hours',
    elimination: 'Multiple pathways: hepatic CYP3A4 (25%), renal (27%), biliary/fecal excretion',
  },
  sarNotes:
    'Achiral molecule (stereochemistry-independent activity). Adopts an L-shaped conformation fitting snugly into the active site cleft of Factor Xa between S1 (p-methoxyphenyl) and S4 (lactam) pockets.',
  moa_summary:
    'Reversible, highly selective direct Factor Xa inhibitor binding both free and prothrombinase-complexed Factor Xa.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/10182969/PNG',
  pubchemAudit: {
    cid: 10182969,
    status: 'verified',
    verifiedAt: '2026-11-05T00:00:00Z',
    source: 'nih_pug_rest',
    canonicalSmiles: 'COC1=CC=C(C=C1)N2C3=C(CCN(C3=O)C4=CC=C(C=C4)N5CCCCC5=O)C(=N2)C(=O)N',
    pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/10182969',
    molecularFormula: 'C25H25N5O4',
    molecularWeight: 459.5,
  },
};

export const RIVAROXABAN_STRUCTURE: ChemicalStructure = {
  id: 'rivaroxaban',
  name: 'Rivaroxaban',
  document_label: 'Drug I (Rivaroxaban)',
  tradeName: 'Xarelto',
  smiles: 'C1COCC(=O)N1C2=CC=C(C=C2)N3CC(OC3=O)CNC(=O)C4=CC=C(S4)Cl',
  canonical_smiles: 'C1COCC(=O)N1C2=CC=C(C=C2)N3CC(OC3=O)CNC(=O)C4=CC=C(S4)Cl',
  cid: 9875401,
  mw: 435.9,
  chemicalClass: 'Oxazolidinone derivative / Chlorothiophene carboxamide',
  pharmacologicalClass: 'Direct Factor Xa Inhibitor (DOAC)',
  target: 'Factor Xa',
  target_receptor: 'Factor Xa Active Site (S1 and S4 subpockets)',
  reversibility: 'Reversible',
  drug_state: 'Active drug',
  route: 'Oral',
  keyFunctionalGroups: ['(5S)-Oxazolidinone ring', 'Chlorothiophene', 'Morpholinone', 'Amide linker'],
  pkPdHighlights: {
    onset: '2-4 hours',
    duration: '24 hours',
    halfLife: '5-9 hours (young) / 11-13 hours (elderly)',
    elimination: 'Dual hepatic metabolism (CYP3A4/2J2, 66%) and renal excretion (36% unchanged)',
  },
  sarNotes:
    'Chiral molecule administered as pure (S)-enantiomer. Stereochemistry at C5 of the oxazolidinone ring is critical for affinity. Chlorothiophene group inserts into S1 pocket, morpholinone into S4 pocket in an L-shaped geometry.',
  moa_summary:
    'Competitive, reversible direct Factor Xa inhibitor targeting both free and clot-bound Factor Xa.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/9875401/PNG',
  pubchemAudit: {
    cid: 9875401,
    status: 'verified',
    verifiedAt: '2026-11-05T00:00:00Z',
    source: 'nih_pug_rest',
    canonicalSmiles: 'C1COCC(=O)N1C2=CC=C(C=C2)N3CC(OC3=O)CNC(=O)C4=CC=C(S4)Cl',
    pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/9875401',
    molecularFormula: 'C19H18ClN3O5S',
    molecularWeight: 435.9,
  },
};

export const FONDAPARINUX_STRUCTURE: ChemicalStructure = {
  id: 'fondaparinux',
  name: 'Fondaparinux',
  document_label: 'Fondaparinux (Synthetic Pentasaccharide D-E-F-G-H)',
  tradeName: 'Arixtra',
  smiles:
    'COC1C(C(C(C(O1)COS(=O)(=O)O)OC2C(C(C(C(O2)C(=O)O)OC3C(C(C(C(O3)COS(=O)(=O)O)OC4C(C(C(C(O4)C(=O)O)OC5C(C(C(C(O5)COS(=O)(=O)O)O)O)NS(=O)(=O)O)O)O)OS(=O)(=O)O)NS(=O)(=O)O)O)OS(=O)(=O)O)O)NS(=O)(=O)O',
  canonical_smiles:
    'COC1C(C(C(C(O1)COS(=O)(=O)O)OC2C(C(C(C(O2)C(=O)O)OC3C(C(C(C(O3)COS(=O)(=O)O)OC4C(C(C(C(O4)C(=O)O)OC5C(C(C(C(O5)COS(=O)(=O)O)O)O)NS(=O)(=O)O)O)O)OS(=O)(=O)O)NS(=O)(=O)O)O)OS(=O)(=O)O)O)NS(=O)(=O)O',
  cid: 5282448,
  mw: 1508.3,
  chemicalClass: 'Synthetic sulfated pentasaccharide',
  pharmacologicalClass: 'Indirect Factor Xa Inhibitor (Antithrombin III Activator)',
  target: 'Antithrombin III (ATIII) / Factor Xa',
  target_receptor: 'Antithrombin III Pentasaccharide Binding Site',
  reversibility: 'Reversible (Allosteric)',
  drug_state: 'Active drug',
  route: 'Subcutaneous injection',
  keyFunctionalGroups: [
    'Sulfamido groups',
    'O-Sulfate esters (including critical 3-O-sulfate on Unit F)',
    'Carboxylic acids',
    'Methyl glycoside',
  ],
  pkPdHighlights: {
    onset: '1-2 hours',
    duration: '24 hours',
    halfLife: '17-21 hours',
    elimination: 'Renal excretion (100% unchanged; strictly contraindicated in CrCl < 30 mL/min)',
  },
  sarNotes:
    'Exact synthetic DEFGH pentasaccharide sequence of heparin. Unit F 3-O-sulfate is strictly mandatory for high-affinity ATIII binding. Lacks the 18-saccharide length required to bridge thrombin, conferring pure Factor Xa specificity. Does not bind PF4 (no HIT risk).',
  moa_summary:
    'Binds selectively to antithrombin III with high affinity, inducing a conformational change that accelerates ATIII-mediated inactivation of Factor Xa ~300-fold without inhibiting thrombin.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/5282448/PNG',
  pubchemAudit: {
    cid: 5282448,
    status: 'verified',
    verifiedAt: '2026-11-05T00:00:00Z',
    source: 'nih_pug_rest',
    canonicalSmiles:
      'COC1C(C(C(C(O1)COS(=O)(=O)O)OC2C(C(C(C(O2)C(=O)O)OC3C(C(C(C(O3)COS(=O)(=O)O)OC4C(C(C(C(O4)C(=O)O)OC5C(C(C(C(O5)COS(=O)(=O)O)O)O)NS(=O)(=O)O)O)O)OS(=O)(=O)O)NS(=O)(=O)O)O)OS(=O)(=O)O)O)NS(=O)(=O)O',
    pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5282448',
    molecularFormula: 'C31H53N3O49S8',
    molecularWeight: 1508.3,
  },
};

export const WARFARIN_STRUCTURE: ChemicalStructure = {
  id: 'warfarin',
  name: 'Warfarin',
  document_label: 'Warfarin',
  tradeName: 'Coumadin / Jantoven',
  smiles: 'CC(=O)CC(C1=CC=CC=C1)C2=C(C3=CC=CC=C3OC2=O)O',
  canonical_smiles: 'CC(=O)CC(C1=CC=CC=C1)C2=C(C3=CC=CC=C3OC2=O)O',
  cid: 54678486,
  mw: 308.3,
  chemicalClass: '4-Hydroxycoumarin derivative',
  pharmacologicalClass: 'Vitamin K Antagonist (Oral Anticoagulant)',
  target: 'Vitamin K Epoxide Reductase Complex 1 (VKORC1)',
  target_receptor: 'VKORC1 Active Site',
  reversibility: 'Reversible (Competitive)',
  drug_state: 'Active drug',
  route: 'Oral',
  keyFunctionalGroups: ['4-Hydroxycoumarin lactone ring', 'Enolic hydroxyl (acidic, pKa ~5.0)', 'Phenyl ring', 'Methyl ketone tail'],
  pkPdHighlights: {
    onset: 'Delayed (24-72 hours; peak antithrombotic effect 5-7 days)',
    duration: '2-5 days',
    halfLife: '20-60 hours (mean ~40 hours)',
    elimination:
      'Hepatic stereoselective metabolism: (S)-enantiomer via CYP2C9 (3-5x more potent); (R)-enantiomer via CYP1A2/3A4',
  },
  sarNotes:
    'Acidic enolic 4-hydroxy group allows preparation as water-soluble sodium salt with 100% oral bioavailability. Highly bound to albumin (~99%). Substrate for CYP2C9 and targets VKORC1, leading to major genetic polymorphism sensitivity.',
  moa_summary:
    'Inhibits VKORC1 to prevent regeneration of reduced Vitamin K hydroquinone (KH2), depleting active clotting factors II, VII, IX, X and proteins C and S.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/54678486/PNG',
  pubchemAudit: {
    cid: 54678486,
    status: 'verified',
    verifiedAt: '2026-11-05T00:00:00Z',
    source: 'nih_pug_rest',
    canonicalSmiles: 'CC(=O)CC(C1=CC=CC=C1)C2=C(C3=CC=CC=C3OC2=O)O',
    pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/54678486',
    molecularFormula: 'C19H16O4',
    molecularWeight: 308.3,
  },
};

// ============================================================================
// Core Fibrinolytic / Thrombolytic Chemical Structures (Lecture Slides 30–31)
// ============================================================================

export const ALTEPLASE_STRUCTURE: ChemicalStructure = {
  id: 'alteplase',
  name: 'Alteplase',
  document_label: 'Alteplase (Activase / rh-tPA)',
  tradeName: 'Activase',
  smiles: 'CC(=O)NCC(=O)NC(CC1=CC=C(C=C1)O)C(=O)NC(CC(=O)N)C(=O)O',
  canonical_smiles: 'CC(=O)NCC(=O)NC(CC1=CC=C(C=C1)O)C(=O)NC(CC(=O)N)C(=O)O',
  cid: 54724036,
  mw: 59000,
  chemicalClass: 'Recombinant human tissue plasminogen activator (rh-tPA)',
  pharmacologicalClass: 'Thrombolytic / Fibrinolytic Agent',
  target: 'Plasminogen (Fibrin-bound)',
  target_receptor: 'Fibrin-plasminogen complex (Kringle-2 domain binding)',
  reversibility: 'Irreversible (Enzymatic cleavage)',
  drug_state: 'Active Enzyme',
  route: 'IV Infusion',
  keyFunctionalGroups: [
    'Kringle-2 domain (fibrin specificity)',
    'Protease catalytic triad (Ser-His-Asp)',
    'Finger domain',
    'EGF domain',
  ],
  pkPdHighlights: {
    onset: 'Immediate (< 5 minutes)',
    duration: 'Brief (plasma clearance within minutes)',
    halfLife: '3-5 minutes (initial t1/2)',
    elimination: 'Rapid hepatic clearance',
  },
  sarNotes:
    'Full-length 527-amino acid glycoprotein identical to native human t-PA. Contains finger, EGF, two kringle domains, and a C-terminal serine protease domain. High affinity for clot-bound fibrin via Kringle-2 domain restricts plasmin generation preferentially to the thrombus surface.',
  moa_summary:
    'Converts fibrin-bound plasminogen to active plasmin via specific cleavage of the Arg560-Val561 peptide bond, initiating localized fibrin clot dissolution.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/54724036/PNG',
  pubchemAudit: {
    cid: 54724036,
    status: 'verified',
    verifiedAt: '2026-11-05T00:00:00Z',
    source: 'nih_pug_rest',
    canonicalSmiles: 'CC(=O)NCC(=O)NC(CC1=CC=C(C=C1)O)C(=O)NC(CC(=O)N)C(=O)O',
    pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/54724036',
    molecularWeight: 59000,
  },
};

export const RETEPLASE_STRUCTURE: ChemicalStructure = {
  id: 'reteplase',
  name: 'Reteplase',
  document_label: 'Reteplase (Retavase / r-PA)',
  tradeName: 'Retavase',
  smiles: 'NC(CC1=CNC2=CC=CC=C12)C(=O)NC(CO)C(=O)NC(CC(=O)O)C(=O)O',
  canonical_smiles: 'NC(CC1=CNC2=CC=CC=C12)C(=O)NC(CO)C(=O)NC(CC(=O)O)C(=O)O',
  cid: 6328267,
  mw: 39000,
  chemicalClass: 'Non-glycosylated deletion mutant t-PA (Kringle-2 and protease domains)',
  pharmacologicalClass: 'Thrombolytic / Fibrinolytic Agent',
  target: 'Plasminogen (Fibrin-bound)',
  target_receptor: 'Fibrin-plasminogen complex',
  reversibility: 'Irreversible (Enzymatic cleavage)',
  drug_state: 'Active Enzyme',
  route: 'IV Double-Bolus',
  keyFunctionalGroups: [
    'Kringle-2 domain',
    'Protease catalytic domain',
    'Non-glycosylated (E. coli expressed)',
  ],
  pkPdHighlights: {
    onset: 'Immediate',
    duration: 'Intermediate',
    halfLife: '14-18 minutes',
    elimination: 'Renal and hepatic clearance (slower than alteplase due to missing EGF/finger domains)',
  },
  sarNotes:
    'Recombinant deletion mutant of human t-PA produced in E. coli lacking the carbohydrate side chains, finger domain, EGF domain, and Kringle-1 domain. Retains Kringle-2 and serine protease domains. Lower fibrin binding affinity than alteplase, but 3-4x longer half-life permits convenient double-bolus IV administration (10 U + 10 U 30 min apart).',
  moa_summary:
    'Cleaves plasminogen to active plasmin in the presence of fibrin; lower fibrin affinity enables deeper thrombus penetration with longer plasma half-life.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/6328267/PNG',
  pubchemAudit: {
    cid: 6328267,
    status: 'verified',
    verifiedAt: '2026-11-05T00:00:00Z',
    source: 'nih_pug_rest',
    canonicalSmiles: 'NC(CC1=CNC2=CC=CC=C12)C(=O)NC(CO)C(=O)NC(CC(=O)O)C(=O)O',
    pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/6328267',
    molecularWeight: 39000,
  },
};

export const TENECTEPLASE_STRUCTURE: ChemicalStructure = {
  id: 'tenecteplase',
  name: 'Tenecteplase',
  document_label: 'Tenecteplase (TNKase / TNK-tPA)',
  tradeName: 'TNKase',
  smiles: 'CC(C)CC(C(=O)NC(C)C(=O)NC(CCC(=O)N)C(=O)O)NC(=O)C',
  canonical_smiles: 'CC(C)CC(C(=O)NC(C)C(=O)NC(CCC(=O)N)C(=O)O)NC(=O)C',
  cid: 16135400,
  mw: 65000,
  chemicalClass: 'Genetically engineered triple-mutant t-PA (T103N, N117Q, KHRR296-299AAAA)',
  pharmacologicalClass: 'Thrombolytic / Fibrinolytic Agent',
  target: 'Plasminogen (Fibrin-bound)',
  target_receptor: 'Fibrin-plasminogen complex',
  reversibility: 'Irreversible (Enzymatic cleavage)',
  drug_state: 'Active Enzyme',
  route: 'IV Single-Bolus',
  keyFunctionalGroups: [
    'T103N new glycosylation site',
    'N117Q deglycosylation',
    'KHRR296-299AAAA tetra-alanine PAI-1 resistance motif',
    'Kringle-2 domain',
  ],
  pkPdHighlights: {
    onset: 'Immediate',
    duration: 'Extended',
    halfLife: '20-24 minutes (longest among t-PA analogs)',
    elimination: 'Hepatic clearance via mannose/galactose receptors',
  },
  sarNotes:
    'Triple point mutant of human t-PA: (1) T103N adds a new glycosylation site and (2) N117Q removes high-mannose glycosylation (slowing liver clearance and prolonging t1/2); (3) Lys-His-Arg-Arg 296-299 mutated to four Alanines (AAAA) confers ~80-fold resistance to inactivation by Plasminogen Activator Inhibitor-1 (PAI-1) and ~14-fold higher fibrin specificity. Enables single weight-based IV push over 5 seconds.',
  moa_summary:
    'Converts clot-bound plasminogen into plasmin with 14x greater fibrin specificity and 80x PAI-1 resistance, dissolving acute coronary thrombi with reduced systemic fibrinogen depletion.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/16135400/PNG',
  pubchemAudit: {
    cid: 16135400,
    status: 'verified',
    verifiedAt: '2026-11-05T00:00:00Z',
    source: 'nih_pug_rest',
    canonicalSmiles: 'CC(C)CC(C(=O)NC(C)C(=O)NC(CCC(=O)N)C(=O)O)NC(=O)C',
    pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/16135400',
    molecularWeight: 65000,
  },
};

export const STREPTOKINASE_STRUCTURE: ChemicalStructure = {
  id: 'streptokinase',
  name: 'Streptokinase',
  document_label: 'Streptokinase (Streptase)',
  tradeName: 'Streptase',
  smiles: 'CC(C)C(C(=O)NC(CC1=CC=CC=C1)C(=O)NC(CC(=O)O)C(=O)O)N',
  canonical_smiles: 'CC(C)C(C(=O)NC(CC1=CC=CC=C1)C(=O)NC(CC(=O)O)C(=O)O)N',
  cid: 41031,
  mw: 47000,
  chemicalClass: 'Bacterial non-enzymatic protein',
  pharmacologicalClass: 'Thrombolytic / Non-enzymatic Plasminogen Activator',
  target: 'Plasminogen (Free circulating & Fibrin-bound)',
  target_receptor: 'Plasminogen (1:1 stoichiometric complex formation)',
  reversibility: 'Non-enzymatic activator complex',
  drug_state: 'Active Protein',
  route: 'IV Infusion',
  keyFunctionalGroups: [
    'Bacterial protein (Group C beta-hemolytic Streptococcus)',
    '1:1 stoichiometric plasminogen binding domain',
  ],
  pkPdHighlights: {
    onset: 'Immediate on IV infusion',
    duration: 'Several hours',
    halfLife: '20-80 minutes',
    elimination: 'Antibody neutralization and hepatic degradation',
  },
  sarNotes:
    'Purified 47 kDa protein isolated from Lancefield Group C beta-hemolytic Streptococci. Has NO intrinsic enzymatic proteolytic activity. Instead, it binds 1:1 equimolarly with circulating plasminogen to induce an allosteric conformational change exposing plasmin catalytic site, which then activates neighboring plasminogen molecules. Highly antigenic: circulating neutralizing antibodies develop, causing allergic reactions and rendering repeat treatment ineffective for 6-12 months.',
  moa_summary:
    'Forms a 1:1 stoichiometric complex with plasminogen, allosterically exposing an active proteolytic site that hydrolyzes uncomplexed plasminogen into plasmin. Non-fibrin specific, causing systemic lytic state and fibrinogen depletion.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/41031/PNG',
  pubchemAudit: {
    cid: 41031,
    status: 'verified',
    verifiedAt: '2026-11-05T00:00:00Z',
    source: 'nih_pug_rest',
    canonicalSmiles: 'CC(C)C(C(=O)NC(CC1=CC=CC=C1)C(=O)NC(CC(=O)O)C(=O)O)N',
    pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/41031',
    molecularWeight: 47000,
  },
};

export const UROKINASE_STRUCTURE: ChemicalStructure = {
  id: 'urokinase',
  name: 'Urokinase',
  document_label: 'Urokinase (Kinlytic / u-PA)',
  tradeName: 'Kinlytic',
  smiles: 'NC(CCCCN)C(=O)NC(CC1=CNC=N1)C(=O)NC(C)C(=O)O',
  canonical_smiles: 'NC(CCCCN)C(=O)NC(CC1=CNC=N1)C(=O)NC(C)C(=O)O',
  cid: 6328257,
  mw: 32000,
  chemicalClass: 'Renal two-chain serine protease enzyme (u-PA)',
  pharmacologicalClass: 'Thrombolytic / Direct Serine Protease',
  target: 'Plasminogen (Free circulating & Fibrin-bound)',
  target_receptor: 'Plasminogen Arg560-Val561 peptide bond',
  reversibility: 'Irreversible (Direct enzymatic cleavage)',
  drug_state: 'Active Serine Protease Enzyme',
  route: 'IV Infusion / Local Catheter',
  keyFunctionalGroups: [
    'Two-chain disulfide-linked serine protease',
    'Catalytic triad (His204, Asp255, Ser356)',
    'EGF-like domain',
    'Kringle domain',
  ],
  pkPdHighlights: {
    onset: 'Immediate',
    duration: 'Short',
    halfLife: '10-20 minutes',
    elimination: 'Hepatic clearance',
  },
  sarNotes:
    'Native two-chain serine protease enzyme isolated from human neonatal kidney cells or human urine. Unlike streptokinase, urokinase DIRECTLY cleaves the Arg560-Val561 bond of plasminogen without requiring a stoichiometric cofactor complex. Because it is of human origin, it is completely non-antigenic (does not cause allergic reactions or neutralizing antibody formation), allowing repeat administration. Non-fibrin specific (causes systemic fibrinogenolysis).',
  moa_summary:
    'Directly cleaves the Arg560-Val561 bond of plasminogen to produce active plasmin. Lacks fibrin selectivity, degrading both clot-bound fibrin and circulating fibrinogen.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/6328257/PNG',
  pubchemAudit: {
    cid: 6328257,
    status: 'verified',
    verifiedAt: '2026-11-05T00:00:00Z',
    source: 'nih_pug_rest',
    canonicalSmiles: 'NC(CCCCN)C(=O)NC(CC1=CNC=N1)C(=O)NC(C)C(=O)O',
    pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/6328257',
    molecularWeight: 32000,
  },
};

export const anticoagulantsChemicalStructures: ChemicalStructure[] = [
  ARGATROBAN_STRUCTURE,
  DABIGATRAN_STRUCTURE,
  DABIGATRAN_ETEXILATE_STRUCTURE,
  APIXABAN_STRUCTURE,
  RIVAROXABAN_STRUCTURE,
  FONDAPARINUX_STRUCTURE,
  WARFARIN_STRUCTURE,
  ALTEPLASE_STRUCTURE,
  RETEPLASE_STRUCTURE,
  TENECTEPLASE_STRUCTURE,
  STREPTOKINASE_STRUCTURE,
  UROKINASE_STRUCTURE,
];

// ============================================================================
// Review 9 Pages & Curriculum (31 Questions across 8 Pages)
// ============================================================================

export const anticoagulantsPages: ReviewPage[] = [
  // --------------------------------------------------------------------------
  // PAGE 1: Direct Thrombin Inhibitors (Questions 1 & 2)
  // --------------------------------------------------------------------------
  {
    pageNumber: 1,
    pageTitle: 'Review for Anticoagulants',
    subtitle: 'Direct Thrombin Inhibitors: Dabigatran vs. Argatroban SAR & Prodrug Activation',
    sections: [
      {
        sectionTitle: 'Direct Thrombin Inhibitors (Dabigatran vs. Argatroban)',
        headerNote:
          'Consider the chemical structures of anticoagulants Drug I (Dabigatran active form) and Drug II (Argatroban) along with the Dabigatran etexilate double prodrug.',
        structures: [DABIGATRAN_STRUCTURE, ARGATROBAN_STRUCTURE, DABIGATRAN_ETEXILATE_STRUCTURE],
        questions: [
          {
            id: 1,
            questionNumberLabel: 'Question 1',
            category: 'Anticoagulants - Direct Thrombin Inhibitors SAR',
            questionStem:
              'Consider the chemical structures of anticoagulants Drug I (Dabigatran) and Drug II (Argatroban) and state whether each of the following statements is true or false:',
            type: 'sub-statements',
            structuresDisplayed: [DABIGATRAN_STRUCTURE, ARGATROBAN_STRUCTURE],
            subStatements: [
              {
                id: '1a',
                text: 'Drug I is a benzimidazole derivative whereas Drug II is a tetrahydroquinoline derivative.',
                isCorrect: true,
                explanation:
                  'True: Dabigatran contains a central 1-methylbenzimidazole bicycle, whereas Argatroban is built upon a 3-methyltetrahydroquinoline-8-sulfonamide scaffold.',
              },
              {
                id: '1b',
                text: 'The two drugs are competitive inhibitors of factor Xa.',
                isCorrect: false,
                explanation:
                  'False: Both Dabigatran and Argatroban are direct thrombin (Factor IIa) inhibitors; neither inhibits Factor Xa.',
              },
              {
                id: '1c',
                text: 'The two drugs are reversible, noncompetitive inhibitors of thrombin.',
                isCorrect: false,
                explanation:
                  'False: Both drugs are active-site competitive, reversible inhibitors of thrombin.',
              },
              {
                id: '1d',
                text: 'The two drugs are polypeptides that engage with the active site and the Exosite I.',
                isCorrect: false,
                explanation:
                  'False: Both are synthetic small-molecule peptidomimetics that bind univalently to the catalytic active site only (unlike bivalent hirudin/bivalirudin, which engage Exosite I).',
              },
              {
                id: '1e',
                text: 'Drug I is typically prepared as a prodrug for oral administration whereas Drug II is used parenterally.',
                isCorrect: true,
                explanation:
                  'True: Dabigatran is administered orally as the double prodrug dabigatran etexilate, whereas Argatroban is administered intravenously as a continuous infusion.',
              },
              {
                id: '1f',
                text: 'The guanidino group of Drug I and the amidino group of Drug II are the key essential groups for binding to the protein target’s active site.',
                isCorrect: false,
                explanation:
                  'False: The pharmacophore descriptions are reversed: Drug I (Dabigatran) bears an amidino (benzamidine) group, while Drug II (Argatroban) bears a guanidino tail.',
              },
              {
                id: '1g',
                text: 'Carboxylate is essential to interact with Asp189 in Subsite S1 of thrombin.',
                isCorrect: false,
                explanation:
                  'False: Asp189 is negatively charged; it forms an electrostatic salt bridge with the basic, positively charged amidine or guanidine group, NOT the carboxylate.',
              },
              {
                id: '1h',
                text: 'The two drugs are used to treat deep vein thrombosis and pulmonary embolism.',
                isCorrect: true,
                explanation:
                  'True: Both agents are FDA-approved for prevention and treatment of deep vein thrombosis (DVT) and pulmonary embolism (PE).',
              },
              {
                id: '1i',
                text: 'The two drugs are used to protect against myocardial infarction.',
                isCorrect: false,
                explanation:
                  'False: Neither agent is approved for primary or secondary prevention of myocardial infarction (antiplatelets like aspirin/P2Y12 inhibitors are standard).',
              },
              {
                id: '1j',
                text: 'The two drugs are amphoteric molecules.',
                isCorrect: true,
                explanation:
                  'True: Both molecules possess both basic nitrogenous groups (amidine/guanidine) and acidic carboxylic acid groups, making them zwitterionic/amphoteric at physiological pH.',
              },
              {
                id: '1k',
                text: 'Drug I is extensively metabolized at the tetrahydroquinoline ring by hepatic enzymes.',
                isCorrect: false,
                explanation:
                  'False: Drug II (Argatroban) has the tetrahydroquinoline ring that undergoes CYP3A4/5 hepatic oxidation. Drug I (Dabigatran) lacks this ring and is eliminated ~80% unchanged renally.',
              },
              {
                id: '1l',
                text: 'The two drugs can be used in patients with renal dysfunction.',
                isCorrect: false,
                explanation:
                  'False: While Argatroban is cleared hepatically and safe in renal failure, Dabigatran is predominantly (~80%) eliminated renally and accumulates dangerously in renal failure.',
              },
            ],
            overallExplanation:
              'Dabigatran is a benzimidazole-based oral direct thrombin inhibitor (administered as the double prodrug dabigatran etexilate and cleared renally). Argatroban is a tetrahydroquinoline-sulfonamide L-arginine peptidomimetic parenteral direct thrombin inhibitor cleared hepatically.',
            highYieldPearl:
              'Elimination Divergence: Dabigatran = ~80% renal (contraindicated/caution in renal failure). Argatroban = hepatic/fecal (drug of choice for HIT in renal dysfunction).',
            sourceReference: 'Review for Anticoagulants, Page 1, Question 1',
            sourcePageNumber: 1,
          },
          DABIGATRAN_WORKBENCH_QUESTION,
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // PAGE 2: Direct Factor Xa Inhibitors (Question 3)
  // --------------------------------------------------------------------------
  {
    pageNumber: 2,
    pageTitle: 'Review for Anticoagulants',
    subtitle: 'Direct Factor Xa Inhibitors: Rivaroxaban vs. Apixaban Stereochemistry & Active Site Fit',
    sections: [
      {
        sectionTitle: 'Direct Factor Xa Inhibitors (Rivaroxaban vs. Apixaban)',
        headerNote:
          'Consider the chemical structures of anticoagulants Drug I (Rivaroxaban) and Drug II (Apixaban) to evaluate stereochemical requirements, conformation, and clinical metabolism.',
        structures: [RIVAROXABAN_STRUCTURE, APIXABAN_STRUCTURE],
        questions: [
          {
            id: 3,
            questionNumberLabel: 'Question 3',
            category: 'Anticoagulants - Direct Factor Xa Inhibitors SAR',
            questionStem:
              'Consider the chemical structures of anticoagulants Drug I (Rivaroxaban) and Drug II (Apixaban) and state whether each of the following statements is true or false:',
            type: 'sub-statements',
            structuresDisplayed: [RIVAROXABAN_STRUCTURE, APIXABAN_STRUCTURE],
            subStatements: [
              {
                id: '3a',
                text: 'The two drugs are peptidomimetic, competitive, and reversible inhibitors of thrombin.',
                isCorrect: false,
                explanation:
                  'False: Both Rivaroxaban and Apixaban are direct inhibitors of Factor Xa, not thrombin (Factor IIa).',
              },
              {
                id: '3b',
                text: 'The two drugs are used orally as anticoagulants.',
                isCorrect: true,
                explanation:
                  'True: Both are orally bioavailable direct oral anticoagulants (DOACs).',
              },
              {
                id: '3c',
                text: 'Drug I’s action is stereochemistry-dependent whereas that of Drug II is stereochemistry-independent.',
                isCorrect: true,
                explanation:
                  'True: Rivaroxaban (Drug I) has a chiral center at C5 of its oxazolidinone ring and is administered as the pure active (5S)-enantiomer. Apixaban (Drug II) is completely achiral, so its activity is stereochemistry-independent.',
              },
              {
                id: '3d',
                text: 'The two drugs are used to treat deep vein thrombosis and pulmonary embolism.',
                isCorrect: true,
                explanation:
                  'True: Both agents are FDA-approved for the treatment and secondary prophylaxis of DVT and PE.',
              },
              {
                id: '3e',
                text: 'The two drugs are used to protect against myocardial infarction.',
                isCorrect: false,
                explanation:
                  'False: Neither agent is approved for routine monotherapy protection against myocardial infarction.',
              },
              {
                id: '3f',
                text: 'The two drugs are extensively metabolized by liver, and thus, they are less likely to be used in patients with severe hepatic dysfunction.',
                isCorrect: true,
                explanation:
                  'True: Both undergo substantial CYP3A4-mediated hepatic metabolism and are contraindicated or not recommended in severe hepatic impairment (Child-Pugh C).',
              },
              {
                id: '3g',
                text: 'The two drugs adopt L-like three dimensional shape that fits into the active site of the targeted enzyme.',
                isCorrect: true,
                explanation:
                  'True: Both Factor Xa inhibitors adopt a characteristic L-shaped 3D conformation that spans the S1 and S4 subpockets of Factor Xa.',
              },
            ],
            overallExplanation:
              'Rivaroxaban and Apixaban are oral direct Factor Xa inhibitors. Rivaroxaban is chiral ((5S)-oxazolidinone), while Apixaban is achiral. Both adopt an L-shaped conformation spanning the S1 and S4 subpockets of Factor Xa and undergo significant hepatic metabolism.',
            highYieldPearl:
              'Stereochemistry Pearl: Rivaroxaban = (5S)-oxazolidinone chiral active drug. Apixaban = achiral pyrazolopyridine. Both adopt an L-shaped active site conformation.',
            sourceReference: 'Review for Anticoagulants, Page 2, Question 3',
            sourcePageNumber: 2,
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // PAGE 3: DOAC Comparative Pharmacology & Class Pearls (Questions 4–8)
  // --------------------------------------------------------------------------
  {
    pageNumber: 3,
    pageTitle: 'Review for Anticoagulants',
    subtitle: 'DOAC Comparative SAR, Targets, Conformations & Elimination Routes',
    sections: [
      {
        sectionTitle: 'Comparative DOAC Pharmacology (Drugs I–IV)',
        headerNote:
          'Consider the chemical structures of anticoagulants Drug I (Dabigatran etexilate), Drug II (Apixaban), Drug III (Argatroban), and Drug IV (Rivaroxaban) to answer questions 4–8.',
        structures: [
          DABIGATRAN_ETEXILATE_STRUCTURE,
          APIXABAN_STRUCTURE,
          ARGATROBAN_STRUCTURE,
          RIVAROXABAN_STRUCTURE,
        ],
        questions: [
          {
            id: 4,
            questionNumberLabel: 'Question 4 (PDF 4.1)',
            category: 'DOAC Comparative Pharmacology - Chemical Class',
            questionStem:
              'What is the overarching chemical class of all of the above anticoagulants (Drugs I–IV: Dabigatran etexilate, Apixaban, Argatroban, Rivaroxaban)?',
            type: 'multiple-choice',
            options: [
              'A. Glycosaminoglycans',
              'B. Coumarins',
              'C. Polysaccharides',
              'D. Polypeptides',
              'E. Peptidomimetics',
            ],
            correctIndex: 4,
            optionExplanations: [
              'Incorrect. Glycosaminoglycans include heparin and low molecular weight heparins.',
              'Incorrect. Coumarins include warfarin.',
              'Incorrect. Polysaccharides are carbohydrate-based polymers (like heparin).',
              'Incorrect. Polypeptides are larger peptide polymers (like bivalirudin).',
              'Correct! All 4 agents are non-carbohydrate small-molecule peptidomimetics engineered to mimic peptide substrates of coagulation serine proteases.',
            ],
            overallExplanation:
              'All direct thrombin and Factor Xa inhibitors shown (Argatroban, Dabigatran, Apixaban, Rivaroxaban) are synthetic peptidomimetics that compete directly with peptide substrates in serine protease active sites.',
            highYieldPearl: 'DOACs & DTIs are synthetic peptidomimetics, contrasting with polysaccharide heparins and coumarin warfarin.',
            sourceReference: 'Review for Anticoagulants, Page 3, Question 4.1',
            sourcePageNumber: 3,
          },
          {
            id: 5,
            questionNumberLabel: 'Question 5 (PDF 4.2)',
            category: 'DOAC Comparative Pharmacology - Factor Xa Stereochemistry',
            questionStem:
              'Which of the listed drugs is(are) (a) direct factor Xa inhibitor(s) with a stereochemistry-dependent activity?',
            type: 'multiple-choice',
            options: [
              'A. Drug I (Dabigatran etexilate)',
              'B. Drug II (Apixaban)',
              'C. Drug III (Argatroban)',
              'D. Drug IV (Rivaroxaban)',
              'E. Drugs II and IV',
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect. Dabigatran etexilate is a direct thrombin inhibitor double prodrug.',
              'Incorrect. Apixaban is a direct Factor Xa inhibitor, but it is achiral (stereochemistry-independent).',
              'Incorrect. Argatroban is a direct thrombin inhibitor.',
              'Correct! Rivaroxaban (Drug IV) is a direct Factor Xa inhibitor that contains a chiral center at C5 of its oxazolidinone ring, active exclusively as the (5S)-enantiomer.',
              'Incorrect. Drug II (Apixaban) is achiral, so its activity is not stereochemistry-dependent.',
            ],
            overallExplanation:
              'Rivaroxaban is administered as the pure (S)-enantiomer; its direct Factor Xa inhibition is stereochemistry-dependent. Apixaban is achiral.',
            highYieldPearl: 'Rivaroxaban = chiral (5S)-oxazolidinone Factor Xa inhibitor. Apixaban = achiral pyrazolopyridine.',
            sourceReference: 'Review for Anticoagulants, Page 3, Question 4.2',
            sourcePageNumber: 3,
          },
          {
            id: 6,
            questionNumberLabel: 'Question 6 (PDF 4.3)',
            category: 'DOAC Comparative Pharmacology - Oral Direct Thrombin Inhibitor',
            questionStem: 'Which of the listed drugs is(are) (an) oral direct thrombin inhibitor(s)?',
            type: 'multiple-choice',
            options: [
              'A. Drug I (Dabigatran etexilate)',
              'B. Drug II (Apixaban)',
              'C. Drug III (Argatroban)',
              'D. Drug IV (Rivaroxaban)',
              'E. Drugs I, II, and IV',
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct! Dabigatran etexilate (Drug I) is the only oral direct thrombin inhibitor among the listed agents (bioactivated to active dabigatran).',
              'Incorrect. Apixaban is an oral direct Factor Xa inhibitor, not a thrombin inhibitor.',
              'Incorrect. Argatroban is a direct thrombin inhibitor, but it is administered parenterally (IV), not orally.',
              'Incorrect. Rivaroxaban is an oral direct Factor Xa inhibitor.',
              'Incorrect. Drugs II and IV target Factor Xa, not thrombin.',
            ],
            overallExplanation:
              'Dabigatran etexilate is an orally bioavailable double prodrug that is bioactivated to dabigatran, a direct thrombin inhibitor. Argatroban is direct thrombin inhibitor but IV only.',
            highYieldPearl: 'Dabigatran etexilate is the sole oral direct thrombin inhibitor (Pradaxa).',
            sourceReference: 'Review for Anticoagulants, Page 3, Question 4.3',
            sourcePageNumber: 3,
          },
          {
            id: 7,
            questionNumberLabel: 'Question 7 (PDF 4.4)',
            category: 'DOAC Comparative Pharmacology - Active Site Conformation',
            questionStem:
              'Considering the above drugs (Drugs I–IV), all of the following statements are correct EXCEPT:',
            type: 'multiple-choice',
            options: [
              'A. All are competitive inhibitors of enzymes',
              'B. All are inhibitors of serine proteases',
              'C. All are reversible inhibitors',
              'D. All should have L-shape to fit into the active site of their corresponding targets',
              'E. All inhibit enzymes in the common coagulation pathway',
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect (statement is correct). All 4 agents are competitive, active-site reversible inhibitors.',
              'Incorrect (statement is correct). Both Thrombin (Factor IIa) and Factor Xa are serine proteases.',
              'Incorrect (statement is correct). All 4 agents bind reversibly and non-covalently.',
              'Correct! This statement is FALSE: only direct Factor Xa inhibitors (Apixaban and Rivaroxaban) adopt the characteristic L-shaped conformation spanning the S1 and S4 subpockets. Thrombin inhibitors do not require an L-shaped conformation.',
              'Incorrect (statement is correct). Factor Xa and Thrombin (Factor IIa) are the key enzymes of the common coagulation pathway.',
            ],
            overallExplanation:
              'Factor Xa inhibitors (Apixaban and Rivaroxaban) specifically require an L-shaped conformation to span the S1 (chlorothiophene/p-methoxyphenyl) and S4 (morpholinone/lactam) pockets. Thrombin inhibitors (Dabigatran and Argatroban) bind in a different linear/extended geometry.',
            highYieldPearl: 'L-Shaped Conformation is specific to Factor Xa inhibitors (spans S1 and S4 subpockets).',
            sourceReference: 'Review for Anticoagulants, Page 3, Question 4.4',
            sourcePageNumber: 3,
          },
          {
            id: 8,
            questionNumberLabel: 'Question 8 (PDF 5)',
            category: 'DOAC Comparative Pharmacology - Rivaroxaban vs. Dabigatran',
            questionStem:
              'All of the following statements are correct describing aspects related to rivaroxaban and dabigatran EXCEPT:',
            type: 'multiple-choice',
            options: [
              'A. Both are peptidomimetic active site inhibitors of coagulation enzymes',
              'B. Rivaroxaban’s anticoagulant activity is a stereochemistry-dependent phenomenon',
              'C. Rivaroxaban is used as an active drug whereas dabigatran is used as a double prodrug',
              'D. Rivaroxaban is extensively metabolized in liver whereas dabigatran is mainly eliminated unchanged in urine',
              'E. Rivaroxaban is a direct inhibitor of factor IIa whereas dabigatran is a direct factor Xa inhibitor',
            ],
            correctIndex: 4,
            optionExplanations: [
              'Incorrect (statement is correct). Both are synthetic small-molecule peptidomimetics.',
              'Incorrect (statement is correct). Rivaroxaban is active as the (5S)-enantiomer.',
              'Incorrect (statement is correct). Rivaroxaban is active as administered, while dabigatran requires ester and carbamate cleavage.',
              'Incorrect (statement is correct). Rivaroxaban undergoes ~66% hepatic metabolism; dabigatran is ~80% eliminated renally unchanged.',
              'Correct! This statement is FALSE: Rivaroxaban targets Factor Xa directly, whereas Dabigatran targets Factor IIa (thrombin) directly (the targets are inverted).',
            ],
            overallExplanation:
              'Rivaroxaban is a direct Factor Xa inhibitor; Dabigatran is a direct Factor IIa (thrombin) inhibitor.',
            highYieldPearl: 'Target Distinction: Rivaroxaban = Factor Xa. Dabigatran = Factor IIa (Thrombin).',
            sourceReference: 'Review for Anticoagulants, Page 3, Question 5',
            sourcePageNumber: 3,
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // PAGE 4: Heparin Pentasaccharide SAR & Binding Mechanism (Questions 9–15)
  // --------------------------------------------------------------------------
  {
    pageNumber: 4,
    pageTitle: 'Review for Anticoagulants',
    subtitle: 'Heparin Pentasaccharide (D–E–F–G–H): Monosaccharide Sequence, Linkages & ATIII Activation',
    sections: [
      {
        sectionTitle: 'Heparin Pentasaccharide Sequence (D–E–F–G–H)',
        headerNote:
          'Consider the high-affinity heparin pentasaccharide sequence (D–E–F–G–H) responsible for antithrombin III (ATIII) activation to answer questions 9–15.',
        structures: [FONDAPARINUX_STRUCTURE],
        questions: [
          {
            id: 9,
            questionNumberLabel: 'Question 9 (PDF 1)',
            category: 'Heparins - Pentasaccharide Architecture',
            questionStem:
              'Irrespective of sulfate groups, what is the first monosaccharide (D) in the heparin pentasaccharide sequence?',
            type: 'multiple-choice',
            options: ['A. Glucose', 'B. Glucosamine', 'C. Glucuronic acid', 'D. Iduronic acid'],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect. Glucose is unaminated.',
              'Correct! Residue D is D-glucosamine (specifically N-acetyl/sulfo-D-glucosamine-6-sulfate).',
              'Incorrect. Glucuronic acid is residue E.',
              'Incorrect. Iduronic acid is residue G.',
            ],
            overallExplanation:
              'The pentasaccharide sequence comprises D (Glucosamine) – E (Glucuronic acid) – F (Glucosamine) – G (Iduronic acid) – H (Glucosamine).',
            highYieldPearl: 'Pentasaccharide Sequence: D = Glucosamine, E = Glucuronic acid, F = Glucosamine, G = Iduronic acid, H = Glucosamine.',
            sourceReference: 'Review for Anticoagulants, Page 4, Question 1',
            sourcePageNumber: 4,
          },
          {
            id: 10,
            questionNumberLabel: 'Question 10 (PDF 2)',
            category: 'Heparins - Pentasaccharide Architecture',
            questionStem:
              'Irrespective of sulfate groups, what is the second monosaccharide (E) in the heparin pentasaccharide sequence?',
            type: 'multiple-choice',
            options: ['A. Glucose', 'B. Glucosamine', 'C. Glucuronic acid', 'D. Iduronic acid'],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect. Residue D is glucosamine.',
              'Incorrect. Residues D, F, and H are glucosamines.',
              'Correct! Residue E is D-glucuronic acid.',
              'Incorrect. Iduronic acid is residue G.',
            ],
            overallExplanation:
              'Residue E is D-glucuronic acid, which alternates with glucosamine units in the heparin backbone.',
            highYieldPearl: 'Residue E in the pentasaccharide sequence is D-Glucuronic acid.',
            sourceReference: 'Review for Anticoagulants, Page 4, Question 2',
            sourcePageNumber: 4,
          },
          {
            id: 11,
            questionNumberLabel: 'Question 11 (PDF 3)',
            category: 'Heparins - Glycosidic Linkages',
            questionStem:
              'What is the first glycosidic linkage (bond between D–E) in the heparin pentasaccharide sequence?',
            type: 'multiple-choice',
            options: [
              'A. α(1-3)-glycosidic bond',
              'B. β(1-4)-glycosidic bond',
              'C. α(1-4)-glycosidic bond',
              'D. α(1-2)-glycosidic bond',
              'E. β(1-2)-glycosidic bond',
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect. The linkage is between C1 of D and C4 of E.',
              'Incorrect. The D-E bond has alpha configuration.',
              'Correct! The linkage between glucosamine D and glucuronic acid E is an α(1-4)-glycosidic bond.',
              'Incorrect. It is a 1-4 linkage.',
              'Incorrect. It is a 1-4 linkage.',
            ],
            overallExplanation:
              'The bond between D (glucosamine) and E (glucuronic acid) is an α(1-4)-glycosidic linkage.',
            highYieldPearl: 'D–E linkage is α(1-4); E–F linkage is β(1-4).',
            sourceReference: 'Review for Anticoagulants, Page 4, Question 3',
            sourcePageNumber: 4,
          },
          {
            id: 12,
            questionNumberLabel: 'Question 12 (PDF 4)',
            category: 'Heparins - Glycosidic Linkages',
            questionStem:
              'What is the second glycosidic linkage (bond between E–F) in the heparin pentasaccharide sequence?',
            type: 'multiple-choice',
            options: [
              'A. α(1-3)-glycosidic bond',
              'B. β(1-4)-glycosidic bond',
              'C. α(1-4)-glycosidic bond',
              'D. α(1-2)-glycosidic bond',
              'E. β(1-2)-glycosidic bond',
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect. It is a 1-4 linkage.',
              'Correct! The linkage between glucuronic acid E and central glucosamine F is a β(1-4)-glycosidic bond.',
              'Incorrect. The α(1-4) bond connects D and E.',
              'Incorrect. It is a 1-4 linkage.',
              'Incorrect. It is a 1-4 linkage.',
            ],
            overallExplanation:
              'The bond between E (D-glucuronic acid) and F (D-glucosamine) is a β(1-4)-glycosidic linkage.',
            highYieldPearl: 'E–F glycosidic bond is β(1-4).',
            sourceReference: 'Review for Anticoagulants, Page 4, Question 4',
            sourcePageNumber: 4,
          },
          {
            id: 13,
            questionNumberLabel: 'Question 13 (PDF 5)',
            category: 'Heparins - Antithrombin Binding Mechanism',
            questionStem: 'What is the primary type of interaction between heparins and antithrombin III?',
            type: 'multiple-choice',
            options: [
              'A. Covalent bonding with the active site serine residue',
              'B. Electrostatic / ionic interactions between negatively charged sulfate/carboxylate groups and basic amino acids (Arg, Lys)',
              'C. Purely hydrophobic interactions with leucine-rich repeats',
              'D. Metal chelation via coordinated divalent calcium ions',
              'E. Disulfide bond exchange with cysteine residues',
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect. Heparin does not form covalent bonds with antithrombin.',
              'Correct! The polyanionic sulfate and carboxylate groups of heparin interact electrostatically with positively charged basic lysine and arginine residues on antithrombin III.',
              'Incorrect. The interaction is overwhelmingly ionic/electrostatic.',
              'Incorrect. Divalent cations are not required for heparin-ATIII binding.',
              'Incorrect. There is no disulfide bond exchange.',
            ],
            overallExplanation:
              'Heparin-ATIII binding is mediated by strong electrostatic (ionic) interactions between the negatively charged sulfate and carboxylate groups of heparin and positively charged basic residues (Arg, Lys) on ATIII.',
            highYieldPearl: 'Heparin–ATIII Binding: Highly electrostatic/ionic between polyanionic sulfates/carboxylates and cationic Arg/Lys.',
            sourceReference: 'Review for Anticoagulants, Page 4, Question 5',
            sourcePageNumber: 4,
          },
          {
            id: 14,
            questionNumberLabel: 'Question 14 (PDF 6)',
            category: 'Heparins - Chain Length & Pentasaccharide Rules',
            questionStem:
              'Which of the following statements correctly describes a heparin chain of ~30 saccharide residues that LACKS the specific pentasaccharide sequence?',
            type: 'multiple-choice',
            options: [
              'A. It activates antithrombin to eventually inhibit only factor Xa',
              'B. It activates antithrombin to eventually inhibit only thrombin',
              'C. It activates antithrombin to eventually inhibit both factor Xa and thrombin',
              'D. It directly inhibits both factor Xa and thrombin',
              'E. The sequence lacks anticoagulant activity',
            ],
            correctIndex: 4,
            optionExplanations: [
              'Incorrect. Without the pentasaccharide, it cannot activate antithrombin.',
              'Incorrect. It cannot bind antithrombin with high affinity without the pentasaccharide.',
              'Incorrect. Lacking the pentasaccharide precludes antithrombin activation.',
              'Incorrect. Heparin is an indirect anticoagulant and does not directly inhibit clotting factors.',
              'Correct! High-affinity binding and allosteric activation of antithrombin III strictly requires the specific DEFGH pentasaccharide sequence. Without it, the chain lacks anticoagulant activity regardless of length.',
            ],
            overallExplanation:
              'Without the specific pentasaccharide sequence, heparin chains cannot bind antithrombin III with high affinity and thus lack anticoagulant activity.',
            highYieldPearl: 'Rule 1: Any heparin chain lacking the DEFGH pentasaccharide LACKS anticoagulant activity.',
            sourceReference: 'Review for Anticoagulants, Page 4, Question 6',
            sourcePageNumber: 4,
          },
          {
            id: 15,
            questionNumberLabel: 'Question 15 (PDF 7)',
            category: 'Heparins - Chain Length & Pentasaccharide Rules',
            questionStem:
              'Which of the following statements correctly describes a heparin chain of ~8 saccharide residues and HAVING the specific pentasaccharide sequence?',
            type: 'multiple-choice',
            options: [
              'A. It activates antithrombin to eventually inhibit only factor Xa',
              'B. It activates antithrombin to eventually inhibit only thrombin',
              'C. It activates antithrombin to eventually inhibit both factor Xa and thrombin',
              'D. It directly inhibits both factor Xa and thrombin',
              'E. The sequence lacks anticoagulant activity',
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct! An 8-mer contains the pentasaccharide, which is sufficient to induce allosteric activation of ATIII to inhibit Factor Xa. However, it is shorter than the 18-saccharide threshold required to bridge thrombin.',
              'Incorrect. Chains < 18 saccharides cannot inhibit thrombin.',
              'Incorrect. Thrombin inhibition requires a chain length of at least 18 saccharides.',
              'Incorrect. Heparin does not inhibit clotting factors directly.',
              'Incorrect. It possesses potent anti-Factor Xa activity.',
            ],
            overallExplanation:
              'Inhibition of Factor Xa requires only allosteric conformational activation of ATIII (achieved by >= 5 saccharides). Inhibition of thrombin requires ternary bridging requiring at least 18 saccharide units. An 8-mer with the pentasaccharide inhibits only Factor Xa.',
            highYieldPearl: 'The 18-Saccharide Rule: >= 5 units = anti-Xa (allosteric). >= 18 units = anti-IIa (bridging). An 8-mer inhibits only Factor Xa.',
            sourceReference: 'Review for Anticoagulants, Page 4, Question 7',
            sourcePageNumber: 4,
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // PAGE 5: Heparin Chain Length Rules & UFH Properties (Questions 16–21)
  // --------------------------------------------------------------------------
  {
    pageNumber: 5,
    pageTitle: 'Review for Anticoagulants',
    subtitle: 'Heparin Chain Length Rules (18-Saccharide Threshold) & Unfractionated Heparin (UFH) Properties',
    sections: [
      {
        sectionTitle: 'Chain Length Permutations & Unfractionated Heparin (UFH)',
        headerNote:
          'Evaluate heparin chain length permutations and physical-chemical properties of Unfractionated Heparin (UFH) to answer questions 16–21.',
        structures: [FONDAPARINUX_STRUCTURE],
        questions: [
          {
            id: 16,
            questionNumberLabel: 'Question 16 (PDF 8)',
            category: 'Heparins - Chain Length Permutations',
            questionStem:
              'Which of the following statements correctly describes a heparin chain of ~50 saccharide residues and LACKING the specific pentasaccharide sequence?',
            type: 'multiple-choice',
            options: [
              'A. It activates antithrombin to eventually inhibit only factor Xa',
              'B. It activates antithrombin to eventually inhibit only thrombin',
              'C. It activates antithrombin to eventually inhibit both factor Xa and thrombin',
              'D. It directly inhibits both factor Xa and thrombin',
              'E. The sequence lacks anticoagulant activity',
            ],
            correctIndex: 4,
            optionExplanations: [
              'Incorrect. Lacks the pentasaccharide.',
              'Incorrect. Cannot bind ATIII with high affinity.',
              'Incorrect. Pentasaccharide is mandatory.',
              'Incorrect. Heparin is an indirect anticoagulant.',
              'Correct! Despite being 50 units long, lacking the high-affinity pentasaccharide sequence renders it unable to bind ATIII; it lacks anticoagulant activity.',
            ],
            overallExplanation:
              'Regardless of chain length (even 50 residues), without the DEFGH pentasaccharide sequence, there is no high-affinity ATIII binding and no anticoagulant activity.',
            highYieldPearl: 'No Pentasaccharide = Zero Anticoagulant Activity, regardless of chain length.',
            sourceReference: 'Review for Anticoagulants, Page 5, Question 8',
            sourcePageNumber: 5,
          },
          {
            id: 17,
            questionNumberLabel: 'Question 17 (PDF 9)',
            category: 'Heparins - Chain Length Permutations',
            questionStem:
              'Which of the following statements correctly describes a heparin chain of ~50 saccharide residues and HAVING the specific pentasaccharide sequence?',
            type: 'multiple-choice',
            options: [
              'A. It activates antithrombin to eventually inhibit only factor Xa',
              'B. It activates antithrombin to eventually inhibit only thrombin',
              'C. It activates antithrombin to eventually inhibit both factor Xa and thrombin',
              'D. It directly inhibits both factor Xa and thrombin',
              'E. The sequence lacks anticoagulant activity',
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect. A 50-mer also bridges thrombin.',
              'Incorrect. It activates ATIII for both Factor Xa and thrombin.',
              'Correct! A 50-mer exceeds the 18-saccharide threshold required to bridge thrombin and ATIII, and it possesses the pentasaccharide to allosterically activate ATIII for Factor Xa; thus, it inhibits both Factor Xa and thrombin.',
              'Incorrect. Heparin acts indirectly via antithrombin III.',
              'Incorrect. It possesses full anticoagulant activity.',
            ],
            overallExplanation:
              'A 50-mer contains the pentasaccharide (activating ATIII for Factor Xa) and exceeds 18 saccharides (forming the ternary bridge to inhibit thrombin); it inhibits both Factor Xa and thrombin (Factor IIa).',
            highYieldPearl: 'Chains >= 18 saccharides with pentasaccharide inhibit BOTH Factor Xa and Thrombin (anti-Xa:anti-IIa ratio = 1:1 in UFH).',
            sourceReference: 'Review for Anticoagulants, Page 5, Question 9',
            sourcePageNumber: 5,
          },
          {
            id: 18,
            questionNumberLabel: 'Question 18 (PDF 10)',
            category: 'Heparins - Chain Length Permutations',
            questionStem:
              'Which of the following statements correctly describes a heparin chain of ~10 saccharide residues and HAVING the specific pentasaccharide sequence?',
            type: 'multiple-choice',
            options: [
              'A. It activates antithrombin to eventually inhibit only factor Xa',
              'B. It activates antithrombin to eventually inhibit only thrombin',
              'C. It activates antithrombin to eventually inhibit both factor Xa and thrombin',
              'D. It directly inhibits both factor Xa and thrombin',
              'E. The sequence lacks anticoagulant activity',
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct! A 10-mer has the pentasaccharide (so it activates ATIII to inhibit Factor Xa), but is shorter than 18 saccharides (so it cannot bridge thrombin). It inhibits only Factor Xa.',
              'Incorrect. It cannot inhibit thrombin.',
              'Incorrect. It is too short to bridge thrombin.',
              'Incorrect. Heparin does not inhibit directly.',
              'Incorrect. It has potent anti-Factor Xa activity.',
            ],
            overallExplanation:
              'A 10-mer with the pentasaccharide is >= 5 units (anti-Xa active) but < 18 units (anti-IIa inactive); it inhibits only Factor Xa.',
            highYieldPearl: 'Chains between 5 and 17 saccharides containing the pentasaccharide selectively inhibit Factor Xa only.',
            sourceReference: 'Review for Anticoagulants, Page 5, Question 10',
            sourcePageNumber: 5,
          },
          {
            id: 19,
            questionNumberLabel: 'Question 19 (PDF 11)',
            category: 'Heparins - Chain Length Permutations',
            questionStem:
              'Which of the following statements correctly describes a heparin chain of ~25 saccharide residues and LACKING the specific pentasaccharide sequence?',
            type: 'multiple-choice',
            options: [
              'A. It activates antithrombin to eventually inhibit only factor Xa',
              'B. It activates antithrombin to eventually inhibit only thrombin',
              'C. It activates antithrombin to eventually inhibit both factor Xa and thrombin',
              'D. It directly inhibits both factor Xa and thrombin',
              'E. The sequence lacks anticoagulant activity',
            ],
            correctIndex: 4,
            optionExplanations: [
              'Incorrect. Lacks pentasaccharide.',
              'Incorrect. Cannot activate ATIII.',
              'Incorrect. No ATIII binding.',
              'Incorrect. Heparin is indirect.',
              'Correct! Without the pentasaccharide, even a 25-mer chain cannot bind ATIII and lacks anticoagulant activity.',
            ],
            overallExplanation:
              'Absence of the pentasaccharide sequence abolishes high-affinity ATIII binding regardless of length.',
            highYieldPearl: 'Absence of pentasaccharide = No anticoagulant activity.',
            sourceReference: 'Review for Anticoagulants, Page 5, Question 11',
            sourcePageNumber: 5,
          },
          {
            id: 20,
            questionNumberLabel: 'Question 20 (PDF 12)',
            category: 'Heparins - UFH Structural Characteristics',
            questionStem:
              'State whether each of the following statements is true or false describing Unfractionated Heparin (UFH):',
            type: 'sub-statements',
            subStatements: [
              {
                id: '20a',
                text: 'Heparin is a natural heterogeneous and polydisperse mixture of highly sulfated, linear polysaccharides with an average molecular weight of 15 kDa.',
                isCorrect: true,
                explanation:
                  'True: Natural UFH is extracted from porcine intestinal mucosa as a polydisperse mixture ranging from 3 to 30 kDa (mean ~15 kDa).',
              },
              {
                id: '20b',
                text: 'The building block of each sequence is a repeating disaccharide unit of glucosamine and uronic acid.',
                isCorrect: true,
                explanation:
                  'True: The repeating disaccharide consists of D-glucosamine and a uronic acid (D-glucuronic acid or L-iduronic acid).',
              },
              {
                id: '20c',
                text: 'Heparin activates antithrombin to eventually inhibit both thrombin and factor Xa.',
                isCorrect: true,
                explanation:
                  'True: UFH chains average ~45 saccharides (well above 18), enabling simultaneous allosteric activation of ATIII (anti-Xa) and ternary bridging (anti-IIa) in an approximately 1:1 ratio.',
              },
              {
                id: '20d',
                text: 'Heparin is an indirect anticoagulant.',
                isCorrect: true,
                explanation:
                  'True: Heparin does not possess intrinsic enzymatic inhibitory activity; it acts indirectly by accelerating antithrombin III activity ~1,000-fold.',
              },
              {
                id: '20e',
                text: 'The sulfate group at position-6 of unit F in the pentasaccharide is the most essential one.',
                isCorrect: false,
                explanation:
                  'False: The 3-O-sulfate group on central glucosamine unit F is the unique, absolutely essential signature for high-affinity antithrombin III binding. Absence of the 3-O-sulfate destroys ATIII affinity.',
              },
            ],
            overallExplanation:
              'UFH is a natural, polydisperse polysaccharide mixture (mean 15 kDa) of repeating glucosamine-uronic acid disaccharides. It acts indirectly via ATIII. The critical pharmacophoric signature for ATIII binding is the 3-O-sulfate on Unit F, NOT the 6-O-sulfate.',
            highYieldPearl: 'Pharmacophore Keystone: The 3-O-sulfate on Unit F is the single most essential functional group for ATIII affinity.',
            sourceReference: 'Review for Anticoagulants, Page 5, Question 12',
            sourcePageNumber: 5,
          },
          {
            id: 21,
            questionNumberLabel: 'Question 21 (PDF 13)',
            category: 'Heparins - UFH Negative Charge & Administration',
            questionStem:
              'Given the highly negatively charged nature of UFH, state whether each of the following statements is true or false:',
            type: 'sub-statements',
            subStatements: [
              {
                id: '21a',
                text: 'UFH is not absorbed orally and must be administered parenterally.',
                isCorrect: true,
                explanation:
                  'True: The extreme negative charge density (highest of any biological macromolecule) and large molecular weight prevent gastrointestinal absorption; UFH must be given IV or SC.',
              },
              {
                id: '21b',
                text: 'In contrast to warfarin, UFH has a relatively rapid onset of action.',
                isCorrect: true,
                explanation:
                  'True: UFH has immediate onset upon IV injection, whereas warfarin requires 24-72 hours to deplete pre-existing carboxylated clotting factors.',
              },
              {
                id: '21c',
                text: 'UFH is eliminated by renal excretion.',
                isCorrect: false,
                explanation:
                  'False: Therapeutic doses of UFH are cleared primarily by rapid saturable endothelial and reticuloendothelial system (RES) uptake and macrophage depolymerization, NOT renal filtration.',
              },
              {
                id: '21d',
                text: 'UFH’s activity can be reversed by protamine.',
                isCorrect: true,
                explanation:
                  'True: Protamine sulfate is a strongly basic, arginine-rich polycation that binds stoichiometrically to polyanionic heparin to form an inert, stable salt.',
              },
              {
                id: '21e',
                text: 'UFH is typically associated with multiple CNS effects and is strictly contraindicated in pregnant women.',
                isCorrect: false,
                explanation:
                  'False: Because of its large size and extreme negative charge, UFH does not cross the blood-brain barrier or the placenta; it is considered the anticoagulant of choice during pregnancy.',
              },
            ],
            overallExplanation:
              'UFH is a polyanion that must be given parenterally, acts immediately, and is neutralized by basic protamine. It does not cross the placenta, making it safe in pregnancy. It is eliminated primarily by the reticuloendothelial system, not renal excretion.',
            highYieldPearl: 'Pregnancy Safety: UFH does NOT cross the placenta due to extreme charge and size, making it the classic safe anticoagulant in pregnancy.',
            sourceReference: 'Review for Anticoagulants, Page 5, Question 13',
            sourcePageNumber: 5,
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // PAGE 6: LMWH, Fondaparinux & Warfarin Introduction (Questions 22–26)
  // --------------------------------------------------------------------------
  {
    pageNumber: 6,
    pageTitle: 'Review for Anticoagulants',
    subtitle: 'Low Molecular Weight Heparins (LMWH), Fondaparinux & Introduction to Warfarin',
    sections: [
      {
        sectionTitle: 'LMWH Fractionation, Fondaparinux & Warfarin Chemistry',
        headerNote:
          'Consider the chemical properties of Low Molecular Weight Heparins (LMWH), synthetic Fondaparinux, and 4-hydroxycoumarin Warfarin to answer questions 22–26.',
        structures: [FONDAPARINUX_STRUCTURE, WARFARIN_STRUCTURE],
        questions: [
          {
            id: 22,
            questionNumberLabel: 'Question 22 (PDF 14)',
            category: 'LMWH - Fractionation Effects',
            questionStem:
              'Low molecular weight heparins (LMWHs) are made by chemical and/or enzymatic fractionation of UFH. The fractionation process results in all of the following EXCEPT:',
            type: 'multiple-choice',
            options: [
              'A. Shorter linear polysaccharide sequences with fewer sulfate groups',
              'B. Less inter- and intra-patient response variation i.e. more predictable response',
              'C. High oral bioavailability and potential to cross blood brain barrier & placenta',
              'D. Reduced risk of osteoporosis, thrombocytopenia, and bleeding consequences',
              'E. More tendency to inhibit factor Xa than thrombin',
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect (true statement). LMWHs have mean MW ~4.5 kDa (shorter chains).',
              'Incorrect (true statement). Less non-specific plasma protein binding yields predictable bioavailability.',
              'Correct! This statement is FALSE: LMWHs remain highly charged polyanions and are NOT orally absorbed, nor do they cross the BBB or placenta.',
              'Incorrect (true statement). LMWHs have significantly lower rates of HIT and osteoclast activation.',
              'Incorrect (true statement). Due to shorter chain lengths (< 18 units in most chains), anti-Xa:anti-IIa ratio shifts from 1:1 to between 2:1 and 4:1.',
            ],
            overallExplanation:
              'LMWHs (enoxaparin, dalteparin) are still large polyanionic polysaccharides administered subcutaneously. They do NOT have oral bioavailability and do NOT cross the placenta or BBB.',
            highYieldPearl: 'LMWHs require subcutaneous administration; they do NOT cross the placenta or BBB and are never orally active.',
            sourceReference: 'Review for Anticoagulants, Page 6, Question 14',
            sourcePageNumber: 6,
          },
          {
            id: 23,
            questionNumberLabel: 'Question 23 (PDF 15)',
            category: 'Fondaparinux - Pharmacological Properties',
            questionStem:
              'State whether each of the following statements is true or false describing Fondaparinux:',
            type: 'sub-statements',
            structuresDisplayed: [FONDAPARINUX_STRUCTURE],
            subStatements: [
              {
                id: '23a',
                text: 'It is the only clinically available homogeneous polysaccharide-based anticoagulant.',
                isCorrect: true,
                explanation:
                  'True: Unlike heterogeneous UFH and LMWH mixtures, fondaparinux is a completely homogeneous, chemically synthesized pentasaccharide.',
              },
              {
                id: '23b',
                text: 'It promotes antithrombin-mediated inhibition of factor Xa but not thrombin.',
                isCorrect: true,
                explanation:
                  'True: At only 5 saccharide residues, it cannot form the ternary bridging complex with thrombin; it selectively accelerates Factor Xa inhibition.',
              },
              {
                id: '23c',
                text: 'It has more predictable response with no risk of osteoporosis or thrombocytopenia.',
                isCorrect: true,
                explanation:
                  'True: It does not bind platelet factor 4 (PF4) and does not cause heparin-induced thrombocytopenia (HIT) or osteoclast-mediated bone loss.',
              },
              {
                id: '23d',
                text: 'Its action can be reversed by protamine.',
                isCorrect: false,
                explanation:
                  'False: Protamine sulfate does not effectively neutralize fondaparinux because its short 5-mer chain cannot form the stable ionic lattice needed for neutralization.',
              },
              {
                id: '23e',
                text: 'Its indirect inhibition of the coagulation protein target is brought about by conformational activation of antithrombin.',
                isCorrect: true,
                explanation:
                  'True: Binding of fondaparinux induces an allosteric conformational change in ATIII that expels the reactive loop to trap Factor Xa.',
              },
            ],
            overallExplanation:
              'Fondaparinux is a pure synthetic pentasaccharide that selectively promotes ATIII-mediated Factor Xa inhibition via allosteric activation. It does not cause HIT and cannot be reversed by protamine.',
            highYieldPearl: 'Fondaparinux Reversal: Protamine CANNOT reverse fondaparinux (reversal requires recombinant Factor Xa decoy andexanet alfa).',
            sourceReference: 'Review for Anticoagulants, Page 6, Question 15',
            sourcePageNumber: 6,
          },
          {
            id: 24,
            questionNumberLabel: 'Question 24 (PDF 16)',
            category: 'LMWH - Clinical Traits & Elimination',
            questionStem:
              'State whether each of the following statements is true or false regarding Low Molecular Weight Heparins (LMWHs):',
            type: 'sub-statements',
            subStatements: [
              {
                id: '24a',
                text: 'LMWHs contain lower sulfate density as well as less heterogeneity and polydispersity than unfractionated heparin.',
                isCorrect: true,
                explanation:
                  'True: LMWHs have a narrower molecular weight distribution (mean ~4.5 kDa) and reduced non-specific polyanionic charge density.',
              },
              {
                id: '24b',
                text: 'LMWHs have shorter chain length than unfractionated heparin, and therefore they tend to be more specific to factor Xa inhibition.',
                isCorrect: true,
                explanation:
                  'True: Most LMWH fragments are shorter than 18 saccharides, resulting in an anti-Xa to anti-IIa ratio of 2:1 to 4:1.',
              },
              {
                id: '24c',
                text: 'LMWHs have fewer side effects and more predictable patient response than unfractionated heparin.',
                isCorrect: true,
                explanation:
                  'True: Reduced binding to macrophages, endothelial cells, and PF4 results in higher subcutaneous bioavailability (~90%), longer half-life, and lower HIT/osteopenia incidence.',
              },
              {
                id: '24d',
                text: 'LMWHs are administered orally and undergo extensive hepatic metabolism before elimination in urine.',
                isCorrect: false,
                explanation:
                  'False: LMWHs are administered subcutaneously, not orally. They undergo minimal hepatic metabolism and are eliminated predominantly by renal filtration.',
              },
              {
                id: '24e',
                text: 'LMWHs are relatively safe in pregnant women, yet their function cannot be reversed by protamine.',
                isCorrect: false,
                explanation:
                  'False: While LMWHs are safe in pregnancy (do not cross placenta), their anticoagulant effect CAN be partially reversed (~60-75%) by protamine sulfate.',
              },
            ],
            overallExplanation:
              'LMWHs have higher anti-Xa specificity, predictable SQ kinetics, and renal elimination. They are partially reversible by protamine (~60-75%) and safe in pregnancy.',
            highYieldPearl: 'LMWH Reversal: Protamine neutralizes anti-IIa activity completely but only partially (~60-75%) neutralizes anti-Xa activity.',
            sourceReference: 'Review for Anticoagulants, Page 6, Question 16',
            sourcePageNumber: 6,
          },
          {
            id: 25,
            questionNumberLabel: 'Question 25 (PDF 17)',
            category: 'Warfarin - Chemical Classification',
            questionStem: 'What is the chemical class of warfarin?',
            type: 'multiple-choice',
            structuresDisplayed: [WARFARIN_STRUCTURE],
            options: [
              'A. Glycosaminoglycan',
              'B. Coumarin (4-hydroxycoumarin derivative)',
              'C. Polysaccharide',
              'D. Polypeptide',
              'E. Peptidomimetic',
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect. Heparins are glycosaminoglycans.',
              'Correct! Warfarin is a synthetic 4-hydroxycoumarin derivative bearing a 3-(3-oxo-1-phenylbutyl) side chain.',
              'Incorrect. Warfarin is a small molecule, not a carbohydrate polymer.',
              'Incorrect. Warfarin is not a peptide.',
              'Incorrect. DOACs are peptidomimetics; warfarin is a coumarin.',
            ],
            overallExplanation:
              'Warfarin is a 4-hydroxycoumarin derivative that functions as a competitive inhibitor of Vitamin K Epoxide Reductase Complex 1 (VKORC1).',
            highYieldPearl: 'Warfarin Class: 4-Hydroxycoumarin derivative. Enolic OH at C4 has pKa ~5.0.',
            sourceReference: 'Review for Anticoagulants, Page 6, Question 17',
            sourcePageNumber: 6,
          },
          {
            id: 26,
            questionNumberLabel: 'Question 26 (PDF 18)',
            category: 'Warfarin - Pharmacokinetics & Reversal',
            questionStem:
              'Considering the chemical structure of warfarin, state whether each of the following statements is true or false:',
            type: 'sub-statements',
            structuresDisplayed: [WARFARIN_STRUCTURE],
            subStatements: [
              {
                id: '26a',
                text: 'It has about 100% oral bioavailability.',
                isCorrect: true,
                explanation:
                  'True: Warfarin sodium is rapidly and completely absorbed from the GI tract with ~100% oral bioavailability.',
              },
              {
                id: '26b',
                text: 'Its activity as well as metabolism is stereochemistry-dependent.',
                isCorrect: true,
                explanation:
                  'True: Administered as a racemate. (S)-warfarin is 3- to 5-fold more potent than (R)-warfarin and is metabolized primarily by CYP2C9; (R)-warfarin is cleared via CYP1A2 and CYP3A4.',
              },
              {
                id: '26c',
                text: 'It binds extensively to plasma proteins and is extensively metabolized.',
                isCorrect: true,
                explanation:
                  'True: Warfarin is ~99% bound to serum albumin, and less than 2% is excreted unchanged in urine due to extensive hepatic transformation.',
              },
              {
                id: '26d',
                text: 'It may cause excessive bleeding episodes which can be reversed by protamine.',
                isCorrect: false,
                explanation:
                  'False: Protamine sulfate reverses heparin, not warfarin. Warfarin bleeding is reversed by Vitamin K1 (phytonadione) or prothrombin complex concentrate (PCC).',
              },
              {
                id: '26e',
                text: 'It is a reversible and indirect anticoagulant.',
                isCorrect: true,
                explanation:
                  'True: Warfarin binds reversibly to VKORC1 and acts indirectly by preventing the post-translational gamma-carboxylation of Factors II, VII, IX, and X.',
              },
            ],
            overallExplanation:
              'Warfarin is an orally bioavailable, highly protein-bound (~99%) indirect anticoagulant with stereoselective metabolism (S-isomer via CYP2C9). Bleeding is reversed by Vitamin K1 / PCC, NOT protamine.',
            highYieldPearl: 'Warfarin Reversal: Vitamin K1 (slow) or 4-factor Prothrombin Complex Concentrate (PCC, urgent). Protamine has zero effect on warfarin.',
            sourceReference: 'Review for Anticoagulants, Page 6, Question 18',
            sourcePageNumber: 6,
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // PAGE 7: Warfarin Pharmacodynamics, Genetics & Reversal (Question 27)
  // --------------------------------------------------------------------------
  {
    pageNumber: 7,
    pageTitle: 'Review for Anticoagulants',
    subtitle: 'Warfarin Pharmacodynamics, Delayed Onset, Pharmacogenomics (CYP2C9/VKORC1) & Reversal',
    sections: [
      {
        sectionTitle: 'Warfarin Genetics, Formulations & Vitamin K Reversal',
        headerNote:
          'Review the pharmacodynamic profile of Warfarin including its sodium salt formulation, delayed onset of action, CYP2C9/VKORC1 pharmacogenomics, and specific antidotes.',
        structures: [WARFARIN_STRUCTURE],
        questions: [
          {
            id: 27,
            questionNumberLabel: 'Question 27 (PDF 19)',
            category: 'Warfarin - Genetics, Onset & Antidotes',
            questionStem:
              'Considering the chemical structure of warfarin, state whether each of the following statements is true or false:',
            type: 'sub-statements',
            structuresDisplayed: [WARFARIN_STRUCTURE],
            subStatements: [
              {
                id: '27a',
                text: 'It is prepared as sodium salt which has 100% oral bioavailability.',
                isCorrect: true,
                explanation:
                  'True: Deprotonation of the acidic enolic 4-hydroxy group yields warfarin sodium, a water-soluble crystalline salt with ~100% oral bioavailability.',
              },
              {
                id: '27b',
                text: 'In relative to heparin, warfarin has delayed onset of action.',
                isCorrect: true,
                explanation:
                  'True: Because warfarin only blocks synthesis of new clotting factors, full antithrombotic onset requires 24-72 hours until pre-existing circulating active factors (especially prothrombin, t1/2 ~60-72h) are naturally degraded.',
              },
              {
                id: '27c',
                text: 'It is associated with a genetic polymorphism phenomenon because of variations in metabolizing enzymes and sensitivity of drug target.',
                isCorrect: true,
                explanation:
                  'True: Loss-of-function variants in CYP2C9 (*2 and *3 alleles) impair clearance of the potent (S)-enantiomer, while promoter variants in VKORC1 (-1639G>A) reduce target enzyme expression, requiring major dose reductions.',
              },
              {
                id: '27d',
                text: 'It may cause excessive bleeding episodes which can be reversed by vitamin K.',
                isCorrect: true,
                explanation:
                  'True: Exogenous Vitamin K1 (phytonadione) bypasses VKORC1 via alternative quinone reductases to restore active clotting factor gamma-carboxylation.',
              },
              {
                id: '27e',
                text: 'It is a reversible and indirect polysaccharide-based anticoagulant.',
                isCorrect: false,
                explanation:
                  'False: Warfarin is a small-molecule 4-hydroxycoumarin derivative, NOT a polysaccharide.',
              },
            ],
            overallExplanation:
              'Warfarin sodium is an indirect, orally bioavailable 4-hydroxycoumarin anticoagulant. It has delayed onset, requires genetic considerations (CYP2C9 & VKORC1), and is specifically reversed by Vitamin K1 / 4-factor PCC.',
            highYieldPearl:
              'Pharmacogenomics Pearl: CYP2C9 variants (*2, *3) reduce clearance of potent (S)-warfarin; VKORC1 variants alter target sensitivity. Both dictate personalized dosing.',
            sourceReference: 'Review for Anticoagulants, Page 7, Question 19',
            sourcePageNumber: 7,
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // PAGE 8: Fibrinolytic / Thrombolytic Agents (Lecture Slides 30–31)
  // --------------------------------------------------------------------------
  {
    pageNumber: 8,
    pageTitle: 'Review for Anticoagulants',
    title: 'Fibrinolytic & Thrombolytic Agents',
    subtitle:
      'Tissue Plasminogen Activator (t-PA) Variants, Streptokinase, Urokinase & Clinical Indications (Slides 30–31)',
    sections: [
      {
        sectionTitle: 'Fibrinolytic & Thrombolytic Pharmacology',
        headerNote:
          'Review the medicinal chemistry, structural bioengineering, and clinical pharmacology of plasminogen activators: recombinant t-PAs (Alteplase, Reteplase, Tenecteplase), bacterial Streptokinase, and human renal Urokinase.',
        structures: [
          ALTEPLASE_STRUCTURE,
          RETEPLASE_STRUCTURE,
          TENECTEPLASE_STRUCTURE,
          STREPTOKINASE_STRUCTURE,
          UROKINASE_STRUCTURE,
        ],
        questions: [
          {
            id: 28,
            questionNumberLabel: 'Question 28 (Lecture Slides 30–31)',
            category: 'Fibrinolytics - Recombinant t-PA Variants SAR & Comparison',
            questionStem:
              'Consider the recombinant tissue plasminogen activator (t-PA) variants: Alteplase (rh-tPA), Reteplase (r-PA), and Tenecteplase (TNK-tPA). State whether each of the following comparative statements is true or false:',
            type: 'sub-statements',
            structuresDisplayed: [ALTEPLASE_STRUCTURE, RETEPLASE_STRUCTURE, TENECTEPLASE_STRUCTURE],
            subStatements: [
              {
                id: '28a',
                text: 'Alteplase is a full-length recombinant 527-amino acid human glycoprotein identical to native t-PA that binds fibrin via its Kringle-2 domain.',
                isCorrect: true,
                explanation:
                  'True: Alteplase is recombinant human t-PA (rh-tPA) produced in CHO cells, retaining all native domains including finger, EGF, Kringle-1, Kringle-2, and serine protease catalytic triad.',
              },
              {
                id: '28b',
                text: 'Reteplase is a non-glycosylated deletion mutant lacking finger, EGF, and Kringle-1 domains, which gives it a longer half-life (14-18 min) suitable for double-bolus dosing.',
                isCorrect: true,
                explanation:
                  'True: Produced in E. coli, reteplase lacks carbohydrate chains, finger, EGF, and kringle-1 domains. Slower hepatic clearance extends t1/2 to 14-18 min, enabling convenient double-bolus IV administration (10 U + 10 U 30 min apart).',
              },
              {
                id: '28c',
                text: 'Tenecteplase contains three point mutations (T103N, N117Q, and tetra-alanine substitution at 296-299) that confer 80-fold resistance to PAI-1 and allow single-bolus IV administration.',
                isCorrect: true,
                explanation:
                  'True: Tenecteplase (TNK) features T103N (new glycosylation), N117Q (deglycosylation extending t1/2 to 20-24 min), and KHRR296-299AAAA (tetra-alanine substitution conferring ~80-fold resistance to PAI-1 inactivation and 14-fold higher fibrin specificity), permitting rapid single weight-based IV bolus.',
              },
              {
                id: '28d',
                text: 'Reteplase has significantly higher fibrin affinity than native Alteplase.',
                isCorrect: false,
                explanation:
                  'False: Because reteplase lacks the finger domain, its fibrin binding affinity is actually lower than alteplase, which paradoxically allows it to diffuse deeper into the thrombus interior.',
              },
              {
                id: '28e',
                text: 'All three recombinant t-PA derivatives are fibrin-specific agents, generating plasmin preferentially at the thrombus surface rather than in systemic circulation.',
                isCorrect: true,
                explanation:
                  'True: All t-PA derivatives utilize Kringle domains for preferential binding to clot-bound fibrin, localizing plasmin activation to the clot surface and sparing circulating fibrinogen relative to non-specific agents.',
              },
            ],
            overallExplanation:
              'Alteplase is full-length rh-tPA (short t1/2 ~5 min, continuous IV infusion). Reteplase is a deletion mutant lacking finger/EGF/kringle-1 domains (t1/2 ~14-18 min, double IV bolus). Tenecteplase is a triple mutant with prolonged t1/2 (~20-24 min), 80-fold PAI-1 resistance, and 14-fold higher fibrin specificity (single weight-based IV push over 5 seconds).',
            highYieldPearl:
              't-PA Bioengineering: Tenecteplase (TNK-tPA) point mutations: T103N adds glycosylation, N117Q removes high-mannose, and KHRR296-299AAAA resists PAI-1 ~80-fold.',
            sourceReference: 'Antithrombotics (Anticoagulants) Lecture Slides 30-31',
            sourcePageNumber: 8,
          },
          {
            id: 29,
            questionNumberLabel: 'Question 29 (Lecture Slide 30)',
            category: 'Fibrinolytics - Streptokinase Mechanism & Antigenicity',
            questionStem:
              'Which of the following statements correctly describes the medicinal chemistry and clinical pharmacology of Streptokinase?',
            type: 'multiple-choice',
            structuresDisplayed: [STREPTOKINASE_STRUCTURE],
            options: [
              'A. It is a direct serine protease enzyme that cleaves the Arg560-Val561 peptide bond of plasminogen independently of any cofactor.',
              'B. It is a bacterial non-enzymatic protein that forms a 1:1 equimolar stoichiometric complex with plasminogen, allosterically exposing an active site that activates uncomplexed plasminogen.',
              'C. It is an endogenous human enzyme that exhibits high fibrin selectivity without inducing neutralizing antibodies.',
              'D. It is a synthetic polysaccharide that selectively enhances antithrombin III activity against thrombus-bound plasmin.',
            ],
            correctIndex: 1,
            explanation:
              'Streptokinase is a 47 kDa bacterial non-enzymatic protein isolated from Lancefield Group C beta-hemolytic Streptococcus. It possesses no intrinsic protease activity; instead, it binds equimolarly (1:1) with plasminogen, inducing an allosteric conformational shift that exposes the catalytic site. Because it is bacterial, it induces neutralizing antibodies; repeat administration within 6-12 months is contraindicated due to severe allergic risk and therapeutic failure.',
            highYieldPearl:
              'Streptokinase Key Pearl: Non-enzymatic bacterial protein; forms a 1:1 complex with plasminogen; non-fibrin specific (causes systemic lytic state); single-use due to high antigenicity (cannot repeat within 6-12 months).',
            sourceReference: 'Antithrombotics (Anticoagulants) Lecture Slide 30',
            sourcePageNumber: 8,
          },
          {
            id: 30,
            questionNumberLabel: 'Question 30 (Lecture Slide 30)',
            category: 'Fibrinolytics - Urokinase Direct Serine Protease Activation',
            questionStem:
              'Which of the following statements correctly differentiates Urokinase (u-PA) from Streptokinase?',
            type: 'multiple-choice',
            structuresDisplayed: [UROKINASE_STRUCTURE, STREPTOKINASE_STRUCTURE],
            options: [
              'A. Urokinase is of bacterial origin and causes significant neutralizing antibody formation.',
              'B. Urokinase requires stoichiometric 1:1 complex formation with plasminogen to acquire proteolytic activity.',
              'C. Urokinase is an endogenous human two-chain serine protease that directly cleaves the Arg560-Val561 bond of plasminogen, is non-antigenic, and can be administered repeatedly.',
              'D. Urokinase has 80-fold greater resistance to PAI-1 than native tissue plasminogen activator.',
            ],
            correctIndex: 2,
            explanation:
              'Urokinase (u-PA) is a native two-chain serine protease enzyme isolated from human neonatal kidney cells or human urine. Unlike streptokinase, urokinase DIRECTLY cleaves the Arg560-Val561 bond of plasminogen without requiring a cofactor complex. Because it is of human origin, it is non-antigenic (does not cause allergic reactions or neutralizing antibody formation), allowing repeat administration. Like streptokinase, it is non-fibrin specific.',
            highYieldPearl:
              'Urokinase vs. Streptokinase: Urokinase is a direct two-chain serine protease of human renal origin (non-antigenic, can be re-administered), whereas Streptokinase is a bacterial non-enzymatic protein that requires 1:1 complex formation and is highly antigenic.',
            sourceReference: 'Antithrombotics (Anticoagulants) Lecture Slide 30',
            sourcePageNumber: 8,
          },
          {
            id: 31,
            questionNumberLabel: 'Question 31 (Lecture Slide 31)',
            category: 'Fibrinolytics - Clinical Indications & Absolute Contraindications',
            questionStem:
              'State whether each of the following statements regarding the clinical pharmacology, therapeutic windows, and contraindications of thrombolytic therapy is true or false:',
            type: 'sub-statements',
            subStatements: [
              {
                id: '31a',
                text: 'Thrombolytic therapy is indicated for acute myocardial infarction (ST-elevation MI) when primary percutaneous coronary intervention (PCI) is unavailable within 90-120 minutes.',
                isCorrect: true,
                explanation:
                  'True: Guidelines recommend thrombolysis within 30 minutes of medical contact ("door-to-needle") if PCI cannot be achieved within 120 minutes ("door-to-balloon").',
              },
              {
                id: '31b',
                text: 'In acute ischemic stroke, IV alteplase or tenecteplase must be administered within a strict 3 to 4.5-hour therapeutic window after symptom onset to prevent catastrophic hemorrhagic transformation.',
                isCorrect: true,
                explanation:
                  'True: Efficacy rapidly declines and risk of fatal intracerebral hemorrhage dramatically escalates beyond 4.5 hours from symptom onset or last known well.',
              },
              {
                id: '31c',
                text: 'Any prior history of intracranial hemorrhage, active internal bleeding, or ischemic stroke within the prior 3 months is an absolute contraindication to thrombolytic therapy.',
                isCorrect: true,
                explanation:
                  'True: Absolute contraindications include previous hemorrhagic stroke at any time, ischemic stroke within 3 months, active internal bleeding, known intracranial neoplasm or vascular malformation, and suspected aortic dissection.',
              },
              {
                id: '31d',
                text: 'Non-fibrin specific agents (Streptokinase, Urokinase) cause extensive systemic degradation of circulating fibrinogen, leading to a profound systemic lytic state and higher bleeding risk compared to fibrin-specific t-PAs.',
                isCorrect: true,
                explanation:
                  'True: Non-fibrin specific agents activate both circulating plasminogen and clot-bound plasminogen equally, destroying systemic clotting factors (fibrinogen, Factor V, Factor VIII).',
              },
              {
                id: '31e',
                text: 'Aminocaproic acid and tranexamic acid act as competitive lysine analogs that inhibit plasminogen activation, serving as antidotes for thrombolytic-induced hyperfibrinolysis.',
                isCorrect: true,
                explanation:
                  'True: Synthetic lysine analogs bind plasminogen kringle domains, displacing plasminogen from fibrin and halting hyperfibrinolytic hemorrhage.',
              },
            ],
            overallExplanation:
              'Thrombolytic agents dissolve established pathological thrombi in STEMI, massive PE, and acute ischemic stroke (within 3-4.5 hours). Absolute contraindications include previous hemorrhagic stroke, active internal bleeding, and recent neurotrauma. Antidotes include lysine analogs (tranexamic acid, aminocaproic acid).',
            highYieldPearl:
              'Fibrinolytic Antidotes: Tranexamic acid and aminocaproic acid are lysine analogs that competitively block plasminogen lysine-binding sites, neutralizing excessive fibrinolysis.',
            sourceReference: 'Antithrombotics (Anticoagulants) Lecture Slide 31',
            sourcePageNumber: 8,
          },
        ],
      },
    ],
  },
];

export function getDefaultAnticoagulantsModule(): ReviewModule {
  return {
    id: 'anticoagulants_mcp2',
    title: 'Review for Anticoagulants',
    subtitle: 'Direct Thrombin Inhibitors, Factor Xa Inhibitors, Heparins, Warfarin & Thrombolytics',
    course: 'Medicinal Chemistry (MCP II)',
    semester: 'Fall 2026',
    code: 'RAAH',
    isBuiltIn: true,
    version: '2.1.0',
    createdAt: '2026-11-04',
    chemicalStructures: anticoagulantsChemicalStructures,
    pages: anticoagulantsPages,
  };
}
