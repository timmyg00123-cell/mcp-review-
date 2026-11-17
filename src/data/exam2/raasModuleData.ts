import { ReviewModule, ReviewPage } from '../../types/reviewModule';
import { RAAS_STRUCTURES } from './exam2Structures';

export const raasPages: ReviewPage[] = [
  // ---------------------------------------------------------------------------
  // REVIEW PAGE 1: Direct Renin Inhibitors: Aliskiren (Questions 1 - 5)
  // Source PDF: Page 1, Questions 1 - 5
  // ---------------------------------------------------------------------------
  {
    pageNumber: 1,
    title: 'Direct Renin Inhibitors: Aliskiren SAR & Pharmacokinetics',
    subtitle: 'Transition-state peptidomimetics, catalytic aspartyl dyad binding, P-glycoprotein efflux, and CYP3A4 metabolism',
    sections: [
      {
        sectionTitle: 'Aliskiren: First-in-Class Direct Renin Inhibitor',
        block_instructions: 'Consider the following structure of aliskiren to answer questions (1-5):',
        structures: [RAAS_STRUCTURES.aliskiren],
        questions: [
          {
            id: 601,
            questionNumberLabel: 'Question 1',
            title: 'Chemical Class of Aliskiren',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following best describes the chemical class of aliskiren?',
            options: [
              'Benzothiadiazine-1,1-dioxide',
              '1,4-Dihydropyridine',
              'Aryloxypropanolamine',
              'Arylethanolamine',
              'Sulfamoyl anthranilic acid',
              'Steroid',
              'Peptidomimetic'
            ],
            correctIndex: 6,
            optionExplanations: [
              'Incorrect: Not a benzothiadiazine.',
              'Incorrect: Not a 1,4-DHP.',
              'Incorrect: Not an aryloxypropanolamine.',
              'Incorrect: Not an arylethanolamine.',
              'Incorrect: Not a sulfamoyl anthranilic acid.',
              'Incorrect: Not a steroid.',
              'Correct: Aliskiren is a non-peptide peptidomimetic rationally engineered to mimic the octapeptide transition state of the endogenous renin substrate, angiotensinogen.'
            ],
            overallExplanation: 'Aliskiren is a non-peptide peptidomimetic designed through structure-based drug design to overcome the poor stability and low oral bioavailability of early peptide renin inhibitors.',
            highYieldPearl: 'Aliskiren = non-peptide peptidomimetic direct renin inhibitor. Reversible competitive active-site blocker of human renin.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 1, Question 1',
            sourcePageNumber: 1
          },
          {
            id: 602,
            questionNumberLabel: 'Question 2',
            title: 'Rational Design Strategy for Aliskiren',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Aliskiren was rationally designed as:',
            options: [
              'Substrate mimetic enzyme inhibitor',
              'Substrate mimetic receptor blocker',
              'Transition state mimetic enzyme inhibitor',
              'All of the above',
              'None of the above'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: It mimics the high-energy transition state rather than the ground-state substrate.',
              'Incorrect: It targets the enzyme renin, not an adrenergic or angiotensin receptor.',
              'Correct: Aliskiren incorporates a non-cleavable hydroxyethylene isostere [-CH(OH)-CH2-] that mimics the tetrahedral transition state formed during renin-catalyzed scission of the Leu10-Val11 peptide bond of angiotensinogen.',
              'Incorrect: Not all of the above.',
              'Incorrect: It is a transition state mimetic enzyme inhibitor.'
            ],
            overallExplanation: 'Renin is an aspartyl protease. Aliskiren mimics the tetrahedral gem-diol transition state of the scissile peptide bond, providing sub-nanomolar binding affinity and complete resistance to proteolytic cleavage.',
            highYieldPearl: 'Aliskiren design = transition-state mimetic. Hydroxyethylene isostere mimics the tetrahedral transition state of the Leu10-Val11 scissile bond.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 1, Question 2',
            sourcePageNumber: 1
          },
          {
            id: 603,
            questionNumberLabel: 'Question 3',
            title: 'Active-Site Catalytic Aspartate Interactions',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which group(s) (a-c) in aliskiren engage(s) with the key aspartate residues in the active site of the protein target?',
            options: [
              'Functional group a',
              'Functional group b',
              'Functional group c',
              'Functional groups a and c',
              'Functional groups a, b, and c all engage with the key aspartate residues'
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect: Functional group a engages, but functional group c also engages.',
              'Incorrect: Functional group b is the terminal isopropyl carboxamide that extends into the S3 subpocket.',
              'Incorrect: Functional group c engages, but functional group a also engages.',
              'Correct: Functional group a (the central secondary hydroxyl group) and functional group c (the adjacent basic primary amino group) coordinate directly with the catalytic aspartyl dyad (Asp32 and Asp215) in the active cleft of renin, mimicking the water-mediated transition state.',
              'Incorrect: Group b does not coordinate the catalytic aspartate residues.'
            ],
            overallExplanation: 'The central secondary hydroxyl (group a) and basic primary amino group (group c) coordinate directly between catalytic Asp32 and Asp215 in the renin cleft, displacing the catalytic water molecule and preventing peptide bond cleavage.',
            highYieldPearl: 'Catalytic aspartyl dyad (Asp32/Asp215) in renin active cleft is engaged directly by aliskiren groups a (secondary OH) and c (basic primary amine).',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 1, Question 3',
            sourcePageNumber: 1
          },
          {
            id: 604,
            questionNumberLabel: 'Question 4',
            title: 'Mechanism of Action and PK Characteristics of Aliskiren',
            category: 'Pharmacokinetics ADME',
            type: 'sub-statements',
            questionStem: 'State whether each of the following statements is true or false considering the mechanism of action of aliskiren and its pharmacokinetics aspects:',
            subStatements: [
              {
                id: 'a',
                text: 'It is reversible competitive enzyme inhibitor',
                isCorrect: true,
                explanation: 'True: Aliskiren binds reversibly and competitively to the active catalytic site of human renin with sub-nanomolar affinity (Ki ~0.6 nM).'
              },
              {
                id: 'b',
                text: 'It is active site enzyme inhibitor that interferes with the conversion of angiotensin I to II',
                isCorrect: false,
                explanation: 'False: Aliskiren inhibits renin, which converts angiotensinogen to angiotensin I. Conversion of Ang I to Ang II is mediated by ACE, not renin!'
              },
              {
                id: 'c',
                text: 'Its binding to the active site of renin is stereochemistry-dependent',
                isCorrect: true,
                explanation: 'True: Aliskiren contains 4 chiral centers [(2S,4S,5S,7S)]; inversion of any stereocenter drastically impairs active-site complementarity and reduces renin inhibitory potency.'
              },
              {
                id: 'd',
                text: 'Although it undergoes extensive first pass effect, aliskiren is orally used antihypertensive drug',
                isCorrect: true,
                explanation: 'True: Aliskiren oral bioavailability is low (~2.5%) due to poor mucosal permeability and P-glycoprotein efflux, but its high sub-nanomolar potency and long half-life allow effective once-daily oral dosing.'
              }
            ],
            overallExplanation: 'Aliskiren inhibits renin at the rate-limiting initial step of the RAAS cascade (preventing angiotensinogen conversion to Ang I). Despite low bioavailability (~2.5%), oral administration is clinically effective.',
            highYieldPearl: 'Aliskiren blocks renin (angiotensinogen -> Ang I). Bioavailability ~2.5% (P-gp substrate, avoid high-fat meals). Contraindicated in pregnancy!',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 1, Question 4',
            sourcePageNumber: 1
          },
          {
            id: 605,
            questionNumberLabel: 'Question 5',
            title: 'Phase I Metabolic Pathways of Aliskiren',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the following Phase I transformations contribute to aliskiren metabolism? (Select all that apply)',
            options: [
              'Benzylic oxidation and oxidative O-demethylation',
              'Amide hydrolysis and oxidative N-demethylation',
              'Amide hydrolysis only',
              'Oxidative N-demethylation only'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Aliskiren is largely excreted unchanged in feces (>90%), with ~10% metabolized by hepatic CYP3A4 primarily via oxidative O-demethylation of the methoxypropoxy side chain and benzylic oxidation.',
              'Incorrect: Amide hydrolysis and N-demethylation are not major pathways for aliskiren.',
              'Incorrect: Amide hydrolysis is not the primary pathway.',
              'Incorrect: N-demethylation does not contribute significantly.'
            ],
            overallExplanation: 'Aliskiren is predominantly eliminated unchanged by hepatobiliary/fecal excretion (>90%), with minor (~10%) Phase I metabolism by CYP3A4 involving oxidative O-demethylation and benzylic oxidation.',
            highYieldPearl: 'Aliskiren elimination: >90% eliminated unchanged in feces. Minor CYP3A4 metabolism (oxidative O-demethylation and benzylic oxidation).',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 1, Question 5',
            sourcePageNumber: 1
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // REVIEW PAGE 2: ACE Inhibitors Core SAR & Zinc-Binding Groups (Questions 6 - 12)
  // Source PDF: Page 2, Questions 6 - 12
  // ---------------------------------------------------------------------------
  {
    pageNumber: 2,
    title: 'ACE Inhibitors: Zinc Metalloprotease SAR, Binding Domains & Ester Prodrugs',
    subtitle: 'Sulfhydryl vs dicarboxylate vs phosphinate Zn-binders, active drugs vs ester prodrugs, and oral bioavailability',
    sections: [
      {
        sectionTitle: 'ACE Inhibitor Core SAR & Chemical Classes',
        block_instructions: 'Consider the following chemical structures to answer questions (6-17):',
        structures: [
          RAAS_STRUCTURES.captopril,
          RAAS_STRUCTURES.enalapril,
          RAAS_STRUCTURES.lisinopril,
          RAAS_STRUCTURES.fosinopril,
          RAAS_STRUCTURES.ramipril,
          RAAS_STRUCTURES.enalaprilat,
        ],
        questions: [
          {
            id: 606,
            questionNumberLabel: 'Question 1',
            title: 'Chemical Class of ACE Inhibitors',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following best describes the chemical class of the above drugs?',
            options: [
              'Benzothiadiazine-1,1-dioxide',
              '1,4-Dihydropyridine',
              'Aryloxypropanolamine',
              'Arylethanolamine',
              'Sulfamoyl anthranilic acid',
              'Steroid',
              'Peptidomimetic'
            ],
            correctIndex: 6,
            optionExplanations: [
              'Incorrect: Not thiazides.',
              'Incorrect: Not DHPs.',
              'Incorrect: Not beta-blockers.',
              'Incorrect: Not arylethanolamines.',
              'Incorrect: Not loop diuretics.',
              'Incorrect: Not steroids.',
              'Correct: ACE inhibitors are peptidomimetics rationally modeled on the C-terminal dipeptide (Ala-Pro or Phe-Ala-Pro) of angiotensin I, incorporating modified zinc-binding groups.'
            ],
            overallExplanation: 'ACE inhibitors are peptidomimetics designed to mimic the transition state of angiotensin I peptide bond cleavage by the zinc metalloprotease ACE.',
            highYieldPearl: 'ACE inhibitors = peptidomimetics modeled after the C-terminal Ala-Pro sequence of Angiotensin I.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 2, Question 6',
            sourcePageNumber: 2
          },
          {
            id: 607,
            questionNumberLabel: 'Question 2',
            title: 'Mechanistic Class of ACE Inhibitors',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'What is the mechanistic class of the above drugs?',
            options: [
              'Potassium sparing agents',
              'Loop diuretics',
              'Thiazide diuretics',
              'Calcium channel blockers',
              'β-Blockers',
              'Angiotensin converting enzyme inhibitors',
              'Angiotensin II receptor antagonists'
            ],
            correctIndex: 5,
            optionExplanations: [
              'Incorrect: Not potassium-sparing agents.',
              'Incorrect: Not loop diuretics.',
              'Incorrect: Not thiazides.',
              'Incorrect: Not CCBs.',
              'Incorrect: Not beta-blockers.',
              'Correct: They competitively inhibit angiotensin converting enzyme (peptidyl dipeptidase A), blocking the conversion of inactive Ang I to potent vasoconstrictor Ang II and preventing the breakdown of bradykinin.',
              'Incorrect: Not ARBs.'
            ],
            overallExplanation: 'ACE inhibitors block the zinc metalloprotease ACE, suppressing Ang II production and aldosterone secretion while elevating vasodilating bradykinin levels.',
            highYieldPearl: 'ACE inhibitors: Inhibit Ang I -> Ang II conversion AND inhibit bradykinin degradation -> vasodilation + dry cough/angioedema.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 2, Question 7',
            sourcePageNumber: 2
          },
          {
            id: 608,
            questionNumberLabel: 'Question 3',
            title: 'ACE Inhibitor SAR and Zinc-Binding Principles',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'State whether each of the following statements is true or false considering the SAR and mechanism of ACE inhibitors:',
            subStatements: [
              {
                id: 'a',
                text: 'They are active site inhibitors of protease involved in angiotensin II biosynthesis',
                isCorrect: true,
                explanation: 'True: ACE is a zinc-dependent dicarboxypeptidase; these drugs compete with Ang I for the active catalytic pocket.'
              },
              {
                id: 'b',
                text: 'They are irreversible enzyme inhibitors',
                isCorrect: false,
                explanation: 'False: ACE inhibitors are reversible, non-covalent competitive inhibitors.'
              },
              {
                id: 'c',
                text: 'They have been rationally designed based on similarity to the tetrahedral transition state',
                isCorrect: true,
                explanation: 'True: They mimic the tetrahedral intermediate formed during zinc-assisted peptide bond hydrolysis.'
              },
              {
                id: 'd',
                text: 'Central amide bond and terminal carboxylate are essential structural features',
                isCorrect: true,
                explanation: 'True: The terminal carboxylate anchors to a positively charged Arg/Lys residue, and the amide forms essential H-bonds with the ACE backbone.'
              },
              {
                id: 'e',
                text: 'Peripheral phenyl alkyl groups are optimal structural features',
                isCorrect: true,
                explanation: 'True: The phenethyl substituent (phenylalkyl group) occupies the deep hydrophobic S1 prime pocket, dramatically increasing binding affinity.'
              },
              {
                id: 'f',
                text: 'Sulfhydryl group is more efficient Zn-binding domain than carboxylate and phosphinate groups',
                isCorrect: true,
                explanation: 'True: The thiol group (-SH) coordinates active-site Zn2+ with exceptionally high bond strength, yielding high potency despite captopril lacking the extended phenethyl group.'
              }
            ],
            overallExplanation: 'ACE inhibitors are reversible transition-state analogs possessing: (1) a zinc-binding group (-SH, -COO-, or -PO2-), (2) a central peptide-like backbone, (3) a C-terminal carboxylate, and (4) an S1 prime phenylalkyl substituent.',
            highYieldPearl: 'ACEI essential SAR: Zinc-binding group (SH > COO- = PO2-) + terminal carboxylate (binds Arg) + phenethyl group (fills S1\' pocket).',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 2, Question 8',
            sourcePageNumber: 2
          },
          {
            id: 609,
            questionNumberLabel: 'Question 4',
            title: 'Therapeutic Indications',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the following diseases is treated by the listed drugs?',
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
              'Incorrect: Although renoprotective in diabetic nephropathy, diabetes itself is treated with hypoglycemic agents.',
              'Correct: The listed drugs are ACE inhibitors whose primary therapeutic indication is hypertension (along with heart failure and diabetic nephropathy).',
              'Incorrect: ACE inhibitors can worsen bronchospasm and cause dry cough via bradykinin accumulation.',
              'Incorrect: Not for peptic ulcer.',
              'Incorrect: Not antibiotics.',
              'Incorrect: Not antineoplastics.',
              'Incorrect: Not antidepressants.'
            ],
            overallExplanation: 'ACE inhibitors are first-line antihypertensive agents that reduce systemic vascular resistance, reduce cardiac remodeling in heart failure, and slow the progression of diabetic nephropathy.',
            highYieldPearl: 'ACEIs are first-line for hypertension, heart failure (HFrEF), and diabetic kidney disease.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 2, Question 9',
            sourcePageNumber: 2
          },
          {
            id: 610,
            questionNumberLabel: 'Question 5',
            title: 'Classification by Zinc-Binding Domains',
            category: 'Medicinal Chemistry SAR',
            type: 'matching',
            questionStem: 'Which of the above drugs has(have) sulfhydryl group as Zn-binding domain? Carboxylate group as Zn-binding domain? Phosphinate as Zn-binding domain? Match each drug structure to its catalytic Zn-binding functional group:',
            options: [
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV',
              'Structure V',
              'Structure VI'
            ],
            matchingTargets: [
              {
                id: 'target-sh',
                label: 'Sulfhydryl (-SH) group as Zn-binding domain',
                acceptedStructureIds: ['Structure I', 'I'],
                rationale: 'Structure I (Captopril) is the prototype sulfhydryl-containing ACE inhibitor, coordinating catalytic Zn2+ via its thiol group.'
              },
              {
                id: 'target-coo',
                label: 'Carboxylate (-COO⁻) group as Zn-binding domain',
                acceptedStructureIds: ['Structure II', 'Structure III', 'Structure V', 'Structure VI', 'II', 'III', 'V', 'VI'],
                rationale: 'Structures II (Enalapril), III (Lisinopril), V (Ramipril), and VI (Enalaprilat) are dicarboxylate-containing ACE inhibitors that coordinate catalytic Zn2+ via a carboxylate group.'
              },
              {
                id: 'target-po2',
                label: 'Phosphinate (-PO₂⁻) group as Zn-binding domain',
                acceptedStructureIds: ['Structure IV', 'IV'],
                rationale: 'Structure IV (Fosinopril) is a phosphinate-containing ACE inhibitor, coordinating catalytic Zn2+ via its phosphinic acid moiety.'
              }
            ],
            structuresDisplayed: [
              RAAS_STRUCTURES.captopril,
              RAAS_STRUCTURES.enalapril,
              RAAS_STRUCTURES.lisinopril,
              RAAS_STRUCTURES.fosinopril,
              RAAS_STRUCTURES.ramipril,
              RAAS_STRUCTURES.enalaprilat,
            ],
            overallExplanation: 'ACE inhibitors are subclassified by their catalytic zinc-binding domain: (1) Sulfhydryl (Structure I: Captopril), (2) Dicarboxylate (Structures II: Enalapril, III: Lisinopril, V: Ramipril, VI: Enalaprilat), and (3) Phosphinate (Structure IV: Fosinopril).',
            highYieldPearl: 'ACEI Zinc-binding groups: Sulfhydryl = Captopril (I). Carboxylate = Enalapril (II), Lisinopril (III), Ramipril (V), Enalaprilat (VI). Phosphinate = Fosinopril (IV).',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 2, Question 10',
            sourcePageNumber: 2
          },
          {
            id: 611,
            questionNumberLabel: 'Question 6',
            title: 'Active Drugs vs Prodrugs in ACEI Class',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above molecules are active drugs in the presented form? Prodrugs?',
            options: [
              'Active drugs: Structures I, III, and VI; Prodrugs: Structures II, IV, and V',
              'Active drugs: Structures II, IV, and V; Prodrugs: Structures I, III, and VI',
              'Active drugs: Structures I and II; Prodrugs: Structures III, IV, V, and VI',
              'All six structures are active drugs in their presented form'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure I (Captopril), Structure III (Lisinopril), and Structure VI (Enalaprilat) are active drugs that do not require bioactivation. Structures II (Enalapril, ethyl ester), IV (Fosinopril, acyloxyalkyl phosphinate ester), and V (Ramipril, ethyl ester) are ester prodrugs requiring hepatic esterase hydrolysis.',
              'Incorrect: Inverted assignment.',
              'Incorrect: Enalapril is a prodrug; Lisinopril and Enalaprilat are active drugs.',
              'Incorrect: Structures II, IV, and V are inactive prodrugs.'
            ],
            overallExplanation: 'Structure I (Captopril, free thiol), Structure III (Lisinopril, lysine di-zwitterion), and Structure VI (Enalaprilat, active di-acid) are active parent drugs. Structures II (Enalapril), IV (Fosinopril), and V (Ramipril) are ester prodrugs bioactivated in the liver.',
            highYieldPearl: 'Active ACEIs = Captopril (I), Lisinopril (III), Enalaprilat (VI). Ester prodrugs = Enalapril (II), Fosinopril (IV), Ramipril (V).',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 2, Question 11',
            sourcePageNumber: 2
          },
          {
            id: 612,
            questionNumberLabel: 'Question 7',
            title: 'Parenteral Di-Acid ACE Inhibitor',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is less likely than others to be taken orally? (One drug)',
            options: [
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV',
              'Structure V',
              'Structure VI'
            ],
            correctIndex: 5,
            optionExplanations: [
              'Incorrect: Structure I (Captopril) is well absorbed orally.',
              'Incorrect: Structure II (Enalapril) is an oral ethyl ester prodrug.',
              'Incorrect: Structure III (Lisinopril) is orally absorbed as a di-zwitterion.',
              'Incorrect: Structure IV (Fosinopril) is an oral prodrug.',
              'Incorrect: Structure V (Ramipril) is an oral ethyl ester prodrug.',
              'Correct: Structure VI (Enalaprilat) contains two ionized carboxylic acid groups and a protonated secondary amine at intestinal pH. Its highly polar tri-ionic state yields very poor oral bioavailability (<3%), making it unsuitable for oral use and necessitating intravenous administration (Vasotec IV).'
            ],
            overallExplanation: 'Structure VI (Enalaprilat) is the active di-acid metabolite of enalapril. Its two ionized carboxylates prevent passive GI absorption (<3% oral bioavailability), restricting it to parenteral (IV) administration for acute hypertension.',
            highYieldPearl: 'Structure VI (Enalaprilat) = active di-acid, poor oral absorption (<3%), formulated for IV injection only. Structure II (Enalapril) = oral ethyl ester prodrug.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 2, Question 12',
            sourcePageNumber: 2
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // REVIEW PAGE 3: ACE Inhibitor Disposition & ARB Pharmacophore & Metabolism (Questions 13 - 24)
  // Source PDF: Page 3, Questions 13 - 24
  // ---------------------------------------------------------------------------
  {
    pageNumber: 3,
    title: 'ACE Inhibitor Disposition & Angiotensin II Receptor Blockers (ARBs)',
    subtitle: 'Lisinopril di-zwitterion, captopril adverse effects, fosinopril elimination, and ARB pharmacophore & bioactivation',
    sections: [
      {
        sectionTitle: 'ACE Inhibitor Clinical Pharmacology & Special PK Features',
        block_instructions: 'Continuing with ACE Inhibitor Structures I - VI from Review Page 2, answer questions 13 - 17:',
        structures: [
          RAAS_STRUCTURES.captopril,
          RAAS_STRUCTURES.enalapril,
          RAAS_STRUCTURES.lisinopril,
          RAAS_STRUCTURES.fosinopril,
          RAAS_STRUCTURES.ramipril,
          RAAS_STRUCTURES.enalaprilat,
        ],
        questions: [
          {
            id: 613,
            questionNumberLabel: 'Question 1',
            title: 'Lisinopril Di-Zwitterion Concept',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs can exist as di-zwitterion, and therefore, it can be administered orally without being a prodrug?',
            options: [
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV',
              'Structure V',
              'Structure VI'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: Structure I does not form a di-zwitterion.',
              'Incorrect: Structure II is an ester prodrug.',
              'Correct: Structure III (Lisinopril) incorporates a basic lysine side chain. At physiological pH, the two positive charges (secondary amine and lysine epsilon-amino group) balance the two negative charges (two carboxylates), forming an intramolecular di-zwitterion with net neutrality that allows adequate oral absorption (~25-30%) as an active non-prodrug.',
              'Incorrect: Structure IV is an ester prodrug.',
              'Incorrect: Structure V is an ester prodrug.',
              'Incorrect: Structure VI is poorly absorbed orally (<3%).'
            ],
            overallExplanation: 'Structure III (Lisinopril) has a basic lysine epsilon-amino group that pairs with its two carboxylic acids to form a net-neutral di-zwitterion, enabling oral absorption directly as an active drug without ester prodrug modification.',
            highYieldPearl: 'Structure III (Lisinopril) = active di-acid oral drug. Basic lysine epsilon-amine forms a di-zwitterion that permits oral absorption without an ester prodrug!',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 13',
            sourcePageNumber: 3
          },
          {
            id: 614,
            questionNumberLabel: 'Question 2',
            title: 'Adverse Effects Specific to Captopril: Thiol-Mediated Toxicities',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is potentially associated with skin rash and metallic taste issues?',
            options: [
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV',
              'Structure V',
              'Structure VI'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure I (Captopril) contains a free sulfhydryl (-SH) group that forms mixed disulfides with tissue proteins, triggering taste disturbances (metallic dysgeusia), maculopapular skin rashes, and rare neutropenia/agranulocytosis.',
              'Incorrect: Structure II lacks a sulfhydryl group.',
              'Incorrect: Structure III does not contain a thiol group.',
              'Incorrect: Structure IV lacks a sulfhydryl group.',
              'Incorrect: Structure V lacks a sulfhydryl group.',
              'Incorrect: Structure VI lacks a sulfhydryl group.'
            ],
            overallExplanation: 'Structure I (Captopril) sulfhydryl group (-SH) is uniquely responsible for taste alteration (metallic taste / dysgeusia) and skin rash due to disulfide bond formation with endogenous proteins.',
            highYieldPearl: 'Structure I (Captopril) sulfhydryl (-SH) = metallic taste (dysgeusia), skin rash, and shortest half-life.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 14',
            sourcePageNumber: 3
          },
          {
            id: 615,
            questionNumberLabel: 'Question 3',
            title: 'Shortest Duration of Action Among ACEIs',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs has the shortest duration of action? Why?',
            options: [
              'Structure I, because it rapidly oxidizes to form mixed disulfides with endogenous thiols',
              'Structure III, due to rapid active renal tubular secretion',
              'Structure IV, due to rapid compensatory dual clearance',
              'Structure V, due to rapid hepatic glucuronidation'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure I (Captopril) has an elimination half-life of <2 hours because its nucleophilic sulfhydryl group rapidly oxidizes and dimerizes to captopril disulfide or conjugates with endogenous cysteine and albumin, requiring BID to TID dosing.',
              'Incorrect: Structure III has a longer half-life (~12 hours, once daily).',
              'Incorrect: Structure IV has a long half-life (~12 hours, once daily).',
              'Incorrect: Structure V has a long half-life (once daily).'
            ],
            overallExplanation: 'Structure I (Captopril) has the shortest duration of action (t1/2 < 2h) because the free thiol group rapidly dimerizes and binds to plasma proteins, necessitating multiple daily doses.',
            highYieldPearl: 'Structure I (Captopril) = shortest duration of action (t1/2 < 2h, BID/TID dosing) due to rapid disulfide dimerization.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 15',
            sourcePageNumber: 3
          },
          {
            id: 616,
            questionNumberLabel: 'Question 4',
            title: 'Hepatic Esterase Bioactivation',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs should be metabolized by hepatic esterase to active drugs before promoting the pharmacological activity?',
            options: [
              'Structures II, IV, and V',
              'Structures I, III, and VI',
              'Structure I only',
              'Structure III only'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure II (Enalapril), Structure IV (Fosinopril), and Structure V (Ramipril) are ester prodrugs that must be hydrolyzed by hepatic carboxylesterases to their active di-acid/phosphinic acid forms (Enalaprilat, Fosinoprilat, Ramiprilat).',
              'Incorrect: Structures I, III, and VI are active drugs in their administered form.',
              'Incorrect: Structure I is an active drug.',
              'Incorrect: Structure III is an active drug.'
            ],
            overallExplanation: 'Structures II (Enalapril), IV (Fosinopril), and V (Ramipril) are ester prodrugs bioactivated in the liver by carboxylesterases to liberate their active zinc-binding carboxylate/phosphinate groups.',
            highYieldPearl: 'Prodrug ACEIs = Enalapril (II), Fosinopril (IV), Ramipril (V) -> hydrolyzed by hepatic esterases to active di-acids.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 16',
            sourcePageNumber: 3
          },
          {
            id: 617,
            questionNumberLabel: 'Question 5',
            title: 'Caution in Liver Dysfunction',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs will have to be cautiously used (may require dose adjustment) in patients with serious liver dysfunction?',
            options: [
              'Structures II, IV, and V',
              'Structure I only',
              'Structure III only',
              'Structure VI only'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structures II (Enalapril), IV (Fosinopril), and V (Ramipril) are prodrugs that depend on hepatic esterase cleavage for conversion to active drugs; impaired liver function reduces bioactivation. Furthermore, Structure IV (Fosinopril) relies on 50% hepatobiliary clearance.',
              'Incorrect: Structure I is an active drug cleared primarily renally.',
              'Incorrect: Structure III is an active drug cleared 100% renally.',
              'Incorrect: Structure VI is an active drug cleared renally.'
            ],
            overallExplanation: 'Ester prodrug ACE inhibitors (Structures II, IV, V) require functional hepatic carboxylesterases for conversion to active drugs. Severe hepatic impairment blunts bioactivation, and Structure IV also depends heavily on hepatobiliary elimination.',
            highYieldPearl: 'Prodrug ACEIs (II, IV, V) require hepatic bioactivation -> impaired conversion and altered PK in severe liver dysfunction.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 17',
            sourcePageNumber: 3
          }
        ]
      },
      {
        sectionTitle: 'Angiotensin II Receptor Blockers (ARBs) SAR & Metabolism',
        block_instructions: 'Consider the following chemical structures to answer questions (18-26):',
        structures: [
          RAAS_STRUCTURES.losartan,
          RAAS_STRUCTURES.exp3174,
          RAAS_STRUCTURES.valsartan,
          RAAS_STRUCTURES.candesartan_cilexetil,
          RAAS_STRUCTURES.telmisartan,
        ],
        questions: [
          {
            id: 618,
            questionNumberLabel: 'Question 6',
            title: 'Mechanistic Class of ARBs',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'What is the mechanistic class of the above drugs?',
            options: [
              'Potassium sparing agents',
              'Loop diuretics',
              'Thiazide diuretics',
              'Calcium channel blockers',
              'β-Blockers',
              'Angiotensin converting enzyme inhibitors',
              'Angiotensin II receptor antagonists',
              'Renin inhibitors'
            ],
            correctIndex: 6,
            optionExplanations: [
              'Incorrect: Not potassium-sparing agents.',
              'Incorrect: Not loop diuretics.',
              'Incorrect: Not thiazides.',
              'Incorrect: Not CCBs.',
              'Incorrect: Not beta-blockers.',
              'Incorrect: Not ACE inhibitors (they do not block ACE or prevent bradykinin degradation).',
              'Correct: They are Angiotensin II receptor antagonists (ARBs / AT1 receptor blockers) that competitively block the AT1 receptor, preventing Ang II vasoconstriction and aldosterone release.',
              'Incorrect: Renin inhibitor is aliskiren.'
            ],
            overallExplanation: 'The presented drugs are Angiotensin II receptor antagonists (ARBs) that selectively block AT1 receptors without inhibiting ACE, avoiding bradykinin accumulation and cough.',
            highYieldPearl: 'ARBs selectively block AT1 receptors -> block Ang II actions without increasing bradykinin -> no ACEI-associated cough.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 18',
            sourcePageNumber: 3
          },
          {
            id: 619,
            questionNumberLabel: 'Question 7',
            title: 'Peptidomimetic Design Strategy of ARBs',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs follows tripeptide-like drug design strategy? Tetrapeptide-like design strategy?',
            options: [
              'Tetrapeptide-like: Structures I, II, III, and IV; Tripeptide-like: Structure V',
              'Tetrapeptide-like: Structure V only; Tripeptide-like: Structures I - IV',
              'All five structures follow a decapeptide-like design strategy',
              'None of the structures are peptidomimetic'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structures I (Losartan), II (EXP3174), III (Valsartan), and IV (Candesartan) mimic the C-terminal tetrapeptide sequence (Ile-His-Pro-Phe) of Ang II with a Phe-like domain (primary alcohol or carboxylic acid). In contrast, Structure V (Telmisartan) lacks the Phe-like carboxylic acid domain at position-2 and follows a minimally tripeptide-like antagonist design.',
              'Incorrect: Inverted assignment.',
              'Incorrect: Angiotensin II is an octapeptide; ARBs mimic the C-terminal tetrapeptide or tripeptide sequence.',
              'Incorrect: ARBs are classic non-peptide peptidomimetics.'
            ],
            overallExplanation: 'ARBs mimic the C-terminal bioactive sequence of Angiotensin II. Drugs retaining a Phe-like domain (carboxylic acid / alcohol at imidazole C-2, such as Losartan, EXP3174, Candesartan, Valsartan) are tetrapeptide-like. Drugs lacking this acidic domain (Telmisartan) are minimally tripeptide-like antagonists.',
            highYieldPearl: 'ARB design: Tetrapeptide-like = Structures with Phe-like domain (I, II, III, IV). Tripeptide-like = Structures lacking Phe-like COOH (Structure V: Telmisartan).',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 19',
            sourcePageNumber: 3
          },
          {
            id: 620,
            questionNumberLabel: 'Question 8',
            title: 'Bioactivation of Losartan to EXP3174',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is(are) hepatically metabolized to more active metabolite? Why the metabolite is more active than the original drug?',
            options: [
              'Structure I; its 5-hydroxymethyl group is oxidized by CYP2C9/3A4 to a 5-carboxylic acid (Structure II), establishing extra ionic interactions with Lys199 and Arg167',
              'Structure III; it is hydroxylated at its valine side chain',
              'Structure IV; its ethyl group is oxidized to a ketone',
              'Structure V; its benzimidazole ring is opened by CYP enzymes'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure I (Losartan) is oxidized at its imidazole 5-hydroxymethyl group by hepatic CYP2C9 and CYP3A4 into Structure II (EXP3174, a 5-carboxylic acid metabolite). The carboxylate provides additional ionic bonds with Lys199 and Arg167 in the AT1 receptor, making EXP3174 10-40 times more potent and an insurmountable antagonist.',
              'Incorrect: Structure III undergoes minimal metabolism.',
              'Incorrect: Structure IV is bioactivated in the gut wall by esterases, not oxidation to a ketone.',
              'Incorrect: Structure V is eliminated mostly unchanged without ring cleavage.'
            ],
            overallExplanation: 'Structure I (Losartan) is metabolized in the liver by CYP2C9/3A4 to Structure II (EXP3174). The resulting carboxylic acid forms additional ionic interactions with Lys199 and Arg167 in the AT1 receptor, conferring 10-40 fold greater potency and insurmountable antagonism.',
            highYieldPearl: 'Structure I (Losartan) -> [CYP2C9/3A4] -> Structure II (EXP3174): 10-40x more potent, insurmountable AT1 blockade via extra ionic bonds with Lys199 & Arg167.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 20',
            sourcePageNumber: 3
          },
          {
            id: 621,
            questionNumberLabel: 'Question 9',
            title: 'Gastrointestinal Prodrug Activation',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the provided molecules require activation in GIT i.e. which ones are prodrugs?',
            options: [
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV',
              'Structure V'
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect: Structure I (Losartan) is an active drug bioactivated in the liver (not GIT).',
              'Incorrect: Structure II (EXP3174) is an active metabolite.',
              'Incorrect: Structure III (Valsartan) is an active drug.',
              'Correct: Structure IV (Candesartan cilexetil) is an inactive carbonate/ester prodrug that undergoes rapid and complete hydrolysis by esterases in the gastrointestinal tract during absorption to liberate active candesartan.',
              'Incorrect: Structure V (Telmisartan) is an active drug.'
            ],
            overallExplanation: 'Structure IV (Candesartan cilexetil) is a prodrug masked with a cilexetil (cyclohexyloxycarbonyloxyethyl) carbonate ester to enhance oral bioavailability. It is quantitatively cleaved by esterases in the GI tract wall during absorption.',
            highYieldPearl: 'Structure IV (Candesartan cilexetil) = carbonate prodrug cleaved completely in the GIT wall during oral absorption.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 21',
            sourcePageNumber: 3
          },
          {
            id: 622,
            questionNumberLabel: 'Question 10',
            title: 'Longest Elimination Half-Life Among ARBs',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs have the longest elimination half-life?',
            options: [
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV',
              'Structure V'
            ],
            correctIndex: 4,
            optionExplanations: [
              'Incorrect: Structure I half-life is ~2 hours (EXP3174 is 6-9 hours).',
              'Incorrect: Structure II half-life is 6-9 hours.',
              'Incorrect: Structure III half-life is ~6 hours.',
              'Incorrect: Structure IV active metabolite half-life is 5-9 hours.',
              'Correct: Structure V (Telmisartan) has an elimination half-life of ~24 hours, the longest of all ARBs. It has high lipophilicity (bis-benzimidazole), extensive plasma protein binding (>99.5%), and slow receptor dissociation.'
            ],
            overallExplanation: 'Structure V (Telmisartan) exhibits the longest elimination half-life (~24h) due to high lipophilicity, multicyclic structure lacking the Phe-like carboxylic acid, and high volume of distribution.',
            highYieldPearl: 'Structure V (Telmisartan) = longest elimination half-life (~24h), highest lipophilicity, non-tetrazole ARB.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 22',
            sourcePageNumber: 3
          },
          {
            id: 623,
            questionNumberLabel: 'Question 11',
            title: 'Metabolism by Oxidative O-De-Ethylation',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is(are) hepatically metabolized by oxidative-O-de-ethylation?',
            options: [
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV',
              'Structure V'
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect: Structure I undergoes primary alcohol oxidation, not O-de-ethylation.',
              'Incorrect: Structure II has no ethoxy ether.',
              'Incorrect: Structure III lacks an ethoxy group.',
              'Correct: Structure IV (Candesartan cilexetil / Candesartan) possesses an ethoxy group (-OCH2CH3) on position-2 of the benzimidazole ring, which undergoes minor hepatic metabolism mediated by CYPs via oxidative O-de-ethylation.',
              'Incorrect: Structure V lacks an ethoxy group.'
            ],
            overallExplanation: 'Structure IV (Candesartan cilexetil / Candesartan) contains an ethoxy substituent on its benzimidazole nucleus that undergoes hepatic CYP-mediated oxidative O-de-ethylation to an inactive metabolite.',
            highYieldPearl: 'Structure IV (Candesartan): Ethoxy group on benzimidazole undergoes hepatic oxidative O-de-ethylation.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 23',
            sourcePageNumber: 3
          },
          {
            id: 624,
            questionNumberLabel: 'Question 12',
            title: 'Impact of Hepatic Dysfunction on ARB Clearance',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs may be affected by liver dysfunction?',
            options: [
              'Structures I, III, and V',
              'Structure II only',
              'Structure IV only',
              'None of the above'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structures I (Losartan), III (Valsartan), and V (Telmisartan) are significantly affected by liver dysfunction. Structure I requires hepatic CYPs to form its active metabolite EXP3174, while Structures III and V undergo >80-98% biliary/fecal elimination unchanged and accumulate in hepatic impairment.',
              'Incorrect: Not limited to Structure II.',
              'Incorrect: Not limited to Structure IV.',
              'Incorrect: Several ARBs require dose adjustment in hepatic failure.'
            ],
            overallExplanation: 'Hepatic dysfunction impairs the bioactivation of Structure I (Losartan to EXP3174) and markedly reduces the clearance of Structures III (Valsartan) and V (Telmisartan), which are eliminated almost exclusively via the hepatobiliary/fecal route.',
            highYieldPearl: 'Liver dysfunction affects Structure I (impaired EXP3174 bioactivation) and Structures III & V (>80-98% biliary excretion) -> dose reduction required.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 24',
            sourcePageNumber: 3
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // REVIEW PAGE 4: ARB Prodrug Activation & Elimination Pathways (Questions 25 - 26)
  // Source PDF: Page 4, Questions 25 - 26
  // ---------------------------------------------------------------------------
  {
    pageNumber: 4,
    title: 'ARB Prodrug Activation & Elimination Pathways',
    subtitle: 'GIT bioactivation, hepatic CYP oxidative de-ethylation, and organ clearance pathways',
    sections: [
      {
        sectionTitle: 'ARB GIT Bioactivation & Post-Activation Disposition',
        block_instructions: 'Continuing with ARB Structures I - V from Review Page 3, answer questions 25 - 26:',
        structures: [
          RAAS_STRUCTURES.losartan,
          RAAS_STRUCTURES.exp3174,
          RAAS_STRUCTURES.valsartan,
          RAAS_STRUCTURES.candesartan_cilexetil,
          RAAS_STRUCTURES.telmisartan,
        ],
        questions: [
          {
            id: 625,
            questionNumberLabel: 'Question 1',
            title: 'GIT Bioactivation Followed by Hepatic Metabolism',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs get(s) activated in GIT and after promoting the pharmacology get(s) hepatically metabolized for subsequent renal/fecal elimination?',
            options: [
              'Structure IV',
              'Structure I',
              'Structure III',
              'Structure V'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure IV (Candesartan cilexetil) is an ester/carbonate prodrug activated completely in the gastrointestinal tract during absorption to release candesartan. Because candesartan possesses an ethoxy group on its benzimidazole core, it undergoes hepatic CYP-mediated oxidative O-de-ethylation before subsequent biliary and renal excretion.',
              'Incorrect: Structure I is an active drug bioactivated in the liver (not GIT).',
              'Incorrect: Structure III is an active drug that does not require GIT bioactivation.',
              'Incorrect: Structure V is an active drug that is eliminated without significant hepatic metabolism.'
            ],
            overallExplanation: 'Structure IV (Candesartan cilexetil) is bioactivated by esterases in the GIT mucosa to active candesartan. Candesartan then undergoes minor hepatic metabolism (oxidative O-de-ethylation of the ethoxy group) prior to renal and fecal elimination.',
            highYieldPearl: 'Structure IV (Candesartan cilexetil) = activated in GIT during absorption -> undergoes hepatic oxidative O-de-ethylation -> dual fecal/renal elimination.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 4, Question 25',
            sourcePageNumber: 4
          },
          {
            id: 626,
            questionNumberLabel: 'Question 2',
            title: 'GIT Bioactivation Followed by Elimination Without Significant Hepatic Metabolism',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs get(s) activated in GIT and after promoting the pharmacology get(s) eliminated without significant hepatic metabolism?',
            options: [
              'None of the above (This describes Olmesartan medoxomil, which is activated in the GIT but eliminated largely unchanged without significant hepatic metabolism)',
              'Structure IV',
              'Structure I',
              'Structure V'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: None of the depicted structures (I - V) fits this description. Olmesartan medoxomil (not depicted) is activated in the GIT during absorption to olmesartan and then eliminated largely unchanged (50-65% renal, 30-50% fecal) without significant hepatic CYP metabolism. In contrast, Structure IV undergoes hepatic O-de-ethylation, and Structures I, III, and V are not GIT-activated prodrugs.',
              'Incorrect: Structure IV undergoes hepatic oxidative O-de-ethylation of its ethoxy group.',
              'Incorrect: Structure I is bioactivated in the liver, not the GIT.',
              'Incorrect: Structure V is not a prodrug.'
            ],
            overallExplanation: 'Olmesartan medoxomil is bioactivated in the gut wall and eliminated unchanged without hepatic metabolism. Among the depicted structures (I - V), Structure IV (Candesartan cilexetil) undergoes hepatic O-de-ethylation, while Structures I, III, and V are active parent drugs rather than GIT-activated prodrugs.',
            highYieldPearl: 'Olmesartan medoxomil is activated in the GIT and eliminated unchanged without CYP metabolism; Candesartan cilexetil (Structure IV) undergoes hepatic O-de-ethylation.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 4, Question 26',
            sourcePageNumber: 4
          }
        ]
      }
    ]
  }
];

export function getDefaultRaasModule(): ReviewModule {
  return {
    id: 'antihypertensives_4_mcp2',
    examId: 'exam_2',
    examTitle: 'Exam 2: Antihypertensives & Lipids',
    title: 'Antihypertensive Agents IV: RAAS Modifiers',
    subtitle: 'Direct Renin Inhibitors, ACE Inhibitors SAR & Zinc Binding, and Angiotensin II Receptor Blockers (ARBs)',
    course: 'Medicinal Chemistry & Pharmacology II',
    semester: 'Spring',
    code: 'MCP-2-06',
    isBuiltIn: true,
    version: '2.3.0',
    createdAt: new Date().toISOString(),
    chemicalStructures: Object.values(RAAS_STRUCTURES),
    pages: raasPages,
  };
}
