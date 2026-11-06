import { ReviewModule, ReviewPage } from '../../types/reviewModule';
import { DIURETICS_STRUCTURES } from './exam2Structures';

export const diureticsPages: ReviewPage[] = [
  // ---------------------------------------------------------------------------
  // PAGE 1: Foundations & Thiazide SAR (Questions 1 - 9)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 1,
    title: 'Pharmacophores, Prototypes & Thiazide Diuretics SAR',
    subtitle: 'Core concepts, benzothiadiazines, DCT sodium-chloride symporter inhibition, and structural modifications',
    sections: [
      {
        sectionTitle: 'Core Concepts: Pharmacophore & Prototype Definitions',
        questions: [
          {
            id: 301,
            questionNumberLabel: 'Question 1',
            title: 'Definition of a Pharmacophore',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following statements correctly describes a “pharmacophore”?',
            options: [
              'A constellation of chemical functional groups and their stereochemistry that is essential to promote pharmacological activity',
              'A constellation of chemical functional groups and their stereochemistry that is responsible for adverse reactions',
              'A constellation of chemical functional groups and their stereochemistry that influences the pharmacokinetic aspects',
              'A constellation of chemical functional groups and their stereochemistry that dictates the route of administration',
              'The chemical functional groups that are essential for the mechanism of actions'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: The IUPAC definition of a pharmacophore is the ensemble of steric and electronic features that is necessary to ensure optimal supramolecular interactions with a specific biological target and trigger (or block) its biological response.',
              'Incorrect: Structural features causing adverse reactions or toxicity are known as toxicophores, not pharmacophores.',
              'Incorrect: Pharmacokinetic optimization relates to ADME/PK properties (e.g., prodrug moieties, solubilizing groups), whereas the pharmacophore strictly defines target binding affinity/efficacy.',
              'Incorrect: Route of administration is governed by formulation and biopharmaceutical properties (solubility, bioavailability).',
              'Incorrect: While related to MOA, definition (a) is the precise, complete definition including 3D stereochemical arrangement.'
            ],
            overallExplanation: 'A pharmacophore represents the essential 3D arrangement of electronic and steric features (hydrogen-bond donors/acceptors, charge centers, hydrophobic/aromatic rings) required for biological activity at a receptor or enzyme.',
            highYieldPearl: 'Pharmacophore = essential 3D constellation of functional groups + stereochemistry required for target interaction. Toxicophore = group responsible for toxicity.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 1, Question 1',
            sourcePageNumber: 1
          },
          {
            id: 302,
            questionNumberLabel: 'Question 2',
            title: 'Definition of a Prototype Drug',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'True or False: A prototype is usually the drug that was first approved in a certain drug class and represents the class structurally and mechanistically.',
            options: [
              'True',
              'False'
            ],
            correctIndex: 0,
            optionExplanations: [
              'True: A prototype agent (e.g., chlorothiazide for thiazides, propranolol for beta-blockers, captopril for ACEIs) serves as the foundational standard against which newer structural congeners and "me-too" derivatives are compared.',
              'False: This is the exact definition of a pharmacological and medicinal chemistry prototype.'
            ],
            overallExplanation: 'Prototype drugs establish the foundational SAR, mechanism, and clinical profile of a drug class. Chlorothiazide was synthesized in 1957 as the prototype benzothiadiazine diuretic.',
            highYieldPearl: 'Prototype = first-in-class benchmark drug representing the core structure and pharmacology (e.g., Chlorothiazide, Propranolol, Captopril).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 1, Question 2',
            sourcePageNumber: 1
          }
        ]
      },
      {
        sectionTitle: 'Thiazide Diuretics SAR: Chlorothiazide, Hydrochlorothiazide, Trichlormethiazide & Polythiazide',
        block_instructions: 'Consider structures I (Chlorothiazide), II (Hydrochlorothiazide), III (Trichlormethiazide), and IV (Polythiazide) to answer questions 3-9. Focus on modifications at the 3,4-double bond, position-3 substituent, and position-2 nitrogen.',
        structures: [
          DIURETICS_STRUCTURES.chlorothiazide,
          DIURETICS_STRUCTURES.hydrochlorothiazide,
          DIURETICS_STRUCTURES.trichlormethiazide,
          DIURETICS_STRUCTURES.polythiazide
        ],
        questions: [
          {
            id: 303,
            questionNumberLabel: 'Question 3',
            title: 'Chemical Class of Thiazide Diuretics',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following best describes the chemical class of the above molecules (I: Chlorothiazide, II: HCTZ, III: Trichlormethiazide, IV: Polythiazide)?',
            options: [
              'Benzothiadiazine-1,1-dioxide',
              '1,4-Dihydropyridine',
              'Aryloxypropanolamine',
              'Arylethanolamine',
              'Sulfamoyl anthranilic acid',
              'Steroid',
              'Peptidomimetic'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Thiazides contain a bicyclic core consisting of a fused benzene ring and a 1,2,4-thiadiazine ring with a 1,1-dioxide (sulfonyl) group.',
              'Incorrect: 1,4-dihydropyridines are calcium channel blockers (e.g., nifedipine, amlodipine).',
              'Incorrect: Aryloxypropanolamines are beta-blockers (e.g., propranolol, metoprolol).',
              'Incorrect: Arylethanolamines are mixed adrenergic antagonists (e.g., labetalol).',
              'Incorrect: Sulfamoyl anthranilic acids are loop diuretics (e.g., furosemide).',
              'Incorrect: Steroids include spironolactone and eplerenone.',
              'Incorrect: Peptidomimetics include aliskiren and ACE inhibitors.'
            ],
            overallExplanation: 'All four structures share the 2H-1,2,4-benzothiadiazine-1,1-dioxide heterocyclic bicyclic ring system, the defining scaffold of thiazide diuretics.',
            highYieldPearl: 'Thiazides = Benzothiadiazine-1,1-dioxides. Essential features: 7-sulfonamide, 6-chloro/CF3, and bicyclic nucleus.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 1, Question 3',
            sourcePageNumber: 1
          },
          {
            id: 304,
            questionNumberLabel: 'Question 4',
            title: 'Mechanistic Class of Benzothiadiazine Diuretics',
            category: 'Pharmacology',
            type: 'multiple-choice',
            questionStem: 'What is the mechanistic class of the above drugs (Chlorothiazide, HCTZ, Trichlormethiazide, Polythiazide)?',
            options: [
              'Thiazide diuretics (NCC inhibitors in the distal convoluted tubule)',
              'Potassium-sparing agents (ENaC blockers)',
              'Loop diuretics (NKCC2 symporter inhibitors)',
              'Calcium channel blockers (L-type Ca2+ channel blockers)',
              'Beta-blockers',
              'Angiotensin-converting enzyme (ACE) inhibitors',
              'Angiotensin II receptor antagonists (ARBs)'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Thiazide diuretics inhibit the electroneutral Na+/Cl- cotransporter (NCC / SLC12A3) in the apical membrane of the distal convoluted tubule (DCT).',
              'Incorrect: Potassium-sparing agents (e.g., amiloride, triamterene) act on ENaC in the late distal tubule and collecting duct.',
              'Incorrect: Loop diuretics (e.g., furosemide, bumetanide) inhibit NKCC2 in the thick ascending limb of Henle.',
              'Incorrect: CCBs act on vascular and cardiac L-type calcium channels.',
              'Incorrect: Beta-blockers antagonize beta-adrenergic receptors.',
              'Incorrect: ACE inhibitors block angiotensin II biosynthesis.',
              'Incorrect: ARBs block AT1 receptors.'
            ],
            overallExplanation: 'Thiazides block the Na+/Cl- cotransporter (NCC) in the luminal membrane of early distal convoluted tubule (DCT) epithelial cells, competing with luminal Cl- for the chloride-binding site.',
            highYieldPearl: 'Thiazides bind the chloride-binding site of the NCC symporter in the distal convoluted tubule (DCT), causing ~5% fractional sodium excretion.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 1, Question 4',
            sourcePageNumber: 1
          },
          {
            id: 305,
            questionNumberLabel: 'Question 5',
            title: 'Thiazide Diuretics SAR: Most Potent vs Least Potent',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is the MOST potent? Which is the LEAST potent?',
            options: [
              'Most potent: Polythiazide (IV); Least potent: Chlorothiazide (I)',
              'Most potent: Chlorothiazide (I); Least potent: Polythiazide (IV)',
              'Most potent: Hydrochlorothiazide (II); Least potent: Trichlormethiazide (III)',
              'Most potent: Trichlormethiazide (III); Least potent: Chlorothiazide (I)'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Polythiazide (IV) possesses a 2-methyl group, a 3-trifluoroethylthiomethyl substituent, and a saturated 3,4-bond, conferring ~1000-fold higher potency than Chlorothiazide (I). Chlorothiazide has an unsaturated 3,4-double bond and no C3 substituent, making it the least potent.',
              'Incorrect: Chlorothiazide is the least potent prototype.',
              'Incorrect: HCTZ is ~10-fold more potent than chlorothiazide, but less potent than trichlormethiazide (~100x) and polythiazide (~1000x).',
              'Incorrect: Trichlormethiazide is ~100x chlorothiazide, but polythiazide is ~1000x.'
            ],
            overallExplanation: 'Potency increases dramatically with: (1) saturation of the 3,4-double bond (+10x: HCTZ vs Chlorothiazide); (2) lipophilic haloalkyl substitution at C3 (trichloromethyl +100x; trifluoroethylthiomethyl +1000x); and (3) N2-alkylation (methyl on polythiazide).',
            highYieldPearl: 'Potency ranking: Polythiazide (~1000x) > Trichlormethiazide (~100x) > Hydrochlorothiazide (~10x) > Chlorothiazide (1x).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 1, Question 5',
            sourcePageNumber: 1
          },
          {
            id: 306,
            questionNumberLabel: 'Question 6',
            title: 'Thiazide Diuretics SAR: Longest vs Shortest Duration of Action',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs has the LONGEST duration of action? Which has the SHORTEST duration of action?',
            options: [
              'Longest: Polythiazide (IV); Shortest: Chlorothiazide (I) & Hydrochlorothiazide (II)',
              'Longest: Chlorothiazide (I); Shortest: Polythiazide (IV)',
              'Longest: Hydrochlorothiazide (II); Shortest: Trichlormethiazide (III)',
              'Longest: Trichlormethiazide (III); Shortest: Hydrochlorothiazide (II)'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Polythiazide (IV) has the highest lipophilicity (XLogP ~1.5) and extensive plasma protein binding, conferring an extended duration of 24-36 hours. Chlorothiazide and HCTZ have the lowest lipophilicity and shortest durations (~6-12 hours).',
              'Incorrect: Chlorothiazide has the shortest duration (~6-12 hrs).',
              'Incorrect: HCTZ has a relatively short duration (~6-12 hrs).',
              'Incorrect: Polythiazide has the longest duration among the four.'
            ],
            overallExplanation: 'Lipophilic substituents at C3 and N2 slow metabolic clearance and increase volume of distribution/protein binding, substantially lengthening duration from 6-12 hrs (Chlorothiazide) to >24 hrs (Polythiazide).',
            highYieldPearl: 'Duration of Action: Polythiazide (24-36 hrs) > Trichlormethiazide (~24 hrs) > Hydrochlorothiazide (6-12 hrs) = Chlorothiazide (6-12 hrs).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 1, Question 6',
            sourcePageNumber: 1
          },
          {
            id: 307,
            questionNumberLabel: 'Question 7',
            title: 'Ranking Diuretic Potency',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Rank the above drugs according to their diuretic potency from MOST POTENT to WEAKEST:',
            options: [
              'IV (Polythiazide) > III (Trichlormethiazide) > II (Hydrochlorothiazide) > I (Chlorothiazide)',
              'I (Chlorothiazide) > II (Hydrochlorothiazide) > III (Trichlormethiazide) > IV (Polythiazide)',
              'II (Hydrochlorothiazide) > IV (Polythiazide) > III (Trichlormethiazide) > I (Chlorothiazide)',
              'III (Trichlormethiazide) > IV (Polythiazide) > II (Hydrochlorothiazide) > I (Chlorothiazide)'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Relative potencies are ~1000x (IV) > ~100x (III) > ~10x (II) > 1x (I).',
              'Incorrect: Inverted ranking.',
              'Incorrect: HCTZ is less potent than both trichlormethiazide and polythiazide.',
              'Incorrect: Polythiazide is more potent than trichlormethiazide.'
            ],
            overallExplanation: 'SAR: 3,4-dihydro saturation (+10x) + lipophilic C3 alkyl/haloalkyl groups (+100x to +1000x) progressively increase potency.',
            highYieldPearl: 'Potency hierarchy: Polythiazide > Trichlormethiazide > Hydrochlorothiazide > Chlorothiazide.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 1, Question 7',
            sourcePageNumber: 1
          },
          {
            id: 308,
            questionNumberLabel: 'Question 8',
            title: 'Ranking Duration of Action',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Rank the above drugs according to their duration of action from SHORTEST to LONGEST:',
            options: [
              'I (Chlorothiazide) <= II (Hydrochlorothiazide) < III (Trichlormethiazide) < IV (Polythiazide)',
              'IV (Polythiazide) < III (Trichlormethiazide) < II (Hydrochlorothiazide) < I (Chlorothiazide)',
              'II (Hydrochlorothiazide) < I (Chlorothiazide) < IV (Polythiazide) < III (Trichlormethiazide)',
              'I (Chlorothiazide) < IV (Polythiazide) < II (Hydrochlorothiazide) < III (Trichlormethiazide)'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Chlorothiazide and HCTZ have durations of ~6-12 hours, Trichlormethiazide lasts ~24 hours, and Polythiazide lasts 24-36 hours.',
              'Incorrect: Inverted order.',
              'Incorrect: Trichlormethiazide is shorter than polythiazide.',
              'Incorrect: Polythiazide has the longest duration.'
            ],
            overallExplanation: 'Increased lipophilicity at C3 and N2 decreases renal clearance rates and prolongs tissue binding, extending pharmacological half-life.',
            highYieldPearl: 'Duration hierarchy: Chlorothiazide (6-12h) <= HCTZ (6-12h) < Trichlormethiazide (24h) < Polythiazide (24-36h).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 1, Question 8',
            sourcePageNumber: 1
          },
          {
            id: 309,
            questionNumberLabel: 'Question 9',
            title: 'Thiazide Diuretics True/False Statements',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'Consider the chemical structures of Chlorothiazide, Hydrochlorothiazide, Trichlormethiazide, and Polythiazide to determine whether each statement is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'The above diuretics inhibit NaCl reabsorption at the ascending limb of the loop of Henle.',
                isCorrect: false,
                explanation: 'False: Thiazides act in the distal convoluted tubule (DCT); loop diuretics act in the ascending limb of Henle.'
              },
              {
                id: 'b',
                text: 'The above drugs are acidic molecules.',
                isCorrect: true,
                explanation: 'True: Thiazides possess acidic sulfonamide and ring amine protons (pKa ~6.7-9.5), enabling formation of water-soluble sodium salts.'
              },
              {
                id: 'c',
                text: 'The above drugs are extensively metabolized by the liver.',
                isCorrect: false,
                explanation: 'False: Thiazides are primarily excreted unchanged (>95%) by glomerular filtration and active tubular secretion in the kidney.'
              },
              {
                id: 'd',
                text: 'Chemical saturation of the 3,4-double bond leads to a diuretic agent with reduced activity.',
                isCorrect: false,
                explanation: 'False: Saturation of the 3,4-double bond yields 3,4-dihydro derivatives (e.g., HCTZ) with 10-fold INCREASED potency.'
              },
              {
                id: 'e',
                text: 'Replacing the sulfonyl group at position-1 with a carbonyl enhances oral bioavailability and extends duration of action.',
                isCorrect: true,
                explanation: 'True: Replacing the 1-SO2 with C=O yields quinazolinone "thiazide-like" diuretics (e.g., Metolazone), which have high oral bioavailability and long duration.'
              },
              {
                id: 'f',
                text: 'The heterocycle ring is essential for thiazide diuretic activity.',
                isCorrect: false,
                explanation: 'False: The benzothiadiazine ring is NOT strictly essential; thiazide-like diuretics with open rings or isoindolinone/indoline rings (Chlorthalidone, Indapamide) retain potent DCT NCC inhibitory activity.'
              }
            ],
            overallExplanation: 'Thiazides are weakly acidic, renally excreted drugs that target the DCT. 3,4-saturation INCREASES potency 10x. Quinazolinone substitution (C=O at C1) yields metolazone.',
            highYieldPearl: 'Thiazides are acidic, excreted unchanged renally, and act at the DCT. Saturated 3,4-bond = 10x more potent. Heterocycle is NOT strictly required (Chlorthalidone, Indapamide).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 1, Question 9',
            sourcePageNumber: 1
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 2: Thiazide-like & Loop Diuretics SAR (Questions 10 - 22)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 2,
    title: 'Thiazide-like Diuretics & High-Ceiling Loop Diuretics SAR',
    subtitle: 'Metolazone, Chlorthalidone, Furosemide, Bumetanide, Torsemide, and Ethacrynic acid',
    sections: [
      {
        sectionTitle: 'Thiazide-Like Agents: Metolazone vs Chlorthalidone',
        block_instructions: 'Consider structures I (Metolazone, quinazolinone) and II (Chlorthalidone, phthalimidine) to evaluate their chemical and clinical properties.',
        structures: [
          DIURETICS_STRUCTURES.metolazone,
          DIURETICS_STRUCTURES.chlorthalidone
        ],
        questions: [
          {
            id: 310,
            questionNumberLabel: 'Question 10',
            title: 'Metolazone vs Chlorthalidone True/False Statements',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'Consider the chemical structures of Drug I (Metolazone) and Drug II (Chlorthalidone) and state whether each statement is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'The two drugs are loop diuretics.',
                isCorrect: false,
                explanation: 'False: Metolazone and Chlorthalidone are thiazide-like diuretics that inhibit the Na+/Cl- cotransporter in the DCT.'
              },
              {
                id: 'b',
                text: 'They block salt reabsorption at the distal convoluted tubule.',
                isCorrect: true,
                explanation: 'True: Both drugs exert their primary diuretic action at the DCT (NCC symporter).'
              },
              {
                id: 'c',
                text: 'The two drugs are basic molecules.',
                isCorrect: false,
                explanation: 'False: Both drugs are weakly acidic due to the primary sulfonamide group (-SO2NH2, pKa ~9.4) and lactam/imide rings.'
              },
              {
                id: 'd',
                text: 'Drug I is a quinolin-4-one derivative, whereas Drug II is a benzothiadiazine dioxide derivative.',
                isCorrect: false,
                explanation: 'False: Drug I (Metolazone) is a quinazolinone (specifically 7-sulfamoyl-1,2,3,4-tetrahydroquinazolin-4-one), and Drug II (Chlorthalidone) is a phthalimidine / isoindolinone derivative (neither is a benzothiadiazine dioxide).'
              },
              {
                id: 'e',
                text: 'Drug II has higher oral bioavailability and longer duration of action than Drug I.',
                isCorrect: true,
                explanation: 'True: Chlorthalidone (II) has exceptional RBC partitioning (binds tightly to erythrocyte carbonic anhydrase), resulting in an extremely long elimination half-life (~40-60 hours) and duration of 48-72 hours, exceeding Metolazone (12-24 hours).'
              }
            ],
            overallExplanation: 'Metolazone (quinazolinone) and Chlorthalidone (phthalimidine) are thiazide-like diuretics that share the 7-sulfonamide and 6-chloro pharmacophore of thiazides, blocking the NCC in the DCT.',
            highYieldPearl: 'Chlorthalidone binds RBC carbonic anhydrase, yielding a 40-60 hour half-life (longest-acting thiazide-like). Metolazone is uniquely effective even at low GFR (<30 mL/min).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 2, Question 10',
            sourcePageNumber: 2
          },
          {
            id: 311,
            questionNumberLabel: 'Question 11',
            title: 'Molecules Lacking Substantial Diuretic Activity',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following molecules lacks substantial diuretic activity (comparing Diazoxide vs Chlorothiazide, HCTZ, Metolazone)?',
            options: [
              'Diazoxide (lacks 7-sulfonamide group: contains 7-chloro but no sulfonamide)',
              'Chlorothiazide',
              'Hydrochlorothiazide',
              'Metolazone'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Diazoxide retains the benzothiadiazine ring but lacks the essential unsubstituted 7-sulfonamide group (-SO2NH2). It has NO diuretic activity and is instead an ATP-sensitive K+ channel (K_ATP) opener that causes vasodilation and hyperglycemic insulin inhibition.',
              'Incorrect: Chlorothiazide is a potent diuretic.',
              'Incorrect: HCTZ is a potent diuretic.',
              'Incorrect: Metolazone is a potent diuretic.'
            ],
            overallExplanation: 'An unsubstituted sulfonamide group at position 7 (or meta to ring nitrogen) is MANDATORY for diuretic activity. Without it, Diazoxide opens K_ATP channels, relaxing vascular smooth muscle without promoting diuresis.',
            highYieldPearl: 'Diazoxide lacks the 7-sulfonamide group -> ZERO diuretic effect. It opens K_ATP channels to cause profound vasodilation and inhibit insulin release (treats insulinoma).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 2, Question 11',
            sourcePageNumber: 2
          }
        ]
      },
      {
        sectionTitle: 'Loop Diuretics SAR: Furosemide, Bumetanide, Torsemide & Ethacrynic Acid',
        block_instructions: 'Consider structures I (Furosemide), II (Bumetanide), III (Torsemide), and IV (Ethacrynic acid) to answer questions 12-22.',
        structures: [
          DIURETICS_STRUCTURES.furosemide,
          DIURETICS_STRUCTURES.bumetanide,
          DIURETICS_STRUCTURES.torsemide,
          DIURETICS_STRUCTURES.ethacrynic_acid
        ],
        questions: [
          {
            id: 312,
            questionNumberLabel: 'Question 12',
            title: 'Chemical Class of Molecules I (Furosemide) and II (Bumetanide)',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following best describes the chemical class of Molecules I (Furosemide) and II (Bumetanide)?',
            options: [
              'Sulfamoyl anthranilic acid / sulfamoyl benzoic acid derivatives',
              'Benzothiadiazine-1,1-dioxide',
              '1,4-Dihydropyridine',
              'Aryloxypropanolamine',
              'Arylethanolamine',
              'Steroid'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Furosemide is a 5-sulfamoyl-2-aminobenzoic acid (anthranilic acid) derivative, and Bumetanide is a 3-sulfamoyl-4-phenoxy-5-butylaminobenzoic acid derivative.',
              'Incorrect: Benzothiadiazines are thiazides.',
              'Incorrect: 1,4-dihydropyridines are CCBs.',
              'Incorrect: Aryloxypropanolamines are beta-blockers.',
              'Incorrect: Arylethanolamines are alpha/beta-blockers.',
              'Incorrect: Steroids are mineralocorticoid antagonists.'
            ],
            overallExplanation: 'Furosemide and Bumetanide are sulfamoyl benzoic acid loop diuretics. Furosemide is an anthranilic acid (2-aminobenzoic acid), while Bumetanide is a meta-substituted benzoic acid.',
            highYieldPearl: 'Furosemide = 5-sulfamoyl anthranilic acid. Bumetanide = 3-sulfamoyl-5-butylamino-4-phenoxybenzoic acid (~40x more potent than furosemide).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 2, Question 12',
            sourcePageNumber: 2
          },
          {
            id: 313,
            questionNumberLabel: 'Question 13',
            title: 'Mechanistic Class of High-Ceiling Diuretics',
            category: 'Pharmacology',
            type: 'multiple-choice',
            questionStem: 'What is the mechanistic class of the above drugs (Furosemide, Bumetanide, Torsemide, Ethacrynic acid)?',
            options: [
              'Loop diuretics (High-ceiling NKCC2 cotransporter inhibitors)',
              'Potassium-sparing agents',
              'Thiazide diuretics',
              'Calcium channel blockers',
              'Beta-blockers',
              'ACE inhibitors'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Loop diuretics inhibit the Na+/K+/2Cl- symporter (NKCC2) in the thick ascending limb of Henle (TAL), inducing massive natriuresis (up to 20-25% fractional Na+ excretion).',
              'Incorrect: Potassium-sparing agents act in the collecting duct.',
              'Incorrect: Thiazides act in the DCT.',
              'Incorrect: CCBs block voltage-gated calcium channels.',
              'Incorrect: Beta-blockers block adrenergic receptors.',
              'Incorrect: ACEIs inhibit ACE.'
            ],
            overallExplanation: 'Loop diuretics compete with chloride for the Cl- translocation site of the NKCC2 symporter in the luminal membrane of the thick ascending limb of Henle.',
            highYieldPearl: 'Loop diuretics = high ceiling (~20-25% fractional Na excretion) due to NKCC2 blockade in the thick ascending limb of the loop of Henle.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 2, Question 13',
            sourcePageNumber: 2
          },
          {
            id: 314,
            questionNumberLabel: 'Question 14',
            title: 'Potency Comparison: Furosemide vs Bumetanide',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which is more potent: Furosemide (I) or Bumetanide (II)? By what approximate factor?',
            options: [
              'Bumetanide (II) is ~40-fold more potent than Furosemide (I)',
              'Furosemide (I) is ~40-fold more potent than Bumetanide (II)',
              'Both have identical molar potency (1:1 equivalence)',
              'Bumetanide is ~2-fold less potent than Furosemide'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Bumetanide is ~40 times more potent than furosemide on a milligram-for-milligram basis (1 mg bumetanide ~ 40 mg oral furosemide).',
              'Incorrect: Bumetanide is far more potent than furosemide.',
              'Incorrect: 1 mg bumetanide is equivalent to 40 mg furosemide.',
              'Incorrect: Bumetanide is 40x more potent, not less potent.'
            ],
            overallExplanation: 'Replacing the 4-chloro of furosemide with a 4-phenoxy group and shifting the amino group to position 5 with a butyl chain in bumetanide dramatically increases affinity for the NKCC2 transporter, yielding a 40-fold potency gain.',
            highYieldPearl: 'Bumetanide is 40x more potent than Furosemide (1 mg bumetanide = 40 mg oral furosemide = 20 mg torsemide = 50 mg ethacrynic acid).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 2, Question 14',
            sourcePageNumber: 2
          },
          {
            id: 315,
            questionNumberLabel: 'Question 15',
            title: 'Oral Bioavailability: Furosemide vs Bumetanide vs Torsemide',
            category: 'Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the loop diuretics has erratic and variable oral bioavailability (10-90%, mean ~50%), whereas Bumetanide and Torsemide have high, predictable oral bioavailability (>80-100%)?',
            options: [
              'Furosemide (I)',
              'Bumetanide (II)',
              'Torsemide (III)',
              'Ethacrynic acid (IV)'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Furosemide has notoriously erratic oral bioavailability ranging from 10% to 90% (average ~50%), heavily affected by food and intestinal edema in decompensated heart failure. Torsemide and Bumetanide have >80-100% predictable bioavailability.',
              'Incorrect: Bumetanide has ~80-90% oral bioavailability.',
              'Incorrect: Torsemide has ~80-100% oral bioavailability.',
              'Incorrect: Ethacrynic acid has ~100% oral bioavailability.'
            ],
            overallExplanation: 'Furosemide oral bioavailability is erratic (~50%), requiring double the IV dose when converting from IV to oral (IV:PO ratio = 1:2). Torsemide and bumetanide have near 1:1 IV:PO bioequivalence.',
            highYieldPearl: 'Oral Bioavailability: Torsemide (80-100%) and Bumetanide (80-90%) are predictable; Furosemide is erratic (10-90%, avg ~50%). IV:PO ratio is 1:2 for furosemide, 1:1 for bumetanide/torsemide.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 2, Question 15',
            sourcePageNumber: 2
          },
          {
            id: 316,
            questionNumberLabel: 'Question 16',
            title: 'Elimination Half-Life of Loop Diuretics',
            category: 'Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the loop diuretics has the LONGEST elimination half-life and longest duration of action (~6-8 hours), making it ideal for once-daily dosing in heart failure?',
            options: [
              'Torsemide (III) (half-life ~3-4 hours, duration ~6-8 hours)',
              'Furosemide (I) (half-life ~1.5 hours, duration ~4-6 hours)',
              'Bumetanide (II) (half-life ~1 hour, duration ~3-4 hours)',
              'Ethacrynic acid (IV) (half-life ~1 hour)'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Torsemide has an elimination half-life of 3-4 hours (vs 1.5h for furosemide and 1h for bumetanide) and a duration of action of 6-8 hours, providing smoother diuresis with once-daily dosing.',
              'Incorrect: Furosemide has a shorter half-life (~1.5 hours).',
              'Incorrect: Bumetanide has the shortest half-life (~1 hour).',
              'Incorrect: Ethacrynic acid has a short half-life (~1 hour).'
            ],
            overallExplanation: 'Torsemide is a sulfonylurea-containing loop diuretic with prolonged receptor occupancy and hepatic metabolism (CYP2C9), giving it the longest half-life and duration among standard loop diuretics.',
            highYieldPearl: 'Torsemide has the longest half-life (3-4h) and duration of action among loop diuretics, yielding less rebound sodium retention.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 2, Question 16',
            sourcePageNumber: 2
          },
          {
            id: 317,
            questionNumberLabel: 'Question 17',
            title: 'Loop Diuretic for Patients with Severe Sulfa Hypersensitivity',
            category: 'Clinical Applications',
            type: 'multiple-choice',
            questionStem: 'Which of the loop diuretics lacks a sulfonamide moiety and can be safely administered to a patient with a documented severe, life-threatening anaphylactic sulfa allergy?',
            options: [
              'Ethacrynic acid (IV) (phenoxyacetic acid derivative lacking sulfonamide)',
              'Furosemide (I)',
              'Bumetanide (II)',
              'Torsemide (III)'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Ethacrynic acid is an alpha,beta-unsaturated ketone-containing phenoxyacetic acid derivative completely lacking a sulfonamide group, making it the only loop diuretic safe in true sulfa allergy.',
              'Incorrect: Furosemide has a sulfonamide group.',
              'Incorrect: Bumetanide has a sulfonamide group.',
              'Incorrect: Torsemide has a sulfonamide/sulfonylurea moiety.'
            ],
            overallExplanation: 'Furosemide, bumetanide, and torsemide are all sulfonamides and cross-react in patients with severe sulfa allergy. Ethacrynic acid is a phenoxyacetic acid derivative with NO sulfonamide group.',
            highYieldPearl: 'Ethacrynic acid is the ONLY loop diuretic without a sulfonamide group. It is the drug of choice for severe edema in patients with documented sulfa anaphylaxis.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 2, Question 17',
            sourcePageNumber: 2
          },
          {
            id: 318,
            questionNumberLabel: 'Question 18',
            title: 'Highest Ototoxicity Risk Among Loop Diuretics',
            category: 'Clinical Applications',
            type: 'multiple-choice',
            questionStem: 'Which of the loop diuretics carries the HIGHEST risk of permanent, irreversible ototoxicity (hearing loss and tinnitus), particularly when co-administered with aminoglycoside antibiotics?',
            options: [
              'Ethacrynic acid (IV)',
              'Bumetanide (II)',
              'Torsemide (III)',
              'Furosemide (I)'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Ethacrynic acid carries the highest risk of ototoxicity, which is frequently irreversible, because its electrophilic alpha,beta-unsaturated carbonyl reacts covalently with sulfhydryl groups in inner ear hair cells.',
              'Incorrect: Bumetanide has the lowest ototoxicity risk among loop diuretics.',
              'Incorrect: Torsemide has low ototoxicity.',
              'Incorrect: Furosemide causes dose-dependent ototoxicity, but it is typically reversible and less severe than ethacrynic acid.'
            ],
            overallExplanation: 'Ethacrynic acid causes significantly higher rates of permanent sensorineural hearing loss than sulfonamide loop diuretics. Bumetanide has the lowest risk of ototoxicity.',
            highYieldPearl: 'Ototoxicity risk: Ethacrynic acid (highest, often irreversible) >> Furosemide (reversible) > Torsemide > Bumetanide (lowest ototoxicity).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 2, Question 18',
            sourcePageNumber: 2
          },
          {
            id: 319,
            questionNumberLabel: 'Question 19',
            title: 'Chemical Class of Torsemide',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'What is the chemical class of Torsemide (Drug III)?',
            options: [
              'Sulfonylurea / pyridine-sulfonylurea derivative',
              'Sulfamoyl anthranilic acid',
              'Phenoxyacetic acid derivative',
              'Benzothiadiazine-1,1-dioxide'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Torsemide consists of a pyridine ring linked via a sulfonylurea bridge (-SO2-NH-CO-NH-) to an isopropylamino group and a meta-toluidine substituent.',
              'Incorrect: Furosemide is a sulfamoyl anthranilic acid.',
              'Incorrect: Ethacrynic acid is a phenoxyacetic acid.',
              'Incorrect: Thiazides are benzothiadiazines.'
            ],
            overallExplanation: 'Torsemide is structurally unique among loop diuretics: it replaces the carboxylate and primary sulfonamide with a sulfonylurea linkage and pyridine ring.',
            highYieldPearl: 'Torsemide = Pyridine-sulfonylurea loop diuretic. Does not cause hypoglycemia despite sulfonylurea linkage.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 2, Question 19',
            sourcePageNumber: 2
          },
          {
            id: 320,
            questionNumberLabel: 'Question 20',
            title: 'Chemical Reactivity of Ethacrynic Acid (Michael Acceptor)',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Ethacrynic acid (IV) undergoes a classic Michael addition reaction in vivo. What functional group acts as the Michael acceptor, and what nucleophile reacts with it?',
            options: [
              'The alpha,beta-unsaturated carbonyl (methylene group C=C) reacts with endogenous sulfhydryl (-SH) groups such as glutathione or cysteine',
              'The carboxylic acid reacts with amino groups on albumin',
              'The dichloro-substituted benzene ring reacts with water via nucleophilic aromatic substitution',
              'The ether oxygen reacts with glucuronic acid'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: The 2-methylenebutyryl group contains an alpha,beta-unsaturated ketone that serves as an electrophilic Michael acceptor, undergoing 1,4-conjugate addition with nucleophilic sulfhydryl (-SH) groups on renal enzymes, glutathione, and inner ear proteins.',
              'Incorrect: Michael additions involve alpha,beta-unsaturated carbonyls, not carboxylates.',
              'Incorrect: The aromatic chlorines are not Michael acceptors.',
              'Incorrect: Glucuronidation is not a Michael addition.'
            ],
            overallExplanation: 'The terminal =CH2 of the alpha,beta-unsaturated acyl group in ethacrynic acid is an electrophilic Michael acceptor that forms covalent adducts with cysteine thiols in the NKCC2 transporter and inner ear proteins (contributing to ototoxicity).',
            highYieldPearl: 'Ethacrynic acid = Michael acceptor (alpha,beta-unsaturated ketone). Covalently reacts with sulfhydryl (-SH) groups of cysteine and glutathione.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 2, Question 20',
            sourcePageNumber: 2
          },
          {
            id: 321,
            questionNumberLabel: 'Question 21',
            title: 'Is Ethacrynic Acid a Prodrug?',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Is Ethacrynic acid considered a prodrug, and is its cysteine adduct active?',
            options: [
              'Yes, the ethacrynic acid-cysteine / glutathione adduct is formed in vivo and is ~2-3 fold MORE potent as an NKCC2 inhibitor than parent ethacrynic acid',
              'No, ethacrynic acid is completely active as administered and metabolites are completely inactive',
              'Yes, it requires hepatic esterase hydrolysis to become active',
              'No, it is an irreversible suicide inhibitor that permanently destroys NKCC2'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: The cysteine conjugate of ethacrynic acid formed in the kidney is actively secreted into tubular lumen and is 2- to 3-fold more potent than parent ethacrynic acid.',
              'Incorrect: The cysteine conjugate is actually more potent.',
              'Incorrect: Ethacrynic acid does not contain an ester.',
              'Incorrect: Its binding is reversible in equilibrium with thiol pools.'
            ],
            overallExplanation: 'Ethacrynic acid is rapidly conjugated with cysteine in renal tubular cells; the resulting cysteine adduct is actively secreted via organic anion transporters and is a more potent inhibitor of NKCC2 than parent drug.',
            highYieldPearl: 'Ethacrynic acid-cysteine adduct is formed via Michael addition and is 2-3x MORE potent than parent drug.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 2, Question 21',
            sourcePageNumber: 2
          },
          {
            id: 322,
            questionNumberLabel: 'Question 22',
            title: 'Loop Diuretics True/False Statements',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'Consider the chemical and clinical properties of loop diuretics (Furosemide, Bumetanide, Torsemide, Ethacrynic acid) and state whether each statement is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'Loop diuretics promote calcium excretion, whereas thiazide diuretics decrease urinary calcium excretion (promote calcium reabsorption).',
                isCorrect: true,
                explanation: 'True: Loop diuretics inhibit NKCC2, abolishing the positive lumen-potential (+10 mV) that drives paracellular Ca2+ and Mg2+ reabsorption (hypercalciuria). Thiazides enhance DCT paracellular Ca2+ reabsorption (hypocalciuria).'
              },
              {
                id: 'b',
                text: 'Loop diuretics are high-ceiling diuretics because the thick ascending limb reabsorbs ~20-25% of filtered sodium load.',
                isCorrect: true,
                explanation: 'True: The TAL has massive sodium transport capacity (~25%), so blocking NKCC2 yields profound diuresis.'
              },
              {
                id: 'c',
                text: 'Furosemide is photosensitive and undergoes hydrolytic cleavage of the furylmethylamine bond under UV light.',
                isCorrect: true,
                explanation: 'True: Furosemide must be protected from light; UV exposure cleaves the furan-2-ylmethylamino moiety, producing free 4-chloro-5-sulfamoylanthranilic acid.'
              },
              {
                id: 'd',
                text: 'All loop diuretics cause hypokalemia, hypomagnesemia, and metabolic alkalosis.',
                isCorrect: true,
                explanation: 'True: Massive delivery of Na+ and fluid to the late DCT and collecting duct stimulates ENaC and aldosterone-driven K+ and H+ secretion, causing hypokalemic metabolic alkalosis and Mg2+ wasting.'
              },
              {
                id: 'e',
                text: 'All four loop diuretics can cause sulfa allergy.',
                isCorrect: false,
                explanation: 'False: Ethacrynic acid contains NO sulfonamide group and does not cross-react in sulfa-allergic patients.'
              }
            ],
            overallExplanation: 'Loop diuretics abolish the lumen-positive potential in the TAL, causing Ca2+ and Mg2+ wasting. Thiazides enhance Ca2+ reabsorption. Ethacrynic acid is sulfa-free.',
            highYieldPearl: 'Loop = Hypercalciuria (calcium wasting, treats severe hypercalcemia). Thiazide = Hypocalciuria (calcium retention, protects bone mineral density / prevents renal stones).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 2, Question 22',
            sourcePageNumber: 2
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 3: Potassium-Sparing Diuretics, ENaC Blockers & RAAS Modifiers (Questions 23 - 33)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 3,
    title: 'Potassium-Sparing Diuretics, Mineralocorticoid Antagonists & Combinations',
    subtitle: 'Triamterene, Amiloride, Spironolactone, Canrenone, Eplerenone, and Dyazide/Moduretic synergy',
    sections: [
      {
        sectionTitle: 'Cross-Class Comparison: Furosemide, HCTZ, Triamterene & Spironolactone',
        block_instructions: 'Consider structures I (Furosemide), II (Hydrochlorothiazide), III (Triamterene), and IV (Spironolactone) to answer questions 23-28.',
        structures: [
          DIURETICS_STRUCTURES.furosemide,
          DIURETICS_STRUCTURES.hydrochlorothiazide,
          DIURETICS_STRUCTURES.triamterene,
          DIURETICS_STRUCTURES.spironolactone
        ],
        questions: [
          {
            id: 323,
            questionNumberLabel: 'Question 23',
            title: 'Loop vs Thiazide Identification',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is a LOOP diuretic? Which is a THIAZIDE diuretic?',
            options: [
              'Loop: Drug I (Furosemide); Thiazide: Drug II (Hydrochlorothiazide)',
              'Loop: Drug II (Hydrochlorothiazide); Thiazide: Drug I (Furosemide)',
              'Loop: Drug III (Triamterene); Thiazide: Drug IV (Spironolactone)',
              'Loop: Drug IV (Spironolactone); Thiazide: Drug III (Triamterene)'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Furosemide is an anthranilic acid loop diuretic; HCTZ is a benzothiadiazine thiazide diuretic.',
              'Incorrect.',
              'Incorrect: Triamterene and Spironolactone are potassium-sparing diuretics.',
              'Incorrect.'
            ],
            overallExplanation: 'Furosemide is an anthranilic acid loop diuretic; HCTZ is a benzothiadiazine thiazide diuretic.',
            highYieldPearl: 'Furosemide = Loop; HCTZ = Thiazide; Triamterene = ENaC blocker; Spironolactone = MR antagonist.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 23',
            sourcePageNumber: 3
          },
          {
            id: 324,
            questionNumberLabel: 'Question 24',
            title: 'Potassium-Sparing Diuretic Identification',
            category: 'Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs are POTASSIUM-SPARING diuretics?',
            options: [
              'Drugs III (Triamterene) and IV (Spironolactone)',
              'Drugs I (Furosemide) and II (Hydrochlorothiazide)',
              'Only Drug I',
              'Only Drug II'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Triamterene (pteridine ENaC blocker) and Spironolactone (mineralocorticoid receptor antagonist) are potassium-sparing diuretics.',
              'Incorrect: Loop and thiazides are potassium-wasting.',
              'Incorrect.',
              'Incorrect.'
            ],
            overallExplanation: 'Drugs acting at the late DCT and collecting duct (ENaC blockers, aldosterone antagonists) do not stimulate K+ excretion and are therefore potassium-sparing.',
            highYieldPearl: 'K-sparing agents prevent hypokalemia induced by loop and thiazide diuretics.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 24',
            sourcePageNumber: 3
          },
          {
            id: 325,
            questionNumberLabel: 'Question 25',
            title: 'Receptor Antagonist vs Transporter Blocker',
            category: 'Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is an INTRACELLULAR RECEPTOR ANTAGONIST? Which is a direct ION CHANNEL BLOCKER?',
            options: [
              'Receptor antagonist: Drug IV (Spironolactone); Ion channel blocker: Drug III (Triamterene)',
              'Receptor antagonist: Drug III (Triamterene); Ion channel blocker: Drug IV (Spironolactone)',
              'Both are receptor antagonists',
              'Both are ion channel blockers'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Spironolactone competitively blocks the intracellular mineralocorticoid receptor (MR) in the cytoplasm of principal cells. Triamterene directly plugs the pore of the apical epithelial sodium channel (ENaC).',
              'Incorrect: Inverted mechanisms.',
              'Incorrect: Triamterene is not a nuclear receptor antagonist.',
              'Incorrect: Spironolactone is an MR antagonist, not a channel blocker.'
            ],
            overallExplanation: 'Spironolactone binds the cytoplasmic mineralocorticoid receptor to prevent aldosterone-induced transcription of ENaC and Na+/K+-ATPase. Triamterene directly blocks the ENaC channel pore without requiring gene transcription.',
            highYieldPearl: 'Spironolactone = Mineralocorticoid receptor antagonist (slow onset, genomic). Triamterene/Amiloride = direct ENaC channel blockers (fast onset, non-genomic).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 25',
            sourcePageNumber: 3
          },
          {
            id: 326,
            questionNumberLabel: 'Question 26',
            title: 'Ranking Diuretic Efficacy (% Fractional Sodium Excretion)',
            category: 'Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Rank the four drug classes from HIGHEST to LOWEST maximal diuretic efficacy (% filtered Na+ excreted):',
            options: [
              'I (Furosemide, ~20-25%) > II (HCTZ, ~5%) > III (Triamterene, ~2%) = IV (Spironolactone, ~2%)',
              'IV > III > II > I',
              'II > I > III > IV',
              'I > III > II > IV'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Loop diuretics inhibit TAL (~25% Na load), Thiazides inhibit DCT (~5% Na load), and K-sparing agents inhibit collecting duct (~2% Na load).',
              'Incorrect: Inverted.',
              'Incorrect: Loop diuretics have far higher efficacy than thiazides.',
              'Incorrect: Thiazides exceed K-sparing agents.'
            ],
            overallExplanation: 'Efficacy corresponds directly to the anatomical segment of the nephron: TAL (~25%) > DCT (~5%) > Collecting Tubule (~2%).',
            highYieldPearl: 'Maximal Diuretic Efficacy: Loop (~25%) >> Thiazide (~5%) > K-Sparing (ENaC/Aldosterone, ~2%).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 26',
            sourcePageNumber: 3
          },
          {
            id: 327,
            questionNumberLabel: 'Question 27',
            title: 'Drugs Causing Hyperkalemia vs Hypokalemia',
            category: 'Clinical Applications',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs carry a significant risk of causing HYPERKALEMIA, especially in renal insufficiency or with ACEIs/ARBs?',
            options: [
              'Drugs III (Triamterene) and IV (Spironolactone)',
              'Drugs I (Furosemide) and II (Hydrochlorothiazide)',
              'Only Drug I',
              'All four drugs cause hyperkalemia'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Potassium-sparing diuretics (Triamterene, Spironolactone) block luminal Na+ entry, abolishing the lumen-negative transepithelial potential and preventing K+ secretion, risking life-threatening hyperkalemia.',
              'Incorrect: Furosemide and HCTZ cause hypokalemia.',
              'Incorrect: Furosemide causes potassium wasting.',
              'Incorrect: Loop and thiazides cause hypokalemia.'
            ],
            overallExplanation: 'Loop and thiazide diuretics cause hypokalemia via increased distal Na+ delivery and aldosterone stimulation. K-sparing diuretics prevent K+ secretion and cause hyperkalemia.',
            highYieldPearl: 'Hyperkalemia risk: Spironolactone, Eplerenone, Triamterene, Amiloride. Black box warning: avoid combining K-sparing agents with potassium supplements or in severe renal dysfunction.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 27',
            sourcePageNumber: 3
          },
          {
            id: 328,
            questionNumberLabel: 'Question 28',
            title: 'Endocrine Side Effects of Spironolactone (Gynecomastia)',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Drug IV (Spironolactone) is associated with painful gynecomastia, menstrual irregularities, and decreased libido in men. What structural feature and pharmacological promiscuity causes this?',
            options: [
              'Steroid core that non-selectively binds to and antagonizes androgen receptors and progesterone receptors',
              'The 7-alpha-acetylthio group hydrolyzes to toxic cyanide',
              'The gamma-lactone ring alkylates estrogen receptors',
              'The 3-keto group inhibits aromatase'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Spironolactone has a steroid nucleus that cross-reacts with androgen receptors (as an antagonist) and progesterone receptors (as an agonist), causing anti-androgenic side effects including painful gynecomastia (~10% incidence).',
              'Incorrect: No cyanide is formed.',
              'Incorrect: Lactone does not alkylate estrogen receptors.',
              'Incorrect: Spironolactone does not inhibit aromatase.'
            ],
            overallExplanation: 'Spironolactone is non-selective for mineralocorticoid receptors and exhibits antiandrogenic and progestational activity. Eplerenone was designed with a 9,11-epoxy bridge to eliminate sex hormone receptor cross-reactivity.',
            highYieldPearl: 'Spironolactone = gynecomastia / impotence via non-selective androgen receptor antagonism. Eplerenone = selective aldosterone blocker with 9,11-epoxide, avoiding gynecomastia.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 28',
            sourcePageNumber: 3
          }
        ]
      },
      {
        sectionTitle: 'Mineralocorticoid Antagonists SAR: Spironolactone, Canrenone & Eplerenone',
        block_instructions: 'Consider structures I (Spironolactone), II (Canrenone), and III (Eplerenone) to answer questions 29-31.',
        structures: [
          DIURETICS_STRUCTURES.spironolactone,
          DIURETICS_STRUCTURES.canrenone,
          DIURETICS_STRUCTURES.eplerenone
        ],
        questions: [
          {
            id: 329,
            questionNumberLabel: 'Question 29',
            title: 'Active Metabolite of Spironolactone',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Drug II (Canrenone) is the major active metabolite of Drug I (Spironolactone). How is Canrenone formed metabolically?',
            options: [
              'Detioacetylation (loss of the 7-alpha-acetylthio group) followed by formation of a 4,6-dien-3-one system',
              'Hydrolysis of the gamma-lactone ring',
              'Aromatization of the A ring into an estrogen',
              'Epoxidation across the 9,11 position'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Spironolactone undergoes rapid hepatic dethioacetylation to produce canrenone (accounting for ~70% of spironolactone\'s chronic in vivo antimineralocorticoid activity), which has a long elimination half-life of 16-20 hours.',
              'Incorrect: Lactone hydrolysis yields canrenoic acid.',
              'Incorrect: A ring is not aromatized.',
              'Incorrect: Epoxidation at 9,11 is the synthetic route to eplerenone, not a spironolactone metabolite.'
            ],
            overallExplanation: 'Spironolactone is rapidly metabolized (half-life ~1.5 hours) by dethioacetylation to canrenone, its major active circulating metabolite (half-life 16-20 hours).',
            highYieldPearl: 'Canrenone is the major active metabolite of Spironolactone (half-life 16-20h), formed by dethioacetylation.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 4, Question 29',
            sourcePageNumber: 4
          },
          {
            id: 330,
            questionNumberLabel: 'Question 30',
            title: 'Structural Design of Eplerenone to Prevent Gynecomastia',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Drug III (Eplerenone) is a second-generation selective aldosterone receptor antagonist (SARA). What key structural modification confers high selectivity for the mineralocorticoid receptor over androgen/progesterone receptors?',
            options: [
              'A 9,11-alpha-epoxy bridge and a 7-alpha-methoxycarbonyl group',
              'Removal of the 17-spiro-lactone ring',
              'Substitution of an isopropyl group at C3',
              'Introduction of a fluorine atom at C6'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: The 9,11-alpha-epoxy ring drastically reduces affinity for androgen and progesterone receptors (>1000-fold less potent at sex hormone receptors than spironolactone) while maintaining high affinity for MR.',
              'Incorrect: Eplerenone retains the 17-spiro-lactone ring.',
              'Incorrect: There is no C3 isopropyl.',
              'Incorrect: No C6 fluorine is present.'
            ],
            overallExplanation: 'The 9,11-epoxy bridge and 7-ester in eplerenone eliminate binding to androgen and progesterone receptors, virtually eliminating gynecomastia and sexual dysfunction.',
            highYieldPearl: 'Eplerenone = 9,11-epoxy bridge + 7-methoxycarbonyl -> highly selective MR antagonist; NO gynecomastia or menstrual side effects.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 4, Question 30',
            sourcePageNumber: 4
          },
          {
            id: 331,
            questionNumberLabel: 'Question 31',
            title: 'Metabolism of Eplerenone vs Spironolactone',
            category: 'Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the following statements correctly describes the metabolism and drug interaction profile of Eplerenone (III)?',
            options: [
              'Eplerenone is primarily metabolized by CYP3A4 into inactive metabolites and is contraindicated with strong CYP3A4 inhibitors (ketoconazole, clarithromycin)',
              'Eplerenone is excreted 100% unchanged in the urine without hepatic metabolism',
              'Eplerenone is metabolized by COMT',
              'Eplerenone forms active dithioacetyl metabolites'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Eplerenone is extensively metabolized by hepatic CYP3A4 to inactive open-lactone and hydroxylated metabolites. Strong CYP3A4 inhibitors dramatically increase eplerenone plasma levels and hyperkalemia risk.',
              'Incorrect: Eplerenone is <5% unchanged renally.',
              'Incorrect: Eplerenone does not contain catechol groups.',
              'Incorrect: Eplerenone has no sulfur atom.'
            ],
            overallExplanation: 'Unlike spironolactone (dethioacetylation), eplerenone depends entirely on CYP3A4 for clearance; co-administration with strong CYP3A4 inhibitors is contraindicated due to severe hyperkalemia.',
            highYieldPearl: 'Eplerenone is cleared by CYP3A4 -> contraindicated with strong CYP3A4 inhibitors (ketoconazole, itraconazole, clarithromycin).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 4, Question 31',
            sourcePageNumber: 4
          }
        ]
      },
      {
        sectionTitle: 'Rational Diuretic Combinations: Dyazide & Moduretic',
        block_instructions: 'Consider Drug I (Amiloride, aminopyrazine ENaC blocker) and Drug II (Hydrochlorothiazide, thiazide) to answer questions 32-33.',
        structures: [
          DIURETICS_STRUCTURES.amiloride,
          DIURETICS_STRUCTURES.hydrochlorothiazide
        ],
        questions: [
          {
            id: 332,
            questionNumberLabel: 'Question 32',
            title: 'Chemical Class and Charge of Amiloride vs HCTZ',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following correctly pairs the chemical class and physiological charge of Amiloride (I) and Hydrochlorothiazide (II)?',
            options: [
              'Drug I is an acylguanidine aminopyrazine (basic, positively charged cation at pH 7.4); Drug II is a benzothiadiazine dioxide (weakly acidic, partially ionized anion at pH 7.4)',
              'Drug I is acidic; Drug II is basic',
              'Both are strongly acidic anions',
              'Both are quaternary ammonium salts'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Amiloride contains a pyrazinoylguanidine moiety with a basic guanidinium group (pKa 8.7) that is protonated and positively charged at physiological pH, allowing it to plug the negatively charged pore of ENaC. HCTZ has acidic sulfonamide protons (pKa 7.9 and 9.2).',
              'Incorrect: Amiloride is basic; HCTZ is acidic.',
              'Incorrect: Amiloride is a basic cation.',
              'Incorrect: Neither is a quaternary ammonium.'
            ],
            overallExplanation: 'Amiloride\'s basic acylguanidine (pKa 8.7) is positively charged at physiological pH, mimicking hydrated Na+ ions to block the outer vestibule of the ENaC pore. HCTZ is weakly acidic.',
            highYieldPearl: 'Amiloride = basic acylguanidine (positively charged cation at pH 7.4). Directly plugs the ENaC channel pore in the collecting duct.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 5, Question 32',
            sourcePageNumber: 5
          },
          {
            id: 333,
            questionNumberLabel: 'Question 33',
            title: 'Dyazide / Moduretic True/False Statements',
            category: 'Clinical Applications',
            type: 'sub-statements',
            questionStem: 'Consider the combination of Drug I (Amiloride or Triamterene) and Drug II (Hydrochlorothiazide) as in Moduretic or Dyazide, and state whether each statement is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'Both drugs act at the same nephron site.',
                isCorrect: false,
                explanation: 'False: Drug I (Amiloride/Triamterene) acts in the cortical collecting tubule (ENaC), whereas Drug II (HCTZ) acts in the distal convoluted tubule (NCC).'
              },
              {
                id: 'b',
                text: 'Both inhibit NaCl reabsorption at the collecting duct.',
                isCorrect: false,
                explanation: 'False: HCTZ acts in the distal convoluted tubule, not the collecting duct.'
              },
              {
                id: 'c',
                text: 'Drug I is a basic molecule, whereas Drug II is an acidic molecule.',
                isCorrect: true,
                explanation: 'True: Amiloride/triamterene are basic cations; HCTZ is a weakly acidic sulfonamide.'
              },
              {
                id: 'd',
                text: 'Both can be used to treat hypertension.',
                isCorrect: true,
                explanation: 'True: Thiazides are first-line for HTN; K-sparing agents are co-administered for synergistic BP reduction and K+ balance.'
              },
              {
                id: 'e',
                text: 'Drug II is a more effective diuretic than Drug I.',
                isCorrect: true,
                explanation: 'True: HCTZ promotes ~5% Na+ excretion compared to ~1-2% for ENaC blockers.'
              },
              {
                id: 'f',
                text: 'The two drugs can be combined to adjust for potassium ion loss.',
                isCorrect: true,
                explanation: 'True: Dyazide / Maxzide (Triamterene + HCTZ) and Moduretic (Amiloride + HCTZ) are standard fixed-dose combinations.'
              },
              {
                id: 'g',
                text: 'Only Drug II is associated with the risk of sulfa hypersensitivity reactions.',
                isCorrect: true,
                explanation: 'True: HCTZ contains two sulfonamide groups and can trigger sulfa allergy; amiloride and triamterene lack sulfonamide groups.'
              }
            ],
            overallExplanation: 'HCTZ (acidic, sulfa, DCT, ~5% efficacy) and Triamterene/Amiloride (basic, non-sulfa, collecting duct, ~2% efficacy) are rationally paired in fixed-dose combinations to maintain normokalemia.',
            highYieldPearl: 'Dyazide / Moduretic: Thiazide (HCTZ: acidic, sulfa, K-wasting) + K-sparing (basic, non-sulfa, K-saving) = optimal synergy and normokalemia.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 5, Question 33',
            sourcePageNumber: 5
          }
        ]
      }
    ]
  }
];

export function getDefaultDiureticsModule(): ReviewModule {
  return {
    id: 'antihypertensives_1_mcp2',
    examId: 'exam_2',
    examTitle: 'Exam 2: Antihypertensives & Lipids',
    title: 'Antihypertensive Agents I: Diuretics',
    subtitle: 'Thiazides, Loop Diuretics, Potassium-Sparing Diuretics, and Carbonic Anhydrase Inhibitors',
    course: 'Medicinal Chemistry & Pharmacology II',
    semester: 'Spring',
    code: 'MCP-2-03',
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    chemicalStructures: Object.values(DIURETICS_STRUCTURES),
    pages: diureticsPages,
  };
}
