import { ReviewModule, ReviewPage } from '../../types/reviewModule';
import { SYMPATHOLYTICS_STRUCTURES } from './exam2Structures';

export const sympatholyticsPages: ReviewPage[] = [
  // ---------------------------------------------------------------------------
  // PAGE 1: Beta-Blockers Overview & SAR (Questions 1 - 16)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 1,
    title: 'Adrenergic Receptor Antagonists: Beta-Blockers SAR & Clinical Pharmacology',
    subtitle: 'Aryloxypropanolamines, cardioselectivity, intrinsic sympathomimetic activity, membrane stabilization, and vasodilating beta-blockers',
    sections: [
      {
        sectionTitle: 'Beta-Blocker Prototypes & Chemical Classification',
        block_instructions: 'Consider Structures I (Propranolol), II (Metoprolol), III (Esmolol), IV (Carvedilol), V (Pindolol), and VI (Nadolol) to answer questions 1 - 16.',
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
            questionStem: 'Which of the following best describes the chemical class of the above drugs (Propranolol, Metoprolol, Esmolol, Carvedilol, Pindolol, Nadolol)?',
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
              'β-Blockers (Adrenergic beta-receptor antagonists)',
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
            questionStem: 'The above drugs are primarily indicated to treat which of the following cardiovascular diseases?',
            options: [
              'Diabetes mellitus',
              'Hypertension, angina pectoris, heart failure, and cardiac arrhythmias',
              'Chronic obstructive pulmonary disease',
              'Peptic ulcer disease',
              'Bacterial infection',
              'Depression'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Beta-blockers can mask hypoglycemia in diabetes.',
              'Correct: Beta-blockers are foundational agents for hypertension, ischemic heart disease / angina, post-MI cardioprotection, systolic heart failure (carvedilol, metoprolol succinate, bisoprolol), and supraventricular / ventricular arrhythmias.',
              'Incorrect: Nonselective beta-blockers are contraindicated in asthma/COPD due to bronchoconstriction.',
              'Incorrect: Not used for ulcers.',
              'Incorrect: Not antibacterial agents.',
              'Incorrect: Propranolol can worsen depression due to central monoamine dampening.'
            ],
            overallExplanation: 'Beta-blockers manage hypertension, ischemic heart disease, tachyarrhythmias, and compensated systolic heart failure.',
            highYieldPearl: 'Key guideline-directed heart failure beta-blockers: Bisoprolol, Carvedilol, Metoprolol succinate (extended release).',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 1, Question 3',
            sourcePageNumber: 1
          },
          {
            id: 404,
            questionNumberLabel: 'Question 4',
            title: 'Adrenergic Classification',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which of the following descriptions accurately classifies the adrenergic site and mechanism of the listed beta-blockers?',
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
            questionStem: 'Which of the above drugs is(are) cardioselective beta-1 blockers (second generation)?',
            options: [
              'Drug I (Propranolol)',
              'Drug II (Metoprolol) and Drug III (Esmolol)',
              'Drug IV (Carvedilol)',
              'Drug V (Pindolol)',
              'Drug VI (Nadolol)'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Propranolol is a nonselective beta-1/beta-2 blocker.',
              'Correct: Metoprolol and Esmolol contain para-substituted phenyl rings with hydrogen-bonding or ester groups that selectively fit the beta-1 receptor binding pocket over beta-2.',
              'Incorrect: Carvedilol is a nonselective beta-blocker with additional alpha-1 blocking activity.',
              'Incorrect: Pindolol is a nonselective beta-blocker with intrinsic sympathomimetic activity.',
              'Incorrect: Nadolol is a nonselective beta-1/beta-2 blocker.'
            ],
            overallExplanation: 'Cardioselective (beta-1) agents possess a para-substituent on the phenoxy ring (e.g., metoprolol, atenolol, esmolol, bisoprolol). The para-group engages with specific residues in the beta-1 binding crevice that are absent or steric hindrances in beta-2 receptors.',
            highYieldPearl: 'Beta-1 Cardioselective = para-substituted aryloxypropanolamines (Metoprolol, Atenolol, Esmolol, Bisoprolol, Nebivolol).',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 1, Question 5',
            sourcePageNumber: 1
          },
          {
            id: 406,
            questionNumberLabel: 'Question 6',
            title: 'Beta-Blocker Selection in Bronchospastic Disease',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is more appropriately preferred in hypertensive patients with a history of bronchospasm or mild COPD?',
            options: [
              'Drug I (Propranolol)',
              'Drug II (Metoprolol)',
              'Drug IV (Carvedilol)',
              'Drug V (Pindolol)',
              'Drug VI (Nadolol)'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Nonselective beta-blockers like propranolol block bronchial beta-2 receptors, precipitating life-threatening bronchospasm.',
              'Correct: Cardioselective beta-1 blockers (e.g., Metoprolol, Atenolol) preferentially block cardiac beta-1 receptors and spare bronchial smooth muscle beta-2 receptors at low-to-moderate therapeutic doses.',
              'Incorrect: Carvedilol blocks beta-2 receptors and can cause bronchospasm.',
              'Incorrect: Pindolol is nonselective.',
              'Incorrect: Nadolol is nonselective.'
            ],
            overallExplanation: 'While all beta-blockers require caution in severe reactive airway disease, cardioselective (beta-1) antagonists (Metoprolol, Bisoprolol) minimize beta-2 mediated bronchoconstriction.',
            highYieldPearl: 'In asthma/COPD, select cardioselective beta-1 blockers (e.g., Metoprolol) to avoid blocking bronchodilating beta-2 receptors.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 1, Question 6',
            sourcePageNumber: 1
          },
          {
            id: 407,
            questionNumberLabel: 'Question 7',
            title: 'Mixed Alpha/Beta Adrenergic Antagonists',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is a mixed alpha-1 / beta-adrenergic antagonist (third-generation vasodilating beta-blocker)?',
            options: [
              'Drug I (Propranolol)',
              'Drug II (Metoprolol)',
              'Drug III (Esmolol)',
              'Drug IV (Carvedilol)',
              'Drug VI (Nadolol)'
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect: Propranolol has no alpha-1 blocking activity.',
              'Incorrect: Metoprolol is a selective beta-1 blocker.',
              'Incorrect: Esmolol is a selective beta-1 blocker.',
              'Correct: Carvedilol incorporates a carbazole moiety with an aryloxypropanolamine chain (beta-blockade) linked to a phenoxyethylamine substituent (alpha-1 blockade), imparting vasodilatory properties.',
              'Incorrect: Nadolol lacks alpha-1 blocking activity.'
            ],
            overallExplanation: 'Carvedilol and Labetalol are dual alpha-1 and beta-antagonists. Alpha-1 antagonism lowers peripheral vascular resistance, reducing afterload without causing reflex tachycardia because beta-1 receptors are concurrently blocked.',
            highYieldPearl: 'Mixed alpha/beta blockers = Carvedilol and Labetalol. Alpha-1 block = vasodilation/decreased SVR; Beta-1 block = prevents reflex tachycardia.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 1, Question 7',
            sourcePageNumber: 1
          },
          {
            id: 408,
            questionNumberLabel: 'Question 8',
            title: 'Membrane-Stabilizing Activity (MSA)',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs possesses significant quinidine-like membrane-stabilizing activity (cardiac fast Na+ channel blocking effect)?',
            options: [
              'Drug I (Propranolol)',
              'Drug II (Metoprolol)',
              'Drug III (Esmolol)',
              'Drug VI (Nadolol)'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Propranolol exhibits prominent membrane-stabilizing activity (MSA / local anesthetic effect) via blockade of cardiac fast inward Na+ channels at elevated concentrations.',
              'Incorrect: Metoprolol has minimal to no MSA at therapeutic doses.',
              'Incorrect: Esmolol has no MSA.',
              'Incorrect: Nadolol is hydrophilic and devoid of MSA.'
            ],
            overallExplanation: 'Membrane-stabilizing activity (MSA), also termed quinidine-like or local anesthetic activity, occurs in lipophilic beta-blockers like propranolol that block fast voltage-gated Na+ channels.',
            highYieldPearl: 'Membrane-Stabilizing Activity (MSA) = Na+ channel blockade / local anesthetic effect. Highest in Propranolol; absent in Nadolol, Atenolol, and Esmolol.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Question 8',
            sourcePageNumber: 2
          },
          {
            id: 409,
            questionNumberLabel: 'Question 9',
            title: 'Intrinsic Sympathomimetic Activity (ISA)',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs possesses intrinsic sympathomimetic activity (ISA / partial agonist activity)?',
            options: [
              'Drug I (Propranolol)',
              'Drug II (Metoprolol)',
              'Drug III (Esmolol)',
              'Drug IV (Carvedilol)',
              'Drug V (Pindolol)'
            ],
            correctIndex: 4,
            optionExplanations: [
              'Incorrect: Propranolol is a pure competitive antagonist without ISA.',
              'Incorrect: Metoprolol is a pure antagonist.',
              'Incorrect: Esmolol is a pure antagonist.',
              'Incorrect: Carvedilol has no ISA.',
              'Correct: Pindolol acts as a partial beta-receptor agonist, stimulating the receptor weakly while preventing full agonist (epinephrine/norepinephrine) binding, resulting in less resting bradycardia.'
            ],
            overallExplanation: 'ISA agents (Pindolol, Acebutolol) stimulate beta-receptors at rest with low efficacy while blocking intense catecholamine stimulation during exercise, minimizing excessive resting bradycardia.',
            highYieldPearl: 'Intrinsic Sympathomimetic Activity (ISA) = partial agonist. Prototype = Pindolol. Avoid in post-MI and heart failure patients.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Question 9',
            sourcePageNumber: 2
          },
          {
            id: 410,
            questionNumberLabel: 'Question 10',
            title: 'Ultrashort-Acting Beta-Blocker in Emergency Settings',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is preferred for acute IV titration in the emergency room / ICU for hypertensive emergencies or supraventricular tachycardias, and what structural feature governs this property?',
            options: [
              'Drug I (Propranolol), due to high lipophilicity',
              'Drug II (Metoprolol), due to oral sustained release',
              'Drug III (Esmolol), due to a methyl ester linkage rapidly hydrolyzed by erythrocyte esterases (half-life ~9 minutes)',
              'Drug VI (Nadolol), due to lack of hepatic metabolism'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: Propranolol has a multi-hour half-life and variable clearance.',
              'Incorrect: Metoprolol is not ultrashort-acting.',
              'Correct: Esmolol incorporates a para-methyl ester substituent that is rapidly cleaved by red blood cell cytosolic esterases to an inactive carboxylic acid metabolite, giving an elimination half-life of ~9 minutes.',
              'Incorrect: Nadolol has an ultra-long half-life (~20-24 hours).'
            ],
            overallExplanation: 'Esmolol is an ultrashort-acting soft drug designed with a metabolically labile ester function that erythrocyte esterases rapidly cleave into an inactive acid metabolite, enabling rapid on/off titration in acute care.',
            highYieldPearl: 'Esmolol = ultrashort beta-1 blocker (t1/2 ~9 min) due to rapid hydrolysis by RBC esterases. Ideal for ICU/ER acute titration.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Question 10',
            sourcePageNumber: 2
          },
          {
            id: 411,
            questionNumberLabel: 'Question 11',
            title: 'Antioxidant Properties in Heart Failure',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs possesses unique antioxidant properties that scavenge reactive oxygen species and inhibit lipid peroxidation in heart failure?',
            options: [
              'Drug I (Propranolol)',
              'Drug III (Esmolol)',
              'Drug IV (Carvedilol), due to its electron-rich carbazole ring system',
              'Drug V (Pindolol)',
              'Drug VI (Nadolol)'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: Propranolol does not exhibit meaningful antioxidant properties.',
              'Incorrect: Esmolol lacks carbazole antioxidant features.',
              'Correct: Carvedilol contains a fused tricyclic carbazole nucleus that functions as a potent scavenger of oxygen free radicals, suppressing neutrophil-mediated myocardial lipid peroxidation.',
              'Incorrect: Pindolol lacks this antioxidant activity.',
              'Incorrect: Nadolol lacks carbazole antioxidant features.'
            ],
            overallExplanation: 'Carvedilol provides cardioprotection in chronic systolic heart failure beyond beta-blockade through carbazole-mediated free radical scavenging and reduction of oxidative stress.',
            highYieldPearl: 'Carvedilol = mixed alpha-1/beta-blocker with a carbazole ring that provides potent antioxidant activity in heart failure.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Question 11',
            sourcePageNumber: 2
          },
          {
            id: 412,
            questionNumberLabel: 'Question 12',
            title: 'Dual ISA and Membrane-Stabilizing Effects',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs displays both intrinsic sympathomimetic activity (ISA) and a membrane-stabilizing effect?',
            options: [
              'Drug I (Propranolol)',
              'Drug II (Metoprolol)',
              'Drug V (Pindolol)',
              'Drug VI (Nadolol)'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: Propranolol has strong MSA but zero ISA.',
              'Incorrect: Metoprolol has neither significant ISA nor MSA.',
              'Correct: Pindolol uniquely possesses prominent partial agonist activity (ISA) alongside weak-to-moderate membrane-stabilizing activity.',
              'Incorrect: Nadolol is devoid of both ISA and MSA.'
            ],
            overallExplanation: 'Pindolol is a nonselective beta-blocker characterized by both intrinsic sympathomimetic activity and membrane-stabilizing properties.',
            highYieldPearl: 'Pindolol combines nonselective beta-blockade, partial agonist activity (ISA), and mild membrane stabilization.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Question 12',
            sourcePageNumber: 2
          },
          {
            id: 413,
            questionNumberLabel: 'Question 13',
            title: 'Lipophilicity & Blood-Brain Barrier Penetration',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs has sufficient lipophilicity to readily cross the blood-brain barrier to treat performance anxiety/migraines, but also poses risks for central CNS adverse effects (depression, vivid dreams, insomnia)?',
            options: [
              'Drug I (Propranolol)',
              'Drug II (Metoprolol)',
              'Drug III (Esmolol)',
              'Drug VI (Nadolol)'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Propranolol is highly lipophilic (LogP ~2.6), readily penetrating the BBB into the CNS, making it effective for migraine prophylaxis and stage fright, but predisposing to nightmares, fatigue, and depression.',
              'Incorrect: Metoprolol has moderate lipophilicity.',
              'Incorrect: Esmolol is hydrophilic and metabolized rapidly in the periphery.',
              'Incorrect: Nadolol is highly hydrophilic (LogP ~0.7) and does not cross the BBB.'
            ],
            overallExplanation: 'Propranolol is the most lipophilic classical beta-blocker, easily traversing the blood-brain barrier to exert central sympatholytic effects (and CNS toxicities).',
            highYieldPearl: 'Propranolol = high lipophilicity -> crosses BBB -> treats stage fright & migraine, but causes vivid dreams/depression. Contrast with Nadolol/Atenolol (polar, minimal CNS penetration).',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Question 13',
            sourcePageNumber: 2
          },
          {
            id: 414,
            questionNumberLabel: 'Question 14',
            title: 'Avoidance of Hepatic First-Pass Metabolism',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs largely avoids hepatic first-pass metabolism because it is primarily cleared unchanged by renal excretion?',
            options: [
              'Drug I (Propranolol)',
              'Drug II (Metoprolol)',
              'Drug IV (Carvedilol)',
              'Drug VI (Nadolol)'
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect: Propranolol undergoes extensive, saturable hepatic first-pass metabolism (>70-80%).',
              'Incorrect: Metoprolol undergoes substantial CYP2D6 first-pass metabolism (~50%).',
              'Incorrect: Carvedilol undergoes extensive stereoselective hepatic first-pass metabolism.',
              'Correct: Nadolol is highly water-soluble (polar dihydroxy cyclohexane ring) and is excreted >75% unchanged in urine, avoiding extensive hepatic first-pass metabolism and CYP interactions.'
            ],
            overallExplanation: 'Hydrophilic beta-blockers such as Nadolol and Atenolol exhibit low hepatic CYP metabolism and are excreted unchanged in the urine, providing predictable bioavailability and low drug interaction risk.',
            highYieldPearl: 'Nadolol & Atenolol = hydrophilic -> low hepatic first-pass -> excreted unchanged by kidneys -> adjust dose in renal impairment.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Question 14',
            sourcePageNumber: 2
          },
          {
            id: 415,
            questionNumberLabel: 'Question 15',
            title: 'Longest Elimination Half-Life',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs has the most extended elimination half-life (~20 - 24 hours), enabling once-daily dosing?',
            options: [
              'Drug I (Propranolol, t1/2 ~3-4 hours)',
              'Drug II (Metoprolol tartrate, t1/2 ~3-4 hours)',
              'Drug III (Esmolol, t1/2 ~9 minutes)',
              'Drug VI (Nadolol, t1/2 ~20-24 hours)'
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect: Propranolol immediate release has a short half-life of 3-4 hours.',
              'Incorrect: Metoprolol tartrate has a half-life of 3-4 hours.',
              'Incorrect: Esmolol has an ultrashort half-life of 9 minutes.',
              'Correct: Nadolol has an elimination half-life of 20-24 hours, the longest among classical beta-blockers, owing to minimal hepatic clearance and slow renal filtration.'
            ],
            overallExplanation: 'Nadolol exhibits an elimination half-life of 20-24 hours, permitting true once-daily administration without special extended-release formulation technology.',
            highYieldPearl: 'Nadolol has the longest half-life (~20-24 h) among classical beta-blockers due to renal clearance.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Question 15',
            sourcePageNumber: 2
          },
          {
            id: 416,
            questionNumberLabel: 'Question 16',
            title: 'Vasodilatory Beta-Blockers',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is classified as a vasodilatory beta-blocker?',
            options: [
              'Drug I (Propranolol)',
              'Drug II (Metoprolol)',
              'Drug IV (Carvedilol)',
              'Drug V (Pindolol)',
              'Drug VI (Nadolol)'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: Propranolol causes peripheral vasoconstriction initially due to unopposed alpha-1 tone.',
              'Incorrect: Metoprolol does not promote direct vasodilation.',
              'Correct: Carvedilol lowers systemic vascular resistance through concurrent alpha-1 adrenergic receptor blockade, making it a third-generation vasodilatory beta-blocker.',
              'Incorrect: Pindolol does not block alpha-1 receptors.',
              'Incorrect: Nadolol is not vasodilatory.'
            ],
            overallExplanation: 'Third-generation beta-blockers reduce peripheral vascular resistance either via alpha-1 receptor blockade (Carvedilol, Labetalol) or endothelial nitric oxide release (Nebivolol).',
            highYieldPearl: 'Vasodilatory beta-blockers: Carvedilol & Labetalol (via alpha-1 block); Nebivolol (via endothelial NO release).',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 2, Question 16',
            sourcePageNumber: 2
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 2: Central Sympatholytics: Clonidine & Methyldopa (Questions 17 - 24)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 2,
    title: 'Central Sympatholytics & Alpha-2 Adrenergic Agonists',
    subtitle: 'Clonidine 2-aminoimidazoline SAR, methyldopa central bioactivation, LAT1 transport, and neurotransmitter depleters',
    sections: [
      {
        sectionTitle: 'Beta-Blocker Stereochemical Requirements',
        questions: [
          {
            id: 417,
            questionNumberLabel: 'Question 17',
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
          }
        ]
      },
      {
        sectionTitle: 'Clonidine SAR & Central Alpha-2 Mechanism',
        structures: [SYMPATHOLYTICS_STRUCTURES.clonidine],
        questions: [
          {
            id: 418,
            questionNumberLabel: 'Question 18',
            title: 'Clonidine Chemical & Mechanistic Classification',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'Considering the chemical structure of clonidine (Catapres), state whether each of the following statements is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'Clonidine is a 2-aminoimidazoline derivative.',
                isCorrect: true,
                explanation: 'True: Clonidine chemically consists of a 2,6-dichlorophenyl ring connected via an NH bridge to a 2-imidazoline ring.'
              },
              {
                id: 'b',
                text: 'Clonidine is a selective alpha-2 adrenergic receptor agonist.',
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
                text: 'Clonidine is a direct sympatholytic at the receptor level.',
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
            questionNumberLabel: 'Question 19',
            title: 'Role of Ortho-Chloro Substituents in Clonidine',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following statements is NOT true regarding the ortho-chloro substituents of clonidine?',
            options: [
              'Chlorines increase drug lipophilicity by increasing the hydrophobic surface area',
              'Chlorines electronically compromise the basicity of the cyclic guanidine through their electron-withdrawing inductive effect, lowering pKa to ~8.0',
              'Chlorines sterically dictate a perpendicular (orthogonal) 3D orientation between the phenyl and imidazoline rings, ensuring optimal receptor fit',
              'Replacement of the two chlorines with two methoxy groups significantly increases the adrenergic agonist activity of clonidine',
              'Statements a, b, and c collectively explain why clonidine crosses the blood-brain barrier to act centrally'
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
          }
        ]
      },
      {
        sectionTitle: 'Methyldopa Central Bioactivation & Transport',
        structures: [
          SYMPATHOLYTICS_STRUCTURES.methyldopa,
          SYMPATHOLYTICS_STRUCTURES.alpha_methylnorepinephrine
        ],
        questions: [
          {
            id: 420,
            questionNumberLabel: 'Question 20',
            title: 'Methyldopa Pharmacokinetics & Properties',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'All of the following statements are true about methyldopa (Aldomet) EXCEPT:',
            options: [
              'Methyldopa crosses the blood-brain barrier via the L-type amino acid transporter (LAT1)',
              'Methyldopa is metabolized by COMT and sulfotransferase, limiting its oral bioavailability',
              'It is a prodrug that must be bioactivated in central adrenergic neurons',
              'It has a fast onset of action and high oral bioavailability',
              'It is a centrally-acting antihypertensive agent with a well-established safety profile in pregnancy'
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect (statement is true): Methyldopa is an amino acid and traverses the BBB using the active LAT1 carrier.',
              'Incorrect (statement is true): COMT O-methylates the catechol diol, giving oral bioavailability of ~25-50%.',
              'Incorrect (statement is true): It is bioactivated centrally to alpha-methylnorepinephrine.',
              'Correct (statement is FALSE): Methyldopa has a SLOW onset of action (2-4 hours, peak at 4-6 hours) because it requires active uptake and two-step enzymatic bioactivation; its bioavailability is low and variable.',
              'Incorrect (statement is true): Methyldopa is considered a preferred first-line agent for chronic hypertension in pregnancy.'
            ],
            overallExplanation: 'Methyldopa is an amino acid prodrug requiring active central transport via LAT1 and enzymatic conversion by DOPA decarboxylase and dopamine beta-hydroxylase to the active alpha-2 agonist (1R,2S)-alpha-methylnorepinephrine, resulting in a delayed onset.',
            highYieldPearl: 'Methyldopa = prodrug -> LAT1 carrier across BBB -> decarboxylase + beta-hydroxylase -> (1R,2S)-alpha-methylnorepinephrine. Safe in pregnancy!',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 3, Question 20',
            sourcePageNumber: 3
          },
          {
            id: 421,
            questionNumberLabel: 'Question 21',
            title: 'Active Metabolite of Methyldopa',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which chemical structure represents the true active antihypertensive metabolite of methyldopa in the central nervous system?',
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
            id: 422,
            questionNumberLabel: 'Question 22',
            title: 'Enzymes in Methyldopa Bioactivation',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following enzymes directly contribute to the central bioactivation of methyldopa to its active false neurotransmitter? (Select the correct pair)',
            options: [
              'Sulfotransferase and Acetyltransferase',
              'Aromatic L-amino acid decarboxylase and Dopamine beta-hydroxylase',
              'Catechol-O-methyltransferase (COMT) and Monoamine oxidase (MAO)',
              'CYP2D6 and Carboxylesterase'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Sulfotransferases inactivate methyldopa in the gut wall.',
              'Correct: Methyldopa is decarboxylated by aromatic L-amino acid decarboxylase to alpha-methyldopamine, which is then stereospecifically hydroxylated by dopamine beta-hydroxylase to active (1R,2S)-alpha-methylnorepinephrine.',
              'Incorrect: COMT and MAO degrade catecholamines into inactive metabolites.',
              'Incorrect: CYPs and esterases are not involved in methyldopa bioactivation.'
            ],
            overallExplanation: 'Bioactivation of methyldopa requires: (1) Aromatic L-amino acid decarboxylase (removes carboxylic acid), followed by (2) Dopamine beta-hydroxylase (introduces the chiral beta-hydroxyl group).',
            highYieldPearl: 'Methyldopa bioactivation pathway: Methyldopa -> [L-Aromatic amino acid decarboxylase] -> alpha-Methyldopamine -> [Dopamine beta-hydroxylase] -> (1R,2S)-alpha-Methylnorepinephrine.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 3, Question 22',
            sourcePageNumber: 3
          }
        ]
      },
      {
        sectionTitle: 'Direct vs Indirect Sympatholytics & Sites of Action',
        structures: [
          SYMPATHOLYTICS_STRUCTURES.clonidine,
          SYMPATHOLYTICS_STRUCTURES.reserpine,
          SYMPATHOLYTICS_STRUCTURES.prazosin,
          SYMPATHOLYTICS_STRUCTURES.methyldopa
        ],
        questions: [
          {
            id: 423,
            questionNumberLabel: 'Question 23',
            title: 'Mechanisms of Drugs I - IV (Clonidine, Reserpine, Prazosin, Methyldopa)',
            category: 'Pharmacology MOA',
            type: 'sub-statements',
            questionStem: 'Consider the antihypertensive drugs I (Clonidine), II (Reserpine), III (Prazosin), and IV (Methyldopa) to evaluate the truth of each mechanistic statement:',
            subStatements: [
              {
                id: 'a',
                text: 'Drug I (Clonidine) is a selective alpha-2 adrenergic agonist.',
                isCorrect: true,
                explanation: 'True: Clonidine stimulates presynaptic alpha-2 receptors.'
              },
              {
                id: 'b',
                text: 'Drug II (Reserpine) is an adrenergic neurotransmitter-depleting agent.',
                isCorrect: true,
                explanation: 'True: Reserpine irreversibly inhibits VMAT2, preventing vesicular storage and causing intraneuronal degradation of norepinephrine, dopamine, and serotonin.'
              },
              {
                id: 'c',
                text: 'Drug III (Prazosin) is a selective alpha-1 antagonist with a vasodilatory effect.',
                isCorrect: true,
                explanation: 'True: Prazosin selectively blocks post-synaptic vascular alpha-1 receptors, causing arterial and venous dilation.'
              },
              {
                id: 'd',
                text: 'Drug IV (Methyldopa) is a prodrug that gets activated centrally to become an alpha-2 agonist.',
                isCorrect: true,
                explanation: 'True: Methyldopa is converted to alpha-methylnorepinephrine in brainstem neurons.'
              }
            ],
            overallExplanation: 'Clonidine (alpha-2 agonist), Reserpine (VMAT2 depleter), Prazosin (selective alpha-1 blocker), and Methyldopa (prodrug to alpha-2 agonist) represent distinct classes of sympatholytic agents.',
            highYieldPearl: 'Reserpine = VMAT2 irreversible blocker -> catecholamine depletion -> depression and severe sedation. Prazosin = selective alpha-1 antagonist -> first-dose syncope.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 3, Question 23',
            sourcePageNumber: 3
          },
          {
            id: 424,
            questionNumberLabel: 'Question 24',
            title: 'Sites of Action: Central vs Peripheral',
            category: 'Pharmacology MOA',
            type: 'sub-statements',
            questionStem: 'Regarding the primary anatomical site of action for Drugs I - IV (Clonidine, Reserpine, Prazosin, Methyldopa):',
            subStatements: [
              {
                id: 'a',
                text: 'Drug I (Clonidine) is a centrally acting sympatholytic.',
                isCorrect: true,
                explanation: 'True: Acts on alpha-2 receptors in the medulla.'
              },
              {
                id: 'b',
                text: 'Drug II (Reserpine) acts centrally and peripherally by depleting catecholamines.',
                isCorrect: true,
                explanation: 'True: Reserpine penetrates the CNS (causing severe depression) and also depletes peripheral sympathetic nerve terminals.'
              },
              {
                id: 'c',
                text: 'Drug III (Prazosin) is a centrally acting sympatholytic.',
                isCorrect: false,
                explanation: 'False: Prazosin acts peripherally on vascular smooth muscle post-junctional alpha-1 receptors.'
              },
              {
                id: 'd',
                text: 'Drug IV (Methyldopa) is a peripherally acting sympatholytic.',
                isCorrect: false,
                explanation: 'False: Methyldopa must enter the brain via LAT1 to exert central sympatholytic action.'
              },
              {
                id: 'e',
                text: 'Drugs I and IV are centrally acting, whereas Drug III is peripherally acting.',
                isCorrect: true,
                explanation: 'True: Clonidine and Methyldopa are central; Prazosin is peripheral.'
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
  // PAGE 3: Alpha-1 Antagonists & Nebivolol Pharmacogenomics (Questions 25 - 43)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 3,
    title: 'Alpha-1 Blockers, Quinazoline SAR & Nebivolol CYP2D6 Polymorphism',
    subtitle: 'Aryloxypropanolamine vs arylethanolamine comparisons, uroselective BPH agents, and nebivolol metabolic phenotypes',
    sections: [
      {
        sectionTitle: 'Aryloxypropanolamine vs Arylethanolamine SAR Comparison',
        questions: [
          {
            id: 425,
            questionNumberLabel: 'Question 25',
            title: 'Propranolol vs Isoproterenol Structure-Activity Comparison',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'Consider the chemical structures of Molecule I (Propranolol, an aryloxypropanolamine) and Molecule II (Isoproterenol, an arylethanolamine) to evaluate each statement:',
            subStatements: [
              {
                id: 'a',
                text: 'Molecule I is an aryloxypropanolamine, whereas Molecule II is an arylethanolamine.',
                isCorrect: true,
                explanation: 'True: Propranolol contains an ether oxymethylene spacer; isoproterenol lacks this spacer.'
              },
              {
                id: 'b',
                text: 'Molecule I is a beta-antagonist, whereas Molecule II is a beta-agonist.',
                isCorrect: true,
                explanation: 'True: Propranolol is an antagonist; catecholamine isoproterenol is a nonselective beta-agonist.'
              },
              {
                id: 'c',
                text: 'The two molecules do not discriminate between beta-1 and beta-2 receptors (nonselective).',
                isCorrect: true,
                explanation: 'True: Neither drug has cardioselectivity.'
              },
              {
                id: 'd',
                text: 'Molecule I is used to treat cardiovascular diseases, whereas Molecule II has minimal routine clinical use.',
                isCorrect: true,
                explanation: 'True: Propranolol is widely used; isoproterenol is limited to acute heart block/bradycardia.'
              },
              {
                id: 'e',
                text: 'The active orientation of the chiral OH in Molecule I is (2S) and in Molecule II is (1R).',
                isCorrect: true,
                explanation: 'True: Due to Cahn-Ingold-Prelog priorities, (2S)-aryloxypropanolamine superimposes on (1R)-arylethanolamine.'
              },
              {
                id: 'f',
                text: 'Both molecules are metabolized by Catechol-O-methyltransferase (COMT).',
                isCorrect: false,
                explanation: 'False: Propranolol has a naphthalene ring without catechol hydroxyls and is NOT a substrate for COMT; isoproterenol has a catechol diol and is rapidly metabolized by COMT.'
              },
              {
                id: 'g',
                text: 'Molecule I oral bioavailability is substantially higher than that of Molecule II.',
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
            id: 426,
            questionNumberLabel: 'Question 26',
            title: 'Cardioselective Beta-Blocker with ISA',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following describes Sympatholytic I (Acebutolol)?',
            options: [
              'Highly lipophilic nonselective beta-blocker',
              'Associated with pure quinidine-like effect without receptor blockade',
              'Cardioselective (beta-1) blocker with intrinsic sympathomimetic activity (ISA)',
              'Selective alpha-1 antagonist',
              'Irreversible neurotransmitter depleter'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: Acebutolol is cardioselective.',
              'Incorrect: It is a beta-receptor antagonist.',
              'Correct: Acebutolol is a second-generation cardioselective beta-1 blocker that uniquely possesses intrinsic sympathomimetic activity (ISA) and mild membrane-stabilizing activity.',
              'Incorrect: Acebutolol does not block alpha-1 receptors.',
              'Incorrect: Not a depleter.'
            ],
            overallExplanation: 'Acebutolol is a cardioselective beta-1 antagonist with intrinsic sympathomimetic activity and mild membrane-stabilizing properties.',
            highYieldPearl: 'Acebutolol = Cardioselective (beta-1) + Intrinsic Sympathomimetic Activity (ISA). Metabolized to active diacetolol.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 4, Question 26',
            sourcePageNumber: 4
          },
          {
            id: 427,
            questionNumberLabel: 'Question 27',
            title: 'Centrally Acting Guanidines: Guanfacine vs Guanethidine',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'Consider the chemical structures of Drug I (Guanfacine) and Drug II (Guanethidine) to evaluate each statement:',
            subStatements: [
              {
                id: 'a',
                text: 'Both drugs contain a guanidine-like nitrogenous functional group.',
                isCorrect: true,
                explanation: 'True: Guanfacine has an acylguanidine; guanethidine has an alkylguanidine attached to an azocine ring.'
              },
              {
                id: 'b',
                text: 'Drug I (Guanfacine) is more lipophilic than Drug II (Guanethidine).',
                isCorrect: true,
                explanation: 'True: Guanfacine has a dichlorophenyl group and lower pKa (~7.1), allowing it to penetrate the CNS; guanethidine has a pKa >12 and is completely ionized, preventing CNS penetration.'
              },
              {
                id: 'c',
                text: 'Drug I (Guanfacine) is more basic than Drug II (Guanethidine).',
                isCorrect: false,
                explanation: 'False: The carbonyl group in guanfacine is electron-withdrawing, lowering guanidine basicity (pKa ~7.1); guanethidine is a strongly basic alkylguanidine (pKa ~12-13).'
              },
              {
                id: 'd',
                text: 'Drug I is a direct central alpha-2 agonist, whereas Drug II is a peripheral adrenergic neuron blocker.',
                isCorrect: true,
                explanation: 'True: Guanfacine stimulates central alpha-2A receptors; guanethidine is taken up by NET into peripheral terminals where it displaces norepinephrine and destroys vesicles.'
              }
            ],
            overallExplanation: 'Guanfacine contains an electron-withdrawing acyl group that reduces guanidine basicity (pKa ~7.1), permitting BBB entry and central alpha-2 agonism. Guanethidine is strongly basic (pKa ~12), permanently protonated, restricted to the periphery, and acts as an adrenergic neuron depleter.',
            highYieldPearl: 'Guanfacine = acylguanidine -> low pKa (~7.1) -> crosses BBB -> central alpha-2 agonist. Guanethidine = alkylguanidine -> high pKa (~12) -> ionized, cannot cross BBB -> peripheral neuron blocker.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 4, Question 27',
            sourcePageNumber: 4
          }
        ]
      },
      {
        sectionTitle: 'Carvedilol Structural Domains & Triple Mechanism',
        structures: [SYMPATHOLYTICS_STRUCTURES.carvedilol],
        questions: [
          {
            id: 428,
            questionNumberLabel: 'Question 28',
            title: 'Mechanistic Classification of Carvedilol',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'What is the complete pharmacological mechanistic classification of Carvedilol (Coreg)?',
            options: [
              'Selective beta-1 antagonist only',
              'Nonselective beta-blocker (beta-1 and beta-2) with concurrent selective alpha-1 adrenergic receptor blockade and antioxidant activity',
              'Direct-acting smooth muscle calcium channel blocker',
              'Centrally-acting alpha-2 agonist'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Carvedilol blocks beta-1, beta-2, and alpha-1 receptors.',
              'Correct: Carvedilol is a nonselective beta-blocker (beta-1/beta-2) that also competitively blocks vascular alpha-1 receptors (promoting vasodilation) and provides carbazole-mediated free-radical scavenging.',
              'Incorrect: It is not a CCB.',
              'Incorrect: It is not an alpha-2 agonist.'
            ],
            overallExplanation: 'Carvedilol exhibits three complementary actions: (1) beta-1 blockade (negative inotropy/chronotropy), (2) alpha-1 blockade (vasodilation and afterload reduction), and (3) antioxidant carbazole scavenging of ROS in heart failure.',
            highYieldPearl: 'Carvedilol = nonselective beta-blocker + selective alpha-1 antagonist + antioxidant carbazole. Major heart failure drug.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 5, Question 28',
            sourcePageNumber: 5
          },
          {
            id: 429,
            questionNumberLabel: 'Question 29',
            title: 'Receptor Binding Domains in Carvedilol',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which structural domain of Carvedilol is responsible for binding to beta-adrenergic receptors vs alpha-1 adrenergic receptors?',
            options: [
              'The carbazole ring binds alpha-1; the methoxyphenyl ring binds beta',
              'The aryloxypropanolamine chain binds beta-receptors; the bulky phenoxyethylamino extension binds alpha-1 receptors',
              'The methyl group binds beta; the ether binds alpha-1',
              'The secondary amine alone binds both receptors identically'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Incorrect assignment of structural domains.',
              'Correct: The classical aryloxypropanolamine motif with its chiral hydroxyl and secondary amine mimics norepinephrine to bind beta-1/beta-2 receptors, while the extended, bulky phenoxyethylamine aromatic substituent fits the deeper accessory hydrophobic pocket of alpha-1 receptors.',
              'Incorrect: Non-mechanistic.',
              'Incorrect: Binding requires the entire pharmacophoric array.'
            ],
            overallExplanation: 'Carvedilol incorporates two distinct pharmacophores in one molecule: the aryloxypropanolamine core binds beta-receptors, while the bulky phenoxyethyl extension confers alpha-1 receptor affinity.',
            highYieldPearl: 'Carvedilol dual pharmacophore: Aryloxypropanolamine = Beta-blockade. Phenoxyethylamine tail = Alpha-1 blockade.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 5, Question 29',
            sourcePageNumber: 5
          },
          {
            id: 430,
            questionNumberLabel: 'Question 30',
            title: 'Tissue / Subtype Specificity Domain in Carvedilol',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which domain in Carvedilol is responsible for imparting alpha-1 receptor selectivity over other adrenergic subtypes?',
            options: [
              'The central secondary hydroxyl group',
              'The substituted phenoxyethyl group on the amine terminus',
              'The 1,2,4-thiadiazine ring',
              'The sulfamoyl group'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Hydroxyl group is shared among all beta-blockers.',
              'Correct: Bulky arylalkyl substituents on the amino nitrogen (e.g., phenoxyethyl) provide steric interactions that favor alpha-1 receptor interaction over standard beta-selectivity.',
              'Incorrect: Thiadiazine is found in thiazides, not carvedilol.',
              'Incorrect: Sulfamoyl is absent in carvedilol.'
            ],
            overallExplanation: 'The bulky phenoxyethyl group attached to the amino nitrogen projects into an accessory hydrophobic binding region of the alpha-1 adrenergic receptor, providing alpha-1 antagonism.',
            highYieldPearl: 'N-phenoxyethyl substituent in Carvedilol = essential domain for alpha-1 receptor affinity and vasodilation.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 5, Question 30',
            sourcePageNumber: 5
          },
          {
            id: 431,
            questionNumberLabel: 'Question 31',
            title: 'Pharmacokinetic Determinants of Carvedilol',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which structural domain governs the extensive plasma protein binding (>98%) and hepatic CYP2D6/CYP2C9 metabolism of Carvedilol?',
            options: [
              'The tricyclic lipophilic carbazole ring system',
              'The aliphatic hydroxyl group',
              'The secondary amine nitrogen',
              'The methoxy ether'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: The planar, highly lipophilic carbazole ring confers high lipid solubility and drives extensive plasma albumin binding (~98%) and extensive hepatic CYP2D6/CYP2C9 clearance.',
              'Incorrect: Hydroxyl increases water solubility.',
              'Incorrect: The amine is basic and protonated at pH 7.4.',
              'Incorrect: The methoxy group contributes minor metabolic clearance.'
            ],
            overallExplanation: 'Carvedilol high lipophilicity is driven by its fused tricyclic carbazole core, resulting in high protein binding, extensive hepatic clearance, and stereoselective first-pass metabolism.',
            highYieldPearl: 'Carbazole core = lipophilicity, >98% protein binding, extensive hepatic clearance, and antioxidant activity.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 5, Question 31',
            sourcePageNumber: 5
          }
        ]
      },
      {
        sectionTitle: 'Quinazoline Alpha-1 Antagonists SAR & Uroselectivity',
        structures: [
          SYMPATHOLYTICS_STRUCTURES.prazosin,
          SYMPATHOLYTICS_STRUCTURES.terazosin,
          SYMPATHOLYTICS_STRUCTURES.doxazosin,
          SYMPATHOLYTICS_STRUCTURES.tamsulosin
        ],
        questions: [
          {
            id: 432,
            questionNumberLabel: 'Question 32',
            title: 'Chemical Class of Prazosin and Terazosin',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'What is the chemical class of Drugs I (Prazosin) and II (Terazosin)?',
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
              'Correct: Prazosin, Terazosin, and Doxazosin contain a 4-amino-6,7-dimethoxyquinazoline fused bicyclic ring linked to a central piperazine ring.',
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
            id: 433,
            questionNumberLabel: 'Question 33',
            title: 'Adrenergic Category of Quinazolines',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'What is the adrenergic category of Prazosin, Terazosin, and Doxazosin?',
            options: [
              'Direct sympathomimetics',
              'Indirect sympathomimetics',
              'Direct sympatholytics',
              'Indirect sympatholytics'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: They do not stimulate adrenergic receptors.',
              'Incorrect: They do not release catecholamines.',
              'Correct: They directly bind and competitively block post-junctional alpha-1 adrenergic receptors on vascular smooth muscle.',
              'Incorrect: They are not depleters or false transmitters.'
            ],
            overallExplanation: 'Quinazoline alpha-1 antagonists are direct sympatholytics because they block the receptor directly without interfering with neurotransmitter synthesis or vesicular release.',
            highYieldPearl: 'Quinazolines = direct-acting selective alpha-1 sympatholytics.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 5, Question 33',
            sourcePageNumber: 5
          },
          {
            id: 434,
            questionNumberLabel: 'Question 34',
            title: 'Pharmacological Mechanistic Class',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'What is the exact pharmacological mechanistic class of Prazosin, Terazosin, and Doxazosin?',
            options: [
              'Nonselective alpha-antagonists (alpha-1 and alpha-2)',
              'Selective alpha-1 antagonists',
              'Selective alpha-2 agonists',
              'Nonselective beta-antagonists',
              'Selective beta-1 antagonists'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Phenoxybenzamine and Phentolamine are nonselective alpha-antagonists.',
              'Correct: Prazosin, Terazosin, and Doxazosin are highly selective for alpha-1 over alpha-2 receptors (>1000-fold selectivity), avoiding the reflex tachycardia caused by presynaptic alpha-2 blockade.',
              'Incorrect: Clonidine is an alpha-2 agonist.',
              'Incorrect: Propranolol is a nonselective beta-blocker.',
              'Incorrect: Metoprolol is a selective beta-1 blocker.'
            ],
            overallExplanation: 'By sparing presynaptic alpha-2 autoreceptors, selective alpha-1 blockers leave the negative feedback mechanism intact, resulting in less reflex tachycardia than nonselective alpha-blockers like phentolamine.',
            highYieldPearl: 'Selective alpha-1 blockade spares presynaptic alpha-2 autoreceptors -> less reflex tachycardia than nonselective alpha blockers (phentolamine).',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 6, Question 34',
            sourcePageNumber: 6
          },
          {
            id: 435,
            questionNumberLabel: 'Question 35',
            title: 'Subtype Selectivity Ranking: Alpha-1A (Prostate) vs Alpha-1B (Vascular)',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Rank the following drugs from MOST selective to LEAST selective towards the alpha-1A receptor subtype found predominantly in the prostate and bladder neck (Tamsulosin, Silodosin, Prazosin, Terazosin):',
            options: [
              'Silodosin / Tamsulosin > Terazosin and Prazosin',
              'Prazosin and Terazosin > Tamsulosin > Silodosin',
              'Terazosin > Prazosin > Tamsulosin > Silodosin',
              'All drugs display equal selectivity across all alpha-1 subtypes'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Silodosin (~160-fold) and Tamsulosin (~10-20 fold) are uroselective alpha-1A antagonists. In contrast, quinazolines (Prazosin, Terazosin, Doxazosin) are non-subtype selective (equiponent at alpha-1A, 1B, and 1D).',
              'Incorrect: Prazosin and terazosin do not discriminate between alpha-1 subtypes.',
              'Incorrect: Terazosin is not subtype-selective.',
              'Incorrect: Tamsulosin and silodosin are distinctly uroselective.'
            ],
            overallExplanation: 'Tamsulosin and Silodosin are uroselective alpha-1A blockers that target smooth muscle in the prostate and bladder neck with minimal effect on vascular alpha-1B receptors, avoiding significant blood pressure drops.',
            highYieldPearl: 'Uroselective Alpha-1A blockers = Tamsulosin & Silodosin (relieve BPH without lowering BP). Non-subtype selective = Prazosin, Terazosin, Doxazosin (treat both HTN and BPH).',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 6, Question 35',
            sourcePageNumber: 6
          },
          {
            id: 436,
            questionNumberLabel: 'Question 36',
            title: 'Quinazoline SAR: Essential vs Non-Essential Pharmacophoric Groups',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'All of the following functional groups are essential for Prazosin binding to the alpha-1 adrenergic receptor EXCEPT:',
            options: [
              'Methoxy groups at positions 6 and 7 of the quinazoline system',
              'The furan-containing acyl group attached to the piperazine ring',
              'The primary amino group at position 4 of the quinazoline ring',
              'The ring nitrogen atom at position 1 of the quinazoline ring'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: The 6,7-dimethoxy groups are critical for receptor binding affinity.',
              'Correct: The acyl/furan substituent on the piperazine nitrogen dictates pharmacokinetic properties (half-life, clearance, solubility) rather than core receptor binding affinity. Replacing furan with tetrahydrofuran gives Terazosin (longer t1/2), and benzodioxan gives Doxazosin (longest t1/2).',
              'Incorrect: The 4-amino group is part of the essential protonated pharmacophore.',
              'Incorrect: The N1 nitrogen is protonated to form an ionic bond with the conserved Asp residue in the alpha-1 receptor.'
            ],
            overallExplanation: 'The 4-amino-6,7-dimethoxyquinazoline scaffold is the core pharmacophore required for alpha-1 binding. The pendant acyl group on the piperazine nitrogen governs pharmacokinetics (Prazosin: 2-3h; Terazosin: 12h; Doxazosin: 20h).',
            highYieldPearl: 'In quinazolines: 4-amino + 6,7-dimethoxy + N1 = binding pharmacophore. Piperazine acyl group = PK tuner (Prazosin t1/2 ~2h < Terazosin ~12h < Doxazosin ~20h).',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 6, Question 36',
            sourcePageNumber: 6
          },
          {
            id: 437,
            questionNumberLabel: 'Question 37',
            title: 'Dual Treatment: Hypertension and Benign Prostatic Hyperplasia',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the following alpha-1 blockers is clinically indicated to treat BOTH hypertension and symptoms of benign prostatic hyperplasia (BPH)?',
            options: [
              'Prazosin, Terazosin, and Doxazosin',
              'Tamsulosin only',
              'Silodosin only',
              'Esmolol'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Because quinazolines (Terazosin, Doxazosin, Prazosin) block both vascular alpha-1B receptors (lowering blood pressure) and prostatic alpha-1A receptors (relaxing bladder neck), they are uniquely suited for patients with co-existing HTN and BPH.',
              'Incorrect: Tamsulosin is uroselective and not approved for hypertension.',
              'Incorrect: Silodosin is uroselective and not approved for hypertension.',
              'Incorrect: Esmolol is a beta-blocker.'
            ],
            overallExplanation: 'Non-subtype selective alpha-1 blockers (Doxazosin, Terazosin) relax both vascular smooth muscle (anti-HTN) and prostatic/bladder neck smooth muscle (anti-BPH).',
            highYieldPearl: 'Terazosin & Doxazosin = dual indication for Hypertension + BPH. Tamsulosin & Silodosin = BPH only (uroselective).',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 6, Question 37',
            sourcePageNumber: 6
          },
          {
            id: 438,
            questionNumberLabel: 'Question 38',
            title: 'Once-Daily BPH Agent with Minimal Cardiovascular Effect',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is administered once daily to manage BPH with limited-to-no cardiovascular effects (minimal orthostatic hypotension)?',
            options: [
              'Prazosin',
              'Terazosin',
              'Doxazosin',
              'Tamsulosin (Flomax)'
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect: Prazosin causes significant first-dose orthostatic hypotension.',
              'Incorrect: Terazosin lowers blood pressure significantly.',
              'Incorrect: Doxazosin lowers blood pressure significantly.',
              'Correct: Tamsulosin is a sulfonamide arylethylamine with selective antagonist activity for the alpha-1A subtype over alpha-1B, relieving bladder outlet obstruction without substantially lowering systemic arterial pressure.'
            ],
            overallExplanation: 'Tamsulosin selective blockade of alpha-1A receptors in the prostate reduces urethral resistance while sparing vascular alpha-1B receptors, minimizing orthostatic hypotension.',
            highYieldPearl: 'Tamsulosin = selective alpha-1A blocker -> once-daily for BPH with minimal blood pressure lowering.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 6, Question 38',
            sourcePageNumber: 6
          },
          {
            id: 439,
            questionNumberLabel: 'Question 39',
            title: 'Equipotent Action on All Alpha-1 Receptor Subtypes',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which of the following drugs non-selectively blocks all alpha-1 receptor subtypes (alpha-1A, alpha-1B, and alpha-1D) with equal potency?',
            options: [
              'Prazosin, Terazosin, and Doxazosin',
              'Tamsulosin',
              'Silodosin',
              'Clonidine'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: The quinazolines (Prazosin, Terazosin, Doxazosin) show identical affinity for alpha-1A, alpha-1B, and alpha-1D subtypes.',
              'Incorrect: Tamsulosin prefers alpha-1A and alpha-1D over alpha-1B.',
              'Incorrect: Silodosin has >100-fold selectivity for alpha-1A.',
              'Incorrect: Clonidine is an alpha-2 agonist.'
            ],
            overallExplanation: 'Prazosin, Terazosin, and Doxazosin block all alpha-1 subtypes equipotently.',
            highYieldPearl: 'Prazosin / Terazosin / Doxazosin = non-subtype selective across alpha-1A/1B/1D.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 6, Question 39',
            sourcePageNumber: 6
          },
          {
            id: 440,
            questionNumberLabel: 'Question 40',
            title: 'Reflex Tachycardia & First-Dose Syncope',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is associated with pronounced first-dose orthostatic hypotension and potential reflex tachycardia due to rapid peripheral arterial and venous vasodilation?',
            options: [
              'Prazosin',
              'Tamsulosin',
              'Atenolol',
              'Methyldopa'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Prazosin causes potent peripheral arterial and venous dilation, frequently triggering "first-dose phenomenon" (severe orthostatic hypotension, syncope, and baroreceptor-mediated reflex tachycardia). Patients are advised to take the initial dose at bedtime.',
              'Incorrect: Tamsulosin has minimal vascular effects.',
              'Incorrect: Atenolol is a beta-blocker and slows heart rate.',
              'Incorrect: Methyldopa reduces sympathetic outflow centrally without reflex tachycardia.'
            ],
            overallExplanation: 'The first-dose phenomenon with Prazosin produces precipitous postural hypotension and reflex tachycardia; taking the first dose at bedtime mitigates syncopal episodes.',
            highYieldPearl: 'Prazosin = first-dose syncope / orthostatic hypotension & reflex tachycardia -> start with low dose at bedtime!',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 6, Question 40',
            sourcePageNumber: 6
          }
        ]
      },
      {
        sectionTitle: 'Nebivolol CYP2D6 Polymorphism & Third-Generation Comparison',
        questions: [
          {
            id: 441,
            questionNumberLabel: 'Question 41',
            title: 'CYP2D6 Pharmacogenomic Phenotypes in Nebivolol Metabolism',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Drug N (Nebivolol) is metabolized by CYP2D6. How do the Extensive Metabolizer (EM) and Poor Metabolizer (PM) phenotypes differ regarding pharmacokinetics and cardioselectivity?',
            options: [
              'In PMs, nebivolol is cleared faster and is more cardioselective',
              'In PMs, parent nebivolol accumulates with a much longer half-life (~19-30 hours vs ~12 hours in EMs), higher oral bioavailability, and diminished beta-1 cardioselectivity at high doses',
              'In EMs, parent drug accumulates and causes severe beta-2 bronchospasm',
              'CYP2D6 polymorphism has no measurable effect on nebivolol pharmacology'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: In PMs, clearance is slower, not faster.',
              'Correct: In poor metabolizers (PMs, ~7-10% of Caucasians), deficient CYP2D6 prevents alicyclic hydroxylation, causing parent drug AUC to rise 5- to 10-fold and half-life to extend from ~12 hours to ~19-30 hours. At these high circulating concentrations, beta-1 cardioselectivity is compromised.',
              'Incorrect: EMs clear parent drug rapidly to active hydroxylated metabolites that preserve cardioselectivity.',
              'Incorrect: CYP2D6 status significantly impacts nebivolol kinetics.'
            ],
            overallExplanation: 'Nebivolol undergoes CYP2D6 alicyclic hydroxylation. In extensive metabolizers (EMs), hydroxylated metabolites contribute to beta-blockade with high cardioselectivity (t1/2 ~12h). In poor metabolizers (PMs), parent drug accumulates, half-life lengthens to ~19-30h, and cardioselectivity decreases.',
            highYieldPearl: 'Nebivolol in CYP2D6 Poor Metabolizers: 5-10x higher parent drug AUC, t1/2 prolonged to 19-30h, loss of strict beta-1 cardioselectivity at higher levels.',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 6, Question 41',
            sourcePageNumber: 6
          },
          {
            id: 442,
            questionNumberLabel: 'Question 42',
            title: 'Nebivolol Mechanistic Properties',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'State whether each of the following statements is true or false regarding Nebivolol (Bystolic):',
            subStatements: [
              {
                id: 'a',
                text: 'Nebivolol is a nonselective beta-blocker.',
                isCorrect: false,
                explanation: 'False: Nebivolol has the highest beta-1 selectivity among currently available beta-blockers at standard therapeutic doses.'
              },
              {
                id: 'b',
                text: 'It is associated with quinidine-like membrane-stabilizing activity.',
                isCorrect: false,
                explanation: 'False: Nebivolol lacks membrane-stabilizing activity (MSA).'
              },
              {
                id: 'c',
                text: 'It possesses intrinsic sympathomimetic activity (ISA).',
                isCorrect: false,
                explanation: 'False: Nebivolol lacks ISA.'
              },
              {
                id: 'd',
                text: 'It is clinically administered as a racemic mixture of d-nebivolol (SRRR) and l-nebivolol (RSSS).',
                isCorrect: true,
                explanation: 'True: d-Nebivolol provides potent, highly selective beta-1 blockade, whereas l-nebivolol stimulates endothelial nitric oxide synthase (eNOS) via beta-3 agonism to cause vasodilation.'
              },
              {
                id: 'e',
                text: 'It is orally active for the management of hypertension.',
                isCorrect: true,
                explanation: 'True: Administered once daily orally for hypertension.'
              },
              {
                id: 'f',
                text: 'Extensive metabolizers enjoy a longer-acting effect than poor metabolizers.',
                isCorrect: false,
                explanation: 'False: Poor metabolizers have a significantly longer elimination half-life (~19-30 hours vs ~12 hours in extensive metabolizers).'
              }
            ],
            overallExplanation: 'Nebivolol is a racemic mixture where d-nebivolol is an ultra-selective beta-1 blocker and l-nebivolol stimulates endothelial NO release. It lacks ISA and MSA.',
            highYieldPearl: 'Nebivolol = d-isomer (potent beta-1 blocker) + l-isomer (endothelial NO release via beta-3). Highest beta-1 cardioselectivity!',
            sourceReference: 'Review for Antihypertensive Drugs II (Sympatholytics), Page 6, Question 42',
            sourcePageNumber: 6
          },
          {
            id: 443,
            questionNumberLabel: 'Question 43',
            title: 'Comparison of Third-Generation vs Classical Beta-Blockers',
            category: 'Clinical Pharmacology',
            type: 'sub-statements',
            questionStem: 'Compare Drug N (Nebivolol), Drug P (Propranolol), and Drug C (Carvedilol) across pharmacodynamic properties:',
            subStatements: [
              {
                id: 'a',
                text: 'Cardioselectivity rank is: Nebivolol (highly beta-1 selective) >> Propranolol (nonselective) = Carvedilol (nonselective).',
                isCorrect: true,
                explanation: 'True: Nebivolol is highly cardioselective; Propranolol and Carvedilol block both beta-1 and beta-2 receptors.'
              },
              {
                id: 'b',
                text: 'Vasodilatory mechanism: Nebivolol vasodilates via endothelial nitric oxide (NO) release, whereas Carvedilol vasodilates via alpha-1 adrenergic receptor blockade.',
                isCorrect: true,
                explanation: 'True: Nebivolol stimulates eNOS; Carvedilol competitively antagonizes vascular alpha-1 receptors. Propranolol has no vasodilatory effect.'
              },
              {
                id: 'c',
                text: 'Potential for CNS adverse effects (depression, vivid dreams): Propranolol >> Carvedilol > Nebivolol.',
                isCorrect: true,
                explanation: 'True: Propranolol is the most lipophilic and readily crosses the BBB.'
              },
              {
                id: 'd',
                text: 'Membrane-stabilizing activity (Na+ channel block): Propranolol (strongest) > Carvedilol (weak) > Nebivolol (none).',
                isCorrect: true,
                explanation: 'True: Propranolol has the most pronounced quinidine-like local anesthetic activity.'
              }
            ],
            overallExplanation: 'Nebivolol (selective beta-1 + NO release), Carvedilol (nonselective beta + alpha-1 block + antioxidant), and Propranolol (classical nonselective + MSA + high CNS entry) represent the three key evolutionary stages of beta-blocker drug design.',
            highYieldPearl: 'Beta-blocker comparison: Nebivolol = beta-1 selective + NO vasodilation. Carvedilol = nonselective beta + alpha-1 block + antioxidant. Propranolol = nonselective + CNS entry + membrane stabilization.',
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
    examId: 'exam_2',
    examTitle: 'Exam 2: Antihypertensives & Lipids',
    title: 'Antihypertensive Agents II: Sympatholytics',
    subtitle: 'Beta-Blockers, Central Alpha-2 Agonists, and Alpha-1 Adrenergic Receptor Antagonists',
    course: 'Medicinal Chemistry & Pharmacology II',
    semester: 'Spring',
    code: 'MCP-2-04',
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    chemicalStructures: Object.values(SYMPATHOLYTICS_STRUCTURES),
    pages: sympatholyticsPages,
  };
}
