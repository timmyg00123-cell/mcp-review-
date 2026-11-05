import {
  ReviewModule,
  ReviewPage,
  ChemicalStructure,
} from '../types/reviewModule';
import {
  CLASS_I_KINETICS_WORKBENCH_DATA,
  AMIODARONE_SAR_WORKBENCH_DATA,
} from './antiarrhythmicWorkbenchData';

// --- Shared Chemical Structures for Antiarrhythmics ---

export const PROPAFENONE_STRUCTURE: ChemicalStructure = {
  id: 'propafenone',
  name: 'Propafenone',
  document_label: 'Propafenone (Rythmol) - Class IC',
  tradeName: 'Rythmol',
  smiles: 'CCCNC[C@H](O)COc1ccccc1C(=O)CCc2ccccc2',
  canonical_smiles: 'CCCNC[C@H](O)COc1ccccc1C(=O)CCc2ccccc2',
  cid: 4932,
  mw: 341.4,
  chemicalClass: 'Phenoxy propyloxyamine (Aryloxypropanolamine derivative)',
  pharmacologicalClass: 'Class IC Antiarrhythmic / Weak Beta-Adrenergic Blocker',
  target: 'Voltage-gated Sodium Channel Nav1.5 & Beta-1/Beta-2 Adrenergic Receptors',
  target_receptor: 'Nav1.5 Pore Domain (Slow Dissociation tau > 10s)',
  reversibility: 'Reversible',
  drug_state: 'Active drug',
  route: 'Oral',
  keyFunctionalGroups: ['Aryloxypropanolamine core', 'Alkyl phenyl ketone', 'Secondary Propylamino Group'],
  pkPdHighlights: {
    onset: '1-3 hours',
    duration: '8-12 hours',
    halfLife: '2-10 hours (extensive metabolizers) / 10-32 hours (poor metabolizers)',
    elimination: 'CYP2D6 5-hydroxylation and CYP1A2/3A4 N-depropylation',
    bioactivation: '5-Hydroxypropafenone retains sodium blocking potency equal to parent',
  },
  sarNotes:
    'The aryloxypropanolamine framework is identical to beta-blockers (e.g. propranolol), explaining its significant beta-blocking adverse effects (bradycardia, bronchospasm). Slow sodium channel dissociation causes pronounced QRS widening without APD change.',
  moa_summary:
    'Potently suppresses Phase 0 rapid depolarization by blocking inward INa current with slow recovery kinetics. Concurrently exerts mild non-selective beta-adrenoceptor antagonism.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/4932/PNG',
};

export const LIDOCAINE_STRUCTURE: ChemicalStructure = {
  id: 'lidocaine',
  name: 'Lidocaine',
  document_label: 'Lidocaine (Xylocaine) - Class IB',
  tradeName: 'Xylocaine',
  smiles: 'CCN(CC)CC(=O)Nc1c(C)cccc1C',
  canonical_smiles: 'CCN(CC)CC(=O)Nc1c(C)cccc1C',
  cid: 3676,
  mw: 234.34,
  chemicalClass: 'Xylene Amide (Aminoacyl Xylide)',
  pharmacologicalClass: 'Class IB Antiarrhythmic / Sodium Channel Blocker',
  target: 'Voltage-gated Sodium Channel Nav1.5 (Inactivated state preference)',
  target_receptor: 'Nav1.5 Pore Domain (Fast Dissociation tau < 1s)',
  reversibility: 'Reversible',
  drug_state: 'Active drug',
  route: 'IV only (High hepatic extraction ratio ~0.7)',
  keyFunctionalGroups: ['2,6-Xylyl group', 'Amide linkage', 'Tertiary diethylamino group'],
  pkPdHighlights: {
    onset: 'Immediate',
    duration: '10-20 min',
    halfLife: '1.5-2 hours',
    elimination: 'Hepatic CYP1A2/3A4 oxidative N-deethylation to MEGX; amidase hydrolysis',
    bioactivation: 'MEGX retains ~80% antiarrhythmic potency; GX has minor activity',
  },
  sarNotes:
    'Ortho-methyl groups protect the amide from amidases. Rapid recovery kinetics (tau < 1s) ensure safe dissociation at normal heart rates but selective blockade in ischemic/depolarized tissues. Shortens Action Potential Duration (APD).',
  moa_summary:
    'Selectively suppresses open and inactivated cardiac Na+ channels in ischemic or rapidly firing ventricular tissue without significantly impairing conduction in normal tissue.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/3676/PNG',
};

export const PROCAINAMIDE_STRUCTURE: ChemicalStructure = {
  id: 'procainamide',
  name: 'Procainamide',
  document_label: 'Procainamide (Pronestyl) - Class IA',
  tradeName: 'Pronestyl',
  smiles: 'CCN(CC)CCNC(=O)c1ccc(N)cc1',
  canonical_smiles: 'CCN(CC)CCNC(=O)c1ccc(N)cc1',
  cid: 4913,
  mw: 235.33,
  chemicalClass: 'p-Amino benzamide',
  pharmacologicalClass: 'Class IA Antiarrhythmic (Na+ and K+ Channel Blocker)',
  target: 'Nav1.5 & Kv11.1 (hERG / IKr)',
  target_receptor: 'Nav1.5 Pore Domain (Intermediate Dissociation tau = 1-10s)',
  reversibility: 'Reversible',
  drug_state: 'Active drug',
  route: 'Oral / IV / IM',
  keyFunctionalGroups: ['p-Aminophenyl ring', 'Amide linkage', 'Basic tertiary diethylamine'],
  pkPdHighlights: {
    onset: '30-60 min (oral), immediate (IV)',
    duration: '3-5 hours',
    halfLife: '3-4 hours (Procainamide) / 6-8 hours (NAPA)',
    elimination: 'Renal (50-60% unchanged) & Hepatic NAT2 acetylation to NAPA',
    bioactivation: 'NAPA (N-acetylprocainamide) is a pure Class III antiarrhythmic agent',
  },
  sarNotes:
    'Bioisosteric replacement of the ester in procaine with an amide provides resistance to pseudocholinesterase. Fast vs slow acetylator phenotype (NAT2 polymorphism) dictates NAPA accumulation, TdP risk, and drug-induced lupus erythematosus.',
  moa_summary:
    'Moderately blocks Phase 0 inward Na+ current (intermediate kinetics) and delays Phase 3 repolarization by blocking delayed rectifier K+ channels, prolonging APD and QTc interval.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/4913/PNG',
};

export const DISOPYRAMIDE_STRUCTURE: ChemicalStructure = {
  id: 'disopyramide',
  name: 'Disopyramide',
  document_label: 'Disopyramide (Norpace) - Class IA',
  tradeName: 'Norpace',
  smiles: 'CC(C)N(CCC(C(=O)N)(c1ccccc1)c2ccccn2)C(C)C',
  canonical_smiles: 'CC(C)N(CCC(C(=O)N)(c1ccccc1)c2ccccn2)C(C)C',
  cid: 3114,
  mw: 339.5,
  chemicalClass: 'Amino butamide (alpha-phenyl-alpha-(2-pyridyl)butyramide derivative)',
  pharmacologicalClass: 'Class IA Antiarrhythmic / Potent Anticholinergic Agent',
  target: 'Nav1.5 & Muscarinic M2/M3 Receptors & IKr',
  target_receptor: 'Nav1.5 & Muscarinic Acetylcholine Receptor',
  reversibility: 'Reversible',
  drug_state: 'Active drug',
  route: 'Oral',
  keyFunctionalGroups: ['Pyridine ring', 'Terminal Primary Amide', 'Diisopropylamino alkyl chain'],
  pkPdHighlights: {
    onset: '30-60 min',
    duration: '6-8 hours',
    halfLife: '6-8 hours',
    elimination: 'Renal (50-60% unchanged) & Hepatic CYP3A4 N-dealkylation',
    bioactivation: 'Mono-N-dealkyldisopyramide has 24x anticholinergic potency',
  },
  sarNotes:
    'Potent anticholinergic side effects (dry mouth, urinary retention, blurred vision, glaucoma exacerbation) and negative inotropic effect. Prolongs APD and QT interval.',
  moa_summary:
    'Slows Phase 0 depolarization and lengthens the refractory period/APD. Significant parasympatholytic actions can paradoxically accelerate AV conduction.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/3114/PNG',
};

