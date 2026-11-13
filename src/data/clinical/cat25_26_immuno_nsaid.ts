import type { TopDrugClinicalMonograph } from './types.js';

export const CAT25_26_IMMUNO_NSAID: Record<string, TopDrugClinicalMonograph> = {
  Prednisone: {
    genericName: 'Prednisone',
    brandNames: ['Deltasone'],
    pharmacologicClass: 'Systemic Corticosteroid',
    therapeuticClass: 'Corticosteroid',
    mechanismOfAction:
      'Synthetic glucocorticoid prodrug rapidly converted by hepatic 11-beta-hydroxysteroid dehydrogenase into active prednisolone, which binds to intracellular glucocorticoid receptors, translocating to the nucleus to suppress pro-inflammatory cytokines (IL-1, IL-2, IL-6, TNF-alpha), inhibit phospholipase A2 via lipocortin induction, and stabilize lysosomal membranes.',
    dosingRegimens: [
      'Anti-inflammatory / Immunosuppression: Initial 5 to 60 mg PO once daily (or divided doses) depending on disease severity; titrate down to lowest effective maintenance dose or taper gradually',
      'Acute Asthma / COPD Exacerbation: 40 to 60 mg PO once daily for 5 to 7 days',
      'Rheumatoid Arthritis / Lupus: 5 to 10 mg PO once daily in morning for low-dose maintenance; up to 1 mg/kg/day for acute flare',
    ],
    sideEffects: {
      common: ['Increased appetite and weight gain', 'Insomnia', 'Fluid retention / edema', 'Hypertension', 'Hyperglycemia', 'Mood changes / irritability', 'Dyspepsia', 'Facial rounding (cushingoid moon face)'],
      severe: ['Hypothalamic-Pituitary-Adrenal (HPA) axis suppression and acute adrenal insufficiency upon abrupt cessation', 'Severe opportunistic infections and sepsis', 'Osteoporosis and pathological bone fractures', 'Peptic ulceration with gastrointestinal perforation', 'Ophthalmic complications (cataracts, glaucoma)', 'Aseptic necrosis of femoral/humeral heads', 'Steroid-induced psychosis'],
    },
    contraindications: [
      'Systemic fungal infections',
      'Administration of live or live-attenuated vaccines while receiving immunosuppressive doses',
      'Known hypersensitivity to prednisone',
    ],
    drugInteractions: {
      major: ['NSAIDs and aspirin (synergistic increase in peptic ulceration and gastrointestinal bleeding)', 'Live virus vaccines (disseminated vaccine infection risk)', 'Potassium-depleting diuretics (furosemide, hydrochlorothiazide - severe hypokalemia)'],
      common: ['Antidiabetic agents (corticosteroids antagonize glycemic control, elevating blood glucose)', 'CYP3A4 inducers (phenytoin, carbamazepine, rifampin - accelerate prednisone clearance)', 'Fluoroquinolones (markedly increased tendon rupture risk)'],
    },
    monitoringParameters: [
      'Blood glucose and HbA1c (especially in diabetic patients)',
      'Blood pressure and body weight routinely',
      'Serum electrolytes (potassium, sodium) and calcium',
      'Bone mineral density (DEXA scan) in long-term therapy (> 3 months)',
      'Ophthalmic examination (intraocular pressure, slit lamp for cataracts) with chronic use',
      'Signs of infection (fever, chills, persistent sore throat)',
    ],
    dosageForms: ['Oral Tablet: 1 mg, 2.5 mg, 5 mg, 10 mg, 20 mg, 50 mg', 'Oral Solution: 5 mg/5 mL, 5 mg/mL (Intensol)'],
    administrationAndCounseling: [
      'Take in the morning with breakfast or food to reduce stomach irritation and align with the body\'s natural cortisol circadian rhythm.',
      'NEVER stop taking prednisone suddenly if taken for more than 2 weeks; your dose must be tapered down slowly to allow your adrenal glands to recover.',
      'Report any fever, persistent cough, burning with urination, or other signs of infection immediately.',
      'Take calcium (1,200 mg/day) and vitamin D supplements if prescribed for long-term bone protection.',
    ],
  },

  'Prednisolone Oral': {
    genericName: 'Prednisolone Oral',
    brandNames: ['Millipred', 'Prelone'],
    pharmacologicClass: 'Systemic Corticosteroid',
    therapeuticClass: 'Corticosteroid',
    mechanismOfAction:
      'Active 11-hydroxy metabolite of prednisone that binds directly to cytosolic glucocorticoid receptors without requiring hepatic bioactivation, dampening inflammatory cell migration, capillary dilation, and transcription of inflammatory cytokines and chemokines.',
    dosingRegimens: [
      'Pediatric Acute Asthma Exacerbation: 1 to 2 mg/kg/day PO (max 60 mg/day) divided once or twice daily for 3 to 5 days',
      'Adult Anti-inflammatory / Immunosuppression: 5 to 60 mg PO once daily in morning with food; taper once controlled',
    ],
    sideEffects: {
      common: ['Increased appetite', 'Hyperglycemia', 'Mood changes / emotional lability', 'Insomnia', 'Facial swelling', 'Gastrointestinal upset'],
      severe: ['Adrenal crisis upon abrupt cessation', 'Severe growth impairment in pediatric patients', 'Immune suppression and opportunistic infections', 'Osteoporosis', 'Cataracts and glaucoma', 'Peptic ulceration'],
    },
    contraindications: [
      'Untreated systemic fungal or viral infections',
      'Live or live-attenuated vaccines during immunosuppressive doses',
      'Known hypersensitivity to prednisolone',
    ],
    drugInteractions: {
      major: ['NSAIDs (synergistic gastrointestinal ulceration hazard)', 'Live attenuated vaccines (infection risk)', 'Loop and thiazide diuretics (severe hypokalemia)'],
      common: ['Antidiabetic medications (increased blood glucose)', 'CYP3A4 inducers (rifampin, carbamazepine, phenytoin - reduce prednisolone levels)', 'Warfarin (variable alteration in prothrombin time)'],
    },
    monitoringParameters: [
      'Pediatric growth velocity and height/weight curves',
      'Blood glucose and blood pressure',
      'Signs and symptoms of infection',
      'Serum electrolytes (potassium)',
      'Ophthalmic exams in chronic therapy',
    ],
    dosageForms: ['Oral Solution: 15 mg/5 mL, 5 mg/5 mL', 'Oral Disintegrating Tablet (Orapred ODT): 10 mg, 15 mg, 30 mg', 'Oral Tablet: 5 mg'],
    administrationAndCounseling: [
      'Take in the morning with food or milk to prevent stomach upset.',
      'For oral disintegrating tablets (ODT): Place on tongue, allow to dissolve completely, and swallow with or without water.',
      'Do not abruptly discontinue; taper dose as directed by your physician.',
      'Monitor children on long-term therapy for normal linear growth.',
    ],
  },

  Methylprednisolone: {
    genericName: 'Methylprednisolone',
    brandNames: ['Medrol'],
    pharmacologicClass: 'Systemic Corticosteroid',
    therapeuticClass: 'Corticosteroid',
    mechanismOfAction:
      'Intermediate-acting synthetic glucocorticoid with 5 times higher glucocorticoid anti-inflammatory potency than hydrocortisone and virtually no mineralocorticoid (sodium-retaining) activity, inhibiting leukocyte infiltration, suppressing humoral and cell-mediated immune responses, and blocking arachidonic acid cascade mediators.',
    dosingRegimens: [
      'Medrol Dosepak (Acute Allergic / Inflammatory Flare): Tapered 6-day oral regimen (Day 1: 24 mg; Day 2: 20 mg; Day 3: 16 mg; Day 4: 12 mg; Day 5: 8 mg; Day 6: 4 mg)',
      'Systemic Anti-inflammatory Maintenance: 4 to 48 mg PO once daily in morning with food',
      'High-Dose Pulse Therapy (Severe Lupus Nephritis, MS Flare / Solu-Medrol): 500 to 1,000 mg IV daily over 1 hour for 3 to 5 days',
    ],
    sideEffects: {
      common: ['Dyspepsia', 'Increased appetite', 'Insomnia', 'Nervousness', 'Elevated blood glucose', 'Water retention / mild edema', 'Headache'],
      severe: ['Acute adrenal insufficiency with rapid withdrawal', 'Severe immunosuppression and opportunistic infections', 'Osteonecrosis (avascular necrosis of femoral head)', 'Psychiatric disturbances (mania, severe depression, hallucinations)', 'Tendon rupture (especially Achilles tendon with fluoroquinolones)', 'Peptic ulcer with hemorrhage'],
    },
    contraindications: [
      'Systemic fungal infections',
      'Intrathecal administration (preservative toxicity)',
      'Live virus vaccines during high-dose therapy',
      'Known hypersensitivity to methylprednisolone',
    ],
    drugInteractions: {
      major: ['NSAIDs and aspirin (high ulceration and GI bleeding hazard)', 'Live attenuated vaccines (disseminated infection risk)', 'Potassium-depleting diuretics (hypokalemia)'],
      common: ['Strong CYP3A4 inhibitors (ketoconazole, clarithromycin - inhibit methylprednisolone clearance, increasing toxicity)', 'Antidiabetic agents (glycemic elevation)', 'Fluoroquinolones (tendon rupture)'],
    },
    monitoringParameters: [
      'Blood pressure and body weight',
      'Blood glucose at baseline and periodically',
      'Serum electrolytes (potassium, calcium)',
      'Bone mineral density in prolonged therapy',
      'Infection surveillance and mental status',
    ],
    dosageForms: [
      'Oral Tablet: 2 mg, 4 mg, 8 mg, 16 mg, 32 mg',
      'Oral Dosepak (Unit-of-use blister pack): 21 tablets of 4 mg',
      'Intravenous / Intramuscular Injection (Solu-Medrol Sodium Succinate): 40 mg, 125 mg, 500 mg, 1,000 mg, 2,000 mg vials',
      'Depot Intramuscular Injection (Depo-Medrol Acetate): 20 mg/mL, 40 mg/mL, 80 mg/mL',
    ],
    administrationAndCounseling: [
      'Take with meals or milk to avoid gastrointestinal upset.',
      'For Medrol Dosepak: Take tablets strictly according to the calendar packaging instructions; do not skip doses.',
      'Take morning doses before 9:00 AM to mirror natural body hormone rhythms.',
      'Do not stop taking this medication abruptly without consulting your physician.',
    ],
  },

  Etanercept: {
    genericName: 'Etanercept',
    brandNames: ['Enbrel'],
    pharmacologicClass: 'TNF-Alpha Inhibitor Fusion Protein',
    therapeuticClass: 'Biologic DMARD',
    mechanismOfAction:
      'Dimeric soluble recombinant fusion protein consisting of the extracellular ligand-binding domain of human 75 kDa (p75) tumor necrosis factor receptor linked to the Fc portion of human IgG1, competitively binding and neutralizing soluble and membrane-bound TNF-alpha and TNF-beta (lymphotoxin), blunting downstream inflammatory signaling.',
    dosingRegimens: [
      'Rheumatoid Arthritis, Psoriatic Arthritis, Ankylosing Spondylitis: 50 mg SC once weekly (or 25 mg SC twice weekly 72-96 hours apart)',
      'Plaque Psoriasis: Initial 50 mg SC twice weekly for 3 months, followed by maintenance 50 mg SC once weekly',
      'Polyarticular Juvenile Idiopathic Arthritis (>= 2 years of age): 0.8 mg/kg SC once weekly (max 50 mg/week)',
    ],
    sideEffects: {
      common: ['Injection site reactions (erythema, itching, pain, swelling)', 'Upper respiratory tract infections', 'Headache', 'Rhinitis', 'Nausea'],
      severe: ['Severe, life-threatening infections (tuberculosis, invasive fungal, opportunistic pathogens)', 'Malignancies (lymphomas, non-melanoma skin cancer)', 'Demyelinating disease / multiple sclerosis exacerbation', 'Congestive heart failure new-onset or worsening', 'Pancytopenia / aplastic anemia', 'Reactivation of hepatitis B virus'],
    },
    contraindications: [
      'Active severe sepsis or active systemic infection',
      'Known hypersensitivity to etanercept or any components',
    ],
    drugInteractions: {
      major: ['Anakinra (concurrent IL-1 receptor antagonist use produces 7% rate of serious infections and neutropenia with no added clinical benefit; avoid combination)', 'Abatacept (increased rate of serious infections without added efficacy; avoid combination)', 'Live vaccines (avoid concurrent administration)'],
      common: ['Methotrexate (well tolerated and commonly combined synergistically without adverse pharmacokinetic interaction)', 'Sulfasalazine (minor drop in leukocyte counts)'],
    },
    monitoringParameters: [
      'Tuberculosis screening (Tuberculin skin test or IGRA QuantiFERON) prior to therapy and annually',
      'Hepatitis B virus screening (HBsAg and anti-HBc) prior to initiation',
      'Complete blood count (CBC) with differential periodically (monitor for cytopenias)',
      'Signs and symptoms of active infection (fever, chills, persistent cough, weight loss)',
      'Signs of heart failure or demyelinating neurologic symptoms (paresthesias, visual changes)',
    ],
    dosageForms: ['Subcutaneous Injection Prefilled Syringe / SureClick Autoinjector: 25 mg/0.5 mL, 50 mg/1 mL', 'Subcutaneous Injection Multi-Use Cartridge for AutoTouch: 50 mg/1 mL', 'Lyophilized Powder for Reconstitution: 25 mg vial'],
    blackBoxWarning:
      'WARNING: SERIOUS INFECTIONS AND MALIGNANCIES: Patients treated with Enbrel are at an increased risk for developing serious infections that may lead to hospitalization or death, including tuberculosis, bacterial sepsis, invasive fungal infections (histoplasmosis, coccidioidomycosis), and opportunistic infections. Test for latent TB prior to use. Lymphoma and other malignancies, some fatal, have been reported in children and adolescent patients treated with TNF blockers.',
    administrationAndCounseling: [
      'Administer by subcutaneous injection into the front of the middle thighs, abdomen (avoiding 2 inches around navel), or outer upper arm.',
      'Rotate injection sites with each dose; never inject into skin that is tender, bruised, red, or hard.',
      'Remove from refrigerator and allow to reach room temperature for 15 to 30 minutes before injecting; do not warm in microwave or hot water.',
      'Withhold dose and contact your doctor immediately if you develop a fever, chills, persistent cough, or other signs of infection.',
      'Ensure all age-appropriate vaccinations are up-to-date prior to starting therapy; avoid live vaccines while on etanercept.',
    ],
  },

  Methotrexate: {
    genericName: 'Methotrexate',
    brandNames: ['Trexall', 'Rheumatrex', 'Otrexup'],
    pharmacologicClass: 'Antifolate Antimetabolite',
    therapeuticClass: 'Antimetabolite / DMARD',
    mechanismOfAction:
      'Inhibits dihydrofolate reductase (DHFR), preventing conversion of dihydrofolate to tetrahydrofolate required for purine and thymidylate synthesis, arresting DNA and RNA replication; in inflammatory diseases, inhibits aminoimidazolecarboxamide ribonucleotide (AICAR) transformylase, leading to extracellular adenosine accumulation that exerts potent anti-inflammatory effects.',
    dosingRegimens: [
      'Rheumatoid Arthritis: Initial 7.5 to 15 mg PO once WEEKLY (or 7.5 mg SC/IM once WEEKLY); titrate by 2.5 to 5 mg/week to target 15 to 25 mg PO once WEEKLY (co-prescribe folic acid 1 mg PO daily)',
      'Severe Plaque Psoriasis: 10 to 25 mg PO once WEEKLY as a single dose or divided into 3 doses taken over 24 hours',
      'Oncology / Osteosarcoma: High-dose intravenous regimens (up to 12 g/m2 IV) with mandatory leucovorin calcium rescue',
    ],
    sideEffects: {
      common: ['Nausea and vomiting', 'Abdominal distress', 'Ulcerative stomatitis / oral mucositis', 'Alopecia', 'Elevated transaminases (AST/ALT)', 'Fatigue', 'Headache'],
      severe: ['Bone marrow suppression and severe cytopenias (leukopenia, thrombocytopenia, anemia)', 'Severe hepatotoxicity, fibrosis, and cirrhosis', 'Opportunistic infections and sepsis', 'Fetal death and severe congenital malformations (potent teratogen)', 'Pneumonitis and pulmonary fibrosis (hypersensitivity lung disease)', 'Severe cutaneous adverse reactions (toxic epidermal necrolysis, SJS)', 'Acute renal failure (with high-dose regimens)', 'Malignant lymphomas'],
    },
    contraindications: [
      'Pregnancy and nursing mothers (contraindicated for RA/psoriasis due to fetal death and teratogenicity)',
      'Alcoholism, alcoholic liver disease, or chronic chronic liver disease',
      'Pre-existing blood dyscrasias (bone marrow hypoplasia, leukopenia, thrombocytopenia, significant anemia)',
      'Immunodeficiency syndromes',
      'Hypersensitivity to methotrexate',
    ],
    drugInteractions: {
      major: ['NSAIDs and salicylates (inhibit renal tubular secretion of methotrexate and displace from plasma proteins, markedly elevating free methotrexate levels and bone marrow toxicity; avoid with moderate-to-high doses)', 'Trimethoprim / Sulfamethoxazole (additive antifolate antagonism producing severe megaloblastic pancytopenia)', 'Probenecid and penicillins (impair renal methotrexate excretion)'],
      common: ['Proton pump inhibitors (delay methotrexate renal elimination)', 'Hepatotoxic drugs (leflunomide, ethanol - additive liver injury)', 'Oral antibiotics (alter gut flora and enterohepatic recirculation)'],
    },
    monitoringParameters: [
      'Complete blood count (CBC) with differential and platelet counts: Baseline, monthly for first 3-6 months, then every 2 to 3 months',
      'Liver function tests (AST, ALT, total bilirubin, albumin): Baseline and every 1 to 2 months',
      'Renal function tests (BUN, serum creatinine, CrCl) at baseline and periodically',
      'Chest X-ray at baseline and pulmonary function evaluation for persistent cough or dyspnea',
      'Pregnancy test immediately before initiating in females of reproductive potential',
    ],
    dosageForms: [
      'Oral Tablet: 2.5 mg, 5 mg, 7.5 mg, 10 mg, 15 mg',
      'Subcutaneous Autoinjector (Otrexup, Rasuvo): 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25 mg/dose',
      'Preservative-Free Injection Solution: 25 mg/mL (2 mL, 4 mL, 8 mL, 20 mL, 40 mL)',
    ],
    blackBoxWarning:
      'WARNING: BONE MARROW SUPPRESSION, HEPATOTOXICITY, PULMONARY TOXICITY, FETAL DEATH AND CONGENITAL ABNORMALITIES: Methotrexate should be used only by physicians whose knowledge and experience include the use of antimetabolite therapy. Methotrexate can cause serious adverse reactions including bone marrow suppression, severe hepatotoxicity, liver cirrhosis, opportunistic infections, and hypersensitivity pneumonitis leading to death. Methotrexate can cause fetal death or congenital abnormalities; it is contraindicated in pregnancy. Close monitoring of CBC, hepatic, and renal function is mandatory. Fatal toxicities have occurred from accidental daily administration of weekly oral regimens.',
    administrationAndCounseling: [
      'CRITICAL: For rheumatoid arthritis and psoriasis, methotrexate must be taken ONCE WEEKLY on the same day each week, NEVER taken daily. Daily use for arthritis causes fatal bone marrow toxicity.',
      'Take folic acid (1 mg daily) as prescribed by your doctor to reduce nausea, mouth sores, and liver side effects.',
      'Females must use highly effective contraception during treatment and for at least 1 full ovulatory cycle after stopping; males must use effective contraception for at least 3 months after stopping.',
      'Avoid all alcohol consumption due to the severe risk of liver damage.',
      'Report any fever, mouth ulcers, persistent dry cough, shortness of breath, or unusual bleeding immediately.',
    ],
  },

  Cyclosporine: {
    genericName: 'Cyclosporine',
    brandNames: ['Sandimmune', 'Restasis', 'Neoral', 'Gengraf'],
    pharmacologicClass: 'Calcineurin Inhibitor',
    therapeuticClass: 'Calcineurin Inhibitor',
    mechanismOfAction:
      'Immunosuppressive cyclic polypeptide that binds to intracellular cyclophilin, forming a complex that competitively inhibits calcineurin phosphatase, preventing dephosphorylation and nuclear translocation of nuclear factor of activated T cells (NFAT), blocking interleukin-2 (IL-2) gene transcription and T-lymphocyte activation.',
    dosingRegimens: [
      'Solid Organ Transplantation (Kidney, Liver, Heart): Initial 8 to 12 mg/kg/day PO divided every 12 hours (microemulsion Neoral/Gengraf), titrated to specific whole blood trough levels (100 to 400 ng/mL depending on organ and post-transplant interval)',
      'Severe Rheumatoid Arthritis: Initial 2.5 mg/kg/day PO divided twice daily; titrate by 0.5 to 0.75 mg/kg/day (max 4 mg/kg/day)',
      'Severe Plaque Psoriasis: 2.5 mg/kg/day PO divided twice daily for up to 1 year',
      'Chronic Dry Eye Disease (Restasis): 1 drop ophthalmic emulsion in each eye twice daily (approximately 12 hours apart)',
    ],
    sideEffects: {
      common: ['Hypertension', 'Renal dysfunction / elevated creatinine', 'Tremor', 'Hirsutism / hypertrichosis', 'Gingival hyperplasia', 'Headache', 'Hyperlipidemia', 'Hypomagnesemia', 'Hyperkalemia'],
      severe: ['Severe acute and chronic nephrotoxicity (tubulointerstitial fibrosis)', 'Severe opportunistic infections', 'Lymphomas and squamous cell skin cancers', 'Neurotoxicity / posterior reversible encephalopathy syndrome (PRES)', 'Thrombotic microangiopathy / HUS', 'Hepatotoxicity'],
    },
    contraindications: [
      'Rheumatoid arthritis or psoriasis patients with abnormal renal function, uncontrolled hypertension, or malignancies',
      'Concurrent PUVA or UVB phototherapy in psoriasis patients (synergistic cutaneous malignancy risk)',
      'Known hypersensitivity to cyclosporine or polyoxyethylated castor oil (IV formulation)',
    ],
    drugInteractions: {
      major: ['Nephrotoxic drugs (aminoglycosides, amphotericin B, vancomycin, NSAIDs, tacrolimus - severe additive kidney injury)', 'Strong CYP3A4 and P-gp inhibitors (ketoconazole, itraconazole, clarithromycin, diltiazem, verapamil - dramatically elevate cyclosporine levels)', 'Strong CYP3A4 inducers (rifampin, St. John\'s wort, carbamazepine, phenytoin - drastically lower cyclosporine levels, triggering organ rejection)'],
      common: ['Potassium-sparing diuretics and ACE inhibitors (additive severe hyperkalemia)', 'Statins (cyclosporine elevates statin levels; severe rhabdomyolysis risk)', 'Grapefruit juice (inhibits gut CYP3A4, raising levels)'],
    },
    monitoringParameters: [
      'Whole blood cyclosporine trough concentrations (drawn 12 hours post-dose immediately prior to morning dose): Target ranges vary by protocol and time post-transplant',
      'Renal function (serum creatinine, BUN): Monitor closely; serum creatinine increase >= 30% above baseline warrants dose reduction',
      'Blood pressure at every visit',
      'Serum electrolytes (potassium, magnesium) and uric acid',
      'Liver enzymes and lipid panel periodically',
      'Dermatologic examination for premalignant skin lesions',
    ],
    dosageForms: [
      'Oral Modified Capsule (Neoral, Gengraf - microemulsion): 25 mg, 100 mg',
      'Oral Modified Solution (Neoral): 100 mg/mL',
      'Oral Non-Modified Capsule (Sandimmune): 25 mg, 100 mg',
      'Intravenous Injection: 50 mg/mL (contains Cremophor EL)',
      'Ophthalmic Emulsion (Restasis): 0.05% single-use vials',
    ],
    blackBoxWarning:
      'WARNING: IMMUNOSUPPRESSION, INFECTIONS, MALIGNANCY, AND NEPHROTOXICITY: Increased susceptibility to infection and the possible development of lymphoma and other malignancies, particularly of the skin, may result from immunosuppression. Only physicians experienced in immunosuppressive therapy and management of organ transplant patients should use cyclosporine. Cyclosporine can cause severe acute and chronic nephrotoxicity and hypertension. Microemulsion formulations (Neoral, Gengraf) have increased bioavailability compared to Sandimmune and are not bioequivalent without therapeutic drug monitoring.',
    administrationAndCounseling: [
      'Take at the exact same times every day (12 hours apart) consistently with or without food.',
      'Neoral and Gengraf are modified (microemulsion) formulations and cannot be interchanged with Sandimmune without medical supervision and blood level monitoring.',
      'Avoid grapefruit and grapefruit juice completely.',
      'Maintain meticulous dental hygiene (brushing, flossing) to minimize gum swelling (gingival hyperplasia).',
      'For Restasis eye drops: Invert vial several times to mix emulsion; discard single-use vial immediately after dosing both eyes.',
    ],
  },

  Adalimumab: {
    genericName: 'Adalimumab',
    brandNames: ['Humira'],
    pharmacologicClass: 'Anti-TNF-Alpha Monoclonal Antibody',
    therapeuticClass: 'Biologic DMARD',
    mechanismOfAction:
      'Recombinant human IgG1 monoclonal antibody that binds specifically to soluble and transmembrane tumor necrosis factor-alpha (TNF-alpha), preventing binding to p55 and p75 cell surface TNF receptors, thereby blocking downstream pro-inflammatory cytokine release (IL-1, IL-6), leukocyte adhesion molecule expression, and synovial joint destruction.',
    dosingRegimens: [
      'Rheumatoid Arthritis, Psoriatic Arthritis, Ankylosing Spondylitis: 40 mg SC every other week (may increase to 40 mg weekly in RA patients not receiving methotrexate)',
      'Crohn Disease / Ulcerative Colitis: Day 1: 160 mg SC (as four 40 mg injections in one day or two 40 mg injections per day for two days); Day 15: 80 mg SC; Day 29: maintenance 40 mg SC every other week',
      'Plaque Psoriasis: Initial 80 mg SC, followed by 40 mg SC every other week starting one week after initial dose',
      'Hidradenitis Suppurativa: Day 1: 160 mg SC; Day 15: 80 mg SC; Day 29 onwards: 40 mg weekly or 80 mg every other week',
    ],
    sideEffects: {
      common: ['Injection site reactions (pain, redness, swelling, itching)', 'Upper respiratory tract infections and sinusitis', 'Headache', 'Rash', 'Nausea', 'Positive antinuclear antibodies (ANA)'],
      severe: ['Serious opportunistic infections (tuberculosis, disseminated fungal infections, bacterial sepsis)', 'Malignancies (lymphoma, non-melanoma skin cancer, fatal hepatosplenic T-cell lymphoma)', 'Demyelinating disease (multiple sclerosis, optic neuritis)', 'Reactivation of hepatitis B virus', 'Congestive heart failure exacerbation', 'Lupus-like syndrome', 'Pancytopenia'],
    },
    contraindications: [
      'Active severe infections or sepsis',
      'Known severe hypersensitivity to adalimumab or formulation components',
    ],
    drugInteractions: {
      major: ['Anakinra and Abatacept (increased risk of serious infections and neutropenia without clinical benefit; avoid combination)', 'Live virus vaccines (disseminated vaccine-associated infections; avoid live vaccines during therapy)'],
      common: ['Methotrexate (reduces adalimumab clearance and inhibits anti-adalimumab neutralizing antibody formation; advantageous combination)'],
    },
    monitoringParameters: [
      'Screening for latent tuberculosis (PPD or QuantiFERON gold) prior to initiation and annually during treatment',
      'Hepatitis B virus panel (HBsAg, anti-HBc) prior to therapy',
      'Signs and symptoms of active infection (fever, chills, persistent productive cough, skin infections)',
      'Complete blood count (CBC) with differential periodically',
      'Skin examination for non-melanoma skin cancers',
    ],
    dosageForms: ['Subcutaneous Injection Prefilled Pen / Syringe: 10 mg/0.1 mL, 20 mg/0.2 mL, 40 mg/0.4 mL, 40 mg/0.8 mL, 80 mg/0.8 mL'],
    blackBoxWarning:
      'WARNING: SERIOUS INFECTIONS AND MALIGNANCIES: Patients treated with Humira are at increased risk for developing serious infections that may lead to hospitalization or death, including tuberculosis, invasive fungal infections (histoplasmosis, coccidioidomycosis), and bacterial or opportunistic infections. Test for latent TB prior to use. Lymphoma and other malignancies, some fatal, have been reported in children and adolescent patients treated with TNF blockers. Postmarketing cases of hepatosplenic T-cell lymphoma (HSTCL), a rare fatal type of T-cell lymphoma, have occurred, predominantly in young male patients with Crohn disease or ulcerative colitis treated with TNF blockers and thiopurines.',
    administrationAndCounseling: [
      'Administer by subcutaneous injection into the front of the thighs or lower abdomen (avoiding a 2-inch circle around the belly button).',
      'Rotate injection sites with each dose; never inject into skin that is bruised, tender, red, or hard.',
      'Allow the pen or prefilled syringe to sit at room temperature for 15 to 30 minutes before injecting; do not shake.',
      'Stop taking adalimumab and notify your doctor immediately if you develop any signs of infection (fever, sweating, chills, cough, burning when urinating).',
      'Ensure all vaccinations are up-to-date before beginning therapy; avoid live vaccines while taking this medicine.',
    ],
  },

  Denosumab: {
    genericName: 'Denosumab',
    brandNames: ['Prolia', 'Xgeva'],
    pharmacologicClass: 'RANK Ligand Inhibitor Monoclonal Antibody',
    therapeuticClass: 'RANKL Inhibitor',
    mechanismOfAction:
      'Fully human IgG2 monoclonal antibody that binds with high affinity and specificity to receptor activator of nuclear factor-kappa B ligand (RANKL), preventing RANKL from activating its receptor RANK on the surface of osteoclast precursors and mature osteoclasts, rapidly inhibiting osteoclast formation, function, and survival to arrest bone resorption.',
    dosingRegimens: [
      'Osteoporosis in Postmenopausal Women / Men at High Fracture Risk (Prolia): 60 mg SC once every 6 months administered by a healthcare provider (ensure calcium 1,000 mg/day and vitamin D >= 400 IU/day)',
      'Bone Loss from Androgen Deprivation or Aromatase Inhibitor Therapy (Prolia): 60 mg SC once every 6 months',
      'Bone Metastases from Solid Tumors / Multiple Myeloma (Xgeva): 120 mg SC once every 4 weeks',
      'Giant Cell Tumor of Bone (Xgeva): 120 mg SC every 4 weeks with additional 120 mg loading doses on Days 8 and 15 of month 1',
    ],
    sideEffects: {
      common: ['Back pain', 'Arthralgia', 'Pain in extremity', 'Musculoskeletal pain', 'Nasopharyngitis', 'Hypercholesterolemia', 'Cystitis'],
      severe: ['Severe hypocalcemia (especially in patients with advanced chronic kidney disease or on dialysis)', 'Osteonecrosis of the jaw (ONJ; preceded by dental extractions/implants)', 'Atypical subtrochanteric and diaphyseal femoral fractures', 'Rebound multiple vertebral fractures following discontinuation', 'Severe skin infections (cellulitis)'],
    },
    contraindications: [
      'Pre-existing hypocalcemia (must be corrected prior to initiating therapy)',
      'Pregnancy (fetal harm / developmental abnormalities)',
      'Known hypersensitivity to denosumab',
    ],
    drugInteractions: {
      major: ['Calcimimetics (cinacalcet - additive risk of severe hypocalcemia)', 'Immunosuppressive agents (additive risk of serious infections)'],
      common: ['Bisphosphonates (prior bisphosphonate use may reduce hypocalcemia risk; sequential use after denosumab is essential to prevent rebound bone loss)'],
    },
    monitoringParameters: [
      'Serum calcium, magnesium, and phosphorus levels: Check baseline and monitor closely within 7 to 14 days post-injection (mandatory in CrCl < 30 mL/min or dialysis)',
      'Renal function (BUN, serum creatinine, eGFR)',
      'Dental examination with preventive dentistry prior to initiating therapy',
      'Bone mineral density (DEXA scan) every 1 to 2 years',
      'Signs of thigh or groin pain (screen for atypical femur fractures)',
    ],
    dosageForms: ['Subcutaneous Injection Prefilled Syringe (Prolia): 60 mg/1 mL', 'Subcutaneous Injection Single-Dose Vial (Xgeva): 120 mg/1.7 mL (70 mg/mL)'],
    administrationAndCounseling: [
      'Administered as a subcutaneous injection in the upper arm, upper thigh, or abdomen by a healthcare professional.',
      'All patients must take daily calcium (1,000 mg/day) and vitamin D (at least 400 to 1,000 IU/day) supplements throughout therapy to prevent dangerous drops in blood calcium.',
      'Maintain good oral hygiene and complete any necessary invasive dental procedures before starting denosumab to reduce the risk of jaw bone necrosis.',
      'CRITICAL: Never miss or delay scheduled 6-month injections; stopping denosumab leads to rapid rebound bone resorption and a high risk of multiple spinal fractures. If discontinued, transition immediately to another antiresorptive agent (bisphosphonate).',
      'Report any new or unusual thigh, hip, or groin pain immediately.',
    ],
  },

  Naproxen: {
    genericName: 'Naproxen',
    brandNames: ['Naprosyn', 'Anaprox', 'Naprelan', 'Aleve'],
    pharmacologicClass: 'Nonselective NSAID (Propionic Acid Derivative)',
    therapeuticClass: 'NSAID',
    mechanismOfAction:
      'Nonsteroidal anti-inflammatory drug (NSAID) with a long half-life (~12-17 hours) that reversibly and non-selectively inhibits cyclooxygenase-1 (COX-1) and cyclooxygenase-2 (COX-2) enzymes, preventing the conversion of arachidonic acid to pro-inflammatory prostaglandins, prostacyclin, and thromboxanes.',
    dosingRegimens: [
      'Rheumatoid Arthritis, Osteoarthritis, Ankylosing Spondylitis: 250 to 500 mg PO twice daily (or controlled-release 750 to 1,000 mg PO once daily; max 1,500 mg/day during acute flares)',
      'Acute Gout: Initial 750 mg PO, followed by 250 mg PO every 8 hours until attack subsides',
      'Mild to Moderate Pain / Dysmenorrhea (Naproxen Sodium): Initial 550 mg PO, followed by 275 mg every 6 to 8 hours or 550 mg every 12 hours as needed (OTC: 220 mg every 8 to 12 hours; max 660 mg/day)',
    ],
    sideEffects: {
      common: ['Dyspepsia', 'Abdominal pain', 'Nausea', 'Heartburn', 'Constipation', 'Dizziness', 'Headache', 'Peripheral edema', 'Tinnitus'],
      severe: ['Cardiovascular thrombotic events (myocardial infarction, stroke)', 'Gastrointestinal bleeding, peptic ulceration, and intestinal perforation', 'Acute kidney injury and renal papillary necrosis', 'Heart failure exacerbation and fluid retention', 'Severe hepatotoxicity', 'Severe cutaneous adverse reactions (Stevens-Johnson syndrome, TEN)'],
    },
    contraindications: [
      'History of asthma, urticaria, or allergic-type reactions after taking aspirin or other NSAIDs',
      'In the setting of coronary artery bypass graft (CABG) surgery',
      'Active peptic ulcer disease or active GI bleeding',
      'Severe renal impairment or severe heart failure',
      'Third trimester of pregnancy (premature closure of ductus arteriosus)',
    ],
    drugInteractions: {
      major: ['Anticoagulants (warfarin, apixaban, rivaroxaban, heparin - severe gastrointestinal bleeding risk)', 'Aspirin (naproxen interferes with the irreversible antiplatelet cardioprotection of low-dose aspirin; take immediate-release aspirin at least 30 minutes before or 8 hours after naproxen)', 'Lithium (NSAIDs inhibit renal prostaglandins, decreasing lithium clearance by 20-40% and precipitating toxicity)'],
      common: ['ACE inhibitors and ARBs (NSAIDs blunt hypotensive efficacy and trigger acute renal decline / hyperkalemia)', 'Methotrexate (elevated methotrexate toxicity)', 'SSRIs / SNRIs (increased upper GI bleeding risk)'],
    },
    monitoringParameters: [
      'Blood pressure at baseline and periodically (NSAIDs cause sodium retention and BP elevations)',
      'Renal function (BUN, serum creatinine, eGFR) and urinalysis',
      'Complete blood count (CBC) and hemoglobin/hematocrit for occult GI blood loss',
      'Liver function tests during chronic therapy',
      'Signs and symptoms of gastrointestinal bleeding or ulceration',
    ],
    dosageForms: [
      'Oral Tablet (Naproxen Base): 250 mg, 375 mg, 500 mg',
      'Oral Tablet (Naproxen Sodium / Anaprox, Aleve): 220 mg, 275 mg, 550 mg',
      'Oral Controlled-Release Tablet (Naprelan): 375 mg, 500 mg, 750 mg',
      'Oral Suspension: 125 mg/5 mL',
    ],
    blackBoxWarning:
      'WARNING: CARDIOVASCULAR THROMBOTIC EVENTS AND GASTROINTESTINAL RISK: Nonsteroidal anti-inflammatory drugs (NSAIDs) cause an increased risk of serious cardiovascular thrombotic events, including myocardial infarction and stroke, which can be fatal. This risk may occur early in treatment and may increase with duration of use. NSAIDs are contraindicated in the setting of coronary artery bypass graft (CABG) surgery. NSAIDs cause an increased risk of serious gastrointestinal adverse events including bleeding, ulceration, and perforation of the stomach or intestines, which can be fatal.',
    administrationAndCounseling: [
      'Take with food, milk, or an antacid to reduce stomach upset.',
      'Use the lowest effective dose for the shortest possible duration consistent with your treatment goals.',
      'Do not take with other prescription or over-the-counter NSAIDs (ibuprofen, Advil, Motrin, Aleve, meloxicam).',
      'Stop taking naproxen and seek emergency medical care immediately if you have chest pain, shortness of breath, slurred speech, black tarry stools, or vomit blood.',
      'Avoid taking in the third trimester of pregnancy.',
    ],
  },

  Ibuprofen: {
    genericName: 'Ibuprofen',
    brandNames: ['Motrin', 'Advil'],
    pharmacologicClass: 'Nonselective NSAID (Propionic Acid Derivative)',
    therapeuticClass: 'NSAID',
    mechanismOfAction:
      'Reversibly and competitively inhibits both cyclooxygenase-1 (COX-1) and cyclooxygenase-2 (COX-2) enzymes, blocking the conversion of arachidonic acid to prostaglandins, prostacyclin, and thromboxane A2, thereby reducing peripheral nociceptive sensitization, inflammatory edema, and hypothalamic fever setpoint.',
    dosingRegimens: [
      'Inflammatory Disease (Rheumatoid Arthritis, Osteoarthritis): 400 to 800 mg PO 3 to 4 times daily (max 3,200 mg/day for prescription doses)',
      'Mild to Moderate Pain / Dysmenorrhea / Fever (Adults): 200 to 400 mg PO every 4 to 6 hours as needed (OTC max 1,200 mg/day; prescription max 2,400 mg/day)',
      'Pediatric Fever / Pain (>= 6 months): 5 to 10 mg/kg PO every 6 to 8 hours as needed (max 40 mg/kg/day up to 2,400 mg/day)',
      'Intravenous Injection (Caldolor): 400 to 800 mg IV infused over 30 minutes every 6 hours as needed for acute pain/fever',
    ],
    sideEffects: {
      common: ['Dyspepsia', 'Nausea', 'Epigastric distress', 'Heartburn', 'Dizziness', 'Headache', 'Fluid retention / mild edema', 'Tinnitus'],
      severe: ['Cardiovascular thrombotic events (myocardial infarction and stroke)', 'Serious gastrointestinal bleeding, ulceration, and perforation', 'Acute renal failure and interstitial nephritis', 'Heart failure decompensation', 'Severe cutaneous adverse reactions (SJS, toxic epidermal necrolysis)', 'Aseptic meningitis (especially in systemic lupus erythematosus patients)'],
    },
    contraindications: [
      'History of asthma, urticaria, or allergic reactions after taking aspirin or other NSAIDs',
      'In the setting of coronary artery bypass graft (CABG) surgery',
      'Active peptic ulcer disease or GI bleeding',
      'Severe heart failure or severe renal impairment',
      'Third trimester of pregnancy',
    ],
    drugInteractions: {
      major: ['Oral anticoagulants (warfarin, direct factor Xa inhibitors - extreme GI bleeding hazard)', 'Aspirin (ibuprofen competitively binds platelet COX-1, attenuating the cardioprotective antiplatelet effect of low-dose aspirin; take immediate-release aspirin >= 30 minutes before or >= 8 hours after ibuprofen)', 'Lithium (increases lithium serum levels by 15-30%)'],
      common: ['Antihypertensives (ACE inhibitors, ARBs, beta-blockers - NSAIDs diminish blood pressure lowering)', 'Methotrexate (decreases methotrexate clearance)', 'SSRIs/SNRIs (increased upper GI bleeding risk)'],
    },
    monitoringParameters: [
      'Blood pressure and fluid retention/edema',
      'Renal function (BUN, serum creatinine, eGFR) especially in elderly or dehydrated patients',
      'CBC, hemoglobin, and hematocrit with long-term therapy',
      'Signs and symptoms of GI bleeding (melena, hematemesis)',
    ],
    dosageForms: [
      'Oral Tablet (Prescription): 400 mg, 600 mg, 800 mg',
      'Oral Tablet / Caplet (OTC): 200 mg',
      'Oral Chewable Tablet: 50 mg, 100 mg',
      'Oral Suspension: 100 mg/5 mL, 50 mg/1.25 mL (Infant drops)',
      'Intravenous Solution (Caldolor): 100 mg/mL (4 mL, 8 mL vials)',
    ],
    blackBoxWarning:
      'WARNING: CARDIOVASCULAR THROMBOTIC EVENTS AND GASTROINTESTINAL RISK: Nonsteroidal anti-inflammatory drugs (NSAIDs) cause an increased risk of serious cardiovascular thrombotic events, including myocardial infarction and stroke, which can be fatal. This risk may occur early in treatment and may increase with duration of use. NSAIDs are contraindicated in the setting of coronary artery bypass graft (CABG) surgery. NSAIDs cause an increased risk of serious gastrointestinal adverse events including bleeding, ulceration, and perforation of the stomach or intestines, which can be fatal.',
    administrationAndCounseling: [
      'Take with food or milk to minimize stomach upset.',
      'Use the lowest effective dose for the shortest duration necessary.',
      'Do not combine with other over-the-counter or prescription NSAIDs (Advil, Aleve, naproxen, Motrin).',
      'Stay well hydrated while taking ibuprofen, especially during endurance exercise or illness.',
      'Seek immediate medical care for chest pain, sudden weakness or numbness, trouble breathing, black stools, or severe stomach pain.',
    ],
  },

  Meloxicam: {
    genericName: 'Meloxicam',
    brandNames: ['Mobic'],
    pharmacologicClass: 'Preferential COX-2 Inhibitor (Oxicam Derivative)',
    therapeuticClass: 'NSAID',
    mechanismOfAction:
      'Oxicam-class nonsteroidal anti-inflammatory drug that preferentially inhibits cyclooxygenase-2 (COX-2) over cyclooxygenase-1 (COX-1) at lower therapeutic doses, suppressing synthesis of pro-inflammatory prostaglandins in inflamed synovial joints with reduced gastrointestinal toxicity compared to traditional nonselective NSAIDs.',
    dosingRegimens: [
      'Osteoarthritis: Initial 7.5 mg PO once daily; may increase to maximum 15 mg PO once daily',
      'Rheumatoid Arthritis: Initial 7.5 mg PO once daily; may titrate up to maximum 15 mg PO once daily',
      'Pauciarticular or Polyarticular Juvenile Idiopathic Arthritis (>= 2 years): 0.125 mg/kg PO once daily (max 7.5 mg/day)',
    ],
    sideEffects: {
      common: ['Dyspepsia', 'Abdominal pain', 'Diarrhea', 'Nausea', 'Flatulence', 'Dizziness', 'Headache', 'Upper respiratory tract infection'],
      severe: ['Cardiovascular thrombotic events (myocardial infarction, stroke)', 'Gastrointestinal bleeding, ulceration, and perforation', 'Acute renal failure and papillary necrosis', 'Hypertension and fluid retention / congestive heart failure', 'Severe cutaneous adverse reactions (toxic epidermal necrolysis, SJS)', 'Severe hepatotoxicity'],
    },
    contraindications: [
      'History of asthma, urticaria, or allergic reactions to aspirin or other NSAIDs',
      'In the setting of coronary artery bypass graft (CABG) surgery',
      'Severe active peptic ulcer disease or GI bleeding',
      'Severe renal impairment (not on hemodialysis)',
      'Third trimester of pregnancy',
    ],
    drugInteractions: {
      major: ['Oral anticoagulants (warfarin, apixaban, rivaroxaban - major GI bleeding hazard)', 'Aspirin and other NSAIDs (synergistic ulceration risk)', 'Lithium (meloxicam decreases lithium clearance, raising serum levels)'],
      common: ['ACE inhibitors, ARBs, and beta-blockers (blunts antihypertensive response; risk of triple-whammy acute kidney injury with diuretics and ACEi)', 'Methotrexate (reduces methotrexate renal clearance)', 'Cyclosporine (additive nephrotoxicity)'],
    },
    monitoringParameters: [
      'Blood pressure at baseline and periodically',
      'Renal function (BUN, serum creatinine, CrCl)',
      'CBC and hemoglobin/hematocrit for occult gastrointestinal blood loss',
      'Liver function tests during chronic therapy',
      'Signs and symptoms of cardiovascular thrombotic events and GI ulcers',
    ],
    dosageForms: ['Oral Tablet: 7.5 mg, 15 mg', 'Oral Capsule: 5 mg, 10 mg', 'Oral Suspension: 7.5 mg/5 mL'],
    blackBoxWarning:
      'WARNING: CARDIOVASCULAR THROMBOTIC EVENTS AND GASTROINTESTINAL RISK: Nonsteroidal anti-inflammatory drugs (NSAIDs) cause an increased risk of serious cardiovascular thrombotic events, including myocardial infarction and stroke, which can be fatal. This risk may occur early in treatment and may increase with duration of use. NSAIDs are contraindicated in the setting of coronary artery bypass graft (CABG) surgery. NSAIDs cause an increased risk of serious gastrointestinal adverse events including bleeding, ulceration, and perforation of the stomach or intestines, which can be fatal.',
    administrationAndCounseling: [
      'Take once daily with or without food at the same time each day (taking with food or milk helps reduce stomach upset).',
      'Do not take more than 15 mg per day; higher doses increase toxicity without providing additional pain relief.',
      'Do not take with other NSAID pain relievers such as ibuprofen, naproxen, or Aleve.',
      'Stop taking meloxicam and report immediately if you experience chest pain, sudden weakness, slurred speech, or black tarry stools.',
    ],
  },

  Nabumetone: {
    genericName: 'Nabumetone',
    brandNames: ['Relafen'],
    pharmacologicClass: 'Nonacidic NSAID Prodrug',
    therapeuticClass: 'NSAID',
    mechanismOfAction:
      'Non-acidic naphthylalkanone prodrug that lacks direct contact irritation on gastric mucosa; absorbed intact and metabolized by hepatic CYP1A2 and CYP2C9 into active 6-methoxy-2-naphthylacetic acid (6-MNA), which preferentially inhibits cyclooxygenase-2 (COX-2) over COX-1 to reduce prostaglandin synthesis.',
    dosingRegimens: [
      'Osteoarthritis and Rheumatoid Arthritis: Initial 1,000 mg PO once daily with or without food (or 500 mg PO twice daily); may titrate up to 1,500 to 2,000 mg/day in single or divided doses (max 2,000 mg/day)',
    ],
    sideEffects: {
      common: ['Dyspepsia', 'Abdominal pain', 'Nausea', 'Constipation', 'Diarrhea', 'Flatulence', 'Headache', 'Dizziness', 'Tinnitus', 'Rash'],
      severe: ['Cardiovascular thrombotic events (myocardial infarction, stroke)', 'Gastrointestinal bleeding, ulceration, and perforation', 'Acute renal insufficiency and interstitial nephritis', 'Severe hepatotoxicity (elevated transaminases)', 'Exfoliative dermatitis and SJS'],
    },
    contraindications: [
      'Known hypersensitivity to nabumetone',
      'History of asthma, urticaria, or allergic reactions after taking aspirin or other NSAIDs',
      'In the setting of coronary artery bypass graft (CABG) surgery',
      'Third trimester of pregnancy',
    ],
    drugInteractions: {
      major: ['Oral anticoagulants (warfarin, DOACs - significantly elevates bleeding hazard)', 'Lithium (decreased renal lithium excretion)', 'Other NSAIDs and systemic corticosteroids (additive ulceration risk)'],
      common: ['ACE inhibitors and ARBs (reduced antihypertensive effect and renal impairment)', 'Diuretics (reduced natriuretic efficacy)', 'Methotrexate (increased methotrexate exposure)'],
    },
    monitoringParameters: [
      'Blood pressure and signs of fluid retention / edema',
      'Renal function (BUN, serum creatinine, CrCl)',
      'Complete blood count (CBC) with differential',
      'Liver function tests at baseline and periodically',
      'Surveillance for gastrointestinal symptoms and signs of bleeding',
    ],
    dosageForms: ['Oral Film-Coated Tablet: 500 mg, 750 mg'],
    blackBoxWarning:
      'WARNING: CARDIOVASCULAR THROMBOTIC EVENTS AND GASTROINTESTINAL RISK: Nonsteroidal anti-inflammatory drugs (NSAIDs) cause an increased risk of serious cardiovascular thrombotic events, including myocardial infarction and stroke, which can be fatal. This risk may occur early in treatment and may increase with duration of use. NSAIDs are contraindicated in the setting of coronary artery bypass graft (CABG) surgery. NSAIDs cause an increased risk of serious gastrointestinal adverse events including bleeding, ulceration, and perforation of the stomach or intestines, which can be fatal.',
    administrationAndCounseling: [
      'Take with food or milk to enhance tolerability, although as a prodrug it has less direct stomach irritation.',
      'Take once daily in the evening or divided into twice-daily doses as prescribed.',
      'Do not take additional over-the-counter NSAIDs (ibuprofen, naproxen) while taking nabumetone.',
      'Report any chest pain, shortness of breath, unusual swelling in legs, or dark/tarry stools immediately.',
    ],
  },

  Diclofenac: {
    genericName: 'Diclofenac',
    brandNames: ['Voltaren-XR', 'Zipsor', 'Zorvolex', 'Cambia', 'Cataflam'],
    pharmacologicClass: 'Nonselective NSAID (Acetic Acid Derivative)',
    therapeuticClass: 'NSAID',
    mechanismOfAction:
      'Potent phenylacetic acid derivative that non-selectively inhibits cyclooxygenase-1 (COX-1) and cyclooxygenase-2 (COX-2) enzymes with relatively balanced inhibition, blocking prostaglandin synthesis and also reducing intracellular arachidonic acid availability by stimulating arachidonic acid uptake into cellular lipid pools.',
    dosingRegimens: [
      'Osteoarthritis (Delayed-Release / Voltaren): 50 mg PO 2 to 3 times daily or 75 mg PO twice daily (or extended-release Voltaren-XR 100 mg PO once daily)',
      'Rheumatoid Arthritis: 50 mg PO 3 to 4 times daily or 75 mg PO twice daily (max 225 mg/day)',
      'Ankylosing Spondylitis: 25 mg PO 4 times daily with an extra 25 mg at bedtime if needed (max 125 mg/day)',
      'Acute Migraine (Cambia Powder for Solution): 50 mg PO single dose dissolved in 1 to 2 ounces of water',
      'Topical Gel (Voltaren Arthritis Pain 1%): Apply 2 g to upper extremity joint 4 times daily (max 8 g/joint/day) or 4 g to lower extremity joint 4 times daily (max 16 g/joint/day; max 32 g/day total)',
    ],
    sideEffects: {
      common: ['Dyspepsia', 'Abdominal pain', 'Nausea', 'Constipation', 'Diarrhea', 'Headache', 'Dizziness', 'Fluid retention', 'Elevated hepatic transaminases'],
      severe: ['Cardiovascular thrombotic events (myocardial infarction and stroke; highest cardiovascular risk among traditional NSAIDs)', 'Severe hepatotoxicity (drug-induced hepatitis, acute liver failure)', 'Gastrointestinal bleeding, ulceration, and perforation', 'Acute renal failure and papillary necrosis', 'Severe cutaneous adverse reactions (toxic epidermal necrolysis, SJS)'],
    },
    contraindications: [
      'History of asthma, urticaria, or allergic reactions to aspirin or other NSAIDs',
      'In the setting of coronary artery bypass graft (CABG) surgery',
      'Active peptic ulceration or gastrointestinal hemorrhage',
      'Severe heart failure or severe renal impairment',
      'Third trimester of pregnancy',
    ],
    drugInteractions: {
      major: ['Oral anticoagulants (warfarin, apixaban, rivaroxaban - major GI bleeding hazard)', 'CYP2C9 inhibitors (voriconazole - significantly increases diclofenac concentrations)', 'Lithium and digoxin (increases serum concentrations of both drugs)'],
      common: ['ACE inhibitors, ARBs, and diuretics (diminished antihypertensive response and acute kidney injury)', 'Methotrexate (delayed methotrexate clearance)', 'Cyclosporine (enhanced nephrotoxicity)'],
    },
    monitoringParameters: [
      'Liver function tests (AST, ALT, alkaline phosphatase, bilirubin): Baseline and within 4 to 8 weeks after starting therapy (ALT elevations occur in ~4% of patients)',
      'Blood pressure and body weight regularly',
      'Renal function (BUN, serum creatinine, eGFR)',
      'Complete blood count (CBC) with differential',
      'Signs and symptoms of gastrointestinal ulceration or bleeding',
    ],
    dosageForms: [
      'Oral Delayed-Release Tablet (Voltaren): 25 mg, 50 mg, 75 mg',
      'Oral Extended-Release Tablet (Voltaren-XR): 100 mg',
      'Oral Immediate-Release Tablet (Cataflam): 50 mg',
      'Oral Micronized Capsule (Zorvolex): 18 mg, 35 mg',
      'Oral Solution Powder (Cambia): 50 mg packet',
      'Topical Gel (Voltaren 1%): 100 g, 150 g tubes with dosing card',
      'Ophthalmic Solution: 0.1%',
    ],
    blackBoxWarning:
      'WARNING: CARDIOVASCULAR THROMBOTIC EVENTS AND GASTROINTESTINAL RISK: Nonsteroidal anti-inflammatory drugs (NSAIDs) cause an increased risk of serious cardiovascular thrombotic events, including myocardial infarction and stroke, which can be fatal. This risk may occur early in treatment and may increase with duration of use. NSAIDs are contraindicated in the setting of coronary artery bypass graft (CABG) surgery. NSAIDs cause an increased risk of serious gastrointestinal adverse events including bleeding, ulceration, and perforation of the stomach or intestines, which can be fatal.',
    administrationAndCounseling: [
      'Swallow delayed-release and extended-release tablets whole; do not crush, chew, or divide.',
      'Take with food or milk to minimize gastrointestinal irritation.',
      'For topical gel: Use the enclosed dosing card to measure the exact 2 g or 4 g dose; gently rub into affected joints; wash hands thoroughly after application unless treating hands.',
      'Do not apply topical gel to open wounds, cuts, or infected skin, and do not cover treated area with an occlusive dressing or heating pad.',
      'Report any signs of liver injury (yellowing of skin or eyes, nausea, extreme fatigue, dark tea-colored urine) or gastrointestinal bleeding immediately.',
    ],
  },

  Celecoxib: {
    genericName: 'Celecoxib',
    brandNames: ['Celebrex'],
    pharmacologicClass: 'Selective COX-2 Inhibitor (Diarylsulfonamide)',
    therapeuticClass: 'NSAID',
    mechanismOfAction:
      'Diaryl-substituted pyrazole that selectively inhibits cyclooxygenase-2 (COX-2) over cyclooxygenase-1 (COX-1) at therapeutic plasma concentrations, suppressing synthesis of pro-inflammatory prostaglandins and prostacyclin at inflammatory sites without significantly inhibiting platelet thromboxane A2 synthesis or disrupting gastric cytoprotective prostaglandins.',
    dosingRegimens: [
      'Osteoarthritis: 200 mg PO once daily or 100 mg PO twice daily',
      'Rheumatoid Arthritis: 100 to 200 mg PO twice daily',
      'Ankylosing Spondylitis: 200 mg PO once daily (or 100 mg twice daily); may increase to 400 mg once daily after 6 weeks if needed',
      'Acute Pain / Primary Dysmenorrhea: Initial 400 mg PO single dose, followed by an additional 200 mg on day 1 if needed; then 200 mg twice daily as needed',
    ],
    sideEffects: {
      common: ['Dyspepsia', 'Abdominal pain', 'Diarrhea', 'Peripheral edema', 'Hypertension', 'Headache', 'Dizziness', 'Sinusitis / pharyngitis'],
      severe: ['Serious cardiovascular thrombotic events (myocardial infarction, stroke)', 'Gastrointestinal bleeding, ulceration, and perforation (lower incidence than nonselective NSAIDs, but risk remains)', 'Acute renal failure and papillary necrosis', 'Severe cutaneous adverse reactions (toxic epidermal necrolysis, SJS, DRESS syndrome)', 'Severe hepatotoxicity', 'Anaphylactoid reactions'],
    },
    contraindications: [
      'Known hypersensitivity to celecoxib, other diarylsulfonamides, or sulfonamides',
      'History of asthma, urticaria, or allergic-type reactions after taking aspirin or other NSAIDs',
      'In the setting of coronary artery bypass graft (CABG) surgery',
      'Third trimester of pregnancy',
      'Active severe gastrointestinal bleeding',
    ],
    drugInteractions: {
      major: ['Oral anticoagulants (warfarin, apixaban - enhanced bleeding hazard; monitor PT/INR closely)', 'Aspirin (concomitant use negates the GI safety benefit of selective COX-2 inhibition and increases ulcer risk to that of nonselective NSAIDs)', 'Lithium (celecoxib increases lithium plasma levels by ~17%)'],
      common: ['CYP2C9 inhibitors (fluconazole - doubles celecoxib plasma concentrations; initiate celecoxib at half the lowest recommended dose)', 'ACE inhibitors and ARBs (attenuated antihypertensive efficacy and hyperkalemia risk)', 'CYP2D6 substrates (celecoxib inhibits CYP2D6; increases levels of metoprolol, dextromethorphan)'],
    },
    monitoringParameters: [
      'Blood pressure at baseline and periodically (celecoxib can cause or worsen hypertension)',
      'Renal function (BUN, serum creatinine, CrCl)',
      'Complete blood count (CBC) with differential',
      'Liver enzymes (AST, ALT) periodically',
      'Signs and symptoms of cardiovascular events (chest pain, shortness of breath, slurred speech) and gastrointestinal ulceration/bleeding',
    ],
    dosageForms: ['Oral Capsule: 50 mg, 100 mg, 200 mg, 400 mg'],
    blackBoxWarning:
      'WARNING: CARDIOVASCULAR THROMBOTIC EVENTS AND GASTROINTESTINAL RISK: Nonsteroidal anti-inflammatory drugs (NSAIDs) cause an increased risk of serious cardiovascular thrombotic events, including myocardial infarction and stroke, which can be fatal. This risk may occur early in treatment and may increase with duration of use. Celecoxib is contraindicated in the setting of coronary artery bypass graft (CABG) surgery. NSAIDs cause an increased risk of serious gastrointestinal adverse events including bleeding, ulceration, and perforation of the stomach or intestines, which can be fatal.',
    administrationAndCounseling: [
      'Take with or without food; taking with food helps reduce stomach upset.',
      'Capsules may be swallowed whole, or opened and the contents sprinkled onto a level teaspoon of cool or room-temperature applesauce and swallowed immediately with water.',
      'Do not take celecoxib if you have a documented history of severe allergic reactions to sulfonamide (sulfa) drugs.',
      'Use the lowest effective dose for the shortest possible duration consistent with your individual treatment goals.',
      'Seek emergency medical help immediately if you experience chest pain, shortness of breath, weakness on one side of your body, or black tarry stools.',
    ],
  },
};
