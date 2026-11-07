import { ReviewModule, ReviewPage } from '../../types/reviewModule';
import { LIPIDS_STRUCTURES } from './exam2Structures';

// ---------------------------------------------------------------------------
// Page-specific structure overlays ensuring clean Roman numeral extraction
// ---------------------------------------------------------------------------

const PAGE_1_STRUCTURES = [
  { ...LIPIDS_STRUCTURES.lovastatin, document_label: 'Structure I' },
  { ...LIPIDS_STRUCTURES.simvastatin, document_label: 'Structure II' },
  { ...LIPIDS_STRUCTURES.pravastatin, document_label: 'Structure III' },
  { ...LIPIDS_STRUCTURES.atorvastatin, document_label: 'Structure IV' },
  { ...LIPIDS_STRUCTURES.rosuvastatin, document_label: 'Structure V' },
];

const PAGE_2_STRUCTURES = [
  { ...LIPIDS_STRUCTURES.lovastatin, document_label: 'Structure I' },
  { ...LIPIDS_STRUCTURES.simvastatin, document_label: 'Structure II' },
  { ...LIPIDS_STRUCTURES.pravastatin, document_label: 'Structure III' },
  { ...LIPIDS_STRUCTURES.atorvastatin, document_label: 'Structure IV' },
  { ...LIPIDS_STRUCTURES.rosuvastatin, document_label: 'Structure V' },
  { ...LIPIDS_STRUCTURES.atorvastatin, id: 'atorvastatin_drug_x', document_label: 'Drug X' },
  { ...LIPIDS_STRUCTURES.rosuvastatin, id: 'rosuvastatin_drug_y', document_label: 'Drug Y' },
];

const PAGE_3_STRUCTURES = [
  { ...LIPIDS_STRUCTURES.atorvastatin, document_label: 'Structure I' },
  { ...LIPIDS_STRUCTURES.lomitapide, document_label: 'Structure II' },
  { ...LIPIDS_STRUCTURES.ezetimibe, document_label: 'Structure III' },
  { ...LIPIDS_STRUCTURES.fenofibrate, document_label: 'Structure IV' },
  { ...LIPIDS_STRUCTURES.niacin, document_label: 'Structure V' },
  { ...LIPIDS_STRUCTURES.cholestyramine, document_label: 'Structure VI' },
];

const PAGE_4_STRUCTURES = [
  { ...LIPIDS_STRUCTURES.ezetimibe, document_label: 'Drug X' },
  { ...LIPIDS_STRUCTURES.cholestyramine, document_label: 'Drug Y' },
];

const PAGE_5_STRUCTURES = [
  { ...LIPIDS_STRUCTURES.lomitapide, document_label: 'Drug Z' },
  { ...LIPIDS_STRUCTURES.gemfibrozil, document_label: 'Molecule I' },
  { ...LIPIDS_STRUCTURES.fenofibrate, document_label: 'Molecule II' },
];

