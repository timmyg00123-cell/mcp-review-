import type { TopDrugClinicalMonograph } from './types.js';

export const CAT24_HORMONAL: Record<string, TopDrugClinicalMonograph> = {
  'Oral Contraceptive - Monophasic': {
    genericName: 'Oral Contraceptive - Monophasic',
    brandNames: [
      'Ortho-Cept',
      'Desogen',
      'Lo/Ovral',
      'Loestrin',
      'Loestrin Fe',
      'Ortho-Cyclen',
      'Ovcon-35',
      'Femcon Fe',
      'Brevcon',
      'Modicon',
      'Ortho-Novum 1/35',
      'Norinyl 1+35',
      'Ogestrel',
      'Ovcon-50',
      'Zovia 1/50E',
      'Necon 1/50',
      'Yasmin',
    ],
    pharmacologicClass: 'Monophasic Estrogen and Progestin Combination',
    therapeuticClass: 'Contraceptive',
    mechanismOfAction:
      'Provides constant daily doses of synthetic estrogen (ethinyl estradiol) and progestin throughout the 21 active days of the cycle, suppressing hypothalamic gonadotropin-releasing hormone (GnRH) and pituitary LH and FSH secretion, thereby inhibiting ovulation, thickening cervical mucus to prevent sperm penetration, and altering the endometrium to prevent implantation.',
    dosingRegimens: [
      'Contraception (28-day cycle pack): Take 1 active tablet PO once daily at the same time each day for 21 consecutive days, followed by 1 inert / placebo tablet daily for 7 days',
      'Contraception (24/4 cycle pack): Take 1 active tablet PO once daily for 24 days, followed by 4 placebo tablets daily',
    ],
    sideEffects: {
      common: ['Nausea', 'Breakthrough bleeding / spotting', 'Breast tenderness', 'Headache', 'Weight changes / fluid retention', 'Mood changes', 'Dysmenorrhea'],
      severe: ['Venous thromboembolism (deep vein thrombosis, pulmonary embolism)', 'Arterial thromboembolism (myocardial infarction, ischemic stroke)', 'Hepatic adenomas and hepatocellular carcinoma', 'Gallbladder disease', 'Hypertension', 'Hyperkalemia (drospirenone-containing formulations)'],
    },
    contraindications: [
      'Cigarette smoking and age >= 35 years',
      'Current or past deep vein thrombosis, pulmonary embolism, stroke, or coronary artery disease',
      'Known or suspected breast cancer or other estrogen-dependent neoplasia',
      'Undiagnosed abnormal uterine bleeding',
      'Uncontrolled hypertension or vascular disease',
      'Migraine with focal neurological aura',
      'Current or past liver tumors or active liver disease',
    ],
    drugInteractions: {
      major: ['Cytochrome P450 3A4 inducers (rifampin, carbamazepine, phenytoin, phenobarbital, topiramate, St. John\'s wort - significantly reduce contraceptive steroid levels; backup non-hormonal contraception required)'],
      common: ['Lamotrigine (estrogen induces lamotrigine glucuronidation, halving lamotrigine blood levels)', 'Potassium-sparing drugs (with drospirenone)', 'Certain protease inhibitors'],
    },
    monitoringParameters: [
      'Blood pressure at baseline and annually',
      'Signs and symptoms of thromboembolism (ACHES: Abdominal pain, Chest pain, Headaches, Eye problems, Severe leg pain)',
      'Annual clinical breast exam and cervical cancer screening',
      'Serum potassium in high-risk patients taking drospirenone with potassium-sparing medications',
    ],
    dosageForms: ['Oral Tablet Dispenser Packs: 28 tablets (21 active / 7 inert or 24 active / 4 inert)'],
    blackBoxWarning:
      'WARNING: CIGARETTE SMOKING AND SERIOUS CARDIOVASCULAR EVENTS: Cigarette smoking increases the risk of serious cardiovascular events from combination oral contraceptive use. This risk increases with age, particularly in women over 35 years of age, and with the number of cigarettes smoked (15 or more per day). For this reason, combination oral contraceptives are contraindicated in women who are over 35 years of age and smoke.',
    administrationAndCounseling: [
      'Take one tablet at the exact same time every day (e.g., at bedtime or with dinner) to maximize contraceptive efficacy.',
      'If you miss one active pill, take it as soon as remembered and take the next pill at your regular time (even if taking 2 pills on the same day).',
      'If you miss two or more active pills in a row, use a backup non-hormonal method of birth control (condoms) for 7 consecutive days.',
      'Oral contraceptives do not protect against HIV infection or other sexually transmitted diseases.',
      'Seek emergency medical care immediately if you experience severe leg pain/swelling, sudden shortness of breath, severe chest pain, or sudden severe headache.',
    ],
  },

  'Oral Contraceptive - Biphasic': {
    genericName: 'Oral Contraceptive - Biphasic',
    brandNames: ['Mircette', 'Necon 10/11'],
    pharmacologicClass: 'Biphasic Estrogen and Progestin Combination',
    therapeuticClass: 'Contraceptive',
    mechanismOfAction:
      'Delivers two distinct hormone ratio phases across the 28-day cycle to mimic physiological hormone shifts and reduce total monthly steroid exposure: combines fixed low-dose ethinyl estradiol with stepped progestin levels, suppressing pituitary LH and FSH to prevent follicular maturation and ovulation.',
    dosingRegimens: [
      'Contraception (28-day pack): Take 1 tablet PO daily at the same time each day in the exact sequence indicated on the blister pack (e.g., 21 active tablets containing stepped progestin doses, followed by 2 inert tablets and 5 low-dose estrogen tablets)',
    ],
    sideEffects: {
      common: ['Nausea', 'Breakthrough bleeding / spotting', 'Headache', 'Breast tenderness', 'Bloating', 'Mood lability'],
      severe: ['Thromboembolism (DVT, PE)', 'Stroke and myocardial infarction', 'Hypertension', 'Hepatic neoplasms', 'Cholestatic jaundice'],
    },
    contraindications: [
      'Women > 35 years of age who smoke cigarettes',
      'Current or history of thrombophlebitis, DVT, or thromboembolic disorders',
      'Cerebrovascular or coronary artery disease',
      'Known or suspected breast carcinoma or estrogen-sensitive tumors',
      'Undiagnosed abnormal genital bleeding',
      'Pregnancy',
    ],
    drugInteractions: {
      major: ['Strong CYP3A4 inducers (rifampin, rifabutin, carbamazepine, phenytoin, primidone, St. John\'s wort - increase hormone clearance, causing breakthrough bleeding and contraceptive failure)'],
      common: ['Lamotrigine (decreased lamotrigine efficacy)', 'Antiretrovirals (protease inhibitors)', 'Folate supplementation'],
    },
    monitoringParameters: [
      'Blood pressure annually',
      'Symptoms of thromboembolic disease (severe headache, visual disturbance, leg swelling, chest pain)',
      'Regular cervical cytology and breast examinations',
    ],
    dosageForms: ['Oral Tablet Dispenser: 28-day blister pack'],
    blackBoxWarning:
      'WARNING: CIGARETTE SMOKING AND SERIOUS CARDIOVASCULAR EVENTS: Cigarette smoking increases the risk of serious cardiovascular events from combination oral contraceptive use. This risk increases with age, particularly in women over 35 years of age, and with the number of cigarettes smoked. Combination oral contraceptives should not be used in women who are over 35 years of age and smoke.',
    administrationAndCounseling: [
      'Take at the same time every day; follow the arrows on the dispenser card.',
      'Do not skip days; if a pill is forgotten, follow the specific missed-pill protocol and use backup barrier contraception.',
      'Stop smoking; smoking substantially multiplies the risk of dangerous blood clots, heart attacks, and strokes.',
    ],
  },

  'Oral Contraceptive - Triphasic': {
    genericName: 'Oral Contraceptive - Triphasic',
    brandNames: [
      'Estrostep Fe',
      'Ortho-Tri-Cyclen',
      'Ortho-Tri-Cyclen Lo',
      'Cyclessa',
      'Ortho-Novum 7/7/7',
    ],
    pharmacologicClass: 'Triphasic Estrogen and Progestin Combination',
    therapeuticClass: 'Contraceptive',
    mechanismOfAction:
      'Provides three sequential phases of varying estrogen and progestin concentrations across 21 days (followed by 7 inert or ferrous fumarate tablets), suppressing pituitary gonadotropin secretion (FSH and LH) to block ovulation and thickening cervical mucus while minimizing mid-cycle breakthrough bleeding.',
    dosingRegimens: [
      'Contraception / Moderate Acne Vulgaris: Take 1 tablet PO daily at the same time each day for 28 consecutive days in the exact sequence marked on the dial or blister pack',
    ],
    sideEffects: {
      common: ['Breakthrough bleeding', 'Nausea', 'Breast tenderness', 'Headache', 'Fluid retention', 'Acne flares (initial weeks)', 'Mood changes'],
      severe: ['Venous thromboembolism (pulmonary embolism, deep venous thrombosis)', 'Arterial thrombosis (cerebrovascular accident, myocardial infarction)', 'Hepatic adenomas', 'Retinal thrombosis'],
    },
    contraindications: [
      'Women over 35 who smoke cigarettes',
      'History of deep vein thrombosis, pulmonary embolism, stroke, or CAD',
      'Current or history of breast cancer',
      'Uncontrolled hypertension',
      'Migraine with focal neurological symptoms',
      'Undiagnosed uterine bleeding',
    ],
    drugInteractions: {
      major: ['Enzyme inducers (rifampin, phenytoin, carbamazepine, topiramate, barbiturates - accelerate hepatic steroid clearance; require additional barrier method)'],
      common: ['Lamotrigine (plasma lamotrigine concentrations reduced by ~50%)', 'Atorvastatin (may increase ethinyl estradiol AUC)'],
    },
    monitoringParameters: [
      'Blood pressure monitoring at baseline and annually',
      'Screening for symptoms of venous and arterial thromboembolism',
      'Clinical examination of breasts and pelvic organs periodically',
    ],
    dosageForms: ['Oral Tablet Dispenser: 28-tablet pack (7 phase-1 tablets, 7 phase-2 tablets, 7 phase-3 tablets, 7 inert/iron tablets)'],
    blackBoxWarning:
      'WARNING: CIGARETTE SMOKING AND SERIOUS CARDIOVASCULAR EVENTS: Cigarette smoking increases the risk of serious cardiovascular events from combination oral contraceptive use. This risk increases with age, particularly in women over 35 years of age, and with the number of cigarettes smoked. Combination oral contraceptives should not be used in women who are over 35 years of age and smoke.',
    administrationAndCounseling: [
      'Take one tablet daily at the exact same hour; taking at bedtime or with dinner reduces nausea.',
      'Take pills in exact chronological order according to packaging colors.',
      'Use backup contraception (condoms) if pills are missed or if taking rifampin or anti-seizure medications.',
      'Report any sudden vision changes, severe calf swelling, or chest tightness immediately.',
    ],
  },

  Medroxyprogesterone: {
    genericName: 'Medroxyprogesterone',
    brandNames: ['Provera', 'Depo-Provera'],
    pharmacologicClass: 'Synthetic Progestin',
    therapeuticClass: 'Progestin',
    mechanismOfAction:
      'Synthetic derivative of 17-hydroxyprogesterone that binds with high affinity to progesterone receptors, inducing cellular differentiation of estrogen-primed endometrium from proliferative to secretory phase, inhibiting pituitary gonadotropin release to block ovulation, and thickening cervical mucus.',
    dosingRegimens: [
      'Secondary Amenorrhea (Oral Provera): 5 to 10 mg PO once daily for 5 to 10 days',
      'Abnormal Uterine Bleeding (Oral): 5 to 10 mg PO once daily for 5 to 10 days beginning on day 16 or 21 of menstrual cycle',
      'Contraception (Depo-Provera Injection): 150 mg deep IM injection into gluteal or deltoid muscle once every 12 to 13 weeks (every 3 months)',
      'Subcutaneous Contraception (depo-subQ Provera 104): 104 mg SC into anterior thigh or abdomen every 12 to 14 weeks',
    ],
    sideEffects: {
      common: ['Menstrual irregularities / amenorrhea', 'Weight gain (prominent with depot injection)', 'Headache', 'Abdominal pain / bloating', 'Nervousness', 'Dizziness', 'Breast tenderness'],
      severe: ['Significant loss of bone mineral density (osteopenia/osteoporosis with long-term depot use)', 'Venous thromboembolism (pulmonary embolism, DVT)', 'Increased risk of breast cancer and cardiovascular events (when used with estrogens)', 'Depression exacerbation', 'Ectopic pregnancy'],
    },
    contraindications: [
      'Known or suspected pregnancy',
      'Active or past thromboembolic disease or stroke',
      'Known or suspected breast malignancy or estrogen/progestin-dependent neoplasia',
      'Significant liver disease or hepatic tumors',
      'Undiagnosed vaginal bleeding',
    ],
    drugInteractions: {
      major: ['CYP3A4 inducers (carbamazepine, phenytoin, phenobarbital, rifampin, St. John\'s wort - increase medroxyprogesterone clearance)'],
      common: ['Aminoglutethimide (significantly reduces medroxyprogesterone serum levels)'],
    },
    monitoringParameters: [
      'Bone mineral density (DEXA scan) if depot injection is used for > 2 years',
      'Blood pressure and body weight at every visit',
      'Pattern and severity of vaginal bleeding',
      'Screening for depressive symptoms',
    ],
    dosageForms: [
      'Oral Tablet (Provera): 2.5 mg, 5 mg, 10 mg',
      'Intramuscular Injection Suspension (Depo-Provera): 150 mg/mL prefilled syringe or vial',
      'Subcutaneous Injection Suspension: 104 mg/0.65 mL prefilled syringe',
    ],
    blackBoxWarning:
      'WARNING: LOSS OF BONE MINERAL DENSITY; CARDIOVASCULAR DISORDERS, BREAST CANCER, AND PROBABLE DEMENTIA: Women who use Depo-Provera Contraceptive Injection may lose significant bone mineral density. Bone loss is greater with increasing duration of use and may not be completely reversible. Depo-Provera should be used as a long-term birth control method (e.g., longer than 2 years) only if other methods are inadequate. Estrogen plus progestin therapy is associated with increased risks of myocardial infarction, stroke, invasive breast cancer, pulmonary emboli, and deep vein thrombosis in postmenopausal women.',
    administrationAndCounseling: [
      'For contraception: Injections must be repeated every 12 to 13 weeks; ensure pregnancy test is negative if > 13 weeks between injections.',
      'Ensure adequate daily dietary calcium (1,200 mg/day) and vitamin D (800 IU/day) intake and perform weight-bearing exercise to protect bone health.',
      'Depot injections frequently cause irregular bleeding or spotting initially, often leading to complete amenorrhea (no periods) after 1 year.',
      'Return to fertility after discontinuing Depo-Provera may be delayed by an average of 9 to 10 months.',
    ],
  },

  'Estradiol Oral': {
    genericName: 'Estradiol Oral',
    brandNames: ['Estrace'],
    pharmacologicClass: 'Estrogen Hormone Replacement (Oral)',
    therapeuticClass: 'Estrogen',
    mechanismOfAction:
      'Micronized 17-beta-estradiol, chemically identical to endogenous human ovarian estradiol, that binds to nuclear estrogen receptors (ER-alpha and ER-beta) in target tissues, modulating transcription of estrogen-responsive genes to alleviate vasomotor symptoms, prevent bone resorption, and treat urogenital atrophy.',
    dosingRegimens: [
      'Vasomotor Symptoms of Menopause: 0.5 to 2 mg PO once daily continuously or in cyclic regimens (must add a progestin in women with an intact uterus)',
      'Vulvar and Vaginal Atrophy: 1 to 2 mg PO daily adjusted down to minimum effective maintenance dose',
      'Postmenopausal Osteoporosis Prevention: 0.5 mg PO once daily continuously',
    ],
    sideEffects: {
      common: ['Breast tenderness / enlargement', 'Nausea', 'Headache', 'Fluid retention and peripheral edema', 'Breakthrough vaginal bleeding / spotting', 'Abdominal cramps', 'Melasma'],
      severe: ['Endometrial hyperplasia and carcinoma (in women with intact uterus without progestin opposition)', 'Venous thromboembolism (DVT, PE)', 'Stroke and myocardial infarction', 'Invasive breast cancer', 'Dementia (in women >= 65 years)', 'Gallbladder disease'],
    },
    contraindications: [
      'Undiagnosed abnormal genital bleeding',
      'Known, suspected, or history of breast cancer',
      'Known or suspected estrogen-dependent neoplasia',
      'Active or past deep vein thrombosis, pulmonary embolism, or arterial thromboembolic disease',
      'Active or severe hepatic impairment',
      'Known or suspected pregnancy',
    ],
    drugInteractions: {
      major: ['CYP3A4 inducers (carbamazepine, phenytoin, rifampin, St. John\'s wort - decrease estradiol concentrations and efficacy)', 'Strong CYP3A4 inhibitors (ketoconazole, clarithromycin, ritonavir - elevate estradiol levels and side effects)'],
      common: ['Thyroid replacement therapy (oral estrogens increase thyroid-binding globulin [TBG], requiring higher levothyroxine doses)', 'Oral anticoagulants'],
    },
    monitoringParameters: [
      'Blood pressure and body weight',
      'Annual mammogram and clinical breast examination',
      'Prompt endometrial evaluation (biopsy or transvaginal ultrasound) for any undiagnosed postmenopausal vaginal bleeding',
      'Serum TSH in women receiving concurrent thyroid replacement',
    ],
    dosageForms: ['Oral Micronized Tablet: 0.5 mg, 1 mg, 2 mg'],
    blackBoxWarning:
      'WARNING: ENDOMETRIAL CANCER, CARDIOVASCULAR DISORDERS, BREAST CANCER AND PROBABLE DEMENTIA: Estrogens with or without progestins should be prescribed at the lowest effective dose and for the shortest duration consistent with treatment goals. Unopposed estrogen therapy in women with an intact uterus significantly increases the risk of endometrial cancer; adequate progestin supplementation reduces this risk. The Women\'s Health Initiative (WHI) reported increased risks of stroke, DVT, pulmonary embolism, invasive breast cancer, and probable dementia.',
    administrationAndCounseling: [
      'Take once daily with or without food at the same time each day.',
      'If you have not had a hysterectomy (your uterus is intact), you MUST take a progestin medication alongside estradiol to protect against uterine cancer.',
      'Report any unexpected vaginal spotting or bleeding to your healthcare provider immediately.',
      'Use the lowest dose that controls your menopausal symptoms for the shortest necessary duration.',
    ],
  },

  Raloxifene: {
    genericName: 'Raloxifene',
    brandNames: ['Evista'],
    pharmacologicClass: 'Selective Estrogen Receptor Modulator',
    therapeuticClass: 'SERM',
    mechanismOfAction:
      'Selective estrogen receptor modulator (SERM) that binds to estrogen receptors, exhibiting estrogenic agonist effects in bone tissue to reduce osteoclast resorption and preserve bone mineral density, while acting as an estrogenic antagonist in breast and uterine endometrium without stimulating endometrial proliferation.',
    dosingRegimens: [
      'Postmenopausal Osteoporosis Treatment and Prevention: 60 mg PO once daily with or without food',
      'Reduction in Risk of Invasive Breast Cancer in Postmenopausal Women with Osteoporosis or at High Risk: 60 mg PO once daily',
    ],
    sideEffects: {
      common: ['Hot flashes (vasomotor flushes, very common)', 'Leg cramps', 'Peripheral edema', 'Flu-like syndrome', 'Arthralgia', 'Sweating'],
      severe: ['Venous thromboembolism (deep vein thrombosis, pulmonary embolism, retinal vein thrombosis)', 'Fatal stroke (increased risk in women with established coronary disease or risk factors)', 'Cardiovascular events'],
    },
    contraindications: [
      'Active or past history of venous thromboembolic events (DVT, PE, retinal vein thrombosis)',
      'Women of childbearing potential or pregnancy',
      'Known hypersensitivity to raloxifene',
    ],
    drugInteractions: {
      major: ['Systemic estrogens or estrogen therapy (concomitant use not recommended due to competing mechanisms and safety)', 'Warfarin (raloxifene decreases prothrombin time; monitor INR closely upon initiation/discontinuation)'],
      common: ['Cholestyramine and bile acid sequestrants (significantly reduce raloxifene absorption and enterohepatic cycling; avoid coadministration)', 'Ampicillin'],
    },
    monitoringParameters: [
      'Signs and symptoms of venous thromboembolism (unilateral leg pain/swelling, sudden shortness of breath, chest pain)',
      'Bone mineral density (DEXA scan) at baseline and every 1 to 2 years',
      'Annual mammogram and breast exam',
      'Lipid profile (raloxifene lowers total and LDL cholesterol without altering HDL or triglycerides)',
    ],
    dosageForms: ['Oral Film-Coated Tablet: 60 mg'],
    blackBoxWarning:
      'WARNING: INCREASED RISK OF VENOUS THROMBOEMBOLISM AND DEATH FROM STROKE: Increased risk of deep vein thrombosis and pulmonary embolism has been reported with raloxifene. Women with active or past history of venous thromboembolism should not take raloxifene. An increased risk of death due to stroke occurred in a trial of postmenopausal women with documented coronary heart disease or at increased risk for major coronary events. Consider risk-benefit balance in women at risk for stroke.',
    administrationAndCounseling: [
      'Take once daily with or without food at any time of day.',
      'Ensure adequate daily intake of calcium (1,200 mg/day) and vitamin D (800 to 1,000 IU/day).',
      'Discontinue raloxifene at least 72 hours prior to and during prolonged immobilization (such as post-surgical recovery or bed rest) to minimize blood clot risk.',
      'Avoid prolonged sitting during travel; stand and walk periodically.',
      'Hot flashes may occur or worsen when starting this medication.',
    ],
  },

  'Conjugated Estrogens': {
    genericName: 'Conjugated Estrogens',
    brandNames: ['Premarin'],
    pharmacologicClass: 'Estrogen Hormone Replacement',
    therapeuticClass: 'Estrogen',
    mechanismOfAction:
      'Standardized mixture of natural conjugated equine estrogen salts (principally sodium estrone sulfate and sodium equilin sulfate) that activate nuclear estrogen receptors, mimicking endogenous estrogens to stimulate estrogen-responsive target tissues, relieve menopausal hot flashes, and prevent postmenopausal bone loss.',
    dosingRegimens: [
      'Vasomotor Symptoms / Hot Flashes: 0.3 mg, 0.45 mg, or 0.625 mg PO once daily continuously or cyclically (must co-prescribe progestin if uterus intact)',
      'Vulvar and Vaginal Atrophy: 0.3 mg PO daily, or vaginal cream (0.5 to 2 g vaginally daily for 21 days then off for 7 days)',
      'Postmenopausal Osteoporosis Prevention: 0.3 mg PO once daily',
    ],
    sideEffects: {
      common: ['Breast tenderness', 'Headache', 'Nausea', 'Abdominal bloating / cramps', 'Edema', 'Spotting or breakthrough bleeding', 'Mood lability'],
      severe: ['Endometrial cancer (with unopposed estrogen in women with uterus)', 'Venous thromboembolism (deep vein thrombosis, pulmonary embolism)', 'Stroke and myocardial infarction', 'Invasive breast cancer', 'Probable dementia in women >= 65 years', 'Cholestatic jaundice'],
    },
    contraindications: [
      'Undiagnosed abnormal genital bleeding',
      'Known, suspected, or history of breast cancer',
      'Known or suspected estrogen-dependent neoplasia',
      'Active or past DVT, PE, stroke, or myocardial infarction',
      'Active liver dysfunction or disease',
      'Known or suspected pregnancy',
    ],
    drugInteractions: {
      major: ['CYP3A4 inducers (rifampin, carbamazepine, phenytoin, St. John\'s wort - increase estrogen clearance, reducing efficacy)'],
      common: ['CYP3A4 inhibitors (ketoconazole, clarithromycin - elevate estrogen levels)', 'Thyroid hormones (estrogens increase thyroid-binding globulin, requiring increased levothyroxine dose)'],
    },
    monitoringParameters: [
      'Blood pressure at baseline and periodically',
      'Mammography and clinical breast exam annually',
      'Immediate endometrial biopsy for any postmenopausal uterine bleeding',
      'Serum TSH in hypothyroid patients receiving estrogen therapy',
    ],
    dosageForms: ['Oral Tablet: 0.3 mg, 0.45 mg, 0.625 mg, 0.9 mg, 1.25 mg', 'Vaginal Cream: 0.625 mg/g (with calibrated applicator)', 'Intravenous Injection: 25 mg vial'],
    blackBoxWarning:
      'WARNING: ENDOMETRIAL CANCER, CARDIOVASCULAR DISORDERS, BREAST CANCER AND PROBABLE DEMENTIA: Estrogens should be prescribed at the lowest effective dose and for the shortest duration consistent with treatment goals. Unopposed estrogen therapy in women with a uterus increases the risk of endometrial cancer; progestin coadministration reduces this risk. The Women\'s Health Initiative (WHI) reported increased risks of stroke, DVT, pulmonary embolism, invasive breast cancer, and probable dementia in postmenopausal women.',
    administrationAndCounseling: [
      'Take once daily at approximately the same time each day with or without food.',
      'If you still have your uterus, you must take a progestin drug with this medication to protect your uterine lining from cancer.',
      'Report any unexpected vaginal bleeding or spotting to your doctor right away.',
      'Seek immediate emergency care if you develop sudden calf swelling/pain, sudden chest pain, shortness of breath, or weakness on one side of your body.',
    ],
  },

  'Estradiol Transdermal Patch': {
    genericName: 'Estradiol Transdermal Patch',
    brandNames: ['Alora', 'Climara', 'Minivelle', 'Vivelle-Dot', 'Menostar'],
    pharmacologicClass: 'Estrogen Hormone Replacement (Transdermal)',
    therapeuticClass: 'Estrogen',
    mechanismOfAction:
      'Transdermal delivery system containing 17-beta-estradiol that continuously releases physiologic estradiol through the intact skin into the systemic circulation, avoiding hepatic first-pass metabolism, elevating systemic estradiol levels, and treating vasomotor symptoms and postmenopausal bone loss.',
    dosingRegimens: [
      'Vasomotor Symptoms of Menopause: Apply 0.025 mg to 0.1 mg/day patch to clean, dry skin once weekly (Climara) or twice weekly (Vivelle-Dot, Minivelle, Alora); titrate to lowest effective dose; add progestin if uterus intact',
      'Postmenopausal Osteoporosis Prevention: 0.014 mg/day patch once weekly (Menostar) or 0.025 mg/day patch',
    ],
    sideEffects: {
      common: ['Application site erythema / irritation', 'Breast tenderness', 'Headache', 'Fluid retention', 'Nausea', 'Breakthrough bleeding / spotting'],
      severe: ['Endometrial cancer (if unopposed by progestin in women with uterus)', 'Venous thromboembolism (lower baseline risk than oral estrogens, but still present)', 'Stroke', 'Invasive breast cancer', 'Dementia (in women >= 65 years)'],
    },
    contraindications: [
      'Undiagnosed abnormal genital bleeding',
      'Known, suspected, or history of breast cancer',
      'Known or suspected estrogen-dependent neoplasia',
      'Active or past DVT, PE, stroke, or MI',
      'Severe hepatic dysfunction',
      'Pregnancy',
    ],
    drugInteractions: {
      major: ['Strong CYP3A4 inducers (carbamazepine, phenytoin, rifampin, St. John\'s wort - increase estradiol metabolism, although transdermal route bypasses first-pass hepatic metabolism)'],
      common: ['CYP3A4 inhibitors (ketoconazole, clarithromycin)', 'Thyroid hormone replacement (may increase TBG, but less than oral estrogens)'],
    },
    monitoringParameters: [
      'Blood pressure and body weight',
      'Annual mammogram and clinical breast examination',
      'Endometrial evaluation for any unexplained vaginal bleeding',
      'Inspection of patch application skin sites for severe dermatitis',
    ],
    dosageForms: [
      'Transdermal Patch (Twice-Weekly: Vivelle-Dot, Minivelle, Alora): 0.025 mg/day, 0.0375 mg/day, 0.05 mg/day, 0.075 mg/day, 0.1 mg/day',
      'Transdermal Patch (Once-Weekly: Climara, Menostar): 0.014 mg/day, 0.025 mg/day, 0.05 mg/day, 0.06 mg/day, 0.075 mg/day, 0.1 mg/day',
    ],
    blackBoxWarning:
      'WARNING: ENDOMETRIAL CANCER, CARDIOVASCULAR DISORDERS, BREAST CANCER AND PROBABLE DEMENTIA: Estrogens should be prescribed at the lowest effective dose and for the shortest duration consistent with treatment goals. Unopposed estrogen therapy in women with a uterus increases the risk of endometrial cancer. The Women\'s Health Initiative reported increased risks of stroke, DVT, pulmonary embolism, invasive breast cancer, and probable dementia.',
    administrationAndCounseling: [
      'Apply patch to clean, dry, intact skin of the lower abdomen or upper buttocks; NEVER apply to the breasts or waistline.',
      'Rotate application sites with each patch replacement; allow at least 1 week before reapplying to the same skin area.',
      'Press patch firmly in place with the palm of your hand for about 10 seconds to ensure good contact, especially around the edges.',
      'If your uterus is intact, you must take a progestin medication in combination with estradiol to prevent uterine cancer.',
    ],
  },

  Progesterone: {
    genericName: 'Progesterone',
    brandNames: ['Prometrium'],
    pharmacologicClass: 'Micronized Progestin',
    therapeuticClass: 'Progestin',
    mechanismOfAction:
      'Micronized bioidentical progesterone that binds to nuclear progesterone receptors, transforming proliferative endometrium into secretory endometrium, suppressing endometrial mitosis, and protecting against estrogen-induced endometrial hyperplasia and carcinoma in postmenopausal women receiving estrogen replacement.',
    dosingRegimens: [
      'Prevention of Estrogen-Induced Endometrial Hyperplasia: 200 mg PO once daily at bedtime for 12 sequential days per 28-day cycle with daily estrogen',
      'Secondary Amenorrhea: 400 mg PO once daily at bedtime for 10 days',
      'Assisted Reproductive Technology (Vaginal Gel / Insert): 100 to 200 mg vaginally 2 to 3 times daily',
    ],
    sideEffects: {
      common: ['Dizziness / drowsiness (take at bedtime)', 'Headache', 'Breast tenderness', 'Abdominal bloating / cramps', 'Nausea', 'Mood swings / depression', 'Musculoskeletal pain'],
      severe: ['Venous thromboembolism (deep vein thrombosis, pulmonary embolism)', 'Stroke and cardiovascular events', 'Invasive breast cancer (when used with estrogens)', 'Cholestatic jaundice', 'Vision changes or retinal vascular thrombosis'],
    },
    contraindications: [
      'Active or past deep vein thrombosis, pulmonary embolism, or arterial thromboembolism',
      'Known, suspected, or history of breast cancer',
      'Undiagnosed abnormal genital bleeding',
      'Severe hepatic dysfunction or liver disease',
      'Known severe peanut allergy (Prometrium capsules contain peanut oil)',
    ],
    drugInteractions: {
      major: ['Strong CYP3A4 inducers (rifampin, carbamazepine, phenytoin, St. John\'s wort - increase progesterone metabolism and reduce protection against endometrial hyperplasia)'],
      common: ['Strong CYP3A4 inhibitors (ketoconazole, itraconazole - increase progesterone exposure and sedation)', 'Alcohol (enhances sedative and dizzying effects)'],
    },
    monitoringParameters: [
      'Blood pressure and body weight',
      'Endometrial evaluation for any unexpected postmenopausal vaginal bleeding',
      'Annual clinical breast exam and mammogram',
      'Liver function tests in patients with hepatic disease',
    ],
    dosageForms: ['Oral Micronized Capsule (in peanut oil): 100 mg, 200 mg', 'Vaginal Gel (Crinone): 4%, 8%', 'Vaginal Insert (Endometrin): 100 mg'],
    blackBoxWarning:
      'WARNING: CARDIOVASCULAR DISORDERS, BREAST CANCER AND PROBABLE DEMENTIA: Estrogens plus progestins should not be used for the prevention of cardiovascular disease or dementia. The Women\'s Health Initiative (WHI) reported increased risks of deep vein thrombosis, pulmonary embolism, stroke, myocardial infarction, and invasive breast cancer in postmenopausal women receiving conjugated estrogens plus medroxyprogesterone acetate compared to placebo.',
    administrationAndCounseling: [
      'Take once daily at bedtime; progesterone can cause significant drowsiness and dizziness.',
      'DO NOT take Prometrium capsules if you have an allergy to peanuts, as the capsule contains peanut oil; consult your doctor for alternative progestins.',
      'Take with food or a snack; food increases bioavailability.',
      'Report any sudden severe headache, visual disturbances, or leg swelling/pain immediately.',
    ],
  },

  Testosterone: {
    genericName: 'Testosterone',
    brandNames: [
      'Androderm',
      'Androgel',
      'Aveed',
      'Axiron',
      'Fortesta',
      'Striant',
      'Testim',
      'Testopel',
      'Vogelxo',
    ],
    pharmacologicClass: 'Anabolic / Androgenic Steroid',
    therapeuticClass: 'Androgen',
    mechanismOfAction:
      'Endogenous androgenic steroid that binds to intracellular androgen receptors in target tissues, promoting male sexual differentiation, spermatogenesis, secondary sex characteristics, nitrogen retention, skeletal muscle protein synthesis, and epiphyseal maturation; converted in tissues to active dihydrotestosterone (DHT) by 5-alpha-reductase and estradiol by aromatase.',
    dosingRegimens: [
      'Primary or Hypogonadotropic Hypogonadism (Topical Gel 1% / 1.62%): Apply 20.25 to 81 mg testosterone topically once daily in the morning to clean, dry, intact skin of shoulders and upper arms',
      'Hypogonadism (Intramuscular Cypionate / Enanthate): 50 to 400 mg deep IM every 2 to 4 weeks',
      'Hypogonadism (Transdermal Patch Androderm): Apply 2 to 4 mg/day patch to clean, dry skin of back, abdomen, thighs, or upper arms nightly',
      'Long-Acting IM Injection (Aveed / Undecanoate): 750 mg IM initially, repeated at 4 weeks, then every 10 weeks thereafter',
    ],
    sideEffects: {
      common: ['Application site reactions (itching, erythema, burning)', 'Acne and oily skin', 'Increased hematocrit / polycythemia', 'Prostate enlargement / elevated PSA', 'Peripheral edema', 'Gynecomastia', 'Mood swings / aggression'],
      severe: ['Secondary exposure risk to women and children from topical gels (virilization)', 'Venous thromboembolism (DVT, PE)', 'Increased risk of myocardial infarction and stroke', 'Exacerbation of benign prostatic hyperplasia or occult prostate cancer', 'Azoospermia and testicular atrophy', 'Hepatotoxicity (primarily with 17-alpha-alkylated oral formulations)', 'Worsening of obstructive sleep apnea'],
    },
    contraindications: [
      'Men with known or suspected breast cancer or prostate cancer',
      'Women who are pregnant or may become pregnant (teratogenic / virilization of female fetus)',
      'Severe untreated congestive heart failure',
      'Severe untreated obstructive sleep apnea',
    ],
    drugInteractions: {
      major: ['Oral anticoagulants / Warfarin (testosterone enhances anticoagulant response and bleeding risk; monitor INR closely)', 'Insulin and oral antidiabetic agents (androgens increase insulin sensitivity and lower blood glucose; antidiabetic dose reduction may be needed)'],
      common: ['Corticosteroids / ACTH (additive fluid retention and edema)', 'Hepatotoxic medications'],
    },
    monitoringParameters: [
      'Serum total testosterone concentration (draw trough level just prior to application or midway between injections; target mid-normal range)',
      'Hematocrit / Hemoglobin at baseline, 3 to 6 months, and annually (withhold or dose reduce if hematocrit > 54%)',
      'Serum Prostate-Specific Antigen (PSA) and digital rectal exam (DRE) at baseline, 3, 6, and 12 months, then annually',
      'Blood pressure and lipid profile periodically',
      'Liver function tests during long-term therapy',
    ],
    dosageForms: [
      'Topical Gel (Androgel, Fortesta, Testim, Vogelxo): 1%, 1.62%, 2% metered-dose pump or unit-dose packets',
      'Transdermal Patch (Androderm): 2 mg/day, 4 mg/day',
      'Intramuscular Injection (Cypionate / Enanthate): 100 mg/mL, 200 mg/mL',
      'Long-Acting Intramuscular Injection (Aveed / Undecanoate): 750 mg/3 mL vial',
      'Subcutaneous Pellet (Testopel): 75 mg pellet for surgical implantation',
      'Nasal Gel (Natesto): 5.5 mg/actuation',
    ],
    blackBoxWarning:
      'WARNING: SECONDARY EXPOSURE TO TESTOSTERONE IN CHILDREN; BLOOD PRESSURE INCREASES: Virilization has been reported in children who were secondary exposed to topical testosterone products. Children should avoid contact with unwashed or unclothed application sites in men using topical testosterone gels. Topical testosterone can cause blood pressure increases that can increase the risk of major adverse cardiovascular events (MACE). Strictly cover application sites with clothing after the gel has dried.',
    administrationAndCounseling: [
      'For topical gels: Apply in the morning to clean, dry, intact skin of the shoulders and upper arms (never apply to genitals or abdomen unless instructed for specific brand).',
      'Wash hands thoroughly with soap and water immediately after applying gel.',
      'Allow application site to dry completely, then cover with clean clothing to prevent accidental skin-to-skin transfer to women or children.',
      'If skin contact occurs with another person, wash the contact area immediately with soap and water.',
      'Avoid swimming, showering, or bathing for at least 2 to 5 hours after gel application.',
      'Store in a secure location (DEA Schedule III controlled substance).',
    ],
  },
};
