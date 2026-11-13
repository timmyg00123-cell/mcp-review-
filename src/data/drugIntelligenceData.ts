/**
 * Curated Drug Intelligence Catalog & Clinical Decision Profiles.
 *
 * Provides high-yield clinical PK/PD profiles, prodrug/active drug bioactivation mechanisms,
 * half-life, Tmax, bioavailability, plasma protein binding, clearance routes, CYP metabolism,
 * clinical decision rationale ("Why/when to choose this drug over alternatives"), boxed warnings,
 * contraindications, and 3D structural target connections (Gene symbol + PDB ID).
 */

export interface DrugIntelligenceProfile {
  drugName: string;
  isProdrug: boolean;
  prodrugActivation?: string;
  halfLife: string;
  tMax: string;
  bioavailability: string;
  proteinBinding: string;
  volumeOfDistribution?: string;
  cypMetabolism: string;
  clearance: string;
  clinicalDecisionRationale: string;
  contraindications: string[];
  boxedWarnings?: string;
  targetGeneSymbol?: string;
  pdbId?: string;
}

export const DRUG_INTELLIGENCE_CATALOG: Record<string, DrugIntelligenceProfile> = {
  clopidogrel: {
    drugName: 'Clopidogrel',
    isProdrug: true,
    prodrugActivation:
      'Two-step hepatic bioactivation: ~85% hydrolysed by CES1 to inactive carboxylic acid; remaining ~15% oxidized by CYP2C19, CYP3A4, CYP2B6, and CYP1A2 to 2-oxo-clopidogrel thiolactone intermediate, then active thiol metabolite (H4) that covalently binds P2Y12.',
    halfLife: 'Parent drug: ~6 hours; Active thiol metabolite: ~30 minutes (Platelet inhibition persists 7-10 days due to irreversible covalent binding)',
    tMax: '~45-60 minutes (active metabolite peak)',
    bioavailability: '~50% (rapidly absorbed, extensively metabolized)',
    proteinBinding: '98% (parent drug), 94% (inactive carboxylic acid metabolite)',
    volumeOfDistribution: '~2 L/kg',
    cypMetabolism: 'CYP2C19 (predominant bioactivation), CYP3A4, CYP2B6, CYP1A2',
    clearance: 'Renal (50%) and fecal/biliary (46%) elimination of metabolites',
    clinicalDecisionRationale:
      'First-line oral P2Y12 inhibitor for acute coronary syndrome (ACS), percutaneous coronary intervention (PCI), and secondary ischemic stroke/PAD prevention with lowest cost and generic availability. Preferred over prasugrel in patients with prior stroke/TIA or age >=75 where bleeding risk is elevated; requires CYP2C19 genotype screening or alternative agent in known poor metabolizers (*2, *3).',
    contraindications: [
      'Active pathological bleeding (e.g., peptic ulcer, intracranial hemorrhage)',
      'Severe hepatic impairment (Child-Pugh C)',
      'Hypersensitivity to clopidogrel or thienopyridines',
    ],
    boxedWarnings:
      'Diminished antiplatelet effect in patients with two loss-of-function CYP2C19 alleles (*2/*2, *2/*3, *3/*3; poor metabolizers). Consider alternative P2Y12 inhibitor (prasugrel, ticagrelor) in identified poor metabolizers.',
    targetGeneSymbol: 'P2RY12',
    pdbId: '4NTJ',
  },

  prasugrel: {
    drugName: 'Prasugrel',
    isProdrug: true,
    prodrugActivation:
      'Rapid single-step intestinal/plasma carboxylesterase (CES2/hCE60) hydrolysis to thiolactone intermediate (R-95913), followed by single hepatic CYP oxidation (predominantly CYP3A4 and CYP2B6) to active thiol metabolite (R-138727). Minimal dependence on polymorphic CYP2C19.',
    halfLife: 'Active metabolite: ~7 hours (range 2-15 hours); Platelet inhibition persists 7-10 days',
    tMax: '~30 minutes (active metabolite peak)',
    bioavailability: '>=79% (rapid and nearly complete oral absorption)',
    proteinBinding: '98% to human serum albumin',
    volumeOfDistribution: '44-68 L (active metabolite)',
    cypMetabolism: 'CYP3A4, CYP2B6, CYP2C9, CYP2C19 (low vulnerability to single CYP polymorphism)',
    clearance: 'Renal (68%) and fecal (27%) excretion of inactive metabolites',
    clinicalDecisionRationale:
      'Preferred over clopidogrel in acute coronary syndromes undergoing PCI when rapid, potent, and predictable platelet inhibition is paramount (e.g., STEMI or high stent thrombosis risk) and patient is not CYP2C19-tested. Significantly reduces recurrent MI and stent thrombosis compared to clopidogrel at the expense of higher major bleeding risk.',
    contraindications: [
      'Active pathological bleeding',
      'History of transient ischemic attack (TIA) or stroke (absolute contraindication due to high risk of intracranial hemorrhage)',
      'Severe hepatic impairment (Child-Pugh C)',
    ],
    boxedWarnings:
      'Can cause significant, sometimes fatal bleeding. Not recommended in patients >=75 years of age (except in high-risk patients with DM or prior MI) or body weight <60 kg (requires 5 mg dose reduction). Contraindicated in patients with prior TIA or stroke.',
    targetGeneSymbol: 'P2RY12',
    pdbId: '4NTJ',
  },

  ticagrelor: {
    drugName: 'Ticagrelor',
    isProdrug: false,
    halfLife: '~7 hours (parent ticagrelor); ~9 hours (active AR-C124910XX metabolite)',
    tMax: '1.5 hours (parent drug); 2.5 hours (active metabolite)',
    bioavailability: '~36% (oral absorption unaffected by food)',
    proteinBinding: '>99.7%',
    volumeOfDistribution: '88 L',
    cypMetabolism: 'Extensively metabolized by CYP3A4 and CYP3A5 to active metabolite AR-C124910XX; mild CYP3A4 inhibitor',
    clearance: 'Biliary/fecal excretion (~58%) and renal excretion (~26%)',
    clinicalDecisionRationale:
      'Direct-acting, reversible cyclopentyltriazolopyrimidine P2Y12 antagonist. Preferred in ACS managed either medically or invasively with PCI without metabolic activation delay. Faster onset and offset than clopidogrel (allows surgical intervention ~3-5 days after stopping). Has additional adenosine reuptake inhibition (ENT1) producing pleiotropic cardioprotection but causing dyspnea in ~10-15% of patients.',
    contraindications: [
      'Active pathological bleeding',
      'History of intracranial hemorrhage',
      'Severe hepatic impairment',
    ],
    boxedWarnings:
      'Bleeding risk: Do not use in patients with active pathological bleeding or prior intracranial hemorrhage. Aspirin dose restriction: Concomitant maintenance aspirin doses >100 mg/day significantly decrease the clinical efficacy of ticagrelor; maintain aspirin at 81 mg daily.',
    targetGeneSymbol: 'P2RY12',
    pdbId: '4NTJ',
  },

  cangrelor: {
    drugName: 'Cangrelor',
    isProdrug: false,
    halfLife: '3-6 minutes (ultrashort, rapid reversible offset)',
    tMax: '<2 minutes (administered as IV bolus + infusion; immediate steady state)',
    bioavailability: '100% (intravenous formulation)',
    proteinBinding: '97-98%',
    volumeOfDistribution: '~3.9 L',
    cypMetabolism: 'None (does not undergo hepatic CYP metabolism; dephosphorylated in blood by ecto-nucleotidases to inactive nucleoside metabolite)',
    clearance: 'Rapid enzymatic inactivation in plasma; renal excretion of inactive metabolites (~58%) and fecal excretion (~35%)',
    clinicalDecisionRationale:
      'Only available intravenous P2Y12 inhibitor. Indicated as an adjunct to PCI for reducing periprocedural MI, repeat revascularization, and stent thrombosis in patients who have not received an oral P2Y12 inhibitor and are not being given a GP IIb/IIIa inhibitor, or as bridging therapy in patients with coronary stents requiring urgent surgery. Platelet function normalizes within 1 hour of infusion termination.',
    contraindications: [
      'Significant active pathological bleeding',
      'Hypersensitivity to cangrelor or any component',
    ],
    targetGeneSymbol: 'P2RY12',
    pdbId: '4NTJ',
  },

  aspirin: {
    drugName: 'Aspirin',
    isProdrug: false,
    halfLife: '15-20 minutes (parent acetylsalicylic acid); 2-3 hours (salicylic acid at low doses, up to 15-30 hours at anti-inflammatory/toxic doses due to zero-order kinetics)',
    tMax: '1-2 hours (uncoated tablets; delayed with enteric coating ~3-4 hours)',
    bioavailability: '~50-75% (rapidly hydrolyzed during first-pass transit)',
    proteinBinding: '90-95% (salicylate binds primarily to albumin, concentration-dependent)',
    volumeOfDistribution: '0.15-0.2 L/kg (salicylate distribution)',
    cypMetabolism: 'Minor CYP2C9 oxidation of salicylate to gentisic acid; primarily non-CYP hepatic conjugation (glycine conjugation to salicyluric acid, glucuronidation)',
    clearance: 'Renal clearance of free salicylate and glucuronide/glycine conjugates; highly dependent on urinary pH (alkalinization increases excretion)',
    clinicalDecisionRationale:
      'Cornerstone antiplatelet therapy for primary and secondary prevention of cardiovascular events, acute coronary syndromes, and ischemic stroke. Irreversibly acetylates Ser529 of COX-1, permanently abolishing platelet thromboxane A2 (TXA2) generation for the platelet lifetime (~7-10 days). Standard foundation of Dual Antiplatelet Therapy (DAPT) alongside a P2Y12 inhibitor.',
    contraindications: [
      'Severe aspirin or NSAID-induced asthma, rhinitis, or urticaria (Samter triad)',
      'Active gastrointestinal bleeding or peptic ulcer disease',
      'Hemophilia or other active bleeding diatheses',
      'Children and teenagers with viral illness (varicella, influenza) due to risk of Reye syndrome',
    ],
    boxedWarnings:
      "Reye's syndrome warning: Avoid in pediatric patients and adolescents recovering from chickenpox or flu-like symptoms due to the risk of fatal Reye's syndrome (hepatic encephalopathy and microvesicular steatosis).",
    targetGeneSymbol: 'PTGS1',
    pdbId: '1CQE',
  },

  eptifibatide: {
    drugName: 'Eptifibatide',
    isProdrug: false,
    halfLife: '2.5 hours',
    tMax: 'Immediate (IV bolus + continuous infusion; steady state achieved within 5 minutes)',
    bioavailability: '100% (intravenous formulation)',
    proteinBinding: '~25%',
    volumeOfDistribution: '0.2-0.3 L/kg (18-24 L)',
    cypMetabolism: 'None (synthetic cyclic heptapeptide containing KGD sequence; resistant to general peptide degradation and hepatic CYP enzymes)',
    clearance: 'Renal clearance (~50% excreted unchanged in urine); dose reduction required in renal insufficiency (CrCl < 50 mL/min)',
    clinicalDecisionRationale:
      'Reversible, cyclic heptapeptide GP IIb/IIIa antagonist mimicking the KGD (Lys-Gly-Asp) motif of fibrinogen. Indicated for medical management of unstable angina/NSTEMI and during PCI. Reversibility and shorter half-life (~2.5 h) allow platelet aggregation recovery within 4-8 hours post-discontinuation, providing safer bleeding offset compared to abciximab.',
    contraindications: [
      'History of bleeding diathesis or active abnormal bleeding within 30 days',
      'Severe hypertension (systolic BP > 200 mmHg or diastolic BP > 110 mmHg on therapy)',
      'Major surgery or severe trauma within preceding 6 weeks',
      'History of stroke within 30 days or any history of hemorrhagic stroke',
      'Current or planned concomitant parenteral GP IIb/IIIa inhibitor',
      'Platelet count < 100,000/mm³',
      'Severe renal impairment on hemodialysis',
    ],
    targetGeneSymbol: 'ITGA2B',
    pdbId: '1TY6',
  },

  tirofiban: {
    drugName: 'Tirofiban',
    isProdrug: false,
    halfLife: '1.5-2 hours',
    tMax: 'Immediate (IV bolus + continuous infusion)',
    bioavailability: '100% (intravenous formulation)',
    proteinBinding: '~35%',
    volumeOfDistribution: '22-42 L',
    cypMetabolism: 'Minimal (no significant CYP450 metabolism)',
    clearance: 'Primarily renal (~65% excreted unchanged in urine) and fecal (~25%); dosage reduction (50%) required in severe renal impairment (CrCl <= 60 mL/min)',
    clinicalDecisionRationale:
      'Non-peptide small molecule GP IIb/IIIa inhibitor derived from tyrosine, designed to mimic the RGD recognition sequence. Rapidly inhibits platelet aggregation with quick offset (platelet recovery >80% within 4-6 hours post-infusion). Used in non-ST elevation ACS and PCI to prevent ischemic complications; highly titratable with weight-based dosing.',
    contraindications: [
      'Active internal bleeding or bleeding history within 30 days',
      'History of intracranial hemorrhage, intracranial neoplasm, arteriovenous malformation, or aneurysm',
      'History of stroke within 30 days or hemorrhagic stroke at any time',
      'Severe hypertension (systolic BP > 200 mmHg or diastolic BP > 110 mmHg)',
      'Major surgery or severe physical trauma within 6 weeks',
      'Thrombocytopenia (platelets < 100,000/mm³) or history of tirofiban/GP IIb/IIIa inhibitor thrombocytopenia',
    ],
    targetGeneSymbol: 'ITGA2B',
    pdbId: '2VDM',
  },

  vorapaxar: {
    drugName: 'Vorapaxar',
    isProdrug: false,
    halfLife: '~8 days (effective terminal elimination half-life ~12-13 days due to tight target binding)',
    tMax: '1-2 hours',
    bioavailability: '100% (oral absorption unaffected by food or PPIs)',
    proteinBinding: '>99%',
    volumeOfDistribution: '~424 L',
    cypMetabolism: 'Extensively metabolized primarily by CYP3A4 and CYP2J2 to active metabolite M20; avoid strong CYP3A4 inducers or inhibitors',
    clearance: 'Eliminated primarily as metabolites via feces (~58%) and urine (~25%)',
    clinicalDecisionRationale:
      'First-in-class oral protease-activated receptor-1 (PAR-1) antagonist, selectively inhibiting thrombin-induced platelet activation without interfering with thrombin cleavage of fibrinogen. Added to aspirin and/or clopidogrel for secondary prevention in post-MI or peripheral artery disease (PAD) patients to reduce cardiovascular death, MI, stroke, and urgent coronary revascularization.',
    contraindications: [
      'History of stroke, transient ischemic attack (TIA), or intracranial hemorrhage (absolute contraindication)',
      'Active pathological bleeding',
    ],
    boxedWarnings:
      'Bleeding risk: Increases risk of bleeding, including intracranial hemorrhage (ICH) and fatal bleeding. Contraindicated in patients with a history of stroke, TIA, or intracranial hemorrhage.',
    targetGeneSymbol: 'F2R',
    pdbId: '5NDD',
  },

  enalapril: {
    drugName: 'Enalapril',
    isProdrug: true,
    prodrugActivation:
      'Enalapril monoethyl ester is bioactivated in the liver by hepatic carboxylesterases (CES1) via ester cleavage into the active dicarboxylic acid zinc-chelating inhibitor enalaprilat.',
    halfLife: 'Enalapril: ~1.3 hours; Active enalaprilat: ~11 hours (terminal polyphasic elimination ~30-35 hours reflecting high-affinity ACE enzyme binding)',
    tMax: 'Enalapril: ~1 hour; Enalaprilat: ~3-4 hours',
    bioavailability: '~60% (absorbed as prodrug; enalaprilat oral bioavailability is <10%)',
    proteinBinding: '<50% (enalaprilat)',
    volumeOfDistribution: '1.7 L/kg',
    cypMetabolism: 'None (does not undergo cytochrome P450 oxidation; cleaved by esterases)',
    clearance: 'Renal excretion (>90% as enalaprilat and intact enalapril); requires dosage adjustment when CrCl < 30 mL/min',
    clinicalDecisionRationale:
      'Standard-of-care ACE inhibitor for hypertension, heart failure with reduced ejection fraction (HFrEF; proven mortality benefit in SOLVD/CONSENSUS trials), and diabetic nephropathy. Formulated as ethyl ester prodrug to overcome negligible oral bioavailability of zwitterionic enalaprilat. Available as IV enalaprilat for acute hypertensive emergencies when oral therapy is not feasible.',
    contraindications: [
      'History of angioedema related to previous ACE inhibitor or ARB therapy, or hereditary/idiopathic angioedema',
      'Concomitant use with neprilysin inhibitor (sacubitril/valsartan) within 36 hours (angioedema risk)',
      'Concomitant use of aliskiren in patients with diabetes',
      'Pregnancy (fetal toxicity, oligohydramnios, skull hypoplasia)',
    ],
    boxedWarnings:
      'Fetal toxicity: Drugs that act directly on the renin-angiotensin system can cause injury and death to the developing fetus. Discontinue immediately when pregnancy is detected.',
    targetGeneSymbol: 'ACE',
    pdbId: '1O86',
  },

  atorvastatin: {
    drugName: 'Atorvastatin',
    isProdrug: false,
    halfLife: '14 hours (parent drug); 20-30 hours (effective half-life of HMG-CoA reductase inhibitory activity due to active ortho- and para-hydroxy metabolites)',
    tMax: '1-2 hours',
    bioavailability: '~14% (rapid absorption but extensive first-pass hepatic metabolism and intestinal gut-wall extraction)',
    proteinBinding: '>=98%',
    volumeOfDistribution: '~381 L',
    cypMetabolism: 'Extensively metabolized by CYP3A4 to active ortho- and para-hydroxylated metabolites and beta-oxidation products; sensitive to strong CYP3A4 inhibitors (clarithromycin, itraconazole)',
    clearance: 'Biliary and hepatic elimination (>98% in feces, <2% renally excreted); no dosage adjustment needed in renal impairment',
    clinicalDecisionRationale:
      'High-intensity statin (40-80 mg daily provides >=50% LDL-C reduction) for primary and secondary cardiovascular risk reduction, post-ACS stabilization, and familial hypercholesterolemia. Long half-life of active metabolites allows flexible once-daily dosing at any time of day (unlike short-acting simvastatin/pravastatin). Safe in moderate-to-severe renal impairment without dose adjustments.',
    contraindications: [
      'Active liver disease or unexplained persistent elevations of hepatic transaminases',
      'Hypersensitivity to atorvastatin',
      'Pregnancy and lactation',
    ],
    targetGeneSymbol: 'HMGCR',
    pdbId: '1HWK',
  },

  losartan: {
    drugName: 'Losartan',
    isProdrug: true,
    prodrugActivation:
      'Undergoes reversible first-pass hepatic oxidation by CYP2C9 and CYP3A4 into the long-acting, non-competitive active carboxylic acid metabolite EXP3174 (10-40x more potent than parent losartan).',
    halfLife: 'Parent losartan: ~1.5-2 hours; Active metabolite EXP3174: ~6-9 hours',
    tMax: 'Losartan: 1 hour; EXP3174: 3-4 hours',
    bioavailability: '~33%',
    proteinBinding: '>=99%',
    volumeOfDistribution: 'Losartan: 34 L; EXP3174: 12 L',
    cypMetabolism: 'CYP2C9 and CYP3A4 oxidation to EXP3174',
    clearance: 'Biliary/fecal (~60%) and renal (~35%) elimination',
    clinicalDecisionRationale:
      'First-line angiotensin II receptor blocker (ARB) for hypertension, diabetic nephropathy, and stroke prevention in LVH (RENAAL and LIFE trials). Preferred over ACE inhibitors in patients who develop bradykinin-mediated dry cough or angioedema. Features unique uricosuric effect (inhibits URAT1), lowering serum uric acid in patients with concomitant gout.',
    contraindications: [
      'Concomitant aliskiren in patients with diabetes',
      'History of hypersensitivity to ARBs',
      'Pregnancy',
    ],
    boxedWarnings:
      'Fetal toxicity: Discontinue as soon as pregnancy is detected; causes oligohydramnios and fetal injury.',
    targetGeneSymbol: 'AGTR1',
    pdbId: '4Z9O',
  },

  metoprolol: {
    drugName: 'Metoprolol',
    isProdrug: false,
    halfLife: '3-7 hours (extensive metabolizers); 7-9 hours (poor CYP2D6 metabolizers)',
    tMax: 'Tartrate (immediate-release): 1.5-2 hours; Succinate (extended-release): 4-5 hours (flat 24-hour plasma concentration)',
    bioavailability: '~50% (metoprolol tartrate), ~40% (metoprolol succinate) due to stereoselective hepatic first-pass metabolism',
    proteinBinding: '~12%',
    volumeOfDistribution: '3.2-5.6 L/kg',
    cypMetabolism: 'Extensively metabolized by CYP2D6 (~70-80% of metabolism) to alpha-hydroxymetoprolol and O-demethylmetoprolol; subject to polymorphic variation',
    clearance: 'Renal elimination of inactive metabolites (>95%); <5% excreted unchanged',
    clinicalDecisionRationale:
      'Cardioselective beta-1 adrenergic antagonist. Metoprolol succinate (extended-release) is one of only three beta-blockers with proven all-cause mortality reduction in HFrEF (MERIT-HF trial). Highly preferred for post-MI cardioprotection, rate control in atrial fibrillation, and angina pectoris with lower risk of bronchospasm than non-selective beta-blockers (e.g., propranolol).',
    contraindications: [
      'Severe bradycardia (heart rate < 45 bpm)',
      'Second- or third-degree heart block (without pacemaker)',
      'Cardiogenic shock or decompensated acute heart failure',
      'Severe peripheral arterial circulatory disorders',
    ],
    boxedWarnings:
      'Ischemic heart disease exacerbation upon abrupt discontinuation: Severe exacerbation of angina, myocardial infarction, and ventricular arrhythmias have occurred following abrupt cessation; taper gradually over 1-2 weeks.',
    targetGeneSymbol: 'ADRB1',
    pdbId: '7JJO',
  },
};

