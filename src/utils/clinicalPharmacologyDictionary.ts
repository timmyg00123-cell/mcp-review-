import type { ChemicalStructure } from '../types/reviewModule';

export interface ClinicalPharmacologyProfile {
  metabolism: string;
  metabolismLocation?: string;
  bbbCrossing: string;
  bbbCnsEffects?: string;
  pregnancyRisk: 'safe' | 'caution' | 'contraindicated';
  pregnancyCategory?: string;
  pregnancySummary: string;
  clinicalPearls?: string;
}

/**
 * Curated clinical pharmacology database for all MedChem II cardiovascular drugs.
 * Indexed by normalized lowercase drug names and common aliases.
 */
export const CLINICAL_PHARMACOLOGY_DICTIONARY: Record<string, ClinicalPharmacologyProfile> = {
  // ==========================================
  // MODULE 8: ANTIPLATELET AGENTS
  // ==========================================
  aspirin: {
    metabolism: 'Rapid ester hydrolysis by plasma and hepatic esterases to salicylic acid; minor CYP2C9 oxidation.',
    metabolismLocation: 'Gut mucosa, blood plasma, and liver.',
    bbbCrossing: 'Moderate CNS penetration. Salicylate crosses the BBB.',
    bbbCnsEffects: 'Tinnitus, vertigo, and hyperventilation in toxicity/salicylism.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C (1st/2nd trimester) / D (3rd trimester)',
    pregnancySummary: 'Low-dose (81 mg) used for preeclampsia prophylaxis. Full-dose contraindicated in 3rd trimester due to premature closure of ductus arteriosus and fetal renal impairment.',
    clinicalPearls: 'Irreversibly acetylates Ser529 of platelet COX-1; platelet lifetime suppression (7-10 days).'
  },
  clopidogrel: {
    metabolism: 'Prodrug requiring two-step hepatic CYP activation (primarily CYP2C19, CYP3A4, CYP1A2). ~85% shunted to inactive metabolite by esterases (CES1).',
    metabolismLocation: 'Hepatic CYP450 bioactivation (thiolactone intermediate -> active thiol).',
    bbbCrossing: 'Low BBB penetration; minimal CNS accumulation.',
    bbbCnsEffects: 'Rare dizziness or headache; no prominent central sedation.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category B',
    pregnancySummary: 'Limited human data. Discontinue 5-7 days before delivery to prevent maternal hemorrhage; reserved for high-risk coronary stent cases.',
    clinicalPearls: 'CYP2C19 loss-of-function alleles (*2, *3) cause clinical resistance and stent thrombosis. Avoid strong CYP2C19 inhibitors like omeprazole.'
  },
  prasugrel: {
    metabolism: 'Prodrug requiring single-step rapid de-esterification by hCE60/plasma esterases to thiolactone, then rapid CYP3A4/CYP2B6 bioactivation.',
    metabolismLocation: 'Intestinal esterases followed by hepatic CYP450.',
    bbbCrossing: 'Low BBB penetration.',
    bbbCnsEffects: 'Minimal central nervous system adverse effects.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category B',
    pregnancySummary: 'Animal studies show no teratogenicity, but severe bleeding risk at delivery. Use only if benefits outweigh risks.',
    clinicalPearls: 'More rapid and consistent antiplatelet effect than clopidogrel; contraindicated in patients with prior TIA/stroke due to high intracranial hemorrhage risk.'
  },
  ticlopidine: {
    metabolism: 'Extensive hepatic CYP bioactivation via CYP2C19 and CYP3A4 into active thiol metabolite.',
    metabolismLocation: 'Hepatic cytochrome P450.',
    bbbCrossing: 'Moderate lipophilicity with limited BBB penetration.',
    bbbCnsEffects: 'Headache, dizziness, peripheral neuropathy reported rarely.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category B',
    pregnancySummary: 'Rarely used due to life-threatening neutropenia and thrombotic thrombocytopenic purpura (TTP). Avoid in pregnancy.',
    clinicalPearls: 'First-generation thienopyridine; requires biweekly CBC monitoring for first 3 months.'
  },
  ticagrelor: {
    metabolism: 'Active drug (NOT a prodrug). Metabolized by CYP3A4/5 to active metabolite AR-C124910XX (equipotent).',
    metabolismLocation: 'Hepatic CYP3A4/5.',
    bbbCrossing: 'Moderate BBB penetration.',
    bbbCnsEffects: 'Dizziness; dyspnea mediated via adenosine reuptake inhibition (ENT1 block).',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Animal studies showed early resorption and decreased fetal weight. Reserve for high-risk maternal indications.',
    clinicalPearls: 'Reversible P2Y12 allosteric antagonist. Inhibits ENT1, elevating extracellular adenosine levels causing dyspnea.'
  },
  cangrelor: {
    metabolism: 'Dephosphorylation by plasma ecto-nucleotidases directly in the circulation; independent of hepatic or renal clearance.',
    metabolismLocation: 'Intravascular plasma degradation (half-life 3-6 minutes).',
    bbbCrossing: 'Negligible BBB penetration (polar polyphosphate nucleotide).',
    bbbCnsEffects: 'None; strictly vascular action.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Intravenous antiplatelet agent. Safety not established in human pregnancy; high peripartum bleeding risk.',
    clinicalPearls: 'IV direct P2Y12 inhibitor; recovery of normal platelet function occurs within 1 hour of infusion cessation.'
  },
  vorapaxar: {
    metabolism: 'Extensive hepatic metabolism primarily via CYP3A4 and CYP2J2 to active metabolite M20.',
    metabolismLocation: 'Liver; terminal elimination half-life ~8 days.',
    bbbCrossing: 'Lipophilic tricyclic scaffold; crosses BBB.',
    bbbCnsEffects: 'Depression, dizziness; increased risk of fatal intracranial hemorrhage.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category B',
    pregnancySummary: 'Long half-life means prolonged fetal and maternal bleeding exposure. Avoid unless strictly indicated.',
    clinicalPearls: 'PAR-1 thrombin receptor antagonist with insurmountable, effectively irreversible binding.'
  },
  eptifibatide: {
    metabolism: 'Renal clearance of intact cyclic peptide and minor deamidation/peptide cleavage.',
    metabolismLocation: 'Renal filtration and plasma peptidases.',
    bbbCrossing: 'Negligible BBB penetration (hydrophilic cyclic heptapeptide).',
    bbbCnsEffects: 'None reported.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category B',
    pregnancySummary: 'IV GPIIb/IIIa antagonist. Bleeding risk during labor and delivery; use only for acute coronary intervention.',
    clinicalPearls: 'KGD sequence confers selective GPIIb/IIIa antagonism; cleared renally (requires dose adjustment in CKD).'
  },
  tirofiban: {
    metabolism: 'Limited hepatic metabolism; cleared primarily unchanged in urine and feces.',
    metabolismLocation: 'Renal excretion (~65%) and biliary clearance.',
    bbbCrossing: 'Negligible BBB penetration.',
    bbbCnsEffects: 'None.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category B',
    pregnancySummary: 'IV non-peptide GPIIb/IIIa blocker. High risk of maternal-fetal hemorrhage; discontinue prior to delivery.',
    clinicalPearls: 'Non-peptide tyrosine derivative mimicking the RGD integrin recognition sequence.'
  },
  dipyridamole: {
    metabolism: 'Hepatic conjugation with glucuronic acid, followed by biliary excretion (enterohepatic circulation).',
    metabolismLocation: 'Hepatic glucuronidation.',
    bbbCrossing: 'Moderate BBB penetration.',
    bbbCnsEffects: 'Headache (prominent due to cerebral vasodilation/adenosine accumulation), dizziness.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category B',
    pregnancySummary: 'Crosses placenta in small amounts; generally well tolerated but potential for maternal vasodilation and hypotension.',
    clinicalPearls: 'Inhibits adenosine deaminase/phosphodiesterase (PDE3/5) and blocks cellular adenosine reuptake.'
  },
  cilostazol: {
    metabolism: 'Extensive hepatic metabolism by CYP3A4 (major) and CYP2C19 (minor) to active metabolites.',
    metabolismLocation: 'Liver.',
    bbbCrossing: 'Moderate BBB crossing.',
    bbbCnsEffects: 'Severe headache (~30%), dizziness.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Embryofetal toxicity and cardiovascular anomalies observed in animal studies. Contraindicated in heart failure.',
    clinicalPearls: 'Selective PDE3 inhibitor; increases cAMP causing vasodilation and platelet inhibition. Black box warning: contraindicated in all heart failure.'
  },
  abciximab: {
    metabolism: 'Proteolytic degradation by reticuloendothelial system and circulating proteases.',
    metabolismLocation: 'Vascular reticuloendothelial clearance.',
    bbbCrossing: 'Negligible BBB penetration (large IgG Fab antibody fragment).',
    bbbCnsEffects: 'None.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'High molecular weight Fab fragment; theoretical placental transfer late in gestation. Acute periprocedural bleeding risk.',
    clinicalPearls: 'Chimeric monoclonal Fab fragment blocking GPIIb/IIIa and vitronectin alpha-V/beta-3 receptors.'
  },

  // ==========================================
  // MODULE 9: ANTICOAGULANTS & THROMBOLYTICS
  // ==========================================
  warfarin: {
    metabolism: 'Stereoselective hepatic metabolism: S-warfarin (3-5x more potent) primarily by CYP2C9; R-warfarin by CYP1A2, CYP2C19, CYP3A4.',
    metabolismLocation: 'Hepatic cytochrome P450 oxidation to inactive hydroxylated metabolites.',
    bbbCrossing: 'Readily crosses blood-brain barrier and placenta.',
    bbbCnsEffects: 'Fatal intracranial hemorrhage risk with supratherapeutic INR.',
    pregnancyRisk: 'contraindicated',
    pregnancyCategory: 'Category X (Contraindicated in Pregnancy)',
    pregnancySummary: 'Severe teratogen: Fetal Warfarin Syndrome (nasal hypoplasia, stippled epiphyses, microcephaly, optic atrophy, blindness, mental retardation). Crosses placenta freely.',
    clinicalPearls: 'Inhibits VKORC1 preventing gamma-carboxylation of factors II, VII, IX, X, Protein C, and Protein S. Polarity increased by CYP2C9 oxidation.'
  },
  heparin: {
    metabolism: 'Depolymerization by endothelial and macrophage heparinases, followed by renal elimination of shorter fragments.',
    metabolismLocation: 'Reticuloendothelial system and endothelial cell clearance.',
    bbbCrossing: 'Does NOT cross BBB or placenta (large, highly charged polyanion).',
    bbbCnsEffects: 'None (no CNS penetration).',
    pregnancyRisk: 'safe',
    pregnancyCategory: 'Category C (Standard Anticoagulant of Choice)',
    pregnancySummary: 'Safe in pregnancy: large negatively charged glycosaminoglycan does NOT cross the placenta. Anticoagulant of choice for gestational VTE and mechanical valves.',
    clinicalPearls: 'Accelerates Antithrombin III (AT) inhibition of thrombin (IIa) and Factor Xa by 1000-fold via ternary 1:1:1 complex and 18-saccharide chain.'
  },
  enoxaparin: {
    metabolism: 'Desulfation and depolymerization in the liver; cleared primarily by renal elimination of active fragments.',
    metabolismLocation: 'Hepatic desulfation and renal clearance.',
    bbbCrossing: 'Does NOT cross BBB or placenta (hydrophilic polysulfated GAG).',
    bbbCnsEffects: 'None.',
    pregnancyRisk: 'safe',
    pregnancyCategory: 'Category B (Anticoagulant of Choice in Pregnancy)',
    pregnancySummary: 'Safe in pregnancy: low molecular weight heparin does not cross placenta. Anticoagulant of choice for gestational thromboprophylaxis.',
    clinicalPearls: 'LMWH with high anti-Xa to anti-IIa ratio (~3.8:1); longer half-life than UFH; monitored via anti-Xa levels in renal failure or pregnancy.'
  },
  dalteparin: {
    metabolism: 'Minor hepatic desulfation and primary renal elimination.',
    metabolismLocation: 'Renal excretion.',
    bbbCrossing: 'Does NOT cross BBB or placenta.',
    bbbCnsEffects: 'None.',
    pregnancyRisk: 'safe',
    pregnancyCategory: 'Category B',
    pregnancySummary: 'Safe in pregnancy: does not cross placenta. Used for gestational DVT/PE treatment and prophylaxis.',
    clinicalPearls: 'LMWH with anti-Xa:anti-IIa ratio ~2.7:1; predictable bioavailability after subcutaneous injection.'
  },
  fondaparinux: {
    metabolism: 'Negligible metabolism; excreted almost entirely unchanged in urine.',
    metabolismLocation: 'Renal excretion (>75% unchanged).',
    bbbCrossing: 'Negligible BBB penetration; minimal placental transfer.',
    bbbCnsEffects: 'None.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category B',
    pregnancySummary: 'Alternative for pregnant patients with confirmed Heparin-Induced Thrombocytopenia (HIT). Lacks large-scale pregnancy safety trials.',
    clinicalPearls: 'Synthetic sulfated pentasaccharide mimicking the exact antithrombin-binding domain of heparin; selective Factor Xa indirect inhibitor.'
  },
  dabigatran: {
    metabolism: 'Double prodrug (dabigatran etexilate) hydrolyzed by ubiquitous esterases (CES1) to active dabigatran; glucuronidated to active conjugates.',
    metabolismLocation: 'Enterocyte and hepatic esterase cleavage (~80% cleared renally).',
    bbbCrossing: 'Very low BBB penetration; P-glycoprotein substrate.',
    bbbCnsEffects: 'None; does not cause CNS sedation.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'DOACs cross the placenta and may cause fetal anticoagulation and pregnancy loss. Avoid; switch to LMWH/UFH.',
    clinicalPearls: 'Direct thrombin (Factor IIa) inhibitor; specific antidote is Idarucizumab (Praxbind); capsules must be swallowed whole.'
  },
  rivaroxaban: {
    metabolism: 'Hepatic metabolism via CYP3A4, CYP2J2 and CYP-independent amide hydrolysis; ~36% excreted unchanged in urine.',
    metabolismLocation: 'Liver and kidney; P-gp and BCRP transport substrate.',
    bbbCrossing: 'Low BBB penetration.',
    bbbCnsEffects: 'None directly.',
    pregnancyRisk: 'contraindicated',
    pregnancyCategory: 'Category C (Avoid in Pregnancy)',
    pregnancySummary: 'Crosses placenta; animal data show post-implantation pregnancy loss, bleeding, and fetal malformations. Discontinue before conception; use LMWH.',
    clinicalPearls: 'Direct Factor Xa inhibitor containing an oxazolidinone core; oral bioavailability increased with food (15/20 mg doses).'
  },
  apixaban: {
    metabolism: 'Metabolized via CYP3A4 (major), CYP1A2, CYP2C8, CYP2C9, CYP2C19; ~27% excreted unchanged renally; biliary/fecal excretion ~50%.',
    metabolismLocation: 'Hepatic O-demethylation and hydroxylation.',
    bbbCrossing: 'Low BBB crossing; P-gp substrate.',
    bbbCnsEffects: 'None.',
    pregnancyRisk: 'contraindicated',
    pregnancyCategory: 'Category B/C (Avoid in Pregnancy)',
    pregnancySummary: 'Readily crosses the placenta; high risk of maternal and fetal hemorrhage. Contraindicated in pregnancy and breastfeeding.',
    clinicalPearls: 'Direct Factor Xa inhibitor; lowest renal elimination fraction (~27%) among oral Factor Xa inhibitors; reversed with Andexanet alfa.'
  },
  edoxaban: {
    metabolism: 'Minimal CYP3A4 metabolism (<10%); cleared primarily renally (~50%) and via biliary elimination.',
    metabolismLocation: 'Renal and hepatic; substrate of P-gp.',
    bbbCrossing: 'Low BBB penetration.',
    bbbCnsEffects: 'None.',
    pregnancyRisk: 'contraindicated',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Crosses placenta; associated with embryofetal toxicity. Avoid throughout gestation.',
    clinicalPearls: 'Direct Factor Xa inhibitor; contraindicated if creatinine clearance exceeds 95 mL/min due to rapid renal elimination causing reduced efficacy.'
  },
  betrixaban: {
    metabolism: 'Minimal CYP metabolism (<1%); hydrolysis to inactive metabolites and primary biliary/fecal excretion (~85%).',
    metabolismLocation: 'Hepatobiliary excretion.',
    bbbCrossing: 'Negligible BBB crossing.',
    bbbCnsEffects: 'None.',
    pregnancyRisk: 'contraindicated',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Crosses placenta; embryofetal toxicity observed at maternal toxic doses. Avoid in pregnancy.',
    clinicalPearls: 'Direct Factor Xa inhibitor with lowest renal clearance (~11%) and long terminal half-life (~20h).'
  },
  argatroban: {
    metabolism: 'Hepatic hydroxylation and aromatization by CYP3A4/5 to 4 metabolites; biliary excretion.',
    metabolismLocation: 'Hepatic metabolism (safe in renal failure).',
    bbbCrossing: 'Low BBB penetration.',
    bbbCnsEffects: 'None.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category B',
    pregnancySummary: 'Direct thrombin inhibitor used for HIT during pregnancy when heparin and LMWH are contraindicated.',
    clinicalPearls: 'L-Arginine peptidomimetic direct thrombin inhibitor; drug of choice for HIT with renal impairment (falsely elevates INR).'
  },
  bivalirudin: {
    metabolism: 'Combination of plasma and tissue proteolytic cleavage (80%) and renal elimination (20%).',
    metabolismLocation: 'Enzymatic peptide cleavage in circulation.',
    bbbCrossing: 'Negligible BBB crossing.',
    bbbCnsEffects: 'None.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category B',
    pregnancySummary: 'Synthetic 20-amino acid hirudin peptide; use limited to acute PCI or periprocedural HIT in pregnancy.',
    clinicalPearls: 'Reversible direct thrombin inhibitor; thrombin slowly cleaves the bivalirudin Pro-Arg peptide bond restoring thrombin activity.'
  },
  alteplase: {
    metabolism: 'Rapid hepatic clearance by reticuloendothelial uptake; initial plasma half-life <5 minutes.',
    metabolismLocation: 'Liver (parenchymal cells).',
    bbbCrossing: 'Negligible intact BBB crossing; crosses when BBB is disrupted by acute ischemic stroke.',
    bbbCnsEffects: 'Symptomatic intracerebral hemorrhage (ICH) in ~6% of stroke patients.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Large enzyme (59 kDa); does not cross placenta in significant amounts. May be used for life-threatening maternal massive pulmonary embolism.',
    clinicalPearls: 'Recombinant human t-PA; converts plasminogen to plasmin with high fibrin selectivity.'
  },
  streptokinase: {
    metabolism: 'Hepatic degradation and circulating antibody neutralization; half-life ~20-80 minutes.',
    metabolismLocation: 'Plasma immune complex clearance and liver.',
    bbbCrossing: 'Does not cross intact BBB.',
    bbbCnsEffects: 'Intracerebral hemorrhage risk.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Non-enzymatic bacterial protein; antigenic. Rarely used; risk of maternal anaphylaxis and placental abruption.',
    clinicalPearls: 'Forms 1:1 complex with plasminogen exposing catalytic site; non-fibrin-specific, causing systemic lytic state.'
  },

  // ==========================================
  // MODULE 10: HEART FAILURE DRUGS
  // ==========================================
  lisinopril: {
    metabolism: 'Active drug (NOT a prodrug). Cleared completely unchanged by renal elimination; no hepatic metabolism.',
    metabolismLocation: 'Renal clearance exclusively.',
    bbbCrossing: 'Very low BBB penetration (hydrophilic zwitterion with lysine residue).',
    bbbCnsEffects: 'Rare dizziness or lightheadedness secondary to peripheral vasodilation.',
    pregnancyRisk: 'contraindicated',
    pregnancyCategory: 'Category D (Black Box Warning)',
    pregnancySummary: 'Contraindicated in pregnancy: causes oligohydramnios, fetal renal dysgenesis, skull hypoplasia, pulmonary hypoplasia, and fetal death. Discontinue immediately upon pregnancy confirmation.',
    clinicalPearls: 'Dicarboxylate ACE inhibitor containing a basic L-lysine side chain; active diacid without esterification.'
  },
  enalapril: {
    metabolism: 'Prodrug monoethyl ester rapidly bioactivated by hepatic esterases (carboxylesterase 1) to active diacid enalaprilat.',
    metabolismLocation: 'Hepatic esterase bioactivation.',
    bbbCrossing: 'Low BBB penetration; enalaprilat is highly polar.',
    bbbCnsEffects: 'Fatigue, dizziness.',
    pregnancyRisk: 'contraindicated',
    pregnancyCategory: 'Category D (Black Box Warning)',
    pregnancySummary: 'Contraindicated in pregnancy: severe fetopathy, renal failure, oligohydramnios, and neonatal hypotension. Black box warning for all trimesters.',
    clinicalPearls: 'Ethyl ester increases lipophilicity for oral bioavailability (~60%); active diacid enalaprilat inhibits ACE.'
  },
  captopril: {
    metabolism: 'Oxidation to inactive captopril-cysteine mixed disulfides and captopril dimer; ~50% excreted unchanged renally.',
    metabolismLocation: 'Liver and systemic sulfhydryl oxidation.',
    bbbCrossing: 'Very low BBB crossing.',
    bbbCnsEffects: 'Dizziness, headache.',
    pregnancyRisk: 'contraindicated',
    pregnancyCategory: 'Category D (Black Box Warning)',
    pregnancySummary: 'Contraindicated in pregnancy: severe fetal toxicity, renal agenesis, and fetal death.',
    clinicalPearls: 'First oral ACE inhibitor; contains sulfhydryl (-SH) group responsible for metallic taste and skin rash; short half-life requiring TID dosing.'
  },
  ramipril: {
    metabolism: 'Prodrug ester converted by hepatic esterases to active diacid ramiprilat; glucuronidated and renally cleared.',
    metabolismLocation: 'Hepatic bioactivation.',
    bbbCrossing: 'Low BBB penetration.',
    bbbCnsEffects: 'Dizziness, headache.',
    pregnancyRisk: 'contraindicated',
    pregnancyCategory: 'Category D (Black Box Warning)',
    pregnancySummary: 'Black box warning: fetal toxicity, renal hypoplasia, oligohydramnios, and intrauterine growth restriction.',
    clinicalPearls: 'High lipophilicity with bicyclic octahydrocyclopenta[b]pyrrole core; potent tissue ACE inhibition.'
  },
  losartan: {
    metabolism: 'Hepatic oxidation by CYP2C9 and CYP3A4 of the imidazole-5-carbinol group into EXP3174, a 10-40x more potent non-competitive carboxylic acid metabolite.',
    metabolismLocation: 'Hepatic CYP2C9/3A4.',
    bbbCrossing: 'Low BBB penetration.',
    bbbCnsEffects: 'Dizziness, lightheadedness.',
    pregnancyRisk: 'contraindicated',
    pregnancyCategory: 'Category D (Black Box Warning)',
    pregnancySummary: 'Contraindicated in pregnancy: acting directly on the renin-angiotensin system causes severe fetal renal dysgenesis and death.',
    clinicalPearls: 'Prototype biphenyl tetrazole ARB; both parent and EXP3174 antagonize AT1 receptors; also has mild uricosuric action.'
  },
  valsartan: {
    metabolism: 'Minimal hepatic metabolism (~20% by CYP2C9); excreted mostly unchanged in feces (83%) and urine (13%).',
    metabolismLocation: 'Hepatobiliary excretion.',
    bbbCrossing: 'Very low BBB crossing.',
    bbbCnsEffects: 'Headache, postural dizziness.',
    pregnancyRisk: 'contraindicated',
    pregnancyCategory: 'Category D (Black Box Warning)',
    pregnancySummary: 'Black box warning: contraindicated in all stages of pregnancy due to fatal fetal renal failure and oligohydramnios.',
    clinicalPearls: 'Non-heterocyclic ARB containing an acylvaline group and biphenyl tetrazole; component of Entresto (ARNI).'
  },
  sacubitril: {
    metabolism: 'Prodrug ethyl ester bioactivated by esterases (CES1) to active neprilysin inhibitor sacubitrilat (LBQ657).',
    metabolismLocation: 'Hepatic and plasma esterase cleavage.',
    bbbCrossing: 'Very low BBB crossing.',
    bbbCnsEffects: 'Dizziness.',
    pregnancyRisk: 'contraindicated',
    pregnancyCategory: 'Category D (Black Box Warning)',
    pregnancySummary: 'Contraindicated in pregnancy due to the valsartan component causing severe fetal renal toxicity and death.',
    clinicalPearls: 'Inhibits neprilysin (neutral endopeptidase), preventing degradation of BNP, ANP, and bradykinin; combined with valsartan to prevent unopposed AT1 stimulation.'
  },
  spironolactone: {
    metabolism: 'Extensive hepatic metabolism; rapidly converted to active metabolites canrenone and 7alpha-thiomethyl-spironolactone.',
    metabolismLocation: 'Liver (first-pass clearance).',
    bbbCrossing: 'Lipophilic steroid; crosses blood-brain barrier.',
    bbbCnsEffects: 'Lethargy, drowsiness, headache, mental confusion in elderly.',
    pregnancyRisk: 'contraindicated',
    pregnancyCategory: 'Category C (Avoid)',
    pregnancySummary: 'Antiandrogenic activity: causes feminization of male fetuses (hypospadias, cryptorchidism) in animal studies. Avoid during pregnancy.',
    clinicalPearls: 'Non-selective mineralocorticoid receptor antagonist; causes gynecomastia and erectile dysfunction due to cross-reactivity with androgen and progesterone receptors.'
  },
  eplerenone: {
    metabolism: 'Extensive hepatic metabolism primarily via CYP3A4 to inactive metabolites; no active metabolites formed.',
    metabolismLocation: 'Hepatic CYP3A4.',
    bbbCrossing: 'Moderate BBB penetration.',
    bbbCnsEffects: 'Dizziness, fatigue.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category B',
    pregnancySummary: 'No teratogenicity observed in animal studies, but human safety data are sparse. Preferred over spironolactone if MRA essential.',
    clinicalPearls: 'Selective MRA with 9,11-epoxy bridge; 40x lower affinity for androgen receptors, avoiding gynecomastia.'
  },
  metoprolol: {
    metabolism: 'Extensive hepatic metabolism primarily via polymorphic CYP2D6 (~80%) to inactive alpha-hydroxy and O-demethylated metabolites.',
    metabolismLocation: 'Hepatic CYP2D6.',
    bbbCrossing: 'Moderate lipophilicity; readily crosses blood-brain barrier.',
    bbbCnsEffects: 'Fatigue, vivid dreams/nightmares, insomnia, depression, dizziness.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Crosses placenta; risk of intrauterine growth restriction (IUGR), fetal bradycardia, and neonatal hypoglycemia. Labetalol preferred in pregnancy.',
    clinicalPearls: 'Cardioselective beta-1 antagonist; succinate is once-daily extended release for HFrEF; tartrate is twice-daily for hypertension.'
  },
  carvedilol: {
    metabolism: 'Stereoselective hepatic metabolism via CYP2D6, CYP2C9, and glucuronidation; high first-pass effect (oral bioavailability ~25-35%).',
    metabolismLocation: 'Liver.',
    bbbCrossing: 'Lipophilic carbazole core; crosses BBB.',
    bbbCnsEffects: 'Dizziness, fatigue, asthenia.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Crosses placenta; associated with fetal growth restriction and neonatal bradycardia. Monitor fetal growth.',
    clinicalPearls: 'Non-selective beta-blocker with alpha-1 adrenergic blocking vasodilation and antioxidant carbazole moiety; mortality reduction in HFrEF.'
  },
  bisoprolol: {
    metabolism: 'Balanced elimination: 50% hepatic metabolism via CYP3A4 and 50% excreted unchanged by kidneys.',
    metabolismLocation: 'Dual hepatic and renal clearance.',
    bbbCrossing: 'Low-to-moderate lipophilicity; lower CNS penetration than propranolol/metoprolol.',
    bbbCnsEffects: 'Mild fatigue, dizziness.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Potential for fetal bradycardia and growth restriction. Use only if clinical benefit justifies risk.',
    clinicalPearls: 'Highly cardioselective beta-1 antagonist; balanced clearance simplifies dosing in mild-to-moderate renal or hepatic dysfunction.'
  },
  digoxin: {
    metabolism: 'Minor hepatic metabolism (~10-15%); excreted primarily unchanged (>70%) by renal filtration and tubular secretion via P-glycoprotein.',
    metabolismLocation: 'Renal excretion (P-gp substrate).',
    bbbCrossing: 'Crosses BBB; accumulates in CNS.',
    bbbCnsEffects: 'Digitalis toxicity: yellow-green xanthopsia, halos around lights, confusion, delirium, nausea, vomiting.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Crosses placenta freely; historically used for fetal supraventricular tachycardia with maternal monitoring. Narrow therapeutic index (0.5-0.9 ng/mL for HF).',
    clinicalPearls: 'Inhibits myocardial Na+/K+-ATPase, elevating intracellular Na+ and indirectly increasing Ca2+ via Na+/Ca2+ exchanger (positive inotrope).'
  },
  ivabradine: {
    metabolism: 'Extensive hepatic oxidation primarily by CYP3A4 to active N-demethylated metabolite S-18982.',
    metabolismLocation: 'Hepatic CYP3A4.',
    bbbCrossing: 'Low BBB penetration.',
    bbbCnsEffects: 'Phosphenes (transient luminous visual phenomena due to retinal hyperpolarization-activated channels, ~3%).',
    pregnancyRisk: 'contraindicated',
    pregnancyCategory: 'Contraindicated (Teratogenic)',
    pregnancySummary: 'Contraindicated in pregnancy: animal studies demonstrated embryo-fetal toxicity, cardiac septal defects, and phocomelia.',
    clinicalPearls: 'Selectively blocks SA node hyperpolarization-activated cyclic nucleotide-gated (HCN) funny current (If); slows heart rate without inotropic reduction.'
  },
  furosemide: {
    metabolism: 'Minimal hepatic glucuronidation (~10-15%); ~65% excreted unchanged in urine via active organic acid secretion in proximal tubule.',
    metabolismLocation: 'Renal tubular secretion.',
    bbbCrossing: 'Very low BBB crossing.',
    bbbCnsEffects: 'Tinnitus, vertigo, ototoxicity (especially with rapid IV bolus or concomitant aminoglycosides).',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Crosses placenta; decreases maternal plasma volume and placental perfusion. Reserved for severe maternal pulmonary edema.',
    clinicalPearls: 'Inhibits Na+/K+/2Cl- symporter in the thick ascending limb of Henle; high-ceiling loop diuretic.'
  },
  torsemide: {
    metabolism: 'Hepatic metabolism via CYP2C9 (~80%) to inactive metabolites; only ~20% excreted unchanged renally.',
    metabolismLocation: 'Liver (CYP2C9).',
    bbbCrossing: 'Low BBB penetration.',
    bbbCnsEffects: 'Dizziness, headache.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category B',
    pregnancySummary: 'Animal studies show no teratogenicity, but potential maternal hypovolemia. Use with close monitoring.',
    clinicalPearls: 'Sulfonylurea loop diuretic with longer half-life (~3.5h) and more predictable oral bioavailability (~80%) than furosemide.'
  },
  bumetanide: {
    metabolism: 'Hepatic oxidation of the butyl side chain (~50%) and renal excretion (~50%).',
    metabolismLocation: 'Dual hepatic and renal elimination.',
    bbbCrossing: 'Low BBB crossing.',
    bbbCnsEffects: 'Dizziness, headache.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Potential for maternal dehydration and electrolyte disturbances; avoid unless maternal heart failure decompensates.',
    clinicalPearls: '40x more potent than furosemide (1 mg bumetanide = 40 mg furosemide); lower incidence of ototoxicity.'
  },
  hydralazine: {
    metabolism: 'Polymorphic hepatic acetylation via N-acetyltransferase 2 (NAT2) and hydroxylation.',
    metabolismLocation: 'Liver (NAT2).',
    bbbCrossing: 'Moderate BBB crossing.',
    bbbCnsEffects: 'Headache (~30%), dizziness, anxiety.',
    pregnancyRisk: 'safe',
    pregnancyCategory: 'Category C (First-Line in Severe Gestational HTN)',
    pregnancySummary: 'First-line agent for acute severe hypertension and preeclampsia in pregnancy. Long clinical safety record.',
    clinicalPearls: 'Direct arteriolar vasodilator; slow acetylators have higher plasma levels and elevated risk of drug-induced lupus erythematosus (DILE).'
  },
  isosorbidedinitrate: {
    metabolism: 'Rapid first-pass hepatic denitration to active 2-mononitrate and 5-mononitrate (ISMN); oral bioavailability only ~20%.',
    metabolismLocation: 'Hepatic glutathione-dependent organic nitrate reductase.',
    bbbCrossing: 'Lipophilic; readily crosses blood-brain barrier.',
    bbbCnsEffects: 'Severe throbbing headache, lightheadedness, syncope.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Potential maternal hypotension and reflex tachycardia reducing uteroplacental blood flow. Use with caution.',
    clinicalPearls: 'Organic nitrate prodrug releasing nitric oxide (NO), stimulating guanylate cyclase to dilate venous capacitance vessels (pre-load reduction).'
  },
  dapagliflozin: {
    metabolism: 'Hepatic glucuronidation primarily by UGT1A9 to inactive dapagliflozin 3-O-glucuronide; minimal CYP metabolism.',
    metabolismLocation: 'Liver (UGT1A9).',
    bbbCrossing: 'Low BBB crossing.',
    bbbCnsEffects: 'None prominent.',
    pregnancyRisk: 'contraindicated',
    pregnancyCategory: 'Avoid (2nd & 3rd Trimester)',
    pregnancySummary: 'Contraindicated during 2nd and 3rd trimesters: animal studies demonstrated adverse renal pelvic and tubule dilatation in developing fetuses.',
    clinicalPearls: 'C-aryl glucoside SGLT2 inhibitor; promotes glucosuria and osmotic diuresis; proven mortality and hospitalization reduction in HFrEF.'
  },
  empagliflozin: {
    metabolism: 'Glucuronidation via UGT2B7, UGT1A3, UGT1A8, UGT1A9 to inactive metabolites.',
    metabolismLocation: 'Hepatic glucuronidation.',
    bbbCrossing: 'Low BBB penetration.',
    bbbCnsEffects: 'None.',
    pregnancyRisk: 'contraindicated',
    pregnancyCategory: 'Avoid (2nd & 3rd Trimester)',
    pregnancySummary: 'Contraindicated in 2nd and 3rd trimesters: causes fetal renal toxicity and hydronephrosis in animal studies.',
    clinicalPearls: 'Highly selective SGLT2 inhibitor; improves cardiovascular outcomes and reduces HF hospitalizations.'
  },
  vericiguat: {
    metabolism: 'Glucuronidation primarily via UGT1A9 and UGT1A1 to inactive N-glucuronide.',
    metabolismLocation: 'Hepatic glucuronidation.',
    bbbCrossing: 'Low BBB crossing.',
    bbbCnsEffects: 'Dizziness, headache secondary to systemic vasodilation.',
    pregnancyRisk: 'contraindicated',
    pregnancyCategory: 'Black Box Warning: Embryo-Fetal Toxicity',
    pregnancySummary: 'Black box warning: causes severe embryo-fetal toxicity, spontaneous abortion, and anatomical malformations. Pregnancy test required before starting.',
    clinicalPearls: 'Direct soluble guanylate cyclase (sGC) stimulator; sensitizes sGC to endogenous NO and directly stimulates sGC to produce cGMP.'
  },

  // ==========================================
  // MODULE 11: ANTIARRHYTHMIC DRUGS
  // ==========================================
  quinidine: {
    metabolism: 'Extensive hepatic hydroxylation by CYP3A4 (~80%) to active 3-hydroxyquinidine; ~20% excreted unchanged renally.',
    metabolismLocation: 'Hepatic CYP3A4.',
    bbbCrossing: 'Moderate BBB crossing.',
    bbbCnsEffects: 'Cinchonism: tinnitus, high-frequency hearing loss, vertigo, blurred vision, headache, psychosis.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Crosses placenta; therapeutic levels achieved in fetus. Historical antiarrhythmic for fetal arrhythmias, but risk of maternal hypotension and thrombocytopenia.',
    clinicalPearls: 'Class Ia antiarrhythmic; potent CYP2D6 inhibitor and P-glycoprotein inhibitor (doubles digoxin levels); prolongs QTc (torsades de pointes risk).'
  },
  procainamide: {
    metabolism: 'Hepatic acetylation by N-acetyltransferase 2 (NAT2) to active N-acetylprocainamide (NAPA, Class III action); remainder renally excreted.',
    metabolismLocation: 'Hepatic NAT2 and kidney.',
    bbbCrossing: 'Crosses blood-brain barrier.',
    bbbCnsEffects: 'Depression, hallucinations, confusion, psychosis.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Crosses placenta; used for drug-refractory fetal supraventricular arrhythmias. Chronic maternal use risks drug-induced lupus erythematosus.',
    clinicalPearls: 'Class Ia agent; slow acetylators develop antinuclear antibodies (ANA) and systemic lupus-like syndrome; NAPA accumulates in renal failure.'
  },
  disopyramide: {
    metabolism: 'Hepatic mono-dealkylation by CYP3A4 to active N-monodealkyldisopyramide (potent anticholinergic metabolite); ~50% renally cleared.',
    metabolismLocation: 'Liver (CYP3A4) and kidneys.',
    bbbCrossing: 'Crosses blood-brain barrier.',
    bbbCnsEffects: 'Severe anticholinergic central symptoms: blurred vision, acute confusion, urinary retention, dry mouth.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Crosses placenta; can stimulate uterine contractions and cause premature labor due to anticholinergic/oxytocic effects. Avoid.',
    clinicalPearls: 'Class Ia agent with profound negative inotrope and anticholinergic properties; contraindicated in uncompensated heart failure, glaucoma, and BPH.'
  },
  lidocaine: {
    metabolism: 'Extensive, rapid first-pass hepatic de-ethylation by CYP1A2 and CYP3A4 to active metabolites MEGX and GX; oral bioavailability <3%.',
    metabolismLocation: 'Hepatic CYP1A2/3A4.',
    bbbCrossing: 'High lipophilicity; rapidly crosses blood-brain barrier.',
    bbbCnsEffects: 'Lidocaine toxicity: circumoral paresthesias, metallic taste, tinnitus, slurred speech, tremors, seizures, coma.',
    pregnancyRisk: 'safe',
    pregnancyCategory: 'Category B',
    pregnancySummary: 'Safe in pregnancy: extensively studied local anesthetic and antiarrhythmic. Crosses placenta; monitor fetal heart rate.',
    clinicalPearls: 'Class Ib antiarrhythmic; binds activated and inactivated fast voltage-gated Na+ channels; rapid unbinding kinetics; ineffective for atrial arrhythmias.'
  },
  mexiletine: {
    metabolism: 'Hepatic metabolism via CYP2D6 (~70%) and CYP1A2 to inactive metabolites; <10% excreted unchanged.',
    metabolismLocation: 'Hepatic CYP2D6.',
    bbbCrossing: 'High lipophilicity; readily crosses BBB.',
    bbbCnsEffects: 'Tremor, ataxia, nystagmus, dizziness, nervousness, confusion, paresthesias.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Crosses placenta; neonatal bradycardia and hypoglycemia reported. Reserved for refractory maternal ventricular arrhythmias.',
    clinicalPearls: 'Class Ib oral ether analog of lidocaine resistant to first-pass esterase hydrolysis; used for ventricular arrhythmias and neuropathic pain.'
  },
  flecainide: {
    metabolism: 'Hepatic metabolism via polymorphic CYP2D6 (~60%) and renal excretion of unchanged drug (~30%).',
    metabolismLocation: 'Dual hepatic (CYP2D6) and renal elimination.',
    bbbCrossing: 'Crosses BBB.',
    bbbCnsEffects: 'Dizziness, visual disturbances (blurred vision, halos), headache, tremor.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Crosses placenta; first-line pharmacotherapy for fetal supraventricular tachycardia (SVT) and atrial flutter with specialist monitoring.',
    clinicalPearls: 'Class Ic agent; marked slow dissociation from Na+ channels (10-30s), broadening QRS; CAST trial demonstrated increased mortality in ischemic heart disease.'
  },
  propafenone: {
    metabolism: 'Extensive, saturable hepatic metabolism by CYP2D6 (to active 5-hydroxypropafenone) and CYP3A4/CYP1A2; extensive first-pass effect.',
    metabolismLocation: 'Hepatic CYP2D6.',
    bbbCrossing: 'Crosses BBB.',
    bbbCnsEffects: 'Dizziness, taste perversion (metallic taste), blurred vision, fatigue.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Crosses placenta; limited data. Reserve for refractory maternal arrhythmias with normal structural heart.',
    clinicalPearls: 'Class Ic agent with intrinsic non-selective beta-blocking activity (structural similarity to propranolol); contraindicated in heart failure and bronchospasm.'
  },
  propranolol: {
    metabolism: 'Extensive hepatic first-pass metabolism by CYP2D6, CYP1A2, and CYP2C19 (bioavailability ~25%); active 4-hydroxypropranolol formed.',
    metabolismLocation: 'Hepatic cytochrome P450.',
    bbbCrossing: 'Very high lipophilicity; penetrates BBB extensively.',
    bbbCnsEffects: 'Fatigue, depression, vivid nightmares, insomnia, hallucinations, confusion.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Crosses placenta; risk of fetal bradycardia, neonatal hypoglycemia, and intrauterine growth retardation. Labetalol is preferred.',
    clinicalPearls: 'Prototype Class II non-selective beta-1/beta-2 blocker; lipophilicity makes it useful for thyroid storm and migraine prophylaxis.'
  },
  esmolol: {
    metabolism: 'Ultra-rapid ester hydrolysis by red blood cell cytosol esterases (NOT plasma cholinesterase) to inactive acid metabolite (half-life 9 minutes).',
    metabolismLocation: 'Erythrocyte cytosolic esterases.',
    bbbCrossing: 'Very low BBB crossing.',
    bbbCnsEffects: 'Dizziness, somnolence, confusion secondary to rapid blood pressure drop.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'IV short-acting agent; can cause transient fetal bradycardia and hypotension during maternal emergency administration.',
    clinicalPearls: 'Class II cardioselective beta-1 blocker; methyl ester confers ultra-short duration (elimination half-life ~9 min).'
  },
  amiodarone: {
    metabolism: 'Extensive hepatic de-ethylation by CYP3A4 and CYP2C8 to active metabolite desethylamiodarone (DEA); terminal half-life 40-60 days.',
    metabolismLocation: 'Liver; accumulates extensively in adipose tissue, lung, liver, and cornea.',
    bbbCrossing: 'Crosses BBB; accumulates in brain tissue.',
    bbbCnsEffects: 'Tremor, ataxia, peripheral neuropathy, sleep disturbances, cognitive dysfunction.',
    pregnancyRisk: 'contraindicated',
    pregnancyCategory: 'Category D (Contraindicated in Pregnancy)',
    pregnancySummary: 'Contraindicated in pregnancy: crosses placenta and concentrates in fetal tissue; causes fetal hypothyroidism, goiter, neurodevelopmental delay, and growth retardation.',
    clinicalPearls: 'Class III multi-channel blocker (K+, Na+, Ca2+, alpha/beta); diiodinated structure mimics thyroxine causing pulmonary fibrosis, corneal microdeposits, and thyroid dysfunction.'
  },
  dronedarone: {
    metabolism: 'Extensive hepatic metabolism primarily via CYP3A4 to active N-debutyl metabolite (3-10x less potent); feces excretion ~84%.',
    metabolismLocation: 'Hepatic CYP3A4.',
    bbbCrossing: 'Moderate BBB crossing.',
    bbbCnsEffects: 'Asthenia, dizziness, headache.',
    pregnancyRisk: 'contraindicated',
    pregnancyCategory: 'Category X (Contraindicated in Pregnancy)',
    pregnancySummary: 'Category X: severe embryofetal toxicity, teratogenicity, and craniofacial/cardiac malformations. Absolutely contraindicated in pregnancy.',
    clinicalPearls: 'Non-iodinated benzofuran analog of amiodarone with methanesulfonamide moiety; less organ toxicity but contraindicated in permanent AF and HFrEF (PALLAS/ANDROMEDA trials).'
  },
  sotalol: {
    metabolism: 'Not metabolized by liver; eliminated 100% unchanged via renal glomerular filtration.',
    metabolismLocation: 'Renal excretion exclusively.',
    bbbCrossing: 'Low lipophilicity; poor BBB crossing.',
    bbbCnsEffects: 'Dizziness, fatigue, lightheadedness.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category B',
    pregnancySummary: 'Crosses placenta; safe alternative for fetal supraventricular arrhythmias and congenital heart block with maternal QTc monitoring.',
    clinicalPearls: 'Racemic mixture: d-sotalol is pure Class III (IKr blocker); l-sotalol is Class III + non-selective beta-blocker; reverse use-dependence increases Torsades risk at slow heart rates.'
  },
  dofetilide: {
    metabolism: 'Hepatic metabolism via CYP3A4 (~20%); ~80% excreted unchanged by kidneys via active tubular secretion (OCT2).',
    metabolismLocation: 'Renal excretion and hepatic CYP3A4.',
    bbbCrossing: 'Low BBB crossing.',
    bbbCnsEffects: 'Headache, dizziness.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Teratogenic in animals (skeletal anomalies, ventricular septal defects). Avoid in pregnancy.',
    clinicalPearls: 'Pure Class III selective IKr blocker; dose strictly adjusted by creatinine clearance and QTc; contraindicated with verapamil, cimetidine, and hydrochlorothiazide.'
  },
  ibutilide: {
    metabolism: 'Extensive hepatic oxidation to 8 metabolites; cleared by liver with terminal half-life ~6 hours.',
    metabolismLocation: 'Hepatic oxidative metabolism.',
    bbbCrossing: 'Moderate BBB crossing.',
    bbbCnsEffects: 'Headache, dizziness.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Intravenous conversion agent; embryocidal in animals. Emergency use only for acute maternal atrial flutter/fibrillation termination.',
    clinicalPearls: 'Class III agent; activates slow inward Na+ current (INa-slow) in addition to blocking IKr; ~4-8% risk of sustained polymorphic VT/torsades.'
  },
  verapamil: {
    metabolism: 'Extensive first-pass hepatic N-dealkylation by CYP3A4 to active norverapamil (~20% potency); oral bioavailability ~20-35%.',
    metabolismLocation: 'Hepatic CYP3A4.',
    bbbCrossing: 'Crosses BBB.',
    bbbCnsEffects: 'Headache, dizziness, fatigue.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Crosses placenta; used for maternal supraventricular tachycardia and fetal arrhythmias. Monitor maternal blood pressure and fetal heart rate.',
    clinicalPearls: 'Class IV non-dihydropyridine calcium channel blocker (phenylalkylamine); negative inotrope and dromotrope; causes constipation and elevates digoxin levels.'
  },
  diltiazem: {
    metabolism: 'Extensive hepatic deacetylation by CYP3A4 and esterases to active desacetyldiltiazem (25-50% potency); oral bioavailability ~40%.',
    metabolismLocation: 'Hepatic CYP3A4.',
    bbbCrossing: 'Crosses blood-brain barrier.',
    bbbCnsEffects: 'Dizziness, headache, asthenia.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C',
    pregnancySummary: 'Skeletal and cardiac malformations observed in animal models. Use only if other safer antiarrhythmics (adenosine, verapamil) fail.',
    clinicalPearls: 'Class IV non-dihydropyridine CCB (benzothiazepine); slows AV nodal conduction; moderate vasodilator and CYP3A4 inhibitor.'
  },
  adenosine: {
    metabolism: 'Ultra-rapid deamination by adenosine deaminase in erythrocytes and vascular endothelial cells (plasma half-life <10 seconds).',
    metabolismLocation: 'Intravascular enzymatic deamination to inosine.',
    bbbCrossing: 'Does not cross intact BBB.',
    bbbCnsEffects: 'Apprehension, lightheadedness, impending doom, flushing, chest tightness.',
    pregnancyRisk: 'safe',
    pregnancyCategory: 'Category C (First-Line for Acute Paroxysmal SVT)',
    pregnancySummary: 'Drug of choice for acute conversion of paroxysmal supraventricular tachycardia (PSVT) in pregnancy. Ultra-short half-life (<10 sec) prevents fetal transfer.',
    clinicalPearls: 'Activates A1 purinergic receptors in AV node, opening G-protein-coupled inward rectifying K+ channels (IK-ACh) causing transient AV block.'
  }
};

