import type { TopDrugClinicalMonograph } from './types.js';

export const CAT03_ANTICONVULSANTS: Record<string, TopDrugClinicalMonograph> = {
  "Phenytoin": {
    genericName: "Phenytoin",
    brandNames: ["Dilantin", "Phenytek"],
    pharmacologicClass: "Hydantoin Anticonvulsant / Voltage-Gated Sodium Channel Blocker",
    therapeuticClass: "3. Anticonvulsant",
    mechanismOfAction: "Promotes sodium efflux and stabilizes voltage-gated sodium channels in the inactive conformation, preventing sustained repetitive high-frequency firing of action potentials in cortical neurons; exhibits non-linear, saturable (Michaelis-Menten) elimination kinetics.",
    dosingRegimens: [
      "Status epilepticus loading: 15-20 mg/kg IV (fosphenytoin or phenytoin at <=50 mg/min).",
      "Maintenance oral dosing: 300-400 mg/day PO divided in 1-3 doses (extended-release Dilantin Kapseals once daily or twice daily), titrated to target total serum level 10-20 mcg/mL (free level 1-2 mcg/mL)."
    ],
    sideEffects: {
      common: ["Nystagmus", "Ataxia", "Drowsiness", "Gingival hyperplasia", "Hirsutism", "Coarsening of facial features", "Nausea"],
      severe: ["Purple glove syndrome (with IV extravasation)", "Stevens-Johnson syndrome / TEN", "DRESS syndrome", "Hepatotoxicity", "Agranulocytosis and megaloblastic anemia", "Cardiovascular collapse / arrhythmias with rapid IV infusion"]
    },
    contraindications: [
      "Hypersensitivity to phenytoin or other hydantoins",
      "Sinus bradycardia, sinoatrial block, second- or third-degree AV block, or Adams-Stokes syndrome (IV formulation)"
    ],
    drugInteractions: {
      major: [
        "CYP2C9 / CYP2C19 inhibitors (fluconazole, amiodarone, sulfamethoxazole/trimethoprim; dramatically increase phenytoin levels into neurotoxic range)",
        "CYP3A4 substrates (phenytoin is a potent inducer of CYP3A4, CYP2C9, and P-glycoprotein, reducing efficacy of oral contraceptives, statins, and warfarin)"
      ],
      common: [
        "Enteral tube feedings (bind phenytoin; hold tube feed 1-2 hours before and after oral suspension)",
        "Antacids and calcium supplements (reduce phenytoin bioavailability)"
      ]
    },
    monitoringParameters: [
      "Total serum phenytoin trough concentration (therapeutic range: 10-20 mcg/mL) or free phenytoin (1-2 mcg/mL, especially in hypoalbuminemia or renal disease via Winter-Tozer equation)",
      "Liver enzymes and CBC with differential",
      "Dental examination for gingival enlargement every 6 months",
      "Signs of toxicity: nystagmus (far lateral >20 mcg/mL), ataxia (>30 mcg/mL), lethargy/coma (>40 mcg/mL)"
    ],
    dosageForms: [
      "Extended-Release Capsule (Dilantin Kapseals): 30 mg, 100 mg",
      "Extended-Release Capsule (Phenytek): 200 mg, 300 mg",
      "Chewable Tablet (Dilantin Infatabs): 50 mg",
      "Oral Suspension: 125 mg/5 mL",
      "Intravenous Solution: 50 mg/mL"
    ],
    administrationAndCounseling: [
      "Take consistently with or without food at the same time each day; do not switch between brand and generic formulations without medical supervision.",
      "Practice meticulous daily oral hygiene (brushing, flossing, gum massage) to prevent and manage gum overgrowth.",
      "Do not stop taking this medication abruptly; sudden withdrawal may cause status epilepticus.",
      "Report any new skin rash, swollen glands, yellowing of eyes, or unsteady walking to your physician immediately.",
      "Women should use additional non-hormonal contraception as phenytoin decreases birth control pill effectiveness."
    ]
  },

  "Lamotrigine": {
    genericName: "Lamotrigine",
    brandNames: ["Lamictal", "Lamictal XR", "Lamictal ODT"],
    pharmacologicClass: "Phenyltriazine Anticonvulsant / Sodium Channel Blocker",
    therapeuticClass: "3. Anticonvulsant",
    mechanismOfAction: "Voltage- and use-dependent blocker of voltage-gated sodium channels that suppresses sustained rapid firing of neurons and inhibits the presynaptic release of excitatory neurotransmitters (primarily glutamate and aspartate); also demonstrates weak 5-HT3 receptor inhibition.",
    dosingRegimens: [
      "Standard monotherapy titration: Weeks 1-2: 25 mg PO daily; Weeks 3-4: 50 mg PO daily; Week 5: 100 mg PO daily; maintenance: 100-200 mg PO twice daily (or 200-400 mg once daily Lamictal XR).",
      "With concurrent Valproate: Start 25 mg PO every other day for 2 weeks, then 25 mg daily for 2 weeks (valproate inhibits lamotrigine glucuronidation, doubling its half-life).",
      "With concurrent enzyme inducers (carbamazepine, phenytoin): Start 50 mg PO daily for 2 weeks, then 100 mg daily for 2 weeks.",
      "Bipolar I disorder maintenance: Titrate to target 200 mg PO once daily."
    ],
    sideEffects: {
      common: ["Dizziness", "Headache", "Diplopia", "Ataxia", "Somnolence", "Nausea", "Insomnia", "Benign skin rash"],
      severe: ["Stevens-Johnson syndrome (SJS) and toxic epidermal necrolysis (TEN)", "Drug reaction with eosinophilia and systemic symptoms (DRESS)", "Hemophagocytic lymphohistiocytosis (HLH)", "Aseptic meningitis", "Arrhythmogenic potential (Class IB-like sodium channel cardiac conduction slowing)"]
    },
    contraindications: [
      "Known hypersensitivity to lamotrigine or any components"
    ],
    blackBoxWarning: "Serious rashes requiring hospitalization and discontinuation of treatment, including Stevens-Johnson syndrome, have occurred in patients taking lamotrigine. The rate of serious rash is greater in pediatric patients than adults. Risk factors include exceeding recommended initial dose, exceeding recommended dose escalation rate, and co-administration with valproate. Nearly all cases of life-threatening rashes occur within 2 to 8 weeks of treatment initiation.",
    drugInteractions: {
      major: [
        "Valproate / Divalproex (inhibits lamotrigine glucuronidation, more than doubling lamotrigine half-life; requires >=50% dose reduction and slower titration)",
        "Enzyme-inducing AEDs (carbamazepine, phenytoin, phenobarbital; induce glucuronidation, cutting half-life in half; requires double dose)",
        "Estrogen-containing oral contraceptives (induce UGT1A4, decreasing lamotrigine levels by ~50%; levels rise during hormone-free week)"
      ],
      common: [
        "Rifampin (significantly accelerates lamotrigine clearance)",
        "Atazanavir/lopinavir (reduces lamotrigine exposure)"
      ]
    },
    monitoringParameters: [
      "Skin inspection for any sign of rash or mucosal ulceration, particularly during the first 8 weeks (discontinue immediately if rash appears)",
      "Seizure frequency or bipolar mood stability",
      "Signs of HLH (fever, hepatosplenomegaly, cytopenias, elevated ferritin)",
      "Suicidal ideation or worsening depression"
    ],
    dosageForms: [
      "Oral Tablet: 25 mg, 100 mg, 150 mg, 200 mg",
      "Chewable Dispersible Tablet: 2 mg, 5 mg, 25 mg",
      "Orally Disintegrating Tablet (Lamictal ODT): 25 mg, 50 mg, 100 mg, 200 mg",
      "Extended-Release Tablet (Lamictal XR): 25 mg, 50 mg, 100 mg, 200 mg, 250 mg, 300 mg",
      "Starter Kits: Blue (with valproate), Green (with inducers), Orange (no inducers/inhibitors)"
    ],
    administrationAndCounseling: [
      "Follow the slow dose-titration schedule strictly; do not increase doses faster than prescribed, as rapid titration dramatically increases the risk of a life-threatening skin rash.",
      "If you miss taking this medicine for more than 5 consecutive days, DO NOT restart at your maintenance dose; contact your doctor immediately to re-titrate from the beginning.",
      "Seek emergency medical care immediately at the first sign of any rash, hives, mouth sores, or peeling skin.",
      "Let your doctor know if you start or stop estrogen-containing birth control pills, as your dose will need adjustment."
    ]
  },

  "Levetiracetam": {
    genericName: "Levetiracetam",
    brandNames: ["Keppra", "Keppra XR", "Elepsia XR", "Spritam"],
    pharmacologicClass: "Pyrrolidine Anticonvulsant / SV2A Ligand",
    therapeuticClass: "3. Anticonvulsant",
    mechanismOfAction: "Saturably and stereoselectively binds to synaptic vesicle protein 2A (SV2A) in presynaptic terminals, inhibiting presynaptic calcium exocytosis, slowing synaptic vesicle mobilization, and modulating vesicular release of neurotransmitters without altering baseline synaptic transmission.",
    dosingRegimens: [
      "Focal onset or primary generalized tonic-clonic seizures: Start 500 mg PO twice daily; increase by 1000 mg/day every 2 weeks to target maintenance 1000-1500 mg PO twice daily (max 3000 mg/day).",
      "Extended-Release (Keppra XR): 1000 mg PO once daily, titrated by 1000 mg/day every 2 weeks to 1000-3000 mg once daily.",
      "Renal dose adjustments: CrCl 50-80: 500-1000 mg q12h; CrCl 30-50: 250-750 mg q12h; CrCl <30: 250-500 mg q12h."
    ],
    sideEffects: {
      common: ["Somnolence", "Fatigue", "Dizziness", "Irritability", "Aggression", "Anxiety", "Infection (nasopharyngitis)", "Headache"],
      severe: ["Severe psychiatric symptoms (psychosis, paranoia, hallucinations, suicidal ideation)", "Anaphylaxis and angioedema", "Stevens-Johnson syndrome (SJS) and toxic epidermal necrolysis (TEN)", "Neutropenia / leukopenia"]
    },
    contraindications: [
      "Known hypersensitivity to levetiracetam or other pyrrolidine derivatives"
    ],
    drugInteractions: {
      major: [
        "Sedating CNS depressants (additive psychomotor impairment and somnolence)"
      ],
      common: [
        "Exhibits virtually no cytochrome P450 or protein-binding interactions; renal elimination via glomerular filtration with partial enzymatic hydrolysis (non-CYP)"
      ]
    },
    monitoringParameters: [
      "Renal function (BUN, serum creatinine, eGFR) for dose adjustments",
      "Behavioral and neuropsychiatric changes (irritability, agitation, mood swings, depression, suicidal thoughts)",
      "Seizure diary and seizure control"
    ],
    dosageForms: [
      "Oral Tablet: 250 mg, 500 mg, 750 mg, 1000 mg",
      "Extended-Release Tablet (Keppra XR): 500 mg, 750 mg, 1000 mg",
      "Oral Solution: 100 mg/mL",
      "Oral Tablet for Suspension (Spritam): 250 mg, 500 mg, 750 mg, 1000 mg",
      "Intravenous Solution: 100 mg/mL (500 mg/5 mL vial)"
    ],
    administrationAndCounseling: [
      "Take consistently twice daily with or without food (or once daily for XR formulation); swallow tablets whole with liquid.",
      "Do not crush, chew, or break extended-release tablets.",
      "Notify your family members and doctor immediately if you notice changes in your mood, sudden hostility, extreme agitation, depression, or suicidal feelings.",
      "Do not drive or operate hazardous machinery until you know how this medication affects you, especially during initial therapy or dose increases.",
      "Never stop taking this medication abruptly, as this can trigger breakthrough seizures."
    ]
  },

  "Oxcarbazepine": {
    genericName: "Oxcarbazepine",
    brandNames: ["Trileptal", "Oxtellar XR"],
    pharmacologicClass: "Dibenzazepine Anticonvulsant / Sodium Channel Modulator",
    therapeuticClass: "3. Anticonvulsant",
    mechanismOfAction: "Rapidly reduced in liver by cytosolic aldo-keto reductases to its active monohydroxy metabolite (MHD; licarbazepine), which blocks voltage-sensitive sodium channels, inhibits repetitive neuronal firing, and modulates high-voltage-activated N-type calcium channels.",
    dosingRegimens: [
      "Focal onset seizures: Start 300 mg PO twice daily; increase by 300-600 mg/day at weekly intervals to target maintenance 600-1200 mg PO twice daily (max 2400 mg/day).",
      "Extended-Release (Oxtellar XR): 600 mg PO once daily on an empty stomach, titrated to 1200-2400 mg once daily.",
      "Renal impairment (CrCl < 30 mL/min): Initiate at 50% of usual starting dose (300 mg daily)."
    ],
    sideEffects: {
      common: ["Dizziness", "Somnolence", "Diplopia", "Ataxia", "Nausea", "Vomiting", "Hyponatremia", "Tremor", "Headache"],
      severe: ["Clinically significant hyponatremia (serum Na < 125 mEq/L, causing confusion, seizures, or coma)", "Stevens-Johnson syndrome / TEN (strongly associated with HLA-B*1502 allele)", "DRESS syndrome", "Pancytopenia and leukopenia"]
    },
    contraindications: [
      "Hypersensitivity to oxcarbazepine, eslicarbazepine acetate, or carbamazepine (cross-reactivity occurs in 25-30% of patients)"
    ],
    drugInteractions: {
      major: [
        "Phenytoin (oxcarbazepine inhibits CYP2C19, increasing phenytoin levels up to 40% at doses >=1200 mg/day)",
        "Oral contraceptives (induces CYP3A4/5, reducing ethinyl estradiol and levonorgestrel exposure by ~50%; contraceptive failure hazard)"
      ],
      common: [
        "Enzyme inducers (carbamazepine, phenytoin, phenobarbital; decrease active MHD levels by 30-40%)",
        "Diuretics (thiazides, loop diuretics; additive risk of profound hyponatremia)"
      ]
    },
    monitoringParameters: [
      "Serum sodium levels (baseline, after 2-4 weeks, and periodically or if symptoms of hyponatremia such as nausea, confusion, headache, or malaise develop)",
      "HLA-B*1502 genetic screening prior to initiation in patients of Asian ancestry",
      "CBC, liver function, and renal function"
    ],
    dosageForms: [
      "Oral Tablet (Trileptal): 150 mg, 300 mg, 600 mg",
      "Oral Suspension: 300 mg/5 mL (60 mg/mL)",
      "Extended-Release Tablet (Oxtellar XR): 150 mg, 300 mg, 600 mg"
    ],
    administrationAndCounseling: [
      "Immediate-release tablets and suspension may be taken with or without food; take Oxtellar XR on an empty stomach at least 1 hour before or 2 hours after meals.",
      "Shake oral suspension well before use; use provided dosing syringe.",
      "Women taking oral birth control pills must use additional non-hormonal contraception.",
      "Contact your doctor if you experience extreme fatigue, confusion, nausea, or muscle weakness, which can be signs of low sodium in your blood.",
      "Stop taking and seek immediate emergency care if a rash, mouth sores, or skin peeling develops."
    ]
  },

  "Pregabalin": {
    genericName: "Pregabalin",
    brandNames: ["Lyrica", "Lyrica CR"],
    pharmacologicClass: "GABA Analog / Alpha-2-Delta Calcium Channel Ligand",
    therapeuticClass: "3. Anticonvulsant",
    mechanismOfAction: "Structural analog of GABA that does not bind GABAA, GABAB, or alter GABA reuptake; selectively binds with high affinity to the auxiliary alpha-2-delta subunit of presynaptic voltage-gated calcium channels in the CNS, reducing calcium influx and dampening exocytotic release of glutamate, substance P, and CGRP.",
    dosingRegimens: [
      "Neuropathic pain (diabetic peripheral neuropathy): Start 50 mg PO three times daily (150 mg/day); may increase to 100 mg PO three times daily (300 mg/day) within 1 week.",
      "Post-herpetic neuralgia: 150-300 mg/day PO divided in 2-3 doses; max 600 mg/day.",
      "Fibromyalgia: Start 75 mg PO twice daily; increase to 150 mg twice daily within 1 week (max 450 mg/day).",
      "Partial onset seizures adjunctive: 150-600 mg/day PO divided in 2-3 doses."
    ],
    sideEffects: {
      common: ["Dizziness", "Somnolence", "Peripheral edema", "Weight gain", "Dry mouth", "Blurred vision", "Ataxia", "Euphoria"],
      severe: ["Angioedema (swelling of face, mouth, lips, neck)", "Severe respiratory depression (especially when combined with opioids or in COPD)", "Rhabdomyolysis and creatine kinase elevation", "Thrombocytopenia", "Withdrawal seizures upon abrupt cessation"]
    },
    contraindications: [
      "Known hypersensitivity to pregabalin"
    ],
    drugInteractions: {
      major: [
        "Opioids and CNS depressants (synergistic central nervous system and respiratory depression, profound sedation, and fatal overdose risk)",
        "Benzodiazepines and alcohol (additive cognitive and motor impairment)"
      ],
      common: [
        "Thiazolidinediones / Pioglitazone (additive peripheral edema and weight gain in heart failure patients)",
        "ACE inhibitors (increased risk of angioedema and facial swelling)"
      ]
    },
    monitoringParameters: [
      "Renal function (serum creatinine, eGFR; pregabalin is >90% renally excreted unchanged and requires precise dose reduction for CrCl < 60 mL/min)",
      "Signs of peripheral edema and unexplained rapid weight gain",
      "Respiratory status when combined with CNS depressants",
      "Suicidal thoughts or behavioral changes"
    ],
    dosageForms: [
      "Oral Capsule: 25 mg, 50 mg, 75 mg, 100 mg, 150 mg, 200 mg, 225 mg, 300 mg",
      "Oral Solution: 20 mg/mL",
      "Extended-Release Tablet (Lyrica CR): 82.5 mg, 165 mg, 330 mg"
    ],
    administrationAndCounseling: [
      "May be taken with or without food; take Lyrica CR once daily after an evening meal.",
      "Schedule V controlled substance: take exactly as prescribed; do not share or increase dose on your own.",
      "Do not discontinue abruptly; taper gradually over at least 1 week to avoid withdrawal symptoms (insomnia, nausea, headache, anxiety, or rebound seizures).",
      "Avoid alcohol and consult your doctor before taking with prescription painkillers, sleeping pills, or allergy medicines.",
      "Report any vision changes, swelling of your hands/legs, or unexplained muscle soreness immediately."
    ]
  },

  "Topiramate": {
    genericName: "Topiramate",
    brandNames: ["Topamax", "Trokendi XR", "Qudexy XR"],
    pharmacologicClass: "Sulfamate-Substituted Monosaccharide Anticonvulsant",
    therapeuticClass: "3. Anticonvulsant",
    mechanismOfAction: "Multi-target neuronal stabilizer that blocks voltage-dependent sodium channels, potentiates GABAA receptor-mediated inhibitory currents at a non-benzodiazepine site, antagonizes AMPA/kainate glutamate excitatory receptors, and acts as a weak inhibitor of carbonic anhydrase isoenzymes II and IV.",
    dosingRegimens: [
      "Epilepsy (monotherapy or adjunctive): Start 25-50 mg/day PO; titrate weekly by 25-50 mg/day to target maintenance 200-400 mg/day divided in 2 doses.",
      "Migraine headache prophylaxis: Start 25 mg PO once daily at bedtime; increase by 25 mg/day weekly to target 50 mg PO twice daily (100 mg/day).",
      "Extended-Release (Trokendi XR / Qudexy XR): 100 mg PO once daily."
    ],
    sideEffects: {
      common: ["Paresthesias (tingling in fingers and toes)", "Cognitive slowing / psychomotor impairment ('Dopamax': word-finding difficulty, impaired memory)", "Weight loss and anorexia", "Taste perversion (carbonated beverages taste flat)", "Somnolence", "Dizziness"],
      severe: ["Secondary acute angle-closure glaucoma and acute myopia", "Oligohidrosis (decreased sweating) and hyperthermia (particularly in children)", "Metabolic acidosis (non-anion gap due to renal carbonic anhydrase inhibition)", "Nephrolithiasis (kidney stones)", "Major congenital malformations (cleft lip/palate) if taken in pregnancy"]
    },
    contraindications: [
      "Hypersensitivity to topiramate",
      "Recent alcohol consumption (within 6 hours prior to and 6 hours after Trokendi XR ingestion, due to dose-dumping)"
    ],
    drugInteractions: {
      major: [
        "Other carbonic anhydrase inhibitors (acetazolamide, zonisamide; markedly increases risk of metabolic acidosis and nephrolithiasis; avoid combination)",
        "Oral contraceptives (doses >200 mg/day induce CYP3A4, decreasing ethinyl estradiol clearance and causing contraceptive failure)"
      ],
      common: [
        "Valproic acid (concurrent use associated with hyperammonemia with or without encephalopathy, and hypothermia)",
        "Hydrochlorothiazide (increases topiramate plasma levels by ~29%)"
      ]
    },
    monitoringParameters: [
      "Baseline and periodic serum bicarbonate / electrolytes (monitor for hyperchloremic non-anion gap metabolic acidosis)",
      "Serum creatinine, renal function, and urinalysis",
      "Body weight and cognitive/memory performance",
      "Ophthalmic evaluation if ocular pain or blurred vision occurs",
      "Body temperature in pediatric patients or hot environments"
    ],
    dosageForms: [
      "Oral Tablet: 25 mg, 50 mg, 100 mg, 200 mg",
      "Oral Sprinkle Capsule: 15 mg, 25 mg",
      "Extended-Release Capsule (Trokendi XR): 25 mg, 50 mg, 100 mg, 200 mg",
      "Extended-Release Capsule (Qudexy XR): 25 mg, 50 mg, 100 mg, 150 mg, 200 mg"
    ],
    administrationAndCounseling: [
      "Drink plenty of water and stay well-hydrated throughout the day to reduce your risk of forming kidney stones.",
      "Sprinkle capsules may be swallowed whole or carefully opened and sprinkled over a small spoonful of soft applesauce (swallow immediately without chewing).",
      "Be careful in warm weather or during strenuous exercise; this medicine can reduce your ability to sweat and cause your body to overheat.",
      "Contact your doctor immediately if you notice sudden blurred vision or eye pain, as this can be a serious eye emergency.",
      "Women should use effective non-hormonal contraception as topiramate can cause birth defects (cleft lip) and reduce birth control pill effectiveness."
    ]
  },

  "Divalproex / Valproic Acid": {
    genericName: "Divalproex / Valproic Acid",
    brandNames: ["Depakote", "Depakote ER", "Depakote Sprinkles", "Depakene"],
    pharmacologicClass: "Histone Deacetylase Inhibitor / Broad-Spectrum AED",
    therapeuticClass: "3. Anticonvulsant",
    mechanismOfAction: "Multi-modal anticonvulsant and mood stabilizer that increases brain gamma-aminobutyric acid (GABA) concentrations by inhibiting GABA transaminase (GABA-T) and succinic semialdehyde dehydrogenase, blocks voltage-gated sodium channels, attenuates low-threshold T-type calcium currents, and acts as a histone deacetylase (HDAC) inhibitor.",
    dosingRegimens: [
      "Epilepsy complex partial seizures: Start 10-15 mg/kg/day PO; increase by 5-10 mg/kg/day weekly to target therapeutic serum level (50-100 mcg/mL, max 60 mg/kg/day).",
      "Bipolar acute mania: Start 750 mg/day PO in divided doses (or Depakote ER 25 mg/kg PO once daily), titrating rapidly to clinical response and serum level (50-125 mcg/mL).",
      "Migraine headache prophylaxis: Depakote ER 500-1000 mg PO once daily or delayed-release 250 mg PO twice daily."
    ],
    sideEffects: {
      common: ["Nausea", "Vomiting", "Somnolence", "Weight gain", "Alopecia (reversible hair thinning)", "Tremor", "Dyspepsia", "Diarrhea", "Thrombocytopenia"],
      severe: ["Fulminant and fatal hepatic failure (highest risk in children <2 years or mitochondrial POLG mutations)", "Life-threatening hemorrhagic pancreatitis", "Major congenital malformations (neural tube defects, spina bifida, impaired cognitive development/IQ)", "Hyperammonemic encephalopathy (with or without normal LFTs)", "Drug Reaction with Eosinophilia and Systemic Symptoms (DRESS)"]
    },
    contraindications: [
      "Severe hepatic disease or significant hepatic impairment",
      "Known mitochondrial disorders caused by mutations in the nuclear gene encoding mitochondrial DNA polymerase gamma (POLG)",
      "Known urea cycle disorders (precipitates catastrophic hyperammonemic coma)",
      "Pregnancy for migraine prophylaxis (contraindicated in all pregnant women; use in epilepsy/bipolar only if no alternatives exist)"
    ],
    blackBoxWarning: "Hepatic failure resulting in fatalities has occurred in patients receiving valproate, usually during the first 6 months of treatment. Children younger than 2 years of age are at considerably greater risk. Life-threatening pancreatitis has been reported in both children and adults. Valproate can cause major congenital malformations, particularly neural tube defects (spina bifida) and decreased IQ scores following in utero exposure; contraindicated for migraine prophylaxis in pregnant women.",
    drugInteractions: {
      major: [
        "Carbapenem antibiotics (meropenem, ertapenem, imipenem; rapidly cause profound drops in valproate serum levels up to 90% within 24 hours, causing breakthrough seizures; avoid combination)",
        "Lamotrigine (valproate inhibits lamotrigine glucuronidation, doubling lamotrigine half-life and dramatically elevating Stevens-Johnson syndrome risk; reduce lamotrigine dose by >=50%)"
      ],
      common: [
        "Aspirin and salicylates (displace valproate from albumin binding sites and inhibit metabolism, causing toxicity)",
        "Warfarin (displaced from protein binding, altering free fraction)"
      ]
    },
    monitoringParameters: [
      "Total serum valproic acid trough concentration (therapeutic range: 50-100 mcg/mL for seizures; 50-125 mcg/mL for mania)",
      "Baseline and frequent liver function tests (AST, ALT, bilirubin), especially during the first 6 months",
      "Complete blood count with differential and platelet count prior to surgery and periodically",
      "Serum ammonia level if patient presents with lethargy, vomiting, or altered mental status",
      "Pregnancy test prior to initiation in female patients"
    ],
    dosageForms: [
      "Delayed-Release Tablet (Depakote): 125 mg, 250 mg, 500 mg",
      "Extended-Release Tablet (Depakote ER): 250 mg, 500 mg",
      "Delayed-Release Sprinkle Capsule (Depakote Sprinkles): 125 mg",
      "Oral Capsule (valproic acid, Depakene): 250 mg",
      "Oral Syrup (valproate sodium): 250 mg/5 mL"
    ],
    administrationAndCounseling: [
      "Take with meals to minimize stomach irritation, nausea, and indigestion.",
      "Swallow tablets whole; do not chew or crush delayed-release or extended-release tablets as this irritates the mouth and causes premature drug release.",
      "Depakote Sprinkles may be swallowed whole or opened and sprinkled onto a small amount of cool applesauce or pudding (swallow immediately without chewing).",
      "Seek urgent medical evaluation immediately if you experience abdominal pain radiating to your back with nausea/vomiting (pancreatitis), extreme lethargy, or yellowing of the skin/eyes (liver failure).",
      "Women of childbearing potential must use highly effective contraception; this medication causes severe birth defects and decreases children's IQ."
    ]
  },

  "Gabapentin": {
    genericName: "Gabapentin",
    brandNames: ["Neurontin", "Gralise", "Horizant"],
    pharmacologicClass: "GABA Analog / Alpha-2-Delta Calcium Channel Ligand",
    therapeuticClass: "3. Anticonvulsant",
    mechanismOfAction: "Lipophilic GABA structural analog that crosses the blood-brain barrier via the system L-amino acid transporter and binds selectively with high affinity to the auxiliary alpha-2-delta-1 subunit of presynaptic voltage-gated calcium channels, attenuating calcium influx and decreasing release of excitatory neurotransmitters; absorption is non-linear and saturable due to transporter capacity.",
    dosingRegimens: [
      "Post-herpetic neuralgia: Day 1: 300 mg PO once daily; Day 2: 300 mg PO twice daily; Day 3: 300 mg PO three times daily; titrate up to 1800 mg/day (600 mg PO three times daily; max 3600 mg/day).",
      "Focal onset seizures adjunctive: 300-1200 mg PO three times daily (range 900-3600 mg/day).",
      "Renal dose adjustments: CrCl 30-59: 200-700 mg bid; CrCl 15-29: 200-700 mg daily; CrCl <15: 100-300 mg daily."
    ],
    sideEffects: {
      common: ["Somnolence", "Dizziness", "Ataxia", "Fatigue", "Peripheral edema", "Nystagmus", "Tremor", "Weight gain", "Dry mouth"],
      severe: ["Severe respiratory depression (especially when co-administered with opioids or in elderly/COPD patients)", "Anaphylaxis and angioedema", "Drug reaction with eosinophilia and systemic symptoms (DRESS)", "Sudden unexpected death in epilepsy (SUDEP) / withdrawal seizures"]
    },
    contraindications: [
      "Known hypersensitivity to gabapentin"
    ],
    drugInteractions: {
      major: [
        "Opioids (morphine, oxycodone, hydrocodone, fentanyl; co-administration causes additive severe CNS depression, respiratory depression, and increased overdose fatality risk)"
      ],
      common: [
        "Antacids containing aluminum and magnesium (reduce gabapentin bioavailability by approximately 20%; separate by at least 2 hours)",
        "Alcohol and sedatives (additive motor and cognitive impairment)"
      ]
    },
    monitoringParameters: [
      "Renal function (serum creatinine, eGFR; mandatory dosage reduction in renal insufficiency due to 100% renal elimination)",
      "Respiratory status, particularly in patients receiving concomitant opioid analgesics",
      "Suicidal thoughts or behaviors and mood changes",
      "Pain relief or seizure frequency"
    ],
    dosageForms: [
      "Oral Capsule (Neurontin): 100 mg, 300 mg, 400 mg",
      "Oral Tablet: 600 mg, 800 mg",
      "Oral Solution: 250 mg/5 mL (50 mg/mL)",
      "Once-Daily Tablet (Gralise): 300 mg, 600 mg",
      "Extended-Release Prodrug Tablet (Horizant, gabapentin enacarbil): 300 mg, 600 mg"
    ],
    administrationAndCounseling: [
      "May be taken with or without food; take Gralise with the evening meal.",
      "If you break an 800 mg or 600 mg scored tablet in half, take the remaining half-tablet as your next scheduled dose; discard unused half-tablets after 28 days.",
      "Do not stop taking gabapentin abruptly; your doctor will taper your dose over at least 1 week to avoid rebound pain or withdrawal seizures.",
      "Avoid alcohol and use extreme caution if your doctor also prescribes an opioid pain medicine; the combination can cause dangerously slow breathing.",
      "Report any swelling in your legs, excessive sleepiness, or unusual changes in mood or behavior."
    ]
  }
};
