import {
  ChemicalStructure,
  StructuralWorkbenchData,
} from '../types/reviewModule';

export const LIDOCAINE_STEM_STRUCTURE: ChemicalStructure = {
  id: 'lidocaine_stem',
  name: 'Lidocaine',
  document_label: 'Lidocaine (Xylocaine) - Class IB',
  tradeName: 'Xylocaine',
  smiles: 'CCN(CC)CC(=O)Nc1c(C)cccc1C',
  canonical_smiles: 'CCN(CC)CC(=O)Nc1c(C)cccc1C',
  cid: 3676,
  mw: 234.34,
  chemicalClass: 'Xylene Amide (Aminoacyl Xylide)',
  pharmacologicalClass: 'Class IB Antiarrhythmic / Voltage-gated Sodium Channel Blocker',
  target: 'Voltage-gated Sodium Channel Nav1.5',
  target_receptor: 'Nav1.5 Fast Sodium Channel (Inactivated State Preferring)',
  reversibility: 'Reversible (Rapid Dissociation tau < 1s)',
  drug_state: 'Active drug',
  route: 'IV only (High first-pass hepatic extraction)',
  keyFunctionalGroups: ['2,6-Dimethylphenyl (Xylyl) Ring', 'Amide Bond', 'Tertiary Diethylamino Group'],
  pkPdHighlights: {
    onset: 'Immediate (IV bolus)',
    duration: '10-20 minutes',
    halfLife: '1.5-2 hours',
    elimination: 'Hepatic CYP1A2/3A4 N-deethylation to MEGX; amide hydrolysis',
    bioactivation: 'MEGX retains ~80% antiarrhythmic activity; GX is less active',
  },
  sarNotes:
    'The 2,6-dimethyl substituents provide steric hindrance protecting the amide bond from rapid plasma esterase/amidase cleavage compared to procaine. Rapid dissociation kinetics (tau_rec < 1 sec) prevent channel accumulation at normal heart rates while selectively blocking depolarized/ischemic myocardium.',
  moa_summary:
    'Selectively binds to open and inactivated cardiac Nav1.5 sodium channels with fast recovery kinetics. Shortens Phase 3 repolarization and action potential duration (APD) without altering Phase 0 velocity at normal resting potentials.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/3676/PNG',
  pubchemAudit: {
    cid: 3676,
    status: 'verified',
    verifiedAt: '2026-11-05T00:00:00Z',
    source: 'nih_pug_rest',
    canonicalSmiles: 'CCN(CC)CC(=O)Nc1c(C)cccc1C',
    pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/3676',
    molecularFormula: 'C14H22N2O',
    molecularWeight: 234.34,
  },
};