/**
 * Normalized alias dictionary mapping brand names, acronyms, and chemical variations
 * to canonical drug keys in DRUG_INTELLIGENCE_CATALOG.
 */
const DRUG_ALIASES: Record<string, string> = {
  // Aspirin / Salicylates
  asa: 'aspirin',
  'acetylsalicylic acid': 'aspirin',
  acetylsalicylate: 'aspirin',
  bayer: 'aspirin',
  ecotrin: 'aspirin',
  bufferin: 'aspirin',

  // Clopidogrel
  plavix: 'clopidogrel',
  iscover: 'clopidogrel',

  // Prasugrel
  effient: 'prasugrel',
  efient: 'prasugrel',

  // Ticagrelor
  brilinta: 'ticagrelor',
  brilique: 'ticagrelor',
  possia: 'ticagrelor',

  // Cangrelor
  kengreal: 'cangrelor',
  kengrexal: 'cangrelor',

  // Eptifibatide
  integrilin: 'eptifibatide',

  // Tirofiban
  aggrastat: 'tirofiban',

  // Vorapaxar
  zontivity: 'vorapaxar',

  // Enalapril / Enalaprilat
  enalaprilat: 'enalapril',
  vasotec: 'enalapril',
  renitec: 'enalapril',
  enacard: 'enalapril',

  // Atorvastatin
  lipitor: 'atorvastatin',
  torvast: 'atorvastatin',
  atorva: 'atorvastatin',

  // Losartan
  cozaar: 'losartan',
  exp3174: 'losartan',
  'exp-3174': 'losartan',

  // Metoprolol
  toprol: 'metoprolol',
  'toprol-xl': 'metoprolol',
  'toprol xl': 'metoprolol',
  lopressor: 'metoprolol',
  'metoprolol succinate': 'metoprolol',
  'metoprolol tartrate': 'metoprolol',
};

