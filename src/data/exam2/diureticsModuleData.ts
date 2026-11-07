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
        block_instructions: 'Consider chemical Structures I - IV to answer questions 3-9. Focus on modifications at the 3,4-double bond, position-3 substituent, and position-2 nitrogen.',
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
            questionStem: 'Which of the following best describes the chemical class of Structures I - IV?',
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
            questionStem: 'What is the mechanistic class of Structures I - IV?',
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
              'Most potent: Structure IV; Least potent: Structure I',
              'Most potent: Structure I; Least potent: Structure IV',
              'Most potent: Structure II; Least potent: Structure III',
              'Most potent: Structure III; Least potent: Structure I'
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
              'Longest: Structure IV; Shortest: Structure I & Structure II',
              'Longest: Structure I; Shortest: Structure IV',
              'Longest: Structure II; Shortest: Structure III',
              'Longest: Structure III; Shortest: Structure II'
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
              'Structure IV > Structure III > Structure II > Structure I',
              'Structure I > Structure II > Structure III > Structure IV',
              'Structure II > Structure IV > Structure III > Structure I',
              'Structure III > Structure IV > Structure II > Structure I'
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
              'Structure I <= Structure II < Structure III < Structure IV',
              'Structure IV < Structure III < Structure II < Structure I',
              'Structure II < Structure I < Structure IV < Structure III',
              'Structure I < Structure IV < Structure II < Structure III'
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
            questionStem: 'Consider chemical Structures I - IV to determine whether each statement is true or false:',
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
  // PAGE 2: Thiazide-like Diuretics & High-Ceiling Loop Intro (Questions 1 - 4)
  // Source: Dr. Rami A. Al-Horani Review for Antihypertensive Drugs I, Page 2 (Q10 - Q13)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 2,
    title: 'Thiazide-like Diuretics & Loop Diuretics Introduction',
    subtitle: 'Metolazone, Chlorthalidone, Diazoxide, and Aminobenzoic Acid Loop Diuretic Pharmacophores',
    sections: [
      {
        sectionTitle: 'Thiazide-Like Agents: Metolazone vs Chlorthalidone & Diazoxide',
        block_instructions: 'Consider chemical structures I (Metolazone), II (Chlorthalidone), and Diazoxide to answer questions 1-2. Note differences in ring system, sulfonamide placement, and diuretic efficacy.',
        structures: [
          DIURETICS_STRUCTURES.metolazone,
          DIURETICS_STRUCTURES.chlorthalidone,
          DIURETICS_STRUCTURES.diazoxide
        ],
        questions: [
          {
            id: 310,
            questionNumberLabel: 'Question 1',
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
            questionNumberLabel: 'Question 2',
            title: 'Molecules Lacking Substantial Diuretic Activity',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following molecules lacks substantial diuretic activity?',
            options: [
              'Diazoxide',
              'Chlorothiazide',
              'Hydrochlorothiazide',
              'Metolazone'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Diazoxide retains the benzothiadiazine ring but lacks the essential unsubstituted 7-sulfonamide group (-SO2NH2). It has NO diuretic activity and is instead an ATP-sensitive K+ channel (K_ATP) opener that causes vasodilation and hyperglycemic insulin inhibition.',
              'Incorrect: Chlorothiazide is a potent diuretic.',
              'Incorrect: Hydrochlorothiazide is a potent diuretic.',
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
        sectionTitle: 'High-Ceiling Loop Diuretics: Prototype Chemical & Mechanistic Classification',
        block_instructions: 'Consider chemical structures I (Furosemide) and II (Bumetanide) to answer questions 3-4.',
        structures: [
          DIURETICS_STRUCTURES.furosemide,
          DIURETICS_STRUCTURES.bumetanide
        ],
        questions: [
          {
            id: 312,
            questionNumberLabel: 'Question 3',
            title: 'Chemical Class of Molecules I and II',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following best describes the chemical class of Molecules I and II?',
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
            questionNumberLabel: 'Question 4',
            title: 'Mechanistic Class of High-Ceiling Diuretics',
            category: 'Pharmacology',
            type: 'multiple-choice',
            questionStem: 'What is the mechanistic class of the above drugs?',
            options: [
              'Loop diuretics (Inhibition of Na+/K+/2Cl- symporter NKCC2 in thick ascending limb of Henle)',
              'Potassium-sparing agents',
              'Thiazide diuretics',
              'Calcium channel blockers',
              'Beta-blockers',
              'Angiotensin-converting enzyme inhibitors'
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
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 3: High-Ceiling Loop Diuretics SAR & Landmark Properties (Questions 1 - 9)
  // Source: Dr. Rami A. Al-Horani Review for Antihypertensive Drugs I, Page 3 (Q14 - Q22)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 3,
    title: 'High-Ceiling Loop Diuretics SAR & Landmark Properties',
    subtitle: 'Furosemide, Bumetanide, Torsemide, and Ethacrynic Acid: Potency, Duration, Ototoxicity & Sulfa Allergy',
    sections: [
      {
        sectionTitle: 'Loop Diuretics SAR: Furosemide, Bumetanide, Torsemide & Ethacrynic Acid',
        block_instructions: 'Consider chemical structures I (Furosemide), II (Bumetanide), III (Torsemide), and IV (Ethacrynic acid) to answer questions 1-9.',
        structures: [
          DIURETICS_STRUCTURES.furosemide,
          DIURETICS_STRUCTURES.bumetanide,
          DIURETICS_STRUCTURES.torsemide,
          DIURETICS_STRUCTURES.ethacrynic_acid
        ],
        questions: [
          {
            id: 314,
            questionNumberLabel: 'Question 1',
            title: 'High-Ceiling Loop Diuretics Landmark Properties Matching',
            category: 'Medicinal Chemistry SAR',
            type: 'matching',
            prompt: 'Drag each chemical structure (Structure I - Structure IV) to its matching medicinal chemistry or clinical pharmacology property:',
            options: ['Structure I', 'Structure II', 'Structure III', 'Structure IV'],
            matchingTargets: [
              {
                id: 'target_bumetanide_potency',
                label: 'Most potent loop diuretic congener (~40x furosemide)',
                acceptedStructureIds: ['Structure II', 'II', 'bumetanide'],
                rationale: 'Structure II (Bumetanide) replaces the 4-chloro of furosemide with a 4-phenoxy group and positions a 5-butylamino chain, conferring ~40-fold greater molar potency at NKCC2.'
              },
              {
                id: 'target_torsemide_duration',
                label: 'Sulfonylurea congener with longest duration of action and negligible ototoxicity',
                acceptedStructureIds: ['Structure III', 'III', 'torsemide'],
                rationale: 'Structure III (Torsemide) is a pyridine-sulfonylurea loop diuretic with prolonged receptor occupancy (~6-8 hour duration) and negligible risk of ototoxicity.'
              },
              {
                id: 'target_ethacrynic_sulfa',
                label: 'Phenoxyacetic acid derivative / Michael acceptor lacking a sulfonamide group (safe in severe sulfa allergy)',
                acceptedStructureIds: ['Structure IV', 'IV', 'ethacrynic_acid'],
                rationale: 'Structure IV (Ethacrynic acid) is a dichloro-phenoxyacetic acid derivative lacking a sulfonamide moiety, making it the only loop diuretic safe in true sulfa anaphylaxis.'
              },
              {
                id: 'target_furosemide_amphoteric',
                label: 'Amphoteric anthranilic acid prototype bearing both a carboxylic acid and secondary amine',
                acceptedStructureIds: ['Structure I', 'I', 'furosemide'],
                rationale: 'Structure I (Furosemide) is an anthranilic acid (2-aminobenzoic acid) with both an acidic carboxylate/sulfonamide and basic secondary amine, rendering it amphoteric.'
              },
              {
                id: 'target_ethacrynic_ototox',
                label: 'Irreversible alkylating diuretic associated with highest risk of permanent ototoxicity',
                acceptedStructureIds: ['Structure IV', 'IV', 'ethacrynic_acid'],
                rationale: 'Structure IV (Ethacrynic acid) contains an electrophilic alpha,beta-unsaturated ketone that covalently alkylates inner ear hair cell sulfhydryl groups, causing permanent sensorineural hearing loss.'
              }
            ],
            matchingPairs: [
              {
                id: 'target_bumetanide_potency',
                label: 'Most potent loop diuretic congener (~40x furosemide)',
                acceptedStructureIds: ['Structure II', 'II', 'bumetanide'],
                rationale: 'Structure II (Bumetanide) replaces the 4-chloro of furosemide with a 4-phenoxy group and positions a 5-butylamino chain, conferring ~40-fold greater molar potency at NKCC2.'
              },
              {
                id: 'target_torsemide_duration',
                label: 'Sulfonylurea congener with longest duration of action and negligible ototoxicity',
                acceptedStructureIds: ['Structure III', 'III', 'torsemide'],
                rationale: 'Structure III (Torsemide) is a pyridine-sulfonylurea loop diuretic with prolonged receptor occupancy (~6-8 hour duration) and negligible risk of ototoxicity.'
              },
              {
                id: 'target_ethacrynic_sulfa',
                label: 'Phenoxyacetic acid derivative / Michael acceptor lacking a sulfonamide group (safe in severe sulfa allergy)',
                acceptedStructureIds: ['Structure IV', 'IV', 'ethacrynic_acid'],
                rationale: 'Structure IV (Ethacrynic acid) is a dichloro-phenoxyacetic acid derivative lacking a sulfonamide moiety, making it the only loop diuretic safe in true sulfa anaphylaxis.'
              },
              {
                id: 'target_furosemide_amphoteric',
                label: 'Amphoteric anthranilic acid prototype bearing both a carboxylic acid and secondary amine',
                acceptedStructureIds: ['Structure I', 'I', 'furosemide'],
                rationale: 'Structure I (Furosemide) is an anthranilic acid (2-aminobenzoic acid) with both an acidic carboxylate/sulfonamide and basic secondary amine, rendering it amphoteric.'
              },
              {
                id: 'target_ethacrynic_ototox',
                label: 'Irreversible alkylating diuretic associated with highest risk of permanent ototoxicity',
                acceptedStructureIds: ['Structure IV', 'IV', 'ethacrynic_acid'],
                rationale: 'Structure IV (Ethacrynic acid) contains an electrophilic alpha,beta-unsaturated ketone that covalently alkylates inner ear hair cell sulfhydryl groups, causing permanent sensorineural hearing loss.'
              }
            ],
            overallExplanation: 'Loop diuretics block the luminal NKCC2 symporter in the thick ascending limb of Henle. Structure II (Bumetanide) is the most potent (~40x), Structure III (Torsemide) has the longest duration, Structure IV (Ethacrynic acid) is sulfa-safe but carries the highest permanent ototoxicity risk, and Structure I (Furosemide) is the amphoteric prototype.',
            highYieldPearl: 'Potency: Bumetanide (~40x) > Torsemide (~2-3x) > Furosemide (1x). Sulfa allergy: Ethacrynic acid is safe. Ototoxicity: Ethacrynic acid (highest, irreversible) >> Furosemide > Torsemide > Bumetanide (lowest).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 14-20',
            sourcePageNumber: 3
          },
          {
            id: 315,
            questionNumberLabel: 'Question 2',
            title: 'Potency Comparison: Structure I vs Structure II',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following correctly compares the diuretic potency of Structure I versus Structure II?',
            options: [
              'Structure II is ~40-fold more potent than Structure I',
              'Structure I is ~40-fold more potent than Structure II',
              'Both have identical molar potency (1:1 equivalence)',
              'Structure II is ~2-fold less potent than Structure I'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure II (Bumetanide) is ~40 times more potent than Structure I (Furosemide) on a milligram-for-milligram basis (1 mg bumetanide ~ 40 mg oral furosemide).',
              'Incorrect: Structure II is far more potent than Structure I.',
              'Incorrect: 1 mg bumetanide is equivalent to 40 mg furosemide.',
              'Incorrect: Structure II is 40x more potent, not less potent.'
            ],
            overallExplanation: 'Replacing the 4-chloro of furosemide with a 4-phenoxy group and shifting the amino group to position 5 with a butyl chain in bumetanide dramatically increases affinity for the NKCC2 transporter, yielding a 40-fold potency gain.',
            highYieldPearl: 'Bumetanide is 40x more potent than Furosemide (1 mg bumetanide = 40 mg oral furosemide = 20 mg torsemide = 50 mg ethacrynic acid).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 14',
            sourcePageNumber: 3
          },
          {
            id: 316,
            questionNumberLabel: 'Question 3',
            title: 'Diuretic Potency Ranking of Loop Diuretics',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Rank chemical Structures I - III according to their diuretic potency on a milligram-for-milligram basis (most potent to weakest):',
            options: [
              'Structure II > Structure III > Structure I',
              'Structure I > Structure II > Structure III',
              'Structure III > Structure II > Structure I',
              'Structure I > Structure III > Structure II'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure II (Bumetanide, 1 mg dose) > Structure III (Torsemide, 20 mg dose) > Structure I (Furosemide, 40 mg oral dose).',
              'Incorrect: Structure II is the most potent loop congener.',
              'Incorrect: Structure II is approximately 20-fold more potent than Structure III.',
              'Incorrect: Structure I is the least potent on a milligram basis among these three.'
            ],
            overallExplanation: 'Potency ranking by equivalent oral dose: Bumetanide (1 mg, ~40x) > Torsemide (20 mg, ~2x) > Furosemide (40 mg, 1x). Ethacrynic acid is ~50 mg (~0.8x).',
            highYieldPearl: 'Loop Diuretic Potency: Bumetanide (40x) > Torsemide (2x) > Furosemide (1x). Clinical conversion rule: 1 mg bumetanide = 20 mg torsemide = 40 mg oral furosemide.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 16',
            sourcePageNumber: 3
          },
          {
            id: 317,
            questionNumberLabel: 'Question 4',
            title: 'Loop Diuretic with Longest Duration of Action',
            category: 'Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the chemical structures (Structures I - IV) has the LONGEST duration of action and longest elimination half-life?',
            options: [
              'Structure III',
              'Structure I',
              'Structure II',
              'Structure IV'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure III (Torsemide) has an elimination half-life of 3-4 hours and a duration of action of 6-8 hours, providing smoother diuresis with once-daily dosing.',
              'Incorrect: Structure I (Furosemide) has a shorter half-life (~1.5 hours) and 4-6 hour duration.',
              'Incorrect: Structure II (Bumetanide) has the shortest half-life (~1 hour).',
              'Incorrect: Structure IV (Ethacrynic acid) has a short half-life (~1 hour).'
            ],
            overallExplanation: 'Torsemide is a sulfonylurea-containing loop diuretic with prolonged receptor occupancy and hepatic metabolism (CYP2C9), giving it the longest half-life and duration among standard loop diuretics.',
            highYieldPearl: 'Torsemide has the longest half-life (3-4h) and duration of action among loop diuretics, yielding less rebound sodium retention.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 15',
            sourcePageNumber: 3
          },
          {
            id: 318,
            questionNumberLabel: 'Question 5',
            title: 'Irreversible Michael Acceptor Diuretic',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs (Structures I - IV) acts as an irreversible diuretic by functioning as an electrophilic Michael acceptor?',
            options: [
              'Structure IV',
              'Structure I',
              'Structure II',
              'Structure III'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure IV (Ethacrynic acid) contains an electrophilic alpha,beta-unsaturated ketone (2-methylenebutyryl group) that undergoes Michael addition with nucleophilic sulfhydryl (-SH) groups on renal transport proteins.',
              'Incorrect: Structure I (Furosemide) binds reversibly.',
              'Incorrect: Structure II (Bumetanide) binds reversibly.',
              'Incorrect: Structure III (Torsemide) binds reversibly.'
            ],
            overallExplanation: 'The terminal =CH2 of the alpha,beta-unsaturated acyl group in ethacrynic acid acts as an electrophilic Michael acceptor, forming covalent thiol adducts with renal NKCC2 proteins.',
            highYieldPearl: 'Ethacrynic acid = Michael acceptor (alpha,beta-unsaturated ketone). Covalently reacts with sulfhydryl (-SH) groups of cysteine and glutathione.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 18',
            sourcePageNumber: 3
          },
          {
            id: 319,
            questionNumberLabel: 'Question 6',
            title: 'Loop Diuretic for Patients with Severe Sulfa Allergy',
            category: 'Clinical Applications',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs (Structures I - IV) lacks a sulfonamide moiety and can be safely administered to a patient with a severe, life-threatening sulfa allergy?',
            options: [
              'Structure IV',
              'Structure I',
              'Structure II',
              'Structure III'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure IV (Ethacrynic acid) is a phenoxyacetic acid derivative completely lacking a sulfonamide group, making it the only loop diuretic safe in true sulfa allergy.',
              'Incorrect: Structure I (Furosemide) possesses a sulfonamide group and cross-reacts.',
              'Incorrect: Structure II (Bumetanide) possesses a sulfonamide group and cross-reacts.',
              'Incorrect: Structure III (Torsemide) possesses a sulfonylurea/sulfonamide moiety and cross-reacts.'
            ],
            overallExplanation: 'Furosemide, bumetanide, and torsemide are all sulfonamides and cross-react in patients with severe sulfa allergy. Ethacrynic acid is a phenoxyacetic acid derivative with NO sulfonamide group.',
            highYieldPearl: 'Ethacrynic acid is the ONLY loop diuretic without a sulfonamide group. It is the drug of choice for severe edema in patients with documented sulfa anaphylaxis.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 19',
            sourcePageNumber: 3
          },
          {
            id: 320,
            questionNumberLabel: 'Question 7',
            title: 'Highest Ototoxicity Risk Among Loop Diuretics',
            category: 'Clinical Applications',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs (Structures I - IV) carries the HIGHEST risk of permanent, irreversible ototoxicity?',
            options: [
              'Structure IV',
              'Structure I',
              'Structure II',
              'Structure III'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure IV (Ethacrynic acid) carries the highest risk of ototoxicity, which is frequently permanent, because its electrophilic alpha,beta-unsaturated carbonyl reacts covalently with sulfhydryl groups in inner ear hair cells.',
              'Incorrect: Structure I causes dose-dependent ototoxicity, but it is typically reversible.',
              'Incorrect: Structure II (Bumetanide) has the lowest ototoxicity risk among loop diuretics.',
              'Incorrect: Structure III (Torsemide) has minimal ototoxicity.'
            ],
            overallExplanation: 'Ethacrynic acid causes significantly higher rates of permanent sensorineural hearing loss than sulfonamide loop diuretics due to covalent hair-cell alkylation. Bumetanide has the lowest risk of ototoxicity.',
            highYieldPearl: 'Ototoxicity risk: Ethacrynic acid (highest, often irreversible) >> Furosemide (reversible) > Torsemide > Bumetanide (lowest ototoxicity).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 17',
            sourcePageNumber: 3
          },
          {
            id: 321,
            questionNumberLabel: 'Question 8',
            title: 'Loop Diuretics True/False Battery',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'Consider the chemical and clinical properties of loop diuretics (Structures I - IV) and state whether each statement is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'The above diuretics inhibit the NaCl reabsorption at the ascending limb of the loop of Henle.',
                isCorrect: true,
                explanation: 'True: All loop diuretics selectively block the luminal Na+/K+/2Cl- (NKCC2) cotransporter in the thick ascending limb of the loop of Henle.'
              },
              {
                id: 'b',
                text: 'All of the above drugs possess acidic characteristics.',
                isCorrect: true,
                explanation: 'True: Furosemide, bumetanide, and ethacrynic acid possess free carboxylic acids (pKa ~3-4), and torsemide possesses an acidic sulfonylurea proton (pKa ~6.4). All four are acidic.'
              },
              {
                id: 'c',
                text: 'The above drugs are extensively metabolized by the liver.',
                isCorrect: false,
                explanation: 'False: Furosemide and Bumetanide are predominantly eliminated unchanged by renal excretion (>60-80%); only Torsemide undergoes extensive hepatic metabolism (~80% by CYP2C9).'
              },
              {
                id: 'd',
                text: 'The above drugs are the least effective among all diuretics.',
                isCorrect: false,
                explanation: 'False: Loop diuretics are "high-ceiling" diuretics, the MOST effective among all diuretic classes, capable of excreting 20-25% of filtered sodium load.'
              },
              {
                id: 'e',
                text: 'The above diuretics have a relatively fast onset of action given their strong acidic characteristics.',
                isCorrect: true,
                explanation: 'True: Their acidic carboxylate/sulfonamide functional groups facilitate rapid active secretion into the tubular lumen via proximal tubular Organic Anion Transporters (OAT1/OAT3), resulting in a rapid onset of diuresis (~30 min PO, ~5 min IV).'
              }
            ],
            overallExplanation: 'Loop diuretics block NKCC2 in the thick ascending limb of Henle (~25% fractional Na+ excretion), are acidic molecules actively secreted by OATs with rapid onset, and are the most efficacious diuretics available.',
            highYieldPearl: 'Loop Diuretics: High-ceiling (~25% Na excretion), acidic (OAT secretion, rapid onset), NKCC2 blockade in TAL. Torsemide = hepatic; Furosemide/Bumetanide = renal elimination.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 21',
            sourcePageNumber: 3
          },
          {
            id: 322,
            questionNumberLabel: 'Question 9',
            title: 'Simplest Structural Form of Loop Diuretics',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following structures represents one of the simplest forms of loop diuretics?',
            options: [
              '5-Sulfamoyl-2-aminobenzoic acid (5-sulfamoylanthranilic acid core)',
              '6-Chloro-7-sulfamoylbenzothiadiazine',
              '4-Chloro-3-sulfamoylpyridine',
              '2-Methyl-1,4-naphthoquinone'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: 5-Sulfamoyl-2-aminobenzoic acid (5-sulfamoylanthranilic acid) represents the fundamental minimal pharmacophoric core of the anthranilic acid class of loop diuretics (exemplified by furosemide without position-2/4 substitutions).',
              'Incorrect: 6-Chloro-7-sulfamoylbenzothiadiazine is the core of thiazide diuretics.',
              'Incorrect: Pyridine sulfamoyl is related to torsemide but lacks the anthranilic core.',
              'Incorrect: Naphthoquinone is a vitamin K analog.'
            ],
            overallExplanation: 'The simplest prototype loop diuretic structure is 5-sulfamoylanthranilic acid (5-sulfamoyl-2-aminobenzoic acid), which retains basic NKCC2 inhibitory activity.',
            highYieldPearl: 'The simplest loop diuretic pharmacophore core is 5-sulfamoylanthranilic acid (benzoic acid with C5 sulfonamide and C2 amine).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 22',
            sourcePageNumber: 3
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // REVIEW PAGE 4: Multiclass Comparative Matching Matrix & Efficacy (Questions 1 - 6)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 4,
    title: 'Multiclass Diuretic Comparative Pharmacology & Efficacy',
    subtitle: 'Loop, Thiazide, Aldosterone Antagonist, and ENaC Blocker: Mechanism, Acid/Base, and Fractional Sodium Excretion',
    sections: [
      {
        sectionTitle: 'Cross-Class Comparison: Furosemide, Hydrochlorothiazide, Spironolactone & Triamterene',
        block_instructions: 'Consider chemical Structures I - IV to answer questions 1-6.',
        structures: [
          DIURETICS_STRUCTURES.furosemide,
          DIURETICS_STRUCTURES.hydrochlorothiazide,
          DIURETICS_STRUCTURES.spironolactone,
          DIURETICS_STRUCTURES.triamterene
        ],
        questions: [
          {
            id: 323,
            questionNumberLabel: 'Question 1',
            title: 'Multiclass Diuretic Pharmacological Classification Matching',
            category: 'Medicinal Chemistry SAR',
            type: 'matching',
            questionStem: 'Drag each chemical structure (Structure I - Structure IV) to its matching pharmacological and tubular classification:',
            prompt: 'Drag each chemical structure (Structure I - Structure IV) to its matching pharmacological and tubular classification:',
            options: ['Structure I', 'Structure II', 'Structure III', 'Structure IV'],
            matchingTargets: [
              {
                id: 'p4_target_1',
                label: 'High-ceiling loop diuretic inhibiting the Na+/K+/2Cl- (NKCC2) symporter in the thick ascending limb',
                acceptedStructureIds: ['Structure I', 'I', 'furosemide'],
                rationale: 'Structure I (Furosemide) is a high-ceiling loop diuretic targeting NKCC2 in the thick ascending limb of Henle.'
              },
              {
                id: 'p4_target_2',
                label: 'Thiazide diuretic inhibiting the electroneutral Na+/Cl- (NCC) cotransporter in the distal convoluted tubule',
                acceptedStructureIds: ['Structure II', 'II', 'hydrochlorothiazide'],
                rationale: 'Structure II (Hydrochlorothiazide) is a thiazide diuretic that blocks the NCC cotransporter in the distal convoluted tubule.'
              },
              {
                id: 'p4_target_3',
                label: 'Steroidal mineralocorticoid receptor antagonist converted to active canrenone metabolite',
                acceptedStructureIds: ['Structure III', 'III', 'spironolactone'],
                rationale: 'Structure III (Spironolactone) is a synthetic steroid that competitively antagonizes cytoplasmic mineralocorticoid receptors and is metabolized to canrenone.'
              },
              {
                id: 'p4_target_4',
                label: 'Pteridine-based basic ENaC channel blocker combined with thiazides to prevent hypokalemia',
                acceptedStructureIds: ['Structure IV', 'IV', 'triamterene'],
                rationale: 'Structure IV (Triamterene) is a basic pteridine congener that directly blocks luminal epithelial sodium channels (ENaC) in the collecting tubule.'
              }
            ],
            matchingPairs: [
              {
                id: 'p4_target_1',
                label: 'High-ceiling loop diuretic inhibiting the Na+/K+/2Cl- (NKCC2) symporter in the thick ascending limb',
                acceptedStructureIds: ['Structure I', 'I', 'furosemide'],
                rationale: 'Structure I (Furosemide) is a high-ceiling loop diuretic targeting NKCC2 in the thick ascending limb of Henle.'
              },
              {
                id: 'p4_target_2',
                label: 'Thiazide diuretic inhibiting the electroneutral Na+/Cl- (NCC) cotransporter in the distal convoluted tubule',
                acceptedStructureIds: ['Structure II', 'II', 'hydrochlorothiazide'],
                rationale: 'Structure II (Hydrochlorothiazide) is a thiazide diuretic that blocks the NCC cotransporter in the distal convoluted tubule.'
              },
              {
                id: 'p4_target_3',
                label: 'Steroidal mineralocorticoid receptor antagonist converted to active canrenone metabolite',
                acceptedStructureIds: ['Structure III', 'III', 'spironolactone'],
                rationale: 'Structure III (Spironolactone) is a synthetic steroid that competitively antagonizes cytoplasmic mineralocorticoid receptors and is metabolized to canrenone.'
              },
              {
                id: 'p4_target_4',
                label: 'Pteridine-based basic ENaC channel blocker combined with thiazides to prevent hypokalemia',
                acceptedStructureIds: ['Structure IV', 'IV', 'triamterene'],
                rationale: 'Structure IV (Triamterene) is a basic pteridine congener that directly blocks luminal epithelial sodium channels (ENaC) in the collecting tubule.'
              }
            ],
            overallExplanation: 'Structure I (Furosemide) is a high-ceiling loop diuretic inhibiting NKCC2 in the thick ascending limb. Structure II (HCTZ) is a thiazide inhibiting NCC in the distal convoluted tubule. Structure III (Spironolactone) is an intracellular mineralocorticoid receptor antagonist converted to canrenone. Structure IV (Triamterene) is an aminopteridine direct ENaC channel blocker in the collecting tubule.',
            highYieldPearl: 'Nephron site of action: Loop (TAL, NKCC2) > Thiazide (DCT, NCC) > K-sparing (late DCT/collecting duct, ENaC or MR).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 23',
            sourcePageNumber: 4
          },
          {
            id: 324,
            questionNumberLabel: 'Question 2',
            title: 'Potassium-Sparing Diuretic with Active Metabolite',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs (Structures I - IV) is a potassium-sparing diuretic that is metabolized to a major active metabolite?',
            options: [
              'Structure III',
              'Structure IV',
              'Structure I',
              'Structure II'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure III (Spironolactone) is rapidly dethioacetylated in the liver to canrenone (half-life ~16-20 hours), which contributes significantly to its long-term antimineralocorticoid activity.',
              'Incorrect: Structure IV (Triamterene) undergoes 4-hydroxylation and sulfate conjugation; its metabolite is less clinically emphasized as the prototypical active steroid metabolite compared to canrenone.',
              'Incorrect: Structure I (Furosemide) is a loop diuretic, not potassium-sparing.',
              'Incorrect: Structure II (Hydrochlorothiazide) is a thiazide diuretic, not potassium-sparing.'
            ],
            overallExplanation: 'Spironolactone (Structure III) is a potassium-sparing mineralocorticoid receptor antagonist that undergoes extensive hepatic metabolism to canrenone, a major active metabolite with an elimination half-life of 16-20 hours.',
            highYieldPearl: 'Spironolactone is converted by dethioacetylation to canrenone (active metabolite, t1/2 ~16-20h), which provides prolonged mineralocorticoid receptor blockade.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 24',
            sourcePageNumber: 4
          },
          {
            id: 325,
            questionNumberLabel: 'Question 3',
            title: 'Ascending Limb of Henle Target',
            category: 'Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the above diuretics (Structures I - IV) interferes with NaCl reabsorption at the thick ascending limb of the loop of Henle?',
            options: [
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure I (Furosemide) is a loop diuretic that selectively inhibits the luminal Na+/K+/2Cl- (NKCC2) cotransporter in the thick ascending limb of the loop of Henle.',
              'Incorrect: Structure II (Hydrochlorothiazide) acts at the distal convoluted tubule (NCC).',
              'Incorrect: Structure III (Spironolactone) acts at the late DCT and cortical collecting duct (MR).',
              'Incorrect: Structure IV (Triamterene) acts at the cortical collecting duct (ENaC).'
            ],
            overallExplanation: 'Only loop diuretics (Structure I, Furosemide) inhibit salt reabsorption in the thick ascending limb of Henle. Thiazides act in the distal convoluted tubule, and potassium-sparing agents act in the late DCT and collecting duct.',
            highYieldPearl: 'Thick ascending limb of Henle is targeted exclusively by loop diuretics (Structure I) via NKCC2 symporter blockade.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 25',
            sourcePageNumber: 4
          },
          {
            id: 326,
            questionNumberLabel: 'Question 4',
            title: 'Acidic vs Basic Diuretics',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following correctly classifies chemical Structures I - IV as acidic, basic, or neutral molecules?',
            options: [
              'Acidic: Structure I & Structure II; Basic: Structure IV; Neutral: Structure III',
              'Acidic: Structure IV; Basic: Structure I & Structure II; Neutral: Structure III',
              'Acidic: Structure III; Basic: Structure IV; Neutral: Structure I & Structure II',
              'All four structures are acidic molecules'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure I (Furosemide: carboxylic acid pKa ~3.9, sulfonamide) and Structure II (HCTZ: sulfonamide protons pKa ~7.9 and 9.2) are acidic. Structure IV (Triamterene: amino-substituted pteridine, basic pKa ~6.2) is basic. Structure III (Spironolactone: synthetic steroid lactone) is a neutral molecule.',
              'Incorrect: Triamterene is basic, not acidic.',
              'Incorrect: Spironolactone is neutral, not acidic.',
              'Incorrect: Triamterene is basic and spironolactone is neutral.'
            ],
            overallExplanation: 'Furosemide (carboxylic acid + sulfonamide) and HCTZ (benzothiadiazine sulfonamides) possess acidic protons. Triamterene contains ring nitrogen and exocyclic amine groups that confer basic character (pKa ~6.2). Spironolactone is a neutral steroid spirolactone.',
            highYieldPearl: 'Acidic diuretics = Loop (Furosemide) and Thiazides (HCTZ). Basic diuretic = Triamterene (pteridine base, pKa 6.2). Neutral = Spironolactone.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 26',
            sourcePageNumber: 4
          },
          {
            id: 327,
            questionNumberLabel: 'Question 5',
            title: 'Combination Partners to Counter Potassium Loss',
            category: 'Clinical Applications',
            type: 'multiple-choice',
            questionStem: 'Which of the diuretics (Structures I, III, and/or IV) can be rationally combined with Diuretic II to adjust for and prevent potassium loss?',
            options: [
              'Structure III and Structure IV',
              'Only Structure I',
              'Structure I and Structure III',
              'None of the above structures'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure III (Spironolactone) and Structure IV (Triamterene) are potassium-sparing diuretics that counteract the kaliuretic (potassium-wasting) effect of Diuretic II (Hydrochlorothiazide). Fixed-dose combinations include Aldactazide (Spironolactone + HCTZ) and Dyazide/Maxzide (Triamterene + HCTZ).',
              'Incorrect: Structure I (Furosemide) is a loop diuretic that also causes severe potassium wasting, worsening hypokalemia.',
              'Incorrect: Structure I causes potassium loss.',
              'Incorrect: Structures III and IV are both standard potassium-sparing partners for thiazides.'
            ],
            overallExplanation: 'Thiazides (Diuretic II) cause potassium wasting by increasing distal delivery of sodium and activating aldosterone. Combining Diuretic II with potassium-sparing agents—Structure III (Spironolactone) or Structure IV (Triamterene)—prevents hypokalemia.',
            highYieldPearl: 'Potassium-sparing diuretics (Structure III Spironolactone, Structure IV Triamterene) are combined with thiazides (Structure II HCTZ) to neutralize potassium wasting.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 27',
            sourcePageNumber: 4
          },
          {
            id: 328,
            questionNumberLabel: 'Question 6',
            title: 'Diuretic Efficacy (% Fractional Sodium Excretion) Ranking',
            category: 'Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Rank the diuretic drug classes represented by Structures I - IV according to their maximal diuretic efficacy (% fractional sodium excretion, from highest to lowest):',
            options: [
              'Structure I (~20-25% Na+ excretion) > Structure II (~5-8%) > Structure III / Structure IV (~2-3%)',
              'Structure IV > Structure III > Structure II > Structure I',
              'Structure II > Structure I > Structure III > Structure IV',
              'Structure III = Structure IV > Structure II > Structure I'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Maximal diuretic efficacy is determined by the percentage of filtered sodium reabsorbed at each nephron segment: Loop diuretics (Structure I) inhibit TAL (~20-25% filtered Na+), Thiazides (Structure II) inhibit DCT (~5-8%), and Potassium-sparing agents (Structures III & IV) inhibit late DCT/collecting duct (~2-3%).',
              'Incorrect: Potassium-sparing agents have the lowest efficacy, not the highest.',
              'Incorrect: Loop diuretics (Structure I) are "high-ceiling" and far exceed thiazides (Structure II).',
              'Incorrect: Inverted ranking.'
            ],
            overallExplanation: 'Efficacy reflects nephron capacity: Thick ascending limb (Loop: ~25%) > Distal convoluted tubule (Thiazide: ~5-8%) > Collecting tubule (K-sparing: ~2-3%).',
            highYieldPearl: 'Maximal Diuretic Efficacy: Loop (Structure I, ~20-25%) >> Thiazide (Structure II, ~5-8%) > K-Sparing (Structures III & IV, ~2-3%).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 3, Question 28',
            sourcePageNumber: 4
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // REVIEW PAGE 5: Head-to-Head Comparative Batteries & Combination Therapy (Questions 1 - 5)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 5,
    title: 'Head-to-Head Comparative Batteries & Combination Therapy',
    subtitle: 'Triamterene vs Spironolactone, Aldosterone vs Spironolactone, Amiloride vs Eplerenone, and Dyazide Synergy',
    sections: [
      {
        sectionTitle: 'Comparative Pharmacology & Structural Pair Batteries',
        block_instructions: 'Consider each pair of chemical structures to evaluate the following True/False batteries and clinical pharmacology questions.',
        structures: [
          DIURETICS_STRUCTURES.triamterene,
          DIURETICS_STRUCTURES.spironolactone,
          DIURETICS_STRUCTURES.aldosterone,
          DIURETICS_STRUCTURES.amiloride,
          DIURETICS_STRUCTURES.eplerenone,
          DIURETICS_STRUCTURES.hydrochlorothiazide
        ],
        questions: [
          {
            id: 329,
            questionNumberLabel: 'Question 1',
            title: 'Triamterene vs Spironolactone True/False Battery',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'Consider chemical Structure I (Triamterene) and Structure II (Spironolactone) to determine whether each statement is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'Drug I is a loop diuretic, whereas Drug II is a potassium-sparing diuretic.',
                isCorrect: false,
                explanation: 'False: Both Drug I (Triamterene, direct ENaC channel blocker) and Drug II (Spironolactone, mineralocorticoid receptor antagonist) are potassium-sparing diuretics.'
              },
              {
                id: 'b',
                text: 'Both diuretics inhibit NaCl reabsorption in the late distal convoluted tubule & collecting duct.',
                isCorrect: true,
                explanation: 'True: Both agents exert their diuretic action at the principal cells of the late distal convoluted tubule and cortical collecting duct.'
              },
              {
                id: 'c',
                text: 'The two drugs are basic molecules.',
                isCorrect: false,
                explanation: 'False: Drug I (Triamterene) is a basic pteridine amine (pKa ~6.2); Drug II (Spironolactone) is a neutral, highly lipophilic steroidal lactone.'
              },
              {
                id: 'd',
                text: 'Only Drug I is associated with an active metabolite.',
                isCorrect: false,
                explanation: 'False: Drug II (Spironolactone) is extensively dethioacetylated in the liver to canrenone, a prominent active metabolite responsible for much of its chronic clinical efficacy.'
              },
              {
                id: 'e',
                text: 'Drug I is more potent than Drug II.',
                isCorrect: false,
                explanation: 'False: Triamterene daily doses are 100-200 mg, whereas Spironolactone daily doses are 25-100 mg; Spironolactone exhibits higher mg-for-mg potency.'
              }
            ],
            overallExplanation: 'Triamterene is a basic pteridine ENaC blocker, whereas Spironolactone is a neutral steroidal mineralocorticoid receptor antagonist metabolized to active canrenone. Both act in the late DCT and collecting duct.',
            highYieldPearl: 'Both Triamterene and Spironolactone are K-sparing agents acting at the late DCT/collecting duct, but Triamterene is basic (direct ENaC blocker) and Spironolactone is neutral/steroidal (MR antagonist with active canrenone metabolite).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 4, Question 29',
            sourcePageNumber: 5
          },
          {
            id: 330,
            questionNumberLabel: 'Question 2',
            title: 'Aldosterone vs Spironolactone True/False Battery',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'Consider Molecule I (Aldosterone) and Molecule II (Spironolactone) to determine whether each statement is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'Molecule I is a steroidal agonist whereas Molecule II is an antagonist.',
                isCorrect: true,
                explanation: 'True: Aldosterone is the endogenous steroidal mineralocorticoid receptor agonist; Spironolactone is a synthetic competitive antagonist at mineralocorticoid receptors.'
              },
              {
                id: 'b',
                text: 'The two molecules are diuretics.',
                isCorrect: false,
                explanation: 'False: Aldosterone promotes sodium and water retention (anti-diuretic / salt-conserving hormone); only Molecule II (Spironolactone) is a diuretic agent.'
              },
              {
                id: 'c',
                text: 'The two molecules target the collecting duct as well as the late distal convoluted tubule.',
                isCorrect: true,
                explanation: 'True: Both molecules bind to intracellular mineralocorticoid receptors in principal cells located in the late DCT and cortical collecting duct.'
              },
              {
                id: 'd',
                text: 'Only Molecule II acts as a potassium-sparing diuretic.',
                isCorrect: true,
                explanation: 'True: Spironolactone inhibits aldosterone-mediated sodium reabsorption and potassium excretion, sparing potassium; aldosterone itself stimulates potassium excretion.'
              },
              {
                id: 'e',
                text: 'Only Molecule II can be used to treat hypertension.',
                isCorrect: true,
                explanation: 'True: Spironolactone reduces blood pressure by blocking mineralocorticoid receptors; Aldosterone excess causes sodium retention and hypertension (e.g., in primary hyperaldosteronism).'
              }
            ],
            overallExplanation: 'Aldosterone is the endogenous MR agonist promoting Na+ retention and K+ excretion. Spironolactone is a synthetic steroid competitive MR antagonist used to treat hypertension and heart failure by promoting saluresis while sparing potassium.',
            highYieldPearl: 'Aldosterone = endogenous MR agonist (salt/water retention, K+ wasting). Spironolactone = synthetic competitive MR antagonist (diuretic, K-sparing, antihypertensive).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 4, Question 30',
            sourcePageNumber: 5
          },
          {
            id: 331,
            questionNumberLabel: 'Question 3',
            title: 'Amiloride vs Eplerenone True/False Battery',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'Consider Drug I (Amiloride) and Drug II (Eplerenone) to determine whether each statement is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'Drug I is a pyrazine derivative, whereas Drug II is a steroid derivative.',
                isCorrect: true,
                explanation: 'True: Amiloride is an aminopyrazine acylguanidine derivative; Eplerenone is a 9,11-epoxy steroidal spirolactone.'
              },
              {
                id: 'b',
                text: 'The two drugs target the ascending limb of the loop of Henle.',
                isCorrect: false,
                explanation: 'False: Both drugs target principal cells of the late distal convoluted tubule and cortical collecting duct, not the loop of Henle.'
              },
              {
                id: 'c',
                text: 'The two drugs are metabolized to active metabolites.',
                isCorrect: false,
                explanation: 'False: Amiloride is excreted largely unchanged (~50% urine, ~40% feces); Eplerenone is metabolized by CYP3A4 to inactive metabolites.'
              },
              {
                id: 'd',
                text: 'Only Drug I is associated with the side effect of hyperkalemia.',
                isCorrect: false,
                explanation: 'False: Both potassium-sparing diuretics carry a significant risk of hyperkalemia by preventing renal potassium secretion.'
              },
              {
                id: 'e',
                text: 'Drug I is a receptor antagonist whereas Drug II is a transporter inhibitor.',
                isCorrect: false,
                explanation: 'False: Drug I (Amiloride) is a direct ion channel blocker (ENaC inhibitor); Drug II (Eplerenone) is an intracellular nuclear receptor antagonist (selective mineralocorticoid receptor blocker).'
              },
              {
                id: 'f',
                text: 'Given their molecular target, the two drugs are associated with sexual side effects.',
                isCorrect: false,
                explanation: 'False: Amiloride does not interact with steroid receptors, and Eplerenone possesses a 9,11-epoxy ring that confers high selectivity for MR over androgen and progesterone receptors, avoiding the gynecomastia seen with Spironolactone.'
              }
            ],
            overallExplanation: 'Amiloride is an aminopyrazine ENaC channel blocker; Eplerenone is a selective 9,11-epoxy steroidal MR antagonist. Both spare potassium in the collecting duct. Eplerenone lacks sexual side effects due to low androgen/progesterone receptor affinity.',
            highYieldPearl: 'Eplerenone has a 9,11-epoxy group that confers extreme selectivity for MR, eliminating the gynecomastia and sexual side effects caused by non-selective Spironolactone.',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 4-5, Question 31',
            sourcePageNumber: 5
          },
          {
            id: 332,
            questionNumberLabel: 'Question 4',
            title: 'Molecular Basis for Extended Duration vs Short Half-Life',
            category: 'Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the following best explains why mineralocorticoid receptor antagonists (such as Spironolactone) have an extended duration of action (24-48 hours) despite relatively short elimination half-lives of the parent drug?',
            options: [
              'Genomic latency of mineralocorticoid receptor transcription regulation combined with active metabolite (canrenone) formation and extensive tissue binding',
              'Irreversible covalent alkylation of the ENaC channel pore via Michael addition',
              'Enterohepatic recirculation of an intact acyl-glucuronide that regenerates the parent drug in the colon',
              'Spontaneous non-enzymatic conversion into insoluble renal calculi'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Mineralocorticoid receptor antagonists act by modulating genomic transcription and de novo protein synthesis of ENaC and Na+/K+-ATPase. This genomic latency introduces a multi-hour onset and prolonged biological persistence (24-48h). In addition, spironolactone is converted to canrenone (active metabolite, half-life 16-20h) which exhibits high tissue and protein binding.',
              'Incorrect: Spironolactone is a competitive reversible antagonist, not an irreversible alkylator (that is ethacrynic acid).',
              'Incorrect: Enterohepatic acyl-glucuronide recirculation is not the primary driver of its 24-48h duration.',
              'Incorrect: Spironolactone does not form renal calculi (triamterene stones are rare but unrelated to duration).'
            ],
            overallExplanation: 'Nuclear receptor antagonists require time for genomic transcript modulation to alter membrane transport protein populations. This transcriptional latency, paired with the active metabolite canrenone (t1/2 16-20h), accounts for the 24-48 hour duration despite a short parent half-life.',
            highYieldPearl: 'MR antagonists have prolonged duration (24-48h) due to genomic transcription latency + active metabolite canrenone (t1/2 16-20h).',
            sourceReference: 'Review for Antihypertensive Drugs I (Diuretics), Page 5, Question 32',
            sourcePageNumber: 5
          },
          {
            id: 333,
            questionNumberLabel: 'Question 5',
            title: 'Dyazide / Moduretic Combination True/False Battery',
            category: 'Clinical Applications',
            type: 'sub-statements',
            questionStem: 'Consider Drug I (Triamterene) and Drug II (Hydrochlorothiazide) as combined in Dyazide/Maxzide, and state whether each statement is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'Drug I is a potassium-sparing diuretic, whereas Drug II is a thiazide diuretic.',
                isCorrect: true,
                explanation: 'True: Triamterene is an ENaC potassium-sparing diuretic; Hydrochlorothiazide is a benzothiadiazine thiazide diuretic.'
              },
              {
                id: 'b',
                text: 'Both inhibit NaCl reabsorption at the collecting duct.',
                isCorrect: false,
                explanation: 'False: Drug I (Triamterene) acts at the cortical collecting duct, but Drug II (HCTZ) acts in the distal convoluted tubule.'
              },
              {
                id: 'c',
                text: 'Drug I is a basic molecule, whereas Drug II is an acidic molecule.',
                isCorrect: true,
                explanation: 'True: Triamterene is basic (pteridine ring pKa ~6.2); HCTZ is acidic (sulfonamide pKa 7.9 and 9.2).'
              },
              {
                id: 'd',
                text: 'Both can be used to treat hypertension.',
                isCorrect: true,
                explanation: 'True: Both lower blood pressure and are frequently combined for additive antihypertensive efficacy.'
              },
              {
                id: 'e',
                text: 'Drug II is a more effective diuretic than Drug I.',
                isCorrect: true,
                explanation: 'True: HCTZ promotes ~5-8% fractional Na+ excretion, whereas Triamterene promotes only ~2-3%.'
              },
              {
                id: 'f',
                text: 'The two drugs can be combined to adjust for potassium ion loss.',
                isCorrect: true,
                explanation: 'True: Triamterene conserves potassium, compensating for the kaliuretic (K-wasting) effect of HCTZ to maintain normokalemia.'
              },
              {
                id: 'g',
                text: 'Only Drug II is associated with the risk of sulfa hypersensitivity reactions.',
                isCorrect: true,
                explanation: 'True: HCTZ possesses aromatic sulfonamide moieties that can trigger sulfa allergy; Triamterene is a pteridine and contains no sulfur.'
              }
            ],
            overallExplanation: 'Dyazide/Maxzide combines basic potassium-sparing Triamterene (collecting duct, non-sulfa, ~2% efficacy) with acidic potassium-wasting HCTZ (DCT, sulfa, ~5% efficacy) to achieve synergistic blood pressure reduction while preserving potassium balance.',
            highYieldPearl: 'Dyazide / Moduretic synergy: Thiazide (acidic, sulfa, DCT, K-wasting) + K-sparing (basic, non-sulfa, collecting duct, K-saving) = normokalemia and synergistic BP control.',
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
    version: '2.0.0',
    examId: 'exam_2',
    examTitle: 'Exam 2: Antihypertensives & Lipids',
    title: 'Review for Antihypertensive Drugs I (Diuretics)',
    subtitle: 'Thiazides, Loop Diuretics, Potassium-Sparing Diuretics & Combinations',
    course: 'Medicinal Chemistry (MCP II)',
    semester: 'Fall 2026',
    code: 'MCP-2-03',
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    chemicalStructures: Object.values(DIURETICS_STRUCTURES),
    pages: diureticsPages,
  };
}