/**
 * Common trade names, acronyms, and aliases mapped to dictionary keys.
 */
const DRUG_ALIAS_MAP: Record<string, string> = {
  plavix: 'clopidogrel',
  coumadin: 'warfarin',
  lovenox: 'enoxaparin',
  pradaxa: 'dabigatran',
  xarelto: 'rivaroxaban',
  eliquis: 'apixaban',
  savaysa: 'edoxaban',
  bevyxxa: 'betrixaban',
  fragmin: 'dalteparin',
  arixtra: 'fondaparinux',
  angimax: 'bivalirudin',
  acova: 'argatroban',
  activase: 'alteplase',
  effient: 'prasugrel',
  brilinta: 'ticagrelor',
  kengreal: 'cangrelor',
  zontivity: 'vorapaxar',
  integrilin: 'eptifibatide',
  aggrastat: 'tirofiban',
  persantine: 'dipyridamole',
  pletal: 'cilostazol',
  reopro: 'abciximab',
  zestril: 'lisinopril',
  prinivil: 'lisinopril',
  vasotec: 'enalapril',
  capoten: 'captopril',
  altace: 'ramipril',
  cozaar: 'losartan',
  diovan: 'valsartan',
  entresto: 'sacubitril',
  aldactone: 'spironolactone',
  inspra: 'eplerenone',
  lopressor: 'metoprolol',
  toprol: 'metoprolol',
  toprolxl: 'metoprolol',
  coreg: 'carvedilol',
  zebeta: 'bisoprolol',
  lanoxin: 'digoxin',
  corlanor: 'ivabradine',
  lasix: 'furosemide',
  demadex: 'torsemide',
  bumex: 'bumetanide',
  apresoline: 'hydralazine',
  isordil: 'isosorbidedinitrate',
  farxiga: 'dapagliflozin',
  jardiance: 'empagliflozin',
  verquvo: 'vericiguat',
  xylocaine: 'lidocaine',
  mexitil: 'mexiletine',
  tambocor: 'flecainide',
  rythmol: 'propafenone',
  inderal: 'propranolol',
  brevibloc: 'esmolol',
  cordarone: 'amiodarone',
  pacerone: 'amiodarone',
  multaq: 'dronedarone',
  betapace: 'sotalol',
  tikosyn: 'dofetilide',
  corvert: 'ibutilide',
  calan: 'verapamil',
  isoptin: 'verapamil',
  cardizem: 'diltiazem',
  adenocard: 'adenosine',
  ufh: 'heparin',
  lmwh: 'enoxaparin'
};

