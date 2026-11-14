import type { TopDrugClinicalMonograph } from './types.js';

export const CAT12_15_CARDIO_MISC: Record<string, TopDrugClinicalMonograph> = {
  Rivaroxaban: {
    genericName: 'Rivaroxaban',
    brandNames: ['Xarelto'],
    pharmacologicClass: 'Direct Factor Xa Inhibitor',
    therapeuticClass: 'Anticoagulant',
    mechanismOfAction:
      'Selectively and reversibly inhibits free and clot-bound factor Xa as well as prothrombinase activity, prolonging clotting times and reducing thrombin generation without requiring antithrombin III.',
    dosingRegimens: [
      'Nonvalvular AF stroke prevention: 20 mg PO once daily with evening meal (15 mg daily if CrCl 15-50 mL/min)',
      'DVT/PE treatment: 15 mg PO twice daily with food for 21 days, then 20 mg PO once daily with food',
      'DVT prophylaxis (knee/hip replacement): 10 mg PO once daily without regard to food (knee: 12 days; hip: 35 days)',
    ],
    sideEffects: {
      common: ['Minor bleeding', 'Epistaxis', 'Hematoma', 'Gastrointestinal bleeding', 'Dyspepsia'],
      severe: ['Major life-threatening hemorrhage', 'Spinal or epidural hematoma', 'Intracranial hemorrhage', 'Thrombocytopenia'],
    },
    contraindications: [
      'Active pathological bleeding',
      'Severe hypersensitivity to rivaroxaban',
      'Moderate to severe hepatic impairment (Child-Pugh B or C) associated with coagulopathy',
    ],
    drugInteractions: {
      major: ['Combined P-gp and strong CYP3A4 inhibitors (ketoconazole, itraconazole, ritonavir)', 'Combined P-gp and strong CYP3A4 inducers (carbamazepine, phenytoin, rifampin, St. John\'s wort)'],
      common: ['Antiplatelet agents (aspirin, clopidogrel)', 'NSAIDs', 'Other anticoagulants', 'SSRIs/SNRIs (increased bleeding risk)'],
    },
    monitoringParameters: [
      'Signs and symptoms of bleeding and occult blood loss',
      'Baseline and periodic renal function (CrCl / eGFR)',
      'Baseline CBC and hemoglobin/hematocrit',
      'Liver function tests at baseline',
    ],
    dosageForms: ['Oral Tablet: 2.5 mg, 10 mg, 15 mg, 20 mg', 'Oral Suspension: 1 mg/mL'],
    blackBoxWarning:
      'WARNING: DISCONTINUATION OF XARELTO INCREASES RISK OF THROMBOTIC EVENTS: Premature discontinuation of any direct oral anticoagulant increases the risk of cardiovascular thrombotic events. EPIDURAL/SPINAL HEMATOMA: Epidural or spinal hematomas have occurred in patients treated with rivaroxaban who are receiving neuraxial anesthesia or undergoing spinal puncture, which may result in long-term or permanent paralysis.',
    administrationAndCounseling: [
      'Take 15 mg and 20 mg tablets with food to ensure adequate absorption; 10 mg tablets may be taken with or without food.',
      'Do not skip doses or stop therapy without consulting your prescriber, as sudden discontinuation increases blood clot risk.',
      'Report any unusual bruising, prolonged bleeding from cuts, pink/brown urine, or black/tarry stools promptly.',
      'Notify all healthcare providers and dentists that you take rivaroxaban prior to any surgery or dental procedure.',
    ],
  },

  Warfarin: {
    genericName: 'Warfarin',
    brandNames: ['Coumadin', 'Jantoven'],
    pharmacologicClass: 'Vitamin K Antagonist',
    therapeuticClass: 'Anticoagulant',
    mechanismOfAction:
      'Inhibits the vitamin K epoxide reductase (VKORC1) enzyme complex, depleting functional reduced vitamin K required for hepatic gamma-carboxylation of clotting factors II, VII, IX, and X, as well as proteins C and S.',
    dosingRegimens: [
      'Initial: 2 to 5 mg PO once daily adjusted based on serial INR results; lower starting doses (<= 2.5 mg) for elderly, malnourished, or liver disease patients',
      'Maintenance: Typically 2 to 10 mg PO once daily targeted to specific INR goals (2.0-3.0 for DVT/PE/AF; 2.5-3.5 for mechanical mitral heart valves)',
    ],
    sideEffects: {
      common: ['Epistaxis', 'Gingival bleeding', 'Ecchymosis', 'Hematuria', 'GI discomfort'],
      severe: ['Fatal major bleeding and hemorrhage', 'Warfarin-induced skin necrosis', 'Purple toe syndrome', 'Calciphylaxis'],
    },
    contraindications: [
      'Pregnancy (teratogenic; except in women with high-risk mechanical heart valves)',
      'Active major or uncontrolled bleeding',
      'Severe thrombocytopenia or malignant hypertension',
      'Recent or contemplated CNS, eye, or traumatic surgery',
      'Open ulcerative wounds or bleeding diatheses',
    ],
    drugInteractions: {
      major: ['CYP2C9 inducers (rifampin, carbamazepine, St. John\'s wort) marked decrease in INR', 'CYP2C9 inhibitors (amiodarone, fluconazole, metronidazole, Bactrim) marked elevation of INR', 'Broad-spectrum antibiotics altering intestinal vitamin K producing flora'],
      common: ['NSAIDs and aspirin (elevated GI bleeding hazard)', 'Acetaminophen (doses > 2 g/day can elevate INR)', 'Antiplatelet agents', 'SSRIs and SNRIs'],
    },
    monitoringParameters: [
      'Prothrombin Time / International Normalized Ratio (PT/INR) frequently until stable, then at least monthly',
      'Baseline CBC, hematocrit, and platelet count',
      'Stool occult blood and urine testing for microhematuria',
      'Signs and symptoms of bleeding and thrombosis',
    ],
    dosageForms: ['Oral Tablet: 1 mg, 2 mg, 2.5 mg, 3 mg, 4 mg, 5 mg, 6 mg, 7.5 mg, 10 mg', 'Intravenous Injection: 5 mg vial'],
    blackBoxWarning:
      'WARNING: BLEEDING RISK: Warfarin can cause major or fatal bleeding and hemorrhage. Perform regular monitoring of INR in all treated patients. Numerous drugs, dietary changes, and other factors affect INR levels achieved with warfarin therapy. Instruct patients about prevention measures to minimize risk of bleeding and to report signs and symptoms of bleeding immediately.',
    administrationAndCounseling: [
      'Take at the same time each day (typically in the evening) with or without food.',
      'Maintain a consistent dietary intake of vitamin K-rich green leafy vegetables (spinach, kale, broccoli); avoid sudden dietary swings.',
      'Avoid significant alcohol consumption and consult your pharmacist before starting, stopping, or changing any medication or herbal supplement.',
      'Carry a medical alert card or bracelet stating you take warfarin.',
      'Report any signs of bleeding immediately: red or dark urine, black tarry stools, coughing up blood, or unusual bruising.',
    ],
  },

  Dabigatran: {
    genericName: 'Dabigatran',
    brandNames: ['Pradaxa'],
    pharmacologicClass: 'Direct Thrombin Inhibitor',
    therapeuticClass: 'Anticoagulant',
    mechanismOfAction:
      'Potent, competitive, reversible direct thrombin (factor IIa) inhibitor that prevents thrombin-mediated conversion of fibrinogen into fibrin, platelet aggregation, and clot stabilization.',
    dosingRegimens: [
      'Nonvalvular AF stroke prevention: 150 mg PO twice daily (75 mg twice daily if CrCl 15-30 mL/min)',
      'DVT/PE treatment: 150 mg PO twice daily following 5-10 days of parenteral anticoagulation',
      'DVT/PE prophylaxis reduction of recurrence: 150 mg PO twice daily',
    ],
    sideEffects: {
      common: ['Dyspepsia', 'Gastritis-like symptoms', 'Abdominal pain', 'Epistaxis', 'Minor bruising'],
      severe: ['Major life-threatening hemorrhage', 'Gastrointestinal bleeding', 'Spinal/epidural hematoma', 'Anaphylaxis'],
    },
    contraindications: [
      'Active pathological bleeding',
      'Mechanical prosthetic heart valves',
      'Severe renal impairment (CrCl < 15 mL/min)',
      'Hypersensitivity to dabigatran or excipients',
    ],
    drugInteractions: {
      major: ['P-glycoprotein inducers (rifampin, St. John\'s wort) significantly reduce levels', 'P-gp inhibitors (dronedarone, ketoconazole) increase exposure (dose adjust if CrCl 30-50 mL/min)'],
      common: ['Aspirin, clopidogrel, and other antiplatelet drugs', 'NSAIDs', 'Other systemic anticoagulants', 'SSRIs/SNRIs'],
    },
    monitoringParameters: [
      'Renal function (eGFR/CrCl) at baseline and at least annually (more often if impaired)',
      'Signs and symptoms of bleeding and gastrointestinal ulceration',
      'CBC with differential, hemoglobin, and hematocrit',
    ],
    dosageForms: ['Oral Capsule: 75 mg, 110 mg, 150 mg', 'Oral Pellets in Packets: 20 mg, 30 mg, 40 mg, 50 mg, 110 mg, 150 mg'],
    blackBoxWarning:
      'WARNING: DISCONTINUATION INCREASES RISK OF THROMBOTIC EVENTS; SPINAL/EPIDURAL HEMATOMA: Premature discontinuation of dabigatran increases the risk of stroke and other thrombotic events. Epidural or spinal hematomas may occur in patients treated with dabigatran receiving neuraxial anesthesia or spinal puncture, potentially resulting in long-term or permanent paralysis.',
    administrationAndCounseling: [
      'Swallow capsules whole with a full glass of water; do not chew, break, or open the capsules as this increases bioavailability by 75% and elevates bleeding risk.',
      'Keep capsules in their original moisture-resistant bottle or blister pack to protect from humidity; discard unused capsules 4 months after opening bottle.',
      'Take with food if dyspepsia or stomach irritation occurs.',
      'Idarucizumab (Praxbind) is an FDA-approved specific reversal agent for life-threatening emergency bleeding.',
    ],
  },

  Enoxaparin: {
    genericName: 'Enoxaparin',
    brandNames: ['Lovenox'],
    pharmacologicClass: 'Low Molecular Weight Heparin (LMWH)',
    therapeuticClass: 'Anticoagulant',
    mechanismOfAction:
      'Binds to and accelerates the activity of antithrombin III, preferentially inactivating clotting factor Xa with an anti-factor Xa to anti-factor IIa activity ratio of approximately 3.8:1.',
    dosingRegimens: [
      'DVT prophylaxis (abdominal/orthopedic surgery): 30 mg SC every 12 hours or 40 mg SC once daily for 7 to 14 days',
      'DVT/PE inpatient treatment: 1 mg/kg SC every 12 hours or 1.5 mg/kg SC once daily with oral warfarin initiation',
      'Acute coronary syndromes (STEMI / NSTEMI): 1 mg/kg SC every 12 hours; for acute STEMI, initial 30 mg IV bolus plus 1 mg/kg SC dose',
    ],
    sideEffects: {
      common: ['Injection site hematoma or pain', 'Minor hemorrhage', 'Ecchymosis', 'Peripheral edema', 'Transient elevated transaminases'],
      severe: ['Heparin-induced thrombocytopenia (HIT)', 'Spinal or epidural hematoma', 'Major retroperitoneal or intracranial bleeding', 'Anaphylactoid reactions'],
    },
    contraindications: [
      'Active major bleeding',
      'History of immune-mediated heparin-induced thrombocytopenia (HIT) within past 100 days or presence of circulating antibodies',
      'Hypersensitivity to enoxaparin, heparin, or pork products',
    ],
    drugInteractions: {
      major: ['Concomitant systemic anticoagulants (warfarin, DOACs, IV heparin)', 'Thrombolytic agents (alteplase, tenecteplase)'],
      common: ['Aspirin, P2Y12 inhibitors (clopidogrel)', 'NSAIDs', 'SSRIs/SNRIs', 'Platelet aggregation inhibitors'],
    },
    monitoringParameters: [
      'Platelet count at baseline and periodically (monitor for >= 50% drop indicative of HIT)',
      'Baseline and ongoing renal function (CrCl; dose reduction required if CrCl < 30 mL/min)',
      'Hemoglobin, hematocrit, and coagulation parameters',
      'Anti-Factor Xa activity levels in pregnancy, severe renal impairment, or extreme obesity',
    ],
    dosageForms: ['Subcutaneous Injection Prefilled Syringe: 30 mg/0.3 mL, 40 mg/0.4 mL, 60 mg/0.6 mL, 80 mg/0.8 mL, 100 mg/1 mL, 120 mg/0.8 mL, 150 mg/1 mL', 'Multiple-Dose Vial: 300 mg/3 mL'],
    blackBoxWarning:
      'WARNING: SPINAL/EPIDURAL HEMATOMAS: Epidural or spinal hematomas may occur in patients who are anticoagulated with low molecular weight heparins (LMWH) or heparinoids and are receiving neuraxial anesthesia or undergoing spinal puncture. These hematomas may result in long-term or permanent paralysis.',
    administrationAndCounseling: [
      'Administer by deep subcutaneous injection into the left or right anterolateral or posterolateral abdominal wall (love handles).',
      'Rotate injection sites between right and left sides; do not inject into skin with scars or bruises.',
      'Do not expel the air bubble from prefilled syringes prior to injection to avoid loss of drug.',
      'Do not rub the injection site after administration to minimize bruising.',
      'Safely discard syringes in an approved sharps container.',
    ],
  },

  Heparin: {
    genericName: 'Heparin',
    brandNames: ['Heparin Sodium'],
    pharmacologicClass: 'Unfractionated Heparin',
    therapeuticClass: 'Anticoagulant',
    mechanismOfAction:
      'Binds reversibly to antithrombin III, producing a conformational change that dramatically accelerates antithrombin-mediated inactivation of thrombin (factor IIa) and factor Xa in an equal 1:1 ratio.',
    dosingRegimens: [
      'VTE prophylaxis: 5,000 units SC every 8 to 12 hours',
      'VTE treatment: Initial IV bolus of 80 units/kg followed by continuous IV infusion of 18 units/kg/hour titrated to target aPTT or anti-Xa levels',
      'Acute coronary syndrome: Initial IV bolus of 60 units/kg (max 4,000 units) followed by continuous infusion of 12 units/kg/hour (max 1,000 units/hour)',
    ],
    sideEffects: {
      common: ['Injection site hematoma', 'Mild bleeding', 'Transient thrombocytopenia', 'Elevated aminotransferases'],
      severe: ['Heparin-induced thrombocytopenia (HIT with thrombosis)', 'Massive hemorrhage', 'Osteoporosis (prolonged therapy > 3 months)', 'Hypoaldosteronism and hyperkalemia'],
    },
    contraindications: [
      'Severe thrombocytopenia or confirmed history of heparin-induced thrombocytopenia',
      'Active uncontrolled bleeding',
      'Inability to obtain adequate blood coagulation tests at required intervals for full-dose therapy',
    ],
    drugInteractions: {
      major: ['Thrombolytics (alteplase, reteplase)', 'Concomitant full-dose anticoagulants'],
      common: ['Aspirin, clopidogrel, prasugrel', 'NSAIDs and salicylates', 'Glycoprotein IIb/IIIa inhibitors', 'Cephalosporins with NMTT side chains'],
    },
    monitoringParameters: [
      'Activated Partial Thromboplastin Time (aPTT) or anti-Factor Xa levels every 6 hours during IV titration',
      'Platelet counts at baseline and every 2 to 3 days from day 4 to day 14 (or until discontinuation)',
      'Hemoglobin and hematocrit',
      'Serum potassium levels in prolonged therapy',
    ],
    dosageForms: ['Injection Solution: 1,000 units/mL, 2,000 units/mL, 5,000 units/mL, 10,000 units/mL, 20,000 units/mL', 'Premixed IV Infusion Bags in 5% Dextrose or 0.9% NaCl: 25,000 units/250 mL, 25,000 units/500 mL'],
    administrationAndCounseling: [
      'Full-dose therapeutic treatment is administered via weight-based continuous intravenous infusion using an electronic infusion pump.',
      'Low-dose prophylactic therapy is injected subcutaneously into the abdomen without aspirating.',
      'Protamine sulfate is the fast-acting IV reversal agent for heparin-induced acute bleeding.',
      'Promptly report unexpected bruising, gum bleeding, dark stools, or sudden leg swelling/pain.',
    ],
  },

  Apixaban: {
    genericName: 'Apixaban',
    brandNames: ['Eliquis'],
    pharmacologicClass: 'Direct Factor Xa Inhibitor',
    therapeuticClass: 'Anticoagulant',
    mechanismOfAction:
      'Direct, selective, and reversible inhibitor of free and clot-bound factor Xa and prothrombinase activity, which inhibits platelet aggregation and fibrin clot formation without requiring antithrombin III.',
    dosingRegimens: [
      'Nonvalvular AF stroke prevention: 5 mg PO twice daily (reduce to 2.5 mg twice daily if patient has >= 2 of: age >= 80, body weight <= 60 kg, serum creatinine >= 1.5 mg/dL)',
      'DVT/PE treatment: 10 mg PO twice daily for 7 days, followed by 5 mg PO twice daily',
      'DVT/PE recurrence prevention: 2.5 mg PO twice daily after at least 6 months of initial treatment',
      'DVT prophylaxis (hip/knee replacement): 2.5 mg PO twice daily starting 12-24 hours post-op (hip: 35 days; knee: 12 days)',
    ],
    sideEffects: {
      common: ['Minor bleeding', 'Epistaxis', 'Hematuria', 'Hematoma', 'Nausea'],
      severe: ['Major gastrointestinal or intracranial hemorrhage', 'Spinal/epidural hematoma', 'Anaphylaxis', 'Thrombocytopenia'],
    },
    contraindications: [
      'Active pathological bleeding',
      'Severe hypersensitivity to apixaban',
      'Severe hepatic impairment (Child-Pugh C)',
    ],
    drugInteractions: {
      major: ['Dual strong inhibitors of CYP3A4 and P-gp (ketoconazole, itraconazole, ritonavir) require 50% dose reduction or avoidance', 'Dual strong inducers of CYP3A4 and P-gp (carbamazepine, phenytoin, rifampin, St. John\'s wort) avoid coadministration'],
      common: ['Aspirin, clopidogrel, prasugrel, ticagrelor', 'NSAIDs', 'SSRIs and SNRIs', 'Other anticoagulants'],
    },
    monitoringParameters: [
      'Signs and symptoms of bleeding and anemia',
      'Renal function (serum creatinine, eGFR) and body weight for AF dose reduction criteria',
      'Baseline CBC, hemoglobin, and hematocrit',
      'Liver enzymes at baseline',
    ],
    dosageForms: ['Oral Tablet: 2.5 mg, 5 mg'],
    blackBoxWarning:
      'WARNING: PREMATURE DISCONTINUATION INCREASES RISK OF THROMBOTIC EVENTS; SPINAL/EPIDURAL HEMATOMA: Premature discontinuation of any oral anticoagulant increases the risk of thrombotic events. Epidural or spinal hematomas may occur in patients treated with apixaban receiving neuraxial anesthesia or spinal puncture, leading to long-term or permanent paralysis.',
    administrationAndCounseling: [
      'Take twice daily at approximately 12-hour intervals with or without food.',
      'If you miss a dose, take it as soon as remembered on the same day; do not take two doses at the exact same time.',
      'Tablets may be crushed and suspended in water, 5% dextrose, or applesauce and administered immediately.',
      'Andexanet alfa (Andexxa) is the specific recombinant reversal agent for life-threatening factor Xa bleeding.',
      'Do not discontinue apixaban without speaking to your doctor, as clot and stroke risk increase rapidly.',
    ],
  },

  Clopidogrel: {
    genericName: 'Clopidogrel',
    brandNames: ['Plavix'],
    pharmacologicClass: 'P2Y12 Platelet Inhibitor (Thienopyridine)',
    therapeuticClass: 'Antiplatelet',
    mechanismOfAction:
      'Prodrug whose active thiol metabolite irreversibly blocks the P2Y12 component of ADP receptors on the platelet surface, preventing ADP-mediated activation of the GPIIb/IIIa glycoprotein complex and subsequent platelet aggregation.',
    dosingRegimens: [
      'Acute Coronary Syndrome (STEMI / NSTEMI / Unstable Angina): 300 to 600 mg PO loading dose, followed by 75 mg PO once daily in combination with aspirin',
      'Recent MI, Recent Stroke, or Established Peripheral Arterial Disease: 75 mg PO once daily',
    ],
    sideEffects: {
      common: ['Minor bleeding', 'Bruising / ecchymosis', 'Epistaxis', 'Hematoma', 'Pruritus', 'Dyspepsia'],
      severe: ['Thrombotic thrombocytopenic purpura (TTP)', 'Major GI hemorrhage', 'Intracranial hemorrhage', 'Agranulocytosis'],
    },
    contraindications: [
      'Active pathological bleeding (peptic ulcer or intracranial hemorrhage)',
      'Hypersensitivity to clopidogrel or other thienopyridines',
    ],
    drugInteractions: {
      major: ['Strong CYP2C19 inhibitors (omeprazole, esomeprazole) significantly diminish clopidogrel active metabolite formation and antiplatelet efficacy; prefer pantoprazole'],
      common: ['Aspirin, NSAIDs, and anticoagulants (additive bleeding risk)', 'SSRIs and SNRIs', 'CYP2C19 inducers (rifampin)'],
    },
    monitoringParameters: [
      'Signs and symptoms of bleeding and easy bruising',
      'CBC with platelet count and hemoglobin/hematocrit at baseline and periodically',
      'CYP2C19 genotype test in high-risk patients to identify poor metabolizers',
      'Signs of TTP (fever, neurological symptoms, renal dysfunction, thrombocytopenia)',
    ],
    dosageForms: ['Oral Tablet: 75 mg, 300 mg'],
    blackBoxWarning:
      'WARNING: DIMINISHED ANTIPLATELET EFFECT IN PATIENTS WITH TWO LOSS-OF-FUNCTION ALLELES OF THE CYP2C19 GENE: The effectiveness of clopidogrel depends on its activation to an active metabolite by the cytochrome P450 (CYP) system, principally CYP2C19. Poor metabolizers exhibit diminished platelet inhibition and higher cardiovascular event rates following ACS or PCI. Tests are available to identify a patient\'s CYP2C19 genotype.',
    administrationAndCounseling: [
      'Take once daily with or without food at the same time each day.',
      'Do not abruptly discontinue clopidogrel without talking to your cardiologist, as stent thrombosis and recurrent myocardial infarction risk increases.',
      'Avoid taking over-the-counter omeprazole without consulting your physician; ask about safer alternative acid reducers such as pantoprazole or famotidine.',
      'Inform all surgeons and dentists you take clopidogrel at least 5 to 7 days before any scheduled procedure.',
    ],
  },

  'Dipyridamole and Aspirin': {
    genericName: 'Dipyridamole and Aspirin',
    brandNames: ['Aggrenox'],
    pharmacologicClass: 'Antiplatelet / Salicylate Combination',
    therapeuticClass: 'Antiplatelet',
    mechanismOfAction:
      'Dual-action antiplatelet mechanism: dipyridamole inhibits adenosine cellular uptake and cyclic nucleotide phosphodiesterase (increasing platelet cAMP/cGMP), while aspirin irreversibly acetylates platelet cyclooxygenase-1 (COX-1), blocking thromboxane A2 formation.',
    dosingRegimens: [
      'Stroke / TIA recurrence risk reduction: 1 extended-release capsule (200 mg dipyridamole / 25 mg aspirin) PO twice daily (morning and evening)',
    ],
    sideEffects: {
      common: ['Headache (very common initially)', 'Dyspepsia', 'Abdominal discomfort', 'Nausea', 'Diarrhea', 'Dizziness'],
      severe: ['Severe intracranial hemorrhage', 'Gastrointestinal ulceration and bleeding', 'Coronary steal phenomenon / angina exacerbation', 'Hypersensitivity reactions'],
    },
    contraindications: [
      'Known allergy to NSAIDs or aspirin, triad of asthma, rhinitis, and nasal polyps',
      'Active peptic ulcer disease or severe bleeding diathesis',
      'Children or teenagers with viral illness (Reye syndrome risk from aspirin component)',
    ],
    drugInteractions: {
      major: ['Systemic anticoagulants (warfarin, heparin, DOACs - extreme bleeding hazard)', 'Other antiplatelet agents and high-dose NSAIDs'],
      common: ['Cholinesterase inhibitors (dipyridamole may counteract their effect in myasthenia gravis)', 'Adenosine (dipyridamole boosts adenosine blood levels; reduce adenosine dose)', 'Antihypertensive medications (additive hypotensive effect)'],
    },
    monitoringParameters: [
      'Signs and symptoms of bleeding and occult gastrointestinal blood loss',
      'CBC with differential, hemoglobin, and hematocrit',
      'Blood pressure and heart rate (vasodilatory dipyridamole effects)',
      'Renal and hepatic function periodically',
    ],
    dosageForms: ['Oral Extended-Release Capsule: 200 mg dipyridamole / 25 mg aspirin'],
    administrationAndCounseling: [
      'Swallow capsules whole with a full glass of water; do not crush, open, or chew the capsules.',
      'Headache is common when starting therapy and often subsides within 1 to 2 weeks of continued therapy.',
      'Take with meals if stomach upset occurs.',
      'Avoid taking additional aspirin or over-the-counter NSAIDs (ibuprofen, naproxen) without consulting your physician.',
    ],
  },

  'Epoetin Alfa': {
    genericName: 'Epoetin Alfa',
    brandNames: ['Epogen', 'Procrit'],
    pharmacologicClass: 'Erythropoiesis-Stimulating Agent (ESA)',
    therapeuticClass: 'Hematopoietic Agent',
    mechanismOfAction:
      'Recombinant human erythropoietin that binds to and activates the erythropoietin receptor on erythroid progenitor cells in bone marrow, stimulating cell division, differentiation, and survival to increase red blood cell production.',
    dosingRegimens: [
      'Chronic Kidney Disease (CKD) on dialysis: Initial 50 to 100 units/kg IV or SC 3 times weekly; adjust dose to maintain hemoglobin between 10 and 11 g/dL',
      'CKD not on dialysis: Initial 50 units/kg SC 3 times weekly or 10,000 units SC weekly; initiate only when Hb < 10 g/dL',
      'Chemotherapy-induced anemia: 150 units/kg SC 3 times weekly or 40,000 units SC weekly until completion of chemotherapy course',
      'Zidovudine-treated HIV anemia: 100 units/kg IV or SC 3 times weekly',
    ],
    sideEffects: {
      common: ['Hypertension', 'Headache', 'Arthralgia', 'Injection site erythema', 'Nausea', 'Pyrexia'],
      severe: ['Arterial and venous thromboembolism (DVT, PE, stroke, MI)', 'Pure red cell aplasia (PRCA)', 'Severe hypertensive encephalopathy', 'Tumor progression in cancer patients'],
    },
    contraindications: [
      'Uncontrolled hypertension',
      'Pure red cell aplasia (PRCA) developing after previous treatment with erythropoietin drugs',
      'Serious allergic reactions to epoetin alfa or human albumin products',
    ],
    drugInteractions: {
      major: ['Lenalidomide / Thalidomide (dramatically increased risk of deep vein thrombosis and pulmonary embolism)'],
      common: ['Antihypertensive agents (may require dosage escalation due to ESA-induced BP rise)', 'Iron supplements (synergistic increase in erythropoietic response; maintain transferrin sat >= 20%)'],
    },
    monitoringParameters: [
      'Hemoglobin and hematocrit weekly until stable, then at least monthly (avoid target Hb > 11 g/dL in CKD)',
      'Blood pressure closely before and throughout therapy',
      'Serum ferritin and transferrin saturation (supplement iron if ferritin < 100 ng/mL or sat < 20%)',
      'Serum potassium and BUN/creatinine',
    ],
    dosageForms: ['Injection Solution Single-Dose Vials: 2,000, 3,000, 4,000, 10,000, 40,000 units/mL', 'Multi-Dose Vials (contains benzyl alcohol): 10,000 units/mL (2 mL), 20,000 units/mL (1 mL)'],
    blackBoxWarning:
      'WARNING: ESAS INCREASE THE RISK OF SERIOUS CARDIOVASCULAR EVENTS, THROMBOEMBOLIC EVENTS, STROKE AND MORTALITY: In controlled clinical trials, ESAs increased the risk of death, serious adverse cardiovascular reactions, and stroke when administered to target hemoglobin levels > 11 g/dL. In cancer patients, ESAs shortened overall survival and/or increased the risk of tumor progression or recurrence in clinical studies.',
    administrationAndCounseling: [
      'For patients on hemodialysis, administer intravenously during dialysis; for non-dialysis CKD and oncology, administer subcutaneously.',
      'Store vials in refrigerator (36°F to 46°F / 2°C to 8°C); do not freeze or shake the vial as protein denatures.',
      'Do not dilute or mix with any other drug solutions.',
      'Monitor blood pressure at home routinely and report sudden elevations, chest pain, or leg swelling immediately.',
    ],
  },

  Amiodarone: {
    genericName: 'Amiodarone',
    brandNames: ['Cordarone', 'Pacerone', 'Nexterone'],
    pharmacologicClass: 'Class III Antiarrhythmic Agent',
    therapeuticClass: 'Antiarrhythmic',
    mechanismOfAction:
      'Multi-channel antiarrhythmic agent that predominantly prolongs myocardial action potential duration and effective refractory period by blocking potassium channels (Ikr), while also exhibiting noncompetitive alpha- and beta-adrenergic inhibition and sodium/calcium channel blockade.',
    dosingRegimens: [
      'Ventricular Arrhythmias (Oral loading): 800 to 1,600 mg PO daily in divided doses with meals for 1 to 3 weeks until initial response, then taper to 600-800 mg daily for 1 month, then maintenance 200 to 400 mg daily',
      'Atrial Fibrillation (Off-label oral loading): 400 to 600 mg PO daily in divided doses for 2 to 4 weeks, then maintenance 100 to 200 mg daily',
      'Pulseless VT / VF Cardiac Arrest: 300 mg IV push; repeat 150 mg IV push once if arrest persists',
    ],
    sideEffects: {
      common: ['Corneal microdeposits', 'Nausea', 'Vomiting', 'Constipation', 'Photosensitivity and blue-gray skin discoloration', 'Tremor', 'Hypo- or hyperthyroidism'],
      severe: ['Fatal pulmonary toxicity (interstitial pneumonitis, pulmonary fibrosis)', 'Severe hepatotoxicity and cirrhosis', 'Proarrhythmia (Torsades de Pointes, QT prolongation)', 'Optic neuropathy and blindness', 'Bradycardia and AV block'],
    },
    contraindications: [
      'Cardiogenic shock',
      'Severe sinus node dysfunction causing marked sinus bradycardia',
      'Second- or third-degree AV block in the absence of a functioning pacemaker',
      'Bradycardia leading to syncope',
      'Known hypersensitivity to amiodarone or iodine',
    ],
    drugInteractions: {
      major: ['Warfarin (inhibits CYP2C9; reduces warfarin requirement by 30-50%)', 'Digoxin (inhibits P-gp; increases digoxin levels by 70-100%; decrease digoxin dose by 50%)', 'Simvastatin/Atorvastatin (inhibits CYP3A4; limit simvastatin to max 20 mg/day)', 'QT-prolonging drugs (macrolides, fluoroquinolones, antipsychotics - additive Torsades risk)'],
      common: ['Beta-blockers and CCBs (additive bradycardia and AV block)', 'Grapefruit juice (inhibits CYP3A4 metabolism of amiodarone)'],
    },
    monitoringParameters: [
      'Chest X-ray and Pulmonary Function Tests (including DLCO) at baseline and every 3-6 months if pulmonary symptoms appear',
      'Liver function tests (AST, ALT, alkaline phosphatase) at baseline and every 6 months',
      'Thyroid function tests (TSH, free T4) at baseline and every 3 to 6 months',
      'Baseline ophthalmologic exam and periodic exams if visual changes develop',
      'ECG for PR interval, QRS duration, and QTc interval at baseline and routinely',
    ],
    dosageForms: ['Oral Tablet: 100 mg, 200 mg, 400 mg', 'Intravenous Injection: 50 mg/mL (3 mL, 18 mL)', 'Premixed IV Bags in Dextrose: 150 mg/100 mL, 360 mg/200 mL'],
    blackBoxWarning:
      'WARNING: PULMONARY, HEPATIC, AND CARDIAC TOXICITY: Amiodarone is intended for use only in patients with indicated life-threatening arrhythmias because its use is accompanied by substantial toxicity. Pulmonary toxicity (fatal toxicities, hypersensitivity pneumonitis, or interstitial/alveolar pneumonitis) occurs in 10% to 17% of patients. Hepatotoxicity is common and can be fatal. Like other antiarrhythmics, it can exacerbate arrhythmias and cause new ventricular fibrillation or Torsades de Pointes.',
    administrationAndCounseling: [
      'Take consistently with or without food, but be consistent as food increases absorption rate and extent.',
      'Wear sunscreen and protective clothing outdoors; avoid sunlamps due to severe photosensitivity and blue-gray skin discoloration.',
      'Avoid grapefruit and grapefruit juice throughout therapy.',
      'Report any new or worsening shortness of breath, persistent dry cough, chest pain, or visual changes immediately.',
    ],
  },

  Digoxin: {
    genericName: 'Digoxin',
    brandNames: ['Lanoxin', 'Digitek', 'Digox'],
    pharmacologicClass: 'Cardiac Glycoside',
    therapeuticClass: 'Cardiac Glycoside',
    mechanismOfAction:
      'Reversibly inhibits the sodium-potassium ATPase membrane pump in cardiac myocytes, increasing intracellular sodium and subsequently promoting sodium-calcium exchange, which increases intracellular calcium and enhances myocardial contractility (positive inotropy), while enhancing vagal tone to slow AV nodal conduction.',
    dosingRegimens: [
      'Heart Failure / Atrial Fibrillation: 0.125 to 0.25 mg PO once daily adjusted based on serum concentrations, renal clearance, lean body weight, and clinical response',
      'Rapid digitalization (loading dose): 0.25 to 0.5 mg IV/PO initially, then 0.25 mg every 4 to 8 hours up to a total of 1 to 1.5 mg over 24 hours',
    ],
    sideEffects: {
      common: ['Anorexia', 'Nausea', 'Vomiting', 'Diarrhea', 'Headache', 'Dizziness', 'Weakness'],
      severe: ['Digoxin toxicity with cardiac arrhythmias (PVCs, ventricular tachycardia, junctional tachycardia, AV block)', 'Xanthopsia (yellow-green halo vision)', 'Confusion and delirium', 'Severe hyperkalemia (in acute toxicity)'],
    },
    contraindications: [
      'Ventricular fibrillation',
      'Known hypersensitivity to digoxin or digitalis glycosides',
      'Wolff-Parkinson-White syndrome with atrial fibrillation',
    ],
    drugInteractions: {
      major: ['P-glycoprotein inhibitors (amiodarone, verapamil, quinidine, clarithromycin, itraconazole) drastically elevate digoxin blood levels', 'Diuretics (loop, thiazides causing hypokalemia, which dramatically potentiates digoxin toxicity)'],
      common: ['Beta-blockers and non-DHP CCBs (additive bradycardia and AV block)', 'Antacids and cholestyramine (decrease oral digoxin absorption)'],
    },
    monitoringParameters: [
      'Serum digoxin concentration (therapeutic range: 0.5 to 0.9 ng/mL for heart failure; 0.8 to 2.0 ng/mL for AF; draw trough >= 6-8 hours post-dose)',
      'Serum potassium, magnesium, and calcium levels (hypokalemia and hypomagnesemia exacerbate toxicity)',
      'Renal function (BUN, serum creatinine, CrCl)',
      'Heart rate (apical pulse) and periodic ECG',
    ],
    dosageForms: ['Oral Tablet: 0.0625 mg, 0.125 mg, 0.25 mg', 'Oral Solution: 0.05 mg/mL', 'Intravenous Injection: 0.1 mg/mL, 0.25 mg/mL'],
    administrationAndCounseling: [
      'Take at the same time each day with or without food.',
      'Check your resting pulse rate daily prior to taking; if pulse is under 60 beats per minute or irregular, contact your healthcare provider before taking.',
      'Digoxin Immune Fab (DigiFab) is the specific intravenous antidote for life-threatening digitalis toxicity.',
      'Promptly report early toxicity symptoms: loss of appetite, nausea/vomiting, unusual weakness, or seeing yellow-green halos around lights.',
    ],
  },

  'Isosorbide Mononitrate': {
    genericName: 'Isosorbide Mononitrate',
    brandNames: ['Imdur'],
    pharmacologicClass: 'Nitrate Vasodilator',
    therapeuticClass: 'Vasodilator',
    mechanismOfAction:
      'Denitrated to form free nitric oxide (NO) within vascular smooth muscle, activating guanylyl cyclase to stimulate cGMP synthesis, dephosphorylating myosin light chains to promote venous and coronary artery vasodilation, reducing preload and myocardial oxygen demand.',
    dosingRegimens: [
      'Angina pectoris prophylaxis (Extended-Release): 30 to 60 mg PO once daily in the morning; may titrate up to 120 mg or 240 mg once daily',
      'Immediate-Release: 20 mg PO twice daily administered 7 hours apart (e.g., 8 AM and 3 PM) to provide a 14-hour nitrate-free interval',
    ],
    sideEffects: {
      common: ['Headache (throbbing; very common at initiation)', 'Dizziness', 'Flushing', 'Postural hypotension', 'Nausea', 'Reflex tachycardia'],
      severe: ['Severe symptomatic hypotension and syncope', 'Nitrate tolerance (loss of antianginal efficacy)', 'Paradoxical bradycardia and angina exacerbation', 'Methemoglobinemia (rare)'],
    },
    contraindications: [
      'Concomitant use of PDE-5 inhibitors (sildenafil, tadalafil, vardenafil) or soluble guanylate cyclase stimulators (riociguat) due to severe refractory hypotension',
      'Severe anemia',
      'Closed-angle glaucoma',
      'Increased intracranial pressure or intracranial hemorrhage',
    ],
    drugInteractions: {
      major: ['Phosphodiesterase-5 inhibitors (sildenafil within 24h, tadalafil within 48h - life-threatening hypotension and cardiovascular collapse)', 'Riociguat (absolute contraindication)'],
      common: ['Antihypertensives, beta-blockers, CCBs, and diuretics (additive orthostatic hypotension)', 'Alcohol (exaggerates vasodilatory hypotensive response)'],
    },
    monitoringParameters: [
      'Blood pressure and heart rate (sitting and standing to detect orthostatic hypotension)',
      'Frequency and severity of angina episodes',
      'Nitrate tolerance (ensure adherence to prescribed nitrate-free interval)',
    ],
    dosageForms: ['Oral Extended-Release Tablet: 30 mg, 60 mg, 120 mg', 'Oral Immediate-Release Tablet: 10 mg, 20 mg'],
    administrationAndCounseling: [
      'Take extended-release tablets in the morning upon awakening with a glass of water; do not crush or chew.',
      'Adhere to the prescribed once-daily morning schedule to provide the essential 12- to 14-hour nitrate-free interval required to prevent nitrate tolerance.',
      'Headache is very common when starting therapy and typically diminishes after 1 to 2 weeks; acetaminophen may be used for symptom relief.',
      'Change positions slowly from lying to standing to prevent dizziness or lightheadedness.',
      'Never take sildenafil, tadalafil, or any erectile dysfunction medication while on this drug.',
    ],
  },

  Nitroglycerin: {
    genericName: 'Nitroglycerin',
    brandNames: [
      'Minitran',
      'Nitro-Bid',
      'Nitro-Dur',
      'Nitro-Time',
      'Nitrolingual',
      'NitroMist',
      'Nitronal',
      'Nitrostat',
      'Rectiv',
    ],
    pharmacologicClass: 'Nitrate Vasodilator',
    therapeuticClass: 'Vasodilator',
    mechanismOfAction:
      'Converted by mitochondrial aldehyde dehydrogenase-2 into nitric oxide (NO) in vascular smooth muscle, activating soluble guanylyl cyclase to elevate intracellular cGMP, inducing systemic venodilation to decrease cardiac preload, end-diastolic pressure, and myocardial wall tension.',
    dosingRegimens: [
      'Sublingual Tablet / Spray (Acute Angina): Dissolve 1 sublingual tablet (0.3, 0.4, or 0.6 mg) or 1-2 sprays under tongue at the first sign of an attack; repeat every 5 minutes up to 3 doses; call 911 if pain persists after first dose',
      'Transdermal Patch (Angina Prophylaxis): Apply 0.2 to 0.8 mg/hour patch to hairless skin daily for 12 to 14 hours, then remove for a 10 to 12-hour patch-free interval',
      'Intravenous Infusion: 5 mcg/min continuous IV infusion titrated by 5 mcg/min every 3 to 5 minutes based on hemodynamic response',
    ],
    sideEffects: {
      common: ['Throbbing headache', 'Lightheadedness', 'Flushing', 'Dizziness', 'Postural hypotension', 'Paresthesia of oral mucosa'],
      severe: ['Severe hypotension and circulatory collapse', 'Reflex tachycardia and myocardial ischemia', 'Syncope', 'Methemoglobinemia'],
    },
    contraindications: [
      'Concomitant administration with PDE-5 inhibitors (sildenafil, tadalafil, vardenafil) or riociguat',
      'Severe anemia',
      'Increased intracranial pressure or cerebral hemorrhage',
      'Acute circulatory failure, severe hypotension (systolic BP < 90 mmHg), or shock',
    ],
    drugInteractions: {
      major: ['PDE-5 inhibitors (sildenafil, tadalafil, avanafil, vardenafil - fatal hypotension)', 'Soluble guanylyl cyclase stimulators (riociguat)'],
      common: ['Antihypertensive agents, diuretics, and vasodilators (additive hypotensive effect)', 'Alcohol (accentuates orthostasis and dizziness)', 'Ergotamine (nitrates may increase ergot bioavailability and vasospasm)'],
    },
    monitoringParameters: [
      'Blood pressure and heart rate closely during titration and acute administration',
      'Angina relief and frequency of nitroglycerin consumption',
      'Hemoglobin and methemoglobin levels in high-dose continuous infusions',
    ],
    dosageForms: [
      'Sublingual Tablet: 0.3 mg, 0.4 mg, 0.6 mg',
      'Translingual Spray: 0.4 mg/metered spray',
      'Transdermal Patch: 0.1, 0.2, 0.4, 0.6, 0.8 mg/hour',
      'Intravenous Solution: 5 mg/mL, 100 mcg/mL, 200 mcg/mL in 5% Dextrose',
      'Topical Ointment: 2%',
    ],
    administrationAndCounseling: [
      'For sublingual tablets: Sit down before taking to avoid fainting; place tablet under tongue or in buccal pouch and let dissolve; do not swallow or chew.',
      'If chest pain is not relieved or worsens 5 minutes after the first dose, call 911 immediately while taking a second dose.',
      'Keep sublingual tablets in their original amber glass container tightly capped; do not carry in pocket or expose to heat or moisture.',
      'For transdermal patches: Apply to clean, dry, hairless skin of the chest or upper arm; remove after 12 to 14 hours to allow a daily 10- to 12-hour patch-free interval.',
    ],
  },

  Diltiazem: {
    genericName: 'Diltiazem',
    brandNames: [
      'Cardizem',
      'Cardizem CD',
      'Cardizem LA',
      'Cartia XT',
      'Dilt-XR',
      'Diltiazem CD',
      'Maztim LA',
      'Taztia XT',
      'Tiazac',
    ],
    pharmacologicClass: 'Non-Dihydropyridine Calcium Channel Blocker',
    therapeuticClass: 'Calcium Channel Blocker',
    mechanismOfAction:
      'Inhibits influx of extracellular calcium ions across L-type voltage-sensitive calcium channels into cardiac muscle and vascular smooth muscle during depolarization, causing peripheral and coronary arterial vasodilation, negative inotropy, and slowing of SA and AV nodal conduction.',
    dosingRegimens: [
      'Hypertension (Extended-Release): 180 to 240 mg PO once daily; titrate up to 360 to 480 mg once daily if needed',
      'Chronic Stable Angina: 120 to 180 mg PO once daily (extended-release), titrating up to 360 mg once daily (or immediate-release 30 mg 4 times daily)',
      'Atrial Fibrillation / Flutter Rate Control: Initial IV bolus 0.25 mg/kg over 2 minutes; repeat with 0.35 mg/kg if needed; continuous infusion 5 to 15 mg/hour',
    ],
    sideEffects: {
      common: ['Peripheral edema', 'Headache', 'Dizziness', 'Bradycardia', 'First-degree AV block', 'Dyspepsia', 'Asthenia'],
      severe: ['High-degree atrioventricular (AV) block', 'Severe symptomatic bradycardia / sinus arrest', 'Congestive heart failure exacerbation', 'Hepatotoxicity'],
    },
    contraindications: [
      'Sick sinus syndrome or second- or third-degree AV block (except with a functioning ventricular pacemaker)',
      'Severe hypotension (systolic BP < 90 mmHg)',
      'Acute myocardial infarction with pulmonary congestion',
      'Atrial fibrillation or flutter associated with accessory bypass tract (Wolff-Parkinson-White syndrome)',
    ],
    drugInteractions: {
      major: ['Beta-blockers (propranolol, metoprolol, atenolol - additive negative inotropy, bradycardia, and AV nodal depression)', 'CYP3A4 substrates (simvastatin, lovastatin - diltiazem inhibits CYP3A4; cap simvastatin at 10 mg/day)'],
      common: ['Digoxin (diltiazem increases digoxin levels by 20% and adds AV nodal slowing)', 'Cyclosporine, tacrolimus (diltiazem elevates calcineurin inhibitor blood levels)', 'Grapefruit juice'],
    },
    monitoringParameters: [
      'Blood pressure and resting heart rate (apical and radial pulse)',
      'Electrocardiogram (ECG) for PR interval and heart rate during IV titration',
      'Liver function tests and renal function periodically',
      'Signs and symptoms of congestive heart failure and peripheral edema',
    ],
    dosageForms: [
      'Oral Extended-Release Capsule (CD, XT, XR): 120 mg, 180 mg, 240 mg, 300 mg, 360 mg, 420 mg',
      'Oral Extended-Release Tablet (LA): 120 mg, 180 mg, 240 mg, 300 mg, 360 mg, 420 mg',
      'Oral Immediate-Release Tablet: 30 mg, 60 mg, 90 mg, 120 mg',
      'Intravenous Injection: 5 mg/mL (5 mL, 10 mL, 25 mL)',
    ],
    administrationAndCounseling: [
      'Swallow extended-release capsules and tablets whole; do not chew or crush.',
      'Take at approximately the same time every day; Cardizem LA is best taken at bedtime.',
      'Check your pulse and blood pressure regularly; report a slow resting pulse (under 50 bpm) to your doctor.',
      'Avoid drinking large quantities of grapefruit juice while taking this medication.',
    ],
  },
};
