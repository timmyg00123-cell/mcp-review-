import type { TopDrugClinicalMonograph } from './types.js';

export const CAT10_ANTILIPEMICS: Record<string, TopDrugClinicalMonograph> = {
  "Atorvastatin": {
    genericName: "Atorvastatin",
    brandNames: ["Lipitor", "Caduet"],
    pharmacologicClass: "HMG-CoA Reductase Inhibitor / High-Intensity Statin",
    therapeuticClass: "10. Cardiovascular --- Anti-Lipemic Agent",
    mechanismOfAction: "Competitively and selectively inhibits 3-hydroxy-3-methylglutaryl-coenzyme A (HMG-CoA) reductase, the rate-limiting enzyme in cholesterol biosynthesis; depletes intracellular cholesterol in hepatocytes, upregulating cell-surface LDL receptors and accelerating catabolism of circulating LDL particles; lowers LDL-C by 39-60%, triglycerides by 19-37%, and raises HDL-C by 5-9%.",
    dosingRegimens: [
      "High-intensity statin therapy (>=50% LDL-C reduction; clinical ASCVD or high risk): 40-80 mg PO once daily at any time of day.",
      "Moderate-intensity statin therapy (30-49% LDL-C reduction): 10-20 mg PO once daily.",
      "Primary hyperlipidemia / Familial hypercholesterolemia: 10-80 mg PO once daily; titrate at intervals of 2-4 weeks based on lipid panel.",
      "Renal impairment: No dosage adjustment required."
    ],
    sideEffects: {
      common: ["Myalgia (muscle aches without CK elevation)", "Diarrhea", "Arthralgia", "Nasopharyngitis", "Dyspepsia", "Urinary tract infection", "Modest elevation in HbA1c / fasting blood glucose"],
      severe: ["Rhabdomyolysis with acute renal failure secondary to myoglobinuria (rare, <1 per 10,000)", "Immune-mediated necrotizing myopathy (IMNM with anti-HMGCR antibodies)", "Severe hepatotoxicity / acute liver failure", "Hemorrhagic stroke (observed with high-dose in patients with recent prior stroke)"]
    },
    contraindications: [
      "Active liver disease or unexplained, persistent elevations of serum transaminases",
      "Known hypersensitivity to atorvastatin",
      "Pregnancy and lactation (historic contraindication; discontinue when pregnancy is recognized unless very high cardiovascular risk)"
    ],
    drugInteractions: {
      major: [
        "Strong CYP3A4 inhibitors (clarithromycin, itraconazole, ketoconazole, protease inhibitors; dramatically elevate atorvastatin AUC up to 4-fold, multiplying rhabdomyolysis risk; cap atorvastatin at 20 mg daily or avoid)",
        "Cyclosporine (increases atorvastatin AUC by 9-fold; avoid combination or cap at 10 mg daily)",
        "Gemfibrozil (inhibits OATP1B1 uptake and glucuronidation, increasing statin levels and rhabdomyolysis; avoid combination)"
      ],
      common: [
        "Grapefruit juice (large quantities >1.2 liters/day significantly inhibit intestinal CYP3A4, increasing atorvastatin exposure)",
        "Digoxin (atorvastatin 80 mg increases steady-state digoxin concentrations by ~20%)"
      ]
    },
    monitoringParameters: [
      "Lipid panel (total cholesterol, LDL-C, HDL-C, triglycerides) at baseline, 4 to 12 weeks after initiation or dose adjustments, and every 3-12 months thereafter",
      "Liver enzymes (AST, ALT) at baseline and if clinical signs of hepatotoxicity (fatigue, dark urine, jaundice) develop",
      "Creatine kinase (CK) in patients presenting with severe muscle pain, tenderness, or weakness",
      "Fasting blood glucose / HbA1c in patients at high risk for diabetes mellitus"
    ],
    dosageForms: [
      "Oral Tablet: 10 mg, 20 mg, 40 mg, 80 mg"
    ],
    administrationAndCounseling: [
      "Take once daily at any time of day, with or without food; take at the same time each day for best consistency.",
      "Follow a heart-healthy, cholesterol-lowering diet and regular exercise routine while taking this medication.",
      "Avoid drinking large amounts of grapefruit juice (more than 1 quart per day).",
      "Promptly report any unexplained muscle pain, tenderness, or weakness to your doctor immediately, especially if accompanied by dark tea-colored urine, fever, or extreme tiredness.",
      "Inform your healthcare provider if you are pregnant or planning to become pregnant."
    ]
  },

  "Lovastatin": {
    genericName: "Lovastatin",
    brandNames: ["Mevacor", "Altoprev"],
    pharmacologicClass: "HMG-CoA Reductase Inhibitor / Inactive Lactone Prodrug",
    therapeuticClass: "10. Cardiovascular --- Anti-Lipemic Agent",
    mechanismOfAction: "Naturally occurring fungal polyketide prodrug containing an inactive lactone ring; hydrolyzed in vivo to its active beta-hydroxy acid metabolite, which competitively inhibits HMG-CoA reductase, preventing mevalonate synthesis, upregulating hepatic LDL receptors, and lowering circulating apo B-containing lipoproteins.",
    dosingRegimens: [
      "Immediate-Release (Mevacor): Start 20 mg PO once daily with the evening meal; titrate in intervals of 4 weeks up to 80 mg/day PO (administered as single evening dose or 40 mg twice daily with meals).",
      "Extended-Release (Altoprev): 20-60 mg PO once daily at bedtime.",
      "With concurrent mild/moderate CYP3A4 inhibitors (danazol, diltiazem, verapamil): Do not exceed 20 mg daily.",
      "With amiodarone: Do not exceed 40 mg daily."
    ],
    sideEffects: {
      common: ["Dyspepsia / abdominal cramps", "Myalgia", "Headache", "Flatulence", "Constipation", "Diarrhea", "Elevation in transaminases"],
      severe: ["Rhabdomyolysis and acute kidney failure", "Immune-mediated necrotizing myopathy", "Hepatitis and jaundice", "Pancreatitis"]
    },
    contraindications: [
      "Active liver disease or unexplained persistent transaminase elevations",
      "Concomitant administration with strong CYP3A4 inhibitors (itraconazole, ketoconazole, clarithromycin, erythromycin, protease inhibitors, cobicistat, nefazodone)",
      "Pregnancy and lactation",
      "Hypersensitivity to lovastatin"
    ],
    drugInteractions: {
      major: [
        "Strong CYP3A4 inhibitors (ketoconazole, clarithromycin, ritonavir; cause massive increases in lovastatin levels, triggering severe rhabdomyolysis; contraindicated)",
        "Gemfibrozil (contraindicated due to severe myopathy/rhabdomyolysis risk)",
        "Cyclosporine (markedly increases lovastatin levels; do not exceed 20 mg daily)"
      ],
      common: [
        "Grapefruit juice (inhibits gut CYP3A4; avoid >1 quart daily)",
        "Warfarin (potentiates hypoprothrombinemic effect; monitor INR)"
      ]
    },
    monitoringParameters: [
      "Fasting lipid panel at baseline, 4-12 weeks post-titration, then every 3-12 months",
      "Baseline transaminases (AST, ALT); repeat if symptoms of liver injury arise",
      "Creatine kinase (CK) if myalgias or muscle tenderness develop"
    ],
    dosageForms: [
      "Oral Tablet: 10 mg, 20 mg, 40 mg",
      "Extended-Release Tablet (Altoprev): 20 mg, 40 mg, 60 mg"
    ],
    administrationAndCounseling: [
      "Take immediate-release tablets with your evening meal to maximize absorption (absorption is reduced by 30% on an empty stomach); take Altoprev extended-release at bedtime.",
      "Swallow Altoprev tablets whole; do not crush, chew, or divide.",
      "Avoid grapefruit and grapefruit juice while taking this medication.",
      "Report any unexplained muscle soreness, tenderness, or dark brown urine immediately.",
      "Adhere to dietary modifications and exercise as recommended by your physician."
    ]
  },

  "Pravastatin": {
    genericName: "Pravastatin",
    brandNames: ["Pravachol"],
    pharmacologicClass: "Hydrophilic HMG-CoA Reductase Inhibitor",
    therapeuticClass: "10. Cardiovascular --- Anti-Lipemic Agent",
    mechanismOfAction: "Hydrophilic, active open-ring hydroxy acid statin that selectively inhibits HMG-CoA reductase; because of its marked hydrophilicity, it enters hepatocytes via active OATP1B1 transport rather than passive diffusion, exhibiting minimal penetration into peripheral non-hepatic tissues (skeletal muscle) and no metabolism by cytochrome P450 3A4, conferring a very low drug-interaction liability.",
    dosingRegimens: [
      "Moderate-intensity statin therapy: 40-80 mg PO once daily in the evening or at bedtime (with or without food).",
      "Initial starting dose: 40 mg PO once daily (10-20 mg daily in renal/hepatic impairment or elderly).",
      "Concurrent cyclosporine: Start 10 mg PO once daily; do not exceed 20 mg daily.",
      "Concurrent clarithromycin: Do not exceed 40 mg daily."
    ],
    sideEffects: {
      common: ["Musculoskeletal pain (significantly lower incidence of myalgias than lipophilic statins)", "Upper respiratory infection", "Headache", "Nausea", "Vomiting", "Diarrhea", "Fatigue"],
      severe: ["Rhabdomyolysis and myoglobinuric acute renal failure (substantially lower incidence)", "Immune-mediated necrotizing myopathy (IMNM)", "Hepatotoxicity", "Cognitive impairment (reversible memory loss)"]
    },
    contraindications: [
      "Active liver disease or unexplained, persistent transaminase elevations",
      "Hypersensitivity to pravastatin sodium",
      "Pregnancy and nursing mothers"
    ],
    drugInteractions: {
      major: [
        "Cyclosporine (inhibits OATP1B1 hepatic uptake, increasing pravastatin AUC 4-fold; cap pravastatin at 20 mg daily)"
      ],
      common: [
        "Bile acid sequestrants (cholestyramine, colestipol; bind pravastatin in gut, decreasing absorption; take pravastatin at least 1 hour before or 4 hours after sequestrants)",
        "Gemfibrozil (increases pravastatin AUC by ~2-fold; caution required)"
      ]
    },
    monitoringParameters: [
      "Fasting lipid panel at baseline, 4-12 weeks after initiation/titration, and periodically",
      "Hepatic enzymes (AST, ALT) prior to initiation and when clinically indicated",
      "Creatine kinase (CK) if severe muscle pain or weakness occurs",
      "Renal function in elderly patients"
    ],
    dosageForms: [
      "Oral Tablet: 10 mg, 20 mg, 40 mg, 80 mg"
    ],
    administrationAndCounseling: [
      "Take once daily in the evening, with or without food.",
      "If taking a bile acid resin (cholestyramine or colestipol), take pravastatin at least 1 hour before or 4 hours after the resin.",
      "Pravastatin has fewer drug interactions and does not interact with grapefruit juice.",
      "Contact your doctor if you experience severe unexplained muscle pain, tenderness, or weakness.",
      "Continue adhering to a low-fat, heart-healthy diet."
    ]
  },

  "Rosuvastatin": {
    genericName: "Rosuvastatin",
    brandNames: ["Crestor", "Ezallor Sprinkle"],
    pharmacologicClass: "Hydrophilic High-Intensity HMG-CoA Reductase Inhibitor",
    therapeuticClass: "10. Cardiovascular --- Anti-Lipemic Agent",
    mechanismOfAction: "Enantiomerically pure methane sulfonamide-containing hydrophilic statin that exhibits the highest binding affinity for human HMG-CoA reductase; internalized into hepatocytes via OATP1B1 and NTCP transporters; inhibits hepatic cholesterol biosynthesis, robustly upregulating LDL receptors; reduces LDL-C by up to 55-63%, lowers triglycerides, and raises HDL-C by 8-14%; metabolized minimally by CYP2C9 (non-CYP3A4).",
    dosingRegimens: [
      "High-intensity statin therapy (>=50% LDL-C reduction): 20-40 mg PO once daily at any time of day.",
      "Moderate-intensity statin therapy: 5-10 mg PO once daily.",
      "Asian ancestry: Initiate at 5 mg PO once daily (demonstrate 2-fold higher median plasma concentrations due to SLCO1B1 and ABCG2 genetic polymorphisms).",
      "Severe renal impairment (CrCl < 30 mL/min not on hemodialysis): Start 5 mg PO once daily; do not exceed 10 mg once daily."
    ],
    sideEffects: {
      common: ["Myalgia", "Headache", "Abdominal pain", "Nausea", "Asthenia", "Constipation", "Transient dipstick-positive proteinuria / microscopic hematuria (tubular origin, usually at 40 mg dose)"],
      severe: ["Rhabdomyolysis and myoglobinuric renal failure", "Immune-mediated necrotizing myopathy (anti-HMGCR antibodies)", "Severe hepatotoxicity", "Pancreatitis", "New-onset diabetes mellitus"]
    },
    contraindications: [
      "Active liver disease or unexplained persistent elevations in hepatic transaminases",
      "Hypersensitivity to rosuvastatin",
      "Pregnancy and breastfeeding"
    ],
    drugInteractions: {
      major: [
        "Cyclosporine (causes 7-fold increase in rosuvastatin exposure; dose capped at 5 mg daily)",
        "Protease inhibitors (atazanavir/ritonavir, lopinavir/ritonavir; increase rosuvastatin AUC up to 3-fold; cap dose at 10 mg daily)",
        "Gemfibrozil (causes 2-fold increase in rosuvastatin exposure; avoid combination or cap at 10 mg daily)"
      ],
      common: [
        "Antacids containing aluminum and magnesium (reduce rosuvastatin absorption by 50%; administer antacid at least 2 hours after rosuvastatin)",
        "Warfarin (rosuvastatin significantly augments INR; monitor prothrombin time closely)"
      ]
    },
    monitoringParameters: [
      "Fasting lipid panel at baseline, 4 to 12 weeks after starting or titrating, then annually",
      "Liver enzymes (AST, ALT) at baseline and if symptomatic",
      "Routine urinalysis for proteinuria if patient receives 40 mg daily",
      "Creatine kinase (CK) in patients presenting with muscle aches, weakness, or brown urine",
      "HbA1c and fasting blood sugar periodically"
    ],
    dosageForms: [
      "Oral Tablet (Crestor): 5 mg, 10 mg, 20 mg, 40 mg",
      "Oral Capsule Sprinkle (Ezallor): 5 mg, 10 mg, 20 mg, 40 mg"
    ],
    administrationAndCounseling: [
      "Take once daily at any time of day, with or without food, at the same time each day.",
      "Take at least 2 hours before taking aluminum- or magnesium-containing antacids.",
      "Ezallor sprinkle capsules can be opened and sprinkled onto soft applesauce or administered via nasogastric tube.",
      "Notify your doctor immediately if you develop unexplained muscle aches, soreness, or dark brown urine.",
      "Women should not take this medicine while pregnant or planning to become pregnant."
    ]
  },

  "Simvastatin": {
    genericName: "Simvastatin",
    brandNames: ["Zocor", "Flolipid"],
    pharmacologicClass: "HMG-CoA Reductase Inhibitor / Lipophilic Lactone Prodrug",
    therapeuticClass: "10. Cardiovascular --- Anti-Lipemic Agent",
    mechanismOfAction: "Lipophilic lactone prodrug methylated derivative of lovastatin; hydrolyzed in hepatocytes to its active beta-hydroxy acid form, competitively inhibiting HMG-CoA reductase; highly dependent on hepatic CYP3A4 for first-pass metabolic clearance; lowers LDL-C by 30-45% and reduces major vascular events.",
    dosingRegimens: [
      "Moderate-intensity statin therapy: 20-40 mg PO once daily in the evening.",
      "Starting dose: 10-20 mg PO once daily in the evening (or 40 mg for high cardiovascular risk).",
      "80 mg dose restriction: FDA RESTRICTION: Do NOT initiate simvastatin at 80 mg daily due to high risk of myopathy/rhabdomyolysis; reserve 80 mg ONLY for patients who have taken it chronically for >=12 months without evidence of muscle toxicity.",
      "With verapamil, diltiazem, or dronedarone: Do not exceed 10 mg daily.",
      "With amiodarone, amlodipine, or ranolazine: Do not exceed 20 mg daily."
    ],
    sideEffects: {
      common: ["Upper respiratory tract infection", "Headache", "Abdominal pain", "Constipation", "Nausea", "Myalgia"],
      severe: ["Rhabdomyolysis with acute kidney failure (substantially elevated risk at 80 mg daily and in SLCO1B1*5 521T>C variant carriers)", "Immune-mediated necrotizing myopathy", "Hepatitis and hepatic failure", "Pancreatitis"]
    },
    contraindications: [
      "Concomitant administration with strong CYP3A4 inhibitors (itraconazole, ketoconazole, posaconazole, clarithromycin, erythromycin, HIV/HCV protease inhibitors, cobicistat, nefazodone, gemfibrozil, cyclosporine, danazol)",
      "Active liver disease or unexplained persistent transaminase elevations",
      "Pregnancy and lactation",
      "Hypersensitivity to simvastatin"
    ],
    blackBoxWarning: undefined,
    drugInteractions: {
      major: [
        "Strong CYP3A4 inhibitors (clarithromycin, azole antifungals, protease inhibitors; increase simvastatin active acid levels up to 20-fold, precipitating catastrophic rhabdomyolysis; strictly contraindicated)",
        "Gemfibrozil, Cyclosporine, Danazol (contraindicated due to severe myopathy)",
        "Verapamil, Diltiazem, Dronedarone (cap simvastatin at 10 mg daily)",
        "Amlodipine, Amiodarone, Ranolazine (cap simvastatin at 20 mg daily)"
      ],
      common: [
        "Grapefruit juice (avoid large quantities >1 quart/day)",
        "Warfarin (potentiates anticoagulant effect; monitor INR)"
      ]
    },
    monitoringParameters: [
      "Fasting lipid panel at baseline and 4-12 weeks post-titration",
      "Liver function tests at baseline and as clinically indicated",
      "SLCO1B1 genotype testing (evaluates risk of statin-induced myopathy in high-risk individuals)",
      "Creatine kinase (CK) in symptomatic patients"
    ],
    dosageForms: [
      "Oral Tablet (Zocor): 5 mg, 10 mg, 20 mg, 40 mg, 80 mg",
      "Oral Suspension (Flolipid): 20 mg/5 mL, 40 mg/5 mL"
    ],
    administrationAndCounseling: [
      "Take once daily in the evening with or without food (hepatic cholesterol synthesis peaks at night).",
      "Do not start taking the 80 mg dose; the 80 mg tablet is restricted to patients who have taken it safely for over a year because it causes high rates of muscle damage.",
      "Avoid grapefruit juice and tell your pharmacist and doctor about ALL other medications you take, especially heart or blood pressure pills.",
      "Call your doctor immediately if you notice muscle soreness, muscle weakness, or dark brown urine."
    ]
  },

  "Ezetimibe": {
    genericName: "Ezetimibe",
    brandNames: ["Zetia", "Nexlizet"],
    pharmacologicClass: "Niemann-Pick C1-Like 1 (NPC1L1) Cholesterol Absorption Inhibitor",
    therapeuticClass: "10. Cardiovascular --- Anti-Lipemic Agent",
    mechanismOfAction: "Localizes at the brush border of the small intestine and potently inhibits the Niemann-Pick C1-Like 1 (NPC1L1) sterol transporter, blocking intestinal absorption of dietary and biliary cholesterol by ~54%; decreases delivery of intestinal cholesterol to the liver, depleting hepatic cholesterol stores and upregulating hepatic LDL receptors; lowers LDL-C by 15-20% as monotherapy and provides synergistic ~25% additional LDL reduction when added to statins.",
    dosingRegimens: [
      "Hyperlipidemia (monotherapy or combination with statin): 10 mg PO once daily with or without food at any time of day.",
      "Homozygous familial hypercholesterolemia (HoFH): 10 mg PO once daily in combination with atorvastatin or simvastatin.",
      "Homozygous sitosterolemia: 10 mg PO once daily.",
      "Renal / Hepatic impairment: No dosage adjustment necessary in renal impairment or mild hepatic impairment (not recommended in moderate-to-severe hepatic impairment)."
    ],
    sideEffects: {
      common: ["Upper respiratory tract infection", "Diarrhea", "Arthralgia", "Sinusitis", "Pain in extremity", "Fatigue"],
      severe: ["Severe myopathy and rhabdomyolysis (rare as monotherapy; increased incidence when added to statins)", "Acute pancreatitis", "Hepatitis and elevated transaminases (when combined with statins)", "Anaphylaxis and angioedema", "Erythema multiforme", "Thrombocytopenia"]
    },
    contraindications: [
      "Active liver disease or unexplained persistent transaminase elevations (when co-administered with a statin)",
      "Pregnancy and lactation (when combined with a statin)",
      "Known hypersensitivity to ezetimibe"
    ],
    drugInteractions: {
      major: [
        "Cyclosporine (causes significant 12-fold increase in total ezetimibe AUC and ezetimibe increases cyclosporine exposure; monitor cyclosporine blood levels closely)",
        "Gemfibrozil (increases total ezetimibe AUC by 1.7-fold and increases risk of cholelithiasis; co-administration not recommended)"
      ],
      common: [
        "Bile acid sequestrants (cholestyramine binds ezetimibe, reducing AUC by 55%; administer ezetimibe at least 2 hours before or 4 hours after a sequestrant)",
        "Fenofibrate (may increase cholesterol excretion into bile, increasing cholelithiasis risk; if gallstones suspected, discontinue)"
      ]
    },
    monitoringParameters: [
      "Fasting lipid panel at baseline and 4-12 weeks following initiation",
      "Liver function tests (AST, ALT) at baseline and during therapy when co-administered with a statin",
      "Creatine kinase (CK) if myalgias or muscle weakness occur during combination statin therapy"
    ],
    dosageForms: [
      "Oral Tablet: 10 mg"
    ],
    administrationAndCounseling: [
      "Take once daily at any time of day, with or without food, at the same time each day.",
      "May be taken at the same time as your statin medication.",
      "If taking a bile acid sequestrant (such as cholestyramine or colestipol), take ezetimibe at least 2 hours before or 4 hours after the sequestrant.",
      "Report any unexplained muscle pain or weakness, particularly when taken with a statin.",
      "Maintain a heart-healthy diet low in saturated fat and cholesterol."
    ]
  },

  "Fenofibrate": {
    genericName: "Fenofibrate",
    brandNames: ["Tricor", "Trilipix", "Antara", "Lipofen", "Fenoglide"],
    pharmacologicClass: "Fibric Acid Derivative / PPAR-Alpha Agonist",
    therapeuticClass: "10. Cardiovascular --- Anti-Lipemic Agent",
    mechanismOfAction: "Prodrug rapidly hydrolyzed to active fenofibric acid, which activates peroxisome proliferator-activated receptor-alpha (PPAR-alpha); upregulates lipoprotein lipase (LPL) and apo A-I / apo A-II synthesis while downregulating apo C-III, accelerating catabolism of triglyceride-rich VLDL and chylomicrons; lowers triglycerides by 30-60%, raises HDL-C by 10-25%, and shifts dense atherogenic small LDL to buoyant particles.",
    dosingRegimens: [
      "Severe hypertriglyceridemia (type IV/V, triglycerides >= 500 mg/dL): Tricor 48-145 mg PO once daily with meals; or Trilipix (choline fenofibrate) 45-135 mg PO once daily.",
      "Primary hypercholesterolemia or mixed dyslipidemia: 145 mg PO once daily (Trilipix 135 mg once daily).",
      "Renal impairment: eGFR 30-59 mL/min: Max 48-54 mg daily; eGFR < 30 mL/min: Contraindicated."
    ],
    sideEffects: {
      common: ["Abdominal pain", "Nausea", "Dyspepsia", "Diarrhea", "Reversible elevation in serum creatinine", "Elevation in transaminases", "Headache"],
      severe: ["Rhabdomyolysis and severe myopathy (significantly safer than gemfibrozil when co-prescribed with statins)", "Cholelithiasis (gallstones due to increased cholesterol biliary saturation)", "Acute pancreatitis", "Deep vein thrombosis (DVT) and pulmonary embolism (PE)", "Agranulocytosis and thrombocytopenia"]
    },
    contraindications: [
      "Severe renal impairment (eGFR < 30 mL/min) or patients on dialysis",
      "Active liver disease, including primary biliary cirrhosis and unexplained persistent liver function abnormalities",
      "Pre-existing gallbladder disease",
      "Nursing mothers",
      "Hypersensitivity to fenofibric acid or fenofibrate"
    ],
    drugInteractions: {
      major: [
        "Warfarin (fenofibrate displaces warfarin from protein binding, markedly potentiating anticoagulation; reduce warfarin dose by 30-50% upon initiation and monitor INR closely)",
        "HMG-CoA reductase inhibitors / Statins (increased risk of myopathy and rhabdomyolysis, though far safer than gemfibrozil due to lack of statin glucuronidation inhibition)"
      ],
      common: [
        "Bile acid sequestrants (bind fenofibrate; separate by 1 hour before or 4-6 hours after)",
        "Cyclosporine (additive nephrotoxicity; monitor serum creatinine)"
      ]
    },
    monitoringParameters: [
      "Fasting lipid profile (focus on triglyceride reduction and HDL response)",
      "Serum creatinine and eGFR (baseline, 3 months, and every 6 months; fenofibrate causes a reversible ~10-15% increase in creatinine by reducing tubular secretion)",
      "Liver function tests (AST, ALT) at baseline and periodically; discontinue if transaminases persist >3 times ULN",
      "Complete blood count (hemoglobin, hematocrit, WBC) periodically for first 12 months",
      "Signs and symptoms of gallstones or pancreatitis (severe right upper quadrant or epigastric pain)"
    ],
    dosageForms: [
      "Oral Tablet (Tricor): 48 mg, 145 mg",
      "Delayed-Release Capsule (Trilipix, choline fenofibrate): 45 mg, 135 mg",
      "Oral Capsule (Antara): 30 mg, 90 mg",
      "Oral Capsule (Lipofen): 50 mg, 150 mg"
    ],
    administrationAndCounseling: [
      "Take once daily with food (Tricor and Trilipix may be taken without regard to meals, but generic fenofibrate formulations must be taken with meals to optimize absorption).",
      "Swallow tablets or capsules whole; do not crush or chew.",
      "Stay on a low-fat, low-sugar diet and avoid alcohol to help lower high triglycerides.",
      "Notify your doctor immediately if you experience severe abdominal pain (especially radiating to your back), nausea/vomiting, unexplained muscle pain, or yellowing of your eyes.",
      "If taking warfarin (Coumadin), your doctor will check your blood clotting tests more frequently when starting fenofibrate."
    ]
  },

  "Gemfibrozil": {
    genericName: "Gemfibrozil",
    brandNames: ["Lopid"],
    pharmacologicClass: "Fibric Acid Derivative / PPAR-Alpha Agonist",
    therapeuticClass: "10. Cardiovascular --- Anti-Lipemic Agent",
    mechanismOfAction: "Activates peroxisome proliferator-activated receptor-alpha (PPAR-alpha), stimulating hepatic fatty acid oxidation, upregulating lipoprotein lipase (LPL), and reducing hepatic synthesis and secretion of VLDL triglyceride-rich particles; potently inhibits CYP2C8 and inhibits OATP1B1 hepatic uptake as well as statin glucuronidation (via UGT1A1/UGT1A3).",
    dosingRegimens: [
      "Hypertriglyceridemia (Type IV/V dyslipidemia, triglycerides >= 500 mg/dL): 600 mg PO twice daily administered 30 minutes before the morning and evening meals (1200 mg total daily dose).",
      "Reduce risk of coronary heart disease in patients with low HDL and elevated triglycerides."
    ],
    sideEffects: {
      common: ["Dyspepsia", "Abdominal pain", "Nausea", "Diarrhea", "Vomiting", "Flatulence", "Fatigue", "Rash"],
      severe: ["Severe rhabdomyolysis and acute renal failure (catastrophic risk when combined with statins)", "Cholelithiasis (gallstones)", "Acute pancreatitis", "Hepatotoxicity / cholestatic jaundice", "Severe bone marrow hypoplasia / leukopenia"]
    },
    contraindications: [
      "Concomitant administration with statins (simvastatin, lovastatin, atorvastatin, rosuvastatin, pravastatin; severe rhabdomyolysis)",
      "Concomitant administration with repaglinide (profound, prolonged fatal hypoglycemia via CYP2C8 and OATP1B1 inhibition)",
      "Concomitant administration with dasabuvir",
      "Severe renal impairment or hepatic dysfunction",
      "Pre-existing gallbladder disease"
    ],
    drugInteractions: {
      major: [
        "HMG-CoA Reductase Inhibitors / Statins (gemfibrozil blocks statin glucuronidation and OATP1B1 uptake, raising statin levels up to 3- to 6-fold, triggering massive rhabdomyolysis; strictly contraindicated)",
        "Repaglinide (gemfibrozil causes 8-fold increase in repaglinide AUC, causing severe refractory hypoglycemia; contraindicated)",
        "Warfarin (potentiates anticoagulant effect; reduces warfarin dose by 50%)"
      ],
      common: [
        "Bile acid sequestrants (decrease gemfibrozil absorption; separate by 2 hours)",
        "Colchicine (additive myotoxicity and rhabdomyolysis in renal impairment)"
      ]
    },
    monitoringParameters: [
      "Fasting lipid panel (triglycerides, HDL-C, LDL-C)",
      "Liver function tests and complete blood count periodically during the first 12 months",
      "Renal function tests (BUN, serum creatinine)",
      "Signs and symptoms of gallstones (biliary colic) or myopathy"
    ],
    dosageForms: [
      "Oral Tablet: 600 mg"
    ],
    administrationAndCounseling: [
      "Take 600 mg twice daily, exactly 30 minutes before your morning meal and 30 minutes before your evening meal.",
      "CRITICAL: NEVER take gemfibrozil together with a statin cholesterol medication (such as Lipitor, Zocor, or Crestor) because the combination can cause severe, life-threatening muscle breakdown and kidney destruction.",
      "Tell your doctor immediately if you take repaglinide (Prandin) for diabetes or warfarin (Coumadin) for blood clots.",
      "Report any unexplained muscle pain, tenderness, dark urine, or severe right upper stomach pain."
    ]
  },

  "Niacin": {
    genericName: "Niacin",
    brandNames: ["Niaspan", "Niacor", "Slo-Niacin"],
    pharmacologicClass: "Water-Soluble B-Complex Vitamin (Vitamin B3) / Antilipemic",
    therapeuticClass: "10. Cardiovascular --- Anti-Lipemic Agent",
    mechanismOfAction: "High-affinity agonist for hydroxycarboxylic acid receptor 2 (HCA2 / GPR109A) in adipose tissue, suppressing hormone-sensitive lipase (HSL) and inhibiting intracellular lipolysis of triglycerides; decreases circulating free fatty acid (FFA) flux to the liver, reducing hepatic VLDL and triglyceride synthesis and LDL formation; inhibits hepatic uptake of apo A-I, preserving HDL-C particles (raises HDL by 15-35%).",
    dosingRegimens: [
      "Extended-Release (Niaspan): Start 500 mg PO once daily at bedtime with a low-fat snack for 4 weeks; increase to 1000 mg PO once daily at bedtime (weeks 5-8); titrate by 500 mg every 4 weeks to target maintenance 1000-2000 mg PO once daily at bedtime (max 2000 mg/day).",
      "Immediate-Release (Niacor): Start 250 mg PO once daily after the evening meal; titrate slowly up to 1000-3000 mg/day divided in 2-3 doses (max 6000 mg/day)."
    ],
    sideEffects: {
      common: ["Cutaneous flushing (prostaglandin D2/E2-mediated intense warmth, redness, and tingling of face and upper trunk)", "Pruritus", "Headache", "Nausea", "Dyspepsia", "Diarrhea", "Hyperglycemia / impaired glucose tolerance", "Hyperuricemia (exacerbation of gout)"],
      severe: ["Severe hepatotoxicity / fulminant hepatic necrosis (greatest risk with OTC sustained-release formulations or high doses)", "Rhabdomyolysis (especially when combined with statins)", "Peptic ulcer disease reactivation", "Macular retinal edema / toxic cystoid maculopathy", "Atrial fibrillation"]
    },
    contraindications: [
      "Active liver disease or unexplained persistent transaminase elevations",
      "Active peptic ulcer disease",
      "Arterial bleeding",
      "Hypersensitivity to niacin"
    ],
    drugInteractions: {
      major: [
        "HMG-CoA reductase inhibitors / Statins (additive risk of severe myopathy and rhabdomyolysis)",
        "Vasoactive antihypertensive agents (additive vasodilation and postural hypotension)"
      ],
      common: [
        "Bile acid sequestrants (bind niacin; separate by at least 4-6 hours)",
        "Antidiabetic medications (niacin induces insulin resistance, blunting glycemic control)"
      ]
    },
    monitoringParameters: [
      "Fasting lipid panel at baseline and every 6-12 weeks until stable, then every 6 months",
      "Liver transaminases (AST, ALT, alkaline phosphatase, bilirubin) prior to initiation, every 6-12 weeks for the first year, and periodically thereafter",
      "Fasting blood glucose / HbA1c prior to initiation and periodically in diabetic patients",
      "Serum uric acid levels in patients susceptible to gout",
      "Ophthalmic evaluation if blurred vision occurs"
    ],
    dosageForms: [
      "Extended-Release Tablet (Niaspan): 500 mg, 750 mg, 1000 mg",
      "Immediate-Release Tablet (Niacor): 500 mg",
      "OTC Sustained-Release Tablet / Capsule (Slo-Niacin): 250 mg, 500 mg, 750 mg"
    ],
    administrationAndCounseling: [
      "Take once daily at bedtime after a low-fat snack.",
      "TO PREVENT FLUSHING: Take 325 mg of aspirin (or 200 mg ibuprofen) 30 minutes before your niacin dose to block prostaglandin-mediated redness and itching.",
      "Avoid hot beverages, spicy foods, and alcohol around the time of taking niacin, as they worsen flushing and burning sensations.",
      "Swallow Niaspan extended-release tablets whole; do not break, crush, or chew.",
      "Do not substitute OTC sustained-release niacin for prescription Niaspan without consulting your doctor; OTC sustained-release brands carry a much higher risk of fatal liver failure.",
      "Notify your doctor if you have dark urine, persistent nausea, severe muscle aches, or painful gout attacks."
    ]
  },

  "Omega-3-Acid Ethyl Esters": {
    genericName: "Omega-3-Acid Ethyl Esters",
    brandNames: ["Lovaza", "Omtryg", "Vascepa"],
    pharmacologicClass: "Omega-3 Polyunsaturated Fatty Acid Antilipemic",
    therapeuticClass: "10. Cardiovascular --- Anti-Lipemic Agent",
    mechanismOfAction: "Purified mixture of ethyl esters of eicosapentaenoic acid (EPA) and docosahexaenoic acid (DHA); inhibits diacylglycerol acyltransferase (DGAT) and fatty acid synthesis in hepatocytes while accelerating mitochondrial and peroxisomal beta-oxidation, reducing hepatic triglyceride synthesis and VLDL secretion; promotes clearance of chylomicrons by increasing lipoprotein lipase activity.",
    dosingRegimens: [
      "Severe hypertriglyceridemia (triglycerides >= 500 mg/dL): 4 grams PO once daily (4 capsules) or 2 grams PO twice daily (2 capsules twice daily) with meals.",
      "Vascepa (Icosapent ethyl, pure EPA): 2 grams PO twice daily (two 1 g capsules twice daily or four 0.5 g capsules twice daily) with food for severe hypertriglyceridemia or CV risk reduction in statin-treated patients."
    ],
    sideEffects: {
      common: ["Eructation (fishy burps / aftertaste)", "Dyspepsia", "Dysgeusia", "Nausea", "Diarrhea", "Constipation", "Flatulence"],
      severe: ["Atrial fibrillation or atrial flutter requiring hospitalization (higher risk in patients with pre-existing cardiovascular disease)", "Prolonged bleeding time / hemorrhagic events (especially when combined with antiplatelet/anticoagulant drugs)", "Elevation in LDL-C (observed with DHA-containing formulations like Lovaza; not seen with pure EPA Vascepa)", "Allergic reactions in patients with fish/shellfish allergy"]
    },
    contraindications: [
      "Known hypersensitivity to omega-3-acid ethyl esters, fish, or shellfish"
    ],
    drugInteractions: {
      major: [
        "Anticoagulants and Antiplatelet agents (aspirin, clopidogrel, warfarin, DOACs; omega-3 fatty acids possess mild antiplatelet effects, potentially increasing bleeding time and hemorrhagic complications; monitor INR/bleeding)"
      ],
      common: [
        "Concurrent lipid-lowering medications (statins, fibrates): synergistic triglyceride and lipid parameter modulation; monitor clinical response"
      ]
    },
    monitoringParameters: [
      "Fasting lipid panel (triglycerides, and specifically LDL-C in patients taking Lovaza)",
      "Signs and symptoms of atrial fibrillation (palpitations, irregular pulse, dizziness, dyspnea)",
      "Bleeding manifestations (bruising, epistaxis, hematochezia) in patients taking concurrent antithrombotics",
      "Hepatic transaminases (ALT, AST) periodically in patients with hepatic impairment"
    ],
    dosageForms: [
      "Oral Liquid-Filled Capsule (Lovaza): 1 gram (contains ~465 mg EPA and 375 mg DHA)",
      "Oral Capsule (Vascepa, icosapent ethyl): 0.5 gram, 1 gram"
    ],
    administrationAndCounseling: [
      "Take with meals to enhance absorption and reduce stomach upset and fishy burping.",
      "Swallow capsules whole; do not break, open, crush, or chew capsules.",
      "Freezing the capsules or taking them at bedtime may help reduce fishy aftertaste.",
      "Contact your doctor if you experience palpitations, chest fluttering, dizziness, or unusual bleeding or bruising.",
      "Inform your healthcare team if you have an allergy to fish or shellfish before taking this medication."
    ]
  },

  "Evolocumab": {
    genericName: "Evolocumab",
    brandNames: ["Repatha", "Repatha SureClick", "Repatha Pushtronex"],
    pharmacologicClass: "Proprotein Convertase Subtilisin/Kexin Type 9 (PCSK9) Inhibitor / Monoclonal Antibody",
    therapeuticClass: "10. Cardiovascular --- Anti-Lipemic Agent",
    mechanismOfAction: "Human IgG2 monoclonal antibody that binds selectively and with high affinity to circulating proprotein convertase subtilisin/kexin type 9 (PCSK9); prevents PCSK9-mediated degradation of cell-surface LDL receptors (LDLR), recycling LDLR back to the hepatocyte surface; increases hepatic LDLR density by up to 2- to 3-fold, accelerating LDL clearance and reducing serum LDL-C by 55-75%.",
    dosingRegimens: [
      "Primary hyperlipidemia / ASCVD risk reduction: 140 mg SC every 2 weeks (SureClick auto-injector or prefilled syringe) OR 420 mg SC once monthly (infused over 9 minutes via Pushtronex on-body infuser or three 140 mg injections within 30 minutes).",
      "Homozygous familial hypercholesterolemia (HoFH): 420 mg SC once monthly; may escalate to 420 mg SC every 2 weeks after 12 weeks if response is inadequate."
    ],
    sideEffects: {
      common: ["Nasopharyngitis", "Upper respiratory tract infection", "Injection site reactions (redness, pain, bruising)", "Influenza-like illness", "Back pain", "Myalgia", "Headache"],
      severe: ["Severe hypersensitivity reactions (angioedema, urticaria, rash)", "Neurocognitive events (reversible delirium, confusion, memory impairment—rare in trials)"]
    },
    contraindications: [
      "History of serious hypersensitivity reaction to evolocumab or any excipients"
    ],
    drugInteractions: {
      major: [
        "Immunosuppressants or immunomodulators: potential risk of altered immune response or modified monoclonal antibody clearance (clinical impact negligible)"
      ],
      common: [
        "Concurrent statin therapy (statins upregulate PCSK9 expression, which increases evolocumab clearance by ~20%, but combination yields profound synergistic LDL-C lowering up to 75-85%; no dose adjustment required)"
      ]
    },
    monitoringParameters: [
      "Lipid panel (assess LDL-C at 4 to 8 weeks after initiation or dose alteration)",
      "Injection site inspection for local reactions or erythema",
      "Signs and symptoms of hypersensitivity reactions"
    ],
    dosageForms: [
      "Subcutaneous Prefilled SureClick Auto-Injector: 140 mg/mL",
      "Subcutaneous Prefilled Syringe: 140 mg/mL",
      "On-Body Infuser with Cartridge (Pushtronex): 420 mg/3.5 mL"
    ],
    administrationAndCounseling: [
      "Inject subcutaneously into the abdomen, thigh, or upper arm.",
      "Remove auto-injector or syringe from the refrigerator and let it sit at room temperature for at least 30 minutes before injecting; DO NOT warm in microwave or hot water.",
      "Inspect the liquid through the viewing window; it should be clear to opalescent and colorless to pale yellow (do not use if cloudy or contains particles).",
      "Store in refrigerator (36°F to 46°F) in original carton to protect from light; may be kept at room temperature (up to 77°F) for up to 30 days once removed from the fridge.",
      "Do not inject into areas where the skin is tender, bruised, red, or hard.",
      "Seek emergency medical attention if you experience severe itching, swelling of face/lips/throat, or difficulty breathing."
    ]
  }
};
