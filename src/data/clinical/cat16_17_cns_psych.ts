import type { TopDrugClinicalMonograph } from './types.js';

export const CAT16_17_CNS_PSYCH: Record<string, TopDrugClinicalMonograph> = {
  Pramipexole: {
    genericName: 'Pramipexole',
    brandNames: ['Mirapex', 'Mirapex ER'],
    pharmacologicClass: 'Non-Ergot Dopamine Agonist',
    therapeuticClass: 'Anti-Parkinson\'s Agent',
    mechanismOfAction:
      'Direct, non-ergot dopamine agonist with high relative in vitro intrinsic activity and full intrinsic activity at the D2 and D3 dopamine receptor subtypes, preferentially binding to the D3 dopamine receptor in the striatum and substantia nigra.',
    dosingRegimens: [
      'Parkinson Disease (Immediate-Release): Initial 0.125 mg PO 3 times daily; titrate upward gradually every 5-7 days to target maintenance 0.5 to 1.5 mg 3 times daily (max 4.5 mg/day)',
      'Parkinson Disease (Extended-Release): Initial 0.375 mg PO once daily; titrate every 5-7 days to maintenance 1.5 to 4.5 mg once daily',
      'Restless Legs Syndrome (RLS): Initial 0.125 mg PO once daily 2 to 3 hours before bedtime; may titrate every 4-7 days to max 0.5 mg once daily',
    ],
    sideEffects: {
      common: ['Nausea', 'Somnolence / daytime sleepiness', 'Dizziness', 'Orthostatic hypotension', 'Insomnia', 'Hallucinations', 'Constipation', 'Peripheral edema'],
      severe: ['Sudden sleep attacks (falling asleep during activities of daily living)', 'Impulse control disorders (pathological gambling, hypersexuality, compulsive shopping)', 'Dopamine agonist withdrawal syndrome (DAWS)', 'Pleural / retroperitoneal fibrosis'],
    },
    contraindications: [
      'Known hypersensitivity to pramipexole or formulation components',
    ],
    drugInteractions: {
      major: ['Dopamine antagonists (neuroleptics, phenothiazines, metoclopramide - antagonize therapeutic effect of pramipexole)'],
      common: ['Cationic transport inhibitors (cimetidine - increases pramipexole AUC and half-life by 50%)', 'CNS depressants and alcohol (additive sedation and somnolence)'],
    },
    monitoringParameters: [
      'Blood pressure (sitting and standing) for orthostatic hypotension',
      'Screening for impulse control disorders and compulsive behaviors',
      'Excessive daytime somnolence and sudden sleep attacks',
      'Renal function (dose adjustments required if CrCl < 50 mL/min)',
    ],
    dosageForms: ['Oral Tablet (Immediate-Release): 0.125 mg, 0.25 mg, 0.5 mg, 0.75 mg, 1 mg, 1.5 mg', 'Oral Extended-Release Tablet: 0.375 mg, 0.75 mg, 1.5 mg, 2.25 mg, 3 mg, 3.75 mg, 4.5 mg'],
    administrationAndCounseling: [
      'Take with food if nausea occurs.',
      'Swallow extended-release tablets whole; do not chew, crush, or divide.',
      'Exercise caution when driving or operating machinery; sudden sleep onset without warning has been reported.',
      'Family members and caregivers should be advised to monitor for unusual compulsive behaviors like gambling or excessive shopping.',
      'Taper dose gradually when discontinuing; do not stop abruptly.',
    ],
  },

  Ropinirole: {
    genericName: 'Ropinirole',
    brandNames: ['Requip', 'Requip XL'],
    pharmacologicClass: 'Non-Ergot Dopamine Agonist',
    therapeuticClass: 'Anti-Parkinson\'s Agent',
    mechanismOfAction:
      'Stimulates postsynaptic D2 and D3 dopamine receptors within the caudate-putamen in the brain, improving motor deficits in Parkinson disease and reducing abnormal sensory sensations in restless legs syndrome.',
    dosingRegimens: [
      'Parkinson Disease (Immediate-Release): Initial 0.25 mg PO 3 times daily; titrate weekly to maintenance 1 to 8 mg 3 times daily (max 24 mg/day)',
      'Parkinson Disease (Extended-Release): Initial 2 mg PO once daily; titrate weekly by 2 mg/day to maintenance 4 to 12 mg once daily (max 24 mg/day)',
      'Restless Legs Syndrome: Initial 0.25 mg PO once daily 1 to 3 hours before bedtime; titrate up to 4 mg once daily',
    ],
    sideEffects: {
      common: ['Nausea', 'Somnolence', 'Dizziness', 'Vomiting', 'Syncope', 'Asthenia', 'Orthostatic hypotension', 'Dyspepsia'],
      severe: ['Sudden onset of sleep during active tasks', 'Severe impulse control and compulsive behaviors', 'Hallucinations and psychotic-like behavior', 'Fibrotic complications'],
    },
    contraindications: [
      'Known hypersensitivity to ropinirole',
    ],
    drugInteractions: {
      major: ['Strong CYP1A2 inhibitors (ciprofloxacin, fluvoxamine - significantly increase ropinirole plasma levels by up to 80%)', 'Dopamine D2 antagonists (haloperidol, risperidone, metoclopramide)'],
      common: ['CYP1A2 inducers (cigarette smoking, omeprazole - decreases ropinirole concentrations)', 'Estrogens (hormone replacement increases ropinirole levels)'],
    },
    monitoringParameters: [
      'Blood pressure and heart rate (orthostatic vital signs at initiation and dose increases)',
      'Assessment of daytime alertness and driving safety',
      'Behavioral changes, compulsive urges, and visual hallucinations',
      'Hepatic function in patients with severe liver impairment',
    ],
    dosageForms: ['Oral Tablet (Immediate-Release): 0.25 mg, 0.5 mg, 1 mg, 2 mg, 3 mg, 4 mg, 5 mg', 'Oral Extended-Release Tablet: 2 mg, 4 mg, 6 mg, 8 mg, 12 mg'],
    administrationAndCounseling: [
      'Take with or without food; taking with food helps reduce nausea.',
      'Do not chew, crush, or divide extended-release tablets.',
      'Avoid sudden position changes to reduce dizziness and fainting.',
      'Report any new or intense urges (gambling, spending, binge eating) to your prescriber immediately.',
      'Smoking cessation or initiation may alter drug levels due to CYP1A2 enzyme changes.',
    ],
  },

  'Benztropine Mesylate': {
    genericName: 'Benztropine Mesylate',
    brandNames: ['Cogentin'],
    pharmacologicClass: 'Centrally Acting Anticholinergic',
    therapeuticClass: 'Anti-Parkinson\'s Agent',
    mechanismOfAction:
      'Possesses both anticholinergic and antihistaminic effects; selectively blocks central muscarinic acetylcholine receptors, thereby restoring the physiological balance between dopamine and acetylcholine in the basal ganglia and reducing extrapyramidal symptoms.',
    dosingRegimens: [
      'Drug-Induced Extrapyramidal Disorders: 1 to 4 mg PO or IM/IV once or twice daily',
      'Parkinsonism: Initial 0.5 to 1 mg PO once daily at bedtime; increase gradually by 0.5 mg every 5 to 6 days to maintenance 1 to 2 mg daily (max 6 mg/day)',
      'Acute Dystonic Reactions: 1 to 2 mg IV or IM once; may repeat in 15 to 30 minutes if needed',
    ],
    sideEffects: {
      common: ['Xerostomia (dry mouth)', 'Blurred vision / cycloplegia', 'Constipation', 'Urinary retention', 'Nausea', 'Sedation'],
      severe: ['Anhidrosis and fatal hyperthermia / heat stroke', 'Anticholinergic toxic psychosis and delirium', 'Paralytic ileus', 'Precipitation of acute angle-closure glaucoma', 'Tachycardia'],
    },
    contraindications: [
      'Angle-closure glaucoma',
      'Myasthenia gravis',
      'Pyloric or duodenal obstruction, paralytic ileus',
      'Children under 3 years of age',
    ],
    drugInteractions: {
      major: ['Other potent anticholinergic medications (tricyclic antidepressants, first-generation antihistamines, phenothiazines - additive anticholinergic toxicity)'],
      common: ['Potassium chloride solid oral dosage forms (delayed GI transit increases ulceration risk)', 'Acetylcholinesterase inhibitors (donepezil, rivastigmine - pharmacodynamic antagonism)', 'Alcohol and CNS depressants'],
    },
    monitoringParameters: [
      'Intraocular pressure and ophthalmologic monitoring for glaucoma',
      'Urinary output and post-void residual in elderly males with BPH',
      'Bowel habits for severe constipation or impaction',
      'Body temperature and sweating ability during hot weather or strenuous exercise',
      'Mental status and cognitive evaluation in geriatric patients',
    ],
    dosageForms: ['Oral Tablet: 0.5 mg, 1 mg, 2 mg', 'Intramuscular / Intravenous Injection: 1 mg/mL (2 mL ampuls)'],
    administrationAndCounseling: [
      'Take with food to minimize gastric irritation; take at bedtime if once-daily dosing causes daytime sedation.',
      'Suck on sugarless hard candies or chew sugarless gum to relieve dry mouth.',
      'Drink plenty of fluids and use sun protection; avoid hot baths and vigorous exercise in hot weather as reduced sweating can lead to heat stroke.',
      'Notify your doctor immediately if you experience eye pain, rapid heart rate, severe constipation, or difficulty urinating.',
    ],
  },

  'Carbidopa / Levodopa': {
    genericName: 'Carbidopa / Levodopa',
    brandNames: ['Duopa', 'Rytary', 'Sinemet', 'Sinemet CR'],
    pharmacologicClass: 'Decarboxylase Inhibitor and Dopamine Precursor',
    therapeuticClass: 'Anti-Parkinson\'s Agent',
    mechanismOfAction:
      'Levodopa crosses the blood-brain barrier via neutral amino acid transport and is decarboxylated into dopamine in the basal ganglia; carbidopa is a peripheral aromatic amino acid decarboxylase inhibitor that does not cross the blood-brain barrier, preventing peripheral levodopa metabolism and reducing systemic side effects.',
    dosingRegimens: [
      'Immediate-Release (Sinemet): Initial carbidopa/levodopa 25/100 mg PO 3 times daily; titrate by 1 tablet every 1 to 2 days up to 1-2 tablets 3 to 4 times daily (provide >= 70-100 mg carbidopa daily)',
      'Controlled-Release (Sinemet CR): Initial 50/200 mg PO twice daily at intervals >= 6 hours; titrate upward at intervals of >= 3 days',
      'Extended-Release Capsule (Rytary): Initial 23.75/95 mg PO 3 times daily; individualized titration',
    ],
    sideEffects: {
      common: ['Nausea', 'Vomiting', 'Anorexia', 'Dizziness', 'Orthostatic hypotension', 'Dark-colored urine/sweat/saliva', 'Insomnia', 'Dream abnormalities'],
      severe: ['Dyskinesias (choreoathetotic movements)', 'Motor fluctuations ("on-off" phenomenon and end-of-dose wearing-off)', 'Psychosis, delusions, and vivid hallucinations', 'Neuroleptic malignant syndrome-like syndrome upon abrupt withdrawal'],
    },
    contraindications: [
      'Non-selective monoamine oxidase (MAO) inhibitors within past 14 days (hypertensive crisis)',
      'Angle-closure glaucoma',
      'Known hypersensitivity to carbidopa or levodopa',
    ],
    drugInteractions: {
      major: ['Non-selective MAO inhibitors (phenelzine, tranylcypromine - severe hypertensive crisis)', 'Antipsychotics / D2 dopamine antagonists (haloperidol, risperidone - negate motor benefits)'],
      common: ['High-protein meals and dietary amino acids (compete for intestinal absorption and blood-brain barrier transport)', 'Iron salts and multivitamins (chelate carbidopa/levodopa and decrease absorption)', 'Antihypertensives (additive orthostatic hypotension)'],
    },
    monitoringParameters: [
      'Motor symptoms (tremor, rigidity, bradykinesia, postural instability) and on/off periods',
      'Involuntary movements (dyskinesias)',
      'Blood pressure and heart rate (sitting and standing)',
      'Periodic dermatologic examination for cutaneous malignant melanoma',
      'Mental status and cognitive evaluation',
    ],
    dosageForms: [
      'Oral Tablet (Immediate-Release): 10/100 mg, 25/100 mg, 25/250 mg',
      'Oral Controlled-Release Tablet (CR): 25/100 mg, 50/200 mg',
      'Oral Extended-Release Capsule (Rytary): 23.75/95 mg, 36.25/145 mg, 48.75/195 mg, 61.25/245 mg',
      'Enteral Suspension (Duopa): 4.63 mg carbidopa / 20 mg levodopa per mL',
    ],
    administrationAndCounseling: [
      'Take doses consistently in relation to meals; high-protein foods (meat, dairy, eggs) may reduce absorption and decrease efficacy.',
      'Do not crush or chew extended-release or controlled-release tablets.',
      'Urine, saliva, or perspiration may turn a dark red, brown, or black color; this is harmless.',
      'Never stop taking carbidopa/levodopa suddenly, as abrupt cessation can cause a life-threatening high fever and severe muscle stiffness.',
    ],
  },

  Haloperidol: {
    genericName: 'Haloperidol',
    brandNames: ['Haldol'],
    pharmacologicClass: 'First-Generation (Typical) Antipsychotic',
    therapeuticClass: 'Typical Antipsychotic',
    mechanismOfAction:
      'High-potency first-generation butyrophenone antipsychotic that selectively antagonizes post-synaptic mesolimbic and mesocortical dopamine D2 receptors, suppressing positive psychotic symptoms and reducing motor tics in Tourette disorder.',
    dosingRegimens: [
      'Schizophrenia / Psychosis (Oral): Moderate symptoms: 0.5 to 2 mg PO 2 to 3 times daily; severe symptoms: 3 to 5 mg PO 2 to 3 times daily; maintenance 1 to 15 mg/day',
      'Acute Psychomotor Agitation: 2 to 5 mg IM/IV every 4 to 8 hours as needed (or every 1 hour for urgent acute agitation)',
      'Tourette Disorder: 0.5 to 2 mg PO 2 to 3 times daily; titrate to response',
      'Haloperidol Decanoate (Long-Acting IM Depot): 10 to 20 times the previous daily oral haloperidol dose IM once every 4 weeks',
    ],
    sideEffects: {
      common: ['Extrapyramidal symptoms (akathisia, dystonia, parkinsonism)', 'Sedation', 'Constipation', 'Dry mouth', 'Blurred vision', 'Weight gain', 'Hyperprolactinemia (galactorrhea, amenorrhea)'],
      severe: ['Tardive dyskinesia (potentially irreversible)', 'Neuroleptic Malignant Syndrome (NMS)', 'QTc interval prolongation and Torsades de Pointes', 'Agranulocytosis'],
    },
    contraindications: [
      'Severe toxic central nervous system depression or comatose states',
      'Parkinson disease or dementia with Lewy bodies',
      'Known hypersensitivity to haloperidol',
    ],
    drugInteractions: {
      major: ['QT-prolonging agents (amiodarone, sotalol, quinidine, methadone, macrolides - severe ventricular arrhythmias)', 'Dopaminergic antiparkinson agents (levodopa, pramipexole - mutually antagonizing)'],
      common: ['Anticholinergic drugs (additive atropine-like toxicity and memory impairment)', 'CYP3A4 and CYP2D6 inducers/inhibitors', 'CNS depressants and alcohol'],
    },
    monitoringParameters: [
      'Baseline ECG and periodic QTc monitoring (especially with IV administration or high doses)',
      'Abnormal Involuntary Movement Scale (AIMS) exam every 3 to 6 months for tardive dyskinesia',
      'Signs of extrapyramidal symptoms and akathisia',
      'Vital signs, temperature, and mental status (surveillance for NMS)',
      'Serum prolactin level if clinical signs arise',
    ],
    dosageForms: [
      'Oral Tablet: 0.5 mg, 1 mg, 2 mg, 5 mg, 10 mg, 20 mg',
      'Oral Concentrate Solution: 2 mg/mL',
      'Injection Solution (Lactate for acute IM/IV): 5 mg/mL',
      'Depot Intramuscular Injection (Decanoate): 50 mg/mL, 100 mg/mL',
    ],
    blackBoxWarning:
      'WARNING: INCREASED MORTALITY IN ELDERLY PATIENTS WITH DEMENTIA-RELATED PSYCHOSIS: Elderly patients with dementia-related psychosis treated with antipsychotic drugs are at an increased risk of death. Haloperidol is not approved for the treatment of patients with dementia-related psychosis.',
    administrationAndCounseling: [
      'Take with meals or a full glass of water or milk to reduce stomach upset.',
      'Dilute oral liquid concentrate in water, clear soda, or juice just prior to drinking; avoid combining with tea or coffee.',
      'Drink plenty of fluids and avoid excessive heat exposure, as haloperidol impairs body temperature regulation.',
      'Report any involuntary movements of the tongue, face, mouth, or limbs immediately.',
    ],
  },

  Quetiapine: {
    genericName: 'Quetiapine',
    brandNames: ['Seroquel', 'Seroquel XR'],
    pharmacologicClass: 'Second-Generation (Atypical) Antipsychotic',
    therapeuticClass: 'Atypical Antipsychotic',
    mechanismOfAction:
      'Antagonizes multiple neurotransmitter receptors including brain serotonin 5-HT2A and dopamine D2 receptors, with high affinity for histamine H1 and adrenergic alpha-1 receptors and low affinity for muscarinic M1 receptors, providing antipsychotic efficacy with low extrapyramidal liability.',
    dosingRegimens: [
      'Schizophrenia (Immediate-Release): Day 1: 25 mg PO twice daily; titrate daily by 25-50 mg increments to target 300 to 400 mg/day divided twice daily (range 150-750 mg/day)',
      'Schizophrenia (Extended-Release XR): Initial 300 mg PO once daily in evening; titrate up to 400 to 800 mg once daily',
      'Bipolar I Mania: Day 1: 100 mg/day; Day 4: 400 mg/day in divided doses; target 400 to 800 mg/day',
      'Bipolar Depression: 50 mg PO at bedtime on Day 1; titrate to 300 mg at bedtime by Day 4',
      'Major Depressive Disorder (Adjunct, XR): 50 mg PO once daily at bedtime; target 150 to 300 mg daily',
    ],
    sideEffects: {
      common: ['Sedation / somnolence', 'Dizziness', 'Weight gain', 'Dry mouth', 'Constipation', 'Orthostatic hypotension', 'Increased appetite', 'Dyslipidemia'],
      severe: ['Metabolic syndrome (severe hyperglycemia, new-onset diabetes, diabetic ketoacidosis)', 'Tardive dyskinesia', 'Neuroleptic Malignant Syndrome', 'QTc prolongation', 'Cataracts / lens changes'],
    },
    contraindications: [
      'Hypersensitivity to quetiapine or formulation excipients',
    ],
    drugInteractions: {
      major: ['Strong CYP3A4 inhibitors (ketoconazole, itraconazole, clarithromycin - increase quetiapine AUC up to 5- to 8-fold; reduce dose by 80%)', 'Strong CYP3A4 inducers (phenytoin, carbamazepine, rifampin - decrease quetiapine levels dramatically; up to 5-fold dose increase needed)'],
      common: ['Antihypertensive agents (additive orthostatic hypotension)', 'CNS depressants and sedatives', 'QTc-prolonging drugs'],
    },
    monitoringParameters: [
      'Fasting blood glucose, HbA1c, and lipid panel at baseline, 3 months, and annually',
      'Body weight, BMI, and waist circumference at baseline and monthly for 3 months, then quarterly',
      'Blood pressure and pulse rate (orthostatic vital signs)',
      'Slit-lamp eye exam at baseline and every 6 months for cataract detection',
      'AIMS exam for tardive dyskinesia',
    ],
    dosageForms: ['Oral Tablet (Immediate-Release): 25 mg, 50 mg, 100 mg, 200 mg, 300 mg, 400 mg', 'Oral Extended-Release Tablet (XR): 50 mg, 150 mg, 200 mg, 300 mg, 400 mg'],
    blackBoxWarning:
      'WARNING: INCREASED MORTALITY IN ELDERLY PATIENTS WITH DEMENTIA-RELATED PSYCHOSIS; SUICIDAL THOUGHTS AND BEHAVIORS: Elderly patients with dementia-related psychosis treated with antipsychotic drugs are at an increased risk of death. Antidepressants increased the risk of suicidal thoughts and behaviors in pediatric and young adult patients in short-term studies. Closely monitor all antidepressant-treated patients for clinical worsening and emergence of suicidal thoughts and behaviors.',
    administrationAndCounseling: [
      'Take immediate-release tablets with or without food, typically in the evening due to strong sedating properties.',
      'Swallow extended-release (XR) tablets whole without food or with a light snack (< 300 calories); do not crush, split, or chew.',
      'Avoid grapefruit products and alcohol while taking quetiapine.',
      'Rise slowly from sitting or lying positions to avoid lightheadedness and fainting.',
      'Report any worsening depression, suicidal feelings, or unusual muscle twitches to your doctor immediately.',
    ],
  },

  Risperidone: {
    genericName: 'Risperidone',
    brandNames: ['Risperdal', 'Risperdal Consta', 'Risperdal M-TAB'],
    pharmacologicClass: 'Second-Generation (Atypical) Antipsychotic',
    therapeuticClass: 'Atypical Antipsychotic',
    mechanismOfAction:
      'Potent, selective dual serotonin 5-HT2A and dopamine D2 receptor antagonist with high affinity for alpha-1 and alpha-2 adrenergic receptors and histamine H1 receptors, modulating cortical and striatal dopaminergic and serotonergic neurotransmission.',
    dosingRegimens: [
      'Schizophrenia: Initial 1 to 2 mg PO daily divided once or twice daily; titrate by 1 to 2 mg/day to target 4 to 6 mg daily (max 16 mg/day)',
      'Bipolar Mania: Initial 2 to 3 mg PO once daily; titrate by 1 mg daily to range 1 to 6 mg daily',
      'Autism-Associated Irritability (Pediatric): Initial 0.25 mg/day (< 20 kg) or 0.5 mg/day (>= 20 kg); target 0.5 to 3 mg daily',
      'Long-Acting Intramuscular Depot (Risperdal Consta): 25 to 50 mg deep gluteal or deltoid IM injection every 2 weeks (continue oral coverage for 3 weeks after first injection)',
    ],
    sideEffects: {
      common: ['Parkinsonism and extrapyramidal symptoms (dose-dependent)', 'Somnolence', 'Hyperprolactinemia (gynecomastia, galactorrhea, amenorrhea, sexual dysfunction)', 'Weight gain', 'Increased appetite', 'Fatigue', 'Dizziness', 'Constipation'],
      severe: ['Tardive dyskinesia', 'Neuroleptic Malignant Syndrome', 'Hyperglycemia and diabetic ketoacidosis', 'Prolonged QTc interval', 'Priapism'],
    },
    contraindications: [
      'Known hypersensitivity to risperidone or paliperidone',
    ],
    drugInteractions: {
      major: ['CYP2D6 inhibitors (fluoxetine, paroxetine - significantly increase risperidone active moiety blood levels)', 'Carbamazepine and enzyme inducers (increase risperidone clearance, halving plasma levels)'],
      common: ['Antihypertensives (enhanced hypotensive effect)', 'Levodopa and dopamine agonists (mutual antagonism)', 'CNS depressants and alcohol'],
    },
    monitoringParameters: [
      'Fasting glucose and lipid panel at baseline and periodically',
      'Weight, BMI, and waist circumference routinely',
      'Serum prolactin levels if symptoms of hyperprolactinemia occur (amenorrhea, gynecomastia)',
      'AIMS examination periodically for tardive dyskinesia',
      'Blood pressure and heart rate (orthostasis risk during titration)',
    ],
    dosageForms: [
      'Oral Tablet: 0.25 mg, 0.5 mg, 1 mg, 2 mg, 3 mg, 4 mg',
      'Oral Solution: 1 mg/mL',
      'Orally Disintegrating Tablet (M-TAB): 0.5 mg, 1 mg, 2 mg, 3 mg, 4 mg',
      'Long-Acting Intramuscular Injection (Consta): 12.5 mg, 25 mg, 37.5 mg, 50 mg vials',
    ],
    blackBoxWarning:
      'WARNING: INCREASED MORTALITY IN ELDERLY PATIENTS WITH DEMENTIA-RELATED PSYCHOSIS: Elderly patients with dementia-related psychosis treated with antipsychotic drugs are at an increased risk of death. Risperidone is not approved for the treatment of patients with dementia-related psychosis.',
    administrationAndCounseling: [
      'Take with or without food.',
      'For orally disintegrating tablets (M-TAB): Place on tongue immediately after removing from foil blister with dry hands; allow to dissolve and swallow with or without liquid.',
      'Oral solution may be mixed with water, coffee, orange juice, or low-fat milk; do NOT mix with cola or tea.',
      'Inform your doctor if you experience breast tenderness, nipple discharge, menstrual cycle changes, or uncontrollable face or body movements.',
    ],
  },

  Olanzapine: {
    genericName: 'Olanzapine',
    brandNames: ['Zyprexa'],
    pharmacologicClass: 'Second-Generation (Atypical) Antipsychotic',
    therapeuticClass: 'Atypical Antipsychotic',
    mechanismOfAction:
      'Atypical thienobenzodiazepine antipsychotic that exerts antagonist activity across dopamine D1-D4, serotonin 5-HT2A/2C, alpha-1 adrenergic, and histamine H1 receptors, with prominent metabolic liability linked to potent H1 and 5-HT2C receptor antagonism.',
    dosingRegimens: [
      'Schizophrenia: Initial 5 to 10 mg PO once daily; titrate by 5 mg daily at intervals >= 1 week to target 10 to 20 mg once daily (max 20 mg/day)',
      'Bipolar I Mania: Initial 10 to 15 mg PO once daily as monotherapy (or 10 mg daily in combination with lithium or valproate); target 5 to 20 mg daily',
      'Treatment-Resistant Depression: 5 to 20 mg PO once daily in combination with fluoxetine (Symbyax formulation)',
      'Acute Agitation (IM): 5 to 10 mg IM single dose; may repeat after 2 hours (max 30 mg/day)',
    ],
    sideEffects: {
      common: ['Significant weight gain (highest among atypicals)', 'Somnolence / sedation', 'Increased appetite', 'Dry mouth', 'Dizziness', 'Constipation', 'Peripheral edema', 'Orthostatic hypotension'],
      severe: ['Severe metabolic syndrome (extreme hypertriglyceridemia, severe diabetic ketoacidosis, new-onset diabetes)', 'Tardive dyskinesia', 'Neuroleptic Malignant Syndrome', 'Post-injection delirium/sedation syndrome (relprevv depot)', 'Drug Reaction with Eosinophilia and Systemic Symptoms (DRESS)'],
    },
    contraindications: [
      'Known hypersensitivity to olanzapine',
    ],
    drugInteractions: {
      major: ['Parenteral benzodiazepines (intramuscular lorazepam with IM olanzapine has caused severe hypotension, bradycardia, and respiratory arrest)'],
      common: ['CYP1A2 inducers (cigarette smoking decreases olanzapine clearance by ~40%; dose adjustment required upon smoking cessation)', 'CYP1A2 inhibitors (fluvoxamine, ciprofloxacin increase olanzapine levels)', 'Antihypertensives (orthostatic hypotension)'],
    },
    monitoringParameters: [
      'Body weight and BMI at baseline, weekly for 6 weeks, then at 3, 6, and 12 months',
      'Fasting blood glucose, HbA1c, and fasting lipid profile at baseline, 3 months, and annually',
      'Blood pressure and heart rate',
      'Complete blood count (CBC) with differential',
      'AIMS examination periodically for tardive dyskinesia',
    ],
    dosageForms: ['Oral Tablet: 2.5 mg, 5 mg, 7.5 mg, 10 mg, 15 mg, 20 mg', 'Orally Disintegrating Tablet (Zydis): 5 mg, 10 mg, 15 mg, 20 mg', 'Intramuscular Injection Powder for Reconstitution: 10 mg vial'],
    blackBoxWarning:
      'WARNING: INCREASED MORTALITY IN ELDERLY PATIENTS WITH DEMENTIA-RELATED PSYCHOSIS: Elderly patients with dementia-related psychosis treated with antipsychotic drugs are at an increased risk of death. Olanzapine is not approved for the treatment of patients with dementia-related psychosis.',
    administrationAndCounseling: [
      'Take once daily at bedtime with or without food.',
      'Maintain a healthy balanced diet and engage in regular exercise to minimize treatment-induced weight gain.',
      'For orally disintegrating tablets: Peel back foil, place whole tablet on tongue to dissolve, and swallow with saliva.',
      'Cigarette smoking can significantly lower blood levels of olanzapine; inform your healthcare provider if you change smoking habits.',
      'Report any signs of high blood sugar such as excessive thirst, frequent urination, or extreme hunger.',
    ],
  },

  Aripiprazole: {
    genericName: 'Aripiprazole',
    brandNames: ['Abilify', 'Abilify Discmelt', 'Abilify Maintena'],
    pharmacologicClass: 'Second-Generation (Atypical) Antipsychotic / Dopamine Partial Agonist',
    therapeuticClass: 'Atypical Antipsychotic',
    mechanismOfAction:
      'Dopamine system stabilizer acting as a high-affinity partial agonist at dopamine D2 and serotonin 5-HT1A receptors, and potent antagonist at serotonin 5-HT2A receptors, providing unique efficacy with lower rates of hyperprolactinemia and metabolic dysregulation.',
    dosingRegimens: [
      'Schizophrenia: Initial 10 to 15 mg PO once daily; titrate after >= 2 weeks to target maintenance 10 to 30 mg once daily',
      'Bipolar I Mania: Initial 15 mg PO once daily as monotherapy (or 10 to 15 mg daily with lithium or valproate); target 15 to 30 mg daily',
      'Major Depressive Disorder (Adjunctive): Initial 2 to 5 mg PO once daily; titrate weekly up to 5 to 15 mg once daily',
      'Autistic Disorder Irritability (Pediatric): Initial 2 mg PO daily; titrate to target 5 to 15 mg once daily',
      'Long-Acting IM Depot (Abilify Maintena): 400 mg gluteal or deltoid IM once monthly (continue oral coverage for 14 days after first injection)',
    ],
    sideEffects: {
      common: ['Akathisia (motor restlessness, very common at initiation)', 'Insomnia', 'Nausea', 'Headache', 'Anxiety', 'Vomiting', 'Constipation', 'Somnolence'],
      severe: ['Pathological gambling and impulse control disorders (hypersexuality, compulsive shopping/eating)', 'Tardive dyskinesia', 'Neuroleptic Malignant Syndrome', 'Hyperglycemia / diabetes (lower incidence than other atypicals)'],
    },
    contraindications: [
      'Known hypersensitivity to aripiprazole',
    ],
    drugInteractions: {
      major: ['Strong CYP3A4 inhibitors (ketoconazole, clarithromycin - reduce aripiprazole dose by 50%)', 'Strong CYP2D6 inhibitors (quinidine, fluoxetine, paroxetine - reduce aripiprazole dose by 50%)', 'Strong CYP3A4 inducers (carbamazepine, rifampin - double aripiprazole dose)'],
      common: ['Antihypertensives (additive blood pressure lowering)', 'CNS depressants and alcohol'],
    },
    monitoringParameters: [
      'Screening for motor restlessness and akathisia at every visit',
      'Questioning regarding new or uncontrolled compulsive urges (gambling, shopping, eating)',
      'Baseline and periodic weight, fasting glucose, and lipid profile',
      'AIMS examination periodically for tardive dyskinesia',
      'Suicidality monitoring in pediatric and young adult patients',
    ],
    dosageForms: [
      'Oral Tablet: 2 mg, 5 mg, 10 mg, 15 mg, 20 mg, 30 mg',
      'Orally Disintegrating Tablet (Discmelt): 10 mg, 15 mg',
      'Oral Solution: 1 mg/mL',
      'Long-Acting Intramuscular Depot (Maintena): 300 mg, 400 mg prefilled dual-chamber syringes',
    ],
    blackBoxWarning:
      'WARNING: INCREASED MORTALITY IN ELDERLY PATIENTS WITH DEMENTIA-RELATED PSYCHOSIS; SUICIDAL THOUGHTS AND BEHAVIORS: Elderly patients with dementia-related psychosis treated with antipsychotic drugs are at an increased risk of death. Antidepressants increased the risk of suicidal thoughts and behaviors in pediatric and young adult patients. Closely monitor all patients treated with aripiprazole for clinical worsening and emergence of suicidal thoughts and behaviors.',
    administrationAndCounseling: [
      'Take once daily in the morning with or without food (taking in the morning helps avoid insomnia).',
      'Inform your doctor if you experience an inner restlessness or irresistible urge to constantly move your legs or body (akathisia).',
      'Report any new or intense urges, such as gambling or shopping urges, to your doctor immediately.',
      'Stay well hydrated and avoid excessive heat exposure, as antipsychotics can affect body temperature regulation.',
    ],
  },

  Clozapine: {
    genericName: 'Clozapine',
    brandNames: ['Clozaril'],
    pharmacologicClass: 'Second-Generation (Atypical) Antipsychotic',
    therapeuticClass: 'Atypical Antipsychotic',
    mechanismOfAction:
      'Prototypical atypical antipsychotic with weak dopamine D1 and D2 receptor blocking activity, high affinity for dopamine D4, serotonin 5-HT2A/2C, alpha-adrenergic, histamine H1, and cholinergic muscarinic receptors, effective for treatment-resistant schizophrenia and reducing suicidal behavior.',
    dosingRegimens: [
      'Treatment-Resistant Schizophrenia / Suicidal Behavior Reduction: Initial 12.5 mg PO once or twice daily; titrate daily by 25 to 50 mg increments to target 300 to 450 mg/day divided twice daily by end of week 2 (max 900 mg/day)',
    ],
    sideEffects: {
      common: ['Hypersalivation (nocturnal sialorrhea)', 'Sedation', 'Tachycardia', 'Constipation (often severe)', 'Weight gain', 'Dizziness', 'Fever', 'Hypotension'],
      severe: ['Severe neutropenia and fatal agranulocytosis (ANC < 500/mcL)', 'Fatal myocarditis and cardiomyopathy', 'Dose-dependent grand mal seizures', 'Severe gastrointestinal hypomotility / fatal paralytic ileus', 'Orthostatic hypotension, bradycardia, and syncope'],
    },
    contraindications: [
      'History of clozapine-induced severe neutropenia, agranulocytosis, or bone marrow disorder',
      'Severe central nervous system depression or comatose states',
      'Paralytic ileus',
      'Uncontrolled epilepsy',
    ],
    drugInteractions: {
      major: ['Bone marrow suppressants (carbamazepine, cotrimoxazole, antineoplastics - extreme agranulocytosis risk)', 'Benzodiazepines (severe collapse, respiratory arrest, and cardiac arrest)', 'Strong CYP1A2 inhibitors (fluvoxamine, ciprofloxacin - dramatically elevate clozapine blood levels)'],
      common: ['Anticholinergic medications (additive severe constipation, paralytic ileus, and bowel infarction)', 'CYP1A2 inducers (tobacco smoke decreases clozapine levels by 50%)'],
    },
    monitoringParameters: [
      'Absolute Neutrophil Count (ANC) via Clozapine REMS registry: Weekly for first 6 months, every 2 weeks for months 6 to 12, then every 4 weeks indefinitely (must have baseline ANC >= 1500/mcL; >= 1000/mcL for BEN)',
      'Baseline troponin I/T, CRP, and ECG to screen for myocarditis (monitor for fever, chest pain, tachycardia, SOB in first 4 weeks)',
      'Bowel habits at every visit; immediately treat constipation to prevent fatal ileus',
      'Fasting blood glucose, HbA1c, lipid panel, and body weight regularly',
    ],
    dosageForms: ['Oral Tablet: 25 mg, 50 mg, 100 mg, 200 mg', 'Orally Disintegrating Tablet (Fazaclo): 12.5 mg, 25 mg, 100 mg, 150 mg, 200 mg', 'Oral Suspension (Versacloz): 50 mg/mL'],
    blackBoxWarning:
      'WARNING: SEVERE NEUTROPENIA (AGRANULOCYTOSIS); ORTHOSTATIC HYPOTENSION, BRADYCARDIA, SYNCOPE; SEIZURES; MYOCARDITIS AND CARDIOMYOPATHY; INCREASED MORTALITY IN ELDERLY PATIENTS WITH DEMENTIA-RELATED PSYCHOSIS: Clozapine can cause severe neutropenia (ANC < 500/mcL), which can lead to serious and fatal infections. Available only through a restricted program called the Clozapine REMS. Orthostatic hypotension, bradycardia, syncope, and cardiac arrest have occurred. Seizures occur in a dose-dependent fashion. Fatal myocarditis and cardiomyopathy have been reported.',
    administrationAndCounseling: [
      'You must have routine blood draws to measure your white blood cell count before receiving each refill through the Clozapine REMS program.',
      'Report any fever, sore throat, or signs of infection immediately.',
      'Report any signs of heart inflammation such as chest pain, rapid heart rate, or shortness of breath.',
      'Constipation can become life-threatening; drink plenty of water, eat dietary fiber, and use prescribed stool softeners.',
      'Chew sugarless gum or place a towel over your pillow at night to manage excessive saliva production.',
    ],
  },

  'Lithium Carbonate': {
    genericName: 'Lithium Carbonate',
    brandNames: ['Lithobid', 'Eskalith', 'Eskalith CR'],
    pharmacologicClass: 'Mood Stabilizer / Antimanic Agent',
    therapeuticClass: 'Antimanic',
    mechanismOfAction:
      'Monovalent cation that alters neuronal sodium transport, inhibits inositol monophosphatase (depleting cellular inositol and dampening phosphatidylinositol signaling), and inhibits glycogen synthase kinase-3 beta (GSK-3b), stabilizing mood and exerting neuroprotective and anti-suicidal properties.',
    dosingRegimens: [
      'Bipolar I Acute Mania: 600 to 900 mg PO 2 to 3 times daily (or 900 to 1,800 mg/day in divided doses) titrated to target serum level 0.8 to 1.2 mEq/L',
      'Bipolar I Maintenance: 300 to 600 mg PO 2 to 3 times daily (or extended-release 450 to 900 mg PO twice daily) targeted to serum level 0.6 to 1.0 mEq/L',
    ],
    sideEffects: {
      common: ['Fine hand tremor', 'Polyuria and polydipsia', 'Nausea and diarrhea', 'Weight gain', 'Hypothyroidism', 'Goiter', 'Dry mouth', 'Leukocytosis (benign)'],
      severe: ['Lithium toxicity (coarse tremor, ataxia, confusion, seizures, coma, cardiac arrhythmias)', 'Nephrogenic diabetes insipidus', 'Chronic kidney disease / interstitial nephritis', 'Brugada syndrome unmasking', 'Sinus node dysfunction'],
    },
    contraindications: [
      'Severe renal disease or impairment',
      'Severe cardiovascular disease',
      'Severe dehydration or sodium depletion',
      'Concurrent use with ACE inhibitors/ARBs/diuretics without intensive monitoring',
      'First trimester of pregnancy (Ebstein anomaly cardiac malformation risk)',
    ],
    drugInteractions: {
      major: ['Thiazide and loop diuretics (decrease renal lithium clearance by 30-50%, precipitating severe toxicity)', 'ACE inhibitors and ARBs (lisinopril, losartan - decrease lithium excretion, raising serum levels)', 'NSAIDs (ibuprofen, naproxen - inhibit renal prostaglandins, reducing lithium clearance by 20-40%; prefer acetaminophen)'],
      common: ['Caffeine and theophylline (increase renal lithium excretion, lowering serum levels)', 'Carbonic anhydrase inhibitors (acetazolamide)', 'Serotonergic agents (increased serotonin syndrome risk)'],
    },
    monitoringParameters: [
      'Serum lithium concentrations (trough drawn exactly 12 hours after previous evening dose): Every 1-2 weeks during titration, then every 3-6 months once stable (target: acute 0.8-1.2 mEq/L; maintenance 0.6-1.0 mEq/L; toxicity > 1.5 mEq/L)',
      'Renal function (BUN, serum creatinine, eGFR, urinalysis) at baseline and every 6 to 12 months',
      'Thyroid function tests (TSH, free T4) at baseline and every 6 to 12 months',
      'Serum electrolytes and calcium (calcium can increase due to hyperparathyroidism)',
      'ECG at baseline (especially patients over 50 years of age)',
    ],
    dosageForms: ['Oral Capsule: 150 mg, 300 mg, 600 mg', 'Oral Tablet (Immediate-Release): 300 mg', 'Oral Extended-Release Tablet (Lithobid): 300 mg, 450 mg', 'Oral Solution (Lithium Citrate): 8 mEq/5 mL (equivalent to 300 mg carbonate)'],
    blackBoxWarning:
      'WARNING: LITHIUM TOXICITY: Lithium toxicity is closely related to serum lithium concentrations and can occur at doses close to therapeutic levels. Facilities for prompt and accurate serum lithium determinations must be available before initiating therapy. Patients and families must be alerted to early signs of toxicity (diarrhea, vomiting, tremor, mild ataxia, drowsiness, muscle weakness) and instructed to discontinue therapy and report immediately.',
    administrationAndCounseling: [
      'Take with food or milk to minimize gastrointestinal upset.',
      'Swallow extended-release tablets whole; do not crush, break, or chew.',
      'Maintain adequate and consistent dietary fluid (2 to 3 liters of water per day) and sodium intake; avoid crash diets or low-salt regimens.',
      'Avoid dehydration during exercise, fever, vomiting, or hot weather, as fluid loss rapidly triggers lithium toxicity.',
      'Avoid over-the-counter NSAIDs (ibuprofen, naproxen, Advil, Aleve); use acetaminophen for pain relief.',
      'Stop taking lithium and seek immediate emergency care if you experience vomiting, diarrhea, coarse hand shaking, unsteadiness, or slurred speech.',
    ],
  },
};
