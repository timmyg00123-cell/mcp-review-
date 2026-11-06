import type { CumulativeQuestion } from '../../types/cumulativeStudy';
import { EXAM_1_STRUCTURES } from './exam1Structures';

// Extract structure references for convenience and strict typing
const chlorothiazide = EXAM_1_STRUCTURES['chlorothiazide'];
const hydrochlorothiazide = EXAM_1_STRUCTURES['hydrochlorothiazide'];
const furosemide = EXAM_1_STRUCTURES['furosemide'];
const triamterene = EXAM_1_STRUCTURES['triamterene'];
const spironolactone = EXAM_1_STRUCTURES['spironolactone'];
const eplerenone = EXAM_1_STRUCTURES['eplerenone'];
const acetazolamide = EXAM_1_STRUCTURES['acetazolamide'];
const methazolamide = EXAM_1_STRUCTURES['methazolamide'];
const dorzolamide = EXAM_1_STRUCTURES['dorzolamide'];
const mannitol = EXAM_1_STRUCTURES['mannitol'];
const conivaptan = EXAM_1_STRUCTURES['conivaptan'];
const tolvaptan = EXAM_1_STRUCTURES['tolvaptan'];

const isoproterenol = EXAM_1_STRUCTURES['isoproterenol'];
const albuterol = EXAM_1_STRUCTURES['albuterol'];
const salmeterol = EXAM_1_STRUCTURES['salmeterol'];
const formoterol = EXAM_1_STRUCTURES['formoterol'];
const indacaterol = EXAM_1_STRUCTURES['indacaterol'];
const tiotropium = EXAM_1_STRUCTURES['tiotropium'];
const theophylline = EXAM_1_STRUCTURES['theophylline'];

const dexamethasone = EXAM_1_STRUCTURES['dexamethasone'];
const budesonide = EXAM_1_STRUCTURES['budesonide'];
const fluticasone_propionate = EXAM_1_STRUCTURES['fluticasone_propionate'];
const fluticasone_furoate = EXAM_1_STRUCTURES['fluticasone_furoate'];
const mometasone_furoate = EXAM_1_STRUCTURES['mometasone_furoate'];
const ciclesonide = EXAM_1_STRUCTURES['ciclesonide'];
const zileuton = EXAM_1_STRUCTURES['zileuton'];
const montelukast = EXAM_1_STRUCTURES['montelukast'];
const zafirlukast = EXAM_1_STRUCTURES['zafirlukast'];

