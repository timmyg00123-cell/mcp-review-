import type { CumulativeQuestion } from '../../types/cumulativeStudy';
import { EXAM_2_STRUCTURES } from './exam2Structures';

// Extract structure references for convenience and strict typing
const ethacrynic_acid = EXAM_2_STRUCTURES['ethacrynic_acid'];
const furosemide = EXAM_2_STRUCTURES['furosemide'];
const bumetanide = EXAM_2_STRUCTURES['bumetanide'];
const torsemide = EXAM_2_STRUCTURES['torsemide'];
const hydrochlorothiazide = EXAM_2_STRUCTURES['hydrochlorothiazide'];

const lisinopril = EXAM_2_STRUCTURES['lisinopril'];
const losartan = EXAM_2_STRUCTURES['losartan'];
const aliskiren = EXAM_2_STRUCTURES['aliskiren'];
const labetalol = EXAM_2_STRUCTURES['labetalol'];
const methyldopa = EXAM_2_STRUCTURES['methyldopa'];

const atorvastatin = EXAM_2_STRUCTURES['atorvastatin'];
const simvastatin = EXAM_2_STRUCTURES['simvastatin'];
const lomitapide = EXAM_2_STRUCTURES['lomitapide'];
const colesevelam = EXAM_2_STRUCTURES['colesevelam'];

const propranolol = EXAM_2_STRUCTURES['propranolol'];
const atenolol = EXAM_2_STRUCTURES['atenolol'];
const metoprolol = EXAM_2_STRUCTURES['metoprolol'];
const pindolol = EXAM_2_STRUCTURES['pindolol'];
const nadolol = EXAM_2_STRUCTURES['nadolol'];

const amlodipine = EXAM_2_STRUCTURES['amlodipine'];
const nifedipine = EXAM_2_STRUCTURES['nifedipine'];
const verapamil = EXAM_2_STRUCTURES['verapamil'];
const diltiazem = EXAM_2_STRUCTURES['diltiazem'];
const sodium_nitroprusside = EXAM_2_STRUCTURES['sodium_nitroprusside'];

const enalapril = EXAM_2_STRUCTURES['enalapril'];
const enalaprilat = EXAM_2_STRUCTURES['enalaprilat'];
const ramipril = EXAM_2_STRUCTURES['ramipril'];
const captopril = EXAM_2_STRUCTURES['captopril'];
const fosinopril = EXAM_2_STRUCTURES['fosinopril'];

const clonidine = EXAM_2_STRUCTURES['clonidine'];
const guanfacine = EXAM_2_STRUCTURES['guanfacine'];
const prazosin = EXAM_2_STRUCTURES['prazosin'];

const eplerenone = EXAM_2_STRUCTURES['eplerenone'];
const spironolactone = EXAM_2_STRUCTURES['spironolactone'];
const amiloride = EXAM_2_STRUCTURES['amiloride'];
const triamterene = EXAM_2_STRUCTURES['triamterene'];

const candesartan_cilexetil = EXAM_2_STRUCTURES['candesartan_cilexetil'];
const fenofibrate = EXAM_2_STRUCTURES['fenofibrate'];
const gemfibrozil = EXAM_2_STRUCTURES['gemfibrozil'];
const ezetimibe = EXAM_2_STRUCTURES['ezetimibe'];

