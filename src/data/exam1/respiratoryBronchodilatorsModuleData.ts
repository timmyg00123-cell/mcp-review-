import { ReviewModule, ReviewPage } from '../../types/reviewModule';
import { BRONCHODILATOR_STRUCTURES } from './exam1Structures';

export const respiratoryBronchodilatorsPages: ReviewPage[] = [
  // ---------------------------------------------------------------------------
  // PAGE 1: Adrenergic Beta-2 Agonists (SABAs, LABAs & Ultra-LABAs) (Questions 141 - 151)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 1,
    title: 'Adrenergic Beta-2 Agonists: SABAs, LABAs & Ultra-LABAs',
    subtitle: 'Phenylethanolamine pharmacophore, N-alkyl steric hindrance, COMT resistance, stereochemical eutomers, exosite anchoring, and plasmalemma depots',
    sections: [
      {
        sectionTitle: 'Beta-2 Agonist Molecular Signaling & Phenylethanolamine SAR',
        questions: [
          {
            id: 141,
            questionNumberLabel: 'Question 1',
            title: 'Beta-2 Adrenergic Receptor Intracellular Signaling Cascade',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Activation of the bronchial beta-2 adrenergic receptor triggers smooth muscle relaxation and bronchodilation. Which of the following correctly traces the intracellular signaling cascade initiated by beta-2 agonists?',
            options: [
              'Gs-protein coupling -> Adenylyl cyclase activation -> Increased intracellular cAMP -> Protein Kinase A (PKA) activation -> Inactivation of Myosin Light Chain Kinase (MLCK) and stimulation of Ca2+ extrusion',
              'Gq-protein coupling -> Phospholipase C activation -> Increased IP3 and DAG -> Intracellular Ca2+ release -> Myosin light chain phosphorylation',
              'Gi-protein coupling -> Inhibition of adenylyl cyclase -> Decreased cAMP -> Protein Kinase G (PKG) activation -> Ryanodine receptor opening',
              'Direct ligand-gated opening of chloride channels -> Hyperpolarization of the sarcoplasmic reticulum'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Beta-2 adrenergic receptors are Gs-protein-coupled receptors. Agonist binding causes Galpha-s activation, stimulating adenylyl cyclase to convert ATP into cAMP. Elevated cAMP activates Protein Kinase A (PKA). PKA phosphorylates and inactivates Myosin Light Chain Kinase (MLCK), phosphorylates phospholamban (enhancing Ca2+ uptake into the sarcoplasmic reticulum), and promotes Ca2+ efflux, producing profound bronchial smooth muscle relaxation.',
              'Incorrect: Gq coupling stimulates contraction (as seen with M3 muscarinic and alpha-1 adrenergic receptors), not bronchodilation.',
              'Incorrect: Gi coupling inhibits adenylyl cyclase and is seen with M2 muscarinic receptors.',
              'Incorrect: Beta-2 receptors are GPCRs, not ligand-gated ion channels.'
            ],
            overallExplanation: 'Beta-2 adrenergic receptor stimulation activates the Gs/adenylyl cyclase/cAMP/PKA pathway. PKA inactivates Myosin Light Chain Kinase (MLCK) via phosphorylation and promotes sequestration of intracellular Ca2+, leading directly to smooth muscle relaxation and bronchodilation.',
            highYieldPearl: 'Beta-2 agonists act via Gs -> Adenylyl cyclase -> cAMP up -> PKA activation -> MLCK inactivation -> smooth muscle relaxation (bronchodilation).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 12-15'
          },
          {
            id: 142,
            questionNumberLabel: 'Question 2',
            title: 'Core Phenylethanolamine Pharmacophore Requirements',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'All clinically approved beta-adrenergic bronchodilators share a core phenylethanolamine pharmacophore. Which stereochemical and functional requirement is essential for high-affinity receptor binding?',
            options: [
              'A beta-hydroxyl group with the (R)-absolute configuration, separated from an amine nitrogen by exactly two carbon atoms',
              'A beta-hydroxyl group with the (S)-absolute configuration, directly attached to a quaternary ammonium salt',
              'An alpha-hydroxyl group with an sp-hybridized alkyne linker connected to a tertiary carboxylic acid',
              'A fully planar catechol ring lacking any aliphatic side chain hydroxyl groups'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: The phenylethanolamine pharmacophore requires: (1) An aromatic ring with hydrogen-bonding substituents at positions 3 and 4 (or 3 and 5); (2) An aliphatic chain containing a chiral beta-hydroxyl group in the (R)-configuration (according to Easson-Stedman hypothesis, this -OH engages in essential three-point binding via hydrogen bonding with receptor Asn293); and (3) An amine nitrogen separated from the aromatic ring by exactly two carbons (an ethyl chain), which is protonated at physiological pH to form an ionic bond with Asp113.',
              'Incorrect: The (S)-configuration at the beta-carbon exhibits markedly reduced affinity (~100-fold lower) because the hydroxyl cannot properly interact with the receptor binding pocket.',
              'Incorrect: The hydroxyl is at the beta-carbon, not alpha-carbon, and alkyne linkers abolish activity.',
              'Incorrect: The beta-hydroxyl group on the aliphatic side chain is mandatory for potent direct adrenergic agonism.'
            ],
            overallExplanation: 'The beta-phenylethanolamine pharmacophore requires an (R)-configured beta-hydroxyl group. As described by the Easson-Stedman hypothesis, direct-acting catecholamines require three-point interaction: the aromatic ring (van der Waals/pi-stacking), the protonated amine (ionic bond with Asp113), and the (R)-beta-hydroxyl (hydrogen bonding with Asn293). Inversion to the (S)-enantiomer reduces affinity ~100-fold.',
            highYieldPearl: 'Beta-agonist pharmacophore: (R)-beta-hydroxyl group + 2-carbon ethyl linker + protonated amine nitrogen. (R)-configuration matches the Easson-Stedman 3-point binding model.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 16-19'
          },
          {
            id: 143,
            questionNumberLabel: 'Question 3',
            title: 'N-Alkyl Substituent SAR: Epinephrine vs. Isoproterenol vs. Albuterol',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Progressive enlargement of the N-alkyl substituent across adrenergic agonists dramatically alters adrenoceptor selectivity (Epinephrine: -CH3 -> Isoproterenol: -CH(CH3)2 -> Albuterol: -C(CH3)3). What is the structural basis for this shift in selectivity?',
            options: [
              'Increasing bulk from methyl to isopropyl eliminates alpha-activity and yields non-selective beta-1/beta-2 agonism; further expansion to a bulky tert-butyl group confers high beta-2 selectivity by sterically clashing with the narrower beta-1 binding cleft',
              'Increasing bulk causes selective covalent acylation of alpha-1 receptors, sparing beta receptors',
              'The methyl group is too bulky to fit into beta-2 receptors, while the tert-butyl group is smaller and more flexible',
              'The tert-butyl group converts the drug into a neutral prodrug that cannot ionize at physiological pH'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: The amine nitrogen pocket differs significantly between adrenoceptors. In alpha-receptors, the pocket is small (only accommodating -H or -CH3, as in NE and epinephrine). In beta-receptors, there is a larger lipophilic auxiliary pocket: the isopropyl group of isoproterenol fits well, producing potent non-selective beta-1 and beta-2 agonism. Further expansion to a bulky, branched tert-butyl group (as in albuterol, terbutaline) confers high beta-2 selectivity because the beta-2 binding cavity is wider and more accommodating than the narrower beta-1 pocket, where the tert-butyl group suffers severe steric clash.',
              'Incorrect: N-alkyl bulk does not cause covalent acylation.',
              'Incorrect: A methyl group is much smaller than a tert-butyl group, not larger.',
              'Incorrect: The amine remains basic and protonated at physiological pH; the tert-butyl group does not make it a neutral prodrug.'
            ],
            overallExplanation: 'SAR of N-alkyl substituents: N-methyl (Epinephrine) binds both alpha and beta receptors. N-isopropyl (Isoproterenol) eliminates alpha activity, producing non-selective beta-1/beta-2 agonism (causing cardiac tachyarrhythmias via beta-1). Bulky tertiary alkyl groups like N-tert-butyl (Albuterol) provide steric bulk that selectively fits into the larger lipophilic pocket of beta-2 receptors while clashing with beta-1, conferring high beta-2:beta-1 selectivity.',
            highYieldPearl: 'N-alkyl bulk governs selectivity: -CH3 (Epi: alpha + beta) -> -CH(CH3)2 (Isoproterenol: non-selective beta-1 + beta-2) -> -C(CH3)3 (Albuterol: selective beta-2 due to steric clash with beta-1).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 20-23'
          },
          {
            id: 144,
            questionNumberLabel: 'Question 4',
            title: 'Catechol Vulnerabilities: COMT Metabolism & Adrenochrome Oxidation',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Why are endogenous catecholamines (epinephrine, norepinephrine) and isoproterenol clinically ineffective when administered orally, and why do they have an exceptionally short duration of action (<1 hour)?',
            options: [
              'The 3,4-dihydroxybenzene (catechol) nucleus is rapidly metabolized by Catechol-O-Methyltransferase (COMT) via methylation of the 3-OH, and is susceptible to spontaneous oxidation to adrenochrome pigments',
              'The catechol ring undergoes instantaneous non-enzymatic decarboxylation in gastric acid',
              'The amine nitrogen is irreversibly sulfated by intestinal bile acids, preventing systemic absorption',
              'The aromatic ring is too lipophilic to dissolve in intestinal aqueous fluids'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: The 3,4-dihydroxybenzene (catechol) ring is rapidly recognized and metabolized by Catechol-O-Methyltransferase (COMT) in the gut wall, liver, and circulating tissues. COMT transfers a methyl group from S-adenosylmethionine (SAM) to the 3-hydroxyl group, completely inactivating the drug. Furthermore, catechols are readily oxidized by light/air into inactive quinones and adrenochrome pigments, and undergo extensive first-pass sulfoconjugation in the GI tract, resulting in negligible oral bioavailability and a very short half-life.',
              'Incorrect: Catecholamines do not contain a carboxyl group and do not undergo decarboxylation.',
              'Incorrect: Amines are not sulfated by bile acids.',
              'Incorrect: Catecholamines are highly water-soluble (hydrophilic), not excessively lipophilic.'
            ],
            overallExplanation: 'Catecholamines suffer from two primary medicinal chemistry liabilities: (1) Rapid enzymatic inactivation by COMT, which methylates the meta-hydroxyl (3-OH) group; and (2) Rapid oxidative degradation of the catechol ring to ortho-quinones and adrenochromes. Because of dense COMT expression in the intestinal mucosa and liver, catecholamines have virtually zero oral bioavailability and a brief duration of action (<1 hour).',
            highYieldPearl: 'Catechols (3,4-dihydroxybenzene) are rapidly destroyed by COMT (3-O-methylation) and intestinal sulfatases -> zero oral bioavailability and short t1/2 (<1 hr).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 24-26'
          },
          {
            id: 145,
            questionNumberLabel: 'Question 5',
            title: 'Overcoming COMT: Albuterol Hydroxymethyl & Terbutaline Resorcinol SAR',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Medicinal chemists successfully overcame COMT degradation in second-generation SABAs. How do albuterol and terbutaline modify the catechol ring to achieve oral bioavailability and longer duration of action?',
            options: [
              'Albuterol replaces the 3-OH with a hydroxymethyl group (-CH2OH, saligenin), while terbutaline shifts the catechol to a 3,5-dihydroxybenzene (resorcinol) ring; both maintain receptor hydrogen bonding while resisting COMT methylation',
              'Both drugs convert the catechol into a fluorinated cyclopropane ring that covalently acylates adenylyl cyclase',
              'Albuterol replaces the benzene ring with a thiazole ring, while terbutaline replaces it with an indole',
              'Both drugs esterify the 3-OH with an 18-carbon palmitate chain that prevents enzyme access'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: To prevent COMT recognition while preserving the essential hydrogen bonding required for beta-2 receptor activation: (1) Albuterol replaces the 3-OH with a hydroxymethyl moiety (-CH2OH), creating a saligenin alcohol. COMT cannot transfer a methyl group to this extended carbon spacer, yet the -CH2OH can still donate a hydrogen bond to receptor Ser204. (2) Terbutaline shifts the hydroxyl groups from ortho (3,4-catechol) to meta (3,5-resorcinol). Resorcinols are not substrates for COMT. Both modifications provide resistance to COMT, extending duration of action to 4-6 hours and allowing oral absorption.',
              'Incorrect: Neither drug contains fluorinated cyclopropanes or covalently acylates adenylyl cyclase.',
              'Incorrect: Albuterol retains a benzene ring (saligenin) and terbutaline retains a benzene ring (resorcinol); neither uses thiazole or indole.',
              'Incorrect: They are not palmitate esters.'
            ],
            overallExplanation: 'COMT requires an intact 1,2-dihydroxybenzene (catechol) unit. Albuterol modifies position 3 to a hydroxymethyl group (-CH2OH, a saligenin nucleus), extending the oxygen by one methylene unit so COMT cannot methylate it, while still hydrogen bonding to the receptor. Terbutaline separates the hydroxyls into a 1,3-dihydroxy (3,5-resorcinol) arrangement, which COMT cannot recognize. Both designs confer COMT resistance and extend duration of action to 4–6 hours.',
            highYieldPearl: 'COMT Resistance: Albuterol = Saligenin (3-CH2OH, 4-OH); Terbutaline = Resorcinol (3,5-di-OH). Both resist COMT methylation while preserving beta-2 receptor H-bonding!',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 27-31'
          },
          {
            id: 146,
            questionNumberLabel: 'Question 6',
            title: 'Levalbuterol: (R)-Eutomer Activity vs. (S)-Distomer Detrimental Effects',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Albuterol is traditionally administered as a racemic (1:1) mixture of (R)- and (S)-enantiomers, whereas levalbuterol contains exclusively the pure (R)-enantiomer. What pharmacological rationale supports the clinical use of pure (R)-albuterol?',
            options: [
              '(R)-Albuterol is the eutomer responsible for 100% of beta-2 bronchodilation, while (S)-albuterol is a distomer that has ~100-fold lower receptor affinity, is cleared more slowly, and may promote airway hyperresponsiveness and pro-inflammatory signaling',
              '(S)-Albuterol is an irreversible antagonist of alpha-1 receptors that causes severe reflex tachycardia',
              '(R)-Albuterol cannot be inhaled and must be administered intravenously, whereas (S)-albuterol is orally active',
              '(S)-Albuterol is converted by hepatic CYP3A4 into toxic cyanide radicals in the lungs'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: The (R)-enantiomer (levalbuterol) is the active eutomer, possessing 100-fold higher affinity for the beta-2 receptor than the (S)-enantiomer and providing all therapeutic bronchodilation. The (S)-distomer does not produce bronchodilation, is metabolized and cleared significantly more slowly than the (R)-enantiomer (leading to accumulation in pulmonary tissue), and has been shown in clinical and animal studies to increase intracellular Ca2+, enhance eosinophil activation, and promote paradoxical airway hyperresponsiveness.',
              'Incorrect: (S)-albuterol does not antagonize alpha-1 receptors.',
              'Incorrect: Levalbuterol is formulated as an inhalable aerosol/solution, not IV only.',
              'Incorrect: (S)-albuterol does not generate cyanide radicals.'
            ],
            overallExplanation: 'In racemic albuterol, (R)-albuterol is the eutomer (active bronchodilator), whereas (S)-albuterol is the distomer. Because (R)-albuterol is selectively metabolized faster by sulfotransferases, (S)-albuterol preferentially accumulates in the lung during frequent dosing. (S)-albuterol can trigger pro-inflammatory pathways, increase airway smooth muscle reactivity, and contribute to paradoxical bronchospasm. Levalbuterol delivers pure (R)-albuterol at half the dose of racemic albuterol.',
            highYieldPearl: 'Levalbuterol = pure (R)-albuterol (eutomer, active bronchodilator). (S)-albuterol (distomer) accumulates, lacks bronchodilator activity, and may trigger airway hyperresponsiveness.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 32-35'
          },
          {
            id: 147,
            questionNumberLabel: 'Question 7',
            title: 'Pirbuterol: Pyridine Bioisostere of Albuterol',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Pirbuterol is an analog of albuterol where the benzene ring is replaced by a pyridine ring. What type of medicinal chemistry modification does this represent, and what property does it preserve?',
            options: [
              'Classic heterocyclic bioisosterism; preserves beta-2 selectivity and saligenin-like hydrogen bonding while modifying ring electronic distribution and metabolic stability',
              'Soft drug design; incorporates a labile ester for instant systemic plasma hydrolysis',
              'Prodrug design; requires hepatic reduction of the pyridine nitrogen before binding to beta-2 receptors',
              'Transition-state mimicry; covalently binds to the active site of monoamine oxidase'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Pirbuterol is a direct pyridine bioisostere of albuterol (the benzene ring carbon at position 2 is replaced with a nitrogen atom, yielding a 2,6-disubstituted pyridine ring). This classic heterocyclic bioisosteric replacement preserves beta-2 receptor affinity and bronchodilatory efficacy while altering electronic density and hepatic metabolic handling.',
              'Incorrect: Pirbuterol is not an ester and is not a soft drug.',
              'Incorrect: Pirbuterol is an active drug, not a prodrug requiring reduction.',
              'Incorrect: Pirbuterol does not inhibit MAO or act as a transition-state analogue.'
            ],
            overallExplanation: 'Pirbuterol exemplifies classical aromatic bioisosterism: exchanging the benzene ring of albuterol for a pyridine heterocycle. It retains the 3-hydroxymethyl and 4-hydroxy groups (forming a pyridine-saligenin) and the N-tert-butyl group, maintaining potent, selective beta-2 agonism with resistance to COMT.',
            highYieldPearl: 'Pirbuterol: Pyridine bioisostere of albuterol (replaces benzene with pyridine ring). Retains beta-2 selectivity and COMT resistance.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slide 36'
          },
          {
            id: 148,
            questionNumberLabel: 'Question 8',
            title: 'Salmeterol SAR: 11-Atom Lipophilic Exosite Tail & Slow Onset Rationale',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Salmeterol is a prototype long-acting beta-2 agonist (LABA). What structural feature provides its extended duration of action (>12 hours), and why is salmeterol contraindicated as a rescue inhaler for acute asthma attacks?',
            options: [
              'It contains an extended 11-atom lipophilic phenylalkoxyalkyl side chain on the nitrogen that binds to an auxiliary exosite near the receptor, anchoring the molecule; its slow association rate results in a delayed onset of action (~15–30 min), making it ineffective for acute bronchospasm',
              'It contains an irreversible sulfhydryl-reactive isothiocyanate moiety that permanently inactivates beta-2 receptors',
              'It forms an insoluble precipitate in pulmonary surfactant that slowly dissolves over 3 weeks',
              'It is a covalent prodrug that requires 12 hours of hepatic CYP1A2 cleavage before becoming active'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Salmeterol contains a saligenin phenylethanolamine core attached to an extended, flexible 11-atom lipophilic tail: -CH2CH2CH2CH2CH2CH2-O-CH2CH2CH2-phenyl (4-phenylbutoxyhexyl chain). This lipophilic tail binds with high affinity to a secondary hydrophobic binding site ("exosite") located on the outer surface of the beta-2 receptor transmembrane bundle. This anchoring allows the saligenin pharmacophore to repeatedly engage, dissociate, and re-engage the active site without diffusing away, providing >12 hours of bronchodilation. However, its high lipophilicity causes slow partitioning into the active site, resulting in a delayed onset (15-30 minutes), rendering it strictly unsuitable for acute rescue.',
              'Incorrect: Salmeterol binds reversibly via non-covalent exosite interactions, not via covalent isothiocyanates.',
              'Incorrect: Salmeterol does not form an insoluble precipitate.',
              'Incorrect: Salmeterol is directly active and does not require hepatic activation.'
            ],
            overallExplanation: 'Salmeterol\'s prolonged duration (>12 hours) is conferred by its extended 11-atom lipophilic phenylalkoxyalkyl side chain. This tail anchors into a hydrophobic exosite adjacent to the beta-2 receptor, enabling repeated re-engagement of the active site. Because it partitions slowly into the receptor active pocket, its onset is delayed (~15–30 minutes), so it must NEVER be used for acute rescue (black box safety warning against LABA monotherapy).',
            highYieldPearl: 'Salmeterol SAR: 11-atom lipophilic tail anchors to the receptor EXOSITE -> >12 hr duration. SLOW ONSET (~15-30 min) -> NEVER use as an acute rescue inhaler!',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 38-42'
          },
          {
            id: 149,
            questionNumberLabel: 'Question 9',
            title: 'Formoterol SAR: 3-Formamido Group & Plasmalemma Lipid Depot Mechanism',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Unlike salmeterol, formoterol combines long duration of action (>12 hours) with a rapid onset of action (2–3 minutes). What unique structural features and biophysical mechanism explain this dual rapid-and-long-acting profile?',
            options: [
              'It contains a 3-formamido (-NH-CHO) group resisting COMT and an aralkyl N-substituent with moderate lipophilicity (logP ~1.6), allowing it to dissolve into the plasmalemma lipid bilayer as a depot and rapidly diffuse to the receptor active site',
              'It contains a quaternary ammonium salt that instantly penetrates pulmonary capillaries and locks adenylyl cyclase in an open state',
              'It is an irreversible covalent agonist that cross-links two adjacent beta-2 receptor dimers within 30 seconds',
              'It lacks an aromatic ring entirely, relying on a rigid adamantane cage that bypasses cellular membranes'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Formoterol has two key structural elements: (1) A 3-formamido group (-NH-CHO) on the phenyl ring, which acts as a bioisostere for the 3-OH, resisting COMT while donating a hydrogen bond to the receptor; and (2) An N-aralkyl substituent (-CH(CH3)CH2-C6H4-4-OCH3). It exhibits moderate lipophilicity (logP ~1.6, compared to salmeterol logP ~4.0). This intermediate lipophilicity allows a fraction of the drug to rapidly reach the receptor in the aqueous phase (rapid onset in 2-3 minutes, identical to albuterol), while another fraction partitions into the plasma membrane lipid bilayer (plasmalemma depot), slowly leaching out over 12 hours (long duration). This enables SMART/MART (Single Maintenance and Reliever Therapy).',
              'Incorrect: Formoterol is a secondary amine, not a quaternary ammonium salt.',
              'Incorrect: Formoterol binds reversibly, not covalently.',
              'Incorrect: Formoterol possesses two aromatic rings, not an adamantane cage.'
            ],
            overallExplanation: 'Formoterol features a 3-formamido group (COMT-resistant) and an aralkyl N-substituent with balanced lipophilicity (logP 1.6). This allows formoterol to act rapidly in the aqueous phase (onset 2–3 min, matching albuterol) while embedding into the cell membrane plasmalemma as a micro-reservoir that slowly leaches out over 12 hours. This unique pharmacology enables formoterol-ICS combinations to serve as both maintenance and rescue (SMART protocol).',
            highYieldPearl: 'Formoterol: 3-formamido group (resists COMT) + plasmalemma lipid depot (logP 1.6). RAPID ONSET (2-3 min) + LONG DURATION (>12 hr) -> foundation of SMART / MART therapy!',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 43-47'
          },
          {
            id: 150,
            questionNumberLabel: 'Question 10',
            title: 'Arformoterol: Pure (R,R)-Eutomer for Nebulized COPD Therapy',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Arformoterol is the pure (R,R)-enantiomer of formoterol. Because formoterol contains two chiral centers, how many possible stereoisomers exist, and what advantage does arformoterol provide over racemic formoterol?',
            options: [
              'Four stereoisomers exist; arformoterol is the pure (R,R)-eutomer with 2-fold greater potency than the racemate, eliminating the pharmacologically inert (S,S)-enantiomer',
              'Two stereoisomers exist; arformoterol is the meso form with zero cardiac liability',
              'Eight stereoisomers exist; arformoterol is an equimolar diastereomeric pair that selectively targets beta-1 receptors',
              'Sixteen stereoisomers exist; arformoterol is a cyclic rotamer that resists all Cytochrome P450 oxidation'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Formoterol contains two asymmetric carbon centers (one at the phenylethanolamine beta-carbon and one at the N-aralkyl branched carbon), giving rise to 2^2 = 4 possible stereoisomers: (R,R), (S,S), (R,S), and (S,R). Racemic formoterol is a 1:1 mixture of the (R,R) and (S,S) enantiomers. The (R,R)-stereoisomer (arformoterol) is the active eutomer, displaying ~1000-fold higher affinity for the beta-2 receptor than the (S,S)-distomer. Using pure arformoterol allows half the total chemical dose (15 mcg arformoterol vs 30 mcg racemic formoterol) without exposing the patient to the inert (S,S)-enantiomer.',
              'Incorrect: With two chiral centers, there are 2^2 = 4 stereoisomers, not 2, 8, or 16.',
              'Incorrect: Arformoterol does not target beta-1; it is highly selective for beta-2.',
              'Incorrect: It is not a cyclic rotamer.'
            ],
            overallExplanation: 'Formoterol possesses two chiral centers, yielding four stereoisomers. Standard formoterol is a racemate of (R,R) and (S,S). Arformoterol (Brovana) is the pure (R,R)-eutomer, which holds all beta-2 bronchodilatory potency. Purifying the (R,R)-enantiomer allows half-dose nebulization for COPD without the ballast (S,S)-isomer.',
            highYieldPearl: 'Arformoterol = pure (R,R)-eutomer of formoterol (2 chiral centers = 4 isomers). 2x more potent than racemate, delivered as nebulized solution for COPD.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slide 48'
          },
          {
            id: 151,
            questionNumberLabel: 'Question 11',
            title: 'Ultra-LABAs: Indacaterol, Olodaterol & Vilanterol for Once-Daily COPD Dosing',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'The "ultra-LABAs" (indacaterol, olodaterol, vilanterol) were engineered for once-daily (24-hour) inhalation in COPD. What core structural modifications provide their extraordinary duration of action and high functional beta-2 selectivity?',
            options: [
              'Rigid bicyclic heteroaromatic cores (e.g., 8-hydroxyquinolinone in indacaterol, benzoxazine in olodaterol) paired with bulky lipophilic aralkyl/aminoindan substituents that impart extreme membrane affinity and prolonged receptor residence time',
              'Incorporation of quaternary ammonium groups that irreversibly cross-link beta-2 receptor sulfhydryl bonds',
              'Attachment of a steroid cyclopentanoperhydrophenanthrene ring that binds nuclear glucocorticoid receptors',
              'Replacement of the phenylethanolamine core with a cyclic peptide that resists all exopeptidases'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Ultra-LABAs represent advanced medicinal chemistry optimization: Indacaterol incorporates an 8-hydroxyquinolinone bioisostere and a lipophilic aminoindan moiety; Olodaterol incorporates a benzoxazine ring system; Vilanterol possesses a chlorobenzyl-substituted lipophilic tail. These bulky, rigid aromatic and lipophilic elements confer exceptional lipid membrane partitioning and high receptor residence times (slow dissociation kinetics), maintaining >24 hours of effective bronchodilation and allowing true once-daily dosing in COPD.',
              'Incorrect: Ultra-LABAs are non-covalent, reversible agonists and do not contain quaternary ammoniums.',
              'Incorrect: They are pure adrenoceptor agonists, not steroids.',
              'Incorrect: They are small molecules, not cyclic peptides.'
            ],
            overallExplanation: 'Ultra-LABAs achieve true 24-hour duration through advanced scaffolds: indacaterol features an 8-hydroxyquinolinone core with an aminoindan group, and olodaterol utilizes a 6-hydroxybenzoxazine nucleus. These structures confer high beta-2 intrinsic efficacy, exceptional cell membrane micro-depot retention, and slow receptor off-rates, enabling once-daily maintenance therapy in COPD.',
            highYieldPearl: 'Ultra-LABAs (Indacaterol, Olodaterol, Vilanterol): Bicyclic cores (quinolinone, benzoxazine) + high lipid affinity provide true 24-hour bronchodilation (once-daily dosing for COPD).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 49-52'
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 2: Antimuscarinic Bronchodilators (SAMAs & LAMAs) (Questions 152 - 162)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 2,
    title: 'Antimuscarinic Bronchodilators: SAMAs & LAMAs',
    subtitle: 'Parasympathetic tone, M3-selective blockade, quaternary ammonium charge gating, soft drug design, and kinetic dissociation selectivity',
    sections: [
      {
        sectionTitle: 'Antimuscarinic Pharmacology & Quaternary Ammonium SAR',
        questions: [
          {
            id: 152,
            questionNumberLabel: 'Question 12',
            title: 'Parasympathetic Airway Control & M3 Receptor Signaling',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Vagal parasympathetic tone is the dominant bronchoconstrictor pathway in the human respiratory tract. Which muscarinic receptor subtype mediates airway smooth muscle contraction and submucosal gland mucus secretion, and what is its signaling pathway?',
            options: [
              'M3 muscarinic receptors; coupled to Gq proteins, activating Phospholipase C (PLC) to generate IP3 and DAG, increasing intracellular Ca2+ to induce bronchoconstriction and mucus secretion',
              'M2 muscarinic receptors; coupled to Gs proteins, activating adenylyl cyclase to increase cAMP',
              'M1 muscarinic receptors; coupled to Gi proteins, opening potassium channels to induce smooth muscle hyperpolarization',
              'Nicotinic alpha-7 receptors; opening ligand-gated sodium channels to trigger vagal nerve repolarization'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Postganglionic vagal fibers release acetylcholine (ACh) onto M3 muscarinic acetylcholine receptors located on bronchial smooth muscle cells and submucosal mucus glands. M3 receptors are Gq-coupled: activation triggers Phospholipase C-beta (PLC), cleaving PIP2 into inositol 1,4,5-trisphosphate (IP3) and diacylglycerol (DAG). IP3 triggers Ca2+ release from the sarcoplasmic reticulum, causing Calmodulin activation, MLCK phosphorylation, bronchial contraction, and copious mucus secretion. Antimuscarinics competitively block this pathway.',
              'Incorrect: M2 receptors are Gi-coupled, not Gs-coupled, and act predominantly as autoreceptors on nerve terminals or in cardiac tissue.',
              'Incorrect: M1 receptors are Gq-coupled and located in parasympathetic ganglia.',
              'Incorrect: Bronchomotor tone is controlled by muscarinic GPCRs, not nicotinic ion channels.'
            ],
            overallExplanation: 'Vagal parasympathetic innervation drives baseline bronchoconstriction and mucus production via M3 muscarinic receptors on airway smooth muscle and submucosal glands. M3 is coupled to Gq/PLC/IP3/Ca2+. Anticholinergic bronchodilators competitively antagonize ACh at M3 receptors, relaxing smooth muscle and reducing mucus hypersecretion.',
            highYieldPearl: 'Airway M3 receptors: Gq-coupled -> PLC -> IP3 up -> intracellular Ca2+ up -> bronchoconstriction + mucus secretion. Antimuscarinics block M3 to reverse bronchospasm.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 56-59'
          },
          {
            id: 153,
            questionNumberLabel: 'Question 13',
            title: 'Quaternary Ammonium Pharmacokinetics: Zero BBB Penetration & Topical Gating',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Natural tertiary belladonna alkaloids (e.g., atropine, scopolamine) are clinically impractical as inhaled bronchodilators due to severe systemic and central anticholinergic toxicity (mydriasis, urinary retention, delirium, tachycardia). How does quaternization of the nitrogen in ipratropium and tiotropium eliminate these liabilities?',
            options: [
              'Quaternization creates a permanent positive charge across all physiological pH values, preventing passive diffusion across lipid membranes (including the blood-brain barrier and gastrointestinal tract), thereby localizing action to the lungs and preventing central delirium',
              'Quaternization makes the drug highly lipophilic, causing 100% sequestration in bronchial cartilage',
              'Quaternization converts the molecule into a volatile gas that is exhaled within 2 seconds of inhalation',
              'Quaternization allows the drug to be eliminated exclusively via sweat glands without entering the bloodstream'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Quaternary ammonium compounds (4-degree amines) have four covalent carbon-nitrogen bonds, giving the nitrogen atom a permanent, pH-independent positive ionic charge. Unlike tertiary amines (3-degree amines like atropine, which exist partially uncharged at physiological pH and readily cross biological membranes), quaternary ammoniums cannot cross the lipophilic blood-brain barrier or intestinal mucosal membranes. When inhaled, ipratropium and tiotropium act locally on airway muscarinic receptors; any swallowed drug is poorly absorbed (<5% bioavailability), and absorbed drug cannot enter the brain, eliminating central anticholinergic delirium/hallucinations.',
              'Incorrect: Quaternary ammoniums are extremely hydrophilic/polar, not lipophilic.',
              'Incorrect: Quaternization does not convert drugs into volatile gases.',
              'Incorrect: Quaternary ammoniums are cleared renally/hepatically, not via sweat glands.'
            ],
            overallExplanation: 'Atropine is a tertiary amine that readily penetrates the blood-brain barrier and systemic circulation, producing dry mouth, tachycardia, urinary retention, and central delirium ("blind as a bat, mad as a hatter"). Quaternizing the tropane nitrogen (ipratropium, tiotropium) imparts a permanent positive charge. This prevents BBB penetration and limits intestinal absorption to <5%, restricting drug action to the bronchial tree.',
            highYieldPearl: 'Quaternary ammonium (4-degree) = PERMANENT positive charge at all pH levels. Zero BBB crossing -> NO central anticholinergic delirium; minimal GI absorption if swallowed.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 60-63'
          },
          {
            id: 154,
            questionNumberLabel: 'Question 14',
            title: 'Ipratropium Bromide: SAMA Tropate Structure & Non-Selective Kinetics',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Ipratropium bromide (Atrovent) is a prototype short-acting muscarinic antagonist (SAMA). What is its structural relationship to atropine, and what are its receptor selectivity and duration of action?',
            options: [
              'N-isopropyl quaternary ammonium derivative of atropine; non-selectively blocks M1, M2, and M3 muscarinic receptors with a duration of action of approximately 4–6 hours',
              'Dithienyl glycolate ester of scopolamine; selectively blocks M3 receptors with a 24-hour duration of action',
              'Quinuclidine ether; irreversibly inactivates M2 autoreceptors with a 30-day duration of action',
              'Pure tertiary amine; rapidly penetrates the central nervous system to suppress the medullary cough reflex'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Ipratropium bromide is synthesized by reacting atropine with isopropyl bromide, creating an N-isopropyl quaternary ammonium derivative. It exhibits rapid onset (~15 minutes) and a relatively short duration of action (~4-6 hours), requiring dosing 3-4 times daily. It binds non-selectively to M1, M2, and M3 muscarinic receptor subtypes with equal affinity, dissociating relatively rapidly from all of them.',
              'Incorrect: Dithienyl glycolate describes tiotropium (a LAMA, 24-hour duration).',
              'Incorrect: Quinuclidine ether describes umeclidinium.',
              'Incorrect: Ipratropium is a quaternary ammonium salt, not a tertiary amine, and cannot cross the BBB.'
            ],
            overallExplanation: 'Ipratropium is the N-isopropyl quaternary analogue of atropine. It functions as a SAMA with an onset of 15 minutes and duration of 4–6 hours. It is non-selective across M1, M2, and M3 subtypes. Frequently combined with albuterol (Combivent / DuoNeb) for synergistic bronchodilation in acute COPD and severe asthma exacerbations.',
            highYieldPearl: 'Ipratropium bromide: SAMA (N-isopropyl atropine derivative); non-selective M1/M2/M3 blocker; duration 4–6 hours (requires QID dosing).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slide 64'
          },
          {
            id: 155,
            questionNumberLabel: 'Question 15',
            title: 'Tiotropium Bromide: Dithienyl Glycolate SAR & M3 Kinetic Selectivity',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Tiotropium bromide (Spiriva) is a first-line once-daily LAMA. What structural modifications distinguish it from ipratropium, and what is the pharmacological basis of its long duration and "kinetic selectivity"?',
            options: [
              'Incorporation of an epoxide bridge on the tropane ring and two bulky lipophilic thiophene rings (dithienyl glycolate); exhibits kinetic selectivity by dissociating very slowly from M3 receptors (t1/2 ~35 hours) while dissociating rapidly from M2 autoreceptors (t1/2 ~3.6 hours)',
              'Replacement of the ester group with a covalent chloromethyl ketone that alkylates M3 receptors permanently',
              'Incorporation of a pyridine ring that binds to beta-2 adrenergic receptors simultaneously',
              'Conversion of the quaternary nitrogen into a tertiary amine that is selectively cleared by alveolar macrophages'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Tiotropium is a structural evolution of scopolamine: it retains the 6,7-epoxide bridge of scopine and features a quaternary N,N-dimethyl nitrogen, but critically replaces the tropic acid moiety with a di-(2-thienyl)glycolic acid ester. The two thiophene rings fit deeply into accessory hydrophobic pockets of the muscarinic receptor binding crevice. Although tiotropium binds with similar initial affinity to M1, M2, and M3 receptors, it displays dramatic kinetic selectivity: it dissociates exceptionally slowly from M3 receptors (dissociation half-life ~35 hours), allowing once-daily dosing, but dissociates rapidly from M2 autoreceptors (t1/2 ~3.6 hours), preserving negative feedback inhibition on ACh release.',
              'Incorrect: Tiotropium is a reversible competitive antagonist; it does not contain alkylating chloromethyl ketones.',
              'Incorrect: Tiotropium does not contain pyridine and does not bind beta-2 adrenoceptors.',
              'Incorrect: Tiotropium remains a permanently charged quaternary ammonium salt.'
            ],
            overallExplanation: 'Tiotropium features a scopine core (with an epoxide bridge) and a di-(2-thienyl)glycolate ester. The thiophene bioisosteres provide high-affinity hydrophobic anchoring. Crucially, tiotropium exhibits "kinetic selectivity": its off-rate from M3 receptors is extremely slow (t1/2 ~35 hours, providing 24-hour once-daily bronchodilation), whereas it dissociates ~10x faster from M2 receptors (t1/2 ~3.6 hours), preventing excessive ACh release.',
            highYieldPearl: 'Tiotropium SAR: Scopine epoxide + dithienyl glycolate. Kinetic selectivity: dissociates slowly from M3 (t1/2 ~35 hr -> once-daily LAMA) but rapidly from M2 (t1/2 ~3.6 hr).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 65-69'
          },
          {
            id: 156,
            questionNumberLabel: 'Question 16',
            title: 'Aclidinium Bromide: Soft Drug Design & Ultra-Rapid Plasma Hydrolysis',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Aclidinium bromide is engineered according to "soft drug" principles. What metabolic pathway rapidly inactivates any swallowed or systemically absorbed aclidinium, and what clinical safety advantage does this provide?',
            options: [
              'Ultra-rapid enzymatic hydrolysis by plasma butyrylcholinesterase and non-enzymatic cleavage into inactive carboxylic acid and alcohol metabolites (plasma t1/2 < 3 minutes), virtually eliminating cardiovascular and systemic anticholinergic adverse effects',
              'Rapid oxidative opening of its quinuclidine ring by pulmonary Cytochrome P450 1A2, extending its local duration to 72 hours',
              'Spontaneous decarboxylation in gastric acid into an active CNS stimulant',
              'Irreversible covalent binding to circulating alpha-1 acid glycoprotein, preventing renal clearance'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Aclidinium bromide is a classic "soft drug" antimuscarinic: it contains a labile glycolate ester linker connecting a quaternary quinuclidinium head and a phenoxyethyl group. Once inhaled, it exerts long-lasting bronchodilation on bronchial M3 receptors. However, any drug that enters the systemic circulation (via alveolar absorption or swallowed drug) is subjected to ultra-rapid hydrolysis by human plasma butyrylcholinesterase and chemical ester cleavage (plasma half-life < 2-3 minutes) to form an inactive alcohol and carboxylic acid. This minimizes systemic exposure and prevents cardiovascular side effects (e.g., tachycardia, arrhythmias).',
              'Incorrect: Aclidinium is inactivated by ester hydrolysis, not CYP-mediated ring opening.',
              'Incorrect: It is degraded into inactive metabolites, not CNS stimulants.',
              'Incorrect: It is designed for rapid systemic destruction, not prolonged protein-bound circulation.'
            ],
            overallExplanation: 'Aclidinium bromide embodies rational soft-drug engineering: an active therapeutic agent designed for predictable, rapid metabolic inactivation upon entering systemic circulation. Its ester bond is cleaved within minutes by plasma butyrylcholinesterase (plasma t1/2 < 3 min), converting it into pharmacologically inert metabolites and sparing patients from systemic antimuscarinic toxicity.',
            highYieldPearl: 'Aclidinium bromide: SOFT DRUG LAMA. Ultra-rapid plasma ester hydrolysis (plasma t1/2 < 3 min) -> near-zero systemic/cardiac anticholinergic side effects!',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 70-72'
          },
          {
            id: 157,
            questionNumberLabel: 'Question 17',
            title: 'Umeclidinium Bromide: Quinuclidine Ether LAMA Resistant to Ester Hydrolysis',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Umeclidinium bromide is a once-daily LAMA containing a quinuclidine core. How does its chemical linker differ from that of tiotropium and aclidinium, and how does this affect its chemical stability?',
            options: [
              'It contains an amino-ether linker rather than an ester group, rendering it completely resistant to plasma esterase hydrolysis and contributing to an extraordinarily long receptor dissociation half-life (>80 hours)',
              'It contains an ester linker that is hydrolyzed 100-fold faster than aclidinium',
              'It contains an amide linker that is cleaved by pancreatic trypsin in the lung',
              'It contains a disulfide bridge that is reduced by glutathione within 10 seconds of inhalation'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Umeclidinium features a diphenyl-quinuclidin-4-yl alcohol head connected to a biphenyl-4-ylmethyl quaternary nitrogen via an aminoalkyl-ether linker. Unlike tiotropium, ipratropium, and aclidinium (which are all carboxylic acid esters), umeclidinium lacks an ester linkage entirely. Because ether and amine bonds are resistant to plasma esterases, umeclidinium is not subject to rapid ester hydrolysis and exhibits prolonged metabolic stability and an exceptionally slow M3 receptor dissociation half-life (>80 hours), supporting once-daily dosing.',
              'Incorrect: Umeclidinium is an ether, not an ester, and does not undergo rapid esterase hydrolysis.',
              'Incorrect: It does not contain an amide linker and is not cleaved by trypsin.',
              'Incorrect: It does not contain a disulfide bridge.'
            ],
            overallExplanation: 'Umeclidinium replaces the traditional glycolate ester pharmacophore of older LAMAs with an amino-ether and biphenylmethyl quaternary quinuclidine framework. Devoid of an ester bond, umeclidinium is immune to plasma esterases, yielding prolonged local stability and an M3 dissociation half-life exceeding 80 hours (once-daily dosing in Anoro Ellipta and Trelegy Ellipta).',
            highYieldPearl: 'Umeclidinium: Quinuclidine AMINO-ETHER linker (lacks an ester bond!). Immune to plasma esterases -> very long M3 dissociation t1/2 (>80 hr), once-daily dosing.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 73-75'
          },
          {
            id: 158,
            questionNumberLabel: 'Question 18',
            title: 'Glycopyrrolate (Glycopyrronium): Pyrrolidinium Mandelic Ester SAR',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Glycopyrrolate (glycopyrronium bromide) is a quaternary antimuscarinic bronchodilator. What are its defining structural components, and in which clinical respiratory formulations is it commonly used?',
            options: [
              'A 1,1-dimethylpyrrolidinium quaternary ring linked via an ester to alpha-cyclopentylmandelic acid; widely used as an inhaled LAMA in dual and triple maintenance therapy for COPD',
              'A morpholine ring connected to an indole-3-carboxylic acid; used exclusively as a sublingual rescue tablet for acute asthma',
              'A piperidine ring linked to a sulfonamide; used as an intravenous agent for cystic fibrosis',
              'An imidazole ring attached to a steroid core; used as an oral elixir for pediatric croup'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Glycopyrrolate is a synthetic quaternary ammonium antimuscarinic consisting of a 1,1-dimethylpyrrolidinium cation esterified to cyclopentylmandelic acid (alpha-cyclopentyl-alpha-phenylglycolic acid). When inhaled, it acts as a potent LAMA with rapid onset and extended bronchodilation. It is a cornerstone component of dual (e.g., formoterol/glycopyrrolate - Bevespi) and triple therapy inhalers (e.g., budesonide/glycopyrrolate/formoterol - Breztri Aerosphere) for COPD.',
              'Incorrect: Glycopyrrolate contains a pyrrolidinium ring, not a morpholine ring, and is not a sublingual rescue drug.',
              'Incorrect: It does not contain piperidine or sulfonamide.',
              'Incorrect: It is not an imidazole or steroid.'
            ],
            overallExplanation: 'Glycopyrrolate (glycopyrronium) consists of a quaternary 1,1-dimethylpyrrolidinium head coupled to an alpha-cyclopentylmandelate ester. Its bulky lipophilic cyclopentyl and phenyl rings confer high affinity for M3 receptors. Inhaled glycopyrrolate provides sustained bronchodilation and is extensively utilized in dual (LAMA/LABA) and triple (ICS/LAMA/LABA) inhalers for COPD.',
            highYieldPearl: 'Glycopyrrolate: Quaternary 1,1-dimethylpyrrolidinium + cyclopentylmandelate ester. Inhaled LAMA used in COPD combination inhalers (e.g., Breztri, Bevespi).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slide 76'
          },
          {
            id: 159,
            questionNumberLabel: 'Question 19',
            title: 'Presynaptic M2 Autoreceptor vs. Postsynaptic M3 Effector Selectivity',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'In the pulmonary parasympathetic nervous system, presynaptic M2 receptors and postsynaptic M3 receptors have opposing functional effects on bronchomotor tone. Why is selective M3 blockade (or sparing presynaptic M2 autoreceptors) therapeutically desirable?',
            options: [
              'Presynaptic M2 receptors act as inhibitory autoreceptors that shut off further acetylcholine release; blocking M2 increases acetylcholine release, which can overcome M3 blockade and diminish bronchodilation',
              'Presynaptic M2 receptors stimulate adenylyl cyclase; blocking them causes bronchoconstriction',
              'Postsynaptic M3 receptors inhibit histamine release; blocking them triggers mast cell degranulation',
              'Presynaptic M2 receptors are located in the kidney; blocking them causes severe potassium wasting'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Postganglionic cholinergic nerve terminals express presynaptic M2 muscarinic autoreceptors. When acetylcholine is released into the junctional cleft, it binds to these presynaptic M2 receptors to provide negative feedback inhibition, shutting down further acetylcholine exocytosis. If an antagonist non-selectively blocks presynaptic M2 receptors, this negative feedback is lost, leading to massive compensatory release of acetylcholine into the synaptic cleft, which can compete with and displace the drug from postsynaptic M3 receptors. Therefore, kinetic or receptor selectivity that avoids blocking presynaptic M2 autoreceptors produces superior, sustained bronchodilation.',
              'Incorrect: M2 receptors are Gi-coupled autoreceptors, not Gs adenylyl cyclase stimulators.',
              'Incorrect: M3 receptors mediate smooth muscle contraction, not inhibition of histamine release.',
              'Incorrect: The relevant presynaptic M2 receptors are located on pulmonary vagal nerve terminals, not the kidney.'
            ],
            overallExplanation: 'Presynaptic M2 muscarinic receptors act as physiological "brakes" on cholinergic nerve terminals, exerting negative feedback to terminate ACh release. Non-selective drugs that block presynaptic M2 remove this brake, dramatically boosting ACh release and potentially overcoming postsynaptic M3 blockade. Drugs with kinetic selectivity (like tiotropium, which dissociates ~10x faster from M2 than M3) preserve this autoreceptor brake.',
            highYieldPearl: 'Presynaptic M2 = inhibitory autoreceptor (shuts off ACh release). Postsynaptic M3 = bronchoconstriction. Blocking M2 increases ACh release -> counterproductive! Sparing M2 is ideal.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 77-79'
          },
          {
            id: 160,
            questionNumberLabel: 'Question 20',
            title: 'Synergistic Dual Bronchodilation (LABA + LAMA Combination)',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Combining a long-acting beta-2 agonist (LABA) with a long-acting muscarinic antagonist (LAMA) is standard-of-care maintenance therapy for symptomatic COPD. What is the molecular and physiological basis for the synergy observed between these two drug classes?',
            options: [
              'They target independent, complementary signaling pathways: LABAs stimulate Gs-coupled adenylyl cyclase to increase cAMP (functional bronchodilation), while LAMAs inhibit Gq-coupled M3 signaling to block IP3/Ca2+ release; simultaneously, PKA phosphorylates M3-associated signaling proteins to further blunt cholinergic bronchospasm',
              'LABAs and LAMAs chemically react in the inhaler canister to form a covalent heterodimer that binds both receptors simultaneously',
              'LAMAs act as allosteric activators of beta-2 adrenoceptors, increasing salmeterol binding affinity by 1000-fold',
              'LABAs inhibit renal clearance of LAMAs, increasing systemic blood concentrations by 500%'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Dual bronchodilation achieves profound synergy because the drugs address bronchomotor tone from complementary angles: (1) LABAs provide active/functional bronchodilation by stimulating Gs -> adenylyl cyclase -> cAMP -> PKA, directly inactivating MLCK; (2) LAMAs provide passive bronchodilation by blocking M3 -> Gq -> PLC -> IP3 -> Ca2+ contraction and mucus hypersecretion. Furthermore, cAMP/PKA cross-talk inhibits downstream muscarinic receptor signaling. The combination yields greater FEV1 improvements and symptom relief at lower individual doses, reducing side effects.',
              'Incorrect: LABAs and LAMAs do not form covalent heterodimers.',
              'Incorrect: LAMAs are competitive antagonists at muscarinic receptors, not allosteric activators of beta-2 receptors.',
              'Incorrect: Synergy is pharmacodynamic in the airways, not pharmacokinetic in the kidney.'
            ],
            overallExplanation: 'Dual bronchodilation (LAMA + LABA) targets opposing arms of airway autonomic control: beta-2 adrenoceptor stimulation (Gs -> cAMP up -> active relaxation) plus M3 muscarinic receptor blockade (Gq -> IP3/Ca2+ down -> reversal of cholinergic tone). This dual approach achieves synergistic smooth muscle relaxation, improved lung deflation, and reduced exacerbations.',
            highYieldPearl: 'LABA + LAMA synergy: LABA activates Gs/cAMP (active relaxation) + LAMA blocks Gq/IP3/Ca2+ (blocks cholinergic constriction) = complementary mechanisms & maximum FEV1 gain.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 80-83'
          },
          {
            id: 161,
            questionNumberLabel: 'Question 21',
            title: 'Muscarinic Antagonist Pharmacophore & Antagonist-Converting Bulky Groups',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Acetylcholine is a small, flexible agonist at muscarinic receptors. What structural modifications transform the acetylcholine scaffold into a potent competitive muscarinic antagonist?',
            options: [
              'Addition of two bulky lipophilic aromatic or cycloalkyl rings (e.g., phenyl, thiophene, cyclopentyl) onto the acyl carbon, which anchor into adjacent accessory hydrophobic pockets that are not engaged by acetylcholine',
              'Removal of the quaternary ammonium nitrogen, replacing it with an uncharged methyl group',
              'Reduction of the ester carbonyl oxygen to a methylene group, converting it into a primary alcohol',
              'Shortening the ethylene bridge to zero carbons so the acyl group is bonded directly to the nitrogen'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: The classical muscarinic antagonist pharmacophore requires: (1) A cationic nitrogen head (quaternary ammonium or basic tertiary amine); (2) An ester, ether, or carbon linker; and (3) Crucially, bulky lipophilic substituents (R1 and R2: phenyl, thiophene, cyclohexyl, cyclopentyl) attached to an alpha-carbon bearing a hydroxyl group. While small acetylcholine binds only to the primary orthosteric site, these bulky hydrophobic rings bind accessory hydrophobic regions on the muscarinic receptor, holding the receptor in an inactive conformation and preventing the conformational shift required for G-protein activation.',
              'Incorrect: The cationic head is essential for anchoring to the conserved aspartate residue (Asp147 in M3); removing it abolishes binding.',
              'Incorrect: Converting the ester to a primary alcohol destroys the antagonist pharmacophore.',
              'Incorrect: Shortening the linker prevents optimal pharmacophore spacing.'
            ],
            overallExplanation: 'Muscarinic antagonist SAR: Muscarinic agonists (like acetylcholine) are small molecules fitting into the compact active site. Antagonists require a cationic head, an ester/ether bridge, and two bulky lipophilic rings (phenyl, cyclopentyl, thiophene) flanking a tertiary alcohol. These bulky groups engage accessory hydrophobic binding pockets surrounding the active site, locking the receptor in an inactive state.',
            highYieldPearl: 'Muscarinic Antagonist SAR: Cationic head + ester/ether linker + TWO BULKY HYDROPHOBIC RINGS (phenyl/thiophene/cyclopentyl). Bulky rings bind accessory pockets to block receptor activation.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 84-86'
          },
          {
            id: 162,
            questionNumberLabel: 'Question 22',
            title: 'Patient Inhalation Technique & Inadvertent Ocular Exposure Risks',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'A 72-year-old COPD patient using an ipratropium/albuterol soft-mist inhaler with an ill-fitting face mask experiences sudden right-sided eye pain, severe headache, rainbow halos around lights, and a fixed, dilated pupil. What iatrogenic complication has occurred?',
            options: [
              'Inadvertent ocular leakage of aerosolized ipratropium, causing pupillary dilation (mydriasis) and cycloplegia that precipitated acute angle-closure glaucoma',
              'Albuterol-induced retinal artery thrombosis caused by selective alpha-1 vasoconstriction',
              'Direct chemical corneal de-epithelialization by propellant chlorofluorocarbons (CFCs)',
              'Systemic beta-blockade causing sudden vitreous hemorrhage'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: When inhaled anticholinergic aerosols (ipratropium or tiotropium) inadvertently leak into the eyes (common with loose masks or poor inhaler technique), the drug is topically absorbed through the cornea and blocks muscarinic M3 receptors on the pupillary sphincter muscle (causing mydriasis / pupil dilation) and ciliary muscle (causing cycloplegia / paralysis of accommodation). In patients with anatomically shallow anterior chambers, mydriasis causes the iris to bunch up against the trabecular meshwork, precipitating acute angle-closure glaucoma (an ophthalmologic emergency presenting with ocular pain, headache, halos, and vision loss).',
              'Incorrect: Albuterol is a beta-2 agonist (causing vasodilation), not an alpha-1 vasoconstrictor, and does not cause retinal thrombosis.',
              'Incorrect: Modern inhalers use hydrofluoroalkanes (HFAs) or soft-mists, not CFCs, and this presentation is classic glaucoma, not corneal de-epithelialization.',
              'Incorrect: Albuterol is a beta-agonist, not a beta-blocker, and does not cause vitreous hemorrhage.'
            ],
            overallExplanation: 'Inadvertent ocular exposure to anticholinergic inhalers (ipratropium, tiotropium) blocks M3 receptors on the iris sphincter muscle, producing mydriasis and cycloplegia. In susceptible elderly patients, this can block aqueous humor outflow through the canal of Schlemm, precipitating acute angle-closure glaucoma. Patients must be counseled to close their eyes during administration and ensure a snug mask fit.',
            highYieldPearl: 'Inhaled anticholinergics (ipratropium/tiotropium) sprayed in the eye -> M3 blockade -> mydriasis (dilated pupil) -> acute angle-closure glaucoma emergency!',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slide 87'
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 3: Methylxanthines & Phosphodiesterase (PDE) Inhibitors (Questions 163 - 172)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 3,
    title: 'Methylxanthines & Phosphodiesterase (PDE) Inhibitors',
    subtitle: 'Theophylline purine core, narrow therapeutic index, CYP1A2 drug interactions, aminophylline salts, roflumilast PDE4 inhibition, and ensifentrine dual PDE3/4 targeting',
    sections: [
      {
        sectionTitle: 'Methylxanthines: Theophylline Pharmacology & Pharmacokinetics',
        questions: [
          {
            id: 163,
            questionNumberLabel: 'Question 23',
            title: 'Theophylline: Purine Alkaloid Structure & Dual Molecular Mechanisms',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Theophylline is chemically 1,3-dimethylxanthine, a naturally occurring purine alkaloid. What two distinct molecular mechanisms are responsible for its bronchodilatory and anti-inflammatory effects?',
            options: [
              'Non-selective inhibition of cyclic nucleotide phosphodiesterases (PDE3, PDE4, PDE5), preventing cAMP/cGMP degradation, AND competitive antagonism of cell-surface adenosine receptors (A1, A2A, A2B)',
              'Selective activation of muscarinic M3 receptors and direct opening of voltage-gated calcium channels',
              'Irreversible acylation of beta-2 adrenoceptors and allosteric inhibition of adenylyl cyclase',
              'Covalent inhibition of 5-lipoxygenase and direct stimulation of cysteinyl leukotriene receptors'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Theophylline acts via two complementary mechanisms: (1) Non-selective competitive inhibition of phosphodiesterases (particularly PDE3 in airway smooth muscle and PDE4 in immune cells), preventing the breakdown of cAMP and cGMP, which increases intracellular cAMP levels to promote smooth muscle relaxation; and (2) Competitive antagonism of cell-surface adenosine receptors (A1, A2A, A2B), blocking adenosine-induced bronchoconstriction and mediator release from mast cells. At lower concentrations, it also activates histone deacetylase-2 (HDAC2), enhancing steroid responsiveness.',
              'Incorrect: Theophylline blocks, rather than activates, muscarinic pathways and reduces intracellular calcium.',
              'Incorrect: Theophylline does not acylate beta-2 receptors; it increases cAMP downstream by preventing PDE degradation.',
              'Incorrect: Zileuton inhibits 5-lipoxygenase, not theophylline.'
            ],
            overallExplanation: 'Theophylline (1,3-dimethylxanthine) is a dual-action agent: (1) Non-selective PDE inhibitor (preventing cAMP degradation in smooth muscle and inflammatory cells); and (2) Competitive adenosine receptor antagonist (blocking adenosine-mediated bronchospasm). It also recruits histone deacetylase 2 (HDAC2) to suppress inflammatory gene transcription.',
            highYieldPearl: 'Theophylline: 1,3-dimethylxanthine. Dual MOA: 1) Non-selective PDE inhibitor (cAMP/cGMP up -> bronchodilation); 2) Adenosine receptor antagonist (blocks adenosine bronchoconstriction).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 90-94'
          },
          {
            id: 164,
            questionNumberLabel: 'Question 24',
            title: 'Theophylline: Narrow Therapeutic Index & Concentration-Dependent Toxicity',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Theophylline is classified as a Narrow Therapeutic Index (NTI) drug. What is its established therapeutic serum concentration range, and what life-threatening toxicities occur when serum levels exceed 20–25 mcg/mL?',
            options: [
              'Therapeutic range is 10–20 mcg/mL (target 5–15 mcg/mL in modern practice); toxicity (>20 mcg/mL) causes intractable nausea, cardiac tachyarrhythmias (atrial and ventricular), and intractable, refractory seizures',
              'Therapeutic range is 50–100 mcg/mL; toxicity causes acute hepatic failure and severe hypoglycemia',
              'Therapeutic range is 0.1–0.5 mcg/mL; toxicity causes pulmonary alveolar proteinosis and bilateral optic neuritis',
              'Therapeutic range is 200–400 mcg/mL; toxicity causes irreversible aplastic anemia'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: The traditional therapeutic window for theophylline is 10-20 mcg/mL (with modern guidelines frequently targeting 5-15 mcg/mL to avoid toxicity). Serum concentrations above 20 mcg/mL trigger concentration-dependent toxicity: mild adverse effects include nausea, vomiting, headache, insomnia, and gastroesophageal reflux; severe, life-threatening toxicities (>25-30 mcg/mL) include fatal cardiac tachyarrhythmias (multifocal atrial tachycardia, ventricular tachycardia/fibrillation) and status epilepticus / refractory seizures that respond poorly to standard anticonvulsants.',
              'Incorrect: 50-100 mcg/mL is in the lethal range; the therapeutic range is 10-20 mcg/mL.',
              'Incorrect: 0.1-0.5 mcg/mL is subtherapeutic.',
              'Incorrect: 200-400 mcg/mL is fatal.'
            ],
            overallExplanation: 'Theophylline possesses a notoriously narrow therapeutic index (target: 10–20 mcg/mL, or 5–15 mcg/mL). Toxicity correlates directly with serum levels: GI distress, tremor, and reflux occur at >15–20 mcg/mL; severe cardiac arrhythmias (ventricular tachycardias) and refractory seizures (often fatal or causing permanent neurological damage) emerge at >25–30 mcg/mL, necessitating therapeutic drug monitoring (TDM).',
            highYieldPearl: 'Theophylline therapeutic range = 10–20 mcg/mL (or 5–15 mcg/mL). Narrow therapeutic index: levels >20 mcg/mL cause cardiac tachyarrhythmias and fatal, refractory seizures!',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 95-97'
          },
          {
            id: 165,
            questionNumberLabel: 'Question 25',
            title: 'Theophylline Metabolism: CYP1A2 Clearance & Smoking/Inhibitor Interactions',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'A 58-year-old patient well-controlled on oral theophylline (serum level 12 mcg/mL) is prescribed ciprofloxacin for a bacterial exacerbation. Four days later, the patient develops severe vomiting, palpitations, and tremors, with a theophylline level of 28 mcg/mL. What enzyme mediates theophylline clearance, and what drug interaction occurred?',
            options: [
              'Theophylline is cleared >90% by hepatic CYP1A2; ciprofloxacin is a potent CYP1A2 inhibitor that blocked theophylline metabolism, causing dangerous toxic accumulation',
              'Theophylline is cleared by renal P-glycoprotein; ciprofloxacin induced P-glycoprotein, blocking renal filtration',
              'Theophylline is cleared by CYP2D6; ciprofloxacin displaced theophylline from plasma albumin',
              'Theophylline is cleared by colonic glucuronidation; ciprofloxacin killed gut flora responsible for theophylline degradation'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Theophylline undergoes extensive (>90%) hepatic metabolism via Cytochrome P450, primarily by CYP1A2 (with minor contributions from CYP2E1 and CYP3A4) to 1,3-dimethyluric acid, 1-methyluric acid, and 3-methylxanthine. Ciprofloxacin is a potent inhibitor of CYP1A2: co-administration reduces theophylline clearance by 30-50%, rapidly precipitating severe theophylline toxicity. Other potent CYP1A2 inhibitors that cause theophylline toxicity include fluvoxamine, zileuton, and cimetidine. Conversely, cigarette smoking induces CYP1A2, increasing theophylline clearance and requiring higher maintenance doses.',
              'Incorrect: Theophylline clearance is hepatic via CYP1A2, not renal P-gp.',
              'Incorrect: CYP1A2 is the primary clearance pathway, not CYP2D6.',
              'Incorrect: Clearance is mediated by hepatic CYP1A2, not colonic bacteria.'
            ],
            overallExplanation: 'Theophylline is metabolized primarily by hepatic CYP1A2. Strong CYP1A2 inhibitors (ciprofloxacin, zileuton, fluvoxamine, cimetidine) drastically reduce theophylline clearance, rapidly driving serum levels into the toxic (>20 mcg/mL) range. Conversely, polycyclic aromatic hydrocarbons in cigarette and cannabis smoke induce CYP1A2, doubling theophylline clearance and necessitating higher doses.',
            highYieldPearl: 'Theophylline clearance = CYP1A2. CYP1A2 inhibitors (Ciprofloxacin, Zileuton, Fluvoxamine) -> theophylline toxicity! Cigarette smoke = CYP1A2 inducer -> lower levels.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 98-101'
          },
          {
            id: 166,
            questionNumberLabel: 'Question 26',
            title: 'Aminophylline: Ethylenediamine Salt Formulation for Aqueous Solubility',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Theophylline base has limited water solubility (~8 mg/mL at room temperature), complicating parenteral intravenous formulation. How does the structure of aminophylline overcome this solubility limitation?',
            options: [
              'It is a 2:1 stable salt complex of theophylline and ethylenediamine, increasing aqueous solubility ~20-fold and allowing concentrated intravenous administration (contains ~80% anhydrous theophylline)',
              'It is an ester prodrug containing a sodium succinate group that is cleaved by lung esterases',
              'It is an inclusion complex of theophylline inside beta-cyclodextrin that requires lipid emulsion formulation',
              'It is a polyethylene glycol polymer conjugate that bypasses the need for water solubility'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Aminophylline is a stable salt complex composed of two theophylline molecules and one ethylenediamine molecule (2:1 molar ratio; theophylline-ethylenediamine). The basic diamine deprotonates the acidic imide nitrogen (N7-H / N9-H) of theophylline, forming an ionized salt that is ~20 times more soluble in water than theophylline free base. It contains approximately 79-86% anhydrous theophylline by weight and is used for intravenous infusion in acute severe asthma/COPD exacerbations.',
              'Incorrect: Aminophylline is a simple non-covalent salt with ethylenediamine, not an ester prodrug.',
              'Incorrect: Aminophylline is a salt complex, not a cyclodextrin inclusion complex.',
              'Incorrect: Aminophylline is a small-molecule salt, not a PEG conjugate.'
            ],
            overallExplanation: 'Theophylline free base has poor aqueous solubility. Aminophylline is formulated as a 2:1 salt complex of theophylline and ethylenediamine. Salt formation dramatically enhances water solubility (~20-fold), enabling intravenous administration in acute inpatient settings. Dosing calculations must account for the fact that aminophylline provides ~80% anhydrous theophylline by weight.',
            highYieldPearl: 'Aminophylline = Theophylline + Ethylenediamine (2:1 salt complex). ~20x more water-soluble than theophylline base -> IV formulation. Contains ~80% theophylline.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slide 102'
          },
          {
            id: 167,
            questionNumberLabel: 'Question 27',
            title: 'Xanthine SAR: Caffeine (1,3,7-Trimethyl) vs. Theobromine (3,7-Dimethyl) vs. Theophylline (1,3-Dimethyl)',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Comparing the natural methylxanthines, why is theophylline (1,3-dimethylxanthine) a more potent bronchodilator than caffeine (1,3,7-trimethylxanthine) and theobromine (3,7-dimethylxanthine)?',
            options: [
              'An unsubstituted nitrogen at position 7 (N7-H) is required for optimal active-site hydrogen bonding with phosphodiesterases; methylation at N7 (caffeine) or lack of N1-methylation (theobromine) significantly reduces bronchodilator potency while increasing CNS stimulation',
              'Methylation at N7 converts caffeine into an irreversible covalent inhibitor of cardiac calcium channels',
              'Theobromine contains an arsenic atom that inactivates pulmonary adenylyl cyclase',
              'Theophylline lacks a purine ring system, existing instead as a flexible pyrimidine monocyclic amine'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Xanthine SAR demonstrates that methyl substitution at N1 and N3 (theophylline) optimizes smooth muscle relaxation and bronchodilation. Crucially, the presence of a free, unsubstituted N7 (or N9) hydrogen allows key hydrogen bonding in the PDE catalytic pocket. When N7 is methylated (as in caffeine: 1,3,7-trimethylxanthine), bronchodilator potency drops significantly, while central nervous system stimulant potency increases. Theobromine (3,7-dimethylxanthine) lacks N1-methylation and has very weak bronchodilator and CNS activity, acting primarily as a cardiac stimulant and diuretic.',
              'Incorrect: Caffeine is a reversible non-covalent agent and does not contain calcium-channel-alkylating moieties.',
              'Incorrect: Theobromine is an all-organic methylxanthine; it does not contain arsenic.',
              'Incorrect: All three compounds share the identical bicyclic purine (xanthine) core.'
            ],
            overallExplanation: 'Xanthine SAR: Theophylline = 1,3-dimethylxanthine (optimal bronchodilation + PDE inhibition; free N7-H). Caffeine = 1,3,7-trimethylxanthine (N7-methyl reduces bronchodilation, enhances CNS stimulation). Theobromine = 3,7-dimethylxanthine (lacks N1-methyl; weak bronchodilator).',
            highYieldPearl: 'Methylxanthine SAR: Theophylline (1,3-dimethyl) = potent bronchodilator (free N7-H). Caffeine (1,3,7-trimethyl) = strong CNS stimulant, weaker bronchodilator. Theobromine (3,7-dimethyl) = weak bronchodilator.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slide 103'
          },
          {
            id: 168,
            questionNumberLabel: 'Question 28',
            title: 'Phosphodiesterase-4 (PDE4) Isoform: Cellular Distribution & Anti-Inflammatory Rationale',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Phosphodiesterase enzymes comprise 11 distinct gene families (PDE1 to PDE11). Why is PDE4 the primary therapeutic target for reducing airway inflammation in chronic obstructive pulmonary disease (COPD)?',
            options: [
              'PDE4 is the predominant cAMP-hydrolyzing isoform expressed in immune and inflammatory cells (neutrophils, macrophages, CD8+ T cells); inhibiting PDE4 elevates intracellular cAMP, suppressing NF-kappa-B activation and reducing pro-inflammatory cytokine release (TNF-alpha, IL-8)',
              'PDE4 is located exclusively in airway smooth muscle and directly breaks down ATP into adenosine',
              'PDE4 hydrolyzes cGMP in pulmonary vascular endothelial cells to induce pulmonary hypertension',
              'PDE4 is an extracellular protease that degrades pulmonary surfactant phospholipids'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: PDE4 specifically hydrolyzes cAMP into 5\'-AMP and is the predominant PDE family expressed in human leukocytes (neutrophils, eosinophils, monocytes, macrophages, and CD8+ T lymphocytes). In COPD, chronic airway inflammation is driven predominantly by neutrophil and macrophage activation. Inhibiting PDE4 elevates intracellular cAMP within these inflammatory cells, activating PKA, which inhibits the transcription factor NF-kappa-B and blunts the release of inflammatory mediators (TNF-alpha, IL-8, reactive oxygen species, and matrix metalloproteinases).',
              'Incorrect: PDE4 is predominantly in inflammatory cells, not exclusively smooth muscle, and hydrolyzes cAMP, not ATP.',
              'Incorrect: PDE5 (not PDE4) is the cGMP-hydrolyzing enzyme targeted in pulmonary arterial hypertension (e.g., sildenafil).',
              'Incorrect: PDE4 is an intracellular phosphodiesterase, not an extracellular protease.'
            ],
            overallExplanation: 'PDE4 is the major cAMP-metabolizing enzyme in inflammatory and immune cells. In COPD, cigarette smoke activates neutrophils and macrophages to release destructive proteases and cytokines. Selective PDE4 inhibition maintains high cAMP levels in these leukocytes, suppressing NF-kappa-B transcription and curbing neutrophil infiltration and chronic bronchitis.',
            highYieldPearl: 'PDE4 is the dominant cAMP-degrading enzyme in leukocytes (neutrophils, macrophages). PDE4 inhibition -> cAMP up -> blocks NF-kappa-B & cytokine release -> anti-inflammatory in COPD.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 106-109'
          },
          {
            id: 169,
            questionNumberLabel: 'Question 29',
            title: 'Roflumilast: Dichloropyridine-Benzamide SAR & Clinical Indication',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Roflumilast (Daliresp) is an orally administered, non-xanthine selective PDE4 inhibitor. What chemical pharmacophore defines roflumilast, and what is its specific FDA-approved clinical indication?',
            options: [
              'A substituted benzamide bearing a dichloropyridine ring and a cyclopropylmethoxy group; indicated as oral maintenance therapy to reduce COPD exacerbations in patients with severe COPD associated with chronic bronchitis and a history of frequent exacerbations',
              'A pteridine ring with three sulfonamides; indicated as an inhalable rescue agent for acute pediatric asthma',
              'A steroid nucleus bearing an epoxide; indicated for idiopathic pulmonary fibrosis',
              'A xanthine core with a quaternary ammonium; indicated for central sleep apnea'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Roflumilast is a synthetic non-xanthine small molecule containing an aromatic benzamide scaffold substituted with a 3,5-dichloropyridin-4-yl ring, a 3-cyclopropylmethoxy group, and a difluoromethoxy group. It is a sub-nanomolar inhibitor of PDE4 (IC50 ~0.8 nM). It is FDA-approved as an oral, once-daily add-on maintenance medication to reduce the frequency of exacerbations in patients with severe COPD (FEV1 < 50% predicted) associated with chronic bronchitis and a documented history of exacerbations.',
              'Incorrect: Roflumilast is not a pteridine or an acute asthma rescue inhaler.',
              'Incorrect: Roflumilast is non-steroidal and is not indicated for pulmonary fibrosis.',
              'Incorrect: Roflumilast is a non-xanthine benzamide, not a xanthine quaternary salt.'
            ],
            overallExplanation: 'Roflumilast (Daliresp) features a 3,5-dichloropyridinyl benzamide core with cyclopropylmethoxy and difluoromethoxy substituents. It is an oral, highly selective PDE4 inhibitor approved specifically to reduce exacerbations in patients with severe COPD associated with chronic bronchitis and frequent exacerbation history.',
            highYieldPearl: 'Roflumilast (Daliresp): Oral selective PDE4 inhibitor (dichloropyridine-benzamide). Indication: reduces exacerbations in severe COPD with chronic bronchitis & frequent exacerbations.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 110-113'
          },
          {
            id: 170,
            questionNumberLabel: 'Question 30',
            title: 'Roflumilast Metabolism: Active N-Oxide Metabolite & Pharmacokinetics',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Following oral administration, roflumilast undergoes extensive hepatic transformation to roflumilast N-oxide. Which cytochrome P450 enzymes catalyze this reaction, and what is the pharmacological significance of this metabolite?',
            options: [
              'Catalyzed by CYP3A4 and CYP1A2; roflumilast N-oxide is equipotent to parent roflumilast, possesses a longer elimination half-life (~30 hours vs ~17 hours), and accounts for >90% of total in vivo PDE4 inhibitory activity',
              'Catalyzed by CYP2D6; roflumilast N-oxide is completely inactive and excreted instantly in feces',
              'Catalyzed by renal esterases; roflumilast N-oxide causes irreversible inhibition of monoamine oxidase',
              'Catalyzed by pulmonary xanthine oxidase; roflumilast N-oxide causes selective lysis of pneumocytes'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: In the liver, roflumilast is metabolized predominantly by CYP3A4 and CYP1A2 via N-oxidation of the dichloropyridine nitrogen, generating roflumilast N-oxide. Roflumilast N-oxide is biologically active with essentially identical PDE4 inhibitory potency (IC50 ~2 nM) to parent drug. Because roflumilast N-oxide reaches ~10-fold higher circulating plasma concentrations and has a longer half-life (~30 hours compared to ~17 hours for roflumilast), it is responsible for >90% of the clinical in vivo pharmacodynamic effect.',
              'Incorrect: Roflumilast N-oxide is the primary active circulating species, not inactive.',
              'Incorrect: Transformation is mediated by hepatic CYP3A4 and CYP1A2, not renal esterases.',
              'Incorrect: It is not mediated by pulmonary xanthine oxidase.'
            ],
            overallExplanation: 'Roflumilast is metabolized by CYP3A4 and CYP1A2 to roflumilast N-oxide. This metabolite is equipotent to roflumilast at PDE4, reaches higher systemic exposure (AUC), and has an extended elimination half-life (~30 hours vs ~17 hours for parent). Consequently, roflumilast N-oxide mediates >90% of total therapeutic PDE4 inhibition in vivo.',
            highYieldPearl: 'Roflumilast -> Roflumilast N-oxide (via CYP3A4 & CYP1A2). N-oxide is EQUIPOTENT, has longer t1/2 (~30 hr), and accounts for >90% of in vivo PDE4 inhibitory activity!',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 114-116'
          },
          {
            id: 171,
            questionNumberLabel: 'Question 31',
            title: 'Roflumilast Adverse Effects: Gastrointestinal, Weight Loss & Neuropsychiatric Warnings',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Despite its clinical efficacy, roflumilast use is frequently discontinued due to class-specific adverse effects. Which triad of adverse reactions must clinicians carefully monitor during roflumilast therapy?',
            options: [
              'Gastrointestinal disturbances (diarrhea, nausea), significant unexplained weight loss (loss of 5–10% body weight), and psychiatric adverse events (insomnia, anxiety, depression, suicidal ideation)',
              'Severe peripheral edema, hirsutism, and hypertrichosis',
              'Agranulocytosis, fatal pulmonary fibrosis, and severe hypercalcemia',
              'Deep vein thrombosis, tendon rupture, and gynecomastia'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Systemic PDE4 inhibition elevates cAMP in the brain and gut, producing characteristic adverse effects: (1) Gastrointestinal toxicity: Diarrhea (up to 10%) and nausea (up to 5%), typically during the first weeks of therapy; (2) Weight loss: Significant unintentional weight loss (patients lose an average of 2–3 kg, with ~20% losing >5% of body weight), requiring regular body weight monitoring; and (3) Neuropsychiatric events: Insomnia, anxiety, new or worsening depression, and suicidal thoughts/behavior, warranting careful psychiatric screening.',
              'Incorrect: Peripheral edema and hirsutism are associated with vasodilators like minoxidil.',
              'Incorrect: Agranulocytosis and pulmonary fibrosis describe clozapine and amiodarone.',
              'Incorrect: Tendon rupture is a fluoroquinolone toxicity; gynecomastia is associated with spironolactone.'
            ],
            overallExplanation: 'Oral PDE4 inhibitors produce systemic adverse effects: (1) Gastrointestinal upset (diarrhea, nausea, decreased appetite); (2) Significant weight loss (loss of 5–10% of total body weight); and (3) Neuropsychiatric disturbances (insomnia, anxiety, depression, suicidal ideation). Body weight and mental status must be monitored routinely.',
            highYieldPearl: 'Roflumilast adverse effect triad: 1) Diarrhea/Nausea; 2) Significant Weight Loss (5-10% of body weight); 3) Neuropsychiatric events (depression, anxiety, suicidal ideation).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 117-120'
          },
          {
            id: 172,
            questionNumberLabel: 'Question 32',
            title: 'Ensifentrine (Ohtuvayre): Inhaled Dual PDE3/PDE4 Inhibitor Breakthrough',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Ensifentrine (Ohtuvayre) is a first-in-class inhaled dual inhibitor of PDE3 and PDE4 approved for COPD maintenance. How does combining PDE3 and PDE4 inhibition in an inhalable formulation deliver clinical advantages over oral roflumilast?',
            options: [
              'PDE3 inhibition in airway smooth muscle elevates cAMP/cGMP to produce direct bronchodilation, while PDE4 inhibition in immune cells provides anti-inflammatory action; inhaled administration delivers high local lung concentrations while avoiding systemic gastrointestinal and psychiatric adverse effects',
              'PDE3 inhibition destroys beta-2 adrenergic receptors, while PDE4 inhibition stimulates muscarinic M3 receptors',
              'It acts as an oral tablet that is selectively absorbed by splenic lymphocytes',
              'It covalently cross-links pulmonary surfactant to prevent alveolar collapse in acute respiratory distress syndrome'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Ensifentrine is an inhaled dual inhibitor of both phosphodiesterase-3 (PDE3) and phosphodiesterase-4 (PDE4). In airway smooth muscle, PDE3 is the key enzyme breaking down cAMP and cGMP; inhibiting PDE3 directly promotes smooth muscle relaxation and bronchodilation. In inflammatory cells, PDE4 is the key cAMP-degrading enzyme; inhibiting PDE4 suppresses cytokine release and neutrophil activation, providing anti-inflammatory efficacy. By administering ensifentrine via nebulized inhalation, it achieves high therapeutic concentrations in the airways while keeping systemic exposure minimal, thereby avoiding the severe diarrhea, nausea, weight loss, and psychiatric adverse effects that plague oral PDE4 inhibitors like roflumilast.',
              'Incorrect: Ensifentrine causes bronchodilation and anti-inflammatory effects; it does not destroy beta-2 receptors or stimulate M3 receptors.',
              'Incorrect: Ensifentrine is administered via inhalation (nebulizer), not as an oral tablet.',
              'Incorrect: Ensifentrine is a small molecule PDE inhibitor, not a surfactant cross-linker.'
            ],
            overallExplanation: 'Ensifentrine (Ohtuvayre) represents a major therapeutic advance: a dual PDE3/PDE4 inhibitor administered by inhalation (nebulizer) for COPD. PDE3 inhibition relaxes airway smooth muscle (bronchodilator), while PDE4 inhibition calms leukocyte inflammation (anti-inflammatory). Inhalation targets the lung directly, bypassing the systemic GI toxicity and psychiatric liabilities of oral roflumilast.',
            highYieldPearl: 'Ensifentrine (Ohtuvayre): First-in-class INHALED dual PDE3/4 inhibitor. PDE3 = bronchodilation; PDE4 = anti-inflammatory. Inhaled route avoids roflumilast GI/psychiatric toxicity!',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 121-125'
          }
        ]
      }
    ]
  }
];

export function getDefaultRespiratoryBronchodilatorsModule(): ReviewModule {
  return {
    id: 'respiratory_bronchodilators_mcp2',
    examId: 'exam_1',
    examTitle: 'Exam 1: Renal & Respiratory Medicinal Chemistry',
    title: 'Respiratory Bronchodilators & PDE Inhibitors',
    subtitle: 'Adrenergic Beta-2 Agonists (SABAs, LABAs, Ultra-LABAs), Antimuscarinics (SAMAs, LAMAs), Methylxanthines, and Phosphodiesterase Inhibitors',
    course: 'Medicinal Chemistry & Pharmacology II',
    semester: 'Fall',
    code: 'MCP-2-02',
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    chemicalStructures: Object.values(BRONCHODILATOR_STRUCTURES),
    pages: respiratoryBronchodilatorsPages,
  };
}
