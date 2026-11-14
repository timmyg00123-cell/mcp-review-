import type { TopDrugClinicalMonograph } from './types.js';

export const CAT02_ANTIBIOTICS: Record<string, TopDrugClinicalMonograph> = {
  "Penicillin VK": {
    genericName: "Penicillin VK",
    brandNames: ["Pen-V-K", "V-Cillin K"],
    pharmacologicClass: "Natural Penicillin / Beta-Lactam Antibiotic",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Binds to penicillin-binding proteins (PBPs 1A, 1B, 2, and 3) on the bacterial cell membrane, inhibiting the final transpeptidation step of peptidoglycan synthesis in bacterial cell walls, triggering autolytic enzyme activation and bacterial cell lysis.",
    dosingRegimens: [
      "Streptococcal pharyngitis: 250-500 mg PO q6-8h for 10 days.",
      "Mild-to-moderate skin / soft tissue or dental infections: 250-500 mg PO q6h.",
      "Rheumatic fever prophylaxis: 250 mg PO twice daily."
    ],
    sideEffects: {
      common: ["Diarrhea", "Nausea", "Vomiting", "Oral candidiasis (thrush)", "Epigastric distress"],
      severe: ["Anaphylaxis and angioedema", "Clostridioides difficile-associated diarrhea (CDAD)", "Stevens-Johnson syndrome", "Hemolytic anemia", "Interstitial nephritis"]
    },
    contraindications: [
      "Severe immediate-type hypersensitivity (anaphylaxis) to penicillins or other beta-lactams"
    ],
    drugInteractions: {
      major: [
        "Methotrexate (penicillins inhibit renal tubular secretion of methotrexate, causing toxic accumulation)"
      ],
      common: [
        "Oral contraceptives (potential minor reduction in ethinyl estradiol enterohepatic recirculation)",
        "Probenecid (competitively blocks renal tubular secretion, elevating penicillin serum concentrations)"
      ]
    },
    monitoringParameters: [
      "Resolution of infection (fever, WBC, localized erythema)",
      "Signs and symptoms of immediate allergic reaction or delayed rash",
      "Renal function in prolonged or high-dose therapy"
    ],
    dosageForms: [
      "Oral Tablet: 250 mg (400,000 units), 500 mg (800,000 units)",
      "Oral Solution Reconstituted: 125 mg/5 mL, 250 mg/5 mL"
    ],
    administrationAndCounseling: [
      "Take on an empty stomach with a full glass of water 1 hour before or 2 hours after meals for optimal absorption.",
      "Complete the entire prescribed 10-day course even if symptoms resolve earlier to prevent recurrence or rheumatic fever.",
      "Discontinue immediately and seek emergency care if you experience hives, lip or tongue swelling, or difficulty breathing."
    ]
  },

  "Amoxicillin": {
    genericName: "Amoxicillin",
    brandNames: ["Moxatag", "Trimox", "Amoxil"],
    pharmacologicClass: "Aminopenicillin / Beta-Lactam Antibiotic",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs), halting transpeptidation of peptidoglycan layers; possesses enhanced gram-negative outer membrane penetration compared to natural penicillins.",
    dosingRegimens: [
      "Acute otitis media / Sinusitis: 500-875 mg PO q12h or 250-500 mg PO q8h (high dose: 80-90 mg/kg/day divided q12h).",
      "Community-acquired pneumonia: 1000 mg PO q8h for 5-7 days.",
      "Infective endocarditis dental prophylaxis: 2000 mg PO 30-60 minutes prior to procedure."
    ],
    sideEffects: {
      common: ["Diarrhea", "Nausea", "Vomiting", "Non-allergic maculopapular morbilliform rash", "Headache"],
      severe: ["Anaphylaxis", "Severe Clostridioides difficile colitis", "Drug reaction with eosinophilia and systemic symptoms (DRESS)", "Cholestatic jaundice / acute hepatitis"]
    },
    contraindications: [
      "Severe immediate hypersensitivity (anaphylaxis, angioedema) to amoxicillin or other beta-lactam antibiotics"
    ],
    drugInteractions: {
      major: [
        "Methotrexate (decreased renal clearance leading to severe myelosuppression)",
        "Warfarin (prolongation of INR due to gut flora alteration)"
      ],
      common: [
        "Allopurinol (substantially increased incidence of erythematous maculopapular drug rash)",
        "Probenecid (prolongs amoxicillin half-life and peak serum levels)"
      ]
    },
    monitoringParameters: [
      "Clinical resolution of infection",
      "Skin rash emergence (distinguish hypersensitivity from benign ampicillin-type rash in mononucleosis)",
      "Bowel movements (frequency and consistency for C. diff development)"
    ],
    dosageForms: [
      "Oral Capsule: 250 mg, 500 mg",
      "Oral Tablet: 500 mg, 875 mg",
      "Oral Chewable Tablet: 125 mg, 250 mg",
      "Oral Suspension Reconstituted: 125 mg/5 mL, 200 mg/5 mL, 250 mg/5 mL, 400 mg/5 mL"
    ],
    administrationAndCounseling: [
      "May be taken with or without food; taking with a meal or snack reduces stomach upset.",
      "Shake oral suspension thoroughly before each dose; store in refrigerator and discard unused portion after 14 days.",
      "Finish the entire antibiotic course as prescribed even if feeling completely recovered."
    ]
  },

  "Amoxicillin / Potassium Clavulanate": {
    genericName: "Amoxicillin / Potassium Clavulanate",
    brandNames: ["Augmentin", "Augmentin ES", "Augmentin XR", "Amoclan"],
    pharmacologicClass: "Aminopenicillin / Beta-Lactamase Inhibitor Combination",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Amoxicillin inhibits bacterial peptidoglycan cell wall biosynthesis; clavulanic acid is a suicide beta-lactamase inhibitor that irreversibly inactivates class A beta-lactamases, restoring amoxicillin spectrum against beta-lactamase-producing pathogens.",
    dosingRegimens: [
      "Moderate-to-severe respiratory / skin infections: 500/125 mg PO q8h or 875/125 mg PO q12h for 7-10 days.",
      "High-dose acute otitis media (Augmentin ES-600): 90 mg/kg/day amoxicillin with 6.4 mg/kg/day clavulanate divided q12h.",
      "Bite wound infections (animal or human): 875/125 mg PO twice daily for 7-10 days."
    ],
    sideEffects: {
      common: ["Diarrhea (frequent due to clavulanate gut motility stimulation)", "Nausea", "Vomiting", "Candidal vulvovaginitis", "Abdominal discomfort"],
      severe: ["Cholestatic jaundice / acute hepatic dysfunction", "Clostridioides difficile colitis", "Toxic epidermal necrolysis", "Severe hypersensitivity anaphylaxis"]
    },
    contraindications: [
      "History of amoxicillin/clavulanate-associated cholestatic jaundice or hepatic dysfunction",
      "Severe immediate hypersensitivity to penicillins or beta-lactamase inhibitors"
    ],
    drugInteractions: {
      major: [
        "Methotrexate (renal clearance inhibition causing toxicity)",
        "Warfarin (enhanced anticoagulant effect due to vitamin K-producing gut flora eradication)"
      ],
      common: [
        "Allopurinol (elevated risk of cutaneous amoxicillin rash)",
        "Mycophenolate mofetil (decreases mycophenolic acid active metabolite exposure)"
      ]
    },
    monitoringParameters: [
      "Hepatic function tests (AST, ALT, alkaline phosphatase, total bilirubin) in prolonged courses",
      "Renal function in elderly or impaired patients",
      "Diarrhea severity and signs of dehydration"
    ],
    dosageForms: [
      "Oral Tablet: 250/125 mg, 500/125 mg, 875/125 mg",
      "Oral Chewable Tablet: 200/28.5 mg, 400/57 mg",
      "Oral Suspension Reconstituted: 125/31.25 mg/5 mL, 200/28.5 mg/5 mL, 250/62.5 mg/5 mL, 400/57 mg/5 mL, 600/42.9 mg/5 mL"
    ],
    administrationAndCounseling: [
      "Take at the start of a meal to enhance clavulanate absorption and minimize gastrointestinal intolerance and diarrhea.",
      "Do not substitute two 250 mg tablets for one 500 mg tablet because each contains 125 mg of clavulanic acid, resulting in excessive diarrhea.",
      "Complete the entire course; refrigerate liquid suspension and discard after 10 days."
    ]
  },

  "Cephalexin": {
    genericName: "Cephalexin",
    brandNames: ["Keflex"],
    pharmacologicClass: "First-Generation Cephalosporin",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs), causing inhibition of final peptidoglycan transpeptidation and cell lysis; highly active against methicillin-susceptible Staphylococcus aureus (MSSA) and Streptococcus pyogenes.",
    dosingRegimens: [
      "Uncomplicated skin and soft tissue infection: 500 mg PO q12h or 250-500 mg PO q6h for 5-7 days.",
      "Streptococcal pharyngitis: 500 mg PO q12h for 10 days.",
      "Uncomplicated cystitis: 500 mg PO q12h for 7 days."
    ],
    sideEffects: {
      common: ["Diarrhea", "Nausea", "Dyspepsia", "Vomiting", "Abdominal cramps", "Headache"],
      severe: ["Clostridioides difficile colitis", "Anaphylaxis and angioedema", "Aplastic anemia / neutropenia", "Seizures with unadjusted renal overdose"]
    },
    contraindications: [
      "Severe immediate hypersensitivity (anaphylaxis) to cephalexin or other cephalosporins"
    ],
    drugInteractions: {
      major: [
        "Metformin (cephalexin inhibits OCT2 transporter, increasing metformin AUC and plasma levels)"
      ],
      common: [
        "Probenecid (decreases cephalexin renal tubular clearance, raising peak levels)",
        "Warfarin (potential enhancement of anticoagulant effect)"
      ]
    },
    monitoringParameters: [
      "Infection resolution (cellulitis borders, drainage, fever)",
      "Renal function in elderly or patients with baseline kidney disease",
      "Stool frequency and consistency"
    ],
    dosageForms: [
      "Oral Capsule: 250 mg, 500 mg, 750 mg",
      "Oral Tablet: 250 mg, 500 mg",
      "Oral Suspension Reconstituted: 125 mg/5 mL, 250 mg/5 mL"
    ],
    administrationAndCounseling: [
      "May be taken without regard to meals; taking with food reduces stomach upset.",
      "Take doses at evenly spaced intervals around the clock.",
      "Finish all prescribed medication; contact doctor if severe watery diarrhea occurs during or up to 2 months after therapy."
    ]
  },

  "Cefuroxime": {
    genericName: "Cefuroxime",
    brandNames: ["Ceftin", "Zinacef"],
    pharmacologicClass: "Second-Generation Cephalosporin",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Inhibits bacterial cell wall synthesis by selectively binding to PBPs 1 and 3, blocking transpeptidation; exhibits broad stability against beta-lactamases produced by Haemophilus influenzae and Moraxella catarrhalis.",
    dosingRegimens: [
      "Acute bacterial maxillary sinusitis / Exacerbation of chronic bronchitis: 250-500 mg PO twice daily for 10 days.",
      "Early Lyme disease (erythema migrans): 500 mg PO twice daily for 14-21 days.",
      "Uncomplicated skin / urinary tract infections: 250-500 mg PO twice daily for 7 days."
    ],
    sideEffects: {
      common: ["Diarrhea", "Nausea", "Vomiting", "Transient elevation in liver enzymes (ALT, AST)", "Vaginitis"],
      severe: ["Jarisch-Herxheimer reaction in Lyme disease", "C. difficile pseudomembranous colitis", "Stevens-Johnson syndrome", "Anaphylaxis"]
    },
    contraindications: [
      "Severe immediate-type hypersensitivity to cephalosporins or beta-lactams"
    ],
    drugInteractions: {
      major: [
        "Antacids and H2-receptor antagonists / PPIs (reduce stomach acidity, significantly impairing cefuroxime axetil bioavailability)"
      ],
      common: [
        "Warfarin (enhanced hypoprothrombinemic response)",
        "Probenecid (prolongs elimination half-life)"
      ]
    },
    monitoringParameters: [
      "Clinical resolution of infection",
      "Renal function in renal impairment (adjust dose if CrCl < 30 mL/min)",
      "Signs of hypersensitivity or severe cutaneous adverse reactions"
    ],
    dosageForms: [
      "Oral Tablet (as cefuroxime axetil): 250 mg, 500 mg",
      "Oral Suspension Reconstituted: 125 mg/5 mL, 250 mg/5 mL"
    ],
    administrationAndCounseling: [
      "Take cefuroxime axetil tablets with food to enhance oral bioavailability and minimize GI symptoms.",
      "Swallow tablets whole; do not crush or chew due to persistent strong bitter taste.",
      "Avoid taking with acid-reducing antacids, famotidine, or omeprazole at the same time."
    ]
  },

  "Cefdinir": {
    genericName: "Cefdinir",
    brandNames: ["Omnicef"],
    pharmacologicClass: "Third-Generation Cephalosporin",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs), resulting in cell lysis; possesses stability against many plasmid-mediated beta-lactamases and potent activity against respiratory Streptococcus pneumoniae and Haemophilus influenzae.",
    dosingRegimens: [
      "Community-acquired pneumonia / Sinusitis: 300 mg PO q12h or 600 mg PO once daily for 10 days.",
      "Acute otitis media / Pharyngitis: 300 mg PO q12h or 600 mg PO once daily for 5-10 days.",
      "Uncomplicated skin and skin structure infections: 300 mg PO q12h for 10 days."
    ],
    sideEffects: {
      common: ["Diarrhea", "Vaginal candidiasis", "Nausea", "Headache", "Abdominal pain", "Reddish or rust-colored stools (complex with iron)"],
      severe: ["Clostridioides difficile-associated colitis", "Serum sickness-like reaction", "Toxic epidermal necrolysis", "Erythema multiforme"]
    },
    contraindications: [
      "Known hypersensitivity to cefdinir or other cephalosporin antibiotics"
    ],
    drugInteractions: {
      major: [
        "Iron supplements and iron-containing multivitamins (bind cefdinir in gut, reducing absorption by up to 80%; separate by 2 hours)"
      ],
      common: [
        "Antacids containing aluminum or magnesium (reduce cefdinir absorption; separate by at least 2 hours)",
        "Probenecid (inhibits renal tubular excretion)"
      ]
    },
    monitoringParameters: [
      "Resolution of infection",
      "Renal function in patients with CrCl < 30 mL/min (dose reduction required)",
      "Stool appearance (reassure regarding non-bloody reddish coloration with iron)"
    ],
    dosageForms: [
      "Oral Capsule: 300 mg",
      "Oral Suspension Reconstituted: 125 mg/5 mL, 250 mg/5 mL"
    ],
    administrationAndCounseling: [
      "May be taken with or without food.",
      "Separate cefdinir from iron supplements, iron-fortified vitamins, or antacids by at least 2 hours.",
      "If taking iron supplements, your stool may turn reddish or rust-colored; this is harmless and not blood.",
      "Store reconstituted suspension at room temperature (do not refrigerate) and discard after 10 days."
    ]
  },

  "Doxycycline": {
    genericName: "Doxycycline",
    brandNames: ["Acticlate", "Adoxa", "Avidoxy", "Doryx", "Monodox", "Morgidox", "Oracea", "TargaDOX", "Vibramycin"],
    pharmacologicClass: "Tetracycline Derivative / Protein Synthesis Inhibitor",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Reversibly binds to the 30S ribosomal subunit of susceptible bacteria, preventing access of aminoacyl-tRNA to the ribosomal acceptor (A) site and blocking peptide elongation; active against atypical pathogens, spirochetes, rickettsiae, and MRSA.",
    dosingRegimens: [
      "Standard infection / MRSA skin infection: 100 mg PO q12h on day 1, then 100 mg PO daily or twice daily.",
      "Lyme disease (Borrelia burgdorferi): 100 mg PO twice daily for 14-21 days.",
      "Acne vulgaris: 50-100 mg PO twice daily (or 40 mg once daily modified-release Oracea).",
      "Malaria chemoprophylaxis: 100 mg PO once daily starting 1-2 days before travel, continuing daily during travel, and for 4 weeks post-departure."
    ],
    sideEffects: {
      common: ["Nausea", "Vomiting", "Esophageal irritation / pill esophagitis", "Photosensitivity / severe sunburn", "Diarrhea", "Vaginal moniliasis"],
      severe: ["Drug-induced pill-induced esophageal ulceration", "Intracranial hypertension (pseudotumor cerebri)", "Tooth discoloration and enamel hypoplasia (children <8 years)", "Hepatotoxicity"]
    },
    contraindications: [
      "Hypersensitivity to doxycycline or other tetracyclines",
      "Second and third trimesters of pregnancy (fetal tooth discoloration and bone growth inhibition)",
      "Infants and children under 8 years of age (except for life-threatening rickettsial infections or anthrax)"
    ],
    drugInteractions: {
      major: [
        "Oral retinoids (isotretinoin, acitretin; synergistic risk of benign intracranial hypertension / pseudotumor cerebri)",
        "Warfarin (potentiation of anticoagulant effect)"
      ],
      common: [
        "Multivalent polyvalent cations (calcium, iron, magnesium, aluminum, antacids; chelate doxycycline and severely impede oral absorption; separate by 2-3 hours)",
        "CYP3A4 / enzyme inducers (carbamazepine, phenytoin, barbiturates; shorten doxycycline half-life)"
      ]
    },
    monitoringParameters: [
      "Resolution of infection or acne lesions",
      "Visual changes, persistent severe headache (signs of pseudotumor cerebri)",
      "Skin checks for solar erythema or phototoxic reactions"
    ],
    dosageForms: [
      "Oral Capsule (hyclate / monohydrate): 50 mg, 75 mg, 100 mg, 150 mg",
      "Oral Tablet: 20 mg, 50 mg, 75 mg, 100 mg, 150 mg",
      "Oral Suspension Reconstituted: 25 mg/5 mL",
      "Modified-Release Capsule (Oracea): 40 mg (30 mg immediate / 10 mg delayed)"
    ],
    administrationAndCounseling: [
      "Take with a full 8-ounce glass of water and remain completely upright for at least 30 minutes to prevent pill from lodging in the esophagus and causing painful ulcers.",
      "Take with food if stomach upset occurs, but avoid dairy products or calcium-fortified juices within 2 hours.",
      "Use effective broad-spectrum sunscreen and protective clothing; medication causes severe sensitivity to sunlight."
    ]
  },

  "Ciprofloxacin": {
    genericName: "Ciprofloxacin",
    brandNames: ["Cipro", "Cipro XR", "Cetraxal"],
    pharmacologicClass: "Fluoroquinolone / DNA Gyrase Inhibitor",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Inhibits bacterial DNA topoisomerase II (DNA gyrase) and topoisomerase IV, stabilizing cleaved DNA-enzyme complexes, halting DNA replication and transcription, and inducing lethal double-stranded DNA breaks; displays potent concentration-dependent bactericidal action.",
    dosingRegimens: [
      "Complicated urinary tract infection / Pyelonephritis: 500 mg PO q12h (or Cipro XR 1000 mg PO once daily) for 7-14 days.",
      "Infectious diarrhea / Enteric fever: 500 mg PO q12h for 5-7 days.",
      "Post-exposure anthrax inhalation prophylaxis: 500 mg PO q12h for 60 days."
    ],
    sideEffects: {
      common: ["Nausea", "Diarrhea", "Vomiting", "Dyspepsia", "Headache", "Restlessness", "Dizziness"],
      severe: ["Tendonitis and Achilles tendon rupture", "Peripheral neuropathy (potentially irreversible)", "Central nervous system toxicities (toxic psychosis, seizures, hallucinations)", "Aortic aneurysm and dissection", "QT prolongation / Torsades de pointes"]
    },
    contraindications: [
      "Known hypersensitivity to ciprofloxacin or other fluoroquinolones",
      "Concomitant administration with tizanidine (causes extreme hypotensive and sedative collapse)"
    ],
    blackBoxWarning: "Serious adverse reactions including tendinitis, tendon rupture, peripheral neuropathy, and central nervous system effects. Fluoroquinolones may also exacerbate muscle weakness in persons with myasthenia gravis. Because fluoroquinolones have been associated with disabling and potentially irreversible serious adverse reactions, reserve ciprofloxacin for use in patients who have no alternative treatment options for uncomplicated urinary tract infections or acute bacterial exacerbations of chronic bronchitis.",
    drugInteractions: {
      major: [
        "Tizanidine (potent CYP1A2 inhibition by ciprofloxacin produces 10-fold increase in tizanidine exposure; contraindicated)",
        "Theophylline (CYP1A2 inhibition elevates theophylline levels into toxic range)",
        "QT-prolonging drugs (antiarrhythmics, psychotropics; additive risk of ventricular arrhythmias)"
      ],
      common: [
        "Multivalent cations (calcium, magnesium, aluminum antacids, sucralfate, iron supplements; severely reduce absorption; separate by 2h before or 6h after)",
        "Warfarin (potentiation of anticoagulation / bleeding)"
      ]
    },
    monitoringParameters: [
      "Signs and symptoms of tendon pain, swelling, or inflammation (immediate discontinuation required)",
      "Signs of peripheral neuropathy (burning, tingling, numbness)",
      "Renal function (dose adjustment required if CrCl < 50 mL/min)",
      "ECG baseline QTc in patients with cardiac risk factors"
    ],
    dosageForms: [
      "Oral Tablet: 250 mg, 500 mg, 750 mg",
      "Extended-Release Tablet (Cipro XR): 500 mg, 1000 mg",
      "Oral Suspension Reconstituted: 250 mg/5 mL (5%), 500 mg/5 mL (10%)"
    ],
    administrationAndCounseling: [
      "Drink plenty of fluids while taking this medication to prevent crystalluria.",
      "Separate by at least 2 hours before or 6 hours after calcium-rich foods, antacids, iron, or multivitamins.",
      "Discontinue medication immediately and contact your doctor at the first sign of tendon pain, joint swelling, numbness/tingling, or behavioral changes.",
      "Avoid strenuous exercise while taking ciprofloxacin and for several weeks after completing therapy."
    ]
  },

  "Moxifloxacin": {
    genericName: "Moxifloxacin",
    brandNames: ["Avelox", "Vigamox"],
    pharmacologicClass: "Respiratory Fluoroquinolone",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Inhibits bacterial topoisomerases II (DNA gyrase) and IV, leading to rapid bacterial DNA fragmentation; enhanced C8-methoxy substituent broadens spectrum against Streptococcus pneumoniae and atypical respiratory pathogens while minimizing renal dependence.",
    dosingRegimens: [
      "Community-acquired pneumonia / Acute bacterial sinusitis: 400 mg PO or IV once daily for 7-14 days.",
      "Complicated skin and skin structure infections: 400 mg PO once daily for 7-21 days.",
      "Bacterial conjunctivitis (Vigamox ophthalmic): Instill 1 drop in affected eye(s) 3 times daily for 7 days."
    ],
    sideEffects: {
      common: ["Nausea", "Diarrhea", "Dizziness", "Headache", "Dyspepsia", "Vomiting"],
      severe: ["QTc interval prolongation and Torsades de pointes", "Tendinitis and tendon rupture", "Peripheral neuropathy", "Clostridioides difficile colitis", "Severe hepatotoxicity / fulminant hepatic failure"]
    },
    contraindications: [
      "Hypersensitivity to moxifloxacin or other fluoroquinolones",
      "History of fluoroquinolone-associated tendinitis or tendon rupture",
      "Baseline QTc prolongation or concurrent administration of Class IA or Class III antiarrhythmics"
    ],
    blackBoxWarning: "Serious adverse reactions including tendinitis, tendon rupture, peripheral neuropathy, and central nervous system effects. May exacerbate muscle weakness in myasthenia gravis. Discontinue immediately if tendon pain or neurologic symptoms occur.",
    drugInteractions: {
      major: [
        "QT-prolonging medications (amiodarone, sotalol, quinidine, antipsychotics; additive QTc prolongation and ventricular tachycardia)",
        "Class IA and Class III antiarrhythmic agents"
      ],
      common: [
        "Polyvalent cation antacids / sucralfate / iron supplements (decreased oral moxifloxacin absorption; separate by 4 hours before or 8 hours after)",
        "Warfarin (enhanced anticoagulant effect and elevated INR)"
      ]
    },
    monitoringParameters: [
      "Baseline and follow-up ECG for QTc interval prolongation in at-risk individuals",
      "Tendon pain, swelling, or difficulty walking (discontinue immediately)",
      "Hepatic enzymes in prolonged therapy (no renal adjustment required)"
    ],
    dosageForms: [
      "Oral Tablet: 400 mg",
      "Ophthalmic Solution: 0.5% (5 mg/mL)",
      "Intravenous Premixed Infusion: 400 mg in 250 mL 0.8% saline"
    ],
    administrationAndCounseling: [
      "May be taken with or without food once daily at the same time each day.",
      "Take at least 4 hours before or 8 hours after iron supplements, calcium, magnesium, or aluminum antacids.",
      "Stop taking and notify your provider immediately if you experience pain or swelling in your Achilles tendon, sudden chest/back pain, or tingling/numbness in your hands or feet."
    ]
  },

  "Levofloxacin": {
    genericName: "Levofloxacin",
    brandNames: ["Levaquin"],
    pharmacologicClass: "Respiratory Fluoroquinolone",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Pure (-)-(S)-enantiomer of ofloxacin that potently inhibits bacterial DNA gyrase and topoisomerase IV, arresting DNA replication; displays superior bactericidal potency against Gram-positive Streptococcus pneumoniae and Gram-negative Pseudomonas aeruginosa.",
    dosingRegimens: [
      "Community-acquired pneumonia: 500 mg PO once daily for 7-14 days or 750 mg PO once daily for 5 days.",
      "Complicated UTI / Acute pyelonephritis: 250 mg PO daily for 10 days or 750 mg PO daily for 5 days.",
      "Inhalational anthrax post-exposure: 500 mg PO once daily for 60 days."
    ],
    sideEffects: {
      common: ["Nausea", "Headache", "Diarrhea", "Insomnia", "Constipation", "Dizziness"],
      severe: ["Achilles tendinitis and rupture", "Peripheral neuropathy", "Psychosis, hallucinations, depression, suicidal ideation", "QTc prolongation", "Hypoglycemia or hyperglycemia (dysglycemia)"]
    },
    contraindications: [
      "Known hypersensitivity to levofloxacin or other fluoroquinolones",
      "History of fluoroquinolone-induced tendon disorders"
    ],
    blackBoxWarning: "Serious adverse reactions including tendinitis, tendon rupture, peripheral neuropathy, and central nervous system effects. May exacerbate muscle weakness in persons with myasthenia gravis. Because of disabling adverse effects, reserve for use in patients who have no alternative treatment options.",
    drugInteractions: {
      major: [
        "Antidiabetic agents / Insulin (severe hypoglycemia with altered mental status reported)",
        "QTc-prolonging drugs (amiodarone, procainamide, macrolides, methadone; additive ventricular arrhythmia risk)",
        "NSAIDs (co-administration increases risk of CNS stimulation and convulsive seizures)"
      ],
      common: [
        "Antacids containing aluminum or magnesium, sucralfate, iron salts (diminish absorption; separate by 2h)",
        "Warfarin (elevated INR and bleeding)"
      ]
    },
    monitoringParameters: [
      "Renal function (dose reduction required if CrCl < 50 mL/min)",
      "Blood glucose monitoring in diabetic patients",
      "Emergence of tendon tenderness, burning nerve pain, or mood alterations"
    ],
    dosageForms: [
      "Oral Tablet: 250 mg, 500 mg, 750 mg",
      "Oral Solution: 25 mg/mL (480 mL)",
      "Intravenous Premix Solution: 250 mg, 500 mg, 750 mg in 5% Dextrose"
    ],
    administrationAndCounseling: [
      "Take once daily with a full glass of water, with or without meals.",
      "Separate from iron supplements, multivitamins with minerals, and antacids by at least 2 hours.",
      "Immediately report any tendon pain, joint swelling, tingling in fingers or toes, or confusion.",
      "Diabetic patients should monitor blood glucose closely for sudden drops or spikes."
    ]
  },

  "Clarithromycin": {
    genericName: "Clarithromycin",
    brandNames: ["Biaxin", "Biaxin XL"],
    pharmacologicClass: "Macrolide / 50S Ribosomal Protein Synthesis Inhibitor",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Binds reversibly to the 23S rRNA in the 50S subunit of the bacterial ribosome, blocking translocation of aminoacyl-tRNA and inhibiting protein synthesis; active metabolite 14-hydroxyclarithromycin acts synergistically against Haemophilus influenzae.",
    dosingRegimens: [
      "Respiratory tract infection / Pharyngitis: 250-500 mg PO q12h for 7-14 days.",
      "Extended-Release (Biaxin XL): 1000 mg PO once daily with food for 7-14 days.",
      "Helicobacter pylori triple therapy eradication: 500 mg PO twice daily in combination with amoxicillin and a PPI for 14 days."
    ],
    sideEffects: {
      common: ["Dysgeusia (metallic or bitter taste in mouth)", "Diarrhea", "Nausea", "Vomiting", "Abdominal pain", "Headache"],
      severe: ["QTc prolongation and Torsades de pointes", "Cholestatic hepatitis / acute liver failure", "Clostridioides difficile colitis", "Increased long-term cardiovascular mortality in CAD patients"]
    },
    contraindications: [
      "Concomitant use with simvastatin, lovastatin (severe rhabdomyolysis), colchicine, pimozide, or ergotamine",
      "History of cholestatic jaundice or hepatic dysfunction with macrolides",
      "Known hypersensitivity to clarithromycin or macrolides"
    ],
    drugInteractions: {
      major: [
        "CYP3A4 substrates: Simvastatin and Lovastatin (severe rhabdomyolysis; contraindicated)",
        "Colchicine (fatal colchicine toxicity, especially in renal/hepatic impairment; contraindicated)",
        "Carbamazepine, Theophylline, Digoxin (drastic elevation in serum concentrations)"
      ],
      common: [
        "Warfarin (prolongation of prothrombin time and increased bleeding risk)",
        "Direct oral anticoagulants (apixaban, rivaroxaban; increased bleeding risk)"
      ]
    },
    monitoringParameters: [
      "Hepatic function tests (AST, ALT, bilirubin) if symptoms of hepatitis occur",
      "Baseline ECG for QTc interval in cardiac patients",
      "Renal function (dose reduction by 50% if CrCl < 30 mL/min)"
    ],
    dosageForms: [
      "Oral Tablet: 250 mg, 500 mg",
      "Oral Extended-Release Tablet (Biaxin XL): 500 mg",
      "Oral Suspension Reconstituted: 125 mg/5 mL, 250 mg/5 mL"
    ],
    administrationAndCounseling: [
      "Immediate-release tablets and suspension may be taken with or without food; extended-release tablets MUST be taken with food.",
      "Do not crush, break, or chew extended-release tablets.",
      "You may notice a temporary metallic or bitter taste in your mouth; this is harmless and goes away after stopping the medication."
    ]
  },

  "Azithromycin": {
    genericName: "Azithromycin",
    brandNames: ["Zithromax", "Zithromax Tri-Pak", "Z-Pak", "Zmax"],
    pharmacologicClass: "Azalide / Macrolide Antibiotic",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Subclass of macrolides containing a methyl-substituted nitrogen in the lactone ring that binds to the 50S ribosomal subunit, preventing bacterial transpeptidation; displays extensive intracellular tissue accumulation and an exceptionally long terminal half-life (~68 hours).",
    dosingRegimens: [
      "Community-acquired pneumonia / Sinusitis / COPD exacerbation (Z-Pak): 500 mg PO on day 1, then 250 mg PO once daily on days 2-5.",
      "Alternative 3-day regimen (Tri-Pak): 500 mg PO once daily for 3 days.",
      "Chlamydia trachomatis urethritis/cervicitis: 1000 mg PO single dose."
    ],
    sideEffects: {
      common: ["Diarrhea", "Nausea", "Abdominal pain", "Vomiting", "Headache", "Dizziness"],
      severe: ["QTc interval prolongation and Torsades de pointes", "Cholestatic jaundice / fulminant hepatic necrosis", "Clostridioides difficile colitis", "Infantile hypertrophic pyloric stenosis"]
    },
    contraindications: [
      "Known hypersensitivity to azithromycin, erythromycin, or any macrolide/ketolide",
      "History of cholestatic jaundice or hepatic dysfunction associated with prior azithromycin use"
    ],
    drugInteractions: {
      major: [
        "QTc-prolonging drugs (amiodarone, sotalol, quinidine, antipsychotics; additive risk of fatal ventricular arrhythmias)",
        "Pimozide (contraindicated due to cardiotoxicity)"
      ],
      common: [
        "Aluminum and magnesium-containing antacids (reduce peak serum azithromycin concentration; do not take simultaneously)",
        "Warfarin (monitor INR due to altered gut flora)"
      ]
    },
    monitoringParameters: [
      "Infection resolution",
      "ECG monitoring in patients at high risk for cardiac arrhythmias or baseline QTc prolongation",
      "Hepatic enzymes if dark urine, jaundice, or pruritus develops"
    ],
    dosageForms: [
      "Oral Tablet: 250 mg, 500 mg, 600 mg",
      "Oral Packet: 1000 mg single-dose packet",
      "Oral Suspension Reconstituted: 100 mg/5 mL, 200 mg/5 mL",
      "Intravenous Powder for Solution: 500 mg"
    ],
    administrationAndCounseling: [
      "May be taken with or without food; taking with meals minimizes gastrointestinal discomfort.",
      "Complete the entire 5-day or 3-day course exactly as prescribed; the drug remains active in tissues for days after the last dose.",
      "Do not take antacids containing aluminum or magnesium at the same time as azithromycin."
    ]
  },

  "Clindamycin Topical": {
    genericName: "Clindamycin Topical",
    brandNames: ["Clindesse", "ClindaMax", "Evoclin", "Clindagel", "Clindacin-P", "Cleocin T", "Clindacin ETZ", "Clindacin Pac"],
    pharmacologicClass: "Lincosamide Antibacterial",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Suppresses protein synthesis by binding to the 50S ribosomal subunit of Cutibacterium acnes, reducing bacterial colonisation and decreasing free fatty acid levels in sebum to resolve inflammatory acne lesions.",
    dosingRegimens: [
      "Acne vulgaris: Apply a thin film of 1% gel, lotion, or solution to affected facial skin twice daily.",
      "Bacterial vaginosis (Clindesse 2% vaginal cream): Administer 1 prefilled applicator (approx 5 g) intravaginally once at bedtime."
    ],
    sideEffects: {
      common: ["Skin dryness", "Erythema", "Burning sensation", "Peeling", "Oily skin", "Pruritus"],
      severe: ["Systemic absorption causing Clostridioides difficile colitis / pseudomembranous colitis (rare but documented)", "Severe allergic contact dermatitis"]
    },
    contraindications: [
      "History of regional enteritis, ulcerative colitis, or antibiotic-associated colitis",
      "Hypersensitivity to clindamycin or lincomycin"
    ],
    drugInteractions: {
      major: [
        "Neuromuscular blocking agents (clindamycin exhibits neuromuscular blocking properties that may enhance neuromuscular blockade)"
      ],
      common: [
        "Concurrent topical acne peeling agents (benzoyl peroxide, salicylic acid, retinoids; cumulative skin irritation)"
      ]
    },
    monitoringParameters: [
      "Reduction in inflammatory acne papules and pustules over 6-12 weeks",
      "Application site dermatologic tolerance",
      "Emergence of severe or persistent diarrhea"
    ],
    dosageForms: [
      "Topical Gel: 1%",
      "Topical Lotion: 1%",
      "Topical Solution / Swab: 1%",
      "Topical Foam (Evoclin): 1%",
      "Vaginal Cream: 2%"
    ],
    administrationAndCounseling: [
      "Wash and gently dry affected skin before applying; apply a thin layer over the entire acne-prone area, not just individual pimples.",
      "Avoid contact with eyes, nose, mouth, and abraded or eczematous skin.",
      "Vaginal cream formulations contain mineral oil which may weaken latex condoms or diaphragms for up to 72 hours.",
      "Discontinue and report to your doctor immediately if you develop severe watery diarrhea or abdominal cramps."
    ]
  },

  "Clindamycin Oral": {
    genericName: "Clindamycin Oral",
    brandNames: ["Cleocin"],
    pharmacologicClass: "Lincosamide Antibacterial",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Binds reversibly to the 50S ribosomal subunit near the peptidyl transferase center, halting peptide chain initiation and elongation; highly potent against Gram-positive anaerobes, Bacteroides fragilis, and MRSA; inhibits staphylococcal and streptococcal toxin production.",
    dosingRegimens: [
      "Serious skin / soft tissue / bone infections: 150-450 mg PO q6h (max 1800 mg/day) for 7-14 days.",
      "Dental abscess / odontogenic infection: 300 mg PO q6h for 7 days.",
      "Invasive group A strep or toxic shock syndrome: 600-900 mg IV q8h combined with penicillin/beta-lactam."
    ],
    sideEffects: {
      common: ["Diarrhea", "Nausea", "Vomiting", "Abdominal cramps", "Metallic taste", "Esophagitis"],
      severe: ["Clostridioides difficile-associated diarrhea (CDAD) / pseudomembranous colitis", "Agranulocytosis and leukopenia", "Severe hepatotoxicity", "Stevens-Johnson syndrome"]
    },
    contraindications: [
      "History of pseudomembranous colitis or antibiotic-associated colitis",
      "Known hypersensitivity to clindamycin or lincomycin"
    ],
    blackBoxWarning: "Clostridioides difficile-associated diarrhea (CDAD) has been reported with use of nearly all antibacterial agents, including clindamycin, and may range in severity from mild diarrhea to fatal colitis. Because clindamycin therapy has been associated with severe colitis that may end fatally, it should be reserved for serious infections where less toxic antimicrobial agents are inappropriate.",
    drugInteractions: {
      major: [
        "Neuromuscular blocking agents (tubocurarine, pancuronium, vecuronium; clindamycin enhances neuromuscular blockade, prolonging respiratory paralysis)"
      ],
      common: [
        "Erythromycin (antagonistic antibacterial action due to competitive ribosomal binding displacement)",
        "CYP3A4 inducers/inhibitors (clindamycin is a CYP3A4 substrate)"
      ]
    },
    monitoringParameters: [
      "Stool frequency and consistency (evaluate for C. difficile toxin if diarrhea occurs)",
      "Baseline and periodic hepatic enzymes and complete blood counts in prolonged therapy",
      "Infection resolution"
    ],
    dosageForms: [
      "Oral Capsule (as hydrochloride): 75 mg, 150 mg, 300 mg",
      "Oral Solution Reconstituted (as palmitate): 75 mg/5 mL"
    ],
    administrationAndCounseling: [
      "Take with a full glass of water and remain upright for at least 30 minutes to prevent esophageal irritation and ulceration.",
      "May be taken with food to reduce nausea and stomach discomfort.",
      "STOP taking this medication and call your doctor immediately if you develop watery or bloody diarrhea, fever, or severe stomach cramps, even weeks after finishing the medicine."
    ]
  },

  "Trimethoprim / Sulfamethoxazole": {
    genericName: "Trimethoprim / Sulfamethoxazole",
    brandNames: ["Bactrim", "Septra"],
    pharmacologicClass: "Folic Acid Synthesis Inhibitor Combination",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Sulfamethoxazole competitively inhibits dihydropteroate synthase, blocking incorporation of PABA into dihydropteroic acid; trimethoprim reversibly inhibits dihydrofolate reductase, blocking tetrahydrofolate synthesis; sequential enzymatic blockade produces synergistic bactericidal action against MRSA and enterobacteriaceae.",
    dosingRegimens: [
      "Uncomplicated cystitis: 1 Double Strength (DS 800/160 mg) tablet PO q12h for 3 days.",
      "MRSA skin and soft tissue infection: 1-2 DS tablets PO q12h for 7-10 days.",
      "Pneumocystis jirovecii pneumonia (PCP) prophylaxis: 1 DS tablet PO once daily or 3 times weekly.",
      "PCP treatment: 15-20 mg/kg/day (trimethoprim component) IV/PO divided q6h for 21 days."
    ],
    sideEffects: {
      common: ["Nausea", "Vomiting", "Loss of appetite", "Morbilliform skin rash", "Urticaria", "Hyperkalemia"],
      severe: ["Stevens-Johnson syndrome (SJS) and toxic epidermal necrolysis (TEN)", "Drug-induced aseptic meningitis", "Aplastic anemia, agranulocytosis, and thrombocytopenia", "Kernicterus in neonates", "Crystalluria and acute interstitial nephritis"]
    },
    contraindications: [
      "Hypersensitivity to sulfonamides, trimethoprim, or any excipient",
      "Documented megaloblastic anemia due to folate deficiency",
      "Infants less than 2 months of age (displacement of bilirubin causing kernicterus)",
      "Marked hepatic damage or severe renal insufficiency (CrCl < 15 mL/min when status not monitored)"
    ],
    drugInteractions: {
      major: [
        "Warfarin (potent CYP2C9 inhibition by sulfamethoxazole dramatically increases warfarin levels and INR; extreme bleeding hazard)",
        "Methotrexate (displacement from protein binding and inhibition of renal excretion raises methotrexate toxicity)",
        "Potassium-sparing diuretics / ACE inhibitors / ARBs (trimethoprim blocks ENaC channels in renal tubules, precipitating severe hyperkalemia)"
      ],
      common: [
        "Phenytoin (CYP2C9 inhibition increases phenytoin half-life and toxicity)",
        "Sulfonylureas (increased hypoglycemia risk)"
      ]
    },
    monitoringParameters: [
      "Serum potassium and renal function (BUN, creatinine; trimethoprim causes benign pseudo-elevation in creatinine by blocking tubular secretion)",
      "Complete blood count (CBC with differential and platelets)",
      "Skin checks for any rash or mucosal blistering (prompt drug cessation required)"
    ],
    dosageForms: [
      "Oral Tablet Single Strength (SS): 400 mg sulfamethoxazole / 80 mg trimethoprim",
      "Oral Tablet Double Strength (DS): 800 mg sulfamethoxazole / 160 mg trimethoprim",
      "Oral Suspension: 200 mg sulfamethoxazole / 40 mg trimethoprim per 5 mL"
    ],
    administrationAndCounseling: [
      "Drink plenty of water (at least 6-8 full glasses daily) while taking this drug to prevent kidney crystal formation.",
      "May be taken with or without food; take with food or milk if stomach upset occurs.",
      "Stop taking immediately and seek medical attention if you notice any skin rash, peeling, mouth sores, or yellowing of the skin or eyes.",
      "Wear protective sunscreen; medication causes heightened sensitivity to sunlight."
    ]
  },

  "Metronidazole": {
    genericName: "Metronidazole",
    brandNames: ["Flagyl"],
    pharmacologicClass: "Nitroimidazole Antiprotozoal / Antibacterial",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Diffuses into anaerobic organisms where nitroreductases transfer electrons to metronidazole's nitro group, generating toxic nitro-radical intermediates that form covalent adducts with bacterial DNA, causing helical destabilization, strand breakage, and cell death.",
    dosingRegimens: [
      "Trichomoniasis: 500 mg PO twice daily for 7 days (or 2000 mg PO single dose).",
      "Bacterial vaginosis: 500 mg PO twice daily for 7 days or 0.75% vaginal gel once daily for 5 days.",
      "Anaerobic intra-abdominal infection: 500 mg PO or IV q8h for 7-14 days.",
      "Amebiasis: 750 mg PO three times daily for 7-10 days."
    ],
    sideEffects: {
      common: ["Metallic / bitter taste in mouth", "Nausea", "Headache", "Darkened or reddish-brown urine", "Anorexia", "Dry mouth"],
      severe: ["Peripheral neuropathy (numbness, paresthesias with cumulative dosing)", "Central nervous system toxicity (encephalopathy, ataxia, seizures)", "Disulfiram-like ethanol reaction", "Aseptic meningitis"]
    },
    contraindications: [
      "Known hypersensitivity to metronidazole or other nitroimidazoles",
      "First trimester of pregnancy in patients with trichomoniasis",
      "Use of alcohol or propylene glycol during therapy and for at least 3 days after discontinuation",
      "Use of disulfiram within the previous 2 weeks"
    ],
    drugInteractions: {
      major: [
        "Ethanol (inhibition of aldehyde dehydrogenase precipitates severe disulfiram-like reaction: flushing, severe vomiting, tachycardia, hypotension)",
        "Warfarin (potent CYP2C9 inhibition increases warfarin anticoagulant effect and prothrombin time)",
        "Disulfiram (acute psychosis and confusion; contraindicated within 14 days)"
      ],
      common: [
        "Lithium (decreases renal clearance, raising lithium levels to toxic thresholds)",
        "Busulfan (dramatically increases busulfan plasma concentrations)"
      ]
    },
    monitoringParameters: [
      "Neurologic assessment (monitor for numbness, tingling, gait instability, or tremors)",
      "Prothrombin time / INR in patients on concurrent warfarin",
      "Complete blood count in patients undergoing repeated or prolonged courses"
    ],
    dosageForms: [
      "Oral Tablet: 250 mg, 500 mg",
      "Oral Capsule: 375 mg",
      "Extended-Release Tablet: 750 mg",
      "Topical Cream / Gel / Lotion: 0.75%, 1%",
      "Vaginal Gel: 0.75%"
    ],
    administrationAndCounseling: [
      "DO NOT consume any alcoholic beverages or use products containing alcohol/propylene glycol while taking this medicine and for at least 72 hours after your last dose; combining them causes severe vomiting, flushing, and chest pounding.",
      "May cause your urine to turn dark reddish-brown; this is expected and harmless.",
      "Take with meals or a full glass of water to reduce stomach upset.",
      "Contact your physician immediately if you experience numbness or tingling in your hands or feet."
    ]
  },

  "Albendazole": {
    genericName: "Albendazole",
    brandNames: ["Albenza"],
    pharmacologicClass: "Benzimidazole Antihelmintic",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Binds to parasite free beta-tubulin, inhibiting microtubule polymerization and blocking spindle assembly, which impairs glucose uptake, depletes glycogen stores, and leads to parasite immobilization and death; active metabolite albendazole sulfoxide achieves systemic tissue penetration.",
    dosingRegimens: [
      "Neurocysticercosis: 400 mg PO twice daily with fatty meals for 8-30 days (co-administered with corticosteroids and anticonvulsants).",
      "Hydatid cyst disease (Echinococcus granulosus): 400 mg PO twice daily with fatty meals in 28-day cycles separated by 14 drug-free days for a total of 3 cycles.",
      "Enterobiasis (pinworm): 400 mg PO single dose, repeated in 2 weeks."
    ],
    sideEffects: {
      common: ["Abdominal pain", "Nausea", "Vomiting", "Headache", "Reversible alopecia", "Transient transaminase elevation"],
      severe: ["Bone marrow suppression (agranulocytosis, aplastic anemia, pancytopenia)", "Acute liver injury / hepatotoxicity", "Increased intracranial pressure in neurocysticercosis during larval death"]
    },
    contraindications: [
      "Known hypersensitivity to benzimidazole class compounds",
      "Pregnancy (contraindicated unless no alternative exists; teratogenic and embryotoxic in animals)"
    ],
    drugInteractions: {
      major: [
        "CYP inducers (carbamazepine, phenytoin, phenobarbital; decrease active albendazole sulfoxide plasma levels)"
      ],
      common: [
        "Dexamethasone, Cimetidine, Praziquantel (increase active albendazole sulfoxide plasma levels, which is therapeutically beneficial in tissue helminthiasis)"
      ]
    },
    monitoringParameters: [
      "Complete blood count (CBC) with differential prior to initiation and every 2 weeks during prolonged therapy",
      "Liver function tests (AST, ALT, bilirubin) at baseline and every 2 weeks",
      "Ophthalmic retinal examination prior to treating neurocysticercosis to rule out retinal cysticerci",
      "Pregnancy test prior to starting therapy in women of childbearing potential"
    ],
    dosageForms: [
      "Oral Tablet: 200 mg"
    ],
    administrationAndCounseling: [
      "MUST be taken with a high-fat meal (e.g., milk, butter, cheese) when treating systemic infections (neurocysticercosis, hydatid disease) to increase absorption up to 5-fold.",
      "Tablets may be crushed or chewed and swallowed with water.",
      "Women of childbearing potential should use effective non-hormonal contraception during therapy and for 1 month following completion.",
      "Promptly report any fever, sore throat, unusual fatigue, or unexplained bruising to your doctor."
    ]
  },

  "Nitrofurantoin": {
    genericName: "Nitrofurantoin",
    brandNames: ["Macrodantin", "Macrobid", "Furadantin"],
    pharmacologicClass: "Nitrofuran Antibacterial",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Reduced by bacterial intracellular flavoproteins into highly reactive electrophilic intermediates that indiscriminately attack and damage ribosomal proteins, DNA, RNA, and metabolic enzymes; concentrated selectively in renal tubules and bladder urine with minimal systemic tissue levels.",
    dosingRegimens: [
      "Acute uncomplicated cystitis (Macrobid monohydrate/macrocrystals): 100 mg PO twice daily with food for 5 days.",
      "Acute cystitis (Macrodantin macrocrystals): 50-100 mg PO four times daily with food for 7 days.",
      "Recurrent UTI chronic suppression: 50-100 mg PO once daily at bedtime."
    ],
    sideEffects: {
      common: ["Brown / dark yellow discoloration of urine", "Nausea", "Headache", "Flatulence", "Anorexia", "Dyspepsia"],
      severe: ["Acute or chronic pulmonary toxicity (hypersensitivity pneumonitis, pulmonary fibrosis)", "Hepatic necrosis / chronic active hepatitis", "Severe peripheral neuropathy", "Hemolytic anemia (G6PD deficiency)"]
    },
    contraindications: [
      "Significantly impaired renal function (eGFR < 30 mL/min; inadequate urinary concentration and systemic neurotoxicity risk)",
      "At term pregnancy (38-42 weeks), during labor and delivery, or in neonates <1 month (risk of neonatal hemolytic anemia)",
      "Prior history of nitrofurantoin-associated cholestatic jaundice or hepatic dysfunction"
    ],
    drugInteractions: {
      major: [
        "Antacids containing magnesium trisilicate (adsorb nitrofurantoin and reduce rate and extent of absorption)"
      ],
      common: [
        "Probenecid (inhibits renal tubular excretion, reducing urinary efficacy and increasing systemic toxicity)",
        "Fluoroquinolones (antagonistic antibacterial action in vitro)"
      ]
    },
    monitoringParameters: [
      "Renal function (serum creatinine, eGFR >= 30 mL/min required for efficacy and safety)",
      "Pulmonary symptoms (promptly evaluate cough, chest pain, or dyspnea for drug pneumonitis)",
      "Liver function tests periodically during prolonged suppressive therapy"
    ],
    dosageForms: [
      "Oral Capsule Macrocrystals (Macrodantin): 25 mg, 50 mg, 100 mg",
      "Oral Capsule Dual Delivery (Macrobid: 25 mg macrocrystals / 75 mg monohydrate): 100 mg",
      "Oral Suspension (Furadantin): 25 mg/5 mL"
    ],
    administrationAndCounseling: [
      "Take with food or milk to enhance drug absorption and significantly reduce nausea and stomach upset.",
      "Harmlessly colors urine dark yellow or brown; this is expected.",
      "Stop taking this medicine and call your doctor immediately if you develop sudden shortness of breath, dry cough, numbness/tingling in toes or fingers, or yellowing of the skin or eyes."
    ]
  },

  "Mupirocin": {
    genericName: "Mupirocin",
    brandNames: ["Bactroban", "Bactroban Nasal", "Centany"],
    pharmacologicClass: "Isoleucyl-tRNA Synthetase Inhibitor",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Reversibly and specifically binds to bacterial isoleucyl-tRNA synthetase, halting incorporation of isoleucine into peptide chains and selectively stopping bacterial protein and RNA synthesis; shows no cross-resistance with other antibiotic classes and excellent potency against MRSA.",
    dosingRegimens: [
      "Impetigo: Apply a small amount of 2% ointment or cream to affected skin three times daily for 3-5 days (re-evaluate if no improvement in 3-5 days).",
      "Secondary traumatic skin lesions / folliculitis: Apply small amount 3 times daily for up to 10 days.",
      "Nasal MRSA eradication: Apply approx 0.5 g of 2% nasal ointment inside each nostril twice daily for 5 days."
    ],
    sideEffects: {
      common: ["Burning sensation", "Stinging", "Localized pain", "Pruritus", "Erythema", "Dryness"],
      severe: ["Polyethylene glycol (PEG) vehicle systemic nephrotoxicity (when applied to extensive open burns or denuded wounds)", "Clostridioides difficile colitis (rare)", "Severe contact sensitization"]
    },
    contraindications: [
      "Known hypersensitivity to mupirocin or polyethylene glycol vehicle (ointment formulation)"
    ],
    drugInteractions: {
      major: [
        "Concurrent topical formulations (do not mix with other topical creams or ointments at the application site as it dilutes drug and reduces antibacterial penetration)"
      ],
      common: [
        "Concurrent topical emollients or barrier creams (may dilute drug concentration or reduce skin adherence)"
      ]
    },
    monitoringParameters: [
      "Clinical resolution of crusted lesions or erythema after 3-5 days",
      "Application site tolerance and absence of worsening localized dermatitis",
      "Renal function if ointment containing PEG vehicle is applied over large surface areas with compromised skin barrier"
    ],
    dosageForms: [
      "Topical Ointment: 2%",
      "Topical Cream: 2%",
      "Nasal Ointment (Bactroban Nasal): 2%"
    ],
    administrationAndCounseling: [
      "Wash and thoroughly dry the affected area before applying; apply a small amount and you may cover with a sterile gauze dressing if desired.",
      "For nasal ointment: apply approximately one-half of the single-use tube into one nostril and the other half into the second nostril, then press and massage the sides of the nose together for 1 minute.",
      "Do not use in eyes or near mucous membranes unless using the specific nasal formulation.",
      "Discard unused medication after the prescribed course is finished."
    ]
  },

  "Chlorhexidine": {
    genericName: "Chlorhexidine",
    brandNames: ["Peridex", "Periogard", "Hibiclens"],
    pharmacologicClass: "Biguanide Antiseptic / Antimicrobial",
    therapeuticClass: "2. Antibiotic",
    mechanismOfAction: "Cationic polybiguanide that adsorbs strongly onto negatively charged phosphate groups on bacterial cell surfaces, disrupting cell membrane integrity, causing cytoplasmic leakage, and at therapeutic concentrations precipitating intracellular proteins and nucleic acids.",
    dosingRegimens: [
      "Gingivitis treatment / Periodontal maintenance: Swish 15 mL (1/2 fl oz) undiluted oral rinse in mouth for 30 seconds twice daily (after morning and evening tooth brushing), then spit out.",
      "Surgical scrub / Skin antiseptic (Hibiclens): Apply generously to skin or hands, wash thoroughly for 3-5 minutes, and rinse with water."
    ],
    sideEffects: {
      common: ["Brown staining of teeth, dentures, and tongue", "Alteration in taste perception (dysgeusia)", "Tartar / supragingival calculus accumulation", "Transient oral mucosal irritation", "Dry mouth"],
      severe: ["Anaphylactic reaction and severe angioedema", "Permanent corneal damage (keratopathy) if splashed into eyes", "Irreversible sensorineural ototoxicity if introduced into middle ear across perforated eardrum"]
    },
    contraindications: [
      "Hypersensitivity to chlorhexidine gluconate",
      "Do not instill into middle ear or use for operations on the eye or auditory canal"
    ],
    drugInteractions: {
      major: [
        "Anionic compounds / Sodium lauryl sulfate in toothpastes (inactivates cationic chlorhexidine; separate tooth brushing from chlorhexidine rinse by at least 30 minutes)"
      ],
      common: [
        "Food and beverages consumed immediately after use (dilutes rinse and diminishes antimicrobial persistence)"
      ]
    },
    monitoringParameters: [
      "Reduction in gingival bleeding, inflammation, and plaque index",
      "Dental assessment every 6 months for extrinsic tooth staining and calculus buildup",
      "Oral mucosal integrity"
    ],
    dosageForms: [
      "Oral Rinse: 0.12% (Peridex, Periogard)",
      "Topical Solution: 2%, 4% (Hibiclens)"
    ],
    administrationAndCounseling: [
      "Swish 15 mL in mouth for 30 seconds after brushing teeth, then spit out; DO NOT swallow the rinse.",
      "Do not rinse with water, eat, or drink for at least 30 minutes after using the oral rinse.",
      "May cause brown staining of teeth and dental restorations; professional dental cleanings will remove the stain.",
      "Wait at least 30 minutes between using regular toothpaste and using this mouth rinse because toothpaste can deactivate it.",
      "Keep topical solutions away from eyes and ears."
    ]
  }
};