export const FLECAINIDE_STRUCTURE: ChemicalStructure = {
  id: 'flecainide',
  name: 'Flecainide',
  document_label: 'Flecainide (Tambocor) - Class IC',
  tradeName: 'Tambocor',
  smiles: 'O=C(NCC1CCCCN1)c2cc(OCC(F)(F)F)ccc2OCC(F)(F)F',
  canonical_smiles: 'O=C(NCC1CCCCN1)c2cc(OCC(F)(F)F)ccc2OCC(F)(F)F',
  cid: 3356,
  mw: 414.34,
  chemicalClass: 'Fluorinated benzamide piperidine (Bis-trifluoroethoxy benzamide)',
  pharmacologicalClass: 'Class IC Antiarrhythmic / Potent Sodium Channel Blocker',
  target: 'Voltage-gated Sodium Channel Nav1.5',
  target_receptor: 'Nav1.5 Pore Domain (Very Slow Dissociation tau > 10s)',
  reversibility: 'Reversible',
  drug_state: 'Active drug',
  route: 'Oral',
  keyFunctionalGroups: ['Bis-2,2,2-trifluoroethoxy rings', 'Benzamide linker', 'Piperidine 2-position basic amine'],
  pkPdHighlights: {
    onset: '1-2 hours',
    duration: '12-24 hours',
    halfLife: '12-20 hours',
    elimination: 'Hepatic CYP2D6 O-dealkylation to m-O-dealkylflecainide; renal excretion',
    bioactivation: 'Metabolites are weak/inactive; parent drug responsible for activity',
  },
  sarNotes:
    'Trifluoroethoxy groups enhance lipophilicity and metabolic stability. Marked depression of Phase 0 Vmax and prominent conduction slowing (QRS widening) without affecting APD. Contraindicated post-MI (CAST trial).',
  moa_summary:
    'Binds open state of Nav1.5 with extremely slow recovery kinetics. Profoundly depresses upstroke velocity (Phase 0) across all cardiac tissues.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/3356/PNG',
};

export const MEXILETINE_STRUCTURE: ChemicalStructure = {
  id: 'mexiletine',
  name: 'Mexiletine',
  document_label: 'Mexiletine (Mexitil) - Class IB',
  tradeName: 'Mexitil',
  smiles: 'CC(N)COc1c(C)cccc1C',
  canonical_smiles: 'CC(N)COc1c(C)cccc1C',
  cid: 4178,
  mw: 179.26,
  chemicalClass: '1-Aryloxy-2-aminopropane (Primary amine ether)',
  pharmacologicalClass: 'Class IB Antiarrhythmic / Oral Lidocaine Bioisostere',
  target: 'Nav1.5 Sodium Channel',
  target_receptor: 'Nav1.5 Inactivated State',
  reversibility: 'Reversible',
  drug_state: 'Active drug',
  route: 'Oral',
  keyFunctionalGroups: ['2,6-Dimethylphenoxy ether', 'Primary Aliphatic Amine (1o Amine)'],
  pkPdHighlights: {
    onset: '30-120 min',
    duration: '8-12 hours',
    halfLife: '10-12 hours',
    elimination: 'Hepatic CYP2D6/CYP1A2 hydroxylation and glucuronidation',
    bioactivation: 'Active as parent; metabolites inactive',
  },
  sarNotes:
    'Replacing the hydrolyzable amide of lidocaine with an ether linkage eliminates first-pass amidase degradation, conferring high oral bioavailability (~90%). The primary amine resists dealkylation compared to tertiary amines.',
  moa_summary:
    'Acts analogously to lidocaine on cardiac Nav1.5 channels with rapid dissociation kinetics (tau < 1s), selectively shortening APD in diseased ventricular tissue.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/4178/PNG',
};

export const PROPRANOLOL_STRUCTURE: ChemicalStructure = {
  id: 'propranolol',
  name: 'Propranolol',
  document_label: 'Propranolol (Inderal) - Class II',
  tradeName: 'Inderal',
  smiles: 'CC(C)NCC(O)COc1cccc2ccccc12',
  canonical_smiles: 'CC(C)NCC(O)COc1cccc2ccccc12',
  cid: 4946,
  mw: 259.34,
  chemicalClass: 'Aryloxypropanolamine (Naphthyloxypropanolamine)',
  pharmacologicalClass: 'Class II Antiarrhythmic / Non-selective Beta-Adrenergic Blocker',
  target: 'Beta-1 and Beta-2 Adrenergic Receptors & Nav1.5 (Membrane stabilizing)',
  target_receptor: 'Beta-1/Beta-2 GPCR',
  reversibility: 'Reversible Competitive',
  drug_state: 'Active drug',
  route: 'Oral / IV',
  keyFunctionalGroups: ['Naphthalene bicycle', 'Oxypropanolamine chain', 'Isopropylamino group'],
  pkPdHighlights: {
    onset: '30 min (oral)',
    duration: '6-12 hours',
    halfLife: '3-4 hours',
    elimination: 'Extensive hepatic first-pass CYP2D6/CYP1A2 4-hydroxylation to active 4-OH-propranolol',
    bioactivation: '4-Hydroxypropranolol possesses equal beta-blocking potency',
  },
  sarNotes:
    'Non-selective beta blockade leads to bronchoconstriction (contraindicated in asthma/COPD). Possesses quinidine-like membrane stabilizing activity (MSA) at high doses due to weak Nav1.5 channel inhibition.',
  moa_summary:
    'Decreases SA and AV nodal automaticity, reduces Phase 4 spontaneous depolarization, and lengthens AV nodal refractory periods.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/4946/PNG',
};

export const METOPROLOL_STRUCTURE: ChemicalStructure = {
  id: 'metoprolol',
  name: 'Metoprolol',
  document_label: 'Metoprolol (Lopressor) - Class II',
  tradeName: 'Lopressor',
  smiles: 'COCCc1ccc(OCC(O)CNC(C)C)cc1',
  canonical_smiles: 'COCCc1ccc(OCC(O)CNC(C)C)cc1',
  cid: 4171,
  mw: 267.36,
  chemicalClass: 'Aryloxypropanolamine (Para-substituted phenoxy propanolamine)',
  pharmacologicalClass: 'Class II Antiarrhythmic / Cardioselective Beta-1 Blocker',
  target: 'Beta-1 Adrenergic Receptor',
  target_receptor: 'Beta-1 GPCR (Selectivity ratio ~20:1 over Beta-2)',
  reversibility: 'Reversible Competitive',
  drug_state: 'Active drug',
  route: 'Oral / IV',
  keyFunctionalGroups: ['p-(2-Methoxyethyl) group', 'Phenoxy propanolamine', 'Isopropylamino group'],
  pkPdHighlights: {
    onset: '1 hour',
    duration: '12-24 hours (succinate ER)',
    halfLife: '3-7 hours (CYP2D6 dependent)',
    elimination: 'Hepatic CYP2D6 alpha-hydroxylation and O-demethylation',
    bioactivation: 'Metabolites inactive; parent drug drives response',
  },
  sarNotes:
    'Para-substitution on the phenyl ring confers cardioselectivity (Beta-1 > Beta-2), rendering it significantly safer in patients with reactive airway disease (COPD/asthma) than non-selective propranolol.',
  moa_summary:
    'Competitively antagonizes catecholamine binding at cardiac beta-1 receptors, slowing sinus heart rate, AV nodal conduction, and ventricular contractility.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/4171/PNG',
};

