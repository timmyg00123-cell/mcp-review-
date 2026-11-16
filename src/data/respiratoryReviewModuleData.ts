import type {
  ReviewModule,
  ReviewPage,
  ChemicalStructure,
  ReviewSection,
  AntiplateletQuestion,
  MatchingTarget,
  SubStatement,
  RankingItem,
} from '../types/reviewModule';

// =============================================================================
// LANDMARK CHEMICAL STRUCTURES FOR RESPIRATORY DRUGS REVIEW (Exam 1)
// Audited with PubChem PUG REST identifiers, canonical SMILES, MW, LogP & SAR
// Grounded strictly in Dr. Rami A. Al-Horani's Fall 2026 Medicinal Chemistry lecture
// =============================================================================

export const EPINEPHRINE_STRUCTURE: ChemicalStructure = {
  id: 'epinephrine',
  document_label: 'Epinephrine (Adrenaline)',
  name: 'Epinephrine',
  tradeName: 'Adrenalin / EpiPen',
  smiles: 'CNC[C@H](O)c1ccc(O)c(O)c1',
  canonical_smiles: 'CNC[C@H](O)c1ccc(O)c(O)c1',
  canonicalSmiles: 'CNC[C@H](O)c1ccc(O)c(O)c1',
  cid: 5816,
  mw: 183.20,
  logP: -1.4,
  chemicalClass: 'Catecholamine / Arylethanolamine',
  pharmacologicalClass: 'Nonselective Alpha and Beta Adrenergic Agonist',
  target: 'Alpha-1, Alpha-2, Beta-1, Beta-2 Adrenoceptors',
  target_receptor: 'Adrenergic GPCRs (Gq, Gi, Gs)',
  reversibility: 'Reversible Agonist',
  drug_state: 'Active drug',
  route: 'IM / IV / Subcutaneous / Inhalation',
  keyFunctionalGroups: [
    '3,4-Dihydroxybenzene (catechol ring)',
    '(R)-beta-hydroxyl group',
    'Secondary methylamino group',
    '2-Carbon ethyl linker',
  ],
  pkPdHighlights: {
    onset: '1-2 minutes (IM/IV)',
    duration: '1-2 hours',
    halfLife: '<5 minutes',
    elimination: 'Rapid enzymatic degradation via COMT (3-O-methylation) and MAO (oxidative deamination)',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Prototypical endogenous catecholamine with an (R)-beta-hydroxyl group essential for high-affinity 3-point receptor binding (Easson-Stedman hypothesis). The small N-methyl substituent allows binding to both alpha and beta adrenoceptors without subtype selectivity. Highly susceptible to rapid COMT and MAO metabolism and auto-oxidation to adrenochrome.',
  moa_summary:
    'Nonselectively stimulates alpha and beta adrenergic receptors, producing bronchial smooth muscle relaxation (beta-2/cAMP), vasoconstriction (alpha-1), and myocardial stimulation (beta-1).',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/5816/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5816',
};

export const NOREPINEPHRINE_STRUCTURE: ChemicalStructure = {
  id: 'norepinephrine',
  document_label: 'Structure VII (Norepinephrine)',
  name: 'Norepinephrine',
  tradeName: 'Levophed',
  smiles: 'NC[C@H](O)c1ccc(O)c(O)c1',
  canonical_smiles: 'NC[C@H](O)c1ccc(O)c(O)c1',
  canonicalSmiles: 'NC[C@H](O)c1ccc(O)c(O)c1',
  cid: 439260,
  mw: 169.18,
  logP: -1.2,
  chemicalClass: 'Catecholamine / Arylethanolamine',
  pharmacologicalClass: 'Nonselective Alpha and Beta-1 Adrenergic Agonist (Vasopressor)',
  target: 'Alpha-1, Alpha-2, Beta-1 Adrenoceptors (Minimal Beta-2)',
  target_receptor: 'Vascular smooth muscle and cardiac adrenoceptors',
  reversibility: 'Reversible Agonist',
  drug_state: 'Active drug',
  route: 'IV Infusion',
  keyFunctionalGroups: [
    '3,4-Dihydroxybenzene (catechol ring)',
    '(R)-beta-hydroxyl group',
    'Primary amino group (-NH2)',
    '2-Carbon ethyl spacer',
  ],
  pkPdHighlights: {
    onset: 'Immediate upon IV infusion',
    duration: '1-2 minutes after discontinuation',
    halfLife: '<3 minutes',
    elimination: 'Neuronal reuptake (NET) and metabolism by COMT and MAO',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Primary amine lacking N-alkyl substitution. Comfortably accommodates the small binding pocket of alpha adrenoceptors and beta-1 receptors, but lacks the steric bulk required to activate beta-2 receptors. Clinically indicated for septic and cardiogenic shock as a potent vasopressor, NOT for asthma or COPD.',
  moa_summary:
    'Potent alpha-1 and beta-1 agonist producing intense peripheral arterial vasoconstriction and inotropic cardiac stimulation with negligible beta-2 bronchodilation.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/439260/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/439260',
};

export const ISOPROTERENOL_STRUCTURE: ChemicalStructure = {
  id: 'isoproterenol',
  document_label: 'Structure I (Isoproterenol)',
  name: 'Isoproterenol',
  tradeName: 'Isuprel',
  smiles: 'CC(C)NC[C@H](O)c1ccc(O)c(O)c1',
  canonical_smiles: 'CC(C)NC[C@H](O)c1ccc(O)c(O)c1',
  canonicalSmiles: 'CC(C)NC[C@H](O)c1ccc(O)c(O)c1',
  cid: 3779,
  mw: 211.26,
  logP: -0.6,
  chemicalClass: 'Catecholamine / Arylethanolamine',
  pharmacologicalClass: 'Nonselective Beta-1 and Beta-2 Adrenergic Agonist',
  target: 'Beta-1 and Beta-2 Adrenoceptors',
  target_receptor: 'Cardiac beta-1 and bronchial beta-2 GPCRs',
  reversibility: 'Reversible Agonist',
  drug_state: 'Active drug',
  route: 'IV / Inhalation',
  keyFunctionalGroups: [
    '3,4-Dihydroxybenzene (catechol)',
    '(R)-beta-hydroxyl group',
    'N-Isopropyl branched substituent',
    'Secondary amine',
  ],
  pkPdHighlights: {
    onset: 'Immediate (IV), 2-5 min (inhalation)',
    duration: '1-2 hours',
    halfLife: '2-5 minutes',
    elimination: 'Rapid hepatic 3-O-methylation by COMT',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'The bulky branched N-isopropyl substituent extends into the lipophilic auxiliary pocket of beta adrenoceptors, completely eliminating alpha-activity. However, it does not discriminate between beta-1 and beta-2 subtypes, causing potent bronchodilation accompanied by dangerous tachycardia and arrhythmias.',
  moa_summary:
    'Equipotently stimulates cardiac beta-1 and bronchial beta-2 receptors, promoting cAMP accumulation and bronchial relaxation alongside intense cardiac stimulation.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/3779/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/3779',
};

export const DOBUTAMINE_STRUCTURE: ChemicalStructure = {
  id: 'dobutamine',
  document_label: 'Structure II (Dobutamine)',
  name: 'Dobutamine',
  tradeName: 'Dobutrex',
  smiles: 'CC(CCc1ccc(O)cc1)NCCc1ccc(O)c(O)c1',
  canonical_smiles: 'CC(CCc1ccc(O)cc1)NCCc1ccc(O)c(O)c1',
  canonicalSmiles: 'CC(CCc1ccc(O)cc1)NCCc1ccc(O)c(O)c1',
  cid: 36811,
  mw: 301.38,
  logP: 1.8,
  chemicalClass: 'Synthetic Catecholamine derivative',
  pharmacologicalClass: 'Selective Beta-1 Adrenergic Inotropic Agent',
  target: 'Beta-1 Adrenoceptor (Myocardium)',
  target_receptor: 'Cardiac beta-1 adrenoceptor GPCR',
  reversibility: 'Reversible Agonist',
  drug_state: 'Active drug',
  route: 'IV Infusion',
  keyFunctionalGroups: [
    '3,4-Dihydroxyphenyl (catechol ring)',
    'Bulky N-[4-(4-hydroxyphenyl)butan-2-yl] group',
    'Secondary amine',
    'Lack of aliphatic beta-hydroxyl group',
  ],
  pkPdHighlights: {
    onset: '1-2 minutes',
    duration: '<10 minutes after infusion cessation',
    halfLife: '2 minutes',
    elimination: 'Hepatic COMT 3-O-methylation and glucuronide conjugation',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Possesses a catechol nucleus and an extensive aralkyl N-substituent [4-(4-hydroxyphenyl)butan-2-yl] that confers selectivity for myocardial beta-1 receptors. Notably lacks the aliphatic beta-hydroxyl group of standard arylethanolamines. Indicated for acute decompensated heart failure and cardiogenic shock, NOT asthma or COPD.',
  moa_summary:
    'Selectively stimulates myocardial beta-1 receptors to augment cardiac contractility and cardiac output with minimal peripheral vascular changes and no pulmonary bronchodilator role.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/36811/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/36811',
};

export const ALBUTEROL_STRUCTURE: ChemicalStructure = {
  id: 'albuterol',
  document_label: 'Albuterol (Salbutamol)',
  name: 'Albuterol (Salbutamol)',
  tradeName: 'ProAir / Ventolin / Proventil',
  smiles: 'CC(C)(C)NC[C@H](O)c1ccc(O)c(CO)c1',
  canonical_smiles: 'CC(C)(C)NC[C@H](O)c1ccc(O)c(CO)c1',
  canonicalSmiles: 'CC(C)(C)NC[C@H](O)c1ccc(O)c(CO)c1',
  cid: 2083,
  mw: 239.31,
  logP: 0.7,
  chemicalClass: 'Saligenin / Arylethanolamine',
  pharmacologicalClass: 'Short-Acting Beta-2 Agonist (SABA)',
  target: 'Beta-2 Adrenoceptor',
  target_receptor: 'Airway smooth muscle beta-2 GPCR',
  reversibility: 'Reversible Agonist',
  drug_state: 'Active drug',
  route: 'Inhalation / Oral',
  keyFunctionalGroups: [
    'Saligenin nucleus (3-hydroxymethyl-4-hydroxyphenyl)',
    'Bulky N-tert-butyl substituent',
    '(R)-beta-hydroxyl group',
    'Secondary amine',
  ],
  pkPdHighlights: {
    onset: '5-15 minutes',
    duration: '4-6 hours',
    halfLife: '3.8-5 hours',
    elimination: 'Hepatic sulfotransferase (SULT1A3) conjugation and urinary excretion',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Replacement of the catechol 3-OH with a 3-hydroxymethyl group (saligenin) preserves essential hydrogen bonding to the receptor while completely abolishing susceptibility to COMT. The bulky N-tert-butyl group sterically clashes with the narrower beta-1 binding pocket while fitting into the larger beta-2 cavity, providing high beta-2 selectivity and hindering MAO deamination.',
  moa_summary:
    'Selectively binds and activates bronchial beta-2 adrenoceptors, triggering Gs-protein coupling, adenylyl cyclase activation, elevated cAMP, and PKA-mediated smooth muscle relaxation.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/2083/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/2083',
};

export const LEVALBUTEROL_STRUCTURE: ChemicalStructure = {
  id: 'levalbuterol',
  document_label: 'Levalbuterol (R-Albuterol)',
  name: 'Levalbuterol (R-Albuterol)',
  tradeName: 'Xopenex',
  smiles: 'CC(C)(C)NC[C@@H](O)c1ccc(O)c(CO)c1',
  canonical_smiles: 'CC(C)(C)NC[C@@H](O)c1ccc(O)c(CO)c1',
  canonicalSmiles: 'CC(C)(C)NC[C@@H](O)c1ccc(O)c(CO)c1',
  cid: 123600,
  mw: 239.31,
  logP: 0.7,
  chemicalClass: 'Saligenin / Arylethanolamine',
  pharmacologicalClass: 'Short-Acting Beta-2 Agonist (SABA) Eutomer',
  target: 'Beta-2 Adrenoceptor',
  target_receptor: 'Airway smooth muscle beta-2 GPCR',
  reversibility: 'Reversible Agonist',
  drug_state: 'Active drug',
  route: 'Inhalation',
  keyFunctionalGroups: [
    'Saligenin nucleus',
    'Bulky N-tert-butyl group',
    '(R)-stereocenter at beta-carbon',
    'Pure eutomer single enantiomer',
  ],
  pkPdHighlights: {
    onset: '5-10 minutes',
    duration: '5-8 hours',
    halfLife: '3.3-4 hours',
    elimination: 'Hepatic sulfation and renal clearance',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'The optically pure (R)-enantiomer (eutomer) of albuterol. Possesses ~100-fold higher binding affinity for beta-2 adrenoceptors than the inactive (S)-distomer. Eliminates the (S)-enantiomer, which metabolizes more slowly, resists clearance, and has been implicated in paradoxical hyperreactivity and pro-inflammatory signaling.',
  moa_summary:
    'Pure (R)-enantiomer providing selective bronchodilation with lower clinical incidence of tremor, tachycardia, and paradoxical airway hyperreactivity compared to racemic albuterol.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/123600/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/123600',
};

export const PIRBUTEROL_STRUCTURE: ChemicalStructure = {
  id: 'pirbuterol',
  document_label: 'Structure VI (Pirbuterol)',
  name: 'Pirbuterol',
  tradeName: 'Maxair',
  smiles: 'CC(C)(C)NCC(O)c1ccc(O)c(CO)n1',
  canonical_smiles: 'CC(C)(C)NCC(O)c1ccc(O)c(CO)n1',
  canonicalSmiles: 'CC(C)(C)NCC(O)c1ccc(O)c(CO)n1',
  cid: 4845,
  mw: 240.30,
  logP: 0.1,
  chemicalClass: 'Pyridine Bioisostere of Albuterol',
  pharmacologicalClass: 'Short-Acting Beta-2 Agonist (SABA)',
  target: 'Beta-2 Adrenoceptor',
  target_receptor: 'Bronchial smooth muscle beta-2 GPCR',
  reversibility: 'Reversible Agonist',
  drug_state: 'Active drug',
  route: 'Inhalation',
  keyFunctionalGroups: [
    'Pyridine heterocyclic ring (sp2 nitrogen)',
    '3-Hydroxymethyl group',
    '4-Phenolic/pyridinol hydroxyl',
    'Bulky N-tert-butyl group',
  ],
  pkPdHighlights: {
    onset: '5 minutes',
    duration: '4-5 hours',
    halfLife: '2-3 hours',
    elimination: 'Hepatic conjugation and urinary excretion',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Classic pyridine bioisostere of albuterol where one aromatic CH carbon is replaced with a basic pyridine nitrogen atom. Maintains high beta-2 selectivity and complete resistance to COMT. Serves as a rapid-onset short-acting rescue inhaler (SABA) with a 4-5 hour duration.',
  moa_summary:
    'Pyridine bioisosteric congener of albuterol that selectively activates bronchial beta-2 receptors, providing rapid bronchodilation for acute bronchospasm relief.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/4845/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/4845',
};

export const SALMETEROL_STRUCTURE: ChemicalStructure = {
  id: 'salmeterol',
  document_label: 'Structure IV (Salmeterol)',
  name: 'Salmeterol',
  tradeName: 'Serevent',
  smiles: 'OCc1cc(ccc1O)[C@@H](O)CNCCCCCOCCCCc2ccccc2',
  canonical_smiles: 'OCc1cc(ccc1O)[C@@H](O)CNCCCCCOCCCCc2ccccc2',
  canonicalSmiles: 'OCc1cc(ccc1O)[C@@H](O)CNCCCCCOCCCCc2ccccc2',
  cid: 5152,
  mw: 415.57,
  logP: 3.9,
  chemicalClass: 'Saligenin / Lipophilic Arylethanolamine',
  pharmacologicalClass: 'Long-Acting Beta-2 Agonist (LABA)',
  target: 'Beta-2 Adrenoceptor',
  target_receptor: 'Beta-2 adrenoceptor active site and hydrophobic exosite',
  reversibility: 'Reversible Agonist (Exosite-anchored)',
  drug_state: 'Active drug',
  route: 'Inhalation (Twice Daily)',
  keyFunctionalGroups: [
    'Saligenin head group (COMT resistant)',
    '11-Atom lipophilic phenylalkoxyalkyl tail',
    'Ether oxygen linker',
    'Secondary amine',
  ],
  pkPdHighlights: {
    onset: '10-20 minutes (slower than albuterol)',
    duration: '12 hours (twice daily)',
    halfLife: '5.5 hours',
    elimination: 'Hepatic CYP3A4 hydroxylation to alpha-hydroxysalmeterol',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Features an albuterol-like saligenin head group connected to a long, highly lipophilic 11-atom N-phenylalkoxyalkyl tail. The extended tail anchors into an adjacent hydrophobic exosite domain near the receptor, allowing the active head to repeatedly bind and activate the receptor without dissociating into the biophase (~12 hr duration).',
  moa_summary:
    'Long-acting beta-2 agonist whose lipophilic chain anchors to an exosite domain, conferring sustained 12-hour bronchodilation for twice-daily maintenance therapy.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/5152/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5152',
};

export const FORMOTEROL_STRUCTURE: ChemicalStructure = {
  id: 'formoterol',
  document_label: 'Formoterol',
  name: 'Formoterol',
  tradeName: 'Foradil / Perforomist',
  smiles: 'COc1ccc(CC(C)NCC(O)c2ccc(O)c(NC=O)c2)cc1',
  canonical_smiles: 'COc1ccc(CC(C)NCC(O)c2ccc(O)c(NC=O)c2)cc1',
  canonicalSmiles: 'COc1ccc(CC(C)NCC(O)c2ccc(O)c(NC=O)c2)cc1',
  cid: 3410,
  mw: 344.40,
  logP: 1.6,
  chemicalClass: 'Formanilide / Arylethanolamine',
  pharmacologicalClass: 'Long-Acting Beta-2 Agonist (LABA) with Rapid Onset',
  target: 'Beta-2 Adrenoceptor',
  target_receptor: 'Airway smooth muscle beta-2 GPCR',
  reversibility: 'Reversible Agonist',
  drug_state: 'Active drug',
  route: 'Inhalation (Twice Daily)',
  keyFunctionalGroups: [
    '3-Formamido substituent (-NH-CHO / formanilide)',
    '4-Phenolic hydroxyl',
    'N-(4-methoxyphenyl)isopropyl aralkyl group',
    'Secondary amine',
  ],
  pkPdHighlights: {
    onset: '1-3 minutes (as rapid as albuterol)',
    duration: '12 hours (twice daily)',
    halfLife: '10 hours',
    elimination: 'Direct glucuronidation and O-demethylation via CYP2D6/CYP2C19',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Replaces the catechol 3-OH with a 3-formamido group (-NH-CHO), completely resisting COMT while preserving hydrogen bonding. The moderately lipophilic N-aralkyl tail dissolves into the plasma membrane lipid bilayer (plasmalemma microdepot), from which it gradually diffuses to stimulate receptors for 12 hours with rapid onset.',
  moa_summary:
    'Unique LABA combining rapid onset of action (1-3 min) with a 12-hour duration of bronchodilation via membrane depot retention.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/3410/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/3410',
};

export const INDACATEROL_STRUCTURE: ChemicalStructure = {
  id: 'indacaterol',
  document_label: 'Structure V (Indacaterol)',
  name: 'Indacaterol',
  tradeName: 'Arcapta Neohaler',
  smiles: 'CCc1cc2CC(NC[C@H](O)c3ccc(O)c4[nH]c(=O)ccc34)Cc2cc1CC',
  canonical_smiles: 'CCc1cc2CC(NC[C@H](O)c3ccc(O)c4[nH]c(=O)ccc34)Cc2cc1CC',
  canonicalSmiles: 'CCc1cc2CC(NC[C@H](O)c3ccc(O)c4[nH]c(=O)ccc34)Cc2cc1CC',
  cid: 6918554,
  mw: 392.5,
  logP: 2.8,
  chemicalClass: '8-Hydroxyquinolin-2(1H)-one derivative',
  pharmacologicalClass: 'Ultra-Long-Acting Beta-2 Agonist (Ultra-LABA)',
  target: 'Beta-2 Adrenoceptor',
  target_receptor: 'Beta-2 adrenoceptor lipid microdomain',
  reversibility: 'Reversible Agonist (Slow dissociation)',
  drug_state: 'Active drug',
  route: 'Inhalation (Once Daily)',
  keyFunctionalGroups: [
    '8-Hydroxyquinolin-2(1H)-one bicyclic core (carbostyril)',
    '5,6-Diethylindan-2-yl amino substituent',
    '(R)-beta-hydroxyl group',
    'Amide carbonyl in heterocyclic ring',
  ],
  pkPdHighlights: {
    onset: '5 minutes',
    duration: '24 hours (once daily)',
    halfLife: '40-52 hours',
    elimination: 'Hepatic CYP3A4 oxidation and UGT1A1 glucuronidation; fecal clearance',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Incorporates an 8-hydroxyquinolin-2(1H)-one bicyclic core mimicking the catechol hydrogen-bonding network while resisting COMT. The rigid, lipophilic 5,6-diethylindan-2-yl tail partitions deeply into the cell membrane lipid rafts, providing a sustained 24-hour microdepot for once-daily dosing.',
  moa_summary:
    'Ultra-LABA offering rapid bronchodilation within 5 minutes and sustained 24-hour efficacy from deep lipid membrane partitioning, approved for once-daily COPD maintenance.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/6918554/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/6918554',
};

export const OLODATEROL_STRUCTURE: ChemicalStructure = {
  id: 'olodaterol',
  document_label: 'Structure III (Olodaterol)',
  name: 'Olodaterol',
  tradeName: 'Striverdi Respimat',
  smiles: 'CC(C)(CC1=CC=C(C=C1)OC)NC[C@H](C2=C3C(=CC(=C2)O)NC(=O)CO3)O',
  canonical_smiles: 'CC(C)(CC1=CC=C(C=C1)OC)NC[C@H](C2=C3C(=CC(=C2)O)NC(=O)CO3)O',
  canonicalSmiles: 'CC(C)(CC1=CC=C(C=C1)OC)NC[C@H](C2=C3C(=CC(=C2)O)NC(=O)CO3)O',
  cid: 11504295,
  mw: 386.4,
  logP: 2.2,
  chemicalClass: 'Benzoxazinone / Arylethanolamine',
  pharmacologicalClass: 'Ultra-Long-Acting Beta-2 Agonist (Ultra-LABA)',
  target: 'Beta-2 Adrenoceptor',
  target_receptor: 'Beta-2 adrenoceptor active conformation',
  reversibility: 'Reversible Agonist',
  drug_state: 'Active drug',
  route: 'Inhalation (Once Daily)',
  keyFunctionalGroups: [
    '6-Hydroxy-2H-1,4-benzoxazin-3(4H)-one bicyclic nucleus',
    'gem-Dimethyl substituted aralkyl tail',
    '4-Methoxyphenyl substituent',
    '(R)-beta-hydroxyl group',
  ],
  pkPdHighlights: {
    onset: '5 minutes',
    duration: '24 hours (once daily)',
    halfLife: '45 hours',
    elimination: 'Hepatic CYP2C9/2C8 demethylation and UGT2B7 glucuronidation',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Features a rigid 6-hydroxy-benzoxazinone heterocyclic core mimicking catechol binding without COMT susceptibility. The gem-dimethyl branched aralkyl tail protects against enzymatic deamination and locks the ligand in the active receptor pocket, enabling sustained 24-hour bronchodilation.',
  moa_summary:
    'Highly selective ultra-LABA with 24-hour duration of action providing once-daily bronchodilation for maintenance treatment of COPD.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/11504295/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/11504295',
};

export const VILANTEROL_STRUCTURE: ChemicalStructure = {
  id: 'vilanterol',
  document_label: 'Vilanterol',
  name: 'Vilanterol',
  tradeName: 'Component of Breo / Anoro / Trelegy Ellipta',
  smiles: 'C1=CC(=C(C(=C1)Cl)COCCOCCCCCCNC[C@@H](C2=CC(=C(C=C2)O)CO)O)Cl',
  canonical_smiles: 'C1=CC(=C(C(=C1)Cl)COCCOCCCCCCNC[C@@H](C2=CC(=C(C=C2)O)CO)O)Cl',
  canonicalSmiles: 'C1=CC(=C(C(=C1)Cl)COCCOCCCCCCNC[C@@H](C2=CC(=C(C=C2)O)CO)O)Cl',
  cid: 10184665,
  mw: 486.4,
  logP: 3.2,
  chemicalClass: 'Saligenin / Arylethanolamine',
  pharmacologicalClass: 'Ultra-Long-Acting Beta-2 Agonist (Ultra-LABA)',
  target: 'Beta-2 Adrenoceptor',
  target_receptor: 'Beta-2 adrenoceptor active site & lipophilic exosite',
  reversibility: 'Reversible Agonist',
  drug_state: 'Active drug',
  route: 'Inhalation (Once Daily)',
  keyFunctionalGroups: [
    'Saligenin head group',
    '2,6-Dichlorobenzyl ether terminal ring',
    'Extended polyether/alkyl linker',
    'Secondary amine',
  ],
  pkPdHighlights: {
    onset: '5-15 minutes',
    duration: '24 hours (once daily)',
    halfLife: '21 hours',
    elimination: 'Extensive hepatic CYP3A4 O-dealkylation (<1% oral bioavailability)',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Saligenin core linked to an extended lipophilic tail terminating in a 2,6-dichlorobenzyl ether. Confers high beta-2 selectivity and 24-hour duration while swallowed drug is rapidly metabolized by hepatic CYP3A4, minimizing systemic exposure.',
  moa_summary:
    'Ultra-LABA formulated in fixed-dose combination inhalers for once-daily maintenance therapy of asthma and COPD.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/10184665/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/10184665',
};

export const IPRATROPIUM_STRUCTURE: ChemicalStructure = {
  id: 'ipratropium',
  document_label: 'Structure V (Ipratropium)',
  name: 'Ipratropium bromide',
  tradeName: 'Atrovent',
  smiles: 'C[N+]1(C(C)C)[C@H]2CC[C@@H]1C[C@@H](C2)OC(=O)[C@H](CO)c3ccccc3',
  canonical_smiles: 'C[N+]1(C(C)C)[C@H]2CC[C@@H]1C[C@@H](C2)OC(=O)[C@H](CO)c3ccccc3',
  canonicalSmiles: 'C[N+]1(C(C)C)[C@H]2CC[C@@H]1C[C@@H](C2)OC(=O)[C@H](CO)c3ccccc3',
  cid: 25897919,
  mw: 332.5,
  logP: -1.8,
  chemicalClass: 'Quaternary Ammonium Tropane Ester',
  pharmacologicalClass: 'Short-Acting Muscarinic Antagonist (SAMA)',
  target: 'Muscarinic M1, M2, M3 Receptors',
  target_receptor: 'Airway smooth muscle M3 muscarinic receptor',
  reversibility: 'Reversible Competitive Antagonist',
  drug_state: 'Active drug',
  route: 'Inhalation (QID)',
  keyFunctionalGroups: [
    'Quaternary ammonium tropane nitrogen',
    'N-Isopropyl and N-methyl groups',
    'Tropic acid ester linkage',
    'Hydroxymethyl group',
  ],
  pkPdHighlights: {
    onset: '15 minutes',
    duration: '4-6 hours',
    halfLife: '1.6 hours',
    elimination: 'Renal excretion unchanged and enzymatic ester hydrolysis',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Quaternary N-isopropyl congener of atropine. The permanent positive charge renders the molecule polar and hydrophilic, preventing oral absorption (<2%) and blood-brain barrier penetration. Confines anticholinergic action strictly to the bronchial airways.',
  moa_summary:
    'Competitively blocks bronchial M3 muscarinic receptors, inhibiting acetylcholine-induced bronchoconstriction and excessive mucus secretion without central adverse effects.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/25897919/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/25897919',
};

export const TIOTROPIUM_STRUCTURE: ChemicalStructure = {
  id: 'tiotropium',
  document_label: 'Structure III (Tiotropium)',
  name: 'Tiotropium bromide',
  tradeName: 'Spiriva HandiHaler / Respimat',
  smiles: 'C[N+]1(C)[C@H]2C[C@@H]3O[C@H]3[C@@H]1C[C@@H](C2)OC(=O)C(O)(c4cccs4)c5cccs5',
  canonical_smiles: 'C[N+]1(C)[C@H]2C[C@@H]3O[C@H]3[C@@H]1C[C@@H](C2)OC(=O)C(O)(c4cccs4)c5cccs5',
  canonicalSmiles: 'C[N+]1(C)[C@H]2C[C@@H]3O[C@H]3[C@@H]1C[C@@H](C2)OC(=O)C(O)(c4cccs4)c5cccs5',
  cid: 5487427,
  mw: 392.5,
  logP: -1.2,
  chemicalClass: 'Quaternary Ammonium Scopine Ester',
  pharmacologicalClass: 'Long-Acting Muscarinic Antagonist (LAMA)',
  target: 'Muscarinic M3 Receptor',
  target_receptor: 'Airway smooth muscle M3 receptor',
  reversibility: 'Reversible with very slow dissociation (Kinetic Selectivity)',
  drug_state: 'Active drug',
  route: 'Inhalation (Once Daily)',
  keyFunctionalGroups: [
    'Quaternary N,N-dimethylscopine core',
    'Epoxide oxygen bridge',
    'Di-(2-thienyl) glycolate ester moiety',
    'Alpha-hydroxyl group',
  ],
  pkPdHighlights: {
    onset: '30 minutes',
    duration: '24 hours (once daily)',
    halfLife: '5-6 days terminal elimination half-life',
    elimination: 'Renal unchanged (~74%) and non-enzymatic/esterase cleavage',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Possesses a quaternary scopine core esterified with a bulky di-(2-thienyl) glycolate moiety. Exhibits kinetic selectivity: dissociates very slowly from M3 receptors (t1/2 ~35 hours) but dissociates rapidly from presynaptic M2 autoreceptors (t1/2 ~3.6 hours), allowing once-daily bronchodilation without preserving M2-mediated ACh surge.',
  moa_summary:
    'Long-acting muscarinic antagonist with kinetic selectivity for M3 receptors, producing sustained 24-hour bronchodilation and reduction of COPD exacerbations.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/5487427/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5487427',
};

export const ACLIDINIUM_STRUCTURE: ChemicalStructure = {
  id: 'aclidinium',
  document_label: 'Aclidinium bromide',
  name: 'Aclidinium bromide',
  tradeName: 'Tudorza Pressair',
  smiles: 'C1C[N+]2(CCC1[C@H](C2)OC(=O)C(C3=CC=CS3)(C4=CC=CS4)O)CCCOC5=CC=CC=C5',
  canonical_smiles: 'C1C[N+]2(CCC1[C@H](C2)OC(=O)C(C3=CC=CS3)(C4=CC=CS4)O)CCCOC5=CC=CC=C5',
  canonicalSmiles: 'C1C[N+]2(CCC1[C@H](C2)OC(=O)C(C3=CC=CS3)(C4=CC=CS4)O)CCCOC5=CC=CC=C5',
  cid: 11434515,
  mw: 484.7,
  logP: 1.5,
  chemicalClass: 'Quaternary Ammonium Quinuclidine Ester',
  pharmacologicalClass: 'Long-Acting Muscarinic Antagonist (LAMA) / Soft Anticholinergic',
  target: 'Muscarinic M3 Receptor',
  target_receptor: 'Airway smooth muscle M3 receptor',
  reversibility: 'Reversible Antagonist',
  drug_state: 'Active drug',
  route: 'Inhalation (Twice Daily)',
  keyFunctionalGroups: [
    'Quinuclidine quaternary nitrogen',
    'Dithienyl glycolate ester',
    'Phenoxypropyl substituent',
    'Labile ester linkage',
  ],
  pkPdHighlights: {
    onset: '10-15 minutes',
    duration: '12 hours (twice daily)',
    halfLife: '2-3 minutes in human plasma',
    elimination: 'Rapid enzymatic hydrolysis by plasma butyrylcholinesterase into inactive acid and alcohol',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Prototypical soft anticholinergic: provides sustained local M3 blockade in airway smooth muscle, but any drug absorbed into systemic circulation is rapidly hydrolyzed by plasma esterases (t1/2 ~2.4 min) to inactive metabolites, virtually eliminating systemic anticholinergic adverse effects.',
  moa_summary:
    'Soft anticholinergic bronchodilator that blocks bronchial M3 receptors but undergoes rapid ester cleavage upon systemic entry, ensuring an optimal safety profile.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/11434515/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/11434515',
};

export const UMECLIDINIUM_STRUCTURE: ChemicalStructure = {
  id: 'umeclidinium',
  document_label: 'Structure IV (Umeclidinium)',
  name: 'Umeclidinium bromide',
  tradeName: 'Incruse Ellipta',
  smiles: '[N+]12CCC(CC1)(C(O)(c3ccccc3)c4ccccc4)CC2CCOCC5=CC=CC=C5',
  canonical_smiles: '[N+]12CCC(CC1)(C(O)(c3ccccc3)c4ccccc4)CC2CCOCC5=CC=CC=C5',
  canonicalSmiles: '[N+]12CCC(CC1)(C(O)(c3ccccc3)c4ccccc4)CC2CCOCC5=CC=CC=C5',
  cid: 11519070,
  mw: 428.6,
  logP: 2.1,
  chemicalClass: 'Quaternary Ammonium Quinuclidine Alcohol',
  pharmacologicalClass: 'Long-Acting Muscarinic Antagonist (LAMA)',
  target: 'Muscarinic M3 Receptor',
  target_receptor: 'Airway smooth muscle M3 muscarinic receptor',
  reversibility: 'Reversible Competitive (Slow offset)',
  drug_state: 'Active drug',
  route: 'Inhalation (Once Daily)',
  keyFunctionalGroups: [
    'Quaternary quinuclidine nitrogen',
    '1,1-Diphenylmethanol (benzhydrol) motif',
    '2-(Phenoxy)ethyl bridge',
    'Tertiary carbinol (-OH)',
  ],
  pkPdHighlights: {
    onset: '15-30 minutes',
    duration: '24 hours (once daily)',
    halfLife: '11 hours',
    elimination: 'Hepatic CYP2D6 metabolism and biliary secretion',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Quinuclidine-based non-ester anticholinergic. Replaces the ester bond with a direct carbon-carbon bond to a 1,1-diphenylmethanol unit, conferring metabolic resistance to esterases while the quaternary ammonium center confines exposure strictly to the pulmonary system.',
  moa_summary:
    'Once-daily LAMA with slow receptor dissociation from M3 receptors providing sustained 24-hour bronchodilation.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/11519070/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/11519070',
};

export const GLYCOPYRROLATE_STRUCTURE: ChemicalStructure = {
  id: 'glycopyrrolate',
  document_label: 'Glycopyrrolate (Glycopyrronium)',
  name: 'Glycopyrrolate (Glycopyrronium)',
  tradeName: 'Seebri Neohaler / Lonhala Magnair',
  smiles: 'C[N+]1(C)CCCC1OC(=O)C(O)(c2ccccc2)C3CCCC3',
  canonical_smiles: 'C[N+]1(C)CCCC1OC(=O)C(O)(c2ccccc2)C3CCCC3',
  canonicalSmiles: 'C[N+]1(C)CCCC1OC(=O)C(O)(c2ccccc2)C3CCCC3',
  cid: 3494,
  mw: 318.43,
  logP: -1.1,
  chemicalClass: 'Quaternary Ammonium Pyrrolidinium Ester',
  pharmacologicalClass: 'Long-Acting Muscarinic Antagonist (LAMA)',
  target: 'Muscarinic M1, M2, M3 Receptors',
  target_receptor: 'Airway smooth muscle M3 muscarinic receptor',
  reversibility: 'Reversible Competitive Antagonist',
  drug_state: 'Active drug',
  route: 'Inhalation / Oral / IV',
  keyFunctionalGroups: [
    'Quaternary 1,1-dimethylpyrrolidinium ring',
    'Cyclopentylmandelate ester',
    'Tertiary hydroxyl group',
    'Ester linkage',
  ],
  pkPdHighlights: {
    onset: '5-15 minutes',
    duration: '12-24 hours',
    halfLife: '1.5-2 hours (plasma), >12 hours (lung tissue)',
    elimination: 'Renal unchanged and hepatic hydroxylation (CYP2D6/CYP3A4)',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Features a cyclopentyl(hydroxy)phenylacetate ester linked to a 1,1-dimethylpyrrolidinium ring. The quaternary ammonium center ensures low oral absorption and limits systemic toxicity while providing potent M3 blockade.',
  moa_summary:
    'Potent competitive muscarinic receptor antagonist that inhibits acetylcholine-induced bronchoconstriction and excessive bronchial secretions.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/3494/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/3494',
};

export const DARIFENACIN_STRUCTURE: ChemicalStructure = {
  id: 'darifenacin',
  document_label: 'Structure I (Darifenacin)',
  name: 'Darifenacin',
  tradeName: 'Enablex',
  smiles: 'NC(=O)C(c1ccccc1)(c2ccccc2)[C@@H]3CCN(CCc4ccc5OCCc5c4)C3',
  canonical_smiles: 'NC(=O)C(c1ccccc1)(c2ccccc2)[C@@H]3CCN(CCc4ccc5OCCc5c4)C3',
  canonicalSmiles: 'NC(=O)C(c1ccccc1)(c2ccccc2)[C@@H]3CCN(CCc4ccc5OCCc5c4)C3',
  cid: 444031,
  mw: 426.5,
  logP: 2.8,
  chemicalClass: 'Tertiary Amine Pyrrolidine Acetamide',
  pharmacologicalClass: 'Selective M3 Muscarinic Antagonist (Overactive Bladder)',
  target: 'M3 Muscarinic Receptor',
  target_receptor: 'Urinary bladder detrusor muscle M3 receptor',
  reversibility: 'Reversible Antagonist',
  drug_state: 'Active drug',
  route: 'Oral',
  keyFunctionalGroups: [
    'Diphenylacetamide moiety',
    'Pyrrolidine ring',
    'Dihydrobenzofuran substituent',
    'Tertiary amine',
  ],
  pkPdHighlights: {
    onset: '1-2 hours',
    duration: '24 hours',
    halfLife: '13-19 hours',
    elimination: 'Hepatic CYP2D6 and CYP3A4 metabolism',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Tertiary amine anticholinergic with 9-fold selectivity for M3 receptors over M1 and 12-fold over M2. Indicated for overactive bladder with urge urinary incontinence, NOT for asthma or COPD bronchodilation.',
  moa_summary:
    'Selectively antagonizes bladder M3 muscarinic receptors to suppress involuntary detrusor muscle contractions in overactive bladder.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/444031/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/444031',
};

export const TRIHEXYPHENIDYL_STRUCTURE: ChemicalStructure = {
  id: 'trihexyphenidyl',
  document_label: 'Structure II (Trihexyphenidyl)',
  name: 'Trihexyphenidyl',
  tradeName: 'Artane',
  smiles: 'OC(CCN1CCCCC1)(c2ccccc2)C3CCCCC3',
  canonical_smiles: 'OC(CCN1CCCCC1)(c2ccccc2)C3CCCCC3',
  canonicalSmiles: 'OC(CCN1CCCCC1)(c2ccccc2)C3CCCCC3',
  cid: 5572,
  mw: 301.47,
  logP: 3.5,
  chemicalClass: 'Tertiary Amino Alcohol',
  pharmacologicalClass: 'Central Muscarinic Antagonist (Antiparkinsonian)',
  target: 'Central Muscarinic Receptors (M1/M2/M3)',
  target_receptor: 'Striatal cholinergic interneurons',
  reversibility: 'Reversible Antagonist',
  drug_state: 'Active drug',
  route: 'Oral',
  keyFunctionalGroups: [
    'Piperidine ring (tertiary amine)',
    '1-Cyclohexyl-1-phenylpropan-1-ol scaffold',
    'Tertiary hydroxyl group',
    'Lipophilic cyclohexyl ring',
  ],
  pkPdHighlights: {
    onset: '1 hour',
    duration: '6-12 hours',
    halfLife: '3.5-4 hours',
    elimination: 'Hepatic metabolism and urinary excretion',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Tertiary amine with high lipophilicity that readily crosses the blood-brain barrier. Indicated for Parkinsonism and drug-induced extrapyramidal symptoms to restore striatal dopamine/ACh balance, NOT for asthma/COPD.',
  moa_summary:
    'Centrally-acting anticholinergic that blocks striatal muscarinic receptors to relieve tremors and rigidity in Parkinsonism.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/5572/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5572',
};

export const HYDROCORTISONE_STRUCTURE: ChemicalStructure = {
  id: 'hydrocortisone',
  document_label: 'Structure II (Hydrocortisone / Cortisol)',
  name: 'Hydrocortisone (Cortisol)',
  tradeName: 'Cortef / Solu-Cortef',
  smiles: 'C[C@]12CC[C@H]3[C@@H](CCC4=CC(=O)CC[C@]34C)[C@@H]1CC[C@]2(O)C(=O)CO',
  canonical_smiles: 'C[C@]12CC[C@H]3[C@@H](CCC4=CC(=O)CC[C@]34C)[C@@H]1CC[C@]2(O)C(=O)CO',
  canonicalSmiles: 'C[C@]12CC[C@H]3[C@@H](CCC4=CC(=O)CC[C@]34C)[C@@H]1CC[C@]2(O)C(=O)CO',
  cid: 5754,
  mw: 362.46,
  logP: 1.6,
  chemicalClass: 'Natural Glucocorticoid (21-Carbon Pregnane)',
  pharmacologicalClass: 'Glucocorticoid Receptor Agonist (Prototype)',
  target: 'Glucocorticoid Receptor (GR / NR3C1)',
  target_receptor: 'Intracellular Glucocorticoid and Mineralocorticoid Receptors',
  reversibility: 'Reversible Agonist',
  drug_state: 'Active drug',
  route: 'Oral / IV / Topical',
  keyFunctionalGroups: [
    'Delta-4-3-ketone in Ring A',
    '11-beta-hydroxyl group (essential)',
    '17-alpha-hydroxyl group',
    'C20-ketone & C21-primary alcohol',
  ],
  pkPdHighlights: {
    onset: 'Genomic: 4-6 hours',
    duration: '8-12 hours',
    halfLife: '1.5-2 hours',
    elimination: 'Hepatic 11beta-HSD2, 5-reductase, glucuronidation',
    bioactivation: 'Active parent hormone',
  },
  sarNotes:
    'Endogenous glucocorticoid prototype (anti-inflammatory potency = 1, mineralocorticoid potency = 1). The 11-beta-OH group donates an indispensable hydrogen bond to Asn564 in the GR ligand-binding domain. In aldosterone-sensitive tissues (kidney), it is inactivated to cortisone by 11-beta-HSD2.',
  moa_summary:
    'Binds cytosolic GR, translocates to nucleus, stimulates transcription of Annexin A1 (inhibiting PLA2) and represses NF-kB and AP-1 pro-inflammatory pathways.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/5754/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5754',
};

export const CORTISONE_STRUCTURE: ChemicalStructure = {
  id: 'cortisone',
  document_label: 'Structure IV (Cortisone)',
  name: 'Cortisone',
  tradeName: 'Cortone',
  smiles: 'C[C@]12CC[C@H]3[C@@H](CCC4=CC(=O)CC[C@]34C)[C@@H]1C(=O)C[C@]2(O)C(=O)CO',
  canonical_smiles: 'C[C@]12CC[C@H]3[C@@H](CCC4=CC(=O)CC[C@]34C)[C@@H]1C(=O)C[C@]2(O)C(=O)CO',
  canonicalSmiles: 'C[C@]12CC[C@H]3[C@@H](CCC4=CC(=O)CC[C@]34C)[C@@H]1C(=O)C[C@]2(O)C(=O)CO',
  cid: 222786,
  mw: 360.44,
  logP: 1.5,
  chemicalClass: 'Glucocorticoid Prodrug (11-Keto Steroid)',
  pharmacologicalClass: 'Inactive Glucocorticoid Prodrug',
  target: 'Glucocorticoid Receptor (after bioactivation)',
  target_receptor: 'Cytosolic GR (requires reduction to cortisol)',
  reversibility: 'Reversible Agonist (via cortisol)',
  drug_state: 'Prodrug',
  route: 'Oral / IM',
  keyFunctionalGroups: [
    '11-Ketone (=O) prodrug motif',
    'Delta-4-3-ketone',
    '17-alpha-hydroxyl',
    '21-hydroxy-20-keto side chain',
  ],
  pkPdHighlights: {
    onset: 'Delayed (requires hepatic bioactivation)',
    duration: '8-12 hours',
    halfLife: '0.5-2 hours',
    elimination: 'Hepatic reduction and conjugation',
    bioactivation: 'Reduced to hydrocortisone by hepatic 11beta-HSD1',
  },
  sarNotes:
    'Features an 11-ketone group that lacks the hydrogen bond donor capacity required for GR activation (potency 0.8 relative to hydrocortisone). Functions as an inert prodrug that must be reduced by hepatic 11-beta-HSD1 into active hydrocortisone.',
  moa_summary:
    'Inactive 11-keto precursor converted by hepatic 11beta-HSD1 into active hydrocortisone to mediate systemic glucocorticoid effects.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/222786/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/222786',
};

export const PREDNISOLONE_STRUCTURE: ChemicalStructure = {
  id: 'prednisolone',
  document_label: 'Structure I (Prednisolone)',
  name: 'Prednisolone',
  tradeName: 'Prelone / Orapred',
  smiles: 'C[C@]12CC[C@H]3[C@@H](C=CC4=CC(=O)C=C[C@]34C)[C@@H]1CC[C@]2(O)C(=O)CO',
  canonical_smiles: 'C[C@]12CC[C@H]3[C@@H](C=CC4=CC(=O)C=C[C@]34C)[C@@H]1CC[C@]2(O)C(=O)CO',
  canonicalSmiles: 'C[C@]12CC[C@H]3[C@@H](C=CC4=CC(=O)C=C[C@]34C)[C@@H]1CC[C@]2(O)C(=O)CO',
  cid: 5755,
  mw: 360.44,
  logP: 1.6,
  chemicalClass: 'Delta-1-Dehydrocorticosteroid',
  pharmacologicalClass: 'Synthetic Glucocorticoid',
  target: 'Glucocorticoid Receptor',
  target_receptor: 'Nuclear GR',
  reversibility: 'Reversible Agonist',
  drug_state: 'Active drug',
  route: 'Oral / IV / Ophthalmic',
  keyFunctionalGroups: [
    'Delta-1,4-diene-3-one in Ring A',
    '11-beta-hydroxyl group',
    '17-alpha-hydroxyl',
    'C21-primary alcohol',
  ],
  pkPdHighlights: {
    onset: 'Rapid oral absorption, genomic onset 2-6 hours',
    duration: '12-36 hours (intermediate-acting)',
    halfLife: '2-4 hours',
    elimination: 'Hepatic metabolism and glucuronide excretion',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Introduction of a 1,2-double bond (Delta-1) into hydrocortisone flattens Ring A, enhancing GR affinity ~4-5 fold (anti-inflammatory potency = 4) while reducing mineralocorticoid affinity (salt retention ~0.8 relative to cortisol).',
  moa_summary:
    'Synthetic glucocorticoid with 4-fold higher anti-inflammatory potency than hydrocortisone and reduced mineralocorticoid side effects.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/5755/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5755',
};

export const PREDNISONE_STRUCTURE: ChemicalStructure = {
  id: 'prednisone',
  document_label: 'Prednisone',
  name: 'Prednisone',
  tradeName: 'Deltasone',
  smiles: 'C[C@]12CC[C@H]3[C@@H](C=CC4=CC(=O)C=C[C@]34C)[C@@H]1C(=O)C[C@]2(O)C(=O)CO',
  canonical_smiles: 'C[C@]12CC[C@H]3[C@@H](C=CC4=CC(=O)C=C[C@]34C)[C@@H]1C(=O)C[C@]2(O)C(=O)CO',
  canonicalSmiles: 'C[C@]12CC[C@H]3[C@@H](C=CC4=CC(=O)C=C[C@]34C)[C@@H]1C(=O)C[C@]2(O)C(=O)CO',
  cid: 5865,
  mw: 358.43,
  logP: 1.5,
  chemicalClass: 'Delta-1-Dehydro-11-ketosteroid',
  pharmacologicalClass: 'Synthetic Glucocorticoid Prodrug',
  target: 'Glucocorticoid Receptor (after bioactivation)',
  target_receptor: 'Nuclear GR (as prednisolone)',
  reversibility: 'Reversible Agonist (via prednisolone)',
  drug_state: 'Prodrug',
  route: 'Oral',
  keyFunctionalGroups: [
    'Delta-1,4-diene-3-one in Ring A',
    '11-Ketone (=O) prodrug motif',
    '17-alpha-hydroxyl',
    'C20-ketone & C21-hydroxyl',
  ],
  pkPdHighlights: {
    onset: '1-2 hours (requires hepatic activation)',
    duration: '18-36 hours',
    halfLife: '2-3 hours',
    elimination: 'Hepatic reduction to prednisolone then urinary excretion',
    bioactivation: 'Reduced to prednisolone by hepatic 11beta-HSD1',
  },
  sarNotes:
    'Possesses both a 1,2-double bond (Delta-1) and an 11-ketone group. Biologically inactive prodrug that requires reduction by hepatic 11-beta-HSD1 to prednisolone. In severe liver cirrhosis, prednisolone must be administered directly.',
  moa_summary:
    'Widely prescribed oral glucocorticoid prodrug converted in the liver to prednisolone for treatment of inflammatory and allergic conditions.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/5865/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5865',
};

export const METHYLPREDNISOLONE_STRUCTURE: ChemicalStructure = {
  id: 'methylprednisolone',
  document_label: 'Structure V (Methylprednisolone)',
  name: 'Methylprednisolone',
  tradeName: 'Medrol / Solu-Medrol',
  smiles: 'C[C@@H]1CC2C3CCC4=CC(=O)C=CC4(C3(C(CC2(C1(C(=O)CO)O)C)O)C)C',
  canonical_smiles: 'C[C@@H]1CC2C3CCC4=CC(=O)C=CC4(C3(C(CC2(C1(C(=O)CO)O)C)O)C)C',
  canonicalSmiles: 'C[C@@H]1CC2C3CCC4=CC(=O)C=CC4(C3(C(CC2(C1(C(=O)CO)O)C)O)C)C',
  cid: 6741,
  mw: 374.47,
  logP: 1.8,
  chemicalClass: '6-alpha-Methyl-delta-1-corticosteroid',
  pharmacologicalClass: 'Synthetic Glucocorticoid',
  target: 'Glucocorticoid Receptor',
  target_receptor: 'Nuclear GR',
  reversibility: 'Reversible Agonist',
  drug_state: 'Active drug',
  route: 'Oral / IV / IM',
  keyFunctionalGroups: [
    '6-alpha-Methyl group',
    'Delta-1,4-diene-3-one',
    '11-beta-hydroxyl',
    '17-alpha-hydroxyl & C21-OH',
  ],
  pkPdHighlights: {
    onset: '1-2 hours (oral), immediate (IV succinate)',
    duration: '18-36 hours',
    halfLife: '2.5-3.5 hours',
    elimination: 'Hepatic CYP3A4 metabolism',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    '6-alpha-methylation hinders metabolic reduction of Ring A by 5-reductases and eliminates virtually all mineralocorticoid (salt-retaining) activity (potency 5x relative to hydrocortisone, 0x mineralocorticoid).',
  moa_summary:
    'Potent intermediate-acting synthetic glucocorticoid with negligible salt retention, widely used for acute asthma exacerbations and status asthmaticus.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/6741/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/6741',
};

export const DEXAMETHASONE_STRUCTURE: ChemicalStructure = {
  id: 'dexamethasone',
  document_label: 'Structure III (Dexamethasone)',
  name: 'Dexamethasone',
  tradeName: 'Decadron',
  smiles: 'CC1CC2C3CCC4=CC(=O)C=CC4(C3(C(CC2(C1(C(=O)CO)O)C)O)F)C',
  canonical_smiles: 'CC1CC2C3CCC4=CC(=O)C=CC4(C3(C(CC2(C1(C(=O)CO)O)C)O)F)C',
  canonicalSmiles: 'CC1CC2C3CCC4=CC(=O)C=CC4(C3(C(CC2(C1(C(=O)CO)O)C)O)F)C',
  cid: 5743,
  mw: 392.46,
  logP: 1.8,
  chemicalClass: '9-alpha-Fluoro-16-alpha-methyl-corticosteroid',
  pharmacologicalClass: 'Highly Potent Long-Acting Glucocorticoid',
  target: 'Glucocorticoid Receptor',
  target_receptor: 'Nuclear GR',
  reversibility: 'Reversible Agonist',
  drug_state: 'Active drug',
  route: 'Oral / IV / IM / Ophthalmic',
  keyFunctionalGroups: [
    '9-alpha-Fluoro substituent',
    '16-alpha-Methyl substituent',
    'Delta-1,4-diene-3-one',
    '11-beta-hydroxyl',
  ],
  pkPdHighlights: {
    onset: '1-2 hours',
    duration: '36-72 hours (long-acting)',
    halfLife: '3-4.5 hours (plasma), 36-54 hours (tissue)',
    elimination: 'Hepatic CYP3A4 6beta-hydroxylation',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    '9-alpha-fluorine dramatically increases glucocorticoid potency (~25-30x) by inductively withdrawing electrons, strengthening the hydrogen bond donated by the 11-beta-OH. The 16-alpha-methyl group sterically shields position 17, completely negating mineralocorticoid salt retention (salt retention = 0).',
  moa_summary:
    'Extremely potent synthetic glucocorticoid lacking mineralocorticoid activity, indicated for severe inflammation, croup, and acute asthma exacerbations.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/5743/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5743',
};

export const ALDOSTERONE_STRUCTURE: ChemicalStructure = {
  id: 'aldosterone',
  document_label: 'Structure VI (Aldosterone)',
  name: 'Aldosterone',
  tradeName: 'Endogenous Mineralocorticoid',
  smiles: 'CC12CCC(=O)C=C1CCC3C2C(CC4(C3CC(C4(C(=O)CO)O)=O)C=O)O',
  canonical_smiles: 'CC12CCC(=O)C=C1CCC3C2C(CC4(C3CC(C4(C(=O)CO)O)=O)C=O)O',
  canonicalSmiles: 'CC12CCC(=O)C=C1CCC3C2C(CC4(C3CC(C4(C(=O)CO)O)=O)C=O)O',
  cid: 5839,
  mw: 360.44,
  logP: 1.1,
  chemicalClass: 'Natural Mineralocorticoid (C18-Aldehyde)',
  pharmacologicalClass: 'Mineralocorticoid Receptor Agonist (Endogenous)',
  target: 'Mineralocorticoid Receptor (MR / NR3C2)',
  target_receptor: 'Renal distal tubule and collecting duct MR',
  reversibility: 'Reversible Agonist',
  drug_state: 'Active hormone',
  route: 'Endogenous / Experimental',
  keyFunctionalGroups: [
    '18-Aldehyde (hemiacetal with 11-beta-OH)',
    'Delta-4-3-ketone',
    '21-hydroxy-20-keto chain',
    'Lack of 17-alpha-OH',
  ],
  pkPdHighlights: {
    onset: '1-2 hours',
    duration: '6-8 hours',
    halfLife: '15-20 minutes',
    elimination: 'Hepatic reduction to tetrahydroaldosterone glucuronide',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Possesses an 18-aldehyde that forms a cyclic hemiacetal with the 11-beta-OH. Lacks a 17-alpha-OH group. Exhibits 3000-fold higher mineralocorticoid potency than cortisol with virtually zero anti-inflammatory activity.',
  moa_summary:
    'Regulates electrolyte and fluid homeostasis by stimulating renal ENaC and Na+/K+-ATPase expression in collecting duct principal cells.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/5839/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5839',
};

export const TRIAMCINOLONE_ACETONIDE_STRUCTURE: ChemicalStructure = {
  id: 'triamcinolone_acetonide',
  document_label: 'Structure I (Triamcinolone acetonide)',
  name: 'Triamcinolone acetonide',
  tradeName: 'Kenalog / Nasacort',
  smiles: 'CC1(OC2CC3C4CCC5=CC(=O)C=CC5(C4(C(CC3(C2(O1)C(=O)CO)C)O)F)C)C',
  canonical_smiles: 'CC1(OC2CC3C4CCC5=CC(=O)C=CC5(C4(C(CC3(C2(O1)C(=O)CO)C)O)F)C)C',
  canonicalSmiles: 'CC1(OC2CC3C4CCC5=CC(=O)C=CC5(C4(C(CC3(C2(O1)C(=O)CO)C)O)F)C)C',
  cid: 6436,
  mw: 434.50,
  logP: 2.5,
  chemicalClass: '16,17-Acetonide Ketal Corticosteroid',
  pharmacologicalClass: 'Inhaled / Topical Glucocorticoid',
  target: 'Glucocorticoid Receptor',
  target_receptor: 'Airway and cutaneous GR',
  reversibility: 'Reversible Agonist',
  drug_state: 'Active drug',
  route: 'Inhalation / Nasal / Topical / Intra-articular',
  keyFunctionalGroups: [
    '16-alpha,17-alpha-cyclic acetonide ketal',
    '9-alpha-fluoro substituent',
    '11-beta-hydroxyl',
    'Delta-1,4-diene-3-one',
  ],
  pkPdHighlights: {
    onset: 'Delayed genomic onset (hours)',
    duration: 'Local depot retention',
    halfLife: '2-3 hours (plasma)',
    elimination: 'Hepatic CYP3A4 oxidation',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Formation of an acetonide (cyclic isopropylidene ketal) across 16-alpha and 17-alpha dramatically increases lipophilicity and local topical/airway potency while eliminating mineralocorticoid salt retention.',
  moa_summary:
    'High-potency lipophilic glucocorticoid engineered for local anti-inflammatory action in asthma, rhinitis, and dermatoses with minimal systemic side effects.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/6436/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/6436',
};

export const BECLOMETHASONE_DIPROPIONATE_STRUCTURE: ChemicalStructure = {
  id: 'beclomethasone_dipropionate',
  document_label: 'Structure II (Beclomethasone dipropionate)',
  name: 'Beclomethasone dipropionate',
  tradeName: 'QVAR / Beconase',
  smiles: 'CCC(=O)OCC(=O)C1(C(CC2C1(CC(C3(C2CCC4=CC(=O)C=CC43C)Cl)O)C)C)OC(=O)CC',
  canonical_smiles: 'CCC(=O)OCC(=O)C1(C(CC2C1(CC(C3(C2CCC4=CC(=O)C=CC43C)Cl)O)C)C)OC(=O)CC',
  canonicalSmiles: 'CCC(=O)OCC(=O)C1(C(CC2C1(CC(C3(C2CCC4=CC(=O)C=CC43C)Cl)O)C)C)OC(=O)CC',
  cid: 21700,
  mw: 521.0,
  logP: 3.5,
  chemicalClass: '17,21-Diester Corticosteroid Prodrug',
  pharmacologicalClass: 'Inhaled Corticosteroid (ICS) Prodrug',
  target: 'Glucocorticoid Receptor (via 17-monopropionate)',
  target_receptor: 'Airway epithelial and smooth muscle GR',
  reversibility: 'Reversible Agonist',
  drug_state: 'Prodrug',
  route: 'Inhalation / Nasal',
  keyFunctionalGroups: [
    '17-alpha,21-dipropionate diester',
    '9-alpha-chloro group',
    '16-beta-methyl group',
    '11-beta-hydroxyl',
  ],
  pkPdHighlights: {
    onset: '1-2 days (clinical anti-inflammatory)',
    duration: '12 hours (BID)',
    halfLife: '0.5 hr (BDP), 2.7 hr (17-BMP)',
    elimination: 'Airway carboxylesterases to 17-BMP; hepatic CYP3A4',
    bioactivation: 'Cleaved by pulmonary esterases to beclomethasone 17-monopropionate (17-BMP)',
  },
  sarNotes:
    'Lipophilic diester prodrug. Upon inhalation into the lungs, carboxylesterases cleave the C21-propionate ester, generating beclomethasone 17-monopropionate (17-BMP), which has ~25-fold higher affinity for GR than parent BDP. Swallowed drug is extensively metabolized during first-pass, preventing systemic toxicity.',
  moa_summary:
    'Inhaled diester prodrug bioactivated in lung tissue to potent 17-monopropionate, providing targeted airway anti-inflammatory therapy.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/21700/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/21700',
};

export const FLUTICASONE_PROPIONATE_STRUCTURE: ChemicalStructure = {
  id: 'fluticasone_propionate',
  document_label: 'Structure III (Fluticasone propionate)',
  name: 'Fluticasone propionate',
  tradeName: 'Flovent / Flonase',
  smiles: 'CCC(=O)OC1(C(CC2C1(CC(C3(C2CC(C4=CC(=O)C=CC43C)F)F)O)C)C)C(=O)SCF',
  canonical_smiles: 'CCC(=O)OC1(C(CC2C1(CC(C3(C2CC(C4=CC(=O)C=CC43C)F)F)O)C)C)C(=O)SCF',
  canonicalSmiles: 'CCC(=O)OC1(C(CC2C1(CC(C3(C2CC(C4=CC(=O)C=CC43C)F)F)O)C)C)C(=O)SCF',
  cid: 444036,
  mw: 500.6,
  logP: 4.2,
  chemicalClass: 'Fluorinated 17-beta-Carbothioate Soft Steroid',
  pharmacologicalClass: 'Inhaled Corticosteroid (ICS) / Soft Steroid',
  target: 'Glucocorticoid Receptor',
  target_receptor: 'Airway mucosal GR',
  reversibility: 'Reversible Agonist',
  drug_state: 'Active drug (soft steroid)',
  route: 'Inhalation / Nasal / Topical',
  keyFunctionalGroups: [
    '17-beta-(fluoromethylthio)carbonyl group (carbothioate)',
    '17-alpha-propionate ester',
    '6-alpha,9-alpha-difluoro substituents',
    '16-alpha-methyl group',
  ],
  pkPdHighlights: {
    onset: '1-2 days for clinical efficacy',
    duration: '12-24 hours',
    halfLife: '7.8 hours',
    elimination: 'Hepatic CYP3A4 cleavage of carbothioate to inactive 17beta-carboxylic acid (<1% oral bioavailability)',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Classic soft steroid: possesses exceptional local GR binding affinity (3-fold higher than dexamethasone) due to the lipophilic C17-beta-S-CH2F fluoromethyl carbothioate. Swallowed drug undergoes >99% first-pass hepatic metabolism by CYP3A4 to an inert 17-beta-carboxylic acid metabolite, virtually eliminating systemic side effects.',
  moa_summary:
    'Soft steroid delivering high local anti-inflammatory potency in the lung with negligible systemic bioavailability due to rapid CYP3A4 inactivation.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/444036/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/444036',
};

export const FLUTICASONE_FUROATE_STRUCTURE: ChemicalStructure = {
  id: 'fluticasone_furoate',
  document_label: 'Fluticasone furoate',
  name: 'Fluticasone furoate',
  tradeName: 'Arnuity Ellipta / Component of Breo & Trelegy',
  smiles: 'CC1CC2C3CC(C4=CC(=O)C=CC4(C3(C(CC2(C1(C(=O)SCF)OC(=O)c5ccco5)C)O)F)C)F',
  canonical_smiles: 'CC1CC2C3CC(C4=CC(=O)C=CC4(C3(C(CC2(C1(C(=O)SCF)OC(=O)c5ccco5)C)O)F)C)F',
  canonicalSmiles: 'CC1CC2C3CC(C4=CC(=O)C=CC4(C3(C(CC2(C1(C(=O)SCF)OC(=O)c5ccco5)C)O)F)C)F',
  cid: 9854489,
  mw: 538.6,
  logP: 4.6,
  chemicalClass: '17-alpha-Furoate 17-beta-Carbothioate Soft Steroid',
  pharmacologicalClass: 'Ultra-Potent Once-Daily Inhaled Corticosteroid',
  target: 'Glucocorticoid Receptor',
  target_receptor: 'Airway GR',
  reversibility: 'Reversible with very slow dissociation',
  drug_state: 'Active drug',
  route: 'Inhalation (Once Daily)',
  keyFunctionalGroups: [
    '17-alpha-2-furoate ester',
    '17-beta-fluoromethyl carbothioate',
    '6-alpha,9-alpha-difluoro substituents',
    '11-beta-hydroxyl group',
  ],
  pkPdHighlights: {
    onset: 'Delayed genomic onset',
    duration: '24 hours (once daily)',
    halfLife: '15 hours',
    elimination: 'Hepatic CYP3A4 hydrolysis (<0.1% oral bioavailability)',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Replaces the 17-alpha-propionate of fluticasone with a lipophilic 2-furoate ester. Confers exceptionally high affinity for GR (higher than fluticasone propionate) and slower dissociation kinetics, enabling once-daily administration.',
  moa_summary:
    'Once-daily inhaled corticosteroid exhibiting high GR affinity and prolonged tissue retention for asthma and COPD maintenance.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/9854489/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/9854489',
};

export const MOMETASONE_FUROATE_STRUCTURE: ChemicalStructure = {
  id: 'mometasone_furoate',
  document_label: 'Mometasone furoate',
  name: 'Mometasone furoate',
  tradeName: 'Asmanex Twisthaler / Nasonex',
  smiles: 'CC1CC2C3CCC4=CC(=O)C=CC4(C3(C(CC2(C1(C(=O)CCl)OC(=O)c5ccco5)C)O)Cl)C',
  canonical_smiles: 'CC1CC2C3CCC4=CC(=O)C=CC4(C3(C(CC2(C1(C(=O)CCl)OC(=O)c5ccco5)C)O)Cl)C',
  canonicalSmiles: 'CC1CC2C3CCC4=CC(=O)C=CC4(C3(C(CC2(C1(C(=O)CCl)OC(=O)c5ccco5)C)O)Cl)C',
  cid: 441336,
  mw: 521.43,
  logP: 4.3,
  chemicalClass: '9,21-Dichloro-17-furoate Corticosteroid',
  pharmacologicalClass: 'Highly Potent Inhaled / Topical Corticosteroid',
  target: 'Glucocorticoid Receptor',
  target_receptor: 'Airway mucosal and cutaneous GR',
  reversibility: 'Reversible Agonist',
  drug_state: 'Active drug',
  route: 'Inhalation / Nasal / Topical',
  keyFunctionalGroups: [
    '17-alpha-2-furoate ester',
    '21-chloro group (-CH2Cl)',
    '9-alpha-chloro group',
    '16-alpha-methyl group',
  ],
  pkPdHighlights: {
    onset: '1-2 days',
    duration: '24 hours (QD/BID)',
    halfLife: '5 hours',
    elimination: 'Hepatic CYP3A4 metabolism (<1% oral bioavailability)',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Features chlorine atoms at positions 9-alpha and 21 instead of hydroxyls, paired with a lipophilic 17-alpha-furoate ester. Imparts extremely high GR affinity, while swallowed drug is virtually non-bioavailable (<1%).',
  moa_summary:
    'Chlorinated furoate corticosteroid with very high GR binding affinity and minimal systemic bioavailability for once-daily asthma management.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/441336/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/441336',
};

export const CICLESONIDE_STRUCTURE: ChemicalStructure = {
  id: 'ciclesonide',
  document_label: 'Structure V (Ciclesonide)',
  name: 'Ciclesonide',
  tradeName: 'Alvesco / Omnaris',
  smiles: 'CC(C)C(=O)OCC(=O)C12CC(C3C(C1(OC(O2)C4CCCCC4)O)CC(C5(C3CCC6=CC(=O)C=CC65C)O)C)C',
  canonical_smiles: 'CC(C)C(=O)OCC(=O)C12CC(C3C(C1(OC(O2)C4CCCCC4)O)CC(C5(C3CCC6=CC(=O)C=CC65C)O)C)C',
  canonicalSmiles: 'CC(C)C(=O)OCC(=O)C12CC(C3C(C1(OC(O2)C4CCCCC4)O)CC(C5(C3CCC6=CC(=O)C=CC65C)O)C)C',
  cid: 6918155,
  mw: 540.7,
  logP: 4.8,
  chemicalClass: 'Cyclic Acetal Soft Steroid Prodrug',
  pharmacologicalClass: 'Inhaled Corticosteroid (ICS) Prodrug',
  target: 'Glucocorticoid Receptor (via des-ciclesonide)',
  target_receptor: 'Airway mucosal GR',
  reversibility: 'Reversible Agonist',
  drug_state: 'Prodrug',
  route: 'Inhalation / Nasal',
  keyFunctionalGroups: [
    '16,17-cyclohexylmethylene acetal ring',
    'C21-isobutyrate ester prodrug',
    'Delta-1,4-diene-3-one',
    '11-beta-hydroxyl',
  ],
  pkPdHighlights: {
    onset: 'Delayed genomic onset',
    duration: '24 hours (QD)',
    halfLife: '0.7 hr (parent), 3.5 hr (des-ciclesonide)',
    elimination: 'Pulmonary esterases to des-ciclesonide; hepatic CYP3A4 (<1% oral bioavailability)',
    bioactivation: 'Activated in bronchial epithelium by carboxylesterase 1 to des-ciclesonide (C21-OH)',
  },
  sarNotes:
    'Inhaled as an inactive 21-isobutyrate ester prodrug. Airway carboxylesterase 1 cleaves the ester to form des-ciclesonide (RM1), which exhibits 100-fold greater GR affinity. Swallowed drug is unactivated and cleared by liver, minimizing oral candidiasis and dysphonia.',
  moa_summary:
    'On-site activated prodrug yielding potent active metabolite specifically within airway epithelial cells, reducing local oropharyngeal side effects.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/6918155/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/6918155',
};

export const CLOBETASOL_PROPIONATE_STRUCTURE: ChemicalStructure = {
  id: 'clobetasol_propionate',
  document_label: 'Structure VI (Clobetasol propionate)',
  name: 'Clobetasol propionate',
  tradeName: 'Temovate / Clobex',
  smiles: 'CCC(=O)OC1(C(CC2C1(CC(C3(C2CCC4=CC(=O)C=CC43C)F)O)C)C)C(=O)CCl',
  canonical_smiles: 'CCC(=O)OC1(C(CC2C1(CC(C3(C2CCC4=CC(=O)C=CC43C)F)O)C)C)C(=O)CCl',
  canonicalSmiles: 'CCC(=O)OC1(C(CC2C1(CC(C3(C2CCC4=CC(=O)C=CC43C)F)O)C)C)C(=O)CCl',
  cid: 32798,
  mw: 466.97,
  logP: 3.8,
  chemicalClass: '21-Chloro-9-fluoro Corticosteroid',
  pharmacologicalClass: 'Super-High Potency Topical Corticosteroid',
  target: 'Glucocorticoid Receptor',
  target_receptor: 'Dermal GR',
  reversibility: 'Reversible Agonist',
  drug_state: 'Active drug',
  route: 'Topical (Class I / Superpotent)',
  keyFunctionalGroups: [
    '21-Chloromethyl ketone (-COCH2Cl)',
    '17-alpha-propionate ester',
    '9-alpha-fluoro substituent',
    '16-beta-methyl group',
  ],
  pkPdHighlights: {
    onset: 'Rapid cutaneous action',
    duration: '12-24 hours',
    halfLife: 'Hepatic clearance if absorbed',
    elimination: 'Hepatic CYP3A4 oxidation',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Substitution of the 21-hydroxyl group with chlorine creates an exceptionally potent, highly lipophilic Class I super-high potency topical corticosteroid. The 21-chloro group eliminates mineralocorticoid activity while dramatically boosting GR potency.',
  moa_summary:
    'Superpotent Class I topical corticosteroid for severe dermatoses, demonstrating the dramatic potency enhancement of 21-chlorination.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/32798/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/32798',
};

export const HYDROCORTISONE_SODIUM_PHOSPHATE_STRUCTURE: ChemicalStructure = {
  id: 'hydrocortisone_sodium_phosphate',
  document_label: 'Structure IV (Hydrocortisone sodium phosphate)',
  name: 'Hydrocortisone sodium phosphate',
  tradeName: 'Hydrocortone Phosphate',
  smiles: 'CC12CCC(=O)C=C1CCC3C2C(CC4(C3CCC4(C(=O)COP(=O)(O)O)O)C)O',
  canonical_smiles: 'CC12CCC(=O)C=C1CCC3C2C(CC4(C3CCC4(C(=O)COP(=O)(O)O)O)C)O',
  canonicalSmiles: 'CC12CCC(=O)C=C1CCC3C2C(CC4(C3CCC4(C(=O)COP(=O)(O)O)O)C)O',
  cid: 441407,
  mw: 442.4,
  logP: -1.2,
  chemicalClass: 'Hydrophilic C21-Phosphate Ester Prodrug',
  pharmacologicalClass: 'Water-Soluble Parenteral Corticosteroid Prodrug',
  target: 'Glucocorticoid Receptor (via hydrocortisone)',
  target_receptor: 'Nuclear GR (after dephosphorylation)',
  reversibility: 'Reversible Agonist',
  drug_state: 'Prodrug',
  route: 'IV / IM Injection',
  keyFunctionalGroups: [
    'C21-monophosphate ester',
    'Disodium salt capability',
    '11-beta-hydroxyl',
    'Delta-4-3-ketone',
  ],
  pkPdHighlights: {
    onset: 'Rapid IV (cleaved in <5 min by alkaline phosphatase)',
    duration: '8-12 hours',
    halfLife: '<10 min (prodrug), 1.5 hr (hydrocortisone)',
    elimination: 'Endothelial/hepatic alkaline phosphatase cleavage to free cortisol',
    bioactivation: 'Rapidly hydrolyzed by endogenous alkaline phosphatase to hydrocortisone',
  },
  sarNotes:
    'Esterification of the C21-OH with phosphoric acid creates a highly polar, water-soluble prodrug (>500 mg/mL). Ideal for rapid IV bolus administration in acute emergency situations (status asthmaticus, anaphylaxis, acute adrenal insufficiency). NOT for inhaled maintenance!',
  moa_summary:
    'Hydrophilic phosphate ester prodrug formulated for rapid emergency IV injection, rapidly dephosphorylated in vivo to active hydrocortisone.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/441407/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/441407',
};

export const HYDROCORTISONE_SODIUM_SUCCINATE_STRUCTURE: ChemicalStructure = {
  id: 'hydrocortisone_sodium_succinate',
  document_label: 'Drug B (Hydrocortisone sodium succinate)',
  name: 'Hydrocortisone sodium succinate',
  tradeName: 'Solu-Cortef',
  smiles: 'CC12CCC(=O)C=C1CCC3C2C(CC4(C3CCC4(C(=O)COC(=O)CCC(=O)O)O)C)O',
  canonical_smiles: 'CC12CCC(=O)C=C1CCC3C2C(CC4(C3CCC4(C(=O)COC(=O)CCC(=O)O)O)C)O',
  canonicalSmiles: 'CC12CCC(=O)C=C1CCC3C2C(CC4(C3CCC4(C(=O)COC(=O)CCC(=O)O)O)C)O',
  cid: 16623,
  mw: 462.5,
  logP: 0.3,
  chemicalClass: 'Hydrophilic C21-Hemisuccinate Ester Prodrug',
  pharmacologicalClass: 'Water-Soluble Parenteral Corticosteroid Prodrug',
  target: 'Glucocorticoid Receptor (via hydrocortisone)',
  target_receptor: 'Nuclear GR (after esterase cleavage)',
  reversibility: 'Reversible Agonist',
  drug_state: 'Prodrug',
  route: 'IV / IM Injection',
  keyFunctionalGroups: [
    'C21-hemisuccinate ester (-COCH2CH2COO-Na+)',
    'Terminal carboxylate salt',
    '11-beta-hydroxyl',
    'Delta-4-3-ketone',
  ],
  pkPdHighlights: {
    onset: 'Rapid IV injection, cleaved within 15-30 min',
    duration: '8-12 hours',
    halfLife: '15-30 min (prodrug)',
    elimination: 'Plasma and tissue esterase cleavage releasing free hydrocortisone',
    bioactivation: 'Rapidly hydrolyzed by plasma esterases to free hydrocortisone',
  },
  sarNotes:
    'Esterification of C21 with succinic acid introduces a terminal carboxylic acid that forms a highly soluble sodium salt (>500 mg/mL). Formulated as a lyophilized powder reconstituted for emergency IV/IM injection in status asthmaticus and adrenal crisis.',
  moa_summary:
    'Water-soluble hemisuccinate prodrug for emergency parenteral administration, rapidly cleaved by esterases to active hydrocortisone.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/16623/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/16623',
};

export const THEOPHYLLINE_STRUCTURE: ChemicalStructure = {
  id: 'theophylline',
  document_label: 'Drug A (Theophylline)',
  name: 'Theophylline',
  tradeName: 'Theo-24 / Uniphyl',
  smiles: 'CN1C2=C(C(=O)N(C1=O)C)NC=N2',
  canonical_smiles: 'CN1C2=C(C(=O)N(C1=O)C)NC=N2',
  canonicalSmiles: 'CN1C2=C(C(=O)N(C1=O)C)NC=N2',
  cid: 2153,
  mw: 180.16,
  logP: -0.0,
  chemicalClass: 'Methylxanthine (1,3-Dimethylxanthine)',
  pharmacologicalClass: 'Nonselective Phosphodiesterase (PDE) Inhibitor & Adenosine Antagonist',
  target: 'Phosphodiesterase-3, 4, 5 (PDE) & Adenosine A1, A2A Receptors',
  target_receptor: 'Intracellular PDE catalytic sites & cell-surface adenosine GPCRs',
  reversibility: 'Reversible Competitive Inhibitor',
  drug_state: 'Active drug',
  route: 'Oral / IV (as Aminophylline)',
  keyFunctionalGroups: [
    'Purine dione (xanthine) core',
    'N1-methyl and N3-methyl groups',
    'Unsubstituted N7 position',
    'Imidazopyrimidine bicyclic ring',
  ],
  pkPdHighlights: {
    onset: '1-2 hours',
    duration: '12-24 hours (ER formulations)',
    halfLife: '8 hours (adult non-smokers; 4-5 hr in smokers)',
    elimination: 'Extensive hepatic CYP1A2 (80%), CYP2E1, CYP3A4 metabolism',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    '1,3-dimethylxanthine. Nonselectively inhibits PDE enzymes (elevating cAMP and cGMP) and antagonizes cell-surface adenosine A1 and A2A receptors. Has a narrow therapeutic index (10-20 mcg/mL), requiring therapeutic drug monitoring (TDM). Toxicity causes cardiac arrhythmias (PDE3 inhibition) and seizures (adenosine antagonism).',
  moa_summary:
    'Nonselective PDE inhibitor and adenosine receptor antagonist causing modest bronchodilation and anti-inflammatory effects with significant toxicity risks.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/2153/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/2153',
};

export const ROFLUMILAST_STRUCTURE: ChemicalStructure = {
  id: 'roflumilast',
  document_label: 'Drug B (Roflumilast)',
  name: 'Roflumilast',
  tradeName: 'Daliresp / Daxas',
  smiles: 'O=C(Nc1c(Cl)cncc1Cl)c2ccc(OC(F)F)c(OCC3CC3)c2',
  canonical_smiles: 'O=C(Nc1c(Cl)cncc1Cl)c2ccc(OC(F)F)c(OCC3CC3)c2',
  canonicalSmiles: 'O=C(Nc1c(Cl)cncc1Cl)c2ccc(OC(F)F)c(OCC3CC3)c2',
  cid: 449193,
  mw: 403.2,
  logP: 3.3,
  chemicalClass: 'Dichloropyridine Benzamide',
  pharmacologicalClass: 'Selective Phosphodiesterase-4 (PDE4) Inhibitor',
  target: 'Phosphodiesterase-4 (PDE4)',
  target_receptor: 'Intracellular PDE4 catalytic site in inflammatory cells',
  reversibility: 'Reversible Competitive Inhibitor',
  drug_state: 'Active drug (and active N-oxide metabolite)',
  route: 'Oral (Once Daily)',
  keyFunctionalGroups: [
    '3,5-Dichloropyridine-4-carboxamide ring',
    'Difluoromethoxy ether substituent',
    'Cyclopropylmethoxy substituent',
    'Benzamide linker',
  ],
  pkPdHighlights: {
    onset: 'Delayed clinical benefit (weeks)',
    duration: '24 hours (once daily)',
    halfLife: '17 hours (parent), 30 hours (N-oxide metabolite)',
    elimination: 'Hepatic CYP3A4 and CYP1A2 N-oxidation to active roflumilast N-oxide',
    bioactivation: 'Active parent; bioactivated to equipotent N-oxide metabolite',
  },
  sarNotes:
    'Potent and selective inhibitor of PDE4 (IC50 ~0.8 nM), sparing PDE1, PDE2, PDE3, and PDE5, and lacking adenosine receptor antagonism. Does NOT cause the cardiac tachyarrhythmias seen with theophylline. Indicated to reduce COPD exacerbations in severe COPD with chronic bronchitis.',
  moa_summary:
    'Selective PDE4 inhibitor suppressing cyclic AMP breakdown in inflammatory leukocytes (neutrophils, macrophages, CD8+ lymphocytes) to reduce COPD exacerbations.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/449193/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/449193',
};

export const ENSIFENTRINE_STRUCTURE: ChemicalStructure = {
  id: 'ensifentrine',
  document_label: 'Ensifentrine',
  name: 'Ensifentrine',
  tradeName: 'Ohtuvayre',
  smiles: 'CC1=CC(=C(C(=C1)C)N=C2C=C3C4=CC(=C(C=C4CCN3C(=O)N2CCNC(=O)N)OC)OC)C',
  canonical_smiles: 'CC1=CC(=C(C(=C1)C)N=C2C=C3C4=CC(=C(C=C4CCN3C(=O)N2CCNC(=O)N)OC)OC)C',
  canonicalSmiles: 'CC1=CC(=C(C(=C1)C)N=C2C=C3C4=CC(=C(C=C4CCN3C(=O)N2CCNC(=O)N)OC)OC)C',
  cid: 9934746,
  mw: 477.6,
  logP: 2.7,
  chemicalClass: 'Pyrimido-isoquinoline derivative',
  pharmacologicalClass: 'First-in-Class Dual PDE3 and PDE4 Inhibitor',
  target: 'Phosphodiesterase-3 and Phosphodiesterase-4',
  target_receptor: 'Airway smooth muscle PDE3 & inflammatory cell PDE4',
  reversibility: 'Reversible Competitive Inhibitor',
  drug_state: 'Active drug',
  route: 'Inhalation (Nebulized BID)',
  keyFunctionalGroups: [
    'Dimethoxy-substituted pyrimido-isoquinoline core',
    '2,4,6-Trimethylphenyl (mesityl) substituent',
    'Diketopiperazine / urea ring system',
    'Tertiary amines',
  ],
  pkPdHighlights: {
    onset: '15-30 minutes',
    duration: '12 hours (BID)',
    halfLife: '10-12 hours',
    elimination: 'Hepatic metabolism and renal/fecal clearance',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Dual inhibitor combining PDE3 inhibition (relaxing airway smooth muscle to induce bronchodilation) with PDE4 inhibition (suppressing inflammatory cell activation). Inhaled nebulized route delivers high lung concentrations while avoiding systemic cardiovascular toxicities of oral PDE3/4 inhibitors.',
  moa_summary:
    'First-in-class dual PDE3/PDE4 inhibitor providing both bronchodilation (via PDE3) and anti-inflammatory activity (via PDE4) in COPD.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/9934746/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/9934746',
};

export const ZILEUTON_STRUCTURE: ChemicalStructure = {
  id: 'zileuton',
  document_label: 'Structure V (Zileuton)',
  name: 'Zileuton',
  tradeName: 'Zyflo / Zyflo CR',
  smiles: 'CC(C1=CC2=CC=CC=C2S1)N(C(=O)N)O',
  canonical_smiles: 'CC(C1=CC2=CC=CC=C2S1)N(C(=O)N)O',
  canonicalSmiles: 'CC(C1=CC2=CC=CC=C2S1)N(C(=O)N)O',
  cid: 60490,
  mw: 236.29,
  logP: 1.8,
  chemicalClass: 'Hydroxyurea / Benzo[b]thiophene derivative',
  pharmacologicalClass: '5-Lipoxygenase (5-LOX) Inhibitor',
  target: '5-Lipoxygenase (5-LOX)',
  target_receptor: 'Catalytic non-heme iron (Fe3+) in 5-LOX active site',
  reversibility: 'Reversible Redox / Iron-Chelating Inhibitor',
  drug_state: 'Active drug',
  route: 'Oral (QID or BID CR)',
  keyFunctionalGroups: [
    'N-hydroxyurea moiety (-N(OH)CONH2)',
    'Benzo[b]thiophene bicyclic ring',
    'Alpha-methyl ethyl linker',
    'Iron-chelating bidentate hydroxyl',
  ],
  pkPdHighlights: {
    onset: '1-2 hours',
    duration: '6-12 hours',
    halfLife: '2.5 hours',
    elimination: 'Hepatic glucuronidation (UGT1A6/1A9) and CYP1A2/2C9',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Features an N-hydroxyurea pharmacophore that chelates the active-site catalytic non-heme iron atom (Fe3+) of 5-lipoxygenase, reducing it to the inactive Fe2+ state. Halts the entire leukotriene cascade at the first step, blocking synthesis of both LTB4 and cysteinyl leukotrienes (LTC4, LTD4, LTE4). Requires liver function monitoring due to hepatotoxicity risk.',
  moa_summary:
    'Direct 5-lipoxygenase inhibitor blocking conversion of arachidonic acid to 5-HPETE and LTA4, preventing formation of all leukotrienes.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/60490/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/60490',
};

export const MONTELUKAST_STRUCTURE: ChemicalStructure = {
  id: 'montelukast',
  document_label: 'Structure IV (Montelukast)',
  name: 'Montelukast sodium',
  tradeName: 'Singulair',
  smiles: 'CC(C)(c1ccccc1CCC(SCC2(CC2)CC(=O)O)c3cccc(/C=C/c4ccc5ccc(Cl)cc5n4)c3)O',
  canonical_smiles: 'CC(C)(c1ccccc1CCC(SCC2(CC2)CC(=O)O)c3cccc(/C=C/c4ccc5ccc(Cl)cc5n4)c3)O',
  canonicalSmiles: 'CC(C)(c1ccccc1CCC(SCC2(CC2)CC(=O)O)c3cccc(/C=C/c4ccc5ccc(Cl)cc5n4)c3)O',
  cid: 5281040,
  mw: 586.18,
  logP: 5.8,
  chemicalClass: 'Quinoline / Cyclopropylthioalkanoic acid',
  pharmacologicalClass: 'Cysteinyl Leukotriene Receptor 1 (CysLT1) Antagonist',
  target: 'CysLT1 Receptor',
  target_receptor: 'Airway smooth muscle and endothelial CysLT1 GPCR',
  reversibility: 'Reversible Competitive Antagonist',
  drug_state: 'Active drug',
  route: 'Oral (Once Daily at bedtime)',
  keyFunctionalGroups: [
    '7-Chloroquinoline bicyclic ring',
    '1-(Mercaptomethyl)cyclopropaneacetic acid side chain',
    'Tertiary alcohol group',
    '(E)-styryl aromatic bridge',
  ],
  pkPdHighlights: {
    onset: '3-4 hours',
    duration: '24 hours (once daily)',
    halfLife: '2.7-5.5 hours',
    elimination: 'Extensive hepatic CYP2C8 and CYP3A4 metabolism, biliary excretion',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Mimics the tripartite structure of LTD4: contains a lipophilic quinoline tail (mimicking the lipid tail), an aromatic spacer, and an acidic 1-(mercaptomethyl)cyclopropaneacetate group (mimicking the polar peptide carboxylate). Competitively blocks CysLT1 receptors with high affinity.',
  moa_summary:
    'Selective CysLT1 receptor antagonist preventing LTD4-mediated bronchoconstriction, mucus hypersecretion, and airway edema in asthma and allergic rhinitis.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/5281040/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5281040',
};

export const ZAFIRLUKAST_STRUCTURE: ChemicalStructure = {
  id: 'zafirlukast',
  document_label: 'Zafirlukast',
  name: 'Zafirlukast',
  tradeName: 'Accolate',
  smiles: 'CC1=CC=CC=C1S(=O)(=O)NC(=O)C2=CC(=C(C=C2)CC3=CN(C4=C3C=C(C=C4)NC(=O)OC5CCCC5)C)OC',
  canonical_smiles: 'CC1=CC=CC=C1S(=O)(=O)NC(=O)C2=CC(=C(C=C2)CC3=CN(C4=C3C=C(C=C4)NC(=O)OC5CCCC5)C)OC',
  canonicalSmiles: 'CC1=CC=CC=C1S(=O)(=O)NC(=O)C2=CC(=C(C=C2)CC3=CN(C4=C3C=C(C=C4)NC(=O)OC5CCCC5)C)OC',
  cid: 5717,
  mw: 575.68,
  logP: 4.8,
  chemicalClass: 'Sulfonamide / Indole Carbamate derivative',
  pharmacologicalClass: 'Cysteinyl Leukotriene Receptor 1 (CysLT1) Antagonist',
  target: 'CysLT1 Receptor',
  target_receptor: 'Airway CysLT1 receptor',
  reversibility: 'Reversible Competitive Antagonist',
  drug_state: 'Active drug',
  route: 'Oral (BID on an empty stomach)',
  keyFunctionalGroups: [
    'Acylsulfonamide acidic linker',
    'Indole bicyclic core',
    'Carbamate ester moiety',
    'N-methyl amide',
  ],
  pkPdHighlights: {
    onset: '30 min - 2 hours',
    duration: '12 hours (BID)',
    halfLife: '10 hours',
    elimination: 'Hepatic CYP2C9 metabolism (potent CYP2C9 and CYP3A4 inhibitor; interacts with warfarin)',
    bioactivation: 'Active as administered',
  },
  sarNotes:
    'Possesses an acidic acylsulfonamide moiety (pKa ~4.5) that mimics the carboxylate of leukotriene D4, paired with lipophilic indole and carbamate rings. Food reduces bioavailability by 40% (must take 1 hr before or 2 hr after meals). Inhibits CYP2C9, raising warfarin INR.',
  moa_summary:
    'Competitive CysLT1 receptor antagonist preventing cysteinyl leukotriene-mediated bronchoconstriction and airway vascular permeability.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/5717/PNG',
  pubchemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/5717',
};

// =============================================================================
// COMPLETE REGISTRY DICTIONARY (ALL 41 LANDMARK STRUCTURES)
// =============================================================================

export const RESPIRATORY_REVIEW_STRUCTURES: Record<string, ChemicalStructure> = {
  epinephrine: EPINEPHRINE_STRUCTURE,
  norepinephrine: NOREPINEPHRINE_STRUCTURE,
  isoproterenol: ISOPROTERENOL_STRUCTURE,
  dobutamine: DOBUTAMINE_STRUCTURE,
  albuterol: ALBUTEROL_STRUCTURE,
  levalbuterol: LEVALBUTEROL_STRUCTURE,
  pirbuterol: PIRBUTEROL_STRUCTURE,
  salmeterol: SALMETEROL_STRUCTURE,
  formoterol: FORMOTEROL_STRUCTURE,
  indacaterol: INDACATEROL_STRUCTURE,
  olodaterol: OLODATEROL_STRUCTURE,
  vilanterol: VILANTEROL_STRUCTURE,
  ipratropium: IPRATROPIUM_STRUCTURE,
  tiotropium: TIOTROPIUM_STRUCTURE,
  aclidinium: ACLIDINIUM_STRUCTURE,
  umeclidinium: UMECLIDINIUM_STRUCTURE,
  glycopyrrolate: GLYCOPYRROLATE_STRUCTURE,
  darifenacin: DARIFENACIN_STRUCTURE,
  trihexyphenidyl: TRIHEXYPHENIDYL_STRUCTURE,
  hydrocortisone: HYDROCORTISONE_STRUCTURE,
  cortisone: CORTISONE_STRUCTURE,
  prednisolone: PREDNISOLONE_STRUCTURE,
  prednisone: PREDNISONE_STRUCTURE,
  methylprednisolone: METHYLPREDNISOLONE_STRUCTURE,
  dexamethasone: DEXAMETHASONE_STRUCTURE,
  aldosterone: ALDOSTERONE_STRUCTURE,
  triamcinolone_acetonide: TRIAMCINOLONE_ACETONIDE_STRUCTURE,
  beclomethasone_dipropionate: BECLOMETHASONE_DIPROPIONATE_STRUCTURE,
  fluticasone_propionate: FLUTICASONE_PROPIONATE_STRUCTURE,
  fluticasone_furoate: FLUTICASONE_FUROATE_STRUCTURE,
  mometasone_furoate: MOMETASONE_FUROATE_STRUCTURE,
  ciclesonide: CICLESONIDE_STRUCTURE,
  clobetasol_propionate: CLOBETASOL_PROPIONATE_STRUCTURE,
  hydrocortisone_sodium_phosphate: HYDROCORTISONE_SODIUM_PHOSPHATE_STRUCTURE,
  hydrocortisone_sodium_succinate: HYDROCORTISONE_SODIUM_SUCCINATE_STRUCTURE,
  theophylline: THEOPHYLLINE_STRUCTURE,
  roflumilast: ROFLUMILAST_STRUCTURE,
  ensifentrine: ENSIFENTRINE_STRUCTURE,
  zileuton: ZILEUTON_STRUCTURE,
  montelukast: MONTELUKAST_STRUCTURE,
  zafirlukast: ZAFIRLUKAST_STRUCTURE,
};

// =============================================================================
// 9 COMPREHENSIVE REVIEW PAGES MATCHING REVIEW PAGES 1 - 9
// Grounded strictly in Dr. Rami A. Al-Horani's Fall 2026 Medicinal Chemistry lecture
// =============================================================================

export function getRespiratoryReviewPages(): ReviewPage[] {
  return [
    // =========================================================================
    // REVIEW PAGE 1: Combination Bronchodilators & Anti-inflammatory Regimens
    // =========================================================================
    {
      pageNumber: 1,
      pageTitle: 'Review Page 1: Combination Bronchodilators & Anti-inflammatory Regimens',
      title: 'Combination Bronchodilators & Anti-inflammatory Regimens',
      subtitle:
        'LAMA + LABA, ICS + LABA, and Triple Therapy (LAMA + LABA + ICS) in Asthma and COPD Management',
      sections: [
        {
          id: 'resp_p1_s1',
          sectionTitle: 'Review Page 1: Fixed-Dose Inhaled Combinations & Mechanistic Synergy',
          headerNote:
            'Evaluate the clinical rationales, individual molecular components, and pharmacological synergies of fixed-dose combination inhalers (Anoro Ellipta, Breo Ellipta, Stiolto Respimat, Trelegy Ellipta, Enerzair Breezhaler):',
          structures: [
            UMECLIDINIUM_STRUCTURE,
            VILANTEROL_STRUCTURE,
            FLUTICASONE_FUROATE_STRUCTURE,
            TIOTROPIUM_STRUCTURE,
            OLODATEROL_STRUCTURE,
            INDACATEROL_STRUCTURE,
            GLYCOPYRROLATE_STRUCTURE,
            MOMETASONE_FUROATE_STRUCTURE,
          ],
          questions: [
            {
              id: 101,
              questionNumberLabel: 'Question 1',
              type: 'matching',
              title: 'Fixed-Dose Combination Regimens Matching',
              questionStem:
                'Drag each signature chemical structure (Structure I - Structure V) into its corresponding fixed-dose combination inhaler regimen (Anoro Ellipta, Breo Ellipta, Stiolto Respimat, Trelegy Ellipta, Enerzair Breezhaler):',
              prompt:
                'Drag each signature chemical structure (Structure I - Structure V) into its corresponding fixed-dose combination inhaler regimen (Anoro Ellipta, Breo Ellipta, Stiolto Respimat, Trelegy Ellipta, Enerzair Breezhaler):',
              sourceReference: 'Respiratory Med Chem (Asthma/COPD) Review, Page 1, Question 1',
              sourcePageNumber: 1,
              structuresDisplayed: [
                UMECLIDINIUM_STRUCTURE,
                FLUTICASONE_FUROATE_STRUCTURE,
                OLODATEROL_STRUCTURE,
                VILANTEROL_STRUCTURE,
                INDACATEROL_STRUCTURE,
              ],
              matchingTargets: [
                {
                  id: 'target_anoro',
                  label: 'Anoro Ellipta (Umeclidinium + Vilanterol)',
                  acceptedStructureIds: ['umeclidinium', 'I'],
                  rationale:
                    'Anoro Ellipta combines Umeclidinium (LAMA) with Vilanterol trifenatate (LABA) for once-daily maintenance bronchodilation in COPD.',
                },
                {
                  id: 'target_breo',
                  label: 'Breo Ellipta (Fluticasone furoate + Vilanterol)',
                  acceptedStructureIds: ['fluticasone_furoate', 'II'],
                  rationale:
                    'Breo Ellipta combines Fluticasone furoate (high-potency ICS) with Vilanterol (LABA) for once-daily controller therapy in asthma and COPD.',
                },
                {
                  id: 'target_stiolto',
                  label: 'Stiolto Respimat (Tiotropium + Olodaterol)',
                  acceptedStructureIds: ['olodaterol', 'III'],
                  rationale:
                    'Stiolto Respimat delivers Tiotropium bromide (LAMA) and Olodaterol (ultra-LABA) via soft mist inhaler for once-daily COPD bronchodilation.',
                },
                {
                  id: 'target_trelegy',
                  label: 'Trelegy Ellipta (Umeclidinium + Fluticasone furoate + Vilanterol)',
                  acceptedStructureIds: ['vilanterol', 'IV'],
                  rationale:
                    'Trelegy Ellipta is a single-inhaler triple therapy (SITT) combining Umeclidinium (LAMA), Fluticasone furoate (ICS), and Vilanterol (LABA) for once-daily dosing.',
                },
                {
                  id: 'target_enerzair',
                  label: 'Enerzair Breezhaler (Indacaterol + Glycopyrrolate + Mometasone furoate)',
                  acceptedStructureIds: ['indacaterol', 'V'],
                  rationale:
                    'Enerzair Breezhaler is a once-daily triple combination containing Indacaterol acetate (ultra-LABA), Glycopyrronium bromide (LAMA), and Mometasone furoate (ICS).',
                },
              ],
              options: [
                'Anoro Ellipta: Umeclidinium (LAMA) + Vilanterol (LABA)',
                'Breo Ellipta: Fluticasone furoate (ICS) + Vilanterol (LABA)',
                'Stiolto Respimat: Tiotropium (LAMA) + Olodaterol (ultra-LABA)',
                'Trelegy Ellipta: Umeclidinium (LAMA) + Fluticasone furoate (ICS) + Vilanterol (LABA)',
                'Enerzair Breezhaler: Indacaterol (ultra-LABA) + Glycopyrrolate (LAMA) + Mometasone furoate (ICS)',
              ],
              correctAnswer:
                'Anoro = LAMA+LABA; Breo = ICS+LABA; Stiolto = LAMA+LABA; Trelegy = LAMA+ICS+LABA; Enerzair = LABA+LAMA+ICS',
              explanation:
                'Fixed-dose combination inhalers combine distinct pharmacological classes to produce synergistic bronchodilation and anti-inflammatory coverage while simplifying regimens to once-daily dosing for improved adherence.',
            },
            {
              id: 102,
              questionNumberLabel: 'Question 2',
              type: 'sub-statements',
              title: 'Mechanistic Synergy in Combination Regimens',
              sourceReference: 'Respiratory Med Chem (Asthma/COPD) Review, Page 1, Question 2',
              sourcePageNumber: 1,
              prompt:
                'Evaluate the following statements regarding the molecular pharmacology and synergy of LAMA, LABA, and ICS combinations:',
              subStatements: [
                {
                  id: 'p1_s1',
                  text: 'Corticosteroids upregulate gene transcription and cell-surface expression of beta-2 adrenergic receptors, reversing and preventing agonist-induced beta-2 receptor downregulation and tolerance (tachyphylaxis).',
                  isCorrect: true,
                  explanation:
                    'Inhaled corticosteroids bind the glucocorticoid receptor (GR) and transactivate the ADRB2 gene promoter via GRE response elements, increasing cell-surface beta-2 receptor density and reversing receptor desensitization caused by chronic LABA exposure.',
                },
                {
                  id: 'p1_s2',
                  text: 'Combining a LAMA (M3 antagonist) with a LABA (beta-2 agonist) produces synergistic bronchodilation through two independent signaling cascades: elevating intracellular cAMP (Gs) while simultaneously blocking bronchoconstrictor IP3/DAG/calcium mobilization (Gq).',
                  isCorrect: true,
                  explanation:
                    'Beta-2 agonists activate Gs-coupled adenylyl cyclase to elevate cAMP and activate PKA (promoting MLCK inhibition and calcium sequestration), while LAMA muscarinic antagonists block acetylcholine-stimulated Gq coupling, inhibiting PLC, IP3 production, and calcium release.',
                },
                {
                  id: 'p1_s3',
                  text: 'Adding an Inhaled Corticosteroid (ICS) directly relaxes airway smooth muscle within seconds to provide immediate relief during an acute bronchospasm episode.',
                  isCorrect: false,
                  explanation:
                    'Inhaled corticosteroids do not possess direct bronchodilator activity and cannot relax contracted airway smooth muscle. Their therapeutic effects are genomic (transactivation of anti-inflammatory genes and transrepression of NF-kB), requiring hours to days for clinical onset.',
                },
                {
                  id: 'p1_s4',
                  text: 'Triple therapy combining a LAMA, LABA, and ICS in a single inhaler device improves patient adherence and significantly reduces moderate-to-severe exacerbation rates compared to dual therapy in symptomatic COPD patients.',
                  isCorrect: true,
                  explanation:
                    'Large clinical trials (IMPACT, ETHOS) demonstrated that single-inhaler triple therapy (Trelegy, Enerzair) provides superior reduction in COPD exacerbations and mortality compared to dual LAMA/LABA or LABA/ICS combinations in patients with persistent symptoms.',
                },
              ],
              overallExplanation:
                'Combining a LAMA, LABA, and ICS targets all three pillars of obstructive airway disease: bronchoconstriction via muscarinic tone, bronchoconstriction via diminished adrenergic tone, and underlying mucosal inflammation.',
            },
            {
              id: 103,
              questionNumberLabel: 'Question 3',
              type: 'multiple-choice',
              title: 'Clinical Differentiation of Inhaled Regimens',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 1, Question 3',
              sourcePageNumber: 1,
              questionStem:
                'Which clinical scenario best reflects the rationale for initiating single-inhaler triple therapy (LAMA + LABA + ICS, such as Trelegy or Enerzair) over a LABA + LAMA dual bronchodilator alone?',
              options: [
                'Patients with persistent COPD exacerbations or an asthma-COPD overlap phenotype with elevated blood eosinophil counts (>300 cells/uL)',
                'Patients requiring immediate rescue bronchodilation during an acute asthma attack in the emergency department',
                'Patients with acute bronchospasm induced by unselective beta-blocker overdose',
                'Patients presenting with isolated vocal cord dysfunction and normal spirometry',
              ],
              correctIndex: 0,
              explanation:
                'According to GOLD and GINA guidelines, adding an ICS to create triple therapy (LAMA + LABA + ICS) is indicated in COPD patients experiencing repeated exacerbations despite dual bronchodilation, especially those with eosinophilic inflammation (blood eosinophils >=300 cells/uL or >=100 with >=2 exacerbations/year).',
            },
          ],
        },
      ],
    },

    // =========================================================================
    // REVIEW PAGE 2: Adrenergic Agonists SAR (Structures I - VII)
    // =========================================================================
    {
      pageNumber: 2,
      pageTitle: 'Review Page 2: Adrenergic Agonists SAR',
      title: 'Adrenergic Agonists SAR & Pharmacophore Matrix',
      subtitle:
        'Structures I–VII (Isoproterenol, Dobutamine, Olodaterol, Salmeterol, Indacaterol, Pirbuterol, Norepinephrine): Pharmacophore, Selectivity, Duration & Metabolism',
      sections: [
        {
          id: 'resp_p2_s1',
          sectionTitle: 'Review Page 2: Adrenergic Agonists SAR (Structures I–VII)',
          headerNote:
            'Consider Structures I–VII (Isoproterenol, Dobutamine, Olodaterol, Salmeterol, Indacaterol, Pirbuterol, Norepinephrine) to answer Questions 201–208:',
          structures: [
            ISOPROTERENOL_STRUCTURE,
            DOBUTAMINE_STRUCTURE,
            OLODATEROL_STRUCTURE,
            SALMETEROL_STRUCTURE,
            INDACATEROL_STRUCTURE,
            PIRBUTEROL_STRUCTURE,
            NOREPINEPHRINE_STRUCTURE,
          ],
          questions: [
            // Q1 (201)
            {
              id: 201,
              questionNumberLabel: 'Question 1',
              type: 'multiple-choice',
              title: 'Core Adrenergic Pharmacophore',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 2, Question 1',
              sourcePageNumber: 2,
              questionStem:
                'What is the core active pharmacophore common to adrenergic agonists (Structures I–VII)?',
              options: [
                'beta-Phenylethanolamine (aryl-beta-ethanolamine) core with an aromatic ring, beta-hydroxyl group, two-carbon chain, and terminal amine',
                'Amino alcohol ester with a quaternary ammonium cation',
                'Tetrahydronaphthalene bicyclic ring coupled to an imidazole ring',
                'Cyclopentanoperhydrophenanthrene steroid nucleus with 17-side chain',
              ],
              correctIndex: 0,
              explanation:
                'The core pharmacophore common to adrenergic agonists (Structures I–VII) is the beta-phenylethanolamine (aryl-beta-ethanolamine) scaffold. It consists of an aromatic catechol or bioisosteric aryl ring, an aliphatic two-carbon ethyl spacer, a chiral beta-hydroxyl group (which must have the (R)-absolute configuration for optimal receptor hydrogen bonding), and a terminal primary, secondary, or substituted nitrogen atom.',
            },
            // Q2 (202)
            {
              id: 202,
              questionNumberLabel: 'Question 2',
              type: 'multiple-choice',
              title: 'Nonselective Alpha and Beta Agonist Identification',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 2, Question 2',
              sourcePageNumber: 2,
              questionStem:
                'Which structure is a nonselective alpha and beta adrenergic agonist?',
              options: [
                'Structure VII',
                'Structure I',
                'Structure II',
                'Structure IV',
              ],
              correctIndex: 0,
              explanation:
                'Structure VII (Norepinephrine) possesses an unsubstituted primary amino group (R = H). Due to the lack of steric bulk on the nitrogen atom, it readily fits into the binding pockets of both alpha-1, alpha-2, and beta-1 adrenergic receptors, acting as a nonselective alpha and beta adrenergic agonist that produces potent vasoconstriction and cardiac inotropic stimulation.',
            },
            // Q3 (203)
            {
              id: 203,
              questionNumberLabel: 'Question 3',
              type: 'multiple-choice',
              title: 'Nonselective Beta-1 and Beta-2 Agonist Identification',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 2, Question 3',
              sourcePageNumber: 2,
              questionStem:
                'Which structure is a nonselective beta-1 and beta-2 adrenergic agonist?',
              options: [
                'Structure I',
                'Structure II',
                'Structure VI',
                'Structure VII',
              ],
              correctIndex: 0,
              explanation:
                'Structure I (Isoproterenol) bears an N-isopropyl substituent. This branched alkyl group provides sufficient steric bulk to completely exclude the molecule from alpha-adrenergic receptors, but binds with high affinity to both beta-1 and beta-2 adrenergic receptors nonselectively, causing bronchodilation alongside pronounced tachycardia and cardiac arrhythmias.',
            },
            // Q4 (204)
            {
              id: 204,
              questionNumberLabel: 'Question 4',
              type: 'multiple-choice',
              title: 'Selective Beta-1 Agonist Identification',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 2, Question 4',
              sourcePageNumber: 2,
              questionStem:
                'Which structure is a selective beta-1 adrenergic agonist indicated for acute heart failure and cardiogenic shock?',
              options: [
                'Structure II',
                'Structure I',
                'Structure III',
                'Structure V',
              ],
              correctIndex: 0,
              explanation:
                'Structure II (Dobutamine) possesses an extended aralkyl substituent (1-methyl-3-(4-hydroxyphenyl)propyl) on the nitrogen atom. This bulky moiety confers functional selectivity for myocardial beta-1 adrenergic receptors, increasing cardiac inotropy and stroke volume with relatively less chronotropy and minimal vascular beta-2 or alpha-1 effect at standard infusion doses.',
            },
            // Q5 (205)
            {
              id: 205,
              questionNumberLabel: 'Question 5',
              type: 'multiple-choice',
              title: 'Selective Beta-2 Agonists Identification',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 2, Question 5',
              sourcePageNumber: 2,
              questionStem:
                'Which structures are selective beta-2 adrenergic agonists suitable for therapeutic bronchodilation?',
              options: [
                'Structures III, IV, V, and VI',
                'Structures I, II, and VII',
                'Structures I, III, and V only',
                'Structures II, IV, and VII only',
              ],
              correctIndex: 0,
              explanation:
                'Structures III (Olodaterol), IV (Salmeterol), V (Indacaterol), and VI (Pirbuterol) are selective beta-2 agonists. They feature either bulky tertiary-butyl groups or extended lipophilic aralkyl chains that selectively fit the deeper hydrophobic exosite pocket present exclusively in the beta-2 adrenergic receptor, while their non-catechol aromatic rings prevent rapid COMT inactivation.',
            },
            // Q6 (206)
            {
              id: 206,
              questionNumberLabel: 'Question 6',
              type: 'multiple-choice',
              title: 'SABA vs LABA vs Ultra-LABA Bronchodilator Categorization',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 2, Question 6',
              sourcePageNumber: 2,
              questionStem:
                'Categorize the selective beta-2 agonists into Short-Acting (SABA), Long-Acting (LABA), and Ultra-Long-Acting (ultra-LABA) bronchodilators:',
              options: [
                'Structure VI = SABA; Structure IV = LABA (12-hour); Structures III and V = ultra-LABA (once-daily 24-hour)',
                'Structure IV = SABA; Structure VI = LABA; Structures III and V = ultra-LABA',
                'Structures III, IV, V, and VI are all short-acting SABAs requiring Q4H dosing',
                'Structures III and VI are SABAs; Structures IV and V are once-daily ultra-LABAs',
              ],
              correctIndex: 0,
              explanation:
                'Structure VI (Pirbuterol) has a duration of action of 4-6 hours (SABA). Structure IV (Salmeterol) features an extended phenylbutoxyhexyl chain that confers a 12-hour duration of action (LABA). Structures III (Olodaterol) and V (Indacaterol) possess lipophilic anchors that remain embedded in the cell membrane bilayer, providing sustained 24-hour bronchodilation suitable for once-daily dosing (ultra-LABA).',
            },
            // Q7 (207)
            {
              id: 207,
              questionNumberLabel: 'Question 7',
              type: 'multiple-choice',
              title: 'Clinical Indications: Asthma/COPD vs Shock and Heart Failure',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 2, Question 7',
              sourcePageNumber: 2,
              questionStem:
                'Which of the adrenergic structures (I–VII) are clinically indicated for the management of asthma and COPD versus acute shock or heart failure?',
              options: [
                'Structures III, IV, V, and VI are indicated for asthma and COPD; Structure II is indicated for cardiogenic shock/decompensated heart failure; Structure VII is indicated for septic/vasodilatory shock',
                'Structures I, II, and VII are indicated for asthma and COPD maintenance; Structures III, IV, and V are for cardiogenic shock',
                'All structures I through VII are approved for once-daily maintenance therapy of persistent asthma',
                'Only Structure VI is indicated for respiratory disorders',
              ],
              correctIndex: 0,
              explanation:
                'Structures III (Olodaterol), IV (Salmeterol), V (Indacaterol), and VI (Pirbuterol) are selective beta-2 bronchodilators indicated for asthma and/or COPD. In contrast, Structure II (Dobutamine) is an inotrope used in acute decompensated heart failure and cardiogenic shock, and Structure VII (Norepinephrine) is a first-line vasopressor used in septic and distributive shock.',
            },
            // Q8 (208)
            {
              id: 208,
              questionNumberLabel: 'Question 8',
              type: 'multiple-choice',
              title: 'Metabolic Susceptibility to COMT and MAO',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 2, Question 8',
              sourcePageNumber: 2,
              questionStem:
                'Analyze the metabolic susceptibility of Structures I–VII to Catechol-O-Methyltransferase (COMT) and Monoamine Oxidase (MAO):',
              options: [
                'Structures I, II, and VII contain intact catechols (3,4-dihydroxy) and are rapid COMT substrates; Structures III, IV, V, and VI have modified aromatic rings that resist COMT. Bulky N-substituents protect against MAO.',
                'All structures I through VII are rapidly degraded by COMT with oral bioavailabilities under 1%',
                'Only Structure VII is metabolized by MAO, while Structures I through VI are completely resistant to all hepatic enzymes',
                'Structures III, IV, and V are rapidly degraded by COMT due to their phenolic hydroxyl groups',
              ],
              correctIndex: 0,
              explanation:
                'Catechol-O-Methyltransferase (COMT) requires an intact catechol moiety (adjacent 3,4-dihydroxy groups on a phenyl ring). Structures I (Isoproterenol), II (Dobutamine), and VII (Norepinephrine) are rapidly methylated by COMT at the 3-hydroxyl group, rendering them orally inactive. In contrast, Structure IV (Salmeterol) has a 3-hydroxymethyl substitution, Structure VI (Pirbuterol) is a pyridine congener with a 3-hydroxymethyl, Structure V (Indacaterol) has an 8-hydroxycarbostyril ring, and Structure III (Olodaterol) has a benzoxazine ring; none are COMT substrates. Furthermore, bulky N-substituents (isopropyl, t-butyl, aralkyl) sterically hinder Monoamine Oxidase (MAO) oxidation.',
            },
          ],
        },
      ],
    },

    // =========================================================================
    // REVIEW PAGE 3: Anticholinergics & Hydrocortisone Prototype
    // =========================================================================
    {
      pageNumber: 3,
      pageTitle: 'Review Page 3: Anticholinergics & Hydrocortisone Prototype',
      title: 'Anticholinergic Bronchodilators & Hydrocortisone Prototype',
      subtitle:
        'Structures I–V (Darifenacin, Trihexyphenidyl, Tiotropium, Umeclidinium, Ipratropium) and Corticosteroid Core SAR',
      sections: [
        {
          id: 'resp_p3_s1',
          sectionTitle: 'Review Page 3: Anticholinergic Muscarinic Antagonists (Structures I–V)',
          headerNote:
            'Evaluate Structures I–V (Darifenacin, Trihexyphenidyl, Tiotropium, Umeclidinium, Ipratropium) and the Hydrocortisone steroid prototype to answer Questions 301–309:',
          structures: [
            DARIFENACIN_STRUCTURE,
            TRIHEXYPHENIDYL_STRUCTURE,
            TIOTROPIUM_STRUCTURE,
            UMECLIDINIUM_STRUCTURE,
            IPRATROPIUM_STRUCTURE,
            HYDROCORTISONE_STRUCTURE,
            CORTISONE_STRUCTURE,
          ],
          questions: [
            {
              id: 301,
              questionNumberLabel: 'Question 1',
              type: 'multiple-choice',
              title: 'Anticholinergics: Chemical & Mechanistic Classification',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 3, Question 1',
              sourcePageNumber: 3,
              questionStem:
                'What is the pharmacological and mechanistic classification of Anticholinergics I–V?',
              options: [
                'Competitive Muscarinic Acetylcholine Receptor Antagonists (parasympatholytic anticholinergics)',
                'Beta-2 adrenergic receptor partial agonists',
                'Phosphodiesterase type 4 (PDE4) competitive inhibitors',
                'Leukotriene receptor antagonists (LTRAs)',
              ],
              correctIndex: 0,
              explanation:
                'All five structures are competitive muscarinic receptor antagonists (anticholinergics) that reversibly block acetylcholine binding at postganglionic muscarinic receptors (specifically M3 in bronchial and bladder smooth muscle).',
            },
            {
              id: 302,
              questionNumberLabel: 'Question 2',
              type: 'multiple-choice',
              title: 'Anticholinergic Pharmacophore Features',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 3, Question 2',
              sourcePageNumber: 3,
              questionStem:
                'What structural elements compose the classical muscarinic antagonist pharmacophore exhibited by Structures I–V?',
              options: [
                'A basic nitrogen atom (tertiary amine or quaternary ammonium) separated by a 2- to 4-carbon chain/linker from a central carbon bearing bulky lipophilic aromatic or cycloalkyl rings and an optional hydroxyl group',
                'A planar catechol ring with a beta-hydroxyl group and an acidic sulfonamide',
                'A purine bicycle with two methyl groups and a free imidazole NH',
                'A four-ring steroid nucleus with a C17 dihydroxyacetone side chain',
              ],
              correctIndex: 0,
              explanation:
                'The anticholinergic pharmacophore requires a positively charged basic center (tertiary or quaternary amine) separated by an ester, ether, or carbon linker from a central carbon bearing two bulky lipophilic rings (phenyl, thienyl, or cyclohexyl) and often an auxiliary hydroxyl group that provides additional hydrogen bonding.',
            },
            {
              id: 303,
              questionNumberLabel: 'Question 3',
              type: 'multiple-choice',
              title: 'Quaternary Ammonium Lung Localization & Blood-Brain Barrier Exclusion',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 3, Question 3',
              sourcePageNumber: 3,
              questionStem:
                'Which structural feature of Anticholinergics III, IV, and V prevents blood-brain barrier penetration and limits systemic absorption after inhalation?',
              options: [
                'The quaternary ammonium nitrogen cation carrying a permanent positive charge, which renders the molecule highly polar and unable to cross hydrophobic biological membranes or the blood-brain barrier',
                'The ester oxygen that undergoes instantaneous spontaneous decarboxylation in gastric fluid',
                'A primary sulfonamide group that binds selectively to erythrocyte carbonic anhydrase',
                'The presence of multiple phenolic hydroxyl groups undergoing rapid phase II glucuronidation',
              ],
              correctIndex: 0,
              explanation:
                'Structures III (Tiotropium), IV (Umeclidinium), and V (Ipratropium) possess a quaternary ammonium nitrogen cation that is permanently ionized across all physiological pH values. Because charged ions cannot passively diffuse through hydrophobic cell membranes, these molecules exhibit minimal oral absorption (<2%) and cannot cross the blood-brain barrier, preventing central anticholinergic toxicity (confusion, hallucinations) and localizing therapeutic relaxation to the bronchial tree.',
            },
            {
              id: 304,
              questionNumberLabel: 'Question 4',
              type: 'multiple-choice',
              title: 'Clinical Indications of Anticholinergics I–V',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 3, Question 4',
              sourcePageNumber: 3,
              questionStem:
                'Which of the anticholinergic structures (I–V) are clinically indicated for the inhalation management of asthma and COPD?',
              options: [
                'Structures III, IV, and V are indicated for respiratory diseases; Structure I is for overactive bladder; Structure II is for Parkinson’s disease',
                'Structures I and II are inhaled bronchodilators; Structures III, IV, and V are for urinary incontinence',
                'All five structures are formulated as metered-dose inhalers for COPD',
                'Only Structure II is approved for chronic asthma',
              ],
              correctIndex: 0,
              explanation:
                'Tiotropium (III), Umeclidinium (IV), and Ipratropium (V) are quaternary ammonium bronchodilators administered via inhalation for asthma and COPD. Structure I (Darifenacin) is an orally administered tertiary amine M3-selective antagonist indicated for overactive bladder. Structure II (Trihexyphenidyl) is an orally active tertiary amine indicated as an anticholinergic antiparkinsonian agent that readily crosses the blood-brain barrier to correct dopamine/acetylcholine imbalance in the basal ganglia.',
            },
            {
              id: 305,
              questionNumberLabel: 'Question 5',
              type: 'multiple-choice',
              title: 'Soft Anticholinergics & Plasma Esterase Inactivation',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 3, Question 5',
              sourcePageNumber: 3,
              questionStem:
                'What is the pharmacokinetic rationale for designing "soft anticholinergic" bronchodilators such as Aclidinium bromide?',
              options: [
                'Incorporating an ester linkage that undergoes rapid hydrolysis by circulating plasma esterases (butyrylcholinesterase) into inactive carboxylic acid and alcohol metabolites, clearing systemic drug before adverse cardiac or urinary effects occur',
                'Adding a fluorine atom to block all Phase I hepatic CYP450 oxidation completely',
                'Attaching a polyethylene glycol polymer to prevent renal glomerular filtration',
                'Replacing all basic amines with neutral amides to prevent receptor dissociation',
              ],
              correctIndex: 0,
              explanation:
                'Soft anticholinergic design (exemplified by Aclidinium) incorporates an ester linkage that is stable in the airway to provide sustained local bronchodilation, but is rapidly hydrolyzed by non-specific plasma esterases upon entering systemic circulation into an inactive acid and alcohol metabolite. This rapid plasma inactivation yields an ultra-low systemic bioavailability (<0.1%) and virtually eliminates systemic anticholinergic side effects (tachycardia, dry mouth, urinary retention).',
            },
            {
              id: 306,
              questionNumberLabel: 'Question 6',
              type: 'multiple-choice',
              title: 'Adrenocorticoid Classification & Endogenous Roles',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 3, Question 6',
              sourcePageNumber: 3,
              questionStem:
                'How is Hydrocortisone classified among endogenous adrenocorticoids, and what are its primary physiological functions?',
              options: [
                'Glucocorticoid produced in the zona fasciculata; regulates glucose homeostasis, protein catabolism, lipolysis, and profoundly suppresses inflammation and immune responses',
                'Mineralocorticoid produced in the zona glomerulosa; primarily regulates renal sodium and water reabsorption',
                'Androgenic steroid produced in the zona reticularis; promotes secondary male sexual characteristics',
                'Estrogenic steroid synthesized in the adrenal medulla; stimulates sympathetic discharge',
              ],
              correctIndex: 0,
              explanation:
                'Hydrocortisone (cortisol) is the primary endogenous glucocorticoid synthesized in the zona fasciculata of the adrenal cortex under ACTH control. Glucocorticoids regulate intermediary carbohydrate and protein metabolism (gluconeogenesis, glycogen synthesis) and mediate essential anti-inflammatory, anti-allergic, and immunosuppressive actions.',
            },
            {
              id: 307,
              questionNumberLabel: 'Question 7',
              type: 'multiple-choice',
              title: 'Corticosteroid Numbering & 11-beta-OH vs 11-Keto Activation',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 3, Question 7',
              sourcePageNumber: 3,
              questionStem:
                'Evaluate the structural requirement of the C11 oxygen substituent: why is hydrocortisone active while cortisone requires bioactivation?',
              options: [
                'An 11-beta-hydroxyl group is an absolute requirement for direct glucocorticoid receptor (GR) binding; Cortisone possesses an 11-keto group and is an inactive prodrug that must be reduced to an 11-beta-hydroxyl by hepatic 11beta-HSD1',
                'Cortisone is the active hormone, whereas hydrocortisone is an inactive degradation metabolite',
                'The 11-keto group binds GR with 100-fold higher affinity, but cannot cross the nuclear membrane',
                'The C11 substituent is completely irrelevant for glucocorticoid receptor binding',
              ],
              correctIndex: 0,
              explanation:
                'An 11-beta-hydroxyl group is an absolute requirement for direct glucocorticoid receptor (GR) binding, where it forms a critical hydrogen bond with Asn564 in the ligand-binding pocket. Cortisone possesses an 11-keto group and cannot bind GR; it is an inactive prodrug that must be reduced to an 11-beta-hydroxyl by 11beta-hydroxysteroid dehydrogenase type 1 (11beta-HSD1) in the liver to become biologically active cortisol (hydrocortisone).',
            },
            {
              id: 308,
              questionNumberLabel: 'Question 8',
              type: 'multiple-choice',
              title: 'Glucocorticoid Receptor (GR) Interaction Points',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 3, Question 8',
              sourcePageNumber: 3,
              questionStem:
                'Which functional groups of the Hydrocortisone molecule are essential contact points within the ligand-binding domain (LBD) of the glucocorticoid receptor?',
              options: [
                '3-Keto (H-bond to Gln642/Arg611), 11beta-OH (H-bond to Asn564), 20-Keto, and 21-OH (H-bond to Thr739)',
                'Only the C17 alpha-ethinyl group and C3 phenolic hydroxyl',
                'A single primary amine at C21 and an ether at C11',
                'A quaternary ammonium cation at C3 and a carboxylate at C20',
              ],
              correctIndex: 0,
              explanation:
                'X-ray crystallography reveals that the GR ligand-binding pocket recognizes cortisol via four key hydrogen-bonding anchors: the 3-keto group (interacting with Gln642 and Arg611), the 11-beta-hydroxyl group (interacting with Asn564), the 20-carbonyl, and the 21-hydroxyl group (interacting with Thr739). Chemical alterations at these positions dramatically alter receptor affinity.',
            },
            {
              id: 309,
              questionNumberLabel: 'Question 9',
              type: 'multiple-choice',
              title: 'Anti-inflammatory Utility in Asthma & COPD',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 3, Question 9',
              sourcePageNumber: 3,
              questionStem:
                'What is the fundamental cellular mechanism by which corticosteroids suppress airway inflammation in asthma and COPD?',
              options: [
                'Induction of Annexin A1 (lipocortin-1) to inhibit cytosolic Phospholipase A2 (cPLA2), blocking arachidonic acid release, combined with transrepression of pro-inflammatory transcription factors NF-kB and AP-1',
                'Direct competitive antagonism of leukotriene CysLT1 and histamine H1 receptors on mast cells',
                'Allosteric opening of large-conductance calcium-activated potassium channels on airway nerves',
                'Direct irreversible covalent inactivation of bacterial lipopolysaccharide endotoxins',
              ],
              correctIndex: 0,
              explanation:
                'Corticosteroids exert their potent anti-inflammatory effects in asthma and COPD through both transactivation and transrepression: (1) Transactivation induces Annexin A1 (lipocortin-1), which directly inhibits cytosolic Phospholipase A2 (cPLA2), preventing the liberation of arachidonic acid and halting synthesis of prostaglandins, thromboxanes, and leukotrienes; (2) Monomeric transrepression physically binds and inhibits NF-kB and AP-1, shutting down transcription of inflammatory cytokines (IL-1, IL-4, IL-5, IL-13, TNF-alpha), chemokines, and inducible enzymes (COX-2, iNOS).',
            },
          ],
        },
      ],
    },

    // =========================================================================
    // REVIEW PAGE 4: Hydrocortisone Biosynthesis & Glucocorticoid Receptor (GR)
    // =========================================================================
    {
      pageNumber: 4,
      pageTitle:
        'Review Page 4: Hydrocortisone Biosynthesis & Glucocorticoid Receptor (GR)',
      title: 'Cortisol Biosynthesis & Glucocorticoid Receptor (GR) Mechanism',
      subtitle:
        'Adrenal Cortical Steroidogenesis, P450 Enzymes, Domain Architecture, Chaperones & Genomic Signaling',
      sections: [
        {
          id: 'resp_p4_s1',
          sectionTitle:
            'Review Page 4: Biosynthesis Cascade & GR Receptor Activation',
          headerNote:
            'Trace the cytochrome P450 enzymatic pathway in cortisol biosynthesis and the multi-step activation of the Glucocorticoid Receptor (GR):',
          structures: [HYDROCORTISONE_STRUCTURE, CORTISONE_STRUCTURE, ALDOSTERONE_STRUCTURE],
          questions: [
            {
              id: 401,
              questionNumberLabel: 'Question 1',
              type: 'sub-statements',
              title: 'Adrenal Steroidogenesis & Cytochrome P450 Enzymes',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 4, Question 1',
              sourcePageNumber: 4,
              questionStem:
                'Trace the key cytochrome P450 enzymes (CYP11A1, CYP17A1, 3beta-HSD, CYP21A2, CYP11B1) involved in cortisol biosynthesis in the adrenal cortex:',
              subStatements: [
                {
                  id: 'p4_s1_1',
                  text: 'CYP11A1 (cholesterol side-chain cleavage enzyme / desmolase) catalyzes the initial rate-limiting conversion of cholesterol to pregnenolone in the inner mitochondrial membrane.',
                  isCorrect: true,
                  explanation:
                    'CYP11A1 in the inner mitochondrial membrane performs three successive oxidations to cleave the 6-carbon side chain of cholesterol, generating pregnenolone, which serves as the common precursor for all steroid hormones.',
                },
                {
                  id: 'p4_s1_2',
                  text: 'CYP17A1 (17alpha-hydroxylase) directs steroidogenesis toward cortisol and sex steroids by adding a 17alpha-hydroxyl group; deficiency leads to mineralocorticoid excess and hypertension.',
                  isCorrect: true,
                  explanation:
                    'CYP17A1 hydroxylates pregnenolone or progesterone at C17. Without 17alpha-hydroxylation, steroid precursors are shunted exclusively into the mineralocorticoid pathway (aldosterone/corticosterone), causing severe hypertension and hypokalemia.',
                },
                {
                  id: 'p4_s1_3',
                  text: 'CYP21A2 (21-hydroxylase) converts 17alpha-hydroxyprogesterone to 11-deoxycortisol; it is the most common enzyme deficient in congenital adrenal hyperplasia (CAH).',
                  isCorrect: true,
                  explanation:
                    'CYP21A2 in the smooth endoplasmic reticulum hydroxylates C21. Over 90% of congenital adrenal hyperplasia cases are caused by CYP21A2 mutations, causing cortisol deficiency, elevated ACTH, and adrenal androgen excess.',
                },
                {
                  id: 'p4_s1_4',
                  text: 'CYP11B1 (11beta-hydroxylase) performs the final bioactivation step in mitochondria, converting 11-deoxycortisol into active hydrocortisone (cortisol).',
                  isCorrect: true,
                  explanation:
                    'CYP11B1 in the inner mitochondrial membrane introduces the essential 11-beta-hydroxyl group required for glucocorticoid receptor binding, producing active hydrocortisone in the zona fasciculata.',
                },
              ],
              overallExplanation:
                'Cortisol is synthesized in the zona fasciculata under ACTH stimulation via a five-enzyme cascade: Cholesterol -> (CYP11A1) -> Pregnenolone -> (CYP17A1) -> 17-OH-Pregnenolone -> (3beta-HSD) -> 17-OH-Progesterone -> (CYP21A2) -> 11-Deoxycortisol -> (CYP11B1) -> Cortisol (Hydrocortisone).',
            },
            {
              id: 402,
              questionNumberLabel: 'Question 2',
              type: 'sub-statements',
              title: 'Glucocorticoid Receptor (GR) Architecture & Activation Cycle',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 4, Question 2',
              sourcePageNumber: 4,
              questionStem:
                'Detail the structural domains of the glucocorticoid receptor (GR) and the sequence of events during receptor activation (HSP90 dissociation, nuclear translocation, GRE binding, transactivation and transrepression):',
              subStatements: [
                {
                  id: 'p4_s2_1',
                  text: 'In the unliganded resting state, the glucocorticoid receptor (GR) is sequestered in the cytoplasm bound to a multi-protein chaperone complex comprising Heat Shock Protein 90 (HSP90, AA), HSP70, and immunophilins.',
                  isCorrect: true,
                  explanation:
                    'HSP90 and co-chaperones maintain the unliganded GR in a high-affinity ligand-receptive conformation in the cytoplasm while occluding its nuclear localization signals (NLS).',
                },
                {
                  id: 'p4_s2_2',
                  text: 'The GR polypeptide contains a C-terminal Ligand-Binding Domain (LBD, XX) that binds cortisol, and a central DNA-Binding Domain (DBD, YY) containing two zinc-finger motifs that bind to Glucocorticoid Response Elements (GRE, CC).',
                  isCorrect: true,
                  explanation:
                    'The GR architecture includes a C-terminal LBD that accommodates the hydrophobic steroid molecule, a zinc-finger DBD that recognizes specific DNA sequences (GREs: 5-GGTACAnnnTGTTCT-3), and an N-terminal AF-1 transactivation domain.',
                },
                {
                  id: 'p4_s2_3',
                  text: 'Upon ligand binding, HSP90 dissociates from GR, exposing nuclear localization sequences that permit GR homodimerization and active translocation through the nuclear pore complex into the nucleus.',
                  isCorrect: true,
                  explanation:
                    'Ligand binding triggers a conformational shift that induces release of HSP90 and immunophilins. The exposed NLS interacts with importin alpha/beta, directing the GR homodimer across the nuclear pore complex into the nucleus.',
                },
                {
                  id: 'p4_s2_4',
                  text: 'Transrepression occurs when monomeric liganded GR directly binds and inhibits pro-inflammatory transcription factors NF-kB and AP-1 without requiring GRE homodimer DNA binding, shutting down cytokine production.',
                  isCorrect: true,
                  explanation:
                    'While transactivation requires GR homodimers binding to GRE sequences on DNA, transrepression is mediated primarily by monomeric GR directly tethering to and inhibiting activated NF-kB (p65/p50) and AP-1 (c-Jun/c-Fos), repressing inflammatory gene transcription.',
                },
              ],
              overallExplanation:
                'The glucocorticoid receptor (GR) functions as a ligand-activated transcription factor: lipophilic cortisol diffuses across the plasma membrane, binds the LBD (XX), induces dissociation of chaperone HSP90 (AA), promotes homodimerization, facilitates nuclear translocation, binds GRE (CC) on DNA to transactivate anti-inflammatory genes, and mediates protein-protein transrepression of NF-kB to arrest inflammation.',
            },
          ],
        },
      ],
    },

    // =========================================================================
    // REVIEW PAGE 5: Hydrocortisone Metabolism & Potency Ranking
    // =========================================================================
    {
      pageNumber: 5,
      pageTitle: 'Review Page 5: Hydrocortisone Metabolism & Potency Ranking',
      title: 'Hydrocortisone Metabolism & Relative Potencies',
      subtitle:
        '11beta-HSD Isozymes, Ring A Reductions, and Structural Ranking of Systemic Corticosteroids',
      sections: [
        {
          id: 'resp_p5_s1',
          sectionTitle:
            'Review Page 5: Metabolism Pathways & Relative Anti-inflammatory Potency',
          headerNote:
            'Analyze the physiological inactivation pathways of hydrocortisone and rank synthetic corticosteroids by anti-inflammatory potency:',
          structures: [
            HYDROCORTISONE_STRUCTURE,
            CORTISONE_STRUCTURE,
            PREDNISOLONE_STRUCTURE,
            PREDNISONE_STRUCTURE,
            METHYLPREDNISOLONE_STRUCTURE,
            DEXAMETHASONE_STRUCTURE,
            ALDOSTERONE_STRUCTURE,
          ],
          questions: [
            {
              id: 501,
              questionNumberLabel: 'Question 1',
              type: 'sub-statements',
              title: 'Metabolic Inactivation Pathways of Hydrocortisone',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 5, Question 1',
              sourcePageNumber: 5,
              questionStem:
                'Analyze the primary metabolic degradation pathways of hydrocortisone, including 11beta-HSD2 oxidation, Ring-A reductions to tetrahydrocortisol, and side-chain cleavage:',
              subStatements: [
                {
                  id: 'p5_s1_1',
                  text: '11beta-HSD2 is a high-affinity dehydrogenase in aldosterone-sensitive renal tissues (cortical collecting duct) that rapidly oxidizes active cortisol (11beta-OH) to inactive cortisone (11-keto), preventing cortisol from inappropriately activating mineralocorticoid receptors.',
                  isCorrect: true,
                  explanation:
                    'Because cortisol and aldosterone have equal affinity for the mineralocorticoid receptor (MR) and circulating cortisol levels are 100-1000 times higher, renal 11beta-HSD2 acts as a protective enzymatic barrier. Inhibition by licorice (glycyrrhizic acid) causes apparent mineralocorticoid excess (AME) with severe hypertension and hypokalemia.',
                },
                {
                  id: 'p5_s1_2',
                  text: 'Hepatic 5alpha- and 5beta-reductases reduce the Delta-4,5 double bond of Ring A, followed by 3alpha-HSD reduction of the 3-keto group, yielding inactive tetrahydrocortisol (THF) and allotetrahydrocortisol.',
                  isCorrect: true,
                  explanation:
                    'Ring A reduction is the major irreversible systemic clearance pathway. 5-reductase eliminates the 4,5-double bond, and 3alpha-hydroxysteroid dehydrogenase converts the 3-carbonyl into an alcohol, forming tetrahydrocortisol (THF), which loses all receptor affinity and is excreted as a glucuronide conjugate.',
                },
                {
                  id: 'p5_s1_3',
                  text: 'The presence of a Delta-1,2 double bond (as in Prednisolone and Dexamethasone) flattens Ring A and sterically hinders hepatic 5-reductase, significantly prolonging plasma elimination half-life.',
                  isCorrect: true,
                  explanation:
                    'Introducing the 1,2-dehydrogenation (Delta-1) alters the conformation of Ring A from a chair/half-chair to a flattened geometry, sterically obstructing 5alpha- and 5beta-reductase access, thereby extending biological half-life from 8-12 hours (hydrocortisone) to 18-36 hours (prednisolone).',
                },
                {
                  id: 'p5_s1_4',
                  text: 'Phase II glucuronide and sulfate conjugation occurs primarily at the C3 and C21 hydroxyl positions, transforming hydrophobic steroids into highly water-soluble metabolites for rapid urinary excretion.',
                  isCorrect: true,
                  explanation:
                    'UDP-glucuronosyltransferases (UGT) conjugate glucuronic acid to the reduced 3alpha-hydroxyl and 21-hydroxyl groups, enabling efficient renal clearance via glomerular filtration and tubular secretion.',
                },
              ],
              overallExplanation:
                'Hydrocortisone clearance proceeds via: (1) 11beta-HSD2 oxidation to cortisone in the kidney; (2) Ring A reduction by 5-reductase and 3alpha-HSD to tetrahydrocortisol in the liver; (3) C20 reduction to cortols; and (4) Phase II glucuronidation at C3/C21.',
            },
            {
              id: 502,
              questionNumberLabel: 'Question 2',
              type: 'ranking',
              title: 'Systemic Corticosteroid Anti-inflammatory Potency Ranking',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 5, Question 2',
              sourcePageNumber: 5,
              rankingPrompt:
                'Rank the following systemic corticosteroids in order of decreasing anti-inflammatory glucocorticoid potency (Rank 1 = Most potent anti-inflammatory, Rank 6 = Least potent / inactive anti-inflammatory):',
              rankingItems: [
                {
                  id: 'rank_dexa',
                  label: 'Dexamethasone (Rank 1: 25-80x reference potency; 9alpha-F, 16alpha-methyl, Delta-1,4)',
                  correctRank: 1,
                  rationale:
                    'Dexamethasone is the most potent systemic glucocorticoid here (25-80x cortisol potency) due to synergistic 1-ene, 9alpha-fluoro, and 16alpha-methyl modifications, with 0x mineralocorticoid activity.',
                },
                {
                  id: 'rank_methylpred',
                  label: 'Methylprednisolone (Rank 2: 5x reference potency; 6alpha-methyl, Delta-1,4)',
                  correctRank: 2,
                  rationale:
                    'Methylprednisolone has approximately 5x the anti-inflammatory potency of cortisol; 6alpha-methyl provides lipophilicity and resists metabolic reduction.',
                },
                {
                  id: 'rank_prednisolone',
                  label: 'Prednisolone (Rank 3: 4-5x reference potency; Delta-1,4-diene)',
                  correctRank: 3,
                  rationale:
                    'Prednisolone has 4-5x the anti-inflammatory potency of cortisol with reduced mineralocorticoid salt-retaining activity.',
                },
                {
                  id: 'rank_hydrocortisone',
                  label: 'Cortisol (Rank 4: 1x baseline natural glucocorticoid reference)',
                  correctRank: 4,
                  rationale:
                    'Cortisol (hydrocortisone) represents the natural baseline reference with 1x anti-inflammatory potency and 1x mineralocorticoid potency.',
                },
                {
                  id: 'rank_cortisone',
                  label: 'Cortisone (Rank 5: 0.8x potency; inactive prodrug requiring 11beta-HSD1 reduction)',
                  correctRank: 5,
                  rationale:
                    'Cortisone is an 11-keto prodrug with approximately 0.8x the systemic potency of cortisol, requiring hepatic conversion to cortisol.',
                },
                {
                  id: 'rank_aldosterone',
                  label: 'Aldosterone (Rank 6: 0x anti-inflammatory potency; 3000x mineralocorticoid potency)',
                  correctRank: 6,
                  rationale:
                    'Aldosterone has virtually zero anti-inflammatory glucocorticoid potency (0x), but possesses 3000x the mineralocorticoid sodium-retaining potency of cortisol.',
                },
              ],
              explanation:
                'Anti-inflammatory potency hierarchy: Dexamethasone (25-80x) > Methylprednisolone (5x) > Prednisolone (4-5x) > Hydrocortisone (1x) > Cortisone (0.8x) > Aldosterone (0x). Structural features enhancing glucocorticoid potency include Delta-1,4-diene, 9alpha-fluorination, 6alpha-methylation, and 16alpha-methylation.',
            },
          ],
        },
      ],
    },

    // =========================================================================
    // REVIEW PAGE 6: Glucocorticoid Prodrugs, Soft Steroids & SAR
    // =========================================================================
    {
      pageNumber: 6,
      pageTitle: 'Review Page 6: Glucocorticoid Prodrugs, Soft Steroids & SAR',
      title: 'Glucocorticoid Prodrugs, Soft Steroids & Formulation Chemistry',
      subtitle:
        'Structures I–VI (Triamcinolone acetonide, Beclomethasone dipropionate, Fluticasone propionate, Hydrocortisone sodium phosphate, Ciclesonide, Clobetasol propionate)',
      sections: [
        {
          id: 'resp_p6_s1',
          sectionTitle:
            'Review Page 6: Formulation Chemistry & Structural Modifications (Structures I–VI)',
          headerNote:
            'Consider Structures I–VI (Triamcinolone acetonide, Beclomethasone dipropionate, Fluticasone propionate, Hydrocortisone sodium phosphate, Ciclesonide, Clobetasol propionate) to evaluate prodrug strategies, water solubility, and soft steroids:',
          structures: [
            TRIAMCINOLONE_ACETONIDE_STRUCTURE,
            BECLOMETHASONE_DIPROPIONATE_STRUCTURE,
            FLUTICASONE_PROPIONATE_STRUCTURE,
            HYDROCORTISONE_SODIUM_PHOSPHATE_STRUCTURE,
            CICLESONIDE_STRUCTURE,
            CLOBETASOL_PROPIONATE_STRUCTURE,
          ],
          questions: [
            {
              id: 601,
              questionNumberLabel: 'Question 1',
              type: 'sub-statements',
              title: 'Glucocorticoid Prodrugs, Soft Steroids & SAR Sub-statements',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 6, Question 1',
              sourcePageNumber: 6,
              prompt:
                'Evaluate the following True/False statements regarding the medicinal chemistry and SAR of corticosteroids from Review Page 6:',
              subStatements: [
                {
                  id: 'p6_s1_1',
                  text: 'Hydrocortisone, "cortisone", "prednisone", and prednisolone have both glucocorticoid & mineralocorticoid activities.',
                  isCorrect: true,
                  explanation:
                    'True. Hydrocortisone, cortisone, prednisone, and prednisolone possess both anti-inflammatory glucocorticoid activity and salt-retaining mineralocorticoid activity because they lack bulky C16 substituents (such as 16alpha/beta-methyl, 16alpha-OH, or 16,17-acetonide) that selectively abolish mineralocorticoid receptor binding.',
                },
                {
                  id: 'p6_s1_2',
                  text: 'The skeleton, all-trans backbone, ring A ene-one, and substituents at C-17 are required to promote anti-inflammatory activity.',
                  isCorrect: true,
                  explanation:
                    'True. The intact steroid skeleton, all-trans junction backbone, Ring A 3-keto-Delta-4-ene system, and C17 substituents are essential pharmacophoric requirements for binding and activating the glucocorticoid receptor.',
                },
                {
                  id: 'p6_s1_3',
                  text: 'C21-lipophilic esters are prodrugs that esterases must activate. They have a long duration of action, better compliance, and slower onset of action, when applied locally, they have limited systemic absorption.',
                  isCorrect: true,
                  explanation:
                    'True. C21-lipophilic esters (e.g. propionates, acetates) are inactive prodrugs requiring cleavage by endogenous esterases. Their increased lipophilicity prolongs airway/skin tissue retention, yields slower onset with longer duration, improves compliance, and restricts systemic absorption.',
                },
                {
                  id: 'p6_s1_4',
                  text: '1-Dehydro modification increases the anti-inflammatory activity and limits metabolism.',
                  isCorrect: true,
                  explanation:
                    'True. Introducing the 1,2-double bond (Delta-1-dehydro modification, as in prednisone/prednisolone) flattens Ring A, enhancing glucocorticoid receptor binding affinity while sterically protecting Ring A from hepatic 5-reductase reduction, thereby extending plasma half-life.',
                },
              ],
              overallExplanation:
                'Key corticosteroid SAR principles: Hydrocortisone, cortisone, prednisone, and prednisolone retain dual glucocorticoid and mineralocorticoid actions; the all-trans skeleton, Ring A ene-one, and C17 substituents are mandatory for anti-inflammatory efficacy; C21-lipophilic esters are esterase-activated prodrugs with prolonged local action and low systemic absorption; and 1-dehydrogenation (Delta-1) enhances anti-inflammatory potency while shielding Ring A from metabolic reduction.',
            },
            {
              id: 602,
              questionNumberLabel: 'Question 2',
              type: 'matching',
              title: 'Corticosteroid Formulation & Structural Class Matching',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 6, Question 2',
              sourcePageNumber: 6,
              questionStem:
                'Drag each chemical structure (Structure I - Structure VI) to its correct formulation class, prodrug status, and clinical role:',
              prompt:
                'Drag each chemical structure (Structure I - Structure VI) to its correct formulation class, prodrug status, and clinical role:',
              structuresDisplayed: [
                TRIAMCINOLONE_ACETONIDE_STRUCTURE,
                BECLOMETHASONE_DIPROPIONATE_STRUCTURE,
                FLUTICASONE_PROPIONATE_STRUCTURE,
                HYDROCORTISONE_SODIUM_PHOSPHATE_STRUCTURE,
                CICLESONIDE_STRUCTURE,
                CLOBETASOL_PROPIONATE_STRUCTURE,
              ],
              matchingTargets: [
                {
                  id: 'target_triamcinolone',
                  label: 'Cyclic 16,17-acetonide ketal for topical anti-inflammatory potency with zero salt retention',
                  acceptedStructureIds: ['triamcinolone_acetonide', 'I'],
                  rationale:
                    'Structure I (Triamcinolone acetonide) contains a 16alpha,17alpha-isopropylidenedioxy (acetonide) group that maximizes topical anti-inflammatory potency with zero salt retention.',
                },
                {
                  id: 'target_beclo',
                  label: 'Lipophilic diester prodrug providing airway tissue deposition and low oral bioavailability',
                  acceptedStructureIds: ['beclomethasone_dipropionate', 'II'],
                  rationale:
                    'Structure II (Beclomethasone dipropionate) carries propionate esters at C17alpha and C21, conferring high lipophilicity for inhaled dry powder delivery.',
                },
                {
                  id: 'target_fluticasone',
                  label: '17beta-Carbothioate fluoromethyl soft steroid designed for rapid metabolic inactivation',
                  acceptedStructureIds: ['fluticasone_propionate', 'III'],
                  rationale:
                    'Structure III (Fluticasone propionate) features a 17beta-carbothioate fluoromethyl ester designed for rapid hepatic CYP3A4 inactivation.',
                },
                {
                  id: 'target_hydro_phos',
                  label: 'Water-soluble parenteral ester salt for emergency intravenous bolus administration',
                  acceptedStructureIds: ['hydrocortisone_sodium_phosphate', 'IV'],
                  rationale:
                    'Structure IV (Hydrocortisone sodium phosphate) has a charged phosphate ester at C21 that ionizes at pH 7.4, providing high water solubility for emergency IV injection.',
                },
                {
                  id: 'target_ciclesonide',
                  label: 'Inhaled cyclic acetal prodrug activated by airway esterases',
                  acceptedStructureIds: ['ciclesonide', 'V'],
                  rationale:
                    'Structure V (Ciclesonide) is a 21-isobutyrate cyclic acetal prodrug cleaved by pulmonary carboxylesterase 1 into potent des-ciclesonide inside the lung.',
                },
                {
                  id: 'target_clobetasol',
                  label: 'Super-potent 21-chloro topical corticosteroid for severe inflammatory dermatoses',
                  acceptedStructureIds: ['clobetasol_propionate', 'VI'],
                  rationale:
                    'Structure VI (Clobetasol propionate) replaces the 21-hydroxyl with chlorine, yielding super-high glucocorticoid potency reserved for severe refractory inflammatory dermatoses.',
                },
              ],
              options: [
                'Cyclic 16,17-acetonide ketal',
                'Lipophilic diester prodrug',
                '17beta-Carbothioate soft steroid',
                'Water-soluble parenteral ester salt',
                'Inhaled cyclic acetal prodrug',
                'Super-potent 21-chloro corticosteroid',
              ],
              correctAnswer: 'I: Acetonide; II: Diester; III: Carbothioate; IV: Phosphate salt; V: Acetal prodrug; VI: 21-Chloro',
              explanation:
                'Distinct functional group substitutions dictate formulation properties: lipophilic diesters and acetonides enhance mucosal deposition and cellular retention; water-soluble phosphate salts enable emergency IV bolus dosing; and carbothioate esters ensure ultra-low systemic bioavailability.',
            },
          ],
        },
      ],
    },

    // =========================================================================
    // REVIEW PAGE 7: Glucocorticoid SAR Items, Biotransformations & Theophylline vs Roflumilast
    // =========================================================================
    {
      pageNumber: 7,
      pageTitle:
        'Review Page 7: Glucocorticoid SAR Items, Biotransformations & PDE Inhibitors',
      title: 'Corticosteroid Biotransformations & PDE Inhibitor Pharmacology',
      subtitle:
        'SAR Principles, Prodrug Activations, and Comparative Chemistry of Theophylline vs Roflumilast',
      sections: [
        {
          id: 'resp_p7_s1',
          sectionTitle:
            'Review Page 7: SAR Principles, Bioactivations & Methylxanthines vs PDE4 Inhibitors',
          headerNote:
            'Evaluate the True/False SAR statements, bioactivation pathways (BDP -> 17-BMP, Prednisone -> Prednisolone), and comparative pharmacology of Theophylline (Drug A) vs Roflumilast (Drug B):',
          structures: [
            BECLOMETHASONE_DIPROPIONATE_STRUCTURE,
            PREDNISONE_STRUCTURE,
            PREDNISOLONE_STRUCTURE,
            FLUTICASONE_PROPIONATE_STRUCTURE,
            THEOPHYLLINE_STRUCTURE,
            ROFLUMILAST_STRUCTURE,
          ],
          questions: [
            // Q701 (3 True/False sub-statements)
            {
              id: 701,
              questionNumberLabel: 'Question 1',
              type: 'sub-statements',
              title: 'Glucocorticoid SAR True/False Battery',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 7, Question 1',
              sourcePageNumber: 7,
              prompt:
                'Evaluate the following three True/False statements regarding corticosteroid Structure-Activity Relationships (SAR):',
              subStatements: [
                {
                  id: 'p7_s1_1',
                  text: 'A 16,17-acetal group (e.g., in triamcinolone acetonide) increases topical glucocorticoid potency and markedly decreases salt retention.',
                  isCorrect: true,
                  explanation:
                    'True. The 16,17-acetonide/acetal ring increases lipophilicity and membrane partition coefficient, enhancing topical airway anti-inflammatory potency, while its steric bulk prevents binding to mineralocorticoid receptors, markedly decreasing sodium and water salt retention.',
                },
                {
                  id: 'p7_s1_2',
                  text: 'A 9a-F substituent selectively decreases mineralocorticoid activity while preserving anti-inflammatory potency.',
                  isCorrect: false,
                  explanation:
                    'False. A 9a-F (9alpha-fluoro) substituent increases BOTH glucocorticoid (anti-inflammatory) activity AND mineralocorticoid (salt-retaining) activity due to strong inductive electron withdrawal that increases the acidity of the 11beta-OH group. To eliminate the unwanted mineralocorticoid activity introduced by 9a-F, a 16alpha-methyl, 16beta-methyl, 16alpha-hydroxyl, or 16,17-acetonide group must be co-introduced.',
                },
                {
                  id: 'p7_s1_3',
                  text: 'Triamcinolone and methylprednisolone have little to no mineralocorticoid activity due to steric/conformational disruption at C16 or C6.',
                  isCorrect: true,
                  explanation:
                    'True. In Triamcinolone, the 16alpha-hydroxyl (or 16,17-acetonide) sterically prevents accommodation into the mineralocorticoid receptor pocket. In Methylprednisolone, the 6alpha-methyl group disrupts mineralocorticoid receptor binding conformation, conferring virtually zero salt-retaining activity.',
                },
              ],
              overallExplanation:
                'SAR summary: 9alpha-fluorination increases both glucocorticoid and mineralocorticoid binding. Adding steric bulk at C16 (16alpha/beta methyl, 16alpha-OH, 16,17-acetonide) selectively abolishes mineralocorticoid affinity while preserving or boosting glucocorticoid anti-inflammatory efficacy.',
            },
            // Q702 (Biotransformations)
            {
              id: 702,
              questionNumberLabel: 'Question 2',
              type: 'multiple-choice',
              title: 'Corticosteroid Metabolic Biotransformations & Bioactivations',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 7, Question 2',
              sourcePageNumber: 7,
              questionStem:
                'Evaluate the critical enzymatic biotransformations of respiratory corticosteroids: Beclomethasone dipropionate to Beclomethasone 17-monopropionate (17-BMP), Prednisone to Prednisolone, and Fluticasone propionate clearance:',
              options: [
                'Beclomethasone dipropionate is cleaved by airway carboxylesterases to Beclomethasone 17-monopropionate (17-BMP, with 25-fold higher GR affinity); Prednisone (11-keto) is reduced by hepatic 11beta-HSD1 to Prednisolone (11beta-OH); and Fluticasone propionate is cleaved by CYP3A4 to an inactive 17beta-carboxylic acid',
                'Beclomethasone dipropionate is active parent drug while 17-BMP is an inactive waste product; Prednisone is active while Prednisolone is an inactive metabolite',
                'All three corticosteroids are cleared exclusively by non-enzymatic spontaneous renal decarboxylation',
                'Beclomethasone 17-monopropionate requires 11beta-HSD2 oxidation in the lung to gain anti-inflammatory activity',
              ],
              correctIndex: 0,
              explanation:
                'Three hallmark biotransformations govern clinical steroid therapy: (1) Inhaled Beclomethasone dipropionate (BDP) is a prodrug rapidly hydrolyzed by human airway carboxylesterases at C21 to generate Beclomethasone 17-monopropionate (17-BMP), which exhibits a 25-fold higher affinity for the glucocorticoid receptor than parent BDP; (2) Orally administered Prednisone is an inactive prodrug bearing an 11-keto group that must be stereospecifically reduced by hepatic 11beta-HSD1 to active Prednisolone (11beta-OH); and (3) Fluticasone propionate is a soft steroid whose 17beta-carbothioate fluoromethyl ester is rapidly hydrolyzed upon systemic entry by hepatic CYP3A4 into an inactive 17beta-carboxylic acid metabolite.',
            },
            // Q703 (Theophylline vs Roflumilast True/False battery)
            {
              id: 703,
              questionNumberLabel: 'Question 3',
              type: 'sub-statements',
              title: 'Comparative Chemistry & Pharmacology: Theophylline (Drug A) vs Roflumilast (Drug B)',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 7, Question 3',
              sourcePageNumber: 7,
              prompt:
                'Evaluate the following 5 True/False statements comparing Theophylline (Drug A) and Roflumilast (Drug B) from Review Page 7:',
              subStatements: [
                {
                  id: 'p7_s3_1',
                  text: 'Drug A is methylxanthine whereas Drug B is a dichloropyridine-benzamide derivative.',
                  isCorrect: true,
                  explanation:
                    'True. Drug A (Theophylline) is a 1,3-dimethylxanthine alkaloid, whereas Drug B (Roflumilast) is a synthetic 3,5-dichloropyridine-4-carboxamide (benzamide) derivative.',
                },
                {
                  id: 'p7_s3_2',
                  text: 'The two drugs are bronchodilators.',
                  isCorrect: false,
                  explanation:
                    'False. Theophylline (Drug A) has mild-to-moderate bronchodilator activity via PDE3/4/5 inhibition and adenosine antagonism, but Roflumilast (Drug B) is a selective PDE4 inhibitor with purely anti-inflammatory actions; it does not relax airway smooth muscle and is NOT a bronchodilator.',
                },
                {
                  id: 'p7_s3_3',
                  text: 'Drug A is an antimuscarinic agent whereas Drug B is a β2-agonist.',
                  isCorrect: false,
                  explanation:
                    'False. Neither drug belongs to these classes. Drug A is a nonselective PDE inhibitor and adenosine receptor antagonist; Drug B is a selective PDE4 inhibitor.',
                },
                {
                  id: 'p7_s3_4',
                  text: 'The two drugs can be used in the management of asthma.',
                  isCorrect: false,
                  explanation:
                    'False. Although Theophylline (Drug A) has historically been used in asthma, Roflumilast (Drug B) is approved and indicated strictly to reduce exacerbations in severe COPD associated with chronic bronchitis; it is not indicated for asthma.',
                },
                {
                  id: 'p7_s3_5',
                  text: 'The two drugs are metabolized by CYP1A2 resulting in more active, and long-acting metabolites.',
                  isCorrect: false,
                  explanation:
                    'False. Theophylline is cleared by CYP1A2 to inactive metabolites (1,3-dimethyluric acid, 1-methylxanthine, 3-methylxanthine), so both drugs do not yield more active long-acting metabolites via CYP1A2.',
                },
              ],
              overallExplanation:
                'Comparison of Theophylline (Drug A) vs Roflumilast (Drug B): Drug A is a methylxanthine and bronchodilator; Drug B is a dichloropyridine-benzamide selective PDE4 anti-inflammatory agent (NOT a bronchodilator). Drug B is indicated for COPD, not asthma. CYP1A2 metabolizes Theophylline into inactive excretory products.',
            },
          ],
        },
      ],
    },

    // =========================================================================
    // REVIEW PAGE 8: Mechanism Matching & Beclomethasone vs Hydrocortisone Succinate
    // =========================================================================
    {
      pageNumber: 8,
      pageTitle:
        'Review Page 8: Mechanism Matching & Parenteral vs Inhaled Steroids',
      title: 'Respiratory Mechanism Matching & Steroid Formulations',
      subtitle:
        '7-Drug Target Matching (M3, PLA2/Annexin A1, Dual PDE3/4, CysLT1, 5-LOX, Beta2, PDE) & Ester Prodrug Rationale',
      sections: [
        {
          id: 'resp_p8_s1',
          sectionTitle:
            'Review Page 8: 7-Drug Molecular Target Matrix & Formulations',
          headerNote:
            'Match respiratory therapeutic agents (I–VII) to their exact molecular targets and evaluate the contrasting formulation chemistry of Beclomethasone dipropionate versus Hydrocortisone sodium succinate:',
          structures: [
            ACLIDINIUM_STRUCTURE,
            METHYLPREDNISOLONE_STRUCTURE,
            ENSIFENTRINE_STRUCTURE,
            MONTELUKAST_STRUCTURE,
            ZILEUTON_STRUCTURE,
            OLODATEROL_STRUCTURE,
            THEOPHYLLINE_STRUCTURE,
            BECLOMETHASONE_DIPROPIONATE_STRUCTURE,
            HYDROCORTISONE_SODIUM_SUCCINATE_STRUCTURE,
          ],
          questions: [
            // Q801 (7 matching targets A to G)
            {
              id: 801,
              questionNumberLabel: 'Question 1',
              type: 'matching',
              title: '7-Drug Respiratory Molecular Mechanism Matching',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 8, Question 1',
              sourcePageNumber: 8,
              questionStem:
                'Drag each chemical structure (Structure I - Structure VII) to its precise pharmacological target and biochemical mechanism of action:',
              prompt:
                'Drag each chemical structure (Structure I - Structure VII) to its precise pharmacological target and biochemical mechanism of action:',
              structuresDisplayed: [
                ACLIDINIUM_STRUCTURE,
                METHYLPREDNISOLONE_STRUCTURE,
                ENSIFENTRINE_STRUCTURE,
                MONTELUKAST_STRUCTURE,
                ZILEUTON_STRUCTURE,
                OLODATEROL_STRUCTURE,
                THEOPHYLLINE_STRUCTURE,
              ],
              matchingTargets: [
                {
                  id: 'target_m3_antag',
                  label: 'Muscarinic M3 receptor antagonist',
                  acceptedStructureIds: ['I', 'aclidinium'],
                  rationale:
                    'Structure I (Aclidinium bromide) is a long-acting muscarinic M3 receptor antagonist (LAMA) that blocks acetylcholine-mediated bronchoconstriction in airway smooth muscle.',
                },
                {
                  id: 'target_pla2_annexin',
                  label: 'Phospholipase A2 (cPLA2) indirect inhibitor via Annexin A1 induction',
                  acceptedStructureIds: ['II', 'methylprednisolone'],
                  rationale:
                    'Structure II (Methylprednisolone) is a synthetic glucocorticoid that transactivates Annexin A1 (lipocortin-1), indirectly inhibiting cytosolic Phospholipase A2 (cPLA2) to halt the arachidonic acid cascade.',
                },
                {
                  id: 'target_dual_pde',
                  label: 'Dual PDE3 and PDE4 inhibitor',
                  acceptedStructureIds: ['III', 'ensifentrine'],
                  rationale:
                    'Structure III (Ensifentrine / RPL554) is a novel first-in-class inhaled dual inhibitor of both PDE3 and PDE4, providing simultaneous bronchodilation (via PDE3) and mucosal anti-inflammatory action (via PDE4).',
                },
                {
                  id: 'target_cyslt1_antag',
                  label: 'Cysteinyl leukotriene receptor 1 (CysLT1) antagonist',
                  acceptedStructureIds: ['IV', 'montelukast'],
                  rationale:
                    'Structure IV (Montelukast) is a selective high-affinity competitive antagonist of the CysLT1 receptor, blocking LTD4- and LTE4-mediated bronchospasm and vascular permeability.',
                },
                {
                  id: 'target_5lox_inhib',
                  label: '5-Lipoxygenase (5-LOX) inhibitor',
                  acceptedStructureIds: ['V', 'zileuton'],
                  rationale:
                    'Structure V (Zileuton) is an N-hydroxyurea derivative that directly inhibits 5-Lipoxygenase (5-LOX) via iron chelation, blocking the initial synthesis of all leukotrienes (LTA4, LTB4, LTC4, LTD4, LTE4).',
                },
                {
                  id: 'target_beta2_agon',
                  label: 'Selective beta-2 adrenergic receptor agonist',
                  acceptedStructureIds: ['VI', 'olodaterol'],
                  rationale:
                    'Structure VI (Olodaterol) is an ultra-long-acting selective beta-2 adrenergic agonist (ultra-LABA) stimulating Gs-coupled adenylyl cyclase to relax bronchial smooth muscle for 24 hours.',
                },
                {
                  id: 'target_pde_nonselective',
                  label: 'Nonselective Phosphodiesterase (PDE) inhibitor & adenosine antagonist',
                  acceptedStructureIds: ['VII', 'theophylline'],
                  rationale:
                    'Structure VII (Theophylline) is a nonselective competitive phosphodiesterase (PDE) inhibitor and adenosine receptor antagonist that elevates intracellular cAMP/cGMP and activates HDAC2.',
                },
              ],
              options: [
                'Structure I: Muscarinic M3 antagonist',
                'Structure II: Phospholipase A2 inhibitor via Annexin A1',
                'Structure III: Dual PDE3 and PDE4 inhibitor',
                'Structure IV: CysLT1 receptor antagonist',
                'Structure V: 5-Lipoxygenase (5-LOX) inhibitor',
                'Structure VI: Selective beta-2 adrenergic agonist',
                'Structure VII: Nonselective PDE inhibitor & adenosine antagonist',
              ],
              correctAnswer: 'I: M3; II: PLA2/Annexin; III: Dual PDE3/4; IV: CysLT1; V: 5-LOX; VI: Beta-2; VII: Nonselective PDE',
              explanation:
                'Target mapping: I Aclidinium = M3 antagonist; II Methylprednisolone = PLA2 inhibitor via Annexin A1; III Ensifentrine = Dual PDE3/PDE4 inhibitor; IV Montelukast = CysLT1 antagonist; V Zileuton = 5-LOX inhibitor; VI Olodaterol = Beta2 agonist; VII Theophylline = Nonselective PDE inhibitor.',
            },
            // Q802
            {
              id: 802,
              questionNumberLabel: 'Question 2',
              type: 'multiple-choice',
              title: 'Formulation Chemistry: Beclomethasone Dipropionate vs Hydrocortisone Sodium Succinate',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 8, Question 2',
              sourcePageNumber: 8,
              questionStem:
                'Why is Hydrocortisone sodium succinate formulated as an intravenous injection, whereas Beclomethasone dipropionate is formulated as an inhaled aerosol?',
              options: [
                'Hydrocortisone sodium succinate has a polar sodium carboxylate salt at C21 providing high water solubility (>500 mg/mL) for emergency IV infusion; Beclomethasone dipropionate carries two lipophilic propionate esters providing airway tissue deposition and low systemic oral bioavailability',
                'Hydrocortisone sodium succinate is insoluble in water and can only be injected as an oil emulsion',
                'Beclomethasone dipropionate is fatal if inhaled into the bronchial tree',
                'Both drugs have identical water solubilities and can be interchanged freely between IV and inhalation routes',
              ],
              correctIndex: 0,
              explanation:
                'Hydrocortisone sodium succinate is esterified at C21 with succinic acid; the remaining free carboxyl group forms a sodium salt that ionizes at physiological pH (pKa ~4.5), yielding extreme aqueous solubility (>500 mg/mL) suitable for rapid intravenous bolus or infusion in life-threatening status asthmaticus or adrenal crisis. In contrast, Beclomethasone dipropionate is a highly lipophilic diester designed for dry powder or metered-dose inhalation: high lipophilicity enhances cellular uptake and airway retention, while extensive hepatic first-pass clearance of swallowed aerosol protects against systemic toxicity.',
            },
            // Q803
            {
              id: 803,
              questionNumberLabel: 'Question 3',
              type: 'sub-statements',
              title: 'Leukotriene Pathway Modulators: Montelukast vs Zileuton',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 8, Question 3',
              sourcePageNumber: 8,
              prompt:
                'Evaluate the following statements regarding the leukotriene pathway modulators Montelukast and Zileuton:',
              subStatements: [
                {
                  id: 'p8_s3_1',
                  text: 'Zileuton inhibits 5-Lipoxygenase (5-LOX), thereby blocking the synthesis of both cysteinyl leukotrienes (LTC4, LTD4, LTE4) and the potent neutrophil chemoattractant leukotriene B4 (LTB4).',
                  isCorrect: true,
                  explanation:
                    '5-Lipoxygenase is the upstream gateway enzyme converting arachidonic acid to 5-HPETE and LTA4. By inhibiting 5-LOX, Zileuton shuts off production of both the neutrophil chemotactic factor LTB4 and the bronchoconstricting cysteinyl leukotrienes.',
                },
                {
                  id: 'p8_s3_2',
                  text: 'Montelukast selectively blocks the CysLT1 receptor, preventing LTD4-mediated bronchospasm, but has no direct effect on LTB4 synthesis or neutrophil recruitment.',
                  isCorrect: true,
                  explanation:
                    'Montelukast is a selective competitive CysLT1 receptor antagonist. It does not inhibit the 5-LOX enzyme; therefore, synthesis of LTB4 continues unaltered, and Montelukast does not directly suppress LTB4-mediated neutrophil chemotaxis.',
                },
                {
                  id: 'p8_s3_3',
                  text: 'Zileuton undergoes extensive hepatic metabolism, inhibits CYP1A2 (significantly increasing theophylline concentrations), and requires routine liver function test (LFT) monitoring due to potential hepatotoxicity.',
                  isCorrect: true,
                  explanation:
                    'Zileuton is associated with reversible elevations in hepatic transaminases in 2-4% of patients, requiring baseline and periodic liver function monitoring. It is also a potent inhibitor of CYP1A2, doubling serum levels of co-administered theophylline and raising warfarin levels.',
                },
                {
                  id: 'p8_s3_4',
                  text: 'Montelukast carries an FDA boxed warning for serious neuropsychiatric events, including agitation, aggression, depression, sleep disturbances, and suicidal thoughts or behaviors.',
                  isCorrect: true,
                  explanation:
                    'The FDA instituted a boxed warning for Montelukast in 2020 highlighting risks of adverse neuropsychiatric events across adult and pediatric patients, recommending avoidance in patients with mild symptoms treatable with alternative therapies.',
                },
              ],
              overallExplanation:
                'Leukotriene modulators act at two distinct nodes: 5-LOX enzyme inhibition (Zileuton, shutting off LTB4 and cysteinyl leukotrienes; requires LFT monitoring and CYP1A2 caution) versus CysLT1 receptor antagonism (Montelukast, once-daily oral dosing; boxed warning for neuropsychiatric events).',
            },
          ],
        },
      ],
    },

    // =========================================================================
    // REVIEW PAGE 9: Comprehensive True/False Comparative Batteries
    // =========================================================================
    {
      pageNumber: 9,
      pageTitle: 'Review Page 9: Comprehensive True/False Comparative Batteries',
      title: 'Head-to-Head Comparative Medicinal Chemistry Batteries',
      subtitle:
        'Beclomethasone Dipropionate vs Hydrocortisone Succinate (10 Items) and Tiotropium vs Pirbuterol (5 Items)',
      sections: [
        {
          id: 'resp_p9_s1',
          sectionTitle:
            'Review Page 9: Comprehensive 10-Item & 5-Item True/False Batteries',
          headerNote:
            'Carefully evaluate the following head-to-head True/False comparative batteries strictly matching Dr. Al-Horani’s Review Page 9 review items:',
          structures: [
            BECLOMETHASONE_DIPROPIONATE_STRUCTURE,
            HYDROCORTISONE_SODIUM_SUCCINATE_STRUCTURE,
            TIOTROPIUM_STRUCTURE,
            PIRBUTEROL_STRUCTURE,
          ],
          questions: [
            // Question 901: 10 Sub-statements comparing Beclomethasone dipropionate vs Hydrocortisone sodium succinate
            {
              id: 901,
              questionNumberLabel: 'Question 1',
              type: 'sub-statements',
              title: 'Beclomethasone Dipropionate (Drug A) vs Hydrocortisone Sodium Succinate (Drug B)',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 9, Question 1',
              sourcePageNumber: 9,
              questionStem:
                'Evaluate the following 10 comparative statements regarding Beclomethasone dipropionate (Drug A) and Hydrocortisone sodium succinate (Drug B):',
              subStatements: [
                {
                  id: 'p9_s1_1',
                  text: 'Drug A is a glucocorticoid whereas Drug B is a mineralocorticoid.',
                  isCorrect: false,
                  explanation:
                    'False. Both drugs are glucocorticoids. Drug B (hydrocortisone sodium succinate) is the synthetic hemisuccinate salt of cortisol, the natural endogenous glucocorticoid, not a mineralocorticoid (aldosterone is the mineralocorticoid).',
                },
                {
                  id: 'p9_s1_2',
                  text: 'The two drugs are adrenocorticoids.',
                  isCorrect: true,
                  explanation:
                    'True. Both drugs are adrenocorticoids (steroids derived from or mimicking hormones of the adrenal cortex).',
                },
                {
                  id: 'p9_s1_3',
                  text: 'The two drugs are glucocorticoid receptor agonists (hydrocortisone-like).',
                  isCorrect: true,
                  explanation:
                    'True. Both drugs bind to and activate the intracellular glucocorticoid receptor (GR) to mediate anti-inflammatory responses.',
                },
                {
                  id: 'p9_s1_4',
                  text: 'The two drugs are anti-inflammatory.',
                  isCorrect: true,
                  explanation:
                    'True. Both agents exert powerful anti-inflammatory effects by suppressing pro-inflammatory cytokine and chemokine gene expression.',
                },
                {
                  id: 'p9_s1_5',
                  text: 'The two drugs exhibit strong salt-retaining properties.',
                  isCorrect: false,
                  explanation:
                    'False. Drug A (Beclomethasone dipropionate) has negligible mineralocorticoid salt-retaining activity due to its 16beta-methyl group, and Drug B has only modest physiological salt retention; neither exhibits strong salt-retaining activity.',
                },
                {
                  id: 'p9_s1_6',
                  text: 'Drug A is more active than Drug B.',
                  isCorrect: true,
                  explanation:
                    'True. Beclomethasone dipropionate (and its active metabolite 17-BMP) has hundreds of times higher glucocorticoid receptor affinity and topical anti-inflammatory potency than hydrocortisone.',
                },
                {
                  id: 'p9_s1_7',
                  text: 'Drug A can be used via inhalation whereas Drug B is used parenterally via IV.',
                  isCorrect: true,
                  explanation:
                    'True. Drug A is a lipophilic diester optimized for aerosol inhalation in chronic asthma, whereas Drug B is a water-soluble ester salt designed for rapid IV injection in acute emergency status asthmaticus.',
                },
                {
                  id: 'p9_s1_8',
                  text: 'Drug A has a longer duration of action than Drug B.',
                  isCorrect: true,
                  explanation:
                    'True. Inhaled beclomethasone dipropionate has prolonged local pulmonary retention and a 12-24 hour duration of action, whereas parenteral hydrocortisone has a short biological half-life and duration (8-12 hours).',
                },
                {
                  id: 'p9_s1_9',
                  text: 'The two drugs can be used in the management of asthma and/or COPD.',
                  isCorrect: true,
                  explanation:
                    'True. Both are established agents in respiratory therapeutics: Drug A for chronic maintenance control and Drug B for acute severe exacerbations.',
                },
                {
                  id: 'p9_s1_10',
                  text: 'Drug A is a diester, lipophilic prodrug whereas Drug B is a locally acting, soft steroid.',
                  isCorrect: false,
                  explanation:
                    'False. Drug A is indeed a lipophilic diester prodrug, but Drug B is an injectable water-soluble prodrug, NOT a locally acting soft steroid (fluticasone propionate is an example of a soft steroid).',
                },
              ],
              overallExplanation:
                'Review Page 9 Head-to-Head Comparison: BDP (Drug A) is an inhaled lipophilic diester prodrug with high GR potency, long duration, and no mineralocorticoid effect. Hydrocortisone sodium succinate (Drug B) is a water-soluble C21 ester salt prodrug for emergency IV administration in acute status asthmaticus.',
            },
            // Question 902: 5 Sub-statements comparing Tiotropium vs Pirbuterol
            {
              id: 902,
              questionNumberLabel: 'Question 2',
              type: 'sub-statements',
              title: 'Tiotropium (Drug A) vs Pirbuterol (Drug B)',
              sourceReference:
                'Respiratory Med Chem (Asthma/COPD) Review, Page 9, Question 2',
              sourcePageNumber: 9,
              questionStem:
                'Evaluate the following 5 comparative statements regarding Tiotropium (Drug A) and Pirbuterol (Drug B):',
              subStatements: [
                {
                  id: 'p9_s2_1',
                  text: 'Drug A is amino-ester whereas Drug B is a phenyl-ethanol amine.',
                  isCorrect: true,
                  explanation:
                    'True. Tiotropium (Drug A) is an amino-ester (quaternary tropine ester of dithienylglycolic acid), whereas Pirbuterol (Drug B) is a bioisosteric pyridine-ethanolamine congener of phenylethanolamines.',
                },
                {
                  id: 'p9_s2_2',
                  text: 'Drug A is a bronchodilator whereas Drug B is a glucocorticoid agonist.',
                  isCorrect: false,
                  explanation:
                    'False. Both drugs are bronchodilators. Drug B (Pirbuterol) is a selective beta-2 adrenergic agonist, NOT a glucocorticoid agonist.',
                },
                {
                  id: 'p9_s2_3',
                  text: 'Drug A is an antimuscarinic agent whereas Drug B is a β2-agonist.',
                  isCorrect: true,
                  explanation:
                    'True. Tiotropium (Drug A) is a long-acting muscarinic M3 antagonist (LAMA), whereas Pirbuterol (Drug B) is a short-acting selective beta-2 agonist (SABA).',
                },
                {
                  id: 'p9_s2_4',
                  text: 'The two drugs can be used in the management of asthma and/or COPD.',
                  isCorrect: true,
                  explanation:
                    'True. Both drugs are bronchodilators indicated for the management of bronchospasm in asthma and/or COPD.',
                },
                {
                  id: 'p9_s2_5',
                  text: 'The two drugs are used via oral inhalation and metabolized extensively by hepatic enzymes.',
                  isCorrect: false,
                  explanation:
                    'False. While both are administered via oral inhalation, neither is extensively metabolized by hepatic CYP enzymes; Tiotropium is eliminated largely unchanged renally with minimal non-enzymatic cleavage, and Pirbuterol is primarily conjugated or excreted unchanged.',
                },
              ],
              overallExplanation:
                'Review Page 9 Head-to-Head Comparison: Tiotropium (Drug A) is a quaternary amino-ester LAMA blocking M3 receptors for >24 hours. Pirbuterol (Drug B) is a pyridine-ethanolamine SABA activating beta-2 adrenoceptors for 4-6 hours. Both are bronchodilators used in asthma/COPD.',
            },
          ],
        },
      ],
    },
  ];
}

// =============================================================================
// DEFAULT RESPIRATORY REVIEW MODULE EXPORT
// =============================================================================

export function getDefaultRespiratoryReviewModule(): ReviewModule {
  return {
    id: 'respiratory_review_mcp2',
    title: 'Review for Respiratory Drugs',
    subtitle:
      'Adrenergic SAR, Anticholinergics, Corticosteroids, PDE Inhibitors & Leukotriene Modulators',
    course: 'Medicinal Chemistry (MCP II)',
    semester: 'Fall 2026',
    code: 'Exam 1',
    examId: 'exam_1',
    examTitle: 'Exam 1: Renal & Respiratory Medicinal Chemistry',
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    version: '2.2.0',
    chemicalStructures: Object.values(RESPIRATORY_REVIEW_STRUCTURES),
    pages: getRespiratoryReviewPages(),
  };
}