export const CLASS_I_KINETICS_WORKBENCH_DATA: StructuralWorkbenchData = {
  stemStructure: LIDOCAINE_STEM_STRUCTURE,
  instructions:
    'Analyze the structure-kinetic relationships of Class I sodium channel blockers: (1) identify the sterically shielded amide bond and tertiary amine, (2) encircle the 2,6-dimethylphenyl ring protecting against systemic hydrolysis, (3) assign the dissociation kinetics and APD effects across Classes IA, IB, and IC, and (4) identify the active N-deethylated metabolite (MEGX).',
  step2a_amides: {
    title: 'Step 1: Identify Hydrolysis Barrier & Ionization Center',
    prompt:
      'Select the amide linkage protected by ortho-methyl substituents and the tertiary basic nitrogen required for Nav1.5 pore binding.',
    targets: [
      {
        id: 'amide_bond',
        label: 'Sterically Shielded Amide Bond (-C(=O)-NH-)',
        smarts: 'C(=O)Nc1c(C)cccc1C',
        isCorrect: true,
        rationale:
          'The amide bond resists rapid systemic amidase hydrolysis due to flanking 2,6-methyl groups, giving Lidocaine sufficient stability for cardiac IV therapy compared to ester-based procaine.',
        x: 422,
        y: 134,
        radius: 36,
      },
      {
        id: 'tertiary_amine',
        label: 'Basic Tertiary Diethylamino Group (-N(Et)2)',
        smarts: 'CCN(CC)',
        isCorrect: true,
        rationale:
          'Ionized at physiologic pH (~pKa 7.9). The protonated ammonium cation enters the inner pore vestibule of Nav1.5 to block sodium flux, while the uncharged form permeates membranes.',
        x: 651,
        y: 140,
        radius: 40,
      },
      {
        id: 'para_hydrogen',
        label: 'Para-Aromatic Position',
        smarts: 'c1ccc(cc1)',
        isCorrect: false,
        rationale:
          'The para position is accessible for minor aromatic hydroxylation but does not form the primary electrostatic or hydrogen-bonding interaction in the channel pore.',
        x: 140,
        y: 144,
        radius: 28,
      },
    ],
  },
  step2b_moieties: {
    title: 'Step 2: Encircle Ortho-Steric Protecting Ring',
    prompt:
      'Encircle the 2,6-xylyl ring responsible for steric hindrance against enzymatic amide cleavage.',
    targets: [
      {
        id: 'xylyl_ring',
        label: '2,6-Dimethylphenyl (Ortho-Steric Shield)',
        smarts: 'c1c(C)cccc1C',
        isCorrect: true,
        rationale:
          'Twin ortho-methyl groups force the amide carbonyl out of coplanarity with the phenyl ring, shielding the carbonyl carbon from nucleophilic attack by hepatic amidases.',
        x: 211,
        y: 144,
        radius: 48,
      },
      {
        id: 'ethyl_chains',
        label: 'N-Ethyl Hydrophobic Chains',
        smarts: 'CCN(CC)',
        isCorrect: false,
        rationale:
          'N-ethyl substituents modulate lipophilicity and substrate susceptibility to CYP-mediated N-dealkylation, not steric protection of the carbonyl.',
        x: 740,
        y: 140,
        radius: 36,
      },
    ],
  },
  step2c_nature: {
    title: 'Step 3: Classify Dissociation Kinetics & Action Potential Impact',
    prompt:
      'Match the Vaughan Williams Class I subclasses (IA, IB, IC) with their sodium channel dissociation recovery constants (tau_rec) and impact on Action Potential Duration (APD).',
    badgeBank: [
      'Class IA (tau_rec 1-10s, Prolongs APD/QT)',
      'Class IB (tau_rec < 1s, Shortens APD)',
      'Class IC (tau_rec > 10s, Unchanged APD)',
      'Class II (Beta-Blocker)',
      'Class III (K+ Channel Blocker)',
      'Class IV (Ca2+ Channel Blocker)',
    ],
    dropZones: [
      {
        id: 'lidocaine_subclass',
        targetMoietyId: 'class_ib',
        label: 'Lidocaine / Mexiletine Kinetic Profile',
        correctBadge: 'Class IB (tau_rec < 1s, Shortens APD)',
        rationale:
          'Class IB agents dissociate extremely rapidly (tau < 1s). They do not depress Phase 0 at normal heart rates but bind avidly during ischemia or tachycardia, shortening APD.',
        x: 220,
        y: 250,
      },
      {
        id: 'procainamide_subclass',
        targetMoietyId: 'class_ia',
        label: 'Procainamide / Disopyramide Kinetic Profile',
        correctBadge: 'Class IA (tau_rec 1-10s, Prolongs APD/QT)',
        rationale:
          'Class IA agents exhibit intermediate dissociation kinetics (tau = 1-10s) and also block delayed rectifier IKr potassium channels, moderately depressing Phase 0 and prolonging APD/QT.',
        x: 484,
        y: 250,
      },
      {
        id: 'flecainide_subclass',
        targetMoietyId: 'class_ic',
        label: 'Flecainide / Propafenone Kinetic Profile',
        correctBadge: 'Class IC (tau_rec > 10s, Unchanged APD)',
        rationale:
          'Class IC agents possess the slowest dissociation kinetics (tau > 10s), marked Phase 0 slowing, widening of the QRS complex, and little to no effect on repolarization/APD.',
        x: 720,
        y: 250,
      },
    ],
  },
  step2d_activeForm: {
    title: 'Step 4: Identify Active Metabolite of Lidocaine',
    prompt:
      'Select the chemical structure representing the primary active antiarrhythmic metabolite formed by hepatic CYP1A2/3A4 oxidative N-deethylation.',
    candidates: [
      {
        id: 'megx_active',
        name: 'Monoethylglycinexylidide (MEGX)',
        smiles: 'CCNCC(=O)Nc1c(C)cccc1C',
        cid: 3012,
        isCorrect: true,
        classification: 'active',
        rationale:
          'MEGX is the primary hepatic metabolite produced by oxidative N-deethylation. It retains ~80% of lidocaine antiarrhythmic potency and contributes to CNS toxicity if accumulated.',
      },
      {
        id: 'xylidine_inactive',
        name: '2,6-Dimethylaniline (2,6-Xylidine)',
        smiles: 'Cc1cccc(C)c1N',
        cid: 6940,
        isCorrect: false,
        classification: 'degradant',
        rationale:
          '2,6-Xylidine is formed via amide hydrolysis. It lacks the basic dialkylaminoalkyl side chain and possesses zero antiarrhythmic activity.',
      },
      {
        id: 'napa_class3',
        name: 'N-Acetylprocainamide (NAPA)',
        smiles: 'CCN(CC)CCNC(=O)c1ccc(NC(=O)C)cc1',
        cid: 4181,
        isCorrect: false,
        classification: 'active',
        rationale:
          'NAPA is the active Class III metabolite of Procainamide formed by hepatic N-acetyltransferase 2 (NAT2), not Lidocaine.',
      },
      {
        id: 'procainamide_parent',
        name: 'Procainamide Parent',
        smiles: 'CCN(CC)CCNC(=O)c1ccc(N)cc1',
        cid: 4913,
        isCorrect: false,
        classification: 'active',
        rationale:
          'Procainamide is a distinct Class IA agent with a para-amino benzamide scaffold.',
      },
    ],
  },
};

