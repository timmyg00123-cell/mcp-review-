import type { ChemicalStructure } from '../types/reviewModule';
import type { CumulativeQuestion } from '../types/cumulativeStudy';

import {
  APIXABAN_STRUCTURE,
  RIVAROXABAN_STRUCTURE,
  DABIGATRAN_STRUCTURE,
  WARFARIN_STRUCTURE,
  FONDAPARINUX_STRUCTURE,
} from './anticoagulantsQuizData';

import {
  AMIODARONE_STRUCTURE,
  FLECAINIDE_STRUCTURE,
  QUINIDINE_STRUCTURE,
  PROCAINAMIDE_STRUCTURE,
  LIDOCAINE_STRUCTURE,
  SOTALOL_STRUCTURE,
  METOPROLOL_STRUCTURE,
} from './antiarrhythmicModuleData';

import { heartFailureStructures } from './heartFailureModuleData';
import { DIGOXIN_STEM_STRUCTURE } from './heartFailureWorkbenchData';
import { antiplateletStructures } from './antiplateletQuizData';

// --- Supplementary Cardiovascular Structures ---

export const FUROSEMIDE_STRUCTURE: ChemicalStructure = {
  id: 'furosemide',
  name: 'Furosemide',
  tradeName: 'Lasix',
  document_label: 'Furosemide',
  smiles: 'C1=C(C=C(C(=C1Cl)S(=O)(=O)N)C(=O)O)NCC2=CC=CO2',
  canonical_smiles: 'C1=C(C=C(C(=C1Cl)S(=O)(=O)N)C(=O)O)NCC2=CC=CO2',
  cid: 3440,
  mw: 330.74,
  chemicalClass: 'Anthranilic acid sulfonamide loop diuretic (furan-2-ylmethylamino)',
  pharmacologicalClass: 'Loop Diuretic (Na+/K+/2Cl- symport inhibitor)',
  target: 'Na+-K+-2Cl- Cotransporter 2 (NKCC2)',
  target_receptor: 'NKCC2 Luminal Transporter (Thick Ascending Limb of Henle)',
  reversibility: 'Reversible',
  drug_state: 'Active drug',
  route: 'Oral / IV',
  keyFunctionalGroups: [
    'Sulfonamide group (-SO2NH2)',
    'Carboxylic acid (-COOH)',
    'Furan-2-ylmethylamino tail',
    'Aromatic chloro substituent',
  ],
  pkPdHighlights: {
    onset: '5 minutes (IV), 30-60 minutes (oral)',
    duration: '2 hours (IV), 6-8 hours (oral)',
    halfLife: '1.5-2 hours',
    elimination:
      'Renal (65% unchanged via active OAT1/OAT3 tubular secretion), Hepatic glucuronidation (35%)',
  },
  sarNotes:
    '5-Sulfamoyl-2-aminobenzoic acid scaffold. The unsubstituted sulfonamide at position 5 is essential for diuretic efficacy. Furfurylamino group at position 2 confers optimal potency and lipophilicity.',
  moa_summary:
    'Inhibits the apical Na+/K+/2Cl- symporter (NKCC2) in the thick ascending limb of Henle, eliminating the corticomedullary osmotic gradient and causing potent diuresis and venodilation without positive inotropic action.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/3440/PNG',
};

export const NITROPRUSSIDE_STRUCTURE: ChemicalStructure = {
  id: 'nitroprusside',
  name: 'Sodium Nitroprusside',
  tradeName: 'Nitropress',
  document_label: 'Sodium Nitroprusside',
  smiles: '[Na+].[Na+].[C-]#N.[C-]#N.[C-]#N.[C-]#N.[C-]#N.[N+]=O.[Fe-2]',
  canonical_smiles: '[Na+].[Na+].[C-]#N.[C-]#N.[C-]#N.[C-]#N.[C-]#N.[N+]=O.[Fe-2]',
  cid: 11963579,
  mw: 261.92,
  chemicalClass: 'Inorganic Nitrosyl-Iron-Cyanide Complex',
  pharmacologicalClass: 'Direct Nitric Oxide Donor / Balanced Arterio-Venodilator',
  target: 'Soluble Guanylyl Cyclase (sGC)',
  target_receptor: 'sGC Heme Moiety (Direct NO+ transfer)',
  reversibility: 'Spontaneous non-enzymatic dissociation',
  drug_state: 'Active drug',
  route: 'IV infusion only (continuous titration)',
  keyFunctionalGroups: [
    'Nitrosyl ligand (NO+ donor)',
    'Octahedral iron center',
    'Cyanide coordination cage (5x CN-)',
  ],
  pkPdHighlights: {
    onset: '< 1 minute',
    duration: '1-10 minutes',
    halfLife: '2 minutes (parent complex); thiocyanate metabolite: 3-4 days',
    elimination:
      'Vascular single-electron reduction by oxyhemoglobin releasing NO; cyanide converted to thiocyanate by hepatic rhodanese',
  },
  sarNotes:
    'Octahedral Fe(II/III) complex with 5 cyanide ligands and 1 linear nitrosyl (NO+) ligand. Spontaneously donates nitric oxide non-enzymatically in blood without requiring tissue sulfhydryls or ALDH2, causing rapid balanced arterial and venous dilation.',
  moa_summary:
    'Releases nitric oxide directly upon reaction with oxyhemoglobin, stimulating soluble guanylyl cyclase, increasing cGMP, and dephosphorylating myosin light chains to produce potent balanced arterial and venous vasodilation.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/11963579/PNG',
};

