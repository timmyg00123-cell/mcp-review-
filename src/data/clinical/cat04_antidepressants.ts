import type { TopDrugClinicalMonograph } from './types.js';

const ANTIDEPRESSANT_BBW = "Antidepressants increased the risk of suicidal thoughts and behaviors in pediatric and young adult patients in short-term studies. Closely monitor all antidepressant-treated patients for clinical worsening and emergence of suicidal thoughts and behaviors, especially during the initial few months of drug therapy and after dose changes.";

export const CAT04_ANTIDEPRESSANTS: Record<string, TopDrugClinicalMonograph> = {
  "Paroxetine": {
    genericName: "Paroxetine",
    brandNames: ["Paxil", "Paxil CR", "Pexeva", "Brisdelle"],
    pharmacologicClass: "Selective Serotonin Reuptake Inhibitor (SSRI) / Potent CYP2D6 Inhibitor",
    therapeuticClass: "4. Antidepressant",
    mechanismOfAction: "Potently and selectively inhibits the presynaptic serotonin reuptake transporter (SERT/SLC6A4), increasing serotonergic neurotransmission; exhibits meaningful muscarinic anticholinergic affinity and acts as an irreversible suicide inhibitor of CYP2D6.",
    dosingRegimens: [
      "Major depressive disorder / OCD / Panic: Start 20 mg PO once daily in the morning; titrate by 10 mg/day weekly to target 20-50 mg/day (Paxil CR: 25-62.5 mg/day).",
      "Generalized anxiety disorder / PTSD: Start 20 mg PO daily (max 50 mg/day).",
      "Vasomotor symptoms of menopause (Brisdelle): 7.5 mg PO once daily at bedtime."
    ],
    sideEffects: {
      common: ["Nausea", "Somnolence", "Sexual dysfunction (delayed ejaculation, erectile dysfunction, anorgasmia)", "Dry mouth", "Constipation", "Weight gain", "Diaphoresis", "Asthenia"],
      severe: ["Suicidal thoughts and behaviors in young adults", "Serotonin syndrome", "Severe discontinuation syndrome (electric shock sensations, vivid dreams, vertigo upon missed doses)", "Hyponatremia / SIADH", "Congenital cardiac malformations (ventricular septal defects) if taken in first trimester"]
    },
    contraindications: [
      "Concomitant use of MAOIs (within 14 days) or linezolid / IV methylene blue (serotonin syndrome)",
      "Concomitant use of pimozide or thioridazine (QTc prolongation and fatal arrhythmias via CYP2D6 inhibition)",
      "Known hypersensitivity to paroxetine"
    ],
    blackBoxWarning: ANTIDEPRESSANT_BBW,
    drugInteractions: {
      major: [
        "MAO inhibitors (phenelzine, tranylcypromine, selegiline; fatal serotonin syndrome; contraindicated within 14 days)",
        "CYP2D6 substrates (tamoxifen: paroxetine blocks activation to endoxifen, increasing breast cancer recurrence risk; pimozide/thioridazine: cardiotoxicity)",
        "NSAIDs and antiplatelet drugs (impairs platelet serotonin storage, increasing upper GI bleeding risk)"
      ],
      common: [
        "Triptans, tramadol, linezolid (additive serotonergic risk)",
        "Warfarin (increased bleeding risk and prothrombin time alterations)"
      ]
    },
    monitoringParameters: [
      "Suicidal ideation, clinical worsening of depression, agitation, or unusual behavioral changes",
      "Signs of serotonin syndrome (hyperreflexia, clonus, tremor, hyperthermia, autonomic instability)",
      "Serum sodium in elderly patients (risk of SIADH)",
      "Weight and metabolic parameters during long-term therapy"
    ],
    dosageForms: [
      "Oral Tablet (Paxil): 10 mg, 20 mg, 30 mg, 40 mg",
      "Oral Tablet (Pexeva): 10 mg, 20 mg, 30 mg, 40 mg",
      "Controlled-Release Tablet (Paxil CR): 12.5 mg, 25 mg, 37.5 mg",
      "Oral Suspension: 10 mg/5 mL",
      "Oral Capsule (Brisdelle): 7.5 mg"
    ],
    administrationAndCounseling: [
      "Take once daily in the morning with food to reduce nausea and avoid insomnia (or at bedtime if drowsiness occurs).",
      "Do not crush or chew Paxil CR controlled-release tablets; swallow whole.",
      "NEVER stop taking this medication abruptly; missing doses can cause severe withdrawal sensations like 'brain zaps', dizziness, nausea, and intense anxiety.",
      "Full therapeutic benefit for depression and anxiety may take 4 to 8 weeks to develop.",
      "Women who are pregnant or planning to become pregnant should consult their physician immediately; paroxetine has higher congenital cardiac risks than other SSRIs."
    ]
  },

  "Sertraline": {
    genericName: "Sertraline",
    brandNames: ["Zoloft"],
    pharmacologicClass: "Selective Serotonin Reuptake Inhibitor (SSRI) / Weak Dopamine Reuptake Inhibitor",
    therapeuticClass: "4. Antidepressant",
    mechanismOfAction: "Selectively blocks the neuronal reuptake of serotonin (5-HT) into presynaptic terminals by inhibiting the serotonin transporter (SERT); possesses modest affinity for the dopamine transporter (DAT) and sigma-1 receptors, conferring a favorable activating profile.",
    dosingRegimens: [
      "Major depressive disorder / OCD: Start 50 mg PO once daily (morning or evening); increase by 25-50 mg/day weekly to target maintenance 50-200 mg/day.",
      "Panic disorder / PTSD / Social anxiety: Start 25 mg PO daily for 1 week, then 50 mg daily (max 200 mg/day).",
      "Premenstrual dysphoric disorder (PMDD): 50-150 mg PO daily continuously or during the luteal phase only."
    ],
    sideEffects: {
      common: ["Diarrhea / loose stools (highest among SSRIs)", "Nausea", "Insomnia", "Dizziness", "Somnolence", "Sexual dysfunction", "Tremor", "Dry mouth"],
      severe: ["Suicidal thoughts and behaviors in pediatric and young adult patients", "Serotonin syndrome", "Abnormal bleeding / GI hemorrhage (platelet serotonin depletion)", "Hyponatremia / SIADH", "Angle-closure glaucoma"]
    },
    contraindications: [
      "Concomitant use of MAOIs or within 14 days of MAOI discontinuation",
      "Concomitant use of pimozide",
      "Concomitant use of disulfiram with sertraline oral concentrate (oral concentrate contains 12% alcohol)"
    ],
    blackBoxWarning: ANTIDEPRESSANT_BBW,
    drugInteractions: {
      major: [
        "MAO inhibitors (phenelzine, linezolid, methylene blue; life-threatening serotonin toxicity; contraindicated)",
        "Pimozide (increased pimozide levels and QTc prolongation; contraindicated)",
        "Anticoagulants and NSAIDs (impaired platelet aggregation enhances upper gastrointestinal bleeding risk)"
      ],
      common: [
        "Other serotonergic drugs (triptans, tramadol, St. John's Wort; risk of serotonin syndrome)",
        "Cimetidine (inhibits sertraline metabolism, increasing plasma levels)"
      ]
    },
    monitoringParameters: [
      "Suicidality, emergence of mania/hypomania, and depressive symptom severity",
      "Signs and symptoms of serotonin syndrome (mental status changes, neuromuscular hyperactivity)",
      "Serum sodium in elderly patients or those on concurrent diuretics",
      "Stool frequency and hydration status"
    ],
    dosageForms: [
      "Oral Tablet: 25 mg, 50 mg, 100 mg",
      "Oral Concentrate: 20 mg/mL (contains 12% alcohol)"
    ],
    administrationAndCounseling: [
      "Take once daily in the morning or evening with or without food; taking with food helps reduce nausea and diarrhea.",
      "For oral concentrate: dilute immediately before administration with 4 ounces (1/2 cup) of water, ginger ale, lemon/lime soda, lemonade, or orange juice; do not mix with other liquids.",
      "Expect 2 to 6 weeks of consistent daily therapy before significant improvement in mood or anxiety is felt.",
      "Do not discontinue abruptly without talking to your prescriber.",
      "Report any unusual bleeding, skin bruising, dark stools, or sudden worsening of depression or suicidal thoughts."
    ]
  },

  "Escitalopram": {
    genericName: "Escitalopram",
    brandNames: ["Lexapro"],
    pharmacologicClass: "Selective Serotonin Reuptake Inhibitor (SSRI) / Pure S-Enantiomer",
    therapeuticClass: "4. Antidepressant",
    mechanismOfAction: "Pure (S)-enantiomer of racemic citalopram that binds with high selectivity and nanomolar affinity to the primary orthosteric site as well as an allosteric site on the human serotonin transporter (SERT), producing sustained inhibition of serotonin reuptake with minimal off-target receptor affinities.",
    dosingRegimens: [
      "Major depressive disorder: Start 10 mg PO once daily (morning or evening); may increase after at least 1 week to 20 mg PO once daily.",
      "Generalized anxiety disorder: Start 10 mg PO once daily; may increase to 20 mg PO daily.",
      "Elderly patients / hepatic impairment: Recommended maximum dose is 10 mg PO once daily."
    ],
    sideEffects: {
      common: ["Nausea", "Insomnia", "Ejaculatory disorder", "Somnolence", "Diaphoresis", "Fatigue", "Dry mouth", "Decreased libido"],
      severe: ["Suicidality in children and young adults", "Serotonin syndrome", "Dose-dependent QTc prolongation", "Hyponatremia / SIADH", "Bleeding complications with antiplatelet/NSAID therapy"]
    },
    contraindications: [
      "Concomitant use of MAOIs or within 14 days of MAOI cessation",
      "Concomitant use of pimozide",
      "Hypersensitivity to escitalopram or citalopram"
    ],
    blackBoxWarning: ANTIDEPRESSANT_BBW,
    drugInteractions: {
      major: [
        "MAO inhibitors (phenelzine, tranylcypromine, linezolid; fatal serotonin syndrome; contraindicated)",
        "Pimozide (QTc prolongation; contraindicated)",
        "QTc-prolonging drugs (amiodarone, haloperidol, methadone; additive cardiotoxicity)"
      ],
      common: [
        "NSAIDs and Aspirin (increased risk of gastrointestinal bleeding)",
        "CYP2C19 inhibitors (omeprazole, cimetidine; increase escitalopram plasma concentrations)"
      ]
    },
    monitoringParameters: [
      "Worsening of depression, anxiety, agitation, or emergence of suicidal ideation",
      "Serotonin syndrome signs and symptoms",
      "ECG in patients at risk for torsades de pointes or congestive heart failure",
      "Electrolytes (sodium) in elderly patients"
    ],
    dosageForms: [
      "Oral Tablet: 5 mg, 10 mg, 20 mg",
      "Oral Solution: 5 mg/5 mL (1 mg/mL)"
    ],
    administrationAndCounseling: [
      "Take once daily in the morning or evening, with or without food.",
      "It typically takes 1 to 4 weeks to notice initial improvements and up to 8 weeks for maximal antidepressant response.",
      "Do not discontinue abruptly; gradual dose tapering under medical supervision is recommended.",
      "Seek emergency medical evaluation if you develop severe muscle stiffness, fever, confusion, or rapid heartbeat (serotonin syndrome).",
      "Alert your doctor immediately if you experience new or worsening suicidal thoughts."
    ]
  },

  "Citalopram": {
    genericName: "Citalopram",
    brandNames: ["Celexa"],
    pharmacologicClass: "Selective Serotonin Reuptake Inhibitor (SSRI) / Racemic Bicycle Phthalan",
    therapeuticClass: "4. Antidepressant",
    mechanismOfAction: "Racemic bicyclic phthalane derivative comprising equal parts (S)- and (R)-enantiomers that selectively inhibits the presynaptic serotonin transporter (SERT), raising extracellular serotonin levels in the synaptic cleft; the (R)-enantiomer counteracts allosteric binding of the active (S)-enantiomer and contributes to QTc prolongation.",
    dosingRegimens: [
      "Major depressive disorder: Start 20 mg PO once daily in the morning or evening; may increase to target 40 mg PO once daily after at least 1 week.",
      "Maximum recommended dose: 40 mg PO daily in healthy adults.",
      "Patients >60 years old, hepatic impairment, CYP2C19 poor metabolizers, or taking CYP2C19 inhibitors: Maximum recommended dose is 20 mg PO daily due to dose-dependent QTc prolongation."
    ],
    sideEffects: {
      common: ["Nausea", "Dry mouth", "Somnolence", "Insomnia", "Diaphoresis", "Tremor", "Diarrhea", "Ejaculatory dysfunction"],
      severe: ["Suicidal thoughts and behaviors in children, adolescents, and young adults", "Dose-dependent QTc interval prolongation and Torsades de pointes", "Serotonin syndrome", "Angle-closure glaucoma", "Severe hyponatremia / SIADH"]
    },
    contraindications: [
      "Concomitant use with MAOIs or within 14 days of MAOI cessation",
      "Concomitant use of pimozide",
      "Known congenital long QT syndrome or baseline QTc > 500 ms",
      "Hypersensitivity to citalopram"
    ],
    blackBoxWarning: "Antidepressants increased the risk of suicidal thoughts and behaviors in pediatric and young adult patients in short-term studies. Closely monitor all antidepressant-treated patients for clinical worsening and emergence of suicidal thoughts and behaviors, especially during the initial few months of drug therapy and after dose changes.",
    drugInteractions: {
      major: [
        "MAO inhibitors (phenelzine, isocarboxazid, linezolid; severe fatal serotonin toxicity; contraindicated)",
        "Pimozide (contraindicated due to QTc prolongation and ventricular dysrhythmias)",
        "Other QTc-prolonging agents (amiodarone, methadone, ziprasidone, quinolones; additive ventricular arrhythmia risk)"
      ],
      common: [
        "CYP2C19 inhibitors (omeprazole, cimetidine; double citalopram levels; do not exceed 20 mg daily)",
        "NSAIDs and anticoagulants (additive bleeding risk)"
      ]
    },
    monitoringParameters: [
      "Suicidality and behavioral changes, especially in patients <=24 years old",
      "Baseline and follow-up ECG in patients with cardiac disease, hypokalemia, or taking concurrent QTc-prolonging drugs",
      "Serum potassium and magnesium prior to starting and periodically",
      "Signs of serotonin syndrome"
    ],
    dosageForms: [
      "Oral Tablet: 10 mg, 20 mg, 40 mg",
      "Oral Solution: 10 mg/5 mL"
    ],
    administrationAndCounseling: [
      "Take once daily in the morning or evening, with or without food.",
      "Do not exceed 20 mg daily if you are 60 years or older or have liver disease because higher doses can cause dangerous heart rhythm abnormalities.",
      "Contact your doctor immediately if you experience fainting, irregular heartbeats, or shortness of breath.",
      "Taper gradually when discontinuing; do not stop abruptly.",
      "Report any sudden worsening of depression or suicidal feelings to your healthcare team right away."
    ]
  },

  "Fluoxetine": {
    genericName: "Fluoxetine",
    brandNames: ["Prozac", "Prozac Weekly", "Sarafem"],
    pharmacologicClass: "Selective Serotonin Reuptake Inhibitor (SSRI) / 5-HT2C Antagonist",
    therapeuticClass: "4. Antidepressant",
    mechanismOfAction: "Selectively inhibits the presynaptic serotonin transporter (SERT) and also displays unique antagonist activity at 5-HT2C receptors, leading to local downstream disinhibition of dopamine and norepinephrine release in prefrontal cortex; metabolized to active metabolite norfluoxetine, possessing an exceptionally long combined half-life of up to 1-2 weeks.",
    dosingRegimens: [
      "Major depressive disorder: Start 20 mg PO once daily in the morning; may increase by 20 mg/day after several weeks to target 20-60 mg/day (max 80 mg/day).",
      "Bulimia nervosa: 60 mg PO once daily in the morning.",
      "Panic disorder / OCD: Start 10-20 mg PO daily, titrating to 20-60 mg daily.",
      "Maintenance weekly (Prozac Weekly): 90 mg PO once weekly initiated 7 days after last daily 20 mg dose."
    ],
    sideEffects: {
      common: ["Insomnia", "Nausea", "Diarrhea", "Anorexia and weight loss", "Anxiety / nervousness", "Headache", "Asthenia", "Tremor", "Sexual dysfunction"],
      severe: ["Suicidal thoughts and behaviors in young adults", "Serotonin syndrome", "Severe manic switch in bipolar disorder", "Impaired glycemic control in diabetes", "SIADH / severe hyponatremia"]
    },
    contraindications: [
      "Concomitant use of MAOIs or within 5 weeks of fluoxetine discontinuation (long washout required)",
      "Concomitant use of thioridazine or pimozide (fatal QTc prolongation)",
      "Hypersensitivity to fluoxetine"
    ],
    blackBoxWarning: "Antidepressants increased the risk of suicidal thoughts and behaviors in pediatric and young adult patients in short-term studies. Closely monitor all antidepressant-treated patients for clinical worsening and emergence of suicidal thoughts and behaviors, especially during the initial few months of drug therapy and after dose changes.",
    drugInteractions: {
      major: [
        "MAO inhibitors (fatal serotonin syndrome; wait at least 5 weeks after stopping fluoxetine before initiating an MAOI)",
        "Thioridazine and Pimozide (potent CYP2D6 inhibition elevates levels causing fatal torsades de pointes; contraindicated)",
        "Tamoxifen (fluoxetine potently inhibits CYP2D6 bioactivation of tamoxifen to active endoxifen, reducing breast cancer efficacy; avoid combination)"
      ],
      common: [
        "Tricyclic antidepressants (fluoxetine dramatically increases TCA levels up to several-fold)",
        "Warfarin and NSAIDs (increased gastrointestinal bleeding risk)"
      ]
    },
    monitoringParameters: [
      "Suicidal thoughts, clinical worsening of depression, or emergence of hypomania/mania",
      "Serotonin syndrome symptoms",
      "Blood glucose in diabetic patients (fluoxetine may decrease blood sugar during therapy)",
      "Body weight (especially in underweight or elderly patients)"
    ],
    dosageForms: [
      "Oral Capsule (Prozac): 10 mg, 20 mg, 40 mg",
      "Oral Tablet: 10 mg, 20 mg, 60 mg",
      "Delayed-Release Capsule (Prozac Weekly): 90 mg",
      "Oral Solution: 20 mg/5 mL"
    ],
    administrationAndCounseling: [
      "Take once daily in the morning because fluoxetine can be stimulating and cause insomnia if taken late in the day.",
      "Due to its long half-life, missed single doses are less likely to produce immediate withdrawal symptoms, but consistent daily use is essential.",
      "Maximal improvement in depression, OCD, or bulimia may take 4 to 8 weeks.",
      "Notify your provider if you are taking tamoxifen for breast cancer, as fluoxetine will block its efficacy.",
      "Report any new or sudden thoughts of self-harm or suicide to your doctor immediately."
    ]
  },

  "Trazodone": {
    genericName: "Trazodone",
    brandNames: ["Desyrel", "Oleptro"],
    pharmacologicClass: "Serotonin Antagonist and Reuptake Inhibitor (SARI) / Alpha-1 Blocker",
    therapeuticClass: "4. Antidepressant",
    mechanismOfAction: "Dual-action serotonergic modulator that acts as a potent antagonist at 5-HT2A and 5-HT2C receptors while weakly inhibiting SERT; also possesses potent antagonist activity at histamine H1 and alpha-1 adrenergic receptors, accounting for its pronounced hypnotic and sedative properties at low doses.",
    dosingRegimens: [
      "Major depressive disorder: Start 150 mg/day PO in divided doses after meals; titrate by 50 mg/day every 3-4 days to 150-400 mg/day (max 600 mg/day in inpatients).",
      "Insomnia (off-label): 25-100 mg PO once daily at bedtime.",
      "Extended-Release (Oleptro): 150 mg PO once daily at bedtime on an empty stomach; titrate to 150-375 mg daily."
    ],
    sideEffects: {
      common: ["Somnolence / marked sedation", "Dizziness", "Orthostatic hypotension", "Dry mouth", "Headache", "Nausea", "Blurred vision", "Fatigue"],
      severe: ["Priapism (prolonged, painful, non-sexual erection requiring emergency surgical intervention)", "Suicidality in children and young adults", "Serotonin syndrome", "Cardiac arrhythmias and QTc prolongation", "Syncope from profound orthostasis"]
    },
    contraindications: [
      "Concomitant use of MAOIs or within 14 days of MAOI discontinuation",
      "Hypersensitivity to trazodone"
    ],
    blackBoxWarning: ANTIDEPRESSANT_BBW,
    drugInteractions: {
      major: [
        "MAO inhibitors (severe serotonin syndrome; contraindicated)",
        "CNS depressants and alcohol (profound additive sedation, psychomotor impairment, and respiratory depression)",
        "Antihypertensive agents (additive orthostatic hypotension and syncope)"
      ],
      common: [
        "CYP3A4 inhibitors (ketoconazole, clarithromycin; significantly increase trazodone levels and sedation)",
        "CYP3A4 inducers (carbamazepine, phenytoin; decrease trazodone exposure)"
      ]
    },
    monitoringParameters: [
      "Suicidal ideation and behavioral changes",
      "Blood pressure (orthostatic vitals, especially upon initiation and dose escalation)",
      "Daytime drowsiness and fall risk in elderly patients",
      "Prompt emergency evaluation for painful erections lasting >4 hours"
    ],
    dosageForms: [
      "Oral Tablet (Desyrel): 50 mg, 100 mg, 150 mg, 300 mg",
      "Extended-Release Tablet (Oleptro): 150 mg, 300 mg"
    ],
    administrationAndCounseling: [
      "When used for depression, take with or shortly after a meal or light snack to reduce dizziness and orthostasis; when used for insomnia, take 30 minutes before bedtime.",
      "Get up slowly from sitting or lying positions to avoid dizziness or fainting.",
      "Avoid alcohol and other sedating medications while taking trazodone.",
      "MALE PATIENTS: Seek immediate emergency room medical care if you experience a painful or prolonged erection lasting longer than 4 hours; failure to treat can cause permanent impotence.",
      "Report any worsening depression or suicidal thinking immediately."
    ]
  },

  "Venlafaxine": {
    genericName: "Venlafaxine",
    brandNames: ["Effexor", "Effexor XR"],
    pharmacologicClass: "Serotonin and Norepinephrine Reuptake Inhibitor (SNRI)",
    therapeuticClass: "4. Antidepressant",
    mechanismOfAction: "Dose-dependent dual reuptake inhibitor that potently inhibits the serotonin transporter (SERT) at low doses (<150 mg/day) and additionally inhibits the norepinephrine transporter (NET) at higher doses (>=150 mg/day); active metabolite desvenlafaxine contributes to both SERT and NET inhibition with minimal affinity for muscarinic, histaminergic, or adrenergic receptors.",
    dosingRegimens: [
      "Major depressive disorder / Generalized anxiety (Effexor XR): Start 37.5-75 mg PO once daily with food; titrate by 75 mg/day at intervals of >=4 days to target 150-225 mg PO daily (max 225 mg/day outpatient, 375 mg/day inpatient).",
      "Social anxiety disorder / Panic disorder: 75 mg PO once daily (panic start 37.5 mg daily for 7 days then 75 mg daily).",
      "Renal impairment (eGFR 30-59 mL/min): Reduce total daily dose by 25-50%."
    ],
    sideEffects: {
      common: ["Nausea", "Dizziness", "Insomnia", "Somnolence", "Diaphoresis", "Dry mouth", "Sexual dysfunction", "Constipation", "Anorexia"],
      severe: ["Dose-dependent sustained hypertension (elevation in diastolic blood pressure)", "Suicidal ideation and behaviors in children/young adults", "Serotonin syndrome", "Severe discontinuation syndrome (headache, nausea, paresthesias, sensory 'zaps')", "Angle-closure glaucoma"]
    },
    contraindications: [
      "Concomitant use of MAOIs or within 14 days of MAOI cessation (wait 7 days after stopping venlafaxine before starting MAOI)",
      "Uncontrolled narrow-angle glaucoma",
      "Hypersensitivity to venlafaxine or desvenlafaxine"
    ],
    blackBoxWarning: ANTIDEPRESSANT_BBW,
    drugInteractions: {
      major: [
        "MAO inhibitors (fatal hyperthermia, rigidity, serotonin syndrome; contraindicated)",
        "Other serotonergic drugs (triptans, tramadol, linezolid; increased serotonin toxicity risk)",
        "Sympathomimetics / Amphetamines (additive hypertensive and tachycardic effects)"
      ],
      common: [
        "CYP2D6 inhibitors (paroxetine, fluconazole; decrease formation of desvenlafaxine, increasing parent drug levels)",
        "NSAIDs and antiplatelets (potentiate mucosal bleeding risk)"
      ]
    },
    monitoringParameters: [
      "Blood pressure and heart rate (baseline and regular monitoring at every dose increase; dose-dependent diastolic hypertension)",
      "Suicidal thoughts and behaviors, especially early in treatment",
      "Signs of serotonin syndrome",
      "Serum sodium in elderly patients (SIADH risk)"
    ],
    dosageForms: [
      "Extended-Release Capsule (Effexor XR): 37.5 mg, 75 mg, 150 mg",
      "Oral Tablet (Immediate-Release): 25 mg, 37.5 mg, 50 mg, 75 mg, 100 mg",
      "Extended-Release Tablet: 37.5 mg, 75 mg, 150 mg, 225 mg"
    ],
    administrationAndCounseling: [
      "Take once daily with food at approximately the same time each day (morning or evening) to minimize nausea.",
      "Swallow extended-release capsules whole; do not divide, crush, chew, or place in water.",
      "Capsules may be carefully opened and the entire contents sprinkled on a spoonful of applesauce (swallow immediately without chewing).",
      "NEVER miss doses or stop abruptly; venlafaxine has a very severe withdrawal syndrome ('brain zaps', dizziness, flu-like symptoms, irritability).",
      "Have your blood pressure checked regularly while on this medicine."
    ]
  },

  "Duloxetine": {
    genericName: "Duloxetine",
    brandNames: ["Cymbalta", "Drizalma Sprinkle", "Irenka"],
    pharmacologicClass: "Balanced Serotonin and Norepinephrine Reuptake Inhibitor (SNRI)",
    therapeuticClass: "4. Antidepressant",
    mechanismOfAction: "Potent and balanced dual inhibitor of neuronal serotonin (SERT) and norepinephrine (NET) reuptake across its therapeutic dose range; enhances descending inhibitory pain pathways in the spinal cord dorsal horn, providing significant relief in neuropathic, musculoskeletal, and fibromyalgia chronic pain states.",
    dosingRegimens: [
      "Major depressive disorder: Start 40-60 mg/day PO (either 20-30 mg twice daily or 60 mg once daily); titrate to 60-120 mg/day (max 120 mg/day).",
      "Generalized anxiety disorder: Start 30-60 mg PO once daily (target 60 mg/day, max 120 mg/day).",
      "Diabetic peripheral neuropathic pain / Fibromyalgia / Chronic musculoskeletal pain: 60 mg PO once daily (start 30 mg daily for 1 week to reduce nausea)."
    ],
    sideEffects: {
      common: ["Nausea (very common initial)", "Dry mouth", "Somnolence", "Constipation", "Decreased appetite / weight loss", "Diaphoresis", "Fatigue", "Insomnia", "Dizziness"],
      severe: ["Hepatotoxicity / acute liver injury (jaundice, liver failure)", "Suicidal ideation in children and young adults", "Serotonin syndrome", "Severe cutaneous adverse reactions (Stevens-Johnson syndrome)", "Orthostatic hypotension and falls"]
    },
    contraindications: [
      "Concomitant use of MAOIs or within 14 days of MAOI cessation (wait 5 days after stopping duloxetine before starting MAOI)",
      "Uncontrolled narrow-angle glaucoma",
      "Severe renal impairment (eGFR < 30 mL/min or end-stage renal disease)",
      "Chronic liver disease, cirrhosis, or substantial alcohol consumption"
    ],
    blackBoxWarning: ANTIDEPRESSANT_BBW,
    drugInteractions: {
      major: [
        "MAO inhibitors (phenelzine, linezolid, IV methylene blue; fatal serotonin syndrome; contraindicated)",
        "Potent CYP1A2 inhibitors (ciprofloxacin, fluvoxamine; dramatically increase duloxetine AUC by ~6-fold; avoid combination)",
        "Potent CYP2D6 substrates (flecainide, propafenone; duloxetine is a moderate CYP2D6 inhibitor)"
      ],
      common: [
        "NSAIDs and anticoagulants (additive bleeding risk)",
        "Alcohol (synergistic liver injury risk; avoid combination)"
      ]
    },
    monitoringParameters: [
      "Liver function tests (AST, ALT, bilirubin) at baseline and if abdominal pain, jaundice, or pruritus occurs",
      "Blood pressure and heart rate (regular monitoring)",
      "Suicidal ideation and behavioral changes",
      "Pain scores and functional mobility in chronic pain syndromes"
    ],
    dosageForms: [
      "Delayed-Release Capsule (Cymbalta): 20 mg, 30 mg, 40 mg, 60 mg",
      "Delayed-Release Sprinkle Capsule (Drizalma): 20 mg, 30 mg, 40 mg, 60 mg"
    ],
    administrationAndCounseling: [
      "Swallow delayed-release capsules whole; DO NOT chew, crush, or open capsules (the enteric coating protects duloxetine from gastric acid degradation).",
      "May be taken with or without food; taking with food helps prevent initial nausea.",
      "Avoid heavy alcohol use while taking duloxetine due to increased risk of severe liver damage.",
      "Do not stop taking duloxetine suddenly; taper gradually to avoid withdrawal symptoms.",
      "Notify your doctor immediately if you develop yellow eyes/skin, dark urine, or severe right upper stomach pain."
    ]
  },

  "Bupropion": {
    genericName: "Bupropion",
    brandNames: ["Wellbutrin", "Wellbutrin SR", "Wellbutrin XL", "Zyban", "Forfivo XL", "Aplenzin"],
    pharmacologicClass: "Norepinephrine-Dopamine Reuptake Inhibitor (NDRI) / Aminoketone",
    therapeuticClass: "4. Antidepressant",
    mechanismOfAction: "Aminoketone antidepressant that weakly inhibits the neuronal reuptake of dopamine (DAT) and norepinephrine (NET); non-competitive antagonist at nicotinic acetylcholine receptors (aiding smoking cessation); completely lacks serotonergic activity and does not cause sexual dysfunction or weight gain.",
    dosingRegimens: [
      "Major depressive disorder (Wellbutrin XL): Start 150 mg PO once daily in the morning; increase after 4 days to target 300 mg PO once daily in the morning (max 450 mg/day; Forfivo XL 450 mg daily).",
      "Major depressive disorder (Wellbutrin SR): Start 150 mg PO once daily in the morning; increase to 150 mg PO twice daily (doses separated by at least 8 hours; max single dose 200 mg, max daily 400 mg).",
      "Seasonal affective disorder (SAD): 150 mg PO once daily in autumn, titrating to 300 mg daily; discontinue in early spring.",
      "Smoking cessation (Zyban): 150 mg PO once daily for 3 days, then 150 mg PO twice daily for 7-12 weeks; set quit date in second week."
    ],
    sideEffects: {
      common: ["Insomnia", "Dry mouth", "Headache", "Nausea", "Tremor", "Agitation / anxiety", "Weight loss / decreased appetite", "Tachycardia", "Diaphoresis"],
      severe: ["Dose-dependent seizures (risk substantially increased at doses >450 mg/day or with eating disorders)", "Suicidal ideation in children and young adults", "Hypertension and hypertensive crisis", "Psychosis, hallucinations, and paranoid delusions", "Severe hypersensitivity / serum sickness"]
    },
    contraindications: [
      "Seizure disorder or history of seizures",
      "Current or prior diagnosis of bulimia or anorexia nervosa (high seizure incidence)",
      "Abrupt discontinuation of alcohol, benzodiazepines, barbiturates, or antiepileptic drugs",
      "Concomitant use of MAOIs or within 14 days of MAOI cessation",
      "Concurrent administration of other bupropion-containing medications (e.g., Zyban + Wellbutrin)"
    ],
    blackBoxWarning: "Antidepressants increased the risk of suicidal thoughts and behaviors in pediatric and young adult patients in short-term studies. Closely monitor all antidepressant-treated patients for clinical worsening and emergence of suicidal thoughts and behaviors, especially during the initial few months of drug therapy and after dose changes.",
    drugInteractions: {
      major: [
        "MAO inhibitors (hypertensive reactions; contraindicated within 14 days)",
        "Drugs that lower seizure threshold (antipsychotics, theophylline, systemic steroids, tramadol; heightened seizure risk)",
        "CYP2D6 substrates (bupropion and active metabolite hydroxybupropion are potent CYP2D6 inhibitors; increase levels of metoprolol, atomoxetine, venlafaxine)"
      ],
      common: [
        "CYP2B6 inducers (carbamazepine, efavirenz, rifampin; decrease bupropion levels)",
        "Levodopa / Amantadine (increased adverse neuropsychiatric effects and agitation)"
      ]
    },
    monitoringParameters: [
      "Blood pressure and heart rate (baseline and regular checks)",
      "Suicidality, mood changes, insomnia, and emergence of agitation or paranoia",
      "Renal and hepatic function (dose reduction required in impairment to reduce seizure risk)",
      "Body weight (especially in underweight patients)"
    ],
    dosageForms: [
      "Extended-Release Tablet 24-hour (Wellbutrin XL): 150 mg, 300 mg",
      "Sustained-Release Tablet 12-hour (Wellbutrin SR): 100 mg, 150 mg, 200 mg",
      "Immediate-Release Tablet: 75 mg, 100 mg",
      "Extended-Release Tablet (Forfivo XL): 450 mg",
      "Extended-Release Tablet (Aplenzin, bupropion hydrobromide): 174 mg, 348 mg, 522 mg"
    ],
    administrationAndCounseling: [
      "Take once daily in the morning (for XL formulation) to prevent nighttime insomnia.",
      "When taking SR formulation twice daily, take the second dose in the late afternoon, separated by at least 8 hours from the morning dose.",
      "Swallow tablets whole; do not divide, crush, chew, or cut tablets as this causes rapid dose-dumping and creates a high risk of seizures.",
      "Avoid excessive alcohol consumption; binge drinking or sudden alcohol withdrawal greatly elevates seizure risk.",
      "Notify your doctor immediately if you have a history of seizures or an eating disorder."
    ]
  },

  "Nortriptyline": {
    genericName: "Nortriptyline",
    brandNames: ["Pamelor"],
    pharmacologicClass: "Secondary Amine Tricyclic Antidepressant (TCA)",
    therapeuticClass: "4. Antidepressant",
    mechanismOfAction: "Secondary amine tricyclic antidepressant (active metabolite of amitriptyline) that predominantly and selectively inhibits the presynaptic norepinephrine transporter (NET) over SERT; also exerts moderate antagonist effects at 5-HT2, alpha-1 adrenergic, and histamine H1 receptors, with lower anticholinergic and sedative potency than tertiary amines.",
    dosingRegimens: [
      "Major depressive disorder: Start 25 mg PO three to four times daily (or 50-100 mg PO once daily at bedtime); titrate to target therapeutic serum level (50-150 ng/mL; max 150 mg/day).",
      "Neuropathic pain / Migraine prophylaxis (off-label): 10-25 mg PO once daily at bedtime; titrate to 25-75 mg daily.",
      "Elderly patients: 30-50 mg/day PO in divided doses or bedtime."
    ],
    sideEffects: {
      common: ["Anticholinergic effects (dry mouth, blurred vision, constipation, urinary retention)", "Sedation", "Dizziness", "Weight gain", "Orthostatic hypotension", "Sinus tachycardia"],
      severe: ["Cardiac conduction abnormalities (QTc prolongation, heart block, fatal arrhythmias)", "Lethal overdose in small quantities (narrow therapeutic index: wide complex ventricular tachycardia, refractory shock)", "Suicidality in young adults", "Paralytic ileus", "Seizures"]
    },
    contraindications: [
      "Concomitant use of MAOIs or within 14 days of MAOI cessation",
      "Acute recovery period following myocardial infarction",
      "Co-administration with cisapride",
      "Hypersensitivity to nortriptyline or dibenzocycloheptene TCAs"
    ],
    blackBoxWarning: ANTIDEPRESSANT_BBW,
    drugInteractions: {
      major: [
        "MAO inhibitors (hyperpyretic crisis, severe convulsions, and death; contraindicated)",
        "Class IC and III antiarrhythmics / QTc prolongers (quinidine, sotalol, amiodarone; additive fatal cardiotoxicity)",
        "CYP2D6 inhibitors (fluoxetine, paroxetine; dramatically increase nortriptyline plasma levels to toxic thresholds)"
      ],
      common: [
        "Anticholinergic agents (additive dry mouth, severe constipation, urinary retention, delirium)",
        "CNS depressants and alcohol (synergistic sedation and respiratory depression)"
      ]
    },
    monitoringParameters: [
      "Therapeutic drug monitoring: steady-state serum nortriptyline concentration (therapeutic window: 50-150 ng/mL; demonstrates a true 'therapeutic window' where levels >150 ng/mL decrease clinical efficacy and increase toxicity)",
      "Baseline and follow-up ECG (PR, QRS, and QTc intervals), especially in patients >50 years old",
      "Blood pressure and heart rate (orthostatic vitals)",
      "Suicidal thoughts and behavior"
    ],
    dosageForms: [
      "Oral Capsule: 10 mg, 25 mg, 50 mg, 75 mg",
      "Oral Solution: 10 mg/5 mL"
    ],
    administrationAndCounseling: [
      "Take once daily at bedtime to take advantage of sedating properties and minimize daytime drowsiness.",
      "Maintain good oral hygiene, drink water, or chew sugar-free gum to relieve dry mouth.",
      "Rise slowly from sitting or lying down to prevent dizziness or lightheadedness.",
      "Keep this medicine stored in a secure location away from children and household members; small overdoses can be fatal.",
      "Do not discontinue abruptly; taper gradually under medical supervision."
    ]
  },

  "Amitriptyline": {
    genericName: "Amitriptyline",
    brandNames: ["Elavil"],
    pharmacologicClass: "Tertiary Amine Tricyclic Antidepressant (TCA)",
    therapeuticClass: "4. Antidepressant",
    mechanismOfAction: "Tertiary amine tricyclic antidepressant that non-selectively inhibits the presynaptic reuptake of both serotonin (SERT) and norepinephrine (NET); also exhibits strong competitive antagonism at histamine H1, muscarinic cholinergic (M1), and alpha-1 adrenergic receptors, yielding profound sedation and prominent anticholinergic effects.",
    dosingRegimens: [
      "Major depressive disorder: Start 25-50 mg PO once daily at bedtime; increase gradually by 25-50 mg every few days to target 100-200 mg/day (max 150 mg/day outpatients, 300 mg/day hospitalized patients).",
      "Neuropathic pain / Diabetic neuropathy (off-label): 10-25 mg PO at bedtime; titrate by 10-25 mg weekly to 25-75 mg daily.",
      "Migraine headache prophylaxis (off-label): 10-25 mg PO at bedtime; titrate to 25-100 mg daily."
    ],
    sideEffects: {
      common: ["Marked sedation / drowsiness", "Anticholinergic symptoms (severe dry mouth, blurred vision, constipation, urinary hesitancy)", "Weight gain and increased appetite", "Orthostatic hypotension", "Tachycardia", "Dizziness", "Cognitive clouding"],
      severe: ["Fatal cardiac dysrhythmias and heart block (sodium channel blockade, wide complex QRS prolongation)", "Lethal overdose with narrow therapeutic window ('3 Cs': Coma, Convulsions, Cardiotoxicity)", "Suicidal ideation in children/young adults", "Paralytic ileus", "Angle-closure glaucoma crisis"]
    },
    contraindications: [
      "Concomitant use of MAOIs or within 14 days of MAOI cessation",
      "Acute recovery phase following myocardial infarction",
      "Co-administration with cisapride",
      "Hypersensitivity to amitriptyline"
    ],
    blackBoxWarning: ANTIDEPRESSANT_BBW,
    drugInteractions: {
      major: [
        "MAO inhibitors (hyperpyrexia, severe convulsions, hypertensive crisis, death; contraindicated)",
        "QTc-prolonging and cardiotoxic agents (Class IA/IC/III antiarrhythmics; additive conduction blocks and ventricular fibrillation)",
        "CYP2D6 inhibitors (bupropion, fluoxetine, duloxetine; dramatically increase amitriptyline levels into toxic range)"
      ],
      common: [
        "Anticholinergics (additive constipation, urinary retention, confusion)",
        "Alcohol and CNS depressants (severe sedation, cognitive collapse, respiratory depression)"
      ]
    },
    monitoringParameters: [
      "Baseline and follow-up ECG (measure QRS duration and QTc interval before initiation in cardiac patients or older adults)",
      "Blood pressure and pulse (orthostatic hypotension checks)",
      "Intraocular pressure in patients at risk for angle-closure glaucoma",
      "Suicidal thoughts and behaviors",
      "Serum amitriptyline plus nortriptyline levels in suspected toxicity (toxic threshold: combined levels >500 ng/mL)"
    ],
    dosageForms: [
      "Oral Tablet: 10 mg, 25 mg, 50 mg, 75 mg, 100 mg, 150 mg"
    ],
    administrationAndCounseling: [
      "Take once daily at bedtime because this medication causes pronounced drowsiness.",
      "Do not drive or operate machinery until you know how this medication affects you the next morning.",
      "Sip water, suck on ice chips, or use saliva substitutes to alleviate dry mouth.",
      "Increase dietary fiber and water intake to prevent constipation.",
      "STORE SAFELY OUT OF REACH OF CHILDREN: Taking even a small accidental overdose can cause rapid coma and fatal heart stopping.",
      "Report any palpitations, fainting spells, or sudden worsening of depression immediately."
    ]
  },

  "Mirtazapine": {
    genericName: "Mirtazapine",
    brandNames: ["Remeron", "Remeron SolTab"],
    pharmacologicClass: "Noradrenergic and Specific Serotonergic Antidepressant (NaSSA)",
    therapeuticClass: "4. Antidepressant",
    mechanismOfAction: "Antagonizes central presynaptic alpha-2 adrenergic auto- and hetero-receptors, disinhibiting both noradrenergic and serotonergic transmission ('double boost'); selectively blocks postsynaptic 5-HT2A, 5-HT2C, and 5-HT3 receptors (funneling serotonin to 5-HT1A, preventing sexual dysfunction and nausea); potently antagonizes histamine H1 receptors (causing sedation and appetite stimulation at low doses).",
    dosingRegimens: [
      "Major depressive disorder: Start 15 mg PO once daily at bedtime; increase by 15 mg every 1-2 weeks to target maintenance 15-45 mg PO once daily at bedtime (max 45 mg/day).",
      "Note: Sedation is paradoxically more pronounced at 7.5-15 mg/day due to potent H1 blockade outstripping noradrenergic tone; higher doses (30-45 mg/day) increase noradrenergic transmission and are less sedating."
    ],
    sideEffects: {
      common: ["Somnolence / daytime sedation", "Increased appetite and significant weight gain", "Dry mouth", "Constipation", "Dizziness", "Asthenia", "Hypertriglyceridemia / hypercholesterolemia"],
      severe: ["Suicidality in children and young adults", "Agranulocytosis and severe neutropenia (presents with fever, sore throat, stomatitis)", "Serotonin syndrome", "Severe angle-closure glaucoma", "QTc interval prolongation and Torsades de pointes"]
    },
    contraindications: [
      "Concomitant use of MAOIs or within 14 days of MAOI cessation",
      "Hypersensitivity to mirtazapine"
    ],
    blackBoxWarning: ANTIDEPRESSANT_BBW,
    drugInteractions: {
      major: [
        "MAO inhibitors (hyperpyretic crisis, serotonin toxicity, convulsions; contraindicated within 14 days)",
        "CNS depressants and alcohol (profound additive sedation and psychomotor impairment)"
      ],
      common: [
        "CYP3A4 inducers (carbamazepine, phenytoin; decrease mirtazapine AUC by ~60%)",
        "CYP3A4 and CYP2D6 inhibitors (ketoconazole, cimetidine; increase mirtazapine exposure)"
      ]
    },
    monitoringParameters: [
      "Complete blood count (CBC) with differential if patient develops infection, fever, sore throat, or stomatitis (rule out agranulocytosis)",
      "Body weight, lipid panel (fasting cholesterol and triglycerides), and blood glucose periodically",
      "Suicidal thoughts and behaviors",
      "Sedation level and fall risk in elderly individuals"
    ],
    dosageForms: [
      "Oral Tablet (Remeron): 7.5 mg, 15 mg, 30 mg, 45 mg",
      "Orally Disintegrating Tablet (Remeron SolTab): 15 mg, 30 mg, 45 mg"
    ],
    administrationAndCounseling: [
      "Take once daily at bedtime because mirtazapine causes strong drowsiness.",
      "For orally disintegrating tablet (SolTab): open blister pack with dry hands, place tablet on tongue, allow to dissolve rapidly without chewing, and swallow with saliva (no water needed).",
      "Be prepared for an increase in appetite and weight gain; monitor your eating habits and weight.",
      "Notify your doctor immediately if you develop a fever, chills, sore throat, mouth ulcers, or any signs of an infection.",
      "Do not drink alcohol while taking this medicine as it will worsen extreme drowsiness."
    ]
  }
};