/**
 * Cleans and normalizes drug name strings for resilient dictionary matching.
 */
function normalizeName(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Retrieves the curated drug intelligence and clinical decision profile for a given drug.
 * Supports case-insensitivity, common trade/brand names, acronyms, and variations.
 *
 * @param drugName Drug name, brand name, or alias (e.g. "Clopidogrel", "Plavix", "ASA", "Brilinta")
 * @returns Curated DrugIntelligenceProfile or null if not found
 */
export function getDrugIntelligenceProfile(drugName: string): DrugIntelligenceProfile | null {
  if (!drugName || typeof drugName !== 'string') {
    return null;
  }

  const rawNormalized = drugName.trim().toLowerCase();
  if (DRUG_INTELLIGENCE_CATALOG[rawNormalized]) {
    return DRUG_INTELLIGENCE_CATALOG[rawNormalized];
  }

  if (DRUG_ALIASES[rawNormalized]) {
    const canonicalKey = DRUG_ALIASES[rawNormalized];
    return DRUG_INTELLIGENCE_CATALOG[canonicalKey] || null;
  }

  const cleaned = normalizeName(drugName);
  if (DRUG_INTELLIGENCE_CATALOG[cleaned]) {
    return DRUG_INTELLIGENCE_CATALOG[cleaned];
  }

  if (DRUG_ALIASES[cleaned]) {
    const canonicalKey = DRUG_ALIASES[cleaned];
    return DRUG_INTELLIGENCE_CATALOG[canonicalKey] || null;
  }

  // Substring / prefix match for composite names (e.g. "Enalaprilat (Vasotec IV)")
  for (const [key, profile] of Object.entries(DRUG_INTELLIGENCE_CATALOG)) {
    if (cleaned.includes(key) || key.includes(cleaned)) {
      return profile;
    }
  }

  for (const [alias, canonicalKey] of Object.entries(DRUG_ALIASES)) {
    if (cleaned.includes(alias)) {
      return DRUG_INTELLIGENCE_CATALOG[canonicalKey] || null;
    }
  }

  return null;
}
