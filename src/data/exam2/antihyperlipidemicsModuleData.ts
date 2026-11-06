import { ReviewModule, ReviewPage } from '../../types/reviewModule';
import { LIPIDS_STRUCTURES } from './exam2Structures';

export const antihyperlipidemicsPages: ReviewPage[] = [
  // ---------------------------------------------------------------------------
  // PAGE 1: HMG-CoA Reductase Inhibitors (Statins) SAR & ADME (Questions 1 - 18)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 1,
    title: 'HMG-CoA Reductase Inhibitors (Statins): Pharmacophore SAR & ADME',
    subtitle: '3,5-Dihydroxyheptanoic acid pharmacophore, lactone prodrugs, fungal prototypes vs synthetic statins, CYP3A4/CYP2C9, and hepatoselectivity',
    sections: [
      {
        sectionTitle: 'Statin Pharmacophore, Mechanism & Structural Benchmarks',
        block_instructions: 'Consider Structures I (Lovastatin), II (Simvastatin), III (Pravastatin), IV (Atorvastatin), and V (Rosuvastatin) to answer questions 1 - 18.',
        structures: [
          LIPIDS_STRUCTURES.lovastatin,
          LIPIDS_STRUCTURES.simvastatin,
          LIPIDS_STRUCTURES.pravastatin,
          LIPIDS_STRUCTURES.atorvastatin,
          LIPIDS_STRUCTURES.rosuvastatin,
        ],
        questions: [
          {
            id: 701,
            questionNumberLabel: 'Question 1',
            title: 'Chemical Class of Statins',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following best describes the chemical class of active statin molecules?',
            options: [
              'Benzothiadiazine-1,1-dioxide',
              '1,4-Dihydropyridine',
              'Aryloxypropanolamine',
              'Arylethanolamine',
              'Sulfamoyl anthranilic acid',
              'Steroid',
              'Peptidomimetic',
              '7-Substituted 3,5-dihydroxyheptanoic (or hept-6-enoic) acids'
            ],
            correctIndex: 7,
            optionExplanations: [
              'Incorrect: Not thiazides.',
              'Incorrect: Not CCBs.',
              'Incorrect: Not beta-blockers.',
              'Incorrect: Not arylethanolamines.',
              'Incorrect: Not loop diuretics.',
              'Incorrect: Not steroids.',
              'Incorrect: Not peptide mimetics.',
              'Correct: Statins contain an essential 7-carbon chain terminating in a 3,5-dihydroxycarboxylic acid (or corresponding delta-lactone prodrug) linked to a bulky hydrophobic ring system.'
            ],
            overallExplanation: 'The 3,5-dihydroxyheptanoic acid moiety mimics the 3-hydroxy-3-methylglutaryl (HMG) portion of the endogenous substrate and its hemithioacetal transition state.',
            highYieldPearl: 'Statin pharmacophore = 7-substituted (3R,5R)-3,5-dihydroxyheptanoic acid. Mimics the tetrahedral transition state of HMG-CoA.',
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
              'Potassium-sparing agents',
              'Loop diuretics',
              'Thiazide diuretics',
              'Calcium channel blockers',
              'Beta-Blockers',
              'Angiotensin-converting enzyme inhibitors',
              'Angiotensin II receptor antagonists',
              'HMG-CoA reductase inhibitors'
            ],
            correctIndex: 7,
            optionExplanations: [
              'Incorrect: Not diuretics.',
              'Incorrect: Not CCBs.',
              'Incorrect: Not beta-blockers.',
              'Incorrect: Not ACEIs.',
              'Incorrect: Not ARBs.',
              'Correct: Statins competitively inhibit 3-hydroxy-3-methylglutaryl-coenzyme A (HMG-CoA) reductase, the rate-limiting enzyme in de novo hepatic cholesterol biosynthesis, upregulating LDL receptors on hepatocytes.'
            ],
            overallExplanation: 'Inhibition of HMG-CoA reductase depletes intracellular cholesterol in hepatocytes, triggering SREBP-2 cleavage and upregulation of cell-surface LDL receptors that clear circulating LDL-C.',
            highYieldPearl: 'Statins block HMG-CoA reductase -> decrease hepatic cholesterol -> upregulate LDL receptors -> clear LDL from blood.',
            sourceReference: 'Review for Antihyperlipidemics, Page 1, Question 2',
            sourcePageNumber: 1
          },
          {
            id: 703,
            questionNumberLabel: 'Question 3',
            title: 'Therapeutic Indications',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'The above drugs are primarily indicated to treat which of the following diseases?',
            options: [
              'Diabetes mellitus',
              'Hypertension',
              'Chronic obstructive pulmonary disease',
              'Peptic ulcer disease',
              'Atherosclerotic cardiovascular disease (ASCVD) and Hyperlipidemia / Dyslipidemia'
            ],
            correctIndex: 4,
            optionExplanations: [
              'Incorrect: Statins do not treat diabetes directly (though they reduce ASCVD risk in diabetics).',
              'Incorrect: Not primary antihypertensives.',
              'Incorrect: Not for COPD.',
              'Incorrect: Not for peptic ulcers.',
              'Correct: Statins are the primary guideline-directed pharmacotherapy for primary and secondary prevention of atherosclerotic cardiovascular disease (ASCVD), myocardial infarction, stroke, and hypercholesterolemia.'
            ],
            overallExplanation: 'Statins reduce major adverse cardiovascular events (MACE) in primary and secondary ASCVD prevention, lowering LDL-C by 30% to >50%.',
            highYieldPearl: 'Statins = first-line therapy for ASCVD reduction, primary hypercholesterolemia, and mixed dyslipidemia.',
            sourceReference: 'Review for Antihyperlipidemics, Page 1, Question 3',
            sourcePageNumber: 1
          },
          {
            id: 704,
            questionNumberLabel: 'Question 4',
            title: 'Statin SAR and Stereochemical Requirements',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'State whether each of the following statements is true or false regarding statin SAR:',
            subStatements: [
              {
                id: 'a',
                text: 'They are competitive receptor antagonists.',
                isCorrect: false,
                explanation: 'False: Statins are competitive enzyme inhibitors, not receptor antagonists.'
              },
              {
                id: 'b',
                text: 'They are active-site competitive enzyme inhibitors of HMG-CoA reductase.',
                isCorrect: true,
                explanation: 'True: They compete directly with the HMG-CoA substrate for the catalytic domain.'
              },
              {
                id: 'c',
                text: 'They are active-site transporter blockers in the nephron.',
                isCorrect: false,
                explanation: 'False: Their target is the cytosolic/ER enzyme HMG-CoA reductase in hepatocytes.'
              },
              {
                id: 'd',
                text: 'They are transition-state mimetics.',
                isCorrect: true,
                explanation: 'True: The 3,5-dihydroxy acid pharmacophore mimics the tetrahedral mevaldehyde hemithioacetal intermediate of the reduction reaction.'
              },
              {
                id: 'e',
                text: 'The stereochemistry of the chiral centers at positions 3 and 5 is strictly determined as (3R, 5R).',
                isCorrect: true,
                explanation: 'True: Natural HMG has (3R) configuration; inversion of either the 3R or 5R stereocenter abolishes inhibitory activity.'
              },
              {
                id: 'f',
                text: 'The pharmacophore requires two domains: a "transition-state-like dihydroxy acid" and a bulky lipophilic "affinity" domain separated by a 2-carbon spacer.',
                isCorrect: true,
                explanation: 'True: The dihydroxy acid coordinates active-site residues while the bulky aromatic/decalin system binds the adjacent hydrophobic groove.'
              }
            ],
            overallExplanation: 'Statins are transition-state competitive inhibitors of HMG-CoA reductase requiring exact (3R,5R) stereochemistry in the dihydroxy acid pharmacophore.',
            highYieldPearl: 'Statins must have (3R,5R) stereochemistry! The dihydroxy acid mimics the transition state; the bulky hydrophobic core confers nanomolar affinity.',
            sourceReference: 'Review for Antihyperlipidemics, Page 1, Question 4',
            sourcePageNumber: 1
          },
          {
            id: 705,
            questionNumberLabel: 'Question 5',
            title: 'Lactone Prodrug Statins',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the above statins are PRODRUGS containing a closed delta-lactone ring that must be enzymatically hydrolyzed to the active 3,5-dihydroxy open acid in the liver?',
            options: [
              'Lovastatin (Drug I) and Simvastatin (Drug II)',
              'Pravastatin (Drug III) and Atorvastatin (Drug IV)',
              'Rosuvastatin (Drug V) only',
              'Pitavastatin only'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Lovastatin and Simvastatin are administered as inactive closed delta-lactone rings. In the liver, microsomal and cytosolic carboxylesterases/paraoxonases hydrolyze the lactone to release the active (3R,5R)-dihydroxy open acid.',
              'Incorrect: Pravastatin is administered directly as an open sodium salt.',
              'Incorrect: Atorvastatin is an active open acid calcium salt.',
              'Incorrect: Rosuvastatin is an active open acid calcium salt.'
            ],
            overallExplanation: 'Lovastatin and Simvastatin are lactone prodrugs. The lactone renders them more lipophilic, facilitating passive intestinal absorption before hepatic esterases convert them to the active dihydroxy open acid.',
            highYieldPearl: 'Statin lactone prodrugs: Lovastatin & Simvastatin. Active open-ring salts: Pravastatin, Atorvastatin, Rosuvastatin, Fluvastatin, Pitavastatin.',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 5',
            sourcePageNumber: 2
          },
          {
            id: 706,
            questionNumberLabel: 'Question 6',
            title: 'Natural and Semi-Synthetic vs Fully Synthetic Statins',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following correctly classifies natural/semi-synthetic statins (Type I) vs fully synthetic statins (Type II)?',
            options: [
              'Type I (Natural / Semi-synthetic with hexahydronaphthalene core): Lovastatin, Simvastatin, Pravastatin; Type II (Fully synthetic heterocyclic core): Atorvastatin, Rosuvastatin, Fluvastatin, Pitavastatin',
              'Type I: Atorvastatin and Rosuvastatin; Type II: Lovastatin and Simvastatin',
              'All marketed statins are natural fermentation products',
              'All marketed statins are fully synthetic'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Type I statins possess a decalin/hexahydronaphthalene ring derived from fungal fermentation (Lovastatin from Aspergillus terreus, semi-synthetic Simvastatin, and microbial hydroxylated Pravastatin). Type II statins replace decalin with synthetic heterocycles: pyrrole (atorvastatin), pyrimidine (rosuvastatin), indole (fluvastatin), or quinoline (pitavastatin).',
              'Incorrect: Inverted assignment.',
              'Incorrect: Atorvastatin and rosuvastatin are synthetic.',
              'Incorrect: Lovastatin is natural.'
            ],
            overallExplanation: 'Type I statins contain the natural decalin core; Type II synthetic statins feature diverse heterocyclic cores (pyrrole, pyrimidine, indole) with higher affinity and metabolic stability.',
            highYieldPearl: 'Type I (Decalin core, fungal): Lovastatin, Simvastatin, Pravastatin. Type II (Heterocyclic core, synthetic): Atorvastatin (pyrrole), Rosuvastatin (pyrimidine), Fluvastatin (indole).',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 6',
            sourcePageNumber: 2
          },
          {
            id: 707,
            questionNumberLabel: 'Question 7',
            title: 'Amphoteric Statin: Rosuvastatin',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following statins is an AMPHOTERIC molecule containing both acidic (carboxylate and methanesulfonamide) and basic (heterocyclic nitrogen) functional groups?',
            options: [
              'Lovastatin',
              'Simvastatin',
              'Pravastatin',
              'Rosuvastatin (Drug V)'
            ],
            correctIndex: 3,
            optionExplanations: [
              'Incorrect: Lovastatin is neutral as a lactone prodrug.',
              'Incorrect: Simvastatin is neutral as a lactone prodrug.',
              'Incorrect: Pravastatin is purely acidic (carboxylic acid).',
              'Correct: Rosuvastatin contains an acidic heptenoic carboxylate (pKa ~4.0) and an acidic N-methyl methanesulfonamide group, alongside a weakly basic pyrimidine ring nitrogen (pKa ~2.5), giving it unique amphoteric/zwitterionic properties.'
            ],
            overallExplanation: 'Rosuvastatin pyrimidine ring nitrogen provides weak basicity, while its carboxylic acid and methane sulfonamide provide acidic properties, imparting an amphoteric nature that contributes to its hydrophilicity.',
            highYieldPearl: 'Rosuvastatin = amphoteric statin (basic pyrimidine ring + acidic carboxylic acid + acidic sulfonamide). Highly hydrophilic (logP ~ -0.3).',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 7',
            sourcePageNumber: 2
          },
          {
            id: 708,
            questionNumberLabel: 'Question 8',
            title: 'Hepato-Selective Statins',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above statins are relatively HEPATO-SELECTIVE because of their hydrophilicity and selective uptake by hepatic organic anion transporting polypeptide 1B1 (OATP1B1)?',
            options: [
              'Lovastatin and Simvastatin (lipophilic)',
              'Pravastatin and Rosuvastatin (hydrophilic)',
              'Atorvastatin only',
              'All statins distribute equally into all body tissues'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Lovastatin and simvastatin are highly lipophilic and passively penetrate peripheral tissues including skeletal muscle.',
              'Correct: Pravastatin and Rosuvastatin are hydrophilic (polar). They cannot passively diffuse into peripheral muscle myocytes; instead, they depend on active transport by OATP1B1 (SLCO1B1) expressed selectively on the sinusoidal membrane of hepatocytes, concentrating their action in the liver.',
              'Incorrect: Atorvastatin is lipophilic.',
              'Incorrect: Tissue distribution varies greatly by lipophilicity.'
            ],
            overallExplanation: 'Hydrophilic statins (Pravastatin, Rosuvastatin) depend on OATP1B1 for active hepatic uptake and have low passive permeability into extrahepatic tissues like skeletal muscle.',
            highYieldPearl: 'Hepato-selective / Hydrophilic statins = Pravastatin & Rosuvastatin. Taken up selectively by hepatic OATP1B1 -> minimal passive entry into skeletal muscle.',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 8',
            sourcePageNumber: 2
          },
          {
            id: 709,
            questionNumberLabel: 'Question 9',
            title: 'Reduced Risk of Myopathy and Rhabdomyolysis',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the above statins is LEAST likely to cause statin-associated muscle symptoms (SAMS), myopathy, or rhabdomyolysis?',
            options: [
              'Simvastatin (high lipophilicity and heavy CYP3A4 dependence)',
              'Pravastatin (hydrophilic, not metabolized by CYPs, low muscle penetration)',
              'Lovastatin',
              'Atorvastatin at high doses'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Simvastatin has the highest reported incidence of myopathy and drug interactions.',
              'Correct: Pravastatin is hydrophilic (does not passively enter myocytes) and is cleared renally/biliary without CYP metabolism, drastically reducing the risk of pharmacokinetic drug-drug interactions and myopathy.',
              'Incorrect: Lovastatin is lipophilic and CYP3A4-dependent.',
              'Incorrect: High-dose atorvastatin carries higher myopathy risk than pravastatin.'
            ],
            overallExplanation: 'Pravastatin displays the lowest potential for myopathy and rhabdomyolysis because of its hydrophilicity (poor passive entry into myocytes) and lack of CYP3A4/CYP2C9 drug interactions.',
            highYieldPearl: 'Pravastatin has the lowest myopathy risk: hydrophilic (avoids skeletal muscle) + non-CYP elimination (avoids drug interactions).',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 9',
            sourcePageNumber: 2
          },
          {
            id: 710,
            questionNumberLabel: 'Question 10',
            title: 'Central Nervous System Penetration and Alzheimer\'s Research',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which statins have sufficient lipophilicity to cross the blood-brain barrier and have been investigated for potential neuroprotective effects in Alzheimer\'s disease?',
            options: [
              'Pravastatin and Rosuvastatin',
              'Simvastatin and Atorvastatin (lipophilic statins)',
              'Colesevelam',
              'Fenofibrate'
            ],
            correctIndex: 1,
            optionExplanations: [
              'Incorrect: Pravastatin and rosuvastatin are hydrophilic and do not cross the BBB.',
              'Correct: Lipophilic statins such as Simvastatin (LogP ~4.4) and Atorvastatin (LogP ~5.7) readily cross the blood-brain barrier, reducing brain cholesterol synthesis and amyloid-beta production in preclinical neurodegenerative models.',
              'Incorrect: Colesevelam is a non-absorbed resin.',
              'Incorrect: Fenofibrate is a fibrate.'
            ],
            overallExplanation: 'Lipophilic statins (Simvastatin, Lovastatin, Atorvastatin) cross the BBB, whereas hydrophilic statins (Pravastatin, Rosuvastatin) remain largely excluded from the CNS.',
            highYieldPearl: 'Lipophilic statins (Simvastatin, Atorvastatin, Lovastatin) cross the BBB. Hydrophilic statins (Pravastatin, Rosuvastatin) do not cross BBB.',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 10',
            sourcePageNumber: 2
          },
          {
            id: 711,
            questionNumberLabel: 'Question 11',
            title: 'Cytochrome P450 Metabolic Profiles of Statins',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which statins are primarily metabolized by CYP3A4 vs CYP2C9 vs non-CYP pathways?',
            options: [
              'CYP3A4: Lovastatin, Simvastatin, Atorvastatin; CYP2C9: Fluvastatin, Rosuvastatin (minor); Non-CYP: Pravastatin and Pitavastatin',
              'CYP3A4: Pravastatin; CYP2C9: Atorvastatin; Non-CYP: Simvastatin',
              'All statins are metabolized by CYP3A4 exclusively',
              'All statins bypass CYP metabolism completely'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Lovastatin, Simvastatin, and Atorvastatin are extensive CYP3A4 substrates. Fluvastatin is metabolized by CYP2C9; Rosuvastatin undergoes minor (~10%) CYP2C9 metabolism. Pravastatin is cleared by sulfation and renal/biliary elimination; Pitavastatin undergoes glucuronidation (UGT1A3/2B7) with minimal CYP2C9.',
              'Incorrect: Pravastatin does not use CYP3A4.',
              'Incorrect: Diverse pathways exist.',
              'Incorrect: CYPs play major roles for many statins.'
            ],
            overallExplanation: 'Statin drug interactions are governed by their CYP pathway: CYP3A4 (Lovastatin, Simvastatin, Atorvastatin), CYP2C9 (Fluvastatin, Rosuvastatin minor), and non-CYP (Pravastatin, Pitavastatin).',
            highYieldPearl: 'CYP3A4 statins: Lovastatin, Simvastatin, Atorvastatin. CYP2C9: Fluvastatin. Non-CYP: Pravastatin (sulfation) and Pitavastatin (glucuronidation).',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 11',
            sourcePageNumber: 2
          },
          {
            id: 712,
            questionNumberLabel: 'Question 12',
            title: 'Grapefruit Juice Drug-Drug Interaction',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Co-administration of grapefruit juice is contraindicated or requires severe restriction with which statins because of irreversible mechanism-based inhibition of intestinal CYP3A4?',
            options: [
              'Lovastatin, Simvastatin, and Atorvastatin',
              'Pravastatin and Rosuvastatin',
              'Fluvastatin',
              'Pitavastatin'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Furanocoumarins (e.g., bergamottin) in grapefruit juice irreversibly inhibit intestinal CYP3A4, dramatically reducing first-pass extraction and elevating AUC of Simvastatin (up to 15-fold) and Lovastatin, precipitating severe myopathy/rhabdomyolysis.',
              'Incorrect: Pravastatin and rosuvastatin do not rely on CYP3A4 and are unaffected by grapefruit juice.',
              'Incorrect: Fluvastatin is metabolized by CYP2C9.',
              'Incorrect: Pitavastatin is not metabolized by CYP3A4.'
            ],
            overallExplanation: 'Grapefruit juice selectively inhibits intestinal enterocyte CYP3A4, causing massive accumulation of orally administered CYP3A4 statins (Simvastatin, Lovastatin, Atorvastatin).',
            highYieldPearl: 'Grapefruit juice inhibits intestinal CYP3A4 -> massive increase in Simvastatin, Lovastatin, Atorvastatin levels -> high risk of rhabdomyolysis!',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 12',
            sourcePageNumber: 2
          },
          {
            id: 713,
            questionNumberLabel: 'Question 13',
            title: 'Oxidative N-Demethylation of Rosuvastatin',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which of the above statins undergoes minor hepatic Phase I metabolism mediated by CYP2C9 via oxidative N-demethylation of its sulfonamide group?',
            options: [
              'Rosuvastatin (Drug V)',
              'Lovastatin',
              'Pravastatin',
              'Simvastatin'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Only ~10% of rosuvastatin is metabolized, primarily by CYP2C9 to N-desmethyl rosuvastatin (which retains ~50% of parent HMG-CoA reductase inhibitory activity).',
              'Incorrect: Lovastatin is metabolized by CYP3A4 alicyclic hydroxylation.',
              'Incorrect: Pravastatin is not N-demethylated.',
              'Incorrect: Simvastatin does not contain an N-methyl group.'
            ],
            overallExplanation: 'Rosuvastatin minor CYP2C9 metabolite is N-desmethyl rosuvastatin, formed by oxidative cleavage of the methyl group on the N-methylmethanesulfonamide side chain.',
            highYieldPearl: 'Rosuvastatin minor metabolite = N-desmethyl rosuvastatin (CYP2C9 oxidative N-demethylation).',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 13',
            sourcePageNumber: 2
          },
          {
            id: 714,
            questionNumberLabel: 'Question 14',
            title: 'Antacid Interaction with Rosuvastatin',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which statin has its oral bioavailability reduced by approximately 50% when co-administered with antacids containing aluminum and magnesium hydroxide?',
            options: [
              'Rosuvastatin (Crestor)',
              'Atorvastatin',
              'Lovastatin',
              'Simvastatin'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Aluminum and magnesium ions in antacids adsorb and chelate rosuvastatin, decreasing its plasma AUC and Cmax by ~50%. Patients must space antacid ingestion by at least 2 hours after rosuvastatin.',
              'Incorrect: Atorvastatin bioavailability is not significantly altered by antacid chelation.',
              'Incorrect: Lovastatin is not reduced by 50%.',
              'Incorrect: Simvastatin is not significantly chelated.'
            ],
            overallExplanation: 'Antacids containing Al(OH)3/Mg(OH)2 decrease rosuvastatin exposure by 50% through physical adsorption/chelation, requiring a 2-hour administration gap.',
            highYieldPearl: 'Rosuvastatin + Al/Mg Antacids: 50% decrease in rosuvastatin AUC -> separate administration by at least 2 hours!',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 14',
            sourcePageNumber: 2
          },
          {
            id: 715,
            questionNumberLabel: 'Question 15',
            title: 'Food-Enhanced Bioavailability: Lovastatin',
            category: 'Pharmacokinetics ADME',
            type: 'multiple-choice',
            questionStem: 'Which statin must be taken with meals (specifically the evening meal) because food enhances its oral bioavailability by approximately 50%?',
            options: [
              'Lovastatin (Mevacor)',
              'Atorvastatin',
              'Pravastatin',
              'Rosuvastatin'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Lovastatin oral absorption and bioavailability are increased by ~50% when taken with food; fasting reduces its absorption, so immediate-release lovastatin is labeled to be taken with the evening meal.',
              'Incorrect: Atorvastatin can be taken with or without food at any time of day.',
              'Incorrect: Pravastatin absorption is actually decreased slightly by food.',
              'Incorrect: Rosuvastatin can be taken with or without food.'
            ],
            overallExplanation: 'Food increases the bioavailability of lovastatin by 50%, whereas pravastatin absorption is reduced by food, and atorvastatin/rosuvastatin are unaffected.',
            highYieldPearl: 'Lovastatin should be taken WITH the evening meal (food increases bioavailability by 50%). Atorvastatin and Rosuvastatin can be taken anytime with or without food.',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 15',
            sourcePageNumber: 2
          },
          {
            id: 716,
            questionNumberLabel: 'Question 16',
            title: 'General Statin Pharmacokinetics & Safety Rules',
            category: 'Pharmacokinetics ADME',
            type: 'sub-statements',
            questionStem: 'State whether each of the following statements is true or false regarding statins:',
            subStatements: [
              {
                id: 'a',
                text: 'All active statins are metabolized primarily by CYP3A4.',
                isCorrect: false,
                explanation: 'False: Fluvastatin and rosuvastatin use CYP2C9; pravastatin and pitavastatin bypass CYPs.'
              },
              {
                id: 'b',
                text: 'All active statins are metabolized primarily by CYP2C9.',
                isCorrect: false,
                explanation: 'False: Only fluvastatin and minor rosuvastatin utilize CYP2C9.'
              },
              {
                id: 'c',
                text: 'Dose adjustment and clinical caution are mandatory in severe active liver dysfunction.',
                isCorrect: true,
                explanation: 'True: Statins are cleared primarily by the liver; active liver disease is a contraindication.'
              },
              {
                id: 'd',
                text: 'Dose adjustment is required in renal insufficiency for ALL statins, including atorvastatin.',
                isCorrect: false,
                explanation: 'False: Atorvastatin is eliminated <2% in urine and requires NO dosage adjustment in renal impairment.'
              },
              {
                id: 'e',
                text: 'Their plasma protein binding is generally high (>90% for most statins, except pravastatin ~50%).',
                isCorrect: true,
                explanation: 'True: Most statins are lipophilic and bind tightly to albumin.'
              }
            ],
            overallExplanation: 'Statins exhibit diverse CYP metabolism, high protein binding, contraindication in active liver disease, and variable renal clearance (Atorvastatin requires no renal adjustment).',
            highYieldPearl: 'Atorvastatin = no renal dose adjustment needed (<2% excreted in urine). Pravastatin = lowest protein binding (~50%).',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 16',
            sourcePageNumber: 2
          },
          {
            id: 717,
            questionNumberLabel: 'Question 17',
            title: 'Atorvastatin (Drug X) Characteristics',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'State whether each of the following statements is true or false regarding Atorvastatin (Lipitor):',
            subStatements: [
              {
                id: 'a',
                text: 'It is extensively metabolized by CYP3A4 to ortho- and para-hydroxylated active metabolites.',
                isCorrect: true,
                explanation: 'True: Ortho- and para-hydroxyatorvastatin account for ~70% of circulating HMG-CoA reductase inhibitory activity.'
              },
              {
                id: 'b',
                text: 'The multi-substituted pyrrole core is responsible for high-affinity hydrophobic binding to the enzyme groove.',
                isCorrect: true,
                explanation: 'True: The central pyrrole ring with phenyl, isopropyl, and anilide substituents provides extensive van der Waals interactions.'
              },
              {
                id: 'c',
                text: 'The active pharmacophore is a 3,5-dihydroxypentanoic acid.',
                isCorrect: false,
                explanation: 'False: It is a 3,5-dihydroxyHEPTANOIC acid (7-carbon chain, not 5-carbon pentanoic acid).'
              },
              {
                id: 'd',
                text: 'At high doses (80 mg), it is effective in decreasing LDL-C levels by up to 55-60%.',
                isCorrect: true,
                explanation: 'True: Atorvastatin 40-80 mg is a high-intensity statin regimen achieving >=50% LDL-C reduction.'
              },
              {
                id: 'e',
                text: 'Its full therapeutic lipid-lowering effect is detected within 3 days.',
                isCorrect: false,
                explanation: 'False: Full upregulation of LDL receptors and maximal LDL-C lowering takes 2 to 4 weeks.'
              },
              {
                id: 'f',
                text: 'It is an amphoteric molecule.',
                isCorrect: false,
                explanation: 'False: Atorvastatin is a weak acid (carboxylate); it lacks a basic nitrogen.'
              }
            ],
            overallExplanation: 'Atorvastatin contains a pyrrole core, is metabolized by CYP3A4 to active hydroxy metabolites (70% of activity), and produces high-intensity LDL reduction over 2-4 weeks.',
            highYieldPearl: 'Atorvastatin active metabolites: Ortho- and para-hydroxyatorvastatin account for ~70% of circulating inhibitory activity.',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 17',
            sourcePageNumber: 2
          },
          {
            id: 718,
            questionNumberLabel: 'Question 18',
            title: 'Rosuvastatin (Drug Y) Characteristics',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'State whether each of the following statements is true or false regarding Rosuvastatin (Crestor):',
            subStatements: [
              {
                id: 'a',
                text: 'It undergoes minor CYP2C9-mediated oxidative N-demethylation.',
                isCorrect: true,
                explanation: 'True: ~10% is metabolized to N-desmethyl rosuvastatin.'
              },
              {
                id: 'b',
                text: 'It is very effective in decreasing LDL-C levels by up to 55-63% (most potent statin milligram-for-milligram).',
                isCorrect: true,
                explanation: 'True: Rosuvastatin 20-40 mg provides the greatest percentage LDL-C reduction among all statins.'
              },
              {
                id: 'c',
                text: 'It is hepato-selective and associated with limited passive entry into skeletal muscle.',
                isCorrect: true,
                explanation: 'True: Hydrophilicity and OATP1B1 dependence restrict its distribution primarily to the liver.'
              },
              {
                id: 'd',
                text: 'It is an amphoteric molecule containing both acidic and basic functional groups.',
                isCorrect: true,
                explanation: 'True: Pyrimidine nitrogen (basic) + carboxylic acid / methanesulfonamide (acidic).'
              }
            ],
            overallExplanation: 'Rosuvastatin is the most potent statin milligram-for-milligram, highly hydrophilic, amphoteric, and hepato-selective.',
            highYieldPearl: 'Rosuvastatin: Most potent statin (55-63% LDL reduction), amphoteric, hydrophilic, hepato-selective via OATP1B1.',
            sourceReference: 'Review for Antihyperlipidemics, Page 2, Question 18',
            sourcePageNumber: 2
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 2: Non-Statin Lipid-Lowering Classes (Questions 19 - 27)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 2,
    title: 'Non-Statin Hypolipidemics: Fibrates, Resins, Ezetimibe, Niacin & MTP Inhibitors',
    subtitle: 'PPAR-alpha agonism, bile acid sequestration, NPC1L1 cholesterol absorption blockade, and MTP inhibition',
    sections: [
      {
        sectionTitle: 'Non-Statin Drug Classes & Mechanism Matching',
        block_instructions: 'Consider Structures I (Fenofibrate), II (Ezetimibe), III (Colesevelam), IV (Niacin), V (Lomitapide), and VI (Gemfibrozil) to answer questions 19 - 27.',
        structures: [
          LIPIDS_STRUCTURES.fenofibrate,
          LIPIDS_STRUCTURES.ezetimibe,
          LIPIDS_STRUCTURES.colesevelam,
          LIPIDS_STRUCTURES.niacin,
          LIPIDS_STRUCTURES.lomitapide,
          LIPIDS_STRUCTURES.gemfibrozil,
        ],
        questions: [
          {
            id: 719,
            questionNumberLabel: 'Question 19',
            title: 'Fatty Acid-Like PPAR-Alpha Agonists: Fibrates',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which of the above molecules possesses a branched fatty acid-like structure in its active form that activates nuclear PPAR-alpha, dramatically lowering triglycerides and raising HDL?',
            options: [
              'Fibrates (Gemfibrozil and Fenofibric acid)',
              'Ezetimibe',
              'Colesevelam',
              'Lomitapide'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Fibrates (phenoxyisobutyric acids) mimic endogenous fatty acids and bind the nuclear peroxisome proliferator-activated receptor-alpha (PPAR-alpha), upregulating lipoprotein lipase (LPL) and apoA-I/apoA-II, while downregulating apoC-III, slashing triglycerides by 30-50%.',
              'Incorrect: Ezetimibe blocks NPC1L1.',
              'Incorrect: Colesevelam binds bile acids in the gut.',
              'Incorrect: Lomitapide inhibits MTP.'
            ],
            overallExplanation: 'Fibrates are PPAR-alpha agonists that stimulate lipoprotein lipase and fatty acid beta-oxidation, primarily reducing triglycerides and raising HDL.',
            highYieldPearl: 'Fibrates = PPAR-alpha nuclear receptor agonists -> increase LPL -> decrease triglycerides (30-50%) and increase HDL.',
            sourceReference: 'Review for Antihyperlipidemics, Page 3, Question 19',
            sourcePageNumber: 3
          },
          {
            id: 720,
            questionNumberLabel: 'Question 20',
            title: 'Fibrate Prodrug: Fenofibrate',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which of the following fibrates is an isopropyl ester PRODRUG that requires tissue esterase hydrolysis to generate its active carboxylic acid form?',
            options: [
              'Fenofibrate (Tricor)',
              'Gemfibrozil (Lopid)',
              'Clofibrate',
              'Niacin'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Fenofibrate is formulated as an isopropyl ester prodrug to increase lipophilicity and oral bioavailability; it is rapidly and completely hydrolyzed by plasma/tissue esterases to active fenofibric acid.',
              'Incorrect: Gemfibrozil is an active carboxylic acid parent drug.',
              'Incorrect: Clofibrate was an ethyl ester but is no longer used due to toxicity.',
              'Incorrect: Niacin is nicotinic acid.'
            ],
            overallExplanation: 'Fenofibrate is an isopropyl ester prodrug rapidly cleaved in vivo into active fenofibric acid.',
            highYieldPearl: 'Fenofibrate = isopropyl ester prodrug -> active fenofibric acid. Gemfibrozil = active carboxylic acid.',
            sourceReference: 'Review for Antihyperlipidemics, Page 3, Question 20',
            sourcePageNumber: 3
          },
          {
            id: 721,
            questionNumberLabel: 'Question 21',
            title: 'Extended-Release Niacin Formulation',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the above drugs is formulated as an extended-release tablet (Niaspan ER) to overcome its short half-life and reduce prostaglandin-mediated cutaneous flushing?',
            options: [
              'Niacin (Nicotinic acid / Vitamin B3)',
              'Gemfibrozil',
              'Ezetimibe',
              'Colesevelam'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Niacin has a very short half-life (~1 hour) and immediate-release doses trigger massive prostaglandin D2/E2 release via Langerhans cell GPR109A receptors, causing severe cutaneous flushing. Niaspan extended-release blunts the Cmax spike, mitigating flush severity (often pre-treated with aspirin).',
              'Incorrect: Gemfibrozil is dosed BID.',
              'Incorrect: Ezetimibe has a long half-life (~22h).',
              'Incorrect: Colesevelam is a resin.'
            ],
            overallExplanation: 'Extended-release Niacin (Niaspan) dampens peak plasma concentrations to minimize cutaneous vasodilation and flushing caused by prostaglandin D2/E2 release.',
            highYieldPearl: 'Niacin cutaneous flushing: Mediated by GPR109A activation in skin -> prostaglandin D2/E2 release. Mitigated by extended-release (Niaspan) and Aspirin pretreatment!',
            sourceReference: 'Review for Antihyperlipidemics, Page 3, Question 21',
            sourcePageNumber: 3
          },
          {
            id: 722,
            questionNumberLabel: 'Question 22',
            title: 'Safety in Pregnancy: Bile Acid Sequestrants',
            category: 'Clinical Pharmacology',
            type: 'multiple-choice',
            questionStem: 'Which of the following antihyperlipidemic agents is SAFE and PREFERRED for managing dyslipidemia during pregnancy because it is NOT systemically absorbed from the gastrointestinal tract?',
            options: [
              'Bile acid sequestrants (Colesevelam / Cholestyramine)',
              'Statins (Category X - strictly contraindicated)',
              'Fibrates',
              'Lomitapide (Teratogenic - strictly contraindicated)'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Colesevelam and Cholestyramine are non-absorbable polymeric resins that remain completely confined to the gastrointestinal lumen, carrying no risk of fetal drug exposure (Category B in pregnancy). In contrast, statins and lomitapide are contraindicated in pregnancy due to risks of severe fetal malformations.',
              'Incorrect: Statins disrupt cholesterol synthesis needed for fetal membrane development (teratogenic, Category X).',
              'Incorrect: Fibrates cross the placenta.',
              'Incorrect: Lomitapide carries a black-box pregnancy contraindication.'
            ],
            overallExplanation: 'Bile acid sequestrants (Colesevelam, Cholestyramine) are not absorbed from the gut into maternal circulation, making them the safest lipid-lowering agents during pregnancy.',
            highYieldPearl: 'Pregnancy & Lipids: Statins and Lomitapide are STRICTLY CONTRAINDICATED (Category X). Bile acid sequestrants (Colesevelam) are non-absorbed and safe!',
            sourceReference: 'Review for Antihyperlipidemics, Page 3, Question 22',
            sourcePageNumber: 3
          },
          {
            id: 723,
            questionNumberLabel: 'Question 23',
            title: 'Primary Site of Action: Hepatocytes',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which of the following drugs has HEPATOCYTES as its primary anatomical site of action?',
            options: [
              'Statins (HMG-CoA reductase inhibitors) and Fibrates',
              'Colesevelam (intestine)',
              'Ezetimibe (enterocyte brush border)'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Statins target HMG-CoA reductase located on the endoplasmic reticulum of hepatocytes, and fibrates target hepatic nuclear PPAR-alpha.',
              'Incorrect: Colesevelam acts in the intestinal lumen.',
              'Incorrect: Ezetimibe acts on the brush border of jejunal enterocytes.'
            ],
            overallExplanation: 'Statins and fibrates act within hepatocytes in the liver to modulate lipoprotein synthesis and receptor clearance.',
            highYieldPearl: 'Primary site of action = Hepatocytes: Statins, Fibrates, Bempedoic acid. Primary site = Enterocytes: Ezetimibe, Bile acid sequestrants.',
            sourceReference: 'Review for Antihyperlipidemics, Page 3, Question 23',
            sourcePageNumber: 3
          },
          {
            id: 724,
            questionNumberLabel: 'Question 24',
            title: 'Primary Site of Action: Enterocytes / Intestine',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which TWO drugs have the GASTROINTESTINAL TRACT / ENTEROCYTES as their primary site of action?',
            options: [
              'Ezetimibe (NPC1L1 on enterocyte brush border) and Colesevelam (bile acid binding in intestinal lumen)',
              'Atorvastatin and Gemfibrozil',
              'Niacin and Simvastatin',
              'Lomitapide and Rosuvastatin'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Ezetimibe localizes to the brush border of enterocytes in the small intestine to inhibit NPC1L1-mediated cholesterol absorption. Colesevelam is a non-absorbed resin that binds bile acids in the intestinal lumen.',
              'Incorrect: Atorvastatin and gemfibrozil act in hepatocytes.',
              'Incorrect: Niacin acts on adipose and liver; simvastatin in liver.',
              'Incorrect: Rosuvastatin acts in hepatocytes.'
            ],
            overallExplanation: 'Ezetimibe and Colesevelam act locally in the small intestine to block cholesterol and bile acid absorption, respectively.',
            highYieldPearl: 'Intestinal site of action: Ezetimibe (enterocyte NPC1L1 transporter) and Colesevelam (intestinal bile acid sequestration).',
            sourceReference: 'Review for Antihyperlipidemics, Page 3, Question 24',
            sourcePageNumber: 3
          },
          {
            id: 725,
            questionNumberLabel: 'Question 25',
            title: 'Dual Site of Action: Hepatocytes AND Enterocytes',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Which of the following antihyperlipidemics functions in BOTH enterocytes and hepatocytes by inhibiting microsomal triglyceride transfer protein (MTP)?',
            options: [
              'Lomitapide (Juxtapid)',
              'Ezetimibe',
              'Colesevelam',
              'Fenofibrate'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Lomitapide directly binds and inhibits MTP in the lumen of the endoplasmic reticulum of both enterocytes (preventing chylomicron assembly) and hepatocytes (preventing VLDL assembly), dramatically slashing circulating ApoB-containing lipoproteins in homozygous familial hypercholesterolemia (HoFH).',
              'Incorrect: Ezetimibe acts only on enterocytes.',
              'Incorrect: Colesevelam acts only in the intestinal lumen.',
              'Incorrect: Fenofibrate acts primarily in hepatocytes.'
            ],
            overallExplanation: 'Lomitapide inhibits microsomal triglyceride transfer protein (MTP) in both enterocytes and hepatocytes, preventing the assembly of chylomicrons and VLDL.',
            highYieldPearl: 'Lomitapide = MTP inhibitor in BOTH enterocytes (blocks chylomicrons) and hepatocytes (blocks VLDL). Used for HoFH; hepatotoxicity risk (REMS program).',
            sourceReference: 'Review for Antihyperlipidemics, Page 3, Question 25',
            sourcePageNumber: 3
          },
          {
            id: 726,
            questionNumberLabel: 'Question 26',
            title: 'Chemical Class Matching for Non-Statins',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Match each drug to its chemical class (Niacin, Colesevelam, Fenofibrate, Atorvastatin, Ezetimibe, Lomitapide):',
            options: [
              'Niacin = Pyridine-3-carboxylic acid; Colesevelam = Polyallylamine polymer with quaternary ammoniums; Fenofibrate = Phenoxyisobutyrate; Atorvastatin = Dihydroxyheptanoic acid; Ezetimibe = 1,4-substituted beta-lactam; Lomitapide = Hexafluorinated fluorene-carboxamide',
              'Niacin = Beta-lactam; Ezetimibe = Polyallylamine polymer; Colesevelam = Pyridine',
              'All belong to the phenoxyisobutyrate class',
              'Lomitapide = Beta-lactam; Ezetimibe = Fluorene-carboxamide'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Niacin is pyridine-3-carboxylic acid; Colesevelam is a quaternary amine polymer; Fenofibrate is an isobutyrate derivative; Atorvastatin is a 3,5-dihydroxyheptanoic acid; Ezetimibe is an azetidin-2-one (beta-lactam); Lomitapide is a hexafluorinated carboxamide.',
              'Incorrect: Mismatched structures.',
              'Incorrect: Chemically distinct scaffolds.',
              'Incorrect: Inverted structures.'
            ],
            overallExplanation: 'Antihyperlipidemic drugs span distinct chemical classes: pyridine-3-carboxylic acids (niacin), polymers (colesevelam), isobutyrates (fibrates), beta-lactams (ezetimibe), and fluorinated carboxamides (lomitapide).',
            highYieldPearl: 'Ezetimibe = beta-lactam (azetidinone). Colesevelam = quaternary ammonium polymer. Lomitapide = hexafluorinated carboxamide.',
            sourceReference: 'Review for Antihyperlipidemics, Page 3, Question 26',
            sourcePageNumber: 3
          },
          {
            id: 727,
            questionNumberLabel: 'Question 27',
            title: 'Mechanism Matching for Lipid-Lowering Classes',
            category: 'Pharmacology MOA',
            type: 'multiple-choice',
            questionStem: 'Match each drug to its primary mechanism of action (Colesevelam, Fenofibrate, Ezetimibe, Rosuvastatin, Lomitapide):',
            options: [
              'Colesevelam = Bile acid sequestrant; Fenofibrate = Nuclear PPAR-alpha agonist; Ezetimibe = Intestinal NPC1L1 cholesterol absorption inhibitor; Rosuvastatin = Hepatic HMG-CoA reductase inhibitor; Lomitapide = MTP ApoB assembly disruptor',
              'Colesevelam = HMG-CoA reductase inhibitor; Rosuvastatin = Bile acid sequestrant',
              'Ezetimibe = PPAR-alpha agonist; Fenofibrate = NPC1L1 inhibitor',
              'Lomitapide = HMG-CoA reductase inhibitor'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Colesevelam binds bile acids; Fenofibrate activates PPAR-alpha; Ezetimibe blocks NPC1L1; Rosuvastatin inhibits HMG-CoA reductase; Lomitapide inhibits MTP.',
              'Incorrect: Incorrect assignments.',
              'Incorrect: Inverted targets.',
              'Incorrect: Lomitapide is an MTP inhibitor.'
            ],
            overallExplanation: 'Key lipid targets: NPC1L1 (ezetimibe), bile acids (colesevelam), PPAR-alpha (fibrates), HMG-CoA reductase (statins), and MTP (lomitapide).',
            highYieldPearl: 'Core lipid mechanisms: NPC1L1 = Ezetimibe. Bile acid binding = Colesevelam. PPAR-alpha = Fibrates. HMG-CoA = Statins. MTP = Lomitapide.',
            sourceReference: 'Review for Antihyperlipidemics, Page 4, Question 27',
            sourcePageNumber: 4
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 3: Targeted SAR: Ezetimibe, Colesevelam, Lomitapide & Fibrates (Questions 28 - 35)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 3,
    title: 'Specialized Lipid Drug SAR: Ezetimibe, Resins, Lomitapide & Fibrate Comparison',
    subtitle: 'Beta-lactam cholesterol absorption inhibitors, resin drug-drug interactions, MTP black-box warnings, and fenofibrate vs gemfibrozil',
    sections: [
      {
        sectionTitle: 'Ezetimibe SAR & Glucuronide Bioactivation',
        block_instructions: 'Consider the chemical structure of Ezetimibe (Zetia) to answer questions 28 - 32. Pay attention to: (a) phenolic OH, (b) 4-fluorophenyl at N1, (c) 4-fluorophenyl at C3, and (d) benzylic OH.',
        structures: [LIPIDS_STRUCTURES.ezetimibe],
        questions: [
          {
            id: 728,
            questionNumberLabel: 'Question 28',
            title: 'Ezetimibe Structural & Pharmacological Properties',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'State whether each of the following statements is true or false regarding Ezetimibe (Zetia):',
            subStatements: [
              {
                id: 'a',
                text: 'Chemically, it is a substituted beta-lactam (azetidin-2-one) derivative.',
                isCorrect: true,
                explanation: 'True: Ezetimibe contains a central 4-membered azetidin-2-one ring.'
              },
              {
                id: 'b',
                text: 'Mechanistically, it selectively inhibits dietary and biliary cholesterol absorption by binding the NPC1L1 transporter.',
                isCorrect: true,
                explanation: 'True: It blocks Niemann-Pick C1-Like 1 (NPC1L1) protein on the brush border of jejunal enterocytes.'
              },
              {
                id: 'c',
                text: 'It is metabolized to active as well as inactive metabolites.',
                isCorrect: true,
                explanation: 'True: Phase II glucuronidation produces active ezetimibe-glucuronide; Phase I oxidation of benzylic OH yields inactive ketone.'
              },
              {
                id: 'd',
                text: 'Its pharmacological activity is stereochemistry-dependent (3R, 4S configuration).',
                isCorrect: true,
                explanation: 'True: The (3R, 4S) enantiomer is 100-fold more active than its diastereomers.'
              },
              {
                id: 'e',
                text: 'It is contraindicated in patients with active liver disease when combined with a statin.',
                isCorrect: true,
                explanation: 'True: Statin + ezetimibe combinations carry warnings in severe hepatic impairment.'
              },
              {
                id: 'f',
                text: 'It appears to be more selective to block the absorption of triglycerides than cholesterol.',
                isCorrect: false,
                explanation: 'False: Ezetimibe is highly selective for CHOLESTEROL and plant sterols (phytosterols); it does NOT inhibit absorption of triglycerides, fat-soluble vitamins, or fatty acids!'
              }
            ],
            overallExplanation: 'Ezetimibe is an azetidinone (beta-lactam) that selectively inhibits cholesterol absorption via NPC1L1 without affecting triglycerides or fat-soluble vitamins.',
            highYieldPearl: 'Ezetimibe blocks NPC1L1 -> selectively blocks CHOLESTEROL absorption (does NOT affect triglycerides or fat-soluble vitamins).',
            sourceReference: 'Review for Antihyperlipidemics, Page 4, Question 28',
            sourcePageNumber: 4
          },
          {
            id: 729,
            questionNumberLabel: 'Question 29',
            title: 'Functional Groups Localizing Ezetimibe to Site of Action',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which functional group(s) in Ezetimibe are introduced to localize the drug into its site of action (enterocytes and enterohepatic circulation)?',
            options: [
              'The phenolic hydroxyl group and its glucuronide conjugate',
              'The fluoro substituents',
              'The beta-lactam carbonyl',
              'The aliphatic methylene spacer'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: The phenolic hydroxyl group provides polarity and is the substrate for intestinal and hepatic UDP-glucuronosyltransferase (UGT1A1/UGT1A3/UGT2B15). The resulting ezetimibe-glucuronide undergoes extensive enterohepatic recirculation, localizing and concentrating the drug at the enterocyte brush border.',
              'Incorrect: Fluorines prevent oxidative metabolism.',
              'Incorrect: The beta-lactam is the core scaffold.',
              'Incorrect: Methylene is a linker.'
            ],
            overallExplanation: 'The phenolic hydroxyl group is glucuronidated to ezetimibe-glucuronide, which undergoes repeated enterohepatic recirculation, confining the drug to the intestinal brush border.',
            highYieldPearl: 'Ezetimibe phenolic OH -> glucuronidation -> enterohepatic recirculation -> keeps drug concentrated at intestinal brush border (half-life ~22h).',
            sourceReference: 'Review for Antihyperlipidemics, Page 4, Question 29',
            sourcePageNumber: 4
          },
          {
            id: 730,
            questionNumberLabel: 'Question 30',
            title: 'Functional Groups Enhancing Metabolic Stability in Ezetimibe',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which functional group(s) in Ezetimibe were rationally incorporated to block CYP-mediated aromatic hydroxylation, dramatically enhancing metabolic stability?',
            options: [
              'The para-fluoro substituents on the phenyl rings',
              'The beta-lactam nitrogen',
              'The secondary benzylic alcohol',
              'The phenolic hydroxyl group'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Early lead compounds underwent rapid hepatic aromatic hydroxylation at the para positions of the aromatic rings. Introducing para-fluoro (-F) substituents blocked these metabolic vulnerable sites (metabolic blockers), markedly increasing in vivo half-life and potency.',
              'Incorrect: Nitrogen is part of the scaffold.',
              'Incorrect: Benzylic alcohol can be oxidized to inactive ketone.',
              'Incorrect: Phenolic OH undergoes glucuronidation.'
            ],
            overallExplanation: 'Para-fluorine substituents act as metabolic blockers, preventing CYP-mediated aromatic oxidation and extending drug duration.',
            highYieldPearl: 'Para-fluoro substituents in Ezetimibe: block CYP-mediated aromatic hydroxylation -> enhances metabolic stability.',
            sourceReference: 'Review for Antihyperlipidemics, Page 4, Question 30',
            sourcePageNumber: 4
          },
          {
            id: 731,
            questionNumberLabel: 'Question 31',
            title: 'Functional Group Oxidized to Inactive Metabolite in Ezetimibe',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which functional group in Ezetimibe is oxidized by Phase I enzymes to produce an INACTIVE ketone metabolite?',
            options: [
              'The secondary benzylic alcohol group',
              'The phenolic hydroxyl group',
              'The beta-lactam ring carbonyl',
              'The para-fluorophenyl group'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: The secondary benzylic alcohol is oxidized to a ketone metabolite, which has significantly lower affinity for the NPC1L1 binding pocket.',
              'Incorrect: Phenolic OH is glucuronidated to active metabolite.',
              'Incorrect: Beta-lactam is chemically stable in vivo.',
              'Incorrect: Fluorophenyl is resistant to oxidation.'
            ],
            overallExplanation: 'Oxidation of the secondary benzylic alcohol group produces an inactive ketone metabolite.',
            highYieldPearl: 'Ezetimibe metabolism: Benzylic alcohol oxidation -> INACTIVE ketone metabolite. Phenolic OH glucuronidation -> ACTIVE glucuronide metabolite!',
            sourceReference: 'Review for Antihyperlipidemics, Page 4, Question 31',
            sourcePageNumber: 4
          },
          {
            id: 732,
            questionNumberLabel: 'Question 32',
            title: 'Active Glucuronide Conjugate of Ezetimibe',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Which functional group in Ezetimibe is conjugated with glucuronic acid to produce an ACTIVE metabolite that is more potent than the parent drug and responsible for the majority of in vivo efficacy?',
            options: [
              'The phenolic hydroxyl group (forming Ezetimibe-phenolic glucuronide)',
              'The secondary benzylic alcohol',
              'The beta-lactam amide',
              'The fluorophenyl ring'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: The phenolic hydroxyl group is glucuronidated in the intestinal mucosa and liver into ezetimibe-phenolic glucuronide. This metabolite is ~3-fold more potent than parent ezetimibe at inhibiting NPC1L1 and is avidly recycled through enterohepatic circulation.',
              'Incorrect: Glucuronidation occurs primarily on the phenolic oxygen, not benzylic.',
              'Incorrect: The amide is not glucuronidated.',
              'Incorrect: Fluorophenyl does not undergo glucuronidation.'
            ],
            overallExplanation: 'Ezetimibe is a unique drug where Phase II glucuronidation produces an active metabolite (ezetimibe-glucuronide) that is more potent than the parent drug and avidly localized to enterocyte brush borders.',
            highYieldPearl: 'Ezetimibe glucuronide is MORE POTENT than parent ezetimibe. Undergoes enterohepatic circulation, maintaining active drug at the enterocyte brush border.',
            sourceReference: 'Review for Antihyperlipidemics, Page 4, Question 32',
            sourcePageNumber: 4
          }
        ]
      },
      {
        sectionTitle: 'Bile Acid Sequestrants: Colesevelam & Resins',
        structures: [LIPIDS_STRUCTURES.colesevelam],
        questions: [
          {
            id: 733,
            questionNumberLabel: 'Question 33',
            title: 'Colesevelam & Resin Sequestrant Characteristics',
            category: 'Pharmacology MOA',
            type: 'sub-statements',
            questionStem: 'State whether each of the following statements is true or false regarding Colesevelam (Welchol) and bile acid sequestrants:',
            subStatements: [
              {
                id: 'a',
                text: 'Chemically, it is a polyallylamine cross-linked polymer containing permanently charged quaternary ammonium groups.',
                isCorrect: true,
                explanation: 'True: Colesevelam is a non-absorbable synthetic polymer functionalized with quaternary ammonium and alkylamine groups.'
              },
              {
                id: 'b',
                text: 'It possesses pH-dependent activity and is only ionized at low gastric pH.',
                isCorrect: false,
                explanation: 'False: Quaternary ammonium groups carry permanent positive charges that are completely independent of physiological pH.'
              },
              {
                id: 'c',
                text: 'Mechanistically, it binds negatively charged bile acids in the intestine, preventing their enterohepatic reabsorption and forcing the liver to convert cholesterol into new bile acids.',
                isCorrect: true,
                explanation: 'True: Interruption of bile acid reabsorption depletes hepatic bile acid pool, upregulating 7-alpha-hydroxylase and LDL receptors.'
              },
              {
                id: 'd',
                text: 'Its primary site of action is the intestine, and it is not absorbed into systemic circulation.',
                isCorrect: true,
                explanation: 'True: <0.05% is absorbed; eliminated entirely in feces.'
              },
              {
                id: 'e',
                text: 'Its pharmacological activity is stereochemistry-dependent.',
                isCorrect: false,
                explanation: 'False: Binding is non-stereospecific electrostatic/ionic interaction between positive ammoniums and negative bile acid carboxylates.'
              },
              {
                id: 'f',
                text: 'It is contraindicated in patients with severe hepatic dysfunction.',
                isCorrect: false,
                explanation: 'False: Because it is not absorbed systemically, it does not rely on hepatic clearance.'
              },
              {
                id: 'g',
                text: 'Cardiotoxicity and hepatotoxicity are major systemic side effects.',
                isCorrect: false,
                explanation: 'False: It causes no systemic toxicity; adverse effects are strictly gastrointestinal (constipation, dyspepsia, bloating).'
              },
              {
                id: 'h',
                text: 'It is strictly contraindicated in pregnant patients.',
                isCorrect: false,
                explanation: 'False: It is Category B and preferred in pregnancy because it lacks systemic fetal exposure.'
              },
              {
                id: 'i',
                text: 'Reduced oral absorption of co-administered acidic drugs (e.g., warfarin, levothyroxine, thiazides, statins) is a major clinical issue.',
                isCorrect: true,
                explanation: 'True: Resins bind co-administered anionic drugs, requiring spacing other medications by 1-2 hours before or 4 hours after the resin.'
              }
            ],
            overallExplanation: 'Colesevelam is a non-absorbed quaternary ammonium polymer that binds bile acids electrostatically. It is safe in pregnancy and liver disease, but binds co-administered acidic oral drugs in the gut.',
            highYieldPearl: 'Bile acid sequestrants: Non-absorbed, safe in pregnancy (Category B). Must space other oral drugs by 2-4 hours to avoid electrostatic binding in gut!',
            sourceReference: 'Review for Antihyperlipidemics, Page 4, Question 33',
            sourcePageNumber: 4
          }
        ]
      },
      {
        sectionTitle: 'MTP Inhibitor (Lomitapide) & Fibrate Comparison',
        structures: [
          LIPIDS_STRUCTURES.lomitapide,
          LIPIDS_STRUCTURES.gemfibrozil,
          LIPIDS_STRUCTURES.fenofibrate,
          LIPIDS_STRUCTURES.fenofibric_acid
        ],
        questions: [
          {
            id: 734,
            questionNumberLabel: 'Question 34',
            title: 'Lomitapide Characteristics & Black-Box Hepatotoxicity',
            category: 'Pharmacology MOA',
            type: 'sub-statements',
            questionStem: 'State whether each of the following statements is true or false regarding Lomitapide (Juxtapid):',
            subStatements: [
              {
                id: 'a',
                text: 'Chemically, it is a hydrophilic hexafluorinated dicarboxamide.',
                isCorrect: false,
                explanation: 'False: Lomitapide is a highly LIPOPHILIC (hydrophobic, LogP ~5.3) molecule, not hydrophilic.'
              },
              {
                id: 'b',
                text: 'Mechanistically, it directly inhibits microsomal triglyceride transfer protein (MTP), disrupting the assembly and secretion of chylomicrons and VLDL.',
                isCorrect: true,
                explanation: 'True: MTP inhibition prevents lipid transfer to nascent ApoB in both gut and liver.'
              },
              {
                id: 'c',
                text: 'Its site of action is the intestine (enterocytes) as well as the liver (hepatocytes).',
                isCorrect: true,
                explanation: 'True: Targets MTP in the ER lumen of both enterocytes and hepatocytes.'
              },
              {
                id: 'd',
                text: 'Its pharmacological activity is stereochemistry-dependent.',
                isCorrect: true,
                explanation: 'True: Specific (S)-enantiomer configuration binds MTP.'
              },
              {
                id: 'e',
                text: 'It is extensively metabolized in the liver by CYP3A4.',
                isCorrect: true,
                explanation: 'True: CYP3A4 is the major enzyme; strong inhibitors dramatically increase levels.'
              },
              {
                id: 'f',
                text: 'It is contraindicated in patients with hepatic dysfunction and pregnancy, and carries a black-box warning for severe hepatotoxicity/steatohepatitis.',
                isCorrect: true,
                explanation: 'True: Trapping fat inside hepatocytes causes hepatic steatosis; available only through a restricted REMS program.'
              }
            ],
            overallExplanation: 'Lomitapide is a lipophilic MTP inhibitor that prevents ApoB lipoprotein assembly in gut and liver. It carries black-box warnings for hepatotoxicity/fatty liver and teratogenicity.',
            highYieldPearl: 'Lomitapide = MTP inhibitor for HoFH. Traps triglycerides in liver -> severe hepatic steatosis (Black-Box Warning / REMS). Teratogenic (Category X)!',
            sourceReference: 'Review for Antihyperlipidemics, Page 5, Question 34',
            sourcePageNumber: 5
          },
          {
            id: 735,
            questionNumberLabel: 'Question 35',
            title: 'Gemfibrozil vs Fenofibrate Comparative Pharmacology',
            category: 'Medicinal Chemistry SAR',
            type: 'sub-statements',
            questionStem: 'Consider Molecule I (Gemfibrozil, an active carboxylic acid) and Molecule II (Fenofibrate, an ester prodrug) to evaluate each statement:',
            subStatements: [
              {
                id: 'a',
                text: 'Both molecules are phenoxyisobutyrate derivatives.',
                isCorrect: true,
                explanation: 'True: Both contain the 2-phenoxy-2-methylpropanoic acid core.'
              },
              {
                id: 'b',
                text: 'Molecule I (Gemfibrozil) is an active drug, whereas Molecule II (Fenofibrate) is an ester prodrug.',
                isCorrect: true,
                explanation: 'True: Gemfibrozil is an active carboxylic acid; fenofibrate is an isopropyl ester prodrug.'
              },
              {
                id: 'c',
                text: 'The active form of each molecule activates nuclear PPAR-alpha.',
                isCorrect: true,
                explanation: 'True: Both are PPAR-alpha agonists.'
              },
              {
                id: 'd',
                text: 'Molecule I reaches peak concentration faster than Molecule II.',
                isCorrect: true,
                explanation: 'True: Gemfibrozil is rapidly absorbed (tmax 1-2 hours); fenofibrate requires formulation micronization and esterase cleavage (tmax 4-6 hours).'
              },
              {
                id: 'e',
                text: 'Molecule I has a longer elimination half-life than Molecule II.',
                isCorrect: false,
                explanation: 'False: Active fenofibric acid has a much longer half-life (~20 hours, once daily) than gemfibrozil (t1/2 ~1.5 hours, requiring BID dosing).'
              },
              {
                id: 'f',
                text: 'Molecule II (Fenofibrate) is significantly safer than Molecule I (Gemfibrozil) when co-administered with statins.',
                isCorrect: true,
                explanation: 'True: Gemfibrozil strongly inhibits OATP1B1 hepatic uptake and UGT2B7 glucuronidation of statins, dramatically increasing statin AUC and rhabdomyolysis risk. Fenofibrate does not significantly inhibit statin glucuronidation and is the fibrate of choice with statins.'
              }
            ],
            overallExplanation: 'Gemfibrozil is an active drug with a short half-life (~1.5h, BID) that causes severe rhabdomyolysis when combined with statins. Fenofibrate is an ester prodrug with a long half-life (~20h, once-daily) that is much safer with statins.',
            highYieldPearl: 'Fibrates + Statins: NEVER combine Gemfibrozil with a statin (inhibits statin glucuronidation -> severe rhabdomyolysis!). Fenofibrate is the preferred fibrate with statins.',
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