/**
 * Normalizes input name for consistent key matching.
 */
function normalizeName(input?: string | null): string {
  if (!input) return '';
  return input
    .replace(/\(.*?\)/g, '') // remove parenthesized content like (Coumadin) or (Plavix)
    .replace(/\[.*?\]/g, '') // remove bracketed content
    .replace(/drug\s+[ivxLCDM]+/gi, '') // remove "Drug II", "Drug IV", etc.
    .replace(/[^a-zA-Z0-9]/g, '') // keep alphanumeric
    .toLowerCase()
    .trim();
}

/**
 * Resolves a clinical pharmacology profile for any given chemical structure.
 * Guaranteed to return an informative profile without throwing exceptions or showing undefined.
 */
export function resolveClinicalPharmacology(
  structure: Partial<ChemicalStructure> | null | undefined
): ClinicalPharmacologyProfile {
  if (!structure) {
    return generateFallbackProfile('Unknown Drug', undefined);
  }

  // 1. Try generic name
  const normName = normalizeName(structure.name);
  if (normName && CLINICAL_PHARMACOLOGY_DICTIONARY[normName]) {
    return CLINICAL_PHARMACOLOGY_DICTIONARY[normName];
  }

  // 2. Check alias map for generic name
  if (normName && DRUG_ALIAS_MAP[normName] && CLINICAL_PHARMACOLOGY_DICTIONARY[DRUG_ALIAS_MAP[normName]]) {
    return CLINICAL_PHARMACOLOGY_DICTIONARY[DRUG_ALIAS_MAP[normName]];
  }

  // 3. Try trade name
  const normTrade = normalizeName(structure.tradeName);
  if (normTrade && CLINICAL_PHARMACOLOGY_DICTIONARY[normTrade]) {
    return CLINICAL_PHARMACOLOGY_DICTIONARY[normTrade];
  }
  if (normTrade && DRUG_ALIAS_MAP[normTrade] && CLINICAL_PHARMACOLOGY_DICTIONARY[DRUG_ALIAS_MAP[normTrade]]) {
    return CLINICAL_PHARMACOLOGY_DICTIONARY[DRUG_ALIAS_MAP[normTrade]];
  }

  // 4. Try matching substrings in dictionary keys
  const rawCombined = `${structure.name || ''} ${structure.tradeName || ''}`.toLowerCase();
  for (const [key, profile] of Object.entries(CLINICAL_PHARMACOLOGY_DICTIONARY)) {
    if (rawCombined.includes(key)) {
      return profile;
    }
  }

  // 5. Generate safe fallback profile
  return generateFallbackProfile(structure.name || 'Agent', structure);
}

