import { ReviewModule, ReviewPage } from '../../types/reviewModule';
import { VASODILATORS_STRUCTURES } from './exam2Structures';

export const vasodilatorsPages: ReviewPage[] = [
  // ---------------------------------------------------------------------------
  // PAGE 1: 1,4-Dihydropyridines Core Pharmacophore & PK/PD (Questions 1 - 9)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 1,
    title: 'Calcium Channel Blockers: 1,4-Dihydropyridines SAR & Pharmacokinetics',
    subtitle: '1,4-DHP pharmacophore, vascular selectivity, inactive oxidized pyridine metabolite, clevidipine ultra-short double ester, and amlodipine PK',
    sections: [
      {
        sectionTitle: '1,4-Dihydropyridine Core Pharmacophore & PK/PD',
        block_instructions: 'Consider chemical structures I, II, III, IV, and V to answer questions (1 - 9):',
        structures: [
          VASODILATORS_STRUCTURES.clevidipine,
          VASODILATORS_STRUCTURES.nifedipine_oxidized,
          VASODILATORS_STRUCTURES.isradipine,
          VASODILATORS_STRUCTURES.nifedipine,
          VASODILATORS_STRUCTURES.amlodipine,
        ],
        questions: [
          {
            id: 501,
            questionNumberLabel: 'Question 1',
            title: 'Chemical Class of 1,4-DHP CCBs',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following best describes the chemical class of the above active molecules?',
            options: [
              'Benzothiadiazine-1,1-dioxide',
              '1,4-dihydropyridine',
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
            highYieldPearl: '1,4-Dihydropyridines (1,4-DHPs) = Nifedipine, Amlodipine, Isradipine, Clevidipine. Selective for vascular Cav1.2 channels.',
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
              'Calcium channel blockers',
              'β-Blockers',
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
            title: 'Pharmacodynamic and Pharmacokinetic Aspects of 1,4-DHPs',
            category: 'Pharmacokinetics ADME',
            type: 'sub-statements',
            questionStem: 'Considering the pharmacodynamic and pharmacokinetic aspects of the above active molecules, state whether each of the following statements is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'They generally have poor and/or variable oral bioavailability due to extensive 1st pass effect.',
                isCorrect: true,
                explanation: 'True: Most 1,4-DHPs (e.g., nifedipine, isradipine) undergo substantial CYP3A4-mediated oxidation during first pass, giving bioavailability around 15-50%.'
              },
              {
                id: 'b',
                text: 'Due to their bicyclic nature, they bind well to plasma proteins.',
                isCorrect: true,
                explanation: 'True: 1,4-DHPs are highly lipophilic molecules with plasma protein binding exceeding 90-98%.'
              },
              {
                id: 'c',
                text: 'They are associated with multiple drug-drug interactions.',
                isCorrect: true,
                explanation: 'True: CYP3A4 is the primary enzyme responsible for DHP aromatization; strong inhibitors can dramatically elevate serum concentrations.'
              },
              {
                id: 'd',
                text: 'Severe hepatic dysfunction should be considered upon the administration of these drugs.',
                isCorrect: true,
                explanation: 'True: Because clearance is almost entirely hepatic, liver impairment prolongs half-life and increases drug accumulation.'
              },
              {
                id: 'e',
                text: 'Many in this class of drugs are administered as sustained (or extended)-release.',
                isCorrect: true,
                explanation: 'True: Short-acting immediate-release formulations cause rapid vasodilation and reflex sympathetic tachycardia; extended-release formulations ensure smooth, gradual BP reduction.'
              },
              {
                id: 'f',
                text: 'They are strong basic molecules.',
                isCorrect: false,
                explanation: 'False: The 1,4-dihydropyridine nitrogen is neutral to weakly basic (pKa < 4) due to resonance delocalization with the adjacent C3 and C5 ester carbonyls.'
              },
              {
                id: 'g',
                text: 'They predominantly block L-type calcium channels in smooth muscles of blood vessels.',
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
            title: 'Inactive Vasodilator Molecule',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above molecules is not pharmacologically active as a vasodilator?',
            options: [
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV',
              'Structure V'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Structure I (Clevidipine) is an active, ultrashort-acting IV vasodilator.',
              'Correct: Structure II (Dehydronifedipine) has undergone CYP3A4 aromatization of the 1,4-dihydropyridine ring to a fully planar pyridine ring. Aromatization flattens the boat conformation, placing the phenyl ring in the same plane and completely destroying calcium channel blocking activity.',
              'Incorrect: Structure III (Isradipine) is a potent, active 1,4-DHP vasodilator.',
              'Incorrect: Structure IV (Nifedipine) is the prototype active 1,4-DHP vasodilator.',
              'Incorrect: Structure V (Amlodipine) is a potent, active once-daily 1,4-DHP vasodilator.'
            ],
            overallExplanation: 'Aromatization of the 1,4-dihydropyridine core into a planar pyridine ring (Structure II) destroys the puckered boat conformation required for Cav1.2 channel binding, rendering the molecule completely inactive as a vasodilator.',
            highYieldPearl: 'Dehydropyridine / aromatized pyridine metabolite (Structure II) = completely inactive. Puckered 1,4-DHP boat conformation is mandatory.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 1, Question 4',
            sourcePageNumber: 1
          },
          {
            id: 505,
            questionNumberLabel: 'Question 5',
            title: 'Shortest Duration of Action',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above molecules has the shortest duration of action? Why?',
            options: [
              'Structure I, due to rapid blood and extravascular esterase hydrolysis of its butyryloxymethyl ester',
              'Structure II, due to rapid renal elimination of the aromatized pyridine',
              'Structure III, due to rapid benzofurazan ring opening',
              'Structure IV, due to instantaneous CYP3A4 oxidation',
              'Structure V, due to rapid urinary excretion'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure I (Clevidipine) is engineered as a soft drug with an acyloxyalkyl (butyryloxymethyl) ester that is rapidly hydrolyzed by ubiquitous blood and tissue esterases, conferring an ultrashort elimination half-life of ~1 to 2 minutes.',
              'Incorrect: Structure II is already an inactive metabolite.',
              'Incorrect: Structure III (Isradipine) has an elimination half-life of ~8 hours.',
              'Incorrect: Structure IV (Nifedipine) has an elimination half-life of ~2 to 5 hours.',
              'Incorrect: Structure V (Amlodipine) has the longest half-life (30 to 50 hours).'
            ],
            overallExplanation: 'Structure I (Clevidipine) has the shortest duration of action (~1-2 minutes) because its remote butyryloxymethyl ester is instantaneously hydrolyzed by non-specific blood and extravascular esterases.',
            highYieldPearl: 'Structure I (Clevidipine) = shortest duration (t1/2 ~1-2 min) via rapid blood esterase cleavage of butyryloxymethyl ester.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 1, Question 5',
            sourcePageNumber: 1
          },
          {
            id: 506,
            questionNumberLabel: 'Question 6',
            title: 'Parenteral CCB in Surgery Independent of Organ Dysfunction',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the above molecules can be used parenterally to control blood pressure in surgery (i.e., oral is not feasible) irrespective of hepatic and/or renal dysfunction?',
            options: [
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV',
              'Structure V'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure I (Clevidipine) is formulated as an intravenous lipid emulsion for acute perioperative BP titration. Because it is cleared by ubiquitous blood and tissue esterases rather than hepatic CYPs or renal excretion, its clearance is independent of liver or kidney dysfunction.',
              'Incorrect: Structure II is inactive.',
              'Incorrect: Structure III (Isradipine) is oral and cleared hepatically.',
              'Incorrect: Structure IV (Nifedipine) is oral and cleared hepatically.',
              'Incorrect: Structure V (Amlodipine) is oral only and requires hepatic metabolism.'
            ],
            overallExplanation: 'Structure I (Clevidipine) is an intravenous agent metabolized by circulating red blood cell and extravascular esterases, permitting safe, organ-independent titration during surgery regardless of hepatic or renal failure.',
            highYieldPearl: 'Structure I (Clevidipine IV) = organ-independent clearance (blood esterases), safe in severe renal or hepatic impairment.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 1, Question 6',
            sourcePageNumber: 1
          },
          {
            id: 507,
            questionNumberLabel: 'Question 7',
            title: 'Remote / Double Ester Prodrug Design',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above molecules demonstrates the design of a remote/double ester to achieve an ultrashort duration of action?',
            options: [
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV',
              'Structure V'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure I (Clevidipine) possesses an acyloxyalkyl double ester (butyryloxymethyl group: -COOCH2-O-CO-CH2CH2CH3). Cleavage by esterases releases an unstable hydroxymethyl intermediate that spontaneously expels formaldehyde to yield the inactive monocarboxylic acid.',
              'Incorrect: Structure II contains simple methyl esters on an oxidized pyridine ring.',
              'Incorrect: Structure III (Isradipine) contains isopropyl and methyl esters.',
              'Incorrect: Structure IV (Nifedipine) contains symmetrical simple dimethyl esters.',
              'Incorrect: Structure V (Amlodipine) contains ethyl and methyl simple esters.'
            ],
            overallExplanation: 'Structure I (Clevidipine) demonstrates the remote/double ester (acyloxyalkyl ester) design: cleavage of the terminal butyrate produces an unstable hemiketal that collapses spontaneously into formaldehyde and an inactive monocarboxylic acid.',
            highYieldPearl: 'Structure I (Clevidipine) double ester: Butyryloxymethyl ester -> [esterase] -> hydroxymethyl intermediate -> formaldehyde + inactive acid.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 1, Question 7',
            sourcePageNumber: 1
          },
          {
            id: 508,
            questionNumberLabel: 'Question 8',
            title: 'Longest Elimination Half-Life',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above molecules has(have) relatively the longest elimination half-life?',
            options: [
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV',
              'Structure V'
            ],
            correctIndex: 4,
            optionExplanations: [
              'Incorrect: Structure I has an ultrashort half-life of 1 to 2 minutes.',
              'Incorrect: Structure II is an inactive metabolite.',
              'Incorrect: Structure III has a half-life of ~8 hours.',
              'Incorrect: Structure IV has a half-life of ~2 to 5 hours.',
              'Correct: Structure V (Amlodipine) has an elimination half-life of 30 to 50 hours, permitting once-daily oral dosing without extended-release formulation.'
            ],
            overallExplanation: 'Structure V (Amlodipine) possesses an extraordinarily long elimination half-life (30-50 hours) resulting from slow receptor dissociation, large volume of distribution (~21 L/kg), and slow hepatic clearance.',
            highYieldPearl: 'Structure V (Amlodipine) = longest half-life (30-50 h) among 1,4-DHPs, providing smooth 24-hour BP control with once-daily dosing.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 1, Question 8',
            sourcePageNumber: 1
          },
          {
            id: 509,
            questionNumberLabel: 'Question 9',
            title: 'Best Oral Bioavailability',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs has the best oral bioavailability?',
            options: [
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV',
              'Structure V'
            ],
            correctIndex: 4,
            optionExplanations: [
              'Incorrect: Structure I has negligible oral bioavailability and is administered IV only.',
              'Incorrect: Structure II is pharmacologically inactive.',
              'Incorrect: Structure III has an oral bioavailability of ~15 to 24%.',
              'Incorrect: Structure IV has an oral bioavailability of ~45 to 65%.',
              'Correct: Structure V (Amlodipine) has the highest oral bioavailability (60 to 80%) because its basic primary aminoethoxymethyl side chain (pKa ~8.6) is protonated at physiological pH, slowing hepatic first-pass clearance.'
            ],
            overallExplanation: 'Structure V (Amlodipine) exhibits 60-80% oral bioavailability, markedly superior to other 1,4-DHPs, due to its basic aminoethoxymethyl side chain that protects against rapid first-pass CYP aromatization.',
            highYieldPearl: 'Structure V (Amlodipine) = highest oral bioavailability (60-80%) due to protonated basic C2 aminoethoxy side chain.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 1, Question 9',
            sourcePageNumber: 1
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 2: Inactive DHP SAR Modifications & Ortho/Meta Cl Significance (Questions 10 - 14)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 2,
    title: '1,4-DHP SAR: Nitro Group, Structural Modifications of Inactive Congeners, and Chlorine Significance',
    subtitle: 'Conformational locking by ortho/meta substituents, unsubstituted N1-H requirement, ester functionality, and restoring CCB activity',
    sections: [
      {
        sectionTitle: 'Inactive DHP Congeners: Restoring Vasodilatory CCB Activity',
        block_instructions: 'Consider chemical structures X, Y, and Z to answer questions (10 - 14):',
        structures: [
          VASODILATORS_STRUCTURES.dhp_n_methyl,
          VASODILATORS_STRUCTURES.dhp_unsubstituted_phenyl,
          VASODILATORS_STRUCTURES.dhp_free_acid,
        ],
        questions: [
          {
            id: 510,
            questionNumberLabel: 'Question 1',
            title: 'Role of the Nitro Group in Drug IV',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'What is the importance of the nitro group in Drug IV (from Page 1)? Electronic, steric, or lipophilic/hydrophilic?',
            options: [
              'Purely hydrophilic to promote urinary excretion',
              'Electronic and steric: it acts as an electron-withdrawing group and sterically forces the 4-phenyl ring into a perpendicular plane relative to the 1,4-DHP ring',
              'It acts as a prodrug moiety that releases nitric oxide directly',
              'It causes covalent alkylation of the calcium channel pore'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Nitro is not primarily a solubilizing group.',
              'Correct: The ortho-nitro group exerts both strong electron-withdrawing effects and steric hindrance against the adjacent C3/C5 ester groups, locking the 4-phenyl ring perpendicular (orthogonal) to the 1,4-DHP ring, which is the bioactive conformation required for channel binding.',
              'Incorrect: 1,4-DHPs do not release NO; organic nitrates release NO.',
              'Incorrect: 1,4-DHPs are reversible, non-covalent blockers.'
            ],
            overallExplanation: 'Ortho- and meta-substituents (such as -NO2 or -Cl) on the 4-phenyl ring serve dual electronic (electron-withdrawing) and steric roles, forcing the phenyl ring into a perpendicular orientation relative to the 1,4-DHP ring.',
            highYieldPearl: 'Ortho/meta substituents (-NO2, -Cl) on DHP 4-phenyl ring = steric clash with C3/C5 esters -> locks perpendicular conformation essential for Cav1.2 channel blockade.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 2, Question 10',
            sourcePageNumber: 2
          },
          {
            id: 511,
            questionNumberLabel: 'Question 2',
            title: 'Restoring Activity in Structure X',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'The provided Structure X is pharmacologically inactive/weak as a calcium channel blocker; which of the following modifications can be exploited to restore its calcium channel blocking activity, and therefore, to be used as a vasodilatory antihypertensive agent:',
            options: [
              'Replacing N-CH3 with N-H at position-1',
              'Introducing Cl at position-2` or position-3`',
              'Esterifying the carboxylic group at position-3',
              'Saturating the phenyl ring at position-4',
              'Replacing the methyl group at position-2 with a methyl ester'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure X contains an N-CH3 group at position 1. An unsubstituted secondary amine nitrogen (N1-H) is strictly mandatory for calcium channel blocking activity, where it serves as a crucial hydrogen-bond donor to the receptor pocket. Alkylation of N1 abolishes activity.',
              'Incorrect: Position-2` already carries a chloro group in Structure X.',
              'Incorrect: Esters are already present at positions 3 and 5 in Structure X.',
              'Incorrect: Aromaticity of the 4-phenyl ring is required.',
              'Incorrect: C2/C6 methyl substituents are optimal.'
            ],
            overallExplanation: 'An unsubstituted N1-H group is essential for 1,4-DHP activity because it acts as an indispensable hydrogen-bond donor. Replacing N-CH3 with N-H at position 1 restores activity.',
            highYieldPearl: '1,4-DHP SAR: Unsubstituted N1-H is mandatory (hydrogen-bond donor). N1-alkylation completely destroys CCB activity.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 2, Question 11',
            sourcePageNumber: 2
          },
          {
            id: 512,
            questionNumberLabel: 'Question 3',
            title: 'Restoring Activity in Structure Y',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'The provided Structure Y is pharmacologically inactive/weak as a calcium channel blocker; which of the following modifications can be exploited to restore its calcium channel blocking activity, and therefore, to be used as a vasodilatory antihypertensive agent:',
            options: [
              'Replacing N-CH3 with N-H at position-1',
              'Introducing Cl at position-2` or position-3`',
              'Esterifying the carboxylic group at position-3',
              'Saturating the phenyl ring at position-4',
              'Replacing the methyl group at position-2 with a methyl ester'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Structure Y already has an unsubstituted N1-H.',
              'Correct: Structure Y has an unsubstituted 4-phenyl ring. Introducing an ortho or meta electron-withdrawing substituent (such as Cl at 2` or 3`) provides the steric bulk required to lock the phenyl ring perpendicular to the 1,4-DHP plane, dramatically enhancing CCB activity.',
              'Incorrect: Esters are already present at both C3 and C5.',
              'Incorrect: The phenyl ring must remain planar and aromatic.',
              'Incorrect: C2 methyl is already optimal.'
            ],
            overallExplanation: 'An unsubstituted 4-phenyl ring lacks the steric clash needed to maintain an orthogonal bioactive conformation. Introducing an ortho or meta chloro substituent (2` or 3`) forces perpendicularity and restores potency.',
            highYieldPearl: '1,4-DHP SAR: Ortho/meta substituents on the 4-phenyl ring (2`-Cl or 3`-Cl) are required to lock the perpendicular bioactive conformation.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 2, Question 12',
            sourcePageNumber: 2
          },
          {
            id: 513,
            questionNumberLabel: 'Question 4',
            title: 'Restoring Activity in Structure Z',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'The provided Structure Z is pharmacologically inactive/weak as a calcium channel blocker; which of the following modifications can be exploited to restore its calcium channel blocking activity, and therefore, to be used as a vasodilatory antihypertensive agent:',
            options: [
              'Replacing N-CH3 with N-H at position-1',
              'Introducing Cl at position-2` or position-3`',
              'Esterifying the carboxylic group at position-3',
              'Saturating the phenyl ring at position-4',
              'Replacing the methyl group at position-2 with methylester'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: Structure Z already has an unsubstituted N1-H.',
              'Incorrect: Position-2` already has a chloro substituent.',
              'Correct: Structure Z possesses a free carboxylic acid (-COOH) at position 3, which is ionized at physiological pH and cannot interact with the lipophilic binding pocket. Esterifying C3-COOH to an alkyl ester (-COOR) restores potency.',
              'Incorrect: The phenyl ring must not be saturated.',
              'Incorrect: C2 methyl is optimal.'
            ],
            overallExplanation: 'Carboxylic acid esters at both position 3 and position 5 are strictly required for CCB activity. Free carboxylic acid metabolites are inactive; esterification of C3 restores activity.',
            highYieldPearl: '1,4-DHP SAR: Esters at both C3 and C5 are mandatory (-COOR). Free carboxylic acids at C3/C5 are completely inactive.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 2, Question 13',
            sourcePageNumber: 2
          },
          {
            id: 514,
            questionNumberLabel: 'Question 5',
            title: 'Significance of Chlorine Substituents in Structures X, Y, and Z',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Describe the significance of the chlorine substituent(s) in each of the following drugs X, Y, and Z:',
            options: [
              'They chelate directly to calcium ions in the channel pore',
              'They provide steric clash with the C3/C5 ester groups, locking the 4-phenyl ring perpendicular (orthogonal) to the 1,4-DHP plane, which is essential for channel binding',
              'They serve as leaving groups for covalent inhibition of Cav1.2 channels',
              'They increase aqueous solubility by accepting hydrogen bonds from water'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Chlorines do not chelate calcium ions.',
              'Correct: Bulky ortho/meta chlorine substituents create steric hindrance against the adjacent C3 and C5 ester carbonyls, restricting free rotation and locking the phenyl ring perpendicular to the 1,4-DHP plane, maximizing fit into the Cav1.2 binding pocket.',
              'Incorrect: 1,4-DHPs are reversible, non-covalent blockers.',
              'Incorrect: Chlorines increase lipophilicity, not aqueous solubility.'
            ],
            overallExplanation: 'Ortho- and meta-chlorine substituents sterically constrain the 4-phenyl ring to adopt a perpendicular orientation relative to the 1,4-dihydropyridine plane, maximizing fit into the Cav1.2 allosteric binding pocket.',
            highYieldPearl: 'Ortho/meta-Cl substituents: Steric clash locks the 4-phenyl ring perpendicular to the DHP ring for optimal receptor fit.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 2, Question 14',
            sourcePageNumber: 2
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 3: Direct Vasodilators Metabolism: Hydralazine vs Minoxidil (Questions 15 - 16)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 3,
    title: 'Direct Vasodilators: Hydralazine & Minoxidil Metabolism and Pharmacology',
    subtitle: 'Arylhydrazine vs N-oxide pyrimidinediamine, Phase II NAT2 acetylation inactivation vs SULT1A1 sulfonation bioactivation',
    sections: [
      {
        sectionTitle: 'Direct Vasodilators: Metabolism and Mechanism of Action',
        block_instructions: 'Consider chemical structures I and II to answer questions (15 - 16):',
        structures: [
          VASODILATORS_STRUCTURES.hydralazine,
          VASODILATORS_STRUCTURES.minoxidil,
        ],
        questions: [
          {
            id: 515,
            questionNumberLabel: 'Question 1',
            title: 'Direct Vasodilators Statements Evaluation',
            category: 'Pharmacology MOA',
            type: 'sub-statements',
            questionStem: 'Consider the provided structures and state whether each of the following statements is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'Both are direct vasodilators with similar mechanisms.',
                isCorrect: false,
                explanation: 'False: Drug I (Hydralazine) acts via endothelial nitric oxide stimulation and hyperpolarization; Drug II (Minoxidil) acts as an active sulfate metabolite opening ATP-sensitive potassium (KATP) channels.'
              },
              {
                id: 'b',
                text: 'Both are used to treat hypertension.',
                isCorrect: true,
                explanation: 'True: Both drugs are potent arterial vasodilators utilized in severe, refractory hypertension.'
              },
              {
                id: 'c',
                text: 'Drug I is arylhydrazine whereas Drug II is N-oxide pyrimidine diamine.',
                isCorrect: true,
                explanation: 'True: Drug I (Hydralazine) is a 1-hydrazinophthalazine (arylhydrazine); Drug II (Minoxidil) is 2,4-diamino-6-piperidinopyrimidine 3-oxide.'
              },
              {
                id: 'd',
                text: 'Drug I is inactivated by sulfonation & Drug II is activated by acetylation.',
                isCorrect: false,
                explanation: 'False: The exact reverse is true: Drug I is inactivated by acetylation, and Drug II is activated by sulfonation.'
              },
              {
                id: 'e',
                text: 'Drug I is inactivated by acetylation & Drug II is activated by glucuronidation.',
                isCorrect: false,
                explanation: 'False: Drug II is bioactivated by sulfonation (SULT1A1), not glucuronidation.'
              },
              {
                id: 'f',
                text: 'Drug I is inactivated by acetylation & Drug II is activated by sulfonation.',
                isCorrect: true,
                explanation: 'True: Drug I is inactivated by hepatic N-acetyltransferase 2 (NAT2); Drug II is a prodrug activated by sulfotransferase (SULT1A1) to minoxidil-O-sulfate.'
              },
              {
                id: 'g',
                text: 'Drug I is inactivated by methylation & Drug II is activated by sulfonation.',
                isCorrect: false,
                explanation: 'False: Drug I is inactivated by acetylation, not methylation.'
              },
              {
                id: 'h',
                text: 'Both are primarily metabolized by N-methylation.',
                isCorrect: false,
                explanation: 'False: Neither drug is primarily cleared by N-methylation.'
              }
            ],
            overallExplanation: 'Hydralazine (Drug I) is an arylhydrazine inactivated by NAT2 acetylation. Minoxidil (Drug II) is an N-oxide pyrimidinediamine prodrug bioactivated by SULT1A1 sulfonation to minoxidil-O-sulfate, a potent KATP channel opener.',
            highYieldPearl: 'Hydralazine = inactivated by acetylation (NAT2). Minoxidil = prodrug bioactivated by sulfonation (SULT1A1) to minoxidil sulfate (KATP opener).',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 3, Question 15',
            sourcePageNumber: 3
          },
          {
            id: 516,
            questionNumberLabel: 'Question 2',
            title: 'Metabolites of Drug I and Drug II',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following pairs represent the correct inactive metabolite of Drug I above and the active metabolite of Drug II above?',
            options: [
              'Drug I inactive metabolite: N-Acetylhydralazine (3-methyl-s-triazolo[3,4-a]phthalazine); Drug II active metabolite: Minoxidil-O-sulfate',
              'Drug I inactive metabolite: Hydralazine-O-sulfate; Drug II active metabolite: N-Acetylminoxidil',
              'Drug I inactive metabolite: Phthalic acid; Drug II active metabolite: Minoxidil glucuronide',
              'Drug I inactive metabolite: 4-Hydroxyminoxidil; Drug II active metabolite: Hydralazine N-oxide'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Drug I (Hydralazine) is N-acetylated by NAT2 to N-acetylhydralazine, which rapidly cyclizes to inactive 3-methyl-s-triazolo[3,4-a]phthalazine. Drug II (Minoxidil) undergoes Phase II sulfonation on its N-oxide oxygen by hepatic SULT1A1 to form minoxidil-O-sulfate, the active KATP opener.',
              'Incorrect: Hydralazine is acetylated, not sulfated.',
              'Incorrect: Minoxidil glucuronidation produces inactive metabolites.',
              'Incorrect: Inverted and mismatched structures.'
            ],
            overallExplanation: 'Hydralazine is inactivated by polymorphic NAT2 acetylation into a triazolophthalazine derivative. Minoxidil is bioactivated by sulfotransferase SULT1A1 to minoxidil-O-sulfate.',
            highYieldPearl: 'Inactive Drug I metabolite = N-acetylhydralazine / triazolophthalazine. Active Drug II metabolite = Minoxidil-O-sulfate.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 3, Question 16',
            sourcePageNumber: 3
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 4: Comprehensive Vasodilator Multi-Structure Battery (Questions 17 - 25)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 4,
    title: 'Comprehensive Vasodilator Classification, Mechanisms & Clinical Pharmacology',
    subtitle: 'Chemical class identification, prodrug activation, acetylation phenotypes, KATP openers, ALDH2 nitrates, and NO donors',
    sections: [
      {
        sectionTitle: 'Chemical Classification and Mechanisms of Diverse Vasodilators',
        block_instructions: 'Consider chemical structures I, II, III, IV, V, VI, VII, VIII, IX, and X to answer questions (17 - 25):',
        structures: [
          VASODILATORS_STRUCTURES.nifedipine,
          VASODILATORS_STRUCTURES.amlodipine,
          VASODILATORS_STRUCTURES.isosorbide_dinitrate,
          VASODILATORS_STRUCTURES.hydralazine,
          VASODILATORS_STRUCTURES.sodium_nitroprusside,
          VASODILATORS_STRUCTURES.minoxidil,
          VASODILATORS_STRUCTURES.nitroglycerin,
          VASODILATORS_STRUCTURES.diazoxide,
          VASODILATORS_STRUCTURES.ranolazine,
          VASODILATORS_STRUCTURES.milrinone,
        ],
        questions: [
          {
            id: 517,
            questionNumberLabel: 'Question 1',
            title: 'Chemical Class Matching of Vasodilators',
            category: 'Medicinal Chemistry SAR',
            type: 'matching',
            questionStem: 'Identify the chemical class of each of the provided molecules (Benzothiadiazine-dioxide, Aryloxypropanolamine, Inorganic nitrate, Organic nitrate, Aryl hydrazine, Aminopyrimidine, 1,4-dihydropyridine, and 4-substituted pyridine):',
            prompt: 'Drag each chemical structure chip (Structure I - Structure X) to its corresponding chemical class:',
            options: [
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV',
              'Structure V',
              'Structure VI',
              'Structure VII',
              'Structure VIII',
              'Structure IX',
              'Structure X'
            ],
            matchingTargets: [
              {
                id: 'target-benzothiadiazine',
                label: 'Benzothiadiazine-dioxide',
                acceptedStructureIds: ['Structure VIII', 'VIII', 'diazoxide', 'chem-diazoxide'],
                rationale: 'Structure VIII (Diazoxide) possesses a benzothiadiazine-1,1-dioxide ring system lacking a 7-sulfonamide group.'
              },
              {
                id: 'target-aryloxypropanolamine',
                label: 'Aryloxypropanolamine',
                acceptedStructureIds: ['Structure IX', 'IX', 'ranolazine', 'chem-ranolazine'],
                rationale: 'Structure IX (Ranolazine) is built upon an aryloxypropanolamine framework connected to a piperazine ring.'
              },
              {
                id: 'target-inorganic-nitrate',
                label: 'Inorganic nitrate',
                acceptedStructureIds: ['Structure V', 'V', 'sodium_nitroprusside', 'chem-sodium-nitroprusside'],
                rationale: 'Structure V (Sodium nitroprusside) is an inorganic nitrosyl coordination complex [Na2Fe(CN)5NO].'
              },
              {
                id: 'target-organic-nitrate',
                label: 'Organic nitrate',
                acceptedStructureIds: ['Structure III', 'Structure VII', 'III', 'VII', 'isosorbide_dinitrate', 'nitroglycerin', 'chem-isosorbide-dinitrate', 'chem-nitroglycerin'],
                rationale: 'Structures III (Isosorbide dinitrate) and VII (Nitroglycerin) are organic nitrate esters (-C-O-NO2).'
              },
              {
                id: 'target-aryl-hydrazine',
                label: 'Aryl hydrazine',
                acceptedStructureIds: ['Structure IV', 'IV', 'hydralazine', 'chem-hydralazine'],
                rationale: 'Structure IV (Hydralazine) is a 1-hydrazinophthalazine (aryl hydrazine) derivative.'
              },
              {
                id: 'target-aminopyrimidine',
                label: 'Aminopyrimidine',
                acceptedStructureIds: ['Structure VI', 'VI', 'minoxidil', 'chem-minoxidil'],
                rationale: 'Structure VI (Minoxidil) is an aminopyrimidine N-oxide (2,4-diamino-6-piperidinopyrimidine 3-oxide).'
              },
              {
                id: 'target-dhp',
                label: '1,4-dihydropyridine',
                acceptedStructureIds: ['Structure I', 'Structure II', 'I', 'II', 'nifedipine', 'amlodipine', 'chem-nifedipine', 'chem-amlodipine'],
                rationale: 'Structures I (Nifedipine) and II (Amlodipine) are classic 1,4-dihydropyridine calcium channel blockers.'
              },
              {
                id: 'target-4-sub-pyridine',
                label: '4-substituted pyridine',
                acceptedStructureIds: ['Structure X', 'X', 'milrinone', 'chem-milrinone'],
                rationale: 'Structure X (Milrinone) is a 4-substituted bipyridine (bipyridine phosphodiesterase-3 inhibitor).'
              }
            ],
            overallExplanation: 'Vasodilator structures span diverse chemical classes: Structure I & II = 1,4-dihydropyridines; Structure III & VII = Organic nitrates; Structure IV = Aryl hydrazine; Structure V = Inorganic nitrate; Structure VI = Aminopyrimidine; Structure VIII = Benzothiadiazine-dioxide; Structure IX = Aryloxypropanolamine; Structure X = 4-substituted pyridine.',
            highYieldPearl: 'Vasodilators encompass 1,4-DHPs (I, II), organic nitrates (III, VII), arylhydrazines (IV), inorganic nitrates (V), pyrimidine N-oxides (VI), benzothiadiazines (VIII), aryloxypropanolamines (IX), and 4-substituted pyridines (X).',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 4, Question 17',
            sourcePageNumber: 4
          },
          {
            id: 518,
            questionNumberLabel: 'Question 2',
            title: 'Vasodilatory Prodrugs',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above molecules is(are) vasodilatory prodrug(s)?',
            options: [
              'Structure III, Structure V, Structure VI, and Structure VII',
              'Structure I, Structure II, and Structure VIII',
              'Structure IV, Structure IX, and Structure X',
              'Structure I and Structure IV'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure III (Isosorbide dinitrate) and Structure VII (Nitroglycerin) are organic nitrate prodrugs bioactivated by ALDH2 to release NO; Structure V (Sodium nitroprusside) is an inorganic complex prodrug that releases NO; Structure VI (Minoxidil) is an inactive prodrug that must be bioactivated by hepatic sulfotransferase (SULT1A1) to minoxidil-O-sulfate.',
              'Incorrect: Structures I, II, and VIII are active parent drugs.',
              'Incorrect: Structures IV, IX, and X are active parent drugs.',
              'Incorrect: Structures I and IV are active parent drugs.'
            ],
            overallExplanation: 'Structures III (Isosorbide dinitrate), V (Sodium nitroprusside), VI (Minoxidil), and VII (Nitroglycerin) are prodrugs that require in vivo activation or decomposition to produce active vasodilator entities (NO or minoxidil sulfate).',
            highYieldPearl: 'Vasodilatory prodrugs: Organic/inorganic nitrates (III, V, VII) release NO; Minoxidil (VI) is sulfated to minoxidil sulfate.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 4, Question 18',
            sourcePageNumber: 4
          },
          {
            id: 519,
            questionNumberLabel: 'Question 3',
            title: 'Vasodilator Associated with Acetylation Phenotypes',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the provided molecules is vasodilator(s) that is(are) associated with acetylation phenotypes?',
            options: [
              'Structure IV',
              'Structure VI',
              'Structure V',
              'Structure I'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure IV (Hydralazine) is metabolized by polymorphic N-acetyltransferase 2 (NAT2). Slow acetylators accumulate the drug and are at high risk of Drug-Induced Lupus Erythematosus (DILE).',
              'Incorrect: Structure VI is cleared by glucuronidation and sulfation, not acetylation.',
              'Incorrect: Structure V reacts non-enzymatically with hemoglobin.',
              'Incorrect: Structure I is cleared by CYP3A4 oxidation.'
            ],
            overallExplanation: 'Structure IV (Hydralazine) clearance is governed by NAT2 acetylation status; slow acetylators experience greater drug accumulation and markedly elevated incidence of drug-induced lupus erythematosus.',
            highYieldPearl: 'Structure IV (Hydralazine) + slow acetylator phenotype (NAT2) = high risk of Drug-Induced Lupus Erythematosus (anti-histone antibodies positive).',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 4, Question 19',
            sourcePageNumber: 4
          },
          {
            id: 520,
            questionNumberLabel: 'Question 4',
            title: 'Diuretic Congener with Vasodilatory Effect',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above molecules is a diuretic with a potential vasodilatory effect?',
            options: [
              'Structure VIII',
              'Structure I',
              'Structure IV',
              'Structure X'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure VIII (Diazoxide) is chemically a benzothiadiazine derivative related to thiazide diuretics, but it lacks the 7-sulfonamide group required for carbonic anhydrase and NCC inhibition (so it is not a diuretic). Instead, it opens KATP channels in vascular smooth muscle to cause potent direct vasodilation, and in pancreatic beta-cells to inhibit insulin release.',
              'Incorrect: Structure I is a 1,4-dihydropyridine calcium channel blocker.',
              'Incorrect: Structure IV is an arylhydrazine.',
              'Incorrect: Structure X is a phosphodiesterase-3 inhibitor.'
            ],
            overallExplanation: 'Structure VIII (Diazoxide) has the benzothiadiazine core of thiazide diuretics but lacks a sulfonamide moiety; it lacks diuretic activity and acts as a direct arteriolar vasodilator by opening KATP channels.',
            highYieldPearl: 'Structure VIII (Diazoxide): Benzothiadiazine related to thiazides but lacks sulfonamide -> NO diuresis, but potent KATP channel opening vasodilation + hyperglycemia.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 4, Question 20',
            sourcePageNumber: 4
          },
          {
            id: 521,
            questionNumberLabel: 'Question 5',
            title: 'Beta-Blocker Evaluation of Provided Molecules',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which of the provided molecules is a β-blocker?',
            options: [
              'None of the provided molecules (Structure IX contains an aryloxypropanolamine fragment but is a cyclic tertiary amine antianginal agent, not a β-blocker)',
              'Structure IX',
              'Structure VIII',
              'Structure X'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: None of the above structures is a beta-blocker. Structure IX (Ranolazine) contains an aryloxypropanolamine fragment characteristic of beta-blockers, but it incorporates a cyclic tertiary amine (piperazine ring) and acts as an inhibitor of the late inward sodium current (late INa) in myocardial cells rather than a beta-blocker.',
              'Incorrect: Structure IX is Ranolazine, which is not a beta-blocker despite its aryloxypropanolamine moiety.',
              'Incorrect: Structure VIII is Diazoxide (KATP channel opener).',
              'Incorrect: Structure X is Milrinone (PDE3 inhibitor).'
            ],
            overallExplanation: 'Dr. Al-Horani emphasizes: "Ranolazine: β-blocker?? No, it is a cyclic tertiary amine antianginal agent!" None of the provided molecules functions as a beta-adrenergic receptor antagonist.',
            highYieldPearl: 'Structure IX (Ranolazine): Looks like an aryloxypropanolamine beta-blocker, but is a cyclic tertiary amine late INa inhibitor, NOT a beta-blocker!',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 4, Question 21',
            sourcePageNumber: 4
          },
          {
            id: 522,
            questionNumberLabel: 'Question 6',
            title: 'Bioactivation by Aldehyde Dehydrogenase',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which of the provided molecules is(are) activated by aldehyde dehydrogenase?',
            options: [
              'Structure III and Structure VII',
              'Structure V and Structure VI',
              'Structure IV and Structure VIII',
              'Structure I and Structure II'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structures III (Isosorbide dinitrate) and VII (Nitroglycerin) are organic nitrates that undergo enzymatic bioactivation by mitochondrial aldehyde dehydrogenase-2 (ALDH2), releasing nitric oxide (NO) which activates soluble guanylyl cyclase.',
              'Incorrect: Structure V releases NO non-enzymatically; Structure VI requires sulfotransferase.',
              'Incorrect: Structure IV is acetylated; Structure VIII is active as parent.',
              'Incorrect: Structures I and II are calcium channel blockers.'
            ],
            overallExplanation: 'Organic nitrates (Structure III: Isosorbide dinitrate and Structure VII: Nitroglycerin) require enzymatic denitration by mitochondrial aldehyde dehydrogenase (ALDH2) to generate free nitric oxide (NO).',
            highYieldPearl: 'Structures III & VII (Organic nitrates) = bioactivated by mitochondrial aldehyde dehydrogenase (ALDH2) to release NO.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 4, Question 22',
            sourcePageNumber: 4
          },
          {
            id: 523,
            questionNumberLabel: 'Question 7',
            title: 'Bioactivation by Sulfotransferase',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the provided molecules is(are) activated by sulfotransferase?',
            options: [
              'Structure VI',
              'Structure IV',
              'Structure V',
              'Structure VII'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure VI (Minoxidil) is an inactive prodrug that requires Phase II sulfonation on its N-oxide oxygen by hepatic cytosolic sulfotransferase (SULT1A1) to form minoxidil-O-sulfate, which opens KATP channels.',
              'Incorrect: Structure IV is inactivated by acetylation.',
              'Incorrect: Structure V releases NO spontaneously without sulfotransferase.',
              'Incorrect: Structure VII is activated by ALDH2.'
            ],
            overallExplanation: 'Structure VI (Minoxidil) requires Phase II metabolic bioactivation by sulfotransferase (SULT1A1) into minoxidil-O-sulfate, an active vascular KATP channel opener.',
            highYieldPearl: 'Structure VI (Minoxidil) -> [SULT1A1 sulfotransferase] -> active minoxidil-O-sulfate (KATP channel opener).',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 4, Question 23',
            sourcePageNumber: 4
          },
          {
            id: 524,
            questionNumberLabel: 'Question 8',
            title: 'Vasodilation via Calcium Channel Blockade',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which of the provided molecules promotes vasodilation by blocking calcium channels in vascular tissues?',
            options: [
              'Structure I and Structure II',
              'Structure III and Structure VII',
              'Structure V and Structure VI',
              'Structure VIII and Structure IX'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structures I (Nifedipine) and II (Amlodipine) are 1,4-dihydropyridines that selectively block L-type Cav1.2 calcium channels in vascular smooth muscle, reducing calcium influx and causing arteriolar vasodilation.',
              'Incorrect: Structures III and VII act via NO and cGMP.',
              'Incorrect: Structure V acts via NO; Structure VI acts via KATP channels.',
              'Incorrect: Structure VIII acts via KATP channels; Structure IX acts via late INa.'
            ],
            overallExplanation: 'Structures I (Nifedipine) and II (Amlodipine) promote vasodilation specifically through direct allosteric blockade of L-type voltage-gated calcium channels in vascular smooth muscle.',
            highYieldPearl: 'Structures I & II (1,4-DHPs) = selective vascular L-type Cav1.2 calcium channel blockers.',
            sourceReference: 'Review for Antihypertensive Drugs III (Vasodilators), Page 4, Question 24',
            sourcePageNumber: 4
          },
          {
            id: 525,
            questionNumberLabel: 'Question 9',
            title: 'NO-Mediated Vasodilation',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which of the provided molecules promote(s) NO-mediated vasodilation?',
            options: [
              'Structure III, Structure V, and Structure VII',
              'Structure I, Structure II, and Structure IV',
              'Structure VI and Structure VIII',
              'Structure IX and Structure X'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structures III (Isosorbide dinitrate), V (Sodium nitroprusside), and VII (Nitroglycerin) all exert their vasodilatory actions through the release of nitric oxide (NO), stimulating soluble guanylyl cyclase to increase intracellular cGMP.',
              'Incorrect: Structures I and II block calcium channels.',
              'Incorrect: Structures VI and VIII open KATP channels.',
              'Incorrect: Structure IX inhibits late INa; Structure X inhibits PDE3.'
            ],
            overallExplanation: 'Structures III (Isosorbide dinitrate), V (Sodium nitroprusside), and VII (Nitroglycerin) are nitric oxide donors that stimulate vascular soluble guanylyl cyclase to generate cGMP and induce profound vasodilation.',
            highYieldPearl: 'Structures III, V, & VII = NO donors -> stimulate soluble guanylyl cyclase -> increased cGMP -> vascular smooth muscle relaxation.',
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
    version: '2.1.0',
    createdAt: new Date().toISOString(),
    chemicalStructures: Object.values(VASODILATORS_STRUCTURES),
    pages: vasodilatorsPages,
  };
}