export const ESMOLOL_STRUCTURE: ChemicalStructure = {
  id: 'esmolol',
  name: 'Esmolol',
  document_label: 'Esmolol (Brevibloc) - Class II',
  tradeName: 'Brevibloc',
  smiles: 'COC(=O)CCc1ccc(OCC(O)CNC(C)C)cc1',
  canonical_smiles: 'COC(=O)CCc1ccc(OCC(O)CNC(C)C)cc1',
  cid: 3305,
  mw: 295.37,
  chemicalClass: 'Aryloxypropanolamine (Ester-containing phenoxy propanolamine)',
  pharmacologicalClass: 'Class II Antiarrhythmic / Ultrashort-Acting Beta-1 Selective Blocker',
  target: 'Beta-1 Adrenergic Receptor',
  target_receptor: 'Beta-1 GPCR',
  reversibility: 'Reversible',
  drug_state: 'Active drug (Soft drug design)',
  route: 'IV infusion only',
  keyFunctionalGroups: ['Para-methyl propionate methyl ester', 'Oxypropanolamine', 'Isopropylamine'],
  pkPdHighlights: {
    onset: '1-2 minutes',
    duration: '10-20 minutes after stopping infusion',
    halfLife: '9 minutes',
    elimination: 'Rapid hydrolysis by red blood cell cytosol esterases (not pseudocholinesterase)',
    bioactivation: 'Yields free carboxylic acid metabolite with 1500x lower beta-blocking affinity',
  },
  sarNotes:
    'Rationally engineered soft drug containing an aliphatic methyl ester linkage. Rapid hydrolysis by ubiquitous erythrocyte esterases to an inactive carboxylic acid yields an ultrashort 9-minute half-life ideal for acute cardiac emergencies.',
  moa_summary:
    'Provides rapid, titration-controlled reduction of ventricular rate in supraventricular tachycardia, atrial fibrillation, or perioperative hypertension.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/3305/PNG',
};

export const SOTALOL_STRUCTURE: ChemicalStructure = {
  id: 'sotalol',
  name: 'Sotalol',
  document_label: 'Sotalol (Betapace) - Class II / Class III',
  tradeName: 'Betapace',
  smiles: 'CC(C)NCC(O)c1ccc(NS(=O)(=O)C)cc1',
  canonical_smiles: 'CC(C)NCC(O)c1ccc(NS(=O)(=O)C)cc1',
  cid: 5253,
  mw: 272.36,
  chemicalClass: 'Methanesulfonanilide Phenylethanolamine',
  pharmacologicalClass: 'Class II & Class III Antiarrhythmic (Non-selective Beta Blocker + IKr K+ Blocker)',
  target: 'Kv11.1 (hERG / IKr) Potassium Channel & Beta-1/Beta-2 Receptors',
  target_receptor: 'Kv11.1 Pore Domain / Beta-1/2 GPCR',
  reversibility: 'Reversible',
  drug_state: 'Active drug',
  route: 'Oral / IV',
  keyFunctionalGroups: ['Methanesulfonamido group (-NHSO2Me)', 'Ethanolamine linker', 'Secondary Isopropylamine'],
  pkPdHighlights: {
    onset: '1-2 hours',
    duration: '12-24 hours',
    halfLife: '12 hours',
    elimination: 'Renal (80-90% unchanged; dose adjustment vital in renal impairment)',
    bioactivation: 'Not metabolized; active as parent',
  },
  sarNotes:
    'The methanesulfonanilide moiety is the pharmacophoric signature for rapid delayed rectifier K+ current (IKr) blockade. d,l-Racemate has beta-blocking + Class III activity; d-isomer has pure Class III activity. Significant risk of TdP.',
  moa_summary:
    'Lengthens Phase 3 cardiac action potential duration and effective refractory period across atria and ventricles while simultaneously reducing sympathetic adrenergic tone.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/5253/PNG',
};

export const AMIODARONE_STRUCTURE: ChemicalStructure = {
  id: 'amiodarone',
  name: 'Amiodarone',
  document_label: 'Amiodarone (Cordarone) - Class III',
  tradeName: 'Cordarone',
  smiles: 'CCCCC1=C(C2=C(O1)C=CC(=C2)C(=O)C3=C(C(=CC(=C3)I)OCCN(CC)CC)I)CC',
  canonical_smiles: 'CCCCC1=C(C2=C(O1)C=CC(=C2)C(=O)C3=C(C(=CC(=C3)I)OCCN(CC)CC)I)CC',
  cid: 2157,
  mw: 645.3,
  chemicalClass: '2-Butylbenzofuran Diiodo-Phenolic Derivative',
  pharmacologicalClass: 'Class III Antiarrhythmic (Multi-channel: IKr, INa, ICa, Antiadrenergic)',
  target: 'Kv11.1 (IKr) & Nav1.5 & Cav1.2 & Alpha/Beta Adrenergic Receptors',
  target_receptor: 'Kv11.1 / Nav1.5 / Cav1.2 / Thyroid Receptors',
  reversibility: 'Reversible (Massive tissue accumulation, t1/2 ~58 days)',
  drug_state: 'Active drug',
  route: 'Oral / IV',
  keyFunctionalGroups: ['2-Butylbenzofuran ring', '3,5-Diiodo-substituted aromatic ketone', 'Diethylaminoethoxy group'],
  pkPdHighlights: {
    onset: '2-3 days to weeks',
    duration: 'Months',
    halfLife: '40-58 days',
    elimination: 'Hepatic CYP3A4/2C8 to active desethylamiodarone; biliary excretion',
    bioactivation: 'Desethylamiodarone (DEA) is equiactive or more potent than parent',
  },
  sarNotes:
    'Diiodo template structurally mimics thyroxine (T4/T3), provoking thyroid toxicities. Extreme lipophilicity (logP ~7.5) causes lysosomal trapping and corneal, pulmonary, hepatic, and dermal microdeposits.',
  moa_summary:
    'Prolongs action potential duration and refractoriness across all cardiac tissues via potent IKr blockade, accompanied by non-competitive blockade of Na+, Ca2+, and sympathetic adrenergic receptors.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/2157/PNG',
};

export const DRONEDARONE_STRUCTURE: ChemicalStructure = {
  id: 'dronedarone',
  name: 'Dronedarone',
  document_label: 'Dronedarone (Multaq) - Class III',
  tradeName: 'Multaq',
  smiles: 'CCCCc1oc2cc(NS(=O)(=O)C)ccc2c1C(=O)c3ccc(OCCN(CCCC)CCCC)cc3',
  canonical_smiles: 'CCCCc1oc2cc(NS(=O)(=O)C)ccc2c1C(=O)c3ccc(OCCN(CCCC)CCCC)cc3',
  cid: 60145,
  mw: 556.76,
  chemicalClass: '2-Butylbenzofuran Methanesulfonamide Derivative',
  pharmacologicalClass: 'Class III Antiarrhythmic (Non-iodinated Amiodarone Analogue)',
  target: 'Kv11.1 (IKr), Nav1.5, Cav1.2 & Adrenergic Receptors',
  target_receptor: 'Kv11.1 / Nav1.5',
  reversibility: 'Reversible',
  drug_state: 'Active drug',
  route: 'Oral with meals',
  keyFunctionalGroups: ['Methanesulfonamido group at C5', '2-Butylbenzofuran', 'Dibutylaminoethoxy chain'],
  pkPdHighlights: {
    onset: '2-4 hours',
    duration: '24-48 hours',
    halfLife: '24-30 hours',
    elimination: 'Hepatic CYP3A4 to N-debutyl metabolite; biliary/fecal excretion',
    bioactivation: 'N-debutyl metabolite is 3-10x less potent than parent',
  },
  sarNotes:
    'Removal of iodine atoms eliminates thyroid toxicity and pulmonary fibrosis. Adding a methylsulfonamide group reduces logP from 7.5 to ~4.0 and half-life from 58 days to 24 hours. Contraindicated in symptomatic heart failure (ANDROMEDA trial).',
  moa_summary:
    'Maintains electrophysiological multi-channel blockade similar to amiodarone with significantly reduced tissue accumulation and eliminated iodine toxicity.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/60145/PNG',
};