export const antihyperlipidemicsPages: ReviewPage[] = [
  // ---------------------------------------------------------------------------
  // REVIEW PAGE 1: HMG-CoA Reductase Inhibitors (Statins) Overview (Q1 - Q4)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 1,
    title: 'Anti-hyperlipidemics: HMG-CoA Reductase Inhibitors (Statins)',
    subtitle: 'Chemical class, mechanism of action, therapeutic indications, and transition-state pharmacophore foundations',
    sections: [
      {
        sectionTitle: 'HMG-CoA Reductase Inhibitors: Structures I - V',
        block_instructions: 'Consider Structures I (Lovastatin), II (Simvastatin), III (Pravastatin), IV (Atorvastatin), and V (Rosuvastatin) to answer questions (1 - 4):',
        structures: PAGE_1_STRUCTURES,
        questions: [
          {
            id: 701,
            questionNumberLabel: 'Question 1',
            title: 'Chemical Class of Statins',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following best describes the chemical class of the above molecules?',
            options: [
              'Benzothiadiazine-1,1-dioxide',
              '1,4-Dihydropyridine',
              'Steroid',
              'Aryloxypropanolamine',
              'Arylethanolamine',
              'Peptidomimetics',
              'Sulfamoyl anthranilic acid',
              '7-Substituted 3,5-dihydroxyheptanoic acids'
            ],
            correctIndex: 7,
            optionExplanations: [
              'Incorrect: Benzothiadiazine-1,1-dioxides are thiazide diuretics.',
              'Incorrect: 1,4-Dihydropyridines are voltage-gated L-type calcium channel blockers.',
              'Incorrect: Steroids possess a cyclopentanoperhydrophenanthrene four-ring nucleus.',
              'Incorrect: Aryloxypropanolamines are beta-adrenergic receptor blockers (e.g., propranolol).',
              'Incorrect: Arylethanolamines are mixed adrenergic blockers or agonists (e.g., labetalol).',
              'Incorrect: Peptidomimetics mimic peptide chains (e.g., ACE inhibitors).',
              'Incorrect: Sulfamoyl anthranilic acid describes loop diuretics (e.g., furosemide).',
              'Correct: Statins contain an essential 7-carbon carboxylic acid chain (or corresponding delta-lactone prodrug) bearing 3,5-dihydroxy substituents that mimic the HMG substrate and tetrahedral transition state.'
            ],
            overallExplanation: 'The defining chemical class of statins is 7-substituted (3R,5R)-3,5-dihydroxyheptanoic (or hept-6-enoic) acids, attached to either a partially reduced decalin ring system (fungal statins) or a bulky heterocyclic aromatic system (synthetic statins).',
            highYieldPearl: 'Statin pharmacophore = 7-substituted (3R,5R)-3,5-dihydroxyheptanoic acid. Mimics the tetrahedral hemithioacetal transition state of HMG-CoA.',
            sourceReference: 'Review for Antihyperlipidemics, Page 1, Question 1',
            sourcePageNumber: 1
          },
          {
            id: 702,
            questionNumberLabel: 'Question 2',
            title: 'Mechanistic Class',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'What is the mechanistic class of the above drugs?',
            options: [
              'Potassium sparing agents',
              'Loop diuretics',
              'Thiazide diuretics',
              'Calcium channel blockers',
              'Beta-Blockers',
              'Angiotensin converting enzyme inhibitors',
              'Angiotensin II receptor antagonists',
              'HMG CoA reductase inhibitors'
            ],
            correctIndex: 7,
            optionExplanations: [
              'Incorrect: Potassium-sparing agents inhibit renal ENaC or mineralocorticoid receptors.',
              'Incorrect: Loop diuretics inhibit the Na+/K+/2Cl- symporter in the loop of Henle.',
              'Incorrect: Thiazide diuretics inhibit the Na+/Cl- cotransporter in the distal tubule.',
              'Incorrect: Calcium channel blockers block L-type Ca2+ influx in cardiac and smooth muscle.',
              'Incorrect: Beta-blockers antagonize beta-adrenergic receptors.',
              'Incorrect: ACE inhibitors block the conversion of Ang I to Ang II.',
              'Incorrect: ARBs block AT1 receptors.',
              'Correct: Statins competitively inhibit 3-hydroxy-3-methylglutaryl-coenzyme A (HMG-CoA) reductase, the rate-limiting enzyme in de novo hepatic cholesterol biosynthesis.'
            ],
            overallExplanation: 'Statins competitively inhibit HMG-CoA reductase, reducing de novo intracellular cholesterol synthesis in hepatocytes. This triggers SREBP-2 processing and upregulates cell-surface LDL receptors, clearing circulating ApoB-containing atherogenic lipoproteins (LDL-C).',
            highYieldPearl: 'Statins competitively inhibit HMG-CoA reductase -> intracellular cholesterol depletes -> LDL receptors upregulate on hepatocytes -> plasma LDL decreases 25-60%.',
            sourceReference: 'Review for Antihyperlipidemics, Page 1, Question 2',
            sourcePageNumber: 1
          },
          {
            id: 703,
            questionNumberLabel: 'Question 3',
            title: 'Therapeutic Indications',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'The above drugs are mainly used to treat which of the following diseases?',
            options: [
              'Diabetes',
              'Hypertension',
              'Chronic obstructive pulmonary diseases',
              'Peptic ulcer',
              'Bacterial infection',
              'Cancer',
              'Depression',
              'Atherosclerosis/Hyperlipidemia'
            ],
            correctIndex: 7,
            optionExplanations: [
              'Incorrect: Statins are not hypoglycemic agents; in fact, high-dose statins carry a small risk of new-onset diabetes.',
              'Incorrect: Statins do not directly lower blood pressure, although they provide pleiotropic endothelial benefits.',
              'Incorrect: Bronchodilators and anti-inflammatories manage COPD.',
              'Incorrect: H2 blockers and PPIs treat peptic ulcer disease.',
              'Incorrect: Antibiotics treat bacterial infections.',
              'Incorrect: Chemotherapeutic agents treat malignancies.',
              'Incorrect: Antidepressants treat mood disorders.',
              'Correct: Statins are first-line cornerstone therapies for primary hypercholesterolemia, mixed dyslipidemia, and prevention/treatment of atherosclerotic cardiovascular disease (ASCVD).'
            ],
            overallExplanation: 'HMG-CoA reductase inhibitors are primarily indicated for the treatment of hyperlipidemia and dyslipidemia and for secondary and primary prevention of atherosclerotic cardiovascular events (myocardial infarction, stroke, cardiovascular death).',
            highYieldPearl: 'First-line therapy for ASCVD and hypercholesterolemia = Statins (HMG-CoA reductase inhibitors).',
            sourceReference: 'Review for Antihyperlipidemics, Page 1, Question 3',
            sourcePageNumber: 1
          },
          {
            id: 704,
            questionNumberLabel: 'Question 4',
            title: 'Statin Pharmacophore & Target Interactions True/False',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'State whether each of the following statements is true or false regarding the above statin molecules:',
            subStatements: [
              {
                id: 'a',
                text: 'They are receptor antagonists.',
                isCorrect: false,
                explanation: 'False: Statins are enzyme inhibitors (specifically of HMG-CoA reductase), not cell-surface or nuclear receptor antagonists.'
              },
              {
                id: 'b',
                text: 'They are enzyme inhibitors.',
                isCorrect: true,
                explanation: 'True: They reversibly and competitively inhibit the rate-limiting enzyme HMG-CoA reductase.'
              },
              {
                id: 'c',
                text: 'They are transporter blockers.',
                isCorrect: false,
                explanation: 'False: They are not transporter blockers (e.g., Ezetimibe blocks NPC1L1 transporter, but statins inhibit an intracellular enzyme).'
              },
              {
                id: 'd',
                text: 'They are competitive, active site inhibitors of the drug target.',
                isCorrect: true,
                explanation: 'True: They bind directly into the active catalytic pocket of HMG-CoA reductase, competitively displacing HMG-CoA.'
              },
              {
                id: 'e',
                text: 'They are transition state mimetics.',
                isCorrect: true,
                explanation: 'True: The (3R,5R)-dihydroxycarboxylate headgroup mimics the 3,5-dihydroxy hemithioacetal tetrahedral intermediate formed during reduction of HMG-CoA to mevalonate.'
              },
              {
                id: 'f',
                text: 'Stereochemistry of chiral centers at positions-3 and -5 are strictly determined.',
                isCorrect: true,
                explanation: 'True: The 3R, 5R absolute configuration is strictly required for optimal hydrogen bonding with the enzyme; unnatural stereoisomers are 100- to 10,000-fold less active.'
              },
              {
                id: 'g',
                text: 'The pharmacophore should include two domains "transition-state like" and "affinity" separated by 3-atom spacer.',
                isCorrect: false,
                explanation: 'False: The transition-state dihydroxy acid domain and the bulky hydrophobic affinity domain are separated by a 2-carbon spacer (e.g., -CH2-CH2- in type 1 statins or -CH=CH- in type 2 statins), NOT a 3-atom spacer!'
              }
            ],
            overallExplanation: 'Statins are competitive transition-state enzyme inhibitors of HMG-CoA reductase. Their pharmacophore consists of a (3R,5R)-dihydroxy acid headgroup separated by a 2-carbon spacer from a bulky lipophilic anchor.',
            highYieldPearl: 'Statin pharmacophore geometry: (3R,5R)-3,5-dihydroxy acid head + 2-carbon spacer + lipophilic aromatic/decalin anchor.',
            sourceReference: 'Review for Antihyperlipidemics, Page 1, Question 4',
            sourcePageNumber: 1
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // REVIEW PAGE 2: Statin SAR, ADME, Drug X & Drug Y (Q5 - Q18)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 2,
    title: 'Anti-hyperlipidemics: Statin SAR, Prodrugs, ADME & Drug X / Drug Y Analysis',
    subtitle: 'Lactone prodrugs, fungal vs synthetic statins, amphoteric structures, CYP metabolism, hepatoselectivity, and myopathy risk',
    sections: [
      {
        sectionTitle: 'Statin Comparative SAR & ADME: Structures I - V, Drug X, Drug Y',
        block_instructions: 'Consider Structures I - V and Drugs X & Y to answer questions (1 - 14):',
        structures: PAGE_2_STRUCTURES,
        questions: [
          {
            id: 705,
            questionNumberLabel: 'Question 1',
            title: 'Statin Prodrugs',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is(are) prodrugs?',
            options: [
              'Structures I and II',
              'Structure III only',
              'Structures III and IV',
              'Structure V only',
              'Structures IV and V'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure I (Lovastatin) and Structure II (Simvastatin) are administered as inactive closed delta-lactone prodrugs that must be hydrolyzed by plasma and tissue esterases into active 3,5-dihydroxy acids.',
              'Incorrect: Pravastatin is administered directly as an open active sodium carboxylate.',
              'Incorrect: Pravastatin and Atorvastatin are active open-chain hydroxy acids.',
              'Incorrect: Rosuvastatin is an active open-chain hydroxy acid calcium salt.',
              'Incorrect: Atorvastatin and Rosuvastatin are active synthetic statins, not lactone prodrugs.'
            ],
            overallExplanation: 'Lovastatin (Structure I) and Simvastatin (Structure II) contain a closed 6-membered lactone ring. In vivo, plasma and tissue esterases open the lactone via hydrolysis to generate the active 3,5-dihydroxyheptanoic acid.',
            highYieldPearl: 'Lactone statin prodrugs: Lovastatin & Simvastatin. Open active hydroxy acids: Pravastatin, Atorvastatin, Rosuvastatin.',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 5',
            sourcePageNumber: 2
          },
          {
            id: 706,
            questionNumberLabel: 'Question 2',
            title: 'Natural and Semi-Synthetic Statins',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is(are) natural/semi-synthesized?',
            options: [
              'Structures I, II, and III',
              'Structures IV and V',
              'Structure I only',
              'Structure II only',
              'Structure V only'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure I (Lovastatin) is a natural fungal metabolite from Aspergillus terreus; Structure II (Simvastatin) is a semi-synthetic derivative with an extra methyl group on the ester side chain; Structure III (Pravastatin) is a microbial biotransformation product of compactin/mevastatin by Nocardia autotrophica. Structures IV and V are fully synthetic.',
              'Incorrect: Atorvastatin and Rosuvastatin are completely synthetic (type 2) statins.',
              'Incorrect: Simvastatin and Pravastatin are also semi-synthetic/biotransformed fungal derivatives.',
              'Incorrect: Incomplete; Lovastatin is natural and Pravastatin is microbial biotransformation.',
              'Incorrect: Rosuvastatin is a completely synthetic pyrimidine-based statin.'
            ],
            overallExplanation: 'Lovastatin is natural (isolated from Aspergillus terreus). Simvastatin is semi-synthesized by dimethylation of the alpha-methylbutyrate side chain. Pravastatin is produced by stereospecific microbial 6-beta-hydroxylation of mevastatin. Atorvastatin and Rosuvastatin are fully synthetic heterocyclic statins.',
            highYieldPearl: 'Natural/Semi-synthetic (Type 1) statins: Lovastatin, Simvastatin, Pravastatin (contain decalin ring). Synthetic (Type 2): Atorvastatin, Rosuvastatin.',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 6',
            sourcePageNumber: 2
          },
          {
            id: 707,
            questionNumberLabel: 'Question 3',
            title: 'Amphoteric Statins',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is(are) amphoteric molecule(s) i.e. acid and base?',
            options: [
              'Structure V',
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure V (Rosuvastatin) contains both an acidic carboxylate group (and acidic methanesulfonamide) and a basic pyrimidine ring nitrogen, rendering it an amphoteric molecule (zwitterionic/amphoteric character).',
              'Incorrect: Lovastatin is a neutral lactone prodrug.',
              'Incorrect: Simvastatin is a neutral lactone prodrug.',
              'Incorrect: Pravastatin contains only acidic carboxylate and neutral hydroxyl groups.',
              'Incorrect: Atorvastatin contains an acidic carboxylic acid and a neutral pyrrole/amide ring, but lacks a basic amine.'
            ],
            overallExplanation: 'Rosuvastatin (Structure V) is unique among the statins shown in being an amphoteric molecule: it bears an acidic carboxylic acid (and sulfonamide NH) and a weakly basic pyrimidine heteroaromatic nitrogen.',
            highYieldPearl: 'Amphoteric statin = Rosuvastatin (contains basic pyrimidine nitrogen + acidic carboxylic acid).',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 7',
            sourcePageNumber: 2
          },
          {
            id: 708,
            questionNumberLabel: 'Question 4',
            title: 'Hepatoselectivity of Statins',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is(are) relatively hepato-selective?',
            options: [
              'Structures III and V',
              'Structures I and II',
              'Structures II and IV',
              'Structure IV only',
              'Structure I only'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure III (Pravastatin) and Structure V (Rosuvastatin) are hydrophilic statins (cLogP ~1.7) that cannot passively diffuse across cell membranes. They rely on active OATP1B1 uptake into hepatocytes and cannot readily exit or penetrate extrahepatic cells, making them relatively hepato-selective.',
              'Incorrect: Lovastatin and Simvastatin are highly lipophilic lactones that distribute widely into extrahepatic tissues via passive diffusion.',
              'Incorrect: Simvastatin and Atorvastatin are lipophilic statins that cross membranes passively.',
              'Incorrect: Atorvastatin is lipophilic and distributes into extrahepatic tissues.',
              'Incorrect: Lovastatin is lipophilic.'
            ],
            overallExplanation: 'Hydrophilic statins (Pravastatin and Rosuvastatin) enter hepatocytes via organic anion-transporting polypeptide 1B1 (OATP1B1). Their low lipophilicity prevents passive diffusion into non-hepatic tissues (like skeletal myocytes), making them highly hepatoselective.',
            highYieldPearl: 'Hepato-selective hydrophilic statins: Pravastatin & Rosuvastatin (cLogP ~1.7). Enter hepatocytes via OATP1B1, limited passive diffusion into skeletal muscle.',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 8',
            sourcePageNumber: 2
          },
          {
            id: 709,
            questionNumberLabel: 'Question 5',
            title: 'Myopathy and Rhabdomyolysis Risk',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is(are) less likely to be associated with rhabdomyolysis?',
            options: [
              'Structures III and V',
              'Structures I and II',
              'Structures II and IV',
              'Structure IV only',
              'Structure I only'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure III (Pravastatin) and Structure V (Rosuvastatin) are hydrophilic and hepato-selective. Because they do not readily penetrate skeletal muscle myocytes via passive diffusion, they carry a significantly lower risk of myopathy and rhabdomyolysis compared to lipophilic statins.',
              'Incorrect: Lovastatin and Simvastatin easily penetrate myocytes and have higher myotoxicity risks, especially with CYP3A4 inhibitors.',
              'Incorrect: Simvastatin has one of the highest reported rates of rhabdomyolysis.',
              'Incorrect: Atorvastatin is lipophilic and carries higher myotoxicity potential than pravastatin.',
              'Incorrect: Lovastatin is lipophilic and carries elevated myopathy risk.'
            ],
            overallExplanation: 'Rhabdomyolysis results from statin accumulation inside skeletal muscle myocytes. Hydrophilic statins (Pravastatin and Rosuvastatin) have limited passive permeability into myocytes, markedly reducing muscle exposure and rhabdomyolysis risk.',
            highYieldPearl: 'Lowest rhabdomyolysis risk = Pravastatin and Rosuvastatin (hydrophilic, OATP1B1-dependent, poor muscle penetration).',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 9',
            sourcePageNumber: 2
          },
          {
            id: 710,
            questionNumberLabel: 'Question 6',
            title: 'Blood-Brain Barrier Penetration and Alzheimer’s Disease',
            category: 'Pharmacology ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is(are) likely to have a positive impact on Alzheimer’s disease?',
            options: [
              'Structures I, II, and IV',
              'Structures III and V',
              'Structure III only',
              'Structure V only',
              'Structures II and V'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structures I (Lovastatin), II (Simvastatin), and IV (Atorvastatin) are lipophilic statins that cross the blood-brain barrier (BBB) via passive diffusion. They enter CNS parenchyma and have been investigated for potential neuroprotective and amyloid-clearing benefits in Alzheimer\'s disease.',
              'Incorrect: Pravastatin and Rosuvastatin are hydrophilic and cannot readily penetrate the intact blood-brain barrier.',
              'Incorrect: Pravastatin is hydrophilic and excluded from CNS.',
              'Incorrect: Rosuvastatin is hydrophilic and excluded from CNS.',
              'Incorrect: Rosuvastatin is hydrophilic.'
            ],
            overallExplanation: 'Lipophilic statins (Lovastatin, Simvastatin, Atorvastatin) cross the blood-brain barrier via passive lipophilic membrane permeation. Investigational studies have demonstrated reduced brain isoprenoid and beta-amyloid levels with these agents in Alzheimer\'s models.',
            highYieldPearl: 'Lipophilic statins cross the BBB: Lovastatin, Simvastatin, Atorvastatin -> potential CNS impacts in Alzheimer\'s disease.',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 10',
            sourcePageNumber: 2
          },
          {
            id: 711,
            questionNumberLabel: 'Question 7',
            title: 'CYP450 Isozyme Metabolism Profile',
            category: 'Pharmacokinetics Metabolism',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is(are) metabolized by CYP3A4? CYP2C9?',
            options: [
              'CYP3A4: Structures I, II, and IV; CYP2C9: Structure V',
              'CYP3A4: Structure V; CYP2C9: Structures I, II, and IV',
              'CYP3A4: Structures I and III; CYP2C9: Structures II and V',
              'CYP3A4: Structures II and V; CYP2C9: Structures I and IV',
              'CYP3A4: All of the above drugs; CYP2C9: None'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Statins with saturated ethylene linkers (Structures I [Lovastatin], II [Simvastatin], and IV [Atorvastatin]) are metabolized extensively by CYP3A4. Structure V (Rosuvastatin) contains an unsaturated (E)-ethenylene linker and undergoes minor Phase I metabolism via CYP2C9. Structure III (Pravastatin) does not undergo major CYP metabolism.',
              'Incorrect: Inverted; CYP3A4 handles Lovastatin, Simvastatin, and Atorvastatin.',
              'Incorrect: Pravastatin is cleared non-CYP.',
              'Incorrect: Lovastatin and Simvastatin are CYP3A4 substrates.',
              'Incorrect: Pravastatin is non-CYP and Rosuvastatin is CYP2C9.'
            ],
            overallExplanation: 'Lovastatin, Simvastatin, and Atorvastatin are major CYP3A4 substrates, making them susceptible to interactions with CYP3A4 inhibitors (macrolides, azoles, protease inhibitors, grapefruit juice). Rosuvastatin undergoes minor (10%) metabolism by CYP2C9. Pravastatin undergoes minimal CYP metabolism and is excreted mainly unchanged.',
            highYieldPearl: 'CYP3A4 statins = Lovastatin, Simvastatin, Atorvastatin. CYP2C9 statin = Rosuvastatin (and Fluvastatin). Non-CYP = Pravastatin.',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 11',
            sourcePageNumber: 2
          },
          {
            id: 712,
            questionNumberLabel: 'Question 8',
            title: 'Grapefruit Juice Interaction',
            category: 'Clinical Drug Interactions',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs should be considered upon the administration of grapefruit juice?',
            options: [
              'Structures I, II, and IV',
              'Structures III and V',
              'Structure III only',
              'Structure V only',
              'Structure I only'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Grapefruit juice contains furanocoumarins (bergamottin, 6\',7\'-dihydroxybergamottin) that irreversibly inactivate intestinal mucosal CYP3A4. Therefore, CYP3A4 substrates — Structure I (Lovastatin), Structure II (Simvastatin), and Structure IV (Atorvastatin) — experience marked increases in oral bioavailability and plasma AUC, drastically raising myopathy and rhabdomyolysis risks.',
              'Incorrect: Pravastatin (non-CYP) and Rosuvastatin (CYP2C9) are not significantly affected by intestinal CYP3A4 inhibition.',
              'Incorrect: Pravastatin is cleared non-enzymatically.',
              'Incorrect: Rosuvastatin is not a CYP3A4 substrate.',
              'Incorrect: Simvastatin and Atorvastatin are also major CYP3A4 substrates.'
            ],
            overallExplanation: 'Intestinal CYP3A4 inhibition by grapefruit juice selectively elevates plasma levels of Lovastatin, Simvastatin, and Atorvastatin, multiplying the risk of toxic myopathy. Pravastatin and Rosuvastatin are safe alternatives with grapefruit juice.',
            highYieldPearl: 'Grapefruit juice blocks intestinal CYP3A4 -> massive AUC spike for Lovastatin, Simvastatin, and Atorvastatin! Pravastatin and Rosuvastatin are unaffected.',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 12',
            sourcePageNumber: 2
          },
          {
            id: 713,
            questionNumberLabel: 'Question 9',
            title: 'Oxidative N-Demethylation',
            category: 'Medicinal Chemistry Metabolism',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is(are) metabolized by oxidative-N-de-methylation?',
            options: [
              'Structure V',
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure V (Rosuvastatin) possesses an N-methylated methanesulfonamide moiety on its pyrimidine ring. CYP2C9 oxidatively removes this methyl group (oxidative N-demethylation) to produce N-desmethylrosuvastatin, which retains ~50% of parent inhibitory activity.',
              'Incorrect: Lovastatin lacks nitrogen atoms.',
              'Incorrect: Simvastatin lacks nitrogen atoms.',
              'Incorrect: Pravastatin lacks nitrogen atoms.',
              'Incorrect: Atorvastatin undergoes CYP3A4 aromatic ortho- and para-hydroxylation, not N-demethylation.'
            ],
            overallExplanation: 'Rosuvastatin (Structure V) contains an N-methyl methanesulfonamide group attached to the pyrimidine core. It undergoes minor CYP2C9-mediated oxidative N-demethylation to yield N-desmethylrosuvastatin.',
            highYieldPearl: 'Rosuvastatin Phase I metabolite: N-desmethylrosuvastatin via CYP2C9 oxidative N-demethylation.',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 13',
            sourcePageNumber: 2
          },
          {
            id: 714,
            questionNumberLabel: 'Question 10',
            title: 'Antacid-Induced Decreased Bioavailability',
            category: 'Pharmacokinetics Drug Interactions',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs has(have) bioavailability that is(are) decreased by the co-administration of divalent or trivalent-containing antacids?',
            options: [
              'Structure V',
              'Structure III',
              'Structure I',
              'Structure II',
              'Structure IV'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure V (Rosuvastatin) plasma concentration is reduced by approximately 50% when co-administered with aluminum/magnesium hydroxide antacids due to chelation/insoluble complex formation. Antacids must be separated by at least 2 hours.',
              'Incorrect: Pravastatin bioavailability is enhanced (not decreased) by antacids.',
              'Incorrect: Lovastatin is not significantly chelated by antacids.',
              'Incorrect: Simvastatin is not significantly chelated by antacids.',
              'Incorrect: Atorvastatin does not exhibit major antacid chelation.'
            ],
            overallExplanation: 'Co-administration of Rosuvastatin with antacids containing aluminum and magnesium hydroxide results in a ~50% decrease in rosuvastatin plasma concentration due to complexation in the gastrointestinal tract.',
            highYieldPearl: 'Rosuvastatin + Al/Mg Antacids = Bioavailability DECREASED by ~50% (take antacids at least 2 hours after rosuvastatin).',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 14',
            sourcePageNumber: 2
          },
          {
            id: 715,
            questionNumberLabel: 'Question 11',
            title: 'Antacid-Induced Enhanced Bioavailability',
            category: 'Pharmacokinetics Drug Interactions',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs has(have) bioavailability that is(are) enhanced upon the co-administration of antacids?',
            options: [
              'Structure III',
              'Structure V',
              'Structure I',
              'Structure II',
              'Structure IV'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure III (Pravastatin) is acid-labile and undergoes rapid non-enzymatic acid-catalyzed isomerization/lactonization into an inactive metabolite in gastric acid. Antacids, H2 blockers, and proton pump inhibitors raise gastric pH, shielding pravastatin from acid degradation and thereby increasing its oral bioavailability.',
              'Incorrect: Rosuvastatin bioavailability is decreased by ~50% in the presence of antacids.',
              'Incorrect: Lovastatin is already a closed lactone.',
              'Incorrect: Simvastatin is already a closed lactone.',
              'Incorrect: Atorvastatin bioavailability is not significantly enhanced by antacids.'
            ],
            overallExplanation: 'Pravastatin is acid-labile in gastric fluid. Elevation of gastric pH by antacids, H2 receptor antagonists, or PPIs suppresses acid-catalyzed inactivation, significantly enhancing pravastatin bioavailability.',
            highYieldPearl: 'Pravastatin + Antacids/H2 blockers/PPIs = Bioavailability ENHANCED due to reduced acid degradation in the stomach.',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 15',
            sourcePageNumber: 2
          },
          {
            id: 716,
            questionNumberLabel: 'Question 12',
            title: 'Statin ADME Characteristics True/False',
            category: 'Pharmacokinetics ADME',
            type: 'sub-statements',
            questionStem: 'State whether each of the following statements is true or false regarding statin pharmacokinetics and metabolism:',
            subStatements: [
              {
                id: 'a',
                text: 'All of the above active drugs are metabolized by CYP3A4.',
                isCorrect: false,
                explanation: 'False: Rosuvastatin is metabolized by CYP2C9, and Pravastatin does not undergo significant CYP metabolism.'
              },
              {
                id: 'b',
                text: 'All of the above active drugs are metabolized by CYP2C9.',
                isCorrect: false,
                explanation: 'False: Lovastatin, Simvastatin, and Atorvastatin are metabolized by CYP3A4, not CYP2C9.'
              },
              {
                id: 'c',
                text: 'All of the above active drugs are metabolized by O-glucuronidation.',
                isCorrect: true,
                explanation: 'True: All active statin dihydroxy acids undergo Phase II acyl-glucuronidation at their terminal carboxylic acid, excreted primarily in bile and feces.'
              },
              {
                id: 'd',
                text: 'Dose adjustment for above drugs is important in severe liver dysfunction.',
                isCorrect: true,
                explanation: 'True: Because statins depend primarily on hepatic extraction, clearance, and biliary excretion, severe hepatic impairment causes drug accumulation.'
              },
              {
                id: 'e',
                text: 'Dose adjustment for all of the above drugs should be considered in renal insufficiency.',
                isCorrect: false,
                explanation: 'False: Atorvastatin has <2% renal excretion and requires NO dosage adjustment in renal insufficiency, unlike hydrophilic statins like pravastatin and rosuvastatin.'
              },
              {
                id: 'f',
                text: 'Their binding potential to plasma proteins is limited.',
                isCorrect: false,
                explanation: 'False: Due to their multicyclic hydrophobic domains, statins bind extensively to plasma proteins (typically 88% to >99%, with the exception of pravastatin ~50%).'
              }
            ],
            overallExplanation: 'Statins undergo Phase II carboxylic O-glucuronidation. Hepatic impairment impairs clearance of all statins. However, renal impairment does NOT require dose adjustment for Atorvastatin (<2% renal elimination). Statins are extensively protein-bound.',
            highYieldPearl: 'Atorvastatin needs NO renal dose adjustment (<2% excreted renally). All statins undergo O-glucuronidation and are highly plasma protein bound.',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 16',
            sourcePageNumber: 2
          },
          {
            id: 717,
            questionNumberLabel: 'Question 13',
            title: 'Atorvastatin (Drug X) Characteristics True/False',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'State whether each of the following statements is true or false about Drug X (Atorvastatin):',
            subStatements: [
              {
                id: 'a',
                text: 'It is extensively metabolized by CYP3A4 to two active metabolites.',
                isCorrect: true,
                explanation: 'True: Ortho- and para-hydroxyatorvastatin are active metabolites that account for approximately 70% of total circulating HMG-CoA reductase inhibitory activity.'
              },
              {
                id: 'b',
                text: 'The multi-cyclic aromatic domain is responsible for the high affinity to the active site of the protein target.',
                isCorrect: true,
                explanation: 'True: The central pyrrole ring bearing phenyl, fluorophenyl, isopropyl, and anilide substituents provides extensive hydrophobic binding affinity.'
              },
              {
                id: 'c',
                text: 'The 3,5-dihydroxy pentanoic acid domain is essential to engage with the key amino acids which are otherwise engaged by the endogenous substrate.',
                isCorrect: false,
                explanation: 'False: It is a 3,5-dihydroxy HEPTANOIC acid (7-carbon chain, not 5-carbon pentanoic acid).'
              },
              {
                id: 'd',
                text: 'The drug is very effective in decreasing the LDL level up to 60%.',
                isCorrect: true,
                explanation: 'True: Atorvastatin 40-80 mg daily is a high-intensity statin producing 50-60% LDL-C reduction.'
              },
              {
                id: 'e',
                text: 'The effect of the drug can be detected in a short time of ~3 days.',
                isCorrect: false,
                explanation: 'False: Maximum LDL receptor upregulation and full therapeutic lipid-lowering efficacy requires 2 to 4 weeks.'
              },
              {
                id: 'f',
                text: 'The drug is very hepato-selective, and therefore, it is relatively free of rhabdomyolysis risk.',
                isCorrect: false,
                explanation: 'False: Atorvastatin is lipophilic and distributes into extrahepatic tissues; it is NOT hepatoselective and carries myopathy/rhabdomyolysis risks.'
              },
              {
                id: 'g',
                text: 'The drug is amphoteric molecule.',
                isCorrect: false,
                explanation: 'False: Atorvastatin is a carboxylic acid (mono-acid); it lacks a basic amine and is not amphoteric.'
              }
            ],
            overallExplanation: 'Atorvastatin is a synthetic, lipophilic pyrrole statin with active ortho/para-hydroxy metabolites (CYP3A4) providing high-intensity LDL reduction (up to 60%). It is NOT amphoteric and NOT hepatoselective.',
            highYieldPearl: 'Atorvastatin active metabolites: Ortho- and para-hydroxyatorvastatin account for ~70% of circulating inhibitory activity.',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 17',
            sourcePageNumber: 2
          },
          {
            id: 718,
            questionNumberLabel: 'Question 14',
            title: 'Rosuvastatin (Drug Y) Characteristics True/False',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'State whether each of the following statements is true or false about Drug Y (Rosuvastatin):',
            subStatements: [
              {
                id: 'a',
                text: 'It is metabolized by CYP2C9-mediated oxidative N-de-methylation.',
                isCorrect: true,
                explanation: 'True: ~10% of rosuvastatin undergoes CYP2C9 oxidative N-demethylation to N-desmethylrosuvastatin.'
              },
              {
                id: 'b',
                text: 'The drug is very effective in decreasing the LDL level up to 60%.',
                isCorrect: true,
                explanation: 'True: Rosuvastatin 20-40 mg daily achieves up to 55-63% LDL-C lowering, making it the most potent statin milligram-for-milligram.'
              },
              {
                id: 'c',
                text: 'The drug is hepato-selective, and therefore, it is relatively associated with limited risk of rhabdomyolysis.',
                isCorrect: true,
                explanation: 'True: Hydrophilicity and OATP1B1 dependence restrict its distribution primarily to hepatocytes, limiting passive uptake into skeletal muscle.'
              },
              {
                id: 'd',
                text: 'The drug is amphoteric molecule.',
                isCorrect: true,
                explanation: 'True: It possesses a basic pyrimidine nitrogen along with an acidic carboxylic acid and sulfonamide.'
              }
            ],
            overallExplanation: 'Rosuvastatin is an amphoteric, hydrophilic, hepatoselective pyrimidine statin metabolized by CYP2C9 that provides up to 63% LDL reduction with low myotoxicity risk.',
            highYieldPearl: 'Rosuvastatin: Most potent statin (up to 63% LDL reduction), amphoteric, hydrophilic, hepato-selective via OATP1B1, CYP2C9 N-demethylation.',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 18',
            sourcePageNumber: 2
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // REVIEW PAGE 3: Non-Statin Hypolipidemics (Q19 - Q27)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 3,
    title: 'Anti-hyperlipidemics: Non-Statin Hypolipidemic Agents',
    subtitle: 'PPAR-alpha fibrates, ester prodrugs, nicotinic acid half-life, bile acid resins, sites of action, and drag-and-drop matching matrices',
    sections: [
      {
        sectionTitle: 'Chemical Structures of Antihyperlipidemic Agents (I - VI)',
        block_instructions: 'Consider the following chemical structures of antihyperlipidemic agents (I - VI) to answer subsequent questions (1 - 9):',
        structures: PAGE_3_STRUCTURES,
        questions: [
          {
            id: 719,
            questionNumberLabel: 'Question 1',
            title: 'Fatty Acid-Like PPAR-Alpha Activators',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which of the above molecules has a fatty acid-like structure for its active form, and therefore, it activates nuclear PPARα to eventually decrease LDL and increase HDL?',
            options: [
              'Structure IV',
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure V',
              'Structure VI'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure IV (Fenofibrate, activated to fenofibric acid) is an amphipathic isobutyrate derivative that mimics fatty acids to bind and activate nuclear peroxisome proliferator-activated receptor-alpha (PPAR-alpha), stimulating lipoprotein lipase and ApoA-I/A-II expression.',
              'Incorrect: Structure I (Statin) inhibits HMG-CoA reductase.',
              'Incorrect: Structure II (Lomitapide) inhibits MTP.',
              'Incorrect: Structure III (Ezetimibe) inhibits NPC1L1.',
              'Incorrect: Structure V (Niacin) inhibits adipose lipolysis via HCA2 receptors.',
              'Incorrect: Structure VI (Cholestyramine) is an anion-exchange resin.'
            ],
            overallExplanation: 'Fibrates like Fenofibrate (Structure IV) contain an isobutyric acid "head" and lipophilic "tail" that structurally mimic fatty acids, binding to PPAR-alpha. This upregulates lipoprotein lipase (LPL) and fatty acid beta-oxidation, lowering plasma triglycerides and VLDL while raising HDL.',
            highYieldPearl: 'Fatty acid-like PPAR-alpha activator = Fenofibrate (Structure IV) -> decreases triglycerides/VLDL and increases HDL.',
            sourceReference: 'Review for Antihyperlipidemics, Page 3, Question 19',
            sourcePageNumber: 3
          },
          {
            id: 720,
            questionNumberLabel: 'Question 2',
            title: 'Prodrug Identification',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above structures is a prodrug?',
            options: [
              'Structure IV',
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure V',
              'Structure VI'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure IV (Fenofibrate) is an isopropyl ester prodrug. In vivo, tissue and plasma esterases rapidly hydrolyze the ester to form the active drug, fenofibric acid.',
              'Incorrect: Structure I (Atorvastatin) is already an active open hydroxy acid.',
              'Incorrect: Structure II (Lomitapide) is active as parent drug.',
              'Incorrect: Structure III (Ezetimibe) is an active drug.',
              'Incorrect: Structure V (Niacin) is active nicotinic acid.',
              'Incorrect: Structure VI (Cholestyramine) is an active insoluble resin.'
            ],
            overallExplanation: 'Fenofibrate (Structure IV) is formulated as an ester prodrug (isopropyl ester) to improve lipophilicity and gastrointestinal absorption. It undergoes rapid and complete esterase hydrolysis to the active free acid (fenofibric acid).',
            highYieldPearl: 'Ester prodrug fibrate = Fenofibrate (Structure IV), rapidly cleaved by esterases to active fenofibric acid.',
            sourceReference: 'Review for Antihyperlipidemics, Page 3, Question 20',
            sourcePageNumber: 3
          },
          {
            id: 721,
            questionNumberLabel: 'Question 3',
            title: 'Extended-Release Formulation for Short Half-Life',
            category: 'Pharmaceutics & Pharmacokinetics',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is formulated in an extended release form to overcome its short elimination half-life?',
            options: [
              'Structure V',
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV',
              'Structure VI'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure V (Niacin / Nicotinic acid) has a very short elimination half-life of 20 to 48 minutes and undergoes extensive first-pass metabolism. To maintain therapeutic blood levels and mitigate prostaglandin-mediated cutaneous flushing, extended-release formulations (e.g., Niaspan) are utilized.',
              'Incorrect: Structure I (Atorvastatin) has an active half-life of 14-20 hours.',
              'Incorrect: Structure II (Lomitapide) has a long half-life of ~39.7 hours.',
              'Incorrect: Structure III (Ezetimibe) has a half-life of ~22 hours.',
              'Incorrect: Structure IV (Fenofibrate) has an active half-life of ~20 hours.',
              'Incorrect: Structure VI (Cholestyramine) is not absorbed.'
            ],
            overallExplanation: 'Niacin (Structure V) has an ultra-short half-life (20-48 minutes) due to rapid renal elimination and hepatic clearance. Extended-release formulations provide sustained therapeutic levels with once-daily bedtime dosing while reducing prostaglandin-mediated cutaneous flushing.',
            highYieldPearl: 'Niacin (Structure V): Short elimination half-life (20-48 min) -> formulated as extended-release (Niaspan) to minimize flushing and maintain efficacy.',
            sourceReference: 'Review for Antihyperlipidemics, Page 3, Question 21',
            sourcePageNumber: 3
          },
          {
            id: 722,
            questionNumberLabel: 'Question 4',
            title: 'Safety in Pregnancy',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs can potentially be used to treat hyperlipidemia/dyslipidemia in pregnant patients?',
            options: [
              'Structure VI',
              'Structure I',
              'Structure II',
              'Structure III',
              'Structure IV',
              'Structure V'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure VI (Cholestyramine) is a high-molecular-weight quaternary ammonium polymer resin that is completely non-absorbed from the gastrointestinal tract. Because it does not enter systemic circulation, it carries no direct fetal systemic toxicity risk and is the safest agent in pregnancy (FDA Category B).',
              'Incorrect: Structure I (Statins) are strictly contraindicated in pregnancy due to interference with fetal cholesterol biosynthesis.',
              'Incorrect: Structure II (Lomitapide) is teratogenic and contraindicated in pregnancy (Category X).',
              'Incorrect: Structure III (Ezetimibe) is not recommended in pregnancy.',
              'Incorrect: Structure IV (Fenofibrate) is not recommended in pregnancy.',
              'Incorrect: Structure V (Niacin) is not recommended at pharmacological doses in pregnancy.'
            ],
            overallExplanation: 'Bile acid sequestrants like Cholestyramine (Structure VI) are large insoluble polymers that cannot be absorbed across the intestinal mucosa. Because systemic exposure is zero, they are the safest lipid-lowering agents during pregnancy.',
            highYieldPearl: 'Safest lipid drug in pregnancy = Cholestyramine (Structure VI), because it is not systemically absorbed from the GIT.',
            sourceReference: 'Review for Antihyperlipidemics, Page 3, Question 22',
            sourcePageNumber: 3
          },
          {
            id: 723,
            questionNumberLabel: 'Question 5',
            title: 'Primary Site of Action: Hepatocytes',
            category: 'Pharmacology Organ Targeting',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs has(have) liver as the main site of action (hepatocytes)? (Choose only One)',
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
              'Correct: Structure I (Statin / Atorvastatin) acts primarily in hepatocytes, inhibiting microsomal HMG-CoA reductase to shut down de novo cholesterol biosynthesis and upregulate hepatic LDL receptors.',
              'Incorrect: Structure II (Lomitapide) acts in both enterocytes and hepatocytes.',
              'Incorrect: Structure III (Ezetimibe) acts in intestinal enterocytes.',
              'Incorrect: Structure IV (Fenofibrate) acts primarily on nuclear PPAR-alpha in liver and muscle/adipose tissue.',
              'Incorrect: Structure V (Niacin) acts on adipose tissue lipolysis as well as liver.',
              'Incorrect: Structure VI (Cholestyramine) acts solely in the intestinal lumen.'
            ],
            overallExplanation: 'Statins (Structure I) target hepatic HMG-CoA reductase located on the endoplasmic reticulum of hepatocytes, which is their primary therapeutic site of action.',
            highYieldPearl: 'Primary site of action in hepatocytes = Statin (Structure I), inhibiting de novo hepatic cholesterol synthesis.',
            sourceReference: 'Review for Antihyperlipidemics, Page 3, Question 23',
            sourcePageNumber: 3
          },
          {
            id: 724,
            questionNumberLabel: 'Question 6',
            title: 'Primary Site of Action: Gastrointestinal Tract',
            category: 'Pharmacology Organ Targeting',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs has(have) GIT as the main site of action (enterocytes)? (Choose only Two)',
            options: [
              'Structures III and VI',
              'Structures I and IV',
              'Structures II and V',
              'Structures I and II',
              'Structures IV and VI'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure III (Ezetimibe) acts on jejunal enterocyte brush border NPC1L1 transporters, and Structure VI (Cholestyramine) binds bile acids in the intestinal lumen. Both have the GIT as their main site of therapeutic action.',
              'Incorrect: Statins act in hepatocytes.',
              'Incorrect: Lomitapide acts in both liver and intestine; Niacin acts in adipose tissue and liver.',
              'Incorrect: Statins act in liver.',
              'Incorrect: Fenofibrate acts on nuclear PPAR-alpha.'
            ],
            overallExplanation: 'Ezetimibe (Structure III) localizes to the brush border of intestinal enterocytes to block cholesterol absorption. Cholestyramine (Structure VI) acts purely within the gastrointestinal lumen to sequester bile acids.',
            highYieldPearl: 'GIT-localized sites of action: Ezetimibe (enterocyte NPC1L1) and Cholestyramine (intestinal lumen bile acid binding).',
            sourceReference: 'Review for Antihyperlipidemics, Page 3, Question 24',
            sourcePageNumber: 3
          },
          {
            id: 725,
            questionNumberLabel: 'Question 7',
            title: 'Dual Site of Action: Hepatocytes and Enterocytes',
            category: 'Pharmacology Organ Targeting',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs function(s) in both hepatocytes and enterocytes? (Choose only One)',
            options: [
              'Structure II',
              'Structure I',
              'Structure III',
              'Structure IV',
              'Structure V',
              'Structure VI'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Structure II (Lomitapide) directly binds and inhibits microsomal triglyceride transfer protein (MTP) in both enterocytes (inhibiting chylomicron assembly) and hepatocytes (inhibiting VLDL assembly), dramatically suppressing circulating ApoB-containing lipoproteins.',
              'Incorrect: Statin (Structure I) acts in hepatocytes.',
              'Incorrect: Ezetimibe (Structure III) acts in enterocytes.',
              'Incorrect: Fenofibrate (Structure IV) acts on nuclear PPAR-alpha.',
              'Incorrect: Niacin (Structure V) acts on adipose tissue and liver.',
              'Incorrect: Cholestyramine (Structure VI) acts in the gut lumen.'
            ],
            overallExplanation: 'Lomitapide (Structure II) functions in the endoplasmic reticulum of both intestinal enterocytes and hepatic hepatocytes, inhibiting MTP and blocking assembly of both chylomicrons and VLDL.',
            highYieldPearl: 'Dual enterocyte + hepatocyte action = Lomitapide (Structure II), inhibiting MTP in both organs.',
            sourceReference: 'Review for Antihyperlipidemics, Page 3, Question 25',
            sourcePageNumber: 3
          },
          {
            id: 726,
            questionNumberLabel: 'Question 8',
            title: 'Chemical Class Matching Matrix',
            category: 'Medicinal Chemistry Classification',
            type: 'matching',
            questionStem: 'Match each chemical class (a - f) with the corresponding drug structure (I - VI):',
            matchingTargets: [
              {
                id: 'a',
                label: '3-Carboxylic acid pyridine',
                description: 'Nicotinic acid derivative bearing a pyridine heteroaromatic ring with a carboxylic acid at C-3',
                correctStructureId: 'niacin'
              },
              {
                id: 'b',
                label: 'Quaternary ammonium-containing polymer',
                description: 'Cross-linked insoluble styrene-divinylbenzene resin with permanent positively-charged trimethylammonium groups',
                correctStructureId: 'cholestyramine'
              },
              {
                id: 'c',
                label: 'Isobutyrate derivative',
                description: 'Phenoxy-isobutyric acid ester derivative mimicking fatty acid geometry',
                correctStructureId: 'fenofibrate'
              },
              {
                id: 'd',
                label: '7-Substituted 3,5-dihydroxyheptanoic acid',
                description: 'HMG-CoA transition state mimetic with a 7-carbon dihydroxy acid chain attached to a pyrrole core',
                correctStructureId: 'atorvastatin'
              },
              {
                id: 'e',
                label: 'Trisubstituted β-lactam',
                description: '1,4-Diaryl-2-azetidinone four-membered cyclic amide ring',
                correctStructureId: 'ezetimibe'
              },
              {
                id: 'f',
                label: 'Hexafluorinated fluorene carboxamide-biphenyl carboxamide',
                description: 'Large multicyclic lipophilic dicarboxamide derivative containing six fluorine atoms',
                correctStructureId: 'lomitapide'
              }
            ],
            structuresDisplayed: PAGE_3_STRUCTURES,
            overallExplanation: 'Chemical class matching: a -> Structure V (Niacin); b -> Structure VI (Cholestyramine); c -> Structure IV (Fenofibrate); d -> Structure I (Atorvastatin); e -> Structure III (Ezetimibe); f -> Structure II (Lomitapide).',
            highYieldPearl: 'Drug Classes: Niacin = 3-pyridinecarboxylic acid; Cholestyramine = 4° ammonium resin; Fenofibrate = isobutyrate; Statin = dihydroxyheptanoic acid; Ezetimibe = beta-lactam; Lomitapide = hexafluorinated fluorene/biphenyl dicarboxamide.',
            sourceReference: 'Review for Antihyperlipidemics, Page 3, Question 26',
            sourcePageNumber: 3
          },
          {
            id: 727,
            questionNumberLabel: 'Question 9',
            title: 'Mechanism of Action Matching Matrix',
            category: 'Pharmacology MOA',
            type: 'matching',
            questionStem: 'Match each mechanism of action (a - e) with the corresponding drug structure (I - VI):',
            matchingTargets: [
              {
                id: 'a',
                label: 'Bile acids sequestrant',
                description: 'Binds negatively charged bile acids in intestinal lumen preventing their reabsorption',
                correctStructureId: 'cholestyramine'
              },
              {
                id: 'b',
                label: 'PPARα activator',
                description: 'Activates nuclear peroxisome proliferator-activated receptor alpha to stimulate lipoprotein lipase',
                correctStructureId: 'fenofibrate'
              },
              {
                id: 'c',
                label: 'Intestinal cholesterol absorption inhibitor',
                description: 'Selectively binds and blocks the enterocyte brush border NPC1L1 sterol transporter',
                correctStructureId: 'ezetimibe'
              },
              {
                id: 'd',
                label: 'Inhibitor of hepatic biosynthesis of cholesterol',
                description: 'Competitively inhibits HMG-CoA reductase, the rate-limiting enzyme in de novo sterol synthesis',
                correctStructureId: 'atorvastatin'
              },
              {
                id: 'e',
                label: 'ApoB-containing lipoproteins assembly disruptor',
                description: 'Directly inhibits microsomal triglyceride transfer protein (MTP) in enterocytes and hepatocytes',
                correctStructureId: 'lomitapide'
              }
            ],
            structuresDisplayed: PAGE_3_STRUCTURES,
            overallExplanation: 'Mechanism matching: a -> Structure VI (Cholestyramine); b -> Structure IV (Fenofibrate); c -> Structure III (Ezetimibe); d -> Structure I (Atorvastatin); e -> Structure II (Lomitapide).',
            highYieldPearl: 'Mechanisms: Cholestyramine = Bile acid sequestrant; Fenofibrate = PPAR-alpha agonist; Ezetimibe = NPC1L1 inhibitor; Statin = HMG-CoA reductase inhibitor; Lomitapide = MTP inhibitor.',
            sourceReference: 'Review for Antihyperlipidemics, Page 3, Question 27',
            sourcePageNumber: 3
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // REVIEW PAGE 4: Ezetimibe Functional Group SAR & Cholestyramine (Q28 - Q33)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 4,
    title: 'Anti-hyperlipidemics: Ezetimibe Functional Group SAR & Cholestyramine Resin Properties',
    subtitle: 'Beta-lactam cholesterol absorption inhibition, metabolic stability, active glucuronide, and bile acid sequestrant pharmacology',
    sections: [
      {
        sectionTitle: 'Ezetimibe (Drug X) with Functional Groups a - d & Cholestyramine (Drug Y)',
        block_instructions: 'Consider the chemical structures of Antihyperlipidemic X (Ezetimibe, with functional groups a - d) and Antihyperlipidemic Y (Cholestyramine) to answer questions (1 - 6):',
        structures: PAGE_4_STRUCTURES,
        questions: [
          {
            id: 728,
            questionNumberLabel: 'Question 1',
            title: 'Drug X (Ezetimibe) True/False Profile',
            category: 'Pharmacology & SAR',
            type: 'sub-statements',
            questionStem: 'Consider the chemical structure of antihyperlipidemic X (Ezetimibe) to state whether each of the following statements is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'Chemically, it is a β-lactam derivative.',
                isCorrect: true,
                explanation: 'True: Ezetimibe is a 1,4-diaryl-2-azetidinone, which contains a central 4-membered cyclic amide (beta-lactam) ring.'
              },
              {
                id: 'b',
                text: 'Mechanistically, it is an inhibitor of dietary cholesterol absorption.',
                isCorrect: true,
                explanation: 'True: It binds the Niemann-Pick C1-Like 1 (NPC1L1) transporter on the brush border of jejunal enterocytes, inhibiting dietary and biliary cholesterol absorption by ~54%.'
              },
              {
                id: 'c',
                text: 'It is metabolized to active as well as inactive metabolites.',
                isCorrect: true,
                explanation: 'True: Phenolic O-glucuronidation produces an active metabolite (ezetimibe-glucuronide), while benzylic alcohol oxidation produces an inactive ketone metabolite.'
              },
              {
                id: 'd',
                text: 'Its pharmacological activity is stereochemistry-dependent.',
                isCorrect: true,
                explanation: 'True: Ezetimibe has three chiral centers ((3R, 4S) on the beta-lactam ring and (3S) on the hydroxypropyl chain); stereospecificity is critical for NPC1L1 binding.'
              },
              {
                id: 'e',
                text: 'It is contraindicated in patients with severe hepatic dysfunction.',
                isCorrect: true,
                explanation: 'True: In moderate-to-severe hepatic impairment, ezetimibe exposure increases significantly (3- to 4-fold AUC increase), and its use is contraindicated/not recommended.'
              },
              {
                id: 'f',
                text: 'It appears to be more selective to block the absorption of triglycerides.',
                isCorrect: false,
                explanation: 'False: Ezetimibe selectively inhibits cholesterol absorption; it does NOT interfere with the absorption of triglycerides, fatty acids, bile acids, or fat-soluble vitamins.'
              }
            ],
            overallExplanation: 'Ezetimibe is a chiral beta-lactam (2-azetidinone) that selectively blocks cholesterol absorption via enterocyte NPC1L1. It forms active glucuronide and inactive ketone metabolites and is contraindicated in severe liver disease.',
            highYieldPearl: 'Ezetimibe = NPC1L1 cholesterol absorption inhibitor. Selective for cholesterol (does NOT block triglycerides or fat-soluble vitamins!).',
            sourceReference: 'Review for Antihyperlipidemics, Page 4, Question 28',
            sourcePageNumber: 4
          },
          {
            id: 729,
            questionNumberLabel: 'Question 2',
            title: 'Intestinal Localization Functional Groups',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which functional group(s) (a-d) in Drug X is(are) introduced to localize the drug into its site of action?',
            options: [
              'FG (c) and FG (d)',
              'FG (a) and FG (b)',
              'FG (a) only',
              'FG (b) only',
              'FG (c) only'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Functional group (c) [benzylic secondary alcohol] and functional group (d) [phenolic hydroxyl] provide polarity and facilitate intestinal glucuronidation, keeping the drug localized at the enterocyte brush border and driving enterohepatic recirculation.',
              'Incorrect: FG (a) and FG (b) are para-fluoro groups introduced for metabolic stability against Phase I oxidation.',
              'Incorrect: Incomplete; both hydroxyl groups (c and d) contribute to intestinal localization.',
              'Incorrect: FG (b) is a fluoro group blocking aromatic metabolism.',
              'Incorrect: Incomplete; phenolic hydroxyl (d) is also critical for intestinal localization via glucuronidation.'
            ],
            overallExplanation: 'The hydroxyl groups — benzylic secondary alcohol FG (c) and phenolic hydroxyl FG (d) — were strategically introduced to enhance hydrophilicity and facilitate local glucuronidation, anchoring ezetimibe to the intestinal mucosa and brush border.',
            highYieldPearl: 'Ezetimibe intestinal localization groups = FG (c) [benzylic -OH] and FG (d) [phenolic -OH].',
            sourceReference: 'Review for Antihyperlipidemics, Page 4, Question 29',
            sourcePageNumber: 4
          },
          {
            id: 730,
            questionNumberLabel: 'Question 3',
            title: 'Metabolic Stability Functional Groups',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which functional groups(s) (a-d) in Drug X is(are) introduced to enhance its metabolic stability?',
            options: [
              'FG (a) and FG (b)',
              'FG (c) and FG (d)',
              'FG (a) only',
              'FG (b) only',
              'FG (d) only'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Functional group (a) [N-4-fluorophenyl] and functional group (b) [benzylic 4-fluorophenyl] contain fluorine atoms placed at para-positions to block CYP-mediated aromatic hydroxylation, thereby enhancing metabolic stability and prolonging the elimination half-life.',
              'Incorrect: FG (c) and FG (d) are hydroxyl groups that localize the drug and undergo metabolism.',
              'Incorrect: Incomplete; both para-fluoro phenyl rings (a and b) block aromatic hydroxylation.',
              'Incorrect: Incomplete; both (a) and (b) are metabolically protective fluoro groups.',
              'Incorrect: FG (d) is a phenolic -OH, which is a substrate for glucuronidation.'
            ],
            overallExplanation: 'Early lead compounds suffered from rapid aromatic hydroxylation at the para-positions of both aromatic rings. Installing fluorine atoms at these sites (FG a and FG b) effectively blocked Phase I oxidation, dramatically boosting metabolic stability and duration of action.',
            highYieldPearl: 'Ezetimibe metabolic stability groups = FG (a) and FG (b) (para-fluorine atoms block Phase I aromatic oxidation).',
            sourceReference: 'Review for Antihyperlipidemics, Page 4, Question 30',
            sourcePageNumber: 4
          },
          {
            id: 731,
            questionNumberLabel: 'Question 4',
            title: 'Oxidation to Inactive Metabolite',
            category: 'Medicinal Chemistry Metabolism',
            type: 'multiple-choice',
            questionStem: 'Which functional group(s) in Drug X is(are) oxidized to produce inactive metabolite?',
            options: [
              'FG (c)',
              'FG (a)',
              'FG (b)',
              'FG (d)',
              'FG (a) and FG (b)'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Functional group (c) is a benzylic secondary alcohol. Hepatic and intestinal oxidation converts this secondary alcohol into a benzylic ketone, which is an inactive metabolite.',
              'Incorrect: FG (a) is a fluorinated benzene ring resistant to oxidation.',
              'Incorrect: FG (b) is a fluorinated benzene ring resistant to oxidation.',
              'Incorrect: FG (d) is a phenolic hydroxyl that undergoes glucuronidation (not oxidation to an inactive metabolite).',
              'Incorrect: Both (a) and (b) are fluoro groups blocking oxidation.'
            ],
            overallExplanation: 'Functional group (c) is a secondary benzylic alcohol (-CH(OH)-). In vivo, alcohol dehydrogenases/CYPs oxidize it to the corresponding benzylic ketone, which displays markedly reduced affinity for NPC1L1 and is classified as an inactive metabolite.',
            highYieldPearl: 'Inactive ezetimibe metabolite = Oxidation of benzylic alcohol FG (c) to a ketone.',
            sourceReference: 'Review for Antihyperlipidemics, Page 4, Question 31',
            sourcePageNumber: 4
          },
          {
            id: 732,
            questionNumberLabel: 'Question 5',
            title: 'Glucuronidation to Active Metabolite',
            category: 'Medicinal Chemistry Metabolism',
            type: 'multiple-choice',
            questionStem: 'Which functional group(s) in Drug X is(are) conjugated with glucuronic acid producing active metabolite that contributes to the overall activity of the original drug?',
            options: [
              'FG (d)',
              'FG (c)',
              'FG (a)',
              'FG (b)',
              'FG (c) and FG (d)'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Functional group (d) is the phenolic hydroxyl group. In intestinal enterocytes and the liver, UGT1A1/UGT1A3 rapidly conjugates this phenolic -OH with glucuronic acid to produce ezetimibe-glucuronide, which is pharmacologically active (even more potent at NPC1L1 than parent ezetimibe) and undergoes extensive enterohepatic recirculation.',
              'Incorrect: FG (c) secondary alcohol does not yield the primary active glucuronide metabolite; phenolic glucuronidation at (d) is the dominant active pathway.',
              'Incorrect: FG (a) is a fluoro-substituted aromatic ring, not a conjugation site.',
              'Incorrect: FG (b) is a fluoro-substituted aromatic ring, not a conjugation site.',
              'Incorrect: Phenolic hydroxyl (d) is the primary site of active glucuronidation.'
            ],
            overallExplanation: 'The phenolic hydroxyl group FG (d) undergoes extensive O-glucuronidation in intestinal enterocytes and liver to yield ezetimibe-O-glucuronide. This active metabolite recirculates enterohepatically, repeatedly delivering potent NPC1L1 inhibition at the brush border.',
            highYieldPearl: 'Active ezetimibe metabolite = Glucuronidation of phenolic -OH FG (d) to active ezetimibe-glucuronide.',
            sourceReference: 'Review for Antihyperlipidemics, Page 4, Question 32',
            sourcePageNumber: 4
          },
          {
            id: 733,
            questionNumberLabel: 'Question 6',
            title: 'Drug Y (Cholestyramine Resin) True/False Profile',
            category: 'Pharmacology & SAR',
            type: 'sub-statements',
            questionStem: 'Consider the chemical structure of antihyperlipidemic Y (Cholestyramine) to state whether each of the following statements is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'Chemically, it is quaternary ammonium containing polymer.',
                isCorrect: true,
                explanation: 'True: Cholestyramine is a high-molecular-weight cross-linked styrene-divinylbenzene copolymer functionalized with quaternary trimethylbenzylammonium chloride groups.'
              },
              {
                id: 'b',
                text: 'It possesses pH-dependent activity.',
                isCorrect: false,
                explanation: 'False: Quaternary ammonium groups carry a permanent positive charge at all physiological pH levels, rendering cholestyramine binding pH-INDEPENDENT (unlike tertiary amine resins like colestipol, which are pH-dependent).'
              },
              {
                id: 'c',
                text: 'Mechanistically, it is inhibitor of bile acids reabsorption.',
                isCorrect: true,
                explanation: 'True: It exchanges chloride for negatively charged bile acid anions in the intestinal lumen, forming insoluble complexes excreted in feces.'
              },
              {
                id: 'd',
                text: 'Its site of action is intestine.',
                isCorrect: true,
                explanation: 'True: It is completely non-absorbed and works entirely within the gastrointestinal lumen.'
              },
              {
                id: 'e',
                text: 'Its pharmacological activity is stereochemistry-dependent.',
                isCorrect: false,
                explanation: 'False: Cholestyramine is an achiral, cross-linked, synthetic polymer; it possesses no stereocenters and acts via electrostatic ion exchange.'
              },
              {
                id: 'f',
                text: 'It is contraindicated in patients with severe hepatic dysfunction.',
                isCorrect: false,
                explanation: 'False: Because it is not absorbed systemically, it does not depend on hepatic clearance and is not hepatotoxic (it is contraindicated in complete biliary obstruction, but not generic hepatic dysfunction).'
              },
              {
                id: 'g',
                text: 'Cardiotoxicity and hepatotoxicity are potential side effects.',
                isCorrect: false,
                explanation: 'False: Because there is zero systemic absorption, cardiotoxicity and hepatotoxicity do not occur; side effects are strictly gastrointestinal (constipation, flatulence, bloating).'
              },
              {
                id: 'h',
                text: 'It is parenterally used to decrease the hepatic biosynthesis of cholesterol.',
                isCorrect: false,
                explanation: 'False: Cholestyramine is strictly administered orally as a slurry/suspension; it is never given parenterally.'
              },
              {
                id: 'i',
                text: 'It is contraindicated in pregnant patients.',
                isCorrect: false,
                explanation: 'False: Because it is not absorbed systemically, bile acid sequestrants are the safest lipid-lowering agents during pregnancy (FDA Category B).'
              },
              {
                id: 'j',
                text: 'Reduced absorption is a potential issue upon the co-administration of other orally active drugs.',
                isCorrect: true,
                explanation: 'True: The strongly cationic resin non-specifically binds acidic and neutral co-administered drugs (warfarin, digoxin, thiazides, levothyroxine), severely impairing their absorption. Other drugs must be taken >=1 hour before or 4-6 hours after.'
              }
            ],
            overallExplanation: 'Cholestyramine is an achiral quaternary ammonium polymer that binds bile acids in the gut lumen via pH-independent ion exchange. It is non-absorbed, safe in pregnancy, and free of systemic toxicities, but impairs absorption of co-administered drugs.',
            highYieldPearl: 'Cholestyramine resin: Quaternary ammonium = pH-INDEPENDENT; non-absorbed = safest in pregnancy; major drug interaction = binds co-administered oral drugs (take 1 hr before or 4-6 hrs after!).',
            sourceReference: 'Review for Antihyperlipidemics, Page 4, Question 33',
            sourcePageNumber: 4
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // REVIEW PAGE 5: Lomitapide & Fibrate Head-to-Head Comparison (Q34 - Q35)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 5,
    title: 'Anti-hyperlipidemics: Lomitapide Profile & Fibrate Comparison (Gemfibrozil vs Fenofibrate)',
    subtitle: 'MTP inhibition black box warnings, and isobutyrate prodrugs vs active dimethylphenoxy fibrates',
    sections: [
      {
        sectionTitle: 'Drug Z (Lomitapide) and Fibrates: Molecule I (Gemfibrozil) vs Molecule II (Fenofibrate)',
        block_instructions: 'Consider Drug Z (Lomitapide) and Molecules I & II to answer questions (1 - 2):',
        structures: PAGE_5_STRUCTURES,
        questions: [
          {
            id: 734,
            questionNumberLabel: 'Question 1',
            title: 'Drug Z (Lomitapide) True/False Profile',
            category: 'Medicinal Chemistry & Pharmacology',
            type: 'sub-statements',
            questionStem: 'Consider the chemical structure of antihyperlipidemic Z (Lomitapide) to state whether each of the following statements is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'Chemically, it is a hydrophilic hexafluorinated dicarboxamide derivative.',
                isCorrect: false,
                explanation: 'False: Lomitapide is extremely LIPOPHILIC (MW ~693.7, cLogP = 7.0), NOT hydrophilic!'
              },
              {
                id: 'b',
                text: 'Mechanistically, it disrupts the assembly of chylomicrons and VLDL.',
                isCorrect: true,
                explanation: 'True: By binding and inhibiting microsomal triglyceride transfer protein (MTP), it prevents lipid transfer onto ApoB, halting chylomicron and VLDL assembly.'
              },
              {
                id: 'c',
                text: 'Its site of action is intestine (enterocytes) as well as liver (hepatocytes).',
                isCorrect: true,
                explanation: 'True: MTP is expressed in both enterocytes and hepatocytes; lomitapide inhibits MTP in both locations.'
              },
              {
                id: 'd',
                text: 'Its pharmacological activity is stereochemistry-dependent.',
                isCorrect: false,
                explanation: 'False: Lomitapide is an achiral molecule with no chiral centers.'
              },
              {
                id: 'e',
                text: 'It is a highly lipophilic drug, and therefore, it has poor oral bioavailability.',
                isCorrect: false,
                explanation: 'False: Lomitapide has poor oral bioavailability (~7%) due to extensive first-pass hepatic metabolism by CYP3A4, NOT because its lipophilicity prevents absorption.'
              },
              {
                id: 'f',
                text: 'It is extensively metabolized in liver.',
                isCorrect: true,
                explanation: 'True: It undergoes extensive hepatic metabolism, predominantly via CYP3A4 (as well as CYP1A2, 2B6, 2C8, and 2C19).'
              },
              {
                id: 'g',
                text: 'It is a multicyclic lipophilic drug, and therefore, it has a high plasma protein binding, a large volume of distribution, and an extended elimination half-life.',
                isCorrect: true,
                explanation: 'True: Plasma protein binding is 99.8%, volume of distribution is massive (985-1292 L), and elimination half-life is ~39.7 hours.'
              },
              {
                id: 'h',
                text: 'It is contraindicated in patients with hepatic dysfunction.',
                isCorrect: true,
                explanation: 'True: Lomitapide carries a boxed warning for hepatotoxicity and hepatic steatosis (accumulation of triglycerides in liver) and is contraindicated in moderate-to-severe hepatic impairment.'
              },
              {
                id: 'i',
                text: 'It is mainly metabolized by oxidative-N-dealkylation mediated by CYP3A4.',
                isCorrect: true,
                explanation: 'True: CYP3A4-mediated oxidative N-dealkylation cleaves the carboxamide linkage to yield inactive M1 and M3 metabolites.'
              }
            ],
            overallExplanation: 'Lomitapide is a highly lipophilic, achiral MTP inhibitor functioning in both enterocytes and hepatocytes to block ApoB lipoprotein assembly. It carries black box warnings for hepatotoxicity/steatosis and is extensively metabolized by CYP3A4.',
            highYieldPearl: 'Lomitapide = MTP inhibitor in enterocytes & hepatocytes -> blocks chylomicron and VLDL assembly. Achiral, highly lipophilic (cLogP 7.0), hepatotoxic boxed warning.',
            sourceReference: 'Review for Antihyperlipidemics, Page 5, Question 34',
            sourcePageNumber: 5
          },
          {
            id: 735,
            questionNumberLabel: 'Question 2',
            title: 'Fibrates Head-to-Head: Molecule I (Gemfibrozil) vs Molecule II (Fenofibrate)',
            category: 'Medicinal Chemistry SAR & PK',
            type: 'sub-statements',
            questionStem: 'Consider the structures of Molecule I (Gemfibrozil) and Molecule II (Fenofibrate) to state whether each of the following statements is true or false:',
            subStatements: [
              {
                id: 'a',
                text: 'The two molecules are isobutyrate derivatives.',
                isCorrect: false,
                explanation: 'False: Fenofibrate is an isobutyrate derivative (2-phenoxy-2-methylpropanoic acid core); Gemfibrozil is a 5-phenoxy-2,2-dimethylpentanoic acid derivative.'
              },
              {
                id: 'b',
                text: 'Molecule I is an active drug whereas Molecule II is a prodrug.',
                isCorrect: true,
                explanation: 'True: Molecule I (Gemfibrozil) is administered as an active carboxylic acid; Molecule II (Fenofibrate) is an isopropyl ester prodrug requiring esterase cleavage to fenofibric acid.'
              },
              {
                id: 'c',
                text: 'The active form of each molecule above activates nuclear PPARα.',
                isCorrect: true,
                explanation: 'True: Both fenofibric acid and gemfibrozil activate nuclear peroxisome proliferator-activated receptor alpha (PPAR-alpha).'
              },
              {
                id: 'd',
                text: 'Molecule I reaches the peak concentration faster than Molecule II.',
                isCorrect: true,
                explanation: 'True: Gemfibrozil is rapidly absorbed with a tmax of 1-2 hours, whereas fenofibrate prodrug absorption and esterase activation take 2-8 hours.'
              },
              {
                id: 'e',
                text: 'Molecule I has longer elimination half-life than Molecule II.',
                isCorrect: false,
                explanation: 'False: Gemfibrozil has a short half-life of ~1.5 hours (requiring BID dosing), whereas active fenofibric acid has a long half-life of ~20 hours (enabling once-daily dosing).'
              },
              {
                id: 'f',
                text: 'Molecule I is metabolized by phases I and II whereas Molecule II is metabolized only by phase II.',
                isCorrect: true,
                explanation: 'True: Gemfibrozil undergoes rapid Phase I benzylic methyl oxidation by CYP enzymes followed by Phase II glucuronidation. Fenofibric acid bypasses CYP Phase I oxidation and is eliminated primarily as fenofibric acid-O-glucuronide (Phase II only).'
              },
              {
                id: 'g',
                text: 'The two molecules are orally used to treat arteriosclerosis.',
                isCorrect: true,
                explanation: 'True: Both are orally administered fibrates indicated for hypertriglyceridemia and dyslipidemia to reduce atherosclerotic cardiovascular events.'
              },
              {
                id: 'h',
                text: 'As antihyperlipidemics, Molecule I is more potent than Molecule II.',
                isCorrect: false,
                explanation: 'False: Fenofibrate is ~6-fold MORE potent than Gemfibrozil (typical max daily dose of fenofibrate is ~200 mg vs gemfibrozil 1200 mg).'
              }
            ],
            overallExplanation: 'Gemfibrozil is an active drug with rapid absorption (tmax 1-2h), short half-life (1.5h, BID), and Phase I + II metabolism. Fenofibrate is an ester prodrug with slower absorption (tmax 2-8h), long half-life (20h, once daily), 6-fold higher potency, and Phase II-only metabolism.',
            highYieldPearl: 'Fenofibrate is ~6-fold more potent than Gemfibrozil, has a 20h half-life (vs 1.5h for gemfibrozil), and is an ester prodrug metabolized solely by Phase II glucuronidation.',
            sourceReference: 'Review for Antihyperlipidemics, Page 5, Question 35',
            sourcePageNumber: 5
          }
        ]
      }
    ]
  }
];

export function getDefaultAntihyperlipidemicsModule(): ReviewModule {
  return {
    id: 'antihyperlipidemics_mcp2',
    version: '2.0.0',
    examId: 'exam_2',
    examTitle: 'Exam 2: Antihypertensives & Lipids',
    title: 'Antihyperlipidemics & Lipid-Lowering Agents',
    subtitle: 'HMG-CoA Reductase Inhibitors (Statins), Fibrates (PPAR-alpha), Ezetimibe (NPC1L1), Bile Acid Resins, Niacin, and Lomitapide (MTP)',
    course: 'Medicinal Chemistry & Pharmacology II',
    semester: 'Spring',
    code: 'MCP-2-07',
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    chemicalStructures: Object.values(LIPIDS_STRUCTURES),
    pages: antihyperlipidemicsPages,
  };
}
