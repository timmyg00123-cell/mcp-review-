import type { TopDrugClinicalMonograph } from './types.js';

export const CAT18_20_ANTIVIRAL_ANXIOLYTIC: Record<string, TopDrugClinicalMonograph> = {
  'Emtricitabine / Tenofovir': {
    genericName: 'Emtricitabine / Tenofovir',
    brandNames: ['Truvada'],
    pharmacologicClass: 'Nucleoside / Nucleotide Reverse Transcriptase Inhibitor',
    therapeuticClass: 'Antiretroviral',
    mechanismOfAction:
      'Dual nucleoside/nucleotide reverse transcriptase inhibitor (NRTI) combination: emtricitabine is converted to its 5\'-triphosphate and tenofovir disoproxil fumarate to tenofovir diphosphate; both compete with natural deoxyribonucleotides, causing termination of nascent viral DNA chain elongation during HIV-1 reverse transcription.',
    dosingRegimens: [
      'HIV-1 Treatment: 1 tablet (200 mg emtricitabine / 300 mg tenofovir DF) PO once daily in combination with other antiretrovirals (adjust interval if CrCl 30-49 mL/min)',
      'HIV-1 Pre-Exposure Prophylaxis (PrEP): 1 tablet PO once daily in individuals at high risk for HIV-1 infection (confirmed HIV-negative prior to initiation and at least every 3 months)',
    ],
    sideEffects: {
      common: ['Nausea', 'Diarrhea', 'Headache', 'Dizziness', 'Fatigue', 'Depression', 'Abnormal dreams', 'Skin hyperpigmentation (palms/soles)'],
      severe: ['Lactic acidosis and severe hepatomegaly with steatosis', 'Severe acute exacerbation of hepatitis B upon discontinuation', 'Renal impairment / Fanconi syndrome', 'Decreased bone mineral density / osteomalacia'],
    },
    contraindications: [
      'Truvada for PrEP is contraindicated in individuals with unknown or positive HIV-1 status',
      'Hypersensitivity to emtricitabine, tenofovir, or any component',
    ],
    drugInteractions: {
      major: ['Nephrotoxic agents (aminoglycosides, high-dose NSAIDs, amphotericin B, vancomycin, acyclovir - additive renal toxicity)', 'Didanosine (tenofovir increases didanosine levels and fatal toxicities; avoid coadministration)', 'Ledipasvir/Sofosbuvir (elevates tenofovir concentrations)'],
      common: ['Atazanavir (tenofovir decreases atazanavir levels; requires ritonavir boosting)', 'Adefovir dipivoxil (avoid coadministration)'],
    },
    monitoringParameters: [
      'HIV-1 screening test immediately before initiating PrEP and at least every 3 months thereafter',
      'Hepatitis B virus (HBV) surface antigen/antibody screening prior to initiation',
      'Estimated creatinine clearance, serum creatinine, urine glucose, and urine protein at baseline and periodically',
      'Bone mineral density (DEXA scan) in patients with history of fracture or osteopenia',
    ],
    dosageForms: ['Oral Tablet: 200 mg emtricitabine / 300 mg tenofovir disoproxil fumarate (also lower-dose pediatric tablets 100/150, 133/200, 167/250 mg)'],
    blackBoxWarning:
      'WARNING: POSTTREATMENT ACUTE EXACERBATION OF HEPATITIS B AND RISK OF DRUG RESISTANCE WITH TRUVADA FOR PREP: Severe acute exacerbations of hepatitis B (HBV) have been reported in HBV-infected patients who have discontinued Truvada. Closely monitor hepatic function with both clinical and laboratory follow-up for at least several months in patients with HBV coinfection. Truvada for PrEP must only be prescribed to individuals confirmed to be HIV-negative immediately prior to initiating and periodically during use to avoid emergence of drug-resistant HIV-1 strains.',
    administrationAndCounseling: [
      'Take once daily with or without food at the same time each day.',
      'For PrEP, strict daily adherence is critical to achieving high protection against HIV infection.',
      'PrEP does not protect against other sexually transmitted infections (syphilis, gonorrhea, chlamydia); use barrier methods.',
      'Do not discontinue Truvada without talking to your prescriber, especially if you have hepatitis B.',
    ],
  },

  Efavirenz: {
    genericName: 'Efavirenz',
    brandNames: ['Sustiva'],
    pharmacologicClass: 'Non-Nucleoside Reverse Transcriptase Inhibitor',
    therapeuticClass: 'Antiretroviral',
    mechanismOfAction:
      'Non-nucleoside reverse transcriptase inhibitor (NNRTI) that binds directly and non-competitively to an allosteric hydrophobic pocket of the HIV-1 reverse transcriptase enzyme, causing a conformational change that disrupts the catalytic site and blocks RNA- and DNA-dependent DNA polymerase activities.',
    dosingRegimens: [
      'HIV-1 Infection: 600 mg PO once daily at bedtime on an empty stomach, in combination with other antiretroviral agents (e.g., tenofovir and emtricitabine)',
    ],
    sideEffects: {
      common: ['Central nervous system symptoms (vivid dreams, nightmares, dizziness, insomnia, impaired concentration)', 'Maculopapular rash', 'Nausea', 'Headache', 'Hypercholesterolemia'],
      severe: ['Severe psychiatric symptoms (severe depression, suicidal ideation, psychosis, paranoia)', 'Severe cutaneous adverse reactions (Stevens-Johnson syndrome, toxic epidermal necrolysis)', 'Hepatotoxicity and hepatic failure', 'QTc prolongation'],
    },
    contraindications: [
      'Severe hypersensitivity to efavirenz',
      'Concurrent administration of drugs highly dependent on CYP3A4 for clearance whose elevated levels cause life-threatening reactions (pimozide, bepridil, midazolam, triazolam, ergot alkaloids)',
      'Concurrent administration of St. John\'s wort or elbasvir/grazoprevir',
    ],
    drugInteractions: {
      major: ['CYP3A4 substrates (protease inhibitors, statins, oral contraceptives - efavirenz induces CYP3A4, reducing their efficacy)', 'QT-prolonging drugs (methadone, macrolides, antiarrhythmics)', 'St. John\'s wort (dramatically lowers efavirenz levels)'],
      common: ['Warfarin (CYP induction/inhibition causes unpredictable INR fluctuations)', 'Voriconazole (efavirenz decreases voriconazole while voriconazole increases efavirenz; avoid coadministration)'],
    },
    monitoringParameters: [
      'Plasma HIV-1 RNA (viral load) and CD4 cell count',
      'Assessment of central nervous system and psychiatric symptoms (depression, suicidality, psychosis)',
      'Liver function tests at baseline and periodically (especially in HBV/HCV coinfection)',
      'Serum lipid panel (total cholesterol, triglycerides) at baseline and periodically',
      'Skin examination for progressive rash and mucosal involvement',
    ],
    dosageForms: ['Oral Capsule: 50 mg, 200 mg', 'Oral Tablet: 600 mg'],
    administrationAndCounseling: [
      'Take once daily at bedtime on an empty stomach (high-fat meals increase absorption by 50% and dramatically increase CNS side effects).',
      'Central nervous system symptoms (dizziness, strange dreams, lightheadedness) are very common during the first 2 to 4 weeks of therapy and usually improve over time; taking at bedtime reduces daytime drowsiness.',
      'Report any signs of severe depression, thoughts of suicide, or unusual changes in mood or behavior immediately.',
      'Women of childbearing potential should use effective barrier contraception combined with other methods throughout therapy.',
    ],
  },

  Raltegravir: {
    genericName: 'Raltegravir',
    brandNames: ['Isentress'],
    pharmacologicClass: 'Integrase Strand Transfer Inhibitor',
    therapeuticClass: 'Antiretroviral',
    mechanismOfAction:
      'Inhibits the catalytic activity of HIV-1 integrase by binding to divalent cations in the enzyme catalytic core, preventing the strand transfer step of viral DNA integration into the human host cell genome.',
    dosingRegimens: [
      'HIV-1 Treatment (Immediate-Release): 400 mg PO twice daily with or without food, in combination with other antiretrovirals',
      'HIV-1 Treatment (Extended-Release Isentress HD): 1,200 mg (two 600 mg tablets) PO once daily with or without food for treatment-naive or virally suppressed patients',
      'Post-Exposure Prophylaxis (PEP): 400 mg PO twice daily for 28 days with tenofovir and emtricitabine',
    ],
    sideEffects: {
      common: ['Headache', 'Nausea', 'Diarrhea', 'Insomnia', 'Fatigue', 'Dizziness', 'Elevated serum creatine kinase (CK)'],
      severe: ['Severe cutaneous adverse reactions (Stevens-Johnson syndrome, TEN, DRESS)', 'Rhabdomyolysis and severe myopathy', 'Severe hepatotoxicity / immune reconstitution syndrome', 'Depression and suicidal ideation'],
    },
    contraindications: [
      'Known hypersensitivity to raltegravir or any component of the formulation',
    ],
    drugInteractions: {
      major: ['Strong UGT1A1 inducers (rifampin - significantly reduces raltegravir plasma concentrations; double raltegravir dose to 800 mg twice daily; do NOT use Isentress HD with rifampin)', 'Metal cation antacids (aluminum/magnesium antacids chelate raltegravir and drastically reduce absorption; coadministration is not recommended)'],
      common: ['Calcium carbonate antacids (may be coadministered with 400 mg twice-daily tablets, but avoid with once-daily Isentress HD)'],
    },
    monitoringParameters: [
      'Plasma HIV-1 RNA viral load and CD4 lymphocyte count',
      'Serum creatine kinase (CK) in patients presenting with muscle weakness, tenderness, or myalgia',
      'Liver function tests and total bilirubin',
      'Dermatologic examination for progressive rash or systemic symptoms',
    ],
    dosageForms: ['Oral Film-Coated Tablet: 400 mg', 'Oral Extended-Release Tablet (Isentress HD): 600 mg', 'Oral Chewable Tablet: 25 mg, 100 mg', 'Oral Suspension Packet: 100 mg'],
    administrationAndCounseling: [
      'Take with or without food; film-coated and extended-release tablets must be swallowed whole.',
      'Do not take aluminum- or magnesium-containing antacids (Mylanta, Maalox) while taking raltegravir.',
      'Report any unexplained muscle pain, tenderness, or weakness, especially if accompanied by fever or dark tea-colored urine.',
      'Notify your doctor immediately if a skin rash develops, particularly if accompanied by fever, blisters, or facial swelling.',
    ],
  },

  Sofosbuvir: {
    genericName: 'Sofosbuvir',
    brandNames: ['Sovaldi'],
    pharmacologicClass: 'NS5B Polymerase Inhibitor',
    therapeuticClass: 'HCV Polymerase Inhibitor',
    mechanismOfAction:
      'Nucleotide prodrug that undergoes intracellular metabolism to form the pharmacologically active uridine analog triphosphate (GS-461203), which is incorporated into HCV viral RNA by the NS5B RNA-dependent RNA polymerase, acting as a non-obligate chain terminator.',
    dosingRegimens: [
      'Chronic Hepatitis C Virus (HCV) Genotypes 1, 2, 3, or 4: 400 mg PO once daily with or without food in combination with other direct-acting antiviral agents (e.g., ribavirin, ledipasvir, or velpatasvir) for 12 to 24 weeks',
    ],
    sideEffects: {
      common: ['Fatigue', 'Headache', 'Nausea', 'Insomnia', 'Anemia (when coadministered with ribavirin)', 'Pruritus', 'Diarrhea'],
      severe: ['Severe symptomatic bradycardia and pacemaker intervention when coadministered with amiodarone', 'Hepatitis B virus (HBV) reactivation leading to fulminant hepatitis, hepatic failure, and death', 'Severe hypersensitivity reactions'],
    },
    contraindications: [
      'When used in combination with ribavirin, all contraindications to ribavirin apply (pregnancy, male partners of pregnant women, severe hemoglobinopathies)',
      'Known hypersensitivity to sofosbuvir',
    ],
    drugInteractions: {
      major: ['Amiodarone (fatal or life-threatening severe bradycardia and heart block; coadministration is strongly contraindicated)', 'P-gp inducers (rifampin, St. John\'s wort, carbamazepine, phenytoin - drastically reduce sofosbuvir plasma concentrations)'],
      common: ['Tipranavir/ritonavir', 'Rosuvastatin (sofosbuvir combinations may increase rosuvastatin concentrations and myopathy risk)'],
    },
    monitoringParameters: [
      'Screen all patients for evidence of current or prior hepatitis B virus (HBV) infection (HBsAg and anti-HBc) prior to initiating therapy',
      'HCV RNA levels at baseline, week 4, end of treatment, and 12 weeks post-treatment (SVR12)',
      'Heart rate and continuous cardiac telemetry if coadministration with amiodarone cannot be avoided',
      'CBC with differential (monitor for hemolytic anemia when ribavirin is co-prescribed)',
    ],
    dosageForms: ['Oral Tablet: 400 mg, 200 mg', 'Oral Pellets in Packet: 200 mg, 100 mg'],
    blackBoxWarning:
      'WARNING: RISK OF HEPATITIS B VIRUS REACTIVATION IN PATIENTS COINFECTED WITH HCV AND HBV: Test all patients for evidence of current or prior hepatitis B virus (HBV) infection before initiating treatment with sofosbuvir. HBV reactivation has been reported in HCV/HBV-coinfected patients who were undergoing or had completed treatment with HCV direct-acting antivirals and were not already receiving HBV antiviral therapy, leading to fulminant hepatitis, hepatic failure, and death.',
    administrationAndCounseling: [
      'Take one tablet once daily with or without food for the full prescribed duration without missing doses.',
      'Never take amiodarone with sofosbuvir due to the risk of life-threatening slowing of your heart rate.',
      'If you take antacids or indigestion medications, verify timing intervals with your pharmacist.',
      'Do not miss doses, as consistent viral suppression is necessary to achieve sustained virologic cure.',
    ],
  },

  Oseltamivir: {
    genericName: 'Oseltamivir',
    brandNames: ['Tamiflu'],
    pharmacologicClass: 'Neuraminidase Inhibitor',
    therapeuticClass: 'Neuraminidase Inhibitor',
    mechanismOfAction:
      'Ethyl ester prodrug whose active metabolite, oseltamivir carboxylate, selectively inhibits influenza virus neuraminidase, preventing the cleavage of terminal sialic acid residues and arresting the release and spread of newly formed virions from infected respiratory epithelial cells.',
    dosingRegimens: [
      'Influenza Treatment (Adults & Adolescents >= 13 years): 75 mg PO twice daily for 5 days; initiate within 48 hours of symptom onset (dose adjust for CrCl <= 60 mL/min)',
      'Influenza Prophylaxis (Post-Exposure): 75 mg PO once daily for at least 10 days; initiate within 48 hours of close contact',
      'Influenza Prophylaxis (Community Outbreak): 75 mg PO once daily for up to 6 weeks',
    ],
    sideEffects: {
      common: ['Nausea', 'Vomiting', 'Headache', 'Abdominal pain', 'Diarrhea', 'Dyspepsia'],
      severe: ['Severe neuropsychiatric events (hallucinations, delirium, confusion, self-injury, abnormal behavior, especially in pediatric patients)', 'Severe cutaneous reactions (Stevens-Johnson syndrome, erythema multiforme)', 'Anaphylaxis'],
    },
    contraindications: [
      'Known severe hypersensitivity to oseltamivir or any component of the formulation',
    ],
    drugInteractions: {
      major: ['Live attenuated influenza intranasal vaccine (FluMist - oseltamivir inhibits viral replication; avoid live vaccine from 48h before until 2 weeks after oseltamivir)'],
      common: ['Probenecid (reduces renal tubular excretion of oseltamivir carboxylate, doubling its AUC)'],
    },
    monitoringParameters: [
      'Clinical signs and resolution of influenza symptoms (fever, chills, myalgias, cough)',
      'Close behavioral monitoring for acute neuropsychiatric signs, agitation, or confusion (especially in children and adolescents)',
      'Renal function (BUN, serum creatinine, CrCl for dose adjustment)',
    ],
    dosageForms: ['Oral Capsule: 30 mg, 45 mg, 75 mg', 'Powder for Oral Suspension: 6 mg/mL (when reconstituted)'],
    administrationAndCounseling: [
      'Take with food or milk to significantly decrease the risk of nausea and stomach upset.',
      'Initiate therapy as soon as possible after symptom onset (ideally within 48 hours) for optimal benefit.',
      'Complete the entire 5-day course even if symptoms resolve earlier.',
      'Parents and caregivers must closely monitor children and adolescents for unusual behaviors, confusion, or hallucinations.',
      'Oseltamivir is not a substitute for an annual influenza vaccination.',
    ],
  },

  Valacyclovir: {
    genericName: 'Valacyclovir',
    brandNames: ['Valtrex', 'Zovirax'],
    pharmacologicClass: 'Guanosine Nucleoside Analog',
    therapeuticClass: 'DNA Polymerase Inhibitor',
    mechanismOfAction:
      'L-valyl ester prodrug of acyclovir; rapidly converted in vivo by hepatic esterases to acyclovir, which is selectively monophosphorylated by viral thymidine kinase and subsequently converted to acyclovir triphosphate, acting as a competitive inhibitor and chain terminator of herpes viral DNA polymerase.',
    dosingRegimens: [
      'Herpes Zoster (Shingles): 1,000 mg PO 3 times daily for 7 days; initiate at earliest sign or symptom (within 72 hours of rash onset)',
      'Genital Herpes (Initial Episode): 1,000 mg PO twice daily for 7 to 10 days',
      'Genital Herpes (Recurrent Episode): 500 mg PO twice daily for 3 days; initiate at earliest symptom',
      'Genital Herpes (Chronic Suppressive Therapy): 1,000 mg PO once daily (or 500 mg once daily in patients with <= 9 recurrences/year)',
      'Herpes Labialis (Cold Sores): 2,000 mg PO twice daily taken 12 hours apart for 1 day',
    ],
    sideEffects: {
      common: ['Headache', 'Nausea', 'Abdominal pain', 'Dizziness', 'Fatigue', 'Vomiting', 'Diarrhea'],
      severe: ['Thrombotic thrombocytopenic purpura / hemolytic uremic syndrome (TTP/HUS in advanced HIV or transplant patients)', 'Acute renal failure (precipitation of acyclovir crystals in renal tubules)', 'Central nervous system toxicity (hallucinations, encephalopathy, confusion, tremors)'],
    },
    contraindications: [
      'Hypersensitivity to valacyclovir, acyclovir, or any formulation components',
    ],
    drugInteractions: {
      major: ['Nephrotoxic drugs (aminoglycosides, amphotericin B, cyclosporine, tacrolimus, NSAIDs - additive renal damage)'],
      common: ['Probenecid and cimetidine (decrease acyclovir renal clearance, increasing plasma concentrations; adjust monitoring in renal impairment)', 'Varicella virus vaccine (antivirals reduce live vaccine efficacy; avoid 24h before to 14 days after vaccine)'],
    },
    monitoringParameters: [
      'Renal function (BUN, serum creatinine, CrCl - dosage reduction mandatory for CrCl < 50 mL/min)',
      'Urinary output and adequate patient hydration status',
      'CBC with differential and platelets in immunocompromised patients (screen for TTP/HUS)',
      'Neurotoxicity monitoring in geriatric patients and those with renal insufficiency',
    ],
    dosageForms: ['Oral Caplet / Tablet: 500 mg, 1,000 mg'],
    administrationAndCounseling: [
      'Take with or without food; maintain generous fluid intake (drink plenty of water) throughout therapy to prevent drug crystals from forming in the kidneys.',
      'Begin taking at the earliest symptom of an outbreak (tingling, itching, or burning) for maximum clinical benefit.',
      'Genital herpes is contagious; avoid sexual intercourse when lesions or prodromal symptoms are present.',
      'Suppressive therapy reduces but does not completely eliminate the risk of viral transmission to sexual partners.',
    ],
  },

  Acyclovir: {
    genericName: 'Acyclovir',
    brandNames: ['Zovirax'],
    pharmacologicClass: 'Guanosine Nucleoside Analog',
    therapeuticClass: 'DNA Polymerase Inhibitor',
    mechanismOfAction:
      'Synthetic purine deoxynucleoside analog that is monophosphorylated by herpes virus-encoded thymidine kinase and subsequently phosphorylated by host cellular kinases to acyclovir triphosphate, which inhibits herpes simplex and varicella zoster viral DNA polymerase by competing with dGTP and incorporating into viral DNA to cause irreversible chain termination.',
    dosingRegimens: [
      'Herpes Simplex Encephalitis: 10 mg/kg IV infused over 1 hour every 8 hours for 14 to 21 days',
      'Herpes Zoster (Shingles): 800 mg PO 5 times daily (every 4 hours while awake) for 7 to 10 days',
      'Genital Herpes (Initial Episode): 200 mg PO 5 times daily or 400 mg PO 3 times daily for 7 to 10 days',
      'Genital Herpes (Suppression): 400 mg PO twice daily for up to 12 months',
      'Varicella (Chickenpox): 20 mg/kg PO 4 times daily (max 800 mg/dose) for 5 days',
    ],
    sideEffects: {
      common: ['Nausea', 'Vomiting', 'Diarrhea', 'Headache', 'Malaise', 'Phlebitis at IV infusion site'],
      severe: ['Crystalline nephropathy and acute tubular necrosis / renal failure', 'Neurotoxicity (agitation, tremors, delirium, myoclonus, seizures, coma)', 'Thrombocytopenic purpura / HUS', 'Anaphylaxis'],
    },
    contraindications: [
      'Hypersensitivity to acyclovir or valacyclovir',
    ],
    drugInteractions: {
      major: ['Nephrotoxic agents (aminoglycosides, vancomycin, amphotericin B, cisplatin, cyclosporine, tacrolimus - dramatically increases risk of acute tubular necrosis)'],
      common: ['Probenecid (reduces acyclovir tubular secretion, prolonging elimination half-life)', 'Varicella and zoster live vaccines (antivirals inhibit vaccine virus replication)'],
    },
    monitoringParameters: [
      'Renal function (BUN, serum creatinine, CrCl) at baseline and during therapy (adjust dosage in renal impairment)',
      'Intake and urine output; ensure vigorous intravenous or oral hydration',
      'Mental status and neurological signs for neurotoxicity',
      'IV injection site inspection for extravasation or phlebitis',
    ],
    dosageForms: [
      'Oral Capsule: 200 mg',
      'Oral Tablet: 400 mg, 800 mg',
      'Oral Suspension: 200 mg/5 mL',
      'Intravenous Injection (Powder or Solution): 50 mg/mL (10 mL, 20 mL vials)',
      'Topical Cream and Ointment: 5%',
    ],
    administrationAndCounseling: [
      'Drink plenty of fluids while taking acyclovir to keep your kidneys hydrated and prevent kidney crystal formation.',
      'IV acyclovir must be infused slowly over at least 1 hour; never administer as a rapid IV bolus.',
      'Take at evenly spaced intervals throughout the waking hours as prescribed.',
      'Acyclovir does not cure herpes infections; it treats acute outbreaks and suppresses flare-ups.',
    ],
  },

  Valganciclovir: {
    genericName: 'Valganciclovir',
    brandNames: ['Valcyte'],
    pharmacologicClass: 'Cytomegalovirus (CMV) Nucleoside Analog',
    therapeuticClass: 'DNA Polymerase Inhibitor',
    mechanismOfAction:
      'L-valyl ester prodrug of ganciclovir; rapidly hydrolyzed by hepatic and intestinal esterases to ganciclovir, which is phosphorylated by viral protein kinase UL97 in CMV-infected cells into ganciclovir triphosphate, competitively inhibiting CMV viral DNA polymerases and causing viral DNA synthesis termination.',
    dosingRegimens: [
      'CMV Retinitis Induction (AIDS Patients): 900 mg PO twice daily with food for 21 days',
      'CMV Retinitis Maintenance: 900 mg PO once daily with food',
      'CMV Prophylaxis in Solid Organ Transplantation: 900 mg PO once daily with food starting within 10 days post-transplant until 100 to 200 days post-transplantation',
    ],
    sideEffects: {
      common: ['Diarrhea', 'Nausea', 'Vomiting', 'Pyrexia', 'Headache', 'Insomnia', 'Peripheral neuropathy', 'Tremor'],
      severe: ['Severe neutropenia / agranulocytosis (ANC < 500/mcL)', 'Severe thrombocytopenia (platelets < 25,000/mcL) and anemia', 'Teratogenicity, embryofetal death, and permanent infertility', 'Potential human carcinogenicity and mutagenicity', 'Acute renal failure'],
    },
    contraindications: [
      'Known hypersensitivity to valganciclovir, ganciclovir, or acyclovir',
      'Absolute neutrophil count (ANC) < 500/mcL or platelet count < 25,000/mcL',
      'Hemoglobin < 8 g/dL',
    ],
    drugInteractions: {
      major: ['Zidovudine (profound additive myelosuppression and severe neutropenia; avoid coadministration if possible)', 'Didanosine (ganciclovir significantly increases didanosine AUC and systemic toxicity)', 'Probenecid (increases ganciclovir levels by 50%)', 'Imipenem-cilastatin (increased seizure frequency)'],
      common: ['Myelosuppressive immunosuppressants (mycophenolate mofetil, azathioprine - additive cytopenias)', 'Nephrotoxic drugs (cyclosporine, tacrolimus, amphotericin B)'],
    },
    monitoringParameters: [
      'Complete blood count (CBC) with differential and platelet count: At baseline, every 2 weeks during induction, and periodically during maintenance',
      'Serum creatinine and calculated CrCl at baseline and frequently (strict dosage reduction required if CrCl < 60 mL/min)',
      'Ophthalmologic examinations regularly in patients treated for CMV retinitis',
      'Pregnancy testing prior to initiation in females of childbearing potential',
    ],
    dosageForms: ['Oral Tablet: 450 mg', 'Powder for Oral Solution: 50 mg/mL (when reconstituted)'],
    blackBoxWarning:
      'WARNING: HEMATOLOGIC TOXICITY, IMPAIRMENT OF FERTILITY, FETAL TOXICITY, MUTAGENESIS AND CARCINOGENESIS: Severe leukopenia, neutropenia, anemia, thrombocytopenia, and bone marrow failure have occurred with valganciclovir. Avoid if ANC < 500/mcL, platelets < 25,000/mcL, or hemoglobin < 8 g/dL. Animal studies indicate aspermatogenesis, impaired female fertility, teratogenesis, and carcinogenicity. Advise effective contraception in females and barrier contraception in males during and after therapy.',
    administrationAndCounseling: [
      'Take with food to maximize oral absorption and systemic bioavailability.',
      'Swallow tablets whole; do not break, divide, or crush tablets due to potential teratogenic and carcinogenic properties (avoid contact with skin or mucous membranes).',
      'Females of reproductive potential must use effective contraception during treatment and for at least 30 days following therapy; males must use barrier contraception for at least 90 days after treatment.',
      'Report any fever, sore throat, unexpected bruising, unusual bleeding, or sudden vision changes immediately.',
    ],
  },

  Lorazepam: {
    genericName: 'Lorazepam',
    brandNames: ['Ativan'],
    pharmacologicClass: 'Intermediate-Acting Benzodiazepine',
    therapeuticClass: 'Benzodiazepine',
    mechanismOfAction:
      'Binds to allosteric benzodiazepine receptor sites on the pentameric GABA-A receptor complex in the central nervous system, enhancing gamma-aminobutyric acid (GABA) binding and increasing chloride channel opening frequency, producing neuronal hyperpolarization, sedation, anxiolysis, and anticonvulsant activity.',
    dosingRegimens: [
      'Anxiety Disorders: 1 to 3 mg PO daily divided into 2 to 3 doses; maintenance 2 to 6 mg/day (largest dose at bedtime)',
      'Insomnia: 2 to 4 mg PO once daily at bedtime',
      'Status Epilepticus: 4 mg IV slowly over 2 minutes (2 mg/min); repeat once after 10 to 15 minutes if seizures persist',
      'Preoperative Sedation: 0.05 mg/kg IM (up to 4 mg) 2 hours before surgery, or 0.044 mg/kg IV 15-20 minutes before surgery',
    ],
    sideEffects: {
      common: ['Sedation / somnolence', 'Dizziness', 'Unsteadiness / ataxia', 'Weakness', 'Confusion', 'Cognitive impairment', 'Hypotension'],
      severe: ['Profound respiratory depression and arrest', 'Severe physical and psychological dependence and addiction', 'Life-threatening benzodiazepine withdrawal syndrome (seizures, delirium tremens upon abrupt cessation)', 'Paradoxical agitation and disinhibition', 'Coma and death (especially when combined with opioids or alcohol)'],
    },
    contraindications: [
      'Severe respiratory insufficiency or sleep apnea syndrome',
      'Acute narrow-angle glaucoma',
      'Known hypersensitivity to lorazepam or benzodiazepines',
      'Comatose states or severe myasthenia gravis',
    ],
    drugInteractions: {
      major: ['Opioid analgesics (profound sedation, respiratory depression, coma, and fatal overdose)', 'Other CNS depressants and alcohol (profound additive central depression)', 'Sodium oxybate (potentiates respiratory depression)'],
      common: ['Valproate (inhibits lorazepam glucuronidation, increasing lorazepam concentrations by up to 100%; decrease lorazepam dose by 50%)', 'Probenecid (doubles lorazepam half-life)', 'Clozapine (severe hypotension, respiratory arrest)'],
    },
    monitoringParameters: [
      'Respiratory rate, oxygen saturation, and level of sedation (especially with IV administration)',
      'Assessment of anxiety severity and signs of abuse, misuse, or diversion',
      'Liver function and renal function in prolonged therapy',
      'CBC and blood pressure periodically',
    ],
    dosageForms: ['Oral Tablet: 0.5 mg, 1 mg, 2 mg', 'Oral Concentrate Solution (Intensol): 2 mg/mL', 'Intravenous / Intramuscular Injection: 2 mg/mL, 4 mg/mL'],
    blackBoxWarning:
      'WARNING: RISKS FROM CONCOMITANT USE WITH OPIOIDS; ABUSE, MISUSE, AND ADDICTION; AND DEPENDENCE AND WITHDRAWAL REACTIONS: Concomitant use of benzodiazepines and opioids may result in profound sedation, respiratory depression, coma, and death. Reserve concomitant prescribing for patients with inadequate alternative treatment options. The use of benzodiazepines exposes users to risks of abuse, misuse, and addiction. Continued use may lead to clinically significant physical dependence; abrupt cessation or rapid dose reduction may cause acute withdrawal reactions, including seizures and death.',
    administrationAndCounseling: [
      'Take exactly as directed; do not increase the dose or take more frequently than prescribed due to addiction and dependence risks.',
      'Do not consume alcohol or take opioid pain relievers while taking lorazepam.',
      'Never stop taking lorazepam abruptly if taken regularly for more than 2 weeks; speak with your doctor to establish a gradual tapering schedule.',
      'Avoid driving or performing hazardous tasks until you know how this medication affects your alertness.',
      'Store in a secure, locked location away from children and guests.',
    ],
  },

  Temazepam: {
    genericName: 'Temazepam',
    brandNames: ['Restoril'],
    pharmacologicClass: 'Intermediate-Acting Benzodiazepine',
    therapeuticClass: 'Benzodiazepine',
    mechanismOfAction:
      'Intermediate-acting 3-hydroxy benzodiazepine that binds to the stereospecific benzodiazepine site on GABA-A chloride ionophore receptors, enhancing the inhibitory actions of GABA to decrease sleep latency and reduce nocturnal awakenings.',
    dosingRegimens: [
      'Short-Term Treatment of Insomnia: 15 mg PO once daily at bedtime; range is 7.5 to 30 mg at bedtime (use 7.5 mg in elderly or debilitated patients)',
    ],
    sideEffects: {
      common: ['Drowsiness', 'Dizziness', 'Lethargy', 'Morning hangover effect', 'Lightheadedness', 'Headache', 'Ataxia'],
      severe: ['Complex sleep behaviors (sleep-driving, sleep-walking, preparing food while asleep without memory of event)', 'Severe respiratory depression', 'Abuse, addiction, and severe physical dependence', 'Severe rebound insomnia upon abrupt withdrawal', 'Paradoxical excitement'],
    },
    contraindications: [
      'Pregnancy (fetal risk, neonatal flaccidity and withdrawal)',
      'Severe respiratory impairment or sleep apnea',
      'Known hypersensitivity to temazepam or other benzodiazepines',
    ],
    drugInteractions: {
      major: ['Opioid pain medications (fentanyl, oxycodone, morphine - black box warning for fatal respiratory arrest)', 'Alcohol and other hypnotic sedatives (profound respiratory and CNS depression)'],
      common: ['Antihistamines and sedating muscle relaxants', 'CYP enzyme inhibitors/inducers have minimal effect as temazepam is cleared primarily by phase II glucuronidation'],
    },
    monitoringParameters: [
      'Sleep quality, latency, and duration (reevaluate if insomnia persists beyond 7 to 10 days)',
      'Daytime alertness and cognitive performance',
      'Screening for complex sleep behaviors and memory blackouts',
      'Assessment of abuse, dependence, and dose escalation',
    ],
    dosageForms: ['Oral Capsule: 7.5 mg, 15 mg, 22.5 mg, 30 mg'],
    blackBoxWarning:
      'WARNING: RISKS FROM CONCOMITANT USE WITH OPIOIDS; ABUSE, MISUSE, AND ADDICTION; AND DEPENDENCE AND WITHDRAWAL REACTIONS: Concomitant use of benzodiazepines and opioids may result in profound sedation, respiratory depression, coma, and death. Use of benzodiazepines exposes users to risks of abuse, misuse, and addiction. Continued use may lead to clinically significant physical dependence; abrupt cessation or rapid dose reduction may cause acute withdrawal reactions, including seizures and death.',
    administrationAndCounseling: [
      'Take 30 minutes before bedtime only when prepared to get a full night of sleep (at least 7 to 8 hours) before needing to be active.',
      'Never drink alcohol or take narcotic medications while taking this drug.',
      'Complex sleep behaviors such as driving, eating, or making phone calls while asleep have occurred; notify your doctor immediately if this happens.',
      'Do not take for longer than 2 to 3 weeks without consulting your physician; stopping abruptly can cause severe rebound insomnia and tremors.',
    ],
  },

  Alprazolam: {
    genericName: 'Alprazolam',
    brandNames: ['Xanax', 'Xanax XR', 'Niravam', 'Alprazolam Intensol'],
    pharmacologicClass: 'Short-Acting Benzodiazepine',
    therapeuticClass: 'Benzodiazepine',
    mechanismOfAction:
      'Potent, short-acting triazolobenzodiazepine that binds with high affinity to GABA-A receptor complex sites, increasing the intrinsic inhibitory action of GABA by opening chloride channels, leading to rapid hyperpolarization and rapid suppression of panic and acute anxiety.',
    dosingRegimens: [
      'Generalized Anxiety Disorder (Immediate-Release): Initial 0.25 to 0.5 mg PO 3 times daily; titrate every 3 to 4 days to max 4 mg/day in divided doses',
      'Panic Disorder (Immediate-Release): Initial 0.5 mg PO 3 times daily; increase by <= 1 mg/day every 3 to 4 days to mean effective dose of 5 to 6 mg/day (some patients require up to 10 mg/day)',
      'Panic Disorder (Extended-Release XR): Initial 0.5 to 1 mg PO once daily in morning; titrate to target 3 to 6 mg once daily',
    ],
    sideEffects: {
      common: ['Drowsiness', 'Sedation', 'Lightheadedness', 'Memory impairment / anterograde amnesia', 'Coordination difficulties', 'Dry mouth', 'Constipation', 'Irritability'],
      severe: ['Severe physical dependence and life-threatening withdrawal syndrome (status epilepticus, delirium upon abrupt cessation)', 'Profound respiratory depression and fatal overdose with opioids/alcohol', 'Addiction and drug diversion', 'Severe rebound anxiety between doses', 'Paradoxical aggression'],
    },
    contraindications: [
      'Concurrent use with potent CYP3A4 inhibitors (ketoconazole, itraconazole)',
      'Acute narrow-angle glaucoma',
      'Known hypersensitivity to alprazolam or benzodiazepines',
    ],
    drugInteractions: {
      major: ['Strong CYP3A4 inhibitors (ketoconazole, itraconazole - dramatically increase alprazolam blood levels; absolute contraindication)', 'Opioid analgesics (fatal respiratory depression, coma, and death)', 'Strong CYP3A inducers (carbamazepine, St. John\'s wort - markedly reduce alprazolam levels)'],
      common: ['Moderate CYP3A4 inhibitors (fluvoxamine, cimetidine, fluoxetine, oral contraceptives - increase alprazolam concentrations)', 'Alcohol and sedatives'],
    },
    monitoringParameters: [
      'Frequency and severity of anxiety and panic symptoms',
      'Signs and symptoms of physical dependence, tolerance, and inter-dose rebound anxiety',
      'Screening for drug misuse, diversion, and dose escalation',
      'Cognitive performance and motor coordination in elderly patients',
    ],
    dosageForms: [
      'Oral Tablet (Immediate-Release): 0.25 mg, 0.5 mg, 1 mg, 2 mg',
      'Oral Extended-Release Tablet (XR): 0.5 mg, 1 mg, 2 mg, 3 mg',
      'Orally Disintegrating Tablet (Niravam): 0.25 mg, 0.5 mg, 1 mg, 2 mg',
      'Oral Concentrate Solution (Intensol): 1 mg/mL',
    ],
    blackBoxWarning:
      'WARNING: RISKS FROM CONCOMITANT USE WITH OPIOIDS; ABUSE, MISUSE, AND ADDICTION; AND DEPENDENCE AND WITHDRAWAL REACTIONS: Concomitant use of benzodiazepines and opioids may result in profound sedation, respiratory depression, coma, and death. Use of benzodiazepines exposes users to risks of abuse, misuse, and addiction. Continued use may lead to clinically significant physical dependence; abrupt cessation or rapid dose reduction may cause acute withdrawal reactions, including seizures and death.',
    administrationAndCounseling: [
      'Take exactly as prescribed; do not increase your dose without medical supervision as dependence develops rapidly.',
      'Swallow extended-release (XR) tablets whole; do not chew, crush, or divide.',
      'Never stop taking alprazolam suddenly; withdrawal seizures and intense panic can occur if stopped without a gradual taper.',
      'Avoid alcohol and do not take with grapefruit juice or prescription antifungals.',
      'Keep medication stored safely in a secure, locked location.',
    ],
  },

  Clonazepam: {
    genericName: 'Clonazepam',
    brandNames: ['Klonopin'],
    pharmacologicClass: 'Long-Acting Benzodiazepine',
    therapeuticClass: 'Benzodiazepine',
    mechanismOfAction:
      'Long-acting chloronitrobenzodiazepine that enhances GABAergic inhibitory neurotransmission by binding allosterically to central GABA-A receptor sites, suppressing spike-and-wave discharge in absence seizures and dampening hyperexcitability in the limbic system to prevent panic attacks.',
    dosingRegimens: [
      'Seizure Disorders: Initial 0.5 mg PO 3 times daily; increase by 0.5 to 1 mg every 3 days until seizures are adequately controlled (max 20 mg/day)',
      'Panic Disorder: Initial 0.25 mg PO twice daily; may increase to target 1 mg/day after 3 days (max 4 mg/day)',
    ],
    sideEffects: {
      common: ['Drowsiness', 'Ataxia / impaired coordination', 'Dizziness', 'Fatigue', 'Behavioral disturbances', 'Depression', 'Upper respiratory tract infection'],
      severe: ['Severe respiratory depression', 'Physical and psychological dependence, addiction, and severe withdrawal reactions (seizures, psychosis)', 'Paradoxical disinhibition and agitation', 'Increased suicidal thoughts or behaviors', 'Severe hepatotoxicity (rare)'],
    },
    contraindications: [
      'Significant liver disease',
      'Acute narrow-angle glaucoma',
      'Known hypersensitivity to clonazepam or benzodiazepines',
    ],
    drugInteractions: {
      major: ['Opioids (fentanyl, morphine, oxycodone - black box warning for fatal respiratory arrest and coma)', 'Other sedating central depressants and alcohol'],
      common: ['CYP3A4 inhibitors (ketoconazole, itraconazole, clarithromycin - increase clonazepam concentrations)', 'CYP3A4 inducers (phenytoin, carbamazepine, phenobarbital - lower clonazepam blood levels by ~30%)'],
    },
    monitoringParameters: [
      'Seizure frequency and duration, or frequency of panic attacks',
      'Periodic CBC and liver function tests during long-term therapy',
      'Assessment of suicidality and depressive mood symptoms',
      'Signs of misuse, abuse, and development of physical dependence',
    ],
    dosageForms: ['Oral Tablet: 0.5 mg, 1 mg, 2 mg', 'Orally Disintegrating Tablet: 0.125 mg, 0.25 mg, 0.5 mg, 1 mg, 2 mg'],
    blackBoxWarning:
      'WARNING: RISKS FROM CONCOMITANT USE WITH OPIOIDS; ABUSE, MISUSE, AND ADDICTION; AND DEPENDENCE AND WITHDRAWAL REACTIONS: Concomitant use of benzodiazepines and opioids may result in profound sedation, respiratory depression, coma, and death. Use of benzodiazepines exposes users to risks of abuse, misuse, and addiction. Continued use may lead to clinically significant physical dependence; abrupt cessation or rapid dose reduction may cause acute withdrawal reactions, including seizures and death.',
    administrationAndCounseling: [
      'Take with water; for orally disintegrating tablets, peel back the blister foil, place tablet on tongue, allow to dissolve, and swallow with saliva.',
      'Do not abruptly discontinue clonazepam; stopping suddenly can trigger severe seizures and withdrawal symptoms.',
      'Do not drink alcohol or take opioid cough or pain medications while taking clonazepam.',
      'Report any worsening depression or thoughts of self-harm to your prescriber immediately.',
    ],
  },

  Diazepam: {
    genericName: 'Diazepam',
    brandNames: ['Valium'],
    pharmacologicClass: 'Long-Acting Benzodiazepine',
    therapeuticClass: 'Benzodiazepine',
    mechanismOfAction:
      'Long-acting 1,4-benzodiazepine that potentiates GABA-mediated synaptic inhibition by allosteric binding to central nervous system GABA-A receptors; metabolizes into long-acting active metabolites (desmethyldiazepam, temazepam, oxazepam) yielding prolonged anxiolytic, anticonvulsant, muscle relaxant, and sedative actions.',
    dosingRegimens: [
      'Anxiety Disorders: 2 to 10 mg PO 2 to 4 times daily depending on symptom severity',
      'Acute Alcohol Withdrawal: 10 mg PO 3 to 4 times during the first 24 hours, reducing to 5 mg 3 to 4 times daily as needed',
      'Skeletal Muscle Spasm: 2 to 10 mg PO 3 to 4 times daily',
      'Status Epilepticus / Severe Recurrent Seizures: Initial 5 to 10 mg IV (repeat at 10- to 15-minute intervals up to 30 mg max); or rectal gel (Diastat) 0.2 to 0.5 mg/kg for home seizure rescue',
    ],
    sideEffects: {
      common: ['Drowsiness', 'Fatigue', 'Muscle weakness', 'Ataxia', 'Lightheadedness', 'Confusion', 'Constipation'],
      severe: ['Severe respiratory depression and respiratory arrest', 'Addiction, abuse, and physical dependence', 'Life-threatening withdrawal reactions (status epilepticus, hallucinations upon abrupt cessation)', 'Hypotension and cardiac arrest (especially with rapid IV injection)', 'Paradoxical rage and excitement'],
    },
    contraindications: [
      'Severe respiratory insufficiency or sleep apnea syndrome',
      'Myasthenia gravis',
      'Severe hepatic insufficiency',
      'Acute narrow-angle glaucoma',
      'Children under 6 months of age',
    ],
    drugInteractions: {
      major: ['Opioids (profound sedation, respiratory depression, coma, and death)', 'Strong CYP2C19 and CYP3A4 inhibitors (omeprazole, cimetidine, ketoconazole - inhibit diazepam clearance and prolong sedation)'],
      common: ['CYP3A4 inducers (rifampin, carbamazepine - increase diazepam clearance)', 'Alcohol and central nervous system depressants', 'Valproate (displaces diazepam from plasma protein binding)'],
    },
    monitoringParameters: [
      'Respiratory rate, heart rate, blood pressure, and airway patency (vital during parenteral administration)',
      'Liver function tests and renal function in prolonged therapy',
      'Signs of abuse, diversion, and physical dependence',
      'Seizure frequency and duration',
    ],
    dosageForms: [
      'Oral Tablet: 2 mg, 5 mg, 10 mg',
      'Oral Solution: 5 mg/5 mL, 5 mg/mL (Intensol)',
      'Intravenous / Intramuscular Injection: 5 mg/mL',
      'Rectal Gel (Diastat AcuDial): 2.5 mg, 10 mg, 20 mg delivery systems',
      'Nasal Spray (Valtoco): 5 mg, 10 mg, 15 mg, 20 mg',
    ],
    blackBoxWarning:
      'WARNING: RISKS FROM CONCOMITANT USE WITH OPIOIDS; ABUSE, MISUSE, AND ADDICTION; AND DEPENDENCE AND WITHDRAWAL REACTIONS: Concomitant use of benzodiazepines and opioids may result in profound sedation, respiratory depression, coma, and death. Use of benzodiazepines exposes users to risks of abuse, misuse, and addiction. Continued use may lead to clinically significant physical dependence; abrupt cessation or rapid dose reduction may cause acute withdrawal reactions, including seizures and death.',
    administrationAndCounseling: [
      'Take with or without food; do not take more than prescribed.',
      'Never inject IV diazepam rapidly; must be given over at least 3 minutes into a large vein to avoid thrombosis or respiratory arrest.',
      'Do not abruptly discontinue after prolonged use; work with your healthcare provider to taper your dose safely.',
      'Avoid alcohol and other sedating medications.',
      'Store in a secure place away from others.',
    ],
  },

  Buspirone: {
    genericName: 'Buspirone',
    brandNames: ['BuSpar'],
    pharmacologicClass: 'Non-Benzodiazepine Anxiolytic (5-HT1A Agonist)',
    therapeuticClass: 'Azaspirodecanedione',
    mechanismOfAction:
      'Azaspirodecanedione anxiolytic that acts as a high-affinity selective partial agonist at central serotonin 5-HT1A presynaptic and postsynaptic receptors, while exerting moderate dopamine D2 receptor antagonism, producing anxiolytic effects without sedation, muscle relaxation, or physical dependence.',
    dosingRegimens: [
      'Generalized Anxiety Disorder (GAD): Initial 7.5 mg PO twice daily (or 5 mg 3 times daily); titrate by 5 mg/day every 2 to 3 days to maintenance 15 to 30 mg/day divided into 2 to 3 doses (max 60 mg/day)',
    ],
    sideEffects: {
      common: ['Dizziness', 'Headache', 'Nausea', 'Somnolence', 'Lightheadedness', 'Nervousness', 'Excitement'],
      severe: ['Serotonin syndrome (when combined with other serotonergic agents)', 'Movement disorders / akathisia / extrapyramidal symptoms (rare, due to weak D2 antagonism)', 'Severe allergic reactions'],
    },
    contraindications: [
      'Known hypersensitivity to buspirone hydrochloride',
      'Concurrent use of monoamine oxidase (MAO) inhibitors or within 14 days of discontinuation (severe hypertensive crisis risk)',
    ],
    drugInteractions: {
      major: ['Monoamine oxidase inhibitors (phenelzine, tranylcypromine, linezolid, IV methylene blue - risk of severe hypertensive reaction)', 'Strong CYP3A4 inhibitors (itraconazole, clarithromycin, erythromycin, ketoconazole - increase buspirone levels up to 13-fold; dose reduction required)', 'Strong CYP3A4 inducers (rifampin, carbamazepine, phenytoin - reduce buspirone levels by 90%)'],
      common: ['Grapefruit juice (significantly increases buspirone plasma concentrations; avoid large quantities)', 'Serotonergic medications (SSRIs, SNRIs, triptans - monitor for serotonin syndrome)'],
    },
    monitoringParameters: [
      'Clinical improvement in anxiety symptoms (inform patients onset of efficacy requires 1 to 4 weeks)',
      'Signs and symptoms of serotonin syndrome (hyperreflexia, tremor, clonus, fever)',
      'Renal and hepatic function (avoid in severe hepatic or renal impairment)',
      'Blood pressure when combined with other psychotropic drugs',
    ],
    dosageForms: ['Oral Tablet: 5 mg, 7.5 mg, 10 mg, 15 mg, 30 mg (scored multi-groove tablets)'],
    administrationAndCounseling: [
      'Take consistently either always with food or always without food, as food significantly alters bioavailability.',
      'Buspirone must be taken daily on a scheduled basis; it does not work as a PRN (as-needed) medication for acute panic or anxiety.',
      'Full therapeutic benefit typically takes 2 to 4 weeks to develop.',
      'Does not cause addiction, physical dependence, or withdrawal symptoms upon discontinuation.',
      'Avoid drinking large amounts of grapefruit juice while taking buspirone.',
    ],
  },
};
