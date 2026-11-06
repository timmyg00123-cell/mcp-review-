import { ReviewModule, ReviewPage } from '../../types/reviewModule';
import { STEROID_AND_LEUKOTRIENE_STRUCTURES } from './exam1Structures';

export const respiratoryAntiinflammatoriesPages: ReviewPage[] = [
  // ---------------------------------------------------------------------------
  // PAGE 1: Glucocorticoid SAR & Nuclear Receptor Signaling (Questions 181 - 191)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 1,
    title: 'Glucocorticoid SAR & Nuclear Receptor Signaling',
    subtitle: '5-alpha-pregnane nucleus, 11-beta-OH essentiality, 11-beta-HSD1 prodrug bioactivation, ring-A flattening, C16 mineralocorticoid elimination, and C21 water-soluble emergency hemiesters',
    sections: [
      {
        sectionTitle: 'Glucocorticoid Receptor Activation & Core Steroid SAR',
        questions: [
          {
            id: 181,
            questionNumberLabel: 'Question 1',
            title: 'Glucocorticoid Receptor Signaling: Transactivation vs. Transrepression',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Glucocorticoids exert anti-inflammatory effects by diffusing across the plasma membrane and binding the cytosolic glucocorticoid receptor (GR). What dual genomic mechanisms follow ligand binding and nuclear translocation?',
            options: [
              'Homodimerization and binding to Glucocorticoid Response Elements (GREs) to stimulate transcription of anti-inflammatory proteins (transactivation, e.g., Annexin-1, I-kappa-B-alpha), while monomeric GR physically tethers and represses pro-inflammatory transcription factors NF-kappa-B and AP-1 (transrepression)',
              'Direct enzymatic cleavage of nuclear mRNA strands encoding interleukin receptors',
              'Direct covalent phosphorylation of ribosomal RNA preventing translation of all cellular proteins',
              'Opening of nuclear envelope potassium channels causing osmotic lysis of inflammatory cells'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Unliganded GR resides in the cytoplasm complexed with heat shock proteins (Hsp90, Hsp70). Lipophilic glucocorticoids diffuse across the membrane, bind GR, and trigger Hsp dissociation. Liganded GR translocates to the nucleus where it operates via two distinct mechanisms: (1) Transactivation: GR homodimers bind palindromic GRE sequences in DNA promoter regions, upregulating anti-inflammatory genes (Annexin-1 / lipocortin-1, I-kappa-B-alpha, beta-2 receptors); and (2) Transrepression: GR monomers physically bind to and cross-talk with pro-inflammatory transcription factors (NF-kappa-B and AP-1), preventing them from transcribing inflammatory cytokines (IL-1, IL-4, IL-5, IL-13, TNF-alpha), chemokines, and inducible enzymes (COX-2, iNOS). Transrepression accounts for the majority of their anti-inflammatory potency.',
              'Incorrect: GR is a nuclear receptor transcription factor, not an mRNA-cleaving ribonuclease.',
              'Incorrect: GR alters gene transcription, not non-specific ribosomal RNA phosphorylation.',
              'Incorrect: GR does not act as a nuclear ion channel.'
            ],
            overallExplanation: 'Glucocorticoids bind cytosolic GR, causing heat shock protein dissociation and nuclear translocation. In the nucleus, they act via: (1) Transactivation (homodimer binds GRE -> transcribes anti-inflammatory Annexin-1 and I-kappa-B-alpha); and (2) Transrepression (monomer physically binds NF-kappa-B and AP-1 -> shuts down pro-inflammatory cytokine and COX-2 transcription). Transrepression drives anti-inflammatory efficacy.',
            highYieldPearl: 'Glucocorticoid MOA: Transactivation (GRE homodimer -> Annexin-1 / I-kappa-B-alpha up) + Transrepression (GR monomer binds NF-kappa-B & AP-1 -> shuts off cytokine/COX-2 transcription).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 128-132'
          },
          {
            id: 182,
            questionNumberLabel: 'Question 2',
            title: 'Steroid Core Nucleus & Planar 5-alpha-Pregnane Stereochemistry',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'All natural and synthetic corticosteroids are built on the cyclopentanoperhydrophenanthrene (steroid) nucleus. What specific ring-junction stereochemistry creates the flat, planar 5-alpha-pregnane conformation required for glucocorticoid receptor binding?',
            options: [
              'All-trans ring junctions (A/B trans, B/C trans, C/D trans), creating a rigid, relatively flat planar steroid core with beta-oriented angular methyl groups at C10 and C13',
              'All-cis ring junctions, causing the steroid nucleus to fold into a spherical ball',
              'Alternating cis-trans-cis junctions that allow spontaneous chair-to-boat flipping at physiological temperature',
              'A completely aromatic planar triphenylene core lacking any aliphatic carbons'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Corticosteroids belong to the 21-carbon pregnane family. The cyclopentanoperhydrophenanthrene ring system features all-trans ring junctions (A/B trans via 5-alpha-H, B/C trans via 8-beta-H and 9-alpha-H, and C/D trans via 14-alpha-H). This all-trans configuration forces rings A, B, and C into rigid chair conformations, creating an extended, relatively flat planar structure. The angular methyl groups at C10 (C19) and C13 (C18) project upward (beta-face), while substituents that bind the hydrophobic pocket of the GR must project from the alpha- or beta-face in precise spatial orientations.',
              'Incorrect: All-cis ring junctions would produce a severely bent, non-planar steroid (as in bile acids / 5-beta-cholanic acids), which cannot fit into the narrow, planar GR ligand-binding pocket.',
              'Incorrect: Ring conformations are rigid; they do not undergo spontaneous chair-to-boat interconversion.',
              'Incorrect: Corticosteroids possess a partially unsaturated alicyclic core (4-ene-3-one), not a fully aromatic triphenylene ring.'
            ],
            overallExplanation: 'Glucocorticoids possess a 21-carbon pregnane core with all-trans ring junctions (5-alpha-pregnane stereochemistry). This all-trans geometry maintains a rigid, flat, planar scaffold that is stereochemically complementary to the narrow, hydrophobic ligand-binding domain (LBD) of the glucocorticoid receptor.',
            highYieldPearl: 'Steroid core: Cyclopentanoperhydrophenanthrene (21-carbon pregnane). All-trans ring junctions create a flat, planar scaffold that fits the GR ligand-binding domain.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 133-136'
          },
          {
            id: 183,
            questionNumberLabel: 'Question 3',
            title: 'Absolute Requirement for 11-beta-OH: Cortisone & Prednisone Bioactivation',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Cortisone and prednisone are clinically administered oral corticosteroids, yet neither has intrinsic binding affinity for the glucocorticoid receptor. What chemical functional group is strictly required at C11 for direct GR activation, and which enzyme activates these prodrugs in vivo?',
            options: [
              'An 11-beta-hydroxyl group (-OH) is strictly required; cortisone and prednisone possess an inactive C11-ketone (=O) and must be reduced by hepatic 11-beta-hydroxysteroid dehydrogenase type 1 (11-beta-HSD1) into active hydrocortisone and prednisolone',
              'An 11-alpha-methoxy group is required; activated by intestinal esterases',
              'An 11-thiol group is required; activated by renal sulfotransferases',
              'An 11-amino group is required; activated by pulmonary monoamine oxidases'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Direct activation of the glucocorticoid receptor strictly requires an 11-beta-hydroxyl group (-OH) to donate an essential hydrogen bond to Asn564 in the receptor binding pocket. In cortisone and prednisone, position 11 is an oxidized ketone (C=O); they have <1% intrinsic binding affinity for GR and function as inert prodrugs. In the liver, the enzyme 11-beta-hydroxysteroid dehydrogenase type 1 (11-beta-HSD1) reduces the 11-ketone to an 11-beta-hydroxyl, bioactivating cortisone into hydrocortisone and prednisone into prednisolone. In patients with severe hepatic failure/cirrhosis, 11-beta-HSD1 activity is impaired, so active 11-beta-OH steroids (hydrocortisone or prednisolone) must be administered directly.',
              'Incorrect: 11-alpha-methoxy groups are completely inactive; the orientation must be 11-beta and the group must be a hydroxyl.',
              'Incorrect: Position 11 requires a beta-hydroxyl, not a thiol.',
              'Incorrect: Corticosteroids do not contain an 11-amino group.'
            ],
            overallExplanation: 'The 11-beta-hydroxyl group is an absolute requirement for direct glucocorticoid receptor binding. Cortisone (11-keto) and prednisone (11-keto) are biologically inactive prodrugs that must be reduced by hepatic 11-beta-HSD1 to their active 11-beta-hydroxy forms (hydrocortisone and prednisolone). Conversely, in mineralocorticoid target tissues (kidney), 11-beta-HSD2 oxidizes active cortisol to inactive cortisone to prevent cortisol from overwhelming aldosterone receptors.',
            highYieldPearl: '11-beta-OH is strictly required for GR activity! Cortisone and Prednisone have an 11-ketone (inactive prodrugs) and must be bioactivated by hepatic 11-beta-HSD1 into Hydrocortisone and Prednisolone.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 137-140'
          },
          {
            id: 184,
            questionNumberLabel: 'Question 4',
            title: 'C1-C2 Double Bond (Delta-1-Dehydrogenation): Prednisolone SAR & Ring-A Flattening',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Introduction of a double bond between C1 and C2 in hydrocortisone yields prednisolone (Delta-1-hydrocortisone). What dual pharmacological benefits are produced by this structural modification?',
            options: [
              'Flattens ring A, increasing glucocorticoid anti-inflammatory potency approximately 4-fold while simultaneously reducing mineralocorticoid (salt-retaining) activity',
              'Converts the molecule into an irreversible inhibitor of cyclooxygenase-2 with zero glucocorticoid receptor binding',
              'Eliminates all hepatic metabolism, allowing 100% renal elimination unchanged',
              'Shifts the drug from nuclear receptor targeting to cell-surface Gs-coupled receptor activation'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Introduction of a C1-C2 double bond (Delta-1-dehydro modification) extends the conjugated pi-system of the 3-keto-4-ene moiety (producing a 1,4-diene-3-one system). This alters the geometry of ring A, flattening it from a chair conformation toward a planar geometry. This planar ring A binds with higher steric complementarity to the glucocorticoid receptor, boosting anti-inflammatory potency ~4-fold over hydrocortisone. Concurrently, this flattening decreases binding affinity for the mineralocorticoid receptor, markedly reducing sodium retention and edema.',
              'Incorrect: Prednisolone acts via the glucocorticoid receptor, not direct COX-2 inhibition.',
              'Incorrect: Prednisolone is extensively metabolized hepatically via glucuronidation and reduction.',
              'Incorrect: Prednisolone acts via the nuclear glucocorticoid receptor, not cell-surface GPCRs.'
            ],
            overallExplanation: 'The C1=C2 double bond (Delta-1-dehydrogenation, converting hydrocortisone to prednisolone) introduces conjugated diene-one unsaturation that flattens ring A. This alteration enhances glucocorticoid potency by ~4-fold and selectively diminishes mineralocorticoid (salt-retaining) activity, providing a superior therapeutic index for anti-inflammatory therapy.',
            highYieldPearl: 'C1-C2 double bond (Hydrocortisone -> Prednisolone) flattens ring A: increases glucocorticoid potency ~4x AND decreases mineralocorticoid salt/water retention!',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slide 141'
          },
          {
            id: 185,
            questionNumberLabel: 'Question 5',
            title: '9-alpha-Halogenation SAR: Fluorine Induction & 11-beta-OH Acidity',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Introduction of a 9-alpha-fluoro substituent (as in 9-alpha-fluorohydrocortisone / fludrocortisone) dramatically increases biological potency by ~10-fold. By what chemical mechanism does this electronegative halogen enhance glucocorticoid and mineralocorticoid activity?',
            options: [
              'Its strong electron-withdrawing inductive effect increases the acidity and hydrogen-bond donating capacity of the adjacent 11-beta-hydroxyl group, while protecting the 11-beta-OH from metabolic oxidation to an inactive 11-ketone',
              'It forms an irreversible covalent carbon-fluorine bond with the DNA backbone inside the nucleus',
              'It acts as a leaving group that cross-links heat shock protein 90 to the cytoplasm',
              'It converts the steroid into a volatile gas that rapidly diffuses across the pulmonary alveolar membrane'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Fluorine is the most electronegative element. When placed in the 9-alpha position, it exerts a strong electron-withdrawing inductive effect across the C9-C11 bond. This pulls electron density away from the oxygen of the adjacent 11-beta-hydroxyl group, increasing the partial positive charge on the hydrogen atom (making it a more potent hydrogen-bond donor to Asn564 in the receptor). Additionally, the electron-withdrawing effect hinders metabolic oxidation of the 11-beta-OH to the inactive 11-ketone by 11-beta-HSD enzymes, prolonging receptor occupancy and increasing potency ~10-fold.',
              'Incorrect: The C-F bond is extremely stable and does not form covalent bonds with DNA.',
              'Incorrect: Fluorine does not act as a leaving group in vivo.',
              'Incorrect: 9-alpha-fluorinated steroids are solid crystalline compounds, not volatile gases.'
            ],
            overallExplanation: 'The 9-alpha-fluoro substituent is strongly electronegative. It withdraws electrons inductively through the steroid backbone, increasing the hydrogen-bonding strength of the vital 11-beta-hydroxyl group and sterically/electronically protecting it against metabolic oxidation to an inactive 11-ketone. This amplifies both glucocorticoid and mineralocorticoid potencies ~10-fold.',
            highYieldPearl: '9-alpha-Fluorine: Electronegative pull increases H-bonding acidity of the adjacent 11-beta-OH and prevents metabolic oxidation -> boosts potency ~10-fold (both GR and MR)!',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slide 142'
          },
          {
            id: 186,
            questionNumberLabel: 'Question 6',
            title: 'C16 Substitutions: Complete Elimination of Mineralocorticoid Salt Retention',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'While 9-alpha-fluorination boosts anti-inflammatory potency, it also induces massive, life-threatening mineralocorticoid sodium retention (as seen in fludrocortisone). What structural modifications at position 16 completely abolish mineralocorticoid activity in dexamethasone and triamcinolone?',
            options: [
              'Addition of a 16-alpha-methyl group (dexamethasone), 16-beta-methyl group (betamethasone), or 16-alpha-hydroxyl group (triamcinolone), which introduces steric clash specifically in the mineralocorticoid receptor binding pocket without impairing GR binding',
              'Removal of all substituents at C16, rendering ring D fully aromatic',
              'Replacement of C16 with a nitrogen atom to form a pyridine heterocycle',
              'Addition of an acetylenic triple bond at C16 that covalently binds aldosterone synthase'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: In fludrocortisone, 9-alpha-fluorination increases mineralocorticoid (salt-retaining) potency >100-fold, making it unsuitable for systemic anti-inflammatory therapy. Medicinal chemists discovered that introducing a bulky or polar substituent at position 16—such as a 16-alpha-hydroxyl (triamcinolone), 16-alpha-methyl (dexamethasone), or 16-beta-methyl (betamethasone)—creates a steric clash that selectively prevents the steroid from fitting into the mineralocorticoid receptor (MR) binding pocket. Crucially, the glucocorticoid receptor (GR) binding cavity has an accommodating accessory pocket at this position. As a result, C16-substituted fluorinated steroids exhibit ultra-potent glucocorticoid activity with zero mineralocorticoid salt/water retention.',
              'Incorrect: Dexamethasone and triamcinolone retain an aliphatic cyclopentane D-ring.',
              'Incorrect: Position 16 remains a carbon atom.',
              'Incorrect: They do not contain acetylenic triple bonds or inhibit aldosterone synthase.'
            ],
            overallExplanation: 'To neutralize the severe mineralocorticoid side effects of 9-alpha-fluorination, chemists added substituents at C16: a 16-alpha-methyl (dexamethasone), 16-beta-methyl (betamethasone), or 16-alpha-OH (triamcinolone). These C16 groups sterically block binding to the mineralocorticoid receptor, completely eliminating sodium retention while preserving ultra-high glucocorticoid potency.',
            highYieldPearl: 'C16 modifications (16-alpha-methyl in dexamethasone, 16-alpha-OH in triamcinolone) sterically block the Mineralocorticoid Receptor -> ZERO salt retention with ultra-potent glucocorticoid action!',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 143-145'
          },
          {
            id: 187,
            questionNumberLabel: 'Question 7',
            title: 'Triamcinolone Acetonide: 16,17-Acetonide Ketal & Lipophilicity Optimization',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Triamcinolone free alcohol has limited topical and inhalational potency because its 16-alpha,17-alpha-dihydroxy motif is overly polar. How does acetonide ketal formation (triamcinolone acetonide) optimize its biopharmaceutical profile?',
            options: [
              'Reaction with acetone forms a cyclic 16-alpha,17-alpha-isopropylidenedioxy (acetonide) ketal, dramatically increasing lipophilicity (higher logP) and enhancing cell membrane penetration and local topical/airway potency by ~10-fold',
              'The acetonide ketal acts as an irreversible suicide inhibitor of airway Cytochrome P450 enzymes',
              'The acetonide ring converts the molecule into a quaternary ammonium salt that cannot cross the blood-brain barrier',
              'It hydrolyzes in water to release toxic formaldehyde gas that lyses eosinophils'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Triamcinolone possesses adjacent cis-hydroxyl groups at 16-alpha and 17-alpha. Condensation with acetone yields a cyclic ketal (16-alpha,17-alpha-acetonide). Masking these two polar, hydrophilic hydroxyl groups with a lipophilic dimethyl-dioxolane ring significantly increases the octanol-water partition coefficient (logP). This higher lipophilicity enables the drug to penetrate epithelial cell membranes and mucosal barriers much more effectively, increasing local topical and inhalational anti-inflammatory potency by approximately 10-fold compared to triamcinolone base.',
              'Incorrect: Acetonide formation is non-covalent with respect to enzymes and does not inhibit CYP450.',
              'Incorrect: The acetonide is an uncharged neutral ketal, not a quaternary ammonium.',
              'Incorrect: The acetonide decomposes into acetone and steroid, not formaldehyde.'
            ],
            overallExplanation: 'Triamcinolone acetonide masks the two hydrophilic hydroxyl groups at C16 and C17 as an acetone ketal (16,17-acetonide). This increases lipophilicity, improving membrane permeation and local airway residence time, boosting topical anti-inflammatory potency ~10-fold over triamcinolone free alcohol.',
            highYieldPearl: 'Triamcinolone acetonide: Cyclic 16,17-acetonide ketal masks polar hydroxyls -> increases lipophilicity and tissue penetration -> ~10x greater topical/inhalational potency.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slide 146'
          },
          {
            id: 188,
            questionNumberLabel: 'Question 8',
            title: 'Dexamethasone vs. Betamethasone: C16 Stereochemical Epimers',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Dexamethasone and betamethasone are positional stereoisomers with identical molecular weights and formula (C22H29FO5). What is the exact stereochemical difference between these two landmark glucocorticoids?',
            options: [
              'They are C16 epimers: Dexamethasone has a 16-alpha-methyl group (pointing down), whereas Betamethasone has a 16-beta-methyl group (pointing up)',
              'Dexamethasone has a 9-alpha-fluoro group, whereas betamethasone has an 11-beta-chloro group',
              'Dexamethasone contains a C1-C2 double bond, whereas betamethasone is completely saturated at ring A',
              'Dexamethasone is an active 11-beta-alcohol, whereas betamethasone is an inactive 11-ketone prodrug'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Dexamethasone and betamethasone are epimers differing solely in the configuration of the methyl group at carbon 16. In dexamethasone, the 16-methyl group is in the alpha-orientation (16-alpha-methyl, projecting below the plane of the steroid ring). In betamethasone, the 16-methyl group is in the beta-orientation (16-beta-methyl, projecting above the plane of the steroid ring). Both configurations effectively abolish mineralocorticoid activity while conferring ultra-potent glucocorticoid activity (~25-30 times more potent than hydrocortisone).',
              'Incorrect: Both drugs possess identical 9-alpha-fluoro and 11-beta-hydroxyl groups.',
              'Incorrect: Both drugs contain the Delta-1-dehydro (C1=C2) double bond in ring A.',
              'Incorrect: Both drugs contain active 11-beta-hydroxyl groups; neither is an 11-ketone.'
            ],
            overallExplanation: 'Dexamethasone (16-alpha-methyl) and Betamethasone (16-beta-methyl) are C16 diastereomeric epimers. Both possess the 1,4-diene-3-one ring A, 9-alpha-fluoro, and 11-beta-hydroxyl features. The spatial orientation of the C16 methyl group (alpha vs beta) is their only structural difference; both exhibit ~30x the anti-inflammatory potency of cortisol with zero salt retention.',
            highYieldPearl: 'Dexamethasone vs Betamethasone: C16 epimers! Dexamethasone = 16-alpha-methyl; Betamethasone = 16-beta-methyl. Both have zero mineralocorticoid activity.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slide 147'
          },
          {
            id: 189,
            questionNumberLabel: 'Question 9',
            title: 'C21 Water-Soluble Hemiesters: Emergency Formulations for Status Asthmaticus',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Hydrocortisone and methylprednisolone are poorly water-soluble steroids (<0.3 mg/mL), precluding rapid concentrated intravenous injection. How does esterification at C21 with sodium succinate (Solu-Cortef, Solu-Medrol) produce water-soluble emergency formulations for status asthmaticus?',
            options: [
              'It introduces a dicarboxylic acid hemiester (succinate) whose free terminal carboxylate is converted into a sodium salt, imparting full water solubility; following IV injection, endogenous plasma esterases rapidly cleave the ester bond to release free active steroid',
              'It converts the steroid into a covalent cyclodextrin complex that permanently bypasses the liver',
              'It replaces the steroid ring with a water-soluble polyether surfactant',
              'It forms an irreversible quaternary ammonium cation that targets pulmonary beta-2 receptors'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Corticosteroids have a primary alcohol at C21. Reacting the C21-OH with succinic anhydride forms a C21-hemisuccinate ester containing a free terminal carboxylic acid (-O-CO-CH2CH2-COOH). Converting this carboxylate into a sodium salt (-COO- Na+) creates an ionized, highly water-soluble prodrug (>500 mg/mL solubility) suitable for rapid IV bolus injection (Solu-Cortef, Solu-Medrol). In the bloodstream, endogenous non-specific carboxylesterases rapidly cleave the ester linkage (in vivo conversion t1/2 < 5-10 minutes), liberating free active hydrocortisone or methylprednisolone to treat life-threatening status asthmaticus and anaphylaxis.',
              'Incorrect: Succinate hemiesters are simple prodrugs, not covalent cyclodextrin complexes.',
              'Incorrect: The steroid nucleus is intact and unchanged; only the C21 alcohol is esterified.',
              'Incorrect: Succinate hemiesters are negative carboxylate anions, not quaternary ammonium cations.'
            ],
            overallExplanation: 'To formulate steroids for emergency IV administration in acute severe asthma (status asthmaticus), the C21-hydroxyl is esterified with succinic acid or phosphoric acid to create hemiester prodrugs (e.g., hydrocortisone sodium succinate [Solu-Cortef], methylprednisolone sodium succinate [Solu-Medrol]). These salts dissolve freely in water and are rapidly cleaved by plasma esterases in vivo to release the active steroid.',
            highYieldPearl: 'Emergency IV Steroids: C21-sodium succinate (Solu-Medrol, Solu-Cortef) or phosphate hemiesters provide high aqueous solubility -> cleaved by plasma esterases to active steroid in minutes!',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 148-151'
          },
          {
            id: 190,
            questionNumberLabel: 'Question 10',
            title: 'Inhaled Corticosteroid (ICS) Hepatic First-Pass Inactivation & Systemic Gating',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'When a patient inhales a corticosteroid from an MDI or DPI, approximately 80–90% of the actuated dose is inadvertently swallowed and absorbed through the gastrointestinal tract. What pharmacokinetic property prevents this swallowed fraction from causing systemic Cushingoid toxicity and HPA-axis suppression?',
            options: [
              'Extensive, near-complete (>90–99%) hepatic first-pass metabolism by CYP3A4 to inactive metabolites, ensuring systemic oral bioavailability is <1%',
              'Irreversible binding of the swallowed steroid to stomach mucin, causing 100% excretion in feces without intestinal absorption',
              'Gastric acid decarboxylation that converts the steroid into an inactive gaseous hydrocarbon',
              'Active transport by intestinal P-glycoprotein directly into the spleen'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: In modern inhaled corticosteroids (fluticasone propionate, fluticasone furoate, ciclesonide, mometasone furoate), the molecules are deliberately designed to undergo near-complete (>90-99%) first-pass hepatic metabolism by CYP3A4 into inactive metabolites upon absorption from the GI tract. Consequently, the oral bioavailability of the swallowed fraction is <1%. This ensures that therapeutic anti-inflammatory action is restricted to the fraction deposited in the bronchial tree, protecting the patient from systemic corticosteroid toxicities such as hypothalamic-pituitary-adrenal (HPA) axis suppression, growth retardation in children, osteoporosis, and Cushing\'s syndrome.',
              'Incorrect: Swallowed ICS is absorbed by the intestines; its safety relies on hepatic first-pass clearance, not mucin binding.',
              'Incorrect: Steroids do not undergo gastric decarboxylation into gaseous hydrocarbons.',
              'Incorrect: Clearance is mediated by hepatic CYP3A4, not transport to the spleen.'
            ],
            overallExplanation: 'Inhaled corticosteroids achieve a high therapeutic index because swallowed drug (80–90% of the dose) undergoes near-complete (>90–99%) hepatic first-pass oxidative metabolism (primarily by CYP3A4), yielding oral bioavailabilities <1%. Systemic adverse effects arise primarily from the fraction absorbed through the lungs, which bypasses the portal circulation.',
            highYieldPearl: 'ICS Therapeutic Index: Swallowed fraction (80–90%) undergoes >90–99% hepatic first-pass clearance via CYP3A4 (oral bioavailability <1%), preventing systemic Cushingoid toxicity and HPA suppression.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 152-155'
          },
          {
            id: 191,
            questionNumberLabel: 'Question 11',
            title: 'Local ICS Adverse Effects: Oropharyngeal Candidiasis & Dysphonia Prevention',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'A 24-year-old asthmatic patient using an inhaled corticosteroid twice daily develops white curd-like plaques on the buccal mucosa and tongue that bleed when scraped, accompanied by hoarseness of voice (dysphonia). What is the mechanism of these local complications, and how are they prevented?',
            options: [
              'Local immunosuppression in the oral cavity predisposing to Candida albicans overgrowth, and steroid-induced laryngeal myopathy of vocal cords; prevented by using a valved holding chamber (spacer) and rinsing the mouth with water and spitting after each dose',
              'Direct mucosal chemical burn by propellant gas; prevented by gargling with hot saline',
              'Systemic agranulocytosis; prevented by prophylactic oral fluconazole therapy',
              'Vocal cord paralysis caused by recurrent laryngeal nerve demyelination; prevented by switching to oral prednisone'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Inhaled corticosteroids deposit a significant fraction of aerosol droplets in the oropharynx and larynx. In the mouth, local immunosuppression impairs mucosal cell-mediated immunity, permitting opportunistic overgrowth of Candida albicans (oropharyngeal candidiasis / oral thrush). In the larynx, local steroid deposition causes steroid-induced myopathy and weakness of the adductor muscles of the vocal cords, producing hoarseness and dysphonia. Both complications are significantly reduced by: (1) Using a spacer or valved holding chamber (which traps large aerosol droplets and allows only respirable fine particles to enter the lungs); and (2) Rinsing the mouth thoroughly with water and spitting (never swallowing) immediately after inhalation.',
              'Incorrect: Modern HFAs do not cause chemical mucosal burns.',
              'Incorrect: Candidiasis is a local mucosal issue, not systemic agranulocytosis.',
              'Incorrect: Dysphonia is due to local laryngeal myopathy, not nerve demyelination, and switching to oral prednisone would drastically increase systemic toxicity.'
            ],
            overallExplanation: 'Local adverse effects of ICS: (1) Oropharyngeal candidiasis (oral thrush) from local mucosal immunosuppression; and (2) Dysphonia (hoarseness) from local steroid myopathy of vocal cord muscles. Both are prevented by utilizing a spacer device with MDIs and having the patient rinse their mouth with water and spit after each administration.',
            highYieldPearl: 'ICS local side effects: Oral candidiasis (thrush) & dysphonia (hoarseness). Prevention: Use a spacer + rinse mouth with water and spit after every inhalation!',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slide 156'
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 2: Inhaled Corticosteroids (ICS) & "Soft Steroid" Design (Questions 192 - 202)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 2,
    title: 'Inhaled Corticosteroids (ICS) & "Soft Steroid" Design',
    subtitle: 'Pro-soft-drug ciclesonide activation, budesonide intracellular lipid conjugation, fluticasone S-fluoromethyl carbothioates, mometasone furoate, and CYP3A4 drug interactions',
    sections: [
      {
        sectionTitle: 'Inhaled Soft Steroids: Targeted Pulmonary Anti-Inflammatory Design',
        questions: [
          {
            id: 192,
            questionNumberLabel: 'Question 12',
            title: 'Soft Drug Design Principles in Inhaled Corticosteroids',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'In steroid medicinal chemistry, what defines a "soft steroid" or "pro-soft-drug", and what therapeutic goal does this design achieve?',
            options: [
              'A compound engineered to exert potent local pharmacological anti-inflammatory activity at the target pulmonary tissue, while being rapidly and predictably converted into an inert, non-toxic metabolite upon entering systemic circulation, maximizing the therapeutic index',
              'A steroid that is physically liquid at body temperature, allowing direct injection into bronchioles',
              'A steroid that contains zero fluorine atoms, completely avoiding renal excretion',
              'A steroid that binds irreversibly to plasma albumin, preventing all cellular uptake'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: A soft drug (or soft steroid) is an active therapeutic agent engineered with a metabolically labile functional group that undergoes rapid, predictable, single-step enzymatic inactivation to a non-toxic, inactive metabolite as soon as it leaves the target site and enters systemic circulation. A pro-soft-drug (e.g., ciclesonide) is an inactive prodrug that is selectively bioactivated by enzymes in the target tissue (lung) to the active species, which is subsequently inactivated in the bloodstream. This design maximizes pulmonary anti-inflammatory efficacy while keeping systemic side effects at near-zero levels.',
              'Incorrect: Soft drugs are defined by metabolic inactivation principles, not physical melting points.',
              'Incorrect: Many soft steroids contain fluorine (e.g., fluticasone); lack of fluorine is not the definition.',
              'Incorrect: Soft drugs must enter target cells to exert activity; they are not designed to be trapped in plasma.'
            ],
            overallExplanation: 'Soft drug design in respiratory medicine creates agents that possess potent, prolonged local anti-inflammatory activity in the lung, but undergo ultra-rapid enzymatic inactivation (via esterases or CYP3A4) to inert carboxylic acid metabolites upon escaping into the systemic bloodstream, virtually eliminating systemic steroid toxicity.',
            highYieldPearl: 'Soft Steroid Design: High local anti-inflammatory potency in the lung + ultra-rapid systemic metabolic inactivation to inert metabolites -> maximum therapeutic index.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 160-163'
          },
          {
            id: 193,
            questionNumberLabel: 'Question 13',
            title: 'Ciclesonide (Alvesco): On-Site Pulmonary Activation & Oropharyngeal Sparing',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Ciclesonide (Alvesco) is a pro-soft-drug. How does its on-site enzymatic bioactivation in the lung explain its remarkably low incidence of oropharyngeal candidiasis and dysphonia compared to older ICS?',
            options: [
              'It is administered as an inactive C21-isobutyrate ester prodrug that is selectively cleaved by endogenous esterases in lower airway bronchial epithelial cells to active des-ciclesonide; because oropharyngeal mucosa has low esterase activity, deposited drug remains inactive, preventing oral thrush and dysphonia',
              'It acts as an oral antifungal agent that directly lyses Candida albicans cell walls',
              'It is delivered as an enteric-coated capsule that only dissolves in pulmonary surfactant',
              'It contains an alkaline buffer that permanently sterilizes the oral cavity'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Ciclesonide is a pro-soft-drug. In its delivered form, it is esterified at C21 with an isobutyrate ester and has negligible (<1%) affinity for the glucocorticoid receptor. When inhaled into the lower respiratory tract, intracellular carboxylesterases in bronchial epithelial cells rapidly cleave the C21-isobutyrate, releasing des-ciclesonide (des-CIC), which has ~100-fold higher affinity for GR and exerts potent anti-inflammatory activity. Crucially, the oropharyngeal mucosa and larynx possess very low esterase activity, so drug deposited in the mouth and throat remains largely in the inactive prodrug form, dramatically reducing the incidence of local oropharyngeal candidiasis and hoarseness. Any des-CIC entering the systemic circulation is >99% protein-bound and rapidly cleared by CYP3A4.',
              'Incorrect: Ciclesonide is not an antifungal agent.',
              'Incorrect: Ciclesonide is an aerosol inhaler, not an enteric capsule.',
              'Incorrect: Ciclesonide does not contain sterilizing alkaline buffers.'
            ],
            overallExplanation: 'Ciclesonide is an on-site activated pro-soft-drug. Delivered as an inactive C21-isobutyrate ester, it requires cleavage by pulmonary carboxylesterases to yield active des-ciclesonide (100x higher GR affinity). Because oropharyngeal and laryngeal tissues have minimal esterase activity, deposited drug remains inactive, virtually eliminating oral candidiasis and dysphonia.',
            highYieldPearl: 'Ciclesonide: Inactive C21-isobutyrate prodrug activated by PULMONARY esterases to active des-ciclesonide. Low oropharyngeal activation = near-zero oral thrush and dysphonia!',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 164-167'
          },
          {
            id: 194,
            questionNumberLabel: 'Question 14',
            title: 'Budesonide (Pulmicort): 16,17-Acetal Stereochemistry, Intracellular Lipid Conjugation & Pregnancy Safety',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Budesonide is a non-halogenated glucocorticoid featuring an asymmetric 16,17-butylaldehyde acetal. What unique intracellular biochemical mechanism extends its pulmonary residence time, and what is its clinical standing in pregnancy?',
            options: [
              'Undergoes reversible intracellular fatty acid esterification at C21 (forming lipophilic oleate and palmitate conjugates) that acts as a pulmonary depot; recognized as the preferred ICS in pregnancy with extensive safety data (FDA Category B)',
              'Forms an irreversible covalent bond with airway elastin fibers; strictly contraindicated in pregnancy due to neural tube defects',
              'Undergoes cyclization into an active mineralocorticoid that prevents maternal hypotension; Category X',
              'Is completely resistant to hepatic CYP3A4 metabolism, circulating for 9 months in plasma'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Budesonide possesses a unique pharmacokinetic retention mechanism: inside airway cells, the C21-hydroxyl group undergoes reversible enzymatic esterification with endogenous long-chain fatty acids (primarily oleic acid and palmitic acid). These highly lipophilic budesonide-fatty acid conjugates are insoluble in water and cannot diffuse out of the cell, forming an intracellular lipid depot. As free budesonide is cleared, intracellular lipases slowly hydrolyze the conjugates back into free, active budesonide, providing prolonged local anti-inflammatory action with once- or twice-daily dosing. Furthermore, budesonide possesses the most extensive human pregnancy safety data among all inhaled corticosteroids, historically holding FDA Pregnancy Category B and remaining the preferred first-line ICS in pregnant asthmatics.',
              'Incorrect: Budesonide binds reversibly and is the safest, preferred ICS in pregnancy, not contraindicated.',
              'Incorrect: Budesonide has minimal mineralocorticoid activity and is Category B, not X.',
              'Incorrect: Budesonide is rapidly metabolized by hepatic CYP3A4 (systemic clearance is rapid).'
            ],
            overallExplanation: 'Budesonide (Pulmicort) features a 16,17-butylaldehyde acetal (22R and 22S epimers). Its unique feature is intracellular lipid conjugation: cellular acyltransferases attach fatty acids (oleate, palmitate) to the C21-OH, creating a lipophilic intracellular depot that slowly hydrolyzes back to active budesonide. Budesonide is the preferred ICS in pregnancy due to extensive human safety data.',
            highYieldPearl: 'Budesonide: Intracellular fatty acid esterification (C21 lipid depot) provides prolonged pulmonary retention. Preferred ICS in pregnancy (extensive safety data, Category B).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 168-172'
          },
          {
            id: 195,
            questionNumberLabel: 'Question 15',
            title: 'Fluticasone Propionate: 17-beta-S-Fluoromethyl Carbothioate SAR & CYP3A4 Inactivation',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Fluticasone propionate incorporates a unique 17-beta-carbothioate ester (-CO-S-CH2F) and a 17-alpha-propionate. What is the metabolic fate of the swallowed fraction of fluticasone propionate, and what is its oral bioavailability?',
            options: [
              'Rapid, quantitative first-pass hepatic oxidative hydrolysis of the S-fluoromethyl carbothioate by CYP3A4 into an inactive 17-beta-carboxylic acid metabolite; resulting in oral bioavailability of <1%',
              'Complete resistance to all hepatic enzymes, resulting in 100% oral bioavailability',
              'Non-enzymatic spontaneous cleavage into active dexamethasone in the stomach',
              'Selective absorption across the blood-brain barrier via organic anion transporter 1'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Fluticasone propionate features an S-fluoromethyl carbothioate ester at C17-beta (-C(=O)-S-CH2F). This unique functional group imparts high lipophilicity (logP ~4.0) and ultra-high glucocorticoid receptor binding affinity (~18 times higher than dexamethasone). When swallowed, it undergoes extensive, rapid, and quantitative first-pass hepatic metabolism catalyzed primarily by CYP3A4: the S-fluoromethyl carbothioate is oxidized and hydrolyzed to an inert 17-beta-carboxylic acid metabolite (GR affinity <1/2000th of fluticasone). Consequently, systemic oral bioavailability is <1%, ensuring that swallowed drug does not produce systemic toxicity.',
              'Incorrect: Fluticasone propionate is extensively metabolized by CYP3A4, resulting in <1% bioavailability, not 100%.',
              'Incorrect: It is metabolized into an inactive 17-carboxylic acid, not dexamethasone.',
              'Incorrect: It does not cross the BBB or target OAT1.'
            ],
            overallExplanation: 'Fluticasone propionate contains a 17-beta-S-fluoromethyl carbothioate ester (-CO-S-CH2F). This moiety provides high lipophilicity and 18x greater GR affinity than dexamethasone. Swallowed drug has <1% oral bioavailability because hepatic CYP3A4 quantitatively hydrolyzes the carbothioate into an inert 17-beta-carboxylic acid metabolite.',
            highYieldPearl: 'Fluticasone propionate: 17-beta-S-fluoromethyl carbothioate (-CO-S-CH2F). Rapidly converted by hepatic CYP3A4 into an INERT 17-beta-carboxylic acid -> oral bioavailability <1%!',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 173-176'
          },
          {
            id: 196,
            questionNumberLabel: 'Question 16',
            title: 'Fluticasone Furoate: 17-alpha-Furoate Ester & Once-Daily Receptor Residence Time',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Fluticasone furoate differs from fluticasone propionate by substituting the 17-alpha-propionate ester with a lipophilic 17-alpha-furoate ester. What pharmacological advantage does this confer, enabling once-daily administration?',
            options: [
              'Significantly greater lipophilicity and deeper occupancy of the GR lipophilic 17-alpha pocket, conferring higher receptor binding affinity and a much slower receptor dissociation rate (residence half-life >24 hours)',
              'Converts the drug into a water-soluble salt that is rapidly excreted in the urine within 2 hours',
              'Allows the drug to cross the blood-brain barrier to stimulate pituitary ACTH secretion',
              'Replaces glucocorticoid activity with selective beta-2 adrenoceptor agonism'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Fluticasone furoate replaces the C17-alpha propionate ester with a 2-furoate (furan-2-carboxylate) heterocyclic ester. The bulky, planar, lipophilic furoate group fits more deeply and tightly into the 17-alpha subpocket of the glucocorticoid receptor ligand-binding domain. This produces significantly higher receptor binding affinity (approximately 1.7 times higher than fluticasone propionate and ~30 times higher than dexamethasone) and an exceptionally slow dissociation rate from GR (receptor residence half-life >24 hours). This slow off-rate provides sustained 24-hour pulmonary anti-inflammatory action, enabling true once-daily dosing (Arnuity Ellipta, Breo Ellipta, Trelegy Ellipta).',
              'Incorrect: Fluticasone furoate is highly lipophilic, not water-soluble, and has extended residence.',
              'Incorrect: It does not stimulate ACTH; all glucocorticoids suppress ACTH if systemic.',
              'Incorrect: It is a pure glucocorticoid, not a beta-2 agonist.'
            ],
            overallExplanation: 'Fluticasone furoate features a 17-alpha-furoate ester in place of the propionate ester. The furoate ring provides superior steric and hydrophobic fit in the GR binding pocket, resulting in higher affinity and an exceptionally slow off-rate (dissociation t1/2 >24 hours). This supports once-daily dosing in Ellipta devices.',
            highYieldPearl: 'Fluticasone furoate: 17-alpha-furoate ester provides deeper GR pocket fit and exceptionally slow receptor off-rate (>24 hr) -> true ONCE-DAILY dosing (Breo / Trelegy).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 177-179'
          },
          {
            id: 197,
            questionNumberLabel: 'Question 17',
            title: 'Mometasone Furoate (Asmanex): 9,21-Dichloro Substitution & Lipophilic Furoate Ester',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Mometasone furoate (Asmanex) is a high-potency inhaled corticosteroid. What two unique structural halogen and ester features characterize mometasone furoate, and what is its oral bioavailability?',
            options: [
              'A 9-alpha,21-dichloro substitution pattern (chlorine replacing the traditional C21-hydroxyl) combined with a lipophilic 17-alpha-furoate ester; resulting in oral bioavailability of <1%',
              'A 9-alpha-bromo, 21-iodo substitution with an acetate ester; oral bioavailability 85%',
              'A non-halogenated steroid core with a C21-succinate salt; oral bioavailability 50%',
              'A cyclopentyl ring replacing ring A with a carbothioate; oral bioavailability 100%'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Mometasone furoate features two key structural hallmarks: (1) A unique 9-alpha,21-dichloro substitution pattern—notably, chlorine is attached directly to C21, completely replacing the traditional primary C21-hydroxyl group found in almost all other corticosteroids; and (2) A bulky, lipophilic 17-alpha-furoate ester. The replacement of the polar C21-OH with a lipophilic chlorine atom, combined with the 17-furoate group, imparts extreme lipophilicity and high GR affinity (~12 times higher than dexamethasone). When swallowed, it undergoes extensive first-pass hepatic metabolism, resulting in negligible oral bioavailability (<1%).',
              'Incorrect: Mometasone contains chlorines, not bromines or iodines, and bioavailability is <1%, not 85%.',
              'Incorrect: Mometasone is dichlorinated, not non-halogenated.',
              'Incorrect: Mometasone retains the intact 4-ring steroid nucleus.'
            ],
            overallExplanation: 'Mometasone furoate (Asmanex) is distinguished by a 9-alpha,21-dichloro substitution (C21 chlorine replaces the polar C21-OH) and a 17-alpha-furoate ester. This creates high lipophilicity, strong tissue binding, and high GR affinity with <1% oral bioavailability.',
            highYieldPearl: 'Mometasone furoate: 9-alpha,21-dichloro (C21-Cl replaces C21-OH!) + 17-alpha-furoate ester. High lipophilicity and potency; <1% oral bioavailability.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 180-182'
          },
          {
            id: 198,
            questionNumberLabel: 'Question 18',
            title: 'Beclomethasone Dipropionate (QVAR): Diester Prodrug Activation to 17-BMP',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Beclomethasone dipropionate (QVAR) is an inhaled corticosteroid formulated as an extra-fine solution aerosol. What enzymatic transformation occurs in the lung to activate this diester prodrug?',
            options: [
              'Pulmonary carboxylesterases selectively hydrolyze the C21-propionate ester to generate beclomethasone-17-monopropionate (17-BMP), which is the active metabolite possessing ~30-fold higher GR affinity than parent drug',
              'Pulmonary esterases hydrolyze the 17-propionate to generate 21-monopropionate, which is completely inactive',
              'Cytochrome P450 1A2 oxidizes the C11 alcohol into an active ketone',
              'Alveolar macrophages reduce ring A to form a saturated pregnanediol'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Beclomethasone dipropionate (BDP) is a 17-alpha,21-dipropionate diester prodrug. Upon inhalation, endogenous carboxylesterases in pulmonary tissue rapidly and selectively cleave the primary ester at C21, liberating beclomethasone-17-monopropionate (17-BMP). 17-BMP is the true active species, exhibiting ~30-fold higher binding affinity for the glucocorticoid receptor than parent BDP. Subsequent slower hydrolysis cleaves the 17-propionate to form beclomethasone free alcohol, which has very low activity and is rapidly eliminated.',
              'Incorrect: Cleavage occurs rapidly at C21 to yield 17-BMP, not at C17.',
              'Incorrect: Oxidation of C11 produces an inactive 11-ketone, not an active species.',
              'Incorrect: Reduction of ring A terminates steroid activity.'
            ],
            overallExplanation: 'Beclomethasone dipropionate (BDP) is a diester prodrug. In pulmonary tissue, carboxylesterases cleave the C21 ester, generating beclomethasone-17-monopropionate (17-BMP), which possesses ~30-fold higher affinity for GR than parent BDP. QVAR uses an HFA solution aerosol with extra-fine particles (MMAD ~1.1 mcm) that deposit deep into peripheral small airways.',
            highYieldPearl: 'Beclomethasone dipropionate (BDP): Diester prodrug. Cleaved by pulmonary esterases at C21 to active beclomethasone-17-monopropionate (17-BMP, ~30x higher GR affinity).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 183-185'
          },
          {
            id: 199,
            questionNumberLabel: 'Question 19',
            title: 'Flunisolide SAR & 6-beta-Hydroxylation Inactivation',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Flunisolide is an inhaled corticosteroid containing a 6-alpha-fluoro substituent and a 16,17-acetonide ketal. What hepatic metabolic pathway mediates its rapid systemic inactivation?',
            options: [
              'Rapid hepatic CYP-mediated 6-beta-hydroxylation to 6-beta-hydroxyflunisolide, which has >300-fold lower glucocorticoid receptor affinity, followed by rapid glucuronide conjugation (half-life ~1.6 hours)',
              'Spontaneous non-enzymatic loss of the acetonide ring in gastric acid to form an insoluble wax',
              'Renal tubular secretion unchanged without any hepatic metabolism',
              'Direct reduction by circulating hemoglobin to form elemental fluorine gas'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Flunisolide features a 6-alpha-fluoro group, an 11-beta-OH, and a 16,17-acetonide ketal. It is rapidly absorbed from the lung and gut but undergoes rapid hepatic first-pass metabolism (plasma half-life ~1.6 hours) primarily via CYP-mediated oxidation to 6-beta-hydroxyflunisolide. This metabolite has negligible (>300-fold lower) glucocorticoid receptor affinity and is rapidly conjugated and cleared, limiting systemic steroid exposure.',
              'Incorrect: Flunisolide is chemically stable in gastric acid and does not form a wax.',
              'Incorrect: It is cleared hepatically, not renally unchanged.',
              'Incorrect: It does not generate elemental fluorine gas.'
            ],
            overallExplanation: 'Flunisolide contains a 6-alpha-fluoro group and 16,17-acetonide. It undergoes rapid hepatic transformation to 6-beta-hydroxyflunisolide, which is pharmacologically inert (<1/300th potency), ensuring a short systemic half-life (~1.6 hours) and low systemic toxicity.',
            highYieldPearl: 'Flunisolide: 6-alpha-fluoro + 16,17-acetonide. Rapid hepatic first-pass clearance to inert 6-beta-hydroxyflunisolide (t1/2 ~1.6 hr).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slide 186'
          },
          {
            id: 200,
            questionNumberLabel: 'Question 20',
            title: 'CYP3A4 Drug Interactions with Inhaled Corticosteroids: Ritonavir & Iatrogenic Cushing\'s',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'A 42-year-old HIV-positive patient well-controlled on inhaled fluticasone propionate (220 mcg BID) is started on an antiretroviral regimen containing ritonavir (or cobicistat). Over the next 8 weeks, the patient develops moon facies, a buffalo hump, central adiposity, severe hypertension, and profound morning cortisol suppression (<1 mcg/dL). What pharmacokinetic drug interaction caused this iatrogenic Cushing\'s syndrome?',
            options: [
              'Ritonavir is a potent, irreversible mechanism-based inhibitor of CYP3A4; it completely blocked the hepatic first-pass clearance of fluticasone, causing massive systemic steroid accumulation, profound HPA-axis shutdown, and full-blown Cushing\'s syndrome',
              'Ritonavir displaces fluticasone from plasma albumin, causing acute renal tubular necrosis',
              'Ritonavir induces Cytochrome P450 1A2, accelerating the conversion of fluticasone into cortisol',
              'Fluticasone and ritonavir form a covalent complex that stimulates adrenal steroidogenesis'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Modern inhaled corticosteroids (especially fluticasone propionate, fluticasone furoate, and budesonide) rely almost entirely on hepatic CYP3A4 for their extensive first-pass metabolic clearance. Ritonavir (and cobicistat) are extremely potent, mechanism-based inhibitors of CYP3A4. Co-administration dramatically decreases fluticasone clearance, increasing systemic fluticasone AUC by >300-fold. This massive accumulation causes severe systemic glucocorticoid excess, producing full-blown iatrogenic Cushing\'s syndrome (central obesity, facial plethora, buffalo hump, hypertension, hyperglycemia) and complete suppression of the hypothalamic-pituitary-adrenal (HPA) axis (secondary adrenal insufficiency upon steroid withdrawal). If an ICS is mandatory in patients on strong CYP3A4 inhibitors, beclomethasone dipropionate is the preferred agent because its clearance relies primarily on esterases rather than CYP3A4.',
              'Incorrect: The interaction is mediated by CYP3A4 inhibition, not albumin displacement.',
              'Incorrect: Ritonavir is an inhibitor, not an inducer, and fluticasone is not converted to cortisol.',
              'Incorrect: Ritonavir suppresses, rather than stimulates, endogenous adrenal steroidogenesis via negative feedback on ACTH.'
            ],
            overallExplanation: 'Inhaled corticosteroids (fluticasone, budesonide, mometasone) are cleared by hepatic CYP3A4. Co-administration of potent CYP3A4 inhibitors (ritonavir, cobicistat, itraconazole, clarithromycin) blocks clearance, driving systemic steroid concentrations up to toxic levels and causing iatrogenic Cushing\'s syndrome and secondary adrenal insufficiency. Beclomethasone is preferred if co-administration is unavoidable because it is cleared by esterases.',
            highYieldPearl: 'CYP3A4 inhibitor (Ritonavir, Cobicistat, Itraconazole) + ICS (Fluticasone, Budesonide) -> severe CYP3A4 blockade -> iatrogenic Cushing\'s syndrome & adrenal insufficiency! Beclomethasone is safer (esterase clearance).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 187-190'
          },
          {
            id: 201,
            questionNumberLabel: 'Question 21',
            title: 'ICS + LABA Molecular Synergy: Receptor Upregulation & Translocation Priming',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Fixed-dose combination inhalers containing an ICS and a LABA (e.g., fluticasone/salmeterol [Advair], budesonide/formoterol [Symbicort]) exhibit profound therapeutic synergy. What reciprocal molecular cross-talk between the glucocorticoid receptor and beta-2 adrenergic receptor explains this synergy?',
            options: [
              'Corticosteroids bind GREs to increase gene transcription of beta-2 adrenergic receptors (preventing beta-2 receptor down-regulation and tolerance caused by chronic LABA use), while beta-2 agonists activate PKA, which phosphorylates and primes the glucocorticoid receptor, facilitating nuclear translocation at lower steroid doses',
              'The LABA covalently binds to the steroid nucleus in the airway lumen, forming a chimera that enters cells via active transport',
              'The steroid blocks all phosphodiesterases, while the LABA blocks muscarinic M3 receptors',
              'The LABA induces hepatic CYP3A4 to accelerate steroid clearance'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: The synergy between ICS and LABA is bidirectional and mutually reinforcing at the molecular level: (1) Steroid enhancement of beta-2 signaling: Chronic beta-2 agonist exposure normally leads to receptor phosphorylation by GRK and beta-arrestin-mediated receptor down-regulation/tolerance. Corticosteroids bind GREs in the promoter of the beta-2 receptor gene, directly upregulating beta-2 adrenoceptor transcription and preventing tolerance; (2) Beta-2 agonist enhancement of steroid action: LABA-induced adenylyl cyclase activation and cAMP/PKA signaling leads to phosphorylation of the glucocorticoid receptor, accelerating its dissociation from heat shock proteins and facilitating nuclear translocation, allowing lower steroid doses to achieve equivalent anti-inflammatory transrepression.',
              'Incorrect: They do not form covalent chimeras.',
              'Incorrect: Steroids do not directly block PDEs, and LABAs do not block muscarinic receptors.',
              'Incorrect: Accelerating steroid clearance would diminish, rather than synergize, efficacy.'
            ],
            overallExplanation: 'ICS + LABA molecular synergy: Glucocorticoids transcribe new beta-2 adrenergic receptors (preventing receptor desensitization and tolerance from chronic LABA use). Concurrently, LABA-induced cAMP/PKA signaling phosphorylates GR, enhancing its nuclear translocation and gene transrepression.',
            highYieldPearl: 'ICS + LABA synergy: Steroids upregulate beta-2 receptor transcription (prevents LABA tolerance); LABA/PKA signaling primes GR nuclear translocation (boosts steroid anti-inflammatory action).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 191-194'
          },
          {
            id: 202,
            questionNumberLabel: 'Question 22',
            title: 'Clinical Roles of ICS: Asthma (First-Line Eosinophilic) vs. COPD (Add-On & Pneumonia Risk)',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Inhaled corticosteroids are fundamental in respiratory medicine, yet their clinical role differs fundamentally between asthma and COPD. Which statement accurately contrasts their utility and risks in these two diseases?',
            options: [
              'In asthma, ICS is the cornerstone first-line anti-inflammatory therapy for all severities (suppresses eosinophilic, Th2-mediated inflammation); in COPD, inflammation is predominantly neutrophilic/macrophagic (relatively steroid-resistant), so ICS is reserved as add-on therapy for patients with high blood eosinophils (>=300 cells/mcL) or frequent exacerbations, and carries an increased risk of bacterial pneumonia',
              'In COPD, ICS is first-line monotherapy, whereas in asthma, ICS is strictly contraindicated due to bronchospasm',
              'In asthma, ICS is used exclusively as an oral rescue tablet for acute anaphylaxis',
              'In COPD, ICS reduces mortality by 100% without altering bacterial infection risk'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: In asthma, inflammation is primarily eosinophilic, driven by CD4+ Th2 lymphocytes and mast cells, which are exquisitely sensitive to glucocorticoid transrepression; thus, ICS is first-line foundation therapy for all asthma severities. In contrast, COPD inflammation is primarily neutrophilic and CD8+ T-cell driven, driven by cigarette smoke proteases and oxidative stress, which inactivates histone deacetylase-2 (HDAC2) and confers relative corticosteroid resistance. Therefore, in COPD, ICS is NEVER used as monotherapy; it is reserved as an add-on to LABA/LAMA for patients with frequent exacerbations and elevated blood eosinophils (>=300 cells/mcL). Furthermore, chronic ICS in COPD carries a well-documented increased risk of bacterial pneumonia.',
              'Incorrect: ICS is never first-line monotherapy in COPD, and is the cornerstone of asthma therapy.',
              'Incorrect: In asthma, ICS is inhaled maintenance, not an oral rescue drug for anaphylaxis.',
              'Incorrect: ICS does not reduce COPD mortality by 100% and carries a recognized pneumonia risk.'
            ],
            overallExplanation: 'In asthma, inflammation is Th2/eosinophil-driven and highly responsive to corticosteroids, making ICS the first-line foundation of therapy. In COPD, inflammation is predominantly neutrophilic and macrophage-driven (steroid-resistant due to HDAC2 oxidative inactivation). ICS in COPD is restricted to patients with high eosinophils (>=300 cells/mcL) or frequent exacerbations on LAMA/LABA, and is associated with an elevated risk of bacterial pneumonia.',
            highYieldPearl: 'Asthma = eosinophilic Th2 inflammation (ICS is first-line foundation). COPD = neutrophilic inflammation (steroid-resistant; ICS is add-on only for eosinophils >=300 or frequent exacerbations; increases pneumonia risk!).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 195-198'
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 3: Leukotriene Modifiers & 5-Lipoxygenase Inhibitors (Questions 203 - 214)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 3,
    title: 'Leukotriene Modifiers & 5-Lipoxygenase Inhibitors',
    subtitle: 'Arachidonic acid cascade, cysteinyl leukotriene synthesis, zileuton iron chelation, montelukast CysLT1 antagonism, Boxed Warnings, and AERD pathophysiology',
    sections: [
      {
        sectionTitle: 'Arachidonic Acid Cascade & Leukotriene Biosynthesis',
        questions: [
          {
            id: 203,
            questionNumberLabel: 'Question 23',
            title: 'Arachidonic Acid Cascade: Phospholipase A2 & COX vs. 5-LOX Divergence',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Upon inflammatory cell stimulation, membrane phospholipids are cleaved by Phospholipase A2 (PLA2) to liberate free arachidonic acid. Which two primary enzymatic pathways process arachidonic acid, and how do glucocorticoids block both pathways upstream?',
            options: [
              'Cyclooxygenase (COX-1/COX-2 -> prostaglandins, thromboxane) and 5-Lipoxygenase (5-LOX -> leukotrienes); glucocorticoids induce Annexin-1 (lipocortin-1), which directly inhibits PLA2, shutting off arachidonate release upstream',
              'Cytochrome P450 and monoamine oxidase; glucocorticoids phosphorylate PLA2 to accelerate arachidonate destruction',
              'Xanthine oxidase and catalase; glucocorticoids alkylate arachidonate double bonds',
              'Adenylate cyclase and guanylate cyclase; glucocorticoids stimulate PLA2 exocytosis'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Membrane phospholipids are hydrolyzed by cytosolic Phospholipase A2 (PLA2), liberating free 20-carbon arachidonic acid (5,8,11,14-eicosatetraenoic acid). Arachidonic acid then diverges into two major cascades: (1) The Cyclooxygenase pathway (COX-1 and COX-2), yielding prostanoids (PGE2, PGD2, PGF2-alpha, PGI2, and TXA2); and (2) The 5-Lipoxygenase pathway (5-LOX), yielding leukotrienes (LTB4, LTC4, LTD4, LTE4). Glucocorticoids induce the synthesis of Annexin-1 (lipocortin-1), an endogenous protein that binds and directly inhibits PLA2, blocking arachidonate liberation and starving both pathways of substrate.',
              'Incorrect: Arachidonic acid is processed primarily by COX and LOX pathways, not MAO or catalase.',
              'Incorrect: Glucocorticoids inhibit, rather than stimulate, PLA2 via Annexin-1 induction.',
              'Incorrect: Adenylate cyclase processes ATP, not arachidonic acid.'
            ],
            overallExplanation: 'Phospholipase A2 (PLA2) cleaves membrane phospholipids to release arachidonic acid, which is metabolized by: (1) COX -> prostaglandins and thromboxanes; and (2) 5-LOX -> leukotrienes. Glucocorticoids upregulate Annexin-1 (lipocortin-1), which inhibits PLA2, shutting down both eicosanoid cascades at their source.',
            highYieldPearl: 'Arachidonic acid cascade: PLA2 releases arachidonate -> COX (prostaglandins) vs 5-LOX (leukotrienes). Steroids induce Annexin-1 (lipocortin-1), which INHIBITS PLA2 upstream!',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 202-205'
          },
          {
            id: 204,
            questionNumberLabel: 'Question 24',
            title: '5-Lipoxygenase (5-LOX) & FLAP: Catalytic Iron & LTA4 Formation',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: '5-Lipoxygenase (5-LOX) requires membrane translocation and an essential accessory protein to convert arachidonic acid into leukotriene A4 (LTA4). What accessory protein and active-site cofactor are essential for 5-LOX enzymatic activity?',
            options: [
              '5-Lipoxygenase Activating Protein (FLAP) and catalytic non-heme iron (Fe3+ / ferric iron)',
              'Cytochrome P450 reductase and catalytic copper (Cu2+)',
              'Heat shock protein 90 and catalytic zinc (Zn2+)',
              'Cyclooxygenase-2 and catalytic magnesium (Mg2+)'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Upon cell activation and Ca2+ influx, 5-LOX translocates from the cytosol or nucleoplasm to the nuclear membrane, where it docks with 5-Lipoxygenase Activating Protein (FLAP), an integral nuclear membrane protein that binds arachidonic acid and presents it to 5-LOX. The catalytic active site of 5-LOX contains a non-heme iron atom that must cycle between the inactive ferrous (Fe2+) and active ferric (Fe3+) states. 5-LOX first oxygenates arachidonic acid at C5 to form 5-HPETE, then dehydrates 5-HPETE into the unstable allylic epoxide leukotriene A4 (LTA4).',
              'Incorrect: 5-LOX uses non-heme iron and FLAP, not copper or cytochrome P450 reductase.',
              'Incorrect: Carbonic anhydrase uses zinc, not 5-LOX.',
              'Incorrect: COX-2 is a parallel enzyme, not a 5-LOX cofactor.'
            ],
            overallExplanation: '5-Lipoxygenase (5-LOX) requires FLAP (5-lipoxygenase activating protein) to present arachidonic acid at the nuclear membrane. The 5-LOX catalytic pocket contains a non-heme iron (Fe3+) that catalyzes the two-step conversion of arachidonic acid to 5-HPETE and then to the epoxide leukotriene A4 (LTA4).',
            highYieldPearl: '5-LOX requires FLAP (membrane docking/substrate presentation) and non-heme catalytic iron (Fe3+) to convert arachidonate -> 5-HPETE -> unstable epoxide LTA4.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 206-208'
          },
          {
            id: 205,
            questionNumberLabel: 'Question 25',
            title: 'Cysteinyl Leukotrienes (LTC4, LTD4, LTE4) vs. LTB4: Biosynthesis & Potency',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Leukotriene A4 (LTA4) is the branching hub of leukotriene biosynthesis. How do cysteinyl leukotrienes (LTC4, LTD4, LTE4) differ in synthesis and clinical effects from leukotriene B4 (LTB4)?',
            options: [
              'LTA4 is conjugated with glutathione by LTC4 synthase to form LTC4, which is sequentially cleaved into LTD4 and LTE4; these "cysteinyl leukotrienes" (SRS-A) are ~1000-fold more potent than histamine in causing bronchospasm, whereas LTB4 (formed by LTA4 hydrolase) is primarily a potent neutrophil chemoattractant',
              'LTA4 is reduced by catalase to LTB4, which causes intense bronchodilation',
              'Cysteinyl leukotrienes contain zinc atoms that destroy alveolar capillaries',
              'LTB4 contains an intact glutathione peptide that blocks mast cell degranulation'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: LTA4 is metabolized by two distinct enzymes: (1) LTA4 hydrolase converts LTA4 into LTB4 (5,12-dihydroxy acid), which binds BLT1 receptors and acts as the most potent endogenous chemoattractant and activator of neutrophils; (2) LTC4 synthase conjugates LTA4 with the tripeptide glutathione (gamma-Glu-Cys-Gly) to form LTC4. Extracellular peptidases cleave glutamic acid to yield LTD4 (Cys-Gly conjugate), and dipeptidases cleave glycine to yield LTE4 (cysteinyl conjugate). LTC4, LTD4, and LTE4 are the "cysteinyl leukotrienes" (formerly termed Slow Reacting Substance of Anaphylaxis, SRS-A). They bind CysLT1 receptors and are ~1000-fold more potent than histamine in promoting sustained airway smooth muscle bronchoconstriction, microvascular permeability (mucosal edema), and mucus hypersecretion.',
              'Incorrect: LTB4 is a neutrophil chemoattractant and pro-inflammatory mediator, not a bronchodilator.',
              'Incorrect: Cysteinyl leukotrienes are lipid-peptide conjugates, not zinc metalloenzymes.',
              'Incorrect: LTB4 is a dihydroxy fatty acid lacking glutathione; LTC4 is the one with glutathione.'
            ],
            overallExplanation: 'LTA4 branches into: (1) LTB4 (via LTA4 hydrolase) -> potent neutrophil chemotaxis; and (2) Cysteinyl leukotrienes (LTC4, LTD4, LTE4, via glutathione conjugation by LTC4 synthase and peptide cleavage) -> formerly SRS-A, ~1000x more potent than histamine at inducing bronchospasm, mucosal edema, and mucus plugging via CysLT1 receptors.',
            highYieldPearl: 'Cysteinyl leukotrienes (LTC4, LTD4, LTE4 = SRS-A): Glutathione-derived; bind CysLT1; ~1000x more potent than histamine at bronchoconstriction. LTB4 = neutrophil chemoattractant.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 209-212'
          },
          {
            id: 206,
            questionNumberLabel: 'Question 26',
            title: 'Zileuton (Zyflo) Pharmacophore & Catalytic Iron Chelation Mechanism',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Zileuton (Zyflo) is the only FDA-approved 5-lipoxygenase inhibitor. What chemical pharmacophore defines zileuton, and how does it block leukotriene biosynthesis?',
            options: [
              'An N-hydroxyurea moiety linked to a benzothiophene ring; acts as an iron-chelating antioxidant that reduces active-site ferric iron (Fe3+) in 5-LOX to inactive ferrous iron (Fe2+), shutting down synthesis of ALL leukotrienes (both LTB4 and cysteinyl leukotrienes LTC4/D4/E4)',
              'A quinoline dicarboxylic acid that competitively blocks CysLT1 receptors on smooth muscle',
              'A steroid nucleus that translocates into the nucleus to bind GRE promoters',
              'A quaternary ammonium salt that plugs voltage-gated calcium channels in mast cells'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Zileuton (Zyflo) contains an N-hydroxyurea group (-N(OH)-CONH2) attached via an ethylidene linker to a benzo[b]thiophene nucleus. Its mechanism is redox-active iron chelation: the N-hydroxyurea bidentate ligand inserts into the catalytic pocket of 5-LOX and chelates the catalytic non-heme iron, reducing the active ferric ion (Fe3+) to the catalytically inactive ferrous ion (Fe2+). Because it blocks 5-LOX at the very beginning of the pathway (prior to LTA4 formation), zileuton halts the production of ALL leukotriene species—both LTB4 (neutrophil chemoattractant) and cysteinyl leukotrienes (LTC4, LTD4, LTE4).',
              'Incorrect: Competitive CysLT1 receptor antagonism describes montelukast and zafirlukast, not zileuton.',
              'Incorrect: Zileuton is non-steroidal and does not bind GREs.',
              'Incorrect: Zileuton is not a quaternary ammonium and does not block calcium channels.'
            ],
            overallExplanation: 'Zileuton features an N-hydroxyurea pharmacophore attached to a benzothiophene ring. It acts as an iron-chelating antioxidant that reduces the catalytic non-heme Fe3+ of 5-LOX to Fe2+. By blocking 5-LOX upstream of LTA4, zileuton inhibits the formation of ALL leukotrienes (both LTB4 and cysteinyl leukotrienes LTC4, LTD4, LTE4).',
            highYieldPearl: 'Zileuton (Zyflo): N-hydroxyurea + benzothiophene. Chelates catalytic Fe3+ in 5-LOX -> blocks synthesis of ALL leukotrienes (both LTB4 and cysteinyl LTC4/D4/E4)!',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 214-217'
          },
          {
            id: 207,
            questionNumberLabel: 'Question 27',
            title: 'Zileuton Clinical Liabilities: Hepatotoxicity Monitoring & CYP1A2 Drug Interactions',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Despite its comprehensive leukotriene blockade, zileuton is second-line due to significant clinical monitoring requirements. What organ toxicity and major cytochrome P450 drug interaction require strict management during zileuton therapy?',
            options: [
              'Hepatotoxicity (elevated serum ALT/AST in ~3–5% of patients, requiring baseline and monthly liver function tests for the first 3 months), and potent inhibition of CYP1A2, which doubles serum theophylline levels and elevates warfarin concentrations',
              'Irreversible ototoxicity and potent induction of CYP2D6 causing antidepressant failure',
              'Fatal pulmonary fibrosis and inhibition of renal organic anion transporters',
              'Aplastic anemia and complete inhibition of intestinal pancreatic lipase'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Zileuton has two major clinical liabilities: (1) Hepatotoxicity: Approximately 3-5% of treated patients develop significant transaminase elevations (ALT >= 3x ULN), occasionally progressing to severe hepatitis; the FDA mandates baseline ALT monitoring, monthly monitoring for the first 3 months, then every 2-3 months for the first year; (2) Potent CYP1A2 Inhibition: Zileuton is a strong inhibitor of CYP1A2. When co-administered with theophylline (which is cleared by CYP1A2), zileuton doubles theophylline serum concentrations, precipitating life-threatening theophylline toxicity (seizures, arrhythmias); it also inhibits R-warfarin clearance, prolonging prothrombin time/INR.',
              'Incorrect: Zileuton does not cause ototoxicity and is a CYP1A2 inhibitor, not a CYP2D6 inducer.',
              'Incorrect: Pulmonary fibrosis is caused by amiodarone, bleomycin, and busulfan, not zileuton.',
              'Incorrect: Zileuton does not cause aplastic anemia or inhibit lipase.'
            ],
            overallExplanation: 'Zileuton carries two primary clinical warnings: (1) Hepatotoxicity (ALT/AST elevations in 3–5% of patients, requiring mandatory baseline and monthly LFT monitoring); and (2) Potent CYP1A2 inhibition (doubles serum theophylline levels and increases warfarin concentrations, requiring dose reductions and close monitoring).',
            highYieldPearl: 'Zileuton liabilities: 1) Hepatotoxicity (mandatory monthly LFT monitoring for first 3 months); 2) Potent CYP1A2 inhibitor (doubles theophylline levels -> severe toxicity!).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 218-220'
          },
          {
            id: 208,
            questionNumberLabel: 'Question 28',
            title: 'Cysteinyl Leukotriene Receptor 1 (CysLT1) Antagonists: Molecular Target & Selectivity',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Montelukast and zafirlukast belong to the leukotriene receptor antagonist (LTRA) class. What specific receptor do they antagonize, and which leukotriene mediator do they NOT inhibit?',
            options: [
              'They competitively antagonize the CysLT1 Gq-coupled receptor, blocking LTC4-, LTD4-, and LTE4-mediated bronchospasm; they do NOT block LTB4 or its BLT1 receptor',
              'They selectively block the BLT1 receptor, inhibiting LTB4-mediated neutrophil migration, while sparing cysteinyl leukotrienes',
              'They inhibit both CysLT1 and CysLT2 with equal sub-nanomolar affinity',
              'They act as allosteric agonists of the mineralocorticoid receptor'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Montelukast and zafirlukast are selective, high-affinity competitive antagonists of the Cysteinyl Leukotriene Receptor 1 (CysLT1). CysLT1 is a Gq-protein-coupled receptor expressed on airway smooth muscle cells, bronchial fibroblasts, and mast cells that mediates intense bronchoconstriction, vascular permeability, and mucus production in response to LTD4 (highest affinity), LTC4, and LTE4. Importantly, CysLT1 antagonists do NOT block the BLT1 receptor and have no effect on LTB4-mediated neutrophil chemotaxis or activation (unlike zileuton, which blocks both).',
              'Incorrect: They target CysLT1, not BLT1, and have no direct effect on LTB4.',
              'Incorrect: They are highly selective for CysLT1 over CysLT2.',
              'Incorrect: They are antagonists at CysLT1, not mineralocorticoid receptor agonists.'
            ],
            overallExplanation: 'LTRAs (montelukast, zafirlukast) competitively block the CysLT1 receptor on airway smooth muscle, neutralizing LTD4, LTC4, and LTE4 bronchospasm and edema. Crucially, they have NO activity against LTB4 or its BLT1 receptor (neutrophil chemoattractant), which remains active unless a 5-LOX inhibitor like zileuton is used.',
            highYieldPearl: 'LTRAs (Montelukast, Zafirlukast): Selectively block CysLT1 receptors (blocks LTC4/D4/E4 bronchoconstriction). They DO NOT block LTB4 or BLT1 receptors!',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 221-224'
          },
          {
            id: 209,
            questionNumberLabel: 'Question 29',
            title: 'Montelukast (Singulair) Structure & Physicochemical SAR',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Montelukast (Singulair) is a widely prescribed oral CysLT1 antagonist. What structural components make up its chemical framework, and how do they mimic endogenous leukotriene ligands?',
            options: [
              'A substituted quinoline ring, an (E)-alkenyl linker, a cyclopropylacetic acid moiety, and a tertiary alcohol bearing a chlorophenyl group; the carboxylic acid mimics the peptide carboxylate of LTD4 while the lipophilic aromatic rings mimic the eicosanoid fatty acid backbone',
              'A steroid nucleus with a 17-spirolactone ring that mimics aldosterone',
              'A purine ring with three methyl groups that mimics adenosine triphosphate',
              'A cyclic peptide with eight amino acids that mimics vasopressin'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Montelukast is a rationally designed non-prostanoid small molecule featuring: (1) A 2-(2-(3-(S)-(3-(2-(7-chloroquinolin-2-yl)ethenyl)phenyl)-3-hydroxypropyl)phenyl)cyclopropylacetic acid scaffold; (2) A quinoline ring and an (E)-styryl linker; (3) A cyclopropyl ring attached to an acetic acid group; and (4) A tertiary alcohol and a chlorophenyl group. The terminal carboxylic acid provides an essential negative charge that forms an ionic interaction with conserved basic residues in CysLT1 (mimicking the carboxylate of LTD4), while the extensive lipophilic quinoline and aromatic rings (cLogP > 8) fit deeply into the hydrophobic cleft normally occupied by the 20-carbon arachidonate chain of leukotrienes.',
              'Incorrect: Montelukast is non-steroidal and does not contain a spirolactone ring.',
              'Incorrect: Montelukast is not a purine or xanthine.',
              'Incorrect: Montelukast is an organic small molecule, not a cyclic peptide.'
            ],
            overallExplanation: 'Montelukast (Singulair) combines a quinoline ring, an (E)-alkenyl linker, a tertiary alcohol, and a cyclopropylacetic acid moiety. The acidic carboxylate mimics the peptide carboxylate of LTD4 (ionic bonding with Arg in CysLT1), while its lipophilic aromatic core (cLogP > 8) fills the receptor hydrophobic fatty acid pocket.',
            highYieldPearl: 'Montelukast SAR: Quinoline ring + cyclopropylacetic acid (cLogP > 8). Carboxylic acid mimics LTD4 carboxylate; lipophilic rings mimic the eicosanoid backbone.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 225-228'
          },
          {
            id: 210,
            questionNumberLabel: 'Question 30',
            title: 'Montelukast FDA Boxed Warning: Serious Neuropsychiatric Events',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'In March 2020, the FDA issued a mandatory Boxed Warning (black box warning) for montelukast (Singulair). What severe clinical safety signal prompted this regulatory action?',
            options: [
              'Serious neuropsychiatric events, including dream abnormalities, agitation, depression, anxiety, sleep disturbances, hallucinations, and suicidal ideation and completed suicide',
              'Severe, irreversible aplastic anemia requiring weekly bone marrow biopsies',
              'Acute hemorrhagic pancreatitis and spontaneous splenic rupture',
              'Permanent sensorineural hearing loss and bilateral retinal detachment'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: In 2020, the FDA added a Boxed Warning to montelukast warning of serious neuropsychiatric events in pediatric and adult patients. Reported events include nightmare/vivid dreams, insomnia, irritability, agitation, aggressive behavior, restlessness, anxiety, depression, hallucinations, and suicidal thoughts and completed suicide. The FDA advises clinicians to discuss these risks with patients/parents, monitor closely for behavioral changes, discontinue montelukast immediately if psychiatric symptoms occur, and avoid montelukast for mild allergic rhinitis when other treatments (such as nasal steroids or antihistamines) are available.',
              'Incorrect: Montelukast is not associated with aplastic anemia.',
              'Incorrect: Montelukast does not cause splenic rupture or hemorrhagic pancreatitis.',
              'Incorrect: Montelukast does not cause retinal detachment or hearing loss.'
            ],
            overallExplanation: 'Montelukast carries an FDA Boxed Warning (strengthened in 2020) for serious neuropsychiatric adverse effects: nightmares, sleep disturbances, agitation, depression, anxiety, and suicidal ideation/behavior. Clinicians must educate patients and caregivers, promptly discontinue the drug if mood changes occur, and avoid use in allergic rhinitis unless alternatives are inadequate.',
            highYieldPearl: 'Montelukast FDA Boxed Warning (2020): Serious NEUROPSYCHIATRIC events (agitation, nightmares, depression, suicidal thoughts/behavior). Stop drug immediately if mood changes occur!',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 229-232'
          },
          {
            id: 211,
            questionNumberLabel: 'Question 31',
            title: 'Zafirlukast (Accolate): Sulfonylurea-Carbamate Structure, Food Effect & CYP2C9/3A4 Interactions',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Zafirlukast (Accolate) is a sulfonylurea-carbamate leukotriene receptor antagonist containing an indole core. Which food requirement, major drug interaction, and rare organ toxicity distinguish zafirlukast from montelukast?',
            options: [
              'Food significantly reduces bioavailability by >40% (must be taken on an empty stomach, 1 hour before or 2 hours after meals); acts as a potent inhibitor of CYP2C9 and CYP3A4 (dangerously increasing warfarin INR); and carries a risk of rare, severe life-threatening hepatotoxicity / liver failure',
              'Food increases bioavailability by 300% (must be taken with high-fat meals); induces CYP1A2; causes pulmonary alveolar proteinosis',
              'Must be administered intravenously only; induces CYP2D6; causes acute gout',
              'Completely devoid of food effects; cleared 100% unchanged in expired air; causes thyroiditis'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Zafirlukast has three major clinical distinctions: (1) Marked Food Effect: Food administration reduces its oral bioavailability by >40%; it must strictly be taken on an empty stomach (at least 1 hour before or 2 hours after meals); (2) CYP2C9 and CYP3A4 Inhibition: Zafirlukast inhibits CYP2C9 (which metabolizes S-warfarin) and CYP3A4. Co-administration with warfarin dramatically increases warfarin concentrations, prolonging prothrombin time and causing major bleeding; (3) Hepatotoxicity: Rare cases of severe, life-threatening drug-induced liver injury, fulminant hepatic failure, and liver transplantation have been reported, requiring immediate cessation if jaundice or liver enzyme elevations occur. (In contrast, montelukast can be taken with or without food and does not inhibit CYP2C9).',
              'Incorrect: Food decreases zafirlukast absorption by >40%, not increases.',
              'Incorrect: Zafirlukast is an oral tablet, not IV only.',
              'Incorrect: Zafirlukast has a massive food effect and undergoes extensive hepatic metabolism.'
            ],
            overallExplanation: 'Zafirlukast (Accolate) contains an indole core with an ortho-tolyl sulfonylurea and carbamate. Key clinical pearls: (1) Absorption decreased >40% with food -> take on empty stomach; (2) Potent CYP2C9/3A4 inhibitor -> major warfarin interaction (spikes INR); and (3) Risk of severe drug-induced liver failure.',
            highYieldPearl: 'Zafirlukast: Indole sulfonylurea. Take on EMPTY STOMACH (food drops bioavailability >40%). Inhibits CYP2C9 (spikes warfarin INR!). Risk of severe hepatotoxicity.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 233-236'
          },
          {
            id: 212,
            questionNumberLabel: 'Question 32',
            title: 'Aspirin-Exacerbated Respiratory Disease (AERD / Samter\'s Triad) Pathophysiology',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'A 38-year-old patient with severe persistent asthma and nasal polyps takes two ibuprofen tablets for a headache and develops life-threatening acute bronchospasm, facial flushing, and rhinorrhea 45 minutes later. What is the molecular biochemical mechanism underlying this reaction (AERD / Samter\'s triad)?',
            options: [
              'Non-selective COX-1 inhibition blocks synthesis of prostaglandin E2 (PGE2); loss of PGE2 removes an endogenous physiological brake on 5-lipoxygenase, shunting arachidonic acid into the 5-LOX pathway and causing massive overproduction of bronchoconstrictive cysteinyl leukotrienes',
              'Ibuprofen acts as an irreversible covalent agonist at bronchial histamine H1 receptors',
              'Ibuprofen stimulates pulmonary mast cells to produce IgE antibodies against salicylic acid within 10 minutes',
              'Ibuprofen directly hydrolyzes beta-2 adrenergic receptors on airway smooth muscle'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Aspirin-Exacerbated Respiratory Disease (AERD, or Samter\'s Triad: asthma, chronic rhinosinusitis with nasal polyposis, and acute NSAID-induced bronchospasm) is a non-IgE-mediated pseudoallergic reaction caused by an altered eicosanoid metabolism. In these patients, prostaglandin E2 (PGE2, derived from COX-1) acts as an essential endogenous brake that tonically suppresses 5-lipoxygenase and mast cell mediator release. Ingestion of aspirin or non-selective COX-1 inhibitors (ibuprofen, naproxen, ketorolac) blocks PGE2 synthesis. Removing the PGE2 brake causes massive shunting of arachidonic acid down the 5-LOX pathway, triggering an explosive burst of cysteinyl leukotrienes (LTC4, LTD4, LTE4) that causes severe, refractory bronchospasm. Leukotriene modifiers (montelukast, zileuton) are especially effective in AERD.',
              'Incorrect: AERD is caused by leukotriene overproduction from COX-1 inhibition, not H1 receptor agonism.',
              'Incorrect: AERD is NOT an IgE-mediated allergic reaction; it is a metabolic biochemical shunting reaction (cross-reacts across all COX-1 inhibitors).',
              'Incorrect: NSAIDs do not hydrolyze beta-2 receptors.'
            ],
            overallExplanation: 'Samter\'s Triad / AERD: Asthma + Nasal Polyps + Aspirin/NSAID hypersensitivity. Biochemical mechanism: COX-1 inhibition depletes PGE2 (the endogenous brake on 5-LOX). Unopposed 5-LOX shunts arachidonic acid into cysteinyl leukotrienes, unleashing massive bronchospasm. Leukotriene modifiers (montelukast, zileuton) provide targeted benefit in AERD.',
            highYieldPearl: 'AERD (Samter\'s Triad): COX-1 block by NSAIDs depletes PGE2 (loss of 5-LOX brake) -> arachidonic acid shunted to 5-LOX -> massive cysteinyl leukotriene burst & bronchospasm! LTRAs are highly effective.',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 237-240'
          },
          {
            id: 213,
            questionNumberLabel: 'Question 33',
            title: 'Pregnancy Safety Profile of Respiratory Medications',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Managing asthma during pregnancy requires balancing fetal hypoxia risks against medication safety. What are the established safety profiles and preferences for budesonide, montelukast, and zileuton in pregnancy?',
            options: [
              'Budesonide is the preferred inhaled corticosteroid (extensive human pregnancy registry data, FDA Category B); montelukast is Category B with a favorable safety profile; zileuton is Category C and avoided due to hepatotoxicity and animal teratogenicity data',
              'Zileuton is the preferred first-line agent, whereas budesonide is strictly contraindicated',
              'All respiratory drugs are completely contraindicated in pregnancy, requiring discontinuation of all inhalers',
              'Montelukast causes mandatory fetal neural tube defects and requires immediate therapeutic abortion'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Clinical practice guidelines (NAEPP/GINA) emphasize that maternal asthma exacerbations and resulting fetal hypoxia pose far greater risks of intrauterine growth restriction and fetal death than asthma medications. For inhaled corticosteroids, budesonide (Pulmicort) is the drug of choice because of vast Swedish birth registry data demonstrating no increase in congenital malformations (Category B). For leukotriene modifiers, montelukast is Category B with reassuring animal and human safety data and can be maintained if asthma is well-controlled. Conversely, zileuton is Category C (causes cleft palate and skeletal abnormalities in animal studies and carries hepatotoxicity risk) and is avoided in pregnancy.',
              'Incorrect: Zileuton is avoided in pregnancy, and budesonide is the preferred agent.',
              'Incorrect: Discontinuing asthma medications risks lethal fetal hypoxia.',
              'Incorrect: Montelukast is Category B and is not associated with neural tube defects.'
            ],
            overallExplanation: 'In pregnant asthmatics, maintaining maternal oxygenation is paramount. Budesonide is the preferred ICS (Category B, extensive registry safety data). Montelukast is Category B and safe to continue. Zileuton is Category C (teratogenic in animals, hepatotoxic) and avoided in pregnancy.',
            highYieldPearl: 'Pregnancy in Asthma: Budesonide = preferred ICS (Category B, vast safety data). Montelukast = Category B (safe). Zileuton = Category C (teratogenic, hepatotoxic -> avoid in pregnancy!).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 241-244'
          },
          {
            id: 214,
            questionNumberLabel: 'Question 34',
            title: 'Steroid Tapering & Churg-Strauss Syndrome (EGPA) Unmasking',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'A 50-year-old patient with severe steroid-dependent asthma is started on montelukast, enabling successful tapering of their high-dose oral prednisone. Three weeks later, the patient develops a palpable purpuric rash, bilateral foot drop (mononeuritis multiplex), pulmonary infiltrates, and severe peripheral eosinophilia (>35% eosinophils). What clinical phenomenon has occurred?',
            options: [
              'Unmasking of underlying Eosinophilic Granulomatosis with Polyangiitis (EGPA / Churg-Strauss syndrome), where systemic vasculitis previously suppressed by high-dose oral steroids manifested as the prednisone dose was tapered',
              'A direct idiosyncratic type I IgE-mediated anaphylactic reaction to montelukast',
              'Acute montelukast-induced aplastic anemia causing abnormal white blood cell proliferation',
              'Invasive Aspergillus fumigatus infection triggered by montelukast immunosuppression'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Eosinophilic Granulomatosis with Polyangiitis (EGPA, formerly Churg-Strauss syndrome) is a necrotizing, eosinophil-rich systemic necrotizing vasculitis often heralded by severe adult-onset asthma and rhinosinusitis. Historically, many patients with unrecognized EGPA were treated with high-dose systemic corticosteroids, which suppressed the systemic vasculitis. When leukotriene receptor antagonists (montelukast or zafirlukast) were introduced, their steroid-sparing efficacy allowed clinicians to rapidly taper or discontinue oral prednisone. The reduction in systemic steroid dose unmasked the underlying EGPA, manifesting as marked peripheral eosinophilia, vasculitic purpuric rash, neuropathy (mononeuritis multiplex), and cardiac involvement. This is an unmasking phenomenon rather than direct drug toxicity.',
              'Incorrect: EGPA unmasking is a steroid-withdrawal/unmasking phenomenon, not an IgE anaphylactic reaction to montelukast.',
              'Incorrect: EGPA involves hypereosinophilia and vasculitis, not aplastic anemia.',
              'Incorrect: EGPA is an autoimmune necrotizing vasculitis, not an invasive fungal infection.'
            ],
            overallExplanation: 'When leukotriene receptor antagonists allow successful tapering of systemic oral steroids in severe asthmatics, underlying Eosinophilic Granulomatosis with Polyangiitis (EGPA / Churg-Strauss syndrome) may be unmasked. Features include severe peripheral eosinophilia, vasculitic purpura, mononeuritis multiplex, and pulmonary infiltrates as steroid suppression is lifted.',
            highYieldPearl: 'EGPA (Churg-Strauss syndrome) unmasking: Tapering systemic steroids after starting LTRAs (montelukast/zafirlukast) unmasks underlying systemic eosinophilic vasculitis (purpura, foot drop, hypereosinophilia).',
            sourceReference: '1)_Respiratory_Drugs.pdf, Slides 245-248'
          }
        ]
      }
    ]
  }
];

export function getDefaultRespiratoryAntiinflammatoriesModule(): ReviewModule {
  return {
    id: 'respiratory_antiinflammatories_mcp2',
    examId: 'exam_1',
    examTitle: 'Exam 1: Renal & Respiratory Medicinal Chemistry',
    title: 'Respiratory Anti-Inflammatories: Steroids & Leukotrienes',
    subtitle: 'Glucocorticoid Receptor Signaling, Core Steroid SAR, Inhaled Corticosteroids (ICS), Soft Steroid Design, and Leukotriene Modifiers',
    course: 'Medicinal Chemistry & Pharmacology II',
    semester: 'Fall',
    code: 'MCP-2-03',
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    chemicalStructures: Object.values(STEROID_AND_LEUKOTRIENE_STRUCTURES),
    pages: respiratoryAntiinflammatoriesPages,
  };
}
