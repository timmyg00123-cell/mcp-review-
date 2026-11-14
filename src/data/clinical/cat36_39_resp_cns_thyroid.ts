import type { TopDrugClinicalMonograph } from './types.js';

export const CAT36_39_RESP_CNS_THYROID: Record<string, TopDrugClinicalMonograph> = {
  Albuterol: {
    genericName: 'Albuterol',
    brandNames: ['ProAir HFA', 'ProAir RespiClick', 'Ventolin HFA', 'Proventil HFA', 'VoSpire ER'],
    pharmacologicClass: 'Short-Acting Beta-2 Adrenergic Agonist (SABA)',
    therapeuticClass: 'Bronchodilator / Antiasthmatic',
    mechanismOfAction:
      'Selectively stimulates beta-2 adrenergic receptors in bronchial smooth muscle, activating adenylate cyclase and increasing intracellular cyclic-3\',5\'-adenosine monophosphate (cAMP), leading to protein kinase A activation and bronchial smooth muscle relaxation and bronchodilation.',
    dosingRegimens: [
      'Acute bronchospasm: 1 to 2 inhalations (90 mcg/actuation) every 4 to 6 hours as needed',
      'Exercise-induced bronchospasm prevention: 2 inhalations 15 to 30 minutes prior to exercise',
      'Nebulization for acute exacerbation: 2.5 mg every 4 to 6 hours as needed or 2.5 to 5 mg every 20 minutes for 3 doses in severe distress',
    ],
    sideEffects: {
      common: ['Tremor', 'Tachycardia', 'Palpitations', 'Nervousness', 'Headache', 'Throat irritation'],
      severe: ['Paradoxical bronchospasm', 'Hypokalemia', 'Cardiac arrhythmias', 'Severe hypertension or hypotension'],
    },
    contraindications: ['Hypersensitivity to albuterol or any formulation components'],
    drugInteractions: {
      major: [
        'Non-selective beta-blockers (e.g., propranolol): antagonize bronchodilatory effects and may induce severe bronchospasm',
        'MAO inhibitors and TCAs: potentiate cardiovascular adverse effects and adrenergic stimulation',
      ],
      common: [
        'Loop and thiazide diuretics: increased risk of hypokalemia and ECG changes',
        'Digoxin: potential reduction in serum digoxin concentrations',
      ],
    },
    monitoringParameters: [
      'Frequency of rescue inhaler use (more than 2 days/week indicates poor asthma control)',
      'Peak expiratory flow rate (PEFR) and FEV1',
      'Heart rate, blood pressure, and central nervous system stimulation symptoms',
      'Serum potassium and blood glucose with high-dose or frequent nebulization',
    ],
    dosageForms: [
      'Metered-Dose Inhaler (HFA): 90 mcg/actuation',
      'Dry Powder Inhaler (RespiClick): 90 mcg/actuation',
      'Nebulizer Solution: 0.63 mg/3 mL, 1.25 mg/3 mL, 2.5 mg/3 mL, 5 mg/mL',
      'Oral Syrup: 2 mg/5 mL',
      'Extended-Release Tablets: 4 mg, 8 mg',
    ],
    administrationAndCounseling: [
      'Prime inhaler before first use or if unused for more than 2 weeks according to device instructions.',
      'Inhale deeply and slowly while depressing canister for HFA; hold breath for 10 seconds before exhaling.',
      'Allow at least 1 minute between subsequent inhalations.',
      'Clean plastic actuator mouthpiece weekly under warm running water and air-dry thoroughly.',
      'Seek immediate medical care if rescue therapy fails to relieve acute breathing distress.',
    ],
  },

  'Fluticasone Oral Inhaler': {
    genericName: 'Fluticasone Oral Inhaler',
    brandNames: ['Flovent', 'Arnuity Ellipta'],
    pharmacologicClass: 'Inhaled Corticosteroid (ICS)',
    therapeuticClass: 'Antiasthmatic / Anti-inflammatory',
    mechanismOfAction:
      'Synthetic trifluorinated corticosteroid with potent topical anti-inflammatory activity; binds to cytoplasmic glucocorticoid receptors, translocates to the nucleus, and represses pro-inflammatory transcription factors (AP-1, NF-kB) while inducing anti-inflammatory gene transcription, inhibiting mast cell, eosinophil, and lymphocyte mediator release.',
    dosingRegimens: [
      'Asthma maintenance (Flovent HFA): 88 mcg to 880 mcg twice daily inhaled orally, titrated based on asthma severity',
      'Asthma maintenance (Arnuity Ellipta): 100 mcg to 200 mcg once daily inhaled orally',
    ],
    sideEffects: {
      common: ['Oral candidiasis (thrush)', 'Dysphonia (hoarseness)', 'Throat irritation', 'Upper respiratory tract infection', 'Cough'],
      severe: ['Adrenal suppression', 'Decreased bone mineral density', 'Glaucoma and cataracts', 'Paradoxical bronchospasm', 'Growth velocity reduction in pediatric patients'],
    },
    contraindications: [
      'Primary treatment of status asthmaticus or other acute episodes of asthma requiring intensive rescue measures',
      'Severe hypersensitivity to fluticasone propionate or furoate (or milk proteins with certain DPI formulations)',
    ],
    drugInteractions: {
      major: [
        'Strong CYP3A4 inhibitors (e.g., ritonavir, cobicistat, ketoconazole, clarithromycin): significantly increase systemic fluticasone exposure, risking Cushing syndrome and adrenal insufficiency',
      ],
      common: [
        'Other systemic corticosteroids: additive systemic corticosteroid effects and hypothalamic-pituitary-adrenal (HPA) axis suppression',
      ],
    },
    monitoringParameters: [
      'Pulmonary function tests (FEV1, peak flow) and asthma symptom control frequency',
      'Oral cavity inspection for mucosal fungal plaque (candidiasis)',
      'Growth rate in pediatric patients receiving chronic therapy',
      'Bone mineral density and intraocular pressure during prolonged high-dose therapy',
    ],
    dosageForms: [
      'Aerosol Inhaler (HFA): 44 mcg, 110 mcg, 220 mcg per actuation',
      'Dry Powder Inhaler (Diskus / Ellipta): 50 mcg, 100 mcg, 200 mcg, 250 mcg per blister',
    ],
    administrationAndCounseling: [
      'This is a long-term maintenance controller medication and MUST NOT be used to relieve acute bronchospasm.',
      'Rinse mouth with water and spit it out thoroughly without swallowing after each administration to prevent oral fungal infection and hoarseness.',
      'Use daily at consistent scheduled times even when feeling asymptomatic.',
      'Do not wash or immerse dry powder inhalers in water.',
    ],
  },

  'Fluticasone Nasal Inhaler': {
    genericName: 'Fluticasone Nasal Inhaler',
    brandNames: ['Flonase'],
    pharmacologicClass: 'Intranasal Corticosteroid',
    therapeuticClass: 'Antiallergic / Anti-inflammatory',
    mechanismOfAction:
      'Exerts localized glucocorticoid receptor-mediated anti-inflammatory actions within the nasal mucosa, inhibiting mediator release from mast cells, eosinophils, neutrophils, and macrophages, decreasing vascular permeability, and reducing nasal congestion, rhinorrhea, pruritus, and sneezing.',
    dosingRegimens: [
      'Allergic rhinitis (adults): 2 sprays (50 mcg/spray) in each nostril once daily (total 200 mcg/day), reduced to 1 spray per nostril daily once symptoms are controlled',
      'Pediatric allergic rhinitis (ages 4-11): 1 spray in each nostril once daily (total 100 mcg/day)',
    ],
    sideEffects: {
      common: ['Epistaxis (nasal bleeding)', 'Nasal irritation and burning', 'Headache', 'Pharyngitis', 'Unpleasant taste or smell'],
      severe: ['Nasal septal perforation', 'Localized Candida albicans infection', 'Glaucoma and cataracts', 'Hypothalamic-pituitary-adrenal (HPA) axis suppression'],
    },
    contraindications: [
      'Hypersensitivity to fluticasone propionate or any component of the nasal spray',
      'Recent nasal septal ulcers, nasal surgery, or nasal trauma prior to complete healing',
    ],
    drugInteractions: {
      major: [
        'Potent CYP3A4 inhibitors (ritonavir, cobicistat, ketoconazole, itraconazole): substantial elevation of systemic fluticasone concentrations with risk of systemic steroid toxicity',
      ],
      common: [
        'Concomitant systemic corticosteroids: potential additive HPA axis suppression',
      ],
    },
    monitoringParameters: [
      'Nasal mucosal examination for ulceration or septal perforation with long-term use',
      'Ophthalmic examination (intraocular pressure, cataracts) in patients with vision changes or prolonged therapy',
      'Growth velocity in children receiving continuous long-term therapy',
    ],
    dosageForms: [
      'Nasal Spray Suspension: 50 mcg/actuation (16 g / 120 sprays or 9.9 g / 60 sprays)',
    ],
    administrationAndCounseling: [
      'Blow nose gently to clear nostrils before administration.',
      'Shake bottle gently before each use and prime if unused for 7 days or more.',
      'Tilt head slightly forward, insert applicator into nostril aiming outward toward the ear (away from the nasal septum), and spray while inhaling gently through the nose.',
      'Full clinical benefit may take several days of continuous daily use to develop.',
    ],
  },

  'Fluticasone / Salmeterol': {
    genericName: 'Fluticasone / Salmeterol',
    brandNames: ['Advair'],
    pharmacologicClass: 'Inhaled Corticosteroid / Long-Acting Beta-2 Agonist (ICS / LABA) Combination',
    therapeuticClass: 'Antiasthmatic / COPD Maintenance',
    mechanismOfAction:
      'Combines fluticasone propionate (synthetic corticosteroid with localized anti-inflammatory and immunosuppressive actions) and salmeterol xinafoate (selective long-acting beta-2 agonist that stimulates adenylate cyclase, increases cAMP, and produces sustained bronchial smooth muscle relaxation for at least 12 hours).',
    dosingRegimens: [
      'Asthma maintenance (Diskus): 1 inhalation (100/50 mcg, 250/50 mcg, or 500/50 mcg) twice daily approximately 12 hours apart',
      'Asthma maintenance (HFA): 2 inhalations (45/21 mcg, 115/21 mcg, or 230/21 mcg) twice daily',
      'COPD maintenance: Advair Diskus 250/50 mcg 1 inhalation twice daily',
    ],
    sideEffects: {
      common: ['Upper respiratory tract infection', 'Oral candidiasis', 'Dysphonia', 'Headache', 'Throat irritation', 'Tremor', 'Tachycardia'],
      severe: ['Asthma-related death (LABA monotherapy warning)', 'Pneumonia in COPD patients', 'Cardiovascular events (arrhythmias, QT prolongation)', 'Adrenal suppression', 'Paradoxical bronchospasm'],
    },
    contraindications: [
      'Primary treatment of status asthmaticus or other acute episodes of bronchospasm requiring rapid bronchodilation',
      'Severe hypersensitivity to fluticasone, salmeterol, or milk proteins (DPI formulation)',
    ],
    drugInteractions: {
      major: [
        'Strong CYP3A4 inhibitors (ritonavir, ketoconazole, clarithromycin): marked increases in fluticasone and salmeterol plasma levels, elevating cardiovascular and systemic steroid risks',
        'Non-selective beta-blockers: block pulmonary effects of salmeterol and precipitate severe bronchospasm',
      ],
      common: [
        'MAO inhibitors and tricyclic antidepressants: potentiate cardiovascular adrenergic toxicity and QT prolongation',
        'Loop/thiazide diuretics: additive hypokalemia risk',
      ],
    },
    monitoringParameters: [
      'Pulmonary function tests (FEV1, peak expiratory flow) and symptom control',
      'Oropharyngeal examination for candidiasis (thrush)',
      'Cardiovascular parameters (heart rate, blood pressure, ECG for arrhythmias)',
      'Pediatric growth velocity and adult bone mineral density during prolonged treatment',
    ],
    dosageForms: [
      'Dry Powder Inhaler (Diskus): 100/50 mcg, 250/50 mcg, 500/50 mcg per blister',
      'Metered-Dose Inhaler (HFA): 45/21 mcg, 115/21 mcg, 230/21 mcg per actuation',
    ],
    blackBoxWarning:
      'Asthma-related death: Long-acting beta-2 adrenergic agonists (LABA), such as salmeterol, increase the risk of asthma-related death when used as monotherapy. When LABA is used in fixed-dose combination with an inhaled corticosteroid (such as fluticasone/salmeterol), large clinical trials demonstrate that the risk of serious asthma-related outcomes is not significantly increased compared with inhaled corticosteroids alone.',
    administrationAndCounseling: [
      'Inhale twice daily every 12 hours; do not use more frequently or exceed prescribed dose.',
      'Always rinse mouth with water and spit out after each dose to prevent oral thrush and vocal cord irritation.',
      'Never use Advair as a rescue medication for sudden acute shortness of breath; always keep a fast-acting rescue inhaler (albuterol) on hand.',
      'Hold Diskus level in a horizontal position when sliding the lever to load the blister dose.',
    ],
  },

  'Budesonide / Formoterol': {
    genericName: 'Budesonide / Formoterol',
    brandNames: ['Symbicort'],
    pharmacologicClass: 'Inhaled Corticosteroid / Rapid- and Long-Acting Beta-2 Agonist (ICS / LABA)',
    therapeuticClass: 'Antiasthmatic / COPD Maintenance',
    mechanismOfAction:
      'Dual-action inhalation therapy combining budesonide (potent anti-inflammatory corticosteroid inhibiting multiple inflammatory cell types and cytokine pathways) and formoterol fumarate (rapid-onset, long-acting selective beta-2 agonist producing bronchodilation within 1 to 3 minutes that persists for at least 12 hours).',
    dosingRegimens: [
      'Asthma maintenance (adults and adolescents >= 12 years): 2 inhalations (80/4.5 mcg or 160/4.5 mcg) twice daily',
      'COPD maintenance: 2 inhalations (160/4.5 mcg) twice daily',
      'Single Maintenance and Reliever Therapy (SMART) protocol: 1 to 2 inhalations twice daily plus 1 to 2 inhalations as needed for acute symptoms (GINA guidelines)',
    ],
    sideEffects: {
      common: ['Nasopharyngitis', 'Headache', 'Upper respiratory tract infection', 'Oral candidiasis', 'Dysphonia', 'Tremor', 'Palpitations'],
      severe: ['Asthma-related death and serious outcomes (LABA class risk)', 'Pneumonia in COPD patients', 'Cardiac arrhythmias and hypokalemia', 'Adrenal suppression', 'Paradoxical bronchospasm'],
    },
    contraindications: [
      'Primary treatment of status asthmaticus or acute episodes of asthma/COPD requiring intensive rescue intervention',
      'Severe hypersensitivity to budesonide, formoterol, or formulation components',
    ],
    drugInteractions: {
      major: [
        'Potent CYP3A4 inhibitors (ketoconazole, itraconazole, clarithromycin, ritonavir): substantially elevate systemic budesonide exposure',
        'Beta-adrenergic receptor blockers (e.g., propranolol, atenolol): may antagonize formoterol bronchodilation and trigger bronchospasm',
      ],
      common: [
        'QT-prolonging agents, TCAs, and MAOIs: additive cardiovascular stimulation and arrhythmogenic risk',
        'Potassium-wasting diuretics: increased risk of hypokalemia and ECG changes',
      ],
    },
    monitoringParameters: [
      'Pulmonary function tests (FEV1, peak flow) and frequency of rescue use',
      'Oral cavity inspection for mucosal fungal plaques',
      'Serum potassium and blood glucose in high-risk patients',
      'Heart rate, blood pressure, and ECG in patients with underlying cardiovascular disease',
    ],
    dosageForms: [
      'Metered-Dose Inhaler (HFA): 80/4.5 mcg, 160/4.5 mcg per actuation (60 or 120 actuations/canister)',
    ],
    blackBoxWarning:
      'Asthma-related death: Long-acting beta-2 adrenergic agonists (LABA), such as formoterol, increase the risk of asthma-related death when used as monotherapy. When used in a fixed-dose combination with an inhaled corticosteroid (such as budesonide/formoterol), data show that the combination does not significantly increase the risk of serious asthma-related events compared with ICS alone.',
    administrationAndCounseling: [
      'Shake inhaler well for 5 seconds before each actuation.',
      'Rinse mouth with water and spit out after inhalation to prevent oral thrush and hoarseness.',
      'Prime canister before first use by pumping 2 test sprays into air away from face, or if unused for > 7 days.',
      'Do not submerge the canister in water; wipe the mouthpiece with a dry, clean tissue weekly.',
    ],
  },

  'Ipratropium / Albuterol': {
    genericName: 'Ipratropium / Albuterol',
    brandNames: ['Combivent Respimat', 'Duoneb'],
    pharmacologicClass: 'Short-Acting Muscarinic Antagonist / Short-Acting Beta-2 Agonist (SAMA / SABA)',
    therapeuticClass: 'COPD Bronchodilator Combination',
    mechanismOfAction:
      'Provides synergistic bronchodilation via dual complementary mechanisms: ipratropium bromide competitively antagonizes acetylcholine at muscarinic M3 receptors on bronchial smooth muscle (inhibiting parasympathetic bronchoconstriction), while albuterol sulfate selectively stimulates beta-2 adrenergic receptors (activating adenylate cyclase and increasing intracellular cAMP to relax bronchial smooth muscle).',
    dosingRegimens: [
      'Combivent Respimat inhaler: 1 inhalation (20 mcg ipratropium / 100 mcg albuterol) 4 times daily (maximum 6 inhalations in 24 hours)',
      'DuoNeb nebulizer solution: 1 unit-dose vial (3 mg ipratropium bromide / 0.5 mg albuterol base in 3 mL) inhaled via nebulizer 4 times daily (maximum 6 doses/day)',
    ],
    sideEffects: {
      common: ['Dry mouth', 'Headache', 'Upper respiratory tract infection', 'Pharyngitis', 'Cough', 'Tremor', 'Nausea'],
      severe: ['Paradoxical bronchospasm', 'Acute narrow-angle glaucoma exacerbation', 'Urinary retention and bladder neck obstruction', 'Cardiac arrhythmias and tachycardia'],
    },
    contraindications: [
      'Hypersensitivity to ipratropium bromide, albuterol sulfate, atropine, or any inactive ingredients',
    ],
    drugInteractions: {
      major: [
        'Non-selective beta-blockers: oppose bronchodilator actions of albuterol and may trigger severe bronchoconstriction',
        'Other anticholinergic agents (e.g., tiotropium, aclidinium, oxybutynin): additive anticholinergic toxicity (urinary retention, dry mouth, ocular hypertension)',
      ],
      common: [
        'Potassium-depleting diuretics: potentiate hypokalemia and ECG changes',
        'MAO inhibitors and tricyclic antidepressants: heightened cardiovascular adrenergic stimulation',
      ],
    },
    monitoringParameters: [
      'Pulmonary function tests (FEV1, FVC) and symptomatic dyspnea relief',
      'Heart rate, pulse, and blood pressure',
      'Urinary output and voiding symptoms, especially in elderly men with benign prostatic hyperplasia',
      'Ocular symptoms (eye pain, visual halos, blurred vision)',
    ],
    dosageForms: [
      'Inhalation Spray (Combivent Respimat): 20 mcg ipratropium / 100 mcg albuterol per actuation (120 actuations per cartridge)',
      'Inhalation Nebulizer Solution (DuoNeb): 0.5 mg ipratropium / 2.5 mg albuterol per 3 mL vial',
    ],
    administrationAndCounseling: [
      'Turn base, open cap, press dose-release button while inhaling slowly and deeply through mouth for Respimat device.',
      'Avoid spraying into eyes; accidental ocular exposure may cause temporary pupillary dilation, blurred vision, or precipitate acute narrow-angle glaucoma.',
      'Report difficulty urinating, painful urination, or sudden vision changes immediately to healthcare provider.',
      'Discard Respimat inhaler 3 months after cartridge insertion or when locking mechanism engages.',
    ],
  },

  Tiotropium: {
    genericName: 'Tiotropium',
    brandNames: ['Spiriva'],
    pharmacologicClass: 'Long-Acting Muscarinic Antagonist (LAMA)',
    therapeuticClass: 'COPD and Asthma Maintenance Bronchodilator',
    mechanismOfAction:
      'Long-acting quaternary ammonium antimuscarinic agent that competitively and reversibly binds to muscarinic receptors (M1, M2, M3) in bronchial smooth muscle, exhibiting prolonged kinetic selectivity for M3 receptors to inhibit acetylcholine-induced parasympathetic bronchoconstriction, producing sustained bronchodilation lasting over 24 hours.',
    dosingRegimens: [
      'COPD maintenance (Spiriva HandiHaler): Inhalation of the powder contents of one 18 mcg capsule once daily using HandiHaler device (two inhalations per single capsule)',
      'COPD maintenance (Spiriva Respimat): 2 inhalations of 2.5 mcg (total 5 mcg) once daily',
      'Asthma maintenance (Spiriva Respimat): 2 inhalations of 1.25 mcg (total 2.5 mcg) once daily',
    ],
    sideEffects: {
      common: ['Dry mouth', 'Upper respiratory tract infection', 'Pharyngitis', 'Sinusitis', 'Headache', 'Dyspepsia', 'Constipation'],
      severe: ['Paradoxical bronchospasm', 'Acute narrow-angle glaucoma', 'Urinary retention / bladder neck obstruction', 'Immediate hypersensitivity reactions (angioedema)'],
    },
    contraindications: [
      'Hypersensitivity to tiotropium bromide, ipratropium, or atropine derivatives',
      'Severe hypersensitivity to milk proteins (HandiHaler dry powder formulation containing lactose)',
    ],
    drugInteractions: {
      major: [
        'Other anticholinergic medications (e.g., ipratropium, aclidinium, umeclidinium, glycopyrrolate): additive systemic antimuscarinic side effects; avoid concomitant chronic use',
      ],
      common: [
        'Sedating antihistamines and tricyclic antidepressants: additive mild dry mouth, constipation, and urinary hesitancy',
      ],
    },
    monitoringParameters: [
      'Pulmonary function tests (FEV1, FVC) and COPD exacerbation frequency',
      'Urinary symptoms (hesitancy, retention), particularly in patients with prostatic hypertrophy',
      'Ocular signs and symptoms (eye pain, redness, visual halos)',
      'Renal function (creatinine clearance) in elderly patients with moderate-to-severe impairment',
    ],
    dosageForms: [
      'Inhalation Powder Capsule (Spiriva HandiHaler): 18 mcg capsule',
      'Inhalation Spray (Spiriva Respimat): 1.25 mcg/actuation (asthma), 2.5 mcg/actuation (COPD)',
    ],
    administrationAndCounseling: [
      'HandiHaler capsules are for ORAL INHALATION ONLY using the HandiHaler device; NEVER SWALLOW CAPSULES WHOLE.',
      'Take two separate deep inhalations from the HandiHaler mouthpiece to ensure the full capsule contents are emptied.',
      'Do not allow powder or mist to enter the eyes, as this may precipitate eye pain, mydriasis, or acute angle-closure glaucoma.',
      'This is a once-daily maintenance controller medication; do not use as a rescue treatment for sudden bronchospasm.',
    ],
  },

  Montelukast: {
    genericName: 'Montelukast',
    brandNames: ['Singulair'],
    pharmacologicClass: 'Leukotriene Receptor Antagonist (LTRA)',
    therapeuticClass: 'Antiasthmatic / Antiallergic',
    mechanismOfAction:
      'Selectively and competitively binds with high affinity to cysteinyl leukotriene receptor type-1 (CysLT1) in airway smooth muscle and pro-inflammatory leukocytes, blocking the actions of endogenous cysteinyl leukotrienes (LTC4, LTD4, LTE4) that mediate airway edema, smooth muscle contraction, microvascular permeability, and eosinophil migration.',
    dosingRegimens: [
      'Asthma or allergic rhinitis (adults and adolescents >= 15 years): 10 mg orally once daily in the evening',
      'Pediatric asthma / allergic rhinitis (ages 6 to 14 years): 5 mg chewable tablet orally once daily in the evening',
      'Pediatric asthma / allergic rhinitis (ages 2 to 5 years): 4 mg chewable tablet or oral granules once daily in the evening',
      'Exercise-induced bronchoconstriction prevention: 10 mg orally at least 2 hours before exercise (do not take additional doses within 24 hours)',
    ],
    sideEffects: {
      common: ['Headache', 'Abdominal pain', 'Dyspepsia', 'Upper respiratory tract infection', 'Pharyngitis', 'Dizziness', 'Fever'],
      severe: ['Serious neuropsychiatric events (suicidality, agitation, depression)', 'Systemic eosinophilia / Churg-Strauss syndrome (EGPA)', 'Hepatotoxicity', 'Severe hypersensitivity (anaphylaxis, angioedema)'],
    },
    contraindications: ['Hypersensitivity to montelukast or any component of the formulation'],
    drugInteractions: {
      major: [
        'Phenobarbital, phenytoin, rifampin: strong CYP enzyme inducers may decrease montelukast plasma concentrations by approximately 40%; monitor clinical response',
      ],
      common: [
        'Gemfibrozil: moderate CYP2C8 inhibitor that may modestly increase montelukast AUC',
      ],
    },
    monitoringParameters: [
      'Neuropsychiatric symptoms (mood changes, vivid dreams, sleep disturbances, agitation, depressive symptoms, suicidal thoughts or behaviors)',
      'Asthma control, rescue inhaler frequency, and daytime/nighttime symptom frequency',
      'Complete blood count with differential (eosinophil count) if systemic vasculitic symptoms develop',
      'Liver function enzymes in patients presenting with right upper quadrant abdominal pain or jaundice',
    ],
    dosageForms: [
      'Film-Coated Oral Tablets: 10 mg',
      'Chewable Oral Tablets: 4 mg, 5 mg',
      'Oral Granules: 4 mg per packet',
    ],
    blackBoxWarning:
      'Serious neuropsychiatric events: Montelukast carries a boxed warning highlighting the risk of serious neuropsychiatric events including agitation, aggression, depression, sleep disturbances, and suicidal thoughts or actions. Healthcare professionals should assess benefits and risks before prescribing montelukast, particularly for allergic rhinitis, and patients/caregivers must be counseled to immediately discontinue therapy and contact their provider if changes in behavior or mood occur.',
    administrationAndCounseling: [
      'Take once daily in the evening with or without food for asthma maintenance.',
      'Alert family and healthcare providers immediately if you experience unusual changes in behavior, vivid nightmares, agitation, severe anxiety, depression, or suicidal thoughts.',
      'Montelukast is not indicated for acute bronchospasm; always have a fast-acting rescue inhaler readily available.',
      'Oral granules can be administered directly into the mouth or mixed with a spoonful of cold soft food (applesauce, carrots, rice, or ice cream) within 15 minutes of opening.',
    ],
  },

  Budesonide: {
    genericName: 'Budesonide',
    brandNames: ['Rhinocort Aqua', 'Pulmicort'],
    pharmacologicClass: 'Inhaled / Intranasal Glucocorticoid',
    therapeuticClass: 'Antiasthmatic / Antiallergic',
    mechanismOfAction:
      'Potent non-halogenated glucocorticosteroid with high affinity for glucocorticoid receptors, modulating gene transcription to inhibit cellular mediator release from mast cells, eosinophils, neutrophils, and lymphocytes, reducing microvascular leakage and bronchial/nasal hyperresponsiveness while undergoing extensive (approx. 90%) first-pass hepatic metabolism.',
    dosingRegimens: [
      'Asthma maintenance (Pulmicort Flexhaler, adults): 360 mcg to 720 mcg inhaled orally twice daily (maximum 720 mcg twice daily)',
      'Pediatric asthma nebulization (Pulmicort Respules, ages 12 months to 8 years): 0.5 mg to 1 mg total daily dose administered once daily or divided twice daily via jet nebulizer',
      'Allergic rhinitis (Rhinocort Aqua, adults and children >= 12 years): 1 to 2 sprays (32 mcg/spray) in each nostril once daily (64 to 128 mcg/day)',
    ],
    sideEffects: {
      common: ['Oral candidiasis (thrush)', 'Pharyngitis', 'Dysphonia', 'Cough', 'Epistaxis (nasal spray)', 'Headache'],
      severe: ['Adrenal insufficiency / HPA axis suppression', 'Decreased bone mineral density', 'Glaucoma and posterior subcapsular cataracts', 'Growth suppression in pediatric patients', 'Paradoxical bronchospasm'],
    },
    contraindications: [
      'Primary treatment of status asthmaticus or other acute episodes of bronchospasm requiring rapid bronchodilation',
      'Hypersensitivity to budesonide or formulation excipients',
    ],
    drugInteractions: {
      major: [
        'Potent CYP3A4 inhibitors (ketoconazole, itraconazole, clarithromycin, ritonavir, cobicistat): substantially elevate budesonide systemic exposure and increase systemic corticosteroid toxicity',
      ],
      common: [
        'Systemic corticosteroids: potential additive hypothalamic-pituitary-adrenal axis suppression',
      ],
    },
    monitoringParameters: [
      'Pulmonary function tests (FEV1, peak flow) and clinical symptom logs',
      'Oral cavity inspection for mucosal white patches (candidiasis)',
      'Linear growth velocity in pediatric patients receiving chronic therapy',
      'Ophthalmic exams and bone mineral density during prolonged high-dose therapy',
    ],
    dosageForms: [
      'Dry Powder Inhaler (Flexhaler): 90 mcg/actuation, 180 mcg/actuation',
      'Inhalation Suspension (Respules): 0.25 mg/2 mL, 0.5 mg/2 mL, 1 mg/2 mL',
      'Nasal Spray Suspension: 32 mcg/actuation',
    ],
    administrationAndCounseling: [
      'Rinse mouth thoroughly with water and spit it out after each oral inhalation to prevent oral candidiasis and hoarseness.',
      'For Pulmicort Respules: administer via jet nebulizer connected to compressor; do not use ultrasonic nebulizers.',
      'Clean child’s face after nebulizer mask treatment to avoid facial erythema or contact dermatitis.',
      'This is a daily controller medication and must not be used as a rescue inhaler for acute shortness of breath.',
    ],
  },

  Omalizumab: {
    genericName: 'Omalizumab',
    brandNames: ['Xolair'],
    pharmacologicClass: 'Anti-IgE Recombinant Humanized Monoclonal Antibody',
    therapeuticClass: 'Biologic Antiasthmatic / Chronic Urticaria Agent',
    mechanismOfAction:
      'Humanized IgG1 kappa monoclonal antibody that selectively binds to the C-epsilon-3 domain of free human immunoglobulin E (IgE), preventing IgE from binding to high-affinity Fc-epsilon-RI receptors on basophils and mast cells, thereby dramatically reducing free serum IgE, down-regulating Fc-epsilon-RI expression, and dampening immediate and late-phase allergic cascades.',
    dosingRegimens: [
      'Moderate-to-severe persistent allergic asthma: 75 mg to 375 mg subcutaneously every 2 or 4 weeks, determined by baseline serum total IgE level (IU/mL) and body weight (kg)',
      'Chronic spontaneous urticaria: 150 mg or 300 mg subcutaneously every 4 weeks',
      'Chronic rhinosinusitis with nasal polyps: 75 mg to 600 mg subcutaneously every 2 or 4 weeks based on baseline serum IgE and weight',
      'IgE-mediated food allergy: 75 mg to 600 mg subcutaneously every 2 or 4 weeks based on baseline serum IgE and weight',
    ],
    sideEffects: {
      common: ['Injection site reactions (pain, erythema, swelling)', 'Headache', 'Nasopharyngitis', 'Arthralgia', 'Sinusitis', 'Upper respiratory tract infection'],
      severe: ['Anaphylaxis (can occur after first or subsequent doses, and may be delayed > 24 hours)', 'Malignancy risk (observed in early clinical trials)', 'Parasitic (helminth) infection susceptibility', 'Arterial thrombotic events (myocardial infarction, stroke)'],
    },
    contraindications: [
      'Severe hypersensitivity reaction to omalizumab or any component of the formulation',
    ],
    drugInteractions: {
      major: [
        'Live attenuated vaccines: evaluate risk-benefit; systemic immunomodulation may alter protective response',
      ],
      common: [
        'Concomitant systemic corticosteroids: do not abruptly discontinue oral steroids upon initiating omalizumab; taper gradually under medical supervision',
      ],
    },
    monitoringParameters: [
      'Immediate and delayed post-injection observation for signs and symptoms of anaphylaxis',
      'Baseline serum total IgE and body weight (used to establish initial dosing chart; do not retest IgE during therapy as total IgE remains elevated)',
      'Asthma exacerbation frequency, oral corticosteroid requirement, and FEV1',
      'Helminth infection monitoring in endemic geographic regions',
    ],
    dosageForms: [
      'Subcutaneous Solution in Prefilled Syringe: 75 mg/0.5 mL, 150 mg/1 mL, 300 mg/2 mL',
      'Subcutaneous Autoinjector: 75 mg/0.5 mL, 150 mg/1 mL, 300 mg/2 mL',
      'Lyophilized Powder for Injection: 150 mg single-dose vial',
    ],
    blackBoxWarning:
      'Anaphylaxis: Anaphylaxis presenting as bronchospasm, hypotension, syncope, urticaria, and/or angioedema has been reported following administration of omalizumab. Anaphylaxis may occur after the first dose or after more than one year of therapy, and can be delayed in onset (> 24 hours). Patients must be observed following administration by healthcare providers equipped to manage life-threatening anaphylaxis and should carry an epinephrine autoinjector.',
    administrationAndCounseling: [
      'Administer subcutaneously in upper arm, thigh, or abdomen; rotate injection sites.',
      'Carry prescribed epinephrine autoinjector at all times and understand the signs of anaphylaxis (throat tightness, wheezing, hives, dizziness, tongue swelling).',
      'Remain in healthcare facility for appropriate observation period after each injection.',
      'Do not stop or decrease other asthma medications unless explicitly instructed by your physician.',
    ],
  },

  Benzonatate: {
    genericName: 'Benzonatate',
    brandNames: ['Tessalon Perles', 'Zonatuss'],
    pharmacologicClass: 'Voltage-Gated Sodium Channel Blocker / Tetracaine Congener',
    therapeuticClass: 'Non-Narcotic Antitussive',
    mechanismOfAction:
      'Structurally related to tetracaine; acts peripherally by anesthetizing the stretch-sensitive receptors of vagal afferent nerve fibers located in the respiratory passages, pleura, and alveoli, dampening the transmission of the cough reflex at its source without suppressing the medullary respiratory center.',
    dosingRegimens: [
      'Cough suppression (adults and children > 10 years): 100 mg to 200 mg orally 3 times daily as needed (maximum 600 mg/day in divided doses)',
    ],
    sideEffects: {
      common: ['Dizziness', 'Headache', 'Sedation', 'Nasal congestion', 'Nausea', 'Constipation', 'Mild GI upset'],
      severe: ['Oropharyngeal numbness and airway compromise from chewing/crushing capsules', 'Hypersensitivity reactions (bronchospasm, laryngospasm, cardiovascular collapse)', 'Fatal pediatric overdose / accidental ingestion toxicity (cardiac arrest, seizures, coma within 15-20 minutes)'],
    },
    contraindications: [
      'Known hypersensitivity to benzonatate or related local anesthetics of the ester class (e.g., tetracaine, procaine)',
    ],
    drugInteractions: {
      major: [
        'Central nervous system depressants: additive sedative and psychomotor impairment effects',
      ],
      common: [
        'Concomitant oral local anesthetics: potential additive local mucosal numbness',
      ],
    },
    monitoringParameters: [
      'Frequency and severity of cough',
      'Signs of accidental pediatric ingestion (rapid onset seizures, lethargy, cardiac arrest)',
      'Oropharyngeal numbness or swallowing impairment',
    ],
    dosageForms: [
      'Oral Liquid-Filled Capsules (Perles): 100 mg, 150 mg, 200 mg',
    ],
    administrationAndCounseling: [
      'Swallow capsules whole with water; DO NOT BITE, CHEW, DISSOLVE, OR CUT capsules.',
      'Chewing or dissolving the capsule in the mouth releases benzonatate, which can cause rapid numbness of the tongue, mouth, and throat, leading to choking and severe airway obstruction.',
      'Keep out of reach of children; accidental ingestion of even 1 or 2 capsules by young children has resulted in fatal toxicity within minutes.',
      'Seek emergency medical assistance immediately if experiencing numbness of the mouth or throat, difficulty swallowing, or breathing problems.',
    ],
  },

  Cyclobenzaprine: {
    genericName: 'Cyclobenzaprine',
    brandNames: ['Flexeril', 'Amrix', 'Fexmid'],
    pharmacologicClass: 'Centrally Acting Skeletal Muscle Relaxant / TCA-Derivative',
    therapeuticClass: 'Spasmolytic / Skeletal Muscle Relaxant',
    mechanismOfAction:
      'Structurally related to tricyclic antidepressants; acts primarily within the central nervous system at the brainstem level to reduce tonic somatic motor activity influencing both alpha and gamma motor neurons, alleviating skeletal muscle spasms of local musculoskeletal origin without directly depressing muscle fibers or the neuromuscular junction.',
    dosingRegimens: [
      'Acute painful musculoskeletal spasm (immediate-release): 5 mg to 10 mg orally 3 times daily (maximum 30 mg/day; limit therapy to 2 to 3 weeks)',
      'Extended-release (Amrix): 15 mg to 30 mg orally once daily in the morning',
    ],
    sideEffects: {
      common: ['Drowsiness / sedation', 'Dry mouth', 'Dizziness', 'Fatigue', 'Headache', 'Nausea', 'Blurred vision'],
      severe: ['Serotonin syndrome (when combined with serotonergic agents)', 'Cardiac arrhythmias, tachycardia, and heart block', 'Prolonged QT interval', 'Anticholinergic psychosis / confusion in elderly patients'],
    },
    contraindications: [
      'Concomitant use or within 14 days of monoamine oxidase inhibitors (MAOIs) due to risk of hyperpyretic crisis and severe seizures',
      'Acute recovery phase of myocardial infarction',
      'Cardiac arrhythmias, heart block, conduction disturbances, or congestive heart failure',
      'Hyperthyroidism',
    ],
    drugInteractions: {
      major: [
        'MAO inhibitors: hyperpyretic crisis, severe convulsions, and death; strictly contraindicated within 14 days',
        'Serotonergic agents (SSRIs, SNRIs, tramadol, TCAs): substantial risk of life-threatening serotonin syndrome',
        'CNS depressants and alcohol: profound sedation, psychomotor impairment, and respiratory depression',
      ],
      common: [
        'Anticholinergic medications: additive dry mouth, constipation, urinary retention, and blurred vision',
        'Inhibitors of CYP1A2 (e.g., ciprofloxacin, fluvoxamine): increase cyclobenzaprine plasma levels',
      ],
    },
    monitoringParameters: [
      'Relief of muscle spasm and local musculoskeletal pain',
      'Mental status, daytime drowsiness, and sedation',
      'Heart rate, pulse, and baseline ECG in patients with cardiac conduction abnormalities',
      'Signs and symptoms of serotonin syndrome (clonus, hyperreflexia, autonomic instability)',
    ],
    dosageForms: [
      'Oral Tablets (Immediate-Release): 5 mg, 7.5 mg, 10 mg',
      'Oral Capsules (Extended-Release, Amrix): 15 mg, 30 mg',
    ],
    administrationAndCounseling: [
      'Use only for short periods (up to 2 to 3 weeks); efficacy has not been demonstrated for longer durations.',
      'May cause pronounced drowsiness and dizziness; avoid driving, operating machinery, or performing hazardous tasks until response is known.',
      'Do not consume alcohol while taking cyclobenzaprine due to dangerous additive sedation.',
      'Swallow extended-release capsules whole, or open and sprinkle contents onto applesauce without chewing.',
    ],
  },

  Baclofen: {
    genericName: 'Baclofen',
    brandNames: ['Lioresal', 'Gablofen'],
    pharmacologicClass: 'Centrally Acting GABA-B Receptor Agonist',
    therapeuticClass: 'Antispasticity Agent / Skeletal Muscle Relaxant',
    mechanismOfAction:
      'Structural analogue of the inhibitory neurotransmitter gamma-aminobutyric acid (GABA); selectively binds to presynaptic and postsynaptic GABA-B receptors in the spinal cord, hyperpolarizing motor terminals, inhibiting calcium influx, and suppressing monosynaptic and polysynaptic reflex transmission, thereby relieving spasticity and clonus from upper motor neuron lesions.',
    dosingRegimens: [
      'Oral spasticity therapy: Initiate at 5 mg orally 3 times daily; titrate every 3 days by 5 mg/dose up to 10 mg to 20 mg 3 to 4 times daily (typical range 40 to 80 mg/day in divided doses; maximum 80 mg/day)',
      'Intrathecal infusion (severe chronic spasticity): Post-implant screening test, followed by continuous programmable pump infusion titrated to clinical response (typically 100 to 800 mcg/day)',
    ],
    sideEffects: {
      common: ['Drowsiness / sedation', 'Dizziness', 'Weakness', 'Fatigue', 'Nausea', 'Confusion', 'Headache', 'Hypotonia'],
      severe: ['Severe withdrawal syndrome upon abrupt cessation (hallucinations, seizures, hyperpyrexia, rhabdomyolysis, death)', 'Respiratory depression', 'Severe encephalopathy / coma', 'Hypotension and bradycardia'],
    },
    contraindications: [
      'Hypersensitivity to baclofen or any component of the formulation',
      'Intrathecal formulation contraindicated for intravenous, intramuscular, subcutaneous, or epidural administration',
    ],
    drugInteractions: {
      major: [
        'CNS depressants, opioids, and benzodiazepines: profound additive sedation, psychomotor depression, respiratory failure, and coma',
      ],
      common: [
        'Antihypertensive agents: additive hypotensive effects',
        'Tricyclic antidepressants: potentiate muscle weakness and sedation',
      ],
    },
    monitoringParameters: [
      'Degree of spasticity reduction, muscle tone, and functional mobility (ensure reduction in tone does not impair weight-bearing ability)',
      'Mental status, level of consciousness, and daytime sedation',
      'Renal function (baclofen is primarily eliminated unchanged by the kidneys; dose adjustment required in renal impairment)',
      'Signs of pump malfunction or catheter displacement in intrathecal pump recipients',
    ],
    dosageForms: [
      'Oral Tablets: 5 mg, 10 mg, 20 mg',
      'Oral Solution: 5 mg/5 mL',
      'Intrathecal Solution for Infusion: 50 mcg/mL, 500 mcg/mL, 1000 mcg/mL, 2000 mcg/mL',
    ],
    blackBoxWarning:
      'Abrupt discontinuation of intrathecal baclofen: Abrupt discontinuation of intrathecal baclofen, regardless of the cause, has resulted in high fever, altered mental status, exaggerated rebound spasticity, muscle rigidity, rhabdomyolysis, multiple organ-system failure, and death. Patients and caregivers must be educated on the importance of maintaining scheduled refill visits and recognizing early symptoms of withdrawal (rebound spasticity, pruritus, fever).',
    administrationAndCounseling: [
      'NEVER STOP TAKING BACLOFEN ABRUPTLY; sudden discontinuation can cause severe withdrawal symptoms including hallucinations, seizures, high fever, and extreme muscle rigidity.',
      'Take with food or milk if stomach upset occurs.',
      'Avoid alcohol and other sedating medications that can worsen drowsiness and dizziness.',
      'For intrathecal pump patients: seek emergency medical attention immediately if spasticity suddenly returns, as this may signify pump or catheter failure.',
    ],
  },

  Methocarbamol: {
    genericName: 'Methocarbamol',
    brandNames: ['Robaxin'],
    pharmacologicClass: 'Centrally Acting Skeletal Muscle Relaxant / Carbamate Derivative',
    therapeuticClass: 'Spasmolytic / Skeletal Muscle Relaxant',
    mechanismOfAction:
      'Centrally acting carbamate derivative; exact mechanism is not fully established, but muscle relaxation is attributed to general central nervous system depression without direct action on the contractile mechanism of striated muscle, the motor end plate, or the peripheral nerve fiber.',
    dosingRegimens: [
      'Acute painful musculoskeletal conditions (initial): 1500 mg orally 4 times daily for the first 48 to 72 hours',
      'Maintenance dose: 1000 mg 4 times daily or 750 mg every 4 hours (typical maintenance 4000 to 4500 mg/day in divided doses)',
      'Intravenous / Intramuscular: 1000 mg IV/IM every 8 hours as needed (maximum 3000 mg/day for up to 3 consecutive days)',
    ],
    sideEffects: {
      common: ['Drowsiness / somnolence', 'Dizziness', 'Lightheadedness', 'Nausea', 'Headache', 'Metallic taste', 'Urine discoloration (black, brown, or green)'],
      severe: ['Anaphylactic reactions and angioedema', 'Severe bradycardia and hypotension (IV administration)', 'Syncope', 'Seizures (reported with IV injection)'],
    },
    contraindications: [
      'Hypersensitivity to methocarbamol or formulation components',
      'Renal impairment (injectable formulation contains polyethylene glycol 300 excipient which may cause renal failure and metabolic acidosis)',
    ],
    drugInteractions: {
      major: [
        'CNS depressants, benzodiazepines, opioids, and alcohol: additive central nervous system depression and respiratory compromise',
      ],
      common: [
        'Anticholinesterase agents (e.g., pyridostigmine): methocarbamol may inhibit anticholinesterase efficacy in myasthenia gravis',
      ],
    },
    monitoringParameters: [
      'Relief of skeletal muscle spasm and pain symptoms',
      'Degree of sedation, drowsiness, and psychomotor coordination',
      'Blood pressure and heart rate during IV/IM injection',
      'Renal function and urine output with parenteral therapy',
    ],
    dosageForms: [
      'Oral Tablets: 500 mg, 750 mg',
      'Injectable Solution: 100 mg/mL (10 mL vials)',
    ],
    administrationAndCounseling: [
      'May cause urine to turn black, brown, or dark green; this discoloration is harmless and will resolve when medication is stopped.',
      'Take with food to minimize gastrointestinal upset.',
      'Avoid driving or operating machinery until you know how this medication affects you, as it frequently causes marked drowsiness and dizziness.',
      'Avoid drinking alcohol while taking methocarbamol as it compounds central nervous system sedation.',
    ],
  },

  Tizanidine: {
    genericName: 'Tizanidine',
    brandNames: ['Zanaflex'],
    pharmacologicClass: 'Central Alpha-2 Adrenergic Agonist',
    therapeuticClass: 'Antispasticity Agent / Centrally Acting Muscle Relaxant',
    mechanismOfAction:
      'Centrally acting selective alpha-2 adrenergic receptor agonist that acts predominantly in the spinal cord; stimulates presynaptic alpha-2 receptors to inhibit the release of excitatory amino acid neurotransmitters (aspartate, glutamate) from spinal interneurons, leading to reduced polysynaptic reflex activity and decreased spasticity.',
    dosingRegimens: [
      'Spasticity management: Initiate with a single dose of 2 mg to 4 mg orally; titrate gradually by 2 mg to 4 mg every 1 to 4 days up to a maximum single dose of 8 mg and maximum total daily dose of 36 mg/day in 3 divided doses (doses peak at 1 to 2 hours and dissipate in 3 to 6 hours)',
    ],
    sideEffects: {
      common: ['Drowsiness / sedation', 'Dry mouth', 'Hypotension', 'Dizziness', 'Asthenia / weakness', 'Bradycardia', 'Constipation'],
      severe: ['Severe symptomatic hypotension and syncope', 'Hepatotoxicity (elevated transaminases, jaundice, liver failure)', 'Hallucinations and psychotic symptoms', 'Rebound hypertension and tachycardia upon abrupt cessation'],
    },
    contraindications: [
      'Concomitant use with potent CYP1A2 inhibitors (specifically ciprofloxacin or fluvoxamine), which causes marked increases in tizanidine exposure and severe hypotension',
      'Hypersensitivity to tizanidine or formulation components',
    ],
    drugInteractions: {
      major: [
        'Potent CYP1A2 inhibitors (ciprofloxacin, fluvoxamine): strictly contraindicated; dramatically increase tizanidine AUC (up to 33-fold) and Cmax, causing profound hypotension and prolonged somnolence',
        'Moderate CYP1A2 inhibitors (e.g., amiodarone, cimetidine, fluoroquinolones, oral contraceptives): avoid or monitor intensively; significant elevation of tizanidine levels',
        'Antihypertensive medications: additive hypotensive and bradycardic effects',
        'CNS depressants and alcohol: potentiate somnolence, psychomotor depression, and motor impairment',
      ],
      common: [
        'Sedating antihistamines: increased dry mouth and sedation',
      ],
    },
    monitoringParameters: [
      'Baseline and periodic serum liver function tests (AST, ALT, total bilirubin) during the first 6 months of therapy',
      'Blood pressure (sitting and standing) and heart rate, especially during initial titration',
      'Spasticity and muscle tone reduction',
      'Excessive sedation, dizziness, and cognitive impairment',
    ],
    dosageForms: [
      'Oral Tablets: 2 mg, 4 mg',
      'Oral Capsules: 2 mg, 4 mg, 6 mg',
    ],
    administrationAndCounseling: [
      'Maintain consistency regarding food intake; food significantly alters the absorption profile between tablets and capsules, so always take consistently either with food or on an empty stomach.',
      'Do not stop taking tizanidine abruptly; doses should be tapered slowly to prevent severe rebound hypertension and tachycardia.',
      'Rise slowly from a seated or lying position to prevent orthostatic dizziness or fainting.',
      'Avoid driving or operating machinery due to prominent somnolence, especially within 1 to 2 hours after dosing.',
    ],
  },

  'Amphetamine / Dextroamphetamine': {
    genericName: 'Amphetamine / Dextroamphetamine',
    brandNames: ['Adderall'],
    pharmacologicClass: 'Central Nervous System (CNS) Stimulant / Mixed Amphetamine Salts',
    therapeuticClass: 'ADHD Agent / Narcolepsy Medication (C-II)',
    mechanismOfAction:
      'Sympathomimetic amine blend of d- and l-amphetamine enantiomers; promotes the release of norepinephrine and dopamine from presynaptic nerve terminals into the synaptic cleft, and blocks catecholamine reuptake by competitive inhibition of dopamine (DAT) and norepinephrine (NET) transporters, augmenting adrenergic and dopaminergic signaling in the prefrontal cortex.',
    dosingRegimens: [
      'Attention-Deficit/Hyperactivity Disorder (immediate-release): Initiate at 5 mg orally once or twice daily; increase weekly by 5 mg to 10 mg/day (typical range 10 mg to 40 mg/day in 1 to 3 divided doses, morning and midday)',
      'ADHD extended-release (Adderall XR): Initiate at 20 mg orally once daily in the morning (titrated up to 30 mg to 40 mg/day)',
      'Narcolepsy: 5 mg to 60 mg/day orally in divided doses',
    ],
    sideEffects: {
      common: ['Insomnia', 'Decreased appetite / anorexia', 'Weight loss', 'Xerostomia (dry mouth)', 'Headache', 'Abdominal pain', 'Anxiety / irritability', 'Tachycardia'],
      severe: ['Abuse, misuse, and addiction (C-II controlled substance)', 'Sudden cardiac death, myocardial infarction, and stroke', 'Severe hypertension and arrhythmias', 'Exacerbation of pre-existing psychosis, bipolar mania, or new psychotic/manic symptoms', 'Peripheral vasculopathy (Raynaud phenomenon)'],
    },
    contraindications: [
      'Concomitant use or within 14 days of monoamine oxidase inhibitors (MAOIs) due to risk of hypertensive crisis',
      'Advanced arteriosclerosis, symptomatic cardiovascular disease, moderate-to-severe hypertension',
      'Hyperthyroidism',
      'Known hypersensitivity or idiosyncrasy to sympathomimetic amines',
      'Glaucoma',
      'Agitated states or history of severe substance use disorder',
    ],
    drugInteractions: {
      major: [
        'MAO inhibitors: severe hypertensive crisis, hyperpyrexia, cerebral hemorrhage, and death; strictly contraindicated within 14 days',
        'Serotonergic agents (SSRIs, SNRIs, triptans, tramadol): increased risk of serotonin syndrome',
        'CYP2D6 inhibitors (paroxetine, fluoxetine, bupropion): increase amphetamine concentrations and adverse effects',
        'Gastrointestinal alkalizing agents (sodium bicarbonate, antacids): increase amphetamine absorption and reduce urinary excretion',
      ],
      common: [
        'Acidifying agents (ascorbic acid, ammonium chloride): lower amphetamine gastrointestinal absorption and accelerate renal excretion',
        'Antihypertensive agents: amphetamines directly antagonize hypotensive efficacy',
      ],
    },
    monitoringParameters: [
      'Blood pressure and resting heart rate at baseline and every visit',
      'Growth velocity (height and weight) in pediatric patients at frequent intervals',
      'Psychiatric symptoms (emergence of anxiety, agitation, aggression, psychosis, or suicidal ideation)',
      'Signs of drug diversion, misuse, or substance use disorder',
    ],
    dosageForms: [
      'Oral Tablets (Immediate-Release): 5 mg, 7.5 mg, 10 mg, 12.5 mg, 15 mg, 20 mg, 30 mg',
      'Oral Capsules (Extended-Release, Adderall XR): 5 mg, 10 mg, 15 mg, 20 mg, 25 mg, 30 mg',
    ],
    blackBoxWarning:
      'Abuse, misuse, and addiction: Amphetamines have a high potential for abuse and misuse, which can lead to the development of a substance use disorder, including addiction. Misuse and abuse of CNS stimulants can result in overdose and death. Healthcare providers should assess the risk of abuse prior to prescribing and monitor for signs of misuse, abuse, and addiction throughout therapy.',
    administrationAndCounseling: [
      'Take dose in the morning to prevent late-night insomnia; avoid taking afternoon or evening doses.',
      'Adderall XR capsules can be swallowed whole or opened and sprinkled onto a small spoonful of applesauce; swallow without chewing.',
      'This is a Schedule II controlled substance; store securely in a safe place to prevent theft, loss, or unauthorized diversion.',
      'Report any chest pain, palpitations, shortness of breath, unexplained fainting, or sudden mood changes to your physician immediately.',
    ],
  },

  Lisdexamfetamine: {
    genericName: 'Lisdexamfetamine',
    brandNames: ['Vyvanse'],
    pharmacologicClass: 'Central Nervous System (CNS) Stimulant / Dextroamphetamine Prodrug',
    therapeuticClass: 'ADHD Agent / Binge Eating Disorder Medication (C-II)',
    mechanismOfAction:
      'Therapeutically inactive prodrug consisting of d-amphetamine covalently linked to L-lysine; following oral absorption, undergoes enzymatic hydrolysis by red blood cells in the systemic circulation to release active dextroamphetamine, which stimulates release and blocks reuptake of norepinephrine and dopamine in presynaptic cortical neurons.',
    dosingRegimens: [
      'ADHD (adults and children >= 6 years): Initiate at 30 mg orally once daily in the morning; titrate by 10 mg to 20 mg weekly up to a maximum of 70 mg once daily',
      'Moderate to severe Binge Eating Disorder (BED): Initiate at 30 mg orally once daily in the morning; titrate in increments of 20 mg weekly to target dose of 50 mg to 70 mg once daily',
    ],
    sideEffects: {
      common: ['Decreased appetite', 'Insomnia', 'Dry mouth', 'Headache', 'Weight loss', 'Upper abdominal pain', 'Irritability', 'Tachycardia', 'Nausea'],
      severe: ['High potential for abuse, misuse, and addiction (C-II)', 'Sudden unexplained cardiac death in patients with structural heart defects', 'Severe hypertension and tachyarrhythmias', 'New or worsening psychiatric symptoms (psychosis, mania, paranoia)', 'Peripheral vasculopathy (Raynaud syndrome)'],
    },
    contraindications: [
      'Concomitant use or within 14 days of monoamine oxidase inhibitors (MAOIs)',
      'Known hypersensitivity to amphetamine products or formulation components',
    ],
    drugInteractions: {
      major: [
        'MAO inhibitors: severe hypertensive crisis, hyperpyrexia, and fatal cerebrovascular accidents; strictly contraindicated within 14 days',
        'Serotonergic agents (SSRIs, SNRIs, triptans): increased risk of serotonin syndrome',
        'CYP2D6 inhibitors: increase circulating active dextroamphetamine concentrations',
      ],
      common: [
        'Urinary acidifiers: decrease dextroamphetamine half-life and accelerate elimination',
        'Antihypertensive agents: lisdexamfetamine antagonizes blood pressure-lowering effects',
      ],
    },
    monitoringParameters: [
      'Blood pressure and heart rate monitoring at each clinical visit',
      'Height and weight trajectory in children to detect growth deceleration',
      'Assessment for emergence of psychotic or manic symptoms, agitation, or aggression',
      'Screening for potential diversion, drug-seeking behavior, and substance use disorder',
    ],
    dosageForms: [
      'Oral Capsules: 10 mg, 20 mg, 30 mg, 40 mg, 50 mg, 60 mg, 70 mg',
      'Chewable Oral Tablets: 10 mg, 20 mg, 30 mg, 40 mg, 50 mg, 60 mg',
    ],
    blackBoxWarning:
      'Abuse, misuse, and addiction: Lisdexamfetamine is a central nervous system (CNS) stimulant with a high potential for abuse and dependence. Misuse and abuse of CNS stimulants can result in severe cardiovascular events, overdose, and death. Prior to prescribing, assess patient risk for substance abuse and monitor for signs of misuse and addiction throughout therapy.',
    administrationAndCounseling: [
      'Take once daily in the morning with or without food; taking late in the day can cause significant sleep disturbance.',
      'Capsules may be swallowed whole or opened and the entire contents dissolved in water, orange juice, or yogurt; consume immediately.',
      'Keep medication stored securely to prevent theft, sharing, or diversion; illegal to transfer to any other person.',
      'Notify your doctor immediately if you notice unexplained chest discomfort, shortness of breath, heart palpitations, or hallucinations.',
    ],
  },

  Methylphenidate: {
    genericName: 'Methylphenidate',
    brandNames: [
      'Aptensio XR',
      'Concerta',
      'Daytrana',
      'Metadate CD',
      'Metadate ER',
      'Methylin',
      'Quillivant XR',
      'Ritalin',
      'Ritalin LA',
    ],
    pharmacologicClass: 'Central Nervous System (CNS) Stimulant / Piperidine Derivative',
    therapeuticClass: 'ADHD Agent / Narcolepsy Medication (C-II)',
    mechanismOfAction:
      'Mild central nervous system stimulant; selectively inhibits the presynaptic reuptake of norepinephrine and dopamine by blocking the dopamine transporter (DAT) and norepinephrine transporter (NET), thereby increasing extracellular catecholamine concentrations in the prefrontal cortex and striatum.',
    dosingRegimens: [
      'ADHD immediate-release (Ritalin): 20 mg to 30 mg/day orally divided 2 to 3 times daily, taken 30 to 45 minutes before meals (initial 5 mg twice daily; maximum 60 mg/day)',
      'ADHD extended-release (Concerta): Initiate at 18 mg or 36 mg orally once daily in the morning; titrate by 18 mg weekly up to a maximum of 54 mg to 72 mg once daily',
      'Transdermal patch (Daytrana): Apply 1 patch daily to hip area 2 hours before effect is needed; wear for up to 9 hours (10 mg, 15 mg, 20 mg, or 30 mg patches)',
    ],
    sideEffects: {
      common: ['Decreased appetite', 'Insomnia', 'Nervousness / anxiety', 'Headache', 'Nausea', 'Abdominal pain', 'Weight loss', 'Xerostomia', 'Tachycardia'],
      severe: ['Abuse, misuse, and addiction (Schedule II substance)', 'Sudden cardiac death, stroke, and myocardial infarction', 'Severe hypertension and ventricular arrhythmias', 'Exacerbation or de novo emergence of psychotic or manic symptoms', 'Priapism (prolonged and painful penile erection)', 'Peripheral vasculopathy (Raynaud phenomenon)'],
    },
    contraindications: [
      'Concomitant use or within 14 days of monoamine oxidase inhibitors (MAOIs)',
      'Known hypersensitivity to methylphenidate or formulation components',
      'Marked anxiety, tension, or agitation',
      'Glaucoma',
      'Motor tics or family history of Tourette syndrome',
    ],
    drugInteractions: {
      major: [
        'MAO inhibitors: risk of hypertensive crisis; contraindicated within 14 days of MAOI therapy',
        'Centrally acting alpha-2 agonists (clonidine): serious adverse events have been reported with combination use',
        'Antihypertensive agents: methylphenidate may decrease hypotensive effectiveness',
      ],
      common: [
        'Warfarin, phenytoin, and tricyclic antidepressants: methylphenidate may inhibit metabolism and raise serum concentrations of these agents',
        'Alcohol: causes dose-dumping with certain extended-release bead formulations',
      ],
    },
    monitoringParameters: [
      'Blood pressure and resting heart rate at baseline, dose adjustments, and regular intervals',
      'Growth metrics (height and weight) in pediatric patients',
      'Psychiatric status (screen for emergence of mania, depression, aggression, or suicidal ideation)',
      'Signs of misuse, diversion, or substance dependence',
    ],
    dosageForms: [
      'Oral Tablets (Immediate-Release, Ritalin): 5 mg, 10 mg, 20 mg',
      'Oral Extended-Release Tablets (Concerta, OROS): 18 mg, 27 mg, 36 mg, 54 mg',
      'Oral Extended-Release Capsules (Ritalin LA, Metadate CD): 10 mg, 20 mg, 30 mg, 40 mg',
      'Oral Solution: 5 mg/5 mL, 10 mg/5 mL',
      'Transdermal Patch (Daytrana): 10 mg, 15 mg, 20 mg, 30 mg per 9-hour wear',
    ],
    blackBoxWarning:
      'Abuse, misuse, and addiction: CNS stimulants, including methylphenidate, have a high potential for abuse and dependence. Assess the risk of abuse prior to prescribing, and monitor for signs of misuse, abuse, and addiction throughout therapy. Misuse of CNS stimulants can result in serious adverse cardiovascular events, overdose, and death.',
    administrationAndCounseling: [
      'Take in the morning; taking late in the afternoon or evening can cause severe insomnia.',
      'Concerta tablets MUST BE SWALLOWED WHOLE with liquids; do not chew, crush, or divide (uses an osmotic pressure OROS delivery system where non-absorbable tablet shell passes into stool).',
      'Store in a secure lockbox or safe place to prevent unauthorized access or drug diversion.',
      'Seek prompt medical care for chest pain, shortness of breath, unexplained fainting, or prolonged, painful erections.',
    ],
  },

  Dexmethylphenidate: {
    genericName: 'Dexmethylphenidate',
    brandNames: ['Focalin'],
    pharmacologicClass: 'Central Nervous System (CNS) Stimulant / D-Enantiomer of Methylphenidate',
    therapeuticClass: 'ADHD Agent (C-II)',
    mechanismOfAction:
      'More pharmacologically active d-threo-enantiomer of racemic methylphenidate; blocks the presynaptic reuptake of norepinephrine and dopamine by inhibiting the dopamine transporter (DAT) and norepinephrine transporter (NET), thereby enhancing monoaminergic transmission in cortical and subcortical pathways.',
    dosingRegimens: [
      'ADHD immediate-release (Focalin): Initiate at 2.5 mg orally twice daily (morning and at lunchtime, at least 4 hours apart); titrate weekly by 2.5 mg to 5 mg up to a maximum of 20 mg/day (10 mg twice daily)',
      'ADHD extended-release (Focalin XR): Initiate at 5 mg to 10 mg orally once daily in the morning; titrate weekly by 5 mg to 10 mg up to a maximum of 40 mg once daily (adults) or 30 mg once daily (pediatrics)',
    ],
    sideEffects: {
      common: ['Decreased appetite', 'Insomnia', 'Nausea', 'Abdominal pain', 'Headache', 'Dry mouth', 'Anxiety / nervousness', 'Tachycardia'],
      severe: ['Abuse, misuse, and addiction (Schedule II substance)', 'Sudden unexplained cardiac death in patients with pre-existing heart conditions', 'Hypertension and cardiac arrhythmias', 'New psychotic or manic symptoms', 'Priapism', 'Peripheral vasculopathy (Raynaud phenomenon)'],
    },
    contraindications: [
      'Concomitant use or within 14 days of monoamine oxidase inhibitors (MAOIs)',
      'Known hypersensitivity to methylphenidate, dexmethylphenidate, or formulation components',
      'Marked anxiety, motor tics, or family history of Tourette syndrome',
      'Glaucoma',
    ],
    drugInteractions: {
      major: [
        'MAO inhibitors: risk of hypertensive crisis; contraindicated within 14 days',
        'Antihypertensive medications: dexmethylphenidate may diminish hypotensive efficacy',
      ],
      common: [
        'Antacids or H2 blockers: may alter release rate of extended-release formulations',
        'Alcohol: avoid concomitant ingestion which may accelerate release of dexmethylphenidate from extended-release capsules',
      ],
    },
    monitoringParameters: [
      'Blood pressure and heart rate at baseline and regularly during therapy',
      'Growth parameters (height, weight, BMI) in children and adolescents',
      'Psychiatric evaluation for emergence of mood changes, aggression, or hallucinations',
      'Monitoring for signs of drug-seeking, diversion, or abuse',
    ],
    dosageForms: [
      'Oral Tablets (Immediate-Release): 2.5 mg, 5 mg, 10 mg',
      'Oral Capsules (Extended-Release, Focalin XR): 5 mg, 10 mg, 15 mg, 20 mg, 25 mg, 30 mg, 35 mg, 40 mg',
    ],
    blackBoxWarning:
      'Abuse, misuse, and addiction: CNS stimulants, including dexmethylphenidate, have a high potential for abuse and dependence. Prior to prescribing, evaluate each patient\'s risk for abuse and addiction, and monitor regularly for signs of diversion or substance use disorder. Misuse of CNS stimulants carries risk of serious cardiovascular complications, overdose, and death.',
    administrationAndCounseling: [
      'Administer in the morning; avoid evening doses to minimize sleep disruption.',
      'Focalin XR capsules may be swallowed whole or opened and the intact beads sprinkled onto a tablespoon of applesauce; consume immediately without chewing beads.',
      'Store in a secure, locked location away from children and visitors.',
      'Contact your healthcare provider immediately if you experience chest pain, heart palpitations, fainting, or sudden visual changes.',
    ],
  },

  Phentermine: {
    genericName: 'Phentermine',
    brandNames: ['Adipex-P', 'Suprenza'],
    pharmacologicClass: 'Sympathomimetic Amine / Anorexiant',
    therapeuticClass: 'Antiobesity Agent / Appetite Suppressant (C-IV)',
    mechanismOfAction:
      'Centrally acting sympathomimetic amine; stimulates the release of norepinephrine and to a lesser extent dopamine and serotonin from presynaptic nerve terminals in the lateral hypothalamic feeding center, suppressing appetite and increasing resting energy expenditure.',
    dosingRegimens: [
      'Short-term adjunct in exogenous obesity (BMI >= 30 kg/m2 or >= 27 kg/m2 with comorbidities): 15 mg to 37.5 mg orally once daily in the morning before breakfast or 1 to 2 hours after breakfast (limit duration to short-term course, typically up to 12 weeks)',
      'Low-dose regimen: 8 mg (Lomaira) orally 3 times daily, 30 minutes before meals',
    ],
    sideEffects: {
      common: ['Insomnia', 'Dry mouth', 'Restlessness', 'Headache', 'Irritability', 'Palpitations', 'Tachycardia', 'Constipation', 'Unpleasant taste'],
      severe: ['Primary pulmonary arterial hypertension (PPH)', 'Valvular heart disease (regurgitation)', 'Severe hypertension and stroke', 'Psychotic episodes and hallucination', 'Physical and psychological dependence'],
    },
    contraindications: [
      'History of cardiovascular disease (e.g., coronary artery disease, stroke, arrhythmias, congestive heart failure, uncontrolled hypertension)',
      'Concomitant use or within 14 days of monoamine oxidase inhibitors (MAOIs)',
      'Hyperthyroidism',
      'Glaucoma',
      'Agitated states or history of drug abuse',
      'Pregnancy and breastfeeding',
    ],
    drugInteractions: {
      major: [
        'MAO inhibitors: risk of hypertensive crisis; contraindicated within 14 days',
        'Other weight loss agents or SSRIs/serotonergic medications: associated with fatal pulmonary hypertension and heart valve disorders',
        'Antihypertensive agents: phentermine antagonizes blood pressure-lowering effects',
      ],
      common: [
        'Alcohol: may increase adverse CNS effects such as dizziness, lightheadedness, and impaired concentration',
      ],
    },
    monitoringParameters: [
      'Blood pressure and resting heart rate prior to initiation and periodically throughout therapy',
      'Cardiopulmonary examination for new heart murmurs, dyspnea, angina, syncope, or lower extremity edema',
      'Weight loss progression and body mass index',
      'Mental status and behavioral changes (insomnia, agitation, anxiety)',
    ],
    dosageForms: [
      'Oral Tablets: 8 mg, 37.5 mg',
      'Oral Capsules: 15 mg, 30 mg, 37.5 mg',
      'Orally Disintegrating Tablets: 15 mg, 30 mg, 37.5 mg',
    ],
    administrationAndCounseling: [
      'Take once daily in the morning before breakfast or 1 to 2 hours after breakfast; avoid late afternoon or evening doses to prevent insomnia.',
      'Indicated only for short-term use (a few weeks) alongside a comprehensive lifestyle modification program (reduced-calorie diet and regular exercise).',
      'Discontinue medication and seek immediate medical evaluation if you develop unexplained shortness of breath, chest pain, palpitations, or fainting.',
      'May impair alertness; use caution when driving or operating machinery.',
    ],
  },

  Atomoxetine: {
    genericName: 'Atomoxetine',
    brandNames: ['Strattera'],
    pharmacologicClass: 'Selective Norepinephrine Reuptake Inhibitor (SNRI)',
    therapeuticClass: 'Non-Stimulant ADHD Agent',
    mechanismOfAction:
      'Selectively and potently inhibits the presynaptic norepinephrine transporter (NET) with minimal affinity for other monoamine transporters or neurotransmitter receptors, augmenting extracellular norepinephrine and dopamine concentrations in the prefrontal cortex without increasing dopamine in the striatum or nucleus accumbens (yielding no significant abuse potential).',
    dosingRegimens: [
      'ADHD (adults and adolescents > 70 kg): Initiate at 40 mg orally once daily in the morning; titrate after a minimum of 3 days to target dose of 80 mg once daily (or divided twice daily); maximum 100 mg/day',
      'ADHD (children and adolescents <= 70 kg): Initiate at 0.5 mg/kg/day orally; titrate after minimum 3 days to target dose of 1.2 mg/kg/day (maximum 1.4 mg/kg/day or 100 mg/day)',
    ],
    sideEffects: {
      common: ['Nausea', 'Dry mouth', 'Decreased appetite', 'Insomnia', 'Fatigue', 'Dyspepsia', 'Erectile dysfunction / urinary retention', 'Constipation'],
      severe: ['Suicidal ideation in children and adolescents (boxed warning)', 'Severe idiosyncratic liver injury / acute hepatic failure', 'Cardiovascular events (QTc prolongation, severe hypertension, tachycardia)', 'Severe allergic reactions (angioedema, urticaria)', 'Priapism'],
    },
    contraindications: [
      'Concomitant use or within 14 days of monoamine oxidase inhibitors (MAOIs)',
      'Narrow-angle glaucoma',
      'Pheochromocytoma or history of pheochromocytoma',
      'Severe cardiovascular or cerebrovascular disorders that would deteriorate with clinically meaningful increases in heart rate or blood pressure',
    ],
    drugInteractions: {
      major: [
        'MAO inhibitors: risk of hyperthermia, rigidity, myoclonus, autonomic instability, and death; strictly contraindicated within 14 days',
        'Strong CYP2D6 inhibitors (paroxetine, fluoxetine, quinidine): dramatically increase atomoxetine exposure (up to 6- to 8-fold); dose adjustment required',
        'Pressor agents and beta-agonists: additive cardiovascular pressor and tachycardic effects',
      ],
      common: [
        'QT-prolonging medications: potential additive risk of cardiac ventricular repolarization delay',
      ],
    },
    monitoringParameters: [
      'Emergence of suicidal thoughts, behavioral changes, agitation, irritability, or unusual mood shifts, especially during initial titration',
      'Liver function enzymes and symptoms of liver injury (pruritus, dark urine, jaundice, upper right quadrant tenderness)',
      'Blood pressure and heart rate at baseline, after dose increases, and periodically',
      'Growth and weight progression in pediatric patients',
    ],
    dosageForms: [
      'Oral Capsules: 10 mg, 18 mg, 25 mg, 40 mg, 60 mg, 80 mg, 100 mg',
    ],
    blackBoxWarning:
      'Suicidal ideation in children and adolescents: Atomoxetine increased the risk of suicidal ideation in short-term studies in children and adolescents with ADHD. Anyone considering the use of atomoxetine in a child or adolescent must balance this risk with the clinical need. Patients initiated on therapy should be monitored closely for suicidality, clinical worsening, or unusual changes in behavior.',
    administrationAndCounseling: [
      'Take with or without food; taking with meals can significantly reduce gastrointestinal upset and nausea.',
      'SWALLOW CAPSULES WHOLE; do not open capsules because atomoxetine is an ocular irritant if powder contacts the eyes.',
      'Caregivers and family members should monitor closely for signs of depression, anxiety, agitation, aggression, or suicidal thoughts, particularly during the first few weeks of therapy.',
      'Unlike stimulant medications, atomoxetine is non-controlled and therapeutic benefits typically develop gradually over 2 to 4 weeks.',
    ],
  },

  Levothyroxine: {
    genericName: 'Levothyroxine',
    brandNames: ['Synthroid', 'Levoxyl', 'Tirosint', 'Unithroid'],
    pharmacologicClass: 'Synthetic Thyroid Hormone (T4)',
    therapeuticClass: 'Thyroid Replacement Hormone',
    mechanismOfAction:
      'Synthetic crystalline L-3,3\',5,5\'-tetraiodothyronine (T4); converted peripherally in target tissues by 5\'-deiodinases into the active metabolite liothyronine (T3), which enters the cell nucleus and binds to thyroid hormone nuclear receptors, regulating gene transcription to control basal metabolic rate, protein synthesis, carbohydrate and lipid metabolism, and growth and development.',
    dosingRegimens: [
      'Primary hypothyroidism (adults without cardiac disease): 1.6 mcg/kg/day orally (based on ideal body weight), adjusted in increments of 12.5 mcg to 25 mcg every 4 to 6 weeks based on serum TSH',
      'Elderly or patients with coronary artery disease: Initiate at 12.5 mcg to 25 mcg orally once daily; titrate cautiously every 6 to 8 weeks',
      'Myxedema coma (IV): Initial loading dose of 300 mcg to 500 mcg IV, followed by daily IV maintenance of 50 mcg to 100 mcg until oral therapy can be resumed',
    ],
    sideEffects: {
      common: ['Palpitations', 'Tachycardia', 'Insomnia', 'Weight loss', 'Heat intolerance', 'Tremors', 'Headache', 'Diarrhea', 'Anxiety'],
      severe: ['Cardiac arrhythmias (atrial fibrillation, flutter)', 'Angina pectoris and myocardial infarction (especially in elderly or CAD patients)', 'Bone mineral density loss / osteopenia from chronic over-replacement', 'Thyrotoxicosis'],
    },
    contraindications: [
      'Uncorrected adrenal insufficiency (thyroid hormone increases metabolic clearance of glucocorticoids and may precipitate acute adrenal crisis)',
      'Untreated thyrotoxicosis',
      'Acute myocardial infarction',
      'Hypersensitivity to levothyroxine sodium or formulation excipients',
    ],
    drugInteractions: {
      major: [
        'Oral anticoagulants (warfarin): levothyroxine enhances catabolism of vitamin K-dependent clotting factors, significantly increasing INR and bleeding risk; reduce warfarin dose and monitor closely',
        'Calcium carbonate, ferrous sulfate, aluminum hydroxide, cholestyramine, sucralfate, sevelamer, and proton pump inhibitors: dramatically decrease levothyroxine gastrointestinal absorption; separate by at least 4 hours',
      ],
      common: [
        'Estrogens, tamoxifen, and oral contraceptives: increase thyroid-binding globulin (TBG), requiring higher levothyroxine doses',
        'Enzyme-inducing anticonvulsants (carbamazepine, phenytoin, phenobarbital) and rifampin: accelerate hepatic T4 clearance',
        'Antidiabetic medications: levothyroxine may worsen glycemic control, requiring antidiabetic dosage adjustments',
      ],
    },
    monitoringParameters: [
      'Serum Thyroid Stimulating Hormone (TSH) and free T4 levels every 6 to 8 weeks during titration until euthyroid, then annually',
      'Heart rate, pulse, blood pressure, and signs of cardiac decompensation or angina',
      'Clinical symptoms of hypo- or hyperthyroidism (fatigue, weight fluctuations, cold/heat tolerance, bowel habits)',
      'Bone mineral density in postmenopausal women on long-term therapy',
    ],
    dosageForms: [
      'Oral Tablets: 25 mcg, 50 mcg, 75 mcg, 88 mcg, 100 mcg, 112 mcg, 125 mcg, 137 mcg, 150 mcg, 175 mcg, 200 mcg, 300 mcg',
      'Oral Gel Capsules (Tirosint): 13 mcg, 25 mcg, 50 mcg, 75 mcg, 88 mcg, 100 mcg, 112 mcg, 125 mcg, 137 mcg, 150 mcg, 175 mcg, 200 mcg',
      'Oral Solution (Tirosint-SOL): 13 mcg to 200 mcg per single-dose ampule',
      'Injectable Solution: 100 mcg/vial, 200 mcg/vial, 500 mcg/vial',
    ],
    blackBoxWarning:
      'Ineffective and potentially toxic for treatment of obesity or weight loss: Thyroid hormones, including levothyroxine, either alone or with other therapeutic agents, should not be used for the treatment of obesity or weight reduction. In euthyroid patients, doses within the range of daily hormonal requirements are ineffective for weight reduction. Larger doses may produce serious or even life-threatening manifestations of toxicity, particularly when given in association with sympathomimetic amines such as those used for their anorectic effects.',
    administrationAndCounseling: [
      'Take once daily in the morning on an empty stomach with a full glass of water, at least 30 to 60 minutes before breakfast or caffeine intake.',
      'Separate administration of calcium supplements, iron pills, antacids, multivitamins, and bile acid sequestrants by at least 4 hours.',
      'Levothyroxine is a lifelong replacement therapy; do not discontinue even when feeling well.',
      'Maintain brand-to-generic consistency; notify your pharmacist or doctor before switching manufacturers as narrow therapeutic index requires precise TSH tracking.',
    ],
  },

  Thyroid: {
    genericName: 'Thyroid',
    brandNames: ['Armour Thyroid'],
    pharmacologicClass: 'Desiccated Thyroid Extract (Porcine T4 and T3 Combination)',
    therapeuticClass: 'Thyroid Replacement Hormone',
    mechanismOfAction:
      'Natural preparation derived from cleaned, dried, and powdered porcine thyroid glands; contains both levothyroxine (T4) and liothyronine (T3) in a standardized approximate physiological ratio of 4.22:1 (approx. 38 mcg T4 and 9 mcg T3 per 1 grain / 60 mg); binds to nuclear thyroid receptors to regulate basal cellular metabolic rate, tissue growth, and energy expenditure.',
    dosingRegimens: [
      'Primary hypothyroidism (adults): Initiate at 30 mg (1/2 grain) orally once daily; titrate by 15 mg to 30 mg increments every 2 to 3 weeks based on clinical symptoms and serum thyroid parameters (usual maintenance 60 mg to 120 mg / 1 to 2 grains daily)',
      'Geriatric patients or patients with cardiovascular disease: Initiate with 15 mg (1/4 grain) daily; titrate at longer intervals (every 4 to 6 weeks)',
    ],
    sideEffects: {
      common: ['Palpitations', 'Tachycardia', 'Tremor', 'Nervousness', 'Insomnia', 'Excessive sweating', 'Weight loss', 'Heat intolerance', 'Diarrhea'],
      severe: ['Cardiac arrhythmias (atrial fibrillation, tachycardia)', 'Angina pectoris and congestive heart failure', 'Thyrotoxicosis from T3 peak levels', 'Decreased bone density from over-replacement'],
    },
    contraindications: [
      'Uncorrected adrenal cortical insufficiency',
      'Untreated thyrotoxicosis',
      'Acute myocardial infarction',
      'Hypersensitivity to pork products or active porcine thyroid extract',
    ],
    drugInteractions: {
      major: [
        'Oral anticoagulants (warfarin): thyroid extract increases catabolism of clotting factors, potentiating warfarin action and elevating bleeding risk; monitor INR closely',
        'Bile acid resins, calcium carbonate, iron supplements, and aluminum antacids: interfere with gastrointestinal absorption of T3 and T4; separate by at least 4 hours',
      ],
      common: [
        'Antidiabetic agents: thyroid hormone administration may increase insulin or oral hypoglycemic requirements',
        'Estrogens: increase serum thyroxine-binding globulin, potentially requiring higher thyroid replacement doses',
      ],
    },
    monitoringParameters: [
      'Serum TSH, free T4, and total/free T3 levels (draw blood prior to daily morning dose because oral T3 causes transient peak post-absorption spikes)',
      'Clinical symptoms of euthyroid status versus thyrotoxic excess (resting pulse, heat/cold tolerance, tremor)',
      'Heart rate, pulse regularity, and blood pressure',
      'Bone mineral density in patients receiving chronic suppressive therapy',
    ],
    dosageForms: [
      'Oral Tablets: 15 mg (1/4 grain), 30 mg (1/2 grain), 60 mg (1 grain), 90 mg (1.5 grain), 120 mg (2 grain), 180 mg (3 grain), 240 mg (4 grain), 300 mg (5 grain)',
    ],
    blackBoxWarning:
      'Ineffective and potentially toxic for treatment of obesity or weight loss: Thyroid hormone drugs should not be used either alone or in combination with other agents for the treatment of obesity or weight reduction. In euthyroid patients, doses within the range of daily hormonal requirements are ineffective for weight reduction. Larger doses may produce serious or even life-threatening manifestations of toxicity, especially when given in conjunction with sympathomimetic amines such as those used for anorectic purposes.',
    administrationAndCounseling: [
      'Take once daily in the morning on an empty stomach with water, at least 30 to 60 minutes before breakfast.',
      'Separate from calcium, iron, or antacid supplements by at least 4 hours to avoid impaired absorption.',
      'Contains pork products (porcine source); inform your healthcare provider if you have dietary restrictions or pork allergies.',
      'Do not adjust dosage on your own; thyroid replacement requires careful medical and laboratory monitoring.',
    ],
  },
};