export const AMIODARONE_STEM_STRUCTURE: ChemicalStructure = {
  id: 'amiodarone_stem',
  name: 'Amiodarone',
  document_label: 'Amiodarone (Cordarone) - Class III',
  tradeName: 'Cordarone',
  smiles: 'CCCCC1=C(C2=C(O1)C=CC(=C2)C(=O)C3=C(C(=CC(=C3)I)OCCN(CC)CC)I)CC',
  canonical_smiles: 'CCCCC1=C(C2=C(O1)C=CC(=C2)C(=O)C3=C(C(=CC(=C3)I)OCCN(CC)CC)I)CC',
  cid: 2157,
  mw: 645.3,
  chemicalClass: '2-Butylbenzofuran Diiodo-Phenolic Derivative',
  pharmacologicalClass: 'Class III Antiarrhythmic (Multi-channel blocker: IKr, INa, ICa, Non-competitive alpha/beta adrenergic)',
  target: 'hERG / Kv11.1 (IKr) potassium channel & Nav1.5 & Cav1.2',
  target_receptor: 'Kv11.1 Pore Domain (IKr) / Thyroid Hormone Receptor Antagonist',
  reversibility: 'Reversible (Extremely slow tissue elimination, Vd > 60 L/kg)',
  drug_state: 'Active drug',
  route: 'Oral / IV',
  keyFunctionalGroups: ['2-Butylbenzofuran Core', 'Diiodo-Substituted Phenolic Ketone', 'Diethylaminoethoxy Basic Chain'],
  pkPdHighlights: {
    onset: '2-3 days to 2-3 weeks (oral loading)',
    duration: 'Weeks to months after discontinuation',
    halfLife: '40-58 days (terminal elimination)',
    elimination: 'Hepatic metabolism via CYP3A4/2C8 to desethylamiodarone; biliary excretion',
    bioactivation: 'Desethylamiodarone (DEA) is equiactive or more potent than parent',
  },
  sarNotes:
    'The diiodo-phenoxy moiety shares close structural homology with thyroxine (T4) and triiodothyronine (T3), causing competitive thyroid hormone antagonism, thyroiditis, and corneal microdeposits. Extreme lipophilicity (logP ~7.5) drives massive sequestration in adipose, hepatic, and pulmonary parenchyma.',
  moa_summary:
    'Predominantly prolongs Phase 3 repolarization and action potential duration (APD) by blocking rapid delayed rectifier K+ current (IKr). Concomitantly blocks inactivated Na+ channels and L-type Ca2+ channels, providing broad-spectrum suppression of atrial and ventricular tachyarrhythmias.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/2157/PNG',
  pubchemAudit: {
    cid: 2157,
    status: 'verified',
    verifiedAt: '2026-11-05T00:00:00Z',
    source: 'nih_pug_rest',
    canonicalSmiles: 'CCCCC1=C(C2=C(O1)C=CC(=C2)C(=O)C3=C(C(=CC(=C3)I)OCCN(CC)CC)I)CC',
    pubChemUrl: 'https://pubchem.ncbi.nlm.nih.gov/compound/2157',
    molecularFormula: 'C25H29I2NO3',
    molecularWeight: 645.3,
  },
};