export const NITROGLYCERIN_STRUCTURE: ChemicalStructure = {
  id: 'nitroglycerin',
  name: 'Nitroglycerin',
  tradeName: 'Nitrostat / Nitro-Bid',
  document_label: 'Nitroglycerin',
  smiles: 'C(C(CO[N+](=O)[O-])O[N+](=O)[O-])O[N+](=O)[O-]',
  canonical_smiles: 'C(C(CO[N+](=O)[O-])O[N+](=O)[O-])O[N+](=O)[O-]',
  cid: 4945,
  mw: 227.09,
  chemicalClass: 'Organic Nitrate Ester (Trinitrate)',
  pharmacologicalClass: 'Venodilator / Antianginal Organic Nitrate',
  target: 'Mitochondrial Aldehyde Dehydrogenase (ALDH2) / Soluble Guanylyl Cyclase (sGC)',
  target_receptor: 'ALDH2 Catalytic Cysteine / sGC',
  reversibility: 'Enzymatic metabolic cleavage',
  drug_state: 'Prodrug (Nitric oxide precursor)',
  route: 'Sublingual / IV / Transdermal',
  keyFunctionalGroups: [
    'Three nitrate ester groups (-ONO2)',
    'Glycerol hydrocarbon backbone',
  ],
  pkPdHighlights: {
    onset: '1-3 minutes (sublingual), immediate (IV)',
    duration: '25-30 minutes (sublingual)',
    halfLife: '1-4 minutes (extensive hepatic dinitrate and mononitrate clearance)',
    elimination:
      'Hepatic and vascular bioactivation via ALDH2 and glutathione S-transferases',
  },
  sarNotes:
    'Trinitrate ester of glycerol. Small lipophilic 3-carbon backbone allows rapid mucosal penetration. Bioactivation by mitochondrial ALDH2 reduces nitrate esters to 1,2-glyceryl dinitrate and active nitric oxide (NO). Nitrate tolerance occurs when ALDH2 active-site cysteines are oxidized.',
  moa_summary:
    'Bioactivated by mitochondrial ALDH2 into nitric oxide, stimulating soluble guanylyl cyclase (sGC) to elevate cGMP and induce vascular smooth muscle relaxation, preferentially dilating large capacitance veins and reducing myocardial preload.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/4945/PNG',
};

export const HYDRALAZINE_STRUCTURE: ChemicalStructure = {
  id: 'hydralazine',
  name: 'Hydralazine',
  tradeName: 'Apresoline',
  document_label: 'Hydralazine',
  smiles: 'C1=CC=C2C(=C1)C(=NN=C2)NN',
  canonical_smiles: 'C1=CC=C2C(=C1)C(=NN=C2)NN',
  cid: 3637,
  mw: 160.18,
  chemicalClass: 'Phthalazine Hydrazine Peripheral Vasodilator',
  pharmacologicalClass: 'Direct Arteriolar Smooth Muscle Vasodilator',
  target: 'Arteriolar Smooth Muscle Calcium Influx & Potassium Channels',
  target_receptor: 'Vascular Smooth Muscle Sarcoplasmic Reticulum & K+ Channels',
  reversibility: 'Reversible',
  drug_state: 'Active drug',
  route: 'Oral / IV',
  keyFunctionalGroups: [
    'Phthalazine diazanaphthalene ring',
    'Hydrazine moiety (-NHNH2)',
  ],
  pkPdHighlights: {
    onset: '10-20 minutes (IV), 20-30 minutes (oral)',
    duration: '3-8 hours',
    halfLife: '3-7 hours',
    elimination:
      'Polymorphic hepatic N-acetyltransferase 2 (NAT2) acetylation (slow vs fast acetylators)',
  },
  sarNotes:
    'Bicyclic phthalazine nucleus carrying an unsubstituted hydrazine group at position 1. The hydrazine moiety is critical for vasodilatory action and is the primary target for polymorphic NAT2 N-acetylation; slow acetylators face drug accumulation and drug-induced lupus erythematosus.',
  moa_summary:
    'Selectively relaxes arteriolar smooth muscle with little to no effect on venous capacitance vessels, reducing peripheral vascular resistance and afterload while eliciting sympathetic reflex tachycardia and renin release.',
  pngUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/3637/PNG',
};

