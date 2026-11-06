import { ReviewModule, ReviewPage } from '../../types/reviewModule';
import { RAAS_STRUCTURES } from './exam2Structures';

export const raasPages: ReviewPage[] = [
  // ---------------------------------------------------------------------------
  // PAGE 1: Direct Renin Inhibitors: Aliskiren (Questions 1 - 5)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 1,
    title: 'Direct Renin Inhibitors: Aliskiren SAR & Pharmacokinetics',
    subtitle: 'Transition-state peptidomimetics, catalytic aspartyl dyad binding, P-glycoprotein efflux, and CYP3A4 metabolism',
    sections: [
      {
        sectionTitle: 'Aliskiren: First-in-Class Direct Renin Inhibitor',
        block_instructions: 'Consider the chemical structure of Aliskiren (Tekturna) to answer questions 1 - 5. Pay attention to functional groups: (a) isopropyl/alkoxy ether, (b) terminal carboxamide, and (c) central hydroxyethylene transition-state mimic and amino group.',
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
            questionStem: 'Aliskiren was rationally designed as which type of enzyme inhibitor?',
            options: [
              'Substrate mimetic enzyme inhibitor',
              'Substrate mimetic receptor blocker',
              'Transition state mimetic enzyme inhibitor',
              'Allosteric non-competitive modulator',
              'Irreversible suicide inactivator'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: It mimics the high-energy transition state rather than the ground-state substrate.',
              'Incorrect: It targets the enzyme renin, not an adrenergic or angiotensin receptor.',
              'Correct: Aliskiren incorporates a non-cleavable hydroxyethylene isostere [-CH(OH)-CH2-] that mimics the tetrahedral transition state formed during renin-catalyzed scission of the Leu10-Val11 peptide bond of angiotensinogen.',
              'Incorrect: It binds competitively in the active site.',
              'Incorrect: It is a reversible inhibitor.'
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
            questionStem: 'Which functional group(s) in aliskiren engage directly with the key catalytic aspartate residues (Asp32 and Asp215) in the active site of human renin?',
            options: [
              'The terminal carboxamide group',
              'The methoxypropoxy lipophilic side chains',
              'The central secondary hydroxyl group and adjacent basic primary amine',
              'The phenyl ring alone'
            ],
            correctIndex: 2,
            optionExplanations: [
              'Incorrect: The terminal amide occupies the S3 subpocket.',
              'Incorrect: Methoxypropoxy chains occupy the deep S1/S3 hydrophobic pockets.',
              'Correct: The central secondary hydroxyl group and adjacent primary amino group form extensive hydrogen-bonding and electrostatic networks with the catalytic aspartyl dyad (Asp32 and Asp215) in the renin cleft, mimicking the water-mediated transition state.',
              'Incorrect: The phenyl ring occupies the S1 pocket.'
            ],
            overallExplanation: 'The central hydroxyl and amino functions coordinate directly between Asp32 and Asp215, displacing the catalytic water molecule and preventing peptide bond hydrolysis.',
            highYieldPearl: 'Catalytic aspartyl dyad (Asp32/Asp215) in renin cleft is engaged directly by aliskiren central hydroxyl and basic primary amine.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 1, Question 3',
            sourcePageNumber: 1
          },
          {
            id: 604,
            questionNumberLabel: 'Question 4',
            title: 'Mechanism of Action and PK Characteristics of Aliskiren',
            category: 'Pharmacokinetics ADME',
            type: 'sub-statements',
            questionStem: 'State whether each of the following statements is true or false regarding the mechanism of action and pharmacokinetics of aliskiren:',
            subStatements: [
              {
                id: 'a',
                text: 'It is a reversible, competitive active-site enzyme inhibitor.',
                isCorrect: true,
                explanation: 'True: Aliskiren binds reversibly to the active catalytic site of human renin with Ki ~0.6 nM.'
              },
              {
                id: 'b',
                text: 'It is an active site enzyme inhibitor that interferes with the conversion of angiotensin I to angiotensin II.',
                isCorrect: false,
                explanation: 'False: It inhibits renin, which converts angiotensinogen to angiotensin I. Conversion of Ang I to Ang II is mediated by ACE.'
              },
              {
                id: 'c',
                text: 'Its binding to the active site of renin is stereochemistry-dependent.',
                isCorrect: true,
                explanation: 'True: Aliskiren contains 4 chiral centers [(2S,4S,5S,7S)]; inversion of any stereocenter drastically reduces renin inhibitory potency.'
              },
              {
                id: 'd',
                text: 'Although it undergoes extensive P-glycoprotein efflux resulting in low oral bioavailability (~2.5%), aliskiren is an orally administered antihypertensive drug.',
                isCorrect: true,
                explanation: 'True: Aliskiren oral bioavailability is only ~2.5% due to poor mucosal permeability and P-gp efflux, but its high potency enables once-daily oral dosing.'
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
            questionStem: 'Which of the following Phase I transformations contribute to the minor hepatic metabolism of aliskiren mediated by CYP3A4?',
            options: [
              'Oxidative O-demethylation and benzylic oxidation',
              'Aromatic sulfonation and N-acetylation',
              'Hydrolytic ester cleavage',
              'Glucuronide conjugation of the amide'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Aliskiren is largely excreted unchanged in feces (~90%), with ~10% metabolized by CYP3A4 primarily via oxidative O-demethylation of the methoxypropoxy side chain and benzylic oxidation.',
              'Incorrect: Sulfonation and acetylation are Phase II reactions.',
              'Incorrect: Aliskiren contains no ester groups.',
              'Incorrect: Glucuronidation is Phase II.'
            ],
            overallExplanation: 'Aliskiren is predominantly eliminated unchanged by hepatobiliary/fecal excretion (>90%), with minor (~10%) Phase I metabolism by CYP3A4 involving O-demethylation and benzylic oxidation.',
            highYieldPearl: 'Aliskiren elimination: >90% eliminated unchanged in feces. Minor CYP3A4 metabolism (O-demethylation and benzylic oxidation).',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 1, Question 5',
            sourcePageNumber: 1
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 2: ACE Inhibitors SAR & Zinc-Binding Groups (Questions 6 - 17)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 2,
    title: 'ACE Inhibitors: Zinc Metalloprotease SAR, Binding Domains & Ester Prodrugs',
    subtitle: 'Sulfhydryl vs dicarboxylate vs phosphinate Zn-binders, lisinopril di-zwitterion, captopril adverse effects, and fosinopril dual clearance',
    sections: [
      {
        sectionTitle: 'ACE Inhibitor Core SAR & Chemical Classes',
        block_instructions: 'Consider Structures I (Captopril), II (Enalapril), III (Lisinopril), IV (Fosinopril), V (Ramipril), and VI (Enalaprilat) to answer questions 6 - 17.',
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
            questionNumberLabel: 'Question 6',
            title: 'Chemical Class of ACE Inhibitors',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following best describes the chemical class of the listed ACE inhibitors (Captopril, Enalapril, Lisinopril, Fosinopril, Ramipril)?',
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
            questionNumberLabel: 'Question 7',
            title: 'Mechanistic Class',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'What is the mechanistic class of the above drugs?',
            options: [
              'Potassium-sparing agents',
              'Loop diuretics',
              'Thiazide diuretics',
              'Calcium channel blockers',
              'Beta-Blockers',
              'Angiotensin-converting enzyme inhibitors (ACEIs)',
              'Angiotensin II receptor antagonists'
            ],
            correctIndex: 5,
            optionExplanations: [
              'Incorrect: Not potassium-sparing agents.',
              'Incorrect: Not loop diuretics.',
              'Incorrect: Not thiazides.',
              'Incorrect: Not CCBs.',
              'Incorrect: Not beta-blockers.',
              'Correct: They competitively inhibit angiotensin-converting enzyme (peptidyl dipeptidase A), blocking the conversion of inactive Ang I to potent vasoconstrictor Ang II and preventing the breakdown of bradykinin.',
              'Incorrect: Not ARBs.'
            ],
            overallExplanation: 'ACE inhibitors block the zinc metalloprotease ACE, suppressing Ang II production and aldosterone secretion while elevating vasodilating bradykinin levels.',
            highYieldPearl: 'ACE inhibitors: Inhibit Ang I -> Ang II conversion AND inhibit bradykinin degradation -> vasodilation + dry cough/angioedema.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 2, Question 7',
            sourcePageNumber: 2
          },
          {
            id: 608,
            questionNumberLabel: 'Question 8',
            title: 'ACE Inhibitor SAR and Zinc-Binding Principles',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'State whether each of the following statements is true or false regarding the SAR of ACE inhibitors:',
            subStatements: [
              {
                id: 'a',
                text: 'They are active-site competitive inhibitors of the zinc metalloprotease involved in angiotensin II biosynthesis.',
                isCorrect: true,
                explanation: 'True: ACE is a zinc-dependent dicarboxypeptidase; these drugs compete with Ang I for the active catalytic pocket.'
              },
              {
                id: 'b',
                text: 'They are irreversible enzyme inhibitors that permanently inactivate ACE.',
                isCorrect: false,
                explanation: 'False: ACE inhibitors are reversible, non-covalent competitive inhibitors.'
              },
              {
                id: 'c',
                text: 'They were rationally designed based on structural similarity to the tetrahedral transition state of peptide bond hydrolysis.',
                isCorrect: true,
                explanation: 'True: They mimic the tetrahedral intermediate of dipeptide cleavage.'
              },
              {
                id: 'd',
                text: 'A terminal carboxylate (mimicking the C-terminal carboxylate of Ang I) is an essential structural feature for ionic bonding with a conserved Arg/Lys residue.',
                isCorrect: true,
                explanation: 'True: The C-terminal proline/carboxylate is mandatory for electrostatic anchoring.'
              },
              {
                id: 'e',
                text: 'A peripheral phenylalkyl group (e.g., phenethyl group) optimizes binding by filling the hydrophobic S1 prime pocket.',
                isCorrect: true,
                explanation: 'True: The phenethyl substituent in enalaprilat and lisinopril binds deeply into the S1 prime subsite, dramatically increasing affinity.'
              },
              {
                id: 'f',
                text: 'The sulfhydryl (-SH) group is a more potent zinc-binding domain than carboxylate or phosphinate groups.',
                isCorrect: true,
                explanation: 'True: The thiol group coordinates tightly to the active-site Zn2+ ion, giving captopril high potency despite lacking the extended phenethyl group.'
              }
            ],
            overallExplanation: 'ACE inhibitors are reversible transition-state analogs possessing: (1) a zinc-binding group (-SH, -COO-, or -PO2-), (2) a central peptide-like backbone, (3) a C-terminal carboxylate, and (4) an S1 prime phenylalkyl substituent.',
            highYieldPearl: 'ACEI essential SAR: Zinc-binding group (SH > COO- = PO2-) + terminal carboxylate (binds Arg) + phenethyl group (fills S1\' pocket).',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 2, Question 8',
            sourcePageNumber: 2
          },
          {
            id: 609,
            questionNumberLabel: 'Question 9',
            title: 'Therapeutic Indications',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which diseases are primary clinical indications for ACE inhibitors?',
            options: [
              'Hypertension, Heart Failure with reduced ejection fraction (HFrEF), Post-myocardial infarction, and Diabetic Nephropathy',
              'Diabetes insipidus',
              'Asthma and COPD',
              'Peptic ulcer disease',
              'Bacterial endocarditis'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: ACE inhibitors are first-line for hypertension, reduce mortality and adverse remodeling in heart failure (HFrEF) and post-MI, and slow progressive proteinuria/renal decline in diabetic kidney disease.',
              'Incorrect: Not indicated for diabetes insipidus.',
              'Incorrect: ACEIs can induce bronchospasm/cough via bradykinin accumulation.',
              'Incorrect: Not for ulcers.',
              'Incorrect: Not antibiotics.'
            ],
            overallExplanation: 'ACE inhibitors improve survival in heart failure and post-MI, reduce systemic blood pressure, and provide renal protection in diabetic patients.',
            highYieldPearl: 'ACEIs are cardioprotective (reduce remodeling in HFrEF/post-MI) and renoprotective (dilate efferent arterioles in diabetic nephropathy).',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 2, Question 9',
            sourcePageNumber: 2
          },
          {
            id: 610,
            questionNumberLabel: 'Question 10',
            title: 'Classification by Zinc-Binding Domains',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following correctly pairs each ACE inhibitor with its specific Zinc-binding functional group?',
            options: [
              'Sulfhydryl: Captopril; Carboxylate: Enalaprilat, Lisinopril, Ramiprilat; Phosphinate: Fosinoprilat',
              'Sulfhydryl: Lisinopril; Carboxylate: Captopril; Phosphinate: Enalaprilat',
              'Sulfhydryl: Fosinoprilat; Carboxylate: Captopril; Phosphinate: Lisinopril',
              'All ACE inhibitors coordinate zinc through identical sulfhydryl groups'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Captopril is the prototype sulfhydryl-containing ACEI; enalaprilat, lisinopril, ramiprilat, and quinaprilat are dicarboxylate-containing ACEIs; fosinoprilat is the unique phosphinate-containing ACEI.',
              'Incorrect: Lisinopril contains a carboxylate, not a sulfhydryl.',
              'Incorrect: Inverted assignment.',
              'Incorrect: Different chemical classes utilize distinct zinc-chelating domains.'
            ],
            overallExplanation: 'ACE inhibitors are subclassified by their catalytic zinc-binding group: (1) Sulfhydryl (Captopril), (2) Dicarboxylate (Enalaprilat, Lisinopril, Ramiprilat, Quinaprilat, Benazeprilat), and (3) Phosphinate (Fosinoprilat).',
            highYieldPearl: 'ACEI Zinc-binding groups: Sulfhydryl = Captopril. Carboxylate = Enalaprilat/Lisinopril/Ramiprilat. Phosphinate = Fosinoprilat.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 2, Question 10',
            sourcePageNumber: 2
          },
          {
            id: 611,
            questionNumberLabel: 'Question 11',
            title: 'Active Drugs vs Ester Prodrugs in ACEI Class',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following ACE inhibitors are ACTIVE DRUGS in the administered form (do not require hepatic bioactivation)?',
            options: [
              'Captopril and Lisinopril',
              'Enalapril and Ramipril',
              'Fosinopril and Quinapril',
              'Benazepril and Moexipril'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Captopril (free sulfhydryl) and Lisinopril (lysine di-zwitterion) are active drugs administered directly without esterification. In contrast, enalapril, ramipril, fosinopril, quinapril, and benazepril are inactive ester prodrugs.',
              'Incorrect: Enalapril and ramipril are ethyl ester prodrugs.',
              'Incorrect: Fosinopril and quinapril are ester prodrugs.',
              'Incorrect: Benazepril and moexipril are ester prodrugs.'
            ],
            overallExplanation: 'Only Captopril and Lisinopril are administered as active non-prodrug ACE inhibitors. All dicarboxylate congeners ending in "-pril" (except lisinopril) are ethyl ester prodrugs bioactivated by hepatic carboxylesterases to active "-prilat" di-acids.',
            highYieldPearl: 'Active (non-prodrug) ACEIs = Captopril & Lisinopril. All other oral ACEIs are ester prodrugs requiring hepatic esterase cleavage.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 2, Question 11',
            sourcePageNumber: 2
          },
          {
            id: 612,
            questionNumberLabel: 'Question 12',
            title: 'IV-Only Di-Acid ACE Inhibitor',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the following ACE inhibitors has very poor oral bioavailability due to two ionized carboxylates and is exclusively formulated as an INTRAVENOUS injection (Vasotec IV)?',
            options: [
              'Captopril',
              'Enalaprilat (Drug VI)',
              'Lisinopril',
              'Fosinopril'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Captopril is orally bioavailable.',
              'Correct: Enalaprilat is the active di-acid metabolite of enalapril. Its two carboxylic acids and basic secondary amine form a hydrophilic tri-ionic species with <3% oral bioavailability, necessitating parenteral IV formulation for acute hypertension.',
              'Incorrect: Lisinopril is orally active.',
              'Incorrect: Fosinopril is an oral prodrug.'
            ],
            overallExplanation: 'Enalaprilat possesses two negatively charged carboxylates and a protonated amine at intestinal pH, preventing passive membrane diffusion (<3% bioavailability). It is formulated as an IV injection.',
            highYieldPearl: 'Enalaprilat = active di-acid, poor oral absorption (<3%), formulated for IV injection only. Enalapril = oral ethyl ester prodrug.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 2, Question 12',
            sourcePageNumber: 2
          },
          {
            id: 613,
            questionNumberLabel: 'Question 13',
            title: 'Lisinopril Di-Zwitterion Concept',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs exists as a di-zwitterion in aqueous solution, permitting oral administration as an ACTIVE drug without ester prodrug modification?',
            options: [
              'Captopril',
              'Lisinopril (Drug III)',
              'Enalapril',
              'Fosinopril'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Captopril is not a di-zwitterion.',
              'Correct: Lisinopril contains a basic lysine side chain replacing the alanine methyl group. At physiological pH, the two positive charges (secondary amine and lysine epsilon-amino group) balance the two negative charges (two carboxylates), creating an overall neutral di-zwitterion that can cross the intestinal mucosa (~25-30% bioavailability) as an active drug.',
              'Incorrect: Enalapril is an ester prodrug.',
              'Incorrect: Fosinopril is a phosphinate ester prodrug.'
            ],
            overallExplanation: 'Lisinopril incorporates a basic lysine residue that forms an intramolecular di-zwitterion (two positive and two negative charges). This balanced net neutrality allows sufficient oral absorption without esterification.',
            highYieldPearl: 'Lisinopril = active non-prodrug di-acid. The basic lysine epsilon-amine forms a di-zwitterion that allows oral absorption without an ester prodrug!',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 13',
            sourcePageNumber: 3
          },
          {
            id: 614,
            questionNumberLabel: 'Question 14',
            title: 'Adverse Effects Specific to Captopril: Thiol-Mediated Toxicities',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is uniquely associated with maculopapular skin rash, metallic taste disturbance (dysgeusia), and rare agranulocytosis?',
            options: [
              'Captopril (Drug I), due to its free sulfhydryl (-SH) group',
              'Lisinopril, due to its lysine chain',
              'Enalapril, due to its ethyl ester',
              'Fosinopril, due to its phosphorus atom'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: The free sulfhydryl group of captopril forms mixed disulfides with tissue proteins, triggering immune-mediated skin rashes, taste loss/metallic dysgeusia, and rare neutropenia. These adverse effects led directly to the development of non-thiol (dicarboxylate) ACEIs.',
              'Incorrect: Lisinopril does not contain a thiol group and rarely causes dysgeusia.',
              'Incorrect: Enalapril is free of thiol-related toxicities.',
              'Incorrect: Fosinopril does not have a thiol group.'
            ],
            overallExplanation: 'Captopril sulfhydryl (-SH) group causes a high incidence of taste disturbances (dysgeusia), maculopapular eruptions, and neutropenia via disulfide haptenation.',
            highYieldPearl: 'Captopril sulfhydryl group (-SH) = taste disturbances (metallic taste / dysgeusia), skin rash, and short half-life.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 14',
            sourcePageNumber: 3
          },
          {
            id: 615,
            questionNumberLabel: 'Question 15',
            title: 'Shortest Duration of Action Among ACEIs',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs has the shortest duration of action (t1/2 < 2 hours), requiring BID to TID dosing?',
            options: [
              'Captopril, because it rapidly oxidizes and forms mixed disulfides with endogenous thiols',
              'Lisinopril, due to rapid renal tubular secretion',
              'Ramipril, due to rapid glucuronidation',
              'Fosinopril, due to dual elimination'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Captopril has an elimination half-life of 1.5-2 hours. The nucleophilic sulfhydryl group rapidly dimerizes to captopril disulfide or conjugates with albumin and cysteine, requiring dosing two to three times daily.',
              'Incorrect: Lisinopril has a half-life of ~12 hours (once daily).',
              'Incorrect: Ramipril has a long terminal half-life (once daily).',
              'Incorrect: Fosinopril is once daily.'
            ],
            overallExplanation: 'Captopril is rapidly cleared and forms inactive mixed disulfides, giving a short duration of action requiring TID dosing.',
            highYieldPearl: 'Captopril = shortest duration of action (t1/2 < 2h, TID dosing). Newer dicarboxylate ACEIs (Lisinopril, Ramipril) are once-daily.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 15',
            sourcePageNumber: 3
          },
          {
            id: 616,
            questionNumberLabel: 'Question 16',
            title: 'Hepatic Carboxylesterase Bioactivation',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the listed drugs are ethyl ester prodrugs that must be hydrolyzed by hepatic carboxylesterase 1 (CES1) to release their active di-acid forms?',
            options: [
              'Enalapril (to Enalaprilat) and Ramipril (to Ramiprilat)',
              'Captopril and Lisinopril',
              'Aliskiren and Losartan',
              'Diazoxide and Minoxidil'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Enalapril and ramipril are monoethyl ester prodrugs. Hepatic carboxylesterase 1 cleaves the ethyl ester to reveal the active carboxylate zinc-binding domain (enalaprilat, ramiprilat).',
              'Incorrect: Captopril and lisinopril are active parent drugs.',
              'Incorrect: Aliskiren is not an ester prodrug.',
              'Incorrect: Diazoxide is not an ester prodrug.'
            ],
            overallExplanation: 'Enalapril, Ramipril, Quinapril, and Benazepril are ethyl ester prodrugs bioactivated in the liver by carboxylesterases.',
            highYieldPearl: 'Enalapril, Ramipril, Benazepril, Quinapril = ethyl ester prodrugs -> [hepatic CES1] -> active di-acid "-prilat".',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 16',
            sourcePageNumber: 3
          },
          {
            id: 617,
            questionNumberLabel: 'Question 17',
            title: 'Compensatory Dual Elimination: Fosinopril in Organ Impairment',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which ACE inhibitor is unique in having balanced dual elimination (50% renal and 50% hepatobiliary), requiring NO dosage adjustment in patients with moderate-to-severe renal or hepatic impairment?',
            options: [
              'Captopril',
              'Lisinopril',
              'Enalapril',
              'Fosinopril (Monopril)'
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect: Captopril accumulates in renal failure.',
              'Incorrect: Lisinopril is cleared 100% renally and requires major dose reduction in renal failure.',
              'Incorrect: Enalaprilat accumulates in renal failure.',
              'Correct: Fosinoprilat is cleared equally by the kidneys (50%) and the liver/biliary system (50%). If renal function declines, hepatobiliary elimination compensates, avoiding dangerous drug accumulation.'
            ],
            overallExplanation: 'Fosinopril possesses compensatory dual elimination: when renal clearance decreases, biliary excretion increases proportionally, eliminating the need for dose reductions in renal impairment.',
            highYieldPearl: 'Fosinopril = balanced dual elimination (50% renal / 50% biliary). Preferred ACEI in renal impairment because the liver compensates!',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 17',
            sourcePageNumber: 3
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 3: Angiotensin II Receptor Blockers (ARBs) SAR & Metabolism (Questions 18 - 26)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 3,
    title: 'Angiotensin II Receptor Blockers (ARBs): AT1 Antagonists & Pharmacokinetics',
    subtitle: 'Tetrazole biphenyl core, Losartan to EXP3174 bioactivation, ester prodrugs (Candesartan, Olmesartan), and Telmisartan long half-life',
    sections: [
      {
        sectionTitle: 'ARB Mechanistic Class & Peptidomimetic Design',
        block_instructions: 'Consider Structures I (Losartan), II (EXP3174), III (Valsartan), IV (Candesartan cilexetil), and V (Telmisartan) to answer questions 18 - 26.',
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
            questionNumberLabel: 'Question 18',
            title: 'Mechanistic Class of ARBs',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'What is the mechanistic class of Losartan, Valsartan, Candesartan, and Telmisartan?',
            options: [
              'Potassium-sparing agents',
              'Loop diuretics',
              'Thiazide diuretics',
              'Calcium channel blockers',
              'Beta-Blockers',
              'Angiotensin-converting enzyme inhibitors',
              'Angiotensin II receptor antagonists (AT1 receptor blockers / ARBs)',
              'Direct renin inhibitors'
            ],
            correctIndex: 6,
            optionExplanations: [
              'Incorrect: Not diuretics.',
              'Incorrect: Not CCBs.',
              'Incorrect: Not beta-blockers.',
              'Incorrect: Not ACE inhibitors (they do not inhibit ACE or prevent bradykinin degradation).',
              'Correct: ARBs selectively bind and competitively block the angiotensin II type 1 (AT1) receptor on vascular smooth muscle, adrenal cortex, and renal mesangial cells, preventing Ang II vasoconstriction and aldosterone release.',
              'Incorrect: Aliskiren is the renin inhibitor.'
            ],
            overallExplanation: 'ARBs selectively block AT1 receptors without inhibiting ACE or altering bradykinin metabolism, resulting in a markedly lower incidence of dry cough and angioedema compared to ACE inhibitors.',
            highYieldPearl: 'ARBs selectively block AT1 receptors -> block Ang II actions without increasing bradykinin -> no ACEI dry cough!',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 18',
            sourcePageNumber: 3
          },
          {
            id: 619,
            questionNumberLabel: 'Question 19',
            title: 'Peptidomimetic Mimicry of Angiotensin II',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which region of endogenous Angiotensin II is mimicked by the biphenyl-tetrazole and imidazole scaffold of ARBs?',
            options: [
              'The N-terminal Asp1-Arg2 dipeptide',
              'The C-terminal tetrapeptide sequence (Ile5-His6-Pro7-Phe8)',
              'The central Val3-Tyr4 bond',
              'The bradykinin sequence'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: The N-terminus is not mimicked.',
              'Correct: ARBs were rationally designed to mimic the C-terminal tetrapeptide of Ang II: the imidazole ring mimics His6, the butyl chain mimics the Ile5 side chain, and the acidic biphenyl-tetrazole/carboxylate mimics the terminal Phe8 aromatic ring and carboxylate.',
              'Incorrect: Not central residues.',
              'Incorrect: ARBs do not mimic bradykinin.'
            ],
            overallExplanation: 'ARBs mimic the bioactive C-terminal conformation of Ang II (Ile-His-Pro-Phe). The acidic tetrazole/carboxylic acid overlays with the C-terminal Phe8 carboxylate.',
            highYieldPearl: 'ARB pharmacophore: Imidazole mimics His6; n-butyl chain mimics Ile5; biphenyl-tetrazole mimics Phe8 and forms ionic bond with Arg167 in AT1 receptor.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 19',
            sourcePageNumber: 3
          },
          {
            id: 620,
            questionNumberLabel: 'Question 20',
            title: 'Hepatic Bioactivation of Losartan to EXP3174',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above ARBs is hepatically metabolized to a metabolite that is 10 to 40 times MORE POTENT than the parent drug, and what is this active metabolite?',
            options: [
              'Losartan (Drug I) is metabolized by CYP2C9 and CYP3A4 to EXP3174 (Drug II, 5-carboxylic acid metabolite)',
              'Valsartan is metabolized to valproic acid',
              'Candesartan is metabolized to benzoic acid',
              'Telmisartan is metabolized to a glucuronide'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Losartan is oxidized at its imidazole 5-hydroxymethyl group by CYP2C9 and CYP3A4 into a 5-carboxylic acid metabolite designated EXP3174. EXP3174 is 10-40x more potent than losartan, acts as an insurmountable/non-competitive AT1 blocker, and accounts for most of the clinical hypotensive effect.',
              'Incorrect: Valsartan is not metabolized to valproic acid.',
              'Incorrect: Candesartan is an active di-acid generated by ester cleavage.',
              'Incorrect: Telmisartan glucuronidation is an inactivation pathway.'
            ],
            overallExplanation: 'Losartan is a competitive antagonist, but its 5-carboxylic acid metabolite EXP3174 is 10-40 times more potent, has a longer half-life (6-9h vs 2h), and binds insurmountably to the AT1 receptor.',
            highYieldPearl: 'Losartan -> [CYP2C9/3A4] -> EXP3174 (5-carboxylic acid): 10-40x more potent, non-competitive/insurmountable antagonist, drives clinical efficacy!',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 20',
            sourcePageNumber: 3
          },
          {
            id: 621,
            questionNumberLabel: 'Question 21',
            title: 'Carbonate / Ester Prodrug ARBs Activated During GI Absorption',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following ARBs are formulated as ester or carbonate PRODRUGS that are completely hydrolyzed to active drugs during gastrointestinal absorption?',
            options: [
              'Candesartan cilexetil and Olmesartan medoxomil',
              'Losartan and Valsartan',
              'Telmisartan and Eprosartan',
              'Irbesartan'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Candesartan cilexetil (cyclohexyloxycarbonyloxyethyl ester) and Olmesartan medoxomil (medoxomil ester) are lipid-soluble prodrugs that undergo rapid, complete esterase cleavage in the intestinal wall to release active candesartan and olmesartan.',
              'Incorrect: Losartan and valsartan are administered directly as active drugs.',
              'Incorrect: Telmisartan and eprosartan are active drugs.',
              'Incorrect: Irbesartan is an active drug.'
            ],
            overallExplanation: 'Candesartan and Olmesartan have free carboxylates that impede intestinal absorption; masking them as acyloxyalkyl/carbonate prodrugs (cilexetil, medoxomil) permits oral absorption followed by quantitative esterase cleavage.',
            highYieldPearl: 'ARB prodrugs: Candesartan cilexetil and Olmesartan medoxomil. Cleaved by intestinal esterases during absorption to active free acids.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 21',
            sourcePageNumber: 3
          },
          {
            id: 622,
            questionNumberLabel: 'Question 22',
            title: 'Longest Elimination Half-Life Among ARBs: Telmisartan',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above ARBs has the longest elimination half-life (~24 hours) and highest receptor affinity, and lacks a tetrazole ring?',
            options: [
              'Losartan (t1/2 ~2h)',
              'Valsartan (t1/2 ~6h)',
              'Candesartan (t1/2 ~9h)',
              'Telmisartan (t1/2 ~24 hours)'
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect: Losartan half-life is 2 hours (EXP3174 is 6-9h).',
              'Incorrect: Valsartan half-life is 6 hours.',
              'Incorrect: Candesartan half-life is 9 hours.',
              'Correct: Telmisartan (Micardis) has an elimination half-life of ~24 hours, the longest of all ARBs. It uniquely replaces the acidic tetrazole ring with a carboxylic acid attached to a lipophilic bis-benzimidazole scaffold, also providing PPAR-gamma partial agonism.'
            ],
            overallExplanation: 'Telmisartan is the longest-acting ARB (t1/2 ~24h) due to high lipophilicity, high volume of distribution, and slow dissociation from the AT1 receptor. It lacks the tetrazole ring common to most ARBs.',
            highYieldPearl: 'Telmisartan = longest half-life (~24h), non-tetrazole ARB (carboxylic acid + bis-benzimidazole), partial PPAR-gamma agonist.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 22',
            sourcePageNumber: 3
          },
          {
            id: 623,
            questionNumberLabel: 'Question 23',
            title: 'Metabolism by Oxidative O-De-Ethylation',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which ARB undergoes minor hepatic Phase I metabolism mediated by CYP-dependent oxidative O-de-ethylation?',
            options: [
              'Candesartan / Azilsartan',
              'Losartan',
              'Valsartan',
              'Telmisartan'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Candesartan and azilsartan contain an ethoxy ether on their benzimidazole ring; minor hepatic metabolism involves CYP-catalyzed oxidative O-de-ethylation to an inactive hydroxy-benzimidazole.',
              'Incorrect: Losartan undergoes primary alcohol oxidation to carboxylic acid.',
              'Incorrect: Valsartan undergoes minimal CYP metabolism.',
              'Incorrect: Telmisartan undergoes exclusively 1-O-acylglucuronidation.'
            ],
            overallExplanation: 'Candesartan and azilsartan have an ethoxy substituent that can undergo minor oxidative O-de-ethylation by CYPs.',
            highYieldPearl: 'Candesartan benzimidazole ethoxy group can undergo minor oxidative O-de-ethylation.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 23',
            sourcePageNumber: 3
          },
          {
            id: 624,
            questionNumberLabel: 'Question 24',
            title: 'Impact of Hepatic Impairment on ARB Disposition',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which ARBs are most significantly affected by severe liver dysfunction (requiring major dose reduction or contraindication) because they are almost exclusively cleared by biliary excretion or require hepatic bioactivation?',
            options: [
              'Losartan (reduced EXP3174 activation) and Telmisartan / Valsartan (>98% biliary excretion)',
              'Lisinopril',
              'Atenolol',
              'Nadolol'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Telmisartan and Valsartan are cleared >98% unchanged via bile into feces; hepatic impairment dramatically increases drug exposure. In addition, Losartan requires hepatic CYPs to form its active metabolite EXP3174.',
              'Incorrect: Lisinopril is renally cleared.',
              'Incorrect: Atenolol is renally cleared.',
              'Incorrect: Nadolol is renally cleared.'
            ],
            overallExplanation: 'Telmisartan, Valsartan, and Irbesartan are eliminated primarily via biliary excretion, making hepatic dysfunction the major determinant of clearance (unlike ACEIs, which are mostly renal).',
            highYieldPearl: 'Telmisartan & Valsartan are eliminated >98% via hepatobiliary/fecal excretion -> caution and dose reduction in hepatic impairment!',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 3, Question 24',
            sourcePageNumber: 3
          },
          {
            id: 625,
            questionNumberLabel: 'Question 25',
            title: 'Prodrug Activation in Gut Followed by Hepatic Metabolism',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the following describes an ARB that is bioactivated by esterase cleavage during GI absorption and subsequently undergoes hepatic metabolism prior to elimination?',
            options: [
              'Olmesartan medoxomil (bioactivated to olmesartan in gut wall and partially metabolized)',
              'Lisinopril',
              'Aliskiren',
              'Captopril'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Olmesartan medoxomil is rapidly and completely de-esterified to olmesartan during absorption in the GI tract, followed by systemic distribution and dual renal/biliary elimination.',
              'Incorrect: Lisinopril is not a prodrug.',
              'Incorrect: Aliskiren is not an ester prodrug.',
              'Incorrect: Captopril is not an ester prodrug.'
            ],
            overallExplanation: 'Ester prodrug ARBs (olmesartan medoxomil, candesartan cilexetil) are cleaved in gut mucosal cells and liver esterases to liberate active di-acid blockers.',
            highYieldPearl: 'Olmesartan medoxomil: Medoxomil ester cleaved in gut mucosa -> active olmesartan.',
            sourceReference: 'Review for Antihypertensive Drugs IV (RAAS Modifiers), Page 4, Question 25',
            sourcePageNumber: 4
          },
          {
            id: 626,
            questionNumberLabel: 'Question 26',
            title: 'Prodrug Activation with Negligible Hepatic CYP Metabolism',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the following ARB prodrugs is rapidly bioactivated in the gastrointestinal tract and then eliminated largely UNCHANGED (renal and biliary) without significant CYP-mediated hepatic metabolism?',
            options: [
              'Candesartan cilexetil (hydrolyzed to candesartan, which is excreted largely unchanged)',
              'Losartan (relies on extensive CYP oxidation)',
              'Amlodipine',
              'Propranolol'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Candesartan cilexetil is completely cleaved during GI absorption to candesartan. Once active, candesartan undergoes negligible CYP metabolism (<5%) and is eliminated unchanged via renal filtration (33%) and biliary excretion (67%).',
              'Incorrect: Losartan undergoes extensive CYP metabolism.',
              'Incorrect: Amlodipine is a CCB.',
              'Incorrect: Propranolol is heavily metabolized by CYPs.'
            ],
            overallExplanation: 'Candesartan is released from its cilexetil ester during absorption and excreted unchanged through urine and bile, minimizing CYP drug-drug interactions.',
            highYieldPearl: 'Candesartan cilexetil: 100% bioactivated to candesartan during absorption -> eliminated unchanged (33% renal / 67% biliary) without CYP interactions.',
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
    createdAt: new Date().toISOString(),
    chemicalStructures: Object.values(RAAS_STRUCTURES),
    pages: raasPages,
  };
}
