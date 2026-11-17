/**
 * Top 200 Clinical Subclass Profiles & Drug Exception Repository
 * 
 * Provides shared class profiles (universal MOA, class-wide toxicities, baseline monitoring,
 * and black box warnings) along with high-yield drug-specific exceptions for major outpatient
 * pharmacologic drug classes.
 */

import { TOP_DRUGS_TAXONOMY, type TopDrugEntry } from '../topDrugsTaxonomyData.js';

export interface TopDrugClassProfile {
  className: string;
  therapeuticCategory: string;
  universalMoa: string;
  classWideToxicities: string[];
  baselineMonitoring: string[];
  classBlackBoxWarnings?: string[];
  memberDrugNames: string[];
  exceptionsByDrug: Record<string, string[]>;
}

export const CLASS_PROFILES: TopDrugClassProfile[] = [
  {
    className: 'Statins',
    therapeuticCategory: '10. Cardiovascular --- Anti-Lipemic Agent',
    universalMoa: 'Competitively inhibit 3-hydroxy-3-methylglutaryl-coenzyme A (HMG-CoA) reductase, the rate-limiting enzyme in cholesterol biosynthesis; upregulates hepatic LDL receptors, markedly increasing clearance of circulating LDL-C and apolipoprotein B.',
    classWideToxicities: [
      'Statin-associated muscle symptoms (SAMS) / myalgia',
      'Myopathy and rare rhabdomyolysis with acute renal failure secondary to myoglobinuria',
      'Asymptomatic transaminase elevations (hepatotoxicity)',
      'Mild dose-dependent increases in blood glucose and HbA1c',
      'Cognitive impairment / reversible memory loss (rare)',
    ],
    baselineMonitoring: [
      'Baseline lipid panel (total cholesterol, LDL-C, HDL-C, triglycerides)',
      'Baseline liver function tests (alanine transaminase [ALT]/aspartate transaminase [AST])',
      'Serum creatine kinase (CK) if at high risk or baseline muscle symptoms',
      'Baseline fasting blood glucose or HbA1c',
      'Renal function (eGFR/serum creatinine)',
    ],
    memberDrugNames: [
      'Atorvastatin',
      'Rosuvastatin',
      'Simvastatin',
      'Pravastatin',
      'Lovastatin',
    ],
    exceptionsByDrug: {
      'Atorvastatin': [
        'High-intensity statin at 40-80 mg daily (reduces LDL-C >= 50%); medium-intensity at 10-20 mg.',
        'Lipophilic statin extensively metabolized by CYP3A4; significant drug interaction with strong CYP3A4 inhibitors (clarithromycin, itraconazole, protease inhibitors).',
        'Hepatic clearance with minimal renal elimination (<2%); no routine dose adjustment required in mild-to-moderate renal impairment.',
      ],
      'Rosuvastatin': [
        'High-intensity statin at 20-40 mg daily (reduces LDL-C >= 50%); medium-intensity at 5-10 mg.',
        'Hydrophilic statin minimally metabolized by CYP2C9 (~10%) with low CYP3A4 involvement; significantly lower risk of CYP3A4-mediated drug interactions.',
        '~10% eliminated renally; dose adjustment recommended in severe renal impairment (CrCl < 30 mL/min, max 10 mg/day).',
        'Asian patients exhibit ~2-fold higher plasma exposure; recommended initial dose is 5 mg daily.',
      ],
      'Pravastatin': [
        'Hydrophilic statin NOT metabolized by cytochrome P450 enzymes (eliminated via sulfation); lowest risk of CYP-mediated drug interactions among statins.',
        'Low-to-moderate intensity statin (10-80 mg daily); maximum 80 mg achieves ~37% LDL reduction.',
        'Excreted ~20% renally; dose adjustment recommended in severe renal impairment (start at 10 mg daily).',
      ],
      'Simvastatin': [
        'Lipophilic prodrug hydrolyzed to active beta-hydroxyacid; extensively metabolized by CYP3A4 with highest drug-interaction risk.',
        'Strict FDA dose ceiling: 80 mg daily is restricted due to heightened rhabdomyolysis risk (only continue if taken >=12 months without myopathy).',
        'Contraindicated with strong CYP3A4 inhibitors, gemfibrozil, cyclosporine, and danazol; cap at 10 mg with verapamil/diltiazem, 20 mg with amlodipine/ranolazine.',
      ],
      'Lovastatin': [
        'Lipophilic prodrug naturally derived from Aspergillus terreus; must be taken with evening meal to enhance oral bioavailability (except ER formulation).',
        'Extensively metabolized by CYP3A4 with high drug-interaction profile similar to simvastatin.',
      ],
    },
  },
  {
    className: 'ACE Inhibitors',
    therapeuticCategory: '11. Cardiovascular --- Antihypertensive',
    universalMoa: 'Competitively inhibit angiotensin-converting enzyme (peptidyl-dipeptidase A), preventing conversion of angiotensin I to the potent vasoconstrictor angiotensin II; decreases aldosterone secretion and inhibits degradation of vasodilator bradykinin.',
    classWideToxicities: [
      'Dry, persistent, non-productive cough (bradykinin / substance P accumulation, 10-20% incidence)',
      'Hyperkalemia (impaired aldosterone secretion)',
      'Acute renal impairment / decline in GFR due to efferent arteriolar vasodilation (especially in bilateral renal artery stenosis or volume depletion)',
      'Angioedema (life-threatening airway swelling from bradykinin, higher in Black patients)',
      'First-dose hypotension / orthostasis',
    ],
    baselineMonitoring: [
      'Serum creatinine and estimated GFR (baseline and 1-2 weeks after initiation/titration; accept up to 30% rise)',
      'Serum potassium (hyperkalemia risk)',
      'Blood pressure and pulse',
    ],
    classBlackBoxWarnings: [
      'Fetal Toxicity: Can cause serious injury or death to the developing fetus when administered during the second and third trimesters of pregnancy (oligohydramnios, skull hypoplasia, renal failure); discontinue immediately upon pregnancy detection.',
    ],
    memberDrugNames: [
      'Lisinopril',
      'Enalapril',
      'Ramipril',
      'Benazepril',
      'Fosinopril',
      'Quinapril',
      'Captopril',
    ],
    exceptionsByDrug: {
      'Lisinopril': [
        'Hydrophilic lysine analog of enalaprilat, administered as active drug (not a prodrug); predictable bioavailability unaffected by food.',
        '100% eliminated unchanged via kidneys; requires dose reduction in renal impairment (CrCl < 30 mL/min).',
      ],
      'Enalapril': [
        'Prodrug hydrolyzed hepatically to active enalaprilat; available in oral solution and IV enalaprilat formulation for hypertensive emergencies.',
        'Requires renal dose adjustment.',
      ],
      'Ramipril': [
        'Lipophilic prodrug converted to active ramiprilat; established landmark cardiovascular risk reduction trial evidence (HOPE trial) for high-risk patients without heart failure.',
        'Capsule formulation can be opened and sprinkled onto applesauce.',
      ],
      'Benazepril': [
        'Frequently co-formulated with amlodipine (Lotrel) for synergistic renin-angiotensin and calcium-channel dual blockade.',
        'Dose reduction recommended when CrCl < 30 mL/min.',
      ],
      'Fosinopril': [
        'Unique dual compensatory elimination: excreted equally (~50/50) by hepatic and renal pathways; no dosage adjustment required in mild-to-moderate renal or hepatic impairment.',
      ],
      'Captopril': [
        'Contains a sulfhydryl moiety responsible for short half-life (requires TID dosing), high incidence of rash, taste disturbance (dysgeusia), and rare agranulocytosis.',
      ],
    },
  },
  {
    className: 'ARBs',
    therapeuticCategory: '11. Cardiovascular --- Antihypertensive',
    universalMoa: 'Selectively and competitively block the angiotensin II type 1 (AT1) receptor, blocking the vasoconstrictor and aldosterone-secreting effects of angiotensin II without inhibiting bradykinin degradation (virtually zero cough).',
    classWideToxicities: [
      'Hyperkalemia',
      'Hypotension / dizziness',
      'Acute renal dysfunction / elevated serum creatinine (efferent arteriolar dilation)',
      'Angioedema (much lower incidence than ACE inhibitors, ~0.1-0.2%)',
    ],
    baselineMonitoring: [
      'Serum creatinine / eGFR (baseline and 1-2 weeks post-titration)',
      'Serum potassium',
      'Blood pressure',
    ],
    classBlackBoxWarnings: [
      'Fetal Toxicity: Can cause fetal harm, oligohydramnios, neonatal renal failure, and death when used during the second and third trimesters of pregnancy; discontinue immediately upon detection of pregnancy.',
    ],
    memberDrugNames: [
      'Losartan',
      'Valsartan',
      'Olmesartan',
      'Irbesartan',
      'Telmisartan',
      'Candesartan',
    ],
    exceptionsByDrug: {
      'Losartan': [
        'Possesses unique uricosuric activity by inhibiting the renal URAT1 transporter, lowering serum uric acid; ideal for hypertensive patients with comorbid gout.',
        'Metabolized by CYP2C9 and CYP3A4 to active carboxylic acid metabolite EXP3174, which is 10-40x more potent than parent drug.',
      ],
      'Valsartan': [
        'Extensive clinical trial pedigree in heart failure with reduced ejection fraction (Val-HeFT) and post-myocardial infarction (VALIANT); key component of ARNI sacubitril/valsartan (Entresto).',
        'Food decreases bioavailability by ~40-50%.',
      ],
      'Olmesartan': [
        'Associated with sprue-like enteropathy (severe chronic diarrhea with substantial weight loss and intestinal villous atrophy occurring months to years after initiation); requires immediate permanent discontinuation if diagnosed.',
      ],
      'Irbesartan': [
        'Landmark renal protection trials in diabetic nephropathy (IDNT, PRIME); long half-life (~11-15 hours) with no active metabolites.',
      ],
      'Telmisartan': [
        'Longest terminal half-life among ARBs (~24 hours), enabling true once-daily 24-hour BP control; uniquely functions as a partial agonist at PPAR-gamma.',
      ],
    },
  },
  {
    className: 'Beta-Blockers',
    therapeuticCategory: '11. Cardiovascular --- Antihypertensive',
    universalMoa: 'Competitively antagonize beta-1 (cardiac) and/or beta-2 (bronchial/vascular) adrenergic receptors, attenuating catecholamine-mediated inotropic, chronotropic, and dromotropic responses; decreases heart rate, cardiac output, myocardial oxygen demand, and renin release.',
    classWideToxicities: [
      'Bradycardia and conduction delays / heart block',
      'Hypotension and fatigue / exercise intolerance',
      'Cold extremities and worsening of peripheral vascular disease / Raynaud phenomenon',
      'Bronchospasm in reactive airway disease / asthma (especially non-selective agents)',
      'Masking of sympathetically-mediated hypoglycemia symptoms (sweating typically spared)',
      'Depression, sexual dysfunction (erectile dysfunction), vivid dreams/insomnia',
    ],
    baselineMonitoring: [
      'Baseline and periodic heart rate (target resting HR 55-65 bpm)',
      'Blood pressure',
      'ECG (PR interval / AV conduction)',
      'Blood glucose monitoring in diabetics',
    ],
    classBlackBoxWarnings: [
      'Abrupt Discontinuation: Severe exacerbation of angina, myocardial infarction, and ventricular arrhythmias have occurred following abrupt cessation; taper dosage gradually over 1-2 weeks under close monitoring.',
    ],
    memberDrugNames: [
      'Metoprolol Tartrate',
      'Metoprolol Succinate',
      'Atenolol',
      'Carvedilol',
      'Bisoprolol',
      'Nebivolol',
      'Propranolol',
      'Labetalol',
      'Timolol',
    ],
    exceptionsByDrug: {
      'Metoprolol Tartrate': [
        'Immediate-release formulation with short elimination half-life (~3-7 hours); requires twice-daily (BID) dosing with or immediately following meals.',
        'Indicated for hypertension and acute myocardial infarction, NOT approved for chronic heart failure mortality reduction.',
      ],
      'Metoprolol Succinate': [
        'Extended-release formulation designed for once-daily (QD) administration providing uniform 24-hour beta-1 blockade.',
        'One of only three beta-blockers proven to reduce all-cause mortality and hospitalizations in heart failure with reduced ejection fraction (MERIT-HF trial).',
        'Scored tablets can be halved, but must NOT be chewed or crushed.',
      ],
      'Atenolol': [
        'Hydrophilic beta-1 selective blocker predominantly eliminated renally (~50% unchanged); requires dose reduction in renal insufficiency.',
        'Poor central blood pressure lowering and inferior stroke/cardiovascular protection compared to other antihypertensives in clinical trials.',
      ],
      'Carvedilol': [
        'Non-selective beta-1 and beta-2 blocker with additional alpha-1 adrenergic receptor blocking activity (causing peripheral vasodilation).',
        'FDA-approved for HFrEF mortality reduction (COPERNICUS/CAPRICORN); must be taken with food to slow absorption rate and reduce orthostatic hypotension risk.',
        'Possesses antioxidant and antiproliferative properties.',
      ],
      'Nebivolol': [
        'Highly selective beta-1 blocker that stimulates endothelial nitric oxide (NO) synthase, causing endothelium-dependent peripheral vasodilation with minimal erectile dysfunction.',
      ],
      'Propranolol': [
        'Highly lipophilic non-selective beta-blocker that readily crosses the blood-brain barrier; preferred agent for migraine prophylaxis, essential tremor, performance anxiety, and thyroid storm.',
      ],
      'Labetalol': [
        'Combined non-selective beta and alpha-1 blocker (3:1 beta-to-alpha oral ratio, 7:1 IV); first-line drug of choice for severe hypertension and preeclampsia in pregnancy.',
      ],
    },
  },
  {
    className: 'Dihydropyridine CCBs',
    therapeuticCategory: '11. Cardiovascular --- Antihypertensive',
    universalMoa: 'Selectively inhibit L-type voltage-gated calcium channels predominantly in vascular smooth muscle, reducing calcium influx; causes potent peripheral arteriolar vasodilation and decreased systemic vascular resistance with negligible effect on cardiac conduction or inotropy.',
    classWideToxicities: [
      'Dose-dependent peripheral edema (gravitational/ankle edema, refractory to diuretics, caused by precapillary arteriolar dilation)',
      'Reflex tachycardia and palpitations',
      'Flushing, headache, and dizziness',
      'Gingival hyperplasia (rare, dose-dependent)',
    ],
    baselineMonitoring: [
      'Blood pressure and heart rate',
      'Signs/symptoms of peripheral edema',
      'Liver function tests (hepatic metabolism)',
    ],
    memberDrugNames: [
      'Amlodipine',
      'Nifedipine Extended Release',
      'Felodipine',
      'Nicardipine',
    ],
    exceptionsByDrug: {
      'Amlodipine': [
        'Exceptionally long elimination half-life (30-50 hours), conferring smooth 24-hour BP control and forgiving missing a single dose.',
        'Safe in patients with heart failure with reduced ejection fraction (PRAISE trial) when additional BP control is needed.',
      ],
      'Nifedipine Extended Release': [
        'Short-acting / immediate-release nifedipine is STRICTLY CONTRAINDICATED for treating acute hypertension due to precipitous BP drops, severe reflex tachycardia, stroke, and fatal myocardial infarction.',
        'Must use osmotic-release (OROS) or extended-release formulations; ghost tablet shell may appear in stool.',
      ],
      'Nicardipine': [
        'Available as continuous IV infusion with rapid onset (5-15 min) and offset; preferred for acute blood pressure titration in acute aortic dissection or intracranial hemorrhage.',
      ],
    },
  },
  {
    className: 'Non-Dihydropyridine CCBs',
    therapeuticCategory: '11. Cardiovascular --- Antihypertensive',
    universalMoa: 'Inhibit L-type voltage-gated calcium channels in cardiac myocytes, sinoatrial (SA), and atrioventricular (AV) nodal tissue as well as vascular smooth muscle; exerts prominent negative inotropic, negative chronotropic, and negative dromotropic effects, slowing AV conduction and reducing myocardial contractility.',
    classWideToxicities: [
      'Bradycardia and AV nodal block (contraindicated in 2nd/3rd degree heart block without pacemaker)',
      'Worsening of heart failure with reduced ejection fraction (contraindicated in HFrEF due to negative inotropy)',
      'Constipation (especially verapamil, up to 30-40% from colonic smooth muscle relaxation)',
      'Significant CYP3A4 and P-glycoprotein inhibition (increases digoxin, simvastatin, lovastatin, cyclosporine levels)',
      'Gingival hyperplasia',
    ],
    baselineMonitoring: [
      'Baseline and periodic ECG (PR interval for AV block)',
      'Heart rate (resting bradycardia)',
      'Blood pressure',
      'Liver function tests (extensive hepatic clearance)',
    ],
    memberDrugNames: [
      'Diltiazem',
      'Verapamil',
    ],
    exceptionsByDrug: {
      'Verapamil': [
        'Strongest negative inotropic and dromotropic effect of all CCBs; severe constipation in up to 40% of patients.',
        'Potent inhibitor of CYP3A4 and P-glycoprotein; markedly elevates serum digoxin levels (reduce digoxin dose by 30-50%).',
      ],
      'Diltiazem': [
        'Balanced cardiovascular profile with moderate peripheral vasodilation and moderate AV nodal slowing; preferred over verapamil for rate control in atrial fibrillation due to lower constipation incidence.',
      ],
    },
  },
  {
    className: 'SSRIs',
    therapeuticCategory: '4. Antidepressant',
    universalMoa: 'Selectively inhibit the presynaptic serotonin reuptake transporter (SERT), blocking reuptake of 5-HT into the presynaptic neuron; increases synaptic 5-HT concentrations and downregulates inhibitory 5-HT1A autoreceptors over 2-6 weeks.',
    classWideToxicities: [
      'Sexual dysfunction (anorgasmia, decreased libido, delayed ejaculation; 30-50% incidence)',
      'Gastrointestinal distress (nausea, diarrhea, abdominal cramping; high 5-HT3 receptor stimulation)',
      'Insomnia, agitation, or somnolence',
      'Increased bleeding risk (depletion of platelet serotonin stores, caution with NSAIDs/anticoagulants)',
      'Hyponatremia / Syndrome of Inappropriate Antidiuretic Hormone (SIADH, especially in elderly)',
      'Serotonin Syndrome when combined with other serotonergic agents (MAOIs, linezolid, triptans, tramadol)',
      'Discontinuation syndrome on abrupt cessation (flu-like symptoms, electric shock sensations / brain zaps)',
    ],
    baselineMonitoring: [
      'Screening for bipolar disorder (risk of manic switch)',
      'Suicidality assessment (especially in children, adolescents, and young adults <= 24 years)',
      'Serum sodium in elderly patients or concurrent diuretic use',
      'Baseline and periodic ECG for QTc prolongation (especially citalopram/escitalopram)',
    ],
    classBlackBoxWarnings: [
      'Suicidality in Children, Adolescents, and Young Adults: Antidepressants increased the risk of suicidal thoughts and behaviors in pediatric and young adult patients (<25 years of age) during short-term clinical trials; closely monitor for clinical worsening and emergence of suicidal thoughts.',
    ],
    memberDrugNames: [
      'Sertraline',
      'Fluoxetine',
      'Escitalopram',
      'Citalopram',
      'Paroxetine',
      'Fluvoxamine',
    ],
    exceptionsByDrug: {
      'Fluoxetine': [
        'Longest elimination half-life (~2-4 days; active metabolite norfluoxetine has half-life of 7-16 days); lowest risk of discontinuation syndrome, but requires 5-week washout before starting an MAOI.',
        'Potent inhibitor of CYP2D6 and CYP2C19; activating profile (take in morning).',
      ],
      'Paroxetine': [
        'Most anticholinergic SSRI (dry mouth, constipation, sedation) with strong affinity for muscarinic receptors; highest incidence of sexual dysfunction, weight gain, and severe discontinuation syndrome.',
        'Pregnancy Category D / teratogenic risk (ventricular septal defects in first trimester); potent CYP2D6 inhibitor.',
      ],
      'Sertraline': [
        'Highest rate of gastrointestinal adverse effects ("squirtraline" diarrhea); preferred first-line SSRI in cardiovascular disease and post-MI (SADHART trial) and during breastfeeding.',
      ],
      'Citalopram': [
        'Dose-dependent QTc prolongation; FDA maximum dose capped at 40 mg/day (20 mg/day in patients >60 years, hepatic impairment, or poor CYP2C19 metabolizers).',
      ],
      'Escitalopram': [
        'Pure S-enantiomer of citalopram; highly selective SERT inhibition with lowest propensity for drug interactions, but retains dose-dependent QTc prolongation warning (max 20 mg/day).',
      ],
    },
  },
  {
    className: 'Benzodiazepines',
    therapeuticCategory: '20. Anxiolytics',
    universalMoa: 'Positive allosteric modulators of gamma-aminobutyric acid type A (GABA-A) receptors; bind to the benzodiazepine site at the alpha/gamma subunit interface, increasing channel opening frequency in the presence of GABA; enhances chloride ion influx, producing neuronal membrane hyperpolarization and central nervous system depression.',
    classWideToxicities: [
      'Sedation, somnolence, ataxia, cognitive impairment, and anterograde amnesia',
      'High risk of tolerance, physical dependence, and addiction / misuse',
      'Severe, potentially life-threatening withdrawal syndrome (seizures, delirium tremens, tremors, insomnia, rebound anxiety) upon abrupt cessation',
      'Severe respiratory depression and death, particularly when co-administered with opioids or other CNS depressants',
      'Paradoxical excitation or agitation (especially in elderly and pediatric populations)',
    ],
    baselineMonitoring: [
      'Assessment for substance use disorder / addiction risk prior to initiation',
      'Respiratory status and level of sedation',
      'Periodic evaluation of need for continued therapy (recommend short-term use <= 2-4 weeks)',
    ],
    classBlackBoxWarnings: [
      'Concomitant Use with Opioids: Concomitant use of benzodiazepines and opioids may result in profound sedation, respiratory depression, coma, and death; reserve concomitant prescribing for patients with inadequate alternative treatment options.',
      'Abuse, Misuse, and Addiction: Benzodiazepine use exposes users to risks of abuse, misuse, and addiction, which can lead to overdose or death.',
      'Physical Dependence and Withdrawal Reactions: Continued use may lead to clinically significant physical dependence; abrupt cessation or rapid dose reduction can cause acute withdrawal reactions, including seizures and death.',
    ],
    memberDrugNames: [
      'Lorazepam',
      'Alprazolam',
      'Clonazepam',
      'Diazepam',
      'Temazepam',
      'Chlordiazepoxide',
    ],
    exceptionsByDrug: {
      'Lorazepam': [
        'Undergoes direct hepatic glucuronidation with NO active metabolites and NO CYP450 metabolism; preferred benzodiazepine in elderly and patients with hepatic impairment (one of the "LOT" drugs: Lorazepam, Oxazepam, Temazepam).',
        'Intermediate onset and duration (~10-20 hours half-life); available in oral, IV, and IM formulations.',
      ],
      'Alprazolam': [
        'Rapid oral absorption with fast onset and short half-life (~11 hours); associated with high abuse liability, intense rebound anxiety, and severe inter-dose withdrawal symptoms.',
      ],
      'Clonazepam': [
        'Long half-life (18-50 hours) with slower onset; approved for both seizure disorders (absence seizures, Lennox-Gastaut) and panic disorder; smoother plasma levels reduce rebound anxiety.',
      ],
      'Diazepam': [
        'Extremely lipophilic with rapid CNS entry; extensive hepatic CYP2C19/3A4 metabolism to multiple active metabolites (desmethyldiazepam, temazepam, oxazepam) resulting in prolonged cumulative half-life (>100 hours in elderly).',
      ],
      'Temazepam': [
        'Exclusively utilized as a hypnotic for short-term management of insomnia; cleared by direct glucuronidation without active metabolites ("LOT" drug).',
      ],
    },
  },
  {
    className: 'Opioids',
    therapeuticCategory: '1. Analgesic',
    universalMoa: 'Selective agonists predominantly at mu-opioid receptors (and to a lesser degree kappa and delta receptors) in the central and peripheral nervous system; couples to inhibitory G-proteins (Gi/Go), closing voltage-gated calcium channels on presynaptic neurons (inhibiting glutamate/substance P release) and opening inward-rectifying potassium channels postsynaptically (hyperpolarization).',
    classWideToxicities: [
      'Life-threatening respiratory depression (dose-dependent reduction in brainstem sensitivity to hypercapnia)',
      'Opioid-induced constipation (OIC, tolerance does NOT develop; requires stimulant laxative prophylaxis)',
      'Sedation, dizziness, confusion, and cognitive impairment',
      'Nausea and vomiting (stimulation of chemoreceptor trigger zone)',
      'Pruritus and flushing (non-IgE histamine release)',
      'Miosis (pupillary constriction, tolerance does NOT develop)',
      'Tolerance, physical dependence, and Opioid Use Disorder (OUD)',
      'Opioid-induced hyperalgesia (paradoxical increased pain sensitivity with chronic use)',
    ],
    baselineMonitoring: [
      'Baseline pain score, functional assessment, and opioid risk tool (ORT) / prescription drug monitoring program (PDMP) check',
      'Respiratory rate, oxygen saturation, and level of sedation (especially during initiation and dose escalation)',
      'Bowel habits (proactive bowel regimen required)',
      'Overdose risk assessment and co-prescription of naloxone',
    ],
    classBlackBoxWarnings: [
      'Addiction, Abuse, and Misuse: Opioids expose patients and other users to the risks of opioid addiction, abuse, and misuse, which can lead to overdose and death.',
      'Life-Threatening Respiratory Depression: Serious, life-threatening, or fatal respiratory depression may occur with use of opioids, even when used as recommended.',
      'Accidental Ingestion: Accidental ingestion of even one dose, especially by children, can result in a fatal overdose of opioid.',
      'Neonatal Opioid Withdrawal Syndrome (NOWS): Prolonged use of opioids during pregnancy can result in neonatal opioid withdrawal syndrome.',
      'Concomitant Use with Benzodiazepines or Other CNS Depressants: Concomitant use with benzodiazepines, other CNS depressants, or alcohol may result in profound sedation, respiratory depression, coma, and death.',
    ],
    memberDrugNames: [
      'Morphine ER',
      'Oxycodone',
      'Hydrocodone / Acetaminophen',
      'Fentanyl',
      'Methadone',
      'Tramadol',
      'Buprenorphine / Naloxone',
    ],
    exceptionsByDrug: {
      'Morphine ER': [
        'Prototypical natural phenanthrene opioid; metabolized hepatically to active morphine-6-glucuronide (M6G, analgesia) and neurotoxic morphine-3-glucuronide (M3G, hyperalgesia/myoclonus); both accumulate toxic levels in renal impairment.',
        'Causes significant histamine release resulting in flushing, pruritus, and bronchospasm.',
      ],
      'Oxycodone': [
        'Semisynthetic thebaine derivative; ~1.5x more potent than oral morphine with higher oral bioavailability (~60-87%); metabolized via CYP3A4 and CYP2D6 (to active oxymorphone).',
      ],
      'Fentanyl': [
        'Synthetic anilidopiperidine opioid ~80-100x more potent than morphine; highly lipophilic; transdermal patch is indicated ONLY for opioid-tolerant patients (taking >= 60 mg oral morphine equivalents daily for >= 1 week); heat increases release rate.',
      ],
      'Methadone': [
        'Long and highly variable elimination half-life (15-60+ hours); dual mechanism: mu-agonist and NMDA receptor antagonist + SNRI activity (effective in neuropathic pain); carries high risk of QTc prolongation and fatal Torsades de Pointes.',
      ],
      'Tramadol': [
        'Centrally acting synthetic codeine analog with dual mechanism: weak mu-opioid agonist and norepinephrine/serotonin reuptake inhibitor (SNRI); lowers seizure threshold and poses Serotonin Syndrome risk; prodrug activated by CYP2D6.',
      ],
      'Buprenorphine / Naloxone': [
        'Buprenorphine is a high-affinity partial mu-opioid agonist and kappa antagonist with ceiling effect on respiratory depression; naloxone added (sublingual/buccal) to deter IV misuse (poor sublingual bioavailability of naloxone).',
      ],
    },
  },
  {
    className: 'NSAIDs',
    therapeuticCategory: '26. Nonsteroidal Anti-inflammatory Agent',
    universalMoa: 'Reversibly inhibit cyclooxygenase enzymes 1 and 2 (COX-1 and COX-2), blocking the synthesis of prostaglandins, prostacyclin, and thromboxane from arachidonic acid; reduces inflammatory mediator production, lowers peripheral nociceptor sensitization, and resets hypothalamic thermoregulatory set-point.',
    classWideToxicities: [
      'Gastrointestinal ulceration, perforation, and bleeding (loss of cytoprotective COX-1 prostaglandins PGE2/PGI2)',
      'Cardiovascular thrombotic events (myocardial infarction and stroke; imbalance of platelet TXA2 and endothelial PGI2)',
      'Renal toxicity and acute kidney injury (inhibition of PGE2/PGI2-mediated afferent arteriolar vasodilation; fluid retention, edema, hypertension)',
      'Bronchospasm in aspirin-exacerbated respiratory disease (AERD / Samter triad)',
      'Premature closure of fetal ductus arteriosus (contraindicated in pregnancy >= 20-30 weeks)',
    ],
    baselineMonitoring: [
      'Blood pressure and edema/fluid retention',
      'Serum creatinine / eGFR and BUN (baseline and periodic)',
      'Complete blood count (CBC / hemoglobin for occult GI blood loss)',
      'Liver enzymes',
    ],
    classBlackBoxWarnings: [
      'Cardiovascular Thrombotic Events: Nonsteroidal anti-inflammatory drugs (NSAIDs) cause an increased risk of serious cardiovascular thrombotic events, including myocardial infarction and stroke, which can be fatal. This risk may occur early in treatment and may increase with duration of use.',
      'Gastrointestinal Bleeding, Ulceration, and Perforation: NSAIDs cause an increased risk of serious gastrointestinal (GI) adverse events including bleeding, ulceration, and perforation of the stomach or intestines, which can be fatal; elderly patients and patients with a prior history of peptic ulcer disease and/or GI bleeding are at greater risk.',
    ],
    memberDrugNames: [
      'Ibuprofen',
      'Naproxen',
      'Meloxicam',
      'Diclofenac',
      'Nabumetone',
      'Celecoxib',
      'Indomethacin',
      'Ketorolac',
    ],
    exceptionsByDrug: {
      'Celecoxib': [
        'Selectively inhibits COX-2 with minimal COX-1 inhibition at therapeutic doses, sparing gastroprotective prostaglandins and platelet thromboxane; significantly lower GI ulceration/bleeding risk.',
        'Contains a sulfonamide moiety (caution in severe sulfonamide allergy); highest relative cardiovascular thrombotic risk among outpatient NSAIDs.',
      ],
      'Naproxen': [
        'Longer half-life (~12-17 hours) enabling BID dosing; exhibits the most favorable cardiovascular safety profile among non-selective NSAIDs due to sustained platelet COX-1 inhibition mimicking low-dose aspirin.',
      ],
      'Meloxicam': [
        'Preferentially inhibits COX-2 at low doses (7.5 mg daily), but selectivity is lost at higher anti-inflammatory doses (15 mg daily); once-daily dosing.',
      ],
      'Diclofenac': [
        'Highest rate of hepatotoxicity / transaminase elevations among NSAIDs; available in topical gel formulation (Voltaren) with ~1-2% systemic absorption for targeted osteoarthritis relief with lower systemic toxicity.',
      ],
      'Ketorolac': [
        'Extremely potent analgesic with severe GI ulceration and renal toxicity; STRICTLY LIMITED to a maximum combined total of 5 consecutive days across all formulations (IV, IM, oral).',
      ],
    },
  },
  {
    className: 'Fluoroquinolones',
    therapeuticCategory: '2. Antibiotic',
    universalMoa: 'Inhibit bacterial DNA topoisomerase II (DNA gyrase) and topoisomerase IV, blocking the resealing of DNA double-strand breaks during replication and transcription; causes rapid, concentration-dependent bacterial DNA fragmentation and bactericidal cell death.',
    classWideToxicities: [
      'Tendinitis and tendon rupture (most frequently Achilles tendon, risk increased in elderly, renal failure, and concurrent corticosteroids)',
      'Peripheral neuropathy (potentially permanent sensory or sensorimotor axonal polyneuropathy)',
      'Central nervous system toxicities (toxic psychosis, seizures, hallucinations, tremor, severe confusion)',
      'QTc interval prolongation and risk of Torsades de Pointes (greatest with moxifloxacin)',
      'Aortic aneurysm and dissection (structural disruption of vascular collagen)',
      'Dysglycemia (both severe hypoglycemia and hyperglycemia in diabetics)',
      'Phototoxicity and Clostridioides difficile colitis',
    ],
    baselineMonitoring: [
      'Renal function (eGFR/serum creatinine for dose adjustments)',
      'ECG monitoring for baseline QTc in patients with cardiac risk factors or concurrent QT-prolonging drugs',
      'Blood glucose in patients on insulin or oral antidiabetic agents',
    ],
    classBlackBoxWarnings: [
      'Tendinitis and Tendon Rupture: Fluoroquinolones are associated with an increased risk of tendinitis and tendon rupture in all ages; risk further elevated in patients >60 years, kidney/heart/lung transplant recipients, and concurrent corticosteroid therapy.',
      'Peripheral Neuropathy: Associated with an increased risk of peripheral neuropathy that may occur rapidly and become irreversible.',
      'Central Nervous System Effects: Can trigger severe CNS adverse effects including convulsions, depression, anxiety, agitation, paranoia, hallucinations, and suicidal thoughts.',
      'Exacerbation of Myasthenia Gravis: May exacerbate muscle weakness in patients with myasthenia gravis and should be avoided.',
    ],
    memberDrugNames: [
      'Ciprofloxacin',
      'Levofloxacin',
      'Moxifloxacin',
      'Ofloxacin',
    ],
    exceptionsByDrug: {
      'Ciprofloxacin': [
        'Most potent fluoroquinolone against Pseudomonas aeruginosa; poor Streptococcus pneumoniae / atypical coverage (NOT a "respiratory fluoroquinolone").',
        'Strong inhibitor of hepatic CYP1A2 (markedly increases theophylline, tizanidine, and duloxetine levels).',
        'Chelates multivalent cations (calcium, iron, magnesium, aluminum, sucralfate); separate administration by at least 2 hours before or 6 hours after cations.',
      ],
      'Levofloxacin': [
        'Pure L-isomer of ofloxacin; balanced spectrum providing excellent coverage against Streptococcus pneumoniae, atypicals, Enterobacteriaceae, and Pseudomonas aeruginosa ("respiratory fluoroquinolone").',
        'Eliminated >80% unchanged via urine; requires substantial renal dose adjustment.',
      ],
      'Moxifloxacin': [
        'Enhanced gram-positive, atypical, and anaerobic coverage, but lacks activity against Pseudomonas aeruginosa.',
        'Extensively metabolized hepatically and eliminated via biliary/fecal excretion; achieves negligible urinary concentrations and is STRICTLY INEFFECTIVE for treating urinary tract infections (cystitis/pyelonephritis); does NOT require renal dose adjustment.',
        'Carries the highest risk of QTc prolongation among fluoroquinolones.',
      ],
    },
  },
  {
    className: 'Penicillins',
    therapeuticCategory: '2. Antibiotic',
    universalMoa: 'Bactericidal beta-lactam antibiotics; bind irreversibly to bacterial penicillin-binding proteins (PBPs, particularly transpeptidases) located on the inner bacterial cell wall membrane; inhibits the final cross-linking step of peptidoglycan synthesis and triggers autolytic enzyme activation, leading to cell wall lysis.',
    classWideToxicities: [
      'Type I hypersensitivity / IgE-mediated anaphylaxis, urticaria, angioedema (~0.01-0.05%)',
      'Gastrointestinal upset, nausea, vomiting, and antibiotic-associated diarrhea',
      'Clostridioides difficile colitis',
      'Maculopapular morbilliform rash (non-allergic, especially with aminopenicillins in Epstein-Barr virus / infectious mononucleosis)',
      'Interstitial nephritis (acute allergic interstitial nephritis)',
      'Neurotoxicity and seizures at very high systemic doses or unadjusted renal failure',
    ],
    baselineMonitoring: [
      'Allergy history and hypersensitivity signs',
      'Renal function (eGFR/serum creatinine)',
      'CBC and hepatic panel with prolonged courses',
    ],
    memberDrugNames: [
      'Penicillin VK',
      'Amoxicillin',
      'Amoxicillin / Potassium Clavulanate',
      'Ampicillin',
      'Piperacillin / Tazobactam',
    ],
    exceptionsByDrug: {
      'Penicillin VK': [
        'Natural acid-stable oral penicillin; narrow spectrum primarily targeting Streptococcus pyogenes (Group A Strep), Streptococcus pneumoniae, and Treponema pallidum; drug of choice for streptococcal pharyngitis.',
        'Oral absorption reduced by food; administer on an empty stomach (1 hour before or 2 hours after meals).',
      ],
      'Amoxicillin': [
        'Aminopenicillin with enhanced outer-membrane penetration against gram-negative bacilli (H. influenzae, E. coli, Proteus mirabilis); oral bioavailability is superior (~75-90%) and unaffected by food.',
        'High dose (80-90 mg/kg/day in children) overcomes intermediate penicillin-resistant Streptococcus pneumoniae in acute otitis media.',
      ],
      'Amoxicillin / Potassium Clavulanate': [
        'Potassium clavulanate is a suicide beta-lactamase inhibitor that restores and broadens amoxicillin coverage to include beta-lactamase-producing MSSA, H. influenzae, Moraxella catarrhalis, and Bacteroides fragilis.',
        'Significantly higher incidence of gastrointestinal hypermotility and diarrhea due to clavulanic acid; should be taken at the start of a meal to optimize absorption and minimize GI upset.',
      ],
    },
  },
  {
    className: 'Cephalosporins',
    therapeuticCategory: '2. Antibiotic',
    universalMoa: 'Bactericidal beta-lactam antibiotics containing a dihydrothiazine ring; structurally inhibit bacterial penicillin-binding proteins (PBPs), disrupting peptidoglycan cross-linking and cell wall integrity; divided into generations with progressive shift from predominantly gram-positive (1st gen) to broad gram-negative and CNS penetration (3rd/4th gen).',
    classWideToxicities: [
      'Hypersensitivity reactions / rash (cross-reactivity with penicillins is low, ~1-2%, primarily associated with shared R1 side chains)',
      'Gastrointestinal distress and diarrhea',
      'Clostridioides difficile-associated diarrhea (high risk with 2nd and 3rd generations)',
      'Positive direct Coombs test / rare immune-mediated hemolytic anemia',
      'Biliary sludging (especially ceftriaxone in neonates/infants)',
    ],
    baselineMonitoring: [
      'Allergy / penicillin cross-reactivity assessment',
      'Renal function (BUN/serum creatinine)',
      'CBC with differential during prolonged therapy',
    ],
    memberDrugNames: [
      'Cephalexin',
      'Cefuroxime',
      'Cefdinir',
      'Cefadroxil',
      'Ceftriaxone',
    ],
    exceptionsByDrug: {
      'Cephalexin': [
        'First-generation oral cephalosporin with potent activity against methicillin-susceptible Staphylococcus aureus (MSSA) and Streptococcus; first-line outpatient oral agent for uncomplicated skin/soft tissue infections.',
        'Rapidly eliminated renally via glomerular filtration and tubular secretion; requires Q6H or Q8H dosing.',
      ],
      'Cefuroxime': [
        'Second-generation cephalosporin with enhanced stability against beta-lactamases and expanded activity against respiratory pathogens (H. influenzae, M. catarrhalis) and Borrelia burgdorferi (Lyme disease).',
        'Cefuroxime axetil prodrug tablet absorption is significantly enhanced when administered with food.',
      ],
      'Cefdinir': [
        'Third-generation oral cephalosporin with broad gram-negative and respiratory spectrum; forms an insoluble nonabsorbable chelate complex with iron in the gut, causing reddish/rust-colored stools ("red stool" phenomenon) that can alarm patients.',
      ],
    },
  },
  {
    className: 'SGLT2 Inhibitors',
    therapeuticCategory: '5. Antidiabetic Agent --- Oral',
    universalMoa: 'Selectively inhibit the sodium-glucose co-transporter 2 (SGLT2) in the S1 segment of the renal proximal convoluted tubule, blocking ~90% of renal glucose reabsorption; promotes urinary glucose excretion (glycosuria ~50-80 g/day), lowering plasma glucose independently of insulin, and induces mild osmotic diuresis and natriuresis.',
    classWideToxicities: [
      'Genital mycotic infections (vulvovaginal candidiasis, balanitis; 5-10% incidence)',
      'Euglycemic diabetic ketoacidosis (euDKA; blood glucose < 250 mg/dL with metabolic acidosis and ketosis, triggered by acute illness/surgery/carbohydrate restriction)',
      'Volume depletion, orthostatic hypotension, and dehydration',
      'Urinary tract infections and rare Fournier gangrene (necrotizing fasciitis of the perineum)',
      'Transient acute decrease in eGFR upon initiation (hemodynamic, followed by long-term renal preservation)',
    ],
    baselineMonitoring: [
      'Baseline and periodic renal function (eGFR/serum creatinine)',
      'Volume status and blood pressure (especially if on loop diuretics)',
      'Lipid panel (can cause mild increase in LDL-C)',
      'Foot examination for skin integrity / ulceration',
    ],
    memberDrugNames: [
      'Canagliflozin',
      'Empagliflozin',
      'Dapagliflozin',
      'Ertugliflozin',
    ],
    exceptionsByDrug: {
      'Canagliflozin': [
        'Initially carried a black box warning for increased risk of lower limb (toe and midfoot) amputations (CANVAS trial; removed by FDA in 2020, but monitoring remains critical).',
        'Dual weak SGLT1 inhibition in the intestinal brush border at the 300 mg dose, slowing postprandial intestinal glucose absorption.',
        'Landmark renal protection in type 2 diabetic nephropathy (CREDENCE trial).',
      ],
      'Empagliflozin': [
        'Highest SGLT2 selectivity (>2500-fold over SGLT1); landmark trial evidence for cardiovascular death reduction (EMPA-REG OUTCOME) and HFrEF/HFpEF heart failure hospitalization reduction (EMPEROR-Reduced / EMPEROR-Preserved).',
      ],
      'Dapagliflozin': [
        'Landmark indications for heart failure across all ejection fractions (DAPA-HF) and chronic kidney disease progression reduction (DAPA-CKD) regardless of diabetic status.',
      ],
    },
  },
  {
    className: 'GLP-1 Agonists',
    therapeuticCategory: '6. Antidiabetic Agent --- Injectable/Insulin Product',
    universalMoa: 'Synthetic agonists that bind to and activate the glucagon-like peptide-1 (GLP-1) receptor; stimulates glucose-dependent insulin secretion from pancreatic beta cells, suppresses inappropriately elevated glucagon secretion from alpha cells, slows gastric emptying, and centrally promotes satiety in the hypothalamic appetite center.',
    classWideToxicities: [
      'Gastrointestinal adverse effects (nausea, vomiting, diarrhea, constipation; prominent during dose titration, mitigated by slow escalation)',
      'Acute pancreatitis (persistent severe abdominal pain radiating to back)',
      'Gallbladder disease (cholelithiasis, cholecystitis from rapid weight loss and reduced gallbladder motility)',
      'Risk of hypoglycemia when combined with insulin secretagogues (sulfonylureas) or exogenous insulin',
      'Injection site reactions (for subcutaneous formulations)',
    ],
    baselineMonitoring: [
      'Fasting plasma glucose and HbA1c',
      'Personal or family history of medullary thyroid carcinoma or Multiple Endocrine Neoplasia syndrome type 2 (MEN 2)',
      'Renal function in patients reporting severe gastrointestinal fluid loss',
      'Signs/symptoms of pancreatitis and gallbladder disease',
    ],
    classBlackBoxWarnings: [
      'Thyroid C-Cell Tumors: In rodents, GLP-1 receptor agonists cause dose-dependent and treatment-duration-dependent thyroid C-cell tumors at clinically relevant exposures; contraindicated in patients with a personal or family history of medullary thyroid carcinoma (MTC) or in patients with Multiple Endocrine Neoplasia syndrome type 2 (MEN 2).',
    ],
    memberDrugNames: [
      'Semaglutide',
      'Liraglutide',
      'Dulaglutide',
      'Exenatide',
      'Tirzepatide',
    ],
    exceptionsByDrug: {
      'Semaglutide': [
        'Engineered with a C18 fatty diacid chain binding human albumin, conferring a prolonged half-life of ~1 week; administered once weekly subcutaneously (Ozempic/Wegovy) or once daily orally (Rybelsus).',
        'Oral formulation (Rybelsus) requires co-formulation with SNAC absorption enhancer; must be taken upon waking with <= 4 oz of plain water at least 30 minutes before any food, beverage, or other medications.',
      ],
      'Liraglutide': [
        'Daily subcutaneous administration (Victoza for diabetes, Saxenda for chronic weight management); established landmark MACE reduction in high-risk cardiovascular patients (LEADER trial).',
      ],
      'Dulaglutide': [
        'Fc-fusion protein administered once weekly via single-dose pre-attached hidden needle autoinjector pen (Trulicity); landmark cardiovascular benefit proven in REWIND trial.',
      ],
      'Tirzepatide': [
        'First-in-class dual glucose-dependent insulinotropic polypeptide (GIP) and GLP-1 receptor agonist; produces superior glycemic control and weight reduction compared to selective GLP-1 agonists.',
      ],
    },
  },
  {
    className: 'PPIs',
    therapeuticCategory: '21. Gastrointestinal Agent',
    universalMoa: 'Substituted benzimidazole prodrugs that accumulate in the acidic secretory canaliculi of gastric parietal cells; protonated into active sulfenamide intermediates that bind covalently via disulfide bonds to the cysteine residues of the H+/K+-ATPase enzyme ("proton pump"); permanently inactivates the final common pathway of gastric acid secretion.',
    classWideToxicities: [
      'Increased susceptibility to Clostridioides difficile infection and community-acquired pneumonia (suppression of gastric acid barrier)',
      'Impaired mineral and vitamin absorption with chronic use: hypomagnesemia, decreased calcium absorption / increased fracture risk (osteoporosis), and vitamin B12 deficiency',
      'Acute interstitial nephritis (AIN) and chronic kidney disease (CKD)',
      'Rebound acid hypersecretion upon abrupt discontinuation (due to hypergastrinemia)',
      'Enteric infections (Salmonella, Campylobacter)',
    ],
    baselineMonitoring: [
      'Serum magnesium levels (prior to initiation and periodically with prolonged therapy)',
      'Bone mineral density in high-risk osteoporosis patients',
      'Vitamin B12 levels during long-term maintenance (>1-2 years)',
      'Renal function if interstitial nephritis suspected',
    ],
    memberDrugNames: [
      'Omeprazole',
      'Pantoprazole',
      'Esomeprazole',
      'Lansoprazole',
      'Rabeprazole',
      'Dexlansoprazole',
    ],
    exceptionsByDrug: {
      'Omeprazole': [
        'Potent competitive inhibitor of CYP2C19; significantly impairs bioactivation of clopidogrel (Plavix) to its active antiplatelet metabolite, potentially increasing cardiovascular stent thrombosis risk.',
        'Must be administered 30-60 minutes before the first meal of the day (breakfast) for maximal proton pump inhibition during active feeding.',
      ],
      'Pantoprazole': [
        'Weakest affinity for CYP2C19 among all PPIs; preferred PPI of choice when co-prescribed with clopidogrel to avoid antiplatelet attenuation.',
        'Available in both oral tablet/suspension and IV formulations for acute upper GI bleeding.',
      ],
      'Esomeprazole': [
        'Pure S-isomer of omeprazole; exhibits lower first-pass hepatic clearance and higher AUC/bioavailability compared to racemic omeprazole; retains CYP2C19 clopidogrel interaction.',
      ],
      'Dexlansoprazole': [
        'Features a dual delayed-release (DDR) technology with two distinct enteric release peaks (1-2 hours and 4-5 hours); can be taken without regard to food or meal timing.',
      ],
    },
  },
  {
    className: 'Corticosteroids',
    therapeuticCategory: '25. Immunosuppressant Agent',
    universalMoa: 'Lipophilic glucocorticoids that cross cell membranes to bind intracellular glucocorticoid receptors (GR); translocates to nucleus to transactivate anti-inflammatory genes and transrepress pro-inflammatory transcription factors (NF-kappa-B, AP-1); suppresses synthesis of cytokines (IL-1, IL-2, IL-6, TNF-alpha), chemokines, cell adhesion molecules, and COX-2.',
    classWideToxicities: [
      'Hypothalamic-Pituitary-Adrenal (HPA) axis suppression and secondary adrenal crisis upon abrupt discontinuation (courses > 2-3 weeks require gradual tapering)',
      'Hyperglycemia / steroid-induced diabetes mellitus (increased gluconeogenesis and peripheral insulin resistance)',
      'Immunosuppression and heightened infection risk',
      'Fluid retention, sodium retention, hypokalemia, and hypertension (mineralocorticoid activity)',
      'Osteoporosis, osteonecrosis / avascular necrosis of the femoral head',
      'Cushingoid features: moon facies, buffalo hump, central adiposity, skin thinning/striae',
      'Psychiatric disturbances: insomnia, mood lability, euphoria, anxiety, steroid psychosis',
      'Ocular complications: posterior subcapsular cataracts, elevated intraocular pressure / glaucoma',
    ],
    baselineMonitoring: [
      'Blood glucose / HbA1c',
      'Blood pressure and weight/edema',
      'Bone mineral density (DEXA) for chronic use (>3 months)',
      'Ophthalmic examination (intraocular pressure / cataracts) with long-term therapy',
      'Screening for latent tuberculosis or strongyloidiasis before high-dose therapy',
    ],
    memberDrugNames: [
      'Prednisone',
      'Prednisolone Oral',
      'Methylprednisolone',
      'Dexamethasone',
      'Hydrocortisone',
      'Budesonide',
    ],
    exceptionsByDrug: {
      'Prednisone': [
        'Inactive prodrug that requires hepatic 11-beta-hydroxysteroid dehydrogenase type 1 reduction to active prednisolone; impaired bioactivation in severe hepatic cirrhosis/failure.',
        'Possesses mild mineralocorticoid activity (salt-retaining); standard oral glucocorticoid for outpatient burst therapies.',
      ],
      'Prednisolone Oral': [
        'Active form of prednisone; drug of choice in children (liquid formulation) and patients with severe hepatic impairment who cannot convert prednisone efficiently.',
      ],
      'Methylprednisolone': [
        'C-6 methylation confers higher glucocorticoid potency (~5x hydrocortisone vs 4x for prednisone) with minimal mineralocorticoid (salt-retaining) activity; commonly dispensed as 6-day dose pack (Medrol Dosepak) with built-in tapering.',
      ],
      'Dexamethasone': [
        'Extremely potent long-acting glucocorticoid (~25-30x hydrocortisone) with ZERO mineralocorticoid activity; long biological half-life (36-54 hours); preferred for cerebral edema and antiemesis in chemotherapy.',
      ],
      'Budesonide': [
        'Extensive first-pass hepatic metabolism (~90%) when administered orally (Entocort EC / Uceris); targets ileal and colonic Crohn disease / ulcerative colitis with minimal systemic corticosteroid toxicity.',
      ],
    },
  },
  {
    className: 'Thiazides',
    therapeuticCategory: '11. Cardiovascular --- Antihypertensive',
    universalMoa: 'Inhibit the sodium-chloride cotransporter (NCCT) in the luminal membrane of the early distal convoluted tubule; blocks reabsorption of 3-5% of filtered sodium and chloride, promoting mild natriuresis and diuresis; chronic antihypertensive efficacy is driven by sustained peripheral vascular resistance reduction.',
    classWideToxicities: [
      'Hypokalemia and hypomagnesemia (increased distal tubular sodium delivery enhancing K+/H+ excretion)',
      'Hyponatremia (dilutional, impaired free water excretion)',
      'Hyperuricemia and acute gout flares (competition for organic acid secretory transporter in proximal tubule)',
      'Hypercalcemia (enhanced passive paracellular calcium reabsorption in proximal and distal tubule)',
      'Hyperglycemia and dyslipidemia (impaired insulin release from beta cells linked to hypokalemia)',
      'Photosensitivity and sulfonamide hypersensitivity cross-reactivity',
    ],
    baselineMonitoring: [
      'Serum electrolytes (sodium, potassium, magnesium)',
      'BUN and serum creatinine (eGFR; reduced efficacy when eGFR < 30 mL/min)',
      'Serum uric acid (history of gout)',
      'Fasting blood glucose in diabetics',
    ],
    memberDrugNames: [
      'Hydrochlorothiazide',
      'Chlorthalidone',
      'Metolazone',
      'Indapamide',
      'Triamterene / Hydrochlorothiazide',
    ],
    exceptionsByDrug: {
      'Hydrochlorothiazide': [
        'Most widely prescribed thiazide and common component of fixed-dose combination antihypertensive tablets; short elimination half-life (~6-12 hours) providing less 24-hour BP control than chlorthalidone.',
        'Substantially diminished diuretic and antihypertensive efficacy when eGFR drops below 30 mL/min.',
      ],
      'Chlorthalidone': [
        'Thiazide-like diuretic with prolonged terminal half-life (40-60 hours) due to extensive binding to red blood cell carbonic anhydrase; ~1.5-2x more potent than HCTZ with proven landmark cardiovascular morbidity/mortality reduction (ALLHAT trial); higher risk of hypokalemia.',
      ],
      'Metolazone': [
        'Quinazoline thiazide-like diuretic that maintains efficacy even in severe renal impairment (eGFR < 30 mL/min); frequently combined with loop diuretics (e.g., furosemide) for sequential nephron blockade to overcome diuretic resistance in refractory decompensated heart failure.',
      ],
      'Triamterene / Hydrochlorothiazide': [
        'Combination with epithelial sodium channel (ENaC) blocker triamterene to offset thiazide-induced hypokalemia; carries a black box warning for hyperkalemia, particularly in renal impairment or elderly patients.',
      ],
    },
  },
  {
    className: 'Loop Diuretics',
    therapeuticCategory: '11. Cardiovascular --- Antihypertensive',
    universalMoa: 'Inhibit the luminal Na+/K+/2Cl- (NKCC2) symporter in the thick ascending limb of the loop of Henle; prevents reabsorption of 20-25% of filtered sodium load; abolishes the hypertonic medullary interstitial gradient, generating profound natriuresis, chloruresis, and water diuresis.',
    classWideToxicities: [
      'Severe hypokalemia, hypomagnesemia, and hypochloremic metabolic alkalosis',
      'Profound volume depletion, dehydration, and prerenal azotemia / acute kidney injury',
      'Ototoxicity (tinnitus, hearing loss, vertigo; exacerbated by rapid IV infusion or concurrent aminoglycosides)',
      'Hyperuricemia and gout exacerbation',
      'Hypocalcemia (unlike thiazides, loops increase urinary calcium excretion: "loops lose calcium")',
      'Sulfonamide hypersensitivity cross-reactivity (ethacrynic acid is non-sulfa alternative)',
    ],
    baselineMonitoring: [
      'Serum electrolytes (potassium, sodium, chloride, magnesium)',
      'BUN and serum creatinine (volume contraction vs acute tubular injury)',
      'Daily body weight and fluid intake/output',
      'Blood pressure and orthostasis',
    ],
    classBlackBoxWarnings: [
      'Fluid and Electrolyte Depletion: Loop diuretics are potent diuretics that, if given in excessive amounts, can lead to a profound diuresis with water and electrolyte depletion; careful medical supervision is required and dose schedule must be adjusted to individual patient needs.',
    ],
    memberDrugNames: [
      'Furosemide',
      'Torsemide',
      'Bumetanide',
      'Ethacrynic Acid',
    ],
    exceptionsByDrug: {
      'Furosemide': [
        'Erratic and highly variable oral bioavailability (10-90%, ~50% average); presence of food significantly delays absorption and reduces peak diuretic effect; oral-to-IV dose ratio is approximately 2:1 (40 mg PO = 20 mg IV).',
        'Short duration of diuretic action ("six hours" - furosemide / Lasix); requires BID dosing in volume-overloaded chronic heart failure.',
      ],
      'Torsemide': [
        'High and predictable oral bioavailability (~80-100%) unaffected by food or bowel wall edema in heart failure; longer duration of action (~12-16 hours); oral-to-IV dose ratio is 1:1; approximately 2-4x more potent than furosemide (20 mg torsemide ~= 40 mg oral furosemide).',
      ],
      'Bumetanide': [
        'Extremely potent loop diuretic (~40x more potent than furosemide: 1 mg bumetanide ~= 40 mg oral furosemide); high oral bioavailability (~80-90%); oral-to-IV conversion is 1:1.',
      ],
      'Ethacrynic Acid': [
        'Phenoxyacetic acid derivative containing NO sulfonamide moiety; sole loop diuretic safe for patients with severe, true IgE-mediated sulfonamide allergy; highest propensity for ototoxicity among loop diuretics.',
      ],
    },
  },
];