// --- Normalized Multi-Module Structure Cohorts ---

const DABIGATRAN_STANDARDIZED: ChemicalStructure = {
  ...DABIGATRAN_STRUCTURE,
  tradeName: 'Pradaxa',
  document_label: 'Dabigatran',
};

const DIGOXIN_STRUCTURE: ChemicalStructure = {
  ...DIGOXIN_STEM_STRUCTURE,
  id: 'digoxin',
  document_label: 'Digoxin',
};

const DOBUTAMINE_STRUCTURE: ChemicalStructure = {
  ...heartFailureStructures.dobutamine,
  id: 'dobutamine',
  document_label: 'Dobutamine',
};

const MILRINONE_STRUCTURE: ChemicalStructure = {
  ...heartFailureStructures.milrinone,
  id: 'milrinone',
  document_label: 'Milrinone',
};

const CLOPIDOGREL_STRUCTURE: ChemicalStructure = {
  ...antiplateletStructures.clopidogrel,
  id: 'clopidogrel',
  document_label: 'Clopidogrel',
};

const PRASUGREL_STRUCTURE: ChemicalStructure = {
  ...antiplateletStructures.prasugrel,
  id: 'prasugrel',
  document_label: 'Prasugrel',
};

const TICAGRELOR_STRUCTURE: ChemicalStructure = {
  ...antiplateletStructures.ticagrelor,
  id: 'ticagrelor',
  document_label: 'Ticagrelor',
};

const CANGRELOR_STRUCTURE: ChemicalStructure = {
  ...antiplateletStructures.cangrelor,
  id: 'cangrelor',
  document_label: 'Cangrelor',
};

// --- Curated Cumulative Cross-Curriculum Questions ---

