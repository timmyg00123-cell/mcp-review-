import type { TopDrugClinicalMonograph } from './types.js';

const RAAS_BBW = "Fetal toxicity: When used in pregnancy, drugs that act directly on the renin-angiotensin system can cause injury and death to the developing fetus. Discontinue as soon as possible once pregnancy is detected.";

const BETA_BLOCKER_BBW = "Abrupt cessation of beta-blocker therapy may cause severe exacerbation of angina, myocardial infarction, and ventricular arrhythmias. When discontinuing chronically administered beta-blockers, gradually reduce dosage over 1 to 2 weeks and monitor carefully.";

export const CAT11_ANTIHYPERTENSIVES: Record<string, TopDrugClinicalMonograph> = {
  // ==========================================
  // ACE Inhibitors (BBW: Fetal toxicity)
  // ==========================================
  "Lisinopril": {
    genericName: "Lisinopril",
    brandNames: ["Prinivil", "Zestril", "Qbrelis"],
    pharmacologicClass: "Angiotensin-Converting Enzyme (ACE) Inhibitor / Lysine Analog",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Synthetic peptidyl dipeptidase inhibitor that competitively binds to the zinc catalytic site of angiotensin-converting enzyme (ACE), preventing cleavage of decapeptide angiotensin I into potent vasoconstrictor octapeptide angiotensin II; lowers systemic vascular resistance, reduces aldosterone secretion, and inhibits bradykinin degradation (kallikrein-kinin system), increasing vasodilatory prostaglandins and nitric oxide.",
    dosingRegimens: [
      "Hypertension monotherapy: Start 10 mg PO once daily (5 mg daily if on diuretics or eGFR < 30 mL/min); titrate by 10-20 mg at 1-2 week intervals to target maintenance 20-40 mg PO once daily (max 80 mg/day).",
      "Heart failure with reduced ejection fraction (HFrEF): Start 2.5-5 mg PO once daily; titrate every 2 weeks to target dose of 20-40 mg PO once daily.",
      "Acute myocardial infarction (within 24 hours): 5 mg PO initially, then 5 mg after 24h, 10 mg after 48h, then 10 mg daily for at least 6 weeks."
    ],
    sideEffects: {
      common: ["Dry, persistent, non-productive cough (bradykinin/substance P accumulation, 5-20%)", "Dizziness / lightheadedness", "Headache", "Hyperkalemia", "Fatigue", "Hypotension"],
      severe: ["Angioedema (life-threatening airway compromise of head, neck, tongue, and larynx; higher incidence in Black patients)", "Fetal toxicity and fetal demise", "Acute kidney injury (hemodynamic decline, especially in bilateral renal artery stenosis)", "Agranulocytosis and neutropenia", "Cholestatic jaundice / fulminant hepatic necrosis"]
    },
    contraindications: [
      "History of angioedema related to previous ACE inhibitor therapy or hereditary/idiopathic angioedema",
      "Concomitant use with neprilysin inhibitor (sacubitril/valsartan; requires mandatory 36-hour washout period before or after ACE inhibitor to prevent severe angioedema)",
      "Concomitant use of aliskiren in patients with diabetes mellitus",
      "Pregnancy (second and third trimesters)"
    ],
    blackBoxWarning: RAAS_BBW,
    drugInteractions: {
      major: [
        "Neprilysin inhibitors (sacubitril/valsartan; 36-hour washout mandatory to prevent life-threatening angioedema; contraindicated)",
        "Potassium-sparing diuretics (spironolactone, triamterene, eplerenone) and potassium supplements (additive hyperkalemia risk)",
        "NSAIDs and COX-2 inhibitors (blunt antihypertensive effect and precipitate hemodynamic acute kidney injury by blocking afferent arteriolar prostacyclin vasodilation while ACEi blocks efferent constriction)"
      ],
      common: [
        "Lithium (reduces renal lithium clearance, causing lithium toxicity)",
        "Loop and thiazide diuretics (first-dose severe postural hypotension)"
      ]
    },
    monitoringParameters: [
      "Blood pressure (supine and sitting/standing)",
      "Serum creatinine, BUN, and eGFR at baseline, 1-2 weeks after starting/titrating, and periodically (an acute creatinine rise <=30% is expected hemodynamically and acceptable)",
      "Serum potassium (baseline and periodically, particularly with concurrent potassium-retaining agents)",
      "Monitor for signs of facial, lip, or tongue angioedema",
      "Pregnancy status in females of childbearing potential"
    ],
    dosageForms: [
      "Oral Tablet: 2.5 mg, 5 mg, 10 mg, 20 mg, 30 mg, 40 mg",
      "Oral Solution (Qbrelis): 1 mg/mL"
    ],
    administrationAndCounseling: [
      "Take once daily at the same time each day, with or without food.",
      "A dry, hacking cough may develop that does not go away; notify your doctor if this cough becomes bothersome (switching to an ARB relieves it).",
      "Avoid potassium supplements or salt substitutes containing potassium without consulting your physician.",
      "CRITICAL: If you develop swelling of your face, lips, tongue, or throat, or trouble breathing, STOP taking lisinopril and call 911 immediately.",
      "WOMEN OF CHILDBEARING POTENTIAL: Stop taking immediately and call your doctor if you become pregnant; this medicine causes severe harm or death to an unborn baby."
    ]
  },

  "Enalapril": {
    genericName: "Enalapril",
    brandNames: ["Vasotec", "Epaned"],
    pharmacologicClass: "Angiotensin-Converting Enzyme (ACE) Inhibitor / Ethyl Ester Prodrug",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Ethyl ester prodrug rapidly de-esterified by hepatic esterases to active diacid metabolite enalaprilat; enalaprilat competitively inhibits ACE, blocking conversion of angiotensin I to angiotensin II, decreasing sympathetic tone, dilating efferent renal arterioles, and preventing degradation of bradykinin.",
    dosingRegimens: [
      "Hypertension: Start 5 mg PO once daily (2.5 mg daily if on diuretics or eGFR < 30 mL/min); titrate up to 10-40 mg PO once daily or divided twice daily.",
      "Heart failure (HFrEF): Start 2.5 mg PO twice daily; titrate every 1-2 weeks to target maintenance dose of 10-20 mg PO twice daily.",
      "Asymptomatic left ventricular dysfunction: Start 2.5 mg PO twice daily, titrate to 10 mg twice daily."
    ],
    sideEffects: {
      common: ["Dry cough", "Dizziness", "Hypotension", "Headache", "Hyperkalemia", "Fatigue", "Diarrhea"],
      severe: ["Life-threatening angioedema of larynx/glottis", "Fetal injury and neonatal skull hypoplasia / death", "Acute renal failure (in bilateral renal artery stenosis)", "Neutropenia and agranulocytosis", "Hepatotoxicity"]
    },
    contraindications: [
      "History of ACE inhibitor-associated angioedema or hereditary angioedema",
      "Concomitant use of sacubitril/valsartan within 36 hours",
      "Concomitant aliskiren in patients with diabetes",
      "Pregnancy"
    ],
    blackBoxWarning: RAAS_BBW,
    drugInteractions: {
      major: [
        "Sacubitril/valsartan (36-hour washout required; contraindicated)",
        "Potassium-sparing diuretics, potassium supplements, trimethoprim (severe hyperkalemia)",
        "NSAIDs (diminish antihypertensive effect and trigger acute renal failure)"
      ],
      common: [
        "Lithium (increased serum lithium concentrations and toxicity)",
        "Diuretics (first-dose severe hypotension)"
      ]
    },
    monitoringParameters: [
      "Blood pressure",
      "Serum potassium, creatinine, and BUN at baseline and 1-2 weeks post-titration",
      "Signs of angioedema or persistent dry cough",
      "Pregnancy testing in women of reproductive potential"
    ],
    dosageForms: [
      "Oral Tablet: 2.5 mg, 5 mg, 10 mg, 20 mg",
      "Oral Solution (Epaned): 1 mg/mL",
      "Intravenous Solution (as enalaprilat): 1.25 mg/mL (1 mL, 2 mL vials)"
    ],
    administrationAndCounseling: [
      "Take once or twice daily with or without food at the same times each day.",
      "Do not use salt substitutes containing potassium without consulting your healthcare provider.",
      "Discontinue and seek immediate emergency treatment if you experience facial, tongue, or throat swelling or difficulty swallowing.",
      "Stop taking immediately and inform your physician if you become pregnant."
    ]
  },

  "Ramipril": {
    genericName: "Ramipril",
    brandNames: ["Altace"],
    pharmacologicClass: "Angiotensin-Converting Enzyme (ACE) Inhibitor / Lipophilic Prodrug",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Lipophilic prodrug hydrolyzed by hepatic cleavage to active ramiprilat, a long-acting nonsulfhydryl ACE inhibitor that binds zinc ions in ACE; suppresses the circulating and tissue renin-angiotensin-aldosterone system, decreases cardiac afterload, improves endothelial function, and provides profound cardiovascular event reduction (HOPE trial evidence).",
    dosingRegimens: [
      "Hypertension: Start 2.5 mg PO once daily (1.25 mg daily if on diuretics or renal impairment); titrate to 2.5-20 mg/day PO once daily or divided twice daily.",
      "Reduction in risk of MI, stroke, and cardiovascular death (HOPE trial regimen): Start 2.5 mg PO once daily for 1 week, then 5 mg once daily for 3 weeks, then target maintenance 10 mg PO once daily.",
      "Heart failure post-myocardial infarction: Start 1.25-2.5 mg PO twice daily, titrate to target 5 mg PO twice daily."
    ],
    sideEffects: {
      common: ["Dry cough", "Dizziness", "Hypotension", "Headache", "Hyperkalemia", "Fatigue", "Nausea"],
      severe: ["Angioedema", "Fetal toxicity and death", "Severe acute kidney injury", "Pancytopenia and agranulocytosis"]
    },
    contraindications: [
      "History of angioedema with ACE inhibitors",
      "Concomitant sacubitril/valsartan within 36 hours",
      "Concomitant aliskiren in diabetes",
      "Pregnancy"
    ],
    blackBoxWarning: RAAS_BBW,
    drugInteractions: {
      major: [
        "Sacubitril/valsartan (severe angioedema risk; 36h washout required)",
        "Potassium-sparing agents / Potassium supplements (hyperkalemia)",
        "NSAIDs (nephrotoxicity and decreased antihypertensive response)"
      ],
      common: [
        "Lithium (elevated lithium levels)",
        "Diuretics (postural hypotension)"
      ]
    },
    monitoringParameters: [
      "Blood pressure",
      "Renal function and serum potassium (baseline and periodically)",
      "Angioedema signs",
      "Pregnancy testing"
    ],
    dosageForms: [
      "Oral Capsule: 1.25 mg, 2.5 mg, 5 mg, 10 mg"
    ],
    administrationAndCounseling: [
      "Take once daily with or without food.",
      "Altace capsules may be swallowed whole, or carefully opened and the contents sprinkled onto cool applesauce (approx 4 oz) or mixed in 4 oz of water or apple juice.",
      "Avoid potassium supplements or high-potassium salt substitutes.",
      "Seek emergency care immediately if facial or throat swelling occurs.",
      "Stop taking immediately if you become pregnant."
    ]
  },

  "Benazepril": {
    genericName: "Benazepril",
    brandNames: ["Lotensin"],
    pharmacologicClass: "Angiotensin-Converting Enzyme (ACE) Inhibitor / Ester Prodrug",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Ester prodrug cleaved by hepatic carboxylesterases to active diacid benazeprilat, which potently inhibits ACE; suppresses angiotensin II vasoconstriction, decreases aldosterone secretion, promotes mild natriuresis, and reduces intraglomerular pressure, slowing renal disease progression in diabetic and non-diabetic nephropathies.",
    dosingRegimens: [
      "Hypertension: Start 10 mg PO once daily (5 mg daily in renal impairment CrCl < 30 mL/min or concurrent diuretics); titrate to maintenance 20-40 mg PO once daily or divided twice daily (max 80 mg/day)."
    ],
    sideEffects: {
      common: ["Dry cough", "Headache", "Dizziness", "Fatigue", "Somnolence", "Postural dizziness", "Hyperkalemia"],
      severe: ["Angioedema of face/airway", "Fetal toxicity", "Acute renal failure", "Agranulocytosis"]
    },
    contraindications: [
      "History of angioedema with prior ACE inhibitor therapy",
      "Concomitant sacubitril/valsartan within 36 hours",
      "Concomitant aliskiren in diabetic patients",
      "Pregnancy"
    ],
    blackBoxWarning: RAAS_BBW,
    drugInteractions: {
      major: [
        "Sacubitril/valsartan (angioedema; 36-hour washout required)",
        "Potassium-sparing diuretics / supplements (hyperkalemia)",
        "NSAIDs (antihypertensive attenuation and acute kidney injury)"
      ],
      common: [
        "Lithium (increased toxicity)",
        "Diuretics (hypotensive response)"
      ]
    },
    monitoringParameters: [
      "Blood pressure",
      "Serum creatinine and potassium",
      "Cough and angioedema",
      "Pregnancy status"
    ],
    dosageForms: [
      "Oral Tablet: 5 mg, 10 mg, 20 mg, 40 mg"
    ],
    administrationAndCounseling: [
      "Take once daily with or without food.",
      "Report any persistent dry cough or signs of facial swelling immediately.",
      "Avoid potassium-containing salt substitutes.",
      "Discontinue immediately if you discover you are pregnant."
    ]
  },

  // ==========================================
  // Angiotensin Receptor Blockers (BBW: Fetal toxicity)
  // ==========================================
  "Losartan": {
    genericName: "Losartan",
    brandNames: ["Cozaar", "Hyzaar"],
    pharmacologicClass: "Angiotensin II Receptor Blocker (ARB) / Imidazole Derivative",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Non-peptide imidazole derivative that competitively blocks the binding of angiotensin II to the angiotensin II type 1 (AT1) receptor in vascular smooth muscle and adrenal glands; metabolized via CYP2C9 and CYP3A4 to active metabolite E-3174 (EXP-3174), which is 10- to 40-fold more potent than parent losartan and acts as a non-competitive, insurmountable AT1 antagonist; lowers SVR, promotes natriuresis, reduces proteinuria, and uniquely exhibits uricosuric activity by inhibiting the URAT1 renal transporter; does not inhibit ACE or cause bradykinin accumulation (dry cough rate comparable to placebo).",
    dosingRegimens: [
      "Hypertension monotherapy: Start 50 mg PO once daily (25 mg daily if on diuretics or hepatic impairment); titrate to 50-100 mg PO once daily (or divided twice daily; max 100 mg/day).",
      "Diabetic nephropathy in type 2 diabetes with elevated serum creatinine and proteinuria: Start 50 mg PO once daily; increase to 100 mg PO once daily based on blood pressure response.",
      "Stroke risk reduction in hypertension with left ventricular hypertrophy (LIFE study): Start 50 mg PO once daily; add hydrochlorothiazide 12.5 mg and titrate losartan to 100 mg daily."
    ],
    sideEffects: {
      common: ["Dizziness", "Upper respiratory tract infection", "Nasal congestion", "Back pain", "Fatigue", "Hyperkalemia"],
      severe: ["Angioedema (rare; can occur in patients with prior ACEi angioedema)", "Fetal toxicity, oligohydramnios, neonatal renal failure, and death", "Acute kidney injury (in volume-depleted states or renal artery stenosis)", "Severe hypotension", "Rhabdomyolysis (rare)"]
    },
    contraindications: [
      "Concomitant use with aliskiren in patients with diabetes mellitus",
      "Hypersensitivity to losartan potassium",
      "Pregnancy (second and third trimesters)"
    ],
    blackBoxWarning: RAAS_BBW,
    drugInteractions: {
      major: [
        "Potassium-sparing diuretics (spironolactone, triamterene, amiloride), potassium supplements, and trimethoprim (additive hyperkalemia risk)",
        "Aliskiren (dual RAAS blockade in diabetes increases hypotension, hyperkalemia, and renal impairment; contraindicated)",
        "NSAIDs / COX-2 inhibitors (decrease antihypertensive effect and precipitate acute renal failure)"
      ],
      common: [
        "Lithium (decreased lithium renal excretion, raising serum levels)",
        "CYP2C9 inducers/inhibitors (fluconazole inhibits active metabolite E-3174 formation; rifampin reduces losartan levels)"
      ]
    },
    monitoringParameters: [
      "Blood pressure",
      "Renal function (serum creatinine, BUN, eGFR) and serum potassium at baseline and 1-2 weeks post-initiation/titration",
      "Serum uric acid (losartan lowers uric acid via URAT1 inhibition, beneficial in gout)",
      "Urinary albumin/protein excretion in diabetic nephropathy",
      "Pregnancy testing in females of reproductive potential"
    ],
    dosageForms: [
      "Oral Tablet: 25 mg, 50 mg, 100 mg"
    ],
    administrationAndCounseling: [
      "Take once daily at the same time each day, with or without food.",
      "Does not cause the persistent dry hacking cough seen with ACE inhibitors.",
      "Avoid potassium supplements or salt substitutes containing potassium unless advised by your physician.",
      "CRITICAL: Stop taking immediately and notify your doctor if you become pregnant; this medicine causes injury or death to an unborn baby.",
      "Get up slowly from sitting or lying down to prevent dizziness."
    ]
  },

  "Olmesartan": {
    genericName: "Olmesartan",
    brandNames: ["Benicar", "Azor", "Tribenzor"],
    pharmacologicClass: "Angiotensin II Receptor Blocker (ARB) / Medoxomil Ester Prodrug",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Medoxomil ester prodrug completely hydrolyzed during intestinal absorption to active olmesartan, a potent selective antagonist of angiotensin II at AT1 receptors; blocks vasoconstrictor and aldosterone-secreting effects of angiotensin II; uniquely associated with rare sprue-like enteropathy causing severe chronic diarrhea and intestinal villous atrophy.",
    dosingRegimens: [
      "Hypertension: Start 20 mg PO once daily (may start at 40 mg daily for greater BP reduction; 10 mg daily in volume depletion); titrate up to 40 mg PO once daily after 2 weeks if needed (doses >40 mg provide no added benefit)."
    ],
    sideEffects: {
      common: ["Dizziness", "Back pain", "Upper respiratory tract infection", "Bronchitis", "Diarrhea", "Headache", "Hyperkalemia"],
      severe: ["Sprue-like enteropathy (severe, chronic diarrhea with substantial weight loss and intestinal villous atrophy, developing months to years after initiation; requires permanent discontinuation)", "Fetal toxicity and fetal demise", "Acute kidney injury", "Angioedema"]
    },
    contraindications: [
      "Concomitant aliskiren in patients with diabetes",
      "Hypersensitivity to olmesartan medoxomil",
      "Pregnancy"
    ],
    blackBoxWarning: RAAS_BBW,
    drugInteractions: {
      major: [
        "Potassium-retaining agents and potassium supplements (hyperkalemia)",
        "Aliskiren (contraindicated in diabetes)",
        "NSAIDs (reduced antihypertensive efficacy and elevated risk of acute renal dysfunction)"
      ],
      common: [
        "Lithium (increased lithium toxicity)",
        "Colesevelam (binds olmesartan; administer olmesartan at least 4 hours before colesevelam)"
      ]
    },
    monitoringParameters: [
      "Blood pressure",
      "Renal function and serum electrolytes (potassium)",
      "Gastrointestinal symptoms: promptly investigate severe chronic diarrhea and unexplained weight loss (rule out sprue-like enteropathy)",
      "Pregnancy status"
    ],
    dosageForms: [
      "Oral Tablet: 5 mg, 20 mg, 40 mg"
    ],
    administrationAndCounseling: [
      "Take once daily with or without food at the same time each day.",
      "Contact your doctor immediately if you develop severe chronic watery diarrhea and significant weight loss, even if you have taken olmesartan for months or years.",
      "Avoid potassium-containing salt substitutes.",
      "Stop taking immediately if you become pregnant."
    ]
  },

  "Irbesartan": {
    genericName: "Irbesartan",
    brandNames: ["Avapro", "Avalide"],
    pharmacologicClass: "Angiotensin II Receptor Blocker (ARB) / Non-Competitive Antagonist",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Non-peptide tetrazole derivative that non-competitively and selectively antagonizes angiotensin II type 1 (AT1) receptors with >8500-fold greater affinity than for AT2; blocks all physiological actions of angiotensin II regardless of synthesis pathway (ACE or chymase); significantly reduces nephropathy progression and doubling of serum creatinine in diabetic hypertension.",
    dosingRegimens: [
      "Hypertension: Start 150 mg PO once daily (75 mg daily in volume/salt-depleted patients); titrate to target 300 mg PO once daily.",
      "Diabetic nephropathy in type 2 diabetes: Target maintenance dose is 300 mg PO once daily."
    ],
    sideEffects: {
      common: ["Dizziness", "Fatigue", "Diarrhea", "Dyspepsia", "Musculoskeletal pain", "Hyperkalemia"],
      severe: ["Fetal toxicity and neonatal death", "Acute renal failure", "Severe hypotension", "Angioedema"]
    },
    contraindications: [
      "Concomitant aliskiren in patients with diabetes",
      "Hypersensitivity to irbesartan",
      "Pregnancy"
    ],
    blackBoxWarning: RAAS_BBW,
    drugInteractions: {
      major: [
        "Potassium-sparing diuretics, potassium supplements (hyperkalemia)",
        "Aliskiren in diabetes (contraindicated)",
        "NSAIDs (blunt BP effect and risk acute renal failure)"
      ],
      common: [
        "Lithium (increased serum lithium concentrations)"
      ]
    },
    monitoringParameters: [
      "Blood pressure",
      "Serum potassium and creatinine at baseline and 1-2 weeks post-titration",
      "Urinary albumin/protein excretion",
      "Pregnancy status"
    ],
    dosageForms: [
      "Oral Tablet: 75 mg, 150 mg, 300 mg"
    ],
    administrationAndCounseling: [
      "Take once daily with or without food.",
      "Protects kidneys in patients with diabetes and high blood pressure.",
      "Avoid potassium salt substitutes.",
      "Discontinue immediately if pregnancy is detected."
    ]
  },

  "Valsartan": {
    genericName: "Valsartan",
    brandNames: ["Diovan", "Diovan HCT", "Exforge"],
    pharmacologicClass: "Angiotensin II Receptor Blocker (ARB) / Non-Peptide Tetrazole",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Orally active, non-heterocyclic tetrazole derivative that selectively and competitively blocks AT1 receptors in vascular smooth muscle and adrenal cortex; prevents angiotensin II-mediated vasoconstriction, aldosterone synthesis, vasopressin release, and cardiac hypertrophy; demonstrated efficacy in post-MI and heart failure (Val-HeFT trial).",
    dosingRegimens: [
      "Hypertension: Start 80-160 mg PO once daily (40 mg in elderly or volume-depleted); titrate to 80-320 mg PO once daily.",
      "Heart failure (NYHA Class II-IV): Start 40 mg PO twice daily; titrate every 1-2 weeks to target maintenance dose of 160 mg PO twice daily.",
      "Post-myocardial infarction (within 10 days post-MI): Start 20 mg PO twice daily; titrate within weeks to target 160 mg PO twice daily."
    ],
    sideEffects: {
      common: ["Dizziness", "Hypotension", "Headache", "Hyperkalemia", "Fatigue", "Diarrhea", "Abdominal pain"],
      severe: ["Fetal toxicity and neonatal skull hypoplasia / death", "Severe acute kidney injury", "Angioedema", "Agranulocytosis (rare)"]
    },
    contraindications: [
      "Concomitant use of aliskiren in patients with diabetes",
      "Hypersensitivity to valsartan",
      "Pregnancy"
    ],
    blackBoxWarning: RAAS_BBW,
    drugInteractions: {
      major: [
        "Aliskiren (contraindicated in diabetic patients)",
        "Potassium-sparing diuretics and potassium supplements (hyperkalemia)",
        "NSAIDs (reduced antihypertensive effect and renal failure)"
      ],
      common: [
        "Lithium (increased toxicity)",
        "CYP2C9 inhibitors (mild increase in valsartan levels)"
      ]
    },
    monitoringParameters: [
      "Blood pressure and heart rate",
      "Serum potassium, BUN, and creatinine",
      "Signs of angioedema",
      "Pregnancy testing in women of reproductive potential"
    ],
    dosageForms: [
      "Oral Tablet: 40 mg, 80 mg, 160 mg, 320 mg",
      "Oral Solution: 4 mg/mL"
    ],
    administrationAndCounseling: [
      "Take once or twice daily with or without food at the same times each day.",
      "Avoid potassium supplements or potassium-based salt substitutes.",
      "Rise slowly from sitting to standing to avoid dizziness.",
      "CRITICAL: Stop taking this medication immediately if you become pregnant; it causes severe birth defects or death to an unborn baby."
    ]
  },

  // ==========================================
  // Diuretics
  // ==========================================
  "Hydrochlorothiazide": {
    genericName: "Hydrochlorothiazide",
    brandNames: ["Microzide", "HydroDIURIL"],
    pharmacologicClass: "Thiazide Diuretic / NCC Cotransporter Inhibitor",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Inhibits the electroneutral sodium-chloride cotransporter (NCCT / SLC12A3) in the luminal membrane of the early distal convoluted tubule; increases urinary excretion of sodium, chloride, and water, along with potassium and magnesium; enhances calcium reabsorption; initially lowers blood pressure via volume depletion and long-term by reducing total peripheral vascular resistance.",
    dosingRegimens: [
      "Hypertension monotherapy / combination: 12.5-25 mg PO once daily in the morning; may increase to 50 mg PO once daily (doses >25 mg yield minimal added BP reduction with higher metabolic adverse effects).",
      "Edema associated with heart failure or cirrhosis: 25-100 mg PO daily in single or divided doses."
    ],
    sideEffects: {
      common: ["Hypokalemia", "Hyponatremia", "Hyperuricemia (may precipitate acute gout)", "Hyperglycemia", "Hypomagnesemia", "Dizziness", "Headache", "Photosensitivity"],
      severe: ["Severe electrolyte derangements (arrhythmogenic hypokalemia, profound hyponatremia)", "Acute angle-closure glaucoma and acute myopia", "Non-melanoma skin cancer (squamous cell carcinoma with high cumulative lifetime exposure)", "Pancreatitis", "Systemic lupus erythematosus reactivation"]
    },
    contraindications: [
      "Anuria",
      "Hypersensitivity to hydrochlorothiazide or other sulfonamide-derived drugs"
    ],
    drugInteractions: {
      major: [
        "Lithium (hydrochlorothiazide reduces renal lithium clearance, causing dangerous lithium accumulation and neurotoxicity; avoid combination or reduce lithium dose by 50%)",
        "Digoxin (hypokalemia and hypomagnesemia induced by HCTZ dramatically increase digoxin-induced fatal cardiac arrhythmias)"
      ],
      common: [
        "NSAIDs (inhibit renal prostaglandins, blunting diuretic and antihypertensive efficacy)",
        "Antidiabetic drugs (thiazides induce hyperglycemia, requiring antidiabetic dose titration)"
      ]
    },
    monitoringParameters: [
      "Serum electrolytes (sodium, potassium, chloride, magnesium, bicarbonate) at baseline, 2-4 weeks after initiation, and periodically",
      "Serum uric acid and blood glucose / HbA1c",
      "Renal function (BUN, creatinine; thiazides lose efficacy when eGFR < 30 mL/min)",
      "Skin checks for non-melanoma cutaneous lesions in long-term users"
    ],
    dosageForms: [
      "Oral Capsule: 12.5 mg",
      "Oral Tablet: 12.5 mg, 25 mg, 50 mg"
    ],
    administrationAndCounseling: [
      "Take once daily in the morning with food to avoid nighttime awakenings to urinate.",
      "Eat potassium-rich foods (bananas, oranges, potatoes) or take prescribed potassium supplements as directed by your doctor.",
      "Wear protective sunscreen and clothing; this medicine makes your skin sensitive to sunburn.",
      "Get up slowly from sitting or lying down to prevent dizziness or fainting.",
      "Contact your doctor immediately if you experience sudden eye pain or decreased vision."
    ]
  },

  "Chlorthalidone": {
    genericName: "Chlorthalidone",
    brandNames: ["Hygroton", "Thalitone"],
    pharmacologicClass: "Thiazide-Like Diuretic / Phthalimidine Derivative",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Long-acting phthalimidine derivative that acts as a thiazide-like diuretic by inhibiting the Na+/Cl- cotransporter in the cortical diluting segment of the distal convoluted tubule; partitions extensively into red blood cells, resulting in a prolonged terminal elimination half-life (~40-60 hours) and sustained 24-hour ambulatory blood pressure reduction superior to HCTZ (ALLHAT trial).",
    dosingRegimens: [
      "Hypertension: Start 12.5-25 mg PO once daily in the morning; may titrate to 25-50 mg PO once daily (doses >25 mg increase hypokalemia risk with minimal extra BP lowering).",
      "Edema: 50-100 mg PO once daily or 100-200 mg PO every other day."
    ],
    sideEffects: {
      common: ["Hypokalemia (higher incidence than equimolar HCTZ)", "Hyponatremia", "Hyperuricemia", "Hyperglycemia", "Hypomagnesemia", "Dizziness", "Orthostasis"],
      severe: ["Refractory hypokalemic ventricular dysrhythmias", "Severe hyponatremia and osmotic demyelination", "Acute angle-closure glaucoma", "Pancreatitis", "Agranulocytosis and thrombocytopenia"]
    },
    contraindications: [
      "Anuria",
      "Hypersensitivity to chlorthalidone or sulfonamides"
    ],
    drugInteractions: {
      major: [
        "Lithium (reduces clearance; lithium toxicity)",
        "Digoxin (hypokalemia markedly potentiates digitalis cardiotoxicity)"
      ],
      common: [
        "NSAIDs (attenuate diuretic response)",
        "Potassium-wasting steroids (additive hypokalemia)"
      ]
    },
    monitoringParameters: [
      "Serum potassium, sodium, magnesium, and creatinine (baseline, 2 weeks, and regularly)",
      "Blood pressure (ambulatory and clinic)",
      "Uric acid and fasting glucose"
    ],
    dosageForms: [
      "Oral Tablet: 25 mg, 50 mg"
    ],
    administrationAndCounseling: [
      "Take once daily in the morning with breakfast to avoid nocturnal urination.",
      "Have your potassium levels checked regularly as instructed; chlorthalidone is potent and frequently requires a potassium supplement.",
      "Rise slowly from chairs or bed to prevent lightheadedness.",
      "Report any muscle cramps, palpitations, or severe weakness."
    ]
  },

  "Furosemide": {
    genericName: "Furosemide",
    brandNames: ["Lasix"],
    pharmacologicClass: "Loop Diuretic / Anthranilic Acid Sulfonamide",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Inhibits the Na+/K+/2Cl- cotransporter (NKCC2) in the thick ascending limb of the loop of Henle, blocking reabsorption of 20-25% of filtered sodium and chloride load; destroys the corticomedullary osmotic gradient, producing massive natriuresis and diuresis; increases urinary excretion of potassium, hydrogen, calcium, and magnesium; stimulates intrarenal prostaglandin synthesis to increase renal blood flow.",
    dosingRegimens: [
      "Edema associated with heart failure / Cirrhosis / Renal disease: Start 20-80 mg PO once daily in the morning; titrate in 20-40 mg increments q6-8h until desired diuresis is achieved (max oral daily dose typically 600 mg).",
      "Hypertension: 20-40 mg PO twice daily.",
      "Acute pulmonary edema: 40 mg IV over 1-2 minutes; increase to 80 mg IV if response inadequate within 1 hour."
    ],
    sideEffects: {
      common: ["Hypokalemia", "Hyponatremia", "Hypomagnesemia", "Hypocalcemia", "Hyperuricemia", "Dizziness", "Orthostatic hypotension", "Prerenal azotemia"],
      severe: ["Profound diuresis with water and electrolyte depletion / circulatory collapse", "Ototoxicity (tinnitus, reversible or permanent sensorineural hearing loss with high doses or rapid IV injection)", "Severe acute kidney injury", "Agranulocytosis, thrombocytopenia, and aplastic anemia", "Pancreatitis"]
    },
    contraindications: [
      "Anuria",
      "Hypersensitivity to furosemide or sulfonamides",
      "Severe uncorrected electrolyte depletion or hepatic coma"
    ],
    blackBoxWarning: "Furosemide is a potent diuretic that, if given in excessive amounts, can lead to a profound diuresis with water and electrolyte depletion. Therefore, careful medical supervision is required and dose and dose schedule must be adjusted to the individual patient's needs.",
    drugInteractions: {
      major: [
        "Aminoglycosides (gentamicin, tobramycin; synergistic ototoxicity and nephrotoxicity; avoid combination)",
        "Digoxin (furosemide-induced hypokalemia triggers digitalis arrhythmias)",
        "Lithium (reduces lithium excretion, causing lithium toxicity)"
      ],
      common: [
        "NSAIDs (inhibit renal prostaglandins, decreasing diuretic efficacy and precipitating renal failure)",
        "Antihypertensive agents (additive hypotension)"
      ]
    },
    monitoringParameters: [
      "Daily body weight (best indicator of fluid status and diuretic response)",
      "Serum electrolytes (potassium, sodium, magnesium, calcium, chloride, bicarbonate)",
      "Renal function (BUN, serum creatinine, urine output)",
      "Audiometry / hearing checks in high-dose or rapid IV therapy"
    ],
    dosageForms: [
      "Oral Tablet: 20 mg, 40 mg, 80 mg",
      "Oral Solution: 10 mg/mL, 40 mg/5 mL (8 mg/mL)",
      "Intravenous Injection: 10 mg/mL (2 mL, 4 mL, 10 mL vials)"
    ],
    administrationAndCounseling: [
      "Take once daily in the morning, or if twice daily, take the second dose in the early afternoon (by 2-4 PM) to avoid waking up at night to urinate.",
      "Weigh yourself every morning after urinating and before eating; record your weight and report a gain of >2-3 pounds in 1 day or >5 pounds in 1 week to your doctor.",
      "Take your potassium supplement regularly as prescribed.",
      "Rise slowly to sitting and standing positions to avoid dizzy spells and falls.",
      "Notify your doctor immediately if you develop ringing in your ears (tinnitus) or hearing loss."
    ]
  },

  "Triamterene / Hydrochlorothiazide": {
    genericName: "Triamterene / Hydrochlorothiazide",
    brandNames: ["Dyazide", "Maxzide", "Maxzide-25"],
    pharmacologicClass: "Potassium-Sparing Diuretic / Thiazide Diuretic Combination",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Fixed-dose combination of triamterene (blocks epithelial sodium channels [ENaC] in late distal tubules and collecting ducts, inhibiting sodium reabsorption and potassium/hydrogen excretion) and hydrochlorothiazide (inhibits Na+/Cl- cotransport in early distal tubule); provides complementary natriuresis while triamterene offsets thiazide-induced hypokalemia.",
    dosingRegimens: [
      "Hypertension / Edema (Maxzide): 1 tablet (75 mg triamterene / 50 mg HCTZ) PO once daily in the morning; or Maxzide-25 (37.5/25 mg) 1-2 tablets once daily.",
      "Dyazide capsule (37.5 mg triamterene / 25 mg HCTZ): 1-2 capsules PO once daily in the morning."
    ],
    sideEffects: {
      common: ["Hyperkalemia", "Dizziness", "Headache", "Fatigue", "Nausea", "Dyspepsia", "Diarrhea", "Muscle cramps"],
      severe: ["Severe, fatal hyperkalemia (cardiac arrest)", "Nephrolithiasis (triamterene kidney stones)", "Acute interstitial nephritis and acute renal failure", "Pancreatitis", "Megaloblastic anemia in cirrhosis (folic acid antagonism)"]
    },
    contraindications: [
      "Hyperkalemia (serum potassium >= 5.5 mEq/L)",
      "Concomitant use of other potassium-sparing agents (spironolactone, amiloride) or potassium supplements",
      "Severe renal impairment (eGFR < 30 mL/min) or anuria",
      "Severe hepatic impairment",
      "Hypersensitivity to triamterene, HCTZ, or sulfonamides"
    ],
    blackBoxWarning: "Hyperkalemia: Abnormal elevation of serum potassium levels (>= 5.5 mEq/L) can occur with triamterene/hydrochlorothiazide. Hyperkalemia is more likely to occur in patients with renal impairment, diabetes (even without evidence of renal impairment), and in elderly or severely ill patients. Since uncorrected hyperkalemia may be fatal, serum potassium levels must be monitored frequently.",
    drugInteractions: {
      major: [
        "ACE inhibitors, ARBs, Aliskiren, and Potassium supplements (synergistic risk of fatal hyperkalemia; avoid concomitant potassium supplementation)",
        "Lithium (reduced renal clearance; lithium toxicity)"
      ],
      common: [
        "NSAIDs (severe acute renal failure and attenuation of diuretic effect)",
        "Digoxin (hyperkalemia blunts digoxin effect; electrolyte imbalances cause arrhythmias)"
      ]
    },
    monitoringParameters: [
      "Serum potassium and electrolytes (baseline, 1 week, and periodically; discontinue if potassium > 5.5 mEq/L)",
      "Renal function (BUN, serum creatinine)",
      "Complete blood count and liver function",
      "Urinalysis for triamterene stone sediment"
    ],
    dosageForms: [
      "Oral Capsule (Dyazide): 37.5 mg triamterene / 25 mg HCTZ",
      "Oral Tablet (Maxzide-25): 37.5 mg triamterene / 25 mg HCTZ",
      "Oral Tablet (Maxzide): 75 mg triamterene / 50 mg HCTZ"
    ],
    administrationAndCounseling: [
      "Take once daily in the morning with food to reduce stomach upset and avoid nighttime urination.",
      "DO NOT take potassium supplements or use potassium-containing salt substitutes while taking this medication.",
      "Drink plenty of water to prevent kidney stones.",
      "Contact your doctor immediately if you experience irregular heartbeats, severe muscle weakness, or numbness/tingling (signs of high potassium)."
    ]
  },

  "Spironolactone": {
    genericName: "Spironolactone",
    brandNames: ["Aldactone", "CaroSpir"],
    pharmacologicClass: "Aldosterone Receptor Antagonist / Potassium-Sparing Diuretic",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Steroidal synthetic competitive antagonist of the mineralocorticoid (aldosterone) receptor in the cortical collecting tubule; prevents aldosterone-mediated gene transcription of ENaC sodium channels and Na+/K+-ATPase pumps, promoting excretion of sodium, chloride, and water while retaining potassium and hydrogen ions; also acts as a non-selective antagonist at androgen and progesterone receptors.",
    dosingRegimens: [
      "Heart failure with reduced ejection fraction (HFrEF, RALES trial): Start 12.5-25 mg PO once daily (if eGFR > 50 mL/min and K < 5.0 mEq/L); titrate to target 25-50 mg PO once daily.",
      "Hypertension (resistant hypertension fourth-line agent): 25-100 mg PO daily in single or divided doses.",
      "Hepatic cirrhosis with ascites: 100-400 mg PO daily in single or divided doses (often combined with furosemide in 100:40 ratio).",
      "Primary hyperaldosteronism: 100-400 mg PO daily prior to surgery or long-term."
    ],
    sideEffects: {
      common: ["Gynecomastia (tender breast tissue enlargement in males, 10-15%)", "Hyperkalemia", "Menstrual irregularities / amenorrhea in females", "Erectile dysfunction and decreased libido", "Dizziness", "Drowsiness", "Nausea"],
      severe: ["Severe, fatal hyperkalemia (arrhythmias, heart block, cardiac arrest)", "Acute kidney injury and dehydration", "Secondary tumorigenic potential (malignancies observed in chronic rodent toxicity studies)", "Agranulocytosis"]
    },
    contraindications: [
      "Hyperkalemia (baseline serum potassium > 5.0 mEq/L)",
      "Severe renal impairment (eGFR < 30 mL/min or serum creatinine > 2.5 mg/dL in men, > 2.0 mg/dL in women)",
      "Addison's disease or primary adrenal insufficiency",
      "Concomitant use with eplerenone"
    ],
    blackBoxWarning: "Spironolactone has been shown to be a tumorigen in chronic toxicity studies in rats. Spironolactone should be used only in those conditions described under Indications and Usage. Unnecessary use of this drug should be avoided.",
    drugInteractions: {
      major: [
        "ACE inhibitors, ARBs, and Neprilysin inhibitors (synergistic risk of severe, fatal hyperkalemia; close potassium monitoring mandatory)",
        "Potassium supplements and other potassium-sparing diuretics (contraindicated)",
        "NSAIDs (inhibit renal prostaglandins, impairing spironolactone natriuretic response and causing acute renal failure)"
      ],
      common: [
        "Digoxin (spironolactone increases digoxin half-life and falsely elevates digoxin radioimmunoassay levels)",
        "Lithium (reduces lithium clearance)"
      ]
    },
    monitoringParameters: [
      "Serum potassium and renal function (BUN, creatinine) at baseline, 3 days, 1 week, monthly for 3 months, then quarterly (hold or reduce dose if K > 5.0 mEq/L, discontinue if K > 5.5 mEq/L)",
      "Blood pressure and fluid balance (weight)",
      "Clinical signs of gynecomastia, breast tenderness, or menstrual irregularities"
    ],
    dosageForms: [
      "Oral Tablet (Aldactone): 25 mg, 50 mg, 100 mg",
      "Oral Suspension (CaroSpir): 25 mg/5 mL"
    ],
    administrationAndCounseling: [
      "Take once daily with or without food, but take consistently with regard to meals at the same time each day.",
      "CRITICAL: Avoid all potassium supplements, salt substitutes, and foods very high in potassium (e.g., excessive bananas, dried fruits) unless specifically prescribed by your doctor.",
      "Male patients: Notify your doctor if you notice tenderness or enlargement in your breast tissue.",
      "Women: Inform your doctor if you experience irregular periods or spotting.",
      "Seek urgent medical evaluation if you develop palpitations, muscle weakness, or tingling in your hands/feet."
    ]
  },

  // ==========================================
  // Calcium Channel Blockers
  // ==========================================
  "Amlodipine": {
    genericName: "Amlodipine",
    brandNames: ["Norvasc", "Lotrel", "Katerzia", "Norliqva"],
    pharmacologicClass: "Dihydropyridine Calcium Channel Blocker (CCB)",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Long-acting third-generation dihydropyridine calcium antagonist that selectively inhibits transmembrane influx of extracellular calcium ions into vascular smooth muscle and cardiac muscle through L-type voltage-gated calcium channels; causes peripheral arterial vasodilation, lowering systemic vascular resistance and blood pressure without depressing SA or AV nodal conduction; slow receptor association/dissociation yields a prolonged elimination half-life of 30-50 hours.",
    dosingRegimens: [
      "Hypertension: Start 5 mg PO once daily (2.5 mg daily in elderly, small-frame, or hepatic impairment); titrate every 1-2 weeks to maximum 10 mg PO once daily.",
      "Chronic stable angina / Vasospastic (Prinzmetal's) angina: 5-10 mg PO once daily (10 mg target for angina)."
    ],
    sideEffects: {
      common: ["Peripheral edema (dependent lower extremity edema due to precapillary arteriolar dilation without venous dilation, 10-15%)", "Dizziness", "Flushing", "Palpitations", "Fatigue", "Nausea", "Headache"],
      severe: ["Severe hypotension with reflex tachycardia", "Exacerbation of angina or acute myocardial infarction upon initiation or dose increase in severe obstructive CAD", "Worsening heart failure in severe HFrEF", "Gingival hyperplasia (rare)"]
    },
    contraindications: [
      "Known hypersensitivity to amlodipine or other dihydropyridines",
      "Severe hypotension or cardiogenic shock"
    ],
    drugInteractions: {
      major: [
        "Simvastatin (amlodipine increases simvastatin exposure; limit simvastatin dose to maximum 20 mg daily to avoid rhabdomyolysis)",
        "CYP3A4 inhibitors (ketoconazole, itraconazole, ritonavir; double amlodipine exposure, causing severe hypotension and edema)"
      ],
      common: [
        "Cyclosporine, Tacrolimus (amlodipine inhibits CYP3A4, increasing calcineurin inhibitor blood levels)",
        "Diltiazem (increases amlodipine AUC by ~50%)"
      ]
    },
    monitoringParameters: [
      "Blood pressure and heart rate",
      "Dependent edema (ankle and pretibial swelling)",
      "Frequency and severity of angina episodes"
    ],
    dosageForms: [
      "Oral Tablet: 2.5 mg, 5 mg, 10 mg",
      "Oral Suspension (Katerzia): 1 mg/mL",
      "Oral Solution (Norliqva): 1 mg/mL"
    ],
    administrationAndCounseling: [
      "Take once daily at any time of day, with or without food.",
      "Swelling of the ankles and feet is a common side effect; elevate your legs when sitting and notify your doctor if swelling becomes severe.",
      "Does not cause the dry cough associated with other blood pressure medicines.",
      "Do not take more than 20 mg of simvastatin (Zocor) daily while on amlodipine.",
      "Rise slowly from sitting or lying down to prevent dizziness."
    ]
  },

  "Nifedipine Extended Release": {
    genericName: "Nifedipine Extended Release",
    brandNames: ["Procardia XL", "Adalat CC", "Nifedical XL"],
    pharmacologicClass: "Dihydropyridine Calcium Channel Blocker (CCB)",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "First-generation dihydropyridine calcium channel blocker formulated in osmotic gastrointestinal release systems (GITS/CC); selectively blocks L-type calcium channels in vascular smooth muscle, producing peripheral arterial vasodilation; extended-release design avoids the precipitous hypotension and dangerous reflex sympathetic activation associated with immediate-release capsules.",
    dosingRegimens: [
      "Hypertension / Angina: Start 30-60 mg PO once daily in the morning; titrate over 7-14 days to target maintenance 60-90 mg PO once daily (max 90-120 mg/day).",
      "IMMEDIATE-RELEASE WARNING: Immediate-release nifedipine capsules should NOT be used for acute hypertensive emergencies due to documented risk of stroke, MI, and death from precipitous hypotension."
    ],
    sideEffects: {
      common: ["Peripheral edema", "Headache", "Flushing", "Dizziness", "Palpitations", "Nausea", "Fatigue", "Constipation"],
      severe: ["Profound hypotension and reflex tachycardia", "Myocardial ischemia / infarction (precipitated in CAD)", "Gastrointestinal obstruction (with GITS tablet shell in patients with pre-existing severe GI narrowing)", "Heart failure decompensation"]
    },
    contraindications: [
      "Known hypersensitivity to nifedipine",
      "Cardiogenic shock or advanced aortic stenosis",
      "Concomitant administration with strong CYP3A4 inducers (rifampin, St. John's Wort)"
    ],
    drugInteractions: {
      major: [
        "Strong CYP3A4 inducers (rifampin; dramatically decreases nifedipine bioavailability, rendering it ineffective; contraindicated)",
        "CYP3A4 inhibitors (fluconazole, clarithromycin; increase nifedipine levels and hypotension)"
      ],
      common: [
        "Beta-blockers (usually well tolerated, but can produce excessive hypotension or worsen heart failure)",
        "Digoxin (may increase digoxin levels by ~45%)",
        "Grapefruit juice (inhibits CYP3A4; avoid excessive consumption)"
      ]
    },
    monitoringParameters: [
      "Blood pressure and pulse rate",
      "Lower extremity edema",
      "Frequency of chest pain in angina patients"
    ],
    dosageForms: [
      "Extended-Release Tablet (Procardia XL, GITS): 30 mg, 60 mg, 90 mg",
      "Extended-Release Tablet (Adalat CC): 30 mg, 60 mg, 90 mg"
    ],
    administrationAndCounseling: [
      "Take once daily in the morning on an empty stomach or with a consistent meal; swallow tablets whole.",
      "DO NOT crush, chew, or divide extended-release tablets.",
      "You may see an empty tablet shell in your bowel movement (with Procardia XL); the active medicine has already been completely absorbed.",
      "Avoid grapefruit and grapefruit juice while taking nifedipine.",
      "Report any sudden worsening of chest pain, dizziness, or severe leg swelling."
    ]
  },

  "Verapamil": {
    genericName: "Verapamil",
    brandNames: ["Calan", "Calan SR", "Verelan", "Verelan PM"],
    pharmacologicClass: "Non-Dihydropyridine Calcium Channel Blocker / Phenylalkylamine",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Phenylalkylamine non-dihydropyridine calcium channel blocker that binds to the intracellular pore region of L-type calcium channels in the myocardium and cardiac conduction system; exerts potent negative inotropic, negative chronotropic, and negative dromotropic effects, slowing AV nodal conduction and prolonging effective refractory period; also causes moderate coronary and peripheral vasodilation and potently inhibits P-glycoprotein and CYP3A4.",
    dosingRegimens: [
      "Hypertension (Calan SR / Verelan): Start 180-240 mg PO once daily in the morning with food; titrate to 240-480 mg/day (doses >240 mg divided twice daily).",
      "Verelan PM (bedtime dosing): Start 100-200 mg PO at bedtime, titrate to 200-400 mg once daily at bedtime.",
      "Angina: 80-120 mg PO three times daily (immediate-release) or 180-480 mg extended-release daily.",
      "Supraventricular tachycardia (PSVT) conversion: 5-10 mg IV over 2 minutes; repeat with 10 mg after 15-30 minutes if needed."
    ],
    sideEffects: {
      common: ["Constipation (very common, due to blockade of colonic smooth muscle calcium channels, >10%)", "Dizziness", "Headache", "Hypotension", "Edema", "Nausea", "Fatigue", "Bradycardia"],
      severe: ["Severe bradycardia, complete AV heart block, and asystole", "Congestive heart failure exacerbation / pulmonary edema (potent negative inotrope)", "Cardiovascular collapse when administered with IV beta-blockers", "Hepatotoxicity / elevated transaminases", "Gingival hyperplasia"]
    },
    contraindications: [
      "Severe left ventricular dysfunction / heart failure with reduced ejection fraction (HFrEF)",
      "Severe hypotension (systolic BP < 90 mmHg) or cardiogenic shock",
      "Second- or third-degree atrioventricular (AV) block (without functioning artificial pacemaker)",
      "Sick sinus syndrome (without pacemaker)",
      "Atrial flutter or atrial fibrillation with an accessory bypass tract (Wolff-Parkinson-White or LGL syndrome; causes life-threatening ventricular fibrillation)"
    ],
    drugInteractions: {
      major: [
        "Beta-adrenergic blockers (atenolol, metoprolol; extreme synergistic risk of profound bradycardia, complete AV block, and severe heart failure; avoid combination, especially IV)",
        "Digoxin (verapamil inhibits renal and biliary P-glycoprotein efflux, increasing digoxin levels by 50-75%; reduce digoxin dose by 50%)",
        "Simvastatin / Lovastatin (CYP3A4 inhibition increases statin levels; cap simvastatin at 10 mg daily)"
      ],
      common: [
        "Grapefruit juice (increases verapamil bioavailability by ~30%)",
        "Cyclosporine, Dabigatran (P-gp inhibition raises drug exposure)"
      ]
    },
    monitoringParameters: [
      "Heart rate and rhythm (regular pulse checks; monitor for bradycardia <50 bpm)",
      "ECG (PR interval prolongation and AV conduction blocks)",
      "Blood pressure",
      "Liver function tests and bowel habits (manage constipation proactively)"
    ],
    dosageForms: [
      "Immediate-Release Tablet (Calan): 40 mg, 80 mg, 120 mg",
      "Sustained-Release Tablet (Calan SR): 120 mg, 180 mg, 240 mg",
      "Extended-Release Pellet Capsule (Verelan): 120 mg, 180 mg, 240 mg, 360 mg",
      "Extended-Release Bedtime Capsule (Verelan PM): 100 mg, 200 mg, 300 mg",
      "Intravenous Solution: 2.5 mg/mL (2 mL, 4 mL vials)"
    ],
    administrationAndCounseling: [
      "Take sustained-release tablets (Calan SR) with food; take Verelan PM once daily at bedtime.",
      "Verelan capsules may be opened and sprinkled onto a spoonful of cool applesauce (swallow immediately without chewing).",
      "Constipation is very common; drink plenty of water, increase dietary fiber, and use a stool softener if needed.",
      "Avoid grapefruit juice while taking verapamil.",
      "Check your pulse rate regularly; call your doctor if your heart rate drops below 50 beats per minute or if you feel dizzy or faint."
    ]
  },

  // ==========================================
  // Beta-Blockers (BBW: Abrupt cessation)
  // ==========================================
  "Atenolol": {
    genericName: "Atenolol",
    brandNames: ["Tenormin"],
    pharmacologicClass: "Cardioselective Beta-1 Adrenergic Receptor Blocker / Hydrophilic",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Hydrophilic, second-generation cardioselective beta-1 adrenergic antagonist lacking intrinsic sympathomimetic activity (ISA) and membrane-stabilizing properties; competitively blocks beta-1 receptors in the myocardium, reducing resting and exercise heart rate, cardiac output, systolic and diastolic blood pressure, and myocardial oxygen demand; hydrophilic nature minimizes blood-brain barrier penetration (low CNS side effects) and results in 50% unchanged renal excretion.",
    dosingRegimens: [
      "Hypertension: Start 25-50 mg PO once daily; titrate to 50-100 mg PO once daily (doses >100 mg provide no extra benefit and lose beta-1 selectivity).",
      "Angina pectoris: 50-100 mg PO once daily (or divided twice daily; max 200 mg/day).",
      "Renal impairment: CrCl 15-35 mL/min: Max 50 mg daily; CrCl < 15 mL/min: Max 25 mg daily."
    ],
    sideEffects: {
      common: ["Bradycardia", "Cold extremities (Raynaud's phenomenon)", "Fatigue", "Dizziness", "Depression", "Hypotension", "Dyspnea"],
      severe: ["Exacerbation of ischemic heart disease upon abrupt withdrawal (angina, MI, arrhythmias)", "Profound bradycardia and AV heart block", "Acute bronchospasm (at high doses losing beta-1 selectivity)", "Masking of acute hypoglycemia signs (except diaphoresis) in diabetes", "Severe heart failure decompensation"]
    },
    contraindications: [
      "Sinus bradycardia (heart rate < 45-50 bpm)",
      "Second- or third-degree heart block (without pacemaker)",
      "Cardiogenic shock or overt cardiac failure",
      "Severe peripheral arterial circulatory disorders",
      "Known hypersensitivity to atenolol"
    ],
    blackBoxWarning: BETA_BLOCKER_BBW,
    drugInteractions: {
      major: [
        "Non-dihydropyridine calcium channel blockers (verapamil, diltiazem; additive negative chronotropic and inotropic effects, risking severe bradycardia and AV block)",
        "Clonidine (rebound severe hypertensive crisis upon abrupt clonidine cessation is potentiated by beta-blockers; withdraw beta-blocker several days before clonidine)",
        "Digoxin (additive AV nodal conduction slowing and bradycardia)"
      ],
      common: [
        "NSAIDs (blunt antihypertensive response by inhibiting renal prostaglandins)",
        "Insulin / Sulfonylureas (masks tachycardia of hypoglycemia)"
      ]
    },
    monitoringParameters: [
      "Heart rate and rhythm (monitor for resting bradycardia < 50 bpm)",
      "Blood pressure",
      "Renal function (BUN, serum creatinine; mandatory dose adjustments in renal impairment)",
      "Blood glucose in diabetic patients"
    ],
    dosageForms: [
      "Oral Tablet: 25 mg, 50 mg, 100 mg"
    ],
    administrationAndCounseling: [
      "Take once daily with or without food at the same time every day.",
      "CRITICAL: NEVER stop taking atenolol abruptly; sudden discontinuation can cause severe chest pain, heart attack, or dangerous heart rhythm disturbances.",
      "Check your pulse rate regularly; contact your physician if your pulse drops below 50 beats per minute.",
      "May cause your hands and feet to feel cold; dress warmly in cold weather.",
      "Diabetic patients: Atenolol can mask warning signs of low blood sugar (such as rapid heartbeat and tremors), though sweating will not be masked."
    ]
  },

  "Metoprolol Tartrate / Succinate": {
    genericName: "Metoprolol Tartrate / Succinate",
    brandNames: ["Lopressor", "Toprol-XL", "Kapspargo Sprinkle"],
    pharmacologicClass: "Cardioselective Beta-1 Adrenergic Receptor Blocker",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Lipophilic cardioselective beta-1 adrenergic antagonist; metoprolol tartrate is an immediate-release salt with rapid absorption and short half-life (3-7 hours); metoprolol succinate is a sustained-release formulation of microencapsulated beads providing flat 24-hour plasma concentrations; reduces heart rate, myocardial contractility, blood pressure, and renin release; succinate formulation significantly reduces all-cause mortality and hospitalizations in HFrEF (MERIT-HF trial); metabolized heavily by CYP2D6.",
    dosingRegimens: [
      "Hypertension (Toprol-XL succinate): Start 25-100 mg PO once daily; titrate at weekly intervals up to 400 mg once daily.",
      "Heart failure (Toprol-XL succinate, NYHA Class II-IV, MERIT-HF): Start 12.5-25 mg PO once daily; double dose every 2 weeks as tolerated to target maintenance dose of 200 mg PO once daily.",
      "Angina pectoris: Toprol-XL 100 mg once daily (max 400 mg/day) or Lopressor tartrate 50-100 mg PO twice daily.",
      "Post-myocardial infarction (Lopressor tartrate): 50-100 mg PO twice daily for at least 1-3 years."
    ],
    sideEffects: {
      common: ["Bradycardia", "Dizziness", "Fatigue", "Depression", "Shortness of breath", "Diarrhea", "Cold extremities", "Hypotension"],
      severe: ["Exacerbation of ischemic heart disease upon abrupt withdrawal (unstable angina, ventricular arrhythmias, fatal MI)", "Severe bradycardia and complete heart block", "Acute heart failure decompensation", "Severe bronchospasm", "Masking of hypoglycemia in diabetes"]
    },
    contraindications: [
      "Severe sinus bradycardia",
      "Second- or third-degree AV block (without pacemaker)",
      "Cardiogenic shock or decompensated heart failure requiring IV inotropic therapy",
      "Sick sinus syndrome",
      "Hypersensitivity to metoprolol or other beta-blockers"
    ],
    blackBoxWarning: BETA_BLOCKER_BBW,
    drugInteractions: {
      major: [
        "Potent CYP2D6 inhibitors (paroxetine, fluoxetine, bupropion; increase metoprolol plasma concentrations up to 4- to 8-fold, precipitating severe bradycardia and cardiogenic shock)",
        "Verapamil and Diltiazem (severe additive bradycardia, AV block, and myocardial depression)",
        "Digoxin (additive slowing of AV nodal conduction)"
      ],
      common: [
        "Clonidine (potentiation of rebound hypertension upon discontinuation)",
        "Sympathomimetics (mutual antagonism of bronchodilatory effects with albuterol)"
      ]
    },
    monitoringParameters: [
      "Heart rate and rhythm (regular pulse assessment; hold or titrate down if heart rate < 50 bpm with symptoms)",
      "Blood pressure",
      "Signs and symptoms of worsening heart failure (dyspnea, orthopnea, peripheral edema, weight gain)",
      "Blood glucose in diabetic patients"
    ],
    dosageForms: [
      "Extended-Release Tablet (as succinate, Toprol-XL): 25 mg, 50 mg, 100 mg, 200 mg (scored tablets)",
      "Immediate-Release Tablet (as tartrate, Lopressor): 25 mg, 37.5 mg, 50 mg, 75 mg, 100 mg",
      "Extended-Release Sprinkle Capsule (Kapspargo): 25 mg, 50 mg, 100 mg, 200 mg",
      "Intravenous Injection (tartrate): 1 mg/mL (5 mL vials)"
    ],
    administrationAndCounseling: [
      "Take with or immediately following a meal (food significantly enhances metoprolol bioavailability).",
      "Toprol-XL tablets are scored and may be divided in half; swallow whole or divided halves without chewing or crushing.",
      "CRITICAL: Do NOT stop taking metoprolol suddenly; abrupt cessation can trigger a heart attack, severe chest pain, or dangerous heart rhythms.",
      "Take Lopressor (tartrate) twice daily with meals; take Toprol-XL (succinate) once daily in the morning with breakfast.",
      "Check your pulse daily and report to your doctor if it drops below 50 beats per minute or if you experience dizziness or shortness of breath."
    ]
  },

  "Nebivolol": {
    genericName: "Nebivolol",
    brandNames: ["Bystolic"],
    pharmacologicClass: "Third-Generation Cardioselective Beta-1 Blocker / Nitric Oxide Vasodilator",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Racemic mixture consisting of d-nebivolol (the most highly selective beta-1 adrenergic receptor antagonist known, >30-fold more selective than atenolol) and l-nebivolol, which stimulates endothelial beta-3 adrenergic receptors, activating endothelial nitric oxide synthase (eNOS) and increasing nitric oxide (NO) release; produces peripheral vasodilation, reduces systemic vascular resistance, improves endothelial function, and has lower rates of fatigue and erectile dysfunction.",
    dosingRegimens: [
      "Hypertension: Start 5 mg PO once daily with or without food (start 2.5 mg daily in severe renal impairment eGFR < 30 mL/min or moderate hepatic impairment); titrate at 2-week intervals up to 20-40 mg PO once daily (max 40 mg/day)."
    ],
    sideEffects: {
      common: ["Headache", "Fatigue", "Dizziness", "Diarrhea", "Nausea", "Bradycardia", "Peripheral edema", "Insomnia"],
      severe: ["Exacerbation of ischemic heart disease upon abrupt withdrawal", "Severe bradycardia and AV heart block", "Acute heart failure decompensation", "Bronchospasm at high doses", "Severe hypoglycemia masking"]
    },
    contraindications: [
      "Severe bradycardia",
      "Heart block greater than first degree (without pacemaker)",
      "Cardiogenic shock or decompensated cardiac failure",
      "Severe hepatic impairment (Child-Pugh > B)",
      "Sick sinus syndrome"
    ],
    drugInteractions: {
      major: [
        "Potent CYP2D6 inhibitors (fluoxetine, paroxetine, quinidine; significantly elevate d-nebivolol levels, reducing beta-1 selectivity and increasing bradycardia risk)",
        "Non-dihydropyridine CCBs (verapamil, diltiazem; additive conduction slowing)",
        "Digoxin (AV conduction delay)"
      ],
      common: [
        "Clonidine (rebound hypertension upon withdrawal)",
        "Anesthetic agents (additive myocardial depression)"
      ]
    },
    monitoringParameters: [
      "Heart rate and blood pressure",
      "Signs of bradycardia or heart block",
      "Renal and hepatic function"
    ],
    dosageForms: [
      "Oral Tablet: 2.5 mg, 5 mg, 10 mg, 20 mg"
    ],
    administrationAndCounseling: [
      "Take once daily with or without food at the same time each day.",
      "Do NOT stop taking nebivolol abruptly; taper gradually under medical direction.",
      "Nebivolol dilates blood vessels by releasing nitric oxide and generally causes less fatigue and cold extremities than older beta-blockers.",
      "Check your pulse and report if it drops below 50 beats per minute.",
      "Report any shortness of breath or swelling in your feet."
    ]
  },

  "Bisoprolol": {
    genericName: "Bisoprolol",
    brandNames: ["Zebeta", "Ziac"],
    pharmacologicClass: "Cardioselective Beta-1 Adrenergic Receptor Blocker",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Synthetic, highly selective beta-1 adrenergic antagonist lacking intrinsic sympathomimetic or membrane-stabilizing activity; balanced clearance (50% hepatic metabolism, 50% unchanged renal excretion) and long elimination half-life (9-12 hours) provides smooth 24-hour hemodynamic control; reduces heart rate, cardiac output, and renin secretion.",
    dosingRegimens: [
      "Hypertension: Start 2.5-5 mg PO once daily; titrate in increments of 2.5-5 mg up to 10-20 mg PO once daily.",
      "Heart failure (CIBIS-II regimen, off-label in US): Start 1.25 mg PO once daily, titrating slowly every 2-4 weeks to target 10 mg once daily."
    ],
    sideEffects: {
      common: ["Fatigue", "Dizziness", "Bradycardia", "Cold extremities", "Headache", "Diarrhea", "Upper respiratory infection"],
      severe: ["Exacerbation of ischemic heart disease upon sudden cessation", "Heart failure decompensation", "Severe bradycardia and AV nodal block", "Bronchospasm in reactive airway disease"]
    },
    contraindications: [
      "Cardiogenic shock or overt heart failure",
      "Sinus bradycardia and second- or third-degree AV block",
      "Hypersensitivity to bisoprolol fumarate"
    ],
    drugInteractions: {
      major: [
        "Verapamil, Diltiazem (profound bradycardia and AV conduction depression)",
        "Digoxin (additive AV nodal delay)"
      ],
      common: [
        "Clonidine (rebound hypertension on withdrawal)",
        "NSAIDs (reduced antihypertensive effect)"
      ]
    },
    monitoringParameters: [
      "Heart rate and blood pressure",
      "Renal and hepatic function (titrate carefully if CrCl < 40 mL/min)",
      "Signs of worsening heart failure"
    ],
    dosageForms: [
      "Oral Tablet: 5 mg, 10 mg"
    ],
    administrationAndCounseling: [
      "Take once daily in the morning, with or without meals.",
      "Do not discontinue abruptly to avoid dangerous rebounds in blood pressure and chest pain.",
      "Check your pulse regularly and notify your doctor if it falls below 50 beats per minute.",
      "Report any sudden weight gain or swelling in your ankles."
    ]
  },

  "Propranolol": {
    genericName: "Propranolol",
    brandNames: ["Inderal", "Inderal LA", "InnoPran XL", "Hemangeol"],
    pharmacologicClass: "Non-Selective Beta-1 and Beta-2 Adrenergic Receptor Blocker",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Prototypical non-selective competitive antagonist at both beta-1 and beta-2 adrenergic receptors lacking ISA; highly lipophilic, rapidly penetrating the blood-brain barrier and central nervous system; inhibits cardiac beta-1 receptors (lowering heart rate, contractility, and BP), blocks peripheral vascular and bronchial beta-2 receptors, reduces somatic tremor, and centrally dampens sympathetic overdrive; also weakly inhibits peripheral T4 to T3 conversion.",
    dosingRegimens: [
      "Hypertension (Immediate-Release Inderal): Start 40 mg PO twice daily; titrate to 120-240 mg/day divided in 2-3 doses (or Inderal LA 80-160 mg PO once daily).",
      "Migraine headache prophylaxis: Start 80 mg/day PO in divided doses (or Inderal LA 80 mg once daily); titrate to 160-240 mg/day.",
      "Essential tremor: 40 mg PO twice daily; titrate up to 120-320 mg/day.",
      "Performance anxiety / Stage fright (off-label): 10-40 mg PO single dose taken 30-60 minutes before performance.",
      "Proliferating infantile hemangioma (Hemangeol): 1-3 mg/kg/day PO divided twice daily."
    ],
    sideEffects: {
      common: ["Bradycardia", "Fatigue", "Dizziness", "Cold extremities / Raynaud's phenomenon", "Vivid dreams / nightmares", "Sleep disturbances", "Depression", "Nausea", "Weight gain"],
      severe: ["Severe bronchospasm and status asthmaticus (life-threatening in asthma/COPD due to beta-2 blockade)", "Severe ischemic rebound upon abrupt cessation (MI, ventricular arrhythmias)", "Profound hypoglycemic coma without warning tachycardia in diabetes", "Severe bradycardia and complete AV block", "Exacerbation of peripheral vascular disease"]
    },
    contraindications: [
      "Bronchial asthma or history of severe bronchospasm / COPD",
      "Sinus bradycardia and second- or third-degree AV block",
      "Cardiogenic shock",
      "Severe active peripheral arterial disease",
      "Hypersensitivity to propranolol hydrochloride"
    ],
    blackBoxWarning: "Cardiac ischemia after abrupt discontinuation: Hypersensitivity to catecholamines has been observed following discontinuation of propranolol. Exacerbation of angina and, in some cases, myocardial infarction have occurred after abrupt discontinuation of such therapy. When discontinuing chronically administered propranolol, particularly in patients with ischemic heart disease, the dosage should be gradually reduced over a period of 1 to 2 weeks.",
    drugInteractions: {
      major: [
        "Epinephrine (blocks vasodilatory beta-2 receptors, leaving alpha-1 vasoconstriction unopposed, triggering severe hypertensive crisis and reflex bradycardia)",
        "Verapamil, Diltiazem (severe bradycardia and cardiac collapse)",
        "CYP1A2 and CYP2D6 inhibitors (cimetidine, fluvoxamine; dramatically increase propranolol exposure)"
      ],
      common: [
        "Insulin / Hypoglycemics (potentiates hypoglycemia and blocks tachycardia and tremor)",
        "NSAIDs (diminish blood pressure lowering effect)"
      ]
    },
    monitoringParameters: [
      "Heart rate and rhythm (resting pulse)",
      "Blood pressure",
      "Respiratory status (listen for wheezing or signs of bronchospasm)",
      "Blood glucose in diabetic patients"
    ],
    dosageForms: [
      "Immediate-Release Tablet: 10 mg, 20 mg, 40 mg, 60 mg, 80 mg",
      "Extended-Release Capsule (Inderal LA): 60 mg, 80 mg, 120 mg, 160 mg",
      "Extended-Release Capsule (InnoPran XL): 80 mg, 120 mg",
      "Oral Solution: 20 mg/5 mL, 40 mg/5 mL",
      "Oral Solution (Hemangeol): 4.28 mg/mL"
    ],
    administrationAndCounseling: [
      "Take immediate-release tablets consistently with or without food at the same times each day; take Inderal LA in the morning and InnoPran XL at bedtime.",
      "Swallow extended-release capsules whole; do not crush or chew.",
      "CRITICAL: Do NOT stop taking this medicine abruptly; sudden withdrawal can cause a heart attack or dangerous heart rhythms.",
      "DO NOT take this medicine if you have asthma or severe wheezing.",
      "Diabetic patients: This medicine hides warning signs of low blood sugar such as racing pulse and shaking."
    ]
  },

  "Carvedilol": {
    genericName: "Carvedilol",
    brandNames: ["Coreg", "Coreg CR"],
    pharmacologicClass: "Non-Selective Beta-Blocker and Alpha-1 Adrenergic Blocker / Antioxidant",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Third-generation vasodilating beta-blocker consisting of an enantiomeric mixture; S(-)-enantiomer provides potent non-selective beta-1 and beta-2 blockade; R(+)- and S(-)-enantiomers equally provide selective competitive alpha-1 adrenergic receptor blockade (beta-to-alpha blocking ratio approx 10:1); reduces systemic vascular resistance via alpha-1 vasodilation while blunting reflex tachycardia via beta-blockade; also possesses carbazole-mediated potent antioxidant and antiproliferative properties; proven to reduce mortality in HFrEF (COPERNICUS and CAPRICORN trials).",
    dosingRegimens: [
      "Heart failure (HFrEF, NYHA Class II-IV, Coreg immediate-release): Start 3.125 mg PO twice daily with food for 2 weeks; if tolerated, double dose every 2 weeks to 6.25 mg, 12.5 mg, and target maintenance 25 mg PO twice daily (max 50 mg PO twice daily in patients >85 kg).",
      "Extended-Release (Coreg CR): Start 10 mg PO once daily in the morning with food; double every 2 weeks to 20 mg, 40 mg, up to target 80 mg once daily.",
      "Hypertension: Start 6.25 mg PO twice daily (or Coreg CR 20 mg once daily); titrate to 12.5-25 mg twice daily.",
      "Left ventricular dysfunction post-MI: Start 6.25 mg PO twice daily, titrate to 25 mg twice daily."
    ],
    sideEffects: {
      common: ["Dizziness / lightheadedness (alpha-1 vasodilation)", "Fatigue", "Hypotension", "Bradycardia", "Weight gain and fluid retention (transient during initiation)", "Diarrhea", "Hyperglycemia", "Dry eyes"],
      severe: ["Severe orthostatic hypotension and syncope", "Severe bradycardia and AV block", "Acute worsening of heart failure upon initiation", "Severe bronchospasm in reactive airways", "Hepatotoxicity (rare)", "Severe cutaneous adverse reactions (SJS/TEN)"]
    },
    contraindications: [
      "Bronchial asthma or related bronchospastic conditions",
      "Second- or third-degree AV block (without pacemaker)",
      "Sick sinus syndrome or severe bradycardia (< 50 bpm)",
      "Cardiogenic shock or severe decompensated heart failure requiring IV inotropic support",
      "Severe hepatic impairment"
    ],
    drugInteractions: {
      major: [
        "Potent CYP2D6 inhibitors (fluoxetine, paroxetine, quinidine; elevate carvedilol levels, causing severe hypotension and bradycardia)",
        "Verapamil, Diltiazem (severe conduction blocks and heart failure)",
        "Digoxin (carvedilol increases digoxin AUC by ~15-20%)"
      ],
      common: [
        "Clonidine (enhanced rebound hypertension)",
        "Insulin / Oral antidiabetic agents (masks hypoglycemia)"
      ]
    },
    monitoringParameters: [
      "Blood pressure (standing and supine to detect orthostatic hypotension)",
      "Heart rate (pulse rate prior to each dose)",
      "Fluid retention: check daily weight and assess for pedal edema or increasing dyspnea during dose titration",
      "Liver enzymes if symptoms of liver dysfunction appear"
    ],
    dosageForms: [
      "Immediate-Release Tablet (Coreg): 3.125 mg, 6.25 mg, 12.5 mg, 25 mg",
      "Extended-Release Capsule (Coreg CR): 10 mg, 20 mg, 40 mg, 80 mg"
    ],
    administrationAndCounseling: [
      "ALWAYS take with food to slow absorption rate and reduce the risk of dizziness, low blood pressure, and fainting.",
      "Swallow Coreg CR capsules whole; do not crush or chew. Coreg CR capsules may be opened and sprinkled onto a spoonful of cool applesauce (swallow immediately).",
      "Do not stop taking this medication abruptly; sudden withdrawal can cause dangerous heart complications.",
      "Get up slowly from sitting or lying down to prevent dizzy spells.",
      "Weigh yourself daily and report any rapid weight gain (more than 3-5 pounds in a week) or shortness of breath to your doctor."
    ]
  },

  // ==========================================
  // Alpha-1 Blockers
  // ==========================================
  "Doxazosin": {
    genericName: "Doxazosin",
    brandNames: ["Cardura", "Cardura XL"],
    pharmacologicClass: "Selective Alpha-1 Adrenergic Receptor Blocker / Quinazoline Derivative",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Selective competitive antagonist of postsynaptic alpha-1 adrenergic receptors (alpha-1A, alpha-1B, and alpha-1D subtypes) in peripheral vascular smooth muscle and the prostatic stroma/bladder neck; causes peripheral arterial and venous vasodilation, decreasing systemic vascular resistance and lowering blood pressure; relaxes smooth muscle in the prostate and bladder neck, improving urinary flow in benign prostatic hyperplasia (BPH).",
    dosingRegimens: [
      "Hypertension (Immediate-Release Cardura): Start 1 mg PO once daily at bedtime; titrate by doubling dose at 1-2 week intervals to 2 mg, 4 mg, 8 mg, up to maximum 16 mg PO once daily.",
      "Benign Prostatic Hyperplasia (BPH): Start 1 mg PO once daily at bedtime; titrate to 2 mg, 4 mg, and max 8 mg PO once daily.",
      "Cardura XL (extended-release for BPH): Start 4 mg PO once daily with breakfast; titrate to 8 mg once daily."
    ],
    sideEffects: {
      common: ["Dizziness / vertigo", "Headache", "Fatigue / somnolence", "Postural hypotension", "Peripheral edema", "Nasal congestion", "Asthenia"],
      severe: ["First-dose syncope (profound orthostatic hypotension and collapse within 2-6 hours after initial dose or dose increase)", "Intraoperative Floppy Iris Syndrome (IFIS during cataract surgery)", "Priapism (prolonged painful erection requiring surgical intervention)", "Angina exacerbation"]
    },
    contraindications: [
      "Hypersensitivity to doxazosin, prazosin, or terazosin"
    ],
    drugInteractions: {
      major: [
        "Phosphodiesterase-5 (PDE-5) inhibitors (sildenafil, tadalafil, vardenafil; synergistic vasodilation causes profound, symptomatic hypotension; patient must be stable on alpha-blocker before initiating lowest PDE-5 dose)",
        "Other antihypertensives (additive orthostatic hypotension)"
      ],
      common: [
        "Strong CYP3A4 inhibitors (clarithromycin, ketoconazole; increase doxazosin plasma exposure)"
      ]
    },
    monitoringParameters: [
      "Blood pressure (supine and standing 2-6 hours post-dose to evaluate orthostasis)",
      "Urinary flow rate, post-void residual, and BPH symptom scores (IPSS)",
      "Ophthalmic evaluation prior to cataract surgery (notify ophthalmologist regarding alpha-blocker exposure)"
    ],
    dosageForms: [
      "Oral Tablet (Cardura): 1 mg, 2 mg, 4 mg, 8 mg",
      "Extended-Release Tablet (Cardura XL): 4 mg, 8 mg"
    ],
    administrationAndCounseling: [
      "Take your very first dose (and whenever your dose is increased) at BEDTIME to minimize the risk of dizziness, fainting, and falls.",
      "Take Cardura XL once daily with breakfast; swallow whole and do not chew, crush, or divide.",
      "Get out of bed or stand up very slowly; sit on the edge of the bed for a minute before standing.",
      "If you plan to have cataract surgery, tell your eye surgeon that you are taking or have ever taken this medicine (risk of floppy iris syndrome).",
      "Do not take erectile dysfunction medicines (Viagra, Cialis) without consulting your doctor."
    ]
  },

  "Terazosin": {
    genericName: "Terazosin",
    brandNames: ["Hytrin"],
    pharmacologicClass: "Selective Alpha-1 Adrenergic Receptor Blocker / Quinazoline Derivative",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Quinazoline-derived competitive antagonist of postsynaptic alpha-1 adrenergic receptors; dilates both resistance arterioles and capacitance veins, reducing total peripheral resistance and venous return; relaxes smooth muscle in the bladder neck and prostate capsule, reducing urethral resistance and relieving urinary obstruction in BPH.",
    dosingRegimens: [
      "Hypertension: Start 1 mg PO once daily at bedtime (to avoid first-dose syncope); titrate slowly to 2 mg, 5 mg, up to 10-20 mg PO once daily (max 20 mg/day).",
      "Benign Prostatic Hyperplasia (BPH): Start 1 mg PO once daily at bedtime; titrate in steps to 2 mg, 5 mg, and target 10 mg PO once daily at bedtime."
    ],
    sideEffects: {
      common: ["Dizziness", "Headache", "Somnolence", "Nasal congestion", "Peripheral edema", "Weakness / asthenia", "Palpitations", "Nausea"],
      severe: ["First-dose postural syncope and collapse", "Intraoperative Floppy Iris Syndrome (IFIS)", "Priapism", "Severe orthostatic hypotension"]
    },
    contraindications: [
      "Hypersensitivity to terazosin or other quinazolines"
    ],
    drugInteractions: {
      major: [
        "PDE-5 inhibitors (sildenafil, tadalafil; additive severe hypotension)",
        "Other antihypertensives (enhanced hypotensive response)"
      ],
      common: [
        "NSAIDs (may reduce antihypertensive efficacy by fluid retention)"
      ]
    },
    monitoringParameters: [
      "Blood pressure (orthostatic vitals)",
      "BPH urinary symptom scores and urinary flow rates",
      "Pre-operative cataract surgery screening"
    ],
    dosageForms: [
      "Oral Capsule: 1 mg, 2 mg, 5 mg, 10 mg"
    ],
    administrationAndCounseling: [
      "Take once daily at bedtime to reduce the risk of severe dizzy spells and fainting.",
      "Rise slowly from chairs or bed.",
      "Inform your eye surgeon about this medication before any cataract procedure.",
      "Consult your doctor before taking erectile dysfunction drugs."
    ]
  },

  // ==========================================
  // Central Alpha-2 Agonists & Vasodilators
  // ==========================================
  "Clonidine": {
    genericName: "Clonidine",
    brandNames: ["Catapres", "Catapres-TTS", "Kapvay", "Duraclon"],
    pharmacologicClass: "Central Alpha-2 Adrenergic Agonist / Imidazoline Receptor Ligand",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Stimulates presynaptic alpha-2 adrenergic auto-receptors and imidazoline I1 receptors in the nucleus tractus solitarii of the medulla oblongata, decreasing central sympathetic outflow; reduces peripheral vascular resistance, decreases renal vascular resistance, lowers heart rate, and blunts blood pressure; also approved for ADHD (Kapvay) via prefrontal cortical alpha-2A receptor stimulation.",
    dosingRegimens: [
      "Hypertension (Immediate-Release Catapres): Start 0.1 mg PO twice daily (morning and bedtime); titrate by 0.1 mg/day at weekly intervals to target 0.2-0.6 mg/day divided twice daily (max 2.4 mg/day).",
      "Transdermal Patch (Catapres-TTS): Apply 1 patch (TTS-1 = 0.1 mg/day, TTS-2 = 0.2 mg/day, TTS-3 = 0.3 mg/day) to hairless upper chest or outer arm once every 7 days.",
      "ADHD (Kapvay extended-release): Start 0.1 mg PO once daily at bedtime, titrate by 0.1 mg/day weekly up to 0.4 mg/day divided twice daily.",
      "Epidural (Duraclon): Continuous epidural infusion for intractable cancer pain."
    ],
    sideEffects: {
      common: ["Dry mouth (xerostomia, very common, >40%)", "Sedation / somnolence", "Dizziness", "Constipation", "Fatigue", "Headache", "Contact dermatitis (with transdermal patch, up to 20%)"],
      severe: ["Rebound severe hypertensive crisis upon abrupt withdrawal (life-threatening surge in catecholamines causing hypertensive encephalopathy, intracranial hemorrhage, or death)", "Severe bradycardia and AV block", "Syncope", "Depression and hallucinations"]
    },
    contraindications: [
      "Hypersensitivity to clonidine or any patch components",
      "Epidural administration contraindicated in presence of injection site infection or severe coagulation defects"
    ],
    drugInteractions: {
      major: [
        "Beta-blockers (abrupt cessation of clonidine while on a beta-blocker leaves massive rebound alpha-vasoconstriction unopposed, precipitating catastrophic hypertensive encephalopathy; always taper beta-blocker several days before tapering clonidine)",
        "CNS depressants and alcohol (profound additive sedation and cognitive impairment)",
        "Non-dihydropyridine CCBs, Digoxin (additive bradycardia and AV block)"
      ],
      common: [
        "Tricyclic antidepressants (inhibit central alpha-2 actions, blunting clonidine antihypertensive effect)"
      ]
    },
    monitoringParameters: [
      "Blood pressure and heart rate (regular monitoring; watch for rebound hypertension)",
      "Sedation level and dry mouth",
      "Skin checks beneath transdermal patches for contact dermatitis"
    ],
    dosageForms: [
      "Oral Tablet (Catapres): 0.1 mg, 0.2 mg, 0.3 mg",
      "Transdermal 7-Day Patch (Catapres-TTS): TTS-1 (0.1 mg/24h), TTS-2 (0.2 mg/24h), TTS-3 (0.3 mg/24h)",
      "Extended-Release Tablet (Kapvay): 0.1 mg",
      "Epidural Solution: 100 mcg/mL, 500 mcg/mL"
    ],
    administrationAndCounseling: [
      "Take oral tablets twice daily (take the larger dose at bedtime to minimize daytime sleepiness).",
      "TRANSDERMAL PATCH: Apply to a clean, hairless area of the upper arm or chest; change patch every 7 days; rotate application sites each week.",
      "CRITICAL SAFETY WARNING: NEVER stop taking clonidine suddenly; missing doses can cause a life-threatening rebound spike in blood pressure, severe tremors, and heart racing.",
      "Sip water or chew sugarless gum to relieve severe dry mouth.",
      "Do not drive or operate machinery until you know how this medicine affects your alertness."
    ]
  },

  "Hydralazine": {
    genericName: "Hydralazine",
    brandNames: ["Apresoline", "BiDil"],
    pharmacologicClass: "Direct Arteriolar Vasodilator",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Direct-acting smooth muscle relaxant that selectively dilates peripheral resistance arterioles with virtually no effect on venous capacitance beds; inhibits inositol triphosphate (IP3)-mediated calcium release from the sarcoplasmic reticulum and opens potassium channels; marked arteriolar dilation triggers potent baroreceptor-mediated reflex sympathetic activation (reflex tachycardia, increased cardiac output, and profound renin-aldosterone fluid retention); requires co-administration with a beta-blocker and diuretic.",
    dosingRegimens: [
      "Hypertension: Start 10 mg PO four times daily for 2-4 days; increase to 25 mg PO four times daily for balance of first week; titrate to 50 mg PO four times daily (max 200-300 mg/day).",
      "Heart failure in Black patients (BiDil regimen, combined with isosorbide dinitrate): 37.5 mg hydralazine / 20 mg isosorbide dinitrate PO three times daily; titrate to 75 mg / 40 mg three times daily.",
      "Hypertensive emergency in pregnancy / eclampsia: 5-10 mg IV/IM every 20-30 minutes PRN."
    ],
    sideEffects: {
      common: ["Headache (very common due to meningeal vasodilation)", "Palpitations / reflex tachycardia", "Nausea", "Vomiting", "Anorexia", "Flushing", "Nasal congestion", "Fluid retention / peripheral edema"],
      severe: ["Drug-induced lupus erythematosus (DILE / lupus-like syndrome: arthralgias, fever, pleuritis, pericarditis, positive ANA and anti-histone antibodies; dose-dependent, frequent with doses >200 mg/day or slow acetylators)", "Angina pectoris and acute myocardial infarction (precipitated by reflex tachycardia and increased myocardial oxygen demand)", "Peripheral neuropathy (pyridoxine/vitamin B6 responsive)", "Severe hemolytic anemia"]
    },
    contraindications: [
      "Coronary artery disease / ischemic heart disease (reflex tachycardia triggers angina/infarction)",
      "Mitral valvular rheumatic heart disease",
      "Hypersensitivity to hydralazine"
    ],
    drugInteractions: {
      major: [
        "Potent vasodilators and nitrates (synergistic hypotension; BiDil combination is therapeutic in heart failure under supervision)",
        "MAO inhibitors (additive hypotension)"
      ],
      common: [
        "Beta-blockers (therapeutically co-administered to block hydralazine-induced reflex tachycardia)",
        "Diuretics (therapeutically co-administered to prevent hydralazine-induced fluid retention)"
      ]
    },
    monitoringParameters: [
      "Blood pressure and pulse rate (monitor for reflex tachycardia)",
      "Complete blood count (CBC) and antinuclear antibody (ANA) titer baseline and if joint pain, fever, or chest pain occurs (evaluate for drug-induced lupus)",
      "Renal function and body weight for fluid retention"
    ],
    dosageForms: [
      "Oral Tablet: 10 mg, 25 mg, 50 mg, 100 mg",
      "Intravenous / IM Solution: 20 mg/mL (1 mL vial)"
    ],
    administrationAndCounseling: [
      "Take three to four times daily with meals at evenly spaced intervals; taking with food enhances absorption.",
      "Almost always prescribed together with a beta-blocker (like metoprolol) to stop your heart from beating too fast, and a water pill to prevent fluid retention.",
      "Contact your doctor immediately if you develop joint pain, fever, chest pain, or a butterfly-shaped facial rash (signs of drug-induced lupus).",
      "Rise slowly from sitting or lying down to prevent dizziness."
    ]
  },

  "Guanfacine": {
    genericName: "Guanfacine",
    brandNames: ["Tenex", "Intuniv"],
    pharmacologicClass: "Selective Central Alpha-2A Adrenergic Receptor Agonist",
    therapeuticClass: "11. Cardiovascular --- Antihypertensive",
    mechanismOfAction: "Centrally acting selective alpha-2A adrenergic receptor agonist with 15- to 20-fold greater selectivity for alpha-2A over alpha-2B and alpha-2C compared to clonidine; stimulates postsynaptic alpha-2A receptors in the prefrontal cortex, enhancing synaptic transmission and strengthening working memory, attention, and impulse control (ADHD); reduces central sympathetic outflow from the brainstem, lowering peripheral vascular resistance, heart rate, and blood pressure with lower sedation and rebound risks than clonidine.",
    dosingRegimens: [
      "Hypertension (Immediate-Release Tenex): Start 1 mg PO once daily at bedtime; may increase after 3-4 weeks to 2 mg PO daily at bedtime (max 3 mg/day).",
      "ADHD (Extended-Release Intuniv): Start 1 mg PO once daily (morning or evening); titrate by 1 mg/week to target 1-4 mg PO once daily (max 4-7 mg/day based on body weight, 0.05-0.12 mg/kg/day)."
    ],
    sideEffects: {
      common: ["Somnolence / sedation", "Fatigue", "Dizziness", "Dry mouth", "Headache", "Constipation", "Abdominal pain", "Hypotension", "Bradycardia"],
      severe: ["Rebound hypertension and tachycardia upon abrupt discontinuation (less intense than clonidine, but clinically significant)", "Syncope and orthostasis", "Severe bradycardia and sinus arrest", "Depression and hallucinations"]
    },
    contraindications: [
      "Hypersensitivity to guanfacine hydrochloride"
    ],
    drugInteractions: {
      major: [
        "CNS depressants and alcohol (synergistic sedation and impairment)",
        "CYP3A4 inducers (rifampin, carbamazepine; cut guanfacine levels by >50%; double Intuniv dose)",
        "CYP3A4 inhibitors (ketoconazole, fluconazole; double guanfacine exposure; halve Intuniv dose)"
      ],
      common: [
        "Beta-blockers, non-dihydropyridine CCBs, Digoxin (additive bradycardia and AV block)"
      ]
    },
    monitoringParameters: [
      "Blood pressure and pulse rate (baseline, during dose titration, and periodically)",
      "Sedation level and daytime somnolence",
      "Height, weight, and ADHD symptom improvement in pediatric patients"
    ],
    dosageForms: [
      "Immediate-Release Tablet (Tenex): 1 mg, 2 mg",
      "Extended-Release Tablet (Intuniv): 1 mg, 2 mg, 3 mg, 4 mg"
    ],
    administrationAndCounseling: [
      "Take once daily (immediate-release at bedtime; extended-release Intuniv at the same time every day).",
      "DO NOT take Intuniv extended-release with high-fat meals because high-fat food significantly increases drug absorption.",
      "Swallow Intuniv tablets whole; do not crush, chew, or break.",
      "Do NOT discontinue this medicine abruptly; taper gradually under medical supervision to avoid rebound spikes in blood pressure and heart rate.",
      "Avoid alcohol and other sedating medications while taking guanfacine."
    ]
  }
};
