import type {
  TargetMedChemProfile,
  KeyPocketResidueContact,
  InteractionType,
} from '../types/structure3d';

/**
 * Curated medicinal chemistry profiles for curricular drug targets.
 * Links 3D chemical pharmacophore groups to clinical PK/PD properties,
 * and key pocket residues to interaction mechanisms and therapeutic impact.
 */
export const CANONICAL_MEDCHEM_PROFILES: TargetMedChemProfile[] = [
  {
    targetGeneSymbol: 'P2RY12',
    pdbId: '4NTJ',
    drugName: 'Clopidogrel (AZD1283 Co-crystal)',
    ligandCode: 'AZD',
    pharmacophoreGroups: [
      {
        id: 'p2ry12_chlorophenyl',
        name: 'o-Chlorophenyl Lipophilic Anchor',
        chemicalFormula: 'C6H4Cl',
        atomNames: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'CL1', 'Cl'],
        colorAccent: '#3b82f6',
        pharmacokinetics: {
          absorption: 'High oral bioavailability (>50%); lipophilic chlorophenyl moiety facilitates passive intestinal membrane permeation.',
          metabolism: 'Extensive hepatic bioactivation: ~85% prodrug hydrolysed by CES1 to inactive carboxylic acid; remaining ~15% oxidised by CYP2C19/CYP2B6 to active thiol.',
          prodrugRole: 'Thienopyridine prodrug requiring two-step hepatic oxidation to generate the reactive thiol metabolite (H4).',
          halfLifeAndClearance: 'Parent drug plasma t1/2 ~6 h, active thiol metabolite plasma t1/2 ~30 min; renally (50%) and fecally (46%) cleared.',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Deep hydrophobic insertion into the hydrophobic subpocket of P2Y12, anchoring the antagonist core against transmembrane helices TM3 and TM7.',
          physiologicEffect: 'Blocks ADP-induced platelet activation, dense granule secretion, and subsequent inside-out signaling of integrin alphaIIb-beta3 (GPIIb/IIIa).',
          adverseEffectRisks: 'CYP2C19 loss-of-function (*2, *3 alleles) leads to poor antiplatelet response and increased stent thrombosis; major hemorrhage risk if combined with anticoagulants.',
        },
      },
      {
        id: 'p2ry12_thiol_warhead',
        name: 'Reactive Thiol / Sulfonyl Pharmacophore',
        chemicalFormula: 'R-SH',
        atomNames: ['S1', 'O1', 'O2', 'N1', 'C7', 'C8'],
        colorAccent: '#ef4444',
        pharmacokinetics: {
          absorption: 'Rapid peak plasma concentration of active metabolite (Tmax ~45-60 min post-dose).',
          metabolism: 'Rapidly inactivated by glutathione conjugation and S-methylation once released into systemic circulation.',
          prodrugRole: 'Bioactivated sulfenic acid/thiol group forms irreversible covalent disulfide bond with platelet surface cysteine.',
          halfLifeAndClearance: 'Pharmacodynamic effect lasts 7-10 days (entire lifespan of circulating platelets) despite rapid clearance of the circulating metabolite.',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Forms an irreversible covalent disulfide linkage with Cys97 / Cys175 in the extracellular loop of the human P2Y12 receptor.',
          physiologicEffect: 'Permanent inhibition of ADP-mediated adenylate cyclase downregulation, maintaining high cAMP levels and preventing platelet aggregation.',
          adverseEffectRisks: 'Requires 5-7 day pre-operative discontinuation before elective surgery to permit de novo platelet regeneration and avoid unmanageable surgical bleeding.',
        },
      },
      {
        id: 'p2ry12_ester_esterase',
        name: 'Methyl Ester Shunt Motif',
        chemicalFormula: 'COOCH3',
        atomNames: ['C9', 'O3', 'O4', 'C10'],
        colorAccent: '#10b981',
        pharmacokinetics: {
          absorption: 'Acts as ester prodrug moiety; cleaved primarily in hepatocytes and enterocytes by carboxylesterase 1 (CES1).',
          metabolism: 'Major metabolic inactivation pathway; hydrolysed to inactive SR26334 carboxylic acid derivative.',
          prodrugRole: 'Ester hydrolysis is an inactivation shunt, while CYP2C19 thiol generation provides the therapeutic fraction.',
          halfLifeAndClearance: 'Circulating inactive acid metabolite exhibits terminal half-life of ~8 hours and is excreted in urine.',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Steric fit at the pocket entrance near extracellular loops; uncharged ester prevents premature charge repulsion prior to receptor entry.',
          physiologicEffect: 'Indirectly modulates the fraction of drug available for CYP2C19 bioactivation, determining therapeutic antiplatelet window.',
          adverseEffectRisks: 'CES1 polymorphisms or drug-drug interactions (e.g. alcohol co-ingestion) can skew active metabolite generation.',
        },
      },
    ],
    keyPocketResidues: [
      {
        resi: 97,
        resn: 'CYS',
        chain: 'A',
        label: 'Cys97 (TM3)',
        interactionType: 'covalent',
        subPocketName: 'TM3 Covalent Disulfide Sub-pocket',
        pharmacophoreGroupId: 'p2ry12_thiol_warhead',
        colorAccent: '#ef4444',
        clinicalImpact: 'Forms permanent covalent disulfide bond with clopidogrel active metabolite thiol, resulting in irreversible platelet inhibition for the 7-10 day platelet lifespan.',
      },
      {
        resi: 256,
        resn: 'ARG',
        chain: 'A',
        label: 'Arg256 (TM6)',
        interactionType: 'ionic',
        subPocketName: 'TM6/TM7 Lipophilic & Cationic Sub-pocket',
        pharmacophoreGroupId: 'p2ry12_chlorophenyl',
        colorAccent: '#3b82f6',
        clinicalImpact: 'Positively charged arginine interacts with negative electrostatic surface of nucleotide/antagonist ligands, critical for high-affinity receptor locking.',
      },
      {
        resi: 280,
        resn: 'LYS',
        chain: 'A',
        label: 'Lys280 (TM7)',
        interactionType: 'hydrogen-bond',
        subPocketName: 'Extracellular Vestibule Entrance Pocket',
        pharmacophoreGroupId: 'p2ry12_ester_esterase',
        colorAccent: '#10b981',
        clinicalImpact: 'Stabilizes the antagonist backbone in the extracellular vestibule, preventing endogenous ADP from inducing receptor conformational collapse.',
      },
    ],
  },
  {
    targetGeneSymbol: 'ACE',
    pdbId: '1O86',
    drugName: 'Enalaprilat',
    ligandCode: '1N4',
    pharmacophoreGroups: [
      {
        id: 'ace_zinc_carboxylate',
        name: 'Catalytic Zinc-Coordinating Carboxylate',
        chemicalFormula: 'COO-',
        atomNames: ['C1', 'O1', 'O2', 'ZN'],
        colorAccent: '#ef4444',
        pharmacokinetics: {
          absorption: 'Poor oral absorption due to charged dicarboxylic acid structure (oral bioavailability <10%); formulated as monoethyl ester prodrug (Enalapril).',
          metabolism: 'Enalapril is bioactivated in the liver by hepatic carboxylesterases (CES1) to active enalaprilat.',
          prodrugRole: 'Enalapril ethyl ester masks one negative charge, allowing oral absorption prior to ester cleavage to enalaprilat.',
          halfLifeAndClearance: 'Enalaprilat effective half-life ~11 hours; eliminated almost exclusively unchanged by renal glomerular filtration.',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Bidentate coordination to the catalytic Zn²⁺ ion (distances ~2.0 Å), displacing the catalytic water molecule required for peptide bond cleavage.',
          physiologicEffect: 'Blocks conversion of Angiotensin I to the potent vasoconstrictor Angiotensin II; inhibits bradykinin degradation by kininase II.',
          adverseEffectRisks: 'Bradykinin and substance P accumulation drives class-effect dry hacking cough (~10-20% of patients) and rare life-threatening angioedema.',
        },
      },
      {
        id: 'ace_phenethyl_p1',
        name: 'Phenethyl S1 Lipophilic Anchor',
        chemicalFormula: 'C6H5-CH2-CH2-',
        atomNames: ['C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'],
        colorAccent: '#3b82f6',
        pharmacokinetics: {
          absorption: 'Enhances overall lipophilicity and volume of distribution compared to captopril.',
          metabolism: 'Resistant to aromatic ring hydroxylation; cleared largely unchanged.',
          prodrugRole: 'Structural mimic of phenylalanine sidechain in natural Angiotensin I substrate.',
          halfLifeAndClearance: 'Contributes to slow receptor dissociation kinetics, extending the effective therapeutic duration allowing once-daily dosing.',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Inserts deeply into the hydrophobic S1 pocket lined by Val518 and Phe512, mimicking the Phe8 residue of Angiotensin I.',
          physiologicEffect: 'High-affinity nanomolar competitive enzyme inhibition reduces systemic vascular resistance and left ventricular afterload.',
          adverseEffectRisks: 'First-dose hypotension in volume- or salt-depleted patients; acute decline in GFR in bilateral renal artery stenosis due to loss of efferent arteriolar tone.',
        },
      },
      {
        id: 'ace_proline_p2_prime',
        name: 'L-Proline C-Terminal Carboxylate',
        chemicalFormula: 'C5H8NO2-',
        atomNames: ['N1', 'C11', 'C12', 'C13', 'C14', 'O3', 'O4'],
        colorAccent: '#8b5cf6',
        pharmacokinetics: {
          absorption: 'Zwitterionic character influences intestinal peptide transporter (PEPT1) uptake.',
          metabolism: 'Not subject to phase I or phase II metabolism.',
          prodrugRole: 'Conserved from venom peptide teprotide structure to optimize zinc protease recognition.',
          halfLifeAndClearance: 'Renally excreted; dosage adjustment mandated in chronic kidney disease (CrCl < 30 mL/min).',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Salt bridge with Lys511 and dual hydrogen bonds with Tyr520 and Gln281 in the S2\' subsite.',
          physiologicEffect: 'Fixes orientation of the inhibitor in the active cleft, preventing substrate dipeptide cleavage.',
          adverseEffectRisks: 'Hyperkalemia through decreased aldosterone secretion; contraindicated in pregnancy due to fetal renal dysgenesis (teratogenicity).',
        },
      },
    ],
    keyPocketResidues: [
      {
        resi: 384,
        resn: 'GLU',
        chain: 'A',
        label: 'Glu384 (Catalytic Base)',
        interactionType: 'hydrogen-bond',
        subPocketName: 'Catalytic Zn²⁺ & Transition-State Pocket',
        pharmacophoreGroupId: 'ace_zinc_carboxylate',
        colorAccent: '#ef4444',
        clinicalImpact: 'Acts as general acid-base catalytic residue; directly H-bonds with the enalaprilat secondary amine, locking the transition state mimic.',
      },
      {
        resi: 511,
        resn: 'LYS',
        chain: 'A',
        label: 'Lys511 (S2\' Anchor)',
        interactionType: 'ionic',
        subPocketName: 'S2\' Cationic Proline Sub-pocket',
        pharmacophoreGroupId: 'ace_proline_p2_prime',
        colorAccent: '#8b5cf6',
        clinicalImpact: 'Forms a critical salt bridge with the terminal carboxylate of the proline ring, providing sub-nanomolar binding affinity.',
      },
      {
        resi: 520,
        resn: 'TYR',
        chain: 'A',
        label: 'Tyr520 (S2\' Pocket)',
        interactionType: 'hydrogen-bond',
        subPocketName: 'S1/S2\' Recognition Sub-pocket',
        pharmacophoreGroupId: 'ace_phenethyl_p1',
        colorAccent: '#3b82f6',
        clinicalImpact: 'H-bonds with C-terminal carboxylate, stabilizing the inhibitor in the substrate recognition subsite.',
      },
    ],
  },
  {
    targetGeneSymbol: 'AGTR1',
    pdbId: '4Z9O',
    drugName: 'Losartan Active EXP3174',
    ligandCode: '4Z9',
    pharmacophoreGroups: [
      {
        id: 'agtr1_biphenyl_tetrazole',
        name: 'Biphenyl Tetrazole Carboxylate Bioisostere',
        chemicalFormula: 'C13H9N4-',
        atomNames: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'N1', 'N2', 'N3', 'N4'],
        colorAccent: '#ef4444',
        pharmacokinetics: {
          absorption: 'Acidic tetrazole (pKa ~4.5) is >99% deprotonated at physiologic pH, providing high aqueous solubility with moderate oral absorption (~33%).',
          metabolism: 'Resistant to cleavage and conjugation compared to carboxylic acids; minimal glucuronidation.',
          prodrugRole: 'Bioisosteric replacement for carboxylic acid with 10-fold greater metabolic stability and wider charge distribution.',
          halfLifeAndClearance: 'Metabolite EXP3174 half-life is 6-9 hours (vs 2 hours for parent losartan), allowing once-daily blood pressure control.',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Negative charge interacts via ionic salt bridges with Arg167 (TM4) and Lys199 (TM5) at the receptor entrance.',
          physiologicEffect: 'Blocks Angiotensin II-mediated vascular smooth muscle contraction, aldosterone synthesis, and vascular hypertrophy without bradykinin buildup.',
          adverseEffectRisks: 'Hyperkalemia, symptomatic hypotension, and teratogenic fetopathy (fetal cranial bone hypoplasia and anuria).',
        },
      },
      {
        id: 'agtr1_imidazole_core',
        name: 'Substituted Imidazole Central Core',
        chemicalFormula: 'C3H2N2Cl',
        atomNames: ['C11', 'C12', 'N5', 'C13', 'N6', 'CL1'],
        colorAccent: '#3b82f6',
        pharmacokinetics: {
          absorption: 'Provides planar rigid scaffold optimizing partition coefficient (LogP ~4.0).',
          metabolism: 'Parent losartan 5-hydroxymethyl group on imidazole is oxidised by CYP2C9 and CYP3A4 to 5-carboxylic acid (EXP3174).',
          prodrugRole: 'Losartan is converted in vivo to EXP3174, which is 10 to 40 times more potent as an AT1 antagonist.',
          halfLifeAndClearance: 'Hepatic oxidation by CYP2C9; sensitive to CYP2C9*2 and *3 poor-metabolizer genotypes.',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Hydrophobic and pi-stacking interactions with Phe182 and Trp84 in the central transmembrane cavity.',
          physiologicEffect: 'Prevents Gq protein coupling, suppressing inositol trisphosphate (IP3) generation and intracellular Ca²⁺ release.',
          adverseEffectRisks: 'Drug interactions with strong CYP2C9 inhibitors (e.g. fluconazole) reduce active metabolite generation.',
        },
      },
      {
        id: 'agtr1_butyl_tail',
        name: 'n-Butyl Lipophilic Side Chain',
        chemicalFormula: 'C4H9-',
        atomNames: ['C14', 'C15', 'C16', 'C17'],
        colorAccent: '#10b981',
        pharmacokinetics: {
          absorption: 'Imparts lipophilicity required for cell membrane partition and slow receptor off-rate.',
          metabolism: 'Minor omega/omega-1 hydroxylation by cytochrome P450 enzymes.',
          prodrugRole: 'Mimics the hydrophobic sidechain of Ile5 in Angiotensin II.',
          halfLifeAndClearance: 'Biliary and fecal excretion (~60%) and renal excretion (~35%).',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Inserts into a deep hydrophobic cleft lined by Val108, Leu112, and Ile288.',
          physiologicEffect: 'Provides insurmountable non-competitive antagonism by locking the receptor in an inactive ground state.',
          adverseEffectRisks: 'Excessive vasodilation in volume-depleted states.',
        },
      },
    ],
    keyPocketResidues: [
      {
        resi: 167,
        resn: 'ARG',
        chain: 'A',
        label: 'Arg167 (TM4 Anchor)',
        interactionType: 'ionic',
        subPocketName: 'TM4/TM5 Diacid Salt-Bridge Sub-pocket',
        pharmacophoreGroupId: 'agtr1_biphenyl_tetrazole',
        colorAccent: '#ef4444',
        clinicalImpact: 'Forms strong salt bridge with the acidic tetrazole and carboxylate groups of sartans; mutation abolishes ARB therapeutic binding.',
      },
      {
        resi: 199,
        resn: 'LYS',
        chain: 'A',
        label: 'Lys199 (TM5)',
        interactionType: 'hydrogen-bond',
        subPocketName: 'Orthosteric Tetrazole H-Bond Sub-pocket',
        pharmacophoreGroupId: 'agtr1_biphenyl_tetrazole',
        colorAccent: '#ef4444',
        clinicalImpact: 'Coordinates the tetrazole nitrogen atoms via direct hydrogen bonds, stabilizing the antagonist in the orthosteric binding site.',
      },
      {
        resi: 182,
        resn: 'PHE',
        chain: 'A',
        label: 'Phe182 (ECL2)',
        interactionType: 'pi-stacking',
        subPocketName: 'ECL2/TM6 Aromatic Imidazole Sub-pocket',
        pharmacophoreGroupId: 'agtr1_imidazole_core',
        colorAccent: '#3b82f6',
        clinicalImpact: 'Provides aromatic pi-pi stacking with the biphenyl core, restricting extracellular receptor loop mobility.',
      },
    ],
  },
  {
    targetGeneSymbol: 'HMGCR',
    pdbId: '1HWK',
    drugName: 'Atorvastatin',
    ligandCode: '1HW',
    pharmacophoreGroups: [
      {
        id: 'hmgcr_dihydroxyheptanoate',
        name: '3,5-Dihydroxyheptanoic Acid Transition-State Mimic',
        chemicalFormula: 'C7H13O4-',
        atomNames: ['C1', 'O1', 'O2', 'C2', 'C3', 'O3', 'C4', 'C5', 'O4', 'C6', 'C7'],
        colorAccent: '#ef4444',
        pharmacokinetics: {
          absorption: 'Rapid oral absorption (Tmax 1-2 h); low absolute bioavailability (~14%) due to extensive presystemic gastrointestinal clearance and hepatic first-pass.',
          metabolism: 'Extensively metabolised by CYP3A4 to ortho- and para-hydroxylated metabolites, which account for ~70% of total circulating HMGCR inhibitory activity.',
          prodrugRole: 'Synthesized directly in open active dihydroxy acid form (unlike simvastatin/lovastatin lactone prodrugs), avoiding mandatory lactone hydrolysis.',
          halfLifeAndClearance: 'Plasma elimination half-life ~14 hours, but half-life of HMG-CoA reductase inhibitory activity is 20-30 hours due to active metabolites; biliary/fecal excretion (>98%).',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Exact stereochemical mimic of the 3-hydroxy-3-methylglutaryl (HMG) tetrahedral hemithioacetal transition state, binding with 10,000-fold higher affinity than natural substrate.',
          physiologicEffect: 'Potent competitive inhibition of HMG-CoA reductase shuts down de novo hepatic cholesterol synthesis, upregulating SREBP-2 and hepatic LDL receptors to clear circulating LDL-C.',
          adverseEffectRisks: 'Statin-associated muscle symptoms (myalgia, myopathy, rare rhabdomyolysis); elevated serum transaminases; slight risk of new-onset type 2 diabetes mellitus.',
        },
      },
      {
        id: 'hmgcr_fluorophenyl',
        name: 'p-Fluorophenyl Hydrophobic Anchor',
        chemicalFormula: 'C6H4F-',
        atomNames: ['C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'F1'],
        colorAccent: '#3b82f6',
        pharmacokinetics: {
          absorption: 'Para-fluoro substitution blocks hepatic aromatic ring para-hydroxylation, significantly prolonging duration of action.',
          metabolism: 'Resistant to oxidative defluorination; forces metabolic clearance through CYP3A4-mediated pyrrole hydroxylation.',
          prodrugRole: 'Synthetic substituent designed to replace the decalin ring of natural fungal statins while maintaining high nanomolar potency.',
          halfLifeAndClearance: 'High protein binding (>98%, primarily albumin), low renal excretion (<2%).',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Projects into a narrow hydrophobic pocket between Arg590 and Met657, making polar fluorine-backbone contacts and hydrophobic van der Waals contacts.',
          physiologicEffect: 'Enforces rigid binding geometry, precluding normal HMGCR catalytic domain conformational closure.',
          adverseEffectRisks: 'Susceptible to significant drug-drug interactions with strong CYP3A4 inhibitors (clarithromycin, itraconazole, protease inhibitors), increasing systemic statin exposure and myopathy risk.',
        },
      },
      {
        id: 'hmgcr_central_pyrrole',
        name: 'Substituted Pyrrole Core with Carboxamide',
        chemicalFormula: 'C4HN(C3H7)(CONHC6H5)',
        atomNames: ['N1', 'C14', 'C15', 'C16', 'C17', 'C18', 'O5', 'N2', 'C19', 'C20'],
        colorAccent: '#10b981',
        pharmacokinetics: {
          absorption: 'Contributes to moderate lipophilicity (LogD ~1.5 at pH 7.4), promoting efficient hepatic uptake via organic anion transporting polypeptide 1B1 (OATP1B1 / SLCO1B1).',
          metabolism: 'Subject to CYP3A4 oxidation; SLCO1B1 loss-of-function variants (e.g. 521T>C) double systemic atorvastatin exposure.',
          prodrugRole: 'Rigid central scaffold correctly displays the dihydroxyheptanoate head and aromatic wings at 120-degree vectors.',
          halfLifeAndClearance: 'Biliary elimination via hepatic efflux transporters P-glycoprotein and BCRP.',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'The phenylcarboxamide NH forms a specific hydrogen bond with the carbonyl oxygen of Ser565, anchoring the central scaffold.',
          physiologicEffect: 'Directly accounts for high clinical LDL-C reduction efficacy (-40% to -60% reduction across 10-80 mg dosing range).',
          adverseEffectRisks: 'SLCO1B1-dependent drug interactions (e.g. with gemfibrozil or cyclosporine) substantially elevate rhabdomyolysis hazard.',
        },
      },
    ],
    keyPocketResidues: [
      {
        resi: 735,
        resn: 'LYS',
        chain: 'A',
        label: 'Lys735 (Catalytic Residue)',
        interactionType: 'ionic',
        subPocketName: 'HMG Transition-State Catalytic Pocket',
        pharmacophoreGroupId: 'hmgcr_dihydroxyheptanoate',
        colorAccent: '#ef4444',
        clinicalImpact: 'Forms bidentate salt bridge and hydrogen bond with the terminal C1 carboxylate of the statin, directly competing with the natural HMG substrate.',
      },
      {
        resi: 590,
        resn: 'ARG',
        chain: 'A',
        label: 'Arg590 (Substrate Channel)',
        interactionType: 'ionic',
        subPocketName: 'Fluorophenyl Hydrophobic Cleft',
        pharmacophoreGroupId: 'hmgcr_fluorophenyl',
        colorAccent: '#3b82f6',
        clinicalImpact: 'Interacts with the dihydroxy acid C5-hydroxyl and carboxylate, essential for picomolar to nanomolar competitive enzyme inhibition.',
      },
      {
        resi: 684,
        resn: 'SER',
        chain: 'A',
        label: 'Ser684 (Hydroxyl Network)',
        interactionType: 'hydrogen-bond',
        subPocketName: 'Central Pyrrole Carboxamide Pocket',
        pharmacophoreGroupId: 'hmgcr_central_pyrrole',
        colorAccent: '#10b981',
        clinicalImpact: 'Forms stereospecific hydrogen bond with the C3-hydroxyl group of the heptanoic acid moiety; loss of this stereocenter drops potency 100-fold.',
      },
    ],
  },
  {
    targetGeneSymbol: 'ADRB1',
    pdbId: '7JJO',
    drugName: 'Metoprolol',
    ligandCode: 'NEN',
    pharmacophoreGroups: [
      {
        id: 'adrb1_aryloxypropanolamine',
        name: 'Protonated Secondary Amine Pharmacophore',
        chemicalFormula: 'R-NH2+-CH(CH3)2',
        atomNames: ['N1', 'C1', 'C2', 'C3', 'C4', 'C5'],
        colorAccent: '#ef4444',
        pharmacokinetics: {
          absorption: 'Readily absorbed from the GI tract (>90%), but extensive hepatic first-pass metabolism limits systemic bioavailability to ~40-50%.',
          metabolism: 'Primarily metabolised by polymorphic CYP2D6 via alpha-hydroxylation and O-demethylation (>80% of dose).',
          prodrugRole: 'Active drug as administered; basic amine (pKa ~9.7) ensures >99% protonation at physiologic pH.',
          halfLifeAndClearance: 'Elimination half-life ~3-7 hours in extensive metabolizers, but markedly prolonged to 7-10+ hours in CYP2D6 poor metabolizers; renally cleared as inactive metabolites.',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Forms an obligatory ionic salt bridge with the conserved Asp121 (Asp3.32) in transmembrane helix 3, mimicking protonated catecholamine binding.',
          physiologicEffect: 'Competitive beta-1 adrenergic receptor antagonism attenuates Gs protein coupling, reducing adenylyl cyclase activity, intracellular cAMP, and PKA phosphorylation.',
          adverseEffectRisks: 'Marked bradycardia, heart block, or severe hypotension, particularly in CYP2D6 poor metabolizers or when combined with CYP2D6 inhibitors (e.g. bupropion, fluoxetine).',
        },
      },
      {
        id: 'adrb1_beta_hydroxyl',
        name: 'Stereospecific Beta-Hydroxyl Group',
        chemicalFormula: '-CH(OH)-',
        atomNames: ['C6', 'O1'],
        colorAccent: '#3b82f6',
        pharmacokinetics: {
          absorption: 'Modulates hydrophilic-lipophilic balance, allowing moderate brain penetration across the blood-brain barrier.',
          metabolism: 'Resistant to glucuronide conjugation; metabolic breakdown occurs predominantly on the peripheral ether side chains.',
          prodrugRole: 'Chiral center: administered as racemic mixture; (S)-metoprolol carries virtually all the beta-blocking pharmacologic activity (50-500 fold more potent than (R)-enantiomer).',
          halfLifeAndClearance: 'Metabolites are devoid of significant beta-blocking action and are rapidly excreted by the kidneys.',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Forms essential stereospecific hydrogen bonds with Asn329 (Asn7.39) in TM7 and the backbone carbonyl of Asp121.',
          physiologicEffect: 'Reduces myocardial oxygen demand by decreasing heart rate (negative chronotropy) and contractile force (negative inotropy).',
          adverseEffectRisks: 'Worsening of acute decompensated heart failure if initiated without proper titration; fatigue and cold extremities due to peripheral vasoconstriction.',
        },
      },
      {
        id: 'adrb1_methoxyethyl_tail',
        name: 'p-Methoxyethyl Cardioselective Tail',
        chemicalFormula: '-CH2-CH2-O-CH3',
        atomNames: ['C7', 'C8', 'O2', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14'],
        colorAccent: '#10b981',
        pharmacokinetics: {
          absorption: 'Lipophilic ether tail promotes rapid intestinal absorption and moderate volume of distribution (Vd ~3.2 L/kg).',
          metabolism: 'Major site of CYP2D6 O-demethylation to active and inactive phenolic metabolites.',
          prodrugRole: 'Para-substituted ether chain confers selective beta-1 vs beta-2 affinity at therapeutic concentrations.',
          halfLifeAndClearance: 'Clearance heavily influenced by CYP2D6 genotype and hepatic blood flow.',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Extends into the extracellular vestibule between TM2 and TM7, fitting selectively into the narrower ADRB1 pocket compared to ADRB2.',
          physiologicEffect: 'Provides cardioselectivity, reducing heart rate and blood pressure while minimizing bronchoconstriction in patients with mild-to-moderate reactive airway disease.',
          adverseEffectRisks: 'Cardioselectivity is dose-dependent: at higher doses (>100 mg/day) metoprolol antagonises bronchial beta-2 receptors, risking fatal bronchospasm in severe asthma.',
        },
      },
    ],
    keyPocketResidues: [
      {
        resi: 121,
        resn: 'ASP',
        chain: 'A',
        label: 'Asp121 (Asp3.32 conserved)',
        interactionType: 'ionic',
        subPocketName: 'TM3 Orthosteric Amine Salt-Bridge Pocket',
        pharmacophoreGroupId: 'adrb1_aryloxypropanolamine',
        colorAccent: '#ef4444',
        clinicalImpact: 'Forms mandatory ionic salt bridge with protonated basic amine; point mutation completely ablates adrenergic ligand binding and signaling.',
      },
      {
        resi: 329,
        resn: 'ASN',
        chain: 'A',
        label: 'Asn329 (Asn7.39 TM7)',
        interactionType: 'hydrogen-bond',
        subPocketName: 'TM7 Stereoselective Beta-Hydroxyl Pocket',
        pharmacophoreGroupId: 'adrb1_beta_hydroxyl',
        colorAccent: '#3b82f6',
        clinicalImpact: 'Forms critical stereoselective hydrogen bond with the (S)-enantiomer beta-hydroxyl group, accounting for enantiomer-specific potency.',
      },
      {
        resi: 307,
        resn: 'TYR',
        chain: 'A',
        label: 'Tyr307 (Tyr7.17)',
        interactionType: 'pi-stacking',
        subPocketName: 'TM2/TM7 Cardioselective Vestibule Pocket',
        pharmacophoreGroupId: 'adrb1_methoxyethyl_tail',
        colorAccent: '#10b981',
        clinicalImpact: 'Stabilizes the aromatic ring of the antagonist in the orthosteric binding pocket via edge-to-face pi interactions.',
      },
    ],
  },
  {
    targetGeneSymbol: 'PTGS2',
    pdbId: '3LN1',
    drugName: 'Celecoxib',
    ligandCode: 'CEL',
    pharmacophoreGroups: [
      {
        id: 'ptgs2_sulfonamide_warhead',
        name: 'Aryl Sulfonamide COX-2 Selective Pocket Warhead',
        chemicalFormula: '-SO2NH2',
        atomNames: ['S1', 'O1', 'O2', 'N1', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'],
        colorAccent: '#ef4444',
        pharmacokinetics: {
          absorption: 'Oral bioavailability is high (~90%), though peak plasma concentration is delayed (Tmax 2-4 h) and enhanced 2-fold when taken with high-fat meals.',
          metabolism: 'Extensively metabolised in the liver, with negligible urinary excretion of unchanged drug (<3%).',
          prodrugRole: 'Administered directly as active compound; sulfonamide is neutral to weakly acidic (pKa ~11) and uncharged in physiologic conditions.',
          halfLifeAndClearance: 'Elimination half-life ~11 hours; primarily cleared through CYP2C9-mediated methyl hydroxylation; renally cleared only as glucuronide metabolites.',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Inserts directly into the secondary hydrophilic pocket accessible only in COX-2 due to Val523 (which replaces the bulkier Ile523 of COX-1).',
          physiologicEffect: 'Selectively inhibits prostaglandin E2 (PGE2) and prostacyclin (PGI2) synthesis at inflammatory sites, providing potent analgesia and antipyretic relief without blocking gastric mucosal COX-1.',
          adverseEffectRisks: 'Imbalance of vascular prostacyclin (inhibited) versus platelet thromboxane A2 (uninhibited) increases risks of myocardial infarction and ischemic stroke; allergic hypersensitivity in patients with true sulfonamide allergies.',
        },
      },
      {
        id: 'ptgs2_pyrazole_core',
        name: '1,5-Diarylpyrazole Central Rigid Scaffold',
        chemicalFormula: 'C3HN2(CF3)',
        atomNames: ['N2', 'N3', 'C7', 'C8', 'C9', 'C10', 'F1', 'F2', 'F3'],
        colorAccent: '#3b82f6',
        pharmacokinetics: {
          absorption: 'Trifluoromethyl substituent at C3 of pyrazole substantially increases lipophilicity and membrane permeability.',
          metabolism: 'Trifluoromethyl group resists oxidative dehalogenation, protecting the central heterocyclic core from ring-opening.',
          prodrugRole: 'Provides rigid three-way geometry orienting the sulfonamide and tolyl rings at ~60-degree angles.',
          halfLifeAndClearance: 'Supports once- or twice-daily dosing schedules in osteoarthritis and rheumatoid arthritis.',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Fits securely at the constriction point of the hydrophobic cyclooxygenase channel, blocking arachidonic acid substrate ingress to Tyr385.',
          physiologicEffect: 'Nanomolar inhibition of inducible COX-2 (IC50 ~40 nM) with ~30-fold selectivity over constitutive COX-1.',
          adverseEffectRisks: 'Renal toxicity due to inhibition of renal medullary COX-2: sodium and water retention, peripheral edema, and hypertension exacerbation.',
        },
      },
      {
        id: 'ptgs2_tolyl_tail',
        name: '4-Methylphenyl (Tolyl) Lipophilic Rotor',
        chemicalFormula: 'C6H4-CH3',
        atomNames: ['C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17'],
        colorAccent: '#10b981',
        pharmacokinetics: {
          absorption: 'Contributes to high lipophilicity (LogP ~3.5).',
          metabolism: 'Primary metabolic soft-spot: methyl group is oxidised by CYP2C9 to hydroxymethyl celecoxib and subsequently to inactive carboxy-celecoxib.',
          prodrugRole: 'Metabolic clearance site; individuals carrying CYP2C9*3/*3 alleles have up to 7-fold increased area under the plasma concentration curve (AUC).',
          halfLifeAndClearance: 'Fecal excretion (~57%) and urinary excretion (~27%) as oxidized metabolites.',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Packs into the hydrophobic upper chamber formed by Phe518, Trp387, and Leu352 near the catalytic heme site.',
          physiologicEffect: 'Competitively prevents arachidonate from reaching the catalytic Tyr385 radical, halting prostanoid cascade.',
          adverseEffectRisks: 'CYP2C9 poor metabolizers require 50% dose reductions to prevent supratherapeutic plasma levels and cardiovascular toxicities.',
        },
      },
    ],
    keyPocketResidues: [
      {
        resi: 523,
        resn: 'VAL',
        chain: 'A',
        label: 'Val523 (Gatekeeper Residue)',
        interactionType: 'hydrophobic',
        subPocketName: 'COX-2 Selective Hydrophilic Side-Pocket Gate',
        pharmacophoreGroupId: 'ptgs2_sulfonamide_warhead',
        colorAccent: '#ef4444',
        clinicalImpact: 'The single-methyl difference (Val523 in COX-2 vs bulkier Ile523 in COX-1) creates an accessible side pocket that enables selective COX-2 inhibition while sparing gastric COX-1.',
      },
      {
        resi: 513,
        resn: 'ARG',
        chain: 'A',
        label: 'Arg513 (Side Pocket Basic Residue)',
        interactionType: 'ionic',
        subPocketName: 'COX-2 Selective Sulfonamide Side Pocket',
        pharmacophoreGroupId: 'ptgs2_sulfonamide_warhead',
        colorAccent: '#ef4444',
        clinicalImpact: 'Forms ionic/H-bond interactions with the sulfonamide oxygens inside the COX-2 specific side pocket; absent in COX-1 (His513).',
      },
      {
        resi: 385,
        resn: 'TYR',
        chain: 'A',
        label: 'Tyr385 (Catalytic Radical)',
        interactionType: 'hydrogen-bond',
        subPocketName: 'Cyclooxygenase Catalytic Apex Channel',
        pharmacophoreGroupId: 'ptgs2_pyrazole_core',
        colorAccent: '#3b82f6',
        clinicalImpact: 'Catalytic site where tyrosyl radical initiates arachidonate cyclooxygenation; blocked stereochemically by diarylpyrazole insertion.',
      },
    ],
  },
  {
    targetGeneSymbol: 'DHFR',
    pdbId: '1U72',
    drugName: 'Methotrexate',
    ligandCode: 'MTX',
    pharmacophoreGroups: [
      {
        id: 'dhfr_pteridine_ring',
        name: '2,4-Diaminopteridine Heterocyclic Core',
        chemicalFormula: 'C6H5N6',
        atomNames: ['N1', 'C2', 'N2', 'N3', 'C4', 'N4', 'C4A', 'N5', 'C6', 'C7', 'C8A', 'N8'],
        colorAccent: '#ef4444',
        pharmacokinetics: {
          absorption: 'Dose-dependent oral absorption: well absorbed at low antimetabolite/anti-inflammatory doses (<=25 mg/m2), but saturable and incomplete at high oncologic doses.',
          metabolism: 'Minor hepatic metabolism by aldehyde oxidase to 7-hydroxymethotrexate, which possesses 200-fold lower DHFR affinity but can precipitate in renal tubules.',
          prodrugRole: 'Administered in active form; basic diaminopteridine has higher pKa (5.7) than natural folate (2.4), protonating N1 upon binding.',
          halfLifeAndClearance: 'Initial t1/2 ~2-3 hours, terminal phase 8-10 hours; cleared predominantly (>80-90%) by renal glomerular filtration and active proximal tubular secretion.',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Binds in an inverted orientation relative to dihydrofolate substrate; protonated N1 and 2-amino group form a reinforced ionic/bidentate H-bond network with Asp27.',
          physiologicEffect: 'Sub-nanomolar competitive inhibition of DHFR shuts down tetrahydrofolate regeneration, halting thymidylate (dTMP) and de novo purine nucleotide synthesis, arresting DNA replication in S-phase.',
          adverseEffectRisks: 'Severe bone marrow suppression (leukopenia, thrombocytopenia), mucosal ulcerations (stomatitis), and acute renal tubular necrosis from crystalline precipitation at high doses.',
        },
      },
      {
        id: 'dhfr_glutamate_tail',
        name: 'L-Glutamate Cellular Trapping Tail',
        chemicalFormula: '-NH-CH(COOH)-(CH2)2-COOH',
        atomNames: ['C15', 'C16', 'O1', 'O2', 'C17', 'C18', 'C19', 'O3', 'O4'],
        colorAccent: '#3b82f6',
        pharmacokinetics: {
          absorption: 'Charged dicarboxylate prevents passive diffusion; uptake into malignant and immune cells depends on the Reduced Folate Carrier 1 (RFC-1 / SLC19A1).',
          metabolism: 'Intracellularly conjugated with up to 5 additional glutamate residues by Folylpolyglutamate Synthetase (FPGS).',
          prodrugRole: 'Polyglutamylation converts MTX into high-molecular-weight polyglutamate forms that cannot cross cellular efflux pumps.',
          halfLifeAndClearance: 'Methotrexate polyglutamates persist in intracellular compartments of target tissues for weeks to months, driving prolonged therapeutic activity in rheumatoid arthritis.',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Alpha- and gamma-carboxylates form extensive ionic salt bridges with Arg70 and Arg32 in the solvent-exposed basic groove.',
          physiologicEffect: 'Polyglutamylated derivatives also inhibit other key folate enzymes including thymidylate synthase (TYMS) and AICAR transformylase, increasing anti-inflammatory adenosine release.',
          adverseEffectRisks: 'Chronic low-dose therapy causes cumulative hepatotoxicity and pulmonary fibrosis; high-dose oncology regimens require urinary alkalinization and Leucovorin (folinic acid) rescue.',
        },
      },
      {
        id: 'dhfr_paba_linker',
        name: 'p-Aminobenzoic Acid (PABA) Linking Spacer',
        chemicalFormula: '-C6H4-CO-N(CH3)-',
        atomNames: ['C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'N9', 'C20'],
        colorAccent: '#10b981',
        pharmacokinetics: {
          absorption: 'N10-methyl modification confers stability against enzymatic folyl-cleavage.',
          metabolism: 'Resistant to bacterial and mammalian peptide hydrolytic enzymes.',
          prodrugRole: 'Maintains optimal 12-angstrom distance between the pteridine anchor and glutamate tail.',
          halfLifeAndClearance: 'Excretion impaired by competitive inhibitors of organic anion transporters (OAT1/OAT3) such as NSAIDs, penicillin, and probenecid.',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Packs into the narrow hydrophobic channel formed by Leu28, Phe31, and Ile60, sandwiching the aromatic ring.',
          physiologicEffect: 'Imparts 1,000-fold higher binding affinity for human DHFR compared to natural dihydrofolic acid substrate.',
          adverseEffectRisks: 'Severe toxic methotrexate retention when co-administered with NSAIDs due to renal OAT transporter competition.',
        },
      },
    ],
    keyPocketResidues: [
      {
        resi: 27,
        resn: 'ASP',
        chain: 'A',
        label: 'Asp27 (Conserved Catalytic Acid)',
        interactionType: 'ionic',
        subPocketName: 'Deep Pteridine Catalytic Pocket',
        pharmacophoreGroupId: 'dhfr_pteridine_ring',
        colorAccent: '#ef4444',
        clinicalImpact: 'Forms critical bidentate salt bridge and hydrogen bond with protonated N1 and 2-amino group of methotrexate; essential for picomolar inhibitor affinity.',
      },
      {
        resi: 70,
        resn: 'ARG',
        chain: 'A',
        label: 'Arg70 (Solvent Groove)',
        interactionType: 'ionic',
        subPocketName: 'Basic Glutamate Solvent Groove Pocket',
        pharmacophoreGroupId: 'dhfr_glutamate_tail',
        colorAccent: '#3b82f6',
        clinicalImpact: 'Forms ionic salt bridges with the gamma-carboxylate of the glutamate tail; required for initial drug alignment and folylpolyglutamate retention.',
      },
      {
        resi: 31,
        resn: 'PHE',
        chain: 'A',
        label: 'Phe31 (Substrate Channel)',
        interactionType: 'pi-stacking',
        subPocketName: 'Central PABA Hydrophobic Channel',
        pharmacophoreGroupId: 'dhfr_paba_linker',
        colorAccent: '#10b981',
        clinicalImpact: 'Provides pi-pi stacking interactions with the central benzoyl ring, stabilizing the flipped orientation unique to antifolates.',
      },
    ],
  },
  {
    targetGeneSymbol: 'EGFR',
    pdbId: '1M17',
    drugName: 'Erlotinib',
    ligandCode: 'AQ4',
    pharmacophoreGroups: [
      {
        id: 'egfr_quinazoline_core',
        name: '4-Anilinoquinazoline ATP-Competitive Core',
        chemicalFormula: 'C8H5N2',
        atomNames: ['N1', 'C2', 'N3', 'C4', 'C4A', 'C5', 'C6', 'C7', 'C8', 'C8A'],
        colorAccent: '#ef4444',
        pharmacokinetics: {
          absorption: 'Oral bioavailability is approximately 60%, but increases to near 100% when taken with food; peak plasma concentration occurs within 4 hours.',
          metabolism: 'Extensively metabolised in the liver by CYP3A4 (~70%) and CYP1A2 (~20%) through O-demethylation and oxidation.',
          prodrugRole: 'Administered in active form; neutral aromatic heterocycle freely diffuses across tumor cell membranes to access intracellular kinase domain.',
          halfLifeAndClearance: 'Mean elimination half-life ~36 hours, supporting once-daily oral dosing; hepatic clearance (>80% excreted in feces via bile, <10% in urine).',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Binds into the ATP-binding cleft of the active EGFR tyrosine kinase domain; N1 nitrogen accepts a crucial hydrogen bond from the backbone amide NH of Met793 in the hinge region.',
          physiologicEffect: 'Competitively blocks ATP binding, preventing EGFR autophosphorylation and terminating downstream oncogenic MAPK, PI3K/Akt, and STAT cell survival signaling in EGFR-mutant non-small cell lung cancer (NSCLC).',
          adverseEffectRisks: 'Class-effect acneiform papulopustular rash (>80% of patients) and severe diarrhea due to inhibition of physiological EGFR in basal epidermal keratinocytes and intestinal mucosa.',
        },
      },
      {
        id: 'egfr_aniline_ethynyl',
        name: '3-Ethynylaniline Hydrophobic Back-Pocket Cap',
        chemicalFormula: '-NH-C6H4-C#CH',
        atomNames: ['N4', 'C1B', 'C2B', 'C3B', 'C4B', 'C5B', 'C6B', 'C7B', 'C8B'],
        colorAccent: '#3b82f6',
        pharmacokinetics: {
          absorption: 'Enhances overall lipophilicity (LogP ~2.7) and intracellular accumulation.',
          metabolism: 'Terminal ethynyl moiety can undergo minor metabolic oxidation to ketene intermediate, but parent compound remains predominant.',
          prodrugRole: 'In 3rd-generation cousins like osimertinib, this position is adapted to an acrylamide warhead that covalently reacts with Cys797.',
          halfLifeAndClearance: 'Cigarette smoking induces CYP1A2 and CYP3A4, increasing erlotinib clearance by 100% and necessitating doubling of clinical dosage.',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Projects into the deep hydrophobic back pocket adjacent to the gatekeeper residue Thr790, forming van der Waals contacts with Leu718, Val726, and Lys745.',
          physiologicEffect: 'Imparts exquisite selectivity for EGFR over serine/threonine kinases; high clinical response in activating mutations (exon 19 deletions, L858R).',
          adverseEffectRisks: 'Acquisition of the bulky gatekeeper T790M mutation sterically clashes with the back-pocket headgroup, causing secondary clinical drug resistance.',
        },
      },
      {
        id: 'egfr_bis_methoxyethoxy',
        name: 'Bis(2-Methoxyethoxy) Solubilizing Wings',
        chemicalFormula: '-(OCH2CH2OCH3)2',
        atomNames: ['O6', 'C6A', 'C6B', 'O6A', 'C6C', 'O7', 'C7A', 'C7B', 'O7A', 'C7C'],
        colorAccent: '#10b981',
        pharmacokinetics: {
          absorption: 'Dual ether chains confer optimal aqueous solubility without sacrificing oral membrane permeability.',
          metabolism: 'Primary site of CYP3A4/CYP1A2 O-dealkylation to active monodemethylated metabolites OSI-420 and OSI-413.',
          prodrugRole: 'Substituents designed specifically to replace insoluble gefitinib morpholine ring, improving pharmacokinetic bioavailability.',
          halfLifeAndClearance: 'Decreased clearance in moderate-to-severe hepatic impairment requires monitoring of liver enzymes.',
        },
        clinicalPharmacodynamics: {
          targetBindingRole: 'Extend outward toward the solvent-accessible channel at the mouth of the ATP pocket, contacting the glycine-rich loop (P-loop).',
          physiologicEffect: 'Maintains solubility and stability in circulation while retaining sub-nanomolar kinase inhibition.',
          adverseEffectRisks: 'Rare but severe life-threatening interstitial lung disease (ILD) / pneumonitis (~1%).',
        },
      },
    ],
    keyPocketResidues: [
      {
        resi: 793,
        resn: 'MET',
        chain: 'A',
        label: 'Met793 (Kinase Hinge Backbone)',
        interactionType: 'hydrogen-bond',
        subPocketName: 'Kinase Hinge Adenine-Mimetic Sub-pocket',
        pharmacophoreGroupId: 'egfr_quinazoline_core',
        colorAccent: '#ef4444',
        clinicalImpact: 'Backbone amide NH provides key hydrogen bond to N1 of quinazoline ring, mimicking the natural adenine ring interaction of ATP.',
      },
      {
        resi: 790,
        resn: 'THR',
        chain: 'A',
        label: 'Thr790 (Gatekeeper Residue)',
        interactionType: 'hydrophobic',
        subPocketName: 'Gatekeeper Hydrophobic Back Pocket',
        pharmacophoreGroupId: 'egfr_aniline_ethynyl',
        colorAccent: '#3b82f6',
        clinicalImpact: 'Gatekeeper residue controlling access to back hydrophobic pocket; T790M mutation introduces bulky methionine side chain causing steric resistance to 1st-gen inhibitors.',
      },
      {
        resi: 797,
        resn: 'CYS',
        chain: 'A',
        label: 'Cys797 (Solvent Boundary & Covalent Target)',
        interactionType: 'hydrophobic',
        subPocketName: 'Solvent Front Cleft & Covalent Anchor',
        pharmacophoreGroupId: 'egfr_bis_methoxyethoxy',
        colorAccent: '#10b981',
        clinicalImpact: 'Located at edge of ATP cleft; non-covalent van der Waals contact for erlotinib, but forms irreversible covalent bond with 3rd-generation inhibitors (osimertinib).',
      },
    ],
  },
];

const INTERACTION_COLOR_FALLBACKS: Record<InteractionType, string> = {
  covalent: '#ef4444',
  coordination: '#ef4444',
  ionic: '#8b5cf6',
  'hydrogen-bond': '#f59e0b',
  'pi-stacking': '#3b82f6',
  hydrophobic: '#10b981',
};

/**
 * Resolves the sub-pocket accent hex color for a pocket residue contact,
 * matching its paired pharmacophore group's colorAccent or falling back to its interactionType role color.
 */
export function resolvePocketResidueColor(
  residue: KeyPocketResidueContact,
  profile?: TargetMedChemProfile
): string {
  if (residue.colorAccent && /^#[0-9a-fA-F]{6}$/.test(residue.colorAccent)) {
    return residue.colorAccent;
  }
  if (residue.pharmacophoreGroupId && profile?.pharmacophoreGroups) {
    const matchedGroup = profile.pharmacophoreGroups.find(
      (g) => g.id === residue.pharmacophoreGroupId
    );
    if (matchedGroup?.colorAccent && /^#[0-9a-fA-F]{6}$/.test(matchedGroup.colorAccent)) {
      return matchedGroup.colorAccent;
    }
  }
  return INTERACTION_COLOR_FALLBACKS[residue.interactionType] || '#10b981';
}

/**
 * Fast lookup helper for canonical medicinal chemistry targets.
 * Matches on case-insensitive gene symbol (e.g. 'P2RY12', 'ACE')
 * or PDB entry ID (e.g. '4NTJ', '1O86').
 */
export function findMedChemProfile(geneSymbolOrPdbId: string): TargetMedChemProfile | undefined {
  if (!geneSymbolOrPdbId) {
    return undefined;
  }

  const query = geneSymbolOrPdbId.trim().toUpperCase();
  if (!query) {
    return undefined;
  }

  return CANONICAL_MEDCHEM_PROFILES.find((profile) => {
    return (
      profile.targetGeneSymbol.toUpperCase() === query ||
      profile.pdbId.toUpperCase() === query
    );
  });
}

export { findCanonicalTargetForDrug } from '../utils/canonicalTargets';

