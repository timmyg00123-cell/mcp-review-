import { ReviewModule, ReviewPage } from '../../types/reviewModule';
import { RENAL_STRUCTURES } from './exam1Structures';

export const renalDrugsPages: ReviewPage[] = [
  // ---------------------------------------------------------------------------
  // PAGE 1: Thiazides & Loop Diuretics (Questions 101 - 110)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 1,
    title: 'Thiazides, Thiazide-Like & Loop Diuretics',
    subtitle: 'DCT NCC symport inhibition, benzothiadiazine SAR, phthalimidines, quinazolines, and TAL NKCC2 high-ceiling inhibitors',
    sections: [
      {
        sectionTitle: 'Thiazide & Thiazide-Like Diuretics (DCT NCC Symport)',
        questions: [
          {
            id: 101,
            questionNumberLabel: 'Question 1',
            title: 'Thiazide Molecular Target & Mechanism',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'A medicinal chemist is evaluating the molecular mechanism of chlorothiazide. Which of the following correctly describes the anatomical site, molecular transporter target, and competitive mechanism of thiazide diuretics in the nephron?',
            options: [
              'Distal convoluted tubule (DCT); Na+/Cl- symporter (NCC); competitively inhibits chloride binding at the luminal site',
              'Thick ascending limb (TAL); Na+/K+/2Cl- symporter (NKCC2); competitively inhibits potassium binding at the luminal site',
              'Cortical collecting duct (CCD); Epithelial sodium channel (ENaC); allosterically blocks sodium permeation',
              'Proximal convoluted tubule (PCT); Na+/H+ exchanger isoform 3 (NHE3); competitively blocks hydrogen ion export'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Thiazides act in the distal convoluted tubule (DCT) by inhibiting the electroneutral Na+/Cl- cotransporter (NCC / SLC12A3). Specifically, the benzothiadiazine nucleus competes with the chloride ion (Cl-) at its specific recognition pocket.',
              'Incorrect: Loop diuretics (e.g., furosemide, bumetanide) inhibit NKCC2 in the thick ascending limb of the loop of Henle.',
              'Incorrect: Potassium-sparing diuretics (e.g., amiloride, triamterene) block ENaC in the late distal tubule and cortical collecting duct.',
              'Incorrect: Carbonic anhydrase inhibitors and SGLT2 inhibitors act predominantly in the proximal convoluted tubule.'
            ],
            overallExplanation: 'Thiazide diuretics exert their primary saluretic effect in the distal convoluted tubule (DCT) by competitively occupying the chloride-binding pocket of the luminal Na+/Cl- cotransporter (NCC). By blocking NCC, thiazides inhibit the reabsorption of ~5% of filtered sodium and chloride.',
            highYieldPearl: 'Thiazides target NCC in the DCT by directly competing with Cl- at the transporter recognition site. They promote ~5% sodium excretion and decrease urinary calcium excretion.',
            sourceReference: '2)_Renal_Drugs.pdf, Slides 12-16'
          },
          {
            id: 102,
            questionNumberLabel: 'Question 2',
            title: 'Thiazide Core Pharmacophore & SAR Requirements',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Reviewing the structure-activity relationship (SAR) of benzothiadiazine (thiazide) diuretics, which pair of structural substituents is strictly required for optimal diuretic potency and target efficacy?',
            options: [
              'An unsubstituted sulfonamide group (-SO2NH2) at C7 and an electron-withdrawing group (e.g., -Cl or -CF3) at C6',
              'An N-methylated sulfonamide group (-SO2NHCH3) at C7 and an electron-donating methoxy group (-OCH3) at C6',
              'A free carboxylic acid group (-COOH) at C2 and an unsubstituted primary amine (-NH2) at C5',
              'A quaternary ammonium cation at N2 and a lipophilic tert-butyl ester at C3'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: An unsubstituted primary sulfonamide (-SO2NH2) at position C7 is essential for diuretic activity; substitution on this sulfonamide markedly diminishes or completely abolishes activity. Furthermore, an electron-withdrawing group at position C6 (such as -Cl or -CF3) is vital for high diuretic potency (-CF3 yielding greater lipid solubility and longer duration).',
              'Incorrect: Alkylation of the C7 sulfonamide nitrogen (e.g., -SO2NHCH3) abolishes diuretic activity. Electron-donating groups at C6 dramatically reduce potency.',
              'Incorrect: Thiazides contain a benzothiadiazine nucleus, not a C2 carboxylic acid or C5 primary amine.',
              'Incorrect: A quaternary ammonium cation prevents membrane permeation and does not fit the NCC pharmacophore.'
            ],
            overallExplanation: 'The classical thiazide SAR mandates: (1) An intact unsubstituted sulfonamide (-SO2NH2) at position 7, which provides critical hydrogen bonding; and (2) An electronegative/electron-withdrawing group at position 6 (e.g., -Cl in chlorothiazide, -CF3 in flumethiazide), which is essential for diuretic efficacy. Lipophilic substitutions at position 3 further enhance potency.',
            highYieldPearl: 'Thiazide SAR: C7 -SO2NH2 must be unsubstituted (N-substitution kills activity). C6 needs an electron-withdrawing group (-Cl, -CF3).',
            sourceReference: '2)_Renal_Drugs.pdf, Slides 17-21'
          },
          {
            id: 103,
            questionNumberLabel: 'Question 3',
            title: 'Hydrochlorothiazide 3,4-Dihydro Saturation',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Reduction of the 3,4-double bond of chlorothiazide yields hydrochlorothiazide (HCTZ). What is the direct pharmacological and clinical consequence of this structural modification?',
            options: [
              'Diuretic potency increases by approximately 10-fold due to favorable non-planar envelope puckering and enhanced NCC receptor complementarity',
              'Diuretic potency is completely abolished because the planar aromatic conjugated system is disrupted',
              'The drug shifts from inhibiting NCC in the DCT to selectively inhibiting NKCC2 in the Loop of Henle',
              'The compound becomes an irreversible covalent suicide inhibitor of distal tubule carbonic anhydrase'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Saturation of the 3,4-double bond in the thiadiazine ring converts chlorothiazide into 3,4-dihydrochlorothiazide (hydrochlorothiazide, HCTZ), resulting in an ~10-fold increase in diuretic potency.',
              'Incorrect: Potency is significantly increased (~10x), not abolished.',
              'Incorrect: The site of action remains the NCC symporter in the DCT; saturation does not alter nephron site selectivity.',
              'Incorrect: HCTZ is a reversible non-covalent inhibitor of NCC, not a covalent suicide inhibitor.'
            ],
            overallExplanation: 'Hydrogenation of the 3,4-double bond of the thiadiazine-1,1-dioxide ring introduces flexibility and transforms chlorothiazide into hydrochlorothiazide (HCTZ). This saturation confers an ~10-fold increase in diuretic potency, allowing lower clinical dosing (typically 12.5–50 mg daily vs 500–1000 mg for chlorothiazide).',
            highYieldPearl: '3,4-Dihydro saturation (chlorothiazide -> HCTZ) increases potency 10-fold. Further lipophilic substitution at C3 further boosts potency.',
            sourceReference: '2)_Renal_Drugs.pdf, Slide 22'
          },
          {
            id: 104,
            questionNumberLabel: 'Question 4',
            title: 'Chlorthalidone & Quinethazone: Bioisosteric Rings & Extended Half-Life',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Chlorthalidone is a widely used "thiazide-like" diuretic. What unique structural feature explains its exceptionally long elimination half-life (40–60 hours) compared to hydrochlorothiazide (6–12 hours)?',
            options: [
              'Its phthalimidine (isoindoline) ring undergoes tautomeric equilibrium with an open-chain form and binds extensively to carbonic anhydrase in red blood cells, creating an intracellular erythrocyte reservoir',
              'It contains a lipophilic 18-carbon aliphatic tail that permanently inserts into vascular endothelial membranes',
              'It forms an irreversible covalent disulfide bond with plasma albumin that resists renal glomerular filtration',
              'It undergoes rapid first-pass glucuronidation to an active metabolite that is impervious to biliary elimination'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Chlorthalidone lacks the benzothiadiazine ring, containing instead a phthalimidine (isoindoline) core. It exhibits strong, reversible binding to intracellular carbonic anhydrase within red blood cells, which acts as a circulating depot, releasing the drug slowly and yielding an elimination half-life of 40-60 hours.',
              'Incorrect: Chlorthalidone does not possess a long aliphatic hydrocarbon tail.',
              'Incorrect: Chlorthalidone binds non-covalently, not through covalent disulfide linkages.',
              'Incorrect: Its prolonged duration is driven by red blood cell sequestration, not a unique glucuronide metabolite.'
            ],
            overallExplanation: 'Chlorthalidone is a thiazide-like diuretic featuring an isoindoline/phthalimidine nucleus. Its key pharmacokinetic hallmark is an exceptionally long half-life (t1/2 ~ 40–60 hours) driven by high-affinity partitioning into erythrocytes where it binds red blood cell carbonic anhydrase. This provides smoother 24-hour blood pressure reduction than hydrochlorothiazide.',
            highYieldPearl: 'Chlorthalidone contains a phthalimidine core and sequesters in RBC carbonic anhydrase, resulting in a 40–60 hr half-life (vs HCTZ t1/2 ~6–12 hr).',
            sourceReference: '2)_Renal_Drugs.pdf, Slide 26'
          },
          {
            id: 105,
            questionNumberLabel: 'Question 5',
            title: 'Metolazone SAR & Clinical Utility in Advanced Renal Impairment',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Metolazone is a quinazoline-based thiazide-like diuretic containing an ortho-tolyl group at position 3. Which clinical characteristic distinguishes metolazone from hydrochlorothiazide?',
            options: [
              'It maintains diuretic efficacy in patients with severe renal impairment (GFR < 30 mL/min) and produces profound sequential nephron blockade when combined with loop diuretics',
              'It acts exclusively as an aldosterone receptor antagonist without inhibiting tubular sodium reabsorption',
              'It is administered exclusively as an inhalable aerosol for acute pulmonary edema',
              'It is chemically devoid of any sulfonamide moiety and is 100% safe in severe sulfa allergy'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: While typical thiazides lose efficacy when GFR falls below 30 mL/min, metolazone retains efficacy in advanced renal impairment (GFR < 30 mL/min). When combined with a loop diuretic (e.g., furosemide), it provides synergistic "sequential nephron blockade" in refractory volume overload.',
              'Incorrect: Metolazone targets NCC in the DCT and proximal tubule components; it does not block the mineralocorticoid receptor.',
              'Incorrect: Metolazone is formulated as an oral tablet, not an inhalable aerosol.',
              'Incorrect: Metolazone contains a 7-sulfonamide group and shares cross-reactivity with other sulfonamides.'
            ],
            overallExplanation: 'Metolazone is a quinazoline derivative with an ortho-tolyl substituent at C3. Unlike hydrochlorothiazide, metolazone remains potent in patients with reduced renal clearance (GFR < 30 mL/min). In hospitalized patients with refractory heart failure or diuretic resistance, combining metolazone with a loop diuretic yields potent sequential nephron blockade.',
            highYieldPearl: 'Metolazone (quinazoline with o-tolyl at C3) works even when GFR < 30 mL/min. Combines with loop diuretics for synergistic sequential nephron blockade.',
            sourceReference: '2)_Renal_Drugs.pdf, Slide 27'
          },
          {
            id: 106,
            questionNumberLabel: 'Question 6',
            title: 'Loop Diuretics: Anatomical Site & High-Ceiling Efficacy',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Loop diuretics are clinically termed "high-ceiling" diuretics. Which physiological feature of their anatomical site of action accounts for their superior maximal natriuretic efficacy compared to thiazides?',
            options: [
              'They inhibit the luminal Na+/K+/2Cl- symporter (NKCC2) in the Thick Ascending Limb (TAL), which normally reabsorbs ~25% of the filtered sodium load',
              'They block the SGLT2 transporter in the early proximal tubule, reabsorbing >60% of all filtered cations',
              'They prevent the exocytosis of aquaporin-2 water channels in the medullary collecting duct',
              'They open basolateral potassium channels in the macula densa, accelerating glomerular filtration rate by 300%'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Loop diuretics inhibit the luminal NKCC2 cotransporter in the thick ascending limb of Henle (TAL). Because the TAL is responsible for reabsorbing approximately 25% of the total filtered sodium load, blocking this transporter produces high-ceiling (maximum) natriuresis.',
              'Incorrect: SGLT2 inhibitors block sodium-glucose cotransport in the proximal tubule, but do not produce high-ceiling diuresis.',
              'Incorrect: Vaptans (V2 antagonists) block AQP2 translocation in collecting ducts, causing aquaresis, not high-ceiling natriuresis.',
              'Incorrect: Loop diuretics inhibit NKCC2; they do not open basolateral channels in the macula densa to accelerate GFR.'
            ],
            overallExplanation: 'Loop diuretics (furosemide, bumetanide, torsemide, ethacrynic acid) are high-ceiling agents because they target the Na+/K+/2Cl- cotransporter (NKCC2) in the thick ascending limb (TAL). The TAL normally reabsorbs ~25% of filtered Na+, compared to only ~5% in the DCT (thiazides) and ~2% in the collecting duct (potassium-sparing drugs).',
            highYieldPearl: 'Loop diuretics act at NKCC2 in the TAL (reabsorbing ~25% filtered Na+). They abolish the lumen-positive transepithelial potential, promoting Ca2+ and Mg2+ excretion.',
            sourceReference: '2)_Renal_Drugs.pdf, Slides 29-33'
          },
          {
            id: 107,
            questionNumberLabel: 'Question 7',
            title: 'Furosemide SAR: Anthranilic Acid, Furfuryl Group & Tubular Secretion',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Furosemide is structurally a 5-sulfamoyl-anthranilic acid derivative bearing a furfuryl group at position 2. Why is its carboxylic acid functional group (pKa ~3.9) crucial for its pharmacological activity at NKCC2?',
            options: [
              'It is ionized at physiological pH, enabling active secretion into the tubular lumen via proximal organic anion transporters (OAT1/OAT3) to reach its luminal NKCC2 binding site',
              'It forms an ester prodrug in the stomach that protects the molecule from gastric acid hydrolysis',
              'It coordinates directly to a catalytic zinc atom in the medullary collecting duct cell membrane',
              'It crosses the blood-brain barrier via passive diffusion to activate central vasopressin release'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Furosemide has an acidic carboxyl group with a pKa of ~3.9. At physiological pH (7.4), it is predominantly ionized (>99%). Because furosemide is >95% protein-bound in plasma and poorly filtered at the glomerulus, it relies on active tubular secretion by Organic Anion Transporters (OAT1/OAT3) in the proximal tubule to enter the luminal fluid, where it travels to the TAL to inhibit NKCC2 from the luminal surface.',
              'Incorrect: The carboxylic acid is the free active form, not a prodrug.',
              'Incorrect: Carbonic anhydrase inhibitors coordinate zinc, but furosemide acts primarily at NKCC2.',
              'Incorrect: The ionized carboxyl group and high plasma protein binding prevent significant blood-brain barrier crossing.'
            ],
            overallExplanation: 'Furosemide is a 5-sulfamoyl-2-aminobenzoic acid (anthranilic acid) derivative featuring a 2-furfurylmethylamino moiety. Its carboxylic acid group (pKa 3.9) is deprotonated at blood pH. Because furosemide is highly albumin-bound, it reaches its luminal site of action on NKCC2 primarily through active proximal secretion via organic anion transporters (OAT1/OAT3).',
            highYieldPearl: 'Furosemide (anthranilic acid + furfuryl amine, pKa 3.9) must be actively secreted into the lumen by OAT1/3 in the proximal tubule to reach luminal NKCC2.',
            sourceReference: '2)_Renal_Drugs.pdf, Slide 34'
          },
          {
            id: 108,
            questionNumberLabel: 'Question 8',
            title: 'Bumetanide SAR: Phenoxy & Butylamino Potency Optimization',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Compared to furosemide, bumetanide exhibits approximately 40-fold greater diuretic potency on a milligram-for-milligram basis (1 mg bumetanide ≈ 40 mg furosemide). What structural modifications account for this substantial potency increase?',
            options: [
              'Replacement of the C4-chloro with a phenoxy group and shifting the amino substituent to C3 with an n-butylamino chain',
              'Addition of an unsubstituted guanidinium group at C2 and oxidation of the 5-sulfonamide to a sulfone',
              'Replacement of the aromatic ring with a saturated steroid cyclopentanoperhydrophenanthrene core',
              'Addition of a quaternary ammonium ethyl ester that irreversibly acylates the NKCC2 pore'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: In bumetanide, the core is 3-aminobenzoic acid (metanilamide derivative) rather than 2-aminobenzoic acid (anthranilic acid). It incorporates an electron-withdrawing/lipophilic phenoxy group at C4 and an n-butylamino chain at C3. These modifications optimize lipophilic and steric interactions with the NKCC2 binding cavity, boosting potency ~40-fold over furosemide.',
              'Incorrect: Bumetanide does not contain a guanidinium group; that describes amiloride.',
              'Incorrect: Steroid cores belong to mineralocorticoid antagonists like spironolactone.',
              'Incorrect: Bumetanide is a reversible non-covalent inhibitor and lacks quaternary ammonium moieties.'
            ],
            overallExplanation: 'Bumetanide is a 3-amino-5-sulfamoylbenzoic acid derivative. By replacing the C4 chloride of furosemide with an electron-rich, lipophilic phenoxy group and placing an n-butylamino chain at position 3, bumetanide achieves markedly higher binding affinity for NKCC2, translating into ~40-fold greater clinical potency (1 mg bumetanide = 40 mg furosemide).',
            highYieldPearl: 'Bumetanide SAR: C4-phenoxy + C3-n-butylamino modifications confer ~40x greater potency than furosemide (1 mg bumetanide = 40 mg furosemide).',
            sourceReference: '2)_Renal_Drugs.pdf, Slide 36'
          },
          {
            id: 109,
            questionNumberLabel: 'Question 9',
            title: 'Torsemide: Pyridine-Sulfonylurea Structure & Bioavailability',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Torsemide is a loop diuretic that replaces the traditional carboxylic acid of furosemide/bumetanide with a sulfonylurea group. What clinical pharmacokinetic advantage does torsemide offer over oral furosemide?',
            options: [
              'High, consistent oral bioavailability (~80–90%) with minimal food effect and a longer elimination half-life, avoiding the erratic absorption of furosemide',
              'Zero hepatic metabolism, being eliminated 100% unchanged in expired breath',
              'Selective distribution across the blood-brain barrier to treat hydrocephalus',
              'Immediate irreversible binding to red blood cell membranes providing a 6-month depot effect'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Torsemide is a pyridine-sulfonylurea loop diuretic. Unlike oral furosemide (which has erratic, variable bioavailability between 10% and 90%, often reduced by food/gut edema), torsemide has reliable, high oral bioavailability (~80–90%) and a longer duration of action (half-life ~3.5 hours), producing more predictable diuresis.',
              'Incorrect: Torsemide is ~80% metabolized by hepatic CYP2C9; it is not exhaled in breath.',
              'Incorrect: Torsemide does not penetrate the BBB to treat hydrocephalus.',
              'Incorrect: Torsemide does not form a 6-month RBC depot.'
            ],
            overallExplanation: 'Torsemide features a pyridine ring and an isopropyl-sulfonylurea side chain instead of a carboxylic acid. This unique structure provides highly reliable, predictable oral bioavailability (80–90% vs 10–90% for furosemide) and a longer elimination half-life (~3.5 hours). This makes torsemide particularly advantageous in advanced heart failure patients with gut wall edema.',
            highYieldPearl: 'Torsemide (pyridine-sulfonylurea) has ~80–90% consistent oral bioavailability and longer duration of action compared to furosemide (variable 10–90%).',
            sourceReference: '2)_Renal_Drugs.pdf, Slide 37'
          },
          {
            id: 110,
            questionNumberLabel: 'Question 10',
            title: 'Ethacrynic Acid: Non-Sulfonamide Michael Acceptor & Ototoxicity',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'A 64-year-old patient with severe acute decompensated heart failure has a documented life-threatening anaphylactic allergy to sulfonamide-containing drugs. Which loop diuretic is safe to administer, and what is its unique chemical mechanism and major toxicity?',
            options: [
              'Ethacrynic acid; contains an alpha,beta-unsaturated ketone (Michael acceptor) that reacts with sulfhydryl groups; carries a higher risk of ototoxicity',
              'Bumetanide; contains a phenoxy group that prevents IgE antibody recognition; carries a risk of pulmonary fibrosis',
              'Torsemide; contains a sulfonylurea that neutralizes the sulfa epitope; carries a risk of agranulocytosis',
              'Metolazone; contains a quinazoline ring that bypasses mast cell degranulation; carries a risk of optic neuritis'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Ethacrynic acid is a phenoxyacetic acid derivative that completely lacks a sulfonamide group, making it the only loop diuretic safe in patients with true, severe sulfonamide allergy. Chemically, it contains an alpha,beta-unsaturated ketone (methylene group) that acts as a Michael acceptor, alkylating essential -SH groups on NKCC2. However, it carries a substantially higher risk of ototoxicity (tinnitus, permanent hearing loss) than other loop diuretics.',
              'Incorrect: Bumetanide contains a sulfonamide group (-SO2NH2) and cross-reacts in sulfa allergy.',
              'Incorrect: Torsemide contains a sulfonamide-derived sulfonylurea and cross-reacts in sulfa allergy.',
              'Incorrect: Metolazone is a thiazide-like sulfonamide, not a loop diuretic, and is contraindicated in severe sulfa allergy.'
            ],
            overallExplanation: 'Ethacrynic acid is a phenoxyacetic acid derivative uniquely lacking any sulfonamide moiety (-SO2NH2), rendering it the drug of choice for loop diuresis in patients with documented severe sulfa hypersensitivity. Its alpha,beta-unsaturated ketone undergoes 1,4-Michael addition with cysteine sulfhydryl (-SH) groups. It has the highest incidence of ototoxicity among loop diuretics.',
            highYieldPearl: 'Ethacrynic acid: NON-SULFONAMIDE loop diuretic (safe in sulfa allergy). Uses an alpha,beta-unsaturated ketone (Michael acceptor) to alkylate -SH groups. Highest risk of ototoxicity!',
            sourceReference: '2)_Renal_Drugs.pdf, Slide 38'
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 2: Potassium-Sparing Diuretics, CAIs & Osmotic Diuretics (Questions 111 - 120)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 2,
    title: 'Potassium-Sparing Diuretics, Carbonic Anhydrase Inhibitors & Osmotics',
    subtitle: 'ENaC pore blockers, steroidal MRAs, CA active-site Zn2+ coordination, and non-reabsorbable osmotic polyols',
    sections: [
      {
        sectionTitle: 'Potassium-Sparing Diuretics (ENaC Blockers & Aldosterone Antagonists)',
        questions: [
          {
            id: 111,
            questionNumberLabel: 'Question 11',
            title: 'Triamterene: Pteridine Pharmacophore & ENaC Blockade',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Triamterene is a potassium-sparing diuretic containing a basic pteridine heterocyclic core (2,4,7-triamino-6-phenylpteridine). What is its precise mechanism of action and primary active hepatic metabolite?',
            options: [
              'Directly plugs the pore of the epithelial sodium channel (ENaC) in the cortical collecting duct; metabolized to an active 4\'-hydroxy-triamterene sulfate ester',
              'Competitively blocks cytosolic mineralocorticoid receptors; metabolized to canrenone',
              'Inhibits the basolateral Na+/K+ ATPase pump; metabolized to an active glucuronide conjugate',
              'Acts as a competitive antagonist at vascular V1a receptors; metabolized to lysine-vasopressin'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Triamterene contains a basic pteridine core and acts as a direct blocker of the epithelial sodium channel (ENaC) in late distal tubules and cortical collecting ducts. In the liver, it is rapidly hydroxylated at the para position of the phenyl ring and conjugated to form 4\'-hydroxy-triamterene sulfate, which retains significant diuretic activity.',
              'Incorrect: Mineralocorticoid receptor antagonism and metabolism to canrenone describe spironolactone.',
              'Incorrect: Digoxin inhibits Na+/K+ ATPase, not triamterene.',
              'Incorrect: V1a antagonism and conversion to lysine-vasopressin describe terlipressin.'
            ],
            overallExplanation: 'Triamterene is a pteridine-based potassium-sparing diuretic. Unlike spironolactone, its action is independent of aldosterone; it directly blocks luminal ENaC channels in the late distal tubule and collecting duct. This prevents Na+ entry, eliminating the negative lumen potential that normally pulls K+ and H+ into the urine. Hepatic CYP450 oxidizes it to 4\'-hydroxy-triamterene, which is sulfated to an active metabolite.',
            highYieldPearl: 'Triamterene: Pteridine ring; directly plugs luminal ENaC (aldosterone-independent). Rapidly metabolized to active 4\'-hydroxy-triamterene sulfate.',
            sourceReference: '2)_Renal_Drugs.pdf, Slides 43-45'
          },
          {
            id: 112,
            questionNumberLabel: 'Question 12',
            title: 'Amiloride: Acylguanidine Basicity & ENaC Pore Plugging',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Amiloride is an acylguanidine potassium-sparing diuretic. Its guanidinium group has a basic pKa of 8.7. Why is this basicity critical for its pharmacological activity at physiological pH (7.4)?',
            options: [
              'At pH 7.4, it is predominantly protonated as a positively charged guanidinium cation, which electrostatically mimics hydrated Na+ and physically plugs the outer vestibule of the ENaC pore',
              'At pH 7.4, it is uncharged and highly lipophilic, enabling rapid passive diffusion across the lipid bilayer into the nucleus',
              'At pH 7.4, it forms a covalent Schiff base with lysine residues on the NCC cotransporter in the DCT',
              'At pH 7.4, it undergoes rapid spontaneous hydrolysis into urea and pyrazine-2-carboxylic acid'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: The guanidine moiety of amiloride has a pKa of 8.7, meaning that at physiological pH (7.4), >95% exists as a resonance-stabilized, positively charged guanidinium cation. This positive charge mimics the incoming hydrated sodium ion, allowing amiloride to bind with high affinity to negatively charged residues in the outer mouth/vestibule of ENaC, plugging the pore.',
              'Incorrect: At pH 7.4, amiloride is heavily ionized (cationic), not neutral or lipophilic.',
              'Incorrect: Amiloride does not form covalent Schiff bases; it acts via reversible electrostatic plugging of ENaC.',
              'Incorrect: Amiloride is chemically stable and eliminated largely unchanged in the urine.'
            ],
            overallExplanation: 'Amiloride is a pyrazinoylguanidine derivative. Because its guanidino functional group has a pKa of 8.7, it exists primarily in the cationic (protonated) form in physiological fluids. The protonated guanidinium ion electrostatically mimics Na+ and lodges into the selectivity filter of ENaC, directly blocking Na+ reabsorption and conserving K+.',
            highYieldPearl: 'Amiloride: Pyrazinoylguanidine (pKa 8.7); ionized cation at pH 7.4 plugs the outer mouth of ENaC. Excreted largely unchanged by the kidneys.',
            sourceReference: '2)_Renal_Drugs.pdf, Slide 46'
          },
          {
            id: 113,
            questionNumberLabel: 'Question 13',
            title: 'Spironolactone: 17-Spirolactone SAR, Canrenone & Endocrine Effects',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Spironolactone contains a 17-spirolactone ring and a 7alpha-acetylthio group. What active metabolite is responsible for much of its long-term biological activity, and why does spironolactone cause gynecomastia and menstrual irregularities?',
            options: [
              'Canrenone; spironolactone and canrenone non-selectively cross-react with and antagonize androgen receptors while acting as partial agonists at progesterone receptors',
              'Dexamethasone; it activates glucocorticoid receptors in breast tissue to stimulate ductal hypertrophy',
              'Desmopressin; it stimulates pituitary prolactin release via activation of central V1b receptors',
              'Eplerenone; it undergoes spontaneous epoxidation in the liver to block luteinizing hormone'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Spironolactone is extensively metabolized via dethioacetylation to canrenone (which contains a 4,6-diene-3-one system and intact 17-spirolactone ring) and 7alpha-thiomethylspironolactone. Because spironolactone and canrenone lack complete selectivity for the mineralocorticoid receptor, they bind and antagonize androgen receptors (antiandrogenic) and bind progesterone receptors, causing gynecomastia, breast tenderness, and menstrual irregularities.',
              'Incorrect: Spironolactone is not metabolized to dexamethasone.',
              'Incorrect: Desmopressin is a peptide, completely unrelated to steroidal spironolactone metabolism.',
              'Incorrect: Spironolactone is not converted to eplerenone in vivo; eplerenone is a distinct synthetic chemical entity.'
            ],
            overallExplanation: 'Spironolactone is a steroidal competitive antagonist of the cytosolic mineralocorticoid receptor (MR). In vivo, it is rapidly converted to active metabolites, most notably canrenone (elimination half-life ~16–20 hours). Due to structural similarity to steroid sex hormones, spironolactone antagonizes androgen receptors and stimulates progesterone receptors, causing antiandrogenic adverse effects (gynecomastia, impotence, menstrual irregularities).',
            highYieldPearl: 'Spironolactone has a 17-spirolactone + 7alpha-thioacetyl. Active metabolite = canrenone. Cross-reacts with androgen/progesterone receptors -> gynecomastia!',
            sourceReference: '2)_Renal_Drugs.pdf, Slides 47-50'
          },
          {
            id: 114,
            questionNumberLabel: 'Question 14',
            title: 'Eplerenone: 9,11-Epoxide Bridge & Receptor Selectivity',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Eplerenone was specifically engineered to overcome the endocrine side effects of spironolactone. What structural modification was introduced, and how does it alter receptor binding affinity?',
            options: [
              'Incorporation of a 9alpha,11alpha-epoxy bridge and replacement of the 7alpha-acetylthio with a carbomethoxy group, drastically reducing affinity for androgen and progesterone receptors',
              'Removal of the steroid cyclopentanoperhydrophenanthrene core, replacing it with a flexible benzoxazine ring',
              'Addition of an alpha,beta-unsaturated ketone that covalently locks the mineralocorticoid receptor in an active conformation',
              'Attachment of a 17-alpha ethinyl group that enhances affinity for estrogen receptors by 500-fold'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Eplerenone (Inspra) features a 9alpha,11alpha-epoxide bridge across ring C and a 7alpha-carbomethoxy (-COOCH3) group in place of spironolactone\'s 7alpha-acetylthio group. The rigid 9,11-epoxide induces steric constraints that diminish affinity for androgen receptors (>1000-fold lower) and progesterone receptors (>100-fold lower), thereby eliminating gynecomastia.',
              'Incorrect: Eplerenone retains the four-ring steroid nucleus.',
              'Incorrect: Eplerenone is a reversible competitive antagonist, not a covalent activator.',
              'Incorrect: Eplerenone does not have a 17-alpha ethinyl group and does not activate estrogen receptors.'
            ],
            overallExplanation: 'Eplerenone is a second-generation selective mineralocorticoid receptor antagonist. The key structural modification is the introduction of a 9alpha,11alpha-epoxy oxygen bridge on ring C and a C7 carbomethoxy group. This modification produces high selectivity for the mineralocorticoid receptor and virtually eliminates binding to androgen and progesterone receptors, sparing patients from gynecomastia.',
            highYieldPearl: 'Eplerenone has a 9,11-epoxide bridge + 7-carbomethoxy. Highly selective for MR (>1000x less androgen binding) -> NO gynecomastia!',
            sourceReference: '2)_Renal_Drugs.pdf, Slide 51'
          },
          {
            id: 115,
            questionNumberLabel: 'Question 15',
            title: 'Carbonic Anhydrase Inhibitors: Nephron Site & Physiological Consequences',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Carbonic anhydrase inhibitors (CAIs) such as acetazolamide exert their primary diuretic action in which nephron segment, and what urinary and systemic acid-base alterations do they induce?',
            options: [
              'Proximal convoluted tubule (PCT); block luminal and intracellular HCO3- reabsorption, producing alkaline urine (high pH) and mild hyperchloremic metabolic acidosis',
              'Medullary thick ascending limb; block H+/K+ exchange, producing acidic urine and severe hypochloremic metabolic alkalosis',
              'Distal convoluted tubule; block calcium reabsorption, producing hypercalcemic urine and respiratory acidosis',
              'Collecting duct; stimulate proton secretion via intercalated cells, producing acidic urine and systemic alkalosis'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: CAIs act predominantly in the proximal convoluted tubule (PCT), where ~85% of filtered bicarbonate is normally reabsorbed. By inhibiting luminal CA-IV and intracellular CA-II, they prevent the conversion of filtered HCO3- to CO2, impairing Na+/H+ exchange (NHE3). This results in loss of HCO3-, Na+, and water into the urine (alkaline urine, pH ~8) and causes systemic hyperchloremic metabolic acidosis.',
              'Incorrect: CAIs do not act in the medullary thick ascending limb and do not cause metabolic alkalosis.',
              'Incorrect: CAIs do not act primarily in the DCT and do not cause respiratory acidosis.',
              'Incorrect: CAIs impair, rather than stimulate, proton secretion and acid excretion.'
            ],
            overallExplanation: 'Carbonic anhydrase (CA) in the PCT hydrates intracellular CO2 to H2CO3 and dehydrates luminal H2CO3 to CO2. Inhibiting CA impairs proton generation for the luminal Na+/H+ antiporter (NHE3). As a result, sodium, bicarbonate, and water are excreted, rendering the urine alkaline and depleting systemic bicarbonate stores, which causes mild hyperchloremic metabolic acidosis.',
            highYieldPearl: 'CAIs (acetazolamide) act in the PCT: block HCO3- reabsorption -> alkaline urine (pH ~8) + hyperchloremic metabolic acidosis (self-limiting diuresis).',
            sourceReference: '2)_Renal_Drugs.pdf, Slides 53-56'
          },
          {
            id: 116,
            questionNumberLabel: 'Question 16',
            title: 'Acetazolamide SAR: Unsubstituted Sulfonamide & Catalytic Zn2+ Coordination',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Acetazolamide contains a 1,3,4-thiadiazole heterocyclic ring bearing an unsubstituted sulfonamide group (-SO2NH2). What is the strict structural requirement of this sulfonamide group for coordinating the catalytic zinc (Zn2+) ion in carbonic anhydrase?',
            options: [
              'The sulfonamide group must be completely unsubstituted (-SO2NH2); any alkyl or aryl substitution on the sulfonamide nitrogen completely abolishes enzyme inhibitory activity',
              'The sulfonamide nitrogen must be tertiary (-SO2N(CH3)2) to provide sufficient electron density for coordinate covalent bonding',
              'The sulfonamide group must be replaced by a sulfonic acid (-SO3H) to ionize at acidic active-site pH',
              'The sulfur atom must be reduced to a thiol (-SH) to form a covalent disulfide linkage with active-site cysteine'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: In all carbonic anhydrase inhibitors, an unsubstituted sulfonamide group (-SO2NH2) is strictly required. The deprotonated sulfonamido anion (-SO2NH-) coordinates directly to the catalytic divalent zinc ion (Zn2+) at the base of the active-site cone, displacing the catalytic water/hydroxide molecule. Any mono- or di-substitution on the sulfonamide nitrogen introduces steric clashes and prevents zinc coordination, abolishing activity.',
              'Incorrect: Tertiary sulfonamides cannot coordinate to Zn2+ and are completely inactive against carbonic anhydrase.',
              'Incorrect: Sulfonic acids (-SO3H) do not mimic the transition state and do not inhibit carbonic anhydrase.',
              'Incorrect: Thiols are not the pharmacophore for carbonic anhydrase inhibitors.'
            ],
            overallExplanation: 'The crystal structure of human carbonic anhydrase II reveals that the catalytic Zn2+ is coordinated by three histidine residues and a catalytic water/hydroxide ion. The ionized sulfonamide nitrogen of acetazolamide (-SO2NH-) mimics this water/hydroxide, binding directly to Zn2+. Alkyl or aryl substitution on this nitrogen prevents binding due to steric hindrance.',
            highYieldPearl: 'Acetazolamide SAR: MUST have an UNSUBSTITUTED sulfonamide (-SO2NH2). The deprotonated nitrogen coordinates directly to catalytic Zn2+. N-substitution kills activity!',
            sourceReference: '2)_Renal_Drugs.pdf, Slides 57-59'
          },
          {
            id: 117,
            questionNumberLabel: 'Question 17',
            title: 'Methazolamide SAR: Ring Methylation & Ocular Penetration',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Methazolamide is a methylated derivative of acetazolamide. Where is the methyl group located, and what biopharmaceutical advantage does it confer for the treatment of glaucoma?',
            options: [
              'It is located on nitrogen-3 of the thiadiazole ring (NOT on the sulfonamide), reducing ionization at physiological pH and enhancing corneal/ocular penetration',
              'It is located on the sulfonamide nitrogen, preventing renal clearance and extending half-life to 30 days',
              'It is located on the acetyl carbonyl carbon, converting the drug into an irreversible suicide inhibitor',
              'It is located on the sulfur atom of the thiadiazole ring, forming a sulfonium salt that selectively enters the lens'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Methazolamide has a methyl group at the N3 position of the thiadiazole ring (maintaining the essential unsubstituted -SO2NH2 group at C2). This N3-methylation reduces the pKa of the compound and decreases ionization at physiological pH, resulting in greater lipid solubility. Consequently, it penetrates ocular tissues and the blood-aqueous barrier more effectively than acetazolamide, allowing lower dosing.',
              'Incorrect: Methylation of the sulfonamide nitrogen would completely destroy CA inhibitory activity.',
              'Incorrect: Methazolamide is a reversible inhibitor, not an irreversible suicide inhibitor.',
              'Incorrect: The sulfur atom is not methylated.'
            ],
            overallExplanation: 'Methazolamide was rationally designed by adding a methyl group to position 3 of the 1,3,4-thiadiazoline ring. Crucially, the sulfonamide group at position 2 remains unsubstituted (-SO2NH2). This ring methylation lowers ionization at physiological pH, significantly improving lipophilicity and penetration into the ciliary body of the eye to suppress aqueous humor secretion in glaucoma.',
            highYieldPearl: 'Methazolamide has an N-methyl group on the THIADIAZOLE RING (N3), NOT the sulfonamide! Decreases ionization, increases lipophilicity and ocular penetration.',
            sourceReference: '2)_Renal_Drugs.pdf, Slide 60'
          },
          {
            id: 118,
            questionNumberLabel: 'Question 18',
            title: 'Dorzolamide & Brinzolamide: Topical Thienothiopyran CAIs for Glaucoma',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Dorzolamide and brinzolamide are second-generation carbonic anhydrase inhibitors formulated as ophthalmic solutions/suspensions for glaucoma. What structural framework enabled their topical administration, and what clinical drawback of oral acetazolamide do they eliminate?',
            options: [
              'Thienothiopyran bicyclic core with an alkylamine side chain providing amphiphilic water/lipid solubility for trans-corneal penetration; eliminates systemic metabolic acidosis, paresthesias, and hypokalemia',
              'Polyethylene glycol polymeric conjugate that adheres permanently to the conjunctival sac; eliminates the need for repeated daily instillation',
              'Steroid-like phenanthrene backbone that selectively binds ciliary muscle glucocorticoid receptors; eliminates ocular hypertension',
              'Quaternary ammonium salt that prevents ocular absorption, acting purely on eyelid meibomian glands'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Dorzolamide and brinzolamide are thienothiopyran-2-sulfonamide derivatives engineered with an alkylamino side chain. This amphiphilic design provides balanced aqueous solubility (for ophthalmic eyedrop formulation at physiological pH) and corneal lipophilicity (to penetrate the corneal epithelium/stroma/endothelium). Topical administration delivers high drug concentrations to the ciliary epithelium, lowering IOP while virtually eliminating the systemic adverse effects of oral CAIs (metabolic acidosis, fatigue, paresthesias, kidney stones).',
              'Incorrect: They are small molecules with thienothiopyran cores, not PEG conjugates.',
              'Incorrect: They are non-steroidal carbonic anhydrase inhibitors, not glucocorticoid agonists.',
              'Incorrect: They penetrate the cornea to reach the ciliary processes; they are not quaternary salts restricted to eyelids.'
            ],
            overallExplanation: 'Oral acetazolamide causes substantial systemic side effects (fatigue, depression, paresthesias, anorexia, metabolic acidosis). Dorzolamide and brinzolamide solved this problem through a thienothiopyran scaffold bearing an unsubstituted sulfonamide and an alkylamino group. This gives amphiphilic properties ideal for corneal penetration, providing targeted topical reduction of aqueous humor production without systemic CA inhibition.',
            highYieldPearl: 'Dorzolamide & Brinzolamide: Thienothiopyran ring; topical eye drops for glaucoma. Penetrate cornea to block ciliary CA-II without systemic metabolic acidosis!',
            sourceReference: '2)_Renal_Drugs.pdf, Slides 61-63'
          },
          {
            id: 119,
            questionNumberLabel: 'Question 19',
            title: 'Dichlorphenamide: Benzene-1,3-Disulfonamide for Periodic Paralysis',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Dichlorphenamide contains a benzene-1,3-disulfonamide core with two chlorine substituents. Beyond refractory open-angle glaucoma, what unique FDA-approved neurological indication does dichlorphenamide possess?',
            options: [
              'Primary hyperkalemic and hypokalemic periodic paralysis',
              'Amyotrophic lateral sclerosis (ALS) bulbar onset',
              'Refractory temporal lobe focal epilepsy in pediatric patients',
              'Parkinsonian resting tremor unresponsive to levodopa'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Dichlorphenamide (Keveyis) is FDA-approved for treating primary hyperkalemic and hypokalemic periodic paralysis (genetic channelopathies). Its inhibition of carbonic anhydrase produces a mild metabolic acidosis and alters intracellular/extracellular ion gradients, stabilizing muscle membrane excitability and reducing paralytic attack frequency.',
              'Incorrect: Riluzole and edaravone are used for ALS, not dichlorphenamide.',
              'Incorrect: While acetazolamide is used off-label for certain seizure types, dichlorphenamide\'s landmark unique indication is periodic paralysis.',
              'Incorrect: Anticholinergics and dopaminergic agents are used for Parkinsonian tremor.'
            ],
            overallExplanation: 'Dichlorphenamide is a benzene-1,3-disulfonamide derivative bearing two unsubstituted sulfonamides (-SO2NH2) and two chlorine atoms. In addition to glaucoma, it is specifically approved for primary periodic paralysis (both hypokalemic and hyperkalemic variants), where its CA inhibition and mild acidosis stabilize muscle membrane potentials.',
            highYieldPearl: 'Dichlorphenamide: Benzene-1,3-disulfonamide with two -Cl atoms. FDA-approved for hyperkalemic and hypokalemic periodic paralysis (as well as glaucoma).',
            sourceReference: '2)_Renal_Drugs.pdf, Slide 64'
          },
          {
            id: 120,
            questionNumberLabel: 'Question 20',
            title: 'Mannitol: Osmotic Diuresis, Intracranial Pressure & Biopharmaceutics',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Mannitol is a hexahydric polyalcohol (MW 182 Da, logP -3.1). Which set of physicochemical, pharmacokinetic, and clinical properties accurately characterizes mannitol as an osmotic diuretic?',
            options: [
              'Freely filtered at the glomerulus, poorly reabsorbed by tubular cells, administered strictly via intravenous infusion (causes osmotic diarrhea if given orally), and used to reduce intracranial pressure (ICP) and intraocular pressure (IOP)',
              'Highly lipophilic, rapidly absorbed after oral administration, distributed into intracellular adipose stores, and used to promote urinary alkalinization',
              'Acts as a covalent inhibitor of the Na+/K+/2Cl- cotransporter in the thick ascending limb, administered sublingually for angina',
              'Peptide macromolecule that activates renal V2 receptors to promote solute-free water excretion'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Mannitol is a highly water-soluble, polyhydroxylated 6-carbon sugar alcohol (hexahydric alcohol; logP -3.1). It is not absorbed orally (oral administration causes severe osmotic diarrhea). Given intravenously, it is freely filtered by glomeruli but undergoes negligible tubular reabsorption, creating an osmotic gradient that retains water in the proximal tubule and descending limb of Henle. It extracts water from brain parenchyma into the intravascular compartment to acutely lower intracranial pressure (ICP) in cerebral edema and reduce IOP in acute glaucoma.',
              'Incorrect: Mannitol is extremely hydrophilic (logP -3.1), not lipophilic, and cannot be given orally for diuresis.',
              'Incorrect: Mannitol is an osmotic agent, not a covalent NKCC2 inhibitor.',
              'Incorrect: Mannitol is a small polyol, not a peptide, and does not activate V2 receptors.'
            ],
            overallExplanation: 'Mannitol is a hexahydric alcohol (stereoisomer of sorbitol). Because of its high hydrophilicity and lack of transport carriers, it cannot cross biological membranes by passive diffusion. Given IV, it expands intravascular volume and draws water osmotically from the brain parenchyma and vitreous humor. In the nephron, it remains trapped in the tubular lumen, driving osmotic water diuresis.',
            highYieldPearl: 'Mannitol: Polyhydric alcohol (logP -3.1), IV only (oral = osmotic diarrhea). Freely filtered, not reabsorbed. Used for acute cerebral edema (lowers ICP) and acute glaucoma (lowers IOP).',
            sourceReference: '2)_Renal_Drugs.pdf, Slides 66-68'
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // PAGE 3: ADH Agonists/Vaptans & Potassium Binders (Questions 121 - 130)
  // ---------------------------------------------------------------------------
  {
    pageNumber: 3,
    title: 'Vasopressin Agonists, Vaptans & Potassium Binders',
    subtitle: 'Arginine vasopressin analogues, V2-selective aquaretics, boxed warnings, and cation-exchange resins/crystals',
    sections: [
      {
        sectionTitle: 'Vasopressin Agonists & Vaptan Aquaretics',
        questions: [
          {
            id: 121,
            questionNumberLabel: 'Question 21',
            title: 'Arginine Vasopressin (AVP): Peptide Structure & Receptor Subtypes',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Arginine vasopressin (AVP) is an endogenous cyclic nonapeptide. Which structural feature maintains its cyclic conformation, and what biological responses are mediated by its V1a and V2 receptors, respectively?',
            options: [
              'Intramolecular disulfide bridge between Cys1 and Cys6; V1a mediates vascular smooth muscle contraction (vasoconstriction), while V2 mediates Gs-coupled aquaporin-2 (AQP2) water channel translocation in collecting duct principal cells',
              'Intermolecular thioester bond between Met3 and Cys8; V1a mediates renal potassium secretion, while V2 mediates bronchial dilation',
              'Beta-lactam ring between Ala2 and Gly7; V1a activates renin release, while V2 causes systemic vasodilation',
              'Proline cis-trans isomerism; V1a triggers cardiac contractility, while V2 induces aldosterone gene expression'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: AVP is a nonapeptide (CYFQNCPRG-NH2) with an intramolecular disulfide bond between Cys1 and Cys6 that forms a 6-amino-acid cyclic ring with a 3-amino-acid C-terminal tail. V1a receptors (Gq-coupled) stimulate vascular smooth muscle contraction (vasoconstriction). V2 receptors (Gs-coupled) stimulate adenylyl cyclase, raising cAMP and triggering exocytosis of aquaporin-2 (AQP2) water channels into the apical membrane of collecting duct principal cells.',
              'Incorrect: The cyclic ring is formed by a Cys1-Cys6 disulfide bond, not a Met3-Cys8 thioester.',
              'Incorrect: Vasopressin lacks beta-lactam rings.',
              'Incorrect: V1a mediates vasoconstriction, and V2 mediates water reabsorption via AQP2, not aldosterone gene expression.'
            ],
            overallExplanation: 'Arginine vasopressin (AVP / ADH) features a 16-membered cyclic ring formed by a Cys1–Cys6 disulfide bridge. Its major clinical targets are: V1a receptors on vascular smooth muscle (coupled to Gq/PLC/IP3/Ca2+, inducing intense vasoconstriction), and V2 receptors on renal collecting duct principal cells (coupled to Gs/cAMP/PKA, promoting AQP2 apical translocation for water reabsorption).',
            highYieldPearl: 'Vasopressin: Cyclic nonapeptide with Cys1-Cys6 disulfide bridge. V1a = Gq -> vasoconstriction; V2 = Gs -> cAMP -> apical AQP2 insertion (water reabsorption).',
            sourceReference: '2)_Renal_Drugs.pdf, Slides 72-76'
          },
          {
            id: 122,
            questionNumberLabel: 'Question 22',
            title: 'Desmopressin (DDAVP) SAR: 1-Deamino & 8-D-Arginine Modifications',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Desmopressin (DDAVP) is a synthetic analogue of vasopressin. What are the two critical chemical modifications in desmopressin, and what pharmacological advantages do they provide over native vasopressin?',
            options: [
              'Deamination at position 1 (1-deamino) and substitution of L-arginine with D-arginine at position 8 (8-D-Arg); confers resistance to aminopeptidases (prolonging half-life) and increases V2 selectivity >2000-fold over V1a (eliminating pressor vasoconstriction)',
              'Acetylation at position 1 and replacement of phenylalanine at position 3 with alanine; eliminates all renal activity and converts the molecule into a selective V1a agonist',
              'Methylation of Cys1 and cyclization with aspartate; prevents hepatic clearance and allows sublingual absorption without binding V2 receptors',
              'Addition of three N-terminal glycyl residues; converts the peptide into a depot prodrug for refractory vasodilatory shock'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Desmopressin (1-deamino-8-D-arginine vasopressin) incorporates two rational design modifications: (1) Removal of the N-terminal amino group on Cys1 (1-deamino), which confers resistance to metabolic degradation by aminopeptidases, prolonging its half-life from ~15 minutes to ~2-3 hours; and (2) Inversion of stereochemistry at position 8 from L-arginine to D-arginine (8-D-Arg), which virtually abolishes V1a vasoconstrictor activity while maintaining high V2 antidiuretic affinity (>2000:1 V2:V1a selectivity).',
              'Incorrect: Desmopressin is selective for V2, not V1a.',
              'Incorrect: Cys1 is deaminated (3-mercaptopropionyl), not methylated, and it binds avidly to V2.',
              'Incorrect: Addition of three glycyl residues describes terlipressin, not desmopressin.'
            ],
            overallExplanation: 'Desmopressin (DDAVP) represents a masterclass in peptide medicinal chemistry. Removing the Cys1 alpha-amino group (1-deamino) protects against aminopeptidases, extending duration of action. Changing 8-L-Arg to 8-D-Arg eliminates pressor (V1a) activity while maintaining V2 efficacy (V2:V1a ratio >2000:1). It is used for central diabetes insipidus, nocturnal enuresis, and to release vWF/Factor VIII in von Willebrand disease and hemophilia A.',
            highYieldPearl: 'Desmopressin (DDAVP): 1-deamino (longer t1/2, resists aminopeptidases) + 8-D-Arg (V2:V1a selectivity >2000:1 -> no pressor vasoconstriction). Treats central DI & vWD/Hemophilia A!',
            sourceReference: '2)_Renal_Drugs.pdf, Slides 77-80'
          },
          {
            id: 123,
            questionNumberLabel: 'Question 23',
            title: 'Terlipressin: Triglycyl Prodrug for Hepatorenal Syndrome',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Terlipressin (N-alpha-triglycyl-8-lysine vasopressin) is an engineered prodrug. How does it release active drug in vivo, and what is its primary hemodynamic application in hepatorenal syndrome?',
            options: [
              'Endogenous endothelial and tissue peptidases slowly cleave the three N-terminal glycyl residues, releasing active lysine-vasopressin over several hours; selectively constricts dilated splanchnic arterial beds to restore renal perfusion pressure',
              'Gastric pepsin cleaves the molecule into free phenylalanine, which stimulates renal tubular dopamine receptors to induce natriuresis',
              'Hepatic CYP3A4 hydroxylates the glycine residues into formaldehydes, releasing vasopressin into the systemic circulation to induce pulmonary vasodilation',
              'Colonic microflora hydrolyze an ester bond to release conivaptan into the portal circulation'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Terlipressin is a synthetic peptide prodrug containing three glycine residues attached to the amino-terminal of [8-lysine]-vasopressin. In vivo, tissue aminopeptidases slowly cleave the glycyl residues, releasing active lysine-vasopressin gradually over several hours ("slow-release" pharmacokinetics). It produces potent, sustained splanchnic vasoconstriction via V1a receptors, reducing portal hypertension and diverting blood to the systemic circulation to restore renal blood flow in hepatorenal syndrome.',
              'Incorrect: Terlipressin is administered IV and cleaved by systemic peptidases, not gastric pepsin.',
              'Incorrect: Cleavage is mediated by peptidases, not CYP3A4, and it causes vasoconstriction, not pulmonary vasodilation.',
              'Incorrect: Terlipressin is a peptide, completely unrelated to non-peptide vaptans like conivaptan.'
            ],
            overallExplanation: 'Terlipressin is an N-triglycyl prodrug of lysine-vasopressin. Cleavage of the three glycyl residues by circulating exopeptidases provides sustained, controlled release of active [Lys8]-vasopressin. In patients with cirrhosis and hepatorenal syndrome (HRS) or bleeding esophageal varices, terlipressin stimulates splanchnic V1a receptors, reversing splanchnic arterial vasodilation and restoring effective arterial blood volume and renal perfusion.',
            highYieldPearl: 'Terlipressin: Triglycyl prodrug slowly cleaved by tissue peptidases to active [Lys8]-vasopressin. Selective V1a splanchnic vasoconstrictor for hepatorenal syndrome & variceal bleeding.',
            sourceReference: '2)_Renal_Drugs.pdf, Slides 81-83'
          },
          {
            id: 124,
            questionNumberLabel: 'Question 24',
            title: 'Vaptans: Non-Peptide Aquaretics & Mechanism of Water Diuresis',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'The "vaptans" represent a distinct therapeutic class termed "aquaretics". How does the pharmacological action of a vaptan differ fundamentally from that of a conventional natriuretic diuretic (e.g., furosemide or HCTZ)?',
            options: [
              'Vaptans competitively antagonize V2 receptors to promote excretion of solute-free water without increasing urinary excretion of electrolytes (Na+, K+, Cl-)',
              'Vaptans inhibit carbonic anhydrase to excrete bicarbonate and potassium while retaining water',
              'Vaptans stimulate NKCC2 in the thick ascending limb to trap sodium inside epithelial cells',
              'Vaptans act as selective mineralocorticoid receptor agonists to stimulate proton excretion'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Conventional diuretics (furosemide, HCTZ) are natriuretic agents: they block ion transporters (NKCC2, NCC), resulting in coupled excretion of sodium, chloride, and osmotic water. In contrast, vaptans (tolvaptan, conivaptan) are "aquaretics": by blocking basolateral V2 receptors in collecting duct principal cells, they prevent AQP2 insertion and induce excretion of solute-free water ("aquaresis") without significant urinary electrolyte loss, thereby elevating serum sodium.',
              'Incorrect: Vaptans do not inhibit carbonic anhydrase.',
              'Incorrect: Vaptans do not stimulate NKCC2; they act downstream on V2 receptors in the collecting duct.',
              'Incorrect: Vaptans are antagonists at vasopressin receptors, not MR agonists.'
            ],
            overallExplanation: 'Vaptans are non-peptide competitive antagonists of arginine vasopressin receptors. Unlike loop or thiazide diuretics that promote natriuresis (loss of sodium and water), vaptans block V2-mediated water reabsorption in the renal medullary collecting ducts. This produces aquaresis—the selective excretion of solute-free water—raising serum sodium concentrations in euvolemic and hypervolemic hyponatremia.',
            highYieldPearl: 'Vaptans are "aquaretics": block V2 receptors in collecting ducts -> free water excretion without electrolyte loss. Elevates serum sodium in SIADH and heart failure.',
            sourceReference: '2)_Renal_Drugs.pdf, Slides 85-88'
          },
          {
            id: 125,
            questionNumberLabel: 'Question 25',
            title: 'Conivaptan: Dual V1a/V2 Antagonist & CYP3A4 Interaction Profile',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Conivaptan is a non-peptide vasopressin antagonist. What receptor selectivity, administration route, and significant metabolic liability distinguish conivaptan from tolvaptan?',
            options: [
              'Dual V1a/V2 receptor antagonist; administered intravenously only; potent mechanism-based inhibitor of CYP3A4 requiring strict avoidance of CYP3A4 substrates',
              'Selective V2 receptor antagonist; administered orally only; potent inducer of CYP2C9',
              'Selective V1b receptor antagonist; administered as a transdermal patch; completely devoid of hepatic metabolism',
              'Dual V2/aldosterone receptor agonist; administered by subcutaneous injection; cleared 100% by hemodialysis'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Conivaptan (Vaprisol) is a dual antagonist at both V1a and V2 receptors. Because of poor oral bioavailability and formulation challenges, it is approved only for intravenous (IV) infusion (often formulated in propylene glycol/ethanol). Importantly, conivaptan is a potent, irreversible/mechanism-based inhibitor of CYP3A4, which can dramatically increase serum levels of co-administered CYP3A4 substrates (e.g., statins, midazolam, calcineurin inhibitors).',
              'Incorrect: Selective oral V2 antagonist describes tolvaptan, not conivaptan.',
              'Incorrect: Conivaptan does not target V1b and is not a transdermal patch.',
              'Incorrect: Conivaptan is an antagonist, not an agonist, and is formulated for IV infusion.'
            ],
            overallExplanation: 'Conivaptan blocks both vascular V1a receptors and renal V2 receptors. Approved for in-hospital treatment of euvolemic and hypervolemic hyponatremia, it is given as an IV loading dose followed by continuous IV infusion. Conivaptan is a potent inhibitor of CYP3A4, requiring clinicians to avoid concurrent administration with drugs metabolized by CYP3A4 to prevent severe toxicity.',
            highYieldPearl: 'Conivaptan: DUAL V1a/V2 antagonist; IV only. Potent CYP3A4 inhibitor (causes major drug-drug interactions with CYP3A4 substrates).',
            sourceReference: '2)_Renal_Drugs.pdf, Slides 89-91'
          },
          {
            id: 126,
            questionNumberLabel: 'Question 26',
            title: 'Tolvaptan: Oral V2 Selectivity, Boxed Warnings & Clinical Applications',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Tolvaptan is an orally bioavailable, selective V2 receptor antagonist (benzazepine derivative) used for SIADH and autosomal dominant polycystic kidney disease (ADPKD). What two Boxed Warnings are associated with tolvaptan therapy?',
            options: [
              'Risk of Osmotic Demyelination Syndrome (ODS) if serum sodium is corrected too rapidly (>10–12 mEq/L/day), and potential for severe, irreversible hepatotoxicity (limiting use for hyponatremia to ≤30 days)',
              'Risk of fatal agranulocytosis and severe pulmonary fibrosis requiring monthly chest radiographs',
              'Risk of malignant hyperthermia and immediate Achilles tendon rupture',
              'Risk of irreversible peripheral neuropathy and sudden sensory neural hearing loss'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Tolvaptan carries two major FDA Boxed Warnings: (1) Osmotic Demyelination Syndrome (ODS / central pontine myelinolysis): If hyponatremia is corrected too rapidly (>10-12 mEq/L over 24 hours), rapid fluid shifts can cause demyelination of the pons, leading to dysarthria, mutism, quadriparesis, and death. Therapy must be initiated in a hospital where serum sodium can be closely monitored. (2) Hepatotoxicity: Tolvaptan can cause severe, potentially fatal liver injury; for hyponatremia, treatment is strictly limited to <=30 days, and in ADPKD (Jynarque), it requires a REMS program with strict baseline and monthly transaminase monitoring.',
              'Incorrect: Agranulocytosis and pulmonary fibrosis describe clozapine and amiodarone.',
              'Incorrect: Tendon rupture is a black box warning for fluoroquinolones.',
              'Incorrect: Hearing loss is associated with aminoglycosides and loop diuretics, not tolvaptan.'
            ],
            overallExplanation: 'Tolvaptan is an oral, selective V2 receptor antagonist featuring a benzazepine core. In the treatment of hyponatremia, rapid correction of serum sodium must be strictly avoided to prevent osmotic demyelination syndrome (ODS). Furthermore, clinical trials in ADPKD revealed significant drug-induced liver injury, prompting a Boxed Warning that limits hyponatremia therapy to 30 days and mandates REMS liver monitoring in ADPKD.',
            highYieldPearl: 'Tolvaptan: Oral selective V2 antagonist. Boxed Warnings: 1) Osmotic Demyelination Syndrome (ODS) if Na+ corrected >10–12 mEq/L/24h; 2) Hepatotoxicity (limit hyponatremia use to <=30 days).',
            sourceReference: '2)_Renal_Drugs.pdf, Slides 92-95'
          },
          {
            id: 127,
            questionNumberLabel: 'Question 27',
            title: 'Hyperkalemia Pathophysiology & Multi-Phase Management Strategy',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'In patients with severe acute hyperkalemia (serum K+ > 6.5 mEq/L with peaked T waves and QRS widening on ECG), what is the immediate first-line pharmacological intervention and its physiological rationale, prior to potassium elimination?',
            options: [
              'Intravenous calcium gluconate or calcium chloride; immediately antagonizes the cardiac membrane excitability by stabilizing the threshold potential without altering serum potassium concentration',
              'Oral patiromer; immediately binds potassium ions in the stomach within 30 seconds of swallowing',
              'Intravenous furosemide; lowers serum potassium within 1 minute by inhibiting potassium reabsorption in the collecting duct',
              'Subcutaneous desmopressin; stimulates aquaporin water channels to dilute extracellular potassium ions'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: In acute hyperkalemic emergencies with ECG changes, the immediate first step is intravenous calcium (calcium gluconate or chloride). Calcium does NOT lower serum potassium; rather, it directly stabilizes cardiac myocyte membranes by raising the threshold potential, restoring normal membrane excitability and preventing fatal ventricular fibrillation. Subsequent steps include shifting K+ intracellularly (insulin + dextrose, albuterol) and eliminating K+ from the body (loop diuretics, hemodialysis, potassium binders).',
              'Incorrect: Oral potassium binders (patiromer, Lokelma, SPS) have delayed onsets of action (hours) and are ineffective for emergency cardiac stabilization.',
              'Incorrect: Furosemide promotes kaliuresis over hours, not within 1 minute, and does not stabilize the cardiac membrane.',
              'Incorrect: Desmopressin does not treat hyperkalemia and would cause dangerous water retention.'
            ],
            overallExplanation: 'Severe hyperkalemia depolarizes the resting membrane potential of cardiac myocytes toward the threshold potential, inactivating voltage-gated sodium channels and causing lethal arrhythmias. IV calcium immediately stabilizes the cardiac resting membrane potential by shifting the action potential threshold, buying time for intracellular potassium shifting (insulin, albuterol) and total-body potassium elimination.',
            highYieldPearl: 'Hyperkalemia emergency: 1) IV Calcium (stabilizes cardiac membrane; does NOT lower K+); 2) Insulin + Dextrose / Albuterol (shifts K+ intracellularly); 3) Binders / Diuretics / Dialysis (eliminates K+).',
            sourceReference: '2)_Renal_Drugs.pdf, Slides 97-100'
          },
          {
            id: 128,
            questionNumberLabel: 'Question 28',
            title: 'Sodium Polystyrene Sulfonate (SPS / Kayexalate): Mechanism & Colonic Necrosis Risk',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Sodium polystyrene sulfonate (SPS, Kayexalate) is a traditional cation-exchange resin. What is its chemical composition, exchange mechanism, and the severe gastrointestinal toxicity that prompted FDA warnings against co-administration with sorbitol?',
            options: [
              'Cross-linked polystyrene sulfonate resin in sodium form; exchanges luminal Na+ for K+ in the large intestine; co-administration with sorbitol (administered to prevent impaction) is associated with intestinal necrosis and bowel perforation',
              'Soluble polysaccharide polymer; exchanges Ca2+ for K+ in the stomach; co-administration with sorbitol causes acute hemorrhagic pancreatitis',
              'Inorganic magnesium silicate crystal; binds potassium covalently; co-administration with sorbitol causes gastric bezoar formation',
              'Cross-linked dextran bead; hydrolyzes potassium ions in the duodenum; co-administration with sorbitol causes toxic megacolon via Clostridioides difficile'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Sodium polystyrene sulfonate (SPS) is an insoluble, cross-linked polystyrene resin functionalized with sulfonic acid groups loaded with sodium ions. As it passes through the gastrointestinal tract (predominantly in the colon where K+ concentrations are highest), each gram binds approximately 1 mEq of K+ in exchange for 1-2 mEq of Na+. Historical formulations included 70% sorbitol to prevent resin impaction; however, sorbitol-induced hyperosmotic injury combined with resin deposition has caused severe intestinal necrosis, bowel infarction, and perforation (FDA Boxed Warning).',
              'Incorrect: SPS is an insoluble synthetic resin, not a soluble polysaccharide.',
              'Incorrect: SPS is an organic polymer, not an inorganic magnesium crystal (that describes Lokelma, which is zirconium silicate).',
              'Incorrect: SPS is polystyrene sulfonate, not dextran beads.'
            ],
            overallExplanation: 'Sodium polystyrene sulfonate (SPS / Kayexalate) is a non-absorbed sulfonic cation-exchange resin. It binds K+ non-selectively in the distal colon in exchange for Na+. The FDA issued a serious safety warning regarding intestinal necrosis, ischemic colitis, and gastrointestinal perforation, particularly when premixed with hypertonic sorbitol. The FDA recommends avoiding sorbitol with SPS.',
            highYieldPearl: 'SPS (Kayexalate): Polystyrene sulfonate resin (exchanges Na+ for K+). Danger: Intestinal necrosis and bowel perforation when co-administered with SORBITOL!',
            sourceReference: '2)_Renal_Drugs.pdf, Slides 101-104'
          },
          {
            id: 129,
            questionNumberLabel: 'Question 29',
            title: 'Patiromer (Veltassa): Fluorinated Polymer, Calcium Exchange & Drug Separation',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Patiromer (Veltassa) is a non-absorbed potassium-binding polymer. What is its exchange cation, why is it advantageous over SPS in patients with heart failure or hypertension, and why must it be separated from other oral medications by at least 3 hours?',
            options: [
              'Uses calcium-sorbitol as its counterion complex (exchanging Ca2+ for K+), avoiding systemic sodium loading in heart failure; must be separated by 3 hours because it non-specifically binds other oral drugs in the gastrointestinal lumen',
              'Uses potassium as its counterion complex; avoids calcium nephrolithiasis; must be separated by 3 hours due to CYP3A4 inhibition in enterocytes',
              'Uses magnesium as its counterion; avoids hypercalcemia; must be separated by 3 hours because it accelerates gastric emptying',
              'Uses aluminum as its counterion; prevents phosphate absorption; must be separated by 3 hours to prevent precipitation in the bile duct'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Patiromer is a cross-linked polymer of 2-fluoroacrylic acid with 1,7-octadiene and divinylbenzene, formulated as a calcium-sorbitol complex. In the colon, it binds potassium in exchange for calcium (NOT sodium), eliminating the dangerous sodium load that SPS imparts on heart failure, CKD, and hypertensive patients. Because patiromer can non-specifically adsorb or bind other orally co-administered medications (e.g., ciprofloxacin, levothyroxine, metformin), the FDA mandates separating patiromer administration from other oral drugs by at least 3 hours.',
              'Incorrect: Patiromer exchanges calcium for potassium; it does not release potassium.',
              'Incorrect: Patiromer does not contain magnesium and is not absorbed, so it cannot inhibit CYP3A4.',
              'Incorrect: Patiromer contains calcium, not aluminum.'
            ],
            overallExplanation: 'Patiromer (Veltassa) is a fluorinated, non-absorbable cation-exchange polymer bead. It binds K+ primarily in the distal colon, where K+ is most concentrated, releasing calcium rather than sodium. This avoids sodium retention and volume overload in cardiovascular and renal patients. Because of its broad binding capacity, other oral drugs must be taken at least 3 hours before or 3 hours after patiromer.',
            highYieldPearl: 'Patiromer (Veltassa): Calcium-sorbitol polymer (exchanges Ca2+ for K+; no Na+ load -> safe in heart failure!). Must separate from oral meds by 3 hours (binds other drugs).',
            sourceReference: '2)_Renal_Drugs.pdf, Slides 105-108'
          },
          {
            id: 130,
            questionNumberLabel: 'Question 30',
            title: 'Sodium Zirconium Cyclosilicate (Lokelma): Inorganic Crystal Lattice & K+ Selectivity',
            category: 'Medicinal Chemistry SAR',
            type: 'multiple-choice',
            questionStem: 'Sodium zirconium cyclosilicate (Lokelma / ZS-9) represents a breakthrough in potassium-binding pharmacology. What unique chemical architecture confers its high selectivity for potassium ions over divalent cations (calcium and magnesium), and how fast is its clinical onset?',
            options: [
              'An insoluble inorganic crystalline lattice with uniform ~3-Angstrom micropores that precisely match the unhydrated ionic diameter of K+; exhibits rapid onset, lowering serum K+ within ~1 hour',
              'A flexible macrocyclic crown ether that forms covalent bonds with hydrated sodium ions; exhibits slow onset requiring 7 days of loading doses',
              'A linear polysaccharide with carboxylate groups that chelate magnesium ions; exhibits an intermediate onset of 24 hours',
              'A biodegradable lipid nanoparticle that encapsulates potassium channels in gut enterocytes; exhibits onset within 10 minutes'
            ],
            correctIndex: 0,
            optionExplanations: [
              'Correct: Sodium zirconium cyclosilicate (Lokelma / ZS-9) is an inorganic, insoluble crystalline compound composed of zirconium and silicon atoms arranged in a 3D microporous lattice. The uniform pore openings (~3 Angstroms) perfectly mimic the coordination sphere of physiological potassium channels, matching the unhydrated diameter of K+ (~2.98 Angstroms). This gives Lokelma >125-fold higher selectivity for K+ over divalent cations (Ca2+, Mg2+), preventing hypocalcemia or hypomagnesemia. It exchanges K+ for Na+ and H+ throughout the entire GI tract, with a rapid median onset of ~1 hour to potassium reduction.',
              'Incorrect: Lokelma is an inorganic crystal, not a crown ether, and has a rapid onset of ~1 hour, not 7 days.',
              'Incorrect: Lokelma is not a polysaccharide and is highly selective for potassium, not magnesium.',
              'Incorrect: Lokelma is an insoluble inorganic crystal, not a lipid nanoparticle.'
            ],
            overallExplanation: 'Sodium zirconium cyclosilicate (Lokelma / ZS-9) is an inorganic crystalline lattice with uniform ~3 Å micropores. Because the pore diameter precisely matches the unhydrated potassium ion (2.98 Å), it captures K+ with exceptional selectivity over larger hydrated ions and divalent cations (Ca2+, Mg2+). Unlike polymers that require colonic transit, Lokelma binds K+ across the entire GI tract, demonstrating rapid onset (~1 hour).',
            highYieldPearl: 'Lokelma (ZS-9): Inorganic crystalline lattice with ~3 Å micropores that mimic physiological K+ channels. Highly selective for K+ over Ca2+/Mg2+. Rapid onset (~1 hour)!',
            sourceReference: '2)_Renal_Drugs.pdf, Slides 109-114'
          }
        ]
      }
    ]
  }
];

export function getDefaultRenalDrugsModule(): ReviewModule {
  return {
    id: 'renal_drugs_mcp2',
    examId: 'exam_1',
    examTitle: 'Exam 1: Renal & Respiratory Medicinal Chemistry',
    title: 'Renal Drugs: Diuretics, Vaptans & Potassium Binders',
    subtitle: 'Thiazides, Loop Diuretics, Potassium-Sparing Diuretics, Carbonic Anhydrase Inhibitors, Vaptans, and Potassium Exchange Agents',
    course: 'Medicinal Chemistry & Pharmacology II',
    semester: 'Fall',
    code: 'MCP-2-01',
    isBuiltIn: true,
    createdAt: new Date().toISOString(),
    chemicalStructures: Object.values(RENAL_STRUCTURES),
    pages: renalDrugsPages,
  };
}