export const VERAPAMIL_STRUCTURE: ChemicalStructure = {
  id: 'verapamil',
  name: 'Verapamil',
  document_label: 'Verapamil (Calan) - Class IV',
  tradeName: 'Calan',
  smiles: 'COc1ccc(CCN(C)CCCC(C#N)(c2ccc(OC)c(OC)c2)C(C)C)cc1OC',
  canonical_smiles: 'COc1ccc(CCN(C)CCCC(C#N)(c2ccc(OC)c(OC)c2)C(C)C)cc1OC',
  cid: 2520,
  mw: 454.6,
  chemicalClass: 'Phenylalkylamine (Benzeneacetonitrile derivative)',
  pharmacologicalClass: 'Class IV Antiarrhythmic / Non-Dihydropyridine Calcium Channel Blocker',
  target: 'L-type Voltage-Gated Calcium Channel Cav1.2',
  target_receptor: 'Cav1.2 Intracellular Pore Vestibule (Verapamil binding site)',
  reversibility: 'Reversible (Use-dependent binding)',
  drug_state: 'Active drug',
  route: 'Oral / IV',
  keyFunctionalGroups: ['Dimethoxyphenyl rings (two)', 'Nitrile group (-C#N)', 'Tertiary methylamino group'],
  pkPdHighlights: {
    onset: '1-2 hours (oral), 1-5 min (IV)',
    duration: '6-8 hours',
    halfLife: '2.8-7.4 hours',
    elimination: 'Extensive CYP3A4 N-dealkylation to active norverapamil; CYP2C9 O-demethylation',
    bioactivation: 'Norverapamil possesses ~20% vasodilator activity of verapamil',
  },
  sarNotes:
    'Preferentially blocks L-type calcium channels in cardiac pacemaker (SA node) and conduction (AV node) tissues over peripheral vascular smooth muscle. Displays marked stereoselectivity (S-enantiomer has 10-20x greater negative inotropic/dromotropic potency).',
  moa_summary:
    'Inhibits transmembrane calcium influx during Phase 2 plateau and slow Phase 0 upstroke of SA/AV nodal action potentials, slowing conduction and terminating re-entrant nodal SVT.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/2520/PNG',
};

export const DILTIAZEM_STRUCTURE: ChemicalStructure = {
  id: 'diltiazem',
  name: 'Diltiazem',
  document_label: 'Diltiazem (Cardizem) - Class IV',
  tradeName: 'Cardizem',
  smiles: 'CC(=O)Oc1c(sc2ccccc12)N(CCN(C)C)C(=O)c3ccc(OC)cc3',
  canonical_smiles: 'CC(=O)Oc1c(sc2ccccc12)N(CCN(C)C)C(=O)c3ccc(OC)cc3',
  cid: 39186,
  mw: 414.52,
  chemicalClass: 'Benzothiazepine (1,5-Benzothiazepin-4-one derivative)',
  pharmacologicalClass: 'Class IV Antiarrhythmic / Non-Dihydropyridine Calcium Channel Blocker',
  target: 'L-type Voltage-Gated Calcium Channel Cav1.2',
  target_receptor: 'Cav1.2 Benzothiazepine Site',
  reversibility: 'Reversible',
  drug_state: 'Active drug',
  route: 'Oral / IV',
  keyFunctionalGroups: ['Benzothiazepine bicycle', 'C3-Phenolic ester (O-acetate)', 'Basic dimethylaminoethyl side chain'],
  pkPdHighlights: {
    onset: '30-60 min (oral), 2-3 min (IV)',
    duration: '4-8 hours',
    halfLife: '3-4.5 hours',
    elimination: 'Hepatic CYP3A4 deacetylation to active desacetyldiltiazem; CYP2D6 O-demethylation',
    bioactivation: 'Desacetyldiltiazem retains 25-50% coronary vasodilator potency',
  },
  sarNotes:
    'Exhibits intermediate selectivity balancing vascular coronary dilation with direct AV nodal depression. Requires cis-(2R,3R) stereochemistry for channel binding.',
  moa_summary:
    'Depresses calcium-dependent slow response in AV node, increasing refractory period and controlling ventricular rate in atrial flutter and fibrillation.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/39186/PNG',
};

export const QUINIDINE_STRUCTURE: ChemicalStructure = {
  id: 'quinidine',
  name: 'Quinidine',
  document_label: 'Quinidine - Class IA',
  tradeName: 'Quinaglute',
  smiles: 'COc1ccc2c(c1)c(c(cn2)[C@H]([C@@H]3C[C@@H]4CCN3C[C@@H]4C=C)O)C',
  canonical_smiles: 'COc1ccc2c(c1)c(c(cn2)[C@H]([C@@H]3C[C@@H]4CCN3C[C@@H]4C=C)O)C',
  cid: 441074,
  mw: 324.42,
  chemicalClass: 'Quinoline Alkaloid (Cinchona alkaloid diastereomer)',
  pharmacologicalClass: 'Class IA Antiarrhythmic (Na+ & K+ channel blocker)',
  target: 'Nav1.5 & Kv11.1 (IKr) & Alpha-Adrenergic & Muscarinic Receptors',
  target_receptor: 'Nav1.5 Pore / Kv11.1 Pore',
  reversibility: 'Reversible',
  drug_state: 'Active drug',
  route: 'Oral / IV / IM',
  keyFunctionalGroups: ['6-Methoxyquinoline ring', 'Quinuclidine bicyclic bridgehead nitrogen', 'Secondary alcohol', 'Terminal vinyl group'],
  pkPdHighlights: {
    onset: '1-3 hours',
    duration: '6-8 hours',
    halfLife: '6-8 hours',
    elimination: 'Hepatic CYP3A4 3-hydroxylation and CYP2D6 O-demethylation',
    bioactivation: '3-Hydroxyquinidine possesses significant antiarrhythmic activity',
  },
  sarNotes:
    'Dextrorotatory diastereomer of quinine (4 chiral centers: 3R, 4S, 8R, 9S). The quinuclidine tertiary nitrogen (pKa ~8.8) is far more basic than the quinoline nitrogen (pKa ~4.2). Strong CYP2D6 inhibitor. Cinchonism syndrome (tinnitus, headache, psychosis, blurred vision).',
  moa_summary:
    'Moderately depresses Phase 0 upstroke velocity (Class IA) and prolongs Phase 3 repolarization and APD via IKr blockade. Carries substantial risk of drug-induced TdP.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/441074/PNG',
};

// --- Assemble All 8 Pages for Review 11 ---

