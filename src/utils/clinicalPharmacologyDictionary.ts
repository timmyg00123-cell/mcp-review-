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
  },

  // ==========================================
  // EXAM 2: ANTIHYPERTENSIVES & ANTIHYPERLIPIDEMICS
  // ==========================================
  chlorothiazide: {
    metabolism: "Not significantly metabolized; excreted primarily unchanged in the urine via glomerular filtration and organic acid secretory transporter (OAT1/3).",
    metabolismLocation: "Renal excretion (>95% unchanged).",
    bbbCrossing: "Low BBB penetration; highly polar sulfonamide and benzothiadiazine core.",
    bbbCnsEffects: "Headache, dizziness, paresthesias reported rarely; mainly secondary to volume contraction.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Crosses placenta; may decrease uteroplacental perfusion by contracting plasma volume. Avoid routine use in gestational hypertension unless treating pulmonary edema or heart failure.",
    clinicalPearls: "Prototype thiazide; oral bioavailability only ~10-20% due to low lipophilicity (available IV as sodium salt); weak carbonic anhydrase inhibitory activity."
  },
  hydrochlorothiazide: {
    metabolism: "Essentially not metabolized; excreted >95% unchanged in urine by renal filtration and active tubular secretion.",
    metabolismLocation: "Renal excretion; half-life 6-12 hours.",
    bbbCrossing: "Low BBB penetration (polar zwitterionic/acidic character).",
    bbbCnsEffects: "Mild dizziness, fatigue, vertigo associated with orthostasis and electrolyte shifts.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category B",
    pregnancySummary: "Crosses placental barrier. Can cause neonatal thrombocytopenia, jaundice, and electrolyte disturbances. Not first-line for gestational hypertension.",
    clinicalPearls: "Saturated 3,4-dihydro bond increases potency 10-fold over chlorothiazide. Competes for organic acid transporter with uric acid (hyperuricemia/gout precipitation)."
  },
  trichlormethiazide: {
    metabolism: "Minimal hepatic metabolism; primarily eliminated unchanged in the urine.",
    metabolismLocation: "Renal clearance.",
    bbbCrossing: "Low to moderate BBB penetration; 3-dichloromethyl substitution enhances lipophilicity.",
    bbbCnsEffects: "Dizziness, headache.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Avoid during gestation unless maternal cardiac decompensation mandates diuresis.",
    clinicalPearls: "Lipophilic 3-dichloromethyl group increases potency ~100-fold compared to chlorothiazide; prolonged duration of action (up to 24 hours)."
  },
  polythiazide: {
    metabolism: "Extensive renal excretion; prolonged retention due to high tissue/protein binding and high lipophilicity.",
    metabolismLocation: "Renal clearance; terminal half-life ~25-27 hours.",
    bbbCrossing: "Moderate BBB penetration compared to simpler thiazides due to 3-trifluoromethylthiomethyl and 2-methyl substituents.",
    bbbCnsEffects: "Occasional dizziness or drowsiness.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Long half-life increases prolonged fetal exposure; use only if strictly necessary.",
    clinicalPearls: "High lipophilicity confers extreme potency (relative potency ~1000 vs chlorothiazide) and once-daily dosing with 24-36 hour duration."
  },
  metolazone: {
    metabolism: "Minimal hepatic metabolism; ~70-80% excreted unchanged in urine.",
    metabolismLocation: "Renal clearance.",
    bbbCrossing: "Low BBB penetration; quinazoline sulfonamide.",
    bbbCnsEffects: "Dizziness, lightheadedness, fatigue.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category B",
    pregnancySummary: "Limited gestational data; potential risk of reduced placental perfusion and fetal electrolyte disturbances.",
    clinicalPearls: "Thiazide-like quinazolinone diuretic; retains efficacy at CrCl < 30 mL/min; synergistic sequential nephron blockade when combined with loop diuretics in refractory edema."
  },
  indapamide: {
    metabolism: "Extensively metabolized by hepatic CYP enzymes (primarily CYP3A4); <7% excreted unchanged in urine.",
    metabolismLocation: "Hepatic metabolism with inactive renal and biliary metabolites.",
    bbbCrossing: "Moderate BBB penetration; lipophilic indoline chlorobenzamide scaffold.",
    bbbCnsEffects: "Dizziness, headache, anxiety, fatigue.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category B",
    pregnancySummary: "Animal reproduction studies showed no teratogenicity; use with caution due to maternal plasma volume depletion.",
    clinicalPearls: "Lipophilic indoline diuretic with dual mechanism: DCT NCC blockade plus direct arteriolar vasodilation via vascular smooth muscle calcium channel modulation."
  },
  chlorthalidone: {
    metabolism: "Minimal hepatic metabolism; extensively sequestered inside erythrocytes (binds red blood cell carbonic anhydrase), slowly released and cleared renally.",
    metabolismLocation: "Erythrocyte carbonic anhydrase depot; terminal half-life 40-60 hours.",
    bbbCrossing: "Low BBB penetration; phthalimidine ring sulfonamide.",
    bbbCnsEffects: "Dizziness, vertigo, paresthesias.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category B",
    pregnancySummary: "Crosses placenta; volume contraction may compromise placental blood flow. Avoid unless clearly needed for maternal volume overload.",
    clinicalPearls: "Thiazide-like phthalimidine diuretic; superior 24-hour ambulatory blood pressure reduction compared to HCTZ in landmark trials (ALLHAT) due to RBC reservoir depot."
  },
  ethacrynicacid: {
    metabolism: "Hepatic cysteine conjugation at the alpha,beta-unsaturated ketone (Michael acceptor); ~60-70% excreted renally as parent and cysteine/mercapturic acid adducts.",
    metabolismLocation: "Hepatic glutathione/cysteine conjugation and renal excretion.",
    bbbCrossing: "Low BBB penetration; phenoxyacetic acid derivative.",
    bbbCnsEffects: "Headache, fatigue, severe ototoxicity (hearing loss, tinnitus, vertigo) especially with renal failure.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category B",
    pregnancySummary: "Safety not established in human pregnancy; potential for fetal ototoxicity and maternal hypovolemia.",
    clinicalPearls: "Lacks a sulfonamide group (safe in severe sulfa allergy); acts as Michael acceptor alkylating sulfhydryl groups on NKCC2; highest ototoxic potential among loop diuretics."
  },
  triamterene: {
    metabolism: "Extensive hepatic hydroxylation by CYP1A2 to 4-hydroxytriamterene followed by active sulfate ester conjugation (4-hydroxytriamterene sulfate).",
    metabolismLocation: "Hepatic phase I oxidation and phase II sulfation.",
    bbbCrossing: "Low BBB penetration (basic pteridine ring).",
    bbbCnsEffects: "Dizziness, fatigue, headache.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Weak folic acid antagonist; avoid in pregnancy (especially 1st trimester) due to potential neural tube defect risks.",
    clinicalPearls: "Potassium-sparing pteridine; directly blocks epithelial sodium channels (ENaC) in late DCT/collecting duct; can precipitate as renal calculi (triamterene kidney stones)."
  },
  amiloride: {
    metabolism: "Not metabolized by liver; excreted 50% unchanged in urine and 40% unchanged in feces.",
    metabolismLocation: "Renal and fecal excretion without biotransformation.",
    bbbCrossing: "Negligible BBB penetration; highly basic acylguanidine pyrazine derivative.",
    bbbCnsEffects: "Headache, dizziness, weakness.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category B",
    pregnancySummary: "Limited human pregnancy data. Risk of maternal hyperkalemia and reduced placental perfusion. Reserve for refractory hypokalemia.",
    clinicalPearls: "Pyrazinoylguanidine ENaC blocker; protonated positively charged guanidine competes directly with Na+ for the outer vestibule of luminal ENaC."
  },
  canrenone: {
    metabolism: "Major active metabolite of spironolactone; undergoes renal elimination and glucuronide conjugation.",
    metabolismLocation: "Hepatic conjugation and renal excretion.",
    bbbCrossing: "Lipophilic steroid; penetrates BBB.",
    bbbCnsEffects: "Drowsiness, lethargy, headache.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Steroid antagonist with antiandrogenic actions; potential risk of feminization of male fetuses. Avoid in pregnancy.",
    clinicalPearls: "Active delta-6,7 lactone metabolite of spironolactone; possesses mineralocorticoid receptor antagonist efficacy without the 7alpha-thioester."
  },
  acetazolamide: {
    metabolism: "Not metabolized; 90-100% excreted unchanged in urine by tubular secretion within 24 hours.",
    metabolismLocation: "Renal excretion.",
    bbbCrossing: "Moderate BBB penetration; acts on choroid plexus carbonic anhydrase.",
    bbbCnsEffects: "Paresthesias (tingling in fingers/toes), drowsiness, depression, confusion in acidosis.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Teratogenic in rodents (forelimb ectrodactyly/adactyly); contraindicated in first trimester. Use only for maternal pseudotumor cerebri or acute glaucoma if alternatives fail.",
    clinicalPearls: "Reversible carbonic anhydrase inhibitor (CAI); alkalinizes urine (HCO3- wasting) causing hyperchloremic metabolic acidosis and tolerance within 48-72 hours."
  },
  mannitol: {
    metabolism: "Not metabolized; strictly filtered at the glomerulus with zero tubular reabsorption or secretion.",
    metabolismLocation: "Renal glomerular filtration.",
    bbbCrossing: "Does not cross intact BBB; hyperosmolar agent draws free water from cerebral parenchyma into vascular space.",
    bbbCnsEffects: "Headache, confusion, dizziness; transient expansion of intravascular volume can worsen cerebral edema if BBB is disrupted.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Crosses placenta poorly; acute osmotic shifts can induce fetal distress or dehydration. Reserve for acute neurosurgical maternal emergencies.",
    clinicalPearls: "Osmotic diuretic (polyol); administered IV only; must be inspected for crystals and warmed/filtered prior to infusion."
  },
  atenolol: {
    metabolism: "Minimal hepatic metabolism (<10%); ~85-90% eliminated unchanged in urine by glomerular filtration.",
    metabolismLocation: "Renal excretion; half-life 6-7 hours (prolonged in CKD).",
    bbbCrossing: "Very low BBB penetration; hydrophilic aryloxypropanolamine with polar acetamide group.",
    bbbCnsEffects: "Significantly fewer CNS side effects (nightmares, vivid dreams, depression) compared to lipophilic beta-blockers.",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category D",
    pregnancySummary: "Associated with intrauterine growth restriction (IUGR), low birth weight, and placental hypoperfusion. Avoid in pregnancy; labetalol is preferred.",
    clinicalPearls: "Cardioselective beta-1 antagonist; polar para-acetamide confers cardioselectivity and water solubility; requires dose adjustment in renal impairment."
  },
  labetalol: {
    metabolism: "Extensive first-pass hepatic metabolism by glucuronidation; oral bioavailability ~25%. High clearance.",
    metabolismLocation: "Hepatic glucuronide conjugation (inactive).",
    bbbCrossing: "Low to moderate BBB penetration; zwitterionic/polar arylethanolamine.",
    bbbCnsEffects: "Fatigue, dizziness, scalp tingling (formication) secondary to alpha-1 blockade.",
    pregnancyRisk: "safe",
    pregnancyCategory: "Category C (First-Line in Pregnancy)",
    pregnancySummary: "First-line agent for chronic hypertension, gestational hypertension, and acute preeclampsia/eclampsia in pregnancy. Decades of reassuring safety data without IUGR risk seen with atenolol.",
    clinicalPearls: "Mixed antagonist with 2 chiral centers (4 stereoisomers): R,R-isomer (dilevalol) provides non-selective beta-blockade; S,R-isomer provides selective alpha-1 blockade; oral ratio ~3:1 beta:alpha."
  },
  pindolol: {
    metabolism: "Dual clearance: ~60% hepatic metabolism (glucuronidation, oxidation) and ~40% excreted unchanged in urine.",
    metabolismLocation: "Hepatic and renal elimination.",
    bbbCrossing: "Moderate BBB penetration; lipophilic indole core.",
    bbbCnsEffects: "Insomnia, vivid dreams, nervousness, dizziness.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category B",
    pregnancySummary: "Limited data; potential for fetal bradycardia or hypoglycemia. Labetalol remains preferred.",
    clinicalPearls: "Non-selective beta-blocker with potent Intrinsic Sympathomimetic Activity (ISA / partial agonist); produces less resting bradycardia and lipid alteration."
  },
  nadolol: {
    metabolism: "Zero hepatic metabolism; 100% eliminated unchanged in urine.",
    metabolismLocation: "Renal excretion; terminal half-life 20-24 hours.",
    bbbCrossing: "Very low BBB penetration; highly polar cis-diol tetrahydronaphthalene ring.",
    bbbCnsEffects: "Low incidence of central fatigue, vivid dreams, or depression.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Prolonged half-life leads to persistent fetal beta-blockade; risk of neonatal bradycardia and hypoglycemia.",
    clinicalPearls: "Non-selective beta-antagonist with longest elimination half-life; water-soluble; preferred for variceal bleeding prophylaxis in cirrhosis."
  },
  clonidine: {
    metabolism: "Hepatic metabolism (~50%) to inactive metabolites and renal excretion of unchanged drug (~50%).",
    metabolismLocation: "Hepatic oxidation and renal clearance; half-life 12-16 hours.",
    bbbCrossing: "High BBB penetration; lipophilic 2-aminoimidazoline with ortho-dichloro groups preventing coplanarity.",
    bbbCnsEffects: "Marked sedation, drowsiness, dry mouth (xerostomia), depression, fatigue. Life-threatening rebound hypertension upon abrupt discontinuation.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Crosses placenta; used as second- or third-line agent for refractory pregnancy hypertension. Avoid abrupt cessation due to hypertensive crisis.",
    clinicalPearls: "Centrally acting alpha-2A adrenergic receptor agonist in nucleus tractus solitarius; decreases central sympathetic outflow; ortho-chlorines force imidazoline ring perpendicular to phenyl ring."
  },
  guanfacine: {
    metabolism: "Extensive hepatic oxidation by CYP3A4 to 3-hydroxyguanfacine; ~50% excreted unchanged in urine.",
    metabolismLocation: "Hepatic CYP3A4 metabolism and renal elimination.",
    bbbCrossing: "High BBB penetration; lipophilic phenylacetylguanidine.",
    bbbCnsEffects: "Sedation, somnolence, fatigue, dry mouth; less severe sedation and rebound than clonidine due to higher alpha-2A selectivity.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category B",
    pregnancySummary: "Crosses placenta; limited human pregnancy data. Generally reserved for ADHD or refractory hypertension.",
    clinicalPearls: "Selective central alpha-2A agonist; open-chain guanidine analogue; longer elimination half-life (17 hours) than clonidine."
  },
  methyldopa: {
    metabolism: "Prodrug transported into CNS by L-type amino acid transporter 1 (LAT1); decarboxylated by AADC to alpha-methyldopamine, then beta-hydroxylated by DBH to active (1R,2S)-alpha-methylnorepinephrine.",
    metabolismLocation: "Central adrenergic neurons (stereospecific bioactivation).",
    bbbCrossing: "Crosses BBB via active carrier-mediated LAT1 amino acid transport.",
    bbbCnsEffects: "Sedation, drowsiness, depression, decreased mental acuity, nightmares.",
    pregnancyRisk: "safe",
    pregnancyCategory: "Category B (Historic Gold Standard in Pregnancy)",
    pregnancySummary: "Longest safety track record for chronic and gestational hypertension in pregnancy. Does not cause fetal malformations or adverse hemodynamic shifts.",
    clinicalPearls: "False neurotransmitter prodrug; active metabolite (1R,2S)-alpha-methylnorepinephrine is a selective alpha-2 agonist; risk of Coombs-positive hemolytic anemia and drug-induced hepatitis."
  },
  alphamethylnorepinephrine: {
    metabolism: "Metabolized by COMT and MAO in neuronal and peripheral tissues.",
    metabolismLocation: "Adrenergic synapse.",
    bbbCrossing: "Generated directly inside central adrenergic nerve terminals from methyldopa.",
    bbbCnsEffects: "Mediates central alpha-2 sympathetic suppression; sedation, dry mouth.",
    pregnancyRisk: "safe",
    pregnancyCategory: "Category B",
    pregnancySummary: "Active therapeutic metabolite of methyldopa; safe profile established via parent drug.",
    clinicalPearls: "Active form of methyldopa; stereochemistry must be (1R,2S) to bind and stimulate central alpha-2 adrenergic receptors."
  },
  prazosin: {
    metabolism: "Extensive hepatic metabolism by demethylation and glucuronidation; oral bioavailability ~60%; <10% excreted unchanged renally.",
    metabolismLocation: "Hepatic microsomal metabolism; half-life 2-3 hours.",
    bbbCrossing: "Moderate BBB penetration; lipophilic quinazoline derivative.",
    bbbCnsEffects: "Dizziness, drowsiness, headache; severe syncope with first dose (\"first-dose phenomenon\").",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Crosses placenta; limited data. Used occasionally for refractory preeclampsia or pheochromocytoma in pregnancy.",
    clinicalPearls: "Selective alpha-1 adrenergic antagonist; quinazoline piperazine core; causes balanced arterial and venous dilation without reflex tachycardia (preserves presynaptic alpha-2 negative feedback)."
  },
  terazosin: {
    metabolism: "Extensive hepatic metabolism; biliary and fecal excretion (~60%) and renal excretion (~40%).",
    metabolismLocation: "Hepatic metabolism; half-life 12 hours.",
    bbbCrossing: "Moderate BBB penetration.",
    bbbCnsEffects: "Dizziness, asthenia, somnolence, postural hypotension.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Not recommended during pregnancy due to lack of adequate human studies; use labetalol or nifedipine instead.",
    clinicalPearls: "Tetrahydrofuran ring replacement of prazosin furan ring increases water solubility and extends elimination half-life, allowing once-daily dosing for HTN and BPH."
  },
  doxazosin: {
    metabolism: "Extensively metabolized in the liver by O-demethylation and hydroxylation (CYP3A4); <5% excreted unchanged.",
    metabolismLocation: "Hepatic CYP3A4 metabolism; terminal half-life ~22 hours.",
    bbbCrossing: "Moderate BBB penetration; benzodioxan quinazoline.",
    bbbCnsEffects: "Dizziness, fatigue, headache, vertigo.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Avoid during gestation unless alternatives fail; risk of maternal hypotension and reduced placental perfusion.",
    clinicalPearls: "Benzodioxan ring replacement gives longest half-life (~22 hours) among quinazoline alpha-1 blockers; once-daily administration."
  },
  tamsulosin: {
    metabolism: "Extensive hepatic metabolism by CYP2D6 and CYP3A4; <10% excreted unchanged in urine.",
    metabolismLocation: "Hepatic CYP2D6/CYP3A4.",
    bbbCrossing: "Low BBB penetration; sulfonamide phenethylamine.",
    bbbCnsEffects: "Dizziness, abnormal ejaculation, headache; Intraoperative Floppy Iris Syndrome (IFIS) during cataract surgery.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category B",
    pregnancySummary: "Not indicated for female use; used off-label for distal ureteral stone expulsion in pregnancy with caution.",
    clinicalPearls: "Subtype-selective alpha-1A/1D antagonist (uroselective); relaxes prostatic smooth muscle with minimal vascular alpha-1B blockade (minimal effect on systemic blood pressure)."
  },
  reserpine: {
    metabolism: "Slow hepatic metabolism by esterases and microsomal oxidation to methyl reserpate and trimethoxybenzoic acid.",
    metabolismLocation: "Hepatic and tissue esterase hydrolysis.",
    bbbCrossing: "High BBB penetration; lipophilic indole alkaloid.",
    bbbCnsEffects: "Profound, severe depression (suicidal ideation, psychosis), severe sedation, nightmares, parkinsonism, nasal congestion.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Crosses placenta; associated with neonatal lethargy, hypothermia, bradycardia, and severe nasal congestion causing respiratory distress in newborns.",
    clinicalPearls: "Irreversibly inhibits vesicular monoamine transporter 2 (VMAT2); depletes NE, dopamine, and serotonin vesicles; recovery requires de novo VMAT2 synthesis (days to weeks)."
  },
  guanethidine: {
    metabolism: "Partial hepatic metabolism to inactive ring-oxidized metabolites; excreted primarily unchanged in urine.",
    metabolismLocation: "Hepatic metabolism and renal excretion; very long half-life (~5 days).",
    bbbCrossing: "Does NOT cross BBB; highly basic, permanently protonated aliphatic guanidine ring (octahydroazocine).",
    bbbCnsEffects: "No central sedation or depression; severe orthostatic hypotension and explosive diarrhea due to peripheral sympathetic ablation and unopposed parasympathetics.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Severe maternal orthostatic hypotension and fetal hypoperfusion; contraindicated in pregnancy.",
    clinicalPearls: "Postganglionic adrenergic neuron blocker; taken up by NET (norepinephrine transporter) into peripheral nerve terminals where it displaces NE and prevents release."
  },
  nifedipine: {
    metabolism: "Extensive first-pass hepatic oxidation by CYP3A4 to inactive pyridine metabolite; oral bioavailability ~45-70%.",
    metabolismLocation: "Hepatic CYP3A4.",
    bbbCrossing: "Moderate BBB penetration; lipophilic 1,4-dihydropyridine.",
    bbbCnsEffects: "Headache, dizziness, flushing; lightheadedness from peripheral vasodilation.",
    pregnancyRisk: "safe",
    pregnancyCategory: "Category C (First-Line Oral Agent in Pregnancy)",
    pregnancySummary: "First-line oral calcium channel blocker for chronic hypertension and acute preeclampsia/gestational hypertension; also used as a tocolytic to arrest preterm labor.",
    clinicalPearls: "Prototype 1,4-dihydropyridine (DHP); selective L-type Ca2+ channel blocker in vascular smooth muscle; ortho-nitro group locks phenyl ring perpendicular to DHP boat conformation."
  },
  amlodipine: {
    metabolism: "Extensively metabolized by hepatic CYP3A4 to inactive pyridine metabolites; oral bioavailability 60-80%; very slow clearance.",
    metabolismLocation: "Hepatic CYP3A4; elimination half-life 35-50 hours.",
    bbbCrossing: "Moderate BBB penetration.",
    bbbCnsEffects: "Dizziness, fatigue, headache, peripheral edema (gravity-dependent precapillary vasodilation).",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Crosses placenta; animal studies show embryotoxicity. Nifedipine is strongly preferred in pregnancy; switch if pregnancy is planned.",
    clinicalPearls: "Basic 2-(2-aminoethoxymethyl) side chain is fully protonated at physiologic pH, providing slow receptor association/dissociation and prolonged 24-hour hemodynamic control."
  },
  nicardipine: {
    metabolism: "Rapid and extensive first-pass hepatic metabolism via CYP3A4 and CYP2C8; bioavailability ~35%.",
    metabolismLocation: "Hepatic CYP3A4; half-life 2-4 hours.",
    bbbCrossing: "High BBB penetration; tertiary benzylmethylamino side chain confers lipophilicity and cerebral vascular selectivity.",
    bbbCnsEffects: "Headache, dizziness, flushing; used IV for acute hypertensive encephalopathy and subarachnoid hemorrhage.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Intravenous nicardipine is effective for severe acute refractory preeclampsia; monitor maternal BP and fetal heart rate continuously.",
    clinicalPearls: "Asymmetric 3,5-diester DHP with tertiary amine; high selectivity for cerebral and coronary vasculature; available IV for acute hypertensive crises."
  },
  clevidipine: {
    metabolism: "Ultra-rapid ester hydrolysis by blood and tissue esterases to inactive carboxylic acid metabolite (clevidipine acid); independent of hepatic or renal function.",
    metabolismLocation: "Vascular/blood esterases (initial half-life ~1 minute).",
    bbbCrossing: "Low effective CNS accumulation due to ultra-short intravascular lifespan.",
    bbbCnsEffects: "Headache, dizziness.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Formulated in a 20% lipid emulsion; used in acute perioperative hypertensive emergencies. Safety in gestation not established.",
    clinicalPearls: "Engineered \"soft drug\" 1,4-DHP; double ester prodrug-like linkage hydrolyzes in seconds; precise titratability with rapid on/off arterial vasodilation without reflex bradycardia."
  },
  felodipine: {
    metabolism: "Complete first-pass hepatic metabolism by CYP3A4 to inactive pyridine metabolite; oral bioavailability ~15-20%.",
    metabolismLocation: "Hepatic CYP3A4; half-life 11-16 hours.",
    bbbCrossing: "Moderate BBB penetration.",
    bbbCnsEffects: "Headache, dizziness, flushing, peripheral edema.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Digital anomalies observed in animal studies; avoid during pregnancy.",
    clinicalPearls: "2,3-Dichlorophenyl substitution provides steric bulk maintaining perpendicular ring orientation and vascular selectivity."
  },
  nimodipine: {
    metabolism: "Extensive hepatic first-pass metabolism by CYP3A4; oral bioavailability ~13%.",
    metabolismLocation: "Hepatic CYP3A4.",
    bbbCrossing: "Very high BBB penetration; highly lipophilic isopropyl 2-methoxyethyl diester DHP.",
    bbbCnsEffects: "Prevents ischemic neurological deficits following subarachnoid hemorrhage (SAH) by blocking cerebral arterial vasospasm.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Teratogenic in animal models; indicated only for life-threatening maternal aneurysmal subarachnoid hemorrhage.",
    clinicalPearls: "Cerebroselective DHP CCB; 2-methoxyethyl ester group maximizes CNS penetration; specifically approved for prevention of cerebral vasospasm following SAH."
  },
  minoxidil: {
    metabolism: "Hepatic bioactivation: Sulfotransferase 1A1 (SULT1A1) transfers sulfate to N-oxide, forming active minoxidil sulfate; parent drug is inactive.",
    metabolismLocation: "Hepatic SULT1A1 sulfonation (phase II activation).",
    bbbCrossing: "Moderate BBB penetration.",
    bbbCnsEffects: "Headache, fatigue; severe hypertrichosis (hair growth stimulation via K_ATP channel opening), pericardial effusion, reflex tachycardia.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Crosses placenta; associated with fetal hypertrichosis and severe maternal/fetal hypotension. Contraindicated in pregnancy unless all other options fail.",
    clinicalPearls: "Direct K_ATP channel opener in vascular smooth muscle; requires SULT1A1 bioactivation; must be co-administered with a loop diuretic (prevent massive fluid retention) and a beta-blocker (prevent reflex tachycardia)."
  },
  minoxidilsulfate: {
    metabolism: "Eliminated primarily by renal excretion and glucuronidation.",
    metabolismLocation: "Renal excretion.",
    bbbCrossing: "Polar sulfate conjugate; limited BBB entry.",
    bbbCnsEffects: "Direct vascular relaxant; flushing, headache.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Active form of minoxidil; avoid in pregnancy.",
    clinicalPearls: "Active metabolite of minoxidil; directly opens ATP-sensitive K+ channels (K_ATP), hyperpolarizing vascular smooth muscle membranes and preventing voltage-gated Ca2+ entry."
  },
  sodiumnitroprusside: {
    metabolism: "Non-enzymatic breakdown in blood: interacts with oxyhemoglobin/RBC sulfhydryls, releasing 1 molecule of nitric oxide (NO) and 5 cyanide (CN-) ions. Cyanide is detoxified by hepatic rhodanese using thiosulfate into thiocyanate (SCN-).",
    metabolismLocation: "Intravascular spontaneous breakdown and hepatic rhodanese detoxification.",
    bbbCrossing: "NO diffuses across vascular endothelium; cyanide and thiocyanate cross BBB causing neurotoxicity.",
    bbbCnsEffects: "Cyanide toxicity (metabolic acidosis, confusion, seizures, coma); thiocyanate toxicity (hyperreflexia, psychosis, tinnitus, delirium).",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category C",
    pregnancySummary: "Crosses placenta; high risk of fatal fetal cyanide poisoning and metabolic acidosis. Strictly contraindicated in pregnancy unless all alternatives fail and infusion is <1-2 hours.",
    clinicalPearls: "Potent balanced arteriolar and venous dilator; rapid onset and offset (<2 min); photosensitive (must protect IV bag from light); co-infuse sodium thiosulfate in prolonged infusions to prevent cyanide toxicity."
  },
  nitroglycerin: {
    metabolism: "Enzymatic denitration in vascular smooth muscle and liver by mitochondrial aldehyde dehydrogenase (ALDH-2) and glutathione S-transferases, releasing nitric oxide (NO).",
    metabolismLocation: "Mitochondrial ALDH-2 in venous/vascular smooth muscle.",
    bbbCrossing: "Crosses BBB readily; high lipophilicity.",
    bbbCnsEffects: "Severe throbbing headache (meningeal arterial vasodilation), dizziness, flushing, syncope.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Used IV for acute pulmonary edema and severe hypertensive emergencies in preeclampsia; monitor maternal BP carefully.",
    clinicalPearls: "Organic nitrate; preferentially dilates venous capacitance vessels (reduces preload) at low doses; develops clinical tolerance (nitrate tolerance) due to ALDH-2 sulfhydryl oxidation; requires 10-12 hr nitrate-free interval."
  },
  diazoxide: {
    metabolism: "Hepatic oxidation and sulfate conjugation; ~50% excreted unchanged in urine.",
    metabolismLocation: "Hepatic metabolism and renal clearance; half-life 20-36 hours.",
    bbbCrossing: "Moderate BBB penetration; benzothiadiazine derivative lacking 7-sulfonamide.",
    bbbCnsEffects: "Dizziness, headache, weakness, severe hyperglycemia.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Crosses placenta; causes fetal and neonatal hyperbilirubinemia, thrombocytopenia, and marked fetal hyperglycemia/pancreatic inhibition. Avoid during labor and delivery.",
    clinicalPearls: "Non-diuretic benzothiadiazine; potent K_ATP channel opener in vascular smooth muscle and pancreatic beta-cells (inhibits insulin release); used for acute hypertensive crises and refractory hypoglycemia."
  },
  aliskiren: {
    metabolism: "Minimal hepatic metabolism by CYP3A4 (<10%); excreted >80% unchanged in feces via biliary clearance (substrate for P-glycoprotein).",
    metabolismLocation: "Biliary/fecal excretion; oral bioavailability ~2.5%.",
    bbbCrossing: "Very low BBB penetration; large transition-state peptidomimetic.",
    bbbCnsEffects: "Dizziness, headache, fatigue.",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category D (Contraindicated in 2nd/3rd Trimester)",
    pregnancySummary: "Boxed Warning: Drugs that act directly on the RAAS cause oligohydramnios, fetal renal agenesis, skull hypoplasia, and fetal death. Discontinue immediately upon pregnancy detection.",
    clinicalPearls: "Direct Renin Inhibitor; non-peptide transition-state mimetic targeting the catalytic Asp32/Asp215 dyad; blocks the rate-limiting step of RAAS (angiotensinogen -> Ang I)."
  },
  enalaprilat: {
    metabolism: "Not metabolized; cleared 100% unchanged by renal glomerular filtration and tubular secretion.",
    metabolismLocation: "Renal excretion; half-life ~11 hours.",
    bbbCrossing: "Negligible BBB penetration; hydrophilic tri-ionized dicarboxylate zwitterion.",
    bbbCnsEffects: "Dizziness, lightheadedness.",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category D",
    pregnancySummary: "Direct RAAS inhibitor; Boxed Warning for fetopathy, pulmonary hypoplasia, and neonatal renal failure.",
    clinicalPearls: "Active metabolite of enalapril; formulated as IV injection for hypertensive emergencies; contains carboxylate zinc-binding group replacing captopril sulfhydryl."
  },
  fosinopril: {
    metabolism: "Prodrug: completely hydrolyzed by intestinal and hepatic esterases to active fosinoprilat.",
    metabolismLocation: "Gut/liver esterase cleavage.",
    bbbCrossing: "Low BBB penetration; phosphinate ACE inhibitor.",
    bbbCnsEffects: "Dizziness, cough, fatigue.",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category D (Contraindicated in 2nd/3rd Trimester)",
    pregnancySummary: "Boxed Warning for second- and third-trimester fetopathy. Discontinue immediately if pregnancy occurs.",
    clinicalPearls: "Phosphinic acid ACE inhibitor; unique compensatory dual elimination: cleared equally by hepatic biliary excretion (50%) and renal excretion (50%); no dose adjustment needed in mild-to-moderate CKD."
  },
  quinapril: {
    metabolism: "Prodrug: rapid hepatic esterase de-esterification to active quinaprilat.",
    metabolismLocation: "Hepatic carboxylesterases.",
    bbbCrossing: "Low BBB penetration.",
    bbbCnsEffects: "Dizziness, headache, dry cough (bradykinin accumulation).",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category D (Boxed Warning)",
    pregnancySummary: "Contraindicated in pregnancy due to catastrophic RAAS fetopathy.",
    clinicalPearls: "Dicarboxylate ACE inhibitor prodrug; tetrahydroisoquinoline bicyclic core provides potent ACE binding."
  },
  benazepril: {
    metabolism: "Prodrug: completely bioactivated by hepatic esterases to active benazeprilat.",
    metabolismLocation: "Hepatic esterase hydrolysis.",
    bbbCrossing: "Low BBB penetration.",
    bbbCnsEffects: "Dizziness, headache, somnolence, dry cough.",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category D (Boxed Warning)",
    pregnancySummary: "Causes fetal renal failure, oligohydramnios, and limb contractures; contraindicated.",
    clinicalPearls: "Benzazepine-containing ACE inhibitor prodrug; ethyl ester enhances lipophilicity for oral absorption."
  },
  exp3174: {
    metabolism: "Active imidazole-5-carboxylic acid metabolite of losartan; eliminated unchanged in urine and bile.",
    metabolismLocation: "Hepatic CYP2C9/CYP3A4 oxidation of losartan 5-hydroxymethyl group.",
    bbbCrossing: "Low BBB penetration; highly ionized dicarboxylate.",
    bbbCnsEffects: "Dizziness, fatigue.",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category D",
    pregnancySummary: "Active ARB metabolite; contraindicated in pregnancy due to RAAS fetopathy.",
    clinicalPearls: "10 to 40 times more potent than losartan; non-competitive, insurmountable AT1 receptor antagonist with terminal half-life of 6-9 hours; responsible for majority of losartan clinical efficacy."
  },
  candesartancilexetil: {
    metabolism: "Prodrug: completely bioactivated during gastrointestinal absorption by mucosal esterases; cleaves cilexetil (cyclohexyl oxycarbonyloxy ethyl) ester releasing active candesartan.",
    metabolismLocation: "Intestinal wall esterases.",
    bbbCrossing: "Low BBB penetration.",
    bbbCnsEffects: "Dizziness, headache, back pain.",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category D (Boxed Warning)",
    pregnancySummary: "Direct RAAS inhibitor; Boxed Warning for fetopathy, skull hypoplasia, and neonatal anuria. Contraindicated in 2nd/3rd trimesters.",
    clinicalPearls: "Carbonate ester prodrug; active candesartan displays tight, insurmountable pseudoirreversible binding to AT1 receptor with very slow dissociation rate."
  },
  candesartan: {
    metabolism: "Minimal hepatic metabolism by CYP2C9 (<20%); ~33% excreted renally and ~67% in feces/bile.",
    metabolismLocation: "Renal and biliary clearance.",
    bbbCrossing: "Low BBB penetration.",
    bbbCnsEffects: "Dizziness, fatigue.",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category D (Boxed Warning)",
    pregnancySummary: "Contraindicated in pregnancy due to oligohydramnios and fetal renal dysgenesis.",
    clinicalPearls: "Insurmountable AT1 receptor antagonist; benzimidazole carboxylic acid provides electrostatic interaction with Lys199 on AT1 receptor."
  },
  olmesartanmedoxomil: {
    metabolism: "Prodrug: rapid and complete cleavage of medoxomil (5-methyl-2-oxo-1,3-dioxol-4-yl) ester by gut mucosa and portal blood esterases to active olmesartan.",
    metabolismLocation: "Intestinal mucosa esterases.",
    bbbCrossing: "Low BBB penetration.",
    bbbCnsEffects: "Dizziness, headache; unique risk of severe sprue-like enteropathy (severe chronic diarrhea with substantial weight loss and intestinal villous atrophy).",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category D (Boxed Warning)",
    pregnancySummary: "Contraindicated in pregnancy due to fatal fetal renal damage.",
    clinicalPearls: "Medoxomil prodrug ARB; causes sprue-like enteropathy requiring drug discontinuation; active olmesartan features hydroxypropyl and carboxylic acid groups on imidazole ring."
  },
  olmesartan: {
    metabolism: "No further metabolism; eliminated ~35-50% in urine and ~50-65% in feces via biliary excretion.",
    metabolismLocation: "Renal and biliary excretion.",
    bbbCrossing: "Low BBB penetration.",
    bbbCnsEffects: "Dizziness, headache.",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category D",
    pregnancySummary: "Contraindicated in pregnancy.",
    clinicalPearls: "Active form of olmesartan medoxomil; insurmountable AT1 blocker."
  },
  telmisartan: {
    metabolism: "Extensive hepatic glucuronidation (1-O-acylglucuronide); zero CYP450 metabolism; excreted >98% unchanged in feces via biliary clearance.",
    metabolismLocation: "Hepatic glucuronide conjugation and biliary excretion; terminal half-life ~24 hours.",
    bbbCrossing: "Moderate BBB penetration; most lipophilic ARB.",
    bbbCnsEffects: "Dizziness, fatigue, back pain.",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category D (Boxed Warning)",
    pregnancySummary: "Contraindicated in pregnancy due to fetal RAAS toxicity.",
    clinicalPearls: "Lacks the acidic tetrazole ring (contains a carboxylic acid instead); dual pharmacology: potent AT1 receptor antagonist PLUS partial agonist at Peroxisome Proliferator-Activated Receptor gamma (PPAR-gamma), improving insulin sensitivity and lipid metabolism."
  },
  irbesartan: {
    metabolism: "Hepatic oxidation primarily by CYP2C9 to glucuronide and monohydroxylated metabolites; <2% excreted unchanged in urine.",
    metabolismLocation: "Hepatic CYP2C9; half-life 11-15 hours.",
    bbbCrossing: "Low BBB penetration.",
    bbbCnsEffects: "Dizziness, fatigue, headache.",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category D (Boxed Warning)",
    pregnancySummary: "Contraindicated in pregnancy due to oligohydramnios and fetal death.",
    clinicalPearls: "Active drug (not a prodrug); contains a spirocyclopentyl group attached to imidazolinone core; highly selective AT1 blocker with excellent oral bioavailability (~60-80%)."
  },
  lovastatin: {
    metabolism: "Lactone prodrug: hydrolyzed by hepatic and intestinal esterases to active beta-hydroxy acid. Extensively metabolized by CYP3A4; extensive first-pass extraction (oral bioavailability <5%).",
    metabolismLocation: "Hepatic CYP3A4 and carboxylesterases.",
    bbbCrossing: "Moderate BBB penetration; lipophilic decalin lactone.",
    bbbCnsEffects: "Headache, insomnia, fatigue, mild cognitive impairment reported rarely.",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category X (Contraindicated in Pregnancy)",
    pregnancySummary: "Cholesterol synthesis is fundamentally essential for fetal embryogenesis, cell membrane synthesis, and organ development. Discontinue statins prior to conception or immediately upon pregnancy confirmation.",
    clinicalPearls: "Natural fungal HMG-CoA reductase inhibitor; closed lactone ring is a prodrug mimetic of mevalonate transition state; take with evening meal to boost absorption."
  },
  simvastatin: {
    metabolism: "Lactone prodrug: hydrolyzed by esterases to active beta-hydroxy acid form; extensively metabolized by CYP3A4 (high risk of drug-drug interactions with CYP3A4 inhibitors).",
    metabolismLocation: "Hepatic CYP3A4 and esterases; bioavailability ~5%.",
    bbbCrossing: "Moderate BBB penetration; highly lipophilic lactone.",
    bbbCnsEffects: "Headache, insomnia, memory loss (rare); primary adverse effects are myalgia, myopathy, and rhabdomyolysis.",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category X",
    pregnancySummary: "Contraindicated; risk of severe embryofetal developmental anomalies.",
    clinicalPearls: "Semi-synthetic derivative of lovastatin with an extra alpha-methyl group on 2-methylbutyrate ester; potent substrate for OATP1B1 and CYP3A4; contraindicated with gemfibrozil due to severe rhabdomyolysis."
  },
  pravastatin: {
    metabolism: "Active open-ring dihydroxy acid drug (NOT a prodrug); undergoes non-CYP hepatic and renal clearance (minor sulfoconjugation and isomerization); NOT metabolized by CYP3A4.",
    metabolismLocation: "Hepatic uptake via OATP1B1; non-CYP metabolism and dual renal/biliary elimination.",
    bbbCrossing: "Very low BBB penetration; hydrophilic 6beta-hydroxy group prevents passive diffusion into non-hepatic tissues/CNS.",
    bbbCnsEffects: "Low incidence of central sleep disturbances and lowest risk of myopathy among statins.",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category X",
    pregnancySummary: "Contraindicated during gestation.",
    clinicalPearls: "Hydrophilic statin; 6beta-hydroxy group confers hepatoselectivity (enters hepatocytes via OATP1B1 active transport); lowest potential for CYP-mediated drug interactions."
  },
  atorvastatin: {
    metabolism: "Active open-ring acid drug; extensive hepatic metabolism by CYP3A4 to active ortho- and para-hydroxylated metabolites (contribute ~70% of circulating HMG-CoA reductase inhibitory activity).",
    metabolismLocation: "Hepatic CYP3A4; elimination half-life ~14 hours (inhibitory activity half-life 20-30 hours).",
    bbbCrossing: "Low to moderate BBB penetration; lipophilic synthetic pyrrole core.",
    bbbCnsEffects: "Headache, dizziness, fatigue, myalgia.",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category X",
    pregnancySummary: "Contraindicated in pregnancy and nursing mothers.",
    clinicalPearls: "Synthetic statin; substituted pyrrole ring; high-intensity statin (produces >=50% LDL reduction at 40-80 mg); can be dosed at any time of day due to prolonged active metabolite half-life."
  },
  rosuvastatin: {
    metabolism: "Active open-ring acid drug; minimal hepatic metabolism (~10% by CYP2C9); not a substrate for CYP3A4; cleared >90% as parent drug in feces and urine.",
    metabolismLocation: "Hepatic OATP1B1 uptake and biliary excretion; terminal half-life ~19 hours.",
    bbbCrossing: "Very low BBB penetration; hydrophilic methane-sulfonamide group on pyrimidine ring confers amphoteric character and marked hepatoselectivity.",
    bbbCnsEffects: "Low CNS penetration; myopathy risk in patients with SLCO1B1 (OATP1B1) variants or of Asian ancestry (initiate at lower dose).",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category X",
    pregnancySummary: "Contraindicated in pregnancy.",
    clinicalPearls: "Most potent statin on a milligram basis; pyrimidine core with polar sulfonamide moiety; high-intensity statin with longest elimination half-life and minimal CYP3A4 interaction liability."
  },
  fluvastatin: {
    metabolism: "Extensive hepatic metabolism primarily by CYP2C9 (~75%) and minor CYP3A4/CYP2C8 to inactive metabolites; bioavailability ~24%.",
    metabolismLocation: "Hepatic CYP2C9; short half-life 1-3 hours.",
    bbbCrossing: "Low BBB penetration; synthetic indole ring.",
    bbbCnsEffects: "Headache, fatigue, insomnia, dyspepsia.",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category X",
    pregnancySummary: "Contraindicated in pregnancy.",
    clinicalPearls: "First fully synthetic statin; substituted indole scaffold; metabolized by CYP2C9 (low interaction with CYP3A4 inhibitors); lower LDL lowering efficacy."
  },
  pitavastatin: {
    metabolism: "Minimal hepatic metabolism; glucuronidation by UGT1A3/UGT2B7; negligible CYP3A4/CYP2C9 oxidation; excreted >80% in feces via bile.",
    metabolismLocation: "Hepatic UGT glucuronidation and biliary clearance; half-life ~12 hours.",
    bbbCrossing: "Low BBB penetration; quinoline ring with lipophilic cyclopropyl group.",
    bbbCnsEffects: "Headache, myalgia, back pain.",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category X",
    pregnancySummary: "Contraindicated in pregnancy.",
    clinicalPearls: "Synthetic statin with quinoline core and unique cyclopropyl ring; low risk of CYP-mediated drug interactions; does not adversely affect glycemic control / HbA1c."
  },
  gemfibrozil: {
    metabolism: "Extensive hepatic oxidation of methyl groups to hydroxymethyl and carboxylic acid metabolites; glucuronidation by UGT2B7 (gemfibrozil 1-O-beta-glucuronide); excreted primarily in urine.",
    metabolismLocation: "Hepatic oxidation and glucuronidation; half-life 1.5 hours.",
    bbbCrossing: "Moderate BBB penetration; phenoxyalkyl carboxylic acid.",
    bbbCnsEffects: "Dizziness, headache, fatigue; abdominal pain, gallstones (cholelithiasis).",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Animal studies show adverse fetal effects; avoid in pregnancy unless hypertriglyceridemia-induced pancreatitis threatens maternal life.",
    clinicalPearls: "Fibrate (PPAR-alpha agonist); increases LPL activity and decreases ApoC-III; potent mechanism-based inhibitor of CYP2C8 and potent inhibitor of OATP1B1 transporter; STRICTLY CONTRAINDICATED with statins (especially simvastatin) due to catastrophic rhabdomyolysis."
  },
  fenofibrate: {
    metabolism: "Prodrug: rapidly and completely hydrolyzed by plasma and tissue esterases to active fenofibric acid; negligible intact fenofibrate detected in circulation.",
    metabolismLocation: "Plasma and tissue carboxylesterases.",
    bbbCrossing: "Low to moderate BBB penetration.",
    bbbCnsEffects: "Headache, fatigue; cholelithiasis, myopathy.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Avoid during gestation unless severe hypertriglyceridemia risks acute maternal pancreatitis.",
    clinicalPearls: "Isopropyl ester prodrug; does NOT inhibit CYP2C8 or OATP1B1 to the extent of gemfibrozil; preferred fibrate when combination therapy with a statin is clinically required."
  },
  fenofibricacid: {
    metabolism: "Glucuronide conjugation and renal excretion (~60% in urine as glucuronide and unchanged acid).",
    metabolismLocation: "Hepatic/renal glucuronidation; half-life ~20 hours.",
    bbbCrossing: "Low BBB penetration.",
    bbbCnsEffects: "Headache, dizziness, myalgia.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Contraindicated unless severe hypertriglyceridemia threatens pancreatitis.",
    clinicalPearls: "Active metabolite of fenofibrate; activates PPAR-alpha; available as choline fenofibrate salt."
  },
  ezetimibe: {
    metabolism: "Rapidly glucuronidated in intestinal mucosa and liver to active ezetimibe-glucuronide; undergoes extensive enterohepatic recirculation back to the brush border; excreted 80% in feces.",
    metabolismLocation: "Intestinal mucosa and hepatic UGT1A1/UGT1A3/UGT2B7 glucuronidation.",
    bbbCrossing: "Very low BBB penetration; polar 1,4-diphenyl azetidin-2-one (beta-lactam).",
    bbbCnsEffects: "Fatigue, headache, diarrhea, upper respiratory infection.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "Limited human pregnancy data. Avoid during pregnancy unless maternal cardiovascular risk outweighs potential fetal harm; discontinue statin component if taken as combination.",
    clinicalPearls: "Cholesterol absorption inhibitor; binds Niemann-Pick C1-Like 1 (NPC1L1) transporter at the jejunal enterocyte brush border; active glucuronide metabolite is recycled repeatedly via enterohepatic circulation."
  },
  colesevelam: {
    metabolism: "Not metabolized by enzymes; completely non-absorbed and biologically inert; excreted 100% unchanged in feces.",
    metabolismLocation: "Non-systemic; remains entirely within gastrointestinal lumen.",
    bbbCrossing: "Zero BBB penetration (large insoluble cross-linked polymer).",
    bbbCnsEffects: "None; strictly gastrointestinal (constipation, dyspepsia, bloating, flatulence).",
    pregnancyRisk: "safe",
    pregnancyCategory: "Category B (Safest Lipid Agent in Pregnancy)",
    pregnancySummary: "Non-systemic polymer resin that is not absorbed into the bloodstream. Preferred agent for treating familial hypercholesterolemia in pregnant women; supplement with fat-soluble vitamins (A, D, E, K).",
    clinicalPearls: "High-capacity bile acid sequestrant (polyallylamine polymer); binds bile acids in intestine, preventing enterohepatic circulation and upregulating hepatic LDL receptors; also reduces HbA1c in type 2 diabetes."
  },
  cholestyramine: {
    metabolism: "Not absorbed from GI tract; excreted unchanged in feces.",
    metabolismLocation: "Insoluble quaternary ammonium anion-exchange resin in GI tract.",
    bbbCrossing: "Zero BBB penetration.",
    bbbCnsEffects: "None; causes severe constipation, nausea, fecal impaction.",
    pregnancyRisk: "safe",
    pregnancyCategory: "Category C (Non-systemic; historically used in pregnancy)",
    pregnancySummary: "Not systemically absorbed, making it safe for fetal development; can impair maternal absorption of fat-soluble vitamins (vitamins A, D, E, and K), risking maternal/fetal coagulopathy if vitamin K is depleted.",
    clinicalPearls: "Anion-exchange resin with styryl quaternary ammonium groups; binds negatively charged bile acids; binds and blocks absorption of acidic co-medications (warfarin, levothyroxine, thiazides, digoxin) - space dosing by 4 hours."
  },
  lomitapide: {
    metabolism: "Extensive hepatic metabolism by CYP3A4 to inactive metabolites; minor CYP2E1, CYP2C8, CYP2C19.",
    metabolismLocation: "Hepatic CYP3A4; half-life ~39 hours.",
    bbbCrossing: "Moderate BBB penetration; hexafluorinated phenanthrenyl dicarboxamide.",
    bbbCnsEffects: "Headache, dizziness, fatigue; severe hepatic steatosis and marked elevations in transaminases.",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Category X (Contraindicated in Pregnancy - Boxed Warning)",
    pregnancySummary: "Severe teratogenicity and embryofetal toxicity demonstrated in animal studies. Boxed Warning for embryo-fetal toxicity and hepatotoxicity. Pregnancy test required prior to initiation.",
    clinicalPearls: "Microsomal Triglyceride Transfer Protein (MTP) inhibitor; prevents assembly and secretion of apoB-containing lipoproteins (chylomicrons in enterocytes, VLDL in hepatocytes); approved for homozygous familial hypercholesterolemia (HoFH)."
  },
  niacin: {
    metabolism: "Dual pathways: high-affinity/low-capacity conjugation with glycine to nicotinuric acid (predominant at high doses; causes cutaneous flushing); and low-affinity/high-capacity conversion to NAD+/NADP+ (causes hepatotoxicity).",
    metabolismLocation: "Hepatic metabolism and renal excretion.",
    bbbCrossing: "Crosses BBB via active monocarboxylate transporter.",
    bbbCnsEffects: "Headache, dizziness, lightheadedness; intense prostaglandin D2/E2-mediated cutaneous flushing and pruritus.",
    pregnancyRisk: "caution",
    pregnancyCategory: "Category C",
    pregnancySummary: "High-dose pharmacological niacin is contraindicated in pregnancy; nutritional doses (as vitamin B3) are safe.",
    clinicalPearls: "Nicotinic acid (vitamin B3); binds GPR109A (HCA2) receptors on adipocytes, suppressing lipolysis and reducing free fatty acid flux to liver; reduces triglycerides, LDL-C, and increases HDL-C; pre-treat with aspirin 30 min prior to reduce flushing."
  },
  bempedoicacid: {
    metabolism: "Prodrug: converted in liver by very long-chain acyl-CoA synthetase-1 (ACSVL1 / SLC27A2) to active bempedoyl-CoA; ACSVL1 is absent in skeletal muscle; parent drug is glucuronidated and cleared renally.",
    metabolismLocation: "Hepatic ACSVL1 bioactivation and UGT2B7 glucuronidation; half-life ~21 hours.",
    bbbCrossing: "Low BBB penetration.",
    bbbCnsEffects: "Headache, fatigue; hyperuricemia/gout precipitation and tendon rupture.",
    pregnancyRisk: "contraindicated",
    pregnancyCategory: "Contraindicated (Pregnancy & Breastfeeding)",
    pregnancySummary: "Discontinue when pregnancy is recognized; mechanism of cholesterol synthesis inhibition can cause fetal harm.",
    clinicalPearls: "Inhibits ATP-citrate lyase (ACL), upstream of HMG-CoA reductase in cholesterol biosynthesis pathway; because ACSVL1 is absent in skeletal muscle, it does NOT cause the myalgias/myopathy characteristic of statins."
  },
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
  lmwh: 'enoxaparin',

  // Exam 2 Aliases
  diuril: "chlorothiazide",
  microzide: "hydrochlorothiazide",
  esidrix: "hydrochlorothiazide",
  hctz: "hydrochlorothiazide",
  zaroxolyn: "metolazone",
  lozol: "indapamide",
  hygroton: "chlorthalidone",
  edecrin: "ethacrynicacid",
  dyrenium: "triamterene",
  midamor: "amiloride",
  diamox: "acetazolamide",
  osmitrol: "mannitol",
  tenormin: "atenolol",
  trandate: "labetalol",
  normodyne: "labetalol",
  visken: "pindolol",
  corgard: "nadolol",
  catapres: "clonidine",
  tenex: "guanfacine",
  intuniv: "guanfacine",
  aldomet: "methyldopa",
  minipress: "prazosin",
  hytrin: "terazosin",
  cardura: "doxazosin",
  flomax: "tamsulosin",
  serpasil: "reserpine",
  ismelin: "guanethidine",
  procardia: "nifedipine",
  adalat: "nifedipine",
  norvasc: "amlodipine",
  cardene: "nicardipine",
  cleviprex: "clevidipine",
  plendil: "felodipine",
  nimotop: "nimodipine",
  loniten: "minoxidil",
  nitropress: "sodiumnitroprusside",
  nitrostat: "nitroglycerin",
  hyperstat: "diazoxide",
  proglycem: "diazoxide",
  tekturna: "aliskiren",
  monopril: "fosinopril",
  accupril: "quinapril",
  lotensin: "benazepril",
  atacand: "candesartan",
  benicar: "olmesartan",
  micardis: "telmisartan",
  avapro: "irbesartan",
  mevacor: "lovastatin",
  zocor: "simvastatin",
  pravachol: "pravastatin",
  lipitor: "atorvastatin",
  crestor: "rosuvastatin",
  lescol: "fluvastatin",
  livalo: "pitavastatin",
  lopid: "gemfibrozil",
  tricor: "fenofibrate",
  trilipix: "fenofibricacid",
  zetia: "ezetimibe",
  welchol: "colesevelam",
  questran: "cholestyramine",
  juxtapid: "lomitapide",
  niaspan: "niacin",
  nexletol: "bempedoicacid",
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
