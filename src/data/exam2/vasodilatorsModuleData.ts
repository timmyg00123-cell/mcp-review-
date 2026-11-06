import { ReviewModule, ReviewPage } from '../../types/reviewModule';
import { VASODILATORS_STRUCTURES } from './exam2Structures';

export const vasodilatorsPages: ReviewPage[] = [
  // ---------------------------------------------------------------------------
  // PAGE 1: 1,4-Dihydropyridine CCBs: Pharmacokinetics & SAR (Questions 1 - 10)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 1,
    title: 'Calcium Channel Blockers: 1,4-Dihydropyridines SAR & Pharmacokinetics',
    subtitle: '1,4-DHP pharmacophore, vascular selectivity, ester bio-reversibility, clevidipine ultra-short design, and amlodipine PK',
    sections: [
      {
        sectionTitle: '1,4-Dihydropyridine Core Pharmacophore & PK/PD',
        block_instructions: 'Consider Structures I (Nifedipine), II (Amlodipine), III (Nicardipine), IV (Clevidipine), and V (Felodipine) to answer questions 1 - 10.',
        structures: [
          VASODILATORS_STRUCTURES.nifedipine,
          VASODILATORS_STRUCTURES.amlodipine,
          VASODILATORS_STRUCTURES.nicardipine,
          VASODILATORS_STRUCTURES.clevidipine,
          VASODILATORS_STRUCTURES.felodipine,
        ],
        questions: [
          {
            id: 501,
            questionNumberLabel: 'Question 1',
            title: 'Chemical Class of 1,4-DHP CCBs',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following best describes the chemical class of the above active molecules (Nifedipine, Amlodipine, Nicardipine, Clevidipine, Felodipine)?',
            options: [
              'Benzothiadiazine-1,1-dioxide',
              '1,4-Dihydropyridine (1,4-DHP)',
              'Aryloxypropanolamine',
              'Arylethanolamine',
              'Sulfamoyl anthranilic acid',
              'Steroid',
              'Peptidomimetic'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Benzothiadiazine-1,1-dioxides are thiazide diuretics.',
              'Correct: These molecules are built upon a 1,4-dihydropyridine ring system containing ester groups at positions 3 and 5, methyl groups at positions 2 and 6, and a substituted phenyl ring at position 4.',
              'Incorrect: Aryloxypropanolamines are beta-blockers.',
              'Incorrect: Arylethanolamines lack the 1,4-DHP core.',
              'Incorrect: Sulfamoyl anthranilic acids are loop diuretics.',
              'Incorrect: Not steroids.',
              'Incorrect: Not peptide mimetics.'
            ],
            overallExplanation: 'The 1,4-dihydropyridine (1,4-DHP) nucleus is the core pharmacophore for dihydropyridine calcium channel blockers, providing potent and selective relaxation of arterial smooth muscle.',
            highYieldPearl: '1,4-Dihydropyridines (1,4-DHPs) = Nifedipine, Amlodipine, Nicardipine, Felodipine, Clevidipine. Selective for vascular Cav1.2 channels.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 1, Question 1',
            sourcePageNumber: 1
          },
          {
            id: 502,
            questionNumberLabel: 'Question 2',
            title: 'Mechanistic Class',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'What is the mechanistic class of the above active drugs?',
            options: [
              'Potassium-sparing agents',
              'Loop diuretics',
              'Thiazide diuretics',
              'Calcium channel blockers (voltage-gated L-type Cav1.2 blockers)',
              'Beta-Blockers',
              'Angiotensin-converting enzyme inhibitors',
              'Angiotensin II receptor antagonists'
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect: Not potassium-sparing agents.',
              'Incorrect: Not loop diuretics.',
              'Incorrect: Not thiazides.',
              'Correct: 1,4-DHPs bind with high affinity to the alpha-1 subunit of voltage-gated L-type (Cav1.2) calcium channels in vascular smooth muscle, inhibiting Ca2+ influx and promoting vasodilation.',
              'Incorrect: Not beta-blockers.',
              'Incorrect: Not ACE inhibitors.',
              'Incorrect: Not ARBs.'
            ],
            overallExplanation: '1,4-Dihydropyridines block voltage-gated L-type calcium channels, primarily in peripheral arteriolar smooth muscle, reducing systemic vascular resistance and blood pressure.',
            highYieldPearl: 'Dihydropyridine CCBs block L-type (Cav1.2) calcium channels -> arteriolar vasodilation -> decreased total peripheral resistance (TPR).',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 1, Question 2',
            sourcePageNumber: 1
          },
          {
            id: 503,
            questionNumberLabel: 'Question 3',
            title: 'Pharmacodynamic and Pharmacokinetic Characteristics of 1,4-DHPs',
            category: 'Pharmacokinetics ADME',
            type: 'sub-statements',
            questionStem: 'Considering the pharmacodynamic and pharmacokinetic properties of 1,4-dihydropyridines, state whether each of the following statements is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'They generally have poor and/or variable oral bioavailability due to extensive hepatic CYP3A4 first-pass metabolism.',
                isCorrect: true,
                explanation: 'True: Most 1,4-DHPs (e.g., nifedipine, felodipine) undergo substantial CYP3A4-mediated oxidation during first pass, giving bioavailability around 20-50%.'
              },
              {
                id: 'b',
                text: 'Due to their lipophilic structure, they bind extensively to plasma proteins (>90%).',
                isCorrect: true,
                explanation: 'True: 1,4-DHPs are highly lipophilic molecules with plasma protein binding exceeding 90-98%.'
              },
              {
                id: 'c',
                text: 'They are associated with multiple drug-drug interactions, particularly with CYP3A4 inhibitors (e.g., grapefruit juice, azoles) and inducers.',
                isCorrect: true,
                explanation: 'True: CYP3A4 is the primary enzyme responsible for DHP aromatization; strong inhibitors can dramatically elevate serum concentrations.'
              },
              {
                id: 'd',
                text: 'Dose reductions should be considered in patients with severe hepatic dysfunction.',
                isCorrect: true,
                explanation: 'True: Because clearance is almost entirely hepatic, liver impairment prolongs half-life and increases drug accumulation.'
              },
              {
                id: 'e',
                text: 'Many agents in this class are formulated as sustained- or extended-release to avoid rapid peak-induced reflex tachycardia.',
                isCorrect: true,
                explanation: 'True: Short-acting immediate-release formulations cause rapid vasodilation and reflex sympathetic tachycardia; extended-release formulations (e.g., Procardia XL, Adalat CC) ensure smooth, gradual BP reduction.'
              },
              {
                id: 'f',
                text: 'They are strongly basic molecules that are 100% protonated at physiological pH.',
                isCorrect: false,
                explanation: 'False: The 1,4-dihydropyridine nitrogen is neutral to weakly basic (pKa < 4) due to resonance delocalization with the adjacent C3 and C5 ester carbonyls. (Amlodipine is an exception because of its separate primary aliphatic amine side chain).'
              },
              {
                id: 'g',
                text: 'They predominantly block L-type calcium channels in vascular smooth muscle with minimal depression of cardiac contractility at therapeutic doses.',
                isCorrect: true,
                explanation: 'True: 1,4-DHPs exhibit high vascular selectivity (vasoselective) compared to non-dihydropyridines (verapamil, diltiazem).'
              }
            ],
            overallExplanation: '1,4-DHPs are vasoselective L-type Ca2+ channel blockers characterized by extensive CYP3A4 metabolism, high plasma protein binding, neutral ring nitrogen, and a requirement for sustained-release dosing to prevent reflex tachycardia.',
            highYieldPearl: '1,4-DHPs: Neutral ring N (resonance delocalization), extensive CYP3A4 first-pass, >90% protein bound. ER formulations avoid reflex tachycardia.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 1, Question 3',
            sourcePageNumber: 1
          },
          {
            id: 504,
            questionNumberLabel: 'Question 4',
            title: 'Inactive Pyridine Metabolite of 1,4-DHPs',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following describes the metabolic transformation that renders 1,4-dihydropyridines completely pharmacologically INACTIVE as vasodilators?',
            options: [
              'Aromatization/oxidation of the 1,4-dihydropyridine ring to a planar pyridine system',
              'Glucuronidation of the ester groups',
              'Reduction of the 4-phenyl ring to a cyclohexane ring',
              'Demethylation of the C2 methyl group'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: CYP3A4 dehydrogenates the 1,4-dihydropyridine ring to a fully aromatic pyridine ring. This flattens the puckered boat conformation, causing the 4-phenyl ring to become coplanar and completely abolishing calcium channel binding affinity.',
              'Incorrect: Esters are cleaved to carboxylic acids, not glucuronidated directly.',
              'Incorrect: The phenyl ring is not reduced.',
              'Incorrect: Demethylation is a minor pathway and does not primarily abolish activity.'
            ],
            overallExplanation: 'The puckered "boat" conformation of the 1,4-dihydropyridine ring is essential for activity. Oxidation by CYP3A4 into a planar pyridine ring is the primary terminating metabolic pathway.',
            highYieldPearl: 'CYP3A4 aromatizes the 1,4-DHP ring to a flat pyridine ring -> loss of boat conformation -> complete loss of CCB activity.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 1, Question 4',
            sourcePageNumber: 1
          },
          {
            id: 505,
            questionNumberLabel: 'Question 5',
            title: 'Ultrashort-Acting 1,4-DHP: Clevidipine',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above molecules has the shortest duration of action (elimination half-life ~1 - 2 minutes), and what structural feature is responsible?',
            options: [
              'Nifedipine, due to rapid renal filtration',
              'Amlodipine, due to active secretion',
              'Clevidipine (Drug IV), due to an ester linkage rapidly cleaved by blood and tissue esterases',
              'Felodipine, due to rapid hepatic oxidation'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: Nifedipine has a half-life of 2-5 hours.',
              'Incorrect: Amlodipine has an ultra-long half-life of 30-50 hours.',
              'Correct: Clevidipine (Cleviprex) is a soft drug engineered with a butyryloxymethyl ester at position 4/5 that is rapidly hydrolyzed by non-specific blood and tissue esterases, giving an ultrashort half-life of ~1-2 minutes.',
              'Incorrect: Felodipine has a half-life of 11-16 hours.'
            ],
            overallExplanation: 'Clevidipine is an ultrashort-acting intravenous 1,4-DHP designed with a labile ester group that undergoes instantaneous hydrolysis by blood and extravascular esterases into an inactive carboxylic acid metabolite.',
            highYieldPearl: 'Clevidipine = ultrashort IV DHP (t1/2 ~1-2 min) cleaved by blood/tissue esterases. Allows precise BP titration in perioperative/ICU settings.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 1, Question 5',
            sourcePageNumber: 1
          },
          {
            id: 506,
            questionNumberLabel: 'Question 6',
            title: 'Parenteral CCB in Surgery Independent of Organ Dysfunction',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the above molecules is administered parenterally (IV) to control acute blood pressure during surgery regardless of hepatic or renal failure?',
            options: [
              'Nifedipine',
              'Clevidipine (Cleviprex)',
              'Nicardipine',
              'Amlodipine'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Nifedipine is not used IV.',
              'Correct: Clevidipine is formulated as an IV lipid emulsion. Because it is metabolized by ubiquitous blood and tissue esterases rather than hepatic CYPs or renal excretion, its clearance is unaffected by severe liver or kidney dysfunction.',
              'Incorrect: Nicardipine IV relies on hepatic CYP metabolism.',
              'Incorrect: Amlodipine is oral only.'
            ],
            overallExplanation: 'Clevidipine clearance is independent of hepatic or renal function because circulating erythrocyte and tissue esterases rapidly hydrolyze it to inactive metabolites.',
            highYieldPearl: 'Clevidipine IV = organ-independent elimination (blood esterases) -> safe in severe liver and renal dysfunction.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 1, Question 6',
            sourcePageNumber: 1
          },
          {
            id: 507,
            questionNumberLabel: 'Question 7',
            title: 'Remote / Double Ester Prodrug Design',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above molecules exemplifies the design of a remote/double ester (acyloxyalkyl ester) to achieve rapid metabolic inactivation?',
            options: [
              'Nifedipine',
              'Amlodipine',
              'Clevidipine (Drug IV)',
              'Felodipine'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: Nifedipine contains simple methyl esters.',
              'Incorrect: Amlodipine contains simple ethyl/methyl esters.',
              'Correct: Clevidipine possesses a butyryloxymethyl ester (-COOCH2-O-CO-CH2CH2CH3) at C5. Hydrolysis of the outer ester generates an unstable hydroxymethyl ester that spontaneously expels formaldehyde to yield the inactive monocarboxylic acid.',
              'Incorrect: Felodipine contains simple ethyl and methyl esters.'
            ],
            overallExplanation: 'Clevidipine contains a butyryloxymethyl double ester. Esterase cleavage of the terminal butyrate releases an unstable hemiketal that collapses into formaldehyde and the inactive carboxylic acid.',
            highYieldPearl: 'Clevidipine double ester design: Butyryloxymethyl ester -> [esterase] -> hydroxymethyl intermediate -> spontaneous collapse to inactive acid + formaldehyde.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 1, Question 7',
            sourcePageNumber: 1
          },
          {
            id: 508,
            questionNumberLabel: 'Question 8',
            title: 'Longest Elimination Half-Life Among 1,4-DHPs',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above 1,4-dihydropyridines has the longest elimination half-life (~30 - 50 hours), permitting true once-daily oral dosing without special delivery systems?',
            options: [
              'Nifedipine (t1/2 ~2-5 hours)',
              'Amlodipine (t1/2 ~30-50 hours)',
              'Nicardipine (t1/2 ~2-4 hours)',
              'Clevidipine (t1/2 ~1-2 minutes)'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Nifedipine requires osmotic pump (OROS) technology for once-daily dosing.',
              'Correct: Amlodipine (Norvasc) has an elimination half-life of 30-50 hours, the longest of all marketed CCBs, due to slow receptor dissociation and a huge volume of distribution (~21 L/kg).',
              'Incorrect: Nicardipine requires TID or ER formulation.',
              'Incorrect: Clevidipine is ultrashort-acting.'
            ],
            overallExplanation: 'Amlodipine possesses a prolonged terminal elimination half-life of 30-50 hours, conferring sustained, 24-hour blood pressure control with once-daily oral dosing.',
            highYieldPearl: 'Amlodipine = longest half-life (30-50 h) and highest bioavailability (60-80%) among 1,4-DHPs. True once-daily agent.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 1, Question 8',
            sourcePageNumber: 1
          },
          {
            id: 509,
            questionNumberLabel: 'Question 9',
            title: 'Best Oral Bioavailability and the Amlodipine Basic Side Chain',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs has the best oral bioavailability (60 - 80%), and what chemical feature differentiates it from other 1,4-DHPs?',
            options: [
              'Nifedipine, due to its symmetrical dimethyl esters',
              'Amlodipine, due to a basic aminoethoxy side chain at position 2 (pKa ~8.6) that is protonated at physiological pH, slowing hepatic clearance',
              'Nicardipine, due to its tertiary amine group',
              'Clevidipine, due to its double ester'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Nifedipine bioavailability is only 45-65%.',
              'Correct: Amlodipine incorporates an aminoethoxymethyl (-CH2-O-CH2CH2-NH2) side chain at C2. The basic primary amine (pKa ~8.6) is ~95% protonated at physiological pH, imparting aqueous solubility and protecting against rapid first-pass CYP aromatization, yielding 60-80% bioavailability.',
              'Incorrect: Nicardipine bioavailability is only ~35% due to extensive first-pass metabolism.',
              'Incorrect: Clevidipine is not orally bioavailable.'
            ],
            overallExplanation: 'The primary aminoethoxy side chain at C2 of amlodipine provides a positive charge at physiological pH, conferring water solubility, high bioavailability (60-80%), and slow clearance.',
            highYieldPearl: 'Amlodipine C2 aminoethoxy side chain (pKa ~8.6): protonated at pH 7.4 -> high oral bioavailability (60-80%), slow hepatic clearance, long t1/2 (30-50h).',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 1, Question 9',
            sourcePageNumber: 1
          },
          {
            id: 510,
            questionNumberLabel: 'Question 10',
            title: 'Role of the Nitro Group in 1,4-DHPs',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'What is the medicinal chemistry significance of the nitro (-NO2) substituent on the 4-phenyl ring in Drug IV (e.g., Nifedipine/Nicardipine)?',
            options: [
              'Purely hydrophilic to promote urinary excretion',
              'Electronic and steric: it acts as an electron-withdrawing group and sterically forces the 4-phenyl ring into a perpendicular plane relative to the 1,4-DHP ring',
              'It acts as a prodrug group that releases nitric oxide directly',
              'It increases alkylation of the calcium channel'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Nitro is not primarily a solubilizing group.',
              'Correct: The ortho- or meta-nitro group exerts strong electron-withdrawing effects and steric hindrance against the C3/C5 ester groups, locking the 4-phenyl ring perpendicular (orthogonal) to the 1,4-DHP ring, which is required for channel binding.',
              'Incorrect: 1,4-DHPs do not release NO; organic nitrates release NO.',
              'Incorrect: 1,4-DHPs do not alkylate the channel.'
            ],
            overallExplanation: 'Ortho- and meta-substituents (such as -NO2 or -Cl) on the 4-phenyl ring serve dual electronic (electron-withdrawing) and steric roles, forcing the phenyl ring into a perpendicular orientation relative to the 1,4-DHP ring.',
            highYieldPearl: 'Ortho/meta substituents (-NO2, -Cl) on DHP 4-phenyl ring = steric clash with C3/C5 esters -> locks perpendicular conformation essential for Cav1.2 channel blockade.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 2, Question 10',
            sourcePageNumber: 2
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 2: SAR Modifications of Inactive DHPs & Direct Vasodilators (Questions 11 - 16)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 2,
    title: 'DHP SAR Optimization & Direct Vasodilators: Hydralazine & Minoxidil',
    subtitle: 'N1-H requirement, ester functionalization, hydralazine acetylation phenotypes, and minoxidil sulfation bioactivation',
    sections: [
      {
        sectionTitle: 'Structural Optimization of Inactive DHP Analogs',
        questions: [
          {
            id: 511,
            questionNumberLabel: 'Question 11',
            title: 'Restoring Activity in N-Substituted DHP (Structure X)',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Structure X has an N1-methyl group (N-CH3) and is pharmacologically INACTIVE as a calcium channel blocker. Which modification will restore its vasodilatory activity?',
            options: [
              'Replacing N-CH3 with an unsubstituted N-H at position 1',
              'Introducing Cl at position 4 prime',
              'Hydrolyzing the C3 ester to a free carboxylic acid',
              'Saturating the 4-phenyl ring to a cyclohexyl group',
              'Replacing the C2 methyl group with a methyl ester'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: An unsubstituted secondary amine nitrogen (N1-H) is strictly required for calcium channel blocking activity. The N1-H acts as a critical hydrogen-bond donor to a carbonyl oxygen in the Cav1.2 channel binding pocket. N1-alkylation abolishes activity.',
              'Incorrect: Para-substitution on the phenyl ring decreases activity.',
              'Incorrect: Free carboxylic acids at C3/C5 are inactive.',
              'Incorrect: The phenyl ring must be planar and aromatic.',
              'Incorrect: C2/C6 methyls are optimal.'
            ],
            overallExplanation: 'Unsubstituted N1-H is essential for 1,4-DHP activity because it forms a critical hydrogen bond with the receptor. N-alkylated derivatives are inactive.',
            highYieldPearl: '1,4-DHP SAR: Unsubstituted N1-H is mandatory (hydrogen-bond donor). N1-alkylation completely destroys CCB activity.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 2, Question 11',
            sourcePageNumber: 2
          },
          {
            id: 512,
            questionNumberLabel: 'Question 12',
            title: 'Restoring Activity in C3-Carboxylate DHP (Structure Y)',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Structure Y possesses a free carboxylic acid at position 3 and is inactive. Which modification restores its CCB activity?',
            options: [
              'Replacing N-CH3 with N-H at position 1',
              'Esterifying the carboxylic acid at position 3 into an alkyl ester',
              'Removing the phenyl ring at position 4',
              'Oxidizing the ring to a pyridine',
              'Introducing a nitro group at position 4 prime'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: If N1 is already N-H, esterification is the missing requirement.',
              'Correct: Ester groups at both position 3 and position 5 (-COOR) are strictly required for activity. Free carboxylic acids are ionized at pH 7.4 and cannot bind the hydrophobic channel pocket; esterification restores potency.',
              'Incorrect: The 4-phenyl ring is mandatory.',
              'Incorrect: Oxidation to pyridine abolishes activity.',
              'Incorrect: Para-nitro is deleterious.'
            ],
            overallExplanation: 'Carboxylic acid esters at C3 and C5 are essential for CCB activity. Free carboxylic acids are inactive metabolites.',
            highYieldPearl: '1,4-DHP SAR: Esters at C3 and C5 are mandatory (-COOR). Asymmetric esters (e.g., amlodipine, felodipine) enhance vascular selectivity.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 2, Question 12',
            sourcePageNumber: 2
          },
          {
            id: 513,
            questionNumberLabel: 'Question 13',
            title: 'Restoring Activity in Unsubstituted Phenyl DHP (Structure Z)',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Structure Z has an unsubstituted 4-phenyl ring (or a para-substituted phenyl) and exhibits very weak activity. Which modification will dramatically enhance its CCB potency?',
            options: [
              'Introducing Cl or NO2 at the ortho (2 prime) or meta (3 prime) position of the 4-phenyl ring',
              'Introducing Cl at the para (4 prime) position',
              'Converting the DHP ring into a pyridine',
              'Replacing C2 methyl with hydrogen',
              'Eliminating the C5 ester'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: An ortho or meta electron-withdrawing substituent (e.g., 2-Cl, 2-NO2, 3-NO2) provides the necessary steric bulk to force the 4-phenyl ring into a perpendicular plane relative to the 1,4-DHP ring, which is the bioactive conformation.',
              'Incorrect: Para-substituents dramatically decrease activity due to steric clash with the binding pocket.',
              'Incorrect: Aromatization destroys activity.',
              'Incorrect: C2/C6 methyls are needed.',
              'Incorrect: C5 ester is mandatory.'
            ],
            overallExplanation: 'Ortho- or meta-substitution on the 4-phenyl ring locks the ring in a perpendicular conformation relative to the 1,4-DHP plane, which is optimal for channel blockade. Para-substitution abolishes activity.',
            highYieldPearl: '1,4-DHP Phenyl Substitution: Ortho > Meta >>> Para (para = inactive). Ortho/meta bulk forces perpendicular bioactive conformation.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 2, Question 13',
            sourcePageNumber: 2
          },
          {
            id: 514,
            questionNumberLabel: 'Question 14',
            title: 'Significance of Chlorine Substituents in Felodipine & Amlodipine',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'What is the conformational significance of the chlorine substituent(s) in drugs such as Felodipine (2,3-dichloro) and Amlodipine (2-chloro)?',
            options: [
              'They chelate directly to calcium ions in the channel pore',
              'They exert steric hindrance against the C3/C5 esters, forcing the phenyl ring into an orthogonal (perpendicular) orientation relative to the 1,4-DHP ring',
              'They act as leaving groups for covalent bond formation',
              'They increase water solubility by forming hydrogen bonds'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Chlorines do not chelate calcium ions.',
              'Correct: The bulky ortho/meta chlorine substituents create steric clash with the adjacent C3 and C5 ester carbonyls, restricting free rotation and holding the phenyl ring perpendicular to the 1,4-DHP plane.',
              'Incorrect: 1,4-DHPs are reversible, non-covalent blockers.',
              'Incorrect: Chlorines increase lipophilicity, not water solubility.'
            ],
            overallExplanation: 'Ortho-chlorine substituents sterically constrain the 4-phenyl ring to adopt a perpendicular orientation relative to the 1,4-dihydropyridine plane, maximizing fit into the Cav1.2 allosteric binding pocket.',
            highYieldPearl: 'Ortho-Cl in Amlodipine & Felodipine: Steric clash locks the 4-phenyl ring perpendicular to the DHP ring for optimal receptor fit.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 2, Question 14',
            sourcePageNumber: 2
          }
        ]
      },
      {
        sectionTitle: 'Direct Vasodilators: Hydralazine vs Minoxidil',
        structures: [
          VASODILATORS_STRUCTURES.hydralazine,
          VASODILATORS_STRUCTURES.minoxidil,
          VASODILATORS_STRUCTURES.minoxidil_sulfate
        ],
        questions: [
          {
            id: 515,
            questionNumberLabel: 'Question 15',
            title: 'Hydralazine vs Minoxidil Mechanisms and Metabolism',
            category: 'Pharmacology MOA',
            type: 'sub-statements',
            questionStem: 'Consider the direct vasodilators Drug I (Hydralazine, an arylhydrazine) and Drug II (Minoxidil, an N-oxide pyrimidinediamine) to evaluate each statement:',
            subStatements: [
              {
                id: 'a',
                text: 'Both drugs are direct vasodilators that act through identical molecular mechanisms.',
                isCorrect: false,
                explanation: 'False: Hydralazine acts via endothelial nitric oxide release / membrane hyperpolarization; Minoxidil acts by opening ATP-sensitive K+ channels (KATP).'
              },
              {
                id: 'b',
                text: 'Both drugs are used orally to treat severe, refractory hypertension.',
                isCorrect: true,
                explanation: 'True: Both are potent arterial dilators reserved for refractory hypertension (usually paired with a beta-blocker and loop diuretic to prevent reflex tachycardia and fluid retention).'
              },
              {
                id: 'c',
                text: 'Drug I is a phthalazine/arylhydrazine, whereas Drug II is a piperidinopyrimidine-3-oxide.',
                isCorrect: true,
                explanation: 'True: Hydralazine contains a hydrazine attached to phthalazine; minoxidil is a 6-amino-1,2-dihydro-1-hydroxy-2-imino-4-piperidinopyrimidine.'
              },
              {
                id: 'd',
                text: 'Drug I is inactivated by hepatic sulfonation, and Drug II is activated by acetylation.',
                isCorrect: false,
                explanation: 'False: It is the exact opposite.'
              },
              {
                id: 'e',
                text: 'Drug I is inactivated by acetylation (NAT2), whereas Drug II is bioactivated by sulfonation (SULT1A1).',
                isCorrect: true,
                explanation: 'True: Hydralazine undergoes N-acetylation by NAT2 to inactive metabolites; Minoxidil is a prodrug bioactivated by sulfotransferase SULT1A1 to minoxidil-O-sulfate.'
              },
              {
                id: 'f',
                text: 'Both drugs are primarily metabolized by N-methylation.',
                isCorrect: false,
                explanation: 'False: Neither is primarily cleared by N-methylation.'
              }
            ],
            overallExplanation: 'Hydralazine is inactivated by polymorphic N-acetyltransferase 2 (NAT2). Minoxidil is a prodrug that requires hepatic sulfotransferase (SULT1A1) conversion into minoxidil-O-sulfate, which opens KATP channels.',
            highYieldPearl: 'Hydralazine = inactivated by acetylation (NAT2). Minoxidil = prodrug bioactivated by sulfonation (SULT1A1) to minoxidil sulfate (KATP opener).',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 3, Question 15',
            sourcePageNumber: 3
          },
          {
            id: 516,
            questionNumberLabel: 'Question 16',
            title: 'Metabolites of Hydralazine and Minoxidil',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which pair correctly identifies the INACTIVE metabolite of Hydralazine and the ACTIVE metabolite of Minoxidil?',
            options: [
              'Inactive Hydralazine metabolite: N-Acetylhydralazine (and 3-methyl-s-triazolo[3,4-a]phthalazine); Active Minoxidil metabolite: Minoxidil-O-sulfate',
              'Inactive Hydralazine metabolite: Hydralazine-O-sulfate; Active Minoxidil metabolite: N-Acetylminoxidil',
              'Inactive Hydralazine metabolite: Phthalic acid; Active Minoxidil metabolite: Minoxidil glucuronide',
              'Inactive Hydralazine metabolite: 4-Hydroxyminoxidil; Active Minoxidil metabolite: Hydralazine N-oxide'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Hydralazine is N-acetylated by NAT2 to N-acetylhydralazine, which spontaneously cyclizes to 3-methyl-s-triazolo[3,4-a]phthalazine (inactive). Minoxidil N-oxide is sulfated by SULT1A1 to minoxidil-O-sulfate (active KATP channel opener).',
              'Incorrect: Hydralazine is acetylated, not sulfated.',
              'Incorrect: Glucuronides of minoxidil are inactive.',
              'Incorrect: Mismatched structures.'
            ],
            overallExplanation: 'Hydralazine undergoes Phase II NAT2 acetylation to inactive triazolophthalazines. Minoxidil is bioactivated by sulfotransferase SULT1A1 into minoxidil-O-sulfate, the active KATP opener.',
            highYieldPearl: 'Inactive Hydralazine metabolite = N-acetylhydralazine. Active Minoxidil metabolite = Minoxidil-O-sulfate.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 3, Question 16',
            sourcePageNumber: 3
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 3: Comprehensive Vasodilator Classification & Mechanisms (Questions 17 - 25)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 3,
    title: 'Integrated Vasodilator Review: Nitrates, KATP Openers & Clinical Pharmacology',
    subtitle: 'Acetylation pharmacogenomics, ALDH2 nitrate bioactivation, sodium nitroprusside NO release, and diazoxide',
    sections: [
      {
        sectionTitle: 'Chemical Classification of Vasodilator Library',
        structures: [
          VASODILATORS_STRUCTURES.nitroglycerin,
          VASODILATORS_STRUCTURES.sodium_nitroprusside,
          VASODILATORS_STRUCTURES.diazoxide,
          VASODILATORS_STRUCTURES.hydralazine,
          VASODILATORS_STRUCTURES.minoxidil,
          VASODILATORS_STRUCTURES.nifedipine
        ],
        questions: [
          {
            id: 517,
            questionNumberLabel: 'Question 17',
            title: 'Chemical Class Matching',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Match each vasodilator to its correct chemical class (Nitroglycerin, Sodium nitroprusside, Hydralazine, Minoxidil, Nifedipine, Diazoxide):',
            options: [
              'Nitroglycerin = Organic nitrate; Sodium nitroprusside = Inorganic nitroso-complex; Hydralazine = Arylhydrazine/phthalazine; Minoxidil = Aminopyrimidine N-oxide; Nifedipine = 1,4-DHP; Diazoxide = Benzothiadiazine',
              'Nitroglycerin = Inorganic nitrate; Sodium nitroprusside = Organic nitrate; Hydralazine = 1,4-DHP; Minoxidil = Arylhydrazine',
              'All are classified as 1,4-dihydropyridines',
              'Diazoxide = 1,4-DHP; Nifedipine = Benzothiadiazine'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Nitroglycerin is an organic nitrate ester; Sodium nitroprusside is an inorganic sodium ferricyanide nitroso coordination complex; Hydralazine is a phthalazine hydrazine; Minoxidil is a pyrimidinediamine N-oxide; Nifedipine is a 1,4-DHP; Diazoxide is a benzothiadiazine-1,1-dioxide (non-diuretic).',
              'Incorrect: Incorrect class assignments.',
              'Incorrect: Structurally diverse classes.',
              'Incorrect: Inverted classes.'
            ],
            overallExplanation: 'Antihypertensive vasodilators encompass organic nitrates (nitroglycerin), inorganic complexes (nitroprusside), arylhydrazines (hydralazine), pyrimidine N-oxides (minoxidil), 1,4-DHPs (nifedipine), and benzothiadiazines (diazoxide).',
            highYieldPearl: 'Vasodilator chemical classes: Nitroglycerin = Organic nitrate; Nitroprusside = Inorganic complex; Diazoxide = Benzothiadiazine; Minoxidil = Pyrimidine N-oxide.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 4, Question 17',
            sourcePageNumber: 4
          },
          {
            id: 518,
            questionNumberLabel: 'Question 18',
            title: 'Vasodilatory Prodrugs',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following vasodilators are PRODRUGS that require enzymatic or metabolic activation in vivo to promote vasodilation?',
            options: [
              'Minoxidil (requires SULT1A1 sulfation) and Nitroglycerin (requires mitochondrial ALDH2 reduction)',
              'Sodium nitroprusside and Nifedipine',
              'Diazoxide and Amlodipine',
              'Hydralazine and Clevidipine'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Minoxidil is inactive until sulfated by SULT1A1 into minoxidil-O-sulfate. Nitroglycerin is an organic nitrate prodrug that requires reduction by mitochondrial aldehyde dehydrogenase (ALDH2) to generate active nitric oxide (NO).',
              'Incorrect: Nitroprusside releases NO non-enzymatically; Nifedipine is an active drug.',
              'Incorrect: Diazoxide and Amlodipine are active drugs.',
              'Incorrect: Hydralazine is active; Clevidipine is an active drug rapidly inactivated by esterases.'
            ],
            overallExplanation: 'Minoxidil (sulfated by SULT1A1) and Nitroglycerin (denitrated by ALDH2) require metabolic bioactivation to exert their vasodilatory actions.',
            highYieldPearl: 'Vasodilatory Prodrugs: Minoxidil -> [SULT1A1] -> Minoxidil sulfate. Nitroglycerin -> [ALDH2] -> Nitric Oxide (NO).',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 4, Question 18',
            sourcePageNumber: 4
          },
          {
            id: 519,
            questionNumberLabel: 'Question 19',
            title: 'Vasodilator Associated with Acetylation Pharmacogenomics',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which vasodilator is inactivated by N-acetyltransferase 2 (NAT2) and poses a significant risk of Drug-Induced Lupus Erythematosus (DILE) in slow acetylators?',
            options: [
              'Hydralazine',
              'Minoxidil',
              'Sodium nitroprusside',
              'Nifedipine'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Hydralazine is metabolized by polymorphic NAT2. Slow acetylators (~50% of Caucasians and African Americans) accumulate hydralazine, greatly increasing the incidence of anti-histone antibody-positive Drug-Induced Lupus Erythematosus (DILE).',
              'Incorrect: Minoxidil is cleared by glucuronidation/sulfation, not acetylation.',
              'Incorrect: Nitroprusside reacts with hemoglobin/RBCs.',
              'Incorrect: Nifedipine is cleared by CYP3A4.'
            ],
            overallExplanation: 'Hydralazine clearance is governed by NAT2 acetylation status. Slow acetylators achieve higher plasma levels and have a markedly elevated risk of drug-induced lupus erythematosus.',
            highYieldPearl: 'Hydralazine + Slow Acetylator (NAT2 defect) = Drug-Induced Lupus Erythematosus (DILE) with positive anti-histone antibodies.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 4, Question 19',
            sourcePageNumber: 4
          },
          {
            id: 520,
            questionNumberLabel: 'Question 20',
            title: 'Benzothiadiazine Diuretic Congener with Potent Vasodilation',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following is a benzothiadiazine derivative that LACKS diuretic activity (lacks a 7-sulfonamide) but acts as a potent arteriolar vasodilator and hyperglycemic agent by opening KATP channels?',
            options: [
              'Chlorothiazide',
              'Diazoxide (Hyperstat / Proglycem)',
              'Hydrochlorothiazide',
              'Metolazone'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Chlorothiazide is a diuretic with weak direct vasodilation.',
              'Correct: Diazoxide is chemically a benzothiadiazine-1,1-dioxide that lacks the unsubstituted 7-sulfonamide needed for carbonic anhydrase and DCT NCC inhibition. Instead, it opens KATP channels in vascular smooth muscle (causing vasodilation) and in pancreatic beta-cells (inhibiting insulin release, causing hyperglycemia).',
              'Incorrect: HCTZ is a standard diuretic.',
              'Incorrect: Metolazone is a thiazide-like diuretic.'
            ],
            overallExplanation: 'Diazoxide lacks the 7-sulfonamide required for diuresis; it opens ATP-sensitive K+ channels to induce profound arteriolar vasodilation (for hypertensive emergencies) and suppress insulin secretion (used for hypoglycemia/insulinoma).',
            highYieldPearl: 'Diazoxide = benzothiadiazine WITHOUT sulfonamide -> opens KATP channels -> arteriolar vasodilation + inhibits insulin release (causes hyperglycemia!).',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 4, Question 20',
            sourcePageNumber: 4
          },
          {
            id: 521,
            questionNumberLabel: 'Question 21',
            title: 'Vasodilating Beta-Blocker in Vasodilator Spectrum',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which beta-adrenergic antagonist provides additional peripheral vasodilation through concurrent alpha-1 receptor blockade?',
            options: [
              'Propranolol',
              'Atenolol',
              'Carvedilol',
              'Metoprolol'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: Propranolol has no alpha-1 blocking or vasodilating properties.',
              'Incorrect: Atenolol is a pure beta-1 blocker.',
              'Correct: Carvedilol combines nonselective beta-blockade with alpha-1 adrenergic antagonism, producing arterial vasodilation and reducing systemic vascular resistance.',
              'Incorrect: Metoprolol does not promote vasodilation.'
            ],
            overallExplanation: 'Carvedilol lowers systemic vascular resistance through concurrent alpha-1 adrenergic receptor blockade, classifying it as a vasodilatory beta-blocker.',
            highYieldPearl: 'Carvedilol = vasodilating beta-blocker via alpha-1 receptor antagonism.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 4, Question 21',
            sourcePageNumber: 4
          },
          {
            id: 522,
            questionNumberLabel: 'Question 22',
            title: 'Enzymatic Bioactivation by Mitochondrial ALDH2',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which of the following vasodilators requires enzymatic bioactivation by mitochondrial aldehyde dehydrogenase (ALDH2) to release nitric oxide (NO)?',
            options: [
              'Nitroglycerin (Glyceryl trinitrate) and Isosorbide dinitrate',
              'Sodium nitroprusside',
              'Hydralazine',
              'Minoxidil'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Organic nitrates (Nitroglycerin, ISDN) are prodrugs bioactivated in vascular smooth muscle mitochondria by ALDH2, which denitrates them and yields 1,2-glyceryl dinitrate and nitric oxide (NO), triggering cGMP-mediated vasodilation.',
              'Incorrect: Sodium nitroprusside releases NO spontaneously and non-enzymatically.',
              'Incorrect: Hydralazine does not require ALDH2.',
              'Incorrect: Minoxidil requires sulfotransferase.'
            ],
            overallExplanation: 'Nitroglycerin bioactivation is mediated by mitochondrial aldehyde dehydrogenase-2 (ALDH2). Inactivation or tolerance to ALDH2 contributes to nitrate tolerance.',
            highYieldPearl: 'Nitroglycerin = bioactivated by mitochondrial aldehyde dehydrogenase (ALDH2) to NO. Inactivation of ALDH2 drives nitrate tolerance!',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 4, Question 22',
            sourcePageNumber: 4
          },
          {
            id: 523,
            questionNumberLabel: 'Question 23',
            title: 'Bioactivation by Sulfotransferase SULT1A1',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which vasodilator is a prodrug specifically activated by hepatic sulfotransferase (SULT1A1)?',
            options: [
              'Hydralazine',
              'Minoxidil',
              'Nitroprusside',
              'Diazoxide'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Hydralazine is acetylated to inactive metabolites.',
              'Correct: Minoxidil is sulfated on its N-oxide oxygen by hepatic cytosolic sulfotransferase (SULT1A1) to form minoxidil-O-sulfate, which opens KATP channels.',
              'Incorrect: Nitroprusside reacts non-enzymatically.',
              'Incorrect: Diazoxide is active as the parent molecule.'
            ],
            overallExplanation: 'Minoxidil sulfation by SULT1A1 is a rare example of Phase II sulfate conjugation generating an active drug metabolite rather than an excretory product.',
            highYieldPearl: 'Minoxidil is bioactivated by sulfotransferase SULT1A1 to minoxidil-O-sulfate (rare case where sulfation creates active metabolite).',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 4, Question 23',
            sourcePageNumber: 4
          },
          {
            id: 524,
            questionNumberLabel: 'Question 24',
            title: 'Direct Calcium Channel Blockade in Vascular Tissues',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which class of vasodilators reduces blood pressure by directly binding and blocking L-type calcium channels (Cav1.2) in vascular smooth muscle?',
            options: [
              '1,4-Dihydropyridines (e.g., Amlodipine, Nifedipine)',
              'Organic nitrates (e.g., Nitroglycerin)',
              'KATP channel openers (e.g., Minoxidil)',
              'Alpha-2 agonists (e.g., Clonidine)'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: 1,4-Dihydropyridines bind directly to the Cav1.2 channel pore subunit, preventing calcium entry required for calmodulin activation and myosin light chain kinase phosphorylation.',
              'Incorrect: Nitrates work via cGMP.',
              'Incorrect: Minoxidil works via KATP channel opening.',
              'Incorrect: Clonidine works centrally.'
            ],
            overallExplanation: '1,4-DHPs prevent voltage-dependent Ca2+ influx through Cav1.2 L-type channels, decreasing intracellular calcium and causing arterial vasodilation.',
            highYieldPearl: '1,4-DHPs block L-type Cav1.2 channels -> decreased intracellular Ca2+ -> decreased MLCK activity -> arteriolar relaxation.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 4, Question 24',
            sourcePageNumber: 4
          },
          {
            id: 525,
            questionNumberLabel: 'Question 25',
            title: 'Nitric Oxide (NO) Donors: Enzymatic vs Non-Enzymatic',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which of the following vasodilators promotes nitric oxide-mediated vasodilation spontaneously and non-enzymatically upon contact with vascular smooth muscle / erythrocytes?',
            options: [
              'Nitroglycerin (requires enzymatic ALDH2 reduction)',
              'Sodium nitroprusside [Na2Fe(CN)5NO] (releases NO non-enzymatically upon electron transfer from sulfhydryl groups / oxyhemoglobin)',
              'Minoxidil',
              'Diazoxide'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Nitroglycerin requires enzymatic reduction by ALDH2.',
              'Correct: Sodium nitroprusside is an inorganic nitrosyl complex that decomposes non-enzymatically in the presence of sulfhydryl groups or oxyhemoglobin in red blood cells, releasing free nitric oxide (NO) and cyanide (CN-).',
              'Incorrect: Minoxidil opens KATP channels.',
              'Incorrect: Diazoxide opens KATP channels.'
            ],
            overallExplanation: 'Sodium nitroprusside releases NO spontaneously and non-enzymatically, causing immediate arteriolar and venular dilation. Cyanide toxicity is a known risk during prolonged or high-dose infusions.',
            highYieldPearl: 'Sodium nitroprusside = NON-enzymatic spontaneous NO release (dilates arteries and veins equally). Watch for cyanide/thiocyanate toxicity!',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 4, Question 25',
            sourcePageNumber: 4
          }
        ]
      }
    ]
  }
];

export function getDefaultVasodilatorsModule(): ReviewModule {
  return {
    id: 'antihypertensives_3_mcp2',
    examId: 'exam_2',
    examTitle: 'Exam 2: Antihypertensives & Lipids',
    title: 'Antihypertensive Agents III: Vasodilators & Calcium Channel Blockers',
    subtitle: '1,4-Dihydropyridines, Direct Vasodilators (Hydralazine, Minoxidil), and Nitrovasodilators',
    course: 'Medicinal Chemistry & Pharmacology II',
    semester: 'Spring',
    code: 'MCP-2-05',
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    chemicalStructures: Object.values(VASODILATORS_STRUCTURES),
    pages: vasodilatorsPages,
  };
}