export const CUMULATIVE_QUESTIONS_EXAM_1: CumulativeQuestion[] = [
  // =========================================================================
  // Part 1: Type A — Classic Drug Identification / Case-to-Structures
  // =========================================================================

  // 1. Type A: Oral Selective Vasopressin V2 Receptor Antagonist in SIADH & ADPKD
  {
    id: 'cumul1_q1_siadh_adpkd_vaptans',
    type: 'case-to-structures',
    moduleIds: ['renal_drugs_mcp2'],
    stem:
      'A 54-year-old patient with euvolemic hyponatremia secondary to SIADH (syndrome of inappropriate antidiuretic hormone secretion) and autosomal dominant polycystic kidney disease (ADPKD) requires oral aquaretic therapy that selectively antagonizes vasopressin V2 receptors in renal collecting ducts without activating vascular V1 receptors. Select the candidate structure below that represents this oral selective non-peptide V2 receptor antagonist:',
    candidateStructures: [
      tolvaptan,
      conivaptan,
      furosemide,
      hydrochlorothiazide,
    ],
    correctStructureIds: ['tolvaptan'],
    rationales: {
      tolvaptan:
        'Tolvaptan is an oral, selective non-peptide vasopressin V2 receptor antagonist. By competitively blocking V2 GPCRs on principal cells of the renal collecting duct, it prevents aquaporin-2 channel vesicle translocation to the apical membrane, producing pure electrolyte-free water excretion (aquaresis) for SIADH and slowing renal cyst growth in ADPKD.',
      conivaptan:
        'Conivaptan is a dual V1a/V2 receptor antagonist that is formulated exclusively for IV administration (propylene glycol vehicle) and is a potent CYP3A4 inhibitor; it is not orally bioavailable.',
      furosemide:
        'Furosemide is a loop diuretic that inhibits NKCC2 in the thick ascending limb of Henle; it causes broad saluresis (Na+, K+, Cl- loss) rather than selective aquaresis.',
      hydrochlorothiazide:
        'Hydrochlorothiazide is a thiazide diuretic acting on the distal convoluted tubule Na+/Cl- cotransporter; it causes saluresis and can worsen hyponatremia.',
    },
    highYieldPearl:
      'Tolvaptan is an oral, selective vasopressin V2 receptor antagonist approved for euvolemic/hypervolemic hyponatremia and ADPKD. Unlike IV conivaptan (dual V1a/V2 blocker), tolvaptan is V2-selective. It carries black-box warnings for osmotic demyelination syndrome if sodium is corrected too rapidly (>10-12 mEq/L/24h) and hepatotoxicity limiting use to <= 30 days.',
  },

  // 2. Type A: Rapid-Onset SABA Rescue Bronchodilator Pharmacophore
  {
    id: 'cumul1_q2_saba_rescue_bronchodilator',
    type: 'case-to-structures',
    moduleIds: ['respiratory_bronchodilators_mcp2'],
    stem:
      'A 19-year-old college student with mild intermittent asthma experiences acute exercise-induced bronchospasm. The patient requires an inhaled short-acting beta-2 agonist (SABA) rescue bronchodilator with rapid onset (<5 minutes), a saligenin hydroxymethyl group that resists catechol-O-methyltransferase (COMT), and a bulky tertiary butyl group that confers beta-2 adrenergic selectivity over cardiac beta-1 receptors. Select the candidate structure below that meets this exact pharmacophore:',
    candidateStructures: [
      albuterol,
      salmeterol,
      formoterol,
      isoproterenol,
    ],
    correctStructureIds: ['albuterol'],
    rationales: {
      albuterol:
        'Albuterol possesses a classic phenylethanolamine scaffold containing a 3-hydroxymethyl (saligenin) substituent that resists COMT inactivation, a para-hydroxyl group, and a bulky N-tert-butyl group that provides steric selectivity for Beta-2 over Beta-1 receptors with rapid onset (<5 min) and 4-6 hr duration.',
      salmeterol:
        'Salmeterol possesses an extended 11-atom lipophilic phenylalkoxyalkyl tail that binds the Beta-2 exosite. It has a slow onset of 15-30 minutes and a duration >12 hours, making it strictly contraindicated as an acute rescue bronchodilator.',
      formoterol:
        'Formoterol features a 3-formamido phenyl ring and a lipophilic methoxyphenylethyl tail. Although fast in onset, it is classified as a long-acting beta-2 agonist (LABA, >12 hr duration) and is not the prototype short-acting saligenin SABA.',
      isoproterenol:
        'Isoproterenol is a classic catecholamine containing an unsubstituted 3,4-dihydroxyphenyl core. It is rapidly destroyed by COMT (duration <1 hr) and lacks Beta-2 selectivity, stimulating cardiac Beta-1 receptors to cause severe tachycardia and palpitations.',
    },
    highYieldPearl:
      'Albuterol contains a 3-hydroxymethyl (saligenin) modification that resists COMT-mediated 3-O-methylation, giving it a 4-6 hour duration of action, while its bulky N-tert-butyl substituent sterically clashes with beta-1 receptors to provide beta-2 selectivity. In contrast, isoproterenol lacks beta-2 selectivity, while salmeterol has an 11-atom lipophilic tail causing slow onset (15-30 min), making it unsuitable as a rescue inhaler.',
  },

  // 3. Type A: Soft Steroid Prodrug with Airway Carboxylesterase Cleavage
  {
    id: 'cumul1_q3_soft_steroid_ciclesonide',
    type: 'case-to-structures',
    moduleIds: ['respiratory_antiinflammatories_mcp2'],
    stem:
      'A 42-year-old professional opera singer with persistent asthma suffers recurrent oral candidiasis (thrush) and dysphonia from standard inhaled corticosteroids. The clinician switches the patient to an engineered "soft steroid" prodrug administered as an inactive C21-isobutyrate ester that requires cleavage by lower-airway carboxylesterases to unleash its active 11beta-hydroxy metabolite, drastically minimizing oropharyngeal local steroid exposure and systemic side effects. Select the candidate structure below that represents this inactive ester prodrug:',
    candidateStructures: [
      ciclesonide,
      budesonide,
      fluticasone_propionate,
      mometasone_furoate,
    ],
    correctStructureIds: ['ciclesonide'],
    rationales: {
      ciclesonide:
        'Ciclesonide is a soft steroid prodrug formulated as a C21-isobutyrate ester with a 16,17-cyclohexylmethylene acetal. It has negligible glucocorticoid receptor affinity until lower-airway carboxylesterases cleave the isobutyrate ester to generate active des-ciclesonide. Because the oral cavity lacks these esterases, local side effects (candidiasis, hoarseness) are near zero.',
      budesonide:
        'Budesonide is an active 16,17-butylidene acetal corticosteroid that binds glucocorticoid receptors directly without requiring esterase bioactivation.',
      fluticasone_propionate:
        'Fluticasone propionate is a potent, active 17beta-fluoromethyl carbothioate steroid that binds glucocorticoid receptors directly upon inhalation without requiring activation.',
      mometasone_furoate:
        'Mometasone furoate is an active glucocorticoid containing a lipophilic 17alpha-furoate ester and 9alpha,21-dichloro modifications; it is not an inactive soft steroid ester prodrug.',
    },
    highYieldPearl:
      'Ciclesonide is a soft steroid prodrug formulated as a C21-isobutyrate ester. It has negligible binding affinity for glucocorticoid receptors until bronchial carboxylesterases in lung tissue cleave the isobutyrate to yield des-ciclesonide (active metabolite with ~100-fold higher affinity). Because oropharyngeal tissue possesses minimal carboxylesterase activity, swallowed and deposited drug remains inert, virtually eliminating local hoarseness, dysphonia, and oral candidiasis.',
  },

  // 4. Type A: Catalytic Iron-Chelating 5-Lipoxygenase Inhibitor
  {
    id: 'cumul1_q4_5lox_inhibitor_zileuton',
    type: 'case-to-structures',
    moduleIds: ['respiratory_antiinflammatories_mcp2'],
    stem:
      'A 38-year-old patient with severe aspirin-exacerbated respiratory disease (AERD) requires inhibition of the entire leukotriene pathway at its initial biosynthetically committed enzymatic step. The selected drug is an N-hydroxyurea and benzothiophene derivative that chelates active-site catalytic Fe3+ in 5-lipoxygenase (5-LOX), thereby preventing the conversion of arachidonic acid to 5-HPETE and leukotriene A4. Select the candidate structure below that represents this iron-chelating 5-LOX inhibitor:',
    candidateStructures: [
      zileuton,
      montelukast,
      zafirlukast,
      theophylline,
    ],
    correctStructureIds: ['zileuton'],
    rationales: {
      zileuton:
        'Zileuton is an N-hydroxyurea linked to a 1-benzo[b]thien-2-ylethyl scaffold. Its N-hydroxyurea pharmacophore chelates catalytic ferric iron (Fe3+) in the 5-lipoxygenase (5-LOX) catalytic pocket, inhibiting conversion of arachidonic acid to 5-HPETE and LTA4. It blocks all downstream leukotrienes (LTB4, LTC4, LTD4, LTE4).',
      montelukast:
        'Montelukast is a quinoline-containing selective CysLT1 receptor antagonist; it blocks LTC4/D4/E4 from binding to the CysLT1 GPCR but does not inhibit the 5-LOX enzyme and does not affect LTB4.',
      zafirlukast:
        'Zafirlukast is an indole-sulfonamide selective CysLT1 receptor antagonist; it blocks the CysLT1 receptor rather than inhibiting 5-lipoxygenase enzymatic activity.',
      theophylline:
        'Theophylline is a 1,3-dimethylxanthine that acts as a phosphodiesterase inhibitor and adenosine receptor antagonist; it has no direct inhibitory action on 5-lipoxygenase.',
    },
    highYieldPearl:
      'Zileuton is the only clinically available 5-lipoxygenase (5-LOX) inhibitor. Its N-hydroxyurea pharmacophore chelates catalytic ferric iron (Fe3+) at the 5-LOX active site, completely preventing synthesis of all leukotrienes (both LTB4 and cysteinyl leukotrienes LTC4/D4/E4). Major clinical monitoring requirements include monthly liver transaminases (ALT/AST) for drug-induced hepatotoxicity and monitoring for CYP1A2 inhibition (which doubles serum theophylline levels).',
  },

  // =========================================================================
  // Part 2: Type B — Structure-to-Effects (Multi-Statement Deduction)
  // =========================================================================

  // 5. Type B: Theophylline Multi-Target SAR & Pharmacokinetics
  {
    id: 'cumul1_q5_theophylline_structure_effects',
    type: 'structure-to-effects',
    moduleIds: ['respiratory_bronchodilators_mcp2'],
    stem:
      'Examine the xanthine-derived respiratory therapeutic agent displayed below. Select all biochemical targets, molecular mechanisms, metabolic pathways, and clinical monitoring pearls associated with this chemical structure:',
    singleStructure: theophylline,
    effectStatements: [
      {
        id: 'stmt_theo_1',
        statement:
          'Non-selectively inhibits cyclic nucleotide phosphodiesterases (PDE3, PDE4, PDE5), preventing cyclic AMP and cyclic GMP breakdown in airway smooth muscle.',
        isCorrect: true,
        rationale:
          'Theophylline is a competitive non-selective inhibitor of PDE enzymes, leading to intracellular cAMP and cGMP accumulation and smooth muscle relaxation.',
      },
      {
        id: 'stmt_theo_2',
        statement:
          'Acts as a competitive antagonist at cell-surface adenosine A1 and A2A receptors, blocking adenosine-mediated bronchoconstriction and endogenous histamine release.',
        isCorrect: true,
        rationale:
          'Theophylline antagonizes adenosine A1, A2A, and A2B receptors; blocking A1/A2B prevents adenosine-induced bronchoconstriction in asthmatic airways.',
      },
      {
        id: 'stmt_theo_3',
        statement:
          'Undergoes extensive hepatic elimination catalyzed predominantly by CYP1A2; co-administration with ciprofloxacin or zileuton markedly elevates plasma levels and precipitates refractory seizures.',
        isCorrect: true,
        rationale:
          'CYP1A2 accounts for ~70-80% of theophylline clearance. Potent CYP1A2 inhibitors (ciprofloxacin, zileuton, fluvoxamine) decrease clearance by >50%, precipitating serious toxicity.',
      },
      {
        id: 'stmt_theo_4',
        statement:
          'Is an irreversible alkylating agent of beta-2 adrenergic receptors that permanently locks the receptor in an active Gs-coupled state.',
        isCorrect: false,
        rationale:
          'Theophylline has no direct binding or alkylating action at beta-2 adrenergic receptors; its bronchodilator actions are mediated via PDE inhibition and adenosine blockade.',
      },
      {
        id: 'stmt_theo_5',
        statement:
          'Possesses an exceptionally wide therapeutic index (>50 mcg/mL), requiring zero therapeutic drug monitoring in clinical practice.',
        isCorrect: false,
        rationale:
          'Theophylline has a notoriously narrow therapeutic index (target 10-20 mcg/mL, with toxicity frequently observed at >20-25 mcg/mL), mandating routine TDM.',
      },
    ],
    highYieldPearl:
      'Theophylline (1,3-dimethylxanthine) exerts dual bronchodilation and anti-inflammatory actions via non-selective PDE inhibition and adenosine A1/A2A receptor antagonism. It has a very narrow therapeutic window (10-20 mcg/mL, with toxicity appearing at >20-25 mcg/mL). Hepatic clearance is driven by CYP1A2; CYP1A2 inhibitors (ciprofloxacin, fluvoxamine, zileuton) dramatically spike theophylline levels, causing cardiac arrhythmias and fatal seizures, whereas cigarette smoking induces CYP1A2 and requires higher maintenance doses.',
  },

  // 6. Type B: Furosemide Loop Diuretic SAR, Secretion & Electrolyte Effects
  {
    id: 'cumul1_q6_furosemide_structure_effects',
    type: 'structure-to-effects',
    moduleIds: ['renal_drugs_mcp2'],
    stem:
      'Examine the prototype loop diuretic structure displayed below. Select all biochemical targets, nephron segment sites, active transport mechanisms, and electrolyte disturbances associated with this chemical structure:',
    singleStructure: furosemide,
    effectStatements: [
      {
        id: 'stmt_furo_1',
        statement:
          'Selectively and reversibly inhibits the luminal Na+/K+/2Cl- cotransporter 2 (NKCC2) in the thick ascending limb of the loop of Henle by competing for the chloride-binding pocket.',
        isCorrect: true,
        rationale:
          'Furosemide reversibly binds to the chloride translocation site on the luminal NKCC2 cotransporter in the thick ascending limb of Henle.',
      },
      {
        id: 'stmt_furo_2',
        statement:
          'Destroys the hypertonic medullary osmotic gradient, preventing urinary concentration and producing potent high-ceiling saluresis of up to ~25% of filtered sodium.',
        isCorrect: true,
        rationale:
          'By blocking NKCC2 in the TAL, furosemide abolishes the corticomedullary countercurrent osmotic multiplier, inducing massive diuresis of up to 20-25% of filtered Na+.',
      },
      {
        id: 'stmt_furo_3',
        statement:
          'Features an unsubstituted sulfonamide group (-SO2NH2) that can cross-react in patients with documented severe anaphylactoid sulfonamide hypersensitivity.',
        isCorrect: true,
        rationale:
          'Furosemide is an anthranilic acid sulfonamide derivative containing an unsubstituted 5-sulfamoyl moiety (-SO2NH2) that confers sulfa allergy cross-reactivity.',
      },
      {
        id: 'stmt_furo_4',
        statement:
          'Contains a carboxylic acid moiety (pKa ~3.9) that is actively secreted into the proximal tubular lumen via organic anion transporters (OAT1 and OAT3).',
        isCorrect: true,
        rationale:
          'Because furosemide is >95% bound to plasma albumin, minimal drug enters the tubule via glomerular filtration; it must reach the lumen via active basolateral OAT1/3 secretion.',
      },
      {
        id: 'stmt_furo_5',
        statement:
          'Selectively spares potassium excretion in the cortical collecting duct, causing systemic hyperkalemia and metabolic acidosis.',
        isCorrect: false,
        rationale:
          'Furosemide causes massive potassium and hydrogen wasting (hypokalemic, hypochloremic metabolic alkalosis), not potassium sparing or hyperkalemia.',
      },
    ],
    highYieldPearl:
      'Furosemide is a prototype high-ceiling loop diuretic (anthranilic acid derivative) that inhibits NKCC2 in the TAL. Because >95% is protein-bound to albumin, it cannot access its site of action via glomerular filtration; instead, it relies on active proximal tubular secretion via OAT1/3. Key toxicities include hypokalemic hypochloremic metabolic alkalosis, hypomagnesemia, hypocalcemia (unlike thiazides, which retain calcium), and sulfa cross-reactivity.',
  },

  // 7. Type B: Tiotropium LAMA Kinetic Selectivity & SAR
  {
    id: 'cumul1_q7_tiotropium_structure_effects',
    type: 'structure-to-effects',
    moduleIds: ['respiratory_bronchodilators_mcp2'],
    stem:
      'Examine the inhaled bronchodilator structure displayed below. Select all biochemical receptor interactions, kinetic binding properties, structural characteristics, and clinical pearls associated with this molecule:',
    singleStructure: tiotropium,
    effectStatements: [
      {
        id: 'stmt_tio_1',
        statement:
          'Contains a quaternary ammonium nitrogen carrying a permanent positive ionic charge, conferring negligible blood-brain barrier penetration and preventing central anticholinergic delirium.',
        isCorrect: true,
        rationale:
          'The permanently charged quaternary ammonium nitrogen prevents crossing of the blood-brain barrier, restricting adverse anticholinergic effects to peripheral tissues.',
      },
      {
        id: 'stmt_tio_2',
        statement:
          'Functions as a long-acting muscarinic antagonist (LAMA) displaying kinetic selectivity: it dissociates exceptionally slowly from bronchoconstrictive M3 receptors (t1/2 ~35 hours) while dissociating rapidly from inhibitory presynaptic M2 autoreceptors (t1/2 ~3.6 hours).',
        isCorrect: true,
        rationale:
          'Tiotropium is kinetically selective: although its equilibrium affinity for M1, M2, and M3 is similar, its dissociation half-life from M3 is ~35 h vs only 3.6 h from presynaptic M2, preserving M2 autoinhibition of ACh release.',
      },
      {
        id: 'stmt_tio_3',
        statement:
          'Features a scopine ring with an epoxide bridge and two bulky lipophilic thienyl rings that anchor deeply into the muscarinic receptor binding pocket.',
        isCorrect: true,
        rationale:
          'The scopine nucleus (featuring an epoxide bridge) coupled to a glycolate ester with two lipophilic thienyl rings provides superior hydrophobic binding contacts in the orthosteric binding site.',
      },
      {
        id: 'stmt_tio_4',
        statement:
          'Directly phosphorylates protein kinase A (PKA) to induce intracellular cAMP accumulation without interacting with muscarinic receptors.',
        isCorrect: false,
        rationale:
          'Tiotropium is an antagonist of muscarinic acetylcholine receptors; it does not directly activate PKA or generate cAMP.',
      },
      {
        id: 'stmt_tio_5',
        statement:
          'Rapidly crosses the blood-brain barrier to produce severe central sedation and hallucinations due to high unionized tertiary amine lipophilicity.',
        isCorrect: false,
        rationale:
          'Tiotropium is a quaternary ammonium salt with zero unionized fraction at physiological pH; it cannot cross the BBB.',
      },
    ],
    highYieldPearl:
      'Tiotropium is a prototype inhaled LAMA for COPD and severe asthma. Its permanent quaternary ammonium charge restricts action to the respiratory tract without central anticholinergic toxicity. Although it has similar thermodynamic equilibrium affinity for M1, M2, and M3 receptors, its clinical once-daily efficacy stems from kinetic selectivity: an exceptionally slow dissociation off-rate from airway smooth muscle M3 receptors (t1/2 ~35 h) compared to rapid off-rate from presynaptic M2 autoreceptors (t1/2 ~3.6 h).',
  },

  // 8. Type B: Dexamethasone Glucocorticoid SAR & Mineralocorticoid Sparing
  {
    id: 'cumul1_q8_dexamethasone_structure_effects',
    type: 'structure-to-effects',
    moduleIds: ['respiratory_antiinflammatories_mcp2'],
    stem:
      'Examine the systemic corticosteroid structure displayed below. Select all structural functional groups, receptor selectivity factors, metabolic resistance mechanisms, and clinical pearls associated with this molecule:',
    singleStructure: dexamethasone,
    effectStatements: [
      {
        id: 'stmt_dex_1',
        statement:
          'Possesses a 1,2-dehydro single-to-double bond (Delta-1) on ring A, flattening the steroid geometry and enhancing glucocorticoid receptor affinity by ~4-fold relative to cortisol.',
        isCorrect: true,
        rationale:
          'The C1=C2 double bond flattens ring A, increasing glucocorticoid potency ~4-fold and reducing susceptibility to metabolic hepatic A-ring reductases.',
      },
      {
        id: 'stmt_dex_2',
        statement:
          'Contains a 9alpha-fluoro substituent that inductively withdraws electrons, increasing the acidity of the essential 11beta-hydroxyl group and preventing its metabolic oxidation.',
        isCorrect: true,
        rationale:
          'The 9alpha-fluorine atom exerts a strong electron-withdrawing inductive effect that enhances hydrogen bonding of the essential 11beta-hydroxyl group with the glucocorticoid receptor.',
      },
      {
        id: 'stmt_dex_3',
        statement:
          'Incorporates a 16alpha-methyl group on ring D that sterically clashes with the mineralocorticoid receptor binding cavity, virtually eliminating sodium-retentive mineralocorticoid side effects.',
        isCorrect: true,
        rationale:
          'The 16alpha-methyl group introduces steric clash in the mineralocorticoid receptor binding pocket, conferring near-zero salt and water retention.',
      },
      {
        id: 'stmt_dex_4',
        statement:
          'Is an inactive prodrug that requires reduction by hepatic 11beta-HSD1 to generate an 11beta-hydroxyl group before it can bind glucocorticoid receptors.',
        isCorrect: false,
        rationale:
          'Dexamethasone already contains the active 11beta-hydroxyl group; unlike prednisone or cortisone (11-ketones), it is active as administered.',
      },
      {
        id: 'stmt_dex_5',
        statement:
          'Lacks an 11beta-hydroxyl group and instead acts solely by directly binding and opening plasma membrane calcium channels.',
        isCorrect: false,
        rationale:
          'Dexamethasone contains the mandatory 11beta-OH group and acts primarily via cytoplasmic glucocorticoid nuclear receptors (transrepression of NF-kB and transactivation of anti-inflammatory genes).',
      },
    ],
    highYieldPearl:
      'Dexamethasone is a potent synthetic glucocorticoid (~25-30x more potent than cortisol) possessing three key SAR modifications: (1) a Delta-1 double bond that increases glucocorticoid potency and slows ring-A reduction; (2) a 9alpha-fluoro group that inductively stabilizes the active 11beta-OH conformation; and (3) a 16alpha-methyl group that abolishes mineralocorticoid receptor binding, completely preventing fluid retention and hypertension. Unlike cortisone and prednisone (which are 11-keto prodrugs), dexamethasone already contains the active 11beta-hydroxyl group.',
  },

  // =========================================================================
  // Part 3: Type C — Comparative SAR & Clinical Vignette Matching
  // =========================================================================

  // 9. Type C: Samter's Triad (AERD) Pathophysiology & Leukotriene Pathway Interventions
  {
    id: 'cumul1_q9_samters_triad_aerd',
    type: 'comparative-sar',
    moduleIds: ['respiratory_antiinflammatories_mcp2'],
    stem:
      'A 34-year-old patient with severe adult-onset asthma and chronic rhinosinusitis with recurrent nasal polyps is brought to the emergency department in status asthmaticus within 45 minutes of ingesting an over-the-counter NSAID (ibuprofen). This clinical presentation represents Samter\'s Triad (Aspirin-Exacerbated Respiratory Disease, AERD). The biochemical pathophysiology involves non-selective COX-1 inhibition removing the physiological PGE2 inhibitory brake on 5-lipoxygenase, shunting unhindered arachidonic acid into excessive cysteinyl leukotriene (LTC4/D4/E4) production. Select all candidate structures below that directly intervene in the leukotriene pathway to manage or prevent this bronchoconstrictive crisis:',
    candidateStructures: [
      montelukast,
      zafirlukast,
      zileuton,
      albuterol,
      theophylline,
    ],
    correctStructureIds: ['montelukast', 'zafirlukast', 'zileuton'],
    rationales: {
      montelukast:
        'Montelukast is a selective CysLT1 receptor antagonist that blocks LTC4, LTD4, and LTE4 from binding to airway smooth muscle, directly reversing and preventing leukotriene-mediated bronchoconstriction and airway edema in AERD.',
      zafirlukast:
        'Zafirlukast is an indole-sulfonamide CysLT1 receptor antagonist that competitively inhibits cysteinyl leukotriene-induced bronchospasm and vascular permeability in AERD.',
      zileuton:
        'Zileuton directly inhibits 5-lipoxygenase (5-LOX) via catalytic iron chelation, shutting down the entire leukotriene cascade at its enzymatic origin and blocking both cysteinyl leukotrienes and chemotactic LTB4.',
      albuterol:
        'Albuterol is a Beta-2 agonist bronchodilator; while it relieves acute bronchospasm symptomatically via cAMP generation, it does not directly modulate or target the leukotriene biosynthetic or receptor pathway.',
      theophylline:
        'Theophylline is a non-selective PDE inhibitor and adenosine receptor antagonist; it does not directly target leukotriene biosynthesis or CysLT1 receptors.',
    },
    highYieldPearl:
      'AERD (Samter\'s Triad = asthma, nasal polyposis, aspirin/NSAID hypersensitivity) is driven by shunting of arachidonic acid down the 5-LOX pathway when COX-1 is blocked, leading to a 100- to 1000-fold increase in cysteinyl leukotrienes. Therapeutic intervention requires leukotriene pathway modifiers: either 5-LOX inhibitors (zileuton) or CysLT1 receptor antagonists (montelukast, zafirlukast).',
  },

  // 10. Type C: Endocrine-Sparing MRA SAR (Eplerenone vs Spironolactone)
  {
    id: 'cumul1_q10_hyperkalemia_resins',
    type: 'comparative-sar',
    moduleIds: ['renal_drugs_mcp2'],
    stem:
      'A 58-year-old male with heart failure and secondary hyperaldosteronism develops painful bilateral gynecomastia and erectile dysfunction on spironolactone. The clinician switches him to an aldosterone receptor antagonist engineered with a 9,11-alpha-epoxide ring that sterically blocks binding to androgen and progesterone receptors, eliminating endocrine side effects while preserving MR antagonism in the collecting duct. Select the candidate structure below that meets this endocrine-sparing profile:',
    candidateStructures: [
      eplerenone,
      spironolactone,
      triamterene,
      furosemide,
    ],
    correctStructureIds: ['eplerenone'],
    rationales: {
      eplerenone:
        'Eplerenone contains a 9,11-alpha-epoxide bridge and a carbomethoxy group at C7. The epoxide ring drastically diminishes affinity for androgen and progesterone receptors by >100- to 500-fold compared to spironolactone, virtually abolishing gynecomastia, impotence, and menstrual irregularities while selectively blocking mineralocorticoid receptors.',
      spironolactone:
        'Spironolactone contains a 17-spirolactone ring and a 7alpha-acetylthio group. It non-selectively binds androgen receptors (antagonist) and progesterone receptors (agonist), frequently precipitating painful gynecomastia, testicular atrophy, and sexual dysfunction.',
      triamterene:
        'Triamterene is a pteridine direct ENaC blocker in the collecting duct; it does not bind or antagonize mineralocorticoid nuclear receptors.',
      furosemide:
        'Furosemide is a loop diuretic that inhibits NKCC2 in the thick ascending limb of Henle; it does not modulate aldosterone or sex hormone receptors.',
    },
    highYieldPearl:
      'Eplerenone (Inspra) is a selective mineralocorticoid receptor antagonist (MRA) incorporating a 9,11-alpha-epoxide bridge that prevents cross-reactivity with androgen and progesterone receptors, eliminating the gynecomastia and sexual dysfunction caused by spironolactone. Both MRAs carry hyperkalemia risk, especially when combined with ACE inhibitors or ARBs.',
  },

  // 11. Type C: SMART Therapy Inhaled LABA Selection (Formoterol vs Salmeterol)
  {
    id: 'cumul1_q11_smart_therapy_formoterol',
    type: 'comparative-sar',
    moduleIds: ['respiratory_bronchodilators_mcp2', 'respiratory_antiinflammatories_mcp2'],
    stem:
      'Under modern GINA guidelines, moderate-to-severe persistent asthma is managed using SMART (Single Maintenance and Reliever Therapy). SMART requires a fixed-dose combination inhaler containing an inhaled corticosteroid plus a long-acting beta-2 agonist that uniquely possesses BOTH a rapid onset of action (<2-3 minutes, enabling immediate rescue relief of acute bronchospasm) AND a prolonged duration of action (>12 hours, providing daily baseline control). Select the long-acting beta-2 agonist structure below that qualifies for SMART therapy due to its moderate lipophilicity and micro-depot plasma membrane partition kinetics:',
    candidateStructures: [
      formoterol,
      salmeterol,
      albuterol,
      indacaterol,
    ],
    correctStructureIds: ['formoterol'],
    rationales: {
      formoterol:
        'Formoterol contains an aromatic 3-formamido substituent and has moderate lipophilicity (logP ~1.6). It partitions into the plasmalemma lipid bilayer to form a concentration depot while simultaneously interacting directly with the active site aqueous phase, yielding an onset within 2-3 minutes (comparable to albuterol) and a duration >12 hours, making it the only LABA approved for SMART therapy with budesonide.',
      salmeterol:
        'Salmeterol has an extremely lipophilic 11-atom aliphatic/ether tail (logP ~3.9) that anchors deeply in an exosite lipid microenvironment. It has a slow onset of 15-30 minutes and is strictly contraindicated as a quick-relief rescue inhaler because it cannot provide rapid bronchodilation during acute attacks.',
      albuterol:
        'Albuterol has a rapid onset (<5 minutes) but a short duration of only 4-6 hours (SABA); it cannot serve as a maintenance LABA in SMART regimens.',
      indacaterol:
        'Indacaterol is an ultra-LABA with a 24-hour duration of action approved exclusively for once-daily maintenance therapy in COPD; it is not approved or utilized for acute rescue relief in asthma SMART regimens.',
    },
    highYieldPearl:
      'SMART (Single Maintenance and Reliever Therapy) relies exclusively on Formoterol (typically combined with Budesonide) because formoterol possesses a unique kinetic profile: an ultra-rapid onset of action (2-3 minutes, equal to albuterol) coupled with prolonged >12-hour bronchodilation. In contrast, Salmeterol has a slow onset of action (15-30 minutes) and must never be used as a rescue inhaler due to risk of fatal asthma exacerbations.',
  },

  // 12. Type C: Topical Ophthalmic CAI in Glaucoma Avoiding Systemic Acidosis
  {
    id: 'cumul1_q12_topical_cais_glaucoma',
    type: 'comparative-sar',
    moduleIds: ['renal_drugs_mcp2'],
    stem:
      'A 67-year-old patient with open-angle glaucoma and baseline severe COPD (chronic respiratory acidosis with baseline arterial pH 7.31 and pCO2 = 52 mmHg) requires reduction of intraocular pressure via inhibition of ciliary body carbonic anhydrase II. Oral acetazolamide is contraindicated because systemic carbonic anhydrase inhibition would induce metabolic acidosis and precipitate life-threatening mixed acid-base decompensation. Select the candidate structure below that was rationally designed as a topical ophthalmic carbonic anhydrase inhibitor with a thienothiopyran core that reduces IOP locally while avoiding systemic metabolic acidosis:',
    candidateStructures: [
      dorzolamide,
      acetazolamide,
      methazolamide,
      mannitol,
    ],
    correctStructureIds: ['dorzolamide'],
    rationales: {
      dorzolamide:
        'Dorzolamide is a thienothiopyran-2-sulfonamide engineered specifically for topical ophthalmic delivery. Its basic ethylamino side chain (pKa 8.5) and hydrophilic sulfonamide provide sufficient water solubility at pH 5.6 for drop formulation and corneal penetration, effectively lowering aqueous humor secretion while avoiding systemic CA inhibition and metabolic acidosis.',
      acetazolamide:
        'Acetazolamide is a heterocyclic thiadiazole-sulfonamide administered orally or IV. It produces profound systemic carbonic anhydrase inhibition, bicarbonate wasting in the proximal tubule, and hyperchloremic metabolic acidosis, which is dangerous in patients with underlying respiratory acidosis.',
      methazolamide:
        'Methazolamide is an oral CAI with an N3-methyl group on the thiadiazole ring. Although it has greater lipophilicity and lower ionization than acetazolamide, it is still administered systemically and causes systemic metabolic acidosis and electrolyte disturbances.',
      mannitol:
        'Mannitol is an IV osmotic diuretic used for acute emergency reduction of dangerously elevated IOP or intracranial pressure; it is not available as a topical eye drop.',
    },
    highYieldPearl:
      'Dorzolamide (Trusopt) and brinzolamide (Azopt) are topical ophthalmic carbonic anhydrase inhibitors (thienothiopyrans) formulated as eye drops to treat glaucoma. They lower intraocular pressure by inhibiting carbonic anhydrase II in the ciliary processes, suppressing bicarbonate and aqueous humor production without causing the systemic hyperchloremic metabolic acidosis seen with oral acetazolamide.',
  },

  // =========================================================================
  // Part 4: Type D — Contraindication & Warning Triads (Risk Deduction)
  // =========================================================================

  // 13. Type D: CYP3A4 Inhibitor Co-Administration with Inhaled Corticosteroids (Iatrogenic Cushing's)
  {
    id: 'cumul1_q13_cyp3a4_ics_iatrogenic_cushing',
    type: 'contraindication-risk',
    moduleIds: ['respiratory_antiinflammatories_mcp2'],
    stem:
      'A 36-year-old HIV-positive patient on an antiretroviral regimen containing ritonavir (or cobicistat), a potent mechanism-based irreversible inhibitor of CYP3A4, develops severe persistent asthma. Select all inhaled corticosteroid (ICS) structures below that undergo extensive hepatic first-pass CYP3A4 metabolism and therefore carry a severe risk of massive systemic drug accumulation, leading to iatrogenic Cushing\'s syndrome and secondary adrenal suppression when co-administered with strong CYP3A4 inhibitors:',
    candidateStructures: [
      fluticasone_propionate,
      fluticasone_furoate,
      budesonide,
      albuterol,
      montelukast,
    ],
    correctStructureIds: [
      'fluticasone_propionate',
      'fluticasone_furoate',
      'budesonide',
    ],
    rationales: {
      fluticasone_propionate:
        'Fluticasone propionate normally undergoes >99% hepatic first-pass metabolism by CYP3A4 to an inactive 17beta-carboxylic acid metabolite, resulting in <1% oral bioavailability. When CYP3A4 is inhibited by ritonavir or cobicistat, systemic bioavailability spikes dramatically, causing full-blown iatrogenic Cushing\'s syndrome, central adiposity, and hypothalamic-pituitary-adrenal (HPA) axis shutdown.',
      fluticasone_furoate:
        'Fluticasone furoate is an extremely lipophilic fluorinated carbothioate steroid cleared almost exclusively by CYP3A4. Strong CYP3A4 inhibitors cause significant systemic accumulation and marked reductions in serum cortisol.',
      budesonide:
        'Budesonide undergoes ~90% first-pass hepatic biotransformation primarily via CYP3A4 to 16alpha-hydroxyprednisolone and 6beta-hydroxybudesonide. Co-administration with potent CYP3A4 inhibitors significantly increases systemic corticosteroid exposure and adrenal suppression risk.',
      albuterol:
        'Albuterol is an adrenergic bronchodilator metabolized by sulfotransferases (SULT1A3), not CYP3A4; it does not produce Cushing\'s syndrome or adrenal suppression.',
      montelukast:
        'Montelukast is a leukotriene receptor antagonist; while metabolized by CYP2C8 and CYP3A4, it is not a steroid and does not cause Cushingoid features or adrenal insufficiency.',
    },
    highYieldPearl:
      'High first-pass hepatic metabolism by CYP3A4 (>90-99%) is the physiological safety mechanism that normally protects patients from systemic toxicity when swallowing inhaled corticosteroids (fluticasone, budesonide). Strong CYP3A4 inhibitors (ritonavir, cobicistat, itraconazole, clarithromycin) abolish this clearance, turning topical inhaled steroids into potent systemic agents that induce florid iatrogenic Cushing\'s syndrome and profound adrenal insufficiency.',
  },

  // 14. Type D: Theophylline Toxicity & Fatal CYP1A2 Drug Interactions
  {
    id: 'cumul1_q14_theophylline_cyp1a2_interactions',
    type: 'contraindication-risk',
    moduleIds: ['respiratory_bronchodilators_mcp2', 'respiratory_antiinflammatories_mcp2'],
    stem:
      'A 58-year-old patient with severe COPD is stabilized on oral theophylline (serum level 14 mcg/mL, within the 10-20 mcg/mL therapeutic range). The patient develops a complicated urinary tract infection and worsening inflammatory airway symptoms. Select all candidate structures below that are POTENT CYP1A2 INHIBITORS and are strictly contraindicated or require drastic theophylline dose reductions because they block theophylline\'s primary clearance pathway, triggering toxic plasma accumulations (>25 mcg/mL) with fatal ventricular tachyarrhythmias and status epilepticus:',
    candidateStructures: [
      zileuton,
      theophylline,
      albuterol,
      tiotropium,
      montelukast,
    ],
    correctStructureIds: ['zileuton'],
    rationales: {
      zileuton:
        'Zileuton is a potent inhibitor of CYP1A2. Co-administration of zileuton with theophylline doubles theophylline plasma concentrations (AUC increases ~100%), readily converting therapeutic theophylline levels into lethal concentrations that trigger refractory seizures and cardiac arrest; a 50% theophylline dose reduction and intense TDM are mandatory.',
      theophylline:
        'Theophylline is the substrate whose narrow therapeutic index is at risk; it is not a co-administered perpetrator inhibitor in this scenario.',
      albuterol:
        'Albuterol is cleared by sulfoconjugation and filtration; it does not inhibit CYP1A2.',
      tiotropium:
        'Tiotropium is a quaternary ammonium muscarinic antagonist cleared non-enzymatically by ester hydrolysis and renal excretion; it does not inhibit CYP enzymes.',
      montelukast:
        'Montelukast is metabolized predominantly by CYP2C8 and does not inhibit CYP1A2; it can be safely co-administered with theophylline without altering its clearance.',
    },
    highYieldPearl:
      'Theophylline is cleared primarily by hepatic CYP1A2 and has a narrow therapeutic range (10-20 mcg/mL). Co-administering potent CYP1A2 inhibitors—most notably the 5-LOX inhibitor zileuton, the fluoroquinolone ciprofloxacin, or fluvoxamine—drastically impedes theophylline elimination, doubling plasma levels and precipitating toxicities including intractable nausea, ventricular arrhythmias, and treatment-resistant seizures.',
  },

  // 15. Type D: Montelukast & Zileuton Regulatory Black Box Warnings & Monitoring
  {
    id: 'cumul1_q15_montelukast_zileuton_warnings',
    type: 'contraindication-risk',
    moduleIds: ['respiratory_antiinflammatories_mcp2'],
    stem:
      'Regulatory pharmacovigilance agencies have attached severe warnings and monitoring mandates to oral leukotriene modifiers. Select all candidate structures below that carry EITHER an FDA Boxed Warning for serious neuropsychiatric events (including agitation, aggression, depression, vivid nightmares, and suicidal ideation/behavior) OR a mandatory clinical requirement for baseline and regular monthly hepatic transaminase (ALT) monitoring due to drug-induced hepatocellular injury:',
    candidateStructures: [
      montelukast,
      zileuton,
      budesonide,
      albuterol,
    ],
    correctStructureIds: ['montelukast', 'zileuton'],
    rationales: {
      montelukast:
        'In March 2020, the FDA mandated a Boxed Warning (Black Box Warning) for montelukast regarding serious neuropsychiatric events, including depression, insomnia, aggression, and suicidal thoughts or actions, requiring clinicians to avoid montelukast in mild asthma and thoroughly counsel patients.',
      zileuton:
        'Zileuton causes significant serum ALT/AST elevations in 3-5% of patients, with cases of symptomatic jaundice and severe drug-induced hepatitis. The FDA mandates serum transaminases prior to initiation, monthly for the first 3 months, quarterly for the rest of the first year, and periodically thereafter.',
      budesonide:
        'Budesonide is an inhaled corticosteroid that does not carry a black box warning for neuropsychiatric events and does not require monthly liver function testing.',
      albuterol:
        'Albuterol is a short-acting beta-2 agonist with classic sympathomimetic side effects (tremor, tachycardia), but it does not cause severe neuropsychiatric Black Box events or hepatic necrosis.',
    },
    highYieldPearl:
      'The two oral leukotriene modifiers have distinct major regulatory liabilities: Montelukast carries an FDA Boxed Warning (2020) for serious neuropsychiatric events and suicidality, whereas Zileuton carries a strict mandate for regular hepatic function (ALT) monitoring due to significant drug-induced hepatocellular injury.',
  },

  // 16. Type D: Tolvaptan Black Box Warnings (Osmotic Demyelination & Hepatotoxicity)
  {
    id: 'cumul1_q16_tolvaptan_boxed_warnings',
    type: 'contraindication-risk',
    moduleIds: ['renal_drugs_mcp2'],
    stem:
      'A 52-year-old inpatient with chronic hyponatremia is evaluated for therapy with tolvaptan, an oral non-peptide vasopressin V2 receptor antagonist. The hospital pharmacy safety committee flags this order due to two distinct Boxed Warnings (Black Box Warnings) established by the FDA. Select all candidate structures below that carry Boxed Warnings requiring hospital-only initiation to prevent Osmotic Demyelination Syndrome and restricting duration to <= 30 days due to progressive irreversible liver injury:',
    candidateStructures: [
      tolvaptan,
      conivaptan,
      furosemide,
      hydrochlorothiazide,
    ],
    correctStructureIds: ['tolvaptan'],
    rationales: {
      tolvaptan:
        'Tolvaptan carries two FDA Boxed Warnings: (1) Treatment must be initiated and re-initiated in a hospital setting where serum sodium can be closely monitored to prevent overly rapid correction (>10-12 mEq/L/24h), which causes irreversible Osmotic Demyelination Syndrome (central pontine myelinolysis); and (2) Duration of therapy is restricted to a maximum of 30 days due to potential for progressive irreversible hepatocellular injury and liver failure.',
      conivaptan:
        'Conivaptan is a dual V1a/V2 receptor antagonist administered IV; while it requires serum sodium monitoring, it does not carry the specific oral 30-day boxed warning for progressive drug-induced liver injury seen with tolvaptan.',
      furosemide:
        'Furosemide causes saluresis with hypokalemia and volume depletion; it does not carry a boxed warning restricting use to 30 days for hepatotoxicity.',
      hydrochlorothiazide:
        'Hydrochlorothiazide commonly causes hyponatremia by impairing urinary dilution; it does not cause osmotic demyelination from rapid sodium rise.',
    },
    highYieldPearl:
      'Tolvaptan (Samsca) carries two strict FDA Boxed Warnings: (1) mandatory hospital initiation to prevent Osmotic Demyelination Syndrome (central pontine myelinolysis) caused by sodium correction exceeding 10-12 mEq/L in 24 hours; and (2) limitation of treatment duration to <= 30 days because clinical trials demonstrated severe, potentially fatal drug-induced liver injury.',
  },
];
