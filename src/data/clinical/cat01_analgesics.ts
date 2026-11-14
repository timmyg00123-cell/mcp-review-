import type { TopDrugClinicalMonograph } from './types.js';

export const CAT01_ANALGESICS: Record<string, TopDrugClinicalMonograph> = {
  "Acetaminophen": {
    genericName: "Acetaminophen",
    brandNames: ["Tylenol"],
    pharmacologicClass: "Non-Opioid Analgesic / Antipyretic",
    therapeuticClass: "1. Analgesic",
    mechanismOfAction: "Inhibits central prostaglandin synthesis via peroxidase/COX-3 inhibition and activates descending serotonergic and cannabinoid CB1 pathways through active metabolite AM404; lacks peripheral anti-inflammatory activity.",
    dosingRegimens: [
      "Mild-to-moderate pain or fever: 325-650 mg PO q4-6h PRN (max 3250 mg/day OTC, or 4000 mg/day under medical supervision).",
      "Extended-Release: 1300 mg PO q8h PRN (max 3900 mg/day).",
      "Hepatic impairment or chronic alcohol use: Limit total daily dose to <= 2000 mg/day."
    ],
    sideEffects: {
      common: ["Nausea", "Headache", "Vomiting", "Insomnia", "Constipation", "Pruritus"],
      severe: ["Acute hepatic failure / hepatotoxicity with overdose", "Stevens-Johnson syndrome (SJS)", "Toxic epidermal necrolysis (TEN)", "Acute generalized exanthematous pustulosis (AGEP)"]
    },
    contraindications: [
      "Severe active hepatic impairment or severe acute liver disease",
      "Known hypersensitivity to acetaminophen or any excipients"
    ],
    drugInteractions: {
      major: [
        "Warfarin (chronic high-dose acetaminophen >2 g/day potentiates anticoagulation and increases bleeding risk/INR)",
        "Isoniazid (synergistic risk of severe hepatotoxicity)"
      ],
      common: [
        "Chronic ethanol ingestion (induces CYP2E1, increasing toxic NAPQI metabolite formation)",
        "Cholestyramine (delays and decreases acetaminophen intestinal absorption)"
      ]
    },
    monitoringParameters: [
      "Total daily cumulative acetaminophen intake across all prescription and OTC products (<4 g/day)",
      "Baseline and periodic hepatic enzymes (AST, ALT, total bilirubin) in chronic high-dose therapy",
      "Serum creatinine and BUN"
    ],
    dosageForms: [
      "Oral Tablet: 325 mg, 500 mg (Extra Strength), 650 mg (Arthritis Extended-Release)",
      "Oral Capsule / Gelcap: 325 mg, 500 mg",
      "Oral Liquid / Suspension: 160 mg/5 mL",
      "Rectal Suppository: 120 mg, 325 mg, 650 mg",
      "Intravenous Solution (Ofirmev): 1000 mg/100 mL"
    ],
    administrationAndCounseling: [
      "Do not exceed 4000 mg daily from all sources combined; verify active ingredients on OTC cough, cold, and allergy remedies.",
      "Avoid excessive alcohol consumption (>=3 alcoholic drinks daily) while using this medication due to increased liver injury risk.",
      "Seek emergency medical attention immediately in case of suspected overdose; N-acetylcysteine (NAC) is the specific antidote.",
      "Discontinue medication and contact healthcare provider immediately if skin reddening, rash, or blisters develop."
    ]
  },

  "Aspirin": {
    genericName: "Aspirin",
    brandNames: ["Bayer", "Ecotrin", "Bufferin"],
    pharmacologicClass: "Salicylate / Antipyretic",
    therapeuticClass: "1. Analgesic",
    mechanismOfAction: "Irreversibly acetylates cyclooxygenase-1 (COX-1) at Ser529, permanently blocking platelet synthesis of thromboxane A2 (TXA2) for the entire 7-10 day lifespan of the platelet; at higher doses, inhibits COX-2.",
    dosingRegimens: [
      "Secondary cardiovascular / stroke prevention: 81 mg PO once daily (range 81-325 mg daily).",
      "Acute Coronary Syndrome (ACS): 162-325 mg PO chewed immediately upon presentation.",
      "Analgesic / Antipyretic: 325-650 mg PO q4-6h PRN (max 4000 mg/day)."
    ],
    sideEffects: {
      common: ["Dyspepsia", "Heartburn", "Epigastric discomfort", "Nausea", "Easy bruising", "Prolonged bleeding time"],
      severe: ["Gastrointestinal ulceration and hemorrhage", "Hemorrhagic stroke", "Aspirin-exacerbated respiratory disease (AERD / Samter's triad bronchospasm)", "Reye's syndrome in children", "Salicylism (tinnitus, tachypnea, metabolic acidosis)"]
    },
    contraindications: [
      "Children and adolescents with viral infections (influenza, varicella) due to Reye's syndrome risk",
      "Active gastrointestinal bleeding or peptic ulcer disease",
      "Severe bleeding disorders (hemophilia, severe thrombocytopenia)",
      "Known hypersensitivity to salicylates or NSAID-induced asthma/urticaria"
    ],
    drugInteractions: {
      major: [
        "Anticoagulants (warfarin, apixaban, rivaroxaban; major potentiated systemic bleeding risk)",
        "Ibuprofen (concomitant use binds competitively to COX-1, attenuating aspirin's irreversible cardioprotective antiplatelet effect)"
      ],
      common: [
        "Systemic corticosteroids (additive gastrointestinal mucosal damage and ulceration risk)",
        "Methotrexate (salicylates decrease renal clearance, increasing methotrexate bone marrow toxicity)"
      ]
    },
    monitoringParameters: [
      "Signs and symptoms of occult or overt bleeding (melena, hematochezia, hematemesis, easy bruising)",
      "Complete blood count (hemoglobin and hematocrit)",
      "Serum creatinine and estimated GFR"
    ],
    dosageForms: [
      "Oral Tablet (Enteric-Coated): 81 mg, 325 mg",
      "Oral Tablet (Chewable): 81 mg",
      "Oral Tablet (Immediate-Release): 325 mg, 500 mg",
      "Rectal Suppository: 300 mg, 600 mg"
    ],
    administrationAndCounseling: [
      "Take with food or a full glass of water to minimize stomach irritation.",
      "Swallow enteric-coated tablets whole; do not crush or chew unless directed for acute heart attack symptoms.",
      "If taking ibuprofen for pain, take aspirin at least 30 minutes before or 8 hours after ibuprofen to maintain antiplatelet protection.",
      "Discontinue 7 days prior to elective surgical procedures if directed by your surgeon."
    ]
  },

  "Acetaminophen / Butalbital / Caffeine": {
    genericName: "Acetaminophen / Butalbital / Caffeine",
    brandNames: ["Esgic", "Fioricet"],
    pharmacologicClass: "Barbiturate / Non-Opioid Combination",
    therapeuticClass: "1. Analgesic",
    mechanismOfAction: "Fixed-dose combination where butalbital enhances GABA-A receptor inhibitory neurotransmission; acetaminophen inhibits central prostaglandin synthesis; and caffeine antagonizes adenosine A1/A2A receptors producing cerebral vasoconstriction.",
    dosingRegimens: [
      "Tension headache / muscle contraction headache: 1-2 capsules or tablets PO q4h PRN (maximum 6 doses per 24 hours).",
      "Limit use to <= 2-3 days per week to prevent medication-overuse (rebound) headaches and barbiturate dependence."
    ],
    sideEffects: {
      common: ["Sedation", "Drowsiness", "Dizziness", "Lightheadedness", "Nausea", "Abdominal discomfort", "Nervousness"],
      severe: ["Medication-overuse headache (rebound)", "Physical and psychological dependence", "Severe hepatotoxicity (due to acetaminophen component)", "Respiratory depression with overdose"]
    },
    contraindications: [
      "Porphyria (barbiturates induce ALA synthase)",
      "Severe hepatic impairment or severe renal impairment",
      "Known hypersensitivity to butalbital, other barbiturates, acetaminophen, or caffeine"
    ],
    drugInteractions: {
      major: [
        "Ethanol and other CNS depressants (synergistic profound central nervous system and respiratory depression)",
        "Monoamine oxidase inhibitors (MAOIs; potentiate barbiturate CNS effects)"
      ],
      common: [
        "Oral contraceptives (butalbital induces hepatic CYP3A4, reducing contraceptive efficacy and causing breakthrough bleeding)",
        "Warfarin (barbiturate enzyme induction may decrease anticoagulant response)"
      ]
    },
    monitoringParameters: [
      "Frequency and duration of use (screen for medication overuse headache and dependence)",
      "Total daily acetaminophen dose (<4 g/day from all sources)",
      "Hepatic and renal function tests with prolonged use"
    ],
    dosageForms: [
      "Oral Tablet: 300 mg / 50 mg / 40 mg, 325 mg / 50 mg / 40 mg",
      "Oral Capsule: 300 mg / 50 mg / 40 mg, 325 mg / 50 mg / 40 mg",
      "Oral Solution: 325 mg / 50 mg / 40 mg per 15 mL"
    ],
    administrationAndCounseling: [
      "Take at the earliest onset of headache symptoms; do not use more than 2 to 3 days per week.",
      "Causes significant drowsiness and impairs reaction time; avoid driving or operating machinery.",
      "Do not consume alcohol while taking this medication.",
      "Contains acetaminophen; check labels of other pain relievers and cold medications to avoid dangerous overdose."
    ]
  },

  "Hydrocodone / Acetaminophen": {
    genericName: "Hydrocodone / Acetaminophen",
    brandNames: ["Vicodin", "Norco", "Lortab", "Hycet"],
    pharmacologicClass: "Opioid Combination",
    therapeuticClass: "1. Analgesic",
    mechanismOfAction: "Hydrocodone acts as a full agonist at central mu-opioid receptors, opening K+ channels, closing Ca2+ channels, and dampening ascending nociceptive transmission; acetaminophen synergizes by inhibiting central prostaglandin synthesis.",
    dosingRegimens: [
      "Moderate to severe acute pain: 1 tablet (2.5/325 mg, 5/325 mg, 7.5/325 mg, or 10/325 mg) PO q4-6h PRN (max 6-8 tablets/day or 4000 mg APAP/day).",
      "Initiate at lowest effective dose for the shortest necessary duration (typically <= 3-7 days for acute pain)."
    ],
    sideEffects: {
      common: ["Constipation", "Nausea", "Somnolence", "Dizziness", "Vomiting", "Lightheadedness", "Sedation", "Pruritus"],
      severe: ["Fatal respiratory depression", "Opioid addiction, abuse, and misuse", "Acute liver failure / hepatotoxicity from acetaminophen overdose", "Profound hypotension and syncope", "Neonatal opioid withdrawal syndrome", "Paralytic ileus"]
    },
    contraindications: [
      "Significant respiratory depression in unmonitored settings",
      "Acute or severe bronchial asthma",
      "Known or suspected gastrointestinal obstruction, including paralytic ileus",
      "Hypersensitivity to hydrocodone, acetaminophen, or opioid derivatives"
    ],
    blackBoxWarning: "WARNING: ADDICTION, ABUSE, AND MISUSE; RISK EVALUATION AND MITIGATION STRATEGY (REMS); LIFE-THREATENING RESPIRATORY DEPRESSION; ACCIDENTAL INGESTION; NEONATAL OPIOID WITHDRAWAL SYNDROME; CYTOCHROME P450 3A4 INTERACTION; HEPATOTOXICITY; and RISKS FROM CONCOMITANT USE WITH BENZODIAZEPINES OR OTHER CNS DEPRESSANTS. Hydrocodone exposes patients to risks of opioid addiction, abuse, and misuse, which can lead to overdose and death. Serious, life-threatening, or fatal respiratory depression may occur. Acetaminophen has been associated with cases of acute liver failure, at times resulting in liver transplant and death.",
    drugInteractions: {
      major: [
        "Benzodiazepines and other CNS depressants (additive severe sedation, respiratory depression, coma, and death)",
        "CYP3A4 inhibitors (ketoconazole, erythromycin; increase hydrocodone plasma levels and overdose risk)",
        "MAO inhibitors (hyperpyrexic crisis, severe convulsions)"
      ],
      common: [
        "Anticholinergic agents (additive risk of severe paralytic ileus and acute urinary retention)",
        "Serotonergic drugs (increased risk of serotonin syndrome)"
      ]
    },
    monitoringParameters: [
      "Respiratory status, respiratory rate, and oxygen saturation",
      "Pain relief and functional recovery scores",
      "Bowel motility and constipation (initiate scheduled bowel regimen)",
      "Signs of opioid misuse, abuse, tolerance, or diversion",
      "Cumulative daily acetaminophen intake"
    ],
    dosageForms: [
      "Oral Tablet: 2.5 mg / 325 mg, 5 mg / 325 mg, 7.5 mg / 325 mg, 10 mg / 325 mg",
      "Oral Solution: 7.5 mg hydrocodone / 325 mg acetaminophen per 15 mL"
    ],
    administrationAndCounseling: [
      "Take strictly as prescribed; high potential for psychological and physical dependence.",
      "Causes severe drowsiness; do not drive, operate heavy machinery, or make critical decisions.",
      "Never consume alcohol or take sedatives while on this medication; fatal respiratory depression can occur.",
      "Prevent constipation by drinking plenty of water, eating high-fiber foods, and taking a stool softener or stimulant laxative.",
      "Store securely in a locked location away from children; have naloxone (Narcan) available at home for emergency overdose reversal."
    ]
  },

  "Tramadol": {
    genericName: "Tramadol",
    brandNames: ["ConZip", "Ultram", "Ultram ER"],
    pharmacologicClass: "Centrally Acting Opioid Agonist",
    therapeuticClass: "1. Analgesic",
    mechanismOfAction: "Dual-action centrally acting analgesic: parent drug and its active M1 metabolite (O-desmethyltramadol formed via CYP2D6) act as mu-opioid receptor agonists, while simultaneously inhibiting neuronal reuptake of norepinephrine and serotonin.",
    dosingRegimens: [
      "Moderate to severe pain (Immediate-Release): 25-50 mg PO q4-6h PRN; titrate up to 50-100 mg q4-6h PRN (max 400 mg/day).",
      "Chronic moderate to severe pain (Extended-Release): 100 mg PO once daily; titrate by 100 mg every 5 days (max 300 mg/day).",
      "Renal impairment (eGFR < 30 mL/min): Max 200 mg/day with dosing interval extended to q12h."
    ],
    sideEffects: {
      common: ["Dizziness", "Vertigo", "Nausea", "Constipation", "Headache", "Somnolence", "Vomiting", "Pruritus", "Dry mouth"],
      severe: ["Seizures / lowered seizure threshold", "Serotonin syndrome", "Life-threatening respiratory depression", "Opioid addiction and dependence", "Severe hypoglycemia", "Anaphylactoid reactions"]
    },
    contraindications: [
      "Children younger than 12 years of age",
      "Post-operative management in pediatric patients (<18 years) after tonsillectomy and/or adenoidectomy",
      "Significant respiratory depression or acute severe bronchial asthma",
      "Known or suspected gastrointestinal obstruction, including paralytic ileus",
      "Concurrent use of MAO inhibitors or within 14 days of discontinuation"
    ],
    blackBoxWarning: "WARNING: ADDICTION, ABUSE, AND MISUSE; RISK EVALUATION AND MITIGATION STRATEGY (REMS); LIFE-THREATENING RESPIRATORY DEPRESSION; ACCIDENTAL INGESTION; ULTRA-RAPID METABOLISM OF TRAMADOL AND OTHER RISK FACTORS FOR LIFE-THREATENING RESPIRATORY DEPRESSION IN CHILDREN; NEONATAL OPIOID WITHDRAWAL SYNDROME; INTERACTIONS WITH DRUGS AFFECTING CYTOCHROME P450 ISOENZYMES; and RISKS FROM CONCOMITANT USE WITH BENZODIAZEPINES OR OTHER CNS DEPRESSANTS. Tramadol exposes patients to risks of addiction, abuse, and misuse. Life-threatening respiratory depression and death have occurred in children who received tramadol, especially ultra-rapid CYP2D6 metabolizers.",
    drugInteractions: {
      major: [
        "Serotonergic agents (SSRIs, SNRIs, triptans, linezolid; dramatically elevated risk of life-threatening serotonin syndrome and seizures)",
        "Benzodiazepines and CNS depressants (additive severe sedation, respiratory depression, and coma)",
        "Drugs that lower seizure threshold (bupropion, tricyclic antidepressants, phenothiazines)"
      ],
      common: [
        "CYP2D6 inhibitors (fluoxetine, paroxetine, bupropion; impair conversion to active M1 analgesic metabolite)",
        "CYP3A4 inhibitors / inducers (alter parent tramadol exposure)"
      ]
    },
    monitoringParameters: [
      "Respiratory rate and oxygen saturation",
      "Signs of serotonin syndrome (clonus, hyperreflexia, tremor, agitation, diaphoresis)",
      "Seizure risk, especially in patients with prior seizure history or taking interacting medications",
      "Bowel function and signs of constipation",
      "Blood glucose in diabetic patients (risk of tramadol-induced hypoglycemia)"
    ],
    dosageForms: [
      "Oral Tablet (Immediate-Release): 50 mg, 100 mg",
      "Oral Tablet (Extended-Release): 100 mg, 200 mg, 300 mg",
      "Oral Capsule (Extended-Release): 100 mg, 200 mg, 300 mg"
    ],
    administrationAndCounseling: [
      "Take as directed; do not exceed prescribed daily dose due to significant seizure and respiratory risks.",
      "Swallow extended-release tablets whole; do not chew, crush, split, or dissolve them.",
      "Avoid alcohol and other sedating medications while on tramadol.",
      "Seek emergency medical help if you experience signs of serotonin syndrome: high fever, shaking, sweating, or rapid heart rate.",
      "Do not stop tramadol abruptly after prolonged use to avoid withdrawal symptoms."
    ]
  },

  "Morphine ER": {
    genericName: "Morphine ER",
    brandNames: ["Avinza", "Kadian", "MS Contin"],
    pharmacologicClass: "Opioid Agonist",
    therapeuticClass: "1. Analgesic",
    mechanismOfAction: "Pure mu-opioid receptor agonist in the central nervous system; inhibits ascending nociceptive pathways, hyperpolarizes dorsal horn interneurons via G-protein-coupled inward rectifying K+ channels, and inhibits presynaptic neurotransmitter release.",
    dosingRegimens: [
      "Severe chronic pain in opioid-tolerant patients (MS Contin): 15-30 mg PO q8-12h; titrate based on 24-hour baseline opioid requirement.",
      "Severe chronic pain (Kadian): 20-30 mg PO q12-24h.",
      "Opioid-naive patients: Extended-release morphine is contraindicated in opioid-naive individuals."
    ],
    sideEffects: {
      common: ["Constipation", "Somnolence", "Nausea", "Vomiting", "Dizziness", "Pruritus (histamine release)", "Sweating", "Dry mouth"],
      severe: ["Fatal respiratory depression", "Opioid addiction, abuse, and misuse", "Profound hypotension and bradycardia", "Paralytic ileus", "Neonatal opioid withdrawal syndrome", "Increased intracranial pressure"]
    },
    contraindications: [
      "Significant respiratory depression in unmonitored environments",
      "Acute or severe bronchial asthma",
      "Known or suspected gastrointestinal obstruction, including paralytic ileus",
      "Opioid-non-tolerant patients (for extended-release formulations)",
      "Hypersensitivity to morphine or phenanthrene opioids"
    ],
    blackBoxWarning: "WARNING: ADDICTION, ABUSE, AND MISUSE; RISK EVALUATION AND MITIGATION STRATEGY (REMS); LIFE-THREATENING RESPIRATORY DEPRESSION; ACCIDENTAL INGESTION; NEONATAL OPIOID WITHDRAWAL SYNDROME; and RISKS FROM CONCOMITANT USE WITH BENZODIAZEPINES OR OTHER CNS DEPRESSANTS. Morphine exposes patients to risks of addiction, abuse, and misuse, which can lead to overdose and death. Serious, life-threatening respiratory depression may occur. Concomitant use with benzodiazepines or other CNS depressants may result in profound sedation, respiratory depression, coma, and death.",
    drugInteractions: {
      major: [
        "Benzodiazepines, barbiturates, and CNS depressants (fatal respiratory depression and coma)",
        "Monoamine oxidase inhibitors (MAOIs; risk of severe hypotension or hypertensive crisis; avoid within 14 days)",
        "Alcohol (causes dose-dumping of extended-release morphine pellets, leading to rapid fatal overdose)"
      ],
      common: [
        "Anticholinergics (severe urinary retention and paralytic ileus)",
        "P-glycoprotein inhibitors (may elevate systemic morphine bioavailability)"
      ]
    },
    monitoringParameters: [
      "Respiratory rate, depth, and oxygen saturation",
      "Pain scores and quality of life functional metrics",
      "Sedation scale score",
      "Bowel regimen and frequency of bowel movements",
      "Renal function (active metabolite morphine-6-glucuronide [M6G] accumulates in renal failure, causing prolonged narcosis)"
    ],
    dosageForms: [
      "Oral Extended-Release Tablet (MS Contin): 15 mg, 30 mg, 60 mg, 100 mg, 200 mg",
      "Oral Extended-Release Capsule (Kadian): 10 mg, 20 mg, 30 mg, 40 mg, 50 mg, 60 mg, 80 mg, 100 mg, 200 mg"
    ],
    administrationAndCounseling: [
      "Swallow tablets whole; never chew, break, crush, or dissolve extended-release morphine as this releases a fatal dose immediately.",
      "Kadian capsules may be opened and sprinkled onto applesauce and swallowed without chewing for patients with swallowing difficulties.",
      "Never consume alcohol or alcoholic beverages; alcohol destroys the extended-release coating causing lethal dose dumping.",
      "Take a scheduled bowel regimen (stimulant laxative such as senna plus docusate) daily to prevent severe opioid constipation.",
      "Keep naloxone rescue medication available at home and train household members on its administration."
    ]
  },

  "Oxycodone": {
    genericName: "Oxycodone",
    brandNames: ["Oxycontin", "Roxicodone"],
    pharmacologicClass: "Opioid Agonist",
    therapeuticClass: "1. Analgesic",
    mechanismOfAction: "Semisynthetic pure opioid mu-receptor agonist in the CNS; hyperpolarizes neurons via G-protein-coupled inward rectifying potassium channels and inhibits voltage-gated N-type calcium channels, suppressing substance P and glutamate nociceptive release.",
    dosingRegimens: [
      "Immediate-Release (acute moderate-to-severe pain): 5-15 mg PO q4-6h PRN.",
      "Extended-Release (OxyContin, for chronic severe pain in opioid-tolerant patients): 10-20 mg PO q12h; titrate based on 24-hour baseline opioid requirement.",
      "Opioid-naive patients: Extended-release OxyContin doses >40 mg or daily doses >80 mg are restricted to opioid-tolerant patients."
    ],
    sideEffects: {
      common: ["Constipation", "Somnolence", "Nausea", "Dizziness", "Vomiting", "Headache", "Pruritus", "Dry mouth", "Asthenia"],
      severe: ["Fatal respiratory depression", "Opioid addiction, abuse, and misuse", "Severe hypotension and orthostasis", "Paralytic ileus", "Adrenal insufficiency with prolonged therapy", "Neonatal opioid withdrawal syndrome"]
    },
    contraindications: [
      "Significant respiratory depression in unmonitored settings",
      "Acute or severe bronchial asthma or hypercarbia",
      "Known or suspected gastrointestinal obstruction, including paralytic ileus",
      "Hypersensitivity to oxycodone"
    ],
    blackBoxWarning: "WARNING: ADDICTION, ABUSE, AND MISUSE; RISK EVALUATION AND MITIGATION STRATEGY (REMS); LIFE-THREATENING RESPIRATORY DEPRESSION; ACCIDENTAL INGESTION; NEONATAL OPIOID WITHDRAWAL SYNDROME; CYTOCHROME P450 3A4 INTERACTION; and RISKS FROM CONCOMITANT USE WITH BENZODIAZEPINES OR OTHER CNS DEPRESSANTS. Oxycodone exposes users to risks of addiction, abuse, and misuse. Life-threatening respiratory depression may occur. Concomitant use of oxycodone with CYP3A4 inhibitors can increase plasma concentrations and fatal toxicity.",
    drugInteractions: {
      major: [
        "Benzodiazepines, alcohol, and CNS depressants (additive profound sedation, respiratory depression, coma, and death)",
        "Strong CYP3A4 inhibitors (clarithromycin, ketoconazole, protease inhibitors; increase oxycodone exposure and fatal overdose risk)",
        "MAO inhibitors (hyperpyrexia, seizures, respiratory collapse)"
      ],
      common: [
        "CYP3A4 inducers (carbamazepine, rifampin, St. John's wort; decrease oxycodone efficacy or precipitate withdrawal)",
        "Anticholinergic drugs (severe constipation and urinary retention)"
      ]
    },
    monitoringParameters: [
      "Respiratory rate, rhythm, and oxygen saturation",
      "Level of sedation and mental alertness",
      "Pain relief and daily opioid requirements",
      "Bowel function and GI motility (mandatory prophylactic laxative therapy)",
      "Signs of aberrant drug-taking behavior or diversion"
    ],
    dosageForms: [
      "Oral Tablet (Immediate-Release, Roxicodone): 5 mg, 10 mg, 15 mg, 20 mg, 30 mg",
      "Oral Tablet (Extended-Release, OxyContin): 10 mg, 15 mg, 20 mg, 30 mg, 40 mg, 60 mg, 80 mg",
      "Oral Capsule: 5 mg",
      "Oral Solution: 5 mg/5 mL, 20 mg/mL (concentrate)"
    ],
    administrationAndCounseling: [
      "Swallow OxyContin extended-release tablets whole with sufficient water; do not crush, chew, break, or pre-soak.",
      "High abuse and addiction liability; take strictly as directed and keep locked away in a safe medication lockbox.",
      "Avoid all alcohol and other sedatives; combined use can be fatal.",
      "Expect constipation; take a bowel stimulant/softener every day while on this medication.",
      "Ensure an in-date naloxone nasal spray (Narcan) is readily accessible at home."
    ]
  },

  "Methadone": {
    genericName: "Methadone",
    brandNames: ["Dolophine", "Methadose"],
    pharmacologicClass: "Opioid Agonist / NMDA Antagonist",
    therapeuticClass: "1. Analgesic",
    mechanismOfAction: "Synthetic full mu-opioid receptor agonist with additional noncompetitive N-methyl-D-aspartate (NMDA) receptor antagonist and serotonin/norepinephrine reuptake inhibitor activity; features a long, variable half-life (15-60 hours) and tissue accumulation.",
    dosingRegimens: [
      "Chronic severe pain in opioid-tolerant patients: Initial 2.5 mg PO q8-12h; titrate slowly every 3-5 days under expert supervision.",
      "Opioid use disorder (detoxification/maintenance): Initial 20-30 mg PO once daily; titrate cautiously to maintenance range of 80-120 mg once daily under federal OTP regulations."
    ],
    sideEffects: {
      common: ["Constipation", "Sedation", "Sweating (diaphoresis)", "Nausea", "Dizziness", "Dry mouth", "Weight gain", "Peripheral edema"],
      severe: ["Life-threatening QT interval prolongation and Torsades de Pointes", "Delayed, cumulative fatal respiratory depression", "Severe hypotension", "Physical and psychological dependence"]
    },
    contraindications: [
      "Significant respiratory depression in unmonitored settings",
      "Acute or severe bronchial asthma",
      "Known or suspected gastrointestinal obstruction, including paralytic ileus",
      "Known QT prolongation or history of Torsades de Pointes",
      "Hypersensitivity to methadone"
    ],
    blackBoxWarning: "WARNING: ADDICTION, ABUSE, AND MISUSE; LIFE-THREATENING RESPIRATORY DEPRESSION; ACCIDENTAL INGESTION; LIFE-THREATENING QT PROLONGATION AND ARRHYTHMIAS; NEONATAL OPIOID WITHDRAWAL SYNDROME; and RISKS FROM CONCOMITANT USE WITH BENZODIAZEPINES OR OTHER CNS DEPRESSANTS. Respiratory depression is the chief hazard; methadone's elimination half-life is longer than its duration of analgesic action. QT interval prolongation and serious arrhythmia (torsades de pointes) have occurred during treatment.",
    drugInteractions: {
      major: [
        "QT-prolonging agents (antiarrhythmics, antipsychotics, fluoroquinolones, macrolides, citalopram; additive risk of fatal ventricular arrhythmias)",
        "Benzodiazepines and CNS depressants (synergistic fatal respiratory depression)",
        "CYP3A4 / CYP2B6 inhibitors (fluconazole, ciprofloxacin; increase methadone levels and QT risk)"
      ],
      common: [
        "CYP inducers (rifampin, phenytoin, carbamazepine, efavirenz; decrease methadone levels and precipitate severe withdrawal)"
      ]
    },
    monitoringParameters: [
      "Baseline and periodic 12-lead ECG (QTc interval; reassess if QTc > 450 ms, consider discontinuation or dose reduction if QTc > 500 ms)",
      "Respiratory rate and sedation level, particularly during initial titration and dose adjustments",
      "Serum potassium and magnesium levels (electrolyte imbalances worsen QT prolongation)",
      "Signs of opioid toxicity or medication accumulation"
    ],
    dosageForms: [
      "Oral Tablet: 5 mg, 10 mg",
      "Oral Dispersible Tablet (for OTP programs): 40 mg",
      "Oral Solution: 5 mg/5 mL, 10 mg/5 mL, 10 mg/mL (concentrate)",
      "Intravenous / Subcutaneous Injection: 10 mg/mL"
    ],
    administrationAndCounseling: [
      "Methadone stays in your body much longer than its pain-relieving effect lasts; never take extra doses for breakthrough pain.",
      "Requires baseline and periodic heart monitoring (ECG) to ensure your heart rhythm remains safe.",
      "Never consume alcohol or take sedatives or sleeping pills without doctor approval.",
      "Store securely away from all family members; accidental ingestion by a child can be immediately fatal.",
      "Maintain active bowel management to prevent severe chronic constipation."
    ]
  },

  "Fentanyl": {
    genericName: "Fentanyl",
    brandNames: ["Abstral", "Actiq", "Duragesic", "Fentora", "Ionsys", "Lazanda", "Subsys"],
    pharmacologicClass: "Anilidopiperidine Opioid Agonist",
    therapeuticClass: "1. Analgesic",
    mechanismOfAction: "High-potency lipophilic anilidopiperidine synthetic opioid with 50-100 times the analgesic potency of morphine; acts as a selective full agonist at mu-opioid receptors, rapidly penetrating the blood-brain barrier and redistributing to systemic tissues.",
    dosingRegimens: [
      "Chronic severe pain in opioid-tolerant patients (Transdermal Patch): 12.5, 25, 50, 75, or 100 mcg/hr patch applied to intact skin every 72 hours (occasionally q48h).",
      "Breakthrough cancer pain in opioid-tolerant patients (Transmucosal / Buccal): Initial 100-200 mcg; titrate individually to successful pain relief.",
      "Strict requirement: Patients must be opioid-tolerant (taking at least oral morphine 60 mg/day, oxycodone 30 mg/day, or equivalent for >=1 week) before initiating transdermal fentanyl."
    ],
    sideEffects: {
      common: ["Application site erythema / irritation", "Somnolence", "Dizziness", "Nausea", "Vomiting", "Constipation", "Headache", "Hyperhidrosis"],
      severe: ["Fatal respiratory depression", "Severe opioid-induced chest wall rigidity (wooden chest syndrome with rapid IV)", "Overdose from external heat application to patch", "Opioid addiction and dependence", "Severe hypotension"]
    },
    contraindications: [
      "Opioid-non-tolerant patients (can cause fatal respiratory depression)",
      "Management of acute, intermittent, or postoperative pain",
      "Mild pain",
      "Significant respiratory depression or acute severe bronchial asthma",
      "Known hypersensitivity to fentanyl"
    ],
    blackBoxWarning: "WARNING: ADDICTION, ABUSE, AND MISUSE; RISK EVALUATION AND MITIGATION STRATEGY (REMS); LIFE-THREATENING RESPIRATORY DEPRESSION; ACCIDENTAL EXPOSURE; NEONATAL OPIOID WITHDRAWAL SYNDROME; CYTOCHROME P450 3A4 INTERACTION; and RISKS FROM CONCOMITANT USE WITH BENZODIAZEPINES OR OTHER CNS DEPRESSANTS. Fatal respiratory depression may occur. Transdermal patches must only be used in opioid-tolerant patients. Exposure of the patch application site to direct external heat sources (heating pads, saunas) increases fentanyl absorption and fatal overdose.",
    drugInteractions: {
      major: [
        "External heat sources (heating pads, electric blankets, hot tubs, saunas, high fever; dramatically increase fentanyl transdermal flux and cause lethal toxicity)",
        "Benzodiazepines, alcohol, and CNS depressants (fatal sedation and respiratory arrest)",
        "Strong CYP3A4 inhibitors (clarithromycin, ketoconazole, diltiazem; inhibit fentanyl clearance)"
      ],
      common: [
        "CYP3A4 inducers (rifampin, carbamazepine; decrease fentanyl concentrations)",
        "Anticholinergic drugs (worsen urinary retention and constipation)"
      ]
    },
    monitoringParameters: [
      "Respiratory rate and depth, especially during the first 24-72 hours after patch initiation or dose increase",
      "Patch adhesion and skin integrity at application site",
      "Pain control and breakthrough medication usage",
      "Signs of heat exposure or severe hypoventilation",
      "Proper storage and secure disposal of used patches"
    ],
    dosageForms: [
      "Transdermal Patch: 12 mcg/hr (delivers 12.5 mcg/hr), 25 mcg/hr, 50 mcg/hr, 75 mcg/hr, 100 mcg/hr",
      "Oral Transmucosal Lozenge (Actiq): 200, 400, 600, 800, 1200, 1600 mcg",
      "Buccal Tablet (Fentora): 100, 200, 400, 600, 800 mcg",
      "Sublingual Spray / Tablet: Various strengths",
      "Intravenous Injection: 50 mcg/mL"
    ],
    administrationAndCounseling: [
      "Apply to flat, intact, non-irradiated skin on the chest, back, flank, or upper arm; clip (do not shave) hair if necessary.",
      "Press firmly in place with the palm of your hand for 30 seconds; wear continuously for 72 hours, then rotate to a different site.",
      "NEVER apply external heat (heating pads, electric blankets, hot baths, heating lamps) directly over the patch as this causes fatal overdose.",
      "Fold used patches in half with the adhesive sides pressed together and flush immediately down the toilet; keep away from children and pets.",
      "Keep naloxone (Narcan) immediately accessible in the home."
    ]
  },

  "Buprenorphine / Naloxone": {
    genericName: "Buprenorphine / Naloxone",
    brandNames: ["Suboxone", "Zubsolv", "Bunavail"],
    pharmacologicClass: "Opioid Partial Agonist / Antagonist Combination",
    therapeuticClass: "1. Analgesic",
    mechanismOfAction: "Buprenorphine is a high-affinity partial agonist at mu-opioid receptors and an antagonist at kappa-opioid receptors, producing a ceiling effect on respiratory depression; naloxone is a pure mu-opioid antagonist with negligible sublingual absorption added to precipitate withdrawal if injected intravenously.",
    dosingRegimens: [
      "Opioid use disorder induction: 2 mg/0.5 mg to 4 mg/1 mg sublingually once mild-to-moderate objective withdrawal has started (COWS score >=8-12); titrate on day 1 to 8 mg/2 mg.",
      "Maintenance: Titrate to target maintenance dose of 16 mg/4 mg sublingually once daily (range 4 mg/1 mg to 24 mg/6 mg daily)."
    ],
    sideEffects: {
      common: ["Oral mucosal numbness / burning", "Headache", "Nausea", "Hyperhidrosis", "Insomnia", "Constipation", "Peripheral edema", "Withdrawal symptoms (if taken prematurely)"],
      severe: ["Precipitated opioid withdrawal syndrome (if full agonists still occupy mu receptors)", "Fatal respiratory depression (especially when co-ingested with benzodiazepines)", "Severe hepatotoxicity", "Neonatal opioid withdrawal syndrome"]
    },
    contraindications: [
      "Severe hepatic impairment (Child-Pugh C; naloxone clearance is compromised, leading to increased systemic naloxone levels)",
      "Known hypersensitivity to buprenorphine or naloxone"
    ],
    blackBoxWarning: "WARNING: ADDICTION, ABUSE, AND MISUSE; RISK EVALUATION AND MITIGATION STRATEGY (REMS); LIFE-THREATENING RESPIRATORY DEPRESSION; ACCIDENTAL EXPOSURE; NEONATAL OPIOID WITHDRAWAL SYNDROME; and RISKS FROM CONCOMITANT USE WITH BENZODIAZEPINES OR OTHER CNS DEPRESSANTS. Buprenorphine/naloxone can be abused in a manner similar to other opioids. Severe respiratory depression and death have occurred, especially when taken with benzodiazepines or other CNS depressants.",
    drugInteractions: {
      major: [
        "Benzodiazepines, sedatives, and alcohol (synergistic respiratory depression and death)",
        "Full opioid agonists (methadone, oxycodone, heroin; buprenorphine displaces them causing immediate severe precipitated withdrawal)",
        "Strong CYP3A4 inhibitors (ketoconazole, ritonavir; increase buprenorphine levels)"
      ],
      common: [
        "CYP3A4 inducers (rifampin, efavirenz, carbamazepine; decrease buprenorphine and may precipitate craving/withdrawal)"
      ]
    },
    monitoringParameters: [
      "Clinical Opioid Withdrawal Scale (COWS) score prior to induction",
      "Adherence, craving reduction, and urine drug screening for illicit substances",
      "Baseline and periodic hepatic enzymes (AST, ALT, bilirubin)",
      "Respiratory and CNS status"
    ],
    dosageForms: [
      "Sublingual Film (Suboxone): 2 mg/0.5 mg, 4 mg/1 mg, 8 mg/2 mg, 12 mg/3 mg",
      "Sublingual Tablet: 2 mg/0.5 mg, 8 mg/2 mg",
      "Sublingual Tablet (Zubsolv): 0.7/0.18 mg, 1.4/0.36 mg, 2.9/0.71 mg, 5.7/1.4 mg, 8.6/2.1 mg, 11.4/2.9 mg"
    ],
    administrationAndCounseling: [
      "Place under the tongue and allow to dissolve completely; do not chew, swallow, or talk while dissolving.",
      "Do not eat, drink, or smoke until the film or tablet has completely dissolved.",
      "Take your first dose ONLY when you are in active, uncomfortable withdrawal; taking it too early will throw you into intense, severe withdrawal.",
      "Never inject or snort this medication; the naloxone component will block the opioid effect and trigger immediate violent withdrawal.",
      "Store safely out of reach of children and household members."
    ]
  },

  "Phenazopyridine": {
    genericName: "Phenazopyridine",
    brandNames: ["Pyridium", "AZO"],
    pharmacologicClass: "Urinary Tract Analgesic",
    therapeuticClass: "1. Analgesic",
    mechanismOfAction: "Azo dye excreted directly into the urinary tract where it exerts a direct topical analgesic and local anesthetic effect on the irritated mucosa of the bladder and lower urinary tract; does not possess antibacterial properties.",
    dosingRegimens: [
      "Symptomatic relief of urinary tract pain, burning, and urgency: 100-200 mg PO three times daily after meals for a maximum duration of 2 days when used alongside antibacterial therapy.",
      "Do not exceed 2 days of therapy when treating urinary tract infections with antibiotics."
    ],
    sideEffects: {
      common: ["Reddish-orange discoloration of urine and feces", "Headache", "Dizziness", "Stomach cramps", "Nausea", "Skin staining"],
      severe: ["Methemoglobinemia", "Hemolytic anemia (particularly in G6PD deficiency)", "Acute renal failure / nephrotoxicity with accumulation", "Jaundice / hepatotoxicity"]
    },
    contraindications: [
      "Renal insufficiency or impairment (eGFR < 50 mL/min)",
      "Severe active hepatitis or hepatic impairment",
      "Hypersensitivity to phenazopyridine"
    ],
    drugInteractions: {
      major: [
        "Methemoglobin-inducing agents (dapsone, prilocaine, nitric oxide, sulfonamides; additive risk of severe methemoglobinemia)"
      ],
      common: [
        "Interferes with urine diagnostic tests (colorimetric urinalysis for protein, glucose, ketones, and bilirubin)"
      ]
    },
    monitoringParameters: [
      "Relief of lower urinary tract symptoms (dysuria, urgency, burning)",
      "Renal function (serum creatinine, BUN)",
      "Complete blood count and methemoglobin levels if cyanosis develops",
      "Skin and sclera inspection for yellowish discoloration (indicates drug accumulation)"
    ],
    dosageForms: [
      "Oral Tablet: 95 mg, 97.5 mg (OTC), 100 mg, 200 mg (Rx)"
    ],
    administrationAndCounseling: [
      "Take with or immediately after meals with a full glass of water to reduce stomach upset.",
      "Harmlessly colors urine bright reddish-orange; this will permanently stain clothing, underwear, and bedding.",
      "Do not wear soft contact lenses while taking this medicine as tears may permanently stain them orange.",
      "This medicine relieves pain but does NOT cure an infection; you must complete your full antibiotic course.",
      "Do not take for longer than 2 days unless specifically instructed by your physician."
    ]
  },

  "Lidocaine Topical Patch": {
    genericName: "Lidocaine Topical Patch",
    brandNames: ["Lidoderm", "LidoPatch"],
    pharmacologicClass: "Topical Anesthetic",
    therapeuticClass: "1. Analgesic",
    mechanismOfAction: "Amide local anesthetic that blocks voltage-gated sodium channels in cutaneous nociceptive nerve fibers, preventing generation and conduction of action potentials and dampening peripheral neuropathic hypersensitivity.",
    dosingRegimens: [
      "Post-herpetic neuralgia / localized neuropathic pain: Apply up to 3 patches simultaneously to intact, painful skin once daily for a maximum of 12 hours in any 24-hour period (12 hours on, followed by 12 hours off).",
      "Patches may be cut into smaller sizes with scissors prior to peeling release liner."
    ],
    sideEffects: {
      common: ["Application site erythema", "Skin irritation", "Pruritus", "Edema", "Localized burning sensation", "Depigmentation"],
      severe: ["Systemic local anesthetic toxicity (LAST: tinnitus, tremors, circumoral numbness, seizures, cardiac arrest—rare if applied to intact skin within limits)", "Methemoglobinemia", "Allergic contact dermatitis"]
    },
    contraindications: [
      "Known hypersensitivity to amide-type local anesthetics",
      "Application to broken, inflamed, denuded, or infected skin"
    ],
    drugInteractions: {
      major: [
        "Class I antiarrhythmic drugs (mexiletine, tocainide; additive systemic toxicities and cardiac effects)"
      ],
      common: [
        "Other local anesthetic formulations (additive systemic lidocaine absorption if applied concurrently)"
      ]
    },
    monitoringParameters: [
      "Pain relief scores and functional mobility",
      "Skin inspection at application site for blistering or severe dermatitis",
      "Signs of systemic toxicity (dizziness, metallic taste, blurred vision, bradycardia) in high-risk patients"
    ],
    dosageForms: [
      "Topical Adhesive Patch / Plaster: 5% (Lidoderm Rx, 700 mg lidocaine per patch), 4% (OTC)"
    ],
    administrationAndCounseling: [
      "Apply only to clean, dry, intact skin; never apply to broken, inflamed, or infected skin.",
      "Leave in place for up to 12 hours, then remove and leave patch-free for at least 12 hours before applying a new patch.",
      "You may cut the patch into smaller pieces with scissors before peeling off the clear plastic backing.",
      "Wash your hands thoroughly after applying or handling patches.",
      "Fold used patches in half with the sticky sides together and dispose of them safely out of reach of children and pets."
    ]
  }
};