/**
 * Generates an informative fallback profile based on available structure properties.
 */
function generateFallbackProfile(
  drugName: string,
  structure?: Partial<ChemicalStructure>
): ClinicalPharmacologyProfile {
  const chemClass = structure?.chemicalClass || 'Small molecule therapeutic agent';
  const target = structure?.target || 'Cardiovascular receptor/enzyme';
  const pharmClass = structure?.pharmacologicalClass || 'Cardiovascular agent';

  return {
    metabolism: `Hepatic biotransformation and/or renal clearance typical of ${chemClass}. Specific CYP isoenzyme clearance data pending clinical monograph audit.`,
    metabolismLocation: 'Hepatic microsomal oxidation and renal excretion.',
    bbbCrossing: 'Moderate blood-brain barrier penetration dependent on lipophilicity and molecular weight.',
    bbbCnsEffects: 'Monitor for mild peripheral or central hemodynamic effects.',
    pregnancyRisk: 'caution',
    pregnancyCategory: 'Category C (Consult Specialist)',
    pregnancySummary: `Clinical safety data for ${drugName} (${pharmClass}) during gestation is not fully established. Exercise clinical caution; evaluate maternal benefit versus potential fetal risk.`,
    clinicalPearls: `Target: ${target}. Chemical class: ${chemClass}.`
  };
}
