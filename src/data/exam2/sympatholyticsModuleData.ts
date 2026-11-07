import { ReviewModule, ReviewPage } from '../../types/reviewModule';
import { SYMPATHOLYTICS_STRUCTURES } from './exam2Structures';

export const sympatholyticsPages: ReviewPage[] = [
  // ---------------------------------------------------------------------------
  // PAGE 1: Beta-Blockers Overview & SAR (Questions 1 - 7)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 1,
    title: 'Adrenergic Receptor Antagonists: Beta-Blockers Overview & SAR',
    subtitle: 'Aryloxypropanolamine pharmacophore, cardioselectivity, bronchospasm precautions, and mixed alpha/beta blockade',
    sections: [
      {
        sectionTitle: 'Beta-Blocker Prototypes & Chemical Classification',
        block_instructions: 'Consider Structures I through VI to answer questions 1–7.',
        structures: [
          SYMPATHOLYTICS_STRUCTURES.propranolol,
          SYMPATHOLYTICS_STRUCTURES.metoprolol,
          SYMPATHOLYTICS_STRUCTURES.esmolol,
          SYMPATHOLYTICS_STRUCTURES.carvedilol,
          SYMPATHOLYTICS_STRUCTURES.pindolol,
          SYMPATHOLYTICS_STRUCTURES.nadolol,
        ],
        questions: [
          {
            id: 401,
            questionNumberLabel: 'Question 1',
            title: 'Chemical Class of Standard Beta-Blockers',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following best describes the chemical class of the above drugs (Structures I through VI)?',
            options: [
              'Benzothiadiazine-1,1-dioxide',
              '1,4-Dihydropyridine',
              'Aryloxypropanolamine',
              'Arylethanolamine',
              'Sulfamoyl anthranilic acid',
              'Steroid',
              'Peptidomimetic'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: Benzothiadiazine-1,1-dioxides are thiazide diuretics.',
              'Incorrect: 1,4-Dihydropyridines are dihydropyridine calcium channel blockers.',
              'Correct: Classical beta-blockers feature an aromatic ring connected to an oxymethylene bridge (-O-CH2-CH(OH)-CH2-NH-R), defining the aryloxypropanolamine pharmacophore.',
              'Incorrect: Arylethanolamines lack the oxymethylene oxygen bridge (e.g., labetalol, epinephrine, isoproterenol).',
              'Incorrect: Sulfamoyl anthranilic acids are loop diuretics (e.g., furosemide).',
              'Incorrect: These are not steroid derivatives.',
              'Incorrect: These are not peptide mimetics.'
            ],
            overallExplanation: 'Aryloxypropanolamines are characterized by the Ar-O-CH2-CH(OH)-CH2-NH-CH(CH3)2 (or tert-butyl) backbone. Insertion of the oxymethylene bridge (-O-CH2-) into the arylethanolamine template retained high beta-receptor affinity while converting agonists into potent competitive antagonists.',
            highYieldPearl: 'Aryloxypropanolamines = Ar-O-CH2-CH(OH)-CH2-NH-R. Prototype = Propranolol. The (2S)-absolute configuration is essential for beta-blocking activity.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 1, Question 1',
            sourcePageNumber: 1
          },
          {
            id: 402,
            questionNumberLabel: 'Question 2',
            title: 'Mechanistic Class',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'What is the mechanistic class of the above drugs?',
            options: [
              'Potassium-sparing agents',
              'Loop diuretics',
              'Thiazide diuretics',
              'Calcium channel blockers',
              'β-Blockers',
              'Angiotensin-converting enzyme inhibitors',
              'Angiotensin II receptor antagonists'
            ],
            correctIndex: 4,
            optionExplanations: [
              'Incorrect: Not potassium-sparing diuretics.',
              'Incorrect: Not loop diuretics.',
              'Incorrect: Not thiazides.',
              'Incorrect: Not CCBs.',
              'Correct: These agents competitively block beta-1 and/or beta-2 adrenergic receptors, reducing myocardial contractility, heart rate, cardiac output, and renin secretion.',
              'Incorrect: Not ACE inhibitors.',
              'Incorrect: Not ARBs.'
            ],
            overallExplanation: 'Beta-blockers antagonize beta-adrenergic receptors, attenuating catecholamine-mediated adenylyl cyclase activation and cAMP formation in cardiovascular tissues.',
            highYieldPearl: 'Beta-blockers decrease heart rate (chronotropy), contractility (inotropy), and renal renin release via beta-1 blockade.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 1, Question 2',
            sourcePageNumber: 1
          },
          {
            id: 403,
            questionNumberLabel: 'Question 3',
            title: 'Therapeutic Indications',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'The above drugs are primarily used to treat which of the following diseases?',
            options: [
              'Diabetes',
              'Hypertension',
              'Chronic obstructive pulmonary diseases',
              'Peptic ulcer',
              'Bacterial infection',
              'Cancer',
              'Depression'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Beta-blockers can mask hypoglycemia symptoms in diabetes.',
              'Correct: Beta-blockers are foundational antihypertensive agents that lower blood pressure through negative chronotropy, negative inotropy, and suppression of renal renin release.',
              'Incorrect: Nonselective beta-blockers are contraindicated in COPD/asthma due to bronchoconstriction.',
              'Incorrect: Not used for peptic ulcer disease.',
              'Incorrect: Not antibacterial agents.',
              'Incorrect: Not antineoplastic agents.',
              'Incorrect: Propranolol can worsen depression due to central monoamine dampening.'
            ],
            overallExplanation: 'Beta-blockers are used as first- or second-line agents for hypertension, particularly in patients with compelling indications such as ischemic heart disease, post-myocardial infarction, or heart failure.',
            highYieldPearl: 'Beta-blockers treat hypertension by reducing cardiac output and suppressing renin release from renal juxtaglomerular cells.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 1, Question 3',
            sourcePageNumber: 1
          },
          {
            id: 404,
            questionNumberLabel: 'Question 4',
            title: 'Adrenergic Classification',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which of the following is true describing the above drugs?',
            options: [
              'Centrally-acting, direct sympatholytics',
              'Peripherally-acting, indirect sympatholytics',
              'Peripherally-acting, direct sympatholytics',
              'Centrally-acting, indirect sympatholytics'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: Centrally-acting direct sympatholytics include clonidine and methyldopa (alpha-2 agonists).',
              'Incorrect: Indirect sympatholytics deplete neurotransmitters (e.g., reserpine, guanethidine).',
              'Correct: Beta-blockers act directly as competitive antagonists at peripheral post-junctional adrenergic receptors (primarily cardiac beta-1 and vascular/bronchial beta-2).',
              'Incorrect: They are direct receptor antagonists, not indirect agents.'
            ],
            overallExplanation: 'Classical beta-blockers are peripherally-acting direct sympatholytics because they block the adrenergic receptor directly rather than modulating catecholamine synthesis, storage, or release.',
            highYieldPearl: 'Direct sympatholytics = receptor blockers (beta-blockers, alpha-1 blockers). Indirect sympatholytics = depleters/false transmitters (reserpine, guanethidine).',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 1, Question 4',
            sourcePageNumber: 1
          },
          {
            id: 405,
            questionNumberLabel: 'Question 5',
            title: 'Cardioselectivity (Beta-1 Selective Agents)',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is(are) selective β1-blocker(s) (cardioselective)?',
            options: [
              'Structure I',
              'Structure II and Structure III',
              'Structure IV',
              'Structure V',
              'Structure VI'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Structure I (Propranolol) is a nonselective beta-1/beta-2 blocker.',
              'Correct: Structure II (Metoprolol) and Structure III (Esmolol) contain para-substituted phenyl rings that selectively fit the beta-1 receptor binding pocket over beta-2.',
              'Incorrect: Structure IV (Carvedilol) is a nonselective beta-blocker with additional alpha-1 blocking activity.',
              'Incorrect: Structure V (Pindolol) is a nonselective beta-blocker with intrinsic sympathomimetic activity.',
              'Incorrect: Structure VI (Nadolol) is a nonselective beta-1/beta-2 blocker.'
            ],
            overallExplanation: 'Cardioselective (beta-1) agents possess a para-substituent on the phenoxy ring (e.g., Metoprolol, Esmolol). The para-group engages with specific hydrogen-bonding residues in the beta-1 binding crevice that are absent or sterically hindered in beta-2 receptors.',
            highYieldPearl: 'Beta-1 Cardioselective = para-substituted aryloxypropanolamines (Structure II = Metoprolol, Structure III = Esmolol).',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 1, Question 5',
            sourcePageNumber: 1
          },
          {
            id: 406,
            questionNumberLabel: 'Question 6',
            title: 'Beta-Blocker Selection in Bronchospastic Disease',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is(are) more likely to be used to treat hypertensive patients with a history of bronchospasm?',
            options: [
              'Structure I',
              'Structure II',
              'Structure IV',
              'Structure V',
              'Structure VI'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Structure I is nonselective and blocks bronchial beta-2 receptors, precipitating life-threatening bronchospasm.',
              'Correct: Structure II (Metoprolol) is a cardioselective beta-1 blocker that preferentially blocks cardiac beta-1 receptors and largely spares bronchial smooth muscle beta-2 receptors at low-to-moderate therapeutic doses.',
              'Incorrect: Structure IV blocks beta-2 receptors and can provoke bronchospasm.',
              'Incorrect: Structure V is nonselective.',
              'Incorrect: Structure VI is nonselective.'
            ],
            overallExplanation: 'While all beta-blockers require caution in reactive airway disease, cardioselective (beta-1) antagonists like Structure II (Metoprolol) minimize beta-2-mediated bronchoconstriction.',
            highYieldPearl: 'In asthma/COPD, select cardioselective beta-1 blockers (Structure II) to avoid blocking bronchodilating beta-2 receptors.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 1, Question 6',
            sourcePageNumber: 1
          },
          {
            id: 407,
            questionNumberLabel: 'Question 7',
            title: 'Mixed Alpha/Beta Adrenergic Antagonists',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is(are) mixed α1/β-antagonist(s)?',
            options: [
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV',
              'Structure VI'
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect: Structure I has no alpha-1 blocking activity.',
              'Incorrect: Structure II is a selective beta-1 blocker.',
              'Incorrect: Structure III is a selective beta-1 blocker.',
              'Correct: Structure IV (Carvedilol) incorporates a carbazole moiety with an aryloxypropanolamine chain (beta-blockade) linked to a bulky phenoxyethylamine substituent (alpha-1 blockade), imparting vasodilatory properties.',
              'Incorrect: Structure VI lacks alpha-1 blocking activity.'
            ],
            overallExplanation: 'Structure IV (Carvedilol) is a dual alpha-1 and beta-antagonist. Alpha-1 antagonism lowers peripheral vascular resistance, reducing afterload without causing reflex tachycardia because beta-1 receptors are concurrently blocked.',
            highYieldPearl: 'Mixed alpha/beta blockers = Structure IV (Carvedilol). Alpha-1 block = vasodilation; Beta-1 block = prevents reflex tachycardia.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 1, Question 7',
            sourcePageNumber: 1
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 2: Beta-Blocker Landmark Properties & Central Alpha-2 Intro (Questions 8 - 19)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 2,
    title: 'Beta-Blocker Landmark Properties & Central Alpha-2 Agonists Introduction',
    subtitle: 'Membrane stabilization, intrinsic sympathomimetic activity, ultrashort esterase duration, antioxidant carbazole, and clonidine SAR',
    sections: [
      {
        sectionTitle: 'Beta-Blocker Landmark Pharmacodynamic & Pharmacokinetic Properties',
        block_instructions: 'Consider Structures I through VI and Clonidine to answer questions 1–12.',
        structures: [
          SYMPATHOLYTICS_STRUCTURES.propranolol,
          SYMPATHOLYTICS_STRUCTURES.metoprolol,
          SYMPATHOLYTICS_STRUCTURES.esmolol,
          SYMPATHOLYTICS_STRUCTURES.carvedilol,
          SYMPATHOLYTICS_STRUCTURES.pindolol,
          SYMPATHOLYTICS_STRUCTURES.nadolol,
          SYMPATHOLYTICS_STRUCTURES.clonidine,
        ],
        questions: [
          {
            id: 408,
            questionNumberLabel: 'Question 1',
            title: 'Landmark Pharmacodynamic & Pharmacokinetic Properties Matching',
            category: 'Medicinal Chemistry SAR',
            type: 'matching',
            questionStem: 'Drag and drop each landmark pharmacological or pharmacokinetic property to its corresponding beta-blocker structure (Structures I through VI):',
            prompt: 'Drag and drop each landmark pharmacological or pharmacokinetic property to its corresponding beta-blocker structure (Structures I through VI):',
            options: [
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV',
              'Structure V',
              'Structure VI'
            ],
            structuresDisplayed: [
              SYMPATHOLYTICS_STRUCTURES.propranolol,
              SYMPATHOLYTICS_STRUCTURES.metoprolol,
              SYMPATHOLYTICS_STRUCTURES.esmolol,
              SYMPATHOLYTICS_STRUCTURES.carvedilol,
              SYMPATHOLYTICS_STRUCTURES.pindolol,
              SYMPATHOLYTICS_STRUCTURES.nadolol,
            ],
            matchingTargets: [
              {
                id: 'target_msa_propranolol',
                label: 'Prominent quinidine-like membrane-stabilizing activity (cardiac fast inward Na+ channel blockade)',
                acceptedStructureIds: ['Structure I', 'propranolol', 'chem-propranolol', 'I'],
                rationale: 'Structure I (Propranolol) is lipophilic and blocks fast Na+ channels.'
              },
              {
                id: 'target_isa_pindolol',
                label: 'Intrinsic sympathomimetic activity (ISA / partial agonist) minimizing resting bradycardia',
                acceptedStructureIds: ['Structure V', 'pindolol', 'chem-pindolol', 'V'],
                rationale: 'Structure V (Pindolol) is an indole derivative possessing partial agonist activity.'
              },
              {
                id: 'target_esterase_esmolol',
                label: 'Ultrashort duration of action (t1/2 ~9 min) due to rapid erythrocyte esterase hydrolysis in acute ER/ICU care',
                acceptedStructureIds: ['Structure III', 'esmolol', 'chem-esmolol', 'III'],
                rationale: 'Structure III (Esmolol) contains a labile methyl ester cleaved rapidly by red blood cell esterases.'
              },
              {
                id: 'target_carbazole_carvedilol',
                label: 'Tricyclic carbazole nucleus conferring antioxidant and reactive oxygen species scavenging activity in heart failure',
                acceptedStructureIds: ['Structure IV', 'carvedilol', 'chem-carvedilol', 'IV'],
                rationale: 'Structure IV (Carvedilol) contains an electron-rich carbazole ring system.'
              },
              {
                id: 'target_nadolol_diol',
                label: 'Hydrophilic polar diol that evades hepatic first-pass metabolism with the longest half-life (~20-24 h; renally cleared)',
                acceptedStructureIds: ['Structure VI', 'nadolol', 'chem-nadolol', 'VI'],
                rationale: 'Structure VI (Nadolol) has a cis-diol cyclohexenyl substituent conferring hydrophilicity and renal elimination.'
              },
              {
                id: 'target_beta1_metoprolol',
                label: 'Cardioselective beta-1 blocker preferred in patients with a history of bronchospasm or reactive airway disease',
                acceptedStructureIds: ['Structure II', 'metoprolol', 'chem-metoprolol', 'II'],
                rationale: 'Structure II (Metoprolol) contains a para-methoxyethyl group conferring beta-1 selectivity.'
              }
            ],
            matchingPairs: [
              {
                id: 'target_msa_propranolol',
                label: 'Prominent quinidine-like membrane-stabilizing activity (cardiac fast inward Na+ channel blockade)',
                target: 'Prominent quinidine-like membrane-stabilizing activity (cardiac fast inward Na+ channel blockade)',
                acceptedStructureIds: ['Structure I', 'propranolol', 'chem-propranolol', 'I'],
                hint: 'Structure I is lipophilic and blocks fast Na+ channels.'
              },
              {
                id: 'target_isa_pindolol',
                label: 'Intrinsic sympathomimetic activity (ISA / partial agonist) minimizing resting bradycardia',
                target: 'Intrinsic sympathomimetic activity (ISA / partial agonist) minimizing resting bradycardia',
                acceptedStructureIds: ['Structure V', 'pindolol', 'chem-pindolol', 'V'],
                hint: 'Structure V is an indole derivative possessing partial agonist activity.'
              },
              {
                id: 'target_esterase_esmolol',
                label: 'Ultrashort duration of action (t1/2 ~9 min) due to rapid erythrocyte esterase hydrolysis in acute ER/ICU care',
                target: 'Ultrashort duration of action (t1/2 ~9 min) due to rapid erythrocyte esterase hydrolysis in acute ER/ICU care',
                acceptedStructureIds: ['Structure III', 'esmolol', 'chem-esmolol', 'III'],
                hint: 'Structure III contains a labile methyl ester cleaved rapidly by red blood cell esterases.'
              },
              {
                id: 'target_carbazole_carvedilol',
                label: 'Tricyclic carbazole nucleus conferring antioxidant and reactive oxygen species scavenging activity in heart failure',
                target: 'Tricyclic carbazole nucleus conferring antioxidant and reactive oxygen species scavenging activity in heart failure',
                acceptedStructureIds: ['Structure IV', 'carvedilol', 'chem-carvedilol', 'IV'],
                hint: 'Structure IV contains an electron-rich carbazole ring system.'
              },
              {
                id: 'target_nadolol_diol',
                label: 'Hydrophilic polar diol that evades hepatic first-pass metabolism with the longest half-life (~20-24 h; renally cleared)',
                target: 'Hydrophilic polar diol that evades hepatic first-pass metabolism with the longest half-life (~20-24 h; renally cleared)',
                acceptedStructureIds: ['Structure VI', 'nadolol', 'chem-nadolol', 'VI'],
                hint: 'Structure VI has a cis-diol cyclohexenyl substituent conferring hydrophilicity and renal elimination.'
              },
              {
                id: 'target_beta1_metoprolol',
                label: 'Cardioselective beta-1 blocker preferred in patients with a history of bronchospasm or reactive airway disease',
                target: 'Cardioselective beta-1 blocker preferred in patients with a history of bronchospasm or reactive airway disease',
                acceptedStructureIds: ['Structure II', 'metoprolol', 'chem-metoprolol', 'II'],
                hint: 'Structure II contains a para-methoxyethyl group conferring beta-1 selectivity.'
              }
            ],
            overallExplanation: 'Matching summary:\n- Structure I (Propranolol): Membrane-stabilizing activity (Na+ channel block).\n- Structure V (Pindolol): Intrinsic sympathomimetic activity (ISA).\n- Structure III (Esmolol): Ultrashort duration (RBC esterase hydrolysis).\n- Structure IV (Carvedilol): Carbazole antioxidant & free radical scavenger.\n- Structure VI (Nadolol): Hydrophilic diol, no first-pass hepatic loss, longest t1/2.\n- Structure II (Metoprolol): Beta-1 cardioselectivity for reactive airway patients.',
            highYieldPearl: 'High-Yield Landmark Beta-Blocker Properties: I = Na+ channel block (MSA); II = beta-1 selective; III = RBC esterase ultrashort; IV = carbazole antioxidant; V = ISA partial agonist; VI = renal excretion / longest t1/2.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Questions 8-16',
            sourcePageNumber: 2
          },
          {
            id: 410,
            questionNumberLabel: 'Question 2',
            title: 'Ultrashort-Acting Beta-Blocker in Emergency Settings',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is(are) preferred for use in the emergency room to treat hypertensive or arrhythmic events? Why?',
            options: [
              'Structure I, due to high lipophilicity and rapid brain penetration',
              'Structure II, due to sustained oral release profile',
              'Structure III, due to a methyl ester linkage rapidly hydrolyzed by erythrocyte esterases (half-life ~9 minutes)',
              'Structure VI, due to complete lack of hepatic metabolism'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: Structure I has a multi-hour half-life and variable clearance.',
              'Incorrect: Structure II is not ultrashort-acting.',
              'Correct: Structure III (Esmolol) incorporates a para-methyl ester substituent that is rapidly cleaved by red blood cell cytosolic esterases to an inactive carboxylic acid metabolite, giving an elimination half-life of ~9 minutes for precise IV titration.',
              'Incorrect: Structure VI has an ultra-long half-life (~20-24 hours).'
            ],
            overallExplanation: 'Structure III (Esmolol) is an ultrashort-acting soft drug designed with a metabolically labile ester function that erythrocyte esterases rapidly cleave into an inactive acid metabolite, enabling rapid on/off titration in acute care.',
            highYieldPearl: 'Structure III (Esmolol) = ultrashort beta-1 blocker (t1/2 ~9 min) due to rapid hydrolysis by RBC esterases. Ideal for ICU/ER acute titration.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Question 10',
            sourcePageNumber: 2
          },
          {
            id: 411,
            questionNumberLabel: 'Question 3',
            title: 'Antioxidant Characteristics in Heart Failure',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs has(have) an antioxidant characteristic that may benefit patients with heart failure? Why?',
            options: [
              'Structure I, because the naphthalene ring donates electrons',
              'Structure III, because the ester group scavenges hydroxyl radicals',
              'Structure IV, because its electron-rich carbazole ring system scavenges reactive oxygen species and inhibits lipid peroxidation',
              'Structure V, because the indole ring undergoes rapid auto-oxidation',
              'Structure VI, because the diol group binds free radicals'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: Structure I does not exhibit meaningful antioxidant properties.',
              'Incorrect: Structure III lacks carbazole antioxidant features.',
              'Correct: Structure IV (Carvedilol) contains a fused tricyclic carbazole nucleus that functions as a potent scavenger of oxygen free radicals, suppressing neutrophil-mediated myocardial lipid peroxidation.',
              'Incorrect: Structure V lacks this specific antioxidant cardioprotection.',
              'Incorrect: Structure VI lacks carbazole antioxidant features.'
            ],
            overallExplanation: 'Structure IV (Carvedilol) provides cardioprotection in chronic systolic heart failure beyond beta-blockade through carbazole-mediated free radical scavenging and reduction of oxidative stress.',
            highYieldPearl: 'Structure IV (Carvedilol) = mixed alpha-1/beta-blocker with a carbazole ring that provides potent antioxidant activity in heart failure.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Question 11',
            sourcePageNumber: 2
          },
          {
            id: 412,
            questionNumberLabel: 'Question 4',
            title: 'Dual ISA and Membrane-Stabilizing Effects',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs has(have) intrinsic sympathomimetic activity as well as a potentially membrane-stabilizing effect?',
            options: [
              'Structure I',
              'Structure II',
              'Structure V',
              'Structure VI'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: Structure I has strong MSA but zero ISA.',
              'Incorrect: Structure II has neither significant ISA nor MSA.',
              'Correct: Structure V (Pindolol) uniquely possesses prominent partial agonist activity (ISA) alongside weak-to-moderate membrane-stabilizing activity.',
              'Incorrect: Structure VI is devoid of both ISA and MSA.'
            ],
            overallExplanation: 'Structure V (Pindolol) is a nonselective beta-blocker characterized by both intrinsic sympathomimetic activity and membrane-stabilizing properties.',
            highYieldPearl: 'Structure V (Pindolol) combines nonselective beta-blockade, partial agonist activity (ISA), and mild membrane stabilization.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Question 12',
            sourcePageNumber: 2
          },
          {
            id: 413,
            questionNumberLabel: 'Question 5',
            title: 'Lipophilicity & Central Nervous System Penetration',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs has(have) sufficient lipophilicity to be used to treat anxiety or has CNS toxicity (depression, confusion, vivid dreams)?',
            options: [
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure VI'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure I (Propranolol) is the most lipophilic beta-blocker (logP ~3.0), readily crossing the blood-brain barrier to alleviate somatic anxiety, but also causing central side effects like depression, confusion, and vivid nightmares.',
              'Incorrect: Structure II has moderate lipophilicity and lower CNS penetration.',
              'Incorrect: Structure III is hydrophilic and rapidly cleaved in blood.',
              'Incorrect: Structure VI is hydrophilic (logP ~0.7) and cannot easily cross the BBB.'
            ],
            overallExplanation: 'Structure I (Propranolol) possesses high lipophilicity due to its bicyclic naphthyloxy ring, permitting rapid blood-brain barrier penetration. This enables its off-label use for performance anxiety and essential tremor, but predisposes to CNS adverse reactions.',
            highYieldPearl: 'Structure I (Propranolol) = most lipophilic beta-blocker -> high BBB penetration -> somatic anxiety relief, but risks fatigue, depression, and vivid dreams.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Question 13',
            sourcePageNumber: 2
          },
          {
            id: 414,
            questionNumberLabel: 'Question 6',
            title: 'Evasion of First-Pass Hepatic Metabolism',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is more likely to avoid the first-pass effect?',
            options: [
              'Structure I',
              'Structure II',
              'Structure IV',
              'Structure VI'
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect: Structure I undergoes extensive first-pass hepatic metabolism (~70-80% metabolized before reaching systemic circulation).',
              'Incorrect: Structure II undergoes substantial hepatic clearance via CYP2D6 (~50% first-pass loss).',
              'Incorrect: Structure IV undergoes heavy hepatic glucuronidation and CYP2D6 oxidation.',
              'Correct: Structure VI (Nadolol) is highly hydrophilic (due to its cis-cyclohexanediol moiety), is not significantly metabolized by hepatic enzymes, and is eliminated predominantly unchanged via renal excretion, thus avoiding first-pass hepatic loss.'
            ],
            overallExplanation: 'Hydrophilic beta-blockers like Structure VI (Nadolol) are not substrates for hepatic CYP enzymes; they are excreted unchanged by the kidneys and bypass hepatic first-pass extraction.',
            highYieldPearl: 'Structure VI (Nadolol) is water-soluble (hydrophilic diol) -> evades first-pass hepatic clearance -> excreted unchanged renally.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Question 14',
            sourcePageNumber: 2
          },
          {
            id: 415,
            questionNumberLabel: 'Question 7',
            title: 'Elimination Half-Life Comparison',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs has the most extended elimination half-life? Why?',
            options: [
              'Structure I, due to enterohepatic recirculation',
              'Structure II, due to lipophilic tissue accumulation',
              'Structure III, due to slow plasma protein dissociation',
              'Structure VI, due to its hydrophilic nature and lack of hepatic clearance resulting in slow renal elimination (t1/2 ~20-24 hours)'
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect: Structure I has a short half-life of ~3-5 hours.',
              'Incorrect: Structure II has a half-life of ~3-7 hours.',
              'Incorrect: Structure III has an ultrashort half-life of ~9 minutes.',
              'Correct: Structure VI (Nadolol) has an elimination half-life of 20 to 24 hours, the longest of standard beta-blockers, because it is water-soluble and cleared slowly by glomerular filtration without hepatic metabolism.'
            ],
            overallExplanation: 'Structure VI (Nadolol) has the longest half-life (~20-24 hours) among nonselective beta-blockers, permitting once-daily dosing. Its polar diol structure resists hepatic metabolism and relies entirely on renal excretion.',
            highYieldPearl: 'Structure VI (Nadolol) = longest beta-blocker half-life (~20-24 h), renally eliminated. Requires dose reduction in renal impairment.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Question 15',
            sourcePageNumber: 2
          },
          {
            id: 416,
            questionNumberLabel: 'Question 8',
            title: 'Vasodilatory Beta-Blockers',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is a vasodilatory β-blocker?',
            options: [
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV',
              'Structure VI'
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect: Structure I is a pure nonselective beta-blocker without vasodilating properties.',
              'Incorrect: Structure II has no intrinsic vasodilatory effect.',
              'Incorrect: Structure III is not vasodilatory.',
              'Correct: Structure IV (Carvedilol) is a third-generation beta-blocker that produces peripheral vasodilation by concurrently blocking vascular post-junctional alpha-1 adrenergic receptors.',
              'Incorrect: Structure VI is not vasodilatory.'
            ],
            overallExplanation: 'Third-generation beta-blockers reduce peripheral vascular resistance either via alpha-1 receptor blockade (Carvedilol, Labetalol) or endothelial nitric oxide release (Nebivolol).',
            highYieldPearl: 'Vasodilatory beta-blockers: Structure IV (Carvedilol) and Labetalol (via alpha-1 block); Nebivolol (via endothelial NO release).',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Question 16',
            sourcePageNumber: 2
          },
          {
            id: 417,
            questionNumberLabel: 'Question 9',
            title: 'Active Beta-Blocker Stereochemistry',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which stereochemical configuration of aryloxypropanolamines is biologically active as a beta-adrenergic receptor antagonist?',
            options: [
              '(2S)-Aryloxypropanolamine',
              '(2R)-Aryloxypropanolamine',
              'Acyclic tertiary amine without hydroxyl',
              'Trans-alkene congener'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: For aryloxypropanolamines, the (2S)-enantiomer possesses 50- to 100-fold higher affinity for beta-receptors than the (2R)-enantiomer. Due to Cahn-Ingold-Prelog priority rules, the (2S)-aryloxypropanolamine superimposes sterically on the active (1R)-arylethanolamine (e.g., natural (R)-epinephrine).',
              'Incorrect: The (2R)-enantiomer has negligible beta-blocking activity.',
              'Incorrect: The secondary hydroxyl group is essential for hydrogen bonding to Asp/Asn in the receptor.',
              'Incorrect: Alkene derivatives do not fit the active receptor pocket.'
            ],
            overallExplanation: 'Because the ether oxygen alters sequence priority rules, (2S)-aryloxypropanolamines have the identical spatial 3D orientation as (1R)-arylethanolamines, forming critical hydrogen bonds with the beta-receptor binding site.',
            highYieldPearl: 'Active beta-blockers: (2S)-aryloxypropanolamine superimposes 3D-wise with (1R)-arylethanolamine.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Question 17',
            sourcePageNumber: 2
          },
          {
            id: 418,
            questionNumberLabel: 'Question 10',
            title: 'Clonidine Chemical & Mechanistic Classification',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'Considering the chemical structure of clonidine, state whether each of the following statements is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'Clonidine is a 2-aminoimidazoline derivative.',
                isCorrect: true,
                explanation: 'True: Clonidine chemically consists of a 2,6-dichlorophenyl ring connected via an NH bridge to a 2-imidazoline ring.'
              },
              {
                id: 'b',
                text: 'Clonidine is a selective alpha-2 agonist.',
                isCorrect: true,
                explanation: 'True: Clonidine stimulates presynaptic alpha-2A autoreceptors in the nucleus tractus solitarius, inhibiting peripheral sympathetic outflow.'
              },
              {
                id: 'c',
                text: 'Clonidine is an indirect sympathomimetic.',
                isCorrect: false,
                explanation: 'False: Clonidine is a direct-acting agonist at alpha-2 receptors.'
              },
              {
                id: 'd',
                text: 'Clonidine is a direct sympatholytic.',
                isCorrect: false,
                explanation: 'False: While its net clinical effect is sympatholytic (lowers blood pressure and heart rate), its molecular mechanism is receptor agonism at inhibitory alpha-2 autoreceptors.'
              },
              {
                id: 'e',
                text: 'It is a centrally acting antihypertensive agent.',
                isCorrect: true,
                explanation: 'True: Clonidine readily crosses the blood-brain barrier to act in the central nervous system (medulla/brainstem).'
              }
            ],
            overallExplanation: 'Clonidine is a centrally acting direct alpha-2 agonist. Stimulation of central presynaptic alpha-2 autoreceptors downregulates adenylyl cyclase, reducing sympathetic vasomotor tone, heart rate, and total peripheral resistance.',
            highYieldPearl: 'Clonidine = 2-aminoimidazoline direct alpha-2 agonist -> acts centrally in medulla to decrease sympathetic outflow -> rebound hypertension on abrupt cessation!',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Question 18',
            sourcePageNumber: 2
          },
          {
            id: 419,
            questionNumberLabel: 'Question 11',
            title: 'Role of Ortho-Substituents in Clonidine',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following statements is NOT true about the ortho-substituents in clonidine?',
            options: [
              'Chlorines increase the drug lipophilicity by increasing the molecular weight',
              'Chlorines electronically compromise the basicity of cyclic guanidine by their withdrawing properties',
              'Chlorines sterically dictate a perpendicular 3D orientation of the two rings, allowing better fit to the receptor',
              'Replacement of the two chlorines with two methoxy groups significantly increases the adrenergic agonist activity of clonidine',
              'a, b, and c justify why the drug can pass the blood-brain barrier and act centrally'
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect (this statement is true): Chlorines add lipophilicity.',
              'Incorrect (this statement is true): Guanidines normally have pKa ~13.5 (100% ionized). The electron-withdrawing ortho-chlorines lower pKa to 8.05, allowing ~20% unionized drug at pH 7.4 to cross the BBB.',
              'Incorrect (this statement is true): Bulky ortho-chlorines force the imidazoline and benzene rings into perpendicular planes.',
              'Correct (this statement is FALSE): Replacement of ortho-chlorines with methoxy groups decreases agonist activity because bulky electron-donating groups alter electronics and steric fit; ortho-dichlorines are optimal.',
              'Incorrect (this statement is true): Lipophilicity, lower pKa, and perpendicular conformation allow BBB transit.'
            ],
            overallExplanation: 'The two ortho-chlorine atoms in clonidine have a threefold purpose: (1) increase lipophilicity, (2) pull electron density to lower guanidine pKa from 13.5 to 8.0 (enabling ~20% unionized fraction at pH 7.4), and (3) sterically force an orthogonal ring orientation required for alpha-2 binding.',
            highYieldPearl: 'Clonidine ortho-chlorines: (1) lower pKa to 8.0 (allows non-ionized form to cross BBB), (2) steric hindrance locks perpendicular 3D conformation for alpha-2 fit.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Question 19',
            sourcePageNumber: 2
          },
          {
            id: 420,
            questionNumberLabel: 'Question 12',
            title: 'Central Alpha-2 Agonist Hemodynamic Consequences',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'What is the primary hemodynamic consequence of central alpha-2 receptor stimulation by clonidine in the medulla oblongata?',
            options: [
              'Direct systemic vasodilation through vascular smooth muscle alpha-2 receptor activation',
              'Decreased central sympathetic outflow resulting in reduced peripheral vascular resistance, heart rate, and cardiac output',
              'Increased renal renin secretion through juxtaglomerular beta-1 stimulation',
              'Depletion of intraneuronal catecholamine storage vesicles'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Peripheral vascular post-synaptic alpha-2 receptors cause vasoconstriction, which is briefly seen with rapid IV injection before central effects dominate.',
              'Correct: Agonism at central presynaptic alpha-2 receptors in the nucleus tractus solitarius dampens sympathetic discharge, lowering peripheral vascular resistance and heart rate.',
              'Incorrect: Renin secretion is decreased, not increased.',
              'Incorrect: Catecholamine depletion is the mechanism of reserpine, not clonidine.'
            ],
            overallExplanation: 'Clonidine stimulates inhibitory alpha-2 autoreceptors in the brainstem, attenuating efferent sympathetic nerve firing to the heart, vasculature, and kidneys.',
            highYieldPearl: 'Central alpha-2 agonism = decreased sympathetic outflow -> reduced peripheral resistance, bradycardia, and reduced renin.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Summary of Central Agonists',
            sourcePageNumber: 2
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 3: Methyldopa Bioactivation & Central Sympatholytics (Questions 20 - 24)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 3,
    title: 'Methyldopa Central Bioactivation & False Transmitter Mechanism',
    subtitle: 'Active transport via LAT1, two-step enzymatic cascade, false neurotransmitter pharmacology, and direct vs indirect sympatholytics',
    sections: [
      {
        sectionTitle: 'Methyldopa Activation Cascade & Comparative Sympatholytics',
        block_instructions: 'Consider Methyldopa, its active metabolite, and Drugs I through IV to answer questions 1–5.',
        structures: [
          SYMPATHOLYTICS_STRUCTURES.methyldopa,
          SYMPATHOLYTICS_STRUCTURES.alpha_methylnorepinephrine,
          SYMPATHOLYTICS_STRUCTURES.clonidine,
          SYMPATHOLYTICS_STRUCTURES.reserpine,
          SYMPATHOLYTICS_STRUCTURES.prazosin,
        ],
        questions: [
          {
            id: 421,
            questionNumberLabel: 'Question 1',
            title: 'Methyldopa Pharmacokinetics & Properties',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'All of the following statements are true about methyldopa EXCEPT:',
            options: [
              'Methyldopa can pass the blood-brain barrier in significant quantities',
              'Methyldopa is metabolized by COMT, which limits its oral bioavailability',
              'It is a prodrug that has to be activated centrally',
              'It has a fast onset of action and a high oral bioavailability',
              'It is a centrally-acting antihypertensive agent'
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect (statement is true): Methyldopa is an amino acid and traverses the BBB using the active LAT1 carrier.',
              'Incorrect (statement is true): COMT O-methylates the catechol diol, giving oral bioavailability of ~25-50%.',
              'Incorrect (statement is true): It is bioactivated centrally to alpha-methylnorepinephrine.',
              'Correct (statement is FALSE): Methyldopa has a SLOW onset of action (2-4 hours, peak at 4-6 hours) because it requires active uptake and two-step enzymatic bioactivation; its bioavailability is low and variable.',
              'Incorrect (statement is true): Methyldopa is a centrally-acting agent with an established safety profile in pregnancy.'
            ],
            overallExplanation: 'Methyldopa is an amino acid prodrug requiring active central transport via LAT1 and enzymatic conversion by DOPA decarboxylase and dopamine beta-hydroxylase to the active alpha-2 agonist (1R,2S)-alpha-methylnorepinephrine, resulting in a delayed onset.',
            highYieldPearl: 'Methyldopa = prodrug -> LAT1 carrier across BBB -> decarboxylase + beta-hydroxylase -> (1R,2S)-alpha-methylnorepinephrine. Safe in pregnancy!',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 3, Question 20',
            sourcePageNumber: 3
          },
          {
            id: 422,
            questionNumberLabel: 'Question 2',
            title: 'Active Metabolite of Methyldopa',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Considering the central activation of methyldopa, which of the following chemical structures represents the active form of methyldopa:',
            options: [
              'alpha-Methyldopamine',
              '(1R,2S)-alpha-Methylnorepinephrine',
              '3-O-Methylmethyldopa',
              'Methyldopa glucuronide'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: alpha-Methyldopamine is an intermediate metabolite before beta-hydroxylation.',
              'Correct: (1R,2S)-alpha-Methylnorepinephrine is the active false neurotransmitter that selectively stimulates central inhibitory alpha-2 autoreceptors in the brainstem.',
              'Incorrect: 3-O-Methylmethyldopa is an inactive COMT degradation metabolite.',
              'Incorrect: Glucuronides are inactive Phase II conjugates.'
            ],
            overallExplanation: 'Methyldopa is decarboxylated by aromatic L-amino acid decarboxylase to alpha-methyldopamine, which is subsequently hydroxylated by dopamine beta-hydroxylase to (1R,2S)-alpha-methylnorepinephrine, the active central alpha-2 agonist.',
            highYieldPearl: 'Methyldopa active metabolite = (1R,2S)-alpha-Methylnorepinephrine (false neurotransmitter that acts as central alpha-2 agonist).',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 3, Question 21',
            sourcePageNumber: 3
          },
          {
            id: 423,
            questionNumberLabel: 'Question 3',
            title: 'Enzymes in Methyldopa Bioactivation',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following enzymes contribute(s) to methyldopa bioactivation? (Select all that apply)',
            options: [
              'Sulfotransferase',
              'Decarboxylase (Aromatic L-amino acid decarboxylase)',
              'β-Hydroxylase (Dopamine β-hydroxylase)',
              'Acetyltransferase',
              'Catechol-O-methyltransferase (COMT)',
              'Monoamine oxidase (MAO)'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Sulfotransferase inactivates methyldopa in the gut wall.',
              'Correct: Aromatic L-amino acid decarboxylase converts methyldopa to alpha-methyldopamine. Dopamine beta-hydroxylase then hydroxylates it to (1R,2S)-alpha-methylnorepinephrine.',
              'Correct: Dopamine beta-hydroxylase installs the chiral beta-OH group.',
              'Incorrect: Acetyltransferase is not involved in methyldopa bioactivation.',
              'Incorrect: COMT degrades catecholamines into inactive 3-O-methyl metabolites.',
              'Incorrect: MAO degrades biogenic amines.'
            ],
            overallExplanation: 'Bioactivation of methyldopa requires: (1) Aromatic L-amino acid decarboxylase (removes carboxylic acid), followed by (2) Dopamine beta-hydroxylase (introduces the chiral beta-hydroxyl group).',
            highYieldPearl: 'Methyldopa bioactivation pathway: Methyldopa -> [L-Aromatic amino acid decarboxylase] -> alpha-Methyldopamine -> [Dopamine beta-hydroxylase] -> (1R,2S)-alpha-Methylnorepinephrine.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 3, Question 22',
            sourcePageNumber: 3
          },
          {
            id: 424,
            questionNumberLabel: 'Question 4',
            title: 'Mechanisms of Drugs I - IV',
            category: 'Pharmacology MOA',
            type: 'sub-statements',
            questionStem: 'True or False (considering the mechanism of Drugs I through IV):',
            subStatements: [
              {
                id: 'a',
                text: 'Drug I is a selective alpha-2 agonist.',
                isCorrect: true,
                explanation: 'True: Drug I (Clonidine) selectively stimulates presynaptic alpha-2 receptors.'
              },
              {
                id: 'b',
                text: 'Drug II is an adrenergic neurotransmitter-depleting agent.',
                isCorrect: true,
                explanation: 'True: Drug II (Reserpine) irreversibly inhibits VMAT2, preventing vesicular storage and causing intraneuronal degradation of norepinephrine, dopamine, and serotonin.'
              },
              {
                id: 'c',
                text: 'Drug III is a selective alpha-1 antagonist with a vasodilatory effect.',
                isCorrect: true,
                explanation: 'True: Drug III (Prazosin) selectively blocks post-synaptic vascular alpha-1 receptors, causing arterial and venous dilation.'
              },
              {
                id: 'd',
                text: 'Drug IV is a prodrug that gets activated to become an alpha-2 agonist.',
                isCorrect: true,
                explanation: 'True: Drug IV (Methyldopa) is converted to alpha-methylnorepinephrine in brainstem neurons.'
              }
            ],
            overallExplanation: 'Drug I (Clonidine: alpha-2 agonist), Drug II (Reserpine: VMAT2 depleter), Drug III (Prazosin: selective alpha-1 blocker), and Drug IV (Methyldopa: prodrug to alpha-2 agonist) represent distinct classes of sympatholytic agents.',
            highYieldPearl: 'Reserpine = VMAT2 irreversible blocker -> catecholamine depletion -> depression and severe sedation. Prazosin = selective alpha-1 antagonist -> first-dose syncope.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 3, Question 23',
            sourcePageNumber: 3
          },
          {
            id: 425,
            questionNumberLabel: 'Question 5',
            title: 'Sites of Action: Central vs Peripheral',
            category: 'Pharmacology MOA',
            type: 'sub-statements',
            questionStem: 'True or False (considering the sites of action of Drugs I through IV):',
            subStatements: [
              {
                id: 'a',
                text: 'Drug I is a centrally acting sympatholytic.',
                isCorrect: true,
                explanation: 'True: Clonidine acts on alpha-2 receptors in the medulla.'
              },
              {
                id: 'b',
                text: 'Drug II is centrally acting sympatholytic.',
                isCorrect: true,
                explanation: 'True: Reserpine penetrates the CNS (causing severe depression) and also depletes peripheral sympathetic nerve terminals.'
              },
              {
                id: 'c',
                text: 'Drug III is a centrally acting sympatholytic.',
                isCorrect: false,
                explanation: 'False: Prazosin acts peripherally on vascular smooth muscle post-junctional alpha-1 receptors.'
              },
              {
                id: 'd',
                text: 'Drug IV is peripherally acting sympatholytic.',
                isCorrect: false,
                explanation: 'False: Methyldopa must enter the brain via LAT1 to exert central sympatholytic action.'
              },
              {
                id: 'e',
                text: 'Drugs I and IV are peripherally acting sympatholytics whereas drugs II and III are centrally acting sympatholytics.',
                isCorrect: false,
                explanation: 'False: Drugs I and IV are centrally acting; Drug III is peripherally acting.'
              }
            ],
            overallExplanation: 'Clonidine and Methyldopa reduce sympathetic drive centrally in the vasomotor center of the medulla. Prazosin acts peripherally directly on vascular smooth muscle alpha-1 receptors.',
            highYieldPearl: 'Centrally-acting = Clonidine, Guanfacine, Methyldopa. Peripherally-acting = Beta-blockers, Prazosin, Terazosin, Doxazosin.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 3, Question 24',
            sourcePageNumber: 3
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 4: Aryloxypropanolamines vs Arylethanolamines & Postganglionic Agents (Questions 25 - 27)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 4,
    title: 'Aryloxypropanolamine vs. Arylethanolamine SAR & Postganglionic Agents',
    subtitle: 'Oxymethylene spacer insertion, chiral priority reversal, COMT resistance, and basicity of central vs. peripheral guanidines',
    sections: [
      {
        sectionTitle: 'Comparative Stereochemistry & Adrenergic Neuron Blockers',
        block_instructions: 'Consider Molecules I & II, Sympatholytic I, and Drugs I & II to answer questions 1–3.',
        structures: [
          SYMPATHOLYTICS_STRUCTURES.propranolol,
          SYMPATHOLYTICS_STRUCTURES.pindolol,
          SYMPATHOLYTICS_STRUCTURES.guanfacine,
          SYMPATHOLYTICS_STRUCTURES.guanethidine,
        ],
        questions: [
          {
            id: 426,
            questionNumberLabel: 'Question 1',
            title: 'Aryloxypropanolamine vs Arylethanolamine SAR Comparison',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'Consider the chemical structures of Molecules I and II to indicate whether each of the following statements is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'Molecule I is aryloxypropanolamine whereas Molecule II is arylethanolamine.',
                isCorrect: true,
                explanation: 'True: Molecule I (Propranolol) contains an ether oxymethylene spacer; Molecule II (Isoproterenol) lacks this spacer.'
              },
              {
                id: 'b',
                text: 'Molecule I is beta-antagonist whereas Molecule II is beta-agonist.',
                isCorrect: true,
                explanation: 'True: Propranolol is an antagonist; catecholamine isoproterenol is a nonselective beta-agonist.'
              },
              {
                id: 'c',
                text: 'The two molecules do not discriminate between beta-1 and beta-2 receptors.',
                isCorrect: true,
                explanation: 'True: Neither drug has cardioselectivity.'
              },
              {
                id: 'd',
                text: 'Molecule I can be used to treat a host of cardiovascular diseases whereas Molecule II is not used clinically for routine hypertension.',
                isCorrect: true,
                explanation: 'True: Propranolol is widely used in cardiovascular disease; isoproterenol is limited to acute bradycardia/heart block.'
              },
              {
                id: 'e',
                text: 'The orientation of -OH in Molecule I is -(2S) and in Molecule II is -(1R).',
                isCorrect: true,
                explanation: 'True: Due to Cahn-Ingold-Prelog priorities, (2S)-aryloxypropanolamine superimposes on (1R)-arylethanolamine.'
              },
              {
                id: 'f',
                text: 'The two molecules are metabolized by COMT.',
                isCorrect: false,
                explanation: 'False: Molecule I (Propranolol) has a naphthalene ring without catechol hydroxyls and is NOT a substrate for COMT; Molecule II has a catechol diol and is rapidly metabolized by COMT.'
              },
              {
                id: 'g',
                text: 'The two molecules are potentially associated with CNS effects.',
                isCorrect: false,
                explanation: 'False: Molecule I is lipophilic and crosses the BBB; Molecule II is a catecholamine that does not cross the BBB.'
              },
              {
                id: 'h',
                text: 'Molecule I oral bioavailability will likely be higher than that of Molecule II.',
                isCorrect: true,
                explanation: 'True: Propranolol can be taken orally (~25-30% bioavailable after first-pass); catecholamines have negligible oral bioavailability due to intestinal sulfation and COMT.'
              }
            ],
            overallExplanation: 'Inserting the -O-CH2- bridge converts agonists into antagonists, alters the stereochemical naming from (1R) to (2S) while maintaining spatial 3D alignment, and eliminates COMT susceptibility.',
            highYieldPearl: 'Arylethanolamine = (1R) agonist (e.g., Isoproterenol). Aryloxypropanolamine = (2S) antagonist (e.g., Propranolol). COMT requires an intact catechol diol.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 4, Question 25',
            sourcePageNumber: 4
          },
          {
            id: 427,
            questionNumberLabel: 'Question 2',
            title: 'Cardioselective Beta-Blocker with ISA',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following statements is correct describing sympatholytic I?',
            options: [
              'It is highly lipophilic nonselective beta-blocker',
              'It is associated with quinidine-like membrane stabilizing effect',
              'It has intrinsic sympathomimetic activity',
              'It can be used to treat hypertensive patients with a history of asthma or COPD',
              'Statements c and d are correct'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: Sympatholytic I (Pindolol) is moderately lipophilic and has partial agonist activity.',
              'Incorrect: It has weak membrane stabilizing activity, but its primary hallmark is ISA.',
              'Correct: Sympatholytic I (Pindolol) is the prototypical beta-blocker with marked intrinsic sympathomimetic activity (ISA / partial agonist).',
              'Incorrect: As a nonselective beta-blocker, it is contraindicated in asthma or COPD.',
              'Incorrect: Statement d is false.'
            ],
            overallExplanation: 'Sympatholytic I (Pindolol) has prominent intrinsic sympathomimetic activity, acting as a partial agonist that minimizes resting bradycardia, but remains contraindicated in reactive airway disease due to beta-2 blockade.',
            highYieldPearl: 'Pindolol = nonselective beta-blocker with prominent Intrinsic Sympathomimetic Activity (ISA). Avoid in asthma/COPD.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 4, Question 26',
            sourcePageNumber: 4
          },
          {
            id: 428,
            questionNumberLabel: 'Question 3',
            title: 'Centrally Acting Guanidines vs Peripheral Neuron Blockers',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'Consider the chemical structures of Drugs I and II and state whether each of the following statements is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'The two drugs are guanidine-containing molecules.',
                isCorrect: true,
                explanation: 'True: Drug I (Guanfacine) has an acylguanidine; Drug II (Guanethidine) has an alkylguanidine attached to an azocine ring.'
              },
              {
                id: 'b',
                text: 'Drug I is more lipophilic than Drug II.',
                isCorrect: true,
                explanation: 'True: Guanfacine has a dichlorophenyl group and lower pKa (~7.1), allowing it to penetrate the CNS; guanethidine has a pKa >12 and is completely ionized, preventing CNS penetration.'
              },
              {
                id: 'c',
                text: 'Drug I is more basic than Drug II.',
                isCorrect: false,
                explanation: 'False: The carbonyl group in guanfacine is electron-withdrawing, lowering guanidine basicity (pKa ~7.1); guanethidine is a strongly basic alkylguanidine (pKa ~12-13).'
              },
              {
                id: 'd',
                text: 'The two drugs are direct sympatholytics.',
                isCorrect: false,
                explanation: 'False: Drug I is a central alpha-2 agonist; Drug II is an indirect postganglionic adrenergic neuron blocker.'
              },
              {
                id: 'e',
                text: 'Drug I is direct sympatholytic whereas Drug II is indirect sympatholytic.',
                isCorrect: true,
                explanation: 'True: Drug I acts directly at central receptors (sympatholytic net effect), while Drug II acts indirectly by displacing norepinephrine.'
              },
              {
                id: 'f',
                text: 'Drug I is alpha-2 agonist whereas Drug II is adrenergic neuronal depleting agent.',
                isCorrect: true,
                explanation: 'True: Guanfacine stimulates central alpha-2A receptors; guanethidine destroys/depletes peripheral storage vesicles.'
              },
              {
                id: 'g',
                text: 'The two drugs are used as centrally acting antihypertensive agents.',
                isCorrect: false,
                explanation: 'False: Only Drug I acts centrally; Drug II is permanently protonated and restricted to the periphery.'
              }
            ],
            overallExplanation: 'Guanfacine contains an electron-withdrawing acyl group that reduces guanidine basicity (pKa ~7.1), permitting BBB entry and central alpha-2 agonism. Guanethidine is strongly basic (pKa ~12), permanently protonated, restricted to the periphery, and acts as an adrenergic neuron depleter.',
            highYieldPearl: 'Guanfacine = acylguanidine -> low pKa (~7.1) -> crosses BBB -> central alpha-2 agonist. Guanethidine = alkylguanidine -> high pKa (~12) -> ionized, cannot cross BBB -> peripheral neuron blocker.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 4, Question 27',
            sourcePageNumber: 4
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 5: Mixed Alpha/Beta Antagonists & Quinazolines Introduction (Questions 28 - 33)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 5,
    title: 'Mixed Alpha/Beta Antagonists (Carvedilol Domains) & Quinazolines Introduction',
    subtitle: 'Carvedilol structural domains for binding, subtype selectivity, and pharmacokinetics; quinazoline-piperazine chemical classification',
    sections: [
      {
        sectionTitle: 'Carvedilol Domains & Quinazoline Chemistry',
        block_instructions: 'Consider the chemical structure of Drug C (Carvedilol with structural domains a, b, c) and Structures I through IV to answer questions 1–6.',
        structures: [
          SYMPATHOLYTICS_STRUCTURES.carvedilol,
          SYMPATHOLYTICS_STRUCTURES.prazosin,
          SYMPATHOLYTICS_STRUCTURES.terazosin,
          SYMPATHOLYTICS_STRUCTURES.doxazosin,
          SYMPATHOLYTICS_STRUCTURES.tamsulosin,
        ],
        questions: [
          {
            id: 429,
            questionNumberLabel: 'Question 1',
            title: 'Mechanistic Classification of Drug C',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'What is the pharmacological mechanistic class of Drug C (Carvedilol)?',
            options: [
              'Selective beta-1 antagonist only',
              'Nonselective beta-blocker with concurrent selective alpha-1 adrenergic receptor blockade and antioxidant activity',
              'Direct-acting smooth muscle calcium channel blocker',
              'Centrally-acting alpha-2 agonist'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Drug C blocks beta-1, beta-2, and alpha-1 receptors.',
              'Correct: Drug C (Carvedilol) is a nonselective beta-blocker (beta-1/beta-2) that also competitively blocks vascular alpha-1 receptors (promoting vasodilation) and provides carbazole-mediated free-radical scavenging.',
              'Incorrect: It is not a CCB.',
              'Incorrect: It is not an alpha-2 agonist.'
            ],
            overallExplanation: 'Carvedilol exhibits three complementary actions: (1) beta-1 blockade (negative inotropy/chronotropy), (2) alpha-1 blockade (vasodilation and afterload reduction), and (3) antioxidant carbazole scavenging of ROS in heart failure.',
            highYieldPearl: 'Carvedilol = nonselective beta-blocker + selective alpha-1 antagonist + antioxidant carbazole. Major heart failure drug.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 5, Question 28',
            sourcePageNumber: 5
          },
          {
            id: 430,
            questionNumberLabel: 'Question 2',
            title: 'Receptor Binding Domains in Drug C',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which structural domain(s) of Drug C is(are) responsible for binding to receptors?',
            options: [
              'Structural domain "a" (carbazole ring) alone',
              'Structural domain "b" (aryloxypropanolamine chain) for beta-receptors, and domain "c" (phenoxyethylamine extension) for alpha-1 receptors',
              'Structural domain "c" alone for both receptors',
              'Only the secondary hydroxyl without the aromatic ring'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: The carbazole ring contributes to antioxidant and lipophilic properties, but binding requires the ethanolamine/propanolamine motif.',
              'Correct: Structural domain "b" (the classical aryloxypropanolamine chain with chiral hydroxyl and amine) binds beta-receptors, while structural domain "c" (the extended phenoxyethylamino tail) fits the accessory hydrophobic pocket of alpha-1 receptors.',
              'Incorrect: Domain "c" alone does not confer beta-blockade.',
              'Incorrect: Receptor binding requires the entire pharmacophoric array.'
            ],
            overallExplanation: 'Drug C incorporates two distinct pharmacophores in one molecule: domain "b" (aryloxypropanolamine core) binds beta-receptors, while domain "c" (bulky phenoxyethyl extension) confers alpha-1 receptor affinity.',
            highYieldPearl: 'Carvedilol dual pharmacophore: Domain b (aryloxypropanolamine) = Beta-blockade. Domain c (phenoxyethylamine tail) = Alpha-1 blockade.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 5, Question 29',
            sourcePageNumber: 5
          },
          {
            id: 431,
            questionNumberLabel: 'Question 3',
            title: 'Tissue / Subtype Specificity Domain in Drug C',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which structural domain(s) is(are) responsible for tissue specificity (or receptor subtype specificity)?',
            options: [
              'Structural domain "a" (carbazole nucleus)',
              'Structural domain "b" (aryloxypropanolamine bridge)',
              'Structural domain "c" (substituted phenoxyethylamino tail)',
              'The methoxy substituent on the carbazole ring'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: Domain "a" confers lipophilicity and antioxidant scavenging.',
              'Incorrect: Domain "b" provides standard nonselective beta-antagonist affinity.',
              'Correct: Structural domain "c" (the bulky substituted phenoxyethyl group on the amine nitrogen) provides steric and hydrophobic interactions that selectively engage vascular post-junctional alpha-1 adrenergic receptors, conferring vasodilatory tissue selectivity.',
              'Incorrect: Methoxy substituent does not determine subtype selectivity.'
            ],
            overallExplanation: 'The bulky phenoxyethyl extension (domain "c") attached to the amino nitrogen projects into an accessory hydrophobic binding region of the alpha-1 adrenergic receptor, providing alpha-1 antagonism.',
            highYieldPearl: 'Domain c (N-phenoxyethyl substituent) = essential domain for alpha-1 receptor affinity and vasodilatory action.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 5, Question 30',
            sourcePageNumber: 5
          },
          {
            id: 432,
            questionNumberLabel: 'Question 4',
            title: 'Pharmacokinetic Determinants of Drug C',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which structural domain(s) influence(s) the pharmacokinetic aspects of Drug C?',
            options: [
              'Structural domain "a" (lipophilic tricyclic carbazole ring system)',
              'Structural domain "b" exclusively',
              'The aliphatic secondary hydroxyl group alone',
              'The central secondary amine alone'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structural domain "a" (the planar, highly lipophilic carbazole ring) confers high lipid solubility and drives extensive plasma albumin binding (~98%), large volume of distribution, and extensive hepatic CYP2D6/CYP2C9 clearance.',
              'Incorrect: Domain "b" is hydrophilic and polar.',
              'Incorrect: Hydroxyl increases water solubility.',
              'Incorrect: The amine is basic and protonated at pH 7.4.'
            ],
            overallExplanation: 'Carvedilol high lipophilicity is driven by domain "a" (fused tricyclic carbazole core), resulting in high protein binding, extensive hepatic clearance, and stereoselective first-pass metabolism.',
            highYieldPearl: 'Domain a (carbazole core) = high lipophilicity, >98% protein binding, extensive hepatic clearance, and antioxidant activity.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 5, Question 31',
            sourcePageNumber: 5
          },
          {
            id: 433,
            questionNumberLabel: 'Question 5',
            title: 'Chemical Class of Drugs I and II',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'What is the chemical class of Drugs I and II?',
            options: [
              'Catecholamines',
              'Quinazoline-piperazines',
              'Quinazoline-propylenediamines',
              'Benzene-sulfonamides',
              'Indolines'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Not catecholamines.',
              'Correct: Drug I (Prazosin) and Drug II (Terazosin) contain a 4-amino-6,7-dimethoxyquinazoline fused bicyclic ring linked to a central piperazine ring.',
              'Incorrect: They possess a piperazine heterocycle, not an acyclic propylenediamine.',
              'Incorrect: Not benzenesulfonamides.',
              'Incorrect: Silodosin contains an indoline, but prazosin and terazosin are quinazoline-piperazines.'
            ],
            overallExplanation: 'Prazosin, terazosin, and doxazosin belong to the quinazoline-piperazine chemical class of selective post-synaptic alpha-1 adrenergic antagonists.',
            highYieldPearl: 'Prazosin, Terazosin, Doxazosin = Quinazoline-piperazines. 4-Amino-6,7-dimethoxyquinazoline is the essential pharmacophore.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 5, Question 32',
            sourcePageNumber: 5
          },
          {
            id: 434,
            questionNumberLabel: 'Question 6',
            title: 'Adrenergic Category of Drugs I - IV',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'What is the adrenergic category of the above drugs (Drugs I through IV)?',
            options: [
              'Direct sympathomimetics',
              'Indirect sympathomimetics',
              'Direct sympatholytics',
              'Indirect sympatholytics',
              'a and d'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: They do not stimulate adrenergic receptors.',
              'Incorrect: They do not release catecholamines.',
              'Correct: They directly bind and competitively block post-junctional alpha-1 adrenergic receptors on vascular smooth muscle and/or prostatic tissue.',
              'Incorrect: They are not depleters or false transmitters.',
              'Incorrect: Option c is the single correct classification.'
            ],
            overallExplanation: 'Quinazoline and sulfonamide alpha-1 antagonists are direct sympatholytics because they block the receptor directly without interfering with neurotransmitter synthesis or vesicular release.',
            highYieldPearl: 'Alpha-1 blockers (Prazosin, Terazosin, Doxazosin, Tamsulosin) = direct-acting selective alpha-1 sympatholytics.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 5, Question 33',
            sourcePageNumber: 5
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 6: Quinazoline SAR, BPH & Nebivolol Pharmacogenomics (Questions 34 - 42)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 6,
    title: 'Quinazoline SAR, Uroselectivity & Nebivolol CYP2D6 Pharmacogenomics',
    subtitle: 'Selective alpha-1 antagonism, alpha-1A uroselectivity in BPH, furan ring modification, and CYP2D6 metabolizer phenotypes',
    sections: [
      {
        sectionTitle: 'Quinazoline SAR & BPH Selectivity',
        block_instructions: 'Consider Drugs I through IV and Drug N to answer questions 1–9.',
        structures: [
          SYMPATHOLYTICS_STRUCTURES.prazosin,
          SYMPATHOLYTICS_STRUCTURES.terazosin,
          SYMPATHOLYTICS_STRUCTURES.doxazosin,
          SYMPATHOLYTICS_STRUCTURES.tamsulosin,
          SYMPATHOLYTICS_STRUCTURES.nebivolol,
        ],
        questions: [
          {
            id: 435,
            questionNumberLabel: 'Question 1',
            title: 'Pharmacological Mechanistic Class',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'What is the pharmacological mechanistic class of the above drugs (Drugs I through IV)?',
            options: [
              'Nonselective alpha-antagonists',
              'Selective alpha-1 antagonists',
              'Selective alpha-2 agonists',
              'Nonselective beta-antagonists',
              'Selective beta-1 antagonists'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Phenoxybenzamine and Phentolamine are nonselective alpha-antagonists.',
              'Correct: Drugs I through IV are selective alpha-1 antagonists that spare presynaptic alpha-2 autoreceptors, leaving the negative feedback loop intact and causing less reflex tachycardia than nonselective alpha-blockers.',
              'Incorrect: Clonidine is an alpha-2 agonist.',
              'Incorrect: Propranolol is a nonselective beta-blocker.',
              'Incorrect: Metoprolol is a selective beta-1 blocker.'
            ],
            overallExplanation: 'Selective alpha-1 antagonists competitively block post-junctional alpha-1 receptors on vascular and prostatic smooth muscle, causing vasodilation and relief of bladder outlet obstruction.',
            highYieldPearl: 'Selective alpha-1 blockade spares presynaptic alpha-2 autoreceptors -> intact negative feedback -> less reflex tachycardia than nonselective alpha blockers.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 6, Question 34',
            sourcePageNumber: 6
          },
          {
            id: 436,
            questionNumberLabel: 'Question 2',
            title: 'Selectivity Ranking Towards Alpha-1A Receptors',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Rank the above drugs from the most selective to the least selective towards α1A-receptor:',
            options: [
              'Drug IV > Drug III > Drugs II and I',
              'Drugs I and II > Drug III > Drug IV',
              'Drug III > Drug IV > Drugs II and I',
              'Drug I > Drug II > Drug III > Drug IV',
              'Drug III > Drug IV > Drug II > Drug I'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Drug IV (Tamsulosin) exhibits high selectivity (~10-20 fold) for the alpha-1A subtype localized in the prostate and bladder neck over the alpha-1B subtype in blood vessels. In contrast, quinazolines (Prazosin, Terazosin, Doxazosin) show little to no subtype selectivity (alpha-1A = alpha-1B = alpha-1D).',
              'Incorrect: Drugs I and II are non-subtype selective.',
              'Incorrect: Drug III does not surpass Drug IV in alpha-1A selectivity.',
              'Incorrect: Drug IV is by far the most selective for alpha-1A.',
              'Incorrect: Drug IV must be at the top of the ranking.'
            ],
            overallExplanation: 'Tamsulosin (Drug IV) is an arylalkylsulfonamide uroselective alpha-1A antagonist, whereas the classical quinazolines (Drugs I, II, III) are equipotent across alpha-1A, 1B, and 1D subtypes.',
            highYieldPearl: 'Uroselectivity rank: Drug IV (Tamsulosin, selective alpha-1A) >> Drugs I, II, III (non-subtype selective quinazolines).',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 6, Question 35',
            sourcePageNumber: 6
          },
          {
            id: 437,
            questionNumberLabel: 'Question 3',
            title: 'Essential Pharmacophoric Groups for Drug I Binding',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'All of the following functional groups are essential for Drug I binding to the adrenergic receptor EXCEPT:',
            options: [
              'Methoxy groups at positions-6 and 7 of the bicyclic heteroaromatic system',
              'Furan-containing acyl group',
              'The primary amino group at position-4 of the bicyclic heteroaromatic system',
              'The nitrogen atom at position-1 of the bicyclic heteroaromatic system',
              'c and d'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect (essential): The 6,7-dimethoxy groups are critical for hydrogen bonding to receptor serine residues.',
              'Correct (NOT essential): The furan ring of prazosin can be modified or replaced without loss of affinity. For example, reduction to tetrahydrofuran (Terazosin) or substitution with a benzodioxan (Doxazosin) maintains or enhances affinity and extends half-life.',
              'Incorrect (essential): The 4-amino group is crucial for protonation and ionic anchoring.',
              'Incorrect (essential): The N-1 nitrogen participates in essential hydrogen bonding.',
              'Incorrect: Both c and d are essential.'
            ],
            overallExplanation: 'The 4-amino-6,7-dimethoxyquinazoline core represents the essential pharmacophore. The acyl substituent on the piperazine nitrogen governs pharmacokinetics (duration of action) rather than receptor affinity.',
            highYieldPearl: 'Quinazoline SAR: 4-amino, 6,7-dimethoxy, and N-1 are essential for receptor binding. The piperazine acyl substituent (furan/THF/benzodioxan) modulates PK and half-life.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 6, Question 36',
            sourcePageNumber: 6
          },
          {
            id: 438,
            questionNumberLabel: 'Question 4',
            title: 'Dual Indication: Hypertension and Benign Prostatic Hyperplasia',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs can be used to treat hypertension as well as to alleviate symptoms of benign prostate hyperplasia?',
            options: [
              'Drugs I, II, and III',
              'Drug IV only',
              'Drug I only',
              'Drug N only'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Drugs I (Prazosin), II (Terazosin), and III (Doxazosin) block alpha-1B receptors in blood vessels (lowering blood pressure) and alpha-1A receptors in the prostate stroma (relaxing bladder neck smooth muscle), making them ideal for patients with concurrent hypertension and BPH.',
              'Incorrect: Drug IV lacks significant vascular alpha-1B activity at standard doses.',
              'Incorrect: Terazosin and Doxazosin are also approved for both.',
              'Incorrect: Drug N is a beta-blocker, not an alpha-1 antagonist.'
            ],
            overallExplanation: 'Non-subtype selective alpha-1 blockers (Prazosin, Terazosin, Doxazosin) relax vascular smooth muscle (vasodilation for hypertension) and prostatic smooth muscle (urinary relief for BPH).',
            highYieldPearl: 'Dual HTN + BPH indication: Prazosin, Terazosin, Doxazosin (block both alpha-1B in vessels and alpha-1A in prostate).',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 6, Question 37',
            sourcePageNumber: 6
          },
          {
            id: 439,
            questionNumberLabel: 'Question 5',
            title: 'Once-Daily Uroselective BPH Management',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is used once daily to manage the symptoms of benign prostate hyperplasia with limited-to none cardiovascular effects?',
            options: [
              'Drug I',
              'Drug II',
              'Drug III',
              'Drug IV',
              'Drug N'
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect: Drug I requires multiple daily doses and causes first-dose hypotension.',
              'Incorrect: Drug II lowers blood pressure.',
              'Incorrect: Drug III lowers blood pressure.',
              'Correct: Drug IV (Tamsulosin) selectively antagonizes alpha-1A receptors in prostatic smooth muscle over vascular alpha-1B receptors, providing relief of BPH symptoms without significant reduction in blood pressure or orthostatic syncope.',
              'Incorrect: Drug N is nebivolol.'
            ],
            overallExplanation: 'Drug IV (Tamsulosin) is a uroselective alpha-1A blocker indicated specifically for BPH. Its receptor selectivity minimizes vascular dilation, making it preferable in normotensive elderly patients.',
            highYieldPearl: 'Drug IV (Tamsulosin) = uroselective alpha-1A antagonist for BPH with minimal blood pressure or cardiovascular effects.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 6, Question 38',
            sourcePageNumber: 6
          },
          {
            id: 440,
            questionNumberLabel: 'Question 6',
            title: 'Equipotent Subtype Non-Discrimination',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs equally affect(s) all subtypes of α1-receptor?',
            options: [
              'Drugs I, II, and III',
              'Drug IV only',
              'Drug N only',
              'Drug I only'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Drugs I (Prazosin), II (Terazosin), and III (Doxazosin) are classical quinazolines that display equal affinity across alpha-1A, alpha-1B, and alpha-1D adrenergic receptor subtypes.',
              'Incorrect: Drug IV is selective for alpha-1A.',
              'Incorrect: Drug N is a beta-blocker.',
              'Incorrect: Terazosin and Doxazosin also equally affect all subtypes.'
            ],
            overallExplanation: 'Quinazoline-piperazines do not discriminate among alpha-1 receptor subtypes, blocking alpha-1A (prostate), alpha-1B (blood vessels), and alpha-1D (bladder dome/spinal cord) with equal potency.',
            highYieldPearl: 'Non-subtype selective alpha-1 blockers: Drugs I, II, III (Prazosin, Terazosin, Doxazosin). Subtype selective: Drug IV (Tamsulosin).',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 6, Question 39',
            sourcePageNumber: 6
          },
          {
            id: 441,
            questionNumberLabel: 'Question 7',
            title: 'Reflex Tachycardia Potential',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs may be associated with reflex tachycardia because of it(their) vasodilatory effect(s)?',
            options: [
              'Drugs I, II, and III',
              'Drug IV',
              'Drug N',
              'None of the above'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Rapid vasodilation induced by Drugs I, II, and III (Prazosin, Terazosin, Doxazosin) can trigger baroreceptor-mediated reflex sympathetic discharge leading to reflex tachycardia, especially upon initial titration (first-dose effect).',
              'Incorrect: Drug IV produces minimal vasodilation and rarely triggers reflex tachycardia.',
              'Incorrect: Drug N is a beta-blocker and slows heart rate.',
              'Incorrect: Option a is correct.'
            ],
            overallExplanation: 'Peripheral arterial vasodilation lowers systemic vascular resistance and blood pressure, triggering baroreceptor reflexes. While selective alpha-1 blockers cause far less reflex tachycardia than nonselective alpha blockers, mild reflex tachycardia can still occur.',
            highYieldPearl: 'Alpha-1 blockers lower SVR -> baroreceptor activation -> potential reflex tachycardia and first-dose orthostatic hypotension.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 6, Question 40',
            sourcePageNumber: 6
          },
          {
            id: 442,
            questionNumberLabel: 'Question 8',
            title: 'CYP2D6 Pharmacogenomic Phenotypes in Nebivolol Metabolism',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Drug N (Nebivolol) is metabolized by CYP2D6. How do the Extensive Metabolizer (EM) and Poor Metabolizer (PM) phenotypes differ regarding pharmacokinetics and cardioselectivity?',
            options: [
              'In PMs, nebivolol is cleared faster and is more cardioselective',
              'In PMs, parent nebivolol accumulates with a much longer half-life (~19-30 hours vs ~12 hours in EMs), higher oral bioavailability, and diminished beta-1 cardioselectivity at high doses',
              'In EMs, nebivolol has zero active metabolites',
              'CYP2D6 polymorphism has no measurable effect on nebivolol pharmacology'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: PMs clear parent drug much slower.',
              'Correct: In CYP2D6 Poor Metabolizers (PMs), parent nebivolol clearance is severely reduced, prolonging half-life to 19-30 hours (vs 12 hours in EMs) and increasing bioavailability. At elevated plasma levels, strict beta-1 cardioselectivity is compromised.',
              'Incorrect: In EMs, hydroxylated metabolites are active and contribute to cardioselective beta-blockade.',
              'Incorrect: CYP2D6 status significantly impacts nebivolol kinetics.'
            ],
            overallExplanation: 'Nebivolol undergoes CYP2D6 alicyclic hydroxylation. In extensive metabolizers (EMs), hydroxylated metabolites contribute to beta-blockade with high cardioselectivity (t1/2 ~12h). In poor metabolizers (PMs), parent drug accumulates, half-life lengthens to ~19-30h, and cardioselectivity decreases.',
            highYieldPearl: 'Nebivolol in CYP2D6 Poor Metabolizers: 5-10x higher parent drug AUC, t1/2 prolonged to 19-30h, loss of strict beta-1 cardioselectivity at higher levels.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 6, Question 41',
            sourcePageNumber: 6
          },
          {
            id: 443,
            questionNumberLabel: 'Question 9',
            title: 'Nebivolol Mechanistic Properties',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'State whether each of the following statements is true or false describing Drug N (Nebivolol):',
            subStatements: [
              {
                id: 'a',
                text: 'It is a nonselective beta-blocker.',
                isCorrect: false,
                explanation: 'False: Nebivolol has the highest beta-1 selectivity among currently available beta-blockers at standard therapeutic doses.'
              },
              {
                id: 'b',
                text: 'It is associated with quinidine-like membrane stabilizing effect.',
                isCorrect: false,
                explanation: 'False: Nebivolol lacks membrane-stabilizing activity (MSA).'
              },
              {
                id: 'c',
                text: 'It has intrinsic sympathomimetic activity.',
                isCorrect: false,
                explanation: 'False: Nebivolol lacks ISA.'
              },
              {
                id: 'd',
                text: 'It is clinically used as a mixture of symmetrical isomers (racemic d- and l-enantiomers).',
                isCorrect: true,
                explanation: 'True: d-Nebivolol provides potent, highly selective beta-1 blockade, whereas l-nebivolol stimulates endothelial nitric oxide synthase (eNOS) via beta-3 agonism to cause vasodilation.'
              },
              {
                id: 'e',
                text: 'It can orally be used to treat hypertension.',
                isCorrect: true,
                explanation: 'True: Nebivolol is orally administered once daily for hypertension.'
              },
              {
                id: 'f',
                text: 'It is most cardio-selective in poor metabolizers.',
                isCorrect: false,
                explanation: 'False: In poor metabolizers, high drug concentrations begin to spill over and block beta-2 receptors, diminishing cardioselectivity.'
              },
              {
                id: 'g',
                text: 'It is most orally bioavailable in extensive metabolizers.',
                isCorrect: false,
                explanation: 'False: Oral bioavailability is much higher in poor metabolizers (~96%) than in extensive metabolizers (~12%) due to absent first-pass CYP2D6 hydroxylation.'
              },
              {
                id: 'h',
                text: 'Extensive metabolizers enjoy long-acting effect of Drug N.',
                isCorrect: true,
                explanation: 'True: Even in EMs, active hydroxylated metabolites maintain beta-blocking action over a 24-hour interval.'
              }
            ],
            overallExplanation: 'Nebivolol is a racemic mixture where d-nebivolol is an ultra-selective beta-1 blocker and l-nebivolol stimulates endothelial NO release. It lacks ISA and MSA.',
            highYieldPearl: 'Nebivolol = d-isomer (potent beta-1 blocker) + l-isomer (endothelial NO release via beta-3). Highest beta-1 cardioselectivity!',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 6, Question 42',
            sourcePageNumber: 6
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 7: Head-to-Head Comparative Battery: Nebivolol vs Carvedilol vs Propranolol (Question 43)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 7,
    title: 'Head-to-Head Beta-Blocker Comparison: Nebivolol vs. Carvedilol vs. Propranolol',
    subtitle: 'Direct comparative matrix across cardioselectivity, vasodilatory mechanisms, CNS adverse potential, and membrane stabilization',
    sections: [
      {
        sectionTitle: 'Comparative Pharmacology of Drug N, Drug C, and Drug P',
        block_instructions: 'Compare the following three beta-blockers (Drug N = Nebivolol, Drug C = Carvedilol, and Drug P = Propranolol) to answer Question 1.',
        structures: [
          SYMPATHOLYTICS_STRUCTURES.nebivolol,
          SYMPATHOLYTICS_STRUCTURES.carvedilol,
          SYMPATHOLYTICS_STRUCTURES.propranolol,
        ],
        questions: [
          {
            id: 444,
            questionNumberLabel: 'Question 1',
            title: 'Comprehensive Head-to-Head Comparative Battery (Drugs N, C, P)',
            category: 'Clinical Pharmacology',
            type: 'sub-statements',
            questionStem: 'Compare the following three beta-blockers (Drug N, Drug C, and Drug P) considering cardioselectivity, vasodilation, CNS effects, and membrane stabilization:',
            subStatements: [
              {
                id: 'a',
                text: 'Cardioselectivity: Drug N is highly beta-1 selective, whereas Drug P and Drug C are nonselective beta-blockers.',
                isCorrect: true,
                explanation: 'True: Nebivolol has the highest beta-1 selectivity; Propranolol and Carvedilol block both beta-1 and beta-2 receptors equipotently.'
              },
              {
                id: 'b',
                text: 'Vasodilatory effect and its mechanism: Drug N vasodilates via endothelial nitric oxide (NO) release, Drug C vasodilates via alpha-1 adrenergic receptor blockade, and Drug P lacks vasodilatory activity.',
                isCorrect: true,
                explanation: 'True: Nebivolol stimulates eNOS via beta-3 agonism; Carvedilol competitively antagonizes vascular post-junctional alpha-1 receptors; Propranolol has no vasodilatory action.'
              },
              {
                id: 'c',
                text: 'Potential of CNS side effects: Drug P has the highest potential for CNS side effects (fatigue, depression, vivid dreams), Drug C has intermediate potential, and Drug N has the lowest potential.',
                isCorrect: true,
                explanation: 'True: Propranolol is highly lipophilic (logP ~3.0) and readily crosses the blood-brain barrier; Nebivolol and Carvedilol have much lower incidence of central CNS adverse effects.'
              },
              {
                id: 'd',
                text: 'Potential of membrane-stabilizing effect: Drug P has prominent quinidine-like membrane-stabilizing activity (fast Na+ channel block), Drug C has weak activity, and Drug N has no membrane-stabilizing activity.',
                isCorrect: true,
                explanation: 'True: Propranolol exhibits marked local anesthetic / membrane-stabilizing activity at elevated doses; Nebivolol is devoid of MSA.'
              }
            ],
            overallExplanation: 'Summary comparison:\n- Drug N (Nebivolol): Highly beta-1 cardioselective, vasodilates via endothelial NO release, low CNS penetration, zero MSA.\n- Drug C (Carvedilol): Nonselective beta-blocker, vasodilates via alpha-1 blockade, antioxidant carbazole, weak MSA.\n- Drug P (Propranolol): Nonselective beta-blocker, zero vasodilation, highest lipophilicity and CNS adverse effects, strong membrane-stabilizing activity (fast Na+ channel block).',
            highYieldPearl: 'Beta-Blocker Comparative Triad:\n- Nebivolol = Beta-1 selective + NO vasodilation.\n- Carvedilol = Nonselective Beta + Alpha-1 vasodilation + Antioxidant.\n- Propranolol = Nonselective Beta + High CNS entry + Strong Membrane-Stabilizing Activity (MSA).',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 7, Question 43',
            sourcePageNumber: 7
          }
        ]
      }
    ]
  }
];

export function getDefaultSympatholyticsModule(): ReviewModule {
  return {
    id: 'antihypertensives_2_mcp2',
    version: '2.0.0',
    examId: 'exam_2',
    examTitle: 'Exam 2: Antihypertensives & Lipids',
    title: 'Antihypertensives II: Sympatholytics',
    subtitle: 'Adrenergic antagonists, central alpha-2 agonists, quinazolines, and pharmacogenomics',
    course: 'Medicinal Chemistry & Pharmacology II',
    semester: 'Spring',
    code: 'MCP-2-04',
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    chemicalStructures: Object.values(SYMPATHOLYTICS_STRUCTURES),
    pages: sympatholyticsPages,
  };
}