export const CUMULATIVE_QUESTIONS: CumulativeQuestion[] = [
  // 1. Type A: Factor Xa vs IIa Direct Inhibitors vs Thienopyridines vs Coumarins
  {
    id: 'cumul_q1_direct_fxa',
    type: 'case-to-structures',
    moduleIds: ['anticoagulants_mcp2', 'antiplatelets_mcp2'],
    stem:
      'A 68-year-old patient with non-valvular atrial fibrillation and normal renal function presents for stroke prevention therapy. The clinical team requires an oral direct anticoagulant that reversibly binds the catalytic active site of Factor Xa (both free and prothrombinase-bound) without directly inhibiting thrombin or requiring antithrombin III as an obligatory cofactor. Which of the following candidate structures meet this clinical pharmacological profile?',
    candidateStructures: [
      APIXABAN_STRUCTURE,
      RIVAROXABAN_STRUCTURE,
      DABIGATRAN_STANDARDIZED,
      CLOPIDOGREL_STRUCTURE,
      WARFARIN_STRUCTURE,
    ],
    correctStructureIds: ['apixaban', 'rivaroxaban'],
    rationales: {
      apixaban:
        'Apixaban is an oral, direct Factor Xa inhibitor (DOAC) featuring a pyrazolopyridine scaffold. It fits into the S1 (p-methoxyphenyl) and S4 (lactam) subpockets of Factor Xa with nanomolar affinity and does not require antithrombin III or inhibit thrombin directly.',
      rivaroxaban:
        'Rivaroxaban is an oral direct Factor Xa inhibitor featuring an oxazolidinone core with a 5-chlorothiophene group that binds into the S1 pocket and a morpholinone group occupying the S4 subpocket. Like apixaban, it inhibits free and prothrombinase-complexed Factor Xa without inhibiting thrombin.',
      dabigatran:
        'Dabigatran is a direct thrombin (Factor IIa) inhibitor, NOT a Factor Xa inhibitor. Its basic amidine group binds specifically into the deep S1 pocket of thrombin containing Asp189.',
      clopidogrel:
        'Clopidogrel is an antiplatelet thienopyridine prodrug that targets the purinergic P2Y12 receptor on platelets after hepatic CYP activation; it has no direct inhibitory action on coagulation Factor Xa.',
      warfarin:
        'Warfarin is an indirect oral anticoagulant that inhibits vitamin K epoxide reductase complex 1 (VKORC1), blocking post-translational gamma-carboxylation of Factors II, VII, IX, and X rather than directly inhibiting the Factor Xa active site.',
    },
    highYieldPearl:
      'Direct oral Factor Xa inhibitors (xabans) utilize neutral L-shaped scaffolds that span the S1 (hydrophobic chlorothiophene or methoxyphenyl) and S4 (aromatic lactam/morpholinone) subpockets, distinguishing them from direct thrombin inhibitors (gatrans) whose basic amidines seek thrombin’s ionic Asp189 S1 groove.',
  },

  // 2. Type A: Positive Inotropes for Acutely Decompensated Heart Failure
  {
    id: 'cumul_q2_inotropes_decompensated_hf',
    type: 'case-to-structures',
    moduleIds: ['heart_failure_mcp2'],
    stem:
      'A 59-year-old patient is admitted to the cardiac intensive care unit with acutely decompensated heart failure with reduced ejection fraction (ejection fraction 18%) presenting with cardiogenic shock, pulmonary edema, and cold extremities. The critical care team requires emergency inotropic support to augment myocardial contractility. Which of the following candidate structures exert positive inotropic effects on cardiac myocytes?',
    candidateStructures: [
      DIGOXIN_STRUCTURE,
      MILRINONE_STRUCTURE,
      DOBUTAMINE_STRUCTURE,
      METOPROLOL_STRUCTURE,
      FUROSEMIDE_STRUCTURE,
    ],
    correctStructureIds: ['digoxin', 'milrinone', 'dobutamine'],
    rationales: {
      digoxin:
        'Digoxin is a cardiac glycoside that reversibly inhibits the myocardial sarcolemmal Na+/K+-ATPase pump. This increases intracellular Na+, which suppresses Ca2+ extrusion by the Na+/Ca2+ exchanger (NCX), loading sarcoplasmic reticulum Ca2+ and exerting a positive inotropic effect.',
      milrinone:
        'Milrinone is a bipyridine phosphodiesterase-3 (PDE3) inhibitor that prevents cAMP degradation in cardiac myocytes, elevating intracellular cAMP and protein kinase A (PKA) activation to open L-type Ca2+ channels and exert positive inotropic and inodilator effects.',
      dobutamine:
        'Dobutamine is a synthetic catecholethylamine that acts as a potent beta-1 adrenergic receptor agonist, stimulating adenylyl cyclase via Gs to increase intracellular cAMP and myocardial contractility.',
      metoprolol:
        'Metoprolol is a selective beta-1 adrenergic antagonist (beta-blocker) that exerts negative inotropic and chronotropic effects, and is contraindicated in acute uncompensated cardiogenic shock.',
      furosemide:
        'Furosemide is a sulfonamide loop diuretic that inhibits the luminal Na+/K+/2Cl- cotransporter (NKCC2) in the thick ascending limb of Henle; it reduces preload and pulmonary congestion but has no direct positive inotropic effect on myocardial contractility.',
    },
    highYieldPearl:
      'Positive inotropes augment myocardial contractility via distinct molecular pathways: beta-1 agonists (dobutamine) stimulate cAMP production via Gs-adenylyl cyclase, PDE3 inhibitors (milrinone) prevent cAMP degradation, and cardiac glycosides (digoxin) inhibit Na+/K+-ATPase to indirectly elevate intracellular calcium.',
  },

  // 3. Type B: Amiodarone Structural Recognition -> Multi-Effect Statements
  {
    id: 'cumul_q3_amiodarone_effects',
    type: 'structure-to-effects',
    moduleIds: ['antiarrhythmics_mcp2'],
    stem:
      'Examine the blinded cardiovascular agent displayed below. Select all electrophysiological mechanisms, pharmacokinetic characteristics, and clinical toxicities associated with this chemical structure:',
    singleStructure: AMIODARONE_STRUCTURE,
    effectStatements: [
      {
        id: 'stmt_amio_1',
        statement:
          'Prolongs the cardiac action potential duration (APD) and effective refractory period (ERP) across atrial and ventricular tissues primarily via delayed rectifier potassium channel (IKr) blockade.',
        isCorrect: true,
        rationale:
          'This structure represents Amiodarone, a Vaughan-Williams Class III antiarrhythmic whose hallmark electrophysiological effect is lengthening APD and ERP by blocking repolarizing potassium channels (rapid delayed rectifier IKr).',
      },
      {
        id: 'stmt_amio_2',
        statement:
          'Contains two sterically hindered aromatic iodine substituents on a benzofuran core capable of inhibiting thyroid deiodinases and causing clinical hypo- or hyperthyroidism.',
        isCorrect: true,
        rationale:
          'Amiodarone contains ~37% elemental iodine by molecular weight on its diiodophenyl moiety. Release of free iodine and structural resemblance to thyroxine (T4) can trigger the Wolff-Chaikoff effect (hypothyroidism) or Jod-Basedow phenomenon (hyperthyroidism).',
      },
      {
        id: 'stmt_amio_3',
        statement:
          'Exhibits broad multi-channel blocking properties that encompass Class I (inactivated sodium channel), Class II (non-competitive beta-adrenergic), and Class IV (L-type calcium channel) antagonism.',
        isCorrect: true,
        rationale:
          'Although classified as Class III, Amiodarone displays multichannel electrophysiological actions: it blocks inactivated Nav1.5 channels (Class I), provides non-competitive beta-blockade (Class II), and inhibits L-type Cav1.2 channels (Class IV).',
      },
      {
        id: 'stmt_amio_4',
        statement:
          'Carries a black box warning for potentially fatal pulmonary toxicity (interstitial pneumonitis / alveolitis) and chronic hepatotoxicity.',
        isCorrect: true,
        rationale:
          'Amiodarone accumulates in lysosomes of lung macrophages and pneumocytes (phospholipidosis), causing potentially lethal pulmonary fibrosis in 2-17% of chronic patients, along with elevation of transaminases and hepatotoxicity.',
      },
      {
        id: 'stmt_amio_5',
        statement:
          'Undergoes rapid first-order clearance with an elimination half-life of 2 to 4 hours and minimal accumulation in adipose tissue.',
        isCorrect: false,
        rationale:
          'Amiodarone is extraordinarily lipophilic with a massive volume of distribution (~60 L/kg) and an extraordinarily protracted terminal elimination half-life of 40 to 60 days, accumulating extensively in adipose tissue, liver, and myocardium.',
      },
    ],
    rationales: {
      amiodarone:
        'Amiodarone is a benzofuran derivative with two aromatic iodine atoms. While formally a Class III agent prolonging repolarization via IKr blockade, it possesses Class I-IV multichannel blocking activities, massive lipophilic tissue storage (half-life 40-60 days), and multi-organ toxicities (pulmonary fibrosis, thyroid dysfunction, ocular microdeposits, hepatotoxicity).',
    },
    highYieldPearl:
      'Amiodarone is a structural analogue of thyroid hormone containing 2 iodine atoms and a benzofuran core; despite Class III designation, it has Class I-IV electrophysiological actions, a 40-60 day terminal half-life due to extreme lipophilicity, and toxicities including pulmonary fibrosis, thyroid dysfunction, and corneal microdeposits.',
  },

  // 4. Type B: Dabigatran Structural Recognition -> Multi-Effect Statements
  {
    id: 'cumul_q4_dabigatran_effects',
    type: 'structure-to-effects',
    moduleIds: ['anticoagulants_mcp2'],
    stem:
      'Consider the blinded active anticoagulant species illustrated below. Select all biochemical binding mechanisms, structural features, and pharmacokinetic properties that characterize this molecule:',
    singleStructure: DABIGATRAN_STANDARDIZED,
    effectStatements: [
      {
        id: 'stmt_dabi_1',
        statement:
          'Directly, reversibly, and competitively binds the catalytic active site of both free and fibrin-bound thrombin (Factor IIa).',
        isCorrect: true,
        rationale:
          'This structure represents Dabigatran (the active form), a direct thrombin inhibitor (DTI) that competitively and reversibly blocks the active site of both soluble circulating thrombin and thrombin entrapped within fibrin clots.',
      },
      {
        id: 'stmt_dabi_2',
        statement:
          'Possesses a strongly basic amidine functional group that forms an essential ionic salt bridge with Asp189 in the deep S1 subpocket of the target protease.',
        isCorrect: true,
        rationale:
          'The benzamidine moiety of dabigatran carries a permanent positive charge at physiological pH (pKa ~11) that forms a critical electrostatic interaction with Asp189 at the bottom of thrombin’s S1 specificity pocket.',
      },
      {
        id: 'stmt_dabi_3',
        statement:
          'Relies predominantly on renal elimination (~80% unchanged in urine), requiring strict dose adjustment or avoidance in severe renal impairment.',
        isCorrect: true,
        rationale:
          'Approximately 80% of intravenously or orally absorbed dabigatran is eliminated unchanged via the kidneys; renal dysfunction markedly prolongs drug clearance and elevates hemorrhagic risk.',
      },
      {
        id: 'stmt_dabi_4',
        statement:
          'Acts as a substrate for the P-glycoprotein (P-gp / ABCB1) efflux transporter, making systemic exposure sensitive to strong P-gp inhibitors and inducers.',
        isCorrect: true,
        rationale:
          'Dabigatran etexilate is a known P-glycoprotein substrate; co-administration with strong P-gp inhibitors (e.g., dronedarone, ketoconazole) significantly raises plasma levels.',
      },
      {
        id: 'stmt_dabi_5',
        statement:
          'Functions as an irreversible covalent inhibitor by reacting with a catalytic active-site serine to form a stable carbamate adduct.',
        isCorrect: false,
        rationale:
          'Dabigatran is a non-covalent, reversible competitive inhibitor. It does NOT covalently modify or carbamylate the catalytic Ser195.',
      },
    ],
    rationales: {
      dabigatran:
        'Dabigatran is a direct thrombin inhibitor featuring a central benzimidazole core, a basic benzamidine group that salt-bridges Asp189 in thrombin’s S1 pocket, and a carboxylic acid tail. It is 80% eliminated renally unchanged and is reversed specifically by idarucizumab.',
    },
    highYieldPearl:
      'Dabigatran is a reversible direct thrombin inhibitor whose basic benzamidine group coordinates Asp189 in thrombin’s S1 pocket; because 80% of the active drug is cleared renally unchanged, it carries the highest renal clearance dependency among the DOACs.',
  },

  // 5. Type C: Prodrugs Requiring CYP Bioactivation to Active Thiols (Comparative SAR)
  {
    id: 'cumul_q5_p2y12_prodrugs_sar',
    type: 'comparative-sar',
    moduleIds: ['antiplatelets_mcp2'],
    stem:
      'Compare the purinergic P2Y12 platelet inhibitor structures below. Which candidate structures are inactive prodrugs that strictly require hepatic cytochrome P450 (CYP) bioactivation to generate reactive, transient thiol (-SH) metabolites capable of forming covalent disulfide bonds with cysteine residues on the P2Y12 receptor?',
    candidateStructures: [
      CLOPIDOGREL_STRUCTURE,
      PRASUGREL_STRUCTURE,
      TICAGRELOR_STRUCTURE,
      CANGRELOR_STRUCTURE,
    ],
    correctStructureIds: ['clopidogrel', 'prasugrel'],
    rationales: {
      clopidogrel:
        'Clopidogrel is a 2nd-generation thienopyridine prodrug. It requires two sequential CYP oxidation steps (predominantly CYP2C19) to oxidize the thiophene ring into 2-oxoclopidogrel and then open the ring into a reactive thiol metabolite that covalently disulfides with Cys17/Cys270 on P2Y12.',
      prasugrel:
        'Prasugrel is a 3rd-generation thienopyridine prodrug containing a pre-oxidized 2-acetoxythiophene ring. Plasma and intestinal esterases rapidly hydrolyze it to a thiolactone intermediate, which requires a single hepatic CYP step (CYP3A4/2C19) to generate the active covalent thiol metabolite.',
      ticagrelor:
        'Ticagrelor is an orally active cyclopentyltriazolopyrimidine (CPTP) that directly and reversibly binds to an allosteric site on P2Y12 without requiring metabolic bioactivation to a thiol.',
      cangrelor:
        'Cangrelor is a non-thienopyridine ATP analogue administered by intravenous infusion. It is a direct-acting, reversible competitive antagonist that does not undergo hepatic bioactivation to a reactive thiol.',
    },
    highYieldPearl:
      'Thienopyridines (clopidogrel, prasugrel) are prodrugs that generate covalent thiol metabolites that irreversibly cross-link P2Y12 cysteines via disulfide bridges; in contrast, cyclopentyltriazolopyrimidines (ticagrelor) and ATP analogues (cangrelor) are direct-acting, reversible antagonists lacking a reactive sulfhydryl warhead.',
  },

  // 6. Type C: Vaughan-Williams Class IA vs Class IC Sodium Channel Kinetics & QRS/QT (Comparative SAR)
  {
    id: 'cumul_q6_class_i_antiarrhythmic_kinetics',
    type: 'comparative-sar',
    moduleIds: ['antiarrhythmics_mcp2'],
    stem:
      'Compare the voltage-gated sodium channel (Nav1.5) blocking agents shown below. Which candidate structure is characterized by exceptionally slow binding and unbinding dissociation kinetics (tau > 10 seconds), causing marked Phase 0 Vmax depression and prominent QRS widening at normal heart rates with virtually no effect on action potential duration (APD) or the QT interval (Vaughan-Williams Class IC profile)?',
    candidateStructures: [
      FLECAINIDE_STRUCTURE,
      QUINIDINE_STRUCTURE,
      PROCAINAMIDE_STRUCTURE,
      LIDOCAINE_STRUCTURE,
    ],
    correctStructureIds: ['flecainide'],
    rationales: {
      flecainide:
        'Flecainide is a prototypical Class IC agent featuring a fluorinated bis(trifluoroethoxy)benzamide core. It has very slow unbinding kinetics (tau > 10 s) from Nav1.5 channels, resulting in marked Phase 0 depression, pronounced QRS prolongation even at normal rates (use-dependence), and minimal effect on ventricular APD or QT.',
      quinidine:
        'Quinidine is a Class IA cinchona alkaloid with intermediate dissociation kinetics (tau = 1-10 s). In addition to Nav1.5 blockade, it blocks outward IKr potassium channels, substantially prolonging APD and the QT interval.',
      procainamide:
        'Procainamide is a Class IA p-aminobenzamide with intermediate Nav1.5 kinetics. Like quinidine, its active hepatic metabolite NAPA and the parent drug block potassium channels, prolonging APD and increasing Torsades de Pointes risk.',
      lidocaine:
        'Lidocaine is a Class IB aminoacyl xylide with rapid dissociation kinetics (tau < 1 s) that selectively binds inactivated sodium channels in ischemic tissue and actually slightly shortens APD.',
    },
    highYieldPearl:
      'Class I antiarrhythmic subclassification hinges on Nav1.5 binding kinetics and APD effects: Class IA (quinidine, procainamide) has intermediate kinetics and prolongs APD/QT; Class IB (lidocaine) has rapid kinetics (< 1s) and shortens APD; Class IC (flecainide, propafenone) has slow kinetics (> 10s), profoundly widening the QRS without altering APD.',
  },

  // 7. Type D: Contraindications in Severe Renal Impairment CrCl < 30 mL/min (Contraindication Risk)
  {
    id: 'cumul_q7_renal_clearance_contraindications',
    type: 'contraindication-risk',
    moduleIds: ['anticoagulants_mcp2', 'antiarrhythmics_mcp2'],
    stem:
      'An 80-year-old patient with persistent atrial fibrillation presents with advanced chronic kidney disease and a calculated creatinine clearance (CrCl) of 18 mL/min. Select all candidate structures below that are strictly contraindicated or formally recommended for avoidance in severe renal impairment (CrCl < 30 mL/min) due to extreme dependence on renal excretion (>75-100% unchanged) and high risk of life-threatening toxicity or catastrophic bleeding:',
    candidateStructures: [
      DABIGATRAN_STANDARDIZED,
      FONDAPARINUX_STRUCTURE,
      SOTALOL_STRUCTURE,
      APIXABAN_STRUCTURE,
    ],
    correctStructureIds: ['dabigatran', 'fondaparinux', 'sotalol'],
    rationales: {
      dabigatran:
        'Dabigatran relies on renal elimination for ~80% of systemic clearance. In severe renal impairment (CrCl < 30 mL/min), drug accumulation causes excessive anticoagulation and major hemorrhage; it is contraindicated or avoided in severe renal impairment.',
      fondaparinux:
        'Fondaparinux is a synthetic pentasaccharide that is eliminated 100% unchanged by the kidneys. It carries a strict FDA black box / absolute contraindication in patients with CrCl < 30 mL/min due to dramatically increased risk of fatal bleeding.',
      sotalol:
        'Sotalol is a non-selective beta-blocker with Class III potassium channel blocking activity that is eliminated >80% unchanged in the urine. Renal impairment causes drug accumulation, leading to severe QT prolongation, bradycardia, and life-threatening Torsades de Pointes; it is strictly contraindicated at CrCl < 40 mL/min (or <30 mL/min).',
      apixaban:
        'Apixaban has the lowest renal elimination (~27%) among the DOACs, with the majority cleared via fecal/biliary and CYP3A4 hepatic routes. It does not carry an absolute contraindication in severe renal impairment and is FDA-approved even in end-stage renal disease (ESRD) on hemodialysis with appropriate dose adjustments.',
    },
    highYieldPearl:
      'Drugs that undergo predominant (>75-100%) unchanged renal excretion—such as fondaparinux (100%), sotalol (>80%), and dabigatran (80%)—accumulate rapidly in renal failure and are contraindicated at CrCl < 30 mL/min; apixaban (27% renal) has the lowest renal elimination among DOACs and is preferred in renal impairment.',
  },

  // 8. Type D: Vasodilators Contraindicated / Severe Caution in Critical Aortic Stenosis (Contraindication Risk)
  {
    id: 'cumul_q8_aortic_stenosis_vasodilators',
    type: 'contraindication-risk',
    moduleIds: ['heart_failure_mcp2', 'antiarrhythmics_mcp2'],
    stem:
      'An 84-year-old patient with severe calcific aortic stenosis (fixed left ventricular outflow tract obstruction with mean valve gradient > 45 mmHg and valve area 0.6 cm²) develops acute hypertensive urgency. Select all candidate structures below that act as potent direct vasodilators (nitric oxide donors or direct vascular smooth muscle relaxants) that are contraindicated or carry severe black-box warnings in critical aortic stenosis due to the risk of catastrophic cardiovascular collapse from sudden preload or afterload reduction across a fixed mechanical obstruction:',
    candidateStructures: [
      NITROPRUSSIDE_STRUCTURE,
      NITROGLYCERIN_STRUCTURE,
      HYDRALAZINE_STRUCTURE,
      METOPROLOL_STRUCTURE,
    ],
    correctStructureIds: ['nitroprusside', 'nitroglycerin', 'hydralazine'],
    rationales: {
      nitroprusside:
        'Sodium nitroprusside is an inorganic nitrosyl complex that spontaneously releases nitric oxide, producing potent and balanced arterial and venous dilation. In severe aortic stenosis, sharp afterload and preload reduction causes a precipitate drop in systemic blood pressure and coronary perfusion pressure that the fixed stenotic valve cannot compensate for, precipitating acute circulatory arrest.',
      nitroglycerin:
        'Nitroglycerin is an organic trinitrate that undergoes ALDH2 bioactivation to release nitric oxide, causing profound venous pooling. In critical aortic stenosis, left ventricular filling (preload) is essential to maintain stroke volume across the stenotic valve; acute venodilation causes precipitous drops in cardiac output, syncope, and severe hypotension.',
      hydralazine:
        'Hydralazine is a direct-acting arteriolar vasodilator. In severe aortic stenosis, lowering systemic vascular resistance cannot increase cardiac output due to the fixed physical obstruction, resulting in severe hypotension and reflex tachycardia that exacerbates myocardial ischemia.',
      metoprolol:
        'Metoprolol is a cardioselective beta-1 adrenergic antagonist, not a direct vasodilator. While beta-blockers must be used with caution in aortic stenosis to avoid severe bradycardia or heart failure decompensation, they do not cause sudden vasodilatory collapse.',
    },
    highYieldPearl:
      'In severe fixed aortic stenosis, left ventricular cardiac output is mechanically capped; potent direct vasodilators (nitroprusside, nitroglycerin, hydralazine) cause precipitous drops in preload and afterload that trigger catastrophic coronary hypoperfusion and circulatory collapse.',
  },
];