// Helper to normalize drug strings (strip salts, formulations, and punctuation)
function normalizeDrugString(str: string): string {
  return str
    .toLowerCase()
    .replace(/\b(calcium|potassium|sodium|succinate|tartrate|hcl|hydrochloride|maleate|mesylate|besylate|phosphate|nitrate|sulfate|acetate|valerate|dipropionate|propionate|trihydrate|dihydrate|monohydrate|fumarate|gluconate|axetil|potassium clavulanate|clavulanate)\b/gi, '')
    .replace(/\b(extended release|oral inhaler|nasal inhaler|topical|oral|er|xr|xl|sr|cr|dr|ec)\b/gi, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Aliases mapping for getClassProfileByName
const CLASS_NAME_ALIAS_MAP: Record<string, string> = {
  'statin': 'Statins',
  'statins': 'Statins',
  'hmg coa reductase inhibitor': 'Statins',
  'hmg coa reductase inhibitors': 'Statins',
  'ace inhibitor': 'ACE Inhibitors',
  'ace inhibitors': 'ACE Inhibitors',
  'arb': 'ARBs',
  'arbs': 'ARBs',
  'beta blocker': 'Beta-Blockers',
  'beta blockers': 'Beta-Blockers',
  'ccb': 'Dihydropyridine CCBs',
  'ccbs': 'Dihydropyridine CCBs',
  'calcium channel blocker': 'Dihydropyridine CCBs',
  'calcium channel blockers': 'Dihydropyridine CCBs',
  'dhp ccb': 'Dihydropyridine CCBs',
  'dhp ccbs': 'Dihydropyridine CCBs',
  'dihydropyridine ccb': 'Dihydropyridine CCBs',
  'dihydropyridine ccbs': 'Dihydropyridine CCBs',
  'dihydropyridine calcium channel blocker': 'Dihydropyridine CCBs',
  'dihydropyridine calcium channel blockers': 'Dihydropyridine CCBs',
  'non dhp ccb': 'Non-Dihydropyridine CCBs',
  'non dhp ccbs': 'Non-Dihydropyridine CCBs',
  'non dihydropyridine ccb': 'Non-Dihydropyridine CCBs',
  'non dihydropyridine ccbs': 'Non-Dihydropyridine CCBs',
  'non dihydropyridine calcium channel blocker': 'Non-Dihydropyridine CCBs',
  'non dihydropyridine calcium channel blockers': 'Non-Dihydropyridine CCBs',
  'ssri': 'SSRIs',
  'ssris': 'SSRIs',
  'benzodiazepine': 'Benzodiazepines',
  'benzodiazepines': 'Benzodiazepines',
  'benzo': 'Benzodiazepines',
  'benzos': 'Benzodiazepines',
  'opioid': 'Opioids',
  'opioids': 'Opioids',
  'nsaid': 'NSAIDs',
  'nsaids': 'NSAIDs',
  'fluoroquinolone': 'Fluoroquinolones',
  'fluoroquinolones': 'Fluoroquinolones',
  'penicillin': 'Penicillins',
  'penicillins': 'Penicillins',
  'cephalosporin': 'Cephalosporins',
  'cephalosporins': 'Cephalosporins',
  'sglt2 inhibitor': 'SGLT2 Inhibitors',
  'sglt2 inhibitors': 'SGLT2 Inhibitors',
  'sglt2': 'SGLT2 Inhibitors',
  'glp 1': 'GLP-1 Agonists',
  'glp 1 agonist': 'GLP-1 Agonists',
  'glp 1 agonists': 'GLP-1 Agonists',
  'glp 1 receptor agonist': 'GLP-1 Agonists',
  'glp 1 receptor agonists': 'GLP-1 Agonists',
  'ppi': 'PPIs',
  'ppis': 'PPIs',
  'proton pump inhibitor': 'PPIs',
  'proton pump inhibitors': 'PPIs',
  'corticosteroid': 'Corticosteroids',
  'corticosteroids': 'Corticosteroids',
  'steroid': 'Corticosteroids',
  'steroids': 'Corticosteroids',
  'thiazide': 'Thiazides',
  'thiazides': 'Thiazides',
  'thiazide diuretic': 'Thiazides',
  'thiazide diuretics': 'Thiazides',
  'loop diuretic': 'Loop Diuretics',
  'loop diuretics': 'Loop Diuretics',
  'loop': 'Loop Diuretics',
};

/**
 * Returns the exact TopDrugClassProfile matching className or common alias.
 */
export function getClassProfileByName(className: string): TopDrugClassProfile | null {
  if (!className || typeof className !== 'string') {
    return null;
  }
  const cleanInput = className.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. Direct match on profile.className
  for (const profile of CLASS_PROFILES) {
    const cleanProfileName = profile.className.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleanProfileName === cleanInput) {
      return profile;
    }
  }

  // 2. Alias resolution
  const mappedCanonical = CLASS_NAME_ALIAS_MAP[cleanInput];
  if (mappedCanonical) {
    const match = CLASS_PROFILES.find((p) => p.className === mappedCanonical);
    if (match) {
      return match;
    }
  }

  // 3. Partial / word boundary match
  for (const profile of CLASS_PROFILES) {
    const cleanProfileName = profile.className.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
    if (cleanProfileName.includes(cleanInput) || cleanInput.includes(cleanProfileName)) {
      return profile;
    }
  }

  return null;
}

/**
 * Resolves a TopDrugClassProfile for a given drug name.
 * Handles case-insensitivity, whitespace, and salt variations.
 */
export function resolveClassProfileForDrug(drugName: string): TopDrugClassProfile | null {
  if (!drugName || typeof drugName !== 'string') {
    return null;
  }

  const normalizedInput = normalizeDrugString(drugName);
  const rawLower = drugName.toLowerCase().trim();

  // Special-case distinction for DHP vs Non-DHP CCB member drugs
  const nonDhpMembers = ['verapamil', 'diltiazem'];
  if (nonDhpMembers.some((m) => rawLower.includes(m) || normalizedInput.includes(m))) {
    return getClassProfileByName('Non-Dihydropyridine CCBs');
  }

  // 1. Search directly across CLASS_PROFILES memberDrugNames and exceptionsByDrug keys
  for (const profile of CLASS_PROFILES) {
    // Check memberDrugNames
    for (const member of profile.memberDrugNames) {
      const normMember = normalizeDrugString(member);
      const memberLower = member.toLowerCase();
      if (
        rawLower === memberLower ||
        normalizedInput === normMember ||
        (normMember.length >= 4 && (normalizedInput.includes(normMember) || normMember.includes(normalizedInput)))
      ) {
        return profile;
      }
    }

    // Check exceptionsByDrug keys
    for (const key of Object.keys(profile.exceptionsByDrug)) {
      const normKey = normalizeDrugString(key);
      const keyLower = key.toLowerCase();
      if (
        rawLower === keyLower ||
        normalizedInput === normKey ||
        (normKey.length >= 4 && (normalizedInput.includes(normKey) || normKey.includes(normalizedInput)))
      ) {
        return profile;
      }
    }
  }

  // 2. Fallback: Consult master TOP_DRUGS_TAXONOMY
  const matchedTaxonomyEntry: TopDrugEntry | undefined = TOP_DRUGS_TAXONOMY.find((entry) => {
    const normEntry = normalizeDrugString(entry.genericName);
    const entryLower = entry.genericName.toLowerCase();
    return (
      rawLower === entryLower ||
      normalizedInput === normEntry ||
      (normEntry.length >= 4 && (normalizedInput.includes(normEntry) || normEntry.includes(normalizedInput)))
    );
  });

  if (matchedTaxonomyEntry) {
    const broad = matchedTaxonomyEntry.broadPharmacologicClass;
    const specific = matchedTaxonomyEntry.specificPharmacologicClass;

    if (broad === 'HMG-CoA Reductase Inhibitor') return getClassProfileByName('Statins');
    if (broad === 'ACE Inhibitor') return getClassProfileByName('ACE Inhibitors');
    if (broad === 'ARB') return getClassProfileByName('ARBs');
    if (broad === 'Beta-Blocker') return getClassProfileByName('Beta-Blockers');
    if (broad === 'Calcium Channel Blocker') {
      if (specific.toLowerCase().includes('non-dihydropyridine') || nonDhpMembers.some((m) => rawLower.includes(m))) {
        return getClassProfileByName('Non-Dihydropyridine CCBs');
      }
      return getClassProfileByName('Dihydropyridine CCBs');
    }
    if (broad === 'SSRI') return getClassProfileByName('SSRIs');
    if (broad === 'Benzodiazepine') return getClassProfileByName('Benzodiazepines');
    if (broad === 'Opioid') return getClassProfileByName('Opioid');
    if (broad === 'NSAID') return getClassProfileByName('NSAIDs');
    if (broad === 'Fluoroquinolone') return getClassProfileByName('Fluoroquinolones');
    if (broad === 'Penicillin') return getClassProfileByName('Penicillins');
    if (broad === 'Cephalosporin') return getClassProfileByName('Cephalosporins');
    if (broad === 'SGLT2 Inhibitor') return getClassProfileByName('SGLT2 Inhibitors');
    if (broad === 'GLP-1 Receptor Agonist' || broad.includes('GLP-1')) return getClassProfileByName('GLP-1 Agonists');
    if (broad === 'Proton Pump Inhibitor') return getClassProfileByName('PPIs');
    if (broad === 'Corticosteroid' || specific.toLowerCase().includes('corticosteroid')) return getClassProfileByName('Corticosteroids');
    if (broad === 'Diuretic') {
      if (specific.toLowerCase().includes('loop')) return getClassProfileByName('Loop Diuretics');
      if (specific.toLowerCase().includes('thiazide')) return getClassProfileByName('Thiazides');
    }
  }

  return null;
}

/**
 * Extracts specific high-yield bullet points for a member drug.
 * Returns an empty array for baseline members without unique exceptions or unknown drugs.
 */
export function getDrugExceptions(drugName: string): string[] {
  if (!drugName || typeof drugName !== 'string') {
    return [];
  }

  const profile = resolveClassProfileForDrug(drugName);
  if (!profile) {
    return [];
  }

  const rawLower = drugName.toLowerCase().trim();
  const normalizedInput = normalizeDrugString(drugName);

  // 1. Direct or normalized match in exceptionsByDrug
  for (const [key, exceptions] of Object.entries(profile.exceptionsByDrug)) {
    const keyLower = key.toLowerCase();
    const normKey = normalizeDrugString(key);

    if (
      rawLower === keyLower ||
      normalizedInput === normKey ||
      rawLower.includes(keyLower) ||
      keyLower.includes(rawLower) ||
      (normKey.length >= 4 && (normalizedInput.includes(normKey) || normKey.includes(normalizedInput)))
    ) {
      return exceptions;
    }
  }

  return [];
}