export function getAntiarrhythmicReviewPages(): ReviewPage[] {
  return [
    // === PAGE 1 (Q1 - Q6) ===
    {
      pageNumber: 1,
      pageTitle: 'Review for Antiarrhythmic Drugs — Page 1 (Class I Subclasses)',
      sections: [
        {
          id: 'aa_p1_s1',
          title: 'Classification & Action Potential Phase of Drugs I–V',
          structures: [
            PROPAFENONE_STRUCTURE,
            LIDOCAINE_STRUCTURE,
            PROCAINAMIDE_STRUCTURE,
            DISOPYRAMIDE_STRUCTURE,
            FLECAINIDE_STRUCTURE,
          ],
          questions: [
            {
              id: 1,
              type: 'matching',
              prompt:
                'Consider the chemical structures of antiarrhythmic agents I – V. What is the chemical class of each agent?',
              options: [
                'Phenoxy propyloxyamine (Propafenone - Drug I)',
                'Xylene amide (Lidocaine - Drug II)',
                'p-Amino benzamide (Procainamide - Drug III)',
                'Amino butamide (Disopyramide - Drug IV)',
                'Fluorinated benzamide piperidine (Flecainide - Drug V)',
                'Quinoline alkaloid (Quinidine)',
              ],
              correctAnswer: 'I: Phenoxy propyloxyamine; II: Xylene amide; III: p-Amino benzamide; IV: Amino butamide; V: Fluorinated benzamide piperidine',
              explanation:
                'Drug I (Propafenone) is a phenoxy propyloxyamine. Drug II (Lidocaine) is a xylene amide. Drug III (Procainamide) is a p-amino benzamide. Drug IV (Disopyramide) is an amino butamide. Drug V (Flecainide) is a fluorinated benzamide piperidine with bis-trifluoroethoxy substituents.',
            },
            {
              id: 2,
              type: 'multiple-choice',
              prompt:
                'What type of cardiac ion channel is primarily blocked by the provided drugs (Drugs I – V)?',
              options: [
                'Sodium channel',
                'Potassium channel',
                'Calcium channel',
                'Chloride channel',
                'Sodium and chloride channels',
              ],
              correctAnswer: 'Sodium channel',
              explanation:
                'Drugs I through V are Class I antiarrhythmic agents whose primary pharmacodynamic mechanism is voltage-gated cardiac sodium channel (Nav1.5) blockade.',
            },
            {
              id: 3,
              type: 'multiple-choice',
              prompt:
                'What phase of the cardiac action potential is primarily blocked by the provided drugs?',
              options: ['Phase 0', 'Phase 1', 'Phase 2', 'Phase 3', 'Phase 4'],
              correctAnswer: 'Phase 0',
              explanation:
                'Class I sodium channel blockers suppress inward fast INa current, thereby depressing the slope and Vmax of Phase 0 rapid depolarization.',
            },
            {
              id: 4,
              type: 'multiple-choice',
              prompt:
                'Which of the listed antiarrhythmic drugs weakly impact(s) the depolarization phase of cardiac muscles (Class IB)?',
              options: ['Drug I', 'Drug II (Lidocaine)', 'Drug III', 'Drug IV', 'Drug V'],
              correctAnswer: 'Drug II (Lidocaine)',
              explanation:
                'Drug II (Lidocaine) is a Class IB antiarrhythmic. Class IB agents dissociate rapidly from sodium channels (tau < 1s) and have minimal/weak impact on Phase 0 depolarization velocity in normal myocardium.',
            },
            {
              id: 5,
              type: 'multiple-choice',
              prompt:
                'Which of the listed antiarrhythmic drugs strongly affect(s) the depolarization phase of cardiac muscles (Class IC) and is(are) potentially associated with beta-blocking side effects (bradycardia and bronchospasm)?',
              options: ['Drug I (Propafenone)', 'Drug II', 'Drug III', 'Drug IV', 'Drug V'],
              correctAnswer: 'Drug I (Propafenone)',
              explanation:
                'Drug I (Propafenone) is a Class IC drug with slow channel dissociation kinetics (marked Phase 0 depression). Its aryloxypropanolamine backbone gives it structural homology with propranolol, imparting significant beta-blocking properties.',
            },
            {
              id: 6,
              type: 'multiple-choice',
              prompt:
                'Which of the listed antiarrhythmic drugs moderately affect(s) sodium channels of cardiac muscles (Class IA) and is(are) potentially associated with strong anticholinergic side effects (dry mouth, blurred vision, urinary retention, and constipation)?',
              options: ['Drug I', 'Drug II', 'Drug III', 'Drug IV (Disopyramide)', 'Drug V'],
              correctAnswer: 'Drug IV (Disopyramide)',
              explanation:
                'Drug IV (Disopyramide) is a Class IA antiarrhythmic agent with marked antimuscarinic (atropine-like) activity causing urinary retention, dry mouth, blurred vision, and worsening of glaucoma.',
            },
          ],
        },
      ],
    },

    // === PAGE 2 (Q7 - Q14) ===
    {
      pageNumber: 2,
      pageTitle: 'Review for Antiarrhythmic Drugs — Page 2 (Kinetics, Toxicity & Workbench)',
      sections: [
        {
          id: 'aa_p2_s1',
          title: 'APD Dynamics, Pharmacogenomics & Class I Workbench',
          structures: [
            LIDOCAINE_STRUCTURE,
            PROCAINAMIDE_STRUCTURE,
            DISOPYRAMIDE_STRUCTURE,
            FLECAINIDE_STRUCTURE,
          ],
          questions: [
            {
              id: 7,
              type: 'multiple-choice',
              prompt:
                'Which of the above drugs prolong(s) the duration of cardiac action potential? Shorten(s) the duration of cardiac action potential?',
              options: [
                'Prolong: Drugs III & IV (Class IA); Shorten: Drug II (Class IB); Unchanged: Drugs I & V (Class IC)',
                'Prolong: Drug II; Shorten: Drugs III & IV',
                'Prolong: Drugs I & V; Shorten: Drugs III & IV',
                'Prolong: All drugs; Shorten: None',
              ],
              correctAnswer: 'Prolong: Drugs III & IV (Class IA); Shorten: Drug II (Class IB); Unchanged: Drugs I & V (Class IC)',
              explanation:
                'Class IA (Procainamide, Disopyramide) prolongs APD via secondary IKr block. Class IB (Lidocaine) shortens APD by blocking late inward INa. Class IC (Propafenone, Flecainide) has negligible impact on APD.',
            },
            {
              id: 8,
              type: 'multiple-choice',
              prompt:
                'Which of the listed antiarrhythmic drugs is associated with the issue of acetylation polymorphism?',
              options: ['Drug I', 'Drug II', 'Drug III (Procainamide)', 'Drug IV', 'Drug V'],
              correctAnswer: 'Drug III (Procainamide)',
              explanation:
                'Drug III (Procainamide) is metabolized by hepatic N-acetyltransferase 2 (NAT2) into N-acetylprocainamide (NAPA). Slow acetylators develop drug-induced systemic lupus erythematosus (SLE) much faster than rapid acetylators.',
            },
            {
              id: 9,
              type: 'multiple-choice',
              prompt:
                'Which of the above drugs is(are) more likely to be used for acute indications? (Hint: short acting drugs)',
              options: ['Drug I', 'Drug II (Lidocaine)', 'Drug III', 'Drug IV', 'Drug V'],
              correctAnswer: 'Drug II (Lidocaine)',
              explanation:
                'Drug II (Lidocaine) has a rapid onset, short half-life (1.5-2 hours), and high first-pass clearance, making it exclusively an IV agent for acute termination of ventricular arrhythmias.',
            },
            {
              id: 10,
              type: 'multiple-choice',
              prompt:
                'Which of the above drugs is(are) associated with variable elimination half-life based on CYP2D6 genetic polymorphism?',
              options: [
                'Drugs I (Propafenone) and V (Flecainide)',
                'Drug II (Lidocaine)',
                'Drug III (Procainamide)',
                'Drug IV (Disopyramide)',
              ],
              correctAnswer: 'Drugs I (Propafenone) and V (Flecainide)',
              explanation:
                'Propafenone and Flecainide undergo substantial CYP2D6-mediated metabolism. Poor metabolizers exhibit 3-5x longer half-lives and elevated plasma concentrations compared to extensive metabolizers.',
            },
            {
              id: 11,
              type: 'multiple-choice',
              prompt:
                'Which of the above drugs may have potassium channel blocking activity?',
              options: [
                'Drugs III and IV (Class IA)',
                'Drug II only',
                'Drug V only',
                'None of the above',
              ],
              correctAnswer: 'Drugs III and IV (Class IA)',
              explanation:
                'Class IA agents (Procainamide, Disopyramide, Quinidine) block voltage-gated delayed rectifier K+ channels (IKr), causing QT prolongation.',
            },
            {
              id: 12,
              type: 'multiple-choice',
              prompt:
                'Drug III and IV may qualitatively precipitate TdP ventricular tachycardia (QT prolongation). Which of the following can be used to reverse this potential effect?',
              options: ['CaCO3', 'MgSO4', 'CaSO4', 'NaHCO3', 'Na2SO4'],
              correctAnswer: 'MgSO4',
              explanation:
                'Intravenous Magnesium Sulfate (MgSO4) is the drug of choice for treating drug-induced Torsades de Pointes (TdP) by stabilizing cardiac cell membranes and suppressing early afterdepolarizations (EADs).',
            },
            {
              id: 13,
              type: 'multiple-choice',
              prompt:
                'Considering the PK & PD aspects of Drugs I–V, state which statement is FALSE:',
              options: [
                'All listed drugs are acidic molecules and prepared as salts to enhance their solubility for oral/parenteral administration (FALSE: they are all basic amines)',
                'Drugs I, II, and III can be metabolized by amide hydrolysis or dealkylation (TRUE)',
                'Drug III is potentially associated with high risk of drug-induced lupus erythematosus (TRUE)',
                'The anti-arrhythmic activity of these drugs is potentiated under alkaline conditions (TRUE)',
              ],
              correctAnswer: 'All listed drugs are acidic molecules and prepared as salts to enhance their solubility for oral/parenteral administration (FALSE: they are all basic amines)',
              explanation:
                'All listed Class I drugs are basic amine molecules (tertiary or secondary amines) that are prepared as hydrochloride, phosphate, or sulfate salts to enhance aqueous solubility.',
            },
            {
              id: 14,
              type: 'structural-workbench',
              prompt:
                'Complete the Class I Sodium Channel Kinetics & Structure-Activity Relationship (SAR) Workbench: analyze Lidocaine steric protection, dissociation constants across subclasses, and active metabolites.',
              options: ['Complete all 4 interactive workbench steps on canvas'],
              correctAnswer: 'Lidocaine ortho-xylyl shield + Class IA/IB/IC kinetic recovery profiles + MEGX active metabolite',
              explanation:
                'Lidocaine possesses twin ortho-methyl groups on the phenyl ring that shield the amide carbonyl from rapid amidase cleavage. Class IA exhibits intermediate recovery (1-10s), Class IB fast recovery (<1s), and Class IC slow recovery (>10s). MEGX is the active N-deethylated metabolite.',
              structuralWorkbench: CLASS_I_KINETICS_WORKBENCH_DATA,
            },
          ],
        },
      ],
    },

    // === PAGE 3 (Q15 - Q22) ===
    {
      pageNumber: 3,
      pageTitle: 'Review for Antiarrhythmic Drugs — Page 3 (Mexiletine vs Lidocaine & Adrenergic Agents)',
      sections: [
        {
          id: 'aa_p3_s1',
          title: 'Mexiletine SAR & Beta-Adrenergic Blocker Profiling',
          structures: [
            MEXILETINE_STRUCTURE,
            LIDOCAINE_STRUCTURE,
            PROPRANOLOL_STRUCTURE,
            METOPROLOL_STRUCTURE,
            ESMOLOL_STRUCTURE,
            SOTALOL_STRUCTURE,
          ],
          questions: [
            {
              id: 15,
              type: 'multiple-choice',
              prompt:
                'Determine whether each of the following statements is true or false considering Mexiletine (Drug I) and Lidocaine (Drug II):',
              options: [
                'Drug I is an ether derivative with a primary (1o) amine and high oral bioavailability, whereas Drug II is an amide with a tertiary (3o) amine and poor oral bioavailability due to high first-pass clearance (TRUE)',
                'Drug I is parenterally administered while Drug II is strictly oral (FALSE)',
                'Both drugs belong to Class IA and prolong action potential duration (FALSE)',
                'Drug I is metabolized to procainamide (FALSE)',
              ],
              correctAnswer: 'Drug I is an ether derivative with a primary (1o) amine and high oral bioavailability, whereas Drug II is an amide with a tertiary (3o) amine and poor oral bioavailability due to high first-pass clearance (TRUE)',
              explanation:
                'Mexiletine is an orally bioavailable 1-aryloxy-2-aminopropane (primary amine ether), whereas Lidocaine is an amide derivative with high hepatic first-pass clearance requiring IV administration.',
            },
            {
              id: 16,
              type: 'multiple-choice',
              prompt:
                'What is the chemical as well as the mechanistic class of adrenergic Drugs I-IV (Propranolol, Metoprolol, Esmolol, Sotalol)?',
              options: [
                'Aryloxypropanolamines / Beta-adrenergic receptor antagonists (Class II antiarrhythmics); Sotalol is also Class III',
                'Dihydropyridines / Calcium channel blockers',
                'Quinoline alkaloids / Class IA agents',
                'Cardiac glycosides / Inotropic agents',
              ],
              correctAnswer: 'Aryloxypropanolamines / Beta-adrenergic receptor antagonists (Class II antiarrhythmics); Sotalol is also Class III',
              explanation:
                'Propranolol, Metoprolol, and Esmolol are aryloxypropanolamine beta-adrenergic blockers (Class II). Sotalol is an arylethanolamine with dual Class II and Class III (IKr blocking) activities.',
            },
            {
              id: 17,
              type: 'multiple-choice',
              prompt:
                'Which of the listed antiarrhythmic drugs is(are) more likely to be used in emergency arrhythmic events? (Hint: ultra-short duration)',
              options: ['Drug I (Propranolol)', 'Drug II (Metoprolol)', 'Drug III (Esmolol)', 'Drug IV (Sotalol)'],
              correctAnswer: 'Drug III (Esmolol)',
              explanation:
                'Esmolol (Drug III) has an ultrashort elimination half-life of 9 minutes due to rapid hydrolysis by erythrocyte esterases, making it ideal for intravenous titration in emergency arrhythmias.',
            },
            {
              id: 18,
              type: 'multiple-choice',
              prompt:
                'Which of the listed drugs should be avoided in arrhythmic patients with asthma?',
              options: [
                'Drugs I (Propranolol) and IV (Sotalol) — non-selective beta blockers',
                'Drug II (Metoprolol) only',
                'Drug III (Esmolol) only',
                'None of the above',
              ],
              correctAnswer: 'Drugs I (Propranolol) and IV (Sotalol) — non-selective beta blockers',
              explanation:
                'Non-selective beta blockers antagonize bronchial beta-2 receptors, inducing life-threatening bronchoconstriction in patients with asthma or severe COPD.',
            },
            {
              id: 19,
              type: 'multiple-choice',
              prompt:
                'Which of the above drugs has(have) quinidine-like antiarrhythmic effect (membrane stabilizing activity)?',
              options: ['Drug I (Propranolol)', 'Drug II', 'Drug III', 'Drug IV'],
              correctAnswer: 'Drug I (Propranolol)',
              explanation:
                'Propranolol exhibits membrane stabilizing activity (MSA), weakly blocking cardiac sodium channels at elevated concentrations in a quinidine-like manner.',
            },
            {
              id: 20,
              type: 'multiple-choice',
              prompt:
                'Which of the above drugs has(have) potassium-channel blocking activity (can be classified as Class III)?',
              options: ['Drug I', 'Drug II', 'Drug III', 'Drug IV (Sotalol)'],
              correctAnswer: 'Drug IV (Sotalol)',
              explanation:
                'Sotalol contains a methanesulfonanilide group that potently inhibits rapid delayed rectifier K+ channels (IKr), giving it prominent Class III electrophysiologic properties.',
            },
            {
              id: 21,
              type: 'multiple-choice',
              prompt:
                'Which of the above drugs may precipitate "Torsades de pointes" ventricular tachycardia (QT prolongation)?',
              options: ['Drug I', 'Drug II', 'Drug III', 'Drug IV (Sotalol)'],
              correctAnswer: 'Drug IV (Sotalol)',
              explanation:
                'By prolonging repolarization via IKr blockade, Sotalol widens the QT interval and carries a significant risk of triggering Torsades de Pointes.',
            },
            {
              id: 22,
              type: 'multiple-choice',
              prompt:
                'Drug III (Esmolol) has an ultrashort duration of action. Which functional group contributes to this behavior?',
              options: [
                'The bulky N-isopropyl substituent',
                'The extended oxypropanol linker',
                'The secondary amine moiety',
                'The benzene ring having two substituents',
                'The ester functionality at the para-position of the benzene ring',
              ],
              correctAnswer: 'The ester functionality at the para-position of the benzene ring',
              explanation:
                'The methyl ester group on the para-substituent is rapidly cleaved by cytosolic red blood cell esterases into a free carboxylic acid metabolite with negligible beta-blocking activity.',
            },
          ],
        },
      ],
    },

    // === PAGE 4 (Q23 - Q24) ===
    {
      pageNumber: 4,
      pageTitle: 'Review for Antiarrhythmic Drugs — Page 4 (Cardioselectivity & Amiodarone SAR Workbench)',
      sections: [
        {
          id: 'aa_p4_s1',
          title: 'Metoprolol Cardioselectivity & Amiodarone vs Dronedarone SAR',
          structures: [
            METOPROLOL_STRUCTURE,
            AMIODARONE_STRUCTURE,
            DRONEDARONE_STRUCTURE,
          ],
          questions: [
            {
              id: 23,
              type: 'multiple-choice',
              prompt:
                'Why is Drug II (Metoprolol) preferred to treat arrhythmic patients with a history of chronic obstructive pulmonary disease (COPD)?',
              options: [
                'Because it has a methoxy-containing substituent on the benzene ring',
                'Because it has a single benzene ring and not naphthalene ring as in Drug I',
                'Because it is substituted with a relatively bulky group at the para-position of the benzene ring, and therefore, it is cardioselective (beta-1)',
                'Because its secondary basic amine is substituted with an isopropyl moiety',
              ],
              correctAnswer: 'Because it is substituted with a relatively bulky group at the para-position of the benzene ring, and therefore, it is cardioselective (beta-1)',
              explanation:
                'Para-substitution on the phenoxy ring fits into the unique binding pocket of the beta-1 receptor, conferring cardioselectivity and sparing pulmonary beta-2 receptors at standard therapeutic doses.',
            },
            {
              id: 24,
              type: 'structural-workbench',
              prompt:
                'Complete the Amiodarone versus Dronedarone Medicinal Chemistry Workbench: encircle the thyroid toxicity iodines and lipophilic benzofuran core, map comparative pharmacokinetics, and identify Dronedarone.',
              options: ['Complete all 4 interactive workbench steps on canvas'],
              correctAnswer: 'Amiodarone twin iodines + 2-butylbenzofuran core + PK/safety drop zones + Dronedarone analogue',
              explanation:
                'Amiodarone contains twin iodine atoms that provoke thyroid dysfunction and a lipophilic 2-butylbenzofuran core causing extensive adipose tissue accumulation (t1/2 ~58 days). Dronedarone replaces iodines with a methylsulfonamide to shorten half-life to 24h and prevent thyrotoxicity.',
              structuralWorkbench: AMIODARONE_SAR_WORKBENCH_DATA,
            },
          ],
        },
      ],
    },

    // === PAGE 5 (Q25 - Q26) ===
    {
      pageNumber: 5,
      pageTitle: 'Review for Antiarrhythmic Drugs — Page 5 (Class IV CCBs & Quinidine)',
      sections: [
        {
          id: 'aa_p5_s1',
          title: 'Verapamil, Diltiazem & Quinidine Stereochemistry',
          structures: [
            VERAPAMIL_STRUCTURE,
            DILTIAZEM_STRUCTURE,
            QUINIDINE_STRUCTURE,
          ],
          questions: [
            {
              id: 25,
              type: 'multiple-choice',
              prompt:
                'Considering the medicinal chemistry aspects of Verapamil (Drug I) and Diltiazem (Drug II), which statement is FALSE?',
              options: [
                'Drug I is chemically classified as phenylalkylamine whereas Drug II is benzothiazepine (TRUE)',
                'Both are Ca channel blockers with preferential action on vascular smooth muscles over cardiac nodes (FALSE: they preferentially depress cardiac SA/AV nodes)',
                'Both can be metabolized by oxidative N-dealkylation and O-dealkylation (TRUE)',
                'Drug II action is stereochemistry-dependent (cis-2R,3R required) (TRUE)',
                'They are classified as Class IV antiarrhythmic drugs (TRUE)',
              ],
              correctAnswer: 'Both are Ca channel blockers with preferential action on vascular smooth muscles over cardiac nodes (FALSE: they preferentially depress cardiac SA/AV nodes)',
              explanation:
                'Non-dihydropyridines (Verapamil and Diltiazem) exert potent negative dromotropic, chronotropic, and inotropic effects on cardiac SA/AV nodal tissues, unlike dihydropyridines (e.g. amlodipine) which selectively dilate peripheral vasculature.',
            },
            {
              id: 26,
              type: 'multiple-choice',
              prompt:
                'State whether each statement is true or false regarding Quinidine:',
              options: [
                'Quinidine is a dextrorotatory quinoline alkaloid with 4 chiral centers, undergoes 3-hydroxylation to an active metabolite, causes cinchonism, and has its more basic nitrogen on the quinuclidine ring (pKa ~8.8 vs ~4.2) (TRUE)',
                'The quinoline nitrogen is more basic than the quinuclidine nitrogen (FALSE)',
                'Quinidine has only one chiral center and zero active metabolites (FALSE)',
                'Quinidine shortens action potential duration (FALSE)',
              ],
              correctAnswer: 'Quinidine is a dextrorotatory quinoline alkaloid with 4 chiral centers, undergoes 3-hydroxylation to an active metabolite, causes cinchonism, and has its more basic nitrogen on the quinuclidine ring (pKa ~8.8 vs ~4.2) (TRUE)',
              explanation:
                'Quinidine has 4 chiral carbons (3R, 4S, 8R, 9S). Its quinuclidine tertiary amine is aliphatic and strongly basic (pKa 8.8), whereas the aromatic quinoline nitrogen is weakly basic (pKa 4.2). Hepatic CYP3A4 produces active 3-hydroxyquinidine.',
            },
          ],
        },
      ],
    },

    // === PAGE 6 (Q27 - Q29) ===
    {
      pageNumber: 6,
      pageTitle: 'Review for Antiarrhythmic Drugs — Page 6 (Comparative Amides & Class IA vs IC)',
      sections: [
        {
          id: 'aa_p6_s1',
          title: 'Procainamide vs Lidocaine & Disopyramide vs Propafenone',
          structures: [
            LIDOCAINE_STRUCTURE,
            PROCAINAMIDE_STRUCTURE,
            DISOPYRAMIDE_STRUCTURE,
            PROPAFENONE_STRUCTURE,
          ],
          questions: [
            {
              id: 27,
              type: 'multiple-choice',
              prompt:
                'Considering the chemical structures of Lidocaine (Drug I) and Procainamide (Drug II), which statement is correct?',
              options: [
                'Drug I is a xylene amide whereas Drug II is a p-amino benzamide; Drug II is associated with drug-induced lupus erythematosus in slow acetylators',
                'Drug I is an ester whereas Drug II is a carbamate',
                'Drug I prolongs APD whereas Drug II shortens APD',
                'Neither drug has a tertiary amine center',
              ],
              correctAnswer: 'Drug I is a xylene amide whereas Drug II is a p-amino benzamide; Drug II is associated with drug-induced lupus erythematosus in slow acetylators',
              explanation:
                'Drug I is Lidocaine (xylene amide, Class IB). Drug II is Procainamide (p-amino benzamide, Class IA). Procainamide undergoes NAT2 acetylation and provokes drug-induced lupus in slow acetylators.',
            },
            {
              id: 28,
              type: 'multiple-choice',
              prompt:
                'Considering the chemical structure of Procainamide (Drug II above), state which statement is FALSE:',
              options: [
                'Replacement of the amide bond with an ester bond increases the duration of action (FALSE: ester creates procaine, which is rapidly cleaved by plasma pseudocholinesterase)',
                'It can be metabolized by N-acetylation resulting in active NAPA (TRUE)',
                'It demonstrates genetic polymorphism due to NAT2 enzyme variations (TRUE)',
                'It moderately depresses Phase 0 and prolongs APD/QT interval (TRUE)',
              ],
              correctAnswer: 'Replacement of the amide bond with an ester bond increases the duration of action (FALSE: ester creates procaine, which is rapidly cleaved by plasma pseudocholinesterase)',
              explanation:
                'Replacing the amide with an ester yields Procaine, which is destroyed within minutes by ubiquitous pseudocholinesterases. The amide linkage was engineered specifically to increase metabolic stability.',
            },
            {
              id: 29,
              type: 'multiple-choice',
              prompt:
                'Considering Disopyramide (Drug I) and Propafenone (Drug II), which statement is correct?',
              options: [
                'Drug I (amino butamide, Class IA) dissociates faster from sodium channels than Drug II (Class IC), and Drug I has anticholinergic side effects while Drug II has beta-blocking side effects',
                'Drug I has beta-blocking properties while Drug II causes urinary retention',
                'Both drugs are Class IB agents with rapid dissociation kinetics',
                'Drug II has no effect on Phase 0 depolarization',
              ],
              correctAnswer: 'Drug I (amino butamide, Class IA) dissociates faster from sodium channels than Drug II (Class IC), and Drug I has anticholinergic side effects while Drug II has beta-blocking side effects',
              explanation:
                'Disopyramide (Class IA) has intermediate dissociation kinetics (1-10s) and potent antimuscarinic side effects. Propafenone (Class IC) has very slow dissociation (>10s) and propranolol-like beta-blocking side effects.',
            },
          ],
        },
      ],
    },

    // === PAGE 7 (Q30 - Q31) ===
    {
      pageNumber: 7,
      pageTitle: 'Review for Antiarrhythmic Drugs — Page 7 (Amiodarone Profile & Cardiovascular Prodrugs)',
      sections: [
        {
          id: 'aa_p7_s1',
          title: 'Amiodarone Multiorgan Toxicity & Prodrug Activation',
          structures: [
            AMIODARONE_STRUCTURE,
          ],
          questions: [
            {
              id: 30,
              type: 'multiple-choice',
              prompt:
                'State whether each of the following statements is true or false about Amiodarone:',
              options: [
                'Amiodarone is a 2-butylbenzofuran derivative, acts as a multi-channel blocker (predominantly Class III), causes thyroid toxicity via iodine release, has huge lipophilicity (t1/2 ~58 days), and forms active desethylamiodarone (TRUE)',
                'Amiodarone has a very short half-life of 2 hours (FALSE)',
                'Amiodarone has no effect on potassium channels (FALSE)',
                'Amiodarone does not cross into any lipid tissues (FALSE)',
              ],
              correctAnswer: 'Amiodarone is a 2-butylbenzofuran derivative, acts as a multi-channel blocker (predominantly Class III), causes thyroid toxicity via iodine release, has huge lipophilicity (t1/2 ~58 days), and forms active desethylamiodarone (TRUE)',
              explanation:
                'Amiodarone has multi-channel blocking action, enormous volume of distribution (>60 L/kg), extreme lipophilicity, t1/2 of 40-58 days, and forms active desethylamiodarone (DEA) via CYP3A4.',
            },
            {
              id: 31,
              type: 'multiple-choice',
              prompt:
                'Fosinopril, Sacubitril, and Olmesartan medoxomil are prodrugs. What are their active forms and primary therapeutic indications?',
              options: [
                'Fosinopril -> Fosinoprilat (ACE inhibitor for HF); Sacubitril -> Sacubitrilat/LBQ657 (Neprilysin inhibitor for HFrEF); Olmesartan medoxomil -> Olmesartan (ARB for HF/hypertension)',
                'All three are sodium channel blockers for ventricular fibrillation',
                'All three are active parent drugs without metabolic cleavage',
                'All three are antiarrhythmics targeting cardiac potassium channels',
              ],
              correctAnswer: 'Fosinopril -> Fosinoprilat (ACE inhibitor for HF); Sacubitril -> Sacubitrilat/LBQ657 (Neprilysin inhibitor for HFrEF); Olmesartan medoxomil -> Olmesartan (ARB for HF/hypertension)',
              explanation:
                'Fosinopril is cleaved by intestinal/hepatic esterases into Fosinoprilat (phosphinate ACE inhibitor). Sacubitril is cleaved by CES1 into Sacubitrilat (LBQ657, neprilysin inhibitor). Olmesartan medoxomil is cleaved by intestinal esterases into Olmesartan (AT1 receptor blocker).',
            },
          ],
        },
      ],
    },

    // === PAGE 8 (Q32 - Q33) ===
    {
      pageNumber: 8,
      pageTitle: 'Review for Antiarrhythmic Drugs — Page 8 (Prodrug Rationale & Comprehensive Review)',
      sections: [
        {
          id: 'aa_p8_s1',
          title: 'Prodrug Engineering Rationale & Multi-Agent Pharmacophore Synthesis',
          structures: [
            DISOPYRAMIDE_STRUCTURE,
            VERAPAMIL_STRUCTURE,
            DILTIAZEM_STRUCTURE,
            DRONEDARONE_STRUCTURE,
            FLECAINIDE_STRUCTURE,
            QUINIDINE_STRUCTURE,
          ],
          questions: [
            {
              id: 32,
              type: 'multiple-choice',
              prompt:
                'Why are cardiovascular molecules like Fosinopril, Enalapril, Sacubitril, and Olmesartan medoxomil prepared as prodrugs?',
              options: [
                'To increase oral absorption and systemic bioavailability (by masking polar carboxylate/phosphinate anions)',
                'To prolong their duration of action',
                'To increase chemical stability',
                'a and c',
                'All of the above',
              ],
              correctAnswer: 'All of the above',
              explanation:
                'Esterification masks hydrophilic ionized carboxylic or phosphinic acid groups, markedly increasing lipophilicity (logP), gastrointestinal membrane permeation, oral bioavailability, and shelf stability.',
            },
            {
              id: 33,
              type: 'multiple-choice',
              prompt:
                'Consider Disopyramide, Verapamil, Diltiazem, Dronedarone, Flecainide, and Quinidine. Which row correctly matches each drug to its chemical class, mechanistic class, and active metabolite?',
              options: [
                'Disopyramide (Amino butamide / Class IA / Mono-N-dealkylated), Verapamil (Phenylalkylamine / Class IV / Norverapamil), Diltiazem (Benzothiazepine / Class IV / Desacetyldiltiazem), Dronedarone (Benzofuran sulfonamide / Class III / N-debutyl), Flecainide (Fluorinated benzamide / Class IC / m-O-dealkyl), Quinidine (Quinoline alkaloid / Class IA / 3-Hydroxyquinidine)',
                'All drugs are Class IA amino amides with zero active metabolites',
                'Verapamil is a dihydropyridine and Diltiazem is a beta-blocker',
                'Disopyramide is an ACE inhibitor and Flecainide is a cardiac glycoside',
              ],
              correctAnswer: 'Disopyramide (Amino butamide / Class IA / Mono-N-dealkylated), Verapamil (Phenylalkylamine / Class IV / Norverapamil), Diltiazem (Benzothiazepine / Class IV / Desacetyldiltiazem), Dronedarone (Benzofuran sulfonamide / Class III / N-debutyl), Flecainide (Fluorinated benzamide / Class IC / m-O-dealkyl), Quinidine (Quinoline alkaloid / Class IA / 3-Hydroxyquinidine)',
              explanation:
                'This comprehensive synthesis encapsulates the medicinal chemistry classification, electrophysiological pharmacology, and hepatic metabolic fates of all primary antiarrhythmic agents across Classes I through IV.',
            },
          ],
        },
      ],
    },
  ];
}

export function getDefaultAntiarrhythmicModule(): ReviewModule {
  return {
    id: 'antiarrhythmics_mcp2',
    title: 'Review for Antiarrhythmic Drugs',
    subtitle: 'Vaughan Williams Classes I–IV, Adrenergic Modulators & Target Channel Pharmacophores',
    course: 'Medicinal Chemistry (MCP II)',
    semester: 'Fall 2026',
    code: 'RAAH',
    isBuiltIn: true,
    createdAt: '2026-11-05',
    pages: getAntiarrhythmicReviewPages(),
  };
}
