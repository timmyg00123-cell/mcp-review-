import type { TopDrugClinicalMonograph } from './types.js';

const GLP1_BBW = "Liraglutide and GLP-1 receptor agonists cause thyroid C-cell tumors at clinically relevant exposures in rodents. It is unknown whether these agents cause thyroid C-cell tumors, including medullary thyroid carcinoma (MTC), in humans. Contraindicated in patients with a personal or family history of MTC or in patients with Multiple Endocrine Neoplasia syndrome type 2 (MEN 2).";

export const CAT05_06_ANTIDIABETICS: Record<string, TopDrugClinicalMonograph> = {
  // ==========================================
  // Category 5: Antidiabetic Agent --- Oral
  // ==========================================
  "Metformin": {
    genericName: "Metformin",
    brandNames: ["Glucophage", "Glucophage XR", "Fortamet", "Glumetza", "Riomet"],
    pharmacologicClass: "Biguanide Antihyperglycemic",
    therapeuticClass: "5. Antidiabetic Agent --- Oral",
    mechanismOfAction: "Activates adenosine monophosphate-activated protein kinase (AMPK) in hepatocytes, reducing hepatic gluconeogenesis and glycogenolysis; increases peripheral glucose uptake and utilization in skeletal muscle; improves insulin sensitivity and decreases intestinal glucose absorption without stimulating insulin secretion.",
    dosingRegimens: [
      "Type 2 diabetes mellitus (Immediate-Release): Start 500 mg PO twice daily or 850 mg once daily with meals; titrate by 500 mg weekly or 850 mg every 2 weeks to target maintenance 2000-2550 mg/day (max 2550 mg/day in divided doses).",
      "Extended-Release (Glucophage XR): Start 500-1000 mg PO once daily with the evening meal; titrate by 500 mg weekly up to 2000 mg PO once daily (or 1000 mg twice daily).",
      "Renal dosing: eGFR 45-59 mL/min: Max 1000 mg/day; eGFR 30-44 mL/min: Not recommended to initiate, max 1000 mg/day if already taking; eGFR < 30 mL/min: Contraindicated."
    ],
    sideEffects: {
      common: ["Diarrhea", "Nausea", "Vomiting", "Flatulence", "Abdominal discomfort", "Indigestion", "Metallic taste in mouth", "Vitamin B12 deficiency (long-term use)"],
      severe: ["Lactic acidosis (rare but life-threatening metabolic emergency characterized by elevated blood lactate >5 mmol/L, anion gap metabolic acidosis, and hypothermia)", "Hemolytic anemia"]
    },
    contraindications: [
      "Severe renal impairment (eGFR < 30 mL/min)",
      "Acute or chronic metabolic acidosis, including diabetic ketoacidosis (DKA)",
      "Hypersensitivity to metformin hydrochloride",
      "Undergoing iodinated contrast imaging procedures in patients with eGFR 30-60 mL/min or liver disease (hold for 48 hours post-procedure)"
    ],
    blackBoxWarning: "Postmarketing cases of metformin-associated lactic acidosis have resulted in death, hypothermia, hypotension, and resistant bradyarrhythmias. Onset of metformin-associated lactic acidosis is often subtle, accompanied by non-specific symptoms such as malaise, myalgias, respiratory distress, somnolence, and abdominal distress. Risk factors include renal impairment, concomitant medications, age 65 years or older, radiological study with contrast, surgical procedures, hypoxic states, and excessive alcohol intake.",
    drugInteractions: {
      major: [
        "Iodinated radiocontrast agents (acute contrast-induced nephropathy leads to rapid metformin accumulation and catastrophic lactic acidosis; withhold metformin prior to procedure and restart 48 hours after if renal function is stable)",
        "Carbonic anhydrase inhibitors (topiramate, acetazolamide; additive risk of severe metabolic acidosis)"
      ],
      common: [
        "Cationic drugs / OCT2 inhibitors (cimetidine, dolutegravir, ranolazine; reduce metformin renal clearance, increasing systemic exposure)",
        "Alcohol (potentiates metformin's effect on lactate metabolism, elevating lactic acidosis risk)"
      ]
    },
    monitoringParameters: [
      "Renal function (eGFR and serum creatinine) at baseline and at least annually (every 3-6 months if eGFR < 60 mL/min)",
      "Hemoglobin A1c every 3 months until stable, then at least twice yearly",
      "Serum vitamin B12 levels every 2 to 3 years (evaluate for peripheral neuropathy or megaloblastic anemia)",
      "Signs and symptoms of lactic acidosis (extreme fatigue, severe muscle aches, slow breathing, stomach pain)"
    ],
    dosageForms: [
      "Oral Tablet (Glucophage): 500 mg, 850 mg, 1000 mg",
      "Extended-Release Tablet (Glucophage XR): 500 mg, 750 mg",
      "Extended-Release Tablet (Fortamet): 500 mg, 1000 mg",
      "Extended-Release Tablet (Glumetza): 500 mg, 1000 mg",
      "Oral Solution (Riomet): 500 mg/5 mL"
    ],
    administrationAndCounseling: [
      "Take with meals to reduce stomach upset, nausea, and diarrhea.",
      "Take extended-release tablets with your evening meal; swallow whole and do not crush, chew, or break them.",
      "You may occasionally notice an empty tablet shell in your stool (with extended-release formulations like Glumetza); this is normal and the medicine has been absorbed.",
      "Avoid excessive alcohol intake while taking this medicine.",
      "Stop taking this medicine and seek emergency medical care immediately if you feel unusually cold, extremely weak, have severe stomach pain, or have trouble breathing."
    ]
  },

  "Glimepiride": {
    genericName: "Glimepiride",
    brandNames: ["Amaryl"],
    pharmacologicClass: "Second-Generation Sulfonylurea Secretagogue",
    therapeuticClass: "5. Antidiabetic Agent --- Oral",
    mechanismOfAction: "Stimulates insulin release from functioning pancreatic beta cells by binding to the sulfonylurea receptor 1 (SUR1) subunit on ATP-sensitive potassium channels (KATP), causing channel closure, membrane depolarization, calcium influx via voltage-gated calcium channels, and exocytosis of insulin granules; may also enhance peripheral insulin sensitivity.",
    dosingRegimens: [
      "Type 2 diabetes mellitus: Start 1-2 mg PO once daily with breakfast or the first main meal; titrate by 1-2 mg every 1-2 weeks based on blood glucose to target maintenance 1-4 mg once daily (max 8 mg/day).",
      "Elderly or renal impairment (eGFR < 60 mL/min): Start 1 mg PO once daily."
    ],
    sideEffects: {
      common: ["Hypoglycemia", "Weight gain", "Dizziness", "Headache", "Nausea", "Asthenia"],
      severe: ["Severe, prolonged hypoglycemia (can be refractory and persist for days)", "Hemolytic anemia (especially in G6PD deficiency)", "Aplastic anemia and agranulocytosis", "Cholestatic jaundice / hepatitis", "Increased cardiovascular mortality (historic sulfonylurea class warning)"]
    },
    contraindications: [
      "Known hypersensitivity to glimepiride or other sulfonylureas or sulfonamides",
      "Type 1 diabetes mellitus or treatment of diabetic ketoacidosis"
    ],
    drugInteractions: {
      major: [
        "CYP2C9 inhibitors (fluconazole, miconazole, sulfamethoxazole/trimethoprim; dramatically increase glimepiride levels, precipitating severe hypoglycemia)",
        "Beta-blockers (mask warning signs of hypoglycemia such as tachycardia and tremor; non-selective agents impair gluconeogenesis)"
      ],
      common: [
        "Salicylates / NSAIDs (displace glimepiride from plasma protein binding, enhancing hypoglycemic effect)",
        "Thiazide diuretics and corticosteroids (antagonize glycemic control, causing hyperglycemia)"
      ]
    },
    monitoringParameters: [
      "Self-monitored blood glucose (SMBG) and HbA1c (every 3 months)",
      "Symptoms of hypoglycemia (sweating, palpitations, dizziness, confusion)",
      "Renal function and complete blood count with differential"
    ],
    dosageForms: [
      "Oral Tablet: 1 mg, 2 mg, 3 mg, 4 mg"
    ],
    administrationAndCounseling: [
      "Take once daily with breakfast or your first main meal of the day; DO NOT skip meals after taking your dose.",
      "Always carry a fast-acting source of carbohydrates (glucose tablets, fruit juice, candy) to treat low blood sugar.",
      "Recognize symptoms of low blood sugar: sweating, shakiness, fast heartbeat, hunger, headache, and confusion.",
      "Wear medical identification indicating that you have diabetes and take a sulfonylurea.",
      "Avoid binge drinking alcohol, which can cause severe sudden drops in blood sugar."
    ]
  },

  "Glipizide": {
    genericName: "Glipizide",
    brandNames: ["Glucotrol", "Glucotrol XL"],
    pharmacologicClass: "Second-Generation Sulfonylurea Secretagogue",
    therapeuticClass: "5. Antidiabetic Agent --- Oral",
    mechanismOfAction: "Potent second-generation sulfonylurea that binds with high affinity to pancreatic beta-cell SUR1 receptors, closing KATP channels, depolarizing cell membranes, and triggering rapid, biphasic insulin exocytosis; short half-life minimizes prolonged nocturnal hypoglycemia compared to glyburide.",
    dosingRegimens: [
      "Type 2 diabetes (Immediate-Release Glucotrol): Start 5 mg PO once daily 30 minutes before breakfast; titrate by 2.5-5 mg every few days up to 10-20 mg/day (doses >10 mg divided twice daily; max 40 mg/day).",
      "Extended-Release (Glucotrol XL): Start 5 mg PO once daily with breakfast; titrate up to 10-20 mg once daily (max 20 mg/day).",
      "Elderly / hepatic / renal impairment: Start 2.5 mg PO once daily."
    ],
    sideEffects: {
      common: ["Hypoglycemia", "Weight gain", "Dizziness", "Nausea", "Diarrhea", "Dyspepsia", "Tremor"],
      severe: ["Severe prolonged hypoglycemia", "Cholestatic jaundice and hepatic necrosis", "Aplastic anemia and thrombocytopenia", "Disulfiram-like ethanol reaction"]
    },
    contraindications: [
      "Hypersensitivity to glipizide or other sulfonamide derivatives",
      "Type 1 diabetes mellitus or diabetic ketoacidosis"
    ],
    drugInteractions: {
      major: [
        "CYP2C9 inhibitors (fluconazole, voriconazole; dramatically elevate glipizide levels, causing severe hypoglycemia)",
        "Beta-blockers (propranolol, atenolol; blunt sympathetic symptoms of hypoglycemia like tachycardia)"
      ],
      common: [
        "Warfarin (displaces sulfonylurea from protein binding; potential enhanced anticoagulation and hypoglycemia)",
        "Corticosteroids, thiazides, and oral contraceptives (elevate blood glucose, blunting glipizide efficacy)"
      ]
    },
    monitoringParameters: [
      "Fasting plasma glucose, postprandial glucose, and HbA1c",
      "Frequency of hypoglycemic episodes",
      "Renal and hepatic function panels"
    ],
    dosageForms: [
      "Oral Tablet (Glucotrol): 5 mg, 10 mg",
      "Extended-Release Tablet (Glucotrol XL): 2.5 mg, 5 mg, 10 mg"
    ],
    administrationAndCounseling: [
      "Take immediate-release glipizide 30 minutes before your morning meal for optimal insulin secretion; take extended-release (XL) with breakfast.",
      "Swallow Glucotrol XL tablets whole; do not chew, crush, or divide.",
      "The empty tablet shell of Glucotrol XL may appear in your stool; this is harmless and does not mean the dose was lost.",
      "Eat regular meals; never skip meals while taking this medication.",
      "Keep fast-acting glucose tablets or gel readily available at all times."
    ]
  },

  "Pioglitazone": {
    genericName: "Pioglitazone",
    brandNames: ["Actos"],
    pharmacologicClass: "Thiazolidinedione (TZD) / PPAR-Gamma Agonist",
    therapeuticClass: "5. Antidiabetic Agent --- Oral",
    mechanismOfAction: "Potent and selective agonist for peroxisome proliferator-activated receptor-gamma (PPAR-gamma) nuclear receptors, regulating the transcription of insulin-responsive genes involved in glucose and lipid metabolism; increases GLUT4 expression, markedly enhancing insulin sensitivity in adipose tissue, skeletal muscle, and liver without stimulating beta-cell insulin secretion.",
    dosingRegimens: [
      "Type 2 diabetes mellitus: Start 15-30 mg PO once daily with or without food; titrate in increments of 15 mg based on glycemic response up to maximum 45 mg PO once daily.",
      "Patients with NYHA Class I/II heart failure: If initiated at all, start at 15 mg PO once daily and titrate with extreme caution."
    ],
    sideEffects: {
      common: ["Peripheral edema / fluid retention", "Weight gain", "Upper respiratory tract infection", "Headache", "Sinusitis", "Myalgia"],
      severe: ["Congestive heart failure exacerbation (fluid retention leading to decompensated heart failure)", "Bladder cancer (potential increased risk with prolonged use >1 year or high cumulative doses)", "Bone fractures (increased risk in distal extremities of female patients)", "Macular edema with decreased visual acuity", "Hepatotoxicity"]
    },
    contraindications: [
      "New York Heart Association (NYHA) Class III or IV heart failure",
      "Active bladder cancer or prior history of bladder cancer",
      "Uninvestigated macroscopic hematuria",
      "Known hypersensitivity to pioglitazone"
    ],
    blackBoxWarning: "Thiazolidinediones, including pioglitazone, cause or exacerbate congestive heart failure in some patients. After initiation of pioglitazone, and after dose increases, observe patients carefully for signs and symptoms of heart failure (including excessive, rapid weight gain, dyspnea, and/or edema). If these signs and symptoms develop, the heart failure should be managed according to current standards of care. Furthermore, discontinuation or dose reduction of pioglitazone must be considered. Pioglitazone is not recommended in patients with symptomatic heart failure and is contraindicated in patients with NYHA Class III or IV heart failure.",
    drugInteractions: {
      major: [
        "Insulin (co-administration markedly increases the risk of severe peripheral edema and congestive heart failure decompensation)",
        "Strong CYP2C8 inhibitors (gemfibrozil; increases pioglitazone AUC by 3-fold; limit pioglitazone dose to 15 mg daily)"
      ],
      common: [
        "Strong CYP2C8 inducers (rifampin; decreases pioglitazone AUC by >50%)",
        "Oral contraceptives (mild reduction in ethinyl estradiol/norethindrone levels)"
      ]
    },
    monitoringParameters: [
      "Cardiovascular status: Monitor closely for signs and symptoms of congestive heart failure (rapid unexplained weight gain, bilateral lower extremity edema, shortness of breath on exertion or lying flat)",
      "Hemoglobin A1c and fasting blood glucose",
      "Liver function tests (AST, ALT, bilirubin) prior to initiation and periodically",
      "Urinalysis and hematuria evaluation (rule out bladder neoplasms)",
      "Ophthalmic evaluation if visual changes occur"
    ],
    dosageForms: [
      "Oral Tablet: 15 mg, 30 mg, 45 mg"
    ],
    administrationAndCounseling: [
      "Take once daily with or without food at the same time each day.",
      "Expect that full therapeutic glycemic benefits may take 8 to 12 weeks to develop.",
      "Promptly report any sudden rapid weight gain, swelling in your ankles or legs, or shortness of breath to your doctor immediately (signs of heart failure).",
      "Report any blood in your urine, burning while urinating, or new pelvic pain (signs of bladder problems).",
      "Women should be aware of an increased risk of bone fractures (hand, arm, or foot fractures) and ensure adequate calcium and vitamin D intake."
    ]
  },

  "Linagliptin": {
    genericName: "Linagliptin",
    brandNames: ["Tradjenta"],
    pharmacologicClass: "Dipeptidyl Peptidase-4 (DPP-4) Inhibitor / Incretin Enhancer",
    therapeuticClass: "5. Antidiabetic Agent --- Oral",
    mechanismOfAction: "Reversibly and competitively inhibits dipeptidyl peptidase-4 (DPP-4), slowing the rapid enzymatic degradation of endogenous incretin hormones (GLP-1 and GIP); increases postprandial glucose-dependent insulin secretion and suppresses glucagon release; uniquely eliminated predominantly via bile/feces without requiring renal dose adjustments.",
    dosingRegimens: [
      "Type 2 diabetes mellitus: 5 mg PO once daily with or without food.",
      "Renal / Hepatic impairment: 5 mg PO once daily; NO dose adjustment required regardless of eGFR, dialysis, or hepatic status."
    ],
    sideEffects: {
      common: ["Nasopharyngitis", "Cough", "Headache", "Back pain", "Hyperuricemia", "Upper respiratory tract infection"],
      severe: ["Acute pancreatitis (fatal and non-fatal hemorrhagic/necrotizing pancreatitis)", "Severe and disabling arthralgia / joint pain", "Bullous pemphigoid (autoimmune blistering skin condition)", "Heart failure hospitalization (class warning)", "Anaphylaxis and angioedema"]
    },
    contraindications: [
      "History of serious hypersensitivity reaction to linagliptin (anaphylaxis, angioedema, exfoliative skin conditions)"
    ],
    drugInteractions: {
      major: [
        "Potent P-glycoprotein and CYP3A4 inducers (rifampin, carbamazepine, St. John's Wort; significantly reduce linagliptin efficacy; alternative antidiabetic strongly recommended)"
      ],
      common: [
        "Sulfonylureas / Insulin (co-administration increases hypoglycemia risk; consider lower sulfonylurea/insulin dose)"
      ]
    },
    monitoringParameters: [
      "Hemoglobin A1c (every 3 months)",
      "Signs and symptoms of acute pancreatitis (persistent, severe abdominal pain radiating to the back, with vomiting)",
      "Skin checks for blisters or erosions (bullous pemphigoid)",
      "Severe joint pain"
    ],
    dosageForms: [
      "Oral Tablet: 5 mg"
    ],
    administrationAndCounseling: [
      "Take once daily with or without food at any time of day.",
      "No dosage adjustments are necessary even if your kidney function changes.",
      "Stop taking this medicine and call your doctor immediately if you experience severe, persistent stomach pain that radiates to your back, with or without vomiting.",
      "Contact your doctor if you experience severe joint pain that limits your walking or mobility, or if skin blisters develop."
    ]
  },

  "Sitagliptin": {
    genericName: "Sitagliptin",
    brandNames: ["Januvia"],
    pharmacologicClass: "Dipeptidyl Peptidase-4 (DPP-4) Inhibitor / Incretin Enhancer",
    therapeuticClass: "5. Antidiabetic Agent --- Oral",
    mechanismOfAction: "Highly selective and competitive inhibitor of DPP-4 that prevents the proteolytic cleavage and inactivation of endogenous incretins (GLP-1 and GIP), prolonging their active half-life and stimulating glucose-dependent insulin biosynthesis and exocytosis from pancreatic beta cells while inhibiting inappropriate glucagon release from alpha cells.",
    dosingRegimens: [
      "Type 2 diabetes (normal renal function or eGFR >= 45 mL/min): 100 mg PO once daily with or without food.",
      "Moderate renal impairment (eGFR 30 to < 45 mL/min): 50 mg PO once daily.",
      "Severe renal impairment / End-stage renal disease (eGFR < 30 mL/min or hemodialysis): 25 mg PO once daily without regard to dialysis timing."
    ],
    sideEffects: {
      common: ["Upper respiratory tract infection", "Nasopharyngitis", "Headache", "Diarrhea", "Nausea", "Dyspepsia"],
      severe: ["Acute pancreatitis (hemorrhagic or necrotizing)", "Severe and disabling arthralgia", "Bullous pemphigoid", "Acute renal failure (tubulointerstitial nephritis)", "Severe hypersensitivity reactions / angioedema"]
    },
    contraindications: [
      "History of serious hypersensitivity reaction to sitagliptin (anaphylaxis, angioedema, Stevens-Johnson syndrome)"
    ],
    drugInteractions: {
      major: [
        "Insulin secretagogues / Insulin (additive risk of hypoglycemia; reduced dose of sulfonylurea or insulin may be required)"
      ],
      common: [
        "Digoxin (slight increase in digoxin peak concentration and AUC; monitor digoxin levels)"
      ]
    },
    monitoringParameters: [
      "Renal function (serum creatinine, eGFR) prior to initiation and periodically (mandatory for appropriate dose adjustment)",
      "Hemoglobin A1c and blood glucose",
      "Persistent severe abdominal pain (rule out acute pancreatitis)",
      "Signs of hypersensitivity or autoimmune bullous skin eruptions"
    ],
    dosageForms: [
      "Oral Tablet: 25 mg, 50 mg, 100 mg"
    ],
    administrationAndCounseling: [
      "Take once daily with or without food.",
      "Your doctor will check your kidney function to ensure you are taking the correct strength (25 mg, 50 mg, or 100 mg).",
      "Discontinue immediately and seek urgent medical care if you develop severe, persistent stomach pain that spreads to your back, with or without nausea and vomiting.",
      "Report any severe joint stiffness or pain, or the appearance of skin blisters or rash."
    ]
  },

  "Canagliflozin": {
    genericName: "Canagliflozin",
    brandNames: ["Invokana"],
    pharmacologicClass: "Sodium-Glucose Cotransporter 2 (SGLT2) Inhibitor",
    therapeuticClass: "5. Antidiabetic Agent --- Oral",
    mechanismOfAction: "Inhibits sodium-glucose cotransporter 2 (SGLT2) in the S1 segment of the renal proximal convoluted tubule, blocking glucose and sodium reabsorption, lowering the renal threshold for glucose, and promoting urinary excretion of ~80-100 g glucose/day; also lowers intraglomerular pressure, providing cardiorenal protection.",
    dosingRegimens: [
      "Type 2 diabetes / Diabetic kidney disease / CV risk reduction: Start 100 mg PO once daily taken before the first meal of the day; may increase to 300 mg PO once daily in patients tolerating 100 mg with eGFR >= 60 mL/min who require additional glycemic control.",
      "Renal limitations: eGFR 30 to <60 mL/min: Dose capped at 100 mg once daily; eGFR < 30 mL/min: Not recommended for glycemic control alone, but 100 mg daily may be continued to reduce diabetic kidney disease progression until dialysis is initiated."
    ],
    sideEffects: {
      common: ["Vulvovaginal candidiasis (female mycotic genital infections)", "Mycotic balanitis (male fungal infections)", "Urinary tract infections", "Increased urination / polyuria", "Thirst", "Constipation", "Nausea"],
      severe: ["Euglycemic diabetic ketoacidosis (euDKA: ketoacidosis occurring with near-normal blood glucose <250 mg/dL)", "Urosepsis and pyelonephritis", "Necrotizing fasciitis of the perineum (Fournier's gangrene)", "Lower limb amputations (primarily toes/midfoot, especially in patients with prior amputation or peripheral vascular disease)", "Volume depletion / orthostatic hypotension and acute kidney injury", "Bone fractures / decreased bone mineral density", "Hyperkalemia"]
    },
    contraindications: [
      "Severe hypersensitivity to canagliflozin",
      "Patients on dialysis"
    ],
    drugInteractions: {
      major: [
        "Loop diuretics / Thiazides (additive intravascular volume contraction, orthostatic hypotension, and prerenal acute kidney injury)"
      ],
      common: [
        "UGT enzyme inducers (rifampin, phenytoin, phenobarbital; decrease canagliflozin AUC by ~51%; consider increasing dose from 100 to 300 mg if eGFR >= 60 mL/min)",
        "Digoxin (canagliflozin increases digoxin AUC and peak concentration; monitor digoxin levels)",
        "Insulin / Sulfonylureas (increased hypoglycemia risk)"
      ]
    },
    monitoringParameters: [
      "Renal function (baseline serum creatinine, eGFR; assess volume status prior to initiation)",
      "Signs and symptoms of diabetic ketoacidosis (nausea, vomiting, abdominal pain, malaise, shortness of breath, even if blood sugar is normal)",
      "Comprehensive lower extremity foot examination (promptly evaluate ulcers, sores, or infections)",
      "Genital skin inspection and perineal pain/swelling (Fournier's gangrene evaluation)",
      "Serum potassium in patients with renal impairment taking ACEi/ARBs or potassium-sparing diuretics"
    ],
    dosageForms: [
      "Oral Tablet: 100 mg, 300 mg"
    ],
    administrationAndCounseling: [
      "Take once daily before your first meal of the day with a glass of water.",
      "Maintain adequate hydration throughout the day to avoid dehydration and dizziness.",
      "Perform daily foot inspections for cuts, sores, blisters, or redness, and notify your podiatrist or physician immediately if any foot lesions develop.",
      "Practice meticulous perineal hygiene; contact doctor if you experience genital redness, itching, discharge, or severe pain/swelling in the groin area.",
      "STOP taking this medication and seek emergency care immediately if you have nausea, vomiting, stomach pain, confusion, or difficulty breathing, even if your blood sugar is not high."
    ]
  },

  // ==========================================
  // Category 6: Antidiabetic Agent --- Injectable/Insulin Product
  // ==========================================
  "Insulin Lispro": {
    genericName: "Insulin Lispro",
    brandNames: ["Humalog", "Humalog KwikPen", "Admelog", "Lyumjev"],
    pharmacologicClass: "Rapid-Acting Human Insulin Analog",
    therapeuticClass: "6. Antidiabetic Agent --- Injectable/Insulin Product",
    mechanismOfAction: "Recombinant human insulin analog in which proline at B28 and lysine at B29 are inverted, preventing hexamer formation and enabling rapid dissociation into active monomers upon subcutaneous injection; onset 15 minutes, peak 30-90 minutes, duration 3-5 hours; stimulates glucose uptake via GLUT4 translocation and suppresses hepatic glucose output.",
    dosingRegimens: [
      "Type 1 and Type 2 diabetes prandial control: Individualized subcutaneous dosing administered within 15 minutes before or immediately after a meal; typically comprises 50-60% of total daily insulin requirements divided among meals based on carbohydrate counting and insulin-to-carbohydrate ratios.",
      "Continuous subcutaneous insulin infusion (CSII / insulin pumps): Administer as programmed basal rates and prandial boluses."
    ],
    sideEffects: {
      common: ["Hypoglycemia", "Injection site reactions (erythema, itching)", "Lipodystrophy (lipohypertrophy or lipoatrophy with repeated injections at same site)", "Weight gain", "Mild peripheral edema"],
      severe: ["Severe, life-threatening hypoglycemia (seizures, coma, brain injury)", "Severe hypokalemia (insulin drives potassium into cells, potentially causing fatal cardiac arrhythmias)", "Systemic anaphylaxis and severe angioedema"]
    },
    contraindications: [
      "During episodes of hypoglycemia",
      "Known hypersensitivity to insulin lispro or any excipients"
    ],
    drugInteractions: {
      major: [
        "Thiazolidinediones / Pioglitazone (additive fluid retention, accelerating congestive heart failure)",
        "Beta-blockers (blunt sympathomimetic symptoms of hypoglycemia like tachycardia and palpitations)"
      ],
      common: [
        "Oral antidiabetic agents (additive hypoglycemia risk)",
        "Corticosteroids, atypical antipsychotics, sympathomimetics (increase blood glucose, increasing insulin requirements)"
      ]
    },
    monitoringParameters: [
      "Blood glucose self-monitoring (pre-prandial, post-prandial, bedtime, and 2-3 AM if nocturnal hypoglycemia suspected)",
      "Hemoglobin A1c (every 3 months)",
      "Serum potassium in patients at risk for hypokalemia (e.g., IV insulin or concurrent potassium-wasting diuretics)",
      "Injection site inspection for lipohypertrophy"
    ],
    dosageForms: [
      "Subcutaneous Solution: 100 units/mL (U-100) in 10 mL vials",
      "Prefilled Disposable Pen (KwikPen): 100 units/mL (3 mL), 200 units/mL (3 mL)",
      "Ultra-Rapid Formulation (Lyumjev): 100 units/mL, 200 units/mL"
    ],
    administrationAndCounseling: [
      "Inject subcutaneously into the abdomen, thigh, buttock, or upper arm within 15 minutes before eating or immediately after finishing a meal.",
      "Rotate injection sites with each injection to prevent lumpy, thickened skin (lipohypertrophy), which causes erratic absorption.",
      "Do not inject into skin that is tender, bruised, scaly, or hard.",
      "Always carry fast-acting glucose tablets or juice to treat low blood sugar.",
      "Store unopened vials and pens in the refrigerator (36°F to 46°F); once in use, keep at room temperature and discard after 28 days."
    ]
  },

  "Insulin Aspart": {
    genericName: "Insulin Aspart",
    brandNames: ["Novolog", "Novolog FlexPen", "Fiasp"],
    pharmacologicClass: "Rapid-Acting Human Insulin Analog",
    therapeuticClass: "6. Antidiabetic Agent --- Injectable/Insulin Product",
    mechanismOfAction: "Recombinant insulin analog engineered by substituting proline with negatively charged aspartic acid at position B28, causing charge repulsion that prevents self-association into hexamers; monomers are absorbed rapidly into capillary circulation (onset 10-20 min, peak 1-3 hours, duration 3-5 hours) to control postprandial glycemic excursions.",
    dosingRegimens: [
      "Prandial diabetes therapy: Subcutaneous injection individualized based on blood glucose and carbohydrate intake, administered 5-10 minutes before meals (or immediately after starting meal; Fiasp can be given at start of meal or up to 20 minutes after start of meal).",
      "Insulin pump infusion: Change reservoir and infusion set at least every 48-72 hours."
    ],
    sideEffects: {
      common: ["Hypoglycemia", "Injection site hypertrophy or irritation", "Weight gain", "Nasopharyngitis", "Headache"],
      severe: ["Severe hypoglycemic shock, seizures, or coma", "Severe hypokalemia", "Generalized systemic hypersensitivity reactions"]
    },
    contraindications: [
      "During acute episodes of hypoglycemia",
      "Known hypersensitivity to insulin aspart or excipients"
    ],
    drugInteractions: {
      major: [
        "Thiazolidinediones / TZDs (fluid retention and heart failure risk)",
        "Beta-adrenergic blockers (mask hypoglycemic warning signs)"
      ],
      common: [
        "Alcohol (causes severe delayed hypoglycemia by blocking hepatic gluconeogenesis)",
        "MAOIs, ACE inhibitors, salicylates (enhance insulin sensitivity, increasing hypoglycemia risk)"
      ]
    },
    monitoringParameters: [
      "Capillary blood glucose or continuous glucose monitoring (CGM) readings",
      "Hemoglobin A1c",
      "Serum potassium in high-dose therapy or DKA management",
      "Body weight and injection sites"
    ],
    dosageForms: [
      "Subcutaneous / IV Solution: 100 units/mL (U-100) in 10 mL vial",
      "Prefilled Pen (FlexPen / FlexTouch): 100 units/mL (3 mL)",
      "Ultra-Fast Formulation (Fiasp): 100 units/mL vial and FlexTouch pen"
    ],
    administrationAndCounseling: [
      "Inject subcutaneously into abdomen, buttocks, thighs, or upper arms 5 to 10 minutes before a meal.",
      "Rotate injection sites systematically within the chosen anatomical region.",
      "Check blood sugar before injecting; do not inject if blood sugar is low without eating first.",
      "Keep unopened vials and pens refrigerated; in-use pens/vials may be stored at room temperature up to 28 days."
    ]
  },

  "Regular Human Insulin": {
    genericName: "Regular Human Insulin",
    brandNames: ["Humulin R", "Novolin R", "Humulin R U-500"],
    pharmacologicClass: "Short-Acting Recombinant Human Insulin",
    therapeuticClass: "6. Antidiabetic Agent --- Injectable/Insulin Product",
    mechanismOfAction: "Native recombinant human insulin polypeptide that exists as zinc-stabilized hexamers in neutral solution; upon subcutaneous injection, hexamers slowly dissociate into dimers and monomers (onset 30 minutes, peak 2-4 hours, duration 6-8 hours); only insulin formulation administered intravenously for acute diabetic ketoacidosis (DKA) and hyperkalemia.",
    dosingRegimens: [
      "Type 1 and Type 2 diabetes prandial management: Individualized subcutaneous dose administered 30 minutes before meals.",
      "Severe insulin resistance (Humulin R U-500, 500 units/mL): Reserved for patients requiring >200 units/day; administered subcutaneously 2-3 times daily 30 minutes before meals using dedicated U-500 syringes.",
      "Diabetic ketoacidosis (DKA / HHS): IV loading 0.1 units/kg followed by continuous IV infusion of 0.1 units/kg/hour adjusted to decrease glucose by 50-75 mg/dL/hour."
    ],
    sideEffects: {
      common: ["Hypoglycemia", "Weight gain", "Lipodystrophy", "Injection site erythema / edema", "Pruritus"],
      severe: ["Severe refractory hypoglycemia", "Marked hypokalemia (life-threatening cardiac dysrhythmias)", "Severe systemic allergic reactions / anaphylaxis"]
    },
    contraindications: [
      "During acute episodes of hypoglycemia",
      "Known hypersensitivity to regular human insulin"
    ],
    drugInteractions: {
      major: [
        "Potassium-depleting diuretics (furosemide, hydrochlorothiazide; exacerbate insulin-induced hypokalemia)",
        "Thiazolidinediones (heightened risk of heart failure decompensation)"
      ],
      common: [
        "Beta-blockers (mask tachycardia of hypoglycemia)",
        "Systemic corticosteroids (induce marked insulin resistance, elevating insulin dose needs)"
      ]
    },
    monitoringParameters: [
      "Blood glucose (pre-meal, bedtime, post-meal)",
      "Serum potassium during intravenous infusion for DKA (maintain potassium 4.0-5.0 mEq/L)",
      "HbA1c quarterly",
      "Proper syringe selection for U-500 concentration (extreme dosing error hazard if standard U-100 syringe is used)"
    ],
    dosageForms: [
      "Subcutaneous / IV Solution: 100 units/mL (U-100) in 10 mL vial (Humulin R, Novolin R)",
      "Concentrated Subcutaneous Solution (Humulin R U-500): 500 units/mL in 20 mL vial and 3 mL KwikPen"
    ],
    administrationAndCounseling: [
      "Inject subcutaneously approximately 30 minutes before your meal.",
      "CRITICAL SAFETY WARNING FOR U-500 USERS: Humulin R U-500 is 5 times more concentrated than regular insulin; use ONLY the dedicated green U-500 insulin syringe or the U-500 KwikPen to avoid catastrophic overdose.",
      "Rotate injection sites each time to prevent hard lumps under the skin.",
      "Always carry fast-acting glucose tablets.",
      "In-use U-100 vials may be stored at room temperature for up to 31 days (Humulin R) or 42 days (Novolin R); U-500 KwikPen is stable at room temperature for 28 days."
    ]
  },

  "Insulin Glargine": {
    genericName: "Insulin Glargine",
    brandNames: ["Lantus", "Lantus SoloStar", "Basaglar", "Toujeo", "Toujeo SoloStar", "Semglee"],
    pharmacologicClass: "Long-Acting Basal Human Insulin Analog",
    therapeuticClass: "6. Antidiabetic Agent --- Injectable/Insulin Product",
    mechanismOfAction: "Basal insulin analog produced by recombinant DNA technology with two arginine residues added to the C-terminus of the B-chain and asparagine replaced by glycine at A21; formulated at acidic pH 4.0 where it is completely soluble; upon subcutaneous injection into physiological pH 7.4 tissue, it precipitates into micro-deposits from which monomers slowly dissolve, providing peakless 24-hour basal coverage.",
    dosingRegimens: [
      "Type 1 diabetes: Subcutaneous injection once daily at the same time each day, providing approximately one-third to one-half of total daily insulin requirements; titrate every 3-4 days to target fasting glucose 80-130 mg/dL.",
      "Type 2 diabetes insulin-naive: Start 10 units PO/subcutaneously once daily (or 0.1-0.2 units/kg/day); titrate by 2 units every 3 days until target fasting blood glucose is achieved.",
      "High-concentration Toujeo (U-300, 300 units/mL): Once daily basal injection; provides flatter, extended 36-hour profile."
    ],
    sideEffects: {
      common: ["Hypoglycemia (lower nocturnal incidence than NPH)", "Weight gain", "Injection site pain / stinging (due to acidic pH 4.0 formulation)", "Lipodystrophy", "Peripheral edema"],
      severe: ["Severe hypoglycemia and hypoglycemic coma", "Severe hypokalemia", "Systemic hypersensitivity / anaphylaxis"]
    },
    contraindications: [
      "During episodes of hypoglycemia",
      "Hypersensitivity to insulin glargine or any excipients"
    ],
    drugInteractions: {
      major: [
        "Thiazolidinediones / Pioglitazone (fluid retention and heart failure exacerbation)",
        "Beta-blockers (blunt signs of hypoglycemia)"
      ],
      common: [
        "DO NOT DILUTE OR MIX WITH ANY OTHER INSULIN OR SOLUTION: The acidic pH will cause precipitation of other insulins and alter glargine's extended release profile"
      ]
    },
    monitoringParameters: [
      "Fasting capillary blood glucose (primary titration target)",
      "Hemoglobin A1c (every 3 months)",
      "Serum potassium in at-risk patients",
      "Injection site inspection"
    ],
    dosageForms: [
      "Subcutaneous Solution (Lantus, Basaglar, Semglee): 100 units/mL (U-100) in 10 mL vials and 3 mL prefilled pens",
      "High-Concentration Solution (Toujeo SoloStar / Max SoloStar): 300 units/mL (U-300) in 1.5 mL and 3 mL prefilled pens"
    ],
    administrationAndCounseling: [
      "Inject subcutaneously once daily at the same time every day (morning or bedtime).",
      "NEVER mix or dilute insulin glargine with any other insulin in the same syringe; doing so causes cloudy precipitation and ruins the extended release action.",
      "You may feel a slight temporary stinging sensation upon injection because the solution is slightly acidic.",
      "Rotate injection sites daily between the abdomen, thighs, and upper arms.",
      "Do not freeze; once opened, Lantus and Basaglar pens/vials may be kept at room temperature for up to 28 days (Toujeo pens for up to 56 days)."
    ]
  },

  "Insulin Degludec": {
    genericName: "Insulin Degludec",
    brandNames: ["Tresiba", "Tresiba FlexTouch"],
    pharmacologicClass: "Ultra-Long-Acting Basal Insulin Analog",
    therapeuticClass: "6. Antidiabetic Agent --- Injectable/Insulin Product",
    mechanismOfAction: "Basal insulin analog in which threonine at B30 is omitted and a 16-carbon fatty diacid (hexadecanedioic acid) is conjugated to LysB29 via a glutamic acid spacer; in the pen formulation with phenol/zinc, it forms di-hexamers; after subcutaneous injection, it forms soluble multi-hexamer depot chains that slowly release monomers, yielding an ultra-flat, peakless half-life of ~25 hours and duration >42 hours.",
    dosingRegimens: [
      "Type 1 and Type 2 diabetes basal management: Administer subcutaneously once daily at any time of day (flexible timing permitted, ensuring at least 8 hours between doses).",
      "Type 2 insulin-naive: Start 10 units subcutaneously once daily; titrate weekly by 2-4 units to target fasting glucose 80-130 mg/dL.",
      "Type 1 diabetes: Administer once daily in combination with rapid-acting prandial insulin; start at one-third to one-half of total daily insulin requirements."
    ],
    sideEffects: {
      common: ["Hypoglycemia (significantly lower rate of nocturnal hypoglycemia compared to glargine)", "Weight gain", "Lipodystrophy", "Injection site reactions", "Mild peripheral edema"],
      severe: ["Severe hypoglycemic coma", "Severe hypokalemia", "Generalized systemic allergic reactions"]
    },
    contraindications: [
      "During episodes of hypoglycemia",
      "Hypersensitivity to insulin degludec"
    ],
    drugInteractions: {
      major: [
        "Thiazolidinediones (risk of fluid retention and congestive heart failure)",
        "Beta-blockers (masking of hypoglycemic warning signs)"
      ],
      common: [
        "DO NOT dilute or mix with any other insulin products or solutions"
      ]
    },
    monitoringParameters: [
      "Fasting blood glucose (titrate dose based on fasting values every 3-4 days)",
      "Hemoglobin A1c",
      "Serum potassium in at-risk patients",
      "Frequency of nocturnal hypoglycemic events"
    ],
    dosageForms: [
      "Subcutaneous Solution (Tresiba FlexTouch U-100): 100 units/mL in 3 mL prefilled pen and 10 mL vial",
      "Subcutaneous Solution (Tresiba FlexTouch U-200): 200 units/mL in 3 mL prefilled pen (delivers up to 160 units in a single injection)"
    ],
    administrationAndCounseling: [
      "Inject subcutaneously once daily at any time of day; while recommended at the same time, its ultra-long duration allows flexibility if you inject earlier or later, as long as at least 8 hours separate doses.",
      "The FlexTouch pen does not require dose conversion when switching between U-100 and U-200 pens; the dose window always displays the exact units prescribed.",
      "Never mix Tresiba in the same syringe with any other insulin.",
      "Rotate injection sites daily on your abdomen, thigh, or upper arm.",
      "Unopened pens/vials should be refrigerated; once in use, keep at room temperature (up to 86°F) for up to 56 days (8 weeks)."
    ]
  },

  "Liraglutide": {
    genericName: "Liraglutide",
    brandNames: ["Victoza", "Saxenda"],
    pharmacologicClass: "Glucagon-Like Peptide-1 (GLP-1) Receptor Agonist",
    therapeuticClass: "6. Antidiabetic Agent --- Injectable/Insulin Product",
    mechanismOfAction: "Long-acting, acylated human GLP-1 receptor agonist with 97% sequence homology to native human GLP-1, featuring a C16 palmitic fatty acid chain attached to Lys26; binds GLP-1 receptors on pancreatic beta cells to stimulate glucose-dependent insulin secretion, suppresses inappropriate glucagon secretion, slows gastric emptying, and increases satiety via hypothalamic signaling.",
    dosingRegimens: [
      "Type 2 diabetes mellitus (Victoza): Start 0.6 mg SC once daily for 1 week (to reduce GI side effects); increase to 1.2 mg SC once daily; may increase to 1.8 mg SC once daily after at least 1 week if additional glycemic control needed.",
      "Chronic weight management (Saxenda): Start 0.6 mg SC once daily; escalate weekly by 0.6 mg/day to target maintenance dose of 3.0 mg SC once daily."
    ],
    sideEffects: {
      common: ["Nausea (transient, dose-dependent)", "Vomiting", "Diarrhea", "Decreased appetite", "Constipation", "Dyspepsia", "Abdominal pain", "Headache"],
      severe: ["Thyroid C-cell tumors / medullary thyroid carcinoma (MTC)", "Acute pancreatitis (severe, persistent epigastric pain)", "Acute gallbladder disease (cholelithiasis, cholecystitis)", "Renal impairment and acute kidney injury secondary to dehydration", "Suicidal ideation and behaviors (Saxenda)"]
    },
    contraindications: [
      "Personal or family history of medullary thyroid carcinoma (MTC)",
      "Patients with Multiple Endocrine Neoplasia syndrome type 2 (MEN 2)",
      "Known hypersensitivity to liraglutide or any components",
      "Pregnancy (contraindicated for weight management with Saxenda)"
    ],
    blackBoxWarning: "Liraglutide causes dose-dependent and treatment-duration-dependent thyroid C-cell tumors at clinically relevant exposures in both genders of rats and mice. It is unknown whether liraglutide causes thyroid C-cell tumors, including medullary thyroid carcinoma (MTC), in humans, as the human relevance of liraglutide-induced rodent thyroid C-cell tumors has not been determined. Liraglutide is contraindicated in patients with a personal or family history of MTC and in patients with Multiple Endocrine Neoplasia syndrome type 2 (MEN 2).",
    drugInteractions: {
      major: [
        "Insulin secretagogues / Insulin (co-administration increases risk of hypoglycemia; reduce sulfonylurea or basal insulin dose by 20-50% upon initiation)"
      ],
      common: [
        "Concomitant oral medications (liraglutide delays gastric emptying, which may theoretically slow absorption of orally administered drugs; take oral antibiotics or narrow therapeutic index drugs at least 1 hour before)"
      ]
    },
    monitoringParameters: [
      "Hemoglobin A1c and body weight",
      "Signs and symptoms of acute pancreatitis (persistent, severe abdominal pain radiating to the back)",
      "Signs of thyroid tumors (neck mass, dysphagia, dyspnea, persistent hoarseness)",
      "Renal function and hydration status in patients with severe vomiting/diarrhea",
      "Gallbladder symptoms (severe right upper quadrant pain)"
    ],
    dosageForms: [
      "Subcutaneous Solution Prefilled Pen (Victoza): 18 mg/3 mL (delivers 0.6 mg, 1.2 mg, or 1.8 mg per injection)",
      "Subcutaneous Solution Prefilled Pen (Saxenda): 18 mg/3 mL (delivers 0.6 mg, 1.2 mg, 1.8 mg, 2.4 mg, or 3.0 mg per injection)"
    ],
    administrationAndCounseling: [
      "Inject subcutaneously once daily at any time of day, with or without food, into the abdomen, thigh, or upper arm.",
      "Follow the gradual weekly dose escalation schedule strictly to minimize nausea, which usually improves over time.",
      "Stay well-hydrated by drinking plenty of water; persistent vomiting or diarrhea can cause severe kidney dehydration.",
      "Stop taking and seek immediate medical evaluation if you develop severe, persistent stomach pain that radiates to your back.",
      "Contact your doctor if you notice a lump or swelling in your neck, hoarseness, or trouble swallowing."
    ]
  },

  "Semaglutide": {
    genericName: "Semaglutide",
    brandNames: ["Ozempic", "Wegovy", "Rybelsus"],
    pharmacologicClass: "Long-Acting GLP-1 Receptor Agonist",
    therapeuticClass: "6. Antidiabetic Agent --- Injectable/Insulin Product",
    mechanismOfAction: "Human GLP-1 receptor agonist with 94% sequence homology engineered with an alpha-aminoisobutyric acid substitution at position 8 (resistant to DPP-4 cleavage) and a C18 fatty diacid spacer at Lys26 that binds tightly to serum albumin; produces a 1-week elimination half-life (~168 hours); potently stimulates glucose-dependent insulin secretion, suppresses glucagon, delays gastric emptying, reduces central appetite, and cuts major adverse cardiovascular events (MACE).",
    dosingRegimens: [
      "Type 2 diabetes subcutaneous (Ozempic): Start 0.25 mg SC once weekly for 4 weeks (initiation dose, not effective for glycemic control); increase to 0.5 mg SC once weekly; if additional glycemic control needed after >=4 weeks, may increase to 1 mg SC once weekly, and up to max 2 mg SC once weekly.",
      "Chronic weight management subcutaneous (Wegovy): Start 0.25 mg SC once weekly for 4 weeks; escalate monthly (0.25 -> 0.5 -> 1.0 -> 1.7 -> target maintenance 2.4 mg SC once weekly).",
      "Type 2 diabetes oral tablet (Rybelsus): Start 3 mg PO once daily in the morning for 30 days; increase to 7 mg PO once daily; may increase to 14 mg PO once daily after >=30 days."
    ],
    sideEffects: {
      common: ["Nausea", "Vomiting", "Diarrhea", "Abdominal pain", "Constipation", "Dyspepsia", "Eructation / belching", "Flatulence", "Fatigue"],
      severe: ["Thyroid C-cell tumors / Medullary thyroid carcinoma (MTC)", "Acute pancreatitis", "Diabetic retinopathy complications (rapid glycemic improvement exacerbates pre-existing retinopathy)", "Acute gallbladder disease", "Acute kidney injury from profound dehydration", "Hypoglycemia when combined with insulin or sulfonylureas"]
    },
    contraindications: [
      "Personal or family history of medullary thyroid carcinoma (MTC)",
      "Patients with Multiple Endocrine Neoplasia syndrome type 2 (MEN 2)",
      "Known hypersensitivity to semaglutide",
      "Pregnancy (discontinue at least 2 months prior to a planned pregnancy due to long washout period)"
    ],
    blackBoxWarning: "In rodents, semaglutide causes dose-dependent and treatment-duration-dependent thyroid C-cell tumors at clinically relevant exposures. It is unknown whether semaglutide causes thyroid C-cell tumors, including medullary thyroid carcinoma (MTC), in humans as human relevance of semaglutide-induced rodent thyroid C-cell tumors has not been determined. Semaglutide is contraindicated in patients with a personal or family history of MTC or in patients with Multiple Endocrine Neoplasia syndrome type 2 (MEN 2).",
    drugInteractions: {
      major: [
        "Insulin and Insulin Secretagogues (heightened hypoglycemia risk; lower sulfonylurea or basal insulin dose by 20-50%)"
      ],
      common: [
        "Oral medications (delayed gastric emptying can impact rate of oral drug absorption; monitor narrow therapeutic index drugs)"
      ]
    },
    monitoringParameters: [
      "Hemoglobin A1c and body weight",
      "Diabetic retinopathy screening (monitor for worsening visual symptoms in patients with pre-existing retinopathy)",
      "Symptoms of thyroid tumors (neck mass, hoarseness, difficulty swallowing)",
      "Persistent severe epigastric pain (pancreatitis)",
      "Renal function and volume status"
    ],
    dosageForms: [
      "Subcutaneous Prefilled Pen (Ozempic): 2 mg/3 mL (delivers 0.25 mg or 0.5 mg/dose), 4 mg/3 mL (1 mg/dose), 8 mg/3 mL (2 mg/dose)",
      "Subcutaneous Prefilled Single-Dose Pen (Wegovy): 0.25 mg, 0.5 mg, 1 mg, 1.7 mg, 2.4 mg per 0.75 mL",
      "Oral Tablet (Rybelsus): 3 mg, 7 mg, 14 mg (formulated with SNAC absorption enhancer)"
    ],
    administrationAndCounseling: [
      "Inject subcutaneously once weekly on the same day each week, any time of day, with or without food, into the abdomen, thigh, or upper arm.",
      "You may change the day of your weekly injection as long as the last dose was given 2 or more days (48 hours) before.",
      "FOR ORAL RYBELSUS TABLETS: Take once daily upon waking on an empty stomach with a sip of plain water (no more than 4 ounces); wait at least 30 minutes before eating, drinking, or taking any other oral medications.",
      "Follow the monthly dose titration schedule strictly to prevent severe nausea and vomiting.",
      "Report any new neck swelling, persistent severe stomach pain, or changes in vision immediately."
    ]
  },

  "Dulaglutide": {
    genericName: "Dulaglutide",
    brandNames: ["Trulicity"],
    pharmacologicClass: "Long-Acting GLP-1 Receptor Agonist / Fc Fusion Protein",
    therapeuticClass: "6. Antidiabetic Agent --- Injectable/Insulin Product",
    mechanismOfAction: "Recombinant fusion protein consisting of two modified human GLP-1(7-37) chains covalently linked to an Fc fragment of human IgG4 via a peptide linker; modifications prevent DPP-4 enzymatic degradation and reduce Fc receptor affinity, resulting in a large molecule with minimized renal filtration and an extended half-life of ~5 days; potently stimulates glucose-dependent insulin secretion and suppresses glucagon.",
    dosingRegimens: [
      "Type 2 diabetes / CV risk reduction: Start 0.75 mg SC once weekly; may increase to 1.5 mg SC once weekly after at least 4 weeks; if additional glycemic control needed, may escalate by 1.5 mg increments every 4 weeks to 3.0 mg once weekly and up to maximum 4.5 mg SC once weekly."
    ],
    sideEffects: {
      common: ["Nausea", "Diarrhea", "Vomiting", "Abdominal pain", "Decreased appetite", "Dyspepsia", "Fatigue"],
      severe: ["Thyroid C-cell tumors / Medullary thyroid carcinoma (MTC)", "Acute pancreatitis", "Severe gastrointestinal disease (gastroparesis)", "Acute gallbladder disease", "Acute renal impairment secondary to dehydration", "Sinus tachycardia and PR interval prolongation"]
    },
    contraindications: [
      "Personal or family history of medullary thyroid carcinoma (MTC)",
      "Patients with Multiple Endocrine Neoplasia syndrome type 2 (MEN 2)",
      "Known hypersensitivity to dulaglutide"
    ],
    blackBoxWarning: "Dulaglutide causes thyroid C-cell tumors in rats. It is unknown whether dulaglutide causes thyroid C-cell tumors, including medullary thyroid carcinoma (MTC), in humans. Dulaglutide is contraindicated in patients with a personal or family history of MTC and in patients with Multiple Endocrine Neoplasia syndrome type 2 (MEN 2).",
    drugInteractions: {
      major: [
        "Sulfonylureas / Insulin (increased risk of hypoglycemia; reduce secretagogue or insulin dose upon initiation)"
      ],
      common: [
        "Oral medications (dulaglutide delays gastric emptying; monitor drugs dependent on rapid gastrointestinal absorption)"
      ]
    },
    monitoringParameters: [
      "Hemoglobin A1c and body weight",
      "Signs and symptoms of pancreatitis (persistent severe abdominal pain radiating to the back)",
      "Neck palpation for thyroid nodules or goiter",
      "Renal function in patients experiencing severe dehydration from gastrointestinal adverse events",
      "Heart rate and rhythm"
    ],
    dosageForms: [
      "Subcutaneous Prefilled Single-Dose Pen: 0.75 mg/0.5 mL, 1.5 mg/0.5 mL, 3 mg/0.5 mL, 4.5 mg/0.5 mL"
    ],
    administrationAndCounseling: [
      "Inject subcutaneously once weekly on the same day each week, any time of day, with or without food.",
      "The single-dose auto-injector pen has a hidden needle that automatically inserts and retracts; place flat against the skin, unlock, and press the green button until you hear the first click, then hold until the second click (approx 5-10 seconds).",
      "Store refrigerated; single-dose pens may be stored at room temperature (up to 86°F) for up to 14 days.",
      "Report any severe stomach pain, neck lumps, difficulty swallowing, or severe vomiting to your physician immediately."
    ]
  },

  "Tirzepatide": {
    genericName: "Tirzepatide",
    brandNames: ["Mounjaro", "Zepbound"],
    pharmacologicClass: "Dual GIP and GLP-1 Receptor Agonist ('Twincretin')",
    therapeuticClass: "6. Antidiabetic Agent --- Injectable/Insulin Product",
    mechanismOfAction: "First-in-class synthetic 39-amino acid linear peptide acylated with a C20 fatty diacid moiety that acts as a dual glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptor agonist ('twincretin'); synergistic activation of both receptors dramatically enhances glucose-dependent first- and second-phase insulin secretion, suppresses glucagon, sensitizes adipocytes, improves insulin sensitivity, and profoundly suppresses central appetite and body weight.",
    dosingRegimens: [
      "Type 2 diabetes (Mounjaro): Start 2.5 mg SC once weekly for 4 weeks (treatment initiation dose; not for glycemic control); increase to 5 mg SC once weekly; if needed, escalate in 2.5 mg increments every 4 weeks to 7.5 mg, 10 mg, 12.5 mg, up to maximum 15 mg SC once weekly.",
      "Chronic weight management (Zepbound): Start 2.5 mg SC once weekly for 4 weeks, then increase to 5 mg once weekly; escalate in 2.5 mg increments every 4 weeks to target maintenance dose (5 mg, 10 mg, or max 15 mg SC once weekly)."
    ],
    sideEffects: {
      common: ["Nausea", "Diarrhea", "Decreased appetite", "Vomiting", "Constipation", "Dyspepsia", "Abdominal pain", "Eructation", "Gastroesophageal reflux"],
      severe: ["Thyroid C-cell tumors / Medullary thyroid carcinoma (MTC)", "Acute pancreatitis", "Severe hypoglycemia (when co-administered with sulfonylureas or insulin)", "Severe gastrointestinal disease (ileus, gastroparesis)", "Acute gallbladder disease", "Acute kidney injury from volume depletion", "Hypersensitivity reactions / angioedema"]
    },
    contraindications: [
      "Personal or family history of medullary thyroid carcinoma (MTC)",
      "Patients with Multiple Endocrine Neoplasia syndrome type 2 (MEN 2)",
      "Known serious hypersensitivity to tirzepatide"
    ],
    blackBoxWarning: "Tirzepatide causes thyroid C-cell tumors in rats. It is unknown whether tirzepatide causes thyroid C-cell tumors, including medullary thyroid carcinoma (MTC), in humans. Tirzepatide is contraindicated in patients with a personal or family history of MTC and in patients with Multiple Endocrine Neoplasia syndrome type 2 (MEN 2).",
    drugInteractions: {
      major: [
        "Oral hormonal contraceptives (tirzepatide delays gastric emptying, significantly reducing oral contraceptive exposure; advise women using oral birth control pills to switch to a non-oral contraceptive method or add a barrier method for 4 weeks after initiation and for 4 weeks after each dose escalation)",
        "Insulin secretagogues / Insulin (synergistic hypoglycemia risk; reduce sulfonylurea/insulin dose)"
      ],
      common: [
        "Narrow therapeutic index oral medications (warfarin, digoxin; monitor drug levels due to delayed gastric emptying)"
      ]
    },
    monitoringParameters: [
      "Hemoglobin A1c and body weight",
      "Signs and symptoms of pancreatitis (persistent severe abdominal pain)",
      "Thyroid examinations (neck mass, hoarseness)",
      "Renal function and hydration status",
      "Blood glucose monitoring in patients on concurrent insulin secretagogues"
    ],
    dosageForms: [
      "Subcutaneous Prefilled Single-Dose Pen: 2.5 mg/0.5 mL, 5 mg/0.5 mL, 7.5 mg/0.5 mL, 10 mg/0.5 mL, 12.5 mg/0.5 mL, 15 mg/0.5 mL",
      "Single-Dose Vials: 2.5 mg, 5 mg, 7.5 mg, 10 mg, 12.5 mg, 15 mg per 0.5 mL"
    ],
    administrationAndCounseling: [
      "Inject subcutaneously once weekly into the abdomen, thigh, or upper arm at any time of day, with or without meals.",
      "WOMEN USING ORAL BIRTH CONTROL PILLS: Tirzepatide reduces the effectiveness of birth control pills; you MUST use a back-up barrier method (condoms) or switch to a non-oral contraceptive method for 4 weeks after starting and for 4 weeks after every dose increase.",
      "Follow the monthly dose escalation schedule strictly to allow your stomach to adjust and minimize nausea.",
      "Stay well-hydrated to protect your kidneys.",
      "Seek immediate medical attention if you experience severe, unrelenting stomach pain or notice a new lump in your neck."
    ]
  }
};