export const AMIODARONE_SAR_WORKBENCH_DATA: StructuralWorkbenchData = {
  stemStructure: AMIODARONE_STEM_STRUCTURE,
  instructions:
    'Analyze the medicinal chemistry and toxicity profile of Amiodarone versus Dronedarone: (1) encircle the twin iodine atoms causing thyroid endocrine dysfunction, (2) encircle the lipophilic 2-butylbenzofuran core driving multi-week tissue retention, (3) assign comparative pharmacokinetic and safety metrics, and (4) identify Dronedarone (non-iodinated methylsulfonamide analogue).',
  step2a_amides: {
    title: 'Step 1: Encircle Iodine Atoms (Thyroid Dysfunction Pharmacophore)',
    prompt:
      'Click the halo targets surrounding the ortho-iodine atoms on the central aromatic ring responsible for thyroid hormone mimicry and iodine-induced toxicity.',
    targets: [
      {
        id: 'diiodo_substituents',
        label: 'Diiodo Substituents on Phenoxy Ring (3,5-diiodo)',
        smarts: 'c1(I)cc(I)cc1',
        isCorrect: true,
        rationale:
          'Each molecule of Amiodarone contains ~37% iodine by weight. Metabolic deiodination releases huge daily iodine loads, while the diiodo-phenolic template competitively antagonizes thyroid hormone receptors, causing hyper- or hypothyroidism.',
        x: 62,
        y: 52,
        radius: 18,
      },
      {
        id: 'diethylamino_chain',
        label: 'Basic Diethylaminoethoxy Nitrogen',
        smarts: 'OCCN(CC)CC',
        isCorrect: false,
        rationale:
          'The basic side chain protonates at physiologic pH, aiding target binding, but is not responsible for thyroid dysfunction.',
        x: 82,
        y: 35,
        radius: 12,
      },
      {
        id: 'ketone_bridge',
        label: 'Carbonyl Bridging Linker',
        smarts: 'C(=O)',
        isCorrect: false,
        rationale:
          'The diaryl ketone acts as a conformational spacer between the benzofuran and diiodo rings.',
        x: 48,
        y: 42,
        radius: 10,
      },
    ],
  },
  step2b_moieties: {
    title: 'Step 2: Encircle Lipophilic Core (Tissue Storage Anchor)',
    prompt:
      'Encircle the 2-butylbenzofuran bicyclic scaffold responsible for massive adipose partitioning and extended 58-day half-life.',
    targets: [
      {
        id: 'butyl_benzofuran',
        label: '2-Butylbenzofuran Core',
        smarts: 'CCCCc1oc2ccccc2c1',
        isCorrect: true,
        rationale:
          'The hydrophobic 2-butylbenzofuran system gives Amiodarone an extraordinary logP (~7.5) and huge volume of distribution (>60 L/kg), necessitating weeks of oral loading doses and causing multi-month washout.',
        x: 28,
        y: 45,
        radius: 20,
      },
      {
        id: 'ethyl_nitrogen',
        label: 'Terminal Tertiary Amine',
        smarts: 'N(CC)CC',
        isCorrect: false,
        rationale:
          'The terminal amine is hydrophilic when protonated, counterbalancing lipophilicity to allow formulated solubility.',
        x: 90,
        y: 30,
        radius: 10,
      },
    ],
  },
  step2c_nature: {
    title: 'Step 3: Comparative PK/PD Profile (Amiodarone vs Dronedarone)',
    prompt:
      'Assign the clinical pharmacological properties to Amiodarone versus its rationally designed non-iodinated derivative Dronedarone (Multaq).',
    badgeBank: [
      'Amiodarone (t1/2 ~58 days, logP 7.5, Thyroid Toxicity)',
      'Dronedarone (t1/2 ~24h, logP 4.0, Methanesulfonamide, CI in Acute Decompensated HF)',
      'Quinidine (Cinchonism, CYP2D6 inhibitor)',
      'Sotalol (Pure Class III / Non-selective Beta Blocker)',
      'Flecainide (CAST Trial Proarrhythmic Risk)',
    ],
    dropZones: [
      {
        id: 'amiodarone_pk',
        targetMoietyId: 'amiodarone_profile',
        label: 'Amiodarone Pharmacokinetic & Safety Hallmark',
        correctBadge: 'Amiodarone (t1/2 ~58 days, logP 7.5, Thyroid Toxicity)',
        rationale:
          'Amiodarone has an elimination half-life of 40-58 days, massive Vd, accumulates in lysosomes, and carries boxed warnings for pulmonary toxicity, hepatotoxicity, and thyroid dysfunction.',
        x: 30,
        y: 80,
      },
      {
        id: 'dronedarone_pk',
        targetMoietyId: 'dronedarone_profile',
        label: 'Dronedarone Design & Safety Restriction',
        correctBadge: 'Dronedarone (t1/2 ~24h, logP 4.0, Methanesulfonamide, CI in Acute Decompensated HF)',
        rationale:
          'Dronedarone was designed by removing both iodine atoms and adding a polar methylsulfonamide moiety. This reduced t1/2 to 24 hours and eliminated thyroid toxicity, but it doubled mortality in severe heart failure (ANDROMEDA trial) and is contraindicated in decompensated HF.',
        x: 75,
        y: 80,
      },
    ],
  },
  step2d_activeForm: {
    title: 'Step 4: Identify Dronedarone Structural Analogue',
    prompt:
      'Select the rationally designed non-iodinated derivative possessing a methanesulfonamido group at position 5 of the benzofuran ring.',
    candidates: [
      {
        id: 'dronedarone_candidate',
        name: 'Dronedarone (Multaq)',
        smiles: 'CCCCc1oc2cc(NS(=O)(=O)C)ccc2c1C(=O)c3ccc(OCCN(CCCC)CCCC)cc3',
        cid: 60145,
        isCorrect: true,
        classification: 'active',
        rationale:
          'Dronedarone lacks iodine (eliminating thyrotoxicity) and introduces a methylsulfonamide group on the benzofuran ring to decrease lipophilicity and shorten half-life to ~24 hours.',
      },
      {
        id: 'desethylamiodarone_candidate',
        name: 'Desethylamiodarone (DEA)',
        smiles: 'CCCCC1=C(C2=C(O1)C=CC(=C2)C(=O)C3=C(C(=CC(=C3)I)OCCNC)I)CC',
        cid: 3034285,
        isCorrect: false,
        classification: 'active',
        rationale:
          'Desethylamiodarone is the active hepatic N-deethylated metabolite of Amiodarone; it retains the twin iodine atoms and long half-life.',
      },
      {
        id: 'amiodarone_parent_candidate',
        name: 'Amiodarone Parent',
        smiles: 'CCCCC1=C(C2=C(O1)C=CC(=C2)C(=O)C3=C(C(=CC(=C3)I)OCCN(CC)CC)I)CC',
        cid: 2157,
        isCorrect: false,
        classification: 'active',
        rationale:
          'This is Amiodarone itself with intact iodine atoms.',
      },
      {
        id: 'sotalol_candidate',
        name: 'Sotalol (Betapace)',
        smiles: 'CC(C)NCC(O)c1ccc(NS(=O)(=O)C)cc1',
        cid: 5253,
        isCorrect: false,
        classification: 'active',
        rationale:
          'Sotalol is an arylethanolamine beta-blocker with a methanesulfonamide moiety, lacking the benzofuran core.',
      },
    ],
  },
};

export const ANTIARRHYTHMIC_WORKBENCHES: Record<string, StructuralWorkbenchData> = {
  class_i_kinetics: CLASS_I_KINETICS_WORKBENCH_DATA,
  amiodarone_sar: AMIODARONE_SAR_WORKBENCH_DATA,
};

export const ANTIARRHYTHMIC_WORKBENCH_DATA = {
  lidocaine: CLASS_I_KINETICS_WORKBENCH_DATA,
  amiodarone: AMIODARONE_SAR_WORKBENCH_DATA,
  class_i_kinetics: CLASS_I_KINETICS_WORKBENCH_DATA,
  amiodarone_sar: AMIODARONE_SAR_WORKBENCH_DATA,
};