import { CUMULATIVE_QUESTIONS_EXAM_2 as EXAM_2_QUESTIONS } from './exam2/exam2CumulativeQuizData';
import { CUMULATIVE_QUESTIONS_EXAM_1 as EXAM_1_QUESTIONS } from './exam1/exam1CumulativeQuizData';

export const CUMULATIVE_QUESTIONS_EXAM_3: CumulativeQuestion[] = CUMULATIVE_QUESTIONS;
export let CUMULATIVE_QUESTIONS_EXAM_2: CumulativeQuestion[] = EXAM_2_QUESTIONS;
export let CUMULATIVE_QUESTIONS_EXAM_1: CumulativeQuestion[] = EXAM_1_QUESTIONS;

export function setExam2QuestionBank(questions: CumulativeQuestion[]): void {
  CUMULATIVE_QUESTIONS_EXAM_2 = questions;
}

export function setExam1QuestionBank(questions: CumulativeQuestion[]): void {
  CUMULATIVE_QUESTIONS_EXAM_1 = questions;
}

/**
 * Accessor function returning the complete curated cross-curriculum cumulative question bank,
 * scoped by examId ('exam_1', 'exam_2', 'exam_3'). Defaults to 'exam_3'.
 */
export function getCumulativeQuestionBank(examId: string = 'exam_3'): CumulativeQuestion[] {
  if (examId === 'exam_2') {
    return CUMULATIVE_QUESTIONS_EXAM_2;
  }
  if (examId === 'exam_1') {
    return CUMULATIVE_QUESTIONS_EXAM_1;
  }
  return CUMULATIVE_QUESTIONS_EXAM_3;
}
