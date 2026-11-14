import type { TopDrugClinicalMonograph } from './types.js';

export const CAT07_09_OPHTHALMIC_ANTIEMETIC_ANTIFUNGAL: Record<string, TopDrugClinicalMonograph> = {
  // ==========================================
  // Category 7: Ophthalmic Agent
  // ==========================================
  "Latanoprost": {
    genericName: "Latanoprost",
    brandNames: ["Xalatan", "Xelpros"],
    pharmacologicClass: "Prostaglandin F2-Alpha Analog / Ocular Hypotensive",
    therapeuticClass: "7. Ophthalmic Agent",
    mechanismOfAction: "Synthetic prostaglandin F2-alpha isopropyl ester prodrug hydrolyzed by corneal esterases to latanoprost acid; acts as a selective FP prostanoid receptor agonist that relaxes the ciliary muscle and remodels extracellular matrix, significantly increasing uveoscleral outflow of aqueous humor to lower intraocular pressure (IOP).",
    dosingRegimens: [
      "Open-angle glaucoma / Ocular hypertension: Instill 1 drop into the affected eye(s) once daily in the evening.",
      "Do not exceed once-daily dosing (more frequent administration may paradoxically reduce the IOP-lowering effect)."
    ],
    sideEffects: {
      common: ["Conjunctival hyperemia (eye redness)", "Foreign body sensation", "Punctate corneal epithelial erosions", "Eye irritation / stinging", "Iris pigmentation changes (browning of light-colored eyes)", "Hypertrichosis of eyelashes (increased length, thickness, and number)"],
      severe: ["Macular edema (including cystoid macular edema, particularly in aphakic or pseudophakic patients with torn posterior lens capsule)", "Reactivation of herpes simplex keratitis", "Intraocular inflammation (iritis, uveitis)"]
    },
    contraindications: [
      "Known hypersensitivity to latanoprost, benzalkonium chloride, or any excipients"
    ],
    drugInteractions: {
      major: [
        "Thimerosal-containing ophthalmic solutions (precipitation occurs if mixed together; separate administration by at least 5 minutes)"
      ],
      common: [
        "Other topical ophthalmic glaucoma medications (beta-blockers, alpha-agonists, carbonic anhydrase inhibitors; synergistic IOP reduction; separate instillation by at least 5 minutes)"
      ]
    },
    monitoringParameters: [
      "Intraocular pressure (IOP) measured regularly (baseline and periodically)",
      "Examination of the iris for gradual irreversible brown pigmentation changes",
      "Examination of eyelashes for increased growth and pigmentation",
      "Slit-lamp examination of cornea and anterior chamber"
    ],
    dosageForms: [
      "Ophthalmic Solution (Xalatan): 0.005% (50 mcg/mL), 2.5 mL fill in 4 mL bottle (contains benzalkonium chloride preservative)",
      "Ophthalmic Emulsion (Xelpros): 0.005% (potassium sorbate preserved)"
    ],
    administrationAndCounseling: [
      "Instill 1 drop into the affected eye(s) once daily in the evening.",
      "Remove contact lenses prior to instillation; wait at least 15 minutes after instillation before reinserting lenses (benzalkonium chloride is absorbed by soft contact lenses).",
      "Apply gentle pressure over the tear duct (nasolacrimal occlusion) for 1-2 minutes after instilling the drop to minimize systemic absorption.",
      "May cause permanent gradual browning of hazel or light-colored irises, and reversible darkening, lengthening, and thickening of your eyelashes.",
      "Store unopened bottles in the refrigerator (36°F to 46°F); once opened, the bottle may be stored at room temperature (up to 77°F) for up to 6 weeks."
    ]
  },

  "Brimonidine": {
    genericName: "Brimonidine",
    brandNames: ["Alphagan P", "Lumify", "Mirvaso"],
    pharmacologicClass: "Selective Alpha-2 Adrenergic Agonist / Ocular Hypotensive",
    therapeuticClass: "7. Ophthalmic Agent",
    mechanismOfAction: "Highly selective alpha-2 adrenergic receptor agonist (approximately 1000-fold more selective for alpha-2 than alpha-1) that lowers intraocular pressure by dual mechanisms: reducing aqueous humor production via ciliary body vasoconstriction and increasing uveoscleral outflow; topical gel (Mirvaso) causes direct cutaneous vasoconstriction to reduce facial erythema of rosacea.",
    dosingRegimens: [
      "Glaucoma / Ocular hypertension (Alphagan P 0.1% or 0.15%): Instill 1 drop into the affected eye(s) three times daily (approximately 8 hours apart).",
      "Ocular redness / hyperemia (Lumify 0.025% OTC): Instill 1 drop into the affected eye(s) every 6-8 hours PRN (max 4 times daily).",
      "Erythema of rosacea (Mirvaso 0.33% topical gel): Apply a pea-sized amount once daily to forehead, chin, nose, and cheeks."
    ],
    sideEffects: {
      common: ["Allergic conjunctivitis / blepharoconjunctivitis (follicular reaction, ocular pruritus, hyperemia)", "Dry mouth", "Ocular burning / stinging", "Drowsiness / fatigue", "Headache", "Blurred vision"],
      severe: ["Severe systemic hypotension and bradycardia (especially in infants and small children; penetrates CNS)", "Syncope", "Corneal erosion and severe keratitis", "Rebound erythema (with topical facial Mirvaso gel)"]
    },
    contraindications: [
      "Neonates and infants under 2 years of age (severe life-threatening CNS depression, somnolence, hypotonia, hypothermia, bradycardia, and apnea)",
      "Concomitant monoamine oxidase inhibitor (MAOI) therapy",
      "Known hypersensitivity to brimonidine"
    ],
    drugInteractions: {
      major: [
        "Monoamine oxidase inhibitors (MAOIs; contraindicated due to potential hypertensive reactions or blunted metabolism)",
        "CNS depressants / Alcohol (additive sedative and psychomotor impairment)"
      ],
      common: [
        "Antihypertensive agents and cardiac glycosides (additive reductions in pulse and blood pressure)",
        "Tricyclic antidepressants (may blunt IOP-lowering efficacy by interfering with sympathetic transmission)"
      ]
    },
    monitoringParameters: [
      "Intraocular pressure (regular tonometry)",
      "Ocular allergy signs (hyperemia, chemosis, itching, follicles on tarsal conjunctiva requiring discontinuation)",
      "Blood pressure and pulse",
      "Lethargy or CNS depression, particularly in elderly or low-body-weight patients"
    ],
    dosageForms: [
      "Ophthalmic Solution (Alphagan P, with Purite preservative): 0.1%, 0.15%",
      "Ophthalmic Solution (generic, with BAK): 0.2%",
      "Ophthalmic Redness Reliever (Lumify): 0.025%",
      "Topical Gel (Mirvaso): 0.33%"
    ],
    administrationAndCounseling: [
      "Instill 1 drop in affected eye(s) three times daily, about 8 hours apart.",
      "Wait at least 5 minutes between brimonidine and any other eye drops.",
      "Remove soft contact lenses before using and wait at least 15 minutes before putting them back in.",
      "Perform punctal occlusion (press inner corner of eyelid against nose) for 1 minute after instilling drops to prevent drug from entering bloodstream and causing drowsiness or dry mouth.",
      "DO NOT use in children under 2 years of age due to danger of slow breathing and severe sleepiness."
    ]
  },

  "Timolol": {
    genericName: "Timolol",
    brandNames: ["Timoptic", "Timoptic-XE", "Istalol", "Betimol"],
    pharmacologicClass: "Non-Selective Beta-Adrenergic Blocker / Ocular Hypotensive",
    therapeuticClass: "7. Ophthalmic Agent",
    mechanismOfAction: "Non-selective beta-1 and beta-2 adrenergic receptor antagonist lacking intrinsic sympathomimetic activity (ISA) and local anesthetic properties; competes with catecholamines at beta-adrenergic receptors on the non-pigmented ciliary epithelium, decreasing cyclic AMP (cAMP) synthesis and reducing aqueous humor production by 30-50%.",
    dosingRegimens: [
      "Ocular hypertension / Open-angle glaucoma (Timoptic 0.25% or 0.5% solution): Instill 1 drop in affected eye(s) once or twice daily.",
      "Gel-forming solution (Timoptic-XE 0.25% or 0.5%): Instill 1 drop in affected eye(s) once daily in the morning.",
      "Oral systemic formulation (for hypertension / migraine prophylaxis / post-MI): 10-20 mg PO twice daily."
    ],
    sideEffects: {
      common: ["Transient ocular burning and stinging upon instillation", "Blurred vision", "Foreign body sensation", "Dry eyes"],
      severe: ["Systemic beta-blockade absorption: Severe bronchospasm and asthmatic attacks (fatalities reported)", "Profound bradycardia, heart block, and cardiac failure", "Syncope and hypotension", "Masking of acute hypoglycemic symptoms in diabetic patients", "Exacerbation of myasthenia gravis"]
    },
    contraindications: [
      "Bronchial asthma or history of bronchial asthma",
      "Severe chronic obstructive pulmonary disease (COPD) with bronchospastic component",
      "Sinus bradycardia, second- or third-degree atrioventricular (AV) block, overt cardiac failure, or cardiogenic shock",
      "Known hypersensitivity to timolol"
    ],
    drugInteractions: {
      major: [
        "Systemic beta-blockers (additive systemic beta-blockade effects on heart rate and blood pressure)",
        "Calcium channel blockers (verapamil, diltiazem; additive AV conduction slowing, severe bradycardia, and heart failure)",
        "CYP2D6 inhibitors (quinidine, paroxetine; significantly increase systemic timolol exposure via ophthalmic absorption)"
      ],
      common: [
        "Digitalis glycosides (additive bradycardia and AV nodal conduction prolongation)",
        "Insulin / Oral hypoglycemics (blunts hypoglycemia-induced tachycardia)"
      ]
    },
    monitoringParameters: [
      "Intraocular pressure (tonometry)",
      "Heart rate and rhythm (regular pulse checks for bradycardia)",
      "Pulmonary function and respiratory status (wheezing, dyspnea)",
      "Blood pressure"
    ],
    dosageForms: [
      "Ophthalmic Solution (Timoptic): 0.25%, 0.5%",
      "Gel-Forming Ophthalmic Solution (Timoptic-XE): 0.25%, 0.5%",
      "Preservative-Free Solution (Timoptic in Ocudose): 0.25%, 0.5% single-use pipettes"
    ],
    administrationAndCounseling: [
      "Instill 1 drop into the affected eye(s) once daily in the morning (for gel-forming) or twice daily (for regular solution).",
      "CRUCIAL: Compress the tear duct at the inside corner of your eye with your finger for at least 2 minutes immediately after instillation to prevent medicine from entering your bloodstream and causing heart or lung side effects.",
      "Invert the gel-forming bottle once before use; do not shake vigorously.",
      "Remove soft contact lenses before using and wait 15 minutes before reinserting.",
      "Immediately notify your doctor if you experience wheezing, difficulty breathing, a slow pulse, or dizziness."
    ]
  },

  // ==========================================
  // Category 8: Antiemetic
  // ==========================================
  "Promethazine": {
    genericName: "Promethazine",
    brandNames: ["Phenergan", "Promethegan"],
    pharmacologicClass: "Phenothiazine Derivative / First-Generation H1 Antihistamine",
    therapeuticClass: "8. Antiemetic",
    mechanismOfAction: "Phenothiazine derivative that acts as a competitive antagonist at central and peripheral histamine H1 receptors; exhibits prominent muscarinic anticholinergic (M1) and alpha-1 adrenergic blocking activity, as well as dopamine D2 receptor antagonism in the chemoreceptor trigger zone (CTZ) of the medulla to produce strong antiemetic, sedative, and anti-motion sickness effects.",
    dosingRegimens: [
      "Nausea and vomiting: 12.5-25 mg PO, PR, or deep IM q4-6h PRN (max 100 mg/day).",
      "Motion sickness: 25 mg PO taken 30-60 minutes before travel, repeated in 8-12 hours if needed.",
      "Sedation / Allergic conditions: 25-50 mg PO or PR at bedtime."
    ],
    sideEffects: {
      common: ["Marked sedation / drowsiness", "Anticholinergic symptoms (severe dry mouth, blurred vision, urinary retention, constipation)", "Dizziness", "Confusion", "Disorientation in elderly"],
      severe: ["Severe tissue injury / gangrene / necrosis from accidental intra-arterial or subcutaneous extravasation (may require surgical amputation)", "Fatal respiratory depression in pediatric patients <2 years of age", "Neuroleptic malignant syndrome (NMS)", "Extrapyramidal symptoms (acute dystonia, akathisia, tardive dyskinesia)", "Lowered seizure threshold", "Agranulocytosis"]
    },
    contraindications: [
      "Pediatric patients under 2 years of age (fatal respiratory depression)",
      "Subcutaneous or intra-arterial administration (causes severe arteriospasm, gangrene, and necrosis)",
      "Comatose states or concurrent massive CNS depressants",
      "Hypersensitivity to promethazine or phenothiazines"
    ],
    blackBoxWarning: "Respiratory depression in pediatric patients: Do not use promethazine in pediatric patients less than 2 years of age because of the risk of fatal respiratory depression. Severe tissue injury including gangrene: Injection can cause severe chemical irritation and tissue damage, including gangrene, requiring surgical debridement or amputation. Deep intramuscular injection is the preferred route of administration; subcutaneous or intra-arterial injection is strictly contraindicated.",
    drugInteractions: {
      major: [
        "CNS depressants and Opioids (profound synergistic central nervous system depression, respiratory arrest, and coma)",
        "MAO inhibitors (additive anticholinergic and extrapyramidal toxicity)"
      ],
      common: [
        "Anticholinergic medications (additive dry mouth, delirium, constipation, urinary retention)",
        "Antihypertensives (promethazine alpha-1 blockade causes additive orthostatic hypotension)"
      ]
    },
    monitoringParameters: [
      "Respiratory rate and depth (especially in pediatric patients >=2 years and elderly)",
      "Sedation level and fall risk",
      "Injection site inspection (severe burning, pain, or blanching demands immediate cessation)",
      "Signs of extrapyramidal symptoms (acute dystonic reactions like torticollis or facial grimacing)"
    ],
    dosageForms: [
      "Oral Tablet: 12.5 mg, 25 mg, 50 mg",
      "Oral Syrup / Solution: 6.25 mg/5 mL",
      "Rectal Suppository (Promethegan): 12.5 mg, 25 mg, 50 mg",
      "Intramuscular / IV Solution: 25 mg/mL, 50 mg/mL"
    ],
    administrationAndCounseling: [
      "Take with a glass of water or food to minimize stomach upset; take 30-60 minutes before traveling for motion sickness.",
      "Causes severe drowsiness; do not drive, operate machinery, or consume alcohol while taking this medicine.",
      "Store rectal suppositories in the refrigerator.",
      "DO NOT give this medicine to children under 2 years of age due to the risk of fatal slowed breathing.",
      "If receiving an injection, inform the nurse immediately if you feel intense burning or pain at the IV site."
    ]
  },

  "Meclizine": {
    genericName: "Meclizine",
    brandNames: ["Antivert", "Bonine", "Dramamine Less Drowsy"],
    pharmacologicClass: "Piperazine First-Generation H1 Antihistamine / Antivertigo Agent",
    therapeuticClass: "8. Antiemetic",
    mechanismOfAction: "First-generation piperazine H1 receptor antagonist with central anticholinergic actions; suppresses vestibular end-organ receptor firing, inhibits neural conduction in the vestibular cerebellar pathway, and decreases labyrinthine excitability to alleviate vertigo and motion-induced nausea.",
    dosingRegimens: [
      "Vertigo (associated with vestibular dysfunction / Meniere's disease): 25-100 mg PO daily in divided doses (e.g., 25 mg PO q8h or 50 mg PO twice daily).",
      "Motion sickness prophylaxis: 25-50 mg PO administered 1 hour prior to travel; repeat every 24 hours as needed."
    ],
    sideEffects: {
      common: ["Drowsiness / sedation", "Dry mouth", "Fatigue", "Headache", "Blurred vision"],
      severe: ["Severe urinary retention", "Angle-closure glaucoma precipitation", "Excessive sedation and confusion in geriatric patients", "Anaphylaxis"]
    },
    contraindications: [
      "Known hypersensitivity to meclizine or other piperazine derivatives"
    ],
    drugInteractions: {
      major: [
        "CNS depressants and alcohol (synergistic central nervous system depression and psychomotor impairment)"
      ],
      common: [
        "Anticholinergic drugs (additive dry mouth, constipation, urinary retention, blurred vision, delirium)",
        "CYP2D6 inhibitors (may slightly increase meclizine plasma concentrations)"
      ]
    },
    monitoringParameters: [
      "Relief of vertigo symptoms and motion sickness",
      "Cognitive function and sedation level, particularly in elderly individuals",
      "Urinary output in patients with prostatic hypertrophy"
    ],
    dosageForms: [
      "Oral Tablet: 12.5 mg, 25 mg, 50 mg",
      "Oral Chewable Tablet: 25 mg"
    ],
    administrationAndCounseling: [
      "Take 1 hour before travel for motion sickness; for vertigo, take as directed by your physician.",
      "Chew chewable tablets completely before swallowing.",
      "Causes drowsiness; avoid driving, operating dangerous equipment, or drinking alcohol.",
      "Use with caution if you have glaucoma, enlarged prostate, or trouble urinating."
    ]
  },

  "Hydroxyzine": {
    genericName: "Hydroxyzine",
    brandNames: ["Atarax", "Vistaril"],
    pharmacologicClass: "Piperazine First-Generation H1 Antihistamine / Anxiolytic",
    therapeuticClass: "8. Antiemetic",
    mechanismOfAction: "Non-phenothiazine piperazine derivative that acts as a potent competitive inverse agonist at histamine H1 receptors and weak antagonist at 5-HT2A, dopamine D2, and alpha-1 receptors; suppresses subcortical CNS activity (reticular activating system), providing potent antipruritic, antiemetic, sedative, and non-benzodiazepine anxiolytic actions; metabolized to active metabolite cetirizine.",
    dosingRegimens: [
      "Anxiety / Psychoneurosis: 50-100 mg PO four times daily (or hydroxyzine pamoate 50-100 mg PO four times daily).",
      "Pruritus due to allergic conditions / Urticaria: 25 mg PO three to four times daily.",
      "Preoperative / Postoperative sedation and antiemetic: 50-100 mg PO or deep IM."
    ],
    sideEffects: {
      common: ["Marked sedation / drowsiness", "Dry mouth", "Headache", "Dizziness", "Fatigue", "Incoordination"],
      severe: ["QTc interval prolongation and Torsades de pointes", "Acute generalized exanthematous pustulosis (AGEP)", "Respiratory depression (when combined with opioids)", "Severe tissue necrosis with accidental SC/intra-arterial injection", "Angle-closure glaucoma"]
    },
    contraindications: [
      "Known prolonged QTc interval or congenital long QT syndrome",
      "Early pregnancy (teratogenic in animal models)",
      "Hypersensitivity to hydroxyzine, cetirizine, or levocetirizine"
    ],
    drugInteractions: {
      major: [
        "QT-prolonging drugs (antiarrhythmics, methadone, antipsychotics, fluoroquinolones; additive risk of Torsades de pointes; avoid combination)",
        "CNS depressants and opioids (synergistic sedation and fatal respiratory depression)"
      ],
      common: [
        "Anticholinergic drugs (additive dry mouth, blurred vision, constipation, urinary retention)",
        "CYP3A4/5 inhibitors (increase hydroxyzine exposure and arrhythmia hazard)"
      ]
    },
    monitoringParameters: [
      "Baseline ECG for QTc interval in patients with cardiac disease or electrolyte imbalances",
      "Sedation level and respiratory rate",
      "Relief of itching, hives, or anxiety",
      "Skin eruption checks for pustular rash (AGEP)"
    ],
    dosageForms: [
      "Oral Tablet (as hydrochloride, Atarax): 10 mg, 25 mg, 50 mg",
      "Oral Capsule (as pamoate, Vistaril): 25 mg, 50 mg, 100 mg",
      "Oral Syrup: 10 mg/5 mL",
      "Intramuscular Injection Solution: 25 mg/mL, 50 mg/mL"
    ],
    administrationAndCounseling: [
      "Take with a full glass of water, with or without food.",
      "Causes strong drowsiness; do not drive, cycle, or operate heavy machinery.",
      "Avoid all alcohol and sleeping pills while taking hydroxyzine.",
      "Sip water or chew sugarless gum to relieve dry mouth.",
      "Stop taking and seek immediate emergency care if you feel palpitations, dizziness, fainting, or develop a widespread skin rash with small blisters."
    ]
  },

  "Ondansetron": {
    genericName: "Ondansetron",
    brandNames: ["Zofran", "Zofran ODT", "Zuplenz"],
    pharmacologicClass: "Selective 5-HT3 Receptor Antagonist",
    therapeuticClass: "8. Antiemetic",
    mechanismOfAction: "Potent and highly selective competitive antagonist at serotonin 5-HT3 receptors located peripherally on vagal nerve terminals in the gut mucosa and centrally in the chemoreceptor trigger zone (CTZ) of the area postrema; blocks serotonin release triggered by chemotherapeutic emetogenic agents, radiation, or surgical abdominal manipulation.",
    dosingRegimens: [
      "Postoperative nausea and vomiting (PONV) prevention: 4 mg IV immediately before induction or 16 mg PO 1 hour before anesthesia.",
      "Chemotherapy-induced nausea and vomiting (moderately emetogenic): 8 mg PO twice daily (first dose 30 minutes prior to chemo) for 1-2 days.",
      "Gastroenteritis nausea (off-label): 4-8 mg PO / ODT q8h PRN.",
      "Severe hepatic impairment (Child-Pugh C): Maximum recommended total daily dose is 8 mg PO/IV."
    ],
    sideEffects: {
      common: ["Headache (very common)", "Constipation", "Fatigue", "Dizziness", "Drowsiness", "Transient elevation in liver transaminases", "Flushing"],
      severe: ["Dose-dependent QTc prolongation and Torsades de pointes (IV single doses capped at 16 mg)", "Serotonin syndrome (especially when combined with SSRIs, SNRIs, or tramadol)", "Severe hypersensitivity / anaphylaxis", "Ischemic ECG changes / coronary vasospasm"]
    },
    contraindications: [
      "Concomitant use of apomorphine (profound hypotension and loss of consciousness reported; contraindicated)",
      "Known hypersensitivity to ondansetron or other 5-HT3 antagonists",
      "Congenital long QT syndrome"
    ],
    drugInteractions: {
      major: [
        "Apomorphine (causes profound hypotension and syncope; contraindicated)",
        "QTc-prolonging medications (amiodarone, haloperidol, methadone, fluoroquinolones; additive ventricular arrhythmia risk)",
        "Serotonergic agents (SSRIs, SNRIs, MAOIs, tramadol; additive risk of serotonin syndrome)"
      ],
      common: [
        "CYP3A4 inducers (carbamazepine, phenytoin, rifampin; reduce ondansetron AUC by >50%)"
      ]
    },
    monitoringParameters: [
      "ECG monitoring in patients with electrolyte abnormalities (hypokalemia, hypomagnesemia), congestive heart failure, or bradyarrhythmias",
      "Electrolytes (potassium, magnesium) prior to administration",
      "Bowel function (monitor for progressive constipation or signs of ileus)",
      "Symptoms of serotonin syndrome (clonus, hyperreflexia, agitation)"
    ],
    dosageForms: [
      "Oral Tablet (Zofran): 4 mg, 8 mg, 24 mg",
      "Orally Disintegrating Tablet (Zofran ODT): 4 mg, 8 mg (contains aspartame / phenylalanine)",
      "Oral Solution: 4 mg/5 mL",
      "Intravenous Injection: 2 mg/mL (2 mL and 20 mL vials)"
    ],
    administrationAndCounseling: [
      "Take 30 minutes before chemotherapy or 1 hour before surgery, or take as directed for nausea.",
      "FOR ODT TABLETS: Peel back foil on blister with dry hands (do not push tablet through foil); place tablet on top of tongue where it will dissolve in seconds, then swallow with saliva (no water needed).",
      "Zofran ODT contains phenylalanine; inform your doctor if you have phenylketonuria (PKU).",
      "May cause headache (treatable with acetaminophen) and constipation.",
      "Contact your doctor immediately if you experience racing heartbeats, fainting, or sudden shortness of breath."
    ]
  },

  "Granisetron": {
    genericName: "Granisetron",
    brandNames: ["Kytril", "Sancuso", "Sustol"],
    pharmacologicClass: "Second-Generation Selective 5-HT3 Receptor Antagonist",
    therapeuticClass: "8. Antiemetic",
    mechanismOfAction: "Highly selective and potent 5-HT3 receptor antagonist with minimal affinity for other serotonergic, dopaminergic, adrenergic, or histaminergic receptors; competitively blocks peripheral vagal nerve afferents in the gastrointestinal tract and central receptors in the area postrema; transdermal patch (Sancuso) provides continuous sustained therapeutic levels for up to 7 days.",
    dosingRegimens: [
      "Chemotherapy-induced nausea/vomiting (oral): 2 mg PO once daily (or 1 mg PO twice daily) up to 1 hour before chemotherapy on treatment days.",
      "Chemotherapy-induced nausea/vomiting (IV): 10 mcg/kg IV administered within 30 minutes prior to chemotherapy.",
      "Transdermal patch (Sancuso): Apply 1 patch (delivers 3.1 mg/24 hours) to clean, dry outer arm 24-48 hours before chemotherapy; wear continuously for up to 7 days.",
      "Extended-release SC injection (Sustol): 10 mg SC at least 30 minutes prior to chemotherapy."
    ],
    sideEffects: {
      common: ["Constipation", "Headache", "Asthenia", "Somnolence", "Diarrhea", "Dyspepsia", "Application site reactions (patch)"],
      severe: ["QTc interval prolongation and ventricular arrhythmias", "Serotonin syndrome", "Severe hypersensitivity and anaphylaxis", "Bowel obstruction / paralytic ileus"]
    },
    contraindications: [
      "Known hypersensitivity to granisetron or any components of formulation"
    ],
    drugInteractions: {
      major: [
        "Serotonergic medications (SSRIs, SNRIs, triptans; additive serotonin toxicity risk)",
        "QTc-prolonging drugs (additive cardiac repolarization prolongation)"
      ],
      common: [
        "CYP3A4 inducers (phenobarbital; may increase granisetron clearance)"
      ]
    },
    monitoringParameters: [
      "Bowel movements (monitor for worsening constipation and progressive abdominal distention)",
      "ECG in patients with cardiac conduction disorders or concurrent QTc prolongers",
      "Signs of serotonin syndrome",
      "Skin inspection beneath transdermal patch"
    ],
    dosageForms: [
      "Oral Tablet: 1 mg",
      "Transdermal Patch (Sancuso): 3.1 mg/24 hours (52 cm² patch)",
      "Extended-Release SC Injection (Sustol): 10 mg/0.34 mL syringe",
      "Intravenous Solution: 1 mg/mL, 0.1 mg/mL"
    ],
    administrationAndCounseling: [
      "Oral tablets: take up to 1 hour before starting chemotherapy.",
      "TRANS-DERMAL PATCH (Sancuso): Apply to clean, dry, intact skin on the outer upper arm 24 to 48 hours BEFORE starting chemotherapy; leave in place during treatment and for up to 7 days.",
      "Do not expose the patch or application site to direct sunlight or tanning beds; keep covered with clothing.",
      "Stay hydrated and use a stool softener or laxative if constipation develops.",
      "Report any palpitations, dizziness, or severe abdominal pain to your oncologist."
    ]
  },

  "Metoclopramide": {
    genericName: "Metoclopramide",
    brandNames: ["Reglan", "Gimoti"],
    pharmacologicClass: "Dopamine D2 Receptor Antagonist / Prokinetic",
    therapeuticClass: "8. Antiemetic",
    mechanismOfAction: "Antagonizes central and peripheral dopamine D2 receptors and serotonin 5-HT3 receptors at high doses, while stimulating 5-HT4 receptors; augments acetylcholine release from postganglionic cholinergic neurons in gut wall, increasing lower esophageal sphincter (LES) tone, accelerating gastric emptying, and enhancing duodenal peristalsis without stimulating gastric or biliary secretions.",
    dosingRegimens: [
      "Diabetic gastroparesis: 10 mg PO 30 minutes before each meal and at bedtime (four times daily) for 2 to 8 weeks (max 12 weeks of total therapy).",
      "Gastroesophageal reflux (GERD): 10-15 mg PO up to four times daily 30 minutes before meals and at bedtime.",
      "Nasal spray (Gimoti): 1 spray (15 mg) into 1 nostril 30 minutes before each meal and at bedtime.",
      "Renal impairment (eGFR < 40 mL/min): Reduce dose by 50%."
    ],
    sideEffects: {
      common: ["Somnolence / drowsiness", "Restlessness / akathisia", "Fatigue", "Dizziness", "Diarrhea", "Galactorrhea and amenorrhea (hyperprolactinemia)"],
      severe: ["Tardive dyskinesia (irreversible, involuntary repetitive movements of the tongue, face, mouth, jaw, or extremities; risk increases with treatment duration >12 weeks and cumulative dose)", "Acute dystonic reactions (facial spasms, torticollis, oculogyric crisis; treatable with diphenhydramine)", "Neuroleptic malignant syndrome (NMS)", "Parkinsonian-like symptoms (bradykinesia, rigidity, tremor)", "Severe depression and suicidal ideation"]
    },
    contraindications: [
      "Gastrointestinal obstruction, perforation, or mechanical hemorrhage (prokinetic motility stimulates dangerous perforation)",
      "Pheochromocytoma or catecholamine-releasing paragangliomas (induces hypertensive crisis)",
      "History of seizure disorders (lowers seizure threshold)",
      "History of tardive dyskinesia or dystonic reactions to metoclopramide",
      "Concomitant drugs likely to cause extrapyramidal reactions"
    ],
    blackBoxWarning: "Metoclopramide can cause tardive dyskinesia, a serious movement disorder that is often irreversible. The risk of developing tardive dyskinesia increases with the duration of treatment and the total cumulative dose. Discontinue treatment in patients who develop signs or symptoms of tardive dyskinesia. Avoid treatment with metoclopramide for longer than 12 weeks in all but rare cases where therapeutic benefit is thought to outweigh the risk of developing tardive dyskinesia.",
    drugInteractions: {
      major: [
        "Antipsychotics and Dopamine Antagonists (haloperidol, risperidone; extreme synergistic risk of acute dystonia, parkinsonism, and tardive dyskinesia)",
        "Levodopa / Dopamine agonists (mutual competitive antagonism: metoclopramide cancels Parkinson's therapy and worsens motor symptoms)"
      ],
      common: [
        "Anticholinergic drugs and opioid analgesics (antagonize gastrointestinal prokinetic effects)",
        "Digoxin, cyclosporine, ciprofloxacin (accelerated gastric emptying alters oral drug absorption kinetics)"
      ]
    },
    monitoringParameters: [
      "Early signs of tardive dyskinesia (involuntary movements of face, tongue protrusion, lip smacking, rapid eye blinking, or limb chorea; immediate drug cessation required)",
      "Extrapyramidal symptoms and restlessness (akathisia)",
      "Renal function (dose reduction if CrCl < 40 mL/min)",
      "Duration of therapy (must strictly avoid exceeding 12 weeks of cumulative use)"
    ],
    dosageForms: [
      "Oral Tablet (Reglan): 5 mg, 10 mg",
      "Orally Disintegrating Tablet: 5 mg, 10 mg",
      "Oral Solution: 5 mg/5 mL",
      "Nasal Spray (Gimoti): 15 mg per spray (9.8 mL bottle)",
      "Intravenous / IM Injection: 5 mg/mL (2 mL, 10 mL, 30 mL vials)"
    ],
    administrationAndCounseling: [
      "Take 30 minutes before each meal and at bedtime on an empty stomach.",
      "DO NOT take this medication for longer than 12 weeks; prolonged use dramatically increases your risk of developing permanent, incurable facial and muscle twitching (tardive dyskinesia).",
      "Contact your doctor IMMEDIATELY at the first sign of uncontrollable muscle movements, lip smacking, tongue sticking out, grimacing, or uncontrollable shaking.",
      "Avoid alcohol and other sedatives because metoclopramide causes significant drowsiness.",
      "If you feel an intense inner urge to pace or an inability to sit still (restlessness), call your doctor right away."
    ]
  },

  // ==========================================
  // Category 9: Antifungal Agent
  // ==========================================
  "Fluconazole": {
    genericName: "Fluconazole",
    brandNames: ["Diflucan"],
    pharmacologicClass: "Triazole Antifungal / Ergosterol Biosynthesis Inhibitor",
    therapeuticClass: "9. Antifungal Agent",
    mechanismOfAction: "Highly selective inhibitor of fungal cytochrome P450 14-alpha-demethylase (CYP51), blocking conversion of lanosterol to ergosterol; disrupts fungal cell membrane structure and accumulation of toxic 14-alpha-methylated sterols inhibits fungal growth; displays excellent bioavailability and wide tissue distribution including CSF.",
    dosingRegimens: [
      "Vulvovaginal candidiasis: 150 mg PO as a single dose.",
      "Oropharyngeal candidiasis (thrush): 200 mg PO on day 1, then 100 mg PO once daily for 7-14 days.",
      "Esophageal candidiasis: 200 mg PO on day 1, then 100-400 mg PO once daily for 14-21 days.",
      "Cryptococcal meningitis: 400-800 mg PO/IV once daily (after amphotericin B induction) for 8-10 weeks.",
      "Renal dose adjustments: CrCl <= 50 mL/min: Administer usual loading dose, then reduce maintenance doses by 50%."
    ],
    sideEffects: {
      common: ["Headache", "Nausea", "Abdominal pain", "Diarrhea", "Dyspepsia", "Dizziness", "Transient ALT/AST elevation"],
      severe: ["Hepatic toxicity / acute liver failure (fatal hepatitis, hepatic necrosis)", "QTc interval prolongation and Torsades de pointes", "Severe cutaneous adverse reactions (Stevens-Johnson syndrome, TEN, DRESS)", "Congenital abnormalities (craniosynostosis, cardiac defects) with high-dose first-trimester exposure", "Agranulocytosis and thrombocytopenia"]
    },
    contraindications: [
      "Concomitant administration with terfenadine, astemizole, cisapride, pimozide, or quinidine (QTc prolongation)",
      "Known hypersensitivity to fluconazole or other azole antifungals",
      "Pregnancy for high-dose or prolonged therapy (spontaneous abortions and congenital malformations reported)"
    ],
    drugInteractions: {
      major: [
        "CYP2C9, CYP2C19, and CYP3A4 substrates: Warfarin (dramatic prolongation of PT/INR; high fatal bleeding risk), Phenytoin (2- to 3-fold elevation in phenytoin levels), Sulfonylureas (severe hypoglycemia)",
        "QTc-prolonging agents (pimozide, methadone, amiodarone; additive Torsades de pointes hazard)",
        "Statins (atorvastatin, simvastatin; elevated statin exposure and rhabdomyolysis)"
      ],
      common: [
        "Cyclosporine, Tacrolimus (inhibits metabolism, doubling immunosuppressant blood levels and nephrotoxicity)"
      ]
    },
    monitoringParameters: [
      "Liver function tests (AST, ALT, alkaline phosphatase, total bilirubin) in patients on prolonged courses",
      "Prothrombin time / INR in patients taking warfarin (frequent checks required)",
      "Renal function (serum creatinine, eGFR for dose reduction)",
      "ECG for QTc interval in patients with cardiac disease",
      "Serum drug levels of co-administered drugs (phenytoin, tacrolimus, cyclosporine)"
    ],
    dosageForms: [
      "Oral Tablet: 50 mg, 100 mg, 150 mg, 200 mg",
      "Oral Suspension Reconstituted: 50 mg/5 mL, 200 mg/5 mL",
      "Intravenous Injection Premix: 200 mg in 100 mL, 400 mg in 200 mL saline"
    ],
    administrationAndCounseling: [
      "May be taken with or without food at the same time each day.",
      "For vaginal yeast infections: a single 150 mg tablet is usually curative; symptoms should improve within 24-48 hours.",
      "Complete the entire prescribed course for thrush or systemic infections even if symptoms disappear quickly.",
      "Inform your doctor of all other medications you take, especially blood thinners or seizure drugs, as fluconazole interacts with many medicines.",
      "Seek medical attention if you experience severe abdominal pain, persistent vomiting, dark urine, or yellow skin/eyes."
    ]
  },

  "Ketoconazole Topical": {
    genericName: "Ketoconazole Topical",
    brandNames: ["Nizoral", "Nizoral A-D", "Extina", "Xolegel"],
    pharmacologicClass: "Imidazole Antifungal",
    therapeuticClass: "9. Antifungal Agent",
    mechanismOfAction: "Inhibits fungal cytochrome P450 14-alpha-demethylase, suppressing synthesis of ergosterol in fungal cytoplasmic membranes; alters membrane permeability, inhibits purine transport, and causes potassium leakage, arresting growth of dermatophytes (Trichophyton, Microsporum, Epidermophyton) and yeasts (Malassezia furfur / Pityrosporum).",
    dosingRegimens: [
      "Seborrheic dermatitis: Apply 2% cream to affected area twice daily for 4 weeks; or apply 2% shampoo to wet scalp, lather, leave on for 5 minutes, and rinse twice weekly for 4 weeks (at least 3 days between applications).",
      "Tinea versicolor (Pityriasis versicolor): Apply 2% shampoo once daily to damp skin over affected areas for 5 consecutive days; or apply 2% cream once daily for 2 weeks.",
      "Dandruff (OTC Nizoral A-D 1% shampoo): Use every 3-4 days for up to 8 weeks, then as needed for maintenance."
    ],
    sideEffects: {
      common: ["Application site stinging / burning", "Skin irritation", "Dry skin", "Pruritus", "Hair texture changes / oiliness or dryness", "Scalp pustules"],
      severe: ["Severe allergic contact dermatitis", "Anaphylaxis (rare with topical application)"]
    },
    contraindications: [
      "Known hypersensitivity to ketoconazole or any components in the formulation"
    ],
    drugInteractions: {
      major: [
        "Concurrent potent topical medications (may alter cutaneous absorption or cause cumulative localized skin irritation)"
      ],
      common: [
        "Concurrent topical corticosteroids (gradually taper corticosteroid over 2-3 weeks while starting ketoconazole to prevent steroid withdrawal rebound)"
      ]
    },
    monitoringParameters: [
      "Clinical resolution of scaling, erythema, and pruritus over 2-4 weeks",
      "Scalp and skin inspection for severe contact dermatitis"
    ],
    dosageForms: [
      "Topical Cream: 2%",
      "Topical Shampoo: 2% (Rx, Nizoral), 1% (OTC, Nizoral A-D)",
      "Topical Foam (Extina): 2%",
      "Topical Gel (Xolegel): 2%"
    ],
    administrationAndCounseling: [
      "For shampoo: wet hair and scalp thoroughly, apply shampoo, work into a rich lather, leave in place for a full 5 minutes before rinsing completely.",
      "For cream/gel: wash and dry affected skin, apply a thin layer covering the affected areas and immediate surrounding skin, and rub in gently.",
      "Wash hands thoroughly after application.",
      "Avoid contact with eyes, nose, or mouth; rinse thoroughly with water if eye contact occurs.",
      "Do not use on broken or inflamed skin."
    ]
  },

  "Clotrimazole / Betamethasone": {
    genericName: "Clotrimazole / Betamethasone",
    brandNames: ["Lotrisone"],
    pharmacologicClass: "Azole Antifungal / High-Potency Topical Corticosteroid Combination",
    therapeuticClass: "9. Antifungal Agent",
    mechanismOfAction: "Fixed-dose combination of clotrimazole (broad-spectrum imidazole antifungal that inhibits fungal 14-alpha-demethylase and ergosterol biosynthesis) and betamethasone dipropionate (potent synthetic fluorinated corticosteroid that binds glucocorticoid receptors, inducing lipocortins, inhibiting phospholipase A2, and suppressing arachidonic acid cascade to produce rapid anti-inflammatory, antipruritic, and vasoconstrictive effects).",
    dosingRegimens: [
      "Tinea cruris (jock itch) and Tinea corporis (ringworm): Gently massage a small amount into affected skin twice daily (morning and evening) for a MAXIMUM of 2 weeks (do not exceed 2 weeks).",
      "Tinea pedis (athlete's foot): Gently massage into affected skin twice daily for a MAXIMUM of 4 weeks.",
      "DO NOT use for longer than the recommended duration due to risk of cutaneous atrophy and systemic steroid absorption."
    ],
    sideEffects: {
      common: ["Application site burning", "Stinging", "Dry skin", "Pruritus", "Skin tingling / numbness"],
      severe: ["Hypothalamic-pituitary-adrenal (HPA) axis suppression and Cushing's syndrome (especially with occlusive dressings, extensive surface area, or thin intertriginous skin)", "Cutaneous atrophy (skin thinning, irreversible striae, telangiectasias)", "Secondary cutaneous bacterial or candidal infections", "Glaucoma and cataracts if applied near eyes", "Exacerbation of fungal infection with prolonged steroid use"]
    },
    contraindications: [
      "Known hypersensitivity to clotrimazole, betamethasone, or corticosteroids/azoles",
      "Application to facial skin, groin/axillary folds under occlusive dressings, or diaper dermatitis (contraindicated in infants)",
      "Viral, tuberculous, or syphilitic skin lesions"
    ],
    drugInteractions: {
      major: [
        "Potent systemic CYP3A4 inhibitors (may augment systemic betamethasone exposure if applied over extensive surface areas with compromised barrier)"
      ],
      common: [
        "Other topical corticosteroid products (additive systemic glucocorticoid exposure and heightened HPA axis suppression risk)"
      ]
    },
    monitoringParameters: [
      "Resolution of erythema, maceration, and fungal scaling",
      "Inspection for signs of skin atrophy, striae (stretch marks), or telangiectasias",
      "Signs of systemic corticosteroid absorption (hyperglycemia, glucosuria, HPA axis suppression via cosyntropin stimulation test in high-risk applications)"
    ],
    dosageForms: [
      "Topical Cream: 1% clotrimazole / 0.05% betamethasone dipropionate (15 g, 45 g tubes)",
      "Topical Lotion: 1% clotrimazole / 0.05% betamethasone dipropionate (30 mL bottle)"
    ],
    administrationAndCounseling: [
      "Gently massage a thin film into affected and surrounding skin twice daily, morning and night.",
      "CRITICAL: DO NOT use this medicine for longer than 2 weeks for jock itch or body ringworm, or 4 weeks for athlete's foot; prolonged use causes permanent skin thinning, stretch marks, and hormone problems.",
      "NEVER cover the treated skin with tight bandages, plastic wraps, or occlusive dressings unless directed by your physician.",
      "DO NOT use on the face, underarms, or in the diaper area of infants.",
      "Wash your hands thoroughly after applying."
    ]
  },

  "Nystatin Topical": {
    genericName: "Nystatin Topical",
    brandNames: ["Nystop", "Nyamyc"],
    pharmacologicClass: "Polyene Antifungal",
    therapeuticClass: "9. Antifungal Agent",
    mechanismOfAction: "Polyene macrolide antifungal that binds irreversibly to ergosterol in fungal cell membranes; forms transmembrane micropores and ion channels that alter membrane permeability, causing rapid leakage of intracellular potassium, sugars, and cellular constituents, resulting in fungal cell lysis and death; fungistatic and fungicidal against Candida species with virtually zero systemic absorption across intact skin.",
    dosingRegimens: [
      "Cutaneous candidiasis (intertrigo, inframammary, perianal, inguinal folds): Apply topical powder, cream, or ointment to affected areas two to three times daily until healing is complete.",
      "Cutaneous moist intertriginous lesions: Topical powder formulation is preferred over cream/ointment to absorb moisture; dust affected areas two to three times daily."
    ],
    sideEffects: {
      common: ["Local skin irritation", "Burning sensation", "Erythema", "Pruritus"],
      severe: ["Allergic contact dermatitis", "Severe hypersensitivity reactions (rare)"]
    },
    contraindications: [
      "Known hypersensitivity to nystatin or any formulation excipients"
    ],
    drugInteractions: {
      major: [
        "Concurrent topical barrier ointments or compounding vehicles (may impede direct contact of nystatin with fungal cell membranes)"
      ],
      common: [
        "No significant systemic drug interactions due to absence of cutaneous absorption"
      ]
    },
    monitoringParameters: [
      "Clinical resolution of candidal erythema, satellite pustules, and maceration over 1-2 weeks",
      "Skin tolerance and absence of localized dermatitis"
    ],
    dosageForms: [
      "Topical Powder (Nystop, Nyamyc): 100,000 units/g (15 g, 30 g, 60 g, 120 g shaker bottles)",
      "Topical Cream: 100,000 units/g",
      "Topical Ointment: 100,000 units/g"
    ],
    administrationAndCounseling: [
      "Clean and thoroughly dry the affected skin folds before applying.",
      "For topical powder: sprinkle liberally over the affected moist skin folds (under breasts, groin, between toes) two to three times daily.",
      "Continue using for at least 48 hours after all symptoms have cleared to ensure complete eradication.",
      "Keep affected skin areas clean, dry, and exposed to air when possible to prevent fungal regrowth.",
      "This medication treats yeast infections (Candida) only; it does not work for ringworm or athlete's foot caused by dermatophytes."
    ]
  }
};