export const CUMULATIVE_QUESTIONS_EXAM_2: CumulativeQuestion[] = [
  // 1. Type D: Severe Sulfa Allergy & Loop Diuretics
  {
    id: 'cumul2_q1_severe_sulfa_allergy',
    type: 'contraindication-risk',
    moduleIds: ['antihypertensives_1_mcp2'],
    stem:
      'A 56-year-old patient with acute decompensated heart failure and pulmonary edema has a documented history of severe anaphylactoid cross-reactivity to sulfonamides (bronchospasm, facial angioedema, and diffuse urticaria after trimethoprim-sulfamethoxazole). The inpatient care team urgently requires a potent loop diuretic that acts on the thick ascending limb of Henle to produce rapid venodilation and saluresis. Select the candidate structure below that is safe to administer because it completely lacks a sulfonamide functional group:',
    candidateStructures: [
      ethacrynic_acid,
      furosemide,
      bumetanide,
      torsemide,
      hydrochlorothiazide,
    ],
    correctStructureIds: ['ethacrynic_acid'],
    rationales: {
      ethacrynic_acid:
        'Ethacrynic acid is a phenoxyacetic acid derivative containing an alpha,beta-unsaturated ketone (Michael acceptor) and ortho,ortho-dichloro substituents. It completely lacks a sulfonamide (-SO2NH2 or -SO2NH-) group, making it the only loop diuretic safe for patients with severe sulfa allergy.',
      furosemide:
        'Furosemide contains an unsubstituted 5-sulfamoyl group (-SO2NH2) on its 2-aminobenzoic acid scaffold. It is strictly contraindicated in patients with true IgE-mediated or severe anaphylactoid sulfa allergies.',
      bumetanide:
        'Bumetanide is a 3-aminobenzoic acid derivative containing a 5-sulfamoyl group. Despite higher potency than furosemide, it carries cross-reactivity risk in sulfonamide-allergic patients.',
      torsemide:
        'Torsemide contains a sulfonylurea moiety (-SO2-NH-CO-NH-). It possesses sulfur-oxygen-nitrogen connectivity that can trigger hypersensitivity in sulfa-allergic individuals.',
      hydrochlorothiazide:
        'Hydrochlorothiazide is a benzothiadiazine containing both an unsubstituted 7-sulfonamide and a cyclic 1,1-dioxide thiadiazine ring; it is a high-risk sulfa derivative and acts on the DCT rather than the thick ascending limb.',
    },
    highYieldPearl:
      'Ethacrynic acid is the only non-sulfonamide loop diuretic available. While all other loop diuretics (furosemide, bumetanide, torsemide) contain sulfonamide/sulfonyl moieties that risk cross-reactivity, ethacrynic acid utilizes a phenoxyacetic acid with an alpha,beta-unsaturated Michael acceptor; however, it carries a higher risk of ototoxicity.',
  },

  // 2. Type D: Antihypertensive Contraindications in Pregnancy (RAAS Inhibitors)
  {
    id: 'cumul2_q2_pregnancy_hypertension',
    type: 'contraindication-risk',
    moduleIds: ['antihypertensives_4_mcp2', 'antihypertensives_2_mcp2'],
    stem:
      'A 31-year-old woman at 24 weeks gestation (second trimester) develops gestational hypertension with blood pressure consistently measuring 168/104 mmHg. Select all candidate structures below that are STRICTLY CONTRAINDICATED in the second and third trimesters of pregnancy (FDA Pregnancy Category D / Boxed Warning) due to severe fetotoxicity (including oligohydramnios, fetal renal agenesis/dysgenesis, pulmonary hypoplasia, and neonatal anuria):',
    candidateStructures: [
      lisinopril,
      losartan,
      aliskiren,
      labetalol,
      methyldopa,
    ],
    correctStructureIds: ['lisinopril', 'losartan', 'aliskiren'],
    rationales: {
      lisinopril:
        'Lisinopril is an ACE inhibitor. Inhibiting Angiotensin II generation during fetal development abolishes efferent arteriolar tone and renal perfusion in the fetus, causing oligohydramnios, Potter-like sequence, calvarial hypoplasia, and fetal death. It carries a boxed warning against use throughout the second and third trimesters.',
      losartan:
        'Losartan is an Angiotensin II receptor blocker (ARB). Directly blocking AT1 receptors in the fetal kidney produces identical fetotoxic effects to ACE inhibitors (fetal renal ischemia, oligohydramnios, skull ossification defects); it is strictly contraindicated in pregnancy.',
      aliskiren:
        'Aliskiren is a direct renin inhibitor that blocks the conversion of angiotensinogen to Angiotensin I at the enzymatic source. Like ACE inhibitors and ARBs, systemic RAAS blockade is severely teratogenic/fetotoxic in 2nd and 3rd trimesters and carries a black box warning.',
      labetalol:
        'Labetalol is a mixed alpha-1/beta-1/beta-2 adrenergic antagonist. It does not disrupt fetal renal autoregulation and is considered a first-line antihypertensive agent for the management of chronic hypertension and preeclampsia in pregnancy.',
      methyldopa:
        'Methyldopa is a centrally acting alpha-2 adrenergic agonist prodrug. It is historically the classic first-line agent with an extensive safety record in pregnancy without teratogenic effects.',
    },
    highYieldPearl:
      'All drugs that inhibit the Renin-Angiotensin-Aldosterone System—direct renin inhibitors (aliskiren), ACE inhibitors (pril), and ARBs (sartan)—carry a Boxed Warning and are strictly contraindicated in pregnancy due to severe fetotoxicity (renal dysgenesis, oligohydramnios sequence). Preferred agents for pregnancy hypertension are labetalol, methyldopa, and extended-release nifedipine.',
  },

  // 3. Type D: Teratogenic Lipid-Lowering Agents (Statins & MTP Inhibitors)
  {
    id: 'cumul2_q3_pregnancy_teratogenic_lipids',
    type: 'contraindication-risk',
    moduleIds: ['antihyperlipidemics_mcp2'],
    stem:
      'A 29-year-old woman with severe familial hypercholesterolemia informs her physician that she is planning to conceive. Select all candidate lipid-lowering structures below that are CATEGORICALLY CONTRAINDICATED in pregnancy (FDA Category X / pregnancy warning) because cholesterol and downstream sterol isoprenoids are critically required for fetal organogenesis and embryonic cell membrane synthesis:',
    candidateStructures: [
      atorvastatin,
      simvastatin,
      lomitapide,
      colesevelam,
    ],
    correctStructureIds: ['atorvastatin', 'simvastatin', 'lomitapide'],
    rationales: {
      atorvastatin:
        'Atorvastatin is an HMG-CoA reductase inhibitor. Because cholesterol is an indispensable precursor for embryonic cell membranes, myelin sheath formation, and steroid hormone synthesis, blocking HMG-CoA reductase causes severe congenital anomalies (VACTERL association); it is contraindicated during pregnancy.',
      simvastatin:
        'Simvastatin is a lipophilic statin prodrug that readily penetrates biological membranes. Statin inhibition of mevalonate synthesis deprives the fetus of essential dolichols, ubiquinone, and cholesterol, resulting in high teratogenic risk and an absolute contraindication in pregnancy.',
      lomitapide:
        'Lomitapide is a microsomal triglyceride transfer protein (MTP) inhibitor. It impairs the assembly and secretion of ApoB-containing lipoproteins. Preclinical animal studies revealed embryofetal lethality, teratogenicity, and skeletal malformations; it carries a strict pregnancy contraindication and a black-box warning.',
      colesevelam:
        'Colesevelam is a large, non-absorbed polymeric bile acid sequestrant. Because it remains entirely confined to the intestinal lumen without systemic absorption, it does not reach the fetus and is considered FDA Category B (safe in pregnancy when lipid reduction is mandatory).',
    },
    highYieldPearl:
      'Statins (atorvastatin, simvastatin) and MTP inhibitors (lomitapide) are contraindicated in pregnancy due to severe disruption of embryonic sterol biosynthesis. In contrast, bile acid sequestrants (colesevelam, cholestyramine) are not absorbed from the GI tract and represent the safest lipid-lowering option during pregnancy.',
  },

  // 4. Type D: Bronchospasm Contraindications in Severe Asthma / COPD
  {
    id: 'cumul2_q4_asthma_bronchospasm_risk',
    type: 'contraindication-risk',
    moduleIds: ['antihypertensives_2_mcp2'],
    stem:
      'A 48-year-old patient with poorly controlled hypertension and severe persistent asthma (FEV1 52% of predicted with frequent nocturnal wheezing) requires adjunctive therapy. Select all candidate beta-adrenergic antagonist structures below that are CONTRAINDICATED or carry severe bronchospasm risk due to non-selective Beta-2 adrenergic receptor blockade in bronchial smooth muscle:',
    candidateStructures: [
      propranolol,
      nadolol,
      pindolol,
      atenolol,
      metoprolol,
    ],
    correctStructureIds: ['propranolol', 'nadolol', 'pindolol'],
    rationales: {
      propranolol:
        'Propranolol is a non-selective beta-1/beta-2 adrenergic antagonist (aryloxypropanolamine prototype). Antagonism of bronchial vascular and smooth muscle Beta-2 receptors eliminates physiological epinephrine-mediated bronchodilation and can precipitate fatal status asthmaticus.',
      nadolol:
        'Nadolol is a long-acting, non-selective beta-1/beta-2 antagonist containing a tetrahydronaphthalene-diol ring. It exhibits equal affinity for Beta-1 and Beta-2 receptors, conferring high bronchoconstrictive risk in asthmatic patients.',
      pindolol:
        'Pindolol is a non-selective beta-1/beta-2 antagonist with intrinsic sympathomimetic activity (ISA). Despite partial agonism, it significantly blocks endogenous Beta-2 bronchodilator tone and is contraindicated in active bronchospastic disease.',
      atenolol:
        'Atenolol is a cardioselective Beta-1 adrenergic antagonist featuring a para-acetamide substituent. At low-to-moderate doses, it preferentially blocks cardiac Beta-1 receptors while sparing bronchial Beta-2 receptors, making it significantly safer than non-selective blockers (though caution is still advised).',
      metoprolol:
        'Metoprolol is a cardioselective Beta-1 antagonist containing a para-methoxyethyl group. It displays ~20-fold selectivity for cardiac Beta-1 over Beta-2 receptors, minimizing bronchospasm risk relative to non-selective agents.',
    },
    highYieldPearl:
      'Non-selective beta-blockers (propranolol, nadolol, pindolol, timolol) block Beta-2 receptors on bronchial smooth muscle, triggering severe bronchospasm in asthma and COPD. Cardioselective beta-1 blockers (atenolol, metoprolol, bisoprolol, nebivolol) possess para-substituted aromatic rings that orient into the Beta-1 active site, preserving Beta-2 bronchodilation at therapeutic doses.',
  },

  // 5. Type B: Hydrochlorothiazide Structural Recognition -> Multi-Effect Statements
  {
    id: 'cumul2_q5_hctz_structural_effects',
    type: 'structure-to-effects',
    moduleIds: ['antihypertensives_1_mcp2'],
    stem:
      'Examine the classic diuretic agent displayed below. Select all biochemical targets, structural characteristics, electrolyte effects, and clinical pearls associated with this chemical structure:',
    singleStructure: hydrochlorothiazide,
    effectStatements: [
      {
        id: 'stmt_hctz_1',
        statement:
          'Inhibits the apical Na+/Cl- symporter (NCC) in the luminal membrane of distal convoluted tubule (DCT) epithelial cells by competing for the chloride binding site.',
        isCorrect: true,
        rationale:
          'This structure is Hydrochlorothiazide (HCTZ). Its primary mechanism is reversible competitive inhibition of the electroneutral Na+/Cl- cotransporter (NCC) in the early DCT, promoting saluresis of 3-5% of filtered sodium.',
      },
      {
        id: 'stmt_hctz_2',
        statement:
          'Contains a saturated 3,4-dihydro single bond on its benzothiadiazine core, providing ~10-fold higher diuretic potency than unsaturated chlorothiazide.',
        isCorrect: true,
        rationale:
          'HCTZ differs from chlorothiazide by reduction of the 3,4-double bond to a single bond (dihydro derivative). This structural modification increases lipophilicity and binding affinity by approximately 10-fold.',
      },
      {
        id: 'stmt_hctz_3',
        statement:
          'Exhibits residual, weak carbonic anhydrase (CA) inhibitory activity mediated by its unsubstituted 7-sulfamoyl (-SO2NH2) group.',
        isCorrect: true,
        rationale:
          'The free, unsubstituted primary sulfonamide (-SO2NH2) at position 7 mimics bicarbonate, conferring weak carbonic anhydrase inhibition (although much weaker than acetazolamide).',
      },
      {
        id: 'stmt_hctz_4',
        statement:
          'Competes with uric acid for proximal tubule Organic Anion Transporters (OAT1 and OAT3), predisposing patients to hyperuricemia and acute gout flares.',
        isCorrect: true,
        rationale:
          'Because HCTZ is an organic acid, it undergoes active secretion into the proximal tubule via OAT1/3. Competitive inhibition of uric acid secretion elevates serum uric acid and can trigger gout.',
      },
      {
        id: 'stmt_hctz_5',
        statement:
          'Typically induces severe hyperkalemia and metabolic acidosis due to inhibition of collecting duct proton ATPases.',
        isCorrect: false,
        rationale:
          'Thiazides cause HYPOkalemia (not hyperkalemia) and hypochloremic metabolic alkalosis, as increased luminal Na+ delivery to the cortical collecting duct stimulates aldosterone-mediated Na+ reabsorption coupled to K+ and H+ excretion.',
      },
    ],
    rationales: {
      hydrochlorothiazide:
        'Hydrochlorothiazide is a 6-chloro-3,4-dihydro-2H-1,2,4-benzothiadiazine-7-sulfonamide 1,1-dioxide. It blocks the DCT Na+/Cl- cotransporter (NCC), causes hypokalemic metabolic alkalosis, hyperuricemia, and hyperglycemia, and retains weak CA inhibition via its free 7-sulfamoyl moiety.',
    },
    highYieldPearl:
      'Hydrochlorothiazide (HCTZ) SAR: Saturation of the 3,4-double bond enhances potency 10x over chlorothiazide; 6-chloro is an essential electron-withdrawing group; 7-sulfonamide is indispensable for diuretic activity. Metabolic side effects include HyperGLUC (HyperGlycemia, HyperLipidemia, HyperUricemia, HyperCalcemia) along with Hypokalemia and Hyponatremia.',
  },

  // 6. Type B: Atorvastatin Structural Recognition -> Multi-Effect Statements
  {
    id: 'cumul2_q6_atorvastatin_structural_effects',
    type: 'structure-to-effects',
    moduleIds: ['antihyperlipidemics_mcp2'],
    stem:
      'Examine the synthetic lipid-lowering structure illustrated below. Select all biochemical mechanisms, structural features, and metabolic pathways that characterize this molecule:',
    singleStructure: atorvastatin,
    effectStatements: [
      {
        id: 'stmt_atorva_1',
        statement:
          'Contains an active open-chain 3,5-dihydroxyheptanoic acid pharmacophore that structurally mimics the high-energy tetrahedral transition state intermediate of the HMG-CoA reductase reaction.',
        isCorrect: true,
        rationale:
          'Atorvastatin contains a (3R,5R)-dihydroxyheptanoic acid side chain that binds to the catalytic site of HMG-CoA reductase with nanomolar affinity, mimicking the 3,5-dihydroxyglutarate intermediate formed during mevalonate reduction.',
      },
      {
        id: 'stmt_atorva_2',
        statement:
          'Belongs to Type II (synthetic) statins with a central pyrrole ring substituted by a 4-fluorophenyl group, an isopropyl moiety, and a phenylcarbamoyl substituent.',
        isCorrect: true,
        rationale:
          'Unlike Type I statins (lovastatin, simvastatin, pravastatin) which feature a decalin ring, atorvastatin is a synthetic Type II statin built on a central pentasubstituted pyrrole ring.',
      },
      {
        id: 'stmt_atorva_3',
        statement:
          'Is administered as an inactive bicyclic lactone prodrug that requires hepatic esterase bioactivation to reveal its active carboxylate form.',
        isCorrect: false,
        rationale:
          'Atorvastatin is administered in its active open-chain dihydroxy acid form (as atorvastatin calcium trihydrate). It is NOT a lactone prodrug (lovastatin and simvastatin are lactone prodrugs).',
      },
      {
        id: 'stmt_atorva_4',
        statement:
          'Undergoes extensive hepatic oxidative metabolism primarily catalyzed by cytochrome P450 3A4 (CYP3A4), generating active ortho- and para-hydroxylated metabolites.',
        isCorrect: true,
        rationale:
          'CYP3A4 hydroxylates atorvastatin to ortho- and para-hydroxyatorvastatin, which account for approximately 70% of circulating HMG-CoA reductase inhibitory activity, making it susceptible to interactions with strong CYP3A4 inhibitors (e.g., ketoconazole, clarithromycin).',
      },
      {
        id: 'stmt_atorva_5',
        statement:
          'Inhibiting hepatic cholesterol synthesis up-regulates cell-surface LDL receptor expression via SREBP-2 cleavage, accelerating clearance of circulating atherogenic LDL particles from plasma.',
        isCorrect: true,
        rationale:
          'Depletion of intracellular hepatocyte cholesterol activates sterol regulatory element-binding protein 2 (SREBP-2), driving transcriptional up-regulation of hepatic LDL receptors that clear ApoB-100 LDL from plasma.',
      },
    ],
    rationales: {
      atorvastatin:
        'Atorvastatin is a synthetic Type II statin built on a pyrrole core with an active (3R,5R)-dihydroxyheptanoic acid pharmacophore. It is administered directly as an active calcium salt, metabolized by CYP3A4 into active hydroxylated metabolites, and lowers LDL by up-regulating hepatic LDL receptors.',
    },
    highYieldPearl:
      'Statin Classification: Type I (fungal-derived: lovastatin, simvastatin, pravastatin) feature a hexahydronaphthalene (decalin) ring; lovastatin and simvastatin are closed lactone prodrugs. Type II (synthetic: atorvastatin, rosuvastatin, fluvastatin) feature diverse heterocyclic cores (pyrrole, pyrimidine, indole) with active open-chain dihydroxyheptanoic acids.',
  },

  // 7. Type A: Dihydropyridine vs Non-Dihydropyridine Calcium Channel Blockers
  {
    id: 'cumul2_q7_dihydropyridine_vs_non_dhp_ccb',
    type: 'case-to-structures',
    moduleIds: ['antihypertensives_3_mcp2'],
    stem:
      'A 64-year-old hypertensive patient with severe underlying sinus bradycardia (resting heart rate 42 bpm) and first-degree AV nodal block (PR interval 250 ms) requires blood pressure lowering. The cardiologist wants an L-type calcium channel blocker that acts as a potent, vascular-selective peripheral arteriolar vasodilator WITHOUT depressing SA nodal automaticity or prolonging AV nodal conduction time at therapeutic doses. Which candidate structures meet this clinical profile?',
    candidateStructures: [
      amlodipine,
      nifedipine,
      verapamil,
      diltiazem,
      sodium_nitroprusside,
    ],
    correctStructureIds: ['amlodipine', 'nifedipine'],
    rationales: {
      amlodipine:
        'Amlodipine is a third-generation 1,4-dihydropyridine (DHP) CCB. It binds to the extracellular portion of the Cav1.2 channel, exhibiting high vascular selectivity over myocardium (~100:1 vascular:cardiac ratio). It produces arteriolar vasodilation with zero direct negative chronotropic or dromotropic effects at therapeutic doses.',
      nifedipine:
        'Nifedipine is the prototype 1,4-dihydropyridine CCB. Its symmetrical diester core confers high selectivity for vascular smooth muscle L-type calcium channels, causing marked afterload reduction without direct SA or AV nodal suppression.',
      verapamil:
        'Verapamil is a phenylalkylamine non-DHP CCB that binds to the intracellular pore domain of Cav1.2 with high affinity for depolarized, active cardiac tissue (use-dependent block). It causes marked negative chronotropy, negative inotropy, and AV nodal slowing; it is strictly contraindicated in severe bradycardia and AV block.',
      diltiazem:
        'Diltiazem is a benzothiazepine non-DHP CCB that displays balanced cardiac and vascular actions, significantly slowing AV nodal conduction and heart rate; it is contraindicated in sick sinus syndrome and advanced AV block.',
      sodium_nitroprusside:
        'Sodium nitroprusside is an inorganic nitric oxide donor, not an L-type calcium channel blocker.',
    },
    highYieldPearl:
      'Calcium Channel Blockers (CCBs) divide into DHPs and non-DHPs: 1,4-Dihydropyridines (amlodipine, nifedipine) are vascular-selective arteriolar vasodilators with negligible SA/AV nodal depression, making them safe in bradycardia. Non-DHPs (verapamil, diltiazem) exert potent negative chronotropic and dromotropic cardiac actions and worsen bradycardia or AV block.',
  },

  // 8. Type C: ACE Inhibitor Active-Site Zinc-Binding Pharmacophore Motifs
  {
    id: 'cumul2_q8_acei_zinc_binding_motifs',
    type: 'comparative-sar',
    moduleIds: ['antihypertensives_4_mcp2'],
    stem:
      'Angiotensin-Converting Enzyme (ACE, peptidyl dipeptidase A) possesses an essential catalytic zinc cation (Zn2+) in its active site coordinated by His383, His387, and Glu411. Synthetic ACE inhibitors achieve high-affinity binding by coordinating this zinc ion. Select all candidate structures below that utilize a CARBOXYLATE moiety (dicarboxylate-containing ACE inhibitors) as their primary zinc-coordinating functional group:',
    candidateStructures: [
      enalaprilat,
      lisinopril,
      ramipril,
      captopril,
      fosinopril,
    ],
    correctStructureIds: ['enalaprilat', 'lisinopril', 'ramipril'],
    rationales: {
      enalaprilat:
        'Enalaprilat is the active tripeptide mimetic containing a carboxylate group (-COO-) that directly coordinates the catalytic Zn2+ ion of ACE. It is the prototype dicarboxylate zinc-binding ACE inhibitor.',
      lisinopril:
        'Lisinopril is an active, orally bioavailable di-acid ACE inhibitor containing an active-site zinc-coordinating carboxylate group, paired with a basic lysine side chain that forms an additional ionic interaction with the enzyme.',
      ramipril:
        'Ramipril is a prodrug whose bioactivated form (ramiprilat) coordinates catalytic Zn2+ through its cleaved carboxylate functional group, nestled against a bicyclic octahydrocyclopenta[b]pyrrole core.',
      captopril:
        'Captopril coordinates catalytic Zn2+ via a SULFHYDRYL (-SH / thiol) group. While conferring potent zinc coordination, the free thiol is responsible for captopril’s metallic taste, skin rash, and short duration of action due to disulfide dimer formation.',
      fosinopril:
        'Fosinopril coordinates catalytic Zn2+ via a PHOSPHINATE (-PO2-) group (phosphinic acid ester prodrug), making it the only phosphinate-type ACE inhibitor.',
    },
    highYieldPearl:
      'ACE Inhibitor Zinc-Binding Groups: 1) Sulfhydryl/Thiol (captopril: high affinity, causes rash and taste disturbance); 2) Dicarboxylate/Carboxylate (enalaprilat, lisinopril, ramiprilat, benazeprilat: excellent tolerance, no taste disturbance); 3) Phosphinate (fosinoprilat: tetrahedral geometry mimicking the transition state with dual renal/hepatic elimination).',
  },

  // 9. Type D: Statin-Fibrate Drug Interaction & Fatal Rhabdomyolysis Risk
  {
    id: 'cumul2_q9_statin_rhabdomyolysis_drug_interaction',
    type: 'contraindication-risk',
    moduleIds: ['antihyperlipidemics_mcp2'],
    stem:
      'A 62-year-old patient with high cardiovascular risk is maintained on Simvastatin 40 mg daily for secondary prevention. Because of persistent severe hypertriglyceridemia (fasting triglycerides 540 mg/dL), an adjunctive fibrate (PPAR-alpha agonist) is considered. Select the candidate structure below that is STRICTLY CONTRAINDICATED with statins because it powerfully inhibits statin glucuronidation (via hepatic UGT2B7) and blocks OATP1B1 hepatic uptake, multiplying statin plasma AUC several-fold and precipitating fatal rhabdomyolysis:',
    candidateStructures: [
      gemfibrozil,
      fenofibrate,
      ezetimibe,
      colesevelam,
    ],
    correctStructureIds: ['gemfibrozil'],
    rationales: {
      gemfibrozil:
        'Gemfibrozil and its 1-O-beta-glucuronide metabolite are potent irreversible/mechanism-based inhibitors of CYP2C8, and competitive inhibitors of OATP1B1 and UGT2B7 (the enzyme responsible for statin lactonization/clearance). Co-administration with statins (especially simvastatin) causes a 2- to 6-fold surge in statin AUC and carries a severe black-box warning for life-threatening rhabdomyolysis and acute renal failure.',
      fenofibrate:
        'Fenofibrate does not significantly inhibit UGT2B7 or statin glucuronidation pathways, and causes only minimal changes in statin systemic exposure. It is the preferred fibrate of choice when combined with statin therapy.',
      ezetimibe:
        'Ezetimibe inhibits NPC1L1 cholesterol absorption in the jejunal brush border. It is safely and synergistically combined with statins without interfering with statin metabolic clearance.',
      colesevelam:
        'Colesevelam is a non-absorbed bile acid resin that binds bile salts in the gut lumen without metabolic interactions with statins.',
    },
    highYieldPearl:
      'Never combine Gemfibrozil with a Statin! Gemfibrozil blocks UGT2B7-mediated statin glucuronidation and OATP1B1 uptake, triggering massive statin accumulation and rhabdomyolysis. Fenofibrate does not inhibit statin glucuronidation and is the safe, recommended fibrate partner when statin-fibrate combination therapy is required.',
  },

  // 10. Type A: Centrally Acting Alpha-2 Adrenergic Agonists (Sympatholytics)
  {
    id: 'cumul2_q10_central_alpha2_agonists',
    type: 'case-to-structures',
    moduleIds: ['antihypertensives_2_mcp2'],
    stem:
      'A 52-year-old patient with refractory hypertension requires an agent that crosses the blood-brain barrier and selectively stimulates presynaptic Alpha-2A adrenergic receptors in the rostral ventrolateral medulla (RVLM) and nucleus tractus solitarii (NTS), suppressing central sympathetic vasomotor outflow and decreasing peripheral vascular resistance and heart rate. Which candidate structures act via this central sympatholytic mechanism?',
    candidateStructures: [
      clonidine,
      guanfacine,
      methyldopa,
      prazosin,
      atenolol,
    ],
    correctStructureIds: ['clonidine', 'guanfacine', 'methyldopa'],
    rationales: {
      clonidine:
        'Clonidine is a 2-(arylamino)imidazoline derivative. Its ortho,ortho-dichloro substituents twist the phenyl and imidazoline rings perpendicular to each other, conferring high central Alpha-2A adrenergic receptor agonism and rapid CNS penetration.',
      guanfacine:
        'Guanfacine is an open-chain phenylacetylguanidine derivative with high selectivity for central Alpha-2A receptors over Alpha-2B/C, producing central sympatholysis with fewer sedative side effects than clonidine.',
      methyldopa:
        'Methyldopa is an L-alpha-amino acid prodrug that crosses the blood-brain barrier via the L-type amino acid transporter (LAT1), where it is decarboxylated by L-aromatic amino acid decarboxylase to alpha-methyldopamine and hydroxylated by dopamine beta-hydroxylase to active (1R,2S)-alpha-methylnorepinephrine, a potent central Alpha-2 agonist.',
      prazosin:
        'Prazosin is a quinazoline derivative that selectively antagonizes peripheral vascular Alpha-1 adrenergic receptors; it is not a central Alpha-2 agonist.',
      atenolol:
        'Atenolol is a hydrophilic, cardioselective Beta-1 adrenergic receptor antagonist; it does not stimulate central Alpha-2 receptors.',
    },
    highYieldPearl:
      'Centrally acting sympatholytics (clonidine, guanfacine, methyldopa) stimulate presynaptic Alpha-2A receptors in the brainstem RVLM, reducing sympathetic tone. Methyldopa is a prodrug biotransformed in central adrenergic neurons to (1R,2S)-alpha-methylnorepinephrine. Abrupt withdrawal of clonidine precipitates severe rebound hypertensive crisis.',
  },

  // 11. Type A: Selective Mineralocorticoid Receptor Antagonists (Potassium-Sparing)
  {
    id: 'cumul2_q11_potassium_sparing_aldosterone_antagonists',
    type: 'case-to-structures',
    moduleIds: ['antihypertensives_1_mcp2'],
    stem:
      'A 55-year-old male with resistant hypertension and primary aldosteronism needs a potassium-sparing diuretic that acts as a competitive antagonist of the mineralocorticoid (aldosterone) receptor in the renal cortical collecting tubule. The patient previously developed severe, painful bilateral gynecomastia and erectile dysfunction from an older steroid-based diuretic. Which candidate structure provides high mineralocorticoid receptor selectivity with minimal cross-reactivity for androgen and progesterone receptors, avoiding gynecomastia?',
    candidateStructures: [
      eplerenone,
      spironolactone,
      amiloride,
      triamterene,
    ],
    correctStructureIds: ['eplerenone'],
    rationales: {
      eplerenone:
        'Eplerenone contains a 9,11-alpha-epoxy bridge and a 7-alpha-carbomethoxy substituent on its steroid scaffold. These modifications sterically hinder binding to androgen and progesterone receptors (20- to 500-fold lower cross-reactivity than spironolactone), preventing painful gynecomastia, breast tenderness, and endocrine disturbances.',
      spironolactone:
        'Spironolactone contains a 7-alpha-thioacetyl group on its steroid ring. It non-selectively antagonizes androgen receptors and acts as a partial agonist at progesterone receptors, leading to gynecomastia in up to 10% of male patients.',
      amiloride:
        'Amiloride is an acylguanidine that directly blocks the epithelial sodium channel (ENaC) in the apical membrane of principal cells; it is not a nuclear mineralocorticoid receptor antagonist.',
      triamterene:
        'Triamterene is a pteridine derivative that directly blocks luminal ENaC channels; like amiloride, it does not act at the mineralocorticoid receptor.',
    },
    highYieldPearl:
      'Aldosterone Antagonists: Spironolactone non-selectively blocks mineralocorticoid, androgen, and progesterone receptors, frequently causing painful gynecomastia and menstrual irregularities. Eplerenone’s 9,11-epoxy modification confers high mineralocorticoid selectivity, eliminating endocrine adverse effects while sparing potassium.',
  },

  // 12. Type C: Prodrug Ester Cleavage to Active Carboxylic Acids
  {
    id: 'cumul2_q12_prodrug_ester_bioactivation',
    type: 'comparative-sar',
    moduleIds: ['antihypertensives_4_mcp2', 'antihyperlipidemics_mcp2'],
    stem:
      'Many cardiovascular drugs contain polar, ionized carboxylate groups that impair oral intestinal absorption. Medicinal chemists overcome this by formulating neutral, lipophilic ester prodrugs that undergo in vivo enzymatic cleavage by carboxylesterases to unleash the active carboxylic acid moiety. Select all candidate structures below that represent inactive or weakly active ESTER PRODRUGS requiring esterase bioactivation:',
    candidateStructures: [
      enalapril,
      candesartan_cilexetil,
      fenofibrate,
      lisinopril,
      losartan,
    ],
    correctStructureIds: ['enalapril', 'candesartan_cilexetil', 'fenofibrate'],
    rationales: {
      enalapril:
        'Enalapril is an ethyl ester prodrug designed to mask the carboxylate of enalaprilat, enhancing oral bioavailability from ~10% to ~60%. Hepatic carboxylesterase-1 (CES1) hydrolyzes the ethyl ester to reveal active enalaprilat.',
      candesartan_cilexetil:
        'Candesartan cilexetil is an inactive carbonate ester prodrug (cilexetil ester). During absorption in the gastrointestinal mucosa, esterases rapidly cleave the ester bond to release the active tetrazole-carboxylate ARB candesartan.',
      fenofibrate:
        'Fenofibrate is an isopropyl ester prodrug of fenofibric acid. Tissue and plasma carboxylesterases rapidly cleave the isopropyl ester, liberating free fenofibric acid to activate nuclear PPAR-alpha.',
      lisinopril:
        'Lisinopril is NOT a prodrug. Despite containing two free carboxylic acid groups, its basic lysine epsilon-amino group forms a zwitterionic species that enables sufficient oral bioavailability (~25%) without esterification.',
      losartan:
        'Losartan is an active drug containing an imidazole-5-carbinol (hydroxymethyl) group. While CYP2C9 and CYP3A4 oxidize it into the more potent active metabolite EXP-3174, losartan itself possesses intrinsic AT1 receptor affinity and is not an ester prodrug.',
    },
    highYieldPearl:
      'Ester Prodrugs in MedChem: Enalapril (ethyl ester), candesartan cilexetil (carbonate ester), and fenofibrate (isopropyl ester) are lipophilic prodrugs designed to improve oral absorption before rapid in vivo esterase cleavage to their active carboxylic acids. Lisinopril is an active di-acid, and losartan is an active imidazole alcohol.',
  },

  // 13. Type B: Sodium Nitroprusside Structural Recognition -> Multi-Effect Statements
  {
    id: 'cumul2_q13_cyanide_thiocyanate_toxicity',
    type: 'structure-to-effects',
    moduleIds: ['antihypertensives_3_mcp2'],
    stem:
      'Examine the inorganic coordination complex displayed below. Select all hemodynamic mechanisms, metabolic pathways, and toxicities associated with this parenteral emergency agent:',
    singleStructure: sodium_nitroprusside,
    effectStatements: [
      {
        id: 'stmt_snp_1',
        statement:
          'Spontaneously releases nitric oxide (NO) in the bloodstream non-enzymatically upon electron transfer from oxyhemoglobin, without requiring tissue sulfhydryls or mitochondrial aldehyde dehydrogenase.',
        isCorrect: true,
        rationale:
          'Sodium nitroprusside contains an iron-bound linear nitrosyl ligand (NO+). In vascular smooth muscle and RBCs, reaction with oxyhemoglobin donates an electron, spontaneously liberating free NO without enzymatic bioactivation.',
      },
      {
        id: 'stmt_snp_2',
        statement:
          'Produces rapid, balanced arterial and venous vasodilation, resulting in simultaneous reduction of both cardiac afterload and preload.',
        isCorrect: true,
        rationale:
          'Because NO is released directly and equipotently into both arterial and venous beds, sodium nitroprusside achieves balanced arteriodilation and venodilation, lowering systemic vascular resistance and pulmonary capillary wedge pressure.',
      },
      {
        id: 'stmt_snp_3',
        statement:
          'Each molecule contains 5 coordinate cyanide (CN-) ligands; free cyanide released during metabolism is converted by mitochondrial rhodanese to thiocyanate (SCN-), which can accumulate and cause neurotoxicity.',
        isCorrect: true,
        rationale:
          'Nitroprusside contains 5 cyanide ligands. Hepatic rhodanese transfers sulfur from thiosulfate to convert toxic cyanide into thiocyanate. In renal insufficiency or prolonged infusions, thiocyanate accumulates, causing confusion, hyperreflexia, and seizures.',
      },
      {
        id: 'stmt_snp_4',
        statement:
          'Exhibits an immediate onset of action (< 1 minute) and a short duration of 1 to 10 minutes, necessitating continuous intra-arterial blood pressure titration via infusion pump.',
        isCorrect: true,
        rationale:
          'The hemodynamic response begins within seconds and dissipates within 1-10 minutes of stopping the infusion, requiring intensive care continuous monitoring to prevent catastrophic hypotension.',
      },
      {
        id: 'stmt_snp_5',
        statement:
          'Is completely safe for multi-day infusions (> 72 hours) at maximum titration rates without monitoring acid-base status or co-administering sodium thiosulfate.',
        isCorrect: false,
        rationale:
          'Carries a Black-Box Warning for lethal cyanide toxicity. High-rate infusions (> 2 mcg/kg/min) deplete endogenous thiosulfate stores, leading to cyanide binding to mitochondrial cytochrome c oxidase, severe lactic acidosis, and death.',
      },
    ],
    rationales: {
      sodium_nitroprusside:
        'Sodium nitroprusside is an octahedral coordination complex [Fe(CN)5(NO)]2- with 2 sodium counterions. It non-enzymatically donates nitric oxide to produce balanced preload and afterload reduction, but releases 5 cyanide ions per molecule, carrying boxed warnings for lactic acidosis, cyanide poisoning, and thiocyanate toxicity.',
    },
    highYieldPearl:
      'Sodium Nitroprusside: Balanced arterio- and venodilator. Unlike nitroglycerin (venous selective, requires ALDH2 bioactivation and develops tolerance), nitroprusside decomposes non-enzymatically, has no tolerance, but releases 5 cyanide ions. Treatment of cyanide toxicity: Sodium thiosulfate (rhodanese substrate) and hydroxocobalamin (chelates cyanide to form cyanocobalamin).',
  },

  // 14. Type C: Beta-Blockers with Intrinsic Sympathomimetic Activity (ISA)
  {
    id: 'cumul2_q14_beta_blockers_isa_antagonism',
    type: 'comparative-sar',
    moduleIds: ['antihypertensives_2_mcp2'],
    stem:
      'A 50-year-old hypertensive patient experiences severe, symptomatic sinus bradycardia (heart rate drops below 44 bpm with lightheadedness) whenever conventional beta-blockers are initiated. The cardiologist wishes to select an antihypertensive beta-blocker with Intrinsic Sympathomimetic Activity (ISA)—a partial agonist that binds beta receptors to block high sympathetic bursts while maintaining basal receptor stimulation to prevent excessive bradycardia. Which candidate structures possess Intrinsic Sympathomimetic Activity (ISA)?',
    candidateStructures: [
      pindolol,
      propranolol,
      atenolol,
      metoprolol,
      nadolol,
    ],
    correctStructureIds: ['pindolol'],
    rationales: {
      pindolol:
        'Pindolol is a non-selective beta-blocker containing an indole ring. It acts as a potent PARTIAL AGONIST (possessing intrinsic sympathomimetic activity, ISA). At resting baseline when sympathetic tone is low, it weakly stimulates beta receptors to avoid resting bradycardia, while blunting exercise-induced tachycardia.',
      propranolol:
        'Propranolol is a pure antagonist with ZERO intrinsic sympathomimetic activity (no ISA). It suppresses resting heart rate significantly and will worsen symptomatic sinus bradycardia.',
      atenolol:
        'Atenolol is a selective Beta-1 antagonist with NO intrinsic sympathomimetic activity (no ISA), causing dose-dependent reductions in resting heart rate.',
      metoprolol:
        'Metoprolol is a selective Beta-1 antagonist devoid of ISA, commonly associated with resting bradycardia.',
      nadolol:
        'Nadolol is a non-selective beta antagonist with no ISA and an exceptionally long elimination half-life (~20 hours), causing marked bradycardia.',
    },
    highYieldPearl:
      'Beta-Blockers with ISA (Intrinsic Sympathomimetic Activity): Pindolol and Acebutolol act as partial agonists. They are indicated for hypertensive patients with underlying resting bradycardia because they avoid severe heart rate drops while lowering systemic vascular resistance.',
  },

  // 15. Type B: Clonidine Structural Recognition -> Multi-Effect Statements
  {
    id: 'cumul2_q15_clonidine_rebound_hypertension',
    type: 'structure-to-effects',
    moduleIds: ['antihypertensives_2_mcp2'],
    stem:
      'Consider the classic imidazoline sympatholytic agent shown below. Select all pharmacological mechanisms, clinical characteristics, and withdrawal risks associated with this chemical structure:',
    singleStructure: clonidine,
    effectStatements: [
      {
        id: 'stmt_clon_1',
        statement:
          'Contains an ortho,ortho-dichlorophenyl ring connected via an amino bridge to a 2-imidazoline ring, conferring high central Alpha-2 adrenergic and I1-imidazoline receptor affinity.',
        isCorrect: true,
        rationale:
          'The two ortho-chlorine substituents sterically force the phenyl ring out of coplanarity with the imidazoline ring (perpendicular conformation), optimizing affinity for central Alpha-2A and I1-imidazoline receptors.',
      },
      {
        id: 'stmt_clon_2',
        statement:
          'Abrupt discontinuation after chronic therapy can trigger a life-threatening rebound hypertensive crisis characterized by massive surges in circulating catecholamines.',
        isCorrect: true,
        rationale:
          'Chronic stimulation down-regulates presynaptic Alpha-2 receptors. Abrupt cessation removes the inhibitory brake, unleashing explosive norepinephrine release and severe hypertensive rebound that requires gradual tapering.',
      },
      {
        id: 'stmt_clon_3',
        statement:
          'Common side effects include sedation, drowsiness, dry mouth (xerostomia), and depression of mental alertness due to central adrenergic inhibition.',
        isCorrect: true,
        rationale:
          'Crosses the blood-brain barrier readily; central inhibition of salivary secretion and sedation occur in over 40-50% of patients.',
      },
      {
        id: 'stmt_clon_4',
        statement:
          'Rapid intravenous bolus injection can produce a paradoxical transient spike in blood pressure before central sympatholysis causes sustained hypotension.',
        isCorrect: true,
        rationale:
          'Direct exposure of peripheral vascular smooth muscle to high bolus concentrations stimulates post-synaptic vascular Alpha-2B receptors, causing transient vasoconstriction before the drug distributes into the brainstem.',
      },
      {
        id: 'stmt_clon_5',
        statement:
          'Irreversibly alkylates vascular Alpha-1 adrenergic receptors through the spontaneous formation of a reactive ethyleneiminium (aziridinium) intermediate.',
        isCorrect: false,
        rationale:
          'Clonidine is a reversible non-covalent agonist. Formation of a covalent aziridinium ion is the hallmark mechanism of phenoxybenzamine (a haloalkylamine irreversible alpha-blocker), not clonidine.',
      },
    ],
    rationales: {
      clonidine:
        'Clonidine is a 2-(2,6-dichlorophenylamino)-2-imidazoline centrally acting Alpha-2 agonist. It reduces sympathetic outflow from the brainstem, but can cause transient vasoconstriction upon IV bolus (via vascular Alpha-2B receptors) and triggers life-threatening rebound hypertension if abruptly discontinued.',
    },
    highYieldPearl:
      'Clonidine Pearls: Ortho-dichloro substitution ensures non-planar active conformation. Stimulates central Alpha-2A and I1 receptors. Classic side effects: sedation and xerostomia. Critical safety rule: Never abruptly stop clonidine—gradual dose tapering is mandatory to prevent rebound hypertensive crisis from massive uninhibited catecholamine release.',
  },

  // 16. Type D: Bilateral Renal Artery Stenosis & RAAS Blockade Collapse of GFR
  {
    id: 'cumul2_q16_bilateral_renal_artery_stenosis',
    type: 'contraindication-risk',
    moduleIds: ['antihypertensives_4_mcp2', 'antihypertensives_3_mcp2'],
    stem:
      'A 67-year-old patient with severe peripheral vascular disease presents with refractory hypertension. Diagnostic renal angiography reveals high-grade bilateral renal artery stenosis (critical bilateral narrowing of renal arterial inflow). In this setting, adequate Glomerular Filtration Rate (GFR) is critically maintained by high intrarenal Angiotensin II levels causing preferential vasoconstriction of the efferent arteriole, maintaining intraglomerular hydrostatic pressure across the stenotic gradient. Select all candidate structures below that are STRICTLY CONTRAINDICATED because ablating efferent arteriolar tone causes a catastrophic collapse in glomerular filtration pressure and acute renal failure:',
    candidateStructures: [
      lisinopril,
      losartan,
      aliskiren,
      amlodipine,
      furosemide,
    ],
    correctStructureIds: ['lisinopril', 'losartan', 'aliskiren'],
    rationales: {
      lisinopril:
        'Lisinopril blocks Angiotensin II production. In bilateral renal artery stenosis, the drop in Angiotensin II causes immediate dilation of the renal efferent arteriole, eliminating intraglomerular hydrostatic filtration pressure and triggering acute anuric renal failure.',
      losartan:
        'Losartan selectively blocks AT1 receptors on the efferent arteriole. Blocking efferent arteriolar constriction in the face of severely restricted bilateral inflow results in severe precipitous drops in GFR and acute azotemia.',
      aliskiren:
        'Aliskiren is a direct renin inhibitor that shuts down the entire RAAS cascade, ablating efferent arteriolar tone and precipitating acute renal decompensation in bilateral renal artery stenosis.',
      amlodipine:
        'Amlodipine is a dihydropyridine calcium channel blocker that predominantly dilates peripheral and renal AFFERENT arterioles without selectively ablating efferent arteriolar tone; it does not trigger acute GFR collapse and is safe in bilateral renal artery stenosis.',
      furosemide:
        'Furosemide is a loop diuretic that inhibits NKCC2 in Henle’s loop; while excessive volume depletion must be avoided, it does not selectively ablate efferent arteriolar resistance.',
    },
    highYieldPearl:
      'Bilateral Renal Artery Stenosis Hemodynamics: When renal perfusion pressure is severely reduced by bilateral stenosis, GFR is maintained exclusively by Angiotensin II-mediated constriction of the EFFERENT arteriole. Blocking RAAS (ACEIs, ARBs, DRIs) dilates the efferent arteriole, causing intraglomerular hydrostatic pressure to collapse and inducing acute renal failure.',
  },
];
